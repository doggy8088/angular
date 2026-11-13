# 檢閱文件

即使你從未為 Angular 做出過貢獻，你也可以檢閱 Angular 文件。檢閱 Angular 文件是對社群的寶貴貢獻。

找出並回報文件中的問題，有助於社群了解內容是最新的。即使你沒有發現任何問題，看到文件最近曾被檢閱過，也能讓讀者對內容更有信心。

本主題說明如何檢閱與更新 Angular 文件，以協助讓它保持最新狀態。

<!-- markdownLint-disable MD001 -->
<!-- markdownLint-disable MD033 -->

#### 在 angular.io 中檢閱主題

請在瀏覽器中執行下列步驟。

1.  [尋找要檢閱的主題](#尋找要檢閱的主題)，方式如下：
    1.  尋找 **Last reviewed** 日期為六個月或更久以前的主題。
    1.  尋找沒有 **Last reviewed** 日期的主題。
    1.  尋找你最近閱讀過的主題。
1.  檢閱主題是否有錯誤或不正確之處。
1.  完成檢閱。
    1.  如果主題看起來沒問題：
        1.  在主題原始碼的末尾[更新或新增 `@reviewed` 項目](#更新上次檢閱日期)。
        1.  [對文件主題進行小幅變更](/guide/contributors-guide-overview#對文件主題進行小幅變更)以發佈新的檢閱日期。

    1.  如果你發現自己不放心修正的錯誤：
        1.  [在 GitHub 上開啟文件議題](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。
        1.  在主題原始碼的末尾[更新或新增 `@reviewed` 項目](#更新上次檢閱日期)。
        1.  [對文件主題進行小幅變更](/guide/contributors-guide-overview#對文件主題進行小幅變更)以發佈新的檢閱日期。

    1.  如果你發現只需要小幅變更的錯誤：
        1.  在主題原始碼的末尾[更新或新增 `@reviewed` 項目](#更新上次檢閱日期)。
        1.  [對文件主題進行小幅變更](/guide/contributors-guide-overview#對文件主題進行小幅變更)以修正錯誤並儲存新的檢閱日期。

    1.  如果你發現需要大幅變更的錯誤：
        1.  處理該錯誤：
            1.  如果你有把握，請[進行大幅變更](guide/contributors-guide-overview#進行大幅變更)，或
            1.  [在 GitHub 上開啟文件議題](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。
        1.  無論你修正錯誤或開啟新議題，都請在主題原始碼的末尾[更新或新增 `@reviewed` 項目](#更新上次檢閱日期)。
        1.  [對文件主題進行小幅變更](/guide/contributors-guide-overview#對文件主題進行小幅變更)以儲存新的檢閱日期。

## 尋找要檢閱的主題

你可以檢閱 Angular 文件中的任何主題，但這些主題最能從你的檢閱中受益。

### 超過六個月未檢閱的主題

在某些主題的底部，有一個顯示主題上次檢閱時間的日期。如果該日期是六個月以前，該主題就準備好接受檢閱了。

這是主題底部 **Last reviewed** 日期的範例。你也可以在本主題的末尾看到這樣的範例。

<div class="lightbox">

<img alt="最後審閱日期項目的範例，顯示主題審閱的月、日、年" src="generated/images/guide/contributors-guide/last-reviewed.png">

</div>

### 從未檢閱過的主題

如果主題底部沒有 **Last reviewed** 日期，表示它從未被檢閱過。你可以檢閱這樣的主題，並在檢閱後新增一個新的 **Last reviewed** 日期。

### 你知道有問題的主題

如果你知道某個主題有錯誤或不正確之處，你可以檢閱它，並在檢閱期間進行修正。如果你在檢閱期間不放心修正錯誤，請[在 GitHub 上開啟文件議題](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。請務必在檢閱主題後新增或更新 **Last reviewed** 日期。無論你修正錯誤或只是開啟議題，你都已經檢閱過該主題。

## 更新上次檢閱日期

檢閱主題後，無論你是否變更它，都請更新主題的 **Last reviewed** 日期。主題底部的 **Last reviewed** 文字是由 `@reviewed` 標籤加上你檢閱主題的日期所建立的。

這是主題原始碼末尾的 `@reviewed` 標籤在程式碼編輯器中的樣子。

<code-example>

@reviewed 2022-09-08

</code-example>

日期格式為 `YYYY-MM-DD`，其中：

* `YYYY` 是目前的年份
* `MM` 是目前月份的兩位數數字，如果月份為 01（一月）至 09（九月），前方會有一個前導零
* `DD` 是目前日期的兩位數數字，如果日期為 01–09，前方會有一個前導零。

例如：

| 檢閱日期 | `@reviewed` 標籤 | 文件中顯示的結果文字 |
|:--- |:--- |:---
| 2023 年 1 月 12 日 | `@reviewed 2023-01-12` | *Last reviewed on Thu Jan 12, 2023* |
| 2022 年 11 月 3 日 | `@reviewed 2022-11-03` | *Last reviewed on Fri Nov 03, 2022* |

## 檢閱並更新主題

以下是檢閱主題後可以採取的行動。

### 主題正確且沒有錯誤

如果主題正確且沒有錯誤，請[進行小幅變更](/guide/contributors-guide-overview#對文件主題進行小幅變更)以[更新 **Last reviewed** 日期](#更新上次檢閱日期)。你可以使用 GitHub 使用者介面來編輯主題的原始碼。

### 主題需要小幅變更

如果主題有小錯誤，你可以在[進行小幅變更](/guide/contributors-guide-overview#對文件主題進行小幅變更)時修正它們。修正錯誤時，請記得[更新 **Last reviewed** 日期](#更新上次檢閱日期)。若要進行小幅變更，你可以在瀏覽器中使用 GitHub 使用者介面來編輯主題的原始碼。

### 主題需要大幅變更

如果主題需要大幅變更，你可以[進行大幅變更](guide/contributors-guide-overview#進行大幅變更)，或[在 GitHub 上開啟文件議題](https://github.com/angular/angular/issues/new?assignees=&labels=&template=3-docs-bug.yaml)。你不應該在 GitHub 使用者介面中進行大幅變更，因為它不允許你在提交之前先測試它們。

無論你進行主題所需的變更或開啟文件議題，都仍應[更新 **Last reviewed** 日期](#更新上次檢閱日期)。如果你只想更新 **Last reviewed** 日期，可以在瀏覽器中使用 GitHub 使用者介面。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-12
