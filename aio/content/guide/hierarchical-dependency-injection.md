# 階層式注入器

Angular 的注入器有一套規則，你可以善用它來達成應用程式中 injectable 所需的可見度。
了解這些規則後，你就能判斷應該在哪個 NgModule、Component 或 Directive 中宣告提供者。

## 兩種注入器階層

Angular 有兩種注入器階層：

1. `ModuleInjector` 階層——使用 `@NgModule()` 或 `@Injectable()` 註解，在這個階層中設定 `ModuleInjector`。
1. `ElementInjector` 階層——在每個 DOM 元素上隱含建立。`ElementInjector` 預設是空的，除非你在 `@Directive()` 或 `@Component()` 的 `providers` 屬性中設定它。

{@a register-providers-injectable}

### `ModuleInjector`

`ModuleInjector` 可以用下列兩種方式之一來設定：

*   使用 `@Injectable()` 的 `providedIn` 屬性指向 `@NgModule()` 或 `root`
*   使用 `@NgModule()` 的 `providers` 陣列

<div class="is-helpful alert">

<h4>Tree-shaking 與 <code>@Injectable()</code></h4>

使用 `@Injectable()` 的 `providedIn` 屬性比使用 `@NgModule()` 的 `providers` 陣列更好，因為使用 `@Injectable()` 的 `providedIn` 時，最佳化工具可以執行 tree-shaking，移除應用程式未使用的服務，讓 bundle 更小。

Tree-shaking 對函式庫特別有用，因為使用該函式庫的應用程式可能不需要注入它。
請參閱 [DI 提供者](guide/dependency-injection-providers)中的[tree-shakable 提供者](guide/dependency-injection-providers#tree-shakable-providers)，了解更多資訊。

</div>

`ModuleInjector` 由 `@NgModule.providers` 和 `NgModule.imports` 屬性設定。`ModuleInjector` 是沿著 `NgModule.imports` 遞迴追蹤可觸及的所有 providers 陣列攤平後的結果。

延遲載入其他 `@NgModules` 時，會建立子 `ModuleInjector` 階層。

請如下使用 `@Injectable()` 的 `providedIn` 屬性來提供服務：

```ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // <--provides this service in the root ModuleInjector
})
export class ItemService {
  name = 'telephone';
}

```

`@Injectable()` 裝飾器識別一個服務類別。
`providedIn` 屬性設定一個特定的 `ModuleInjector`，在這裡是 `root`，讓該服務在 `root` `ModuleInjector` 中可用。

#### 平台注入器

在 `root` 之上還有兩個注入器：一個額外的 `ModuleInjector` 與 `NullInjector()`。

想想 Angular 如何以 `main.ts` 中的以下程式碼啟動應用程式：

```javascript
platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {...})
```

`bootstrapModule()` 方法會建立平台注入器的一個子注入器，它由 `AppModule` 設定。
這就是 `root` `ModuleInjector`。

`platformBrowserDynamic()` 方法會建立一個由 `PlatformModule` 設定的注入器，其中包含平台專屬的依賴。
這讓多個應用程式可以共用一個平台設定。
例如，無論你執行多少個應用程式，瀏覽器都只有一個網址列。
你可以使用 `platformBrowser()` 函式提供 `extraProviders`，在平台層級設定額外的平台專屬提供者。

階層中的下一個父注入器是 `NullInjector()`，它是樹的頂端。
如果你一路往上找到 `NullInjector()` 還在找服務，除非你用了 `@Optional()`，否則會得到錯誤，因為最終一切都會到 `NullInjector()` 為止，而它會回傳錯誤，或者在使用 `@Optional()` 的情況下回傳 `null`。
關於 `@Optional()` 的更多資訊，請參閱本指南的 [`@Optional()` 一節](guide/hierarchical-dependency-injection#optional)。

下圖呈現了 `root` `ModuleInjector` 與其父注入器之間的關係，如前幾段所述。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/dependency-injection/injectors.svg" alt="NullInjector、ModuleInjector、根注入器">

  </div>

</figure>

雖然 `root` 這個名稱是個特殊的別名，但其他 `ModuleInjector` 階層沒有別名。
每當建立動態載入的元件時（例如使用 Router 時，它會建立子 `ModuleInjector` 階層），你都可以選擇建立 `ModuleInjector` 階層。

所有請求都會往上轉送到 root 注入器，不論你是用 `bootstrapModule()` 方法設定它，還是在各自的服務中把所有提供者都註冊為 `root`。

<div class="alert is-helpful">

<h4><code>@Injectable()</code> 與 <code>@NgModule()</code></h4>

如果你在 `AppModule` 的 `@NgModule()` 中設定一個應用程式範圍的提供者，它會覆寫在 `@Injectable()` 詮釋資料中為 `root` 設定的提供者。
你可以這樣做，為多個應用程式共用的服務設定一個非預設的提供者。

以下是一個範例：元件路由器設定透過在 `AppModule` 的 `providers` 清單中列出提供者，納入了一個非預設的[位置策略](guide/router#location-strategy)。

<code-example path="dependency-injection-in-action/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)">

</code-example>

</div>

### `ElementInjector`

Angular 會為每個 DOM 元素隱含地建立 `ElementInjector` 階層。

在 `@Component()` 裝飾器中使用它的 `providers` 或 `viewProviders` 屬性提供服務，就能設定一個 `ElementInjector`。
例如，以下 `TestComponent` 透過如下方式提供服務來設定 `ElementInjector`：

```ts
@Component({
  ...
  providers: [{ provide: ItemService, useValue: { name: 'lamp' } }]
})
export class TestComponent

```

<div class="alert is-helpful">

**注意**：<br />
請參閱[解析規則](guide/hierarchical-dependency-injection#解析規則)一節，了解 `ModuleInjector` 樹與 `ElementInjector` 樹之間的關係。

</div>

當你在元件中提供服務時，該服務可透過該元件執行個體的 `ElementInjector` 取得。
它也可能在子元件／指令中可見，取決於[解析規則](guide/hierarchical-dependency-injection#解析規則)一節所述的可見度規則。

當元件實例被銷毀時，該服務實例也會一併被銷毀。

#### `@Directive()` 與 `@Component()`

元件是指令的一種特殊類型，意思是就像 `@Directive()` 有 `providers` 屬性一樣，`@Component()` 也有。
這表示指令和元件都可以使用 `providers` 屬性來設定提供者。
當你使用 `providers` 屬性為元件或指令設定提供者時，該提供者屬於該元件或指令的 `ElementInjector`。
同一個元素上的元件和指令共用一個注入器。

{@a resolution-rules}

## 解析規則

為元件／指令解析 token 時，Angular 會分兩個階段進行：

1.  對照 `ElementInjector` 階層（它的父層）。
1.  對照 `ModuleInjector` 階層（它的父層）。

當元件宣告一個依賴時，Angular 會試圖用它自己的 `ElementInjector` 來滿足該依賴。
如果元件的注入器缺少該提供者，它會把請求往上傳給父元件的 `ElementInjector`。

請求會不斷向上轉送，直到 Angular 找到能處理該請求的注入器，或用盡所有祖先 `ElementInjector` 階層為止。

如果 Angular 在任何 `ElementInjector` 階層中都找不到提供者，它會回到請求發出的元素，在 `ModuleInjector` 階層中尋找。
如果 Angular 還是找不到提供者，它會擲出錯誤。

如果你在不同層級為同一個 DI token 註冊了提供者，Angular 遇到的第一個就是它用來解析該依賴的提供者。
例如，如果提供者在需要某個服務的元件中就地註冊，
Angular 就不會再尋找同一個服務的其他提供者。

## 解析修飾符

Angular 的解析行為可以用 `@Optional()`、`@Self()`、`@SkipSelf()` 與 `@Host()` 來修改。
請從 `@angular/core` 匯入它們，並在注入服務時，於元件類別的建構子中使用。

關於展示本節所涵蓋解析修飾詞的實際應用程式，請參閱 <live-example name="resolution-modifiers">resolution modifiers example</live-example>。

### 修飾符的類型

解析修飾符分為三類：

* 找不到你要找的東西時該怎麼做，也就是 `@Optional()`
* 從哪裡開始找，也就是 `@SkipSelf()`
* 在哪裡停止尋找，也就是 `@Host()` 和 `@Self()`

依預設，Angular 一律從目前的 `Injector` 開始，一路往上搜尋。
修飾符讓你可以改變開始（self）的位置或結束的位置。

此外，你可以組合所有的修飾詞，但 `@Host()` 與 `@Self()` 除外，當然 `@Skipself()` 與 `@Self()` 也除外。

{@a optional}

### `@Optional()`

`@Optional()` 讓 Angular 把你注入的服務視為可選的。
這樣一來，如果它在執行階段無法解析，Angular 會把該服務解析為 `null`，而不是擲出錯誤。
在下列範例中，服務 `OptionalService` 沒有在服務、`@NgModule()` 或元件類別中提供，所以在應用程式中任何地方都無法使用。

<code-example path="resolution-modifiers/src/app/optional/optional.component.ts" header="resolution-modifiers/src/app/optional/optional.component.ts" region="optional-component">

</code-example>

### `@Self()`

使用 `@Self()`，讓 Angular 只查看目前元件或指令的 `ElementInjector`。

`@Self()` 的一個很好的使用情境是注入一個服務，但前提是它在目前的宿主元素上可用。
為了在這種情況下避免錯誤，把 `@Self()` 與 `@Optional()` 組合使用。

例如，在以下的 `SelfComponent` 中，注意在建構子中被注入的 `LeafService`。

<code-example path="resolution-modifiers/src/app/self-no-data/self-no-data.component.ts" header="resolution-modifiers/src/app/self-no-data/self-no-data.component.ts" region="self-no-data-component">

</code-example>

在這個範例中，有一個父層提供者，注入該服務會傳回值；不過，用 `@Self()` 與 `@Optional()` 注入該服務會傳回 `null`，因為 `@Self()` 告訴注入器停止在目前的宿主元素中搜尋。

另一個範例顯示帶有 `FlowerService` 提供者的元件類別。
在這種情況下，注入器不需要再往別處尋找，因為它在目前的 `ElementInjector` 中就找到了 `FlowerService`，並傳回黃色的花 🌼。

<code-example path="resolution-modifiers/src/app/self/self.component.ts" header="resolution-modifiers/src/app/self/self.component.ts" region="self-component">

</code-example>

### `@SkipSelf()`

`@SkipSelf()` 與 `@Self()` 相反。
使用 `@SkipSelf()` 時，Angular 會從父 `ElementInjector` 開始搜尋服務，而不是從目前的注入器開始。
所以，如果父 `ElementInjector` 對 `emoji` 使用的是蕨類 `🌿` 值，但你在元件的 `providers` 陣列中有楓葉 `🍁`，Angular 會忽略楓葉 `🍁`，改用蕨類 `🌿`。

若要在程式碼中看到這一點，假設父元件使用的 `emoji` 值如下，如這個服務所示：

<code-example path="resolution-modifiers/src/app/leaf.service.ts" header="resolution-modifiers/src/app/leaf.service.ts" region="leafservice">

</code-example>

想像在子元件中，你有一個不同的值，楓葉 `🍁`，但你想改用父元件的值。
這時你就會用 `@SkipSelf()`：

<code-example path="resolution-modifiers/src/app/skipself/skipself.component.ts" header="resolution-modifiers/src/app/skipself/skipself.component.ts" region="skipself-component">

</code-example>

在這種情況下，你為 `emoji` 取得的值會是蕨類 `🌿`，而不是楓葉 `🍁`。

#### `@SkipSelf()` 搭配 `@Optional()`

請搭配 `@Optional()` 使用 `@SkipSelf()`，以便在值為 `null` 時避免錯誤。
在下列範例中，`Person` 服務是在建構子中注入的。
`@SkipSelf()` 告訴 Angular 略過目前的注入器，而 `@Optional()` 會在 `Person` 服務為 `null` 時避免錯誤。

``` ts
class Person {
  constructor(@Optional() @SkipSelf() parent: Person) {}
}
```

### `@Host()`

`@Host()` 讓你把某個元件指定為在注入器樹中搜尋提供者時的最後一站。
即使樹的上方還有服務執行個體，Angular 也不會繼續尋找。
請如下使用 `@Host()`：

<code-example path="resolution-modifiers/src/app/host/host.component.ts" header="resolution-modifiers/src/app/host/host.component.ts" region="host-component">

</code-example>

由於 `HostComponent` 的建構子中有 `@Host()`，不論 `HostComponent` 的父層對 `flower.emoji` 設了什麼值，`HostComponent` 都會使用黃色的花 `🌼`。

## 範本的邏輯結構

當你在元件類別中提供服務時，服務在 `ElementInjector` 樹中的可見性，取決於你提供這些服務的位置和方式。

了解 Angular 範本底層的邏輯結構，能為你設定服務、進而控制它們的可見性打下基礎。

元件在你的範本中被使用，如以下範例：

```
<app-root>
    <app-child></app-child>
</app-root>
```

<div class="alert is-helpful">

**注意**：<br />
通常，你會在不同的檔案中宣告元件及其範本。
為了理解注入系統如何運作，從合併後的邏輯樹的角度來看它們很有幫助。
邏輯這個詞是用來與算繪樹（你的應用程式 DOM 樹）區分的。
為了標示元件範本所在的位置，本指南使用 `<#VIEW>` 偽元素，它在算繪樹中實際上並不存在，只是為了建立心智模型而存在。

</div>

以下是一個範例，示範 `<app-root>` 和 `<app-child>` 的檢視樹如何合併成單一的邏輯樹：

```
<app-root>
  <#VIEW>
    <app-child>
     <#VIEW>
       ...content goes here...
     </#VIEW>
    </app-child>
  <#VIEW>
</app-root>
 ```

了解 `<#VIEW>` 分界的概念，在你於元件類別中設定服務時尤其重要。

## 在 `@Component()` 中提供服務

你如何使用 `@Component()`（或 `@Directive()`）裝飾器提供服務，決定了它們的可見度。
以下各節會示範 `providers` 與 `viewProviders`，以及用 `@SkipSelf()` 與 `@Host()` 修改服務可見度的方法。

元件類別可以用兩種方式提供服務：

1. 使用 `providers` 陣列

```typescript=
@Component({
  ...
  providers: [
    {provide: FlowerService, useValue: {emoji: '🌺'}}
  ]
})
```

2. 使用 `viewProviders` 陣列

```typescript=
@Component({
  ...
  viewProviders: [
    {provide: AnimalService, useValue: {emoji: '🐶'}}
  ]
})
```

為了了解 `providers` 與 `viewProviders` 如何以不同方式影響服務可見度，以下各節會逐步建立一個 <live-example name="providers-viewproviders"></live-example>，並在程式碼與邏輯樹中比較 `providers` 與 `viewProviders` 的使用方式。

<div class="alert is-helpful">

**注意**：<br />
在邏輯樹中，你會看到 `@Provide`、`@Inject` 與 `@NgModule`，它們不是真正的 HTML 屬性，只是用來示範底層發生了什麼事。

- `@Inject(Token)=>Value` 表示如果在邏輯樹的這個位置注入 `Token`，它的值會是 `Value`。
- `@Provide(Token=Value)` 表示在邏輯樹的這個位置，有一個值為 `Value` 的 `Token` 提供者宣告。
- `@NgModule(Token)` 表示在這個位置應該使用備援的 `NgModule` 注入器。

</div>

### 範例應用程式結構

範例應用程式有一個在 `root` 中提供的 `FlowerService`，其 `emoji` 值為紅色扶桑花 `🌺`。

<code-example path="providers-viewproviders/src/app/flower.service.ts" header="providers-viewproviders/src/app/flower.service.ts" region="flowerservice">

</code-example>

設想一個只有 `AppComponent` 與 `ChildComponent` 的應用程式。
最基本的算繪檢視會像下列巢狀 HTML 元素：

```
<app-root> <!-- AppComponent selector -->
    <app-child> <!-- ChildComponent selector -->
    </app-child>
</app-root>
```

不過，在幕後，Angular 在解析注入請求時使用如下的邏輯檢視表示法：

```
<app-root> <!-- AppComponent selector -->
    <#VIEW>
        <app-child> <!-- ChildComponent selector -->
            <#VIEW>
            </#VIEW>
        </app-child>
    </#VIEW>
</app-root>
 ```

這裡的 `<#VIEW>` 代表一個範本執行個體。
請注意，每個元件都有自己的 `<#VIEW>`。

了解這個結構，可以幫助你決定如何提供與注入服務，並讓你完全掌控服務的可見度。

現在，設想 `<app-root>` 注入 `FlowerService`：

<code-example path="providers-viewproviders/src/app/app.component.1.ts" header="providers-viewproviders/src/app/app.component.ts" region="injection">

</code-example>

在 `<app-root>` 範本中加入一個繫結，以視覺化呈現結果：

<code-example path="providers-viewproviders/src/app/app.component.html" header="providers-viewproviders/src/app/app.component.html" region="binding-flower">

</code-example>

檢視中的輸出會是：

```
Emoji from FlowerService: 🌺
```

在邏輯樹中，這表示如下：

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <p>Emoji from FlowerService: {{flower.emoji}} (🌺)</p>
    <app-child>
      <#VIEW>
      </#VIEW>
     </app-child>
  </#VIEW>
</app-root>
```

當 `<app-root>` 請求 `FlowerService` 時，注入器的工作就是解析 `FlowerService` token。token 的解析分兩個階段進行：

1.  注入器決定邏輯樹中的起始位置，以及搜尋的結束位置。注入器從起始位置開始，在邏輯樹的每一層尋找 token；如果找到 token，就將它回傳。
2.  如果找不到 token，注入器會尋找最接近的父層 `@NgModule()`，把請求委派給它。

在這個範例中，限制條件是：

1.  從屬於 `<app-root>` 的 `<#VIEW>` 開始，以 `<app-root>` 結束。

    *   通常搜尋的起點就是注入點。
        不過，在這個情況下，`<app-root>` 的 `@Component` 比較特殊，因為它們也包含自己的 `viewProviders`，所以搜尋會從屬於 `<app-root>` 的 `<#VIEW>` 開始。
        對於在相同位置比對到的指令，就不會是這樣。

    *   結束位置剛好與元件本身相同，因為它是這個應用程式中最上層的元件。

1.  當注入 token 在 `ElementInjector` 階層中找不到時，`AppModule` 會擔任備援注入器。

### 使用 `providers` 陣列

現在，在 `ChildComponent` 類別中，為 `FlowerService` 加入一個提供者，以示範後續章節中更複雜的解析規則：

<code-example path="providers-viewproviders/src/app/child/child.component.1.ts" header="providers-viewproviders/src/app/child.component.ts" region="flowerservice">

</code-example>

既然 `FlowerService` 已在 `@Component()` 裝飾器中提供，當 `<app-child>` 請求該服務時，注入器只需要找到 `<app-child>` 中的 `ElementInjector` 為止。
它不需要再沿著注入器樹繼續搜尋。

下一步是把一個繫結加到 `ChildComponent` 範本。

<code-example path="providers-viewproviders/src/app/child/child.component.html" header="providers-viewproviders/src/app/child.component.html" region="flower-binding">

</code-example>

若要算繪新值，把 `<app-child>` 加到 `AppComponent` 範本的底部，讓檢視也能顯示向日葵：

```
Child Component
Emoji from FlowerService: 🌻
```

在邏輯樹中，這表示如下：

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <p>Emoji from FlowerService: {{flower.emoji}} (🌺)</p>
    <app-child @Provide(FlowerService="🌻")
               @Inject(FlowerService)=>"🌻"> <!-- search ends here -->
      <#VIEW> <!-- search starts here -->
        <h2>Parent Component</h2>
        <p>Emoji from FlowerService: {{flower.emoji}} (🌻)</p>
      </#VIEW>
     </app-child>
  </#VIEW>
</app-root>
```

當 `<app-child>` 請求 `FlowerService` 時，注入器從屬於 `<app-child>` 的 `<#VIEW>` 開始搜尋（`<#VIEW>` 被包括在內，是因為它從 `@Component()` 注入），並以 `<app-child>` 結束。
在這種情況下，`FlowerService` 以 `<app-child>` 的 `providers` 陣列中向日葵 🌻 的值被解析。
注入器不需要在注入器樹中再往別處尋找。
它一找到 `FlowerService` 就停下來，永遠不會看到紅色扶桑花 🌺。

{@a use-view-providers}

### 使用 `viewProviders` 陣列

使用 `viewProviders` 陣列，是在 `@Component()` 裝飾器中提供服務的另一種方式。
使用 `viewProviders` 讓服務在 `<#VIEW>` 中可見。

<div class="is-helpful alert">

步驟與使用 `providers` 陣列相同，唯一的差別是改用 `viewProviders` 陣列。

如需逐步說明，請繼續閱讀本節。
如果你能自行設定，請直接跳到[修改服務可用性](guide/hierarchical-dependency-injection#modify-visibility)。

</div>

範例應用程式還有第二個服務 `AnimalService`，用來示範 `viewProviders`。

首先，建立一個 `emoji` 屬性為鯨魚 🐳 的 `AnimalService`：

<code-example path="providers-viewproviders/src/app/animal.service.ts" header="providers-viewproviders/src/app/animal.service.ts" region="animal-service">

</code-example>

沿用與 `FlowerService` 相同的模式，在 `AppComponent` 類別中注入 `AnimalService`：

<code-example path="providers-viewproviders/src/app/app.component.ts" header="providers-viewproviders/src/app/app.component.ts" region="inject-animal-service">

</code-example>

<div class="alert is-helpful">

**注意**：<br />
你可以把所有與 `FlowerService` 相關的程式碼留在原地，因為這樣可以與 `AnimalService` 做比較。

</div>

也為 `<app-child>` 類別加入 `viewProviders` 陣列並注入 `AnimalService`，但給 `emoji` 一個不同的值。
在這裡，它的值是狗 🐶。

<code-example path="providers-viewproviders/src/app/child/child.component.ts" header="providers-viewproviders/src/app/child.component.ts" region="provide-animal-service">

</code-example>

把繫結加到 `ChildComponent` 和 `AppComponent` 範本。
在 `ChildComponent` 範本中，加入以下繫結：

<code-example path="providers-viewproviders/src/app/child/child.component.html" header="providers-viewproviders/src/app/child.component.html" region="animal-binding">

</code-example>

此外，把同樣的內容加到 `AppComponent` 範本：

<code-example path="providers-viewproviders/src/app/app.component.html" header="providers-viewproviders/src/app/app.component.html" region="binding-animal">

</code-example>

現在你應該能在瀏覽器中看到這兩個值：

```
AppComponent
Emoji from AnimalService: 🐳

Child Component
Emoji from AnimalService: 🐶

```

這個 `viewProviders` 範例的邏輯樹如下：

```
<app-root @NgModule(AppModule)
        @Inject(AnimalService) animal=>"🐳">
  <#VIEW>
    <app-child>
      <#VIEW
       @Provide(AnimalService="🐶")
       @Inject(AnimalService=>"🐶")>
       <!-- ^^using viewProviders means AnimalService is available in <#VIEW>-->
       <p>Emoji from AnimalService: {{animal.emoji}} (🐶)</p>
      </#VIEW>
     </app-child>
  </#VIEW>
</app-root>
```

就如同 `FlowerService` 範例一樣，`AnimalService` 在 `<app-child>` 的 `@Component()` 裝飾器中被提供。
這表示由於注入器先在元件的 `ElementInjector` 中尋找，它找到了狗 🐶 的 `AnimalService` 值。
它不需要繼續搜尋 `ElementInjector` 樹，也不需要搜尋 `ModuleInjector`。

### `providers` 與 `viewProviders`

若要看出使用 `providers` 與 `viewProviders` 的差異，在範例中再加入一個元件，稱它為 `InspectorComponent`。
`InspectorComponent` 將是 `ChildComponent` 的子元件。
在 `inspector.component.ts` 中，在建構子中注入 `FlowerService` 和 `AnimalService`：

<code-example path="providers-viewproviders/src/app/inspector/inspector.component.ts" header="providers-viewproviders/src/app/inspector/inspector.component.ts" region="injection">

</code-example>

你不需要 `providers` 或 `viewProviders` 陣列。
接著，在 `inspector.component.html` 中，加入與前面元件相同的標記：

<code-example path="providers-viewproviders/src/app/inspector/inspector.component.html" header="providers-viewproviders/src/app/inspector/inspector.component.html" region="binding">

</code-example>

請記得把 `InspectorComponent` 加入 `AppModule` 的 `declarations` 陣列。

<code-example path="providers-viewproviders/src/app/app.module.ts" header="providers-viewproviders/src/app/app.module.ts" region="appmodule">

</code-example>

接著，請確認你的 `child.component.html` 包含以下內容：

<code-example path="providers-viewproviders/src/app/child/child.component.html" header="providers-viewproviders/src/app/child/child.component.html" region="child-component">

</code-example>

前兩行（包含繫結）是前面步驟就有的。
新的部分是 `<ng-content>` 與 `<app-inspector>`。
`<ng-content>` 讓你可以投影內容，而 `ChildComponent` 範本內的 `<app-inspector>` 讓 `InspectorComponent` 成為 `ChildComponent` 的子元件。

接著，把以下內容加到 `app.component.html`，以利用內容投影。

<code-example path="providers-viewproviders/src/app/app.component.html" header="providers-viewproviders/src/app/app.component.html" region="content-projection">

</code-example>

瀏覽器現在算繪出以下內容（為求簡潔，省略先前的範例）：

```

//...Omitting previous examples. The following applies to this section.

Content projection: This is coming from content. Doesn't get to see
puppy because the puppy is declared inside the view only.

Emoji from FlowerService: 🌻
Emoji from AnimalService: 🐳

Emoji from FlowerService: 🌻
Emoji from AnimalService: 🐶

```

這四個繫結展示了 `providers` 與 `viewProviders` 的差異。
由於狗 🐶 是在 <#VIEW> 內宣告的，投影內容看不到它。
相反地，投影內容看到的是鯨魚 🐳。

不過，在下一節中，`InspectorComponent` 是 `ChildComponent` 的子元件，`InspectorComponent` 位於 `<#VIEW>` 內，所以當它請求 `AnimalService` 時，會看到狗 🐶。

邏輯樹中的 `AnimalService` 會像這樣：

```
<app-root @NgModule(AppModule)
        @Inject(AnimalService) animal=>"🐳">
  <#VIEW>
    <app-child>
      <#VIEW
       @Provide(AnimalService="🐶")
       @Inject(AnimalService=>"🐶")>
       <!-- ^^using viewProviders means AnimalService is available in <#VIEW>-->
       <p>Emoji from AnimalService: {{animal.emoji}} (🐶)</p>
       <app-inspector>
        <p>Emoji from AnimalService: {{animal.emoji}} (🐶)</p>
       </app-inspector>
      </#VIEW>
      <app-inspector>
        <#VIEW>
          <p>Emoji from AnimalService: {{animal.emoji}} (🐳)</p>
        </#VIEW>
      </app-inspector>
     </app-child>
  </#VIEW>
</app-root>
```

`<app-inspector>` 的投影內容看到的是鯨魚 🐳，而不是狗 🐶，因為狗 🐶 位於 `<app-child>` 的 `<#VIEW>` 內。
`<app-inspector>` 只有在它也位於 `<#VIEW>` 內時，才能看見狗 🐶。

{@a modify-visibility}

## 修改服務可見度

本節說明如何使用可見度裝飾器 `@Host()`、`@Self()` 與 `@SkipSelf()`，限制起始與結束 `ElementInjector` 的範圍。

### 被提供 token 的可見性

可見性裝飾器影響在邏輯樹中搜尋注入 token 的起點和終點。
若要做到這一點，把可見性裝飾器放在注入點，也就是 `constructor()`，而不是宣告點。

要改變注入器開始尋找 `FlowerService` 的位置，請在 `<app-child>` 中為 `FlowerService` 的 `@Inject` 宣告加入 `@SkipSelf()`。
這個宣告位於 `<app-child>` 的建構子中，如 `child.component.ts` 所示：

```typescript=
  constructor(@SkipSelf() public flower : FlowerService) { }
```

有了 `@SkipSelf()`，`<app-child>` 的注入器不會向自己尋找 `FlowerService`。
相反地，注入器會從 `<app-root>` 的 `ElementInjector` 開始尋找 `FlowerService`，在那裡什麼也找不到。
接著，它回到 `<app-child>` 的 `ModuleInjector`，找到紅色扶桑花 🌺 的值，之所以可用，是因為 `<app-child>` 的 `ModuleInjector` 與 `<app-root>` 的 `ModuleInjector` 被攤平成一個 `ModuleInjector`。
因此，UI 會算繪出以下內容：

```
Emoji from FlowerService: 🌺
```

在邏輯樹中，同樣的概念可能像這樣：

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW>
    <app-child @Provide(FlowerService="🌻")>
      <#VIEW @Inject(FlowerService, SkipSelf)=>"🌺">
      <!-- With SkipSelf, the injector looks to the next injector up the tree -->
      </#VIEW>
      </app-child>
  </#VIEW>
</app-root>
```

雖然 `<app-child>` 提供了向日葵 🌻，但應用程式算繪出紅色扶桑花 🌺，因為 `@SkipSelf()` 讓目前的注入器略過自己，改向其父層尋找。

如果你現在再把 `@Host()`（除了 `@SkipSelf()` 之外）加到 `FlowerService` 的 `@Inject` 上，結果會是 `null`。
這是因為 `@Host()` 把搜尋的上界限制在 `<#VIEW>`。
以下是邏輯樹中的概念：

```
<app-root @NgModule(AppModule)
        @Inject(FlowerService) flower=>"🌺">
  <#VIEW> <!-- end search here with null-->
    <app-child @Provide(FlowerService="🌻")> <!-- start search here -->
      <#VIEW @Inject(FlowerService, @SkipSelf, @Host, @Optional)=>null>
      </#VIEW>
      </app-parent>
  </#VIEW>
</app-root>
```

在這裡，服務和它們的值都相同，但 `@Host()` 阻止注入器在 `<#VIEW>` 之外繼續尋找 `FlowerService`，因此它找不到該服務並傳回 `null`。

<div class="alert is-helpful">

**注意**：<br />
範例應用程式使用 `@Optional()`，所以應用程式不會擲出錯誤，但原理相同。

</div>

### `@SkipSelf()` 與 `viewProviders`

`<app-child>` 目前在 `viewProviders` 陣列中提供 `AnimalService`，值為狗 🐶。
因為注入器只需要查看 `<app-child>` 的 `ElementInjector` 就能找到 `AnimalService`，所以它永遠不會看到鯨魚 🐳。

如同 `FlowerService` 範例，如果你在 `AnimalService` 的建構子中加入 `@SkipSelf()`，注入器就不會在目前 `<app-child>` 的 `ElementInjector` 中尋找 `AnimalService`。

```typescript=
export class ChildComponent {

// add @SkipSelf()
  constructor(@SkipSelf() public animal : AnimalService) { }

}
```

相反地，注入器會從 `<app-root>` 的 `ElementInjector` 開始。
請記得，`<app-child>` 類別在 `viewProviders` 陣列中提供 `AnimalService`，值為狗 🐶：

```ts
@Component({
  selector: 'app-child',
  ...
  viewProviders:
  [{ provide: AnimalService, useValue: { emoji: '🐶' } }]
})
```

在 `<app-child>` 中有 `@SkipSelf()` 時，邏輯樹看起來像這樣：

```
  <app-root @NgModule(AppModule)
          @Inject(AnimalService=>"🐳")>
    <#VIEW><!-- search begins here -->
      <app-child>
        <#VIEW
         @Provide(AnimalService="🐶")
         @Inject(AnimalService, SkipSelf=>"🐳")>
         <!--Add @SkipSelf -->
        </#VIEW>
        </app-child>
    </#VIEW>
  </app-root>
```

在 `<app-child>` 中有 `@SkipSelf()` 時，注入器從 `<app-root>` 的 `ElementInjector` 開始搜尋 `AnimalService`，並找到鯨魚 🐳。

### `@Host()` 與 `viewProviders`

如果你在 `AnimalService` 的建構子中加入 `@Host()`，結果會是狗 🐶，因為注入器在 `<app-child>` 的 `<#VIEW>` 中找到了 `AnimalService`。
以下是 `<app-child>` 類別中的 `viewProviders` 陣列，以及建構子中的 `@Host()`：

```typescript=
@Component({
  selector: 'app-child',
  ...
  viewProviders:
  [{ provide: AnimalService, useValue: { emoji: '🐶' } }]

})
export class ChildComponent {
  constructor(@Host() public animal : AnimalService) { }
}
```

`@Host()` 使注入器一直找到 `<#VIEW>` 的邊界為止。

```
  <app-root @NgModule(AppModule)
          @Inject(AnimalService=>"🐳")>
    <#VIEW>
      <app-child>
        <#VIEW
         @Provide(AnimalService="🐶")
         @Inject(AnimalService, @Host=>"🐶")> <!-- @Host stops search here -->
        </#VIEW>
        </app-child>
    </#VIEW>
  </app-root>
```

把一個帶有第三種動物——刺蝟 🦔——的 `viewProviders` 陣列，加到 `app.component.ts` 的 `@Component()` 詮釋資料中：

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  viewProviders: [{ provide: AnimalService, useValue: { emoji: '🦔' } }]
})
```

接著，在 `child.component.ts` 中為 `Animal Service` 的建構子加入 `@SkipSelf()` 以及 `@Host()`。
以下是 `<app-child>` 建構子中的 `@Host()` 與 `@SkipSelf()`：

```ts
export class ChildComponent {

  constructor(
  @Host() @SkipSelf() public animal : AnimalService) { }

}
```

當 `@Host()` 與 `SkipSelf()` 套用到位於 `providers` 陣列中的 `FlowerService` 時，結果是 `null`，因為 `@SkipSelf()` 從 `<app-child>` 注入器開始搜尋，但 `@Host()` 在 `<#VIEW>` 停止搜尋——那裡沒有 `FlowerService`。
在邏輯樹中，你可以看到 `FlowerService` 在 `<app-child>` 中可見，而不是在它的 `<#VIEW>` 中。

然而，在 `AppComponent` 的 `viewProviders` 陣列中提供的 `AnimalService` 是可見的。

邏輯樹的表示法說明了為什麼會這樣：

```html
<app-root @NgModule(AppModule)
        @Inject(AnimalService=>"🐳")>
  <#VIEW @Provide(AnimalService="🦔")
         @Inject(AnimalService, @SkipSelf, @Host, @Optional)=>"🦔">
    <!-- ^^@SkipSelf() starts here,  @Host() stops here^^ -->
    <app-child>
      <#VIEW @Provide(AnimalService="🐶")
             @Inject(AnimalService, @SkipSelf, @Host, @Optional)=>"🐶">
               <!-- Add @SkipSelf ^^-->
      </#VIEW>
      </app-child>
  </#VIEW>
</app-root>
```

`@SkipSelf()` 使注入器從 `<app-root>` 開始搜尋 `AnimalService`，而不是請求發出的 `<app-child>`，而 `@Host()` 在 `<app-root>` 的 `<#VIEW>` 停止搜尋。
由於 `AnimalService` 是透過 `viewProviders` 陣列提供的，注入器在 `<#VIEW>` 中找到了刺蝟 🦔。

{@a component-injectors}

## `ElementInjector` 使用案例範例

能夠在不同層級設定一或多個提供者，開啟了許多有用的可能性。
若要在實際應用程式中查看下列情境，請參閱 <live-example>heroes use case examples</live-example>。

### 情境：服務隔離

基於架構上的理由，你可能想把某個服務的存取權限制在它所屬的應用程式領域。
例如，本指南的範例包含一個顯示反派清單的 `VillainsListComponent`。
它從 `VillainsService` 取得這些反派。

如果你在根 `AppModule`（也就是你註冊 `HeroesService` 的地方）中提供 `VillainsService`，那會讓 `VillainsService` 在應用程式的每個地方都可見，包括 *Hero* 工作流程。
如果你之後修改了 `VillainsService`，可能會破壞某個英雄元件中的某些東西。

相反地，你可以像這樣，在 `VillainsListComponent` 的 `providers` 詮釋資料中提供 `VillainsService`：

<code-example path="hierarchical-dependency-injection/src/app/villains-list.component.ts" header="src/app/villains-list.component.ts (metadata)" region="metadata">

</code-example>

透過只在 `VillainsListComponent` 的詮釋資料中提供 `VillainsService`、而不在其他任何地方提供，該服務就只在 `VillainsListComponent` 及其子元件樹中可用。

`VillainService` 相對於 `VillainsListComponent` 而言是單例，因為它就是在那裡宣告的。
只要 `VillainsListComponent` 沒有被銷毀，它就會是同一個 `VillainService` 執行個體；但如果有多個 `VillainsListComponent` 執行個體，那麼每個 `VillainsListComponent` 執行個體都會有它自己的 `VillainService` 執行個體。

### 情境：多個編輯工作階段

許多應用程式允許使用者同時處理多個開啟中的工作。
例如，在報稅應用程式中，報稅人員可以同時處理多份報稅表，在一天中在它們之間切換。

本指南以「英雄之旅」主題的範例示範這個情境。
想像一個顯示超級英雄清單的外層 `HeroListComponent`。

若要開啟某位英雄的報稅表，報稅人員點擊英雄的名字，就會開啟一個用於編輯該報稅表的元件。
每份被選取的英雄報稅表都在自己的元件中開啟，多份報稅表可以同時開啟。

每個報稅表元件都有以下特點：

* 是它自己的報稅表編輯工作階段
* 可以變更報稅表，而不會影響另一個元件中的報稅表
* 能夠儲存對其報稅表的變更，或取消它們

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/dependency-injection/hid-heroes-anim.gif" alt="英雄實際運作">

  </div>

</figure>

假設 `HeroTaxReturnComponent` 有管理與還原變更的邏輯。
對於英雄報稅表來說，那會是一件直截了當的工作。
在真實世界中，面對豐富的報稅表資料模型，變更管理工作會很棘手。
你可以把這項管理委派給一個輔助服務，如本範例所示。

`HeroTaxReturnService` 快取單一的 `HeroTaxReturn`，追蹤對該報稅表的變更，並能儲存或還原它。
它也會委派給整個應用程式範圍的單例 `HeroService`，它透過注入取得該服務。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.service.ts" header="src/app/hero-tax-return.service.ts">

</code-example>

以下是使用 `HeroTaxReturnService` 的 `HeroTaxReturnComponent`。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" header="src/app/hero-tax-return.component.ts">

</code-example>

*要編輯的報稅表*透過 `@Input()` 屬性抵達，該屬性以 getter 與 setter 實作。
setter 會以傳入的報稅表初始化元件自己的 `HeroTaxReturnService` 實例。
getter 永遠傳回該服務所稱的英雄目前狀態。
元件也會要求服務儲存與還原這份報稅表。

如果服務是整個應用程式範圍的單例，這就行不通了。
每個元件都會共用同一個服務實例，而每個元件都會覆寫屬於另一位英雄的報稅表。

若要避免這種情況，把 `HeroTaxReturnComponent` 的元件層級注入器設定為提供該服務：在元件詮釋資料中使用 `providers` 屬性。

<code-example path="hierarchical-dependency-injection/src/app/hero-tax-return.component.ts" header="src/app/hero-tax-return.component.ts (providers)" region="providers">

</code-example>

`HeroTaxReturnComponent` 有它自己的 `HeroTaxReturnService` 提供者。
請回想，每個元件*執行個體*都有它自己的注入器。
在元件層級提供該服務，可確保*每個*元件執行個體都取得自己專屬的私有服務執行個體，而且不會有任何報稅表被覆寫。

<div class="alert is-helpful">

情境程式碼的其餘部分依賴其他 Angular 功能與技巧，你可以在文件的其他地方了解它們。
你可以從 <live-example></live-example> 檢視並下載它。

</div>

### 情境：專門化的提供者

在另一個層級重新提供服務的另一個理由是，在元件樹更深處替換成該服務*更專門化*的實作。

設想一個依賴數個服務的 Car 元件。
假設你將根注入器（標示為 A）設定為對 `CarService`、`EngineService` 與 `TiresService` 使用*通用*提供者。

你建立一個 car 元件（A），顯示由這三個通用服務組成的汽車。

接著你建立一個子元件（B），它為 `CarService` 與 `EngineService` 定義自己的*專門化*提供者，這些提供者具有適合元件（B）中情況的特殊能力。

元件（B）是另一個元件（C）的父元件，而元件（C）為 `CarService` 定義自己的、甚至*更專門化*的提供者。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/dependency-injection/car-components.png" alt="汽車元件">

  </div>

</figure>

在幕後，每個元件都設定了自己的注入器，其中為該元件本身定義了零個、一個或多個提供者。

當你在最深層的元件（C）中解析 `Car` 的執行個體時，它的注入器會產生一個由注入器（C）解析的 `Car` 執行個體，其 `Engine` 由注入器（B）解析，`Tires` 則由根注入器（A）解析。

<figure class="lightbox">

  <div class="card">

    <img src="generated/images/guide/dependency-injection/injector-tree.png" alt="汽車注入器樹">

  </div>

</figure>

<hr />

## 依賴注入的更多資訊

關於 Angular 依賴注入的更多資訊，請參閱 [DI 提供者](guide/dependency-injection-providers)與 [實際運用 DI](guide/dependency-injection-in-action)指南。
