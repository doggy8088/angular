# LLM 提示詞與 AI IDE 設定

使用大型語言模型（LLM）產生程式碼，是開發者日益關注的領域。雖然 LLM 通常能產生可運作的程式碼，但要為 Angular 這類持續快速演進的框架產生程式碼，仍是一項挑戰。

進階指令與提示詞正成為一種新興標準，用來以領域專屬的細節支援現代程式碼生成。本章節收錄了精選內容與資源，協助為 Angular 與 LLM 產生更準確的程式碼。

## 自訂提示詞與系統指令

使用下列任一自訂的領域專屬檔案，改善你以 LLM 產生程式碼的體驗。

NOTE: 這些檔案會定期更新，以與 Angular 的慣例保持同步。

以下是一組指令，協助 LLM 產生符合 Angular 最佳實踐的正確程式碼。你可以把這個檔案作為系統指令納入你的 AI 工具，或作為上下文隨提示詞一併提供。

<docs-code language="md" path="packages/core/resources/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">點此下載 best-practices.md 檔案。</a>

## 規則檔案

Antigravity 等多種工具都有規則檔案，可用來為 LLM 提供關鍵上下文，例如 <a href="https://antigravity.google?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_antigravity" target="_blank">Antigravity</a>。

| 環境/IDE             | 規則檔案                                                                                                             | 安裝說明                                                                                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Antigravity          | <a download href="/assets/context/GEMINI.md" target="_blank">GEMINI.md</a>                                             | <a href="https://antigravity.google/docs/rules-workflows" target="_blank">設定 `GEMINI.md`</a>                                                             |
| Copilot 驅動的 IDE | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a> | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">設定 `.github/copilot-instructions.md`</a> |
| Cursor               | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a>                                        | <a href="https://docs.cursor.com/context/rules" target="_blank">設定 `cursorrules.md`</a>                                                                  |
| JetBrains IDEs       | <a download href="/assets/context/AGENTS.md" target="_blank">AGENTS.md</a>                                             | <a href="https://junie.jetbrains.com/docs/guidelines-and-memory.html#how-junie-cli-discovers-guidelines" target="_blank">設定 `AGENTS.md`</a>              |
| VS Code              | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>               | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">設定 `.instructions.md`</a>                |
| Windsurf             | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">設定 `guidelines.md`</a>                                               |

## Angular CLI MCP Server 設定

Angular CLI 包含一個實驗性的 [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/)，讓你開發環境中的 AI 助理能與 Angular CLI 互動。

[**了解如何設定 Angular CLI MCP Server**](/ai/mcp)

## 以 `llms.txt` 提供上下文

`llms.txt` 是一項提議中的網站標準，旨在協助 LLM 更好地理解與處理網站內容。Angular 團隊開發了這個檔案的兩個版本，協助 LLM 以及使用 LLM 進行程式碼生成的工具，產生更好的現代 Angular 程式碼。

- <a href="/llms.txt" target="_blank">llms.txt</a> - 一個索引檔案，提供關鍵檔案與資源的連結。
- <a href="/assets/context/llms-full.txt" target="_blank">llms-full.txt</a> - 一組更完整的彙編資源，說明 Angular 的運作方式以及如何建置 Angular 應用程式。

別忘了查看[總覽頁面](/ai)，了解如何把 AI 整合進你的 Angular 應用程式的更多資訊。
