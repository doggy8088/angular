# 使用 Schematics 產生程式碼

模式是一個基於範本的程式碼產生器，支援複雜的邏輯。
它是一組指令，用於透過產生或修改程式碼來轉換軟體專案。
模式會打包成集合並透過 npm 安裝。

架構集合可以是建立、修改及維護任何軟體專案的強大工具，但特別適用於客製化 Angular 專案以滿足您組織的特定需求。
例如，您可以使用架構來產生常用的 UI 模式或特定元件，方法是使用預先定義的範本或版面配置。
使用架構來強制執行架構規則和慣例，讓您的專案一致且可互通。

## Angular CLI 的 Schematics

範例是 Angular 生態系統的一部分。
Angular CLI 使用範例將轉換套用至網路應用程式專案。
您可以修改這些範例，並定義新的範例來執行一些事情，例如更新您的程式碼以修正相依項中的重大變更，或者將新的組態選項或架構新增至現有專案。

包含在 `@schematics/angular` 集合中的示意圖預設由指令 `ng generate` 和 `ng add` 執行。
此套件包含命名示意圖，用於設定 `ng generate` 子指令可用的選項，例如 `ng generate component` 和 `ng generate service`。
`ng generate` 的子指令是對應示意圖的簡寫。
若要指定並產生特定示意圖或示意圖集合，請使用長格式：

<docs-code language="shell">

ng generate my-schematic-collection:my-schematic-name

</docs-code>

以下文字混合了 HTML 和 Markdown 文件。請將文字翻譯成繁體中文，並保持格式不變。

or

<docs-code language="shell">

ng generate my-schematic-name --collection collection-name

</docs-code>

### 配置 CLI 架構圖表

與簡圖相關聯的 JSON 架構會告知 Angular CLI 指令和子指令有哪些選項可用，並決定預設值。
可以透過在指令列中提供選項的不同值來覆寫這些預設值。
請參閱 [工作區設定](reference/configs/workspace-config)以取得有關如何變更工作區的產生選項預設值之資訊。

CLI 用於產生專案和專案部分的預設綱要的 JSON 架構匯集在套件 [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular) 中。
該架構描述了 CLI 可用於每個 `ng generate` 子指令的選項，如 `--help` 輸出中所示。

## 開發函式庫電路圖

作為函式庫開發人員，您可以建立自己的自訂範本集合，以將函式庫與 Angular CLI 整合。

* 一個 *新增範例* 讓開發者使用 `ng add` 在 Angular 工作區中安裝您的函式庫
* *產生範例* 可以告訴 `ng generate` 子命令如何修改專案、新增組態和腳本，以及在您的函式庫中定義的鷹架工件
* 一個 *更新範例* 可以告訴 `ng update` 命令如何更新您的函式庫的依存關係，以及在您釋出新版本時調整中斷變更

有關這些看起來像什麼以及如何建立它們的更多詳細資訊，請參閱：

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="撰寫範例"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="範例庫"/>
</docs-pill-row>

### 新增電路圖

通常會提供一個 *增加示意圖* 和一個函式庫，以便可以使用 `ng add` 將函式庫新增到現有專案。
`add` 指令使用您的套件管理員下載新的依賴項，並呼叫以示意圖實作的安裝指令碼。

例如，[`@angular/material`](https://material.angular.io/guide/schematics) 示意圖告訴 `add` 指令安裝和設定 Angular Material 和主題，並註冊可以使用 `ng generate` 建立的新入門元件。
將此視為範例和模型，以便您建立自己的新增示意圖。

合作夥伴和第三方程式庫也支援帶有增加綱要的 Angular CLI。
例如，`@ng-bootstrap/schematics` 將 [ng-bootstrap](https://ng-bootstrap.github.io) 新增至應用程式，而 `@clr/angular` 安裝並設定 [Clarity from VMWare](https://clarity.design/documentation/get-started)。

*新增 schematic* 也可以使用設定變更來更新專案、新增其他相依性（例如 polyfill），或建立套件特定初始化程式碼。
例如，`@angular/pwa` schematic 會新增應用程式清單和服務工作者，將您的應用程式變成 PWA。

### Generation schematics

產生指令範例是 `ng generate` 指令的說明。
文件中的子指令使用預設的 Angular 產生指令範例，但你可以指定不同的指令範例 \(取代子指令\) 來產生你的函式庫中定義的工件。

例如，Angular Material 為其定義的 UI 元件提供產生指令碼。
以下命令使用其中一個指令碼來呈現已預先設定排序和分頁資料來源的 Angular Material `<mat-table>`。

<docs-code language="shell">

ng generate &commat;angular/material:table &lt;component-name&gt;

</docs-code>

### 更新範本

`ng update` 指令可用於更新工作區的函式庫相依性。
如果您沒有提供任何選項或使用說明選項，指令會檢查您的工作區並建議函式庫進行更新。

<docs-code language="shell">

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    &hyphen;-------------------------------------------------------------------------------
    &commat;angular/cdk                       7.2.2 -&gt; 7.3.1           ng update &commat;angular/cdk
    &commat;angular/cli                       7.2.3 -&gt; 7.3.0           ng update &commat;angular/cli
    &commat;angular/core                      7.2.2 -&gt; 7.2.3           ng update &commat;angular/core
    &commat;angular/material                  7.2.2 -&gt; 7.3.1           ng update &commat;angular/material
    rxjs                                      6.3.3 -&gt; 6.4.0           ng update rxjs

    There might be additional packages that are outdated.
    Run "ng update --all" to try to update all at the same time.


</docs-code>

如果您傳遞指令來更新一組函式庫 \(或 `--all` 旗標\)，它會更新那些函式庫、它們的對等相依項以及依賴它們的對等相依項。

HELPFUL：如果存在不一致（例如，如果對等相依項無法由簡單的 [semver](https://semver.io) 範圍匹配），指令會產生錯誤，且不會變更工作區中的任何項目。

我們建議您不要預設強制更新所有依賴項。
請先嘗試更新特定依賴項。

有關 `ng update` 命令如何運作的更多資訊，請參閱 [Update Command](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md)。

如果您建立一個含有潛在重大變更的新版本函式庫，您可以提供一個 *更新範例* 以啟用 `ng update` 指令，自動解決在更新專案中產生的任何此類變更。

例如，假設您想要更新 Angular Material 函式庫。

<docs-code language="shell">
ng update &commat;angular/material
</docs-code>

此命令會更新工作區 `package.json` 中的 `@angular/material` 及其依賴項 `@angular/cdk`。
如果任一套件包含涵蓋從現有版本移轉至新版本之更新示意圖，此命令會在工作區上執行該示意圖。
