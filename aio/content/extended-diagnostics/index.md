# 擴充診斷

有許多程式碼模式在技術上對編譯器或執行階段而言是有效的，但可能有複雜的細微差異或注意事項。
這些模式可能無法產生開發者預期的效果，經常導致錯誤。
Angular 編譯器包含「擴充診斷」，可以識別許多這類模式，以便提醒開發者注意潛在問題，並在程式碼庫中強制執行常見的最佳實務。

## 診斷

目前 Angular 支援以下擴充診斷：

*   [NG8101 - `invalidBananaInBox`](extended-diagnostics/NG8101)
*   [NG8102 - `nullishCoalescingNotNullable`](extended-diagnostics/NG8102)

## 設定

擴充診斷預設為警告，不會阻擋編譯。
每項診斷都可以設定為下列其中一種：

*   `warning` \(預設\) - 編譯器會將診斷以警告的形式發出，但不會阻擋編譯。
    編譯器仍會以狀態碼 0 結束，即使發出了警告。

*   `error` - 編譯器會將診斷以錯誤的形式發出，並讓編譯失敗。
    如果發出一個以上的錯誤，編譯器會以非零的狀態碼結束。

*   `suppress` - 編譯器完全不會發出該診斷。

檢查的嚴重程度可以在專案的 `tsconfig.json` 檔案中設定：

<code-example format="jsonc" language="jsonc">

{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      // The categories to use for specific diagnostics.
      "checks": {
        // Maps check name to its category.
        "invalidBananaInBox": "suppress"
      },

      // The category to use for any diagnostics not listed in &grave;checks&grave; above.
      "defaultCategory": "error"
    }
  }
}

</code-example>

`checks` 欄位會將個別診斷的名稱對應到其所屬的類別。
完整清單與設定時使用的名稱，請見[診斷](#診斷)。

`defaultCategory` 欄位適用於未在 `checks` 下明確列出的任何診斷。
如果未設定，這類診斷會被視為 `warning`。

啟用 [`strictTemplates`](guide/template-typecheck#嚴格模式) 時，才會發出擴充診斷。
這是必要的，如此編譯器才能更了解 Angular 範本的型別，並提供準確且有意義的診斷。

## 語意化版本

Angular 團隊打算在 Angular 的**次要**版本中新增或啟用新的擴充診斷（請見 [semver](https://docs.npmjs.com/about-semantic-versioning)）。
這表示升級 Angular 可能會在你現有的程式碼庫中顯示新的警告。
這讓團隊能夠更快交付功能，並讓開發者更容易使用擴充診斷。

然而，設定 `"defaultCategory": "error"` 會把這類警告提升為嚴重的錯誤。
這可能導致次要版本升級引入編譯錯誤，可能被視為不符合 semver 的破壞性變更。
任何新的診斷都可以透過上述[設定](#設定)加以停用或降級為警告，因此對於預設將擴充診斷視為錯誤的專案來說，新診斷的影響應該很小。
預設為錯誤是一個非常強大的工具；在決定 `error` 是否適合作為你專案的預設值時，只需注意這項 semver 注意事項。

## 新的診斷

Angular 團隊隨時歡迎大家建議可以新增的診斷。
擴充診斷一般應該：

*   偵測開發者在使用 Angular 範本時常見但不明顯的錯誤
*   清楚說明這種模式為什麼可能導致錯誤或非預期的行為
*   提出一個或多個明確的解決方案
*   誤判率低，最好是零
*   適用於絕大多數 Angular 應用程式 \(而非特定於非官方程式庫\)
*   改善程式的正確性或效能 \(而非程式碼風格，風格是 linter 的責任\)

如果你有符合這些條件的編譯器檢查點子，請考慮提交一份[功能請求](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml)。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
