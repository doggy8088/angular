# 這是 Angular Phonecat 應用程式，已調整以符合我們的樣板專案

structure.

下列變更套用自 vanilla Phonecat：

* 指南中顯示的 TypeScript 設定檔是 `tsconfig.ajs.json`，而不是預設值，因為我們不希望為遷移啟用 `noImplicitAny`。
* 單元測試的 Karma 設定檔位於 karma.conf.ajs.js 中，因為樣板 Karma 設定檔與 AngularJS 測試需要執行的程式碼不相容。可以使用 shell 腳本 run-unit-tests.sh 來執行單元測試。
* AngularJS 和其相依性不是使用 Bower，而是從 index.html 和 karma.conf.ajs.js 中的 CDN 取得。
* E2E 測試已移至父目錄，在該目錄中，`gulp run-e2e-tests` 可以連同所有其他範例一起找到並執行這些測試。
* 大部分的手機 JSON 和影像資料已移除，以降低存放庫的負擔。保留足夠資料以維持應用程式的可測試性。

## 執行應用程式

開始像任何範例一樣

```shell
npm run start
```

您可以在 /app 路徑下找到該應用程式：

```http
http://localhost:3002/app/index.html
```

## 執行單元測試

```shell
./run-unit-tests.sh
```

## 執行 E2E 測試

如同任何範例（在專案根目錄）：

```shell
gulp run-e2e-tests --filter=phonecat-1
```

