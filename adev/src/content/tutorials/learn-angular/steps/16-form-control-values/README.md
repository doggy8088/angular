# 獲取表單控制項值

現在您的表單已使用 Angular 設定好，下一步是從表單控制項存取值。

在這個活動中，你將學習如何從你的表單輸入中獲取數值。

<hr>

<docs-workflow>

<docs-step title="在範本中顯示輸入欄位的值">

要在範本中顯示輸入值，您可以像使用元件的任何其他類別屬性一樣，使用插補語法 `{{}}`：

<docs-code language="ts" highlight="[5]">
@Component({
  selector: 'app-user',
  template: `
    ...
    <p>Framework: {{ favoriteFramework }}</p>
    <label for="framework">
      Favorite Framework:
      <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
    </label>
  `,
})
export class UserComponent {
  favoriteFramework = '';
}
</docs-code>

</docs-step>

<docs-step title="擷取輸入欄位的值">

當您需要在元件類別中參考輸入欄位值時，您可以透過 `this` 語法存取類別屬性來做到。

<docs-code language="ts" highlight="[15]">
...
@Component({
  selector: 'app-user',
  template: `
    ...
    <button (click)="showFramework()">Show Framework</button>
  `,
  ...
})
export class UserComponent {
  favoriteFramework = '';
  ...

showFramework() {
    alert(this.favoriteFramework);
  }
}
</docs-code>

</docs-step>

</docs-workflow>

在範本中顯示輸入值並以程式方式存取它們，做得很好。

時間繼續進入下一個使用 Angular 管理表單的方法：反應式表單。如果您想進一步了解範本驅動的表單，請參閱 [Angular 表單文件](guide/forms/reactive-forms)。

