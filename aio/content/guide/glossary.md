# Angular 術語表

Angular 有自己的詞彙。
大多數 Angular 術語都是常見的英文詞彙，
在 Angular 系統中具有特定的含義。

本術語表列出了最突出的術語
以及一些較不熟悉的術語，它們具有不尋常或
出乎意料的定義。

[A](guide/glossary#A) [B](guide/glossary#B) [C](guide/glossary#C) [D](guide/glossary#D) [E](guide/glossary#E) [F](guide/glossary#F) [G](guide/glossary#G) [H](guide/glossary#H) [I](guide/glossary#I)
[J](guide/glossary#J) [K](guide/glossary#K) [L](guide/glossary#L) [M](guide/glossary#M) [N](guide/glossary#N) [O](guide/glossary#O) [P](guide/glossary#P) [Q](guide/glossary#Q) [R](guide/glossary#R)
[S](guide/glossary#S) [T](guide/glossary#T) [U](guide/glossary#U) [V](guide/glossary#V) [W](guide/glossary#W) [X](guide/glossary#X) [Y](guide/glossary#Y) [Z](guide/glossary#Z)

{@a A}
{@a aot}

## 預先（ahead-of-time，AOT）編譯

你可以在建置時期編譯 Angular 應用程式。
使用 compiler-cli `ngc` 來編譯你的應用程式，你可以直接啟動模組工廠（module factory），這表示你不需要將 Angular 編譯器包含在你的 JavaScript 包中。
預先編譯的應用程式還能享有更短的載入時間與更高的效能。



</div>


## 標註（annotation）

在實務上，它是[裝飾](guide/glossary#裝飾器（decorator、decoration）)的同義詞。

{@a attribute-directive}

{@a attribute-directives}

## 屬性指令（attribute directives）

一類[指令](guide/glossary#指令（directive）)，可以監聽並修改其他 HTML 元素、屬性、特性與元件的行為。
它們通常以 HTML 屬性的形式呈現，因此得名。

例如，你可以使用 `ngClass` 指令來加入與移除 CSS 類別名稱。

請在 [_屬性指令_](guide/attribute-directives) 指南中了解它們。

{@a B}

## 桶（barrel）

一種將數個 ES2015 模組的匯出項目*彙整*為單一方便的 ES2015 模組的方法。
桶本身是一個 ES2015 模組檔案，會重新匯出其他 ES2015 模組的*選定的*匯出項目。

例如，假設一個 `heroes` 資料夾中有三個 ES2015 模組：

<code-example>
  // heroes/hero.component.ts
  export class HeroComponent {}

  // heroes/hero.model.ts
  export class Hero {}

  // heroes/hero.service.ts
  export class HeroService {}
</code-example>

如果沒有桶，消費者需要三條 import 語句：

<code-example>
  import { HeroComponent } from '../heroes/hero.component.ts';
  import { Hero }          from '../heroes/hero.model.ts';
  import { HeroService }   from '../heroes/hero.service.ts';
</code-example>

你可以為 `heroes` 資料夾加入一個桶（依慣例稱為 `index`），它匯出了所有這些項目：

<code-example>
  export * from './hero.model.ts';   // re-export all of its exports
  export * from './hero.service.ts'; // re-export all of its exports
  export { HeroComponent } from './hero.component.ts'; // re-export the named thing
</code-example>

現在，消費者可以從桶匯入它所需的項目。

<code-example>
  import { Hero, HeroService } from '../heroes'; // index is implied
</code-example>

Angular 的[限定範圍套件](guide/glossary#限定範圍套件（scoped-package）)各自都有一個名為 `index` 的桶。

<div class="alert is-important">

你通常可以改用 [NgModules](guide/glossary#ngmodule) 達成相同的結果。

</div>

## 繫結（binding）

通常指的是[資料繫結](guide/glossary#資料繫結（data-binding）)，以及將 HTML 物件的屬性和資料物件的屬性繫結起來的行為。

有時指的是[相依性注入](guide/glossary#相依性注入（dependency-injection）)中，一個「權杖（token）」&mdash;也稱為「鍵（key）」&mdash;與一個相依性[提供者](guide/glossary#提供者（provider）)之間的繫結。

## 啟動（bootstrap）


<div class="l-sub-section">

你可以用應用程式的根 NgModule（`AppModule`）來「啟動」一個 Angular 應用程式。

啟動流程會找出應用程式頂層的「根」[元件](guide/glossary#元件（component）)，也就是應用程式最先載入的元件。
如需更多資訊，請參閱 [設定](guide/setup) 頁面。

你可以在同一個 `index.html` 中啟動多個應用程式，每個應用程式都有它自己的頂層根元件。

{@a C}

## camelCase

這是一種書寫複合字或片語的慣例，使得每個單字或縮寫都以大寫字母開頭，_除了第一個字母為小寫之外_。

函式、屬性與方法的名稱通常都是以 camelCase 書寫。例如 `square`、`firstName` 以及 `getHeroes`。請注意，`square` 是用 camelCase 書寫單一單字的一個例子。

camelCase 也稱為 *lower camel case*，以便與 *upper camel case*（或 [PascalCase](guide/glossary#pascalcase)）區別。
在 Angular 文件中，「camelCase」一律指 *lower camel case*。

{@a component}

## 元件（component）

一個 Angular 類別，負責向[檢視](guide/glossary#檢視（view）)呈現資料，並處理該檢視的大部分顯示與使用者互動邏輯。

*元件*是 Angular 系統中最重要的建構區塊之一。
事實上，它是一個 Angular [指令](guide/glossary#指令（directive）)，並帶有一個配套的[範本](guide/glossary#範本（template）)。

將 `@Component` [裝飾器](guide/glossary#裝飾器（decorator、decoration）)套用到
元件類別，藉此把 Angular 建立元件實例、並用範本把元件算繪為檢視所需的核心元件中繼資料，附加到類別上。

熟悉「MVC」與「MVVM」模式的人，會認出元件在其中扮演的是「控制器（controller）」或「檢視模型（view model）」的角色。

{@a D}

## dash-case

撰寫複合字或片語時，讓每個單字之間以短劃線或連字號（`-`）分隔的慣例。
此形式也稱為 kebab-case。

[指令](guide/glossary#指令（directive）)選擇器（如 `my-app`）以及
檔案名稱的根部（如 `hero-list.component.ts`），通常都以 dash-case 拼寫。

## 資料繫結（data binding）

應用程式會把資料值顯示給使用者，並回應使用者的
操作（例如點按、觸摸與按鍵）。

在資料繫結中，你宣告 HTML 元件與資料來源之間的關係，並讓框架處理其餘細節。
資料繫結可以替代手動將應用程式資料值推入 HTML、附加事件監聽器、從畫面拉取變更值，以及更新應用程式資料值的繁瑣做法。

Angular 有豐富的資料繫結框架，具備多種資料繫結
操作與其宣告語法支援。

 請在 [範本語法](guide/template-syntax) 頁面中閱讀以下形式的繫結：

 * [插值](guide/template-syntax#interpolation)。
 * [屬性繫結](guide/template-syntax#property-binding)。
 * [事件繫結](guide/template-syntax#event-binding)。
 * [屬性繫結](guide/template-syntax#屬性繫結（attribute-binding）)。
 * [類別繫結](guide/template-syntax#類別繫結)。
 * [樣式繫結](guide/template-syntax#樣式繫結)。
 * [使用 ngModel 的雙向資料繫結](guide/template-syntax#ngModel)。

{@a decorator}

{@a decoration}

## 裝飾器（decorator、decoration）

一個*函式*，為一個類別、其成員（屬性、方法）以及函式參數加入中繼資料。

裝飾器是 JavaScript 語言的一項實驗性（第二階段）[特性](https://github.com/wycats/javascript-decorators)。TypeScript 增加了對裝飾器的支援。

若要套用裝飾器，請將其放在它所裝飾的項目正上方或左側。

Angular 有自己的一組裝飾器，協助它與你的應用程式各部件互動操作。
以下範例展示一個 `@Component` 裝飾器，將一個
類別標識為 Angular [元件](guide/glossary#元件（component）)，以及一個 `@Input` 裝飾器，套用在該元件的 `name` 屬性上。傳給 `@Component` 裝飾器的物件參數（此處省略）會包含相關的元件中繼資料。
```
@Component({...})
export class AppComponent {
  constructor(@Inject('SpecialFoo') public foo:Foo) {}
  @Input() name:string;
}
```
裝飾器的作用範圍僅限於它所裝飾的語言特性。
這裡展示的任何裝飾都不會「洩漏」到檔案中接續在後的其他類別。

<div class="alert is-important">

套用裝飾器時，務必加上括號 `()`。

</div>

## 相依性注入（dependency injection）

一種設計模式與機制，用於建立應用程式的某些部分，並將其交付給應用程式中需要它們的其他部分。

Angular 開發者傾向於透過定義許多簡單的部件來建構應用程式，每個部件都把一件事做好，再在執行階段將它們組合在一起。

這些部件常常依賴其他部件。一個 Angular [元件](guide/glossary#元件（component）)
部件可能依賴一個服務部件來取得資料或進行計算。當
部件「A」依賴另一個部件「B」時，我們說「A」依賴於「B」，
而「B」是「A」的一個相依性。

你可以要求「相依性注入系統」為我們建立「A」
並處理所有相依性。
如果「A」需要「B」，而「B」需要「C」，系統就會解析這條相依性鏈，
並傳回一個已完全準備就緒的「A」實例。

Angular 提供並依賴自己先進的
相依性注入系統，
在需要時與需要的地方，將應用程式部件「注入」到其他應用程式部件中，
以此來組裝並執行應用程式。

在其核心，一個 [`injector`](guide/glossary#注入器（injector）) 會依要求傳回相依值。
表達式 `injector.get(token)` 會傳回與給定的權杖相關聯的值。

權杖是一種 Angular 型別（`InjectionToken`）。你很少需要直接處理權杖；大多數方法都接受類別名稱（`Foo`）或字串（"foo"），而 Angular 會將其轉換為權杖。當你撰寫 `injector.get(Foo)` 時，注入器會傳回與 `Foo` 類別的權杖相關聯的值，通常是 `Foo` 本身的一個實例。

在 Angular 的許多操作過程中，它會在內部提出類似的請求，例如當它建立一個要顯示的 [`component`](guide/glossary#元件（component）) 時。

 `Injector` 會維護一個由權杖到相依值的內部對照表。
如果 `Injector` 無法找到某個權杖的值，它會使用該權杖的 `Provider` 來建立一個新值。

 [提供者](guide/glossary#提供者（provider）) 是一份配方，
用來建立與特定權杖相關聯的相依值的新實例。

注入器只有在它的內部提供者註冊表中具有某個權杖的 `provider` 時，才能為該權杖建立值。註冊提供者是關鍵的準備步驟。

Angular 會在每個注入器上註冊一些自己的提供者。
你也可以註冊自己的提供者。

欲了解更多資訊，請參閱 [相依性注入](guide/dependency-injection) 頁面。

{@a directive}

{@a directives}

## 指令（directive）

一種 Angular 類別，負責建立、重塑瀏覽器 DOM 中的 HTML 元素並與之互動。指令是 Angular 最基礎的特性。

指令通常與 HTML 元素或屬性相關聯。
這個元素或屬性常常被稱作指令本身。

當 Angular 在 HTML 範本中發現指令時，
它會建立相應的指令類別實例，
並將瀏覽器 DOM 的該部分的控制權交給該實例。

你可以創造自訂 HTML 標記（例如： `<my-directive>`）以
與你的自訂指令相關聯。你將此自訂標記加入 HTML 範本的方式，
就像在撰寫原生 HTML 一樣。透過這種方式，指令便成了
HTML 本身的擴充。

指令分為以下幾類：

* [元件](guide/glossary#元件（component）) 結合了應用程式邏輯與 HTML 範本，以算繪應用程式[檢視](guide/glossary#檢視（view）)。元件通常以 HTML 元素來表示。
它們是 Angular 應用程式的建構區塊。

* [屬性指令](guide/glossary#屬性指令（attribute-directives）) 可以監聽並修改其他 HTML 元素、屬性、特性與元件的行為。它們通常以 HTML 屬性來表示，因此得名。

* [結構指令](guide/glossary#結構指令（structural-directive）) 負責塑造或重塑 HTML 佈局，通常是透過加入、移除或操作元素及其子元素來達成。

{@a E}

## ECMAScript

[官方 JavaScript 語言規範](https://en.wikipedia.org/wiki/ECMAScript)。

最新批准的 JavaScript 版本是
[ECMAScript 2017](http://www.ecma-international.org/ecma-262/8.0/)
（又稱為「ES2017」或「ES8」）。許多 Angular 開發人員會以 ES8 或某種力求與它相容的方言（例如 [TypeScript](guide/glossary#typescript)）來撰寫他們的應用程式。

大多數現代瀏覽器只支援年代久遠得多的「ECMAScript 5」（又稱為「ES5」）標準。
以 ES2017、ES2016、ES2015 或其方言之一撰寫的應用程式都必須被[轉譯](guide/glossary#轉譯（transpile）)
為 ES5 JavaScript。

Angular 開發人員可以直接以 ES5 撰寫。

## ES2015

[ECMAScript](guide/glossary#ecmascript) 2015 的簡稱。

## ES5

[ECMAScript](guide/glossary#ecmascript) 5 的簡稱，是大多數現代瀏覽器執行的 JavaScript 版本。

## ES6

[ECMAScript](guide/glossary#ecmascript) 2015 的簡稱。

{@a F}

{@a G}

{@a H}

{@a I}

## 注入器（injector）

Angular [相依性注入系統](guide/glossary#相依性注入（dependency-injection）) 中的一個物件，
可以在其快取中找到指定名稱的相依性，或使用已註冊的 [provider](guide/glossary#提供者（provider）) 建立相依性。

## 輸入（input）

一種指令特性，可以作為
[屬性繫結](guide/template-syntax#property-binding) 的*目標*（在[範本語法](guide/template-syntax)頁面中有詳盡說明）。
資料值會從範本運算式中等號右側所指明的資料來源*流向*此特性。

請參閱 [範本語法](guide/template-syntax) 頁面的[輸入與輸出特性](guide/template-syntax#inputs-outputs)章節。

## 插值（interpolation）

一種[屬性資料繫結](guide/glossary#資料繫結（data-binding）)形式，
位在雙大括號之間的[範本運算式](guide/glossary#範本運算式（template-expression）)
會被呈現為文字。該文字在被指派給元素的特性、或顯示於元素標籤之間前，可能會先與相鄰文字串接起來，如本範例：

<code-example language="html" escape="html">
  <label>My current hero is {{hero.name}}</label>

</code-example>

想進一步了解 [插值](guide/template-syntax#interpolation)，請參閱
[範本語法](guide/template-syntax) 頁面。

{@a J}

{@a jit}

## 即時（just-in-time，JIT）編譯

一種啟動方式，在瀏覽器中編譯元件與模組，並動態啟動應用程式。即時模式是開發期間的良好選擇。
正式環境的應用程式，請考慮使用 [預先編譯](guide/glossary#aot) 模式。

{@a K}

## kebab-case

參見 [dash-case](guide/glossary#dash-case)。

{@a L}

## 生命週期鉤子（lifecycle hooks）

[指令](guide/glossary#指令（directive）) 與 [元件](guide/glossary#元件（component）) 有一個生命週期，
由 Angular 在建立、更新與銷毀它們時進行管理。

你可以實作一或多個生命週期鉤子介面，來切入該生命週期中的關鍵時刻。

每個介面都有一個掛鉤方法，名稱為介面名稱加上 `ng` 前綴。
例如，`OnInit` 介面有一個名為 `ngOnInit` 的掛鉤方法。

Angular 依以下順序執行這些掛鉤方法：

* `ngOnChanges`：當 [輸入](guide/glossary#輸入（input）)/[輸出](guide/glossary#輸出（output）) 繫結值變更時。
* `ngOnInit`：在第一次 `ngOnChanges` 之後。
* `ngDoCheck`：開發人員自訂的變更偵測。
* `ngAfterContentInit`：在元件內容初始化之後。
* `ngAfterContentChecked`：在每次檢查元件內容之後。
* `ngAfterViewInit`：在元件的檢視初始化之後。
* `ngAfterViewChecked`：在每次檢查元件的檢視之後。
* `ngOnDestroy`：在指令銷毀之前。

想進一步了解，請參閱 [生命週期鉤子](guide/lifecycle-hooks) 頁面。

{@a M}

## 模組（module）

<div class="alert is-important">

Angular 有以下幾種類型的模組：

* [NgModules](guide/glossary#ngmodule)。
如需詳細資訊與範例，請參閱 [NgModules](guide/ngmodule) 頁面。
* ES2015 模組，如本節所述。

</div>

專門用於單一目的的緊密結合的程式碼區塊。

Angular 應用程式是模組化的。

一般情況下，你會從許多模組組裝一個應用程式，包括你自己撰寫的模組，以及你從其他人那裡獲得的模組。

一個模組會*匯出*該程式碼中有價值的某些東西，通常是一件東西，例如一個類別；需要那個類別的模組會*匯入*它。

NgModules 的結構與 import/export 語法是基於 [ES2015 模組標準](http://www.2ality.com/2014/09/es6-modules-final.html) 而來。

遵循此標準的應用程式需要模組載入器來按需求載入模組並解決模組間的相依性。Angular 並未包含模組載入器，也不偏好任何特定的第三方程式庫（不過大多數範例使用 SystemJS）。你可以使用任何符合標準的模組程式庫。

模組通常以匯出項目所在的檔案來命名。Angular 的 [DatePipe](https://github.com/angular/angular/blob/master/packages/common/src/pipes/date_pipe.ts) 類別屬於一個名為 `date_pipe` 的功能模組，該模組位於 `date_pipe.ts` 檔案中。

你很少直接存取 Angular 功能模組。你通常從 Angular [限定範圍套件](guide/glossary#限定範圍套件（scoped-package）)（例如 `@angular/core`）匯入它們。

{@a N}

## NgModule

<div class="l-sub-section">



幫助你將應用程式組織成具凝聚力的功能區塊。一個 NgModule 會識別出應用程式所使用的元件、指令與管道，以及應用程式所需的外部 NgModule 清單，例如 `FormsModule`。

每個 Angular 應用程式都有一個應用程式的根模組類別。按照慣例，這個類別稱為 `AppModule`，並且位於名為 `app.module.ts` 的檔案中。

如需詳細資訊與範例，請參閱 [NgModules](guide/ngmodule)。


</div>

{@a O}

## 可觀察物件（observable）

一個其項目會隨著時間非同步到達的陣列。Observables 可以幫助你管理非同步資料，例如來自後端服務的資料。Observables 在 Angular 自身中也會被使用，包括 Angular 的事件系統及 HTTP 客戶端服務。

為了使用 observables，Angular 使用了一個名為 Reactive Extensions (RxJS) 的第三方程式庫。Observables 是 ES2016（JavaScript 的下個版本）所提議的一項功能。

## 輸出（output）

一種指令特性，可以作為事件繫結的*目標*
（詳見[範本語法](guide/template-syntax)頁面中的[事件繫結](guide/template-syntax#event-binding)
章節）。
事件會從此特性*流出*，流向範本運算式中等號右側所指明的接收者。

請參閱[範本語法](guide/template-syntax)頁面的[輸入與輸出特性](guide/template-syntax#inputs-outputs)一節。

{@a P}

## PascalCase

這種寫法是將單字、複合詞或片語中的每個單字或縮寫都以大寫字母開頭。
類別名稱通常以 PascalCase 拼寫，例如 `Person` 與 `HeroDetailComponent`。

這種形式也被稱為 *upper camel case*，以區別於 *lower camel case* 或簡稱的 [camelCase](guide/glossary#camelcase)。
在本文件中，「PascalCase」意指 *upper camel case*，而「camelCase」意指 *lower camel case*。

## 管道（pipe）

Angular 管道是一種函式，可將輸入值轉換為輸出值，以便在[檢視](guide/glossary#檢視（view）)中顯示。
以下範例使用內建的 `currency` 管道，將數值以當地貨幣顯示。

<code-example language="html" escape="html">
  <label>Price: </label>{{product.price | currency}}

</code-example>

你也可以撰寫自己的自訂管道。
欲了解更多，請參閱[管道](guide/pipes)頁面。

## 提供者（provider）

一個 _provider_ 會為[相依性注入](guide/glossary#相依性注入（dependency-injection）)系統建立相依性的新實例。
它將一個查詢權杖與一段程式碼&mdash;有時稱為「配方」&mdash;產生關聯，該程式碼可以建立相依性值。

{@a Q}

{@a R}

## 反應式表單（reactive forms）

一種透過在元件中撰寫程式碼來建構 Angular 表單的技術。
其替代技術為[範本驅動表單](guide/glossary#範本驅動表單（template-driven-forms）)。

建置反應式表單時：

* 「事實來源」就是元件。驗證邏輯是使用元件中的程式碼來定義的。
* 每個控制項都是在元件類別中使用 `new FormControl()` 或 `FormBuilder` 明確建立的。
* 範本中的輸入元素*並不*使用 `ngModel`。
* 相關的 Angular 指令都以 `Form` 為前綴，例如，`FormGroup`、`FormControl` 與 `FormControlName`。

反應式表單功能強大、靈活，是更複雜的資料輸入表單情境（例如動態產生表單控制項）的良好選擇。

## 路由器（router）

大多數應用程式由許多畫面或[檢視](guide/glossary#檢視（view）)組成。
使用者藉由點擊連結和按鈕，在這些畫面間導覽，
並執行其他類似動作，使應用程式以一個檢視取代另一個檢視。

Angular 元件路由器是一套功能豐富的機制，用於設定和管理整個檢視導覽過程，包括檢視的建立與銷毀。

在大多數情況下，元件透過定義通往檢視的路由的 `RouterConfig`，與路由器相連接。

[路由元件](guide/glossary#路由元件（routing-component）)的範本中有一個 `RouterOutlet` 元素，
路由器產生的檢視可以在該處顯示。

應用程式中的其他檢視，可能包含帶有 `RouterLink` 指令的錨點標籤或按鈕，
使用者可以點擊它們來進行導覽。

如需更多資訊，請參閱 [路由與導覽](guide/router) 頁面。

## 路由器模組（router module）

<div class="l-sub-section">

一個獨立的 [NgModule](guide/glossary#ngmodule)，提供在應用程式檢視間導覽所必需的服務提供者及指令。

如需更多資訊，請參閱 [路由與導覽](guide/router) 頁面。

## 路由元件（routing component）

一個 Angular [元件](guide/glossary#元件（component）)，具有一個 `RouterOutlet`，會根據路由器的導覽來顯示檢視。

如需更多資訊，請參閱 [路由與導覽](guide/router) 頁面。

{@a S}

## 限定範圍套件（scoped package）

將相關 *npm* 套件分組的一種方式。
欲了解更多，請參閱 [npm-scope](https://docs.npmjs.com/misc/scope) 頁面。

NgModules 會在*有限範圍的套件*中交付，例如 `@angular/core`、
`@angular/common`、`@angular/platform-browser-dynamic`、`@angular/http` 與 `@angular/router`。

匯入一個有限範圍的套件與匯入一般套件的方式相同。
從消費者的觀點來看，唯一的差異在於有限範圍套件的名稱是以 Angular 的*範圍名稱* `@angular` 開頭。

<code-example path="architecture/src/app/app.component.ts" linenums="false" title="architecture/src/app/app.component.ts (import)" region="import">

</code-example>

## 服務（service）

對於不與特定檢視相關聯、或你希望在元件之間共享的資料或邏輯，請建立服務。

應用程式通常需要諸如英雄資料服務或紀錄服務等服務。

服務是一個具有明確焦點的類別。
你會建立服務來實作與任何特定檢視無關的功能、
提供元件間的共用資料或邏輯，或者封裝外部互動。

應用程式通常需要諸如資料服務或紀錄服務等服務。

如需更多資訊，請參閱[英雄之旅](tutorial)教學中的 [服務](tutorial/toh-pt4) 頁面。

{@a snake-case}

## snake_case

此種撰寫複合字或片語的習慣是讓單字之間以底線（`_`）分隔。此種形式也稱為 *underscore case*。

{@a structural-directive}

{@a structural-directives}

## 結構指令（structural directive）

一類[指令](guide/glossary#指令（directive）)，可以塑造或重塑 HTML 佈局，通常是透過加入與移除 DOM 中的元素。
`ngIf`「條件元素」指令與 `ngFor`「重複器」指令就是著名的例子。

欲了解更多，請參閱[結構指令](guide/structural-directives)頁面。

{@a T}

## 範本（template）

一小段 HTML，Angular 在 Angular [指令](guide/glossary#指令（directive）)（最顯著的是[元件](guide/glossary#元件（component）)）的支援與引導下，用來渲染[檢視](guide/glossary#檢視（view）)。

## 範本驅動表單（template-driven forms）

使用檢視中的 HTML 表單與輸入元素來建構 Angular 表單的一種技術。
另一種技術是[反應式表單](guide/glossary#反應式表單（reactive-forms）)。

建置範本驅動表單時：

* 「事實來源」就是範本。驗證是使用單個輸入元素上的屬性來定義。
* 使用 `ngModel` 的[雙向繫結](guide/glossary#資料繫結（data-binding）)使元件模型與使用者在輸入元素中所輸入的內容保持同步。
* 在後台，Angular 為每個輸入元素建立一個新的控制項，前提是你已經為每個輸入設定了 `name` 屬性及雙向繫結。
* 相關的 Angular 指令都以 `ng` 為前綴，例如 `ngForm`、`ngModel` 與 `ngModelGroup`。

範本驅動表單方便、快速且簡單。它們是許多基本資料輸入表單情境的良好選擇。

如欲了解如何建構範本驅動表單，
請參閱 [表單](guide/forms) 頁面。

## 範本運算式（template expression）

一種類似 TypeScript 的語法，Angular 會在[資料繫結](guide/glossary#資料繫結（data-binding）)的範圍內對其加以評估。

如欲了解如何撰寫範本運算式，
請參閱 [範本語法](guide/template-syntax) 頁面的
[範本運算式](guide/template-syntax#template-expressions)章節。

## 轉譯（transpile）

將以一種 JavaScript 形式（例如 TypeScript）撰寫的程式碼，轉換為另一種 JavaScript 形式（例如 [ES5](guide/glossary#es5)）的過程。

## TypeScript

JavaScript 的一個版本，支援大多數 [ECMAScript 2015](guide/glossary#es2015)
語言特性，例如[裝飾器](guide/glossary#裝飾器（decorator、decoration）)。

TypeScript 還以其可選擇的型別系統著稱，該系統提供編譯時期型別檢查和強大的工具支援（例如「智慧感知（intellisense）」、程式碼補齊、重構和智慧搜尋）。許多程式碼編輯器與 IDE 均原生支援 TypeScript 或透過外掛支援。

TypeScript 是 Angular 開發的首選語言，儘管你可以使用其他 JavaScript 方言，如 [ES5](guide/glossary#es5)。

欲深入了解 TypeScript，請參閱 [typescriptlang.org](http://www.typescriptlang.org/)。

{@a U}

{@a V}

## 檢視（view）

螢幕上的某一部分，用於顯示資訊並回應使用者的動作，例如點擊、滑鼠移動與按鍵。

Angular 在一個或多個[指令](guide/glossary#指令（directive）)的控制下渲染檢視，
尤其是[元件](guide/glossary#元件（component）)指令及其伴隨的[範本](guide/glossary#範本（template）)。
元件所扮演的角色如此突出，以至於將元件稱為檢視是方便的。

檢視通常包含其他檢視。任何檢視皆可能在使用者於應用程式中導覽時被動態載入與卸載，
通常是在[路由器](guide/glossary#路由器（router）)的控制下進行。

{@a W}

{@a X}

{@a Y}

{@a Z}

## 區域（zone）

一種用於封裝與攔截 JavaScript 應用程式非同步活動的機制。

瀏覽器 DOM 與 JavaScript 存在數量有限的非同步活動，
例如 DOM 事件（如點擊）、
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 以及對遠端伺服器的
[XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) 呼叫。

Zones 會攔截所有這些活動，並給「zone client」機會
在非同步活動結束之前與之後採取行動。

Angular 在一個 zone 中執行你的應用程式，它可以透過檢查資料變更並運用[資料繫結](guide/glossary#資料繫結（data-binding）)更新所顯示的資訊，來回應非同步事件。

在這支 [Brian Ford 影片](https://www.youtube.com/watch?v=3IqtmUscE_U)中進一步了解區域。
