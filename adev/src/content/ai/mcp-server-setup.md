# Angular CLI MCP Server

Angular CLI 包含一個 Model Context Protocol（MCP）server，讓 AI 助理（例如 Cursor、Antigravity、JetBrains AI 等）能直接與 Angular CLI 互動。它提供程式碼生成、工作區分析，以及執行建置與測試的工具。

<docs-callout title="與 Angular AI Agent Skills 的整合">
  如果你的主機環境支援自訂 Agent Skills（例如 Antigravity），你可以把 Angular CLI MCP server 與官方的 [Angular AI Skills](https://angular.dev/ai/agent-skills) 結合使用。技能為代理提供深度的指令層級指引與程式碼標準，MCP server 則提供執行這些指引的動作工具（例如編譯、執行測試與分析工作區），兩者結合即成為完整且強大的開發代理。
</docs-callout>

## 開始使用 {#get-started}

若要使用 MCP server，你需要設定你的主機環境（IDE 或 CLI）來執行 `npx @angular/cli mcp`。

<docs-tab-group>
  <docs-tab label="Antigravity IDE">
    在你的專案根目錄建立一個名為 `.antigravity/mcp.json` 的檔案：

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="Cursor">
    在專案根目錄建立 `.cursor/mcp.json`（或全域的 `~/.cursor/mcp.json`）：

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="VS Code">
    建立 `.vscode/mcp.json`：

    ```json
    {
      "servers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>
</docs-tab-group>

## 可用工具（預設）

啟用 MCP server 後，AI 代理可以使用下列工具：

| 名稱                        | 說明                                                                                               |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                  | 啟動互動式、由 AI 驅動的 Angular 教學導師。                                                         |
| `devserver_start`           | 以非同步方式啟動開發伺服器（`ng serve`）。立即回傳。                                     |
| `devserver_stop`            | 停止開發伺服器。                                                                                     |
| `devserver_wait_for_build`  | 回傳執行中的開發伺服器最近一次建置的記錄。                                        |
| `get_best_practices`        | 擷取 Angular 最佳實踐指南（對獨立元件、型別化表單等至關重要）。        |
| `list_projects`             | 透過讀取 `angular.json`，列出工作區中的所有應用程式與程式庫。                          |
| `onpush_zoneless_migration` | 分析程式碼並提供遷移至 `OnPush` 變更偵測的計畫（無區域化的前置條件）。 |
| `run_target`                | 執行已設定的目標（例如 build、test、lint、e2e、deploy）。                                      |
| `search_documentation`      | 搜尋 `https://angular.dev` 上的官方文件。                                             |

## 常見工作流程

這些工作流程示範 AI 助理如何協調不同的 MCP 工具，自動完成複雜的開發者情境。

### 1. 效能調校：無區域化與 OnPush 遷移

AI 代理最佳化變更偵測效能，並把元件遷移至可無區域化的狀態。

1. **探索工作區**：AI 代理呼叫 `list_projects`，找出工作區中的元件、專案與樣式／測試設定。
2. **原理圖現代化（前置條件）**：AI 代理使用標準的 `ng generate` 指令，執行任何前置所需的訊號遷移（例如 Signal Inputs、Signal Queries）。
3. **規劃遷移**：AI 代理以目錄或元件檔案的絕對路徑呼叫 `onpush_zoneless_migration`。
4. **套用變更**：AI 代理自動把工具回傳的單一可執行變更套用到程式碼庫。
5. **驗證變更**：AI 代理以目標參數 `"test"` 呼叫 `run_target`，執行單元測試。
6. **重複**：AI 代理再次呼叫 `onpush_zoneless_migration` 取得下一步驟，重複進行，直到工具指出遷移完成為止。

### 2. 功能開發與 TDD 迴圈

AI 代理在開發新功能時，自動完成研究、實作與驗證。

1. **API 與語法研究**：AI 代理使用 `search_documentation` 查詢 Angular API 或語法規則（例如 `@defer` 區塊選項）。
2. **載入程式碼標準**：AI 代理以工作區路徑呼叫 `get_best_practices`，載入與 Angular 版本對齊的程式碼規則。
3. **啟動本機開發伺服器**：AI 代理呼叫 `devserver_start`，啟動背景伺服器。
4. **監看建置**：AI 代理使用 `devserver_wait_for_build` 監看建置記錄，確保它編輯程式碼時編譯成功。
5. **撰寫並執行測試**：AI 代理透過 `list_projects` 辨識專案的測試框架（例如 Jasmine、Jest、Vitest），撰寫對應的測試檔案，並以 `"test"` 呼叫 `run_target` 執行測試。
6. **停止開發伺服器**：完成後，AI 代理呼叫 `devserver_stop`，停止作用中的開發伺服器。

### 3. 開發者上手與學習

AI 代理在互動式沙箱中引導開發者學習 Angular 概念。

1. **探索專案**：AI 代理呼叫 `list_projects` 掃描工作區，辨識程式碼庫的結構。
2. **啟動教學導師**：AI 代理執行 `ai_tutor`，載入課程指令、人設與教學指引。
3. **跟隨課程**：AI 代理引導使用者完成課程，講解概念，並指示他們要建立或修改哪些元件。
4. **實作與驗證**：AI 代理協助實作沙箱程式碼，並以 `"test"` 或 `"build"` 呼叫 `run_target` 驗證變更。

## 指令選項

你可以在設定的 `args` 陣列中，把引數傳給 MCP server：

- `--read-only`：只註冊不會修改專案的工具。
- `--local-only`：只註冊不需要網際網路連線的工具。

唯讀模式的範例：

```json
"args": ["-y", "@angular/cli", "mcp", "--read-only"]
```
