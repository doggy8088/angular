# 撰寫原理圖

你可以建立自己的原理圖，來對 Angular 專案進行操作。
程式庫開發者通常會把原理圖與自己的程式庫一起打包，將程式庫與 Angular CLI 整合起來。
你也可以建立獨立的原理圖，操控 Angular 應用程式中的檔案與結構，藉此把應用程式客製化成符合你的開發環境，並讓它們遵循你的標準與限制。
原理圖可以串連起來，執行其他原理圖以完成複雜的操作。

操控應用程式中的程式碼，既可能非常強大，也可能相應地危險。
舉例來說，建立一個已經存在的檔案會是錯誤，而且如果立即套用，就會捨棄目前為止已套用的所有其他變更。
Angular Schematics 工具會建立一個虛擬檔案系統，來防範副作用與錯誤。
原理圖描述的是一條轉換管線，可以套用到虛擬檔案系統上。
原理圖執行時，轉換會先記錄在記憶體中，確認有效之後才套用到真正的檔案系統。

## 原理圖概念

原理圖的公開 API 定義了代表基本概念的類別。

- The virtual file system is represented by a `Tree`.
  `Tree` 資料結構包含 _base_（一組已經存在的檔案）與 _暫存區_（一份要套用到 base 上的變更清單）。
  進行修改時，你並不會真的更動 base，而是把修改加入暫存區。

- `Rule` 物件定義了一個函式，它接受一個 `Tree`、套用轉換，並傳回一個新的 `Tree`。
  原理圖的主要檔案 `index.ts` 定義了一組規則，實作原理圖的邏輯。

- 轉換由 `Action` 表示。
  共有四種動作類型：`Create`、`Rename`、`Overwrite` 與 `Delete`。

- 每個原理圖都在由 `SchematicContext` 物件所表示的脈絡中執行。

傳入規則的脈絡物件，提供了原理圖運作時可能需要的工具函式與中繼資料的存取管道，其中包括協助除錯的記錄 API。
脈絡也定義了_合併策略_，決定變更如何從暫存的樹合併到基礎樹中。
變更可以被接受或忽略，或是擲出例外。

### 定義規則與動作

當你用 [Schematics CLI](#schematics-cli) 建立新的空白原理圖時，產生的進入函式是一個_規則工廠_。
`RuleFactory` 物件定義了一個高階函式，用來建立 `Rule`。

```ts {header: "index.ts"}
import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';

// You don't have to export the function as default.
// You can also have more than one rule factory per file.
export function helloWorld(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
```

你的規則可以呼叫外部工具並實作邏輯，來對專案進行變更。
舉例來說，你需要用規則來定義原理圖中的範本要如何合併進宿主專案。

規則可以使用 `@schematics/angular` 套件提供的工具。
你可以找到處理模組、相依套件、TypeScript、AST、JSON、Angular CLI 工作區與專案等工作的輔助函式。

```ts {header: "index.ts"}
import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '@angular-devkit/core';
```

### 用 schema 與介面定義輸入選項

規則可以從呼叫者收集選項值，並把它們注入範本。
你的規則可用的選項，連同其允許值與預設值，都定義在原理圖的 JSON schema 檔案 `<schematic>/schema.json` 中。
使用 TypeScript 介面，為 schema 定義變數或列舉資料型別。

schema 定義了原理圖中所使用變數的型別與預設值。
舉例來說，假想的「Hello World」原理圖可能有下列 schema。

```json {header: "schema.json"}
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
```

Angular CLI 指令原理圖的 schema 檔案範例，請參閱 [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).

### 原理圖提示

原理圖_提示_讓原理圖的執行過程加入使用者互動。
設定原理圖選項，向使用者顯示可自訂的問題。
提示會在原理圖執行之前顯示，原理圖接著把回應作為該選項的值。
這樣使用者不需深入了解全部可用選項，就能主導原理圖的運作。

舉例來說，「Hello World」原理圖可能會詢問使用者的名字，並顯示該名字以取代預設名稱「world」。
若要定義這樣的提示，請在 schema 中為 `name` 變數加入 `x-prompt` 屬性。

同樣地，你也可以加入提示，讓使用者決定原理圖在執行它的 hello 動作時是否使用色彩。
同時包含兩個提示的 schema 如下。

```json {header: "schema.json"}
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
```

#### 提示的簡寫語法

這些範例使用提示語法的簡寫形式，只提供問題的文字。
在大多數情況下，這樣就夠了。
但請注意，這兩個提示預期的輸入型別不同。
使用簡寫形式時，系統會根據屬性的 schema 自動選出最合適的型別。
在範例中，`name` 提示使用 `input` 型別，因為它是一個字串屬性。
`useColor` 提示使用 `confirmation` 型別，因為它是一個布林屬性。
在這種情況下，「yes」對應 `true`，「no」對應 `false`。

共支援三種輸入型別。

| 輸入型別   | Details                                            |
| :----------- | :------------------------------------------------- |
| confirmation | 是或否的問題；非常適合布林選項。   |
| input        | 文字輸入；非常適合字串或數字選項。 |
| list         | 一組預先定義的允許值。                |

在簡寫形式中，型別會從屬性的型別與限制推斷而得。

| Property schema   | Prompt type                                  |
| :---------------- | :------------------------------------------- |
| "type": "boolean" | confirmation \("yes"=`true`, "no"=`false`\)  |
| "type": "string"  | input                                        |
| "type": "number"  | input \(only valid numbers accepted\)        |
| "type": "integer" | input \(only valid numbers accepted\)        |
| "enum": […]       | list \(enum members become list selections\) |

在下列範例中，屬性接受的是列舉值，因此原理圖會自動選擇 list 型別，並從可能的值建立一份選單。

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less", "styl"],
    "x-prompt": "Which stylesheet format would you like to use?"
  }
}
```

提示的執行階段會自動對照 JSON schema 提供的限制，驗證使用者提供的回應。
如果該值不被接受，系統會提示使用者提供新值。
這樣可以確保傳給原理圖的任何值都符合原理圖實作的預期，你就不需要在原理圖的程式碼中再加入額外的檢查。

#### 提示的完整語法

`x-prompt` 欄位語法支援完整形式，用在你需要對提示做更多自訂與控制的場合。
在這種形式中，`x-prompt` 欄位的值是一個 JSON 物件，含有自訂提示行為的子欄位。

| Field   | Data value                                                                  |
| :------ | :-------------------------------------------------------------------------- |
| type    | `confirmation`, `input`, or `list` \(在簡寫形式中自動選出\) |
| message | 字串 \(必填\)                                                         |
| items   | 字串及／或 label/value 物件對 \(僅在型別為 `list` 時有效\)       |

下列完整形式的範例，來自 CLI 用來[產生應用程式](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56).
它定義的提示，讓使用者選擇要為正在建立的應用程式使用哪一種樣式預處理器。
使用完整形式，原理圖可以為選單選項提供更明確的格式。

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less"],
    "x-prompt": {
      "message": "Which stylesheet format would you like to use?",
      "type": "list",
      "items": [
        {"value": "css", "label": "CSS"},
        {"value": "scss", "label": "SCSS [ https://sass-lang.com/documentation/syntax#scss ]"},
        {
          "value": "sass",
          "label": "Sass [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]"
        },
        {"value": "less", "label": "Less [ https://lesscss.org/ ]"}
      ]
    }
  }
}
```

#### x-prompt schema

定義原理圖選項的 JSON schema 支援擴充，讓提示及其各自的行為可以用宣告方式定義。
原理圖的程式碼不需要額外的邏輯或變更，就能支援這些提示。
下列 JSON schema 是 `x-prompt` 欄位完整語法的完整描述。

```json {header: "x-prompt schema"}
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "items": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "properties": {
                  "label": {
                    "type": "string"
                  },
                  "value": {}
                },
                "required": ["value"]
              }
            ]
          }
        }
      },
      "required": ["message"]
    }
  ]
}
```

## Schematics CLI

Schematics 附有自己的命令列工具。
全域安裝 Schematics 命令列工具：

```shell

npm install -g @angular-devkit/schematics-cli

```

這會安裝 `schematics` 執行檔，你可以用它在自己的專案資料夾中建立新的原理圖集合、把新的原理圖加入既有集合，或擴充既有的原理圖。

在接下來的章節中，你會使用 CLI 建立一個新的原理圖集合，藉此介紹相關檔案與檔案結構，以及一些基本概念。

不過，原理圖最常見的用途，是把 Angular 程式庫與 Angular CLI 整合起來。
做法是在 Angular 工作區的程式庫專案中直接建立原理圖檔案，不使用 Schematics CLI。
請參閱[程式庫的原理圖](tools/cli/schematics-for-libraries)。

### 建立原理圖集合

下列指令會在同名的新專案資料夾中，建立一個名為 `hello-world` 的新原理圖。

```shell

schematics blank --name=hello-world

```

`blank` 原理圖由 Schematics CLI 提供。
該指令會建立一個新專案資料夾（集合的根資料夾），以及集合中的一個初始具名原理圖。

前往集合資料夾，安裝你的 npm 相依套件，並在你慣用的編輯器中開啟新集合，查看產生的檔案。
舉例來說，如果你使用 VS Code：

```shell

cd hello-world
npm install
npm run build
code .

```

初始原理圖的名稱與專案資料夾相同，產生在 `src/hello-world` 中。
把相關的原理圖加入這個集合，並修改產生的骨架程式碼，來定義你的原理圖的功能。
每個原理圖的名稱在集合中都必須是唯一的。

### 執行原理圖

使用 `schematics` 指令來執行具名原理圖。
以下列格式提供專案資料夾的路徑、原理圖名稱，以及任何必填選項。

```shell

schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>

```

路徑可以是絕對路徑，也可以是相對於執行指令時目前工作目錄的相對路徑。
舉例來說，若要執行你剛產生的原理圖（它沒有必填選項），請使用下列指令。

```shell

schematics .:hello-world

```

### 把原理圖加入集合

若要把原理圖加入既有集合，請使用你開始新原理圖專案時所用的同一個指令，但在專案資料夾內執行該指令。

```shell

cd hello-world
schematics blank --name=goodbye-world

```

該指令會在你的集合中產生新的具名原理圖，包含主要的 `index.ts` 檔案與其關聯的測試規格。
它也會把新原理圖的名稱、描述與工廠函式，加入集合在 `collection.json` 檔案中的 schema。

## 集合的內容

集合根專案資料夾的最上層包含設定檔、一個 `node_modules` 資料夾與一個 `src/` 資料夾。
`src/` 資料夾包含集合中各具名原理圖的子資料夾，以及描述所彙集原理圖的 schema `collection.json`。
每個原理圖建立時都帶有名稱、描述與工廠函式。

```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}
```

- `$schema` 屬性指定 CLI 用於驗證的 schema。
- `schematics` 屬性列出屬於這個集合的具名原理圖。
  每個原理圖都有一段純文字描述，並指向主要檔案中產生的進入函式。

- `factory` 屬性指向產生的進入函式。
  在這個範例中，你透過呼叫 `helloWorld()` 工廠函式來叫用 `hello-world` 原理圖。

- 選擇性的 `schema` 屬性指向一個 JSON schema 檔案，該檔案定義原理圖可用的命令列選項。
- 選擇性的 `aliases` 陣列指定一個或多個可用來叫用原理圖的字串。
  舉例來說，Angular CLI「generate」指令的原理圖有一個別名「g」，讓你可以使用 `ng g` 指令。

### 具名原理圖

當你用 Schematics CLI 建立空白原理圖專案時，新的空白原理圖是集合的第一個成員，名稱與集合相同。
當你把新的具名原理圖加入這個集合時，它會自動加入 `collection.json` schema。

除了名稱與描述之外，每個原理圖都有一個 `factory` 屬性，用來指出原理圖的進入點。
在範例中，你透過呼叫主要檔案 `hello-world/index.ts` 中的 `helloWorld()` 函式，來叫用原理圖所定義的功能。

<img alt="總覽" src="assets/images/guide/schematics/collection-files.gif">

集合中每個具名原理圖都有下列主要部分。

| 部分         | Details                                                           |
| :------------ | :---------------------------------------------------------------- |
| `index.ts`    | 定義具名原理圖轉換邏輯的程式碼。 |
| `schema.json` | 原理圖變數定義。                                    |
| `schema.d.ts` | 原理圖變數。                                              |
| `files/`      | 選擇性的、要複製的元件／範本檔案。                   |

原理圖可以把全部邏輯都放在 `index.ts` 檔案中，不需要額外的範本。
不過，你可以在 `files` 資料夾中提供元件與範本（就像獨立 Angular 專案中的那些），藉此為 Angular 建立動態原理圖。
index 檔案中的邏輯會定義注入資料並修改變數的規則，來設定這些範本。
