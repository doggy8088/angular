# 從可觀察物件中解除包裝數據

可觀察物件讓您在應用程式的各個部分之間傳遞訊息。
您可以使用可觀察物件來進行事件處理、非同步程式設計和處理多個值。
可觀察物件可以傳遞任何類型的單個或多個值，無論是同步地（如同函式將值傳遞給其呼叫者）或非同步地排程。

使用內建的 [`AsyncPipe`](api/common/AsyncPipe "AsyncPipe 的 API 說明") 將可觀察物件作為輸入並自動訂閱輸入。
沒有這條管線，您的元件程式碼必須訂閱可觀察物件才能使用其值、擷取已解析的值、公開這些值以進行繫結，以及在可觀察物件被銷毀時取消訂閱，以防止記憶體外洩。
`AsyncPipe` 是元件中的管線，可儲存樣板程式碼，以維護訂閱並在可觀察物件到達時持續傳送其值。

以下程式碼範例會將訊息字串 (`message$`) 的可觀察繫結到使用 `async` 管道的檢視。

<!-- TODO: 啟用預覽，如果這個範例不依賴 Zone/，或者如果我們使用 Zone 執行範例。 -->

<docs-code header="src/app/hero-async-message.component.ts"
           path="adev/src/content/examples/pipes/src/app/hero-async-message.component.ts" />
