# npm 套件

Angular 應用程式與 Angular 本身，都依賴各種第三方套件所提供的特性與功能。
這些套件由 Node Package Manager（<a href="https://docs.npmjs.com/">npm</a>）維護與安裝。

<div class="l-sub-section">



Node.js 與 npm 是 Angular 開發不可或缺的工具。

<a href="https://docs.npmjs.com/getting-started/installing-node" title="Installing Node.js and updating npm">
立即取得</a>，如果它們尚未安裝在你的電腦上。

**請確認你執行的是 node `v4.x.x` 或更高版本、npm `3.x.x` 或更高版本**
方法是，在終端機/主控台視窗中執行 `node -v` 與 `npm -v` 指令。
舊版本會產生錯誤。

考慮使用 [nvm](https://github.com/creationix/nvm) 來管理多個
版本的 node 和 npm。如果你的機器上已經有使用其他版本
node 和 npm 執行的專案，你可能需要 [nvm](https://github.com/creationix/nvm)。


</div>



在[設定](guide/setup)期間，會安裝一個 <a href="https://docs.npmjs.com/files/package.json">package.json</a>
檔案，其中包含一組完整的入門套件，
如 `dependencies` 與 `devDependencies` 區段所指定。

你可以使用其他套件，但_這一組特定套件_能良好地協同運作，並包含
建置與執行本系列範例應用程式所需的一切。


<div class="l-sub-section">



注意：食譜或指南頁面可能需要額外的程式庫，例如 *jQuery*。

</div>



你安裝的套件會比快速上手指南所需的還多。
別擔心！
你只會把應用程式實際請求的套件提供給用戶端。

本頁說明每個套件的用途。你可以稍後依自己的喜好與經驗加以替換。



## *相依性* 與 *開發相依性*
`package.json` 包含兩組套件：
[相依性](guide/npm-packages#dependencies) 與 [開發相依性](guide/npm-packages#dev-dependencies)。

*相依性* 對*執行*應用程式至關重要。
*開發相依性* 只在*開發*應用程式時才需要。
你可以透過在安裝指令中加入 `--production`，將它們排除在正式環境安裝之外，如下所示：

<code-example format="." language="bash">
  npm install my-application --production

</code-example>



{@a dependencies}



## *相依性*
`package.json` 的 `dependencies` 區段包含：

* ***特性***: 特性套件為應用程式提供框架與公用程式能力。

* ***Polyfills***: Polyfill 可填補瀏覽器 JavaScript 實作中的缺口。

* ***Other***: 支援應用程式的其他程式庫，例如用於 HTML 小工具與樣式的 `bootstrap`。



### 特性套件

***@angular/core***: 每個應用程式都需要的框架關鍵執行時期部分。
包括所有中繼資料裝飾器、`Component`、`Directive`、依賴注入，以及元件生命週期鉤子。

***@angular/common***: Angular 團隊提供的常用服務、管道與指令。

***@angular/compiler***: Angular 的*範本編譯器*。
它理解範本，並可將其轉換為讓應用程式執行與渲染的程式碼。
通常你不會直接與編譯器互動，而是透過 `platform-browser-dynamic` 或離線範本編譯器間接使用它。

***@angular/platform-browser***: 所有與 DOM 和瀏覽器相關的部分，特別是
協助渲染到 DOM 的那些部分。
此套件也包含 `bootstrapStatic()` 方法，
用於啟動為正式環境建置預先離線編譯範本的應用程式。

***@angular/platform-browser-dynamic***: 包含[提供者](api/core/Provider)
與一個 [bootstrap](guide/ngmodule#bootstrap) 方法，供在用戶端編譯範本的
應用程式使用。不要使用離線編譯。
在開發期間啟動應用程式，以及啟動 plunker 範例時，請使用此套件。

***@angular/http***: Angular 的 HTTP 用戶端。

***@angular/router***: 元件路由器。

***@angular/upgrade***: 用於將 AngularJS 應用程式升級至 Angular 的公用程式集。

***[system.js](https://github.com/systemjs/systemjs)***: 一個與
[ES2015 模組](http://www.2ality.com/2014/09/es6-modules-final.html)規格相容的動態模組載入器。
其他可行的選擇包括備受好評的 [webpack](https://webpack.github.io/)。

你未來的應用程式很可能需要額外的套件，以提供
HTML 控制項、佈景主題、資料存取與各種公用程式。



{@a polyfills}



### Polyfill 套件

Angular 在應用程式環境中需要某些 [polyfill](https://en.wikipedia.org/wiki/Polyfill)。
請使用 Angular 在其 `package.json` 的 *peerDependencies* 區段中所列的 npm 套件來安裝這些 polyfill。

你必須在自己的 `package.json` 的 `dependencies` 區段中列出這些套件。


<div class="l-sub-section">



關於此要求的背景，請參閱[為什麼需要 peerDependencies？](guide/npm-packages#why-peer-dependencies)。

</div>



***core-js***: 以 ES2015（ES6）的必要特性修補全域內容（window）。
 你可以替換為提供相同核心 API 的其他 polyfill。
 當這些 API 由主流瀏覽器實作後，這項相依性就不再必要。

***rxjs***: [Observables 規格](https://github.com/zenparsing/es-observable)的 polyfill，該規格目前正提交給
[TC39](http://www.ecma-international.org/memento/TC39.htm) 委員會，該委員會負責決定 JavaScript 語言的標準。
你可以選擇偏好的 *rxjs* 版本（在相容的版本範圍內），
而不必等待 Angular 更新。

***zone.js***: [Zone 規格](https://gist.github.com/mhevery/63fdcdf7c65886051d55)的 polyfill，該規格目前正提交給
[TC39](http://www.ecma-international.org/memento/TC39.htm) 委員會，該委員會負責決定 JavaScript 語言的標準。
你可以選擇偏好的 *zone.js* 版本來使用（在相容的版本範圍內），
而不必等待 Angular 更新。


{@a other}



### 其他輔助程式庫

***angular-in-memory-web-api***: 一個由 Angular 支援的程式庫，可模擬遠端伺服器的 web api，
而不需要實際的伺服器或真正的 HTTP 呼叫。
很適合示範、範例與早期階段的開發（甚至在你還沒有伺服器之前）。

***bootstrap***: [Bootstrap](http://getbootstrap.com/) 是一個熱門的 HTML 與 CSS 框架，用於設計反應式 web 應用程式。
有些範例使用 *bootstrap* 來改善外觀。


{@a dev-dependencies}



## *開發相依性*
`package.json` 的 *devDependencies* 區段中所列的套件，可協助你開發應用程式。
你不必將它們與正式版應用程式一起部署，儘管這麼做也無妨。

***[concurrently](https://www.npmjs.com/package/concurrently)***:
一個可在 OS/X、Windows 與 Linux 作業系統上同時執行多個 *npm* 指令的公用程式。

***[lite-server](https://www.npmjs.com/package/lite-server)***:
一個由 [John Papa](http://johnpapa.net/) 提供的輕量靜態檔案伺服器，
對使用路由的 Angular 應用程式有出色的支援。

***[typescript](https://www.npmjs.com/package/typescript)***:
TypeScript 語言伺服器，包括 *tsc* TypeScript 編譯器。

***@types/\* ***: TypeScript 定義檔案。
詳見 [TypeScript 設定](guide/typescript-configuration#typings) 指南。



{@a why-peer-dependencies}


## 為什麼需要 *peerDependencies*？

QuickStart 的 `package.json` 中沒有 [*peerDependencies*](https://nodejs.org/en/blog/npm/peer-dependencies/) 區段。
但 Angular 在*其* `package.json` 中有一個 *peerDependencies* 區段，
這對你的應用程式有重要的影響。

本節說明為什麼你要在 QuickStart 應用程式的 `package.json` 中載入 [polyfill](guide/npm-packages#polyfills) *相依性*
套件，
以及為什麼你自己的應用程式也會需要這些套件。

套件會相依於其他套件。例如，你的應用程式相依於 Angular 套件。

兩個套件「A」和「B」可能相依於同一個第三方套件「C」。
「A」和「B」都可能把「C」列在它們的 *相依性* 之中。

如果「A」和「B」相依於「C」的不同版本（「C1」和「C2」）呢？npm 套件系統支援這種情況。
它會把「C1」安裝在「A」的 `node_modules` 資料夾中，把「C2」安裝在「B」的 `node_modules` 資料夾中。
如此一來，「A」和「B」各有自己的「C」副本，執行時互不干擾。

但這裡有個問題。套件「A」可能需要「C1」的存在，卻不直接呼叫它。
只有在*所有人都使用「C1」*時，「A」才能運作。只要應用程式的任何部分依賴「C2」，它就會出問題。

解決辦法是讓「A」宣告「C1」是一個 *對等相依性*。

`dependency` 與 `peerDependency` 之間的差異大致如下：

>**dependency** 是說：「我需要這個東西能直接供*我*使用。」
>
>**peerDependency** 是說：「如果你想使用我，你需要讓這個東西能供*你*使用。」

Angular 的 `package.json` 指定了數個 *對等相依性* 套件，
每個都固定在某個第三方套件的特定版本。

### 你必須自行安裝 Angular 的 *peerDependencies*。

當 *npm* 安裝列在*你的* `dependencies` 區段中的套件時，
它也會安裝列在*它們的*套件 `dependencies` 區段中的套件。
這個過程是遞迴的。

然而，從第 3 版開始，*npm* *不會*安裝列在 *peerDependencies* 區段中的套件。

這表示當你的應用程式安裝 Angular 時，***npm* 不會自動安裝
列在 Angular 的 *peerDependencies* 區段中的套件**。

幸運的是，*npm* 會發出警告：(a) 當缺少任何 *對等相依性* 時，或 (b)
當應用程式或其任何其他相依性
安裝了不同版本的 *對等相依性* 時。

這些警告可防止因版本不符而造成的意外失敗。
它們讓你掌控套件與版本的解析。

你有責任把所有 *對等相依性* 套件列在**你自己的 *devDependencies* 之中**。


<div class="l-sub-section">



#### *peerDependencies* 的未來

Angular 的 polyfill 相依性是硬性要求。目前，沒有辦法讓它們變成選用。

不過，npm 有一個「optional peerDependencies」的功能請求，能讓你更好地描述這種關係。
當這個功能請求實作後，Angular 會把所有 polyfill 從 *peerDependencies* 改為 *optionalPeerDependencies*。

</div>

