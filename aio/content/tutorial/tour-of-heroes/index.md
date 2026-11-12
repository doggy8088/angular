# 英雄之旅應用程式與教學

<div class="callout is-helpful">

<header>開始使用</header>

在本教學中，你將從頭開始建立自己的 Angular 應用程式。
這是體驗典型開發流程的好方法，同時還能學習 Angular 應用程式設計的概念、工具與術語。

如果你是 Angular 新手，請先試試 [**Try it now**](start) 快速入門應用程式。
**Try it now** 以現成的部分完成專案為基礎。
你可以在 StackBlitz 中編輯應用程式，並即時看到結果。

**Try it now** 以精簡的格式涵蓋相同的主要主題 &mdash;元件、範本語法、路由、服務，以及使用 HTTP 存取資料&mdash;，並遵循最佳做法。

</div>

本 *Tour of Heroes* 教學介紹 Angular 的基礎知識，並說明如何：

* 設定本機 Angular 開發環境。
* 使用 [Angular CLI](cli "CLI command reference") 來開發應用程式。

你將建立的 *Tour of Heroes* 應用程式可協助一家人力仲介公司管理其旗下的英雄。該應用程式具備許多你在任何資料驅動應用程式中都期望看到的功能。

完成的應用程式：

* 取得英雄清單
* 在清單中顯示英雄
* 編輯所選英雄的詳細資訊
* 在英雄資料的不同檢視之間導覽

本教學會向你展示如何做到下列事項，讓你有信心 Angular 能夠完成你需要的任何事：

*   使用 Angular [指令](guide/glossary#指令directive "Directives definition")來顯示與隱藏元素，並顯示英雄資料清單。
*   建立 Angular [元件](guide/glossary#元件component "Components definition")，以顯示英雄詳細資訊並展示英雄陣列。
*   使用單向[資料繫結](guide/glossary#資料繫結data-binding "Data binding definition")來處理唯讀資料。
*   加入可編輯的欄位，使用雙向資料繫結來更新模型。
*   將元件方法繫結到使用者事件，例如按鍵與點按。
*   讓使用者可以從清單中選取一位英雄，並在詳細資訊檢視中編輯該英雄。
*   使用[管道](guide/glossary#管道pipe "Pipe definition")來格式化資料。
*   建立共用的[服務](guide/glossary#服務service "Service definition")來彙整英雄。
*   使用[路由](guide/glossary#路由器router "Router definition")在不同檢視及其元件之間導覽。

<div class="callout is-helpful">

<header>解答</header>

完成所有教學步驟後，最終的應用程式看起來就像這個範例。

<live-example name="toh-pt6"></live-example>.

</div>

## 設計你的新應用程式

以下是本教學最終成果的圖片，顯示儀表板檢視與最英勇的英雄：

<div class="lightbox">

<img alt="英雄儀表板的輸出" src="generated/images/guide/toh/heroes-dashboard-1.png">

</div>

你可以按一下儀表板中的 **Dashboard** 與 **Heroes** 連結，在檢視之間導覽。

如果你按一下儀表板上的英雄「Magneta」，路由器會開啟「Hero Details」檢視，你可以在其中變更英雄的名稱。

<div class="lightbox">

<img alt="應用程式中英雄的詳細資料" src="generated/images/guide/toh/hero-details-1.png">

</div>

按一下「Back」按鈕會返回儀表板。頂端的連結會帶你前往任一主要檢視。如果你按一下「Heroes」，應用程式會顯示「Heroes」清單檢視。

<div class="lightbox">

<img alt="英雄清單應用程式的輸出" src="generated/images/guide/toh/heroes-list-2.png">

</div>

當你按一下不同的英雄名稱時，清單下方的唯讀迷你詳細資訊會反映新的選擇。

你可以按一下「View Details」按鈕，深入查看所選英雄的可編輯詳細資訊。

下圖說明了導覽選項。

<div class="lightbox">

<img alt="檢視導覽" src="generated/images/guide/toh/nav-diagram.png">

</div>

以下是應用程式的實際運作情形：

<div class="lightbox">

<img alt="英雄之旅實際運作" src="generated/images/guide/toh/toh-anim.gif">

</div>

## 後續步驟

*  [建立新專案](tutorial/tour-of-heroes/toh-pt0)

@reviewed 2022-05-16
