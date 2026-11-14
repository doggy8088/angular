# 更新你的 Angular 專案

就像 Web 與整個網路生態系一樣，Angular 也在持續進步。Angular 在持續改進的同時，也非常重視穩定性，並讓更新變得簡單直接。讓你的 Angular 應用程式保持最新，能讓你利用最先進的新功能，以及最佳化與錯誤修正。

本文件包含資訊與資源，協助你讓 Angular 應用程式與程式庫保持最新。

關於我們的版本政策與實務&mdash;包括支援與棄用實務，以及發行時程&mdash;請參閱 [Angular 版本與發行](guide/releases "Angular versioning and releases")。

<div class="alert is-helpful">

若你目前使用的是 AngularJS，請參閱 [Upgrading from AngularJS](guide/upgrade "Upgrading from Angular JS")。_AngularJS_ 是所有 v1.x 版本 Angular 的名稱。

</div>

{@a announce}
## 收到新版本發行的通知

若想在新版本推出時收到通知，請在 Twitter 上追蹤 [@angular](https://twitter.com/angular "@angular on Twitter")，或訂閱 [Angular 部落格](https://blog.angular.io "Angular blog")。

{@a learn}
## 了解新功能

有什麼新東西？有什麼改變？我們會在 Angular 部落格的[發行公告]( https://blog.angular.io/tagged/release%20notes "Angular blog - release announcements")中，分享你最需要知道的重要事項。

若要檢視依版本整理的完整變更清單，請參閱 [Angular 變更記錄](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log")。

{@a checking-version-app}
## 檢查你的 Angular 版本

若要檢查你應用程式的 Angular 版本，請在專案目錄中使用 `ng version` 指令。

{@a checking-version-angular}
## 尋找目前的 Angular 版本

最新釋出的 Angular 穩定版本會顯示在 [Angular 文件](https://angular.io/docs "Angular documentation")左側導覽的底部。例如 `stable (v5.2.9)`。

你也可以使用 [CLI 指令 `ng update`](https://github.com/angular/angular-cli/wiki/update "Angular CLI update documentation") 找到最新的 Angular 版本。預設情況下，`ng update`（不加額外引數）會列出你可以使用的更新。

{@a updating}
## 更新你的環境與應用程式

為了讓更新變得簡單，我們在互動式 [Angular 更新指南](https://update.angular.io/ "Angular Update Guide") 中提供完整的說明。

Angular 更新指南會根據你指定的目前版本與目標版本，提供客製化的更新說明。它包含基本與進階的更新路徑，以符合你應用程式的複雜程度。它也包含疑難排解資訊與建議的手動變更，協助你充分利用新版本。

對於簡單的更新，你只需要 [CLI 指令 `ng update`](https://github.com/angular/angular-cli/wiki/update "Angular CLI update documentation") 就夠了。不加額外引數時，`ng update` 會列出你可以使用的更新，並提供建議步驟，把你的應用程式更新到最新版本。

{@a resources}
## 資源摘要

* 發行公告：[Angular 部落格 - 發行公告](https://blog.angular.io/tagged/release%20notes "Angular blog announcements about recent releases")

* 發行公告（較舊的）：[Angular 部落格 - 2017 年 8 月以前的發行公告](https://blog.angularjs.org/search?q=available&by-date=true "Angular blog announcements about releases prior to August 2017")

* 發行細節：[Angular 變更記錄](https://github.com/angular/angular/blob/master/CHANGELOG.md "Angular change log")

* 更新說明：[Angular 更新指南](https://update.angular.io/ "Angular Update Guide")

* 更新指令參考：[Angular CLI 更新文件](https://github.com/angular/angular-cli/wiki/update "Angular CLI update documentation")

* 版本、發行、支援與棄用實務：[Angular 版本與發行](guide/releases "Angular versioning and releases")

* 發行時程：[Angular 版本與發行](guide/releases#schedule "Angular versioning and releases")