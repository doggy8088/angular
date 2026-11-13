# 開啟文件 pull request

本主題說明如何開啟 pull request，以要求將你的文件更新加入 `angular/angular` 儲存庫。

這些步驟是在你的網頁瀏覽器中執行的。

1.  找到你想用於 pull request 的 `working` 分支。在這個範例中，`test-1` 是 `working` 分支的名稱。選擇下列其中一個選項來開啟 pull request。

    1.  如果你最近將想使用的分支推送到 `origin` 儲存庫，你可能會在 GitHub 帳號中 `angular` 儲存庫的程式碼頁面上看到它列在其中。這張圖片顯示一個最近有數次更新的儲存庫範例。

        <div class="lightbox">

        <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
        <img alt="github.com 頁面的螢幕截圖，顯示最近推送到儲存庫的內容" src="generated/images/guide/doc-pr-open/github-recent-push.png">

        </div>

在包含你的 `working` 分支的提醒訊息中，點選 **Compare &amp; pull request** 以開啟 pull request 並繼續下一個步驟。

    1.  你也可以在 origin 儲存庫的程式碼頁面中選取你的 `working` 分支。

        <div class="lightbox">

        <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
        <img alt="github.com 頁面中來源儲存庫程式碼頁面的螢幕截圖，顯示儲存庫的分支清單" src="generated/images/guide/doc-pr-open/github-branch-view.png">

        </div>

點選 `"This branch is"` 訊息中的連結文字，以開啟 **Comparing changes** 頁面。

        <div class="lightbox>

        <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
        <img alt="github.com 頁面中比較變更頁面的螢幕截圖，顯示儲存庫分支之間的差異" src="generated/images/guide/doc-pr-open/github-branch-diff.png">

        </div>

在 **Comparing changes** 頁面中，點選 **Create pull request** 以開啟新的 pull request 頁面。

    1.  檢閱並填寫註解欄位中的表單。大多數文件更新都需要回答以下以箭頭標示並說明的項目。

        <div class="lightbox">

        <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
        <img alt="提取要求表單的螢幕截圖" src="generated/images/guide/doc-pr-open/pr-checklist.png">

        </div>

<!-- vale Angular.Google_We = NO -->

        1.  **提交訊息遵循我們的指南**

當你確定提交訊息的格式正確時，請勾選這個註解。請記得，提交訊息與 pull request 標題是不同的。有關提交訊息格式的更多資訊，請參閱[為 pull request 準備文件更新](guide/doc-pr-prep)與[提交訊息格式](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)。

        1.  **已新增／更新文件（針對錯誤修正／功能）**

勾選這個註解以表示文件已更新。

        1.  **文件內容變更**

勾選這個註解以表明這是一個文件 pull request。如果你也更新了其他類型的內容，也可以一併勾選。

        1.  **目前的行為為何？**

簡要說明在你於此 pull request 中進行變更之前，文件中有什麼無法運作或不正確之處。如果問題已在議題中描述，請在此加入議題編號。

        1.  **新的行為為何？**

簡要說明新增了什麼來修正問題。

        1.  **這個 PR 是否引入了重大變更？**

對於大多數文件更新，這個問題的答案應為 `No`。

        1.  **其他資訊**

在此加入任何其他有助於檢閱者理解你的 pull request 的資訊。

<!-- vale Angular.Google_We = YES -->

1.  點選 **Draft pull request** 旁的箭頭，選擇要建立草稿 pull request 或 pull request。
    1.  草稿 pull request 會執行持續整合（CI）測試，但不會將 pull request 傳送給檢閱者。你可以傳送 pull request 連結請他人檢閱。在將 pull request 送交檢閱以合併之前，你可以使用這個選項來查看你的 pull request 通過 CI 測試的情況。草稿 pull request 無法合併。

    1.  pull request 會執行持續整合（CI）測試，並將你的 pull request 傳送給檢閱者進行檢閱與合併。

        <div class="alert is-helpful">

        **注意**：<br />
        你可以將草稿 pull request 變更為 pull request。

        </div>

1.  點選 **Create the pull request** 或 **Draft pull request** 以開啟 pull request。GitHub 建立 pull request 後，瀏覽器會開啟新的 pull request 頁面。

1.  開啟 pull request 後，自動化測試會開始執行。

## 開啟 pull request 後會發生什麼事

在大多數情況下，通過自動化測試的文件 pull request 會在幾天內獲得核准。

有時候，檢閱者會建議你進行變更以改善 pull request。在這種情況下，請檢閱建議，並[更新 pull request](guide/doc-pr-update)，附上註解或更新後的檔案。

### 被棄置的 pull request 會如何處理

回覆註解可能需要幾天時間，但請盡快回覆。看起來被棄置或忽略的 pull request 會依下列時程關閉：

*   上次註解後 14 天無活動，作者會收到提醒，指出 pull request 有待處理的註解
*   上次註解後 28 天無活動，pull request 會關閉且不合併

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
