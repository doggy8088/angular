# 將翻譯合併到應用程式

要將已完成的翻譯合併至您的專案，請完成下列動作

1. 使用 [Angular CLI][AioCliMain] 建立專案可發佈檔案的副本
1. 使用 `"localize"` 選項取代所有 i18n 訊息為有效翻譯，並建立已在地化變體應用程式。
變體應用程式是完整翻譯成單一地區語言的應用程式可發佈檔案副本。

在您合併翻譯後，使用伺服器端語言偵測或不同子目錄來提供每個可發佈的應用程式複本。

HELPFUL: 有關如何提供應用程式的每個可散發副本的詳細資訊，請參閱 [部署多個語言環境](guide/i18n/deploy)。

對於應用程式的編譯時間翻譯，建置過程使用即時 (AOT) 編譯來產生小型、快速且可立即執行的應用程式。

HELPFUL: 有關建置流程的詳細說明，請參閱 [建置和服務 Angular 應用程式][AioGuideBuild]。
建置流程適用於 `.xlf` 格式或 Angular 能理解的其他格式（例如 `.xtb`）的翻譯檔案。
有關 Angular 使用的翻譯檔案格式的更多資訊，請參閱 [變更原始語言檔案格式][AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

若要為每個地區建置一個獨立的可發行應用程式複本，請在專案的 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中，[在建置設定中定義地區][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。

這種方法會移除針對每個語言環境執行完整應用程式建置的要求，從而縮短建置流程。

若要[為每個地區產生應用程式變體][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]，請在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中使用 `"localize"` 選項。

此外，若要[從指令列建置][AioGuideI18nCommonMergeBuildFromTheCommandLine]，請使用 [`build`][AioCliBuild] [Angular CLI][AioCliMain] 指令和 `--localize` 選項。

HELPFUL: 選擇性地，[只針對單一地區套用特定建置選項][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]，以自訂地區設定。

## 在建構設定中定義當地語系

在專案的 [`angular.json`][AioGuideWorkspaceConfig] 工作空間建置設定檔中使用 `i18n` 專案選項來定義專案的區域設定。

以下子選項識別原始語言並告訴編譯器在哪裡可以找到專案支援的翻譯。

| 子選項      | 詳細資料 |
|:---            |:--- |
| `sourceLocale` | 應用程式原始碼內使用的語言環境 \(`en-US` 為預設值\) |
| `locales`      | 語言環境識別碼與翻譯檔案的對應                                |

### 適用於 `en-US` 和 `fr` 的範例 `angular.json`

例如，以下 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔的摘錄將原始語言環境設定為 `en-US`，並提供法文 \(`fr`\) 語言環境翻譯檔案的路徑。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="locale-config"/>

## 為每個語言產生應用程式變體

若要使用建置設定中的地區定義，請在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中使用 `"localize"` 選項，以告知 CLI 針對建置設定產生哪些地區。

* 將 `"localize"` 設為 `true`，以針對建置設定中先前定義的所有語言設定。
* 將 `"localize"` 設為先前定義的語言識別碼子集的陣列，以僅建置那些語言版本。
* 將 `"localize"` 設為 `false`，以停用在地化且不產生任何語言特定的版本。

HELPFUL: 必須先進行即時 (AOT) 編譯，才能在地化元件範本。

如果您變更此設定，請將 `"aot"` 設為 `true` 以使用 AOT。

HELPFUL: 由於 i18n 的部署複雜性以及最小化重新建置時間的需求，開發伺服器一次只支援在地化單一地區設定。
如果您將 `"localize"` 選項設定為 `true`，定義多個地區設定，然後使用 `ng serve`；則會發生錯誤。
如果您想要針對特定地區設定進行開發，請將 `"localize"` 選項設定為特定地區設定。
例如，針對法文 \(`fr`\)，請指定 `"localize": ["fr"]`。

CLI 會載入並註冊地區資料，將每個產生的版本置於特定地區的目錄中，以將其與其他地區的版本分開，並將目錄置於專案的已設定 `outputPath` 中。
針對每個應用程式變體，`html` 元素的 `lang` 屬性會設定為地區。
CLI 也會透過將地區新增到已設定的 `baseHref` 中，調整應用程式每個版本的 HTML 基本 HREF。

將 `"localize"` 屬性設定為共享配置，以有效繼承所有配置。
另外，設定該屬性可覆寫其他配置。

### `angular.json` 包含來自建置範例的所有區域設定

以下範例顯示在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中，將 `"localize"` 選項設定為 `true`，以便建置建置設定中定義的所有地區設定。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-localize-true"/>

## 從命令列建立

html
<p>For Node.js, you can use the following command:</p>
<pre>npm install -g create-react-app</pre>
<p>Then, you can create a new project by running the following command:</p>
<pre>create-react-app my-app</pre>
<p>This will create a new directory called my-app containing all the files necessary for a React project.</p>

另外，請在 [`ng build`][AioCliBuild] 指令和現有的 `production` 組態中使用 `--localize` 選項。
CLI 會建置在建置組態中定義的所有語言環境。
如果您在建置組態中設定語言環境，則類似於將 `"localize"` 選項設為 `true` 時。

HELPFUL：有關如何設定地區的更多資訊，請參閱 [為每個地區產生應用程式變體][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="build-localize"/>

## 只針對一個地區套用特定建置選項

若要僅將特定建置選項套用至單一地區設定，請指定單一地區設定以建立自訂的地區設定專用組態。

重要：僅使用單一語言環境使用 [Angular CLI][AioCliMain] 開發伺服器（`ng serve`）。

### 建立法語範例

以下範例顯示使用單一語言環境的客製化語言環境特定組態。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-single-locale"/>

將此組態傳遞給 `ng serve` 或 `ng build` 命令。
以下程式碼範例顯示如何提供法文語言檔案。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="serve-french"/>

對於生產建構，使用設定組合來執行兩個設定。

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="build-production-french"/>

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-production-french" />

## 回報遺失的翻譯

當翻譯遺失時，建置會成功但會產生警告，例如 `訊息 "{translation_text}" 的翻譯遺失`。
若要設定 Angular 編譯器產生的警告層級，請指定下列層級之一。

| 警告層級 | 詳細資料                                             | 輸出 |
|:---           |:---                                                  |:---    |
| `error`       | 引發錯誤，且建置失敗                                | n/a                                                    |
| `ignore`      | 不執行任何動作                                       | n/a                                                    |
| `warning`     | 在主控台或外殼中顯示預設警告                        | `找不到訊息 "{translation_text}" 的翻譯` |

在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置組態檔案中，為 `build` 目標的 `options` 區段指定警告層級。

### `angular.json` `error` 警告範例

以下範例顯示如何將警告層級設定為 `error`。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="missing-translation-error" />

HELPFUL：當您將 Angular 專案編譯成 Angular 應用程式時，`i18n` 屬性的執行個體會以 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串的執行個體取代。
這表示您的 Angular 應用程式會在編譯後翻譯。
這也表示您可以建立 Angular 應用程式的在地化版本，而無需針對每個語言環境重新編譯整個 Angular 專案。

當您翻譯您的 Angular 應用程式時，*翻譯轉換* 會以一組翻譯中的字串取代並重新排列範本文字字串的部分\(靜態字串與表達式\)。
如需更多資訊，請參閱 [`$localize`][AioApiLocalizeInitLocalize]。

TLDR：編譯一次，然後為每個語言環境翻譯。

## 接下來

<docs-pill-row>
  <docs-pill href="guide/i18n/deploy" title="部署多種語言環境"/>
</docs-pill-row>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
