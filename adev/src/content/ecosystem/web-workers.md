# 使用 web worker 進行背景處理

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 讓你能在背景執行緒中執行 CPU 密集的運算，釋放主執行緒來更新使用者介面。
需要進行大量運算的應用程式，例如產生電腦輔助設計（CAD）圖面或進行繁重的幾何計算，可以使用 web worker 來提升效能。

HELPFUL: Angular CLI 不支援在 web worker 中執行它本身。

## 新增 web worker

若要將 web worker 加入現有專案，請使用 Angular CLI 的 `ng generate` 指令。

```shell
ng generate web-worker <location>
```

你可以在應用程式的任何位置新增 web worker。
例如，若要將 web worker 加入根元件 `src/app/app.ts`，請執行下列指令。

```shell
ng generate web-worker app
```

此指令會執行下列動作。

1. 將你的專案設定為使用 web worker（如果尚未設定的話）。
1. 將下列鷹架程式碼加入 `src/app/app.worker.ts`，用來接收訊息。

   ```ts {header:"src/app/app.worker.ts"}
   addEventListener('message', ({data}) => {
     const response = `worker response to ${data}`;
     postMessage(response);
   });
   ```

1. 將下列鷹架程式碼加入 `src/app/app.ts`，用來使用 worker。

   ```ts {header:"src/app/app.ts"}
   if (typeof Worker !== 'undefined') {
     // Create a new
     const worker = new Worker(new URL('./app.worker', import.meta.url));
     worker.onmessage = ({data}) => {
       console.log(`page got message: ${data}`);
     };
     worker.postMessage('hello');
   } else {
     // Web workers are not supported in this environment.
     // You should add a fallback so that your program still executes correctly.
   }
   ```

建立這個初始鷹架後，你必須重構你的程式碼，透過與 worker 互相傳送訊息來使用 web worker。

IMPORTANT: 某些環境或平台不支援 web worker，例如[伺服器端渲染](guide/ssr)所使用的 `@angular/platform-server`。

若要確保你的應用程式能在這些環境中運作，你必須提供備援機制，來執行原本由 worker 執行的運算。
