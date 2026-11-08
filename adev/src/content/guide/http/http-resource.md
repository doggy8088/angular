# 使用 `httpResource` 進行反應式資料擷取

`httpResource` 是包裝在 `HttpClient` 之上的反應式封裝，它把請求狀態與回應以訊號的形式提供給你。因此，你可以把這些訊號搭配 `computed`、`effect`、`linkedSignal` 或其他任何反應式 API 使用。由於它建立在 `HttpClient` 之上，`httpResource` 支援所有相同的功能，例如攔截器。

關於 Angular 的 `resource` 模式，詳情請見[使用 `resource` 的非同步反應式處理](/guide/signals/resource)。

## `使用 httpResource`

TIP: `httpResource` 使用全域可用的 `HttpClient`。只有在需要設定 HTTP 功能（例如攔截器或 XSRF 選項）時，才需要使用 `provideHttpClient(...)`。詳情請見[設定 HttpClient](/guide/http/setup)。

你可以透過回傳一個 url 來定義 HTTP resource：

```ts
userId = input.required<string>();

user = httpResource(() => `/api/user/${userId()}`); // A reactive function as argument
```

`httpResource` 具備反應性，意思是只要它依賴的任一訊號改變（例如 `userId`），resource 就會發出新的 http 請求。
如果已有請求正在進行中，resource 會先取消未完成的請求，再發出新請求。

HELPFUL: `httpResource` 與 `HttpClient` 不同，它會「即刻」發起請求。相較之下，`HttpClient` 要等到傳回的 `Observable` 被訂閱後才會發起請求。

對於較進階的請求，你可以定義一個請求物件，形式與 `HttpClient` 接受的請求類似。
請求物件中需要具備反應性的每個屬性，都應由訊號組成。

```ts
user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,
  mode: 'cors',
  redirect: 'error',
  priority: 'high',
  cache: 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY=',
  referrerPolicy: 'no-referrer',
}));
```

TIP: 避免使用 `httpResource` 進行「變更型」操作，例如 `POST` 或 `PUT`。請改為直接使用底層的 `HttpClient` API。

`httpResource` 的訊號可用於範本中，控制應顯示哪些元素。

```angular-html
@if (user.hasValue()) {
  <user-details [user]="user.value()" />
} @else if (user.error()) {
  <div>Could not load user information</div>
} @else if (user.isLoading()) {
  <div>Loading user info...</div>
}
```

HELPFUL: 在處於錯誤狀態的 `resource` 上讀取 `value` 訊號，會在執行階段擲出錯誤。建議以 `hasValue()` 守衛 `value` 的讀取。

### 回應型別

`httpResource` 預設會將回應以 JSON 回傳並解析。不過，你可以透過 `httpResource` 上的其他函式指定替代的回傳型別：

```ts
httpResource.text(() => ({ … })); // returns a string in value()

httpResource.blob(() => ({ … })); // returns a Blob object in value()

httpResource.arrayBuffer(() => ({ … })); // returns an ArrayBuffer in value()
```

### 追蹤下載進度

在請求物件中設定 `reportProgress: true`，即可追蹤回應的下載進度。最新的 `HttpProgressEvent` 可透過 resource 的 `progress` 訊號取得：

```ts
file = httpResource.blob(() => ({
  url: `/api/files/${fileId()}`,
  reportProgress: true,
}));

downloaded = computed(() => this.file.progress()?.loaded ?? 0);
```

NOTE: `HttpClient` 已將 `reportProgress` 棄用，改推 `reportUploadProgress` 與 `reportDownloadProgress`；但 `httpResource` 不同，它保留了單一的 `reportProgress` 選項，且只啟用下載進度事件。

## 回應解析與驗證

擷取資料時，你可能想用預先定義的結構定義（schema）來驗證回應，常用的熱門開源函式庫有 [Zod](https://zod.dev) 或 [Valibot](https://valibot.dev)。你可以透過指定 `parse` 選項，把這類驗證函式庫整合進 `httpResource`。`parse` 函式的回傳型別，決定了 resource 的 `value` 型別。

下列範例使用 Zod 來解析並驗證來自 [StarWars API](https://swapi.info/) 的回應。resource 的型別隨之與 Zod 解析的輸出型別相同。

```ts
const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({coerce: true}),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});

export class CharacterViewer {
  id = signal(1);

  swPersonResource = httpResource(() => `https://swapi.info/api/people/${this.id()}`, {
    parse: starWarsPersonSchema.parse,
  });
}
```

## 測試 httpResource

由於 `httpResource` 是包裝在 `HttpClient` 之上的封裝，你可以用與 `HttpClient` 完全相同的 API 來測試 `httpResource`。詳情請見 [HttpClient 測試](/guide/http/testing)。

下列範例示範使用 `httpResource` 的程式碼的單元測試。

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClientTesting()],
});

const id = signal(0);
const mockBackend = TestBed.inject(HttpTestingController);
const response = httpResource(() => `/data/${id()}`, {injector: TestBed.inject(Injector)});
TestBed.tick(); // Triggers the effect
const firstRequest = mockBackend.expectOne('/data/0');
firstRequest.flush(0);

// Ensures the values are propagated to the httpResource
await TestBed.inject(ApplicationRef).whenStable();

expect(response.value()).toEqual(0);
```
