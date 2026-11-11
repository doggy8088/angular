# 端到端測試

端到端（E2E）測試是一種測試形式，用來驗證整個應用程式從頭到尾、也就是「端到端」是否如預期運作。E2E 測試與單元測試不同，它完全不依賴程式碼底層的實作細節，通常用來以模擬使用者實際操作的方式驗證應用程式。本頁是使用 Angular CLI 在 Angular 中開始進行端到端測試的指南。

## 設定 E2E 測試

Angular CLI 會下載並安裝執行 Angular 應用程式端到端測試所需的一切。

<docs-code language="shell">

ng e2e

</docs-code>

`ng e2e` 指令會先在你的專案中尋找 "e2e" 目標。若找不到，CLI 會接著詢問你想使用哪個 e2e 套件，並引導你完成設定。

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

若你在上表中找不到想使用的測試執行器，可以用 `ng add` 手動新增套件。

## 執行 E2E 測試

應用程式設定好端到端測試後，現在就可以執行同一個指令來跑測試。

<docs-code language="shell">

ng e2e

</docs-code>

請注意，用任何整合的 e2e 套件執行測試都沒有什麼「特殊」之處。`ng e2e` 指令實際上只是在底層執行 `e2e` 建置器。你隨時可以[建立自己的自訂建置器](tools/cli/cli-builder#creating-a-builder)，將其命名為 `e2e`，再用 `ng e2e` 執行它。

## 更多端到端測試工具資訊

| 測試工具    | 詳細資訊                                                                                                     |
| :---------- | :------------------------------------------------------------------------------------------------------------------- |
| Cypress     | [Cypress 入門](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) |
| Nightwatch  | [Nightwatch 入門](https://nightwatchjs.org/guide/writing-tests/introduction.html)                    |
| WebdriverIO | [Webdriver.io 入門](https://webdriver.io/docs/gettingstarted)                                        |
| Puppeteer   | [Puppeteer 入門](https://pptr.dev)                                                                   |
