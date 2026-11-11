# 設定依賴提供者

「建立與注入服務」主題說明了如何使用類別作為依賴。除了類別之外，你也可以使用其他值作為依賴，例如布林值、字串、日期與物件。Angular DI 提供了必要的 API，讓依賴設定更具彈性，你可以將這些值提供給 DI 使用。

## 指定提供者 token

如果你將服務類別指定為提供者 token，預設行為是注入器會使用 `new` 運算子來實例化該類別。

在以下範例中，`Logger` 類別提供了一個 `Logger` 實例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger"></code-example>

不過，你可以設定 DI，使用不同的類別或任何其他不同的值來對應 `Logger` 類別。因此，當注入 `Logger` 時，使用的會是這個新的值。

事實上，類別提供者的語法是一種簡寫形式，會展開為由 `Provider` 介面定義的提供者設定。

在這種情況下，Angular 會將 `providers` 的值展開為完整的提供者物件，如下所示：

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" ></code-example>

展開後的提供者設定是一個物件實字，包含兩個屬性：
- `provide` 屬性存放 token，作為尋找依賴值與設定注入器的鍵。
- 第二個屬性是提供者定義物件，告訴注入器如何建立依賴值。提供者定義鍵可以是下列其中之一：
    - useClass - 這個選項告訴 Angular DI，在注入依賴時實例化所提供的類別
    - useExisting - 讓你可以為 token 取別名，並參照任何既有的 token。
    - useFactory - 讓你可以定義一個建構依賴的函式。
    - useValue - 提供一個應作為依賴使用的靜態值。

以下一節說明如何使用這些不同的提供者定義。

<a id="token"></a>
<a id="injection-token"></a>

### 類別提供者：useClass
`useClass` 提供者鍵讓你可以建立並傳回指定類別的新實例。
你可以使用這類提供者，以替代實作來取代常見或預設的類別。替代實作可以例如實作不同的策略、擴充預設類別，或在測試案例中模擬真實類別的行為。
在下列範例中，當元件或任何其他類別請求 `Logger` 依賴時，就會實例化 `BetterLogger` 類別。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" ></code-example>

<a id="class-provider-dependencies"></a>

若替代的類別提供者本身有依賴，請在父模組或元件的 providers 中繼資料屬性中同時指定這兩個提供者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

在這個範例中，`EvenBetterLogger` 會在日誌訊息中顯示使用者名稱。這個記錄器會從注入的 `UserService` 實例取得使用者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

Angular DI 知道如何建構 `UserService` 依賴，因為它已在上面設定好，且可在注入器中使用。

### 別名提供者：useExisting

`useExisting` 提供者鍵讓你可以將一個 token 對應到另一個 token。實際上，第一個 token 是與第二個 token 相關聯的服務的別名，從而建立了兩種存取同一個服務物件的方式。

在下列範例中，當元件請求新或舊的記錄器時，注入器會注入 `NewLogger` 的單例實例。如此一來，`OldLogger` 就是 `NewLogger` 的別名。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

Note: 請確保不要用 `useClass` 將 `OldLogger` 別名到 `NewLogger`，因為那會建立兩個不同的 `NewLogger` 實例。

### 工廠提供者：useFactory

`useFactory` 提供者鍵讓你可以透過呼叫工廠函式來建立依賴物件。
用這種方法，你可以根據 DI 中以及應用程式其他地方可得的資訊，建立動態值。

在以下範例中，只有獲得授權的使用者才能在 `HeroService` 中看到秘密英雄。
授權狀態可能會在單一應用程式工作階段期間變更，例如當不同的使用者登入時。

若要讓安全性敏感資訊留在 `UserService` 中、不進入 `HeroService`，可以給 `HeroService` 建構子一個 boolean 旗標，來控制是否顯示秘密英雄。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

若要實作 `isAuthorized` 旗標，請使用工廠提供者為 `HeroService` 建立新的記錄器實例。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

工廠函式可以存取 `UserService`。
你將 `Logger` 與 `UserService` 都注入到工廠提供者中，讓注入器可以將它們傳遞給工廠函式。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory` 欄位指定提供者是一個工廠函式，其實作為 `heroServiceFactory`。

* `deps` 屬性是一個提供者 token 陣列。
`Logger` 與 `UserService` 類別各自作為自身類別提供者的 token。
注入器會解析這些 token，並將對應的服務注入到相符的 `heroServiceFactory` 工廠函式參數中。

將工廠提供者擷取到匯出的變數 `heroServiceProvider` 中，可以讓工廠提供者重複使用。

### 值提供者：useValue

`useValue` 鍵讓你可以將固定值與 DI token 相關聯。使用這種技巧可以提供執行階段設定常數，例如網站基底位址與功能旗標。你也可以在單元測試中使用值提供者，以模擬資料取代正式的資料服務。下一節會提供更多關於 `useValue` 鍵的資訊。

## 使用 `InjectionToken` 物件

定義並使用 `InjectionToken` 物件，為非類別依賴選擇提供者 token。下列範例定義了一個 token `APP_CONFIG`，其型別為 `InjectionToken`。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

可選的型別參數 `<AppConfig>` 與 token 描述 `app.config`，指明了該 token 的用途。

接著，使用 `APP_CONFIG` 的 `InjectionToken` 物件，在元件中註冊依賴提供者。

<code-example path="dependency-injection/src/app/providers.component.ts" header="src/app/providers.component.ts" region="providers-9"></code-example>

現在，使用 `@Inject()` 參數裝飾器將設定物件注入建構子。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

### 介面與 DI

儘管 TypeScript 的 `AppConfig` 介面支援類別內的型別標註，但 `AppConfig` 介面在 DI 中並不扮演任何角色。
在 TypeScript 中，介面是設計階段的產物，沒有 DI 框架可以使用的執行階段表示形式或 token。

當轉譯器將 TypeScript 轉換為 JavaScript 時，介面會消失，因為 JavaScript 沒有介面。

由於在執行階段沒有 Angular 可以找到的介面，介面不能作為 token，你也無法注入它。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>


## 後續步驟

* [實際運用依賴注入](guide/dependency-injection-in-action)

@reviewed 2022-08-02