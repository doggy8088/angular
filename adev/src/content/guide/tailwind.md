# 在 Angular 中使用 Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) 是一個以工具類別為優先的 CSS 框架，讓你不必離開 HTML 就能打造現代網站。本指南將帶你逐步在 Angular 專案中完成 Tailwind CSS 的設定。

## 使用 `ng add` 自動設定

Angular CLI 提供以 `ng add` 指令將 Tailwind CSS 整合進專案的簡便方式。這個指令會自動安裝所需的套件、設定 Tailwind CSS，並更新專案的建置設定。

首先，在終端機中切換到 Angular 專案的根目錄，執行下列指令：

```shell
ng add tailwindcss
```

這個指令會執行下列動作：

- 安裝 `tailwindcss` 及其對等相依套件。
- 設定專案使用 Tailwind CSS。
- 將 Tailwind CSS 的 `@import` 陳述式加入你的樣式檔。

執行 `ng add tailwindcss` 之後，你就能立即在元件範本中使用 Tailwind 的工具類別。

## 手動設定（替代方式）

如果你偏好手動設定 Tailwind CSS，請依照下列步驟進行：

### 1. 建立 Angular 專案

首先，如果你還沒有建立 Angular 專案，先建立一個新專案。

```shell
ng new my-project
cd my-project
```

### 2. 安裝 Tailwind CSS

接著，在 Angular 專案根目錄開啟終端機，執行下列指令，安裝 Tailwind CSS 及其對等相依套件：

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
</docs-code-multifile>

### 3. 設定 PostCSS 外掛

接著，在專案的檔案根目錄新增 `.postcssrc.json` 檔案。
將 `@tailwindcss/postcss` 外掛加入你的 PostCSS 設定中。

```json {header: '.postcssrc.json'}
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 4. 匯入 Tailwind CSS

在 `./src/styles.css` 中加入一個匯入 Tailwind CSS 的 `@import`。

```css {header: "src/styles.css"}
@import 'tailwindcss';
```

如果你使用 SCSS，請在 `./src/styles.scss` 中加入 `@use`。

```scss {header: "src/styles.scss"}
@use 'tailwindcss';
```

### 5. 開始在專案中使用 Tailwind

現在你可以在元件範本中使用 Tailwind 的工具類別來為應用程式加上樣式。以 `ng serve` 執行建置流程，你應該會看到加上樣式後的標題。

例如，你可以將下列內容加入你的 `app.html` 檔案：

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

## 其他資源

- [Tailwind CSS 文件](https://tailwindcss.com/docs)
