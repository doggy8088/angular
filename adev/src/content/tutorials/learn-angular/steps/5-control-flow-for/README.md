# 元件中的控制流程 - `@for`

在建立網頁應用程式時，您經常需要重複一些程式碼數次 - 例如，給定一個陣列名稱，您可能想要在 `<p>` 標籤中顯示每個名稱。

在這個活動中，您將學習如何使用 `@for` 在範本中重複元素。

<hr/>

讓範本中元素可重複的語法是 `@for`。

以下是如何在元件中使用 `@for` 語法的範例：

```ts
@Component({
  ...
  template: `
    @for (os of operatingSystems; track os.id) {
      {{ os.name }}
    }
  `,
})
export class AppComponent {
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'MacOS'}, {id: 'linux', name: 'Linux'}];
}
```

兩件事需要注意：

* `for` 前面有 `@` 前綴，因為它是一種特殊語法，稱為 [Angular 範本語法](guide/templates)
* 對於使用 v16 及以下版本的應用程式，請參閱 [Angular 說明文件以取得 NgFor](guide/directives/structural-directives)

<docs-workflow>

<docs-step title="加入 `users` 屬性">
在 `AppComponent` 類別中，加入一個名為 `users` 且包含使用者及其名稱的屬性。

```ts
[{id: 0, name: 'Sarah'}, {id: 1, name: 'Amy'}, {id: 2, name: 'Rachel'}, {id: 3, name: 'Jessica'}, {id: 4, name: 'Poornima'}]
```

</docs-step>

<docs-step title="更新範本">
使用 `@for` 範本語法將每個使用者名稱顯示在 `p` 元素中，以更新範本。

```ts
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

注意: 使用 `track` 是必要的，你可以使用 `id` 或其他唯一的識別符號。

</docs-step>

</docs-workflow>

這種功能稱為控制流程。接下來，您將學習自訂和與元件溝通 - 順便說一下，到目前為止您做得很好。

