# 在 Angular 中使用 Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一個以工具類別為優先的 CSS 框架，讓你不必離開 HTML 就能打造現代網站。本指南將帶你逐步在 Angular 專案中完成 Tailwind CSS 的設定。

## 設定 Tailwind CSS

### 1. 建立 Angular 專案

首先，如果你還沒有建立 Angular 專案，先建立一個新專案。

<docs-code language="shell">
ng new my-project
cd my-project
</docs-code>

### 2. 安裝 Tailwind CSS

接著，在 Angular 專案根目錄開啟終端機，執行下列指令，安裝 Tailwind CSS 及其對等相依套件：

<docs-code language="shell">
npm install tailwindcss @tailwindcss/postcss postcss
</docs-code>

### 3. 設定 PostCSS 外掛

接著，在專案的檔案根目錄新增 `.postcssrc.json` 檔案。
將 `@tailwindcss/postcss` 外掛加入你的 PostCSS 設定中。

<docs-code language="json" header=".postcssrc.json">
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
</docs-code>

### 4. 匯入 Tailwind CSS

在 `./src/styles.css` 中加入一個匯入 Tailwind CSS 的 `@import`。

<docs-code language="css" header="src/styles.css">
@import "tailwindcss";
</docs-code>

如果你使用 SCSS，請在 `./src/styles.scss` 中加入 `@use`。

<docs-code language="scss" header="src/styles.scss">
@use "tailwindcss";
</docs-code>

### 5. 開始在專案中使用 Tailwind

現在你可以在元件範本中使用 Tailwind 的工具類別來為應用程式加上樣式。

例如，你可以將下列內容加入你的 `app.html` 檔案：

<docs-code language="html">
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
</docs-code>

### 6. 開始在專案中使用 Tailwind

以 `ng serve` 執行建置流程，你應該會看到加上樣式後的標題。

## 其他資源

- [Tailwind CSS 文件](https://tailwindcss.com/docs)
