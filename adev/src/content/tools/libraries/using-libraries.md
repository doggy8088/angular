# 使用發行到 npm 的 Angular 程式庫

建置 Angular 應用程式時，你可以運用精緻的第一方程式庫，以及豐富的第三方程式庫生態系統。
[Angular Material][AngularMaterialMain] 就是一個精緻的第一方程式庫例子。

## 安裝程式庫

程式庫以 [npm 套件][GuideNpmPackages]的形式發行，通常會附帶能與 Angular CLI 整合的原理圖（schematic）。
若要把可重複使用的程式庫程式碼整合進應用程式，你需要安裝套件，並在使用它的位置匯入所提供的功能。
對於大多數已發行的 Angular 程式庫，請使用 `ng add <lib_name>` 這個 Angular CLI 指令。

`ng add` 這個 Angular CLI 指令會使用套件管理工具安裝程式庫套件，並叫用套件中包含的原理圖，在專案程式碼中加入其他鷹架（scaffolding）。
套件管理工具的例子包括 [npm][NpmjsMain] 或 [yarn][YarnpkgMain]。
在專案程式碼中加入的其他鷹架包括 import 陳述式、字型與主題。

已發行的程式庫通常會提供 `README` 檔案或其他文件，說明如何將該程式庫加入你的應用程式。
例如，請參閱 [Angular Material][AngularMaterialMain] 文件。

### 程式庫的型別定義

通常，程式庫套件會在 `.d.ts` 檔案中包含型別定義；範例請見 `node_modules/@angular/material`。
如果你的程式庫套件不包含型別定義，而你的 IDE 因此抱怨，你可能需要連同程式庫一起安裝 `@types/<lib_name>` 套件。

例如，假設你有一個名為 `d3` 的程式庫：

<docs-code language="shell">

npm install d3 --save
npm install @types/d3 --save-dev

</docs-code>

為工作區中已安裝的程式庫所定義的 `@types/` 套件型別，會自動加入使用該程式庫的專案的 TypeScript 設定中。
TypeScript 預設會在 `node_modules/@types` 目錄中尋找型別，因此你不需要逐一加入每個型別套件。

如果某個程式庫在 `@types/` 沒有可用的型別定義，你可以手動為它加入型別定義。
做法如下：

1. 在你的 `src/` 目錄中建立一個 `typings.d.ts` 檔案。
   這個檔案會自動被包含為全域型別定義。

1. 將下列程式碼加入 `src/typings.d.ts`：

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

1. 在使用該程式庫的元件或檔案中，加入下列程式碼：

    <docs-code language="typescript">

    import * as host from 'host';
    const parsedUrl = host.parse('https://angular.dev');
    console.log(parsedUrl.hostname);

    </docs-code>

依需要定義更多型別定義。

## 更新程式庫

程式庫可以由發行者更新，它自身也有需要保持最新的個別依賴。
若要檢查你已安裝的程式庫是否有更新，請使用 [`ng update`][CliUpdate] 這個 Angular CLI 指令。

使用 `ng update <lib_name>` 這個 Angular CLI 指令，可以更新個別程式庫的版本。
Angular CLI 會檢查該程式庫最新發行的版本，如果最新版本比你安裝的版本新，就會下載它，並更新你的 `package.json` 使其與最新版本一致。

當你將 Angular 更新到新版本時，你需要確認你使用的所有程式庫都是最新狀態。
如果程式庫之間有相互依賴關係，你可能必須按照特定順序更新它們。
詳情請參閱 [Angular 更新指南][AngularUpdateMain]。

## 將程式庫加入執行階段的全域範圍

如果某個舊版 JavaScript 程式庫沒有被匯入應用程式，你可以將它加到執行階段的全域範圍，像以 script 標籤加入一樣載入它。
在 [`angular.json`][GuideWorkspaceConfig] 工作區建置設定檔中，使用建置目標的 `scripts` 與 `styles` 選項，讓 Angular CLI 在建置時完成這件事。

例如，若要使用 [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction] 程式庫：

1. 使用 npm 套件管理工具安裝程式庫及相關依賴：

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

1. 將 `bootstrap.css` 這個 CSS 檔案加入 `styles` 陣列：

    <docs-code language="css">

    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.css",
      "src/styles.css"
    ],

    </docs-code>

1. 執行或重新啟動 `ng serve` 這個 Angular CLI 指令，即可在你的應用程式中看到 Bootstrap 4 正常運作。

### 在應用程式中使用執行階段全域程式庫 {#using-runtime-global-libraries-inside-your-app}

透過「scripts」陣列匯入程式庫之後，**不要**在你的 TypeScript 程式碼中用 import 陳述式匯入它。
下列程式碼片段是一個 import 陳述式的例子。

<docs-code language="typescript">

import * as $ from 'jquery';

</docs-code>

如果你用 import 陳述式匯入它，你就會有兩份不同的程式庫副本：一份以全域程式庫形式匯入，另一份以模組形式匯入。
這對帶有外掛程式的程式庫（例如 JQuery）尤其糟糕，因為每個副本包含的外掛程式不同。

你應該改為執行 `npm install @types/jquery` 這個 Angular CLI 指令，下載你的程式庫的型別定義，然後依照程式庫的安裝步驟操作。
如此你就能存取該程式庫公開的全域變數。

### 為執行階段全域程式庫定義型別

如果你需要使用的全域程式庫沒有全域型別定義，你可以在 `src/typings.d.ts` 中手動將它們宣告為 `any`。

例如：

<docs-code language="typescript">

declare var libraryName: any;

</docs-code>

有些指令碼會擴充其他程式庫；例如使用 JQuery 外掛程式時：

<docs-code language="typescript">

$('.test').myPlugin();

</docs-code>

在這種情況下，已安裝的 `@types/jquery` 不包含 `myPlugin`，因此你需要在 `src/typings.d.ts` 中加入一個介面。
例如：

<docs-code language="typescript">

interface JQuery {
  myPlugin(options?: any): any;
}

</docs-code>

如果你沒有為指令碼定義的擴充加入介面，你的 IDE 會顯示錯誤：

<docs-code language="text">

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

</docs-code>

[CliUpdate]: cli/update "ng update | CLI |Angular"

[GuideNpmPackages]: reference/configs/npm-packages "Workspace npm dependencies | Angular"

[GuideWorkspaceConfig]: reference/configs/workspace-config "Angular workspace configuration | Angular"

[Resources]: resources "Explore Angular Resources | Angular"

[AngularMaterialMain]: https://material.angular.dev "Angular Material | Angular"

[AngularUpdateMain]: https://angular.dev/update-guide "Angular Update Guide | Angular"

[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction "Introduction | Bootstrap"

[NpmjsMain]: https://www.npmjs.com "npm"

[YarnpkgMain]: https://yarnpkg.com " Yarn"
