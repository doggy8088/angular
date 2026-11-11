# 常用的模組

Angular 應用程式至少需要一個作為根模組的模組。 當你為應用程式加入功能時，可以將它們加入模組中。 以下是常用的 Angular 模組，以及它們所包含內容的一些範例：

| NgModule | 匯入來源 | 為何使用 |
|:---                   |:---                         |:---            |
| `BrowserModule` | `@angular/platform-browser` | 在瀏覽器中執行你的應用程式。 |
| `CommonModule` | `@angular/common` | 使用 `NgIf` 與 `NgFor`。 |
| `FormsModule` | `@angular/forms` | 建置範本驅動表單（包含 `NgModel`）。 |
| `ReactiveFormsModule` | `@angular/forms` | 建置反應式表單。 |
| `RouterModule` | `@angular/router` | 使用 `RouterLink`、`.forRoot()` 與 `.forChild()`。 |
| `HttpClientModule` | `@angular/common/http` | 使用 HTTP 通訊協定與伺服器通訊。 |

## 匯入模組

使用這些 Angular 模組時，請視情況將它們匯入 `AppModule` 或你的功能模組，並列在 `@NgModule` 的 `imports` 陣列中。例如，在 [Angular CLI](cli) 產生的基本應用程式中，`BrowserModule` 是 `AppModule`（`app.module.ts`）頂部的第一個匯入。

<code-example format="typescript" language="typescript">

/* import modules so that AppModule can access them */
import { BrowserModule } from '&commat;angular/platform-browser';
import { NgModule } from '&commat;angular/core';

import { AppComponent } from './app.component';

&commat;NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ /* add modules here so Angular knows to use them */
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

</code-example>

檔案頂部的匯入是 JavaScript 匯入敘述，而 `@NgModule` 內的 `imports` 陣列則是 Angular 專屬的。關於兩者差異的更多資訊，請參閱[JavaScript 模組與 NgModule 的比較](guide/ngmodule-vs-jsmodule)。

## `BrowserModule` 與 `CommonModule`

`BrowserModule` 匯入了 `CommonModule`，後者提供了許多常用指令，例如 `ngIf` 與 `ngFor`。此外，`BrowserModule` 會重新匯出 `CommonModule`，讓其所有指令都可供任何匯入 `BrowserModule` 的模組使用。

對於在瀏覽器中執行的應用程式，請在根 `AppModule` 中匯入 `BrowserModule`，因為它提供了啟動與執行瀏覽器應用程式不可或缺的服務。`BrowserModule` 的提供者適用於整個應用程式，因此只應放在根模組中，而非功能模組。功能模組只需要 `CommonModule` 中的常用指令，不需要重新安裝全應用程式的提供者。

如果你將 `BrowserModule` 匯入延遲載入的功能模組，Angular 會傳回錯誤，告訴你要改用 `CommonModule`。

<div class="lightbox">

<img alt="BrowserModule 錯誤" src="generated/images/guide/frequent-ngmodules/browser-module-error.gif" width=750>

</div>

## 更多關於 NgModules

你可能也會對以下內容有興趣：

*   [啟動](guide/bootstrapping)
*   [NgModule](guide/ngmodules)
*   [JavaScript 模組與 NgModule 的比較](guide/ngmodule-vs-jsmodule)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
