# DevTools 總覽

Angular DevTools 是一個瀏覽器擴充功能，為 Angular 應用程式提供除錯與效能分析功能。

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

你可以從 [Chrome 線上應用程式商店](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh)或 [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/) 安裝 Angular DevTools。

在任何網頁上按下 <kbd>F12</kbd> 或 <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd>（Windows 或 Linux），或按下 <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> 或 <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd>（Mac），即可開啟 Chrome 或 Firefox DevTools。
瀏覽器 DevTools 開啟且 Angular DevTools 已安裝後，你可以在「Angular」分頁下找到它。

HELPFUL: Chrome 的新分頁頁面不會執行已安裝的擴充功能，因此 Angular 分頁不會出現在 DevTools 中。造訪任何其他頁面即可看到它。

<img src="assets/images/guide/devtools/devtools.png" alt="Angular DevTools 總覽，顯示某個應用程式的元件樹。">

## 開啟你的應用程式

開啟擴充功能後，你會看到兩個額外的分頁：

| 分頁                                                   | 詳細資訊                                                                                           |
| :----------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| [Components](tools/devtools#debug-your-application)   | 讓你探索應用程式中的元件與指令，並預覽或編輯它們的狀態。                                            |
| [Profiler](tools/devtools#profile-your-application)   | 讓你對應用程式進行效能分析，了解變更偵測執行期間的效能瓶頸所在。                                    |

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="Angular DevTools 頂部的螢幕截圖，左上角有兩個分頁，一個標示為「Components」，另一個標示為「Profiler」。">

在 Angular DevTools 右上角，你會看到頁面上正在執行的 Angular 版本，以及擴充功能的最新 commit 雜湊值。

### 未偵測到 Angular 應用程式

如果你開啟 Angular DevTools 時看到「Angular application not detected」錯誤訊息，表示它無法與頁面上的 Angular 應用程式通訊。
最常見的原因是你正在檢視的網頁並不包含 Angular 應用程式。
請再次確認你檢視的是正確的網頁，且 Angular 應用程式正在執行。

### 我們偵測到以正式環境設定建置的應用程式

如果你看到「We detected an application built with production configuration. Angular DevTools only supports development builds.」錯誤訊息，表示頁面上找到了 Angular 應用程式，但它是以正式環境最佳化編譯的。
編譯正式環境版本時，Angular CLI 會移除各種除錯功能，以盡量減少頁面上的 JavaScript 量並提升效能，其中包括與 DevTools 通訊所需的功能。

若要執行 DevTools，你需要以停用最佳化的方式編譯應用程式。`ng serve` 預設就是這樣做的。
如果你需要為已部署的應用程式除錯，請在建置時以 [`optimization` 設定選項](reference/configs/workspace-config#optimization-configuration)（`{"optimization": false}`）停用最佳化。

## 為你的應用程式除錯 {#debug-your-application}

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

## 為你的應用程式進行效能分析 {#profile-your-application}

**Profiler** 分頁讓你視覺化呈現 Angular 變更偵測的執行過程。
這有助於判斷變更偵測在何時、以何種方式影響應用程式的效能。

<img src="assets/images/guide/devtools/profiler.png" alt="「Profiler」分頁的螢幕截圖，畫面文字寫著「Click the play button to start a new recording, or upload a json file containing profiler data.」，旁邊有一個開始新錄製的錄製按鈕，以及選取既有效能分析檔案的檔案選擇器。">

Profiler 分頁讓你開始分析目前應用程式的效能，或匯入先前執行時取得的既有效能資料。
若要開始分析應用程式的效能，將滑鼠懸停在 **Profiler** 分頁左上角的圓圈上，點選 **Start recording**。

效能分析期間，Angular DevTools 會擷取變更偵測、生命週期勾點（hook）執行等執行事件。
與你的應用程式互動，觸發變更偵測並產生 Angular DevTools 可用的資料。
若要結束錄製，再次點選圓圈以 **Stop recording**。

你也可以匯入既有的錄製資料。
這項功能的詳細說明請參閱[匯入與匯出錄製資料](tools/devtools#import-and-export-recordings)一節。

### 了解應用程式的執行過程

錄製或匯入效能資料後，Angular DevTools 會顯示變更偵測週期的視覺化呈現。

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="「Profiler」分頁在錄製或上傳效能資料後的螢幕截圖。畫面顯示一張長條圖，呈現各個變更偵測週期，並有一段文字寫著「Select a bar to preview a particular change detection cycle」。">

序列中的每一條都代表應用程式的一個變更偵測週期。
長條越高，表示應用程式在這個週期中花在執行變更偵測的時間越長。
選取某個長條時，DevTools 會顯示它的實用資訊，包括：

* 一張長條圖，列出這個週期中擷取到的所有元件與指令
* Angular 在這個週期中花在執行變更偵測的時間。
* 使用者實際感受到的估計幀率。
* 觸發變更偵測的來源。

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="「Profiler」分頁的螢幕截圖。使用者已選取單一長條，附近的下拉選單顯示「Bar chart」，下方呈現第二張長條圖。新圖表中有兩個占了大部分空間的長條，一個標示為 `TodosComponent`，另一個標示為 `NgForOf`，其他長條小到相較之下可忽略不計。">

### 了解元件的執行過程

點選變更偵測週期後顯示的長條圖，會詳細呈現應用程式在該特定元件或指令上花了多少時間執行變更偵測。

這個範例顯示了 `NgForOf` 指令花費的總時間，以及它被呼叫的方法。

<img src="assets/images/guide/devtools/directive-details.png" alt="「Profiler」分頁的螢幕截圖，其中 `NgForOf` 長條被選取。右側可見 `NgForOf` 的詳細檢視，列出「Total time spent: 1.76 ms」，並包含一個只有一列的表格，列出 `NgForOf` 這個指令有一個耗時 1.76 ms 的 `ngDoCheck` 方法。此外還有一份標示為「Parent Hierarchy」的清單，包含這個指令的父元件。">

### 階層檢視

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="「Profiler」分頁的螢幕截圖。使用者已選取單一長條，附近的下拉選單現在顯示「Flame graph」，下方呈現火焰圖。火焰圖第一列是「Entire application」，第二列是「AppComponent」，其下各列開始拆分成多個項目，第三列從 `[RouterOutlet]` 與 `DemoAppComponent` 開始。深入幾層後，有一個儲存格被反白標示為紅色。">

你也可以用類似火焰圖的檢視，視覺化呈現變更偵測的執行過程。

圖中的每個磚塊代表渲染樹中特定位置上、螢幕上的一個元素。
例如，假設在某個變更偵測週期中，`LoggedOutUserComponent` 被移除，Angular 改在原位置渲染 `LoggedInUserComponent`，那麼在這個情境下，兩個元件會顯示在同一個磚塊中。

x 軸代表渲染這個變更偵測週期所花的總時間。
y 軸代表元素階層。對某個元素執行變更偵測，需要渲染它的指令與子元件。
這張圖整體呈現了哪些元件的渲染耗時最久，以及時間花在哪裡。

每個磚塊的顏色取決於 Angular 在該處花費的時間。
Angular DevTools 會以渲染耗時最久的磚塊為基準，用相對時間決定顏色的深淺。

點選某個磚塊後，右側面板會顯示它的詳細資訊。
對磚塊按兩下可將它放大，方便檢視其巢狀子元素。

### 為變更偵測與 `OnPush` 元件除錯

一般情況下，對於任一變更偵測幀，圖表呈現的是*渲染*應用程式所花的時間。不過，像 `OnPush` 元件這類元件，只有在其輸入屬性變更時才會重新渲染。針對特定幀，將這些元件從火焰圖中排除有時會很有幫助。

若只想檢視某個變更偵測幀中真正經過變更偵測流程的元件，請勾選火焰圖上方頂端的 **Change detection** 核取方塊。

這個檢視會反白標示所有經過變更偵測的元件，並將未經過的元件顯示為灰色，例如沒有重新渲染的 `OnPush` 元件。

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="「Profiler」分頁的螢幕截圖，顯示某個變更偵測週期的火焰圖視覺化呈現。標示為「Show only change detection」的核取方塊現在已被勾選。火焰圖看起來與之前非常相似，不過元件的顏色已從橙色變成藍色，幾個標示為 `[RouterOutlet]` 的磚塊不再有任何顏色反白。">

### 匯入與匯出錄製資料 {#import-and-export-recordings}

點選已錄製的效能分析工作階段右上角的 **Save Profile** 按鈕，即可將它匯出為 JSON 檔案並儲存到磁碟。
之後，在效能分析工具的初始檢視中點選 **Choose file** 輸入框，即可匯入該檔案。

<img src="assets/images/guide/devtools/save-profile.png" alt="「Profiler」分頁的螢幕截圖，顯示變更偵測週期。右側可見一個「Save Profile」按鈕。">

## 檢視你的注入器

NOTE: Injector Tree 適用於以 Angular 17 或更高版本建置的應用程式。

### 檢視應用程式的注入器階層

**Injector Tree** 分頁讓你探索應用程式中已設定的注入器結構。在這裡你會看到兩棵樹，分別代表應用程式的[注入器階層](guide/di/hierarchical-dependency-injection)：一棵是環境階層，另一棵是元素階層。

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="「Profiler」分頁的螢幕截圖，顯示 Angular DevTools 中的注入器樹分頁，將範例應用程式的注入器圖視覺化呈現。">

### 視覺化呈現解析路徑

選取特定注入器時，Angular 的依賴注入演算法從該注入器一路遍歷到根節點的路徑會被反白標示。對於元素注入器，當某個依賴無法在元素階層中解析時，這也包括反白標示依賴注入演算法跳轉到的環境注入器。

Angular 如何解析這些路徑，詳見[解析規則](guide/di/hierarchical-dependency-injection#resolution-rules)。

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="「Profiler」分頁的螢幕截圖，顯示選取某個注入器時，注入器樹如何以視覺化方式反白標示解析路徑。">

### 檢視注入器的提供者

點選已設定提供者的注入器後，那些提供者會顯示在注入器樹檢視右側的清單中。你可以在這裡檢視所提供的權杖（token）及其類型。

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="「Profiler」分頁的螢幕截圖，顯示選取某個注入器時，提供者如何呈現出來。">
