# Angular 中繼資料與 AOT

Angular **AOT 編譯器**會將你的 TypeScript 原始碼轉換為可執行的 JavaScript。
在這個過程中，編譯器會擷取並解譯有關**中繼資料**的資訊，也就是 Angular 應管理之應用程式部分的相關資訊。

你使用 TypeScript 的一個 _subset_ 子集來撰寫中繼資料。本指南說明為什麼需要子集、子集的限制有哪些，以及超出這些限制時會發生什麼事。

## Angular 中繼資料
Angular 中繼資料告訴 Angular 如何建構你的應用程式類別的實例，並在執行期與它們互動。

你可以使用**裝飾器**（例如 `@Component()` 與 `@Input()`）來指定中繼資料。 
你也可以在這些被裝飾類別的建構子宣告中隱含地指定中繼資料。

在以下範例中，`@Component()` 中繼資料物件與類別建構函式會告訴 Angular 如何建立並顯示 `TypicalComponent` 的實例。

```typescript
@Component({
  selector: 'app-typical',
  template: 'div>A typical component for {{data.name}}</div>
)}
export class TypicalComponent {
  @Input() data: TypicalData;
  constructor(private someService: SomeService) { ... }
}
```

Angular 編譯器只會擷取一次中繼資料，並為 `TypicalComponent` 產生一個 _factory_ 工廠。 
當它需要建立 `TypicalComponent` 實例時，Angular 會呼叫該工廠，工廠會產生一個新的視覺元素，並繫結至元件類別的新實例及其注入的依賴。

## 預先（AOT）編譯

你應該使用 AOT 來編譯必須快速啟動的應用程式。
使用 AOT 時，沒有執行期編譯步驟。
用戶端完全不需要編譯器函式庫，排除它能大幅減少總下載量。 
瀏覽器下載的是一組較小且已安全編譯的應用程式模組與函式庫，能快速解析並幾乎立即執行。

AOT 編譯器會產生多個檔案，包括最終在瀏覽器中執行的應用程式 JavaScript。接著它會靜態分析你的原始碼，並在不實際執行應用程式的情況下解譯 Angular 中繼資料。

若要編譯應用程式，請在建置過程中執行獨立工具 `ngc`。
使用 CLI 時，請執行 `ng build` 指令。 

如需 AOT 的詳細資訊，請參閱 [Ahead-of-Time Compilation 預先編譯](guide/aot-compiler)。

## 中繼資料限制

Angular 中繼資料運算式必須符合下列一般限制：

1. 將 [運算式語法](#expression-syntax) 限制在受支援的 JavaScript 子集內。 
2. 在 [程式碼摺疊](#程式碼摺疊) 之後，只能參照匯出的符號。
3. 只能呼叫編譯器 [支援的函式](#supported-functions)。
4. 被裝飾且有資料繫結的類別成員必須是 public。

以下各節將詳細說明這些要點。

## AOT 的運作方式

把 AOT 編譯器想成有兩個階段會很有幫助：第一個是程式碼分析階段，它只記錄原始碼的一種表示形式；第二個是程式碼產生階段，編譯器的 `StaticReflector` 負責解譯，並對它所解譯的內容施加限制。

## 階段 1：分析

TypeScript 編譯器會完成第一階段的部分分析工作。它會產生帶有型別資訊的 `.d.ts` _型別定義檔案_，這些資訊是 AOT 編譯器產生應用程式程式碼所需的。

同時，AOT **_collector_** 會分析記錄在 Angular 裝飾器中的中繼資料，並將中繼資料資訊輸出到 **`.metadata.json`** 檔案中，每個 `.d.ts` 檔案對應一份。

你可以把 `.metadata.json` 想成是裝飾器中繼資料整體結構的圖表，以 [抽象語法樹 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 的形式表示。 

<div class="l-sub-section">

Angular 的 [schema.ts](https://github.com/angular/angular/blob/master/packages/tsc-wrapped/src/schema.ts)
以一組 TypeScript 介面來說明 JSON 格式。 

</div>

{@a expression-syntax}
### 運算式語法

_collector_ 只理解 JavaScript 的一個子集。 
請使用下列受限語法定義中繼資料物件：

語法                                 | Example                           
-----------------------------------|-----------------------------------
物件字面值                              | `{cherry: true, apple: true, mincemeat: false}`
陣列字面值                              | `['cherries', 'flour', 'sugar']`
陣列字面值中的展開                          | `['apples', 'flour', ...the_rest]`     
呼叫                                 | `bake(ingredients)`           
new 運算                             | `new Oven()`                   
屬性存取                               | `pie.slice`                      
陣列索引                               | `ingredients[0]`                           
身分參照                               | `Component`                       
範本字串                               | <code>&#96;pie is ${multiplier} times better than cake&#96;</code>
字串字面值                              | `'pi'`                            
數字字面值                              | `3.14153265`                      
布林字面值                              | `true`                            
null 字面值                           | `null`                            
受支援的前置運算子                          | `!cake`                           
受支援的二元運算子                          | `a + b`                           
條件運算子                              | `a ? b : c`                       
括號                                 | `(a + b)`

如果運算式使用了不受支援的語法，_collector_ 會將一個錯誤節點寫入 `.metadata.json` 檔案。編譯器之後在需要該
段中繼資料來產生應用程式程式碼時，會回報該錯誤。

<div class="l-sub-section">

 如果你想讓 `ngc` 立即回報語法錯誤，而不是產生帶有錯誤的 `.metadata.json` 檔案，請在 `tsconfig` 中設定 `strictMetadataEmit` 選項。

```
  "angularCompilerOptions": {
   ...
   "strictMetadataEmit" : true
 }
 ```

Angular 函式庫會設定此選項，以確保所有 Angular `.metadata.json` 檔案都乾淨無誤；建置自己的函式庫時，比照辦理也是最佳實務。

</div>

{@a function-expression}
{@a arror-functions}
### 不支援箭頭函式

AOT 編譯器不支援 [函式運算式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)
與 [箭頭函式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)（也稱為 _lambda_ 函式）。

請看以下的元件裝飾器：

```ts
@Component({
  ...
  providers: [{provide: server, useFactory: () => new Server()}]
})
```

AOT _collector_ 不支援在中繼資料運算式中使用箭頭函式 `() => new Server()`。 
它會在該函式的位置產生一個錯誤節點。

當編譯器之後解讀這個節點時，會回報一個錯誤，提示你將箭頭函式轉換為 _exported function_ 已匯出的函式。

你可以改寫為以下形式來修正這個錯誤：

```ts
export function serverFactory() {
  return new Server();
}

@Component({
  ...
  providers: [{provide: server, useFactory: serverFactory}]
})
```

### 有限的函式呼叫

只要語法有效，_collector_ 就能表示函式呼叫，或用 `new` 建立物件。_collector_ 只在意語法是否正確。

但要注意。編譯器之後可能會拒絕為 _particular_ 特定函式產生呼叫，或拒絕建立 _particular_ 特定物件。
編譯器只支援呼叫一小組函式，且只會對少數指定的類別使用 `new`。這些函式與類別列在 [下方](#supported-functions) 的表格中。 


### 程式碼摺疊
{@a exported-symbols}
編譯器只能解析對 **_exported_** 已匯出符號的參照。
所幸，_collector_ 讓你能透過 _folding_ 摺疊，有限度地使用未匯出的符號。

_collector_ 可以在收集期間求值一個運算式，並將結果（而非原始運算式）記錄到 `.metadata.json` 中。 

例如，_collector_ 可以求值運算式 `1 + 2 + 3 + 4`，並將其替換為結果 `10`。

這個過程稱為 _folding_ 摺疊。能以這種方式化簡的運算式即為 _foldable_ 可摺疊。

{@a var-declaration}
收集器可以求值對 
模組本機 `const` 宣告，以及已初始化的 `var` 與 `let` 宣告的參照，實際上將它們從 `.metadata.json` 檔案中移除。

請看以下的元件定義：

```ts
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
class HeroComponent {
  @Input() hero: Hero;
}
```

編譯器無法參照 `template` 常數，因為它未被匯出。

然而，_collector_ 可以將 `template` 常數 _fold_ 摺疊進中繼資料定義中，把其內容內嵌進去。 
效果就如同你這樣撰寫：

```TypeScript
@Component({
  selector: 'app-hero',
  template: '<div>{{hero.name}}</div>'
})
class HeroComponent {
  @Input() hero: Hero;
}
```

此時已不再有對 `template` 的參照，因此當編譯器之後解讀 _collector's_ 收集器在 `.metadata.json` 中的輸出時，也就沒有什麼會造成困擾了。

你可以把這個範例再往前推一步，將 `template` 常數包含在另一個運算式中：

```TypeScript
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero.title}}</div>'
})
class HeroComponent {
  @Input() hero: Hero;
}
```

_collector_ 會將此運算式化簡為其等價的 _folded_ 摺疊字串：

`'<div>{{hero.name}}</div><div>{{hero.title}}</div>'`.

#### 可摺疊的語法

下表說明 _collector_ 可以與不可以摺疊哪些運算式：

語法                                 | 可否摺疊                           
-----------------------------------|-----------------------------------
物件字面值                              | yes
陣列字面值                              | yes
陣列字面值中的展開                          | no    
呼叫                                 | no           
new 運算                             | no                   
屬性存取                               | yes, if target is foldable                      
陣列索引                               | yes, if target and index are foldable    
身分參照                               | yes, if it is a reference to a local
無替代的範本                              | yes
有替代的範本                              | yes, if the substitutions are foldable
字串字面值                              | yes                            
數字字面值                              | yes                      
布林字面值                              | yes                            
null 字面值                           | yes                            
受支援的前置運算子                          | yes, if operand is foldable                           
受支援的二元運算子                          | yes, if both left and right are foldable                  
條件運算子                              | yes, if condition is foldable
括號                                 | yes, if the expression is foldable

若運算式不可摺疊，收集器會將它以 [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 的形式寫入 `.metadata.json`，供編譯器解析。


## 階段 2：程式碼產生

_collector_ 並不試圖理解它收集並輸出到 `.metadata.json` 的中繼資料。它會盡可能地表示該中繼資料，並在偵測到中繼資料語法違規時記錄錯誤。 

在程式碼產生階段解譯 `.metadata.json`，是編譯器的工作。

編譯器理解 _collector_ 支援的所有語法形式，但如果 _semantics_ 語意違反編譯器規則，它可能會拒絕 _syntactically_ 語法上正確的中繼資料。

編譯器只能參照 _exported symbols_ 已匯出的符號。 

被裝飾的元件類別成員必須是 public。你不能將 `@Input()` 屬性設為 private 或 internal。

有資料繫結的屬性也必須是 public。

```TypeScript
// BAD CODE - title is private
@Component({
  selector: 'app-root',
  template: '<h1>{{title}}</h1>'
})
class AppComponent {
  private title = 'My App'; // Bad
}
```

{@a supported-functions}
最重要的是，編譯器只會產生程式碼來建立特定類別的實例、支援特定裝飾器，並呼叫下列清單中的特定函式。


### 新的實例

編譯器只允許中繼資料建立這些 Angular 類別的實例。

類別               | Module
-----------------|--------------
`OpaqueToken`    | `@angular/core`
`InjectionToken` | `@angular/core`


### 註解／裝飾器

編譯器只支援這些 Angular 裝飾器的中繼資料。

裝飾器               | Module
------------------|--------------
`Attribute`       | `@angular/core`
`Component`       | `@angular/core`
`ContentChild`    | `@angular/core`
`ContentChildren` | `@angular/core`
`Directive`       | `@angular/core`
`Host`            | `@angular/core`
`HostBinding`     | `@angular/core`
`HostListener`    | `@angular/core`
`Inject`          | `@angular/core`
`Injectable`      | `@angular/core`
`Input`           | `@angular/core`
`NgModule`        | `@angular/core`
`Optional`        | `@angular/core`
`Output`          | `@angular/core`
`Pipe`            | `@angular/core`
`Self`            | `@angular/core`
`SkipSelf`        | `@angular/core`
`ViewChild`       | `@angular/core`


### 巨集函式與巨集靜態方法

編譯器也支援 _macros_ 巨集，其形式為傳回運算式的函式或靜態 
方法。

例如，請看以下函式：

```TypeScript
export function wrapInArray<T>(value: T): T[] {
  return [value];
}
```

你可以在中繼資料定義中呼叫 `wrapInArray`，因為它傳回的運算式值符合編譯器受限的 JavaScript 子集。 

你可以像這樣使用 `wrapInArray()`：

```TypeScript
@NgModule({
  declarations: wrapInArray(TypicalComponent)
})
class TypicalModule {}
```

編譯器會把這種用法視同你這樣撰寫：

```TypeScript
@NgModule({
  declarations: [TypicalComponent]
})
class TypicalModule {}
```

收集器判斷什麼符合巨集
函式資格的方式很單純：它只能包含單一 `return` 陳述式。

Angular 的 [`RouterModule`](api/router/RouterModule) 匯出了兩個巨集靜態方法 `forRoot` 與 `forChild`，來協助宣告根路由與子路由。
請檢視這些方法的 [原始碼](https://github.com/angular/angular/blob/master/packages/router/src/router_module.ts#L139 "RouterModule.forRoot source code") 
了解巨集如何簡化複雜 Angular 模組的設定。

## 中繼資料錯誤

以下是你可能會遇到的中繼資料錯誤，附說明與建議的修正方式。

[不支援的運算式形式](#不支援的運算式形式)<br>
[參照到本機（未匯出）符號](#reference-to-a-local-symbol)<br>
[只能參照已初始化的變數與常數](#only-initialized-variables)<br>
[參照到未匯出的類別](#參照到未匯出的類別)<br>
[參照到未匯出的函式](#參照到未匯出的函式)<br>
[不支援函式呼叫](#function-calls-not-supported)<br>
[不支援解構的變數或常數](#destructured-variable-not-supported)<br>
[無法解析型別](#無法解析型別)<br>
[預期為名稱](#預期為名稱)<br>
[不支援的列舉成員名稱](#不支援的列舉成員名稱)<br>
[不支援標記範本運算式](#tagged-template-expressions-not-supported)<br>
[預期為符號參照](#預期為符號參照)<br>

<hr>

<h3 class="no-toc">不支援的運算式形式</h3>

編譯器在評估 Angular 中繼資料時，遇到了一個它不理解的運算式。

編譯器的 [受限運算式語法](#expression-syntax) 之外的語言功能
可能會產生這個錯誤，例如以下範例：

```
// ERROR
export class Fooish { ... }
...
const prop = typeof Fooish; // typeof is not valid in metadata
  ...
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } }; 
  ...
```

你可以在一般的應用程式程式碼中使用 `typeof` 與括號表示法。
你只是不能在定義 Angular 中繼資料的運算式中使用這些功能。

撰寫 Angular 中繼資料時，請遵守編譯器的 [受限運算式語法](#expression-syntax)
以避免這個錯誤，
並留意新穎或不尋常的 TypeScript 功能。

<hr>

{@a reference-to-a-local-symbol}
<h3 class="no-toc">參照到本機（未匯出）符號</h3>

<div class="alert is-helpful">

_參照到本機（未匯出）符號 'symbol name'。請考慮匯出該符號。_

</div>

編譯器遇到一個參照到本機定義符號的情況，該符號不是未匯出就是未初始化。

以下是一個 `provider` 的問題範例。

```
// ERROR
let foo: number; // neither exported nor initialized

@Component({
  selector: 'my-component',
  template: ... ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```
編譯器會在一個獨立的模組中產生元件工廠，其中包含 `useValue` 提供者的程式碼。_That_ 該工廠模組無法回頭存取 _this_ 這個原始模組中本機（未匯出）的 `foo` 變數。

你可以透過初始化 `foo` 來修正這個問題。 

```
let foo = 42; // initialized
```

編譯器會把該運算式 [摺疊](#程式碼摺疊) 進提供者，就如同你這樣撰寫。

```
  providers: [
    { provide: Foo, useValue: 42 }
  ]
```

或者，你也可以匯出 `foo` 來修正，並預期 `foo` 會在執行階段、當你真正知道它的值時被賦值。

```
// CORRECTED
export let foo: number; // exported

@Component({
  selector: 'my-component',
  template: ... ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

對於在 `providers` 與 `animations` 等中繼資料中參照的變數，加上 `export` 通常有效，因為編譯器可以在這些運算式中產生對匯出變數的 _references_ 參照。它不需要那些變數的 _values_ 值。

當編譯器需要 _actual value_ 實際的值 
才能產生程式碼時，加上 `export` 就沒有效果。 
例如，它對 `template` 屬性沒有效果。

```
// ERROR
export let someTemplate: string; // exported but not initialized

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

編譯器 _right now_ 現在就需要 `template` 屬性的值來產生元件工廠。
光是變數參照並不足夠。
在宣告前加上 `export`，只會產生一個新的錯誤「[`只能參照已初始化的變數與常數`](#only-initialized-variables)」。

<hr>

{@a only-initialized-variables}
<h3 class="no-toc">只能參照已初始化的變數與常數</h3>

<div class="alert is-helpful">

_只能參照已初始化的變數與常數，因為範本編譯器需要這個變數的值。_

</div>

編譯器發現一個參照到未初始化的匯出變數或靜態欄位的參照。
它需要該變數的值來產生程式碼。

以下範例嘗試把元件的 `template` 屬性設為
匯出的 `someTemplate` 變數的值，該變數已宣告但 _unassigned_ 未賦值。

```
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

如果你從其他模組匯入 `someTemplate`，卻忘了在該模組中初始化它，你也會得到這個錯誤。

```
// ERROR - not initialized there either
import { someTemplate } from './config';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

編譯器無法等到執行階段才取得範本資訊。
它必須從原始碼靜態地推導出 `someTemplate` 變數的值，
才能產生元件工廠，其中包含
根據範本建置元素的指令。

若要修正這個錯誤，請在 _on the same line_ 同一行的初始化子句中提供變數的初始值。

```
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

<hr>

<h3 class="no-toc">參照到未匯出的類別</h3>

<div class="alert is-helpful">

_參照到未匯出的類別 <class name>。請考慮匯出該類別。_

</div>

中繼資料參照到一個未匯出的類別。

例如，你可能定義了一個類別，並在 providers 陣列中把它用作注入權杖，
卻忘了匯出該類別。 

```
// ERROR
abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```

Angular 會在一個獨立的模組中產生類別工廠，而該 
工廠 [只能存取匯出的類別](#exported-symbols)。
若要修正這個錯誤，請匯出被參照的類別。

```
// CORRECTED
export abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```
<hr>

<h3 class="no-toc">參照到未匯出的函式</h3>

中繼資料參照到一個未匯出的函式。

例如，你可能把 providers 的 `useFactory` 屬性設為一個本機定義的函式，卻忘了匯出它。

```
// ERROR
function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```

Angular 會在一個獨立的模組中產生類別工廠，而該
工廠 [只能存取匯出的函式](#exported-symbols)。
若要修正這個錯誤，請匯出該函式。

```
// CORRECTED
export function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```
<hr>

{@a function-calls-not-supported}
<h3 class="no-toc">不支援函式呼叫</h3>

<div class="alert is-helpful">

_不支援函式呼叫。請考慮把函式或 lambda 換成對匯出函式的參照。_

</div>

編譯器目前不支援 [函式運算式或 lambda 函式](#function-expression)。
例如，你不能像這樣把提供者的 `useFactory` 設為匿名函式或箭頭函式。

```
// ERROR
  ...
  providers: [
    { provide: MyStrategy, useFactory: function() { ... } },
    { provide: OtherStrategy, useFactory: () => { ... } }
  ]
  ...
```
如果你在提供者的 `useValue` 中呼叫函式或方法，你也會得到這個錯誤。
```
// ERROR
import { calculateValue } from './utilities';

  ...
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  ...
```

若要修正這個錯誤，請從模組匯出一個函式，並在 `useFactory` 提供者中改為參照該函式。

<code-example linenums="false">
// CORRECTED
import { calculateValue } from './utilities';

export function myStrategy() { ... }
export function otherStrategy() { ... }
export function someValueFactory() { 
  return calculateValue();
}
  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy },
    { provide: OtherStrategy, useFactory: otherStrategy },
    { provide: SomeValue, useFactory: someValueFactory }
  ]
  ...
</code-example>

<hr>

{@a destructured-variable-not-supported}
<h3 class="no-toc">不支援解構的變數或常數</h3>

<div class="alert is-helpful">

_範本編譯器不支援參照匯出的解構變數或常數。請考慮簡化寫法以避免解構。_

</div>

編譯器不支援參照以 [解構](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring) 賦值的變數。

例如，你不能像這樣撰寫：

<code-example linenums="false">
// ERROR
import { configuration } from './configuration';

// destructured assignment to foo and bar
const {foo, bar} = configuration;
  ...
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  ...
</code-example>

若要修正這個錯誤，請參照非解構的值。

<code-example linenums="false">
// CORRECTED
import { configuration } from './configuration';
  ...
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  ...
</code-example>

<hr>

<h3 class="no-toc">無法解析型別</h3>

編譯器遇到一個型別，無法判斷哪個模組匯出了該型別。

如果你參照了環境型別，就可能發生這種情況。
例如，`Window` 型別是在全域 `.d.ts` 檔案中宣告的環境型別。

如果你在元件建構函式中參照它，你就會得到一個錯誤，
因為編譯器必須靜態分析建構函式。

```
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { ... }
}
```
TypeScript 理解環境型別，所以你不需要匯入它們。 
Angular 編譯器不理解你忘了匯出或匯入的型別。

在這個情況下，編譯器不理解如何用 `Window` 權杖注入東西。

不要在中繼資料運算式中參照環境型別。

如果你必須注入環境型別的實例，
你可以用四個步驟巧妙地解決這個問題：

1. 為環境型別的實例建立一個注入權杖。
1. 建立一個傳回該實例的工廠函式。
1. 加入一個帶有該工廠函式的 `useFactory` 提供者。
1. 使用 `@Inject` 注入該實例。

以下是一個說明範例。

<code-example linenums="false">
// CORRECTED
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  ...
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { ... }
}
</code-example>

建構函式中的 `Window` 型別不再是編譯器的問題，因為它
使用 `@Inject(WINDOW)` 來產生注入程式碼。

Angular 以 `DOCUMENT` 權杖做了類似的事情，讓你可以注入瀏覽器的 `document` 物件（或它的抽象，取決於應用程式執行的平台）。

<code-example linenums="false">
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({ ... })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { ... }
}
</code-example>
<hr>

<h3 class="no-toc">預期為名稱</h3>

編譯器在它正在求值的運算式中預期一個名稱。
如果你像下例一樣用數字作為屬性名稱，就可能發生這種情況。 

```
// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]
```

把屬性的名稱改成非數字的名稱。

```
// CORRECTED
provider: [{ provide: Foo, useValue: { '0': 'test' } }]
```

<hr>

<h3 class="no-toc">不支援的列舉成員名稱</h3>

Angular 無法判斷你在中繼資料中參照的 [列舉成員](https://www.typescriptlang.org/docs/handbook/enums.html) 
的值。

編譯器可以理解簡單的列舉值，但不能理解複雜的值，例如由計算屬性推導出的值。

<code-example linenums="false">
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computed
}

  ...
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // bad
  ]
  ...
</code-example>

避免參照具有複雜初始化式或計算屬性的列舉。

<hr>

{@a tagged-template-expressions-not-supported}
<h3 class="no-toc">不支援標記範本運算式</h3>

<div class="alert is-helpful">

_中繼資料不支援標記範本運算式。_

</div>

編譯器遇到了一個 JavaScript ES2015 [標記範本運算式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)，例如：
```
// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 ...
 template: '<div>' + raw + '</div>'
 ...
``` 
[`String.raw()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)
是 JavaScript ES2015 原生的 _tag function_ 標記函式。

AOT 編譯器不支援標記範本運算式；請避免在中繼資料運算式中使用它們。

<hr>

<h3 class="no-toc">預期為符號參照</h3>

編譯器預期在錯誤訊息所指定的位置有一個對符號的參照。

如果你在類別的 `extends` 子句中使用運算式，就可能發生這個錯誤。

<!--

Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495).

-->

## 總結

本頁涵蓋了：

* AOT 編譯器的功能。
* 為什麼中繼資料必須以 JavaScript 的子集撰寫。
* 那個子集是什麼。
* 中繼資料定義的其他限制。
* 巨集函式與巨集靜態方法。
* 與中繼資料相關的編譯器錯誤。
