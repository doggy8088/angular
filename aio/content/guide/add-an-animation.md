# 加入動畫

動畫相關的主要 Angular 模組是 `@angular/animations` 與 `@angular/platform-browser`。

要開始把 Angular 動畫加到專案中，請連同標準 Angular 功能一起匯入動畫專用模組。

## 步驟 1：啟用動畫模組

從 `@angular/platform-browser/animations` 匯入 `provideAnimations`，並將它加入 `bootstrapApplication` 函式呼叫的 providers 清單中。

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
  ]
});
```

對於以 `NgModule` 為基礎的應用程式，請匯入 `BrowserAnimationsModule`，它會把動畫功能帶進你的 Angular 根應用程式模組。

<code-example header="src/app/app.module.ts" path="animations/src/app/app.module.1.ts"></code-example>

## 步驟 2：將動畫函式匯入元件檔案

如果你打算在元件檔案中使用特定的動畫函式，請從 `@angular/animations` 匯入這些函式。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="imports"></code-example>

## 步驟 3：加入動畫詮釋資料屬性

在元件檔案中，於 `@Component()` 裝飾器內加入一個名為 `animations:` 的詮釋資料屬性。你把定義動畫的觸發器放在 `animations` 詮釋資料屬性中。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="decorator"></code-example>

@reviewed 2023-08-15
