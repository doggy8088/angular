# 依賴注入的除錯與疑難排解

依賴注入（DI）問題通常源自設定錯誤、範圍問題或不正確的使用模式。本指南幫助你識別並解決開發者常見的 DI 問題。

## 常見陷阱與解決方案

### 服務在預期的地方無法使用

最常見的 DI 問題之一，是當你試圖注入某個服務，但 Angular 在目前的注入器或任何父注入器中都找不到它。這通常發生在服務被提供在錯誤的範圍中、或根本沒有被提供時。

#### 提供者範圍不符

當你在元件的 `providers` 陣列中提供服務時，Angular 會在該元件的注入器中建立一個實例。這個實例只對該元件及其子元件可用。父元件和同層元件無法存取它，因為它們使用的是不同的注入器。

```angular-ts {header: 'child-view.ts'}
import {Component} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-child',
  template: '<p>Child</p>',
  providers: [DataStore], // Only available in this component and its children
})
export class ChildView {}
```

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-parent',
  template: '<app-child />',
})
export class ParentView {
  private dataService = inject(DataStore); // ERROR: Not available to parent
}
```

Angular 只沿階層往上搜尋，永遠不會往下。父元件無法存取在子元件中提供的服務。

**解決方案**：在更高的層級（應用程式或父元件）提供該服務。

```ts {prefer}
import {Service} from '@angular/core';

@Service()
export class DataStore {
  // Available everywhere
}
```

TIP: `@Service` 讓服務隨處可用，並啟用搖樹優化。如果你不想把它的範圍定為整個應用程式，請指定 `autoProvided: false`。

#### 服務與延遲載入的路由

當你在延遲載入路由的 `providers` 陣列中提供服務時，Angular 會為該路由建立一個子注入器。這個注入器及其服務只有在路由載入後才可用。應用程式中預先載入部分的元件無法存取這些服務，因為它們使用的是在延遲載入注入器建立之前就已存在的不同注入器。

```ts {header: 'feature.routes.ts'}
import {Routes} from '@angular/router';
import {FeatureClient} from './feature-client';

export const featureRoutes: Routes = [
  {
    path: 'feature',
    providers: [FeatureClient],
    loadComponent: () => import('./feature-view'),
  },
];
```

```angular-ts {header: 'eager-view.ts'}
import {Component, inject} from '@angular/core';
import {FeatureClient} from './feature-client';

@Component({
  selector: 'app-eager',
  template: '<p>Eager Component</p>',
})
export class EagerView {
  private featureService = inject(FeatureClient); // ERROR: Not available yet
}
```

延遲載入的路由會建立子注入器，這些注入器只有在路由載入後才可用。

NOTE: 依預設，路由注入器及其服務即使在導覽離開該路由後仍會保留。它們要到應用程式關閉時才會被銷毀。關於自動清理未使用的路由注入器，請參閱[自訂路由行為](guide/routing/customizing-route-behavior#automatic-cleanup-of-unused-route-injectors)。

**解決方案**：對於需要跨越延遲載入邊界共用的服務，請使用 `@Service`。

```ts {prefer, header: 'Provide at root for shared services'}
import {Service} from '@angular/core';

@Service()
export class FeatureClient {
  // Available everywhere, including before lazy load
}
```

如果服務應該被延遲載入、但仍需供預先載入的元件使用，只在需要的地方注入它，並用可選注入來處理可用性。

### 出現多個實例，而不是單例

你期待的是一個共用實例（單例），卻在不同元件中取得了各自獨立的實例。

#### 在元件中提供，而不是在根層級

當你把服務加入元件的 `providers` 陣列時，Angular 會為該元件的每個實例建立一個新的服務實例。每個元件都取得自己獨立的服務實例，這表示在一個元件中所做的變更不會影響其他元件中的服務實例。當你想在整個應用程式中共用狀態時，這往往出乎意料。

```angular-ts {avoid, header: 'Component-level provider creates multiple instances'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
  providers: [UserClient], // Creates new instance per component!
})
export class UserProfile {
  private userService = inject(UserClient);
}

@Component({
  selector: 'app-settings',
  template: '<p>Settings</p>',
  providers: [UserClient], // Different instance!
})
export class UserSettings {
  private userService = inject(UserClient);
}
```

每個元件都取得自己的 `UserClient` 實例。在一個元件中所做的變更不會影響另一個元件。

**解決方案**：單例請使用 `@Service`。

```ts {prefer, header: 'Root-level singleton'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  // Single instance shared across all components
}
```

#### 多個實例是刻意的情況

有時你會想讓每個元件有各自獨立的實例，以存放元件專屬的狀態。

```angular-ts {header: 'Intentional: Component-scoped state'}
import {Injectable, signal, Component, inject} from '@angular/core';

@Injectable() // No providedIn - must be provided explicitly
export class FormStateStore {
  private formData = signal({});

  setData(data: any) {
    this.formData.set(data);
  }

  getData() {
    return this.formData();
  }
}

@Component({
  selector: 'app-user-form',
  template: '<form>...</form>',
  providers: [FormStateStore], // Each form gets its own state
})
export class UserForm {
  private formState = inject(FormStateStore);
}
```

這個模式適用於：

- 表單狀態管理（每個表單有隔離的狀態）
- 元件專屬的快取
- 不應共用的暫時資料

### `inject()` 使用方式不正確

`inject()` 函式只在類別建構和工廠執行的特定上下文中才能運作。

#### 在生命週期鉤子中使用 inject()

當你在 `ngOnInit()`、`ngAfterViewInit()` 或 `ngOnDestroy()` 等生命週期鉤子中呼叫 `inject()` 函式時，Angular 會擲出錯誤，因為這些方法在注入上下文之外執行。注入上下文只在類別建構的同步執行期間可用，而這發生在生命週期鉤子被呼叫之前。

```angular-ts {avoid, header: 'inject() in ngOnInit'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  userName = '';

  ngOnInit() {
    const userService = inject(UserClient); // ERROR: Not an injection context
    this.userName = userService.getUser().name;
  }
}
```

**解決方案**：在欄位初始化器中取得依賴並推導出值。

```angular-ts {prefer, header: 'Derive values in field initializers'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient);
  userName = this.userService.getUser().name;
}
```

#### 使用 Injector 進行延後注入

當你需要在注入上下文之外擷取服務時，直接用取得的 `Injector` 搭配 `injector.get()`：

```angular-ts
import {Component, inject, Injector} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<button (click)="delayedLoad()">Load Later</button>',
})
export class UserProfile {
  private injector = inject(Injector);

  delayedLoad() {
    setTimeout(() => {
      const userService = this.injector.get(UserClient);
      console.log(userService.getUser());
    }, 1000);
  }
}
```

#### 使用 runInInjectionContext 處理回呼

當你需要讓**其他程式碼**也能呼叫 `inject()` 時，使用 `runInInjectionContext()`。在接受可能會使用依賴注入的回呼時，這很有用：

```angular-ts
import {Component, inject, Injector, input, runInInjectionContext} from '@angular/core';

@Component({
  selector: 'app-data-loader',
  template: '<button (click)="load()">Load</button>',
})
export class DataLoader {
  private injector = inject(Injector);
  onLoad = input<() => void>();

  load() {
    const callback = this.onLoad();
    if (callback) {
      // Enable the callback to use inject()
      runInInjectionContext(this.injector, callback);
    }
  }
}
```

`runInInjectionContext()` 函式會建立一個暫時的注入上下文，讓回呼內的程式碼可以呼叫 `inject()`。

IMPORTANT: 盡可能一律在類別層級取得依賴。簡單的延後擷取請用 `injector.get()`，只有在外部程式碼需要呼叫 `inject()` 時才用 `runInInjectionContext()`。

TIP: 使用 `assertInInjectionContext()` 來驗證你的程式碼是否在有效的注入上下文中執行。在建立會呼叫 `inject()` 的可重複使用函式時，這很有用。詳情請參閱[斷言上下文](guide/di/dependency-injection-context#asserts-the-context)。

### providers 與 viewProviders 的混淆

`providers` 和 `viewProviders` 之間的差異，會影響內容投影的情境。

#### 了解差異

**providers**：對元件的範本以及任何投影進該元件的內容（ng-content）都可用。

**viewProviders**：只對元件的範本可用，對投影進來的內容不可用。

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  providers: [ThemeStore], // Available to content children
})
export class ParentView {
  protected themeService = inject(ThemeStore);
}

@Component({
  selector: 'app-parent-view',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  viewProviders: [ThemeStore], // NOT available to content children
})
export class ParentViewOnly {
  protected themeService = inject(ThemeStore);
}
```

```angular-ts {header: 'child-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-child',
  template: '<p>Child theme: {{theme()}}</p>',
})
export class ChildView {
  private themeService = inject(ThemeStore, {optional: true});
  theme = () => this.themeService?.theme() ?? 'none';
}
```

```angular-ts {header: 'app.ts'}
@Component({
  selector: 'app-root',
  template: `
    <app-parent>
      <app-child />
      <!-- Can access ThemeStore -->
    </app-parent>

    <app-parent-view>
      <app-child />
      <!-- Cannot access ThemeStore -->
    </app-parent-view>
  `,
})
export class App {}
```

**投影進 `app-parent` 時**：子元件可以注入 `ThemeStore`，因為 `providers` 讓它對投影進來的內容可用。

**投影進 `app-parent-view` 時**：子元件無法注入 `ThemeStore`，因為 `viewProviders` 把它限制為只有父元件的範本可用。

#### 在 providers 與 viewProviders 之間做選擇

在以下情況使用 `providers`：

- 服務應該對投影進來的內容可用
- 你想讓內容子元件存取該服務
- 你提供的是通用服務

在以下情況使用 `viewProviders`：

- 服務應該只對你的元件範本可用
- 你想對投影進來的內容隱藏實作細節
- 你提供的是不應外洩的內部服務

**預設建議**：使用 `providers`，除非你有特定的理由要用 `viewProviders` 限制存取。

### InjectionToken 問題

把 `InjectionToken` 用於非類別依賴時，開發者經常會遇到與 token 身分、型別安全和提供者設定相關的問題。這些問題通常源自 JavaScript 處理物件身分的方式，以及 TypeScript 推斷型別的方式。

#### Token 身分混淆

當你建立新的 `InjectionToken` 實例時，JavaScript 會在記憶體中建立一個唯一的物件。即使你用完全相同的描述字串再建立另一個 `InjectionToken`，它仍然是完全不同的物件。Angular 用 token 物件的身分（而非它的描述）來比對提供者與注入點，因此描述相同但物件身分不同的 token，無法存取彼此的值。

```ts {header: 'config.token.ts'}
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app config');
```

```ts {header: 'app.config.ts'}
import {bootstrapApplication} from '@angular/platform-browser';
import {APP_CONFIG} from './config.token';

export const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
};

bootstrapApplication(App, {
  providers: [{provide: APP_CONFIG, useValue: appConfig}],
});
```

```angular-ts {avoid, header: 'feature-view.ts'}
// Creating new token with same description
import {InjectionToken, inject, Component} from '@angular/core';
import {AppConfig} from './config.token';

const APP_CONFIG = new InjectionToken<AppConfig>('app config');

@Component({
  selector: 'app-feature',
  template: '<p>Feature</p>',
})
export class FeatureView {
  private config = inject(APP_CONFIG); // ERROR: Different token instance!
}
```

即使兩個 token 的描述都是 `'app config'`，它們仍是不同的物件。Angular 以參考來比較 token，而不是以描述。

**解決方案**：匯入同一個 token 實例。

```angular-ts {prefer, header: 'feature-view.ts'}
import {inject, Component} from '@angular/core';
import {APP_CONFIG, AppConfig} from './config.token';

@Component({
  selector: 'app-feature',
  template: '<p>API: {{config.apiUrl}}</p>',
})
export class FeatureView {
  protected config = inject(APP_CONFIG); // Works: Same token instance
}
```

TIP: 一律從共用檔案匯出 token，並在每個需要的地方匯入它們。永遠不要建立多個描述相同的 `InjectionToken` 實例。

#### 試圖注入介面

當你定義 TypeScript 介面時，它只在編譯期間存在，用於型別檢查。TypeScript 在編譯為 JavaScript 時會清除所有介面定義，因此在執行階段沒有任何物件能讓 Angular 作為注入 token 使用。如果你試圖注入介面型別，Angular 就沒有東西能與提供者設定比對。

```angular-ts {avoid, header: "Can't inject interface"}
interface UserConfig {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
})
export class UserProfile {
  // ERROR: Interfaces don't exist at runtime
  constructor(private config: UserConfig) {}
}
```

**解決方案**：介面型別請使用 `InjectionToken`。

```angular-ts {prefer, header: 'Use InjectionToken for interfaces'}
import {InjectionToken, inject, Component} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

interface UserConfig {
  name: string;
  email: string;
}

export const USER_CONFIG = new InjectionToken<UserConfig>('user configuration');

// Provide the configuration
bootstrapApplication(App, {
  providers: [
    {
      provide: USER_CONFIG,
      useValue: {name: 'Alice', email: 'alice@example.com'},
    },
  ],
});

// Inject using the token
@Component({
  selector: 'app-profile',
  template: '<p>User: {{config.name}}</p>',
})
export class UserProfile {
  protected config = inject(USER_CONFIG);
}
```

`InjectionToken` 在執行階段存在、可用於注入，而 `UserConfig` 介面則在開發期間提供型別安全。

### 循環依賴

當服務互相注入，形成 Angular 無法解析的循環時，就會發生循環依賴。詳細說明與程式碼範例請參閱 [NG0200：循環依賴](errors/NG0200)。

**解決策略**（依偏好順序）：

1. **重構**：把共用邏輯抽到第三個服務，打破循環
2. **使用事件**：以事件式通訊（例如 `Subject`）取代直接依賴
3. **延後注入**：使用 `Injector.get()` 延後其中一個依賴（最後手段）

NOTE: 不要用 `forwardRef()` 處理服務的循環依賴，它只能解決獨立元件設定中的循環匯入。

## 對依賴解析進行除錯

### 了解解析流程

Angular 透過沿著注入器階層往上尋找來解析依賴。當 `NullInjectorError` 發生時，了解這個搜尋順序能幫助你找出應該在哪裡補上遺漏的提供者。

Angular 依以下順序搜尋：

1. **元素注入器**：目前的元件或指令
2. **父元素注入器**：沿著 DOM 樹往上，經過父元件
3. **環境注入器**：路由或應用程式注入器
4. **NullInjector**：若找不到，則擲出 `NullInjectorError`

當你看到 `NullInjectorError` 時，表示該服務沒有在元件能存取的任何層級被提供。請確認：

- 服務有 `@Service()`，或
- 服務有 `@Injectable({providedIn: 'root'})`，或
- 服務位於元件能觸及的 `providers` 陣列中

你可以使用 `self`、`skipSelf`、`host` 和 `optional` 等解析修飾符來改變這個搜尋行為。解析規則與修飾符的完整說明，請參閱[階層式注入器指南](guide/di/hierarchical-dependency-injection)。

### 使用 Angular DevTools

Angular DevTools 包含一個注入器樹檢查器，能把整個注入器階層視覺化，並顯示每個層級有哪些可用的提供者。安裝與一般用法請參閱 [Angular DevTools 注入器文件](tools/devtools/injectors)。

對 DI 問題進行除錯時，用 DevTools 回答以下問題：

- **服務有被提供嗎**？選取注入失敗的元件，檢查該服務是否出現在 Injector 區段中。
- **在哪個層級**？沿著元件樹往上找，找出服務實際上是在哪裡提供的（元件、路由或應用程式層級）。
- **有多個實例嗎**？如果一個單例服務出現在多個元件注入器中，它很可能被提供在元件的 `providers` 陣列中，而不是使用 `@Service` 或 `providedIn: 'root'`。

如果某個服務從未出現在任何注入器中，請確認它有 `@Service` 裝飾器，或被列在 `providers` 陣列中。

### 記錄與追蹤注入

當 DevTools 還不夠時，用記錄來追蹤注入行為。

#### 記錄服務的建立

在服務建構子中加入主控台記錄，查看服務何時被建立。

```ts
import {Service} from '@angular/core';

@Service()
export class UserClient {
  constructor() {
    console.log('UserClient created');
    console.trace(); // Shows call stack
  }

  getUser() {
    return {name: 'Alice'};
  }
}
```

When the service is created, you'll see the log message and a stack trace showing where the injection occurred.

**What to look for:**

- How many times is the constructor called? (should be once for singletons)
- Where in the code is it being injected? (check the stack trace)
- Is it created at the expected time? (application startup vs lazy)

#### Checking service availability

Use optional injection with logging to determine if a service is available.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});

  constructor() {
    if (this.userService) {
      console.log('UserClient available:', this.userService);
    } else {
      console.warn('UserClient NOT available');
      console.trace(); // Shows where we tried to inject
    }
  }
}
```

This pattern helps you verify if a service is available without crashing the application.

#### Logging resolution modifiers

Test different resolution strategies with logging.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
  providers: [UserClient],
})
export class DebugView {
  // Try to get local instance
  private localService = inject(UserClient, {self: true, optional: true});

  // Try to get parent instance
  private parentService = inject(UserClient, {
    skipSelf: true,
    optional: true,
  });

  constructor() {
    console.log('Local instance:', this.localService);
    console.log('Parent instance:', this.parentService);
    console.log('Same instance?', this.localService === this.parentService);
  }
}
```

This shows you which instances are available at different injector levels.

### Debugging workflow

When DI fails, follow this systematic approach:

**Step 1: Read the error message**

- Identify the error code (NG0200, NG0203, etc.)
- Read the dependency path
- Note which token failed

**Step 2: Check the basics**

- Does the service have `@Service` or `@Injectable()`?
- If you use `@Injectable`, is `providedIn` set correctly?
- Are imports correct?
- Is the file included in compilation?

**Step 3: Verify injection context**

- Is `inject()` called in a valid context?
- Check for async issues (await, setTimeout, promises)
- Verify timing (not after destroy)

**Step 4: Use debugging tools**

- Open Angular DevTools
- Check injector hierarchy
- Add console logs to constructors
- Use optional injection to test availability

**Step 5: Simplify and isolate**

- Remove dependencies one by one
- Test in a minimal component
- Check each injector level separately
- Create a reproduction case

## DI error reference

This section provides detailed information about specific Angular DI error codes you may encounter. Use this as a reference when you see these errors in your console.

### NullInjectorError: No provider for [Service]

**Error code:** [NG0201](errors/NG0201)

This error occurs when Angular cannot find a provider for a token in the injector hierarchy. The error message includes a dependency path showing where the injection was attempted.

```
NG0201: No provider found for `UserClient`. Path: AuthClient -> UserClient.
```

The dependency path shows that `AuthClient` tried to inject `UserClient`, but no provider was found.

#### Missing the `@Service ` or `@Injectable` decorator

The most common cause is forgetting the `@Service` or `@Injectable()` decorator on a service class.

```ts {avoid, header: 'Missing decorator'}
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Angular requires the `@Service()` decorator to generate the metadata needed for dependency injection.

```ts {prefer, header: 'Include @Service'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

NOTE: Classes with zero-argument constructors can work without `@Service()`, but this is not recommended. Always include the decorator for consistency and to avoid issues when adding dependencies later.

#### Missing providedIn configuration

A service may have `@Injectable()` but not specify where it should be provided.

```ts {avoid, header: 'No providedIn specified'}
import {Injectable} from '@angular/core';

@Injectable()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Use the `@Service` decorator to make the service available throughout your application.

```ts {prefer, header: 'Specify providedIn'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

The `@Service` decorator makes the service available application-wide and enables tree-shaking (the service is removed from the bundle if never injected).

#### Standalone component missing imports

In Angular v20+ with standalone components, you must explicitly import or provide dependencies in each component.

```angular-ts {avoid, header: 'Missing service import'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user.name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // ERROR: No provider
  user = this.userService.getUser();
}
```

Ensure the service uses `@Service` or add it to the component's `providers` array.

```angular-ts {prefer, header: 'Service uses providedIn: root'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user.name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // Works: providedIn: 'root'
  user = this.userService.getUser();
}
```

#### Debugging with the dependency path

The dependency path in the error message shows the chain of injections that led to the failure.

```
NG0201: No provider found for `LoggerStore`. Path: DataStore -> ApiClient -> LoggerStore.
```

This path tells you:

1. `DataStore` injected `ApiClient`
2. `ApiClient` tried to inject `LoggerStore`
3. No provider for `LoggerStore` was found

Start your investigation at the end of the chain (`LoggerStore`) and verify it has proper configuration.

#### Checking provider availability with optional injection

Use optional injection to check if a provider exists without throwing an error.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Service available: {{serviceAvailable}}</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});
  serviceAvailable = this.userService !== null;
}
```

Optional injection returns `null` if no provider is found, allowing you to handle the absence gracefully.

### NG0203: inject() must be called from an injection context

**Error code:** NG0203

This error occurs when you call `inject()` outside of a valid injection context. Angular requires `inject()` to be called synchronously during class construction or factory execution.

```
NG0203: The `UserClient` token injection failed. `inject()` function must
be called from an injection context such as a constructor, a factory
function, a field initializer, or a function used with
`runInInjectionContext`.
```

#### Valid injection contexts

Angular allows `inject()` in these locations:

1. **Class field initializers**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user.name}}</p>',
   })
   export class UserProfile {
     private userService = inject(UserClient); // Valid
     user = this.userService.getUser();
   }
   ```

2. **Class constructor**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user.name}}</p>',
   })
   export class UserProfile {
     private userService: UserClient;
     user: ReturnType<UserClient['getUser']>;

     constructor() {
       this.userService = inject(UserClient); // Valid
       this.user = this.userService.getUser();
     }
   }
   ```

3. **Provider factory functions**

   ```ts
   import {inject, InjectionToken} from '@angular/core';
   import {UserClient} from './user-client';

   export const GREETING = new InjectionToken<string>('greeting', {
     factory() {
       const userService = inject(UserClient); // Valid
       const user = userService.getUser();
       return `Hello, ${user.name}`;
     },
   });
   ```

4. **Inside runInInjectionContext()**

   ```angular-ts
   import {Component, inject, Injector, runInInjectionContext} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<button (click)="loadUser()">Load User</button>',
   })
   export class UserProfile {
     private injector = inject(Injector);

     loadUser() {
       runInInjectionContext(this.injector, () => {
         const userService = inject(UserClient); // Valid
         console.log(userService.getUser());
       });
     }
   }
   ```

Other injection contexts that `inject()` also works in include:

- [provideAppInitializer](api/core/provideAppInitializer)
- [provideEnvironmentInitializer](api/core/provideEnvironmentInitializer)
- Functional [route guards](guide/routing/route-guards)
- Functional [data resolvers](guide/routing/data-resolvers)
- Route [resources](guide/routing/data-fetching-with-resources)

#### When this error occurs

This error occurs when:

- Calling `inject()` in lifecycle hooks (`ngOnInit`, `ngAfterViewInit`, etc.)
- Calling `inject()` after `await` in async functions
- Calling `inject()` in callbacks (`setTimeout`, `Promise.then()`, etc.)
- Calling `inject()` outside of class construction phase

See the "Incorrect inject() usage" section for detailed examples and solutions.

#### Solutions and workarounds

**Solution 1:** Capture dependencies in field initializers (most common)

```ts
private userService = inject(UserClient) // Capture at class level
```

**Solution 2:** Use `runInInjectionContext()` for callbacks

```ts
private injector = inject(Injector)

someCallback() {
  runInInjectionContext(this.injector, () => {
    const service = inject(MyClient)
  })
}
```

**Solution 3:** Pass dependencies as parameters instead of injecting them

```ts
// Instead of injecting inside a callback
setTimeout(() => {
  const service = inject(MyClient) // ERROR
}, 1000)

// Capture first, then use
private service = inject(MyClient)

setTimeout(() => {
  this.service.doSomething() // Use captured reference
}, 1000)
```

### NG0200: Circular dependency detected

**Error code:** NG0200

This error occurs when two or more services depend on each other, creating a circular dependency that Angular cannot resolve.

```
NG0200: Circular dependency detected for `AuthClient`. Path: AuthClient -> UserClient -> AuthClient.
```

The dependency path shows the cycle: `AuthClient` depends on `UserClient`, which depends back on `AuthClient`.

#### Understanding the error

Angular creates service instances by calling their constructors and injecting dependencies. When services depend on each other circularly, Angular cannot determine which to create first.

#### Common causes

- Direct circular dependency (Service A → Service B → Service A)
- Indirect circular dependency (Service A → Service B → Service C → Service A)
- Import cycles in module files that also have service dependencies

#### Resolution strategies

See the "Circular dependencies" section for detailed examples and solutions:

1. **Restructure** - Extract shared logic to a third service (recommended)
2. **Use events** - Replace direct dependencies with event-based communication
3. **Lazy injection** - Use `Injector.get()` to defer one dependency (last resort)

Do NOT use `forwardRef()` for service circular dependencies. It only solves circular imports in component configurations.

### Other DI error codes

For detailed explanations and solutions for these errors, see the [Angular error reference](errors):

| Error Code              | Description                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| [NG0204](errors/NG0204) | Can't resolve all parameters - missing `@Injectable()` decorator                           |
| [NG0205](errors/NG0205) | Injector already destroyed - accessing services after component destruction                |
| [NG0207](errors/NG0207) | EnvironmentProviders in wrong context - using `provideHttpClient()` in component providers |

## Next steps

When you encounter DI errors, remember to:

1. Read the error message and dependency path carefully
2. Verify basic configuration (decorators, `providedIn`, imports)
3. Check injection context and timing
4. Use DevTools and logging to investigate
5. Simplify and isolate the problem

For a deeper understanding of specific topics on dependency injection, check out:

- [Understanding dependency injection](guide/di) - Core DI concepts and patterns
- [Hierarchical dependency injection](guide/di/hierarchical-dependency-injection) - How the injector hierarchy works
- [Testing with dependency injection](guide/testing) - Using TestBed and mocking dependencies
