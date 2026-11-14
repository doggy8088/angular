# NgModules

**NgModules** 幫助你將應用程式組織成功能內聚的區塊。
<!-- CF: "app" and "application" are used interchangeably throughout this page.
I'm not sure what's appropriate, so I left them as is for now.  -->

NgModule 是以 *@NgModule* 裝飾器函式標記的類別。
`@NgModule` 接受一個中繼資料物件，告訴 Angular 如何編譯並執行模組程式碼。
它標示出模組自身的元件、指令與管道，並將其中一部分公開，讓外部元件可以使用它們。
`@NgModule` 也可以把服務提供者加入應用程式的依賴注入器中。
除此之外還有許多選項，本頁都會涵蓋。

閱讀本頁之前，請先閱讀
[根模組](guide/bootstrapping)頁面，該頁介紹了 NgModule，以及建立並維護整個應用程式唯一的根 `AppModule` 的要點。

本頁更深入地探討 NgModule。

<!-- CF: See my comment in the "Resolve directive conflicts" section below proposing renaming or reorganizing that section.

* [Angular 模組化](guide/ngmodule#angular-modularity "Add structure to the app with NgModule")
* [應用程式根模組](guide/ngmodule#root-module "The startup module that every app requires")
* [啟動根模組](guide/ngmodule#bootstrap "Launch the app in a browser with the root module as the entry point")
* [宣告](guide/ngmodule#declarations "Declare the components, directives, and pipes that belong to a module")
* [提供者](guide/ngmodule#providers "Extend the app with additional services")
* [匯入](guide/ngmodule#imports "Import components, directives, and pipes for use in component templates")
* [解決衝突](guide/ngmodule#resolve-conflicts "When two directives have the same selector")
* [功能模組](guide/ngmodule#feature-modules "Partition the app into feature modules")
* [透過路由器延遲載入模組](guide/ngmodule#lazy-load "Load modules asynchronously")
* [共享模組](guide/ngmodule#shared-module "Create modules for commonly used components, directives, and pipes")
* [Core 模組](guide/ngmodule#core-module "Create a core module with app-wide singleton services and single-use components")
* [以 _forRoot_ 設定核心服務](guide/ngmodule#core-for-root "Configure providers during module import")
* [防止重複匯入 _CoreModule_](guide/ngmodule#prevent-reimport "because bad things happen if a lazy loaded module imports Core")
<!--
* [NgModule metadata properties](guide/ngmodule#ngmodule-properties "A technical summary of the @NgModule metadata properties")
 CF: This link goes to the top of this page. I would expect it to go to an "NgModule metadata properties"
 section at the end of this page, but that section doesn't exist. -->

#### 即時範例
本頁透過逐步改進一個以「英雄之旅」為主題的範例來說明 NgModule。
以下是範例演進過程中幾個關鍵時刻的即時範例索引：

* <live-example plnkr="minimal.0">最精簡的 NgModule 應用程式</live-example>
* <live-example plnkr="contact.1b">第一個聯絡人模組</live-example>
* <live-example plnkr="contact.2">修訂後的聯絡人模組</live-example>
* <live-example plnkr="pre-shared.3">加入 SharedModule 之前</live-example>
* <live-example>最終版本</live-example>

#### 常見問題（FAQ）

本頁以教學方式涵蓋 NgModule 的概念。

配套的 [NgModule 常見問題](guide/ngmodule-faq "NgModule FAQs")指南針對特定的設計與實作問題提供解答。
請先閱讀本頁，再閱讀那些常見問題。


<hr/>



{@a angular-modularity}



## Angular 模組化

模組是組織應用程式的好方法，也能用外部函式庫的功能擴充應用程式。

許多 Angular 程式庫本身就是模組（例如 `FormsModule`、`HttpModule` 與 `RouterModule`）。
許多第三方程式庫也以 NgModule 的形式提供（例如
<a href="https://material.angular.io/">Material Design</a>、
<a href="http://ionicframework.com/">Ionic</a>、
<a href="https://github.com/angular/angularfire2">AngularFire2</a>）。

NgModule 把元件、指令與管道整合成功能內聚的區塊，每個區塊專注於一個功能領域、應用程式業務領域、工作流程，或一組常用的公用程式。

模組也可以把服務加入應用程式。
這類服務可能由內部開發，例如應用程式的日誌記錄器。
服務也可以來自外部來源，例如 Angular 路由器與 Http 用戶端。

模組可以在應用程式啟動時積極載入。
它們也可以由路由器非同步地延遲載入。

NgModule 是以 `@NgModule` 中繼資料裝飾的類別。這些中繼資料的作用如下：

* 宣告哪些元件、指令與管道屬於該模組。
* 將其中一部分類別公開，讓其他元件範本可以使用它們。
* 匯入其他模組，連同此模組的元件所需的元件、指令與管道。
* 在應用程式層級提供任何應用程式元件都能使用的服務。

每個 Angular 應用程式都至少有一個模組類別，也就是根模組。
你啟動該模組來啟動應用程式。

在元件不多的簡單應用程式中，根模組就已足夠。
隨著應用程式成長，你可以把根模組重構成代表相關功能集合的功能模組。
接著把這些模組匯入根模組。

本頁稍後會介紹這個過程。現在，先從根模組開始。


{@a root-module}



## 根 _AppModule_

每個 Angular 應用程式都有一個根模組類別。
依慣例，根模組類別稱為 `AppModule`，位於名為 `app.module.ts` 的檔案中。

[設定](guide/setup)頁面中 QuickStart 種子專案的 `AppModule` 已盡可能精簡：

<code-example path="setup/src/app/app.module.ts" title="src/app/app.module.ts (minimal)" linenums="false">

</code-example>



`@NgModule` 裝飾器定義了模組的中繼資料。
本頁以直觀的方式理解這些中繼資料，並隨著內容推進逐步補上細節。

這些中繼資料匯入了一個輔助模組 `BrowserModule`，每個瀏覽器應用程式都必須匯入它。

`BrowserModule` 註冊了關鍵的應用程式服務提供者。
它也包含 `NgIf` 與 `NgFor` 等常用指令，這些指令會立即變得可見，並能在此模組的任何元件範本中使用。

`declarations` 清單標示出應用程式唯一的元件，也就是根元件，它是這個應用程式相當簡素的元件樹的頂端。

範例中的 `AppComponent` 只顯示一個資料繫結的標題：

<code-example path="ngmodule/src/app/app.component.0.ts" title="src/app/app.component.ts (minimal)" linenums="false">

</code-example>



最後，`@NgModule.bootstrap` 屬性將這個 `AppComponent` 標示為啟動元件。
Angular 啟動應用程式時，會把 `AppComponent` 的 HTML 渲染結果放進 DOM 中，位於 `index.html` 的 `<my-app>` 元素標籤之內。


{@a bootstrap}



## 在 _main.ts_ 中啟動
你在 `main.ts` 檔案中啟動 `AppModule`，藉此啟動應用程式。

Angular 提供多種針對不同平台的啟動選項。
本頁介紹其中兩個選項，兩者都以瀏覽器為目標。

### 即時編譯（JIT）
在第一個動態選項中，[Angular 編譯器](guide/ngmodule-faq#q-angular-compiler "About the Angular Compiler")會在瀏覽器中編譯應用程式，然後啟動應用程式。


<code-example path="ngmodule/src/main.ts" title="src/main.ts (dynamic)" linenums="false">

</code-example>



本頁的範例採用動態啟動方式。

<live-example embedded plnkr="minimal.0" img="guide/ngmodule/minimal-plunker.png">試試即時範例。</live-example>


### 預先編譯（AOT）

請考慮靜態的替代方案，它能產生小得多的應用程式，而且啟動更快，在行動裝置與高延遲網路上尤其如此。

在靜態選項中，Angular 編譯器會在建置過程中預先執行，產生一組各自獨立檔案中的類別工廠。
其中之一就是 `AppModuleNgFactory`。

啟動預先編譯好的 `AppModuleNgFactory` 的語法，與啟動 `AppModule` 類別的動態版本相似。


<code-example path="ngmodule/src/main-static.ts" title="src/main.ts (static)" linenums="false">

</code-example>



由於整個應用程式已經預先編譯，Angular 不需要把 Angular 編譯器送到瀏覽器，也不會在瀏覽器中編譯。

下載到瀏覽器的應用程式程式碼，比動態版本小得多，而且可以立即執行。效能提升可能相當顯著。

JIT 與 AOT 兩種編譯器都會從同一份 `AppModule` 原始碼產生 `AppModuleNgFactory` 類別。
JIT 編譯器會在瀏覽器中即時在記憶體裡建立該工廠類別。
AOT 編譯器則把工廠輸出到實體檔案，在 `main.ts` 的靜態版本中匯入。

一般而言，`AppModule` 既不需要知道、也不需要關心它是如何啟動的。

雖然 `AppModule` 會隨著應用程式成長而演進，`main.ts` 中的啟動程式碼並不會改變。
這是你最後一次查看 `main.ts`。


<hr/>



{@a declarations}



## 宣告指令與元件
隨著應用程式演進，第一個新增的項目是 `HighlightDirective`，它是一個[屬性指令](guide/attribute-directives)，用來設定所附加元素的背景顏色。

<code-example path="ngmodule/src/app/highlight.directive.ts" title="src/app/highlight.directive.ts" linenums="false">

</code-example>



更新 `AppComponent` 範本，把指令附加到標題上：

<code-example path="ngmodule/src/app/app.component.1.ts" region="template" title="src/app/app.component.ts" linenums="false">

</code-example>



如果你現在執行應用程式，Angular 不會認得 `highlight` 屬性，而且會忽略它。
你必須在 `AppModule` 中宣告這個指令。

匯入 `HighlightDirective` 類別，並像這樣把它加入模組的 `declarations`：

<code-example path="ngmodule/src/app/app.module.1.ts" region="directive" title="src/app/app.module.ts" linenums="false">

</code-example>

把標題重構成它自己的 `TitleComponent`。
該元件的範本像這樣繫結到元件的 `title` 與 `subtitle` 屬性：

<code-example path="ngmodule/src/app/title.component.html" region="v1" title="src/app/title.component.html" linenums="false">

</code-example>



<code-example path="ngmodule/src/app/title.component.ts" region="v1" title="src/app/title.component.ts" linenums="false">

</code-example>



改寫 `AppComponent`，在 `<app-title>` 元素中顯示新的 `TitleComponent`，並用輸入繫結設定 `subtitle`。

<code-example path="ngmodule/src/app/app.component.1.ts" title="src/app/app.component.ts (v1)" linenums="false">

</code-example>



在你於 `AppModule` 中宣告它之前，Angular 不會認得 `<app-title>` 標籤。
匯入 `TitleComponent` 類別，並把它加入模組的 `declarations`：

<code-example path="ngmodule/src/app/app.module.1.ts" region="component" title="src/app/app.module.ts" linenums="false">

</code-example>



{@a providers}



## 服務提供者

模組是為模組的所有元件提供服務的好方法。

[依賴注入](guide/dependency-injection)頁面說明了 Angular 的階層式依賴注入系統，以及如何透過[提供者](guide/dependency-injection#providers)在應用程式元件樹的不同層級設定該系統。

模組可以把提供者加入應用程式的根依賴注入器，讓這些服務在應用程式各處都能使用。

許多應用程式會擷取目前登入使用者的資訊，並透過使用者服務讓這些資訊可供取用。
這個範例應用程式有一個這類 `UserService` 的虛擬實作。


<code-example path="ngmodule/src/app/user.service.ts" title="src/app/user.service.ts" linenums="false">

</code-example>



範例應用程式應該在應用程式標題正下方，向登入的使用者顯示一則歡迎訊息。
更新 `TitleComponent` 範本，在應用程式標題下方顯示歡迎訊息。

<code-example path="ngmodule/src/app/title.component.html" title="src/app/title.component.html" linenums="false">

</code-example>



更新 `TitleComponent` 類別，加入一個注入 `UserService` 的建構子，並以該服務設定元件的 `user` 屬性。

<code-example path="ngmodule/src/app/title.component.ts" title="src/app/title.component.ts" linenums="false">

</code-example>



你已經定義並使用了這個服務。現在若要為所有元件提供它，請把它加入 `AppModule` 中繼資料的 `providers` 屬性：

<code-example path="ngmodule/src/app/app.module.1.ts" region="providers" title="src/app/app.module.ts (providers)" linenums="false">

</code-example>



{@a imports}



## 匯入支援模組

在修訂後的 `TitleComponent` 中，有一個 `*ngIf` 指令守護著訊息。
如果沒有使用者，就沒有訊息。

<code-example path="ngmodule/src/app/title.component.html" region="ngIf" title="src/app/title.component.html (ngIf)" linenums="false">

</code-example>



雖然 `AppModule` 沒有宣告 `NgIf`，應用程式仍然能編譯並執行。
這怎麼可能？Angular 編譯器理應忽略或抱怨無法辨識的 HTML。

Angular 確實認得 `NgIf`，因為你先前匯入了它。
`AppModule` 的初始版本匯入了 `BrowserModule`。

<code-example path="ngmodule/src/app/app.module.0.ts" region="imports" title="src/app/app.module.ts (imports)" linenums="false">

</code-example>



匯入 `BrowserModule`，讓它所有的公開元件、指令與管道，都能被 `AppModule` 中的元件範本看見。

<div class="l-sub-section">



更準確地說，`NgIf` 是在來自 `@angular/common` 的 `CommonModule` 中宣告的。

`CommonModule` 提供了應用程式所需的許多常用指令，包括 `ngIf` 與 `ngFor`。

`BrowserModule` 匯入 `CommonModule`，並[重新匯出](guide/ngmodule-faq#q-re-export)它。
其淨效果是，匯入 `BrowserModule` 的一方會自動取得 `CommonModule` 的指令。

</div>



許多熟悉的 Angular 指令不屬於 `CommonModule`。
例如，`NgModel` 與 `RouterLink` 分別屬於 Angular 的 `FormsModule` 與 `RouterModule`。
你必須匯入那些模組，才能使用它們的指令。

為了說明這一點，你將為範例應用程式加入 `ContactComponent`，這是一個從 Angular `FormsModule` 匯入表單支援的表單元件。

<h3 class="no-toc">加入 _ContactComponent_</h3>

[Angular 表單](guide/forms)是管理使用者資料輸入的好方法。

`ContactComponent` 呈現一個「聯絡人編輯器」，以範本驅動表單的[範本驅動](guide/forms#template-driven)風格，透過 Angular 表單實作。


<div class="l-sub-section">



<h3 class="no-toc">Angular 表單風格</h3>

你可以用範本驅動或[反應式](guide/dynamic-form)風格來撰寫 Angular 表單元件。
<!-- CF: this link goes to a page titled "Dynamic Forms". Should the link text be "dynamic" instead of "reactive"? -->

下列範例從 `@angular/forms` 匯入 `FormsModule`，因為 `ContactComponent` 是以範本驅動風格撰寫的。
以反應式風格撰寫元件的模組，則匯入 `ReactiveFormsModule`。


</div>



`ContactComponent` 的選擇器比對名為 `<app-contact>` 的元素。
在 `AppComponent` 範本中加入一個同名元素，位置就在 `<app-title>` 正下方：

<code-example path="ngmodule/src/app/app.component.1b.ts" region="template" title="src/app/app.component.ts (template)" linenums="false">

</code-example>



表單元件通常很複雜。`ContactComponent` 有它自己的 `ContactService`、一個[自訂管道](guide/pipes#自訂管道)（稱為 `Awesome`），以及另一個版本的 `HighlightDirective`。

為了讓它易於管理，請把所有與聯絡人相關的素材放進 `src/app/contact` 資料夾，並把元件拆成 HTML、TypeScript 與 css 三個組成檔案：

<code-tabs>

  <code-pane title="src/app/contact/contact.component.html" path="ngmodule/src/app/contact/contact.component.html">

  </code-pane>

  <code-pane title="src/app/contact/contact.component.ts" path="ngmodule/src/app/contact/contact.component.3.ts">

  </code-pane>

  <code-pane title="src/app/contact/contact.component.css" path="ngmodule/src/app/contact/contact.component.css">

  </code-pane>

  <code-pane title="src/app/contact/contact.service.ts" path="ngmodule/src/app/contact/contact.service.ts">

  </code-pane>

  <code-pane title="src/app/contact/awesome.pipe.ts" path="ngmodule/src/app/contact/awesome.pipe.ts">

  </code-pane>

  <code-pane title="src/app/contact/highlight.directive.ts" path="ngmodule/src/app/contact/highlight.directive.ts">

  </code-pane>

</code-tabs>



在元件範本中段，請留意雙向資料繫結 `[(ngModel)]`。
`ngModel` 是 `NgModel` 指令的選擇器。

雖然 `NgModel` 是 Angular 指令，Angular 編譯器基於下列理由不會認得它：

* `AppModule` 沒有宣告 `NgModel`。
* `NgModel` 沒有透過 `BrowserModule` 匯入。

就算 Angular 以某種方式認出了 `ngModel`，`ContactComponent` 也不會表現得像 Angular 表單，因為驗證等表單功能尚不可用。

<h3 class="no-toc">匯入 FormsModule</h3>

把 `FormsModule` 加入 `AppModule` 中繼資料的 `imports` 清單。

<code-example path="ngmodule/src/app/app.module.1.ts" region="imports" title="src/app/app.module.ts" linenums="false">

</code-example>



現在，一旦你宣告了新的元件、管道與指令，`[(ngModel)]` 繫結就能運作，使用者輸入也會由 Angular 表單驗證。


<div class="alert is-critical">



*不要*把 `NgModel`&mdash;或 `FORMS_DIRECTIVES`&mdash;加入 `AppModule` 中繼資料的宣告中。
這些指令屬於 `FormsModule`。

元件、指令與管道只屬於一個模組。

*絕不要重新宣告屬於另一個模組的類別。*


</div>



{@a declare-pipe}


<h3 class="no-toc">宣告聯絡人元件、指令與管道</h3>

在你宣告聯絡人元件、指令與管道之前，應用程式無法編譯。
請據此更新 `AppModule` 中的 `declarations`：

<code-example path="ngmodule/src/app/app.module.1.ts" region="declarations" title="src/app/app.module.ts (declarations)" linenums="false">

</code-example>



{@a import-name-conflict}


<div class="l-sub-section">



有兩個同名指令，兩者都稱為 `HighlightDirective`。

為了避開這個問題，請使用 `as` JavaScript 匯入關鍵字，為聯絡人版本建立別名。

<code-example path="ngmodule/src/app/app.module.1b.ts" region="import-alias" title="src/app/app.module.1b.ts" linenums="false">

</code-example>



這解決了在同一個檔案中同時參照兩個指令型別的眼前問題，但還留下另一個未解決的問題。
你將在本頁稍後的[解決指令衝突](guide/ngmodule#resolve-conflicts)中進一步了解該問題。


</div>



<h3 class="no-toc">提供 _ContactService_</h3>
`ContactComponent` 顯示由 `ContactService` 擷取的聯絡人，而 Angular 會把該服務注入它的建構子。

你必須在某處提供該服務。
`ContactComponent` 可以提供它，但那樣服務的作用域就只限於這個元件。
你希望把這個服務與之後肯定會加入的其他聯絡人相關元件共享。

在本應用程式中，把 `ContactService` 加入 `AppModule` 中繼資料的 `providers` 清單：

<code-example path="ngmodule/src/app/app.module.1b.ts" region="providers" title="src/app/app.module.ts (providers)" linenums="false">

</code-example>



現在，你可以把 `ContactService`（如同 `UserService`）注入應用程式中的任何元件。


{@a application-scoped-providers}


<div class="l-sub-section">



<h3 class="no-toc">應用程式作用域的提供者</h3>
  `ContactService` 提供者具有應用程式作用域，因為 Angular 會把模組的 `providers` 註冊到應用程式的根注入器。

  在架構上，`ContactService` 屬於 Contact 業務領域。
  其他領域中的類別不需要 `ContactService`，也不應該注入它。

  你或許會期望 Angular 提供一種模組作用域機制來落實這個設計。
  它沒有。NgModule 實例與元件不同，沒有自己的注入器，所以無法擁有自己的提供者作用域。

  這個省略是有意為之的。
  NgModule 的設計主要是為了擴充應用程式，以模組的功能豐富整個應用程式。

  在實務上，服務作用域很少成為問題。
  非聯絡人類別不會誤注入 `ContactService`。
  若要注入 `ContactService`，必須先匯入它的型別。
  只有 Contact 元件應該匯入 `ContactService` 型別。

  更多資訊，請參閱 [NgModule 常見問題](guide/ngmodule-faq)頁面中的[如何將服務的範圍限制在某個模組內？](guide/ngmodule-faq#q-component-scoped-providers)一節。


</div>



<h3 class="no-toc">執行應用程式</h3>
一切就緒，可以執行帶有聯絡人編輯器的應用程式了。

應用程式的檔案結構如下：

<div class='filetree'>

  <div class='file'>
    app
  </div>

  <div class='children'>

    <div class='file'>
      app.component.ts
    </div>

    <div class='file'>
      app.module.ts
    </div>

    <div class='file'>
      highlight.directive.ts
    </div>

    <div class='file'>
      title.component.(html|ts)
    </div>

    <div class='file'>
      user.service.ts
    </div>

    <div class='file'>
      contact
    </div>

    <div class='children'>

      <div class='file'>
        awesome.pipe.ts
      </div>

      <div class='file'>
        contact.component.(css|html|ts)
      </div>

      <div class='file'>
        contact.service.ts
      </div>

      <div class='file'>
        highlight.directive.ts
      </div>

    </div>

  </div>

</div>



試試這個範例：

<live-example embedded plnkr="contact.1b" img="guide/ngmodule/contact-1b-plunker.png"></live-example>


{@a resolve-conflicts}



## 解決指令衝突
<!-- CF: This section describes directive conflicts in detail, but doesn't describe how to resolve them.
 This section seems like more of an introduction to the next section, "Feature modules".
 Consider moving this section to be a child section of "Feature modules", or striking "Resolve" from this title. -->

[先前](guide/ngmodule#import-name-conflict)你宣告聯絡人的 `HighlightDirective` 時出現了一個問題，因為你在應用程式層級已經有一個 `HighlightDirective` 類別。

這兩個指令的選擇器都會以不同的顏色醒目標示所附加的元素。

<code-tabs>

  <code-pane title="src/app/highlight.directive.ts" path="ngmodule/src/app/highlight.directive.ts">

  </code-pane>

  <code-pane title="src/app/contact/highlight.directive.ts" path="ngmodule/src/app/contact/highlight.directive.ts">

  </code-pane>

</code-tabs>



這兩個指令都宣告在此模組中，所以兩個指令都是啟用狀態。

當這兩個指令爭相為同一個元素上色時，較晚宣告的指令會勝出，因為它的 DOM 變更會覆寫先前的結果。
在本例中，聯絡人的 `HighlightDirective` 把應用程式標題文字變成藍色，而它應該保持金色。


<div class="l-sub-section">



問題在於兩個不同的類別試圖做同一件事。

多次匯入同一個指令類別並沒有關係。
Angular 會移除重複的類別，只註冊其中一個。

但從 Angular 的角度來看，兩個定義在不同檔案中、同名的不同類別，並不算重複。Angular 會保留兩個指令，讓它們輪流修改同一個 HTML 元素。


</div>



至少應用程式仍能編譯。
如果你定義了兩個選擇器相同、指定同一個元素標籤的不同元件類別，編譯器會回報錯誤。它無法在同一個 DOM 位置插入兩個元件。

若要消除元件與指令的衝突，請建立功能模組，把一個模組中的宣告與另一個模組中的宣告隔離開來。


{@a feature-modules}



## 功能模組

這個應用程式還不大，但已經出現結構上的問題。

* 根 `AppModule` 隨著每個新的應用程式類別而變大。
* 指令之間存在衝突。
`AppModule` 中宣告的 `HighlightDirective`，被聯絡人的 `HighlightDirective` 重新著色了它完成的工作。
此外，它為應用程式標題文字上色，而它應該只為 `ContactComponent` 上色。
* 應用程式在聯絡人功能與其他應用程式功能之間缺乏清楚的界線。
這種不明確使得把開發職責分派給不同團隊變得更困難。

你可以用功能模組解決這些問題。

功能模組是以 `@NgModule` 裝飾器及其中繼資料標記的類別，就像根模組一樣。
功能模組的中繼資料與根模組的中繼資料具有相同的屬性。

根模組與功能模組共享同一個執行脈絡。
它們共享同一個依賴注入器，這表示一個模組中的服務對所有模組都可用。

這些模組有下列重要的技術差異：

* 你啟動根模組來啟動應用程式；你匯入功能模組來擴充應用程式。
* 功能模組可以向其他模組公開或隱藏它的實作。

除此之外，功能模組主要依其意圖來區分。

功能模組交付一組功能內聚的功能，專注於應用程式業務領域、使用者工作流程、設施（表單、http、路由），或一組相關的公用程式。

雖然你可以在根模組內完成一切，功能模組能幫助你將應用程式劃分成具有特定關注與目的的領域。
<!-- CF: Is this paragraph just restating the previous paragraph?
If so, I recommend removing it or merging the two -->

功能模組透過它提供的服務，以及它分享的元件、指令與管道，與根模組及其他模組協作。

在下一節中，你將把聯絡人功能從根模組中切出來，放進一個專屬的功能模組。


{@a contact-module-v1}


### 將 _Contact_ 做成功能模組
<!-- CF: Is "Contact" a proper noun in this context? -->

把聯絡人素材重構成聯絡人功能模組很容易。

1. 在 `src/app/contact` 資料夾中建立 `ContactModule`。
1. 把聯絡人素材從 `AppModule` 移到 `ContactModule`。
1. 把匯入的 `BrowserModule` 換成 `CommonModule`。
1. 把 `ContactModule` 匯入 `AppModule`。

`AppModule` 是唯一會改變的既有類別。但你確實會新增一個新檔案。

### 加入 _ContactModule_

以下是新的 `ContactModule`：

<code-example path="ngmodule/src/app/contact/contact.module.2.ts" title="src/app/contact/contact.module.ts">

</code-example>



你把 `AppModule` 中與聯絡人相關的匯入陳述式與 `@NgModule` 屬性複製下來，貼到 `ContactModule` 中。

你匯入 `FormsModule`，因為聯絡人元件需要它。

<div class="alert is-important">



模組不會繼承其他模組中所宣告元件、指令或管道的存取權。
`AppModule` 匯入什麼，與 `ContactModule` 無關，反之亦然。
在 `ContactComponent` 能以 `[(ngModel)]` 繫結之前，它的 `ContactModule` 必須匯入 `FormsModule`。

</div>



你也把 `BrowserModule` 換成了 `CommonModule`，理由已在 [NgModule 常見問題](guide/ngmodule-faq)頁面的[我應該匯入 BrowserModule 還是 CommonModule？](guide/ngmodule-faq#q-browser-vs-common-module)一節中說明。

你在模組的 `declarations` 中宣告聯絡人元件、指令與管道。

你匯出 `ContactComponent`，讓其他匯入 `ContactModule` 的模組，能把它納入它們的元件範本中。

所有其他已宣告的聯絡人類別預設都是私有的。
`AwesomePipe` 與 `HighlightDirective` 對應用程式其餘部分是隱藏的。
`HighlightDirective` 再也無法為 `AppComponent` 的標題文字上色。


### 重構 _AppModule_
回到 `AppModule`，移除所有專屬於聯絡人功能集的內容。

* 刪除聯絡人的匯入陳述式。
* 刪除聯絡人的宣告與聯絡人提供者。
* 從 `imports` 清單中刪除 `FormsModule`（`AppComponent` 不需要它）。

只保留應用程式根層級所需的類別。

接著匯入 `ContactModule`，讓應用程式能繼續顯示匯出的 `ContactComponent`。

以下是重構後的 `AppModule`，以及先前的版本。

<code-tabs>

  <code-pane title="src/app/app.module.ts (v2)" path="ngmodule/src/app/app.module.2.ts">

  </code-pane>

  <code-pane title="src/app/app.module.ts (v1)" path="ngmodule/src/app/app.module.1b.ts">

  </code-pane>

</code-tabs>



### 改進之處

修訂後的 `AppModule` 有很多值得稱許之處。

* 它不會隨著 Contact 領域成長而改變。
* 它只在你加入新模組時才改變。
* 它更簡單：

  * 匯入陳述式更少。
  * 沒有 `FormsModule` 匯入。
  * 沒有聯絡人專屬的宣告。
  * 沒有 `ContactService` 提供者。
  * 沒有 `HighlightDirective` 衝突。

試試這個 `ContactModule` 版本的範例。

<live-example embedded plnkr="contact.2" img="guide/ngmodule/contact-2-plunker.png">試試即時範例。</live-example>


{@a lazy-load}



## 透過路由器延遲載入模組

Heroic Staffing Agency 範例應用程式已經演進。
它多了兩個模組，一個用於管理在職的英雄，另一個用於把危機與英雄配對。
這兩個模組都處於開發的早期階段。
它們的具體內容對這個故事並不重要，本頁也不會討論每一行程式碼。

<div class="l-sub-section">



請從即時範例查看並下載此版本的完整原始碼：
<live-example plnkr="pre-shared.3" img="guide/ngmodule/v3-plunker.png">即時範例。</live-example>

</div>



目前應用程式有幾個值得討論的面向如下：

* 應用程式有三個功能模組：Contact、Hero 與 Crisis。
* Angular 路由器幫助使用者在這些模組之間導覽。
* `ContactComponent` 是應用程式啟動時的預設目的地。
* `ContactModule` 在應用程式啟動時繼續被積極載入。
* `HeroModule` 與 `CrisisModule` 是延遲載入的。

{@a app-component-template}
新的 `AppComponent` 範本有標題、三個連結，以及一個 `<router-outlet>`。

<code-example path="ngmodule/src/app/app.component.3.ts" region="template" title="src/app/app.component.ts (v3 - Template)" linenums="false">

</code-example>



`<app-contact>` 元素已經消失；你現在是透過路由前往 Contact 頁面。

`AppModule` 有了小幅改變：

<code-example path="ngmodule/src/app/app.module.3.ts" title="src/app/app.module.ts (v3)">

</code-example>



<div class="l-sub-section">



有些檔案名稱帶有 `.3` 副檔名，表示與先前或未來版本有所不同。
重要差異會在適當時機說明。
<!-- CF: Can you be more specific here? Are the differences explained later in this page or in another page? -->


</div>



這個模組仍然匯入 `ContactModule`，讓它的路由與元件在應用程式啟動時掛載。

這個模組沒有匯入 `HeroModule` 或 `CrisisModule`。
當使用者導覽到它們的某條路由時，它們會被非同步地擷取並掛載。

相較於第 2 版，重要的改變是在模組的 `imports` 中加入了 AppRoutingModule。
`AppRoutingModule` 是一個[路由模組](guide/router#routing-module)，負責處理應用程式的路由事宜。

### 應用程式路由

<code-example path="ngmodule/src/app/app-routing.module.ts" title="src/app/app-routing.module.ts" linenums="false">

</code-example>



路由器是[路由與導覽](guide/router)頁面的主題，因此本節略過許多細節，專注於 NgModule 與路由的交集。

`app-routing.module.ts` 檔案定義了三條路由。

第一條路由把空的 URL（例如 `http://host.com/`）重新導向到路徑為 `contact` 的另一條路由（例如 `http://host.com/contact`）。

`contact` 路由並不在此定義。
它定義在 Contact 功能自己的路由模組 `contact-routing.module.ts` 中。
對於帶有路由元件的功能模組，定義自己的路由是標準實務。
你稍後就會看到那個檔案。

其餘兩條路由使用延遲載入語法，告訴路由器去哪裡找模組：

<code-example path="ngmodule/src/app/app-routing.module.ts" region="lazy-routes" title="src/app/app-routing.module.ts" linenums="false">

</code-example>



<div class="l-sub-section">



延遲載入模組的位置是字串，不是型別。
在本應用程式中，這個字串同時標示模組檔案與模組類別，後者以 `#` 與前者分隔。


</div>



### RouterModule.forRoot

`RouterModule` 的 `forRoot` 靜態類別方法，連同所提供的設定一起加入 `imports` 陣列，為模組提供路由相關功能。

<code-example path="ngmodule/src/app/app-routing.module.ts" region="forRoot" title="src/app/app-routing.module.ts" linenums="false">

</code-example>



回傳的 `AppRoutingModule` 類別是一個路由模組，同時包含 `RouterModule` 指令，以及產生已設定 `Router` 的依賴注入提供者。

這個 `AppRoutingModule` 僅供應用程式根模組使用。


<div class="alert is-critical">



絕不要在功能路由模組中呼叫 `RouterModule.forRoot`。

</div>



回到根 `AppModule`，把 `AppRoutingModule` 加入它的 `imports` 清單，應用程式就可以導覽了。

<code-example path="ngmodule/src/app/app.module.3.ts" region="imports" title="src/app/app.module.ts (imports)" linenums="false">

</code-example>



### 路由至功能模組
`src/app/contact` 資料夾中多了一個新檔案 `contact-routing.module.ts`。
它定義了先前提到的 `contact` 路由，並如下提供 `ContactRoutingModule`：

<code-example path="ngmodule/src/app/contact/contact-routing.module.ts" region="routing" title="src/app/contact/contact-routing.module.ts (routing)" linenums="false">

</code-example>



這次你把路由清單傳給 `RouterModule` 的 `forChild` 方法。
這份路由清單只負責提供額外的路由，旨在供功能模組使用。


<div class="alert is-important">



一律在功能路由模組中呼叫 `RouterModule.forChild`。


</div>



<div class="alert is-helpful">



_forRoot_ 與 _forChild_ 是慣用名稱，指的是把不同的 `import` 值分別交付給根模組與功能模組的方法。
Angular 不認得這些名稱，但 Angular 開發者認得。

如果你撰寫的類似模組同時具有共享的[可宣告類別](guide/ngmodule-faq#q-declarable)與服務，請[遵循這個慣例](guide/ngmodule-faq#q-for-root)。


</div>



`ContactModule` 有兩個小而重要的改變。

<code-tabs>

  <code-pane title="src/app/contact/contact.module.3.ts" path="ngmodule/src/app/contact/contact.module.3.ts" region="class">

  </code-pane>

  <code-pane title="src/app/contact/contact.module.2.ts" path="ngmodule/src/app/contact/contact.module.2.ts" region="class">

  </code-pane>

</code-tabs>



* 它從 `contact-routing.module.ts` 匯入 `ContactRoutingModule` 物件。
* 它不再匯出 `ContactComponent`。

現在既然你以路由器導覽到 `ContactComponent`，就沒有理由把它公開。
此外，`ContactComponent` 不需要選擇器。
再也不會有任何範本參照這個 `ContactComponent`。
它已經從 [AppComponent 範本](guide/ngmodule#app-component-template)中消失。


{@a hero-module}


### 延遲載入路由至模組

延遲載入的 `HeroModule` 與 `CrisisModule` 遵循與任何功能模組相同的原則。
它們看起來與積極載入的 `ContactModule` 並無不同。

`HeroModule` 比 `CrisisModule` 複雜一些，這使它成為更有趣也更有用的範例。它的檔案結構如下：


<div class='filetree'>

  <div class='file'>
    hero
  </div>

  <div class='children'>

    <div class='file'>
      hero-detail.component.ts
    </div>

    <div class='file'>
      hero-list.component.ts
    </div>

    <div class='file'>
      hero.component.ts
    </div>

    <div class='file'>
      hero.module.ts
    </div>

    <div class='file'>
      hero-routing.module.ts
    </div>

    <div class='file'>
      hero.service.ts
    </div>

    <div class='file'>
      highlight.directive.ts
    </div>

  </div>

</div>



這是[路由與導覽](guide/router#child-routing-component)頁面中[子路由元件](guide/router#child-routing-component)一節的讀者所熟悉的子路由情境。
`HeroComponent` 是該功能的頂層元件與路由宿主。
它的範本有一個 `<router-outlet>`，顯示英雄清單（`HeroList`）或所選英雄的編輯器（`HeroDetail`）。
這兩個元件都委派 `HeroService` 來擷取與儲存資料。

又一個 `HighlightDirective` 以又一種不同的色調為元素上色。
在下一節[共享模組](guide/ngmodule#shared-module "Shared modules")中，你將解決這種重複與不一致。

`HeroModule` 與其他功能模組一樣，是一個功能模組。

<code-example path="ngmodule/src/app/hero/hero.module.3.ts" region="class" title="src/app/hero/hero.module.ts (class)" linenums="false">

</code-example>



它匯入 `FormsModule`，因為 `HeroDetailComponent` 範本以 `[(ngModel)]` 繫結。
它從 `hero-routing.module.ts` 匯入 `HeroRoutingModule`，就如同 `ContactModule` 與 `CrisisModule` 一樣。

`CrisisModule` 大致相同。

<live-example embedded plnkr="pre-shared.3" img="guide/ngmodule/v3-plunker.png">試試即時範例。</live-example>


{@a shared-module}



## 共享模組

應用程式正逐漸成形。
但它帶有三個不同版本的 `HighlightDirective`。
而且應用程式資料夾層級中雜亂的眾多檔案，可以組織得更好。

加入一個 `SharedModule`，容納常用的元件、指令與管道，並把它們與需要它們的模組共享。

1. 建立 `src/app/shared` 資料夾。
1. 把 `AwesomePipe` 與 `HighlightDirective` 從 `src/app/contact` 移到 `src/app/shared`。
1. 刪除 `src/app/` 與 `src/app/hero` 中的 `HighlightDirective` 類別。
1. 建立 `SharedModule` 類別來擁有這些共享素材。
1. 更新其他功能模組，匯入 `SharedModule`。

以下是 `SharedModule`：

<code-example path="ngmodule/src/app/shared/shared.module.ts" title="src/app/src/app/shared/shared.module.ts">

</code-example>



請注意下列事項：

* 它匯入 `CommonModule`，因為它的元件需要常用指令。
* 它如預期般宣告並匯出公用程式管道、指令與元件類別。
* 它重新匯出 `CommonModule` 與 `FormsModule`

### 重新匯出其他模組

如果你查看應用程式，可能會注意到，許多需要 `SharedModule` 指令的元件，也使用 `CommonModule` 中的 `NgIf` 與 `NgFor`，並以 `[(ngModel)]` 繫結到元件屬性，那是 `FormsModule` 中的一個指令。
宣告這些元件的模組，必須匯入 `CommonModule`、`FormsModule` 與 `SharedModule`。

你可以讓 `SharedModule` 重新匯出 `CommonModule` 與 `FormsModule`，減少這種重複，如此一來，匯入 `SharedModule` 的一方就能免費取得 `CommonModule` 與 `FormsModule`。

事實上，`SharedModule` 本身宣告的元件並不以 `[(ngModel)]` 繫結。
嚴格來說，`SharedModule` 沒有必要匯入 `FormsModule`。

`SharedModule` 仍然可以匯出 `FormsModule`，而不必把它列在自己的 `imports` 中。

### 為何不共享 _TitleComponent_

`SharedModule` 的存在，是為了讓常用的元件、指令與管道，能在許多其他模組的元件範本中使用。

`TitleComponent` 只被 `AppComponent` 使用一次。
共享它沒有意義。


{@a no-shared-module-providers}


### 為何不共享 _UserService_

雖然許多元件共享同一個服務實例，它們是依靠 Angular 依賴注入來進行這種共享，而不是模組系統。

範例中的幾個元件注入了 `UserService`。
整個應用程式中應該只有一個 `UserService` 實例，而且只有一個它的提供者。

`UserService` 是全應用程式範圍的單例。
你不會希望每個模組都有各自獨立的實例。
然而，如果 `SharedModule` 提供了 `UserService`，就確實[有這種危險](guide/ngmodule-faq#q-why-bad)。
<!-- CF: This link goes to the top of the NgModule FAQs page.
It looks like it is supposed to go to a specific question/section within the page. -->


<div class="alert is-critical">



不要在共享模組中指定全應用程式範圍的單例 `providers`。
匯入該共享模組的延遲載入模組，會建立它自己的服務副本。


</div>



{@a core-module}



## Core 模組
目前，根資料夾被只出現在根 `AppComponent` 中的 `UserService` 與 `TitleComponent` 弄得雜亂。
你基於剛才說明的原因，沒有把它們納入 `SharedModule`。

相反地，把它們收集到一個 `CoreModule` 中，你在應用程式啟動時匯入一次，而且絕不在其他任何地方匯入。

執行下列步驟：

1. 建立 `src/app/core` 資料夾。
* 把 `UserService` 與 `TitleComponent` 從 `src/app/` 移到 `src/app/core`。
* 建立 `CoreModule` 類別來擁有這些核心素材。
* 更新 `AppRoot` 模組，匯入 `CoreModule`。

這項工作的大部分都很熟悉。有趣的部分是 `CoreModule`。

<code-example path="ngmodule/src/app/core/core.module.ts" region="v4" title="src/app/src/app/core/core.module.ts">

</code-example>



<div class="l-sub-section">



你從 Angular 核心函式庫匯入了一些額外的符號，目前還沒用到。
它們會在本頁稍後變得相關。

</div>



`@NgModule` 中繼資料應該很熟悉。
你宣告 `TitleComponent`，因為這個模組擁有它；你匯出它，因為 `AppComponent`（位於 `AppModule` 中）在它的範本中顯示標題。
`TitleComponent` 需要你從 `CommonModule` 匯入的 Angular `NgIf` 指令。

`CoreModule` 提供了 `UserService`。Angular 把該提供者註冊到應用程式根注入器，讓任何需要它的元件都能取得 `UserService` 的單例實例，無論該元件是積極載入還是延遲載入。


<div class="l-sub-section">



<h3 class="no-toc">何必多此一舉？</h3>
這個情境顯然是刻意編造的。
應用程式太小，不必擔心單一服務檔案與一個小小的一次性元件。

位於根資料夾中的 `TitleComponent` 並不妨礙任何人。
根 `AppModule` 可以自行註冊 `UserService`，正如它目前所做的，即使你決定把 `UserService` 檔案移到 `src/app/core` 資料夾。

真實世界的應用程式有更多要操心的事。
它們可能有幾個一次性元件（例如 spinner、訊息提示與 modal 對話框），只出現在 `AppComponent` 範本中。
你不會在其他地方匯入它們，所以就那個意義而言，它們並未被共享。
然而，它們太大、太雜亂，不適合鬆散地留在根資料夾中。

應用程式通常有許多像本範例 `UserService` 這樣的單例服務。
每一個都必須恰好註冊一次，在應用程式根注入器中，於應用程式啟動時。

雖然許多元件在它們的建構子中注入這類服務&mdash;因此需要 JavaScript `import` 陳述式來匯入它們的符號&mdash;沒有其他元件或模組應該自行定義或重新建立這些服務。
它們的提供者並未被共享。

我們建議收集這類一次性類別，並把它們的細節藏在 `CoreModule` 之中。
精簡的根 `AppModule` 以整個應用程式協調者的身分，匯入 `CoreModule`。


</div>




## 清理
重構出 `CoreModule` 與 `SharedModule` 之後，是時候清理其他模組了。

### 更精簡的 _AppModule_

以下是更新後的 `AppModule`，並附上第 3 版供比較：

<code-tabs>

  <code-pane title="src/app/app.module.ts (v4)" path="ngmodule/src/app/app.module.ts" region="v4">

  </code-pane>

  <code-pane title="src/app/app.module.ts (v3)" path="ngmodule/src/app/app.module.3.ts">

  </code-pane>

</code-tabs>



`AppModule` 現在具有下列特質：

* 稍微變小了，因為許多 `src/app/root` 類別已移到其他模組。
* 更穩定，因為你會把未來的元件與提供者加入其他模組，而不是這個模組。
* 把工作委派給匯入的模組，而不是自己動手做。
* 專注於它的主要任務：協調整個應用程式。

### 更精簡的 _ContactModule_
以下是新的 `ContactModule`，並附上先前版本：

<code-tabs>

  <code-pane title="src/app/contact/contact.module.ts (v4)" path="ngmodule/src/app/contact/contact.module.ts">

  </code-pane>

  <code-pane title="src/app/contact/contact.module.ts (v3)" path="ngmodule/src/app/contact/contact.module.3.ts">

  </code-pane>

</code-tabs>



請注意下列事項：

* `AwesomePipe` 與 `HighlightDirective` 已經消失。
* 匯入項目包含 `SharedModule`，而不是 `CommonModule` 與 `FormsModule`。
* 新版本更精簡、更乾淨。


<hr/>



{@a core-for-root}



## 以 _CoreModule.forRoot_ 設定核心服務

為應用程式加入提供者的模組，也可以提供設定這些提供者的機制。

依慣例，`forRoot` 靜態方法同時提供並設定服務。
它接受一個服務設定物件，並回傳 [ModuleWithProviders](api/core/ModuleWithProviders)，這是一個帶有下列屬性的簡單物件：

* `ngModule`：`CoreModule` 類別
* `providers`：設定好的提供者

根 `AppModule` 匯入 `CoreModule`，並把 `providers` 加入 `AppModule` 的 providers 中。

<div class="l-sub-section">



更精確地說，Angular 會先累積所有匯入的提供者，再附加 `@NgModule.providers` 中列出的項目。
這個順序確保你明確加入 `AppModule` providers 的任何內容，都優先於匯入模組的提供者。

</div>



加入一個 `CoreModule.forRoot` 方法，設定核心的 `UserService`。

你已經以一個選用的、已注入的 `UserServiceConfig` 擴充了核心的 `UserService`。
如果存在 `UserServiceConfig`，`UserService` 就會根據該設定來設定使用者名稱。

<code-example path="ngmodule/src/app/core/user.service.ts" region="ctor" title="src/app/core/user.service.ts (constructor)" linenums="false">

</code-example>



以下是接受 `UserServiceConfig` 物件的 `CoreModule.forRoot`：

<code-example path="ngmodule/src/app/core/core.module.ts" region="for-root" title="src/app/core/core.module.ts (forRoot)" linenums="false">

</code-example>



最後，在 `AppModule` 的 `imports` 清單中呼叫它。

<code-example path="ngmodule/src/app/app.module.ts" region="import-for-root" title="src/app//app.module.ts (imports)" linenums="false">

</code-example>



應用程式會顯示「Miss Marple」作為使用者，而非預設的「Sherlock Holmes」。


<div class="alert is-important">



只在根應用程式模組 `AppModule` 中呼叫 `forRoot`。
在任何其他模組中呼叫它，特別是延遲載入的模組，違反其本意，而且可能產生執行階段錯誤。

請記得匯入結果；不要把它加入任何其他 `@NgModule` 清單。


</div>



<hr/>



{@a prevent-reimport}



## 防止重複匯入 _CoreModule_

只有根 `AppModule` 應該匯入 `CoreModule`。
如果延遲載入的模組匯入它，[會發生不好的事](guide/ngmodule-faq#q-why-bad)。
<!-- CF: Again, this link goes to the top of the NgModule FAQs page.
It looks like it is supposed to go to a specific question/section within the page. -->

你可以希望沒有開發者會犯這個錯誤。
或者，你可以防範它，並透過加入下列 `CoreModule` 建構子來及早失敗。

<code-example path="ngmodule/src/app/core/core.module.ts" region="ctor" title="src/app/core/core.module.ts" linenums="false">

</code-example>



這個建構子告訴 Angular 把 `CoreModule` 注入它自己。
這看起來危險地循環。

如果 Angular 在目前的注入器中尋找 `CoreModule`，注入就會變成循環。
`@SkipSelf` 裝飾器的意思是「在祖先注入器中尋找 `CoreModule`，也就是在注入器階層中我上方的注入器」。

如果建構子如預期般在 `AppModule` 中執行，就不會有祖先注入器能提供 `CoreModule` 的實例。
注入器應該就此放棄。

依預設，當注入器找不到所請求的提供者時會擲出錯誤。
`@Optional` 裝飾器表示找不到服務也沒關係。
注入器會回傳 `null`，`parentModule` 參數為 null，建構子就平順地結束。

如果你不當地把 `CoreModule` 匯入像 `HeroModule` 這樣的延遲載入模組，情況就不同了（不妨試試）。

Angular 會為延遲載入模組建立它自己的注入器，這是根注入器的子注入器。
`@SkipSelf` 使 Angular 在父注入器中尋找 `CoreModule`，而這次父注入器就是根注入器。
它當然會找到根 `AppModule` 匯入的實例。
此時 `parentModule` 存在，建構子便擲出錯誤。

## 結論

你做到了！你可以從即時範例查看並下載此最終版本的完整原始碼。
<live-example embedded  img="guide/ngmodule/final-plunker.png"></live-example>

## 常見問題

既然你已了解 NgModule，你可能會對配套的 [NgModule 常見問題](guide/ngmodule-faq "NgModule FAQs")頁面有興趣，該頁針對特定的設計與實作問題提供現成的解答。
