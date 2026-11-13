# 準備編輯 Angular 文件

本主題說明準備本地電腦以編輯並提交 Angular 文件的步驟。

<div class="alert is-important">

**重要事項**：<br />
若要提交對 Angular 文件的變更，你必須具備：

*   一個 [GitHub][GithubMain] 帳號
*   一份已簽署的[貢獻者授權協議][GithubAngularAngularBlobMainContributingSigningTheCla]

</div>

## 完成貢獻者授權協議

請檢閱[為 Angular 做出貢獻](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)。這些章節對於文件貢獻特別重要：

1.  閱讀 Angular 的[行為準則](https://github.com/angular/code-of-conduct/blob/main/CODE_OF_CONDUCT.md)
1.  閱讀[提交指南](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-submission-guidelines)。

    <div class="alert is-helpful">

    **注意**：<br />
    本節中的主題會針對文件貢獻，具體說明這些指南。

    </div>

1.  閱讀並完成適用於你的[貢獻者授權協議](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla)。

## 安裝必要的軟體

若要在本地電腦上編輯、建置及測試 Angular 文件，你需要下列軟體。本節中的說明假設你使用此清單中的軟體來完成這些工作。

此清單中的某些軟體，例如整合式開發環境（IDE），可以用類似的軟體替代。如果你使用替代的 IDE，可能需要依你的 IDE 調整本節中的說明。

有關必要軟體的更多資訊，請參閱[設定本地環境與工作區](guide/setup-local)。

*   **版本控制軟體**
    *   [Git 命令列](https://github.com/git-guides/install-git)
    *   [GitHub Desktop](https://desktop.github.com)（選用）
*   **整合式開發環境**
    *   [Visual Studio Code](https://code.visualstudio.com)
*   **公用程式軟體**
    *   [node.js](https://nodejs.org/en/download)

Angular 需要 [Node.js 的使用中長期支援（LTS）或維護 LTS 版本](https://nodejs.org/about/releases)。

    *   [Yarn](https://yarnpkg.com/getting-started/install)
    *   macOS 適用的 [Homebrew](https://brew.sh) 或 Windows 適用的 [Chocolatey](https://chocolatey.org/install)
    *   [Vale][GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd]（請參閱附註）

<div class="alert is-important">

**重要事項**：<br />
請等到將 [`https://github.com/angular/angular`][GithubAngularAngular] 儲存庫的 fork 複製到本地電腦後，再設定 Vale 設定。

</div>

你也可以安裝其他你覺得有幫助的工具與 IDE 擴充功能。

## 設定你的工作區

Angular 文件與 Angular 框架程式碼一起儲存在 GitHub 原始碼儲存庫（也稱為 *repo*）中，網址為：[https://github.com/angular/angular](https://github.com/angular/angular)。若要為 Angular 貢獻文件，你需要：

*   一個 GitHub 帳號

*   你個人 GitHub 帳號中 Angular 儲存庫的一個 *fork*。

本指南將你的個人 GitHub 帳號稱為 `personal`。你必須將 GitHub 參照中的 `personal` 替換為你的 GitHub 使用者名稱。網址：`https://github.com/personal` 不是有效的 GitHub 帳號。為方便起見，本文件使用下列簡寫參照：
    *   `angular/angular`

指 Angular 儲存庫。這也稱為 *上游* 儲存庫。

    *   `personal/angular`

指你個人 fork 的 Angular 儲存庫。請將 `personal` 替換為你的 GitHub 使用者名稱，以識別你的特定儲存庫。這也稱為 *origin* 儲存庫。

*   你本地電腦上 `personal/angular` 儲存庫的一個 *clone*

GitHub 儲存庫會複製到你本地電腦上的 `git` 工作區中。有了這個工作區與必要的工具，你就可以在本地電腦上建置、編輯與檢閱文件。

當你可以從本地電腦上的工作區建置文件時，你就可以對 Angular 文件進行大幅變更了。

有關如何設定工作區的更詳細資訊，請參閱[為 Angular 文件建立你的儲存庫與工作區](#為-angular-文件建立你的儲存庫與工作區)。

有關如何從本地電腦建置與測試文件的更詳細資訊，請參閱[建置與測試 Angular 文件](#建置並測試-angular-文件)。

## 為 Angular 文件建立你的儲存庫與工作區

本節說明如何建立編輯、測試與提交 Angular 文件變更所需的儲存庫與 `git` 工作區。

<div class="alert is-important">

**重要事項**：<br />
由於 `git` 指令對初學者不友善，本節中的主題包含一些程序，應可降低發生 `git` 失誤的機會。
幸好，由於你是在自己的帳號中工作，即使犯了錯誤，也不會損害任何 Angular 程式碼或文件。

若要遵循這些主題中的程序，你必須使用本主題中介紹的儲存庫與目錄設定。
這些主題中的程序是設計來搭配此設定使用的。

如果你使用不同的設定，這些主題中的程序可能無法如預期運作，你可能會遺失部分變更。

</div>

Angular 框架的程式碼與文件儲存在 [github.com](https://github.com) 上 `angular` 帳號下的一個公開儲存庫（repo）中。Angular 儲存庫的路徑為 [https://github.com/angular/angular](https://github.com/angular/angular)，因此簡稱為 `angular/angular`。

[GitHub](https://github.com) 是一項雲端服務，代管許多帳號與儲存庫。你可以將 GitHub 中的 `angular/angular` 儲存庫想像成如下圖所示。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="github.com 雲端服務中 angular/angular 儲存庫的圖片" src="generated/images/guide/doc-prepare-to-edit/github-angular-cloud.png">

</div>

### 將 `angular/angular` 儲存庫 fork 到你的帳號

作為公開儲存庫，`angular/angular` 可供任何人閱讀與複製，但不能變更。雖然只有特定帳號有權變更 `angular/angular`，但任何擁有 GitHub 帳號的人都可以要求變更。對 `angular/angular` 的變更請求稱為 *pull request*。pull request 是由一個帳號建立，要求另一個帳號拉取一項變更。

在開啟 pull request 之前，你需要在個人 GitHub 帳號中有一個 `angular/angular` 的 fork 複本。

若要取得 `angular/angular` 的 fork 複本，請將 `angular/angular` 儲存庫 fork 到你的個人 GitHub 帳號，最終會得到如下圖所示的儲存庫。從 `personal/angular` 的角度來看，`angular/angular` 是上游儲存庫，`personal/angular` 是 origin 儲存庫。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="github.com 雲端服務中 angular/angular 儲存庫的圖片，已 Fork 到個人帳號" src="generated/images/guide/doc-prepare-to-edit/github-personal-cloud.png">

</div>

#### 將 Angular 儲存庫 fork 到你的帳號

請在瀏覽器中執行這個程序。

1.  登入你的 [GitHub](https://github.com) 帳號。如果你沒有 GitHub 帳號，請在繼續之前[建立新帳號][GithubJoin]。

1.  前往 [`https://github.com/angular/angular`][GithubAngularAngular]。

1.  在 [`https://github.com/angular/angular`][GithubAngularAngular] 中，點選頁面右上角附近的 **Fork** 按鈕。這張圖片來自 [`https://github.com/angular/angular`][GithubAngularAngular] 頁面的頂部，顯示了 **Fork** 按鈕。

    <div class="lightbox">

    <img alt="github.com 上 angular/angular 網站的圖片，標示 Fork 按鈕" src="generated/images/guide/doc-prepare-to-edit/angular-angular-github.png">

    </div>

1.  在 **Create a new fork** 中：
    1.  接受 **Owner** 與 **Repository name** 中的預設值。
    1.  確認已勾選 **Copy the `main` branch only**。
    1.  點選 **Create repository**。fork 程序可能需要幾分鐘。

1.  你現在在 GitHub 帳號中有了一份 `angular/angular` 儲存庫的複本。

`angular/angular` 的 fork 準備就緒後，瀏覽器會開啟你 GitHub 帳號中 fork 儲存庫的網頁。在這張圖片中，請注意帳號現在顯示的是你的個人 GitHub 帳號的使用者名稱，而非 `angular` 帳號。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="github.com 上 personal/angular 網站的圖片，標示已 Fork 的儲存庫" src="generated/images/guide/doc-prepare-to-edit/personal-angular-github.png">

</div>

作為 fork 的儲存庫，你的新儲存庫會維持對 `angular/angular` 的參照。從你的帳號來看，`git` 會將你的 `personal/angular` 儲存庫視為 origin 儲存庫，並將 `angular/angular` 視為上游儲存庫。你可以這樣理解：你的變更源自 *origin* 儲存庫，而你將它們傳送到 *上游* 的 `angular/angular` 儲存庫。你帳號中儲存庫名稱下方的訊息 `forked from angular/angular` 包含一個連回上游儲存庫的連結。

這種關係會在之後發揮作用，例如當你更新 `personal/angular` 儲存庫以及開啟 pull request 時。

### 在本地電腦上建立 git 工作區

本地電腦上的 `git` 工作區是雲端中 GitHub 儲存庫的複本儲存在本地電腦上的位置。若要在本地電腦上編輯 Angular 文件，你需要 origin 儲存庫 `personal/angular` 的一個 clone。

如圖所示，將 `personal/angular` 儲存庫複製到你帳號的子目錄中。請記得將 `personal` 替換為你的 GitHub 使用者名稱。工作區中的 `personal/angular` 目錄會成為你的 `working` 目錄。你會在 `personal/angular` 儲存庫的工作目錄中進行編輯。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="github.com 雲端服務中 angular 與個人帳號的 angular 儲存庫圖片，顯示複製到本機電腦工作區的情形" src="generated/images/guide/doc-prepare-to-edit/github-clone-img.png">

</div>

複製（cloning）儲存庫會將雲端中的儲存庫複製到你的本地電腦上。後面會說明讓本地電腦上的複本與雲端中的儲存庫保持同步的程序。

#### 將 Angular 儲存庫複製到你的工作區中

請在本地電腦的命令列工具中執行下列步驟。

1.  前往 `workspace` 目錄。在這個範例中，這個目錄名為 `github-projects`。

    <div class="lightbox">

    <!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
    <img alt="本機電腦上專案目錄的圖片" src="generated/images/guide/doc-prepare-to-edit/pc-directory-start-img.png">

    </div>

如果本地電腦上沒有這個目錄，請先建立它，然後再繼續之前前往該目錄。

1.  從工作區目錄，執行這個指令以為你的 `personal` 帳號建立一個目錄。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <code-example format="shell" language="shell">

    mkdir personal

    </code-example>

1.  從工作區目錄，執行這個指令以將 origin `personal/angular` 儲存庫複製到 `personal` 帳號目錄中。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

    <!-- markdownLint-disable MD034 -->

    <code-example format="shell" language="shell">

    git clone https://github.com/personal/angular personal/angular

    </code-example>

    <!-- markdownLint-enable MD034 -->

你的本地電腦現在已設定為如下圖所示。

<a id="doc-working-directory"></a>

你的 `working` 目錄是 `git` 工作區目錄中的 `personal/angular` 目錄。這個目錄及其子目錄包含你編輯以修正文件議題的檔案。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="本機電腦上工作目錄的圖片" src="generated/images/guide/doc-prepare-to-edit/pc-directory-config-img.png">

</div>

### 完成軟體安裝

在本地電腦上複製 origin 儲存庫後，請在命令列工具中執行下列指令：

1.  安裝 Angular 專案所使用的 npm 模組。在本地電腦的命令列工具中：

    1.  前往你的 `git` 工作區。在這個範例中，這個目錄是 `github-projects` 目錄。

    1.  在你的 `git` 工作區中，執行這個指令以前往你的 `personal/angular` 儲存庫複本中的文件根目錄。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

        <code-example format="shell" language="shell">

        cd personal/angular/aio

        </code-example>

    1.  執行這個指令以安裝 npm 模組。

        <code-example format="shell" language="shell">

        yarn install

        </code-example>

1.  在工作目錄中找到 `angular/aio/tools/doc-linter/vale.ini`，以在下一個步驟中將其作為 **Vale:Config** 設定中的設定檔路徑使用。

1.  [安裝 Vale][GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd] 以完成軟體安裝。

## 建置並測試 Angular 文件

Angular 提供了建置與測試文件的工具。在檢閱你的工作以及於 pull request 中提交更新之前，請務必使用這些工具建置、測試並驗證你的變更。

<div class="alert is-important">

請注意，[https://github.com/angular/angular/blob/main/docs/DEVELOPER.md](https://github.com/angular/angular/blob/main/docs/DEVELOPER.md) 中的說明是用來建置與測試 Angular 框架，而非 Angular 文件。

本頁面上的程序僅建置 Angular 文件。
你不需要建置 Angular 框架就能建置 Angular 文件。

</div>

<!-- markdownLint-disable MD033 -->

### 前往 Angular 文件目錄

請在本地電腦的命令列工具中執行下列步驟。

1.  前往本地電腦上 `git` 工作區中你的帳號的工作目錄中的 Angular 文件。
1.  前往你的 `git` 工作區目錄。在這個範例中，這個目錄是 `github-projects` 目錄。

    1.  執行這個指令以前往包含你 fork 到個人帳號的 `angular` 儲存庫的工作目錄。請記得將 `personal` 替換為你的 GitHub 使用者名稱。

        <code-example format="shell" language="shell">

        cd personal/angular

        </code-example>

    1.  執行這個指令以前往 Angular 文件目錄。

        <code-example format="shell" language="shell">

        cd aio

        </code-example>

Angular 文件目錄是 Angular 文件檔案的根目錄。`angular/aio` 目錄中的這些目錄是你最常找到所編輯檔案的地方。

| 目錄 | 檔案 |
|:---                           |:---                                                       |
|`angular/aio/content` | Angular 文件中所使用的檔案與其他素材 |
|`angular/aio/content/guide` | 大多數 Angular 文件的 Markdown 檔案 |
|`angular/aio/content/tutorial` | Tour of Heroes 教學所使用的 Markdown 檔案 |

Angular 文件原始碼在 `angular/aio` 中還有許多其他目錄，但它們不常變更。

### 在你的電腦上建置並檢視 Angular 文件

請在本地電腦的命令列工具中執行下列步驟。

1.  建置 Angular 文件。
    1.  從 Angular 文件目錄，執行這個指令：

        <code-example format="shell" language="shell">

        yarn build

        </code-example>

    1.  如果建置文件時回報一或多個錯誤，請先修正錯誤並重複前一個步驟，再繼續。

1.  啟動本地文件伺服器。
    1.  從文件目錄，執行這個指令：

        <code-example format="shell" language="shell">

        yarn serve-and-sync

        </code-example>

    1.  在本地電腦上開啟瀏覽器，並於 `https://localhost:4200` 檢視你的文件。
1. 在瀏覽器中檢閱文件。

### 對 Angular 文件執行自動化測試

請在本地電腦的命令列工具中執行下列步驟。

1.  如果你尚未在文件目錄中，請[前往文件目錄](#前往-angular-文件目錄)。
1.  從文件目錄，執行這個指令以在測試之前建置文件：

    <code-example format="shell" language="shell">

    yarn build

    </code-example>

1.  如果建置文件時傳回一或多個錯誤，請先修正這些錯誤並再次建置文件，再繼續。
1.  從文件目錄，執行這個指令以啟動驗證文件一致性的自動化測試。這些是開啟 pull request 後所執行的大部分測試，但並非全部。有些測試只能在自動化測試環境中執行。

    <code-example format="shell" language="shell">

    yarn e2e

    </code-example>

在你的文件更新上執行這些測試時，請務必在開啟 pull request 之前修正任何錯誤。

## 後續步驟

從 fork 的儲存庫在本地電腦上建置文件且測試執行無錯誤後，你就可以繼續了。

你已成功設定本地電腦以編輯 Angular 文件並開啟 pull request。

請繼續閱讀本節中的其他主題，了解如何執行其他文件工作。

<!-- links -->

<!-- external links -->

[GithubJoin]: https://github.com/join "加入 GitHub | GitHub"

[GithubMain]: https://github.com "GitHub"

[GithubAngularAngular]: https://github.com/angular/angular "angular/angular | GitHub"

[GithubAngularAngularBlobMainContributingSigningTheCla]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-signing-the-cla "簽署 CLA - 為 Angular 做出貢獻 | angular/angular | GitHub"

[GithubAngularAngularTreeMainAioToolsDocLinterInstallValeOnYourDevelopmentSystemReadmeMd]: https://github.com/angular/angular/tree/main/aio/tools/doc-linter/README.md#install-vale-on-your-development-system "在你的開發系統上安裝 Vale - Angular 文件程式碼檢查工具 | angular/angular | Github"

<!-- end links -->

@reviewed 2022-10-12
