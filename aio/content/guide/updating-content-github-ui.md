# 透過 GitHub 使用者介面更新主題

本主題說明如何使用 GitHub 的使用者介面，向 Angular 儲存庫提交 pull request。如果你不熟悉 [Git](https://git-scm.com)，你可能會覺得用這個流程來做變更比較容易。

<div class="alert is-important">

   使用 GitHub 使用者介面進行更新，只建議用在一次一個檔案的小變更，例如修正錯字、[更新檢閱日期](guide/reviewing-content)或[更新搜尋關鍵字](guide/updating-search-keywords)。

</div>

**若要透過 GitHub 使用者介面更新主題：**

1. 導覽到你想要提交 pull request 的主題。

1. 點選主題頂部的編輯圖示。

   <div class="lightbox">
    <img src="generated/images/guide/contributors-guide/edit-icon.png" alt="Angular 主題的編輯圖示。">
   </div>

   畫面會出現一個 GitHub 頁面，顯示該主題的原始碼。

1. 更新主題。

1. 在畫面底部，於 **Commit changes** 方框中填入變更的說明。使用 `docs: <short-description-of-change>` 格式，其中 `<short-description-of-change>` 簡短說明你的變更。說明請保持在 100 個字元以內。例如：

  `docs: fix typo in Tour of Heroes pt.1`

1. 確認已選取 **create new branch** 選項，然後點選 **Commit changes**。

  畫面會開啟 Pull Request 頁面。

1. 填寫 Pull Request 頁面中的表單。至少要在 **Docs have been added / updated** 選項和 **Documentation content changes** 選項中填入 `x`。

1. 點選 **Create pull request**。

此時，你的 pull request 會被加入目前的請求清單中，文件團隊每週會檢閱這些請求。
