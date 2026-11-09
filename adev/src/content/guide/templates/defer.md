# 以 `@defer` 延遲載入

可延遲檢視（deferrable views），也稱為 `@defer` 區塊，能將初始呈現頁面時並非絕對必要的程式碼延遲載入，進而縮小應用程式的初始套件大小。這通常能帶來更快的初始載入，並改善 Core Web Vitals (CWV)，主要是最大內容繪製 (LCP) 與第一個位元組時間 (TTFB)。

若要使用這項功能，你可以以宣告方式將範本的一個區段包進 @defer 區塊：

```angular-html
@defer {
  <large-component />
}
```

`@defer` 區塊內任何元件、指令與管道的程式碼，都會被拆分到獨立的 JavaScript 檔案，並且只在必要時、在範本其餘部分算繪完成之後才載入。

可延遲檢視支援多種觸發條件、預先擷取選項，以及用於管理預留位置、載入與錯誤狀態的子區塊。

## 哪些相依性會被延遲？

在載入應用程式時，元件、指令、管道以及任何元件 CSS 樣式都可以被延遲。

若要讓 `@defer` 區塊內的相依性能被延遲，它們需要符合兩個條件：

1. **它們必須是獨立的。** 非獨立的相依性無法被延遲，即使位在 `@defer` 區塊內，仍會被預先載入。
1. **它們不能在同一個檔案的 `@defer` 區塊外被參照。** 如果它們在 `@defer` 區塊外被參照，或在 ViewChild 查詢中被參照，這些相依性就會被預先載入。

`@defer` 區塊中使用的元件、指令與管道的*傳遞性*相依性，不必嚴格要是獨立的；傳遞性相依性仍可宣告在 `NgModule` 中，並參與延遲載入。

Angular 的編譯器會為 `@defer` 區塊中使用的每個元件、指令與管道，產生一個[動態匯入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)陳述式。區塊的主要內容會在所有匯入都解析完成後算繪。Angular 不保證這些匯入的任何特定順序。

## 如何管理延遲載入的不同階段

`@defer` 區塊有數個子區塊，讓你能妥善處理延遲載入流程的不同階段。

### `@defer`

這是定義要延遲載入之內容區段的主要區塊。它一開始不會算繪，延遲的內容會在指定的[觸發條件](#controlling-deferred-content-loading-with-triggers)發生，或 `when` 條件達成時載入並算繪。

依預設，`@defer` 區塊會在瀏覽器狀態變為 [idle](/guide/templates/defer#idle) 時觸發。

```angular-html
@defer {
  <large-component />
}
```

### 以 `@placeholder` 顯示預留內容

依預設，延遲區塊在被觸發之前不會算繪任何內容。

`@placeholder` 是一個選擇性區塊，用來宣告在 `@defer` 區塊被觸發之前要顯示的內容。

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```

雖然是選擇性的，但某些觸發條件可能需要有 `@placeholder` 或[範本參照變數](/guide/templates/variables#template-reference-variables)才能運作。詳情請參閱[觸發條件](#controlling-deferred-content-loading-with-triggers)一節。

載入完成後，Angular 會以主要內容取代預留內容。你可以在預留區段中使用任何內容，包括純 HTML、元件、指令與管道。請記住，預留區塊的*相依性會被預先載入*。

`@placeholder` 區塊接受一個選擇性參數，用來指定在預留內容初始算繪後，這個預留內容應顯示的 `minimum`（最短）時間。

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

這個 `minimum` 參數以毫秒 (ms) 或秒 (s) 的時間增量指定。你可以使用這個參數，在延遲相依性被快速取得的情況下，避免預留內容快速閃爍。

### 以 `@loading` 顯示載入中內容

`@loading` 區塊是一個選擇性區塊，讓你宣告在延遲相依性載入期間要顯示的內容。一旦載入被觸發，它會取代 `@placeholder` 區塊。

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}
```

它的相依性會被預先載入（與 `@placeholder` 類似）。

`@loading` 區塊接受兩個選擇性參數，協助避免在延遲相依性被快速取得時可能發生的內容快速閃爍：

- `minimum`：這個預留內容應顯示的最短時間
- `after`：載入開始後，要等多久才顯示載入範本

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

這兩個參數都以毫秒 (ms) 或秒 (s) 的時間增量指定。此外，這兩個參數的計時器都會在載入被觸發後立即開始計時。

### 以 `@error` 在延遲載入失敗時顯示錯誤狀態

`@error` 區塊是一個選擇性區塊，在延遲載入失敗時顯示。與 `@placeholder` 和 `@loading` 類似，@error 區塊的相依性會被預先載入。

```angular-html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## 以觸發條件控制延遲內容的載入 {#controlling-deferred-content-loading-with-triggers}

你可以指定**觸發條件**，控制 Angular 何時載入並顯示延遲內容。

當 `@defer` 區塊被觸發時，它會以延遲載入的內容取代預留內容。

你可以以分號 `;` 分隔來定義多個事件觸發條件，它們會以 OR 條件評估。

觸發條件有兩種類型：`on` 與 `when`。

### `on`

`on` 指定 `@defer` 區塊被觸發的條件。

可用的觸發條件如下：

| 觸發條件                      | 說明                                                           |
| ----------------------------- | -------------------------------------------------------------- |
| [`idle`](#idle)               | 在瀏覽器閒置時觸發。支援選擇性的逾時。                         |
| [`viewport`](#viewport)       | 在指定內容進入可視區域時觸發                                   |
| [`interaction`](#interaction) | 在使用者與指定元素互動時觸發                                   |
| [`hover`](#hover)             | 在滑鼠懸停於指定區域時觸發                                     |
| [`immediate`](#immediate)     | 在非延遲內容算繪完成後立即觸發                                 |
| [`timer`](#timer)             | 在特定持續時間後觸發                                           |

#### `idle` {#idle}

`idle` 觸發條件會在瀏覽器達到閒置狀態時（以 requestIdleCallback 為依據）載入延遲內容。這是延遲區塊的預設行為。

你也可以選擇指定一個以毫秒為單位的逾時，傳給 [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)。如果瀏覽器沒有及時排程該回呼，這項工作最遲會在指定的逾時時間執行。

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- With a 500ms timeout -->
@defer (on idle(500)) {
  <large-cmp />
}
```

##### 自訂 `idle` 行為 {#customizing-idle-behavior}

你可以提供你自己的 `IdleService` 實作，並以 `provideIdleServiceWith` 在你的應用程式 providers 中註冊，來自訂 `idle` 觸發條件。

```ts
@Service()
class CustomIdleService implements IdleService {
  requestOnIdle(callback: (deadline?: IdleDeadline) => void, options?: IdleRequestOptions): number {
    // Custom idle scheduling logic can be implemented here.
    return requestIdleCallback(callback, options);
  }

  cancelOnIdle(id: number) {
    // Implement custom idle cancellation here.
  }
}

bootstrapApplication(App, {
  providers: [provideIdleServiceWith(CustomIdleService)],
});
```

#### `viewport` {#viewport}

`viewport` 觸發條件會在指定內容進入可視區域時，使用 [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) 載入延遲內容。被觀察的內容可以是 `@placeholder` 內容，或明確的元素參照。

依預設，`@defer` 會監看預留內容進入可視區域。以此方式使用的預留內容必須具有單一根元素。

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

或者，你可以在與 `@defer` 區塊相同的範本中指定一個[範本參照變數](/guide/templates/variables)，作為要監看其進入可視區域的元素。這個變數會作為參數傳給 viewport 觸發條件。

```angular-html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

如果你想自訂 `IntersectionObserver` 的選項，`viewport` 觸發條件支援傳入物件字面值。這個字面值支援 `IntersectionObserver` 第二個參數的所有屬性，但 `root` 除外。使用物件字面值表示法時，你必須透過 `trigger` 屬性傳入你的觸發條件。

```angular-html
<div #greeting>Hello!</div>

<!-- With options and a trigger -->
@defer (
  on viewport({trigger: greeting, rootMargin: '100px', scrollMargin: '50px', threshold: 0.5})
) {
  <greetings-cmp />
}

<!-- With options and an implied trigger -->
@defer (on viewport({rootMargin: '100px', scrollMargin: '50px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Implied trigger</div>
}
```

#### `interaction` {#interaction}

`interaction` 觸發條件會在使用者透過 `click` 或 `keydown` 事件與指定元素互動時，載入延遲內容。

依預設，預留內容會作為互動元素。以此方式使用的預留內容必須具有單一根元素。

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

或者，你可以在與 `@defer` 區塊相同的範本中指定一個[範本參照變數](/guide/templates/variables)，作為要監看互動的元素。這個變數會作為參數傳給 interaction 觸發條件。

```angular-html
<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover` {#hover}

`hover` 觸發條件會在滑鼠透過 `mouseover` 與 `focusin` 事件懸停於觸發區域時，載入延遲內容。

依預設，預留內容會作為互動元素。以此方式使用的預留內容必須具有單一根元素。

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

或者，你可以在與 `@defer` 區塊相同的範本中指定一個[範本參照變數](/guide/templates/variables)，作為要監看懸停的元素。這個變數會作為參數傳給 hover 觸發條件。

```angular-html
<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate` {#immediate}

`immediate` 觸發條件會立即載入延遲內容。這意味著延遲區塊會在所有其他非延遲內容算繪完成後，隨即載入。

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `timer` {#timer}

`timer` 觸發條件會在指定的持續時間後載入延遲內容。

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

持續時間參數必須以毫秒 (`ms`) 或秒 (`s`) 指定。

### `when`

`when` 觸發條件接受自訂的條件運算式，並在條件變為 truthy 時載入延遲內容。

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

這是一次性的操作：`@defer` 區塊在條件變為 truthy 之後，即使條件再變為 falsy 值，也不會回復到預留內容。

## 以 `prefetch` 預先擷取資料

除了指定決定延遲內容何時顯示的條件外，你也可以選擇指定**預先擷取觸發條件**。這個觸發條件讓你能在延遲內容顯示之前，就先載入與 `@defer` 區塊相關聯的 JavaScript。

預先擷取能實現更進階的行為，例如讓你在使用者實際看見延遲區塊或與之互動之前、但可能即將與之互動時，就開始預先擷取資源，讓資源能更快就緒。

你可以比照區塊的主要觸發條件來指定預先擷取觸發條件，但要加上 `prefetch` 關鍵字作為前綴。區塊的主要觸發條件與預先擷取觸發條件以分號字元 (`;`) 分隔。

在下列範例中，預先擷取會在瀏覽器變為閒置時開始，而區塊的內容只在使用者與預留內容互動後才算繪。

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- Prefetching with a 500ms idle timeout -->
@defer (on interaction; prefetch on idle(500)) {
  <large-cmp />
}
```

## 測試 `@defer` 區塊

Angular 提供 TestBed API，簡化測試 `@defer` 區塊與在測試期間觸發不同狀態的流程。依預設，測試中的 `@defer` 區塊會如同延遲區塊在真實應用程式中的行為一樣播放。如果你想手動逐步切換狀態，可以在 TestBed 設定中將延遲區塊行為切換為 `Manual`。

```angular-ts
it('should render a defer block in different states', async () => {
  // configures the defer block behavior to start in "paused" state for manual control.
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});
  @Component({
    // ...
    template: `
      @defer {
        <large-component />
      } @placeholder {
        Placeholder
      } @loading {
        Loading...
      }
    `,
  })
  class ExampleA {}
  // Create component fixture.
  const componentFixture = TestBed.createComponent(ExampleA);
  // Retrieve the list of all defer block fixtures and get the first block.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Renders placeholder state by default.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Render loading state and verify rendered output.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Render final state and verify the output.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## `@defer` 能與 `NgModule` 搭配使用嗎？

`@defer` 區塊與獨立元件以及基於 NgModule 的元件、指令與管道都相容。然而，**只有獨立元件、指令與管道能被延遲**。基於 NgModule 的相依性不會被延遲，而是包含在預先載入的套件中。

## `@defer` 區塊與熱模組重載 (HMR) 的相容性

當熱模組置換 (HMR) 啟用時，所有 `@defer` 區塊的區塊檔案都會被預先取得，覆寫任何已設定的觸發條件。若要恢復標準的觸發條件行為，你必須以 `--no-hmr` 旗標提供你的應用程式，以停用 HMR。

## `@defer` 如何與伺服器端算繪 (SSR) 和靜態網站產生 (SSG) 搭配運作？

依預設，在伺服器上算繪應用程式時（使用 SSR 或 SSG 皆然），延遲區塊永遠算繪其 `@placeholder`（如果未指定預留內容，則什麼都不算繪），且觸發條件不會被叫用。在用戶端，`@placeholder` 的內容會進行水合，觸發條件則會被啟用。

若要在伺服器上（SSR 與 SSG 皆然）算繪 `@defer` 區塊的主要內容，你可以啟用[漸進式水合功能](/guide/incremental-hydration)，並為必要的區塊設定 `hydrate` 觸發條件。

## Barrel 檔案與延遲區塊檔案

如果你使用了 `@defer`，卻在建置輸出中沒有看到獨立的延遲區塊檔案，請檢查你匯入被延遲元件的方式。透過 barrel 檔案 (`index.ts`) 匯入是常見的元兇：打包工具會將 barrel 視為單一模組，將它的所有匯出保持在一起，因此無論 `@defer` 如何設定，你的元件最終都會進入主要套件。

```typescript {header: "index.ts"}
export {HeavyComponent} from './heavy.component';
export {OtherComponent} from './other.component';
```

```typescript {header: "parent.component.ts"}
import {Component} from '@angular/core';
import {HeavyComponent} from './index'; // pulls in OtherComponent too

@Component({
  imports: [HeavyComponent],
  template: `@defer {
    <heavy-component />
  }`,
})
export class ParentComponent {}
```

修正方法很直接：直接從元件自己的檔案匯入：

```typescript
import {HeavyComponent} from './heavy.component';
```

這樣就足以讓打包工具將它拆分到自己的區塊檔案，並在觸發條件發生時延遲載入它。

## 延遲檢視的最佳實務

### 避免以巢狀 `@defer` 區塊造成串聯載入

當你有巢狀的 `@defer` 區塊時，它們應該使用不同的觸發條件，以避免同時載入，造成串聯請求，並可能對頁面載入效能產生負面影響。

### 避免版面位移

避免延遲在初始載入時位於使用者可視區域內的元件。這樣做可能會增加累計版面位移 (CLS)，對 Core Web Vitals 產生負面影響。

萬一有此必要，請避免使用會導致內容在初始頁面算繪期間載入的 `immediate`、`timer`、`viewport` 與自訂 `when` 觸發條件。

### 將無障礙納入考量 {#keep-accessibility-in-mind}

使用 `@defer` 區塊時，請考量對使用螢幕閱讀器等輔助技術的使用者的影響。
聚焦於延遲區段的螢幕閱讀器一開始會讀出預留或載入中內容，但在延遲內容載入時可能不會宣告變更。

若要確保延遲內容的變更會向螢幕閱讀器宣告，你可以將 `@defer` 區塊包在帶有 live region 的元素中：

```angular-html
<div aria-live="polite" aria-atomic="true">
  @defer (on timer(2000)) {
    <user-profile [user]="currentUser" />
  } @placeholder {
    Loading user profile...
  } @loading {
    Please wait...
  } @error {
    Failed to load profile
  }
</div>
```

這能確保在轉換（預留內容 &rarr; 載入中 &rarr; 內容/錯誤）發生時，變更會向使用者宣告。
