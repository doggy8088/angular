# Angular 應用程式建置系統

在 v17 及更高版本中，新的建置系統提供了建置 Angular 應用程式的改良方式。這個新的建置系統包括：

- 使用 ESM 的現代化輸出格式，並透過動態匯入運算式支援模組延遲載入。
- 更快的建置效能，無論是初次建置還是增量重新建置。
- 較新的 JavaScript 生態系工具，例如 [esbuild](https://esbuild.github.io/) 與 [Vite](https://vitejs.dev/)。
- 整合的 SSR 與預渲染功能。
- 全域與元件樣式表的自動熱替換。

這個新的建置系統已穩定且完整支援用於 Angular 應用程式。你可以將使用 `browser` 建置器的應用程式遷移到新的建置系統。若使用自訂建置器，請參閱該建置器的文件，了解可能的遷移選項。

IMPORTANT: 既有的以 webpack 為基礎的建置系統與 `browser` 建置器已被淘汰。應用程式可以暫時繼續使用 `browser` 建置器，專案也可以在更新時選擇不遷移，但 Angular 團隊建議遷移到新的建置系統。

## 新應用程式

新應用程式會透過 `application` 建置器，預設使用這個新的建置系統。

## 既有應用程式

視專案的需求而定，有自動化與手動兩種程序可供使用。自 v18 起，更新到新主要版本的過程會詢問你是否要透過自動化遷移，將既有應用程式遷移為使用新的建置系統。在遷移之前，請考慮先檢閱[已知問題](#known-issues)章節，因為其中可能包含與你的專案相關的資訊。

HELPFUL: 若使用 SSR，請記得移除應用程式伺服器程式碼中任何 CommonJS 假設，例如 `require`、`__filename`、`__dirname`，或 [CommonJS 模組作用域](https://nodejs.org/api/modules.html#the-module-scope)中的其他結構。所有應用程式程式碼都應與 ESM 相容。這不適用於第三方依賴。

### 自動化遷移（建議）

自動化遷移會調整 `angular.json` 內的應用程式組態，以及程式碼與樣式表，以移除先前 webpack 專屬功能的使用方式。雖然許多變更都可以自動化，且大多數應用程式不需要再做任何變更，但每個應用程式都是獨一無二的，仍可能需要一些手動變更。遷移之後，請嘗試建置應用程式，因為可能會出現新的錯誤，需要在程式碼中做調整。這些錯誤在可能時會嘗試提供問題的解決方案，本指南後面的章節也說明了你可能會遇到的一些較常見情況。透過 `ng update` 更新到新主要版本時，系統會詢問你是否要執行遷移。這個遷移完全是可選的，也可以在更新之後隨時透過以下指令手動執行：

```shell

ng update @angular/cli --name use-application-builder

```

此遷移會執行以下事項：

- 將既有的 `browser` 或 `browser-esbuild` 目標轉換為 `application`
- 移除任何先前的 SSR 建置器（因為 `application` 現在已內建此功能）。
- 相應地更新組態。
- 將 `tsconfig.server.json` 與 `tsconfig.app.json` 合併，並加入 TypeScript 選項 `"esModuleInterop": true`，以確保 `express` 匯入符合 [ESM 規範](#esm-default-imports-vs-namespace-imports)。
- 更新應用程式伺服器程式碼，以使用新的啟動方式與輸出目錄結構。
- 移除任何 webpack 專屬的建置器樣式表用法，例如 `@import`/`url()` 中的波浪號（tilde）或插入號（caret），並更新組態以提供等價的行為
- 若找不到其他 `@angular-devkit/build-angular` 的使用方式，轉換為使用依賴較低的新 `@angular/build` Node.js 套件。

### 手動遷移

此外，對於既有專案，你可以依每個應用程式分別手動選擇使用新的建置器，有兩種不同的選項。這兩個選項都被視為穩定，且獲得 Angular 團隊的完整支援。要使用哪個選項，取決於你遷移時需要做多少變更，以及你想在專案中使用哪些新功能。

- `browser-esbuild` 建置器只建置應用程式的用戶端套件包，其設計目的是與提供既有建置系統的既有 `browser` 建置器相容。這個建置器提供等價的建置選項，在許多情況下，它可以作為既有 `browser` 應用程式的直接替代品。
- `application` 建置器涵蓋整個應用程式，例如用戶端套件包，也可以選擇性地建置用於伺服器端渲染的伺服器，並在建置時預渲染靜態頁面。

`application` 建置器通常更受青睞，因為它改善了伺服器端渲染（SSR）的建置，並讓以用戶端渲染為主的專案在未來更容易採用 SSR。然而，它需要稍多一些遷移工作，若以手動方式執行，對既有的 SSR 應用程式尤其如此。若你的專案難以採用 `application` 建置器，`browser-esbuild` 可以是較簡單的解決方案，它能以較少的破壞性變更，提供大部分的建置效能優勢。

#### 手動遷移到相容建置器 {#manual-migration-to-the-compatibility-builder}

名為 `browser-esbuild` 的建置器，位於使用 `browser` 建置器的應用程式已經依賴的 `@angular-devkit/build-angular` 套件中。你可以為使用 `browser` 建置器的應用程式試用新的建置系統。若使用自訂建置器，請參閱該建置器的文件，了解可能的遷移選項。

相容選項的實作目的，是將初次遷移應用程式所需的變更量減到最低。這是透過替代建置器（`browser-esbuild`）提供的。你可以更新任何應用程式目標的 `build` 目標，以遷移到新的建置系統。

以下通常是你會在應用程式的 `angular.json` 中看到的內容：

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

你唯一需要做的變更，就是更改 `builder` 欄位。

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
```

#### 手動遷移到新的 `application` 建置器

名為 `application` 的建置器，也位於 `@angular-devkit/build-angular` 套件中。透過 `ng new` 建立的新應用程式，則使用來自 `@angular/build` 套件的同一個建置器（`@angular/build:application`）。

以下通常是你會在應用程式的 `angular.json` 中看到的內容：

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

你需要做的第一個變更，就是更改 `builder` 欄位。

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
```

建置器名稱變更之後，`build` 目標內的選項也需要更新。以下清單說明所有需要調整的 `browser` 建置器選項。

- `main` 應重新命名為 `browser`。
- `polyfills` 應為陣列，而非單一檔案。
- `buildOptimizer` 應移除，因為這已由 `optimization` 選項涵蓋。
- `resourcesOutputPath` 應移除，現在它永遠是 `media`。
- `vendorChunk` 應移除，因為這是已不再需要的效能最佳化。
- `commonChunk` 應移除，因為這是已不再需要的效能最佳化。
- `ngswConfigPath` 應重新命名為 `serviceWorker`。

若應用程式目前未使用 SSR，這應該就是讓 `ng build` 能運作的最後一步。第一次執行 `ng build` 之後，可能會基於行為差異，或應用程式使用了 webpack 專屬功能，而出現新的警告或錯誤。許多警告會提供如何補救該問題的建議。若某個警告看起來不正確，或解決方式不明確，請在 [GitHub](https://github.com/angular/angular-cli/issues) 上開啟 issue。本指南後面的章節也提供了幾個特定案例的額外資訊，以及目前的已知問題。

對於初次使用 SSR 的應用程式，[Angular SSR 指南](guide/ssr) 提供了關於為應用程式加入 SSR 的設定過程的額外資訊。

對於已經在使用 SSR 的應用程式，還需要做額外的調整，以更新應用程式伺服器，使其支援新的整合式 SSR 功能。`application` 建置器現在為以下所有既有建置器提供了整合功能：

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

`ng update` 過程會自動移除對 `@nguniversal` 作用域套件的使用方式，先前的一些建置器就位於這些套件中。新的 `@angular/ssr` 套件也會在更新期間自動加入並使用，組態與程式碼會一併調整。`@angular/ssr` 套件同時支援 `browser` 建置器與 `application` 建置器。

## 執行建置

更新應用程式組態之後，就可以像以前一樣使用 `ng build` 執行建置。視建置器遷移的選擇而定，一些命令列選項可能會有所不同。若建置指令包含在任何 `npm` 或其他指令稿中，請確保它們已檢閱並更新。對於已遷移到 `application` 建置器且使用 SSR 及／或預渲染的應用程式，現在 `ng build` 已整合 SSR 支援，你也許可以從指令稿中移除額外的 `ng run` 指令。

```shell

ng build

```

## 啟動開發伺服器

開發伺服器會自動偵測新的建置系統，並用它來建置應用程式。啟動開發伺服器不需要對 `dev-server` 建置器組態或命令列做任何變更。

```shell

ng serve

```

你可以繼續使用過去在開發伺服器上使用過的[命令列選項](/cli/serve)。

HELPFUL: 使用開發伺服器時，你可能會在啟動時看到短暫的未套用樣式內容閃爍（FOUC），因為伺服器正在初始化。開發伺服器會嘗試延後處理樣式表，直到第一次使用時才處理，以改善重新建置的時間。這種情況不會在開發伺服器之外的建置中發生。

### 熱模組替換 {#hot-module-replacement}

熱模組替換（HMR）是開發伺服器使用的一種技術，當應用程式只有一部分變更時，可避免重新載入整個頁面。在許多情況下，變更可以立即顯示在瀏覽器中，讓應用程式開發時的編輯／重新整理循環更有效率。雖然目前不支援以 JavaScript 為基礎的一般熱模組替換（HMR），但有幾種更具體形式的 HMR 可用：

- **全域樣式表**（`styles` 建置選項）
- **元件樣式表**（內嵌與檔案形式）
- **元件範本**（內嵌與檔案形式）

HMR 功能會自動啟用，不需要任何程式碼或組態變更即可使用。Angular 同時為檔案形式（`templateUrl`/`styleUrl`/`styleUrls`）與內嵌（`template`/`styles`）的元件樣式與範本提供 HMR 支援。當建置系統偵測到僅樣式表變更時，它會嘗試只編譯並處理最少量的應用程式程式碼。

若你偏好如此，可以將 `hmr` 開發伺服器選項設為 `false` 來停用 HMR 功能。這也可以透過命令列更改：

```shell

ng serve --no-hmr

```

### 以 Vite 作為開發伺服器

Vite 在 Angular CLI 中的使用，目前_僅限於開發伺服器用途_。即使不使用底層的 Vite 建置系統，Vite 也提供了功能完整的開發伺服器與用戶端支援，並已綑綁為一個低依賴的 npm 套件。這使它成為提供完整開發伺服器功能的理想選擇。目前的開發伺服器程序會使用新的建置系統，在記憶體中產生應用程式的開發建置，並將結果傳給 Vite 來提供應用程式。Vite 的使用方式，就像以 Webpack 為基礎的開發伺服器一樣，被封裝在 Angular CLI 的 `dev-server` 建置器中，目前無法直接設定。

### 預打包

使用開發伺服器時，預打包能改善建置與重新建置的時間。Vite 提供了[預打包功能](https://vite.dev/guide/dep-pre-bundling)，在使用 Angular CLI 時預設啟用。預打包程序會分析專案內所有的第三方依賴，並在第一次執行開發伺服器時處理它們。這個程序省去了每次重新建置或執行開發伺服器時，都要重新建置並綑綁專案依賴的需要。

在大多數情況下，不需要額外的自訂。然而，有些情況可能會需要，包括：

- 自訂依賴內匯入的載入器行為，例如 [`loader` 選項](#file-extension-loader-customization)
- 將依賴符號連結到本機程式碼以便開發，例如 [`npm link`](https://docs.npmjs.com/cli/v10/commands/npm-link)
- 繞過在依賴預打包期間遇到的錯誤

若專案需要，預打包程序可以完全停用，或排除個別依賴。`dev-server` 建置器的 `prebundle` 選項可用於這些自訂。若要排除特定依賴，可使用 `prebundle.exclude` 選項：

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": {
          "exclude": ["some-dep"]
        }
      },
```

依預設，`prebundle` 設為 `true`，但也可以設為 `false` 以完全停用預打包。然而，建議改為排除特定依賴，因為停用預打包會增加重新建置的時間。

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": false
      },
```

## 新功能

應用程式建置系統的主要好處之一，是改善了建置與重新建置的速度。然而，新的應用程式建置系統也提供了 `browser` 建置器所沒有的額外功能。

IMPORTANT: 這裡所述 `application` 建置器的新功能，預設與 `@angular-devkit/build-angular:karma` 測試建置器不相容，因為它在內部使用 `browser` 建置器。使用者可以為該建置器將 `builderMode` 選項設為 `application`，以選擇使用 `application` 建置器。`@angular/build:karma` 與 `@angular/build:unit-test` 建置器永遠使用 `application` 建置器。若你注意到任何問題，請在[這裡](https://github.com/angular/angular-cli/issues)回報。

### 以 `define` 在建置時替換值

`define` 選項允許將程式碼中出現的識別符，在建置時替換為另一個值。這類似 Webpack 的 `DefinePlugin` 的行為，先前有一些使用第三方建置器的自訂 Webpack 組態會用到它。這個選項可以在 `angular.json` 組態檔中使用，也可以在命令列上使用。在 `angular.json` 內設定 `define`，適用於值為常數且可以簽入原始碼控制的情況。

在組態檔內，這個選項的形式是一個物件。物件的鍵代表要替換的識別符，物件的值代表該識別符對應的替換值。範例如下：

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "define": {
          "SOME_NUMBER": "5",
          "ANOTHER": "'this is a string literal, note the extra single quotes'",
          "REFERENCE": "globalThis.someValue.noteTheAbsentSingleQuotes"
      }
    }
  }
```

HELPFUL: 所有替換值在組態檔中都定義為字串。若替換的目的是要成為實際的字串字面值，應以單引號括住。這提供了使用任何有效 JSON 型別，以及使用不同識別符作為替換值的彈性。

命令列用法更適合用於每次建置執行可能會變動的值，例如 git 提交雜湊或環境變數。CLI 會將命令列的 `--define` 值與 `angular.json` 中的 `define` 值合併，兩者都包含在建置中。若同一個識別符同時出現於兩者，命令列用法優先。命令列用法中，`--define` 選項使用 `IDENTIFIER=VALUE` 的格式。

```shell
ng build --define SOME_NUMBER=5 --define "ANOTHER='these will overwrite existing'"
```

環境變數也可以選擇性地包含在建置中。對於非 Windows 的 shell，若你偏好如此，可以直接跳脫雜湊字面值周圍的引號。這個範例假設使用的是類 bash 的 shell，但其他 shell 也有類似的行為可用。

```shell
export MY_APP_API_HOST="http://example.com"
export API_RETRY=3
ng build --define API_HOST=\'$MY_APP_API_HOST\' --define API_RETRY=$API_RETRY
```

無論使用哪種方式，TypeScript 都需要知道這些識別符的型別，以避免建置期間出現型別檢查錯誤。這可以透過在應用程式原始碼中加入一個額外的型別定義檔（例如 `src/types.d.ts`）來達成，其內容類似如下：

```ts
declare const SOME_NUMBER: number;
declare const ANOTHER: string;
declare const GIT_HASH: string;
declare const API_HOST: string;
declare const API_RETRY: number;
```

預設的專案組態已設定為使用專案原始碼目錄中存在的任何型別定義檔。若專案的 TypeScript 組態曾被更改，可能需要調整它，以參照這個新加入的型別定義檔。

IMPORTANT: 此選項不會替換 Angular 中繼資料（例如 Component 或 Directive 裝飾器）中所包含的識別符。

### 副檔名載入器自訂 {#file-extension-loader-customization}

IMPORTANT: 此功能僅適用於 `application` 建置器。

有些專案可能需要控制具有特定副檔名的所有檔案，如何被載入並綑綁到應用程式中。使用 `application` 建置器時，可以使用 `loader` 選項來處理這些情況。這個選項允許專案為指定的副檔名定義要使用的載入器類型。帶有該副檔名的檔案，之後便可以在應用程式程式碼中透過匯入陳述式或動態匯入運算式使用。可以使用的載入器如下：

- `text`：將內容內嵌為 `string`，作為預設匯出
- `binary`：將內容內嵌為 `Uint8Array`，作為預設匯出
- `file`：將檔案輸出到應用程式輸出路徑，並提供該檔案的執行階段位置作為預設匯出
- `dataurl`：將內容內嵌為 [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)。
- `base64`：將內容內嵌為 Base64 編碼的字串。
- `empty`：視內容為空白，且不會將它包含在套件包中

`empty` 值雖然較不常見，但對於第三方函式庫的相容性可能很有用，這些函式庫可能包含需要移除的特定綑綁工具匯入用法。其中一個例子是 CSS 檔案的副作用匯入（`import 'my.css';`），它在瀏覽器中沒有作用。專案改用 `empty` 之後，CSS 檔案可以加入 `styles` 建置選項，或使用其他注入方法。

`loader` 選項是一個以物件為基礎的選項，其鍵用來定義副檔名，值用來定義載入器類型。

以下範例示範如何使用建置選項，將 SVG 檔案的內容內嵌到綑綁後的應用程式中：

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "loader": {
        ".svg": "text"
      }
    }
  }
```

之後就可以匯入 SVG 檔案：

```ts
import contents from './some-file.svg';

console.log(contents); // <svg>...</svg>
```

此外，TypeScript 需要知道該匯入的模組型別，以避免建置期間出現型別檢查錯誤。這可以透過在應用程式原始碼中加入一個額外的型別定義檔（例如 `src/types.d.ts`）來達成，其內容如下或類似：

```ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

預設的專案組態已設定為使用專案原始碼目錄中存在的任何型別定義檔（`.d.ts` 檔案）。若專案的 TypeScript 組態曾被更改，可能需要調整 tsconfig，以參照這個新加入的型別定義檔。

### 匯入屬性載入器自訂

對於只有某些檔案應以特定方式載入的情況，可以逐檔控制載入行為。這可以透過 `loader` [匯入屬性](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with)達成，它可以同時用於匯入陳述式與運算式。匯入屬性的存在，優先於所有其他載入行為，包括 JS/TS 與任何 `loader` 建置選項的值。對於所有其他不受支援檔案類型的一般載入，建議使用 [`loader`](#file-extension-loader-customization) 建置選項。

匯入屬性支援以下 `loader` 值：

- `text`：將內容內嵌為 `string`，作為預設匯出
- `binary`：將內容內嵌為 `Uint8Array`，作為預設匯出
- `file`：將檔案輸出到應用程式輸出路徑，並提供該檔案的執行階段位置作為預設匯出
- `dataurl`：將內容內嵌為 [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)。
- `base64`：將內容內嵌為 Base64 編碼的字串。

使用匯入屬性的額外要求是，TypeScript 的 `module` 選項必須設為 `esnext` 或 `preserve`，TypeScript 才能成功建置應用程式程式碼。新專案預設使用 `preserve`，所以不需要變更。

目前，TypeScript 不支援基於匯入屬性值的型別定義。目前需要使用 `@ts-expect-error`/`@ts-ignore`，或使用個別的型別定義檔（假設該檔案只以相同的載入器屬性匯入）。舉例來說，SVG 檔案可以像這樣以文字形式匯入：

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import contents from './some-file.svg' with {loader: 'text'};
```

同樣的事也可以在非同步函式內以匯入運算式達成。

```ts
async function loadSvg(): Promise<string> {
  // @ts-expect-error TypeScript cannot provide types based on attributes yet
  return import('./some-file.svg', {with: {loader: 'text'}}).then((m) => m.default);
}
```

對於匯入運算式，`loader` 值必須是字串字面值，才能被靜態分析。若該值不是字串字面值，系統會發出警告。

當檔案要在執行階段透過 `fetch()`、設定到圖片元素的 `src`，或其他類似方法載入時，`file` 載入器便很實用。

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import imagePath from './image.webp' with {loader: 'file'};

console.log(imagePath); // media/image-ULK2SIIB.webp
```

當檔案需要以編碼字串的形式直接內嵌至套件包中，之後可用來建構 Data URL 時，`base64` 載入器便很實用。

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import logo from './logo.png' with {loader: 'base64'};

console.log(logo); // "iVBORw0KGgoAAAANSUhEUgAA..."
```

使用 `dataurl` 載入器，將資產內嵌為完整的 Data URL。

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import icon from './icon.svg' with {loader: 'dataurl'};

console.log(icon); // "data:image/svg+xml;..."
```

如上方程式碼註解所示，正式建置會自動在路徑中加入雜湊，以利長期快取。

HELPFUL: 使用開發伺服器並以 `loader` 屬性從 Node.js 套件匯入檔案時，該套件必須透過開發伺服器的 `prebundle` 選項，排除在預打包之外。

### 匯入／匯出條件

專案可能需要依據建置類型，將某些匯入路徑對應到不同的檔案。這在某些情況下特別有用，例如 `ng serve` 需要使用偵錯／開發專屬程式碼，但 `ng build` 需要使用不含任何開發功能／資訊的程式碼。系統會自動套用數個匯入／匯出[條件](https://nodejs.org/api/packages.html#community-conditions-definitions)，以支援這些專案需求：

- 對於最佳化建置，啟用 `production` 條件。
- 對於非最佳化建置，啟用 `development` 條件。
- 對於瀏覽器輸出程式碼，啟用 `browser` 條件。

最佳化建置由 `optimization` 選項的值決定。當 `optimization` 設為 `true`，或更具體地說，若 `optimization.scripts` 設為 `true`，該建置即被視為最佳化建置。這個分類同時適用於 `ng build` 與 `ng serve`。在新專案中，`ng build` 預設為最佳化，`ng serve` 預設為非最佳化。

在應用程式程式碼中運用這些條件的一個實用方法，是將它們與[子路徑匯入](https://nodejs.org/api/packages.html#subpath-imports)結合。透過使用以下匯入陳述式：

```ts
import {verboseLogging} from '#logger';
```

該檔案可以在 `package.json` 的 `imports` 欄位中切換：

```json
{
  ...
  "imports": {
    "#logger": {
      "development": "./src/logging/debug.ts",
      "default": "./src/logging/noop.ts"
    }
  }
}
```

對於同時使用 SSR 的應用程式，可以使用 `browser` 條件來切換瀏覽器與伺服器程式碼：

```json
{
  ...
  "imports": {
    "#crashReporter": {
      "browser": "./src/browser-logger.ts",
      "default": "./src/server-logger.ts"
    }
  }
}
```

這些條件也適用於 Node.js 套件，以及套件內定義的任何 [`exports`](https://nodejs.org/api/packages.html#conditional-exports)。

HELPFUL: 若你目前正在使用 `fileReplacements` 建置選項，此功能也許能取代它的用法。

## 已知問題 {#known-issues}

目前有幾個你可能會遇到的已知問題。這個清單會持續更新以保持最新。若這些問題中有任何一個目前正阻礙你試用新的建置系統，請日後再回來查看，因為它可能已經被解決。

### Web Worker 程式碼的型別檢查與巢狀 Web Worker 的處理

Web Worker 可以在應用程式程式碼中使用與 `browser` 建置器相同的語法（`new Worker(new URL('<workerfile>', import.meta.url))`）。然而，Worker 內的程式碼目前不會由 TypeScript 編譯器進行型別檢查。TypeScript 程式碼有支援，只是不做型別檢查。此外，任何巢狀 Worker 都不會被建置系統處理。巢狀 Worker 是指在另一個 Worker 檔案中實例化的 Worker。

### ESM 預設匯入 vs. 命名空間匯入 {#esm-default-imports-vs-namespace-imports}

TypeScript 依預設允許將預設匯出以命名空間匯入的方式匯入，然後用在呼叫運算式中。不幸的是，這與 ECMAScript 規格有所出入。新版建置系統底層的綑綁工具（`esbuild`）預期 ESM 程式碼符合規格。若你的應用程式對套件使用了不正確的匯入類型，建置系統現在會產生警告。然而，若要讓 TypeScript 接受正確的用法，必須在應用程式的 `tsconfig` 檔案中啟用一個 TypeScript 選項。啟用後，[`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) 選項能與 ECMAScript 規格有更好的對齊，這也是 TypeScript 團隊所建議的。啟用之後，你就可以在適用的地方將套件匯入更新為符合 ECMAScript 的形式。

以 [`moment`](https://npmjs.com/package/moment) 套件為例，以下應用程式程式碼會造成執行階段錯誤：

```ts
import * as moment from 'moment';

console.log(moment().format());
```

建置會產生警告，通知你有潛在的問題。警告會類似以下內容：

```text
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

```

然而，你可以透過為應用程式啟用 `esModuleInterop` TypeScript 選項，並將匯入改為以下形式，來避免執行階段錯誤與警告：

```ts
import moment from 'moment';

console.log(moment().format());
```

### 延遲模組中與順序相關的副作用匯入

若匯入陳述式依賴特定順序，且同時用在多個延遲模組中，可能會造成頂層陳述式以錯誤的順序執行。這並不常見，因為它取決於副作用模組的使用方式，且不適用於 `polyfills` 選項。這是由底層綑綁工具的一個[缺陷](https://github.com/evanw/esbuild/issues/399)造成的，但會在未來的更新中處理。

IMPORTANT: 無論使用哪種建置系統，都建議盡可能避免使用具有非本機副作用的模組（polyfills 除外），如此也能避開這個特定問題。具有非本機副作用的模組，對應用程式大小與執行階段效能都可能有負面影響。

### 輸出位置變更

依預設，應用程式建置器成功建置後，套件包位於 `dist/<project-name>/browser` 目錄（`browser` 建置器則是 `dist/<project-name>`）。這可能會弄壞一些依賴先前位置的工具鏈。在這種情況下，你可以[設定輸出路徑](reference/configs/workspace-config#output-path-configuration)以符合你的需求。

## 問題回報

在 [GitHub](https://github.com/angular/angular-cli/issues) 上回報問題與功能請求。

請儘可能提供最小重現範例，以協助團隊處理問題。
