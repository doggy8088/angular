# 建立可注入的服務

Angular 中的依賴注入（DI）是這個框架最強大的功能之一。你可以把依賴注入視為 Angular 在執行階段提供應用程式所需要資源的能力。依賴可以是一個服務，或是其他資源。

你可以在 [Angular 文件](guide/di) 中進一步了解依賴注入。現在，你將練習建立 `injectable` 資源。

在這個練習中，你將學習如何建立 injectable 服務。

<hr>

使用服務的一種方式，是讓它作為與資料和 API 互動的管道。要讓服務能重複使用，你應該把邏輯保留在服務中，並在應用程式需要時共享它。

要讓服務有資格被 DI 系統注入，請使用 `@Injectable` 裝飾器。例如：

<docs-code language="ts" highlight="[1, 2, 3]">
@Injectable({
    providedIn: 'root'
})
class UserService {
    // methods to retrieve and return data
}
</docs-code>

`@Injectable` 裝飾器通知 DI 系統，`UserService` 可供在類別中請求使用。`providedIn` 設定此資源可用的範圍。目前只要先理解 `providedIn: 'root'` 代表 `UserService` 可供整個應用程式使用即可。

好了，換你來試試看：

<docs-workflow>

<docs-step title="加上 `@Injectable` 裝飾器">
更新 `car.service.ts` 中的程式碼，加上 `@Injectable` 裝飾器。
</docs-step>

<docs-step title="設定裝飾器">
傳入裝飾器的物件中的值，就是這個裝飾器的組態。
<br>
更新 `car.service.ts` 中的 `@Injectable` 裝飾器，加入 `providedIn: 'root'` 的組態。

Tip: 參照上面的範例，找出正確的語法。

</docs-step>

</docs-workflow>

做得好 👍 這個服務現在是 `injectable` 了，可以一起參與運作。既然服務已經是 `injectable`，我們來試著把它注入到元件中 👉
