# 將 Angular 更新至 v16

<!-- NOTE to writers: When creating the topic for the next version,                               -->
<!--   remember to update the redirect link in angular/aio/firebase.json                          -->
<!-- To update the redirect link in angular/aio/firebase.json:                                    -->
<!--   1. Search for the entry in firebase.json with "source": "guide/update-to-latest-version"   -->
<!--   2,  Update the destination value to refer to the new guide's URL                           -->
<!--                                                                                              -->

本主題提供將 Angular 應用程式更新至 Angular 16 版的相關資訊。

如需本資訊的摘要，以及將 Angular 應用程式更新至 v16 的逐步程序，請參閱 [Angular 更新指南](https://update.angular.io)。

[Angular 更新指南](https://update.angular.io)與本主題的資訊，摘要自以下變更紀錄：

*  [angular/angular 變更紀錄](https://github.com/angular/angular/blob/main/CHANGELOG.md)
*  [angular/angular-cli 變更紀錄](https://github.com/angular/angular-cli/blob/main/CHANGELOG.md)
*  [angular/components 變更紀錄](https://github.com/angular/components/blob/main/CHANGELOG.md)

將 Angular 應用程式更新至 v15 的資訊已封存於[更新至 15 版](/guide/update-to-version-15)。

<a id="new-features"></a>

## Angular v16 的功能亮點

如需更完整的新功能清單，請參閱[關於更新至 v16 的 Angular 部落格文章](https://blog.angular.io)。

<!-- markdownLint-disable MD001 -->

#### Angular Signals 開發者預覽版

此版本包含 Angular 全新反應式基本要素的第一個開發者預覽版：`signal`、`computed` 與 `effect`。詳情請參閱[訊號指南](/guide/signals)，更多背景資訊請參閱 [Angular Signals RFC](https://github.com/angular/angular/discussions/49685)。

#### 強化水合開發者預覽版

過去，當 Angular 在經過伺服器端渲染或編譯時期預渲染的頁面上啟動時，框架會捨棄既有的 DOM 節點並從頭重新渲染。透過 v16 的強化水合支援，你可以選擇讓 Angular 重複使用這些既有的 DOM 節點。在許多情境下，這項開發者預覽版功能可以改善頁面載入效能。詳情請參閱完整的[水合指南](/guide/hydration)。

### 使用 esbuild 開發者預覽版加快建置速度

v16 為你帶來以 [esbuild](https://esbuild.github.io) 為基礎的全新 Angular CLI 建置器的開發者預覽版。在許多情境下，這種新架構可以大幅改善建置時間。此預覽版還整合了 [Vite](https://vitejs.dev)，為 CLI 的開發伺服器提供支援。

你可以更新 `angular.json` 來試用這種新的建置設定：

```json
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
```

### 獨立元件遷移與建立

為支援開發人員將應用程式轉換為獨立 API，Angular v16 包含遷移原理圖與獨立遷移指南。這些工具大幅減少了將程式碼移轉至獨立元件、指令與管道所需的工作量。詳情請參閱[獨立遷移指南](/guide/standalone-migration)。

你現在也可以執行下列指令，以獨立元件產生新的 Angular 應用程式：

```sh
ng new --standalone
```

### 必要輸入

你現在可以將元件與指令的輸入標記為_必要_：

```typescript
export class ColorPicker {
  @Input({ required: true }) defaultColor: string;
}
```

如果範本包含某個元件，卻未指定其全部必要輸入，Angular 會在建置時期回報錯誤。

<a id="breaking-changes"></a>

## Angular v16 中值得注意的重大變更

如需重大變更的完整清單，請參閱 GitHub 上的完整變更紀錄。

<a id="v16-bc-01"></a>

### Angular v16 需要 node.js v16 或 v18 版

Angular 需要 node.js v16 或 v18 版。[PR #47730](https://github.com/angular/angular/pull/49255)

完整版本相容性詳情請參閱[版本相容性](/guide/versions)。

<a id="v16-bc-02"></a>

### Angular v16 需要 TypeScript 4.9 或更新版本

Angular v16 不再支援 4.9 之前的 TypeScript 版本。[PR #49155](https://github.com/angular/angular/pull/49155)

完整版本相容性詳情請參閱[版本相容性](/guide/versions)。

<a id="v16-bc-03"></a>

### Angular 相容性編譯器（ngcc）已移除

Angular 相容性編譯器（ngcc）是一個建置工具，可協助 Angular 先前的編譯器與渲染架構（View Engine）及其新架構（Ivy）之間的相容性。

View Engine 已在 Angular v13 移除，v16 終於移除了 ngcc。因此，以 View Engine 建置的 Angular 程式庫無法在 Angular v16 以上版本使用。

<a id="v16-bc-04"></a>

#### Angular 套件格式變更

Angular 套件格式（APF）已更新，變更如下：

* 已移除扁平化 ESM 2015（FESM2015）輸出。
* EcmaScript 2020 輸出已更新為 EcmaScript 2022（包含扁平化輸出）。

背景資訊請參閱 [Angular 套件格式](/guide/angular-package-format)。

<a id="v16-bc-06"></a>

#### `ReflectiveInjector` 已移除

ReflectiveInjector 及相關符號已移除。請更新程式碼，避免參照 ReflectiveInjector 符號。請改用 `Injector.create` 來建立注入器。

<a id="v16-bc-07"></a>

#### `Router.createUrlTree` 的行為已更新

模擬 `ActivatedRoute` 執行個體的測試可能需要調整，因為 Router.createUrlTree 現在在更多情境下會做出正確的行為。這表示，使用無效或不完整的 ActivatedRoute 模擬的測試，其行為可能與過去不同。此外，測試現在可能導覽至真實 URL，而過去則會導覽至根目錄。請確認測試提供預期的路由以便比對。實際上線的影響很少見，但已發現，在使用未出現在目前路由器狀態中的 `ActivatedRoute` 進行相對導覽時，過去實際上會被忽略。透過建立正確的 URL，這有時會導致應用程式中的導覽行為有所不同。這種情況最常發生在嘗試建立僅更新查詢參數的導覽時，使用空的命令陣列，例如 `router.navigate([], {relativeTo: route, queryParams: newQueryParams})`。在此情況下，應移除 `relativeTo` 屬性。

<a id="deprecations"></a>

## Angular v16 中的棄用亮點

這些 API 在 v16 中仍可使用，但依 Angular 的[棄用做法](/guide/releases#淘汰實務)所述，未來版本可能會移除。

為維持 Angular 應用程式的可靠性，請務必在切實可行的情況下盡快更新應用程式。

| 已移除                                                                              | 取代方案 | 詳細資訊                                                                                                                                                                                                                                          |
|:-------------------------------------------------------------------------------------|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <a id="v16-dp-01"></a>類別與 `InjectionToken` 路由守衛及解析器                       | 請參閱詳細資訊 | 類別與 `InjectionToken` 守衛及解析器已棄用。請改將守衛寫成一般的 JavaScript 函式，並使用 `@angular/core` 的 `inject` 注入依賴。<br>[PR #47924](https://github.com/angular/angular/pull/47924) |
| <a id="v16-dp-02"></a>數個 Angular Material 元件的 `ripple` 屬性                    | 無        | `MatButton`、`MatCheckbox`、`MatChip` 的 `ripple` 屬性已棄用。這項變更將漣漪效果改為元件的私人實作細節。                                                                                                                                         |

@reviewed 2023-05-03
