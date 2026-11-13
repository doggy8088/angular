# JavaScript 模組與 NgModule

JavaScript 模組與 NgModule 都能協助你把程式碼模組化，但兩者非常不同。 Angular 應用程式同時依賴這兩種模組。

## JavaScript 模組：包含程式碼的檔案

[JavaScript 模組](https://javascript.info/modules "JavaScript.Info - Modules") 是包含 JavaScript 程式碼的獨立檔案，通常包含一個類別，或一組供應用程式中特定用途使用的函式函式庫。 JavaScript 模組讓你能把工作分散到多個檔案中。

<div class="alert is-helpful">

如需進一步了解 JavaScript 模組，請參閱 [ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules)。
關於模組規格，請參閱 [ECMAScript 標準第 6 版](https://www.ecma-international.org/ecma-262/6.0/#sec-modules)。

</div>

若要讓 JavaScript 模組中的程式碼可供其他模組使用，請在模組中相關程式碼的結尾使用 `export` 陳述式，如下所示：

<code-example format="typescript" language="typescript">

export class AppComponent { &hellip; }

</code-example>

當你在另一個模組中需要該模組的程式碼時，請如下使用 `import` 陳述式：

<code-example format="typescript" language="typescript">

import { AppComponent } from './app.component';

</code-example>

每個模組都有自己的頂層作用域。換句話說，模組中頂層的變數與函式在其他指令碼或模組中看不見。每個模組為識別符提供一個命名空間，以防止它們與其他模組中的識別符衝突。使用多個模組時，你可以透過建立單一全域命名空間並加入子模組來防止意外的全域變數。

Angular 框架本身是以一組 JavaScript 模組載入的。

## NgModule：帶有編譯用中繼資料的類別

[NgModule](guide/glossary#ngmodule "Definition of NgModule")是以 `@NgModule` 裝飾器標記的類別，帶有一個中繼資料物件，描述應用程式的該特定部分如何與其他部分契合。NgModule 是 Angular 專屬的。帶有 `@NgModule` 裝飾器的類別依慣例放在各自的檔案中，但它們與 JavaScript 模組不同，因為它們包含這份中繼資料。

`@NgModule` 中繼資料在引導 Angular 編譯程序中扮演重要角色，該程序將你撰寫的應用程式程式碼轉換為高效能的 JavaScript 程式碼。中繼資料描述如何編譯元件的範本，以及如何在執行時期建立[注入器](guide/glossary#注入器injector "Definition of injector")。它識別 NgModule 的[元件](guide/glossary#元件component "Definition of component")、[指令](guide/glossary#指令directive "Definition of directive")與[管道](guide/glossary#管道pipe "Definition of pipe)")，並透過 `exports` 屬性將其中一些公開，讓外部元件可以使用它們。你也可以使用 NgModule 為[服務](guide/glossary#服務service "Definition of a service")加入[提供者](guide/glossary#提供者provider "Definition of provider")，讓這些服務可在應用程式的其他地方使用。

與其將所有成員類別定義在一個巨大的檔案中作為 JavaScript 模組，不如在 `@NgModule.declarations` 清單中宣告哪些元件、指令與管道屬於該 NgModule。這些類別稱為[可宣告類別](guide/glossary#可宣告類別declarable "Definition of a declarable")。NgModule 只能匯出它擁有或從其他 NgModule 匯入的可宣告類別。它不會宣告或匯出任何其他種類的類別。可宣告類別是 Angular 編譯程序唯一關心的類別。

NgModule 中繼資料屬性的完整說明，請參閱[使用 NgModule 中繼資料](guide/ngmodule-api "Using the NgModule metadata")。

## 同時使用兩者的範例

由 [Angular CLI](cli) 為新應用程式專案產生的根 NgModule `AppModule`，示範了如何同時使用這兩種模組：

<code-example header="src/app/app.module.ts (default AppModule)" path="ngmodules/src/app/app.module.1.ts"></code-example>

根 NgModule 以 `import` 陳述式開頭，匯入 JavaScript 模組。 接著用下列陣列設定 `@NgModule`：

*   `declarations`：屬於該 NgModule 的元件、指令與管道。 新應用程式專案的根 NgModule 只有一個元件，稱為 `AppComponent`。

*   `imports`：你正在使用的其他 NgModule，讓你可以使用它們的可宣告類別。 新產生的根 NgModule 匯入 [`BrowserModule`](api/platform-browser/BrowserModule "BrowserModule NgModule")，以便使用瀏覽器專屬服務，例如 [DOM](https://www.w3.org/TR/DOM-Level-2-Core/introduction.html "Definition of Document Object Model") 渲染、清理與位置。

*   `providers`：其他 NgModule 中的元件可以使用的服務提供者。 新產生的根 NgModule 中沒有任何提供者。

*   `bootstrap`：Angular 建立並插入 `index.html` 主機網頁的[進入元件](guide/entry-components "Specifying an entry component")，藉此啟動應用程式。 這個進入元件 `AppComponent` 同時出現在 `declarations` 與 `bootstrap` 陣列中。

## 後續步驟

*   更多關於 NgModule 的資訊，請參閱[使用 NgModule 組織你的應用程式](guide/ngmodules "Organizing your app with NgModules")。
*   如需深入了解根 NgModule，請參閱[以根 NgModule 啟動應用程式](guide/bootstrapping "Launching an app with a root NgModule")。
*   如需了解常用的 Angular NgModule 以及如何把它們匯入你的應用程式，請參閱[常用模組](guide/frequent-ngmodules "Frequently-used modules")。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
