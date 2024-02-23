# 常用模組

Angular 應用程式至少需要一個作為根模組的模組。
當您為應用程式新增功能時，您可以將它們新增在模組中。
以下是經常使用的 Angular 模組，其中包含一些它們所包含的範例：

| NgModule              | 從此處匯入              | 用途 |
|:---                   |:---                         |:---            |
| `BrowserModule`       | `@angular/platform-browser` | 在瀏覽器中執行應用程式。                  |
| `CommonModule`        | `@angular/common`           | 使用 `NgIf` 和 `NgFor`。                             |
| `FormsModule`         | `@angular/forms`            | 建立範本驅動的表單\(`NgModel`\)。 |
| `ReactiveFormsModule` | `@angular/forms`            | 建立響應式表單。                               |
| `RouterModule`        | `@angular/router`           | 使用 `RouterLink`、`.forRoot()` 和 `.forChild()`。  |
| `HttpClientModule`    | `@angular/common/http`      | 使用 HTTP 協定與伺服器通訊。  |

## 匯入模組

當您使用這些 Angular 模組時，請將它們匯入 `AppModule` 或適當的功能模組中，並將它們列在 `@NgModule` `imports` 陣列中。

例如，在 [Angular CLI](/tools/cli) 產生的應用程式中，`BrowserModule` 會匯入至 `AppModule`。

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

陣列頂端的匯入是 JavaScript 匯入語法，而 `@NgModule` 內的 `imports` 陣列則是 Angular 特有的。
有關兩者的差異，請參閱 [JavaScript 模組與 NgModules](/guide/ngmodules/vs-jsmodule)。

## `BrowserModule` 和 `CommonModule`

`BrowserModule` 重新導出 `CommonModule`，它公開許多常見指令，例如 `ngIf` 和 `ngFor`。
由於重新導出，這些指令可供任何匯入瀏覽器模組的模組使用。

對於在瀏覽器中執行的應用程式，請在根 `AppModule` 中匯入 `BrowserModule`，因為它提供在瀏覽器中啟動和呈現應用程式所必需的服務。

注意：`BrowserModule` 的提供者是針對整個應用程式，因此它只應該在根模組中，而不是在功能模組中。功能模組只需要 `CommonModule` 中的常見指令；不需要重新安裝應用程式範圍的提供者。
