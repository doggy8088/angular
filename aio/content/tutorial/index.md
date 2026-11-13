<h1 class="no-toc">英雄之旅應用程式與教學</h1>

<div class="callout is-helpful">
<header>開始使用</header>

在本教學中，你將從零開始建立自己的應用程式，體驗典型的開發流程，並認識基本的應用程式設計概念、工具與術語。

如果你是完全的 Angular 新手，不妨先試試 [**Try it now**](start) 快速入門應用程式。
它以現成的部分完成專案為基礎，你可以在 StackBlitz 互動式開發環境中檢視與修改它，並即時看到結果。

「Try it」教學以精簡的格式涵蓋相同的主要主題&mdash;元件、範本語法、路由、服務，以及使用 HTTP 存取資料&mdash;，並遵循最現行的最佳做法。

</div>

本 _Tour of Heroes_ 教學將向你展示如何設定本機開發環境，並使用 [Angular CLI 工具](cli "CLI command reference") 開發應用程式，同時介紹 Angular 的基礎知識。

你將建立的 _Tour of Heroes_ 應用程式可協助一家人力仲介公司管理其旗下的英雄。
該應用程式具備許多你在任何資料驅動應用程式中都期望看到的功能。
完成的應用程式會取得並顯示英雄清單、編輯所選英雄的詳細資訊，並在英雄資料的不同檢視之間導覽。

在整份 Angular 文件所用的許多範例中，你都會看到對此應用程式領域的引用與擴充，但你不一定要先完成本教學才能理解那些範例。

完成本教學後，你將能夠做到下列事項：

* 使用內建 Angular [指令](guide/glossary#指令directive "Directives definition")來顯示與隱藏元素，並顯示英雄資料清單。
* 建立 Angular [元件](guide/glossary#元件component "Components definition")，以顯示英雄詳細資訊並展示英雄陣列。
* 使用單向[資料繫結](guide/glossary#資料繫結data-binding "Data binding definition")來處理唯讀資料。
* 加入可編輯的欄位，使用雙向資料繫結來更新模型。
* 將元件方法繫結到使用者事件，例如按鍵與點按。
* 讓使用者可以從主清單中選取一位英雄，並在詳細資訊檢視中編輯該英雄。
* 使用[管道](guide/glossary#管道pipe "Pipe definition")來格式化資料。
* 建立共用的[服務](guide/glossary#服務service "Service definition")來彙整英雄。
* 使用[路由](guide/glossary#路由器router "Router definition")在不同檢視及其元件之間導覽。

你將學到足以入門的 Angular 知識，並有信心
Angular 能夠完成你需要的任何事。

<div class="callout is-helpful">
<header>解答</header>

完成所有教學步驟後，最終的應用程式看起來就像這樣： <live-example name="toh-pt6"></live-example>.

</div>

## 你將建立什麼

以下讓你先一窺本教學的最終成果，從「Dashboard」
檢視與最英勇的英雄開始：

<div class="lightbox">
  <img src='generated/images/guide/toh/heroes-dashboard-1.png' alt="英雄儀表板的輸出">
</div>

你可以按一下儀表板上方的兩個連結（"Dashboard" 與 "Heroes"），
在此 Dashboard 檢視與 Heroes 檢視之間導覽。

如果你按一下儀表板上的英雄「Magneta」，路由器會開啟「Hero Details」檢視，
你可以在其中變更英雄的名稱。

<div class="lightbox">
  <img src='generated/images/guide/toh/hero-details-1.png' alt="應用程式中英雄的詳細資料">
</div>

按一下「Back」按鈕會返回儀表板。
頂端的連結會帶你前往任一主要檢視。
如果你按一下「Heroes」，應用程式會顯示「Heroes」主清單檢視。


<div class="lightbox">
  <img src='generated/images/guide/toh/heroes-list-2.png' alt="英雄清單應用程式的輸出">
</div>

當你按一下不同的英雄名稱時，清單下方的唯讀迷你詳細資訊會反映新的選擇。

你可以按一下「View Details」按鈕，深入查看
所選英雄的可編輯詳細資訊。

下圖涵蓋了所有的導覽選項。

<div class="lightbox">
  <img src='generated/images/guide/toh/nav-diagram.png' alt="檢視導覽">
</div>

以下是應用程式的實際運作情形：

<div class="lightbox">
  <img src='generated/images/guide/toh/toh-anim.gif' alt="英雄之旅實際運作">
</div>
