# 發佈多個語言版本

如果 `myapp` 是包含專案可發佈檔案的目錄，通常會在語言環境目錄中為不同的語言環境提供不同的版本。
例如，法文版本位於 `myapp/fr` 目錄中，而西班牙文版本位於 `myapp/es` 目錄中。

HTML `base` 標籤與 `href` 屬性指定相對連結的基礎 URI 或 URL。
如果將 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中的 `"localize"` 選項設為 `true` 或多個地區 ID 陣列，CLI 會針對每個版本的應用程式調整基礎 `href`。
若要針對每個版本的應用程式調整基礎 `href`，CLI 會將地區新增至已設定的 `"baseHref"`。
在 [`angular.json`][AioGuideWorkspaceConfig] 工作區建置設定檔中，為每個地區指定 `"baseHref"`。
下列範例顯示 `"baseHref"` 設為空字串。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="i18n-baseHref"/>

另外，若要在編譯時宣告基本 `href`，請連同 [`ng build`][AioCliBuild] 使用 CLI `--baseHref` 選項。

## 配置伺服器

典型的多語言部署將每種語言服務放在不同的子目錄中。
使用者會根據瀏覽器中定義的偏好語言，使用 `Accept-Language` HTTP 標頭重新導向到該語言。
如果使用者沒有定義偏好語言，或是偏好語言不可用，則伺服器將回退至預設語言。
若要變更語言，請將您目前的位置變更至另一個子目錄。
子目錄的變更通常是透過應用程式中實作的選單來進行。

HELPFUL: 有關如何將應用程式部署到遠端伺服器的更多資訊，請參閱 [部署][AioGuideDeployment]。

### Nginx 範例

以下範例顯示 Nginx 組態。

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Apache 範例

以下範例顯示 Apache 設定。

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

{{ 無法處理文件最後的 LinkReferenceDefinitionGroup 部分，需手動更新！ }}
