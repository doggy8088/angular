# 什麼是可延遲檢視？

一個完整渲染的 Angular 頁面可能包含許多不同的元件、指令與管道。頁面中有些部分應該立即顯示給使用者，但也有些部分可以晚一點再顯示。
Angular 的可延遲檢視使用 `@defer` 語法，能告訴 Angular 先不要下載那些不必馬上顯示的頁面部分所需的 JavaScript，藉此加快應用程式的速度。

在這個練習中，你將學會如何使用可延遲檢視，延遲載入元件範本中的一個區段。

<hr>

<docs-workflow>

<docs-step title="將 `@defer` 區塊加入範本的一個區段">
在 `app.component.ts` 中，用 `@defer` 區塊包住 `article-comments` 元件，延遲載入它。

<docs-code language="angular-html">
@defer {
  <article-comments />
}
</docs-code>

在預設情況下，`@defer` 會在瀏覽器閒置時載入 `article-comments` 元件。

在瀏覽器的開發者控制台中，你可以看到 `article-comments-component` 這個延遲載入區塊檔案是分開載入的（實際檔案名稱可能每次執行都不同）：

<docs-code language="markdown">
Initial chunk files | Names                      |  Raw size
chunk-NNSQHFIE.js   | -                          | 769.00 kB | 
main.js             | main                       | 229.25 kB | 

Lazy chunk files    | Names                      |  Raw size
chunk-T5UYXUSI.js   | article-comments-component |   1.84 kB |
</docs-code>

</docs-step>
</docs-workflow>


做得很好！你已經學會可延遲檢視的基礎了。
