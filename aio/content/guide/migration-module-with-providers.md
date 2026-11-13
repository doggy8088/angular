# `ModuleWithProviders` 遷移

## 這支原理圖的作用是什麼？


有些 Angular 函式庫，例如 `@angular/router` 與 `@ngrx/store`，實作了回傳 `ModuleWithProviders` 型別的 API（通常透過名為 `forRoot()` 的方法）。
這個型別表示一個 `NgModule` 以及額外的提供者。
Angular 第 9 版棄用未明確指定泛型型別的 `ModuleWithProviders` 用法，其中的泛型型別指的是該 `NgModule` 的型別。

這支原理圖會為任何缺少泛型的 `ModuleWithProviders` 用法加上泛型型別。
在下面的範例中，`NgModule` 的型別是 `SomeModule`，因此原理圖會將型別改為 `ModuleWithProviders<SomeModule>`。


**之前**
```ts

@NgModule({...})
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

```

**之後**

```ts
@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders<SomeModule> {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config }
      ]
    };
  }
}
```

在極少數情況下，原理圖無法判定 `ModuleWithProviders` 的型別，你可能會看到原理圖印出一個 TODO 註解，提示你手動更新程式碼。


## 為什麼需要這次遷移？

`ModuleWithProviders` 自 Angular 第 7 版起就具有泛型型別，但它一直是可選的。
過去之所以能編譯，是因為 `metadata.json` 檔案包含了所有中繼資料。
有了 Ivy 之後，`metadata.json` 檔案不再是必要的，因此框架不能假設已提供了一個帶有必要型別的檔案。
相反地，Ivy 依賴 `ModuleWithProviders` 的泛型型別來取得正確的型別資訊。

基於這個原因，Angular 第 9 版棄用未帶泛型型別的 `ModuleWithProviders`。
未來版本將移除預設的泛型型別，使明確指定型別成為必要。

## 在應用程式中新增 `ModuleWithProviders` 型別時，應該加上泛型型別嗎？

是的，每當你的程式碼參照 `ModuleWithProviders` 型別時，它都應該帶有一個與實際回傳的 `NgModule` 相符的泛型型別（例如 `ModuleWithProviders<MyModule>`）。


## 如果原理圖印出 TODO 註解，該怎麼做？

如果原理圖無法偵測出 `ModuleWithProviders` 型別的正確泛型，它會印出一個 TODO 註解。
在這種情況下，你需要手動為 `ModuleWithProviders` 加上正確的泛型。它應該與 `ModuleWithProviders` 物件中所回傳的 `NgModule` 型別相符。

## 這對函式庫意味著什麼？

函式庫應該為 `ModuleWithProviders` 型別的任何用法加上泛型型別。


## 使用未遷移程式庫的應用程式該怎麼辦？

[Angular 相容性編譯器](guide/glossary#ngcc)（`ngcc`）應該會自動轉換任何未遷移的程式庫，以產生正確的程式碼。
