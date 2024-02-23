# 配置依賴提供者

上述章節描述如何將類別實例視為相依性。
除了類別之外，您也可以將值（例如 `boolean`、`string`、`Date` 和物件）視為相依性。
Angular 提供必要的 API 來讓相依性設定更彈性，因此您可以讓這些值在 DI 中可用。

## 指定提供者權杖

如果您將服務類別指定為提供者程式碼，則預設行為是注入器使用 `new` 運算子來實例化該類別。

在以下範例中，應用程式元件提供 `Logger` 實例。

<docs-code header="src/app/app.component.ts" language="typescript">
providers: [Logger],
</docs-code>

然而，您可以設定 DI 以將 `Logger` 提供者代幣與不同的類別或任何其他值關聯。
因此，當注入 `Logger` 時，將改用已設定的值。

事實上，類別提供者語法是一種簡寫表達式，它會擴展到由 `Provider` 介面定義的提供者設定。
Angular 在這種情況下將 `providers` 值擴展為完整的提供者物件，如下所示：

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: Logger }]
</docs-code>

擴充的提供者配置是一個擁有兩個屬性的物件文字：

- `provide` 屬性持有作為使用相依性值之金鑰的權杖。
- 第二個屬性是提供者定義物件，它告訴注入器**如何**建立相依性值。提供者定義可以是下列其中一項：
  - `useClass` - 此選項告訴 Angular DI 在注入相依性時，要實例化一個已提供的類別。
  - `useExisting` - 允許您建立權杖別名並參照任何現有的權杖。
  - `useFactory` - 允許您定義一個建立相依性的函式。
  - `useValue` - 提供應當作為相依性使用的靜態值。

以下章節描述如何使用不同的提供者定義。

### 類別提供者：useClass

`useClass` 提供者金鑰讓您可以建立並傳回指定類別的新執行個體。

您可以使用此類型的提供者來替換常見或預設類別的替代實作。
替代實作可以例如實作不同的策略、延伸預設類別或在測試案例中模擬真實類別的行為。

在以下範例中，當在元件或任何其他類別中要求 `Logger` 相依項時，會實例化 `BetterLogger`。

<docs-code header="src/app/app.component.ts" language="typescript">
[{ provide: Logger, useClass: BetterLogger }]
</docs-code>

如果替代類別提供者有其自己的依賴項，請在父模組或元件的提供者元資料屬性中指定兩個提供者。

<docs-code header="src/app/app.component.ts" language="typescript">
[
  UserService, // dependency needed in `EvenBetterLogger`.
  { provide: Logger, useClass: EvenBetterLogger },
]
</docs-code>

在此範例中，`EvenBetterLogger` 在記錄訊息中顯示使用者名稱。此記錄器從注入的 `UserService` 實例取得使用者。

<docs-code header="src/app/even-better-logger.component.ts" language="typescript"
           highlight="[[3],[6]]">
@Injectable()
export class EvenBetterLogger extends Logger {
  constructor(private userService: UserService) {}

override log(message: string) {
    const name = this.userService.user.name;
    super.log(`Message to ${name}: ${message}`);
  }
}
</docs-code>

Angular DI 知道如何建構 `UserService` 依賴項，因為它已在上方配置，並且在注入器中可用。

### 別名提供者：useExisting

`useExisting` 提供者金鑰讓您可以將一個代幣對應到另一個代幣。
實際上，第一個代幣是與第二個代幣相關聯的服務的別名，創造了存取相同服務物件的兩種方式。

在以下範例中，注入器在元件要求新的或舊的記錄器時，會注入 `NewLogger` 的單例執行個體。
這樣一來，`OldLogger` 就是 `NewLogger` 的別名。

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[4]">
[
  NewLogger,
  // Alias OldLogger w/ reference to NewLogger
  { provide: OldLogger, useExisting: NewLogger},
]
</docs-code>

註解：請勿使用 `useClass` 將 `OldLogger` 別名設為 `NewLogger`，因為這會建立兩個不同的 `NewLogger` 實例。

### 工廠提供者：useFactory

`useFactory` 提供者金鑰讓您可以透過呼叫工廠函數來建立依賴項物件。
透過此方法，您可以基於 DI 和應用程式其他位置中可用的資訊來建立動態值。

在以下範例中，只有經過授權的使用者才能在 `HeroService` 中看到秘密英雄。
授權可以在單一應用程式階段期間變更，例如當不同的使用者登入時。

要讓 `UserService` 保有安全性敏感資訊，並將其排除在 `HeroService` 之外，請給予 `HeroService` 建構函式一個布林旗標來控制秘密英雄的顯示。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[[4],[7]]">
class HeroService {
  constructor(
    private logger: Logger,
    private isAuthorized: boolean) { }

getHeroes() {
    const auth = this.isAuthorized ? 'authorized ' : 'unauthorized';
    this.logger.log(`Getting heroes for ${auth} user.`);
    return HEROES.filter(hero => this.isAuthorized || !hero.isSecret);
  }
}
</docs-code>

若要實作 `isAuthorized` 旗標，請使用工廠提供者為 `HeroService` 建立新的記錄器執行個體。
這是必要的，因為我們在建構英雄服務時需要手動傳遞 `Logger`。

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript">
const heroServiceFactory = (logger: Logger, userService: UserService) =>
  new HeroService(logger, userService.user.isAuthorized);
</docs-code>

工廠函數可存取 `UserService`。
您將 `Logger` 和 `UserService` 都注入到工廠提供者中，以便注入器可以將它們傳遞給工廠函數。

<docs-code header="src/app/heroes/hero.service.provider.ts" language="typescript"
           highlight="[3,4]">
export const heroServiceProvider = {
  provide: HeroService,
  useFactory: heroServiceFactory,
  deps: [Logger, UserService]
};
</docs-code>

- `useFactory` 欄位指定提供者是一個工廠函數，其實作為 `heroServiceFactory`。
- `deps` 屬性是一個提供者權杖陣列。
`Logger` 和 `UserService` 類別作為它們自己的類別提供者的權杖。
注入器解析這些權杖，並根據指定的順序將對應的服務注入到匹配的 `heroServiceFactory` 工廠函數參數中。

將工廠提供者捕獲到匯出的變數 `heroServiceProvider` 中，使工廠提供者可重複使用。

### 值提供者：useValue

`useValue` 鍵讓你可以將靜態值與 DI 標記關聯。

使用此技術提供執行階段組態常數，例如網站基本位址和功能標誌。
您也可以在單元測試中使用值提供者，以提供模擬資料來取代生產資料服務。

下一個區段提供有關 `useValue` 鍵的更多資訊。

## 使用 `InjectionToken` 物件

使用 `InjectionToken` 物件作為提供者代號以供非類別相依性使用。
以下範例定義了一個代號 `APP_CONFIG`，其類型為 `InjectionToken`。

<docs-code header="src/app/app.config.ts" language="typescript" highlight="[3]">
import { InjectionToken } from '@angular/core';

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config description');
</docs-code>

選用的類型參數「<AppConfig>」和權杖描述「app.config description」指定權杖的目的。

接下來，使用 `APP_CONFIG` 的 `InjectionToken` 物件在元件中註冊相依項提供者。

<docs-code header="src/app/app.component.ts" language="typescript">
providers: [{ provide: APP_CONFIG, useValue: MY_APP_CONFIG_VARIABLE }]
</docs-code>

現在，使用 `@Inject()` 參數裝飾器將組態物件注入建構函式中。

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[2]">
export class AppComponent {
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.title = config.title;
  }
}
</docs-code>

### 接口和 DI

儘管 TypeScript `AppConfig` 介面支援類別內的分型，但 `AppConfig` 介面在 DI 中沒有任何作用。
在 TypeScript 中，介面是設計時間的產物，沒有 DI 架構可以使用的執行時間表示法或令牌。

當轉譯器將 TypeScript 轉換為 JavaScript 時，介面會消失，因為 JavaScript 沒有介面。
由於 Angular 在執行時找不到介面，因此介面無法成為令牌，也無法注入。

<docs-code header="src/app/app.component.ts" language="typescript">
// Can't use interface as provider token
[{ provide: AppConfig, useValue: MY_APP_CONFIG_VARIABLE })]
</docs-code>

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[3]">
export class AppComponent {
  // Can't inject using the interface as the parameter type
  constructor(private config: AppConfig) {}
}
</docs-code>

