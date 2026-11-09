# DI 實務應用

本指南探討 Angular 依賴注入（DI）的其他功能。

NOTE: 關於 InjectionToken 和自訂提供者的完整說明，請參閱[定義依賴提供者指南](guide/di/defining-dependency-providers#injection-tokens)。

## 注入元件的 DOM 元素

雖然開發者通常會避免這麼做，但有些視覺效果和第三方工具需要你直接存取 DOM。
在這種情況下，你可能需要存取元件的 DOM 元素。

Angular 透過 `ElementRef` token 進行注入，公開 `@Component` 或 `@Directive` 底層的 DOM 元素：

```ts {highlight:[7]}
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```

## 注入宿主元素的標籤名稱 {#inject-the-host-elements-tag-name}

若要取得宿主元素的標籤名稱，請使用 `HOST_TAG_NAME` token 注入它。

```ts
import {Directive, HOST_TAG_NAME, inject} from '@angular/core';

@Directive({
  selector: '[roleButton]',
})
export class RoleButtonDirective {
  private tagName = inject(HOST_TAG_NAME);

  onAction() {
    switch (this.tagName) {
      case 'button':
        // Handle button action
        break;
      case 'a':
        // Handle anchor action
        break;
      default:
        // Handle other elements
        break;
    }
  }
}
```

NOTE: 如果宿主元素可能沒有標籤名稱（例如 `ng-container` 或 `ng-template`），請把注入設為可選。

## 用前向參考解決循環依賴 {#resolve-circular-dependencies-with-a-forward-reference}

在 TypeScript 中，類別宣告的順序很重要。
在定義類別之前，你無法直接參考它。

這通常不是問題，特別是當你遵循建議的*一個檔案一個類別*規則時。
然而，在某些情況下，循環參考無可避免。
例如，如果類別「A」參考類別「B」，而類別「B」又參考類別「A」，其中一個就必須先定義。

Angular 的 `forwardRef()` 函式會建立一個*間接*參考，讓 Angular 稍後再解析。

當類別*參考自己*時，你也會面臨類似的問題。
例如在它的 `providers` 陣列中。
`providers` 陣列是 `@Component()` 裝飾器函式的屬性，必須出現在類別定義之前。
這類循環參考可以用 `forwardRef` 解決。

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
