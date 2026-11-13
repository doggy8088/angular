# 更新文件 pull request

<!-- markdownLint-disable MD001 -->

本主題說明如何回應 pull request 上的測試失敗與意見回饋。

開啟 pull request 後，它會經過測試與檢閱。核准後，變更會合併到 `angular/angular`，並成為 Angular 文件的一部分。

雖然有些 pull request 不需要你進一步採取行動即可獲得核准，但大多數 pull request 會收到需要你進行變更的意見回饋。

## pull request 的結構

開啟 pull request 後，pull request 頁面會記錄 pull request 在檢閱、更新與核准過程中的活動。以下是一個 pull request 頁面頂部的範例，後面是其中所含資訊的說明。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="github.com 頁面的螢幕截圖，顯示儲存庫的分支清單" src="generated/images/guide/doc-pr-update/pull-request-heading.png">

</div>

pull request 分頁上方是 pull request 的摘要，包括：

*   pull request 的標題與編號
*   pull request 的狀態：開啟或關閉

*   對包含變更的分支與要更新的分支的說明

分頁包含 pull request 的不同面向。

*   **Conversation**

對 pull request 的所有註解與變更、系統訊息，以及自動化測試與核准的摘要。

*   **Commits**

此 pull request 中包含的提交記錄。

*   **Checks**

對提交所執行的檢查結果。這與同樣會執行並摘要於 **Conversation** 分頁底部的自動化測試不同。

*   **Files changed**

這個請求對程式碼所做的變更。在這個分頁中，你可以找到針對 pull request 中變更的具體註解。你也可以在這個分頁中回覆這些註解。

## 回應註解

如果你的 pull request 收到檢閱者的註解，你可以透過以下幾種方式回應。

*   回覆意見回饋。

例如，你可以詢問更多資訊或回覆說明。

*   依檢閱者建議對文件進行變更。

如果你以建議的變更更新工作分支，請解決該註解。

*   對文件進行其他變更。

檢閱意見回饋後，你可能會發現更好的改進方式。請以你的改進更新工作分支，並在註解中向檢閱者說明你選擇該方式的原因。

請記得，未回應檢閱註解的 pull request 會被視為已棄置並關閉。有關被棄置的 pull request 的更多資訊，請參閱[被棄置的 pull request 會如何處理](guide/doc-pr-open#被棄置的-pull-request-會如何處理)。

### 更新 pull request 中的檔案

請遵循這個程序來變更 pull request 中的檔案，或在 pull request 中新增檔案。

1.  在你的 `git` 工作區中，於你的工作目錄中簽出你的工作分支。
1.  更新文件以回應你收到的意見回饋。用於[修訂文件主題](guide/doc-editing)的程序也適用於在 pull request 開啟期間更新文件。

1.  如[測試文件更新](guide/doc-build-test)中所述，在本地端測試你的更新。
1.  測試更新後，請提交變更並將新的提交推送到你 `origin` 伺服器上儲存庫的工作分支。
1.  更新 `origin` 伺服器上的工作分支後，也就是你 GitHub 帳號中 `angular/angular` 儲存庫的 fork，你的 pull request 會自動更新。
1.  pull request 更新後，自動化測試會重新啟動，並通知檢閱者。

視需要重複這個過程，以處理你在 pull request 檢閱中收到的意見回饋。

## 清理分支

如果你新增提交來處理檢閱意見回饋，你可能會被要求清理工作分支。如果你的某些提交僅處理檢閱者的檢閱意見回饋，它們可能可以被壓縮。壓縮提交會將多筆提交中所做的變更合併為單一提交。

<!-- markdownLint-disable MD033 -->

#### 壓縮工作分支中的提交

請在本地電腦的命令列工具中執行下列步驟。

1.  在你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄中，於你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)中簽出你的工作分支。
1.  執行這個指令以檢視工作分支中的提交。

    <code-example format="shell" language="shell">

    git log --pretty=format:"%h %as %an %Cblue%s %Cgreen%D"

    </code-example>

1.  在前一個 `git log` 指令的輸出中，找到包含 `upstream/main` 的項目。它應該位於清單頂部附近。

    1.  **確認該項目同時包含 `origin/main` 與 `main`**

如果沒有，你必須重新同步本地電腦上的 clone 與 `personal/angular` 儲存庫與 `upstream` 儲存庫。重新同步儲存庫後，請在繼續之前[rebase 工作分支](guide/doc-pr-prep#將你的工作分支-rebase)。

    1.  **確認你的更新的所有提交都位於包含 `upstream/main` 的項目之後**

請記得，記錄輸出的顯示方式是最近的提交在最前面。你的提交都應該位於記錄輸出中包含 `upstream/main` 的項目上方。如果你有提交列在包含 `upstream/main` 的項目之後，表示你的 `working` 分支中的提交不知何故混在一起了。在嘗試壓縮任何提交之前，你必須修正該分支。

1.  計算位於包含 `upstream/main` 的項目上方的行數。例如，在這個記錄輸出中，工作分支名稱為 `update-doc-contribution`，且有五筆提交位於包含 `upstream/main` 的項目上方。

    <div class="lightbox">

    <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
    <a href="generated/images/guide/doc-pr-update/git-log-output-large.png"><img alt="git log 輸出的螢幕截圖" src="generated/images/guide/doc-pr-update/git-log-output.png"></a>

    </div>

1.  執行這個指令以壓縮位於包含 `upstream/main` 的項目之後發生的提交。在你的指令中，將 `HEAD` 後方的 `5` 替換為位於包含 `upstream/main` 的項目上方的提交數量。

    <code-example format="shell" language="shell">

    git rebase -i HEAD~5

    </code-example>

1.  這個指令會以你的預設編輯器開啟檔案，其中包含你在 `git rebase` 指令中所選取的提交項目。

    <div class="lightbox">

    <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
    <img alt="git rebase 編輯器畫面的螢幕截圖" src="generated/images/guide/doc-pr-update/git-squash-edit.png">

    </div>

1.  若要壓縮提交，請編輯編輯器中呈現的檔案中的指令。編輯器中的指令是從最舊到最新排列的，這與 `git log` 指令列出它們的順序相反。可能的指令選項列在編輯器中指令下方的說明中。若要壓縮 pull request 的提交，你只需要：`pick` 與 `squash`。

1.  檢閱編輯器中的指令，並將其變更為符合你的意圖。

指令是從上到下處理的，也就是從最舊的提交到最新的提交。\ 若要合併此分支中此 pull request 的所有提交，請將除第一筆以外的所有提交的 `pick` 指令變更為 `squash`。這段文字顯示這個範例的樣子。

    <code-example language="none" hideCopy>

    pick bb0ff71891 docs: update of documentation contrib. guide
    squash c040d76685 docs: more content for doc updates
    squash 472585c43f docs: fix links that were broken by renamed files
    squash 3e6f4c73ac docs: add more info about open PR
    squash 8e50fad064 docs: more pr docs

    </code-example>

進行此編輯後，`git rebase` 會挑選第一筆提交，並將後續提交合併到第一筆提交中。

帶有 `pick` 指令的提交的提交訊息，就是最終提交所使用的提交訊息。請確認它的格式正確，並以 `docs:` 開頭。如果你需要變更提交訊息，可以在編輯器中編輯它。

1.  更新指令後，請儲存並離開編輯器。`git rebase` 提交會處理這些指令，並更新工作區中的提交記錄。在這個範例中，rebase 指令將五筆提交合併為工作分支中的單一提交。這是 rebase 指令完成後的提交記錄。

    <div class="lightbox">

    <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
    <a href="generated/images/guide/doc-pr-update/git-log-after-squash-large.png"><img alt="執行 git rebase 指令後提交紀錄的螢幕截圖" src="generated/images/guide/doc-pr-update/git-log-after-squash.png"></a>

    </div>

1.  `git rebase` 指令會變更本地電腦上的提交記錄，使其與線上儲存庫中的記錄不同。若要更新線上儲存庫，你必須使用這個指令強制推送本地電腦的變更。

    <code-example format="shell" language="shell">

    git push --force-with-lease

    </code-example>

這個動作也稱為 *強制推送*，因為它會變更儲存在你的 GitHub 帳號中的提交記錄。通常，執行 `git push` 時，你會將新的提交加入線上儲存庫。當其他人 fork 了儲存庫時，強制推送可能會對他們產生不必要的影響。這次強制推送是針對你的 fork 儲存庫，該儲存庫不應被分享，所以應該沒問題。

1.  強制推送更新線上儲存庫後，你的 pull request 會重新啟動自動化測試並通知檢閱者更新。

## 後續步驟

視需要重複這些更新步驟，以回應你收到的所有意見回饋。

處理完所有意見回饋且 pull request 獲得核准後，它會合併到 `angular/angular`。pull request 中的變更應該很快就會出現在文件中。

pull request 合併到 `angular/angular` 後，你可以[清理工作區](guide/doc-edit-finish)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
