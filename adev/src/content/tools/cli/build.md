# 建立 Angular 應用程式

您可以使用 `ng build` 指令來建置您的 Angular CLI 應用程式或函式庫。
這會將您的 TypeScript 程式碼編譯為 JavaScript，並適當優化、組合及壓縮輸出。

`ng build` 只執行 `angular.json` 中指定的預設專案的 `build` 目標的建構器。
Angular CLI 包含四個通常用作 `build` 目標的建構器：

| Builder                                         | 用途                                                                                                                                                                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular-devkit/build-angular:browser`         | 使用 [Webpack](https://webpack.js.org/) 將客戶端應用程式打包成可於瀏覽器中使用的應用程式。                                                                                   |
| `@angular-devkit/build-angular:browser-esbuild` | 使用 [esbuild](https://esbuild.github.io/) 將客戶端應用程式打包成可於瀏覽器中使用的應用程式。請參閱 [`browser-esbuild` 文件](tools/cli/esbuild) 以進一步了解。 |
| `@angular-devkit/build-angular:application`     | 使用 [esbuild](https://esbuild.github.io/) 建置包含客戶端套件、Node 伺服器和建置時間預先呈現路由的應用程式。                                                                   |
| `@angular-devkit/build-angular:ng-packagr`      | 建置符合 [Angular 套件格式](tools/libraries/angular-package-format) 的 Angular 函式庫。                                                                           |

由 `ng new` 生成的應用程式預設使用 `@angular-devkit/build-angular:application`。
由 `ng generate library` 生成的函式庫預設使用 `@angular-devkit/build-angular:ng-packagr`。

您可以透過查詢該項目的 `build` 目標來確定正在為特定項目使用哪個建構器。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invokes the Architect target named `build`.
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          &hellip;
        },
        "serve": { &hellip; }
        "test": { &hellip; }
        &hellip;
      }
    }
  }
}

</docs-code>

此頁面討論 `@angular-devkit/build-angular:application` 的用法和選項。

## 輸出目錄

此建置程序的結果輸出至目錄 (`dist/${PROJECT_NAME}` 預設值)。

## 調整大小預算

隨著應用程式功能的增長，它們的大小也會增長。
CLI 讓您在設定檔中設定大小閾值，以確保應用程式的部分保持在您定義的大小範圍內。

在 CLI 組態檔案 `angular.json` 中，為每個 [已設定的環境](tools/cli/environments) 在 `budgets` 區段定義大小界限。

<docs-code language="json">

{
  &hellip;
  "configurations": {
    "production": {
      &hellip;
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

您可以為整個應用程式和特定部分指定大小預算。
每個預算項目配置給定類型預算。
以以下格式指定大小值：

| 大小值      | 詳細資料                                                                     |
| :-------------- | :-------------------------------------------------------------------------- |
| `123` 或 `123b` | 以位元組為單位的檔案大小。                                                              |
| `123kb`         | 以千位元組為單位的檔案大小。                                                          |
| `123mb`         | 以百萬位元組為單位的檔案大小。                                                          |
| `12%`           | 相對於基準大小的檔案大小百分比。\（不適用於基準值。\） |

當您設定預算時，當應用程式的某個部分達到或超過您設定的邊界大小時，建構器會提出警告或報告錯誤。

每個預算條目都是一個具有下列屬性的 JSON 物件：

| 屬性 | 值 |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 類型 | 預算類型。其中之一：<table> <thead> <tr> <th> 值 </th> <th> 詳細資訊 </th> </tr> </thead> <tbody> <tr> <td> bundle </td> <td>特定套件的大小。</td> </tr> <tr> <td> initial </td> <td>應用程式啟動所需的 JavaScript 大小。預設值為 500kb 警告、1mb 錯誤。</td> </tr> <tr> <td> allScript </td> <td>所有指令碼的大小。</td> </tr> <tr> <td> all </td> <td>整個應用程式的大小。</td> </tr> <tr> <td> anyComponentStyle </td> <td>任何一個元件樣式表的大小。預設值為 2kb 警告、4kb 錯誤。</td> </tr> <tr> <td> anyScript </td> <td>任何一個指令碼的大小。</td> </tr> <tr> <td> any </td> <td>任何檔案的大小。</td> </tr> </tbody> </table> |
| 名稱 | 套件名稱（適用於 `type=bundle`）。 |
| 基準 | 比較的基準大小。 |
| 最大警告 | 相對於基準的最大警告閾值。 |
| 最大錯誤 | 相對於基準的最大錯誤閾值。 |
| 最小警告 | 相對於基準的最小警告閾值。 |
| 最小錯誤 | 相對於基準的最小錯誤閾值。 |
| 警告 | 相對於基準的警告閾值（最小和最大）。 |
| 錯誤 | 相對於基準的錯誤閾值（最小和最大）。 |

## 配置 CommonJS 相依性

在整個應用程式及其相依性中，始終優先使用原生 [ECMAScript 模組](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) (ESM)。
ESM 是一項完全規範的網路標準和 JavaScript 語言功能，具有強大的靜態分析支援。這使得套件最佳化比其他模組格式更強大。

Angular CLI 也支援將 [CommonJS](https://nodejs.org/api/modules.html) 相依項匯入您的專案，並且會自動組合這些相依項。
但是，CommonJS 模組可能會阻止組合器和壓縮器有效地最佳化這些模組，這會導致更大的組合大小。
如需更多資訊，請參閱 [CommonJS 如何讓您的組合變大](https://web.dev/commonjs-larger-bundles)。

如果 Angular CLI 偵測到您的瀏覽器應用程式依賴 CommonJS 模組，它會輸出警告。
當您遇到 CommonJS 相依性時，請考慮要求維護者支援 ECMAScript 模組，或自行提供支援，或使用符合您需求的替代相依性。
如果最佳選項是使用 CommonJS 相依性，您可以透過將 CommonJS 模組名稱新增到位於 `angular.json` 中 `build` 選項的 `allowedCommonJsDependencies` 選項來停用這些警告。

<docs-code language="json">

"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     &hellip;
   }
   &hellip;
},

</docs-code>

## 設定瀏覽器相容性

Angular CLI 使用 [Browserslist](https://github.com/browserslist/browserslist) 來確保與不同瀏覽器版本相容。
根據支援的瀏覽器，Angular 會自動填補並轉換特定 JavaScript 和 CSS 功能，以確保建置的應用程式不會使用受支援瀏覽器尚未實作的功能。

在內部，Angular CLI 使用以下預設的 `browserslist` 設定，與 Angular [支援的瀏覽器](reference/versions#browser-support) 相符。

<docs-code language="text">

last 2 Chrome versions
last 1 Firefox version
last 2 Edge major versions
last 2 Safari major versions
last 2 iOS major versions
Firefox ESR

</docs-code>

若要覆寫內部設定，請執行 [`ng generate config browserslist`](cli/generate#config-command)，這會在專案目錄中產生 `.browserslistrc` 設定檔。

請參閱 [browserslist repository](https://github.com/browserslist/browserslist) 以獲取更多關於如何鎖定特定瀏覽器和版本的範例。
避免將此清單擴充套件到更多瀏覽器。即使您的應用程式程式碼更廣泛相容，Angular 本身可能不是。
您應該只減少此清單中的瀏覽器或版本集合。

HELPFUL：使用 [browsersl.ist](https://browsersl.ist) 顯示與 `browserslist` 查詢相容的瀏覽器。

