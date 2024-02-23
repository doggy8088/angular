# 階層式注入器

Angular 中的 Injectors 有些規則，您可以利用這些規則來實現應用程式中可注入項的所需可見性。
透過了解這些規則，您可以確定要在應用程式層級、在 Component 或在 Directive 中宣告提供者。

使用 Angular 構建的應用程式可能會變得非常龐大，管理這種複雜性的方法之一是將應用程式分割成定義良好的元件樹。

頁面中可以有區段以完全獨立於應用程式其他部分的方式運作，具有其服務和所需其他相依項的本地副本。
這些應用程式區段使用的部分服務可能與應用程式其他部分或元件樹中較上層的父元件共用，而其他相依項則專為私人用途。

藉由階層式依賴注入，您可以分離應用程式的區段，並提供它們自己的私人依賴項，而不會與應用程式的其他部分共享，或者讓父元件僅與其子元件共享某些依賴項，但不會與元件樹的其餘部分共享，依此類推。階層式依賴注入讓您僅在需要時，才能在應用程式的不同部分之間共享依賴項。

## 注入器層級類型

Angular 有兩個注射器層級：

| 注入器階層 | 詳細 |
|:--- |:--- |
| `EnvironmentInjector` 階層 | 在此階層中使用 `@Injectable()` 或 `ApplicationConfig` 中的 `providers` 陣列來配置 `ElementInjector`。 |
| `ElementInjector` 階層 | 在每個 DOM 元素中隱式建立。預設情況下，`ElementInjector` 為空，除非您在 `@Directive()` 或 `@Component()` 上的 `providers` 屬性中配置它。 |

<docs-callout title="基於 NgModule 的應用程式">
對於基於 `NgModule` 的應用程式，您可以使用 `@NgModule()` 或 `@Injectable()` 註解，透過 `ModuleInjector` 層級提供相依性。
</docs-callout>

### `EnvironmentInjector``

EnvironmentInjector 可使用以下兩種方式之一進行設定：

* `@Injectable()` `providedIn` 屬性用於參照 `root` 或 `platform`
* `ApplicationConfig` `providers` 陣列

<docs-callout title="Tree-shaking 和 &commat;Injectable()">

使用 `@Injectable()` `providedIn` 屬性優於使用 `ApplicationConfig` `providers` 陣列。使用 `@Injectable()` `providedIn`，最佳化工具可以執行 tree-shaking，這會移除應用程式未使用的服務。這會產生較小的捆綁大小。

Tree-shaking 對於一個函式庫特別有用，因為使用該函式庫的應用程式可能不需要注入它。

</docs-callout>

`EnvironmentInjector` 是由 `ApplicationConfig.providers` 配置的。

提供服務使用 `@Injectable()` 的 `providedIn` 如下：

<docs-code language="typescript" highlight="[4]">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // &lt;--provides this service in the root EnvironmentInjector
})
export class ItemService {
  name = 'telephone';
}

</docs-code>

`@Injectable()` 裝飾器識別服務類別。
`providedIn` 屬性配置特定的 `EnvironmentInjector`，這裡是 `root`，這會讓服務在 `root` `EnvironmentInjector` 中可用。

### ModuleInjector

在基於 `NgModule` 的應用程式中，ModuleInjector 可以使用以下兩種方式之一進行配置：

* `@Injectable()` 的 `providedIn` 屬性用來指涉 `root` 或 `platform`
* `@NgModule()` 的 `providers` 陣列

`ModuleInjector` 是由 `@NgModule.providers` 和 `NgModule.imports` 屬性配置的。`ModuleInjector` 是所有提供者陣列的扁平化，可透過遞迴追蹤 `NgModule.imports` 來取得。

當延遲載入其他 `@NgModules` 時，會建立子 `ModuleInjector` 層級。

### 平臺注入器

在 `root` 上方還有兩個注入器，一個額外的 `EnvironmentInjector` 和 `NullInjector()`。

考慮 Angular 如何在 `main.ts` 中使用以下內容引導應用程序：

<docs-code language="javascript">
bootstrapApplication(AppComponent, appConfig);
</docs-code>

`bootstrapApplication()` 方法會建立一個由 `ApplicationConfig` 實例配置的平台注入器的子注入器。
這是 `root` `EnvironmentInjector`。

`platformBrowserDynamic()` 方法會建立由 `PlatformModule` 配置的注入器，其中包含特定於平台的相依性。
這允許多個應用程式共用一個平台配置。
例如，不論您執行多少個應用程式，瀏覽器只有一個 URL 列。
您可以使用 `platformBrowser()` 函數提供 `extraProviders` 來在平台層級配置其他特定於平台的提供者。

層級中的下一個父注入器是 `NullInjector()`，它是樹的頂端。
如果您已經沿著樹向上到達頂端以致於您在 `NullInjector()` 中尋找服務，除非您使用了 `@Optional()`，否則您會收到錯誤，因為最終一切都會在 `NullInjector()` 結束，它會傳回錯誤，或者在 `@Optional()` 的情況下，傳回 `null`。
有關 `@Optional()` 的更多資訊，請參閱本指南的 [`@Optional()` 區段](#optional)。

以下圖表描述了 `root` `ModuleInjector` 和其父注入器之間的關係，如前幾段所述。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
stateDiagram-v2
    elementInjector: EnvironmentInjector\n(configured by Angular)\nhas special things like DomSanitizer => providedIn 'platform'
    rootInjector: root EnvironmentInjector\n(configured by AppConfig)\nhas things for your app => bootstrapApplication(..., AppConfig)
    nullInjector: NullInjector\nalways throws an error unless\nyou use @Optional()

    direction BT
    rootInjector --> elementInjector
    elementInjector --> nullInjector
```

雖然名稱 `root` 是特殊別名，其他 `EnvironmentInjector` 層級沒有別名。
只要建立動態載入的元件時，您就可以選擇建立 `EnvironmentInjector` 層級，例如使用路由器，它將建立子 `EnvironmentInjector` 層級。

無論您是使用傳遞給 `bootstrapApplication()` 方法的 `ApplicationConfig` 實例對其進行配置或是使用服務中的 `root` 註冊所有提供者，所有要求都會轉發至根注入器。

<docs-callout title="@Injectable() vs. ApplicationConfig">

如果你在 `bootstrapApplication` 的 `ApplicationConfig` 中配置一個應用程式範圍的提供者，它會覆寫在 `@Injectable()` 元資料中為 `root` 配置的提供者。
你可以這麼做來配置一個與多個應用程式共用的服務的非預設提供者。

以下是一個範例，其中元件路由器設定包含一個非預設的 [位置策略](/guide/routing#location-strategy)，方法是將其提供者列在 `ApplicationConfig` 的 `providers` 清單中。

```ts
providers: [
  { provide: LocationStrategy, useClass: HashLocationStrategy }
]
```

對於基於 `NgModule` 的應用程式，請在 `AppModule` `providers` 中設定應用程式範圍的提供者。

</docs-callout>

### `ElementInjector``

Angular 為每個 DOM 元素隱式建立 `ElementInjector` 層級。

在 `@Component()` 裝飾器中提供服務，使用其 `providers` 或 `viewProviders` 屬性配置 `ElementInjector`。
例如，以下 `TestComponent` 通過提供服務配置 `ElementInjector`：

<docs-code language="typescript" highlight="[3]">
@Component({
  &hellip;
  providers: [{ provide: ItemService, useValue: { name: 'lamp' } }]
})
export class TestComponent
</docs-code>

HELPFUL：參閱 [解析規則](#解析規則) 部分，以了解 `EnvironmentInjector` 樹、`ModuleInjector` 和 `ElementInjector` 樹之間的關係。

當您在元件中提供服務時，該服務可透過該元件實例的 `ElementInjector` 使用。
它也可能會在子元件/指令中顯示，具體取決於 [解析規則](#resolution-rules) 部分中描述的可見性規則。

當元件實例被銷毀時，服務實例也是如此。

#### `@Directive()` 和 `@Component()`

元件是特殊類型的指令，表示 `@Directive()` 具有 `providers` 屬性，`@Component()` 也有。
這表示指令和元件都能使用 `providers` 屬性來設定提供者。
使用 `providers` 屬性為元件或指令設定提供者時，該提供者會屬於該元件或指令的 `ElementInjector`。
相同元素上的元件和指令共用一個注入器。

## 解析規則

在為元件/指令解析代幣時，Angular 會在兩個階段解析：

1. 針對 `ElementInjector` 層級中的父代。
2. 針對 `EnvironmentInjector` 層級中的父代。

當元件宣告相依項時，Angular 會嘗試使用自己的 `ElementInjector` 來滿足該相依項。
如果元件的注入器缺少提供者，則會將要求傳遞給其父元件的 `ElementInjector`。

請求會一直轉發，直到 Angular 找到可以處理請求的注入器，或是用完祖先 `ElementInjector` 層級。

如果 Angular 在任何 `ElementInjector` 層級中找不到提供者，它會回到提出請求的元素並在 `EnvironmentInjector` 層級中尋找。
如果 Angular 仍然找不到提供者，它會擲回一個錯誤。

如果您為不同的 DI 代幣註冊了提供者，Angular 會使用它遇到的第一個來解析依賴項。
例如，如果在需要服務的元件中本地註冊了提供者，
Angular 就不會尋找同一服務的另一個提供者。

有用的：對於基於 `NgModule` 的應用程式，如果在 `ElementInjector` 層級中找不到提供者，Angular 將會搜尋 `ModuleInjector` 層級。

## 解析度修改器

`Angular` 的解析行為可以使用 `@Optional()`, `@Self()`, `@SkipSelf()` 和 `@Host()` 來修改。
從 `@angular/core` 匯入每一個，並在元件類別建構函數或注入服務時在 `inject` 組態中使用每一個。

### 修飾詞類型

決議修改器分為三類：

* Angular 找不到你正在尋找的東西，也就是 `@Optional()`
* 從哪裡開始尋找，也就是 `@SkipSelf()`
* 在哪裡停止尋找，`@Host()` 和 `@Self()`

預設情況下，Angular 總是從當前 `Injector` 開始並一直向上搜尋。
修改器允許您變更起始位置或 _self_ 位置與結束位置。

另外，您可以組合所有修飾符，但下列除外：

* `@Host()` 與 `@Self()`
* `@SkipSelf()` 與 `@Self()`.

### `@Optional()`

`@Optional()` 允許 Angular 將您注入的服務視為可選。
這樣，如果在執行期間無法解析服務，Angular 會將服務解析為 `null`，而不是擲回錯誤。
在以下範例中，服務 `OptionalService` 未提供在服務、`ApplicationConfig`、`@NgModule()` 或元件類別中，因此它在應用程式中任何位置都不可用。

<docs-code header="src/app/optional/optional.component.ts" language="typescript">
export class OptionalComponent {
  constructor(@Optional() public optional?: OptionalService) {}
}
</docs-code>

### `@Self()`

使用 `@Self()`，以便 Angular 只會查看目前元件或指令的 `ElementInjector`。

`@Self()` 的一個良好使用案例是注入服務，但前提是該服務僅在目前主機元素上可用。
若要避免此情況中的錯誤，請將 `@Self()` 與 `@Optional()` 結合使用。

例如，在以下的 `SelfComponent` 中，請注意建構函式中注入的 `LeafService`。

<docs-code header="src/app/self-no-data/self-no-data.component.ts" language="typescript"
           highlight="[7]">
@Component({
  selector: 'app-self-no-data',
  templateUrl: './self-no-data.component.html',
  styleUrls: ['./self-no-data.component.css']
})
export class SelfNoDataComponent {
  constructor(@Self() @Optional() public leaf?: LeafService) { }
}
</docs-code>

在此範例中，有一個父提供者，注入服務將會回傳值，然而，使用 `@Self()` 和 `@Optional()` 注入服務將會回傳 `null`，因為 `@Self()` 告訴注入器停止在目前主機元素中搜尋。

以下範例顯示具有 `FlowerService` 提供者的元件類別。
在這種情況下，注入器不會再進一步尋找目前的 `ElementInjector`，因為它找到了 `FlowerService` 並傳回鬱金香 &#x1F337;。

<docs-code header="src/app/self/self.component.ts" path="adev/src/content/examples/resolution-modifiers/src/app/self/self.component.ts" visibleRegion="self-component"/>

### `@SkipSelf()`

`@SkipSelf()` 與 `@Self()` 相反。
使用 `@SkipSelf()`，Angular 會從父 `ElementInjector` 開始搜尋服務，而非從目前的 `ElementInjector` 開始搜尋。
因此，如果父 `ElementInjector` 使用蕨類 &#x1F33F; 值作為 `emoji`，但您在元件的 `providers` 陣列中使用楓葉 &#x1F341;，Angular 會忽略楓葉 &#x1F341; 並使用蕨類 &#x1F33F;。

要以程式碼方式查看此內容，請假設 `emoji` 的下列值是父元件正在使用的，如同此服務：

<docs-code header="src/app/leaf.service.ts" language="typescript">
export class LeafService {
  emoji = '🌿';
}
</docs-code>

想像一下在子元件中，您有一個不同的值，楓葉 &#x1F341; 但您想要使用父元件的值。
這時您會使用 `@SkipSelf()`：

<docs-code header="src/app/skipself/skipself.component.ts" language="typescript"
           highlight="[[6],[10]]">
@Component({
  selector: 'app-skipself',
  templateUrl: './skipself.component.html',
  styleUrls: ['./skipself.component.css'],
  // Angular would ignore this LeafService instance
  providers: [{ provide: LeafService, useValue: { emoji: '🍁' } }]
})
export class SkipselfComponent {
  // Use @SkipSelf() in the constructor
  constructor(@SkipSelf() public leaf: LeafService) { }
}
</docs-code>

在這種情況下，您會取得的值為 `emoji` 是蕨類 &#x1F33F;，不是楓葉 &#x1F341;。

#### `@SkipSelf()` 與 `@Optional()``

使用 `@SkipSelf()` 與 `@Optional()` 可防止值為 `null` 時出現錯誤。

在以下範例中，`Person` 服務會注入至建構函式中。
`@SkipSelf()` 告訴 Angular 跳過目前的注入器，而 `@Optional()` 將防止 `Person` 服務為 `null` 時發生錯誤。

<docs-code language="typescript">
class Person {
  constructor(@Optional() @SkipSelf() parent?: Person) {}
}
</docs-code>

### `@Host()`

<!-- TODO：移除 @Host 和 @Self 之間的歧義。 -->

`@Host()` 讓您可以指定一個元件為搜尋提供者時，注入器樹的最後一站。

即使樹中有更上層的服務實例，Angular 也不會繼續搜尋。
請按照下列方式使用 `@Host()`：

<docs-code header="src/app/host/host.component.ts" language="typescript"
           highlight="[[6],[10]]">
@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
  //  provide the service
  providers: [{ provide: FlowerService, useValue: { emoji: '🌷' } }]
})
export class HostComponent {
  // use @Host() in the constructor when injecting the service
  constructor(@Host() @Optional() public flower?: FlowerService) { }
}
</docs-code>

由於 `HostComponent` 在其建構函數中具有 `@Host()`，不論 `HostComponent` 的父級可能具有什麼 `flower.emoji` 值，`HostComponent` 都會使用鬱金香 &#x1F337;。

## 範本的邏輯結構

當您在元件類別中提供服務時，這些服務會在相對於您提供這些服務的位置和方式的 `ElementInjector` 樹中可見。

了解 Angular 範本的底層邏輯結構會為您提供配置服務的基礎，進而控制其可見性。

元件可用於範本中，如下列範例：

<docs-code language="html">
<app-root>
  <app-child></app-child>;
</app-root>
</docs-code>

HELPFUL：通常，您會在個別檔案中宣告元件及其範本。
為了了解注入系統如何運作，從組合邏輯樹的角度來看它們很有用。
術語「邏輯」將它與渲染樹（即應用程式的 DOM 樹）區分開來。
為了標記元件範本所在的位置，本指南使用了實際上並不存在於渲染樹中，且僅出於心智模型目的而存在的偽元素 `<#VIEW>`。

以下是在單一邏輯樹中結合 `<app-root>` 與 `<app-child>` 視圖樹的範例：

<docs-code language="html">
<app-root>
  <#VIEW>
    <app-child>
     <#VIEW>
       &hellip;content goes here&hellip;
     </#VIEW>
    </app-child>
  <#VIEW>
<app-root>
</docs-code>

了解 `<#VIEW>` 界線的概念在您於元件類別中配置服務時特別重要。

## 範例：在 `@Component()` 中提供服務`

您使用 `@Component()`（或 `@Directive()`）裝飾器提供服務的方式決定了它們的可見性。
以下各節說明了 `providers` 和 `viewProviders`，以及使用 `@SkipSelf()` 和 `@Host()` 修改服務可見性的方法。

元件類別可以透過兩種方式提供服務：

| 陣列                       | 詳細 |
|:---                          |:---     |
| 具有 `providers` 陣列     | `@Component({ providers: [SomeService] })`     |
| 具有 `viewProviders` 陣列 | `@Component({ viewProviders: [SomeService] })` |

在下列範例中，您將看到 Angular 應用程式的邏輯樹狀結構。
為了說明注入器在範本的內容中如何運作，邏輯樹狀結構將代表該應用的 HTML 結構。
例如，邏輯樹狀結構將顯示 `<child-component>` 是 `<parent-component>` 的直接子項。

在邏輯樹中，您會看到特殊屬性：`@Provide`、`@Inject` 和 `@ApplicationConfig`。
這些都不是真正的屬性，但用來演示幕後發生的事情。

| Angular service 屬性                                                                                          | 詳細資料 |
|:---                                                                                                                |:---     |
| `@Inject(Token)=>Value`     | 如果在邏輯樹的這個位置注入 `Token`，其值會是 `Value`。     |
| `@Provide(Token=Value)`     | 表示在邏輯樹的這個位置以 `Value` 提供 `Token`。        |
| `@ApplicationConfig` | 說明應該在這個位置使用備用 `EnvironmentInjector`。          |

### 範例應用程式結構

範例應用程式有一個在 `root` 中提供的 `FlowerService`，其 `emoji` 值為紅色扶桑 &#x1F33A;。

<docs-code header="src/app/flower.service.ts" language="typescript">
@Injectable({
  providedIn: 'root'
})
export class FlowerService {
  emoji = '🌺';
}
</docs-code>

考慮僅具備 `AppComponent` 和 `ChildComponent` 的應用程式。
最基本的已呈現檢視看起來會像下列的巢狀 HTML 元素：

<docs-code language="html">

&lt;app-root&gt; &lt;!-- AppComponent selector --&gt;
  &lt;app-child&gt; &lt;!-- ChildComponent selector --&gt;
  &lt;/app-child&gt;
&lt;/app-root&gt;

</docs-code>

然而，在幕後，Angular 在解析注入請求時會使用邏輯檢視表示，如下所示：

<docs-code language="html">
&lt;app-root&gt; &lt;!-- AppComponent selector --&gt;
  &lt;#VIEW&gt;
    &lt;app-child&gt; &lt;!-- ChildComponent selector --&gt;
      &lt;#VIEW&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;
</docs-code>

此處的 `<#VIEW>` 代表範本的實例。
注意每個元件都有自己的 `<#VIEW>`。

了解此結構可以讓您了解如何提供並注入您的服務，並讓您完全控制服務的可見性。

現在，考慮 `<app-root>` 注入 `FlowerService`：

<docs-code header="src/app/app.component.ts" language="typescript">
export class AppComponent  {
  constructor(public flower: FlowerService) {}
}
</docs-code>

將繫結新增至 `<app-root>` 範本以視覺化結果：

<docs-code header="src/app/app.component.html" language="html">
<p>Emoji from FlowerService: {{flower.emoji}}</p>
</docs-code>

檢視中的輸出結果會是：

<docs-code language="shell">
Emoji from FlowerService: &#x1F33A;
</docs-code>

在邏輯樹中，這將表示如下：

<docs-code language="html" highlight="[[1],[2],[4]]">
&lt;app-root @ApplicationConfig
        &commat;Inject(FlowerService) flower=&gt;"&#x1F33A;"&gt;
  &lt;#VIEW&gt;
    &lt;p&gt;Emoji from FlowerService: {{flower.emoji}} (&#x1F33A;)&lt;/p&gt;
    &lt;app-child&gt;
      &lt;#VIEW&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

當 `<app-root>` 請求 `FlowerService` 時，injector 的工作是解析 `FlowerService` 令牌。
令牌的解析分為兩個階段：

1. 注入器會確定邏輯樹中的起始位置和搜尋的結束位置。
    注入器從起始位置開始，並在邏輯樹中的每個檢視層級尋找代號。
    如果找到代號，則會傳回。

1. 如果找不到代號，則注入器會尋找最近的父項 `EnvironmentInjector` 來委派要求。

在範例案例中，約束條件為：

1. 從屬於 `<app-root>` 的 `<#VIEW>` 開始，以 `<app-root>` 結束。

    * 通常搜尋的起點是在注入點。
        然而，在這個情況下 `<app-root>` 是元件。`@Component` 很特別，在於它們也包含自己的 `viewProviders`，這就是為什麼搜尋會從屬於 `<app-root>` 的 `<#VIEW>` 開始。
        這不會是與相同位置匹配的指令的情況。
    * 結束位置碰巧與元件本身相同，因為它是此應用程式最上層的元件。

1. 由 `ApplicationConfig` 提供的 `ElementInjector` 在無法在 `ElementInjector` 層級結構中找到注入權杖時，會充當後備注入器。

### 使用 `providers` 陣列

現在，在 `ChildComponent` 類別中，新增一個 `FlowerService` 的提供者來示範在即將到來的區段中更複雜的解析規則：

<docs-code header="src/app/child.component.ts" language="typescript"
           highlight="[[5,6],[10]]">
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  // use the providers array to provide a service
  providers: [{ provide: FlowerService, useValue: { emoji: '🌻' } }]
})
export class ChildComponent {
  // inject the service
  constructor( public flower: FlowerService) { }
}
</docs-code>

現在 `FlowerService` 在 `@Component()` 裝飾器中提供，當 `<app-child>` 要求服務時，注入器只需查看 `<app-child>` 中的 `ElementInjector`。
它不必繼續透過注入器樹進行搜尋。

下一步是為 `ChildComponent` 範本新增一個繫結。

<docs-code header="src/app/child.component.html" language="html">
<p>Emoji from FlowerService: {{flower.emoji}}</p>
</docs-code>

若要呈現新值，請將 `<app-child>` 加入 `AppComponent` 範本的底部，如此一來，檢視也會顯示向日葵：

<docs-code language="shell">
Child Component
Emoji from FlowerService: &#x1F33B;
</docs-code>

在邏輯樹中，這表示如下：

<docs-code language="html">

&lt;app-root @ApplicationConfig
        &commat;Inject(FlowerService) flower=&gt;"&#x1F33A;"&gt;
  &lt;#VIEW&gt;
    &lt;p&gt;Emoji from FlowerService: {{flower.emoji}} (&#x1F33A;)&lt;/p&gt;
    &lt;app-child &commat;Provide(FlowerService="&#x1F33B;")
               &commat;Inject(FlowerService)=&gt;"&#x1F33B;"&gt; &lt;!-- search ends here --&gt;
      &lt;#VIEW&gt; &lt;!-- search starts here --&gt;
        &lt;h2&gt;Child Component&lt;/h2&gt;
        &lt;p&gt;Emoji from FlowerService: {{flower.emoji}} (&#x1F33B;)&lt;/p&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

當 `<app-child>` 要求 `FlowerService` 時，注入器會從屬於 `<app-child>` 的 `<#VIEW>` 開始搜尋（包含 `<#VIEW>`，因為它來自 `@Component()` 的注入），並以 `<app-child>` 結束。

在這個案例中，`FlowerService` 在 `<app-child>` 的 `providers` 陣列中以向日葵 &#x1F33B; 解析。

注入器不需要在注入器樹中再繼續尋找。

一旦它找到 `FlowerService`，它就會停止，而永遠不會看到紅色芙蓉 &#x1F33A;。

### 使用 `viewProviders` 陣列

使用 `viewProviders` 陣列作為在 `@Component()` 裝飾器中提供服務的另一種方式。
使用 `viewProviders` 使服務在 `<#VIEW>` 中可見。

HELPFUL: 步驟與使用 `providers` 陣列相同，但使用 `viewProviders` 陣列例外。

有關逐步說明，請繼續閱讀本節。
如果您能自行設定，請跳到 [修改服務可用性](#提供的權杖可見性)。

為了示範，我們正在建立一個 `AnimalService` 來示範 `viewProviders`。
首先，建立一個具有鯨魚 &#x1F433; emoji 屬性的 `AnimalService`：

<docs-code header="src/app/animal.service.ts" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  emoji = '🐳';
}
</docs-code>

按照與 `FlowerService` 相同的模式，在 `AppComponent` 類別中注入 `AnimalService`：

<docs-code header="src/app/app.component.ts" language="typescript" highlight="[4]">
export class AppComponent {
  constructor(
    public flower: FlowerService,
    public animal: AnimalService) {}
}
</docs-code>

HELPFUL：您可以保留所有 `FlowerService` 相關程式碼，因為它將允許與 `AnimalService` 進行比較。

加入 `viewProviders` 陣列並在 `<app-child>` 類別中注入 `AnimalService`，但給予 `emoji` 不同的值。
在此，值為 dog &#x1F436;。

<docs-code header="src/app/child.component.ts" language="typescript"
           highlight="[[7],[11]]">
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css'],
  // provide services
  providers: [{ provide: FlowerService, useValue: { emoji: '🌻' } }],
  viewProviders: [{ provide: AnimalService, useValue: { emoji: '🐶' } }]
})
export class ChildComponent {
  // inject service
  constructor( public flower: FlowerService, public animal: AnimalService) { }
...
}
</docs-code>

將繫結新增到 `ChildComponent` 和 `AppComponent` 範本。
在 `ChildComponent` 範本中，新增下列繫結：

<docs-code header="src/app/child.component.html" language="html">
<p>Emoji from AnimalService: {{animal.emoji}}</p>
</docs-code>

此外，將相同內容新增到 `AppComponent` 範本：

<docs-code header="src/app/app.component.html" language="html">
<p>Emoji from AnimalService: {{animal.emoji}}</p>s
</docs-code>

現在您應該會在瀏覽器中看到兩個值：

<docs-code hideCopy language="shell">

AppComponent
Emoji from AnimalService: &#x1F433;

Child Component
Emoji from AnimalService: &#x1F436;

</docs-code>

`viewProviders` 此範例邏輯樹如下：

<docs-code language="html">

&lt;app-root @ApplicationConfig
         &commat;Inject(AnimalService) animal=&gt;"&#x1F433;"&gt;
  &lt;#VIEW&gt;
    &lt;app-child&gt;
      &lt;#VIEW &commat;Provide(AnimalService="&#x1F436;")
            &commat;Inject(AnimalService=&gt;"&#x1F436;")&gt;
       &lt;!-- ^^using viewProviders means AnimalService is available in &lt;#VIEW&gt;--&gt;
       &lt;p&gt;Emoji from AnimalService: {{animal.emoji}} (&#x1F436;)&lt;/p&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

就像 `FlowerService` 範例中一樣，`AnimalService` 在 `<app-child>` `@Component()` 裝飾器中提供。
這表示因為注入器首先在元件的 `ElementInjector` 中尋找，所以它會找到狗的 `AnimalService` 值 &#x1F436;。
它不需要繼續搜尋 `ElementInjector` 樹狀結構，也不需要搜尋 `ModuleInjector`。

### `providers` 和 `viewProviders`

html
<ng-template #myTemplate>
  <app-component></app-component>
</ng-template>

<ng-container [ngTemplateOutlet]="myTemplate"></ng-container>


@Component({
  selector: 'app-component',
  providers: [MyService],
  template: `...`
})
export class AppComponent {}

@Component({
  selector: 'app-parent',
  viewProviders: [MyService],
  template: `<ng-template #myTemplate>
                <app-component></app-component>
              </ng-template>

              <ng-container [ngTemplateOutlet]="myTemplate"></ng-container>`
})
export class AppParentComponent {}


@Component({
  selector: 'app-component',
  providers: [MyService],
  template: `...`
})
export class AppComponent {}

@Component({
  selector: 'app-parent',
  template: `<ng-template #myTemplate>
                <app-component></app-component>
              </ng-template>

              <ng-container [ngTemplateOutlet]="myTemplate"></ng-container>`
})
export class AppParentComponent {}

`viewProviders` 欄位在概念上與 `providers` 相似，但有一個顯著的差異。
在 `viewProviders` 中設定的提供者對於最終成為元件邏輯子項目的投影內容不可見。

要了解使用 `providers` 和 `viewProviders` 的差異，請在範例中新增另一個元件，並將其稱為 `InspectorComponent`。
`InspectorComponent` 將會是 `ChildComponent` 的子元件。
在 `inspector.component.ts` 中，在建構函式中注入 `FlowerService` 和 `AnimalService`：

<docs-code header="src/app/inspector/inspector.component.ts" language="typescript">
export class InspectorComponent {
  constructor(public flower: FlowerService, public animal: AnimalService) { }
}
</docs-code>

您不需要 `providers` 或 `viewProviders` 陣列。
接下來，在 `inspector.component.html` 中，新增與先前元件相同的標記：

<docs-code header="src/app/inspector/inspector.component.html" language="html">
<p>Emoji from FlowerService: {{flower.emoji}}</p>
<p>Emoji from AnimalService: {{animal.emoji}}</p>
</docs-code>

切記將 `InspectorComponent` 新增至 `ChildComponent` 的 `imports` 陣列中。

<docs-code header="src/app/child/child.component.ts" language="typescript"
           highlight="[3]">
@Component({
  ...
  imports: [InspectorComponent]
})

</docs-code>

接著，將下列內容新增至 `child.component.html`：

<docs-code header="src/app/child/child.component.html" language="html"
           highlight="[3,9]">
...

<div class="container">
  <h3>Content projection</h3>
  <ng-content></ng-content>
</div>
<h3>Inside the view</h3>

<app-inspector></app-inspector>
</docs-code>

`<ng-content>` 允許您投影內容，而 `ChildComponent` 模板中的 `<app-inspector>` 使 `InspectorComponent` 成為 `ChildComponent` 的子元件。

接下來，將下列內容新增至 `app.component.html` 以利用內容投影。

<docs-code header="src/app/app.component.html" language="html" highlight="[2]">
<app-child>
  <app-inspector></app-inspector>
</app-child>
</docs-code>

瀏覽器現在呈現以下結果，為簡潔起見，省略了之前的範例：

<docs-code hideCopy language="shell">
...
Content projection

Emoji from FlowerService: &#x1F33B;
Emoji from AnimalService: &#x1F433;

Emoji from FlowerService: &#x1F33B;
Emoji from AnimalService: &#x1F436;

</docs-code>

以下四種繫結方式展示了 `providers` 與 `viewProviders` 的差異。
請記住，狗的表情符號 &#x1F436; 是在 `ChildComponent` 的 `<#VIEW>` 中宣告，並且不適用於投影內容。
相反地，投影內容會看到鯨魚 &#x1F433;。

然而，在下一節輸出部分中，`InspectorComponent` 是 `ChildComponent` 的實際子元件，`InspectorComponent` 位於 `<#VIEW>` 中，因此當它要求 `AnimalService` 時，它看到狗 &#x1F436;。

邏輯樹中的 `AnimalService` 看起來像這樣：

<docs-code language="html">

&lt;app-root @ApplicationConfig
         &commat;Inject(AnimalService) animal=&gt;"&#x1F433;"&gt;
  &lt;#VIEW&gt;
    &lt;app-child&gt;
      &lt;#VIEW &commat;Provide(AnimalService="&#x1F436;")
            &commat;Inject(AnimalService=&gt;"&#x1F436;")&gt;
        &lt;!-- ^^using viewProviders means AnimalService is available in &lt;#VIEW&gt;--&gt;
        &lt;p&gt;Emoji from AnimalService: {{animal.emoji}} (&#x1F436;)&lt;/p&gt;

        &lt;div class="container"&gt;
          &lt;h3&gt;Content projection&lt;/h3&gt;
          &lt;app-inspector &commat;Inject(AnimalService) animal=&gt;"&#x1F433;"&gt;
            &lt;p&gt;Emoji from AnimalService: {{animal.emoji}} (&#x1F433;)&lt;/p&gt;
          &lt;/app-inspector&gt;
        &lt;/div&gt;

        &lt;app-inspector&gt;
          &lt;#VIEW &commat;Inject(AnimalService) animal=&gt;"&#x1F436;"&gt;
            &lt;p&gt;Emoji from AnimalService: {{animal.emoji}} (&#x1F436;)&lt;/p&gt;
          &lt;/#VIEW&gt;
        &lt;/app-inspector&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;

&lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

`<app-inspector>` 的預期內容看到鯨魚 &#x1F433;，而不是狗 &#x1F436;，因為狗 &#x1F436; 在 `<app-child>` `<#VIEW>` 內部。
如果 `<app-inspector>` 也在 `<#VIEW>` 內部，它才能看到狗 &#x1F436;。

### 提供的令牌的能見度

能見度裝飾器會影響在邏輯樹中搜尋注入程式碼的開始與結束位置。
為此，請在注入點，也就是 `constructor()`，而非宣告點，放置能見度裝飾器。

如要變更 injector 開始尋找 `FlowerService` 的位置，請將 `@SkipSelf()` 加入 `<app-child>` `@Inject` 宣告中，其中已注入 `FlowerService`。
此宣告位於 `<app-child>` 建構函式中，如下所示：

<docs-code language="typescript">
constructor(@SkipSelf() public flower: FlowerService) { }
</docs-code>

使用 `@SkipSelf()`，`<app-child>` 注入器不會在自身尋找 `FlowerService`。
相反地，注入器會從 `<app-root>` 的 `ElementInjector` 開始尋找 `FlowerService`，但找不到任何東西。
然後，它會回溯到 `<app-child>` 的 `ModuleInjector` 並找到紅色扶桑花 &#x1F33A; 的值，這個值可用是因為 `<app-child>` 和 `<app-root>` 共享同一個 `ModuleInjector`。
使用者介面會顯示以下內容：

<docs-code hideCopy language="shell">

Emoji from FlowerService: &#x1F33A;

</docs-code>

在邏輯樹中，這個想法看起來可能是這樣：

<docs-code language="html">

&lt;app-root @ApplicationConfig
        &commat;Inject(FlowerService) flower=&gt;"&#x1F33A;"&gt;
  &lt;#VIEW&gt;
    &lt;app-child &commat;Provide(FlowerService="&#x1F33B;")&gt;
      &lt;#VIEW &commat;Inject(FlowerService, SkipSelf)=&gt;"&#x1F33A;"&gt;
        &lt;!-- With SkipSelf, the injector looks to the next injector up the tree (app-root) --&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

儘管 `<app-child>` 提供了向日葵 &#x1F33B;，但應用程式會呈現紅色扶桑 &#x1F33A;，因為 `@SkipSelf()` 會導致目前的注入器 (`app-child`) 跳過它自己，並查看其父級。

如果現在加入 `@Host()`（除了 `@SkipSelf()`），結果將會是 `null`。
這是因為 `@Host()` 將搜尋的上界限制在 `app-child` `<#VIEW>`。
以下是在邏輯樹中的想法：

<docs-code language="html">

&lt;app-root @ApplicationConfig
        &commat;Inject(FlowerService) flower=&gt;"&#x1F33A;"&gt;
  &lt;#VIEW&gt; &lt;!-- end search here with null--&gt;
    &lt;app-child &commat;Provide(FlowerService="&#x1F33B;")&gt; &lt;!-- start search here --&gt;
      &lt;#VIEW &commat;Inject(FlowerService, &commat;SkipSelf, &commat;Host, &commat;Optional)=&gt;null&gt;
      &lt;/#VIEW&gt;
      &lt;/app-parent&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

在這裡，服務和其值相同，但 `@Host()` 會阻止注入器進一步在 `<#VIEW>` 中尋找 `FlowerService`，因此它找不到並傳回 `null`。

### `@SkipSelf()` 和 `viewProviders`

請記住，`<app-child>` 在 `viewProviders` 陣列中提供 `AnimalService`，其值為 dog &#x1F436;。
由於注入器只需要在 `<app-child>` 的 `ElementInjector` 中尋找 `AnimalService`，因此它永遠不會看到 whale &#x1F433;。

如在 `FlowerService` 範例中，如果在 `AnimalService` 的建構函數中加入 `@SkipSelf()`，注入器將不會在當前 `<app-child>` 的 `ElementInjector` 中尋找 `AnimalService`。
相反地，注入器將從 `<app-root>` `ElementInjector` 開始。

<docs-code language="typescript" highlight="[6]">
@Component({
  standalone: true,
  selector: 'app-child',
  &hellip;
  viewProviders: [
    { provide: AnimalService, useValue: { emoji: '&#x1F436;' } },
  ],
})
</docs-code>

當 `<app-child>` 中有 `@SkipSelf()` 時，邏輯樹看起來像這樣：

<docs-code language="html">

&lt;app-root @ApplicationConfig
          &commat;Inject(AnimalService=&gt;"&#x1F433;")&gt;
  &lt;#VIEW&gt;&lt;!-- search begins here --&gt;
    &lt;app-child&gt;
      &lt;#VIEW &commat;Provide(AnimalService="&#x1F436;")
             &commat;Inject(AnimalService, SkipSelf=&gt;"&#x1F433;")&gt;
        &lt;!--Add &commat;SkipSelf --&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

在 `<app-child>` 中使用 `@SkipSelf()`，injector 開始在 `<app-root>` `ElementInjector` 中搜尋 `AnimalService`，並找到鯨魚 &#x1F433;。

### `@Host()` 和 `viewProviders`

如果你只為 `AnimalService` 的注入使用 `@Host()`，結果是狗 &#x1F436; 因為注入器在 `<app-child>` `<#VIEW>` 本身中找到 `AnimalService`。
`ChildComponent` 設定 `viewProviders`，以便將狗的表情符號提供為 `AnimalService` 值。
你也可以在建構函數中看到 `@Host()`：

<docs-code language="typescript" highlight="[[6],[10]]">
@Component({
  standalone: true
  selector: 'app-child',
  &hellip;
  viewProviders: [
    { provide: AnimalService, useValue: { emoji: '&#x1F436;' } },
  ]
})
export class ChildComponent {
  constructor(@Host() public animal: AnimalService) { }
}
</docs-code>

`@Host() 會導致注入器尋找直到遇到 `<#VIEW>` 的邊緣。

<docs-code language="html">

&lt;app-root @ApplicationConfig
          &commat;Inject(AnimalService=&gt;"&#x1F433;")&gt;
  &lt;#VIEW&gt;
    &lt;app-child&gt;
      &lt;#VIEW &commat;Provide(AnimalService="&#x1F436;")
             &commat;Inject(AnimalService, &commat;Host=&gt;"&#x1F436;")&gt; &lt;!-- &commat;Host stops search here --&gt;
      &lt;/#VIEW&gt;
    &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

將包含第三種動物，刺蝟 &#x1F994; 的 `viewProviders` 陣列，新增至 `app.component.ts` `@Component()` 的元資料：

<docs-code language="typescript" highlight="[7]">
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  viewProviders: [
    { provide: AnimalService, useValue: { emoji: '&#x1F994;' } },
  ],
})

</docs-code>

接下來，將 `@SkipSelf()` 與 `@Host()` 一起加入 `child.component.ts` 中 `AnimalService` 注入的建構函式。
以下是在 `<app-child>` 建構函式中的 `@Host()` 和 `@SkipSelf()`：

<docs-code language="typescript" highlight="[4]">
export class ChildComponent {

constructor(
    @Host() @SkipSelf() public animal: AnimalService) { }
}

</docs-code>

<!-- TODO：這需要重新整理。這裡似乎沒有很好地解釋 `viewProviders`/`injectors` 是什麼，以及 `@Host()` 如何運作。
 -->

當將 `@Host()` 和 `@SkipSelf()` 套用到 `providers` 陣列中的 `FlowerService` 時，結果會是 `null`，因為 `@SkipSelf()` 會從 `<app-child>` 注入器開始搜尋，而 `@Host()` 會在 `<#VIEW>` 停止搜尋，也就是沒有 `FlowerService` 的地方。在邏輯樹中，您可以看到 `FlowerService` 在 `<app-child>` 中可見，而非在 `<#VIEW>` 中可見。

然而，在 `AppComponent` `viewProviders` 陣列中提供的 `AnimalService` 是可見的。

邏輯樹表示法顯示原因如下：

<docs-code language="html">

&lt;app-root @ApplicationConfig
        &commat;Inject(AnimalService=&gt;"&#x1F433;")&gt;
  &lt;#VIEW &commat;Provide(AnimalService="&#x1F994;")
         &commat;Inject(AnimalService, &commat;Optional)=&gt;"&#x1F994;"&gt;
    &lt;!-- ^^&commat;SkipSelf() starts here,  &commat;Host() stops here^^ --&gt;
    &lt;app-child&gt;
      &lt;#VIEW &commat;Provide(AnimalService="&#x1F436;")
             &commat;Inject(AnimalService, &commat;SkipSelf, &commat;Host, &commat;Optional)=&gt;"&#x1F994;"&gt;
               &lt;!-- Add &commat;SkipSelf ^^--&gt;
      &lt;/#VIEW&gt;
      &lt;/app-child&gt;
  &lt;/#VIEW&gt;
&lt;/app-root&gt;

</docs-code>

`@SkipSelf()，會讓 injector 從 `<app-root>` 開始尋找 `AnimalService`，而不是請求發出的 `<app-child>`，而 `@Host()` 會在 `<app-root>` `<#VIEW>` 停止搜尋。

由於 `AnimalService` 是透過 `viewProviders` 陣列提供的，injector 在 `<#VIEW>` 中找到刺蝟 &#x1F994;。

## 範例：`ElementInjector` 使用案例

能夠在不同層級配置一個或多個提供者，開啟了有用的可能性。

### 情境：服務隔離

基於架構的原因，可能會導致你將服務的存取權限限制在它所屬的應用程式網域。
例如，考慮我們建立一個 `VillainsListComponent` 來顯示惡棍清單。
它從 `VillainsService` 取得這些惡棍。

如果您在根 `AppModule` 中提供 `VillainsService`，它將使 `VillainsService` 在應用程式中的任何地方都可見。
如果您之後修改 `VillainsService`，您可能會損壞其他元件中的某些內容，這些元件開始依賴此服務而意外發生。

相反，您應在 `VillainsListComponent` 的 `providers` 元數據中提供 `VillainsService`，如下所示：

<docs-code header="src/app/villains-list.component.ts (metadata)" language="typescript"
           highlight="[4]">
@Component({
  selector: 'app-villains-list',
  templateUrl: './villains-list.component.html',
  providers: [VillainsService]
})
export class VillainsListComponent {}
</docs-code>

在 `VillainsListComponent` 元資料中提供 `VillainsService`，而其他地方都沒有提供，此服務僅在 `VillainsListComponent` 及其子元件樹中可用。

`VillainService` 就 `VillainsListComponent` 而言是單例，因為這是宣告它的位置。
只要 `VillainsListComponent` 沒有被銷毀，它就會是 `VillainService` 的同一個執行個體，但如果有多個 `VillainsListComponent` 執行個體，則 `VillainsListComponent` 的每個執行個體都會有它自己的 `VillainService` 執行個體。

### 場景：多個編輯階段

許多應用程式允許使用者同時處理多個開啟的工作。
例如，在稅務申報應用程式中，申報人可以處理多份稅務申報表，並在一天內從一份切換到另一份。

為了說明該情境，想像一個顯示超級英雄清單的 `HeroListComponent`。

若要開啟英雄報稅表，準備人員會點擊英雄姓名，這會開啟一個用於編輯該報稅表的元件。
每個選取的英雄報稅表都會在自己的元件中開啟，而且可以同時開啟多個報稅表。

每個稅務申報元件都具有下列特徵：

* 具有其自己的報稅申報單編輯階段
* 可以更改報稅申報單，而不會影響另一個元件的申報單
* 具備將變更內容儲存到其報稅申報單或取消變更的能力

假設 `HeroTaxReturnComponent` 具有管理和還原變更的邏輯。
這將是英雄報稅表的簡單任務。
在現實世界中，使用豐富的報稅數據模型，變更管理會很棘手。
您可以將該管理委派給輔助服務，如本範例所示。

`HeroTaxReturnService`快取單一`HeroTaxReturn`，追蹤該報稅單的變更，並可以儲存或還原它。
它也會委派給應用程式範圍的單例`HeroService`，它會透過注入取得。

<docs-code header="src/app/hero-tax-return.service.ts" language="typescript">
import { Injectable } from '@angular/core';
import { HeroTaxReturn } from './hero';
import { HeroesService } from './heroes.service';

@Injectable()
export class HeroTaxReturnService {
  private currentTaxReturn!: HeroTaxReturn;
  private originalTaxReturn!: HeroTaxReturn;

constructor(private heroService: HeroesService) {}

set taxReturn(htr: HeroTaxReturn) {
    this.originalTaxReturn = htr;
    this.currentTaxReturn  = htr.clone();
  }

get taxReturn(): HeroTaxReturn {
    return this.currentTaxReturn;
  }

restoreTaxReturn() {
    this.taxReturn = this.originalTaxReturn;
  }

saveTaxReturn() {
    this.taxReturn = this.currentTaxReturn;
    this.heroService.saveTaxReturn(this.currentTaxReturn).subscribe();
  }
}
</docs-code>

以下為使用 `HeroTaxReturnService` 的 `HeroTaxReturnComponent`。

<docs-code header="src/app/hero-tax-return.component.ts" language="typescript">
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeroTaxReturn } from './hero';
import { HeroTaxReturnService } from './hero-tax-return.service';

@Component({
  selector: 'app-hero-tax-return',
  templateUrl: './hero-tax-return.component.html',
  styleUrls: [ './hero-tax-return.component.css' ],
  providers: [ HeroTaxReturnService ]
})
export class HeroTaxReturnComponent {
  message = '';

@Output() close = new EventEmitter<void>();

get taxReturn(): HeroTaxReturn {
    return this.heroTaxReturnService.taxReturn;
  }

@Input()
  set taxReturn(htr: HeroTaxReturn) {
    this.heroTaxReturnService.taxReturn = htr;
  }

constructor(private heroTaxReturnService: HeroTaxReturnService) {}

onCanceled()  {
    this.flashMessage('Canceled');
    this.heroTaxReturnService.restoreTaxReturn();
  }

onClose() { this.close.emit(); }

onSaved() {
    this.flashMessage('Saved');
    this.heroTaxReturnService.saveTaxReturn();
  }

flashMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 500);
  }
}
</docs-code>

`@Input()` 屬性會傳入 _tax-return-to-edit_，此屬性會以 getter 和 setter 實作。
setter 會使用傳入的申報單初始化元件本身的 `HeroTaxReturnService` 實例。
getter 始終會傳回該服務所述的英雄目前狀態。
元件也會要求該服務儲存並還原此報稅申報單。

如果服務是應用程式範圍的單例，則這將無法運作。
每個元件都會共用相同的服務實例，而每個元件都會覆寫屬於另一位英雄的退稅。

為防止這種情況，請使用元件資料中的 `providers` 屬性，將 `HeroTaxReturnComponent` 的元件層級注入器設定為提供服務。

<docs-code header="src/app/hero-tax-return.component.ts (providers)" language="typescript">
providers: [HeroTaxReturnService]
</docs-code>

`HeroTaxReturnComponent` 有自己的 `HeroTaxReturnService` 提供者。
請記住，每個元件_執行個體_都有自己的注入器。
在元件層級提供服務可確保元件的_每個_執行個體都取得該服務的私人執行個體。這可確保不會覆寫任何報稅單。

有用的：情境程式碼的其餘部分依賴其他 Angular 功能和技術，您可以在文件中的其他地方瞭解這些功能和技術。

### 情境：專門供應商

提供服務的另一個原因是再次在另一個層級中提供服務，以在元件樹中更深處替代該服務的_更專業_實作。

例如，考慮一個包括輪胎服務資訊，並依賴其他服務來提供更多汽車詳細資訊的 `Car` 元件。

根部注入器，標記為 (A)，使用 _generic_ 提供者，以獲取關於 `CarService` 和 `EngineService` 的詳細資訊。

1. `Car` 元件 (A)。元件 (A) 顯示汽車的輪胎服務數據，並指定一般服務以提供有關汽車的更多資訊。

2. 子元件 (B)。元件 (B) 定義其自己的 _專業_ 提供者，以支援 `CarService` 和 `EngineService`，這些提供者具有適合元件 (B) 中所發生事件的特殊功能。

3. 子元件 (C) 作為元件 (B) 的子項。元件 (C) 定義其自己的 _更專業_ 提供者，以支援 `CarService`。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph TD;
subgraph COMPONENT_A[Component A]
subgraph COMPONENT_B[Component B]
COMPONENT_C[Component C]
end
end

style COMPONENT_A fill:#BDD7EE
style COMPONENT_B fill:#FFE699
style COMPONENT_C fill:#A9D18E,color:#000
classDef noShadow filter:none
class COMPONENT_A,COMPONENT_B,COMPONENT_C noShadow
```

在幕後，每個元件都會設定自己的注入器，其中定義了該元件本身的零個、一個或多個提供者。

當你在最深層的元件 (C) 解析 `Car` 的實例時，它的注入器會產生：

* `Car` 的一個實例由注入器解析 (C)
* `Engine` 由注入器解析 (B)
* 它的 `Tires` 由根注入器解析 (A)。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
graph BT;

subgraph A[" "]
direction LR
RootInjector["(A) RootInjector"]
ServicesA["CarService, EngineService, TiresService"]
end

subgraph B[" "]
direction LR
ParentInjector["(B) ParentInjector"]
ServicesB["CarService2, EngineService2"]
end

subgraph C[" "]
direction LR
ChildInjector["(C) ChildInjector"]
ServicesC["CarService3"]
end

direction LR
car["(C) Car"]
engine["(B) Engine"]
tires["(A) Tires"]

direction BT
car-->ChildInjector
ChildInjector-->ParentInjector-->RootInjector

class car,engine,tires,RootInjector,ParentInjector,ChildInjector,ServicesA,ServicesB,ServicesC,A,B,C noShadow
style car fill:#A9D18E,color:#000
style ChildInjector fill:#A9D18E,color:#000
style engine fill:#FFE699,color:#000
style ParentInjector fill:#FFE699,color:#000
style tires fill:#BDD7EE,color:#000
style RootInjector fill:#BDD7EE,color:#000
```

## 更多有關依賴注入的內容

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="DI 供應商"/>
</docs-pill-row>
