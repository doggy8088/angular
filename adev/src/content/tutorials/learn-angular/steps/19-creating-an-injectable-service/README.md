# 建立可注入服務

Angular 中的相依性注入 (DI) 是該框架最強大的功能之一。考慮相依性注入為 Angular 在執行期間為您的應用程式提供您需要的資源的能力。依賴關係可以是服務或其他一些資源。

您可以在 [Angular 文件中深入了解相依性注入](guide/di)。現在，您將練習建立 `injectable` 資源。

在這個活動中，您將學習如何建立可注入服務。

<hr>

一種使用服務的方式是作為與資料和 API 互動的一種方法。為了讓服務可重複使用，您應該將邏輯保留在服務中，並在需要時在整個應用程式中分享它。

要讓服務符合 DI 系統的注入資格，請使用 `@Injectable` 裝飾器。例如：

<docs-code language="ts" highlight="[1, 2, 3]">
@Injectable({
    providedIn: 'root'
})
class UserService {
    // methods to retrieve and return data
}
</docs-code>

`@Injectable` 裝飾器會通知 DI 系統 `UserService` 可以被要求在一個類別中。`providedIn` 設定這個資源可用的範圍。現在，只要理解 `providedIn: 'root'` 表示 `UserService` 可用於整個應用程式就夠了。

好的，你試試看：

<docs-workflow>

<docs-step title="加入 `@Injectable` 裝飾器">
透過加入 `@Injectable` 裝飾器來更新 `car.service.ts` 中的程式碼。
</docs-step>

<docs-step title="設定裝飾器">
傳遞給裝飾器的物件中的值被視為裝飾器的設定。
<br>
更新 `car.service.ts` 中的 `@Injectable` 裝飾器，以包含 `providedIn: 'root'` 的設定。

提示：使用以上範例來找到正確語法。

</docs-step>

</docs-workflow>

做得好 👍 該服務現在可 `注入` 並參與其中。現在服務可 `注入`，讓我們嘗試將它注入元件 👉
