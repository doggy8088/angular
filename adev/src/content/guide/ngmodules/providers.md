# 模組中提供相依性

提供者是對 [依賴注入](/guide/di) 系統的指示，說明如何取得依賴項的值。
大多時候，這些依賴項是您建立並提供的服務。

## 提供服務

如果您已經有一個使用 [Angular CLI](/tools/cli) 建立的應用程式，您可以使用 `ng generate` CLI 指令在根專案目錄中建立一個服務。
將 *User* 替換成您的服務名稱。

<docs-code language="shell">

ng generate service User

</docs-code>

這個指令會建立以下的 `UserService` 雛形：

<docs-code header="src/app/user.service.ts">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
}
</docs-code>

現在您可以在應用程式的任何地方注入 `UserService`。

服務本身是一個由 CLI 生成的類別，並以 `@Injectable()` 裝飾。
預設情況下，此裝飾器具有 `providedIn` 屬性，可為服務創建提供者。
在這種情況下，`providedIn: 'root'` 指定 Angular 應在根注入器中提供服務。

## 提供者範圍

當您將服務提供者新增至根應用程式注入器時，它會在整個應用程式中可用。
此外，只要這些類別具有查詢權杖，這些提供者也會對應用程式中的所有類別可用。

除非有情況是您希望該服務僅在使用者匯入特定 `@NgModule` 時才可用，否則您應該始終在根注入器中提供您的服務。

## 透過延遲載入模組來限制提供者範圍

在基本 CLI 生成的應用程式中，模組是急切加載的，這意味著它們在應用程式啟動時全部載入。
Angular 使用注入器系統讓各模組之間可以互相使用。
在急切加載的應用程式中，根應用程式注入器會讓所有模組中的所有提供者在整個應用程式中可用。

這個行為在使用延遲載入時勢必會有所改變。
延遲載入是指僅在需要時載入模組；例如，在路由時。
它們不會像熱切載入的模組一樣立即載入。
這表示提供者陣列中列出的任何服務均不可用，因為根注入器不知道這些模組。

<!--todo: KW--在此處製作圖表 -->

<!--todo: KW--per Misko: 不清楚懶惰模組是兄弟還是孫輩。它們都取決於路由器結構。 -->

當 Angular 路由器延遲載入模組時，它會建立一個新的注入器。
此注入器是根應用程式注入器的子代。
想像一個注入器樹，有一個單一的根注入器，然後為每個延遲載入的模組建立一個子注入器。
此子注入器會填充所有模組特定的提供者（如果有）。
每個提供者的查詢解析遵循 [依存注入層級規則](/guide/di/hierarchical-dependency-injection#resolution-rules)。

在延遲載入模組的內容中建立的任何元件（例如，透過路由器導覽），會取得子項提供的服務的自己的本地執行個體，而不是根應用程式注入器的執行個體。
外部模組中的元件繼續接收為應用程式根注入器建立的執行個體。

雖然你可以透過延遲載入模組的方式提供服務，但不是所有服務都可以延遲載入。
例如，有些模組只能在根模組中運作，例如路由器。
路由器會與瀏覽器中的全域位置物件一起運作。

自 Angular 版本 9 開始，您可以為每個延遲載入的模組提供新的服務實例。
以下程式碼將此功能新增至 `UserService`。

<docs-code header="src/app/user.service.ts" highlight="[4]">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any',
})
export class UserService {
}
</docs-code>

使用 `providedIn: 'any'` 時，所有急切加載的模組都會共用單例實例；但延遲加載的模組各自會取得自己獨有的實例，如下圖所示。

<img alt="any-provider-scope" class="left" src="assets/content/images/guide/providers/any-provider.svg">

## 使用元件限制提供者範圍

限制提供者範圍的另一種方式是將您想限制的服務新增到元件的 `providers` 陣列中。
元件提供者和 NgModule 提供者彼此獨立。
當您想積極載入需要服務的模組時，此方法很有用。
在元件中提供服務會將服務限制在該元件及其子代中。
同一個模組中的其他元件無法存取它。

<docs-code header="src/app/app.component.ts">
@Component({
  // ...
  providers: [UserService]
})
export class AppComponent {}
</docs-code>

## 在模組中提供服務 vs. 元件

html
<p>
  In Angular, services are typically provided in one of two ways:
</p>

<ul>
  <li>
    In the root injector, which is provided by the root module.
  </li>
  <li>
    In a child injector, which is provided by a child module.
  </li>
</ul>

一般來說，在根模組中提供整個應用程式所需的服務，並透過在延遲載入的模組中提供服務來設定服務範圍。

路由器在根層級運作，因此即便將提供者放在元件中，即使是 `AppComponent`，依賴路由器的延遲載入模組也看不到它們。

<!-- KW--在此處製作圖表 -->

當您必須將服務實例限制在組件及其組件樹，即其子組件時，請使用組件註冊提供者。
例如，正在編輯使用者的組件 `UserEditorComponent`，需要快取 `UserService` 的私有副本，應該使用 `UserEditorComponent` 註冊 `UserService`。
然後，`UserEditorComponent` 的每個新實例都會取得其自己的快取服務實例。

## 注入器層級與服務實例

服務是注入器範圍內的單例，這意味著在給定的注入器中最多只會有一個服務實例。

Angular DI 具有 [階層式注入系統](/guide/di/hierarchical-dependency-injection)，這代表巢狀注入器可以建立自己的服務實例。
每當 Angular 建立一個具有 `providers` 指定在 `@Component()` 中的元件的新實例時，它也會為該實例建立一個新的子注入器。
類似地，當一個新的 NgModule 在執行時期被延遲載入時，Angular 可以為它建立一個注入器，並具有它自己的提供者。

子模組和元件注入器彼此獨立，並建立其提供的服務的獨立實例。
當 Angular 銷毀 NgModule 或元件實例時，它也會銷毀該注入器和該注入器的服務實例。

如需更多資訊，請參閱 [階層式注入器](guide/di/hierarchical-dependency-injection)。

## 更多有關 NgModules

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/singleton-services" title="單例服務"/>
  <docs-pill href="/guide/ngmodules/lazy-loading" title="延遲載入模組"/>
  <docs-pill href="/guide/di/dependency-injection-providers" title="相依性提供者"/>
  <docs-pill href="/guide/ngmodules/faq" title="NgModule 常見問題"/>
</docs-pill-row>

