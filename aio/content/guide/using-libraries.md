# 使用已發行的程式庫

建置 Angular 應用程式時，你可以運用精緻的第一方程式庫，例如 [Angular Material](https://material.angular.io/)，以及豐富的第三方程式庫生態系統。
最受歡迎的程式庫連結，請參閱 [Angular 資源](https://angular.io/resources) 頁面。

## 安裝程式庫

程式庫以 [npm 套件](guide/npm-packages) 的形式發行，通常會附帶能與 Angular CLI 整合的原理圖。
若要把可重複使用的程式庫程式碼整合進應用程式，你需要安裝套件，並在你將使用它的位置匯入所提供的功能。對於大多數已發行的 Angular 程式庫，你可以使用 Angular CLI 的 `ng add <lib_name>` 指令。

`ng add` 指令會使用 npm 套件管理工具或 [yarn](https://yarnpkg.com/) 來安裝程式庫套件，並叫用套件中包含的原理圖，在專案程式碼中加入其他鷹架，例如新增 import 陳述式、字型、主題等。

已發行的程式庫通常會提供 README 或其他文件，說明如何將該程式庫加入你的應用程式。
例如，請參閱 [Angular Material](https://material.angular.io/) 文件。

### 程式庫的型別定義

程式庫套件通常會在 `.d.ts` 檔案中包含型別定義；範例請見 `node_modules/@angular/material`。如果你的程式庫套件不包含型別定義，而你的 IDE 因此抱怨，你可能需要安裝該程式庫相關聯的 `@types/<lib_name>` 套件。

例如，假設你有一個名為 `d3` 的程式庫：

<code-example format="." language="bash">
npm install d3 --save
npm install @types/d3 --save-dev
</code-example>

為工作區中已安裝的程式庫所定義的 `@types/` 套件型別，會自動加入使用該程式庫的專案的 TypeScript 設定中。
TypeScript 預設會在 `node_modules/@types` 資料夾中尋找型別，因此你不需要逐一加入每個型別套件。

如果某個程式庫在 `@types/` 沒有可用的型別定義，你仍然可以透過手動為它加入型別定義來使用它。
做法如下：

1. 在你的 `src/` 資料夾中建立一個 `typings.d.ts` 檔案。這個檔案會自動被包含為全域型別定義。

2. 將下列程式碼加入 `src/typings.d.ts`。

```
declare module 'host' {
  export interface Host {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }
  export function parse(url: string, queryString?: string): Host;
}
```

3. 在使用該程式庫的元件或檔案中，加入下列程式碼。

```
import * as host from 'host';
const parsedUrl = host.parse('https://angular.io');
console.log(parsedUrl.hostname);
```

你可以依需要定義更多型別定義。

## 更新程式庫

程式庫可以由其發行者更新，自身也有需要保持最新的依賴。
若要檢查你已安裝的程式庫是否有更新，請使用 [`ng update` 指令](cli/update)。

使用 `ng update <lib_name>` 可以更新個別程式庫的版本。Angular CLI 會檢查該程式庫最新發行的版本，如果最新版本比你安裝的版本新，就會下載它，並更新你的 `package.json` 使其與最新版本一致。

當你將 Angular 更新到新版本時，你需要確認你使用的所有程式庫都是最新狀態。如果程式庫之間有相互依賴關係，你可能必須按照特定順序更新它們。
詳情請參閱 [Angular 更新指南](https://update.angular.io/)。

## 將程式庫加入執行階段的全域範圍

沒有被匯入應用程式的舊版 JavaScript 程式庫，可以加入執行階段的全域範圍，像放在 script 標籤中一樣載入。
在建置時使用 [CLI 設定檔](guide/workspace-config)（即 `angular.json`）中建置目標的 "scripts" 與 "styles" 選項，設定 CLI 來完成這件事。

例如，若要使用 [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/) 程式庫，先使用 npm 套件管理工具安裝程式庫及其依賴：

<code-example format="." language="bash">
npm install jquery --save
npm install popper.js --save
npm install bootstrap --save
</code-example>

在 `angular.json` 設定檔中，將相關的指令碼檔案加入 "scripts" 陣列：

```
"scripts": [
  "node_modules/jquery/dist/jquery.slim.js",
  "node_modules/popper.js/dist/umd/popper.js",
  "node_modules/bootstrap/dist/js/bootstrap.js"
],
```

將 Bootstrap CSS 檔案加入 "styles" 陣列：

```
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "src/styles.css"
],
```

執行或重新啟動 `ng serve`，即可在你的應用程式中看到 Bootstrap 4 正常運作。

### 在應用程式中使用執行階段全域程式庫

透過 "scripts" 陣列匯入程式庫之後，你**不應該**在 TypeScript 程式碼中用 import 陳述式匯入它（例如 `import * as $ from 'jquery';`）。
如果你這樣做，你就會有兩份不同的程式庫副本：一份以全域程式庫形式匯入，另一份以模組形式匯入。
這對帶有外掛程式的程式庫（例如 JQuery）尤其糟糕，因為每個副本會有不同的外掛程式。

相反地，請下載你的程式庫的型別定義（`npm install @types/jquery`），並依照程式庫的安裝步驟操作。如此你就能存取該程式庫公開的全域變數。

### 為執行階段全域程式庫定義型別

如果你需要使用的全域程式庫沒有全域型別定義，你可以在 `src/typings.d.ts` 中手動將它們宣告為 `any`。例如：

```
declare var libraryName: any;
```

有些指令碼會擴充其他程式庫；例如 JQuery 外掛程式：

```
$('.test').myPlugin();
```

在這種情況下，已安裝的 `@types/jquery` 不包含 `myPlugin`，因此你需要在 `src/typings.d.ts` 中加入一個介面。例如：

```
interface JQuery {
  myPlugin(options?: any): any;
}
```

如果你沒有為指令碼定義的擴充加入介面，你的 IDE 會顯示錯誤：

```
[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'
```
