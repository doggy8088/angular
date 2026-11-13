# 撰寫結構指令

本主題示範如何建立結構指令，並提供概念性資訊，說明指令的運作方式、Angular 如何解讀簡寫，以及如何加入範本守衛屬性來捕捉範本型別錯誤。

<div class="alert is-helpful">

關於本頁所述的範例應用程式，請參閱 <live-example></live-example>。

</div>

如需更多關於 Angular 內建結構指令（例如 `NgIf`、`NgFor` 與 `NgSwitch`）的資訊，請參閱[內建指令](guide/built-in-directives)。

{@a unless}

## 建立結構指令

本節將引導你建立一個 `UnlessDirective`，以及如何設定 `condition` 值。
`UnlessDirective` 的作用與 `NgIf` 相反，而 `condition` 值可以設定為 `true` 或 `false`。
`NgIf` 在條件為 `true` 時顯示範本內容。
`UnlessDirective` 在條件為 `false` 時顯示內容。

以下是套用到段落元素的 `UnlessDirective` 選擇器 `appUnless`。
當 `condition` 為 `false` 時，瀏覽器會顯示該句話。

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless-1)" region="appUnless-1"></code-example>

1. 使用 Angular CLI，執行下列指令，其中 `unless` 是指令的名稱：

  ```bash

  ng generate directive unless

  ```

  Angular 會建立指令類別，並指定 CSS 選擇器 `appUnless`，用來在範本中識別該指令。

1. 匯入 `Input`、`TemplateRef` 與 `ViewContainerRef`。

  <code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (skeleton)" region="skeleton"></code-example>

1. 在指令建構子中注入 `TemplateRef` 與 `ViewContainerRef`，作為私有變數。

  <code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (ctor)" region="ctor"></code-example>

  `UnlessDirective` 會從 Angular 產生的 `<ng-template>` 建立一個[內嵌視圖](api/core/EmbeddedViewRef "API: EmbeddedViewRef")，並把該視圖插入到指令原始 `<p>` 主元素旁邊的[視圖容器](api/core/ViewContainerRef "API: ViewContainerRef")中。

  [`TemplateRef`](api/core/TemplateRef "API: TemplateRef") 可協助你取得 `<ng-template>` 的內容，而 [`ViewContainerRef`](api/core/ViewContainerRef "API: ViewContainerRef") 則可存取視圖容器。

1. 加入一個帶有 setter 的 `appUnless` `@Input()` 屬性。

  <code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (set)" region="set"></code-example>

  每當條件的值變更時，Angular 就會設定 `appUnless` 屬性。

    * 如果條件為 falsy，且 Angular 之前尚未建立視圖，setter 會讓視圖容器從範本建立內嵌視圖。

    * 如果條件為 truthy，且視圖目前正在顯示，setter 會清除容器，進而處置該視圖。

完整的指令如下：

<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (excerpt)" region="no-docs"></code-example>

### 測試指令

在本節中，你將更新應用程式以測試 `UnlessDirective`。

1. 在 `AppComponent` 中加入一個設定為 `false` 的 `condition`。

  <code-example path="structural-directives/src/app/app.component.ts" header="src/app/app.component.ts (excerpt)" region="condition"></code-example>

1. 更新範本以使用該指令。
  在這裡，`*appUnless` 位於兩個 `<p>` 標籤上，帶有相反的 `condition` 值，一個是 `true`，一個是 `false`。

  <code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless)" region="appUnless"></code-example>

  星號是簡寫，用來標示 `appUnless` 為結構指令。
  當 `condition` 為 falsy 時，上方（A）段落會出現，下方（B）段落會消失。
  當 `condition` 為 truthy 時，上方（A）段落會消失，下方（B）段落會出現。

1. 若要在瀏覽器中變更並顯示 `condition` 的值，請加入顯示狀態與按鈕的標記。

  <code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html" region="toggle-info"></code-example>

若要驗證指令是否正常運作，請點選按鈕來變更 `condition` 的值。

  <div class="lightbox">
    <img src='generated/images/guide/structural-directives/unless-anim.gif' alt="UnlessDirective 實際運作">
  </div>


{@a shorthand}
{@a asterisk}

## 結構指令簡寫

結構指令上的星號 `*` 語法（例如 `*ngIf`）是一種簡寫，Angular 會把它解讀成長形式。
Angular 會把結構指令前面的星號轉換成一個包住主元素及其子元素的 `<ng-template>`。

以下是一個 `*ngIf` 的範例，在 `hero` 存在時顯示英雄的名稱：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (asterisk)" region="asterisk"></code-example>

`*ngIf` 指令會移到 `<ng-template>` 上，在那裡它會變成方括號形式的屬性繫結 `[ngIf]`。
其餘的 `<div>`，包括它的 class 屬性，會移到 `<ng-template>` 裡面。

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-template)" region="ngif-template"></code-example>

Angular 不會建立一個真正的 `<ng-template>` 元素，而是只把 `<div>` 與一個註解節點佔位符渲染到 DOM。

```html
<!--bindings={
  "ng-reflect-ng-if": "[object Object]"
}-->
<div _ngcontent-c0>Mr. Nice</div>

```

以下範例比較了 `*ngFor` 中星號的簡寫用法與長形式的 `<ng-template>`：

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (inside-ngfor)" region="inside-ngfor"></code-example>

在這裡，所有與 `ngFor` 結構指令相關的內容都會套用到 `<ng-template>`。
元素上的所有其他繫結與屬性則套用到 `<ng-template>` 內的 `<div>` 元素。
主元素上的其他修飾詞，除了 `ngFor` 字串之外，在元素移入 `<ng-template>` 時會留在原位。
在這個範例中，`[class.odd]="odd"` 會留在 `<div>` 上。

`let` 關鍵字會宣告一個範本輸入變數，你可以在範本內參照它。
本範例中的輸入變數是 `hero`、`i` 與 `odd`。
解析器會把 `let hero`、`let i` 與 `let odd` 轉譯成名為 `let-hero`、`let-i` 與 `let-odd` 的變數。
`let-i` 與 `let-odd` 變數會變成 `let i=index` 與 `let odd=odd`。
Angular 會把 `i` 與 `odd` 設定為脈絡中 `index` 與 `odd` 屬性的目前值。

解析器會對所有指令套用 PascalCase，並在前面加上指令的屬性名稱，例如 ngFor。
舉例來說，`ngFor` 的輸入屬性 `of` 與 `trackBy` 會對映到 `ngForOf` 與 `ngForTrackBy`。
當 `NgFor` 指令逐一走訪清單時，它會設定並重設自己脈絡物件的屬性。
這些屬性可以包括但不限於 `index`、`odd`，以及一個名為 `$implicit` 的特殊屬性。

Angular 會把 `let-hero` 設定為脈絡中 `$implicit` 屬性的值，而 `NgFor` 已經用目前迭代的英雄來初始化該屬性。

如需更多資訊，請參閱 [NgFor API](api/common/NgForOf "API: NgFor") 與 [NgForOf API](api/common/NgForOf) 文件。

### 使用 `<ng-template>` 建立範本片段

Angular 的 `<ng-template>` 元素定義了一個預設不會渲染任何內容的範本。
使用 `<ng-template>`，你可以手動渲染內容，完全掌控內容的顯示方式。

如果沒有結構指令，而你把一些元素包在 `<ng-template>` 中，這些元素會消失。
在以下範例中，Angular 不會渲染「Hip! Hip! Hooray!」這句話中間的「Hip!」，因為它被 `<ng-template>` 包住。

<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (template-tag)" region="template-tag"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/structural-directives/template-rendering.png' alt="範本標籤渲染">
</div>

## 結構指令語法參考

撰寫自己的結構指令時，請使用下列語法：

```
*:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )*"
```

下列表格描述了結構指令文法的每個部分：

<table>

  <tr>
    <td><code>prefix</code></td>
    <td>HTML 屬性鍵</td>
  </tr>
  <tr>
    <td><code>key</code></td>
    <td>HTML 屬性鍵</td>
  </tr>
  <tr>
    <td><code>local</code></td>
    <td>在範本中使用的區域變數名稱</td>
  </tr>
  <tr>
    <td><code>export</code></td>
    <td>指令以指定名稱匯出的值</td>
  </tr>
  <tr>
    <td><code>expression</code></td>
    <td>標準 Angular 運算式</td>
  </tr>
</table>

<table>
  <tr>
    <th></th>
  </tr>
  <tr>
    <td colspan="3"><code>keyExp = :key ":"? :expression ("as" :local)? ";"? </code></td>
  </tr>
  <tr>
    <td colspan="3"><code>let = "let" :local "=" :export ";"?</code></td>
  </tr>
  <tr>
    <td colspan="3"><code>as = :export "as" :local ";"?</code></td>
  </tr>
</table>

### Angular 如何轉譯簡寫

Angular 會把結構指令簡寫轉譯為一般的繫結語法，如下所示：

<table>
  <tr>
    <th>簡寫</th>
    <th>轉譯結果</th>
  </tr>
  <tr>
    <td><code>prefix</code> 與裸 <code>expression</code></td>
    <td><code>[prefix]="expression"</code></td>
  </tr>
  <tr>
    <td><code>keyExp</code></td>
    <td><code>[prefixKey] "expression"
    (let-prefixKey="export")</code>
    <br />
    請注意，<code>prefix</code>
    會加到 <code>key</code> 上
    </td>
  </tr>
  <tr>
    <td><code>let</code></td>
    <td><code>let-local="export"</code></td>
  </tr>
</table>

### 簡寫範例

下表提供簡寫範例：

<table>
  <tr>
    <th>簡寫</th>
    <th>Angular 如何解讀該語法</th>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3]"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3] as items; trackBy: myTrack; index as i"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]" let-items="ngForOf" [ngForTrackBy]="myTrack" let-i="index"&gt;</code>
    </td>
  </tr>
  <tr>
    <td><code>*ngIf="exp"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngIf="exp as value"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp" let-value="ngIf"&gt;</code></td>
  </tr>
</table>

{@a directive-type-checks}

<!-- To do follow up PR: move this section to a more general location because it also applies to attribute directives. -->
## 改善自訂指令的範本型別檢查

你可以為自訂指令加入範本守衛屬性，來改善範本型別檢查。
這些屬性可以協助 Angular 範本型別檢查器在編譯時期找出範本中的錯誤，進而避免執行時期錯誤。
這些屬性如下：

* 屬性 `ngTemplateGuard_(someInputProperty)` 可讓你為範本內的輸入運算式指定更精確的型別。
* `ngTemplateContextGuard` 靜態屬性可宣告範本脈絡的型別。

本節提供這兩種型別守衛屬性的範例。
如需更多資訊，請參閱[範本型別檢查](guide/template-typecheck "Template type-checking guide")。

{@a narrowing-input-types}

### 使用範本守衛讓範本內的型別需求更具體

範本中的結構指令會根據其輸入運算式，控制該範本是否在執行時期渲染。
為了協助編譯器捕捉範本型別錯誤，你應該盡可能精確地指定指令輸入運算式在範本內出現時所需的型別。

型別守衛函式會把輸入運算式的預期型別，縮小為在執行時期可能傳給範本內指令的型別子集。
你可以提供這樣的函式，協助型別檢查器在編譯時期推斷該運算式的正確型別。

舉例來說，`NgIf` 的實作使用型別縮小，來確保只有在 `*ngIf` 的輸入運算式為 truthy 時才會具現化範本。
若要提供具體的型別需求，`NgIf` 指令定義了一個[靜態屬性 `ngTemplateGuard_ngIf: 'binding'`](api/common/NgIf#static-properties)。
`binding` 值是一種常見型別縮小的特殊情形，在這種情形中，輸入運算式會被求值，以滿足型別需求。

若要為範本內指令的輸入運算式提供更具體的型別，請在指令中加入 `ngTemplateGuard_xx` 屬性，其中靜態屬性名稱的後綴 `xx` 是 `@Input()` 欄位名稱。
該屬性的值可以是根據其回傳型別而定的一般型別縮小函式，或是像 `NgIf` 情形中的字串 `"binding"`。

舉例來說，請看下列結構指令，它把範本運算式的結果當作輸入：

<code-example language="ts" header="IfLoadedDirective">
export type Loaded<T> = { type: 'loaded', data: T };
export type Loading = { type: 'loading' };
export type LoadingState<T> = Loaded<T> | Loading;
export class IfLoadedDirective<T> {
    @Input('ifLoaded') set state(state: LoadingState<T>) {}
    static ngTemplateGuard_state<T>(dir: IfLoadedDirective<T>, expr: LoadingState<T>): expr is Loaded<T> { return true; };
}

export interface Person {
  name: string;
}

@Component({
  template: `&lt;div *ifLoaded="state">{{ state.data }}&lt;/div>`,
})
export class AppComponent {
  state: LoadingState<Person>;
}
</code-example>

在本範例中，`LoadingState<T>` 型別允許兩種狀態：`Loaded<T>` 或 `Loading`。用作指令 `state` 輸入的運算式屬於概括型別 `LoadingState`，因為在那個時間點還不知道載入狀態為何。

`IfLoadedDirective` 的定義宣告了靜態欄位 `ngTemplateGuard_state`，用來表達縮小行為。
在 `AppComponent` 範本中，`*ifLoaded` 結構指令只有在 `state` 實際上是 `Loaded<Person>` 時，才應該渲染這個範本。
型別守衛可讓型別檢查器推斷範本內 `state` 可接受的型別是 `Loaded<T>`，並進一步推斷 `T` 必須是 `Person` 的執行個體。

{@a narrowing-context-type}

### 為指令的脈絡定型別

如果你的結構指令為具現化的範本提供脈絡，你可以提供一個靜態 `ngTemplateContextGuard` 函式，在範本內正確地為其指定型別。
以下程式碼片段展示了這類函式的一個範例。

<code-example language="ts" header="myDirective.ts">
@Directive({…})
export class ExampleDirective {
    // Make sure the template checker knows the type of the context with which the
    // template of this directive will be rendered
    static ngTemplateContextGuard(dir: ExampleDirective, ctx: unknown): ctx is ExampleContext { return true; };

    // …
}
</code-example>
