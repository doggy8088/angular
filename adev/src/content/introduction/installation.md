<docs-decorative-header title="安裝" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

透過線上入門範本快速上手 Angular，或在本機用終端機開始。

## 線上遊玩

如果你只想在瀏覽器裡玩玩 Angular，不想建立專案，可以使用我們的線上沙箱：

<docs-card-container>
  <docs-card title="" href="/playground" link="Open on Playground">
  玩 Angular 應用程式最快的方式，完全不需要任何設定。
  </docs-card>
</docs-card-container>

## 在本機建立新專案

如果你要開始一個新專案，通常會想建立本機專案，這樣才能使用 Git 之類的工具。

### 前置需求

- **Node.js**：[v18.19.1 或更新版本](/reference/versions)
- **文字編輯器**：我們推薦 [Visual Studio Code](https://code.visualstudio.com/)
- **終端機**：執行 Angular CLI 指令時需要

### 操作說明

以下指南會帶你一步步建立本機 Angular 專案。

#### 安裝 Angular CLI

開啟終端機（如果你使用 [Visual Studio Code](https://code.visualstudio.com/)，可以開啟[整合式終端機](https://code.visualstudio.com/docs/editor/integrated-terminal)），然後執行下列指令：

<docs-code language="shell">

npm install -g @angular/cli

</docs-code>

如果你在 Windows 或 Unix 上執行這個指令時遇到問題，請查看 [CLI 文件](/tools/cli/setup-local#install-the-angular-cli)了解更多資訊。

#### 建立新專案

在你的終端機中，執行 CLI 指令 `ng new`，並加上想要的專案名稱。在以下範例中，我們使用的範例專案名稱是 `my-first-angular-app`。

<docs-code language="shell">

ng new <project-name>

</docs-code>

畫面會呈現一些專案的設定選項讓你選擇。使用方向鍵與 Enter 鍵來瀏覽並選取你想要的選項。

如果你沒有特別偏好，只要按下 Enter 鍵採用預設選項，即可繼續進行設定。

在你選好設定選項、CLI 完成設定流程後，你應該會看到下列訊息：

```shell
✔ Packages installed successfully.
    Successfully initialized git.
```

到了這一步，你的專案已經可以在本機執行了！

#### 在本機執行你的新專案

在終端機中，切換到你的新 Angular 專案。

<docs-code language="shell">

cd my-first-angular-app

</docs-code>

此時你所有的相依套件都應該已安裝完成（你可以檢查專案中是否存在 `node_modules` 資料夾來確認），因此你可以執行下列指令來啟動專案：

<docs-code language="shell">

npm start

</docs-code>

如果一切順利，你應該會在終端機看到類似的確認訊息：

```shell
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

現在你可以前往 `Local` 顯示的路徑（例如 `http://localhost:4200`）查看你的應用程式。祝你寫程式愉快！🎉

## 下一步

現在你已經建立好 Angular 專案，可以在我們的[精華指南](/essentials)中進一步了解 Angular，或從深入指南裡挑選一個主題！
