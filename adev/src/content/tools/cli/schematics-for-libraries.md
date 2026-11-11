# 程式庫的原理圖

當你建立 Angular 程式庫時，你可以提供原理圖並與程式庫一起打包，讓程式庫與 Angular CLI 整合。
有了你的原理圖，你的使用者可以用 `ng add` 安裝你程式庫的初始版本、
用 `ng generate` 建立你程式庫中定義的產物，並用 `ng update` 把他們的專案調整成因應你程式庫新版本所引入之破壞性變更的狀態。

這三種類型的原理圖都可以成為你與程式庫一起打包的集合的一部分。

## 建立原理圖集合

要開始建立集合，你需要先建立原理圖檔案。
下列步驟示範如何在不修改任何專案檔案的情況下，加入初始支援。

1. 在你程式庫的根資料夾中，建立一個 `schematics` 資料夾。
1. 在 `schematics/` 資料夾中，為你的第一個原理圖建立一個 `ng-add` 資料夾。
1. 在 `schematics` 資料夾的根層級，建立一個 `collection.json` 檔案。
1. 編輯 `collection.json` 檔案，為你的集合定義初始 schema。

    <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>
   - `$schema` 路徑是相對於 Angular Devkit 集合 schema 的相對路徑。
   - `schematics` 物件描述屬於這個集合的具名原理圖。
   - 第一個條目是名為 `ng-add` 的原理圖。
     它包含描述，並指向你的原理圖執行時會被呼叫的工廠函式。

1. 在你程式庫專案的 `package.json` 檔案中，加入一個 "schematics" 條目，值為你的 schema 檔案路徑。
   Angular CLI 執行指令時，會用這個條目在你的集合中尋找具名原理圖。

    <docs-code header="projects/my-lib/package.json (Schematics Collection Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="collection"/>

你剛建立的初始 schema 會告訴 CLI，到哪裡找支援 `ng add` 指令的原理圖。
現在你可以開始建立該原理圖了。

## 提供安裝支援

給 `ng add` 指令用的原理圖，可以強化使用者的初始安裝流程。
下列步驟定義這種類型的原理圖。

1. 前往 `<lib-root>/schematics/ng-add` 資料夾。
1. 建立主要檔案 `index.ts`。
1. 開啟 `index.ts`，加入你的原理圖工廠函式的原始碼。

    <docs-code header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

Angular CLI 會自動安裝程式庫的最新版本，而這個範例更進一步，把 `MyLibModule` 加入應用程式的根。`addRootImport` 函式接受一個需要傳回程式碼區塊的回呼函式。你可以在以 `code` 函式標記的字串中寫入任何程式碼，而任何外部符號都必須用 `external` 函式包起來，以確保產生適當的 import 陳述式。

### 定義相依套件的歸屬

使用 `ng-add` 的 `save` 選項，設定程式庫應該加入專案 `package.json` 設定檔的 `dependencies`、`devDependencies`，還是不儲存。

<docs-code header="projects/my-lib/package.json (ng-add Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="ng-add"/>

可能的值如下：

| 值              | 說明                                 |
| :------------------ | :-------------------------------------- |
| `false`             | 不要把套件加入 `package.json` |
| `true`              | 把套件加入 dependencies     |
| `"dependencies"`    | 把套件加入 dependencies     |
| `"devDependencies"` | 把套件加入 devDependencies  |

## 建置你的原理圖

若要把原理圖與程式庫一起打包，你必須設定程式庫將原理圖分開建置，然後把它們加入 bundle 中。
你必須在建置程式庫_之後_才建置原理圖，這樣它們才會放在正確的目錄中。

- 你的程式庫需要一個自訂的 TypeScript 設定檔，指示如何把原理圖編譯進你要發佈的程式庫
- 若要把原理圖加入程式庫的 bundle，請在程式庫的 `package.json` 檔案中加入指令碼

假設你的 Angular 工作區中有一個程式庫專案 `my-lib`。
若要告訴程式庫如何建置原理圖，請在設定程式庫建置的、已產生的 `tsconfig.lib.json` 檔案旁，加入一個 `tsconfig.schematics.json` 檔案。

1. 編輯 `tsconfig.schematics.json` 檔案，加入下列內容。

    <docs-code header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

   | 選項   | 說明                                                                                                          |
   | :-------- | :--------------------------------------------------------------------------------------------------------------- |
   | `rootDir` | 指定你的 `schematics` 資料夾包含要編譯的輸入檔案。                                 |
   | `outDir`  | 對應到程式庫的輸出資料夾。預設是工作區根目錄下的 `dist/my-lib` 資料夾。 |

1. 若要確保你的原理圖原始檔案被編譯進程式庫的 bundle，請把下列指令碼加入程式庫專案根資料夾（`projects/my-lib`）中的 `package.json` 檔案。

    <docs-code header="projects/my-lib/package.json (Build Scripts)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>
   - `build` 指令碼使用自訂的 `tsconfig.schematics.json` 檔案編譯你的原理圖
   - `postbuild` 指令碼在 `build` 指令碼完成後複製原理圖檔案
   - `build` 與 `postbuild` 兩個指令碼都需要 `copyfiles` 與 `typescript` 相依套件。
     若要安裝這些相依套件，請前往 `devDependencies` 中定義的路徑，在執行指令碼之前先執行 `npm install`。

## 提供產生支援

你可以把具名原理圖加入你的集合，讓使用者能用 `ng generate` 指令建立你程式庫中定義的產物。

我們先假設你的程式庫定義了一個需要一些設定的服務 `my-service`。
你希望使用者能用下列 CLI 指令來產生它。

<docs-code language="shell">

ng generate my-lib:my-service

</docs-code>

首先，在 `schematics` 資料夾中建立一個新的子資料夾 `my-service`。

### 設定新的原理圖

當你把原理圖加入集合時，你必須在集合的 schema 中指向它，並提供設定檔來定義使用者可以傳給指令的選項。

1. 編輯 `schematics/collection.json` 檔案，指向新的原理圖子資料夾，並加入一個指向 schema 檔案的指標，該檔案指定新原理圖的輸入。

    <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. 前往 `<lib-root>/schematics/my-service` 資料夾。
1. 建立一個 `schema.json` 檔案，定義原理圖可用的選項。

    <docs-code header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>
   - _id_: 集合中該 schema 的唯一 ID。
   - _title_: 該 schema 的人類可讀描述。
   - _type_: 屬性所提供型別的描述子。
   - _properties_: 定義原理圖可用選項的物件。

   每個選項都把鍵與型別、描述及選擇性的別名關聯起來。
   型別定義你預期值的形狀，而描述會在使用者要求你的原理圖的使用說明時顯示。

   原理圖選項的其他自訂方式，請參閱工作區 schema。

1. 建立一個 `schema.ts` 檔案，定義一個介面，存放 `schema.json` 檔案中定義之選項的值。

    <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

   | 選項 | 說明                                                                                                                                     |
   | :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
   | name    | 你想為所建立的服務提供的名稱。                                                                                       |
   | path    | 覆寫提供給原理圖的路徑。預設路徑值是以目前工作目錄為基準。                             |
   | project | 提供要執行原理圖的特定專案。在原理圖中，如果使用者沒有提供該選項，你可以提供預設值。 |

### 加入範本檔案

若要把產物加入專案，你的原理圖需要有自己的範本檔案。
原理圖範本支援特殊語法，可執行程式碼並進行變數替換。

1. 在 `schematics/my-service/` 資料夾中建立一個 `files/` 資料夾。
1. 建立一個名為 `__name@dasherize__.service.ts.template` 的檔案，定義一個用來產生檔案的範本。
   這個範本會產生一個服務，其中已經把 Angular 的 `HttpClient` 注入到 `http` 屬性。

    <docs-code lang="typescript" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';

    @Injectable({
      providedIn: 'root'
    })
    export class <%= classify(name) %>Service {
      private http = inject(HttpClient);
    }

    </docs-code>
   - `classify` 與 `dasherize` 方法是工具函式，你的原理圖用它們來轉換你的來源範本與檔案名稱。
   - `name` 是由你的工廠函式以屬性形式提供的。
     它就是你在 schema 中定義的那個 `name`。

### 加入工廠函式

基礎建設就緒之後，你就可以定義主要函式，在使用者的專案中執行你需要的修改。

Schematics 框架提供了一套檔案範本系統，同時支援路徑範本與內容範本。
這個系統處理定義在檔案或路徑中的預留位置，這些檔案與路徑載入於輸入的 `Tree` 中。
它使用傳入 `Rule` 的值來填入這些預留位置。

這些資料結構與語法的詳情，請參閱 [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md).

1. 建立主要檔案 `index.ts`，並加入你的原理圖工廠函式的原始碼。
1. 首先，匯入你需要的 schematics 定義。
   Schematics 框架提供許多工具函式，讓你在執行原理圖時建立與使用規則。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schematics-imports"/>

1. 匯入已定義的 schema 介面，它提供你的原理圖選項的型別資訊。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schema-imports"/>

1. 若要建立產生原理圖，請從一個空的規則工廠開始。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" visibleRegion="factory"/>

這個規則工廠傳回未經修改的樹。
這些 options 是從 `ng generate` 指令傳入的選項值。

## 定義產生規則

現在框架已經就緒，你可以建立真正修改使用者應用程式的程式碼，把應用程式設定成使用你程式庫中定義的服務。

使用者安裝了你的程式庫的 Angular 工作區，包含多個專案（應用程式與程式庫）。
使用者可以在指令列指定專案，或讓它使用預設值。
無論哪種情況，你的程式碼都需要找出這個原理圖要套用的特定專案，這樣你才能從專案設定中取得資訊。

使用傳入工廠函式的 `Tree` 物件來完成這件事。
`Tree` 的方法讓你可以存取工作區中完整的檔案樹，在原理圖執行期間讀寫檔案。

### 取得專案設定

1. 若要判斷目標專案，請使用 `workspaces.readWorkspace` 方法讀取工作區設定檔 `angular.json` 的內容。
   若要使用 `workspaces.readWorkspace`，你需要從 `Tree` 建立一個 `workspaces.WorkspaceHost`。
   把下列程式碼加入你的工廠函式。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="workspace"/>

   務必檢查脈絡是否存在，並擲出適當的錯誤。

1. 有了專案名稱之後，用它來取得專案專屬的設定資訊。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="project-info"/>

   `workspace.projects` 物件包含所有專案專屬的設定資訊。

1. `options.path` 決定原理圖套用之後，原理圖範本檔案要移動到哪裡。

   原理圖 schema 中的 `path` 選項，預設會以目前工作目錄替換。
   如果沒有定義 `path`，請使用專案設定中的 `sourceRoot` 以及 `projectType`。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="path"/>

### 定義規則

`Rule` 可以使用外部範本檔案、轉換它們，並傳回另一個帶有轉換後範本的 `Rule` 物件。
使用範本機制，產生你的原理圖所需的任何自訂檔案。

1. 把下列程式碼加入你的工廠函式。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="template"/>

   | 方法            | 說明                                                                                                                                                                                                                                          |
   | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `apply()`          | 把多個規則套用到一個來源，並傳回轉換後的來源。它接受 2 個引數：一個來源與一個規則陣列。                                                                                                                     |
   | `url()`            | 從你的檔案系統讀取來源檔案，路徑相對於原理圖。                                                                                                                                                                              |
   | `applyTemplates()` | 接受一個引數，內容是你想提供給原理圖範本與原理圖檔案名稱的方法與屬性。它傳回一個 `Rule`。你就在這裡定義 `classify()` 與 `dasherize()` 方法，以及 `name` 屬性。 |
   | `classify()`       | 接受一個值，並以每個單字首字母大寫的形式傳回該值。舉例來說，如果提供的名稱是 `my service`，傳回的是 `MyService`。                                                                                                             |
   | `dasherize()`      | 接受一個值，並以連字號分隔的小寫形式傳回該值。舉例來說，如果提供的名稱是 MyService，傳回的是 `my-service`。                                                                                                     |
   | `move()`           | 在原理圖套用時，把提供的來源檔案移動到它們的目的地。                                                                                                                                                              |

1. 最後，規則工廠必須傳回一個規則。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="chain"/>

   `chain()` 方法讓你把多個規則結合成單一規則，讓你能在單一原理圖中執行多個操作。
   在這裡，你只是把範本規則與原理圖執行的任何程式碼合併在一起。

完整的原理圖規則函式範例如下。

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

關於規則與工具方法的更多資訊，請參閱 [Provided Rules](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules).

## 執行你的程式庫原理圖

建置好你的程式庫與原理圖之後，你可以安裝原理圖集合，在你的專案上執行。
下列步驟示範如何使用你稍早建立的原理圖來產生服務。

### 建置你的程式庫與原理圖

在工作區的根目錄，為你的程式庫執行 `ng build` 指令。

<docs-code language="shell">

ng build my-lib

</docs-code>

接著，切換到你的程式庫目錄來建置原理圖

<docs-code language="shell">

cd projects/my-lib
npm run build

</docs-code>

### 連結程式庫

你的程式庫與原理圖會被打包並放在工作區根目錄的 `dist/my-lib` 資料夾中。
若要執行原理圖，你需要把程式庫連結到你的 `node_modules` 資料夾。
在工作區的根目錄，以你可發佈程式庫的路徑執行 `npm link` 指令。

<docs-code language="shell">

npm link dist/my-lib

</docs-code>

### 執行原理圖

程式庫安裝完成後，使用 `ng generate` 指令執行原理圖。

<docs-code language="shell">

ng generate my-lib:my-service --name my-data

</docs-code>

在主控台中，你會看到原理圖已執行，且 `my-data.service.ts` 檔案已在你的應用程式資料夾中建立。

<docs-code language="shell" hideCopy>

CREATE src/app/my-data.service.ts (208 bytes)

</docs-code>
