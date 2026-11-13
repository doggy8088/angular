# 使用 Bazel 建置

本指南說明如何使用 Bazel 建置與測試 Angular 應用程式。


<div class="alert is-helpful">

本指南假設你已經熟悉如何使用 [CLI](cli) 開發與建置 Angular 應用程式。

它描述的功能屬於 Angular Labs 的一部分，不被視為穩定、受支援的 API。

</div>

## 搭配 Angular CLI 使用 Bazel

`@angular/bazel` 套件提供了一個建置器（builder），讓 Angular CLI 能使用 Bazel 作為建置工具。

若要為現有應用程式啟用，執行

```sh
ng add @angular/bazel
```

若要在新應用程式中使用 Bazel，先全域安裝 `@angular/bazel`

```sh
npm install -g @angular/bazel
```

然後以以下命令建立新應用程式

```sh
ng new --collection=@angular/bazel
```

現在當你使用 `ng build`、`ng serve` 等 Angular CLI 建置命令時，
Bazel 會在幕後被使用。
Bazel 的輸出會出現在 `dist/bin` 資料夾中。

> 命令列輸出包含來自 Bazel 的額外記錄。
> 我們計劃在未來減少這些輸出。

### 移除 Bazel

如果你需要停用 Bazel，可以還原備份檔案：

- `/angular.json.bak` 取代 `/angular.json`

## 進階設定

<div class="alert is-helpful">

編輯 Bazel 設定可能會讓你無法再停用 Bazel。
由 Bazel 驅動的自訂行為將無法在其他建置器中使用。

本節假設你已熟悉 [Bazel](https://docs.bazel.build)。

</div>

你可以手動調整 Bazel 設定來：

* 自訂建置步驟
* 將建置平行化，以獲得規模與增量建置的效益

執行以下命令來建立初始的 Bazel 設定檔：

```sh
ng build --leaveBazelFilesOnDisk
```

現在你會在 Angular 工作區中找到新檔案：

* `/WORKSPACE` 告訴 Bazel 如何下載外部相依性。
* `/BUILD.bazel` 與 `/src/BUILD.bazel` 告訴 Bazel 你的原始碼。

你可以在 http://github.com/angular/angular-bazel-example 找到一個功能完整、帶有自訂 Bazel 設定的範例。

使用 Bazel 進行前端專案開發的文件，連結自 https://docs.bazel.build/versions/master/bazel-and-javascript.html。



## 直接執行 Bazel

在某些情況下，你會想要繞過 Angular CLI 建置器，直接執行 Bazel CLI。
Bazel CLI 位於 `@bazel/bazel` npm 套件中。
你可以全域安裝它，讓 `bazel` 命令出現在你的 path 中，或在下方的 bazel 之處使用 `$(npm bin)/bazel` 代替。

Bazel 中常見的命令有：

* `bazel build [targets]`：編譯指定目標的預設輸出產物。
* `bazel test [targets]`：對於在模式中找到的任何 `*_test` 目標，執行其測試。
* `bazel run [target]`：編譯目標所代表的程式，然後執行它。

若要在輸入變更時重複執行命令（監看模式），把這些命令中的 `bazel` 換成 `ibazel`。

輸出位置會印在輸出中。

Bazel CLI 的完整文件位於 https://docs.bazel.build/versions/master/command-line-reference.html。


## 查詢建置圖

由於 Bazel 會從你的目標建構出一張圖，你可以從中找到許多有用的資訊。

使用 graphviz 這個選用相依性，你會得到一個 `dot` 程式，可以搭配 `bazel query` 使用：

```bash
$ bazel query --output=graph ... | dot -Tpng > graph.png
```

更多關於 `bazel query` 的細節，請參閱 https://docs.bazel.build/versions/master/query-how-to.html。


## 自訂 `BUILD.bazel` 檔案

「規則（Rules）」就像 Bazel 的外掛。市面上有許多規則集可用。本指南記錄的是由 Google 的 Angular 團隊維護的那些。

規則用於 `BUILD.bazel` 檔案中，這些檔案是你工作區中各套件的標記。每個 `BUILD.bazel` 檔案向 Bazel 宣告一個獨立的套件，不過你也可以採用較粗粒度的散佈方式，讓你發佈的套件（例如發佈到 `npm`）可以由許多 Bazel 套件組成。

在 `BUILD.bazel` 檔案中，每條規則必須先以 `load` 陳述式匯入。接著以一些屬性呼叫該規則，呼叫的結果就是：你已經向 Bazel 宣告，在給定一些輸入與相依性時，它可以如何推導出一些輸出。之後，當你執行 `bazel` 命令列時，Bazel 會載入你宣告的所有規則，以決定需要執行的事項的絕對順序。請注意，只有產生所請求輸出所需的規則才會真正被執行。

前端開發常見規則的清單，記錄在 https://github.com/bazelbuild/rules_nodejs/ 的 README 中。
