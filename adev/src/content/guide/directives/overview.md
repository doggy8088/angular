<docs-decorative-header title="內建指令" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
指令是為你的 Angular 應用程式中的元素加上額外行為的類別。
</docs-decorative-header>

使用 Angular 的內建指令來管理表單、清單、樣式，以及使用者看到的內容。

Angular 指令的不同類型如下：

| 指令類型                                                         | 說明                                                                           |
| :--------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| [元件](guide/components)                                         | 搭配範本使用。這是最常見的指令類型。                                           |
| [屬性指令](#built-in-attribute-directives)                      | 改變元素、元件或另一個指令的外觀或行為。                                       |
| [結構指令](/guide/directives/structural-directives)              | 透過新增與移除 DOM 元素來改變 DOM 版面配置。                                   |

本指南介紹內建的[屬性指令](#built-in-attribute-directives)。

## 內建屬性指令 {#built-in-attribute-directives}

屬性指令會監聽並修改其他 HTML 元素、屬性、性質與元件的行為。

最常見的屬性指令如下：

| 常見指令                                               | 說明                                            |
| :----------------------------------------------------- | :------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass) | 新增與移除一組 CSS 類別。             |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)       | 新增與移除一組 HTML 樣式。             |
| [`NgModel`](guide/forms/template-driven-forms)         | 為 HTML 表單元素加上雙向資料繫結。 |

HELPFUL: 內建指令只使用公開 API。它們並未擁有其他指令無法存取的任何私有 API 的特殊存取權。

## 使用 `NgClass` 新增與移除類別 {#adding-and-removing-classes-with-ngclass}

使用 `ngClass` 一次新增或移除多個 CSS 類別。

HELPFUL: 若要新增或移除_單一_類別，請使用[類別繫結](guide/templates/class-binding)，而不是 `NgClass`。

### 在元件中匯入 `NgClass`

若要使用 `NgClass`，請把它加入元件的 `imports` 清單。

<docs-code header="app.component.ts (NgClass import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-class"/>

### 搭配運算式使用 `NgClass`

在你想設定樣式的元素上，加入 `[ngClass]` 並把它設為等於一個運算式。
在這個例子中，`isSpecial` 是在 `app.component.ts` 中設為 `true` 的布林值。
因為 `isSpecial` 為 true，`ngClass` 會把 `special` 類別套用到 `<div>`。

<docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="special-div"/>

### 搭配方法使用 `NgClass`

1. 若要搭配方法使用 `NgClass`，請把該方法加入元件類別。
   在下列範例中，`setCurrentClasses()` 會以一個物件設定 `currentClasses` 屬性，該物件會依其他三個元件屬性的 `true` 或 `false` 狀態，新增或移除三個類別。

   物件的每個鍵都是一個 CSS 類別名稱。
   如果鍵為 `true`，`ngClass` 會新增該類別。
   如果鍵為 `false`，`ngClass` 會移除該類別。

   <docs-code header="app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setClasses"/>

1. 在範本中，把 `ngClass` 屬性繫結加到 `currentClasses`，以設定元素的類別：

<docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgClass-1"/>

在這個使用案例中，Angular 會在初始化時套用這些類別，並在 `currentClasses` 物件被重新指派而造成變更時再次套用。
完整範例會在使用者點選 `Refresh currentClasses` 按鈕時，於一開始以 `ngOnInit()` 呼叫 `setCurrentClasses()`。
這些步驟並非實作 `ngClass` 的必要條件。

## 使用 `NgStyle` 設定行內樣式 {#setting-inline-styles-with-ngstyle}

HELPFUL: 若要新增或移除_單一_樣式，請使用[樣式繫結](guide/templates/binding#css-class-and-style-property-bindings)，而不是 `NgStyle`。

### 在元件中匯入 `NgStyle`

若要使用 `NgStyle`，請把它加入元件的 `imports` 清單。

<docs-code header="app.component.ts (NgStyle import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-style"/>

使用 `NgStyle`，依元件的狀態一次設定多個行內樣式。

1. 若要使用 `NgStyle`，請把一個方法加入元件類別。

   在下列範例中，`setCurrentStyles()` 會以一個物件設定 `currentStyles` 屬性，該物件依其他三個元件屬性的狀態定義三種樣式。

   <docs-code header="app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setStyles"/>

1. 若要設定元素的樣式，請把 `ngStyle` 屬性繫結加到 `currentStyles`。

<docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgStyle-2"/>

在這個使用案例中，Angular 會在初始化時套用這些樣式，並在發生變更時再次套用。
為此，完整範例會在一開始以 `ngOnInit()` 呼叫 `setCurrentStyles()`，並在相依屬性透過按鈕點選而改變時再次呼叫。
不過，這些步驟並非單獨實作 `ngStyle` 的必要條件。

## 在沒有 DOM 元素的情況下承載指令

Angular 的 `<ng-container>` 是一個分組元素，它不會干擾樣式或版面配置，因為 Angular 不會把它放進 DOM。

當沒有單一元素可以承載指令時，請使用 `<ng-container>`。

以下是一個使用 `<ng-container>` 的條件段落。

<docs-code header="app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="ngif-ngcontainer"/>

<img alt="樣式正確的 ng-container 段落" src="assets/images/guide/structural-directives/good-paragraph.png">

1. 從 `FormsModule` 匯入 `ngModel` 指令。

1. 把 `FormsModule` 加入相關 Angular 模組的 imports 區段。

1. 若要依條件排除某個 `<option>`，請把 `<option>` 包在 `<ng-container>` 裡。

   <docs-code header="app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="select-ngcontainer"/>

   <img alt="ng-container 中的選項運作正常" src="assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## 後續步驟

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="屬性指令"/>
  <docs-pill href="guide/directives/structural-directives" title="結構指令"/>
  <docs-pill href="guide/directives/directive-composition-api" title="指令組合 API"/>
</docs-pill-row>
