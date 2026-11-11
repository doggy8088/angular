# 設定依賴提供者

前面的章節說明了如何使用類別實例作為依賴。
除了類別之外，你也可以使用 `boolean`、`string`、`Date` 等值和物件作為依賴。
Angular 提供必要的 API，讓依賴的設定更具彈性，使你能讓這些值在 DI 中可供使用。

## 指定提供者 token {#specifying-a-provider-token}

如果你將服務類別指定為提供者 token，預設行為是注入器會使用 `new` 運算子來實例化該類別。

在以下範例中，應用程式元件提供了一個 `Logger` 實例：

<docs-code header="src/app/app.component.ts" language="typescript">
providers: [Logger],
</docs-code>

不過，你可以設定 DI，將 `Logger` 提供者 token 與不同的類別或任何其他值相關聯。
這樣一來，當 `Logger` 被注入時，就會改用設定好的值。

事實上，類別提供者語法是一種簡寫表示式，會展開成由 `Provider` 介面定義的提供者設定。
Angular 會將 `providers` 的值展開成一個完整的提供者物件，如下所示：

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: Logger }]
</docs-code>

展開後的提供者設定是一個有兩個屬性的物件字面值：

- `provide` 屬性保存著 token，它是取用依賴值時使用的鍵。
- 第二個屬性是提供者定義物件，它告訴注入器**如何**建立依賴值。提供者定義可以是以下其中之一：
  - `useClass`：此選項告訴 Angular DI，在依賴被注入時實例化所提供的類別
  - `useExisting`：讓你為 token 建立別名，並參照任何既有的 token。
  - `useFactory`：讓你定義一個用來建構依賴的函式。
  - `useValue`：提供一個應該用作依賴的靜態值。

以下章節說明如何使用這些不同的提供者定義。

### 類別提供者：useClass {#class-providers-useclass}

`useClass` 提供者鍵讓你建立並傳回指定類別的新實例。

你可以使用這類提供者，為常用或預設的類別替換上替代實作。
替代實作可以例如實作不同的策略、擴充預設類別，或在測試案例中模擬真實類別的行為。

在以下範例中，當元件或任何其他類別請求 `Logger` 依賴時，就會實例化 `BetterLogger`：

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: BetterLogger }]
</docs-code>

如果替代類別提供者有它自己的依賴，請在父模組或元件的 providers 中繼資料屬性中，同時指定這兩個提供者：

<docs-code header="src/app/app.component.ts" language="typescript">
[
  UserService, // dependency needed in `EvenBetterLogger`.
  { provide: Logger, useClass: EvenBetterLogger },
]
</docs-code>

在這個範例中，`EvenBetterLogger` 會在日誌訊息中顯示使用者名稱。這個記錄器會從注入的 `UserService` 實例取得使用者：

<docs-code header="src/app/even-better-logger.component.ts" language="typescript"
           highlight="[[3],[6]]">
@Injectable()
export class EvenBetterLogger extends Logger {
  private userService = inject(UserService);

  override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}
</docs-code>

Angular DI 知道如何建構 `UserService` 依賴，因為它已在上面設定好，並且在注入器中可供使用。

### 別名提供者：useExisting {#alias-providers-useexisting}

`useExisting` 提供者鍵讓你將一個 token 對應到另一個 token。
實際上，第一個 token 是與第二個 token 相關聯之服務的別名，從而建立了兩種存取同一個服務物件的方式。

在以下範例中，當元件請求新或舊的記錄器時，注入器都會注入 `NewLogger` 的單例實例：
如此一來，`OldLogger` 就成了 `NewLogger` 的別名。

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[4]">
[
  NewLogger,
  // Alias OldLogger w/ reference to NewLogger
  { provide: OldLogger, useExisting: NewLogger},
]
</docs-code>

NOTE: 請確保不要用 `useClass` 將 `OldLogger` 別名到 `NewLogger`，因為那會建立兩個不同的 `NewLogger` 實例。

### 工廠提供者：useFactory {#factory-providers-usefactory}

`useFactory` 提供者鍵讓你可以透過呼叫工廠函式來建立依賴物件。
用這種方法，你可以根據 DI 中以及應用程式其他地方可得的資訊，建立動態值。

在以下範例中，只有獲得授權的使用者才能在 `HeroService` 中看到秘密英雄。
授權狀態可能會在單一應用程式工作階段期間變更，例如當不同的使用者登入時。

若要讓安全性敏感資訊留在 `UserService` 中、不進入 `HeroService`，可以給 `HeroService` 建構子一個 boolean 旗標，來控制是否顯示秘密英雄：

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[[4],[7]]">
class HeroService {
  constructor(
    private logger: Logger,
    private isAuthorized: boolean) { }

  getHeroes() {
    const auth = this.isAuthorized ? 'authorized' : 'unauthorized';
    this.logger.log(`Getting heroes for ${auth} user.`);
    return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
  }
}
</docs-code>

若要實作 `isAuthorized` 旗標，可以使用工廠提供者為 `HeroService` 建立新的記錄器實例。
這是必要的，因為在建構英雄服務時，我們需要手動傳入 `Logger`：

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript">
const heroServiceFactory = (logger: Logger, userService: UserService) =>
  new HeroService(logger, userService.user.isAuthorized);
</docs-code>

工廠函式可以存取 `UserService`。
你將 `Logger` 與 `UserService` 都注入到工廠提供者中，讓注入器可以將它們傳遞給工廠函式：

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript"
           highlight="[3,4]">
export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService]
};
</docs-code>

- `useFactory` 欄位指定該提供者是一個工廠函式，其實作是 `heroServiceFactory`。
- `deps` 屬性是一個提供者 token 的陣列。
`Logger` 與 `UserService` 類別作為它們自己類別提供者的 token。
注入器會解析這些 token，並依照指定的順序，將對應的服務注入到 `heroServiceFactory` 工廠函式相應的參數中。

將工廠提供者擷取到匯出的變數 `heroServiceProvider` 中，能讓這個工廠提供者可以重複使用。

### 值提供者：useValue {#value-providers-usevalue}

`useValue` 鍵讓你可以將一個靜態值與 DI token 相關聯。

使用這項技術，可以提供執行階段的設定常數，例如網站基底位址和功能旗標。
你也可以在單元測試中使用值提供者，提供模擬資料來代替正式環境的資料服務。

下一節提供更多關於 `useValue` 鍵的資訊。

## 使用 `InjectionToken` 物件 {#using-an-injectiontoken-object}

對於非類別依賴，使用 `InjectionToken` 物件作為提供者 token。
以下範例定義了一個 `InjectionToken` 型別的 token，`APP_CONFIG`：

<docs-code header="src/app/app.config.ts" language="typescript" highlight="[3]">
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  title: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config description');
</docs-code>

可選的型別參數 `<AppConfig>` 與 token 描述 `app.config description`，指明了該 token 的用途。

接著，使用 `APP_CONFIG` 的 `InjectionToken` 物件，在元件中註冊依賴提供者：

<docs-code header="src/app/app.component.ts" language="typescript">
const MY_APP_CONFIG_VARIABLE: AppConfig = {
  title: 'Hello',
};

providers: [{ provide: APP_CONFIG, useValue: MY_APP_CONFIG_VARIABLE }]
</docs-code>

現在，在建構子主體中用 `inject` 函式注入設定物件：

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[2]">
export class AppComponent {
  constructor() {
    const config = inject(APP_CONFIG);
    this.title = config.title;
  }
}
</docs-code>

### 介面與 DI {#interfaces-and-di}

儘管 TypeScript 的 `AppConfig` 介面支援類別內的型別標註，但 `AppConfig` 介面在 DI 中並不扮演任何角色。
在 TypeScript 中，介面是設計階段的產物，沒有 DI 框架可以使用的執行階段表示形式或 token。

當 TypeScript 轉譯成 JavaScript 時，介面會消失，因為 JavaScript 沒有介面。
由於 Angular 在執行階段找不到任何介面，因此介面不能作為 token，你也無法注入它：

<docs-code header="src/app/app.component.ts" language="typescript">
// Can't use interface as provider token
[{ provide: AppConfig, useValue: MY_APP_CONFIG_VARIABLE })]
</docs-code>

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[3]">
export class AppComponent {
  // Can't inject using the interface as the parameter type
  private config = inject(AppConfig);
}
</docs-code>
