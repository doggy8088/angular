<!-- TODO: need an Angular + AI logo -->

<docs-decorative-header title="用 AI 建置" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
打造 AI 驅動的應用程式，用 AI 更快開發。
</docs-decorative-header>

HELPFUL: 想在你愛用的 AI 驅動 IDE 中開始上手嗎？<br>請參考我們的[提示詞規則與最佳實踐](/ai/develop-with-ai)。

生成式 AI（GenAI）結合大型語言模型（LLM），能打造精緻且引人入勝的應用程式體驗，包括個人化內容、智慧推薦、媒體生成與理解、資訊摘要和動態功能。

這類功能過去需要深厚的領域專業與大量工程投入才能實現。不過，新產品與 SDK 正在降低進入門檻。Angular 非常適合把 AI 整合進你的 Web 應用程式，原因如下：

- Angular 強大的範本 API，能以生成的內容建立動態且組合乾淨的使用者介面
- 以訊號為核心的強健架構，專為動態管理資料與狀態而設計
- Angular 能與 AI SDK 和 API 無縫整合

本指南示範如何使用 [Genkit](/ai#build-ai-powered-applications-with-genkit-and-angular)、[Firebase AI Logic](/ai#build-ai-powered-applications-with-firebase-ai-logic-and-angular) 與 [Gemini API](/ai#build-ai-powered-applications-with-gemini-api-and-angular)，今天就為你的 Angular 應用程式注入 AI。本指南會說明如何開始把 AI 整合進 Angular 應用程式，帶你踏上 AI 驅動的 Web 應用程式開發之旅。本指南也分享了入門套件、範例程式碼與常見工作流程的配方等資源，幫助你快速上手。

開始之前，你應該對 Angular 有基本的了解。剛接觸 Angular 嗎？可以試試我們的[核心概念指南](/essentials)或[入門教學](/tutorials)。

NOTE: 本頁雖然以 Google AI 產品的整合與範例為主，但 Genkit 這類工具與模型無關，你可以自行選擇模型。在許多情況下，這些範例與程式碼片段同樣適用於其他第三方解決方案。

## 開始使用

建置 AI 驅動的應用程式是一個全新且快速發展的領域。要決定從何開始、選用哪些技術，可能並不容易。以下章節提供三個選項供你選擇：

1. _Genkit_ 讓你透過[統一的 API](https://genkit.dev) 自行選擇支援的模型與介面，來建置全端應用程式。適合需要精緻後端 AI 邏輯的應用程式，例如個人化推薦。

1. _Firebase AI Logic_ 提供安全的用戶端 API 來使用 Google 的模型，適合建置純用戶端應用程式或行動應用程式。最適合直接在瀏覽器中運作的互動式 AI 功能，例如即時文字分析或基本聊天機器人。

1. _Gemini API_ 讓你建置直接使用該 API 介面所公開的方法與功能的應用程式，最適合全端應用程式。適合需要直接控制 AI 模型的應用程式，例如自訂圖片生成或深度資料處理。

### 以 Genkit 與 Angular 建置 AI 驅動的應用程式 {#build-ai-powered-applications-with-genkit-and-angular}

[Genkit](https://genkit.dev) 是一套開源工具組，旨在協助你在 Web 與行動應用程式中建置 AI 驅動的功能。它提供統一的介面，可整合來自 Google、OpenAI、Anthropic、Ollama 等來源的 AI 模型，讓你探索並選擇最符合需求的模型。作為伺服器端解決方案，你的 Web 應用程式需要受支援的伺服器環境才能整合 Genkit，例如以 Node 為基礎的伺服器。舉例來說，以 Angular SSR 建置全端應用程式，就能取得起始的伺服器端程式碼。

以下是使用 Genkit 與 Angular 建置的範例：

- [Agentic Apps with Genkit and Angular starter-kit](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit) — 剛開始用 AI 建置嗎？從這個具備代理式工作流程的基本應用程式開始。這裡是你第一次 AI 建置體驗的完美起點。

- [Use Genkit in an Angular app](https://genkit.dev/docs/angular/) — 建置一個使用 Genkit Flows、Angular 與 Gemini 2.5 Flash 的基本應用程式。這份逐步解說會引導你建立具備 AI 功能的全端 Angular 應用程式。

- [Dynamic Story Generator app](https://github.com/angular/examples/tree/main/genkit-angular-story-generator) — 學習建置一個由 Genkit、Gemini 與 Imagen 3 驅動的代理式 Angular 應用程式，依使用者互動動態生成故事，並有精美的圖片面板搭配故事事件。如果你想嘗試更進階的使用情境，就從這裡開始。

  這個範例也有深入解說功能的影片導覽：
  - [Watch "Building Agentic Apps with Angular and Genkit live!"](https://youtube.com/live/mx7yZoIa2n4?feature=share)
  - [Watch "Building Agentic Apps with Angular and Genkit live! PT 2"](https://youtube.com/live/YR6LN5_o3B0?feature=share)

- [Building Agentic apps with Firebase and Google Cloud (Barista Example)](https://developers.google.com/solutions/learn/agentic-barista) - 學習如何用 Firebase 與 Google Cloud 建置代理式咖啡訂購應用程式。這個範例同時使用 Firebase AI Logic 與 Genkit。

- [Creating Dynamic, Server-Driven UIs](https://github.com/angular/examples/tree/main/dynamic-sdui-app) - 學習建置代理式 Angular 應用程式，其使用者介面檢視會在執行階段依使用者輸入即時生成。

  這個範例也有深入解說功能的影片導覽：
  - [Watch "Exploring the future of web apps"](https://www.youtube.com/live/4qargCqOu70?feature=share)

### 以 Firebase AI Logic 與 Angular 建置 AI 驅動的應用程式 {#build-ai-powered-applications-with-firebase-ai-logic-and-angular}

[Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase) 提供安全的方式，讓你直接從 Web 與行動應用程式與 Vertex AI Gemini API 或 Imagen API 互動。對 Angular 開發者來說很有吸引力，因為應用程式可以是全端，也可以是純用戶端。如果你開發的是純用戶端應用程式，Firebase AI Logic 很適合把 AI 納入你的 Web 應用程式。

以下是使用 Firebase AI Logic 與 Angular 建置的範例：

- [Firebase AI Logic x Angular Starter Kit](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example) - 使用這個入門套件，建置一個具備可執行任務的聊天代理的電子商務應用程式。如果你還沒有使用 Firebase AI Logic 與 Angular 的經驗，就從這裡開始。

  這個範例包含一段[深入解說功能的影片導覽，並示範如何新增功能](https://youtube.com/live/4vfDz2al_BI)。

### 以 Gemini API 與 Angular 建置 AI 驅動的應用程式 {#build-ai-powered-applications-with-gemini-api-and-angular}

[Gemini API](https://ai.google.dev/gemini-api/docs) 提供 Google 最先進的模型，支援音訊、圖片、影片與文字輸入。這些模型針對特定使用情境最佳化，[可至 Gemini API 文件網站了解更多](https://ai.google.dev/gemini-api/docs/models)。

- [AI Text Editor Angular app template](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - 使用這個範本，從一個功能完整的文字編輯器開始，具備潤飾文字、擴寫文字與將文字改為正式語氣等 AI 驅動功能。這是透過 HTTP 呼叫 Gemini API 的良好起點，能累積相關經驗。

- [AI Chatbot app template](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - 這個範本從一個聊天機器人使用者介面開始，透過 HTTP 與 Gemini API 通訊。

## 最佳實踐

### 連接模型供應商並保護你的 API 憑證

連接模型供應商時，務必妥善保護你的 API 機密。_絕不要把 API 金鑰放在會隨程式出貨到用戶端的檔案中，例如 `environments.ts`_。

你的應用程式架構決定了該選用哪些 AI API 與工具。具體而言，應依應用程式是用戶端還是伺服器端來選擇。像 Firebase AI Logic 這類工具，為用戶端程式碼提供與模型 API 的安全連線。如果你想使用 Firebase AI Logic 以外的 API，或偏好使用不同的模型供應商，可以考慮建立 proxy-server，甚至使用 [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) 作為代理，避免暴露你的 API 金鑰。

如需用戶端應用程式的連線範例，請參考程式碼：[Firebase AI Logic Angular example repository](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example)。

對於需要 API 金鑰的伺服器端模型 API 連線，建議使用機密管理工具或環境變數，而不是 `environments.ts`。你應該遵循保護 API 金鑰與憑證的標準最佳實踐。Firebase 現在隨 Firebase App Hosting 的最新更新提供新的機密管理工具。若要了解更多，[請查看官方文件](https://firebase.google.com/docs/app-hosting/configure)。

如需全端應用程式中的伺服器端連線範例，請參考程式碼：[Angular AI Example (Genkit and Angular Story Generator) repository](https://github.com/angular/examples/tree/main/genkit-angular-story-generator)。

### 使用工具呼叫強化應用程式

如果你想建置代理式工作流程，讓代理能依提示詞採取行動並使用工具解決問題，請使用「工具呼叫」。工具呼叫又稱函式呼叫，是一種讓 LLM 能向呼叫它的應用程式發出請求的機制。作為開發者，你定義有哪些工具可用，並掌控工具如何被呼叫、何時被呼叫。

工具呼叫讓你的 Web 應用程式不再只是問答式的聊天機器人，進一步擴展 AI 整合的程度。事實上，你可以讓模型透過模型供應商的函式呼叫 API 請求呼叫函式。可用的工具能在你的應用程式情境中執行更複雜的動作。

在 [Angular 範例儲存庫](https://github.com/angular/examples) 的[電子商務範例](https://github.com/angular/examples/blob/main/vertex-ai-firebase-angular-example/src/app/ai.service.ts#L88)中，LLM 會請求呼叫庫存相關的函式，以取得執行更複雜任務所需的上下文，例如計算商店中一組商品的總價。可用 API 的範圍由你這位開發者決定，是否呼叫 LLM 請求的函式也一樣。執行流程始終由你掌控。舉例來說，你可以公開某個服務的特定函式，但不公開該服務的全部函式。

### 處理非確定性回應

由於模型可能回傳非確定性的結果，你的應用程式設計應將這一點納入考量。以下是在應用程式實作中可以採用的幾種策略：

- 調整提示詞與模型參數（例如 [temperature](https://ai.google.dev/gemini-api/docs/prompting-strategies)），讓回應更確定或更不確定。你可以[在提示詞策略章節了解更多](https://ai.google.dev/gemini-api/docs/prompting-strategies)，該章節位於 [ai.google.dev](https://ai.google.dev/)。
- 採用「人在迴路中」策略，由真人在工作流程繼續之前驗證輸出。設計你的應用程式工作流程，讓操作者（真人或其他模型）能驗證輸出並確認關鍵決策。
- 運用工具（或函式）呼叫與結構定義限制，引導並將模型回應限制在預先定義的格式，提高回應的可預測性。

即使考量了這些策略與技巧，應用程式設計仍應納入合理的備援機制，並遵循既有的應用程式韌性標準。舉例來說，資源或 API 無法使用時，應用程式當機是不可接受的。在這種情境下，應向使用者顯示錯誤訊息，如有需要，也顯示後續步驟的選項。建置 AI 驅動的應用程式也需要同樣的考量。請確認回應符合預期輸出，若不符合，則透過[優雅降級](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation)提供「安全著陸」。這同樣適用於 LLM 供應商的 API 中斷。

請看這個範例：LLM 供應商沒有回應。處理中斷的一種潛在策略是：

- 儲存使用者的回應，以便在重試情境中使用（立即或稍後）
- 以適當的訊息提醒使用者發生中斷，且不洩漏敏感資訊
- 待服務恢復可用後，在稍後恢復對話。

## 後續步驟

若要了解 LLM 提示詞與 AI IDE 設定，請參考以下指南：

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="LLM 提示詞與 IDE 設定"/>
</docs-pill-row>
