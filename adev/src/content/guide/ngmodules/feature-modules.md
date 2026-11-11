# 功能模組

功能模組是為了組織程式碼而存在的 NgModule。

隨著應用程式成長，你可以將與特定功能相關的程式碼組織起來。
這有助於為各項功能劃定清楚的界線。
運用功能模組，你可以將與特定功能或特性相關的程式碼，與其他程式碼分開。
為應用程式劃分領域，有助於開發者與團隊之間的協作、指令的區分，以及控制根模組的大小。

## 功能模組與根模組 {#feature-modules-vs-root-modules}

功能模組是一種組織上的最佳實務，而不是 Angular 核心 API 的概念。
功能模組提供一組具有凝聚力的功能，專注於特定的應用程式需求，例如使用者工作流程、路由或表單。
雖然你可以在根模組內完成一切，功能模組能幫助你將應用程式劃分成專注的領域。
功能模組透過它提供的服務，以及它分享的元件、指令與管道，與根模組及其他模組協作。

## 如何建立功能模組 {#how-to-make-a-feature-module}

假設你已經有一個用 [Angular CLI](/tools/cli) 建立的應用程式，在專案根目錄中輸入下列指令，即可使用 CLI 建立功能模組。
名稱可以省略「Module」後綴，因為 CLI 會自動附加：

<docs-code language="shell">

ng generate module CustomerDashboard

</docs-code>

這會讓 CLI 建立一個名為 `customer-dashboard` 的資料夾，裡面有一個名為 `customer-dashboard.module.ts` 的檔案，內容如下：

<docs-code language="typescript">

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CustomerDashboardModule { }

</docs-code>

無論是根模組還是功能模組，NgModule 的結構都相同。
在 CLI 產生的功能模組中，檔案頂部有兩條 JavaScript 匯入敘述：第一條匯入 `NgModule`，與根模組一樣，讓你可以使用 `@NgModule` 裝飾器；第二條匯入 `CommonModule`，它提供許多常用指令，例如 `ngIf` 與 `ngFor`。

注意：功能模組匯入的是 `CommonModule`，而不是只在根模組中匯入一次的 `BrowserModule`。
`CommonModule` 只包含常用指令（例如 `ngIf` 與 `ngFor`）的資訊，這些指令在大多數範本中都會用到；而 `BrowserModule` 則是將 Angular 應用程式設定為在瀏覽器中執行，這只需要做一次。

`declarations` 陣列可供你加入可宣告類別，也就是專屬於這個特定模組的元件、指令與管道。
若要加入元件，請在命令列輸入下列指令，其中 `customer-dashboard` 是 CLI 產生功能模組的目錄，`CustomerDashboard` 是元件名稱：

<docs-code language="shell">

ng generate component customer-dashboard/CustomerDashboard

</docs-code>

這會在 `customer-dashboard` 資料夾中為新元件產生一個資料夾，並更新 `CustomerDashboardModule`。

<docs-code header="src/app/customer-dashboard/customer-dashboard.module.ts"
           highlight="[4,11,14]">
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CustomerDashboardComponent
  ],
  exports: [
    CustomerDashboardComponent
  ]
})
export class CustomerDashboardModule { }
</docs-code>

`CustomerDashboardComponent` 現在位於頂部的 JavaScript 匯入清單中，並已加入 `declarations` 陣列，這讓 Angular 知道要將這個新元件與此功能模組關聯起來。

## 匯入功能模組 {#importing-a-feature-module}

若要將功能模組納入你的應用程式，你必須讓根模組 `app.module.ts` 知道它的存在。
注意 `customer-dashboard.module.ts` 底部的 `CustomerDashboardModule` 匯出。
這將它公開出來，讓其他模組可以取用它。
若要將它匯入 `AppModule`，請把它加入 `app.module.ts` 的匯入清單與 `imports` 陣列：

<docs-code header="src/app/app.module.ts" highlight="[5,6,14]">
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// import the feature module here so you can add it to the imports array below
import { CustomerDashboardModule } from './customer-dashboard/customer-dashboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CustomerDashboardModule // add the feature module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
</docs-code>

現在 `AppModule` 知道功能模組的存在，`AppComponent` 可以使用客戶儀表板元件了。
更多細節請見下方章節。

如果你為功能模組加入任何服務提供者，`AppModule` 也會知道它們的存在，其他匯入的功能模組也一樣。

## 渲染功能模組元件的範本 {#rendering-a-feature-modules-component-template}

當 CLI 為功能模組產生 `CustomerDashboardComponent` 時，它包含了一個範本 `customer-dashboard.component.html`，其標記如下：

<docs-code header="src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html" language="html">
<p>
  customer-dashboard works!
</p>
</docs-code>

若要在 `AppComponent` 中看到這段 HTML，你首先必須在 `CustomerDashboardModule` 中匯出 `CustomerDashboardComponent`。
在 `customer-dashboard.module.ts` 中，緊接在 `declarations` 陣列下方，加入一個包含 `CustomerDashboardComponent` 的 `exports` 陣列：

<docs-code header="src/app/customer-dashboard/customer-dashboard.module.ts" highlight="[2]">
  exports: [
    CustomerDashboardComponent
  ]
</docs-code>

接著，在 `AppComponent` 的 `app.component.html` 中，加入 `<app-customer-dashboard>` 標籤：

<docs-code header="src/app/app.component.html" highlight="[5]" language="html">
<h1>
  {{title}}
</h1>

<app-customer-dashboard></app-customer-dashboard>
</docs-code>

現在，除了預設渲染的標題之外，`CustomerDashboardComponent` 的範本也會一併渲染：

<img alt="feature module component" src="assets/images/guide/ngmodules/feature-module.png">

## 更多關於 NgModules {#more-on-ngmodules}

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/lazy-loading" title="以 Angular Router 延遲載入模組"/>
  <docs-pill href="/guide/ngmodules/providers" title="提供者"/>
  <docs-pill href="/guide/ngmodules/module-types" title="功能模組的類型"/>
</docs-pill-row>
