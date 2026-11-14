# 單例服務

#### 先決條件

* 對[啟動](guide/bootstrapping)有基本了解。
* 熟悉[提供者](guide/providers)。

如需使用本頁所述應用程式層級單例服務的範例應用程式，請參閱展示 NgModules 所有已記載功能的
<live-example name="ngmodules"></live-example>。

<hr />

## 提供單例服務

在 Angular 中，有兩種方法可以讓服務成為單例：

* 宣告該服務應在應用程式根部提供。
* 把服務包含在 `AppModule`，或只被 `AppModule` 匯入的模組中。

從 Angular 6.0 開始，建立單例服務的首選方式，是指定該服務應在應用程式根部提供。做法是在服務的 `@Injectable` 裝飾器上把 `providedIn` 設為 `root`：

<code-example path="providers/src/app/user.service.0.ts"  title="src/app/user.service.0.ts" linenums="false"> </code-example>

如需了解更多關於服務的詳細資訊，請參閱 [Tour of Heroes 教學](tutorial)中的[服務](tutorial/toh-pt4)章節。

## `forRoot()`

如果一個模組同時提供提供者與宣告（元件、指令、管道），把它載入像路由這樣的子注入器，就會重複建立提供者執行個體。提供者重複會造成問題，因為它們會遮蔽根部的執行個體，而這些執行個體很可能就是要作為單例的。為此，Angular 提供了一種方法，把提供者從模組中分離出來，讓同一個模組可以帶著 `providers` 匯入根模組，也可以不帶 `providers` 匯入子模組。

1. 在模組上建立一個靜態方法 `forRoot()`（依慣例）。
2. 如下所示，把提供者放進 `forRoot` 方法中。

<!-- MH: show a simple example how to do that without going to deep into it. -->

為了更具體地說明，以 `RouterModule` 為例。`RouterModule` 需要提供 `Router` 服務，以及 `RouterOutlet` 指令。`RouterModule` 必須由根應用程式模組匯入，應用程式才會擁有 `Router`，且應用程式至少要有一個 `RouterOutlet`。它也必須由各個路由元件匯入，路由元件才能把 `RouterOutlet` 指令放進它們的範本中，用於子路由。

如果 `RouterModule` 沒有 `forRoot()`，每個路由元件都會實例化一個新的 `Router` 執行個體，這會讓應用程式出錯，因為 `Router` 只能有一個。為此，`RouterModule` 設有 `RouterOutlet` 宣告，讓它到處都可用，但 `Router` 提供者只放在 `forRoot()` 中。結果就是，根應用程式模組匯入 `RouterModule.forRoot(...)` 並取得一個 `Router`，而所有路由元件匯入的 `RouterModule` 則不包含 `Router`。

如果你有一個同時提供提供者與宣告的模組，就用這個模式把它們分離出來。

為應用程式加入提供者的模組，也可以透過
`forRoot()` 方法，提供設定這些提供者的機制。

`forRoot()` 接受一個服務設定物件，並回傳
[ModuleWithProviders](api/core/ModuleWithProviders)，這是一個帶有下列屬性的簡單物件：

* `ngModule`：在本例中是 `CoreModule` 類別。
* `providers`：設定好的提供者。

在 <live-example name="ngmodules">即時範例</live-example>
中，根 `AppModule` 匯入了 `CoreModule`，並把
`providers` 加入 `AppModule` 的 providers 中。具體來說，
Angular 會先累積所有匯入的提供者，
再附加 `@NgModule.providers` 中列出的項目。
這個順序確保你明確加入
`AppModule` providers 的任何內容，都優先於
匯入模組的 providers。

匯入 `CoreModule`，並只在 `AppModule` 中使用一次它的 `forRoot()` 方法，因為它會註冊服務，而你只想在你的應用程式中註冊這些服務一次。如果你註冊超過一次，最終可能會有多個服務執行個體和執行期錯誤。

你也可以在 `CoreModule` 中加入一個 `forRoot()` 方法，來設定核心的 `UserService`。

在下列範例中，選用的、已注入的 `UserServiceConfig`
會擴充核心的 `UserService`。如果存在 `UserServiceConfig`，`UserService` 就會根據該設定來設定使用者名稱。

<code-example path="ngmodules/src/app/core/user.service.ts" region="ctor" title="src/app/core/user.service.ts (constructor)" linenums="false">

</code-example>

以下是接受 `UserServiceConfig` 物件的 `forRoot()`：

<code-example path="ngmodules/src/app/core/core.module.ts" region="for-root" title="src/app/core/core.module.ts (forRoot)" linenums="false">

</code-example>

最後，在 `AppModule` 的 `imports` 清單中呼叫它。

<code-example path="ngmodules/src/app/app.module.ts" region="import-for-root" title="src/app/app.module.ts (imports)" linenums="false">

</code-example>

應用程式會顯示「Miss Marple」作為使用者，而非預設的「Sherlock Holmes」。

請記得在檔案頂部把 `CoreModule` 作為 Javascript import 匯入；不要把它加入一個以上的 `@NgModule` `imports` 清單。

<!-- KW--Does this mean that if we need it elsewhere we only import it at the top? I thought the services would all be available since we were importing it into `AppModule` in `providers`. -->

## 防止重複匯入 `CoreModule`

只有根 `AppModule` 應該匯入 `CoreModule`。如果
延遲載入的模組也匯入它，應用程式可能會產生服務的
[多個執行個體](guide/ngmodule-faq#q-why-bad)。

為了防止延遲載入的模組重複匯入 `CoreModule`，請加入下列 `CoreModule` 建構子。

<code-example path="ngmodules/src/app/core/core.module.ts" region="ctor" title="src/app/core/core.module.ts" linenums="false">

</code-example>

這個建構子告訴 Angular 把 `CoreModule` 注入它自己。
如果 Angular 在*目前的*注入器中尋找
`CoreModule`，注入就會變成循環。`@SkipSelf`
裝飾器的意思是「在祖先注入器中尋找 `CoreModule`，
也就是在注入器階層中我上方的注入器」。

如果建構子如預期般在 `AppModule` 中執行，
就不會有祖先注入器能提供 `CoreModule` 的執行個體，注入器應該就此放棄。

依預設，當注入器找不到
所請求的提供者時會擲出錯誤。
`@Optional` 裝飾器表示找不到服務也沒關係。
注入器會回傳 `null`，`parentModule` 參數為 null，
建構子就平順地結束。

如果你不當地把 `CoreModule` 匯入像 `CustomersModule` 這樣的延遲載入模組，情況就不同了。

Angular 會為延遲載入模組建立它自己的注入器，
這是根注入器的*子*注入器。
`@SkipSelf` 使 Angular 在父注入器中尋找 `CoreModule`，而這次父注入器就是根注入器。
它當然會找到根 `AppModule` 匯入的執行個體。
此時 `parentModule` 存在，建構子便擲出錯誤。

以下為這兩個檔案的完整內容，供參考：

<code-tabs linenums="false">
 <code-pane
   title="app.module.ts"
   path="ngmodules/src/app/app.module.ts">
 </code-pane>
 <code-pane
   title="core.module.ts"
   region="whole-core-module"
   path="ngmodules/src/app/core/core.module.ts">
 </code-pane>
</code-tabs>

<hr>

## 更多關於 NgModules

你可能也會對以下內容有興趣：
* [共享模組](guide/sharing-ngmodules)，進一步闡述本頁涵蓋的概念。
* [延遲載入模組](guide/lazy-loading-ngmodules)。
* [NgModule 常見問題](guide/ngmodule-faq)。
