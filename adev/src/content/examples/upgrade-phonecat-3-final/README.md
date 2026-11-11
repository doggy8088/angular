# 這是 Angular Phonecat 應用程式，經過調整以符合我們的樣板專案結構。

以下是相對於原版 Phonecat 所套用的變更：

* E2E 測試已移到上層目錄，讓 `run-e2e-tests` 可以發現並執行它們，如同所有其他範例一樣。
* 為了控制 repo 的體積，移除了大部分的手機 JSON 與圖片資料，僅保留足以維持應用程式可測試性的部分。

## 執行應用程式

如同任何範例一樣啟動

```shell
npm run start
```

## 執行 E2E 測試

如同任何範例一樣 \(在專案根目錄\)：

```shell
gulp run-e2e-tests --filter=phonecat-3
```
