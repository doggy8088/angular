# 使用 DOM API

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

Angular 會自動處理大部分的 DOM 建立、更新和移除。不過，您可能偶爾需要直接與元件的 DOM 互動。元件可以注入 ElementRef 以取得對元件主機元素的參照：

```ts
@Component({...})
export class ProfilePhoto {
  constructor(elementRef: ElementRef) {
    console.log(elementRef.nativeElement);
  }
}
```

`nativeElement` 屬性參照主機 [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) 實例。

你可以使用 Angular 的 `afterRender` 和 `afterNextRender` 函式來註冊一個 **渲染回呼**，當 Angular 完成頁面的渲染時執行。

```ts
@Component({...})
export class ProfilePhoto {
  constructor(elementRef: ElementRef) {
    afterRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterRender` 和 `afterNextRender` 必須在 _注入內容_ 中呼叫，通常是元件的建構函式。

**盡可能避免直接操作 DOM。**請務必優先在元件範本中表達您的 DOM 結構，並使用綁定來更新該 DOM。

**回呼函式在伺服器端渲染或建構時間預先渲染期間從不執行。**

**切勿直接處理其他 Angular 生命週期掛鉤內的 DOM**。Angular 不保證元件的 DOM 在回呼函式以外的任何地方都已完全呈現。
此外，在其他生命週期掛鉤期間讀取或修改 DOM 可能會造成 [版面重排](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing)，進而對網頁效能造成負面影響。

## 使用元件的渲染器

html
<div id="app">
  <div v-for="item in items">
    {{ item.name }}
  </div>
</div>


js
new Vue({
  el: '#app',
  data: {
    items: [
      { name: 'apple' },
      { name: 'banana' },
      { name: 'cherry' }
    ]
  },
  render: function (createElement) {
    return createElement(
      'ul',
      this.items.map(function (item) {
        return createElement('li', item.name)
      })
    )
  }
})

元件可以注入 `Renderer2` 的實例，以執行與其他 Angular 功能相關的某些 DOM 操作。

由元件的 `Renderer2` 建立的任何 DOM 元素都會參與該元件的 [樣式封裝](guide/components/styling#style-scoping)。

某些 `Renderer2` API 也與 Angular 動畫系統綁定。您可以使用 `setProperty` 方法更新合成動畫屬性，並使用 `listen` 方法新增合成動畫事件的事件監聽器。詳情請參閱 [動畫](guide/animations) 指南。

除了這兩個狹窄的使用案例外，使用 `Renderer2` 和原生 DOM API 之間沒有區別。`Renderer2` API 不支援伺服器端渲染或建置時間預渲染內容中的 DOM 處理。

## 什麼時候使用 DOM API

## 何時使用 DOM API

儘管 Angular 處理大部分的呈現問題，某些行為可能仍需要使用 DOM API。一些常見的使用案例包括：

- 管理元素焦點
- 測量元素幾何，例如使用 `getBoundingClientRect`
- 讀取元素的文字內容
- 設定原生觀察器，例如
  [`MutationObserver`](https://developer.mozilla.org/zh-TW/docs/Web/API/MutationObserver)、
  [`ResizeObserver`](https://developer.mozilla.org/zh-TW/docs/Web/API/ResizeObserver) 或
  [`IntersectionObserver`](https://developer.mozilla.org/zh-TW/docs/Web/API/Intersection_Observer_API)。

避免插入、移除和修改 DOM 元素。特別是，**切勿直接設定元素的 `innerHTML` 屬性**，這會讓您的應用程式容易受到 [跨網站指令碼 (XSS) 攻擊](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) 的影響。Angular 的範本繫結，包括 `innerHTML` 的繫結，包含可幫助防止 XSS 攻擊的安全防護。詳情請參閱 [安全性指南](guide/security)。
