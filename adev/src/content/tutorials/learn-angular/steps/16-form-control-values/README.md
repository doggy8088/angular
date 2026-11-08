# 取得表單控制項的值

現在你的表單已經用 Angular 設定好了，下一步是存取表單控制項的值。

NOTE: 在[深入指南](/guide/forms/reactive-forms#adding-a-basic-form-control)中進一步了解如何加上基本表單控制項。

在這個練習中，你將學習如何取得表單輸入框的值。

<hr>

<docs-workflow>

<docs-step title="在範本中顯示輸入欄位的值">

要在範本中顯示輸入值，你可以使用插值語法 `{{}}`，用法就和元件的其他任何類別屬性一樣：

```angular-ts {highlight:[5]}
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
export class User {
  favoriteFramework = '';
}
```

</docs-step>

<docs-step title="擷取輸入欄位的值">

當你需要在元件類別中參照輸入欄位的值時，你可以使用 `this` 語法存取類別屬性來做到這一點。

```angular-ts {highlight:[15]}
...
@Component({
  selector: 'app-user',
  template: `
    ...
    <button (click)="showFramework()">Show Framework</button>
  `,
  ...
})
export class User {
  favoriteFramework = '';
  ...

  showFramework() {
    alert(this.favoriteFramework);
  }
}
```

</docs-step>

</docs-workflow>

做得很好，你學會了如何在範本中顯示輸入值，並以程式方式存取它們。

是時候進展到 Angular 管理表單的下一個方式了：反應式表單。如果你想進一步了解範本驅動表單，請參閱 [Angular 表單文件](guide/forms/template-driven-forms)。
