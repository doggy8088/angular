# 第 5 課：為元件加入 input 參數

本教學課程示範如何建立元件的 `@Input()`，並用它將資料傳入元件進行自訂。

**預估時間**：約 10 分鐘

**起始程式碼**： <live-example name="first-app-lesson-04"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-05"></live-example>

## 你將學到什麼

你的應用程式的 `HousingLocationComponent` 範本有一個 `HousingLocation` 屬性，用來接收輸入。

## Input 概念預覽
[Input](api/core/Input)讓元件能共享資料。資料共享的方向是從父元件到子元件。

在這一課中，你會在 `@Input()` 元件中定義 `HousingLocationComponent` 屬性，讓你能自訂元件中顯示的資料。

如需進一步了解，請參閱[在子指令與父指令及元件之間共用資料](guide/inputs-outputs)指南。

## 步驟 1：匯入 Input 裝飾器
這個步驟會把 `Input` 裝飾器匯入類別中。

在程式碼編輯器中：
1.  前往 `src/app/housing-location/housing-location.component.ts`
1.  更新檔案的 import，加入 `Input` 與 `HousingLocation`：

    <code-example header="Import HousingLocationComponent and Input in src/app/housing-location/housing-location.component.ts" path="first-app-lesson-05/src/app/housing-location/housing-location.component.ts" region="add-imports"></code-example>

## 步驟 2：加入 Input 屬性
1.  在同一個檔案中，為 `housingLocation` 類別加入一個名為 `HousingLocation`、型別為 `HousingLocationComponent` 的屬性。在屬性名稱後面加上 `!`，並在前面加上 `@Input()` 裝飾器：

    <code-example header="Import HousingLocationComponent and Input in src/app/housing-location/housing-location.component.ts" path="first-app-lesson-05/src/app/housing-location/housing-location.component.ts" region="add-housing-location-property"></code-example>

你必須加上 `!`，因為輸入預期會有值被傳入。在這個情況下，沒有預設值。在我們的範例應用程式中，我們知道這個值會被傳入，這是刻意設計的。這個驚嘆號稱為非空斷言運算子，它告訴 TypeScript 編譯器，這個屬性的值不會是 null 或 undefined。

1.  1. 儲存你的變更，確認應用程式沒有任何錯誤。

1.  繼續下一步之前，請先修正任何錯誤。

## 課程回顧

Summary: 在這一課中，你建立了一個以 `@Input()` 裝飾器裝飾的新屬性。你也使用了非空斷言運算子，通知編譯器新屬性的值不會是 `null` 或 `undefined`。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟

* [第 6 課：為元件的範本加入屬性繫結](tutorial/first-app/first-app-lesson-06)

## 如需本課所涵蓋主題的更多資訊，請造訪：
* [在子指令與父指令及元件之間共用資料](guide/inputs-outputs)

@reviewed 2023-07-11
