# 單例服務

#### 先決條件

* 對[啟動](guide/bootstrapping)有基本了解。
* 熟悉[提供者](guide/providers)。

如需使用本頁所述應用程式層級單例服務的範例應用程式，請參閱展示 NgModules 所有已記載功能的
<live-example name="ngmodules"></live-example>。

<hr />

## 提供單例服務

在 Angular 中，有兩種方法可以讓服務成為單例：

* 把 `@Injectable()` 的 `providedIn` 屬性值宣告為 `root`。
* 把服務包含在 `AppModule` 中，或包含在只由 `AppModule` 匯入的模組中

{@a providedIn}

### 使用 `providedIn`

從 Angular 6.0 開始，建立單例服務的首選方式，是在服務的 `@Injectable()` 裝飾器上把 `providedIn` 設為 `root`。這會告訴 Angular 在應用程式根部提供該服務。

<code-example path="providers/src/app/user.service.0.ts"  header="src/app/user.service.0.ts" linenums="false"> </code-example>

如需了解更多關於服務的詳細資訊，請參閱 [Tour of Heroes 教學](tutorial)中的[服務](tutorial/toh-pt4)章節。

### NgModule `providers` 陣列

在以 6.0 之前的 Angular 版本建置的應用程式中，服務會如下註冊於 NgModule 的 `providers` 陣列中：

```ts
@NgModule({
  ...
  providers: [UserService],
  ...
})

```

如果這個 NgModule 是根 `AppModule`，`UserService` 就會是單例，並在整個應用程式中都可使用。雖然你可能看過這樣的寫法，但從 Angular 6.0 起，較好的做法是在服務本身的 `@Injectable()` 裝飾器上使用 `providedIn` 屬性，因為這能讓你的服務可被搖樹優化。

{@a forRoot}

## `forRoot()` 模式

一般來說，你只會需要用 `providedIn` 來提供服務，以及用 `forRoot()`/`forChild()` 來處理路由。不過，了解 `forRoot()` 如何運作以確保服務是單例，能讓你的開發功力更上一層樓。

如果一個模組同時定義了提供者與宣告（元件、指令、管道），把該模組載入多個功能模組就會重複註冊該服務。這可能導致多個服務執行個體，服務也就不再表現得像單例。

有幾種方法可以防止這種情況：

* 使用 [`providedIn` 語法](guide/singleton-services#providedIn)，而不是在模組中註冊服務。
* 把你的服務分到自己的模組中。
* 在模組中定義 `forRoot()` 與 `forChild()` 方法。

<div class="alert is-helpful">

**注意：** 有兩個範例應用程式可以看到這種情境：較進階的 <live-example noDownload>NgModules 即時範例</live-example>（其路由模組與 `GreetingModule` 中包含 `forRoot()` 與 `forChild()`），以及較簡單的 <live-example name="lazy-loading-ngmodules" noDownload>延遲載入即時範例</live-example>。關於入門說明，請參閱[延遲載入功能模組](guide/lazy-loading-ngmodules)指南。

</div>

使用 `forRoot()` 把提供者從模組中分離出來，這樣你就可以把該模組連同 `providers` 匯入根模組，並把不帶 `providers` 的它匯入子模組。

1. 在模組上建立一個靜態方法 `forRoot()`。
2. 把提供者放進 `forRoot()` 方法中。

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts" linenums="false"> </code-example>

{@a forRoot-router}

### `forRoot()` 與 `Router`

`RouterModule` 提供 `Router` 服務，以及 `RouterOutlet`、`routerLink` 等路由器指令。根應用程式模組匯入 `RouterModule`，讓應用程式擁有 `Router`，且根應用程式元件能取用路由器指令。任何功能模組也必須匯入 `RouterModule`，讓它們的元件能把路由器指令放進範本中。

如果 `RouterModule` 沒有 `forRoot()`，每個功能模組都會實例化一個新的 `Router` 執行個體，這會使應用程式出錯，因為 `Router` 只能有一個。使用 `forRoot()` 方法後，根應用程式模組匯入 `RouterModule.forRoot(...)` 並取得一個 `Router`，所有功能模組則匯入 `RouterModule.forChild(...)`，不會再實例化另一個 `Router`。

<div class="alert is-helpful">

**注意：** 如果你有一個同時包含 providers 與 declarations 的模組，你*可以*使用這個技巧把它們分開，你也可能在舊版應用程式中看到這種模式。
不過，自 Angular 6.0 起，提供服務的最佳做法是使用 `@Injectable()` 的 `providedIn` 屬性。

</div>

### `forRoot()` 的運作方式

`forRoot()` 接受一個服務設定物件，並回傳
[ModuleWithProviders](api/core/ModuleWithProviders)，這是一個帶有下列屬性的簡單物件：

* `ngModule`：在本例中，即 `GreetingModule` 類別
* `providers`：設定好的提供者

在 <live-example name="ngmodules">即時範例</live-example>
中，根 `AppModule` 會匯入 `GreetingModule`，並把
`providers` 加入 `AppModule` 的 providers。具體來說，
Angular 會先累積所有匯入的 providers，
再附加 `@NgModule.providers` 中列出的項目。
這個順序可確保你明確加入
`AppModule` providers 的任何內容，都優先於
匯入模組的 providers。

範例應用程式匯入 `GreetingModule`，並只在 `AppModule` 中使用一次它的 `forRoot()` 方法。像這樣只註冊一次，可以防止多個執行個體。

你也可以在 `GreetingModule` 中加入一個 `forRoot()` 方法，來設定問候用的 `UserService`。

在下列範例中，選用的、已注入的 `UserServiceConfig`
會擴充問候用的 `UserService`。如果存在 `UserServiceConfig`，`UserService` 就會根據該設定來設定使用者名稱。

<code-example path="ngmodules/src/app/greeting/user.service.ts" region="ctor" header="src/app/greeting/user.service.ts (constructor)" linenums="false">

</code-example>

以下是接受 `UserServiceConfig` 物件的 `forRoot()`：

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts (forRoot)" linenums="false">

</code-example>

最後，在 `AppModule` 的 `imports` 清單中呼叫它。在下列
程式碼片段中，檔案的其他部分已省略。如需查看完整檔案，請參閱 <live-example name="ngmodules"></live-example>，或繼續閱讀本文件的下一節。

<code-example path="ngmodules/src/app/app.module.ts" region="import-for-root" header="src/app/app.module.ts (imports)" linenums="false">

</code-example>

應用程式會顯示「Miss Marple」作為使用者，而非預設的「Sherlock Holmes」。

請記得在檔案頂部把 `GreetingModule` 作為 Javascript import 匯入，且不要把它加入一個以上的 `@NgModule` `imports` 清單。

## 防止重複匯入 `GreetingModule`

只有根 `AppModule` 應該匯入 `GreetingModule`。如果
延遲載入的模組也匯入它，應用程式可能會產生服務的
[多個執行個體](guide/ngmodule-faq#q-why-bad)。

為了防止延遲載入的模組重複匯入 `GreetingModule`，請加入下列 `GreetingModule` 建構子。

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="ctor" header="src/app/greeting/greeting.module.ts" linenums="false">

</code-example>

這個建構子告訴 Angular 把 `GreetingModule` 注入它自己。
如果 Angular 在*目前的*注入器中尋找
`GreetingModule`，注入就會變成循環，但 `@SkipSelf()`
裝飾器的意思是「在注入器階層中我上方的祖先
注入器中尋找 `GreetingModule`」。

依預設，當注入器找不到所請求的提供者時會擲出錯誤。
`@Optional()` 裝飾器表示找不到服務也沒關係。
注入器會回傳 `null`，`parentModule` 參數為 null，
建構子就平順地結束。

如果你不當地把 `GreetingModule` 匯入像 `CustomersModule` 這樣的延遲載入模組，情況就不同了。

Angular 會為延遲載入模組建立它自己的注入器，
這是根注入器的子注入器。
`@SkipSelf()` 使 Angular 在父注入器中尋找 `GreetingModule`，而這次父注入器就是根注入器。
它當然會找到根 `AppModule` 匯入的執行個體。
此時 `parentModule` 存在，建構子便擲出錯誤。

以下為這兩個檔案的完整內容，供參考：

<code-tabs linenums="false">
 <code-pane header="app.module.ts" path="ngmodules/src/app/app.module.ts">
 </code-pane>
 <code-pane header="greeting.module.ts" region="whole-greeting-module" path="ngmodules/src/app/greeting/greeting.module.ts">
 </code-pane>
</code-tabs>

<hr />

## 更多關於 NgModules

你可能也會對以下內容有興趣：
* [共享模組](guide/sharing-ngmodules)，進一步闡述本頁涵蓋的概念。
* [延遲載入模組](guide/lazy-loading-ngmodules)。
* [NgModule 常見問題](guide/ngmodule-faq)。
