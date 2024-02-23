# Singleton 服務

單例服務是一種在應用程式中僅存在一個實例的服務。

## 提供單例服務

在 Angular 中有兩種方法可以讓服務成為單例：

* 將 `@Injectable()` 的 `providedIn` 屬性設為 `"root"`
* 將服務包含在 `AppModule` 或僅由 `AppModule` 匯入的模組中

### 使用 `providedIn`

建立單例服務的首選方式是在服務的 `@Injectable()` 裝飾器上將 `providedIn` 設為 `root`。
這會指示 Angular 在應用程式根目錄中提供該服務。

<docs-code header="src/app/user.service.ts" highlight="[4]">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
}
</docs-code>

### NgModule `providers` 陣列

在使用 6.0 之前的 Angular 版本所建置的應用程式中，服務通常在 `@NgModule` `providers` 欄位中註冊，如下所示：

<docs-code language="typescript">
@NgModule({
  // ...
  providers: [UserService],
})
</docs-code>

如果此 NgModule 是根 `AppModule`，則 `UserService` 將成為單例並在整個應用程式中可用。
雖然你可能會看到以這種方式編碼，但自 Angular 6.0 起，最好在服務本身上使用 `@Injectable()` 裝飾器的 `providedIn` 屬性，因為它使服務可樹狀動態搖樹。

## `forRoot()` 模式

一般來說，您只需要 `providedIn` 來提供服務，而 `forRoot()`/`forChild()` 則用於路由。
然而，了解 `forRoot()` 的運作方式以確保服務是單例，將會在更深層次上為您的開發提供資訊。

如果模組同時定義了供應商和聲明 (元件、指令、管道)，則在多個功能模組中載入模組將會重複服務的註冊。
這可能會導致多個服務實例，而服務將不再表現為單例。

防止此問題的方法有很多：

* 使用 [`providedIn` 語法](#using-providedin) 代替在模組中註冊服務。
* 將服務分開到一次匯入的獨立模組中。
* 在模組中定義 `forRoot()` 和 `forChild()` 方法。

有關入門說明，請參閱 [Lazy Loading Feature Modules](guide/ngmodules/lazy-loading) 指南。

使用 `forRoot()` 將提供者從模組中分隔，以便您可以將該模組匯入具有 `providers` 的根模組和沒有 `providers` 的子模組。

1. 在模組上建立一個靜態方法 `forRoot()`。
1. 將提供者放入 `forRoot()` 方法。

<docs-code header="src/app/greeting/greeting.module.ts" highlight="[3,6,7]" language="typescript">
@NgModule({...})
export class GreetingModule {
  static forRoot(config: UserServiceConfig): ModuleWithProviders<GreetingModule> {
    return {
      ngModule: GreetingModule,
      providers: [
        {provide: UserServiceConfig, useValue: config }
      ]
    };
  }
}
</docs-code>

### `forRoot()` 和 `Router`

`RouterModule` 提供 `Router` 服務，以及路由器指令，例如 `RouterOutlet` 和 `routerLink`。
根應用程式模組匯入 `RouterModule`，以便應用程式具有 `Router`，而且根應用程式元件可以存取路由器指令。
任何功能模組也必須匯入 `RouterModule`，以便其元件可以將路由器指令置入其範本。

如果 `RouterModule` 沒有 `forRoot()`，那麼每個功能模組都會實例化一個新的 `Router`，這會中斷應用程式，因為只能有一個 `Router`。
透過使用 `forRoot()` 方法，根應用程式模組匯入 `RouterModule.forRoot(...)` 並獲取一個 `Router`，而所有功能模組匯入 `RouterModule.forChild(...)`，這不會實例化另一個 `Router`。

有用：如果您有同時具有提供者和宣告的模組，您*可以*使用此技術將其分開，您可能會在舊版應用程式中看到此模式。
但是，自 Angular 6.0 以來，提供服務的最佳做法是使用 `@Injectable()` `providedIn` 屬性。

### `forRoot()` 是如何運作的

forRoot()` 接受服務設定物件並傳回 [ModuleWithProviders](api/core/ModuleWithProviders)，這是一個具有以下屬性的簡單物件：

| 屬性  | 詳細資料 |
|:---         |:---     |
| `ngModule`  | 在這個範例中，`GreetingModule` 類別 |
| `providers` | 已設定的提供者                    |

具體來說，Angular 會在附加 `@NgModule.providers` 中列出的項目之前累積所有匯入的提供者。
此順序可確保您明確新增至 `AppModule` 提供者的內容會優先於匯入模組的提供者。

範例應用程式匯入 `GreetingModule` 並在其 `forRoot()` 方法中使用一次，在 `AppModule` 中。像這樣註冊一次可防止多個執行個體。

在以下範例中，`UserServiceConfig` 可選擇性地注入到 `UserService`。
如果設定檔存在，服務會根據擷取的設定檔來設定使用者名稱。

<docs-code header="src/app/greeting/user.service.ts (constructor)" language="typescript">
  constructor(@Optional() config?: UserServiceConfig) {
    if (config) {
      this._userName = config.userName;
    }
  }
</docs-code>

以下為採用 `UserServiceConfig` 物件的 `forRoot()`：

<docs-code header="src/app/greeting/greeting.module.ts" highlight="[3,6,7]" language="typescript">
@NgModule({...})
export class GreetingModule {
  static forRoot(config: UserServiceConfig): ModuleWithProviders<GreetingModule> {
    return {
      ngModule: GreetingModule,
      providers: [
        {provide: UserServiceConfig, useValue: config }
      ]
    };
  }
}
</docs-code>

最後，在 `AppModule` 的 `imports` 清單中呼叫它。
在以下程式片段中，檔案的其他部分已省略。

<docs-code header="src/app/app.module.ts (imports)" language="typescript">
import { GreetingModule } from './greeting/greeting.module';

@NgModule({
  // ...
  imports: [
    // ...
    GreetingModule.forRoot({userName: 'Miss Marple'}),
  ],
})
</docs-code>

此應用程式會將使用者顯示為「瑪波小姐」。

請記住將 `GreetingModule` 匯入為 JavaScript 匯入，而且不要在多個 `@NgModule` `imports` 清單中增加 `forRoot` 的用法。

## 防止重新匯入 `GreetingModule`

只有根 `AppModule` 應該匯入 `GreetingModule`。
如果延遲載入的模組也匯入它，應用程式可能會產生服務的 [多個實例](guide/ngmodules/faq#why-is-it-bad-if-a-shared-module-provides-a-service-to-a-lazy-loaded-module?)。

為避免延遲載入的模組重新匯入 `GreetingModule`，請新增以下 `GreetingModule` 建構函式。

<docs-code header="src/app/greeting/greeting.module.ts" language="typescript">
  constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
    if (parentModule) {
      throw new Error(
        'GreetingModule is already loaded. Import it in the AppModule only');
    }
  }
</docs-code>

建構函式指示 Angular 將 `GreetingModule` 注入自身。
如果 Angular 在 *目前的* 注入器中尋找 `GreetingModule`，注入就會是循環的，但 `@SkipSelf()` 裝飾器的意思是「在父級注入器中尋找 `GreetingModule`，在注入器階層中位於我的上方」。

預設情況下，注射器在找不到所要求的提供者時會擲出錯誤。
`@Optional()` 裝飾器表示找不到服務是正常的。
注射器會傳回 `null`，`parentModule` 參數為 `null`，建構函式會順利結束。

如果您將 `GreetingModule` 不正確地匯入到延遲載入的模組，例如 `CustomersModule`，那又是另一回事。

`Angular` 建立了一個延遲載入模組，這個模組有自己的注入器，是根注入器的子項。
`@SkipSelf()` 會讓 `Angular` 在父注入器中尋找 `GreetingModule`，這次的父注入器是根注入器。
當然，它會找到由根 `AppModule` 匯入的實例。
現在 `parentModule` 存在，建構函式就會擲出錯誤。

## 更多有關 NgModules

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/sharing" title="共享模組"/>
  <docs-pill href="/guide/ngmodules/lazy-loading" title="延遲載入模組"/>
  <docs-pill href="/guide/ngmodules/faq" title="NgModule 常見問題"/>
</docs-pill-row>
