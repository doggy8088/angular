# Angular 中的依賴注入

當你開發系統中較小的部分（例如模組或類別）時，你可能需要使用其他類別的功能。例如，你可能需要一個 HTTP 服務來發出後端呼叫。依賴注入（Dependency Injection，簡稱 DI）是一種設計模式與機制，用於建立應用程式的某些部分，並把它們交付給需要它們的其他部分。Angular 支援這種設計模式，你可以在應用程式中使用它，以提升彈性與模組化程度。

在 Angular 中，依賴通常是服務，但也可以是值，例如字串或函式。應用程式的注入器（在啟動期間自動建立）會在需要時，透過設定好的服務或值的提供者來實例化依賴。

<div class="alert is-helpful">

請參閱 <live-example name="dependency-injection"></live-example>，查看包含本指南程式碼片段的完整範例。

</div>

## 先備知識

你應該大致熟悉 Angular 應用程式，並具備元件、指令與 NgModule 的基礎知識。強烈建議你先完成下列教學：

[Tour of Heroes 應用程式與教學](tutorial)

## 了解 Angular 依賴注入

<div class="card-container">
  <a href="guide/dependency-injection" class="docs-card" title="了解依賴注入">
    <section>了解依賴注入</section>
    <p>了解 Angular 中依賴注入的基本原則。</p>
    <p class="card-footer">了解依賴注入</p>
  </a>
  <a href="guide/creating-injectable-service" class="docs-card" title="建立可注入的服務">
    <section>建立可注入的服務</section>
    <p>說明如何建立服務並將其注入其他服務與元件。</p>
    <p class="card-footer">建立可注入的服務</p>
  </a>
  <a href="guide/dependency-injection-providers" class="docs-card" title="設定依賴提供者">
    <section>設定依賴提供者</section>
    <p>說明如何使用 @Component 與 @NgModule 裝飾器上的 providers 欄位來設定依賴。也說明如何使用 InjectionToken 在 DI 中提供與注入值，當你想使用類別以外的數值作為依賴時，這會很有幫助。</p>
    <p class="card-footer">設定依賴提供者</p>
  </a>
  <a href="guide/hierarchical-dependency-injection" class="docs-card" title="階層式注入器">
    <section>階層式注入器</section>
    <p>階層式 DI 讓你只在需要時，才在應用程式的不同部分之間共用依賴。這是進階主題。</p>
    <p class="card-footer">階層式注入器</p>
  </a>
</div>

@reviewed 2022-08-02
