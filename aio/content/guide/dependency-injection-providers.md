# 依賴提供者

依賴[提供者](guide/glossary#provider)用 [DI 權杖](guide/glossary#di-token)設定注入器，注入器使用該權杖來提供依賴值的具體執行時期版本。
注入器依賴提供者設定來建立依賴的實例，並將這些實例注入到元件、指令、管道與其他服務中。

你必須用提供者設定注入器，否則它不知道如何建立依賴。
注入器建立服務類別實例最明顯的方式就是使用類別本身。
如果你指定服務類別本身作為提供者權杖，預設行為是注入器用 `new` 實例化該類別。

在以下典型範例中，`Logger` 類別本身提供了一個 `Logger` 實例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

不過，你可以用替代提供者來設定注入器，以提供某個能提供所需記錄功能的其他物件。
例如：
* 你可以提供一個替代類別。

* 你可以提供一個類似記錄器的物件。

* 你的提供者可以呼叫記錄器工廠函式。

{@a provide}

## `Provider` 物件實字

類別提供者語法是一種速記表達式，會展開成由 [`Provider` 介面](api/core/Provider)定義的提供者設定。
下列程式碼片段示範了作為 `providers` 值給定的類別如何展開成完整的提供者物件。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" >
</code-example>

展開後的提供者設定是一個物件實字，包含兩個屬性。

* `provide` 屬性存放[權杖](guide/dependency-injection#token)，它同時作為尋找依賴值與設定注入器的鍵。

* 第二個屬性是提供者定義物件，告訴注入器如何建立依賴值。
提供者定義鍵可以是 `useClass`，如本範例。
也可以是 `useExisting`、`useValue` 或 `useFactory`。
這些鍵各自提供不同型別的依賴，如下所述。

{@a class-provider}

## 替代類別提供者

不同的類別可以提供相同的服務。
例如，下列程式碼告訴注入器：當元件使用 `Logger` token 請求記錄器時，傳回 `BetterLogger` 實例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" >
</code-example>

{@a class-provider-dependencies}

### 設定具有依賴的類別提供者

另一個類別 `EvenBetterLogger` 可能會在日誌訊息中顯示使用者名稱。
這個記錄器會從注入的 `UserService` 實例取得使用者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

注入器需要這個新的記錄服務與它所依賴的 `UserService` 兩者的提供者。用 `useClass` 提供者定義鍵來設定這個替代記錄器，就像 `BetterLogger` 一樣。下列陣列在父模組或元件的 `providers` 中繼資料選項中指定了這兩個提供者。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

{@a aliased-class-providers}

### 為類別提供者取別名

假設有一個舊元件依賴 `OldLogger` 類別。
`OldLogger` 與 `NewLogger` 有相同的介面，但出於某些原因，你無法更新舊元件來使用它。

當舊元件用 `OldLogger` 記錄訊息時，你希望改由 `NewLogger` 的單例實例來處理。
在這種情況下，當元件請求新或舊的記錄器時，依賴注入器都應該注入那個單例實例。
`OldLogger` 應該是 `NewLogger` 的*別名*。

如果你試圖用 `useClass` 將 `OldLogger` 別名為 `NewLogger`，你的應用程式中最終會有兩個不同的 `NewLogger` 實例。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6a"></code-example>

為了確保只有一個 `NewLogger` 實例，請用 `useExisting` 選項為 `OldLogger` 取別名。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

{@a value-provider}

## 值提供者

有時候，提供一個現成的物件比要求注入器從類別建立它更容易。
要注入你已經建立好的物件，請用 `useValue` 選項設定注入器

下列程式碼定義了一個變數，建立這樣一個物件來扮演記錄器的角色。

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"></code-example>

下列提供者物件使用 `useValue` 鍵，將該變數與 `Logger` 權杖關聯起來。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7"></code-example>

{@a non-class-dependencies}

### 非類別依賴

並非所有依賴都是類別。
有時候你想注入一個字串、函式或物件。

應用程式經常定義包含許多小事實的設定物件，像是應用程式的標題或 Web API 端點的位址。
這些設定物件並不總是類別的實例。
它們可以是物件實字，如下列範例所示。

<code-example path="dependency-injection/src/app/app.config.ts" region="config" header="src/app/app.config.ts (excerpt)"></code-example>

{@a interface-not-valid-token}

**TypeScript 介面不是有效的權杖**

`HERO_DI_CONFIG` 常數符合 `AppConfig` 介面。
不幸的是，你不能使用 TypeScript 介面作為權杖。
在 TypeScript 中，介面是設計時期的產物，沒有 DI 框架可以使用的執行時期表示（權杖）。

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

<div class="alert is-helpful">

如果你習慣了強型別語言中的依賴注入，可能會覺得這很奇怪，在那些語言中，介面是慣用的依賴查閱鍵。
然而，JavaScript 沒有介面，所以當 TypeScript 被轉譯為 JavaScript 時，介面就消失了。
執行時期沒有留下任何介面型別資訊供 Angular 尋找。

</div>

一個替代方案是在像 `AppModule` 這樣的 NgModule 中提供並注入設定物件。

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)"></code-example>

為非類別依賴選擇提供者權杖的另一個解決方案，是定義並使用 `InjectionToken` 物件。
下列範例示範如何定義這樣一個權杖。

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

型別參數雖然是選用的，但它能向開發者與工具傳達依賴的型別。
token 描述則是另一項協助開發者的資訊。

使用 `InjectionToken` 物件註冊依賴提供者：

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9"></code-example>

現在，借助 `@Inject()` 參數裝飾器，你可以將設定物件注入到任何需要它的建構函式中。

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

<div class="alert is-helpful">

雖然 `AppConfig` 介面在依賴注入中不扮演任何角色，它支援類別內設定物件的型別。

</div>

{@a factory-provider}
{@a factory-providers}

## 工廠提供者

有時候，你需要根據執行時期才知道的資訊，動態建立依賴值。
例如，你可能需要會在瀏覽器工作階段過程中反覆變化的資訊。
另外，你的可注入服務可能無法獨立存取資訊來源。

在這種情況下，你可以使用*工廠提供者*。
工廠提供者在從未設計與 DI 一起運作的第三方函式庫建立依賴實例時也很有用。

例如，假設 `HeroService` 必須對一般使用者隱藏*秘密*英雄。
只有授權使用者應該能看到秘密英雄。

就像 `EvenBetterLogger` 一樣，`HeroService` 需要知道使用者是否有權看到秘密英雄。
該授權可以在單一應用程式工作階段過程中改變，例如當你登入不同的使用者時。

想像你不想將 `UserService` 直接注入 `HeroService`，因為你不想讓該服務被安全性敏感資訊複雜化。
`HeroService` 將無法直接存取使用者資訊來決定誰有授權、誰沒有。

為了解決這個問題，給 `HeroService` 建構函式一個布林旗標，以控制秘密英雄的顯示。

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

你可以注入 `Logger`，但你無法注入 `isAuthorized` 旗標。取而代之，你可以使用工廠提供者為 `HeroService` 建立新的記錄器實例。

工廠提供者需要一個工廠函式。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

雖然 `HeroService` 無法存取 `UserService`，但工廠函式可以。
你將 `Logger` 與 `UserService` 都注入到工廠提供者中，並讓注入器將它們傳遞給工廠函式。

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory` 欄位告訴 Angular，該提供者是一個工廠函式，其實作為 `heroServiceFactory`。

* `deps` 屬性是一個[提供者權杖](guide/dependency-injection#token)陣列。
`Logger` 與 `UserService` 類別各自作為自身類別提供者的權杖。
注入器會解析這些權杖，並將對應的服務注入到相符的工廠函式參數中。

請注意，你將工廠提供者捕獲在一個匯出的變數 `heroServiceProvider` 中。
這個額外的步驟使工廠提供者可重複使用。
你可以在任何需要的地方用這個變數設定 `HeroService` 的提供者。
在本範例中，你只在 `HeroesComponent` 中需要它，在那裡 `heroServiceProvider` 在中繼資料 `providers` 陣列中取代了 `HeroService`。

以下將新舊實作並列顯示。

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts">
  </code-pane>

</code-tabs>

## 預先定義的權杖與多重提供者

Angular 提供了許多內建的注入權杖常數，你可以用來客製化各種系統的行為。

例如，你可以使用下列內建權杖作為掛勾，介入框架的啟動與初始化過程。
提供者物件可以將這些注入權杖中的任何一個與一個或多個回呼函式關聯起來，這些函式會執行應用程式專屬的初始化動作。

* [PLATFORM_INITIALIZER](api/core/PLATFORM_INITIALIZER)：回呼在平台初始化時被呼叫。

* [APP_BOOTSTRAP_LISTENER](api/core/APP_BOOTSTRAP_LISTENER)：回呼會為每個被啟動的元件呼叫。處理函式會收到被啟動元件的 ComponentRef 實例。

* [APP_INITIALIZER](api/core/APP_INITIALIZER)：回呼在應用程式初始化之前被呼叫。所有已註冊的初始化器都可以選擇回傳 Promise。所有回傳 Promise 的初始化器函式都必須在應用程式啟動之前解析完畢。如果其中一個初始化器未能解析，應用程式就不會啟動。

提供者物件可以有第三個選項 `multi: true`，你可以將它與 `APP_INITIALIZER` 一起使用，為該提供事件註冊多個處理器。

例如，在啟動應用程式時，你可以使用同一個權杖註冊許多初始化器。

```
export const APP_TOKENS = [
 { provide: PLATFORM_INITIALIZER, useFactory: platformInitialized, multi: true },
 { provide: APP_INITIALIZER, useFactory: delayBootstrapping, multi: true },
 { provide: APP_BOOTSTRAP_LISTENER, useFactory: appBootstrapped, multi: true },
];
```

多重提供者也可以在其他領域與單一權杖關聯。
例如，你可以使用內建的 [NG_VALIDATORS](api/forms/NG_VALIDATORS) 權杖註冊自訂表單驗證器，並透過在提供者物件中使用 `multi: true` 屬性，提供給定驗證器提供者的多個實例。
Angular 會將你的自訂驗證器加入現有的集合中。

路由器也使用與單一權杖關聯的多重提供者。
當你在單一模組中使用 [RouterModule.forRoot](api/router/RouterModule#forroot) 與 [RouterModule.forChild](api/router/RouterModule#forchild) 提供多組路由時，[ROUTES](api/router/ROUTES) 權杖會將所有不同提供的路由集合合併為單一值。

<div class="alert is-helpful">

在 [API 文件中的常數](api?type=const)中搜尋，以找到更多內建權杖。

</div>

<div class="alert is-helpful">

請注意，為 `multi` 提供者回傳之陣列的參照，會在該權杖被注入的所有地方之間共用。我們建議避免變更該陣列（尤其是對於預先定義的權杖），因為這可能導致應用程式其他注入相同權杖的部分出現意外行為。你可以將它的型別設為 `ReadonlyArray`，以防止該值被變更。

</div>

你可以使用 `ReadonlyArray` 來為你的 `multi` 提供者指定型別，這樣 TypeScript 會在發生非預期的陣列變更時觸發錯誤：

```
constructor(@Inject(MULTI_PROVIDER) multiProvider: ReadonlyArray<MultiProvider>) {
}
```

{@a tree-shakable-provider}
{@a tree-shakable-providers}

## 可樹搖提供者

樹搖指的是編譯器的一個選項，會從最終套件中移除應用程式未參照的程式碼。
當提供者可樹搖時，Angular 編譯器會在判定你的應用程式不使用這些服務時，將關聯的服務從最終輸出中移除。
這能顯著縮小你的套件大小。

<div class="alert is-helpful">

理想情況下，如果應用程式沒有注入某個服務，Angular 不應該將它包含在最終輸出中。
然而，Angular 必須能夠在建置時期辨識應用程式是否需要該服務。
因為永遠有可能使用 `injector.get(Service)` 直接注入服務，Angular 無法辨識你的程式碼中所有可能發生這種注入的地方，所以它別無選擇，只能將服務包含在注入器中。
因此，NgModule `providers` 陣列中或元件層級的服務是不可樹搖的。

</div>

下列不可樹搖提供者的範例在 Angular 中，為一個 NgModule 的注入器設定了服務提供者。

<code-example path="dependency-injection/src/app/tree-shaking/service-and-module.ts"  header="src/app/tree-shaking/service-and-modules.ts"></code-example>

然後你可以將這個模組匯入你的應用程式模組，讓該服務可以在你的應用程式中被注入，如下列範例所示。

<code-example path="dependency-injection/src/app/tree-shaking/app.module.ts"  header="src/app/tree-shaking/app.modules.ts"></code-example>

當 `ngc` 執行時，它將 `AppModule` 編譯成模組工廠，其中包含它所包括的所有模組中宣告的所有提供者的定義。在執行時期，這個工廠成為一個注入器，實例化這些服務。

樹搖在這裡不起作用，因為 Angular 無法根據另一段程式碼（服務類別）是否被使用，來決定排除一段程式碼（模組工廠內的服務提供者定義）。要讓服務可樹搖，如何建構服務實例的資訊（提供者定義）需要成為服務類別本身的一部分。

### 建立可樹搖提供者

你可以透過在服務本身的 `@Injectable()` 裝飾器中指定提供者（而不是在依賴該服務的 NgModule 或元件的中繼資料中），使提供者可樹搖。

下列範例示範了與上面 `ServiceModule` 範例等效的可樹搖版本。

<code-example path="dependency-injection/src/app/tree-shaking/service.ts"  header="src/app/tree-shaking/service.ts"></code-example>

該服務可以透過設定工廠函式來實例化，如下列範例所示。

<code-example path="dependency-injection/src/app/tree-shaking/service.0.ts"  header="src/app/tree-shaking/service.0.ts"></code-example>

<div class="alert is-helpful">

要覆寫可樹搖提供者，請使用 `@NgModule()` 或 `@Component()` 裝飾器的 `providers: []` 陣列語法，用另一個提供者設定特定 NgModule 或元件的注入器。

</div>
