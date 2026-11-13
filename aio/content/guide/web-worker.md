# 使用 web worker 進行背景處理

[Web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 讓你能在背景執行緒中執行 CPU 密集的運算，
釋放主執行緒來更新使用者介面。
如果你發現你的應用程式會執行大量運算，例如產生電腦輔助設計（CAD）圖面或進行繁重的幾何計算，使用 web worker 可以協助提升你的應用程式效能。

<div class="alert is-helpful">

CLI 不支援在 web worker 中執行 Angular 本身。

</div>

## 新增 web worker

若要將 web worker 加入現有專案，請使用 Angular CLI 的 `ng generate` 指令。

`ng generate web-worker` *location*

你可以在應用程式的任何位置新增 web worker。
例如，若要將 web worker 加入根元件 `src/app/app.component.ts`，請執行下列指令。

`ng generate web-worker app`

此指令會執行下列動作。

- 將你的專案設定為使用 web worker（如果尚未設定的話）。
- 將下列鷹架程式碼加入 `src/app/app.worker.ts`，用來接收訊息。

  <code-example language="typescript" header="src/app/app.worker.ts">
  addEventListener('message', ({ data }) => {
    const response = `worker response to ${data}`;
    postMessage(response);
  });
 </code-example>

- 將下列鷹架程式碼加入 `src/app/app.component.ts`，用來使用 worker。

  <code-example language="typescript" header="src/app/app.component.ts">
  if (typeof Worker !== 'undefined') {
    // Create a new
    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  } else {
    // Web workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
  }
  </code-example>

產生這個初始鷹架後，你必須重構你的程式碼，透過與 worker 互相傳送訊息來使用 web worker。

<div class="alert is-important">

某些環境或平台，例如用於[伺服器端渲染](guide/universal)的 `@angular/platform-server`，不支援 web worker。為確保你的應用程式能在這些環境中運作，你必須提供備援機制，來執行 worker 原本會執行的運算。

</div>
