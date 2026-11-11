# Defer 觸發條件

`@defer` 的預設選項已經為元件的局部延遲載入提供了很好的做法，但你可能還是想進一步自訂延遲載入的體驗。

在預設情況下，延遲內容會在瀏覽器閒置時載入。不過，你可以透過指定**觸發條件**（trigger）來自訂載入時機，挑選最適合你元件的載入行為。

可延遲檢視提供兩種類型的載入觸發條件：

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>on</code></td>
      <td>
        使用內建觸發條件清單中某個條件的觸發方式。<br/>
        例如：<code>@defer (on viewport)</code>
      </td>
    </tr>
    <tr>
      <td><code>when</code></td>
      <td>
        以運算式表示的條件，會判斷其真假值。當運算式為真值時，placeholder 會被換成延遲載入的內容。<br/>
        例如：<code>@defer (when customizedCondition)</code>
      </td>
    </tr>
  </table>
</div>

如果 `when` 條件的判斷結果為 `false`，`defer` 區塊也不會切換回 placeholder。這個切換是一次性的操作。

你可以一次定義多個事件觸發條件，這些條件會以 OR 邏輯來判斷。

* 例：`@defer (on viewport; on timer(2s))`
* 例：`@defer (on viewport; when customizedCondition)`

在這個練習中，你將學會如何使用觸發條件來指定載入可延遲檢視的時機。

<hr>

<docs-workflow>

<docs-step title="加入 `on hover` 觸發條件">
在 `app.component.ts` 中，為 `@defer` 區塊加入 `on hover` 觸發條件。

<docs-code language="angular-html" hightlight="[1]">
@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

現在，頁面要等你將滑鼠移到 placeholder 上方時，才會渲染留言區。
</docs-step>

<docs-step title="加入「Show all comments」按鈕">
接著，更新範本，加入一個標籤為「Show all comments」的按鈕，並為按鈕加上名為 `#showComments` 的範本變數。

<docs-code language="angular-html" hightlight="[1]">
<button type="button" #showComments>Show all comments</button>

@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

NOTE: 如需範本變數的更多資訊，請參閱[文件](https://angular.dev/guide/templates/reference-variables#)。

</docs-step>

<docs-step title="加入 `on interaction` 觸發條件">
更新範本中的 `@defer` 區塊，改用 `on interaction` 觸發條件，並將 `showComments` 範本變數作為參數傳給 `interaction`。

<docs-code language="angular-html" hightlight="[3]">
<button type="button" #showComments>Show all comments</button>

@defer (on hover; on interaction(showComments)) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

有了這些變更，頁面會等到下列任一條件成立時，才渲染留言區：
* 使用者將滑鼠移到留言區的 placeholder 上方
* 使用者點選「Show all comments」按鈕

你可以重新載入頁面，試試不同的觸發條件如何渲染留言區。
</docs-step>
</docs-workflow>

想了解更多，請參閱[可延遲檢視](https://angular.dev/guide/defer)文件。
繼續學習，發掘 Angular 更多強大的功能。
