# 使用內插來顯示值

內插是指將表達式嵌入標記文字中。預設內插使用雙大括弧 `{{` 和 `}}` 作為分隔符。

為了說明內插運作的方式，考慮一個包含 `currentCustomer` 變數的 Angular 元件：

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.ts" visibleLines="13"/>

使用插值在對應的元件範本中顯示此變數的值：

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="interpolation-example1"/>

Angular 將 `currentCustomer` 替換為對應元件屬性的字串值。在此範例中，該值為 `Maria`。

在以下範例中，Angular 會評估 `title` 和 `itemImageUrl` 屬性以顯示一些標題文字和圖像。

<docs-code path="adev/src/content/examples/interpolation/src/app/app.component.html" visibleRegion="component-property"/>

## 接下來是什麼

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding" title="屬性繫結"/>
  <docs-pill href="guide/templates/event-binding" title="事件繫結"/>
</docs-pill-row>
