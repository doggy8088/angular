# `ModuleWithProviders` 遷移

## 這個示意圖的作用是什麼？

某些 Angular 函式庫，例如 `@angular/router` 和 `@ngrx/store`，會實作回傳稱為 `ModuleWithProviders` 類型的 API（通常透過名為 `forRoot()` 的方法）。
此類型代表 `NgModule` 以及其他提供者。
Angular 版本 9 不建議使用沒有明確泛型類型的 `ModuleWithProviders`，其中泛型類型是指 `NgModule` 的類型。

這個範例將會在任何缺少泛型的 `ModuleWithProviders` 用法中新增一個泛型類型。
在以下範例中，`NgModule` 的類型是 `SomeModule`，因此範例將類型變更為 `ModuleWithProviders<SomeModule>`。

### 在之前

<docs-code language="typescript">

&commat;NgModule({&hellip;})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config}
      ]
    };
  }
}

</docs-code>

### After

<docs-code language="typescript">

&commat;NgModule({&hellip;})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders&lt;SomeModule&gt; {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config }
      ]
    };
  }
}

</docs-code>

在罕見的情況下，如果示意圖無法判斷 `ModuleWithProviders` 的類型，您可能會看到示意圖列印 TODO 註解以手動更新程式碼。

## 為什麼需要進行這個遷移？

`ModuleWithProviders` 自 Angular 版本 7 起就具有通用類型，但一直以來都是選用的。
這是因為 `metadata.json` 檔案包含所有元資料，所以可以編譯。
在 Ivy 中，`metadata.json` 檔案不再是必需的，因此框架無法假設已提供具有必要類型的一個檔案。
相反，Ivy 依賴 `ModuleWithProviders` 的通用類型以取得正確的類型資訊。

有鑑於此，Angular 版本 9 不建議使用沒有通用類型的 `ModuleWithProviders`。
未來版本的 Angular 將移除預設的通用類型，改為需要明確的類型。

## 當我在應用程式新增新的 `ModuleWithProviders` 時，我是否應該新增泛型類型？

是，任何時候您的程式碼參照 `ModuleWithProviders` 類型，它都應具備與實際回傳的 `NgModule` 相符的通用類型 (例如，`ModuleWithProviders<MyModule>`)。

## 若圖紙印出 TODO 註解，我該怎麼辦？

如果無法偵測到正確的 `ModuleWithProviders` 類型的泛型，架構圖會列印 TODO 註解。
在這種情況下，您需要手動將正確的泛型新增至 `ModuleWithProviders`。
它應該與 `ModuleWithProviders` 物件中所傳回的 `NgModule` 類型相符。

## 這對圖書館意味著什麼？

庫應將通用類型新增至任何 `ModuleWithProviders` 類型的用法。

