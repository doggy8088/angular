# Angular 文件編輯工作流程概覽

本節說明對 Angular 文件進行大幅變更的過程。也說明 Angular 文件的儲存、建置、修訂與測試方式。

下圖說明修訂 Angular 文件的工作流程。步驟摘要如下，並於本節的主題中說明。

<div class="lightbox">

<!-- Image source is found in angular/aio/src/assets/images/doc-contribute-images.sketch, in the sketch page that matches this topic's filename -->
<img alt="顯示寫作工作流程步驟的方塊圖" src="generated/images/guide/doc-update-overview/writing-workflow.png">

</div>

## 準備編輯文件

你只需要執行這個步驟一次，以準備本地電腦來更新 Angular 文件。

有關如何準備編輯文件的更多資訊，請參閱[準備編輯文件](guide/doc-prepare-to-edit)。

## 選擇文件議題

解決文件議題的第一步是選擇一個要修正的議題。你要修正的議題可以是 `angular/angular` 儲存庫中[文件議題清單](https://github.com/angular/angular/issues?q=is%3Aissue+is%3Aopen+label%3A%22comp%3A+docs%22)中的一個，也可以是你自己建立的。

有關如何選擇要修正的議題的更多資訊，請參閱[選擇文件議題](guide/doc-select-issue)。

### 建立文件議題

如果你想修正尚未在議題中描述的問題，請先[開啟文件議題](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)再開始。當你能將議題與 pull request 關聯起來時，檢閱者在檢閱你的 pull request 時能更了解問題。

### 建立工作分支

選擇要解決的議題後，請在本地電腦上工作目錄中的 `working` 目錄內建立 `working` 分支。你需要在這個分支中進行變更，以便在編輯時儲存與測試它們。修正議題後，當你開啟 pull request 以將解決方案合併到 `angular/angular` 時，會使用這個分支。

有關如何建立 `working` 分支的更多資訊，請參閱[開始編輯文件主題](guide/doc-update-start)。

## 修訂主題

在你的 `working` 分支中，你可以編輯並建立解決議題所需的文件主題。你大部分的工作都是在整合式開發環境（IDE）中進行的。

有關如何修訂文件主題的更多資訊，請參閱[修訂文件主題](guide/doc-editing)。

### 解決程式碼檢查工具錯誤

每次將對文件主題的編輯儲存後，文件程式碼檢查工具都會檢閱你的主題。它會將在你的主題中發現的問題回報給你的 IDE。為避免在 pull request 流程後期造成延誤，你應該在問題回報時立即修正。文件程式碼檢查工具的錯誤必須在開啟 pull request 之前修正，才能通過 pull request 檢閱。主題中有程式碼檢查工具錯誤可能會導致 pull request 無法獲准合併。

有關如何解決文件主題中程式碼檢查工具問題的更多資訊，請參閱[解決文件程式碼檢查工具訊息](guide/docs-lint-errors)。

### 測試你的變更

在你編輯文件主題以解決所選議題時，你會想要建置更新後文件的本地版本。這是在與文件使用者相同的情境中檢閱變更的最簡單方式。

你也可以在本地電腦上執行部分自動化測試以發現其他錯誤。在開啟 pull request 之前，先在本地電腦上執行這些測試，可以加快 pull request 核准流程。

有關如何在開啟 pull request 之前建置與測試變更的更多資訊，請參閱[建置與測試文件](guide/doc-build-test)。

## 準備你的 pull request

若要讓你的文件變更準備好加入 `angular/angular` 儲存庫，在開啟 pull request 之前還有一些事情要做。例如，為了讓 pull request 易於檢閱與核准，`working` 分支中的提交與提交訊息必須格式正確。

有關如何為 pull request 準備分支的資訊，請參閱[為 pull request 準備文件](guide/doc-pr-prep)。

### 開啟你的 pull request

開啟文件 pull request 會將你的變更傳送給熟悉該主題的 Angular 檢閱者。為正確處理，`angular/angular` 的 pull request 必須格式正確並包含特定資訊。

有關如何為你的文件更新設定 pull request 格式的資訊，請參閱[開啟文件 pull request](guide/doc-pr-open)。

### 更新你的 pull request

你可能會收到關於 pull request 的意見回饋，要求你修訂主題。由於 pull request 流程是為所有 Angular 程式碼以及文件而設計的，這個流程第一次看起來可能令人卻步。

有關如何更新主題並回應對變更的意見回饋的資訊，請參閱[更新進行中的文件 pull request](guide/doc-pr-update)。

## 合併後清理

pull request 核准並合併到 `angular/angular` 後，它就成為官方 Angular 文件的一部分。屆時，你的變更已進入 `angular/angular` 的 `main` 分支。這表示你可以安全地刪除 `working` 分支。

一般來說，在 `working` 分支的變更合併到 `angular/angular` 的 `main` 分支後刪除它們是良好的做法。這可以避免你的個人 fork 收集大量日後可能造成混淆的分支。

有關如何在 pull request 合併後安全清理的資訊，請參閱[完成文件 pull request 的收尾工作](guide/doc-edit-finish)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
