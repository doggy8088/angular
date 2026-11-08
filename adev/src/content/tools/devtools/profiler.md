# 為你的應用程式進行效能分析

**Profiler** 分頁讓你視覺化呈現 Angular 變更偵測的執行過程。
這有助於判斷變更偵測在何時、以何種方式影響應用程式的效能。

<img src="assets/images/guide/devtools/profiler.png" alt="「Profiler」分頁的螢幕截圖，畫面文字寫著「Click the play button to start a new recording, or upload a json file containing profiler data.」，旁邊有一個開始新錄製的錄製按鈕，以及選取既有效能分析檔案的檔案選擇器。">

Profiler 分頁讓你開始分析目前應用程式的效能，或匯入先前執行時取得的既有效能資料。
若要開始分析應用程式的效能，將滑鼠懸停在 **Profiler** 分頁左上角的圓圈上，點選 **Start recording**。

效能分析期間，Angular DevTools 會擷取變更偵測、生命週期勾點（hook）執行等執行事件。
與你的應用程式互動，觸發變更偵測並產生 Angular DevTools 可用的資料。
若要結束錄製，再次點選圓圈以 **Stop recording**。

你也可以匯入既有的錄製資料。
這項功能的詳細說明請參閱[匯入與匯出錄製資料](tools/devtools/profiler#import-and-export-recordings)一節。

## 了解應用程式的執行過程

錄製或匯入效能資料後，Angular DevTools 會顯示變更偵測週期的視覺化呈現。

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="「Profiler」分頁在錄製或上傳效能資料後的螢幕截圖。畫面顯示一張長條圖，呈現各個變更偵測週期，並有一段文字寫著「Select a bar to preview a particular change detection cycle」。">

序列中的每一條都代表應用程式的一個變更偵測週期。
長條越高，表示應用程式在這個週期中花在執行變更偵測的時間越長。
選取某個長條時，DevTools 會顯示它的實用資訊，包括：

- 一張長條圖，列出這個週期中擷取到的所有元件與指令
- Angular 在這個週期中花在執行變更偵測的時間
- 使用者實際感受到的估計幀率（若低於 60fps）

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="「Profiler」分頁的螢幕截圖。使用者已選取單一長條，附近的下拉選單顯示「Bar chart」，下方呈現第二張長條圖。新圖表中有兩個占了大部分空間的長條，一個標示為 `TodosComponent`，另一個標示為 `NgForOf`，其他長條小到相較之下可忽略不計。">

## 了解元件的執行過程

點選變更偵測週期後顯示的長條圖，會詳細呈現應用程式在該特定元件或指令上花了多少時間執行變更偵測。

這個範例顯示了 `NgForOf` 指令花費的總時間，以及它被呼叫的方法。

<img src="assets/images/guide/devtools/directive-details.png" alt="「Profiler」分頁的螢幕截圖，其中 `NgForOf` 長條被選取。右側可見 `NgForOf` 的詳細檢視，列出「Total time spent: 1.76 ms」，並包含一個只有一列的表格，列出 `NgForOf` 這個指令有一個耗時 1.76 ms 的 `ngDoCheck` 方法。此外還有一份標示為「Parent Hierarchy」的清單，包含這個指令的父元件。">

## 階層檢視

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

## 為變更偵測與 `OnPush` 元件除錯

一般情況下，對於任一變更偵測幀，圖表呈現的是*渲染*應用程式所花的時間。不過，像 `OnPush` 元件這類元件，只有在其輸入屬性變更時才會重新渲染。針對特定幀，將這些元件從火焰圖中排除有時會很有幫助。

若只想檢視某個變更偵測幀中真正經過變更偵測流程的元件，請勾選火焰圖上方頂端的 **Change detection** 核取方塊。

這個檢視會反白標示所有經過變更偵測的元件，並將未經過的元件顯示為灰色，例如沒有重新渲染的 `OnPush` 元件。

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="「Profiler」分頁的螢幕截圖，顯示某個變更偵測週期的火焰圖視覺化呈現。標示為「Show only change detection」的核取方塊現在已被勾選。火焰圖看起來與之前非常相似，不過元件的顏色已從橙色變成藍色，幾個標示為 `[RouterOutlet]` 的磚塊不再有任何顏色反白。">

## 匯入與匯出錄製資料

點選已錄製的效能分析工作階段右上角的 **Save Profile** 按鈕，即可將它匯出為 JSON 檔案並儲存到磁碟。
之後，在效能分析工具的初始檢視中點選 **Choose file** 輸入框，即可匯入該檔案。

<img src="assets/images/guide/devtools/save-profile.png" alt="「Profiler」分頁的螢幕截圖，顯示變更偵測週期。右側可見一個「Save Profile」按鈕。">
