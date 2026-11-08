# 檢視元件樹

## 為你的應用程式除錯

**Components** 分頁讓你探索應用程式的結構。
你可以視覺化呈現 DOM 中的元件與指令實例，並檢視或修改它們的狀態。

### 探索應用程式結構

元件樹以階層關係呈現應用程式中的*元件與指令*。

<img src="assets/images/guide/devtools/component-explorer.png" alt="「Components」分頁的螢幕截圖，顯示一棵 Angular 元件與指令的樹，從應用程式的根節點開始。">

在元件總管中點選個別元件或指令即可選取它們，並預覽它們的屬性。
Angular DevTools 會在元件樹右側顯示屬性與中繼資料。

若要依名稱查找元件或指令，請使用元件樹上方的搜尋框。

<img src="assets/images/guide/devtools/search.png" alt="「Components」分頁的螢幕截圖。分頁正下方的篩選列正在搜尋「todo」，樹中名稱含有「todo」的所有元件都被反白標示。目前選取的是 `app-todos`，右側邊欄顯示該元件的屬性資訊，其中包含一區 `@Output` 欄位，以及另一區其他屬性。">

### 前往主機節點

若要前往特定元件或指令的主機元素，在元件總管中對它按兩下。
Angular DevTools 會開啟 Chrome 的 Elements 分頁（或 Firefox 的 Inspector 分頁），並選取對應的 DOM 節點。

### 前往原始碼

對於元件，Angular DevTools 讓你能在 Sources 分頁（Chrome）與 Debugger 分頁（Firefox）中前往元件定義。
選取特定元件後，點選屬性檢視右上角的圖示：

<img src="assets/images/guide/devtools/navigate-source.png" alt="「Components」分頁的螢幕截圖。右側顯示某個元件的屬性檢視，滑鼠停在該檢視右上角的 `<>` 圖示上，旁邊的工具提示寫著「Open component source」。">

### 更新屬性值

和瀏覽器 DevTools 一樣，屬性檢視讓你編輯輸入、輸出或其他屬性的值。
在屬性值上按右鍵，若該值類型支援編輯功能，就會出現文字輸入框。
輸入新值並按下 `Enter`，即可將新值套用到該屬性。

<img src="assets/images/guide/devtools/update-property.png" alt="「Components」分頁的螢幕截圖，開啟了某個元件的屬性檢視。名為 `todo` 的 `@Input` 含有一個 `label` 屬性，該屬性目前被選取，且已手動更新為「Buy milk」。">

### 在主控台存取選取的元件或指令

Angular DevTools 提供了一個主控台捷徑，讓你存取最近選取的元件或指令實例。
輸入 `$ng0` 可取得目前選取的元件或指令實例的參照，輸入 `$ng1` 取得前一個選取的實例，`$ng2` 取得再前一個，依此類推。

<img src="assets/images/guide/devtools/access-console.png" alt="「Components」分頁的螢幕截圖，下方是瀏覽器主控台。使用者在主控台輸入了三個指令：`$ng0`、`$ng1` 與 `$ng2`，用來檢視最近選取的三個元素。每個指令之後，主控台都印出不同的元件參照。">

### 選取指令或元件

和瀏覽器 DevTools 類似，你可以檢視頁面來選取特定元件或指令。
點選 Angular DevTools 左上角的 **_Inspect element_** 圖示，再將滑鼠懸停在頁面上的 DOM 元素上。
擴充功能會辨識相關聯的指令與元件，讓你在元件樹中選取對應的元素。

<img src="assets/images/guide/devtools/inspect-element.png" alt="「Components」分頁的螢幕截圖，畫面中可見一個 Angular 待辦事項應用程式。Angular DevTools 最左上角有一個被選取的圖示（螢幕裡有滑鼠圖示）。滑鼠停在 Angular 應用程式介面中的一個待辦事項元素上，該元素被反白標示，旁邊的工具提示顯示 `<TodoComponent>` 標籤。">

### 檢視可延遲檢視

指令樹除了指令之外，也包含 [`@defer` 區塊](/guide/templates/defer)。

<img src="assets/images/guide/devtools/defer-block.png" />

點選延遲區塊後，屬性邊欄會顯示更多細節：各種選用的區塊（例如 `@loading`、`@placeholder` 與 `@error`）、已設定的觸發條件（defer 觸發條件、prefetch 觸發條件與 hydrate 觸發條件），以及 `minimum`、`after` 等時間選項的值。

### 水合

當你的 SSR/SSG 應用程式啟用了[水合（hydration）](/guide/hydration)時，指令樹會顯示每個元件的水合狀態。

發生錯誤時，受影響的元件上會顯示錯誤訊息。

<img src="assets/images/guide/devtools/hydration-status.png" />

你也可以啟用覆蓋層，將水合狀態直接視覺化呈現在應用程式本身上。

<img src="assets/images/guide/devtools/hydration-overlay-ecom.png" />

上圖展示了水合覆蓋層在一個 Angular 電子商店範例應用程式上的呈現效果。

### 為訊號圖除錯

若要視覺化呈現元件的訊號、computed 與 effect 如何彼此相依，請參閱[為訊號圖除錯](tools/devtools/signals)。
