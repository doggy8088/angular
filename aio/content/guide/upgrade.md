# 從 AngularJS 升級至 Angular

*Angular* 是今日與明日 Angular 的名稱。

*AngularJS* 是 Angular 所有 1.x 版本的名稱。

AngularJS 應用程式很棒。在轉移至 Angular 之前，務必先考量商業效益。這項效益的重要部分，是抵達目標所需的時間與精力。本指南說明以內建工具一次一部分、有效率地把 AngularJS 專案移轉至 Angular 平台的方法。

有些應用程式會比其他應用程式更容易升級，而且有許多方法可以讓升級對自己來說更容易一些。即使在開始升級流程之前，也可以先準備 AngularJS 應用程式、讓它與 Angular 對齊。這些準備步驟都是為了讓程式碼更解耦、更容易維護，也更符合現代開發工具的用法。也就是說，除了讓升級更容易之外，你還會改善現有的 AngularJS 應用程式。

成功升級的關鍵之一，是以漸進方式進行：讓兩個框架在同一個應用程式中並存執行，並一次把一個 AngularJS 元件移植至 Angular。這讓即使是大型複雜的應用程式也能升級，而不打斷其他業務，因為工作可以協同進行、分散在一段時間內完成。Angular 中的 `upgrade` 模組正是為了讓漸進式升級無縫進行而設計的。

## 準備工作

AngularJS 應用程式有許多種組織方式。當你開始把這些應用程式升級至 Angular 時，有些會比其他應用程式容易處理得多。在開始移轉之前，你可以套用幾個關鍵技巧與模式，讓應用程式為未來做好準備。

### 遵循 AngularJS 風格指南

[AngularJS 風格指南][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMd] 蒐集了經證實能產出更乾淨、更容易維護的 AngularJS 應用程式的模式與實務做法。其中包含大量關於如何撰寫與組織 AngularJS 程式碼的資訊——同樣重要的是——如何**不**撰寫與組織 AngularJS 程式碼。

Angular 是 AngularJS 最優秀部分的重新想像版本。就此而言，它的目標與 AngularJS 風格指南相同：保留 AngularJS 好的部分，避開不好的部分。當然，Angular 還包含遠比這更多的內容，但這確實意味著*遵循風格指南有助於讓你的 AngularJS 應用程式更貼近 Angular*。

有幾條規則特別能讓使用 Angular `upgrade/static` 模組進行*漸進式升級*變得容易許多：

| 規則 | 詳細說明 |
|:---                                                                                                                                                                                               |:---     |
| [一檔案一元件規則][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdSingleResponsibility] | 每個檔案應該只有一個元件。這不只讓元件容易瀏覽與尋找，也能讓我們一次把一個元件在語言與框架之間移轉。在這個範例應用程式中，每個控制器、元件、服務與篩選器都在各自的原始碼檔案中。 |
| [依功能分資料夾結構][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdFoldersByFeatureStructure] <br /> [模組化][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdModularity] | 在更高的抽象層級上定義類似的原則：應用程式的不同部分應該位於不同的目錄與 NgModule 中。 |

當應用程式以這種按功能劃分的方式來配置時，也可以一次移轉一個功能。對於尚未長成這樣的應用程式，套用 AngularJS 風格指南中的規則是高度建議的準備步驟。而且這不只是為了升級——這本身就是扎實的通用建議！

### 使用模組載入器

當你把應用程式程式碼拆成每個檔案一個元件時，專案結構往往會變成由大量相對較小的檔案組成。這種組織方式比少數大型檔案整潔得多，但如果你必須用 `<script>` 標籤把所有這些檔案載入 HTML 頁面，效果就不太好。特別是當你還必須維持這些標籤的正確順序時。這就是為什麼開始使用*模組載入器*是個好主意。

使用 [SystemJS][GithubSystemjsSystemjs]、[Webpack][GithubWebpackMain] 或 [Browserify][BrowserifyMain] 等模組載入器，可以讓我們使用 TypeScript 或 ES2015 的內建模組系統。你可以使用 `import` 與 `export` 功能，明確指定哪些程式碼可以在應用程式的不同部分之間共用、也將會共用。對於 ES5 應用程式，你可以使用 CommonJS 風格的 `require` 與 `module.exports` 功能。在這兩種情況下，模組載入器接著會負責以正確的順序載入應用程式需要的所有程式碼。

在把應用程式移往正式環境時，模組載入器也讓把所有程式碼打包成附帶一切所需內容的正式版套件變得更容易。

### 移轉至 TypeScript

如果 Angular 升級計畫的一部分也包括採用 TypeScript，那麼即使在升級本身開始之前就引入 TypeScript 編譯器也是合理的。這表示在實際升級期間，少了一件要學習與思考的事。這也表示你可以開始在 AngularJS 程式碼中使用 TypeScript 功能。

由於 TypeScript 是 ECMAScript 2015 的超集，而 ECMAScript 2015 又是 ECMAScript 5 的超集，因此「切換」至 TypeScript 不一定需要做比安裝 TypeScript 編譯器、並把檔案從 `*.js` 重新命名為 `*.ts` 更多的事。但當然，只做這樣並不會有太大用處或令人興奮之處。像下面這樣的額外步驟可以讓我們獲得遠超投入的回報：

*   對於使用模組載入器的應用程式，可以使用 TypeScript 的匯入與匯出 \(也就是 ECMAScript 2015 的匯入與匯出\) 來把程式碼組織成模組。
*   可以逐步為現有的函式與變數加上型別註解，以確定它們的型別，並獲得建置時期錯誤檢查、優秀的自動完成支援與行內文件等好處。
*   也可以逐步加入 ES2015 新增的 JavaScript 功能，例如箭頭函式、`let` 與 `const`、預設函式參數，以及解構賦值，讓程式碼更具表現力。
*   服務與控制器可以轉變為*類別*。這樣一來，它們就更接近成為 Angular 的服務與元件類別，升級後的生活也會更輕鬆。

### 使用元件指令

在 Angular 中，元件是建構使用者介面的主要基本元素。你可以把 UI 的不同部分定義為元件，並把它們組合成完整的使用者體驗。

你也可以在 AngularJS 中做到這一點，使用*元件指令*。這些指令會定義自己的範本、控制器與輸入／輸出繫結——也就是 Angular 元件所定義的相同事物。使用元件指令建構的應用程式，比起使用 `ng-controller`、`ng-include` 與範圍繼承等較低階功能建構的應用程式，更容易移轉至 Angular。

為了與 Angular 相容，AngularJS 元件指令應該設定下列屬性：

| 屬性 | 說明 |
|:---                                |:---     |
| `restrict: 'E'` | 元件通常以元素的方式使用。 |
| `scope: {}` | 獨立範圍。在 Angular 中，元件永遠與周遭環境隔離，你在 AngularJS 中也應該這麼做。 |
| `bindToController: {}` | 元件的輸入與輸出應該繫結至控制器，而不是使用 `$scope`。 |
| `controller` <br /> `controllerAs` | 元件有自己的控制器。 |
| `template` <br /> `templateUrl` | 元件有自己的範本。 |

元件指令也可以使用下列屬性：

| 屬性 | 說明 |
|:---                   |:---     |
| `transclude: true/{}` | 如果元件需要從別處轉置內容。 |
| `require` | 如果元件需要與某個父元件的控制器溝通。 |

元件指令**不應該**使用下列屬性：

| 屬性 \(應避免\) | 詳細說明 |
|:---                          |:---     |
| `compile` | Angular 將不支援此屬性。 |
| `replace: true` | Angular 絕不會以元件範本取代元件元素。這個屬性在 AngularJS 中也已被棄用。 |
| `priority` <br /> `terminal` | 雖然 AngularJS 元件可以使用這些屬性，但 Angular 不會使用它們，最好不要撰寫依賴它們的程式碼。 |

完全符合 Angular 架構的 AngularJS 元件指令，看起來可能像這樣：

<code-example header="hero-detail.directive.ts" path="upgrade-module/src/app/hero-detail.directive.ts"></code-example>

AngularJS 1.5 引入了 [component API][AngularjsDocsApiNgTypeAngularModuleComponent]，讓定義像這樣的元件指令變得更容易。基於幾個原因，使用這個 API 來定義元件指令是個好主意：

*   需要的樣板程式碼更少。
*   它會強制使用 `controllerAs` 等元件最佳實務。
*   它對 `scope` 與 `restrict` 等指令屬性有良好的預設值。

上面的元件指令範例以元件 API 表達時，看起來像這樣：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/upgrade-io/hero-detail.component.ts" region="hero-detail-io"></code-example>

控制器生命週期掛鉤方法 `$onInit()`、`$onDestroy()` 與 `$onChanges()` 是 AngularJS 1.5 引入的另一項便利功能。它們在 Angular 中都有幾乎完全相同的[對應項目][AioGuideLifecycleHooks]，因此圍繞它們來組織元件生命週期邏輯，將能讓日後的 Angular 升級流程更順利。

## 使用 ngUpgrade 進行升級

Angular 中的 ngUpgrade 函式庫是升級除了最小型應用程式以外的任何應用程式時非常有用的工具。有了它，你可以在同一個應用程式中混合搭配 AngularJS 與 Angular 元件，並讓它們無縫地互通。這表示你不必一次完成所有升級工作，因為在過渡期間，兩個框架之間存在自然的共存關係。

<div class="alert is-helpful">

[AngularJS 的生命週期終止][AngularBlogFindingAPathForwardWithAngularjs7e186fdd4429] 是 2021 年 12 月 31 日。
隨著這個事件，ngUpgrade 現在處於功能完備的狀態。
我們將繼續為 ngUpgrade 發佈安全性與錯誤修正，至少到 2023 年 12 月 31 日為止。

</div>

### ngUpgrade 的運作方式

ngUpgrade 提供的主要工具之一稱為 `UpgradeModule`。這是一個模組，包含用於啟動與管理同時支援 Angular 與 AngularJS 程式碼的混合應用程式的公用程式。

使用 ngUpgrade 時，你實際上是在做的事情是*同時執行 AngularJS 與 Angular*。所有 Angular 程式碼都在 Angular 框架中執行，AngularJS 程式碼則在 AngularJS 框架中執行。這兩者都是框架實際上功能完整的版本。沒有任何模擬在進行，因此你可以預期擁有兩個框架的所有功能與自然行為。

在此基礎之上，由一個框架管理的元件與服務可以與另一個框架的元件與服務互通。這發生在三個主要領域：依賴注入、DOM 與變更偵測。

#### 依賴注入

依賴注入在 AngularJS 與 Angular 中都處於核心位置，但在實際運作方式上，兩個框架之間存在一些關鍵差異。

| AngularJS | Angular |
|:---                                                                                                                   |:---     |
| 依賴注入憑證永遠是字串 | 憑證[可以有不同的型別][AioGuideDependencyInjection]。 <br /> 它們通常是類別。 <br /> 它們也可能是字串。 |
| 只有一個注入器。 <br /> 即使在多模組應用程式中，所有東西都被倒入一個大型命名空間。 | 有一個[注入器的樹狀階層][AioGuideHierarchicalDependencyInjection]，包含一個根注入器，以及每個元件一個額外的注入器。 |

即使考量到這些差異，你仍然可以擁有依賴注入的互通性。`upgrade/static` 會解決這些差異，讓一切無縫運作：

*   你可以透過*升級* AngularJS 服務，讓它們可供注入至 Angular 程式碼。每個服務的同一個單例實例會在框架之間共用。在 Angular 中，這些服務將永遠位於*根注入器*中，並可供所有元件使用。

*   你也可以透過*降級* Angular 服務，讓它們可供注入至 AngularJS 程式碼。只有來自 Angular 根注入器的服務才能降級。同樣地，相同的單例實例會在框架之間共用。當你註冊降級後的服務時，必須明確指定你想在 AngularJS 中使用的*字串憑證*。

<div class="lightbox">

<img alt="混合式應用程式中的兩個注入器" src="generated/images/guide/upgrade/injectors.png" />

</div>

#### 元件與 DOM

在混合 ngUpgrade 應用程式的 DOM 中，有來自 AngularJS 與 Angular 的元件與指令。這些元件會使用各自框架的輸入與輸出繫結來彼此溝通，ngUpgrade 會把這些繫結銜接在一起。它們也可以透過共用的已注入依賴來溝通，如上所述。

關於混合應用程式，要理解的關鍵是 DOM 中的每個元素恰好只屬於兩個框架中的其中一個。另一個框架會忽略它。如果某個元素屬於 AngularJS，Angular 會把它當作不存在，反之亦然。

因此，一般來說，混合應用程式一開始是 AngularJS 應用程式，由 AngularJS 處理根範本，例如 index.html。當 Angular 元件在 AngularJS 範本中的某處被使用時，Angular 就會介入。該元件的範本接著會由 Angular 管理，而且它可以包含任意數量的 Angular 元件與指令。

除此之外，你可以交錯使用這兩個框架。你永遠會透過下列兩種方式之一跨越兩個框架之間的邊界：

1.  使用另一個框架的元件：AngularJS 範本使用 Angular 元件，或 Angular 範本使用 AngularJS 元件。

1.  從另一個框架轉置或投影內容。ngUpgrade 會把 AngularJS 轉置與 Angular 內容投影這兩個相關概念銜接在一起。

<div class="lightbox">

<img alt="混合式應用程式中的 DOM 元素擁有權" src="generated/images/guide/upgrade/dom.png" />

</div>

每當你使用屬於另一個框架的元件時，就會發生框架邊界之間的切換。不過，這種切換只會發生在該元件範本中的元素上。想想像這樣的情況：你從 AngularJS 使用 Angular 元件：

<code-example language="html" escape="html">

&lt;a-component&gt;&lt;/a-component&gt;

</code-example>

DOM 元素 `<a-component>` 仍將是 AngularJS 管理的元素，因為它定義在 AngularJS 範本中。這也表示你可以在它上面套用額外的 AngularJS 指令，但*不能*套用 Angular 指令。只有在 `<a-component>` 的範本中，Angular 才會介入。當你從 Angular 使用 AngularJS 元件指令時，這條規則同樣適用。

#### 變更偵測

`scope.$apply()` 是 AngularJS 偵測變更並更新資料繫結的方式。每個事件發生之後，都會呼叫 `scope.$apply()`。這可能是由框架自動完成，或由你手動完成。

在 Angular 中，情況有所不同。雖然變更偵測仍然會在每個事件之後發生，但沒有人需要呼叫 `scope.$apply()` 就能讓它發生。這是因為所有 Angular 程式碼都在一個稱為 [Angular zone][AioApiCoreNgzone] 的東西內部執行。Angular 永遠知道程式碼何時完成，因此也知道何時應該啟動變更偵測。程式碼本身不必呼叫 `scope.$apply()` 或任何類似的東西。

就混合應用程式而言，`UpgradeModule` 會銜接 AngularJS 與 Angular 的做法。以下是發生的事情：

*   應用程式中發生的每件事都在 Angular zone 內部執行。無論事件源自 AngularJS 或 Angular 程式碼，都是如此。zone 會在每個事件之後觸發 Angular 變更偵測。

*   `UpgradeModule` 會在 Angular zone 的每一輪之後呼叫 AngularJS 的 `$rootScope.$apply()`。這也會在每個事件之後觸發 AngularJS 變更偵測。

<div class="lightbox">

<img alt="混合式應用程式中的變更偵測" src="generated/images/guide/upgrade/change_detection.png" />

</div>

實際上，無論是在 AngularJS 或 Angular 中，你都不需要呼叫 `$apply()`。`UpgradeModule` 會替我們做這件事。你*仍然可以*呼叫 `$apply()`，因此不需要從現有程式碼中移除這類呼叫。這些呼叫只會在混合應用程式中觸發額外的 AngularJS 變更偵測檢查。

當你降級 Angular 元件並接著從 AngularJS 使用它時，該元件的輸入將會使用 AngularJS 變更偵測來監看。當這些輸入變更時，元件中對應的屬性就會被設定。你也可以透過在元件中實作 [OnChanges][AioApiCoreOnchanges] 介面來掛鉤這些變更，就像它沒有被降級時一樣。

相對地，當你升級 AngularJS 元件並從 Angular 使用它時，為元件指令的 `scope` \(或 `bindToController`\) 定義的所有繫結，都會掛鉤至 Angular 變更偵測。它們會被視為一般的 Angular 輸入。當它們變更時，其值將會寫入升級後元件的範圍 \(或控制器\)。

### 在 Angular *NgModule* 中使用 UpgradeModule

AngularJS 與 Angular 都有各自的模組概念，用來協助把應用程式組織成內聚的功能區塊。

它們在架構與實作上的細節相當不同。在 AngularJS 中，你會把 Angular 資產加入 `angular.module` 屬性。在 Angular 中，你會建立一個或多個以 `NgModule` 裝飾器修飾的類別，該裝飾器會在中繼資料中描述 Angular 資產。差異由此展開。

在混合應用程式中，你會同時執行兩個版本的 Angular。這表示你需要分別來自 AngularJS 與 Angular 的至少一個模組。你會在 NgModule 內部匯入 `UpgradeModule`，接著用它來啟動 AngularJS 模組。

<div class="alert is-helpful">

更多資訊請參閱 [NgModule][AioGuideNgmodules]。

</div>

### 啟動混合應用程式

要啟動混合應用程式，你必須啟動應用程式的 Angular 與 AngularJS 各個部分。你必須先啟動 Angular 的部分，接著再請 `UpgradeModule` 啟動 AngularJS 的部分。

在 AngularJS 應用程式中，你有一個根 AngularJS 模組，它也會用來啟動 AngularJS 應用程式。

<code-example header="app.module.ts" path="upgrade-module/src/app/ajs-bootstrap/app.module.ts" region="ng1module"></code-example>

純 AngularJS 應用程式可以透過在 HTML 頁面的某處使用 `ng-app` 指令來自動啟動。但對於混合應用程式，你要使用 `UpgradeModule` 手動啟動。因此，即使在把應用程式切換至混合模式之前，先把 AngularJS 應用程式切換為使用手動 JavaScript [`angular.bootstrap`][AngularjsDocsApiNgFunctionAngularBootstrap] 方法，也是一個很好的預備步驟。

假設你有一個由 `ng-app` 驅動的啟動方式，像這樣：

<code-example path="upgrade-module/src/index-ng-app.html"></code-example>

你可以從 HTML 移除 `ng-app` 與 `ng-strict-di` 指令，改為從 JavaScript 呼叫 `angular.bootstrap`，結果會是相同的：

<code-example header="app.module.ts" path="upgrade-module/src/app/ajs-bootstrap/app.module.ts" region="bootstrap"></code-example>

要開始把你的 AngularJS 應用程式轉換為混合應用程式，你需要載入 Angular 框架。你可以依照 [升級至 AngularJS 的設定][AioGuideUpgradeSetup] 中的指示，透過 SystemJS 來了解如何做到這一點，方法是從 [QuickStart GitHub 儲存庫][GithubAngularQuickstart] 選擇性地複製程式碼。

你還需要使用 `@angular/upgrade` 安裝 `npm install @angular/upgrade --save` 套件，並為 `@angular/upgrade/static` 套件加入對映：

<code-example header="systemjs.config.js (map)" path="upgrade-module/src/systemjs.config.1.js" region="upgrade-static-package"></code-example>

接著，建立一個 `app.module.ts` 檔案，並加入下列 `NgModule` 類別：

<code-example header="app.module.ts" path="upgrade-module/src/app/ajs-a-hybrid-bootstrap/app.module.ts" region="ngmodule"></code-example>

這個最精簡的 `NgModule` 會匯入 `BrowserModule`，這是每個以瀏覽器為基礎的 Angular 應用程式都必須有的模組。它也會從 `UpgradeModule` 匯入 `@angular/upgrade/static`，該模組會匯出用於升級與降級服務和元件的提供者。

在 `AppModule` 的建構子中，使用依賴注入來取得 `UpgradeModule` 實例，並在 `AppModule.ngDoBootstrap` 方法中使用它來啟動 AngularJS 應用程式。`upgrade.bootstrap` 方法接受與 [angular.bootstrap][AngularjsDocsApiNgFunctionAngularBootstrap] 完全相同的引數：

<div class="alert is-helpful">

**注意**： <br />
你不需要在 `@NgModule` 裝飾器中加入 `bootstrap` 宣告，因為 AngularJS 將擁有應用程式的根範本。

</div>

現在，你可以使用 `AppModule` 方法來啟動 `platformBrowserDynamic.bootstrapModule`。

<code-example header="app.module.ts" path="upgrade-module/src/app/ajs-a-hybrid-bootstrap/app.module.ts" region="bootstrap"></code-example>

恭喜。你正在執行混合應用程式。現有的 AngularJS 程式碼一如往常地運作，*而且*你已經準備好開始加入 Angular 程式碼。

<a id="using-angular-components-from-angularjs-code"></a>
### 從 AngularJS 程式碼使用 Angular 元件

<div class="lightbox">

<img alt="在 AngularJS 程式碼中使用 Angular 元件" class="left" src="generated/images/guide/upgrade/ajs-to-a.png" />

</div>

一旦你開始執行混合應用程式，就可以開始逐步升級程式碼的過程。其中一種較常見的模式，是在 AngularJS 情境中使用 Angular 元件。這可能是全新的元件，也可能是先前是 AngularJS 但已為 Angular 重寫的元件。

假設你有一個顯示英雄資訊的 Angular 元件：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/downgrade-static/hero-detail.component.ts"></code-example>

如果你想從 AngularJS 使用這個元件，你需要使用 `downgradeComponent()` 方法來*降級*它。結果會是一個 AngularJS *指令*，接著你可以在 AngularJS 模組中註冊它：

<code-example header="app.module.ts" path="upgrade-module/src/app/downgrade-static/app.module.ts" region="downgradecomponent"></code-example>

<div class="alert is-helpful">

預設情況下，Angular 變更偵測也會在每一次 AngularJS `$digest` 週期對該元件執行。
如果你只想在輸入變更時才執行變更偵測，可以在呼叫 `downgradeComponent()` 時把 `propagateDigest` 設定為 `false`。

</div>

因為 `HeroDetailComponent` 是 Angular 元件，你還必須把它加入 `declarations` 的 `AppModule` 中。

<code-example header="app.module.ts" path="upgrade-module/src/app/downgrade-static/app.module.ts" region="ngmodule"></code-example>

<div class="alert is-helpful">

所有 Angular 元件、指令與管道都必須在 NgModule 中宣告。

</div>

最終結果是一個名為 `heroDetail` 的 AngularJS 指令，你可以在 AngularJS 範本中像使用任何其他指令一樣使用它。

<code-example path="upgrade-module/src/index-downgrade-static.html" region="usecomponent"></code-example>

<div class="alert is-helpful">

**注意**： <br />
這個 AngularJS 是元素指令 \(`restrict: 'E'`\)，稱為 `heroDetail`。
AngularJS 元素指令是根據其*名稱*來比對的。
*降級後 Angular 元件的 `selector` 中繼資料會被忽略*。

</div>

當然，大多數元件並不這麼簡單。它們大多有連接至外部世界的*輸入與輸出*。一個具有輸入與輸出的 Angular 英雄詳細資料元件，看起來可能像這樣：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/downgrade-io/hero-detail.component.ts"></code-example>

這些輸入與輸出可以從 AngularJS 範本提供，而 `downgradeComponent()` 方法會負責把它們接線起來：

<code-example path="upgrade-module/src/index-downgrade-io.html" region="usecomponent"></code-example>

即使你身處 AngularJS 範本中，**你正在使用 Angular 屬性語法來繫結輸入與輸出。**這是降級後元件的要求。運算式本身仍然是一般的 AngularJS 運算式。

<div class="callout is-important">

<header>降級後的元件屬性請使用 kebab-case</header>

使用 Angular 屬性語法來處理降級後元件的規則有一個值得注意的例外。
它與由多個單字組成的輸入或輸出名稱有關。
在 Angular 中，你會使用 camelCase 來繫結這些屬性：

<code-example language="html">

[myHero]="hero"
(heroDeleted)="handleHeroDeleted(&dollar;event)"

</code-example>

但從 AngularJS 範本使用它們時，你必須使用 kebab-case：

<code-example language="html">

[my-hero]="hero"
(hero-deleted)="handleHeroDeleted(&dollar;event)"

</code-example>

</div>

`$event` 變數可以在輸出中使用，以存取發出的物件。在這個例子中，它會是 `Hero` 物件，因為那是傳遞給 `this.deleted.emit()` 的內容。

因為這是 AngularJS 範本，即使元素上有 Angular 繫結屬性，你仍然可以在該元素上使用其他 AngularJS 指令。例如，你可以使用 `ng-repeat` 輕鬆建立元件的多個副本：

<code-example path="upgrade-module/src/index-downgrade-io.html" region="userepeatedcomponent"></code-example>

### 從 Angular 程式碼使用 AngularJS 元件指令

<div class="lightbox">

<img alt="在 Angular 程式碼中使用 AngularJS 元件" class="left" src="generated/images/guide/upgrade/a-to-ajs.png" />

</div>

所以，你可以撰寫 Angular 元件，然後從 AngularJS 程式碼使用它。當你開始從較低階的元件移轉、逐步往上進行時，這很有用。但在某些情況下，以相反的順序做事更方便：從較高階的元件開始、逐步往下進行。這也可以使用 `upgrade/static` 做到。你可以*升級* AngularJS 元件指令，然後從 Angular 使用它們。

並非所有種類的 AngularJS 指令都能升級。該指令真的必須是*元件指令*，具備[上述準備指南中描述的][AioGuideUpgradeUsingComponentDirectives]特性。確保相容性最穩妥的方法，是使用 AngularJS 1.5 中引入的 [component API][AngularjsDocsApiNgTypeAngularModule]。

可升級元件的一個例子，是只有範本與控制器的元件：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/upgrade-static/hero-detail.component.ts" region="hero-detail"></code-example>

你可以使用 `UpgradeComponent` 類別把這個元件*升級*至 Angular。方法是建立一個新的 Angular **指令**，讓它擴充 `UpgradeComponent`，並在其建構子內部進行 `super` 呼叫，這樣你就有了一個可在 Angular 內部使用的完全升級後的 AngularJS 元件。剩下的只是把它加入 `declarations` 的 `AppModule` 陣列。

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/upgrade-static/hero-detail.component.ts" region="hero-detail-upgrade"></code-example>

<code-example header="app.module.ts" path="upgrade-module/src/app/upgrade-static/app.module.ts" region="hero-detail-upgrade"></code-example>

<div class="alert is-helpful">

升級後的元件是 Angular **指令**，而不是**元件**，因為 Angular 不知道 AngularJS 會在其下方建立元素。
就 Angular 所知，升級後的元件只是一個指令——一個標籤——而 Angular 不必關心它的子元素。

</div>

升級後的元件也可能具有輸入與輸出，如原始 AngularJS 元件指令的範圍／控制器繫結所定義。當你從 Angular 範本使用該元件時，請使用 **Angular 範本語法**提供輸入與輸出，並遵守下列規則：

| 繫結 | 繫結定義 | 範本語法 |
|:---                |:---                           |:---             |
| 屬性繫結 | `myAttribute: '@myAttribute'` | `<my-component myAttribute="value">` |
| 運算式繫結 | `myOutput: '&myOutput'` | `<my-component (myOutput)="action()">` |
| 單向繫結 | `myValue: '<myValue'` | `<my-component [myValue]="anExpression">` |
| 雙向繫結 | `myValue: '=myValue'` | 作為雙向繫結： <br /> `<my-component [(myValue)]="anExpression">` <br /> 由於大多數 AngularJS 雙向繫結在實務上其實只需要單向繫結，因此 `<my-component [myValue]="anExpression">` 通常就足夠了。 |

例如，想像一個具有一個輸入與一個輸出的英雄詳細資料 AngularJS 元件指令：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/upgrade-io/hero-detail.component.ts" region="hero-detail-io"></code-example>

你可以把這個元件升級至 Angular，在升級指令中標註輸入與輸出，然後使用 Angular 範本語法提供輸入與輸出：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/upgrade-io/hero-detail.component.ts" region="hero-detail-io-upgrade"></code-example>

<code-example header="container.component.ts" path="upgrade-module/src/app/upgrade-io/container.component.ts"></code-example>

### 把 AngularJS 內容投影至 Angular 元件

<div class="lightbox">

<img alt="將 AngularJS 內容投影到 Angular" class="left" src="generated/images/guide/upgrade/ajs-to-a-with-projection.png" />

</div>

當你從 AngularJS 範本使用降級後的 Angular 元件時，可能會需要把一些內容*轉置*至其中。這也是可行的。雖然 Angular 中沒有轉置這種東西，但有一個非常類似的概念，稱為*內容投影*。`upgrade/static` 能夠讓這兩個功能互通。

支援內容投影的 Angular 元件會在其中使用 `<ng-content>` 標籤。以下是這類元件的一個例子：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/ajs-to-a-projection/hero-detail.component.ts"></code-example>

從 AngularJS 使用該元件時，你可以為它提供內容。就像它們在 AngularJS 中會被轉置一樣，它們會被投影至 Angular 中 `<ng-content>` 標籤所在的位置：

<code-example path="upgrade-module/src/index-ajs-to-a-projection.html" region="usecomponent"></code-example>

<div class="alert is-helpful">

當 AngularJS 內容在 Angular 元件內部被投影時，它仍然留在「AngularJS 領域」，並由 AngularJS 框架管理。

</div>

### 把 Angular 內容轉置至 AngularJS 元件指令

<div class="lightbox">

<img alt="將 Angular 內容投影到 AngularJS" class="left" src="generated/images/guide/upgrade/a-to-ajs-with-transclusion.png" />

</div>

正如你可以把 AngularJS 內容投影至 Angular 元件一樣，只要你使用的是它們的升級版本，你也可以把 Angular 內容*轉置*至 AngularJS 元件。

當 AngularJS 元件指令支援轉置時，它可以在其範本中使用 `ng-transclude` 指令來標示轉置點：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/a-to-ajs-transclusion/hero-detail.component.ts"></code-example>

如果你升級這個元件並從 Angular 使用它，你可以把元件標籤填入內容，這些內容接著就會被轉置：

<code-example header="container.component.ts" path="upgrade-module/src/app/a-to-ajs-transclusion/container.component.ts"></code-example>

### 讓 AngularJS 依賴可注入至 Angular

執行混合應用程式時，你可能會遇到需要把一些 AngularJS 依賴注入至 Angular 程式碼的情況。也許你還有一些商業邏輯留在 AngularJS 服務中。也許你想存取 AngularJS 的內建服務，例如 `$location` 或 `$timeout`。

在這些情況下，你可以把 AngularJS 提供者*升級*至 Angular。這讓你接著可以在 Angular 程式碼中的某處注入它。例如，你可能在 AngularJS 中有一個名為 `HeroesService` 的服務：

<code-example header="heroes.service.ts" path="upgrade-module/src/app/ajs-to-a-providers/heroes.service.ts"></code-example>

你可以使用 Angular [工廠提供者][AioGuideDependencyInjectionProvidersFactoryProviders] 來升級該服務，該提供者會從 AngularJS `$injector` 請求該服務。

許多開發人員偏好在獨立的 `ajs-upgraded-providers.ts` 檔案中宣告工廠提供者，讓它們集中在一起，這樣更容易參照它們、建立新的提供者，並在升級結束後刪除它們。

也建議匯出 `heroesServiceFactory` 函式，讓 Ahead-of-Time 編譯能夠取用它。

<div class="alert is-helpful">

**注意**： <br />
工廠內部的 'heroes' 字串指的是 AngularJS 的 `HeroesService`。
在 AngularJS 應用程式中，通常會選擇一個服務名稱作為憑證，例如 "heroes"，並附加 "Service" 後綴來建立類別名稱。

</div>

<code-example header="ajs-upgraded-providers.ts" path="upgrade-module/src/app/ajs-to-a-providers/ajs-upgraded-providers.ts"></code-example>

接著，你可以把該服務提供給 Angular，方法是把它加入 `@NgModule`：

<code-example header="app.module.ts" path="upgrade-module/src/app/ajs-to-a-providers/app.module.ts" region="register"></code-example>

接著，透過在元件建構子中使用其類別作為型別註解來注入服務，就可以在元件內部使用該服務：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/ajs-to-a-providers/hero-detail.component.ts"></code-example>

<div class="alert is-helpful">

在這個範例中，你升級了一個服務類別。
你可以在注入它時使用 TypeScript 型別註解。
雖然這不會影響依賴的處理方式，但它能帶來靜態型別檢查的好處。
這不是必要的，任何 AngularJS 服務、工廠或提供者都可以升級。

</div>

### 讓 Angular 依賴可注入至 AngularJS

除了升級 AngularJS 依賴之外，你還可以*降級* Angular 依賴，讓你可以從 AngularJS 使用它們。當你開始把服務移轉至 Angular，或在保留以 AngularJS 撰寫的元件的同時於 Angular 中建立新服務時，這會很有用。

例如，你可能有一個名為 `Heroes` 的 Angular 服務：

<code-example header="heroes.ts" path="upgrade-module/src/app/a-to-ajs-providers/heroes.ts"></code-example>

同樣地，與 Angular 元件一樣，請透過把提供者加入模組的 `NgModule` 清單，來向 `providers` 註冊該提供者。

<code-example header="app.module.ts" path="upgrade-module/src/app/a-to-ajs-providers/app.module.ts" region="ngmodule"></code-example>

現在，使用 `Heroes` 把 Angular 的 `downgradeInjectable()` 包裝在 *AngularJS 工廠函式*中，並把該工廠插入 AngularJS 模組。AngularJS 依賴的名稱由你決定：

<code-example header="app.module.ts" path="upgrade-module/src/app/a-to-ajs-providers/app.module.ts" region="register"></code-example>

在此之後，該服務在 AngularJS 程式碼中的任何地方都可以注入：

<code-example header="hero-detail.component.ts" path="upgrade-module/src/app/a-to-ajs-providers/hero-detail.component.ts"></code-example>

## 延遲載入 AngularJS

建構應用程式時，你會希望確保只有在必要時才載入所需的資源。無論是載入資產或程式碼，確保所有可以延後到需要時才處理的事物都能延後，可以讓你的應用程式保持有效率地執行。當在同一個應用程式中執行不同的框架時，這一點尤其重要。

[延遲載入][AioGuideGlossaryLazyLoading] 是一種技術，它會把所需資產與程式碼資源的載入延後到實際使用時才進行。這會縮短啟動時間並提高效率，特別是在同一個應用程式中執行不同框架時。

當使用混合方法把大型應用程式從 AngularJS 移轉至 Angular 時，你會希望先移轉一些最常用的功能，只在需要時才使用較不常用的功能。這麼做有助於確保應用程式在你移轉期間，仍能為使用者提供無縫的體驗。

在大多數同時使用 Angular 與 AngularJS 來渲染應用程式的環境中，兩個框架都會在傳送給用戶端的初始套件中載入。這會導致套件變大，也可能降低效能。

整體應用程式效能會在使用者停留在 Angular 渲染的頁面時受到影響，因為即使 AngularJS 框架與應用程式從未被存取，它們仍然已載入並正在執行。

你可以採取步驟來減輕套件大小與效能問題。透過把 AngularJS 應用程式隔離至獨立的套件，你可以利用[延遲載入][AioGuideGlossaryLazyLoading]，只在需要時才載入、啟動並渲染 AngularJS 應用程式。這項策略可以縮小初始套件大小、把載入兩個框架的任何潛在影響延後到絕對必要時才發生，並讓你的應用程式盡可能有效率地執行。

下列步驟將說明如何執行以下事項：

*   為你的 AngularJS 套件設定回呼函式。
*   建立一個會延遲載入並啟動 AngularJS 應用程式的服務。
*   為 AngularJS 內容建立可路由的元件
*   為 AngularJS 專屬的 URL 建立自訂 `matcher` 函式，並以自訂比對器為 AngularJS 路由設定 Angular `Router`。

### 建立服務以延遲載入 AngularJS

從 Angular 第 8 版開始，可以使用動態匯入語法 `import('...')` 來延遲載入程式碼。在你的應用程式中，你要建立一個使用動態匯入來延遲載入 AngularJS 的新服務。

<code-example header="src/app/lazy-loader.service.ts" path="upgrade-lazy-load-ajs/src/app/lazy-loader.service.ts"></code-example>

該服務使用 `import()` 方法來延遲載入你打包的 AngularJS 應用程式。這會縮小應用程式的初始套件大小，因為你尚未載入使用者還不需要的程式碼。你還需要提供一種方式，在載入之後手動*啟動*應用程式。AngularJS 提供了一種使用 [angular.bootstrap()][AngularjsDocsApiNgFunctionAngularBootstrap] 方法搭配提供的 HTML 元素來手動啟動應用程式的方式。你的 AngularJS 應用程式也應該公開一個會啟動 AngularJS 應用程式的 `bootstrap` 方法。

為了確保在 AngularJS 應用程式中觸發任何必要的拆卸，例如移除全域監聽器，你還要實作一個方法來呼叫 `$rootScope.destroy()` 方法。

<code-example header="angularjs-app" path="upgrade-lazy-load-ajs/src/app/angularjs-app/index.ts"></code-example>

你的 AngularJS 應用程式只設定了渲染內容所需的路由。應用程式中其餘的路由由 Angular Router 處理。在套件載入之後，你的 Angular 應用程式中會呼叫公開的 `bootstrap` 方法來啟動 AngularJS 應用程式。

<div class="alert is-important">

**注意**： <br />
在 AngularJS 載入並啟動之後，諸如在路由設定中接線的監聽器等監聽器，將會繼續監聽路由變更。
為確保在不顯示 AngularJS 時關閉監聽器，請使用 [$routeProvider][AngularjsDocsApiNgrouteProviderRouteprovider] 設定一個 `otherwise` 選項，渲染一個空範本。
這假設所有其他路由都將由 Angular 處理。

</div>

### 建立元件以渲染 AngularJS 內容

在你的 Angular 應用程式中，你需要一個元件作為 AngularJS 內容的預留位置。這個元件會使用你建立的服務，在元件初始化之後載入並啟動你的 AngularJS 應用程式。

<code-example header="src/app/angular-js/angular-js.component.ts" path="upgrade-lazy-load-ajs/src/app/angular-js/angular-js.component.ts"></code-example>

當 Angular Router 比對到使用 AngularJS 的路由時，就會渲染 `AngularJSComponent`，而內容會在 AngularJS [`ng-view`][AngularjsDocsApiNgrouteDirectiveNgview] 指令內渲染。當使用者離開該路由時，AngularJS 應用程式上的 `$rootScope` 就會被銷毀。

### 為 AngularJS 路由設定自訂路由比對器

要設定 Angular Router，你必須為 AngularJS 的 URL 定義一個路由。為了比對這些 URL，你要加入一個使用 `matcher` 屬性的路由設定。`matcher` 讓你可以使用自訂模式比對來比對 URL 路徑。Angular Router 會先嘗試比對較具體的路由，例如靜態路由與變數路由。當它找不到相符項目時，接著會查看路由設定中定義的自訂比對器。如果自訂比對器不符合任何路由，它接著會前往萬用路由，例如 404 頁面。

下列範例為 AngularJS 路由定義了一個自訂比對器函式。

<code-example header="src/app/app-routing.module.ts" path="upgrade-lazy-load-ajs/src/app/app-routing.module.ts" region="matcher"></code-example>

下列程式碼會使用 `matcher` 屬性與自訂比對器，以及 `component` 屬性搭配 `AngularJSComponent`，把一個路由物件加入你的路由設定。

<code-example header="src/app/app-routing.module.ts" path="upgrade-lazy-load-ajs/src/app/app-routing.module.ts"></code-example>

當你的應用程式比對到需要 AngularJS 的路由時，AngularJS 應用程式會被載入並啟動，AngularJS 路由會比對必要的 URL 來渲染其內容，而你的應用程式會繼續同時使用 AngularJS 與 Angular 框架執行。

<a id="using-the-unified-angular-location-service"></a>
## 使用統一的 Angular 位置服務

在 AngularJS 中，[$location 服務][AngularjsDocsApiNgServiceLocation] 會處理所有的路由設定與導覽、URL 的編碼與解碼、重新導向，以及與瀏覽器 API 的互動。Angular 會使用其底層的 `Location` 服務來處理所有這些工作。

當你從 AngularJS 移轉至 Angular 時，你會希望盡可能把責任移交給 Angular，這樣你才能利用新的 API。為了協助過渡，Angular 提供了 `LocationUpgradeModule`。這個模組會啟用*統一*的位置服務，把責任從 AngularJS 的 `$location` 服務轉移至 Angular 的 `Location` 服務。

要使用 `LocationUpgradeModule`，請從 `@angular/common/upgrade` 匯入該符號，並使用靜態 `AppModule` 方法把它加入 `LocationUpgradeModule.config()` 的匯入項目。

<code-example language="typescript">

// Other imports &hellip;
import { LocationUpgradeModule } from '&commat;angular/common/upgrade';

&commat;NgModule({
  imports: [
    // Other NgModule imports&hellip;
    LocationUpgradeModule.config()
  ]
})
export class AppModule {}

</code-example>

`LocationUpgradeModule.config()` 方法接受一個設定物件，讓你可以設定選項，包括搭配 `LocationStrategy` 屬性的 `useHash`，以及搭配 `hashPrefix` 屬性的 URL 前置字元。

`useHash` 屬性預設為 `false`，而 `hashPrefix` 預設為空 `string`。請傳入設定物件來覆寫預設值。

<code-example language="typescript">

LocationUpgradeModule.config({
  useHash: true,
  hashPrefix: '!'
})

</code-example>

<div class="alert is-important">

**注意**： <br />
請參閱 `LocationUpgradeConfig`，了解 `LocationUpgradeModule.config()` 方法可用的更多設定選項。

</div>

這會為 AngularJS 中的 `$location` 提供者註冊一個即插即用的替代品。註冊之後，導覽期間在 AngularJS 中觸發的所有導覽、路由廣播訊息，以及任何必要的摘要週期，都由 Angular 處理。這讓你在混合應用程式的兩側都能以一致的方式，用單一方式進行導覽。

若要在 AngularJS 中把 `$location` 服務用作提供者，你需要使用工廠提供者來降級 `$locationShim`。

<code-example language="typescript">

// Other imports &hellip;
import { &dollar;locationShim } from '&commat;angular/common/upgrade';
import { downgradeInjectable } from '&commat;angular/upgrade/static';

angular.module('myHybridApp', [&hellip;])
  .factory('&dollar;location', downgradeInjectable(&dollar;locationShim));

</code-example>

一旦你引入 Angular Router，使用 Angular Router 就會透過統一的位置服務觸發導覽，仍能為使用 AngularJS 與 Angular 進行導覽提供單一來源。

<!--TODO:
Correctly document how to use AOT with SystemJS-based `ngUpgrade` apps (or better yet update the `ngUpgrade` examples/guides to use `@angular/cli`).
See [https://github.com/angular/angular/issues/35989][GithubAngularAngularIssues35989].

## Using Ahead-of-time compilation with hybrid apps

You can take advantage of Ahead-of-time \(AOT\) compilation on hybrid apps just like on any other Angular application.
The setup for a hybrid app is mostly the same as described in the [Ahead-of-time Compilation chapter][AioGuideAotCompiler] save for differences in `index.html` and `main-aot.ts`

The `index.html` will likely have script tags loading AngularJS files, so the `index.html` for AOT must also load those files.
An easy way to copy them is by adding each to the `copy-dist-files.js` file.

You'll need to use the generated `AppModuleFactory`, instead of the original `AppModule` to bootstrap the hybrid app:

<code-example header="app/main-aot.ts" path="upgrade-phonecat-2-hybrid/app/main-aot.ts"></code-example>

And that s all you need do to get the full benefit of AOT for Angular apps!
-->

## PhoneCat 升級教學

在本節中，你將學習如何使用 `ngUpgrade` 來準備與升級應用程式。範例應用程式是來自[原始 AngularJS 教學][GithubAngularAngularPhonecat]的 [Angular PhoneCat][AngularjsDocsTutorial]，那是我們許多人展開 Angular 冒險的起點。現在，你將看到如何把該應用程式帶入 Angular 的勇敢新世界。

在此過程中，你將學習如何套用[準備指南][AioGuideUpgradePreparation]中概述的步驟。你將讓應用程式與 Angular 對齊，也開始以 TypeScript 撰寫程式碼。

本教學以 `angular-phonecat` 教學的 1.5.x 版本為基礎，該版本保存在儲存庫的 [1.5-snapshot][GithubAngularAngularPhonecatCommits15Snapshot] 分支中。要跟著操作，請複製 [angular-phonecat][GithubAngularAngularPhonecat] 儲存庫，取出 `1.5-snapshot` 分支，並在進行過程中套用這些步驟。

就專案結構而言，這就是工作的起點：

<div class="filetree">
  <div class="file">
    angular-phonecat
  </div>
  <div class="children">
    <div class="file">
      bower.json
    </div>
    <div class="file">
      karma.conf.js
    </div>
    <div class="file">
      package.json
    </div>
    <div class="file">
      app
    </div>
    <div class="children">
      <div class="file">
        core
      </div>
      <div class="children">
        <div class="file">
          checkmark
        </div>
        <div class="children">
          <div class="file">
            checkmark.filter.js
          </div>
          <div class="file">
            checkmark.filter.spec.js
          </div>
        </div>
        <div class="file">
          phone
        </div>
        <div class="children">
          <div class="file">
            phone.module.js
          </div>
          <div class="file">
            phone.service.js
          </div>
          <div class="file">
            phone.service.spec.js
          </div>
        </div>
        <div class="file">
          core.module.js
        </div>
      </div>
      <div class="file">
        phone-detail
      </div>
      <div class="children">
        <div class="file">
          phone-detail.component.js
        </div>
        <div class="file">
          phone-detail.component.spec.js
        </div>
        <div class="file">
          phone-detail.module.js
        </div>
        <div class="file">
          phone-detail.template.html
        </div>
      </div>
      <div class="file">
        phone-list
      </div>
      <div class="children">
        <div class="file">
          phone-list.component.js
        </div>
        <div class="file">
          phone-list.component.spec.js
        </div>
        <div class="file">
          phone-list.module.js
        </div>
        <div class="file">
          phone-list.template.html
        </div>
      </div>
      <div class="file">
        img
      </div>
      <div class="children">
        <div class="file">
           &hellip;
        </div>
      </div>
      <div class="file">
        phones
      </div>
      <div class="children">
        <div class="file">
           &hellip;
        </div>
      </div>
      <div class="file">
        app.animations.js
      </div>
      <div class="file">
        app.config.js
      </div>
      <div class="file">
        app.css
      </div>
      <div class="file">
        app.module.js
      </div>
      <div class="file">
        index.html
      </div>
    </div>
    <div class="file">
      e2e-tests
    </div>
    <div class="children">
      <div class="file">
        protractor-conf.js
      </div>
      <div class="file">
        scenarios.js
      </div>
    </div>
  </div>
</div>

這實際上是一個相當不錯的起點。程式碼使用了 AngularJS 1.5 元件 API，組織方式也遵循 [AngularJS 風格指南][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMd]，而這是成功升級之前一項重要的[準備步驟][AioGuideUpgradeFollowTheAngularjsStyleGuide]。

*   每個元件、服務與篩選器都在各自的原始碼檔案中，符合[單一職責原則][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdSingleResponsibility]。

*   `core`、`phone-detail` 與 `phone-list` 模組各自位於自己的子目錄中。這些子目錄包含 JavaScript 程式碼，以及搭配各個特定功能的 HTML 範本。這符合[依功能分資料夾結構][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdFoldersByFeatureStructure]與[模組化][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdModularity]規則。

*   單元測試與應用程式程式碼並排放置在容易找到的地方，如[組織測試][GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdOrganizingTests]規則中所述。

### 改用 TypeScript

既然你要用 TypeScript 撰寫 Angular 程式碼，那麼即使還沒開始升級，先把 TypeScript 編譯器引進來也是合理的。

你也要開始逐步淘汰 Bower 套件管理員，改用 NPM，之後所有新的相依性都用 NPM 安裝，最終把 Bower 從專案中移除。

首先在專案中安裝 TypeScript。

<code-example format="shell" language="shell">

npm i typescript --save-dev

</code-example>

安裝你正在使用、但沒有內附型別的既有程式庫的型別定義：AngularJS、AngularJS Material，以及 Jasmine 單元測試框架。

以 PhoneCat 應用程式為例，你可以用下列指令安裝必要的型別定義：

<code-example format="shell" language="shell">

npm install &commat;types/jasmine &commat;types/angular &commat;types/angular-animate &commat;types/angular-aria &commat;types/angular-cookies &commat;types/angular-mocks &commat;types/angular-resource &commat;types/angular-route &commat;types/angular-sanitize --save-dev

</code-example>

如果你使用 AngularJS Material，可以用下列方式安裝型別定義：

<code-example format="shell" language="shell">

npm install &commat;types/angular-material --save-dev

</code-example>

你也應該依照 [TypeScript 設定][AioGuideTypescriptConfiguration]指南，在專案目錄中用 `tsconfig.json` 設定 TypeScript 編譯器。`tsconfig.json` 檔案會告訴 TypeScript 編譯器，如何把你的 TypeScript 檔案轉換成 ES5 程式碼，並打包成 CommonJS 模組。

最後，你應該在 `package.json` 中加入一些 npm 指令碼，把 TypeScript 檔案編譯成 JavaScript \(依據 `tsconfig.json` 設定檔\):

<code-example format="shell" language="shell">

"scripts": {
  "tsc": "tsc",
  "tsc:w": "tsc -w",
  &hellip;

</code-example>

現在從命令列以監看模式啟動 TypeScript 編譯器：

<code-example format="shell" language="shell">

npm run tsc:w

</code-example>

讓這個程序持續在背景執行，在你修改程式碼時監看並重新編譯。

接著，把你現有的 JavaScript 檔案轉換成 TypeScript。由於 TypeScript 是 ECMAScript 2015 的超集，而 ECMAScript 2015 又是 ECMAScript 5 的超集，你可以把副檔名從 `.js` 改成 `.ts`，一切都會和以前一樣運作。當 TypeScript 編譯器執行時，它會為每個 `.js` 檔案產生對應的 `.ts` 檔案，而實際執行的就是編譯出來的 JavaScript。如果你用 `npm start` 啟動專案的 HTTP 伺服器，你應該會在瀏覽器中看到功能完整的應用程式。

不過，現在你有了 TypeScript，就可以開始運用它的一些功能了。這個語言能為 AngularJS 應用程式帶來不少價值。

首先，TypeScript 是 ES2015 的超集。任何先前用 ES5 撰寫的應用程式——就像 PhoneCat 範例一樣——有了 TypeScript 之後，就可以開始使用 ES2015 新增的所有 JavaScript 功能。這些功能包括 `let` 和 `const`、箭頭函式、預設函式參數，以及解構賦值。

另一件你可以做的事，是開始為程式碼加入*型別安全*。其實這已經部分發生了，因為你安裝了 AngularJS 的型別定義。當你把元件註冊到 Angular 模組等操作時，TypeScript 會檢查你是否正確呼叫了 AngularJS 的 API。

但你也可以開始加入*型別註解*，進一步發揮 TypeScript 型別系統的價值。例如，你可以為 checkmark 過濾器加上註解，明確指出它預期以布林值作為引數。這樣能更清楚地表達這個過濾器的用途。

<code-example header="app/core/checkmark/checkmark.filter.ts" path="upgrade-phonecat-1-typescript/app/core/checkmark/checkmark.filter.ts"></code-example>

在 `Phone` 服務中，你可以明確地把 `$resource` 服務相依性註解為 `angular.resource.IResourceService`——一個由 AngularJS 型別定義所定義的型別。

<code-example header="app/core/phone/phone.service.ts" path="upgrade-phonecat-1-typescript/app/core/phone/phone.service.ts"></code-example>

你可以在應用程式的路由設定檔 `app.config.ts` 中套用同樣的技巧，你在其中使用了 location 和 route 服務。只要對應地加上註解，TypeScript 就能驗證你是否以正確種類的引數呼叫它們的 API。

<code-example header="app/app.config.ts" path="upgrade-phonecat-1-typescript/app/app.config.ts"></code-example>

<div class="alert is-helpful">

你安裝的 [AngularJS 1.x 型別定義][NpmjsPackageTypesAngular] 並非由 Angular 團隊正式維護，但相當完整。
在這些定義的協助下，你可以讓 AngularJS 1.x 應用程式完全加上型別註解。

如果你想這麼做，啟用 `tsconfig.json` 中的 `noImplicitAny` 設定選項會是個好主意。
這會讓 TypeScript 編譯器在有任何尚未加上型別註解的程式碼時顯示警告。
你可以用它作為指南，了解你距離擁有完整註解的專案還有多遠。

</div>

另一個可以運用的 TypeScript 功能是*類別*。特別是，你可以把元件控制器轉換成類別。這樣它們就更接近 Angular 元件類別了，升級之後也會讓日子好過一些。

AngularJS 預期控制器是建構函式。ES2015／TypeScript 的類別在底層正是如此，所以這表示你可以直接把類別當作元件控制器使用，AngularJS 會很樂意使用它。

以下是電話清單元件控制器的新類別看起來的樣子：

<code-example header="app/phone-list/phone-list.component.ts" path="upgrade-phonecat-1-typescript/app/phone-list/phone-list.component.ts"> </code-example>

先前在控制器函式中完成的事，現在改在類別建構函式中完成。相依性注入註解是透過靜態屬性 `$inject` 附加到類別上的。在執行時期，這會成為 `PhoneListController.$inject` 屬性。

這個類別還另外宣告了三個成員：電話陣列、目前排序鍵的名稱，以及搜尋查詢。這些都是你先前就已經附加到控制器上的東西，只是之前沒有在任何地方明確宣告。其中最後一個在 TypeScript 程式碼中其實沒有用到，因為它只在範本中被參照，但為了清楚起見，你應該定義控制器的所有成員。

在電話詳細資料控制器中，你會有兩個成員：一個是使用者正在查看的電話，另一個是目前顯示圖片的 URL：

<code-example header="app/phone-detail/phone-detail.component.ts" path="upgrade-phonecat-1-typescript/app/phone-detail/phone-detail.component.ts"></code-example>

這樣一來，控制器程式碼看起來就更像 Angular 了。你已經準備好把 Angular 真正引進專案了。

如果你在專案中有任何 AngularJS 服務，那些也是轉換成類別的好對象，因為它們和控制器一樣，也是建構函式。但在這個專案中，你只有 `Phone` 工廠，而它有點特別，因為它是一個 `ngResource` 工廠。所以在準備階段你不會對它做任何事。你會直接把它轉換成 Angular 服務。

### 安裝 Angular

完成準備工作後，就開始進行 PhoneCat 的 Angular 升級。你將在 Angular 隨附的 [ngUpgrade][AioGuideUpgradeUpgradingWithNgupgrade] 的協助下逐步進行。完成之後，你就能把 AngularJS 從專案中完全移除，但關鍵是一步一步來，不要破壞應用程式。

<div class="alert is-important">

這個專案還包含一些動畫。
在這個版本的指南中，你不會升級它們。
請參閱 [Angular 動畫][AioGuideAnimations]指南來了解相關內容。

</div>

把 Angular 安裝到專案中，連同 SystemJS 模組載入器一起安裝。查看[升級設定說明][AioGuideUpgradeSetup]的結果，並從中取得下列設定：

*   把 Angular 和其他新的相依性加入 `package.json`
*   把 SystemJS 設定檔 `systemjs.config.js` 放到專案根目錄。

完成這些之後，執行：

<code-example format="shell" language="shell">

npm install

</code-example>

很快地，你就能在 `index.html` 中把 Angular 相依性載入應用程式，但首先你需要做一些目錄路徑的調整。你需要從 `node_modules` 和專案根目錄載入檔案，而不是像到目前為止那樣從 `/app` 目錄載入。

把 `app/index.html` 檔案移到專案根目錄。然後把 `package.json` 中開發伺服器的根路徑改成同樣指向專案根目錄，而不是 `app`:

<code-example language="json">

"start": "http-server ./ -a localhost -p 8000 -c-1",

</code-example>

現在你可以從專案根目錄把所有東西提供給網頁瀏覽器。但你並*不想*為了配合開發設定，而去更改應用程式程式碼中使用的所有圖片和資料路徑。為此，你要在 `<base>` 中加入 `index.html` 標籤，這會讓相對 URL 解析回 `/app` 目錄：

<code-example header="index.html" path="upgrade-phonecat-2-hybrid/index.html" region="base"></code-example>

現在你可以用 SystemJS 載入 Angular。你要把 Angular 的 polyfill 和 SystemJS 設定加到 `<head>` 區段的結尾，然後用 `System.import` 載入實際的應用程式：

<code-example header="index.html" path="upgrade-phonecat-2-hybrid/index.html" region="angular"></code-example>

你還需要對在[升級設定][AioGuideUpgradeSetup]期間安裝的 `systemjs.config.js` 檔案做幾處調整。

透過 SystemJS 載入東西時，把瀏覽器指向專案根目錄，而不是使用 `<base>` URL。

用 `upgrade` 安裝 `npm install @angular/upgrade --save` 套件，並為 `@angular/upgrade/static` 套件加入對映。

<code-example header="systemjs.config.js" path="upgrade-phonecat-2-hybrid/systemjs.config.1.js" region="paths"></code-example>

### 建立 `AppModule`

現在建立名為 `NgModule` 的根 `AppModule` 類別。已經有一個名為 `app.module.ts` 的檔案，裡面放著 AngularJS 模組。把它重新命名為 `app.module.ajs.ts`，並同時更新 `index.html` 中對應的指令碼名稱。檔案內容維持不變：

<code-example header="app.module.ajs.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ajs.ts"></code-example>

現在建立一個新的 `app.module.ts`，包含最精簡的 `NgModule` 類別：

<code-example header="app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="bare"></code-example>

### 啟動混合式 PhoneCat

接著，你要把應用程式啟動為同時支援 AngularJS 和 Angular 元件的*混合式應用程式*。之後，你就可以開始把個別的部分逐一轉換成 Angular。

目前應用程式是使用附加在宿主頁面 `ng-app` 元素上的 AngularJS `<html>` 指令來啟動的。這在混合式應用程式中將不再可行。改用 [ngUpgrade 啟動][AioGuideUpgradeBootstrappingHybridApplications]方法。

首先，從 `ng-app` 移除 `index.html` 屬性。然後在 `UpgradeModule` 中匯入 `AppModule`，並覆寫它的 `ngDoBootstrap` 方法：

<code-example header="app/app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="upgrademodule"></code-example>

你是在 `ngDoBootstrap` 內部啟動 AngularJS 模組。這些引數和你手動啟動 AngularJS 時傳給 `angular.bootstrap` 的引數相同：應用程式的根元素，以及一個你要載入的 AngularJS 1.x 模組陣列。

最後，在 `AppModule` 中啟動 `app/main.ts`。這個檔案已在 `systemjs.config.js` 中設定為應用程式進入點，所以瀏覽器已經在載入它了。

<code-example header="app/main.ts" path="upgrade-phonecat-2-hybrid/app/main.ts" region="bootstrap"></code-example>

現在你同時執行 AngularJS 和 Angular 了。這相當令人興奮！你還沒有執行任何真正的 Angular 元件。接下來就是了。

<div class="callout is-helpful">

<header>為什麼要把 *angular* 宣告為 *angular.IAngularStatic*？</header>

`@types/angular` 被宣告為 UMD 模組，而且由於 [UMD 型別定義][GithubMicrosoftTypescriptWikiWhatsNewInTypescriptSupportForUmdModuleDefinitions]的運作方式，一旦檔案中有 ES6 `import` 陳述式，所有 UMD 型別模組也必須改用 `import` 陳述式匯入，而不是全域可用。

AngularJS 目前是透過 `index.html` 中的 script 標籤載入的，這表示整個應用程式都能以全域變數的方式存取它，並使用同一個 `angular` 變數實例。
如果你改用 `import * as angular from 'angular'`，你還必須把 AngularJS 應用程式中的每個檔案都改成使用 ES2015 模組，才能確保 AngularJS 被正確載入。

這是相當大的工作量，而且往往不值得，特別是因為你正在把程式碼移往 Angular。
相反地，把 `angular` 宣告為 `angular.IAngularStatic`，表示它是一個全域變數，同時仍保有完整的型別支援。

<div class="callout is-important">

<header>手動為你的 Angular 應用程式建立 UMD 套件</header>

從 Angular 第 13 版開始，[發佈格式][GithubAngularAngularIssues38366]不再包含 UMD 套件組合。

如果你的使用情境需要 UMD 格式，請使用 [`rollup`][RollupjsMain] 從扁平的 ES 模組檔案手動產生套件組合。

1.  用 `npm` 全域安裝 `rollup`

    <code-example format="shell" language="shell">

    npm i -g rollup

    </code-example>

1.  輸出 `rollup` 的版本，並確認安裝成功

    <code-example format="shell" language="shell">

    rollup -v

    </code-example>

1.  建立 `rollup.config.js` 設定檔，讓 `rollup` 使用全域的 `ng` 命令來參照所有 Angular 框架的匯出。

1.  建立一個名為 `rollup.config.js` 的檔案
    1.  把下列內容複製到 `rollup.config.js` 中

        <code-example language="javascript">

        export default {
          input: 'node_modules/&commat;angular/core/fesm2015/core.js',
          output: {
            file: 'bundle.js',
            format: 'umd',
            name: 'ng'
          }
        }

        </code-example>

1.  使用 `rollup`，依據 `rollup.config.js` 中的設定來建立 `bundle.js` UMD 套件組合

    <code-example format="shell" language="shell">

    rollup -c rollup.config.js

    </code-example>

`bundle.js` 檔案包含你的 UMD 套件組合。
GitHub 上的範例，請參閱 [UMD Angular 套件組合][GithubMgechevAngularUmdBundle]。

</div>

</div>

### 升級 Phone 服務

你要移植到 Angular 的第一個部分是 `Phone` 服務，它位於 `app/core/phone/phone.service.ts`，讓元件可以從伺服器載入電話資訊。目前它是用 ngResource 實作的，你用它來做兩件事：

*   把所有電話的清單載入電話清單元件
*   把單一電話的詳細資料載入電話詳細資料元件

你可以把這個實作替換成 Angular 服務類別，同時讓控制器留在 AngularJS 那邊。

在新版本中，你匯入 Angular 的 HTTP 模組，並呼叫它的 `HttpClient` 服務，而不是 `ngResource`。

重新開啟 `app.module.ts` 檔案，匯入 `HttpClientModule` 並把它加入 `imports` 的 `AppModule` 陣列中：

<code-example header="app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="httpclientmodule"></code-example>

現在你已準備好升級 Phone 服務本身。把 `phone.service.ts` 中以 ngResource 為基礎的服務，替換成裝飾為 `@Injectable` 的 TypeScript 類別：

<code-example header="app/core/phone/phone.service.ts (skeleton)" path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="classdef"></code-example>

`@Injectable` 裝飾器會把一些相依性注入中繼資料附加到類別上，讓 Angular 知道它的相依性。如[相依性注入指南][AioGuideDependencyInjection]所述，這是一個標記裝飾器，適用於沒有其他 Angular 裝飾器、但仍需要注入相依性的類別。

在建構函式中，這個類別預期取得 `HttpClient` 服務。它會被注入進來，並儲存為私人欄位。這個服務接著用在兩個實例方法中，其中一個載入所有電話的清單，另一個載入指定電話的詳細資料：

<code-example header="app/core/phone/phone.service.ts" path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="fullclass"></code-example>

這些方法現在會回傳型別為 `PhoneData` 和 `PhoneData[]` 的可觀察物件。這是你還沒有的型別。為它加入一個簡單的介面：

<code-example header="app/core/phone/phone.service.ts (interface)" path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="phonedata-interface"></code-example>

`@angular/upgrade/static` 有一個 `downgradeInjectable` 方法，目的是讓 Angular 服務能提供給 AngularJS 程式碼使用。用它來接入 `Phone` 服務：

<code-example header="app/core/phone/phone.service.ts (downgrade)" path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts" region="downgrade-injectable"></code-example>

以下是這個服務完整、最終的程式碼：

<code-example header="app/core/phone/phone.service.ts" path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.ts"></code-example>

請注意，你是分別匯入 RxJS `map` 的 `Observable` 運算子。對每個 RxJS 運算子都要這樣做。

新的 `Phone` 服務和原本以 `ngResource` 為基礎的服務有相同的功能。因為它是一個 Angular 服務，你要把它註冊到 `NgModule` 的 providers 中：

<code-example header="app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="phone"></code-example>

現在你透過由 SystemJS 解析的匯入來載入 `phone.service.ts`，你應該從 `index.html` 中**移除這個服務的 &lt;script&gt; 標籤**。在你升級元件時，你會對所有元件都這樣做。與 AngularJS 到 Angular 的升級同時，你也在把程式碼從指令碼遷移到模組。

此時，你可以把兩個元件改成使用新的服務，而不是舊的服務。當你以已降級的 `$inject` 工廠 `phone` 它時，它實際上是 `Phone` 類別的一個實例，你要對應地註解它的型別：

<code-example header="app/phone-list/phone-list.component.ts" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ajs.ts"></code-example>

<code-example header="app/phone-detail/phone-detail.component.ts" path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.component.ajs.ts"></code-example>

現在有兩個 AngularJS 元件在使用 Angular 服務了！不過元件不需要知道這一點，雖然服務回傳的是可觀察物件而不是 promise，這多少透露了一點端倪。無論如何，你所達成的，是把一個服務遷移到 Angular，而不必先遷移使用它的元件。

<div class="alert is-helpful">

你可以在服務中使用 `Observable` 的 `toPromise` 方法，把那些可觀察物件轉換成 promise。
在許多情況下，這能減少對元件控制器所做的變更。

</div>

### 升級元件

接著把 AngularJS 元件升級成 Angular 元件。一次做一個元件，同時讓應用程式維持在混合模式。在進行這些轉換時，你也會定義你的第一個 Angular *管道*。

先看電話清單元件。目前它包含一個 TypeScript 控制器類別和一個元件定義物件。你只要把控制器類別重新命名，並把 AngularJS 元件定義物件轉換成 Angular `@Component` 裝飾器，就能把它變成 Angular 元件。然後你還可以從類別中移除靜態 `$inject` 屬性：

<code-example header="app/phone-list/phone-list.component.ts" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ts" region="initialclass"></code-example>

`selector` 屬性是一個 CSS 選取器，定義這個元件應該出現在頁面的哪個位置。在 AngularJS 中，你是根據元件名稱來做比對的，但在 Angular 中，你有這些明確的選取器。這個選取器會比對名稱為 `phone-list` 的元素，就像 AngularJS 版本一樣。

現在把這個元件的範本轉換成 Angular 語法。搜尋控制項把 AngularJS 的 `$ctrl` 運算式替換成 Angular 的雙向 `[(ngModel)]` 繫結語法：

<code-example header="app/phone-list/phone-list.template.html (search controls)" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.template.html" region="controls"></code-example>

把清單中的 `ng-repeat` 替換成 `*ngFor`，如[範本語法頁面][AioGuideBuiltInDirectives]所述。把圖片標籤的 `ng-src` 替換成繫結到原生 `src` 屬性。

<code-example header="app/phone-list/phone-list.template.html (phones)" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.template.html" region="list"></code-example>

#### 沒有 Angular `filter` 或 `orderBy` 過濾器

AngularJS 內建的 `filter` 和 `orderBy` 過濾器在 Angular 中並不存在，所以你需要自己做過濾和排序。

你把 `filter` 和 `orderBy` 過濾器替換成繫結到 `getPhones()` 控制器方法，該方法在元件內部實作過濾和排序邏輯。

<code-example header="app/phone-list/phone-list.component.ts" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ts" region="getphones"></code-example>

現在你需要把 Angular 元件降級，這樣你才能在 AngularJS 中使用它。你不再註冊元件，而是註冊一個 `phoneList` *指令*，也就是這個 Angular 元件的降級版本。

`as angular.IDirectiveFactory` 轉型會告訴 TypeScript 編譯器，`downgradeComponent` 方法的回傳值是一個指令工廠。

<code-example header="app/phone-list/phone-list.component.ts" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.ts" region="downgrade-component"></code-example>

新的 `PhoneListComponent` 使用位於 `ngModel` 中的 Angular `FormsModule` 指令。把 `FormsModule` 加入 `NgModule` 的 imports，並宣告新的 `PhoneListComponent`，因為你已經把它降級了：

<code-example header="app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="phonelist"></code-example>

從 `index.html` 移除電話清單元件的 &lt;script&gt; 標籤。

現在把其餘的 `phone-detail.component.ts` 設定如下：

<code-example header="app/phone-detail/phone-detail.component.ts" path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.component.ts"></code-example>

這和電話清單元件類似。新的變化是 `RouteParams` 型別註解，它標示出 `routeParams` 相依性。

AngularJS 注入器有一個名為 `$routeParams` 的 AngularJS 路由器相依性，當 `PhoneDetails` 還是 AngularJS 控制器時，它被注入到 `PhoneDetails` 中。你打算把它注入到新的 `PhoneDetailsComponent` 中。

可惜的是，AngularJS 的相依性不會自動提供給 Angular 元件使用。你必須使用[工廠提供者][AioGuideUpgradeMakingAngularjsDependenciesInjectableToAngular]來升級這個服務，讓 `$routeParams` 成為 Angular 可注入的物件。在名為 `ajs-upgraded-providers.ts` 的新檔案中執行這個動作，並在 `app.module.ts` 中匯入它：

<code-example header="app/ajs-upgraded-providers.ts" path="upgrade-phonecat-2-hybrid/app/ajs-upgraded-providers.ts"></code-example>

<code-example header="app/app.module.ts ($routeParams)" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="routeparams"></code-example>

把電話詳細資料元件範本轉換成 Angular 語法，如下所示：

<code-example header="app/phone-detail/phone-detail.template.html" path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.template.html"></code-example>

這裡有幾個值得注意的變更：

*   你已經從所有運算式中移除了 `$ctrl.` 前置詞
*   你已經把 `ng-src` 替換成標準 `src` 屬性的屬性繫結
*   你在 `ng-class` 周圍使用了屬性繫結語法。雖然 Angular 確實有一個和 AngularJS [非常相似的 `ngClass`][AioGuideBuiltInDirectives]，但它的值並不會像運算式一樣被神奇地求值。在 Angular 中，你總是要在範本中指明某個屬性的值是屬性運算式，而不是字面字串。

*   你已經把 `ng-repeat` 替換成 `*ngFor`
*   你已經把 `ng-click` 替換成標準 `click` 的事件繫結
*   你已經把整個範本包在 `ngIf` 中，讓它只有在有電話存在時才會被渲染。你需要這樣做，因為當元件首次載入時，你還沒有 `phone`，而運算式會參照到不存在的值。與 AngularJS 不同的是，當你試圖參照未定義物件上的屬性時，Angular 的運算式不會靜默地失敗。在預期會發生這種情況時，你需要明確地處理。

把 `PhoneDetailComponent` 元件加入 `NgModule` 的 *declarations* 中：

<code-example header="app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="phonedetail"></code-example>

你現在也應該從 `index.html` 移除電話詳細資料元件的 &lt;script&gt; 標籤。

#### 加入 *CheckmarkPipe*

AngularJS 指令有一個 `checkmark` *過濾器*。把它轉換成 Angular **管道**。

沒有升級方法可以把過濾器轉換成管道。你不會想念它的。把過濾器函式轉換成對等的 Pipe 類別很容易。實作和以前相同，只是重新包裝在 `transform` 方法中。把檔案重新命名為 `checkmark.pipe.ts`，以符合 Angular 慣例：

<code-example header="app/core/checkmark/checkmark.pipe.ts" path="upgrade-phonecat-2-hybrid/app/core/checkmark/checkmark.pipe.ts"></code-example>

現在匯入並宣告新建立的管道，並從 `index.html` 移除過濾器的 &lt;script&gt; 標籤：

<code-example header="app.module.ts" path="upgrade-phonecat-2-hybrid/app/app.module.ts" region="checkmarkpipe"></code-example>

### 對混合式應用程式做 AOT 編譯

要在混合式應用程式中使用 AOT，你必須先像其他 Angular 應用程式一樣設定它，如 [Ahead-of-time 編譯章節][AioGuideAotCompiler]所示。

然後更改 `main-aot.ts`，讓它啟動由 AOT 編譯器產生的 `AppComponentFactory`:

<code-example header="app/main-aot.ts" path="upgrade-phonecat-2-hybrid/app/main-aot.ts"></code-example>

你需要在 `index.html` 中載入你在 `aot/index.html` 中已經使用的所有 AngularJS 檔案：

<code-example header="aot/index.html" path="upgrade-phonecat-2-hybrid/aot/index.html"></code-example>

這些檔案需要和 polyfill 一起複製。應用程式在執行時期需要的檔案，像是 `.json` 電話清單和圖片，也需要複製。

用 `fs-extra` 安裝 `npm install fs-extra --save-dev`，以便更好地複製檔案，並把 `copy-dist-files.js` 改成以下內容：

<code-example header="copy-dist-files.js" path="upgrade-phonecat-2-hybrid/copy-dist-files.js"></code-example>

這樣就完成在升級應用程式時使用 AOT 所需的全部工作了！

### 加入 Angular 路由器與啟動

此時，你已經把所有 AngularJS 應用程式元件替換成對應的 Angular 元件，即使你仍然是透過 AngularJS 路由器來提供它們。

#### 加入 Angular 路由器

Angular 有一個[全新的路由器][AioGuideRouter]。

和所有路由器一樣，它需要在 UI 中有一個地方來顯示已路由的檢視。對 Angular 來說，那就是 `<router-outlet>`，它屬於應用程式元件樹頂端的*根元件*。

你還沒有這樣的根元件，因為應用程式仍然是作為 AngularJS 應用程式來管理的。建立一個新的 `app.component.ts` 檔案，包含下列 `AppComponent` 類別：

<code-example header="app/app.component.ts" path="upgrade-phonecat-3-final/app/app.component.ts"></code-example>

它的範本只包含 `<router-outlet>`。這個元件只會渲染作用中路由的內容，別無其他。

選取器會告訴 Angular，在應用程式啟動時，把這個根元件插入宿主網頁上的 `<phonecat-app>` 元素中。

把這個 `<phonecat-app>` 元素加入 `index.html`。它取代了舊的 AngularJS `ng-view` 指令：

<code-example header="index.html (body)" path="upgrade-phonecat-3-final/index.html" region="appcomponent"></code-example>

#### 建立*路由模組*

路由器需要設定，無論是 AngularJS 路由器、Angular 路由器，還是任何其他路由器都一樣。

Angular 路由器設定的細節最好留給[路由文件][AioGuideRouter]，該文件建議你建立一個專門用於路由器設定的 `NgModule` \(稱為*路由模組*\)。

<code-example header="app/app-routing.module.ts" path="upgrade-phonecat-3-final/app/app-routing.module.ts"></code-example>

這個模組定義了一個 `routes` 物件，包含通往兩個電話元件的兩條路由，以及一條空路徑的預設路由。它把 `routes` 傳給 `RouterModule.forRoot` 方法，由該方法完成其餘工作。

另外幾個提供者會啟用以「雜湊」URL 路由，例如 `#!/phones`，而不是預設的「push state」策略。

現在更新 `AppModule`，讓它匯入這個 `AppRoutingModule`，並同時把根 `AppComponent` 宣告為啟動元件。這會告訴 Angular，它應該以*根* `AppComponent` 啟動應用程式，並把它的檢視插入宿主網頁中。

你還必須從 `ngDoBootstrap()` 的 `app.module.ts` 中移除 AngularJS 模組的啟動，以及 `UpgradeModule` 的匯入。

<code-example header="app/app.module.ts" path="upgrade-phonecat-3-final/app/app.module.ts"></code-example>

而且，由於你是直接路由到 `PhoneListComponent` 和 `PhoneDetailComponent`，而不是使用帶有 `<phone-list>` 或 `<phone-detail>` 標籤的路由範本，你也可以省去它們的 Angular 選取器。

#### 為每支電話產生連結

你不再需要把連到電話詳細資料的連結寫死在電話清單中。你可以為每支電話的 `id` 產生資料繫結到 `routerLink` 指令，讓該指令建構通往 `PhoneDetailComponent` 的適當 URL：

<code-example header="app/phone-list/phone-list.template.html (list with links)" path="upgrade-phonecat-3-final/app/phone-list/phone-list.template.html" region="list"></code-example>

<div class="alert is-helpful">

詳細資訊請參閱[路由][AioGuideRouter]頁面。

</div>

#### 使用路由參數

Angular 路由器傳遞路由參數的方式不同。修正 `PhoneDetail` 元件建構函式，讓它預期接收一個注入的 `ActivatedRoute` 物件。從 `phoneId` 提取 `ActivatedRoute.snapshot.params`，並像以前一樣擷取電話資料：

<code-example header="app/phone-detail/phone-detail.component.ts" path="upgrade-phonecat-3-final/app/phone-detail/phone-detail.component.ts"></code-example>

你現在執行的是純 Angular 應用程式了！

### 向 AngularJS 說再見

是時候拿掉輔助輪，讓應用程式以純粹、閃亮的 Angular 應用程式展開新生活了。剩下的工作都和移除程式碼有關——這當然是每個程式設計師最喜歡的工作！

應用程式仍然是作為混合式應用程式啟動的。已經不需要這樣做了。

把應用程式的啟動方法從 `UpgradeModule` 切換成 Angular 的方式。

<code-example header="main.ts" path="upgrade-phonecat-3-final/app/main.ts"></code-example>

如果你還沒這麼做，請從 `UpgradeModule` 移除所有對 `app.module.ts` 的參照，以及任何 AngularJS 服務的[工廠提供者][AioGuideUpgradeMakingAngularjsDependenciesInjectableToAngular]和 `app/ajs-upgraded-providers.ts` 檔案。

同時移除你找到的任何 `downgradeInjectable()` 或 `downgradeComponent()`，以及相關的 AngularJS 工廠或指令宣告。

<code-example header="app.module.ts" path="upgrade-phonecat-3-final/app/app.module.ts"></code-example>

你也可以完整移除下列檔案。它們是 AngularJS 模組設定檔，在 Angular 中不需要：

*   `app/app.module.ajs.ts`
*   `app/app.config.ts`
*   `app/core/core.module.ts`
*   `app/core/phone/phone.module.ts`
*   `app/phone-detail/phone-detail.module.ts`
*   `app/phone-list/phone-list.module.ts`

AngularJS 的外部型別定義也可以解除安裝。你仍然需要的只有 Jasmine 的型別定義和 Angular 的 polyfill。`@angular/upgrade` 套件及其在 `systemjs.config.js` 中的對映也可以移除。

<code-example format="shell" language="shell">

npm uninstall &commat;angular/upgrade --save
npm uninstall &commat;types/angular &commat;types/angular-animate &commat;types/angular-cookies &commat;types/angular-mocks &commat;types/angular-resource &commat;types/angular-route &commat;types/angular-sanitize --save-dev

</code-example>

最後，從 `index.html` 移除所有對 AngularJS 指令碼和 jQuery 的參照。完成後，它應該看起來像這樣：

<code-example header="index.html" path="upgrade-phonecat-3-final/index.html" region="full"></code-example>

這是最後一次看到 AngularJS 了！它一直以來都表現得很好，但現在是時候說再見了。

## 附錄：升級 PhoneCat 測試

測試不僅可以在升級過程中保留下來，在確保應用程式於升級期間不會損壞時，它們也可以作為寶貴的安全措施。E2E 測試對這個目的特別有用。

### E2E 測試

PhoneCat 專案中同時有 E2E Protractor 測試和一些 Karma 單元測試。在這兩者之中，E2E 測試要容易處理得多：顧名思義，E2E 測試是從*外部*存取應用程式，透過與應用程式呈現在螢幕上的各種 UI 元素互動來進行。E2E 測試其實不太關心應用程式元件的內部結構。這也表示，雖然你在升級過程中大幅修改了專案，但 E2E 測試套組只需做些微修改就能繼續通過。你並沒有改變應用程式從使用者角度看起來的行為。

在 TypeScript 轉換期間，要讓 E2E 測試繼續運作沒有什麼事要做。但當你把啟動方式改成混合式應用程式的啟動方式時，你必須做一些變更。

更新 `protractor-conf.js`，讓它與混合式應用程式同步：

<code-example language="javascript">

ng12Hybrid: true

</code-example>

當你開始把元件及其範本升級到 Angular 時，你會再做更多變更，因為 E2E 測試中有專屬於 AngularJS 的比對器。對 PhoneCat 來說，你需要做下列變更，才能讓一切與 Angular 搭配運作：

| 舊程式碼 | 新程式碼 | 詳細說明 |
|:---                                                         |:---                       |:---     |
| `by.repeater('phone in $ctrl.phones').column('phone.name')` | `by.css('.phones .name')` | repeater 比對器依賴 AngularJS 的 `ng-repeat` |
| `by.repeater('phone in $ctrl.phones')` | `by.css('.phones li')` | repeater 比對器依賴 AngularJS 的 `ng-repeat` |
| `by.model('$ctrl.query')` | `by.css('input')` | model 比對器依賴 AngularJS 的 `ng-model` |
| `by.model('$ctrl.orderProp')` | `by.css('select')` | model 比對器依賴 AngularJS 的 `ng-model` |
| `by.binding('$ctrl.phone.name')` | `by.css('h1')` | binding 比對器依賴 AngularJS 的資料繫結 |

當啟動方法從 `UpgradeModule` 的啟動方式切換成純 Angular 時，AngularJS 就會從頁面上完全消失。此時，你需要告訴 Protractor，它不應該再尋找 AngularJS 應用程式，而是應該從頁面中找出 *Angular 應用程式*。

把先前加入的 `ng12Hybrid` 替換成下列內容，放在 `protractor-conf.js` 中：

<code-example language="javascript">

useAllAngular2AppRoots: true,

</code-example>

另外，PhoneCat 測試程式碼中有幾個 Protractor API 呼叫，在底層使用的是 AngularJS 的 `$location` 服務。由於該服務在升級後已不存在，請把那些呼叫替換成使用 WebDriver 通用 URL API 的呼叫。其中第一個是重新導向規格：

<code-example header="e2e-tests/scenarios.ts" path="upgrade-phonecat-3-final/e2e-spec.ts" region="redirect"></code-example>

第二個是電話連結規格：

<code-example header="e2e-tests/scenarios.ts" path="upgrade-phonecat-3-final/e2e-spec.ts" region="links"></code-example>

### 單元測試

另一方面，單元測試則需要更多轉換工作。實際上，它們需要隨著正式程式碼一起*升級*。

在 TypeScript 轉換期間，嚴格來說不需要做任何變更。但把單元測試程式碼也轉換成 TypeScript 可能是個好主意。

例如，在電話詳細資料元件規格中，你可以使用箭頭函式和區塊作用域變數等 ES2015 功能，並受益於你正在使用的 AngularJS 服務的型別定義：

<code-example header="app/phone-detail/phone-detail.component.spec.ts" path="upgrade-phonecat-1-typescript/app/phone-detail/phone-detail.component.spec.ts"></code-example>

一旦你開始升級程序並引進 SystemJS，Karma 就需要做設定上的變更。你需要讓 SystemJS 載入所有新的 Angular 程式碼，這可以用下列這種 shim 檔案來完成：

<code-example header="karma-test-shim.js" path="upgrade-phonecat-2-hybrid/karma-test-shim.1.js"></code-example>

這個 shim 會先載入 SystemJS 設定，接著載入 Angular 的測試支援程式庫，然後載入應用程式本身的規格檔案。

Karma 設定接著應該改成使用應用程式根目錄作為基礎目錄，而不是 `app`。

<code-example header="karma.conf.js" path="upgrade-phonecat-2-hybrid/karma.conf.ajs.js" region="basepath"></code-example>

完成後，你可以載入 SystemJS 和其他相依性，同時把載入應用程式檔案的設定切換成*不*由 Karma 包含到頁面中。你要讓 shim 和 SystemJS 來載入它們。

<code-example header="karma.conf.js" path="upgrade-phonecat-2-hybrid/karma.conf.ajs.js" region="files"></code-example>

由於 Angular 元件的 HTML 範本也會被載入，你必須稍微幫 Karma 一把，讓它能把這些範本導向正確的路徑：

<code-example header="karma.conf.js" path="upgrade-phonecat-2-hybrid/karma.conf.ajs.js" region="html"></code-example>

單元測試檔案本身也需要在其正式對應檔案切換時切換到 Angular。checkmark 管道的規格可能是最直接的，因為這個管道沒有任何相依性：

<code-example header="app/core/checkmark/checkmark.pipe.spec.ts" path="upgrade-phonecat-2-hybrid/app/core/checkmark/checkmark.pipe.spec.ts"></code-example>

電話服務的單元測試則稍微複雜一些。你需要從模擬的 AngularJS `$httpBackend` 切換成模擬的 Angular Http 後端。

<code-example header="app/core/phone/phone.service.spec.ts" path="upgrade-phonecat-2-hybrid/app/core/phone/phone.service.spec.ts"></code-example>

對於元件規格，你可以模擬 `Phone` 服務本身，讓它提供預先準備好的電話資料。你會對兩個元件都使用 Angular 的元件單元測試 API。

<code-example header="app/phone-detail/phone-detail.component.spec.ts" path="upgrade-phonecat-2-hybrid/app/phone-detail/phone-detail.component.spec.ts"></code-example>

<code-example header="app/phone-list/phone-list.component.spec.ts" path="upgrade-phonecat-2-hybrid/app/phone-list/phone-list.component.spec.ts"></code-example>

最後，當你切換到 Angular 路由器時，重新檢視兩個元件測試。對於詳細資料元件，提供 Angular `ActivatedRoute` 物件的模擬，而不是使用 AngularJS 的 `$routeParams`。

<code-example header="app/phone-detail/phone-detail.component.spec.ts" path="upgrade-phonecat-3-final/app/phone-detail/phone-detail.component.spec.ts" region="activatedroute"></code-example>

而對於電話清單元件，對路由器做一些調整，就能讓 `RouteLink` 指令運作。

<code-example header="app/phone-list/phone-list.component.spec.ts" path="upgrade-phonecat-3-final/app/phone-list/phone-list.component.spec.ts" region="routestuff"></code-example>

<!-- links -->

[AioApiCoreNgzone]: api/core/NgZone "NgZone | 核心 - API | Angular"
[AioApiCoreOnchanges]: api/core/OnChanges "OnChanges | 核心 - API | Angular"

[AioGuideAnimations]: guide/animations "Angular 動畫入門 | Angular"
[AioGuideAotCompiler]: guide/aot-compiler "預先編譯（AOT） | Angular"
[AioGuideBuiltInDirectives]: guide/built-in-directives "內建指令 | Angular"
[AioGuideDependencyInjection]: guide/dependency-injection "Angular 中的相依性注入 | Angular"
[AioGuideDependencyInjectionProvidersFactoryProviders]: guide/dependency-injection-providers#工廠提供者usefactory "工廠提供者：useFactory | Angular"
[AioGuideGlossaryLazyLoading]: guide/glossary#延遲載入lazy-loading "延遲載入 - 術語表 | Angular"
[AioGuideHierarchicalDependencyInjection]: guide/hierarchical-dependency-injection "階層式注入器 | Angular"
[AioGuideLifecycleHooks]: guide/lifecycle-hooks "生命週期掛鉤 | Angular"
[AioGuideNgmodules]: guide/ngmodules "NgModules | Angular"
[AioGuideRouter]: guide/router "常見路由任務 | Angular"
[AioGuideTypescriptConfiguration]: guide/typescript-configuration "TypeScript 設定 | Angular"
[AioGuideUpgradeBootstrappingHybridApplications]: guide/upgrade#啟動混合應用程式 "啟動混合式應用程式 - 從 AngularJS 升級到 Angular | Angular"
[AioGuideUpgradeFollowTheAngularjsStyleGuide]: guide/upgrade#遵循-angularjs-風格指南 "遵循 AngularJS 風格指南 - 從 AngularJS 升級到 Angular | Angular"
[AioGuideUpgradeMakingAngularjsDependenciesInjectableToAngular]: guide/upgrade#讓-angularjs-依賴可注入至-angular "讓 AngularJS 相依性可注入 Angular - 從 AngularJS 升級到 Angular | Angular"
[AioGuideUpgradePreparation]: guide/upgrade#準備工作 "準備工作 - 從 AngularJS 升級到 Angular | Angular"
[AioGuideUpgradeUpgradingWithNgupgrade]: guide/upgrade#使用-ngupgrade-進行升級 "使用 ngUpgrade 升級 - 從 AngularJS 升級到 Angular | Angular"
[AioGuideUpgradeUsingComponentDirectives]: guide/upgrade#使用元件指令 "使用元件指令 - 從 AngularJS 升級到 Angular | Angular"
[AioGuideUpgradeSetup]: guide/upgrade-setup "從 AngularJS 升級的設定 | Angular"

<!-- external links -->

[AngularBlogFindingAPathForwardWithAngularjs7e186fdd4429]: https://blog.angular.io/finding-a-path-forward-with-angularjs-7e186fdd4429 "為 AngularJS 找到前進之路 | Angular 部落格"

[AngularjsDocsApiNgFunctionAngularBootstrap]: https://docs.angularjs.org/api/ng/function/angular.bootstrap "angular.bootstrap | API | AngularJS"
[AngularjsDocsApiNgTypeAngularModule]: https://docs.angularjs.org/api/ng/type/angular.Module "angular.Module | API | AngularJS"
[AngularjsDocsApiNgTypeAngularModuleComponent]: https://docs.angularjs.org/api/ng/type/angular.Module#component "component(name, options); - angular.Module | API | AngularJS"
[AngularjsDocsApiNgrouteDirectiveNgview]: https://docs.angularjs.org/api/ngRoute/directive/ngView "ngView | API | AngularJS"
[AngularjsDocsApiNgrouteProviderRouteprovider]: https://docs.angularjs.org/api/ngRoute/provider/$routeProvider "$routeProvider | API | AngularJS"
[AngularjsDocsApiNgServiceLocation]: https://docs.angularjs.org/api/ng/service/$location "$location | API | AngularJS"
[AngularjsDocsTutorial]: https://docs.angularjs.org/tutorial "PhoneCat 教學應用程式 | 教學 | AngularJS"

[BrowserifyMain]: http://browserify.org "Browserify"

[GithubAngularAngularIssues35989]: https://github.com/angular/angular/issues/35989 "議題 35989：docs(upgrade)：正確說明如何對混合式應用程式使用 AOT 編譯 | angular/angular | GitHub"
[GithubAngularAngularIssues38366]: https://github.com/angular/angular/issues/38366 " 議題 38366：RFC：Ivy 程式庫發佈格式 | angular/angular | GitHub"

[GithubAngularAngularPhonecat]: https://github.com/angular/angular-phonecat "angular/angular-phonecat | GitHub"
[GithubAngularAngularPhonecatCommits15Snapshot]: https://github.com/angular/angular-phonecat/commits/1.5-snapshot "angular/angular-phonecat v1.5 | GitHub"

[GithubAngularQuickstart]: https://github.com/angular/quickstart "angular/quickstart | GitHub"

[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMd]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md "Angular 1 風格指南 | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdFoldersByFeatureStructure]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#folders-by-feature-structure "按功能分資料夾的結構 - Angular 1 風格指南 | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdModularity]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#modularity "模組化 - Angular 1 風格指南 | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdOrganizingTests]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#organizing-tests "組織測試 - Angular 1 風格指南 | johnpapa/angular-styleguide | GitHub"
[GithubJohnpapaAngularStyleguideBlobPrimaryA1ReadmeMdSingleResponsibility]: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#single-responsibility "單一職責 - Angular 1 風格指南 | johnpapa/angular-styleguide | GitHub"

[GithubMgechevAngularUmdBundle]: https://github.com/mgechev/angular-umd-bundle "UMD Angular 套件組合 | mgechev/angular-umd-bundle | GitHub"

[GithubMicrosoftTypescriptWikiWhatsNewInTypescriptSupportForUmdModuleDefinitions]: https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#support-for-umd-module-definitions "支援 UMD 模組定義 - TypeScript 的新功能 | microsoft/TypeScript | GitHub"

[GithubSystemjsSystemjs]: https://github.com/systemjs/systemjs "systemjs/systemjs | GitHub"

[GithubWebpackMain]: https://webpack.github.io "webpack 模組打包器 | GitHub"

[NpmjsPackageTypesAngular]: https://www.npmjs.com/package/@types/angular "@types/angular | npm"

[RollupjsMain]: https://rollupjs.org "rollup.js"

<!-- end links -->

@reviewed 2022-02-28
