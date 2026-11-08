# 部署多個地區設定

若 `myapp` 是包含專案可散發檔案的目錄，你通常會將不同版本放在各自的地區設定目錄中，供不同地區設定使用。
例如，法文版位於 `myapp/fr` 目錄，西班牙文版則位於 `myapp/es` 目錄。

帶有 `href` 屬性的 HTML `base` 標籤，指定了相對連結的基底 URI（即 URL）。
若你將 [`angular.json`][GuideWorkspaceConfig] 工作區建置設定檔中的 `"localize"` 選項設為 `true` 或地區設定 ID 的陣列，CLI 會為應用程式的每個版本調整基底 `href`。
為了調整各版本的基底 `href`，CLI 會使用設定好的 `"subPath"` 作為該地區設定的 URL 區段。
若未設定 `"subPath"`，預設會使用地區設定 ID。
請在你的 [`angular.json`][GuideWorkspaceConfig] 工作區建置設定檔中，為每個地區設定指定 `"subPath"`。
下列範例將 `"subPath"` 設為空字串。

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="i18n-subPath"/>

## 設定伺服器

多語言的典型部署方式，是從不同的子目錄提供每種語言。
使用者會依據 `Accept-Language` HTTP 標頭，被重新導向至瀏覽器中定義的偏好語言。
若使用者未定義偏好語言，或偏好語言無法使用，伺服器會改用預設語言。
若要切換語言，將目前位置改到另一個子目錄即可。
子目錄的切換，通常是透過應用程式中實作的選單完成。

關於如何將應用程式部署到遠端伺服器的更多資訊，請見[部署][GuideDeployment]。

IMPORTANT: 若你使用[伺服器端渲染](guide/ssr)且 `outputMode` 設為 `server`，Angular 會依據 `Accept-Language` HTTP 標頭動態自動處理重新導向。這省去了手動調整伺服器或設定的麻煩，讓部署更簡單。

### Nginx 範例 {#nginx-example}

下列範例顯示 Nginx 設定。

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Apache 範例 {#apache-example}

下列範例顯示 Apache 設定。

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

## 預渲染

若將 `outputMode` 設為 `static`，CLI 會在建置時，為每個地區設定預渲染你的伺服器路由中以 `RenderMode.Prerender` 設定的路由，且不會產生伺服器。
詳情請見[產生完全靜態的應用程式](guide/ssr#generate-a-fully-static-application)。
由於沒有伺服器負責選擇語言，重新導向與找不到頁面的處理由你的代管設定負責。

### 輸出結構

CLI 會將每個地區設定寫入 `browser/` 中各自的目錄。
每個目錄包含預渲染的 HTML、程式包，以及該地區設定的一份 `public/` 檔案副本。
預渲染頁面的 `lang` 屬性與 `<base href>` 都會符合該地區設定。

下列結構假設來源地區設定是從根目錄提供，如下一節所述。

```text
browser/
├── index.html
├── about/index.html
├── tr/
│   ├── index.html
│   └── about/index.html
└── es/
    ├── index.html
    └── about/index.html
```

根目錄頁面使用 `lang="en"` 與 `<base href="/">`。`tr/` 頁面使用 `lang="tr"` 與 `<base href="/tr/">`，`es/` 頁面使用 `lang="es"` 與 `<base href="/es/">`。

### 從根目錄提供來源地區設定

若要從 `/` 提供來源地區設定、並將其他地區設定嵌套在其下，請使用物件形式的 `sourceLocale`，並將 `"subPath"` 設為空字串。

```json
{
  "i18n": {
    "sourceLocale": {
      "code": "en",
      "subPath": ""
    },
    "locales": {
      "tr": "src/locale/messages.tr.xlf",
      "es": "src/locale/messages.es.xlf"
    }
  }
}
```

若未設定空的 `"subPath"`，CLI 會將來源地區設定放在以地區設定代碼命名的專屬目錄中，例如 `/en/`。

### 將使用者重新導向至其語言

靜態輸出不會依據 `Accept-Language` HTTP 標頭進行重新導向。
請設定你的主機，依據該標頭進行重新導向。
[Nginx](#nginx-example) 與 [Apache](#apache-example) 範例假設每個地區設定（包括預設值）都位於各自的子目錄中。
若來源地區設定是從根目錄提供，請調整這些範例，讓 `/` 只針對其他地區設定進行重新導向。

### 找不到頁面

CLI 不會為 `**` 萬用字元路由預渲染頁面。
若要提供找不到頁面，請宣告一個具體路由（例如 `404`），並確認你的伺服器路由會預渲染它。
如此每個地區設定都會有自己的頁面，例如 `/404/index.html` 與 `/tr/404/index.html`。
請設定你的主機，提供與遺失 URL 的地區設定路徑相符的頁面，例如在 Nginx 中使用 `error_page`，或在 Apache 中使用 `ErrorDocument`。

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment '部署 | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular 工作區設定 | Angular'
