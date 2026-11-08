# 為元件的範本加入屬性繫結

本教學課程示範如何為範本加入屬性繫結（property binding），並用它將動態資料傳給元件。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## 你將學到什麼

- 你的應用程式在 `Home` 範本中有資料繫結。
- 你的應用程式會將資料從 `Home` 傳送到 `HousingLocation`。

## Input 概念預覽

在這一課中，你會繼續將資料從父元件分享給子元件的過程：在範本中使用屬性繫結，將資料繫結到那些屬性上。

屬性繫結讓你能將變數連接到 Angular 範本中的 `Input`。資料會隨之動態繫結到該 `Input`。

如需更深入的說明，請參閱[屬性繫結](/guide/templates/binding#binding-dynamic-properties-and-attributes)指南。

<docs-workflow>

<docs-step title="更新 `Home` 範本">
這個步驟會為 `<app-housing-location>` 標籤加入屬性繫結。

在程式碼編輯器中：

1.  前往 `src/app/home/home.ts`
1.  在 `@Component` 裝飾器的 template 屬性中，將程式碼更新成與下列程式碼一致：
    <docs-code language="angular-ts" header="加入 housingLocation 屬性繫結" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.ts" visibleLines="[15,17]"/>

    為元件標籤加入屬性繫結時，我們使用 `[attribute] = "value"` 語法，通知 Angular 將指派的值視為來自元件類別的屬性，而不是字串值。

    右側的值是 `Home` 中屬性的名稱。

</docs-step>

<docs-step title="確認程式碼仍然可以運作">
1.  儲存你的變更，確認應用程式沒有任何錯誤。
1.  繼續下一步之前，請先修正任何錯誤。
</docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你加入了新的屬性繫結，並傳入一個類別屬性的參照。現在，`HousingLocation` 可以存取資料，用來自訂元件的顯示方式。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="/guide/templates/binding#binding-dynamic-properties-and-attributes" title="屬性繫結"/>
</docs-pill-row>
