# 使用 web worker 進行背景處理

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 讓你能在背景執行緒中執行 CPU 密集的運算，釋放主執行緒來更新使用者介面。
需要進行大量運算的應用程式，例如產生電腦輔助設計（CAD）圖面或進行繁重的幾何計算，可以使用 web worker 來提升效能。

<div class="alert is-helpful">

Angular CLI 不支援在 web worker 中執行它本身。

</div>

## 新增 web worker

若要將 web worker 加入現有專案，請使用 Angular CLI 的 `ng generate` 指令。

<code-example format="shell" language="shell">

ng generate web-worker &lt;location&gt;

</code-example>

你可以在應用程式的任何位置新增 web worker。
例如，若要將 web worker 加入根元件 `src/app/app.component.ts`，請執行下列指令。

<code-example format="shell" language="shell">

ng generate web-worker app

</code-example>

此指令會執行下列動作。

1. 將你的專案設定為使用 web worker（如果尚未設定的話）。
1. 將下列鷹架程式碼加入 `src/app/app.worker.ts`，用來接收訊息。

    <code-example language="typescript" header="src/app/app.worker.ts">

    addEventListener('message', ({ data }) =&gt; {
      const response = `worker response to &dollar;{data}`;
      postMessage(response);
    });

    </code-example>

1. 將下列鷹架程式碼加入 `src/app/app.component.ts`，用來使用 worker。

    <code-example language="typescript" header="src/app/app.component.ts">

    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      worker.onmessage = ({ data }) =&gt; {
        console.log(`page got message: &dollar;{data}`);
      };
      worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }

    </code-example>

建立這個初始鷹架後，你必須重構你的程式碼，透過與 worker 互相傳送訊息來使用 web worker。

<div class="alert is-important">

某些環境或平台，例如用於[伺服器端渲染](guide/universal)的 `@angular/platform-server`，不支援 web worker。
為確保你的應用程式能在這些環境中運作，你必須提供備援機制，來執行 worker 原本會執行的運算。

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
