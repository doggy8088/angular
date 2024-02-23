# Angular 函式庫發佈至 npm 的用法

在您建構 Angular 應用程式時，請充分利用精緻的第一方程式庫，以及豐富的第三方程式庫生態系統。
[Angular Material][AngularMaterialMain] 是精緻的第一方程式庫範例。
如需最受歡迎的程式庫連結，請參閱 [Angular 資源][AioResources]。

## 安裝函式庫

程式庫以 [npm 套件][AioGuideNpmPackages] 發布，通常與將它們與 Angular CLI 整合的 Schematics 一同發布。
若要將可重複使用的程式庫程式碼整合到應用程式中，您需要安裝套件並在您使用它的位置匯入提供的功能。
對於大多數已發布的 Angular 程式庫，請使用 `ng add <lib_name>` Angular CLI 指令。

`ng add` Angular CLI 命令使用套件管理員來安裝程式庫套件，並呼叫套件中包含的綱要，以在專案程式碼中進行其他架構。
套件管理員的範例包括 [npm][NpmjsMain] 或 [yarn][YarnpkgMain]。
專案程式碼中的其他架構包括匯入陳述式、字型和佈景主題。

發佈的程式庫通常會提供 `README` 檔案或其他文件，說明如何將該程式庫新增到您的應用程式。
例如，請參閱 [Angular Material][AngularMaterialMain] 文件。

### 函式庫打字

通常，函式庫套件會在 `.d.ts` 檔案中包含型別，請參閱 `node_modules/@angular/material` 中的範例。
如果函式庫的套件不包含型別，而 IDE 出現抱怨，您可能需要使用函式庫安裝 `@types/<lib_name>` 套件。

例如，假設您有一個名為 `d3` 的函式庫：

<docs-code language="shell">

npm install d3 --save
npm install &commat;types/d3 --save-dev

</docs-code>

在工作區中安裝的函式庫的 `@types/` 套件中定義的類型會自動新增到使用該函式庫的專案的 TypeScript 組態。
TypeScript 預設會在 `node_modules/@types` 目錄中尋找類型，因此您無需個別新增每個類型套件。

如果某個函式庫在 `@types/` 沒有提供型別，您可以手動為其新增型別來使用它。
要做到這一點：

1. 在 `src/` 目錄中建立一個 `typings.d.ts` 檔案。
    這個檔案會自動包含為全域類型定義。

1. 在 `src/typings.d.ts` 中加入以下程式碼：

    <docs-code language="typescript">

    declare module 'host' {
      export interface Host {
        protocol?: string;
        hostname?: string;
        pathname?: string;
      }
      export function parse(url: string, queryString?: string): Host;
    }

    </docs-code>

1. 在使用這個函式庫的元件或檔案中，加入以下程式碼：

    <docs-code language="typescript">

    import * as host from 'host';
    const parsedUrl = host.parse('https://angular.io');
    console.log(parsedUrl.hostname);

    </docs-code>

如需，定義更多類型。

## 更新函式庫

圖書館可以由發布者更新，並且還有一些需要保持最新的個別依賴項。
若要查看已安裝圖書館的更新，請使用 [`ng update`][AioCliUpdate] Angular CLI 命令。

使用 `ng update <lib_name>` Angular CLI 指令來更新個別 library 版本。
Angular CLI 會檢查 library 的最新發布版本，如果最新版本比您已安裝的版本新，就會下載它並更新您的 `package.json` 以符合最新版本。

當您將 Angular 更新至新版本時，您需要確認您正在使用的所有函式庫都是最新的。
如果函式庫有相互依存關係，您可能需要依特定順序更新它們。
請參閱 [Angular 更新指南][AngularUpdateMain] 以取得協助。

## 將函式庫新增到執行時間全域範圍

如果應用程式中未匯入舊版 JavaScript 程式庫，您可以將其新增至執行時期的全域範圍，並在腳本標籤中載入它。
在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中使用建置目標的 `scripts` 和 `styles` 選項，設定 Angular CLI 在建置時執行此動作。

例如，要使用 [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction] 函式庫

1. 使用 npm 套件管理員安裝程式庫和相關的相依性：

    <docs-code language="shell">

    npm install jquery --save
    npm install popper.js --save
    npm install bootstrap --save

    </docs-code>

1. 在 `angular.json` 設定檔中，將相關的指令碼檔案加入 `scripts` 陣列：

    <docs-code language="json">

    "scripts": [
      "node_modules/jquery/dist/jquery.slim.js",
      "node_modules/popper.js/dist/umd/popper.js",
      "node_modules/bootstrap/dist/js/bootstrap.js"
    ],

    </docs-code>

1. 將 `bootstrap.css` CSS 檔案加入 `styles` 陣列：

    <docs-code language="css">

    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.css",
      "src/styles.css"
    ],

    </docs-code>

1. 執行或重新啟動 `ng serve` Angular CLI 指令，以在您的應用程式中看到 Bootstrap 4 執行。

### 在應用程式內使用 runtime-global 函式庫

html
<p>
  在應用程式內使用 runtime-global 函式庫，您必須先將函式庫新增至您的專案。
</p>
<ol>
  <li>
    在您的應用程式目錄下，建立一個名為 node_modules 的目錄。
  </li>
  <li>
    使用以下指令安裝 runtime-global 函式庫：
    <pre>
npm install runtime-global --save
    </pre>
  </li>
  <li>
    在您的應用程式中，使用 require() 函式載入 runtime-global 函式庫：
    <pre>
const runtimeGlobal = require('runtime-global');
    </pre>
  </li>
  <li>
    您現在可以在您的應用程式中使用 runtime-global 函式庫了。
  </li>
</ol>

在使用「scripts」陣列匯入函式庫後，**不要** 在 TypeScript 程式碼中使用 import 陳述式匯入它。
以下程式碼片段為匯入陳述式的範例。

<docs-code language="typescript">

import * as &dollar; from 'jquery';

</docs-code>

如果您使用導入語句導入它，您將會擁有兩個不同的函式庫副本：一個導入為全域函式庫，另一個導入為模組。
這對於具有外掛程式的函式庫來說特別糟糕，例如 JQuery，因為每個副本都包含不同的外掛程式。

請改為執行 `npm install @types/jquery` Angular CLI 命令，以下載函式庫的類型，然後依照函式庫安裝步驟進行。
這讓您可以存取該函式庫公開的變數。

### 定義執行時期全域函式庫的類型

如果您需要使用的全域函式庫沒有全域類型，您可以手動在 `src/typings.d.ts` 中將它們宣告為 `any`。

例如：

<docs-code language="typescript">

declare var libraryName: any;

</docs-code>

某些腳本會延伸其他函式庫；例如使用 JQuery 外掛程式：

<docs-code language="typescript">

&dollar;('.test').myPlugin();

</docs-code>

在這種情況下，已安裝的 `@types/jquery` 不包含 `myPlugin`，因此您需要在 `src/typings.d.ts` 中新增介面。
例如：

<docs-code language="typescript">

interface JQuery {
  myPlugin(options?: any): any;
}

</docs-code>

如果您沒有為腳本定義的擴充套件添加介面，您的 IDE 會顯示錯誤：

<docs-code language="text">

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

</docs-code>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
