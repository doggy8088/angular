<docs-decorative-header title="Angular 中的相依性注入" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
「DI」是一種設計模式和機制，用於建立和傳送應用程式的部分到需要這些部分的其他應用程式部分。
</docs-decorative-header>

提示：在深入研究本綜合指南之前，請先查看 Angular 的 [基本知識](essentials/sharing-logic)。

當您開發系統較小的部分，例如模組或類別時，您可能需要使用其他類別的功能。例如，您可能需要 HTTP 服務來進行後端呼叫。依賴性注入 (DI) 是一種設計模式和機制，用於建立和傳遞應用程式某些部分給需要它們的應用程式其他部分。Angular 支援這種設計模式，您可以在應用程式中使用它來提高彈性和模組性。

在 Angular 中，相依性通常是服務，但它們也可以是值，例如字串或函數。應用程式的注入器（在啟動期間自動建立）在需要時會使用服務或值的已設定提供者來建立相依性。

## 了解 Angular 相依性注入

<docs-card-container>
  <docs-card title="了解相依性注入" href="/guide/di/dependency-injection">
    了解 Angular 中相依性注入的基本原則。
  </docs-card>
  <docs-card title="建立並注入服務" href="/guide/di/creating-injectable-service">
    說明如何建立服務並將其注入其他服務和元件。
  </docs-card>
  <docs-card title="設定依賴提供者" href="/guide/di/dependency-injection-providers">
    說明如何使用 @Component 和 @NgModule 裝飾器的 providers 欄位設定依賴。另外也說明如何使用 InjectionToken 在 DI 中提供並注入值，當您想要使用非類別的值做為依賴時，這項功能便很有用。
  </docs-card>
    <docs-card title="注入內容" href="/guide/di/dependency-injection-context">
    說明什麼是注入內容，以及如何在需要時使用 DI 系統。
  </docs-card>
  <docs-card title="階層式注入器" href="/guide/di/hierarchical-dependency-injection">
    階層式 DI 讓您僅在需要時才能在應用程式的不同部分之間共用依賴。這是一個進階主題。
  </docs-card>
</docs-card-container>
