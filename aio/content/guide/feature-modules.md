# 功能模組

功能模組是為了組織程式碼而存在的 NgModule。

如需查看本頁所述、包含功能模組的最終範例應用程式，
請參閱 <live-example></live-example>。

<hr>

隨著應用程式成長，你可以將與特定功能相關的程式碼組織起來。
這有助於為各項功能劃定清楚的界線。運用功能模組，
你可以將與特定功能或特性相關的程式碼，
與其他程式碼分開。為應用程式劃分領域，
有助於開發者與團隊之間的協作、指令的區分，
以及控制根模組的大小。


## 功能模組與根模組

功能模組是一種組織上的最佳實務，而不是 Angular 核心 API 的概念。功能模組提供一組具有凝聚力的功能，專注於特定的
應用程式需求，例如使用者工作流程、路由或表單。
雖然你可以在根模組內完成一切，功能模組能
幫助你將應用程式劃分成專注的領域。功能模組
透過它提供的服務，以及它分享的元件、指令與
管道，與根模組及其他模組協作。

## 如何建立功能模組

假設你已經有一個用 [Angular CLI](cli) 建立的應用程式，請使用 CLI 建立功能
模組：在專案根目錄輸入下列指令。請將 `CustomerDashboard` 換成你的
模組名稱。名稱可以省略「Module」後綴，因為 CLI 會自動附加：

```sh
ng generate module CustomerDashboard

```


這會讓 CLI 建立一個名為 `customer-dashboard` 的資料夾，裡面有一個名為 `customer-dashboard.module.ts` 的檔案，內容如下：

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CustomerDashboardModule { }
```

NgModule 的結構不論是根模組還是功能模組都相同。在 CLI 產生的功能模組中，檔案頂部有兩個 JavaScript 匯入敘述：第一個匯入 `NgModule`，它和根模組一樣，讓你可以使用 `@NgModule` 裝飾器；第二個匯入 `CommonModule`，它提供了許多常用指令，例如 `ngIf` 與 `ngFor`。功能模組匯入 `CommonModule` 而非 `BrowserModule`，後者只在根模組中匯入一次。`CommonModule` 只包含大多數範本所需的常用指令資訊，例如 `ngIf` 與 `ngFor`，而 `BrowserModule` 則為瀏覽器設定 Angular 應用程式，只需執行一次。

`declarations` 陣列可供你加入可宣告類別，也就是
專屬於這個特定模組的元件、指令與管道。若要加入元件，請在命令列輸入下列指令，其中 `customer-dashboard` 是 CLI 產生功能模組的目錄，`CustomerDashboard` 是元件名稱：

```sh
ng generate component customer-dashboard/CustomerDashboard

```

這會在 customer-dashboard 資料夾中為新元件產生一個資料夾，並使用 `CustomerDashboardComponent` 資訊更新功能模組：


<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard.module.ts" region="customer-dashboard-component" header="src/app/customer-dashboard/customer-dashboard.module.ts"></code-example>



`CustomerDashboardComponent` 現在位於頂部的 JavaScript 匯入清單中，並已加入 `declarations` 陣列，這讓 Angular 知道要將這個新元件與此功能模組關聯起來。

## 匯入功能模組

若要將功能模組納入你的應用程式，你必須讓根模組 `app.module.ts` 知道它的存在。注意 `customer-dashboard.module.ts` 底部的 `CustomerDashboardModule` 匯出。這將它公開出來，讓其他模組可以取用它。若要將它匯入 `AppModule`，請把它加入 `app.module.ts` 的匯入清單與 `imports` 陣列：

<code-example path="feature-modules/src/app/app.module.ts" region="app-module" header="src/app/app.module.ts"></code-example>


現在 `AppModule` 知道這個功能模組了。如果你要在功能模組中加入任何服務提供者，`AppModule` 也會知道它們，其他功能模組也一樣。不過，NgModule 不會公開其元件。


## 渲染功能模組的元件範本

當 CLI 為功能模組產生 `CustomerDashboardComponent` 時，它包含了一個範本 `customer-dashboard.component.html`，其標記如下：

<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html" region="feature-template" header="src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html"></code-example>


若要在 `AppComponent` 中看到這段 HTML，你首先必須在 `CustomerDashboardModule` 中匯出 `CustomerDashboardComponent`。在 `customer-dashboard.module.ts` 中，緊接在 `declarations` 陣列下方，加入一個包含 `CustomerDashboardComponent` 的 `exports` 陣列：

<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard.module.ts" region="component-exports" header="src/app/customer-dashboard/customer-dashboard.module.ts"></code-example>



接著，在 `AppComponent` 的 `app.component.html` 中，加入 `<app-customer-dashboard>` 標籤：

<code-example path="feature-modules/src/app/app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>


現在，除了預設渲染的標題之外，`CustomerDashboardComponent` 的範本也會一併渲染：

<div class="lightbox">
  <img src="generated/images/guide/feature-modules/feature-module.png" alt="功能模組元件">
</div>

<hr />

## 更多關於 NgModules

你可能也會對以下內容有興趣：
* [使用 Angular 路由器延遲載入模組](guide/lazy-loading-ngmodules).
* [提供者](guide/providers).
* [功能模組的類型](guide/module-types).
