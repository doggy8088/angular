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
    與建構函式注入相比，Angular 的 [`inject`](/api/core/inject) 函式能提供更精確的型別，也與標準裝飾器有更好的相容性。
  </docs-card>
  <docs-card title="延遲載入路由" link="立即遷移" href="reference/migrations/route-lazy-loading">
    把急切載入的元件路由轉換為延遲載入的路由。這能讓建置流程把正式環境的 bundle 拆成更小的區塊，在頁面初次載入時載入更少的 JavaScript。
  </docs-card>
  <docs-card title="新的 `input()` API" link="立即遷移" href="reference/migrations/signal-inputs">
    把現有的 `@Input` 欄位轉換為現已可正式使用的新訊號輸入 API。
  </docs-card>
  <docs-card title="新的 `output()` 函式" link="立即遷移" href="reference/migrations/outputs">
    把現有的 `@Output` 自訂事件轉換為現已可正式使用的新 output 函式。
  </docs-card>
  <docs-card title="以訊號表示的查詢" link="立即遷移" href="reference/migrations/signal-queries">
    把現有的裝飾器查詢欄位轉換為改進的訊號查詢 API。此 API 現已可正式使用。
  </docs-card>
  <docs-card title="清理未使用的 imports" link="立即試用" href="reference/migrations/cleanup-unused-imports">
    清理專案中未使用的 imports。
  </docs-card>
  <docs-card title="自閉合標籤" link="立即遷移" href="reference/migrations/self-closing-tags">
    在可行的情況下，把元件範本轉換為使用自閉合標籤。
  </docs-card>
  <docs-card title="NgClass 改為 class 繫結" link="立即遷移" href="reference/migrations/ngclass-to-class">
      在可行的情況下，把元件範本轉換為優先使用 class 繫結，而不是 `NgClass` 指令。
  </docs-card>
  <docs-card title="NgStyle 改為 style 繫結" link="立即遷移" href="reference/migrations/ngstyle-to-style">
      在可行的情況下，把元件範本轉換為優先使用 style 繫結，而不是 `NgStyle` 指令。
  </docs-card>
  <docs-card title="RouterTestingModule 遷移" link="立即遷移" href="reference/migrations/router-testing-module-migration">
    在 TestBed 設定中把 `RouterTestingModule` 的用法轉換為 `RouterModule`，並在適當時機加入 `provideLocationMocks()`。
  </docs-card>
  <docs-card title="CommonModule 改為獨立 imports" link="立即遷移" href="reference/migrations/common-to-standalone">
    在可行的情況下，把對 `CommonModule` 的匯入，換成範本中實際用到的個別指令與管道的匯入。
  </docs-card>
</docs-card-container>
