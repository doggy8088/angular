# 程式庫的原理圖

建立 Angular 程式庫時，你可以為它提供並打包原理圖，讓它與 Angular CLI 整合。有了你的原理圖，使用者可以使用 `ng add` 安裝程式庫的初始版本，使用 `ng generate` 建立程式庫中定義的成品，並使用 `ng update` 調整其專案，以配合引入重大變更的程式庫新版本。

這三種類型的原理圖都可以成為你與程式庫一起打包的集合的一部分。

下載 <live-example downloadOnly>程式庫原理圖專案</live-example>，查看下列步驟的完整範例。

## 建立原理圖集合

要開始建立集合，你需要先建立原理圖檔案。 下列步驟示範如何在不修改任何專案檔案的情況下，加入初始支援。

1.  在程式庫的根資料夾中，建立一個 `schematics` 資料夾。
1.  在 `schematics/` 資料夾中，為你的第一個原理圖建立一個 `ng-add` 資料夾。
1.  在 `schematics` 資料夾的根層級，建立一個 `collection.json` 檔案。
1.  編輯 `collection.json` 檔案，為你的集合定義初始結構定義。

    <code-example header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="schematics-for-libraries/projects/my-lib/schematics/collection.1.json"></code-example>

    *   `$schema` 路徑是相對於 Angular Devkit 集合結構定義的。
    *   `schematics` 物件描述屬於此集合的具名原理圖。
    *   第一個項目是名為 `ng-add` 的原理圖。它包含描述，並指向在執行原理圖時呼叫的工廠函式。

1.  在程式庫專案的 `package.json` 檔案中，加入一個 "schematics" 項目，並附上你的結構定義檔案路徑。Angular CLI 在執行指令時，會使用此項目在你的集合中尋找具名原理圖。

    <code-example header="projects/my-lib/package.json (Schematics Collection Reference)" path="schematics-for-libraries/projects/my-lib/package.json" region="collection"></code-example>

你建立的初始結構定義會告訴 CLI 在哪裡找到支援 `ng add` 指令的原理圖。現在，你可以開始建立該原理圖了。

## 提供安裝支援

給 `ng add` 指令用的原理圖，可以強化使用者的初始安裝流程。 下列步驟定義這種類型的原理圖。

1.  前往 `<lib-root>/schematics/ng-add` 資料夾。
1.  建立主要檔案 `index.ts`。
1.  開啟 `index.ts`，並加入你的原理圖工廠函式的原始碼。

    <code-example header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"></code-example>

提供初步的 `ng add` 支援所需的唯一步驟，是使用 `SchematicContext` 觸發安裝任務。
該任務會使用使用者偏好的套件管理器，將程式庫加入專案的 `package.json` 設定檔，並安裝到專案的 `node_modules` 目錄。

在這個範例中，函式會接收目前的 `Tree`，並在不做任何修改的情況下將其傳回。
如有需要，你可以在套件安裝時進行額外設定，例如產生檔案、更新設定，或是你的程式庫所需的任何其他初步設定。

### 定義相依套件的歸屬

使用 `ng-add` 的 `save` 選項，設定程式庫應該加入專案 `package.json` 設定檔的 `dependencies`、`devDependencies`，還是不儲存。

<code-example header="projects/my-lib/package.json (ng-add Reference)" path="schematics-for-libraries/projects/my-lib/package.json" region="ng-add"></code-example>

可能的值有：

| 值 | 說明 |
|:---                 |:---     |
| `false` | 不要將套件加入 `package.json` |
| `true` | 將套件加入相依性 |
| `"dependencies"` | 將套件加入相依性 |
| `"devDependencies"` | 將套件加入 devDependencies |

## 建置你的原理圖

若要把原理圖與程式庫一起打包，你必須設定程式庫將原理圖分開建置，然後把它們加入 bundle 中。 你必須在建置程式庫_之後_才建置原理圖，這樣它們才會放在正確的目錄中。

*   你的程式庫需要一個自訂 TypeScript 設定檔，其中包含如何將原理圖編譯到你發佈的程式庫中的指示
*   若要將原理圖加入程式庫套件，請在程式庫的 `package.json` 檔案中加入指令碼

假設你的 Angular 工作區中有一個程式庫專案 `my-lib`。若要告訴程式庫如何建置原理圖，請在產生的 `tsconfig.lib.json` 檔案旁邊加入一個 `tsconfig.schematics.json` 檔案，該檔案用於設定程式庫建置。

1.  編輯 `tsconfig.schematics.json` 檔案，加入下列內容。

    <code-example header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"></code-example>

    | 選項 | 說明 |
    |:---     |:---     |
    | `rootDir` | 指定你的 `schematics` 資料夾包含要編譯的輸入檔案。 |
    | `outDir` | 對應到程式庫的輸出資料夾。預設情況下，這是工作區根目錄下的 `dist/my-lib` 資料夾。 |

1.  為了確保你的原理圖原始碼檔案會編譯到程式庫套件中，請在程式庫專案根資料夾（`projects/my-lib`）的 `package.json` 檔案中加入下列指令碼。

    <code-example header="projects/my-lib/package.json (Build Scripts)" path="schematics-for-libraries/projects/my-lib/package.json"></code-example>

    *   `build` 指令碼會使用自訂的 `tsconfig.schematics.json` 檔案編譯你的原理圖
    *   `postbuild` 指令碼會在 `build` 指令碼完成後複製原理圖檔案
    *   `build` 與 `postbuild` 指令碼都需要 `copyfiles` 與 `typescript` 相依性。若要安裝這些相依性，請前往 `devDependencies` 中定義的路徑，並在執行指令碼之前執行 `npm install`。

## 提供產生支援

你可以把具名原理圖加入你的集合，讓使用者能用 `ng generate` 指令建立你程式庫中定義的產物。

我們先假設你的程式庫定義了一個需要一些設定的服務 `my-service`。 你希望使用者能用下列 CLI 指令來產生它。

<code-example format="shell" language="shell">

ng generate my-lib:my-service

</code-example>

首先，在 `schematics` 資料夾中建立一個新的子資料夾 `my-service`。

### 設定新的原理圖

當你把原理圖加入集合時，你必須在集合的 schema 中指向它，並提供設定檔來定義使用者可以傳給指令的選項。

1.  編輯 `schematics/collection.json` 檔案，指向新的原理圖子資料夾，並加入一個指向 schema 檔案的指標，該檔案指定新原理圖的輸入。

    <code-example header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="schematics-for-libraries/projects/my-lib/schematics/collection.json"></code-example>

1.  前往 `<lib-root>/schematics/my-service` 資料夾。
1.  建立一個 `schema.json` 檔案，定義原理圖可用的選項。

    <code-example header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"></code-example>

    *   *id*：集合中結構定義的唯一 ID。
    *   *title*：結構定義的人類可讀描述。
    *   *type*：由屬性提供的類型的描述。
    *   *properties*：定義原理圖可用選項的物件。

每個選項都把鍵與型別、描述及選擇性的別名關聯起來。 型別定義你預期值的形狀，而描述會在使用者要求你的原理圖的使用說明時顯示。

原理圖選項的其他自訂方式，請參閱工作區 schema。

1.  建立一個 `schema.ts` 檔案，並定義一個介面來儲存 `schema.json` 檔案中定義的選項值。

    <code-example header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"></code-example>

| 選項 | 說明 |
    |:---     |:---     |
| name | 你想為建立的服務提供的名稱。 |
| path | 覆寫提供給原理圖的路徑。預設路徑值以目前的工作目錄為準。 |
| project | 提供要執行原理圖的特定專案。在原理圖中，如果使用者未提供選項，你可以提供預設值。 |

### 加入範本檔案

若要將成品加入專案，你的原理圖需要自己的範本檔案。原理圖範本支援執行程式碼與變數替換的特殊語法。

1.  在 `schematics/my-service/` 資料夾內建立一個 `files/` 資料夾。
1.  建立一個名為 `__name@dasherize__.service.ts.template` 的檔案，該檔案定義用於產生檔案的範本。此範本將產生一個服務，其建構子中已注入 Angular 的 `HttpClient`。

    <code-example lang="typescript" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

    import { Injectable } from '&commat;angular/core';
    import { HttpClient } from '&commat;angular/common/http';

    &commat;Injectable({
      providedIn: 'root'
    })
    export class &lt;%= classify(name) %&gt;Service {
      constructor(private http: HttpClient) { }
    }

    </code-example>

    *   `classify` 與 `dasherize` 方法是你的原理圖用來轉換來源範本與檔案名稱的工具函式。

    *   `name` 是由你的工廠函式提供的屬性。它與你在結構定義中定義的 `name` 相同。

### 加入工廠函式

基礎建設就緒之後，你就可以定義主要函式，在使用者的專案中執行你需要的修改。

Schematics 框架提供了一套檔案範本系統，同時支援路徑範本與內容範本。 這個系統處理定義在檔案或路徑中的預留位置，這些檔案與路徑載入於輸入的 `Tree` 中。 它使用傳入 `Rule` 的值來填入這些預留位置。

這些資料結構與語法的詳情，請參閱 [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md).

1.  建立主要檔案 `index.ts`，並加入你的原理圖工廠函式的原始碼。
1.  首先，匯入你需要的 schematics 定義。 Schematics 框架提供許多工具函式，讓你在執行原理圖時建立與使用規則。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schematics-imports"></code-example>

1.  匯入已定義的 schema 介面，它提供你的原理圖選項的型別資訊。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schema-imports"></code-example>

1.  若要建立產生原理圖，請從一個空的規則工廠開始。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" region="factory"></code-example>

這個規則工廠傳回未經修改的樹。 這些 options 是從 `ng generate` 指令傳入的選項值。

## 定義產生規則

現在框架已經就緒，你可以建立真正修改使用者應用程式的程式碼，把應用程式設定成使用你程式庫中定義的服務。

使用者安裝了你的程式庫的 Angular 工作區，包含多個專案（應用程式與程式庫）。 使用者可以在指令列指定專案，或讓它使用預設值。 無論哪種情況，你的程式碼都需要找出這個原理圖要套用的特定專案，這樣你才能從專案設定中取得資訊。

使用傳入工廠函式的 `Tree` 物件來完成這件事。 `Tree` 的方法讓你可以存取工作區中完整的檔案樹，在原理圖執行期間讀寫檔案。

### 取得專案設定

1.  若要判斷目標專案，請使用 `workspaces.readWorkspace` 方法讀取工作區設定檔 `angular.json` 的內容。 若要使用 `workspaces.readWorkspace`，你需要從 `Tree` 建立一個 `workspaces.WorkspaceHost`。 把下列程式碼加入你的工廠函式。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="workspace"></code-example>

務必檢查脈絡是否存在，並擲出適當的錯誤。

1. 有了專案名稱之後，用它來取得專案專屬的設定資訊。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Project)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-info"></code-example>

`workspace.projects` 物件包含所有專案專屬的設定資訊。

1.  `options.path` 決定原理圖套用之後，原理圖範本檔案要移動到哪裡。

原理圖 schema 中的 `path` 選項，預設會以目前工作目錄替換。 如果沒有定義 `path`，請使用專案設定中的 `sourceRoot` 以及 `projectType`。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="path"></code-example>

### 定義規則

`Rule` 可以使用外部範本檔案、轉換它們，並傳回另一個帶有轉換後範本的 `Rule` 物件。 使用範本機制，產生你的原理圖所需的任何自訂檔案。

1.  把下列程式碼加入你的工廠函式。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="template"></code-example>

| 方法 | 說明 |
    |:---                |:---     |
| `apply()` | 把多個規則套用到一個來源，並傳回轉換後的來源。它接受 2 個引數：一個來源與一個規則陣列。 |
| `url()` | 從你的檔案系統讀取來源檔案，路徑相對於原理圖。 |
| `applyTemplates()` | 接受一個引數，內容是你想提供給原理圖範本與原理圖檔案名稱的方法與屬性。它傳回一個 `Rule`。你就在這裡定義 `classify()` 與 `dasherize()` 方法，以及 `name` 屬性。 |
| `classify()` | 接受一個值，並以每個單字首字母大寫的形式傳回該值。舉例來說，如果提供的名稱是 `my service`，傳回的是 `MyService`。 |
| `dasherize()` | 接受一個值，並以連字號分隔的小寫形式傳回該值。舉例來說，如果提供的名稱是 MyService，傳回的是 `my-service`。 |
| `move()` | 在原理圖套用時，把提供的來源檔案移動到它們的目的地。 |

1.  最後，規則工廠必須傳回一個規則。

    <code-example header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="chain"></code-example>

`chain()` 方法讓你把多個規則結合成單一規則，讓你能在單一原理圖中執行多個操作。 在這裡，你只是把範本規則與原理圖執行的任何程式碼合併在一起。

完整的原理圖規則函式範例如下。

<code-example header="projects/my-lib/schematics/my-service/index.ts" path="schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"></code-example>

關於規則與工具方法的更多資訊，請參閱 [Provided Rules](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules).

## 執行你的程式庫原理圖

建置好你的程式庫與原理圖之後，你可以安裝原理圖集合，在你的專案上執行。 下列步驟示範如何使用你稍早建立的原理圖來產生服務。

### 建置你的程式庫與原理圖

在工作區的根目錄，為你的程式庫執行 `ng build` 指令。

<code-example format="shell" language="shell">

ng build my-lib

</code-example>

接著，切換到你的程式庫目錄來建置原理圖

<code-example format="shell" language="shell">

cd projects/my-lib
npm run build

</code-example>

### 連結程式庫

你的程式庫與原理圖會被打包並放在工作區根目錄的 `dist/my-lib` 資料夾中。 若要執行原理圖，你需要把程式庫連結到你的 `node_modules` 資料夾。 在工作區的根目錄，以你可發佈程式庫的路徑執行 `npm link` 指令。

<code-example format="shell" language="shell">

npm link dist/my-lib

</code-example>

### 執行原理圖

程式庫安裝完成後，使用 `ng generate` 指令執行原理圖。

<code-example format="shell" language="shell">

ng generate my-lib:my-service --name my-data

</code-example>

在主控台中，你會看到原理圖已執行，且 `my-data.service.ts` 檔案已在你的應用程式資料夾中建立。

<code-example language="shell" hideCopy>

CREATE src/app/my-data.service.ts (208 bytes)

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
