# 水合

<div class="alert is-important">

水合功能目前為[開發人員預覽版](/guide/releases#開發者預覽)。你可以試用，但它在正式穩定前可能有所變更。

</div>

## 什麼是水合

水合是在用戶端還原伺服器端渲染應用程式的程序。這包括重用伺服器渲染出的 DOM 結構、保留應用程式狀態、傳遞伺服器先前已取得的應用程式資料等程序。

## 為什麼水合很重要？

水合避免了重新建立 DOM 節點的額外工作，因而提升應用程式效能。Angular 會在執行時嘗試將現有的 DOM 元素與應用程式結構對應，並在可能的情況下重用 DOM 節點。帶來的效能提升可以用 [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) 指標來衡量，例如降低 First Input Delay（[FID](https://web.dev/fid/)）與 Largest Contentful Paint（[LCP](https://web.dev/lcp/)），以及 Cumulative Layout Shift（[CLS](https://web.dev/cls/)）。改善這些指標也會影響 SEO 表現等面向。

若未啟用水合，伺服器端渲染的 Angular 應用程式會毀掉並重新渲染應用程式的 DOM，可能造成肉眼可見的 UI 閃爍。這種重新渲染會對 [Core Web Vitals](https://web.dev/learn-core-web-vitals/)（例如 [LCP](https://web.dev/lcp/)）造成負面影響，並導致版面位移。啟用水合後，現有的 DOM 可以被重用，也能避免閃爍。

<a id="how-to-enable"></a>

## 如何在 Angular 中啟用水合

在開始使用水合之前，你必須先有一個伺服器端渲染（SSR）應用程式。請先依照 [Angular Universal 指南](/guide/universal) 啟用伺服器端渲染。SSR 在你的應用程式中運作後，即可啟用水合：前往你的主要應用程式元件或模組，從 `@angular/platform-browser` 匯入 `provideClientHydration`，再將該提供者加入應用程式的啟動提供者清單。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(RootCmp, {
  providers: [provideClientHydration()]
});
```

或者，若你使用 NgModule，則將 `provideClientHydration` 加入根應用程式模組的提供者清單。

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [RootCmp],
  exports: [RootCmp],
  bootstrap: [RootCmp],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

<div class="alert is-helpful">

請注意：`provideClientHydration()` 呼叫也必須包含在用於在**伺服器**上啟動應用程式的提供者集合中。在預設專案結構（由 `ng new` 指令產生）的應用程式中，只要把呼叫加入根 `AppModule` 應該就足夠了，因為伺服器模組會匯入這個模組。若你使用自訂設定，請將 `provideClientHydration()` 呼叫加入伺服器啟動設定中的提供者清單。

</div>

完成這些步驟並啟動伺服器後，在瀏覽器中載入你的應用程式。

<div class="alert is-helpful">

  在水合完全運作之前，你很可能需要修正直接操作 DOM 的地方：改用 Angular 的寫法，或使用 `ngSkipHydration`。詳情請見[限制](#限制)、[直接操作 DOM](#dom-manipulation)，以及[如何為特定元件略過水合](#ngskiphydration)。

</div>

以開發模式執行應用程式時，可以開啟瀏覽器的開發者工具並查看主控台，確認水合是否已啟用。你應該會看到一則包含水合相關統計的訊息，例如已水合的元件與節點數量。

<div class="alert is-helpful">
  
Angular 計算這些統計時，會涵蓋頁面上渲染的所有元件，包括來自第三方函式庫的元件。

</div>

<a id="constraints"></a>

## 限制

水合對你的應用程式施加了一些未啟用水合時不存在的限制。你的應用程式在伺服器與用戶端必須具有相同的 DOM 結構。水合程序預期 DOM 樹在兩處具有相同的結構，這也包括 Angular 在伺服器上渲染時產生的空白與註解節點。這些空白與節點必須存在於伺服器端渲染程序產生的 HTML 中。

<div class="alert is-important">

伺服器端渲染產生的 HTML，在伺服器與用戶端之間**絕對不可**被更動。

</div>

若伺服器與用戶端的 DOM 樹結構不符，水合程序在嘗試對應預期內容與 DOM 中實際內容時就會遇到問題。最常見的元兇，是使用原生 DOM API 直接操作 DOM 的元件。

<a id="dom-manipulation"></a>

### 直接操作 DOM

若你的元件使用原生 DOM API 操作 DOM，或使用 `innerHTML` 或 `outerHTML`，水合程序就會遇到錯誤。DOM 操作會出問題的具體情況，包括存取 `document`、查詢特定元素，以及使用 `appendChild` 注入額外節點。將 DOM 節點拆離再移到其他位置也會導致錯誤。

這是因為 Angular 無法察覺這些 DOM 變更，也無法在水合過程中處理它們。Angular 預期的是某種結構，但嘗試水合時遇到的卻是不同結構。這種不符會導致水合失敗，並拋出 DOM 不符錯誤（[見下文](#錯誤)）。

最好的做法是重構元件，避免這類 DOM 操作；可以的話，改用 Angular API 來完成。若無法重構這個行為，可以先使用 `ngSkipHydration` 屬性（[如下所述](#ngskiphydration)），等到能改成對水合友善的作法為止。

<a id="valid-html"></a>

### 有效的 HTML 結構

在某些情況下，若你的元件範本不具備有效的 HTML 結構，可能會在水合期間導致 DOM 不符錯誤。

例如，以下是這個問題最常見的幾種情況。

* `<table>` without a `<tbody>`
* `<div>` inside a `<p>`
* `<a>` inside an `<h1>`
* `<a>` inside another `<a>`

若不確定自己的 HTML 是否有效，可以使用[語法驗證工具](https://validator.w3.org/)檢查。

<a id="preserve-whitespaces"></a>
### Preserve Whitespaces 設定

使用水合功能時，建議將 `preserveWhitespaces` 保持預設值 `false`。若你的 tsconfig 中沒有這項設定，其值即為 `false`，不需要做任何變更。若你選擇將 `preserveWhitespaces: true` 加入 tsconfig 來啟用保留空白，可能會遇到水合相關問題；這項目尚未完整支援的設定。

<div class="alert is-helpful">

請確認這項設定在伺服器用的 `tsconfig.server.json` 與瀏覽器建置用的 `tsconfig.app.json` 中**保持一致**；值不一致會導致水合失效。

若要在 tsconfig 中設定這項設定，建議只在 `tsconfig.app.json` 中設定，`tsconfig.server.json` 預設會繼承它。

</div>

<a id="cdn-configuration"></a>
### CDN 最佳化

許多 CDN 提供一項功能，會嘗試最佳化你已渲染的應用程式，方法是移除它認為不必要的已渲染 DOM 節點，其中包括註解節點。註解節點是 Angular 運作的重要部分，對水合的運作至關重要。你需要停用這項 CDN 功能，才能確保應用程式正常載入並完成水合。

如果已啟用 CDN 最佳化且已啟用水合，當你嘗試載入頁面時，會遇到錯誤 [NG0507](https://angular.io/errors/NG0507)。如果你看到這個錯誤，應該去停用 CDN 最佳化。

### 尚不支援自訂或 Noop 的 Zone.js

水合仰賴 Zone.js 在應用程式內部達到穩定時發出的訊號，讓 Angular 能在伺服器上啟動序列化程序，或在用戶端進行水合後清理，移除未被認領的 DOM 節點。

提供自訂或「noop」的 Zone.js 實作，可能會改變「stable」事件的時機，導致序列化或清理過早或過晚觸發。這項目尚未完整支援的設定，你可能需要調整自訂 Zone.js 實作中 `onStable` 事件的時機。


<a id="errors"></a>

## 錯誤

你可能會遇到幾種與水合相關的錯誤，從節點不符，到在無效的宿主節點上使用 `ngSkipHydration` 的情況都有。最常見的錯誤原因是使用原生 API 直接操作 DOM，導致水合無法在用戶端找到或對應伺服器所渲染的預期 DOM 樹狀結構。另一種可能遇到這類錯誤的情況，已在前文的[有效的 HTML 結構](#valid-html)一節提過。因此，請確認範本中的 HTML 使用有效的結構，就能避免這類錯誤。

水合相關錯誤的完整參考，請見[錯誤參考指南](/errors)。

<a id="ngskiphydration"></a>

## 如何為特定元件略過水合

有些元件可能因為前述問題（例如[直接操作 DOM](#dom-manipulation)）而無法在水合啟用時正常運作。作為因應方法，你可以將 `ngSkipHydration` 屬性加到元件的標籤上，略過整個元件的水合。

```html
<example-cmp ngSkipHydration />
```

或者，你也可以將 `ngSkipHydration` 設定為宿主繫結。

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleCmp {}
```

`ngSkipHydration` 屬性會強制 Angular 略過整個元件及其子元件的水合。使用這個屬性，表示該元件的行為如同未啟用水合，也就是它會毀掉並重新渲染自己。

<div class="alert is-helpful">

這樣做能修正渲染問題，但表示這個元件（及其子元件）無法獲得水合的好處。你需要調整元件的實作，避免會破壞水合的寫法（也就是直接操作 DOM），才能移除略過水合的標記。

</div>

`ngSkipHydration` 屬性只能用在元件的宿主節點上；若將這個屬性加到其他節點，Angular 會拋出錯誤。

請注意，將 `ngSkipHydration` 屬性加到根應用程式元件上，等於停用整個應用程式的水合。使用這個屬性時請謹慎考慮；它只是最後手段的因應方法。會破壞水合的元件應該視為需要修正的錯誤。

<a id="i18n"></a>

## I18N

水合尚不支援國際化，但相關支援即將推出。
目前，Angular 會略過使用 i18n 區塊的元件的水合，等同於從頭重新渲染這些元件。

## 操作 DOM 的第三方函式庫

有不少第三方函式庫仰賴 DOM 操作才能渲染，D3 圖表就是典型的例子。這些函式庫在未啟用水合時運作正常，但啟用水合後可能造成 DOM 不符錯誤。目前若你使用這類函式庫時遇到 DOM 不符錯誤，可以將 `ngSkipHydration` 屬性加到使用該函式庫渲染的元件上。

@reviewed 2023-08-14
