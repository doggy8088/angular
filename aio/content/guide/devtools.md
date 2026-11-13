# DevTools 總覽

Angular DevTools 是一個瀏覽器擴充功能，提供 Angular 應用程式的除錯與效能分析功能。Angular DevTools 支援 Angular v12 及更新版本，條件是編譯時停用[最佳化設定選項](guide/workspace-config#最佳化設定)（<code>{optimization:false}</code>）。

<div class="video-container">

<iframe allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" src="https://www.youtube.com/embed/bavWOHZM6zE"></iframe>

</div>

你可以在 [Chrome 線上應用程式商店](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh)與 [Firefox Addons](https://addons.mozilla.org/en-GB/firefox/addon/angular-devtools/) 找到 Angular DevTools。

安裝 Angular DevTools 後，在瀏覽器 DevTools 的 Angular 分頁下找到這個擴充功能。

<div class="lightbox">

<img alt="Angular DevTools" src="generated/images/guide/devtools/devtools.png">

</div>

開啟擴充功能後，你會看到兩個額外的分頁：

| 分頁                                                   | 詳細資訊                                                                                           |
|:---                                                                                                                                                                                  |:---       |
| [Components](#components)   | 讓你探索應用程式中的元件與指令，並預覽或編輯它們的狀態。                                            |
| [Profiler](#profiler)   | 讓你對應用程式進行效能分析，了解變更偵測執行期間的效能瓶頸所在。                                    |

<div class="lightbox">

<img alt="DevTools 頁籤" src="generated/images/guide/devtools/devtools-tabs.png">

</div>

在 Angular DevTools 右上角，你會看到頁面上正在執行的 Angular 版本，以及擴充功能的最新 commit 雜湊值。

## 問題回報

在 [GitHub](https://github.com/angular/angular/issues) 上回報問題與功能請求。

若要回報 Profiler 的問題，請點選 **Save Profile** 按鈕匯出 Profiler 的錄製資料，再將匯出的檔案附加到問題中。

<div class="alert is-helpful">

請確認 Profiler 的錄製資料不包含任何機密資訊。

</div>

<a id="components"></a>

## 為你的應用程式除錯

**Components** 分頁讓你探索應用程式的結構。你可以視覺化並檢視元件與指令的執行個體，預覽或修改它們的狀態。在接下來的幾節中，我們會了解如何有效使用這個分頁來為應用程式除錯。

### 探索應用程式結構

<div class="lightbox">

<img alt="元件總管" src="generated/images/guide/devtools/component-explorer.png">

</div>

在前面的截圖中，你可以看到應用程式的元件樹。

元件樹會顯示應用程式內 *元件與指令* 的階層關係。當你選取某個元件或指令執行個體時，Angular DevTools 會顯示關於該執行個體的更多資訊。

### 檢視屬性

在元件總管中點選個別元件或指令即可選取它們，並預覽它們的屬性。
Angular DevTools 會在元件樹右側顯示屬性與中繼資料。

使用滑鼠或下列鍵盤快速鍵，在元件樹中瀏覽：

| 鍵盤快速鍵     | 詳細資訊 |
|:---                                                                                                                                                                                  |:---       |
| 上下方向鍵    | 選取上一個與下一個節點 |
| 左右方向鍵 | 收合與展開節點         |

若要依名稱尋找元件或指令，請使用元件樹上方的搜尋框。若要前往下一個搜尋結果，請按 `Enter`。若要前往上一個搜尋結果，請按 `Shift + Enter`。

<div class="lightbox">

<img alt="搜尋" src="generated/images/guide/devtools/search.png">

</div>

### 前往主機節點

若要前往特定元件或指令的宿主元素，請在元件總管中找到它並按兩下。瀏覽器的 DevTools 會在 Chrome 開啟 Elements 分頁（或在 Firefox 開啟 Inspector 分頁），並選取相關聯的 DOM 節點。

### 前往原始碼

對於元件，Angular DevTools 讓你能在 Sources 分頁（Chrome）與 Debugger 分頁（Firefox）中前往元件定義。
選取特定元件後，點選屬性檢視右上角的圖示：

<div class="lightbox">

<img alt="導覽至原始碼" src="generated/images/guide/devtools/navigate-source.png">

</div>

### 更新屬性值

和瀏覽器的 DevTools 一樣，屬性檢視可讓你編輯輸入、輸出或其他屬性的值。在屬性值上按一下滑鼠右鍵。若此值型別支援編輯功能，你會看到一個文字輸入框。輸入新值並按 `Enter`。

<div class="lightbox">

<img alt="更新屬性" src="generated/images/guide/devtools/update-property.png">

</div>

### 在主控台存取選取的元件或指令

在主控台中，Angular DevTools 提供了一個快速方式，讓你存取最近選取的元件或指令的執行個體。輸入 `$ng0` 可取得目前選取的元件或指令執行個體的參照，輸入 `$ng1` 則取得上一個選取的執行個體。

<div class="lightbox">

<img alt="存取主控台" src="generated/images/guide/devtools/access-console.png">

</div>

### 選取指令或元件

和瀏覽器 DevTools 類似，你可以檢視頁面來選取特定元件或指令。
點選 Angular DevTools 左上角的 **_Inspect element_** 圖示，再將滑鼠懸停在頁面上的 DOM 元素上。
擴充功能會辨識相關聯的指令與元件，讓你在元件樹中選取對應的元素。

<div class="lightbox">

<img alt="選取 DOM 節點" src="generated/images/guide/devtools/inspect-element.png">

</div>

<a id="profiler"></a>

## 為你的應用程式進行效能分析

**Profiler** 分頁讓你預覽 Angular 變更偵測的執行過程。

<div class="lightbox">

<img alt="效能分析器" src="generated/images/guide/devtools/profiler.png">

</div>

Profiler 可讓你開始進行效能分析，或匯入既有的設定檔。若要開始分析你的應用程式，請將滑鼠懸停在 **Profiler** 分頁左上角的圓圈上，然後點選 **Start recording**。

在效能分析期間，Angular DevTools 會擷取執行事件，例如變更偵測與生命週期鉤子的執行。若要結束錄製，請再次點選圓圈以 **Stop recording**。

你也可以匯入既有的錄製資料。
這項功能的詳細說明請參閱[匯入與匯出錄製資料](#匯入錄製資料)一節。

### 了解應用程式的執行過程

在下列截圖中，查看完成錄製後 Profiler 的預設檢視。

<div class="lightbox">

<img alt="預設效能分析器檢視" src="generated/images/guide/devtools/default-profiler-view.png">

</div>

在檢視畫面靠近頂部的地方，你可以看到一連串的長條，每個長條代表應用程式中的一次變更偵測週期。長條越高，表示應用程式在這個週期中花費的時間越長。選取某個長條時，DevTools 會算繪一個長條圖，顯示它在這個週期中擷取到的所有元件與指令。

<div class="lightbox">

<img alt="效能分析器選取的長條" src="generated/images/guide/devtools/profiler-selected-bar.png">

</div>

在變更偵測時間軸的較早位置，你可以查看 Angular 在這個週期中花了多少時間。Angular DevTools 會嘗試估算此處的掉幀情形，以指出應用程式的執行可能在何時影響使用者體驗。

Angular DevTools 也會指出是什麼觸發了變更偵測（也就是變更偵測的來源）。

### 了解元件的執行過程

點選某個長條後，你會看到一個詳細檢視，說明你的應用程式在特定指令或元件上花了多少時間：

<div class="lightbox">

<img alt="指令詳細資料" src="generated/images/guide/devtools/directive-details.png">

</div>

圖中顯示了 NgForOf 指令花費的總時間，以及其中呼叫了哪個方法。它也顯示了所選指令的父層階層。

### 階層檢視

<div class="lightbox">

<img alt="火焰圖檢視" src="generated/images/guide/devtools/flame-graph-view.png">

</div>

你也可以在火焰圖形式的檢視中預覽變更偵測的執行過程。圖中的每個磚塊代表算繪樹中特定位置上畫面的一個元素。

例如，若在某次變更偵測週期中，元件樹的特定位置原本是 `ComponentA`，該元件被移除後 Angular 在其位置算繪了 `ComponentB`，你會在同一個磚塊上看到這兩個元件。

每個磚塊的顏色取決於 Angular 在該處花費的時間。DevTools 會根據相對於在變更偵測中花費最多時間的磚塊所花費的時間，來決定顏色的深淺。

點選某個磚塊後，右側面板會顯示它的詳細資訊。
對磚塊按兩下可將它放大，方便檢視其巢狀子元素。

### 除錯 OnPush

若要預覽 Angular 執行了變更偵測的元件，請勾選火焰圖上方頂部的 **Change detection** 核取方塊。

這個檢視會將 Angular 執行了變更偵測的所有磚塊標為綠色，其餘標為灰色：

<div class="lightbox">

<img alt="OnPush 除錯" src="generated/images/guide/devtools/debugging-onpush.png">

</div>

### 匯入錄製資料

點選已錄製的效能分析工作階段右上角的 **Save Profile** 按鈕，即可將它匯出為 JSON 檔案並儲存到磁碟。
之後，在效能分析工具的初始檢視中點選 **Choose file** 輸入框，即可匯入該檔案。

<div class="lightbox">

<img alt="儲存設定檔" src="generated/images/guide/devtools/save-profile.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
