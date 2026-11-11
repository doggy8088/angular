# 範本中的空白

依預設，Angular 範本不會保留框架認為不必要的空白。這通常發生在兩種情境：元素之間的空白，以及文字內可折疊的空白。

## 元素之間的空白

大多數開發者喜歡用換行與縮排來格式化範本，讓範本更容易閱讀：

```angular-html
<section>
  <h3>User profile</p>
  <label>
    User name
    <input>
  </label>
</section>
```

這個範本在所有元素之間都包含空白。以下程式碼片段顯示了相同的 HTML，但將每個空白字元換成井字字元（`#`），以突顯空白的數量：

```angular-html
<!-- Total Whitespace: 20 -->
<section>###<h3>User profile</p>###<label>#####User name#####<input>###</label>#</section>
```

若按範本所寫保留空白，會產生許多不必要的[文字節點](https://developer.mozilla.org/en-US/docs/Web/API/Text)，並增加頁面渲染的額外負擔。忽略元素之間的這些空白之後，Angular 在頁面上渲染範本時需要做的工作更少，整體效能也更好。

## 文字內可折疊的空白

當你的網頁瀏覽器在頁面上渲染 HTML 時，會將多個連續的空白字元折疊為單一字元：

```angular-html
<!-- What it looks like in the template -->
<p>Hello         world</p>
```

在這個範例中，瀏覽器在 "Hello" 與 "world" 之間只顯示單一空格。

```angular-html
<!-- What shows up in the browser -->
<p>Hello world</p>
```

若要了解其運作方式的更多背景資訊，請參閱 [HTML、CSS 與 DOM 如何處理空白](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace)。

Angular 在編譯範本時，會先將這些不必要的空白字元折疊為單一字元，避免一開始就把它們送到瀏覽器。

## 保留空白

你可以為範本在 `@Component` 裝飾器中指定 `preserveWhitespaces: true`，告訴 Angular 保留範本中的空白。

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

除非絕對必要，請避免設定這個選項。保留空白會讓 Angular 在渲染時產生顯著更多的節點，使應用程式變慢。

你也可以額外使用一個 Angular 專屬的特殊 HTML 實體：`&ngsp;`。這個實體會產生一個單一空格字元，並在編譯輸出中保留。
