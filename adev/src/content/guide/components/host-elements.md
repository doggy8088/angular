# 元件主機元素

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

Angular 會為與元件選擇器相符的每個 HTML 元素建立元件執行個體。與元件選擇器相符的 DOM 元素是該元件的 **主機元素**。元件範本的內容會呈現在其主機元素內部。

```ts
// Component source
@Component({
  selector: 'profile-photo',
  template: `
    <img src="profile-photo.jpg" alt="Your profile photo" />
  `,
})
export class ProfilePhoto {}
```

```html
<!-- Using the component -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```html
<!-- Rendered DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

在上面的範例中，`<profile-photo>` 是 `ProfilePhoto` 元件的主機元素。

## 繫結到主機元素

元件可以將屬性、特徵和事件繫結至其主機元素。這與元件範本內元素的繫結行為相同，但改以在 `@Component` 裝飾器的 `host` 屬性中定義：

```ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;

  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

## `@HostBinding` 和 `@HostListener` 裝飾器

您也可以透過將 `@HostBinding` 和 `@HostListener` 裝飾器套用至類別成員來繫結至主機元素。

`@HostBinding` 可讓您將主機屬性和屬性繫結至屬性和方法：

```ts
@Component({
  /* ... */
})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  getTabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener` 讓您將事件監聽器繫結到主機元素。裝飾器接受事件名稱和可選參數陣列：

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

**永遠優先使用 `host` 屬性，而非 `@HostBinding` 和 `@HostListener`。** 這些
裝飾器僅存在於向後相容性。

## 繫結衝突

當你在範本中使用元件時，你可以新增繫結至該元件實例的元素。
該元件也可以為相同的屬性或特徵定義主機繫結。

```ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```html
<profile-photo role="group" [id]="otherId" />
```

在這種情況下，以下規則決定哪個值勝出：

- 如果兩個值都是靜態的，則實例繫結獲勝。
- 如果一個值是靜態的，另一個是動態的，則動態值獲勝。
- 如果兩個值都是動態的，則元件的主機繫結獲勝。
