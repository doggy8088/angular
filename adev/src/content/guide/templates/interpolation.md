# 以插值顯示值 {#displaying-values-with-interpolation}

插值是指將運算式嵌入標記文字中。依預設，插值使用雙大括號 `{{` 與 `}}` 作為分隔符號。

為了說明插值如何運作，以一個包含 `currentCustomer` 變數的 Angular 元件為例：

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.ts" visibleLines="13"/>

使用插值，在對應的元件範本中顯示這個變數的值：

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="interpolation-example1"/>

Angular 會以對應元件屬性的字串值取代 `currentCustomer`。在這個案例中，值是 `Maria`。

在以下範例中，Angular 會評估 `title` 與 `itemImageUrl` 屬性，以顯示一些標題文字與一張圖片。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="component-property"/>

## 接下來 {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding" title="屬性繫結"/>
  <docs-pill href="guide/templates/event-binding" title="事件繫結"/>
</docs-pill-row>
