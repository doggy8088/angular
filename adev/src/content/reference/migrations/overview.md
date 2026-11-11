# 遷移

了解如何把你現有的 Angular 專案，漸進式地遷移到最新功能。

<docs-card-container>
  <docs-card title="獨立元件" link="立即遷移" href="reference/migrations/standalone">
    獨立元件提供了一種更簡化的方式來建立 Angular 應用程式。獨立元件直接指定自己的依賴，而不是透過 NgModules 取得。
    
    獨立元件、指令與管道旨在減少對 NgModules 的需求，簡化撰寫體驗。
  </docs-card>
  <docs-card title="`ModuleWithProviders`" link="立即遷移" href="reference/migrations/module-with-providers">
    ModuleWithProviders 自 Angular 第 7 版起即為可選。但有了 Ivy，metadata.json 中的中繼資料不再是必需的，Ivy 改為依賴 ModuleWithProviders 的泛型型別來取得正確的型別資訊。 
   
    Angular 第 9 版棄用未帶泛型型別的 ModuleWithProviders。未來版本將移除預設的泛型型別，使明確指定型別成為必要。
  </docs-card>
  <docs-card title="型別化表單" link="立即遷移" href="reference/migrations/typed-forms">
    在先前的 Angular 版本中，大多數表單 API 的型別中都包含 `any`，與控制項的結構或值本身的互動並不具備型別安全性。

    嚴格型別化的反應式表單加入了型別安全性，這些型別也帶來了各種其他改進，例如 IDE 中更好的自動完成，以及明確指定表單結構的方式。
  </docs-card>
    <docs-card title="控制流程語法" link="立即遷移" href="reference/migrations/control-flow">
    控制流程語法隨 Angular 17 發布提供，讓你能使用更符合人體工學、接近 JavaScript 的語法，具備更好的型別檢查，並能延遲載入元件的一部分。它取代了匯入 CommonModule 來使用 *ngFor、`*ngIf 等功能的需求。 
  </docs-card>
</docs-card-container>
