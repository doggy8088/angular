# 元件宿主元素

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

Angular 會為每個與元件選擇器相符的 HTML 元素建立一個元件執行個體。與元件選擇器相符的 DOM 元素就是該元件的**宿主元素**。元件範本的內容會算繪在其宿主元素內。

```angular-ts
// Component source
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Using the component -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```angular-html
<!-- Rendered DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

在上面的範例中，`<profile-photo>` 是 `ProfilePhoto` 元件的宿主元素。

## 繫結到宿主元素 {#binding-to-the-host-element}

元件可以將屬性、屬性值、樣式與事件繫結到它的宿主元素。這與元件範本內元素上的繫結行為完全相同，只是改用 `@Component` 裝飾器中的 `host` 屬性來定義：

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[style.background]' : `hasError() ? 'red' : 'green'`,
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  hasError = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

NOTE: 可用來為事件名稱加上前綴的全域目標名稱為 `document:`、`window:` 與 `body:`。

NOTE: 像 `'(keydown.enter)'` 這類按鍵名稱，是與 `KeyboardEvent.key` 比對的，而它取決於使用者的鍵盤配置與輸入語言。若要不論配置為何都比對實體按鍵，請改用 `code` 修飾符，例如 `'(keydown.code.Enter)'`。詳情請參閱[使用按鍵修飾符](guide/templates/event-listeners#using-key-modifiers)。

## `@HostBinding` 與 `@HostListener` 裝飾器

你也可以將 `@HostBinding` 與 `@HostListener` 裝飾器套用到類別成員上，來繫結到宿主元素。

`@HostBinding` 讓你可以將宿主屬性與屬性值繫結到屬性和 getter：

```ts
@Component({/* ... */})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener` 讓你可以將事件監聽器繫結到宿主元素。這個裝飾器接受一個事件名稱，以及選擇性的引數陣列：

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

<docs-callout critical title="優先使用 `host` 屬性，而非這些裝飾器">
  **一律優先使用 `host` 屬性，而非 `@HostBinding` 與 `@HostListener`**。這些裝飾器純粹是為了向後相容而存在。
</docs-callout>

## 繫結衝突

當你在範本中使用某個元件時，可以為該元件的元素加上繫結。該元件（或套用在它上面的指令）可能_也_為相同的屬性、屬性值、類別或樣式定義了宿主繫結。

Angular 如何處理這些衝突，取決於繫結的類型：

### 類別與樣式繫結

類別與樣式繫結有明確的優先順序。範本中定義的繫結優先於指令或元件上定義的宿主繫結：

1. **範本繫結**（例如 `[class.active]` 或 `[style.color]`）
2. **靜態範本值**（例如範本中的 `class="..."` 或 `style="..."`）
3. **指令宿主繫結**
4. **元件宿主繫結**
5. **靜態宿主值**（例如 `host: {class: '...'}`）

若繫結的值是 `undefined`，Angular 會退回下一個層級。`null` 值會移除類別或樣式，而不會退回。

### 屬性與屬性值衝突

對於非樣式用的屬性與屬性值（例如 `id`、`role` 或 `[attr.aria-*]`）：

- **靜態屬性值：**若範本與元件都宣告了靜態屬性值（例如 `<my-cmp id="parent">` 與 `host: {id: 'child'}`），範本中設定的屬性值勝出。
- **靜態與動態：**若一個值是靜態、另一個是動態的，動態值勝出。
- **動態繫結：**避免同時在範本中、又透過宿主繫結，繫結到同一個 DOM 屬性或屬性值。Angular 不會協調重複的屬性繫結；重疊的動態繫結可能因變更偵測的執行順序而導致非預期的覆寫。

## 使用 CSS 自訂屬性設定樣式

開發者經常仰賴 [CSS 自訂屬性](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)，讓元件樣式能彈性設定。你可以用[樣式繫結](guide/templates/binding#css-style-properties)，在宿主元素上設定這類自訂屬性。

```angular-ts
@Component({
  /* ... */
  host: {
    '[style.--my-background]': 'color()',
  },
})
export class MyComponent {
  color = signal('lightgreen');
}
```

在此範例中，`--my-background` CSS 自訂屬性繫結到 `color` 訊號。只要 `color` 訊號變更，自訂屬性的值就會自動更新。這會影響目前元件，以及所有仰賴此自訂屬性的子元素。

### 在子元件上設定自訂屬性

或者，你也可以用[樣式繫結](guide/templates/binding#css-style-properties)，在子元件的宿主元素上設定 CSS 自訂屬性。

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()" />`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```

## 注入宿主元素屬性 {#injecting-host-element-attributes}

元件與指令可以使用 `HostAttributeToken` 搭配 [`inject`](api/core/inject) 函式，讀取宿主元素上的靜態屬性。

```ts
import { Component, HostAttributeToken, inject } from '@angular/core';

@Component({
  selector: 'app-button',
  ...,
})
export class Button {
  variation = inject(new HostAttributeToken('variation'));
}
```

```angular-html
<app-button variation="primary">Click me</app-button>
```

HELPFUL: 若缺少該屬性，`HostAttributeToken` 會擲出錯誤，除非將該注入標記為選擇性。
