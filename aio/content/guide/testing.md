{@a top}
# 測試

本指南提供單元測試與整合測試 Angular 應用程式的提示與技巧。

本指南呈現以 [Angular CLI](cli) 建立的範例應用程式的測試。這個範例應用程式與在 [_英雄之旅_教學](tutorial) 中建立的應用程式非常相似。
本指南的範例應用程式與所有測試，都可供檢視與實驗：

- <live-example embedded-style>Sample app</live-example>
- <live-example stackblitz="specs">Tests</live-example>

<hr>

## 設定

Angular CLI 會下載並安裝使用 [Jasmine 測試框架](https://jasmine.github.io/) 測試 Angular 應用程式所需的一切。

你用 CLI 建立的專案立即就能進行測試。
只要執行 [`ng test`](cli/test) CLI 指令：

<code-example language="sh" class="code-shell">
  ng test
</code-example>

`ng test` 指令以 _監看模式_ 建置應用程式，並啟動 [Karma 測試執行器](https://karma-runner.github.io)。

主控台輸出大致如下：

<code-example language="sh" class="code-shell">
10% building modules 1/1 modules 0 active
...INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
...INFO [launcher]: Launching browser Chrome ...
...INFO [launcher]: Starting browser Chrome
...INFO [Chrome ...]: Connected on socket ...
Chrome ...: Executed 3 of 3 SUCCESS (0.135 secs / 0.205 secs)
</code-example>

日誌的最後一行最重要。
它顯示 Karma 執行了三個測試，全部通過。

Chrome 瀏覽器也會開啟，並在「Jasmine HTML Reporter」中顯示測試輸出，如下所示。

<figure>
  <img src='generated/images/guide/testing/initial-jasmine-html-reporter.png' alt="瀏覽器中的 Jasmine HTML Reporter">
</figure>

大多數人覺得這種瀏覽器輸出比主控台日誌更容易閱讀。
點選某個測試列可以只重新執行該測試，或點選某個描述，以重新執行所選測試群組（"test suite"）中的測試。

同時，`ng test` 指令正在監看變更。

若要實際看看這個效果，對 `app.component.ts` 做一點小變更並儲存。
測試會再次執行，瀏覽器會重新整理，新的測試結果就會出現。

#### 設定

CLI 會為你處理 Jasmine 與 Karma 的設定。

你可以編輯 `karma.conf.js` 與
`src/` 資料夾中的 `test.ts` 檔案，來微調許多選項。

`karma.conf.js` 檔案是一份部分的 Karma 設定檔。
CLI 會根據 `angular.json` 檔案中指定的應用程式結構，在記憶體中建構完整的執行時期設定，並以 `karma.conf.js` 補充。

在網路上搜尋更多關於 Jasmine 與 Karma 設定的詳細資訊。

#### 其他測試框架

你也可以使用其他測試函式庫與測試執行器來單元測試 Angular 應用程式。
每個函式庫與執行器都有自己獨特的安裝程序、設定與語法。

在網路上搜尋以了解更多。

#### 測試檔案名稱與位置

查看 `src/app` 資料夾內部。

CLI 為 `AppComponent` 產生了一個名為 `app.component.spec.ts` 的測試檔案。

<div class="alert is-important">

測試檔案的副檔名**必須是 `.spec.ts`**，工具才能將其識別為含有測試的檔案（也稱為 _spec_ 檔案）。

</div>

`app.component.ts` 與 `app.component.spec.ts` 檔案是同一個資料夾中的同層檔案。
兩個檔案的根檔案名稱（`app.component`）相同。

在你自己的專案中，對 _每一種_ 測試檔案都採用這兩個慣例。

{@a ci}

## 設定持續整合

讓你的專案保持無錯誤狀態的最好方法之一，就是透過測試套件，但你可能不會一直記得要執行測試。
持續整合（CI）伺服器讓你可以設定專案儲存庫，讓你的測試在每次提交與提取請求時執行。

有付費的 CI 服務，如 Circle CI 與 Travis CI，你也可以使用 Jenkins 等工具免費自行架設。
雖然 Circle CI 與 Travis CI 是付費服務，但它們為開源專案免費提供。
你可以建立一個公開的 GitHub 專案，並加入這些服務，無需付費。
對 Angular 儲存庫的貢獻會自動經過一整套 Circle CI 測試。

本文說明如何設定你的專案來執行 Circle CI 與 Travis CI，並更新你的測試設定，以便在這兩種環境中都能在 Chrome 瀏覽器中執行測試。

### 為 Circle CI 設定專案

步驟 1：在專案根目錄建立一個名為 `.circleci` 的資料夾。

步驟 2：在新資料夾中，建立一個名為 `config.yml` 的檔案，內容如下：

```
version: 2
jobs:
  build:
    working_directory: ~/my-project
    docker:
      - image: circleci/node:8-browsers
    steps:
      - checkout
      - restore_cache:
          key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run: npm install
      - save_cache:
          key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
          paths:
            - "node_modules"
      - run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
      - run: npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
```

此設定會快取 `node_modules/`，並使用 [`npm run`](https://docs.npmjs.com/cli/run-script) 來執行 CLI 指令，因為 `@angular/cli` 並未全域安裝。
雙連字號（`--`）是把引數傳遞給 `npm` 指令碼所必需的。

步驟 3：提交你的變更，並推送到你的儲存庫。

步驟 4：[註冊 Circle CI](https://circleci.com/docs/2.0/first-steps/) 並[加入你的專案](https://circleci.com/add-projects)。
你的專案應該就會開始建置。

* 從 [Circle CI 文件](https://circleci.com/docs/2.0/) 了解更多關於 Circle CI 的資訊。

### 為 Travis CI 設定專案

步驟 1：在專案根目錄建立一個名為 `.travis.yml` 的檔案，內容如下：

```
dist: trusty
sudo: false

language: node_js
node_js:
  - "8"
  
addons:
  apt:
    sources:
      - google-chrome
    packages:
      - google-chrome-stable

cache:
  directories:
     - ./node_modules

install:
  - npm install

script:
  - npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
  - npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
```

這與 Circle CI 設定所做的事相同，不同之處在於 Travis 沒有附帶 Chrome，所以我們改用 Chromium。

步驟 2：提交你的變更，並推送到你的儲存庫。

步驟 3：[註冊 Travis CI](https://travis-ci.org/auth) 並[新增你的專案](https://travis-ci.org/profile)。
你需要推送一個新的提交來觸發建置。

* 從 [Travis CI 文件](https://docs.travis-ci.com/) 了解更多關於 Travis CI 測試的資訊。

### 設定 CLI 以在 Chrome 中進行 CI 測試

當 CLI 命令 `ng test` 和 `ng e2e` 通常已在你的環境中執行 CI 測試時，你可能仍然需要調整你的設定，才能執行 Chrome 瀏覽器測試。

[Karma JavaScript 測試執行器](https://karma-runner.github.io/latest/config/configuration-file.html)
與 [Protractor](https://www.protractortest.org/#/api-overview) 端到端測試工具都有設定檔，
你必須調整這些設定檔，才能以無沙箱模式啟動 Chrome。

在這些範例中，我們將使用 [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome#cli)。

* 在 Karma 設定檔 `karma.conf.js` 中，在 browsers 下方新增一個名為 ChromeHeadlessCI 的自訂啟動器：
```
browsers: ['Chrome'],
customLaunchers: {
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
```

* 在你的 e2e 測試專案的根資料夾中，建立一個名為 `protractor-ci.conf.js` 的新檔案。這個新檔案擴充了原始的 `protractor.conf.js`。
```
const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

exports.config = config;
```

現在，你可以執行下列指令來使用 `--no-sandbox` 旗標：

<code-example language="sh" class="code-shell">
  ng test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
  ng e2e -- --protractor-config=e2e/protractor-ci.conf.js
</code-example>

<div class="alert is-helpful">

   **注意：** 目前，如果你在 Windows 上執行，也會想包含 `--disable-gpu` 旗標。請參閱 [crbug.com/737678](https://crbug.com/737678)。

</div>

{@a code-coverage}

## 啟用程式碼覆蓋率報告

CLI 可以執行單元測試並建立程式碼覆蓋率報告。
程式碼覆蓋率報告會向你顯示程式碼庫中有哪些部分可能沒有被單元測試妥善測試到。

若要產生覆蓋率報告，請在專案的根目錄執行下列指令。

<code-example language="sh" class="code-shell">
  ng test --no-watch --code-coverage
</code-example>

測試完成後，該指令會在專案中建立一個新的 `/coverage` 資料夾。開啟 `index.html` 檔案，即可查看一份帶有你的原始碼與程式碼覆蓋率數值的報告。

如果你想在每次測試時都建立程式碼覆蓋率報告，請在 CLI 設定檔 `angular.json` 中設定下列選項：

```
  "test": {
    "options": {
      "codeCoverage": true
    }
  }
```

### 程式碼覆蓋率強制要求

程式碼覆蓋率百分比讓你估計你的程式碼有多少比例已被測試。
如果你的團隊決定了一個要進行單元測試的最低數量，請以 Angular CLI 強制執行這個最低要求。

例如，假設你希望程式碼庫至少有 80% 的程式碼覆蓋率。
若要啟用這個功能，請開啟 [Karma](https://karma-runner.github.io) 測試平台設定檔 `karma.conf.js`，並在 `coverageIstanbulReporter:` 鍵中加入下列內容。

```
coverageIstanbulReporter: {
  reports: [ 'html', 'lcovonly' ],
  fixWebpackSourcePaths: true,
  thresholds: {
    statements: 80,
    lines: 80,
    branches: 80,
    functions: 80
  }
}
```

`thresholds` 屬性會讓工具在專案中執行單元測試時，強制要求至少 80% 的程式碼覆蓋率。

## 服務測試

服務通常是最容易進行單元測試的檔案。
以下是一些在沒有 Angular 測試工具協助下撰寫的 `ValueService` 同步與非同步單元測試。

<code-example path="testing/src/app/demo/demo.spec.ts" region="ValueService" header="app/demo/demo.spec.ts"></code-example>

{@a services-with-dependencies}

#### 具有相依性的服務

服務通常相依於 Angular 注入到建構函式中的其他服務。
在許多情況下，你可以在呼叫服務建構函式時，手動建立並 _注入_ 這些相依性。

`MasterService` 是一個簡單的範例：

<code-example path="testing/src/app/demo/demo.ts" region="MasterService" header="app/demo/demo.ts" linenums="false"></code-example>

`MasterService` 將它唯一的方法 `getValue` 委派給注入的 `ValueService`。

以下是幾種測試它的方法。

<code-example path="testing/src/app/demo/demo.spec.ts" region="MasterService" header="app/demo/demo.spec.ts"></code-example>

第一個測試以 `ValueService` 建立一個 `new`，並將它傳給 `MasterService` 建構函式。

然而，注入真實的服務很少能運作得好，因為大多數相依的服務都很難建立與控制。

相反地，請模擬該相依性、使用虛擬值，或在相關的服務方法上建立一個
[spy](https://jasmine.github.io/2.0/introduction.html#section-Spies)。

<div class="alert is-helpful">

建議優先使用 spy 替身，因為它們通常是模擬服務的最佳方式。

</div>

這些標準測試技巧非常適合以獨立方式單元測試服務。

然而，你幾乎總是使用 Angular 依賴注入將服務注入應用程式類別，因此你應該要有能反映該使用模式的測試。
Angular 測試工具讓調查注入服務的行為變得直接明瞭。

#### 以 _TestBed_ 測試服務

你的應用程式仰賴 Angular [依賴注入（DI）](guide/dependency-injection) 來建立服務。
當一個服務有相依的服務時，DI 會尋找或建立該相依服務。
而如果該相依服務有它自己的相依性，DI 也會一併尋找或建立它們。

身為服務 _消費者_，你不需要擔心這一切。
你不需要擔心建構函式引數的順序，也不需要擔心它們如何被建立。

身為服務 _測試者_，你至少必須思考第一層級的服務相依性，但你可以讓 Angular DI 處理服務的建立與建構函式引數順序，方法是使用 `TestBed` 測試工具來提供與建立服務。

{@a testbed}

#### Angular _TestBed_

`TestBed` 是 Angular 測試工具中最重要的一個。
`TestBed` 會建立一個動態建構的 Angular _測試_ 模組，模擬 Angular 的 [@NgModule](guide/ngmodules)。

`TestBed.configureTestingModule()` 方法接受一個中繼資料物件，該物件可以具有 [@NgModule](guide/ngmodules) 的大多數屬性。

若要測試服務，請將 `providers` 中繼資料屬性設定為你要測試或模擬的服務陣列。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-before-each"
  header="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach">
</code-example>

然後在測試內呼叫 `TestBed.get()`，並以服務類別作為引數來注入它。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-inject-it">
</code-example>

或是在 `beforeEach()` 內注入，如果你偏好將服務的注入作為設定作業的一部分。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-inject-before-each">
</code-example>

測試具有相依性的服務時，請在 `providers` 陣列中提供該 mock。

在下列範例中，mock 是一個 spy 物件。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="master-service-before-each" linenums="false">
</code-example>

該測試以與先前相同的方式使用該 spy。

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="master-service-it">
</code-example>

{@a no-before-each}
#### 不使用 _beforeEach()_ 進行測試

本指南中的大多數測試套件都會呼叫 `beforeEach()`，為每個 `it()` 測試設定前置條件，並仰賴 `TestBed` 來建立類別與注入服務。

還有另一派測試從不呼叫 `beforeEach()`，偏好明確地建立類別，而非使用 `TestBed`。

以下是你可能如何以那種風格改寫其中一個 `MasterService` 測試。

先將可重複使用、具準備性質的程式碼放進一個 _setup_ 函式，而不是放在 `beforeEach()` 中。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-setup"
  header="app/demo/demo.spec.ts (setup)" linenums="false">
</code-example>

`setup()` 函式會傳回一個物件字面值，其中帶有測試可能引用的變數，例如 `masterService`。
你不會在 `describe()` 的主體中定義 _半全域_ 變數（例如 `let masterService: MasterService`）。

然後每個測試在第一行叫用 `setup()`，接著繼續進行操作測試主體並斷言期望的步驟。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-test" linenums="false">
</code-example>

請注意，測試如何使用
[_解構賦值_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
來擷取它需要的設定變數。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-setup-call">
</code-example>

許多開發者覺得這種作法比傳統的 `beforeEach()` 風格更簡潔、更明確。

雖然本測試指南遵循傳統風格，且預設的 [CLI schematics](https://github.com/angular/angular-cli) 產生的測試檔案帶有 `beforeEach()` 與 `TestBed`，仍歡迎你在自己的專案中採用 _這個替代作法_。

#### 測試 HTTP 服務

向遠端伺服器發出 HTTP 呼叫的資料服務，通常會注入 Angular 的 [`HttpClient`](guide/http) 服務，並委派給它進行 XHR 呼叫。

你可以像測試任何具有相依性的服務一樣，使用注入的 `HttpClient` spy 來測試資料服務。
<code-example
  path="testing/src/app/model/hero.service.spec.ts"
  region="test-with-spies"
  header="app/model/hero.service.spec.ts (tests with spies)">
</code-example>

<div class="alert is-important">

`HeroService` 的方法會回傳 `Observables`。你必須
_訂閱_ observable，才能（a）讓它執行，以及（b）斷言該方法成功或失敗。

`subscribe()` 方法接受一個成功（`next`）與一個失敗（`error`）回呼。
請確保你有提供 _這兩個_ 回呼，這樣你才能捕捉到錯誤。
若疏於這麼做，會產生一個非同步的未捕捉 observable 錯誤，測試執行器很可能會將它歸因到一個完全不同的測試上。

</div>

#### _HttpClientTestingModule_

資料服務與 `HttpClient` 之間的擴充互動可能很複雜，而且很難用 spy 來模擬。

`HttpClientTestingModule` 可以讓這些測試情境更容易管理。

雖然本指南隨附的 _程式碼範例_ 有示範 `HttpClientTestingModule`，但本頁將內容留給 [Http 指南](guide/http#測試-http-請求)，該指南詳細涵蓋了使用 `HttpClientTestingModule` 的測試。

<div class="alert is-helpful">

本指南的範例程式碼也示範了如何測試 `app/model/http-hero.service.spec.ts` 中的_舊版_ `HttpModule`。

</div>

## 元件測試基礎

元件與 Angular 應用程式的所有其他部分不同，它結合了 HTML 範本與 TypeScript 類別。
元件真正的是範本與類別_共同運作_。
若要妥善測試元件，你應該測試它們是否如預期般共同運作。

這類測試需要在瀏覽器 DOM 中建立元件的宿主元素（如同 Angular 所做的），並研究元件類別如何依照其範本所描述的方式與 DOM 互動。

Angular `TestBed` 促進了這類測試，正如你在下面章節中會看到的。
但在許多情況下，_單獨測試元件類別_、不涉及 DOM，就能以更容易、更明顯的方式驗證元件的大部分行為。

### 元件類別測試

像測試服務類別一樣，單獨測試元件類別。

以這個 `LightswitchComponent` 為例：當使用者點選按鈕時，它會切換一盞燈的開與關（以螢幕上的訊息表示）。

<code-example
  path="testing/src/app/demo/demo.ts"
  region="LightswitchComp"
  header="app/demo/demo.ts (LightswitchComp)" linenums="false">
</code-example>

你可能會決定只測試 `clicked()` 方法是否切換燈的*開/關*狀態，並適當地設定訊息。

這個元件類別沒有任何相依性。
若要測試沒有相依性的服務，你可以用 `new` 建立它、操作它的 API，
並對它的公開狀態斷言期望。
對元件類別也照此辦理。

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="Lightswitch"
  header="app/demo/demo.spec.ts (Lightswitch tests)" linenums="false">
</code-example>

以下是 *Tour of Heroes* 教學中的 `DashboardHeroComponent`。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="class"
  header="app/dashboard/dashboard-hero.component.ts (component)" linenums="false">
</code-example>

它出現在父元件的範本中，該範本將一位 *hero* 繫結到 `@Input` 屬性，並監聽透過 *selected* `@Output` 屬性引發的事件。

你可以測試類別程式碼是否能運作，而不必建立 `DashboardHeroComponent` 或其父元件。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="class-only"
  header="app/dashboard/dashboard-hero.component.spec.ts (class tests)" linenums="false">
</code-example>

當元件具有相依性時，你可能會想使用 `TestBed` 來同時建立元件和它的相依性。

以下 `WelcomeComponent` 相依於 `UserService`，以便知道要問候的使用者名稱。

<code-example
  path="testing/src/app/welcome/welcome.component.ts"
  region="class"
  header="app/welcome/welcome.component.ts" linenums="false">
</code-example>

你可以先為 `UserService` 建立一個 mock，滿足這個元件的最低需求。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="mock-user-service"
  header="app/welcome/welcome.component.spec.ts (MockUserService)" linenums="false">
</code-example>

接著在 `TestBed` 設定中，同時提供並注入**元件**和**服務**。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-before-each"
  header="app/welcome/welcome.component.spec.ts (class-only setup)" linenums="false">
</code-example>

然後運用元件類別，記得要像 Angular 執行應用程式時一樣，呼叫[生命週期鉤子方法](guide/lifecycle-hooks)。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-tests"
  header="app/welcome/welcome.component.spec.ts (class-only tests)" linenums="false">
</code-example>

### 元件 DOM 測試

測試元件_類別_就和測試服務一樣簡單。

元件不只是它的類別而已。
元件會與 DOM 以及其他元件互動。
*僅限類別*的測試可以告訴你類別的行為。
它們無法告訴你元件是否能正確渲染、回應使用者輸入與手勢，或與其父元件和子元件整合。

前面這些*僅限類別*的測試，都無法回答元件在螢幕上實際如何運作的關鍵問題。

- `Lightswitch.clicked()` 是否繫結到任何東西，讓使用者可以叫用它？
- `Lightswitch.message` 是否有顯示？
- 使用者是否真的能選取 `DashboardHeroComponent` 顯示的英雄？
- 英雄名稱是否如預期般顯示（也就是大寫）？
- `WelcomeComponent` 的範本是否顯示了歡迎訊息？

對前面說明的簡單元件來說，這些問題可能不令人困擾。
但許多元件與其範本中所描述的 DOM 元素有複雜的互動，隨著元件狀態變更，HTML 會出現和消失。

若要回答這類問題，你必須建立與元件相關聯的 DOM 元素，必須檢查 DOM 以確認元件狀態在適當的時機正確顯示，並且必須模擬使用者與螢幕的互動，以判斷這些互動是否讓元件如預期般運作。

若要撰寫這類測試，你將使用 `TestBed` 的額外功能以及其他測試輔助工具。

#### CLI 產生的測試

當你要求 CLI 產生新元件時，CLI 依預設會為你建立一個初始測試檔案。

例如，以下 CLI 指令會在 `app/banner` 資料夾中產生一個 `BannerComponent`（帶有內嵌範本與樣式）：

<code-example language="sh" class="code-shell">
ng generate component banner --inline-template --inline-style --module app
</code-example>

它也會為該元件產生一個初始測試檔案 `banner-external.component.spec.ts`，看起來像這樣：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v1"
  header="app/banner/banner-external.component.spec.ts (initial)" linenums="false">
</code-example>

#### 減少設定

這個檔案中只有最後三行真正在測試元件，而且它們所做的只是斷言 Angular 可以建立該元件。

檔案的其餘部分都是樣板設定程式碼，預先為更進階的測試做準備——如果元件演變成實質的東西，這些測試_可能_會變得有必要。

你將在下面了解這些進階測試功能。
目前，你可以大幅縮減這個測試檔案，使其大小更易於管理：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v2"
  header="app/banner/banner-initial.component.spec.ts (minimal)" linenums="false">
</code-example>

在這個範例中，傳給 `TestBed.configureTestingModule` 的中繼資料物件只宣告了 `BannerComponent`，也就是要測試的元件。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="configureTestingModule">
</code-example>

<div class="alert is-helpful">

不需要宣告或匯入其他任何東西。
預設的測試模組已經預先設定成類似 `@angular/platform-browser` 的 `BrowserModule`。

稍後你將呼叫 `TestBed.configureTestingModule()`，帶入匯入、提供者與更多宣告，以滿足你的測試需求。
選擇性的 `override` 方法可以進一步微調設定的各個面向。

</div>

{@a create-component}

#### _createComponent()_

設定好 `TestBed` 之後，你呼叫它的 `createComponent()` 方法。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="createComponent">
</code-example>

`TestBed.createComponent()` 會建立 `BannerComponent` 的一個執行個體，將對應的元素加入測試執行器 DOM，並回傳一個 [`ComponentFixture`](#component-fixture)。

<div class="alert is-important">

在呼叫 `createComponent` 之後，請勿重新設定 `TestBed`。

`createComponent` 方法會凍結目前的 `TestBed` 定義，使其無法再進行進一步設定。

你不能再呼叫任何 `TestBed` 設定方法，不能呼叫 `configureTestingModule()`，不能呼叫 `get()`，也不能呼叫任何 `override...` 方法。
如果你嘗試這麼做，`TestBed` 會擲出錯誤。

</div>

{@a component-fixture}

#### _ComponentFixture_

[ComponentFixture](api/core/testing/ComponentFixture) 是一個測試工具，用於與建立的元件及其對應元素互動。

透過 fixture 存取元件執行個體，並用 Jasmine 期望確認它存在：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="componentInstance">
</code-example>

#### _beforeEach()_

隨著這個元件演變，你將加入更多測試。
與其為每個測試重複 `TestBed` 設定，不如重構，將設定抽到 Jasmine `beforeEach()` 與一些輔助變數中：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v3"
  linenums="false">
</code-example>

現在加入一個測試，從 `fixture.nativeElement` 取得元件的元素，並尋找預期的文字。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-2">
</code-example>

{@a native-element}

#### _nativeElement_

`ComponentFixture.nativeElement` 的值型別為 `any`。
稍後你會遇到 `DebugElement.nativeElement`，它的型別同樣是 `any`。

Angular 在編譯時期無法知道 `nativeElement` 是哪一種 HTML 元素，甚至不知道它是否為 HTML 元素。
應用程式可能正在_非瀏覽器平台_上執行，例如伺服器或 [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)，在這些環境中，該元素可能擁有縮減的 API，甚至根本不存在。

本指南中的測試設計為在瀏覽器中執行，因此 `nativeElement` 值永遠都會是 `HTMLElement` 或其衍生類別之一。

知道它是某種 `HTMLElement` 之後，就可以使用標準的 HTML `querySelector` 深入元素樹。

以下另一個測試呼叫 `HTMLElement.querySelector` 來取得段落元素，並尋找橫幅文字：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-3">
</code-example>

{@a debug-element}

#### _DebugElement_

Angular _fixture_ 透過 `fixture.nativeElement` 直接提供元件的元素。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="nativeElement">
</code-example>

這實際上是一個便利方法，實作方式為 `fixture.debugElement.nativeElement`。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="debugElement-nativeElement">
</code-example>

透過這條迂迴路徑取得元素，是有充分理由的。

`nativeElement` 的屬性取決於執行階段環境。
你可能正在_非瀏覽器_平台上執行這些測試，該平台沒有 DOM，或其 DOM 模擬不支援完整的 `HTMLElement` API。

Angular 仰賴 `DebugElement` 抽象層，才能在_所有受支援的平台_上安全運作。
Angular 不會建立 HTML 元素樹，而是建立 `DebugElement` 樹，包裝執行階段平台的_原生元素_。
`nativeElement` 屬性會解開 `DebugElement`，回傳平台專屬的元素物件。

由於本指南的範例測試設計為只在瀏覽器中執行，這些測試中的 `nativeElement` 永遠是 `HTMLElement`，你可以在測試中探索它熟悉的方法與屬性。

以下先前的測試以 `fixture.debugElement.nativeElement` 重新實作：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-4">
</code-example>

`DebugElement` 還有其他在測試中很有用的方法與屬性，你將在本指南的其他地方看到。

你從 Angular 核心函式庫匯入 `DebugElement` 符號。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-debug-element">
</code-example>

{@a by-css}
#### _By.css()_

雖然本指南中的測試全都在瀏覽器中執行，但有些應用程式至少有一部分時間可能在不同平台上執行。

例如，元件可能先在伺服器上渲染，作為讓應用程式在連線不佳的裝置上更快啟動的策略的一部分。
伺服器端渲染器可能不支援完整的 HTML 元素 API。
如果它不支援 `querySelector`，前面的測試可能會失敗。

`DebugElement` 提供適用於所有受支援平台的查詢方法。
這些查詢方法接受一個_謂詞_函式，當 `DebugElement` 樹中的節點符合選取條件時，該函式回傳 `true`。

你借助從執行階段平台函式庫匯入的 `By` 類別，建立一個_謂詞_。
以下是瀏覽器平台的 `By` 匯入：

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-by">
</code-example>

以下範例以 `DebugElement.query()` 與瀏覽器的 `By.css` 方法重新實作先前的測試。

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-5">
</code-example>

一些值得注意的觀察：

- `By.css()` 靜態方法會以[標準 CSS 選擇器](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors 'CSS selectors')選取 `DebugElement` 節點。
- 查詢會回傳段落的 `DebugElement`。
- 你必須解開該結果，才能取得段落元素。

當你以 CSS 選擇器篩選，並且只測試瀏覽器_原生元素_的屬性時，`By.css` 的方式可能有點過度。

以標準的 `HTMLElement` 方法來篩選，通常更容易也更清楚，
例如 `querySelector()` 或 `querySelectorAll()`，
正如你在下一組測試中會看到的。

<hr>

## 元件測試情境

以下各節構成了本指南的大部分內容，將探討常見的
元件測試情境。

### 元件繫結

目前的 `BannerComponent` 在 HTML 範本中呈現靜態的標題文字。

經過幾次變更後，`BannerComponent` 透過繫結到元件的 `title` 屬性，呈現動態標題，如下所示。

<code-example
  path="testing/src/app/banner/banner.component.ts"
  region="component"
  header="app/banner/banner.component.ts" linenums="false">
</code-example>

儘管它如此簡單，你還是決定加入一個測試，確認元件確實在你預期的位置顯示正確的內容。

#### 查詢 _&lt;h1&gt;_

你將撰寫一系列測試，檢查包住 _title_ 屬性插值繫結的 `<h1>` 元素之值。

你更新 `beforeEach`，使用標準的 HTML `querySelector` 找到該元素，並將它指派給 `h1` 變數。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="setup"
  header="app/banner/banner.component.spec.ts (setup)" linenums="false">
</code-example>

{@a detect-changes}

#### _createComponent()_ 不會繫結資料

在你的第一個測試中，你想看到畫面顯示預設的 `title`。
你的直覺是撰寫一個立即檢查 `<h1>` 的測試，如下所示：

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default-v1">
</code-example>

_該測試失敗_，並顯示下列訊息：

```javascript
expected '' to contain 'Test Tour of Heroes'.
```

繫結發生在 Angular 執行**變更偵測**時。

在正式環境中，當 Angular 建立一個元件、使用者輸入按鍵，或非同步活動（例如 AJAX）完成時，變更偵測會自動啟動。

`TestBed.createComponent` *不會*觸發變更偵測；修訂後的測試證實了這個事實：

<code-example
  path="testing/src/app/banner/banner.component.spec.ts" region="test-w-o-detect-changes" linenums="false">
</code-example>

#### _detectChanges()_

你必須呼叫 `fixture.detectChanges()`，告訴 `TestBed` 執行資料繫結。
只有到那時，`<h1>` 才會有預期的標題。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default">
</code-example>

延遲變更偵測是刻意且有用的設計。
它讓測試者有機會在 Angular 啟動資料繫結並呼叫[生命週期鉤子](guide/lifecycle-hooks)*之前*，檢查並變更元件的狀態。

這是另一個測試，它在呼叫 `fixture.detectChanges()` _之前_ 先變更元件的 `title` 屬性。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="after-change">
</code-example>

{@a auto-detect-changes}

#### 自動變更偵測

`BannerComponent` 測試經常呼叫 `detectChanges`。
有些測試人員偏好 Angular 測試環境自動執行變更偵測。

這可以透過使用 `ComponentFixtureAutoDetect` 提供者來設定 `TestBed` 達成。
先從測試工具程式庫匯入它：

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect" header="app/banner/banner.component.detect-changes.spec.ts (import)" linenums="false"></code-example>

然後將它加入測試模組設定的 `providers` 陣列：

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" linenums="false"></code-example>

以下是三個示範自動變更偵測如何運作的測試。

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect-tests" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" linenums="false"></code-example>

第一個測試展示了自動變更偵測的好處。

第二個與第三個測試揭示了一個重要的限制。
Angular 測試環境*不知道*測試變更了元件的 `title`。
`ComponentFixtureAutoDetect` 服務會回應*非同步活動*，例如 promise 解析、計時器與 DOM 事件。
但對元件屬性的直接、同步更新是看不見的。
測試必須手動呼叫 `fixture.detectChanges()`，觸發另一輪變更偵測。

<div class="alert is-helpful">

與其猜測測試 fixture 何時會、何時不會執行變更偵測，本指南的範例*一律*明確地呼叫 `detectChanges()`。
比嚴格需要的次數更常呼叫 `detectChanges()`，也沒有壞處。

</div>

<hr>

{@a dispatch-event}

#### 以 _dispatchEvent()_ 變更輸入值

若要模擬使用者輸入，你可以找到輸入元素並設定它的 `value` 屬性。

你將呼叫 `fixture.detectChanges()` 來觸發 Angular 的變更偵測。
但這中間有一個不可或缺的步驟。

Angular 並不知道你設定了輸入元素的 `value` 屬性。
在你呼叫 `dispatchEvent()` 引發元素的 `input` 事件之前，它不會讀取該屬性。
*然後*你呼叫 `detectChanges()`。

下列範例示範了正確的順序。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

### 具有外部檔案的元件

前面的 `BannerComponent` 以_內嵌範本_與_內嵌 css_定義，分別在 `@Component.template` 與 `@Component.styles` 屬性中指定。

許多元件以 `@Component.templateUrl` 與 `@Component.styleUrls` 屬性指定_外部範本_與_外部 css_，如下列 `BannerComponent` 的變體所示。

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  region="metadata"
  header="app/banner/banner-external.component.ts (metadata)" linenums="false">
</code-example>

這種語法告訴 Angular 編譯器在元件編譯期間讀取外部檔案。

當你執行 CLI 的 `ng test` 指令時，這不是問題，因為它會_在執行測試之前編譯應用程式_。

然而，如果你在**非 CLI 環境**中執行測試，這個元件的測試可能會失敗。
例如，如果你在像 [plunker](https://plnkr.co) 這樣的網路程式編寫環境中執行 `BannerComponent` 測試，你會看到像這樣的訊息：

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

當執行階段環境_在測試本身進行期間_編譯原始碼時，你會得到這個測試失敗訊息。

若要修正這個問題，請呼叫 `compileComponents()`，如[下文](#compile-components)所述。

{@a component-with-dependency}

### 具有相依性的元件

元件經常有服務相依性。

`WelcomeComponent` 會向已登入的使用者顯示歡迎訊息。
它依據注入的 `UserService` 的某個屬性，知道使用者是誰：

<code-example path="testing/src/app/welcome/welcome.component.ts" header="app/welcome/welcome.component.ts" linenums="false"></code-example>

`WelcomeComponent` 具有與服務互動的決策邏輯，這些邏輯讓這個元件值得測試。
以下是 spec 檔案 `app/welcome/welcome.component.spec.ts` 的測試模組設定：

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="config-test-module" header="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

這次，除了宣告*受測元件*之外，
這個設定還把一個 `UserService` 提供者加入 `providers` 清單。
但不是真實的 `UserService`。

{@a service-test-doubles}

#### 提供服務測試替身

*受測元件*不一定要注入真實的服務。
事實上，如果它們是測試替身，例如 stub、fake、spy 或 mock，通常更好。
這個 spec 的目的是測試元件，而不是服務，而真實的服務可能帶來麻煩。

注入真實的 `UserService` 可能是一場噩夢。
真實的服務可能會要求使用者提供登入憑證，並嘗試連線到驗證伺服器。
這些行為可能很難攔截。
建立並註冊一個測試替身來代替真實的 `UserService`，要容易也安全得多。

這個特定的測試套件提供了一個 `UserService` 的最小 mock，滿足 `WelcomeComponent` 及其測試的需求：

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="user-service-stub"
  header="app/welcome/welcome.component.spec.ts" linenums="false">
</code-example>

{@a get-injected-service}

#### 取得注入的服務

測試需要存取注入到 `WelcomeComponent` 中的 stub `UserService`。

Angular 有一套階層式注入系統。
從 `TestBed` 建立的根注入器，一路往下到元件樹，注入器可以存在於多個層級。

取得注入服務最安全、**永遠有效**的方法，
是**從受測元件的注入器取得它**。
元件注入器是 fixture 的 `DebugElement` 的一個屬性。

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="injected-service"
  header="WelcomeComponent's injector">
</code-example>

{@a testbed-get}

#### _TestBed.get()_

你*也許*還能使用 `TestBed.get()` 從根注入器取得服務。
這個方法更容易記住，也更簡潔。
但它只有在 Angular 以測試根注入器中的服務執行個體注入元件時才有效。

在這個測試套件中，`UserService` 的*唯一*提供者是根測試模組，因此可以安全地如下呼叫 `TestBed.get()`：

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="inject-from-testbed"
  header="TestBed injector">
</code-example>

<div class="alert is-helpful">

關於 `TestBed.get()` 無法運作的使用情境，請參閱[覆寫元件的提供者](#component-override)一節，該節說明了何時以及為何你必須改從元件的注入器取得服務。

</div>

{@a service-from-injector}

#### 永遠從注入器取得服務

不要在你的測試主體中參照提供給測試模組的 `userServiceStub` 物件。
**這樣行不通！**
注入到元件中的 `userService` 執行個體是完全_不同_的物件，
是所提供的 `userServiceStub` 的複製品。

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="stub-not-injected" header="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

{@a welcome-spec-setup}

#### 最終設定與測試

以下是完整的 `beforeEach()`，使用 `TestBed.get()`：

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="setup" header="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

以下是一些測試：

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="tests" header="app/welcome/welcome.component.spec.ts" linenums="false"></code-example>

第一個是健全性測試；它確認被 stub 的 `UserService` 有被呼叫且正常運作。

<div class="alert is-helpful">

Jasmine 比對器的第二個參數（例如 `'expected name'`）是選擇性的失敗標籤。
如果期望不成立，Jasmine 會將這個標籤附加到期望失敗訊息中。
在包含多個期望的規格中，它能幫助釐清出了什麼問題，以及是哪個期望失敗。

</div>

其餘的測試則確認服務傳回不同值時元件的邏輯。
第二個測試驗證變更使用者名稱的效果。
第三個測試檢查在沒有已登入使用者時，元件是否顯示適當的訊息。

<hr>

{@a component-with-async-service}

### 具有非同步服務的元件

在這個範例中，`AboutComponent` 範本承載了一個 `TwainComponent`。
`TwainComponent` 會顯示 Mark Twain 的名言。

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="template"
  header="app/twain/twain.component.ts (template)" linenums="false">
</code-example>

請注意，元件的 `quote` 屬性之值會通過一個 `AsyncPipe`。
這表示該屬性傳回的是 `Promise` 或 `Observable`。

在這個範例中，`TwainComponent.getQuote()` 方法告訴你，`quote` 屬性傳回的是一個 `Observable`。

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="get-quote"
  header="app/twain/twain.component.ts (getQuote)" linenums="false">
</code-example>

`TwainComponent` 從注入的 `TwainService` 取得名言。
在服務能傳回第一句名言之前，元件先以一個佔位值（`'...'`）作為傳回的 `Observable` 的起始值。

`catchError` 會攔截服務錯誤、準備錯誤訊息，並在成功通道上傳回佔位值。
它必須等候一個 tick 才能設定 `errorMessage`，以免在同一個變更偵測週期內更新該訊息兩次。

這些都是你會想測試的功能。

#### 使用 spy 進行測試

測試元件時，重要的應該只有服務的公開 API。
一般而言，測試本身不應該呼叫遠端伺服器。
它們應該模擬這類呼叫。
這個 `app/twain/twain.component.spec.ts` 中的設定展示了其中一種做法：

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="setup"
  header="app/twain/twain.component.spec.ts (setup)" linenums="false">
</code-example>

{@a service-spy}

請聚焦在 spy 上。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy">
</code-example>

這個 spy 的設計讓任何對 `getQuote` 的呼叫都能收到一個帶有測試名言的 observable。
與真實的 `getQuote()` 方法不同，這個 spy 繞過了伺服器，傳回一個值可立即取得的同步 observable。

即使這個 spy 的 `Observable` 是同步的，你也可以用它撰寫許多有用的測試。

{@a sync-tests}

#### 同步測試

同步 `Observable` 的一個關鍵優勢是，你經常可以把非同步程序轉變為同步測試。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="sync-test">
</code-example>

由於 spy 的結果是同步傳回的，`getQuote()` 方法會在 Angular 呼叫 `ngOnInit` 的第一個變更偵測週期*之後*，立即更新螢幕上的訊息。

測試錯誤路徑時就沒這麼幸運了。
雖然服務 spy 會同步傳回錯誤，但元件方法呼叫了 `setTimeout()`。
測試必須至少等候 JavaScript 引擎的一整個回合，值才會變得可用。
測試必須變成*非同步*的。

{@a fake-async}

#### 使用 _fakeAsync()_ 的非同步測試

若要使用 `fakeAsync()` 功能，你需要匯入 `zone-testing`，詳情請參閱[設定指南](guide/setup#附錄：使用-fakeasyncasync-進行測試)。

下列測試確認服務傳回 `ErrorObservable` 時的預期行為。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="error-test">
</code-example>

`it()` 函式接收下列形式的引數。

```javascript
fakeAsync(() => { /* test body */ })`
```

`fakeAsync()` 函式透過在特殊的 `fakeAsync test zone` 中執行測試主體，啟用線性的程式撰寫風格。
測試主體看起來是同步的。
沒有巢狀語法（例如 `Promise.then()`）來打斷控制流程。

{@a tick}

#### _tick()_ 函式

你確實必須呼叫 `tick()` 來推進（虛擬）時鐘。

呼叫 `tick()` 會模擬時間的流逝，直到所有擱置中的非同步活動完成。
在這個案例中，它會等待錯誤處理常式的 `setTimeout()`；

`tick()` 函式接受毫秒作為參數（未提供時預設為 0）。這個參數表示虛擬時鐘推進多少。例如，如果你在 `fakeAsync()` 測試中有一個 `setTimeout(fn, 100)`，你需要使用 tick(100) 來觸發 fn 回呼。

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick">
</code-example>

`tick()` 函式是你透過 `TestBed` 匯入的 Angular 測試工具之一。
它是 `fakeAsync()` 的夥伴，而且只能在 `fakeAsync()` 主體內呼叫它。

#### 在 fakeAsync() 中比較日期

`fakeAsync()` 模擬時間的流逝，讓你可以在 `fakeAsync()` 內計算日期之間的差異。

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-date">
</code-example>

#### 搭配 fakeAsync() 使用 jasmine.clock

Jasmine 也提供 `clock` 功能來模擬日期。
對於在 `fakeAsync()` 方法內、呼叫 `jasmine.clock().install()` 之後執行的測試，Angular 會自動執行它們，直到呼叫 `jasmine.clock().uninstall()` 為止。
不需要 `fakeAsync()`，而且巢狀使用時會擲出錯誤。

預設情況下，這個功能是停用的。
若要啟用它，請在匯入 `zone-testing` 之前設定一個全域旗標。

如果你使用 Angular CLI，請在 `src/test.ts` 中設定這個旗標。

```
(window as any)['__zone_symbol__fakeAsyncPatchLock'] = true;
import 'zone.js/dist/zone-testing';
```

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-clock">
</code-example>

#### 在 fakeAsync() 中使用 RxJS 排程器

你也可以在 `fakeAsync()` 中使用 RxJS 排程器，就像使用 `setTimeout()` 或 `setInterval()` 一樣，但你需要匯入 `zone.js/dist/zone-patch-rxjs-fake-async` 來修補 RxJS 排程器。
<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-rxjs">
</code-example>

#### 支援更多 macroTasks

預設情況下，`fakeAsync()` 支援下列 `macroTasks`。

- setTimeout
- setInterval
- requestAnimationFrame
- webkitRequestAnimationFrame
- mozRequestAnimationFrame

如果你執行其他 `macroTask`，例如 `HTMLCanvasElement.toBlob()`，就會擲出 `Unknown macroTask scheduled in fake async test` 錯誤。

<code-tabs>
  <code-pane
    path="testing/src/app/shared/canvas.component.spec.ts"
    header="src/app/shared/canvas.component.spec.ts" linenums="false">
  </code-pane>
  <code-pane
    path="testing/src/app/shared/canvas.component.ts"
    header="src/app/shared/canvas.component.ts" linenums="false">
  </code-pane>
</code-tabs>

如果你想支援這種情況，你需要在 `beforeEach()` 中定義你想支援的 `macroTask`。
例如：

```javascript
beforeEach(() => {
  window['__zone_symbol__FakeAsyncTestMacroTask'] = [
    {
      source: 'HTMLCanvasElement.toBlob',
      callbackArgs: [{ size: 200 }]
    }
  ];
});

it('toBlob should be able to run in fakeAsync', fakeAsync(() => {
    const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    let blob = null;
    canvas.toBlob(function(b) {
      blob = b;
    });
    tick();
    expect(blob.size).toBe(200);
  })
);
```

#### 非同步 observables

你可能對這些測試的測試覆蓋率感到滿意。

但你可能會對真實服務並非完全如此運作而感到困擾。
真實服務會向遠端伺服器送出請求。
伺服器需要時間回應，而且回應當然不會像前兩個測試那樣立即可用。

如果你從 `getQuote()` spy 傳回一個_非同步_ observable，如下所示，你的測試將更忠實地反映真實世界。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-setup">
</code-example>

#### 非同步 observable 輔助函式

這個非同步 observable 是由一個 `asyncData` 輔助函式產生的。
`asyncData` 輔助函式是一個工具函式，你必須自己撰寫，或從範例程式碼複製這一個。

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-data"
  header="testing/async-observable-helpers.ts">
</code-example>

這個輔助函式的 observable 會在 JavaScript 引擎的下一輪中發出 `data` 值。

[RxJS `defer()` 運算子](http://reactivex.io/documentation/operators/defer.html) 會傳回一個 observable。
它接受一個傳回 promise 或 observable 的工廠函式。
當有東西訂閱 _defer_ 的 observable 時，它會將訂閱者加入以該工廠建立的新 observable。

`defer()` 運算子將 `Promise.resolve()` 轉換成一個新的 observable，它像 `HttpClient` 一樣，發出一次後即完成。
訂閱者在收到資料值之後會被取消訂閱。

有一個類似的輔助函式用於產生非同步錯誤。

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-error">
</code-example>

#### 更多非同步測試

現在 `getQuote()` spy 傳回的是非同步 observable，你的大多數測試也必須是非同步的。

以下是一個 `fakeAsync()` 測試，展示你在真實世界中預期的資料流。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="fake-async-test">
</code-example>

請注意，名言元素在 `ngOnInit()` 之後顯示的是佔位值（`'...'`）。
第一句名言尚未送達。

若要將第一句名言從 observable 中排出，你呼叫 `tick()`。
然後呼叫 `detectChanges()`，告訴 Angular 更新畫面。

接著你就可以斷言名言元素顯示預期的文字。

{@a async}

#### 使用 _async()_ 的非同步測試

若要使用 `async()` 功能，你需要匯入 `zone-testing`，詳情請參閱[設定指南](guide/setup#附錄：使用-fakeasyncasync-進行測試)。

`fakeAsync()` 公用程式函式有一些限制。
尤其要注意的是，如果測試主體發出 `XHR` 呼叫，它就無法運作。

`XHR` 呼叫在測試中很少見，所以你通常可以繼續使用 `fakeAsync()`。
但如果你真的需要呼叫 `XHR`，你會想了解 `async()`。

<div class="alert is-helpful">

`TestBed.compileComponents()` 方法（參閱[下文](#compile-components)）會呼叫 `XHR`，在「即時」編譯期間讀取外部範本與 css 檔案。
撰寫測試時，請以 `async()` 公用程式呼叫 `compileComponents()`。

</div>

以下是先前的 `fakeAsync()` 測試，以 `async()` 公用程式改寫後的版本。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-test">
</code-example>

`async()` 公用程式會安排測試者的程式碼在一個特殊的*非同步測試區域*中執行，藉此隱藏一些非同步樣板程式碼。
你不需要把 Jasmine 的 `done()` 傳入測試並呼叫 `done()`，因為它在 promise 或 observable 回呼中是 `undefined`。

但測試的非同步本質，會從對 `fixture.whenStable()` 的呼叫中顯露出來，它打破了線性的控制流。

在 `async()` 中使用 `setInterval()` 這類 `intervalTimer()` 時，記得在測試後以 `clearInterval()` 取消計時器，否則 `async()` 永遠不會結束。

{@a when-stable}

#### _whenStable_

測試必須等待 `getQuote()` observable 發出下一句名言。
它不呼叫 `tick()`，而是呼叫 `fixture.whenStable()`。

`fixture.whenStable()` 傳回一個 promise，在 JavaScript 引擎的工作佇列變空時解析。
在這個範例中，當 observable 發出第一句名言時，工作佇列就會變空。

測試在 promise 回呼中恢復，該回呼呼叫 `detectChanges()`，以預期的文字更新名言元素。

{@a jasmine-done}

#### Jasmine _done()_

雖然 `async()` 與 `fakeAsync()` 函式大幅簡化了 Angular 非同步測試，你仍然可以退回到傳統技巧，傳給 `it` 一個接受 [`done` 回呼](https://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support) 的函式。

你不能在 `async()` 或 `fakeAsync()` 函式中呼叫 `done()`，因為 `done parameter` 是 `undefined`。

現在你要負責串連 promise、處理錯誤，並在適當的時機呼叫 `done()`。

使用 `done()` 撰寫測試函式，比 `async()` 和 `fakeAsync()` 更繁瑣。
但當程式碼涉及像 `setInterval` 這類 `intervalTimer()` 時，偶爾有其必要。

以下是上一個測試的另外兩個版本，以 `done()` 撰寫。
第一個版本訂閱元件的 `quote` 屬性向範本公開的 `Observable`。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="quote-done-test" linenums="false">
</code-example>

RxJS 的 `last()` 運算子會在完成之前發出 observable 的最後一個值，那將是測試名言。
`subscribe` 回呼呼叫 `detectChanges()`，以與稍早的測試相同的方式，用測試名言更新名言元素。

在某些測試中，你比較在意的是注入的服務方法如何被呼叫、傳回了什麼值，而不是螢幕上出現了什麼。

服務 spy，例如假 `TwainService` 的 `qetQuote()` spy，可以給你這些資訊，並對檢視的狀態做出斷言。

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy-done-test" linenums="false">
</code-example>

<hr>

{@a marble-testing}
### 元件 marble 測試

先前的 `TwainComponent` 測試使用 `asyncData` 與 `asyncError` 公用程式，模擬了 `TwainService` 的非同步 observable 回應。

這些是簡短、簡單的函式，你可以自己撰寫。
不幸的是，對許多常見情境來說，它們太過簡單。
observable 經常會發出多次，可能在一段顯著的延遲之後。
元件可能要協調多個 observable，它們的值與錯誤序列彼此重疊。

**RxJS marble 測試**是測試 observable 情境（無論簡單或複雜）的好方法。
你可能看過用來說明 observables 如何運作的 [marble 圖](http://rxmarbles.com)。
Marble 測試使用類似的 marble 語言，在你的測試中指定 observable 串流與期望。

以下範例以 marble 測試重訪兩個 `TwainComponent` 測試。

先安裝 `jasmine-marbles` npm 套件。
然後匯入你需要的符號。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="import-marbles"
  header="app/twain/twain.component.marbles.spec.ts (import marbles)" linenums="false">
</code-example>

以下是取得名言的完整測試：

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="get-quote-test" linenums="false">
</code-example>

請注意，Jasmine 測試是同步的。
沒有 `fakeAsync()`。
Marble 測試使用測試排程器，在同步測試中模擬時間的流逝。

Marble 測試的美妙之處，在於 observable 串流的視覺化定義。
這個測試定義了一個 [*cold* observable](#cold-observable)，它等待三個 [frame](#marble-frame)（`---`）、發出一個值（`x`），然後完成（`|`）。
在第二個引數中，你把值標記（`x`）對應到發出的值（`testQuote`）。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-quote-marbles" linenums="false">
</code-example>

marble 函式庫會建構對應的 observable，測試將它設為 `getQuote` spy 的傳回值。

當你準備啟動 marble observables 時，你告訴 `TestScheduler` 像這樣 *flush* 它已準備好的任務佇列。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-scheduler-flush" linenums="false">
</code-example>

這個步驟的目的，類似於稍早 `fakeAsync()` 與 `async()` 範例中的 `tick()` 與 `whenStable()`。
測試的其餘部分與那些範例相同。

#### Marble 錯誤測試

以下是 `getQuote()` 錯誤測試的 marble 測試版本。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-test" linenums="false">
</code-example>

它仍然是非同步測試，呼叫 `fakeAsync()` 與 `tick()`，因為元件本身在處理錯誤時呼叫了 `setTimeout()`。

看一下 marble observable 的定義。

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-marbles" linenums="false">
</code-example>

這是一個 _cold_ observable，等待三個 frame 後發出一個錯誤，hash（`#`）字元表示在第三個引數中指定的錯誤時機。
第二個引數是 null，因為這個 observable 從不發出值。

#### 了解 marble 測試

{@a marble-frame}
A _marble frame_ 是測試時間的一個虛擬單位。
每個符號（`-`、`x`、`|`、`#`）都標記著一個 frame 的流逝。

{@a cold-observable}
A _cold_ observable 在你訂閱它之前，不會產生任何值。
你的應用程式中的 observable 大多是 cold 的。
所有 [_HttpClient_](guide/http) 方法都會回傳 cold observables。

A _hot_ observable 在你訂閱它之前就已經在產生值了。
[_Router.events_](api/router/Router#events) observable
會回報路由器活動，是一個 _hot_ observable。

RxJS marble 測試是一個內容豐富的主題，超出本指南的範圍。
你可以在網路上了解它，從
[official documentation](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md)開始。

<hr>

{@a component-with-input-output}

### 具有輸入與輸出的元件

具有輸入與輸出的元件通常出現在宿主元件的檢視範本內部。
宿主使用屬性繫結來設定輸入屬性，並使用事件繫結來監聽輸出屬性所引發的事件。

測試的目標是驗證這類繫結是否如預期運作。
測試應該設定輸入值，並監聽輸出事件。

`DashboardHeroComponent` 是扮演這個角色的一個小範例元件。
它顯示由 `DashboardComponent` 提供的一位英雄。
點選該英雄會告訴 `DashboardComponent`，使用者已選取該英雄。

`DashboardHeroComponent` 像這樣內嵌在 `DashboardComponent` 範本中：

<code-example
  path="testing/src/app/dashboard/dashboard.component.html"
  region="dashboard-hero"
  header="app/dashboard/dashboard.component.html (excerpt)" linenums="false">
</code-example>

`DashboardHeroComponent` 出現在一個 `*ngFor` 重複器中，該重複器將每個元件的 `hero` 輸入屬性設為迴圈的值，並監聽元件的 `selected` 事件。

以下是元件的完整定義：

{@a dashboard-hero-component}

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="component"
  header="app/dashboard/dashboard-hero.component.ts (component)" linenums="false">
</code-example>

雖然測試這麼簡單的元件本身沒有多少價值，但知道怎麼做還是有用的。
請使用下列方法之一：

- 以 `DashboardComponent` 使用它的方式來測試它。
- 以獨立元件的方式來測試它。
- 以 `DashboardComponent` 替代品使用它的方式來測試它。

快速看一眼 `DashboardComponent` 的建構函式，就會讓人打消第一個方法的念頭：

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)" linenums="false">
</code-example>

`DashboardComponent` 相依於 Angular 路由器與 `HeroService`。
你可能必須把兩者都換成測試替身，那是很多工作。
路由器看起來特別具有挑戰性。

<div class="alert is-helpful">

[下面的討論](#路由元件)涵蓋了需要路由器的元件之測試。

</div>

眼前的目標是測試 `DashboardHeroComponent`，而不是 `DashboardComponent`，所以請試試第二與第三個選項。

{@a dashboard-standalone}

#### 以獨立方式測試 _DashboardHeroComponent_

以下是規格檔案設定的核心部分。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="setup"
  header="app/dashboard/dashboard-hero.component.spec.ts (setup)" linenums="false">
</code-example>

請注意，設定程式碼如何將測試英雄（`expectedHero`）指派給元件的 `hero` 屬性，
模擬 `DashboardComponent` 在其 repeater 中使用屬性繫結來設定它的方法。

下列測試驗證英雄名稱是否透過繫結傳遞到範本中。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="name-test">
</code-example>

由於[範本](#dashboard-hero-component)會讓英雄名稱通過 Angular `UpperCasePipe`，測試必須以轉成大寫的名稱來比對元素的值。

<div class="alert is-helpful">

這個小型測試示範了 Angular 測試如何以低成本驗證元件的視覺呈現&mdash;這是
[元件類別測試](#元件類別測試)無法做到的&mdash;而且
不需要訴諸慢得多也複雜得多的端對端測試。

</div>

#### 點選

點選英雄應該引發一個 `selected` 事件，讓宿主元件（推測是 `DashboardComponent`）能聽到：

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test">
</code-example>

元件的 `selected` 屬性回傳一個 `EventEmitter`，對使用者而言，它看起來就像一個 RxJS 的同步 `Observable`。
測試_明確地_訂閱它，就像宿主元件_隱含地_做的那樣。

如果元件如預期運作，點選英雄的元素應該會讓元件的 `selected` 屬性發出 `hero` 物件。

測試透過它對 `selected` 的訂閱偵測到該事件。

{@a trigger-event-handler}

#### _triggerEventHandler_

上一個測試中的 `heroDe` 是一個 `DebugElement`，代表英雄的 `<div>`。

它具有 Angular 的屬性與方法，抽象化了與原生元素的互動。
這個測試以「click」事件名稱呼叫 `DebugElement.triggerEventHandler`。
「click」事件繫結會以呼叫 `DashboardHeroComponent.click()` 來回應。

Angular 的 `DebugElement.triggerEventHandler` 可以依_事件名稱_引發_任何資料繫結事件_。
第二個參數是傳給處理常式的事件物件。

測試以 `null` 事件物件觸發了一個 "click" 事件。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler">
</code-example>

測試假設（在這個案例中是正確的）執行階段的
事件處理常式&mdash;也就是元件的 `click()` 方法&mdash;不在意事件物件。

<div class="alert is-helpful">

其他處理常式就沒這麼寬容了。
舉例來說，`RouterLink` 指令預期事件物件帶有一個 `button` 屬性，用來識別點選期間按下了哪個滑鼠按鈕（如果有的話）。
如果事件物件缺失，`RouterLink` 指令會擲出錯誤。

</div>

#### 點選元素

下列替代測試呼叫原生元素自己的 `click()` 方法，這對_這個元件_來說完全沒問題。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-2">
</code-example>

{@a click-helper}

#### _click()_ 輔助函式

點選按鈕、錨點或任意 HTML 元素，是常見的測試工作。

將_觸發點選_的過程封裝在像下面的 `click()` 函式這樣的輔助函式中，讓這件事保持一致且簡單：

<code-example
  path="testing/src/testing/index.ts"
  region="click-event"
  header="testing/index.ts (click helper)" linenums="false">
</code-example>

第一個參數是_要點選的元素_。如果你想的話，可以傳入
自訂事件物件作為第二個參數。預設值是一個（部分的）
<a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button">左鍵滑鼠事件物件</a>，
許多處理常式（包括 `RouterLink` 指令）都接受它。

<div class="alert is-important">

`click()` 輔助函式**不是** Angular 測試公用程式之一。
它是定義在_本指南範例程式碼_中的函式。
所有的範例測試都使用它。
如果你喜歡它，就將它加入你自己的輔助函式收藏中。

</div>

以下是上一個測試以點選輔助函式改寫後的版本。

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-3"
  header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)">
</code-example>

<hr>

{@a component-inside-test-host}

### 位於測試宿主中的元件

前面的測試自己扮演了宿主 `DashboardComponent` 的角色。
但當 `DashboardHeroComponent` 正確地資料繫結到一個宿主元件時，它能正常運作嗎？

你可以用實際的 `DashboardComponent` 來測試。
但這麼做可能需要很多設定，特別是當它的範本具有一個 `*ngFor` 重複器、其他元件、版面 HTML、額外的繫結，一個注入多個服務的建構函式，而且它一開始就與這些服務互動時。

想像一下，要費多大的力氣來排除這些干擾，只為了證明一個用像這樣的*測試宿主*就能令人滿意地達成的論點：

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host"
  header="app/dashboard/dashboard-hero.component.spec.ts (test host)"
  linenums="false">
</code-example>

這個測試宿主以 `DashboardComponent` 會用的方式繫結到 `DashboardHeroComponent`，但沒有 `Router`、`HeroService` 或 `*ngFor` 重複器的噪音。

測試宿主以它的測試英雄設定元件的 `hero` 輸入屬性。
它以自己的 `onSelected` 處理常式繫結元件的 `selected` 事件，該處理常式會將發出的英雄記錄在它的 `selectedHero` 屬性中。

稍後，測試將能輕鬆檢查 `selectedHero`，驗證 `DashboardHeroComponent.selected` 事件是否發出了預期的英雄。

_測試宿主_測試的設定與獨立測試的設定相似：

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup" header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" linenums="false"></code-example>

這個測試模組設定展示了三個重要的差異：

1. 它_宣告_了 `DashboardHeroComponent` 與 `TestHostComponent` 兩者。
1. 它_建立_了 `TestHostComponent`，而不是 `DashboardHeroComponent`。
1. `TestHostComponent` 以繫結設定 `DashboardHeroComponent.hero`。

`createComponent` 傳回的 `fixture` 持有的是 `TestHostComponent` 的實例，而不是 `DashboardHeroComponent` 的實例。

建立 `TestHostComponent` 的副作用是建立了一個 `DashboardHeroComponent`，因為後者出現在前者的範本中。
對英雄元素的查詢（`heroEl`）仍然能在測試 DOM 中找到它，儘管它在元素樹中的深度比之前更大。

這些測試本身與獨立版本幾乎完全相同：

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host-tests"
  header="app/dashboard/dashboard-hero.component.spec.ts (test-host)" linenums="false">
</code-example>

只有 selected 事件測試不同。
它確認所選的 `DashboardHeroComponent` 英雄確實透過事件繫結一路傳遞到宿主元件。

<hr>

{@a routing-component}

### 路由元件

_路由元件_ 是告訴 `Router` 導航到另一個元件的元件。
`DashboardComponent` 是一個_路由元件_，因為使用者可以點選儀表板上的某個_英雄按鈕_，導航到 `HeroDetailComponent`。

路由是相當複雜的。
測試 `DashboardComponent` 之所以看起來令人卻步，一部分原因是它涉及到與 `HeroService` 一起注入的 `Router`。

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)" linenums="false">
</code-example>

用 spy 替身模擬 `HeroService` 是一個[熟悉的故事](#component-with-async-service)。
但 `Router` 有一個複雜的 API，而且與其他服務和應用程式先決條件糾纏在一起。
模擬它會不會很困難呢？

幸好，在這個例子中並不會，因為 `DashboardComponent` 並沒有用 `Router` 做太多事

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="goto-detail"
  header="app/dashboard/dashboard.component.ts (goToDetail)">
</code-example>

這種情況在_路由元件_中經常出現。
原則上，你測試的是元件，而不是路由器，你只在乎元件是否在給定條件下以正確的地址導航。

為_這個元件_測試套件提供一個路由器 spy 替身，恰好和提供一個 `HeroService` spy 替身一樣容易。

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="router-spy"
  header="app/dashboard/dashboard.component.spec.ts (spies)" linenums="false">
</code-example>

下列測試點選顯示的英雄，並確認 `Router.navigateByUrl` 以預期的 url 被呼叫。

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="navigate-test"
  header="app/dashboard/dashboard.component.spec.ts (navigate test)" linenums="false">
</code-example>

{@a routed-component-w-param}

### 路由目標元件

_路由目標元件_ 是 `Router` 導航的目的地。
它可能比較難測試，尤其是當通往該元件的路由_包含參數_時。
`HeroDetailComponent` 是一個_路由目標元件_，是這類路由的目的地。

當使用者點選一個 _Dashboard_ 英雄時，`DashboardComponent` 會告訴 `Router` 導航到 `heroes/:id`。
`:id` 是一個路由參數，其值是要編輯之英雄的 `id`。

`Router` 將該 URL 比對到通往 `HeroDetailComponent` 的路由。
它會建立一個帶有路由資訊的 `ActivatedRoute` 物件，並將它注入到 `HeroDetailComponent` 的新實例中。

以下是 `HeroDetailComponent` 的建構函式：

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ctor" header="app/hero/hero-detail.component.ts (constructor)" linenums="false"></code-example>

`HeroDetail` 元件需要 `id` 參數，才能使用 `HeroDetailService` 取得對應的英雄。
元件必須從 `ActivatedRoute.paramMap` 屬性取得 `id`，而該屬性是一個 `Observable`。

它不能只參照 `ActivatedRoute.paramMap` 的 `id` 屬性。
元件必須_訂閱_ `ActivatedRoute.paramMap` observable，並為 `id` 在它的生命週期中變更做好準備。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init" header="app/hero/hero-detail.component.ts (ngOnInit)" linenums="false"></code-example>

<div class="alert is-helpful">

[Router](guide/router#route-parameters) 指南更詳細地涵蓋了 `ActivatedRoute.paramMap`。

</div>

測試可以探索 `HeroDetailComponent` 如何回應不同的 `id` 參數值，方法是操縱注入到元件建構函式中的 `ActivatedRoute`。

你已經知道如何對 `Router` 與資料服務使用 spy 替身。

你會對 `ActivatedRoute` 採取不同的方法，因為

- `paramMap` 傳回一個 `Observable`，在測試期間可以發出不止一個值。
- 你需要路由器輔助函式 `convertToParamMap()` 來建立 `ParamMap`。
- 其他_路由目標元件_測試需要 `ActivatedRoute` 的測試替身。

這些差異說明了為什麼需要一個可重複使用的替身類別。

#### _ActivatedRouteStub_

下列 `ActivatedRouteStub` 類別可作為 `ActivatedRoute` 的測試替身。

<code-example
  path="testing/src/testing/activated-route-stub.ts"
  region="activated-route-stub"
  header="testing/activated-route-stub.ts (ActivatedRouteStub)" linenums="false">
</code-example>

考慮將這類輔助函式放在與 `app` 資料夾同層的 `testing` 資料夾中。
本範例將 `ActivatedRouteStub` 放在 `testing/activated-route-stub.ts`。

<div class="alert is-helpful">

考慮使用 [*marble 測試函式庫*](#marble-testing) 撰寫功能更強大的這個替身類別版本。

</div>

{@a tests-w-test-double}

#### 使用 _ActivatedRouteStub_ 進行測試

以下是一個測試，示範當觀察到的 `id` 指向一位現有的英雄時，元件的行為：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id" header="app/hero/hero-detail.component.spec.ts (existing id)" linenums="false"></code-example>

<div class="alert is-helpful">

`createComponent()` 方法與 `page` 物件在[下文](#page-object)中討論。
先憑直覺理解即可。

</div>

當找不到該 `id` 時，元件應該重新導向到 `HeroListComponent`。

測試套件的設定提供了[前文所述](#路由元件)的相同路由器 spy 替身，它會監視路由器，但不會真的導航。

這個測試預期元件會嘗試導航到 `HeroListComponent`。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id" header="app/hero/hero-detail.component.spec.ts (bad id)" linenums="false"></code-example>

雖然這個應用程式沒有一條省略 `id` 參數、通往 `HeroDetailComponent` 的路由，但將來某天可能會加入這樣一條路由。
當沒有 `id` 時，元件應該做一些合理的事。

在這個實作中，元件應該建立並顯示一位新英雄。
新英雄的 `id=0`，且 `name` 為空白。
這個測試確認元件如預期運作：

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="route-no-id"
  header="app/hero/hero-detail.component.spec.ts (no id)" linenums="false">
</code-example>

<hr>

### 巢狀元件測試

元件範本經常有巢狀元件，而這些元件的範本可能又包含更多元件。

元件樹可能非常深，而且大多數時候，巢狀元件在測試樹頂端元件時並不扮演任何角色。

舉例來說，`AppComponent` 會顯示一個導覽列，其中有錨點與它們的 `RouterLink` 指令。

<code-example
  path="testing/src/app/app.component.html"
  header="app/app.component.html" linenums="false">
</code-example>

雖然 `AppComponent` _類別_ 是空的，你可能會想撰寫單元測試，確認這些連結正確地接上 `RouterLink` 指令，或許是基於[下文](#why-stubbed-routerlink-tests)所解釋的理由。

若要驗證這些連結，你不需要 `Router` 進行導航，也不需要 `<router-outlet>` 來標示 `Router` 插入_路由目標元件_的位置。

`BannerComponent` 與 `WelcomeComponent`（由 `<app-banner>` 與 `<app-welcome>` 表示）同樣不相關。

然而，任何在 DOM 中建立 `AppComponent` 的測試，也會建立這三個元件的實例，而且如果你放任這件事發生，你就必須設定 `TestBed` 來建立它們。

如果你疏於宣告它們，Angular 編譯器將無法辨識 `AppComponent` 範本中的 `<app-banner>`、`<app-welcome>` 與 `<router-outlet>` 標籤，並會擲出錯誤。

如果你宣告的是真實元件，你還必須宣告_它們的_巢狀元件，並為樹中_任何_元件注入的_所有_服務做準備。

只是為了回答幾個關於連結的簡單問題，這樣的功夫太多了。

本節描述兩種將設定工作降到最低的技巧。
你可以單獨使用它們，或合併使用，讓自己專注於測試主要元件。

{@a stub-component}

##### 為不需要的元件建立替身

在第一種技巧中，你建立並宣告在測試中幾乎不扮演任何角色的元件與指令的替身版本。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="component-stubs"
  header="app/app.component.spec.ts (stub declaration)" linenums="false">
</code-example>

替身的選擇器與對應真實元件的選擇器相符。
但它們的範本與類別是空的。

接著，在 `TestBed` 設定中宣告它們，與需要用真實版本的元件、指令和管道並列。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="testbed-stubs"
  header="app/app.component.spec.ts (TestBed stubs)" linenums="false">
</code-example>

`AppComponent` 是測試主體，所以你當然宣告它的真實版本。

`RouterLinkDirectiveStub`（在[後面](#routerlink)說明）是真實 `RouterLink` 的測試版本，可協助進行連結測試。

其餘的都是替身。

{@a no-errors-schema}

#### _NO_ERRORS_SCHEMA_

在第二種方法中，將 `NO_ERRORS_SCHEMA` 加入 `TestBed.schemas` 中繼資料。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="no-errors-schema"
  header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" linenums="false">
</code-example>

`NO_ERRORS_SCHEMA` 告訴 Angular 編譯器忽略無法辨識的元素與屬性。

編譯器能辨識 `<app-root>` 元素與 `routerLink` 屬性，因為你在 `TestBed` 設定中宣告了對應的 `AppComponent` 與 `RouterLinkDirectiveStub`。

但當編譯器遇到 `<app-banner>`、`<app-welcome>` 或 `<router-outlet>` 時，它不會擲出錯誤。
它只是將它們渲染為空標籤，瀏覽器會忽略它們。

你不再需要替身元件了。

#### 兩種技巧合併使用

這些是_淺層元件測試_的技巧，
會如此命名，是因為它們將元件的視覺介面縮減到只剩範本中對測試重要的元素。

`NO_ERRORS_SCHEMA` 方法是兩者中較容易的一個，但不要過度使用它。

`NO_ERRORS_SCHEMA` 也會讓編譯器無法告訴你，你不慎遺漏或拼錯的元件與屬性。
你可能會浪費好幾個小時追查編譯器本可在一瞬間抓到的幽靈錯誤。

_替身元件_ 方法還有另一個優點。
雖然_這個_範例中的替身是空的，但如果你的測試需要以某種方式與它們互動，你可以給它們精簡過的範本與類別。

實務上，你會在同一個設定中合併這兩種技巧，如這個範例所示。

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="mixed-setup"
  header="app/app.component.spec.ts (mixed setup)" linenums="false">
</code-example>

Angular 編譯器為 `<app-banner>` 元素建立 `BannerComponentStub`，並將 `RouterLinkStubDirective` 套用到帶有 `routerLink` 屬性的錨點上，但它會忽略 `<app-welcome>` 與 `<router-outlet>` 標籤。

<hr>

{@a routerlink}
### 具有 _RouterLink_ 的元件

真實的 `RouterLinkDirective` 相當複雜，而且與 `RouterModule` 的其他元件與指令糾纏在一起。
它需要具挑戰性的設定，才能模擬並在測試中使用。

本範例程式碼中的 `RouterLinkDirectiveStub` 以一個替代版本取代真實指令，設計用來驗證在 `AppComponent` 範本中看到的那種錨點標籤接線方式。

<code-example
  path="testing/src/testing/router-link-directive-stub.ts"
  region="router-link"
  header="testing/router-link-directive-stub.ts (RouterLinkDirectiveStub)" linenums="false">
</code-example>

繫結到 `[routerLink]` 屬性的 URL 會流入指令的 `linkParams` 屬性。

`HostListener` 將宿主元素（`AppComponent` 中的 `<a>` 錨點元素）的點選事件，接上替身指令的 `onClick` 方法。

點選錨點應該觸發 `onClick()` 方法，它會設定替身那個表明身分的 `navigatedTo` 屬性。
測試會檢查 `navigatedTo`，確認點選錨點有設定預期的路由定義。

<div class="alert is-helpful">

路由器是否已正確設定、能以該路由定義導航，那是另一組測試要回答的問題。

</div>

{@a by-directive}
{@a inject-directive}

#### _By.directive_ 與注入的指令

再多一點設定，就能觸發初始資料繫結，並取得導覽連結的參照：

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="test-setup"
  header="app/app.component.spec.ts (test setup)" linenums="false">
</code-example>

有三個特別值得注意的點：

1.  你可以使用 `By.directive` 定位帶有附加指令的錨點元素。

1.  查詢會傳回圍繞相符元素的 `DebugElement` 封裝。

1.  每個 `DebugElement` 都公開一個相依性注入器，帶有附加到該元素上的該指令的特定執行個體。

要驗證的 `AppComponent` 連結如下：

<code-example
  path="testing/src/app/app.component.html"
  region="links"
  header="app/app.component.html (navigation links)" linenums="false">
</code-example>

{@a app-component-tests}

以下是一些測試，確認這些連結已如預期地接上 `routerLink` 指令：

<code-example path="testing/src/app/app.component.spec.ts" region="tests" header="app/app.component.spec.ts (selected tests)" linenums="false"></code-example>

<div class="alert is-helpful">

_這個範例_中的「點選」測試具有誤導性。
它測試的是 `RouterLinkDirectiveStub`，而不是_元件_。
這是指令替身常見的缺點。

它在本指南中有正當的用途。
它示範如何在不動用完整的路由器機制下，找到一個 `RouterLink` 元素、點選它，並檢查一個結果。
這是一項你可能需要的技能，用來測試更精密的元件：當使用者點選連結時，那種元件會變更顯示、重新計算參數，或重新安排導航選項。

</div>

{@a why-stubbed-routerlink-tests}

#### 這些測試有什麼用？

使用替身的 `RouterLink` 測試可以確認：一個帶有連結與出口的元件已正確設定、該元件擁有它應該有的連結，而且它們全都指向預期的方向。
這些測試並不關心，當使用者點選連結時，應用程式是否能成功導航到目標元件。

對於這類有限的測試目標，將 RouterLink 與 RouterOutlet 換成替身是最好的選擇。
仰賴真實的路由器會讓它們變得脆弱。
它們可能因為與元件無關的原因而失敗。
例如，一個導航守衛可能會阻止未經授權的使用者造訪 `HeroListComponent`。
那不是 `AppComponent` 的錯，而且對該元件做任何變更都無法修好那個失敗的測試。

_另一組_測試則可以探索：在使用者是否已完成身分驗證與取得授權等會影響守衛的條件存在時，應用程式是否如預期導航。

<div class="alert is-helpful">

未來的一次指南更新會說明如何使用 `RouterTestingModule` 撰寫這類測試。

</div>

<hr>

{@a page-object}

### 使用 _page_ 物件

`HeroDetailComponent` 是一個簡單的檢視，包含一個標題、兩個英雄欄位與兩個按鈕。

<figure>
  <img src='generated/images/guide/testing/hero-detail.component.png' alt="HeroDetailComponent 運作畫面">
</figure>

但即使是這麼簡單的表單，範本也有不少複雜度。

<code-example
  path="testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html" linenums="false">
</code-example>

對元件進行測試的測試需要 ……

- 等到英雄到達，元素才出現在 DOM 中。
- 標題文字的參照。
- 名稱輸入框的參照，以便檢查並設定它。
- 兩個按鈕的參照，以便它們可以點選按鈕。
- 元件與路由器某些方法的 spy。

即使是這麼小的一個表單，也可能產生一團混亂的條件式設定與 CSS 元素選取，令人備受折磨。

用一個 `Page` 類別來駕馭這份複雜度：它負責存取元件屬性，並封裝設定這些屬性的邏輯。

以下就是為 `hero-detail.component.spec.ts` 準備的這樣一個 `Page` 類別

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="page"
  header="app/hero/hero-detail.component.spec.ts (Page)" linenums="false">
</code-example>

現在，用於操控與檢查元件的重要掛鉤都整齊地組織起來，可以從 `Page` 的實例存取。

`createComponent` 方法會建立一個 `page` 物件，並在 `hero` 到達後填補其中的空白。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="create-component"
  header="app/hero/hero-detail.component.spec.ts (createComponent)" linenums="false">
</code-example>

較早一節中的 [_HeroDetailComponent_ 測試](#tests-w-test-double) 示範了 `createComponent` 與 `page` 如何讓測試保持簡短且_切中主題_。
沒有干擾：不需要等待 promise 解析，也不需要在 DOM 中搜尋要比較的元素值。

以下再多看幾個 `HeroDetailComponent` 測試，來強化這個重點。

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="selected-tests"
  header="app/hero/hero-detail.component.spec.ts (selected tests)" linenums="false">
</code-example>

<hr>

{@a compile-components}
### 呼叫 _compileComponents()_
<div class="alert is-helpful">

如果你_只_透過 CLI 的 `ng test` 指令執行測試，可以忽略本節，因為 CLI 會在執行測試前先編譯應用程式。

</div>

如果你在**非 CLI 環境**中執行測試，測試可能會失敗，並出現像這樣的訊息：

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

問題的根源在於，參與測試的元件中至少有一個指定了外部範本或 CSS 檔案，如下列版本的 `BannerComponent` 所示。

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  header="app/banner/banner-external.component.ts (external template & css)" linenums="false">
</code-example>

當 `TestBed` 嘗試建立該元件時，測試就會失敗。

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="configure-and-create"
  header="app/banner/banner.component.spec.ts (setup that fails)"
  avoid linenums="false">
</code-example>

回想一下，應用程式尚未編譯。
因此當你呼叫 `createComponent()` 時，`TestBed` 會隱含地進行編譯。

當原始碼在記憶體中時，這不是問題。
但 `BannerComponent` 需要外部檔案，編譯器必須從檔案系統讀取它們，而這本質上是一個_非同步_操作。

如果放任 `TestBed` 繼續，測試會在編譯器完成之前就執行並莫名其妙地失敗。

那則搶先發出的錯誤訊息就是在告訴你，要用 `compileComponents()` 明確地編譯。

#### _compileComponents()_ 是非同步的

你必須在非同步測試函式中呼叫 `compileComponents()`。

<div class="alert is-critical">

如果你疏於讓測試函式成為非同步
（例如，忘了使用如下所述的 `async()`），
你會看到這則錯誤訊息

<code-example language="sh" class="code-shell" hideCopy>
Error: ViewDestroyedError: Attempt to use a destroyed view
</code-example>

</div>

一個典型的做法是將設定邏輯拆成兩個獨立的 `beforeEach()` 函式：

1.  一個非同步的 `beforeEach()`，負責編譯這些元件
1.  一個同步的 `beforeEach()`，負責執行其餘的設定。

若要遵循此模式，請將 `async()` 輔助函式與其他測試符號一起匯入。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="import-async">
</code-example>

#### 非同步的 _beforeEach_

第一個非同步 `beforeEach` 這樣寫：

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="async-before-each"
  header="app/banner/banner-external.component.spec.ts (async beforeEach)" linenums="false">
</code-example>

`async()` 輔助函式接受一個沒有參數的函式，函式主體就是設定邏輯。

`TestBed.configureTestingModule()` 方法會傳回 `TestBed` 類別，因此你可以鏈式呼叫其他 `TestBed` 靜態方法，例如 `compileComponents()`。

在這個範例中，`BannerComponent` 是唯一要編譯的元件。
其他範例會以多個元件設定測試模組，也可能匯入含有更多元件的應用程式模組。
其中任何一個都可能需要外部檔案。

`TestBed.compileComponents` 方法會以非同步方式編譯測試模組中設定的所有元件。

<div class="alert is-important">

在呼叫 `compileComponents()` 之後，請勿重新設定 `TestBed`。

</div>

呼叫 `compileComponents()` 會關閉目前的 `TestBed` 執行個體，使其無法再進一步設定。
你不能再呼叫任何 `TestBed` 設定方法，不能呼叫 `configureTestingModule()`，
也不能呼叫任何 `override...` 方法。如果你嘗試這樣做，`TestBed` 會擲出錯誤。

讓 `compileComponents()` 成為呼叫 `TestBed.createComponent()` 之前的最後一步。

#### 同步的 _beforeEach_

第二個同步的 `beforeEach()` 包含其餘的設定步驟，包括建立元件，以及查詢要檢查的元素。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="sync-before-each"
  header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)" linenums="false">
</code-example>

你可以放心，測試執行器會等第一個非同步 `beforeEach` 完成後，才呼叫第二個。

#### 合併後的設定

你可以將這兩個 `beforeEach()` 函式合併成單一個非同步的 `beforeEach()`。

`compileComponents()` 方法會傳回一個 promise，因此你可以把同步程式碼移到 `then(...)` 回呼中，在編譯_之後_執行同步設定工作。

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="one-before-each"
  header="app/banner/banner-external.component.spec.ts (one beforeEach)" linenums="false">
</code-example>

#### _compileComponents()_ 是無害的

在不需要的時候呼叫 `compileComponents()` 也沒有壞處。

CLI 產生的元件測試檔案會呼叫 `compileComponents()`，儘管執行 `ng test` 時從來不需要它。

本指南中的測試只在必要時才呼叫 `compileComponents`。

<hr>

{@a import-module}

### 以模組匯入進行設定

先前的元件測試是像這樣用一些 `declarations` 來設定測試模組的：

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="config-testbed"
  header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)">
</code-example>

`DashboardComponent` 很簡單。
它不需要任何協助。
但更複雜的元件通常相依於其他元件、指令、管道與提供者，而這些也必須加入測試模組。

幸好，`TestBed.configureTestingModule` 的參數與傳給 `@NgModule` 裝飾器的中繼資料相對應，也就是說，你同樣可以指定 `providers` 與 `imports`。

`HeroDetailComponent` 儘管體積小、結構簡單，卻需要很多協助。
除了預設測試模組 `CommonModule` 提供的支援之外，它還需要：

- `FormsModule` 中的 `NgModel` 及其同伴，以啟用雙向資料繫結。
- 來自 `shared` 資料夾的 `TitleCasePipe`。
- 路由器服務（這些測試正在為它們製作替身）。
- 英雄資料存取服務（也已製作替身）。

一種做法是像這個範例一樣，用個別的零件來設定測試模組：

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-forms-module"
  header="app/hero/hero-detail.component.spec.ts (FormsModule setup)" linenums="false">
</code-example>

<div class="alert is-helpful">

注意，這個 `beforeEach()` 是非同步的，而且會呼叫 `TestBed.compileComponents`，因為 `HeroDetailComponent` 有外部範本與 css 檔案。

如同在 [_Calling compileComponents()_](#compile-components) 中所解釋的，
這些測試可以在非 CLI 環境中執行，
在那裡 Angular 必須在瀏覽器中編譯它們。

</div>

#### 匯入共用模組

由於許多應用程式元件都需要 `FormsModule` 與 `TitleCasePipe`，開發者建立了一個 `SharedModule`，把這些以及其他經常需要的零件組合在一起。

測試設定也可以使用 `SharedModule`，如這個替代設定所示：

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-shared-module"
  header="app/hero/hero-detail.component.spec.ts (SharedModule setup)" linenums="false">
</code-example>

它稍微更緊湊、更小，import 陳述式也更少（未顯示）。

{@a feature-module-import}

#### 匯入功能模組

`HeroDetailComponent` 是 `HeroModule`[功能模組](guide/feature-modules)的一部分，該模組匯集了更多彼此相依的零件，包括 `SharedModule`。
試試像這樣匯入 `HeroModule` 的測試設定：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module" header="app/hero/hero-detail.component.spec.ts (HeroModule setup)" linenums="false"></code-example>

真是_簡潔俐落_。
只剩下 `providers` 中的_測試替身_。
連 `HeroDetailComponent` 的宣告都不見了。

事實上，如果你試圖宣告它，Angular 會擲出錯誤，因為 `HeroDetailComponent` 同時被宣告在 `HeroModule` 與 `TestBed` 建立的 `DynamicTestModule` 中。

<div class="alert is-helpful">

當模組內有許多彼此相依的關係、而且模組本身很小時（功能模組通常如此），匯入元件的功能模組可能是設定測試最簡單的方式。

</div>

<hr>

{@a component-override}

### 覆寫元件的提供者

`HeroDetailComponent` 提供了它自己的 `HeroDetailService`。

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="prototype" header="app/hero/hero-detail.component.ts (prototype)" linenums="false"></code-example>

你無法在 `TestBed.configureTestingModule` 的 `providers` 中為元件的 `HeroDetailService` 建立替身。
那些是_測試模組_的提供者，不是元件的。
它們把相依性注入器準備在 _fixture 層級_。

Angular 會用它_自己的_注入器建立元件，而該注入器是 fixture 注入器的_子_注入器。
它會把元件的提供者（在本例中是 `HeroDetailService`）註冊到這個子注入器。

測試無法從 fixture 注入器取得子注入器的服務。
`TestBed.configureTestingModule` 也無法設定它們。

Angular 一直以來建立的都是真實 `HeroDetailService` 的新實例！

<div class="alert is-helpful">

如果 `HeroDetailService` 自己向遠端伺服器發出 XHR 呼叫，這些測試可能會失敗或逾時。
也可能根本沒有遠端伺服器可以呼叫。

幸好，`HeroDetailService` 將遠端資料存取的責任委派給注入的 `HeroService`。

<code-example path="testing/src/app/hero/hero-detail.service.ts" region="prototype" header="app/hero/hero-detail.service.ts (prototype)" linenums="false"></code-example>

[先前的測試設定](#feature-module-import)將真實的 `HeroService` 換成 `TestHeroService`，由它攔截伺服器請求並偽造回應。

</div>

如果你沒那麼幸運呢？
如果偽造 `HeroService` 很困難呢？
如果 `HeroDetailService` 自己發出伺服器請求呢？

`TestBed.overrideComponent` 方法可以把元件的 `providers` 換成容易管理的_測試替身_，如下列設定變化所示：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override" header="app/hero/hero-detail.component.spec.ts (Override setup)" linenums="false"></code-example>

注意，`TestBed.configureTestingModule` 不再提供假的 `HeroService`，因為它[不需要了](#spy-stub)。

{@a override-component-method}

#### _overrideComponent_ 方法

聚焦於 `overrideComponent` 方法。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method" header="app/hero/hero-detail.component.spec.ts (overrideComponent)" linenums="false"></code-example>

它接受兩個引數：要覆寫的元件型別（`HeroDetailComponent`），以及一個覆寫中繼資料物件。
[覆寫中繼資料物件](#metadata-override-object)是一個泛型，定義如下：

<code-example format="." language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

中繼資料覆寫物件可以在中繼資料屬性中加入與移除元素，或完全重設那些屬性。
這個範例重設了元件的 `providers` 中繼資料。

型別參數 `T` 是你會傳給 `@Component` 裝飾器的中繼資料種類：

<code-example format="." language="javascript">
  selector?: string;
  template?: string;
  templateUrl?: string;
  providers?: any[];
  ...
</code-example>

{@a spy-stub}

#### 提供 _spy 替身_（_HeroDetailServiceSpy_）

這個範例將元件的 `providers` 陣列完全換成一個新陣列，其中包含一個 `HeroDetailServiceSpy`。

`HeroDetailServiceSpy` 是真實 `HeroDetailService` 的替身版本，它偽造了該服務所有必要的功能。
它既不注入也不委派給較低層級的 `HeroService`，因此不需要為後者提供測試替身。

相關的 `HeroDetailComponent` 測試會透過監控服務方法，來斷言 `HeroDetailService` 的方法有被呼叫。
因此，這個替身將它的方法實作為 spy：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy" header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" linenums="false"></code-example>

{@a override-tests}

#### 覆寫測試

現在，測試可以直接操控替身的 `testHero` 來控制元件的英雄，並確認服務方法有被呼叫。

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests" header="app/hero/hero-detail.component.spec.ts (override tests)" linenums="false"></code-example>

{@a more-overrides}

#### 更多覆寫

`TestBed.overrideComponent` 方法可以針對相同或不同的元件呼叫多次。
`TestBed` 也提供類似的 `overrideDirective`、`overrideModule` 與 `overridePipe` 方法，用來深入並取代這些其他類別的部分內容。

請自行探索這些選項與組合。

<hr>

{@a attribute-directive}

## 測試屬性指令

_屬性指令_會修改元素、元件或其他指令的行為。
它的名稱反映了指令的套用方式：作為宿主元素上的一個屬性。

範例應用程式的 `HighlightDirective` 會根據資料繫結的顏色或預設顏色（lightgray），設定元素的背景顏色。
它也會將元素的自訂屬性（`customProperty`）設定為 `true`，理由僅僅是為了展示它可以這麼做。

<code-example path="testing/src/app/shared/highlight.directive.ts" header="app/shared/highlight.directive.ts" linenums="false"></code-example>

它在整個應用程式中都有使用，或許最簡單的用法是在 `AboutComponent` 中：

<code-example path="testing/src/app/about/about.component.ts" header="app/about/about.component.ts" linenums="false"></code-example>

測試 `HighlightDirective` 在 `AboutComponent` 內部的具體用法，只需要
上文探討過的技巧（特別是[「淺層測試」](#巢狀元件測試)方法）。

<code-example path="testing/src/app/about/about.component.spec.ts" region="tests" header="app/about/about.component.spec.ts" linenums="false"></code-example>

不過，只測試單一使用案例，不太可能探索到指令能力的完整範圍。
找出並測試所有使用該指令的元件既繁瑣又脆弱，而且同樣不太可能提供完整覆蓋率。

_僅類別測試_可能有幫助，
但像這樣的屬性指令往往會操作 DOM。
隔離的單元測試不會觸及 DOM，因此，
無法讓人對指令是否真的有效產生信心。

更好的解決方案是建立一個人造的測試元件，展示套用該指令的所有方式。

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" header="app/shared/highlight.directive.spec.ts (TestComponent)" linenums="false"></code-example>

<figure>
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="Highlight 指令規格運作畫面">
</figure>

<div class="alert is-helpful">

`<input>` 案例將 `HighlightDirective` 繫結到輸入框中顏色值的名稱。
初始值是 "cyan" 這個字，應該會成為輸入框的背景顏色。

</div>

以下是這個元件的一些測試：

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" header="app/shared/highlight.directive.spec.ts (selected tests)"></code-example>

有幾個技巧值得注意：

- 當元素型別未知時，`By.directive` 謂詞是取得帶有此指令之元素的絕佳方式。

- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not">`:not` 虛擬類別</a>
  在 `By.css('h2:not([highlight])')` 中有助於找出_沒有_該指令的 `<h2>` 元素。
  `By.css('*:not([highlight])')` 會找出_任何_沒有該指令的元素。

- 即使沒有真正的瀏覽器，`DebugElement.styles` 也能透過 `DebugElement` 抽象層存取元素樣式。
  但當 `nativeElement` 看起來比抽象層更容易或更清楚時，也請自由利用它。

- Angular 會將指令加入它所套用元素的注入器中。
  預設顏色的測試使用第二個 `<h2>` 的注入器，取得它的 `HighlightDirective` 執行個體
  與其 `defaultColor`。

- `DebugElement.properties` 可以存取由指令設定的人造自訂屬性。

<hr>

## 測試管道

管道很容易在不使用 Angular 測試公用程式的情況下進行測試。

管道類別有一個方法 `transform`，負責將輸入值處理成轉換後的輸出值。
`transform` 的實作很少與 DOM 互動。
大多數管道除了 `@Pipe` 中繼資料與一個介面之外，不相依於 Angular 的其他部分。

以一個將每個單字第一個字母大寫的 `TitleCasePipe` 為例。
以下是一個以正規表示式寫成的簡易實作。

<code-example path="testing/src/app/shared/title-case.pipe.ts" header="app/shared/title-case.pipe.ts" linenums="false"></code-example>

任何使用正規表示式的程式碼都值得徹底測試。
使用簡單的 Jasmine 來探索預期情境與邊界情境。

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" header="app/shared/title-case.pipe.spec.ts"></code-example>

{@a write-tests}

#### 也要撰寫 DOM 測試

這些是_獨立_測試管道的測試。
它們無法判斷 `TitleCasePipe` 套用到應用程式元件時是否正常運作。

可以考慮加入像這樣的元件測試：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

{@a test-debugging}

## 為測試除錯

在瀏覽器中為規格除錯的方式，與為應用程式除錯的方式相同。

1. 顯示 Karma 瀏覽器視窗（先前隱藏的那個）。
1. 點選 **DEBUG** 按鈕；它會開啟新的瀏覽器分頁並重新執行測試。
1. 開啟瀏覽器的「Developer Tools」（Windows 上按 `Ctrl-Shift-I`；OSX 上按 `Command-Option-I`）。
1. 選取「sources」區段。
1. 開啟 `1st.spec.ts` 測試檔案（按 Control/Command-P，然後開始輸入檔案名稱）。
1. 在測試中設定中斷點。
1. 重新整理瀏覽器，它會停在中斷點處。

<figure>
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma 除錯">
</figure>

<hr>

{@a atu-apis}

## 測試工具 API

本節盤點最實用的 Angular 測試功能，並摘要說明它們各自的用途。

Angular 測試工具包括 `TestBed`、`ComponentFixture`，以及一些控制測試環境的函式。
[_TestBed_](#testbed-api-summary) 與 [_ComponentFixture_](#component-fixture-api-summary) 類別另有專節說明。

以下是獨立函式的摘要，依可能的實用程度排序：

<table>
  <tr>
    <th>
      函式
    </th>
    <th>
      說明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>async</code>
    </td>

    <td>

      在特殊的 _async 測試區_ 內執行測試（`it`）或設定（`beforeEach`）函式的主體。
      請參閱[上方的討論](#async)。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>fakeAsync</code>
    </td>

    <td>

      在特殊的 _fakeAsync 測試區_ 內執行測試（`it`）函式的主體，讓程式碼能以線性的控制流程撰寫。
      請參閱[上方的討論](#fake-async)。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>tick</code>
    </td>

    <td>

      模擬時間的流逝與待處理非同步活動的完成，方式是在 _fakeAsync 測試區_ 內排清 _timer_ 與 _micro-task_ 佇列。

<div class="alert is-helpful">

      熱心投入的讀者或許會喜歡這篇長篇部落格文章：["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)。

</div>

      它接受一個選用的參數，可將虛擬時鐘向前推進指定的毫秒數，並清除在該時間範圍內排程的非同步活動。
      請參閱[上方的討論](#tick)。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
       <code>inject</code>
    </td>

    <td>

      將目前 `TestBed` 注入器中的一或多個服務注入測試函式。
      它無法注入由元件本身提供的服務。
      請參閱 [debugElement.injector](#取得注入的服務) 的討論。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>discardPeriodicTasks</code>
    </td>

    <td>

      當 `fakeAsync()` 測試在結束時仍有待處理的計時器事件 _tasks_（排入佇列的 `setTimeOut` 與 `setInterval` 回呼），測試會以清楚的錯誤訊息失敗。

      一般來說，測試結束時不應有任何排入佇列的工作。
      當預期會有待處理的計時器工作時，呼叫 `discardPeriodicTasks` 排清 _task_ 佇列，以避免這個錯誤。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>flushMicrotasks</code>
    </td>

    <td>

      當 `fakeAsync()` 測試在結束時仍有待處理的 _micro-tasks_（例如尚未解決的 promise），測試會以清楚的錯誤訊息失敗。

      一般來說，測試應等待 micro-task 完成。
      當預期會有待處理的 microtask 時，呼叫 `flushMicrotasks` 排清 _micro-task_ 佇列，以避免這個錯誤。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>ComponentFixtureAutoDetect</code>
    </td>

    <td>

      一個 provider token，對應的服務會開啟[自動變更偵測](#自動變更偵測)。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>getTestBed</code>
    </td>

    <td>

      取得 `TestBed` 的目前實例。
      通常不需要使用，因為 `TestBed` 類別的靜態類別方法一般就已足夠。
      `TestBed` 實例公開了一些較少使用、且沒有靜態方法版本的成員。

    </td>
  </tr>
</table>

<hr>

{@a testbed-class-summary}

#### _TestBed_ 類別摘要

`TestBed` 類別是主要的 Angular 測試工具之一。
它的 API 相當龐大，在你逐漸探索之前可能會覺得難以招架。
請先閱讀本指南前面的部分掌握基礎，再試著理解完整的 API。

傳入 `configureTestingModule` 的模組定義，是 `@NgModule` 中繼資料屬性的子集。

<code-example format="." language="javascript">
  type TestModuleMetadata = {
    providers?: any[];
    declarations?: any[];
    imports?: any[];
    schemas?: Array&lt;SchemaMetadata | any[]&gt;;
  };
</code-example>

{@a metadata-override-object}

每個覆寫方法都接受一個 `MetadataOverride<T>`，其中 `T` 是適合該方法的中繼資料種類，也就是 `@NgModule`、`@Component`、`@Directive` 或 `@Pipe` 的參數。

<code-example format="." language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

{@a testbed-methods}
{@a testbed-api-summary}

`TestBed` API 由靜態類別方法組成，這些方法不是更新、就是引用 `TestBed` 的 _全域_ 實例。

在內部，所有靜態方法都是目前執行期 `TestBed` 實例的方法的包裝，而該實例也會由 `getTestBed()` 函式傳回。

請在 `beforeEach()` _內_ 呼叫 `TestBed` 方法，確保每個個別測試開始前都是全新狀態。

以下是最重要的靜態方法，依可能的實用程度排序。

<table>
  <tr>
    <th>
      方法
    </th>
    <th>
      說明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>configureTestingModule</code>
    </td>

    <td>

      測試墊片（`karma-test-shim`、`browser-test-shim`）會建立[初始測試環境](guide/testing)與預設的測試模組。
      預設測試模組設定了基本的宣告式成員，以及每位測試者都需要的一些 Angular 服務替代實作。

      呼叫 `configureTestingModule`，可以加入與移除匯入、宣告（元件、指令與管道）及 providers，為特定的測試組調整測試模組設定。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>compileComponents</code>
    </td>

    <td>

      在你完成測試模組的設定後，以非同步方式編譯該模組。
      如果測試模組的 _任何_ 元件具有 `templateUrl` 或 `styleUrls`，你**必須**呼叫這個方法，因為取得元件範本與樣式檔案必然是非同步的。
      請參閱[上方內容](#compile-components)。

      呼叫 `compileComponents` 之後，`TestBed` 設定會在目前規格執行的期間內凍結。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>createComponent<T></code>
    </td>

    <td>

      根據目前的 `TestBed` 設定，建立型別為 `T` 的元件實例。
      呼叫 `compileComponent` 之後，`TestBed` 設定會在目前規格執行的期間內凍結。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideModule</code>
    </td>
    <td>

      取代指定的 `NgModule` 的中繼資料。請記住，模組可以匯入其他模組。
      `overrideModule` 方法可以深入目前的測試模組，修改其中某個內層模組。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideComponent</code>
    </td>

    <td>

      取代指定元件類別的中繼資料，該元件可能深藏在內層模組之中。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideDirective</code>
    </td>

    <td>

      取代指定指令類別的中繼資料，該指令可能深藏在內層模組之中。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overridePipe</code>
    </td>
    <td>

      取代指定管道類別的中繼資料，該管道可能深藏在內層模組之中。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-get}
      <code>get</code>
    </td>

    <td>

      從目前的 `TestBed` 注入器取得服務。

      `inject` 函式通常就足以勝任此用途。
      但若 `inject` 無法提供該服務，就會擲出錯誤。

      如果該服務是選用的，該怎麼辦？

      `TestBed.get()` 方法接受一個選用的第二個參數，也就是 Angular 找不到 provider 時要傳回的物件（此例為 `null`）：

      <code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="testbed-get-w-null" header="app/demo/demo.testbed.spec.ts" linenums="false"></code-example>

      呼叫 `get` 之後，`TestBed` 設定會在目前規格執行的期間內凍結。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-initTestEnvironment}
      <code>initTestEnvironment</code>
    </td>
    <td>

      為整個測試執行初始化測試環境。

      測試墊片（`karma-test-shim`、`browser-test-shim`）會為你呼叫它，所以你幾乎不需要自己呼叫。

      這個方法只能呼叫 _恰好一次_。若要在測試執行中途變更這個預設值，請先呼叫 `resetTestEnvironment`。

      指定 Angular 編譯器工廠、一個 `PlatformRef`，以及一個預設的 Angular 測試模組。
      非瀏覽器平台的替代方案可在 `@angular/platform-<platform_name>/testing/<platform_name>` 這個一般形式下取得。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>resetTestEnvironment</code>
    </td>
    <td>

      重設初始測試環境，包括預設的測試模組。

    </td>
  </tr>
</table

少數 `TestBed` 實例方法沒有對應的靜態 `TestBed` _類別_ 方法。
這些方法很少需要使用。

{@a component-fixture-api-summary}

#### _ComponentFixture_

`TestBed.createComponent<T>` 會建立元件 `T` 的實例，並為該元件傳回強型別的 `ComponentFixture`。

`ComponentFixture` 的屬性與方法提供對元件、其 DOM 表示方式，以及其 Angular 環境各方面的存取。

{@a component-fixture-properties}

#### _ComponentFixture_ 屬性

以下是對測試者最重要的屬性，依可能的實用程度排序。

<table>
  <tr>
    <th>
      屬性
    </th>
    <th>
      說明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      由 `TestBed.createComponent` 建立的元件類別實例。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>debugElement</code>
    </td>

    <td>

      與元件根元素相關聯的 `DebugElement`。

      `debugElement` 讓你在測試與除錯期間深入了解元件及其 DOM 元素。
      這是測試者的關鍵屬性。最值得關注的成員在[下文](#debug-element-details)說明。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      位於元件根部的原生 DOM 元素。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>changeDetectorRef</code>
    </td>

    <td>

      元件的 `ChangeDetectorRef`。

      當所測試的元件具有 `ChangeDetectionStrategy.OnPush`，或元件的變更偵測由你的程式控制時，`ChangeDetectorRef` 最有價值。

    </td>
  </tr>
</table>

{@a component-fixture-methods}

#### _ComponentFixture_ 方法

_fixture_ 方法會讓 Angular 對元件樹執行某些工作。
呼叫這些方法，可以觸發 Angular 行為以回應模擬的使用者動作。

以下是最實用的方法。

<table>
  <tr>
    <th>
      方法
    </th>
    <th>
      說明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>detectChanges</code>
    </td>

    <td>

      為元件觸發一個變更偵測週期。

      呼叫它來初始化元件（它會呼叫 `ngOnInit`），以及在測試程式碼變更元件的資料繫結屬性值之後呼叫。
      Angular 無法得知你已變更 `personComponent.name`，在你呼叫 `detectChanges` 之前，不會更新 `name` 繫結。

      之後會執行 `checkNoChanges`，確認沒有循環更新，除非以 `detectChanges(false)` 的方式呼叫；

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>autoDetectChanges</code>
    </td>

    <td>

      當你希望 fixture 自動偵測變更時，將它設為 `true`。

      當自動偵測為 `true` 時，測試 fixture 會在建立元件後立即呼叫 `detectChanges`。
      接著它會監聽相關的 zone 事件，並相應地呼叫 `detectChanges`。
      當你的測試程式碼直接修改元件屬性值時，你可能仍然必須呼叫 `fixture.detectChanges` 來觸發資料繫結更新。

      預設值為 `false`。偏好精細控制測試行為的測試者，通常會將它保持為 `false`。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>checkNoChanges</code>
    </td>

    <td>

      執行一次變更偵測，確保沒有待處理的變更。
      若有變更則擲出例外。
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>isStable</code>
    </td>

    <td>

      若 fixture 目前 _穩定_，傳回 `true`。
      若有尚未完成的非同步工作，傳回 `false`。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>whenStable</code>
    </td>

    <td>

      傳回一個在 fixture 穩定時完成的 promise。

      若要在非同步活動或非同步變更偵測完成後繼續測試，請掛接該 promise。
      請參閱[上方內容](#when-stable)。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>destroy</code>
    </td>

    <td>

      觸發元件銷毀。

    </td>
  </tr>
</table>

{@a debug-element-details}

#### _DebugElement_

`DebugElement` 提供對元件 DOM 表示方式的關鍵洞察。

從測試根元件由 `fixture.debugElement` 傳回的 `DebugElement`，你可以走訪（並查詢）fixture 的整個元素與元件子樹。

以下是對測試者最實用的 `DebugElement` 成員，依大約的實用程度排序：

<table>
  <tr>
    <th>
      成員
    </th>
    <th>
      說明
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      瀏覽器中對應的 DOM 元素（WebWorker 中為 null）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>query</code>
    </td>

    <td>

      呼叫 `query(predicate: Predicate<DebugElement>)`，傳回子樹中任意深度第一個符合[述詞](#query-predicate)的 `DebugElement`。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>queryAll</code>
    </td>

    <td>

      呼叫 `queryAll(predicate: Predicate<DebugElement>)`，傳回子樹中任意深度所有符合[述詞](#query-predicate)的 `DebugElements`。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>injector</code>
    </td>

    <td>

      宿主的相依性注入器。
      例如，根元素的元件實例注入器。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      元素自身的元件實例（如果有的話）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>context</code>
    </td>

    <td>

      提供此元素父層上下文的物件。
      通常是掌管此元素的祖先元件實例。

      當元素在 `*ngFor` 內重複時，其 context 是一個 `NgForRow`，其 `$implicit` 屬性是該列實例的值。
      例如，`*ngFor="let hero of heroes"` 中的 `hero`。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>children</code>
    </td>

    <td>

      直接的 `DebugElement` 子元素。透過 `children` 逐層往下走訪整棵樹。

<div class="alert is-helpful">

      `DebugElement` 也有 `childNodes`，是 `DebugNode` 物件的清單。
      `DebugElement` 源自 `DebugNode` 物件，而且節點的數量往往比元素多。測試者通常可以忽略純節點。

      </div>
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>parent</code>
    </td>
    <td>

      `DebugElement` 的父元素。若這是根元素，則為 Null。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>name</code>
    </td>

    <td>

      元素的標籤名稱（如果它是元素的話）。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>triggerEventHandler</code>
    </td>
    <td>

      若元素的 `listeners` 集合中有對應的監聽器，則依名稱觸發該事件。
      第二個參數是處理常式預期的 _事件物件_。
      請參閱[上方內容](#trigger-event-handler)。

      若事件缺少監聽器，或有其他問題，請考慮呼叫 `nativeElement.dispatchEvent(eventObject)`。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>listeners</code>
    </td>

    <td>

      附加在元件 `@Output` 屬性及／或元素事件屬性上的回呼。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>providerTokens</code>
    </td>

    <td>

      此元件的注入器查找權杖。
      包括元件本身，加上元件在其 `providers` 中繼資料中所列的權杖。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>source</code>
    </td>

    <td>

      在來源元件範本中找到這個元素的位置。

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>references</code>
    </td>

    <td>

      與範本區域變數相關聯的物件字典（例如 `#foo`），以區域變數名稱為鍵。

    </td>
  </tr>
</table>

{@a query-predicate}

`DebugElement.query(predicate)` 與 `DebugElement.queryAll(predicate)` 方法接受一個述詞，用來篩選來源元素的子樹，找出符合的 `DebugElement`。

述詞可以是任何接受 `DebugElement` 並傳回 _真值_ 的方法。
下列範例找出所有具有名為 "content" 的範本區域變數參照的 `DebugElements`：

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="custom-predicate" header="app/demo/demo.testbed.spec.ts" linenums="false"></code-example>

Angular 的 `By` 類別有三個靜態方法，用於常見的述詞：

- `By.all` - 傳回所有元素。
- `By.css(selector)` - 傳回符合 CSS 選擇器的元素。
- `By.directive(directive)` - 傳回 Angular 對應到該指令類別實例的元素。

<code-example path="testing/src/app/hero/hero-list.component.spec.ts" region="by" header="app/hero/hero-list.component.spec.ts" linenums="false"></code-example>

<hr>

{@a faq}

## 常見問題

{@a q-spec-file-location}

#### 為什麼要把 spec 檔案放在它所測試的檔案旁邊？

把單元測試 spec 檔案放在與它們所測試的應用程式原始碼檔案相同的資料夾中，是個好主意：

- 這類測試很容易找到。
- 你一眼就能看出應用程式的哪個部分缺乏測試。
- 鄰近的測試可以揭示某個部分在脈絡中的運作方式。
- 當你移動原始碼時（無可避免），你會記得移動測試。
- 當你重新命名原始碼檔案時（無可避免），你會記得重新命名測試檔案。

<hr>

{@a q-specs-in-test-folder}

#### 什麼時候應該把 spec 放在 test 資料夾？

應用程式整合 spec 可以測試分散在多個資料夾與模組中的多個部分的互動。
它們並不真正屬於任何特定部分，所以在任何單一檔案旁邊都沒有自然的歸屬。

通常，為它們在 `tests` 目錄中建立一個適當的資料夾會更好。

當然，測試那些測試輔助函式的 spec 屬於 `test` 資料夾，就在它們對應的輔助檔案旁邊。

{@a q-e2e}

#### 為什麼不依賴 DOM 整合的 E2E 測試？

本指南中描述的元件 DOM 測試，通常需要大量的設定與
進階技巧，而[單元測試](#元件類別測試)
相對簡單。

#### 為什麼不把 DOM 整合測試延後到端對端（E2E）測試？

E2E 測試非常適合對整個系統進行高層次的驗證。
但它們無法提供你對單元測試所期望的那種全面測試涵蓋率。

E2E 測試難以撰寫，而且與單元測試相比表現不佳。
它們很容易損壞，原因往往是與損壞位置相距甚遠的變更或異常行為。

E2E 測試不容易揭示你的元件在出問題時的行為，
例如資料遺失或損壞、連線中斷，以及遠端服務失敗。

對於會更新資料庫、
寄送帳單，或向信用卡收費的應用程式，E2E 測試需要特殊的技巧與後門，才能防止
意外損壞遠端資源。
甚至連導航到你想測試的元件都可能很困難。

由於這些重重障礙，你應該盡量以單元測試技巧
來測試 DOM 互動。
