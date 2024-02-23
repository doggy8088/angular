# 這是 Angular Phonecat 應用程式，已調整以符合我們的樣板專案

structure.

下列變更套用自 vanilla Phonecat：

* 單元測試的 Karma 配置在 karma.conf.ajs.js 中，因為現成的 Karma 配置與 AngularJS 測試需要執行的程序不兼容。可以使用外殼指令碼 run-unit-tests.sh 來執行單元測試。
* 此外，對於 Karma shim，有一個 `karma-test-shim.1.js` 檔案，它未被使用，但會顯示在測試附錄中。
* 除了使用 Bower 之外，AngularJS 及其依賴項會從 index.html 和 karma.conf.ajs.js 中的 CDN 擷取。
* E2E 測試已移至父目錄，`run-e2e-tests` 可以在那裡偵測並執行這些測試以及所有其他範例。
* 為了降低存放庫的權重，已移除大部分的手機 JSON 和圖像資料。保留足夠資料以維持應用程式的可測試性。

## 執行應用程式

開始像任何範例一樣

```shell
npm run start
```

## 執行單元測試

```shell
./run-unit-tests.sh
```

## 執行 E2E 測試

如同任何範例（在專案根目錄）：

```shell
gulp run-e2e-tests --filter=phonecat-2
```

