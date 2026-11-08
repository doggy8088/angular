# Agent Skills

Agent Skills 是為 Gemini CLI 等 AI 代理設計的專門領域指令與能力。這些技能提供架構指引、產生道地的 Angular 程式碼，並協助以現代最佳實踐建立新專案的骨架。

使用 Agent Skills，可以確保你搭配的 AI 代理掌握 Angular 慣例、反應式模型（如訊號）與專案結構的最新資訊。

## 可用的技能

Angular 團隊維護了一組官方技能，並定期更新，以與框架的最新改進保持同步。

| Skill                   | 說明                                                                                                                                                                                                                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`angular-developer`** | 產生 Angular 程式碼並提供架構指引。適合用來建立元件、服務，或取得反應式（訊號、linkedSignal、resource）、表單、依賴注入、路由、SSR、無障礙（ARIA）、動畫、樣式、測試或 CLI 工具等主題的最佳實踐。 |
| **`angular-new-app`**   | 使用 Angular CLI 建立新的 Angular 應用程式。提供有效設定與組織現代 Angular 應用程式的重要指引。                                                                                                                                           |

## 使用 Agent Skills

Agent Skills 設計上可搭配 [Gemini CLI](https://geminicli.com/docs/cli/skills/)、[Antigravity](https://antigravity.google/docs/skills) 等代理式程式開發工具使用。啟用某項技能時，會載入該任務所需的專屬指令與資源。

若要在自己的環境中使用這些技能，你可以依照所用工具的說明操作，或使用 [skills.sh](https://skills.sh/) 這類社群工具。

```bash
npx skills add https://github.com/angular/skills
```
