# 建立與使用服務

服務是可重用的程式碼片段，你可以在整個 Angular 應用程式中共用。你通常會用它們來處理資料擷取、業務邏輯，或其他多個元件需要存取的功能。

## 建立服務

你可以使用 [Angular CLI](tools/cli)，以下列指令建立服務：

```bash
ng generate service CUSTOM_NAME
```

這個指令會在你的 `src` 目錄中，建立一個專屬的 `CUSTOM_NAME.ts` 檔案。

你也可以透過為 TypeScript 類別加上 `@Service()` 裝飾器，來手動建立服務。這告訴 Angular，你可以將該類別用作可注入的依賴。

以下範例定義了一個服務，讓使用者新增與擷取資料：

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## 服務如何變得可用

服務依預設在根層級提供。當服務在全域提供時，Angular 保證以下三個主要好處：

- **單例實例**：為整個應用程式建立單一、共用的實例。
- **全域可用**：在任何地方自動可存取，無需手動註冊提供者。
- **可搖樹優化**（tree-shaking）：確保若你的程式碼從未明確使用該服務，最終的生產 bundle 就不會包含它。

### 使用 `@Service` 與 `@Injectable` 裝飾器的比較 {#using-the-service-vs-injectable-decorator}

`@Service` 裝飾器是傳統 `@Injectable({ providedIn: 'root' })` 寫法的現代、符合人體工學的簡寫。

請使用這份快速參考，決定哪個裝飾器適合你的情境：

| 功能／需求                                    | `@Service` | `@Injectable`                           |
| --------------------------------------------- | ---------- | --------------------------------------- |
| **`inject()` 函式支援**                       | 是         | 是                                      |
| **以建構子進行依賴注入**                      | ❌ 否      | 是                                      |
| **隱含的根層級單例提供者**                    | 是         | ❌ 否（需要 `{providedIn: 'root'}`）    |
| **進階提供者設定鍵**（`useClass` 等）         | ❌ 否      | 是                                      |
| **自訂初始化工廠**                            | 是         | 是                                      |
| **非根層級作用域**（`platform` 等）           | ❌ 否      | 是                                      |

### 以工廠取代實作

如果你需要控制單例的建立方式，例如依據環境換上不同的實作，請傳入一個 `factory` 函式。

這個工廠會在[注入情境](guide/di/dependency-injection-context)中執行，因此你可以在其中使用 [`inject()`](api/core/inject) 來讀取其他依賴。

以下的 `Analytics` 服務在本機不執行任何動作（no-op），以免事件在開發期間污染主控台。在生產環境中，工廠會讀取一個 `ANALYTICS_ENABLED` token，並傳回一個 `GoogleAnalytics` 子類別，將事件轉送到真正的追蹤器：

```ts {header: "src/app/analytics.ts"}
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // No-op by default.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Dispatches an analytics event to Google Analytics
  }
}
```

NOTE: `factory` 選項取代了 `@Injectable` 的 `useClass`、`useValue`、`useExisting` 與 `useFactory` 選項。如果你需要其中任何一項，請繼續使用 `@Injectable`。

### 退出自動提供 {#opting-out-of-automatic-provisioning}

依預設，`@Service` 會在根 injector 提供該類別。如果你想手動提供它，例如將其作用域限定於特定路由或元件，請設定 `autoProvided: false`：

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

接著你需要負責將該服務加到 `providers` 陣列中，就像使用一般的 `@Injectable()` 一樣：

### 何時使用 `@Service`、何時使用 `@Injectable`

當你在建立一個使用 `inject()` 取得其依賴的新單例類別時，請使用 `@Service`。當你需要以下任何一項時，請繼續使用 `@Injectable`：

- **以建構子進行依賴注入**：`@Service` 只支援 [`inject()`](api/core/inject) 函式。
- **進階提供者設定**：例如 `useClass`、`useValue`、`useExisting` 或 `useFactory`。`@Service` 改為提供單一的 `factory` 選項。
- **非根層級作用域**：例如 `providedIn: 'platform'`。

## 注入服務

一旦你以 `providedIn: 'root'` 建立了服務，你就可以使用 `@angular/core` 的 `inject()` 函式，在應用程式中的任何地方注入它。

### 注入到元件中

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### 注入到另一個服務中

```ts
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## 後續步驟

雖然 `providedIn: 'root'` 涵蓋了大多數使用情境，Angular 也提供其他方式，讓你為更特殊的情境設定服務：

- **元件專屬實例**：當元件需要各自獨立的服務實例時
- **手動設定**：適用於需要執行階段設定的服務
- **工廠提供者**：依據執行階段條件動態建立服務
- **值提供者**：提供設定物件或常數

你可以在下一篇指南中進一步了解這些進階模式：[定義依賴提供者](/guide/di/defining-dependency-providers)。
