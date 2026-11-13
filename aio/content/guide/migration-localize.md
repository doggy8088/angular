# `$localize` 全域匯入遷移

## 這個原理圖做什麼？

如果你正在使用 i18n，這個原理圖會在 `polyfills.ts` 中為 `@angular/localize` 加上一行匯入宣告，大致如下：

<code-example format="typescript" language="typescript">

/******************************************************************
 &ast; Load &grave;&dollar;localize&grave; - used if i18n tags appear in Angular templates.
 */
import '&commat;angular/localize/init';

</code-example>

它也會在你應用程式的 `package.json` 中將 `@angular/localize` 列為相依性，確保能找到該匯入。

<code-example format="json" language="json">

"devDependencies": {
  &hellip;
  "&commat;angular/localize": "&hellip;",
  &hellip;
}

</code-example>

`@angular/localize` 是一個新套件，支援 Ivy 應用程式中訊息的 i18n。
這個套件需要全域的 `$localize` 符號存在。
這個符號是透過匯入 `@angular/localize/init` 模組載入的，其副作用是將它附加到全域範圍。

## 為什麼需要這個遷移？

在 Angular 第 9 版之前，Angular 的國際化（i18n）系統會在範本編譯過程中，將已翻譯的訊息內嵌到編譯輸出中。
這種方式需要針對每個目標地區設定各執行一次範本編譯器，經常導致生產建置時間緩慢。

在新的 i18n 系統中，Angular 編譯器會以全域的 `$localize` 處理器標記編譯後程式碼中的 i18n 訊息。
然後，翻譯的內嵌會在編譯後的步驟中針對每個地區設定進行。
因為應用程式不需要為每個地區設定重新建置，這讓整個過程快得多。

編譯後內嵌步驟是可選的 &mdash;例如在開發期間，或是翻譯將在執行期內嵌時。
因此，這個全域 `$localize` 必須在執行期於全域範圍中可用。
為了讓 `$localize` 在全域範圍中可用，每個應用程式現在都必須匯入 `@angular/localize/init` 模組。
它的副作用是將 `&dollar;localize` 的最小實作附加到全域範圍。

如果缺少這個匯入，你會看到像這樣的錯誤訊息：

<code-example format="output" hideCopy language="shell">

Error: It looks like your application or one of its dependencies is using i18n.
Angular 9 introduced a global &grave;&dollar;localize()&grave; function that needs to be loaded.
Please run &grave;ng add &commat;angular/localize&grave; from the Angular CLI.
(For non-CLI projects, add `import '&commat;angular/localize/init';` to your polyfills.ts file)

</code-example>

如果你的應用程式使用了 Angular 的 i18n API，這個原理圖會自動為你加上 `@angular/localize/init` 匯入。

## 為什麼我的 tslint 會失敗？

匯入 `@angular/localize/init` 可能會因為 `no-import-side-effect` 而造成 tslint 錯誤，因為它會加入全域內容（也就是副作用）。
若要修正這個錯誤，請將下列內容加入你的 `tslint.config`：

<code-example format="json" language="json">

"no-import-side-effect": [
  true,
  {
    "ignore-module": "(core-js/.*|zone\\.js/.*|&commat;angular/localize/init)&dollar;"
  }
]

</code-example>

## 我需要改變在 Angular 範本中撰寫 i18n 的方式嗎？

i18n 的範本語法沒有改變，所以你仍然會像以前一樣使用 `i18n` 屬性。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
