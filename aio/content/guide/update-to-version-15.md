# 將 Angular 更新到 v15

<!-- NOTE to writers: When creating the topic for the next version,                               -->
<!--   remember to update the redirect link in angular/aio/firebase.json                          -->
<!-- To update the redirect link in angular/aio/firebase.json:                                    -->
<!--   1. Search for the entry in firebase.json with "source": "guide/update-to-latest-version"   -->
<!--   2,  Update the destination value to refer to the new guide's URL                           -->
<!--                                                                                              -->

本主題提供將 Angular 應用程式更新到 Angular 版本 15 的相關資訊。

如需本資訊的摘要，以及將 Angular 應用程式更新到 v15 的逐步程序，請參閱 [Angular Update Guide](https://update.angular.io)。

[Angular Update Guide](https://update.angular.io) 與本主題中的資訊，摘要自下列變更日誌：

*  [angular/angular changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md)
*  [angular/angular-cli changelog](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
*  [angular/components changelog](https://github.com/angular/components/blob/main/CHANGELOG.md)

將 Angular 應用程式更新到 v14 的資訊已封存於[更新到版本 14](/guide/update-to-version-14)。

<a id="new-features"></a>

## Angular v15 的新功能

Angular v15 帶來許多改進與新功能。
本節僅包含 v15 部分創新內容。

如需新功能的完整清單，請參閱[關於更新到 v15 的 Angular 部落格文章](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)。

<!-- markdownLint-disable MD001 -->

#### 獨立式元件已穩定

獨立式元件 API 讓你無需使用 NgModule 即可建置 Angular 應用程式。如需進一步了解如何在下一個 Angular 應用程式中使用這些 API，請參閱[獨立式元件](guide/standalone-components)。

#### `NgOptimizedImage` 指令已穩定

在元件或 NgModule 中加入 `NgOptimizedImage` 指令，有助於縮短 Angular 應用程式中圖片的下載時間。如需進一步了解如何使用 `NgOptimizedImage` 指令，請參閱[`NgOptimizedImage` 入門](guide/image-directive)。

#### 指令可以加入宿主元素

指令組合 API 讓你能夠將指令加入宿主元素，回應了[功能請求 #8785](https://github.com/angular/angular/issues/8785)。指令讓你無需使用繼承，即可為元件加入行為。

#### 堆疊追蹤更有幫助

Angular v15 以更簡潔的堆疊追蹤，讓 Angular 應用程式的除錯更輕鬆。
Angular 與 Google Chrome 開發人員合作，呈現顯示更多應用程式程式碼、更少所呼叫函式庫內容的堆疊追蹤。

如需進一步了解 Chrome DevTools 以及 Angular 對更簡潔堆疊追蹤的支援，請參閱 [Modern web debugging in Chrome DevTools](https://developer.chrome.com/blog/devtools-modern-web-debugging/)。

<!-- vale Angular.Google_Acronyms = NO -->

#### 以 MDC 為基礎的元件已穩定

<!-- vale Angular.Google_Acronyms = YES -->

Angular Material v15 中的許多元件已重構為以 Web 版 Angular Material Design Components (MDC) 為基礎。
重構後的元件提供更佳的無障礙支援，並更符合 Material Design 規範。

如需進一步了解更新後的元件，請參閱[遷移到以 MDC 為基礎的 Angular Material 元件](https://material.angular.io/guide/mdc-migration)。

<a id="breaking-changes"></a>

## Angular v15 的破壞性變更

以下是 Angular 在 v15 中行為有所不同的部分，可能需要你檢視並重構 Angular 應用程式的某些部分。

<a id="v15-bc-01"></a>

#### Angular v15 支援的 node.js 版本：14.20.x、16.13.x 與 18.10.x

在 v15 中，Angular 不再支援 node.js 版本 14.\[15-19\].x 或 16.\[10-12\].x。[PR #47730](https://github.com/angular/angular/pull/47730)

<a id="v15-bc-02"></a>

#### Angular v15 支援 TypeScript 4.8 或更新版本

在 v15 中，Angular 不再支援舊於 4.8 的 TypeScript 版本。[PR #47690](https://github.com/angular/angular/pull/47690)

<a id="v15-bc-03"></a>

#### `@keyframes` 名稱格式變更

在 v15 中，`@keyframes` 名稱會加上元件的*範圍名稱*作為前綴。[PR #42608](https://github.com/angular/angular/pull/42608)

例如，在*範圍名稱*為 `host-my-cmp` 的元件定義中，v14 中名稱為下列內容的 `@keyframes` 規則：

<code-example language="ts" hideCopy>

@keyframes foo { ... }

</code-example>

在 v15 中變為：

<code-example language="ts" hideCopy>

@keyframes host-my-cmp_foo { ... }

</code-example>

此變更可能會破壞任何使用 `@keyframes` 規則名稱的 TypeScript 或 JavaScript 程式碼。

為因應此破壞性變更，你可以：

*  將元件的檢視封裝變更為 `None` 或 `ShadowDom`。
*  在全域樣式表（例如 `styles.css`）中定義 `@keyframes` 規則。
*  在自己的程式碼中定義 `@keyframes` 規則。

<a id="v15-bc-05"></a>

#### 用於依賴注入的無效建構函式可能會回報編譯錯誤

當類別從基礎類別繼承其建構函式時，若該建構函式無法用於依賴注入，編譯器可能會回報錯誤。[PR #44615](https://github.com/angular/angular/pull/44615)

這種情況可能發生於：

*  基礎類別缺少 Angular 裝飾器，例如 `@Injectable()` 或 `@Directive()`
*  建構函式包含沒有關聯權杖的參數，例如 `string` 等原始型別。

這些情況在執行時期過去會有非預期的行為。例如，類別可能會在沒有任何建構函式參數的情況下被建構。
在 v15 中，這會回報為編譯錯誤。

因這項變更而回報的新錯誤，可以透過下列任一方式解決：

* 為繼承建構函式的基礎類別加上裝飾器。
* 為回報錯誤的類別加入明確的建構函式。

<a id="v15-bc-06"></a>

#### 附加 `ControlValueAccessor` 時一律會呼叫 `setDisabledState`

在 v15 中，附加 `ControlValueAccessor` 時一律會呼叫 `setDisabledState`。[PR #47576](https://github.com/angular/angular/pull/47576)

你可以使用 `FormsModule.withConfig` 或 `ReactiveFormsModule.withConfig` 來選擇退出此行為。

<a id="v15-bc-07"></a>

#### `canParse` 方法已移除

`canParse` 方法已從 `@angular/localize/tools` 中的所有翻譯解析器移除。[PR #47275](https://github.com/angular/angular/pull/47275)

在 v15 中，應改用 `analyze`，且剖析方法中的 `hint` 參數為必填。

<a id="v15-bc-08"></a>

#### `ActivatedRouteSnapshot` 上的 `title` 屬性為必填

在 v15 中，[`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot) 上的 `title` 屬性為必填。[PR #47481](https://github.com/angular/angular/pull/47481)

<a id="v15-bc-09"></a>

#### `RouterOutlet` 在變更偵測之後才執行個體化元件

在 v15 之前，導覽期間 `RouterOutlet` 會立即執行個體化正在啟用的元件。[PR #46554](https://github.com/angular/angular/pull/46554)

在 v15 中，元件要等到變更偵測執行後才會執行個體化。
此變更可能會影響在路由器導覽後未觸發變更偵測的測試。
這也可能影響仰賴元件可用性確切時機的正式程式碼，
例如元件的建構函式呼叫 `router.getCurrentNavigation()` 的情況。

<a id="v15-bc-10"></a>

#### Router 中的 `relativeLinkResolution` 無法設定

在 v15 中，Router 中的 `relativeLinkResolution` 無法設定。[PR #47623](https://github.com/angular/angular/pull/47623)

在先前的版本中，此選項用於選擇退出某個錯誤修正。

<a id="v15-bc-04"></a>

#### Angular 編譯器選項 `enableIvy` 已移除

Angular 編譯器選項 `enableIvy` 已移除，因為 Ivy 是 Angular 唯一的算繪引擎。[PR #47346](https://github.com/angular/angular/pull/47346)

<a id="v15-bc-10"></a>

#### 以 MDC 為基礎的 Angular Material 元件

在 Angular Material v15 中，許多元件已重構為以官方 Web 版 Material Design Components (MDC) 為基礎。
如需進一步了解 Material 元件 v15 的破壞性變更，請參閱[遷移到以 MDC 為基礎的 Angular Material 元件](https://material.angular.io/guide/mdc-migration)。

<a id="v15-bc-11"></a>

#### 強化 `<iframe>` 元素的屬性與特性繫結規則

現有的 `<iframe>` 執行個體可能會以屬性或特性繫結的方式，套用具安全性敏感的屬性。
這些具安全性敏感的屬性可能出現在範本中，或出現在指令的宿主繫結中。
出現這類情況時，需要更新以確保符合關於 `<iframe>` 繫結的更新且更嚴格的規則。
更多資訊請參閱[錯誤頁面](/errors/NG0910)。

<a id="deprecations"></a>

## Angular v15 的棄用項目

以下是正在逐步淘汰的 Angular 功能。
它們在 v15 中仍然可用，但如 Angular 的[棄用實務](/guide/releases#淘汰實務)所述，未來版本可能會移除它們。

為維持 Angular 應用程式的可靠性，請檢視這些注意事項，並儘快更新你的應用程式。

| 已移除 | 取代項目 | 詳細說明 |
| :--- | :--- |:--- |
| <a id="v15-dp-01"></a>[`DATE_PIPE_DEFAULT_TIMEZONE`](api/common/DATE_PIPE_DEFAULT_TIMEZONE) | [`DATE_PIPE_DEFAULT_OPTIONS`](api/common/DATE_PIPE_DEFAULT_OPTIONS) | `DATE_PIPE_DEFAULT_OPTIONS` 中的 `timezone` 欄位定義時區。<br>[PR #43611](https://github.com/angular/angular/pull/43611) |
| <a id="v15-dp-02"></a>帶有 `InjectFlags` 參數的 [`Injector.get()`](api/core/Injector#get) | 帶有 `InjectOptions` 物件的 [`Injector.get()`](api/core/Injector#get) | [PR #41592](https://github.com/angular/angular/pull/41592) |
| <a id="v15-dp-03"></a>帶有 `InjectFlags` 參數的 [`TestBed.inject()`](api/core/testing/TestBed#inject) | 帶有 `InjectOptions` 物件的 [`TestBed.inject()`](api/core/testing/TestBed#inject) | [PR #46761](https://github.com/angular/angular/pull/46761) |
| <a id="v15-dp-04"></a>適用於 [`@Injectable`](api/core/Injectable) 與 [`InjectionToken`](api/core/InjectionToken) 的 `providedIn: NgModule`<br><a id="v15-dp-05"></a>適用於 `@Injectable` 或 `InjectionToken` 的 `providedIn: 'any'` | 請參閱詳細說明 | `providedIn: NgModule` 旨在作為 `NgModule` 提供者的可搖樹 (tree-shakable) 替代方案。它沒有廣泛使用，且經常在應偏好 `providedIn: 'root'` 的情況下被誤用。如果提供者必須限定於特定 [`NgModule`](api/core/NgModule)，請改用 `NgModule.providers`。[PR #47616](https://github.com/angular/angular/pull/47616)|
| <a id="v15-dp-06"></a>[`RouterLinkWithHref`](api/router/RouterLinkWithHref) 指令 | [`RouterLink`](api/router/RouterLink) 指令 | `RouterLink` 指令包含來自 `RouterLinkWithHref` 指令的程式碼，用於處理具有 `href` 屬性的元素。[PR #47630](https://github.com/angular/angular/pull/47630)，[PR #47599](https://github.com/angular/angular/pull/47599)|

如需進一步了解 Material 元件 v15 的棄用項目，請參閱[遷移到以 MDC 為基礎的 Angular Material 元件](https://material.angular.io/guide/mdc-migration)。

@reviewed 2022-11-15
