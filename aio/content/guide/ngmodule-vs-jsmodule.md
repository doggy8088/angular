# JavaScript 模組與 NgModule

#### 先決條件
對 [JavaScript/ECMAScript 模組](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)有基本的理解。

<hr>

JavaScript 與 Angular 都使用模組來組織程式碼，雖然組織方式不同，Angular 應用程式兩者都依賴。

## JavaScript 模組

在 JavaScript 中，模組是含有 JavaScript 程式碼的獨立檔案。若要讓其中的內容可供使用，你可以撰寫匯出陳述式，通常放在相關程式碼之後，如下所示：

```typescript
export class AppComponent { ... }
```

接著，當你在另一個檔案中需要該檔案的程式碼時，可以像這樣匯入它：

```typescript
import { AppComponent } from './app.component';
```

JavaScript 模組可協助你建立命名空間，避免意外的全域變數。


## NgModule

<!-- KW-- perMisko: let's discuss. This does not answer the question why it is different. Also, last sentence is confusing.-->
NgModule 是以 `@NgModule` 裝飾的類別。`@NgModule` 裝飾器的 `imports` 陣列告訴 Angular 目前模組需要哪些其他 NgModule。`imports` 陣列中的模組與 JavaScript 模組不同，因為它們是 NgModule，而不是一般的 JavaScript 模組。帶有 `@NgModule` 裝飾器的類別依慣例放在各自的檔案中，但讓它們成為 `NgModule` 的並不是身處各自的檔案（不像 JavaScript 模組），而是 `@NgModule` 及其 中繼資料的存在。

由 [Angular CLI](cli) 產生的 `AppModule` 示範了這兩種模組的實際運用：

```typescript
/* These are JavaScript import statements. Angular doesn’t know anything about these. */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/* The @NgModule decorator lets Angular know that this is an NgModule. */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [     /* These are NgModule imports. */
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


NgModule 類別與 JavaScript 模組有以下關鍵差異：

* NgModule 只包含[可宣告類別](guide/ngmodule-faq#q-declarable)。
可宣告類別是 [Angular 編譯器](guide/ngmodule-faq#q-angular-compiler)唯一關心的類別。
* 與其像 JavaScript 模組那樣把所有成員類別定義在一個巨大的檔案中，
你可以在 `@NgModule.declarations` 清單中列出模組的類別。
* NgModule 只能匯出它擁有或從其他模組匯入的[可宣告類別](guide/ngmodule-faq#q-declarable)。
它不會宣告或匯出任何其他種類的類別。
* 與 JavaScript 模組不同，NgModule 可以透過把提供者加入 `@NgModule.providers` 清單，
用服務擴充_整個_應用程式。

<hr />

## 更多關於 NgModule

如需進一步了解 NgModule，請參閱：
* [啟動](guide/bootstrapping)。
* [常用模組](guide/frequent-ngmodules)。
* [提供者](guide/providers)。
