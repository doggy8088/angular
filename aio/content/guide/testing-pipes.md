# 測試管道

你可以不使用 Angular 測試工具，直接測試[管道](guide/pipes)。

<div class="alert is-helpful">

  想要動手實作的話，可以在閱讀本指南時，在你的瀏覽器中<live-example name="testing" stackblitz="specs" noDownload>執行測試並探索測試程式碼</live-example>。

  如果你想試用本指南所述的應用程式，可以<live-example name="testing" noDownload>在瀏覽器中執行</live-example>，或<live-example name="testing" downloadOnly>下載並在本機執行</live-example>。

</div>

## 測試 `TitleCasePipe`

管道類別有一個方法 `transform`，負責將輸入值處理成轉換後的輸出值。
`transform` 的實作很少與 DOM 互動。
大多數管道除了 `@Pipe` 中繼資料與一個介面之外，不相依於 Angular 的其他部分。

以一個將每個單字第一個字母大寫的 `TitleCasePipe` 為例。
以下是以正規表示式實作的版本。

<code-example path="testing/src/app/shared/title-case.pipe.ts" header="app/shared/title-case.pipe.ts"></code-example>

任何使用正規表示式的程式碼都值得徹底測試。
使用簡單的 Jasmine 來探索預期情境與邊界情境。

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" header="app/shared/title-case.pipe.spec.ts"></code-example>

{@a write-tests}

## 撰寫 DOM 測試來支援管道測試

這些是_獨立_測試管道的測試。
它們無法判斷 `TitleCasePipe` 套用到應用程式元件時是否正常運作。

可以考慮加入像這樣的元件測試：

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>
