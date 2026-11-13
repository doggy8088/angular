# 依賴提供者

透過設定提供者，你可以讓服務提供給應用程式中需要它們的部分使用。

依賴[提供者](guide/glossary#提供者provider)會以 [DI token](guide/glossary#di-token) 設定注入器，注入器再用它來提供依賴值的執行階段版本。

## 指定提供者 token

如果你將服務類別指定為提供者 token，預設行為是注入器會使用 `new` 運算子來實例化該類別。

在以下範例中，`Logger` 類別提供了一個 `Logger` 實例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger"></code-example>

不過，你也可以使用替代提供者來設定注入器，提供具備所需日誌功能的其他物件。

使用服務類別設定注入器，並提供替代類別、物件或工廠函式。

<a id="token"></a>
<a id="injection-token"></a>

## 依賴注入 token

當你以[提供者](guide/glossary#提供者provider)設定[注入器](guide/glossary#注入器injector)時，你就是將該提供者與[依賴注入 token](guide/glossary#di-token)（即 DI token）建立關聯。
注入器讓 Angular 建立所有內部依賴的對應表。
DI token 充當該對應表的鍵。

依賴值是一個實例，而類別型別則作為查閱鍵。
在這裡，注入器使用 `HeroService` 型別作為 token，來查閱 `heroService`。

<code-example header="src/app/injector.component.ts" path="dependency-injection/src/app/injector.component.ts" region="get-hero-service"></code-example>

當你以 `HeroService` 類別型別定義建構子參數時，Angular 就知道要注入與該 `HeroService` 類別 token 關聯的服務：

<code-example header="src/app/heroes/hero-list.component.ts" path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature"></code-example>

雖然類別提供了許多依賴值，展開後的 `provide` 物件能讓你將不同種類的提供者與 DI token 關聯起來。

<a id="provide"></a>

## 定義提供者

類別提供者語法是一種簡寫表示式，會展開為由 [`Provider` 介面](api/core/Provider) 定義的提供者設定。
下列範例是在 `providers` 陣列中提供 `Logger` 類別的類別提供者語法。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger"></code-example>

Angular 會將 `providers` 的值展開為完整的提供者物件，如下所示。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" ></code-example>

展開後的提供者設定是一個物件實字，包含兩個屬性：

*   `provide` 屬性存放 [token](#token)，作為尋找依賴值與設定注入器的鍵。

*   第二個屬性是提供者定義物件，告訴注入器如何建立依賴值。
    提供者定義鍵可以是 `useClass`，如本範例。
    也可以是 `useExisting`、`useValue` 或 `useFactory`。
    這些鍵各自提供不同型別的依賴，如下一節所述。

<a id="class-provider"></a>

## 指定替代類別提供者

不同的類別可以提供相同的服務。
例如，下列程式碼告訴注入器：當元件使用 `Logger` token 請求記錄器時，傳回 `BetterLogger` 實例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" ></code-example>

<a id="class-provider-dependencies"></a>

### 設定具有依賴的類別提供者

若替代的類別提供者本身有依賴，請在父模組或元件的 `providers` 中繼資料屬性中同時指定這兩個提供者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

在這個範例中，`EvenBetterLogger` 會在日誌訊息中顯示使用者名稱。
這個記錄器會從注入的 `UserService` 實例取得使用者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

注入器需要這個新的日誌服務及其所依賴的 `UserService` 兩者的提供者。

<a id="aliased-class-providers"></a>

### 為類別提供者取別名

若要為類別提供者取別名，請在 `providers` 陣列中以 `useExisting` 屬性同時指定別名與類別提供者。

在下列範例中，當元件請求新或舊的記錄器時，注入器會注入 `NewLogger` 的單例實例。
如此一來，`OldLogger` 就是 `NewLogger` 的別名。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

請確保不要用 `useClass` 將 `OldLogger` 別名到 `NewLogger`，因為那會建立兩個不同的 `NewLogger` 實例。

<a id="provideparent"></a>

## 為類別介面取別名

一般而言，撰寫同一個父別名提供者的各種變形，會如下使用 [forwardRef](guide/dependency-injection-in-action#forwardref)：

<code-example header="dependency-injection-in-action/src/app/parent-finder.component.ts" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers"></code-example>

若要精簡程式碼，可以使用 `provideParent()` 輔助函式，將該邏輯抽取成輔助函式。

<code-example header="dependency-injection-in-action/src/app/parent-finder.component.ts" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-the-parent"></code-example>

現在你可以為元件加入更容易閱讀與理解的父提供者。

<code-example header="dependency-injection-in-action/src/app/parent-finder.component.ts" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-providers"></code-example>

### 為多個類別介面取別名

若要為多個父型別取別名（每個都有自己的類別介面 token），請設定 `provideParent()` 接受更多參數。

這是修改後的版本，預設為 `parent`，但也接受可選的第二個參數，用於不同的父類別介面。

<code-example header="dependency-injection-in-action/src/app/parent-finder.component.ts" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-parent"></code-example>

接著，若要將 `provideParent()` 用於不同的父型別，請提供第二個參數，這裡是 `DifferentParent`。

<code-example header="dependency-injection-in-action/src/app/parent-finder.component.ts" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="beth-providers"></code-example>

<a id="value-provider"></a>

## 注入物件

若要注入物件，請以 `useValue` 選項設定注入器。
下列提供者物件使用 `useValue` 鍵，將變數與 `Logger` token 關聯起來。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7"></code-example>

在這個範例中，`SilentLogger` 是一個扮演記錄器角色的物件。

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"></code-example>

<a id="non-class-dependencies"></a>

### 注入設定物件

物件實字的常見使用案例是設定物件。
下列設定物件包含應用程式的標題，以及一個 Web API 端點的位址。

<code-example header="src/app/app.config.ts (excerpt)" path="dependency-injection/src/app/app.config.ts" region="config"></code-example>

若要提供並注入設定物件，請在 `@NgModule()` 的 `providers` 陣列中指定該物件。

<code-example header="src/app/app.module.ts (providers)" path="dependency-injection/src/app/app.module.ts" region="providers"></code-example>

<a id="injectiontoken"></a>

### 使用 `InjectionToken` 物件

定義並使用 `InjectionToken` 物件，為非類別依賴選擇提供者 token。
下列範例定義了一個 token `APP_CONFIG`，其型別為 `InjectionToken`。

<code-example header="src/app/app.config.ts" path="dependency-injection/src/app/app.config.ts" region="token"></code-example>

可選的型別參數 `<AppConfig>` 與 token 描述 `app.config`，指明了該 token 的用途。

接著，使用 `APP_CONFIG` 的 `InjectionToken` 物件，在元件中註冊依賴提供者。

<code-example header="src/app/providers.component.ts" path="dependency-injection/src/app/providers.component.ts" region="providers-9"></code-example>

現在，使用 `@Inject()` 參數裝飾器將設定物件注入建構子。

<code-example header="src/app/app.component.ts" path="dependency-injection/src/app/app.component.2.ts" region="ctor"></code-example>

<a id="di-and-interfaces"></a>

#### 介面與依賴注入

儘管 TypeScript 的 `AppConfig` 介面支援類別內的型別標註，但 `AppConfig` 介面在依賴注入中並不扮演任何角色。
在 TypeScript 中，介面是設計階段的產物，沒有 DI 框架可以使用的執行階段表示形式或 token。

當轉譯器將 TypeScript 轉換為 JavaScript 時，介面會消失，因為 JavaScript 沒有介面。

由於在執行階段沒有 Angular 可以找到的介面，介面不能作為 token，你也無法注入它。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

<a id="factory-provider"></a>
<a id="factory-providers"></a>

## 使用工廠提供者

若要根據執行階段之前無法得知的資訊，建立可變動的依賴值，請使用工廠提供者。

在以下範例中，只有獲得授權的使用者才能在 `HeroService` 中看到秘密英雄。
授權狀態可能會在單一應用程式工作階段期間變更，例如當不同的使用者登入時。

若要讓安全性敏感資訊留在 `UserService` 中、不進入 `HeroService`，可以給 `HeroService` 建構子一個 boolean 旗標，來控制是否顯示秘密英雄。

<code-example header="src/app/heroes/hero.service.ts (excerpt)" path="dependency-injection/src/app/heroes/hero.service.ts" region="internals"></code-example>

若要實作 `isAuthorized` 旗標，請使用工廠提供者為 `HeroService` 建立新的記錄器實例。

<code-example header="src/app/heroes/hero.service.provider.ts (excerpt)" path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory"></code-example>

工廠函式可以存取 `UserService`。
你將 `Logger` 與 `UserService` 都注入到工廠提供者中，讓注入器可以將它們傳遞給工廠函式。

<code-example header="src/app/heroes/hero.service.provider.ts (excerpt)" path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider"></code-example>

*   `useFactory` 欄位指定提供者是一個工廠函式，其實作為 `heroServiceFactory`
*   `deps` 屬性是一個 [提供者 token](#token) 陣列。
    `Logger` 與 `UserService` 類別各自作為自身類別提供者的 token。
    注入器會解析這些 token，並將對應的服務注入到相符的 `heroServiceFactory` 工廠函式參數中。

將工廠提供者擷取到匯出的變數 `heroServiceProvider` 中，可以讓工廠提供者重複使用。

下列並排範例示範 `heroServiceProvider` 如何在 `providers` 陣列中取代 `HeroService`。

<code-tabs>
    <code-pane header="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts"></code-pane>
</code-tabs>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
