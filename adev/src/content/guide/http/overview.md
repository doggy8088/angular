# 了解使用 HTTP 與後端服務通訊

大多數前端應用程式需要透過 HTTP 協定與伺服器進行通訊，以下載或上傳資料，並存取其他後端服務。Angular 為 Angular 應用程式提供了一個用戶端 HTTP API，位於 `@angular/common/http` 中的 `HttpClient` 服務類別。

## HTTP 客戶端服務特色

HTTP 客戶端服務提供以下主要功能：

* 要求 [型別化回應值](guide/http/making-requests#fetching-json-data) 的能力
* 精簡的 [錯誤處理](guide/http/making-requests#handling-request-failure)
* 要求和回應 [攔截](guide/http/interceptors)
* 健全的 [測試工具](guide/http/testing)

## 接下來

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="設定 HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="建立 HTTP 要求"/>
</docs-pill-row>

