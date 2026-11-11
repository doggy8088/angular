# 第 14 課：為你的應用程式加上 HTTP 通訊

本教學示範如何把 HTTP 和 API 整合到你的應用程式中。

到目前為止，你的應用程式都是從 Angular 服務中的靜態陣列讀取資料。下一步是改用 JSON 伺服器，讓應用程式透過 HTTP 與它通訊。這個 HTTP 請求會模擬與伺服器上的資料互動的體驗。

**預計時間**：~15 分鐘

**起始程式碼：** <live-example name="first-app-lesson-13"></live-example>

**完成程式碼：** <live-example name="first-app-lesson-14"></live-example>

## 你將學到什麼

你的應用程式會使用來自 JSON 伺服器的資料

## 步驟 1 - 設定 JSON 伺服器
JSON Server 是一個開源工具，用來建立模擬的 REST API。你會用它來提供目前儲存在住房服務中的住房地點資料。

1. 使用以下指令，從 npm 安裝 `json-server`。
    <code-example language="bash" format="bash">
        npm install -g json-server
    </code-example>

1. 在專案的根目錄中，建立一個名為 `db.json` 的檔案。這就是你存放 `json-server` 資料的地方。

1. 開啟 `db.json`，把以下程式碼複製到檔案中
    <code-example language="json" format="json">
        {
            "locations": [
                {
                    "id": 0,
                    "name": "Acme Fresh Start Housing",
                    "city": "Chicago",
                    "state": "IL",
                    "photo": "https://angular.io/assets/images/tutorials/faa/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
                    "availableUnits": 4,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 1,
                    "name": "A113 Transitional Housing",
                    "city": "Santa Monica",
                    "state": "CA",
                    "photo": "https://angular.io/assets/images/tutorials/faa/brandon-griggs-wR11KBaB86U-unsplash.jpg",
                    "availableUnits": 0,
                    "wifi": false,
                    "laundry": true
                },
                {
                    "id": 2,
                    "name": "Warm Beds Housing Support",
                    "city": "Juneau",
                    "state": "AK",
                    "photo": "https://angular.io/assets/images/tutorials/faa/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
                    "availableUnits": 1,
                    "wifi": false,
                    "laundry": false
                },
                {
                    "id": 3,
                    "name": "Homesteady Housing",
                    "city": "Chicago",
                    "state": "IL",
                    "photo": "https://angular.io/assets/images/tutorials/faa/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
                    "availableUnits": 1,
                    "wifi": true,
                    "laundry": false
                },
                {
                    "id": 4,
                    "name": "Happy Homes Group",
                    "city": "Gary",
                    "state": "IN",
                    "photo": "https://angular.io/assets/images/tutorials/faa/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
                    "availableUnits": 1,
                    "wifi": true,
                    "laundry": false
                },
                {
                    "id": 5,
                    "name": "Hopeful Apartment Group",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "https://angular.io/assets/images/tutorials/faa/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
                    "availableUnits": 2,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 6,
                    "name": "Seriously Safe Towns",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "https://angular.io/assets/images/tutorials/faa/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
                    "availableUnits": 5,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 7,
                    "name": "Hopeful Housing Solutions",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "https://angular.io/assets/images/tutorials/faa/r-architecture-GGupkreKwxA-unsplash.jpg",
                    "availableUnits": 2,
                    "wifi": true,
                    "laundry": true
                },
                {
                    "id": 8,
                    "name": "Seriously Safe Towns",
                    "city": "Oakland",
                    "state": "CA",
                    "photo": "https://angular.io/assets/images/tutorials/faa/saru-robert-9rP3mxf8qWI-unsplash.jpg",
                    "availableUnits": 10,
                    "wifi": false,
                    "laundry": false
                },
                {
                    "id": 9,
                    "name": "Capital Safe Towns",
                    "city": "Portland",
                    "state": "OR",
                    "photo": "https://angular.io/assets/images/tutorials/faa/webaliser-_TPTXZd9mOo-unsplash.jpg",
                    "availableUnits": 6,
                    "wifi": true,
                    "laundry": true
                }
            ]
        }
    </code-example>

1. 儲存這個檔案。

1. 現在來測試你的設定。在命令列中，於專案根目錄執行以下指令。

    <code-example language="bash" format="bash">
        json-server --watch db.json
    </code-example>

1. 在網頁瀏覽器中，前往 `http://localhost:3000/locations`，確認回應包含 `db.json` 中儲存的資料。

如果設定時遇到任何問題，可以在[官方文件](https://www.npmjs.com/package/json-server)中找到更多詳細資訊。

## 步驟 2 - 更新服務，改用網路伺服器而非本機陣列
資料來源已經設定完成，下一步是更新你的網路應用程式，讓它連接到資料來源並使用這些資料。

1. 在 `src/app/housing.service.ts` 中，進行以下變更：

    1. 更新程式碼，移除 `housingLocationList` 屬性與存放資料的陣列。

    1. 加上一個名為 `url` 的字串屬性，並把它的值設為 `'http://localhost:3000/locations'`
        
        <code-example anguage="javascript" format="javascript">
        url = 'http://localhost:3000/locations';
        </code-example>

        這段程式碼會讓檔案其餘部分出現錯誤，因為它們依賴 `housingLocationList` 屬性。接下來我們要更新服務的方法。

    1. 更新 `getAllHousingLocations` 函式，讓它呼叫你剛設定好的網路伺服器。

        <code-example header="" path="first-app-lesson-14/src/app/housing.service.ts" region="update-getAllHousingLocations"></code-example>

        這段程式碼現在使用非同步程式碼，透過 HTTP 發出 **GET** 請求。
        
        <div class="callout is-helpful">
        在本範例中，程式碼使用 `fetch`。如需更進階的用途，可以考慮使用 Angular 提供的 `HttpClient`。
        </div>

    1. 更新 `getHousingLocationsById` 函式，讓它呼叫你剛設定好的網路伺服器。

        <code-example header="" path="first-app-lesson-14/src/app/housing.service.ts" region="update-getHousingLocationById"></code-example>

    1. 所有更新都完成後，你更新好的服務應該與以下程式碼相符。

        <code-example header="Final version of housing.service.ts" path="first-app-lesson-14/src/app/housing.service.ts"></code-example>

## 步驟 3 - 更新元件，改用非同步呼叫來使用住房服務
伺服器現在會從 HTTP 請求讀取資料，但依賴這個服務的元件現在出現了錯誤，因為它們原本是針對同步版本的服務撰寫的。

1. 在 `src/app/home/home.component.ts` 中，更新 `constructor`，改用新版非同步的 `getAllHousingLocations` 方法。

    <code-example header="" path="first-app-lesson-14/src/app/home/home.component.ts" region="update-home-component-constructor"></code-example>

1. 在 `src/app/details/details.component.ts` 中，更新 `constructor`，改用新版非同步的 `getHousingLocationById` 方法。

    <code-example header="" path="first-app-lesson-14/src/app/details/details.component.ts" region="update-details-component-constructor"></code-example>

1. 儲存你的程式碼。

1. 在瀏覽器中開啟應用程式，確認它能順利執行、沒有任何錯誤。

## 課程回顧
在本課中，你更新了應用程式，學會了：
* 使用本機網路伺服器（`json-server`）
* 使用非同步的服務方法來擷取資料。

恭喜！你已經成功完成本教學，準備好繼續用 Angular 建置更複雜的應用程式了。如果你想了解更多，請考慮完成 Angular 其他的開發者[教學](tutorial)與[指南](/guide/developer-guide-overview)。

@reviewed 2023-07-12
