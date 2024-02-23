# 可延遲檢視

## 概述

延遲檢視可於元件範本中使用，以延遲載入該範本內的選取相依性。這些相依性包含元件、指令和管道，以及任何關聯的 CSS。如要使用此功能，您可以宣告性地將範本的區段包覆在 `@defer` 區塊中，並指定載入條件。

可延遲檢視支援一系列 [觸發器](guide/defer#triggers)、[預先擷取](guide/defer#prefetching)，以及多個用於 [預留位置](guide/defer#placeholder)、[載入](guide/defer#loading) 和 [錯誤](guide/defer#error) 狀態管理的子區塊。您也可以使用 [`when`](guide/defer#when) 和 [`prefetch when`](guide/defer#prefetching) 建立自訂條件。

```html
@defer {
  <large-component />
}
```

## 為什麼要使用 Deferrable Views?

可延遲檢視，又稱為 `@defer` 區塊，是一種強大的工具，可用於減少應用程式的初始組合大小或延遲可能永遠不會載入到較晚時間的負載元件。這應會導致更快速的初始載入和改善您的核心網路生命週期 (CWV) 結果。延遲某些元件到稍後時間應特別改善最大內容繪製 (LCP) 和首次位元組時間 (TTFB)。

注意：強烈建議任何可能會在載入相依項後導致版面變動的延遲載入元件都放在摺疊下方或其他使用者尚未看到的地方。

## 哪些依賴項是可延遲載入的？

要讓 `@defer` 區塊內的相依性被遞延，它們需要符合兩個條件：

1. 它們必須是獨立的。非獨立的依賴項無法遞延，即使在 `@defer` 區塊中，仍會急切載入。

2. 它們不能在 `@defer` 區塊外，直接從同一個檔案被參照；這包括 ViewChild 查詢。

在 defer 區塊中使用的元件、指令和管道的遞移性依賴項可以是獨立的或基於 NgModule，並且仍會被延遲。

## 區塊

`@defer` 區塊有多個子區塊，讓您能夠優雅地處理延遲載入過程中的不同階段。

### `@defer`

主 `@defer` 區塊的內容是延遲載入的內容區段。它不會一開始就呈現，並且所有內容將在指定的 [觸發器](guide/defer#triggers) 或 `when` 條件符合且已擷取相依項之後才會顯示。預設情況下，當瀏覽器狀態變為 [閒置](guide/defer#on-idle) 時，會觸發 `@defer` 區塊。

### `@placeholder`

預設情況下，defer 區塊在觸發前不會呈現任何內容。`@placeholder` 是個選擇性區塊，用於宣告在 defer 區塊觸發前要顯示的內容。這個 placeholder 內容會在載入完成後由主要內容取代。您可以在 placeholder 區段中使用任何內容，包括純 HTML、元件、指令和管道；但請記住，placeholder 區塊的相依項會優先載入。

注意：為了獲得最佳使用者體驗，您應該總是指定一個 `@placeholder` 區塊。

`@placeholder` 區塊接受一個選用參數，以指定此位置保留項應顯示的「最短」時間。此「最短」參數以毫秒數 (ms) 或秒數 (s) 為時間增量來指定。此參數存在是為了防止在快速擷取延遲的依存項時，位置保留項內容快速閃爍。`@placeholder` 區塊的「最短」計時器在完成此 `@placeholder` 區塊的初始呈現後開始。

```html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

注意：某些觸發器可能需要 `@placeholder` 或 [範本參考變數](guide/templates/reference-variables) 才能運作。請參閱 [觸發器](guide/defer#triggers) 部分以取得更多詳細資訊。

### `@loading``

`@loading` 區塊是一個可選區塊，允許您宣告在任何延遲依賴項載入期間要顯示的內容。例如，您可以顯示一個載入指示器。類似於 `@placeholder`，`@loading` 區塊的依賴項會優先載入。

`@loading` 區塊接受兩個選用參數來指定這個預留位置應顯示的「最小」時間量，以及在開始載入後，等候多長時間才顯示載入範本。`minimum` 和 `after` 參數以毫秒 (ms) 或秒 (s) 為時間增量指定。就像 `@placeholder` 一樣，這些參數的存在是為了防止在快速擷取延遲的相依項時，內容快速閃爍。`@loading` 區塊的 `minimum` 和 `after` 計時器都在觸發載入後立即開始。

```html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

### `@error`

@error` 區塊允許您宣告在延遲載入失敗時要顯示的內容。類似於 `@placeholder` 和 `@loading`，`@error` 區塊的相依項會優先載入。`@error` 區塊是選用的。

```html
@defer {
  <calendar-cmp />
} @error {
  <p>Failed to load the calendar</p>
}
```

## Triggers

當觸發 `@defer` 區塊時，它會使用延遲載入的內容取代預留位置內容。有兩個選項可配置此交換觸發時機：`on` 和 `when`。

`<a id="on"></a>`
`on` 使用下列可用觸發器清單中的觸發器來指定觸發條件。範例包括互動或視窗。

可以同時定義多個事件觸發器。例如：`on interaction; on timer(5s)` 表示當使用者與佔位元件互動或經過 5 秒後，defer 區塊就會觸發。

備註：多個 `on` 觸發器始終為 OR 條件。類似地，`on` 與 `when` 條件混合使用也是 OR 條件。

```html
@defer (on viewport; on timer(5s)) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

<a id="when"></a>
`when` 指定一個條件，作為回傳布林值的表達式。當此表達式變為真時，就會以延遲載入的內容替換 placeholder（如果需要擷取相依性，這可能會是一個非同步操作）。

註解：如果 `when` 條件又切換回 `false`，則 defer 區塊不會還原回 placeholder。這個交換是單次操作。如果區塊內的內容應該有條件地呈現，可以在區塊本身內使用 `if` 條件。

```html
@defer (when cond) {
  <calendar-cmp />
}
```

您也可以在一個語句中同時使用 `when` 和 `on`，如果任一條件符合，交換就會觸發。

```html
@defer (on viewport; when cond) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

### on idle

`idle` 將在瀏覽器達到閒置狀態後觸發延遲載入（在後台使用 `requestIdleCallback` API 偵測）。這是 defer 區塊的預設行為。

### 在視窗上

`viewport` 會在指定內容使用 [`IntersectionObserver` API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 進入視窗時觸發延遲區塊。這可以是預留位置內容或元素參考。

預設情況下，只要是單一根元素節點，預留位置就會作為觀察視窗進入的元素。

```html
@defer (on viewport) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

或者，您可以與 `@defer` 區塊在同一個範本中，指定一個 [範本參考變數](guide/templates/reference-variables) 作為被監控進入視窗的元素。此變數會作為視窗觸發器上的參數傳入。

```html
<div #greeting>Hello!</div>

@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

### on interaction

`interaction` 將在使用者透過 `click` 或 `keydown` 事件與指定元素互動時觸發延遲區塊。

預設情況下，只要替位元素是單一根元素節點，它就會作為互動元素。

```html
@defer (on interaction) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

或者，您可以指定 [範本參照變數](guide/templates/reference-variables) 作為觸發互動的元素。此變數在互動觸發器上傳入為參數。

```html
<button type="button" #greeting>Hello!</button>

@defer (on interaction(greeting)) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

### 懸停時

當滑鼠懸停在觸發區域時，`hover` 會觸發延遲載入。用於此目的的事件為 `mouseenter` 和 `focusin`。

默認情況下，只要替位符是單一根元素節點，它就會充當滑鼠懸停元素。

```html
@defer (on hover) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

或者，您可以指定一個 [範本參考變數](guide/templates/reference-variables) 作為滑鼠暫留元素。此變數會在滑鼠暫留觸發器上傳入參數。

```html
<div #greeting>Hello!</div>

@defer (on hover(greeting)) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

### on immediate

`immediate` 會立即觸發延遲載入，表示一旦用戶端完成呈現，延遲區塊就會立即開始擷取。

```html
@defer (on immediate) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

### 定時

`timer(x)` 會在指定時間後觸發。時間是必需的，並且可以用 `ms` 或 `s` 指定。

```html
@defer (on timer(500ms)) {
  <calendar-cmp />
}
```

## 預先擷取

`@defer` 允許指定預先擷取相依項的觸發條件。您可以使用特殊的 `prefetch` 關鍵字。`prefetch` 語法與主要延遲條件類似，並接受 `when` 和/或 `on` 來宣告觸發器。

在這種情況下，`when` 和 `on` 與 defer 控制關聯，用於控制何時要呈現，而 `prefetch when` 和 `prefetch on` 則是用來控制何時要擷取資源。這可以支援更進階的行為，例如讓您可以在使用者實際看到或與 defer 區塊互動之前就開始預先擷取資源，但可能會在不久後與之互動，讓資源更快可用。

在下面的範例中，當瀏覽器閒置時預先擷取會開始，而且區塊的內容會在互動時呈現。

```html
@defer (on interaction; prefetch on idle) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

## 測試

Angular 提供 TestBed API 以簡化測試 `@defer` 區塊和在測試期間觸發不同狀態的流程。預設情況下，測試中的 `@defer` 區塊會像 defer 區塊在真實應用程式中的行為一樣播放。如果您想要手動逐步執行狀態，您可以在 TestBed 配置中將 defer 區塊行為切換為「手動」。

```typescript
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
    `
  })
  class ComponentA {}

  // Create component fixture.
  const componentFixture = TestBed.createComponent(ComponentA);

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

## 服務器端渲染 (SSR) 和靜態網站產生 (SSG) 的行為

當在伺服器上呈現應用程式（使用 SSR 或 SSG），遞延區塊總是會呈現其 `@placeholder`（或如果沒有指定 placeholder，則不會呈現任何內容）。觸發器在伺服器上會被忽略。

## 與 `NgModule` 的行為

@defer`區塊可以使用在獨立和基於 NgModule 的元件、指令和管道中。您可以在`@defer`區塊中使用獨立和基於 NgModule 的相依性，但是**只有獨立元件、指令和管道可以遞延**。基於 NgModule 的相依性會包含在急切載入的套件中。

## 嵌套 `@defer` 區塊和避免串聯載入

在存在多個嵌套 `@defer` 區塊的情況下，可能會造成級聯要求。一個範例是具有立即觸發器的 `@defer` 區塊，具有另一個立即觸發器的嵌套 `@defer` 區塊。當您具有嵌套 `@defer` 區塊時，請確認內部區塊具有不同的條件集合，以便它們不會在同一時間觸發，造成級聯要求。

## 避免版面位移

不要在初始載入時延遲會在使用者視窗中顯示的元件，這是推薦的最佳實務。這會導致累積佈局偏移 (CLS) 增加，進而對核心網路生命週期指標產生負面影響。如果您選擇在這個區域延遲元件，最好避免會在頁面初始渲染期間載入內容的「立即」、「計時器」、「視窗」和自訂「何時」條件。
