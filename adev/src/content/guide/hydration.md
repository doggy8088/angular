# 水合

## 什麼是水合 {#what-is-hydration}

水合是在用戶端還原伺服器端渲染應用程式的程序。這包括重用伺服器渲染出的 DOM 結構、保留應用程式狀態、傳遞伺服器先前已取得的應用程式資料等程序。

## 為什麼水合很重要？

水合避免了重新建立 DOM 節點的額外工作，因而提升應用程式效能。Angular 會在執行時嘗試將現有的 DOM 元素與應用程式結構對應，並在可能的情況下重用 DOM 節點。帶來的效能提升可以用 [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) 指標來衡量，例如降低 First Input Delay（[FID](https://web.dev/fid/)）與 Largest Contentful Paint（[LCP](https://web.dev/lcp/)），以及 Cumulative Layout Shift（[CLS](https://web.dev/cls/)）。改善這些指標也會影響 SEO 表現等面向。

若未啟用水合，伺服器端渲染的 Angular 應用程式會毀掉並重新渲染應用程式的 DOM，可能造成肉眼可見的 UI 閃爍。這種重新渲染會對 [Core Web Vitals](https://web.dev/learn-core-web-vitals/)（例如 [LCP](https://web.dev/lcp/)）造成負面影響，並導致版面位移。啟用水合後，現有的 DOM 可以被重用，也能避免閃爍。

## 如何在 Angular 中啟用水合

水合只能在伺服器端渲染（SSR）的應用程式中啟用。請先依照 [Angular SSR 指南](guide/ssr) 啟用伺服器端渲染。

### 使用 Angular CLI

若你已使用 Angular CLI 啟用 SSR（不論是在建立應用程式時啟用，或之後透過 `ng add @angular/ssr` 啟用），啟用水合的程式碼應該已經包含在你的應用程式中。

### 手動設定

若你使用自訂設定、未透過 Angular CLI 啟用 SSR，可以手動啟用水合：在主要的應用程式元件或模組中，從 `@angular/platform-browser` 匯入 `provideClientHydration`，再將該提供者加入應用程式的啟動提供者清單。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration()]
});
```

若你使用 NgModule，則將 `provideClientHydration` 加入根應用程式模組的提供者清單。

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [App],
  exports: [App],
  bootstrap: [App],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANT: 請確認 `provideClientHydration()` 呼叫也包含在用於在**伺服器**上啟動應用程式的提供者集合中。在預設專案結構（由 `ng new` 指令產生）的應用程式中，只要把呼叫加入根 `AppModule` 應該就足夠了，因為伺服器模組會匯入這個模組。若你使用自訂設定，請將 `provideClientHydration()` 呼叫加入伺服器啟動設定中的提供者清單。

### 確認水合已啟用

設定好水合並啟動伺服器後，在瀏覽器中載入你的應用程式。

HELPFUL: 在水合完全運作之前，你很可能需要修正直接操作 DOM 的地方：改用 Angular 的寫法，或使用 `ngSkipHydration`。詳情請見[限制](#constraints)、[直接操作 DOM](#direct-dom-manipulation)與[如何為特定元件略過水合](#how-to-skip-hydration-for-particular-components)。

以開發模式執行應用程式時，可以開啟瀏覽器的開發者工具並查看主控台，確認水合是否已啟用。你應該會看到一則包含水合相關統計的訊息，例如已水合的元件與節點數量。Angular 計算這些統計時，會涵蓋頁面上渲染的所有元件，包括來自第三方函式庫的元件。

你也可以使用 [Angular DevTools 瀏覽器擴充功能](tools/devtools) 查看頁面上各元件的水合狀態。Angular DevTools 也能啟用覆蓋層，標示頁面中哪些部分已完成水合。若發生水合不符錯誤，DevTools 也會突顯造成錯誤的元件。

## 擷取與重播事件 {#capturing-and-replaying-events}

當應用程式在伺服器上渲染時，產生的 HTML 一載入，頁面就會出現在瀏覽器中。使用者可能會以為已經可以與頁面互動，但事件監聽器要等到水合完成後才會掛上。事件重播功能會擷取水合完成前發生的所有事件，並在水合完成後重播這些事件。

事件重播會隨著[漸進式水合](guide/incremental-hydration)一併啟用。若你以 `withNoIncrementalHydration()` 停用漸進式水合，仍可使用 `withEventReplay()` 函式啟用事件重播：

```typescript
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
  bootstrapApplication,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoIncrementalHydration(), withEventReplay())],
});
```

### 事件重播的運作方式

事件重播是一項提升使用者體驗的功能：它會擷取水合程序完成前觸發的使用者事件，再將這些事件重播，確保任何互動都不會遺失。

事件重播分為三個主要階段：

- **擷取使用者互動**<br>
  在**水合**之前，事件重播會擷取並儲存使用者可能進行的所有互動，例如點擊與其他瀏覽器原生事件。

- **儲存事件**<br>
  **Event Contract** 會將前一步記錄的所有互動保存在記憶體中，確保它們不會在稍後重播前遺失。

- **重新派發事件**<br>
  **水合**完成後，Angular 會重新觸發擷取到的事件。

事件重播支援_原生瀏覽器事件_，例如 `click`、`mouseover` 與 `focusin`。若想深入了解驅動事件重播的函式庫 JSAction，請見其 [README](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme)。

這項功能確保一致的使用者體驗，避免使用者在水合前進行的操作被忽略。

## 限制 {#constraints}

水合對你的應用程式施加了一些未啟用水合時不存在的限制。你的應用程式在伺服器與用戶端必須具有相同的 DOM 結構。水合程序預期 DOM 樹在兩處具有相同的結構，這也包括 Angular 在伺服器上渲染時產生的空白與註解節點。這些空白與節點必須存在於伺服器端渲染程序產生的 HTML 中。

IMPORTANT: 伺服器端渲染產生的 HTML，在伺服器與用戶端之間**絕對不可**被更動。

若伺服器與用戶端的 DOM 樹結構不符，水合程序在嘗試對應預期內容與 DOM 中實際內容時就會遇到問題。最常見的元兇，是使用原生 DOM API 直接操作 DOM 的元件。

### 直接操作 DOM {#direct-dom-manipulation}

若你的元件使用原生 DOM API 操作 DOM，或使用 `innerHTML` 或 `outerHTML`，水合程序就會遇到錯誤。DOM 操作會出問題的具體情況，包括存取 `document`、查詢特定元素，以及使用 `appendChild` 注入額外節點。將 DOM 節點拆離再移到其他位置也會導致錯誤。

這是因為 Angular 無法察覺這些 DOM 變更，也無法在水合過程中處理它們。Angular 預期的是某種結構，但嘗試水合時遇到的卻是不同結構。這種不符會導致水合失敗，並拋出 DOM 不符錯誤（[見下文](#errors)）。

最好的做法是重構元件，避免這類 DOM 操作；可以的話，改用 Angular API 來完成。若無法重構這個行為，可以先使用 `ngSkipHydration` 屬性（[如下所述](#how-to-skip-hydration-for-particular-components)），等到能改成對水合友善的作法為止。

### 有效的 HTML 結構 {#valid-html-structure}

在某些情況下，若你的元件範本不具備有效的 HTML 結構，可能會在水合期間導致 DOM 不符錯誤。

例如，以下是這個問題最常見的幾種情況。

- `<table>` without a `<tbody>`
- `<div>` inside a `<p>`
- `<a>` inside another `<a>`

若不確定自己的 HTML 是否有效，可以使用[語法驗證工具](https://validator.w3.org/)檢查。

NOTE: 雖然 HTML 標準並未要求表格中必須有 `<tbody>` 元素，但現代瀏覽器會自動為未宣告 `<tbody>` 的表格建立一個。為了避免這種不一致造成的問題，請務必在表格中明確宣告 `<tbody>` 元素，以免發生水合錯誤。

### Preserve Whitespaces 設定 {#preserve-whitespaces-configuration}

使用水合功能時，建議將 `preserveWhitespaces` 保持預設值 `false`。若你的 tsconfig 中沒有這項設定，其值即為 `false`，不需要做任何變更。若你選擇將 `preserveWhitespaces: true` 加入 tsconfig 來啟用保留空白，可能會遇到水合相關問題；這項目尚未完整支援的設定。

HELPFUL: 請確認這項設定在伺服器用的 `tsconfig.server.json` 與瀏覽器建置用的 `tsconfig.app.json` 中**保持一致**；值不一致會導致水合失效。

若要在 tsconfig 中設定這項設定，建議只在 `tsconfig.app.json` 中設定，`tsconfig.server.json` 預設會繼承它。

### 尚不支援自訂或 Noop 的 Zone.js

水合仰賴 Zone.js 在應用程式內部達到穩定時發出的訊號，讓 Angular 能在伺服器上啟動序列化程序，或在用戶端進行水合後清理，移除未被認領的 DOM 節點。

提供自訂或「noop」的 Zone.js 實作，可能會改變「stable」事件的時機，導致序列化或清理過早或過晚觸發。這項目尚未完整支援的設定，你可能需要調整自訂 Zone.js 實作中 `onStable` 事件的時機。

## 錯誤 {#errors}

你可能會遇到幾種與水合相關的錯誤，從節點不符，到在無效的宿主節點上使用 `ngSkipHydration` 的情況都有。最常見的錯誤原因是使用原生 API 直接操作 DOM，導致水合無法在用戶端找到或對應伺服器所渲染的預期 DOM 樹狀結構。另一種可能遇到這類錯誤的情況，已在前文的[有效的 HTML 結構](#valid-html-structure)一節提過。因此，請確認範本中的 HTML 使用有效的結構，就能避免這類錯誤。

水合相關錯誤的完整參考，請見[錯誤參考指南](/errors)。

## 如何為特定元件略過水合 {#how-to-skip-hydration-for-particular-components}

有些元件可能因為前述問題（例如[直接操作 DOM](#direct-dom-manipulation)）而無法在水合啟用時正常運作。作為因應方法，你可以將 `ngSkipHydration` 屬性加到元件的標籤上，略過整個元件的水合。

```angular-html
<app-example ngSkipHydration />
```

或者，你也可以將 `ngSkipHydration` 設定為宿主繫結。

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

`ngSkipHydration` 屬性會強制 Angular 略過整個元件及其子元件的水合。使用這個屬性，表示該元件的行為如同未啟用水合，也就是它會毀掉並重新渲染自己。

HELPFUL: 這樣做能修正渲染問題，但表示這個元件（及其子元件）無法獲得水合的好處。你需要調整元件的實作，避免會破壞水合的寫法（也就是直接操作 DOM），才能移除略過水合的標記。

`ngSkipHydration` 屬性只能用在元件的宿主節點上；若將這個屬性加到其他節點，Angular 會拋出錯誤。

請注意，將 `ngSkipHydration` 屬性加到根應用程式元件上，等於停用整個應用程式的水合。使用這個屬性時請謹慎考慮；它只是最後手段的因應方法。會破壞水合的元件應該視為需要修正的錯誤。

## 水合時機與應用程式穩定性

應用程式穩定性是水合程序的重要一環。水合與任何水合後程序，都要等應用程式回報達到穩定後才會進行。穩定可能被多種因素延遲，例如設定了計時器與週期性工作、promise 尚未完成，或有待處理的微任務。在這些情況下，你可能會遇到[應用程式持續不穩定](errors/NG0506)錯誤，表示你的應用程式在 10 秒後仍未達到穩定狀態。若你發現應用程式沒有立即水合，請檢查是什麼影響了應用程式的穩定性，並重構以避免這些延遲。

### 偵錯應用程式穩定性

`provideStabilityDebugging` 工具能協助你找出應用程式無法穩定的原因。使用 `provideClientHydration` 時，這個工具在開發模式下會預設提供。你也可以手動將它加入應用程式提供者，例如用於生產環境的程式包，或在不使用水合的 SSR 情境中。若應用程式穩定所需的時間超過預期，這項功能會將資訊記錄到主控台。

```typescript
import {provideStabilityDebugging} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import 'zone.js/plugins/task-tracking'; // Use if you have Zone.js with `provideZoneChangeDetection`

bootstrapApplication(App, {
  providers: [provideStabilityDebugging()],
});
```

啟用後，這個工具會將待處理的工作（`PendingTasks`）記錄到主控台。若你的應用程式使用 Zone.js，也可以匯入 `zone.js/plugins/task-tracking`，查看哪些巨集任務讓 Angular Zone 無法穩定。這個外掛程式提供巨集任務建立時的堆疊追蹤，能有效協助你找出延遲的來源。

IMPORTANT: Angular 不會從生產環境的程式包中移除 zone.js 工作追蹤外掛程式或這個工具。請只在開發期間用它們暫時偵錯穩定性問題，包含最佳化後的生產環境建置。

## I18N

HELPFUL: 預設情況下，Angular 會略過使用 i18n 區塊的元件的水合，等同於從頭重新渲染這些元件。

若要為 i18n 區塊啟用水合，可以將 [`withI18nSupport`](/api/platform-browser/withI18nSupport) 加入你的 `provideClientHydration` 呼叫。

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## 伺服器端與用戶端之間的一致渲染

避免使用 `@if` 區塊或其他條件式，讓伺服器端渲染與用戶端渲染顯示不同內容，例如搭配 Angular 的 `isPlatformBrowser` 函式使用 `@if` 區塊。這類渲染差異會造成版面位移，對使用者體驗與 Core Web Vitals 造成負面影響。

## 操作 DOM 的第三方函式庫

有不少第三方函式庫仰賴 DOM 操作才能渲染，D3 圖表就是典型的例子。這些函式庫在未啟用水合時運作正常，但啟用水合後可能造成 DOM 不符錯誤。目前若你使用這類函式庫時遇到 DOM 不符錯誤，可以將 `ngSkipHydration` 屬性加到使用該函式庫渲染的元件上。

## 操作 DOM 的第三方指令碼 {#third-party-scripts-with-dom-manipulation}

許多第三方指令碼（例如廣告追蹤與分析工具）會在水合發生前修改 DOM。這些指令碼可能造成水合錯誤，因為頁面不再符合 Angular 預期的結構。請儘量將這類指令碼延後到水合完成後再執行。可以考慮使用 [`AfterNextRender`](api/core/afterNextRender)，將指令碼延後到水合後程序完成才執行。

### CDN 與瀏覽器擴充功能 {#cdns-and-browser-extensions}

應用程式以外的程式碼可能會在水合開始前變更來自伺服器的 HTML。這類錯誤在你的電腦上往往看不見，因為它們不會發生在你的本機伺服器上。

**會變更 HTML 的 CDN**。有些 CDN 功能會在 HTML 傳往瀏覽器的途中變更它。例如，有些功能會移除註解節點與空白，但水合需要這些節點。另一個例子是 Cloudflare 預設開啟的 Email Address Obfuscation（電子郵件地址混淆）功能，這項功能會把電子郵件地址改成像 `<span class="__cf_email__" data-cfemail="...">` 這樣的元素。它也會變更 `mailto:` 連結，並加入一個指令碼把內容改回來。如果這個指令碼在水合開始前沒有執行，Angular 會在預期是文字的地方找到一個元素。你的本機伺服器沒有使用 CDN，所以應用程式在你的電腦上可以正常運作，只在生產環境中失敗。

**瀏覽器擴充功能**。有些瀏覽器擴充功能會在水合開始前變更頁面，例如一鍵撥號工具、翻譯工具與密碼管理員。你無法控制這些擴充功能。只有安裝了它們的使用者會遇到問題，因此你可能只會看到部分使用者的錯誤。

要修正這類錯誤：

- 在被變更內容周圍的元件宿主上加入 `ngSkipHydration`。在你撰寫該內容的範本中加入，例如：`<app-contact ngSkipHydration><a href="tel:...">...</a></app-contact>`。Angular 接著會在瀏覽器中重新算繪這段內容，藉此移除那些變更。這個屬性只能用在元件宿主元素上，所以你不能把它加到 `<a>` 元素上。更多資訊請見[如何為特定元件略過水合](#how-to-skip-hydration-for-particular-components)。
- 關閉應用程式的 CDN 功能。在 Cloudflare 中，於安全性設定關閉 [Email Address Obfuscation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/)，或使用 [Configuration Rule](https://developers.cloudflare.com/rules/configuration-rules/settings/)，針對應用程式的 host 停用它。

NOTE: Cloudflare 的 `<!--email_off-->` 註解在 Angular 範本中沒有幫助，因為編譯器會從範本中移除註解。

## 漸進式水合

漸進式水合是水合的進階形式，能更細緻地控制水合發生的時機。詳情請見[漸進式水合指南](guide/incremental-hydration)。
