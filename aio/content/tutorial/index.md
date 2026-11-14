
# 教學：英雄之旅

本教學的宏大計畫，是建立一個應用程式，協助一家人力仲介公司管理其旗下的英雄。

英雄之旅應用程式涵蓋 Angular 的核心基礎知識。你將建立一個基本應用程式，
它具備許多你在功能完備的資料驅動應用程式中期望看到的功能：取得並顯示
英雄清單、編輯所選英雄的詳細資訊，並在英雄資料的
不同檢視之間導覽。

你將使用內建指令來顯示與隱藏元素，並顯示英雄資料清單。
你將建立元件，以顯示英雄詳細資訊並展示英雄陣列。
你將使用單向資料繫結來處理唯讀資料。你將加入可編輯的欄位，使用
雙向資料繫結來更新模型。你將把元件方法繫結到使用者事件，例如按鍵與點按。
你將讓使用者可以從主清單中選取一位英雄，並在詳細資訊檢視中編輯該英雄。你將
使用管道來格式化資料。你將建立共用的服務來彙整英雄。
你也將使用路由在不同檢視及其元件之間導覽。
<!-- CF: Should this be a bullet list? -->

你將學到足以入門的核心 Angular 知識，並有信心
Angular 能夠完成你需要的任何事。
你將以入門層級涵蓋很多內容，並找到許多連往
更深入頁面的連結。

完成本教學後，應用程式看起來就像這樣 <live-example name="toh-pt6"></live-example>。




## 你將建立什麼

以下讓你先一窺本教學的最終成果，從「Dashboard」
檢視與最英勇的英雄開始：


<figure>
  <img src='generated/images/guide/toh/heroes-dashboard-1.png' alt="英雄儀表板的輸出">
</figure>



你可以按一下儀表板上方的兩個連結（"Dashboard" 與 "Heroes"）
在此 Dashboard 檢視與 Heroes 檢視之間導覽。

如果你按一下儀表板上的英雄「Magneta」，路由器會開啟「Hero Details」檢視，
你可以在其中變更英雄的名稱。


<figure>
  <img src='generated/images/guide/toh/hero-details-1.png' alt="應用程式中英雄的詳細資料">
</figure>



按一下「Back」按鈕會返回儀表板。
頂端的連結會帶你前往任一主要檢視。
如果你按一下「Heroes」，應用程式會顯示「Heroes」主清單檢視。


<figure>
  <img src='generated/images/guide/toh/heroes-list-2.png' alt="英雄清單應用程式的輸出">
</figure>



當你按一下不同的英雄名稱時，清單下方的唯讀迷你詳細資訊會反映新的選擇。

你可以按一下「View Details」按鈕，深入查看
所選英雄的可編輯詳細資訊。

下圖涵蓋了所有的導覽選項。


<figure>
  <img src='generated/images/guide/toh/nav-diagram.png' alt="檢視導覽">
</figure>



以下是應用程式的實際運作情形：


<figure>
  <img src='generated/images/guide/toh/toh-anim.gif' alt="英雄之旅實際運作">
</figure>




## 下一步

你將一步一步建立英雄之旅應用程式。
每個步驟都由一個需求驅動，而你很可能
在許多應用程式中都遇過這樣的需求。每件事都有它的理由。

在過程中，你將熟悉 Angular 的許多核心基礎知識。

現在就開始，建立一個簡單的[英雄編輯器](tutorial/toh-pt1 "The Hero Editor")。
