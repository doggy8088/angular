# 組合元件

您已學會更新元件範本、元件邏輯和元件樣式，但您如何在您的應用程式中使用元件？

元件設定的 `selector` 屬性提供您一個名稱，可在其他範本中參照元件時使用。您使用 `selector` 就像 HTML 標籤一樣，例如 `app-user` 在範本中會是 `<app-user />`

在這個活動中，你將學習如何撰寫元件。

<hr/>

在這個範例中，有兩個元件 `UserComponent` 和 `AppComponent`。

<docs-workflow>

<docs-step title="新增 `UserComponent` 的參照">
更新 `AppComponent` 範本以包含使用選擇器 `app-user` 的 `UserComponent` 的參照。務必將 `UserComponent` 新增至 `AppComponent` 的匯入陣列，這會讓它可在 `AppComponent` 範本中使用。

```ts
template: `<app-user />`,
imports: [UserComponent]
```

現在元件顯示訊息 `Username: youngTech`。您可以更新範本程式碼以加入更多標記。
</docs-step>

<docs-step title="新增更多標記">
因為您可以在範本中使用任何想要的 HTML 標記，請嘗試更新 `AppComponent` 的範本，以包含更多 HTML 元素。此範例會新增 `<section>` 元素做為 `<app-user>` 元素的父元素。

```ts
template: `<section><app-user /></section>`,
```

</docs-step>

</docs-workflow>
您可以使用任意數量的 HTML 標記和任意數量的元件，來實現您的應用程式構想。您甚至可以在同一頁面上擁有您的元件的複數副本。

這是一個很好的過場，您將如何根據數據有條件地顯示元件？前往下一節以找出答案。

