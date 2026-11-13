# 建立程式庫

本頁提供如何建立並發行新程式庫以擴充 Angular 功能的概念性總覽。

如果你發現自己需要在多個應用程式中解決同一個問題（或想與其他開發者分享你的解決方案），那你就有了一個程式庫的候選題目。
一個簡單的例子可能是一個按鈕，它會將使用者帶到你公司的網站，並且會包含在你公司建置的所有應用程式中。

## 開始使用

使用 Angular CLI，透過下列指令在新工作區中產生新的程式庫骨架。

<code-example language="bash">
 ng new my-workspace --create-application=false
 cd my-workspace
 ng generate library my-lib
</code-example>

`ng generate` 指令會在你的工作區中建立 `projects/my-lib` 資料夾，裡面包含一個 NgModule，其中有一個元件和一個服務。

<div class="alert is-helpful">

     如需進一步了解程式庫專案的結構，請參閱[專案檔案結構指南](guide/file-structure)中的[程式庫專案檔案](guide/file-structure#函式庫專案檔案)一節。

     使用單一儲存庫（monorepo）模式，以同一個工作區容納多個專案。
     請參閱[為多專案工作區進行設定](guide/file-structure#多個專案)。

</div>

當你產生新的程式庫時，工作區設定檔 `angular.json` 會被更新，加入一個類型為 `library` 的專案。

<code-example format="json">
"projects": {
  ...
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:ng-packagr",
        ...
</code-example>

使用 CLI 指令建置、測試並檢查（lint）專案：

<code-example language="bash">
 ng build my-lib
 ng test my-lib
 ng lint my-lib
</code-example>

請注意，為專案設定的建置器與應用程式專案的預設建置器不同。
這個建置器除了其他作用之外，還能確保程式庫一律使用 [AOT 編譯器](guide/aot-compiler)進行建置，無需指定 `--prod` 旗標。

若要讓程式庫程式碼能重複使用，你必須為它定義公開 API。這個「使用者層」定義了你的程式庫的使用者可以取用什麼。你的程式庫的使用者應該能透過單一匯入路徑，存取公開功能（例如 NgModule、服務提供者與一般工具函式）。

你的程式庫的公開 API 維護在程式庫資料夾中的 `public-api.ts` 檔案裡。
任何從這個檔案匯出的東西，在你的程式庫被匯入應用程式時都會公開。
使用 NgModule 來公開服務與元件。

你的程式庫應提供文件（通常是 README 檔案），說明安裝與維護方式。

## 將應用程式的部分功能重構為程式庫

若要讓你的解決方案能重複使用，你需要調整它，讓它不依賴應用程式專屬的程式碼。
將應用程式功能遷移到程式庫時，以下是一些需要考慮的事項。

* 元件、管道等宣告應設計為無狀態，也就是說，它們不依賴也不更改外部變數。如果你確實依賴狀態，你需要逐一評估每個情況，決定那是應用程式狀態，還是程式庫應管理的狀態。

* 元件內部訂閱的任何可觀察物件，都應在這些元件的生命週期內清理並處置。

* 元件應透過輸入來提供脈絡以展現其互動，並透過輸出將事件傳達給其他元件。

* 檢查所有內部依賴。
   * 對於元件或服務中使用的自訂類別或介面，請檢查它們是否依賴其他也需要遷移的類別或介面。
   * 同樣地，如果你的程式庫程式碼依賴某個服務，該服務也需要遷移。
   * 如果你的程式庫程式碼或其範本依賴其他程式庫（例如 Angular Material），你必須為程式庫設定這些依賴。

* 思考如何向用戶端應用程式提供服務。

   * 服務應自行宣告其提供者，而不是在 NgModule 或元件中宣告提供者。宣告提供者會讓該服務可進行*搖樹優化*。這麼做可讓編譯器在服務從未被注入到匯入程式庫的應用程式時，將其排除在套件之外。更多資訊請參閱[可搖樹優化的提供者](guide/architecture-services#提供服務)。

   * 如果你註冊全域服務提供者，或在多個 NgModule 之間共用提供者，請使用 [RouterModule](api/router/RouterModule) 提供的 [`forRoot()` 與 `forChild()` 設計模式](guide/singleton-services)。

   * 如果你的程式庫提供可能不會被所有用戶端應用程式使用的選用服務，請使用[輕量權杖設計模式](guide/lightweight-injection-tokens)，為該情況支援適當的搖樹優化。

{@a integrating-with-the-cli}

## 透過程式碼產生原理圖與 CLI 整合

程式庫通常包含*可重複使用的程式碼*，用來定義元件、服務與其他 Angular 產物（管道、指令等），供你直接匯入專案中。
程式庫會被包裝成 npm 套件，以便發行與分享。
這個套件也可以包含[原理圖](guide/glossary#原理圖（schematic）)，為直接在你的專案中產生或轉換程式碼提供指示，就像 CLI 以 `ng generate component` 建立一個通用的新元件一樣。
與程式庫一起包裝的原理圖，例如可以向 Angular CLI 提供所需的資訊，產生一個能設定並使用該程式庫所定義的特定功能（或一組功能）的元件。
其中一個例子是 [Angular Material 的導航原理圖](https://material.angular.io/guide/schematics#navigation-schematic)，它設定 CDK 的 [BreakpointObserver](https://material.angular.io/cdk/layout/overview#breakpointobserver)，並將它與 Material 的 [MatSideNav](https://material.angular.io/components/sidenav/overview) 及 [MatToolbar](https://material.angular.io/components/toolbar/overview) 元件一起使用。

建立並包含下列種類的原理圖：

* 包含一個安裝原理圖，讓 `ng add` 能將你的程式庫加入專案。

* 在你的程式庫中包含產生原理圖，讓 `ng generate` 能在專案中為你定義的產物（元件、服務、測試等）搭建鷹架。

* 包含一個更新原理圖，讓 `ng update` 能更新你的程式庫的依賴，並為新版本中的破壞性變更提供遷移。

你在程式庫中包含什麼，取決於你的任務。
例如，你可以定義一個原理圖，建立一個預先填入罐頭資料的下拉選單，展示如何將它加入應用程式。
如果你想要一個每次包含不同傳入值的下拉選單，你的程式庫可以定義一個原理圖，以給定的設定來建立它。開發者接著就能用 `ng generate` 為自己的應用程式設定一個實例。

假設你想讀取一個設定檔，然後根據該設定產生一個表單。
如果該表單需要由使用你的程式庫的開發者做額外客製化，做成原理圖可能最合適。
然而，如果表單永遠都是同一個樣子，不太需要開發者客製化，那麼你可以建立一個動態元件，接收設定並產生表單。
一般來說，客製化越複雜，原理圖的做法就越有用。

更多資訊請參閱[原理圖總覽](guide/schematics)與[程式庫的原理圖](guide/schematics-for-libraries)。

## 發行你的程式庫

使用 Angular CLI 與 npm 套件管理工具，將你的程式庫建置並發行為 npm 套件。


在將程式庫發行到 NPM 之前，使用 `--prod` 旗標來建置它，這會使用較舊的編譯器與執行環境，也就是 View Engine，而不是 Ivy。

<code-example language="bash">
ng build my-lib --prod
cd dist/my-lib
npm publish
</code-example>

如果你從未在 npm 發行過套件，你必須建立一個使用者帳戶。更多資訊請參閱 [Publishing npm Packages](https://docs.npmjs.com/getting-started/publishing-npm-packages)。

<div class="alert is-important">

目前不建議將 Ivy 程式庫發行到 NPM，因為 Ivy 產生的程式碼無法向後相容於 View Engine，因此使用 View Engine 的應用程式將無法取用它們。此外，Ivy 的內部指令尚未穩定，可能會讓使用與建置該程式庫不同 Angular 版本的取用者發生問題。

當已發行的程式庫被 Ivy 應用程式使用時，Angular CLI 會自動使用一個稱為 Angular 相容性編譯器（`ngcc`）的工具將它轉換為 Ivy。因此，使用 View Engine 編譯器來發行你的程式庫，能確保 View Engine 與 Ivy 應用程式都能透明地取用它們。

</div>


{@a lib-assets}

## 在程式庫中管理素材

從 [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) 工具的 9.x 版開始，你可以設定該工具在建置過程中自動將素材複製到你的程式庫套件中。
當你的程式庫需要發行選用的主題檔案、Sass mixin 或文件（例如更新記錄）時，請使用這項功能。

* 了解如何[在建置過程中將素材複製到你的程式庫](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md)。

* 進一步了解如何使用這個工具[將素材嵌入 CSS](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md)。

## 連結的程式庫

在開發已發行的程式庫時，使用 [npm link](https://docs.npmjs.com/cli/link)，避免每次建置都重新安裝程式庫。

程式庫在每次變更時都必須重新建置。
連結程式庫時，請確保建置步驟以監看模式執行，且程式庫的 `package.json` 設定指向正確的進入點。
例如，`main` 應指向 JavaScript 檔案，而不是 TypeScript 檔案。

### 對對等依賴使用 TypeScript 路徑對應

Angular 程式庫應將所有 `@angular/*` 依賴列為對等依賴。
這能確保當各模組要求 Angular 時，它們全都取得完全相同的模組。
如果某個程式庫將 `@angular/core` 列在 `dependencies` 而非 `peerDependencies` 中，它可能改取得另一個不同的 Angular 模組，進而導致你的應用程式壞掉。

在開發程式庫時，你必須透過 `devDependencies` 安裝所有對等依賴，確保程式庫能正確編譯。
連結的程式庫接著會有一組自己用於建置的 Angular 程式庫，位於它的 `node_modules` 資料夾中。
不過，這在建置或執行你的應用程式時可能造成問題。

要繞過這個問題，請使用 TypeScript 路徑對應，告訴 TypeScript 應從特定位置載入某些模組。
把你的程式庫使用的所有對等依賴列在工作區的 TypeScript 設定檔 `./tsconfig.json` 中，並將它們指向應用程式 `node_modules` 資料夾中的本機副本。

```
{
  "compilerOptions": {
    // ...
    // paths are relative to `baseUrl` path.
    "paths": {
      "@angular/*": [
        "./node_modules/@angular/*"
      ]
    }
  }
}
```

這個對應能確保你的程式庫永遠載入它所需模組的本機副本。


## 在應用程式中使用你自己的程式庫

你不需要將程式庫發行到 npm 套件管理工具，就能在你自己的應用程式中使用它，但你必須先建置它。

若要在應用程式中使用你自己的程式庫：

* 建置程式庫。程式庫在建置完成前無法使用。
 <code-example language="bash">
 ng build my-lib
 </code-example>

* 在你的應用程式中，以名稱從程式庫匯入：
 ```
 import { myExport } from 'my-lib';
 ```

### 建置與重新建置你的程式庫

如果你尚未將程式庫發行為 npm 套件，再從 npm 將套件安裝回你的應用程式，建置步驟就很重要。
例如，如果你複製（clone）你的 git 儲存庫並執行 `npm install`，若你尚未建置程式庫，你的編輯器會將 `my-lib` 的匯入顯示為遺失。

<div class="alert is-helpful">

當你在 Angular 應用程式中從程式庫匯入某個東西時，Angular 會尋找程式庫名稱與磁碟位置之間的對應。
安裝程式庫套件時，對應關係位於 `node_modules` 資料夾中。自行建置程式庫時，則必須在 `tsconfig` 的 paths 中找到對應關係。

使用 Angular CLI 產生程式庫時，會自動將它的路徑加入 `tsconfig` 檔案。
Angular CLI 使用 `tsconfig` 路徑，告訴建置系統去哪裡找程式庫。

</div>

如果你發現程式庫的變更沒有反映在你的應用程式中，你的應用程式很可能使用的是舊的程式庫建置結果。

每當你變更程式庫時，你都可以重新建置它，但這個額外的步驟很花時間。
*增量建置*功能改善了程式庫的開發體驗。
每次有檔案變更時，系統會執行部分建置，只產出被修改的檔案。

增量建置可以作為背景程序在你的開發環境中執行。若要利用這項功能，請在建置指令中加入 `--watch` 旗標：

<code-example language="bash">
ng build my-lib --watch
</code-example>

<div class="alert is-important">

CLI 的 `build` 指令對程式庫使用不同的建置器，並呼叫與應用程式不同的建置工具。

* 應用程式的建置系統 `@angular-devkit/build-angular` 以 `webpack` 為基礎，包含在所有新的 Angular CLI 專案中。
* 程式庫的建置系統以 `ng-packagr` 為基礎。只有在你使用 `ng generate library my-lib` 加入程式庫時，才會將其加入你的依賴。

這兩個建置系統支援的東西不同，即使支援相同的東西，做法也不一樣。
這表示同一份 TypeScript 原始碼，在建置後的程式庫中產生的 JavaScript 程式碼，可能與在建置後的應用程式中產生的不同。

正因如此，依賴某個程式庫的應用程式，應只使用指向*已建置程式庫*的 TypeScript 路徑對應。
TypeScript 路徑對應*不應*指向程式庫的原始 `.ts` 檔案。

</div>
