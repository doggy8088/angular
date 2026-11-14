# 預先（AOT）編譯器

Angular 預先（AOT）編譯器會在建置階段、瀏覽器下載並執行程式碼_之前_，將你的 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼。

本指南說明如何使用不同的編譯器選項以 AOT 編譯器建置，以及如何撰寫 AOT 可以編譯的 Angular 中繼資料。

<div class="l-sub-section">

  <a href="https://www.youtube.com/watch?v=kW9cJsvcsGo">觀看編譯器作者 Tobias Bosch 講解 Angular 編譯器</a>，於 AngularConnect 2016。

</div>

{@a overview}

## Angular 編譯

Angular 應用程式主要由元件及其 HTML 範本組成。
在瀏覽器可以渲染應用程式之前，
元件與範本必須由 _Angular 編譯器_ 轉換為可執行的 JavaScript。

Angular 提供兩種編譯應用程式的方式：

1. **_即時_ (JIT)**，在執行期於瀏覽器中編譯你的應用程式
1. **_預先_ (AOT)**，在建置時編譯你的應用程式

當你執行 _build-only_ 或 _build-and-serve-locally_ CLI 指令時，預設使用 JIT 編譯：

<code-example language="sh" class="code-shell">
  ng build
  ng serve
</code-example>

{@a compile}

若要使用 AOT 編譯，請在 _build-only_ 或 _build-and-serve-locally_ CLI 指令後面加上 `--aot` 旗標：

<code-example language="sh" class="code-shell">
  ng build --aot
  ng serve --aot
</code-example>

<div class="l-sub-section">

`--prod` 中繼旗標預設使用 AOT 編譯。

詳細資訊請參閱 [CLI 文件](https://github.com/angular/angular-cli/wiki)，尤其是 [`build` 主題](https://github.com/angular/angular-cli/wiki/build)。

</div>

{@a why-aot}

## 為什麼要用 AOT 編譯？

*渲染更快速*

使用 AOT 時，瀏覽器下載的是應用程式的預先編譯版本。
瀏覽器載入的是可執行程式碼，因此能立即渲染應用程式，不必等待先編譯應用程式。

*更少的非同步請求*

編譯器會將外部 HTML 範本與 CSS 樣式表*內嵌*至應用程式的 JavaScript 中，
省去針對這些原始檔案的額外 ajax 請求。

*Angular 框架下載大小更小*

若應用程式已經編譯完成，就不需要下載 Angular 編譯器。
編譯器大約占 Angular 本身的一半，因此省略它能大幅減少應用程式的下載量。

*更早偵測範本錯誤*

AOT 編譯器會在建置步驟中偵測並回報範本繫結錯誤，
早於使用者看到這些錯誤之前。

*更好的安全性*

AOT 會在 HTML 範本與元件提供給用戶端之前，早早將它們編譯為 JavaScript 檔案。
由於沒有範本需要讀取，也沒有高風險的用戶端 HTML 或 JavaScript 求值，
注入攻擊的機會因而更少。

{@a compiler-options}

## Angular 編譯器選項

你可以透過在 `tsconfig.json` 檔案中提供範本編譯器選項，連同提供給 TypeScript 編譯器的選項，來控制應用程式的編譯。範本編譯器選項是指定為
`"angularCompilerOptions"` 物件的成員，如下所示：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    ...
  },
  "angularCompilerOptions": {
    "fullTemplateTypeCheck": true,
    "preserveWhitespaces": false,
    ...
  }
}
```

### *skipMetadataEmit*

這個選項告訴編譯器不要產生 `.metadata.json` 檔案。
這個選項預設為 `false`。

`.metadata.json` 檔案包含範本編譯器所需的、來自 `.ts`
檔案但未包含在 TypeScript 編譯器產生的 `.d.ts` 檔案中的資訊。這類資訊包含，
例如，註解的內容（例如元件的範本），TypeScript
會將其發出到 `.js` 檔案，但不會發出到 `.d.ts` 檔案。

如果使用 TypeScript 的 `--outFile` 選項，應將此選項設定為 `true`，因為中繼資料檔案
對這種形式的 TypeScript 輸出無效。不建議在 Angular 中使用 `--outFile`。
請改用像 [webpack](https://webpack.js.org/) 這樣的打包工具。

使用工廠摘要時，也可以將此選項設定為 `true`，因為工廠摘要
包含 `.metadata.json` 檔案中資訊的副本。

### *strictMetadataEmit*

此選項告訴範本編譯器，如果 `"skipMetadataEmit"` 為 `false`，就向 `.metadata.json`
檔案回報錯誤。此選項預設為 `false`。只有在
`"skipMetadataEmit"` 為 `false` 且 `"skipTemplateCodeGen"` 為 `true` 時，才應使用此選項。

它的目的是驗證隨 `npm` 套件一起打包而發出的 `.metadata.json` 檔案。這種驗證過於嚴格，可能會對那些在範本編譯器使用時永遠不會產生錯誤的中繼資料發出錯誤。你可以在記錄某個匯出符號的註解中加入 `@dynamic`，來選擇抑制此選項對該符號發出的錯誤。

`.metadata.json` 檔案可以包含錯誤，這是有效的。如果中繼資料被用來決定註解的內容，範本編譯器會回報這些錯誤。中繼資料
收集器無法預測哪些符號是設計來用在註解中的，因此它會預先
在匯出符號的中繼資料中加入錯誤節點。範本編譯器之後便可以使用這些錯誤
節點，在這些符號被使用時回報錯誤。如果函式庫的使用者打算在註解中使用某個符號，範本編譯器通常要到
使用者實際使用該符號時才會回報這一點。

### *skipTemplateCodegen*

這個選項告訴編譯器不要輸出 `.ngfactory.js` 與 `.ngstyle.js` 檔案。設定後，
會關閉範本編譯器的大部分功能並停用範本診斷的回報。
這個選項可以用來指示
範本編譯器產生 `.metadata.json` 檔案，隨 `npm` 套件一起散佈，同時
避免產生無法散佈到
`npm` 的 `.ngfactory.js` 與 `.ngstyle.js` 檔案。

### *strictInjectionParameters*

設定為 `true` 時，此選項告訴編譯器，對於所提供、其注入型別無法決定的參數回報錯誤。當未提供此選項值或其為 `false` 時，標記有 `@Injectable` 的類別中型別無法解析的建構子參數會
產生警告。

*注意*：建議明確地將這個選項改為 `true`，因為這個選項將來會預設為 `true`。

### *flatModuleOutFile*

設定為 `true` 時，此選項告訴範本編譯器產生指定檔案名稱的扁平模組
索引，以及對應的扁平模組中繼資料。在建立與 `@angular/core` 和 `@angular/common` 類似方式打包的扁平模組時，使用此選項。使用此選項
時，函式庫的 `package.json` 應參照
產生的扁平模組索引，而不是函式庫索引檔案。使用此
選項只會產生一個 `.metadata.json` 檔案，其中包含從函式庫索引匯出的符號所需的全部中繼資料。在產生的 `.ngfactory.js` 檔案中，扁平
模組索引被用來匯入符號，其中包括函式庫索引的公開 API
以及被遮蔽的內部符號。

預設情況下，`files` 欄位中提供的 `.ts` 檔案被假設為函式庫索引。
如果指定了多個 `.ts` 檔案，會使用 `libraryIndex` 來選擇要使用的檔案。
如果提供了多個 `.ts` 檔案但沒有 `libraryIndex`，會產生錯誤。扁平模組
索引 `.d.ts` 與 `.js` 會以給定的 `flatModuleOutFile` 名稱，在與
函式庫索引 `.d.ts` 檔案相同的位置建立。例如，如果某個函式庫使用
`public_api.ts` 檔案作為模組的函式庫索引，`tsconfig.json` 的 `files` 欄位
就會是 `["public_api.ts"]`。`flatModuleOutFile` 選項
之後可以設定為例如 `"index.js"`，這會產生 `index.d.ts` 與 `index.metadata.json` 檔案。函式庫的
`package.json` 的 `module` 欄位會是 `"index.js"`，`typings` 欄位
會是 `"index.d.ts"`。

### *flatModuleId*

這個選項指定匯入平面模組時要使用的偏好模組 id。
範本編譯器產生的參照在從平面模組匯入符號時，會使用這個模組名稱。
這只有在同時提供 `flatModuleOutFile` 時才有意義。否則編譯器會忽略
這個選項。

### *generateCodeForLibraries*

這個選項告訴範本編譯器，為有對應 `.metadata.json` 檔案的 `.d.ts` 檔案產生工廠檔案（`.ngfactory.js` 與 `.ngstyle.js`）。
這個選項預設為
`true`。這個選項為 `false` 時，工廠檔案只會為 `.ts` 檔案產生。

使用工廠摘要時，這個選項應該設為 `false`。

### *fullTemplateTypeCheck*

此選項告訴編譯器啟用範本編譯器的[繫結運算式驗證](#binding-expresion-validation)
階段，該階段使用 TypeScript 來驗證繫結運算式。

這個選項預設為 `false`。

*注意*：建議將此設定為 `true`，因為此選項未來將預設為 `true`。

### *annotateForClosureCompiler*

此選項告訴編譯器使用 [Tsickle](https://github.com/angular/tsickle)，以
[Closure Compiler](https://github.com/google/closure-compiler) 所需的 [JsDoc](http://usejsdoc.org/) 註解，來註記發出的
JavaScript。此選項預設為 `false`。

### *annotationsAs*

使用這個選項來修改 Angular 專用註解的輸出方式，以改善 tree-shaking。非 Angular
的註解與裝飾器不受影響。預設為 `static fields`。

值              | 說明
----------------|-------------------------------------------------------------
`decorators`    | 將裝飾器保留在原處。這會讓編譯更快。TypeScript 會發出對 __decorate 輔助函式的呼叫。使用 `--emitDecoratorMetadata` 進行執行期反射。然而，產生的程式碼將無法正確地進行 tree-shaking。
`static fields` | 將裝飾器取代為類別中的靜態欄位。讓像 [Closure Compiler](https://github.com/google/closure-compiler) 這樣的進階 tree-shaker 能移除未使用的類別。

### *trace*

這告訴編譯器在編譯範本時印出額外資訊。

### *enableLegacyTemplate*

從 Angular 4.0 開始，`<template>` 元素已被棄用，改用
`<ng-template>`，以避免與 DOM 的同名元素衝突。將此選項設定為
`true` 可啟用已棄用的 `<template>` 元素。此選項
預設為 `false`。某些第三方 Angular 函式庫可能會需要此選項。

### *disableExpressionLowering*

Angular 範本編譯器會轉換在註解中使用（或可能使用）的程式碼，
讓它能從範本工廠模組匯入。請參閱
[中繼資料重寫](#metadata-rewriting) 以了解更多資訊。

把這個選項設為 `false` 會停用這項重寫，要求手動
完成重寫。

### *preserveWhitespaces*

此選項告訴編譯器是否要從編譯後的範本中移除空白文字節點。
此選項預設為 `true`。

*注意*：建議明確將此設定為 `false`，因為這樣會發出較小的範本工廠模組，而且它未來可能會預設為 `false`。

### *allowEmptyCodegenFiles*

告訴編譯器即使所有可能產生的檔案是空的，也要產生它們。此選項
預設為 `false`。這是 `bazel` 建置規則使用的選項，用來簡化
`bazel` 規則追蹤檔案相依性的方式。不建議在 `bazel`
規則之外使用此選項。

## Angular 中繼資料與 AOT

Angular **AOT 編譯器**會擷取並解譯應用程式中 Angular 應管理之部分的**中繼資料**。

Angular 中繼資料告訴 Angular 如何建構你的應用程式類別的實例，並在執行期與它們互動。

你可以使用**裝飾器**（例如 `@Component()` 與 `@Input()`）來指定中繼資料。
你也可以在這些被裝飾類別的建構子宣告中隱含地指定中繼資料。

在以下範例中，`@Component()` 中繼資料物件與類別建構函式會告訴 Angular 如何建立並顯示 `TypicalComponent` 的實例。

```typescript
@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>'
)}
export class TypicalComponent {
  @Input() data: TypicalData;
  constructor(private someService: SomeService) { ... }
}
```

Angular 編譯器只會擷取一次中繼資料，並為 `TypicalComponent` 產生一個*工廠*。當它需要建立 `TypicalComponent` 實例時，Angular 會呼叫該工廠，工廠會產生一個新的視覺元素，並繫結至元件類別的新實例及其注入的依賴。

## 中繼資料的限制

你撰寫中繼資料時所用的 TypeScript *子集*，必須符合下列一般限制：

1. 將[運算式語法](#expression-syntax)限制在受支援的 JavaScript 子集內。
2. 在[程式碼摺疊](#程式碼摺疊)之後，只能參照匯出的符號。
3. 只能呼叫編譯器[支援的函式](#supported-functions)。
4. 被裝飾且有資料繫結的類別成員必須是 public。

以下各節將詳細說明這些要點。

## AOT 的運作方式

把 AOT 編譯器想成有兩個階段會很有幫助：第一個是程式碼分析階段，它只記錄原始碼的一種表示形式；第二個是程式碼產生階段，編譯器的 `StaticReflector` 負責解譯，並對它所解譯的內容施加限制。

## 階段 1：程式碼分析

TypeScript 編譯器會完成第一階段的部分分析工作。它會產生帶有型別資訊的 `.d.ts` _型別定義檔案_，這些資訊是 AOT 編譯器產生應用程式程式碼所需的。

同時，AOT **_collector_** 會分析記錄在 Angular 裝飾器中的中繼資料，並將中繼資料資訊輸出到 **`.metadata.json`** 檔案中，每個 `.d.ts` 檔案對應一份。

你可以把 `.metadata.json` 想成是裝飾器中繼資料整體結構的圖表，以 [抽象語法樹 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 的形式表示。

<div class="l-sub-section">

Angular 的 [schema.ts](https://github.com/angular/angular/blob/master/packages/compiler-cli/src/metadata/schema.ts)
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
{@a arrow-functions}
### 不支援箭頭函式

AOT 編譯器不支援[函式運算式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)與[箭頭函式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)（也稱為 *lambda* 函式）。

請看以下的元件裝飾器：

```typescript
@Component({
  ...
  providers: [{provide: server, useFactory: () => new Server()}]
})
```

AOT _collector_ 不支援在中繼資料運算式中使用箭頭函式 `() => new Server()`。
它會在該函式的位置產生一個錯誤節點。

當編譯器之後解讀這個節點時，會回報一個錯誤，提示你將箭頭函式轉換為*已匯出的函式*。

你可以改寫為以下形式來修正這個錯誤：

```typescript
export function serverFactory() {
  return new Server();
}

@Component({
  ...
  providers: [{provide: server, useFactory: serverFactory}]
})
```

從第 5 版開始，編譯器在發出 `.js` 檔案時會自動執行此重寫。

{@a function-calls}
### 有限的函式呼叫

只要語法有效，_collector_ 就能表示函式呼叫，或用 `new` 建立物件。_collector_ 只在意語法是否正確。

但要注意。編譯器之後可能會拒絕為*特定*函式產生呼叫，或拒絕建立*特定*物件。
編譯器只支援呼叫一小組函式，且只會對少數指定的類別使用 `new`。這些函式與類別列在[下方](#supported-functions)的表格中。

### 程式碼摺疊
{@a exported-symbols}
編譯器只能解析對**已匯出**符號的參照。
所幸，_collector_ 讓你能透過*摺疊*，有限度地使用未匯出的符號。

_collector_ 可以在收集期間求值一個運算式，並將結果（而非原始運算式）記錄到 `.metadata.json` 中。

例如，_collector_ 可以求值運算式 `1 + 2 + 3 + 4`，並將其替換為結果 `10`。

這個過程稱為*摺疊*。能以這種方式化簡的運算式即為*可摺疊*。

{@a var-declaration}
收集器可以求值對
模組本機 `const` 宣告，以及已初始化的 `var` 與 `let` 宣告的參照，實際上將它們從 `.metadata.json` 檔案中移除。

請看以下的元件定義：

```typescript
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  @Input() hero: Hero;
}
```

編譯器無法參照 `template` 常數，因為它未被匯出。

然而，_collector_ 可以將 `template` 常數*摺疊*進中繼資料定義中，把其內容內嵌進去。
效果就如同你這樣撰寫：

```typescript
@Component({
  selector: 'app-hero',
  template: '<div>{{hero.name}}</div>'
})
export class HeroComponent {
  @Input() hero: Hero;
}
```

此時已不再有對 `template` 的參照，因此當編譯器之後解讀*收集器*在 `.metadata.json` 中的輸出時，也就沒有什麼會造成困擾了。

你可以把這個範例再往前推一步，將 `template` 常數包含在另一個運算式中：

```typescript
const template = '<div>{{hero.name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero.title}}</div>'
})
export class HeroComponent {
  @Input() hero: Hero;
}
```

收集器會將此運算式化簡為其等價的*摺疊*字串：

`'<div>{{hero.name}}</div><div>{{hero.title}}</div>'`.

#### 可摺疊的語法

下表說明 _collector_ 可以與不可以摺疊哪些運算式：

語法                                 |可否摺疊
-----------------------------------|-----------------------------------
物件字面值                              | 是
陣列字面值                              | 是
陣列字面值中的展開                          | 否
呼叫                                 | 否
new 運算                             | 否
屬性存取                               | 是，若目標可摺疊
陣列索引                               | 是，若目標與索引皆可摺疊
身分參照                               | 是，若是對本機變數的參照
無替代的範本字串                           | 是
有替代的範本字串                           | 是，若替代內容可摺疊
字串字面值                              | 是
數字字面值                              | 是
布林字面值                              | 是
null 字面值                           | 是
受支援的前置運算子                          | 是，若運算元可摺疊
受支援的二元運算子                          | 是，若左右兩側皆可摺疊
條件運算子                              | 是，若條件可摺疊
括號                                 | 是，若運算式可摺疊

若運算式不可摺疊，收集器會將它以 [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 的形式寫入 `.metadata.json`，供編譯器解析。

## 階段 2：程式碼產生

_collector_ 並不試圖理解它收集並輸出到 `.metadata.json` 的中繼資料。它會盡可能地表示該中繼資料，並在偵測到中繼資料語法違規時記錄錯誤。

在程式碼產生階段解譯 `.metadata.json`，是編譯器的工作。

編譯器理解 _collector_ 支援的所有語法形式，但如果*語意*違反編譯器規則，它可能會拒絕*語法上*正確的中繼資料。

編譯器只能參照*已匯出的符號*。

被裝飾的元件類別成員必須是 public。你不能將 `@Input()` 屬性設為 private 或 internal。

有資料繫結的屬性也必須是 public。

```typescript
// BAD CODE - title is private
@Component({
  selector: 'app-root',
  template: '<h1>{{title}}</h1>'
})
export class AppComponent {
  private title = 'My App'; // Bad
}
```

{@a supported-functions}
最重要的是，編譯器只會產生程式碼來建立特定類別的實例、支援特定裝飾器，並呼叫下列清單中的特定函式。

### 新的實例

   編譯器只允許能建立 `@angular/core` 中 `InjectionToken` 類別實例的中繼資料。

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

編譯器也支援以傳回運算式的函式或靜態
方法形式存在的*巨集*。

例如，請看以下函式：

```typescript
export function wrapInArray<T>(value: T): T[] {
  return [value];
}
```

你可以在中繼資料定義中呼叫 `wrapInArray`，因為它傳回的運算式值符合編譯器受限的 JavaScript 子集。

你可以像這樣使用 `wrapInArray()`：

```typescript
@NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}
```

編譯器會把這種用法視同你這樣撰寫：

```typescript
@NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}
```

收集器判斷什麼符合巨集
函式資格的方式很單純：它只能包含單一 `return` 陳述式。

Angular 的 [`RouterModule`](api/router/RouterModule) 匯出了兩個巨集靜態方法 `forRoot` 與 `forChild`，來協助宣告根路由與子路由。
請檢視這些方法的[原始碼](https://github.com/angular/angular/blob/master/packages/router/src/router_module.ts#L139 "RouterModule.forRoot source code")，
了解巨集如何簡化複雜 [NgModules](guide/ngmodules) 的設定。

{@a metadata-rewriting}

### 中繼資料重寫

編譯器會特別處理包含 `useClass`、`useValue`、`useFactory` 與 `data` 欄位的物件字面值。編譯器把初始化這些欄位之一的運算式轉換為一個匯出的變數，來取代該運算式。這種重寫運算式的過程移除了對其內容的所有限制，因為
編譯器不需要知道運算式的值&mdash;它只需要能夠產生指向該值的參照。

你可能會寫出像這樣的程式碼：

```typescript
class TypicalServer {

}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}]
})
export class TypicalModule {}
```

如果沒有重寫，這段程式碼會無效，因為不支援 lambda，而且 `TypicalServer` 未被匯出。

為了讓這能運作，編譯器會自動將它重寫成類似這樣：

```typescript
class TypicalServer {

}

export const ɵ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: ɵ0}]
})
export class TypicalModule {}
```

這樣編譯器就能在
工廠中產生指向 `ɵ0` 的參照，而不需要知道 `ɵ0` 的值包含什麼。

編譯器在輸出 `.js` 檔案時執行重寫。但這不會重寫 `.d.ts` 檔案，所以 TypeScript 不會將它認定為匯出。因此，它不會污染 ES 模組匯出的 API。

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

編譯器的[受限運算式語法](#expression-syntax)之外的語言功能
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

撰寫 Angular 中繼資料時，請遵守編譯器的[受限運算式語法](#expression-syntax)，
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
編譯器會在一個獨立的模組中產生元件工廠，其中包含 `useValue` 提供者的程式碼。_該_工廠模組無法回頭存取_這個_原始模組中本機（未匯出）的 `foo` 變數。

你可以透過初始化 `foo` 來修正這個問題。

```
let foo = 42; // initialized
```

編譯器會把該運算式[摺疊](#程式碼摺疊)進提供者，就如同你這樣撰寫。

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

對於在 `providers` 與 `animations` 等中繼資料中參照的變數，加上 `export` 通常有效，因為編譯器可以在這些運算式中產生對匯出變數的_參照_。它不需要那些變數的_值_。

當編譯器需要_實際的值_
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

編譯器_現在_就需要 `template` 屬性的值來產生元件工廠。
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
匯出的 `someTemplate` 變數的值，該變數已宣告但_未賦值_。

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

若要修正這個錯誤，請在_同一行_的初始化子句中提供變數的初始值。

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
工廠[只能存取匯出的類別](#exported-symbols)。
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
工廠[只能存取匯出的函式](#exported-symbols)。
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

編譯器目前不支援[函式運算式或 lambda 函式](#function-expression)。
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

編譯器不支援參照以[解構](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring)賦值的變數。

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

Angular 無法判斷你在中繼資料中參照的[列舉成員](https://www.typescriptlang.org/docs/handbook/enums.html)
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
是 JavaScript ES2015 原生的_標記函式_。

AOT 編譯器不支援標記範本運算式；請避免在中繼資料運算式中使用它們。

<hr>

<h3 class="no-toc">預期為符號參照</h3>

編譯器預期在錯誤訊息所指定的位置有一個對符號的參照。

如果你在類別的 `extends` 子句中使用運算式，就可能發生這個錯誤。

<!--

Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495).

-->
{@a binding-expresion-validation}

  ## 階段 3：繫結運算式驗證

  在驗證階段，Angular 範本編譯器使用 TypeScript 編譯器來驗證
  範本中的繫結運算式。若要明確啟用此階段，請在專案的 `tsconfig.json`（請見
  [Angular 編譯器選項](#compiler-options)）的 `"angularCompilerOptions"` 中加入編譯器
  選項 `"fullTemplateTypeCheck"`。

  當在範本繫結運算式中偵測到型別錯誤時，範本驗證會產生錯誤訊息，
  類似 TypeScript 編譯器針對 `.ts` 檔案中程式碼所回報的型別錯誤。

  例如，請看以下元件：

  ```typescript
  @Component({
    selector: 'my-component',
    template: '{{person.addresss.street}}'
  })
  class MyComponent {
    person?: Person;
  }
  ```

  這會產生以下錯誤：

  ```
  my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?
  ```

  錯誤訊息中回報的檔案名稱 `my.component.ts.MyComponent.html` 是範本編譯器產生的合成檔案，
  存放 `MyComponent` 類別範本的內容。
  編譯器從不會將此檔案寫入磁碟。行號與欄號是相對於
  類別 `@Component` 註解中的範本字串，在此例中即 `MyComponent`。如果元件使用
  `templateUrl` 而非 `template`，錯誤會回報在 `templateUrl` 所參照的 HTML 檔案中，
  而不是合成檔案。

  錯誤位置是包含出錯插值運算式的文字節點的開頭。
  若錯誤出現在屬性繫結中，例如 `[value]="person.address.street"`，錯誤
  位置即為包含該錯誤的屬性所在位置。

  驗證會使用 TypeScript 型別檢查器，以及提供給 TypeScript 編譯器的選項，來控制
  型別驗證的詳細程度。例如，若指定了 `strictTypeChecks`，除了上述錯誤訊息之外，還會回報錯誤  ```my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'```。

  ### 型別收窄

  用在 `ngIf` 指令中的運算式，會被用來在 Angular
  範本編譯器中收窄型別聯集，方式就如同 TypeScript 中的 `if` 運算式。例如，為了避免
  上述範本中出現 `Object is possibly 'undefined'` 錯誤，可將範本修改為只有在
  `person` 的值已初始化時才輸出插值，如下所示：

  ```typescript
  @Component({
    selector: 'my-component',
    template: '<span *ngIf="person"> {{person.addresss.street}} </span>'
  })
  class MyComponent {
    person?: Person;
  }
  ```

  使用 `*ngIf` 能讓 TypeScript 編譯器推斷繫結運算式中使用的 `person`
  永遠不會是 `undefined`。

  #### 自訂類似 `ngIf` 的指令

  行為類似 `*ngIf` 的指令，可以加入一個靜態成員標記，宣告它們希望獲得相同待遇；
  這個標記是給範本編譯器的信號，讓編譯器將它們視為
  `*ngIf` 來處理。`*ngIf` 的這個靜態成員是：

  ```typescript
    public static ngIfUseIfTypeGuard: void;
  ```

  這宣告了 `NgIf` 指令的輸入屬性 `ngIf` 應被視為其範本使用的守衛，
  意味著只有當 `ngIf` 輸入屬性為 true 時，範本才會被實例化。

  ### 非 null 型別斷言運算子

  當使用 `*ngIf` 不方便，或元件中的某些約束確保運算式在繫結運算式被內插時永遠不為 null 時，可以使用[非空型別斷言運算子](guide/template-syntax#non-null-assertion-operator)
  來抑制 `Object is possibly 'undefined'` 錯誤。

  在以下範例中，`person` 與 `address` 屬性總是同時設定，
  這意味著若 `person` 不為 null，`address` 也永遠不為 null。沒有方便的
  方法能把這項約束描述給 TypeScript 與範本編譯器，但範例中
  透過使用 `address!.street` 抑制了該錯誤。

  ```typescript
  @Component({
    selector: 'my-component',
    template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>'
  })
  class MyComponent {
    person?: Person;
    address?: Address;

    setData(person: Person, address: Address) {
      this.person = person;
      this.address = address;
    }
  }
  ```

  非 null 斷言運算子應謹慎使用，因為元件重構
  可能會破壞這項約束。

  在此範例中，建議把對 `address` 的檢查也包含
  在 `*ngIf` 中，如下所示：

  ```typescript
  @Component({
    selector: 'my-component',
    template: '<span *ngIf="person && address"> {{person.name}} lives on {{address.street}} </span>'
  })
  class MyComponent {
    person?: Person;
    address?: Address;

    setData(person: Person, address: Address) {
      this.person = person;
      this.address = address;
    }
  }
  ```

  ### 使用 `$any()` 停用型別檢查

  將繫結運算式包在對 [`$any()` 轉型偽函式](guide/template-syntax) 的呼叫中，
  即可停用對該運算式的檢查。
  編譯器會將它視為轉型為 `any` 型別，就如同在 TypeScript 中使用 `<any>`
  或 `as any` 轉型一樣。

  在以下範例中，透過將 `person` 轉型為 `any` 型別，
  抑制了 `Property addresss does not exist` 錯誤。

  ```typescript
  @Component({
    selector: 'my-component',
    template: '{{$any(person).addresss.street}}'
  })
  class MyComponent {
    person?: Person;
  }
  ```
## 總結

* AOT 編譯器做什麼，以及為什麼它很重要。
* 為什麼中繼資料必須以 JavaScript 的子集撰寫。
* 那個子集是什麼。
* 中繼資料定義的其他限制。
* 巨集函式與巨集靜態方法。
* 與中繼資料相關的編譯器錯誤。
* 繫結運算式的驗證
