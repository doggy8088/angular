# 元件的輸入屬性

有時候，應用程式開發需要你把資料送進元件中。這些資料可以用來客製化元件，或是把資訊從父元件傳送到子元件。

Angular 使用一個稱為 `input` 的概念。這與其他框架中的 `props` 類似。要建立 `input` 屬性，請使用 `input()` 函式。

Note: 在[輸入指南](/guide/components/inputs)中進一步了解如何以輸入屬性接收資料。

在這個練習中，你將學習如何使用 `input()` 函式把資訊傳送給元件。

<hr>

要建立 `input` 屬性，請把 `input()` 函式加到元件類別的屬性初始化中：

<docs-code header="user.ts" language="ts">
class User {
  occupation = input<string>();
}
</docs-code>

當你準備透過 `input` 傳入值時，可以在範本中使用特性語法來設定值。範例如下：

<docs-code header="app.ts" language="angular-ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
export class App {}
</docs-code>

`input` 函式會回傳一個 `InputSignal`。你可以呼叫這個訊號來讀取它的值。

<docs-code header="user.ts" language="angular-ts">
@Component({
  ...
  template: `<p>The user's occupation is {{occupation()}}</p>`
})
</docs-code>

<docs-workflow>

<docs-step title="定義 `input()` 屬性">
更新 `user.ts` 中的程式碼，在 `User` 上定義一個名為 `name` 的 `input` 屬性，並指定 `string` 型別。目前先不要設定初始值，並在不帶引數的情況下呼叫 `input()`。別忘了更新範本，在句子結尾呼叫並插值 `name` 屬性。
</docs-step>

<docs-step title="把值傳給 `input` 屬性">
更新 `app.ts` 中的程式碼，傳入 `name` 屬性，值為 `"Simran"`。
<br>

程式碼成功更新後，應用程式會顯示 `The user's name is Simran`。
</docs-step>

</docs-workflow>

這樣固然很好，但這只是元件溝通的其中一個方向。如果你想把資訊和資料從子元件傳送到父元件，該怎麼做呢？查看下一課找答案。

P.S. 你做得很好——繼續前進 🎉
