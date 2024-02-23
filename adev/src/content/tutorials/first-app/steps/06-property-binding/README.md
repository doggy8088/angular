# 將屬性繫結新增至元件的範本

本教學課程示範如何將屬性繫結新增到範本，並使用它將動態資料傳遞給元件。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## 你將會學到

* 您的應用程式在 `HomeComponent` 範本中具有資料繫結。
* 您的應用程式將資料從 `HomeComponent` 傳送至 `HousingLocationComponent`。

## 輸入的概念性預覽

在這個課程中，您將繼續將資料從父元件分享給子元件的程序，方法是使用屬性繫結在範本中將資料繫結到那些屬性。

屬性繫結可讓您將變數連接至 Angular 範本中的 `Input`。然後，資料會動態繫結至 `Input`。

如需更深入的說明，請參閱 [屬性繫結](guide/templates/property-binding) 指南。

<docs-workflow>

<docs-step title="更新 `HomeComponent` 範本">
此步驟將屬性繫結新增至 `<app-housing-location>` 標籤。

在程式碼編輯器中：

1. 導航至 `src/app/home/home.component.ts`
1. 在 `@Component` 裝飾器的範本屬性中，更新程式碼以符合以下程式碼：
    <docs-code header="新增 housingLocation 屬性繫結" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.component.ts" visibleLines="[21]"/>

    當新增屬性繫結至元件標籤時，我們使用 `[attribute] = "value"` 語法來通知 Angular，指派的值應視為元件類別的屬性，而不是字串值。

    右手邊的值是 `HomeComponent` 的屬性名稱。
</docs-step>

<docs-step title="確認程式碼仍然有效">
1.  儲存變更並確認應用程式沒有任何錯誤。
1.  在繼續執行下一個步驟前，請更正任何錯誤。
</docs-step>

</docs-workflow>

摘要：在本課程中，您新增了新的屬性繫結，並傳遞了對類別屬性的參照。現在，`HousingLocationComponent` 可以存取資料，用於自訂元件的顯示。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/templates/property-binding" title="屬性繫結"/>
</docs-pill-row>
