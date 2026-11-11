# NgModules

**NgModules** 負責設定注入器與編譯器，並協助把相關的事物組織在一起。

NgModule 是以 `@NgModule` 裝飾器標記的類別。 `@NgModule` 接受一個中繼資料物件，描述如何編譯元件的範本，以及如何在執行期建立注入器。 它標示出模組自身的元件、指令與管道，並透過 `exports` 屬性將其中一部分公開，讓外部元件可以使用它們。 `@NgModule` 也可以把服務提供者加入應用程式的依賴注入器中。

如需查看展示 NgModule 相關頁面所涵蓋所有技巧的範例應用程式，請參閱 <live-example></live-example>。關於個別技巧的說明，請參閱 NgModules 一節下的相關 NgModule 頁面。

## Angular 模組化

模組是組織應用程式的好方法，也能用外部函式庫的功能擴充應用程式。

Angular 程式庫本身就是 NgModule，例如 `FormsModule`、`HttpClientModule` 與 `RouterModule`。許多第三方程式庫也以 NgModule 的形式提供，例如 [Material Design](https://material.angular.io)、[Ionic](https://ionicframework.com) 與 [AngularFire2](https://github.com/angular/angularfire2)。

NgModule 把元件、指令與管道整合成功能內聚的區塊，每個區塊專注於一個功能領域、應用程式業務領域、工作流程，或一組常用的公用程式。

模組也可以把服務加入應用程式。 這類服務可能由內部開發，像是你自己開發的服務，也可能來自外部來源，例如 Angular 路由器與 HTTP 用戶端。

模組可以在應用程式啟動時積極載入，也可以由路由器非同步地延遲載入。

NgModule 中繼資料的作用如下：

*   宣告哪些元件、指令與管道屬於該模組
*   將其中一部分元件、指令與管道公開，讓其他模組的元件範本可以使用它們
*   匯入其他模組，連同目前模組的元件所需的元件、指令與管道
*   提供其他應用程式元件可以使用的服務

每個 Angular 應用程式都至少有一個模組，也就是根模組。 你[啟動](guide/bootstrapping)該模組來啟動應用程式。

在元件不多的應用程式中，根模組就已足夠。 隨著應用程式成長，你可以把根模組重構成[功能模組](guide/feature-modules)，它們代表相關功能的集合。 接著把這些模組匯入根模組。

## 基本的 NgModule

[Angular CLI](cli) 在建立新應用程式時，會產生下列基本的 `AppModule`：

<code-example path="ngmodules/src/app/app.module.1.ts" header="src/app/app.module.ts (default AppModule)">

// &commat;NgModule decorator with its metadata

</code-example>

最上方是 import 陳述式。 接下來的區段是設定 `@NgModule` 的地方：說明哪些元件與指令屬於它（`declarations`），以及它使用哪些其他模組（`imports`）。 如需深入了解 `@NgModule` 的結構，請務必閱讀 [Bootstrapping](guide/bootstrapping)。

## 更多關於 NgModules

你可能也會對以下內容有興趣：

*   [功能模組](guide/feature-modules)
*   [提供者](guide/providers)
*   [NgModule 的類型](guide/module-types)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
