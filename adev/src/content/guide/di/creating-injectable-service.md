# 建立可注入的服務

服務是一個廣泛的類別，涵蓋應用程式所需的任何值、函式或功能。
服務通常是一個用途狹窄且定義明確的類別。
元件也是一種可以使用 DI 的類別。

Angular 區分元件與服務，是為了提高模組化程度與可重用性。
將元件與檢視相關的功能，和其他類型的處理分開，可以讓你的元件類別精簡而有效率。

理想上，元件的工作是提供使用者體驗，除此之外別無其他。
元件應該提供供資料繫結使用的屬性與方法，作為檢視（由範本算繪）與應用程式邏輯（通常包含某種模型概念）之間的橋樑。

元件可以把某些工作委派給服務，例如從伺服器擷取資料、驗證使用者輸入，或直接將訊息記錄到主控台。
把這類處理工作定義在可注入的服務類別中，就能讓任何元件使用這些工作。
你也可以為同一種類型的服務設定不同的提供者，依不同情境適當選用，讓應用程式更具適應性。

Angular 並不強制這些原則。
Angular 讓你能輕鬆地把應用程式邏輯拆分成服務，並透過 DI 讓元件使用這些服務，藉此幫助你遵循這些原則。

## 服務範例 {#service-examples}

以下是一個服務類別的範例，它會將訊息記錄到瀏覽器主控台。

<docs-code header="src/app/logger.service.ts (class)" language="typescript">
export class Logger {
  log(msg: unknown) { console.log(msg); }
  error(msg: unknown) { console.error(msg); }
  warn(msg: unknown) { console.warn(msg); }
}
</docs-code>

服務可以依賴其他服務。
例如，以下是一個依賴 `Logger` 服務的 `HeroService`，它也使用 `BackendService` 來取得英雄。
而 `BackendService` 又可能依賴 `HttpClient` 服務，從伺服器非同步擷取英雄。

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

## 建立可注入的服務 {#creating-an-injectable-service}

Angular CLI 提供建立新服務的指令。在以下範例中，你會把一個新服務新增到先前以 `ng new` 指令建立的應用程式中。

若要在 `src/app/heroes` 資料夾中產生一個新的 `HeroService` 類別，請依照以下步驟：

1. 執行這個 [Angular CLI](/tools/cli) 指令：

<docs-code language="sh">
ng generate service heroes/hero
</docs-code>

這個指令會建立以下預設的 `HeroService`。

<docs-code header="src/app/heroes/hero.service.ts (CLI-generated)" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {}
</docs-code>

`@Injectable()` 裝飾器表明 Angular 可以在 DI 系統中使用這個類別。
`providedIn: 'root'` 這項詮釋資料，意味著 `HeroService` 會在整個應用程式中提供。

加入一個 `getHeroes()` 方法，從 `mock.heroes.ts` 傳回英雄，以取得英雄模擬資料：

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

為了清晰與可維護性，建議你把元件與服務定義在不同的檔案中。

## 注入服務 {#injecting-services}

若要把服務作為依賴注入元件，你可以使用元件的 `constructor()`，並提供一個具該依賴型別的建構子參數。

以下範例在 `HeroListComponent` 的建構子中指定了 `HeroService`。
`heroService` 的型別是 `HeroService`。
Angular 會將 `HeroService` 型別識別為依賴，因為該類別先前已以 `@Injectable` 裝飾器標註。

<docs-code header="src/app/heroes/hero-list.component (constructor signature)" language="typescript">
  constructor(heroService: HeroService)
</docs-code>

## 在其他服務中注入服務 {#injecting-services-in-other-services}

當一個服務依賴另一個服務時，採用的模式與注入到元件相同。
在以下範例中，`HeroService` 依賴 `Logger` 服務來記錄它的活動。

1. 匯入 `Logger` 服務。
2. 接著，在 `HeroService` 的 `constructor()` 中指定 `private logger: Logger`，以注入 `Logger` 服務。

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

在這個範例中，`getHeroes()` 方法在擷取英雄時，使用 `Logger` 服務記錄了一則訊息。

## 後續步驟 {#whats-next}

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="設定依賴"/>
  <docs-pill href="/guide/di/dependency-injection-providers#using-an-injectiontoken-object" title="`InjectionTokens`"/>
</docs-pill-row>
