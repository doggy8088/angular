# 配置應用程式環境

你可以為你的專案定義不同的命名建置設定，例如 `development` 和 `staging`，並設定不同的預設值。

每個已命名的設定可以擁有任何適用於各種建構目標的選項的預設值，例如 `build`、`serve` 和 `test`。
[Angular CLI](tools/cli) `build`、`serve` 和 `test` 命令可以替換檔案，以取得您預期的目標環境的適當版本。

## Angular CLI 組態

Angular CLI 建構器支援 `configurations` 物件，允許根據命令列提供的設定覆寫建構器的特定選項。

<docs-code language="json">

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // By default, disable source map generation.
            "sourceMap": false
          },
          "configurations": {
            // For the `debug` configuration, enable source maps.
            "debug": {
              "sourceMap": true
            }
          }
        },
        &hellip;
      }
    }
  }
}

</docs-code>

您可以使用 `--configuration` 選項選擇要使用的組態。

<docs-code language="shell">

ng build --configuration debug

</docs-code>

配置可以套用至任何 Angular CLI 建構器。多個配置可以用逗號分隔。配置會依序套用，其中有衝突的選項會使用最後一個配置的值。

<docs-code language="shell">

ng build --configuration debug,production,customer-facing

</docs-code>

## 設定環境特定的預設值

`@angular-devkit/build-angular:browser` 支援檔案替換，一個在執行建置前替換原始檔案的選項。
與 `--configuration` 結合使用，提供在應用程式中配置環境特定資料的機制。

從 [產生環境](cli/generate#environments-command) 開始，以建立 `src/environments/` 目錄並將專案設定為使用檔案替換。

<docs-code language="shell">

ng generate environments

</docs-code>

這個專案的 `src/environments/` 目錄包含基礎設定檔 `environment.ts`，它提供生產環境的預設設定。
您可以在目標特定的設定檔中覆寫其他環境的預設值，例如 `development` 和 `staging`。

例如：

<docs-code language="text">

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

</docs-code>

基本檔案 `environment.ts`，包含預設的環境設定。
例如：

<docs-code language="typescript">

export const environment = {
  production: true
};

</docs-code>

`build` 命令在未指定環境時，以此作為建置目標。
您可以新增更多變數，可以作為環境物件上的附加屬性，或作為個別物件。
例如，以下內容將預設變數新增至預設環境：

<docs-code language="typescript">

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

</docs-code>

您可以新增針對特定目標的設定檔，例如 `environment.development.ts`。
以下內容針對開發建置目標設定預設值：

<docs-code language="typescript">

export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url'
};

</docs-code>

## 在你的 app 中使用特定環境的變數

若要使用您已定義的環境組態，您的元件必須匯入原始的環境檔案：

<docs-code language="typescript">

import { environment } from './environments/environment';

</docs-code>

這可確保建置和服務命令可以找到特定建置目標的組態。

下列元件檔案 (`app.component.ts`) 中的程式碼使用了在設定檔中定義的環境變數。

<docs-code language="typescript">

import { environment } from './../environments/environment';

// Fetches from `http://my-prod-url` in production, `http://my-dev-url` in development.
fetch(environment.apiUrl);

</docs-code>

主 CLI 設定檔 `angular.json` 在每個建置目標的設定中包含一個 `fileReplacements` 區段，它可讓您以該檔案的目標特定版本取代 TypeScript 程式中的任何檔案。
這對於在目標為特定環境 (例如生產或暫存) 的建置中包含目標特定的程式碼或變數非常有用。

預設情況下不會取代任何檔案，但 `ng generate environments` 會自動設定此組態。
您可以直接編輯 `angular.json` 組態來變更或新增特定建置目標的檔案取代。

<docs-code language="json">

"configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        &hellip;

</docs-code>

這表示當您使用 `ng build --configuration development` 建置開發組態時，`src/environments/environment.ts` 檔案會被目標特定的檔案版本 `src/environments/environment.development.ts` 取代。

要增加一個階段環境，請建立 `src/environments/environment.ts` 的副本，稱為 `src/environments/environment.staging.ts`，然後新增一個 `staging` 組態到 `angular.json`：

<docs-code language="json">

"configurations": {
    "development": { &hellip; },
    "production": { &hellip; },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

</docs-code>

您也可以針對這個目標環境新增更多設定選項。
任何您的建置支援的選項都可以在建置目標設定中覆寫。

要使用暫存設定進行建置，請執行以下命令：

<docs-code language="shell">

ng build --configuration staging

</docs-code>

預設情況下，`build` 目標包含 `production` 和 `development` 組態，而 `ng serve` 使用該應用程式的開發組建。
您也可以設定 `buildTarget` 選項，將 `ng serve` 組態為使用目標組建：

<docs-code language="json">

"serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": { &hellip; },
    "configurations": {
      "development": {
        // Use the `development` configuration of the `build` target.
        "buildTarget": "my-app:build:development"
      },
      "production": {
        // Use the `production` configuration of the `build` target.
        "buildTarget": "my-app:build:production"
      }
    },
    "defaultConfiguration": "development"
  },

</docs-code>

`defaultConfiguration` 選項指定預設使用的組態。
當 `defaultConfiguration` 未設定時，`options` 會直接使用，不作任何修改。

