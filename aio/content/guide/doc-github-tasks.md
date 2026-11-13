# 編輯 angular.io 的常見 GitHub 工作

<!-- markdownLint-disable MD001 -->
<!-- markdownLint-disable MD033 -->

以下是在編輯 Angular 文件時會執行的一些常見 `git` 工作。

本主題的程序假設你本機電腦上的檔案是按照下圖所示的方式組織。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="本機電腦上工作目錄的圖片" src="generated/images/guide/doc-github-tasks/pc-directory-config.png">

</div>

<div class="alert is-important">

**重要事項**：<br />
請記得把本主題指令與範例中的 `personal` 換成你的 GitHub 使用者名稱。

</div>

*   這些程序假設你的工作目錄都位於單一的 `workspace` 目錄中，也就是
    *   上游 repo `angular/angular` 的本機 `working` 目錄位於 `workspace` 目錄下 `angular` 子目錄中的 `angular` 子目錄內
    *   origin repo `personal/angular` 的本機 `working` 目錄位於 `workspace` 目錄下 `personal` 子目錄中的 `angular` 子目錄內
*   這些程序假設你從 `workspace` 目錄開始操作

## 更新你複製的上游 repo

上游 repo 是 `angular/angular` repo。
隨著它更新（例如合併 pull request），你的複製就會落後。
為了讓你的 `angular/angular` 複製保持最新，請每天執行這個程序。

這個程序會更新你本機電腦上的 `angular/angular` repo **複製**，讓它擁有最新的程式碼，如下圖所示。
圖中圈起來的數字對應到程序步驟。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="用於更新本機電腦的 git pull 流程圖片" src="generated/images/guide/doc-github-tasks/github-sync-upstream.png">

</div>

#### 更新你複製的上游 repo

1.  從你的 `workspace` 目錄，前往上游 repo 的 `working` 目錄。

    <code-example format="shell" language="shell">

    cd angular/angular

    </code-example>

1.  切換到 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  用上游 `angular/angular` repo 中的任何變更，更新你本機電腦 `working` 目錄中的 `main` 分支。

    <code-example format="shell" language="shell">

    git pull

    </code-example>

你本機電腦上複製的 `main` 分支與 `github.com` 上的上游 repo 現在已經同步。
現在也是更新你的 fork 的好時機。

## 用上游 repo 更新你的 fork

你應該至少每天把你的 fork 的 `main` 分支與上游 `angular/angular` repo 的 `main` 分支同步一次。
這是每天開始工作時值得做的事。
請在更新你複製的上游 repo 之後、開始編輯 Angular 文件之前，先同步你的 fork。

這個程序會更新你本機電腦上的 `angular/angular` repo **fork**，讓它擁有最新的程式碼，如下圖所示。
圖中圈起來的數字對應到程序步驟。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="用於更新本機電腦的 git fetch／merge／push 流程圖片" src="generated/images/guide/doc-github-tasks/github-fetch-merge.png">

</div>

#### 用上游 repo 更新你的 fork

1.  從你的 workspace 目錄，前往你的 working 目錄。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  切換到 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  用上游 `angular/angular` repo 的內容，更新你本機電腦 `working` 目錄中的 `main` 分支。

    <code-example format="shell" language="shell">

    git fetch upstream
    git merge upstream/main

    </code-example>

1.  用上游 `angular/angular` repo 的最新內容，更新你在 `github.com` 上的 `personal/angular` repo。

    <code-example format="shell" language="shell">

    git push

    </code-example>

你本機電腦上的 `main` 分支與你在 `github.com` 上的 *origin* repo 現在已經同步。
它們已經更新了自你上次更新 fork 以來，上游 `angular/angular` repo 的所有變更。

## 建立用於編輯的工作分支

你在 Angular 文件上的幾乎所有編輯工作都是這樣進行的：

*   在你的 `angular/angular` fork 的複製中進行，而不是在你的 `angular/angular` 複製中
*   在從 `main` 分支建立的 `working` 或 `feature` 分支中進行

如果不清楚，請參閱[關於分支的更多說明](#關於分支的更多說明)。

在你開始編輯 Angular 文件之前，請先：

1.  [更新你複製的 `angular/angular`](#更新你複製的上游-repo)。
1.  [更新你 fork 的 `angular/angular`](#用上游-repo-更新你的-fork)。
1.  從 `main` 分支建立一個工作分支。

工作分支讓你能追蹤自己對 Angular 文件所做的變更。
你也需要一個獨立的分支，才能用 pull request 提交這些變更。
建立工作分支也能讓某一次更新的變更與另一次更新的變更分開。

<div class="alert is-informational">

**注意**：<br />
在編輯 Angular 文件之前，請確認你使用的是正確的 `working` 分支。
你可以在開始編輯前，從 `working` 目錄執行 `git status` 來確認目前的分支。

</div>

#### 建立用於編輯的 `working` 分支

1.  [更新你複製的 `angular/angular`](#更新你複製的上游-repo)。
1.  [更新你 fork 的 `angular/angular`](#用上游-repo-更新你的-fork)。
1.  從你的 `workspace` 目錄，前往你的 `working` 目錄。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  切換到 `main` 分支。

    <code-example format="shell" language="shell">

    git checkout main

    </code-example>

1.  建立你的新分支。
    請把 `new-branch` 換成你的新分支名稱。

    請用與你的編輯工作相關的名稱為分支命名，例如，如果你要解決 `issue #12345`，可以把分支命名為 `issue-12345`。
    如果你要改善錯誤訊息，可以把它命名為 `error-message-improvements`。
    分支名稱可以使用英數字元、連字號、底線與斜線，但不能包含空格或其他特殊字元。

    <code-example format="shell" language="shell">

    git checkout -b new-branch

    </code-example>

1.  把新分支推送到你在 `github.com` 上的 repo，這樣你在雲端就有一份複製。
    請記得把 `new-branch` 換成你的新分支名稱。

    <code-example format="shell" language="shell">

    git push --set-upstream origin new-branch

    </code-example>

## 儲存你的變更

本節說明如何儲存你在 Angular repo fork 的工作目錄中對檔案所做的變更。
如果你剛開始使用 git 與 GitHub，請仔細閱讀本節，了解在進行變更時如何儲存它們。

當你在 Angular repo fork 的工作目錄中變更檔案時，你的變更可能處於下列狀態：

* **已修改但尚未儲存**

    這是你在整合式開發環境（IDE）中編輯檔案時，變更所處的狀態。
    這是你在 IDE 中進行變更時，變更所處的狀態。

* **已儲存但尚未提交**

    在 IDE 中儲存檔案的變更後，它們會儲存到你的本機電腦。
    雖然變更已經儲存，但版本控制軟體 `git` 尚未把它們記錄為一次變更。
    當你檢視進行中的工作時，你的檔案通常處於這個狀態。

* **已提交但尚未推送**

    把變更提交到 `git` 之後，你的變更會記錄為你本機電腦上的一次 *commit*，但尚未儲存到雲端。
    當你達到一個里程碑並在本地儲存進度時，你的檔案就是這個狀態。

* **已提交且已推送**

    把你的 commit 推送到你在 `github.com` 上的個人 repo 之後，你的變更已經由 `git` 記錄並儲存到雲端。它們還不是 `angular/angular` repo 的一部分。
    這是你的檔案在開啟 pull request、讓變更成為 `angular/angular` repo 一部分之前，必須處於的狀態。

* **已合併到 Angular**

    你的 pull request 獲得核准並合併後，你所做的變更現在就是 `angular/angular` repo 的一部分了。

### 把變更儲存到你的本機電腦

如何把檔案的變更儲存到你的本機電腦，取決於你的 IDE。
請參閱你的 IDE，了解儲存變更的具體程序。

### 在你的本機電腦上提交變更

在你的本機電腦上儲存變更、準備好把變更提交到本機電腦的 `git` 之後，請執行這個程序。

#### 在你的本機電腦上提交變更

1.  從你的 workspace 目錄，前往你的 working 目錄。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  確認你使用的是正確的分支。
    如果你不在正確的分支上，請執行 `git checkout branch-name` 來選取正確的分支。

    <code-example format="shell" language="shell">

    git status

    </code-example>

1.  檢查要加入提交的檔案清單是否正確。

    <code-example format="shell" language="shell">

    git status

    </code-example>

1.  加入你要提交的檔案。

    <code-example format="shell" language="shell">

    git add filename

    </code-example>

    你可以在檔名參數中使用萬用字元，用單一指令加入多個檔案。
    你也可以如這個範例所示，使用 `--all` 選項，把所有已經由 `git` 追蹤的變更檔案加入提交。

    <code-example format="shell" language="shell">

    git add --all

    </code-example>

1.  把變更提交到本機電腦。
    請把 `detailed-commit-comment` 換成描述你所做變更的具體說明。

    <code-example format="shell" language="shell">

    git commit -m 'docs: detailed-commit-comment'

    </code-example>

### 把變更推送到雲端你的 GitHub 帳號

把變更提交到你的本機電腦之後，這個程序會把你的 commit 儲存到雲端你的 GitHub 帳號。

#### 把變更推送到雲端你的 GitHub 帳號

1.  從你的 `workspace` 目錄，前往你的 `working` 目錄。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  確認你使用的是正確的分支。
    如果你不在正確的分支上，請執行 `git checkout branch-name` 來選取正確的分支。

    <code-example format="shell" language="shell">

    git status

    </code-example>

1.  把你本機電腦上的 commit 推送到雲端你在 GitHub 上的帳號。

    <code-example format="shell" language="shell">

    git push

    </code-example>

    如果這是你第一次從這個分支推送 commit，你可能會看到這樣的訊息。

    <code-example format="shell" language="shell">

    fatal: The current branch my-new-branch has no upstream branch.
    To push the current branch and set the remote as upstream, use

        git push --set-upstream origin my-new-branch

    To have this happen automatically for branches without a tracking
    upstream, see 'push.autoSetupRemote' in 'git help config'.

    </code-example>

    如果你看到這個訊息，請複製訊息提供的指令並執行，如下所示：

    <code-example format="shell" language="shell">

    git push --set-upstream origin my-new-branch

    </code-example>

### 開啟 pull request，把變更合併到 `angular/angular`

關於準備變更以開啟 pull request 的資訊，請參閱[為 pull request 準備文件](guide/doc-pr-prep)。

## 讓你的分支保持最新

如果你的文件變更花費超過一天，`angular/angular` repo 可能在你編輯期間發生變化。
在你能合併變更之前，必須先把它們建立在最新程式碼的基礎上。
你必須在完成所有變更之後、開啟 pull request 之前，更新你的工作分支。
你可能也會想在編輯期間讓工作分支保持更新。
無論如何，更新分支的程序都相同。

#### 讓你的分支保持最新

1.  [更新你複製的 `angular/angular`](#更新你複製的上游-repo)。
1.  [更新你 fork 的 `angular/angular`](#用上游-repo-更新你的-fork)。
1.  從你的 workspace 目錄，前往你的 working 目錄。

    <code-example format="shell" language="shell">

    cd personal/angular

    </code-example>

1.  確認你使用的是正確的分支。
    如果你不在正確的分支上，請執行 `git checkout branch-name` 來選取正確的分支。

    <code-example format="shell" language="shell">

    git status

    </code-example>

    如果你有任何未提交的變更，請先[在你的本機電腦上提交變更](#在你的本機電腦上提交變更)，再繼續。

1.  對你的分支執行 rebase，把你分支中的變更加入 `main` 分支目前的內容。

    <code-example format="shell" language="shell">

    git rebase main

    </code-example>

1.  更新雲端你的 repo 中的分支。

    <code-example format="shell" language="shell">

    git push --force-with-lease

    </code-example>

## 關於分支的更多說明

`git` 是一種版本控制系統，會追蹤 repo 中檔案的變更。
它的作法是維護一份稱為 `commits` 的變更清單。
一次 commit 就是一份清單，列出自上次 commit 以來，repo 中所有變更的內容。

### 什麼是分支

`branch` 就是一份 commit 清單。
`main` 分支是反映專案目前狀態的 commit 清單。

建立 repo 時，第一次 commit 通常是提交到 `main` 分支，包含建立 repo 時使用的檔案。
那次 commit 中的變更清單，包含為建立 repo 而加入的檔案名稱與內容。

下次 repo 中的檔案被加入或變更時，會再建立一次 commit 來描述變更了什麼。

經過五次 commit 之後，`main` 分支可以想像成下圖。
圖中顯示一連串記錄為 commit 的變更，每個 commit 以一個圓圈表示，並以獨一無二的編號識別。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="一列圓圈，編號 1 至 5，以水平線連接" src="generated/images/guide/doc-github-tasks/main-branch.png">

</div>

在這個範例中，第 1 到第 5 次 commit 的所有變更結果，就是 repo 目前的狀態。

### 建立工作分支

在 `angular/angular` 中，`main` 分支包含 Angular 專案自開始以來、讓它走到今天的所有變更。
`main` 分支中的 commit 清單都已經過審查與測試。

更新文件時，你可能需要做幾次變更，才能得到你想要的確切內容。
在你有機會測試與審查這些變更之前，你不會想開啟 pull request 把它們合併到 `main`。

要做到這一點，你可以建立一個新的 `working` 分支來工作。
這個範例會為新的 `working` 分支命名。

<code-example format="shell" language="shell">

&num; From the working directory of your personal/angular repo
git checkout main;        &num; start from the main branch
git checkout -b working;  &num; create a new branch named "working"

</code-example>

`working` 分支一開始就包含 `main` 分支中已經完成的所有變更。
從這個基礎出發，你可以做出自己的變更。
在 `working` 分支中做了兩次 commit 之後，repo 中的分支可以想像成下圖。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="一列圓圈，編號 3 至 5，以水平線連接，並自圓圈 5 垂直延伸出一條線形成分支" src="generated/images/guide/doc-github-tasks/feature-with-new-branch.png">

</div>

### 把你的工作合併到 main 分支

如果你在前一節的兩次 commit 中所做的變更，已經是你想使用的內容。
也就是說，你已經審查並測試過這些變更。
你可以開啟 pull request，把這些新變更合併到 `main` 分支。

如果你建立分支之後，`main` 分支沒有任何變更，這種合併稱為 `fast-forwarding`。
在 `fast-forward` 合併中，你加入 `working` 分支的兩次 commit 會被加入 `main` 分支。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="一列圓圈，編號 3 至 7，以水平線連接，並自圓圈 5 垂直延伸出一條線形成分支" src="generated/images/guide/doc-github-tasks/feature-branch-ff.png">

</div>

`working` 分支與 `main` 分支合併後，`main` 分支現在包含了你在 `working` 分支中做的兩次 commit。
因為兩個分支都包含第 1 到第 7 次 commit，所以它們現在的內容相同。

### 把你的工作合併到已經變更的 main 分支

能夠 `fast-foward` 合併是很簡單的。
不幸的是，在像 `angular/angular` 這樣有很多貢獻者的 repo 中，main 分支經常在變化。
這裡說明一個更可能發生的情境：當你在 `working` 分支中處理你的變更時，`main` 分支發生了變化。
產生的分支可以想像成下圖。
當你在處理第 6 與第 7 次 commit 時，其他人已經貢獻了第 8 與第 9 次 commit。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="一列圓圈，編號 3 至 9，以水平線連接，並自圓圈 5 垂直延伸出一條線形成分支" src="generated/images/guide/doc-github-tasks/feature-branch-w-update.png">

</div>

第 6 與第 7 次 commit 不能用來 fast-forward。
請記得，一次 commit 就是一份變更清單。
第 6 次 commit 是第 5 次 commit 的變更清單，加上你做的第一次編輯。
第 7 次 commit 是你第 6 次 commit 的變更清單，加上你因應審查意見所做的變更。
無論如何，你 `working` 分支中的 commit 不能加入 main 分支的 commit 九。
`working` 分支中的 commit 不包含 commit 八與九的變更，所以它們可能會遺失。

你可以選擇合併兩個分支中的變更，或是對 `working` 分支中的 commit 執行 rebase。
合併會建立一個 `merge` commit，協調必要的變更，以呈現兩個分支的淨結果。
合併雖然不壞，但會讓人難以還原個別變更。

@reviewed 2022-09-30
