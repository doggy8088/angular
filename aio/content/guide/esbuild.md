# 開始使用 CLI 以 esbuild 為基礎的建置系統

<div class="alert is-important">

以 esbuild 為基礎的 ECMAScript 模組（ESM）應用程式建置系統功能，目前以[開發人員預覽版](/guide/releases#開發者預覽)提供。你可以開始試用它，但它在穩定之前可能還會變更，目前也不建議用於正式生產建置。

</div>

在 v16 及更高版本中，新的建置系統提供了一種建置 Angular 應用程式的方式。這個新的建置系統包括：

- 使用 ESM 的現代化輸出格式，並透過動態匯入運算式支援模組延遲載入。
- 更快的建置效能，無論是初次建置還是增量重新建置。
- 較新的 JavaScript 生態系工具，例如 [esbuild](https://esbuild.github.io/) 與 [Vite](https://vitejs.dev/)。

你可以按個別應用程式選擇使用新的建置器，只需做最少的組態更新。

## 在 Angular CLI 應用程式中試用 ESM 建置系統

在 Angular CLI 產生的應用程式中，`@angular-devkit/build-angular` 套件內提供了一個名為 `browser-esbuild` 的新版建置器。這個建置是現有 `browser` 建置器的直接替代品，而 `browser` 建置器提供目前穩定的瀏覽器應用程式建置系統。你可以為使用 `browser` 建置器的應用程式試用新的建置系統。

### 更新應用程式組態

新的建置系統在實作時，盡可能減少轉移應用程式所需的變更量。目前，新的建置系統是透過另一個建置器（`browser-esbuild`）提供。你可以更新任何應用程式目標的 `build` 目標來試用新的建置系統。

以下通常是你會在應用程式的 `angular.json` 中看到的內容：

<code-example language="json" hideCopy="true">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
</code-example>

你唯一需要做的變更，就是更改 `builder` 欄位。

<code-example language="json" hideCopy="true">
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
</code-example>

### 執行建置
更新應用程式組態後，你可以像以前一樣使用 `ng build` 執行建置。對於開發人員預覽版中目前尚未實作的其餘選項，每個選項都會發出警告，並在建置期間被忽略。

<code-example language="shell">

ng build

</code-example>

### 啟動開發伺服器
開發伺服器現在能夠自動偵測新的建置系統，並用它來建置應用程式。要啟動開發伺服器，不需要對 `dev-server` 建置器組態或命令列做任何變更。

<code-example language="shell">

ng serve

</code-example>

你可以繼續使用過去在開發伺服器上使用過的[命令列選項](/cli/serve)。

<div class="alert is-important">

開發人員預覽版目前不提供 HMR 支援，若使用與 HMR 相關的選項，這些選項會被忽略。目前已規劃以 Angular 為主的 HMR 功能，將在未來的版本中推出。

</div>

### 未實作的選項與行為
有幾個建置選項尚未實作，但隨著建置系統邁向穩定狀態，未來會陸續加入。如果你的應用程式使用這些選項，你仍然可以試用建置系統，不必移除它們。任何未實作的選項都會發出警告，但除此之外會被忽略。然而，如果你的應用程式依賴這些選項中的任何一個才能運作，你可能會想先等一等再試用。

- [套件預算](https://github.com/angular/angular-cli/issues/25100)（`budgets`）
- [在地化](https://github.com/angular/angular-cli/issues/25099)（`localize`/`i18nDuplicateTranslation`/`i18nMissingTranslation`）
- [Web Worker](https://github.com/angular/angular-cli/issues/25101)（`webWorkerTsConfig`）
- [WASM 匯入](https://github.com/angular/angular-cli/issues/25102)——WASM 仍可透過[標準 Web API](https://developer.mozilla.org/en-US/docs/WebAssembly/Loading_and_running)手動載入。

目前也還無法透過 `ng-packagr` 以新的建置系統建置程式庫，但程式庫建置支援將在未來的版本中提供。

### ESM 預設匯入 vs. 命名空間匯入
TypeScript 依預設允許將預設匯出以命名空間匯入的方式匯入，然後用在呼叫運算式中。不幸的是，這與 ECMAScript 規格有所出入。新版建置系統底層的綑綁工具（`esbuild`）預期 ESM 程式碼符合規格。若你的應用程式對套件使用了不正確的匯入類型，建置系統現在會產生警告。然而，若要讓 TypeScript 接受正確的用法，必須在應用程式的 `tsconfig` 檔案中啟用一個 TypeScript 選項。啟用後，[`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) 選項能與 ECMAScript 規格有更好的對齊，這也是 TypeScript 團隊所建議的。啟用之後，你就可以在適用的地方將套件匯入更新為符合 ECMAScript 的形式。

以 [`moment`](https://npmjs.com/package/moment) 套件為例，以下應用程式程式碼會造成執行階段錯誤：

```ts
import * as moment from 'moment';

console.log(moment().format());
```

建置會產生警告，通知你有潛在的問題。警告會類似以下內容：

<code-example format="shell" language="shell" hideCopy="true">
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

</code-example>

然而，你可以透過為應用程式啟用 `esModuleInterop` TypeScript 選項，並將匯入改為以下形式，來避免執行階段錯誤與警告：

```ts
import moment from 'moment';

console.log(moment().format());
```

## 以 Vite 作為開發伺服器

Vite 在 Angular CLI 中的使用，目前_僅限於開發伺服器用途_。即使不使用底層的 Vite 建置系統，Vite 也提供了功能完整的開發伺服器與用戶端支援，並已綑綁為一個低依賴的 npm 套件。這使它成為提供完整開發伺服器功能的理想選擇。目前的開發伺服器程序會使用新的建置系統，在記憶體中產生應用程式的開發建置，並將結果傳給 Vite 來提供應用程式。Vite 的使用方式，就像以 Webpack 為基礎的開發伺服器一樣，被封裝在 Angular CLI 的 `dev-server` 建置器中，目前無法直接設定。

## 已知問題

目前有幾個你可能會遇到的已知問題。這個清單會持續更新以保持最新。若這些問題中有任何一個目前正阻礙你試用新的建置系統，請日後再回來查看，因為它可能已經被解決。

### 執行階段求值的動態匯入運算式

不含靜態值的動態匯入運算式會保持原樣，不會在建置時處理。這是底層綑綁工具的限制，但未來[計畫](https://github.com/evanw/esbuild/pull/2508)實作。在許多情況下，只要把匯入運算式改成靜態字串，並搭配某種條件陳述式（例如針對已知可能檔案的 `if` 或 `switch`），就能讓應用程式程式碼正常運作。

不支援：

```ts
return await import(`/abc/${name}.json`);
```

支援：

```ts
switch (name) {
  case 'x':
    return await import('/abc/x.json');
  case 'y':
    return await import('/abc/y.json');
  case 'z':
    return await import('/abc/z.json');
}
```

### 延遲模組中與順序相關的副作用匯入

若匯入陳述式依賴特定順序，且同時用在多個延遲模組中，可能會造成頂層陳述式以錯誤的順序執行。這並不常見，因為它取決於副作用模組的使用方式，且不適用於 `polyfills` 選項。這是由底層綑綁工具的一個[缺陷](https://github.com/evanw/esbuild/issues/399)造成的，但會在未來的更新中處理。

<div class="alert is-important">

無論使用哪種建置系統，都建議盡可能避免使用帶有非局部副作用（polyfill 之外）的模組，這樣也能避免這個特定的問題。帶有非局部副作用的模組，對應用程式大小與執行階段效能都可能有負面影響。

</div>

### 搭配 pnpm 或 yarn PnP 使用 Sass 時建置時間變長

使用 pnpm 或 Yarn PnP 套件管理器時，由於需要迴避 Sass 解析不相容的問題，應用程式的建置時間可能會變長。使用這兩種套件管理器時，帶有參照套件的 `@import` 或 `@use` 指令的 Sass 檔案可能會觸發這個效能問題。

另一種能緩解建置時間增加的迴避方法正在開發中，將在建置系統進入穩定狀態前提供。以 node modules 模式運作的 Yarn 套件管理器與 `npm` 套件管理器都不受這個問題影響。

## 問題回報

在 [GitHub](https://github.com/angular/angular-cli/issues) 上回報問題與功能請求。

請儘可能提供最小重現範例，以協助團隊處理問題。
