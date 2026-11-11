# 建置 Angular 應用程式

你可以用 `ng build` 指令建置 Angular CLI 應用程式或程式庫。
它會將你的 TypeScript 程式碼編譯成 JavaScript，並視需要對輸出進行最佳化、打包與最小化。

`ng build` 只會執行 `angular.json` 中所指定預設專案的 `build` 目標所對應的建置器。
Angular CLI 內含四個通常用作 `build` 目標的建置器：

| 建置器                                          | 用途                                                                                                                                                                                                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular-devkit/build-angular:browser`         | 使用 [Webpack](https://webpack.js.org/) 將用戶端應用程式打包成可在瀏覽器中使用的 bundle。                                                                                                                                                    |
| `@angular-devkit/build-angular:browser-esbuild` | 使用 [esbuild](https://esbuild.github.io/) 將用戶端應用程式打包成可在瀏覽器中使用的 bundle。更多資訊請參閱 [`browser-esbuild` 文件](tools/cli/build-system-migration#manual-migration-to-the-compatibility-builder)。                          |
| `@angular-devkit/build-angular:application`                    | 使用 [esbuild](https://esbuild.github.io/) 建置應用程式，包含用戶端 bundle、Node 伺服器，以及在建置時預渲染的路由。                                                                                                                           |
| `@angular-devkit/build-angular:ng-packagr`                     | 建置符合 [Angular Package Format](tools/libraries/angular-package-format) 的 Angular 程式庫。                                                                                                                                                  |

`ng new` 產生的應用程式預設使用 `@angular-devkit/build-angular:application`。
`ng generate library` 產生的程式庫預設使用 `@angular-devkit/build-angular:ng-packagr`。

想知道某個專案使用哪個建置器，查閱該專案的 `build` 目標即可。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invokes the Architect target named `build`.
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          …
        },
        "serve": { … }
        "test": { … }
        …
      }
    }
  }
}

</docs-code>

本頁說明 `@angular-devkit/build-angular:application` 的用法與選項。

## 輸出目錄

建置程序的結果會輸出到一個目錄（預設為 `dist/${PROJECT_NAME}`）。

## 設定大小預算 {#configuring-size-budgets}

應用程式的功能越長越大，體積也隨之增長。
CLI 讓你能在設定中訂定大小門檻，確保應用程式的各個部分維持在你定義的大小界限之內。

在 CLI 設定檔 `angular.json` 中，為每個[已設定的環境](tools/cli/environments)加入一段 `budgets` 來定義大小界限。

<docs-code language="json">

{
  …
  "configurations": {
    "production": {
      …
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "250kb",
          "maximumError": "500kb"
        },
      ]
    }
  }
}

</docs-code>

你可以為整個應用程式設定大小預算，也可以針對特定部分設定。
每個預算項目會設定一種指定類型的預算。
大小值可使用下列格式指定：

| 大小值          | 詳細資訊                                                                    |
| :-------------- | :-------------------------------------------------------------------------- |
| `123` or `123b` | 大小，單位為位元組。                                                        |
| `123kb`         | 大小，單位為 KB。                                                           |
| `123mb`         | 大小，單位為 MB。                                                           |
| `12%`           | 相對於基準的大小百分比。\(不適用於基準值本身。\)                            |

設定預算後，當應用程式的某個部分達到或超過你設定的界限大小時，建置器會發出警告或回報錯誤。

每個預算項目都是一個 JSON 物件，具有下列屬性：

| 屬性           | 值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type           | 預算的類型。以下擇一： <table> <thead> <tr> <th> 值 </th> <th> 詳細資訊 </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> 特定 bundle 的大小。 </td> </tr> <tr> <td> <code>initial</code> </td> <td> 啟動應用程式所需的 JavaScript 大小。預設在 500kb 時警告、1mb 時報錯。 </td> </tr> <tr> <td> <code>allScript</code> </td> <td> 所有指令碼的大小。 </td> </tr> <tr> <td> <code>all</code> </td> <td> 整個應用程式的大小。 </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> 任一元件樣式表的大小。預設在 2kb 時警告、4kb 時報錯。 </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> 任一指令碼的大小。 </td> </tr> <tr> <td> <code>any</code> </td> <td> 任一檔案的大小。 </td> </tr> </tbody> </table> |
| name           | 適用於 `type=bundle` 的 bundle 名稱。 |
| baseline       | 用來比較的基準大小。 |
| maximumWarning | 相對於基準的警告上限門檻。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| maximumError   | 相對於基準的錯誤上限門檻。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| minimumWarning | 相對於基準的警告下限門檻。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| minimumError   | 相對於基準的錯誤下限門檻。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| warning        | 相對於基準的警告門檻（下限與上限）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| error          | 相對於基準的錯誤門檻（下限與上限）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## 設定 CommonJS 依賴

在整個應用程式與其依賴中，請一律優先使用原生的 [ECMAScript 模組](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import)（ESM）。
ESM 是完整定義的 Web 標準與 JavaScript 語言功能，並有強大的靜態分析支援。這讓 bundle 最佳化比其他模組格式更有效。

Angular CLI 也支援將 [CommonJS](https://nodejs.org/api/modules.html) 依賴匯入你的專案，並會自動打包這些依賴。
然而，CommonJS 模組可能妨礙打包器與最小化工具有效最佳化這些模組，導致 bundle 體積變大。
更多資訊請參閱[〈CommonJS 如何讓你的 bundle 變大〉](https://web.dev/commonjs-larger-bundles)。

若 Angular CLI 偵測到你的瀏覽器應用程式依賴 CommonJS 模組，會輸出警告。
遇到 CommonJS 依賴時，可以考慮請維護者支援 ECMAScript 模組、自己貢獻該支援，或改用符合需求的替代依賴。
若最佳選擇就是使用 CommonJS 依賴，你可以把 CommonJS 模組名稱加入 `angular.json` 中 `build` 選項的 `allowedCommonJsDependencies` 選項，來關閉這些警告。

<docs-code language="json">

"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},

</docs-code>

## 設定瀏覽器相容性

Angular CLI 使用 [Browserslist](https://github.com/browserslist/browserslist) 來確保與不同瀏覽器版本的相容性。
Angular 會依支援的瀏覽器，自動轉換特定的 JavaScript 與 CSS 功能，確保建置出的應用程式不會使用尚未被支援瀏覽器實作的功能。不過，Angular CLI 不會自動加入 polyfill 來補足缺少的 Web API。請使用 `angular.json` 中的 `polyfills` 選項來加入 polyfill。

Angular CLI 內部使用下列預設的 `browserslist` 設定，其內容與 [Angular 支援的瀏覽器](reference/versions#browser-support)相符。

<docs-code language="text">

last 2 Chrome versions
last 1 Firefox version
last 2 Edge major versions
last 2 Safari major versions
last 2 iOS major versions
last 2 Android major versions
Firefox ESR

</docs-code>

若要覆寫內部設定，執行 [`ng generate config browserslist`](cli/generate/config)，它會在專案目錄中產生一份 `.browserslistrc` 設定檔。

更多鎖定特定瀏覽器與版本的範例，請參閱 [browserslist 儲存庫](https://github.com/browserslist/browserslist)。
避免將此清單擴大到更多瀏覽器。即使你的應用程式程式碼相容性更廣，Angular 本身也未必相容。
你應該只縮小這份清單中的瀏覽器或版本集合，不該擴大。

HELPFUL: 使用 [browsersl.ist](https://browsersl.ist) 來顯示某個 `browserslist` 查詢相容的瀏覽器。
