# 建立介面

本教學課程示範如何建立介面並將其包含在應用程式的元件中。

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=YkFSeUeV8Ixtz8pm"/>

## 你將會學到

<li>您的應用程式有一個新的介面，它可以使用做為資料類型。
<li>您的應用程式有一個新介面的執行個體，附有範例資料。

## 介面的概念預覽

[介面](https://www.typescriptlang.org/docs/handbook/interfaces.html) 是專為您的應用程式所設計的客製化資料類型。

Angular 使用 TypeScript 來利用在強型別程式環境中工作的優勢。
強型別檢查降低了應用程式中的一個元素將格式不正確的資料傳送給另一個元素的可能性。
TypeScript 編譯器會捕捉到此類型的錯誤，而且許多此類錯誤也可以在您的 IDE 中捕捉。

在這個課程中，你將建立介面來定義代表單一住房位置資料的屬性。

<docs-workflow>

<docs-step title="建立新的 Angular 介面">
此步驟會在您的應用程式中建立新的介面。

在您的 IDE 的 **Terminal** 窗格中：

1. 在專案目錄中，導覽至 `first-app` 目錄。
1. 在 `first-app` 目錄中，執行此命令以建立新的介面。

    <docs-code language="shell">

    ng generate interface housinglocation

    </docs-code>

1. 執行 `ng serve` 以建置應用程式並將其提供給 `http://localhost:4200`。
1. 在瀏覽器中，開啟 `http://localhost:4200` 以查看您的應用程式。
1. 確認應用程式建置沒有錯誤。
    在繼續執行下一個步驟之前，請更正任何錯誤。
</docs-step>

<docs-step title="將屬性新增至新介面">
此步驟將屬性新增至介面，以便您的應用程式代表房屋位置。

1. 在 IDE 的 **終端機** 窗格中，啟動 `ng serve` 指令（如果尚未執行），以建置應用程式並將它提供給 `http://localhost:4200`。
2. 在 IDE 的 **編輯** 窗格中，開啟 `src/app/housinglocation.ts` 檔案。
3. 在 `housinglocation.ts` 中，將預設內容替換為以下程式碼，以讓您的新介面符合此範例。

    <docs-code header="更新 src/app/housinglocation.ts 以符合此程式碼" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/housinglocation.ts"/>

4. 儲存變更，並確認應用程式不會顯示任何錯誤。在繼續執行下一個步驟之前，請更正任何錯誤。

在這裡，您定義一個介面，代表關於住宅位置的資料，包括 `id`、`name` 和位置資訊。
</docs-step>

<docs-step title="為您的應用程式建立測試屋">
您有一個介面，但您尚未使用它。

在這個步驟中，您建立介面的實例，並為它指定一些範例資料。
您還看不到這些範例資料出現在您的應用程式中。
在資料出現之前，還有幾個課程要完成。

1. 在 IDE 的 **終端機** 窗格中，執行 `ng serve` 指令（如果尚未執行），以建置應用程式並將應用程式提供給 `http://localhost:4200`。
1. 在 IDE 的 **編輯** 窗格中，開啟 `src/app/home/home.component.ts`。
1. 在 `src/app/home/home.component.ts` 中，在現有的 `import` 陳述式之後新增這項匯入陳述式，以便 `HomeComponent` 可以使用新的介面。

    <docs-code header="在 src/app/home/home.component.ts 中匯入 HomeComponent" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.component.ts" visibleLines="[4]"/>

1. 在 `src/app/home/home.component.ts` 中，將空的 `export class HomeComponent {}` 定義取代為這段程式碼，以便在元件中建立新的介面的單一執行個體。

    <docs-code header="將範例資料新增至 src/app/home/home.component.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.component.ts" visibleLines="[27,38]"/>

1. 確認您的 `home.component.ts` 檔案是否符合此範例。

    <docs-code header="src/app/home/home.component.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.component.ts"/>

    透過將 `HousingLocation` 型別的 `housingLocation` 屬性新增至 `HomeComponent` 類別，我們可以確認資料是否符合介面的說明。如果資料不符合介面的說明，IDE 會提供足夠的資訊，讓我們獲得有用的錯誤訊息。

1. 儲存變更並確認應用程式沒有任何錯誤。開啟瀏覽器並確認您的應用程式仍顯示訊息「housing-location works!」

    <img alt="homes-app 的瀏覽器畫面，顯示標誌、篩選文字輸入方塊和搜尋按鈕，以及訊息「housing-location works!」" src="assets/content/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

1. 在繼續進行下一個步驟之前，請更正任何錯誤。
</docs-step>

</docs-workflow>

摘要：在本課中，您建立了一個介面，為您的應用程式建立新的資料類型。
這個新的資料類型讓您可以指定 `HousingLocation` 資料是必要的。
這個新的資料類型也讓您的 IDE 和 TypeScript 編譯器可以確保 `HousingLocation` 資料用於必要的地方。

有關本課程中涵蓋的主題的更多資訊，請造訪：

<docs-pill-row>
  <docs-pill href="cli/generate#interface-command" title="ng generate interface"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
