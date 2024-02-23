# DI 在行動

本指南探討 Angular 中依賴注入的其他功能。

## 使用 `@Inject` 的自訂供應商`

使用自訂提供者可讓您提供隱含依賴項的具體實作，例如內建瀏覽器 API。
以下範例使用 `InjectionToken` 提供 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) 瀏覽器 API 作為 `BrowserStorageService` 中的依賴項。

<docs-code header="src/app/storage.service.ts" language="typescript"
           highlight="[[3,6],[12]]">
import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

get(key: string) {
    return this.storage.getItem(key);
  }

set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
}
</docs-code>

`factory` 函數傳回附加到瀏覽器視窗物件的 `localStorage` 屬性。
`Inject` 裝飾器是建構函數參數，用於指定依賴關係的客製化提供者。

這個自訂提供者現在可在測試期間被模擬 `localStorage` API 覆寫，而不會與實際瀏覽器 API 互動。

## 注入元件的 DOM 元素

儘管開發人員努力避免，有些視覺效果和第三方工具需要直接存取 DOM。
因此，您可能需要存取元件的 DOM 元素。

Angular 透過使用 `ElementRef` 注入程式碼，在注入時公開 `@Component` 或 `@Directive` 的底層元素。

<docs-code language="typescript" highlight="[7]">
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private element: ElementRef) {}

update() {
    this.element.nativeElement.style.color = 'red';
  }
}
</docs-code>

## 使用前向參考解決循環依賴

html
<!-- Import the `module` that has the circular dependency. -->
<script src="module.js"></script>

<!-- Define the `main` module, which has a circular dependency on the `module` module. -->
<script>
  const main = (function () {
    // Use the `module` module.
    const moduleValue = module.getValue();

    // Return the `main` module.
    return {
      getValue: function () {
        return moduleValue;
      },
    };
  })();
</script>

在 TypeScript 中，類別宣告的順序很重要。
在類別定義之前，您無法直接參考它。

這通常不是一個問題，尤其是當你遵守建議的「每檔案一個類別」規則時。
但有時循環引用是不可避免的。
例如，當類別「A」引用類別「B」，而「B」引用「A」時。
其中之一必須先定義。

Angular `forwardRef()` 函數建立一個 *間接* 參考，讓 Angular 能在稍後解析。

當一個類別對 *它自己進行參照* 時，你會面臨類似的問題。
例如在它的 `providers` 陣列中。
`providers` 陣列是 `@Component()` 裝飾器函數的一個屬性，它必須出現在類別定義之前。
你可以使用 `forwardRef` 來中斷這種循環參照。

<docs-code header="app.component.ts" language="typescript" highlight="[4]">
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
</docs-code>
