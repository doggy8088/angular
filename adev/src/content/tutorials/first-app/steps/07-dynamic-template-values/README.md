# 在元件範本中新增插值

這個教學課程示範如何將內插法新增到 Angular 範本，以便在範本中顯示動態資料。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=IFAly3Ss8dwqFx8N&amp;start=338"/>

## 你將會學到

* 您的應用程式將在 `HousingLocationComponent` 範本中顯示內插值。
* 您的應用程式將把住房地點資料呈現在瀏覽器上。

## 插補的概念預覽

在這個步驟中，您將使用內插法在範本中顯示值（屬性和 `Input` 值）。

在 Angular 範本中使用 `{{ expression }}`，您可以從屬性、`Inputs` 和有效的 JavaScript 表達式呈現值。

如需更深入的說明，請參閱 [使用內插法顯示值](guide/templates/interpolation) 指南。

<docs-workflow>

<docs-step title="更新 `HousingLocationComponent` 範本以包含內插值">
此步驟在 `HousingLocationComponent` 範本中新增 HTML 結構和內插值。

在程式碼編輯器中：

1. 導覽至 `src/app/housing-location/housing-location.component.ts`
1. 在 `@Component` 裝飾器的範本屬性中，將現有的 HTML 標記替換為下列程式碼：

    <docs-code header="更新 HousingLocationComponent 範本" path="adev/src/content/tutorials/first-app/steps/08-ngFor/src/app/housing-location/housing-location.component.ts" visibleLines="[9,15]"/>

    在此更新的範本程式碼中，您已使用屬性繫結將 `housingLocation.photo` 繫結至 `src` 屬性。 `alt` 屬性使用內插法為圖片的替代文字提供更多內容。

    您使用內插法來包含 `housingLocation` 屬性的 `name`、`city` 和 `state` 值。
</docs-step>

<docs-step title="確認變更已呈現在瀏覽器中">
1.  儲存所有變更。
1.  開啟瀏覽器並確認應用程式已呈現相片、城市和州範本資料。
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入方塊、搜尋按鈕和相同的住房位置 UI 卡片" src="assets/content/images/tutorials/first-app/homes-app-lesson-07-step-2.png">
</docs-step>

</docs-workflow>

摘要：在本課中，您新增了一個 HTML 結構，並使用 Angular 範本語法來呈現 `HousingLocation` 範本中的值。

現在，您已經具備了兩個重要技能：

* 將資料傳遞給元件
* 將值插入範本中

具備這些技能後，您的應用程式現在可以分享資料並在瀏覽器中顯示動態值。到目前為止很棒。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/templates/interpolation" title="範本語法"/>
  <docs-pill href="guide/templates/template-syntax" title="顯示帶有內插的值"/>
</docs-pill-row>

