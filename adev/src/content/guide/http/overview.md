# 了解如何透過 HTTP 與後端服務通訊

大多數前端應用程式都需要透過 HTTP 通訊協定與伺服器通訊，以下載或上傳資料，並存取其他後端服務。Angular 為 Angular 應用程式提供了一套用戶端 HTTP API，也就是位於 `@angular/common/http` 的 `HttpClient` 服務類別。

## HTTP 用戶端服務功能

HTTP 用戶端服務提供下列主要功能：

* 請求[具型別回應值](guide/http/making-requests#fetching-json-data)的能力
* 簡化的[錯誤處理](guide/http/making-requests#handling-request-failure)
* 請求與回應[攔截](guide/http/interceptors)
* 完善的[測試工具](guide/http/testing)

## 接下來

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="設定 HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="發出 HTTP 請求"/>
</docs-pill-row>
