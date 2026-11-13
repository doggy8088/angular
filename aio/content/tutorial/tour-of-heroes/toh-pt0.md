# 建立新專案

使用 `ng new` 指令開始建立你的 **Tour of Heroes** 應用程式。

本教學將會：

1.  設定你的環境。
2.  建立新的工作區與初始應用程式專案。
3.  提供應用程式服務。
4.  修改新的應用程式。

<div class="alert is-helpful">

要查看這個應用程式的程式碼，請參閱 <live-example></live-example>。

</div>

## 設定你的環境

要設定你的開發環境，請依照[本機環境設定](guide/setup-local "Setting up for Local Development")中的說明操作。

## 建立工作區與初始應用程式

你是在 Angular [工作區](guide/glossary#工作區workspace)的脈絡下開發應用程式。
一個*工作區*包含一個或多個[專案](guide/glossary#專案project)的檔案。
一個*專案*是由構成應用程式或程式庫的檔案所組成的集合。

要建立新的工作區與初始專案：

1.  確認你目前不在 Angular 工作區目錄中。
    例如，如果你正在先前練習的入門工作區中，請切換到它的父目錄。

2.  如以下所示，執行 `ng new`，後面接上應用程式名稱：

    <code-example format="shell" language="shell">

    ng new angular-tour-of-heroes

    </code-example>

3.  `ng new` 會提示你提供初始專案要包含哪些功能的資訊。
    按下 Enter 或 Return 鍵，接受預設值即可。

`ng new` 會安裝 Angular 所需的 `npm` 套件與其他相依性。
這可能需要幾分鐘。

`ng new` 也會建立以下工作區與入門專案檔案：

*   一個新的工作區，根目錄名為 `angular-tour-of-heroes`
*   位於 `src/app` 子目錄中的初始骨架應用程式專案
*   相關的設定檔

初始應用程式專案包含一個可直接執行的簡單應用程式。

## 提供應用程式服務

前往工作區目錄並啟動應用程式。

<code-example format="shell" language="shell">

cd angular-tour-of-heroes
ng serve --open

</code-example>

<div class="alert is-helpful">

`ng serve` 指令會：

* 建置應用程式
* 啟動開發伺服器
* 監看原始碼檔案
* 在你修改時重新建置應用程式

`--open` 旗標會開啟瀏覽器，前往 `http://localhost:4200`。

</div>

你應該會在瀏覽器中看到應用程式正在執行。

## Angular 元件

你看到的頁面是*應用程式殼層*。
這個殼層由名為 `AppComponent` 的 Angular **元件**控制。

*元件*是 Angular 應用程式的基本建構單位。
它們會在畫面上顯示資料、聆聽使用者輸入，並根據輸入採取行動。

## 修改應用程式

在你慣用的編輯器或 IDE 中開啟專案。前往 `src/app` 目錄來編輯入門應用程式。
在 IDE 中找到以下檔案，它們組成你剛建立的 `AppComponent`：

| 檔案                | 說明 |
|:---                  |:---     |
| `app.component.ts`   | 以 TypeScript 撰寫的元件類別程式碼。 |
| `app.component.html` | 以 HTML 撰寫的元件範本。         |
| `app.component.css`  | 這個元件專用的 CSS 樣式。              |

<div class="alert is-important">

當你執行 `ng new` 時，Angular 會為你的新應用程式建立測試規格。
很不幸地，進行這些修改會破壞你剛建立的規格。

這不會造成問題，因為 Angular 測試不在本教學的範圍內，也不會用到。

要進一步了解 Angular 測試，請參閱[測試](guide/testing)。

</div>

### 變更應用程式標題

開啟 `app.component.ts`，把 `title` 屬性的值改為 'Tour of Heroes'。

<code-example header="app.component.ts (class title property)" path="toh-pt0/src/app/app.component.ts" region="set-title"></code-example>

開啟 `app.component.html`，刪除 `ng new` 建立的預設範本。
以下列這行 HTML 取代它。

<code-example header="app.component.html (template)" path="toh-pt0/src/app/app.component.html"></code-example>

雙大括號是 Angular 的*插值繫結*語法。
這個插值繫結會把元件的 `title` 屬性值呈現在 HTML 標頭標籤內。

瀏覽器會重新整理並顯示新的應用程式標題。

<a id="app-wide-styles"></a>

### 加入應用程式樣式

大多數應用程式都希望在整個應用程式中維持一致的外觀。
`ng new` 為此建立了一個空的 `styles.css`。
請把應用程式範圍的樣式放在那裡。

開啟 `src/styles.css`，把以下程式碼加入檔案中。

<code-example header="src/styles.css (excerpt)" path="toh-pt0/src/styles.1.css"></code-example>

## 最終程式碼檢閱

以下是本頁討論過的程式碼檔案。

<code-tabs>
    <code-pane header="src/app/app.component.ts" path="toh-pt0/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.html" path="toh-pt0/src/app/app.component.html"></code-pane>
    <code-pane header="src/styles.css (excerpt)" path="toh-pt0/src/styles.1.css"></code-pane>
</code-tabs>

## 摘要

*   你使用 `ng new` 建立了初始應用程式結構。
*   你學到 Angular 元件會顯示資料
*   你使用插值的雙大括號來顯示應用程式標題

@reviewed 2022-02-28
