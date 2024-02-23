# 端到端測試

端到端或 (E2E) 測試是一種用於斷言您的整個應用程式從頭到尾或「端到端」都能如預期般運作的測試形式。E2E 測試不同於單元測試，在於它與程式碼的底層實作細節完全無關。它通常用於以模擬使用者與應用程式互動的方式來驗證應用程式。此頁面可作為使用 Angular CLI 在 Angular 中開始進行端到端測試的指南。

## 設定 E2E 測試

Angular CLI 下載並安裝您執行 Angular 應用程式端到端測試所需的所有內容。

<docs-code language="shell">

ng e2e

</docs-code>

`ng e2e` 命令會首先檢查專案的「e2e」目標。如果找不到，CLI 將會提示您想使用的 e2e 套件，並引導您完成設定。

<docs-code language="shell">

Cannot find "e2e" target for the specified project.
You can add a package that implements these capabilities.

For example:
Cypress: ng add @cypress/schematic
Nightwatch: ng add @nightwatch/schematics
WebdriverIO: ng add @wdio/schematics
Puppeteer: ng add @puppeteer/ng-schematics

Would you like to add a package with "e2e" capabilities now?
No
❯ Cypress
Nightwatch
WebdriverIO
Puppeteer

</docs-code>

如果您在上述清單中找不到您想使用的測試執行器，您可以使用 `ng add` 手動新增套件。

## 執行 E2E 測試

現在您的應用程式已針對端對端測試進行設定，我們現在可以執行相同的指令來執行您的測試。

<docs-code language="shell">

ng e2e

</docs-code>

注意，使用任何整合 e2e 套件執行測試並沒有任何「特殊」之處。 `ng e2e` 指令實際上只是在後台執行 `e2e` 建構器。您隨時可以 [建立自己的自訂建構器](tools/cli/cli-builder#creating-a-builder)命名為 `e2e`，並使用 `ng e2e` 執行它。

## 有關端到端測試工具的更多資訊

| 測試工具 | 詳細訊息                                                                                                              |
| :----------- | :------------------------------------------------------------------------------------------------------------------- |
| Cypress      | [開始使用 Cypress](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) |
| Nightwatch   | [開始使用 Nightwatch](https://nightwatchjs.org/guide/writing-tests/introduction.html)                    |
| WebdriverIO  | [開始使用 Webdriver.io](https://webdriver.io/docs/gettingstarted)                                        |
| Puppeteer    | [開始使用 Puppeteer](https://pptr.dev)                                                                   |

