# AOT 中繼資料錯誤

以下是你可能會遇到的中繼資料錯誤，並附上說明與建議的修正方式。

[不支援的運算式形式](#expression-form-not-supported)<br>
[參照到本機（未匯出）符號](#reference-to-a-local-symbol)<br>
[只有已初始化的變數與常數](#only-initialized-variables)<br>
[參照到未匯出的類別](#reference-to-a-non-exported-class)<br>
[參照到未匯出的函式](#reference-to-a-non-exported-function)<br>
[不支援函式呼叫](#function-calls-not-supported)<br>
[不支援解構的變數或常數](#destructured-variable-not-supported)<br>
[無法解析型別](#could-not-resolve-type)<br>
[預期為名稱](#name-expected)<br>
[不支援的列舉成員名稱](#unsupported-enum-member-name)<br>
[不支援標記範本運算式](#tagged-template-expressions-not-supported)<br>
[預期為符號參照](#symbol-reference-expected)<br>

<hr>

{@a expression-form-not-supported}
## 不支援的運算式形式

<div class="alert is-helpful">

*The compiler encountered an expression it didn't understand while evaluating Angular metadata.*

</div>

編譯器[受限的運算式語法](guide/aot-compiler#expression-syntax)之外的語言功能可能會產生此錯誤，如以下範例所示：

```ts
// ERROR
export class Fooish { ... }
...
const prop = typeof Fooish; // typeof is not valid in metadata
  ...
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  ...
```

你可以在一般的應用程式程式碼中使用 `typeof` 與括號記法。你只是不能在定義 Angular 中繼資料的運算式中使用這些功能。

撰寫 Angular 中繼資料時，請遵循編譯器的[受限運算式語法](guide/aot-compiler#expression-syntax)來避免這個錯誤，並留意新的或不常見的 TypeScript 功能。

<hr>

{@a reference-to-a-local-symbol}
## 參照到本機（未匯出）符號

<div class="alert is-helpful">

_Reference to a local (non-exported) symbol 'symbol name'. Consider exporting the symbol._

</div>

編譯器遇到了一個對本機定義符號的參照，該符號不是未匯出就是未初始化。

以下是一個 `provider` 的問題範例。

```ts
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
編譯器會在一個獨立的模組中產生元件工廠，其中包含 `useValue` provider 程式碼。_該_工廠模組無法回頭存取_這個_原始模組，以取得本機（未匯出）的 `foo` 變數。

你可以透過初始化 `foo` 來修正這個問題。

```ts
let foo = 42; // initialized
```

編譯器會把該運算式[摺疊](guide/aot-compiler#code-folding)進 provider 中，如同你這樣撰寫：

```ts
  providers: [
    { provide: Foo, useValue: 42 }
  ]
```

或者，你可以透過匯出 `foo` 來修正，並預期 `foo` 會在執行階段、當你確實知道它的值時才被賦值。

```ts
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

對在中繼資料（例如 `providers` 與 `animations`）中參照的變數加上 `export` 通常有效，因為編譯器可以在這些運算式中產生對已匯出變數的_參照_。它不需要這些變數的_值_。

當編譯器需要_實際的值_才能產生程式碼時，加上 `export` 就沒用了。
例如，它對 `template` 屬性就沒用。

```ts
// ERROR
export let someTemplate: string; // exported but not initialized

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

編譯器_現在_就需要 `template` 屬性的值，才能產生元件工廠。只有變數參照是不夠的。在宣告前加上 `export`，只會產生一個新的錯誤：[`Only initialized variables and constants can be referenced`](#only-initialized-variables)。

<hr>

{@a only-initialized-variables}
## 只有已初始化的變數與常數

<div class="alert is-helpful">

_Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler._

</div>

編譯器發現了一個對未初始化的已匯出變數或靜態欄位的參照。它需要該變數的值才能產生程式碼。

以下範例嘗試將元件的 `template` 屬性設為已匯出變數 `someTemplate` 的值，但該變數已宣告卻_未賦值_。

```ts
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

若你從其他模組匯入 `someTemplate`，卻在該模組中忘了初始化它，也會得到這個錯誤。

```ts
// ERROR - not initialized there either
import { someTemplate } from './config';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

編譯器不能等到執行階段才取得範本資訊。它必須從原始碼靜態推導出 `someTemplate` 變數的值，才能產生元件工廠，其中包含依據範本建置元素的指令。

若要修正此錯誤，請在_同一行_的初始化子句中提供變數的初始值。

```ts
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

<hr>

{@a reference-to-a-non-exported-class}
## 參照到未匯出的類別

<div class="alert is-helpful">

_Reference to a non-exported class <class name>. Consider exporting the class._

</div>

中繼資料參照到了一個未匯出的類別。

例如，你可能定義了一個類別，並在 providers 陣列中把它當作注入權杖使用，卻忘了匯出該類別。

```ts
// ERROR
abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```

Angular 會在獨立的模組中產生類別工廠，而該工廠[只能存取已匯出的類別](guide/aot-compiler#exported-symbols)。若要修正此錯誤，請匯出被參照的類別。

```ts
// CORRECTED
export abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```
<hr>

{@a reference-to-a-non-exported-function}
## 參照到未匯出的函式

<div class="alert is-helpful">

*Metadata referenced a function that wasn't exported.*

</div>

例如，你可能把 providers 的 `useFactory` 屬性設為一個在本機定義的函式，卻忘了匯出它。

```ts
// ERROR
function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```

Angular 會在獨立的模組中產生類別工廠，而該工廠[只能存取已匯出的函式](guide/aot-compiler#exported-symbols)。若要修正此錯誤，請匯出該函式。

```ts
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
## 不支援函式呼叫

<div class="alert is-helpful">

_Function calls are not supported. Consider replacing the function or lambda with a reference to an exported function._

</div>

編譯器目前不支援[函式運算式或 lambda 函式](guide/aot-compiler#function-expression)。
例如，你不能將 provider 的 `useFactory` 設為匿名函式或箭頭函式，如下所示。

```ts
// ERROR
  ...
  providers: [
    { provide: MyStrategy, useFactory: function() { ... } },
    { provide: OtherStrategy, useFactory: () => { ... } }
  ]
  ...
```
如果你在 provider 的 `useValue` 中呼叫函式或方法，也會出現這個錯誤。

```ts
// ERROR
import { calculateValue } from './utilities';

  ...
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  ...
```

若要修正這個錯誤，請從模組匯出一個函式，並改在 `useFactory` provider 中參照該函式。

```ts
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
```

<hr>

{@a destructured-variable-not-supported}
## 不支援解構的變數或常數

<div class="alert is-helpful">

_Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring._

</div>

編譯器不支援參照透過[解構](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring)賦值的變數。

例如，你不能這樣撰寫：

```ts
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
```

若要修正此錯誤，請參照未經解構的值。

```ts
// CORRECTED
import { configuration } from './configuration';
  ...
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  ...
```

<hr>

{@a could-not-resolve-type}
## 無法解析型別

<div class="alert is-helpful">

*The compiler encountered a type and can't determine which module exports that type.*

</div>

當你參照到環境型別時，就可能發生這種情況。例如，`Window` 型別就是在全域 `.d.ts` 檔案中宣告的環境型別。

若你在元件建構函式中參照它，就會得到錯誤，因為編譯器必須靜態分析該建構函式。

```ts
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { ... }
}
```
TypeScript 理解環境型別，所以你不需要匯入它們。Angular 編譯器不理解你忘了匯出或匯入的型別。

在這個例子中，編譯器不理解如何注入帶有 `Window` 權杖的東西。

不要在中繼資料運算式中參照環境型別。

若你必須注入環境型別的實例，可以用四個步驟巧妙地繞過這個問題：

1. 為環境型別的實例建立一個注入權杖。
1. 建立一個傳回該實例的工廠函式。
1. 加入一個帶有該工廠函式的 `useFactory` provider。
1. 使用 `@Inject` 注入該實例。

以下是一個說明範例。

```ts
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
```

建構函式中的 `Window` 型別不再是編譯器的問題，因為它使用 `@Inject(WINDOW)` 來產生注入程式碼。

Angular 對 `DOCUMENT` 權杖也做了類似的處理，讓你可以注入瀏覽器的 `document` 物件（或其抽象，取決於應用程式執行的平台）。

```ts
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({ ... })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { ... }
}
```
<hr>

{@a name-expected}
## 預期為名稱

<div class="alert is-helpful">

*The compiler expected a name in an expression it was evaluating.*

</div>

當你使用數字作為屬性名稱時，就可能發生這種情況，如以下範例所示。

```ts
// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]
```

將該屬性的名稱改為非數字的值。

```ts
// CORRECTED
provider: [{ provide: Foo, useValue: { '0': 'test' } }]
```

<hr>

{@a unsupported-enum-member-name}
## 不支援的列舉成員名稱

<div class="alert is-helpful">

*Angular couldn't determine the value of the [enum member](https://www.typescriptlang.org/docs/handbook/enums.html) that you referenced in metadata.*

</div>

編譯器能理解簡單的列舉值，但不能理解複雜的值，例如由計算屬性衍生的值。

```ts
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
```

避免參照具有複雜初始化子句或計算屬性的列舉。

<hr>

{@a tagged-template-expressions-not-supported}
## 不支援標記範本運算式

<div class="alert is-helpful">

_Tagged template expressions are not supported in metadata._

</div>

編譯器遇到了一個 JavaScript ES2015 [標記範本運算式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)，如下所示。

```ts
// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 ...
 template: '<div>' + raw + '</div>'
 ...
```
[`String.raw()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw) 是 JavaScript ES2015 原生的_標記函式_。

AOT 編譯器不支援標記範本運算式；請在中繼資料運算式中避免使用它們。

<hr>

{@a symbol-reference-expected}
## 預期為符號參照

<div class="alert is-helpful">

*The compiler expected a reference to a symbol at the location specified in the error message.*

</div>

當你在類別的 `extends` 子句中使用運算式時，可能會發生此錯誤。

<!--

Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495).

-->
