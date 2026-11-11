# NgModule FAQ

NgModule 幫助你將應用程式組織成功能內聚的區塊。

本頁回答許多開發者對 NgModule 設計與實作的疑問。

## 我應該將哪些類別加入 `declarations` 陣列？

將[可宣告](guide/bootstrapping#declarations-陣列)類別——元件、指令與管道——加入 `declarations` 清單。

在應用程式中，*恰好*將這些類別宣告在一個模組中。 如果這些類別屬於某個特定模組，就在該模組中宣告它們。

<a id="q-declarable"></a>

## 什麼是 `declarable`？

可宣告類別（declarables）是你可以加入模組 `declarations` 清單的類別型別：元件、指令與管道。 它們是唯一可以加入 `declarations` 的類別。

## 我*不*應該將哪些類別加入 `declarations`？

只將[可宣告](guide/bootstrapping#declarations-陣列)類別加入 NgModule 的 `declarations` 清單。

*不要*宣告下列類別：

*   已在另一個模組中宣告的類別，無論是應用程式模組、`@NgModule` 或第三方模組。
*   從另一個模組匯入的指令陣列。 例如，不要宣告來自 `@angular/forms` 的 `FORMS_DIRECTIVES`，因為 `FormsModule` 已經宣告了它。

*   模組類別。
*   服務類別。
*   非 Angular 的類別與物件，例如字串、數字、函式、實體模型、設定、商業邏輯與輔助類別。

## 為什麼同一個元件會列在多個 `NgModule` 屬性中？

`AppComponent` 經常同時列在 `declarations` 與 `bootstrap` 中。 你可能也會看到同一個元件同時列在 `declarations` 與 `exports` 中。

雖然這看起來多餘，但這些屬性有不同的功能。 列入一份清單，並不表示也列入另一份清單。

*   `AppComponent` 可以宣告在此模組中，但不在此模組中啟動。
*   `AppComponent` 可以在此模組中啟動，但宣告在不同的功能模組中。
*   元件可以從另一個應用程式模組匯入（所以你無法宣告它），並由該模組重新匯出。
*   元件可以被匯出，供外部元件的範本使用，也可以動態載入到彈出式對話框中。

## 「Can't bind to 'x' since it isn't a known property of 'y'」是什麼意思？

這個錯誤通常表示你還沒有宣告指令「x」，或者還沒有匯入「x」所屬的 NgModule。

<div class="alert is-helpful">

也許你在應用程式的子模組中宣告了「x」，卻忘了將它匯出。
除非你將「x」類別加入 `exports` 清單，否則其他模組看不見它。

</div>

## 我應該匯入什麼？

匯入那些你需要在該模組的元件範本中參照其公開（匯出）[可宣告類別](guide/bootstrapping#declarations-陣列)的 NgModule。

這表示你永遠都要從 `@angular/common` 匯入 `CommonModule`，以便使用 `NgIf` 與 `NgFor` 等 Angular 指令。你可以直接匯入它，或從[重新匯出](guide/ngmodule-faq#q-reexport)它的另一個 NgModule 匯入。

如果你的元件具有 `[(ngModel)]` 雙向繫結表達式，請從 `@angular/forms` 匯入 `FormsModule`。

當此模組的元件使用*共享*模組與*功能*模組的元件、指令與管道時，匯入這些模組。

只在根 `AppModule` 中匯入 [BrowserModule](guide/ngmodule-faq#q-browser-vs-common-module)。

<a id="q-browser-vs-common-module"></a>

## 我應該匯入 `BrowserModule` 還是 `CommonModule`？

幾乎每個瀏覽器應用程式的根應用程式模組 `AppModule` 都應從 `@angular/platform-browser` 匯入 `BrowserModule`。

`BrowserModule` 提供了啟動與執行瀏覽器應用程式不可或缺的服務。

`BrowserModule` 也會重新匯出 `@angular/common` 的 `CommonModule`， 這表示 `AppModule` 中的元件也可以使用 每個應用程式都需要的 Angular 指令，例如 `NgIf` 與 `NgFor`。

不要在其他任何模組中匯入 `BrowserModule`。 *功能模組*與*延遲載入模組*應該改為匯入 `CommonModule`。 它們需要常用指令。 它們不需要重新安裝全應用程式範圍的提供者。

注意：匯入 `CommonModule` 也讓功能模組可以在*任何*目標平台上使用，不只是瀏覽器。

<a id="q-reimport"></a>

## 如果我將同一個模組匯入兩次會怎樣？

這不是問題。 當三個模組都匯入模組「A」時，Angular 只會在第一次遇到時評估模組「A」一次，不會再次評估。

無論 `A` 出現在匯入的 NgModule 階層中的哪一層，這都成立。 當模組「B」匯入模組「A」、模組「C」匯入「B」、模組「D」匯入 `[C, B, A]` 時，「D」會觸發對「C」的評估，而「C」觸發對「B」的評估，「B」再評估「A」。 當 Angular 處理到「D」中的「B」與「A」時，它們已經快取好並準備就緒了。

Angular 不喜歡具有循環參照的 NgModule，所以不要讓模組「A」匯入模組「B」，而「B」又匯入模組「A」。

<a id="q-reexport"></a>

## 我應該匯出什麼？

匯出其他 NgModule 中的元件能在其範本中參照的[可宣告](guide/bootstrapping#declarations-陣列)類別。這些是你的*公開*類別。如果你不匯出可宣告類別，它會保持*私有*，只有宣告在此 NgModule 中的其他元件能看見它。

你可以匯出任何可宣告類別——元件、指令與管道——無論它宣告在此 NgModule 中，或是在匯入的 NgModule 中。

你可以重新匯出整個匯入的 NgModule，這等同於重新匯出它們所有匯出的類別。 NgModule 甚至可以匯出一個它沒有匯入的模組。

## 我*不*應該匯出什麼？

不要匯出下列內容：

*   你只需要在宣告於此 NgModule 的元件內使用的私有元件、指令與管道。 如果你不想讓另一個 NgModule 看到它，就不要匯出它。

*   非可宣告物件，例如服務、函式、設定與實體模型。
*   只由路由器或啟動程序動態載入的元件。 這類元件永遠不會在另一個元件的範本中被選用。 匯出它們雖然無害，但也沒有好處。

*   沒有公開（匯出）宣告的純服務模組。 例如，重新匯出 `HttpClientModule` 沒有意義，因為它不匯出任何東西。 它唯一的目的是為整個應用程式加入 http 服務提供者。

## 我可以重新匯出類別與模組嗎？

當然可以。

NgModule 是將其他 NgModule 的類別選擇性地聚合，並在一個整合的便利模組中重新匯出的好方法。

NgModule 可以重新匯出整個 NgModule，這等同於重新匯出它們所有匯出的類別。 Angular 自己的 `BrowserModule` 就是這樣匯出幾個 NgModule 的：

<code-example format="typescript" language="typescript">

exports: [CommonModule, ApplicationModule]

</code-example>

NgModule 可以匯出它自己的宣告、選定的匯入類別與匯入的 NgModule 的組合。

不要費心重新匯出純服務模組。 純服務模組不匯出另一個 NgModule 可以使用的[可宣告](guide/bootstrapping#declarations-陣列)類別。 例如，重新匯出 `HttpClientModule` 沒有意義，因為它不匯出任何東西。 它唯一的目的是為整個應用程式加入 http 服務提供者。

## 什麼是 `forRoot()` 方法？

`forRoot()` 靜態方法是一種慣例，讓開發者能輕鬆設定那些旨在作為單例的服務與提供者。 `forRoot()` 的一個好例子是 `RouterModule.forRoot()` 方法。

應用程式將 `Routes` 陣列傳給 `RouterModule.forRoot()`，以便使用路由設定全應用程式的 `Router` 服務。`RouterModule.forRoot()` 會傳回一個 [ModuleWithProviders](api/core/ModuleWithProviders)。請將該結果加入根 `AppModule` 的 `imports` 清單。

只在根應用程式模組 `AppModule` 中呼叫並匯入 `forRoot()` 的結果。避免在任何其他模組中匯入它，特別是延遲載入的模組。更多關於 `forRoot()` 的資訊，請參閱[單例服務](guide/singleton-services)指南中的[「`forRoot()` 模式」](guide/singleton-services#forroot-模式)一節。

<div class="alert is-helpful">

**NOTE**: <br />
`forRoot()` 匯入可以用在 `AppModule` 以外的模組中。
重要的是，`forRoot()` 只應呼叫一次，而且匯入 `forRoot()` 的模組必須可供根 `ModuleInjector` 使用。
更多資訊請參閱[階層式注入器](guide/hierarchical-dependency-injection#moduleinjector)指南。

</div>

對於服務，與其使用 `forRoot()`，不如在服務的 `@Injectable()` 裝飾器上指定 `providedIn: 'root'`，這會讓服務自動提供給整個應用程式，因此預設為單例。

`RouterModule` 也提供了一個 `forChild()` 靜態方法，用於設定延遲載入模組的路由。

`forRoot()` 與 `forChild()` 是用於分別在根模組與功能模組中設定服務的方法的慣用名稱。

當你撰寫具有可設定服務提供者的類似模組時，請遵循這個慣例。

## 為什麼在功能模組中提供的服務到處都看得到？

列在已啟動模組的 `@NgModule.providers` 中的提供者，具有應用程式作用域。 將服務提供者加入 `@NgModule.providers`，等同於將該服務發佈給整個應用程式。

當你匯入一個 NgModule 時，Angular 會將該模組的服務提供者（其 `providers` 清單的內容）加入應用程式根注入器。

這使提供者對應用程式中每一個知道提供者查找權杖（或名稱）的類別都可見。

透過 NgModule 匯入實現可擴充性，是 NgModule 系統的主要目標。 將 NgModule 提供者合併到應用程式注入器，讓模組函式庫能輕鬆以新服務豐富整個應用程式。 只要加入一次 `HttpClientModule`，每個應用程式元件都能發出 HTTP 請求。

然而，如果你期望模組的服務只對該功能模組宣告的元件可見，這可能會是個不受歡迎的意外。 如果 `HeroModule` 提供了 `HeroService`，而根 `AppModule` 匯入了 `HeroModule`，任何知道 `HeroService` *型別*的類別都能注入該服務，不只是 `HeroModule` 中宣告的類別。

若要限制服務的存取範圍，請考慮延遲載入提供該服務的 NgModule。更多資訊請參閱[我如何限制服務範圍至某個模組？](guide/ngmodule-faq#service-scope)。

<a id="q-lazy-loaded-module-provider-visibility"></a>

## 為什麼在延遲載入模組中提供的服務只對該模組可見？

與啟動時載入的模組的提供者不同，延遲載入模組的提供者是*模組作用域*的。

當 Angular 路由器延遲載入模組時，它會建立一個新的執行脈絡。該[脈絡有自己的注入器](guide/ngmodule-faq#q-why-child-injector "Why Angular creates a child injector")，它是應用程式注入器的直接子注入器。

路由器會將延遲載入模組的提供者及其匯入的 NgModule 的提供者加入這個子注入器。

這些提供者不會受到具有相同查找權杖的應用程式提供者變更的影響。 當路由器在延遲載入的脈絡中建立元件時， Angular 會優先使用由這些提供者建立的服務實例，而不是應用程式根注入器的服務實例。

## 如果兩個模組提供相同的服務會怎樣？

當兩個同時載入的匯入模組列出了權杖相同的提供者時，第二個模組的提供者「勝出」。 這是因為兩個提供者都被加入同一個注入器。

當 Angular 要為該權杖注入服務時，它會建立並交付由第二個提供者建立的實例。

*每個*注入此服務的類別，取得的都是第二個提供者建立的實例。 即使是宣告在第一個模組內的類別，取得的也是第二個提供者建立的實例。

如果 NgModule A 為權杖「X」提供服務，並匯入同樣為權杖「X」提供服務的 NgModule B，那麼 NgModule A 的服務定義「勝出」。

根 `AppModule` 提供的服務，優先於匯入的 NgModule 提供的服務。 `AppModule` 永遠勝出。

<a id="service-scope"></a>

## 如何將服務作用域限制在模組內？

當模組在應用程式啟動時載入，它的 `@NgModule.providers` 具有*整個應用程式的作用域*；也就是說，它們可以在整個應用程式中被注入。

匯入的提供者很容易被另一個匯入的 NgModule 的提供者取代。 這種取代可能是設計使然。 也可能是無意的，並造成不良後果。

一般規則是，只將帶有提供者的模組匯入*恰好一次*，最好是在應用程式的*根模組*中。 那通常也是設定、包裝與覆寫它們的最佳位置。

假設某個模組需要一個自訂的 `HttpBackend`，為所有 Http 請求加入一個特殊標頭。 如果應用程式其他地方的另一個模組也自訂了 `HttpBackend`，或只是匯入了 `HttpClientModule`，它就可能覆寫此模組的 `HttpBackend` 提供者，使特殊標頭遺失。 伺服器會拒絕來自此模組的 http 請求。

若要避免這個問題，只在 `AppModule`（應用程式的*根模組*）中匯入 `HttpClientModule`。

如果你必須防範這種「提供者損毀」，*不要依賴啟動時模組的 `providers`*。

如果可以，請延遲載入模組。Angular 會給[延遲載入的模組](guide/ngmodule-faq#q-lazy-loaded-module-provider-visibility)自己的子注入器。模組的提供者只在以此注入器建立的元件樹內可見。

如果你必須在應用程式啟動時積極載入模組，*請改為在元件中提供服務。*

沿用同一個例子，假設某個模組的元件確實需要一個私有的自訂 `HttpBackend`。

建立一個「頂層元件」，作為該模組所有元件的根。 將自訂的 `HttpBackend` 提供者加入頂層元件的 `providers` 清單，而不是模組的 `providers`。 回想一下，Angular 會為每個元件實例建立一個子注入器，並以元件自己的提供者填入該注入器。

當此元件的子元件要求 `HttpBackend` 服務時，Angular 會提供本機的 `HttpBackend` 服務，而不是應用程式根注入器中提供的版本。無論其他模組對 `HttpBackend` 做什麼，子元件都能正常發出 HTTP 請求。

務必將模組的元件建立為此模組頂層元件的子元件。

你可以將子元件嵌入頂層元件的範本中。 或者，給頂層元件一個 `<router-outlet>`，讓它成為路由宿主。 定義子路由，讓路由器將模組元件載入該出口。

雖然你可以透過在延遲載入模組中提供服務，或在元件中提供服務，來限制對服務的存取，但在元件中提供服務可能導致這些服務出現多個實例。 因此，延遲載入是比較好的做法。

<a id="q-root-component-or-module"></a>

## 我應該將全應用程式範圍的提供者加入根 `AppModule` 還是根 `AppComponent`？

透過在 `@Injectable()` 裝飾器上指定 `providedIn: 'root'`（服務的情況），或在建構 `InjectionToken` 時指定（提供權杖的情況），來定義全應用程式範圍的提供者。 以這種方式建立的提供者會自動提供給整個應用程式，且不需要列在任何模組中。

如果提供者無法以這種方式設定（可能是因為它沒有合理的預設值），那麼請在根 `AppModule` 中註冊全應用程式範圍的提供者，而不是在 `AppComponent` 中。

延遲載入模組及其元件可以注入 `AppModule` 服務；它們無法注入 `AppComponent` 服務。

*只有*在服務必須對 `AppComponent` 樹之外的元件隱藏時，才在 `AppComponent` 提供者中註冊服務。 這是很少見的使用案例。

更一般而言，[最好在 NgModule 中註冊提供者](guide/ngmodule-faq#q-component-or-module)，而不是在元件中註冊。

### 討論

Angular 會將所有啟動模組的提供者註冊到應用程式根注入器。 根注入器的提供者所建立的服務具有應用程式作用域，也就是說，它們對整個應用程式都可用。

某些服務（例如 `Router`）只有在你將它們註冊到應用程式根注入器時才能運作。

相較之下，Angular 會將 `AppComponent` 提供者註冊到 `AppComponent` 自己的注入器。 `AppComponent` 服務只對該元件及其元件樹可用。 它們具有元件作用域。

`AppComponent` 的注入器是根注入器的子注入器，在注入器階層中低一層。 對於不使用路由器的應用程式，那幾乎是整個應用程式。 但在有路由的應用程式中，路由運作在 `AppComponent` 服務不存在的根層級。 這表示延遲載入模組無法存取它們。

<a id="q-component-or-module"></a>

## 我應該將其他提供者加入模組還是元件？

提供者應該使用 `@Injectable` 語法來設定。 如果可能，它們應該在應用程式根部提供（`providedIn: 'root'`）。 以這種方式設定的服務，如果只從延遲載入的脈絡使用，會被延遲載入。

如果應該由使用者決定提供者是否在整個應用程式都可用，那麼請在模組中註冊提供者（`@NgModule.providers`），而不是在元件中註冊（`@Component.providers`）。

當你*必須*將服務實例的作用域限制在該元件及其元件樹時，才將提供者註冊到元件。 對指令註冊提供者時，也適用同樣的推理。

例如，一個需要快取服務私有副本的編輯元件，應該將服務註冊到該元件。 如此一來，元件的每個新實例都會取得它自己的快取服務實例。 該編輯器在其服務中所做的變更，不會影響應用程式其他地方的實例。

[一律向根 `AppModule` 註冊*全應用程式*服務](guide/ngmodule-faq#q-root-component-or-module)，而不是向根 `AppComponent` 註冊。

<a id="q-why-bad"></a>

## 如果共享模組為延遲載入模組提供服務，為什麼不好？

### 及早載入的情境

當積極載入的模組提供服務（例如 `UserService`）時，該服務在整個應用程式都可用。如果根模組提供 `UserService`，並匯入另一個同樣提供 `UserService` 的模組，Angular 會將其中一個註冊到根應用程式注入器（請參閱[如果我將同一個模組匯入兩次會怎樣？](guide/ngmodule-faq#q-reimport)）。

接著，當某個元件注入 `UserService` 時，Angular 會在應用程式根注入器中找到它，並交付全應用程式範圍的單例服務。 沒有問題。

### 延遲載入的情境

現在考慮一個延遲載入模組，它也提供一個名為 `UserService` 的服務。

當路由器延遲載入一個模組時，它會建立一個子注入器，並將 `UserService` 提供者註冊到該子注入器。 子注入器*不是*根注入器。

當 Angular 為該模組建立一個延遲載入元件並注入 `UserService` 時，它會在延遲載入模組的*子注入器*中找到 `UserService` 提供者， 並建立一個*新的* `UserService` 實例。 這與 Angular 在及早載入的元件中注入的全應用程式單例版本，是完全不同的 `UserService` 實例。

這種情境會使你的應用程式每次都建立新實例，而不是使用單例。

<!--todo: KW--What does this cause? I wasn't able to get the suggestion of this to work from
the current FAQ:
To demonstrate, run the <live-example name="ngmodule">live example</live-example>.
Modify the `SharedModule` so that it provides the `UserService` rather than the `CoreModule`.
Then toggle between the "Contact" and "Heroes" links a few times.
The username goes bonkers as the Angular creates a new `UserService` instance each time.
I'd like to see the error so I can include it.-->

<a id="q-why-child-injector"></a>

## 為什麼延遲載入會建立子注入器？

Angular 會將 `@NgModule.providers` 加入應用程式根注入器，除非該 NgModule 是延遲載入的。 對於延遲載入的 NgModule，Angular 會建立一個*子注入器*，並將該模組的提供者加入子注入器。

這表示 NgModule 的行為會因它是在應用程式啟動時載入、還是稍後延遲載入而有所不同。忽略這個差異可能導致[不良後果](guide/ngmodule-faq#q-why-bad)。

為什麼 Angular 不像對及早載入的 NgModule 那樣，將延遲載入的提供者加入應用程式根注入器？

答案植基於 Angular 依賴注入系統的一項基本特性。 注入器可以加入提供者，*直到它第一次被使用為止*。 一旦注入器開始建立並交付服務，它的提供者清單就凍結了；不允許新的提供者。

當應用程式啟動時，Angular 會先以所有及早載入 NgModule 的提供者設定根注入器，*然後*才建立它的第一個元件並注入任何提供的服務。 應用程式一旦開始執行，應用程式根注入器就不再接受新的提供者。

時間流逝，應用程式邏輯觸發了某個 NgModule 的延遲載入。 Angular 必須將延遲載入模組的提供者加入某處的注入器。 它無法將它們加入應用程式根注入器，因為該注入器已不再接受新的提供者。 所以 Angular 為延遲載入模組的脈絡建立一個新的子注入器。

<a id="q-is-it-loaded"></a>

## 如何判斷 NgModule 或服務先前是否已載入？

某些 NgModule 及其服務應該只由根 `AppModule` 載入一次。透過延遲載入模組第二次匯入該模組，可能會[產生錯誤行為](guide/ngmodule-faq#q-why-bad)，而且可能難以偵測與診斷。

若要防止這個問題，請撰寫一個建構子，嘗試從根應用程式注入器注入該模組或服務。 如果注入成功，表示該類別已被第二次載入。 你可以拋出錯誤，或採取其他補救措施。

某些 NgModule（例如 `BrowserModule`）實作了這樣的防護。 以下是一個名為 `GreetingModule` 的 NgModule 的自訂建構子。

<code-example header="src/app/greeting/greeting.module.ts (Constructor)" path="ngmodules/src/app/greeting/greeting.module.ts" region="ctor"></code-example>

## 我應該有哪些種類的模組，又該如何使用它們？

每個應用程式都不同。 開發者的經驗與對可用選項的熟悉程度各不相同。 有些建議與準則似乎廣受歡迎。

### `SharedModule`

`SharedModule` 是 `NgModule` 的慣用名稱，其中的元件、指令與管道會在你的應用程式各處使用。 這個模組應該完全由 `declarations` 組成，其中大部分會匯出。

`SharedModule` 可以重新匯出其他小工具模組，例如 `CommonModule`、`FormsModule`，以及那些包含你最廣泛使用的 UI 控制項的 NgModule。

`SharedModule` 不應有 `providers`，原因如[先前所述](guide/ngmodule-faq#q-why-bad)。其匯入或重新匯出的任何模組也不應有 `providers`。

在你的*功能*模組中匯入 `SharedModule`，包括應用程式啟動時載入的模組，以及稍後延遲載入的模組。

### 功能模組

功能模組是你圍繞特定應用程式業務領域、使用者工作流程與公用程式集合所建立的模組。 它們透過包含特定功能（例如路由、服務、小工具等）來支援你的應用程式。 若要想像功能模組在你的應用程式中會是什麼樣子，可以這樣想：如果你會將與某項功能（例如搜尋）相關的檔案放在同一個資料夾中，那麼該資料夾的內容就會是一個功能模組，你可能會稱它為 `SearchModule`。 它會包含構成搜尋功能的所有元件、路由與範本。

更多資訊請參閱[功能模組](guide/feature-modules)與[模組類型](guide/module-types)

## NgModule 與 JavaScript 模組有什麼差別？

在 Angular 應用程式中，NgModule 與 JavaScript 模組協同運作。

在現代 JavaScript 中，每個檔案都是一個模組（請見 Exploring ES6 網站的 [Modules](https://exploringjs.com/es6/ch_modules.html) 頁面）。 在每個檔案中，你撰寫一個 `export` 敘述，讓模組的部分內容公開。

Angular NgModule 是帶有 `@NgModule` 裝飾器的類別——JavaScript 模組不一定有 `@NgModule` 裝飾器。Angular 的 `NgModule` 有 `imports` 與 `exports`，它們的用途相似。

你*匯入*其他 NgModule，以便在元件範本中使用它們匯出的類別。 你*匯出*此 NgModule 的類別，讓它們能被*其他* NgModule 的元件匯入並使用。

更多資訊，請見 [JavaScript 模組與 NgModule 的比較](guide/ngmodule-vs-jsmodule)。

<a id="q-template-reference"></a>

## Angular 如何在範本中找到元件、指令與管道？什麼是**範本參照**？

[Angular 編譯器](guide/ngmodule-faq#q-angular-compiler)會在元件範本內部尋找其他元件、指令與管道。當它找到一個時，那就是一個範本參照。

當 Angular 編譯器能將該元件或指令的*選擇器*，與該範本中的某些 HTML 相比對時，它就在範本中找到了一個元件或指令。

當管道的*名稱*出現在範本 HTML 的管道語法中時，編譯器就找到了該管道。

Angular 只比對由此模組宣告的類別、或由此模組匯入的模組所匯出的類別的選擇器與管道名稱。

<a id="q-angular-compiler"></a>

## 什麼是 Angular 編譯器？

Angular 編譯器將你撰寫的應用程式程式碼，轉換為高效能的 JavaScript 程式碼。 `@NgModule` 中繼資料在引導編譯過程中扮演重要角色。

你撰寫的程式碼不能立即執行。 例如，元件的範本包含自訂元素、屬性指令、Angular 繫結宣告，以及一些明顯不是原生 HTML 的特殊語法。

Angular 編譯器讀取範本標記，將它與對應的元件類別程式碼結合，並發出*元件工廠*。

元件工廠建立該元件的純粹、100% JavaScript 表示形式，納入其 `@Component` 中繼資料所描述的一切： HTML、繫結指示、附加的樣式。

由於指令與管道出現在元件範本中，Angular 編譯器也將它們納入編譯後的元件程式碼。

`@NgModule` 中繼資料告訴 Angular 編譯器要為此模組編譯哪些元件，以及如何將此模組與其他模組連結。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
