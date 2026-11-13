# Angular 變更偵測與執行時期最佳化

**變更偵測**是 Angular 檢查應用程式狀態是否已改變、以及是否有任何 DOM 需要更新的過程。從高層次來看，Angular 會由上而下走訪你的元件，尋找變更。Angular 會定期執行它的變更偵測機制，讓資料模型的變更反映在應用程式的畫面中。變更偵測可以手動觸發，也可以透過非同步事件觸發（例如使用者互動，或 XMLHttpRequest 完成）。

變更偵測已經高度最佳化且效能良好，但如果應用程式執行它的頻率太高，仍可能造成速度變慢。

在本指南中，你將學到如何透過略過應用程式的某些部分、只在必要時才執行變更偵測，來控制並最佳化變更偵測機制。

如果你偏好用影音形式了解更多效能最佳化，請看這段影片：

<div class="video-container">

<iframe allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" src="https://www.youtube.com/embed/f8sA-i6gkGQ"></iframe>

</div>

@reviewed 2022-05-04
