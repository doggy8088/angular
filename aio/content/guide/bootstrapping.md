# 啟動

NgModule 類別描述應用程式各部分如何組裝在一起。
每個應用程式至少有一個 NgModule，即*根*模組，
你[啟動](#main)它來啟動應用程式。
你可以為它取任何名稱。慣例名稱是 `AppModule`。

[設定](guide/setup)說明會產生一個新專案，包含下列最小化的 `AppModule`。
隨著應用程式成長，你會逐步演進這個模組。


<code-example path="setup/src/app/app.module.ts" title="src/app/app.module.ts" linenums="false">
</code-example>



在 `import` 陳述式之後，是一個以
**`@NgModule`** [裝飾器](guide/glossary#decorator '"Decorator" explained')裝飾的類別。

`@NgModule` 裝飾器將 `AppModule` 標示為 `NgModule` 類別。
`@NgModule` 接受一組中繼資料物件，告訴 Angular 如何編譯並啟動應用程式。

* **_imports_** &mdash;這個以及每個應用程式在瀏覽器中執行時所需的 `BrowserModule`。
* **_declarations_** &mdash;應用程式唯一的元件，它同時也是 ...
* **_bootstrap_** &mdash;Angular 建立並插入 `index.html` 主機網頁的*根*元件。

[NgModules](guide/ngmodule)指南深入探討 NgModule 的細節。
此刻你只需要了解這三個屬性的一些基礎知識。


{@a imports}


### _imports_ 陣列

NgModule 是把彼此相關的功能整合為獨立單位的一種方式。
Angular 本身的許多功能都以 NgModule 的形式組織。
HTTP 服務位於 `HttpModule` 中。路由器位於 `RouterModule` 中。
最終你可能會建立功能模組。

當應用程式需要某個模組的功能時，把該模組加入 `imports` 陣列。

*這個*應用程式和大多數應用程式一樣，在瀏覽器中執行。
每個在瀏覽器中執行的應用程式都需要來自 `@angular/platform-browser` 的 `BrowserModule`。
因此，每個這樣的應用程式都會在它的*根* `AppModule` 的 `imports` 陣列中包含 `BrowserModule`。
其他指南與食譜頁面會告訴你何時需要把額外的模組加入這個陣列。


<div class="alert is-important">



**只有 `NgModule` 類別**才能放入 `imports` 陣列。不要把任何其他種類的類別放入 `imports`。


</div>



<div class="l-sub-section">



檔案頂部的 `import` 陳述式與 NgModule 的 `imports` 陣列
互不相關，職責也完全不同。

*JavaScript* 的 `import` 陳述式讓你可以存取其他檔案*匯出*的符號，
以便你在*這個*檔案中參照它們。
你幾乎會在每個應用程式檔案中加入 `import` 陳述式。
它們與 Angular 無關，Angular 也對它們一無所知。

*模組的* `imports` 陣列*只*出現在 `@NgModule` 中繼資料物件中。
它告訴 Angular 特定的*其他* NgModule&mdash;它們全都是以
`@NgModule` 裝飾的類別&mdash;是應用程式正常運作所需要的。

</div>



{@a declarations}


### _declarations_ 陣列

把元件列在模組的 `declarations` 陣列中，就能告訴 Angular 哪些元件屬於 `AppModule`。
當你建立更多元件時，你會把它們加入 `declarations`。

你必須在 `NgModule` 類別中宣告*每個*元件。
如果你使用未宣告的元件，你會在瀏覽器主控台看到清楚的錯誤訊息。

你將學會建立另外兩種類別 &mdash;
[指令](guide/attribute-directives)與[管道](guide/pipes) &mdash;
你也必須把它們加入 `declarations` 陣列。


<div class="alert is-important">



**只有可宣告物（declarables）** &mdash; *元件*、*指令*與*管道* &mdash; 才能放入 `declarations` 陣列。
不要把任何其他種類的類別放入 `declarations`；*不要*放 `NgModule` 類別、*不要*放服務類別、*不要*放模型類別。


</div>



{@a bootstrap-array}


### _bootstrap_ 陣列

你透過[啟動](#main)根 `AppModule` 來啟動應用程式。
除此之外，啟動程序還會建立 `bootstrap` 陣列中列出的元件，
並將每一個插入瀏覽器 DOM。

每個已啟動的元件都是其所屬元件樹的基礎。
插入已啟動的元件通常會觸發
一連串元件建立，填滿該樹。

雖然你可以在主機網頁上放置多個元件樹，但那並不常見。
大多數應用程式只有一個元件樹，並啟動單一*根*元件。

你可以為這個*根*元件取任何名稱，但大多數開發者稱它為 `AppComponent`。

這就帶我們來到*啟動*程序本身。


{@a main}

## 在 _main.ts_ 中啟動

啟動應用程式有許多方法。
差異取決於你想如何編譯應用程式，以及你想在哪裡執行它。

一開始，你會用*即時（Just-in-Time，JIT）*編譯器動態編譯應用程式，
並在瀏覽器中執行它。你之後可以了解其他選項。

對於以 JIT 編譯的瀏覽器應用程式，建議的啟動位置是
`src` 資料夾中名為 `src/main.ts` 的獨立檔案

<code-example path="setup/src/main.ts" title="src/main.ts" linenums="false">

</code-example>



這段程式碼為動態（JIT）編譯建立瀏覽器平台，
並啟動上述的 `AppModule`。

啟動程序會設定執行環境，
從模組的 `bootstrap` 陣列中取出*根* `AppComponent`，
建立該元件的執行個體，並把它插入由元件的 `selector` 所識別的元素標籤內。

`AppComponent` 的選擇器 &mdash; 在這裡以及大多數文件範例中 &mdash; 是 `my-app`，
因此 Angular 會在 `index.html` 中尋找像這樣的 `<my-app>` 標籤……

<code-example path="setup/src/index.html" region="my-app" title="setup/src/index.html" linenums="false">

</code-example>



……並在那裡顯示 `AppComponent`。

這個檔案非常穩定。一旦設定完成，你可能再也不會更改它。


<l-main-section>

</l-main-section>



## 更多關於 NgModule

你的初始應用程式只有單一模組，即*根*模組。
隨著應用程式成長，你會考慮把它細分為多個「功能」模組，
其中有些可以在使用者選擇造訪這些功能時，才在稍後載入（「延遲載入」）。

當你準備好探索這些可能性時，請造訪 [NgModules](guide/ngmodule) 指南。
