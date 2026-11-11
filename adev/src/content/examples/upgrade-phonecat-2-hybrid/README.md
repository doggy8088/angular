# 這是為了配合我們的樣板專案結構而調整的 Angular Phonecat 應用程式

相較於原版 Phonecat，套用了以下變更：

* 單元測試的 Karma 設定放在 karma.conf.ajs.js，因為樣板的 Karma 設定與 AngularJS 測試需要執行的方式不相容。可以使用 shell script run-unit-tests.sh 來執行單元測試。
* 此外，針對 Karma shim，有一個 `karma-test-shim.1.js` 檔案，雖然沒有被使用，但有出現在測試附錄中。
* 不再使用 Bower，AngularJS 及其相依套件改為在 index.html 與 karma.conf.ajs.js 中從 CDN 取得。
* E2E 測試已移到父目錄，`run-e2e-tests` 可以在那裡找到並執行它們，連同其他所有範例。
* 為了讓儲存庫保持精簡，移除了大部分手機的 JSON 與圖片資料，僅保留足以維持應用程式可測試性的份量。

## 執行應用程式

像任何範例一樣啟動

```shell
npm run start
```

## 執行單元測試

```shell
./run-unit-tests.sh
```

## 執行 E2E 測試

和任何範例一樣（在專案根目錄）：

```shell
gulp run-e2e-tests --filter=phonecat-2
```
