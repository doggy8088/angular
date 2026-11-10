# 可延遲檢視

在應用程式開發中，你有時會累積很多需要在應用程式中參照的元件，但基於各種原因，其中一些並不需要立刻載入。

它們可能位於頁面折疊線下方，或是要到稍後才會被互動的重型元件。在這種情況下，我們可以使用可延遲檢視，稍後再載入其中一些資源。

NOTE: 在[深入指南](/guide/templates/defer)中進一步了解使用 @defer 的延遲載入。

在這個練習中，你將學習如何使用可延遲檢視，延遲載入元件範本中的一個區塊。

<hr>

<docs-workflow>

<docs-step title="在留言元件外加上 `@defer` 區塊">

在你的應用程式中，部落格文章頁面在文章詳細資訊之後有一個留言元件。

用 `@defer` 區塊包住留言元件，延遲載入它。

```angular-html
@defer {
  <comments />
}
```

上面的程式碼示範如何使用基本的 `@defer` 區塊。`@defer` 預設會在瀏覽器閒置時載入 `comments` 元件。

</docs-step>

<docs-step title="加上 `@placeholder`">

為 `@defer` 區塊加上 `@placeholder` 區塊。`@placeholder` 區塊用來放置在延遲載入開始之前要顯示的 HTML。`@placeholder` 區塊中的內容會被預先載入。

```angular-html {highlight:[3,4,5]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
}
```

</docs-step>

<docs-step title="加上 loading 區塊">

為 `@defer` 區塊加上 `@loading` 區塊。`@loading` 區塊用來放置在延遲內容正在擷取、尚未完成時要顯示的 HTML。`@loading` 區塊中的內容會被預先載入。

```angular-html {highlight:[5,6,7]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="加上最短持續時間">

`@placeholder` 和 `@loading` 區塊都有選擇性參數，可以避免載入太快時發生閃爍。`@placeholder` 有 `minimum`，`@loading` 有 `minimum` 和 `after`。為 `@loading` 區塊加上 `minimum` 持續時間，讓它至少渲染 2 秒。

```angular-html {highlight:[5]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading (minimum 2s) {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="加上 viewport 觸發條件">

可延遲檢視有多種觸發選項。加上 viewport 觸發條件，讓內容在進入 viewport 後延遲載入。

```angular-html {highlight:[1]}
@defer (on viewport) {
  <comments />
}
```

</docs-step>

<docs-step title="加上內容">

當你要延遲的內容位於頁面夠下方、需要捲動才能看到時，最適合使用 viewport 觸發條件。所以我們來為部落格文章加上一些內容。你可以自己寫，也可以用複製以下內容，放進 `<article>` 元素中。

```html {highlight:[1]}
<article>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted. In fact, I think I'll say these exact same things again a few times.
  </p>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted. In fact, I think I'll say these exact same things again a few times.
  </p>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted.
  </p>
</article>
```

加上這段程式碼後，現在向下捲動，看看延遲的內容在捲入 viewport 時載入。

</docs-step>

</docs-workflow>

在這個練習中，你學會了如何在應用程式中使用可延遲檢視。做得很好。🙌

你還可以用它們做更多事，例如不同的觸發條件、預先擷取，以及 `@error` 區塊。

如果你想了解更多，請查看[可延遲檢視文件](/guide/templates/defer)。
