# 為元件加入 input 參數

本教學課程示範如何建立元件的 `@Input()`，並用它將資料傳入元件進行自訂。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

## 你將學到什麼

你的應用程式的 `HousingLocationComponent` 範本有一個 `HousingLocation` 屬性，用來接收輸入。

## Input 概念預覽

[Input](api/core/Input)讓元件能共享資料。資料共享的方向是從父元件到子元件。

在這一課中，你會在 `HousingLocationComponent` 元件中定義 `@Input()` 屬性，讓你能自訂元件中顯示的資料。

進一步了解請參閱[以 input 屬性接收資料](guide/components/inputs)與[以 output 實現自訂事件](guide/components/outputs)指南。

<docs-workflow>

<docs-step title="匯入 Input 裝飾器">
這個步驟會將 `Input` 裝飾器匯入類別中。

在程式碼編輯器中：

1. 前往 `src/app/housing-location/housing-location.component.ts`
1. 更新檔案的 imports，加入 `Input` 與 `HousingLocation`：

    <docs-code header="在 src/app/housing-location/housing-location.component.ts 中匯入 HousingLocationComponent 與 Input" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.component.ts" visibleLines="[1,3]"/>

</docs-step>

<docs-step title="加入 Input 屬性">
1.  在同一個檔案中，為 `HousingLocationComponent` 類別加入一個名為 `housingLocation`、型別為 `HousingLocation` 的屬性。在屬性名稱後面加上 `!`，並在前面加上 `@Input()` 裝飾器：

    <docs-code header="在 src/app/housing-location/housing-location.component.ts 中匯入 HousingLocationComponent 與 Input" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.component.ts" visibleLines="[16,18]"/>

    你必須加上 `!`，因為輸入預期會有值被傳入。在這個情況下，沒有預設值。在我們的範例應用程式中，我們知道這個值會被傳入，這是刻意設計的。這個驚嘆號稱為非空斷言運算子，它告訴 TypeScript 編譯器，這個屬性的值不會是 null 或 undefined。

1. 儲存你的變更，確認應用程式沒有任何錯誤。

1. 繼續下一步之前，請先修正任何錯誤。
</docs-step>

</docs-workflow>

Summary: 在這一課中，你建立了一個以 `@Input()` 裝飾器裝飾的新屬性。你也使用了非空斷言運算子，通知編譯器新屬性的值不會是 `null` 或 `undefined`。

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="以 input 屬性接收資料"/>
  <docs-pill href="guide/components/outputs" title="以 output 實現自訂事件"/>
</docs-pill-row>
