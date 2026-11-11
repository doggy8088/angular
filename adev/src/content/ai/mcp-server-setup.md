# Angular CLI MCP Server 設定

Angular CLI 包含一個實驗性的 [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/)，讓你開發環境中的 AI 助理能與 Angular CLI 互動。我們已納入對 CLI 驅動的程式碼生成、新增套件等功能的支援。

## 可用工具

Angular CLI MCP server 提供多個工具，協助你的開發工作流程。預設啟用下列工具：

| Name                   | Description                                                                                                                                                                                        | `local-only` | `read-only` |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `get_best_practices` | 擷取 Angular 最佳實務指南。這份指南對於確保所有程式碼遵循現代標準至關重要，包括獨立元件、型別化表單與現代控制流程。                                                                                                                                   | ✅          | ✅         |
| `list_projects`      | 列出 Angular 工作區中定義的所有應用程式與程式庫名稱。它會讀取 `angular.json` 設定檔來辨識這些專案。                                                                                                                                   | ✅          | ✅         |
| `search_documentation` | 搜尋位於 https://angular.dev 的 Angular 官方文件。任何關於 Angular 的問題，例如 API、教學與最佳實務，都應使用此工具來回答。                                                                                                              | ❌          | ✅         |

## 開始使用 {#get-started}

若要開始使用，請在你的終端機中執行下列指令：

```bash
ng mcp
```

從互動式終端機執行時，這個指令會顯示如何設定宿主環境以使用 MCP server 的指示。下列章節提供數個熱門編輯器與工具的設定範例。

### Cursor

在你的專案根目錄建立名為 `.cursor/mcp.json` 的檔案，並加入下列設定。你也可以在 `~/.cursor/mcp.json` 中全域設定。

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

### Firebase Studio

在你的專案根目錄建立名為 `.idx/mcp.json` 的檔案，並加入下列設定：

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

### Gemini CLI

在你的專案根目錄建立名為 `.gemini/settings.json` 的檔案，並加入下列設定：

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

### JetBrains IDEs

在 JetBrains IDE（如 IntelliJ IDEA 或 WebStorm）中，安裝 JetBrains AI Assistant 外掛後，前往 `Settings | Tools | AI Assistant | Model Context Protocol (MCP)`。新增一個伺服器（`+`）並選取 `As JSON`。然後貼上下列設定：

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

如需設定 MCP server 的最新指示，請參閱 JetBrains 文件：[Connect to an MCP server](https://www.jetbrains.com/help/ai-assistant/mcp.html#connect-to-an-mcp-server)。

### VS Code

在你的專案根目錄建立名為 `.vscode/mcp.json` 的檔案，並加入下列設定。請注意這裡使用的是 `servers` 屬性。

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

### 其他 IDE

對於其他 IDE，請查看你的 IDE 文件，確認 MCP 設定檔的正確位置（通常是 `mcp.json`）。設定內容應包含下列片段。

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

## 指令選項 {#command-options}

`mcp` 指令可以透過下列選項進行設定，這些選項會以引數形式傳入你 IDE 的 MCP 設定中：

| Option         | Type      | Description                                                                                                                       | Default |
| :------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `--read-only` | `boolean` | 只註冊不會變更專案的工具。你的編輯器或程式碼代理仍可能執行編輯。                                                                                                | `false` |
| `--local-only` | `boolean` | 只註冊不需要網際網路連線的工具。你的編輯器或程式碼代理仍可能透過網路傳送資料。                                                                                         | `false` |

例如，若要在 VS Code 中以唯讀模式執行伺服器，你可以這樣更新你的 `mcp.json`：

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only"]
    }
  }
}
```

## 回饋與新想法

Angular 團隊歡迎你對現有 MCP 功能提供回饋，也歡迎任何關於新工具或功能的想法。請在 [angular/angular GitHub 儲存庫](https://github.com/angular/angular/issues)上開立 issue，分享你的想法。
