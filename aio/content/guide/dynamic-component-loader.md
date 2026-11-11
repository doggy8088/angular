# 動態元件載入器

元件範本並不總是固定的。
應用程式可能需要在執行階段載入新的元件。
本食譜會示範如何動態加入元件。

請參閱本食譜程式碼的 <live-example name="dynamic-component-loader"></live-example>。

<a id="dynamic-loading"></a>

## 動態元件載入

下列範例示範如何建立一個動態廣告橫幅。

英雄仲介機構正在規劃一檔廣告活動，有好幾個不同的廣告會在橫幅中輪播。
好幾個不同的團隊會頻繁加入新的廣告元件。
這讓使用靜態元件結構的範本變得不切實際。

相反地，你需要一種方法，在廣告橫幅的範本中不寫死元件參照，就能載入新的元件。

Angular 內建了用來動態載入元件的 API。

<a id="directive"></a>

## 錨點指令

在加入元件之前，你必須定義一個錨點，告訴 Angular 要把元件插入哪裡。

廣告橫幅使用一個名為 `AdDirective` 的輔助指令，標記範本中有效的插入點。

<code-example header="src/app/ad.directive.ts" path="dynamic-component-loader/src/app/ad.directive.ts"></code-example>

`AdDirective` 注入 `ViewContainerRef`，取得將承載動態加入元件的元素的 view 容器。

在 `@Directive` 裝飾器中，請注意 selector 名稱 `adHost`；那就是你用來把指令套用到元素上的名稱。下一節會示範做法。

<a id="loading-components"></a>

## 載入元件

廣告橫幅的大部分實作都在 `ad-banner.component.ts` 中。為了讓這個範例保持簡單，HTML 以範本字串的形式放在 `@Component` 裝飾器的 `template` 屬性中。

`<ng-template>` 元素就是你要套用剛建立的指令的地方。要套用 `AdDirective`，請回想 `ad.directive.ts` 中的 selector `[adHost]`，把它套用到 `<ng-template>` 上，但不要加方括號。現在 Angular 就知道要在哪裡動態載入元件了。

<code-example header="src/app/ad-banner.component.ts (template)" path="dynamic-component-loader/src/app/ad-banner.component.ts" region="ad-host"></code-example>

`<ng-template>` 元素是動態元件的好選擇，因為它不會算繪任何額外的輸出。

<a id="resolving-components"></a>

## 解析元件

仔細看一下 `ad-banner.component.ts` 中的方法。

`AdBannerComponent` 接受一個 `AdItem` 物件陣列作為輸入，它最終來自 `AdService`。`AdItem` 物件指定要載入的元件類型，以及要繫結到元件的任何資料。`AdService` 會回傳組成這檔廣告活動的實際廣告。

把一個元件陣列傳給 `AdBannerComponent`，就能得到一份動態的廣告清單，而範本中不需要靜態元素。

透過 `getAds()` 方法，`AdBannerComponent` 會循環走訪 `AdItem` 陣列，每 3 秒呼叫 `loadComponent()` 載入一個新元件。

<code-example header="src/app/ad-banner.component.ts (excerpt)" path="dynamic-component-loader/src/app/ad-banner.component.ts" region="class"></code-example>

`loadComponent()` 方法在這裡做了大部分的繁重工作。我們一步一步來看。首先，它挑選一個廣告。

<div class="alert is-helpful">

**`loadComponent()` 如何選擇廣告**

`loadComponent()` 方法用一些數學來選擇廣告。

首先，它把目前的 `currentAdIndex` 加一，除以 `AdItem` 陣列的長度，再把*餘數*作為新的 `currentAdIndex` 值。接著，它用這個值從陣列中選出一個 `adItem`。

</div>

接著，你要指定這個元件特定執行個體上的 `viewContainerRef`。你怎麼知道是這個特定執行個體？因為它參照的是 `adHost`，而 `adHost` 就是你先前設定、用來告訴 Angular 在哪裡插入動態元件的指令。

你可能還記得，`AdDirective` 會把 `ViewContainerRef` 注入它的建構子。指令就是這樣存取你想用來承載動態元件的元素。

要把元件加入範本，請在 `ViewContainerRef` 上呼叫 `createComponent()`。

`createComponent()` 方法會回傳已載入元件的參照。你可以用這個參照與元件互動：指派它的屬性或呼叫它的方法。

<a id="common-interface"></a>

## `AdComponent` 介面

在廣告橫幅中，所有元件都實作一個共同的 `AdComponent` 介面，以標準化傳遞資料給元件的 API。

以下是兩個範例元件與 `AdComponent` 介面，供你參考：

<code-tabs>
    <code-pane header="hero-job-ad.component.ts" path="dynamic-component-loader/src/app/hero-job-ad.component.ts"></code-pane>
    <code-pane header="hero-profile.component.ts" path="dynamic-component-loader/src/app/hero-profile.component.ts"></code-pane>
    <code-pane header="ad.component.ts" path="dynamic-component-loader/src/app/ad.component.ts"></code-pane>
</code-tabs>

<a id="final-ad-baner"></a>

## 最終的廣告橫幅

最終的廣告橫幅如下所示：

<div class="lightbox">

<img alt="廣告" src="generated/images/guide/dynamic-component-loader/ads-example.gif">

</div>

請參閱 <live-example name="dynamic-component-loader"></live-example>。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
