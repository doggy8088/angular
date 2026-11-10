# 建立可注入的服務

服務是一個廣泛的類別，涵蓋你的應用程式所需的任何值、函式或功能。
服務通常是一個用途專注且定義明確的類別。
元件也是一種可以搭配依賴注入（DI）使用的類別。

Angular 區分元件與服務，是為了提升模組化程度與可重用性。
將元件與檢視相關的功能，和其他類型的處理分開，可以讓你的元件類別保持精簡而有效率。

理想上，元件的職責是提供使用者體驗，除此之外別無其他。
元件應該提供供資料繫結使用的屬性與方法，作為檢視（由範本算繪）與應用程式邏輯（通常包含某種模型概念）之間的橋樑。

你可以把工作從元件委派給服務，例如從伺服器擷取資料、驗證使用者輸入，或將訊息記錄到主控台。
把這類工作定義在可注入的服務類別中，就能讓任何元件使用這些能力。
你也可以為同一種類型的服務，依不同情境設定不同的提供者，讓應用程式更具適應性。

Angular 並不嚴格強制這些原則。
Angular 讓你能輕鬆地把應用程式邏輯組織成服務，並透過 DI 讓元件使用這些服務，藉此幫助你遵循這些原則。

## 服務範例 {#service-examples}

以下是一個服務類別的範例，它會將訊息記錄到瀏覽器主控台：

```ts {header: "logger.service.ts (class)"}
export class Logger {
  log(msg: unknown) {
    console.log(msg);
  }
  error(msg: unknown) {
    console.error(msg);
  }
  warn(msg: unknown) {
    console.warn(msg);
  }
}
```

服務可以依賴其他服務。
例如，以下是一個依賴 `Logger` 服務的 `HeroService`，它也使用 `BackendService` 來取得英雄。
而 `BackendService` 又可能依賴 `HttpClient` 服務，從伺服器非同步擷取英雄：

```ts {header: "hero.service.ts", highlight="[7,8,12,13]"}
import {inject} from '@angular/core';

export class HeroService {
  private heroes: Hero[] = [];

  private backend = inject(BackendService);
  private logger = inject(Logger);

  async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
```

## 使用 CLI 建立可注入的服務 {#creating-an-injectable-service-with-the-cli}

Angular CLI 提供建立新服務的指令。在以下範例中，你會為既有的應用程式新增一個服務。

若要在 `src/app/heroes` 資料夾中產生一個新的 `HeroService` 類別，請依照以下步驟：

1. 執行這個 [Angular CLI](/tools/cli) 指令：

```sh
ng generate service heroes/hero
```

這個指令會建立以下預設的 `HeroService`：

```ts {header: 'heroes/hero.service.ts (CLI-generated)'}
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {}
```

`@Injectable()` 裝飾器表明 Angular 可以在 DI 系統中使用這個類別。
`providedIn: 'root'` 詮釋資料表明 `HeroService` 在整個應用程式中都可使用。

加入一個 `getHeroes()` 方法，從 `mock.heroes.ts` 傳回英雄，以取得英雄模擬資料：

```ts {header: 'hero.service.ts'}
import {Injectable} from '@angular/core';
import {HEROES} from './mock-heroes';

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
```

為了清晰與可維護性，建議你把元件與服務定義在不同的檔案中。

## 注入服務 {#injecting-services}

若要把服務注入元件，請為該依賴宣告一個類別欄位，並使用 Angular 的 [`inject`](/api/core/inject) 函式來初始化它。

以下範例在 `HeroList` 中指定了 `HeroService`。
`heroService` 的型別是 `HeroService`。

```ts
import {inject} from '@angular/core';

export class HeroList {
  private heroService = inject(HeroService);
}
```

也可以使用元件的建構子，把服務注入元件：

```ts {header: 'hero-list.ts (constructor signature)'}
  constructor(private heroService: HeroService)
```

[`inject`](/api/core/inject) 方法可以同時用在類別與函式中，而建構子方式自然只能用在類別的建構子裡。不過，無論哪一種方式，你都只能在有效的[注入上下文](guide/di/dependency-injection-context)中注入依賴，通常是在元件的建構或初始化期間。

## 在其他服務中注入服務 {#injecting-services-in-other-services}

當一個服務依賴另一個服務時，採用的模式與注入到元件相同。
在以下範例中，`HeroService` 依賴 `Logger` 服務來記錄它的活動：

```ts {header: 'hero.service.ts, highlight: [[3],[9],[12]]}
import {inject, Injectable} from '@angular/core';
import {HEROES} from './mock-heroes';
import {Logger} from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private logger = inject(Logger);

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
```

在這個範例中，`getHeroes()` 方法在擷取英雄時，使用 `Logger` 服務記錄了一則訊息。

## 後續步驟 {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/di/defining-dependency-providers" title="設定依賴提供者"/>
  <docs-pill href="guide/di/defining-dependency-providers#automatic-provision-for-non-class-dependencies" title="`InjectionTokens`"/>
</docs-pill-row>
