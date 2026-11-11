# 常見的國際化工作

使用下列 Angular 工作將你的專案國際化。

*   使用內建管道，以當地格式顯示日期、數字、百分比與貨幣。
*   在元件範本中標記文字以供翻譯。
*   標記運算式的複數形式以供翻譯。
*   標記替代文字以供翻譯。

為專案做好面對國際受眾的準備後，使用 [Angular CLI][AioCliMain] 將專案在地化。請完成下列工作以在地化你的專案。

*   使用 CLI 將標記的文字擷取到*來源語言*檔案。
*   為每種語言複製一份*來源語言*檔案，並將所有的*翻譯*檔案傳送給譯者或服務。
*   在為一個或多個地區設定建置專案時，使用 CLI 合併已完成的翻譯檔案。

<div class="alert is-helpful">

為所有目標地區設定建立一個可適應的使用者介面，並考量不同語言在間距上的差異。
更多詳細資訊，請見[如何著手國際化][ThinkwithgoogleMarketfinderIntlEnUsGuideHowToApproachI18nOverview]。

</div>

## 先決條件

若要讓專案為翻譯做好準備，你應該對下列主題有基本的了解。

*   [範本][AioGuideGlossaryTemplate]
*   [元件][AioGuideGlossaryComponent]
*   [Angular CLI][AioCliMain] [命令列][AioGuideGlossaryCommandLineInterfaceCli]工具，用於管理 Angular 開發週期
*   用於翻譯檔案的[可延伸標記語言（XML）][W3Xml]

## 了解常見的 Angular 國際化工作

<div class="card-container">
    <a href="guide/i18n-common-add-package" class="docs-card" title="新增 localize 套件">
        <section>新增 localize 套件</section>
        <p>了解如何將 Angular Localize 套件加入你的專案</p>
        <p class="card-footer">新增 localize 套件</p>
    </a>
    <a href="guide/i18n-common-locale-id" class="docs-card" title="依 ID 參照地區設定">
        <section>依 ID 參照地區設定</section>
        <p>了解如何為你的專案識別與指定地區設定識別碼</p>
        <p class="card-footer">依 ID 參照地區設定</p>
    </a>
    <a href="guide/i18n-common-format-data-locale" class="docs-card" title="依地區設定格式化資料">
        <section>依地區設定格式化資料</section>
        <p>了解如何實作在地化資料管道並覆寫專案的地區設定</p>
        <p class="card-footer">依地區設定格式化資料</p>
    </a>
    <a href="guide/i18n-common-prepare" class="docs-card" title="準備元件以供翻譯">
        <section>準備元件以供翻譯</section>
        <p>了解如何指定要翻譯的來源文字</p>
        <p class="card-footer">準備元件以供翻譯</p>
    </a>
    <a href="guide/i18n-common-translation-files" class="docs-card" title="使用翻譯檔案">
        <section>使用翻譯檔案</section>
        <p>了解如何檢閱與處理翻譯文字</p>
        <p class="card-footer">使用翻譯檔案</p>
    </a>
    <a href="guide/i18n-common-merge" class="docs-card" title="將翻譯合併至應用程式">
        <section>將翻譯合併至應用程式</section>
        <p>了解如何合併翻譯並建置翻譯後的應用程式</p>
        <p class="card-footer">將翻譯合併至應用程式</p>
    </a>
    <a href="guide/i18n-common-deploy" class="docs-card" title="部署多個地區設定">
        <section>部署多個地區設定</section>
        <p>了解如何為你的應用程式部署多個地區設定</p>
        <p class="card-footer">部署多個地區設定</p>
    </a>
</div>

<!-- links -->

[AioCliMain]: cli "CLI Overview and Command Reference | Angular"

[AioGuideGlossaryCommandLineInterfaceCli]: guide/glossary#命令列介面（command-line-interface，cli） "命令列介面（CLI）- 詞彙表 | Angular"
[AioGuideGlossaryComponent]: guide/glossary#元件（component） "元件 - 詞彙表 | Angular"
[AioGuideGlossaryTemplate]: guide/glossary#範本（template） "範本 - 詞彙表 | Angular"

<!-- external links -->

[ThinkwithgoogleMarketfinderIntlEnUsGuideHowToApproachI18nOverview]: https://marketfinder.thinkwithgoogle.com/intl/en_us/guide/how-to-approach-i18n#overview "總覽 - 如何著手國際化 | Market Finder | Think with Google"

[W3Xml]: https://www.w3.org/XML "可延伸標記語言（XML）| W3C"

<!-- end links -->

@reviewed 2021-10-07
