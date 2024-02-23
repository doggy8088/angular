# NgModules

**NgModules** 配置注入器、編譯器，並協助將相關事物組織在一起。

`NgModule` 是由 `@NgModule` 裝飾器標記的類別。
`@NgModule` 會採用描述如何編譯元件範本以及如何在執行階段建立注入器的資訊物件。
它會識別模組本身的元件、指令和管道，並透過 `exports` 屬性使其中一些元件公開，以便外部元件可以使用它們。
`@NgModule` 也可將服務提供者新增到應用程式相依性注入器。

## Angular 模組性

模組是整理應用程式和使用外部函式庫功能來延伸應用程式的好方法。

Angular 函式庫是 NgModules，例如 `FormsModule`、`HttpClientModule` 和 `RouterModule`。
很多第三方函式庫都可用作 NgModules，例如 [Material Design 元件函式庫](https://material.angular.io)、[Ionic](https://ionicframework.com) 或 [Angular 的 Firebase 整合](https://github.com/angular/angularfire)。

NgModules 將元件、指令和管線整合到功能緊密的區塊中，每個都專注於功能區域、應用程式業務範疇、工作流程或常見的實用程式集合。

模組也可以將服務加入應用程式。
此類服務可能是內部開發的，例如您自己開發的服務，也可能是來自外部來源的，例如 Angular 路由器和 HTTP 客戶端。

模組可以在應用程式啟動時立即載入，或由路由器非同步延遲載入。

NgModule 元數據執行下列動作：

* 宣告哪些組件、指令和管道屬於這個模組
* 使其中一些組件、指令和管道公開，以便其他模組的組件範本可以使用它們
* 匯入其他具有組件、指令和管道的模組，以便當前模組中的組件需要它們
* 提供其他應用程式組件可以使用之服務

每個 Angular 應用程式至少有一個模組，即根模組。
您會 [bootstrap](/guide/ngmodules/bootstrapping) 該模組來啟動應用程式。

根模組是您在具有少數元件的應用程式中唯一需要的。
隨著應用程式成長，您將根模組重構為 [功能模組](/guide/ngmodules/feature-modules)，代表相關功能的集合。
然後，您將這些模組匯入根模組。

## 基本的 NgModule

建立新應用程式時，[Angular CLI](/tools/cli) 會產生下列基本 `AppModule`。

<docs-code header="src/app/app.module.ts">
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
</docs-code>

最上面是匯入陳述式。
下一個區段是您透過聲明哪些組件和指令屬於它 (`declarations`) 以及它使用哪些其他模組 (`imports`) 來配置 `@NgModule` 的位置。
如需有關 `@NgModule` 結構的更多資訊，務必閱讀 [Bootstrapping](/guide/ngmodules/bootstrapping)。

## 更多有關 NgModules

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/feature-modules" title="功能模組"/>
  <docs-pill href="/guide/ngmodules/providers" title="提供者"/>
  <docs-pill href="/guide/ngmodules/module-types" title="NgModules 類型"/>
</docs-pill-row>

