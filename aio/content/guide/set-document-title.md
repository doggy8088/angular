{@a top}

# 設定文件標題

你的應用程式應該能讓瀏覽器標題列顯示任何你想顯示的內容。
本食譜說明如何做到這一點。

請參閱 <live-example name="set-document-title"></live-example>。

## *&lt;title&gt;* 的問題

最明顯的方法是將元件的屬性繫結到 HTML `<title>`，像這樣：

<code-example format=''>
  &lt;title&gt;{{This_Does_Not_Work}}&lt;/title&gt;
</code-example>

很抱歉，但那行不通。
應用程式的根元件是包含在 `<body>` 標籤內的一個元素。
HTML `<title>` 位於文件的 `<head>` 中，在 body 之外，因此 Angular 資料繫結無法存取它。

你可以取得瀏覽器的 `document` 物件並手動設定標題。
那樣做不乾淨，也會降低你的應用程式將來在瀏覽器之外執行的機會。

<div class="alert is-helpful">

  在瀏覽器之外執行你的應用程式，意味著你可以利用伺服器端預渲染，獲得近乎即時的應用程式首次渲染時間，並有利於 SEO。它意味著你可以從
  Web Worker 內部執行，透過使用多個執行緒來提高應用程式的回應能力。它也
  意味著你可以在 Electron.js 或 Windows Universal 內執行你的應用程式，將它交付到桌面環境。

</div>

## 使用 `Title` 服務

值得慶幸的是，Angular 透過提供 `Title` 服務作為*瀏覽器平台*的一部分，彌補了這個差距。
[Title](api/platform-browser/Title) 服務是一個簡單的類別，提供用於取得和設定目前 HTML 文件標題的 API：

* `getTitle() : string`&mdash;取得目前 HTML 文件的標題。
* `setTitle( newTitle : string )`&mdash;設定目前 HTML 文件的標題。

你可以將 `Title` 服務注入根 `AppComponent`，並公開一個可繫結的 `setTitle` 方法來呼叫它：


<code-example path="set-document-title/src/app/app.component.ts" region="class" header="src/app/app.component.ts (class)" linenums="false"></code-example>

將該方法繫結到三個錨點標籤，大功告成！

<figure>
  <img src="generated/images/guide/set-document-title/set-title-anim.gif" alt="設定標題">
</figure>

以下是完整的解決方案：

<code-tabs>
  <code-pane header="src/main.ts" path="set-document-title/src/main.ts"></code-pane>
  <code-pane header="src/app/app.module.ts" path="set-document-title/src/app/app.module.ts"></code-pane>
  <code-pane header="src/app/app.component.ts" path="set-document-title/src/app/app.component.ts"></code-pane>
</code-tabs>

## 為什麼要在 `bootstrap` 中提供 `Title` 服務

一般來說，你會想在根應用程式元件 `AppComponent` 中提供應用程式範圍的服務。

本食譜建議在啟動（bootstrap）期間註冊標題服務，
這個位置是你保留用來設定執行時期 Angular 環境的。

你做的正是如此。
`Title` 服務是 Angular *瀏覽器平台*的一部分。
如果你將應用程式啟動到不同的平台，
你就必須提供一個不同的 `Title` 服務，讓它能理解
該特定平台的「文件標題」概念。
理想情況下，應用程式本身既不需要知道、也不需要關心執行環境。

