# AOT 元數據錯誤

以下是你可能會遇到的元數據錯誤，以及解釋和建議的更正方法。

## 表達式表單不受支援

HELPFUL：編譯器在評估 Angular 元數據時遇到它不理解的表達式。

語言功能在編譯器的[受限表達式語法](tools/cli/aot-compiler#expression-syntax)之外，
可能會產生這個錯誤，如下面的範例所示：

<docs-code language="typescript">
// ERROR
export class Fooish { &hellip; }
&hellip;
const prop = typeof Fooish; // typeof is not valid in metadata
  &hellip;
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  &hellip;
</docs-code>

您可以在一般應用程式碼中使用 `typeof` 和方括號表示法。
您只能在定義 Angular 元資料的表達式中使用這些功能。

寫入 Angular 元數據時，請堅持使用編譯器的 [受限表達式語法](tools/cli/aot-compiler#expression-syntax) 來避免此錯誤，並小心新的或不尋常的 TypeScript 功能。

## 參考當地 (非導出的) 符號

有用的：參考本地（未導出）符號「符號名稱」。請考慮導出符號。

編譯器遇到對本地定義的符號的參考，而該符號未導出或未初始化。

以下是一個 `provider` 的問題範例。

<docs-code language="typescript">

// ERROR
let foo: number; // neither exported nor initialized

&commat;Component({
  selector: 'my-component',
  template: &hellip; ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}

</docs-code>

編譯器生成元件工廠，其中包括 `useValue` 提供者程式碼，在一個獨立的模組中。*該* 工廠模組無法回溯到 *這個* 來源模組來存取本地的（未導出的）`foo` 變數。

您可以通過初始化 `foo` 來修復此問題。

<docs-code language="typescript">
let foo = 42; // initialized
</docs-code>

編譯器會將表達式 [摺疊](tools/cli/aot-compiler#code-folding) 成供應者，就像您寫下這個一樣。

<docs-code language="typescript">
providers: [
  { provide: Foo, useValue: 42 }
]
</docs-code>

或者，您可以透過匯出 `foo` 來修正它，預期在您實際知道它的值時，`foo` 將在執行階段被指定。

<docs-code language="typescript">
// CORRECTED
export let foo: number; // exported

&commat;Component({
  selector: 'my-component',
  template: &hellip; ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
</docs-code>

將 `export` 加入通常適用於在元數據中引用的變數，例如 `providers` 和 `animations`，因為編譯器可以在這些表達式中產生導出變數的 *參照*。它不需要那些變數的 *值*。

當編譯器需要*實際值*來產生程式碼時，加入 `export` 不起作用。
例如，它不適用於 `template` 屬性。

<docs-code language="typescript">

// ERROR
export let someTemplate: string; // exported but not initialized

&commat;Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}

</docs-code>

編譯器需要 `template` 屬性的值 *當下* 來產生元件工廠。
僅變數參照是不夠的。
在宣告之前加上 `export` 僅會產生新的錯誤，「[`Only initialized variables and constants can be referenced`](#only-initialized-variables)」。

## 僅初始化變數和常數

HELPFUL: *只能參考已初始化的變數和常數，因為範本編譯器需要這個變數的值。*

編譯器找到一個未初始化的已匯出變數或靜態欄位的參考。
它需要該變數的值來產生程式碼。

以下範例嘗試將元件的 `template` 屬性設定為匯出的 `someTemplate` 變數值，此變數已宣告但 *未指定*。

<docs-code language="typescript">

// ERROR
export let someTemplate: string;

&commat;Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}

</docs-code>

如果你從其他模組導入 `someTemplate` 且忽略在那裡初始化它，你同樣會得到這個錯誤。

<docs-code language="typescript">

// ERROR - not initialized there either
import { someTemplate } from './config';

&commat;Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}

</docs-code>

編譯器無法等到執行階段才能取得範本資訊。
它必須從原始碼中靜態衍生 `someTemplate` 變數的值，以便它能產生元件工廠，其中包含根據範本建立元素的指示。

若要修正此錯誤，請在初始化子句中提供變數的初始值（*在同一行*）。

<docs-code language="typescript">

// CORRECTED
export let someTemplate = '&lt;h1&gt;Greetings from Angular&lt;/h1&gt;';

&commat;Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}

</docs-code>

## 參照未導出的類別

HELPFUL: *參照未匯出的類別`<class name>`.*
*考慮匯出該類別。*

Metadata 參照未導出的類別。

例如，您可能已定義一個類別並將它用作提供者陣列中的注入令牌，但忽視匯出該類別。

<docs-code language="typescript">

// ERROR
abstract class MyStrategy { }

&hellip;
  providers: [
    { provide: MyStrategy, useValue: &hellip; }
  ]
  &hellip;

</docs-code>

Angular 在一個獨立的模組中產生一個類別工廠，而該工廠 [只能存取匯出的類別](tools/cli/aot-compiler#exported-symbols)。
要修正這個錯誤，請匯出所引用的類別。

<docs-code language="typescript">

// CORRECTED
export abstract class MyStrategy { }

&hellip;
  providers: [
    { provide: MyStrategy, useValue: &hellip; }
  ]
  &hellip;

</docs-code>

## 參照非導出的函數

HELPFUL: *Metadata 參照未匯出的函數。*

例如，您可能已將提供者的 `useFactory` 屬性設定為您忽略導出的本地定義函數。

<docs-code language="typescript">

// ERROR
function myStrategy() { &hellip; }

&hellip;
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  &hellip;

</docs-code>

Angular 在獨立的模組中產生類別工廠，而該工廠 [只能存取匯出的函式](tools/cli/aot-compiler#exported-symbols)。
若要修正此錯誤，請匯出函式。

<docs-code language="typescript">

// CORRECTED
export function myStrategy() { &hellip; }

&hellip;
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  &hellip;

</docs-code>

## 函數呼叫不受支援

HELPFUL: *函數呼叫不受支援。請考慮使用參考已匯出的函數來取代函數或 lambda。*

編譯器目前不支援 [函式表達式或 lambda 函式](tools/cli/aot-compiler#function-expression)。
例如，您無法將提供者的 `useFactory` 設為匿名函式或箭頭函式，如下所示。

<docs-code language="typescript">

// ERROR
  &hellip;
  providers: [
    { provide: MyStrategy, useFactory: function() { &hellip; } },
    { provide: OtherStrategy, useFactory: () =&gt; { &hellip; } }
  ]
  &hellip;

</docs-code>

如果您在提供者的 `useValue` 中呼叫函數或方法，也會發生這個錯誤。

<docs-code language="typescript">

// ERROR
import { calculateValue } from './utilities';

&hellip;
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  &hellip;

</docs-code>

若要修正此錯誤，請從模組匯出函數，並在 `useFactory` 提供者中參照該函數。

<docs-code language="typescript">

// CORRECTED
import { calculateValue } from './utilities';

export function myStrategy() { &hellip; }
export function otherStrategy() { &hellip; }
export function someValueFactory() {
  return calculateValue();
}
  &hellip;
  providers: [
    { provide: MyStrategy, useFactory: myStrategy },
    { provide: OtherStrategy, useFactory: otherStrategy },
    { provide: SomeValue, useFactory: someValueFactory }
  ]
  &hellip;

</docs-code>

## 解構變數或常數不受支援

HELPFUL: *範本編譯器不支援參照已匯出的解構變數或常數。請考慮簡化此範本以避免解構。*

編譯器不支援參考由 [解構](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring) 指派之變數。

例如，您無法寫出像這樣的內容：

<docs-code language="typescript">

// ERROR
import { configuration } from './configuration';

// destructured assignment to foo and bar
const {foo, bar} = configuration;
  &hellip;
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  &hellip;

</docs-code>

若要修正此錯誤，請參閱非結構化值。

<docs-code language="typescript">

// CORRECTED
import { configuration } from './configuration';
  &hellip;
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  &hellip;

</docs-code>

## 無法解析類型

有用的資訊：*編譯器遇到一個類型，並且無法判斷哪個模組會匯出該類型。*

這可能會在您參考環境類型時發生。
例如，`Window` 類型是宣告在全域 `.d.ts` 檔案中的環境類型。

如果您在元件建構函數中參照它，則會出現錯誤，編譯器必須靜態分析。

<docs-code language="typescript">

// ERROR
&commat;Component({ })
export class MyComponent {
  constructor (private win: Window) { &hellip; }
}

</docs-code>

TypeScript 瞭解環境類型，因此您不必匯入它們。
Angular 編譯器不瞭解您忽略匯入或匯出的類型。

在這種情況下，編譯器無法理解如何使用 `Window` 令牌注入某些內容。

不要在元數據表達式中參照環境類型。

如果您必須注入一個環境類型的實例，您可以按照四個步驟來解決這個問題：

1. 為 ambient 類型的實例建立注入令牌。
1. 建立返回該實例的工廠函數。
1. 使用該工廠函數加入 `useFactory` 提供者。
1. 使用 `@Inject` 來注入實例。

以下是一個說明性的範例。

<docs-code language="typescript">

// CORRECTED
import { Inject } from '&commat;angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

&commat;Component({
  &hellip;
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (&commat;Inject(WINDOW) private win: Window) { &hellip; }
}

</docs-code>

建構函式中的 `Window` 型別不再會造成編譯器問題，因為它使用 `@Inject(WINDOW)` 來產生注入程式碼。

Angular 用 `DOCUMENT` 代幣執行類似的事情，因此你可以注入瀏覽器的 `document` 物件 \(或依據應用程式執行的平台，注入一個抽象物件\)。

<docs-code language="typescript">

import { Inject }   from '&commat;angular/core';
import { DOCUMENT } from '&commat;angular/common';

&commat;Component({ &hellip; })
export class MyComponent {
  constructor (&commat;Inject(DOCUMENT) private doc: Document) { &hellip; }
}

</docs-code>

## 預期名稱

HELPFUL: *編譯器在它正在評估的表達式中預期一個名稱。*

如果您使用數字作為屬性名稱，就會發生這種情況，如下例所示。

<docs-code language="typescript">

// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]

</docs-code>

將屬性名稱改為非數字。

<docs-code language="typescript">

// CORRECTED
provider: [{ provide: Foo, useValue: { '0': 'test' } }]

</docs-code>

## 不支援的列舉成員名稱

HELPFUL: *Angular 無法判定您在 metadata 中引用的 [枚舉成員](https://www.typescriptlang.org/docs/handbook/enums.html) 的值。*

編譯器可以理解簡單的列舉值，但無法理解複雜的值，例如那些源自計算屬性。

<docs-code language="typescript">

// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computed
}

&hellip;
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // bad
  ]
  &hellip;

</docs-code>

避免參照具有複雜初始化程序或計算屬性的枚舉。

## 標記模板表達式不受支援

HELPFUL: *標記範本表達式不支援元資料。*

編譯器遇到一個 JavaScript ES2015 [標記模板表達式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)，如下所示。

<docs-code language="typescript">

// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template &dollar;{expression} string`;
 &hellip;
 template: '&lt;div&gt;' + raw + '&lt;/div&gt;'
 &hellip;

</docs-code>

[`String.raw()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw) 是 JavaScript ES2015 原生的 *標籤函數*。

AOT 編譯器不支援標記範本表達式；請避免在元數據表達式中使用它們。

## 符號引用預期

HELPFUL: *編譯器期望在錯誤訊息中指定的位置引用符號。*

如果您在類別的 `extends` 子句中使用表達式，可能會發生此錯誤。

<!--todo：Chuck：檢閱你的公關評論後我仍然一頭霧水。參閱[那裡的評論](https://github.com/angular/angular/pull/17712#discussion_r132025495)。 -->

