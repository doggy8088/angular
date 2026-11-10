# 檢視路由樹

**Router Tree** 分頁讓你視覺化呈現應用程式的路由樹。你可以探索路由如何巢狀嵌套，並檢視特定路由的詳細資訊。

<img src="assets/images/guide/devtools/router-tree.png" alt="Angular DevTools 中「Router Tree」分頁的螢幕截圖，顯示一棵已設定路由的樹。作用中的路由以綠色反白標示，未作用的則是白色。">

### 檢視路由詳細資訊

在樹中選取特定路由時，Angular DevTools 會在右側邊欄顯示它的屬性。這些資訊包括：

- **Path**：該路由的 URL 路徑。若路由使用自訂 URL 比對器（matcher），DevTools 改顯示 **Matcher**。
- **Component**：為這個路由渲染的元件。若該路由是重新導向，DevTools 改顯示 **Redirect to** 目標。
- **Path Match**：路徑比對策略（`prefix` 或 `full`），若有設定才顯示。
- **Data**：與路由相關聯的靜態資料，以 JSON 樹呈現。
- **Resolvers**：路由解析器（resolver），以鍵值對呈現。
- **Guards**：設定在路由上的所有守衛（guard），依類型分組——`canActivate`、`canActivateChild`、`canDeactivate` 與 `canMatch`。
- **Providers**：路由層級的提供者，若有設定才顯示。
- **Title**：路由標題，若有設定才顯示。
- **RunGuardsAndResolvers**：守衛與解析器的重跑策略，若有設定才顯示。
- **Active**：這個路由目前是否處於作用中狀態。
- **Auxiliary**：指出該路由是否為輔助路由（例如位於具名 outlet 中）。
- **Lazy**：指出該路由是否延遲載入。

Note: Path Match、Data、Resolvers、Guards、Providers、Title 與 RunGuardsAndResolvers 等屬性，只有在選取的路由上有設定時，才會出現在邊欄中。

### 導航到特定路由

你可以直接從 DevTools 輕鬆觸發導航。在右側邊欄檢視路由詳細資訊時，點選路徑字串旁邊的 **Navigate** 圖示，即可觸發 Angular 路由器導航到應用程式中的該 URL。

<img src="assets/images/guide/devtools/router-tree-navigate.png" alt="螢幕截圖顯示「Routes Details」邊欄中，路由路徑上的「Navigate to」工具提示。">
