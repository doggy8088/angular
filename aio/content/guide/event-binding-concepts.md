
# 事件繫結如何運作

在事件繫結中，Angular 會為目標事件設定一個事件處理器。你可以將事件繫結與你自己的自訂事件一起使用。

當元件或指令引發事件時，處理器會執行範本陳述式。範本陳述式會執行動作以回應事件。

## 處理事件

處理事件的常見方式，是把事件物件 `$event` 傳給處理事件的方法。`$event` 物件通常包含方法需要的資訊，例如使用者的名稱或圖片 URL。

目標事件決定了 `$event` 物件的形狀。如果目標事件是原生的 DOM 元素事件，那麼 `$event` 就是一個 [DOM 事件物件](https://developer.mozilla.org/en-US/docs/Web/Events)，帶有 `target` 與 `target.value` 等屬性。

在下列範例中，程式碼透過繫結到 `name` 屬性，來設定 `<input>` 的 `value` 屬性。


<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

使用這個範例時，會發生下列動作：

1. 程式碼會繫結到 `<input>` 元素的 `input` 事件，讓程式碼可以監聽變更。
1. 當使用者做出變更時，元件會引發 `input` 事件。
1. 繫結會在包含 DOM 事件物件 `$event` 的上下文中執行陳述式。
1. Angular 會呼叫 `getValue($event.target)` 來取得變更後的文字，並更新 `name` 屬性。

如果事件屬於某個指令或元件，`$event` 會具有該指令或元件所產生的形狀。

<div class="alert is-helpful">

在範本中，`$event.target` 的型別只有 `EventTarget`。
在 `getValue()` 方法中，target 會被轉型為 `HTMLInputElement`，以便用型別安全的方式存取其 `value` 屬性。

<code-example path="event-binding/src/app/app.component.ts" region="getValue"></code-example>

</div>
