# 在模組中提供相依性

提供者是給[依賴注入](guide/di)系統的指示，告訴它如何取得某個相依性的值。
大多數時候，這些相依性是你建立並提供的服務。

## 提供服務 {#providing-a-service}

如果你已經有一個以 [Angular CLI](/tools/cli) 建立的應用程式，可以在根專案目錄中使用 `ng generate` CLI 指令建立服務。
請把 *User* 換成你的服務名稱。

<docs-code language="shell">

ng generate service User

</docs-code>

這個指令會建立下列 `UserService` 骨架：

<docs-code header="src/app/user.service.ts">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
}
</docs-code>

現在你可以在應用程式的任何地方注入 `UserService`。

服務本身是 CLI 產生的一個類別，並以 `@Injectable()` 裝飾。
依預設，這個裝飾器帶有 `providedIn` 屬性，會為該服務建立一個提供者。
在這個例子中，`providedIn: 'root'` 指定 Angular 應在根注入器中提供該服務。

## 提供者範圍 {#provider-scope}

當你把服務提供者加入根應用程式注入器時，它在整個應用程式中都可使用。
此外，只要持有查詢權杖，應用程式中的所有類別也都能使用這些提供者。

你應該一律在根注入器中提供服務，除非你希望服務只有在使用者匯入特定的 `@NgModule` 時才可使用。

## 以延遲載入模組限制提供者範圍 {#limiting-provider-scope-by-lazy-loading-modules}

在基本的 CLI 產生應用程式中，模組都是積極載入的，也就是它們在應用程式啟動時全部載入。
Angular 使用注入器系統，讓各模組之間能互相取用資源。
在積極載入的應用程式中，根應用程式注入器會讓所有模組中的所有提供者在整個應用程式中都可使用。

當你使用延遲載入時，這種行為必然會改變。
延遲載入是指只在需要時才載入模組，例如在路由時。
它們不會像積極載入的模組那樣一開始就載入。
這表示列在它們的 providers 陣列中的任何服務都無法使用，因為根注入器並不知道這些模組的存在。

<!--todo: KW--Make diagram here -->
<!--todo: KW--per Misko: not clear if the lazy modules are siblings or grand-children. They are both depending on router structure. -->

當 Angular 路由器延遲載入一個模組時，會建立一個新的注入器。
這個注入器是根應用程式注入器的子注入器。
想像一棵注入器樹：有一個根注入器，每個延遲載入的模組則各有一個子注入器。
這個子注入器會填入所有模組專屬的提供者（如果有的話）。
每個提供者的查詢解析都遵循[依賴注入階層的規則](guide/di/hierarchical-dependency-injection#resolution-rules)。

在延遲載入模組的上下文中建立的任何元件，例如透過路由器導覽建立的元件，會取得子注入器所提供服務的自己的本機執行個體，而不是根應用程式注入器中的執行個體。
外部模組中的元件則繼續接收為應用程式根注入器建立的執行個體。

雖然你可以透過延遲載入模組來提供服務，但並非所有服務都能延遲載入。
例如，有些模組只能在根模組中運作，例如 Router。
Router 會與瀏覽器中的全域 location 物件協作。

從 Angular 第 9 版起，你可以讓每個延遲載入模組都提供服務的一個新執行個體。
下列程式碼把這項功能加入 `UserService`。

<docs-code header="src/app/user.service.ts" highlight="[4]">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any',
})
export class UserService {
}
</docs-code>

使用 `providedIn: 'any'` 時，所有積極載入的模組共享一個單例執行個體；然而，延遲載入模組各自取得自己獨有的執行個體，如下圖所示。

<img alt="any-provider-scope" class="left" src="assets/images/guide/providers/any-provider.svg">

## 以元件限制提供者範圍 {#limiting-provider-scope-with-components}

另一種限制提供者範圍的方法，是把你想限制的服務加入元件的 `providers` 陣列。
元件提供者與 NgModule 提供者彼此獨立。
當你想積極載入一個需要獨占某個服務的模組時，這個方法很有用。
在元件中提供服務，會把該服務限制在該元件及其後代元件之內。
同一個模組中的其他元件無法存取它。

<docs-code header="src/app/app.component.ts">
@Component({
  // ...
  providers: [UserService]
})
export class AppComponent {}
</docs-code>

## 在模組與元件中提供服務的比較 {#providing-services-in-modules-vs-components}

一般來說，整個應用程式都需要的服務應在根模組中提供，並透過在延遲載入模組中提供服務來界定服務的範圍。

路由器在根層級運作，所以如果你把提供者放在元件中，即使是 `AppComponent`，依賴路由器的延遲載入模組也看不到它們。

<!-- KW--Make a diagram here -->
當你必須把服務執行個體限制在某個元件及其元件樹（也就是它的子元件）之內時，請向該元件註冊提供者。
例如，一個需要快取 `UserService` 私有副本的使用者編輯元件 `UserEditorComponent`，應該向 `UserEditorComponent` 註冊 `UserService`。
如此一來，`UserEditorComponent` 的每個新執行個體都會取得自己快取的服務執行個體。

## 注入器階層與服務執行個體 {#injector-hierarchy-and-service-instances}

服務在注入器的範圍內是單例，也就是說，在給定的注入器中，一個服務最多只有一個執行個體。

Angular DI 具有[階層式注入系統](guide/di/hierarchical-dependency-injection)，也就是說，巢狀的注入器可以建立自己的服務執行個體。
每當 Angular 建立一個在 `@Component()` 中指定了 `providers` 的元件新執行個體時，也會為該執行個體建立一個新的子注入器。
同樣地，當新的 NgModule 在執行期延遲載入時，Angular 可以為它建立一個帶有自己的提供者的注入器。

子模組注入器與元件注入器彼此獨立，會建立各自獨立的所提供服務執行個體。
當 Angular 銷毀 NgModule 或元件執行個體時，也會一併銷毀該注入器以及該注入器的服務執行個體。

如需深入資訊，請參閱[階層式注入器](guide/di/hierarchical-dependency-injection)。

## 深入了解 NgModules {#more-on-ngmodules}

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/singleton-services" title="單例服務"/>
  <docs-pill href="/guide/ngmodules/lazy-loading" title="延遲載入模組"/>
  <docs-pill href="/guide/di/dependency-injection-providers" title="依賴提供者"/>
  <docs-pill href="/guide/ngmodules/faq" title="NgModule 常見問題"/>
</docs-pill-row>
