# Angular 元件總覽

元件是 Angular 應用程式的主要建構區塊。每個元件包含：

* 用來宣告頁面上呈現內容的 HTML 範本
* 定義行為的 TypeScript 類別
* 定義元件在範本中使用方式的 CSS 選擇器
* 選擇性地，套用到範本的 CSS 樣式

本主題說明如何建立與設定 Angular 元件。

<div class="alert is-helpful">

若要檢視或下載本主題使用的範例程式碼，請參閱 <live-example></live-example>。

</div>

## 必要條件

若要建立元件，請確認你已符合下列必要條件：

1. [安裝 Angular CLI。](guide/setup-local#安裝-angular-cli)
1. [建立 Angular 工作區](guide/setup-local#建立工作區與初始應用程式)與初始應用程式。
   如果你還沒有專案，請使用 `ng new <project-name>` 建立一個，其中 `<project-name>` 是你的 Angular 應用程式名稱。

## 建立元件

建立元件最簡單的方式是使用 Angular CLI。你也可以手動建立元件。

### 使用 Angular CLI 建立元件

若要使用 Angular CLI 建立元件：

1. 在終端機視窗中，前往包含你的應用程式的目錄。
1. 執行 `ng generate component <component-name>` 命令，其中 `<component-name>` 是你的新元件名稱。

根據預設，此命令會建立下列項目：

* 以元件命名的資料夾
* 元件檔案 `<component-name>.component.ts`
* 範本檔案 `<component-name>.component.html`
* CSS 檔案 `<component-name>.component.css`
* 測試規格檔案 `<component-name>.component.spec.ts`

其中 `<component-name>` 是你的元件名稱。

<div class="alert is-helpful">

你可以變更 `ng generate component` 建立新元件的方式。更多資訊請參閱 Angular CLI 文件中的 [ng generate component](cli/generate#component-command)。

</div>

### 手動建立元件

雖然 Angular CLI 是建立 Angular 元件最簡單的方式，你也可以手動建立元件。本節說明如何在現有的 Angular 專案中建立核心元件檔案。

若要手動建立新元件：

1. 前往你的 Angular 專案目錄。
1. 建立新檔案 `<component-name>.component.ts`。
1. 在檔案頂端加入下列 import 陳述式。

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="import">
   </code-example>

1. 在 `import` 陳述式之後，加入 `@Component` 裝飾器。

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="decorator-skeleton">
   </code-example>

1. 為元件選擇一個 CSS 選擇器。

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="selector">
   </code-example>

   關於選擇器的選擇方式，更多資訊請參閱[指定元件的 CSS 選擇器](#指定元件的-css-選擇器)。

1. 定義元件用來顯示資訊的 HTML 範本。
   在大多數情況下，這個範本是獨立的 HTML 檔案。

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="templateUrl">
   </code-example>

   關於定義元件範本的方式，更多資訊請參閱[定義元件的範本](#定義元件的範本)。

1. 選擇元件範本的樣式。
   在大多數情況下，你會在獨立的檔案中定義元件範本的樣式。

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="decorator">
   </code-example>

1. 加入包含元件程式碼的 `class` 陳述式。

   <code-example
        path="component-overview/src/app/component-overview/component-overview.component.ts"
        region="class">
   </code-example>

## 指定元件的 CSS 選擇器

每個元件都需要一個 CSS *選擇器*。選擇器會指示 Angular，在範本 HTML 中找到對應的標籤時，實例化這個元件。例如，假設有一個元件 `hello-world.component.ts`，其選擇器定義為 `app-hello-world`。這個選擇器會指示 Angular，每當範本中出現 `<app-hello-world>` 標籤時，就實例化這個元件。

若要指定元件的選擇器，請在 `@Component` 裝飾器中加入 `selector` 敘述。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.ts"
    region="selector">
</code-example>

## 定義元件的範本

範本是一段 HTML，會告訴 Angular 如何在你的應用程式中呈現元件。你可以透過兩種方式為元件定義範本：參照外部檔案，或直接寫在元件內。

若要將範本定義為外部檔案，請在 `@Component` 裝飾器中加入 `templateUrl` 屬性。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.ts"
    region="templateUrl">
</code-example>

若要在元件內定義範本，請在 `@Component` 裝飾器中加入 `template` 屬性，其中包含你想使用的 HTML。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.1.ts"
    region="template">
</code-example>

如果你想讓範本橫跨多行，請使用反引號 (<code> ` </code>)。
例如：

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.2.ts"
    region="templatebacktick">
</code-example>

<div class="alert is-helpful">

Angular 元件需要使用 `template` 或 `templateUrl` 定義範本。一個元件不能同時擁有這兩個敘述。

</div>

## 宣告元件的樣式

透過下列兩種方式之一，宣告用於元件範本的元件樣式：參照外部檔案，或直接寫在元件內。

若要在獨立的檔案中宣告元件的樣式，請在 `@Component` 裝飾器中加入 `styleUrls` 屬性。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.ts"
    region="decorator">
</code-example>

若要在元件內宣告樣式，請在 `@Component` 裝飾器中加入 `styles` 屬性，其中包含你想使用的樣式。

<code-example
    path="component-overview/src/app/component-overview/component-overview.component.3.ts"
    region="styles">
</code-example>

`styles` 屬性接受一個字串陣列，其中包含 CSS 規則宣告。


## 後續步驟

* 關於元件的架構總覽，請參閱[元件與範本簡介](guide/architecture-components)。
* 關於建立元件時可用的其他選項，請參閱 API 參考中的 [Component](api/core/Component)。
* 關於元件樣式的更多資訊，請參閱[元件樣式](guide/component-styles)。
* 關於範本的更多資訊，請參閱[範本語法](guide/template-syntax)。

@reviewed 2021-03-18
