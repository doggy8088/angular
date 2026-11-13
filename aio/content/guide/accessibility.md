# Angular 的無障礙設計

網路的使用者形形色色，其中也包括視覺或行動方面有障礙的人。市面上有各種輔助技術，能讓這些族群更容易與以網路為基礎的軟體應用程式互動。此外，把應用程式設計得更容易使用，通常也能改善所有使用者的整體體驗。

關於設計無障礙應用程式的議題與技巧的深入介紹，請參閱 Google 的 [Web Fundamentals](https://developers.google.com/web/fundamentals/) 中的 [Accessibility](https://developers.google.com/web/fundamentals/accessibility/#what_is_accessibility) 一節。

本頁說明設計 Angular 應用程式的最佳實務，讓所有使用者（包括仰賴輔助技術的人）都能順暢使用。

<div class="alert is-helpful">

  關於本頁所說明的範例應用程式，請參閱 <live-example></live-example>。

</div>

## 無障礙屬性

建置無障礙的網頁體驗時，通常需要設定 [ARIA 屬性](https://developers.google.com/web/fundamentals/accessibility/semantics-aria)，在原本可能缺乏語意的地方提供語意。使用[屬性繫結](guide/template-syntax#屬性繫結attribute-binding)範本語法來控制無障礙相關屬性的值。

在 Angular 中繫結 ARIA 屬性時，必須使用 `attr.` 前綴，因為 ARIA 規格依賴的是 HTML 屬性，而不是 DOM 元素的 property。

```html
<!-- Use attr. when binding to an ARIA attribute -->
<button [attr.aria-label]="myActionLabel">...</button>
```

請注意，只有在做屬性繫結（attribute _bindings_）時才需要這種語法。靜態 ARIA 屬性不需要額外的語法。

```html
<!-- Static ARIA attributes require no extra syntax -->
<button aria-label="Save document">...</button>
```

NOTE:

<div class="alert is-helpful">

   依慣例，HTML 屬性使用小寫名稱（`tabindex`），而 property 使用 camelCase 名稱（`tabIndex`）。

   關於屬性與 property 之間的差異，請參閱[範本語法](guide/template-syntax#html-attribute-與-dom-屬性)指南以了解更多背景。

</div>


## Angular UI 元件

由 Angular 團隊維護的 [Angular Material](https://material.angular.io/) 程式庫，是一套可重複使用的 UI 元件，目標是做到完全無障礙。[Component Development Kit（CDK）](https://material.angular.io/cdk/categories) 包含 `a11y` 套件，提供支援各個無障礙領域的工具。例如：

* `LiveAnnouncer` 會利用 `aria-live` 區域，為螢幕閱讀器使用者播報訊息。更多關於 [aria-live 區域](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#aria-live) 的資訊，請參閱 W3C 文件。

* `cdkTrapFocus` 指令會把 Tab 鍵的焦點限制在某個元素內。你可以用它為模式對話框之類的元件打造無障礙體驗，這類元件必須限制焦點的移動範圍。

這些工具與其他工具的完整說明，請參閱 [Angular CDK 無障礙總覽](https://material.angular.io/cdk/a11y/overview)。


### 強化原生元素

原生 HTML 元素本身就具備許多對無障礙很重要的標準互動模式。撰寫 Angular 元件時，只要做得到，就應該直接重複使用這些原生元素，而不是重新實作已經有良好支援的行為。

例如，與其為新型態的按鈕建立自訂元素，不如建立一個使用屬性選擇器、搭配原生 `<button>` 元素的元件。這最常用在 `<button>` 與 `<a>` 上，但也能用在許多其他類型的元素。

你可以在 Angular Material 中看到這種模式的範例：[`MatButton`](https://github.com/angular/components/blob/master/src/material/button/button.ts#L66-L68)、[`MatTabNav`](https://github.com/angular/components/blob/master/src/material/tabs/tab-nav-bar/tab-nav-bar.ts#L67)、[`MatTable`](https://github.com/angular/components/blob/master/src/material/table/table.ts#L17)。

### 用容器包裝原生元素

有時候，要使用合適的原生元素，就需要一個容器元素。例如，原生 `<input>` 元素不能有子元素，所以任何自訂文字輸入元件都需要用額外元素把 `<input>` 包起來。雖然你可能只是把 `<input>` 放進自訂元件的範本裡，但這會讓元件的使用者無法對該輸入元素設定任意的屬性與特性。這種情況下，應該建立一個容器元件，利用內容投影把原生控制項納入元件的 API。

你可以把 [`MatFormField`](https://material.angular.io/components/form-field/overview) 當作這種模式的範例。

## 案例研究：打造自訂進度列

下面的範例示範如何利用主機繫結（host binding）控制與無障礙相關的屬性，讓簡單的進度列變得無障礙。

* 元件定義了一個支援無障礙的元素，同時用上標準 HTML 屬性 `role` 與 ARIA 屬性。ARIA 屬性 `aria-valuenow` 會繫結到使用者的輸入。

   <code-example path="accessibility/src/app/progress-bar.component.ts" header="src/app/progress-bar.component.ts" region="progressbar-component"></code-example>


* 在範本中，`aria-label` 屬性確保螢幕閱讀器能存取這個控制項。

   <code-example path="accessibility/src/app/app.component.html" header="src/app/app.component.html" region="template"></code-example>


## 路由與焦點管理

在 UI 中追蹤並控制[焦點](https://developers.google.com/web/fundamentals/accessibility/focus/)，是無障礙設計的重要考量。使用 Angular 路由時，你應該決定頁面導航後焦點要移到哪裡。

為了避免只仰賴視覺提示，你需要確保路由程式碼在頁面導航後會更新焦點。你可以用 `Router` 服務的 `NavigationEnd` 事件，掌握更新焦點的時機。

下面的範例示範導航後如何在 DOM 中找到主要內容的標題並把焦點移到它上面。

```ts

router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
  const mainHeader = document.querySelector('#main-content-header')
  if (mainHeader) {
    mainHeader.focus();
  }
});

```
在真實應用程式中，接收焦點的元素取決於你應用程式的具體結構與版面配置。取得焦點的元素，應該讓使用者能立刻進入剛被路由帶進畫面的主要內容。你應該避免路由切換後焦點回到 `body` 元素的情況。


## 其他資源

* [Accessibility - Google Web Fundamentals](https://developers.google.com/web/fundamentals/accessibility)

* [ARIA specification and authoring practices](https://www.w3.org/TR/wai-aria/)

* [Material Design - Accessibility](https://material.io/design/usability/accessibility.html)

* [Smashing Magazine](https://www.smashingmagazine.com/search/?q=accessibility)

* [Inclusive Components](https://inclusive-components.design/)

* [Accessibility Resources and Code Examples](https://dequeuniversity.com/resources/)

* [W3C - Web Accessibility Initiative](https://www.w3.org/WAI/people-use-web/)

* [Rob Dodson A11ycasts](https://www.youtube.com/watch?v=HtTyRajRuyY)

* [Codelyzer](http://codelyzer.com/rules/) 提供 lint 規則，能協助你確保程式碼符合無障礙標準。

書籍

* "A Web for Everyone: Designing Accessible User Experiences", Sarah Horton and Whitney Quesenbery

* "Inclusive Design Patterns", Heydon Pickering

## 更多無障礙相關資訊

你可能也對以下內容有興趣：
* [Audit your Angular app's accessibility with codelyzer](https://web.dev/accessible-angular-with-codelyzer/).
