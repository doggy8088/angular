# 可延遲檢視

有時在應用程式開發中，您會遇到很多元件需要在應用程式中參照，但其中一些基於各種原因不必立即載入。

可能它們在可見摺疊下方或是一些直到之後才會與之互動的繁重元件。在這種情況下，我們可以利用延遲檢視稍後載入一些資源。

在這個活動中，您將學習如何使用可延遲檢視來延遲載入元件範本的區段。

<hr>

<docs-workflow>

<docs-step title="在評論元件周圍新增 `@defer` 區塊">

在您的 app 中，部落格文章頁面在文章詳細資料後有一個評論元件。

將註解元件用 `@defer` 區塊包覆起來延遲載入。

```html
@defer {
  <comments />
}
```

上面的程式碼是使用基本 `@defer` 區塊的一個範例。預設 `@defer` 會在瀏覽器閒置時載入 `comments` 元件。

</docs-step>

<docs-step title="添加預留位置">

在 `@defer` 區塊中新增 `@placeholder` 區塊。`@placeholder` 區塊是您放置在延遲載入開始之前要顯示的 HTML 的地方。`@placeholder` 區塊中的內容會立即載入。

<docs-code language="html" highlight="[3,4,5]">
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
}
</docs-code>

</docs-step>

<docs-step title="加入載入區塊">

在 `@defer` 區塊中新增一個 `@loading` 區塊。`@loading` 區塊是您放進 _while_ 遞延內容正在積極擷取，但尚未完成的 html 的位置。`@loading` 區塊中的內容是立即載入的。

<docs-code language="html" highlight="[5,6,7]">
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading {
  <p>Loading comments...</p>
}
</docs-code>

</docs-step>

<docs-step title="加入最低持續時間">

`@placeholder` 和 `@loading` 區段都有選用參數，可在快速載入時避免閃爍。`@placeholder` 有 `minimum`，而 `@loading` 有 `minimum` 和 `after`。將 `minimum` 持續時間新增至 `@loading` 區塊，如此一來它至少會呈現 2 秒。

<docs-code language="html" highlight="[5]">
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading (minimum 2s) {
  <p>Loading comments...</p>
}
</docs-code>

</docs-step>

<docs-step title="加入 viewport 觸發器">

可延遲檢視有許多觸發選項。加入視窗觸發，以便內容在進入視窗後延遲載入。

<docs-code language="html" highlight="[1]">
@defer (on viewport) {
  <comments />
}
</docs-code>

</docs-step>

<docs-step title="加入內容">

視窗觸發器最適合用於延遲載入遠在頁面下方需要捲動才能看到的內容。因此，讓我們在部落格文章中加入一些內容。您可以自行撰寫，或者複製以下內容並將其放入 `<article>` 元素中。

<docs-code language="html" highlight="[1]">
<article>
  <p>Angular is my favorite framework, and this is why. Angular has the coolest deferrable view feature that makes defer loading content the easiest and most ergonomic it could possibly be. The Angular community is also filled with amazing contributors and experts that create excellent content. The community is welcoming and friendly, and it really is the best community out there.</p>
  <p>I can't express enough how much I enjoy working with Angular. It offers the best developer experience I've ever had. I love that the Angular team puts their developers first and takes care to make us very happy. They genuinely want Angular to be the best framework it can be, and they're doing such an amazing job at it, too. This statement comes from my heart and is not at all copied and pasted. In fact, I think I'll say these exact same things again a few times.</p>
  <p>Angular is my favorite framework, and this is why. Angular has the coolest deferrable view feature that makes defer loading content the easiest and most ergonomic it could possibly be. The Angular community is also filled with amazing contributors and experts that create excellent content. The community is welcoming and friendly, and it really is the best community out there.</p>
  <p>I can't express enough how much I enjoy working with Angular. It offers the best developer experience I've ever had. I love that the Angular team puts their developers first and takes care to make us very happy. They genuinely want Angular to be the best framework it can be, and they're doing such an amazing job at it, too. This statement comes from my heart and is not at all copied and pasted. In fact, I think I'll say these exact same things again a few times.</p>
  <p>Angular is my favorite framework, and this is why. Angular has the coolest deferrable view feature that makes defer loading content the easiest and most ergonomic it could possibly be. The Angular community is also filled with amazing contributors and experts that create excellent content. The community is welcoming and friendly, and it really is the best community out there.</p>
  <p>I can't express enough how much I enjoy working with Angular. It offers the best developer experience I've ever had. I love that the Angular team puts their developers first and takes care to make us very happy. They genuinely want Angular to be the best framework it can be, and they're doing such an amazing job at it, too. This statement comes from my heart and is not at all copied and pasted.</p>
</article>
</docs-code>

加入此程式碼後，現在向下捲動以查看您將其捲動至視圖後載入的遞延內容。

</docs-step>

</docs-workflow>

在活動中，您已學會如何在應用程式中使用可延遲檢視。做得好。 🙌

你還可以對它們做更多的事，例如不同的觸發器、預先擷取和 `@error` 區塊。

如果您想進一步了解，請查看 [可延遲檢視的說明文件](guide/defer)。

