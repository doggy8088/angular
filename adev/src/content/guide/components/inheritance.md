# 繼承

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

Angular 元件是 TypeScript 類別，遵循標準的 JavaScript 繼承語意。

元件可以擴充任何基底類別：

```ts
export class ListboxBase {
  value: string;
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  // CustomListbox inherits the `value` property.
}
```

## 擴充其他元件與指令

當元件擴充另一個元件或指令時，它會繼承基底類別裝飾器中定義的部分中繼資料，以及基底類別中被裝飾的成員。這包括宿主繫結、輸入、輸出、生命週期方法。

```angular-ts
@Component({
  selector: 'base-listbox',
  template: ` ... `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  value = input.required<string>();
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: ` ... `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  disabled = input(false);
  focusActiveOption() {
    /* ... */
  }
}
```

在上面的範例中，`CustomListbox` 繼承了與 `ListboxBase` 相關的所有資訊，並以自己的值覆寫選擇器與範本。`CustomListbox` 有兩個輸入（`value` 與 `disabled`）和兩個事件監聽器（`keydown` 與 `click`）。

子類別最終會擁有其所有祖先的輸入、輸出與宿主繫結，以及自身成員的_聯集_。

### 轉交注入的依賴

當基底類別使用 `inject()` 作為屬性初始化器時，子類別會自動繼承該屬性，不需要轉交 `super`。

```ts
@Component(/* ... */)
export class ListboxBase {
  protected element = inject(ElementRef);
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  // `element` is inherited from `ListboxBase`.
}
```

如果基底類別以建構函式參數的方式注入依賴，子類別必須明確將這些依賴傳給 `super`。

```ts
@Component(/* ... */)
export class ListboxBase {
  constructor(private element: ElementRef) {}
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### 覆寫生命週期方法

如果基底類別定義了生命週期方法，例如 `ngOnInit`，同樣實作 `ngOnInit` 的子類別會_覆寫_基底類別的實作。如果你想保留基底類別的生命週期方法，請以 `super` 明確呼叫該方法：

```ts
@Component(/* ... */)
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component(/* ... */)
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```
