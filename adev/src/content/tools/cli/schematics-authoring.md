# 撰寫原理圖

您可以建立自己的範本來操作 Angular 專案。
程式庫開發人員通常會將範本封裝到他們的程式庫中，以將它們與 Angular CLI 整合。
您也可以建立獨立的範本來處理 Angular 應用程式中的檔案和結構，以便為您的開發環境自訂它們，並使它們符合您的標準和約束。
範本可以串聯，執行其他範本來執行複雜的操作。

操作應用程式中的程式碼有潛在的強大功能，相應地也具有危險性。
例如，建立一個已經存在的檔案會是錯誤的，如果它立即套用，它會捨棄到目前為止套用過的所有其他變更。
Angular Schematics 工具透過建立虛擬檔案系統來防止副作用和錯誤。
示意圖描述可以套用至虛擬檔案系統的轉換管線。
當示意圖執行時，這些轉換會記錄在記憶體中，並且只在確認它們有效後才在真實檔案系統中套用。

## 電路圖概念

schematics 的公開 API 定義代表基本概念的類別。

* 虛擬檔案系統由 `Tree` 表示。
    `Tree` 資料結構包含一個 *基本值*（一組已存在的檔案）和一個 *暫存區*（要套用到基本值的一系列變更）。
    當進行修改時，您並未實際變更基本值，而是將這些修改新增到暫存區。

* `Rule` 物件定義一個函式，該函式會採用 `Tree`，套用轉換，並傳回新的 `Tree`。
    架構的 main 檔案 `index.ts` 定義了一組規則，這些規則會實作架構的邏輯。

* 轉換以 `Action` 表示。
    有四種類型的動作：`Create`、`Rename`、`Overwrite` 和 `Delete`。

* 每個架構都會在由 `SchematicContext` 物件表示的內容中執行。

傳遞到規則的內容物件提供存取實用程式功能和可能需要搭配 Schematic 使用的元資料，包括有助於除錯的記錄 API。

內容也定義 *合併策略*，用於決定如何將變更從暫存樹合併到基礎樹。

變更可以被接受或忽略，或擲出例外。

### 定義規則和動作

當您使用 [Schematics CLI](#cli) 建立新的空白示意圖時，產生的輸入函式是一個 *規則工廠*。
`RuleFactory` 物件定義一個建立 `Rule` 的高階函式。

<docs-code header="index.ts" language="typescript">

import { Rule, SchematicContext, Tree } from '&commat;angular-devkit/schematics';

// You don't have to export the function as default.
// You can also have more than one rule factory per file.
export function helloWorld(_options: any): Rule {
 return (tree: Tree,_context: SchematicContext) =&gt; {
   return tree;
 };
}

</docs-code>

您的規則可以透過呼叫外部工具和實作邏輯來對專案進行變更。
例如，您需要一個規則來定義如何將原理圖中的範本併入主機專案。

規則可以利用 `@schematics/angular` 套件提供的實用工具。
尋找可協助處理模組、相依性、TypeScript、AST、JSON、Angular CLI 工作區和專案等等的輔助函式。

<docs-code header="index.ts" language="typescript">

import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '&commat;angular-devkit/core';

</docs-code>

### 使用 schema 和介面定義輸入選項

規則可以從呼叫者收集選項值並將其注入範本中。
規則可用的選項及其允許值和預設值，定義在範本的 JSON schema 檔案 `<schematic>/schema.json` 中。
使用 TypeScript 介面為 schema 定義變數或列舉資料類型。

該架構定義了在原理圖中使用的變數類型和預設值。
例如，假設的「Hello World」原理圖可能具有以下架構。

<docs-code header="src/hello-world/schema.json" language="json">

{
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "default": "world"
        },
        "useColor": {
            "type": "boolean"
        }
    }
}
</docs-code>

有關 Angular CLI 命令 schematics 的範例檔案，請參閱 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json)。

### 示意圖提示

示意圖 *提示* 將使用者互動引入示意圖執行。
配置示意圖選項以顯示使用者可自訂的問題。
提示會在示意圖執行前顯示，然後使用回應做為選項的值。
這讓使用者可以引導示意圖的運作，而不需要深入了解所有可用選項。

「Hello World」範例可能會要求使用者輸入其名稱，並將該名稱顯示在預設名稱「world」的位置。
若要定義此提示，請將 `x-prompt` 屬性新增至 `name` 變數的範例。

同樣地，您可以新增提示，讓使用者決定在執行 hello 動作時，是否使用彩色圖表。
具有這兩個提示的範例如下。

<docs-code header="src/hello-world/schema.json" language="json">

{
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "default": "world",
            "x-prompt": "What is your name?"
        },
        "useColor": {
            "type": "boolean",
            "x-prompt": "Would you like the response in color?"
        }
    }
}
</docs-code>

#### 提示簡短語法

以下範例使用提示語法的簡寫形式，僅提供問題文字。
在多數情況下，這就足夠了。
然而，請注意，這兩個提示語法預期有不同類型的輸入。
當使用簡寫形式時，系統會根據該屬性的結構自動選擇最合適的類型。
在範例中，`name` 提示語法使用 `input` 類型，因為它是一個字串屬性。
`useColor` 提示語法使用 `confirmation` 類型，因為它是一個布林值屬性。
在此情況下，「是」對應到 `true`，而「否」對應到 `false`。

支援三種輸入類型。

| 輸入類型   | 詳細資料 |
|:---          |:----    |
| 確認 | 是或否的問題；最適合布林選項。   |
| 輸入        | 文字輸入；最適合字串或數字選項。 |
| 清單         | 一組預先定義的允許值。                |

在簡短形式中，類型會從屬性的類型和約束推斷出來。

| 屬性模式 | 提示類型 |
|:---             |:---         |
| "type": "boolean"  | 確認 \("yes"=`true`, "no"=`false`\)  |
| "type": "string"   | 輸入                                        |
| "type": "number"   | 輸入 \(僅接受有效的數字\)        |
| "type": "integer"  | 輸入 \(僅接受有效的數字\)        |
| "enum": [&hellip;] | 清單 \(列舉成員變成清單選項\) |

在以下範例中，屬性採用列舉值，因此示意圖會自動選擇清單類型，並從可能值中建立選單。

<docs-code header="schema.json" language="json">

"style": {
  "description": "The file extension or preprocessor to use for style files.",
  "type": "string",
  "default": "css",
  "enum": [
    "css",
    "scss",
    "sass",
    "less",
    "styl"
  ],
  "x-prompt": "Which stylesheet format would you like to use?"
}

</docs-code>

提示執行階段會根據 JSON 架構中提供的約束自動驗證提供的回應。
如果該值不可接受，系統會提示使用者輸入新的值。
這可確保傳遞至示意圖的任何值都符合示意圖實作的預期，因此您不需要在示意圖的程式碼中新增其他檢查。

#### 提示長格式語法

`x-prompt` 欄位語法支援長格式，適用於需要額外自訂和控制提示的情況。
在此格式中，`x-prompt` 欄位值是一個 JSON 物件，其中包含自訂提示行為的子欄位。

| 欄位   | 資料值 |
|:---     |:---        |
| type    | `confirmation`, `input`, 或 `list` \(在短表單中自動選取\) |
| message | 字串 \(必填\)                                                         |
| items   | 字串和/或標籤/值物件配對 \(僅在 type 為 `list` 時有效\)       |

以下長格式範例取自用於 [產生應用程式](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56) 的示意圖的 JSON 架構。
它定義了提示，讓使用者選擇要為所建立的應用程式使用的樣式預處理器。
透過使用長格式，示意圖可以提供選單選項更明確的格式。

<docs-code header="package/schematics/angular/application/schema.json" language="json">

"style": {
  "description": "The file extension or preprocessor to use for style files.",
  "type": "string",
  "default": "css",
  "enum": [
    "css",
    "scss",
    "sass",
    "less"
  ],
  "x-prompt": {
    "message": "Which stylesheet format would you like to use?",
    "type": "list",
    "items": [
      { "value": "css",  "label": "CSS" },
      { "value": "scss", "label": "SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]" },
      { "value": "sass", "label": "Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]" },
      { "value": "less", "label": "Less   [ https://lesscss.org/                                            ]" }
    ]
  },
},

</docs-code>

#### x-prompt 架構

定義示意圖選項的 JSON 架構支援擴充功能，允許宣告式定義提示及其各自的行為。
不需要對示意圖的程式碼進行額外邏輯或變更，即可支援提示。
下列 JSON 架構是 `x-prompt` 欄位的長格式語法的完整說明。

<docs-code header="x-prompt schema" language="json">

{
    "oneOf": [
        { "type": "string" },
        {
            "type": "object",
            "properties": {
                "type": { "type": "string" },
                "message": { "type": "string" },
                "items": {
                    "type": "array",
                    "items": {
                        "oneOf": [
                            { "type": "string" },
                            {
                                "type": "object",
                                "properties": {
                                    "label": { "type": "string" },
                                    "value": { }
                                },
                                "required": [ "value" ]
                            }
                        ]
                    }
                }
            },
            "required": [ "message" ]
        }
    ]
}

</docs-code>

## Schematics CLI

Schematics 附帶自己的命令列工具。
使用 Node 6.9 或更新版本，請在全球安裝 Schematics 命令列工具：

<docs-code language="shell">

npm install -g &commat;angular-devkit/schematics-cli

</docs-code>

這會安裝 `schematics` 可執行檔，您可以使用它在自己的專案資料夾中建立新的 schematics 集合，將新的 schematic 加入現有的集合，或延伸現有的 schematic。

在以下各節中，您將使用 CLI 建立新的範本集合，以介紹檔案和檔案結構，以及一些基本概念。

然而，示意圖最常見的用途是將 Angular 函式庫與 Angular CLI 整合。
透過在 Angular 工作區中直接建立示意圖檔案來執行此操作，而無需使用 Schematics CLI。
請參閱 [函式庫的示意圖](tools/cli/schematics-for-libraries)。

### 建立範本集

以下指令會在同名的專案資料夾中建立一個名為 `hello-world` 的新圖表。

<docs-code language="shell">

schematics blank --name=hello-world

</docs-code>

Schematics CLI 提供了 `blank` 範例。
指令會建立新的專案資料夾（此為範例的根資料夾）和範例中的初始命名範例。

前往 collection 資料夾，安裝您的 npm 相依性，並在您最愛的編輯器中開啟您的新 collection，以檢視產生的檔案。
例如，如果您正在使用 VS Code：

<docs-code language="shell">

cd hello-world
npm install
npm run build
code .

</docs-code>

初始示意圖會採用與專案資料夾相同的名稱，並產生於 `src/hello-world`。
將相關示意圖新增至該集合，並修改產生的範本程式碼來定義您的示意圖功能。
每個示意圖名稱在集合中必須是獨一無二的。

### 運行一個示意圖

使用 `schematics` 指令來執行指定的名稱指令。
請以以下格式提供專案資料夾路徑、指令名稱和任何強制選項。

<docs-code language="shell">

schematics &lt;path-to-schematics-project&gt;:&lt;schematics-name&gt; --&lt;required-option&gt;=&lt;value&gt;

</docs-code>

路徑可以是絕對路徑或相對路徑，取決於執行指令的目前工作目錄。
例如，要執行您剛才產生的原理圖（沒有任何必要選項），請使用以下指令。

<docs-code language="shell">

schematics .:hello-world

</docs-code>

### 將原理圖加入至集合中

若要將示意圖新增至現有合輯，請使用與您用來開始新的示意圖專案相同的指令，但請在專案資料夾中執行指令。

<docs-code language="shell">

cd hello-world
schematics blank --name=goodbye-world

</docs-code>

此指令會在您的集合中產生新的命名示意圖，包含一個主 `index.ts` 檔案及其相關測試規範。
它也會將新示意圖的名稱、說明和工廠函式新增到 `collection.json` 檔案中的集合架構。

## 收藏內容

根專案資料夾的頂層包含組態檔、`node_modules` 資料夾和 `src/` 資料夾。
`src/` 資料夾包含該組合中命名範例的子資料夾，以及描述收集到的範例的結構 `collection.json`。
每個範例都建立名稱、說明和工廠函式。

<docs-code language="json">

{
  "&dollar;schema":
     "../node_modules/&commat;angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}

</docs-code>

* `$schema` 屬性指定 CLI 用於驗證的架構。
* `schematics` 屬性列出屬於此集合的已命名架構。
    每個架構都有純文字說明，並指向主檔案中的已自動建立的輸入函式。

* `factory` 屬性指向已產生的輸入函式。
    在此範例中，您可以透過呼叫 `helloWorld()` 工廠函式來呼叫 `hello-world` 架構。

* 選擇性的 `schema` 屬性指向定義架構可用的命令列選項的 JSON 架構檔案。
* 選擇性的 `aliases` 陣列指定一個或多個可被用來呼叫架構的字串。
    例如，Angular CLI「產生」指令的架構有一個別名「g」，讓您可以使用指令 `ng g`。

### 指定的 Schematics

當您使用 Schematics CLI 建立一個空白的 schematics 專案時，新的空白 schematic 是該集合的第一個成員，並與該集合擁有相同的名稱。
當您將一個新的命名 schematic 新增到這個集合時，它會自動新增到 `collection.json` schema 中。

除了名稱和說明以外，每個示意圖都有一個 `factory` 屬性，用來識別示意圖的進入點。
在範例中，您可以呼叫主檔案 `hello-world/index.ts` 中的 `helloWorld()` 函式，來呼叫示意圖的已定義功能。

<img alt="overview" src="https://angular.dev/assets/images/guide/schematics/collection-files.gif">

每個在集合中命名的原理圖都有以下主要部分。

| 部件          | 詳細 |
|:---            |:---     |
| `index.ts`     | 為指定圖式定義轉換邏輯的程式碼。  |
| `schema.json`  | 圖式變數定義。                                     |
| `schema.d.ts`  | 圖式變數。                                               |
| `files/`       | 要複製的選用元件/範本檔案。                    |

原理圖有可能在 `index.ts` 檔案中提供所有邏輯，而不需要額外的範本。
不過，您可以透過在 `files` 資料夾中提供元件和範本，像是在獨立的 Angular 專案中一樣，來建立 Angular 的動態原理圖。
索引檔案中的邏輯會透過定義注入資料和修改變數的規則來配置這些範本。
