# 預渲染靜態頁面

Angular Universal 可以讓你預渲染應用程式的頁面。預渲染是指在建置期間處理動態頁面、產生靜態 HTML 的程序。

## 如何預渲染頁面

要預渲染靜態頁面，請確認已為應用程式加入 SSR 功能。
如需更多資訊，請參閱 [Universal 指南](guide/universal)。
加入 SSR 後，請執行下列命令：

<code-example language="sh">
npm run prerender
</code-example>

### 預渲染的建置選項

當你為應用程式加入預渲染時，可以使用下列建置選項：

* `browserTarget`：指定要建置的目標。
* `serverTarget`：指定要用來預渲染應用程式的伺服器目標。
* `routes`：定義要預渲染的額外路由陣列。
* `guessRoutes`：建置器是否應擷取路由並猜測要渲染哪些路徑。預設為 `true`。
* `routesFile`：指定一個檔案，其中包含要預渲染的所有路由清單，以換行分隔。如果你有大量路由，這個選項很有用。
* `numProcesses`：指定執行預渲染命令時要使用的 CPU 數量。

### 預渲染動態路由

你可以預渲染動態路由。動態路由的範例是 `product/:id`，其中 `id` 是動態提供的。

要預渲染動態路由，請從下列選項中選擇其一：
 * 在命令列中提供額外路由
 * 使用檔案提供路由
 * 預渲染特定路由 

#### 在命令列中提供額外路由

執行預渲染命令時，你可以提供額外路由。例如：

<code-example language="sh">
ng run &lt;app-name&gt;:prerender --routes /product/1 /product/2
</code-example>


#### 使用檔案提供額外路由

你可以使用檔案提供路由來產生靜態頁面。如果你有大量路由要產生，這個方法很有用，例如電子商務應用程式的產品詳細資訊，這些資料可能來自外部來源（資料庫或 CMS）。

要使用檔案提供路由，請使用 `--routes-file` 選項，並指定一個包含路由的 `.txt` 檔案名稱。

例如，你可以使用指令碼從資料庫擷取 ID，並儲存到 `routes.txt` 檔案，來產生這個檔案：

<code-example language="none" header="routes.txt">
  /products/1
  /products/555
</code-example>

當你的 `.txt` 檔案準備好後，請執行下列命令，以使用動態值預渲染靜態檔案：

<code-example language="sh">
ng run &lt;app-name&gt;:prerender --routes-file routes.txt
</code-example>

#### 預渲染特定路由

你也可以把特定路由傳給預渲染命令。如果你選擇這個選項，請確認已停用 `guessRoutes` 選項。

<code-example language="sh">
ng run &lt;app-name&gt;:prerender --no-guess-routes --routes /product/1 /product/1 
</code-example>