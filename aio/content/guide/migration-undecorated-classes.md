# 缺少 `@Directive()`/`@Component()` 裝飾器的遷移

## 這個遷移做什麼？

這個遷移會為未加裝飾器的基底類別加上空的 `@Directive()` 裝飾器，這些基底類別：

*   使用 Angular 功能
*   被指令或元件繼承

例如，在下面的差異中，`@Directive()` 裝飾器被加到了 `BaseMenu`，因為 `BaseMenu` 使用了依賴注入。

**之前**：

<code-example format="typescript" language="typescript">

export class BaseMenu {
  constructor(private vcr: ViewContainerRef) {}
}

&commat;Directive({selector: '[settingsMenu]'})
export class SettingsMenu extends BaseMenu {}

</code-example>

**之後**：

<code-example format="typescript" language="typescript">

&commat;Directive()
export class BaseMenu {
  constructor(private vcr: ViewContainerRef) {}
}

&commat;Directive({selector: '[settingsMenu]'})
export class SettingsMenu extends BaseMenu {}

</code-example>

若指令或元件被一個沒有裝飾器的類別繼承，原理圖會將繼承而來的指令或元件中繼資料複製到衍生類別。

**之前**：

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'base-menu',
  template: '&lt;div&gt;&lt;/div&gt;'
})
class BaseMenu {}

export class SettingsMenu extends BaseMenu {}

</code-example>

**之後**：

<code-example format="typescript" language="typescript">

&commat;Component({
  selector: 'base-menu',
  template: '&lt;div&gt;&lt;/div&gt;'
})
class BaseMenu {}

&commat;Component({
  selector: 'base-menu',
  template: '&lt;div&gt;&lt;/div*gt;'
})
export class SettingsMenu extends BaseMenu {}

</code-example>

這個原理圖也會裝飾使用 Angular 欄位裝飾器的類別，包括：

*   `@Input()`
*   `@Output()`
*   `@HostBinding()`
*   `@HostListener()`
*   `@ViewChild()` / `@ViewChildren()`
*   `@ContentChild()` / `@ContentChildren()`

**之前**：

<code-example format="typescript" language="typescript">

class Base {
  &commat;Output()
  countChanged = new EventEmitter&lt;number&gt;();
}

&commat;Directive({
  selector: '[myDir]'
})
class Dir extends Base {
}

</code-example>

**之後**：

<code-example format="typescript" language="typescript">

&commat;Directive() // schematic adds &commat;Directive()
class Base {
  &commat;Output()
  countChanged = new EventEmitter&lt;number&gt;();
}

&commat;Directive({
  selector: '[myDir]'
})
class Dir extends Base {
}

</code-example>

## 為什麼需要這個遷移？

### 遷移使用 DI 的類別

當一個類別有 `@Directive()` 或 `@Component()` 裝飾器時，Angular 編譯器會產生額外的程式碼，將依賴注入到建構函式中。
使用繼承時，Ivy 需要父類別和子類別都套用裝飾器，才能產生正確的程式碼。

你可以將這項變更想成兩種情況：父類別缺少裝飾器，或子類別缺少裝飾器。
在這兩種情況下，Angular 的執行期都需要來自編譯器的額外資訊。
這個額外資訊來自於加上裝飾器。

#### 父類別缺少裝飾器

當父類別缺少裝飾器時，子類別會繼承一個建構函式，而編譯器並未為其所屬類別產生特殊的建構函式資訊（因為它沒有被裝飾為指令）。
當 Angular 接著嘗試建立子類別時，它就沒有正確的資訊來建立它。

在 View Engine 中，編譯器擁有全域知識，因此可以查到缺少的資料。
然而，Ivy 編譯器只會獨立處理每個指令。
這意味著編譯可以更快，但編譯器無法自動推斷出與之前相同的資訊。
明確加上 `@Directive()` 就能提供這個資訊。

將來，請為尚未有裝飾器且被指令繼承的基底類別加上 `@Directive()`。

#### 子類別缺少裝飾器

當子類別缺少裝飾器時，子類別繼承自父類別，但自身沒有任何裝飾器。
沒有裝飾器，編譯器就無從得知該類別是 `@Directive` 或 `@Component`，因此不會為該指令產生正確的指令序列。

### 遷移使用欄位裝飾器的類別

在 ViewEngine 中，帶有 `@Input()` 這類欄位裝飾器的基底類別，即使該類別沒有 `@Directive()` 或 `@Component()` 裝飾器，也能運作。
例如：

<code-example format="typescript" language="typescript">

class Base {
  &commat;Input()
  foo: string;
}

&commat;Directive(&hellip;)
class Dir extends Base {
  ngOnChanges(): void {
    // notified when bindings to [foo] are updated
  }
}

</code-example>

然而，這個範例無法以 Ivy 編譯，因為 `Base` 類別*需要* `@Directive()` 或 `@Component()` 裝飾器，才能為輸入、輸出、查詢和宿主繫結產生程式碼。

一律要求類別裝飾器為 Angular 帶來兩個主要好處：

1.  先前的行為不一致。
    有些 Angular 功能需要裝飾器（依賴注入），但其他功能不需要。
    現在，所有 Angular 功能一致地都需要類別裝飾器。

1.  支援未加裝飾器的類別會增加 Angular 的程式碼大小和複雜度。
    一律要求類別裝飾器，能讓框架對所有使用者都更小、更簡單。

## `@Directive()` 裝飾器裡面沒有任何中繼資料是什麼意思？

`@Directive` 裝飾器的存在會促使 Angular 為受影響的類別產生額外的程式碼。
如果該裝飾器不包含任何屬性（中繼資料），該指令就不會被比對到元素，也不會被直接實例化，但其他*繼承*該指令類別的類別會繼承這段產生的程式碼。
你可以將它想成一個「抽象」指令。

將抽象指令加入 `NgModule` 會造成錯誤。
指令必須定義 `selector` 屬性，才能比對範本中的某些元素。

## 我什麼時候需要沒有選擇器的 `@Directive()` 裝飾器？

如果你正在使用依賴注入，或任何 Angular 專屬功能，例如 `@HostBinding()`、`@ViewChild()` 或 `@Input()`，你就需要 `@Directive()` 或 `@Component()` 裝飾器。
裝飾器讓編譯器知道要產生正確的指令序列，來建立該類別以及任何繼承它的類別。
如果你不想直接將該基底類別用作指令，就將選擇器留空。
如果你確實想讓它能獨立使用，就照常填入中繼資料。

不使用 Angular 功能的類別不需要 Angular 裝飾器。

## 我是函式庫作者。我應該為基底類別加上 `@Directive()` 裝飾器嗎？

由於對無選擇器裝飾器的支援是在 Angular 第 9 版引入的，如果你想支援 Angular 第 8 版及更早版本，就不應該加上無選擇器的 `@Directive()` 裝飾器。
你可以加上帶選擇器的 `@Directive()`，或是將 Angular 專屬功能移到受影響的子類別。

## 使用未遷移函式庫的應用程式呢？

[Angular 相容性編譯器](guide/glossary#ngcc)（`ngcc`）應該會自動轉換任何未遷移的函式庫，產生正確的程式碼。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
