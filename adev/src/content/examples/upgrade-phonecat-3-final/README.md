# 這是 Angular Phonecat 應用程式，已調整以符合我們的樣板專案

structure.

下列變更套用自 vanilla Phonecat：

* E2E 測試已移至父目錄，在那裡 `run-e2e-tests` 可以發現並執行它們以及所有其他範例。
* 大部分的電話 JSON 和圖像數據已移除，以減輕儲存庫重量。保留足夠的資料以保留應用程式的可測試性。

## 執行應用程式

開始像任何範例一樣

```shell
npm run start
```

## 執行 E2E 測試

如同任何範例（在專案根目錄）：

```shell
gulp run-e2e-tests --filter=phonecat-3
```

