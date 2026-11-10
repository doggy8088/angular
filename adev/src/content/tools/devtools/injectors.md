## 檢視你的注入器

NOTE: Injector Tree 適用於以 Angular 17 或更高版本建置的應用程式。

### 檢視應用程式的注入器階層

**Injector Tree** 分頁讓你探索應用程式中已設定的注入器結構。在這裡你會看到兩棵樹，分別代表應用程式的[注入器階層](guide/di/hierarchical-dependency-injection)：一棵是環境階層，另一棵是元素階層。

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="「Profiler」分頁的螢幕截圖，顯示 Angular DevTools 中的注入器樹分頁，將範例應用程式的注入器圖視覺化呈現。">

### 視覺化呈現解析路徑

選取特定注入器時，Angular 的依賴注入演算法從該注入器一路遍歷到根節點的路徑會被反白標示。對於元素注入器，當某個依賴無法在元素階層中解析時，這也包括反白標示依賴注入演算法跳轉到的環境注入器。

解析路徑的運作方式詳見[解析規則](guide/di/hierarchical-dependency-injection#resolution-rules)。

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="「Profiler」分頁的螢幕截圖，顯示選取某個注入器時，注入器樹如何以視覺化方式反白標示解析路徑。">

### 檢視注入器的提供者

點選已設定提供者的注入器後，那些提供者會顯示在注入器樹檢視右側的清單中。你可以在這裡檢視所提供的權杖（token）及其類型。每個提供者右側的按鈕可讓你將該提供者記錄到主控台。

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="「Profiler」分頁的螢幕截圖，顯示選取某個注入器時，提供者如何呈現出來。">
