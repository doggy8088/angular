# 為提升效能而升級

<div class="alert is-helpful">

*Angular* 是今日與未來的 Angular 之名。

*AngularJS* 是 Angular 所有 1.x 版本的名稱。

</div>

本指南說明一些內建工具，可用來將 AngularJS 專案逐步遷移到 Angular 平台，一次遷移一部分。本指南與[從 AngularJS 升級](guide/upgrade)非常相似，差別在於本指南使用 [downgradeModule()](api/upgrade/static/downgradeModule) 輔助函式，而非 [UpgradeModule](api/upgrade/static/UpgradeModule) 類別。這會影響應用程式的啟動方式，以及變更偵測在兩個框架之間的傳播方式。它讓你能在升級過程中逐步升級，同時提升混合式應用程式的速度，並在升級初期就於 AngularJS 應用程式中運用最新版 Angular。

## 準備工作

在討論如何使用 `downgradeModule()` 建立混合式應用程式之前，你可以先做一些事情，讓升級過程更順利，即使你尚未開始升級也一樣。由於無論採用哪種升級方式，步驟都相同，請參閱[從 AngularJS 升級](guide/upgrade#準備工作)的[準備工作](guide/upgrade)一節。

## 使用 `ngUpgrade` 升級

有了 Angular 中的 `ngUpgrade` 函式庫，你可以建立混合式應用程式，逐步升級現有的 AngularJS 應用程式，在其中讓兩個框架並排執行。在這些混合式應用程式中，你可以混合搭配 AngularJS 與 Angular 的元件和服務，讓它們無縫互通。也就是說，你不必一次完成所有升級工作，因為在過渡期間，兩個框架之間本來就能自然共存。

### `ngUpgrade` 的運作方式

無論你選擇 `downgradeModule()` 或 `UpgradeModule`，升級的基本原則、混合式應用程式背後的思維模型，以及 [upgrade/static](api/upgrade/static) 公用程式的使用方式都相同。如需更多資訊，請參閱[從 AngularJS 升級](guide/upgrade#ngupgrade-的運作方式)的[`ngUpgrade` 的運作方式](guide/upgrade)一節。

<div class="alert is-helpful">

[從 AngularJS 升級](guide/upgrade)的[變更偵測](guide/upgrade#變更偵測)一節，僅適用於使用 `UpgradeModule` 的應用程式。
雖然你使用 `downgradeModule()` 時處理變更偵測的方式不同——這也是本指南的重點——但閱讀[變更偵測](guide/upgrade#變更偵測)一節，可以為接下來的內容提供有用的背景。

</div>

#### 使用 `downgradeModule()` 進行變更偵測

如前所述，`downgradeModule()` 與 `UpgradeModule` 的主要差異之一，在於變更偵測，以及它如何在兩個框架之間傳播。

使用 `UpgradeModule` 時，兩個變更偵測系統會更緊密地綁在一起。只要 AngularJS 端的應用程式發生任何事，Angular 端就會自動觸發變更偵測，反之亦然。這很方便，因為它能確保任一框架都不會錯過重要的變更。不過，大多數時候，這些額外的變更偵測執行其實並無必要。

`downgradeModule()` 則相反，除非它知道應用程式的另一部分對這些變更感興趣，否則會避免明確觸發變更偵測。舉例來說，如果某個降級元件定義了 `@Input()`，應用程式很可能需要在該值變更時得知。於是，`downgradeComponent()` 會自動對該元件觸發變更偵測。

不過，在大多數情況下，在某個特定元件中本機所做的變更，對應用程式其餘部分並無關聯。舉例來說，如果使用者點選按鈕送出表單，元件通常會自行處理這個動作的結果。話雖如此，*確實*有些情況是你希望把變更傳播到可能由另一個框架控制的應用程式其他部分。在這種情況下，你有責任透過手動觸發變更偵測，通知感興趣的各方。

如果你希望某段特定的程式碼在應用程式的 AngularJS 端觸發變更偵測，你需要把它包在 [scope.$apply()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply) 裡。同樣地，若要在 Angular 中觸發變更偵測，你可以使用 [ngZone.run()](api/core/NgZone#run)。

在許多情況下，多執行幾次變更偵測可能無關緊要。然而，對於較大型或變更偵測負擔較重的應用程式，它們可能會產生明顯的影響。透過讓你更精細地控制變更偵測的傳播，`downgradeModule()` 能讓你的混合式應用程式獲得更好的效能。

## 使用 `downgradeModule()`

AngularJS 與 Angular 都有各自的模組概念，可協助把應用程式組織成內聚的功能區塊。

它們在架構與實作上的細節相當不同。在 AngularJS 中，你可以透過 [angular.module()](https://docs.angularjs.org/api/ng/function/angular.module) 指定模組的名稱與相依性來建立模組。接著你可以使用它的各種方法加入資產。在 Angular 中，你會建立一個帶有 [NgModule](api/core/NgModule) 裝飾器的類別，以中繼資料描述資產。

在混合式應用程式中，你會同時執行兩個框架。這表示你至少需要分別來自 AngularJS 與 Angular 的各一個模組。

在大多數情況下，你指定模組的方式與一般應用程式相同。接著，你使用 `upgrade/static` 輔助函式，讓兩個框架知道它們可以彼此使用哪些資產。這稱為「升級」與「降級」。

<div class="callout is-helpful">

<header>定義：</header>

*   *升級*：
    讓 AngularJS 資產（例如元件或服務）可供應用程式的 Angular 部分使用的行為。

*   *降級*：
    讓 Angular 資產（例如元件或服務）可供應用程式的 AngularJS 部分使用的行為。

</div>

連結相依性的重要一環，是把兩個主要模組連結在一起。這就是 `downgradeModule()` 的用武之地。使用它來建立一個 AngularJS 模組——可作為你主要 AngularJS 模組的相依性——它會啟動你的主要 Angular 模組，並開始執行混合式應用程式的 Angular 部分。從某種意義上說，它是把 Angular 模組「降級」為 AngularJS 模組。

不過，有幾件事要記住：

*   你不會直接把 Angular 模組傳給 `downgradeModule()`。`downgradeModule()` 需要的只是一份「配方」，例如一個工廠函式，來為你的模組建立執行個體。

*   在應用程式真正需要 Angular 模組之前，它不會被具現化。

以下是如何使用 `downgradeModule()` 連結兩個模組的範例。

<code-example format="typescript" language="typescript">

// Import `downgradeModule()`.
import { downgradeModule } from '&commat;angular/upgrade/static';

// Use it to downgrade the Angular module to an AngularJS module.
const downgradedModule = downgradeModule(MainAngularModuleFactory);

// Use the downgraded module as a dependency to the main AngularJS module.
angular.module('mainAngularJsModule', [
  downgradedModule
]);

</code-example>

#### 為 Angular 模組指定工廠

如前所述，`downgradeModule()` 需要知道如何具現化 Angular 模組。它需要一份配方。你可以提供一個能建立 Angular 模組執行個體的工廠函式，藉此定義這份配方。`downgradeModule()` 接受兩種工廠函式：

*   `NgModuleFactory`
*   `(extraProviders: StaticProvider[]) => Promise<NgModuleRef>`

當你傳入 `NgModuleFactory` 時，`downgradeModule()` 會使用它，透過 [platformBrowser](api/platform-browser/platformBrowser) 的 [bootstrapModuleFactory()](api/core/PlatformRef#bootstrapModuleFactory) 來具現化模組，該方法與事前（AOT）編譯相容。AOT 編譯有助於讓你的應用程式載入得更快。如需進一步了解 AOT，以及如何建立 `NgModuleFactory`，請參閱[事前編譯](guide/aot-compiler)指南。

或者，你可以傳入一個普通的函式，它應該會回傳一個解析為 [NgModuleRef](api/core/NgModuleRef)（也就是你的 Angular 模組的執行個體）的 Promise。這個函式會以一個額外的 [Providers](api/core/StaticProvider) 陣列作為引數呼叫，這些 Provider 應該要在回傳的 `NgModuleRef` 的 [Injector](api/core/Injector) 上可用。舉例來說，如果你使用 [platformBrowser](api/platform-browser/platformBrowser) 或 [platformBrowserDynamic](api/platform-browser-dynamic/platformBrowserDynamic)，你可以把 `extraProviders` 陣列傳給它們：

<code-example format="typescript" language="typescript">

const bootstrapFn = (extraProviders: StaticProvider[]) =&gt; {
  const platformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(MainAngularModule);
};
// or
const bootstrapFn = (extraProviders: StaticProvider[]) =&gt; {
  const platformRef = platformBrowser(extraProviders);
  return platformRef.bootstrapModuleFactory(MainAngularModuleFactory);
};

</code-example>

使用 `NgModuleFactory` 需要的樣板程式碼較少，而且是很好的預設選項，因為它開箱即支援 AOT。使用自訂函式需要的程式碼稍多，但能給你更大的彈性。

#### 按需具現化 Angular 模組

`downgradeModule()` 與 `UpgradeModule` 的另一個主要差異是，後者要求你預先具現化 AngularJS 與 Angular 模組。這表示即使你到稍後才使用任何 Angular 資產，也必須付出具現化應用程式 Angular 部分的成本。`downgradeModule()` 則沒那麼積極。只有在第一次需要 Angular 部分時，它才會具現化；也就是說，一旦它需要建立降級元件時。

你可以更進一步，直到真正需要時才把應用程式 Angular 部分的程式碼下載到使用者的瀏覽器。這在你只在混合式應用程式中不需要初始渲染的部分使用 Angular，或使用者不會觸及的部分使用 Angular 時，特別有用。

舉幾個例子：

*   你只在特定的路由上使用 Angular，而且在使用者造訪這類路由之前／除非使用者造訪這類路由，否則不需要它。
*   你只對特定類型的使用者顯示某些 Angular 功能；例如，已登入的使用者、管理員或 VIP 會員。在使用者通過驗證之前，你不需要載入 Angular。

*   你把 Angular 用於某個對應用程式初始渲染並不重要的功能，而且為了更好的初始載入效能，你可以承受一點延遲。

### 使用 `downgradeModule()` 啟動

如你所料，你不需要改變現有 AngularJS 應用程式的啟動方式。與需要一些額外步驟的 `UpgradeModule` 不同——`downgradeModule()` 只要你提供配方，就能負責啟動 Angular 模組。

為了開始使用任何 `upgrade/static` API，你仍需要像一般 Angular 應用程式那樣載入 Angular 框架。你可以依照[升級設定](guide/upgrade-setup "Setup for Upgrading from AngularJS")指南中的指示，使用 SystemJS 來了解如何做到這一點，並從 [QuickStart GitHub 儲存庫](https://github.com/angular/quickstart)選擇性地複製程式碼。

你還需要使用 `@angular/upgrade` 安裝 `npm install @angular/upgrade --save` 套件，並為 `@angular/upgrade/static` 套件加入對映：

<code-example header="systemjs.config.js (map)" path="upgrade-module/src/systemjs.config.1.js" region="upgrade-static-package"></code-example>

接著，建立 `app.module.ts` 檔案，並加入以下的 `NgModule` 類別：

<code-example header="app.module.ts">

import { NgModule } from '&commat;angular/core';
import { BrowserModule } from '&commat;angular/platform-browser';

&commat;NgModule({
  imports: [
    BrowserModule
  ]
})
export class MainAngularModule {
  // Empty placeholder method to satisfy the `Compiler`.
  ngDoBootstrap() {}
}

</code-example>

這個最精簡的 `NgModule` 會匯入 `BrowserModule`，這是每個以瀏覽器為基礎的 Angular 應用程式都必須具備的模組。它還定義了一個空的 `ngDoBootstrap()` 方法，以防止 [Compiler](api/core/Compiler) 回傳錯誤。這是必要的，因為該模組的 `bootstrap` 裝飾器上不會有 `NgModule` 宣告。

<div class="alert is-important">

你不需要在 `NgModule` 裝飾器上加入 `bootstrap` 宣告，因為 AngularJS 擁有應用程式的根範本，而 `ngUpgrade` 會啟動必要的元件。

</div>

你現在可以使用 `downgradeModule()` 把 AngularJS 與 Angular 模組連結在一起。

<code-example header="app.module.ts">

import { platformBrowserDynamic } from '&commat;angular/platform-browser-dynamic';
import { downgradeModule } from '&commat;angular/upgrade/static';

const bootstrapFn = (extraProviders: StaticProvider[]) =&gt; {
  const platformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(MainAngularModule);
};
const downgradedModule = downgradeModule(bootstrapFn);

angular.module('mainAngularJsModule', [
  downgradedModule
]);

</code-example>

現有的 AngularJS 程式碼照常運作，*而且*你已經可以開始加入 Angular 程式碼了。

### 使用元件與可注入物件

`downgradeModule()` 與 `UpgradeModule` 的差異到此為止。其餘的 `upgrade/static` API 與概念，在兩種混合式應用程式中的運作方式完全相同。請參閱[從 AngularJS 升級](guide/upgrade)，了解以下內容：

*   [從 AngularJS 程式碼使用 Angular 元件](guide/upgrade#從-angularjs-程式碼使用-angular-元件)。

    <div class="callout is-important">

    **注意**： <br />
    如果你要降級多個模組，在呼叫 `downgradeComponent()` 時，你需要指定每個元件所屬的已降級模組名稱。

    </div>

*   [從 Angular 程式碼使用 AngularJS 元件指令](guide/upgrade#從-angular-程式碼使用-angularjs-元件指令)。
*   [將 AngularJS 內容投影到 Angular 元件中](guide/upgrade#把-angularjs-內容投影至-angular-元件)。
*   [將 Angular 內容轉含到 AngularJS 元件指令中](guide/upgrade#把-angular-內容轉置至-angularjs-元件指令)。
*   [讓 AngularJS 相依性能夠注入到 Angular 中](guide/upgrade#讓-angularjs-依賴可注入至-angular)。
*   [讓 Angular 相依性能夠注入到 AngularJS 中](guide/upgrade#讓-angular-依賴可注入至-angularjs)。
    
    <div class="callout is-important">

    **注意**： <br />
    如果你要降級多個模組，在呼叫 `downgradeInjectable()` 時，你需要指定每個可注入物件所屬的已降級模組名稱。

    </div>

<div class="alert is-important">

雖然降級可注入物件是可行的，但在提供它們的 Angular 模組被具現化之前，降級後的可注入物件將無法使用。
為了安全起見，你需要確保降級後的可注入物件只在能夠保證其模組已被具現化的應用程式部分中使用，而不會在其他地方被使用。

舉例來說，在由同一個 Angular 模組提供的降級 Angular 元件中才會使用的升級元件裡，使用降級服務是*可以*的；但在可能獨立於 Angular 使用的 AngularJS 元件中使用它，或在來自不同模組的降級 Angular 元件中使用它，則是*不可以*的。

</div>

## 在混合式應用程式中使用事前編譯

你可以在混合式應用程式中運用事前（AOT）編譯，就像在其他 Angular 應用程式中一樣。混合式應用程式的設定與[事前編譯](guide/aot-compiler)指南所述大致相同，差別在於 `index.html` 與 `main-aot.ts`。

AOT 需要載入 AngularJS `<script>` 中 `index.html` 標籤內的任何 AngularJS 檔案。一個簡單的複製方式，是把它們逐一加入 `copy-dist-files.js` 檔案。

你還需要把產生的 `MainAngularModuleFactory` 傳給 `downgradeModule()`，而不是傳自訂的啟動函式：

<code-example header="app/main-aot.ts">

import { downgradeModule } from '&commat;angular/upgrade/static';
import { MainAngularModuleNgFactory } from '../aot/app/app.module.ngfactory';

const downgradedModule = downgradeModule(MainAngularModuleNgFactory);

angular.module('mainAngularJsModule', [
  downgradedModule
]);

</code-example>

而這就是讓混合式 Angular 應用程式獲得 AOT 完整效益所需做的全部工作。

## 結論

本頁介紹了如何使用 [upgrade/static](api/upgrade/static) 套件，以你自己的步調逐步升級現有的 AngularJS 應用程式，且在整個升級過程中不會阻礙應用程式的進一步開發。

具體來說，本指南說明了如何透過使用 [downgradeModule()](api/upgrade/static/downgradeModule) 而非 [UpgradeModule](api/upgrade/static/UpgradeModule)，在混合式應用程式中獲得更好的效能與更大的彈性。

總結來說，`downgradeModule()` 的主要差異因素如下：

1.  它允許延遲具現化，甚至延遲載入 Angular 部分，進而改善初始載入時間。在某些情況下，這甚至可以免除執行第二個框架的成本。

1.  它透過避免不必要的變更偵測執行來提升效能，同時讓開發人員有更大的自訂能力。
1.  它不要求你改變啟動 AngularJS 應用程式的方式。

當你希望 AngularJS 與 Angular 兩部分保持較低的耦合時，使用 `downgradeModule()` 是混合式應用程式的好選擇。你仍然可以混合搭配來自兩個框架的元件與服務，但你可能需要手動傳播變更偵測。作為回報，`downgradeModule()` 提供更多的控制與更好的效能。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
