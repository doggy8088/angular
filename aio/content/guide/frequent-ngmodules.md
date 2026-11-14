# 常用的模組

#### 先決條件

對[啟動](guide/bootstrapping)有基本了解。


<hr>

Angular 應用程式至少需要一個作為根模組的模組。
當你為應用程式加入功能時，可以將它們加入模組中。
以下是常用的 Angular 模組，以及它們所包含內容的一些範例：

<table>

 <tr>

   <th style="vertical-align: top">

     NgModule
   </th>

   <th style="vertical-align: top">

     匯入來源
   </th>

   <th style="vertical-align: top">

     為何使用
   </th>
 </tr>

 <tr>

   <td><code>BrowserModule</code></td>
   <td><code>@angular/platform-browser</code></td>
   <td>當你想在瀏覽器中執行你的應用程式時</td>
 </tr>

 <tr>

   <td><code>CommonModule</code></td>
   <td><code>@angular/common</code></td>
   <td>當你想使用 <code>NgIf</code>、<code>NgFor</code> 時</td>
 </tr>

 <tr>

   <td><code>FormsModule</code></td>
   <td><code>@angular/forms</code></td>
   <td>當你想建置範本驅動表單時（包含 <code>NgModel</code>）</td>
 </tr>

 <tr>

   <td><code>ReactiveFormsModule</code></td>
   <td><code>@angular/forms</code></td>
   <td>當你想建置反應式表單時</td>
 </tr>

 <tr>

   <td><code>RouterModule</code></td>
   <td><code>@angular/router</code></td>
   <td>當你想使用 <code>RouterLink</code>、<code>.forRoot()</code> 與 <code>.forChild()</code> 時</td>
 </tr>

 <tr>

   <td><code>HttpClientModule</code></td>
   <td><code>@angular/common/http</code></td>
   <td>當你想與伺服器溝通時</td>
 </tr>

</table>

## 匯入模組

使用這些 Angular 模組時，請視情況將它們匯入 `AppModule`
或你的功能模組，並列在 `@NgModule` 的
`imports` 陣列中。例如，在 [Angular CLI](cli) 產生的基本應用程式中，
`BrowserModule` 是 `AppModule`（`app.module.ts`）頂部的第一個匯入。

```typescript
/* import modules so that AppModule can access them */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
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
```

檔案頂部的匯入是 JavaScript 匯入敘述，
而 `@NgModule` 內的 `imports` 陣列則是 Angular 專屬的。
關於兩者差異的更多資訊，請參閱 [JavaScript 模組與 NgModule 的比較](guide/ngmodule-vs-jsmodule)。

## `BrowserModule` 與 `CommonModule`

`BrowserModule` 匯入了 `CommonModule`，後者提供了許多常用
指令，例如 `ngIf` 與 `ngFor`。此外，`BrowserModule`
會重新匯出 `CommonModule`，讓其所有指令都可供任何匯入
`BrowserModule` 的模組使用。

對於在瀏覽器中執行的應用程式，請在根 `AppModule` 中匯入 `BrowserModule`，
因為它提供了啟動與執行瀏覽器應用程式不可或缺的服務。`BrowserModule` 的提供者
適用於整個應用程式，因此只應放在根模組中，
而非功能模組。功能模組只需要 `CommonModule`
中的常用指令，不需要重新安裝全應用程式的提供者。

如果你將 `BrowserModule` 匯入延遲載入的功能模組，
Angular 會傳回錯誤，告訴你要改用 `CommonModule`。

<figure>
 <img src="generated/images/guide/frequent-ngmodules/browser-module-error.gif" width=750 alt="BrowserModule 錯誤">
</figure>

<hr />

## 更多關於 NgModules

你可能也會對以下內容有興趣：
* [啟動](guide/bootstrapping).
* [NgModule](guide/ngmodules).
* [JavaScript 模組與 NgModule 的比較](guide/ngmodule-vs-jsmodule).
