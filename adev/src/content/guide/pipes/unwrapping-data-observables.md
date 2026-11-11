# 從 observable 解開資料

Observable 讓你能在應用程式的不同部分之間傳遞訊息。
你可以將 observable 用於事件處理、非同步程式設計，以及處理多個值。
Observable 能夠傳遞任何型別的單一或多個值，可以同步傳遞（如同函式將值傳遞給呼叫者），也可以依排程非同步傳遞。

使用內建的 [`AsyncPipe`](api/common/AsyncPipe "API description of AsyncPipe") 接受 observable 作為輸入，並自動訂閱該輸入。
若不使用這個管道，你的元件程式碼就必須自行訂閱 observable 以取用它的值、擷取解析後的值、將這些值公開給繫結使用，並在 observable 被銷毀時取消訂閱，以防止記憶體洩漏。
`AsyncPipe` 是一個管道，能省去你在元件中維護訂閱、並在值到達時持續傳遞這些值的樣板程式碼。

下列程式碼範例使用 `async` 管道，將一個訊息字串的 observable（`message$`）繫結到檢視。

<!-- TODO: Enable preview if this example does not depend on Zone. or if we run the example with Zone. -->
<docs-code header="src/app/hero-async-message.component.ts"
           path="adev/src/content/examples/pipes/src/app/hero-async-message.component.ts" />
