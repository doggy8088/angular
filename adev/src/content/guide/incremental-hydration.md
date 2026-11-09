# 漸進式水合

**漸進式水合**（incremental hydration）是一種進階的水合（hydration）方式，能讓應用程式的某些區塊保持未水合狀態，並在需要時漸進觸發這些區塊的水合。

## 為什麼要使用漸進式水合？

漸進式水合是在完整應用程式水合之上建構的效能改善。它能產生更小的初始套件，同時仍提供與完整應用程式水合相當的最終使用者體驗。更小的套件能改善初始載入時間，進而降低 [First Input Delay (FID)](https://web.dev/fid) 與 [Cumulative Layout Shift (CLS)](https://web.dev/cls)。

漸進式水合也讓你能將可延遲檢視（deferrable views，`@defer`）用在以前可能無法延遲的內容上。具體來說，你現在可以把可延遲檢視用在首屏（above the fold）的內容上。在漸進式水合出現之前，把 `@defer` 區塊放在首屏會導致佔位內容先渲染出來，然後再被 `@defer` 區塊的主要範本內容取代，進而造成版面位移。漸進式水合則表示 `@defer` 區塊的主要範本在水合時會直接渲染，不會產生版面位移。

## 如何在 Angular 中啟用漸進式水合？ {#how-do-you-enable-incremental-hydration-in-angular}

對於已經使用伺服器端渲染（SSR）與水合的應用程式，你可以啟用漸進式水合。請先依照 [Angular SSR 指南](guide/ssr) 啟用伺服器端渲染，並依照 [Angular 水合指南](guide/hydration) 啟用水合。

當你使用 `provideClientHydration()` 時，漸進式水合預設就會啟用。

```ts
import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration()],
});
```

NOTE: 漸進式水合會依賴並自動啟用[事件重播](guide/hydration#capturing-and-replaying-events)。如果你的清單中已有 `withEventReplay()`，可以放心將它移除。

若要退出漸進式水合，請使用 `withNoIncrementalHydration()`：

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withNoIncrementalHydration,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoIncrementalHydration())],
});
```

## 漸進式水合如何運作？

漸進式水合建立在完整應用程式[水合](guide/hydration)、[可延遲檢視](/guide/templates/defer)與[事件重播](guide/hydration#capturing-and-replaying-events)之上。透過漸進式水合，你可以為 `@defer` 區塊加入額外的觸發條件，來定義漸進式水合的邊界。在延遲區塊加入 `hydrate` 觸發條件，是告訴 Angular 它應該在伺服器端渲染期間載入該延遲區塊的相依性，並渲染主要範本，而不是 `@placeholder`。在用戶端渲染時，相依性仍會被延遲，且延遲區塊的內容會保持未水合狀態，直到它的 `hydrate` 觸發條件被觸發為止。該觸發條件會告訴延遲區塊去取得它的相依性並水合內容。使用者在水合之前觸發的任何瀏覽器事件（特別是與你元件中註冊的監聽器相符的事件），都會先被排入佇列，並在水合程序完成後重播。

## 以觸發條件控制內容的水合

你可以指定 **hydrate 觸發條件**（hydrate triggers），來控制 Angular 何時載入並水合延遲的內容。這些是可與一般 `@defer` 觸發條件併用的額外觸發條件。

每個 `@defer` 區塊可以有多個 hydrate 事件觸發條件，以分號（`;`）分隔。只要有任一觸發條件被觸發，Angular 就會觸發水合。

hydrate 觸發條件有三種類型：`hydrate on`、`hydrate when` 與 `hydrate never`。

### `hydrate on`

`hydrate on` 指定 `@defer` 區塊觸發水合的條件。

可用的觸發條件如下：

| 觸發條件                                             | 說明                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| [`hydrate on idle`](#hydrate-on-idle)               | 在瀏覽器閒置時觸發。支援可選的逾時設定。       |
| [`hydrate on viewport`](#hydrate-on-viewport)       | 在指定內容進入可視區域時觸發                    |
| [`hydrate on interaction`](#hydrate-on-interaction) | 在使用者與指定元素互動時觸發                |
| [`hydrate on hover`](#hydrate-on-hover)             | 在滑鼠懸停於指定區域時觸發                     |
| [`hydrate on immediate`](#hydrate-on-immediate)     | 在非延遲內容完成渲染後立即觸發 |
| [`hydrate on timer`](#hydrate-on-timer)             | 在特定時間長度後觸發                                     |

#### `hydrate on idle` {#hydrate-on-idle}

`hydrate on idle` 觸發條件會在瀏覽器達到閒置狀態時，根據 `requestIdleCallback` 載入可延遲檢視的相依性並水合內容。

你可以選擇性地指定一個以毫秒為單位的逾時，傳給 [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)。如果瀏覽器沒有及時排程該回呼，工作最遲會在指定的逾時時間執行。

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- With a 500ms timeout -->
@defer (hydrate on idle(500)) {
  <large-cmp />
}
```

#### `hydrate on viewport` {#hydrate-on-viewport}

`hydrate on viewport` 觸發條件會在指定內容使用 [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) 進入可視區域時，載入可延遲檢視的相依性，並水合應用程式對應的頁面。

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction` {#hydrate-on-interaction}

`hydrate on interaction` 觸發條件會在使用者透過 `click` 或 `keydown` 事件與指定元素互動時，載入可延遲檢視的相依性並水合內容。

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover` {#hydrate-on-hover}

`hydrate on hover` 觸發條件會在滑鼠透過 `mouseover` 與 `focusin` 事件懸停於觸發區域時，載入可延遲檢視的相依性並水合內容。

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate` {#hydrate-on-immediate}

`hydrate on immediate` 觸發條件會立即載入可延遲檢視的相依性並水合內容。這表示延遲區塊會在所有其他非延遲內容完成渲染後，立刻載入。

```angular-html
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on timer` {#hydrate-on-timer}

`hydrate on timer` 觸發條件會在指定時間長度後，載入可延遲檢視的相依性並水合內容。

```angular-html
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

時間長度參數必須以毫秒（`ms`）或秒（`s`）指定。

### `hydrate when`

`hydrate when` 觸發條件接受自訂的條件運算式，並在條件變為 truthy 時，載入可延遲檢視的相依性並水合內容。

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: `hydrate when` 條件只有在它們是最上層未水合的 `@defer` 區塊時才會觸發。觸發條件所提供的條件是在父元件中指定的，而父元件必須先存在，才能被觸發。如果父區塊尚未水合，Angular 還無法解析該運算式。

### `hydrate never`

`hydrate never` 讓使用者能指定延遲區塊中的內容應無限期保持未水合狀態，實際上成為靜態內容。請注意，這只適用於初始渲染。在後續的用戶端渲染期間，帶有 `hydrate never` 的 `@defer` 區塊仍會取得相依性，因為水合只適用於伺服器端渲染內容的初始載入。在下面的範例中，後續的用戶端渲染會在進入可視區域時載入 `@defer` 區塊的相依性。

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: 使用 `hydrate never` 會防止指定 `@defer` 區塊的整個巢狀子樹被水合。在該區塊底下巢狀的內容，不會有任何其他 `hydrate` 觸發條件被觸發。

## Hydrate 觸發條件與一般觸發條件併用

Hydrate 觸發條件是與 `@defer` 區塊的一般觸發條件併用的額外觸發條件。水合是一種初始載入最佳化，這表示 hydrate 觸發條件只適用於該次初始載入。任何後續的用戶端渲染仍會使用一般觸發條件。

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder {
  <div>Example Placeholder</div>
}
```

在此範例中，在初始載入時，適用的是 `hydrate on interaction`。水合會在與 `<example-cmp />` 元件互動時觸發。在任何後續以用戶端渲染的頁面載入中（例如當使用者點選一個 routerLink，載入包含此元件的頁面時），適用的則是 `on idle`。

## 漸進式水合如何處理巢狀 `@defer` 區塊？

Angular 的元件與相依性系統是階層式的，這表示水合任何元件都需要它的所有父層也一併水合。因此，如果巢狀的一組未水合 `@defer` 區塊中的子 `@defer` 區塊觸發了水合，水合會從最上層未水合的 `@defer` 區塊開始，一路觸發到被觸發的子區塊，並依該順序執行。

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder {
  <div>Parent Placeholder</div>
}
```

在上例中，懸停於巢狀 `@defer` 區塊會觸發水合。帶有 `<parent-block-cmp />` 的父 `@defer` 區塊會先水合，然後帶有 `<child-block-cmp />` 的子 `@defer` 區塊才接著水合。

## 限制

漸進式水合的限制與完整應用程式水合相同，包括直接操作 DOM 的限制，以及要求有效的 HTML 結構。更多細節請參閱[水合指南的限制](guide/hydration#constraints)章節。

## 我還需要指定 `@placeholder` 區塊嗎？

需要。`@placeholder` 區塊的內容不會用於漸進式水合，但後續用戶端渲染的情況仍需要 `@placeholder`。如果你的內容不在初始載入所屬的路由上，那麼任何導覽到包含你的 `@defer` 區塊內容的路由時，都會像一般 `@defer` 區塊一樣渲染。因此在那些用戶端渲染的情況中，會渲染 `@placeholder`。
