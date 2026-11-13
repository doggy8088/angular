<a id="top"></a>

# 測試

測試你的 Angular 應用程式能幫助你確認你的應用程式是否如預期運作。

## 先決條件

在為你的 Angular 應用程式撰寫測試之前，你應該對下列概念有基本的了解：

*   Angular 基礎概念
*   JavaScript
*   HTML
*   CSS
*   [Angular CLI](cli)

測試文件透過使用 [Angular CLI](cli) 建立的範例應用程式，提供單元測試與整合測試 Angular 應用程式的提示與技巧。這個範例應用程式與[*英雄之旅*教學](tutorial)中的應用程式非常相似。

<div class="alert is-helpful">

如果你想試用本指南所述的應用程式，可以<live-example name="testing" noDownload>在瀏覽器中執行</live-example>，或<live-example name="testing" downloadOnly>下載到本機執行</live-example>。

</div>

<a id="setup"></a>

## 設定測試

Angular CLI 會下載並安裝使用 [Jasmine 測試框架](https://jasmine.github.io) 測試 Angular 應用程式所需的一切。

你用 CLI 建立的專案立即就能進行測試。 只要執行 [`ng test`](cli/test) CLI 指令：

<code-example format="shell" language="shell">

ng test

</code-example>

`ng test` 指令以_監看模式_建置應用程式， 並啟動 [Karma 測試執行器](https://karma-runner.github.io)。

主控台輸出大致如下：

<code-example format="shell" language="shell">

10% building modules 1/1 modules 0 active
&hellip;INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
&hellip;INFO [launcher]: Launching browser Chrome &hellip;
&hellip;INFO [launcher]: Starting browser Chrome
&hellip;INFO [Chrome &hellip;]: Connected on socket &hellip;
Chrome &hellip;: Executed 3 of 3 SUCCESS (0.135 secs / 0.205 secs)

</code-example>

日誌的最後一行最重要。它顯示 Karma 執行了三個測試，全部通過。

Chrome 瀏覽器也會開啟，並在「Jasmine HTML Reporter」中顯示測試輸出，如下所示。

<div class="lightbox">

<img alt="瀏覽器中的 Jasmine HTML Reporter" src="generated/images/guide/testing/initial-jasmine-html-reporter.png">

</div>

大多數人覺得這種瀏覽器輸出比主控台日誌更容易閱讀。點選某個測試列可以只重新執行該測試，或點選某個描述，以重新執行所選測試群組（「test suite」）中的測試。

同時，`ng test` 指令正在監看變更。

若要實際看看這個效果，對 `app.component.ts` 做一點小變更並儲存。 測試會再次執行，瀏覽器會重新整理，新的測試結果就會出現。

## 設定

CLI 會為你處理 Jasmine 與 Karma 的設定。

你可以編輯專案根資料夾中的 `karma.conf.js` 與 `src/` 資料夾中的 `test.ts` 檔案，來微調許多選項。

`karma.conf.js` 檔案是一份部分的 Karma 設定檔。CLI 會根據 `angular.json` 檔案中指定的應用程式結構，在記憶體中建構完整的執行時期設定，並以 `karma.conf.js` 補充。

在網路上搜尋更多關於 Jasmine 與 Karma 設定的詳細資訊。

### 其他測試框架

你也可以使用其他測試函式庫與測試執行器來單元測試 Angular 應用程式。 每個函式庫與執行器都有自己獨特的安裝程序、設定與語法。

在網路上搜尋以了解更多。

### 測試檔案名稱與位置

查看 `src/app` 資料夾內部。

CLI 為 `AppComponent` 產生了一個名為 `app.component.spec.ts` 的測試檔案。

<div class="alert is-important">

測試檔案的副檔名**必須是 `.spec.ts`**，工具才能將其識別為含有測試的檔案（也稱為 *spec* 檔案）。

</div>

`app.component.ts` 與 `app.component.spec.ts` 檔案是同一個資料夾中的同層檔案。 兩個檔案的根檔案名稱（`app.component`）相同。

在你自己的專案中，對_每一種_測試檔案都採用這兩個慣例。

<a id="q-spec-file-location"></a>

#### 將你的 spec 檔案放在它所測試的檔案旁邊

把單元測試 spec 檔案放在與它們所測試的應用程式原始碼檔案相同的資料夾中，是個好主意：

*   這類測試很容易找到
*   你一眼就能看出應用程式的哪個部分缺乏測試
*   鄰近的測試可以揭示某個部分在脈絡中的運作方式
*   當你移動原始碼時（無可避免），你會記得移動測試
*   當你重新命名原始碼檔案時（無可避免），你會記得重新命名測試檔案

<a id="q-specs-in-test-folder"></a>

#### 將你的 spec 檔案放在 test 資料夾中

應用程式整合 spec 可以測試分散在多個資料夾與模組中的多個部分的互動。 它們並不真正屬於任何特定部分，所以在任何單一檔案旁邊都沒有自然的歸屬。

通常，為它們在 `tests` 目錄中建立一個適當的資料夾會更好。

當然，測試那些測試輔助函式的 spec 屬於 `test` 資料夾， 就在它們對應的輔助檔案旁邊。

<a id="ci"></a>

## 設定持續整合

讓你的專案保持無錯誤狀態的最好方法之一，就是透過測試套件，但你可能不會一直記得要執行測試。

持續整合（CI）伺服器讓你可以設定專案儲存庫，讓你的測試在每次提交與提取請求時執行。

有付費的 CI 服務，如 Circle CI 與 Travis CI，你也可以使用 Jenkins 等工具免費自行架設。雖然 Circle CI 與 Travis CI 是付費服務，但它們為開源專案免費提供。你可以建立一個公開的 GitHub 專案，並加入這些服務，無需付費。對 Angular 儲存庫的貢獻會自動經過一整套 Circle CI 測試。

本文說明如何設定你的專案來執行 Circle CI 與 Travis CI，並更新你的測試設定，以便在這兩種環境中都能在 Chrome 瀏覽器中執行測試。

### 為 Circle CI 設定專案

1.  在專案根目錄建立一個名為 `.circleci` 的資料夾。
1.  在新資料夾中，建立一個名為 `config.yml` 的檔案，內容如下：

    <code-example format="yaml" language="yaml">

    version: 2
    jobs:
      build:
        working_directory: ~/my-project
        docker:
          &hyphen; image: circleci/node:10-browsers
        steps:
          &hyphen; checkout
          &hyphen; restore_cache:
              key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
          &hyphen; run: npm install
          &hyphen; save_cache:
              key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
              paths:
                &hyphen; "node_modules"
          &hyphen; run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI

    </code-example>

    此設定會快取 `node_modules/`，並使用 [`npm run`](https://docs.npmjs.com/cli/run-script) 來執行 CLI 指令，因為 `@angular/cli` 並未全域安裝。雙連字號（`--`）字元是把引數傳遞給 `npm` 指令碼所必需的。

1.  提交你的變更，並推送到你的儲存庫。
1.  [註冊 Circle CI](https://circleci.com/docs/2.0/first-steps) 並[加入你的專案](https://circleci.com/add-projects)。你的專案應該就會開始建置。

    *   從 [Circle CI 文件](https://circleci.com/docs/2.0) 了解更多關於 Circle CI 的資訊。

### 為 Travis CI 設定專案

1.  在專案根目錄建立一個名為 `.travis.yml` 的檔案，內容如下：

    <code-example format="yaml" language="yaml">

    language: node_js
    node_js:
      &hyphen; "10"

    addons:
      chrome: stable

    cache:
      directories:
         &hyphen; ./node_modules

    install:
      &hyphen; npm install

    script:
      &hyphen; npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI

    </code-example>

    這會執行與 CircleCI 設定相同的事情，不同之處在於 Travis 並未附帶 Chrome，所以改用 Chromium。

1.  提交你的變更，並推送到你的儲存庫。
1.  [註冊 Travis CI](https://travis-ci.org/auth) 並[加入你的專案](https://travis-ci.org/profile)。你需要推送一個新的提交來觸發建置。

    *   從 [Travis CI 文件](https://docs.travis-ci.com) 了解更多關於 Travis CI 測試的資訊。

### 為 GitLab CI 設定專案

1.  在專案根目錄建立一個名為 `.gitlab-ci.yml` 的檔案，內容如下：

    <code-example format="yaml" language="yaml">

    image: node:14.15-stretch
    variables:
      FF_USE_FASTZIP: "true"

    cache:
      untracked: true
      policy: push
      key: &dollar;{CI_COMMIT_SHORT_SHA}
      paths:
        &hyphen; node_modules/

    .pull_cached_node_modules:
      cache:
        untracked: true
        key: &dollar;{CI_COMMIT_SHORT_SHA}
        policy: pull

    stages:
      &hyphen; setup
      &hyphen; test

    install:
      stage: setup
      script:
        &hyphen; npm ci

    test:
      stage: test
      extends: .pull_cached_node_modules
      before_script:
        &hyphen; apt-get update
        &hyphen; wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
        &hyphen; apt install -y ./google-chrome*.deb;
        &hyphen; export CHROME_BIN=/usr/bin/google-chrome
      script:
        &hyphen; npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI

    </code-example>

    此設定會在 `install` 工作中快取 `node_modules/`，並在 `test` 工作中重複使用快取的 `node_modules/`。

1.  [註冊 GitLab CI](https://gitlab.com/users/sign_in) 並[加入你的專案](https://gitlab.com/projects/new)。你需要推送一個新的提交來觸發建置。

1.  提交你的變更，並推送到你的儲存庫。
    *   從 [GitLab CI/CD 文件](https://docs.gitlab.com/ee/ci) 了解更多關於 GitLab CI 測試的資訊。

### 為 GitHub Actions 設定專案

1.  在專案根目錄建立一個名為 `.github/workflows` 的資料夾。
1.  在新資料夾中，建立一個名為 `main.yml` 的檔案，內容如下：

    <code-example format="yaml" language="yaml">

    name: CI Angular app through Github Actions
    on: push
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          &hyphen; uses: actions/checkout&commat;v2
          &hyphen; name: Use Node.js 14.x
            uses: actions/setup-node&commat;v1
            with:
              node-version: 14.x

          &hyphen; name: Setup
            run: npm ci

          &hyphen; name: Test
            run: &verbar;
              npm test -- --no-watch --no-progress --browsers=ChromeHeadlessCI

    </code-example>

1.  [註冊 GitHub](https://github.com/join) 並[加入你的專案](https://github.com/new)。你需要推送一個新的提交來觸發建置。

1.  提交你的變更，並推送到你的儲存庫。
    *   從 [GitHub Actions 文件](https://docs.github.com/en/actions) 了解更多關於 GitHub Actions 的資訊。

### 為 CI 中的 Chrome 測試設定 CLI

雖然 CLI 指令 `ng test` 一般會在你的環境中執行 CI 測試，你可能仍需要調整你的設定，才能執行 Chrome 瀏覽器測試。

[Karma JavaScript 測試執行器](https://karma-runner.github.io/latest/config/configuration-file.html) 有一個設定檔，你必須調整它，才能在不使用沙箱的情況下啟動 Chrome。

在這些範例中，我們將使用 [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome#cli)。

*   在 Karma 設定檔 `karma.conf.js` 中，在 browsers 下方加入一個名為 ChromeHeadlessCI 的自訂啟動器：

    <code-example format="javascript" language="javascript">

    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    </code-example>

現在，執行下列指令來使用 `--no-sandbox` 旗標：

<code-example format="shell" language="shell">

ng test --no-watch --no-progress --browsers=ChromeHeadlessCI

</code-example>

<div class="alert is-helpful">

**NOTE**: <br />
目前，如果你在 Windows 上執行，也會想包含 `--disable-gpu` 旗標。請參閱 [crbug.com/737678](https://crbug.com/737678)。

</div>

## 更多測試資訊

在你為你的應用程式設定好測試之後，你可能會覺得下列測試指南很有用。

|                                                                    | 詳細資訊 |
|:---                                                                |:---     |
| [程式碼覆蓋率](guide/testing-code-coverage)                       | 你的測試涵蓋了應用程式的多少部分，以及如何指定所需的涵蓋量。 |
| [測試服務](guide/testing-services)                         | 如何測試你的應用程式所使用的服務。                                   |
| [元件測試基礎](guide/testing-components-basics)    | Angular 元件測試的基礎。                                             |
| [元件測試情境](guide/testing-components-scenarios)  | 各種元件測試情境與使用案例。                       |
| [測試屬性指令](guide/testing-attribute-directives) | 如何測試你的屬性指令。                                            |
| [測試管道](guide/testing-pipes)                               | 如何測試管道。                                                                |
| [為測試除錯](guide/test-debugging)                            | 常見的測試錯誤。                                                              |
| [測試工具 API](guide/testing-utility-apis)                 | Angular 測試功能。                                                         |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
