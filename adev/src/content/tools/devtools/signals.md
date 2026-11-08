# 為訊號圖除錯

**Components** 分頁可以為選取的元件或指令顯示即時訊號圖。
這張圖呈現該元件中的訊號、computed、effect 與其他反應式節點如何彼此相依，讓你更容易理解反應式資料流並為它除錯。

<img src="assets/images/guide/devtools/signal-graph.png" alt="Angular DevTools 中「Components」分頁的螢幕截圖，為選取的元件開啟了訊號圖。圖中有一個訊號節點，透過邊連接到三個 computed 節點，這些節點由元件的範本讀取，右側邊欄列出該元件的屬性。">

## 開啟訊號圖

在 **Components** 分頁中，選取一個元件或指令。
在屬性窗格標頭中，點選 **Show Signal Graph**。
訊號圖會在元件樹旁邊開啟。

你也可以直接跳到特定訊號：在屬性檢視中，點選該屬性旁邊的訊號圖按鈕；或者，當該屬性有多個可用動作時，開啟它的動作選單並選擇 **Show in signal graph**。

只要被檢視的應用程式支援訊號圖 API，**Show Signal Graph** 按鈕就會自動出現，沒有需要啟用的設定。

## 讀懂訊號圖

圖中的節點代表參與選取元件的反應式節點：

- **Signal**：用 `signal()` 建立的可寫入訊號。
- **Computed**：用 `computed()` 建立的衍生值。
- **Effect**：用 `effect()` 或 `afterRenderEffect()` 建立的副作用。
- **Linked signal**：用 `linkedSignal()` 建立的可寫入訊號。
- **Template**：元件的範本，在渲染時讀取訊號。
- **Resource**：屬於某個 `resource()` 或 `rxResource()` 的訊號會被分組到一個可收合的叢集中。點選叢集節點上的 **Expand**，即可看到裡面的個別節點。

節點之間的線條表示反應式依賴關係：每個節點都連接到它讀取的生產者（上游），以及讀取它的依賴者（下游）。

TIP: 節點會以其反應式節點的 `debugName` 標示。為你的訊號、computed，尤其是通常不會指派給類別成員的 effect 設定 `debugName`，會讓圖表容易閱讀得多：

```ts
effect(
  () => {
    // ...
  },
  {debugName: 'name in graph'},
);
```

## 搜尋圖表

點選圖表工具列中的搜尋圖示，即可依名稱尋找節點。
Angular DevTools 會反白標示所有符合的節點，並讓你逐一跳轉檢視。

## 檢視節點

點選節點可開啟它的詳細資訊面板，其中以可展開的樹呈現節點目前的值，並提供以下動作：

- **View source**：前往該節點在 Sources 分頁（Chrome）或 Debugger 分頁（Firefox）中的定義。當原始碼位置不可用時，這個動作會被停用。
- **Set breakpoint**：在訊號更新時暫停執行。中斷點只在 Chromium 系列瀏覽器中可用。
- **Watch signal**：將訊號的更新與失效記錄到瀏覽器主控台。再次點選該動作即可停止監看。
- **Highlight upstream / downstream**：追蹤該節點的依賴路徑或其依賴者的路徑。

如果元件沒有使用任何訊號，Angular DevTools 會顯示「No signals in this component」訊息，而不是圖表。

## 版本支援

訊號圖需要以 Angular 19 或更高版本建置、並在開發模式下執行的應用程式。
