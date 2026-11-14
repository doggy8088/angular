# 為提升效能而升級

<div class="alert is-helpful">

  _Angular_ 是今日與未來的 Angular 之名。<br />
  _AngularJS_ 是 Angular 所有 1.x 版本的名稱。

</div>

本指南說明一些內建工具，可用來將 AngularJS 專案逐步遷移到
Angular 平台，一次遷移一部分。本指南與
[從 AngularJS 升級](guide/upgrade)非常相似，差別在於本指南使用 {@link
downgradeModule downgradeModule()} 輔助函式，而非 {@link UpgradeModule
UpgradeModule} 類別。這會影響應用程式的啟動方式，以及變更偵測
在兩個框架之間的傳播方式。它讓你能在升級過程中逐步升級，同時提升
混合式應用程式的速度，並在升級初期就於 AngularJS 應用程式中運用最新版 Angular。

## 準備工作

在討論如何使用 `downgradeModule()` 建立混合式應用程式之前，你可以先做一些事情，
讓升級過程更順利，即使你尚未開始升級也一樣。由於
無論採用哪種升級方式，步驟都相同，請參閱[從 AngularJS 升級](guide/upgrade)的[準備工作](guide/upgrade#準備工作)一節。

## 使用 `ngUpgrade` 升級

有了 Angular 中的 `ngUpgrade` 函式庫，你可以建立混合式應用程式，逐步升級現有的 AngularJS 應用程式，
在其中讓兩個框架並排執行。在這些混合式應用程式中，你可以
混合搭配 AngularJS 與 Angular 的元件和服務，讓它們無縫互通。
也就是說，你不必一次完成所有升級工作，因為在過渡期間，兩個框架之間本來就能
自然共存。

### `ngUpgrade` 的運作方式

無論你選擇 `downgradeModule()` 或 `UpgradeModule`，升級的基本原則、
混合式應用程式背後的思維模型，以及 {@link upgrade/static
upgrade/static} 公用程式的使用方式都相同。如需更多資訊，請參閱
[從 AngularJS 升級](guide/upgrade)的[`ngUpgrade` 的運作方式](guide/upgrade#ngupgrade-的運作方式)一節。

<div class="alert is-helpful">

  [從 AngularJS 升級](guide/upgrade)的[變更偵測](guide/upgrade#變更偵測)一節
  僅適用於使用 `UpgradeModule` 的應用程式。雖然
  你使用 `downgradeModule()` 時處理變更偵測的方式不同——這也是本指南的
  重點——但閱讀[變更偵測](guide/upgrade#變更偵測)一節，可以為接下來的內容提供有用的
  背景。

</div>

#### 使用 `downgradeModule()` 進行變更偵測

如前所述，`downgradeModule()` 與 `UpgradeModule` 的主要差異之一，
在於變更偵測，以及它如何在兩個框架之間傳播。

使用 `UpgradeModule` 時，兩個變更偵測系統會更緊密地綁在一起。只要
AngularJS 端的應用程式發生任何事，Angular 端就會自動觸發變更偵測，
反之亦然。這很方便，因為它能確保任一框架都不會錯過
重要的變更。不過，大多數時候，這些額外的變更偵測執行其實並無必要。

`downgradeModule()` 則相反，除非它知道應用程式的另一部分對這些變更感興趣，否則會避免明確觸發變更偵測。舉例來說，如果某個降級後的元件
定義了 `@Input()`，應用程式很可能需要在該值變更時得知。於是，
`downgradeComponent()` 會自動對該元件觸發變更偵測。

不過，在大多數情況下，在某個特定元件中本機所做的變更，對
應用程式其餘部分並無關聯。舉例來說，如果使用者點選按鈕送出表單，元件通常會
自行處理這個動作的結果。話雖如此，*確實*有些情況是你希望把變更傳播
到可能由另一個框架控制的應用程式其他部分。在這種情況下，
你有責任透過手動觸發變更偵測，通知感興趣的各方。

如果你希望某段特定的程式碼在應用程式的 AngularJS 端觸發變更偵測，
你需要把它包在
[scope.$apply()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply)裡。同樣地，若
要在 Angular 中觸發變更偵測，你可以使用 {@link NgZone#run ngZone.run()}。

在許多情況下，多執行幾次變更偵測可能無關緊要。然而，對於
較大型或變更偵測負擔較重的應用程式，它們可能會產生明顯的影響。透過讓你
更精細地控制變更偵測的傳播，`downgradeModule()` 能讓你的混合式應用程式獲得更好的
效能。

## 使用 `downgradeModule()`

AngularJS 與 Angular 都有各自的模組概念，可協助把應用程式組織成內聚的
功能區塊。

它們在架構與實作上的細節相當不同。在 AngularJS 中，你透過
指定模組的名稱與相依性來建立模組，使用
[angular.module()](https://docs.angularjs.org/api/ng/function/angular.module)。接著你可以
使用它的各種方法加入資產。在 Angular 中，你會建立一個帶有 {@link NgModule
NgModule} 裝飾器的類別，以中繼資料描述資產。

在混合式應用程式中，你會同時執行兩個框架。這表示你至少需要
分別來自 AngularJS 與 Angular 的各一個模組。

在大多數情況下，你指定模組的方式與一般應用程式相同。接著，你
使用 `upgrade/static` 輔助函式，讓兩個框架知道它們可以彼此使用哪些
資產。這稱為「升級」與「降級」。

<div class="alert is-helpful">

  <b>定義：</b>

  - _升級_：讓 AngularJS 資產（例如元件或服務）可供
    應用程式的 Angular 部分使用的行為。
  - _降級_：讓 Angular 資產（例如元件或服務）可供
    應用程式的 AngularJS 部分使用的行為。

</div>

連結相依性的重要一環，是把兩個主要模組連結在一起。這
就是 `downgradeModule()` 的用武之地。使用它來建立一個 AngularJS 模組&mdash;可作為
你主要 AngularJS 模組的相依性&mdash;它會啟動你的主要 Angular 模組，並
開始執行混合式應用程式的 Angular 部分。從某種意義上說，它是把 Angular 模組「降級」為
AngularJS 模組。

不過，有幾件事要注意：

1. 你不會直接把 Angular 模組傳給 `downgradeModule()`。`downgradeModule()` 需要的
   只是一份「配方」，例如一個工廠函式，來為你的模組建立執行個體。

2. 在應用程式真正需要 Angular 模組之前，它不會被具現化。

以下是如何使用 `downgradeModule()` 連結兩個模組的範例。

```ts
// Import `downgradeModule()`.
import { downgradeModule } from '@angular/upgrade/static';

// Use it to downgrade the Angular module to an AngularJS module.
const downgradedModule = downgradeModule(MainAngularModuleFactory);

// Use the downgraded module as a dependency to the main AngularJS module.
angular.module('mainAngularJsModule', [
  downgradedModule
]);
```

#### 為 Angular 模組指定工廠

如前所述，`downgradeModule()` 需要知道如何具現化 Angular 模組。它
需要一份配方。你可以提供一個能建立 Angular 模組
執行個體的工廠函式，藉此定義這份配方。`downgradeModule()` 接受兩種工廠函式：

1. `NgModuleFactory`
2. `(extraProviders: StaticProvider[]) => Promise<NgModuleRef>`

當你傳入 `NgModuleFactory` 時，`downgradeModule()` 會使用它，透過
{@link platformBrowser platformBrowser}的 {@link PlatformRef#bootstrapModuleFactory
bootstrapModuleFactory()} 來具現化模組，該方法與事前（AOT）編譯相容。AOT 編譯
有助於讓你的應用程式載入得更快。如需進一步了解 AOT，以及如何建立 `NgModuleFactory`，請參閱
[事前編譯](guide/aot-compiler)指南。

或者，你可以傳入一個普通的函式，它應該會回傳一個解析為
{@link NgModuleRef NgModuleRef}（也就是你的 Angular 模組的執行個體）的 Promise。這個函式會
以一個額外的 {@link StaticProvider Providers} 陣列作為引數呼叫，這些 Provider 應該要在
回傳的 `NgModuleRef` 的 {@link Injector Injector} 上可用。舉例來說，如果你使用 {@link
platformBrowser platformBrowser} 或 {@link platformBrowserDynamic platformBrowserDynamic}，你可以
把 `extraProviders` 陣列傳給它們：

```ts
const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(MainAngularModule);
};
// or
const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef = platformBrowser(extraProviders);
  return platformRef.bootstrapModuleFactory(MainAngularModuleFactory);
};
```

使用 `NgModuleFactory` 需要的樣板程式碼較少，而且是很好的預設選項，因為它開箱即支援 AOT。使用自訂函式需要的程式碼稍多，但能給你更大的
彈性。

#### 按需具現化 Angular 模組

`downgradeModule()` 與 `UpgradeModule` 的另一個主要差異是，後者要求
你預先具現化 AngularJS 與 Angular 模組。這表示即使你
到稍後才使用任何 Angular 資產，也必須付出具現化應用程式 Angular 部分的
成本。`downgradeModule()` 則沒那麼積極。只有在
第一次需要 Angular 部分時，它才會具現化；也就是說，一旦它需要建立降級後的
元件時。

你可以更進一步，直到真正需要時，才把應用程式 Angular 部分的程式碼下載到
使用者的瀏覽器。這在你只在混合式應用程式中
不需要初始渲染的部分使用 Angular，或使用者不會觸及的部分使用 Angular 時，特別有用。

舉幾個例子：

- 你只在特定的路由上使用 Angular，而且在使用者造訪這類路由之前／除非使用者造訪這類路由，否則不需要它。
- 你把 Angular 用於只對特定類型的使用者顯示的功能；例如，
  已登入的使用者、管理員或 VIP 會員。在使用者通過
  驗證之前，你不需要載入 Angular。
- 你把 Angular 用於某個對應用程式初始渲染並不重要的功能，而且你
  為了更好的初始載入效能，可以承受一點延遲。

### 使用 `downgradeModule()` 啟動

如你所料，你不需要改變現有 AngularJS 應用程式的啟動方式。與需要一些額外步驟的 `UpgradeModule`&mdash;不同&mdash;
`downgradeModule()` 只要你提供配方，就能負責啟動 Angular 模組。

為了開始使用任何 `upgrade/static` API，你仍需要像一般 Angular
應用程式那樣載入 Angular 框架。你可以依照
[設定](guide/setup)指南中的指示，使用 SystemJS 來了解如何做到這一點，並從
[QuickStart GitHub 儲存庫](https://github.com/angular/quickstart)選擇性地複製程式碼。

你還需要使用 `npm install @angular/upgrade --save` 安裝 `@angular/upgrade` 套件
，並為 `@angular/upgrade/static` 套件加入對映：

<code-example title="system.config.js">
'@angular/upgrade/static': 'npm:@angular/upgrade/bundles/upgrade-static.umd.js',
</code-example>

接著，建立 `app.module.ts` 檔案，並加入以下的 `NgModule` 類別：

<code-example title="app.module.ts">
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule
  ]
})
export class MainAngularModule {
  // Empty placeholder method to satisfy the `Compiler`.
  ngDoBootstrap() {}
}
</code-example>

這個最精簡的 `NgModule` 會匯入 `BrowserModule`，這是每個以瀏覽器為基礎的 Angular 應用程式都
必須具備的模組。它還定義了一個空的 `ngDoBootstrap()` 方法，以防止 {@link Compiler
Compiler} 回傳錯誤。這是必要的，因為該模組的 `bootstrap`
宣告不會出現在它的 `NgModule` 裝飾器上。

<div class="alert is-important">

  你不需要在 `NgModule` 裝飾器上加入 `bootstrap` 宣告，因為 AngularJS 擁有
  應用程式的根範本，而 `ngUpgrade` 會啟動必要的元件。

</div>

你現在可以使用 `downgradeModule()` 把 AngularJS 與 Angular 模組連結在一起。

<code-example title="app.module.ts">
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { downgradeModule } from '@angular/upgrade/static';

const bootstrapFn = (extraProviders: StaticProvider[]) => {
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

`downgradeModule()` 與 `UpgradeModule` 的差異到此為止。其餘的
`upgrade/static` API 與概念，在兩種混合式應用程式中的運作方式完全相同。
請參閱[從 AngularJS 升級](guide/upgrade)，了解以下內容：

- [從 AngularJS 程式碼使用 Angular 元件](guide/upgrade#從-angularjs-程式碼使用-angular-元件)。
- [從 Angular 程式碼使用 AngularJS 元件指令](guide/upgrade#從-angular-程式碼使用-angularjs-元件指令)。
- [將 AngularJS 內容投影到 Angular 元件中](guide/upgrade#把-angularjs-內容投影至-angular-元件)。
- [將 Angular 內容轉含到 AngularJS 元件指令中](guide/upgrade#把-angular-內容轉置至-angularjs-元件指令)。
- [讓 AngularJS 相依性能夠注入到 Angular 中](guide/upgrade#讓-angularjs-依賴可注入至-angular)。
- [讓 Angular 相依性能夠注入到 AngularJS 中](guide/upgrade#讓-angular-依賴可注入至-angularjs)。

<div class="alert is-important">

  雖然降級可注入物件是可行的，但在 Angular 模組被具現化之前，降級後的可注入物件將無法使用。為了安全起見，你需要確保
  降級後的可注入物件不會在由 Angular 控制的應用程式部分*之外*的任何地方被使用。

  舉例來說，在只會從 Angular 元件使用的升級元件中，使用降級服務是*可以*的；但
  在可能獨立於 Angular 使用的 AngularJS 元件中使用它，則*不可以*。

</div>

## 在混合式應用程式中使用事前編譯

你可以在混合式應用程式中運用事前（AOT）編譯，就像在其他
Angular 應用程式中一樣。混合式應用程式的設定與
[事前編譯](guide/aot-compiler)指南所述大致相同，差別在於 `index.html` 與
`main-aot.ts`。

AOT 需要載入 AngularJS `index.html` 中 `<script>` 標籤內的任何 AngularJS 檔案。
一個簡單的複製方式，是把它們逐一加入 `copy-dist-files.js` 檔案。

你還需要把產生的 `MainAngularModuleFactory` 傳給 `downgradeModule()`，而不是傳
自訂的啟動函式：

<code-example title="app/main-aot.ts">
import { downgradeModule } from '@angular/upgrade/static';
import { MainAngularModuleNgFactory } from '../aot/app/app.module.ngfactory';

const downgradedModule = downgradeModule(MainAngularModuleNgFactory);

angular.module('mainAngularJsModule', [
  downgradedModule
]);
</code-example>

而這就是讓混合式 Angular 應用程式獲得 AOT 完整效益所需做的全部工作。

## 結論

本頁介紹了如何使用 {@link upgrade/static upgrade/static} 套件，以你自己的步調逐步
升級現有的 AngularJS 應用程式，且在整個升級過程中不會阻礙應用程式的進一步開發。

具體來說，本指南說明了如何透過使用 {@link downgradeModule downgradeModule()} 而非 {@link UpgradeModule
UpgradeModule}，在混合式應用程式中獲得更好的效能與更大的彈性。

總結來說，`downgradeModule()` 的主要差異因素如下：

1. 它允許延遲具現化，甚至延遲載入 Angular 部分，進而改善
   初始載入時間。在某些情況下，這甚至可以免除執行第二個框架的成本。
2. 它透過避免不必要的變更偵測執行來提升效能，同時讓開發人員有更大的
   自訂能力。
3. 它不要求你改變啟動 AngularJS 應用程式的方式。

當你希望 AngularJS 與 Angular 兩部分保持較低的耦合時，使用 `downgradeModule()`
是混合式應用程式的好選擇。你仍然可以混合搭配來自兩個
框架的元件與服務，但你可能需要手動傳播變更偵測。作為回報，
`downgradeModule()` 提供更多的控制與更好的效能。
