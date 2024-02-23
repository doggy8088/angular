# 讓您的 Angular 專案保持最新狀態

就像 Web 及整個 Web 生態系統，Angular 持續進步。
Angular 在持續進步與高度注重穩定性以及簡化更新之間取得平衡。
讓您的 Angular 應用程式保持最新，讓您可以利用領先的新功能，以及最佳化和錯誤修正。

此文件包含資訊和資源，可協助您讓您的 Angular 應用程式和函式庫保持最新。

有關我們的版本政策和做法的資訊&mdash;包括支援和淘汰做法，以及發佈時間表&mdash;請參閱 [Angular 版本控制和版本](reference/releases "Angular 版本控制和版本")。

HELPFUL: 如果你目前正在使用 AngularJS，請參閱 [從 AngularJS 升級](https://angular.io/guide/upgrade "Upgrading from Angular JS")。
*AngularJS* 是所有 Angular v1.x 版本的名稱。

## 收到新版本通知

若要接收有關新版本發行的通知，請在 Twitter 上追蹤 [@angular](https://twitter.com/angular "@angular on Twitter") 或訂閱 [Angular 部落格](https://blog.angular.io "Angular blog")。

## 學習新功能

有什麼新消息？有什麼改變？我們會在 [發行公告]( https://blog.angular.io/ "Angular 部落格 - 發行公告") 中分享您在 Angular 部落格上需要知道的最重要事項。

要查看按版本整理的完整變更清單，請參閱 [Angular 變更日誌](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angular 變更日誌")。

## 檢查你的 Angular 版本

html
<pre>ng version</pre>

要檢查應用程式的 Angular 版本，請從專案目錄中使用 `ng version` 指令。

## 尋找 Angular 的目前版本

html
<pre>ng version</pre>

Angular 最近發布的穩定版本出現在 [npm](https://www.npmjs.com/package/@angular/core "Angular on npm") 下的「版本」。例如，`16.2.4`。

您也可以使用 CLI 命令 [`ng update`](cli/update) 來找到 Angular 的最新版本。
預設情況下，[`ng update`](cli/update)(沒有其他參數) 會列出可用的更新。

## 更新您的環境和應用程式

為了使更新變得簡單，我們在互動式 [Angular 更新指南](https://update.angular.io/ "Angular 更新指南") 中提供完整的說明。

Angular 更新指南提供客製化的更新說明，根據您指定的目前版本和目標版本。
它包含基本和進階的更新路徑，以符合您的應用程式的複雜性。
它也包含疑難排解資訊和任何建議的手動變更，以協助您充分利用新版本。

對於簡單的更新，CLI 指令 [`ng update`](cli/update) 就是您所需要的。
沒有其他引數時，[`ng update`](cli/update) 會列出可用的更新，並提供建議的步驟，以將您的應用程式更新到最新版本。

[Angular 版本管理和發布](reference/releases#versioning "Angular 發布實務、版本管理") 說明了根據發布的版本號碼，您可以預期的變更程度。
它也說明了支援的更新路徑。

## 資源摘要

* 發佈公告：
    [Angular 部落格 - 發佈公告](https://blog.angular.io/ "Angular 部落格公告，有關近期發佈")

* 發佈詳細資料：
    [Angular 變更紀錄](https://github.com/angular/angular/blob/main/CHANGELOG.md "Angular 變更紀錄")

* 更新說明：
    [Angular 更新指南](https://update.angular.io/ "Angular 更新指南")

* 更新指令參考：
    [Angular CLI `ng update` 指令參考](cli/update)

* 版本控制、發佈、支援及淘汰做法：
    [Angular 版本控制和發佈](reference/releases "Angular 版本控制和發佈")

