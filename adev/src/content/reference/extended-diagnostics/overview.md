# 擴充診斷

有很多編碼模式對編譯器或執行階段在技術上有效，但可能具有複雜的細微差別或注意事項。
這些模式可能不會產生開發人員預期的預期效果，這通常會導致錯誤。
Angular 編譯器包含「延伸診斷」，可識別許多這些模式，以便警告開發人員潛在問題，並在程式碼庫中強制執行常見的最佳實務。

## 診斷

目前，Angular 支援以下擴充診斷：

| 程式碼     | 名稱                                                          |
|:---      |:---                                                           |
| `NG8101` | [`invalidBananaInBox`](extended-diagnostics/NG8101)           |
| `NG8102` | [`nullishCoalescingNotNullable`](extended-diagnostics/NG8102) |
| `NG8103` | [`missingControlFlowDirective`](extended-diagnostics/NG8103)  |
| `NG8104` | [`textAttributeNotBinding`](extended-diagnostics/NG8104)      |
| `NG8105` | [`missingNgForOfLet`](extended-diagnostics/NG8105)            |
| `NG8106` | [`suffixNotSupported`](extended-diagnostics/NG8106)           |
| `NG8107` | [`optionalChainNotNullable`](extended-diagnostics/NG8107)     |
| `NG8108` | [`skipHydrationNotStatic`](extended-diagnostics/NG8108)       |
| `NG8109` | [`interpolatedSignalNotInvoked`](extended-diagnostics/NG8109) |

## 配置

進階診斷預設為警告，不會阻擋編譯。
每個診斷都可以設定為：

| 錯誤類別 | 效果                                                                                                                                                                   |
|:---            | :---                                                                                                                                                                     |
| `warning`      | 預設 - 編譯器會將診斷結果視為警告，但不會阻止編譯。即使發出警告，編譯器仍會以狀態碼 0 結束。                                                                  |
| `error`        | 編譯器會將診斷結果視為錯誤，並導致編譯失敗。如果發出一個或多個錯誤，編譯器將以非零狀態碼結束。                                                                |
| `suppress`     | 編譯器完全 *不會* 發出診斷結果。                                                                                                                                            |

檢查嚴重性可設定為 [Angular 編譯器選項](reference/configs/angular-compiler-options)：

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

`checks` 欄位將個別診斷的名稱對映至其相關類別。
請參閱 [診斷](#diagnostics) 以取得完整擴充診斷清單以及用於設定診斷的名稱。

`defaultCategory` 欄位用於任何未在 `checks` 下明確列出的診斷。
如果未設定，則此類診斷將被視為 `warning`。

當啟用 [`strictTemplates`](tools/cli/template-typecheck#strict-mode) 時，會發出延伸診斷。
這對於讓編譯器更了解 Angular 範本類型並提供準確且有意義的診斷是必要的。

## 語義化版本

Angular 團隊打算在 Angular 的 **次要** 版本中新增或啟用新的延伸診斷（請參閱 [semver](https://docs.npmjs.com/about-semantic-versioning)）。
這表示升級 Angular 可能會在您現有的程式碼庫中顯示新的警告。
這讓團隊可以更快速地提供功能，並讓開發人員更易於存取延伸診斷。

然而，設定 `"defaultCategory": "error"` 會將此類警告提升為硬錯誤。
這可能導致次要版本升級引發編譯錯誤，這可能被視為與 semver 不相容的重大變更。
任何新的診斷都可以透過以上 [組態](#configuration) 予以壓制或降級為警告，因此新的診斷對預設將延伸診斷視為錯誤的專案的影響應為最低。
預設為錯誤是一個非常強大的工具；在決定 `error` 是否為專案的正確預設值時，請注意此 semver 注意事項。

## 新診斷

Angular 團隊隨時歡迎有關可以新增的新診斷的建議。
延伸診斷通常應該：

* 偵測出 Angular 範本中常見的、不顯而易見的開發人員錯誤
* 清楚說明此模式可能導致錯誤或意外行為的原因
* 建議一個或多個明確的解決方案
* 具有低、最好是零的誤判率
* 適用於絕大多數的 Angular 應用程式（不限於非官方程式庫）
* 改善程式正確性或效能（而非程式風格，程式風格的責任落在 linter）

如果您有符合這些標準的擴充診斷想法，請考慮提交[功能要求](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml)。

