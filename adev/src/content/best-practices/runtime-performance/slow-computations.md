# 緩慢的計算

在每個變更偵測週期中，Angular 同步地：

* 除非另有指定，否則會根據各個元件的偵測策略，評估所有元件中所有的範本表達式
* 執行 `ngDoCheck`、`ngAfterContentChecked`、`ngAfterViewChecked` 和 `ngOnChanges` 生命週期掛鉤。
範本或生命週期掛鉤中的單一緩慢運算可能會減慢整個變更偵測程序，因為 Angular 會依序執行運算。

## 識別緩慢的運算

您可使用 Angular DevTools 的分析器來識別繁重的運算。在效能時間軸中，按一下長條圖以預覽特定的變更偵測週期。這會顯示一個長條圖，其中顯示架構在每個元件的變更偵測中所花費的時間。當您按一下元件時，您可以預覽 Angular 花費了多少時間來評估其範本和生命週期鉤子。

<img alt="Angular DevTools profiler preview showing slow computation" src="assets/content/images/best-practices/runtime-performance/slow-computations.png">

例如，在前面的螢幕截圖中，選取了第二個已記錄的變更偵測週期。Angular 在這個週期花費了 573 毫秒以上，其中在 `EmployeeListComponent` 中花費的時間最長。在詳細資料面板中，您可以看到 Angular 花費了 297 毫秒以上來評估 `EmployeeListComponent` 的範本。

## 優化慢速運算

以下是一些移除緩慢運算的方法：

* **優化基礎演算法**。這是建議的方法。如果你可以加速造成問題的演算法，就能加速整個變更偵測機制。
* **使用純粹管道快取**。你可以將繁重的運算移到純粹的 [管道](/guide/pipes)。Angular 僅在偵測到其輸入內容已變更時，相較於上次 Angular 呼叫它時，才會重新評估純粹管道。
* **使用記憶化**。[記憶化](https://zh.wikipedia.org/wiki/%E8%A8%98%E6%86%B6%E5%8C%96) 是與純粹管道類似的技術，不同之處在於純粹管道僅保留運算的最後一個結果，而記憶化可以儲存多個結果。
* **避免在生命週期鉤子中重新繪製/重新配置**。某些 [操作](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) 會導致瀏覽器同步重新計算頁面配置或重新呈現。由於重新配置和重新繪製通常很慢，因此你應避免在每個變更偵測週期中執行它們。

純粹管道和記憶化有不同的取捨。純粹管道是 Angular 內建的概念，而記憶化則是快取函式結果的一般軟體工程實務。如果你經常使用不同的參數呼叫大量的運算，則記憶化的記憶體開銷可能會很大。
