# AI SDK 與訊號 API 的設計模式

與 AI 及大型語言模型（LLM）API 互動會帶來獨特的挑戰，例如管理非同步操作、處理串流資料，以及為可能緩慢或不可靠的網路請求設計反應靈敏的使用者體驗。Angular 的[訊號](guide/signals)與 [`resource`](guide/signals/resource) API 提供了強大的工具，能優雅地解決這些問題。

## 以訊號觸發請求

處理使用者提供的提示詞時，常見的模式是把使用者即時輸入的內容，與觸發 API 呼叫的已提交值分開。

1. 使用者在輸入時，把原始輸入存放在一個訊號中
2. 當使用者提交時（例如點選按鈕），以第一個訊號的內容更新第二個訊號。
3. 在 `resource` 的 **`params`** 欄位中使用第二個訊號。

這樣的設定能確保 resource 的 **`loader`** 函式只在使用者明確提交提示詞時執行，而不是每次按鍵都執行。你可以在 `loader` 欄位中使用額外的訊號參數，例如 `sessionId` 或 `userId`（可用於建立持久的 LLM 工作階段）。如此一來，請求永遠使用這些參數的目前值，而不會重新觸發 `loader` 欄位中定義的非同步函式。

許多 AI SDK 都提供用來呼叫 API 的輔助方法。舉例來說，Genkit 用戶端程式庫公開了 `runFlow` 方法用來呼叫 Genkit flows，你可以從 resource 的 `loader` 中呼叫它。對於其他 API，你可以使用 [`httpResource`](guide/signals/resource#reactive-data-fetching-with-httpresource)。

下列範例示範一個 `resource`，用來擷取 AI 生成故事的部分內容。`loader` 只在 `storyInput` 訊號變更時才觸發。

```ts
// A resource that fetches three parts of an AI generated story
storyResource = resource({
  // The default value to use before the first request or on error
  defaultValue: DEFAULT_STORY,
  // The loader is re-triggered when this signal changes
  params: () => this.storyInput(),
  // The async function to fetch data
  loader: ({params}): Promise<StoryData> => {
    // The params value is the current value of the storyInput signal
    const url = this.endpoint();
    return runFlow({ url, input: {
      userInput: params,
      sessionId: this.storyService.sessionId() // Read from another signal
    }});
  }
});
```

## 為範本準備 LLM 資料

你可以設定 LLM API 回傳結構化資料。將 `resource` 強型別化，使其符合 LLM 預期的輸出，能帶來更好的型別安全性與編輯器自動完成體驗。

若要管理從 resource 衍生的狀態，請使用 `computed` 訊號或 `linkedSignal`。由於 `linkedSignal` [可以存取先前的值](guide/signals/linked-signal)，它能服務多種 AI 相關的使用情境，包括

- 建立聊天記錄
- 在 LLM 生成內容時，保留或自訂範本顯示的資料

在下列範例中，`storyParts` 是一個 `linkedSignal`，會把 `storyResource` 回傳的最新故事片段附加到既有的故事片段陣列後面。

```ts
storyParts = linkedSignal<string[], string[]>({
  // The source signal that triggers the computation
  source: () => this.storyResource.value().storyParts,
  // The computation function
  computation: (newStoryParts, previous) => {
    // Get the previous value of this linkedSignal, or an empty array
    const existingStoryParts = previous?.value || [];
    // Return a new array with the old and new parts
    return [...existingStoryParts, ...newStoryParts];
  }
});
```

## 效能與使用者體驗

LLM API 可能比傳統、較具確定性的 API 更慢，也更容易出錯。你可以運用多項 Angular 功能，建置效能良好且對使用者友善的介面。

- **限定範圍的載入**：把 `resource` 放在直接使用該資料的元件中。這有助於限制變更偵測的週期（尤其在無區域的應用程式中），並避免阻擋應用程式的其他部分。如果資料需要在多個元件間共享，請改由服務提供 `resource`。
- **SSR 與水合（hydration）**：使用伺服器端渲染（SSR）搭配漸進式水合，快速渲染初始頁面內容。你可以先為 AI 生成的內容顯示預留位置，並延遲到元件在用戶端完成水合後才擷取資料。
- **載入狀態**：使用 `resource` 的 `LOADING` [狀態](guide/signals/resource#resource-status) 在請求進行中顯示指示器，例如轉圈動畫。這個狀態同時涵蓋初始載入與重新載入。
- **錯誤處理與重試**：使用 `resource` 的 [**`reload()`**](guide/signals/resource#reloading) 方法，讓使用者能以簡單的方式重試失敗的請求；在仰賴 AI 生成內容時，失敗可能會更常見。

下列範例示範如何建立反應靈敏的使用者介面，動態顯示 AI 生成的圖片，並具備載入與重試功能。

```angular-html
<!-- Display a loading spinner while the LLM generates the image -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
<!-- Dynamically populates the src attribute with the generated image URL -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
<!-- Provides a retry option if the request fails  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
      <p>Failed to load image. Click to retry.</p>
  </div>
}
```

## AI 模式實戰：串流聊天回應

介面經常會在回應資料抵達時，逐步顯示來自 LLM API 的部分結果。Angular 的 resource API 提供串流回應的能力，以支援這類模式。`resource` 的 `stream` 屬性接受一個非同步函式，你可以用它隨著時間對訊號值套用更新。被更新的訊號即代表正在串流的資料。

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Calls a Genkit streaming flow using the streamFlow method
    // exposed by the Genkit client SDK
    const response = streamFlow({
      url: '/streamCharacters',
      input: 10
    });

    (async () => {
      for await (const chunk of response.stream) {
        data.update((prev) => {
          if ('value' in prev) {
            return { value: `${prev.value} ${chunk}` };
          } else {
            return { error: chunk as unknown as Error };
          }
        });
      }
    })();

    return data;
  }
});
```

`characters` 成員會以非同步方式更新，並可顯示在範本中。

```angular-html
@if (characters.isLoading()) {
  <p>Loading...</p>
} @else if (characters.hasValue()) {
  <p>{{characters.value()}}</p>
} @else {
  <p>{{characters.error()}}</p>
}
```

在伺服器端，例如在 `server.ts` 中，定義的端點會把要串流的資料傳送給用戶端。下列程式碼使用搭配 Genkit 框架的 Gemini，但這項技巧同樣適用於其他支援 LLM 串流回應的 API：

```ts
import { startFlowServer } from '@genkit-ai/express';
import { genkit } from "genkit/beta";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

const ai = genkit({ plugins: [googleAI()] });

export const streamCharacters = ai.defineFlow({
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (count, { sendChunk }) => {
    const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    config: {
      temperature: 1,
    },
    prompt: `Generate ${count} different RPG game characters.`,
  });

  (async () => {
    for await (const chunk of stream) {
      sendChunk(chunk.content[0].text!);
    }
  })();

  return (await response).text;
});

startFlowServer({
  flows: [streamCharacters],
});

```
