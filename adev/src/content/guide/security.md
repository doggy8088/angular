# 安全

本主題說明 Angular 內建的防護措施，可防止常見的網路應用程式漏洞和攻擊，例如跨網站指令碼攻擊。
它不涵蓋應用程式層級安全性，例如驗證和授權。

有關以下所述的攻擊和緩解措施的更多資訊，請參閱 [開放式 Web 應用程式安全專案 (OWASP) 指南](https://www.owasp.org/index.php/Category:OWASP_Guide_Project)。

<docs-callout title="報告漏洞">

Angular 是 Google [開放原始碼軟體漏洞獎勵計畫](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules) 的一部分。[針對 Angular 中的漏洞，請在 https://bughunters.google.com 提交您的報告](https://bughunters.google.com/report)。

有關 Google 如何處理安全問題的更多資訊，請參閱 [Google 的安全哲學](https://www.google.com/about/appsecurity)。

</docs-callout>

## 最佳實務範例

以下是一些最佳實務，用於確保您的 Angular 應用程式是安全的。

1. **持續掌握最新的 Angular 函式庫版本** - Angular 函式庫會定期更新，而這些更新可能會修復在先前版本中發現的安全漏洞。請查看 Angular [變更日誌](https://github.com/angular/angular/blob/main/CHANGELOG.md)以取得與安全性相關的更新。
2. **請勿變更您的 Angular 副本** - 私人、自訂的 Angular 版本往往會落後於目前的版本，而且可能不包含重要的安全性修正和增強功能。您可以改為與社群分享您的 Angular 改進，並提出プルリクエスト。
3. **避免使用在文件中標記為「_安全性風險_」的 Angular API** - 如需更多資訊，請參閱本頁的 [信任安全值](#信任安全值) 部分。

## 防止跨網站指令碼 (XSS)

[跨網站指令碼 (XSS)](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%BD%91%E7%AB%99%E6%93%8D%E4%BB%B6) 使攻擊者能夠將惡意程式碼注入網頁。
此類程式碼之後可以，例如，竊取使用者和登入資料，或執行冒充使用者的動作。
這是網路上最常見的攻擊之一。

若要封鎖 XSS 攻擊，您必須防止惡意程式碼進入文件物件模型 (DOM)。
例如，如果攻擊者可以誘騙您在 DOM 中插入 `<script>` 標籤，他們就可以在您的網站上執行任意程式碼。
攻擊不限於 `<script>` 標籤，DOM 中的許多元素和屬性允許執行程式碼，例如，`<img alt="" onerror="...">` 和 `<a href="javascript:...">`。
如果攻擊者控制的數據進入 DOM，則會出現安全性漏洞。

### Angular 的跨網站腳本安全性模型

為了系統性地阻止 XSS 漏洞，Angular 預設將所有值視為不可信。
當將值從範本繫結或插補插入到 DOM 中時，Angular 會清除並轉譯不可信的值。
如果值已在 Angular 之外清除過且被視為安全，請透過將 [值標記為可信](#trusting-safe-values)來將此訊息傳達給 Angular。

與用於渲染的值不同，Angular 範本預設被視為可信賴，應視為可執行程式碼。
絕不要透過串接使用者輸入和範本語法來建立範本。
這麼做會讓攻擊者能夠將 [任意程式碼](https://zh.wikipedia.org/wiki/%E7%A0%81%E7%94%A8%E5%85%A5%E5%87%BA) 注入您的應用程式。
為防止這些漏洞，在生產部署中務必始終使用預設的 [Ahead-Of-Time (AOT) 範本編譯器](#use-the-aot-template-compiler)。

可透過使用內容安全政策和信任的類型提供額外的防護層級。
這些網路平台功能在 DOM 層級運作，這是防止 XSS 問題最有效的地方。在這裡，它們無法使用其他較低層級的 API 繞過。
因此，強烈建議您充分利用這些功能。若要執行此操作，請為應用程式設定 [內容安全政策](#content-security-policy) 並啟用 [信任的類型強制執行](#enforcing-trusted-types)。

### 清理和安全性內容

*消毒* 是對不受信任的數值進行檢查，將其轉換為可以安全插入 DOM 的數值。
在許多情況下，消毒根本不會改變數值。
消毒取決於上下文：
在 CSS 中無害的數值在 URL 中可能很危險。

Angular 定義以下安全內容：

| 安全性內容 | 詳細資料                                                                           |
| :---------------- | :-------------------------------------------------------------------------------- |
| HTML              | 用於將值解釋為 HTML，例如，繫結到 `innerHtml` 時。                               |
| Style             | 用於將 CSS 繫結到 `style` 屬性時。                                                  |
| URL               | 用於 URL 屬性，例如 `<a href>`.                                                      |
| Resource URL      | 作為程式碼載入並執行的 URL，例如，在 `<script src>` 中。                            |

Angular 會清除 HTML、樣式和 URL 的不受信任值。清除資源 URL 不可能，因為它們包含任意程式碼。
在開發模式中，當 Angular 在清除期間必須變更值時，它會印出主控台警告。

### 清理範例

以下範本繫結 `htmlSnippet` 的值。一次是透過將其內插到元素的內容中，另一次是透過將其繫結到元素的 `innerHTML` 屬性：

<docs-code header="src/app/inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

內插內容永遠是經過轉義的 &mdash;HTML 沒有被解釋，瀏覽器會在元素的文字內容中顯示尖括號。

若要解釋 HTML，請將它繫結到 HTML 屬性，例如 `innerHTML`。
請注意，將攻擊者可能會控制的值繫結到 `innerHTML` 通常會造成 XSS 漏洞。
例如，可以透過下列方式執行 JavaScript：

<docs-code header="src/app/inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" visibleRegion="class"/>

Angular 辨識值為不安全並自動清除它，這會移除 `script` 元素，但保留安全的內容，例如 `<b>` 元素。

<img alt="螢幕截圖顯示內插和綁定的 HTML 值" src="assets/content/images/guide/security/binding-inner-html.png#small">

### 直接使用 DOM API 和明確的 sanitization 呼叫

除非您強制執行信賴類型，內建瀏覽器 DOM API 不會自動保護您免於安全漏洞。
例如，`document`，可透過 `ElementRef` 存取的節點，以及許多第三方 API 包含不安全的函式。
同樣地，如果您與操作 DOM 的其他函式庫互動，您可能不會具備與 Angular 插補相同的自動防護。
避免直接與 DOM 互動，而改在可能的情況下使用 Angular 範本。

對於無法避免此情況，請使用內建的 Angular 清理功能。
使用 [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) 方法和適當的 `SecurityContext` 清理不受信任的值。
該函數也接受使用 `bypassSecurityTrust` &hellip; 函數標記為可信任的值，並且不會清理它們，如 [以下所述](#trusting-safe-values)。

### 信任安全值

有時應用程式確實需要包含可執行程式碼、顯示來自某些 URL 的 `<iframe>` 或建構潛在危險的 URL。
為防止在這些情況下自動清除，請告知 Angular 您已檢查值、檢查其建立方式，並確保其安全。
請務必小心。
如果您信任可能惡意的值，則您會在應用程式中引入安全性漏洞。
如有疑問，請尋求專業安全審查員。

要將值標記為可信賴，請注入 `DomSanitizer` 並呼叫下列其中一個方法：

* `bypassSecurityTrustHtml`
* `bypassSecurityTrustScript`
* `bypassSecurityTrustStyle`
* `bypassSecurityTrustUrl`
* `bypassSecurityTrustResourceUrl`

請記住，值是否安全取決於上下文，因此請選擇適合您預期值用途的正確上下文。
想像一下，以下範本需要將網址繫結至 `javascript:alert(...)` 呼叫：

<docs-code header="src/app/bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" visibleRegion="URL"/>

通常，Angular 會自動清除 URL、停用危險的程式碼，並在開發模式下將此動作記錄到主控台。
若要防止此情況，請使用 `bypassSecurityTrustUrl` 呼叫將 URL 值標記為可信賴的 URL：

<docs-code header="src/app/bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" visibleRegion="trust-url"/>

<img alt="截圖顯示從可信賴網址建立的警示框" src="assets/content/images/guide/security/bypass-security-component.png#medium">

如果您需要將使用者輸入轉換為可信賴值，請使用元件方法。
下列範本讓使用者輸入 YouTube 影片 ID 並在 `<iframe>` 中載入對應的影片。
`<iframe src>` 屬性為資源 URL 安全性內容，因為不可信賴的來源可以，例如，偷渡使用者可能不知情執行的檔案下載。
為防止此狀況，請在元件上呼叫方法來建構可信賴的影片網址，這會讓 Angular 允許繫結到 `<iframe src>`:

<docs-code header="src/app/bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" visibleRegion="iframe"/>

<docs-code header="src/app/bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" visibleRegion="trust-video-url"/>

### 內容安全性政策

內容安全性政策 \(CSP\) 是一種防禦深度技術，用於防止 XSS。
若要啟用 CSP，請將您的網路伺服器設定為傳回適當的 `Content-Security-Policy` HTTP 標頭。
在 Google Developers 網站上閱讀 [Web Fundamentals 指南](https://developers.google.com/web/fundamentals/security/csp) 以進一步瞭解內容安全性政策。

新 Angular 應用程式所需的最小政策是：

<docs-code language="text">

default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';

</docs-code>

在提供 Angular 應用程式時，伺服器應在每個要求的 HTTP 標頭中隨機產生一個一次性密碼。
您必須將此一次性密碼提供給 Angular，以便架構可以呈現 `<style>` 元素。
您可以透過下列兩種方式之一為 Angular 設定一次性密碼：

1. 在根應用程式元素上設定 `ngCspNonce` 屬性，例如 `<app ngCspNonce="randomNonceGoesHere"></app>`. 如果您可以使用伺服器端範本，則在建構回應時，可以在標頭和 `index.html` 中新增雜湊值，請採用此方法。
2. 使用 `CSP_NONCE` 注入程式碼提供雜湊值。如果您在執行階段可以存取雜湊值，而且想要快取 `index.html`，請採用此方法。

<docs-code language="typescript">

import {bootstrapApplication, CSP_NONCE} from '&commat;angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [{
    provide: CSP_NONCE,
    useValue: globalThis.myRandomNonceValue
  }]
});

</docs-code>

<docs-callout title="獨特的 nonce">

請務必確保您提供的權杖是<strong>每個請求唯一</strong>，且無法預測或猜測。
如果攻擊者可以預測未來的權杖，他們就可以規避 CSP 提供的防護。

</docs-callout>

如果您無法在專案中產生雜湊值，您可以透過將 `'unsafe-inline'` 新增至 CSP 標頭的 `style-src` 區段，來允許內嵌樣式。

| 段落                                         | 詳細資料                                                                                                                                                                                                     |
| :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`                            | 允許頁面從相同的來源載入所有必要的資源。                                                                                                                                                              |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | 允許頁面從相同的來源 \(`'self'`\) 載入全域樣式，並使用 `nonce-randomNonceGoesHere` 載入 Angular 插入的樣式。                                                                          |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | 允許頁面從相同的來源 \(`'self'`\) 載入 JavaScript，並使用 `nonce-randomNonceGoesHere` 載入 Angular CLI 插入的腳本。僅在您使用關鍵 CSS 內聯時需要。 |

Angular 本身僅需要這些設定即可正確運作。

隨著專案成長，您可能需要擴充 CSP 設定以容納應用程式特有的額外功能。

### 強制執行信任的類型

建議您使用 [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) 作為保護您的應用程式免受跨網站指令碼攻擊的一種方式。
Trusted Types 是 [網頁平台](https://zh.wikipedia.org/wiki/%E7%B6%B2%E7%AB%99%E5%B9%B3%E5%8F%B0) 功能，可透過強制執行更安全的編碼實務來幫助您防止跨網站指令碼攻擊。
Trusted Types 亦可協助簡化應用程式程式碼的稽核。

<docs-callout title="可信類型">

Trusted Types 可能尚未在您的應用程式所鎖定的所有瀏覽器中提供。
如果您的啟用 Trusted-Types 的應用程式在不支援 Trusted Types 的瀏覽器中執行，應用程式的功能會被保留。您的應用程式會透過 Angular 的 DomSanitizer 來防範 XSS。
請參閱 [caniuse.com/trusted-types](https://caniuse.com/trusted-types) 以了解目前的瀏覽器支援狀況。

</docs-callout>

若要為您的應用程式強制執行信任的類型，您必須將應用程式的網路伺服器設定為發出具有下列其中一個 Angular 政策的 HTTP 標頭：

| 政策                | 詳細                                                                                                                                                                                                                                                                                       |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angular`               | 此政策用於 Angular 內部的安全性審核程式碼，並且在強制執行受信任類型時，Angular 需要此政策才能運作。Angular 消毒的任何內聯範本值或內容都視為此政策的安全。                                                                                                           |
| `angular#unsafe-bypass` | 此政策用於使用 Angular 的 [DomSanitizer](api/platform-browser/DomSanitizer) 中任何會繞過安全性方法的應用程式，例如 `bypassSecurityTrustHtml`。任何使用這些方法的應用程式都必須啟用此政策。                                                                                             |
| `angular#unsafe-jit`    | 此政策由 [即時 (JIT) 編譯器](api/core/Compiler) 使用。如果您的應用程式直接與 JIT 編譯器互動，或是使用 [動態平台瀏覽器](api/platform-browser-dynamic/platformBrowserDynamic) 在 JIT 模式下執行，則必須啟用此政策。                                                                       |
| `angular#bundler`       | 建立延遲區塊檔案時，Angular CLI 捆綁器會使用此政策。                                                                                                                                                                                                                                           |

你應該在以下位置設定 Trusted Types 的 HTTP 標頭：

* 生產服務基礎架構
* Angular CLI \(`ng serve`\)，使用 `angular.json` 檔案中的 `headers` 屬性，用於本地端開發和端對端測試
* Karma \(`ng test`\)，使用 `karma.config.js` 檔案中的 `customHeaders` 屬性，用於單元測試

以下是一個特別為 Trusted Types 和 Angular 所配置的標題範例：

<docs-code language="html">

Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';

</docs-code>

一個特別為 Trusted Types 和使用任何 Angular 方法的 Angular 應用程式配置的標題範例，這些方法在 [DomSanitizer](api/platform-browser/DomSanitizer) 中並繞過安全性：

<docs-code language="html">

Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';

</docs-code>

以下是一個專門為使用 JIT 的 Trusted Types 和 Angular 應用程式設定的標頭範例：

<docs-code language="html">

Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';

</docs-code>

以下是一個專為 Trusted Types 和使用模組延遲載入的 Angular 應用程式所配置的標頭範例：

<docs-code language="html">

Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';

</docs-code>

<docs-callout title="社群貢獻">

若要進一步了解 Trusted Type 組態的疑難排解，下列資源可能會有幫助：

[防止使用值得信賴的類型來進行基於 DOM 的跨網站腳本漏洞](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>

### 使用 AOT 範本編譯器

AOT 模板編譯器可防止稱為模板注入的各種漏洞，並大幅提升應用程式效能。
AOT 模板編譯器是 Angular CLI 應用程式使用的預設編譯器，您應在所有製作部署中使用它。

AOT 編譯器的另一種選擇是 JIT 編譯器，它會在瀏覽器中於執行階段將範本編譯成可執行範本程式碼。
Angular 信任範本程式碼，因此動態產生範本並編譯它們，尤其是包含使用者資料的範本，會迴避 Angular 的內建防護。這是一種安全性反樣式。
如需有關以安全方式動態建構表單的資訊，請參閱 [動態表單](guide/forms/dynamic-forms) 指南。

### 伺服器端 XSS 保護

HTML 在伺服器上建構容易受到注入攻擊。
將範本程式碼注入 Angular 應用程式等同於將可執行程式碼注入應用程式：
這會讓攻擊者完全控制應用程式。
為了防止這種情況，請使用會自動跳脫值以防止伺服器上的 XSS 弱點的範本語言。
請勿使用範本語言在伺服器端建立 Angular 範本。這會帶來引入範本注入弱點的高風險。

## HTTP 層級漏洞

Angular 具備內建支援，可協助防止兩種常見的 HTTP 弱點，包括跨網站請求偽造 (CSRF 或 XSRF) 與跨網站指令碼包含 (XSSI)。
這兩種問題都必須主要在伺服器端減輕，但 Angular 提供了輔助工具，讓用戶端更容易整合。

### 跨網站請求偽造

在跨網站請求偽造 \(CSRF 或 XSRF\) 中，攻擊者誘騙使用者造訪包含惡意程式碼的不同網頁 \(例如 `evil.com`\)。此網頁秘密地將惡意要求傳送至應用程式的網路伺服器 \(例如 `example-bank.com`\)。

假設使用者已登入 `example-bank.com` 的應用程式。
使用者開啟一封電子郵件，並點擊連結至 `evil.com`，它會在新分頁中開啟。

`evil.com` 頁面立即將惡意要求傳送至 `example-bank.com`。
這可能是一筆要求將款項從使用者帳戶轉移至攻擊者帳戶。
瀏覽器會自動將 `example-bank.com` Cookie (包括驗證 Cookie) 與此要求一同傳送。

如果 `example-bank.com` 伺服器缺乏 XSRF 保護，它就無法辨別來自應用程式的合法請求與來自 `evil.com` 的偽造請求之間的差異。

為防止此情況，應用程式必須確保使用者要求來自真實應用程式，而非其他網站。
伺服器和用戶端必須合作以阻止此攻擊。

在常見的反 XSRF 技術中，應用程式伺服器會在 cookie 中傳送一個隨機建立的驗證權杖。
用戶端程式碼會讀取 cookie，並在所有後續請求中加入一個含有權杖的客製化請求標頭。
伺服器會將接收到的 cookie 值與請求標頭值進行比對，如果值遺失或不匹配，則拒絕請求。

此技術有效，因為所有瀏覽器都實施「同源政策」。
只有設定 Cookie 的網站上的程式碼才能讀取該網站的 Cookie，並在對該網站的請求上設定自訂標頭。
這表示只有您的應用程式可以讀取此 Cookie 令牌並設定自訂標頭。`evil.com` 上的惡意程式碼無法做到這一點。

Angular 的 `HttpClient` 內建支援此技巧的用戶端端。
在 [HttpClient 指南](/guide/http/security#xsrf-csrf-protection) 中閱讀更多相關資訊。

有關開放網路應用程式安全專案 \(OWASP\) 中的 CSRF 資訊，請參閱 [跨網站要求偽造 (CSRF)](https://owasp.org/www-community/attacks/csrf) 和 [跨網站要求偽造 (CSRF) 防護備忘清單](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)。
史丹佛大學論文 [跨網站要求偽造的強大防禦](https://seclab.stanford.edu/websec/csrf/csrf.pdf) 是豐富的詳細資訊來源。

另請參閱 Dave Smith 在 AngularConnect 2016 上的 XSRF 演講 (https://www.youtube.com/watch?v=9inczw6qtpY "跨網站請求偽造保護您的 Angular 應用免受惡意攻擊")。

### 跨網站腳本包含 (XSSI)

跨網站指令碼包含，也稱為 JSON 漏洞，允許攻擊者的網站從 JSON API 讀取資料。
此攻擊適用於舊版瀏覽器，方法是覆寫內建的 JavaScript 物件建構函數，然後使用 `<script>` 標籤包含 API URL。

只有當回傳的 JSON 可用 JavaScript 執行時，此攻擊才會成功。
伺服器可以透過加入字首至所有 JSON 回應，以使其無法執行，依慣例，使用廣為人知的字串 `")]}',\n"` 來防止攻擊。

Angular 的 `HttpClient` 函式庫辨識此慣例，並在進一步剖析之前，自動將字串 `")]}',\n"` 從所有回應中移除。

更多資訊，請參閱此 [Google 網路安全網誌文章](https://security.googleblog.com/2011/05/website-security-for-webmasters.html) 的 XSSI 部分。

## 稽核 Angular 應用程式

Angular 應用程式必須遵循與一般網路應用程式相同的安全性原則，並必須以這種方式進行稽核。
在安全性檢閱中應該稽核的 Angular 特定 API，例如 [_bypassSecurityTrust_](#trusting-safe-values) 方法，在文件中標記為安全性敏感。
