# 元件進階設定

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先閱讀該指南。

## ChangeDetectionStrategy

`@Component` 裝飾器接受 `changeDetection` 選項，用來控制元件的**變更偵測模式**。變更偵測模式有兩個選項。

**`ChangeDetectionStrategy.Eager`/`Default`** 是選擇性使用的模式。在此模式下，只要全應用程式範圍內可能發生任何活動，Angular 就會檢查元件的 DOM 是否需要更新。會觸發這項檢查的活動包括使用者互動、網路回應、計時器等。

**`ChangeDetectionStrategy.OnPush`** 是預設策略（自 v22 起）。此模式可減少 Angular 需要執行的檢查量。在此模式下，框架只在下列情況才檢查元件的 DOM 是否需要更新：

- 元件輸入因範本中的繫結而變更，或
- 此元件中的事件監聽器執行
- 元件被明確標記為需要檢查，透過 `ChangeDetectorRef.markForCheck`，或透過包裝它的方法，例如 `AsyncPipe`。

此外，當 OnPush 元件被檢查時，Angular 也會一併檢查它的所有祖先元件，沿著應用程式樹向上遍歷。

## PreserveWhitespaces

Angular 預設會移除並收合範本中多餘的空白，最常見的是換行與縮排。你可以將元件中繼資料中的 `preserveWhitespaces` 明確設定為 `true`，來變更這項設定。

## 自訂元素結構描述

Angular 預設在遇到未知的 HTML 元素時會擲出錯誤。你可以在元件中繼資料的 `schemas` 屬性中加入 `CUSTOM_ELEMENTS_SCHEMA`，為該元件停用這項行為。

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component />'
})
export class ComponentWithCustomElements { }
```

Angular 也提供 `NO_ERRORS_SCHEMA`，允許任何元素與任何屬性。
