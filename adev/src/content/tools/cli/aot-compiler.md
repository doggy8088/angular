# 預先編譯（AOT）

Angular 應用程式主要由元件及其 HTML 範本組成。由於瀏覽器無法直接理解 Angular 提供的元件與範本，Angular 應用程式必須先經過編譯程序，才能在瀏覽器中執行。

Angular 預先（AOT）編譯器會在建置階段、瀏覽器下載並執行程式碼_之前_，將你的 Angular HTML 與 TypeScript 程式碼轉換為高效率的 JavaScript 程式碼。在建置過程中編譯應用程式，能讓瀏覽器中的渲染更快速。

本指南說明如何指定中繼資料並套用可用的編譯器選項，運用 AOT 編譯器高效率地編譯你的應用程式。

HELPFUL: [觀看 Alex Rickabaugh 在 AngularConnect 2019 講解 Angular 編譯器](https://www.youtube.com/watch?v=anphffaCZrQ)。

以下是你可能想要使用 AOT 的一些理由。

| 理由 | 說明 |
| :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 渲染更快速 | 使用 AOT 時，瀏覽器下載的是應用程式的預先編譯版本。瀏覽器載入的是可執行程式碼，因此能立即渲染應用程式，不必等待先編譯應用程式。 |
| 更少的非同步請求 | 編譯器會將外部 HTML 範本與 CSS 樣式表_內嵌_至應用程式的 JavaScript 中，省去針對這些原始檔案的額外 ajax 請求。 |
| Angular 框架下載大小更小 | 若應用程式已經編譯完成，就不需要下載 Angular 編譯器。編譯器大約占 Angular 本身的一半，因此省略它能大幅減少應用程式的下載量。 |
| 更早偵測範本錯誤 | AOT 編譯器會在建置步驟中偵測並回報範本繫結錯誤，早於使用者看到這些錯誤之前。 |
| 更好的安全性 | AOT 會在 HTML 範本與元件提供給用戶端之前，早早將它們編譯為 JavaScript 檔案。由於沒有範本需要讀取，也沒有高風險的用戶端 HTML 或 JavaScript 求值，注入攻擊的機會因而更少。 |

## 選擇編譯器 {#choosing-a-compiler}

Angular 提供兩種編譯應用程式的方式：

| Angular 編譯 | 說明 |
| :-------------------- | :------------------------------------------------------------------------------------------------ |
| Just-in-Time \(JIT\)  | 在執行階段於瀏覽器中編譯你的應用程式。這是 Angular 8 以前的預設方式。 |
| Ahead-of-Time \(AOT\) | 在建置時編譯你的應用程式與函式庫。這是 Angular 9 起的預設方式。 |

當你執行 [`ng build`](cli/build)（僅建置）或 [`ng serve`](cli/serve)（建置並在本機提供）CLI 指令時，編譯類型（JIT 或 AOT）取決於你在 `angular.json` 中指定的建置組態裡，`aot` 屬性的值。依預設，新建立的 CLI 應用程式會將 `aot` 設為 `true`。

更多資訊請參閱 [CLI 指令參考](cli) 與 [建置並提供 Angular 應用程式](tools/cli/build)。

## AOT 的運作方式

Angular AOT 編譯器會擷取**中繼資料**，用以解讀應用程式中應由 Angular 管理的部分。你可以在**裝飾器**（例如 `@Component()`）中明確指定中繼資料，或在被裝飾類別的建構函式宣告中隱含指定。中繼資料會告訴 Angular 如何建構應用程式類別的實例，並在執行階段與其互動。

在以下範例中，`@Component()` 中繼資料物件與類別建構函式會告訴 Angular 如何建立並顯示 `TypicalComponent` 的實例。

```angular-ts

@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>'
})
export class TypicalComponent {
  data = input.required<TypicalData>();
  private someService = inject(SomeService);
}

```

Angular 編譯器只會擷取一次中繼資料，並為 `TypicalComponent` 產生一個_工廠_。當它需要建立 `TypicalComponent` 實例時，Angular 會呼叫該工廠，工廠會產生一個新的視覺元素，並繫結至元件類別的新實例及其注入的依賴。

### 編譯階段

AOT 編譯共有三個階段。

|     | 階段 | 說明 |
| :-- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 程式碼分析 | 在此階段，TypeScript 編譯器與 _AOT 收集器_ 會建立原始碼的表示形式。收集器不會嘗試解讀它所收集的中繼資料。它會盡其所能地表示中繼資料，並在偵測到中繼資料語法違規時記錄錯誤。 |
| 2   | 程式碼產生 | 在此階段，編譯器的 `StaticReflector` 會解讀階段 1 所收集的中繼資料，執行額外的中繼資料驗證，並在偵測到中繼資料限制違規時擲出錯誤。 |
| 3   | 範本型別檢查 | 在此可選階段，Angular _範本編譯器_ 會使用 TypeScript 編譯器驗證範本中的繫結運算式。你可以透過設定 `strictTemplates` 組態選項，明確啟用此階段；請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)。 |

### 中繼資料的限制

你撰寫中繼資料時所用的 TypeScript _子集_，必須符合下列一般限制：

- 將[運算式語法](#expression-syntax-limitations)限制在受支援的 JavaScript 子集內
- 只能在[程式碼摺疊](#code-folding)之後參照已匯出的符號
- 只能呼叫編譯器[支援的函式](#supported-classes-and-functions)
- Input/Output 與資料繫結的類別成員必須是 public 或 protected。如需更多準備應用程式以進行 AOT 編譯的準則與說明，請參閱 [Angular: Writing AOT-friendly applications](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f)。

HELPFUL: AOT 編譯中的錯誤，通常是因為中繼資料不符合編譯器的要求所致（如以下更完整的說明）。如需協助理解並解決這些問題，請參閱 [AOT 中繼資料錯誤](tools/cli/aot-metadata-errors)。

### 設定 AOT 編譯

你可以在控制編譯程序的 [TypeScript 組態檔](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 中提供選項。可用選項的完整清單請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)。

## 階段 1：程式碼分析

TypeScript 編譯器會承擔第一階段的部分分析工作。它會輸出帶有型別資訊的 `.d.ts` _型別定義檔_，供 AOT 編譯器產生應用程式程式碼之用。與此同時，AOT **收集器**會分析記錄在 Angular 裝飾器中的中繼資料，並將中繼資料資訊輸出至 **`.metadata.json`** 檔案，每個 `.d.ts` 檔案對應一份。

你可以把 `.metadata.json` 想成是裝飾器中繼資料整體結構的圖表，以 [抽象語法樹 (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) 的形式表示。

HELPFUL: Angular 的 [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts) 以一組 TypeScript 介面描述了該 JSON 格式。

### 運算式語法限制 {#expression-syntax-limitations}

AOT 收集器只理解 JavaScript 的一個子集。請以下列受限的語法定義中繼資料物件：

| 語法 | 範例 |
| :------------------------ | :--------------------------------------------------------- |
| 物件字面值 | `{cherry: true, apple: true, mincemeat: false}`            |
| 陣列字面值 | `['cherries', 'flour', 'sugar']`                           |
| 陣列字面值中的展開 | `['apples', 'flour', …]`                                   |
| 呼叫 | `bake(ingredients)`                                        |
| new 運算 | `new Oven()`                                               |
| 屬性存取 | `pie.slice`                                                |
| 陣列索引 | `ingredients[0]`                                           |
| 身分參照 | `Component`                                                |
| 範本字串 | <code>`pie is ${multiplier} times better than cake`</code> |
| 字串字面值 | `'pi'`                                                     |
| 數字字面值 | `3.14153265`                                               |
| 布林字面值 | `true`                                                     |
| null 字面值 | `null`                                                     |
| 受支援的前置運算子 | `!cake`                                                    |
| 受支援的二元運算子 | `a+b`                                                      |
| 條件運算子 | `a ? b : c`                                                |
| 括號 | `(a+b)`                                                    |

若運算式使用了不受支援的語法，收集器會將一個錯誤節點寫入 `.metadata.json` 檔案。若編譯器需要該筆中繼資料來產生應用程式程式碼，之後便會回報該錯誤。

HELPFUL: 若你希望 `ngc` 立即回報語法錯誤，而不是產生帶有錯誤的 `.metadata.json` 檔案，請在 TypeScript 組態檔中設定 `strictMetadataEmit` 選項。

```json

"angularCompilerOptions": {
  …
  "strictMetadataEmit" : true
}

```

Angular 函式庫會設定此選項，以確保所有 Angular `.metadata.json` 檔案都乾淨無誤；建置自己的函式庫時，比照辦理也是最佳實務。

### 不支援箭頭函式

AOT 編譯器不支援[函式運算式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function)與[箭頭函式](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)（也稱為 _lambda_ 函式）。

請看以下的元件裝飾器：

```ts

@Component({
  …
  providers: [{provide: server, useFactory: () => new Server()}]
})

```

AOT 收集器不支援在中繼資料運算式中使用箭頭函式 `() => new Server()`。它會在該函式的位置產生一個錯誤節點。當編譯器之後解讀這個節點時，會回報一個錯誤，提示你將箭頭函式轉換為_已匯出的函式_。

你可以改寫為以下形式來修正這個錯誤：

```ts

export function serverFactory() {
  return new Server();
}

@Component({
  …
  providers: [{provide: server, useFactory: serverFactory}]
})

```

在第 5 版及之後的版本中，編譯器會在輸出 `.js` 檔案時自動執行這項重寫。

### 程式碼摺疊 {#code-folding}

編譯器只能解析對**已匯出**符號的參照。然而，收集器可以在收集期間求值一個運算式，並將結果（而非原始運算式）記錄到 `.metadata.json` 中。這讓你能在運算式中有限度地使用未匯出的符號。

例如，收集器可以求值運算式 `1 + 2 + 3 + 4`，並將其替換為結果 `10`。這個過程稱為_摺疊_。能以這種方式化簡的運算式即為_可摺疊_。

收集器可以求值對模組本機 `const` 宣告，以及已初始化的 `var` 與 `let` 宣告的參照，實際上將它們從 `.metadata.json` 檔案中移除。

請看以下的元件定義：

```angular-ts

const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  hero = input.required<Hero>();
}

```

編譯器無法參照 `template` 常數，因為它未被匯出。然而，收集器可以將 `template` 常數摺疊進中繼資料定義中，把其內容內嵌進去。效果就如同你這樣撰寫：

```angular-ts

@Component({
  selector: 'app-hero',
  template: '<div>{{hero().name}}</div>'
})
export class HeroComponent {
  hero = input.required<Hero>();
}

```

此時已不再有對 `template` 的參照，因此當編譯器之後解讀_收集器_在 `.metadata.json` 中的輸出時，也就沒有什麼會造成困擾了。

你可以把這個範例再往前推一步，將 `template` 常數包含在另一個運算式中：

```angular-ts

const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero().title}}</div>'
})
export class HeroComponent {
  hero = input.required<Hero>();
}

```

收集器會將此運算式化簡為其等價的_摺疊_字串：

```angular-ts

'<div>{{hero().name}}</div><div>{{hero().title}}</div>'

```

#### 可摺疊的語法

下表說明收集器可以與不能摺疊哪些運算式：

| 語法 | 可摺疊 |
| :------------------------------- | :--------------------------------------- |
| 物件字面值 | 是 |
| 陣列字面值 | 是 |
| 陣列字面值中的展開 | 否 |
| 呼叫 | 否 |
| new 運算 | 否 |
| 屬性存取 | 是，若目標可摺疊 |
| 陣列索引 | 是，若目標與索引皆可摺疊 |
| 身分參照 | 是，若它參照的是本機符號 |
| 無取代的範本 | 是 |
| 含取代的範本 | 是，若取代內容可摺疊 |
| 字串字面值 | 是 |
| 數字字面值 | 是 |
| 布林字面值 | 是 |
| null 字面值 | 是 |
| 受支援的前置運算子 | 是，若運算元可摺疊 |
| 受支援的二元運算子 | 是，若左右兩側皆可摺疊 |
| 條件運算子 | 是，若條件可摺疊 |
| 括號 | 是，若運算式可摺疊 |

若運算式不可摺疊，收集器會將它以 [AST](https://en.wikipedia.org/wiki/Abstract*syntax*tree) 的形式寫入 `.metadata.json`，供編譯器解析。

## 階段 2：程式碼產生

收集器不會嘗試理解它所收集並輸出至 `.metadata.json` 的中繼資料。它會盡其所能地表示中繼資料，並在偵測到中繼資料語法違規時記錄錯誤。解讀 `.metadata.json` 是編譯器在程式碼產生階段的工作。

編譯器理解收集器支援的所有語法形式，但若中繼資料的_語意_違反編譯器規則，它可能會拒絕_語法上_正確的中繼資料。

### Public 或 protected 符號 {#public-or-protected-symbols}

編譯器只能參照_已匯出的符號_。

- 被裝飾的元件類別成員必須是 public 或 protected。
  你不能將 `input()` 屬性設為 private。

- 資料繫結的屬性也必須是 public 或 protected

### 支援的類別與函式 {#supported-classes-and-functions}

只要語法有效，收集器就能表示函式呼叫或以 `new` 建立物件。 然而，編譯器之後可能會拒絕產生對_特定_函式的呼叫，或建立_特定_物件。

編譯器只能建立特定類別的實例、只支援核心裝飾器，且只支援呼叫會傳回運算式的巨集（函式或靜態方法）。

| 編譯器動作 | 說明 |
| :------------------- | :------------------------------------------------------------------------------------------------------------------- |
| 建立新實例 | 編譯器只允許能建立 `@angular/core` 中 `InjectionToken` 類別實例的中繼資料。 |
| 支援的裝飾器 | 編譯器只支援 [`@angular/core` 模組中的 Angular 裝飾器](api/core#decorators) 的中繼資料。 |
| 函式呼叫 | 工廠函式必須是已匯出的具名函式。AOT 編譯器不支援以 lambda 運算式（「箭頭函式」）作為工廠函式。 |

### 函式與靜態方法呼叫

收集器接受任何只包含單一 `return` 陳述式的函式或靜態方法。然而，編譯器只支援以傳回_運算式_的函式或靜態方法形式存在的巨集。

例如，請看以下函式：

```ts

export function wrapInArray<T>(value: T): T[] {
  return [value];
}

```

你可以在中繼資料定義中呼叫 `wrapInArray`，因為它傳回的運算式值符合編譯器受限的 JavaScript 子集。

你可以像這樣使用 `wrapInArray()`：

```ts

@NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}

```

編譯器會把這種用法視同你這樣撰寫：

```ts

@NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}

```

Angular 的 [`RouterModule`](api/router/RouterModule) 匯出了兩個巨集靜態方法 `forRoot` 與 `forChild`，協助宣告根路由與子路由。請檢閱這些方法的[原始碼](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 'RouterModule.forRoot source code')，了解巨集如何簡化複雜 [NgModules](guide/ngmodules/overview) 的組態設定。

### 中繼資料重寫 {#metadata-rewriting}

編譯器會特別處理包含 `useClass`、`useValue`、`useFactory` 與 `data` 欄位的物件字面值，將初始化其中某個欄位的運算式轉換為一個已匯出的變數，取代該運算式。重寫這些運算式的過程移除了對其內容的所有限制，因為編譯器不需要知道運算式的值——它只需要能產生對該值的參照。

你可能會寫出像這樣的程式碼：

```ts

class TypicalServer {

}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}]
})
export class TypicalModule {}

```

若不重寫，這段程式碼會是無效的，因為 lambda 不受支援，且 `TypicalServer` 未被匯出。為了允許這種寫法，編譯器會自動將它重寫為類似這樣：

```ts

class TypicalServer {

}

export const θ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: θ0}]
})
export class TypicalModule {}

```

如此一來，編譯器就能在工廠中產生對 `θ0` 的參照，而不需要知道 `θ0` 的值包含什麼。

編譯器會在輸出 `.js` 檔案時進行重寫。不過，它不會重寫 `.d.ts` 檔案，因此 TypeScript 不會將它視為一個匯出。它也不會干擾 ES 模組匯出的 API。

## 階段 3：範本型別檢查

Angular 編譯器最有幫助的功能之一，是能在範本內對運算式進行型別檢查，在錯誤造成執行階段當機之前就抓出來。在範本型別檢查階段，Angular 範本編譯器會使用 TypeScript 編譯器驗證範本中的繫結運算式。

若要明確啟用此階段，請在專案 TypeScript 組態檔的 `"angularCompilerOptions"` 中加入編譯器選項 `"fullTemplateTypeCheck"`（請參閱 [Angular 編譯器選項](reference/configs/angular-compiler-options)）。

當在範本繫結運算式中偵測到型別錯誤時，範本驗證會產生錯誤訊息，類似 TypeScript 編譯器針對 `.ts` 檔案中程式碼所回報的型別錯誤。

例如，請看以下元件：

```angular-ts

@Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}'
})
class MyComponent {
  person?: Person;
}

```

這會產生以下錯誤：

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

</docs-code>

錯誤訊息中回報的檔案名稱 `my.component.ts.MyComponent.html`，是範本編譯器產生的合成檔案，存放 `MyComponent` 類別範本的內容。編譯器永遠不會把這個檔案寫入磁碟。行號與欄號是相對於該類別 `@Component` 註解中的範本字串（在此即 `MyComponent`）而言。若元件使用的是 `templateUrl` 而非 `template`，錯誤便會改在 `templateUrl` 所參照的 HTML 檔案中回報，而非合成檔案。

錯誤位置是包含出錯插值運算式的文字節點的開頭。若錯誤出現在屬性繫結中，例如 `[value]="person.address.street"`，錯誤位置即為包含該錯誤的屬性所在位置。

驗證會使用 TypeScript 型別檢查器，以及提供給 TypeScript 編譯器的選項，來控制型別驗證的詳細程度。例如，若指定了 `strictTypeChecks`，除了上述錯誤訊息之外，還會回報以下錯誤：

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'

</docs-code>

同時也會回報上述的錯誤訊息。

### 型別收窄

用在 `ngIf` 指令中的運算式，會被用來在 Angular 範本編譯器中收窄型別聯集，方式就如同 TypeScript 中的 `if` 運算式。例如，為了避免上述範本中出現 `Object is possibly 'undefined'` 錯誤，可將範本修改為只有在 `person` 的值已初始化時才輸出插值，如下所示：

```angular-ts

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>'
})
class MyComponent {
  person?: Person;
}

```

使用 `*ngIf` 能讓 TypeScript 編譯器推斷繫結運算式中使用的 `person` 永遠不會是 `undefined`。

如需更多關於輸入型別收窄的資訊，請參閱[改進自訂指令的範本型別檢查](guide/directives/structural-directives#directive-type-checks)。

### 非 null 型別斷言運算子

當使用 `*ngIf` 不方便，或元件中的某些約束能確保繫結運算式被插值時該運算式永遠不為 null 時，可使用非 null 型別斷言運算子來抑制 `Object is possibly 'undefined'` 錯誤。

在以下範例中，`person` 與 `address` 屬性總是同時設定，這意味著若 `person` 不為 null，`address` 也永遠不為 null。沒有方便的方法能把這項約束描述給 TypeScript 與範本編譯器，但範例中透過使用 `address!.street` 抑制了該錯誤。

```ts

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

非 null 斷言運算子應謹慎使用，因為元件重構可能會破壞這項約束。

在此範例中，建議把對 `address` 的檢查也包含在 `*ngIf` 中，如下所示：

```ts

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person &amp;&amp; address"> {{person.name}} lives on {{address.street}} </span>'
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
