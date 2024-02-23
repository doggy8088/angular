<docs-decorative-header title="呈現動態範本" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
使用 Angular 的範本語法來建立動態 HTML。
</docs-decorative-header>

您到目前為止所學的內容讓您可以將應用程式分解成 HTML 組件，但這會將您限制在靜態範本（即內容不會變更）。下一步是學習如何利用 Angular 的範本語法來建立動態 HTML。

## 呈現動態資料

當您需要在範本中顯示動態內容時，Angular 使用雙重大括號語法以區別靜態和動態內容。

以下是 `TodoListItem` 元件的簡化範例。

```ts
@Component({
  selector: 'todo-list-item',
  template: `
    <p>Title: {{ taskTitle }}</p>
  `,
})
export class TodoListItem {
  taskTitle = 'Read cup of coffee';
}
```

當 Angular 呈現元件時，您會看到輸出：

```html
<p>Title: Read cup of coffee</p>
```

這個語法宣告在 HTML 內部的動態資料屬性之間的 **內插**。因此，每當資料改變時，Angular 將自動更新 DOM，反映屬性的新值。

## 動態屬性

當您需要動態設定 HTML 元素上標準 DOM 屬性的值時，該屬性會以方括號包住，以告知 Angular 已宣告的值應解釋為類 JavaScript 陳述式（[具有一些 Angular 增強功能](guide/templates/interpolation)），而非純文字字串。

例如，在 HTML 中動態更新屬性的常見範例是根據表單是否有效來判斷表單提交按鈕是否應停用。

將所需的屬性用方括號包住，以告訴 Angular 指派的值是動態的（即非靜態字串）。

```ts
@Component({
  selector: 'sign-up-form',
  template: `
    <button type="submit" [disabled]="formIsInvalid">Submit</button>
  `,
})
export class SignUpForm {
  formIsInvalid = true;
}
```

在此範例中，由於 `formIsInvalid` 為 true，因此呈現的 HTML 將會是：

```html
<button type="submit" disabled>Submit</button>
```

## 動態屬性

如果您想動態繫結自訂 HTML 屬性（例如：`aria-`、`data-` 等），您可能會傾向於使用相同的方括號來包覆自訂屬性。

```ts
@Component({
  standalone: true,
  template: `
    <button [data-test-id]="testId">Primary CTA</button>
  `,
})
export class AppBanner {
  testId = 'main-cta';
}
```

很遺憾的是，這不會奏效，因為自訂 HTML 屬性並非標準 DOM 屬性。為了讓它如預期般運作，我們需要在自訂 HTML 屬性前面加上 `attr.` 前綴。

```ts
@Component({
  standalone: true,
  template: `
    <button [attr.data-test-id]="testId">Primary CTA</button>
  `,
})
export class AppBanner {
  testId = 'main-cta';
}
```

## 下一步

現在您的應用程式有動態資料和範本，是時候學習如何透過有條件地隱藏或顯示某些元素、迴圈元素等來增強範本。

<docs-pill-row>
  <docs-pill title="條件和迴圈" href="essentials/conditionals-and-loops" />
</docs-pill-row>

