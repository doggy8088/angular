# 水合作用

## 什麼是水合作用

水合作用是將伺服器端渲染的應用程式還原到客戶端上的程序。這包括重用伺服器渲染的 DOM 結構、持久化應用程式狀態、傳輸伺服器已擷取的應用程式資料，以及其他程序。

## 為什麼補水很重要？

水合改善應用程式效能，避免重新建立 DOM 節點的額外工作。相反地，Angular 會嘗試在執行階段將現有的 DOM 元素與應用程式結構相匹配，並在可能的情況下重複使用 DOM 節點。這會帶來效能改善，可以使用 [核心網路生命週期 (CWV)](https://web.dev/learn-core-web-vitals/) 統計數據加以衡量，例如減少首次輸入延遲 ([FID](https://web.dev/fid/)) 和最大內容繪製 ([LCP](https://web.dev/lcp/))，以及累計版面配置變更 ([CLS](https://web.dev/cls/))。改善這些數值也會影響 SEO 效能等事項。

在未啟用水合的情況下，伺服器端渲染的 Angular 應用程式會銷毀並重新渲染應用程式的 DOM，這可能會導致 UI 閃爍。這種重新渲染會對 [核心網路指標](https://web.dev/learn-core-web-vitals/)，例如 [LCP](https://web.dev/lcp/)，產生負面影響，並導致版面轉移。啟用水合可讓現有的 DOM 重複使用，並防止閃爍。

## 如何在 Angular 中啟用 hydration

在您開始水合之前，您必須具備伺服器端渲染 (SSR) 應用程式。請先遵循 [Angular SSR 指南](/guide/ssr) 以啟用伺服器端渲染。一旦 SSR 與您的應用程式一起運作，您可以訪問您的主要應用程式元件或模組並從 `@angular/platform-browser` 匯入 `provideClientHydration` 以啟用水合。然後，您會將該提供者新增至您的應用程式開機提供者清單。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```

或者，如果您使用 NgModules，則會將 `provideClientHydration` 加入根應用程式的提供者清單。

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANT: 確保 `provideClientHydration()` 呼叫也包含在用於在 **伺服器** 上引導應用程式的提供者集合中。在具有預設專案結構（由 `ng new` 指令產生）的應用程式中，新增對根 `AppModule` 的呼叫就應該足夠了，因為伺服器模組會匯入這個模組。如果您使用自訂設定，請將 `provideClientHydration()` 呼叫新增至伺服器引導設定中的提供者清單。

執行完這些步驟並啟動伺服器後，在瀏覽器中載入您的應用程式。

HELPFUL: 您可能需要修復直接 DOM 操作的執行個體，才能完全運作水化作用，方法是切換至 Angular 建構或使用 `ngSkipHydration`。請參閱 [限制](#限制)、[直接 DOM 操作](#直接-dom-操作)，以及 [如何略過特定元件的水化作用](#如何略過-特定元件-的水化作用) 以取得更多詳細資訊。

在開發模式下執行應用程式時，您可以透過開啟瀏覽器的開發人員工具並檢視主控台來確認已啟用水合作用。您應該會看到包含水合作用相關統計資料的訊息，例如水合作用的元件和節點數。

HELPFUL：Angular 計算頁面上所有元件的統計資料，包括那些來自第三方的函式庫。

## 限制

水合作用會對您的應用程式施加一些限制，而在未啟用水合作用時則不會出現這些限制。您的應用程式在伺服器和用戶端都必須具有相同的自動產生的 DOM 結構。水合作用的程序預期在兩個地方 DOM 樹具有相同的結構。這也包含 Angular 在伺服器上進行渲染時產生的空白和註解節點。這些空白和節點必須存在於伺服器端渲染程序所產生的 HTML 中。

重要：伺服器端呈現操作所產生的 HTML **不得** 在伺服器和用戶端之間變更。

如果伺服器與客戶端 DOM 樹結構之間不匹配，水合程序將會在嘗試將預期內容與實際出現在 DOM 中的內容配對時遇到問題。使用原生 DOM API 進行直接 DOM 操作的元件是最常見的罪魁禍首。

### 直接操作 DOM

如果您有使用原生 DOM API 或使用 `innerHTML` 或 `outerHTML` 操作 DOM 的元件，則水合程序會遇到錯誤。DOM 操作會造成問題的具體情況包括存取 `document`、查詢特定元素，以及使用 `appendChild` 注入其他節點。分離 DOM 節點並將它們移至其他位置也會造成錯誤。

這是因為 Angular 不知道這些 DOM 變更，也無法在水合過程中解決這些變更。Angular 會預期某種結構，但它在嘗試水合時會遇到不同的結構。這種不匹配會導致水合失敗並拋出 DOM 不匹配錯誤 (請參閱以下內容 [#errors])。

最好重構您的元件以避免此類型的 DOM 處理。如果您能做到，請嘗試使用 Angular API 來執行這項工作。如果您無法重構此行為，請使用 `ngSkipHydration` 屬性（[如下所述](#how-to-skip-hydration-for-particular-components)），直到您可以重構為支援水合的解決方案。

### 有效的 HTML 結構

在某些情況下，如果您有元件範本沒有有效的 HTML 結構，這可能會在水化期間造成 DOM 不匹配錯誤。

作為範例，以下是一些最常見的此問題案例。

* `<table`>` 沒有 `<tbody>`
* `<div>` 在 `<p>` 內
* `<a>` 在 `<h1>` 內
* `<a>` 在另一個 `<a>` 內

如果您不確定您的 HTML 是否有效，您可以使用 [語法驗證器](https://validator.w3.org/) 進行檢查。

### 保留空白字元設定

當使用 hydration 功能時，我們建議將 `preserveWhitespaces` 的預設設定 `false`。如果此設定不在您的 tsconfig 中，則值會為 `false`，且無需變更。如果您選擇透過在 tsconfig 中新增 `preserveWhitespaces: true` 來啟用保留空白，則可能會遇到 hydration 的問題。這目前尚未完全支援此組態。

HELPFUL: 確保此設定在伺服器的 `tsconfig.server.json` 和瀏覽器建置的 `tsconfig.app.json` 中 **一致** 設定。值不匹配會導致水合作用中斷。

如果您選擇在 tsconfig 中設定這個設定，我們建議只在 `tsconfig.app.json` 中設定，預設情況下 `tsconfig.server.json` 會繼承它。

### 自訂或 Noop Zone.js 尚未支援

Hydration 依賴來自 Zone.js 在應用程式內部變為穩定時的訊號，以便 Angular 可以啟動伺服器上的序列化程序或客戶端上的 post-hydration 清理程序，以移除未宣告的 DOM 節點。

提供自訂或「noop」Zone.js 實作可能會導致「stable」事件的時機不同，因而過早或過晚觸發序列化或清理。這還不是完全支援的設定，你可能需要在自訂的 Zone.js 實作中調整 `onStable` 事件的時機。

## 錯誤

您可能會遇到多種水合相關錯誤，範圍從節點不匹配到在無效主機節點上使用 `ngSkipHydration` 的情況。最常發生的錯誤案例是，由於使用原生 API 直接操作 DOM 導致水合無法在伺服器呈現的用戶端上找到或匹配預期的 DOM 樹狀結構。您可能會遇到此類錯誤的另一種情況前面在 [有效 HTML 結構](#valid-html-structure) 部分中提到過。因此，請務必確認範本中的 HTML 使用有效結構，這樣就能避免該錯誤案例。

有關水合作用相關錯誤的完整參考，請參閱 [錯誤參考指南](/errors)。

## 如何略過特定元件的補水

有些元件可能無法適當地與啟用的水化一起運作，原因是某些上述問題，例如 [直接 DOM 操作](#direct-dom-manipulation)。作為解決方法，您可以將 `ngSkipHydration` 屬性新增到元件標籤中，以便略過對整個元件進行水化。

```html
<app-example ngSkipHydration />
```

或者你可以將 `ngSkipHydration` 設為 host 繫結。

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

`ngSkipHydration` 屬性會強制 Angular 跳過整個元件及其子項目的水化。使用此屬性意味著元件將表現得好像沒有啟用水化，也就是說它會銷毀並重新呈現自己。

HELPFUL: 這將修正渲染問題，但這表示對於此元件（及其子項），您無法獲得水合作用的優點。您需要調整元件的實作以避免破壞水合作用的模式（例如直接 DOM 操作），才能移除跳過水合作用註解。

`ngSkipHydration` 屬性只能用於元件主機節點。如果將此屬性新增至其他節點，Angular 會擲出錯誤。

請記住，將 `ngSkipHydration` 屬性新增至您的根應用程式元件會有效地停用整個應用程式的 hydration。使用此屬性時務必要小心謹慎。此屬性被視為最後的權宜之計。會中斷 hydration 的元件應被視為需要修正的錯誤。

## I18N

我們尚未支援國際化與水合，但支援即將推出。
目前，Angular 會略過使用 i18n 區塊的元件的水合，實際上是從頭重新呈現這些元件。

## 使用 DOM 操作的第三方函式庫

有許多第三方程式庫仰賴 DOM 處理才能進行渲染。D3 圖表就是一個很好的例子。這些程式庫在沒有水合的情況下也可以運作，但當啟用水合時，它們可能會導致 DOM 不匹配錯誤。目前，如果您在使用其中一個程式庫時遇到 DOM 不匹配錯誤，您可以將 `ngSkipHydration` 屬性新增到使用該程式庫進行渲染的元件中。
