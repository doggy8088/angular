<docs-decorative-header title="算繪動態範本" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
使用 Angular 的範本語法，建立動態 HTML。
</docs-decorative-header>

到目前為止你學到的內容，讓你能把應用程式拆解成由 HTML 組成的元件，但這會讓你受限於靜態範本（也就是不會變動的內容）。下一步，是學習如何運用 Angular 的範本語法來建立動態 HTML。

## 算繪動態資料 {#rendering-dynamic-data}

當你需要在範本中顯示動態內容時，Angular 使用雙大括號語法來區分靜態與動態內容。

以下是一個取自 `TodoListItem` 元件的簡化範例。

```angular-ts
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

當 Angular 算繪這個元件時，你會看到以下輸出：

```angular-html
<p>Title: Read cup of coffee</p>
```

這種語法在 HTML 內的動態資料屬性之間宣告了一個**插值**。因此，每當資料變更時，Angular 就會自動更新 DOM，以反映屬性的新值。

## 動態屬性 {#dynamic-properties}

當你需要動態設定 HTML 元素上標準 DOM 屬性的值時，要把屬性包在方括號中，讓 Angular 知道所宣告的值應該被解讀為類似 JavaScript 的陳述式（[並帶有一些 Angular 的增強](guide/templates/binding#render-dynamic-text-with-text-interpolation)），而不是純字串。

舉例來說，在 HTML 中動態更新屬性的一個常見例子，就是依表單是否有效，來決定表單的送出按鈕是否應該停用。

把想要設定的屬性包在方括號中，告訴 Angular 所指派的值是動態的（也就是說，不是靜態字串）。

```angular-ts
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

在這個範例中，由於 `formIsInvalid` 為 true，算繪出的 HTML 會是：

```angular-html
<button type="submit" disabled>Submit</button>
```

## 動態屬性值 {#dynamic-attributes}

如果你想要動態繫結自訂的 HTML 屬性值（例如 `aria-`、`data-` 等），你可能會想用同樣的方括號把自訂屬性值包起來。

```angular-ts
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

可惜的是，這樣做行不通，因為自訂 HTML 屬性值並不是標準的 DOM 屬性。若要讓它按預期運作，我們需要在自訂 HTML 屬性值前面加上 `attr.` 前置詞。

```angular-ts
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

## 下一步 {#next-step}

現在你的應用程式已經有了動態資料與範本，接著來學習如何強化範本：有條件地隱藏或顯示某些元素、逐一處理多個元素等等。

<docs-pill-row>
  <docs-pill title="條件與迴圈" href="essentials/conditionals-and-loops" />
</docs-pill-row>
