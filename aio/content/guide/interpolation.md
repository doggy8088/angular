# 以插值顯示值

## 先備知識

* [元件基礎](guide/architecture-components)
* [範本基礎](guide/glossary#範本（template）)
* [繫結語法](guide/binding-syntax)

<!--todo: needs a level 2 heading for info below -->

插值是指將運算式嵌入標記文字中。依預設，插值使用雙大括號 `{{` 與 `}}` 作為分隔符號。

為了說明插值如何運作，以一個包含 `currentCustomer` 變數的 Angular 元件為例：

<code-example path="interpolation/src/app/app.component.ts" region="customer"></code-example>

使用插值，在對應的元件範本中顯示這個變數的值：

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1"></code-example>

Angular 會以對應元件屬性的字串值取代 `currentCustomer`。在這個案例中，值是 `Maria`。

在以下範例中，Angular 會評估 `title` 與 `itemImageUrl` 屬性，以顯示一些標題文字與一張圖片。

<code-example path="interpolation/src/app/app.component.html" region="component-property"></code-example>

## 接下來

* [屬性繫結](guide/property-binding)
* [事件繫結](guide/event-binding)

@reviewed 2022-04-14
