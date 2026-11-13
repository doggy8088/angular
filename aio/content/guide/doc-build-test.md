# 建置並測試文件更新

<!-- markdownLint-disable MD001 -->
<!-- markdownLint-disable MD033 -->

完成文件更新後，你會想要在本地電腦上執行文件的端對端測試。這些測試是開啟 pull request 後所執行的部分測試。在本地電腦上執行這些測試，比開啟 pull request 後才執行，能更快發現端對端測試的失敗。

## 在本地電腦上建置文件

在測試更新後的文件之前，你會想要先建置它，以確保測試的是最新的變更。

#### 在本地電腦上建置文件

<!-- vale Angular.Google_WordListSuggestions = NO -->

請在本地電腦的命令列工具或 IDE 的 **terminal** 窗格中執行下列步驟。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1. 前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。
2. 在你的工作目錄中，執行這個指令以前往 `aio` 目錄。`aio` 目錄包含 Angular 的文件檔案與工具。

    <code-example language="shell">

    cd aio

    </code-example>

3. 執行這個指令以在本機建置文件。

    <code-example language="shell">

    yarn build

    </code-example>

這會從頭開始建置文件。

在本地電腦上建置文件後，你可以執行 angular.io 端對端測試。

## 在本地電腦上執行 angular.io 端對端測試

這個程序會執行開啟 pull request 後所執行的大部分測試，但並非全部。

#### 在本地電腦上執行 angular.io 端對端測試

在你的本地電腦上，於命令列工具或 IDE 的 **Terminal** 窗格中執行下列操作：

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄執行這個指令，以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  將 `working-branch` 替換為你的 `working` 分支名稱，並執行這個指令以簽出你的 `working` 分支。

    <code-example format="shell" language="shell">

    git checkout working-branch

    </code-example>

1.  執行這個指令以前往文件。

    <code-example format="shell" language="shell">

    cd aio

    </code-example>

1.  執行這些指令以執行端對端測試。

    <code-example format="shell" language="shell">

    yarn e2e
    yarn docs-test

    </code-example>

1.  留意測試可能回報的錯誤。

## 未回報錯誤

如果端對端測試未回報錯誤，且你的更新已通過[所有其他檢閱](guide/doc-editing#測試你的文件)，你的文件更新就可以提交 pull request 了。

開啟 pull request 後，GitHub 會測試 pull request 中的程式碼。GitHub 執行的測試包括你剛才執行的端對端測試，以及只在 GitHub 儲存庫中執行的其他測試。因此，即使你的更新在本地端通過了端對端測試，開啟 pull request 後仍可能回報錯誤。

## 回報錯誤

如果端對端測試在你的本地電腦上回報錯誤，請務必在開啟 pull request 之前修正它。如果更新在本地端未通過端對端測試，開啟 pull request 後所執行的測試也很可能失敗。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
