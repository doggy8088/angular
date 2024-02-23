# 結構指令

構造性指令是套用於 `<ng-template>` 元素的指令，有條件或重複地呈現該 `<ng-template>` 的內容。

## 範例使用案例

在本指南中，您將建立一個結構性指令，它會從給定的資料來源擷取資料，並在資料可用時呈現其範本。這個指令稱為 `SelectDirective`，以 SQL 關鍵字 `SELECT` 命名，並與屬性選擇器 `[select]` 匹配。

`SelectDirective` 將會有一個輸入，命名為要使用的資料來源，您會稱之為 `selectFrom`。此輸入的 `select` 前綴對於 [簡寫語法](#structural-directive-shorthand) 來說很重要。指令會以提供所選資料的範本內容，實例化其 `<ng-template>`。

以下是一個範例，說明如何直接在 `<ng-template>` 上使用此指令：

```html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

結構型指令可以等待數據可用，然後呈現其 `<ng-template>`。

HELPFUL：請注意 Angular 的 `<ng-template>` 元素定義了一個預設不呈現任何內容的範本，如果你只是將元素包在 `<ng-template>` 中而沒有套用結構性指令，這些元素將不會被呈現。

如需更多資訊，請參閱 [ng-template API](api/core/ng-template) 文件。

## 結構性指令簡寫

Angular 支援結構性指令的簡寫語法，避免需要顯式地撰寫 `<ng-template>` 元素。

結構指令可直接套用在元素上，方法是使用星號 (`*`) 作為指令屬性選取器的字首，例如 `*select`。Angular 會將結構指令前面的星號轉換成一個 `<ng-template>`，作為指令的宿主，並包圍元素及其子代。

你可以使用這個與 `SelectDirective` 如下：

```html
<p *select="let data from source">The data is: {{data}}</p>
```

以下範例顯示結構指令簡寫語法的彈性，這有時稱為「微語法」。

當以這種方式使用時，只有結構指令及其繫結套用於 `<ng-template>`。`<p>` 標籤上的任何其他屬性或繫結都會保留。例如，這兩種形式是等效的：

```html
<!-- Shorthand syntax: -->
<p class="data-view" *select="let data from source">The data is: {{data}}</p>

<!-- Long-form syntax: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{data}}</p>
</ng-template>
```

簡寫語法是透過一組慣例來擴充的。更詳盡的[語法](#structural-directive-syntax-reference)定義如下，但在上述範例中，此轉換可以說明如下：

`*select` 運算式的第一部分是 `let data`，它宣告一個範本變數 `data`。由於沒有後續的指定，因此範本變數繫結到範本內容屬性 `$implicit`。

第二個語法是關鍵字-表達式配對，`from source`。`from` 是繫結關鍵字，`source` 是常規範本表達式。繫結關鍵字會透過轉換成 PascalCase 以及在最前面加上結構性指令選擇器來對應至屬性。`from` 關鍵字會對應至 `selectFrom`，然後繫結至表達式 `source`。這就是為什麼許多結構性指令會擁有所有以結構性指令選擇器為前綴的輸入。

## 每個元素只有一個結構指令

使用簡寫語法時，您只能對每個元素套用一個結構性指令。這是因為只有一個 `<ng-template>` 元素，該指令會在該元素上展開。多個指令需要多個巢狀 `<ng-template>`，而應該先使用哪個指令並不清楚。當需要在同一個實體 DOM 元素或元件周圍套用多個結構性指令時，可以使用 `<ng-container>` 來建立包裝層，這允許使用者定義巢狀結構。

## 建立結構性指令

以下章節將引導您建立 `SelectDirective`。

<docs-workflow>
<docs-step title="產生指令">
使用 Angular CLI，執行以下指令，其中 `select` 是指令的名稱：

```shell
ng generate directive select
```

Angular 建立指令類別，並指定 CSS 選擇器 `[select]`，以在範本中識別指令。
</docs-step>
<docs-step title="使指令具有結構">
匯入 `TemplateRef` 和 `ViewContainerRef`。在指令建構函式中注入 `TemplateRef` 和 `ViewContainerRef` 作為私人變數。

```ts
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  standalone: true,
  selector: 'select',
})
export class SelectDirective {
  constructor(private templateRef: TemplateRef, private ViewContainerRef: ViewContainerRef) {}
}

```

</docs-step>
<docs-step title="新增 'selectFrom' 輸入內容">
新增一個 `selectFrom` `@Input()` 屬性。

```ts
export class SelectDirective {
  // ...

  @Input({required: true}) selectFrom!: DataSource;
}
```

</docs-step>
<docs-step title="加入商業邏輯">
使用 `SelectDirective` 現在可作為結構性指令與輸入進行架構，您現在可加入邏輯以擷取資料並使用它來呈現範本：

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

完成了 - `SelectDirective` 已經啟動並執行。後續步驟可能是 [新增範本類型檢查支援](#為指令內容鍵入)。

## 結構性指令語法參考

當您撰寫自己的結構性指令時，請使用下列語法：

<docs-code hideCopy language="typescript">

&ast;:prefix="( :let &verbar; :expression ) (';' &verbar; ',')? ( :let &verbar; :as &verbar; :keyExp )&ast;"

</docs-code>

以下模式描述結構化指令語法的每個部分：

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| 關鍵字      | 詳細資料                                            |
| :----------- | :------------------------------------------------- |
| `prefix`     | HTML 屬性鍵                                        |
| `key`        | HTML 屬性鍵                                        |
| `local`      | 範本中使用的區域變數名稱                             |
| `export`     | 指令在給定名稱下導出的值                             |
| `expression` | 標準的 Angular 運算式                                |

### Angular 如何轉換簡寫

Angular 將結構指令簡寫轉換為正常的繫結語法，如下：

| 簡寫 | 翻譯 |
|:--- |:--- |
| `prefix` 和裸 `expression` | `[prefix]="expression"` |
| `keyExp` | `[prefixKey]="expression"` (`prefix` 加到 `key` 上) |
| `let local` | `let-local="export"` |

### 簡寫範例

以下表格提供速記範例：

| 簡寫 | Angular 如何解釋語法 |
|:--- |:--- |
| `*ngFor="let item of [1,2,3]"` | `<ng-template ngFor let-item [ngForOf]="[1, 2, 3]">` |
| `*ngFor="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template ngFor let-item [ngForOf]="[1,2,3]" let-items="ngForOf" [ngForTrackBy]="myTrack" let-i="index">` |
| `*ngIf="exp"`| `<ng-template [ngIf]="exp">` |
| `*ngIf="exp as value"` | `<ng-template [ngIf]="exp" let-value="ngIf">` |

## 改進自訂指令的範本類型檢查

您可以透過在指令定義中加入範本防護，來改善自訂指令的範本類型檢查。
這些防護有助於 Angular 範本類型檢查器在編譯時找到範本中的錯誤，可避免執行階段錯誤。
有兩種不同的防護類型：

* `ngTemplateGuard_(input)` 可讓您控制如何基於特定輸入的類型來縮小輸入表達式。
* `ngTemplateContextGuard` 用於根據指令本身的類型來決定範本的內容物件的類型。

此區段提供兩種防護機制的範例。
如需更多資訊，請參閱 [範本類型檢查](tools/cli/template-typecheck "範本類型檢查指南")。

### 使用範本防護進行類型縮小

範本中的結構性指令控制該範本是否在執行時期呈現。一些結構性指令想要根據輸入表達式的類型來執行類型縮小。

輸入防護具中可能有兩種狹窄：

* 根據 TypeScript 型別斷言函式縮小輸入表達式。
* 根據其真假值縮小輸入表達式。

要藉由定義類型斷言函式來縮小輸入表達式：

```ts
// This directive only renders its template if the actor is a user.
// You want to assert that within the template, the type of the `actor`
// expression is narrowed to `User`.
@Directive(...)
class ActorIsUser {
  @Input() actor: User|Robot;

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User|Robot): expr is User {
    // The return statement is unnecessary in practice, but included to
    // prevent TypeScript errors.
    return true;
  }
}
```

在範本內進行型別檢查時，會將 `ngTemplateGuard_actor` 斷言套用至輸入所繫結的表達式。

某些指令僅在輸入為真時才呈現其範本。無法在類型斷言函式中捕捉到真值的完整語義，因此可以使用文字類型 `'binding'` 來向範本類型檢查器發出訊號，表示應該將繫結表達式本身用作防護：

```ts
@Directive(...)
class CustomIf {
  @Input() condition!: any;

  static ngTemplateGuard_condition: 'binding';
}
```

範本類型檢查器會像在範本中已宣告 `condition` 的繫結表達式為真一樣運作。

### 鍵入指令的內容

如果結構指令提供一個給實例化範本的內容，您可以透過提供靜態的 `ngTemplateContextGuard` 類型斷言函式，在範本內適當地輸入它。此函式可以使用指令的類型來推導內容的類型，這在指令的類型是泛型時非常有用。

對於上面所描述的 `SelectDirective`，您可以實作一個 `ngTemplateContextGuard` 來正確指定資料類型，即使資料來源是泛型的。

```ts
// Declare an interface for the template context:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // The directive's generic type `T` will be inferred from the `DataSource` type
  // passed to the input.
  @Input({required: true}) selectFrom!: DataSource<T>;

  // Narrow the type of the context using the generic type of the directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
```
