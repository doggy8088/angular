# 在元件中新增輸入參數

這節教學課程示範如何建立一個元件 `@Input()` 並使用它將資料傳遞給一個元件以進行客製化。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

## 你將會學到

您的應用程式 `HousingLocationComponent` 範本有一個 `HousingLocation` 屬性來接收輸入。

## 輸入的概念性預覽

[輸入](api/core/Input) 允許元件共享資料。資料共享的方向從父元件到子元件。

在這個課程中，您將在 `HousingLocationComponent` 元件中定義 `@Input()` 屬性，這將讓您自訂在元件中顯示的資料。

在[接受具有輸入屬性的資料](guide/components/inputs)和[具有輸出項的自訂事件](guide/components/outputs)指南中了解更多。

<docs-workflow>

<docs-step title="匯入 Input 裝飾器">
此步驟將 `Input` 裝飾器匯入至類別中。

在程式碼編輯器中：

1. 導覽至 `src/app/housing-location/housing-location.component.ts`
1. 更新檔案匯入，以納入 `Input` 和 `HousingLocation`：

    <docs-code header="在 src/app/housing-location/housing-location.component.ts 中匯入 HousingLocationComponent 和 Input" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.component.ts" visibleLines="[1,3]"/>

</docs-step>

<docs-step title="新增 Input 屬性">
1.  在同一個檔案中，在 `HousingLocationComponent` 類別中新增一個 `housingLocation` 屬性，類型為 `HousingLocation`。在屬性名稱後加一個 `!` 並加上 `@Input()` 裝飾器：

    <docs-code header="Import HousingLocationComponent and Input in src/app/housing-location/housing-location.component.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.component.ts" visibleLines="[16,18]"/>

    You have to add the `!` because the input is expecting the value to be passed. In this case, there is no default value. In our example application case we know that the value will be passed in - this is by design. The exclamation point is called the non-null assertion operator and it tells the TypeScript compiler that the value of this property won't be null or undefined.


1. Save your changes and confirm the app does not have any errors.

1. Correct any errors before you continue to the next step.
</docs-step>


</docs-workflow>

Summary: In this lesson, you created a new property decorated with the `@Input()` decorator. You also used the non-null assertion operator to notify the compiler that the value of the new property won't be `null` or `undefined`.

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="Accepting data with input properties"/>
  <docs-pill href="guide/components/outputs" title="Custom events with outputs"/>
</docs-pill-row>

