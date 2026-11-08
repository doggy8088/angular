# 使用 DOM API

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

DOM 的建立、更新與移除，大多由 Angular 為你處理。不過，你偶爾可能需要直接與元件的 DOM 互動。元件可以注入 ElementRef，取得元件宿主元素的參考：

```ts
@Component(/* ... */)
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

`nativeElement` 屬性參照宿主 [Element](https://developer.mozilla.org/docs/Web/API/Element) 執行個體。

你可以使用 Angular 的 `afterEveryRender` 與 `afterNextRender` 函式，註冊一個**算繪回呼**，在 Angular 完成頁面算繪時執行。

```ts
@Component(/* ... */)
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` 與 `afterNextRender` 必須在_注入情境_中呼叫，通常是元件的建構函式。

**應盡可能避免直接操作 DOM**。請一律優先在元件範本中表達 DOM 的結構，並以繫結更新該 DOM。

**算繪回呼不會在伺服器端算繪或建置時期預先算繪時執行**。

**絕不要在其他 Angular 生命週期掛鉤中直接操作 DOM**。Angular 不保證元件的 DOM 在算繪回呼以外的任何時間點已完整算繪。此外，在其他生命週期掛鉤期間讀取或修改 DOM，可能因造成[版面抖動（layout thrashing）](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing)而對頁面效能造成負面影響。

## 使用元件的算繪器

元件可以注入 `Renderer2` 的執行個體，執行某些與其他 Angular 功能相連的 DOM 操作。

由元件 `Renderer2` 建立的任何 DOM 元素，都會參與該元件的[樣式封裝](guide/components/styling#style-scoping)。

某些 `Renderer2` API 也與 Angular 的動畫系統相連。你可以使用 `setProperty` 方法更新合成動畫屬性，並使用 `listen` 方法為合成動畫事件加上事件監聽器。詳情請參閱[動畫](guide/animations)指南。

除了這兩個狹窄的應用情境之外，使用 `Renderer2` 與使用原生 DOM API 並無差異。兩者在伺服器端算繪與建置時期預先算繪時都能運作，但伺服器的 DOM 缺少僅限瀏覽器的 API，例如版面量測與觀察器。

## 何時使用 DOM API

雖然 Angular 處理了大多數算繪相關事務，有些行為仍可能需要使用 DOM API。一些常見的應用情境包括：

- 管理元素焦點
- 量測元素幾何，例如使用 `getBoundingClientRect`
- 讀取元素的文字內容
- 設定原生觀察器，例如 [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver)、[`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) 或 [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)。

應避免插入、移除與修改 DOM 元素。特別是**絕不要直接設定元素的 `innerHTML` 屬性**，這可能讓你的應用程式容易遭受[跨網站指令碼（XSS）攻擊](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting)。Angular 的範本繫結，包括對 `innerHTML` 的繫結，都含有有助於防範 XSS 攻擊的保護措施。詳情請參閱[安全性指南](best-practices/security)。
