# 對文件主題進行變更並儲存

<!-- markdownLint-disable MD001 -->
<!-- markdownLint-disable MD033 -->

本主題說明你在變更文件時所執行的各項工作。

<div class="alert is-important">

**重要事項**：<br />
請在完成[為編輯建立工作分支](guide/doc-update-start#為編輯建立工作分支)中所述的工作分支建立後，再執行這些工作。

</div>

## 在正確的工作分支中工作

在變更任何檔案之前，請確認你正在正確的工作分支中工作。

#### 設定正確的編輯用工作分支

請在本地電腦的命令列工具中執行下列步驟。

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。請記得將 `personal` 替換為你的 GitHub 使用者名稱。
  
    <code-example language="shell">

    cd personal/angular

    </code-example>

1.  執行這個指令以簽出你的工作分支。將 `working-branch` 替換為你為文件議題所建立的分支名稱。

    <code-example language="shell">

    git checkout working-branch

    </code-example>

## 編輯文件

開始編輯前，請先檢閱 [Angular 文件風格指南](guide/styleguide)，了解如何在文件中撰寫與排版文字。

在你的工作分支中，編輯需要變更的檔案。大多數文件原始檔位於 `angular` 儲存庫的 `aio/content/guide` 目錄中。

Angular 開發工具可以在你進行變更時轉譯文件。

#### 在編輯時檢視轉譯後的文件

<!-- vale Angular.Google_WordListSuggestions = NO -->

請在本地電腦的命令列工具或 IDE 的 **terminal** 窗格中執行下列步驟。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1.  前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)。
1.  在你的工作目錄中，執行這個指令以前往 `aio` 目錄。`aio` 目錄包含 Angular 的文件檔案與工具。

    <code-example language="shell">

    cd aio

    </code-example>

1.  執行這個指令以在本機建置文件。

    <code-example language="shell">

    yarn build

    </code-example>

這會從頭開始建置文件，但不會提供服務。

1.  執行這個指令以提供文件服務並同步文件。

    <code-example language="shell">

    yarn serve-and-sync

    </code-example>

這會在 `http://localhost:4200` 於本機提供你的 angular.io 網站草稿，並監看文件檔案的變更。每次你儲存文件檔案的更新，位於 `http://localhost:4200` 的 angular.io 網站就會更新。儲存變更後，你可能需要重新整理瀏覽器才能看到變更。

### 文件程式碼檢查

如果你在本地電腦與 IDE 上安裝了 Vale，每次儲存 Markdown 檔案時，Vale 都會檢閱檔案是否有常見錯誤。Vale 是文件程式碼檢查工具（linter），會在 Visual Studio Code 的 **Problems** 窗格中回報它發現的錯誤。這些錯誤也會反映在文件原始碼中，盡可能靠近問題所在的位置。

有關文件程式碼檢查與解決檢查問題的更多資訊，請參閱[解決文件程式碼檢查工具訊息](guide/docs-lint-errors)。

## 儲存你的變更

當你在本地電腦上變更文件原始檔時，你的變更可能處於下列其中一種狀態。

*  **已變更，但未儲存**

這是你於整合式開發環境（IDE）中編輯檔案時，變更所處的狀態。

*  **已儲存，但未提交**

從 IDE 儲存檔案的變更後，變更會儲存到你的本地電腦。變更雖然已儲存，但尚未由 `git`（版本控制軟體）記錄為變更。在你檢閱進行中的工作時，檔案通常處於這個狀態。

*  **已提交，但未推送**

將變更提交到 `git` 後，變更會記錄為本地電腦上的一筆 *commit*，但尚未儲存到雲端。這是你取得一些進展並想將該進展儲存為一筆提交時的檔案狀態。

*  **已提交並已推送**

將提交推送到 `github.com` 上的個人儲存庫後，變更會由 `git` 記錄並儲存到雲端。它們尚未成為 `angular/angular` 儲存庫的一部分。這是檔案在開啟 pull request、讓它們成為 `angular/angular` 儲存庫的一部分之前所必須處於的狀態。

*  **已合併到 Angular**

pull request 核准並合併後，你所做的變更現在已成為 `angular/angular` 儲存庫的一部分，並出現在 [angular.io](https://angular.io) 網站上。你的文件更新已完成。

本節說明如何儲存你在工作目錄中對檔案所做的變更。如果你剛開始使用 `git` 與 GitHub，請仔細閱讀本節，了解如何在進行變更時儲存變更。

### 將變更儲存到你的本地電腦

如何儲存你在本地電腦上對檔案所做的變更，取決於你的 IDE。請參閱你的 IDE，了解儲存變更的具體程序。這個程序會讓你的變更處於 *已儲存，但未提交* 的狀態。

### 檢閱你轉譯後的主題

儲存文件主題的變更後、於本地電腦提交這些變更之前，請在瀏覽器中檢閱轉譯後的主題。

#### 在本地電腦的瀏覽器中轉譯你的變更

<!-- vale Angular.Google_WordListSuggestions = NO -->

請在本地電腦的命令列工具或 IDE 的 **terminal** 窗格中執行下列步驟。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)中的 `aio` 目錄。
請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example language="shell">

    cd personal/angular/aio

    </code-example>

1.  執行這個指令，以使用本地電腦上的檔案建置文件。

    <code-example language="shell">

    yarn build

    </code-example>

這個指令會從頭開始建置文件，但不會提供服務以供檢視。

1.  執行這個指令，以在本機提供文件服務，並在文件變更後重新建置。

    <code-example language="shell">

    yarn serve-and-sync

    </code-example>

這個指令會在 [`http://localhost:4200`](http://localhost:4200) 提供 Angular 文件服務。文件更新後，你可能需要重新整理瀏覽器，才能在瀏覽器中看到變更。

對變更感到滿意後，請在本地電腦上提交它們。

### 在本地電腦上提交你的變更

在本地電腦上儲存變更、準備好在本地電腦上提交變更後，請執行這個程序。

#### 在本地電腦上提交你的變更

<!-- vale Angular.Google_WordListSuggestions = NO -->

請在本地電腦的命令列工具或 IDE 的 **terminal** 窗格中執行下列步驟。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)中的 `aio` 目錄。請記得將 `personal` 替換為你的 GitHub 使用者名稱。
  
    <code-example language="shell">

    cd personal/angular/aio

    </code-example>

1.  執行這個指令以確認你已準備好提交變更。

    <code-example language="shell">

    git status

    </code-example>

`git status` 指令會傳回類似以下的輸出。

    <!-- Formatting this example as output hides the <file> text. -->
    <code-example language="none" hideCopy>

    On branch working-branch
    Your branch is up to date with 'origin/working-branch
    Changes not staged for commit:
      (use "git add &lt;file&gt;..." to update what will be committed)
      (use "git restore &lt;file&gt;..." to discard changes in working directory)
            modified:   content/guide/doc-build-test.md
            modified:   content/guide/doc-edit-finish.md
            modified:   content/guide/doc-editing.md
            modified:   content/guide/doc-pr-prep.md
            modified:   content/guide/doc-pr-update.md
            modified:   content/guide/doc-prepare-to-edit.md
            modified:   content/guide/doc-select-issue.md
            modified:   content/guide/doc-update-start.md

    no changes added to commit (use "git add" and/or "git commit -a")

    </code-example>

    1.  確認你位於正確的工作分支。

如果你不在正確的分支中，請將 `working-branch` 替換為你的工作分支名稱，然後執行 `git checkout working-branch` 以選取正確的分支。

    1.  檢閱清單中的已修改檔案。確認它們是你已變更並儲存、但尚未提交的檔案。已修改檔案的清單會因你編輯的內容而有所不同。

1.  執行這個指令以加入你想要提交的檔案。將 `filename` 替換為 `git status` 輸出中的檔案名稱。

    <code-example language="shell">

    git add filename

    </code-example>

你可以在單一指令中使用檔名參數中的萬用字元來加入多個檔案。你也可以執行這個指令，將所有由 `git` 追蹤的已變更檔案加入提交，如這個範例所示，使用 `*` 檔名。

    <code-example language="shell">

    git add *

    </code-example>

    <div class="alert is-important">

    **重要事項**：<br />
    未受 `git` 追蹤的檔案不會提交或推送到你在 `github.com` 上的儲存庫，也不會出現在你的 pull request 中。

    </div>

1.  再次執行 `git status`。

    <code-example language="shell">

    git status

    </code-example>

1.  檢閱輸出並確認已準備好提交的檔案。

    <!-- Formatting this example as output hides the <file> text. -->
    <code-example language="none" hideCopy>

    On branch working-branch
    Your branch is up to date with 'origin/working-branch'.

    Changes to be committed:
      (use "git restore --staged &lt;file&gt;..." to unstage)
      modified:   content/guide/doc-build-test.md
      modified:   content/guide/doc-edit-finish.md
      modified:   content/guide/doc-editing.md
      modified:   content/guide/doc-pr-prep.md
      modified:   content/guide/doc-pr-update.md
      modified:   content/guide/doc-prepare-to-edit.md
      modified:   content/guide/doc-select-issue.md
      modified:   content/guide/doc-update-start.md

    </code-example>

1.  執行這個指令以將變更的檔案提交到你的本地電腦。`-m` 參數後方的提交訊息必須以 `docs:` 加上一個空格開頭，再接上你的訊息。將 `detailed commit message` 替換為描述你所做變更的訊息。

    <code-example language="shell">

    git commit -m 'docs: detailed commit message'

    </code-example>

有關 Angular 提交訊息的更多資訊，請參閱[為 pull request 設定提交訊息格式](guide/doc-pr-prep#為-pull-request-設定提交訊息格式)。

你對文件的變更現在處於 *已提交，但未推送* 的狀態。

### 將提交推送到雲端

在本地電腦上提交變更後，這個程序會將這些提交推送到雲端中的 `origin` 儲存庫。

#### 將變更推送到雲端中的 origin 儲存庫

<!-- vale Angular.Google_WordListSuggestions = NO -->

請在本地電腦的命令列工具或 IDE 的 **terminal** 窗格中執行下列步驟。

<!-- vale Angular.Google_WordListSuggestions = YES -->

1.  從你的[工作區](guide/doc-prepare-to-edit#在本地電腦上建立-git-工作區)目錄，執行這個指令以前往你的[工作目錄](guide/doc-prepare-to-edit#doc-working-directory)中的 `aio` 目錄。請記得將 `personal` 替換為你的 GitHub 使用者名稱。
  
    <code-example language="shell">

    cd personal/angular/aio

    </code-example>

1.  執行這個指令以確認你使用的是正確的分支。

    <code-example language="shell">

    git status

    </code-example>

如果你不在正確的分支中，請將 `working-branch` 替換為你的工作分支名稱，並執行 `git checkout working-branch` 以選取正確的分支。

Git status 也會顯示你的本地電腦上是否有尚未推送到雲端的變更。

    <code-example language="none" hideCopy>

    On branch working-branch
    Your branch is ahead of 'origin/working-branch' by 1 commit.
      (use "git push" to publish your local commits)

    </code-example>

這個範例輸出表示本地電腦上有一筆提交尚未進入 `origin` 儲存庫上的 `working-branch` 分支。`origin` 是 GitHub 中的 `personal/angular` 儲存庫。下一個指令會將該提交推送到 `origin` 儲存庫。

1.  執行這個指令，以將本地電腦上的提交推送到雲端中你在 GitHub 上的帳號。

    <code-example language="shell">

    git push

    </code-example>

如果你是第一次從這個分支推送提交，你可能會看到類似以下的訊息。

    <code-example language="none" hideCopy>

    fatal: The current branch working-branch has no upstream branch.
    To push the current branch and set the remote as upstream, use

        git push --set-upstream origin working-branch

    To have this happen automatically for branches without a tracking
    upstream, see 'push.autoSetupRemote' in 'git help config'.

    </code-example>

如果你收到這個訊息，請複製訊息提供的指令，並如這裡所示執行它：

    <code-example language="shell">

    git push --set-upstream origin working-branch

    </code-example>

你在本地電腦上 `working-branch` 分支中所做的變更已儲存到 `github.com`。你對文件的變更現在處於 *已提交並已推送* 的狀態。

## 測試你的文件

更新文件以修正你選擇的議題後，你就可以測試文件了。測試文件包括：

* **文件程式碼檢查**

每次開啟並儲存文件主題時，文件程式碼檢查工具都會檢查常見錯誤。有關文件程式碼檢查的更多資訊，請參閱[解決文件程式碼檢查工具訊息](guide/docs-lint-errors)。

* **人工檢閱**

文件更新完成後，請請他人檢閱你的變更。如果你更新了技術內容，也請請該主題的領域專家檢閱你的更新。

* **自動化測試**

Angular 文件會在你開啟 pull request 後自動測試。pull request 通過測試後才能合併。有關自動化文件測試的更多資訊，請參閱[測試文件更新](/guide/doc-build-test)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
