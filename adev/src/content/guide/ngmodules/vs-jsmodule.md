# JavaScript 模組與 NgModule

JavaScript 模組與 NgModule 都能協助你把程式碼模組化，但兩者非常不同。
Angular 應用程式同時依賴這兩種模組。

## JavaScript 模組：公開程式碼的檔案 {#javascript-modules-files-exposing-code}

[JavaScript 模組](https://javascript.info/modules "JavaScript.Info - Modules") 是包含 JavaScript 程式碼的獨立檔案，通常包含一個類別，或一組供應用程式中特定用途使用的函式函式庫。
JavaScript 模組讓你能把工作分散到多個檔案中。

HELPFUL: 如需深入了解 JavaScript 模組，請參閱 [ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules)。
模組規格請參閱 [ECMAScript 標準第 6 版](https://www.ecma-international.org/ecma-262/6.0/#sec-modules)。

若要讓 JavaScript 模組中的程式碼可供其他模組使用，請在模組中相關程式碼的結尾使用 `export` 陳述式，如下所示：

<docs-code language="typescript">
export class AppComponent { … }
</docs-code>

當你在另一個模組中需要該模組的程式碼時，請如下使用 `import` 陳述式：

<docs-code language="typescript">
import { AppComponent } from './app.component';
</docs-code>

每個模組都有自己的頂層範圍。
換句話說，模組中的頂層變數與函式，在其他指令碼或模組中是看不到的。

## NgModule：帶有編譯用中繼資料的類別 {#ngmodules-classes-with-metadata-for-compiling}

NgModule 是以 `@NgModule` 裝飾器標記的類別，帶有一個中繼資料物件，描述應用程式的該特定部分如何與其他部分契合。
NgModule 是 Angular 專屬的。
帶有 `@NgModule` 裝飾器的類別依慣例放在各自的檔案中，但它們與 JavaScript 模組不同，因為它們包含這份中繼資料。

`@NgModule` 中繼資料在引導 Angular 編譯過程中扮演重要角色，這個過程會把你撰寫的應用程式程式碼轉換為高效能的 JavaScript 程式碼。
中繼資料描述如何編譯元件的範本，以及如何在執行期建立注入器。
它標示出 NgModule 的元件、指令與管道，並透過 `exports` 屬性將其中一部分公開，讓外部元件可以使用它們。
你也可以使用 NgModule 為服務加入提供者，讓服務在應用程式的其他地方可使用。

不要像 JavaScript 模組那樣把所有成員類別都定義在一個巨大的檔案中，而是在 `@NgModule.declarations` 清單中宣告哪些元件、指令與管道屬於該 NgModule。
這些類別稱為可宣告類別（declarables）。
NgModule 只能匯出它所擁有、或從其他 NgModule 匯入的可宣告類別。
它不會宣告或匯出任何其他種類的類別。
可宣告類別是 Angular 編譯過程中唯一重要的類別。

NgModule 中繼資料屬性的完整說明，請參閱[使用 NgModule 中繼資料](guide/ngmodules/api "Using the NgModule metadata")。

## 同時使用兩者的範例 {#an-example-that-uses-both}

由 [Angular CLI](/tools/cli) 為新應用程式專案產生的根 NgModule `AppModule`（使用 `--no-standalone` 選項時），示範了如何同時使用這兩種模組：

<docs-code header="src/app/app.module.ts">
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
</docs-code>

根 NgModule 以 `import` 陳述式開頭，匯入 JavaScript 模組。
接著用下列陣列設定 `@NgModule`：

* `declarations`：屬於該 NgModule 的元件、指令與管道。
  新應用程式專案的根 NgModule 只有一個元件，稱為 `AppComponent`。

* `imports`：你正在使用的其他 NgModule，讓你可以使用它們的可宣告類別。
  新產生的根 NgModule 匯入 [`BrowserModule`](api/platform-browser/BrowserModule "BrowserModule NgModule")，以便使用瀏覽器專屬服務，例如 [DOM](https://www.w3.org/TR/DOM-Level-2-Core/introduction.html "Definition of Document Object Model") 渲染、清理與位置。

* `providers`：其他 NgModule 中的元件可以使用的服務提供者。
  新產生的根 NgModule 中沒有任何提供者。

* `bootstrap`：Angular 建立並插入 `index.html` 主機網頁的元件，藉此啟動應用程式。
  這個元件 `AppComponent` 同時出現在 `declarations` 與 `bootstrap` 陣列中。

## 後續步驟 {#next-steps}

* 如需深入了解根 NgModule，請參閱[以根 NgModule 啟動應用程式](guide/ngmodules/bootstrapping "Launching an app with a root NgModule")。
* 如需了解常用的 Angular NgModule 以及如何把它們匯入你的應用程式，請參閱[常用模組](guide/ngmodules/frequent "Frequently-used modules")。
