# 解決區域汙染

**Zone.js** 是一種信號機制，Angular 用來偵測應用程式狀態可能已變更的時間。它擷取非同步操作，例如 `setTimeout`、網路要求和事件監聽器。Angular 根據 Zone.js 的信號排程變更偵測。

在某些情況下，排定的 [任務](https://developer.mozilla.org/zh-TW/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) 或 [微任務](https://developer.mozilla.org/zh-TW/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) 根本不會在資料模型中進行任何變更，這使得執行變更偵測變得沒有必要。常見的範例包括：

* `requestAnimationFrame`, `setTimeout` 或 `setInterval`
* 透過第三方程式庫排程的工作或微工作

本節說明如何識別此類條件，以及如何在 Angular 區域外執行程式碼以避免不必要的變更偵測呼叫。

## 識別不必要的變更偵測呼叫

html
<p>
  如果變更偵測呼叫不必要，則可以透過以下方式進行優化：
</p>
<ul>
  <li>使用 ChangeDetectorRef.detach() 函式來分離檢測器。</li>
  <li>使用 ChangeDetectorRef.detectChanges() 函式手動觸發變更偵測。</li>
  <li>使用 ChangeDetectorRef.markForCheck() 函式標記檢測器以便在下次變更偵測週期中進行檢查。</li>
</ul>

您可以使用 Angular DevTools 偵測不必要的變更偵測呼叫。它們通常在 Profiler 的時間軸中以連續的長條出現，來源為 `setTimeout`、`setInterval`、`requestAnimationFrame` 或事件處理常式。當您的應用程式中對這些 API 的呼叫有限時，變更偵測呼叫通常是由第三方程式庫造成的。

<img alt="Angular DevTools profiler preview showing Zone pollution" src="https://angular.dev/assets/images/best-practices/runtime-performance/zone-pollution.png">

在上面的圖片中，有一系列變更偵測呼叫是由與元素關聯的事件處理常式觸發的。這是使用第三方、非原生 Angular 元件時常見的挑戰，這些元件不會變更 `NgZone` 的預設行為。

## 在 `NgZone` 外執行任務

html
<button (click)="runTaskOutsideNgZone()">Run task outside NgZone</button>


typescript
import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<button (click)="runTaskOutsideNgZone()">Run task outside NgZone</button>`
})
export class AppComponent {
  runTaskOutsideNgZone() {
    // Run a task outside the Angular zone.
    setTimeout(() => {
      console.log('Task completed outside the Angular zone.');
    }, 1000);
  }
}

在這種情況下，你可以指示 Angular 使用 [NgZone](/api/core/NgZone) 避免為由給定程式碼片段排定的任務呼叫變更偵測。

<docs-code header="Run outside of the Zone" language='ts' linenums>
import { Component, NgZone, OnInit } from '@angular/core';

@Component(...)
class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
  }
}
</docs-code>

上述程式碼片段指示 Angular 在 Angular Zone 外呼叫 `setInterval`，並在 `pollForUpdates` 執行後略過執行變更偵測。

第三方程式庫通常會觸發不必要的變更偵測週期，因為它們並非以 Zone.js 為前提而編寫。透過在 Angular 區域外呼叫程式庫 API，可以避免這些額外的週期：

<docs-code header="Move the plot initialization outside of the Zone" language='ts' linenums>
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
</docs-code>

在 `runOutsideAngular` 內執行 `Plotly.newPlot('chart', data);` 指示框架不應在初始化邏輯預定的任務執行後執行變更偵測。

例如，如果 `Plotly.newPlot('chart', data)` 將事件監聽器新增到 DOM 元素，則 Angular 在其處理程序執行後不會執行變更偵測。
