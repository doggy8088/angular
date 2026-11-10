# @loading、@error 與 @placeholder 區塊

可延遲檢視讓你定義在不同載入狀態下要顯示的內容。

| Block          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@placeholder` | 在預設情況下，defer 區塊在被觸發之前不會渲染任何內容。`@placeholder` 是一個選用區塊，用來宣告在延遲內容載入之前要顯示的內容。載入完成後，Angular 會以延遲內容取代 placeholder。這個區塊雖然是選用的，但 Angular 團隊建議務必加上 placeholder。[在完整的可延遲檢視文件中了解更多](guide/templates/defer) |
| `@loading`     | 這個選用區塊讓你宣告在載入延遲相依內容期間要顯示的內容。                                                                                                                                                                                                                                                                                                                                      |
| `@error`       | 這個區塊讓你宣告在延遲載入失敗時要顯示的內容。                                                                                                                                                                                                                                                                                                                                                                  |

上述所有子區塊的內容都會預先載入。此外，有些功能必須要有 `@placeholder` 區塊才能使用。

在這個練習中，你將學會如何使用 `@loading`、`@error` 與 `@placeholder` 區塊來管理可延遲檢視的狀態。

<hr>

<docs-workflow>

<docs-step title="加入 `@placeholder` 區塊">
在 `app.ts` 中，為 `@defer` 區塊加入 `@placeholder` 區塊。

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="設定 `@placeholder` 區塊">
`@placeholder` 區塊接受一個選用參數，用來指定 placeholder 至少要顯示多久的 `minimum` 時間。這個 `minimum` 參數以毫秒（ms）或秒（s）為單位指定。它的用途是避免延遲相依內容抓取太快時，placeholder 內容一閃而過。

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="加入 `@loading` 區塊">
接著，為元件範本加入 `@loading` 區塊。

`@loading` 區塊接受兩個選用參數：

- `minimum`：這個區塊至少要顯示的時間
- `after`：載入開始後，要等多久才顯示載入範本

兩個參數都以毫秒（ms）或秒（s）為單位指定。

更新 `app.ts`，為 `@loading` 區塊加入 minimum 參數 `1s`，以及值為 500ms 的 after 參數。

```angular-html {highlight:[5,6,7]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
```

NOTE: 這個範例使用了兩個參數，以 ; 字元分隔。

</docs-step>

<docs-step title="加入 `@error` 區塊">
最後，為 `@defer` 區塊加入 `@error` 區塊。

```angular-html {highlight:[7,8,9]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

</docs-step>
</docs-workflow>

恭喜！到目前為止，你對可延遲檢視已經有不錯的理解了。繼續保持，下一步來學觸發條件。
