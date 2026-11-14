# 應用程式殼層

## 安裝 Angular CLI

 如果你還沒安裝 [Angular CLI](https://github.com/angular/angular-cli)，請先安裝。

<code-example language="sh" class="code-shell">
  npm install -g @angular/cli
</code-example>  

## 建立新的應用程式

使用這道 CLI 指令，建立一個名為 `angular-tour-of-heroes` 的新專案。

<code-example language="sh" class="code-shell">
  ng new angular-tour-of-heroes
</code-example> 

Angular CLI 產生了一個包含預設應用程式與支援檔案的新專案。


<div class="alert is-helpful">



你可以使用 `ng add` 指令，把預先封裝好的功能加入新專案。`ng add` 指令會套用指定套件中的原理圖，來轉換專案。
如需詳細資訊，請參閱 [Angular CLI 文件。](https://github.com/angular/angular-cli/wiki/add "Angular CLI documentation")

Angular Material 為典型的應用程式版面配置提供了原理圖。
詳情請參閱 [Angular Material 文件](https://material.angular.io/guides "Angular Material documentation")。

</div>


## 提供應用程式服務

前往專案目錄並啟動應用程式。

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

## 變更應用程式標題

在你慣用的編輯器或 IDE 中開啟專案，並前往 `src/app` 資料夾。

你會發現殼層 `AppComponent` 的實作分散在三個檔案中：

1. `app.component.ts`&mdash; 以 TypeScript 撰寫的元件類別程式碼。
1. `app.component.html`&mdash; 以 HTML 撰寫的元件範本。
1. `app.component.css`&mdash; 這個元件專用的 CSS 樣式。


開啟元件類別檔案（`app.component.ts`），把 `title` 屬性的值改為 'Tour of Heroes'。

<code-example path="toh-pt0/src/app/app.component.ts" region="set-title" title="app.component.ts (class title property)" linenums="false">
</code-example>

開啟元件範本檔案（`app.component.html`），
刪除 Angular CLI 產生的預設範本。
以下列這行 HTML 取代它。

<code-example path="toh-pt0/src/app/app.component.html" 
  title="app.component.html (template)" linenums="false">
</code-example>

雙大括號是 Angular 的*插值繫結*語法。
這個插值繫結會把元件的 `title` 屬性值
呈現在 HTML 標頭標籤內。

瀏覽器會重新整理並顯示新的應用程式標題。

{@a app-wide-styles}

## 加入應用程式樣式

大多數應用程式都希望在整個應用程式中維持一致的外觀。
CLI 為此產生了一個空的 `styles.css`。
請把應用程式範圍的樣式放在那裡。

以下是 _Tour of Heroes_ 範例應用程式的 `styles.css` 節錄。

<code-example path="toh-pt0/src/styles.1.css" title="src/styles.css (excerpt)">
</code-example>

## 最終程式碼檢閱

本教學的原始碼與完整的 _Tour of Heroes_ 全域樣式
可以在 <live-example></live-example> 取得。

以下是本頁討論過的程式碼檔案。

<code-tabs>

  <code-pane title="src/app/app.component.ts" path="toh-pt0/src/app/app.component.ts">
  </code-pane>

  <code-pane title="src/app/app.component.html" path="toh-pt0/src/app/app.component.html">
  </code-pane>

  <code-pane 
    title="src/styles.css (excerpt)" 
    path="toh-pt0/src/styles.1.css">
  </code-pane>
</code-tabs>

## 摘要

* 你使用 Angular CLI 建立了初始應用程式結構。
* 你學到 Angular 元件會顯示資料。
* 你使用插值的雙大括號來顯示應用程式標題。
