# 元件中的控制流程——`@if`

在應用程式開發中，決定要在畫面上為使用者顯示什麼，是很常見的工作。很多時候，這個決定是透過程式依條件做出的。

要在範本中表達條件式顯示，Angular 使用 `@if` 範本語法。

NOTE: 在[核心概念指南](/essentials/templates#control-flow-with-if-and-for)中進一步了解控制流程。

在這個練習中，你將學習如何在範本中使用條件判斷。

<hr/>

讓元素能在範本中條件式顯示的語法是 `@if`。

以下是在元件中使用 `@if` 語法的範例：

```angular-ts
@Component({
  ...
  template: `
    @if (isLoggedIn) {
      <p>Welcome back, Friend!</p>
    }
  `,
})
export class App {
  isLoggedIn = true;
}
```

有兩件事要留意：

- `if` 前面有 `@` 前綴，因為這是一種特殊語法，稱為 [Angular 範本語法](guide/templates)
- 對於仍在使用 `*ngIf` 的應用程式，更多資訊請參閱 [NgIf 的 Angular 文件](guide/directives/structural-directives)。

<docs-workflow>

<docs-step title="建立名為 `isServerRunning` 的屬性">
在 `App` 類別中，加上一個名為 `isServerRunning` 的 `boolean` 屬性，初始值設為 `true`。
</docs-step>

<docs-step title="在範本中使用 `@if`">
更新範本，當 `isServerRunning` 的值為 `true` 時，顯示訊息 `Yes, the server is running`。

</docs-step>

<docs-step title="在範本中使用 `@else`">
Angular 現在支援原生範本語法，可以用 `@else` 語法定義 else 的情況。更新範本，把訊息 `No, the server is not running` 顯示為 else 的情況。

範例如下：

```angular-html
template: `
@if (isServerRunning) {
  ...
} @else {
  ...
}
`;
```

加上你的程式碼，填入缺少的標記。

</docs-step>

</docs-workflow>

這類功能稱為條件式控制流程。接下來你將學習如何在範本中重複顯示項目。
