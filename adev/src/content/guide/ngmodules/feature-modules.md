# 功能模組

功能模組是 NgModules，用於組織程式碼。

隨著應用程序的增長，您可以整理與特定功能相關的程式碼。
這有助於為功能應用明確的界限。
使用功能模塊，您可以將與特定功能或特性相關的程式碼與其他程式碼分開。
劃分應用程序區域有助於開發人員和團隊之間的協作、分隔指令以及管理根模塊的大小。

## 功能模組與根模組

功能模組是一種組織最佳實務，而不是核心 Angular API 的概念。
功能模組提供一組凝聚的功能，專注於特定應用程式需求，例如使用者工作流程、路由或表單。
雖然您可以在根模組中完成所有操作，但功能模組可協助您將應用程式分區成焦點區域。
功能模組透過它提供的服務，以及它共用的元件、指令及管道，與根模組和其他模組合作。

## 如何建立一個功能模組

html
<p>要建立一個功能模組，請執行以下步驟：</p>
<ol>
  <li>在您的專案中建立一個新的資料夾。</li>
  <li>在資料夾中建立一個新的 JavaScript 檔案。</li>
  <li>在 JavaScript 檔案中，定義一個新的 Angular 模組。</li>
  <li>在模組中，定義一個新的控制器。</li>
  <li>在控制器中，定義一個新的函數。</li>
  <li>在函數中，執行您要執行的程式碼。</li>
</ol>

假設您已經有一個使用 [Angular CLI](/tools/cli) 建立的應用程式，請在根專案目錄中輸入以下指令，使用 CLI 建立功能模組。
您可以從名稱中省略「Module」字尾，因為 CLI 會自動加入：

<docs-code language="shell">

ng generate module CustomerDashboard

</docs-code>

這會導致 CLI 建立一個名為 `customer-dashboard` 的資料夾，裡面有一個名為 `customer-dashboard.module.ts` 的檔案，其內容如下：

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

NgModule 的結構不論是根模組或功能模組都相同。
在 CLI 生成的功能模組中，檔案最上方有兩個 JavaScript 匯入陳述式：第一個匯入 `NgModule`，與根模組類似，它讓您可以使用 `@NgModule` 裝飾器；第二個匯入 `CommonModule`，它提供了許多常見的指令，例如 `ngIf` 和 `ngFor`。

備註：功能模組匯入 `CommonModule` 而非 `BrowserModule`，後者僅在根模組中匯入一次。
`CommonModule` 只包含資訊，用於大多數範本中所需的常見指令，例如 `ngIf` 和 `ngFor`，而 `BrowserModule` 則為瀏覽器設定 Angular 應用程式，這只需要執行一次。

`declarations` 陣列讓您可以新增聲明，它是專屬於此特定模組的元件、指令和管道。
若要新增元件，請在命令列輸入以下指令，其中 `customer-dashboard` 是 CLI 產生功能模組的目錄，而 `CustomerDashboard` 是元件的名稱：

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

`CustomerDashboardComponent` 現在位於頂部的 JavaScript 匯入清單中，並新增至 `declarations` 陣列，這讓 Angular 知道將此新元件與此功能模組關聯。

## 導入功能模組

若要將功能模組納入您的應用程式，您必須讓根模組 `app.module.ts` 知道它。
請注意 `customer-dashboard.module.ts` 底部的 `CustomerDashboardModule` 匯出。
這會將其公開，以便其他模組可以存取它。
若要將它匯入 `AppModule`，請將它新增至 `app.module.ts` 中的匯入項目和 `imports` 陣列：

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

現在 `AppModule` 知道功能模組和 `AppComponent` 能夠使用客戶儀表板元件。
以下部分有更多詳細資料。

如果您要將任何服務提供者加入功能模組，`AppModule` 也會知道這些服務提供者，其他任何匯入的功能模組也是如此。

## 呈現功能模組的元件範本

html
<!-- 此範例假設元件名稱為 `my-component`。 -->
<my-component></my-component>

當 CLI 為功能模組產生 `CustomerDashboardComponent` 時，它包含一個範本，`customer-dashboard.component.html`，其中包含以下標記：

<docs-code header="src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html" language="html">
<p>
  customer-dashboard works!
</p>
</docs-code>

若要在 `AppComponent` 中看到此 HTML，必須先在 `CustomerDashboardModule` 中匯出 `CustomerDashboardComponent`。
在 `customer-dashboard.module.ts` 中，在 `declarations` 陣列正下方，新增一個包含 `CustomerDashboardComponent` 的 `exports` 陣列：

<docs-code header="src/app/customer-dashboard/customer-dashboard.module.ts" highlight="[2]">
  exports: [
    CustomerDashboardComponent
  ]
</docs-code>

接著，在 `AppComponent`，`app.component.html`，新增標籤 `<app-customer-dashboard>`：

<docs-code header="src/app/app.component.html" highlight="[5]" language="html">
<h1>
  {{title}}
</h1>

<app-customer-dashboard></app-customer-dashboard>
</docs-code>

現在，除了預設呈現的標題外，`CustomerDashboardComponent` 範本也會呈現：

<img alt="功能模組元件" src="assets/content/images/guide/ngmodules/feature-module.png">

## 更多有關 NgModules

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/lazy-loading" title="使用 Angular 路由器延遲載入模組"/>
  <docs-pill href="/guide/ngmodules/providers" title="提供者"/>
  <docs-pill href="/guide/ngmodules/module-types" title="功能模組類型"/>
</docs-pill-row>

