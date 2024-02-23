# NgModule 常見問題

NgModules 協助將應用程式整理成具有凝聚力的功能區塊。

此頁面解答許多開發人員關於 NgModule 設計與實作的疑問。

## 我應該將哪些類別加入 `declarations` 陣列？

將 [declarable](/guide/ngmodules/bootstrapping#the-declarations-array) 類別&mdash;元件、指令和管道&mdash;新增至 `declarations` 清單。

在應用程式的 *單一* 模組中宣告這些類別。
如果它們屬於特定模組，則在該模組中宣告它們。

## 什麼是 `declarable`？

宣告是類別類型&mdash;元件、指令和管道&mdash;，您可以將其新增至模組的 `declarations` 清單。
它們是您可以新增至 `declarations` 的唯一類別。

## 我不應將哪些類別新增到 `declarations`？

只將 [可宣告](/guide/ngmodules/bootstrapping#the-declarations-array) 類別加入 NgModule 的 `declarations` 清單中。

不要宣告以下：

* 在其他模組中已宣告的類別，無論是應用程式模組、`@NgModule` 或第三方模組。
* 從其他模組匯入的指令陣列。
    例如，不要宣告 `@angular/forms` 中的 `FORMS_DIRECTIVES`，因為 `FormsModule` 已宣告它。
* 模組類別。
* 服務類別。
* 非 Angular 類別和物件，例如字串、數字、函式、實體模型、組態、商業邏輯和輔助類別。

## 為什麼將相同的元件列在多個 `NgModule` 屬性中？

`AppComponent` 經常同時列在 `declarations` 和 `bootstrap` 中。
你可能會看到同一個元件列在 `declarations` 和 `exports` 中。

雖然這看起來多餘，但這些屬性具有不同的功能。
在一個清單中的成員資格並不意味在另一個清單中的成員資格。

* `AppComponent` 可以在此模組中宣告，但無法啟動。
* `AppComponent` 可以在此模組中啟動，但必須在其他功能模組中宣告。
* 可以從其他應用程式模組匯入元件（因此您無法宣告它），並由此模組重新匯出。
* 可以匯出元件以包含在外部元件的範本中，並在彈出式對話方塊中動態載入。

## 「無法繫結到「x」，因為它不是「y」的已知屬性」是什麼意思？

此錯誤通常表示您尚未宣告指令「x」或尚未匯入「x」所屬的 NgModule。

HELPFUL：您可能在應用程式子模組中宣告「x」，但忘記匯出它。
在您將「x」類別新增至 `exports` 清單前，其他模組看不到它。

## 我應該匯入什麼？

匯入在此模組的元件範本中，您需要參照的公開 (匯出) [可宣告類別](/guide/ngmodules/bootstrapping#the-declarations-array) 的 NgModules。

這總是表示從 `@angular/common` 匯入 `CommonModule` 以存取 `NgIf` 和 `NgFor` 等 Angular 指令。您可以直接匯入，或從重新匯出它的另一個 NgModule 匯入。

只在根 `AppModule` 中匯入 [BrowserModule](#should-i-import-browsermodule-or-commonmodule?)。

如果您的元件有 `[(ngModel)]` 雙向繫結表達式，則從 `@angular/forms` 匯入 `FormsModule`。

當您的元件使用其元件、指令和管道時，匯入 *shared* 和 *feature* 模組。

## 我應該匯入 `BrowserModule` 或 `CommonModule`？

幾乎每個瀏覽器應用程式的根應用程式模組 `AppModule` 都應該從 `@angular/platform-browser` 匯入 `BrowserModule`。
`BrowserModule` 提供啟動和執行瀏覽器應用程式所必備的服務。

`BrowserModule` 也會從 `@angular/common` 重新匯出 `CommonModule`，
這表示 `AppModule` 中的元件也能存取每個應用程式都需要使用的 Angular 指令，例如 `NgIf` 和 `NgFor`。

不要在任何其他模組中匯入 `BrowserModule`。
*功能模組* 和 *延遲載入模組* 應該改為匯入 `CommonModule`。
他們需要共用指令。
他們不需要重新安裝全應用程式範圍的提供者。

注意：匯入 `CommonModule` 也使功能模組可在 *任何* 目標平台上使用，而不僅限於瀏覽器。

## 如果我匯入同一個模組兩次會怎樣？

這不是問題。
當三個模組都匯入模組「A」時，Angular 在第一次遇到模組「A」時會評估它一次，之後就不會再評估。

無論在哪個層級，`A` 在匯入的 NgModules 層級結構中出現，這都是正確的。
當模組「B」匯入模組「A」、模組「C」匯入「B」，以及模組「D」匯入 `[C, B, A]` 時，則「D」會觸發「C」的評估，進而觸發「B」的評估，最後評估「A」。
當 Angular 處理「D」中的「B」和「A」時，它們已經快取並準備就緒了。

Angular 不喜歡具有循環參照的 NgModules，因此不要讓模組「A」匯入模組「B」，而模組「B」又匯入模組「A」。

## 我應該匯出什麼？

匯出 [可宣告的](/guide/ngmodules/bootstrapping#the-declarations-array) 類別，其他 NgModules 中的元件應能在其範本中使用。
這些是您的 *公開* 類別。
如果您未匯出可宣告的類別，則會保持 *私有*，僅對此 NgModule 中宣告的其他元件可見。

無論是在此 NgModule 或匯入的 NgModule 中宣告，您*可以*匯出任何可宣告的類別 &mdash;元件、指令和管道&mdash;。

您可以重新匯出整個匯入的 NgModules，這會有效地重新匯出所有匯出的類別。
NgModules 甚至可以匯出它沒有匯入的模組。

## 我*不應*輸出什麼？

不要匯出以下內容：

* 僅在在此 NgModule 中宣告的元件中需要的私有元件、指令和管道。
    如果您不希望另一個 NgModule 看到它，就不要匯出它。

* 非可宣告的物件，例如服務、函式、設定和實體模型。
* 僅由路由器或引導程序動態載入的元件。
    此類元件永遠無法在另一個元件的範本中選取。
    雖然匯出它們沒有害處，但也沒有好處。

* 沒有公開（匯出）宣告的純服務模組。
    例如，重新匯出 `HttpClientModule` 沒有意義，因為它沒有匯出任何內容。
    它的唯一目的是將 http 服務提供者加入整個應用程式。

## 我可以重新匯出類別和模組嗎？

絕對。

NgModules 是一種很棒的方式，可以有選擇地從其他 NgModules 聚合類別，並將它們重新匯出到一個整合的便利模組中。

NgModule 可以重新導出整個 NgModules，實際上會重新導出所有導出的類別。
Angular 自身的 `BrowserModule` 像這樣導出幾個 NgModules：

<docs-code language="typescript">

exports: [CommonModule, ApplicationModule]

</docs-code>

NgModule 可以匯出其自有的宣告、選取的匯入類別，以及匯入的 NgModules 的組合。

無需重新匯出純服務模組。
純服務模組不會匯出其他 NgModule 可以使用的 [可宣告](/guide/ngmodules/bootstrapping#the-declarations-array) 類別。
例如，重新匯出 `HttpClientModule` 沒有意義，因為它不會匯出任何內容。
它的唯一目的是將 http 服務提供者新增至整個應用程式。

## `forRoot()` 方法是什麼？

`forRoot()` 靜態方法是一種慣例，讓開發人員可以輕鬆設定預計為單例的服務和提供者。
`forRoot()` 的好範例是 `RouterModule.forRoot()` 方法。

有關 `forRoot()` 的更多資訊，請參閱 [Singleton Services](/guide/ngmodules/singleton-services) 指南中的 [`forRoot()` 模式](/guide/ngmodules/singleton-services#the-forroot()-pattern) 部分。

## 為什麼在功能模組中提供的服務到處可見？

在已引導模組的 `@NgModule.providers` 中列出的提供者具有應用程式範圍。
將服務提供者新增到 `@NgModule.providers` 中，可有效地將服務發布到整個應用程式。

當您匯入 NgModule 時，Angular 會將模組的服務提供者（其 `providers` 清單的內容）新增至應用程式根部注入器。

這讓提供者對應用程式中知道提供者查詢令牌或名稱的每個類別可見。

透過 NgModule 匯入的擴充性是 NgModule 系統的主要目標。
將 NgModule 提供者合併至應用程式注入器，讓模組函式庫能輕易地使用新服務豐富整個應用程式。
只需加入 `HttpClientModule` 一次，每個應用程式元件就能發出 HTTP 要求。

不過，如果您期望模組的服務只對該功能模組所宣告的元件可見，這可能會讓您感到驚訝。
如果 `HeroModule` 提供 `HeroService`，而根 `AppModule` 匯入 `HeroModule`，任何知道 `HeroService` *類型* 的類別都可以注入該服務，而不僅僅是 `HeroModule` 中宣告的類別。

如要限制對服務的存取，請考慮延遲載入提供該服務的 NgModule。
請參閱 [如何將服務範圍限制在模組中？](#how-do-i-restrict-service-scope-to-a-module?) 以進一步了解。

## 為什麼僅在延遲載入的模組中提供的服務可見？

與啟動時載入的模組供應商不同，延遲載入模組的供應商屬於 *模組範圍*。

當 Angular 路由器延遲載入模組時，它會建立新的執行內容。
該 [內容有自己的注入器](#why-does-lazy-loading-create-a-child-injector? "Angular 為何建立子注入器")，它是應用程式注入器的直接子項目。
路由器將延遲載入模組的提供者和其匯入的 NgModules 的提供者新增到此子注入器。

這些提供者與具有相同查詢令牌的應用程式提供者隔離變更。
當路由器在延遲載入的內容中建立元件時，
Angular 偏好從這些提供者建立的服務實例，而不是應用程式根注入器的服務實例。

## 如果兩個模組提供相同的服務怎麼辦？

當兩個匯入的模組同時載入，並列出具有相同權杖的提供者時，第二個模組的提供者會「獲勝」。
這是因為兩個提供者都會新增至同一個注入器。

當 Angular 想要針對該權杖注入服務時，它會建立並提供由第二個提供者建立的實例。

*每個*注入此服務的類別都會取得由第二個提供者建立的執行個體。
即使在第一個模組內宣告的類別也會取得由第二個提供者建立的執行個體。

如果 NgModule A 為程式碼 'X' 提供服務，並匯入一個同樣為程式碼 'X' 提供服務的 NgModule B，則 NgModule A 的服務定義會「勝出」。

由根 `AppModule` 提供的服務優先於由匯入的 NgModules 提供的服務。
`AppModule` 永遠勝出。

## 如何將服務範圍限制在模組中？

當一個模組在應用程式啟動時載入，它的 `@NgModule.providers` 有 *應用程式範圍*；也就是說，它們在整個應用程式中都可以注入。

匯入的提供者很容易被其他匯入的 NgModule 中的提供者取代。
這種取代可能是出於設計。
它可能不是故意的，並會產生不利後果。

一般來說，請將模組與提供者匯入 *僅一次*，最好是在應用程式的 *根模組*。
那通常也是設定、包裝和覆寫它們的最佳位置。

假設某個模組需要一個自訂的 `HttpBackend`，該模組會為所有 Http 要求添加特殊標頭。
如果應用程式中其他地方的另一個模組也自訂 `HttpBackend` 或僅匯入 `HttpClientModule`，則可能會覆寫此模組的 `HttpBackend` 提供者，導致遺失特殊標頭。
伺服器會拒絕來自此模組的 http 要求。

若要避免此問題，請僅在 `AppModule`，應用程式 *根模組* 中匯入 `HttpClientModule`。

如果你必須防範這種「提供者損壞」，*不要依賴啟動時間模組的 `providers`*。

如果可以，請延遲載入模組。
Angular 會給予 [延遲載入模組](#why-is-a-service-provided-in-a-lazy-loaded-module-visible-only-to-that-module?) 其自己的子注入器。
模組的提供者僅在使用此注入器建立的元件樹中可見。

### 替代方案：將範圍限制於一個元件及其子元件

延續相同的範例，假設模組的元件確實需要私有的自訂 `HttpBackend`。

建立一個「頂層元件」，作為所有模組元件的根。
將自訂的 `HttpBackend` 提供者新增到頂層元件的 `providers` 清單，而不是模組的 `providers`。
請記住，Angular 會為每個元件實例建立一個子注入器，並將元件自己的提供者填入注入器中。

當此元件的子項要求 `HttpBackend` 服務時，
Angular 提供本地的 `HttpBackend` 服務，而非在應用程式根注入器中提供的版本。
然後，不論其他模組如何設定 `HttpBackend`，子元件都能提出已設定的 HTTP 要求。

請務必將需要存取此特殊設定 `HttpBackend` 的元件做為此元件的子項來建立。

您可以在頂層元件的範本中嵌入子元件。
或者，透過給予 `<router-outlet>`，使頂層元件成為路由主機。
定義子路由，並讓路由器將模組元件載入該出口。

雖然您可以透過在延遲載入的模組中提供服務或在元件中提供服務來限制存取服務，但元件中提供的服務可能會造成這些服務出現多個執行個體。
因此，延遲載入是較佳的選擇。

## 我應該將應用程式範圍的提供者加入到根 `AppModule` 或根 `AppComponent`？

透過在 `@Injectable()` 裝飾器 (在服務的情況下) 或 `InjectionToken` 建構 (在提供權杖的情況下) 中指定 `providedIn: 'root'`，來定義應用程式範圍的提供者。
以這種方式建立的提供者會自動提供給整個應用程式，無需在任何模組中列出。

如果無法以這種方式配置提供者（可能是因為它沒有合理的預設值），則在根 `AppModule` 中註冊應用程式範圍的提供者，而不是在 `AppComponent` 中。

延遲載入的模組及其元件可以注入 `AppModule` 服務；它們無法注入 `AppComponent` 服務。

僅在服務必須對 `AppComponent` 樹之外的元件隱藏時，才在 `AppComponent` 提供者中註冊服務。
這是一個少見的用例。

更常規地，[優先在 NgModules 中註冊供應商](#should-i-add-other-providers-to-a-module-or-a-component?)，而不是在元件中註冊。

### 討論

Angular 將所有啟動模組提供者註冊到應用程式根注入器。
根注入器提供者建立的服務具有應用程式範圍，這表示它們可供整個應用程式使用。

某些服務（例如 `Router`）僅在您將它們註冊到應用程式根注入器時才會運作。

相比之下，Angular 會將 `AppComponent` 提供者註冊到 `AppComponent` 自身的注入器。
`AppComponent` 服務僅供該元件及其元件樹使用。
它們具有元件範圍。

`AppComponent` 的注入器是根注入器的子級，在注入器層級中往下一個。
對於不使用路由器的應用程式，那就是幾乎整個應用程式。
但在路由的應用程式中，路由在根層級運作，而 `AppComponent` 服務不存在。
這表示延遲載入的模組無法到達它們。

## 我應該在模組或元件中加入其他提供者？

`@Injectable` 語法應配置供應商。
如果可能，應在應用程式根目錄中提供它們 (`providedIn: 'root'`)。
如果僅從延遲載入的內容中使用以這種方式配置的服務，則會延遲載入它們。

如果由消費者決定是否要在整個應用程式中提供服務，則在模組 (`@NgModule.providers`) 中註冊服務，而不是在元件 (`@Component.providers`) 中註冊。

當您*必須*將服務實例的範圍限制在該元件及其元件樹時，請使用元件註冊提供者。
將相同的理由套用於使用指令註冊提供者。

例如，需要快取服務私人複本的編輯元件應將服務註冊到元件。
然後，元件的每個新執行個體都會取得它自己的快取服務執行個體。
編輯者在其服務中所做的變更不會影響應用程式中其他地方的執行個體。

[永遠使用根 `AppModule` 註冊 *應用程式範圍* 服務](#should-i-add-application-wide-providers-to-the-root-appmodule-or-the-root-appcomponent?)，而不是根 `AppComponent`。

## 共用模組向延遲載入模組提供服務有什麼壞處？

### 急切載入的場景

當一個載入快速的模組提供一個服務，例如 `UserService`，該服務在應用程式範圍內可用。
如果根模組提供 `UserService` 並匯入提供相同 `UserService` 的另一個模組，Angular 會在根應用程式注入器中註冊其中一個 (請參閱 [如果我匯入相同的模組兩次怎麼辦？](#what-if-i-import-the-same-module-twice?)。

然後，當某些元件注入 `UserService` 時，Angular 會在應用程式根注入器中找到它，並傳遞應用程式範圍的單例服務。
沒問題。

### 懶惰載入的場景

現在考慮一個惰性載入的模組，它也提供一個名為 `UserService` 的服務。

當路由器延遲載入模組時，它會建立一個子注入器，並將 `UserService` 提供者註冊到該子注入器。
子注入器 *不是* 根注入器。

當 Angular 為該模組建立延遲元件並注入 `UserService` 時，它會在延遲模組的 *子注入器* 中找到一個 `UserService` 提供者，並建立 `UserService` 的 *新* 實例。
這是一個與 Angular 在其中一個急迫載入的元件中注入的應用程式範圍單例版本完全不同的 `UserService` 實例。

這種情況會導致您的應用程式每次都建立新的執行個體，而不是使用單例。

## 為什麼延遲載入會建立子注入器？

Angular 將 `@NgModule.providers` 新增到應用程式根注入器，除非 NgModule 是延遲載入的。
對於延遲載入的 NgModule，Angular 會建立一個 *子注入器*，並將模組的提供者新增到子注入器。

這表示 NgModule 的行為取決於它是在應用程式啟動期間載入或之後才延遲載入。
忽略該差異可能會導致 [不良後果](#why-is-it-bad-if-a-shared-module-provides-a-service-to-a-lazy-loaded-module?)。

為什麼 Angular 沒有像對熱切載入的 NgModules 那樣，將延遲載入的提供者新增到應用程式根部注入器中？

答案奠基於 Angular 相依性注入系統的基本特徵。
注入器可以在 *首次使用之前* 新增提供者。
一旦注入器開始建立並傳送服務，其提供者清單就會凍結；不允許新增提供者。

當應用程式啟動時，Angular 首先使用已熱切載入的 NgModules 的提供者來配置根注入器，*然後* 建立其第一個元件並注入任何提供的服務。
一旦應用程式開始，應用程式根注入器就會關閉新提供者。

時間流逝，應用程式邏輯觸發 NgModule 的延遲載入。
Angular 必須將延遲載入模組的提供者新增到某個注入器。
它無法將它們新增到應用程式根注入器，因為該注入器已關閉不接受新提供者。
因此 Angular 為延遲載入模組內容建立新的子注入器。

## 如何判斷 NgModule 或服務先前是否已載入？

某些 NgModules 及其服務應僅由根 `AppModule` 載入一次。
透過延遲載入某個模組來第二次匯入模組可能會 [產生錯誤行為](#why-is-it-bad-if-a-shared-module-provides-a-service-to-a-lazy-loaded-module?)，而這些行為可能難以偵測和診斷。

若要防止此問題，請撰寫一個嘗試從根應用程式注入器注入模組或服務的建構函式。
如果注入成功，則已第二次載入類別。
您可以拋出錯誤或採取其他補救措施。

某些 NgModule（例如 `BrowserModule`）會實作此類防護。
以下是一個名為 `GreetingModule` 的 NgModule 的自訂建構函式。

<docs-code header="src/app/greeting/greeting.module.ts" language="typescript">
@NgModule({...})
export class GreetingModule {
  constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
    if (parentModule) {
      throw new Error(
        'GreetingModule is already loaded. Import it in the AppModule only');
    }
  }
}
</docs-code>

## 我應該擁有哪種類型的模組以及如何使用它們？

每個應用程式都不相同。
開發人員對可用選項的經驗和舒適度各不相同。
有些建議和指南似乎具有廣泛的吸引力。

### `SharedModule`

`SharedModule` 是 `NgModule` 的慣用名稱，其中包含您在應用程式中到處使用的元件、指令和管道。
此模組應完全由 `declarations` 組成，其中大部分會被匯出。

`SharedModule` 可以重新導出其他小工具模組，例如 `CommonModule`、`FormsModule` 和含有您最廣泛使用的 UI 控制項的 NgModules。

出於先前 [解釋過的原因](#why-is-it-bad-if-a-shared-module-provides-a-service-to-a-lazy-loaded-module?)，`SharedModule` 不應具有 `providers`。
其匯入或重新導出的模組也不應具有 `providers`。

在您的 *特色* 模組中匯入 `SharedModule`。

### 功能模組

功能模組是您圍繞特定應用程式業務網域、使用者工作流程和公用程式集合所建立的模組。
它們包含特定功能（例如路線、服務、小工具等）來支援您的應用程式。
若要概念化您的應用程式中可能的功能模組，請考慮一下，如果您要將與特定功能（例如搜尋）相關的文件放在一個資料夾中，那麼該資料夾的內容就會是您可能稱為 `SearchModule` 的功能模組。
它會包含構成搜尋功能的所有元件、路由和範本。

如需更多資訊，請參閱 [功能模組](/guide/ngmodules/feature-modules) 和 [模組類型](/guide/ngmodules/module-types)

## NgModules 和 JavaScript 模組之間有什麼不同？

在 Angular 應用中，NgModules 和 JavaScript 模組一起工作。

在現代的 JavaScript 中，每個檔案都是一個模組（請參閱探索 ES6 網站的 [模組](https://exploringjs.com/es6/ch_modules.html) 頁面）。
在每個檔案中，您撰寫一個 `export` 語句，以使模組的部分內容公開。

Angular 的 NgModule 是帶有 `@NgModule` 裝飾器的類別 &mdash;JavaScript 模組不必帶有 `@NgModule` 裝飾器。
Angular 的 `NgModule` 具有 `imports` 和 `exports`，它們具有類似的用途。

您可以*匯入*其他 NgModules，以便在元件範本中使用其導出的類別。
您可以*匯出*此 NgModule 的類別，以便可以匯入並由*其他* NgModules 的元件使用。

如需詳細資訊，請參閱 [JavaScript 模組與 NgModules](guide/ngmodules/vs-jsmodule)。

## 範本參考是什麼？

Angular 是如何於範本中找到元件、指令和管道的？

[Angular 編譯器](#what-is-the-angular-compiler?) 在元件範本中查找其他元件、指令和管道。
當它找到一個時，那就是範本參考。

當 Angular 編譯器可以將該元件或指令的 *selector* 與該範本中的某些 HTML 相匹配時，它會在範本中找到元件或指令。

如果管道的 *名稱* 出現在範本 HTML 的管道語法中，編譯器會找到管道。

Angular 僅會符合此模組所宣告或此模組所匯入模組所匯出的類別的選取器和管線名稱。

## Angular 編譯器是什麼？

Angular 編譯器會將您編寫的應用程式程式碼轉換為效能極高的 JavaScript 程式碼。
`@NgModule` 元資料在引導編譯過程中扮演著重要的角色。

您編寫的程式碼並非立即可執行。
例如，元件包含客製元素、屬性指令、Angular 繫結宣告以及一些顯然不是原生 HTML 的特殊語法。

Angular 編譯器會讀取範本標記，將它與對應的元件類別程式碼結合，並發出 *元件工廠*。

元件工廠會建立一個純粹的、100% JavaScript 表示形式的元件，該元件包含 `@Component` 元資料中描述的所有內容：
HTML、繫結指示、附加樣式。

因為指令和管道出現在元件範本中，所以 Angular 編譯器也會將它們納入已編譯元件程式碼中。

`@NgModule` 元數據告訴 Angular 編譯器要為這個模組編譯哪些元件以及如何將這個模組與其他模組連結。
