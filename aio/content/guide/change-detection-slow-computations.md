# 緩慢的計算

在每一次變更偵測週期中，Angular 都會同步地：

* 根據每個元件的偵測策略，評估所有元件中的所有範本運算式（除非另有指定）
* 執行 `ngDoCheck`、`ngAfterContentChecked`、`ngAfterViewChecked` 與 `ngOnChanges` 生命週期鉤子。
範本或生命週期鉤子中只要有單一緩慢的計算，就可能拖慢整個變更偵測過程，因為 Angular 是依序執行這些計算的。

## 找出緩慢的計算

你可以用 Angular DevTools 的分析工具找出耗費龐大的計算。在效能時間軸中，點選一個長條即可預覽某個特定的變更偵測週期。這會顯示一個長條圖，說明框架在每個元件的變更偵測上花了多少時間。點選某個元件時，你可以預覽 Angular 花了多少時間評估它的範本與生命週期鉤子。

<div class="lightbox">
  <img alt="顯示緩慢運算的 Angular DevTools 效能分析器預覽" src="generated/images/guide/change-detection/slow-computations.png">
</div>

例如，在前面的截圖中，選取的是第二個記錄到的變更偵測週期。Angular 在這個週期上花了超過 573 ms，其中花最多時間的是 `EmployeeListComponent`。在詳細資訊面板中，你可以看到 Angular 花了超過 297 ms 評估 `EmployeeListComponent` 的範本。

## 最佳化緩慢的計算

以下有幾種移除緩慢計算的技巧：

* **最佳化底層演算法**。這是建議的做法。若你能加速造成問題的演算法，就能加速整個變更偵測機制。
* **用純管道快取**。你可以把耗費龐大的計算移到純[管道](https://angular.io/guide/pipes)中。純管道只會在 Angular 偵測到它的輸入已變更（相較於 Angular 上次呼叫它的時候）時，才重新評估。
* **使用記憶化 (memoization)**。[Memoization](https://en.wikipedia.org/wiki/Memoization) 是一種與純管道類似的技巧，差別在於純管道只保留計算的最後一個結果，而記憶化可以儲存多個結果。
* **避免在生命週期鉤子中重繪／重排**。某些[操作](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/)會造成瀏覽器同步地重新計算頁面的版面配置，或重新渲染它。由於重排與重繪通常都很慢，你應該避免在每一次變更偵測週期中執行它們。

純管道與記憶化有不同的取捨。純管道是 Angular 內建的概念，而記憶化是快取函式結果的通用軟體工程實務。若你頻繁地以不同引數叫用耗費龐大的計算，記憶化的記憶體額外負擔可能相當可觀。

@reviewed 2022-05-04
