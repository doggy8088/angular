# 為元件的範本加入插值

本教學課程示範如何為 Angular 範本加入插值（interpolation），在範本中顯示動態資料。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=IFAly3Ss8dwqFx8N&amp;start=338"/>

## 你將學到什麼

- 你的應用程式會在 `HousingLocation` 範本中顯示插值後的值。
- 你的應用程式會將房屋地點資料渲染到瀏覽器。

## 插值概念預覽

在這個步驟中，你會使用插值，在範本中顯示從 `input` 屬性讀取到的值。

在 Angular 範本中使用 `{{ expression }}`，你就能渲染來自屬性、`inputs` 與有效 JavaScript 運算式的值。

如需更深入的說明，請參閱[以插值顯示值](guide/templates/binding#render-dynamic-text-with-text-interpolation)指南。

<docs-workflow>

<docs-step title="更新 `HousingLocation` 範本，加入插值後的值">
這個步驟會在 `HousingLocation` 範本中加入新的 HTML 結構與插值後的值。

在程式碼編輯器中：

1.  前往 `src/app/housing-location/housing-location.ts`
1.  在 `@Component` 裝飾器的 template 屬性中，用下列程式碼取代現有的 HTML 標記：

    <docs-code language="angular-ts"  header="更新 housing-location.ts 中的 HousingLocation 範本" path="adev/src/content/tutorials/first-app/steps/08-ngFor/src/app/housing-location/housing-location.ts" visibleLines="[6,17]"/>

在這段更新後的範本程式碼中，你使用屬性繫結將 `housingLocation.photo` 繫結到 `src` 屬性。`alt` 屬性則使用插值，為圖片的替代文字提供更多上下文。

你使用插值來帶入 `housingLocation` 屬性的 `name`、`city` 與 `state` 值。

</docs-step>

<docs-step title="確認變更在瀏覽器中正確渲染">
1.  儲存所有變更。
1.  開啟瀏覽器，確認應用程式有渲染照片、城市與州的範例資料。
    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與同一張房屋地點 UI 卡片" src="assets/images/tutorials/first-app/homes-app-lesson-07-step-2.png">
</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你加入了新的 HTML 結構，並使用 Angular 範本語法在 `HousingLocation` 範本中渲染值。

現在，你已經掌握了兩項重要技能：

- 將資料傳給元件
- 將值以插值方式帶入範本

有了這些技能，你的應用程式現在就能分享資料，並在瀏覽器中顯示動態值。到目前為止做得很好。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="guide/templates" title="範本語法"/>
  <docs-pill href="guide/templates/binding#render-dynamic-text-with-text-interpolation" title="以插值顯示值"/>
</docs-pill-row>
