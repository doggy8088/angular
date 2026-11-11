# 常用的模組

以模組為基礎的 Angular 應用程式至少需要一個作為根模組的模組。
當你為應用程式加入功能時，可以將它們加入模組中。
以下是常用的 Angular 模組，以及它們所包含內容的一些範例：

| NgModule              | 匯入來源              | 為何使用 |
|:---                   |:---                         |:---            |
| `BrowserModule`       | `@angular/platform-browser` | 在瀏覽器中執行你的應用程式。                  |
| `CommonModule`        | `@angular/common`           | 使用 `NgIf` 與 `NgFor`。                             |
| `FormsModule`         | `@angular/forms`            | 建置範本驅動表單（包含 `NgModel`）。 |
| `ReactiveFormsModule` | `@angular/forms`            | 建置反應式表單。                               |
| `RouterModule`        | `@angular/router`           | 使用 `RouterLink`、`.forRoot()` 與 `.forChild()`。  |
| `HttpClientModule`    | `@angular/common/http`      | 使用 HTTP 通訊協定與伺服器通訊。  |

## 匯入模組 {#importing-modules}

使用這些 Angular 模組時，請視情況在 `AppModule` 或你的功能模組中匯入它們，並將它們列在 `@NgModule` 的 `imports` 陣列中。

例如，在以 `--no-standalone` 選項由 [Angular CLI](/tools/cli) 產生的新應用程式中，`BrowserModule` 會被匯入 `AppModule`。

<docs-code language="typescript" highlight="[1,11,12]">
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    /* add modules here so Angular knows to use them */
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

</docs-code>

檔案頂部的 imports 是 JavaScript 匯入敘述，而 `@NgModule` 內的 `imports` 陣列則是 Angular 專屬的。
關於兩者差異的更多資訊，請見 [JavaScript 模組與 NgModule 的比較](guide/ngmodules/vs-jsmodule)。

## `BrowserModule` 與 `CommonModule` {#browsermodule-and-commonmodule}

`BrowserModule` 重新匯出 `CommonModule`，後者公開了許多常用指令，例如 `ngIf` 與 `ngFor`。
由於這個重新匯出，任何匯入瀏覽器模組的模組都可以使用這些指令。

對於在瀏覽器中執行的應用程式，請在根 `AppModule` 中匯入 `BrowserModule`，因為它提供了在瀏覽器中啟動並渲染你的應用程式所必需的服務。

注意：`BrowserModule` 的提供者是供整個應用程式使用的，所以它應該只放在根模組中，而不是功能模組中。功能模組只需要 `CommonModule` 中的常用指令；它們不需要重新安裝全應用程式範圍的提供者。
