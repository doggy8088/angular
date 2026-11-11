<docs-decorative-header title="Angular 中的依賴注入" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
「DI」是一種設計模式與機制，用於建立應用程式的某些部分，並把它們交付給需要它們的其他部分。
</docs-decorative-header>

TIP: 在深入這份完整指南之前，先看看 Angular 的[精華篇](essentials/dependency-injection)。

當你開發系統中較小的部分（例如模組或類別）時，你可能需要使用其他類別的功能。例如，你可能需要一個 HTTP 服務來發出後端呼叫。依賴注入（Dependency Injection，簡稱 DI）是一種設計模式與機制，用於建立應用程式的某些部分，並把它們交付給需要它們的其他部分。Angular 支援這種設計模式，你可以在應用程式中使用它，以提升彈性與模組化程度。

在 Angular 中，依賴通常是服務，但也可以是值，例如字串或函式。應用程式的注入器（在啟動期間自動建立）會在需要時，透過設定好的服務或值的提供者來實例化依賴。

## 了解 Angular 依賴注入 {#learn-about-angular-dependency-injection}

<docs-card-container>
  <docs-card title="理解依賴注入" href="/guide/di/dependency-injection">
    學習 Angular 中依賴注入的基本原則。
  </docs-card>
  <docs-card title="建立與注入服務" href="/guide/di/creating-injectable-service">
    說明如何建立服務，並把它注入其他服務與元件。
  </docs-card>
  <docs-card title="設定依賴提供者" href="/guide/di/dependency-injection-providers">
    說明如何使用 @Component 與 @NgModule 裝飾器上的 providers 欄位來設定依賴。也說明如何使用 InjectionToken 在 DI 中提供與注入值，當你想把類別以外的值作為依賴時，這會很有幫助。
  </docs-card>
    <docs-card title="注入上下文" href="/guide/di/dependency-injection-context">
    說明何謂注入上下文，以及如何在需要的地方使用 DI 系統。
  </docs-card>
  <docs-card title="階層式注入器" href="/guide/di/hierarchical-dependency-injection">
    階層式 DI 讓你只在需要時，才在應用程式的不同部分之間共用依賴。這是進階主題。
  </docs-card>
</docs-card-container>
