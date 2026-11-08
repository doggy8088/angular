# 使用 model 訊號進行雙向繫結

既然你已學會[使用輸入訊號將資料傳遞給元件](/tutorials/signals/5-component-communication-with-signals)，接著來探索 Angular 用於雙向繫結的 `model()` API。model 訊號非常適合核取方塊、滑桿或自訂表單控制項等 UI 元件，這類元件需要同時接收一個值，也需要更新它。

在本活動中，你將建立一個自訂核取方塊元件，它管理自己的狀態，同時與父元件保持同步。

<hr />

<docs-workflow>

<docs-step title="使用 model 訊號設定自訂核取方塊">
在 `custom-checkbox` 元件中建立一個 model 訊號，它既能接收，也能更新父元件的值。

```ts
// Add imports for model signals
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';

// Model signal for two-way binding
checked = model.required<boolean>();

// Optional input for label
label = input<string>('');
```

與唯讀的 `input()` 訊號不同，`model()` 訊號既可讀取，也可寫入。
</docs-step>

<docs-step title="建立核取方塊範本">
建置會回應點選，並更新自身 model 的核取方塊範本。

```html
<label class="custom-checkbox">
  <input type="checkbox" [checked]="checked()" (change)="toggle()" />
  <span class="checkmark"></span>
  {{ label() }}
</label>
```

元件會讀取它的 model 訊號，並有一個方法來更新它。
</docs-step>

<docs-step title="加入 toggle 方法">
實作 toggle 方法，在核取方塊被點選時更新 model 訊號。

```ts
toggle() {
  // This updates BOTH the component's state AND the parent's model!
  this.checked.set(!this.checked());
}
```

當子元件呼叫 `this.checked.set()` 時，變更會自動傳播回父元件。這就是與 `input()` 訊號的關鍵差異。
</docs-step>

<docs-step title="在父元件中設定雙向繫結">
首先，取消 `app.ts` 中 model 訊號屬性與方法的註解：

```ts
// Parent signal models
agreedToTerms = model(false);
enableNotifications = model(true);

// Methods to test two-way binding
toggleTermsFromParent() {
  this.agreedToTerms.set(!this.agreedToTerms());
}

resetAll() {
  this.agreedToTerms.set(false);
  this.enableNotifications.set(false);
}
```

接著更新範本：

第 1 部分：**取消核取方塊的註解並加入雙向繫結**

- 將第一個核取方塊的 `___ADD_TWO_WAY_BINDING___` 換成 `[(checked)]="agreedToTerms"`
- 將第二個核取方塊的 `___ADD_TWO_WAY_BINDING___` 換成 `[(checked)]="enableNotifications"`

第 2 部分：**將 `???` 預留位置換成 @if 區塊**

```angular-html
@if (agreedToTerms()) {
  Yes
} @else {
  No
}

@if (enableNotifications()) {
  Yes
} @else {
  No
}
```

第 3 部分：**為按鈕加入點選處理常式**

```html
<button (click)="toggleTermsFromParent()">Toggle Terms from Parent</button>
<button (click)="resetAll()">Reset All</button>
```

`[(checked)]` 語法會建立雙向繫結：資料向下流入元件，變更也向上流回父元件，其機制是發出一個引用訊號本身的事件，而不是直接呼叫訊號的 getter。
</docs-step>

<docs-step title="測試雙向繫結">
與你的應用程式互動，看看雙向繫結的實際運作：

1. **點選核取方塊**：元件更新自己的狀態並通知父元件
2. **點選 "Toggle Terms from Parent"**：父元件的更新向下傳播到元件
3. **點選 "Reset All"**：父元件重設兩個 model，元件自動更新

父元件與子元件都能更新共享的狀態，而且兩者會自動保持同步！
</docs-step>

</docs-workflow>

太完美了！你已學會 model 訊號如何實現雙向繫結：

- **model 訊號**：使用 `model()` 與 `model.required()` 處理既可讀取也可寫入的值
- **雙向繫結**：使用 `[(property)]` 語法將父元件訊號繫結到子元件的 model
- **非常適合 UI 元件**：核取方塊、表單控制項，以及需要管理自身狀態的小工具
- **自動同步**：父元件與子元件保持同步，無需手動處理事件

**何時使用 `model()`、何時使用 `input()`**

- 資料只向下流動（顯示資料、設定）時，使用 `input()`
- UI 元件需要更新自己的值（表單控制項、切換開關）時，使用 `model()`

在下一課中，你將學到[搭配服務使用訊號](/tutorials/signals/7-using-signals-with-services)！
