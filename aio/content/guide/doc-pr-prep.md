# 為 pull request 準備文件更新

本主題說明如何準備你對 Angular 文件的更新，以便開啟 pull request。pull request 是你分享更新的方式，讓它可以合併到 `angular/angular` 儲存庫中。

<div class="alert is-important">

**重要事項**：<br />
請確認你已檢閱文件更新、移除任何程式碼檢查錯誤，並確認它通過端對端（e2e）測試且沒有錯誤。

</div>

pull request 會將你 fork 的儲存庫 `personal/angular` 中的一個分支分享給 `angular/angular` 儲存庫。pull request 核准並合併後，你分支中的新提交會加入 `angular/angular` 儲存庫中的 main 分支。你分支中的提交及其訊息會成為 `angular/angular` 儲存庫的一部分。

這對你的 pull request 意味著什麼？

1.  你的提交訊息會成為 Angular 變更記錄文件的一部分。由於它們會成為 `angular/angular` 儲存庫的一部分，因此必須符合特定格式，以便易於閱讀。如果格式不正確，你可以在開啟 pull request 之前修正。

1.  你可能需要壓縮（squash）在開發更新時所做的提交。在開發大型更新時，將變更儲存為中間提交是很正常的，但你的 pull request 只代表對 `angular/angular` 儲存庫的一項變更。將工作分支中的提交壓縮為較少或僅一筆提交，可以讓 pull request 中的提交與你的更新對 `angular/angular` 儲存庫所做的變更相符。

## 為 pull request 設定提交訊息格式

合併到 `angular/angular` 的提交必須有格式正確的訊息。本節說明如何正確設定提交訊息的格式。

請記得，提交訊息與 pull request 註解是不同的。

### 單行提交訊息

最簡單的提交訊息是單行文字。更新文件的 pull request 中的所有提交訊息都必須以 `docs:` 開頭，後接變更的簡短說明。

以下是一個有效的 Angular 提交訊息範例。

<code-example language="none" hideCopy>

docs: a short summary in present tense without capitalization or ending period

</code-example>

這是使用前一個範例中的單行提交訊息的提交指令範例。

<code-example format="shell" language="shell">

git commit -m "docs: a short summary in present tense without capitalization or ending period"

</code-example>

### 多行提交訊息

你可以提供更詳細的多行訊息來包含更多資訊。訊息詳細的內文必須以一個空行與摘要分隔。列出提交所修正的議題的頁尾，也必須以一個空行與內文分隔。

<code-example language="none" hideCopy>

docs: a short summary in present tense without capitalization or ending period

A description of what was fixed, and why.
This description can be as detailed as necessary and can be written with
appropriate capitalization and punctuation

Fixes &num;34353

</code-example>

這是使用前一個範例中的多行提交訊息的提交指令範例。

<code-example format="shell" language="shell">

git commit -m "docs: a short summary in present tense without capitalization or ending period

A description of what was fixed, and why.
This description can be as detailed as necessary and can be
written with appropriate capitalization and punctuation.

Fixes &num;34353"

</code-example>

這個範例僅適用於文件更新。有關 Angular 提交訊息的完整規格，請參閱[提交訊息格式](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)。

### 變更提交訊息

如果你最近一次提交的訊息格式不正確，你可以更新該訊息。變更較早提交或多筆提交的訊息也是可能的，但需要更複雜的程序。

執行這個指令以變更最近一次提交的提交訊息。新的提交訊息會依照前述程序中說明的格式設定。

<code-example format="shell" language="shell">

git commit --amend -m "New commit message"

</code-example>

這個指令會在你的本地電腦上建立一筆新的提交，取代先前的提交。在開啟 pull request 之前，你必須推送這筆新的提交。如果你已將原始提交推送到 GitHub 帳號中的儲存庫，請執行這個指令以強制推送帶有新訊息的提交。

<code-example format="shell" language="shell">

git push --force-with-lease

</code-example>

如果你尚未推送已修改的提交，可以不帶參數執行 `git push` 來推送更新後的提交。

## 為 pull request 準備你的分支

為更新文件而建立工作分支時，你是從 `main` 分支分支出來的。你在工作分支中的變更，是以建立分支時 `main` 分支的狀態為基礎。

自你建立工作分支以來，`main` 分支很可能已經更新。為確保你的更新能與目前的 `main` 分支搭配運作，你應該將工作分支進行 `rebase`，使其跟上最新狀態。你可能也需要壓縮工作分支中的提交，以便為 pull request 合併它們。

### 將你的工作分支 rebase

<!-- markdownLint-disable MD033 -->

將工作分支 rebase 會把你的提交的起始點，從開始時的 `main` 分支位置變更為現在的位置。

在 rebase 工作分支之前，你必須同時更新上游儲存庫的 *clone* 與 *fork*。

#### 為什麼要 rebase 你的工作分支

將工作分支 rebase 到 `main` 分支的目前狀態，可以在工作分支合併回 `main` 之前消除衝突。透過 rebase 工作分支，工作分支中的提交只會顯示你為修正議題所做的變更。如果你不 rebase 工作分支，它可能會包含合併提交。合併提交是 `git` 為彌補自 `working` 分支建立以來 `main` 分支中的變更而建立的提交。合併提交並無害處，但可能會讓未來的變更檢閱變得複雜。下圖說明了 rebase 的過程。

這張圖片顯示一個從 `main` 分支的提交 5 所建立、然後更新了兩次的 `working` 分支。這些圖表中的編號圓圈代表提交。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="Git 儲存庫的圖片：自主要分支建立工作分支" src="generated/images/guide/doc-pr-prep/feature-with-new-branch.png">

</div>

這張圖片顯示 `main` 分支在 `working` 分支更新期間也更新了兩次之後的樣子。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="Git 儲存庫的圖片：工作分支與已更新的主要分支" src="generated/images/guide/doc-pr-prep/feature-branch-w-update.png">

</div>

如果合併工作分支，就需要一筆合併提交。這張圖片說明了結果。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="Git 儲存庫的圖片：工作分支已合併到主要分支" src="generated/images/guide/doc-pr-prep/feature-branch-w-merge.png">

</div>

為了方便未來的貢獻者，Angular 團隊會盡量讓提交記錄保持為線性的變更序列。納入合併提交時，會連同作者或開發者所做的變更，一併包含合併所產生的變更。這會讓未來的開發者與作者更難分辨內容是如何演變的。

若要建立線性的變更序列，你可能需要更新 `working` 分支並更新你的變更。若要將你的更新加入 `main` 分支的目前狀態並防止合併提交，你可以 rebase `working` 分支。

Rebase 是 `git` 更新你的工作分支、讓它看起來像是你從提交 `9` 建立它的方法。為此，它會更新 `working` 分支中的提交。rebase `working` 分支後，它的提交現在會從 `main` 分支的最後一筆提交開始。

這張圖片顯示 rebase 後的 `working` 分支及其更新後的提交。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="Git 儲存庫的圖片：已更新的工作分支" src="generated/images/guide/doc-pr-prep/feature-branch-w-rebase.png">

</div>

rebase 後的 `working` 分支合併到 main 時，它的提交現在可以直接附加到 `main` 分支，而不需要額外的合併提交。

這張圖片顯示合併更新並 rebase 後的 `working` 分支之後，線性的 `main` 分支。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="Git 儲存庫的圖片：已更新的工作分支" src="generated/images/guide/doc-pr-prep/feature-branch-merged.png">

</div>

#### 更新你的上游儲存庫 fork

在開啟 pull request 之前，你會想要將 origin 儲存庫的 `main` 分支與上游 `angular/angular` 的 `main` 分支同步。

這個程序會更新你本地電腦上的 origin 儲存庫（`personal/angular` 儲存庫），使其具備目前的程式碼，如這裡所示。圈選的數字對應程序步驟。這個程序的最後一個步驟會將更新推送到你 GitHub 帳號中 `angular` 的 fork。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="用於更新本機電腦的 git fetch／merge／push 流程圖片" src="generated/images/guide/doc-pr-prep/github-fetch-merge.png">

</div>

請在本地電腦的命令列工具中執行下列步驟。

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  從上游 `angular/angular` 儲存庫更新本地電腦上 `working` 目錄中的 `main` 分支。

    <code-example format="shell" language="shell">

    git fetch upstream
    git merge upstream/main

    </code-example>

1.  以上游 `angular/angular` 儲存庫的最新內容更新 `github.com` 上的 `personal/angular` 儲存庫。

    <code-example format="shell" language="shell">

    git push

    </code-example>

你本地電腦上的 `main` 分支與 `github.com` 上的 origin 儲存庫現在已同步。它們已更新為自你上次更新 fork 以來，上游 `angular/angular` 儲存庫的任何變更。

#### rebase 你的工作分支

請在本地電腦的命令列工具中執行下列步驟。

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出你的 `working` 分支。將 `working-branch` 替換為你的 `working` 分支名稱。

    <code-example format="shell" language="shell">

    git checkout working-branch

    </code-example>

1.  執行這個指令以 rebase 你的分支，將 `working` 分支中的提交加入 `main` 分支的目前內容。

    <code-example format="shell" language="shell">

    git rebase main

    </code-example>

1.  執行這個指令以更新你 GitHub 帳號中儲存庫裡的 `working` 分支。

    <code-example format="shell" language="shell">

    git push --force-with-lease

    </code-example>

### 檢閱工作分支中的提交

rebase `working` 分支後，你的提交應該位於目前 `main` 分支的提交之後。

#### 檢閱你加入 `working` 分支的提交

請在本地電腦的命令列工具中執行下列步驟。

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以確認你使用的是正確的 `working` 分支。如果你不在正確的分支中，請將 `working-branch` 替換為你的 `working` 分支名稱，並執行 `git checkout working-branch` 以選取正確的分支。

    <code-example format="shell" language="shell">

    git status

    </code-example>

1.  檢閱前一個 `git status` 指令的訊息。如果你不在正確的分支中，請將 `working-branch` 替換為你的 `working` 分支名稱，並執行 `git checkout working-branch` 以選取正確的分支。

1.  執行這個指令以取得 `working` 分支中的提交清單。

    <code-example format="shell" language="shell">

    git log --pretty=format:"%h %as %an %Cblue%s %Cgreen%D"

    </code-example>

這個指令會傳回 `working` 分支中的提交記錄，最近的提交位於清單頂部。

1.  在前一個 `git log` 指令的輸出中，找到包含 `upstream/main` 的項目。它應該位於清單頂部附近。

    1.  **確認包含 `upstream/main` 的項目同時包含 `origin/main` 與 `main`**

如果沒有，你必須重新同步 `angular/angular` 的 clone 與 fork，然後再繼續之前 rebase 該分支。

    1.  **確認你的更新的所有提交都位於包含 `upstream/main` 的項目之後**

請記得，記錄輸出的顯示方式是最近的提交在最前面。你的提交都應該位於記錄輸出中包含 `upstream/main` 的項目上方。如果你的任何提交列在包含 `upstream/main` 的項目之後，表示你的 `working` 分支中的提交不知何故混在一起了。在開啟 pull request 之前，你必須修正該分支。

    1.  **確認你的提交訊息格式正確**

提交訊息格式會由自動化測試進行測試，pull request 獲得核准之前，格式必須正確。

    1.  **確認你的提交及其訊息反映了你的更新對 Angular 所做的變更**

如果你的提交比變更還多，在 pull request 獲得核准之前，你可能需要將它們壓縮為較少的提交。

## 下一步

確認你的更新與 `working` 分支正確無誤後，你就可以[開啟 pull request](guide/doc-pr-open)了。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
