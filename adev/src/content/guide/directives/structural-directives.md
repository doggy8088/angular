# 結構指令

結構指令是套用在 `<ng-template>` 元素上的指令，會依條件或重複地算繪該 `<ng-template>` 的內容。

## 使用案例範例

在本指南中，你將建立一個結構指令，它會從指定的資料來源擷取資料，並在該資料可用時算繪其範本。這個指令稱為 `SelectDirective`，名稱源自 SQL 關鍵字 `SELECT`，並以屬性選擇器 `[select]` 進行比對。

`SelectDirective` 會有一個名為 `selectFrom` 的輸入，用來指定要使用的資料來源。這個輸入的 `select` 前綴對[簡寫語法](#structural-directive-shorthand)很重要。該指令會帶著提供所選資料的範本上下文，具現化它的 `<ng-template>`。

以下範例示範如何直接在 `<ng-template>` 上使用這個指令：

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

結構指令可以等到資料可用後，再算繪它的 `<ng-template>`。

HELPFUL: 請注意，Angular 的 `<ng-template>` 元素定義了一個依預設不會算繪任何內容的範本；如果你只是把元素包在 `<ng-template>` 裡，卻沒有套用結構指令，這些元素就不會被算繪。

如需更多資訊，請參閱 [ng-template API](api/core/ng-template) 文件。

## 結構指令簡寫 {#structural-directive-shorthand}

Angular 支援結構指令的簡寫語法，讓你不必明確撰寫 `<ng-template>` 元素。

在指令的屬性選擇器前加上星號（`*`），例如 `*select`，就能把結構指令直接套用到元素上。Angular 會把結構指令前面的星號轉換成一個 `<ng-template>`，由它承載該指令並包住該元素及其後代元素。

你可以如下搭配 `SelectDirective` 使用：

```angular-html
<p *select="let data; from: source">The data is: {{ data }}</p>
```

這個範例展現了結構指令簡寫語法的彈性，這種語法有時稱為_微語法_。

以這種方式使用時，只有結構指令及其繫結會被套用到 `<ng-template>`。`<p>` 標籤上的其他屬性或繫結都不受影響。例如，下列兩種形式是等價的：

```angular-html
<!-- Shorthand syntax: -->
<p class="data-view" *select="let data; from: source">The data is: {{ data }}</p>

<!-- Long-form syntax: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{ data }}</p>
</ng-template>
```

簡寫語法是透過一組慣例展開的。更完整的[文法](#structural-directive-syntax-reference)定義在下方，不過以上述範例來說，這個轉換可以這樣解釋：

`*select` 運算式的第一部分是 `let data`，它宣告了一個範本變數 `data`。由於後面沒有指派，這個範本變數會繫結到範本上下文屬性 `$implicit`。

第二段語法是鍵與運算式的組合 `from source`。`from` 是繫結鍵，`source` 是一般的範本運算式。繫結鍵會先轉換為 PascalCase，再在前面加上結構指令的選擇器，藉此對應到屬性。`from` 鍵對應到 `selectFrom`，再繫結到運算式 `source`。這就是為什麼許多結構指令的輸入全都以結構指令的選擇器作為前綴。

## 每個元素只能有一個結構指令 {#one-structural-directive-per-element}

使用簡寫語法時，每個元素只能套用一個結構指令。這是因為該指令只能展開到一個 `<ng-template>` 元素上。多個指令需要多個巢狀的 `<ng-template>`，而且無法確定哪個指令應該排第一。當多個結構指令需要套用在同一個實際 DOM 元素或元件周圍時，可以使用 `<ng-container>` 建立包裝層，讓使用者自行定義巢狀結構。

## 建立結構指令

本節將引導你建立 `SelectDirective`。

<docs-workflow>
<docs-step title="產生指令">
使用 Angular CLI 執行下列指令，其中 `select` 是指令的名稱：

```shell
ng generate directive select
```

Angular 會建立指令類別，並指定 CSS 選擇器 `[select]`，用來在範本中識別該指令。
</docs-step>
<docs-step title="讓指令成為結構指令">
匯入 `TemplateRef` 與 `ViewContainerRef`。將 `TemplateRef` 與 `ViewContainerRef` 作為私有屬性注入指令。

```ts
import {Directive, TemplateRef, ViewContainerRef, inject} from '@angular/core';

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}
```

</docs-step>
<docs-step title="加入 'selectFrom' 輸入">
加入一個 `selectFrom` `input()` 屬性。

```ts
export class SelectDirective {
  // ...
  selectFrom = input.required<DataSource>();
}
```

</docs-step>
<docs-step title="加入業務邏輯">
`SelectDirective` 現在已具備結構指令的鷹架與其輸入，接著可以加入擷取資料並以該資料算繪範本的邏輯：

```ts
export class SelectDirective {
  // ...
  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Create the embedded view with a context object that contains
      // the data via the key `$implicit`.
      $implicit: data,
    });
  }
}
```

</docs-step>
</docs-workflow>

這樣就完成了——`SelectDirective` 已可運作。後續步驟可以考慮[加入範本型別檢查支援](#typing-the-directives-context)。

## 結構指令語法參考 {#structural-directive-syntax-reference}

撰寫自己的結構指令時，請使用下列語法：

```ts {hideCopy}
_: prefix = "( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )_";
```

下列模式描述了結構指令文法的每個部分：

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| 關鍵字       | 說明                         |
| :----------- | :--------------------------- |
| `prefix`     | HTML 屬性鍵                  |
| `key`        | HTML 屬性鍵                  |
| `local`      | 在範本中使用的區域變數名稱   |
| `export`     | 指令以指定名稱匯出的值       |
| `expression` | 標準 Angular 運算式          |

### Angular 如何轉譯簡寫

Angular 會把結構指令簡寫轉譯為一般的繫結語法，如下所示：

| 簡寫                            | 轉譯結果                                                        |
| :------------------------------ | :-------------------------------------------------------------- |
| `prefix` 與裸 `expression`      | `[prefix]="expression"`                                         |
| `keyExp`                        | `[prefixKey]="expression"`（會把 `prefix` 加到 `key` 前面）     |
| `let local`                     | `let-local="export"`                                            |

### 簡寫範例

下表提供簡寫範例：

| 簡寫                                                                  | Angular 如何解讀該語法                                                                                        |
| :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `*myDir="let item of [1,2,3]"`                                        | `<ng-template myDir let-item [myDirOf]="[1, 2, 3]">`                                                          |
| `*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" [myDirTrackBy]="myTrack" let-i="index">` |
| `*ngComponentOutlet="componentClass";`                                 | `<ng-template [ngComponentOutlet]="componentClass">`                                                          |
| `*ngComponentOutlet="componentClass; inputs: myInputs";`               | `<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">`                     |
| `*myDir="exp as value"`                                               | `<ng-template [myDir]="exp" let-value="myDir">`                                                               |

## 改善自訂指令的範本型別檢查 {#improving-template-type-checking-for-custom-directives}

你可以為指令定義加入範本守衛，來改善自訂指令的範本型別檢查。這些守衛能協助 Angular 範本型別檢查器在編譯時期找出範本中的錯誤，進而避免執行時期錯誤。守衛有兩種不同的類型：

- `ngTemplateGuard_(input)` 讓你能依特定輸入的型別，控制輸入運算式應如何縮小範圍。
- `ngTemplateContextGuard` 用來依指令本身的型別，決定範本上下文物件的型別。

本節提供這兩種守衛的範例。如需更多資訊，請參閱[範本型別檢查](tools/cli/template-typecheck 'Template type-checking guide')。

### 以範本守衛進行型別縮小

範本中的結構指令控制該範本在執行時期是否算繪。有些結構指令想依輸入運算式的型別來進行型別縮小。

輸入守衛可以進行兩種縮小：

- 依 TypeScript 型別斷言函式縮小輸入運算式。
- 依輸入運算式是否為真值來縮小輸入運算式。

若要透過定義型別斷言函式來縮小輸入運算式：

```ts
// This directive only renders its template if the actor is a user.
// You want to assert that within the template, the type of the `actor`
// expression is narrowed to `User`.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // The return statement is unnecessary in practice, but included to
    // prevent TypeScript errors.
    return true;
  }
}
```

型別檢查在範本中的行為，就如同已對繫結到該輸入的運算式套用了 `ngTemplateGuard_actor` 斷言。

有些指令只在輸入為真值時才算繪其範本。型別斷言函式無法完整捕捉真值性的語義，因此可以改用字面型別 `'binding'`，向範本型別檢查器表明：應以繫結運算式本身作為守衛：

```ts
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();

  static ngTemplateGuard_condition: 'binding';
}
```

範本型別檢查器的行為，就如同已斷言繫結到 `condition` 的運算式在範本中為真值。

### 為指令的上下文定型別 {#typing-the-directives-context}

如果你的結構指令為具現化的範本提供了上下文，你可以提供靜態的 `ngTemplateContextGuard` 型別斷言函式，在範本中正確地為它定型別。這個函式可以利用指令的型別推導出上下文的型別，當指令的型別是泛型時特別有用。

對於上述的 `SelectDirective`，你可以實作 `ngTemplateContextGuard` 來正確指定資料型別，即使資料來源是泛型也沒問題。

```ts
// Declare an interface for the template context:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // The directive's generic type `T` will be inferred from the `DataSource` type
  // passed to the input.
  selectFrom = input.required<DataSource<T>>();

  // Narrow the type of the context using the generic type of the directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
```
