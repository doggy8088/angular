# WebMCP

WebMCP 是一項[提議中的 Web 標準](https://github.com/webmachinelearning/webmcp/)，讓 Web 應用程式能把結構化工具直接公開給在瀏覽器中原生執行的 AI 代理。應用程式定義的工具讓 AI 助理能直接與應用程式互動，為代理提供額外能力，並減少透過 DOM 互動的需求。

舉例來說，一個註冊新使用者的應用程式，可以為瀏覽器的 AI 代理提供一個 WebMCP 工具，讓代理直接建立使用者，而不必要求代理透過 DOM 互動走完複雜的精靈使用者介面。

Angular 為 WebMCP 提供實驗性支援，讓你能輕鬆註冊與應用程式依賴注入生命週期綁定的工具，並自動把你的 Signal Forms 轉換為可供 AI 使用的工具。

IMPORTANT: WebMCP 規範仍處於生命週期的非常早期階段，且頻繁變動。因此，Angular 對 WebMCP 的支援目前為[**實驗性**](reference/releases#experimental)。API 可能變更，即使不在主要版本之間也一樣。

## 為應用程式提供工具

在你的應用程式設定中使用 [`provideExperimentalWebMcpTools`](api/core/provideExperimentalWebMcpTools)，為應用程式的整個生命週期註冊工具。以這種方式提供的工具，會在應用程式初始化時自動註冊，並在應用程式銷毀時自動取消註冊。

`execute` 回呼會在相關聯的 `Injector` 的注入上下文中被呼叫，意思是你可以透過 [`inject`](api/core/inject) 直接注入服務。

```ts {header:"main.ts"}
import {Service, inject, provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

@Service()
class Greeter {
  sayHello(): string {
    return 'Hello agent!';
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'greet',
        description: 'Greets the agent.',
        execute: () => {
          const greeter = inject(Greeter);

          return {content: [{type: 'text', text: greeter.sayHello()}]};
        },
      },
    ]),
  ],
});
```

### 定義工具參數

當工具需要 AI 助理提供輸入時，請在 `inputSchema` 中使用 [JSON Schema](https://json-schema.org/) 語法定義預期的引數。Angular 會依結構描述定義，自動推斷傳入 `execute` 回呼的參數型別。

```ts {header:"main.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'searchCatalog',
        description: 'Searches the store catalog for products matching a query.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search keywords.',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: ({query, maxResults}) => {
          // Type of `query` is inferred as `string`.
          // Type of `maxResults` is inferred as `number | undefined`.

          // Consider validating this at runtime, since inputs may not be validated to match the schema.
          if (typeof query !== 'string') throw new Error(`Bad query: ${query}`);
          if (typeof maxResults !== 'number' && maxResults !== undefined)
            throw new Error(`Bad maxResults: ${maxResults}`);

          const limit = maxResults ?? 5;
          return {
            content: [{type: 'text', text: `Returning up to ${limit} results for "${query}".`}],
          };
        },
      },
    ]),
  ],
});
```

TIP: 使用 `required: ['param1', 'param2', ...]` 可移除那些參數型別中的 `undefined`，並使用 `additionalProperties: false` 把引數物件的型別限制為僅包含這些參數。

## 為路由提供工具

建置複雜應用程式時，你可能只希望使用者檢視特定路由時才提供某些工具。你可以直接在路由定義中提供工具來達成。

```ts {header:"routes.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    providers: [
      provideExperimentalWebMcpTools([
        {
          name: 'exportDashboardReports',
          description: 'Exports the current dashboard analytics.',
          execute: () => ({
            content: [{type: 'text', text: 'Dashboard export successfully triggered.'}],
          }),
        },
      ]),
    ],
  },
];
```

NOTE: 把工具註冊到特定路由時，請考慮設定路由使用 [`withAutoCleanupInjectors`](api/router/withAutoCleanupInjectors)，確保使用者離開該路由時，工具會自動_取消註冊_。若沒有這個選項，在路由上宣告的 WebMCP 工具，即使使用者已導覽到不同路由，仍可供 AI 代理存取。

```ts {header:"app.config.ts"}
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withAutoCleanupInjectors} from '@angular/router';
import {routes} from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withAutoCleanupInjectors())],
};
```

## 在服務中提供工具

對於動態使用情境，[`declareExperimentalWebMcpTool`](api/core/declareExperimentalWebMcpTool) 函式可直接在注入上下文中註冊工具，並在該上下文銷毀時自動取消註冊。

```ts {header:"counter.ts"}
import {Service, declareExperimentalWebMcpTool, signal, inject} from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      execute: () => ({
        content: [{type: 'text', text: `The count is: ${this.count()}.`}],
      }),
    });
  }
}
```

雖然 `declareExperimentalWebMcpTool` 在任何注入上下文中都能運作，請留意[名稱衝突](#name-collisions)，並優先在根服務中使用它。

## Signal Forms 中的隱含工具

你只需極少的設定，就能從既有的 Angular [Signal Form](essentials/signal-forms) 隱含地建立 WebMCP 工具。Angular 會把你的表單模型轉換為功能豐富的 WebMCP 工具，有效支援高度動態的表單，無需你手動撰寫 JSON 結構描述或事件處理常式。

### 啟用 WebMCP 表單功能

首先，把 [`provideExperimentalWebMcpForms`](api/forms/signals/provideExperimentalWebMcpForms) 加入你的根應用程式 providers：

```ts {header:"main.ts"}
import {bootstrapApplication} from '@angular/platform-browser';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [provideExperimentalWebMcpForms()],
});
```

### 讓 Signal Form 加入

其次，在使用 [`form`](api/forms/signals/form) 定義 Signal Form 時，傳入 `experimentalWebMcpTool` 設定選項，即可加入隱含的 WebMCP 工具。Angular 會檢查你的表單資料模型，並自動為連接的 AI 代理生成 JSON 結構描述。

```ts {header:"user-registration.ts"}
import {Component, signal} from '@angular/core';
import {form, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
})
export class UserRegistration {
  private readonly model = signal({
    firstName: '',
    lastName: '',
    age: 0,
    hobbies: ['Web Development'],
  });

  readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, {message: 'First name is mandatory.'});
      required(f.lastName, {message: 'Last name is mandatory.'});
    },
    {
      // Implicitly registers a WebMCP tool named `registerUser` with parameters derived from `model`.
      experimentalWebMcpTool: {
        name: 'registerUser',
        description: 'Registers a new user.',
      },
      submission: {
        action: async (formValue) => {
          console.log('Submitting user:', formValue().value());
          // ...
        },
      },
    },
  );
}
```

在這個範例中，Angular 生成的 WebMCP 工具帶有一個 JSON 結構描述，其中：

1. 包含 `firstName`、`lastName`、`age` 與 `hobbies` 作為參數，這些參數是從 `model` 訊號的初始值推斷而來。
2. 將 `firstName` 與 `lastName` 定義為_必填_欄位，這是從 [`required`](api/forms/signals/required) 驗證器推斷而來。
3. 將 `hobbies` 定義為字串陣列，讓代理能提供任意數量的興趣。

除了推斷輸入結構描述，Angular 也把 WebMCP 工具連接到表單的驗證邏輯與提交處理常式。這表示代理會觀察到其輸入觸發的任何驗證錯誤，或提交期間發生的任何失敗，從而能自我修正並可能重試。

NOTE: 依預設，非同步驗證器不會阻擋提交：提交動作會在它們完成之前執行，因此它們的錯誤不會回報給代理。請改在提交動作中處理這些檢查。

#### 限制

Angular 從表單模型的初始值推斷 WebMCP 結構描述。這需要：

- 具體的初始值（`''`、`0`、`false`）：Angular 無法從 `null` 或 `undefined` 推斷資料型別。
- 非空陣列（`['Hello!']`）：Angular 無法從空陣列推斷資料型別，且需要至少一個初始值。

## 最佳實踐

請謹記下列最佳實踐：

### 名稱衝突

WebMCP 要求每個工具都有唯一的名稱，若同一個工具名稱被註冊多次，就會拋出錯誤。這表示在可能被多次註冊的上下文（例如元件建構子）中呼叫 `declareExperimentalWebMcpTool` 或 `provideExperimentalWebMcpTools`，可能會在執行階段導致錯誤。

請盡可能優先把工具放在應用程式 providers、路由 providers 或根服務上。把工具放在元件上時，包括 [Signal Forms 中的隱含工具](#implicit-tools-in-signal-forms)，請確保該元件在任何時刻在頁面上最多只渲染_一次_。

### 驗證工具輸入

Angular 不提供任何隱含驗證，來保證代理提供的輸入確實符合所定義的 JSON 結構描述。請考慮在使用引數之前，明確驗證傳給 `execute` 函式的引數，以確保可靠性。

### 測試

請考慮使用模擬的 WebMCP 實作，例如 [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill)，來有效地為你的工具進行單元測試。
