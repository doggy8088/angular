# HTTP - 追蹤並顯示請求進度

有時候應用程式會傳輸大量資料，而且這些傳輸可能需要很長的時間。檔案上傳就是典型的例子。透過提供這類傳輸的進度回饋，你可以帶給使用者更好的體驗。

## 發出請求

若要發出啟用進度事件的請求，請建立一個 `HttpRequest` 執行個體，並將 `reportProgress` 選項設為 true，以啟用進度事件的追蹤。

<code-example header="app/uploader/uploader.service.ts (upload request)" path="http/src/app/uploader/uploader.service.ts" region="upload-request"></code-example>

<div class="alert is-important">

**提示**：<br />
每個進度事件都會觸發變更偵測，因此只有在你需要在 UI 中回報進度時才開啟它們。

使用 `HttpClient.request()` 搭配 HTTP 方法時，請將該方法設定為 `observe: 'events'`，以查看所有事件，包括傳輸進度。

</div>

## 追蹤請求進度

接著，將這個請求物件傳給 `HttpClient.request()` 方法，它會回傳一個 `HttpEvents` 的 `Observable`（也就是 [攔截器](guide/http-intercept-requests-and-responses#interceptor-events)所處理的那些事件）。

<code-example header="app/uploader/uploader.service.ts (upload body)" path="http/src/app/uploader/uploader.service.ts" region="upload-body"></code-example>

`getEventMessage` 方法會解讀事件串流中每一種 `HttpEvent`。

<code-example header="app/uploader/uploader.service.ts (getEventMessage)" path="http/src/app/uploader/uploader.service.ts" region="getEventMessage"></code-example>

<div class="alert is-helpful">

本指南的範例應用程式沒有接受上傳檔案的伺服器。
`app/http-interceptors/upload-interceptor.ts` 中的 `UploadInterceptor` 會攔截上傳請求並將其短路，方法是回傳一個由模擬事件組成的 observable。

</div>

@reviewed 2023-02-27
