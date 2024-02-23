# 建立可注入服務

服務是廣泛的類別，包含應用程式所需的任何值、函數或功能。
服務通常是具有狹隘、定義完善的目的的類別。
元件是可使用 DI 的類別類型之一。

Angular 將元件與服務區分開來，以提高模組化和可重複使用性。
藉由將元件的檢視相關功能與其他類型的處理分開，您可以讓您的元件類別精簡且有效率。

理想情況下，元件的工作是啟用使用者體驗，僅此而已。
元件應該提供資料繫結的屬性和方法，在檢視（由範本呈現）和應用程式邏輯（通常包含某些模型概念）之間進行協調。

元件可以將某些任務委派給服務，例如從伺服器擷取資料、驗證使用者輸入或直接記錄到主控台。
透過在可注入服務類別中定義此類處理任務，您可以讓任何元件都能使用這些任務。
您也可以透過在不同情況下配置相同類型服務的不同提供者，讓您的應用程式更具適應性。

Angular 沒有強制這些原則。
Angular 讓您可以輕鬆地將應用程式邏輯分解成服務，並透過 DI 讓這些服務可供元件使用，進而幫助您遵循這些原則。

## 服務範例

以下是一個服務類別的範例，會記錄到瀏覽器主控台。

<docs-code header="src/app/logger.service.ts (class)" language="typescript">
export class Logger {
  log(msg: unknown) { console.log(msg); }
  error(msg: unknown) { console.error(msg); }
  warn(msg: unknown) { console.warn(msg); }
}
</docs-code>

服務可以依賴其他服務。
例如，以下是一個依賴 `Logger` 服務的 `HeroService`，它也使用 `BackendService` 來取得英雄。
而那個服務可能會依賴 `HttpClient` 服務來非同步地從伺服器取得英雄。

<docs-code header="src/app/hero.service.ts (class)" language="typescript"
           highlight="[5,6,10,12]">
export class HeroService {
  private heroes: Hero[] = [];

constructor(
    private backend: BackendService,
    private logger: Logger) {}

async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
</docs-code>

## 建立可注入服務

Angular CLI 提供一個指令來建立新的服務。在以下範例中，您將一個新的服務新增到您的應用程式中，該應用程式早先使用 `ng new` 指令建立。

要產生一個新的 `HeroService` 類別在 `src/app/heroes` 資料夾中，請依照以下步驟：

1. 執行此 [Angular CLI](/tools/cli) 指令：

<docs-code language="sh">
ng generate service heroes/hero
</docs-code>

這個命令會建立以下預設的 `HeroService`。

<docs-code header="src/app/heroes/hero.service.ts (CLI-generated)" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {}
</docs-code>

`@Injectable()` 裝飾器指定 Angular 可以在此 DI 系統中使用此類別。
`providedIn: 'root'` 元數據表示 `HeroService` 在整個應用程式中提供。

加入一個 `getHeroes()` 方法，該方法會回傳 `mock.heroes.ts` 中的英雄，以取得英雄模擬資料：

<docs-code header="src/app/heroes/hero.service.ts" language="typescript">
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';

@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
</docs-code>

為了清晰度和可維護性，建議您在獨立檔案中定義元件和服務。

## 服務注入

## 服務注入

服務注入是將依賴項傳遞給類別的過程。這允許類別鬆散耦合，並且更容易測試。

在 Angular 中，您可以通過以下幾種方式來注入服務：

* 使用構造函數注入
* 使用屬性注入
* 使用方法注入

### 構造函數注入

構造函數注入是最常見的注入方式。在構造函數中，您可以指定要注入的服務。例如：

typescript
export class MyComponent {
  constructor(private myService: MyService) {}
}
在這個例子中，`MyComponent` 的構造函數接受一個 `MyService` 的參數。這意味著當 `MyComponent` 被創建時，Angular 會自動將一個 `MyService` 的實例注入到 `myService` 參數中。

### 屬性注入

屬性注入允許您在類別的屬性中注入服務。例如：

typescript
export class MyComponent {
  @Inject(MyService) private myService: MyService;
}
在這個例子中，`MyComponent` 的 `myService` 屬性被注入了一個 `MyService` 的實例。

### 方法注入

方法注入允許您在類別的方法中注入服務。例如：

typescript
export class MyComponent {
  constructor() {}

  @Inject(MyService)
  public myMethod(myService: MyService) {
    // 使用 myService
  }
}
在這個例子中，`MyComponent` 的 `myMethod` 方法被注入了一個 `MyService` 的實例。

### 服務注入的優點

服務注入有以下幾個優點：

* 鬆散耦合：服務注入允許類別鬆散耦合，這意味著類別不需要知道具體的依賴項是如何實現的。
* 可測試性：服務注入使類別更容易測試，因為您可以輕鬆地模擬依賴項。
* 可重用性：服務注入允許您在多個類別中重用服務。

### 服務注入的缺點

服務注入也有一些缺點：

* 複雜性：服務注入可能會使您的程式碼更複雜，尤其是當您有多個依賴項時。
* 性能：服務注入可能會降低您的應用程式的性能，因為它需要在運行時解析依賴項。

### 總結

服務注入是一種將依賴項傳遞給類別的過程。它允許類別鬆散耦合，並且更容易測試。在 Angular 中，您可以通過以下幾種方式來注入服務：

* 使用構造函數注入
* 使用屬性注入
* 使用方法注入

服務注入有以下幾個優點：

* 鬆散耦合
* 可測試性
* 可重用性

服務注入也有一些缺點：

* 複雜性
* 性能

總體而言，服務注入是一種非常有用的技術，可以讓您的程式碼更鬆散耦合、更容易測試和更可重用。

若要將服務注入為元件的相依性，您可以使用元件的 `constructor()`，並提供具有相依性類型的建構函數參數。

以下範例在 `HeroListComponent` 建構函數中指定 `HeroService`。
`heroService` 的類型是 `HeroService`。
Angular 將 `HeroService` 類型識別為相依性，因為該類別先前已使用 `@Injectable` 裝飾器進行註解。

<docs-code header="src/app/heroes/hero-list.component (constructor signature)" language="typescript">
  constructor(heroService: HeroService)
</docs-code>

## 在其他服務中注入服務

當某項服務依賴於另一項服務時，請遵循與注入元件相同的模式。
在下列範例中，`HeroService` 依賴 `Logger` 服務來報告其活動。

1. 匯入 `Logger` 服務。
2. 接著在 `HeroService` 的 `constructor()` 中注入 `Logger` 服務，指定 `private logger: Logger`。

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[3,9,12]">
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Logger } from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(private logger: Logger) {}

getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
</docs-code>

在這個範例中，`getHeroes()` 方法使用 `Logger` 服務，在擷取英雄時記錄訊息。

## 接下來

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="配置相依性"/>
  <docs-pill href="/guide/di/dependency-injection-providers#using-an-injectiontoken-object" title="`InjectionTokens`"/>
</docs-pill-row>
