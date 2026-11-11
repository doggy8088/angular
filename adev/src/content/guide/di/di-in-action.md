# DI 實務應用

本指南探討 Angular 依賴注入的其他功能。

## 使用 `@Inject` 的自訂提供者 {#custom-providers-with-inject}

使用自訂提供者，能讓你為隱含的依賴提供具體的實作，例如內建的瀏覽器 API。
以下範例使用 `InjectionToken`，將 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) 瀏覽器 API 作為 `BrowserStorageService` 中的依賴提供出來：

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
  public storage = inject(BROWSER_STORAGE);

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
}
</docs-code>

`factory` 函式會傳回附加在瀏覽器 window 物件上的 `localStorage` 屬性。
`inject` 函式會以該 token 的一個實例，初始化 `storage` 屬性。

這個自訂提供者現在可以在測試期間被覆寫為 `localStorage` 的模擬 API，而不必與真正的瀏覽器 API 互動。

## 注入元件的 DOM 元素

雖然開發者力求避免這麼做，但有些視覺效果和第三方工具需要直接存取 DOM。
因此，你可能需要存取元件的 DOM 元素。

Angular 透過注入的方式，使用 `ElementRef` 注入 token 公開 `@Component` 或 `@Directive` 的底層元素：

<docs-code language="typescript" highlight="[7]">
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  private element = inject(ElementRef)

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
</docs-code>

## 用前向參考解決循環依賴 {#resolve-circular-dependencies-with-a-forward-reference}

類別宣告的順序在 TypeScript 中很重要。
在類別被定義之前，你無法直接參考它。

這通常不是問題，特別是當你遵循建議的*一個檔案一個類別*規則時。
但有時循環參考無可避免。
例如，當類別 'A' 參考類別 'B'，而 'B' 參考 'A' 時，其中一個必須先定義。

Angular 的 `forwardRef()` 函式會建立一個*間接*參考，讓 Angular 稍後再解析。

當類別*參考自己*時，你也會面臨類似的問題。
例如在它的 `providers` 陣列中。
`providers` 陣列是 `@Component()` 裝飾器函式的屬性，必須出現在類別定義之前。
你可以使用 `forwardRef` 打破這類循環參考。

<docs-code header="app.component.ts" language="typescript" highlight="[4]">
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
</docs-code>
