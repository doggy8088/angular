# 元件中的控制流程——`@for`

建置網路應用程式時，你常常需要把某段程式碼重複特定次數——例如，給你一組名字陣列，你可能想把每個名字都顯示在 `<p>` 標籤中。

NOTE: 在[核心概念指南](/essentials/templates#control-flow-with-if-and-for)中進一步了解控制流程。

在這個練習中，你將學習如何使用 `@for` 在範本中重複顯示元素。

<hr/>

讓元素能在範本中重複顯示的語法是 `@for`。

以下是在元件中使用 `@for` 語法的範例：

```angular-ts
@Component({
  ...
  template: `
    @for (os of operatingSystems; track os.id) {
      {{ os.name }}
    }
  `,
})
export class App {
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'macOS'}, {id: 'linux', name: 'Linux'}];
}
```

有兩件事要留意：

- `for` 前面有 `@` 前綴，因為這是一種特殊語法，稱為 [Angular 範本語法](guide/templates)
- 對於使用 v16 及更舊版本的應用程式，更多資訊請參閱 [NgFor 的 Angular 文件](guide/directives/structural-directives)

<docs-workflow>

<docs-step title="加上 `users` 屬性">
在 `App` 類別中，加上一個名為 `users` 的屬性，裡面存放使用者和他們的名字。

```ts
[
  {id: 0, name: 'Sarah'},
  {id: 1, name: 'Amy'},
  {id: 2, name: 'Rachel'},
  {id: 3, name: 'Jessica'},
  {id: 4, name: 'Poornima'},
];
```

</docs-step>

<docs-step title="更新範本">
更新範本，使用 `@for` 範本語法，把每個使用者名稱顯示在 `p` 元素中。

```angular-html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

NOTE: 使用 `track` 是必要的，你可以使用 `id` 或其他唯一識別值。

</docs-step>

</docs-workflow>

這類功能稱為控制流程。接下來，你將學習如何自訂元件並與元件溝通——順帶一提，你目前為止做得很棒。
