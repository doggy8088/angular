# `tslib` 直接相依性遷移

## 這個遷移做什麼？

如果你的工作區中有任何函式庫，這個遷移會將函式庫的 `tslib` 同儕相依性轉換為直接相依性。
TypeScript 使用 `tslib` 套件提供編譯後 TypeScript 程式碼中常用的輔助函式。
`tslib` 的版本也會更新到 `2.0.0`，以支援 TypeScript 3.9。

之前：
```json
{
  "name": "my-lib",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^9.0.0",
    "@angular/core": "^9.0.0",
    "tslib": "^1.12.0"
  }
}
```

之後：
```json
{
  "name": "my-lib",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^9.0.0",
    "@angular/core": "^9.0.0"
  },
  "dependencies": {
    "tslib": "^2.0.0"
  }
}
```

## 為什麼需要這個遷移？

[`tslib`](https://github.com/Microsoft/tslib) 是 TypeScript 的執行期函式庫。
這個函式庫的版本與用來編譯函式庫的 TypeScript 編譯器版本綁定。
同儕相依性無法準確表達執行期與編譯器之間的這種關係。
如果 `tslib` 繼續被宣告為函式庫的同儕相依性，某些 Angular 工作區可能會陷入無法同時滿足多個函式庫的 `tslib` 同儕相依性要求的狀態，導致建置期或執行期錯誤。

自 TypeScript 3.9（Angular v10 使用）起，建置新應用程式需要 2.x 版的 `tslib`。
然而，以先前版本 TypeScript 建置且已發佈到 npm 的較舊函式庫，可能需要 `tslib` 1.x。
這個遷移讓依賴不相容版本 `tslib` 執行期函式庫的程式碼能夠保持互通。


## 我的工作區 `package.json` 中仍然需要 `tslib` 作為相依性嗎？

是的。
工作區的 `package.json` 檔案中宣告的 `tslib` 相依性用於建置此工作區內的應用程式，以及執行工作區函式庫的單元測試，是必需的。
