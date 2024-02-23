# 繼承

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

Angular 組件是 TypeScript 類別，並參與標準 JavaScript 繼承
語義。

組件可以延伸任何基礎類別：

```ts
export class ListboxBase {
  value: string;
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  // CustomListbox inherits the `value` property.
}
```

## 擴展其他元件和指令

當元件擴充另一個元件或指令時，它會繼承基本類別的裝飾器和基本類別的裝飾成員中定義的所有元數據。這包括選擇器、範本、樣式、主機繫結、輸入、輸出、生命週期方法以及任何其他設定。

```ts
@Component({
  selector: 'base-listbox',
  template: `
    ...
  `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  @Input() value: string;
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: `
    ...
  `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  @Input() disabled = false;
  focusActiveOption() {
    /* ... */
  }
}
```

在上面的範例中，`CustomListbox` 繼承所有與 `ListboxBase` 相關的資訊，並以它自己的值覆寫選擇器和範本。`CustomListbox` 有兩個輸入 (`value` 和 `disabled`) 和兩個事件監聽器 (`keydown` 和 `click`)。

子類別最終會與其所有祖先的輸入、輸出和主機繫結，以及其自己的輸入、輸出和主機繫結_合併_。

### 轉發注入的相依性

如果一個基類依賴於依賴注入，子類必須明確地將這些依賴傳遞給 `super`。

```ts
@Component({ ... })
export class ListboxBase {
  constructor(private element: ElementRef) { }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### 覆寫生命週期方法

如果基底類別定義了生命週期方法，例如 `ngOnInit`，也實作 `ngOnInit` 的子類別會 _覆寫_ 基底類別的實作。如果您要保留基底類別的生命週期方法，請使用 `super` 明確呼叫該方法：

```ts
@Component({ ... })
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```

