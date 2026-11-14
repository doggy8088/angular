# NgModule FAQ

NgModule 幫助你將應用程式組織成功能內聚的區塊。

[NgModules](guide/ngmodule) 頁面會引導你
從最基本的 `@NgModule` 一路到具有延遲載入模組的多面向範例。

本頁回答許多開發者對 NgModule 設計與實作的疑問。

<div class="alert is-important">



這些常見問題假設你已經閱讀過 [NgModules](guide/ngmodule) 頁面。


</div>

{@a q-what-to-declare}



## 我應該將哪些類別加入 _declarations_？

將[可宣告](guide/ngmodule-faq#q-declarable)類別&mdash;元件、指令與管道&mdash;加入 `declarations` 清單。

在應用程式中，將這些類別宣告在_恰好一個_模組中。
如果它們_屬於_這個模組，就在此模組中宣告它們。


<hr/>



{@a q-declarable}



## 什麼是 _declarable_？

可宣告類別（Declarables）是你可以加入模組 `declarations` 清單的類別型別&mdash;元件、指令與管道。
它們是_唯一_可以加入 `declarations` 的類別。


<hr/>



{@a q-what-not-to-declare}



## 我_不_應該將哪些類別加入 _declarations_？

只將[可宣告](guide/ngmodule-faq#q-declarable)類別加入模組的 `declarations` 清單。

*不要*宣告下列類別：

* 已在另一個模組中宣告的類別，無論是應用程式模組、@NgModule 或第三方模組。
* 從另一個模組匯入的指令陣列。
例如，不要宣告來自 `@angular/forms` 的 FORMS_DIRECTIVES。
* 模組類別。
* 服務類別。
* 非 Angular 類別與物件，例如
字串、數字、函式、實體模型、設定、商業邏輯與輔助類別。


<hr/>



{@a q-why-multiple-mentions}



## 為什麼同一個元件會列在多個 _NgModule_ 屬性中？

`AppComponent` 經常同時列在 `declarations` 與 `bootstrap` 中。
你可能也會看到 `HeroComponent` 同時列在 `declarations`、`exports` 與 `entryComponents` 中。

雖然這看起來多餘，但這些屬性有不同的功能。
列入一份清單，並不表示也列入另一份清單。

* `AppComponent` 可以宣告在此模組中，但不在此模組中啟動。
* `AppComponent` 可以在此模組中啟動，但宣告在不同的功能模組中。
* `HeroComponent` 可以從另一個應用程式模組匯入（所以你無法宣告它），並由這個模組重新匯出。
* `HeroComponent` 可以被匯出，供外部元件的範本使用，也可以動態載入到彈出式對話框中。


<hr/>



{@a q-why-cant-bind-to}



## 「Can't bind to 'x' since it isn't a known property of 'y'」是什麼意思？

這個錯誤通常表示你還沒有宣告指令「x」，或者還沒有匯入「x」所屬的模組。

例如，如果「x」是 `ngModel`，你可能還沒有從 `@angular/forms` 匯入 `FormsModule`。

也許你在應用程式的子模組中宣告了「x」，卻忘了將它匯出。
除非你將「x」類別加入 `exports` 清單，否則其他模組看不見它。


<hr/>



{@a q-what-to-import}



## 我應該匯入什麼？

匯入那些你需要在這個模組的元件範本中參照其公開（匯出）[可宣告類別](guide/ngmodule-faq#q-declarable)的模組。

這表示你永遠都要從 `@angular/common` 匯入 `CommonModule`，以便使用 `NgIf` 與 `NgFor` 等 Angular 指令。
你可以直接匯入它，或從[重新匯出](guide/ngmodule-faq#q-reexport)它的另一個模組匯入。

如果你的元件具有 `[(ngModel)]` 雙向繫結表達式，請從 `@angular/forms` 匯入 `FormsModule`。

當此模組的元件使用_共享_模組與_功能_模組的元件、指令與管道時，匯入這些模組。

只在根 `AppModule` 中匯入 [BrowserModule](guide/ngmodule-faq#q-browser-vs-common-module)。


<hr/>



{@a q-browser-vs-common-module}



## 我應該匯入 _BrowserModule_ 還是 _CommonModule_？

幾乎每個瀏覽器應用程式的*根應用程式模組*（`AppModule`）都應從 `@angular/platform-browser` 匯入 `BrowserModule`。

`BrowserModule` 提供了啟動與執行瀏覽器應用程式不可或缺的服務。

`BrowserModule` 也會重新匯出 `@angular/common` 的 `CommonModule`，這表示 `AppModule` 中的元件也可以使用每個應用程式都需要的 Angular 指令，例如 `NgIf` 與 `NgFor`。

在任何其他模組中都_不要匯入_ `BrowserModule`。
*功能模組*與*延遲載入模組*應該改為匯入 `CommonModule`。
它們需要常用指令。它們不需要重新安裝全應用程式範圍的提供者。

<div class="l-sub-section">



如果你嘗試延遲載入一個匯入了 `BrowserModule` 的模組，`BrowserModule` 會擲出錯誤。

</div>



匯入 `CommonModule` 也讓功能模組可以在_任何_目標平台上使用，不只是瀏覽器。


<hr/>



{@a q-reimport}



## 如果我將同一個模組匯入兩次會怎樣？

這不是問題。當三個模組都匯入模組「A」時，Angular 只會在第一次遇到時評估模組「A」一次，不會再次評估。

無論 `A` 出現在匯入模組階層中的哪一層，這都成立。
當模組「B」匯入模組「A」、模組「C」匯入「B」、模組「D」匯入 `[C, B, A]` 時，「D」會觸發對「C」的評估，而「C」觸發對「B」的評估，「B」再評估「A」。
當 Angular 處理到「D」中的「B」與「A」時，它們已經快取好並準備就緒了。

Angular 不喜歡具有循環參照的模組，所以不要讓模組「A」匯入模組「B」，而「B」又匯入模組「A」。


<hr/>



{@a q-what-to-export}



## 我應該匯出什麼？

匯出其他模組中的元件能在其範本中參照的[可宣告](guide/ngmodule-faq#q-declarable)類別。這些是你的_公開_類別。
如果你不匯出一個類別，它會保持_私有_，只有宣告在此模組中的其他元件能看見它。

你可以匯出任何可宣告類別&mdash;元件、指令與管道&mdash;無論它宣告在此模組中，或是在匯入的模組中。

你可以重新匯出整個匯入的模組，這等同於重新匯出它們所有匯出的類別。
模組甚至可以匯出一個它沒有匯入的模組。


<hr/>



{@a q-what-not-to-export}



## 我_不_應該匯出什麼？

不要匯出下列內容：

* 你只需要在宣告於此模組的元件內使用的私有元件、指令與管道。
如果你不想讓另一個模組看到它，就不要匯出它。
* 非可宣告物件，例如服務、函式、設定與實體模型。
* 只由路由器或啟動程序動態載入的元件。
這類[進入元件](guide/ngmodule-faq#q-entry-component-defined)永遠不會在另一個元件的範本中被選用。
匯出它們雖然無害，但也沒有好處。
* 沒有公開（匯出）宣告的純服務模組。
例如，重新匯出 `HttpModule` 沒有意義，因為它不匯出任何東西。
它唯一的目的是為整個應用程式加入 http 服務提供者。


<hr/>



{@a q-reexport}


{@a q-re-export}



## 我可以重新匯出類別與模組嗎？

當然可以。

模組是將其他模組的類別選擇性地聚合，並在一個整合的便利模組中重新匯出的好方法。

模組可以重新匯出整個模組，這等同於重新匯出它們所有匯出的類別。
Angular 自己的 `BrowserModule` 就是這樣匯出幾個模組的：

<code-example>
  exports: [CommonModule, ApplicationModule]

</code-example>



模組可以匯出它自己的宣告、選定的匯入類別與匯入的模組的組合。

<div class="l-sub-section">



不要費心重新匯出純服務模組。
純服務模組不匯出另一個模組可以使用的[可宣告](guide/ngmodule-faq#q-declarable)類別。
例如，重新匯出 `HttpModule` 沒有意義，因為它不匯出任何東西。
它唯一的目的是為整個應用程式加入 http 服務提供者。


</div>



<hr/>



{@a q-for-root}



## 什麼是 _forRoot_ 方法？

`forRoot` 靜態方法是一種慣例，讓開發者能輕鬆設定模組的提供者。

`RouterModule.forRoot` 方法就是一個很好的例子。
應用程式將 `Routes` 物件傳給 `RouterModule.forRoot`，以便用路由設定全應用程式的 `Router` 服務。
`RouterModule.forRoot` 會回傳一個 [ModuleWithProviders](api/core/ModuleWithProviders)。
你將該結果加入根 `AppModule` 的 `imports` 清單中。


<div class="alert is-important">



只在根應用程式模組 `AppModule` 中呼叫並匯入 `.forRoot` 的結果。
在任何其他模組中匯入它，特別是延遲載入的模組，
違反其本意，而且很可能產生執行階段錯誤。

</div>



`RouterModule` 也提供了一個 `forChild` 靜態方法，用於設定延遲載入模組的路由。

_forRoot_ 與 _forChild_ 是用於分別在根模組與功能模組中設定服務的方法的慣用名稱。

Angular 不認得這些名稱，但 Angular 開發者認得。
撰寫具有可設定之服務提供者的類似模組時，請遵循這個慣例。


<hr/>



{@a q-module-provider-visibility}



## 為什麼在功能模組中提供的服務到處都看得到？

列在已啟動模組的 `@NgModule.providers` 中的提供者，具有*應用程式作用域*。
將服務提供者加入 `@NgModule.providers`，等同於將該服務發佈給整個應用程式。

當你匯入一個模組時，Angular 會將該模組的服務提供者（其 `providers` 清單的內容）加入應用程式_根注入器_。

這使得提供者對應用程式中每個知道提供者查閱權杖的類別都可見。

這是出於設計。
透過模組匯入來擴充是 NgModule 系統的主要目標。
將模組提供者合併進應用程式注入器中，
讓模組程式庫能輕鬆以新服務豐富整個應用程式。
只要加入一次 `HttpModule`，每個應用程式元件都能發出 http 請求。

然而，如果你期望模組的服務只對該功能模組宣告的元件可見，這可能會是個不受歡迎的意外。
如果 `HeroModule` 提供了 `HeroService`，而根 `AppModule` 匯入了 `HeroModule`，任何知道 `HeroService` _型別_的類別都能注入該服務，不只是 `HeroModule` 中宣告的類別。


<hr/>



{@a q-lazy-loaded-module-provider-visibility}



## 為什麼在_延遲載入_模組中提供的服務只對該模組可見？

與啟動時載入的模組的提供者不同，延遲載入模組的提供者是*模組作用域*的。

當 Angular 路由器延遲載入模組時，它會建立一個新的執行脈絡。
該[脈絡有自己的注入器](guide/ngmodule-faq#q-why-child-injector "Why Angular creates a child injector")，它是應用程式注入器的直接子注入器。

路由器會將延遲載入模組的提供者及其匯入模組的提供者加入這個子注入器。

這些提供者不會受到具有相同查找權杖的應用程式提供者變更的影響。
當路由器在延遲載入的脈絡中建立元件時，Angular 會優先使用由這些提供者建立的服務實例，而不是應用程式根注入器的服務實例。


<hr/>



{@a q-module-provider-duplicates}



## 如果兩個模組提供相同的服務會怎樣？

當兩個同時載入的匯入模組列出了權杖相同的提供者時，第二個模組的提供者「勝出」。這是因為兩個提供者都被加入同一個注入器。

當 Angular 要為該權杖注入服務時，它會建立並交付由第二個提供者建立的實例。

_每個_注入此服務的類別，取得的都是第二個提供者建立的實例。
即使是宣告在第一個模組內的類別，取得的也是第二個提供者建立的實例。

如果模組 A 為權杖「X」提供服務，並匯入同樣為權杖「X」提供服務的模組 B，那麼模組 A 的服務定義「勝出」。

根 `AppModule` 提供的服務，優先於匯入模組提供的服務。
`AppModule` 永遠勝出。


<hr/>



{@a q-component-scoped-providers}



## 如何將服務的範圍限制在某個模組內？

當模組在應用程式啟動時載入，它的 `@NgModule.providers` 具有*整個應用程式的作用域*；也就是說，它們可以在整個應用程式中被注入。

匯入的提供者很容易被另一個匯入模組的提供者取代。
這種取代可能是設計使然。也可能是無意的，並造成不良後果。


<div class="alert is-important">



一般規則是，只將帶有提供者的模組匯入_恰好一次_，最好是在應用程式的_根模組_中。
那通常也是設定、包裝與覆寫它們的最佳位置。


</div>



假設某個模組需要一個自訂的 `HttpBackend`，為所有 Http 請求加入一個特殊標頭。
如果應用程式其他地方的另一個模組也自訂了 `HttpBackend`，或只是匯入了 `HttpModule`，它就可能覆寫此模組的 `HttpBackend` 提供者，使特殊標頭遺失。伺服器會拒絕來自此模組的 http 請求。

若要避免這個問題，只在 `AppModule`（應用程式的_根模組_）中匯入 `HttpModule`。

如果你必須防範這種「提供者損毀」，*不要依賴啟動時模組的 `providers`*。

如果可以，請延遲載入模組。
Angular 會給[延遲載入的模組](guide/ngmodule-faq#q-lazy-loaded-module-provider-visibility)自己的子注入器。
模組的提供者只在以此注入器建立的元件樹內可見。

如果你必須在應用程式啟動時積極載入模組，*請改為在元件中提供服務。*

沿用同一個例子，假設某個模組的元件確實需要一個私有的自訂 `HttpBackend`。

建立一個「頂層元件」，作為該模組所有元件的根。
將自訂的 `HttpBackend` 提供者加入頂層元件的 `providers` 清單，而不是模組的 `providers`。
回想一下，Angular 會為每個元件實例建立一個子注入器，並以元件自己的提供者填入該注入器。

當此元件的子元件要求 `HttpBackend` 服務時，Angular 會提供本機的 `HttpBackend` 服務，而不是應用程式根注入器中提供的版本。
無論其他模組對 `HttpBackend` 做什麼，子元件都能正常發出 http 請求。

務必將模組的元件建立為此模組頂層元件的子元件。

你可以將子元件嵌入頂層元件的範本中。
或者，給頂層元件一個 `<router-outlet>`，讓它成為路由宿主。
定義子路由，讓路由器將模組元件載入該出口。


<hr/>



{@a q-root-component-or-module}



## 我應該將全應用程式範圍的提供者加入根 _AppModule_ 還是根 _AppComponent_？

將全應用程式的提供者註冊在根 `AppModule` 中，而不是根 `AppComponent` 中。

延遲載入模組及其元件可以注入 `AppModule` 服務；它們無法注入 `AppComponent` 服務。

_只有_在服務必須對 `AppComponent` 樹之外的元件隱藏時，才在 `AppComponent` 提供者中註冊服務。這是很少見的使用案例。

更一般而言，[最好在模組中註冊提供者](guide/ngmodule-faq#q-component-or-module)，而不是在元件中註冊。

<h3 class="no-toc">討論</h3>

Angular 會將所有啟動模組的提供者註冊到應用程式根注入器。
由根注入器提供者建立的服務可供整個應用程式使用。
它們具有_應用程式作用域_。

某些服務（例如 `Router`）只有註冊在應用程式根注入器中才能運作。

相較之下，Angular 會將 `AppComponent` 提供者註冊到 `AppComponent` 自己的注入器。
`AppComponent` 服務只對該元件及其元件樹可用。
它們具有_元件作用域_。

`AppComponent` 的注入器是根注入器的_子注入器_，在注入器階層中低一層。
對於不使用路由器的應用程式，那_幾乎_是整個應用程式。
但對於有路由的應用程式，「幾乎」還不夠好。

`AppComponent` 服務不存在於路由運作的根層級。
延遲載入模組無法存取它們。
在 NgModule 頁面的範例應用程式中，如果你曾將 `UserService` 註冊在 `AppComponent` 中，
`HeroComponent` 就無法注入它。
使用者瀏覽到「Heroes」的那一刻，應用程式就會失敗。


<hr/>



{@a q-component-or-module}



## 我應該將其他提供者加入模組還是元件？

一般而言，優先在模組中註冊功能專屬的提供者（`@NgModule.providers`），
而非在元件中註冊（`@Component.providers`）。

當你_必須_將服務實例的作用域限制在該元件及其元件樹時，才將提供者註冊到元件。
對指令註冊提供者時，也適用同樣的推理。

例如，一個需要快取英雄服務之私有副本的英雄編輯元件，應該將
`HeroService` 註冊到 `HeroEditorComponent`。
如此一來，`HeroEditorComponent` 的每個新實例都會取得它自己的快取服務實例。
該編輯器對其服務中的英雄所做的變更，不會影響應用程式其他地方的英雄實例。

[一律向根 `AppModule` 註冊_全應用程式_服務](guide/ngmodule-faq#q-root-component-or-module)，而不是向根 `AppComponent` 註冊。


<hr/>



{@a q-why-bad}



## 為什麼 _SharedModule_ 為延遲載入模組提供服務不好？

這個問題已在 [NgModules](guide/ngmodule) 頁面的[為什麼 UserService 不共用](guide/ngmodule#no-shared-module-providers)一節中說明，
該節討論了讓提供者遠離 `SharedModule` 的重要性。

假設 `UserService` 列在該模組的 `providers` 中（但它並沒有）。
假設每個模組都匯入這個 `SharedModule`（而它們確實都這麼做）。

當應用程式啟動時，Angular 會積極載入 `AppModule` 與 `ContactModule`。

匯入的 `SharedModule` 的兩個實例都會提供 `UserService`。
Angular 在根應用程式注入器中註冊其中一個（參見[如果我將同一個模組匯入兩次會怎樣？](guide/ngmodule-faq#q-reimport)）。
接著某個元件注入 `UserService`，Angular 在應用程式根注入器中找到它，
並交付全應用程式範圍的單例 `UserService`。沒有問題。

現在考慮_延遲載入的_ `HeroModule`。

當路由器延遲載入 `HeroModule` 時，它會建立一個子注入器，並將 `UserService` 提供者註冊到該子注入器。子注入器_不是_根注入器。

當 Angular 建立一個延遲載入的 `HeroComponent` 時，它必須注入 `UserService`。
這次它在延遲載入模組的_子注入器_中找到 `UserService` 提供者，
並建立一個_新的_ `UserService` 實例。
這與 Angular 在及早載入的元件中注入的全應用程式單例版本，是完全不同的 `UserService` 實例。

那幾乎肯定是個錯誤。

<div class="l-sub-section">



若要示範，請執行<live-example name="ngmodule">即時範例</live-example>。
修改 `SharedModule`，讓它提供 `UserService`，而不是 `CoreModule`。
接著在「Contact」與「Heroes」連結之間來回切換幾次。
每當 Angular 建立新的 `UserService` 實例時，使用者名稱就會錯亂。
<!-- CF: "goes bonkers" is jargon. Can you describe the behavior in plain English?  -->


</div>



<hr/>



{@a q-why-child-injector}



## 為什麼延遲載入會建立子注入器？

Angular 會將 `@NgModule.providers` 加入應用程式根注入器，除非該模組是延遲載入的。
對於延遲載入的模組，Angular 會建立一個_子注入器_，並將該模組的提供者加入子注入器。

這表示模組的行為會因它是在應用程式啟動時載入、還是稍後延遲載入而有所不同。忽略這個差異可能導致[不良後果](guide/ngmodule-faq#q-why-bad)。

為什麼 Angular 不像對及早載入的模組那樣，將延遲載入的提供者加入應用程式根注入器？

答案植基於 Angular 依賴注入系統的一項基本特性。
注入器可以加入提供者，_直到它第一次被使用為止_。
一旦注入器開始建立並交付服務，它的提供者清單就凍結了；不允許新的提供者。

當應用程式啟動時，Angular 會先以所有及早載入模組的提供者設定根注入器，_然後_才建立它的第一個元件並注入任何提供的服務。
應用程式一旦開始執行，應用程式根注入器就不再接受新的提供者。

時間流逝，應用程式邏輯觸發了某個模組的延遲載入。
Angular 必須將延遲載入模組的提供者加入某處的注入器。
它無法將它們加入應用程式根注入器，因為該注入器已不再接受新的提供者。
所以 Angular 為延遲載入模組的脈絡建立一個新的子注入器。


<hr/>



{@a q-is-it-loaded}



## 如何判斷模組或服務先前是否已載入？

某些模組及其服務應該只由根 `AppModule` 載入一次。
透過延遲載入模組第二次匯入該模組，可能會[產生錯誤行為](guide/ngmodule-faq#q-why-bad)，而且可能難以偵測與診斷。

若要防止這個問題，請撰寫一個建構子，嘗試從根應用程式注入器注入該模組或服務。如果注入成功，表示該類別已被第二次載入。你可以拋出錯誤，或採取其他補救措施。

某些 NgModule（例如 `BrowserModule`）實作了這樣的防護，
例如 NgModule 頁面中的這個 `CoreModule` 建構子。

<code-example path="ngmodule/src/app/core/core.module.ts" region="ctor" title="src/app/core/core.module.ts (Constructor)" linenums="false">

</code-example>



<hr/>



{@a q-entry-component-defined}



## 什麼是_進入元件_？

進入元件是指 Angular 以型別_強制_載入的任何元件。

透過選擇器_宣告式_載入的元件，_不是_進入元件。

大多數應用程式元件是以宣告方式載入的。
Angular 使用元件的選擇器在範本中定位元素。
接著它會建立該元件的 HTML 表示形式，並將其插入所選元素的 DOM 中。
這些都不是進入元件。

少數元件只會被動態載入，而且_從未_在元件範本中被參照。

作為啟動根元件的 `AppComponent` 是_進入元件_。
沒錯，它的選擇器確實與 `index.html` 中的元素標籤相符。
但 `index.html` 不是元件範本，而且 `AppComponent` 的選擇器也不會與任何元件範本中的元素相符。

Angular 會動態載入 `AppComponent`，因為它不是在 `@NgModule.bootstrap` 中_依型別_列出，就是以模組的 `ngDoBootstrap` 方法指令式地啟動。

路由定義中的元件也是_進入元件_。
路由定義是以_型別_來參照元件。
路由器會忽略被路由元件的選擇器（如果它有選擇器的話），並將元件動態載入 `RouterOutlet`。

編譯器無法透過在其他元件範本中尋找來發現這些_進入元件_。
你必須將它們加入 `entryComponents` 清單，才能告訴編譯器。

Angular 會自動將下列型別的元件加入模組的 `entryComponents`：

* `@NgModule.bootstrap` 清單中的元件。
* 在路由器設定中參照的元件。

你不必明確提及這些元件，雖然這樣做也無害。


<hr/>



{@a q-bootstrap_vs_entry_component}



## _bootstrap_ 元件與 _entry component_ 有什麼差別？

啟動元件_就是_一個[進入元件](guide/ngmodule-faq#q-entry-component-defined)，Angular 會在啟動程序（應用程式啟動）期間將它載入 DOM。
其他進入元件則是透過其他方式動態載入，例如透過路由器。

`@NgModule.bootstrap` 屬性告訴編譯器，這是一個進入元件，_而且_它應該產生程式碼，用這個元件來啟動應用程式。

沒有必要同時將元件列在 `bootstrap` 與 `entryComponent` 清單中，雖然這樣做也無妨。


<hr/>



{@a q-when-entry-components}



## 我什麼時候要將元件加入 _entryComponents_？

大多數應用程式開發者不需要將元件加入 `entryComponents`。

Angular 會自動將某些元件加入_進入元件_。
列在 `@NgModule.bootstrap` 中的元件會自動加入。
在路由設定中參照的元件也會自動加入。
這兩種機制涵蓋了幾乎所有的進入元件。

如果你的應用程式以其他方式依_型別_啟動或動態載入元件，你必須明確地將它加入 `entryComponents`。

雖然將元件加入這份清單無妨，但最好只加入真正屬於_進入元件_的元件。
不要加入在其他元件範本中[被參照](guide/ngmodule-faq#q-template-reference)的元件。


<hr/>



{@a q-why-entry-components}



## 為什麼 Angular 需要 _entryComponents_？
_進入元件_也會被宣告。
為什麼 Angular 編譯器不為 `@NgModule.declarations` 中的每個元件產生程式碼？
那樣你就不需要進入元件了。

原因是_搖樹（tree shaking）_。對於正式版應用程式，你希望載入盡可能小、盡可能快的程式碼。
程式碼應該只包含你實際需要的類別。
它應該排除從未使用過的元件，無論該元件是否已宣告。

事實上，許多函式庫宣告並匯出了你永遠不會用到的元件。如果你不參照它們，搖樹器會將這些元件從最終的程式碼包中移除。

如果 [Angular 編譯器](guide/ngmodule-faq#q-angular-compiler)為每個宣告的元件都產生程式碼，就會失去搖樹器的意義。

相反地，編譯器採用遞迴策略，只為你使用的元件產生程式碼。

編譯器從進入元件開始，接著為它在進入元件範本中[找到](guide/ngmodule-faq#q-template-reference)的宣告元件產生程式碼，再為它在先前已編譯元件的範本中發現的宣告元件產生程式碼，依此類推。在程序結束時，編譯器已為每個進入元件，以及每個能從進入元件到達的元件產生程式碼。

如果某個元件不是_進入元件_，也沒有在範本中找到，編譯器會將它省略。



<hr/>



{@a q-module-recommendations}



## 我應該有哪些種類的模組，又該如何使用它們？

每個應用程式都不同。開發者的經驗與對可用選項的熟悉程度各不相同。有些建議與準則似乎廣受歡迎。


<div class="alert is-important">



以下內容是根據在少數應用程式中使用 NgModule 的早期經驗所提供的初步指引。
請以適當的謹慎與思量來閱讀。


</div>



### _SharedModule_
建立一個 `SharedModule`，其中包含你在應用程式各處使用的元件、指令與管道。這個模組應該完全由 `declarations` 組成，其中大部分會匯出。

`SharedModule` 可以重新匯出其他[小工具模組](guide/ngmodule-faq#widget-feature-module)，例如 `CommonModule`、`FormsModule`，以及那些包含你最廣泛使用的 UI 控制項的模組。

`SharedModule` *不應*有 `providers`，原因如[先前所述](guide/ngmodule-faq#q-why-bad)。
其匯入或重新匯出的任何模組也不應有 `providers`。
如果你偏離這項指引，請清楚知道自己在做什麼以及原因。

在你的_功能_模組中匯入 `SharedModule`，包括應用程式啟動時載入的模組，以及稍後延遲載入的模組。

### _CoreModule_
建立一個 `CoreModule`，其 `providers` 包含你在應用程式啟動時載入的單例服務。

只在根 `AppModule` 中匯入 `CoreModule`。
不要在任何其他模組中匯入 `CoreModule`。

考慮將 `CoreModule` 做成[純服務模組](guide/ngmodule-faq#service-feature-module)，不含 `declarations`。


<div class="l-sub-section">



本頁範例偏離了該建議，宣告並匯出了兩個只在由 `AppModule` 宣告的根 `AppComponent` 內使用的元件。
嚴格遵循這項指引的人，會將這些元件改為宣告在 `AppModule` 中。


</div>



### 功能模組
圍繞特定的應用程式商業領域、使用者工作流程與公用程式集合來建立功能模組。

功能模組通常屬於下列群組之一：

  * [領域功能模組](guide/ngmodule-faq#domain-feature-module)。
  * [被路由功能模組](guide/ngmodule-faq#routed-feature-module)。
  * [路由模組](guide/ngmodule-faq#routing-module)。
  * [服務功能模組](guide/ngmodule-faq#service-feature-module)。
  * [小工具功能模組](guide/ngmodule-faq#widget-feature-module)。


<div class="l-sub-section">



現實世界的模組往往是刻意偏離下列指引的混合體。
這些指引不是法律；
請遵循它們，除非你有充分的理由不這麼做。


</div>



<table>

  <tr>

    <th style="vertical-align: top">
      功能模組
    </th>

    <th style="vertical-align: top">
      指南
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a domain-feature-module}領域
    </td>

    <td>


      領域功能模組提供*專屬於特定應用領域*的使用者體驗，
      例如編輯客戶或下訂單。

      它們通常有一個頂層元件，作為功能的根。
      私有的支援子元件從它延伸而下。

      領域功能模組主要由 _declarations_ 組成。
      只有頂層元件會被匯出。

      領域功能模組很少有 _providers_。
      當它們有時，所提供服務的生命週期
      應該與模組的生命週期相同。

      不要在領域功能模組中提供全應用程式範圍的單例服務。

      領域功能模組通常由一個更大的功能模組匯入_恰好一次_。

      它們可能會被缺乏路由的小型應用程式的根 `AppModule` 匯入。
      

<div class="l-sub-section">



      例如，請參閱 [NgModules](guide/ngmodule) 頁面在引入路由之前的[將 _Contact_ 做成功能模組](guide/ngmodule#contact-module-v1)一節。      

</div>


    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a routed-feature-module}被路由
    </td>

    <td>


      _被路由功能模組_是_領域功能模組_，
      其頂層元件是*路由器導覽路由的目標*。

      所有延遲載入模組依定義都是被路由功能模組。

      本頁的 `ContactModule`、`HeroModule` 與 `CrisisModule` 都是被路由功能模組。

      被路由功能模組_不應該匯出任何東西_。
      它們不必這麼做，因為它們的元件從不出現於外部元件的範本中。

      延遲載入的被路由功能模組不應該被任何模組_匯入_。
      這樣做會觸發積極載入，破壞延遲載入的目的。
      `HeroModule` 與 `CrisisModule` 是延遲載入的。它們沒有出現在 `AppModule` 的匯入清單中。

      但積極載入的被路由功能模組必須由另一個模組匯入，
      編譯器才能得知它的元件。
      `ContactModule` 是積極載入的，因此列在 `AppModule` 的匯入清單中。

      被路由功能模組很少有 _providers_，原因如[先前所述](guide/ngmodule-faq#q-why-bad)。
      當它們有時，所提供服務的生命週期
      應該與模組的生命週期相同。

      不要在被路由功能模組中提供全應用程式範圍的單例服務，
      也不要在被路由模組匯入的模組中提供。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a routing-module}路由
    </td>

    <td>


      [路由模組](guide/router#routing-module)為另一個模組*提供路由設定*。

      路由模組將路由關注點與其伴隨模組分離。

      路由模組通常會做下列事情：

      * 定義路由。
      * 將路由器設定加入模組的 `imports`。
      * 重新匯出 `RouterModule`。
      * 將守衛與解析器服務提供者加入模組的 `providers`。

      路由模組的名稱應該與其伴隨模組的名稱平行，使用後綴「Routing」。
      例如，`foo.module.ts` 中的 `FooModule` 有一個名為 `FooRoutingModule` 的路由模組，
      位於 `foo-routing.module.ts` 中

      如果伴隨模組是_根_ `AppModule`，
      `AppRoutingModule` 會以 `RouterModule.forRoot(routes)` 將路由器設定加入其 `imports`。
      所有其他路由模組都是子模組，匯入 `RouterModule.forChild(routes)`。

      路由模組會重新匯出 `RouterModule`，作為一種便利，
      讓伴隨模組的元件能存取
      `RouterLink` 與 `RouterOutlet` 等路由器指令。

      路由模組*不應該有自己的 `declarations`*。
      元件、指令與管道是*功能模組的責任*，
      不是_路由_模組的責任。

      路由模組應該_只_由其伴隨模組匯入。

      `AppRoutingModule`、`ContactRoutingModule` 與 `HeroRoutingModule` 都是很好的範例。      

<div class="l-sub-section">



      另請參閱 [Routing & Navigation](guide/router) 頁面上的[我需要_路由模組_嗎？](guide/router#why-routing-module)。
      

</div>


    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a service-feature-module}服務
    </td>

    <td>


      服務模組*提供公用程式服務*，例如資料存取與訊息傳遞。

      理想情況下，它們完全由 _providers_ 組成，且沒有 _declarations_。
      `CoreModule` 與 Angular 的 `HttpModule` 都是很好的範例。

      服務模組應該_只_由根 `AppModule` 匯入。

      不要在其他功能模組中匯入服務模組。
      如果你偏離這項指引，請清楚知道自己在做什麼以及原因。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      {@a widget-feature-module}小工具
    </td>

    <td>


      小工具模組讓*元件、指令與管道*可供外部模組使用。

      `CommonModule` 與 `SharedModule` 都是小工具模組。
      許多第三方 UI 元件程式庫都是小工具模組。

      小工具模組應該完全由 _declarations_ 組成，其中大部分會匯出。

      小工具模組很少有 _providers_。
      如果你偏離這項指引，請清楚知道自己在做什麼以及原因。

      在任何其元件範本需要這些小工具的模組中匯入小工具模組。

    </td>

  </tr>

</table>



下表彙總了每個_功能模組_群組的主要特徵。

<div class="l-sub-section">



現實世界的模組往往是刻意偏離這些指引的混合體。

</div>



<table>

  <tr>

    <th>
      功能模組
    </th>

    <th>
      宣告
    </th>

    <th>
      提供者
    </th>

    <th>
      匯出
    </th>

    <th>
      由誰匯入
    </th>

    <th>
      範例
    </th>

  </tr>

  <tr>

    <td>
      領域
    </td>

    <td>
      是
    </td>

    <td>
      很少
    </td>

    <td>
      頂層元件
    </td>

    <td>
      功能模組、<code>AppModule</code>
    </td>

    <td>
      <code>ContactModule</code>（引入路由之前）
    </td>

  </tr>

  <tr>

    <td>
      被路由
    </td>

    <td>
      是
    </td>

    <td>
      很少
    </td>

    <td>
      否
    </td>

    <td>
      無
    </td>

    <td>
      <code>ContactModule</code>, <code>HeroModule</code>, <code>CrisisModule</code>
    </td>

  </tr>

  <tr>

    <td>
      路由
    </td>

    <td>
      否
    </td>

    <td>
      是（守衛）
    </td>

    <td>
      <code>RouterModule</code>
    </td>

    <td>
      功能模組（供路由用）
    </td>

    <td>
      <code>AppRoutingModule</code>, <code>ContactRoutingModule</code>, <code>HeroRoutingModule</code>
    </td>

  </tr>

  <tr>

    <td>
      服務
    </td>

    <td>
      否
    </td>

    <td>
      是
    </td>

    <td>
      否
    </td>

    <td>
      <code>AppModule</code>
    </td>

    <td>
      <code>HttpModule</code>, <code>CoreModule</code>
    </td>

  </tr>

  <tr>

    <td>
      小工具
    </td>

    <td>
      是
    </td>

    <td>
      很少
    </td>

    <td>
      是
    </td>

    <td>
      功能模組
    </td>

    <td>
      <code>CommonModule</code>, <code>SharedModule</code>
    </td>

  </tr>

</table>



<hr/>



{@a q-ng-vs-js-modules}



## Angular 與 JavaScript 模組有什麼差別？

Angular 與 JavaScript 是不同但互補的模組系統。

在現代 JavaScript 中，每個檔案都是一個_模組_
（請見 Exploring ES6 網站的 [Modules](http://exploringjs.com/es6/ch_modules.html) 頁面）。
在每個檔案中，你撰寫一個 `export` 敘述，讓模組的部分內容公開：


<code-example format='.'>
  export class AppComponent { ... }

</code-example>



然後你在另一個模組中 `import` 其中一部分：


<code-example format='.'>
  import { AppComponent }  from './app.component';

</code-example>



這種模組化是 _JavaScript 語言_ 的一個特性。

_NgModule_ 是 _Angular_ 本身的一個特性。

Angular 的 `NgModule` 也有 `imports` 與 `exports`，它們的用途相似。

你_匯入_其他 NgModule，以便在元件範本中使用它們匯出的類別。你_匯出_此 NgModule 的類別，讓它們能被_其他_模組的元件匯入並使用。

NgModule 類別與 JavaScript 模組類別在下列關鍵方面有所不同：

* NgModule 只涵蓋[可宣告類別](guide/ngmodule-faq#q-declarable)。
可宣告類別是唯一對 [Angular 編譯器](guide/ngmodule-faq#q-angular-compiler) 有意義的類別。
* 你不是把所有成員類別定義在一個巨大的檔案中（如同 JavaScript 模組），
   而是將模組的類別列在 `@NgModule.declarations` 清單中。
* NgModule 只能匯出它所擁有、或從其他模組匯入的[可宣告類別](guide/ngmodule-faq#q-declarable)。
它不宣告或匯出任何其他種類的類別。

NgModule 在另一個方面也很特殊。
與 JavaScript 模組不同，NgModule 可以透過將提供者加入 `@NgModule.providers` 清單，以服務擴充_整個_應用程式。
<!-- CF: Should this sentence be a bullet point in the list above? -->


<div class="alert is-important">



所提供的服務不屬於模組，也不侷限於宣告的類別。
它們在_任何地方_都可用。


</div>



這是一個具有 imports、exports 與 declarations 的 _NgModule_ 類別。

<code-example path="ngmodule/src/app/contact/contact.module.2.ts" region="class" title="ngmodule/src/app/contact/contact.module.ts" linenums="false">

</code-example>



當然，你會使用 _JavaScript_ 模組來撰寫 NgModule，如完整的 `contact.module.ts` 檔案所示：

<code-example path="ngmodule/src/app/contact/contact.module.2.ts" title="src/app/contact/contact.module.ts" linenums="false">

</code-example>



<hr/>



{@a q-template-reference}



## Angular 如何在範本中找到元件、指令與管道？<br>什麼是 <i><b>範本參照</b></i>？

[Angular 編譯器](guide/ngmodule-faq#q-angular-compiler)會在元件範本內部尋找其他元件、指令與管道。當它找到一個時，那就是一個「範本參照」。

當 Angular 編譯器能將該元件或指令的*選擇器*，與該範本中的某些 HTML 相比對時，它就在範本中找到了一個元件或指令。

當管道的*名稱*出現在範本 HTML 的管道語法中時，編譯器就找到了該管道。

Angular 只比對由此模組宣告的類別、或由此模組匯入的模組所匯出的類別的選擇器與管道名稱。


<hr/>



{@a q-angular-compiler}



## 什麼是 Angular 編譯器？

Angular 編譯器將你撰寫的應用程式程式碼，轉換為高效能的 JavaScript 程式碼。
`@NgModule` 中繼資料在引導編譯過程中扮演重要角色。

你撰寫的程式碼不能立即執行。
以*元件*為例。
元件的範本包含自訂元素、屬性指令、Angular 繫結宣告，
以及一些明顯不是原生 HTML 的特殊語法。

Angular 編譯器讀取範本標記，將它與對應的元件類別程式碼結合，並發出_元件工廠_。

元件工廠建立該元件的純粹、100% JavaScript 表示形式，納入其 `@Component` 中繼資料所描述的一切：HTML、繫結指示、附加的樣式。

由於*指令*與*管道*出現在元件範本中，Angular 編譯器也將它們納入編譯後的元件程式碼。

`@NgModule` 中繼資料告訴 Angular 編譯器要為此模組編譯哪些元件，以及如何將此模組與其他模組連結。


<hr/>



{@a q-ngmodule-api}



## NgModule API

下表彙總了 `NgModule` 中繼資料屬性。

<table>

  <tr>

    <th>
      屬性
    </th>

    <th>
      說明
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>declarations</code>
    </td>

    <td>


      [可宣告](guide/ngmodule-faq#q-declarable)類別的清單，
      也就是_屬於這個模組_的*元件*、*指令*與*管道*類別。

      這些宣告的類別在模組內可見，但對不同模組中的元件不可見，
      除非它們從這個模組_匯出_，且另一個模組_匯入_了這個模組。

      元件、指令與管道必須屬於_恰好_一個模組。
      如果你嘗試在一個以上的模組中宣告同一個類別，編譯器會發出錯誤。

      *不要重新宣告從另一個模組匯入的類別。*

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>providers</code>
    </td>

    <td>


      依賴注入提供者的清單。

      Angular 會將這些提供者註冊到模組執行脈絡的根注入器。
      對於在應用程式啟動時載入的所有模組，那就是應用程式的根注入器。

      Angular 可以將其中一個提供者服務注入應用程式中的任何元件。
      如果這個模組或任何在啟動時載入的模組提供了 `HeroService`，
      Angular 可以將同一個 `HeroService` 實例注入任何應用程式元件。

      延遲載入模組有自己的子根注入器，它通常
      是應用程式根注入器的直接子注入器。

      延遲載入的服務其作用域限於延遲載入模組的注入器。
      如果延遲載入模組也提供了 `HeroService`，
      在該模組脈絡中建立的任何元件（例如透過路由器導覽）
      取得的是該服務的本機實例，而不是根應用程式注入器中的實例。

      外部模組中的元件會繼續收到為應用程式根建立的實例。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>imports</code>
    </td>

    <td>


      支援模組的清單。

      具體而言，就是其匯出的元件、指令或管道被本模組中宣告的元件範本所參照的模組清單。

      元件範本可以[參照](guide/ngmodule-faq#q-template-reference)另一個元件、指令或管道，
      當被參照的類別已在本模組中宣告，
      或該類別是從另一個模組匯入時。

      元件之所以能使用 `NgIf` 與 `NgFor` 指令，只是因為它的父模組
      匯入了 Angular 的 `CommonModule`（也可能透過匯入 `BrowserModule` 間接匯入）。

      你可以用 `CommonModule` 匯入許多標準指令，
      但有些熟悉的指令屬於其他模組。
      元件範本只有在匯入 Angular 的 `FormsModule` 之後，才能以 `[(ngModel)]` 進行繫結。
    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>exports</code>
    </td>

    <td>


      宣告&mdash;*元件*、*指令*與*管道*類別&mdash;的清單，
      供匯入的模組使用。

      匯出的宣告是模組的_公開 API_。
      如果另一個模組匯入了這個模組，且這個模組匯出了 `HeroComponent`，
      該模組中的元件就可以[參照](guide/ngmodule-faq#q-template-reference)_這個_模組的 `HeroComponent`。

      宣告預設是私有的。
      如果這個模組_不_匯出 `HeroComponent`，其他任何模組都看不到它。

      匯入一個模組_不會_自動重新匯出被匯入模組的匯入項。
      模組「B」不能只因為它匯入了匯入 `CommonModule` 的模組 `A`，就使用 `ngIf`。
      模組「B」必須自己匯入 `CommonModule`。

      模組可以將另一個模組列在它的 `exports` 之中，在這種情況下，
      該模組所有的公開元件、指令與管道都會被匯出。

      [重新匯出](guide/ngmodule-faq#q-re-export)讓模組的遞移性變得明確。
      如果模組「A」重新匯出 `CommonModule`，且模組「B」匯入模組「A」，
      模組「B」的元件可以使用 `ngIf`，儘管「B」本身沒有匯入 `CommonModule`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>bootstrap</code>
    </td>

    <td>


      可以啟動的元件清單。

      通常這份清單中只有一個元件，也就是應用程式的_根元件_。

      Angular 可以以多個啟動元件啟動，
      每個在宿主網頁中都有自己的位置。

      啟動元件會自動成為 `entryComponent`。

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>entryComponents</code>
    </td>

    <td>


      未在可到達的元件範本中被[參照](guide/ngmodule-faq#q-template-reference)的元件清單。

      大多數開發者從不設定這個屬性。
      [Angular 編譯器](guide/ngmodule-faq#q-angular-compiler)必須知道應用程式中實際使用的每個元件。
      編譯器可以透過從一個元件範本走到另一個元件範本的參照樹，來發現大多數元件。

      但總是至少有一個元件沒有在任何範本中被參照：
      也就是你啟動以啟動應用程式的根元件 `AppComponent`。
      這就是它被稱為_進入元件_的原因。

      被路由的元件也是_進入元件_，因為它們也沒有在範本中被參照。
      路由器會建立它們，並將它們放入 `<router-outlet>` 附近的 DOM 中。

      雖然被啟動與被路由的元件是_進入元件_，
      你通常不必將它們加入模組的 `entryComponents` 清單。

      Angular 會自動將模組 `bootstrap` 清單中的元件加入 `entryComponents` 清單。
      `RouterModule` 會將被路由的元件加入該清單。

      這樣就只剩下下列無法被發現的元件來源：

      * 使用指令式技術之一啟動的元件。
      * 透過路由器以外的某些方式動態載入到 DOM 中的元件。

      這兩者都是很少有開發者會採用的進階技術。
      如果你是那少數人之一，你必須自己將這些元件加入
      `entryComponents` 清單，無論是以程式方式或手動加入。
    </td>

  </tr>

</table>

