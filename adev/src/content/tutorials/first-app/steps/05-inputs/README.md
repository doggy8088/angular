# 為元件加入 input 參數

本教學課程示範如何建立元件的 `input`，並用它將資料傳入元件進行自訂。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

NOTE: 這部影片反映的是較舊的語法，但主要概念仍然適用。

## 你將學到什麼

你的應用程式的 `HousingLocation` 範本有一個 `HousingLocation` 屬性，用來接收輸入。

## Input 概念預覽

[Input](api/core/input)讓元件能指定可以從父元件傳入的資料。

在這一課中，你會在 `HousingLocation` 元件中定義一個 `input` 屬性，讓你能自訂元件中顯示的資料。

進一步了解請參閱[以 input 屬性接收資料](guide/components/inputs)與[以 output 實現自訂事件](guide/components/outputs)指南。

<docs-workflow>

<docs-step title="匯入 input() 函式">
在程式碼編輯器中，將 `input` 輔助方法從 `@angular/core` 匯入，並將 `HousingLocationInfo` 介面從 `../housinglocation` 匯入 `HousingLocation` 元件。

<docs-code header="在 housing-location.ts 中匯入 input 與 HousingLocationInfo" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[1,2]"/>

</docs-step>

<docs-step title="加入 Input 屬性">
加入一個名為 `housingLocation` 的必要屬性，並以型別 `HousingLocationInfo` 使用 `input.required()` 來初始化它。

  <docs-code header="在 housing-location.ts 中宣告 input 屬性" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[10]"/>

你必須在 `input` 上呼叫 `required` 方法，表示父元件一定要提供值。在我們的範例應用程式中，我們知道這個值一定會被傳入，這是刻意設計的。呼叫 `.required()` 能確保 TypeScript 編譯器強制執行這一點，並在範本中使用這個元件時，將該屬性視為不可為 null。

</docs-step>

<docs-step title="將資料傳給 input">
將 `housingLocation` 值從 `Home` 元件傳給 HousingLocation 元件的 `housingLocation` 屬性。

<docs-code language="angular-ts" header="在 home.ts 中為 HousingLocation 宣告 input 屬性" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/home/home.ts" visibleLines="[16]"/>

</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你建立了一個新的 `input` 屬性。你也使用了 `.required` 方法，確保訊號值永遠有定義。

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="以 input 屬性接收資料"/>
  <docs-pill href="guide/components/outputs" title="以 output 實現自訂事件"/>
</docs-pill-row>
