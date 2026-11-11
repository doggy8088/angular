# 使用原理圖產生程式碼

原理圖是一種以範本為基礎的程式碼產生器，支援複雜的邏輯。
它是一組指示，用來透過產生或修改程式碼來轉換軟體專案。
原理圖會打包成集合，並透過 npm 安裝。

原理圖集合可以是建立、修改與維護任何軟體專案的強大工具，對於將 Angular 專案客製化成符合自家組織特定需求的樣子尤其有用。
舉例來說，你可以用原理圖來產生常用的 UI 模式或特定元件，並使用預先定義的範本或版面配置。
你也可以用原理圖來落實架構規則與慣例，讓專案保持一致且能互相配合。

## Angular CLI 的原理圖

原理圖是 Angular 生態系的一部分。
Angular CLI 使用原理圖，將轉換套用到 web 應用程式專案上。
你可以修改這些原理圖，也能定義新的原理圖，來做像是把程式碼更新以修正某個相依套件的破壞性變更，或是為既有專案新增設定選項或框架之類的事。

`ng generate` 與 `ng add` 指令預設會執行 `@schematics/angular` 集合中包含的原理圖。
這個套件包含具名的原理圖，用來設定 CLI 的 `ng generate` 子指令可用的選項，例如 `ng generate component` 與 `ng generate service`。
`ng generate` 的子指令就是對應原理圖的簡寫形式。
若要使用完整形式指定並產生特定的原理圖或原理圖集合：

```shell

ng generate my-schematic-collection:my-schematic-name

```

或

```shell

ng generate my-schematic-name --collection collection-name

```

### 設定 CLI 原理圖

與原理圖關聯的 JSON schema 會告訴 Angular CLI，指令與子指令有哪些可用選項，並決定預設值。
只要在指令列為某個選項提供不同的值，就能覆寫這些預設值。
關於如何變更工作區的產生選項預設值，請參閱[工作區設定](reference/configs/workspace-config)。

CLI 用來產生專案與專案各部分的預設原理圖，其 JSON schema 彙集在 [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular) 套件中。
schema 描述了 CLI 在每個 `ng generate` 子指令下可用的選項，如 `--help` 輸出所示。

## 為程式庫開發原理圖

身為程式庫開發者，你可以建立自己的自訂原理圖集合，把你的程式庫與 Angular CLI 整合起來。

- _新增原理圖_讓開發者能用 `ng add` 在 Angular 工作區中安裝你的程式庫
- _產生原理圖_可以告訴 `ng generate` 子指令如何修改專案、新增設定與指令碼，以及建構你的程式庫中定義的產物
- _更新原理圖_可以告訴 `ng update` 指令，在你發佈新版本時如何更新程式庫的相依套件，並因應破壞性變更做調整

想進一步了解這些原理圖的樣貌與建立方式，請參閱：

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="撰寫原理圖"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="程式庫的原理圖"/>
</docs-pill-row>

### 新增原理圖

_新增原理圖_通常會隨程式庫一起提供，讓程式庫能用 `ng add` 加入既有專案。
`add` 指令會用你的套件管理器下載新的相依套件，並叫用一個以原理圖實作的安裝指令碼。

舉例來說，[`@angular/material`](https://material.angular.dev/guide/schematics) 原理圖會告訴 `add` 指令安裝並設定 Angular Material 與主題，並註冊可以用 `ng generate` 建立的新起始元件。
可以把這個原理圖當作你自製新增原理圖的範例與範本。

合作夥伴與第三方程式庫也透過新增原理圖支援 Angular CLI。
舉例來說，`@ng-bootstrap/schematics` 會把 [ng-bootstrap](https://ng-bootstrap.github.io) 加入應用程式，`@clr/angular` 則會安裝並設定 [VMWare 的 Clarity](https://clarity.design/documentation/get-started)。

_新增原理圖_也能以設定變更來更新專案、加入額外的相依套件（例如 polyfill），或建構套件專屬的初始化程式碼。
舉例來說，`@angular/pwa` 原理圖會加入應用程式資訊清單與 service worker，把你的應用程式變成 PWA。

### 產生原理圖

產生原理圖是給 `ng generate` 指令的指示。
文件記載的子指令使用預設的 Angular 產生原理圖，但你可以指定不同的原理圖（取代子指令），來產生你的程式庫中定義的產物。

舉例來說，Angular Material 提供了它所定義之 UI 元件的產生原理圖。
下列指令使用其中一個原理圖，來呈現一個預先設定好資料來源、可供排序與分頁的 Angular Material `<mat-table>`。

```shell

ng generate @angular/material:table <component-name>

```

### 更新原理圖

`ng update` 指令可以用來更新工作區的程式庫相依套件。
如果你不提供任何選項或使用說明選項，該指令會檢查你的工作區，並建議要更新的程式庫。

```shell

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    &hyphen;-------------------------------------------------------------------------------
    @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
    @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
    @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
    @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
    rxjs                                      6.3.3 -> 6.4.0           ng update rxjs

```

如果你把要更新的程式庫集合傳給該指令，它會更新這些程式庫、它們的對等相依套件，以及相依於它們的對等相依套件。

HELPFUL: 如果出現不一致的情況（舉例來說，對等相依套件無法用簡單的 [semver](https://semver.io) 範圍比對成功），該指令會產生錯誤，且不會變更工作區中的任何東西。

我們建議你不要預設就強制更新所有相依套件。
先試著更新特定的相依套件。

想深入了解 `ng update` 指令的運作方式，請參閱[更新指令](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md)。

如果你發佈的程式庫新版本引入了潛在的破壞性變更，你可以提供一個_更新原理圖_，讓 `ng update` 指令能自動解決被更新專案中的這類變更。

舉例來說，假設你想更新 Angular Material 程式庫。

```shell
ng update @angular/material
```

這個指令會更新工作區 `package.json` 中的 `@angular/material` 及其相依套件 `@angular/cdk`。
如果任一套件包含涵蓋從現有版本遷移到新版本的更新原理圖，該指令就會在你的工作區上執行該原理圖。
