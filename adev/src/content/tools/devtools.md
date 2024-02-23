# DevTools 概述

Angular DevTools 是提供 Angular 應用程式除錯和剖析功能的瀏覽器擴充功能。

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

從 [Chrome 網路商店](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) 或 [Firefox 附加元件](https://addons.mozilla.org/en-GB/firefox/addon/angular-devtools/) 安裝 Angular DevTools。

您可以在任何網頁上按 <kbd>F12</kbd> 或 <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> （Windows 或 Linux）和 <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> 或 <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> （Mac）開啟 Chrome 或 Firefox DevTools。
瀏覽器 DevTools 開啟且 Angular DevTools 安裝好後，您可以在「Angular」標籤下找到它。

HELPFUL: Chrome 的新分頁不會執行已安裝的擴充功能，因此 Angular 分頁不會出現在 DevTools 中。請瀏覽其他任何頁面以檢視它。

<img src="assets/content/images/guide/devtools/devtools.png" alt="Angular DevTools 概觀，顯示應用程式的元件樹。">

## 開啟您的應用程式

當你開啟此擴充功能時，你將會看到兩個額外的分頁：

| 標籤                                     | 詳細資料 |
|:---                                      |:---     |
| [元件](tools/devtools#components) | 讓您探索應用程式中的元件和指令，並預覽或編輯它們的狀態。                    |
| [Profiler](tools/devtools#profiler)     | 讓您分析應用程式並了解在變更偵測執行期間的效能瓶頸是什麼。 |

<img src="assets/content/images/guide/devtools/devtools-tabs.png" alt="Angular DevTools 上方的螢幕截圖，說明左上角的兩個索引標籤，一個標籤標示為「元件」，另一個標籤標示為「分析工具」。">

在 Angular DevTools 的右上角，您會找到在頁面上執行的 Angular 版本，以及該擴充功能的最新提交雜湊值。

### Angular 應用程式未偵測到

當開啟 Angular DevTools 時，如果您看到錯誤訊息「未偵測到 Angular 應用程式」，這表示它無法與頁面上的 Angular 應用程式進行通訊。
最常見的原因是因為您正在檢查的網頁不包含 Angular 應用程式。
請仔細確認您正在檢查正確的網頁，並且 Angular 應用程式正在執行。

### 我們偵測到一個使用製作設定所建置的應用程式

若您看到錯誤訊息「我們偵測到一個以生產組態建置的應用程式。Angular DevTools 只支援開發建置。」，這表示在頁面上找到一個 Angular 應用程式，但它是以生產最佳化編譯的。
在針對生產編譯時，Angular CLI 會移除各種除錯功能，以減少頁面上的 JavaScript 數量，以提升效能。這包括與 DevTools 溝通所需的功能。

若要執行 DevTools，您需要在關閉最佳化功能的情況下編譯應用程式。`ng serve` 預設會執行此操作。
如果您需要偵錯已部署的應用程式，請使用 [`optimization` 設定選項](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`) 在您的建置中停用最佳化功能。

## 除錯您的應用程式

**元件** 標籤讓您探索應用程式的結構。
您可以在 DOM 中視覺化元件和指令實例，並檢查或修改其狀態。

### 探索應用結構

元件樹顯示應用程式中 *元件與指令* 的層次關係。

<img src="assets/content/images/guide/devtools/component-explorer.png" alt="「元件」標籤的螢幕截圖，顯示從應用程式根目錄開始的 Angular 元件和指令樹。">

在元件瀏覽器中按一下個別元件或指令以選擇它們，並預覽其屬性。
Angular DevTools 會在元件樹的右側顯示屬性和元資料。

要按名稱查找元件或指令，請使用元件樹上方的搜尋方塊。

<img src="assets/content/images/guide/devtools/search.png" alt="「元件」標籤的螢幕擷圖。位於標籤正下方的篩選器列正在搜尋「todo」，且名稱中含有「todo」的所有元件都會在樹狀結構中以醒目顏色標示。目前已選取「app-todos」，右側的側邊欄會顯示元件屬性的資訊。其中包含一節「@Output」欄位，以及另一節的其他屬性。">

### 導覽至主機節點

如要前往特定元件或指令的宿主元素，請在元件探索器中雙擊它。
Angular DevTools 會在 Chrome 中開啟「元素」標籤或在 Firefox 中開啟「檢查」標籤，並選取關聯的 DOM 節點。

### 前往來源

對於元件，Angular DevTools 讓您在來源標籤 (Chrome) 和偵錯程式標籤 (Firefox) 中導航到元件定義。
選擇特定元件後，按一下屬性檢視右上角的圖示：

<img src="assets/content/images/guide/devtools/navigate-source.png" alt="「元件」標籤的螢幕截圖。右側的屬性檢視對元件可見，且滑鼠靜止在該檢視的右上角，位於 `<>` 圖示上方。鄰近的工具提示寫著「開啟元件來源」。">

### 更新屬性值

就像瀏覽器的 DevTools，屬性檢視可讓您編輯輸入、輸出或其他屬性的值。
右鍵點擊屬性值，若此值類型有編輯功能，將會顯示文字輸入。
輸入新值並按下 `Enter` 將此值套用到屬性。

<img src="assets/content/images/guide/devtools/update-property.png" alt="「元件」標籤的螢幕截圖，元件的屬性檢視開啟。「@Input」名為「todo」，包含一個目前已選取的「標籤」屬性，且已手動更新為「買牛奶」值。">

### 在控制台中存取選取的元件或指令

作為指令台的捷徑，Angular DevTools 提供最近選取的元件或指令的實例存取權。
輸入 `$ng0` 以取得目前選取的元件或指令實例的參照，輸入 `$ng1` 則為先前選取的實例，輸入 `$ng2` 則為先前選取的實例，依此類推。

<img src="assets/content/images/guide/devtools/access-console.png" alt="『Components』標籤的螢幕截圖，下方有瀏覽器控制台。在控制台中，使用者已輸入三個指令，`$ng0`、`$ng1` 和 `$ng2`，用來檢視最近選取的三個元素。在每個陳述式之後，控制台會印出不同的元件參考。">

### 選擇指令或元件

與瀏覽器的 DevTools 類似，您可以檢查頁面以選取特定元件或指令。
按一下 Angular DevTools 中左上角的 ***檢查元素*** 圖示，並將滑鼠遊標懸停在頁面上的 DOM 元素上。
此擴充功能會辨識相關聯的指令和/或元件，並讓您在「元件樹狀圖」中選取對應的元素。

<img src="assets/content/images/guide/devtools/inspect-element.png" alt="截圖顯示「元件」標籤，其中顯示 Angular 待辦事項應用程式。在 Angular DevTools 的左上角，選取一個螢幕圖示，其中有一個滑鼠圖示。滑鼠停留在 Angular 應用程式 UI 中的待辦事項元素上。該元素以「`<TodoComponent>`」標籤突出顯示，並在相鄰的工具提示中顯示。">

## 分析你的應用程序

**Profiler** 標籤讓您可視化 Angular 變更偵測的執行。這對於確定變更偵測何時以及如何影響應用程式的效能非常有用。

<img src="assets/content/images/guide/devtools/profiler.png" alt="「Profiler」標籤的螢幕截圖，其中寫著「按一下播放按鈕以開始新的錄製，或上傳包含 Profiler 資料的 json 檔案。」在旁邊的是一個用於開始錄製新剖析的記錄按鈕，以及一個用於選擇現有剖析的檔案選擇器。">

**Profiler** 標籤讓您開始剖析目前的應用程式，或從先前的執行匯入現有的剖析。
若要開始剖析您的應用程式，請將遊標懸停在 **Profiler** 標籤內左上角的圓圈上，然後按一下 **開始記錄**。

在分析期間，Angular DevTools 會擷取執行事件，例如變更偵測和生命週期掛鉤執行。
與應用程式互動以觸發變更偵測並產生 Angular DevTools 可使用的資料。
若要完成記錄，請再次按一下圓圈以 **停止記錄**。

您也可以匯入現有的錄製。
在 [匯入錄製](tools/devtools#import-recording) 區段中，進一步了解此功能。

### 了解應用程式的執行

在記錄或匯入設定檔後，Angular DevTools 會顯示變更偵測週期的視覺化。

<img src="assets/content/images/guide/devtools/default-profiler-view.png" alt="已記錄或上傳分析資料後『Profiler』標籤的螢幕截圖。其中顯示一個條形圖，說明各種變更偵測週期，還有一些文字寫著『選取一個長條預覽特定變更偵測週期』。">

序列中的每個長條代表應用程式中的變更偵測週期。
長條越高，應用程式花在執行此週期中的變更偵測的時間就越長。
當您選擇長條時，DevTools 會顯示有關它的有用資訊，包括：

* 一個條狀圖，其中包含在這個週期中它所擷取的所有元件和指令。
* Angular 在這個週期中執行變更偵測所花費的時間。
* 使用者體驗到的預估畫面更新率。
* 觸發變更偵測的來源。

<img src="assets/content/images/guide/devtools/profiler-selected-bar.png" alt="「Profiler」標籤的螢幕截圖。使用者已選取單一長條，且附近的下拉式功能表顯示「長條圖」，並在下方顯示第二個長條圖。新圖表有兩個長條佔據大部分空間，分別標示為「TodosComponent」和「NgForOf」。其他長條非常小，幾乎可以忽略不計。">

### 了解元件執行

按一下變更偵測週期後顯示的長條圖會顯示有關您的應用程式在特定元件或指令中執行變更偵測所花費時間的詳細檢視。

此範例顯示 `NgForOf` 指令所花費的總時間，以及呼叫該指令的方法。

<img src="assets/content/images/guide/devtools/directive-details.png" alt="螢幕截圖顯示已選取 `NgForOf` 列的「剖析器」標籤。`NgForOf` 的詳細檢視顯示在右側，其中列出「總花費時間：1.76 毫秒」。其中包括一行，將 `NgForOf` 列為指令，其 `ngDoCheck` 方法耗時 1.76 毫秒。還包括一個標記為「父層級」的清單，其中包含此指令的父元件。">

### 層級檢視

<img src="assets/content/images/guide/devtools/flame-graph-view.png" alt="「Profiler」標籤的螢幕截圖。使用者已選取單一長條圖，現在附近的下拉式功能表顯示「火焰圖形」，下方顯示火焰圖形。火焰圖形從稱為「整個應用程式」和稱為「AppComponent」的列開始。在這些列下方，列開始分成多個項目，第三列從 `[RouterOutlet]` 和 `DemoAppComponent` 開始。幾層深處，一個儲存格以紅色突出顯示。">

您也可以在火焰圖狀檢視中視覺化變更偵測執行。

圖表中的每個磁磚代表螢幕上位於渲染樹中特定位置的一個元素。
例如，考慮一個變更偵測週期，其中 `LoggedOutUserComponent` 被移除，而 Angular 呈現一個 `LoggedInUserComponent` 取代它。在這個情境中，這兩個元件都會顯示在同一個磁磚中。

x 軸代表渲染此變更偵測週期所花費的完整時間。
y 軸代表元素階層。為元素執行變更偵測需要渲染其指令和子元件。
此圖表可視化哪些元件花費最長時間來渲染，以及花費時間的地方。

每個圖塊的顏色取決於 Angular 在該處花費的時間。
Angular DevTools 根據相對於花費最多時間進行渲染的圖塊的時間來決定顏色的強度。

當您點擊某個磁貼時，您會在右邊的面板中看到它的詳細資訊。
雙擊磁貼會將其放大，以便您可以更輕鬆地查看其巢狀子項目。

### 除錯變更偵測和 `OnPush` 元件

通常，圖表會將*呈現*應用程式的時間視覺化，針對任何給定的變更偵測框架。然而，某些元件，例如 `OnPush` 元件，僅在輸入內容變更時才會重新呈現。在特定框架中，不包含這些元件來視覺化火焰圖可能會很有用。

若要僅視覺化變更偵測過程中經過變更偵測架構的元件，請選取火焰圖上方頂端的 **變更偵測** 核取方塊。

此檢視強調所有經過變更偵測的元件，並以灰色顯示未經過變更偵測的元件，例如未重新呈現的 `OnPush` 元件。

<img src="assets/content/images/guide/devtools/debugging-onpush.png" alt="屏幕截圖顯示『Profiler』標籤，顯示變更偵測週期的火焰圖視覺化。現在已勾選標記為『僅顯示變更偵測』的核取方塊。火焰圖看起來與之前非常相似，但是元件的顏色已從橘色變更為藍色。數個標記為 `[RouterOutlet]` 的磁磚不再以任何顏色突顯。">

### 匯入與匯出錄音

點擊已記錄分析工作階段右上角的 **儲存設定檔** 按鈕，以 JSON 格式將其匯出並儲存至磁碟。
稍後，在分析工具的初始檢視中，點擊 **選擇檔案** 輸入，以匯入檔案。

<img src="assets/content/images/guide/devtools/save-profile.png" alt="「Profiler」標籤的螢幕截圖，顯示變更偵測週期。在右側可見「儲存設定檔」按鈕。">
