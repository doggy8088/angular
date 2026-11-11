# LLM 提示詞與 AI IDE 設定

使用大型語言模型（LLM）產生程式碼，是開發者日益關注的領域。雖然 LLM 通常能產生可運作的程式碼，但要為 Angular 這類持續快速演進的框架產生程式碼，仍是一項挑戰。

進階指令與提示詞正成為一種新興標準，用來以領域專屬的細節支援現代程式碼生成。本章節收錄了精選內容與資源，協助為 Angular 與 LLM 產生更準確的程式碼。

## 自訂提示詞與系統指令

使用下列任一自訂的領域專屬檔案，改善你以 LLM 產生程式碼的體驗。

NOTE: 這些檔案會定期更新，以與 Angular 的慣例保持同步。

以下是一組指令，協助 LLM 產生符合 Angular 最佳實踐的正確程式碼。你可以把這個檔案作為系統指令納入你的 AI 工具，或作為上下文隨提示詞一併提供。

<docs-code language="md" path="adev/src/context/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">點此下載 best-practices.md 檔案。</a>

## 規則檔案

Firebase Studio 等多種編輯器都有規則檔案，可用來為 LLM 提供關鍵上下文，例如 <a href="https://studio.firebase.google.com?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_firebase_studio">Firebase Studio</a>。

| 環境/IDE             | 規則檔案                                                                                                             | 安裝說明                                                                                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firebase Studio      | <a download href="/assets/context/airules.md" target="_blank">airules.md</a>                                           | <a href="https://firebase.google.com/docs/studio/set-up-gemini#custom-instructions">設定 `airules.md`</a>                                  |
| Copilot 驅動的 IDE | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a> | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">設定 `.github/copilot-instructions.md`</a> |
| Cursor               | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a>                                        | <a href="https://docs.cursor.com/context/rules" target="_blank">設定 `cursorrules.md`</a>                                                                  |
| JetBrains IDEs       | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://www.jetbrains.com/help/junie/customize-guidelines.html" target="_blank">設定 `guidelines.md`</a>                                          |
| VS Code              | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>               | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">設定 `.instructions.md`</a>                |
| Windsurf             | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">設定 `guidelines.md`</a>                                               |

## Angular CLI MCP Server 設定

Angular CLI 包含一個實驗性的 [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/)，讓你開發環境中的 AI 助理能與 Angular CLI 互動。

[**了解如何設定 Angular CLI MCP Server**](/ai/mcp)

## 以 `llms.txt` 提供上下文

`llms.txt` 是一項提議中的網站標準，旨在協助 LLM 更好地理解與處理網站內容。Angular 團隊開發了這個檔案的兩個版本，協助 LLM 以及使用 LLM 進行程式碼生成的工具，產生更好的現代 Angular 程式碼。

- <a href="/llms.txt" target="_blank">llms.txt</a> - 一個索引檔案，提供關鍵檔案與資源的連結。
- <a href="/context/llm-files/llms-full.txt" target="_blank">llms-full.txt</a> - 一組更完整的彙編資源，說明 Angular 的運作方式以及如何建置 Angular 應用程式。

別忘了[查看總覽頁面](/ai)，了解如何把 AI 整合進你的 Angular 應用程式的更多資訊。

## Web Codegen Scorer

Angular 團隊開發並開源了 [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer)，這是一個用來評估 AI 生成的 Web 程式碼品質並為其評分的工具。你可以用這個工具，針對 AI 生成的程式碼做出有實證依據的決策，例如微調提示詞，以改善 LLM 為 Angular 生成程式碼的準確度。這些提示詞可以納入你的 AI 工具的系統指令，或作為提示詞的上下文一併提供。你也可以用這個工具比較不同模型產生的程式碼品質，並隨著模型與代理的演進，持續監測品質變化。
