# 開始使用 Angular CLI 的新建置系統

在 v17 及更高版本中，新的建置系統提供了建置 Angular 應用程式的改良方式。這個新的建置系統包括：

- 使用 ESM 的現代化輸出格式，並透過動態匯入運算式支援模組延遲載入。
- 更快的建置效能，無論是初次建置還是增量重新建置。
- 較新的 JavaScript 生態系工具，例如 [esbuild](https://esbuild.github.io/) 與 [Vite](https://vitejs.dev/)。
- 整合的 SSR 與預渲染功能。

這個新的建置系統已穩定且完整支援用於 Angular 應用程式。你可以將使用 `browser` 建置器的應用程式遷移到新的建置系統。若使用自訂建置器，請參閱該建置器的文件，了解可能的遷移選項。

IMPORTANT: 既有的以 Webpack 為基礎的建置系統仍被視為穩定且受完整支援。應用程式可以繼續使用 `browser` 建置器，且在更新時不會被自動遷移。

## 新應用程式

新應用程式會透過 `application` 建置器，預設使用這個新的建置系統。

## 既有應用程式

對於既有專案，你可以針對每個應用程式分別選擇使用新的建置器，有兩種不同的選項。這兩個選項都被視為穩定，且獲得 Angular 團隊的完整支援。要使用哪個選項，取決於你遷移時需要做多少變更，以及你想在專案中使用哪些新功能。

- `browser-esbuild` 建置器只建置應用程式的用戶端套件包，其設計目的是與提供既有建置系統的既有 `browser` 建置器相容。它可以作為既有 `browser` 應用程式的直接替代品。
- `application` 建置器涵蓋整個應用程式，例如用戶端套件包，也可以選擇性地建置用於伺服器端渲染的伺服器，並在建置時預渲染靜態頁面。

`application` 建置器通常更受青睞，因為它改善了伺服器端渲染（SSR）的建置，並讓以用戶端渲染為主的專案在未來更容易採用 SSR。然而，它需要稍多一些遷移工作，對既有的 SSR 應用程式尤其如此。若你的專案難以採用 `application` 建置器，`browser-esbuild` 可以是較簡單的解決方案，它能以較少的破壞性變更，提供大部分的建置效能優勢。

### 使用 `browser-esbuild` 建置器

名為 `browser-esbuild` 的建置器，位於 Angular CLI 產生的應用程式中隨附的 `@angular-devkit/build-angular` 套件中。你可以為使用 `browser` 建置器的應用程式試用新的建置系統。若使用自訂建置器，請參閱該建置器的文件，了解可能的遷移選項。

相容選項的實作目的，是將初次遷移應用程式所需的變更量減到最低。這是透過替代建置器（`browser-esbuild`）提供的。你可以更新任何應用程式目標的 `build` 目標，以遷移到新的建置系統。

以下通常是你會在應用程式的 `angular.json` 中看到的內容：

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</docs-code>

你唯一需要做的變更，就是更改 `builder` 欄位。

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
</docs-code>

### 使用 `application` 建置器

名為 `application` 的建置器，也位於 Angular CLI 產生的應用程式中隨附的 `@angular-devkit/build-angular` 套件中。這個建置器是透過 `ng new` 建立的所有新應用程式的預設建置器。

以下通常是你會在應用程式的 `angular.json` 中看到的內容：

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</docs-code>

你需要做的第一個變更，就是更改 `builder` 欄位。

<docs-code language="json">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
</docs-code>

建置器名稱變更之後，`build` 目標內的選項也需要更新。以下清單說明所有需要調整的 `browser` 建置器選項。

- `main` 應重新命名為 `browser`。
- `polyfills` 應為陣列，而非單一檔案。
- `buildOptimizer` 應移除，因為這已由 `optimization` 選項涵蓋。
- `resourcesOutputPath` 應移除，現在它永遠是 `media`。
- `vendorChunk` 應移除，因為這是已不再需要的效能最佳化。
- `commonChunk` 應移除，因為這是已不再需要的效能最佳化。
- `deployUrl` 應移除，且不受支援。請改用 [`<base href>`](guide/routing/common-router-tasks)。更多資訊請參閱[部署文件](tools/cli/deployment#--deploy-url)。
- `ngswConfigPath` 應重新命名為 `serviceWorker`。

若應用程式目前未使用 SSR，這應該就是讓 `ng build` 能運作的最後一步。第一次執行 `ng build` 之後，可能會基於行為差異，或應用程式使用了 Webpack 專屬功能，而出現新的警告或錯誤。許多警告會提供如何補救該問題的建議。若某個警告看起來不正確，或解決方式不明確，請在 [GitHub](https://github.com/angular/angular-cli/issues) 上開啟 issue。本指南後面的章節也提供了幾個特定案例的額外資訊，以及目前的已知問題。

對於初次使用 SSR 的應用程式，[Angular SSR 指南](guide/ssr) 提供了關於為應用程式加入 SSR 的設定過程的額外資訊。

對於已經在使用 SSR 的應用程式，還需要做額外的調整，以更新應用程式伺服器，使其支援新的整合式 SSR 功能。`application` 建置器現在為以下所有既有建置器提供了整合功能：

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

`ng update` 過程會自動移除對 `@nguniversal` 作用域套件的使用方式，先前的一些建置器就位於這些套件中。新的 `@angular/ssr` 套件也會在更新期間自動加入並使用，組態與程式碼會一併調整。`@angular/ssr` 套件同時支援 `browser` 建置器與 `application` 建置器。若要從個別的 SSR 建置器轉換為 `application` 建置器的整合功能，請執行實驗性的 `use-application-builder` 遷移。

<docs-code language="shell">

ng update @angular/cli --name use-application-builder

</docs-code>

此遷移會執行以下事項：

* 將既有的 `browser` 或 `browser-esbuild` 目標轉換為 `application`
* 移除任何先前的 SSR 建置器（因為 `application` 現在已內建此功能）。
* 相應地更新組態。
* 將 `tsconfig.server.json` 與 `tsconfig.app.json` 合併，並加入 TypeScript 選項 `"esModuleInterop": true`，以確保 `express` 匯入符合 [ESM 規範](#esm-default-imports-vs-namespace-imports)。
* 更新應用程式伺服器程式碼，以使用新的啟動方式與輸出目錄結構。

HELPFUL: 請記得移除應用程式伺服器程式碼中任何 CommonJS 假設，例如 `require`、`__filename`、`__dirname`，或 [CommonJS 模組作用域](https://nodejs.org/api/modules.html#the-module-scope)中的其他結構。所有應用程式程式碼都應與 ESM 相容。這不適用於第三方依賴。

## 執行建置

更新應用程式組態之後，就可以像以前一樣使用 `ng build` 執行建置。視建置器遷移的選擇而定，一些命令列選項可能會有所不同。若建置指令包含在任何 `npm` 或其他指令稿中，請確保它們已檢閱並更新。對於已遷移到 `application` 建置器且使用 SSR 及／或預渲染的應用程式，現在 `ng build` 已整合 SSR 支援，你也許可以從指令稿中移除額外的 `ng run` 指令。

<docs-code language="shell">

ng build

</docs-code>

## 啟動開發伺服器

開發伺服器會自動偵測新的建置系統，並用它來建置應用程式。啟動開發伺服器不需要對 `dev-server` 建置器組態或命令列做任何變更。

<docs-code language="shell">

ng serve

</docs-code>

你可以繼續使用過去在開發伺服器上使用過的[命令列選項](/cli/serve)。

## 熱模組替換 {#hot-module-replacement}

目前不支援以 JavaScript 為基礎的熱模組替換（HMR）。然而，全域樣式表（`styles` 建置選項）的 HMR 可供使用，且預設啟用。以 Angular 為核心的 HMR 功能目前正在規劃中，將在未來的版本中引入。

## 未實作的選項與行為

有幾個建置選項尚未實作，但隨著建置系統邁向穩定狀態，未來會陸續加入。如果你的應用程式使用這些選項，你仍然可以試用建置系統，不必移除它們。任何未實作的選項都會發出警告，但除此之外會被忽略。然而，如果你的應用程式依賴這些選項中的任何一個才能運作，你可能會想先等一等再試用。

- [WASM 匯入](https://github.com/angular/angular-cli/issues/25102) -- WASM 仍可透過[標準 Web API](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running) 手動載入。

## ESM 預設匯入 vs. 命名空間匯入 {#esm-default-imports-vs-namespace-imports}

TypeScript 依預設允許將預設匯出以命名空間匯入的方式匯入，然後用在呼叫運算式中。不幸的是，這與 ECMAScript 規格有所出入。新版建置系統底層的綑綁工具（`esbuild`）預期 ESM 程式碼符合規格。若你的應用程式對套件使用了不正確的匯入類型，建置系統現在會產生警告。然而，若要讓 TypeScript 接受正確的用法，必須在應用程式的 `tsconfig` 檔案中啟用一個 TypeScript 選項。啟用後，[`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) 選項能與 ECMAScript 規格有更好的對齊，這也是 TypeScript 團隊所建議的。啟用之後，你就可以在適用的地方將套件匯入更新為符合 ECMAScript 的形式。

以 [`moment`](https://npmjs.com/package/moment) 套件為例，以下應用程式程式碼會造成執行階段錯誤：

```ts
import * as moment from 'moment';

console.log(moment().format());
```

建置會產生警告，通知你有潛在的問題。警告會類似以下內容：

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

然而，你可以透過為應用程式啟用 `esModuleInterop` TypeScript 選項，並將匯入改為以下形式，來避免執行階段錯誤與警告：

```ts
import moment from 'moment';

console.log(moment().format());
```

## 以 Vite 作為開發伺服器

Vite 在 Angular CLI 中的使用，目前_僅限於開發伺服器用途_。即使不使用底層的 Vite 建置系統，Vite 也提供了功能完整的開發伺服器與用戶端支援，並已綑綁為一個低依賴的 npm 套件。這使它成為提供完整開發伺服器功能的理想選擇。目前的開發伺服器程序會使用新的建置系統，在記憶體中產生應用程式的開發建置，並將結果傳給 Vite 來提供應用程式。Vite 的使用方式，就像以 Webpack 為基礎的開發伺服器一樣，被封裝在 Angular CLI 的 `dev-server` 建置器中，目前無法直接設定。

## 已知問題 {#known-issues}

目前有幾個你可能會遇到的已知問題。這個清單會持續更新以保持最新。若這些問題中有任何一個目前正阻礙你試用新的建置系統，請日後再回來查看，因為它可能已經被解決。

### Web Worker 程式碼的型別檢查與巢狀 Web Worker 的處理

Web Worker 可以在應用程式程式碼中使用與 `browser` 建置器相同的語法（`new Worker(new URL('<workerfile>', import.meta.url))`）。然而，Worker 內的程式碼目前不會由 TypeScript 編譯器進行型別檢查。TypeScript 程式碼有支援，只是不做型別檢查。此外，任何巢狀 Worker 都不會被建置系統處理。巢狀 Worker 是指在另一個 Worker 檔案中實例化的 Worker。

### 延遲模組中與順序相關的副作用匯入

若匯入陳述式依賴特定順序，且同時用在多個延遲模組中，可能會造成頂層陳述式以錯誤的順序執行。這並不常見，因為它取決於副作用模組的使用方式，且不適用於 `polyfills` 選項。這是由底層綑綁工具的一個[缺陷](https://github.com/evanw/esbuild/issues/399)造成的，但會在未來的更新中處理。

IMPORTANT: 無論使用哪種建置系統，都建議盡可能避免使用具有非本機副作用的模組（polyfills 除外），如此也能避開這個特定問題。具有非本機副作用的模組，對應用程式大小與執行階段效能都可能有負面影響。

## 問題回報

在 [GitHub](https://github.com/angular/angular-cli/issues) 上回報問題與功能請求。

請儘可能提供最小重現範例，以協助團隊處理問題。
