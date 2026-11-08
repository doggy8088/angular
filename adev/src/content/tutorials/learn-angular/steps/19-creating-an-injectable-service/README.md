# 建立可注入的服務

Angular 中的依賴注入（DI）是這個框架最強大的功能之一。你可以把依賴注入視為 Angular 在執行階段提供應用程式所需要資源的能力。依賴可以是一個服務，或是其他資源。

NOTE: 在[核心概念指南](/essentials/dependency-injection)中進一步了解依賴注入。

在這個練習中，你將學習如何建立 `injectable` 服務。

<hr>

使用服務的一種方式，是讓它作為與資料和 API 互動的管道。要讓服務能重複使用，你應該把邏輯保留在服務中，並在應用程式需要時共享它。

要讓類別有資格被 DI 系統注入，請使用 `@Service` 裝飾器。例如：

```ts {highlight:[1]}
@Service()
class UserService {
  // methods to retrieve and return data
}
```

`@Service` 裝飾器把類別標記為服務，並通知 DI 系統 `UserService` 可以在應用程式的任何地方被存取。Angular 預設會在整個應用程式中提供這個服務，所以你不需要撰寫任何額外的組態。

NOTE: `@Service` 預設在根注入器提供該類別。如果你想手動提供它，例如把它限定在特定路由或元件的範圍內，請設定 `autoProvided: false`。在[建立與使用服務指南](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator)中進一步了解。

好了，換你來試試看：

<docs-workflow>

<docs-step title="加上 `@Service` 裝飾器">
更新 `car.service.ts` 中的程式碼，為 `CarService` 類別加上 `@Service()` 裝飾器。

TIP: 參照上面的範例，找出正確的語法。

</docs-step>

</docs-workflow>

做得好 👍 這個服務現在是 `injectable` 了，可以一起參與運作。既然服務已經是 `injectable`，我們來試著把它注入到元件中 👉
