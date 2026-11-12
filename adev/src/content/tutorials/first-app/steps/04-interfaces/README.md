# 建立介面

本教學課程示範如何建立介面，並將它用在應用程式的元件中。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=YkFSeUeV8Ixtz8pm"/>

## 你將學到什麼

- 你的應用程式將會有一個新介面，可以用來作為資料型別。
- 你的應用程式將會有新介面的一個實例，並帶有範例資料。

## 介面概念預覽

[介面](https://www.typescriptlang.org/docs/handbook/interfaces.html)是你的應用程式自訂的資料型別。

Angular 使用 TypeScript，藉此善用強型別程式設計環境。
強型別檢查能降低應用程式中某個元素把格式不正確的資料傳給另一個元素的可能性。
這類型別不符的錯誤會被 TypeScript 編譯器抓出來，其中許多錯誤也能在你的 IDE 中被發現。

在這一課中，你會建立一個介面，定義代表單一房屋地點資料的屬性。

<docs-workflow>

<docs-step title="建立新的 Angular 介面">
這個步驟會在你的應用程式中建立一個新介面。

在 IDE 的 **Terminal** 窗格中：

1. 在你的專案目錄中，進入 `first-app` 目錄。
1. 在 `first-app` 目錄中，執行下列指令，建立新介面。

   ```shell

   ng generate interface housinglocation

   ```

1. 執行 `ng serve`，建置應用程式並將它提供到 `http://localhost:4200`。
1. 在瀏覽器中開啟 `http://localhost:4200`，查看你的應用程式。
1. 確認應用程式建置時沒有錯誤。
   繼續下一步之前，請先修正任何錯誤。
   </docs-step>

<docs-step title="為新介面加入屬性">
這個步驟會為介面加入你的應用程式用來代表房屋地點所需的屬性。

1.  在 IDE 的 **Terminal** 窗格中，如果 `ng serve` 指令尚未執行，請啟動它，建置應用程式並將它提供到 `http://localhost:4200`。
1.  在 IDE 的 **Edit** 窗格中，開啟 `src/app/housinglocation.ts` 檔案。
1.  在 `housinglocation.ts` 中，用下列程式碼取代預設內容，讓你的新介面和這個範例一致。

      <docs-code header="更新 src/app/housinglocation.ts，使其與這段程式碼一致" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/housinglocation.ts" visibleLines="[1,10]" />

1.  儲存你的變更，確認應用程式沒有顯示任何錯誤。繼續下一步之前，請先修正任何錯誤。

到目前為止，你已經定義了一個代表房屋地點資料的介面，包含 `id`、`name` 與地點資訊。
</docs-step>

<docs-step title="為你的應用程式建立一間測試房屋">
你已經有了介面，但還沒有使用它。

在這個步驟中，你會建立介面的一個實例，並為它指派一些範例資料。
目前你還不會在應用程式中看到這些範例資料出現。
還要再完成幾課，才會看到它。

1.  在 IDE 的 **Terminal** 窗格中，如果 `ng serve` 指令尚未執行，請執行它，建置應用程式並將它提供到 `http://localhost:4200`。
1.  在 IDE 的 **Edit** 窗格中，開啟 `src/app/home/home.ts`。
1.  在 `src/app/home/home.ts` 中，在現有的 `import` 陳述式之後加入這段匯入陳述式，讓 `Home` 可以使用新介面。

      <docs-code language="angular-ts" header="在 src/app/home/home.ts 中匯入 Home" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[3]"/>

1.  在 `src/app/home/home.ts` 中，用下列程式碼取代空白的 `export class Home {}` 定義，在元件中建立新介面的一個實例。

      <docs-code language="angular-ts" header="將範例資料加入 src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[21,34]"/>

1.  確認你的 `home.ts` 檔案與這個範例一致。

      <docs-code language="angular-ts" header="src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[1,34]" />

    透過為 `Home` 類別加入型別為 `HousingLocation` 的 `housingLocation` 屬性，我們就能確認資料符合介面的描述。如果資料不符合介面的描述，IDE 有足夠的資訊能給我們有幫助的錯誤提示。

1.  儲存你的變更，確認應用程式沒有任何錯誤。開啟瀏覽器，確認你的應用程式仍然顯示「housing-location works!」訊息。

      <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入框、搜尋按鈕與「housing-location works!」訊息" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

1.  繼續下一步之前，請先修正任何錯誤。
    </docs-step>

</docs-workflow>

SUMMARY: 在這一課中，你建立了一個介面，為你的應用程式建立了新的資料型別。
有了這個新資料型別，你就能指定哪些地方需要 `HousingLocation` 資料。
這個新資料型別也能讓你的 IDE 與 TypeScript 編譯器確保 `HousingLocation` 資料被用在需要它的地方。

如需本課所涵蓋主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="cli/generate/interface" title="ng generate interface"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
