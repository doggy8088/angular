# 可延遲檢視

## 總覽 {#overview}

可延遲檢視可以用在元件範本中，延遲載入該範本內選定的相依性。這些相依性包括元件、指令與管道，以及任何相關的 CSS。若要使用這項功能，你可以以宣告方式將範本的一個區段包進 `@defer` 區塊，並在其中指定載入條件。

可延遲檢視支援一系列[觸發條件](guide/defer#triggers)、[預先擷取](guide/defer#prefetching)，以及數個用於管理[預留](guide/defer#placeholder)、[載入](guide/defer#loading)與[錯誤](guide/defer#error)狀態的子區塊。你也可以用 [`when`](guide/defer#when) 與 [`prefetch when`](guide/defer#prefetching) 建立自訂條件。

```angular-html
@defer {
  <large-component />
}
```

## 為什麼要使用可延遲檢視？ {#why-use-deferrable-views}

可延遲檢視，也稱為 `@defer` 區塊，是一個強大的工具，可以用來縮小應用程式的初始套件大小，或延遲那些可能要到之後才會載入的重型元件。這應該能帶來更快的初始載入，並改善你的 Core Web Vitals (CWV) 結果。將部分元件延遲到之後載入，應該能特別改善最大內容繪製 (LCP) 與第一個位元組時間 (TTFB)。

Note: 強烈建議任何在相依性載入完成後可能造成版面位移的延遲載入元件，都應位於摺疊線以下，或是使用者尚未能看見的位置。

## 哪些相依性可以延遲載入？ {#which-dependencies-are-defer-loadable}

若要讓 `@defer` 區塊內的相依性能被延遲，它們需要符合兩個條件：

1. 它們必須是獨立的。非獨立的相依性無法被延遲，即使在 `@defer` 區塊內，仍會被預先載入。

2. 它們不能在同一個檔案中、於 `@defer` 區塊之外被直接參照；這包括 ViewChild 查詢。

`@defer` 區塊中使用的元件、指令與管道的傳遞性相依性，可以是獨立的或以 NgModule 為基礎的，並且仍會被延遲。

## 區塊 {#blocks}

`@defer` 區塊有數個子區塊，讓你能妥善處理延遲載入流程的不同階段。

### `@defer`

主要 `@defer` 區塊的內容，就是要被延遲載入的內容區段。它一開始不會算繪，所有內容會在指定的[觸發條件](guide/defer#triggers)或 `when` 條件達成、且相依性已擷取完成後出現。依預設，`@defer` 區塊會在瀏覽器狀態變為[閒置](guide/defer#on-idle)時觸發。

### `@placeholder`

依預設，延遲區塊在被觸發之前不會算繪任何內容。`@placeholder` 是一個可選的區塊，用來宣告在延遲區塊被觸發之前要顯示的內容。這個預留內容會在載入完成後被主要內容取代。你可以在預留區段中使用任何內容，包括純 HTML、元件、指令與管道；不過請記住，預留區塊的相依性會被預先載入。

Note: 為了最佳的使用者體驗，你應該永遠指定一個 `@placeholder` 區塊。

`@placeholder` 區塊接受一個可選參數，用來指定這個預留內容至少應顯示的 `minimum` 時間。這個 `minimum` 參數以毫秒 (ms) 或秒 (s) 的時間增量指定。這個參數的存在，是為了在延遲相依性很快就擷取完成時，避免預留內容快速閃爍。`@placeholder` 區塊的 `minimum` 計時器，會在這個 `@placeholder` 區塊的初始算繪完成後開始。

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

Note: 某些觸發條件可能需要有 `@placeholder` 或[範本參照變數](guide/templates/variables#template-reference-variables)才能運作。詳情請參閱[觸發條件](guide/defer#triggers)一節。

### `@loading`

`@loading` 區塊是一個可選的區塊，讓你宣告在任何延遲相依性載入期間要顯示的內容。它的相依性會被預先載入（與 `@placeholder` 類似）。

例如，你可以顯示一個載入旋轉圖示。一旦載入被觸發，`@loading` 區塊就會取代 `@placeholder` 區塊。

`@loading` 區塊接受兩個可選參數，用來指定這個預留內容至少應顯示的 `minimum` 時間，以及載入開始後要等候多久 (`after`) 才顯示載入範本。`minimum` 與 `after` 參數以毫秒 (ms) 或秒 (s) 的時間增量指定。與 `@placeholder` 一樣，這些參數的存在，是為了在延遲相依性很快就擷取完成時，避免內容快速閃爍。`@loading` 區塊的 `minimum` 與 `after` 計時器，都會在載入被觸發後立即開始。

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

### `@error`

`@error` 區塊讓你宣告在延遲載入失敗時要顯示的內容。與 `@placeholder` 和 `@loading` 類似，`@error` 區塊的相依性會被預先載入。`@error` 區塊是可選的。

```angular-html
@defer {
  <calendar-cmp />
} @error {
  <p>Failed to load the calendar</p>
}
```

## 觸發條件 {#triggers}

當 `@defer` 區塊被觸發時，它會以延遲載入的內容取代預留內容。設定何時觸發這項置換有兩個選項：`on` 與 `when`。

<a id="on"></a>
`on` 使用下方可用觸發條件清單中的觸發條件來指定觸發條件。例如在互動時或在可視區域內時。

可以一次定義多個事件觸發條件。例如：`on interaction; on timer(5s)` 表示如果使用者與預留內容互動，或在 5 秒後，延遲區塊就會被觸發。

Note: 多個 `on` 觸發條件永遠是 OR 條件。同樣地，`on` 與 `when` 條件混合時也是 OR 條件。

```angular-html
@defer (on viewport; on timer(5s)) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

<a id="when"></a>
`when` 以一個傳回布林值的運算式指定條件。當這個運算式變為真值時，預留內容會被置換為延遲載入的內容（如果相依性需要擷取，這可能是一個非同步操作）。

Note: 如果 `when` 條件切換回 `false`，延遲區塊不會還原回預留內容。這項置換是一次性的操作。如果區塊內的內容應該以條件方式算繪，可以在區塊本身內部使用 `if` 條件。

```angular-html
@defer (when cond) {
  <calendar-cmp />
}
```

你也可以在一個陳述式中同時使用 `when` 與 `on`，只要任一條件達成，就會觸發置換。

```angular-html
@defer (on viewport; when cond) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

### on idle

`idle` 會在瀏覽器達到閒置狀態時觸發延遲載入（在幕後使用 `requestIdleCallback` API 偵測）。這是延遲區塊的預設行為。

### on viewport

`viewport` 會在指定內容使用 [`IntersectionObserver` API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) 進入可視區域時觸發延遲區塊。可以是預留內容或一個元素參照。

依預設，只要預留內容是單一根元素節點，它就會作為被監視是否進入可視區域的元素。

```angular-html
@defer (on viewport) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

或者，你可以指定與 `@defer` 區塊同一個範本中的[範本參照變數](guide/templates/variables#template-reference-variables)，作為被監視是否進入可視區域的元素。這個變數會作為參數傳入 viewport 觸發條件。

```angular-html
<div #greeting>Hello!</div>

@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

### on interaction

`interaction` 會在使用者透過 `click` 或 `keydown` 事件與指定元素互動時觸發延遲區塊。

依預設，只要預留內容是單一根元素節點，它就會作為互動元素。

```angular-html
@defer (on interaction) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

或者，你可以指定一個[範本參照變數](guide/templates/variables#template-reference-variables)作為觸發互動的元素。這個變數會作為參數傳入 interaction 觸發條件。

```angular-html
<button type="button" #greeting>Hello!</button>

@defer (on interaction(greeting)) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

### on hover

`hover` 會在滑鼠懸停在觸發區域上方時觸發延遲載入。用於此目的的事件是 `mouseenter` 與 `focusin`。

依預設，只要預留內容是單一根元素節點，它就會作為懸停元素。

```angular-html
@defer (on hover) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

或者，你可以指定一個[範本參照變數](guide/templates/variables#template-reference-variables)作為懸停元素。這個變數會作為參數傳入 hover 觸發條件。

```angular-html
<div #greeting>Hello!</div>

@defer (on hover(greeting)) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

### on immediate

`immediate` 會立即觸發延遲載入，也就是說，一旦用戶端完成算繪，延遲區塊就會立刻開始擷取。

```angular-html
@defer (on immediate) {
  <calendar-cmp />
} @placeholder {
  <div>Calendar placeholder</div>
}
```

### on timer

`timer(x)` 會在指定的持續時間後觸發。持續時間是必填的，可以用 `ms` 或 `s` 指定。

```angular-html
@defer (on timer(500ms)) {
  <calendar-cmp />
}
```

## 預先擷取 {#prefetching}

`@defer` 允許指定何時應觸發相依性預先擷取的條件。你可以使用特殊的 `prefetch` 關鍵字。`prefetch` 的語法與主要延遲條件類似，接受 `when` 與/或 `on` 來宣告觸發條件。

在這種情況下，與延遲相關的 `when` 和 `on` 控制何時算繪，而 `prefetch when` 與 `prefetch on` 控制何時擷取資源。這能實現更進階的行為，例如讓你在使用者實際看見延遲區塊或與之互動之前、但可能很快就會與之互動時，就開始預先擷取資源，讓資源能更快備妥。

在以下範例中，預先擷取會在瀏覽器變為閒置時開始，而區塊的內容會在互動時算繪。

```angular-html
@defer (on interaction; prefetch on idle) {
  <calendar-cmp />
} @placeholder {
  <img src="placeholder.png" />
}
```

## 測試 {#testing}

Angular 提供 TestBed API，簡化測試 `@defer` 區塊與在測試期間觸發不同狀態的流程。依預設，測試中的 `@defer` 區塊會像在真實應用程式中一樣依序播放。如果你想手動逐步切換狀態，可以在 TestBed 設定中將延遲區塊行為切換為 `Manual`。

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

## 與伺服器端算繪 (SSR) 和靜態網站產生 (SSG) 搭配的行為 {#behavior-with-server-side-rendering-ssr-and-static-site-generation-ssg}

在伺服器上算繪應用程式時（使用 SSR 或 SSG），延遲區塊永遠算繪它們的 `@placeholder`（如果沒有指定預留內容，則什麼都不算繪）。觸發條件在伺服器上會被忽略。

## 與 `NgModule` 搭配的行為 {#behavior-with-ngmodule}

`@defer` 區塊可以用在獨立的與以 NgModule 為基礎的元件、指令與管道中。你可以在 `@defer` 區塊內使用獨立的與以 NgModule 為基礎的相依性，不過只有**獨立的元件、指令與管道**可以被延遲。以 NgModule 為基礎的相依性會被納入預先載入的套件中。

## 巢狀 `@defer` 區塊與避免串聯載入 {#nested-defer-blocks-and-avoiding-cascading-loads}

在某些情況下，巢狀使用多個 `@defer` 區塊可能造成串聯請求。例如，一個帶有 immediate 觸發條件的 `@defer` 區塊，內部巢狀著另一個帶有 immediate 觸發條件的 `@defer` 區塊。當你有巢狀的 `@defer` 區塊時，請確保內層區塊使用不同的條件組合，讓它們不會在同一時間觸發，造成串聯請求。

## 避免版面位移 {#avoiding-layout-shifts}

建議的最佳實務是，不要延遲那些在初始載入時會出現在使用者可視區域內的元件。這會造成累積版面位移 (CLS) 增加，對 Core Web Vitals 產生負面影響。如果你選擇延遲這個區域內的元件，最好避免使用會導致內容在頁面初始算繪期間載入的 `immediate`、`timer`、`viewport` 與自訂 `when` 條件。
