# 應用程式殼層

你會先使用 Angular CLI 建立一個初始應用程式。在本教學的過程中，你將修改並擴充該入門應用程式，建立出 Tour of Heroes 應用程式。

在本教學的這個部分，你將進行下列事項：

1. 設定你的環境。
2. 建立新的工作區與初始應用程式專案。
3. 提供應用程式服務。
4. 修改應用程式。


## 設定你的環境

若要設定你的開發環境，請依照 [入門](guide/quickstart) 中的下列指示：

* [先決條件](guide/quickstart#prerequisites)
* [安裝 Angular CLI](guide/quickstart#install-cli)

<div class="alert is-helpful">

**注意：** 你不需要完成整個入門。完成入門的上述兩個章節後，你的環境就設定好了。繼續進行下方步驟，建立 Tour of Heroes 工作區與初始應用程式專案。
</div>


## 建立新的工作區與初始應用程式

你是在 Angular [工作區](guide/glossary#工作區（workspace）)的脈絡下開發應用程式。一個工作區包含一個或多個[專案](guide/glossary#專案（project）)的檔案。一個專案是由構成應用程式、程式庫或端到端（e2e）測試的檔案所組成的集合。在本教學中，你將建立一個新的工作區。

要建立新的工作區與初始應用程式專案：

  1. 確認你目前不在 Angular 工作區資料夾中。例如，如果你先前已建立 Getting Started 工作區，請切換到該資料夾的父目錄。
  2. 執行 CLI 指令 `ng new`，並提供名稱 `angular-tour-of-heroes`，如下所示：

  <code-example language="sh" class="code-shell">
     ng new angular-tour-of-heroes
  </code-example>

  3. `ng new` 指令會提示你提供初始應用程式專案要包含哪些功能的資訊。按下 Enter 或 Return 鍵，接受預設值即可。

Angular CLI 會安裝必要的 Angular `npm` 套件與其他相依性。這可能需要幾分鐘。

它也會建立以下工作區與入門專案檔案：

  * 一個新的工作區，根資料夾名為 `angular-tour-of-heroes`。
  * 一個初始骨架應用程式專案，又稱為 `angular-tour-of-heroes`（位於 `src` 子資料夾中）。
  * 一個端到端測試專案（位於 e2e 子資料夾中）。
  * 相關的設定檔。

初始應用程式專案包含一個可直接執行的簡單 Welcome 應用程式。

## 提供應用程式服務

前往工作區目錄並啟動應用程式。

<code-example language="sh" class="code-shell">
  cd angular-tour-of-heroes
  ng serve --open
</code-example>

<div class="alert is-helpful">

`ng serve` 指令會建置應用程式、啟動開發伺服器，
監看原始碼檔案，並在你修改這些檔案時重新建置應用程式。

`--open` 旗標會開啟瀏覽器，前往 `http://localhost:4200/`。

</div>

你應該會在瀏覽器中看到應用程式正在執行。

## Angular 元件

你看到的頁面是_應用程式殼層_。
這個殼層由名為 `AppComponent` 的 Angular **元件**控制。

_元件_是 Angular 應用程式的基本建構單位。
它們會在畫面上顯示資料、聆聽使用者輸入，並根據輸入採取行動。

## 修改應用程式

在你慣用的編輯器或 IDE 中開啟專案，並前往 `src/app` 資料夾，對入門應用程式做一些修改。

你會發現殼層 `AppComponent` 的實作分散在三個檔案中：

1. `app.component.ts`&mdash; 以 TypeScript 撰寫的元件類別程式碼。
1. `app.component.html`&mdash; 以 HTML 撰寫的元件範本。
1. `app.component.css`&mdash; 這個元件專用的 CSS 樣式。

### 變更應用程式標題

開啟元件類別檔案（`app.component.ts`），把 `title` 屬性的值改為 'Tour of Heroes'。

<code-example path="toh-pt0/src/app/app.component.ts" region="set-title" header="app.component.ts (class title property)" linenums="false">
</code-example>

開啟元件範本檔案（`app.component.html`），
刪除 Angular CLI 產生的預設範本。
以下列這行 HTML 取代它。

<code-example path="toh-pt0/src/app/app.component.html"
  header="app.component.html (template)" linenums="false">
</code-example>

雙大括號是 Angular 的*插值繫結*語法。
這個插值繫結會把元件的 `title` 屬性值
呈現在 HTML 標頭標籤內。

瀏覽器會重新整理並顯示新的應用程式標題。

{@a app-wide-styles}

### 加入應用程式樣式

大多數應用程式都希望在整個應用程式中維持一致的外觀。
CLI 為此產生了一個空的 `styles.css`。
請把應用程式範圍的樣式放在那裡。

開啟 `src/styles.css`，把以下程式碼加入檔案中。

<code-example path="toh-pt0/src/styles.1.css" header="src/styles.css (excerpt)">
</code-example>

## 最終程式碼檢閱

本教學的原始碼與完整的 _Tour of Heroes_ 全域樣式
可以在 <live-example></live-example> 取得。

以下是本頁討論過的程式碼檔案。

<code-tabs>

  <code-pane header="src/app/app.component.ts" path="toh-pt0/src/app/app.component.ts">
  </code-pane>

  <code-pane header="src/app/app.component.html" path="toh-pt0/src/app/app.component.html">
  </code-pane>

  <code-pane
    header="src/styles.css (excerpt)"
    path="toh-pt0/src/styles.1.css">
  </code-pane>
</code-tabs>

## 摘要

* 你使用 Angular CLI 建立了初始應用程式結構。
* 你學到 Angular 元件會顯示資料。
* 你使用插值的雙大括號來顯示應用程式標題。
