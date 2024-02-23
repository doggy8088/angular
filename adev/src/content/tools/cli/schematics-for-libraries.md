# 函式庫的 Schematic 圖

當您建立一個 Angular 函式庫時，您可以提供函式庫並將其與將其整合到 Angular CLI 的指令碼一同打包。
透過您的指令碼，您的使用者可以使用 `ng add` 安裝函式庫的初始版本、使用 `ng generate` 建立函式庫中定義的成品，以及使用 `ng update` 調整其專案，以符合引入重大變更的新版函式庫。

所有三種類型的原理圖都可以是您隨附在程式庫中的某個集合的一部分。

## 建立範例集

要開始建立集合，您需要建立示意圖檔案。
下列步驟會顯示您如何在不修改任何專案檔案的情況下，新增初步支援。

1. 在您的程式庫根目錄中，建立一個 `schematics` 資料夾。
1. 在 `schematics/` 資料夾中，建立一個 `ng-add` 資料夾，作為您的第一個原理圖。
1. 在 `schematics` 資料夾的根目錄中，建立一個 `collection.json` 檔案。
1. 編輯 `collection.json` 檔案，為您的集合定義初始的架構。

    <docs-code header="projects/my-lib/schematics/collection.json (原理圖集合)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>

    * `$schema` 路徑是相對於 Angular Devkit 集合架構。
    * `schematics` 物件描述了屬於此集合的命名原理圖。
    * 第一個條目是針對名為 `ng-add` 的原理圖。
        它包含描述，並指向在執行原理圖時所呼叫的工廠函數。

1. 在您的程式庫專案的 `package.json` 檔案中，新增一個「schematics」條目，並附上您的架構檔案路徑。
    Angular CLI 在執行指令時，會使用此條目來在您的集合中尋找命名原理圖。

    <docs-code header="projects/my-lib/package.json (原理圖集合參考)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="collection"/>

您已建立的初始架構會告訴 CLI 在哪裡可以找到支援 `ng add` 指令的示意圖。
現在您可以準備建立該示意圖。

## 提供安裝支援

`ng add` 指令的範例可以增強使用者最初的安裝程序。
下列步驟定義了這種範例。

1. 前往 `<lib-root>/schematics/ng-add` 資料夾。
1. 建立主檔案 `index.ts`。
1. 開啟 `index.ts` 並新增您的 schematic 工廠函數的原始碼。

    <docs-code header="projects/my-lib/schematics/ng-add/index.ts (ng-add 規則工廠)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

Angular CLI 會自動安裝最新版本的函式庫，而此範例進一步將 `MyLibModule` 新增至應用程式的根目錄。 `addRootImport` 函式接受需要傳回程式區塊的回呼。您可以在標記為 `code` 函式的字串內撰寫任何程式碼，且任何外部符號都必須以 `external` 函式包裝，以確保產生適當的匯入陳述式。

### 定義依賴類型

使用 `ng-add` 的 `save` 選項，可以設定是否將函式庫新增到專案的 `package.json` 組態檔案中的 `dependencies`、`devDependencies`，或完全不儲存。

<docs-code header="projects/my-lib/package.json (ng-add Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="ng-add"/>

可能的數值為：

| 值              | 詳細 |
|:---                 |:---     |
| `false`             | 不要將套件新增到 `package.json` |
| `true`              | 將套件新增到相依性     |
| `"dependencies"`    | 將套件新增到相依性     |
| `"devDependencies"` | 將套件新增到開發相依性  |

## 建立你的原理圖

若要將您的電路圖與您的程式庫一起打包，您必須將程式庫設定為單獨建置電路圖，然後將它們新增到該程式包。
您必須在建置您的程式庫 *之後* 建置您的電路圖，以便將它們放入正確的目錄。

* 您的程式庫需要一個自訂的 Typescript 組態檔案，其中包含有關如何將您的範例編譯到您的散佈式程式庫的說明
* 若要將範例新增到程式庫套件，請將腳本新增到程式庫的 `package.json` 檔案

假設您的 Angular 工作區中有一個名為 `my-lib` 的函式庫專案。
若要告訴函式庫如何建置圖式，請在產生的 `tsconfig.lib.json` 檔案旁新增一個 `tsconfig.schematics.json` 檔案，以設定函式庫建置。

1. 編輯 `tsconfig.schematics.json` 檔案，新增下列內容。

    <docs-code header="projects/my-lib/tsconfig.schematics.json (TypeScript 配置)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

    | 選項 | 詳細資料 |
    |:---     |:---     |
    | `rootDir` | 指定 `schematics` 資料夾包含要編譯的輸入檔案。                                 |
    | `outDir`  | 對應至函式庫的輸出資料夾。預設為工作區根目錄下的 `dist/my-lib` 資料夾。 |

1. 若要確保將 schematics 原始檔編譯至函式庫組合中，請將下列指令碼新增至函式庫專案根資料夾（`projects/my-lib`）中的 `package.json` 檔案。

    <docs-code header="projects/my-lib/package.json (建置指令碼)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>

    * `build` 指令碼使用自訂 `tsconfig.schematics.json` 檔案編譯您的 schematics
    * `postbuild` 指令碼在 `build` 指令碼完成後複製 schematics 檔案
    * `build` 和 `postbuild` 指令碼都需要 `copyfiles` 和 `typescript` 相依性。
        若要安裝相依性，請移至 `devDependencies` 中定義的路徑，並在執行指令碼前執行 `npm install`。

## 提供生成支援

您可以將命名架構新增至您的集合，讓您的使用者使用 `ng generate` 指令來建立在您的程式庫中定義的成品。

我們假設您的程式庫定義了一項服務 `my-service`，它需要一些設定。
您希望您的使用者能夠使用以下 CLI 指令來產生它。

<docs-code language="shell">

ng generate my-lib:my-service

</docs-code>

首先，在 `schematics` 資料夾中建立一個新的子資料夾 `my-service`。

### 設定新的範例

當您將架構圖新增至集合時，您必須在集合的架構中指向它，並提供設定檔來定義使用者可以傳遞給命令的選項。

1. 編輯 `schematics/collection.json` 檔案，指向新的 schematic 子資料夾，並包含指向指定新 schematic 輸入的 schema 檔案的指標。

    <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. 前往 `<lib-root>/schematics/my-service` 資料夾。
1. 建立 `schema.json` 檔案，並定義 schematic 可用的選項。

    <docs-code header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>

    * *id*: 該集合中 schema 的唯一 ID。
    * *title*: schema 的可讀描述。
    * *type*: 由屬性提供的類型的描述符。
    * *properties*: 定義 schematic 可用選項的物件。

    每個選項將鍵與類型、描述和選用別名關聯。
    該類型定義您預期的值的形狀，當使用者要求您的 schematic 的使用說明時，便會顯示該描述。

    請參閱工作區 schema，以取得 schematic 選項的其他自訂。

1. 建立 `schema.ts` 檔案，並定義儲存 `schema.json` 檔案中定義的選項值的介面。

    <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

    | 選項 | 詳細資料 |
    |:---     |:---     |
    | 名稱    | 您想要提供的已建立服務的名稱。                                                                                       |
    | 路徑    | 覆寫提供給 schematic 的路徑。預設路徑值基於目前的作業目錄。                             |
    | 專案 | 提供要執行 schematic 的特定專案。在 schematic 中，您可以提供預設值，如果使用者未提供該選項。 |

### 新增範本檔案

若要將成品加入專案，您的示意圖需要有自己的範本檔案。
示意圖範本支援特殊語法來執行程式碼與變數替換。

1. 在 `schematics/my-service/` 資料夾內建立 `files/` 資料夾。
1. 建立一個名為 `__name@dasherize__.service.ts.template` 的檔案，用於定義用於產生檔案的範本。

    此範本會產生一個服務，其中已將 Angular 的 `HttpClient` 注入其建構函數中。

    <docs-code lang="typescript" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

    import { Injectable } from '&commat;angular/core';
    import { HttpClient } from '&commat;angular/common/http';

    &commat;Injectable({
      providedIn: 'root'
    })
    export class &lt;%= classify(name) %&gt;Service {
      constructor(private http: HttpClient) { }
    }

    </docs-code>

    * `classify` 和 `dasherize` 方法是您的架構用於轉換您的來源範本和檔案名稱的工具函數。

    * `name` 提供為您的工廠函數的屬性。
        它與您在架構中定義的 `name` 相同。

### 加入工廠函數

現在，既然您已將基礎架構就定位，您可以定義執行您在使用者專案中所需修改的主函數。

Schematics 框架提供一個檔案範本系統，它同時支援路徑和內容範本。
系統在輸入 `Tree` 中載入檔案或路徑內定義的預留位置上運行。
它使用傳遞至 `Rule` 中的值來填入這些預留位置。

有關這些數據結構和語法的詳細資訊，請參閱 [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md)。

1. 建立主檔案 `index.ts`，並加入您的指令工廠函數的原始碼。
1. 首先，匯入您需要使用的指令定義。
    指令架構提供了許多工具函數來建立和使用規則，以便在執行指令時使用。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (匯入)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schematics-imports"/>

1. 匯入已定義的架構介面，它為您的指令選項提供類型資訊。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (架構匯入)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schema-imports"/>

1. 若要建立產生指令，請從空的規則工廠開始。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (初始規則)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" visibleRegion="factory"/>

此規則工廠不修改樹狀結構。
選項是從 `ng generate` 指令傳遞的選項值。

## 定義一個生成規則

現在您已設置好架構，可以建立實際修改使用者應用程式的程式碼，以設定您的程式庫中定義的服務。

使用者安裝函式庫的 Angular 工作空間包含多個專案（應用程式和函式庫）。
使用者可以在命令列上指定專案，或讓它預設。
在任一種情況下，您的程式碼都需要辨識這個示意圖套用的特定專案，以便您能從專案設定中擷取資訊。

利用傳遞到工廠函數的 `Tree` 物件執行此操作。
`Tree` 方法可讓您存取工作區中的完整檔案樹，讓您在執行結構圖期間讀取和寫入檔案。

### 取得專案設定檔

1. 若要判斷目的地專案，請使用 `workspaces.readWorkspace` 方法來讀取工作區設定檔 `angular.json` 的內容。
    要使用 `workspaces.readWorkspace`，您需要從 `Tree` 建立 `workspaces.WorkspaceHost`。
    將下列程式碼新增至您的工廠函數。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="workspace"/>

    務必檢查該內容是否存在，並擲出適當的錯誤。

1. 現在您已取得專案名稱，請使用它來擷取專案特定的設定資訊。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="project-info"/>

    `workspace.projects` 物件包含所有專案特定的設定資訊。

1. `options.path` 決定在套用架構後，架構範本檔案要移至何處。

    架構中的 `path` 選項預設會以目前的工作目錄取代。
    如果未定義 `path`，請使用專案設定中的 `sourceRoot` 和 `projectType`。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="path"/>

### 定義規則

`Rule` 可以使用外部範本檔案，將它們轉換，並傳回另一個具有轉換範本的 `Rule` 物件。
使用範本產生您的示意圖所需的任何自訂檔案。

1. 將以下程式碼新增至您的工廠函式。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (範本轉換)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="template"/>

    | 方法            | 詳細資料 |
    |:---                |:---     |
    | `apply()`          | 將多個規則套用到來源並傳回轉換後的來源。它需要 2 個參數，一個來源和一個規則陣列。                                                                                                                     |
    | `url()`            | 從您的檔案系統讀取來源檔案，相對於示意圖。                                                                                                                                                                              |
    | `applyTemplates()` | 接收方法和屬性的參數，您希望讓示意圖範本和示意圖檔案名稱可以使用這些參數和屬性。它會傳回一個 `Rule`。您可以在這裡定義 `classify()` 和 `dasherize()` 方法，以及 `name` 屬性。 |
    | `classify()`       | 取得值並傳回標題大小寫的值。例如，如果提供的名稱是 `my service`，則會傳回 `MyService`。                                                                                                             |
    | `dasherize()`      | 取得值並傳回以破折號分隔且為小寫的值。例如，如果提供的名稱是 `MyService`，則會傳回 `my-service`。                                                                                                     |
    | `move()`           | 在套用示意圖時，將提供的來源檔案移至其目的地。                                                                                                                                                              |

1. 最後，規則工廠必須傳回規則。

    <docs-code header="projects/my-lib/schematics/my-service/index.ts (鏈式規則)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="chain"/>

    `chain()` 方法讓您可以將多個規則合併成單一規則，以便您能在單一示意圖中執行多個操作。
    在這裡，您只會將範本規則與示意圖執行的任何程式碼合併。

請參閱以下示意規則函數的完整範例。

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

有關規則與實用方法的更多資訊，請參閱 [提供的規則](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules)。

## 執行您的庫存圖表

html
<p>
  您可以使用以下命令運行您的圖表。
</p>
<pre>
npm run schematic
</pre>

在您建置您的程式庫和結構圖後，您可以安裝結構圖集合，以針對您的專案執行。
下列步驟顯示您如何使用您先前建立的結構圖產生服務。

### 建立你的函式庫和原理圖

從工作區的根目錄，為您的函式庫執行 `ng build` 指令。

<docs-code language="shell">

ng build my-lib

</docs-code>

然後，您變更為您的程式庫目錄以建立原理圖

<docs-code language="shell">

cd projects/my-lib
npm run build

</docs-code>

### 連結函式庫

您的程式庫和示意圖已打包並放置在工作區根目錄下的 `dist/my-lib` 資料夾中。
如需執行示意圖，您需要將程式庫連結到您的 `node_modules` 資料夾中。
在工作區的根目錄中，以可發行程式庫的路徑執行 `npm link` 指令。

<docs-code language="shell">

npm link dist/my-lib

</docs-code>

### 執行原理圖

html
<p>To run the schematic, click the "Run" button in the toolbar. This will open the schematic in a new window. The schematic will run automatically and display the results in the window.</p>
<p>You can also run the schematic from the command line. To do this, open a terminal window and navigate to the directory where the schematic is located. Then, type the following command:</p>
<pre>schematic-cli run schematic.sch</pre>
<p>This will run the schematic and display the results in the terminal window.</p>

現在您的程式庫已安裝，使用 `ng generate` 指令執行示意圖。

<docs-code language="shell">

ng generate my-lib:my-service --name my-data

</docs-code>

在控制台中，您可以看到原理圖已執行，並且在您的應用程式資料夾中建立了 `my-data.service.ts` 檔案。

<docs-code language="shell" hideCopy>

CREATE src/app/my-data.service.ts (208 bytes)

</docs-code>

