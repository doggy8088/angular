# 功能模組的類型

功能模組有五大一般類別，大致分為下列群組：

* 領域功能模組。
* 已路由功能模組。
* 路由模組。
* 服務功能模組。
* 小工具功能模組。

以下準則描述每種類型的用途與其典型特徵，但在真實世界的應用程式中，你可能會看到混合型態。

<table>

 <tr>
   <th style="vertical-align: top">
     功能模組
   </th>

   <th style="vertical-align: top">
     準則
   </th>
 </tr>

 <tr>
   <td>Domain</td>
   <td>
     領域功能模組提供專注於特定應用程式領域的使用者體驗，例如編輯客戶或下訂單。

     它們通常有一個頂層元件，扮演功能根的角色，私有的支援子元件則從它衍生。

     領域功能模組主要由宣告組成。只有頂層元件會被匯出。

     領域功能模組很少有提供者。如果有，所提供服務的生命週期應與模組的生命週期相同。

     領域功能模組通常只會被一個較大的功能模組匯入一次。

     它們可能會被缺乏路由的小型應用程式的根 `AppModule` 匯入。
   </td>
 </tr>
 <tr>
   <td>Routed</td>
   <td>
     已路由功能模組是領域功能模組，其頂層元件是路由器導覽路由的目標。

     所有延遲載入模組依定義都是已路由功能模組。

     已路由功能模組不匯出任何東西，因為它們的元件永遠不會出現在外部元件的範本中。

     延遲載入的已路由功能模組不應被任何模組匯入。這樣做會觸發積極載入，失去延遲載入的意義。也就是說，你不會在 `AppModule` 的 imports 中看到它們被提及。積極載入的已路由功能模組則必須被另一個模組匯入，編譯器才能知道它的元件。

     已路由功能模組很少有提供者，原因如[延遲載入功能模組](/guide/lazy-loading-ngmodules)所述。如果有，所提供服務的生命週期應與模組的生命週期相同。不要在已路由功能模組中，或在已路由模組匯入的模組中，提供應用程式全域的單例服務。
   </td>
 </tr>

 <tr>
   <td>Routing</td>
   <td>

     路由模組為另一個模組提供路由設定，並將路由相關事項與其搭配模組分開。

     路由模組通常會做以下事情：

     <ul>
     <li>定義路由。</li>
     <li>將路由器設定加入模組的 imports。</li>
     <li>將守衛與解析器服務提供者加入模組的 providers。</li>
     <li>路由模組的名稱應與其搭配模組的名稱對應，並使用字尾 "Routing"。例如，<code>foo.module.ts</code> 中的 <code>FooModule</code> 有一個名為 <code>FooRoutingModule</code> 的路由模組，位於 <code>foo-routing.module.ts</code>。如果搭配模組是根 <code>AppModule</code>，<code>AppRoutingModule</code> 會用 <code>RouterModule.forRoot(routes)</code> 將路由器設定加入其 imports。所有其他路由模組都是子模組，匯入 <code>RouterModule.forChild(routes)</code>。</li>
     <li>路由模組會重新匯出 <code>RouterModule</code> 以方便使用，讓搭配模組的元件可以存取 <code>RouterLink</code> 與 <code>RouterOutlet</code> 等路由器指令。</li>
     <li>路由模組沒有自己的宣告。元件、指令與管道是功能模組的責任，而不是路由模組的責任。</li>
     </ul>

     路由模組只應被其搭配模組匯入。

   </td>
 </tr>

 <tr>
   <td>Service</td>
   <td>

     服務模組提供工具型服務，例如資料存取與訊息傳遞。理想情況下，它們完全由提供者組成，沒有任何宣告。Angular 的 `HttpClientModule` 就是服務模組的一個好例子。

     根 `AppModule` 是唯一應匯入服務模組的模組。

   </td>
 </tr>

 <tr>
   <td>Widget</td>
   <td>

     小工具模組讓元件、指令與管道可供外部模組使用。許多第三方 UI 元件程式庫都是小工具模組。

     小工具模組應完全由宣告組成，其中大部分會被匯出。

     小工具模組很少有提供者。

     在任何元件範本需要這些小工具的模組中，匯入小工具模組。

   </td>
 </tr>

</table>

下表彙總每個功能模組群組的關鍵特徵。

<table>
 <tr>
   <th style="vertical-align: top">
     功能模組
   </th>

   <th style="vertical-align: top">
     宣告
   </th>

   <th style="vertical-align: top">
     提供者
   </th>

   <th style="vertical-align: top">
     匯出
   </th>

   <th style="vertical-align: top">
     由何者匯入
   </th>
 </tr>

 <tr>
   <td>Domain</td>
   <td>是</td>
   <td>很少</td>
   <td>頂層元件</td>
   <td>功能模組、AppModule</td>
 </tr>

 <tr>
   <td>Routed</td>
   <td>是</td>
   <td>很少</td>
   <td>否</td>
   <td>無</td>
 </tr>

 <tr>
   <td>Routing</td>
   <td>否</td>
   <td>是 (Guards)</td>
   <td>RouterModule</td>
   <td>功能模組 (供路由用)</td>
 </tr>

 <tr>
   <td>Service</td>
   <td>否</td>
   <td>是</td>
   <td>否</td>
   <td>AppModule</td>
 </tr>

 <tr>
   <td>Widget</td>
   <td>是</td>
   <td>很少</td>
   <td>是</td>
   <td>功能模組</td>
 </tr>
</table>

<hr />

## 更多關於 NgModule

你可能也會對以下內容感興趣：
* [使用 Angular 路由器延遲載入模組](guide/lazy-loading-ngmodules)。
* [提供者](guide/providers)。
