# Angular 內嵌文件教學

- [教學檔案](#tutorial-files)
- [教學目錄結構](#tutorials-directory-structure)
- [保留的教學目錄](#reserved-tutorials-directories)

## 教學檔案

教學內容由教學內容、源碼和組態組成。

### 內容：`README.md`

教學內容必須放在教學目錄中的 `README.md` 檔案中。

以 `learn-angular` 教學為例，請參閱：[ `src/content/tutorials/learn-angular/intro/README.md`](/src/content/tutorials/learn-angular/intro/README.md)

### 組態：`config.json`

每個教學課程都由一個 `config.json` 定義，它可以有以下選項：

- `title`: 定義教學課程導覽中使用的教學課程標題
- `nextTutorial`: 下一個教學課程的路徑（僅在 `intro/` 步驟中）
- `src`: 外部目錄的相對路徑，定義嵌入式編輯器中使用的教學課程原始碼
- `answerSrc`: 外部目錄的相對路徑，定義嵌入式編輯器中使用的教學課程解答
- `openFiles`: 要在編輯器中開啟的檔案陣列
- `type`: 類型表示教學課程的呈現方式以及該教學課程需要的元件
  - `cli`: 具備 `cli` 類型的教學課程將僅包含內容和與 Angular CLI 互動的終端機
  - `editor`: 用於完整的嵌入式編輯器，包含程式碼編輯器、預覽、互動式終端機，以及來自開發伺服器輸出的主控台
  - `local`: 停用嵌入式編輯器，僅顯示內容
  - `editor-only`: 教學課程遊樂場和首頁遊樂場使用的特殊設定，停用內容，僅顯示嵌入式編輯器

### 原始碼

教學程式碼包含教學目錄中的每個檔案，除了 `README.md` 和 `config.json`。

教學範例的原始碼優先於 [`common`](#common) 專案檔案，所以如果一個檔案同時存在於 [`common`](#common) 和教學範例目錄中，並且包含相同的相對路徑，則教學範例檔案將覆寫 [`common`](#common) 檔案。

## 教學目錄結構

教學由介紹和步驟組成。介紹和每個步驟都有自己的內容、配置和原始碼。

以 `learn-angular` 教學課程為例：

### 簡介

[`src/content/tutorials/learn-angular/intro`](/src/content/tutorials/learn-angular/intro)

這是教學課程的介紹，它將存在於 `/tutorials/learn-angular` 路線中。

### 步驟

[`src/content/tutorials/learn-angular/steps`](/src/content/tutorials/learn-angular/steps) 是包含教學步驟的目錄。

以下是 `learn-angular` 教學的一些範例：

- [`learn-angular/steps/1-components-in-angular`](/src/content/tutorials/learn-angular/steps/1-components-in-angular)：路徑將會是 `/tutorials/learn-angular/components-in-angular`
- [`learn-angular/steps/2-updating-the-component-class`](/src/content/tutorials/learn-angular/steps/2-updating-the-component-class)：路徑將會是 `/tutorials/learn-angular/updating-the-component-class`

每個步驟目錄必須以數字開頭，接著是連字號，然後是步驟路徑名稱。

- 數字表示步驟，定義哪些將是教學課程中的上一步和下一步。
- 連接字元是分隔符號 :)。
- 從目錄名稱取出的路徑名稱定義步驟 URL。

## 保留的教學目錄

### `common`

常見專案是一個完整的 Angular 專案，由所有教學課程重複使用。它包含所有
依賴項(`package.json`, `package-lock.json`)、專案設定(`tsconfig.json`, `angular.json`) 和引導應用程式的檔案(`index.html`, `main.ts`, `app.module.ts`)。

共通專案用於多種原因：

- 避免在教學課程中重複檔案。
- 透過只需一次請求常見專案檔案和依賴項來最佳化應用程式內效能，後續請求則可受益於瀏覽器快取。
- 所有教學課程都只要執行一次 `npm install`，因此在瀏覽不同教學課程和步驟時可減少與教學課程互動的時間。
- 為所有教學課程提供一致的環境。
- 讓每個教學課程都能專注於正在教授的特定原始碼，而不是專案設定。

請參閱 [`src/content/tutorials/common`](/src/content/tutorials/common)

### `playground`

遊樂場包含教學遊樂場在 `/playground` 的原始程式碼。它不應該包含任何內容。

請參閱 [`src/content/tutorials/playground`](/src/content/tutorials/playground)

### `homepage`

首頁包含首頁遊樂場的原始程式碼。它不應包含任何內容。

請參閱 [`src/content/tutorials/homepage`](/src/content/tutorials/homepage)
