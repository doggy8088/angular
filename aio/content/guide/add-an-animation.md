# 加入動畫

動畫相關的主要 Angular 模組是 `@angular/animations` 與 `@angular/platform-browser`。
使用 Angular 框架建立新專案時，這些依賴會自動加入你的專案。

要開始把 Angular 動畫加到專案中，請連同標準 Angular 功能一起匯入動畫專用模組。

## 步驟 1：啟用動畫模組

匯入 `BrowserAnimationsModule`，它會把動畫功能帶進你的 Angular 根應用程式模組。

<code-example header="src/app/app.module.ts" path="animations/src/app/app.module.1.ts"></code-example>

<div class="alert is-helpful">

**NOTE**: <br />
使用 Angular 框架建立應用程式時，根應用程式模組 `app.module.ts` 會放在 `src/app` 資料夾中。如果你使用的是獨立元件，請查看 main.ts 或你的根應用程式元件。

</div>

## 步驟 2：將動畫函式匯入元件檔案

如果你打算在元件檔案中使用特定的動畫函式，請從 `@angular/animations` 匯入這些函式。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="imports"></code-example>

## 步驟 3：加入動畫詮釋資料屬性

在元件檔案中，於 `@Component()` 裝飾器內加入一個名為 `animations:` 的詮釋資料屬性。你把定義動畫的觸發器放在 `animations` 詮釋資料屬性中。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="decorator"></code-example>

@reviewed 2022-12-19
