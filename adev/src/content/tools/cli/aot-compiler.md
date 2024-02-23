# 即時 (AOT) 編譯

Angular 應用程式主要由元件及其 HTML 範本組成。
由於 Angular 提供的元件與範本無法直接被瀏覽器理解，因此 Angular 應用程式在瀏覽器中執行之前需要一個編譯程序。

Angular 即時 (AOT) 編譯器會在瀏覽器下載並執行該程式碼 *之前* 的建置階段，將你的 Angular HTML 和 TypeScript 程式碼轉換成有效的 JavaScript 程式碼。
在建置過程中編譯你的應用程式，可提供更快的瀏覽器呈現速度。

此指南說明如何指定元數據和套用可用的編譯器選項，以使用 AOT 編譯器有效編譯您的應用程式。

HELPFUL: [觀看 Alex Rickabaugh 在 AngularConnect 2019 解釋 Angular 編譯器](https://www.youtube.com/watch?v=anphffaCZrQ)。

以下是一些您可能要使用 AOT 的原因。

| 原因                                 | 詳細資料 |
|:---                                     |:---     |
| 更快的渲染                               | 使用 AOT 時，瀏覽器會下載應用程式的預先編譯版本。瀏覽器載入可執行程式碼，因此它可以立即渲染應用程式，而無需等待先編譯應用程式。                                       |
| 較少的非同步要求                         | 編譯器將外部 HTML 範本和 CSS 樣式表*內嵌*在應用程式 JavaScript 中，從而消除對這些原始檔的個別 ajax 要求。                                                                                  |
| 較小的 Angular 架構下載大小 | 如果應用程式已編譯，則無需下載 Angular 編譯器。編譯器大約是 Angular 本身的一半，因此省略它可大幅減少應用程式的負載。                                              |
| 更早偵測範本錯誤                        | AOT 編譯器在建置步驟中偵測並報告範本繫結錯誤，讓使用者在看到錯誤之前就能發現。                                                                                                                                      |
| 更佳的安全性                         | AOT 在將 HTML 範本和元件提供給用戶端之前，會將它們編譯成 JavaScript 檔案。由於沒有要讀取的範本，也沒有有風險的用戶端 HTML 或 JavaScript 評估，因此注入攻擊的機會較少。 |

## 選擇一個編譯器

Angular 提供了兩種編譯應用程式的方法：

| Angular 編譯       | 詳細資訊 |
|:---                   |:---     |
| 即時編譯 \(JIT\)  | 在運行時於瀏覽器中編譯您的應用程式。這是 Angular 8 之前的預設值。        |
| 預先編譯 \(AOT\) | 在建置時編譯您的應用程式和程式庫。這是 Angular 9 中的預設值。 |

當你執行 [`ng build`](cli/build)（僅建置）或 [`ng serve`](cli/serve)（建置並在本地端提供服務）CLI 指令時，編譯類型（JIT 或 AOT）取決於 `angular.json` 中指定的建置組態中 `aot` 屬性的值。
預設情況下，`aot` 會設定為 `true` 以適用於新的 CLI 應用程式。

詳情請參閱 [CLI 命令參考](cli) 和 [建置和服務 Angular 應用程式](tools/cli/build)。

## AOT 工作原理


AOT 編譯器將你的應用程式程式碼轉換為機器碼，以便在瀏覽器中執行。這與 JIT（即時編譯器）編譯器不同，JIT 編譯器會在瀏覽器中執行時將你的應用程式程式碼轉換為機器碼。

AOT 編譯器的主要優點是它可以提高應用程式的啟動速度。這是因為機器碼比應用程式程式碼更容易被瀏覽器理解，因此瀏覽器可以更快地載入並執行應用程式。

AOT 編譯器的另一個優點是它可以提高應用程式的安全性。這是因為機器碼比應用程式程式碼更難被逆向工程，因此攻擊者更難找到應用程式中的漏洞。

AOT 編譯器的主要缺點是它會增加應用程式的建構時間。這是因為 AOT 編譯器需要在瀏覽器中執行之前將你的應用程式程式碼轉換為機器碼，而這可能需要一些時間。

總體而言，AOT 編譯器是一種提高應用程式啟動速度和安全性的好方法。但是，它也會增加應用程式的建構時間。因此，在決定是否使用 AOT 編譯器時，你需要權衡利弊。

Angular AOT 編譯器提取 **元數據** 來解釋 Angular 應該管理的應用程式部分。
您可以在 **裝飾器**（例如 `@Component()` 和 `@Input()`) 中明確指定元數據，或者在已裝飾類別的建構函式宣告中隱含指定元數據。
元數據會告訴 Angular 如何建構應用程式類別的執行個體，以及在執行階段與它們互動。

在以下範例中，`@Component()` 元資料物件和類別建構函式會告知 Angular 如何建立和顯示 `TypicalComponent` 的執行個體。

<docs-code language="typescript">

&commat;Component({
  selector: 'app-typical',
  template: '&lt;div&gt;A typical component for {{data.name}}&lt;/div&gt;'
})
export class TypicalComponent {
  &commat;Input() data: TypicalData;
  constructor(private someService: SomeService) { &hellip; }
}

</docs-code>

Angular 編譯器會萃取一次元資料，並為 `TypicalComponent` 產生一個工廠。
當需要建立 `TypicalComponent` 實例時，Angular 會呼叫工廠，工廠會產生一個新的視覺元素，並繫結到元件類別的新實例，以及其注入的相依性。

### 編譯階段

AOT 編譯有三個階段。

|     | 階段                  | 詳細                                                                                                                                                                                                                                                                                                        |
|:--- |:---                    |:---                                                                                                                                                                                                                                                                                                            |
| 1   | 程式碼分析          | 在此階段，TypeScript 編譯器和 *AOT 收集器* 會建立來源的表示形式。收集器不會嘗試解釋它收集的元資料。它會盡可能地表示元資料，並在偵測到元資料語法違規時記錄錯誤。                              |
| 2   | 程式碼產生        | 在此階段，編譯器的 `StaticReflector` 會解譯在階段 1 中收集的元資料，執行元資料的其他驗證，如果偵測到元資料限制違規，則會擲回錯誤。                                                                                              |
| 3   | 範本類型檢查 | 在此選擇性階段，Angular *範本編譯器* 會使用 TypeScript 編譯器驗證範本中的繫結表達式。您可以透過設定 `strictTemplates` 組態選項，明確啟用此階段；請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)。 |

### 元數據限制

您使用 TypeScript 的 *子集* 編寫元資料，該子集必須符合下列一般限制：

* 將 [expression syntax](#expression-syntax) 限制為 JavaScript 支援的子集
* 在 [code folding](#code-folding) 之後僅參照已匯出的符號
* 僅呼叫編譯器 [supported-functions](#supported-functions) 支援的函式
* 輸入/輸出和資料繫結類別成員必須是公開的或受保護的。如需準備應用程式進行 AOT 編譯的其他準則和說明，請參閱 [Angular:撰寫 AOT 友善應用程式](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f)。

HELPFUL: AOT 編譯中的錯誤通常是由於元數據不符合編譯器需求 \(如下更詳細說明\) 所造成。
若要了解並解決這些問題，請參閱 [AOT 元數據錯誤](tools/cli/aot-metadata-errors)。

### 設定 AOT 編譯

您可以在控制編譯程序的 [TypeScript 設定檔](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 中提供選項。
請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options) 以取得可用選項的完整清單。

## 第一階段：程式碼分析

TypeScript 編譯器會執行第一階段的一些分析工作。
它會發出具有 AOT 編譯器產生應用程式程式碼所需的類型資訊的 `.d.ts` *類型定義檔案*。
同時，AOT **收集器** 會分析記錄在 Angular 裝飾器中的元資料，並在 **`.metadata.json`** 檔案中輸出元資料資訊，每個 `.d.ts` 檔案一個。

你可以將 `.metadata.json` 視為裝飾器之整體結構圖示，以 [抽象語法樹 (AST)](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%A8%99%E6%A0%91) 表示。

HELPFUL: Angular 的 [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts) 以 TypeScript 介面集合的形式描述 JSON 格式。

### 表達式語法限制

AOT 收集器只能理解 JavaScript 的子集。
使用以下有限語法定義元數據物件：

| 語法                    | 範例 |
|:---                       |:---     |
| 文字物件                  | `{cherry: true, apple: true, mincemeat: false}`                        |
| 文字陣列                 | `['cherries', 'flour', 'sugar']`                                       |
| 文字陣列中散佈             | `['apples', 'flour', ...]`                                             |
| 呼叫                     | `bake(ingredients)`                                                    |
| 新的                      | `new Oven()`                                                           |
| 屬性訪問                 | `pie.slice`                                                            |
| 陣列索引                 | `ingredients[0]`                                                       |
| 身分參考                 | `Component`                                                            |
| 樣板字串                 | &grave;pie is &dollar;{multiplier} times better than cake&grave; |
| 文字字串                 | `'pi'`                                                                 |
| 文字數字                 | `3.14153265`                                                           |
| 文字布林                 | `true`                                                                 |
| 文字 null                 | `null`                                                                 |
| 支援的前置運算子          | `!cake`                                                                |
| 支援的二元運算子          | `a+b`                                                                  |
| 條件運算子              | `a ? b : c`                                                            |
| 括號                     | `(a+b)`                                                                |

如果表達式使用不支援的語法，收集器會將錯誤節點寫入 `.metadata.json` 檔案。
如果編譯器需要該部分的元資料來產生應用程式程式碼，則稍後會報告錯誤。

HELPFUL：如果您希望 `ngc` 立即報告語法錯誤，而不是產生包含錯誤的 `.metadata.json` 檔案，請在 TypeScript 組態檔案中設定 `strictMetadataEmit` 選項。

<docs-code language="json">

"angularCompilerOptions": {
  &hellip;
  "strictMetadataEmit" : true
}

</docs-code>

Angular 函式庫有這個選項可以確保所有的 Angular `.metadata.json` 檔案都是乾淨的，在建立您自己的函式庫時，最好也這麼做。

### 沒有箭頭函式

AOT 編譯器不支援 [函式表達式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function)
和 [箭頭函式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，又稱為 *lambda* 函式。

考慮以下元件裝飾器：

<docs-code language="typescript">

&commat;Component({
  &hellip;
  providers: [{provide: server, useFactory: () =&gt; new Server()}]
})

</docs-code>

AOT 蒐集器不支援在元資料表達式中使用箭頭函式 `() => new Server()`。
它會在函式所在的位置產生一個錯誤節點。
當編譯器稍後解釋這個節點時，它會回報一個錯誤，建議您將箭頭函式轉換成「已匯出的函式」。

您可以透過轉換成以下內容來修正錯誤：

<docs-code language="typescript">

export function serverFactory() {
  return new Server();
}

&commat;Component({
  &hellip;
  providers: [{provide: server, useFactory: serverFactory}]
})

</docs-code>

在版本 5 和更高版本中，編譯器在發出 `.js` 檔案時會自動執行此重寫。

### 程式碼折疊

編譯器只能解析對 ***外銷*** 符號的參照。
然而，收集器可以在收集期間評估運算式，並將結果記錄在 `.metadata.json` 中，而不是原始運算式。
這允許您在運算式中有限地使用非外銷符號。

例如，收集器可以評估表達式 `1 + 2 + 3 + 4` 並將其替換為結果 `10`。
此程序稱為 *摺疊*。
可以透過這種方式簡化的表達式是 *可摺疊的*。

收集器可以評估對模組內部 `const` 宣告和初始化 `var` 與 `let` 宣告的參照，有效地將它們從 `.metadata.json` 檔案中移除。

考慮以下元件定義：

<docs-code language="typescript">

const template = '&lt;div&gt;{{hero.name}}&lt;/div&gt;';

&commat;Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  &commat;Input() hero: Hero;
}

</docs-code>

編譯器無法參照 `template` 常數，因為它未匯出。
然而，收集器可以透過內嵌其內容將 `template` 常數摺疊到元數據定義中。
效果與您寫入以下內容相同：

<docs-code language="typescript">

&commat;Component({
  selector: 'app-hero',
  template: '&lt;div&gt;{{hero.name}}&lt;/div&gt;'
})
export class HeroComponent {
  &commat;Input() hero: Hero;
}

</docs-code>

不再有對 `template` 的參照，因此，當編譯器稍後在 `.metadata.json` 中解釋 *收集器* 輸出時，沒有任何東西會造成困擾。

您可以透過在另一個表達式中包含 `template` 常數，進一步採取此範例：

<docs-code language="typescript">

const template = '&lt;div&gt;{{hero.name}}&lt;/div&gt;';

&commat;Component({
  selector: 'app-hero',
  template: template + '&lt;div&gt;{{hero.title}}&lt;/div&gt;'
})
export class HeroComponent {
  &commat;Input() hero: Hero;
}

</docs-code>

收集器將此表達式簡化為等效的 *摺疊* 字串：

<docs-code language="typescript">

'&lt;div&gt;{{hero.name}}&lt;/div&gt;&lt;div&gt;{{hero.title}}&lt;/div&gt;'

</docs-code>

#### 可摺疊語法

以下表格說明收集器可以和不可以折疊的表達式：

| 語法                           | 可摺疊 |
|:---                              |:---      |
| 文字物件                   | 是                                      |
| 文字陣列                    | 是                                      |
| 文字陣列中的展開          | 否                                       |
| 呼叫                            | 否                                       |
| 新                              | 否                                       |
| 屬性存取                  | 是，如果目標可摺疊               |
| 陣列索引                      | 是，如果目標和索引可摺疊    |
| 識別參考               | 是，如果它是對本地的一個參考     |
| 沒有替換的範本 | 是                                      |
| 帶有替換的範本    | 是，如果替換可摺疊   |
| 文字字串                   | 是                                      |
| 文字數字                   | 是                                      |
| 文字布林                  | 是                                      |
| 文字 null                     | 是                                      |
| 支援的前置運算子        | 是，如果操作數可摺疊              |
| 支援的二元運算子        | 是，如果左右兩邊都可摺疊 |
| 條件運算子             | 是，如果條件可摺疊            |
| 括號                      | 是，如果表達式可摺疊       |

如果一個表達式無法摺疊，收集器會將它寫入 `.metadata.json` 作為 [AST](https://en.wikipedia.org/wiki/Abstract*syntax*tree) 供編譯器解析。

## 第二階段：程式碼產生

收集器不會嘗試了解它收集並輸出至 `.metadata.json` 的元數據。
它盡可能地呈現元數據，並在偵測到元數據語法違規時記錄錯誤。
在程式碼產生階段，編譯器的工作就是解釋 `.metadata.json`。

編譯器了解收集器所支援的所有語法形式，但如果 *語義* 違反編譯器規則，則它可能會拒絕 *語法上* 正確的元資料。

### 公用或受保護的符號

編譯器只能參考 *外傳符號*。

* 修飾的元件類別成員必須是公開或受保護的。
    您無法將 `@Input()` 屬性設為私有。

* 資料繫結屬性也必須是公開或受保護的

### 支援的類別和函式

只要語法有效，收集器可以表示函式呼叫或使用 `new` 建立物件。
然而，編譯器之後可能會拒絕產生呼叫 *特定* 函式或建立 *特定* 物件。

編譯器只能建立某些類別的實例，只支援核心裝飾器，而且只支援呼叫會傳回表達式的巨集（函式或靜態方法）。

| 編譯器動作      | 詳細資料 |
|:---                  |:---     |
| 新實例        | 編譯器僅允許建立 `InjectionToken` 類別實例的元資料，這些實例來自 `@angular/core`。                                            |
| 支援的裝飾器 | 編譯器僅支援 [`@angular/core` 模組中 Angular 裝飾器](api/core#decorators) 的元資料。                                   |
| 函式呼叫       | 工廠函式必須是已匯出的命名函式。AOT 編譯器不支援工廠函式的 lambda 運算式（「箭頭函式」）。 |

### 函式和靜態方法呼叫

收集器接受任何包含單一 `return` 語句的函式或靜態方法。
然而，編譯器僅支援函式或靜態方法形式的巨集，這些函式或靜態方法會傳回一個 *表達式*。

例如，考慮以下函式：

<docs-code language="typescript">

export function wrapInArray&lt;T&gt;(value: T): T[] {
  return [value];
}

</docs-code>

你可以在元數據定義中呼叫 `wrapInArray`，因為它會傳回符合編譯器嚴格 JavaScript 子集的表達式值。

您可以像這樣使用 `wrapInArray()`：

<docs-code language="typescript">

&commat;NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}

</docs-code>

編譯器將此用法視為您已撰寫：

<docs-code language="typescript">

&commat;NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}

</docs-code>

Angular [`RouterModule`](api/router/RouterModule) 匯出兩個巨集靜態方法 `forRoot` 和 `forChild`，以協助宣告根路由和子路由。
檢閱這些方法的 [原始程式碼](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 "RouterModule.forRoot 原始程式碼")，以瞭解巨集如何簡化複雜 [NgModules](guide/ngmodules) 的組態。

### 元數據改寫

編譯器會特別處理包含 `useClass`、`useValue`、`useFactory` 和 `data` 欄位的物件文字，將初始化這些欄位之一的表達式轉換成取代表達式的匯出變數。
重寫這些表達式的程序會移除所有對表達式內容的限制，因為
編譯器不需要知道表達式的值，它只需要能夠產生對該值的參考。

您可能會寫一些像：

<docs-code language="typescript">

class TypicalServer {

}

&commat;NgModule({
  providers: [{provide: SERVER, useFactory: () =&gt; TypicalServer}]
})
export class TypicalModule {}

</docs-code>

不重寫的話，這會無效，因為 lambda 不受支援，而 `TypicalServer` 沒有匯出。
為了允許這項操作，編譯器會自動將它重寫為類似以下的內容：

<docs-code language="typescript">

class TypicalServer {

}

export const &theta;0 = () =&gt; new TypicalServer();

&commat;NgModule({
  providers: [{provide: SERVER, useFactory: &theta;0}]
})
export class TypicalModule {}

</docs-code>

這允許編譯器在工廠中產生對 `θ0` 的參照，而不必知道 `θ0` 的值包含什麼。

編譯器在 `.js` 檔的發射期間進行重寫。
然而，它不會重寫 `.d.ts` 檔，因此 TypeScript 不會將其識別為匯出。
而且它不會干擾 ES 模組的匯出 API。

## 第三階段：樣板類型檢查

Angular 編譯器最實用的功能之一是能夠類型檢查範本內的表達式，並在它們在執行階段造成崩潰之前先捕獲任何錯誤。
在範本類型檢查階段，Angular 範本編譯器會使用 TypeScript 編譯器來驗證範本中的繫結表達式。

在專案的 TypeScript 設定檔案的 `"angularCompilerOptions"` 中加入編譯器選項 `"fullTemplateTypeCheck"`，以明確啟用此階段
（請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)）。

當在範本繫結表達式中偵測到類型錯誤時，範本驗證會產生錯誤訊息，類似於 TypeScript 編譯器如何針對 `.ts` 檔案中的程式碼報告類型錯誤。

例如，請考慮下列元件：

<docs-code language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}'
})
class MyComponent {
  person?: Person;
}

</docs-code>

這會產生下列錯誤：

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

</docs-code>

錯誤訊息中報告的文件名稱 `my.component.ts.MyComponent.html` 是範本編譯器產生的一個合成檔案，其中包含 `MyComponent` 類別範本的內容。
編譯器絕不會將此檔案寫入磁碟中。
行號和欄號是相對於 `@Component` 註解中的範本字串，在本例中為 `MyComponent`。
如果元件使用 `templateUrl` 而不是 `template`，則錯誤會報告在 `templateUrl` 參照的 HTML 檔案中，而不是合成檔案中。

錯誤位置是包含有錯誤內插表達式的文字節點的開頭。
如果錯誤在屬性繫結中，例如 `[value]="person.address.street"`, 錯誤位置會是包含錯誤的屬性的位置。

驗證使用 TypeScript 類型檢查器和提供給 TypeScript 編譯器的選項來控制類型驗證的詳細程度。
例如，如果指定了 `strictTypeChecks`，則錯誤

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'

</docs-code>

也回報了以上錯誤訊息。

### 類型縮小

在 Angular 模板編譯器中，`ngIf` 指令中使用的表達式用於縮小類型聯集，就像 TypeScript 中的 `if` 表達式一樣。
例如，要避免在上面的模板中出現 `Object is possibly 'undefined'` 錯誤，請修改它以僅在 `person` 的值已初始化時才發出插值，如下所示：

<docs-code language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>'
})
class MyComponent {
  person?: Person;
}

</docs-code>

使用 `*ngIf` 允許 TypeScript 編譯器推斷繫結表達式中使用的 `person` 永遠不會是 `undefined`。

有關輸入類型縮小的更多資訊，請參閱 [改善自訂指令的範本類型檢查](guide/directives/structural-directives#directive-type-checks)。

### 非空類型斷言運算子

當使用 `*ngIf` 不方便，或元件中的某些約束可確保繫結運算式內插時運算式永遠非 `null` 時，使用非 `null` 類型斷言運算子來壓制 `Object is possibly 'undefined'` 錯誤。

在以下範例中，`person` 和 `address` 屬性總是同時設定，暗示如果 `person` 為非 null，則 `address` 始終為非 null。
沒有便捷的方法可以向 TypeScript 和範本編譯器描述這個約束，但範例中透過使用 `address!.street` 來抑制錯誤。

<docs-code language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '&lt;span *ngIf="person"&gt; {{person.name}} lives on {{address!.street}} &lt;/span&gt;'
})
class MyComponent {
  person?: Person;
  address?: Address;

setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

</docs-code>

非空斷言運算子應謹慎使用，因為元件重構可能會破壞此約束。

在這個範例中建議在 `*ngIf` 中包含 `address` 的檢查，如下所示：

<docs-code language="typescript">

&commat;Component({
  selector: 'my-component',
  template: '&lt;span &ast;ngIf="person &amp;&amp; address"&gt; {{person.name}} lives on {{address.street}} &lt;/span&gt;'
})
class MyComponent {
  person?: Person;
  address?: Address;

setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

</docs-code>
