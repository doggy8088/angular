# Angular 內嵌文件教學

- [教學檔案](#tutorial-files)
- [教學目錄結構](#tutorials-directory-structure)
- [保留的教學目錄](#reserved-tutorials-directories)

## Tutorial files {#tutorial-files}

教學內容由教學正文、原始碼與設定組成。

### 內容：`README.md`

教學正文必須放在教學目錄中的 `README.md` 檔案裡。

以 `learn-angular` 教學為例，請見：[`src/content/tutorials/learn-angular/intro/README.md`](/src/content/tutorials/learn-angular/intro/README.md)

### 設定：`config.json`

每個教學都由一份 `config.json` 定義，可以使用下列選項：

- `title`：定義顯示在教學導覽中的教學標題
- `nextTutorial`：下一個教學的路徑（僅用於 `intro/` 步驟）
- `src`：外部目錄的相對路徑，定義內嵌編輯器使用的教學原始碼
- `answerSrc`：外部目錄的相對路徑，定義內嵌編輯器使用的教學解答
- `openFiles`：要在編輯器中開啟的檔案陣列
- `type`：表示教學的呈現方式，以及該教學需要哪些元件
  - `cli`：類型為 `cli` 的教學只包含正文與一個可使用 Angular CLI 的互動式終端機
  - `editor`：用於完整的內嵌編輯器，包含程式碼編輯器、預覽、互動式終端機，以及顯示開發伺服器輸出結果的控制台
  - `local`：停用內嵌編輯器，只顯示正文
  - `editor-only`：特殊設定，用於教學遊樂場與首頁遊樂場，會停用正文、只顯示內嵌編輯器

### 原始碼

教學原始碼包含教學目錄中的所有檔案，但 `README.md` 與 `config.json` 除外。

教學原始碼的優先權高於 [`common`](#common) 專案檔案，因此如果某個檔案同時存在於 [`common`](#common) 與教學目錄中、且相對路徑相同，教學目錄中的檔案會覆蓋 [`common`](#common) 的檔案。

## Tutorials directory structure {#tutorials-directory-structure}

一個教學由簡介與若干步驟組成。簡介與每個步驟都有各自的正文、設定與原始碼。

以 `learn-angular` 教學為例：

### Introduction

[`src/content/tutorials/learn-angular/intro`](/src/content/tutorials/learn-angular/intro)

是教學的簡介，會對應到 `/tutorials/learn-angular` 路由。

### Steps

[`src/content/tutorials/learn-angular/steps`](/src/content/tutorials/learn-angular/steps) 是存放教學步驟的目錄。

以下是 `learn-angular` 教學的幾個範例：

- [`learn-angular/steps/1-components-in-angular`](/src/content/tutorials/learn-angular/steps/1-components-in-angular)：路由會是 `/tutorials/learn-angular/components-in-angular`
- [`learn-angular/steps/2-updating-the-component-class`](/src/content/tutorials/learn-angular/steps/2-updating-the-component-class)：路由會是 `/tutorials/learn-angular/updating-the-component-class`

每個步驟目錄都必須以數字開頭，接著是連字號，再接步驟的路徑名稱。

- 數字表示步驟順序，決定該教學中上一步與下一步是誰。
- 連字號是分隔符號 :)。
- 從目錄名稱取得的路徑名稱，定義了步驟的 URL。

## Reserved tutorials directories {#reserved-tutorials-directories}

### `common` {#common}

common 專案是一個完整的 Angular 專案，所有教學都會重複使用它。它包含所有相依套件（`package.json`、`package-lock.json`）、專案設定（`tsconfig.json`、`angular.json`），以及啟動應用程式的主要檔案（`index.html`、`main.ts`、`app.module.ts`）。

使用 common 專案的原因有很多：

- 避免教學之間重複存放相同檔案。
- 只需請求一次 common 專案檔案與相依套件，後續請求就能利用瀏覽器快取，藉此優化應用程式內的效能。
- 所有教學只需執行一次 `npm install`，因此在瀏覽不同教學與步驟時，能縮短教學變得可互動所需的時間。
- 為所有教學提供一致的環境。
- 讓每個教學能專注在所要教授的特定原始碼上，而不是專案設定。

請見 [`src/content/tutorials/common`](/src/content/tutorials/common)

### `playground`

playground 包含 `/playground` 教學遊樂場的原始碼，不應包含任何正文內容。

請見 [`src/content/tutorials/playground`](/src/content/tutorials/playground)

### `homepage`

homepage 包含首頁遊樂場的原始碼，不應包含任何正文內容。

請見 [`src/content/tutorials/homepage`](/src/content/tutorials/homepage)

## Update dependencies

要更新所有教學的相依套件，可以執行下列腳本：

```bash
rm ./adev/src/content/tutorials/homepage/package-lock.json  ./adev/src/content/tutorials/first-app/common/package-lock.json ./adev/src/content/tutorials/learn-angular/common/package-lock.json ./adev/src/content/tutorials/playground/common/package-lock.json ./adev/src/content/tutorials/deferrable-views/common/package-lock.json

npm i --package-lock-only --prefix ./adev/src/content/tutorials/homepage
npm i --package-lock-only --prefix ./adev/src/content/tutorials/first-app/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/learn-angular/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/playground/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/deferrable-views/common
```
