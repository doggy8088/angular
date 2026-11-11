# App shell 模式

[App shell 模式](https://developers.google.com/web/fundamentals/architecture/app-shell)是一種在建置時使用一條路由渲染應用程式一部分的方式。
它能快速啟動一個靜態渲染的頁面（所有頁面共用的骨架），同時瀏覽器在背景下載完整的用戶端版本，並在程式碼載入後自動切換過去，藉此改善使用者體驗。

這讓使用者能快速看到應用程式有意義的首次繪製，因為瀏覽器不需要初始化任何 JavaScript，就能渲染 HTML 與 CSS。

進一步了解請參閱 [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell)。

<docs-workflow>
<docs-step title="準備應用程式">
使用以下 Angular CLI 指令來完成：

<docs-code language="shell">

ng new my-app --routing

</docs-code>

對於既有應用程式，你必須手動在應用程式中加入 `Router` 並定義一個 `<router-outlet>`。
</docs-step>
<docs-step title="建立應用程式殼層">
使用 Angular CLI 自動建立應用程式殼層。

<docs-code language="shell">

ng generate app-shell

</docs-code>

想進一步了解這個指令，請參閱 [App shell 指令](cli/generate#app-shell-command)。

這個指令會更新應用程式程式碼，並在專案結構中加入額外的檔案。

<code-example language="text">

  src
  ├── app
  │   ├── app.config.server.ts               # server application configuration
  │   └── app-shell                          # app-shell component
  │       ├── app-shell.component.html
  │       ├── app-shell.component.scss
  │       ├── app-shell.component.spec.ts
  │       └── app-shell.component.ts
  └── main.server.ts                         # main server application bootstrapping

</code-example>

<docs-step title="確認應用程式已連同殼層內容一起建置">

<docs-code language="shell">

ng run my-app:app-shell:development

</docs-code>

或是使用生產環境設定。

<docs-code language="shell">

ng run my-app:app-shell:production

</docs-code>

若要驗證建置輸出，請開啟 <code class="no-auto-link">dist/my-app/browser/index.html</code>。
尋找預設文字 `app-shell works!`，確認 application shell 路由已渲染並包含在輸出中。
</docs-step>
</docs-workflow>
