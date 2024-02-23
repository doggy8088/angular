# 建立函式庫

此頁面提供有關如何建立及發佈新函式庫以擴充 Angular 功能的概念概觀。

如果您發現您需要在多個應用程式中解決相同的問題（或想與其他開發者分享您的解決方案），那麼您就有了一個候選函式庫。
一個簡單的範例可能是一個會將使用者導向到您公司網站的按鈕，它會包含在您的公司所建構的所有應用程式中。

## 開始使用

使用 Angular CLI 在新的工作空間中產生新的程式庫骨架，請使用以下指令。

<docs-code language="shell">

ng new my-workspace --no-create-application
cd my-workspace
ng generate library my-lib

</docs-code>

<docs-callout title="命名您的函式庫">

如果您想以後在公共套件登記處（例如 npm）中發佈您的程式庫，就應該非常小心選擇程式庫的名稱。
請參閱[發佈您的程式庫](tools/libraries/creating-libraries#publishing-your-library)。

避免使用以 `ng-` 為前綴的名稱，例如 `ng-library`。
`ng-` 前綴是 Angular 框架及其庫使用的保留關鍵字。
`ngx-` 前綴是首選慣例，用於表示庫適合與 Angular 搭配使用。
這也是一個很好的指示，讓登錄使用者區分不同 JavaScript 框架的庫。

</docs-callout>

`ng generate` 指令在工作區中建立 `projects/my-lib` 資料夾，其中包含一個元件和一個位於 NgModule 內部的服務。

HELPFUL：有關程式庫專案結構的更多詳細資訊，請參閱[程式庫專案檔案](reference/configs/file-structure#library-project-files)部分的[專案檔案結構指南](reference/configs/file-structure)。

使用單一倉庫模型，讓多個專案共用同一個工作區。
請參閱 [設定多專案工作區](reference/configs/file-structure#multiple-projects)。

當您產生一個新函式庫時，工作區設定檔 `angular.json` 會以 `library` 類型的專案更新。

<docs-code>

"projects": {
  &hellip;
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "&commat;angular-devkit/build-angular:ng-packagr",
        &hellip;

</docs-code>

建立、測試和使用 CLI 指令列出項目：

<docs-code language="shell">

ng build my-lib --configuration development
ng test my-lib
ng lint my-lib

</docs-code>

請注意專案的已設定建構器與應用程式專案的預設建構器不同。
此建構器（除其他事項外）可確保程式庫始終使用 [AOT 編譯器](tools/cli/aot-compiler) 建置。

若要讓函式庫程式碼可重複使用，您必須為其定義公共 API。
此「使用者層」定義了函式庫消費者可使用的內容。
函式庫使用者應該能夠透過單一匯入路徑存取公共功能（例如 NgModules、服務提供者和一般工具函式）。

您的函式庫的公開 API 保存在函式庫資料夾中的 `public-api.ts` 檔案。
當您的函式庫匯入至應用程式時，從此檔案匯出的任何項目都會公開。
使用 NgModule 來公開服務和元件。

你的程式庫應該提供文件（通常是 README 檔案）供安裝和維護。

## 將應用程式的部分重構為函式庫

為了使您的解決方案可重複使用，您需要調整它，使其不依賴應用程式特定的程式碼。
以下是將應用程式功能移轉到程式庫時需要考慮的一些事項。

* 宣告，例如元件和管道，應該設計為無狀態，表示它們不依賴或不變更外部變數。
    如果您依賴狀態，您需要評估每種情況並決定它是應用程式狀態或程式庫會管理的狀態。

* 元件在內部認購的任何可觀察項目都應該在這些元件的生命週期內清理並處置
* 元件應該透過輸入公開其互動，以提供內容，並透過輸出將事件傳達給其他元件

* 檢查所有內部依賴項。
  * 對於在元件或服務中使用的自訂類別或介面，請檢查它們是否依賴其他類別或介面，這些類別或介面也需要遷移
  * 同樣地，如果您的程式庫程式碼依賴某個服務，則該服務需要遷移
  * 如果您的程式庫程式碼或其範本依賴其他程式庫（例如 Angular Material），則必須使用這些依賴項來配置您的程式庫

* 考慮如何向用戶端應用程式提供服務。

  * 服務應該宣告自己的提供者，而不是在 NgModule 或元件中宣告提供者。
        宣告提供者會讓該服務成為 *可樹狀搖動*。
        這個做法可讓編譯器將服務留在套件之外，如果該服務從未注入到導入程式庫的應用程式中。
        如需更多相關資訊，請參閱 [可樹狀搖動的提供者](guide/di/lightweight-injection-tokens)。

  * 如果您註冊全域服務提供者或跨多個 NgModules 共用提供者，請使用 [RouterModule](api/router/RouterModule) 提供的 [`forRoot()` 和 `forChild()` 設計模式](guide/ngmodules/singleton-services)
  * 如果您的程式庫提供可能不會被所有用戶端應用程式使用的選用服務，請使用 [輕量級權杖設計模式](guide/di/lightweight-injection-tokens) 支援適當的樹狀搖動，以因應這種情況

## 使用程式碼產生器架構與 CLI 整合

函式庫通常包含定義元件、服務和其他 Angular 人工製品（管道、指令）的 *可重複使用的程式碼*，您可以將這些程式碼匯入專案中。
函式庫會封裝到 npm 套件中，以便發佈和分享。
此套件也可以包含提供指示，以在專案中直接產生或轉換程式碼的示意圖，就像 CLI 使用 `ng generate component` 建立通用新元件的方式一樣。
與函式庫一起封裝的示意圖可以例如提供 Angular CLI 資訊，以便產生元件，該元件組態並使用在該函式庫中定義的特定功能或功能組。
其中一個範例是 [Angular Material 的導覽示意圖](https://material.angular.io/guide/schematics#navigation-schematic)，它會組態 CDK 的 [BreakpointObserver](https://material.angular.io/cdk/layout/overview#breakpointobserver)，並將其與 Material 的 [MatSideNav](https://material.angular.io/components/sidenav/overview) 和 [MatToolbar](https://material.angular.io/components/toolbar/overview) 元件一起使用。

建立並包含以下類型的示意圖：

* 包含安裝示意圖，以便 `ng add` 能將你的函式庫新增到專案
* 在函式庫中包含產生示意圖，以便 `ng generate` 能在專案中建立定義好的成品（元件、服務、測試）
* 包含更新示意圖，以便 `ng update` 能更新函式庫的相依性，並提供新版本中重大變更的遷移

您在程式庫中包含的內容取決於您的工作。
例如，您可以定義一個結構，以建立一個預先填入罐頭資料的下拉式選單，以顯示如何將其新增至應用程式。
如果您想要每次都包含不同傳入值的下拉式選單，您的程式庫可以定義一個結構，以使用既定設定建立下拉式選單。
然後，開發人員可以使用 `ng generate` 為自己的應用程式設定一個執行個體。

假設您想讀取設定檔，然後根據該設定檔產生表單。
如果該表單需要由使用您函式庫的開發人員進行額外的自訂，那麼最好將其作為一個示意圖。
但是，如果表單永遠都是相同的，並且不需要開發人員進行太多自訂，那麼您可以建立一個動態元件，它會採用設定檔並產生表單。
一般而言，自訂越複雜，示意圖方法就越有用。

如需更多資訊，請參閱 [Schematics Overview](tools/cli/schematics) 和 [Schematics for Libraries](tools/cli/schematics-for-libraries)。

## 發佈您的函式庫

<p>Publishing your library to npm is a great way to share your code with the world. It's also a great way to get feedback from other developers and improve your code.</p>
<p>To publish your library to npm, you'll need to create a package.json file. This file contains information about your library, such as its name, version, and dependencies. You can create a package.json file using the following command:</p>
<pre>npm init -y
</pre>
<p>Once you have created a package.json file, you can publish your library to npm using the following command:</p>
<pre>npm publish
</pre>
<p>Your library will now be available for other developers to install and use in their projects.</p>

使用 Angular CLI 和 npm 套件管理員，以 npm 套件的形式建置並發布您的函式庫。

Angular CLI 使用一個名為 [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) 的工具，從您的編譯程式碼建立套件，以便發佈到 npm。
請參閱 [使用 Ivy 建立函式庫](tools/libraries/creating-libraries#ivy-libraries) 以瞭解 `ng-packagr` 支援的發行格式，以及如何為函式庫選擇正確格式的指南。

您應該始終使用 `production` 組態來建置要發佈的函式庫。
這可確保產生的輸出使用適當的最佳化和正確的 npm 套件格式。

<docs-code language="shell">

ng build my-lib
cd dist/my-lib
npm publish

</docs-code>

## 圖書館中的資產管理

在您的 Angular 函式庫中，可配送項目可以包含其他資產，例如佈景主題檔案、Sass 混入或文件（例如變更日誌）。
如需更多資訊，請參閱 [將資產複製到函式庫作為建置的一部分](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) 和 [將資產嵌入元件樣式](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md)。

重要：在包含額外的資產（如 Sass mixin 或預編譯 CSS）時。
您需要手動將這些內容新增到主要入門點的 `package.json` 中的條件式 ["exports"](tools/libraries/angular-package-format#quotexportsquot)。

`ng-packagr` 會將手寫的 `"exports"` 與自動產生的 `"exports"` 合併，允許函式庫作者設定額外的匯出子路徑或自訂條件。

<docs-code language="json">

"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}

</docs-code>

以上是從 [@angular/material](https://unpkg.com/browse/@angular/material/package.json) 可散發的萃取物。

## 對等依賴

Angular 函式庫應列出函式庫所依賴的任何 `@angular/*` 相依性為同儕相依性。
這可確保當模組要求 Angular 時，它們都會取得完全相同的模組。
如果函式庫在 `dependencies` 中列出 `@angular/core`，而不是在 `peerDependencies` 中列出，它可能會取得不同的 Angular 模組，這將導致您的應用程式中斷。

## 在應用程式中使用您的自有函式庫

你不必將你的函式庫發佈到 npm 套件管理員以在同一個工作區使用它，但你必須先建置它。

在應用程式中使用自己的函式庫：

* 建立函式庫。
    您無法在函式庫建立前使用它。

    <docs-code language="shell">

    ng build my-lib

    </docs-code>

* 在您的應用程式中，依名稱從函式庫匯入：

    <docs-code language="typescript">

    import { myExport } from 'my-lib';

    </docs-code>

### 建立和重建你的函式庫

如果你尚未將你的程式庫發佈為 npm 套件，然後從 npm 將該套件安裝回你的應用程式，則建置步驟很重要。
例如，如果你複製你的 git 儲存庫並執行 `npm install`，如果你尚未建置你的程式庫，你的編輯器會顯示 `my-lib` 匯入遺失。

HELPFUL：當您從 Angular 應用程式中的程式庫匯入項目時，Angular 會在程式庫名稱和磁碟位置之間尋找對應。
當您安裝程式庫套件時，對應會在 `node_modules` 資料夾中。
當您建立自己的程式庫時，它必須在您的 `tsconfig` 路徑中找到對應。

使用 Angular CLI 產生程式庫會自動將其路徑新增至 `tsconfig` 檔案。
Angular CLI 使用 `tsconfig` 路徑告知建置系統到哪裡尋找程式庫。

如需更多資訊，請參閱 [路徑對應概觀](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)。

如果您發現對庫進行的變更未反映在您的應用程式中，則您的應用程式可能正在使用庫的舊版本。

當你對函式庫進行變更時，你可以隨時重新建置你的函式庫，但這個額外的步驟會花費時間。
*增量建置* 功能可改善函式庫的開發體驗。
每次變更檔案時，都會執行部分建置，並發出已修正的檔案。

增量建構可以在您的開發環境中作為背景程序運行。
要利用此功能，請將 `--watch` 標記新增到建構命令：

<docs-code language="shell">

ng build my-lib --watch

</docs-code>

重要：CLI `build` 指令使用不同的建構工具，並為應用程式呼叫不同的建構工具，而不是函式庫。

* 應用程式的建置系統 `@angular-devkit/build-angular` 是基於 `webpack`，且包含在所有新的 Angular CLI 專案中
* 函式庫的建置系統基於 `ng-packagr`。
    只有在您使用 `ng generate library my-lib` 新增函式庫時，才會將它新增至您的相依性。

這兩個建構系統支援不同的事物，即使在它們支援相同事物的情況下，它們也會用不同的方式執行這些事物。
這表示 TypeScript 原始碼在建構的程式庫中可能產生不同的 JavaScript 程式碼，與在建構的應用程式中產生的程式碼不同。

基於此原因，依賴函式庫的應用程式應僅使用指向*建置函式庫*的 TypeScript 路徑對映。
TypeScript 路徑對映*不應*指向函式庫原始碼 `.ts` 檔案。

## 發佈函式庫

在發佈程式庫時，可以使用兩種發行格式：

| 發行格式        | 詳細資訊 |
|:---                         |:---     |
| Partial-Ivy \(推薦\) | 包含可攜式程式碼，可供自 Angular v12 起的任何版本所建置的 Ivy 應用程式使用。 |
| Full-Ivy                    | 包含私有 Angular Ivy 指令，無法保證在不同版本的 Angular 中運作。此格式要求函式庫與應用程式使用 *完全* 相同版本的 Angular 建置。此格式適用於所有函式庫與應用程式程式碼直接從原始程式碼建置的環境。 |

針對發佈到 npm，請使用 partial-Ivy 格式，因為它在 Angular 的修補程式版本間是穩定的。

如果您要發佈到 npm，請避免使用完整的 Ivy 程式碼編譯函式庫，因為產生的 Ivy 指令並非 Angular 的公共 API 的一部分，因此可能會在修正版本之間發生變更。

## 確保程式庫版本相容性

用於建構應用程式的 Angular 版本應始終與用於建構任何其相依函式庫的 Angular 版本相同或更高。
例如，如果您有一個使用 Angular 版本 13 的函式庫，則依賴該函式庫的應用程式應使用 Angular 版本 13 或更高版本。
Angular 不支援使用較早的應用程式版本。

如果您想要將您的程式庫發佈到 npm，請透過在 `tsconfig.prod.json` 中設定 `"compilationMode": "partial"` 來編譯部分 Ivy 程式碼。
這種部分格式在不同版本的 Angular 之間是穩定的，因此可以安全地發佈到 npm。
使用此格式的程式碼會在應用程式建置期間使用相同版本的 Angular 編譯器進行處理，確保應用程式及其所有程式庫使用單一版本的 Angular。

如果您要發佈到 npm，請避免使用完整的 Ivy 程式碼編譯函式庫，因為產生的 Ivy 指令並非 Angular 的公共 API 的一部分，因此可能會在修正版本之間發生變更。

如果您從未在 npm 中發布過套件，您必須建立一個使用者帳戶。
在 [發布 npm 套件](https://docs.npmjs.com/getting-started/publishing-npm-packages) 中閱讀更多內容。

## 在 Angular CLI 外部使用部分 Ivy 程式碼

<p>
    The Angular CLI consumes the partial-Ivy code via a private npm package. This
    package is not published publicly, but you can still use partial-Ivy code
    outside of the Angular CLI by following these steps:
  </p>
  <ol>
    <li>
      Install the private npm package:
      <pre>npm install @angular/compiler-cli@0.0.0-PLACEHOLDER</pre>
    </li>
    <li>
      Create a new Angular application using the Angular CLI:
      <pre>ng new my-app</pre>
    </li>
    <li>
      Copy the compiler-cli package from the node_modules
      directory of your new application to the node_modules directory
      of your existing application.
    </li>
    <li>
      In your existing application, update the package.json file to
      include the following dependency:
      <pre>
        "dependencies": {
          "@angular/compiler-cli": "0.0.0-PLACEHOLDER"
        }
      </pre>
    </li>
    <li>
      In your existing application, update the tsconfig.json file to
      include the following compiler options:
      <pre>
        "angularCompilerOptions": {
          "enableIvy": true,
          "fullTemplateTypeCheck": true
        }
      </pre>
    </li>
    <li>
      Rebuild your existing application.
    </li>
  </ol>
  <p>
    You can now use partial-Ivy code in your existing application.
  </p>

應用程式會從 npm 安裝許多 Angular 函式庫到其 `node_modules` 目錄。
但是，由於這些函式庫中的程式碼尚未完全編譯，因此無法直接將其與建置的應用程式一起捆綁。
如要完成編譯，請使用 Angular 連結器。

對於不使用 Angular CLI 的應用程式，連結器可用作 [Babel](https://babeljs.io) 外掛程式。
外掛程式要從 `@angular/compiler-cli/linker/babel` 匯入。

Angular 連結器 Babel 外掛程式支援建置快取，這表示無論其他 npm 作業為何，函式庫僅需由連結器處理一次。

將連結器註冊為 [Babel](https://babeljs.io) 外掛，以使用 [babel-loader](https://webpack.js.org/loaders/babel-loader/#options) 將外掛整合到自訂 [Webpack](https://webpack.js.org) 組建的範例。

<docs-code header="webpack.config.mjs" path="adev/src/content/examples/angular-linker-plugin/webpack.config.mjs" visibleRegion="webpack-config"/>

HELPFUL: Angular CLI 會自動整合連結器外掛程式，因此如果您的函式庫使用者使用 CLI，他們可以從 npm 安裝 Ivy 原生函式庫，而無需任何其他設定。
