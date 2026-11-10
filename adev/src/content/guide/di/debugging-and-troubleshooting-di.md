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
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class DataStore {
  // Available everywhere
}
```

TIP: 對於不需要元件專屬狀態的服務，預設使用 `providedIn: 'root'`。這讓服務隨處可用，並啟用搖樹優化。

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

NOTE: 依預設，路由注入器及其服務即使在導覽離開該路由後仍會保留。它們要到應用程式關閉時才會被銷毀。關於自動清理未使用的路由注入器，請參閱[自訂路由行為](guide/routing/customizing-route-behavior#experimental-automatic-cleanup-of-unused-route-injectors)。

**解決方案**：對於需要跨越延遲載入邊界共用的服務，請使用 `providedIn: 'root'`。

```ts {prefer, header: 'Provide at root for shared services'}
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
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

**解決方案**：單例請使用 `providedIn: 'root'`。

```ts {prefer, header: 'Root-level singleton'}
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserClient {
  // Single instance shared across all components
}
```

#### 多個實例是刻意的情況

有時你會想讓每個元件有各自獨立的實例，以存放元件專屬的狀態。

```angular-ts {header: 'Intentional: Component-scoped state'}
import {Injectable, signal} from '@angular/core';

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
import {Component, inject, Injector, input} from '@angular/core';

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
      this.injector.runInInjectionContext(callback);
    }
  }
}
```

`runInInjectionContext()` 方法會建立一個暫時的注入上下文，讓回呼內的程式碼可以呼叫 `inject()`。

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
import {InjectionToken, inject} from '@angular/core';
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
import {inject} from '@angular/core';
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

```angular-ts {avoid, header: 'Can't inject interface'}
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
import {InjectionToken, inject} from '@angular/core';

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

- 服務有 `@Injectable({providedIn: 'root'})`，或
- 服務位於元件能觸及的 `providers` 陣列中

你可以使用 `self`、`skipSelf`、`host` 和 `optional` 等解析修飾符來改變這個搜尋行為。解析規則與修飾符的完整說明，請參閱[階層式注入器指南](guide/di/hierarchical-dependency-injection)。

### 使用 Angular DevTools

Angular DevTools 包含一個注入器樹檢查器，能把整個注入器階層視覺化，並顯示每個層級有哪些可用的提供者。安裝與一般用法請參閱 [Angular DevTools 注入器文件](tools/devtools/injectors)。

對 DI 問題進行除錯時，用 DevTools 回答以下問題：

- **服務有被提供嗎**？選取注入失敗的元件，檢查該服務是否出現在 Injector 區段中。
- **在哪個層級**？沿著元件樹往上找，找出服務實際上是在哪裡提供的（元件、路由或應用程式層級）。
- **有多個實例嗎**？如果一個單例服務出現在多個元件注入器中，它很可能被提供在元件的 `providers` 陣列中，而不是使用 `providedIn: 'root'`。

如果某個服務從未出現在任何注入器中，請確認它有帶 `providedIn: 'root'` 的 `@Injectable()` 裝飾器，或被列在 `providers` 陣列中。

### 記錄與追蹤注入

當 DevTools 還不夠時，用記錄來追蹤注入行為。

#### 記錄服務的建立

在服務建構子中加入主控台記錄，查看服務何時被建立。

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
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

服務被建立時，你會看到記錄訊息和堆疊追蹤，顯示注入發生在何處。

**要留意的事項**：

- 建構子被呼叫了幾次？（單例應該只有一次）
- 它在程式碼的何處被注入？（查看堆疊追蹤）
- 它是否在預期的時間被建立？（應用程式啟動時 vs 延遲載入時）

#### 檢查服務可用性

使用帶記錄的可選注入，來判斷服務是否可用。

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

這個模式能幫助你在不讓應用程式當掉的情況下，驗證服務是否可用。

#### 記錄解析修飾符

用記錄來測試不同的解析策略。

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

這能讓你看到不同注入器層級有哪些可用的實例。

### 除錯工作流程

當 DI 失敗時，遵循這個有系統的做法：

**步驟 1：閱讀錯誤訊息**

- 識別錯誤代碼（NG0200、NG0203 等）
- 閱讀依賴路徑
- 記下是哪個 token 失敗

**步驟 2：檢查基本事項**

- 服務有 `@Injectable()` 嗎？
- `providedIn` 是否設定正確？
- 匯入是否正確？
- 檔案是否包含在編譯中？

**步驟 3：驗證注入上下文**

- `inject()` 是否在有效的上下文中被呼叫？
- 檢查非同步問題（await、setTimeout、promise）
- 驗證時機（不是在銷毀之後）

**步驟 4：使用除錯工具**

- 開啟 Angular DevTools
- 檢查注入器階層
- 在建構子中加入主控台記錄
- 使用可選注入來測試可用性

**步驟 5：簡化並隔離問題**

- 逐一移除依賴
- 在最小的元件中測試
- 分別檢查每個注入器層級
- 建立重現案例

## DI 錯誤參考

本節提供你可能會遇到的特定 Angular DI 錯誤代碼的詳細資訊。當你在主控台看到這些錯誤時，把它當作參考。

### NullInjectorError: No provider for [Service]

**錯誤代碼**：無（顯示為 `NullInjectorError`）

當 Angular 在注入器階層中找不到某個 token 的提供者時，就會發生這個錯誤。錯誤訊息包含一條依賴路徑，顯示嘗試注入的位置。

```
NullInjectorError: No provider for UserClient!
  Dependency path: App -> AuthClient -> UserClient
```

依賴路徑顯示 `App` 注入了 `AuthClient`，而 `AuthClient` 試圖注入 `UserClient`，但找不到提供者。

#### 遺漏 `@Injectable` 裝飾器

最常見的原因是忘了在服務類別上加上 `@Injectable()` 裝飾器。

```ts {avoid, header: 'Missing decorator'}
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Angular 需要 `@Injectable()` 裝飾器來產生依賴注入所需的詮釋資料。

```ts {prefer, header: 'Include @Injectable'}
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

NOTE: 帶有零引數建構子的類別可以在沒有 `@Injectable()` 的情況下運作，但不建議這麼做。一律加上裝飾器以保持一致性，並避免日後加入依賴時出問題。

#### 遺漏 providedIn 設定

服務可能有 `@Injectable()`，但沒有指定它應該在哪裡被提供。

```ts {avoid, header: 'No providedIn specified'}
import {Injectable} from '@angular/core';

@Injectable()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

指定 `providedIn: 'root'`，讓服務在整個應用程式中可用。

```ts {prefer, header: 'Specify providedIn'}
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

`providedIn: 'root'` 設定讓服務在整個應用程式中可用，並啟用搖樹優化（如果服務從未被注入，就會從 bundle 中移除）。

#### 獨立元件遺漏匯入

在 Angular v20+ 中使用獨立元件時，你必須在每個元件中明確匯入或提供依賴。

```angular-ts {avoid, header: 'Missing service import'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // ERROR: No provider
  user = this.userService.getUser();
}
```

請確認服務使用了 `providedIn: 'root'`，或把它加入元件的 `providers` 陣列。

```angular-ts {prefer, header: 'Service uses providedIn: root'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // Works: providedIn: 'root'
  user = this.userService.getUser();
}
```

#### 運用依賴路徑進行除錯

錯誤訊息中的依賴路徑，顯示了導致失敗的注入鏈。

```
NullInjectorError: No provider for LoggerStore!
  Dependency path: App -> DataStore -> ApiClient -> LoggerStore
```

這條路徑告訴你：

1. `App` 注入了 `DataStore`
2. `DataStore` 注入了 `ApiClient`
3. `ApiClient` 試圖注入 `LoggerStore`
4. 找不到 `LoggerStore` 的提供者

從鏈的末端（`LoggerStore`）開始調查，確認它有正確的設定。

#### 用可選注入檢查提供者可用性

使用可選注入來檢查提供者是否存在，而不會擲出錯誤。

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

如果找不到提供者，可選注入會傳回 `null`，讓你能妥善地處理缺席的情況。

### NG0203: inject() must be called from an injection context

**錯誤代碼**：NG0203

當你在有效的注入上下文之外呼叫 `inject()` 時，就會發生這個錯誤。Angular 要求 `inject()` 在類別建構或工廠執行期間被同步呼叫。

```
NG0203: inject() must be called from an injection context such as a
constructor, a factory function, a field initializer, or a function
used with `runInInjectionContext`.
```

#### 有效的注入上下文

Angular 允許在以下位置使用 `inject()`：

1. **類別欄位初始化器**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService = inject(UserClient); // Valid
     user = this.userService.getUser();
   }
   ```

2. **類別建構子**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService: UserClient;

     constructor() {
       this.userService = inject(UserClient); // Valid
     }

     user = this.userService.getUser();
   }
   ```

3. **提供者工廠函式**

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

4. **在 runInInjectionContext() 中**

   ```angular-ts
   import {Component, inject, Injector} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<button (click)="loadUser()">Load User</button>',
   })
   export class UserProfile {
     private injector = inject(Injector);

     loadUser() {
       this.injector.runInInjectionContext(() => {
         const userService = inject(UserClient); // Valid
         console.log(userService.getUser());
       });
     }
   }
   ```

`inject()` 也能在以下注入上下文中運作：

- [provideAppInitializer](api/core/provideAppInitializer)
- [provideEnvironmentInitializer](api/core/provideEnvironmentInitializer)
- 函式式[路由守衛](guide/routing/route-guards)
- 函式式[資料解析器](guide/routing/data-resolvers)

#### 這個錯誤何時發生

這個錯誤會在以下情況發生：

- 在生命週期鉤子中呼叫 `inject()`（`ngOnInit`、`ngAfterViewInit` 等）
- 在非同步函式中的 `await` 之後呼叫 `inject()`
- 在回呼中呼叫 `inject()`（`setTimeout`、`Promise.then()` 等）
- 在類別建構階段之外呼叫 `inject()`

詳細範例與解決方案請參閱「`inject()` 使用方式不正確」一節。

#### 解決方案與因應措施

**解決方案 1**：在欄位初始化器中取得依賴（最常見）

```ts
private userService = inject(UserClient) // Capture at class level
```

**解決方案 2**：對回呼使用 `runInInjectionContext()`

```ts
private injector = inject(Injector)

someCallback() {
  this.injector.runInInjectionContext(() => {
    const service = inject(MyClient)
  })
}
```

**解決方案 3**：把依賴作為參數傳入，而不是注入它們

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

**錯誤代碼**：NG0200

當兩個或更多服務互相依賴，形成 Angular 無法解析的循環依賴時，就會發生這個錯誤。

```
NG0200: Circular dependency in DI detected for AuthClient
  Dependency path: AuthClient -> UserClient -> AuthClient
```

依賴路徑顯示了這個循環：`AuthClient` 依賴 `UserClient`，而 `UserClient` 又回過頭來依賴 `AuthClient`。

#### 了解這個錯誤

Angular 透過呼叫服務的建構子並注入依賴來建立服務實例。當服務以循環方式互相依賴時，Angular 無法決定應該先建立哪一個。

#### 常見成因

- 直接循環依賴（服務 A → 服務 B → 服務 A）
- 間接循環依賴（服務 A → 服務 B → 服務 C → 服務 A）
- 模組檔案中的匯入循環，而這些檔案同時也有服務依賴

#### 解決策略

詳細範例與解決方案請參閱「循環依賴」一節：

1. **重構**：把共用邏輯抽到第三個服務（建議）
2. **使用事件**：以事件式通訊取代直接依賴
3. **延後注入**：使用 `Injector.get()` 延後其中一個依賴（最後手段）

不要用 `forwardRef()` 處理服務的循環依賴。它只能解決元件設定中的循環匯入。

### 其他 DI 錯誤代碼

這些錯誤的詳細說明與解決方案，請參閱 [Angular 錯誤參考](errors)：

| 錯誤代碼                | 說明                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| [NG0204](errors/NG0204) | 無法解析所有參數，遺漏 `@Injectable()` 裝飾器                                              |
| [NG0205](errors/NG0205) | 注入器已被銷毀，在元件銷毀後存取服務                                                       |
| [NG0207](errors/NG0207) | EnvironmentProviders 處於錯誤的上下文，在元件提供者中使用 `provideHttpClient()`            |

## 後續步驟

當你遇到 DI 錯誤時，記得要：

1. 仔細閱讀錯誤訊息和依賴路徑
2. 驗證基本設定（裝飾器、`providedIn`、匯入）
3. 檢查注入上下文與時機
4. 使用 DevTools 和記錄進行調查
5. 簡化並隔離問題

若想更深入了解依賴注入的特定主題，請查看：

- [了解依賴注入](guide/di)：DI 的核心概念與模式
- [階層式依賴注入](guide/di/hierarchical-dependency-injection)：注入器階層的運作方式
- [使用依賴注入進行測試](guide/testing)：使用 TestBed 並模擬依賴
