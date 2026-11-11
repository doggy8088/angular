# 擴充診斷

有許多撰寫程式碼的模式，在技術上對編譯器或執行環境來說是合法的，但可能帶有複雜的細微差異或注意事項。
這些模式可能不會產生開發者預期的效果，往往因此導致錯誤。
Angular 編譯器包含「擴充診斷」，能識別出許多這類模式，藉此提醒開發者注意潛在問題，並在程式碼庫中落實常見的最佳實務。

## 診斷項目 {#diagnostics}

目前 Angular 支援以下擴充診斷：

| 代碼     | 名稱                                                                  |
| :------- | :-------------------------------------------------------------------- |
| `NG8101` | [`invalidBananaInBox`](extended-diagnostics/NG8101)                   |
| `NG8102` | [`nullishCoalescingNotNullable`](extended-diagnostics/NG8102)         |
| `NG8103` | [`missingControlFlowDirective`](extended-diagnostics/NG8103)          |
| `NG8104` | [`textAttributeNotBinding`](extended-diagnostics/NG8104)              |
| `NG8105` | [`missingNgForOfLet`](extended-diagnostics/NG8105)                    |
| `NG8106` | [`suffixNotSupported`](extended-diagnostics/NG8106)                   |
| `NG8107` | [`optionalChainNotNullable`](extended-diagnostics/NG8107)             |
| `NG8108` | [`skipHydrationNotStatic`](extended-diagnostics/NG8108)               |
| `NG8109` | [`interpolatedSignalNotInvoked`](extended-diagnostics/NG8109)         |
| `NG8111` | [`uninvokedFunctionInEventBinding`](extended-diagnostics/NG8111)      |
| `NG8113` | [`unusedStandaloneImports`](extended-diagnostics/NG8113)              |
| `NG8114` | [`unparenthesizedNullishCoalescing`](extended-diagnostics/NG8114)     |
| `NG8115` | [`uninvokedTrackFunction`](extended-diagnostics/NG8115)               |
| `NG8116` | [`missingStructuralDirective`](extended-diagnostics/NG8116)           |
| `NG8117` | [`uninvokedFunctionInTextInterpolation`](extended-diagnostics/NG8117) |

## 設定 {#configuration}

擴充診斷預設為警告，不會阻擋編譯。
每項診斷都可以設定為以下其中一種：

| 錯誤類別   | 效果                                                                                           |
| :--------- | :--------------------------------------------------------------------------------------------- |
| `warning`  | 預設值：編譯器會把診斷以警告的形式發出，但不阻擋編譯。即使發出了警告，編譯器仍會以狀態碼 0 結束。 |
| `error`    | 編譯器會把診斷以錯誤的形式發出，並讓編譯失敗。只要發出一個以上的錯誤，編譯器就會以非零的狀態碼結束。 |
| `suppress` | 編譯器完全_不會_發出該診斷。                                                                    |

檢查的嚴重程度可以透過 [Angular 編譯器選項](reference/configs/angular-compiler-options)來設定：

<docs-code language="json">
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      // The categories to use for specific diagnostics.
      "checks": {
        // Maps check name to its category.
        "invalidBananaInBox": "suppress"
      },

      // The category to use for any diagnostics not listed in `checks` above.
      "defaultCategory": "error"
    }

}
}
</docs-code>

`checks` 欄位把各項診斷的名稱對應到其所屬的類別。
完整的擴充診斷清單，以及設定時要使用的名稱，請見[診斷項目](#diagnostics)。

`defaultCategory` 欄位用於未在 `checks` 中明確列出的所有診斷。
如果沒有設定，這類診斷會被視為 `warning`。

啟用 [`strictTemplates`](tools/cli/template-typecheck#strict-mode) 時，擴充診斷才會發出訊息。
這是必要的，如此編譯器才能更深入地理解 Angular 範本的型別，提供正確且有意義的診斷。

## 語意化版本

Angular 團隊打算在 Angular 的**次要**版本中新增或啟用新的擴充診斷（請見 [semver](https://docs.npmjs.com/about-semantic-versioning)）。
這表示升級 Angular 時，你現有的程式碼庫中可能會出現新的警告。
如此一來，團隊能更快交付功能，也能讓更多開發者更容易取用擴充診斷。

不過，把 `"defaultCategory": "error"` 這樣設定，會把這類警告提升為硬性錯誤。
這可能導致次要版本升級引入編譯錯誤，而這或許會被視為不符合 semver 的破壞性變更。
任何新的診斷都可以透過上述[設定](#configuration)加以停用，或降級為警告，因此對於預設把擴充診斷視為錯誤的專案來說，新診斷帶來的影響應該微乎其微。
把預設值設為 error 是非常強大的工具；只是在決定 `error` 是否適合當作專案的預設值時，請留意這項 semver 注意事項。

## 新增診斷

Angular 團隊隨時歡迎關於可新增診斷的建議。
擴充診斷一般應該：

- 偵測開發者在 Angular 範本中常見且不明顯的錯誤
- 清楚說明這種模式為什麼會導致錯誤或非預期的行為
- 提出一個或多個明確的解決方案
- 誤判率要低，最好是零
- 適用於絕大多數的 Angular 應用程式（而非針對某個非官方函式庫）
- 提升程式的正確性或效能（而非風格問題，那是 linter 的職責）

如果你對符合這些條件的擴充診斷有想法，歡迎提出[功能請求](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml)。
