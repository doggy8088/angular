# 單例服務

單例服務是指在應用程式中只有一個執行個體存在的服務。

## 提供單例服務 {#providing-a-singleton-service}

在 Angular 中，有兩種方法可以讓服務成為單例：

* 把 `@Injectable()` 的 `providedIn` 屬性設為 `"root"`
* 把服務包含在 `AppModule` 中，或包含在只由 `AppModule` 匯入的模組中

### 使用 `providedIn` {#using-providedin}

建立單例服務的首選方式，是在服務的 `@Injectable()` 裝飾器上把 `providedIn` 設為 `root`。
這會告訴 Angular 在應用程式根部提供該服務。

<docs-code header="src/app/user.service.ts" highlight="[4]">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
}
</docs-code>

### NgModule 的 `providers` 陣列 {#ngmodule-providers-array}

在以 6.0 之前的 Angular 版本建置的應用程式中，服務通常如下在 `@NgModule` 的 `providers` 欄位中註冊：

<docs-code language="typescript">
@NgModule({
  // ...
  providers: [UserService],
})
</docs-code>

如果這個 NgModule 是根 `AppModule`，`UserService` 就會是單例，並在整個應用程式中都可使用。
雖然你可能看過這樣的寫法，但從 Angular 6.0 起，較好的做法是在服務本身的 `@Injectable()` 裝飾器上使用 `providedIn` 屬性，因為這能讓你的服務可被搖樹優化。

## `forRoot()` 模式 {#the-forroot-pattern}

一般來說，你只會需要用 `providedIn` 來提供服務，以及用 `forRoot()`/`forChild()` 來處理路由。
不過，了解 `forRoot()` 如何運作以確保服務是單例，能讓你的開發功力更上一層樓。

如果一個模組同時定義了提供者與宣告（元件、指令、管道），把該模組載入多個功能模組就會重複註冊該服務。
這可能導致多個服務執行個體，服務也就不再表現得像單例。

有幾種方法可以防止這種情況：

* 使用 [`providedIn` 語法](#using-providedin)，而不是在模組中註冊服務。
* 把你的服務分到自己的模組中，且該模組只匯入一次。
* 在模組中定義 `forRoot()` 與 `forChild()` 方法。

入門說明請參閱[延遲載入功能模組](guide/ngmodules/lazy-loading)指南。

使用 `forRoot()` 把提供者從模組中分離出來，這樣你就可以把該模組連同 `providers` 匯入根模組，並把不帶 `providers` 的它匯入子模組。

1. 在模組上建立一個靜態方法 `forRoot()`。
1. 把提供者放進 `forRoot()` 方法中。

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

### `forRoot()` 與 `Router` {#forroot-and-the-router}

`RouterModule` 提供 `Router` 服務，以及 `RouterOutlet`、`routerLink` 等路由器指令。
根應用程式模組匯入 `RouterModule`，讓應用程式擁有 `Router`，且根應用程式元件能取用路由器指令。
任何功能模組也必須匯入 `RouterModule`，讓它們的元件能把路由器指令放進範本中。

如果 `RouterModule` 沒有 `forRoot()`，每個功能模組都會實例化一個新的 `Router` 執行個體，這會使應用程式出錯，因為 `Router` 只能有一個。
使用 `forRoot()` 方法後，根應用程式模組匯入 `RouterModule.forRoot(...)` 並取得一個 `Router`，所有功能模組則匯入 `RouterModule.forChild(...)`，不會再實例化另一個 `Router`。

HELPFUL: 如果你有一個同時具有提供者與宣告的模組，你*可以*用這個技巧把它們分離出來，你可能會在舊版應用程式中看到這種模式。
不過，從 Angular 6.0 起，提供服務的最佳實務是在 `@Injectable()` 上使用 `providedIn` 屬性。

### `forRoot()` 的運作方式 {#how-forroot-works}

`forRoot()` 接受一個服務設定物件，並回傳 [ModuleWithProviders](api/core/ModuleWithProviders)，這是一個帶有下列屬性的簡單物件：

| 屬性  | 詳細說明 |
|:---         |:---     |
| `ngModule`  | 在本例中，即 `GreetingModule` 類別 |
| `providers` | 設定好的提供者                    |

具體來說，Angular 會先累積所有匯入的提供者，再附加 `@NgModule.providers` 中列出的項目。
這個順序確保你明確加入 `AppModule` 提供者的任何項目，優先於匯入模組的提供者。

範例應用程式匯入 `GreetingModule`，並在 `AppModule` 中只使用一次它的 `forRoot()` 方法。
像這樣只註冊一次，可以防止多個執行個體。

在下列範例中，`UserServiceConfig` 被選擇性地注入 `UserService`。
如果設定存在，服務會根據取得的設定來設定使用者名稱。

<docs-code header="src/app/greeting/user.service.ts (constructor)" language="typescript">
  constructor(@Optional() config?: UserServiceConfig) {
    if (config) {
      this._userName = config.userName;
    }
  }
</docs-code>

以下是接受 `UserServiceConfig` 物件的 `forRoot()`：

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
下列程式碼片段省略了檔案的其他部分。

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

應用程式接著會把使用者顯示為 "Miss Marple"。

請記得把 `GreetingModule` 作為 JavaScript import 匯入，且不要把 `forRoot` 的用法加入一個以上的 `@NgModule` `imports` 清單。

## 防止重複匯入 `GreetingModule` {#prevent-reimport-of-the-greetingmodule}

只有根 `AppModule` 應該匯入 `GreetingModule`。
如果延遲載入的模組也匯入它，應用程式可能會產生服務的[多個執行個體](guide/ngmodules/faq#why-is-it-bad-if-a-shared-module-provides-a-service-to-a-lazy-loaded-module?)。

為了防止延遲載入的模組重複匯入 `GreetingModule`，請加入下列 `GreetingModule` 建構子。

<docs-code header="src/app/greeting/greeting.module.ts" language="typescript">
  constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
    if (parentModule) {
      throw new Error(
        'GreetingModule is already loaded. Import it in the AppModule only');
    }
  }
</docs-code>

這個建構子告訴 Angular 把 `GreetingModule` 注入它自己。
如果 Angular 在*目前的*注入器中尋找 `GreetingModule`，注入就會變成循環，但 `@SkipSelf()` 裝飾器的意思是「在注入器階層中我上方的祖先注入器中尋找 `GreetingModule`」。

依預設，當注入器找不到所請求的提供者時會擲出錯誤。
`@Optional()` 裝飾器表示找不到服務也沒關係。
注入器會回傳 `null`，`parentModule` 參數為 null，建構子就平順地結束。

如果你不當地把 `GreetingModule` 匯入像 `CustomersModule` 這樣的延遲載入模組，情況就不同了。

Angular 會為延遲載入模組建立它自己的注入器，這是根注入器的子注入器。
`@SkipSelf()` 使 Angular 在父注入器中尋找 `GreetingModule`，而這次父注入器就是根注入器。
它當然會找到根 `AppModule` 匯入的執行個體。
此時 `parentModule` 存在，建構子便擲出錯誤。

## 深入了解 NgModules {#more-on-ngmodules}

<docs-pill-row>
  <docs-pill href="/guide/ngmodules/sharing" title="共享模組"/>
  <docs-pill href="/guide/ngmodules/lazy-loading" title="延遲載入模組"/>
  <docs-pill href="/guide/ngmodules/faq" title="NgModule 常見問題"/>
</docs-pill-row>
