# 將 HTTP 通訊新增到應用程式

本教學說明如何將 HTTP 與 API 整合至您的應用程式。

到目前為止，您的應用程式已從 Angular 服務中的靜態陣列讀取資料。下一步是使用應用程式將透過 HTTP 與其通訊的 JSON 伺服器。HTTP 要求將模擬從伺服器處理資料的體驗。

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k"/>

重要提示：我們建議您將此步驟的教學課程用於您的本地環境。

## 你將會學到

您的應用程式將使用來自 JSON 伺服器的資料

<docs-workflow>

<docs-step title="設定 JSON 伺服器">
JSON Server 是用於建立模擬 REST API 的開源工具。您將使用它來提供目前儲存在住房服務中的住房位置資料。

1. 使用以下命令從 npm 安裝 `json-server`。
    <docs-code language="bash">
        npm install -g json-server
    </docs-code>

1. 在專案的根目錄中，建立一個名為 `db.json` 的檔案。您將在此儲存 `json-server` 的資料。

1. 開啟 `db.json`，並將以下程式碼複製到檔案中
    <docs-code language="json">
        {
            "locations": [
                {
                    "id": 0,
                    "name": "Acme Fresh Start Housing",
                    "city": "Chicago",
                    "state": "IL",
                    "photo": "${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
                    "availableUnits": 4,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 1,
                    "name": "A113 Transitional Housing",
                    "city": "Santa Monica",
                    "state": "CA",
                    "photo": "${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg",
                    "availableUnits": 0,
                    "wifi": false,
                    "laundry": true
                },
                {
                    "id": 2,
                    "name": "Warm Beds Housing Support",
                    "city": "Juneau",
                    "state": "AK",
                    "photo": "${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
                    "availableUnits": 1,
                    "wifi": false,
                    "laundry": false
                },
                {
                    "id": 3,
                    "name": "Homesteady Housing",
                    "city": "Chicago",
                    "state": "IL",
                    "photo": "${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
                    "availableUnits": 1,
                    "wifi": true,
                    "laundry": false
                },
                {
                    "id": 4,
                    "name": "Happy Homes Group",
                    "city": "Gary",
                    "state": "IN",
                    "photo": "${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
                    "availableUnits": 1,
                    "wifi": true,
                    "laundry": false
                },
                {
                    "id": 5,
                    "name": "Hopeful Apartment Group",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
                    "availableUnits": 2,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 6,
                    "name": "Seriously Safe Towns",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
                    "availableUnits": 5,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 7,
                    "name": "Hopeful Housing Solutions",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg",
                    "availableUnits": 2,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 8,
                    "name": "Seriously Safe Towns",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg",
                    "availableUnits": 10,
                    "wifi": false,
                    "laundry": false
                },
                {
                    "id": 9,
                    "name": "Capital Safe Towns",
                    "city": "Portland",
                    "state": "OR",
                    "photo": "${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg",
                    "availableUnits": 6,
                    "wifi": true,
                    "laundry": true
                }
            ]
        }
    </docs-code>

1. 儲存此檔案。

1. 現在來測試您的設定。在命令列中，在專案的根目錄中，執行以下命令。

    <docs-code language="bash">
        json-server --watch db.json
    </docs-code>

1. 在您的網路瀏覽器中，導覽至 `http://localhost:3000/locations`，並確認回應包含儲存在 `db.json` 中的資料。

如果您的設定有任何問題，您可以在 [官方文件](https://www.npmjs.com/package/json-server) 中找到更多詳細資訊。
</docs-step>

<docs-step title="更新服務以使用 Web 伺服器而非本機陣列">
資料來源已設定，下一步是更新你的 Web 應用程式以連線到它來使用資料。

1. 在 `src/app/housing.service.ts` 中，進行下列變更：

    1. 更新程式碼以移除 `housingLocationList` 屬性和包含資料的陣列。

    1. 新增一個名為 `url` 的字串屬性，並將其值設定為 `'http://localhost:3000/locations'`。

        <docs-code language="javascript">
        url = 'http://localhost:3000/locations';
        </docs-code>

        這段程式碼會在檔案的其餘部分產生錯誤，因為它依賴 `housingLocationList` 屬性。我們接下來會更新服務方法。

    1. 更新 `getAllHousingLocations` 函式，以呼叫您設定的網路伺服器。

        <docs-code header="" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[12,14]"/>

        這段程式碼現在使用非同步程式碼透過 HTTP 進行 **GET** 要求。

        說明：在此範例中，程式碼使用 `fetch`。對於更進階的使用案例，請考慮使用 Angular 提供的 `HttpClient`。

    1. 更新 `getHousingLocationsById` 函式，以呼叫您設定的網路伺服器。

        <docs-code header="" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[16,19]"/>

    1. 完成所有更新後，您更新的服務應符合下列程式碼。

        <docs-code header="housing.service.ts 的最終版本" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts"/>

</docs-step>

<docs-step title="更新元件以使用非同步呼叫至住房服務">
伺服器現在會從 HTTP 要求讀取資料，但仰賴該服務的元件現在出現錯誤，因為這些元件已寫成使用同步版本的服務。

1. 在 `src/app/home/home.component.ts` 中，更新 `constructor` 以使用 `getAllHousingLocations` 方法的新非同步版本。

    <docs-code header="" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/home/home.component.ts" visibleLines="[36,41]"/>

1. 在 `src/app/details/details.component.ts` 中，更新 `constructor` 以使用 `getHousingLocationById` 方法的新非同步版本。

    <docs-code header="" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/details/details.component.ts" visibleLines="[61,66]"/>

1. 儲存您的程式碼。

1. 在瀏覽器中開啟應用程式並確認它可以正常執行。
</docs-step>

</docs-workflow>

摘要：在這個課程中，您已將您的應用程式更新為使用本機網路伺服器 (`json-server`)，並使用非同步服務方法來擷取資料。

恭喜！您已成功完成本教學，並準備好繼續您的旅程，建構更複雜的 Angular 應用程式。

如果您想了解更多，請考慮完成一些 Angular 的其他開發人員 [教學](tutorials) 和 [指南](overview)。
