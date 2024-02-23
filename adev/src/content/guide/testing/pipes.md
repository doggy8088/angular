# 測試管道

您可以測試 [管道](guide/pipes)，而無需使用 Angular 測試實用工具。

## 測試 `TitleCasePipe`

管道類別有一個方法 `transform`，它將輸入值操作成轉換後的輸出值。
`transform` 實作很少會與 DOM 互動。
大多數管道除了 `@Pipe` 元資料和介面之外，都不依賴 Angular。

考慮一個將每個單詞的第一個字母大寫的 `TitleCasePipe`。
以下是用正規表示式的實作。

<docs-code header="app/shared/title-case.pipe.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.ts"/>

任何使用正規表達式的事情都值得徹底測試。
使用簡單的 Jasmine 來探索預期情況和邊緣情況。

<docs-code header="app/shared/title-case.pipe.spec.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.spec.ts" visibleRegion="excerpt"/>

## 編寫 DOM 測試以支援管道測試

這些是管線的測試 *在獨立的情況下*。
它們無法判斷 `TitleCasePipe` 是否在應用程式元件中正確地運作。

考慮加入類似以下的元件測試：

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>
