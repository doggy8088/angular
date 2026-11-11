# HTTP：設定伺服器通訊

使用 `HttpClient` 之前，你需要匯入 Angular 的 `HttpClientModule`。大多數應用程式會在根 `AppModule` 中這麼做。

<code-example header="app/app.module.ts (excerpt)" path="http/src/app/app.module.ts" region="sketch"></code-example>

接著，你可以將 `HttpClient` 服務當作應用程式類別的相依性注入，如下列 `ConfigService` 範例所示。

<code-example header="app/config/config.service.ts (excerpt)" path="http/src/app/config/config.service.ts" region="proto"></code-example>

`HttpClient` 服務對所有交易都使用 [observable](guide/glossary#可觀察物件（observable） "Observable definition")。
你必須匯入範例程式碼片段中出現的 RxJS observable 與運算子符號。
這些 `ConfigService` 的匯入方式很典型。

<code-example header="app/config/config.service.ts (RxJS imports)" path="http/src/app/config/config.service.ts" region="rxjs-imports"></code-example>

<div class="alert is-helpful">

你可以執行本指南隨附的 <live-example></live-example>。

範例應用程式不需要資料伺服器。
它仰賴 [Angular *in-memory-web-api*](https://github.com/angular/angular/tree/main/packages/misc/angular-in-memory-web-api)，以取代 *HttpClient* 模組的 `HttpBackend`。
這個替代服務會模擬類 REST 後端的行為。

請查看 `AppModule` 的 *imports*，了解它的設定方式。

</div>

@reviewed 2022-11-03
