# 使用 Web 工作執行緒的背景處理作業

[Web 工作者](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 讓您在背景執行緒中執行大量使用 CPU 的運算，釋放主執行緒以更新使用者介面。
執行大量運算的應用程式，例如產生電腦輔助設計 (CAD) 圖面或執行繁重的幾何運算，可以使用 Web 工作者來提高效能。

HELPFUL: Angular CLI 不支援在網頁工作執行緒中執行。

## 添加 web worker

若要將 Web 工作者新增到現有專案，請使用 Angular CLI `ng generate` 指令。

<docs-code language="shell">

ng generate web-worker &lt;location&gt;

</docs-code>

您可以在應用程式中的任何位置新增網頁工作執行緒。
例如，若要將網頁工作執行緒新增至根元件 `src/app/app.component.ts`，請執行以下指令。

<docs-code language="shell">

ng generate web-worker app

</docs-code>

該指令執行下列動作。

1. 如果尚未設定，請將專案設定為使用網路工作執行緒。
2. 將下列架構程式碼加入 `src/app/app.worker.ts` 以接收訊息。

    <docs-code language="typescript" header="src/app/app.worker.ts">

    addEventListener('message', ({ data }) =&gt; {
      const response = `worker response to &dollar;{data}`;
      postMessage(response);
    });

    </docs-code>

3. 將下列架構程式碼加入 `src/app/app.component.ts` 以使用工作執行緒。

    <docs-code language="typescript" header="src/app/app.component.ts">

    if (typeof Worker !== 'undefined') {
      // 建立新的
      const worker = new Worker(new URL('./app.worker', import.meta.url));
      worker.onmessage = ({ data }) =&gt; {
        console.log(`page got message: &dollar;{data}`);
      };
      worker.postMessage('hello');
    } else {
      // 此環境不支援網路工作執行緒。
      // 您應該加入備援方案，讓您的程式依然能夠正確執行。
    }

    </docs-code>

在您建立這個初始架構後，您必須重構您的程式碼以使用 Web 工作者，方法是傳送訊息到工作者及從工作者傳送訊息。

IMPORTANT: 有些環境或平台，例如在 [伺服器端渲染](guide/ssr) 中使用的 `@angular/platform-server`，不支援網頁工作執行緒。

為了確保你的應用程式在這些環境中運作，你必須提供一個後備機制來執行工作線程原本會執行的運算。

