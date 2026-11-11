# 繫結動態文字、屬性與 attribute

在 Angular 中，**繫結**會在元件的範本與其資料之間建立動態連接。這個連接能確保元件資料的變更會自動更新算繪後的範本。

## 以文字插值算繪動態文字 {#render-dynamic-text-with-text-interpolation}

你可以使用雙大括號在範本中繫結動態文字，這會告訴 Angular，它負責處理其中的運算式，並確保其正確更新。這稱為**文字插值**。

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class AppComponent {
  theme = 'dark';
}
```

在這個範例中，當程式碼片段算繪到頁面時，Angular 會將 `{{ theme }}` 取代為 `dark`。

```angular-html
<!-- Rendered Output -->
<p>Your color preference is dark.</p>
```

會隨時間變化的繫結，應從[訊號](/guide/signals)讀取值。Angular 會追蹤範本中讀取到的訊號，並在那些訊號值變更時更新算繪後的頁面。

```angular-ts
@Component({
  template: `
    <!-- Does not necessarily update when `welcomeMessage` changes. -->
    <p>{{ welcomeMessage }}</p>

    <p>Your color preference is {{ theme() }}.</p> <!-- Always updates when the value of the `name` signal changes. -->
  `
  ...
})
export class AppComponent {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

如需更多細節，請參閱[訊號指南](/guide/signals)。

延續主題的範例，如果使用者在頁面載入後點選按鈕，將 `theme` 訊號更新為 `'light'`，頁面就會相應更新為：

```angular-html
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```

你可以在任何通常會在 HTML 中寫文字的地方使用文字插值。

所有運算式的值都會轉換為字串。物件與陣列則使用該值的 `toString` 方法進行轉換。

## 繫結動態屬性與 attribute {#binding-dynamic-properties-and-attributes}

Angular 支援以中括號將動態值繫結到物件屬性與 HTML attribute。

你可以繫結到 HTML 元素的 DOM 實例、[元件](guide/components)實例或[指令](guide/directives)實例上的屬性。

### 原生元素屬性

每個 HTML 元素都有對應的 DOM 表示。例如，每個 `<button>` HTML 元素都對應到 DOM 中 `HTMLButtonElement` 的一個實例。在 Angular 中，你使用屬性繫結將值直接設定到元素的 DOM 表示上。

```angular-html
<!-- Bind the `disabled` property on the button element's DOM object -->
<button [disabled]="isFormValid()">Save</button>
```

在這個範例中，每當 `isFormValid` 變更時，Angular 會自動設定 `HTMLButtonElement` 實例的 `disabled` 屬性。

### 元件與指令屬性

當元素是 Angular 元件時，你可以用相同的中括號語法，以屬性繫結設定元件的輸入屬性。

```angular-html
<!-- Bind the `value` property on the `MyListbox` component instance. -->
<my-listbox [value]="mySelection()" />
```

在這個範例中，每當 `mySelection` 變更時，Angular 會自動設定 `MyListbox` 實例的 `value` 屬性。

你也可以繫結到指令屬性。

```angular-html
<!-- Bind to the `ngSrc` property of the `NgOptimizedImage` directive  -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo">
```

### Attribute

當你需要設定沒有對應 DOM 屬性的 HTML attribute（例如 ARIA attribute 或 SVG attribute）時，你可以使用 `attr.` 前綴，將 attribute 繫結到範本中的元素。

<!-- prettier-ignore -->
```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to the component's `listRole` property. -->
<ul [attr.role]="listRole()">
```

在這個範例中，每當 `listRole` 變更時，Angular 會呼叫 `setAttribute`，自動設定 `<ul>` 元素的 `role` attribute。

如果 attribute 繫結的值為 `null`，Angular 會呼叫 `removeAttribute` 移除該 attribute。

### 屬性與 attribute 中的文字插值

你也可以在屬性與 attribute 中使用文字插值語法：以雙大括號語法取代屬性或 attribute 名稱周圍的中括號。使用這種語法時，Angular 會將該指派視為屬性繫結。

```angular-html
<!-- Binds a value to the `alt` property of the image element's DOM object. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" >
```

若要以文字插值語法繫結到 attribute，請在 attribute 名稱前加上 `attr.` 前綴。

```angular-html
<button attr.aria-label="Save changes to {{ objectType() }}">
```

## CSS 類別與樣式屬性繫結 {#css-class-and-style-property-bindings}

Angular 為將 CSS 類別與 CSS 樣式屬性繫結到元素提供了額外的功能。

### CSS 類別

你可以建立 CSS 類別繫結，依繫結值為 [truthy 或 falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)，有條件地在元素上加入或移除 CSS 類別。

<!-- prettier-ignore -->
```angular-html
<!-- When `isExpanded` is truthy, add the `expanded` CSS class. -->
<ul [class.expanded]="isExpanded()">
```

你也可以直接繫結到 `class` 屬性。Angular 接受三種類型的值：

| `class` 值的說明                                                                               | TypeScript 型別       |
| ---------------------------------------------------------------------------------------------- | --------------------- |
| 包含一或多個以空白分隔的 CSS 類別的字串                                                        | `string`              |
| CSS 類別字串的陣列                                                                             | `string[]`            |
| 一個物件，其每個屬性名稱都是 CSS 類別名稱，每個對應值依 truthiness 決定該類別是否套用到元素上 | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses()"> ... </section>
    <button [class]="buttonClasses()"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = signal(['expandable', 'elevated']);
  buttonClasses = signal({
    highlighted: true,
    embiggened: false,
  });
}
```

上述範例會算繪出下列 DOM：

<!-- prettier-ignore -->
```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

Angular 會忽略任何不是有效 CSS 類別名稱的字串值。

當同時使用靜態 CSS 類別、直接繫結 `class` 以及繫結特定類別時，Angular 會智慧地將所有類別合併到算繪結果中。

```angular-ts
@Component({
  template: `<ul class="list" [class]="listType()" [class.expanded]="isExpanded()"> ...`,
  ...
})
export class Listbox {
  listType = signal('box');
  isExpanded = signal(true);
}
```

在上述範例中，Angular 會以三個 CSS 類別算繪 `ul` 元素。

<!-- prettier-ignore -->
```angular-html
<ul class="list box expanded">
```

Angular 不保證算繪後元素上 CSS 類別的任何特定順序。

當把 `class` 繫結到陣列或物件時，Angular 會以三等號運算子（`===`）比較先前的值與目前的值。當你修改這些值時，必須建立新的物件或陣列實例，Angular 才會套用任何更新。

如果一個元素對同一個 CSS 類別有多個繫結，Angular 會依照其樣式優先順序解決衝突。

NOTE: 類別繫結不支援在單一鍵中使用以空白分隔的類別名稱。它們也不支援對物件的變更（mutation），因為繫結的參照維持不變。如果你需要其中任一行為，請使用 [ngClass](/api/common/NgClass) 指令。

### CSS 樣式屬性 {#css-style-properties}

你也可以直接繫結到元素上的 CSS 樣式屬性。

<!-- prettier-ignore -->
```angular-html
<!-- Set the CSS `display` property based on the `isExpanded` property. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

對於接受單位的 CSS 屬性，你可以進一步指定單位。

<!-- prettier-ignore -->
```angular-html
<!-- Set the CSS `height` property to a pixel value based on the `sectionHeightInPixels` property. -->
<section [style.height.px]="sectionHeightInPixels()">
```

你也可以在一個繫結中設定多個樣式值。Angular 接受下列類型的值：

| `style` 值的說明                                                          | TypeScript 型別       |
| ------------------------------------------------------------------------- | --------------------- |
| 包含零或多個 CSS 宣告的字串，例如 `"display: flex; margin: 8px"`          | `string`              |
| 一個物件，其每個屬性名稱都是 CSS 屬性名稱，每個對應值是該 CSS 屬性的值    | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [style]="listStyles()"> ... </ul>
    <section [style]="sectionStyles()"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = signal('display: flex; padding: 8px');
  sectionStyles = signal({
    border: '1px solid black',
    'font-weight': 'bold',
  });
}
```

上述範例會算繪出下列 DOM。

<!-- prettier-ignore -->
```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

當把 `style` 繫結到物件時，Angular 會以三等號運算子（`===`）比較先前的值與目前的值。當你修改這些值時，必須建立新的物件實例，Angular 才會套用任何更新。

如果一個元素對同一個樣式屬性有多個繫結，Angular 會依照其樣式優先順序解決衝突。

