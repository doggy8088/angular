# 文件貢獻者指南

<!-- markdownLint-disable MD001 -->

本節的主題說明如何為這份文件做出貢獻。有關為 Angular 框架貢獻程式碼的資訊，請參閱[為 Angular 做出貢獻][GithubAngularAngularBlobMainContributingMd]。

Angular 是一個開放原始碼專案，非常感謝社群的支持，尤其是在文件方面。

你可以透過以下方式更新 Angular 文件：

*   [進行小幅變更][AioGuideContributorsGuideOverviewMakeAMinorChange]
*   [進行大幅變更][AioGuideContributorsGuideOverviewMakeAMajorChange]

<div class="alert is-important">

**重要事項**：<br />
若要提交對 Angular 文件的變更，你必須具備：

*   一個 [GitHub][GithubMain] 帳號
*   一份已簽署的[貢獻者授權協議][GithubAngularAngularBlobMainContributingMdSigningTheCla]

</div>

## 進行小幅變更

你可以在不下載任何軟體的情況下，對文件主題進行小幅變更。許多常見的文件維護工作只需要對主題中的幾個字詞或字元進行小幅變更。小幅變更的例子包括：

*   [修正一兩個錯字][AioGuideContributorGuideOverviewToMakeAMinorChangeToADocumentationTopic]
*   [檢閱主題並更新其檢閱日期][AioGuideReviewingContentUpdateTheLastReviewedDate]
*   [新增或更新搜尋關鍵字][AioGuideUpdatingSearchKeywords]

有關讓文件保持最新狀態的更多資訊，請參閱[常見文件維護工作][AioGuideDocTasks]。

若要對文件進行較大的變更，你必須在本地電腦上安裝 Angular 開發環境。你需要這個環境來編輯並測試變更，然後再提交。如需設定本地電腦以進行較大文件更新的資訊，請參閱[準備編輯文件][AioGuideDocPrepareToEdit]。

<!-- markdownLint-disable MD033 -->

#### 對文件主題進行小幅變更

請在瀏覽器中執行下列步驟。

1.  確認你已有一份已簽署的[貢獻者授權協議（CLA）][GoogleDeveloperClaClas]存檔。如果你沒有，請[簽署 CLA][GithubAngularAngularBlobMainContributingMdSigningTheCla]。

1.  登入 [github.com][GithubMain]，如果你沒有 GitHub 帳號，請[建立新的 GitHub 帳號][GithubJoin]。
1.  前往 [angular.io][AngularMain] 上你想要更新的頁面。
1.  在你想要更新的頁面中，找到主題標題右側的這支鉛筆圖示

    <div class="lightbox">

    <img alt="鉛筆圖示，用作主題編輯圖示" src="generated/images/guide/contributors-guide/edit-icon.png">

    </div>

1.  點選這個圖示以開啟建議頁面。
1.  在建議頁面中，於 **Edit file** 更新內容以修正問題。如果修正的內容不只是修正幾個字元，最好將其視為[大幅變更][AioGuideContributorsGuideOverviewMakeAMajorChange]。

1.  點選 **Preview** 分頁，查看你的 Markdown 變更在轉譯後的樣子。這個檢視會顯示 Markdown 的轉譯結果。它的外觀不會與文件頁面完全相同，因為它不會以文件所使用的樣式來顯示文字。

1.  完成變更後：
    1.  在 **Propose changes** 中，輸入變更的簡短說明，開頭為 `docs:`，長度不超過 100 個字元。如有需要，你可以在簡短說明下方較大的編輯視窗中加入更多關於變更的資訊。

    1.  選取 **Create a new branch for this commit and start a pull request**，並接受預設的分支名稱。
    1.  點選 **Propose changes**，以你更新後的文字開啟 pull request。

開啟 pull request 後，Angular 團隊會檢閱你的變更並將其合併到文件中。你可以在 pull request 的頁面中追蹤 pull request 的進度。如果 Angular 團隊對你的變更提出問題，你可能會收到來自 GitHub 的通知。

## 進行大幅變更

對文件進行大幅變更或新增主題時，遵循不同的工作流程。對主題進行大幅變更時，必須先建置並測試變更，再傳送給 Angular 團隊。

這些主題提供如何設定本地電腦以編輯、建置及測試 Angular 文件，進而對其進行大幅變更的資訊。

*   [Angular 文件編輯工作流程概覽][AioGuideDocUpdateOverview]

說明如何設定本地電腦以建置、編輯及測試 Angular 文件

*   [文件風格指南][AioGuideDocStyleGuide]

說明 Angular 文件所使用的標準

## 以新語言在地化 Angular 文件

在地化 Angular 文件是為 Angular 文件做出貢獻的另一種方式。有關以新語言在地化 Angular 文件的資訊，請參閱 [Angular 在地化指南][AioGuideLocalizingAngular]。

<!-- links -->

[AioGuideContributorsGuideOverviewMakeAMajorChange]: guide/contributors-guide-overview#進行大幅變更 "進行大幅變更 - 文件貢獻者指南 | Angular"
[AioGuideContributorsGuideOverviewMakeAMinorChange]: guide/contributors-guide-overview#進行小幅變更 "進行小幅變更 - 文件貢獻者指南 | Angular"
[AioGuideContributorGuideOverviewToMakeAMinorChangeToADocumentationTopic]: guide/contributors-guide-overview#對文件主題進行小幅變更 "對文件主題進行小幅變更 - 文件貢獻者指南 | Angular"

[AioGuideDocPrepareToEdit]: guide/doc-prepare-to-edit "準備編輯文件 | Angular"

[AioGuideDocStyleGuide]: guide/docs-style-guide "Angular 文件風格指南 | Angular"

[AioGuideDocTasks]: guide/doc-tasks "常見文件維護工作 | Angular"

[AioGuideDocUpdateOverview]: guide/doc-update-overview "Angular 文件編輯概覽 | Angular"

[AioGuideLocalizingAngular]: guide/localizing-angular "Angular 文件風格指南 | Angular"

[AioGuideReviewingContentUpdateTheLastReviewedDate]: guide/reviewing-content#更新上次檢閱日期 "更新上次檢閱日期 - 測試文件更新 | Angular"

[AioGuideUpdatingSearchKeywords]: guide/updating-search-keywords "更新搜尋關鍵字 | Angular"

<!-- external links -->

[AngularMain]: https://angular.io "Angular"

[GithubAngularAngularBlobMainContributingMd]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md "為 Angular 做出貢獻 | angular/angular | GitHub"
[GithubAngularAngularBlobMainContributingMdSigningTheCla]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla "簽署 CLA - 為 Angular 做出貢獻 | angular/angular | GitHub"

[GithubMain]: https://github.com "GitHub"

[GithubJoin]: https://github.com/join "加入 GitHub | GitHub"

[GoogleDeveloperClaClas]: https://cla.developers.google.com/clas "貢獻者授權協議 | Google 開放原始碼"

<!--end links -->

@reviewed 2022-12-11
