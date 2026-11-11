# 解決 Zone 污染

**Zone.js** 是 Angular 用來偵測應用程式狀態可能已變更的一種訊號機制。它會擷取非同步操作，例如 `setTimeout`、網路請求與事件監聽器。Angular 會根據來自 Zone.js 的訊號，排程變更偵測。

在某些情況下，排程的[任務](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks)或[微任務](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks)不會對資料模型造成任何變更，因此不需要執行變更偵測。常見的例子有：
* `requestAnimationFrame`、`setTimeout` 或 `setInterval`
* 由第三方程式庫排程的任務或微任務

本節涵蓋如何找出這種情況，以及如何讓程式碼在 Angular Zone 之外執行，以避免不必要的變更偵測呼叫。

## 找出不必要的變更偵測呼叫

你可以用 Angular DevTools 偵測不必要的變更偵測呼叫。它們在分析工具的時間軸中，經常以連續的長條出現，來源是 `setTimeout`、`setInterval`、`requestAnimationFrame` 或事件處理常式。當你的應用程式中呼叫這些 API 的地方有限時，變更偵測的叫用通常是由第三方程式庫造成的。

<div class="lightbox">
  <img alt="顯示 Zone 污染的 Angular DevTools 效能分析器預覽" src="generated/images/guide/change-detection/zone-pollution.png">
</div>

在上圖中，有一連串由與某個元素相關聯的事件處理常式觸發的變更偵測呼叫。在使用第三方的、非原生 Angular 元件時，這是常見的挑戰，因為它們不會改變 `NgZone` 的預設行為。


## 在 `NgZone` 之外執行工作

在這種情況下，你可以用 [NgZone](/guide/zone)，指示 Angular 避免為某段程式碼所排程的工作呼叫變更偵測。

```ts
import { Component, NgZone, OnInit } from '@angular/core';
@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
  }
}
```

前面的程式碼片段指示 Angular 在 Angular Zone 之外呼叫 `setInterval`，並在 `pollForUpdates` 執行後略過變更偵測。

第三方程式庫經常觸發不必要的變更偵測週期，因為它們在撰寫時並未考慮 Zone.js。若要避免這些額外的週期，請在 Angular Zone 之外呼叫程式庫的 API：

```ts
import { Component, NgZone, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

在 `runOutsideAngular` 內執行 `Plotly.newPlot('chart', data);`，是告訴框架：在初始化邏輯所排程的工作執行之後，不應該執行變更偵測。

例如，若 `Plotly.newPlot('chart', data)` 為某個 DOM 元素加上事件監聽器，Angular 在它們的處理常式執行後不會執行變更偵測。

@reviewed 2022-05-04
