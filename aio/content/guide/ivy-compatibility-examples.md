# Ivy 相容性範例

本附錄旨在提供關於 Ivy 變更的更多背景資訊。這些範例中有許多列出了你可能會看到的錯誤訊息，因此如果你正在除錯，依錯誤訊息搜尋可能是個好主意。

<div class="alert is-critical">
注意：這些問題大多只影響少數遇到不尋常或罕見邊界情況的應用程式。
</div>


{@a content-children-descendants}
## @ContentChildren 查詢預設只比對直接子節點


### 變更的基本範例

假設有一個元件（`Comp`），它有一個針對 `'foo'` 的 `@ContentChildren` 查詢：

```html
<comp>
    <div>
         <div #foo></div>   <!-- matches in old runtime, not in new runtime -->
    </div>
</comp>
```

在先前的執行時期中，帶有 `#foo` 的 `<div>` 會比對成功。
在 Ivy 中，那個 `<div>` 不會比對成功，因為它不是 `<comp>` 的直接子節點。


### 背景

預設情況下，`@ContentChildren` 查詢的 `descendants` 旗標設為 `false`。

在先前的渲染引擎中，「descendants」指的是「後代指令」。
只要在元素與發出請求的指令之間沒有其他指令，元素就可以比對成功。
這對具有嵌套結構的指令（如 tabs）來說是合理的，因為嵌套的 tab 指令可能不希望被比對到。
然而，這對使用者造成了出乎意料的行為，因為在包裝元素上加入像 `ngClass` 這樣不相關的指令，就可能使查詢結果失效。

例如，對於下方的內容查詢與範本，最後兩個 `Tab` 指令不會比對成功：

```
@ContentChildren(Tab, {descendants: false}) tabs: QueryList<Tab>
```

```
<tab-list>
  <div>
    <tab> One </tab>     <!-- match (nested in element) -->
  </div>
  <tab>                  <!-- match (top level) -->
    <tab> A </tab>       <!-- not a match (nested in tab) -->
  </tab>
  <div [ngClass]="classes">
    <tab> Two </tab>     <!-- not a match (nested in ngClass) -->
  </div>
</tab-list>
```

此外，型別述詞與字串述詞之間的差異既細微，有時又不清楚。
例如，如果你把上方的型別述詞換成 `'foo'` 字串述詞，比對結果就會改變：

```
@ContentChildren('foo', {descendants: false}) foos: QueryList<ElementRef>
```

```
<tab-list>
  <div>
    <div #foo> One </div>     <!-- match (nested in element) -->
  </div>
  <tab #foo>                  <!-- match (top level) -->
    <div #foo> A </div>       <!-- match (nested in tab) -->
  </tab>
  <div [ngClass]="classes">
    <div #foo> Two </div>     <!-- match (nested in ngClass) -->
  </div>
</tab-list>
```

由於先前的行為不一致且讓使用者感到意外，我們不想在 Ivy 中重現它。
相反地，我們簡化了心智模型，讓「descendants」只指 DOM 嵌套。
在發出請求的元件與潛在比對物件之間的任何 DOM 元素，都會使該比對失效。
型別述詞與字串述詞的比對行為也完全相同。

指令／字串述詞的 Ivy 行為：
```
<tab-list>
  <div>
    <tab> One </tab>     <!-- not a match (nested in element) -->
  </div>
  <tab>                  <!-- match (top level) -->
    <tab> A </tab>       <!-- not a match (nested in tab) -->
  </tab>
  <div [ngClass]="classes">
    <tab> Two </tab>     <!-- not a match (nested in div) -->
  </div>
</tab-list>
```


### 錯誤範例

你看到的錯誤訊息，將取決於該內容查詢在應用程式程式碼中的使用方式。
通常，當程式碼參照內容查詢結果（現在是 `undefined`）的某個屬性時，就會拋出錯誤。

例如，如果元件把內容查詢結果設給一個屬性 `foos`，那麼 `foos.first.bar` 就會拋出這個錯誤：

```
Uncaught TypeError: Cannot read property 'bar' of undefined
```

如果你看到像這樣的錯誤，而且那個 `undefined` 屬性指的是 `@ContentChildren` 查詢的結果，那很可能就是由此變更造成的。


### 建議的修復方式

你可以加入 `descendants: true` 旗標來忽略包裝元素，或移除包裝元素本身。

選項 1：
```
@ContentChildren('foo', {descendants: true}) foos: QueryList<ElementRef>;
```

選項 2：
```
<comp>
   <div #foo></div>   <!-- matches in both old runtime and  new runtime -->
</comp>
```

{@a undecorated-classes}
## 所有使用 Angular DI 的類別都必須有 Angular 類別層級裝飾器


### 變更的基本範例：

在先前的渲染引擎中，以下程式碼可以運作：

```
export class DataService {
  constructor(@Inject('CONFIG') public config: DataConfig) {}
}

@Injectable()
export class AppService extends DataService {...}
```

在 Ivy 中，它會拋出錯誤，因為 `DataService` 正在使用 Angular 依賴注入，卻缺少 `@Injectable` 裝飾器。

以下程式碼在先前的渲染引擎中也可以運作，但在 Ivy 中將需要 `@Directive` 裝飾器，因為它使用了 DI：

```
export class BaseMenu {
  constructor(private vcr: ViewContainerRef) {}
}

@Directive({selector: '[settingsMenu]'})
export class SettingsMenu extends BaseMenu {}
```

如果你指令類別繼承自一個有裝飾器的指令、但本身沒有裝飾器，也同樣如此。

如果你使用 CLI，應該有兩個自動化遷移會替你轉換程式碼（[這一個](guide/migration-injectable)與[這一個](guide/migration-undecorated-classes)）。
然而，當你在第 9 版中加入新程式碼時，可能還是會遇到這項差異。

### 背景

當類別有 Angular 裝飾器（如 `@Injectable` 或 `@Directive`）時，Angular 編譯器會產生額外的程式碼，來支援把相依性注入你的類別建構子。
使用繼承時，Ivy 需要父類別與子類別都套用裝飾器，才能產生正確的程式碼。
否則，當父類別缺少裝飾器時，子類別將繼承一個建構子，而編譯器並未為該類別產生特殊的建構子資訊，Angular 就不會有正確建立它所需的相依性資訊。

在先前的渲染引擎中，編譯器具有全域知識，因此在某些情況下（如 AOT 模式或某些注入旗標存在時），它可以查詢缺失的資料。
然而，Ivy 編譯器只會獨立處理每個類別。
這表示編譯有更快的潛力（並為框架開啟了今後的最佳化與功能），但編譯器無法再像以前一樣自動推斷出相同的資訊。

明確加入正確的裝飾器，就能提供這些資訊。

### 錯誤範例

在 JIT 模式中，框架將拋出以下錯誤：

```
ERROR: This constructor is not compatible with Angular Dependency Injection because its dependency at index X of the parameter list is invalid.
This can happen if the dependency type is a primitive like a string or if an ancestor of this class is missing an Angular decorator.

Please check that 1) the type for the parameter at index X is correct and 2) the correct Angular decorators are defined for this class and its ancestors.
```

在 AOT 模式中，你會看到類似這樣的訊息：

```
X inherits its constructor from Y, but the latter does not have an Angular decorator of its own.
Dependency injection will not be able to resolve the parameters of Y's constructor. Either add a
@Directive decorator to Y, or add an explicit constructor to X.
```

在某些情況下，框架可能無法偵測到缺失的裝飾器。
在這些情況下，當程式碼嘗試存取缺失相依性的某個屬性時，通常會看到執行時期錯誤被拋出。
如果相依性是 `foo`，你會在存取類似 `foo.bar` 的東西時看到錯誤：

```
Uncaught TypeError: Cannot read property 'bar' of undefined
```

如果你看到像這樣的錯誤，而且那個 `undefined` 值指的是某個本應被注入的東西，那可能就是這項變更。

### 建議的修復方式

- 在你打算提供或注入的任何東西上加入 `@Injectable` 裝飾器。

```
@Injectable()
export class DataService {
  constructor(@Inject('CONFIG') public config: DataConfig) {}
}

@Injectable()
export class AppService extends DataService {...}
```

- 在任何繼承指令的類別，或任何指令所繼承的類別上，加入[無選取器的 `@Directive` 裝飾器](guide/migration-undecorated-classes#directive-裝飾器裡面沒有任何中繼資料是什麼意思？)。

```
@Directive()            // selectorless, so it's not usable directly
export class BaseMenu {
  constructor(private vcr: ViewContainerRef) {}
}

@Directive({selector: '[settingsMenu]'})
export class SettingsMenu extends BaseMenu {}
```

{@a select-value-binding}
## 無法以 `*ngFor` 繫結到 `<select>` 的 `value` 屬性


### 變更的基本範例


```html
<select [value]="someValue">
  <option *ngFor="let option of options" [value]="option"> {{ option }} <option>
</select>
```

在 View Engine 執行時期中，上述程式碼會如預期般設定 `<select>` 的初始值。
在 Ivy 中，在這種情況下，初始值完全不會被設定。


### 背景

在 Ivy 之前，指令輸入繫結永遠會在 DOM 繫結被處理之前，在它們自己的變更偵測回合中執行。
這是一個支援此問題使用案例的實作細節：

```html
<select [value]="someValue">
  <option *ngFor="let option of options" [value]="option"> {{ option }} <option>
</select>
```

它之所以能運作，是因為 `*ngFor` 會先在指令輸入繫結回合中被檢查，從而先建立這些選項。
接著 DOM 繫結回合會執行，檢查 `value` 繫結。
此時，它就能把值與既有的某個選項比對，並把 DOM 中 `<select>` 元素的值設為顯示該選項。

在 Ivy 中，繫結會依照它們在範本中定義的順序被檢查，不論它們是指令輸入繫結還是 DOM 繫結。
這項變更讓變更偵測為了除錯的目的更容易推論，因為繫結會依照它們在範本中宣告的深度優先順序被檢查。

在這個情況下，這表示 `value` 繫結會在 `*ngFor` 被檢查之前就先被檢查，因為它在範本中宣告在 `*ngFor` 之上。
因此，`<select>` 元素的值會在任何選項被建立之前就先設定，它將無法在 DOM 中比對並顯示正確的選項。

### 錯誤範例

並不會拋出錯誤，但問題中的 `<select>` 在 DOM 中將不會顯示正確的初始值。


### 建議的修復方式

若要修正這個問題，我們建議繫結到 `<option>` 上的 `selected` 屬性，而不是 `<select>` 上的 `value`。

*之前*
```html
<select [value]="someValue">
  <option *ngFor="let option of options" [value]="option"> {{ option }} <option>
</select>
```

*之後*
```html
<select>
  <option *ngFor="let option of options" [value]="option" [selected]="someValue == option">
    {{ option }}
  <option>
</select>
```

{@a forward-refs-directive-inputs}
## 透過本機參照存取的指令輸入前向參照不再支援。


### 變更的基本範例


```ts
@Directive({
  selector: '[myDir]',
  exportAs: 'myDir'
})
export class MyDir {
  @Input() message: string;
}
```

```html
{{ myDir.name }}
<div myDir #myDir="myDir" [name]="myName"></div>
```

在 View Engine 執行時期中，上述程式碼會毫無錯誤地輸出名稱。
在 Ivy 中，`myDir.name` 繫結將拋出 `ExpressionChangedAfterItHasBeenCheckedError`。


### 背景

在 ViewEngine 執行時期中，指令輸入繫結與元素繫結是在不同階段執行的。Angular 會完整處理範本一次，只檢查指令輸入（例如 `[name]`），然後再次處理整個範本，只檢查元素與文字繫結（例如 `{{ myDir.name }}`）。這表示 `name` 指令輸入會在 `myDir.name` 文字繫結之前被檢查，儘管它們在範本中的相對順序如此，這讓一些使用者覺得違反直覺。

相較之下，Ivy 只會以一個回合處理範本，因此繫結會依照它們在範本中書寫的順序被檢查。在這個情況下，這表示 `myDir.name` 繫結會在 `name` 輸入對指令設定屬性之前被檢查（因此它將是 `undefined`）。由於到了下一個變更偵測回合執行時，`myDir.name` 屬性將已被設定，於是會拋出一個變更偵測錯誤。

### 錯誤範例

假設 `myName` 的值是 `Angular`，你應該會看到類似這樣的錯誤

```
Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: 'undefined'. Current value: 'Angular'.
```

### 建議的修復方式

若要修正這個問題，我們建議直接從宿主元件取得繫結所需的資訊（例如我們範例中的 `myName` 屬性），或把資料繫結移到指令宣告之後，讓初始值在第一個回合就可用。

*之前*
```html
{{ myDir.name }}
<div myDir #myDir="myDir" [name]="myName"></div>
```

*之後*
```html
{{ myName }}
<div myDir [name]="myName"></div>
```

{@a foreign-values}
## 外來函式與外來值無法以靜態方式解析

### 變更的基本範例

考慮一個程式庫，它定義並匯出一個供其他程式庫使用的選取器字串：

```
export let mySelector = '[my-selector]';
```

這個選取器接著在另一個程式庫或應用程式中被匯入：

```
import {mySelector} from 'my-library';

@Directive({selector: mySelector})
export class MyDirective {}
```

由於 `mySelector` 值是從外部程式庫匯入的，它屬於不同的編譯單元，因此被視為_外來的_。

雖然這段程式碼在 View Engine 編譯器中能正確運作，但在 Ivy 中以 AOT 模式編譯時將會失敗。

### 背景

在 View Engine 中，編譯器在打包程式庫時，會把程式庫的原始碼擷取在 `metadata.json` 檔案中，讓外部取用者能「看進」外部程式庫的原始碼。
當 AOT 編譯應用程式時，`metadata.json` 檔案會被用來決定 `mySelector` 的值。
在 Ivy 中，`metadata.json` 檔案不再被使用。相反地，編譯器會從 TypeScript 建立的 `.d.ts` 檔案中擷取外部程式庫的中繼資料。
這帶來多項好處，例如更好的效能、大幅改善的錯誤回報，以及更多建置快取的機會，因為不再依賴程式庫內部實作。

回頭看先前的範例，`mySelector` 值在 `.d.ts` 中會像這樣呈現：

```
export declare let mySelector: string;
```

請注意，選取器的實際值不再存在，因此 Ivy 編譯器在 AOT 編譯期間無法使用它。

### 錯誤範例

在上方的範例中，編譯 `MyDirective` 時會發生編譯錯誤：

```
error NG1010: selector must be a string
  Value is a reference to 'mySelector'.

    1  export declare let mySelector: string;
                          ~~~~~~~~~~
    Reference is declared here.

```

### 建議的修復方式

從程式庫匯出值時，請確保實際值存在於 `.d.ts` 檔案中。這通常要求變數被宣告為常數：

```
export const mySelector = '[my-selector]';
```

在類別中，欄位應使用 `static readonly` 修飾符宣告：

```
export class Selectors {
  static readonly mySelector = '[my-selector]';
}
```
