# 將翻譯合併至應用程式

若要將完成的翻譯合併至你的專案，請完成下列動作

1.  使用 [Angular CLI][AioCliMain] 建置一份專案可散發檔案的副本
1.  使用 `"localize"` 選項，將所有 i18n 訊息換成有效的翻譯，並建置一個在地化變體應用程式。
    變體應用程式是應用程式可散發檔案的完整副本，針對單一地區設定翻譯。

合併翻譯後，請使用伺服器端語言偵測或不同的子目錄，提供應用程式的每一份可散發副本。

<div class="alert is-helpful">

關於如何提供應用程式的每一份可散發副本的更多資訊，請見[部署多個地區設定][AioGuideI18nCommonDeploy]。

</div>

對於編譯期翻譯的應用程式，建置程序使用[預先編譯（AOT）][AioGuideGlossaryAheadOfTimeAotCompilation]，產生精簡、快速、可直接執行的應用程式。

<div class="alert is-helpful">

建置程序的詳細說明，請見[建置與提供 Angular 應用程式][AioGuideBuild]。
建置程序適用於 `.xlf` 格式的翻譯檔案，或 Angular 能理解的其他格式，例如 `.xtb`。
關於 Angular 使用的翻譯檔案格式的更多資訊，請見[變更來源語言檔案格式][AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

</div>

若要為每個地區設定建置一份獨立的可散發副本，請在專案的 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中[在建置設定中定義地區設定][AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]。

這種方法省去了為每個地區設定執行完整應用程式建置的需要，縮短了建置程序。

若要[為每個地區設定產生應用程式變體][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]，請使用 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中的 `"localize"` 選項。
此外，若要[從命令列建置][AioGuideI18nCommonMergeBuildFromTheCommandLine]，請搭配 `--localize` 選項使用 [`build`][AioCliBuild] [Angular CLI][AioCliMain] 指令。

<div class="alert is-helpful">

也可以選擇[只為單一地區設定套用特定建置選項][AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]，建立自訂的地區設定組態。

</div>

## 在建置設定中定義地區設定

使用專案 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中的 `i18n` 專案選項，為專案定義地區設定。

下列子選項識別來源語言，並告訴編譯器去哪裡尋找專案支援的翻譯。

| 子選項         | 詳情 |
|:---            |:--- |
| `sourceLocale` | 你在應用程式原始碼中使用的地區設定 \(預設為 `en-US`\) |
| `locales`      | 地區設定識別碼對應翻譯檔案的對照表                             |

### `en-US` 與 `fr` 的 `angular.json` 範例

例如，下列 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔的摘錄，將來源地區設定設為 `en-US`，並提供法文 \(`fr`\) 地區設定翻譯檔案的路徑。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="locale-config"></code-example>

## 為每個地區設定產生應用程式變體

若要在建置設定中使用你的地區設定定義，請使用 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中的 `"localize"` 選項，告訴 CLI 要為建置設定產生哪些地區設定。

*   將 `"localize"` 設為 `true`，建置先前在建置設定中定義的所有地區設定。
*   將 `"localize"` 設為先前定義的地區設定識別碼子集陣列，只建置那些地區設定版本。
*   將 `"localize"` 設為 `false`，停用在地化，不產生任何地區設定專屬版本。

<div class="alert is-helpful">

**注意：**元件範本的在地化需要[預先編譯（AOT）][AioGuideGlossaryAheadOfTimeAotCompilation]。

若你變更了這項設定，請將 `"aot"` 設為 `true` 以使用 AOT。

</div>

<div class="alert is-helpful">

由於 i18n 部署較為複雜，且需要盡量縮短重新建置的時間，開發伺服器一次只支援在地化單一地區設定。
若你將 `"localize"` 選項設為 `true`、定義了多個地區設定，並使用 `ng serve`，就會發生錯誤。
若要針對特定地區設定進行開發，請將 `"localize"` 選項設為該特定地區設定。
例如，針對法文 \(`fr`\)，請指定 `"localize": ["fr"]`。

</div>

CLI 會載入並註冊地區設定資料，將每個產生的版本放在地區設定專屬目錄中，與其他地區設定版本分開，並將這些目錄放在專案設定好的 `outputPath` 內。
對每個應用程式變體，`html` 元素的 `lang` 屬性會設為該地區設定。
CLI 也會將地區設定加入設定好的 `baseHref`，調整應用程式每個版本的 HTML 基底 HREF。

將 `"localize"` 屬性設為共用設定，即可讓所有設定都繼承它。
也可以設定這個屬性來覆寫其他設定。

### `angular.json` 納入所有地區設定的建置範例

下列範例顯示在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中將 `"localize"` 選項設為 `true`，如此建置設定中定義的所有地區設定都會被建置。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="build-localize-true"></code-example>

## 從命令列建置

另外，搭配你現有的 `production` 設定，使用 [`ng build`][AioCliBuild] 指令的 `--localize` 選項。
CLI 會建置建置設定中定義的所有地區設定。
若你在建置設定中設定了地區設定，效果類似將 `"localize"` 選項設為 `true`。

<div class="alert is-helpful">

關於如何設定地區設定的更多資訊，請見[為每個地區設定產生應用程式變體][AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]。

</div>

<code-example path="i18n/doc-files/commands.sh" region="build-localize" language="sh"></code-example>

## 只為單一地區設定套用特定建置選項

若要只對單一地區設定套用特定建置選項，請指定單一地區設定，建立自訂的地區設定專屬設定。

<div class="alert is-important">

[Angular CLI][AioCliMain] 開發伺服器 \(`ng serve`\) 只能搭配單一地區設定使用。

</div>

### 法文建置範例

下列範例顯示使用單一地區設定的自訂地區設定專屬設定。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="build-single-locale"></code-example>

將這個設定傳給 `ng serve` 或 `ng build` 指令。
下列程式碼範例顯示如何提供法文語言檔案。

<code-example path="i18n/doc-files/commands.sh" region="serve-french" language="sh"></code-example>

生產環境建置請使用設定組合，同時執行兩個設定。

<code-example path="i18n/doc-files/commands.sh" region="build-production-french" language="sh"></code-example>

<code-example language="json" header="angular.json" path="i18n/angular.json" region="build-production-french" ></code-example>

<a id="report-missing-translations"></a>
## 回報缺少的翻譯

當翻譯缺少時，建置仍會成功，但會產生類似 `Missing translation for message "{translation_text}"` 的警告。
若要設定 Angular 編譯器產生的警告等級，請指定下列其中一個等級。

| 警告等級      | 詳情                                         | 輸出                                                   |
|:---           |:---                                                  |:---    |
| `error`       | 拋出錯誤且建置失敗                           | n/a                                                    |
| `ignore`      | 不做任何處理                                 | n/a                                                    |
| `warning`     | 在主控台或殼層中顯示預設警告                 | `Missing translation for message "{translation_text}"` |

請在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中 `build` 目標的 `options` 區段，指定警告等級。

### `angular.json` 的 `error` 警告範例

下列範例顯示如何將警告等級設為 `error`。

<code-example language="json" header="angular.json" path="i18n/angular.json" region="missing-translation-error" ></code-example>

<div class="alert is-helpful">

將 Angular 專案編譯成 Angular 應用程式時，`i18n` 屬性的每個實例都會被換成 [`$localize`][AioApiLocalizeInitLocalize] 標記訊息字串的實例。
這表示你的 Angular 應用程式是在編譯之後才翻譯的。
這也表示，你不需要為每個地區設定重新編譯整個 Angular 專案，就能建立 Angular 應用程式的在地化版本。

翻譯 Angular 應用程式時，*翻譯轉換*會用翻譯集合中的字串，替換範本字面值字串的各個部分 \(靜態字串與運算式\) 並重新排序。
詳情請見 [`$localize`][AioApiLocalizeInitLocalize]。

<div class="alert is-helpful">

**tldr;**

只編譯一次，再為每個地區設定翻譯。

</div>

</div>

## 接下來

*   [部署多個地區設定][AioGuideI18nCommonDeploy]

<!-- links -->

[AioApiLocalizeInitLocalize]: api/localize/init/$localize "$localize | init - localize - API | Angular"

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"
[AioCliBuild]: cli/build "ng build | CLI | Angular"

[AioGuideBuild]: guide/build "Building and serving Angular apps | Angular"

[AioGuideGlossaryAheadOfTimeAotCompilation]: guide/glossary#預先編譯ahead-of-time-compilationaot "ahead-of-time (AOT) compilation - Glossary | Angular"

[AioGuideI18nCommonDeploy]: guide/i18n-common-deploy "Deploy multiple locales | Angular"

[AioGuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n-common-merge#只為單一地區設定套用特定建置選項 "Apply specific build options for just one locale - Merge translations into the application | Angular"
[AioGuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n-common-merge#從命令列建置 "Build from the command line - Merge translations into the application | Angular"
[AioGuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n-common-merge#在建置設定中定義地區設定 "Define locales in the build configuration - Merge translations into the application | Angular"
[AioGuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n-common-merge#為每個地區設定產生應用程式變體 "Generate application variants for each locale - Merge translations into the application | Angular"

[AioGuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n-common-translation-files#變更來源語言檔案的格式 "Change the source language file format - Work with translation files | Angular"

[AioGuideIvyOptingOutOfIvyInVersion9]: guide/ivy#opting-out-of-ivy-in-version-9 "Opting out of Ivy in version 9 - Angular Ivy | Angular"
[AioGuideWorkspaceConfig]: guide/workspace-config "Angular workspace configuration | Angular"

<!-- external links -->

[AngularV8GuideI18nMergeWithTheJitCompiler]: https://v8.angular.tw/guide/i18n-common#merge-translations-into-the-app-with-the-jit-compiler "Merge with the JIT compiler - Internationalization (i18n) | Angular v8"

<!-- end links -->

@reviewed 2021-10-13
