# 組合元件

你已經學會更新元件範本、元件邏輯與元件樣式，但要如何在應用程式中使用元件呢？

元件設定的 `selector` 屬性提供了一個名稱，讓你在其他範本中參照該元件。你可以像使用 HTML 標籤一樣使用 `selector`，例如 `app-user` 在範本中就是 `<app-user />`。

NOTE: 在[核心概念指南](/essentials/components#using-components)中進一步了解如何使用元件。

在這個練習中，你將學習如何組合元件。

<hr/>

在本範例中，有兩個元件：`User` 和 `App`。

<docs-workflow>

<docs-step title="加上對 `User` 的參照">
更新 `App` 範本，加入對 `User` 的參照，它使用的 selector 是 `app-user`。別忘了把 `User` 加到 `App` 的 imports 陣列中，這樣它才能在 `App` 範本中使用。

```angular-html
template: `<app-user />`, imports: [User]
```

元件現在會顯示訊息 `Username: youngTech`。你可以更新範本程式碼，加入更多標記。
</docs-step>

<docs-step title="加上更多標記">
由於你在範本中可以使用任何想要的 HTML 標記，不妨試著更新 `App` 的範本，加入更多 HTML 元素。本範例會把 `<section>` 元素加為 `<app-user>` 元素的父元素。

```angular-html
template: `
<section><app-user /></section>
`,
```

</docs-step>

</docs-workflow>
你可以使用任意多的 HTML 標記與元件，把你的應用程式構想化為現實。你甚至可以在同一個頁面上放多份相同的元件。

這正好帶出下一個問題：要如何依資料決定是否顯示某個元件呢？前往下一節找答案。
