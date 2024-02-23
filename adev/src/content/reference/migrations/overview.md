# 遷移

了解如何增量地將您現有的 Angular 專案遷移至最新功能。

<docs-card-container>
  <docs-card title="獨立元件" link="立即遷移" href="reference/migrations/standalone">
    獨立元件提供一個簡化的方式來建構 Angular 應用程式。獨立元件直接指定其相依性，而不是透過 NgModules 來取得。

    獨立元件、指令和管線旨在透過減少對 NgModules 的需求來簡化撰寫體驗。
  </docs-card>
  <docs-card title="`ModuleWithProviders`" link="立即遷移" href="reference/migrations/module-with-providers">
    自 Angular 版本 7 開始，ModuleWithProviders 已成為選用項目。但是，使用 Ivy 時，metadata.json 中存在的元資料不再需要，而是由 Ivy 根據 ModuleWithProviders 的一般類型來取得正確的類型資訊。

    Angular 版本 9 不建議使用沒有一般類型的 ModuleWithProviders。未來的 Angular 版本將移除預設的一般類型，使得明確的類型成為必要。
  </docs-card>
  <docs-card title="類型化表單" link="立即遷移" href="reference/migrations/typed-forms">
    在先前的 Angular 版本中，大部分表單 API 的類型中某處都包含 `any`，而與控制項結構或其值本身的互動不是類型安全的。

嚴格類型化的響應式表單新增類型安全性，而這些類型能啟用各種其他改進，例如 IDE 中更好的自動完成功能，以及明確指定表單結構的方式。

</docs-card>
    <docs-card title="控制流程語法" link="立即遷移" href="reference/migrations/control-flow">
    控制流程語法在 Angular 17 版本中提供，可讓您使用更符合人體工學的語法，這種語法接近 javascript，有更好的類型檢查，並可延遲載入元件的一部分。它取代了導入 CommonModule 以使用 *ngFor、*ngIf 等功能的需求。
  </docs-card>
</docs-card-container>
