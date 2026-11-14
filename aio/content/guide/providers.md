# 提供者

#### 先決條件：
* 對[啟動](guide/bootstrapping)有基本的理解。
* 熟悉[常用 NgModule](guide/frequent-ngmodules)。

如需查看使用本頁所述提供者的最終範例應用程式，
請參閱 <live-example></live-example>。

<hr>

提供者是給 DI 系統的指示，告訴它如何取得某個相依性的值。大多數時候，這些相依性是你建立並提供的服務。

## 提供服務

如果你已經有一個以 CLI 產生的應用程式，可以在根專案目錄中使用下列 CLI 指令建立服務。請把 _User_ 換成你的服務名稱。

```sh
ng generate service User
```

這個指令會建立下列 `UserService` 骨架：

<code-example path="providers/src/app/user.service.0.ts"  title="src/app/user.service.0.ts" linenums="false"> </code-example>

現在你可以在應用程式的任何地方注入 `UserService`。

服務本身是 CLI 產生的一個類別，並以 `@Injectable` 裝飾。依預設，這個裝飾器設定有 `providedIn` 屬性，會為該服務建立一個提供者。在這個例子中，`providedIn: 'root'` 指定該服務應在根注入器中提供。


## 提供者範圍

當你把服務提供者加入根應用程式注入器時，它在整個應用程式中都可使用。此外，只要持有查詢權杖，應用程式中的所有類別也都能使用這些提供者。

你應該一律在根注入器中提供服務，除非你希望服務只有在使用者匯入特定的 `@NgModule` 時才可使用。

## providedIn 與 NgModules

你也可以指定某個服務應在特定的 `@NgModule` 中提供。例如，如果你不希望 `UserService` 可供應用程式使用，除非它們匯入你建立的 `UserModule`，你可以指定該服務應在該模組中提供：

<code-example path="providers/src/app/user.service.1.ts"  title="src/app/user.service.1.ts" linenums="false">  </code-example>

上述範例展示了在模組中提供服務的首選方式。這個方法之所以是首選，是因為如果沒有任何東西注入該服務，它能讓該服務被搖樹優化（tree-shaking）。如果無法在服務中指定應由哪個模組提供它，你也可以在模組內為該服務宣告一個提供者：

<code-example path="providers/src/app/user.module.ts"  title="src/app/user.module.ts" linenums="false">  </code-example>

## 以延遲載入模組限制提供者範圍

在基本的 CLI 產生應用程式中，模組都是積極載入的，也就是它們在應用程式啟動時全部載入。Angular 使用注入器系統，讓各模組之間能互相取用資源。在積極載入的應用程式中，根應用程式注入器會讓所有模組中的所有提供者在整個應用程式中都可使用。

當你使用延遲載入時，這種行為必然會改變。延遲載入是指只在需要時才載入模組，例如在路由時。它們不會像積極載入的模組那樣一開始就載入。這表示列在它們的 providers 陣列中的任何服務都無法使用，因為根注入器並不知道這些模組的存在。

<!-- KW--Make diagram here -->
<!-- KW--per Misko: not clear if the lazy modules are siblings or grand-children. They are both depending on router structure. -->
當 Angular 路由器延遲載入一個模組時，會建立一個新的注入器。這個注入器是根應用程式注入器的子注入器。想像一棵注入器樹：有一個根注入器，每個延遲載入的模組則各有一個子注入器。路由器會把根注入器的所有提供者加入子注入器。當路由器在延遲載入的上下文中建立元件時，Angular 會優先使用由這些提供者建立的服務執行個體，而不是應用程式根注入器的服務執行個體。

在延遲載入模組的上下文中建立的任何元件，例如透過路由器導覽建立的元件，會取得該服務的本機執行個體，而不是根應用程式注入器中的執行個體。外部模組中的元件則繼續接收為應用程式根建立的執行個體。

雖然你可以透過延遲載入模組來提供服務，但並非所有服務都能延遲載入。例如，有些模組只能在根模組中運作，例如 Router。Router 會與瀏覽器中的全域 location 物件協作。


## 以元件限制提供者範圍

另一種限制提供者範圍的方法，是把你想限制的服務加入元件的
`providers` 陣列。元件提供者與 NgModule 提供者彼此獨立。這個
方法很有用，當你想積極載入一個需要獨占某個服務的模組時。
在元件中提供服務，會把該服務僅限於該元件（同一個模組中的其他元件無法存取它。）

<code-example path="providers/src/app/app.component.ts" region="component-providers" title="src/app/app.component.ts" linenums="false">
</code-example>


## 在模組與元件中提供服務的比較

一般來說，整個應用程式都需要的服務應在根模組中提供，並透過在延遲載入模組中提供服務來界定服務的範圍。

路由器在根層級運作，所以如果你把提供者放在元件中，即使是 `AppComponent`，依賴路由器的延遲載入模組也看不到它們。

<!-- KW--Make a diagram here -->
當你必須把服務執行個體限制在某個元件及其元件樹（也就是其子元件）內時，請在元件中註冊提供者。例如，需要一份私有快取 `UserService` 副本的使用者編輯元件 `UserEditorComponent`，應該向 `UserEditorComponent` 註冊 `UserService`。如此一來，`UserEditorComponent` 的每個新執行個體都會取得自己的快取服務執行個體。


<hr>

## 更多關於 NgModules

你可能也會對以下內容感興趣：
* [單例服務](guide/singleton-services)，其中詳細闡述了本頁涵蓋的概念。
* [延遲載入模組](guide/lazy-loading-ngmodules)。
* [Tree-shakable 提供者](guide/dependency-injection-providers#tree-shakable-providers)。
* [NgModule 常見問題](guide/ngmodule-faq)。
