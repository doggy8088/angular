# 透過 Angular CLI 使用 Web Workers

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 讓你能在背景執行緒中執行 CPU 密集的運算，釋放主執行緒來更新使用者介面。

如果你發現你的應用程式在處理資料時變得沒有回應，使用 Web Workers 可以幫上忙。

## 新增 Web Worker

你可以在應用程式的任何位置新增 web worker。如果包含昂貴運算的檔案是 `src/app/app.component.ts`，你可以使用 `ng generate web-worker app` 新增一個 Web Worker。

執行這個指令將會：

- 將你的專案設定為使用 Web Workers（如果尚未設定的話）。
- 新增 `src/app/app.worker.ts`，其中包含用來接收訊息的鷹架程式碼：

  <code-example language="typescript" header="src/app/app.worker.ts">
  addEventListener('message', ({ data }) => {
    const response = `worker response to ${data}`;
    postMessage(response);
  });
 </code-example>

- 在 `src/app/app.component.ts` 中加入鷹架程式碼，以使用這個 worker：

  <code-example language="typescript" header="src/app/app.component.ts">
  if (typeof Worker !== 'undefined') {
    // Create a new
    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  } else {
    // Web Workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
  }
  </code-example>

完成初始鷹架後，你需要重構你的程式碼，透過與 Web Worker 互相傳送訊息來使用它。

## 注意事項

在 Angular 專案中使用 Web Workers 時，有兩件重要的事情要記住：

- 某些環境或平台，例如用於[伺服器端渲染](guide/universal)的 `@angular/platform-server`，不支援 Web Workers。你必須提供備援機制，來執行 worker 原本會執行的運算，以確保你的應用程式能在這些環境中運作。
- 透過 [**@angular/platform-webworker**](api/platform-webworker) 在 Web Worker 中執行 Angular 本身，Angular CLI 尚未支援。
