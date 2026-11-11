# 遷移

了解如何把你現有的 Angular 專案，漸進式地遷移到最新功能。

<docs-card-container>
  <docs-card title="獨立元件" link="立即遷移" href="reference/migrations/standalone">
    獨立元件提供了一種更簡化的方式來建立 Angular 應用程式。獨立元件直接指定自己的依賴，而不是透過 NgModules 取得。
  </docs-card>
  <docs-card title="控制流程語法" link="立即遷移" href="reference/migrations/control-flow">
    內建的控制流程語法讓你能使用更符合人體工學、接近 JavaScript 的語法，並有更好的型別檢查。它取代了匯入 `CommonModule` 來使用 `*ngFor`、`*ngIf` 與 `*ngSwitch` 等功能的需求。
  </docs-card>
  <docs-card title="inject() 函式" link="立即遷移" href="reference/migrations/inject-function">
    與建構函式注入相比，Angular 的 `inject` 函式能提供更精確的型別，也與標準裝飾器有更好的相容性。
  </docs-card>
  <docs-card title="延遲載入路由" link="立即遷移" href="reference/migrations/route-lazy-loading">
    把急切載入的元件路由轉換為延遲載入的路由。這能讓建置流程把正式環境的 bundle 拆成更小的區塊，在頁面初次載入時載入更少的 JavaScript。
  </docs-card>
</docs-card-container>
