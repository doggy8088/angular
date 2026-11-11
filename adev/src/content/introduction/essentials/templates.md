<docs-decorative-header title="範本" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
運用 Angular 的範本語法，建立動態的使用者介面。
</docs-decorative-header>

元件範本不只是靜態 HTML，它還能使用元件類別中的資料，並為使用者互動設定處理常式。

## 顯示動態文字 {#showing-dynamic-text}

在 Angular 中，繫結會在元件的範本與其資料之間建立動態連結。這個連結能確保元件資料一旦變更，渲染出的範本就會自動更新。

你可以使用雙大括號來建立繫結，在範本中顯示動態文字：

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{userName()}}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

當 Angular 渲染這個元件時，你會看到：

```html
<h1>Profile for pro_programmer_123</h1>
```

當訊號的值改變時，Angular 會自動讓繫結保持最新。延續上面的範例，如果我們更新 `userName` 訊號的值：

```typescript
this.userName.set('cool_coder_789');
```

渲染出的頁面就會更新，反映新的值：

```html
<h1>Profile for cool_coder_789</h1>
```

## 設定動態的屬性與屬性值 {#setting-dynamic-properties-and-attributes}

Angular 支援使用方括號，把動態值繫結到 DOM 屬性上：

```angular-ts
@Component({
  /*...*/
  // Set the `disabled` property of the button based on the value of `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

你也可以在屬性名稱前加上 `attr.` 前綴，來繫結 HTML 屬性值：

```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to value of `listRole`. -->
<ul [attr.role]="listRole()">
```

當被繫結的值改變時，Angular 會自動更新 DOM 屬性與屬性值。

## 處理使用者互動 {#handling-user-interaction}

Angular 讓你可以使用括號，為範本中的元素加上事件監聽器：

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() { /* Your event handling code goes here. */  }
}
```

如果你需要把 [event](https://developer.mozilla.org/docs/Web/API/Event) 物件傳給你的監聽器，可以在函式呼叫中使用 Angular 內建的 `$event` 變數：

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) { /* Your event handling code goes here. */  }
}
```

## 使用 `@if` 與 `@for` 控制流程 {#control-flow-with-if-and-for}

你可以使用 Angular 的 `@if` 區塊，有條件地隱藏與顯示範本的一部分：

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
}
```

`@if` 區塊也支援可選的 `@else` 區塊：

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```

你可以使用 Angular 的 `@for` 區塊，把範本的一部分重複多次：

```angular-html
<h1>User profile</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{badge.name}}</li>
  }
</ul>
```

Angular 使用上面範例中的 `track` 關鍵字，把資料與 `@for` 建立的 DOM 元素關聯起來。詳情請參閱[為什麼 `@for` 區塊中的 track 很重要？](guide/templates/control-flow#why-is-track-in-for-blocks-important)。

TIP: 想更深入了解 Angular 範本嗎？請參閱[範本深入指南](guide/templates)，取得完整說明。

## 下一步

現在你的應用程式已經有了動態資料與範本，接著來學習如何強化範本：有條件地隱藏或顯示某些元素、逐一處理多個元素等等。

<docs-pill-row>
  <docs-pill title="以依賴注入實現模組化設計" href="essentials/dependency-injection" />
  <docs-pill title="範本深入指南" href="guide/templates" />
</docs-pill-row>
