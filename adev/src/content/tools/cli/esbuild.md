# 開始使用 Angular CLI 的新建置系統

在 v17 及更高版本中，新的建置系統提供了建置 Angular 應用程式的新方法。這個新的建置系統包含：

- 使用 ESM 的現代輸出格式，具有動態導入表達式來支援延遲模組載入。
- 對於初始建構和增量重建，都有更快的建構時間效能。
- 更新的 JavaScript 生態系統工具，例如 [esbuild](https://esbuild.github.io/) 和 [Vite](https://vitejs.dev/)。
- 整合的 SSR 和預先渲染功能。

這個新的建置系統穩定且完全支援供 Angular 應用程式使用。
您可以將使用 `browser` 建置器的應用程式遷移至新的建置系統。
如果使用自訂建置器，請參閱該建置器的文件以了解可能的遷移選項。

重要：現有的基於 Webpack 的建置系統仍被視為穩定且獲得完全支援。
應用程式可以繼續使用 `browser` 建置器，並且在更新時不會自動遷移。

## 針對新應用程式

新的應用程式會透過 `application` 建構器預設使用此新的建構系統。

## 對於現有應用程式

對於現有的專案，您可以選擇使用兩個不同的選項，以逐個應用程式的方式使用新的建構器。
Angular 團隊認為這兩個選項都很穩定，並提供完整的支援。
選擇使用哪個選項取決於您在遷移時需要進行多少變更，以及您想在專案中使用哪些新功能。

- `browser-esbuild` 建構器僅建構應用程式的用戶端套件，設計上與現有 `browser` 建構器相容，該建構器提供既有的建構系統。它可作為現有 `browser` 應用程式的簡易替換。
- `application` 建構器涵蓋整個應用程式，例如用戶端套件，以及選擇性地建構一個用於伺服器端渲染的伺服器，並執行靜態頁面的建構時間預先渲染。

一般來說建議使用 `application` 建構器，因為它可以改進伺服器端渲染 (SSR) 建置，並且讓客戶端渲染專案在將來更容易採用 SSR。
然而，它需要一點額外的遷移工作，尤其是現有的 SSR 應用程式。
如果專案難以採用 `application` 建構器，`browser-esbuild` 可以是一個較簡單的解決方案，它可以提供大部分的建置效能優勢，而且變更較少。

### 使用 `browser-esbuild` builder

在 Angular CLI 產生的應用程式中，`@angular-devkit/build-angular` 套件內提供一個名為 `browser-esbuild` 的建構工具。
您可以針對使用 `browser` 建構工具的應用程式嘗試新的建構系統。
如果使用自訂建構工具，請參閱該建構工具的文件，以了解可能的遷移選項。

相容性選項是為了最小化應用程式在最初遷移時必要的變更量而實作的。
這透過備用建構器 (`browser-esbuild`) 提供。
您可以更新任何應用程式目標的 `build` 目標，以遷移至新的建構系統。

以下是在 `angular.json` 中通常會找到的應用程式範例：

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</docs-code>

更改 `builder` 欄位是您唯一需要做的變更。

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
</docs-code>

### 使用 `application` 建構函數

在 Angular CLI 產生的應用程式中，`@angular-devkit/build-angular` 套件中也有一個名為 `application` 的建構器。
這個建構器是所有透過 `ng new` 建立的新應用程式的預設建構器。

以下是在 `angular.json` 中通常會找到的應用程式範例：

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</docs-code>

更改 `builder` 欄位是您需要做的第一個變更。

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
</docs-code>

一旦變更建構器名稱，`build` 目標中的選項就需要更新。
下列清單討論所有需要調整的 `browser` 建構器選項。

- `main` 應重新命名為 `browser`。
- `polyfills` 應為陣列，而非單一檔案。
- 應移除 `buildOptimizer`，因為這已涵蓋在 `optimization` 選項中。
- 應移除 `resourcesOutputPath`，這現在總是 `media`。
- 應移除 `vendorChunk`，因為這是一項效能最佳化，現在已不再需要。
- 應移除 `commonChunk`，因為這是一項效能最佳化，現在已不再需要。
- 應移除 `deployUrl`，且不支援。請改用 [`<base href>`](guide/routing/common-router-tasks)。請參閱 [佈署文件](tools/cli/deployment#--deploy-url)以取得更多資訊。
- 應將 `ngswConfigPath` 重新命名為 `serviceWorker`。

如果應用程式目前未使用 SSR，這應是最後一個步驟，以允許 `ng build` 發揮作用。
首次執行 `ng build` 之後，可能會出現新的警告或錯誤，這些警告或錯誤是基於行為差異或應用程式使用 Webpack 特定功能而來。
許多警告會提供有關如何解決該問題的建議。
如果警告看來不正確，或解決方案不明顯，請在 [GitHub](https://github.com/angular/angular-cli/issues) 上開啟一個問題。
此外，本指南的後續章節提供了有關多個特定案例以及目前已知問題的其他資訊。

對於新的 SSR 應用程式，[Angular SSR 指南](guide/ssr) 提供有關將 SSR 新增到應用程式的設定程序的其他資訊。

對於已經使用 SSR 的應用程式，需要額外調整以更新應用程式伺服器，以支援新的整合 SSR 功能。
`application` 建構函數現在為所有下列預先存在的建構函數提供整合功能：

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

`ng update` 程序會自動移除 `@nguniversal` 範圍套件的使用，這些建構器先前位於其中。
新的 `@angular/ssr` 套件也會自動新增，並在更新期間調整設定和程式碼。
`@angular/ssr` 套件支援 `browser` 建構器和 `application` 建構器。
若要從個別 SSR 建構器轉換成 `application` 建構器的整合功能，請執行實驗性質的 `use-application-builder` 移轉。

<docs-code language="shell">

ng update @angular/cli --name use-application-builder

</docs-code>

遷移執行下列動作：

* 將現有的 `browser` 或 `browser-esbuild` 目標轉換為 `application`
* 移除任何之前的 SSR 建構器（因為 `application` 現在會執行此操作）。
* 相應地更新配置。
* 將 `tsconfig.server.json` 與 `tsconfig.app.json` 合併，並添加 TypeScript 選項 `"esModuleInterop": true` 以確保 `express` 導入與 [ESM 相容](#esm-default-imports-vs-namespace-imports)。
* 更新應用程式伺服器程式碼以使用新的引導和輸出目錄結構。

HELPFUL：請記得移除應用程式伺服器程式碼中的任何 CommonJS 假設，例如 `require`、`__filename`、`__dirname` 或 [CommonJS 模組範圍](https://nodejs.org/api/modules.html#the-module-scope) 中的其他結構。所有應用程式程式碼都應該與 ESM 相容。這不適用於第三方依賴項。

## 執行建置

一旦您更新應用程式設定，即可使用 `ng build` 來執行建置，如同先前所做的一樣。
根據建置器遷移的選擇，某些命令列選項可能會有所不同。
如果建置指令包含在任何 `npm` 或其他指令碼中，請確定已檢閱並更新。
對於已遷移至 `application` 建置器且使用 SSR 和/或預先渲染的應用程式，您現在也可以從指令碼中移除額外的 `ng run` 指令，因為 `ng build` 已整合 SSR 支援。

<docs-code language="shell">

ng build

</docs-code>

## 啟動開發伺服器

開發伺服器會自動偵測新的建置系統，並使用該系統來建置應用程式。
要啟動開發伺服器，無需對 `dev-server` 建置工具配置或命令列進行任何變更。

<docs-code language="shell">

ng serve

</docs-code>

您可以繼續使用過去在開發伺服器中使用過的 [命令列選項](/cli/serve)。

## 熱模組更換

基於 JavaScript 的熱模組替換 (HMR) 目前不支援。
然而，預設啟用並提供全域樣式表 (`styles` 建置選項) HMR。
目前已規劃 Angular 重點 HMR 功能，並會在未來版本中推出。

## 未實現的選項和行為

多種建置選項尚未實作，但會在建置系統趨於穩定狀態時於未來加入。如果您的應用程式使用這些選項，您仍然可以在不移除它們的情況下測試建置系統。系統會針對任何未實作的選項發出警告，但否則會忽略它們。不過，如果您的應用程式仰賴其中任何一個選項才能運作，您可能需要等到測試。

- [WASM 匯入](https://github.com/angular/angular-cli/issues/25102) -- WASM 仍可透過 [標準網路 API](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running) 手動載入。

## ESM 預設匯入與命名空間匯入的比較

TypeScript 預設允許將預設匯出作為命名空間匯入，然後在呼叫表達式中使用。
很不幸地，這偏離了 ECMAScript 規範。
新建置系統中的底層套件組合器 (`esbuild`) 預期 ESM 程式碼會符合規範。
如果您的應用程式使用錯誤的套件匯入類型，建置系統現在會產生警告。
但是，為了讓 TypeScript 接受正確的用法，必須在應用程式的 `tsconfig` 檔案中啟用 TypeScript 選項。
啟用後，[`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) 選項會提供與 ECMAScript 規範更好的對齊，TypeScript 團隊也建議啟用此選項。
啟用後，您可以將適用的套件匯入更新為符合 ECMAScript 的格式。

使用 [`moment`](https://npmjs.com/package/moment) 套件為例，以下應用程式碼會造成執行時期錯誤：

```ts
import * as moment from 'moment';

console.log(moment().format());
```

建置會產生警告，通知您有潛在問題。警告會類似於：

<docs-code language="text">
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~


Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment


</docs-code>

不過，你可以透過為應用程式啟用 `esModuleInterop` TypeScript 選項，並將匯入變更為下列內容來避免執行時期錯誤和警告：

```ts
import moment from 'moment';

console.log(moment().format());
```

## Vite 作為開發伺服器

Vite 在 Angular CLI 中的使用目前僅限於 _開發伺服器容量_。即使不使用底層的 Vite 建構系統，Vite 也提供了一個功能齊全的開發伺服器，並具有已捆綁到低依賴 npm 套件中的客戶端側支援。這使其成為提供全面的開發伺服器功能的理想候選者。當前的開發伺服器程序使用新的建構系統在記憶體中自動建立應用程式的開發建構，並將結果傳遞給 Vite 以服務應用程式。Vite 的使用與基於 Webpack 的開發伺服器非常相似，被封裝在 Angular CLI `dev-server` 建構器中，目前無法直接配置。

## 已知問題

當您嘗試新的建置系統時，目前會遇到幾個已知問題。此清單將會更新以保持最新狀態。如果您目前因為任何這些問題而無法嘗試新的建置系統，請在未來再次查看，因為問題可能已經解決。

### Web Worker 程式碼的類型檢查和處理嵌套的 Web Worker

Web Workers 可使用與 `browser` 建構函式支援的相同語法 (`new Worker(new URL('<workerfile>', import.meta.url))`) 在應用程式程式碼中使用。
但是，Worker 中的程式碼目前不會由 TypeScript 編譯器進行類型檢查。TypeScript 程式碼受支援，只是不會進行類型檢查。
此外，任何巢狀 worker 都不會由建構系統處理。巢狀 worker 是另一個 Worker 檔案中的 Worker 實例化。

### 延遲載入模組中的順序依賴副作用匯入

依賴特定順序的 Import 陳述式且在多個延遲模組中使用，可能會導致頂層陳述式以不正確的順序執行。
這並不常見，因為這取決於副作用模組的使用，而且不適用於 `polyfills` 選項。
這是由於底層打包工具的一個 [缺陷](https://github.com/evanw/esbuild/issues/399)，但將會在未來的更新中修復。

重要：強烈建議盡可能避免使用具有非本地副作用的模組（多重填充之外），無論使用哪種建構系統，都能避免這個特定問題。具有非本地副作用的模組會對應用程式大小和執行階段效能造成負面影響。

## 錯誤回報

在 [GitHub](https://github.com/angular/angular-cli/issues) 上報告問題和功能請求。

如有可能，請提供一個最小的重現範例，以幫助團隊解決問題。
