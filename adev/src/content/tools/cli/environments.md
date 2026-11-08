# 設定應用程式環境

你可以為專案定義不同的具名建置設定，例如 `development` 與 `staging`，各自帶有不同的預設值。

每個具名設定都可以為適用於各種建置器目標的任一選項提供預設值，例如 `build`、`serve` 與 `test`。
接著，[Angular CLI](tools/cli) 的 `build`、`serve` 與 `test` 指令就能針對你預定的目標環境，將檔案換成適當的版本。

## Angular CLI 設定

Angular CLI 建置器支援 `configurations` 物件，讓你能依據命令列提供的設定，覆寫建置器的特定選項。

```json

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
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
        …
      }
    }
  }
}

```

你可以用 `--configuration` 選項選擇要使用哪個設定。

```shell

ng build --configuration debug

```

設定可以套用到任何 Angular CLI 建置器。你可以用逗號分隔指定多個設定。設定會依序套用，遇到衝突的選項時，以最後一個設定的值為準。

```shell

ng build --configuration debug,production,customer-facing

```

## 設定環境專屬的預設值

`@angular/build:application` 支援檔案置換，這個選項能在執行建置之前替換原始碼檔案。
將它與 `--configuration` 搭配使用，就能為應用程式設定環境專屬的資料。

先[產生環境設定](cli/generate/environments)，建立 `src/environments/` 目錄，並設定專案使用檔案置換。

```shell

ng generate environments

```

專案的 `src/environments/` 目錄包含基礎設定檔 `environment.ts`，它提供正式環境的預設設定。
你可以在目標專屬的設定檔中，為其他環境（例如 `development` 與 `staging`）覆寫預設值。

例如：

```text

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

```

基礎檔案 `environment.ts` 包含預設的環境設定。
例如：

```ts
export const environment = {
  production: true,
};
```

未指定環境時，`build` 指令會將它作為建置目標。
你可以加入更多變數，方式是為環境物件新增屬性，或是另外建立物件。
例如，下例為預設環境的某個變數加入了預設值：

```ts
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url',
};
```

CRITICAL: `src/environments/` 中的檔案會被打包進你的用戶端應用程式，任何載入頁面的人都看得到。絕不要在此存放 API 金鑰之類的機密資訊。請改用伺服器端代理或機密管理工具。

你可以新增目標專屬的設定檔，例如 `environment.development.ts`。
以下內容為開發建置目標設定了預設值：

```ts
export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url',
};
```

## 在應用程式中使用環境專屬變數

要使用你定義的環境設定，你的元件必須匯入原始的環境檔案：

```ts
import {environment} from './environments/environment';
```

這樣能確保 build 與 serve 指令找得到特定建置目標的設定。

元件檔案（`app.ts`）中的下列程式碼使用了一個在設定檔中定義的環境變數。

```ts
import {environment} from './../environments/environment';

// Fetches from `http://my-prod-url` in production, `http://my-dev-url` in development.
fetch(environment.apiUrl);
```

主要的 CLI 設定檔 `angular.json` 中，每個建置目標的設定裡都有一段 `fileReplacements`，讓你可以把 TypeScript 程式中的任何檔案，換成該檔案的目標專屬版本。
這在你想為特定環境（例如正式環境或預備環境）的建置加入目標專屬的程式碼或變數時非常有用。

預設不會置換任何檔案，不過 `ng generate environments` 會自動設定好這項設定。
你可以直接編輯 `angular.json` 設定，來變更或新增特定建置目標的檔案置換。

```json

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        …

```

這表示當你用 `ng build --configuration development` 建置開發設定時，`src/environments/environment.ts` 檔案會被換成該檔案的目標專屬版本 `src/environments/environment.development.ts`。

若要新增預備環境，先將 `src/environments/environment.ts` 複製一份，命名為 `src/environments/environment.staging.ts`，再在 `angular.json` 中加入 `staging` 設定：

```json

  "configurations": {
    "development": { … },
    "production": { … },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

```

你也可以為這個目標環境加入更多設定選項。
建置支援的任何選項，都可以在建置目標設定中覆寫。

若要使用預備設定進行建置，執行下列指令：

```shell

ng build --configuration staging

```

預設情況下，`build` 目標包含 `production` 與 `development` 設定，而 `ng serve` 使用的是應用程式的開發建置。
你也可以設定 `ng serve` 使用指定的建置設定，方法是設定 `buildTarget` 選項：

```json

  "serve": {
    "builder": "@angular/build:dev-server",
    "options": { … },
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

```

`defaultConfiguration` 選項指定預設使用哪個設定。
未設定 `defaultConfiguration` 時，會直接使用 `options`，不做任何修改。
