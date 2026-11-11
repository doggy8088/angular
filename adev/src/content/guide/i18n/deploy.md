# 部署多個地區設定

若 `myapp` 是包含專案可散發檔案的目錄，你通常會將不同版本放在各自的地區設定目錄中，供不同地區設定使用。
例如，法文版位於 `myapp/fr` 目錄，西班牙文版則位於 `myapp/es` 目錄。

帶有 `href` 屬性的 HTML `base` 標籤，指定了相對連結的基底 URI（即 URL）。
若你將 [`angular.json`][GuideWorkspaceConfig] 工作區建置設定檔中的 `"localize"` 選項設為 `true` 或地區設定 ID 的陣列，CLI 會為應用程式的每個版本調整基底 `href`。
為了調整各版本的基底 `href`，CLI 會將地區設定加入設定好的 `"subPath"`。
請在你的 [`angular.json`][GuideWorkspaceConfig] 工作區建置設定檔中，為每個地區設定指定 `"subPath"`。
下列範例將 `"subPath"` 設為空字串。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="i18n-subPath"/>

## 設定伺服器

多語言的典型部署方式，是從不同的子目錄提供每種語言。
使用者會依據 `Accept-Language` HTTP 標頭，被重新導向至瀏覽器中定義的偏好語言。
若使用者未定義偏好語言，或偏好語言無法使用，伺服器會改用預設語言。
若要切換語言，將目前位置改到另一個子目錄即可。
子目錄的切換，通常是透過應用程式中實作的選單完成。

關於如何將應用程式部署到遠端伺服器的更多資訊，請見[部署][GuideDeployment]。

IMPORTANT: 若你使用[混合渲染](guide/hybrid-rendering)且 `outputMode` 設為 `server`，Angular 會依據 `Accept-Language` HTTP 標頭動態自動處理重新導向。這省去了手動調整伺服器或設定的麻煩，讓部署更簡單。

### Nginx 範例 {#nginx-example}

下列範例顯示 Nginx 設定。

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Apache 範例 {#apache-example}

下列範例顯示 Apache 設定。

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment '部署 | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular 工作區設定 | Angular'
