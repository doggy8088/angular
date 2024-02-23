# JavaScript 模組與 NgModules

JavaScript 模組和 NgModules 能幫助你模組化你的程式碼，但它們非常不同。
Angular 應用程式仰賴兩種模組。

## JavaScript 模組：公開程式碼的檔案

[JavaScript 模組](https://javascript.info/modules "JavaScript.Info - 模組") 是包含 JavaScript 程式碼的個別檔案，通常包含一個類別或函式庫，以在應用程式中達成特定目的。
JavaScript 模組讓您可在多個檔案中散佈您的工作。

HELPFUL: 若要深入瞭解 JavaScript 模組，請參閱 [深入探討 ES6：模組](https://hacks.mozilla.org/2015/08/es6-in-depth-modules)。
有關模組規格，請參閱 [ECMAScript 標準第 6 版](https://www.ecma-international.org/ecma-262/6.0/#sec-modules)。

要使 JavaScript 模組中的程式碼可供其他模組使用，請在模組中相關程式碼的結尾處使用 `export` 陳述式，例如以下：

<docs-code language="typescript">
export class AppComponent { &hellip; }
</docs-code>

當你在其他模組中需要該模組的程式碼時，請使用 `import` 陳述式，如下所示：

<docs-code language="typescript">
import { AppComponent } from './app.component';
</docs-code>

每個模組都有自己的頂級範圍。
換句話說，模組中的頂級變數和函式在其他腳本或模組中看不到。

## NgModules：具有用於編譯的元數據的類別

`@NgModule` 裝飾器標記的類別，其元資料物件描述應用程式特定部分如何與其他部分配合。
`NgModules` 是 Angular 特有的。
雖然具有 `@NgModule` 裝飾器的類別依慣例保存在自己的檔案中，但它們與 JavaScript 模組不同，因為它們包含此元資料。

`@NgModule` 元數據在引導 Angular 編譯過程中扮演重要角色，此過程將您編寫的應用程式程式碼轉換為高性能 JavaScript 程式碼。
元數據描述如何編譯元件範本，以及如何在執行階段建立注入器。
它識別 NgModule 的元件、指令和管道，並透過 `exports` 屬性公開其中一些，以便外部元件可以使用它們。
您也可以使用 NgModule 來新增服務的提供者，以便在您的應用程式其他地方使用這些服務。

與其在一個巨大的檔案中定義所有成員類別作為 JavaScript 模組，請在 `@NgModule.declarations` 清單中宣告哪些元件、指令及管道屬於 NgModule。
這些類別稱為可宣告類別。
NgModule 只能匯出它擁有或從其他 NgModule 匯入的可宣告類別。
它不會宣告或匯出任何其他類別。
可宣告類別是 Angular 編譯程序中唯一重要的類別。

有關 NgModule 元數據屬性的完整說明，請參閱 [使用 NgModule 元數據](/guide/ngmodules/api "Using the NgModule metadata")。

## 一個同時使用兩種格式的範例

[Angular CLI](/tools/cli) 為新應用程式專案產生的根 NgModule `AppModule` 說明您如何同時使用這兩種模組：

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

根 NgModule 以 `import` 陳述句開始，用於匯入 JavaScript 模組。
然後以以下陣列設定 `@NgModule`：

* `declarations`: 屬於 NgModule 的元件、指令和管道。
  新的應用程式專案的根 NgModule 僅有一個元件，稱為 `AppComponent`。

* `imports`: 其他您正在使用的 NgModule，以便您可以使用它們的可宣告項目。
  新產生的根 NgModule 匯入 [`BrowserModule`](api/platform-browser/BrowserModule "BrowserModule NgModule") 以便使用瀏覽器專屬服務，例如 [DOM](https://www.w3.org/TR/DOM-Level-2-Core/introduction.html "Definition of Document Object Model") 呈現、消毒和位置。

* `providers`: 其他 NgModule 中的元件可以使用之服務的提供者。
  新產生的根 NgModule 中沒有提供者。

* `bootstrap`: Angular 建立並插入至 `index.html` 主機網頁的元件，因而引導應用程式。
  此元件 `AppComponent` 出現在 `declarations` 和 `bootstrap` 陣列中。

## 後續步驟

* 若要深入了解根 NgModule，請參閱 [以根 NgModule 啟動應用程式](/guide/ngmodules/bootstrapping "以根 NgModule 啟動應用程式")。
* 若要了解常用 Angular NgModules 以及如何將它們匯入應用程式，請參閱 [常用模組](/guide/ngmodules/frequent "常用模組")。
