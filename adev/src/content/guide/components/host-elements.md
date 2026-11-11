# 元件宿主元素

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

Angular 會為每個與元件選擇器相符的 HTML 元素建立一個元件執行個體。與元件選擇器相符的 DOM 元素就是該元件的**宿主元素**。元件範本的內容會算繪在其宿主元素內。

```angular-ts
// Component source
@Component({
  selector: 'profile-photo',
  template: `
    <img src="profile-photo.jpg" alt="Your profile photo" />
  `,
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

元件可以將屬性、屬性值與事件繫結到它的宿主元素。這與元件範本內元素上的繫結行為完全相同，只是改用 `@Component` 裝飾器中的 `host` 屬性來定義：

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

## `@HostBinding` 與 `@HostListener` 裝飾器

你也可以將 `@HostBinding` 與 `@HostListener` 裝飾器套用到類別成員上，來繫結到宿主元素。

`@HostBinding` 讓你可以將宿主屬性與屬性值繫結到屬性與方法：

```angular-ts
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

`@HostListener` 讓你可以將事件監聽器繫結到宿主元素。這個裝飾器接受一個事件名稱，以及選擇性的引數陣列：

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

  **一律優先使用 `host` 屬性，而非 `@HostBinding` 與 `@HostListener`**。這些裝飾器純粹是為了向後相容而存在。

## 繫結衝突

當你在範本中使用某個元件時，可以為該元件執行個體的元素加上繫結。該元件可能_也_為相同的屬性或屬性值定義了宿主繫結。

```angular-ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```angular-html
<profile-photo role="group" [id]="otherId" />
```

在這種情況下，下列規則決定哪個值勝出：

- 若兩個值都是靜態的，執行個體繫結勝出。
- 若一個值是靜態、另一個是動態的，動態值勝出。
- 若兩個值都是動態的，元件的宿主繫結勝出。
