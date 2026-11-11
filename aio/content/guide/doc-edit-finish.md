# 完成文件 pull request 的收尾工作

<!-- markdownLint-disable MD001 -->

本主題說明 pull request 合併並關閉後，如何讓工作區保持整潔。

## 檢閱上游儲存庫的提交記錄

這個程序確認你的提交現在位於 `angular/angular` 儲存庫的 `main` 分支中。

#### 在 <code>github.com</code> 上檢閱你的提交的提交記錄

在網頁瀏覽器中，開啟 [`https://github.com/angular/angular/commits/main`](https://github.com/angular/angular/commits/main)。

1.  檢閱提交清單。
    1.  找到包含你的 GitHub 使用者名稱、提交訊息與你的提交的 pull request 編號的項目。由於提交的合併方式，提交編號可能與你的工作分支中的提交不符。

    1.  如果你看到自己的提交列在清單中，表示你的提交已合併到 `angular/angular`，你可以繼續清理工作區。

    1.  如果你在清單中看不到自己的提交，你可能需要稍候再重試這個步驟。在看到你的提交列在包含 `origin/main` 的記錄項目中或之後之前，請勿繼續清理工作區。

    1.  如果你看到自己的提交列在包含 `origin/main` 的記錄項目上方，那麼你可能需要再次更新你的 `angular/angular` 儲存庫複本。

## 從上游儲存庫更新你的 fork

看到 pull request 的提交已合併到上游 `angular/angular` 儲存庫後，請更新你的 fork。

這個程序會更新你本地電腦上的 `personal/angular` 複本，然後再更新雲端中的儲存庫。

#### 使用上游儲存庫更新你的 fork

請在本地電腦的命令列工具中執行下列步驟。

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1. 執行這個指令，以從上游 `angular/angular` 儲存庫更新本地電腦上 `working` 目錄中的 `main` 分支。

    <code-example format="shell" language="shell">

    git fetch upstream
    git merge upstream/main

    </code-example>

1.  執行這個指令，以上游 `angular/angular` 儲存庫的最新內容更新 `github.com` 上的 `personal/angular` 儲存庫。

    <code-example format="shell" language="shell">

    git push

    </code-example>

1. 執行這個指令以檢閱你的 fork 的提交記錄。

你本地電腦上的 `main` 分支與 `github.com` 上的 origin 儲存庫現在已與上游 `angular/angular` 儲存庫同步。執行這個指令以列出最近的提交。

    <code-example format="shell" language="shell">

    git log --pretty=format:"%h %as %an %Cblue%s %Cgreen%D"

    </code-example>

1.  在前一個 `git log` 指令的輸出中，找到包含你的 GitHub 使用者名稱、提交訊息與你的提交的 pull request 編號的項目。由於提交的合併方式，提交編號可能與你的工作分支中的提交不符。

你應該會在包含 `upstream/main` 的記錄項目中或附近找到 pull request 的提交。

如果你在正確的位置找到 pull request 的提交，就可以繼續刪除工作分支。

## 刪除工作分支

確認 pull request 已合併到 `angular/angular` 並出現在你的 fork 的 `main` 分支後，就可以刪除 `working` 分支。

由於你的工作分支已合併到你的 fork 的 `main` 分支，且 pull request 已關閉，你不再需要 `working` 分支。留著它以備不時之需或許很誘人，但可能沒有必要。如果你保留所有舊的工作分支，儲存庫可能會累積不必要的雜亂。

#### 刪除你的工作分支

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  執行這個指令以刪除本地電腦上用於 pull request 的工作分支。將 `working-branch-name` 替換為你的工作分支名稱。

    <code-example format="shell" language="shell">

    git branch -d working-branch-name

    </code-example>

1.  執行這個指令以刪除 `github.com` 上 `personal/angular` 儲存庫中的工作分支。將 `working-branch-name` 替換為你的工作分支名稱。

    <code-example format="shell" language="shell">

     git push -d origin working-branch-name

    </code-example>

## 下一步

刪除最後一個議題的工作分支後，你就可以[選擇另一個要解決的議題](guide/doc-select-issue)了。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
