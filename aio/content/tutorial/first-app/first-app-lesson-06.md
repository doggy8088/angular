# 第 6 課：為元件的範本加入屬性繫結

本教學課程示範如何為範本加入屬性繫結（property binding），並用它將動態資料傳給元件。

**預估時間**：約 10 分鐘

**起始程式碼**： <live-example name="first-app-lesson-05"></live-example>

**完成程式碼**： <live-example name="first-app-lesson-06"></live-example>

## 你將學到什麼

*  你的應用程式在 `HomeComponent` 範本中有資料繫結。
*  你的應用程式會將資料從 `HomeComponent` 傳送到 `HousingLocationComponent`。

## Input 概念預覽
在這一課中，你會繼續將資料從父元件分享給子元件的過程：在範本中使用屬性繫結，將資料繫結到那些屬性上。

屬性繫結讓你能將變數連接到 Angular 範本中的 `Input`。資料會隨之動態繫結到該 `Input`。

如需更深入的說明，請參閱[屬性繫結](guide/property-binding)指南。

## 步驟 1：更新 `HomeComponent` 範本中的 <app-housing-location> 標籤
這個步驟會為 `<app-housing-location>` 標籤加入屬性繫結。

在程式碼編輯器中：
1.  前往 `src/app/home/home.component.ts`
1.  在 `@Component` 裝飾器的 template 屬性中，更新程式碼以符合以下程式碼：
    <code-example header="Add housingLocation property binding" path="first-app-lesson-06/src/app/home/home.component.ts" region="add-property-binding"></code-example>

為元件標籤加入屬性繫結時，我們使用 `[attribute] = "value"` 語法，通知 Angular 將指派的值視為來自元件類別的屬性，而不是字串值。

右側的值是 `HomeComponent` 中屬性的名稱。

## 步驟 2：確認程式碼仍然可以運作
1.  1. 儲存你的變更，確認應用程式沒有任何錯誤。
1.  繼續下一步之前，請先修正任何錯誤。

## 課程回顧

Summary: 在這一課中，你加入了新的屬性繫結，並傳入一個類別屬性的參照。現在，`HousingLocationComponent` 可以存取資料，用來自訂元件的顯示方式。

如果你在這一課遇到任何困難，可以在 <live-example></live-example> 中查看這一課的完成程式碼。

## 後續步驟

* [第 7 課：為元件的範本加入插值](tutorial/first-app/first-app-lesson-07)

## 如需本課所涵蓋主題的更多資訊，請造訪：
* [屬性繫結](guide/property-binding)

@reviewed 2023-07-11
