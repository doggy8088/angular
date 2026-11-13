# 搭配 Visual Studio 2015 使用 Angular

{@a top}

有些開發人員偏好使用 Visual Studio 作為他們的整合開發環境（IDE）。

本食譜說明在 ASP.NET 4.x 專案中，於 Visual Studio 2015 內設定與使用 Angular 應用程式檔案所需的步驟。

<div class="alert is-helpful">



本食譜沒有*即時範例*，因為它描述的是 Visual Studio，而不是
Angular 應用程式本身。它以 CLI 指令 [`ng new`](cli/new) 建立的起始 Angular 應用程式作為範例。


</div>


{@a asp-net-4}

## ASP.NET 4.x 專案

若要在 Visual Studio 2015 中以 **ASP.NET 4.x 專案**設定入門檔案，
請依照下列步驟進行：

<div class="alert is-helpful">



如果你偏好 `File | New Project` 的體驗，並且使用的是 **ASP.NET Core**，
可以考慮*實驗性的*
<a href="https://blog.stevensanderson.com/2016/10/04/angular2-template-for-visual-studio/">Visual Studio 2015 的 ASP.NET Core + Angular 範本</a>。
請注意，產生的程式碼與文件並不對應。請相應地調整。


</div>




<h2 id='prereq1'>
  先決條件：Node.js
</h2>



如果你的電腦上尚未安裝，請安裝 **[Node.js® 與 npm](https://nodejs.org/en/download/)**。
支援的版本與指示請參閱[本機環境設定](guide/setup-local "Setting up for Local Development")。








<h2 id='prereq2'>
  先決條件：Visual Studio 2015 Update 3
</h2>



使用 Visual Studio 開發 Angular 應用程式的最低需求是 Update 3。
較早的版本不遵循以 TypeScript 開發應用程式的最佳實務。
若要查看你的 Visual Studio 2015 版本，請移至 `Help | About Visual Studio`。

如果你還沒有，請安裝 **[Visual Studio 2015 Update 3](https://www.visualstudio.com/en-us/news/releasenotes/vs2015-update3-vs)**。
或者使用 `Tools | Extensions and Updates`，直接從 Visual Studio 2015 更新到 Update 3。



<h2 id='prereq3'>
  先決條件：設定外部 Web 工具
</h2>



將 Visual Studio 設定為使用全域的外部 Web 工具，而不是 Visual Studio 隨附的工具：

  * 使用 `Tools` | `Options` 開啟 **Options** 對話框。
  * 在左側的樹狀結構中，選取 `Projects and Solutions` | `External Web Tools`。
  * 在右側，將 `$(PATH)` 項目移到 `$(DevEnvDir`) 項目之上。這會告訴 Visual Studio
    先使用全域路徑中找到的外部工具（例如 npm），再使用它自己版本的外部工具。
  * 按一下 OK 關閉對話框。
  * 重新啟動 Visual Studio，讓此變更生效。

Visual Studio 現在會先在目前的工作區中尋找外部工具，
如果找不到，就會在全域路徑中尋找。如果 Visual Studio 在這兩個位置
都找不到，它將使用自己版本的工具。



<h2 id='prereq4'>
  先決條件：為 Visual Studio 2015 安裝 TypeScript
</h2>



雖然 Visual Studio Update 3 開箱即支援 TypeScript，但它目前並未隨附較新版本的 TypeScript，而那是開發 Angular 應用程式所需要的。

若要安裝最新版本的 TypeScript：

 * 下載並安裝最新的 [TypeScript for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48593)，

 * 或使用 npm 安裝：`npm install -g typescript@latest`。

你可以在**[這裡](https://blogs.msdn.microsoft.com/typescript/announcing-typescript-3-1/)**找到更多關於 Visual Studio 中 TypeScript 支援的資訊。

此時，Visual Studio 已準備就緒。最好先關閉 Visual Studio 並
重新啟動它，確保一切都是乾淨的。



<h2 id='download'>
  步驟 1：建立起始 Angular 應用程式
</h2>


 請依照[本機環境設定](guide/setup-local "Setting up for Local Development")中的指示，使用 CLI 指令 [`ng new`](cli/new) 建立起始 Angular 應用程式。





<h2 id='create-project'>
  步驟 2：建立 Visual Studio ASP.NET 專案
</h2>



以通常的方式建立 ASP.NET 4.x 專案，如下所示：

* 在 Visual Studio 中，從功能表選取 `File` | `New` | `Project`。
* 在範本樹狀結構中，選取 `Templates` | `Visual C#`（或 `Visual Basic`）| `Web`。
* 選取 `ASP.NET Web Application` 範本，為專案命名，然後按一下 OK。
* 選取所需的 ASP.NET 4.5.2 範本，然後按一下 OK。


<div class="alert is-helpful">



本食譜使用 `Empty` 範本，不加入任何資料夾、
沒有驗證，也沒有裝載。請為你的專案選取適當的範本與選項。


</div>




<h2 id='copy'>
  步驟 3：將 Angular 專案檔案複製到 ASP.NET 專案資料夾
</h2>

將起始 Angular 應用程式中的檔案複製到包含 `.csproj` 檔案的資料夾。
將這些檔案包含進 Visual Studio 專案，如下所示：

* 按一下 Solution Explorer 中的 `Show All Files` 按鈕，顯示專案中所有隱藏的檔案。
* 以滑鼠右鍵按一下每個要包含進專案的資料夾/檔案，並選取 `Include in Project`。
  至少要包含下列資料夾/檔案：

  * src/app 資料夾（如果系統詢問是否搜尋 TypeScript 型別定義，請回答 *No*）
  * src/styles.css
  * src/index.html
  * package.json
  * src/tsconfig.json



<h2 id='restore'>
  步驟 4：還原所需的套件
</h2>



還原 Angular 應用程式所需的套件，如下所示：

* 在 Solution Explorer 中以滑鼠右鍵按一下 `package.json` 檔案，並選取 `Restore Packages`。
  <br>這會使用 `npm` 安裝 `package.json` 檔案中定義的所有套件。
  這可能需要一些時間。
* 如果需要，可以開啟 Output 視窗（`View` | `Output`）觀看 npm 指令的執行。
* 忽略警告。
* 當還原完成時，Visual Studio 底部訊息列中的訊息
  應該會顯示：`Installing packages complete`。請耐心等待。這可能需要一段時間。
* 按一下 Solution Explorer 中的 `Refresh` 圖示。
* **不要**將 `node_modules` 資料夾包含進專案。讓它保持為隱藏的專案資料夾。



<h2 id='build-and-run'>
  步驟 5：建置並執行應用程式
</h2>



首先，確保 `src/index.html` 已設定為起始頁面。
在 Solution Explorer 中以滑鼠右鍵按一下 `index.html`，並選取 `Set As Start Page` 選項。

### 使用 F5 在 VS 中執行

大多數 Visual Studio 開發人員喜歡按下 F5 鍵，看到 IIS 伺服器啟動。
若要搭配入門應用程式使用 IIS 伺服器，你必須進行下列三項變更。

1. 在 `index.html` 中，將 base href 從 `<base href="/">` 改為 `<base href="/src/">`。
2. 同樣在 `index.html` 中，將指令碼改為使用帶有斜線的 `/node_modules`，
而不是不帶斜線的 `node_modules`。
3. 在 `src/systemjs.config.js` 中，接近檔案頂部的位置，
將 npm `path` 改為帶有斜線的 `/node_modules/`。


<div class="alert is-important">



進行這些變更之後，`npm start` 將不再運作。
你必須選擇為使用 IIS 的 F5 進行設定，*或者*為使用 lite-server 的 `npm start` 進行設定。


</div>



### 適用於使用路由的應用程式

如果你的應用程式使用路由，你需要教導伺服器在使用者要求 HTML 頁面時，
永遠回傳 `index.html`，
原因已在[部署](guide/deployment#fallback)指南中說明。

當你在應用程式*內部*移動時，一切看起來都很好。
但如果你重新整理瀏覽器，就會立刻看到問題，
或將應用程式頁面的連結（稱為「深層連結」）貼到瀏覽器網址列。

對於除了 `/` 或 `/index.html` 以外的任何位址，你最有可能從伺服器得到
*404 - Page Not Found* 回應。

你必須設定伺服器，為對這些「未知」頁面的請求回傳 `index.html`。
`lite-server` 開發伺服器開箱即能做到這一點。
如果你已切換到 F5 與 IIS，你就必須設定 IIS 來做到這一點。
本節將逐步說明調整入門應用程式的步驟。

#### 設定 IIS 重寫規則

Visual Studio 隨附 IIS Express，其中已內建重寫模組。
不過，如果你使用的是一般的 IIS，你就必須安裝重寫
模組。

將這些重寫規則加入 `web.config` 的接近底部的位置，告訴 Visual Studio 如何處理對路由應用程式頁面的請求：


<code-example format='.'>
  &lt;system.webServer&gt;
    &lt;rewrite&gt;
      &lt;rules&gt;
        &lt;rule name="Angular Routes" stopProcessing="true"&gt;
          &lt;match url=".*" /&gt;
          &lt;conditions logicalGrouping="MatchAll"&gt;
            &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt;
            &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt;
          &lt;/conditions&gt;
          &lt;action type="Rewrite" url="/src/" /&gt;
        &lt;/rule&gt;
      &lt;/rules&gt;
    &lt;/rewrite&gt;
  &lt;/system.webServer&gt;

</code-example>



<div class="alert is-helpful">



符合網址 `<match url=".*" />` 將重寫每個請求。如果你想讓
某些請求直接放行（例如 Web API 請求），你就必須調整這一點。

`<action type="Rewrite" url="/src/"/>` 中的 URL 應該
與 `index.html` 中的 base href 相符。


</div>



按一下 **Run** 按鈕或按 `F5`，以偵錯工具建置並啟動應用程式。


<div class="alert is-helpful">



按 `Ctrl-F5` 可以在不使用偵錯工具的情況下執行，速度更快。

</div>



預設瀏覽器會開啟並顯示入門範例應用程式。

嘗試編輯任何專案檔案。儲存並重新整理瀏覽器，
即可看到變更。
