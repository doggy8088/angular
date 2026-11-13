# 開始編輯文件主題

<!-- markdownLint-disable MD001 -->

本主題說明你開始處理文件議題時所執行的工作。

angular.io 中的文件是由 [Markdown](https://en.wikipedia.org/wiki/Markdown) 原始碼檔案建置而成的。Markdown 原始碼檔案儲存在你 fork 到 GitHub 帳號的 `angular` 儲存庫中。

若要更新 Angular 文件，你需要：

*   `personal/angular` 的一個 clone

你是在[建立工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)時建立它的。開始編輯主題之前，請先[更新你的 `personal/angular` 複本](#使用上游儲存庫更新你的-fork)。

*   一個從最新的 `main` 分支建立的 `working` 分支。

建立 `working` 分支的方法於[本主題稍後](#為編輯建立工作分支)說明。

<!-- markdownLint-disable MD033 -->

本主題中的程序假設你本地電腦上的檔案是依照下圖所示的方式組織的。在你的本地電腦上，你應該有：

*   你的「git」工作區目錄。在這個範例中，你的「git」工作區目錄的路徑為 `github-projects`。

*   你的工作目錄，也就是你將 fork 複製到 `git` 工作區時所建立的目錄。在這個範例中，你的工作目錄的路徑為 `github-projects/personal/angular`，其中 `personal` 應替換為你的 GitHub 使用者名稱。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="本機電腦上工作目錄的圖片" src="generated/images/guide/doc-update-start/pc-directory-config.png">

</div>

<div class="alert is-important">

**重要事項**：<br />
請記得在本主題的指令與範例中，將 `personal` 替換為你的 GitHub 使用者名稱。

</div>

本主題中的程序假設你是從工作區目錄開始的。

## 使用上游儲存庫更新你的 fork

在開始編輯文件檔案之前，你會想要將你的 fork 及其 clone 的 `main` 分支與上游 `angular/angular` 儲存庫的 `main` 分支同步。

這個程序會更新雲端中的 `personal/angular` 儲存庫及其在本地電腦上的 clone，如這裡所示。圈選的數字對應程序步驟。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="用於更新本機電腦的 git fetch／merge／push 流程圖片" src="generated/images/guide/doc-update-start/github-fetch-merge.png">

</div>

#### 使用上游儲存庫更新你的 fork 及其 clone

請在本地電腦的命令列工具中執行下列步驟。

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。這個步驟未顯示於圖片中。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出 `main` 分支。這個步驟未顯示於圖片中。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  執行這個指令，以從上游 `angular/angular` 儲存庫更新本地電腦上工作目錄中的 `main` 分支。

    <code-example format="shell" language="shell">

    git fetch upstream
    git merge upstream/main

    </code-example>

1.  執行這個指令，以上游 `angular/angular` 儲存庫的最新內容更新 `github.com` 上的 `personal/angular` 儲存庫。

    <code-example format="shell" language="shell">

    git push

    </code-example>

你本地電腦上的 `main` 分支現在已與 `github.com` 上的 origin 儲存庫同步。它們已更新為自你上次更新 fork 以來，上游 `angular/angular` 儲存庫的任何變更。

## 為編輯建立工作分支

你對 Angular 文件的所有編輯，都是在本地電腦上 `personal/angular` 的 clone 中的 `working` 分支內進行的。你會從本地電腦上 `personal/angular` 的最新 `main` 分支建立工作分支。

工作分支會讓你對 Angular 文件的變更與已發佈的文件分開，直到準備就緒為止。工作分支也會讓你針對一個議題的編輯與針對另一個議題的編輯分開。最後，工作分支可以識別你在完成後所提交的 pull request 中所做的變更。

<div class="alert is-important">

**重要事項**：<br />
在編輯任何 Angular 文件之前，請確認你使用的是正確的 `working` 分支。
你可以在開始編輯之前，從你的 `working` 目錄執行 `git status` 來確認目前的分支。

</div>

#### 為編輯建立 `working` 分支

請在本地電腦的命令列程式中執行下列步驟。

1.  [更新你的 `angular/angular` fork](#使用上游儲存庫更新你的-fork)。
1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  執行這個指令以建立你的工作分支。將 `working-branch` 替換為你的工作分支名稱。

將你的工作分支命名為與編輯工作相關的名稱，例如，如果你要解決 `issue #12345`，你可以將分支命名為 `issue-12345`。如果你要改善錯誤訊息，你可以將其命名為 `error-message-improvements`。分支名稱可以包含英數字元、連字號、底線與斜線，但不能有任何空格或其他特殊字元。

    <code-example format="shell" language="shell">

    git checkout -b working-branch

    </code-example>

1.  執行這個指令，以在雲端中 `github.com` 上的儲存庫中建立你的工作分支的一份複本。請記得將 `working-branch` 替換為你的工作分支名稱。

    <code-example format="shell" language="shell">

    git push --set-upstream origin working-branch

    </code-example>

## 編輯文件

建立工作分支後，你就可以開始編輯與建立主題了。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
