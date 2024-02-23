# 進階元件配置

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

## ChangeDetectionStrategy

`@Component` 裝飾器接受控制元件 **變更偵測模式** 的 `changeDetection` 選項。有兩種變更偵測模式選項。

**`ChangeDetectionStrategy.Default`** 是預設策略，這一點毫不令人意外。
在此模式中，Angular 檢查元件的 DOM 是否需要更新，只要任何活動可能已經在全應用程式範圍內發生。
觸發此檢查的活動包括使用者互動、網路回應、計時器等等。

**`ChangeDetectionStrategy.OnPush`** 是一種可減少 Angular 需要執行的檢查數量的選用模式。在此模式中，框架僅在以下情況檢查元件的 DOM 是否需要更新：

- 組件輸入已因範本中的繫結而變更，或
- 此組件中的事件監聽器正在執行
- 組件明確標記為檢查，透過 `ChangeDetectorRef.markForCheck` 或包裝它的某些內容，例如 `AsyncPipe`。

此外，當檢查 OnPush 元件時，Angular _也_ 會檢查其所有祖先元件，從應用程式樹向上遞迴。

## PreserveWhitespace

預設情況下，Angular 會移除並摺疊範本中的多餘空白，通常來自換行符號和縮排。您可以透過在元件的元資料中明確設定 `preserveWhitespace` 為 false 來變更此設定。

## 自訂元素綱要

預設情況下，Angular 在遇到未知 HTML 元素時會擲回錯誤。您可以透過在元件的 `schemas` 屬性中包含 `CUSTOM_ELEMENTS_SCHEMA` 來停用元件的此行為。

```ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component></some-unknown-component>'
})
export class ComponentWithCustomElements { }
```

Angular 目前不支援其他任何架構。

