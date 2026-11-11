# 以 `@Input` 進行元件溝通

有時候，應用程式開發需要你把資料送進元件中。這些資料可以用來客製化元件，或是把資訊從父元件傳送到子元件。

Angular 使用一個稱為 `Input` 的概念。這與其他框架中的 `props` 類似。要建立 `Input` 屬性，請使用 `@Input` 裝飾器。

在這個練習中，你將學習如何使用 `@Input` 裝飾器把資訊傳送給元件。

<hr>

要建立 `Input` 屬性，請把 `@Input` 裝飾器加到元件類別的一個屬性上：

<docs-code header="user.component.ts" language="ts">
class UserComponent {
  @Input() occupation = '';
}
</docs-code>

當你準備透過 `Input` 傳入值時，可以在範本中使用特性語法來設定值。範例如下：

<docs-code header="app.component.ts" language="angular-ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
class AppComponent {}
</docs-code>

請務必在你的 `UserComponent` 中繫結 `occupation` 屬性。

<docs-code header="user.component.ts" language="angular-ts">
@Component({
  ...
  template: `<p>The user's occupation is {{occupation}}</p>`
})
</docs-code>

<docs-workflow>

<docs-step title="定義 `@Input` 屬性">
更新 `user.component.ts` 中的程式碼，在 `UserComponent` 上定義一個名為 `name` 的 `Input` 屬性。目前先把初始值設為 `empty string`。別忘了更新範本，在句子結尾插值 `name` 屬性。
</docs-step>

<docs-step title="把值傳給 `@Input` 屬性">
更新 `app.component.ts` 中的程式碼，傳入 `name` 屬性，值為 `"Simran"`。
<br>

程式碼成功更新後，應用程式會顯示 `The user's name is Simran`。
</docs-step>

</docs-workflow>

這樣固然很好，但這只是元件溝通的其中一個方向。如果你想把資訊和資料從子元件傳送到父元件，該怎麼做呢？查看下一課找答案。

P.S. 你做得很好——繼續前進 🎉
