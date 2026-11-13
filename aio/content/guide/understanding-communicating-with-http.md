# 了解如何透過 HTTP 與後端服務通訊

大多數前端應用程式都需要透過 HTTP 通訊協定與伺服器通訊，以下載或上傳資料，並存取其他後端服務。Angular 為 Angular 應用程式提供了一套用戶端 HTTP API，也就是位於 `@angular/common/http` 的 `HttpClient` 服務類別。

## 先備知識

在使用 `HttpClientModule` 之前，你應該先基本了解下列內容：

*   TypeScript 程式設計
*   HTTP 通訊協定的用法
*   Angular 應用程式設計基礎，詳見[Angular 概念](guide/architecture)
*   Observable 的技術與運算子。
    請參閱 [Observables 指南](guide/observables)。

## HTTP 用戶端服務功能

HTTP 用戶端服務提供下列主要功能：

*   可請求[具型別的回應物件](guide/http-request-data-from-server)
*   簡化的[錯誤處理](guide/http-handle-request-errors)
*   [可測試性](guide/http-test-requests)功能
*   請求與回應的[攔截](guide/http-intercept-requests-and-responses)

## 後續步驟

* [設定伺服器通訊](guide/http-server-communication)

@reviewed 2023-03-14
