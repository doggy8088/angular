# 元件中的控制流程 - `@if`

決定要在螢幕上顯示什麼給使用者是應用程式開發中的一項常見任務。許多時候，這個決定會使用條件以程式化方式做出。

若要表達範本中的條件式顯示，Angular 使用 `@if` 範本語法。

在這個活動中，你將學習如何在範本中使用條件。

<hr/>

在範本中啟用元素的條件式顯示的語法是 `@if`。

以下是如何在元件中使用 `@if` 語法的一個範例：

```ts
@Component({
  ...
  template: `
    @if (isLoggedIn) {
      <p>Welcome back, Friend!</p>
    }
  `,
})
class AppComponent {
  isLoggedIn = true;
}
```

兩件事需要注意：

- `if` 前面有 `@` 前綴，因為它是一種特殊的語法類型，稱為 [Angular 模板語法](guide/templates)
- 對於使用 v16 及更早版本之應用程式，請參閱 [Angular 文件中的 NgIf](guide/directives/structural-directives) 以取得更多資訊。

<docs-workflow>

<docs-step title="建立名為 `isServerRunning` 的屬性">
在 `AppComponent` 類別中，新增一個名為 `isServerRunning` 的 `boolean` 屬性，將初始值設定為 `true`。
</docs-step>

<docs-step title="在範本中使用 `@if`">
如果 `isServerRunning` 的值為 `true`，請更新範本以顯示訊息 `Yes, the server is running`。

</docs-step>

<docs-step title="在範本中使用 `@else`">
現在，Angular 支援使用 `@else` 語法來定義 else 案例的原生範本語法。更新範本，以顯示訊息 `否，伺服器沒有執行中` 作為 else 案例。

以下是一個範例：

```ts
template: `
  @if (isServerRunning) { ... }
  @else { ... }
`;
```

新增您的程式碼來填入遺失的標記。

</docs-step>

</docs-workflow>

這種功能稱為條件控制流程。接下來您將學習如何在範本中重複項目。

