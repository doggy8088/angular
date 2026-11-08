# 解決 Zone 污染

**Zone.js** 是 Angular 用來偵測應用程式狀態可能已變更的一種訊號機制。它會擷取非同步操作，例如 `setTimeout`、網路請求與事件監聽器。Angular 會根據來自 Zone.js 的訊號，排程變更偵測。

在某些情況下，排程的[工作](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks)或[微工作](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks)並沒有對資料模型做任何變更，這時執行變更偵測就是不必要的。常見的例子有：

- `requestAnimationFrame`、`setTimeout` 或 `setInterval`
- 第三方程式庫排程的工作或微工作

本節涵蓋如何找出這種情況，以及如何讓程式碼在 Angular Zone 之外執行，以避免不必要的變更偵測呼叫。

## 找出不必要的變更偵測呼叫

你可以用 Angular DevTools 偵測不必要的變更偵測呼叫。它們在分析工具的時間軸中，經常以連續的長條出現，來源是 `setTimeout`、`setInterval`、`requestAnimationFrame` 或事件處理常式。當你的應用程式中呼叫這些 API 的地方有限時，變更偵測的叫用通常是由第三方程式庫造成的。

<img alt="Angular DevTools 分析工具預覽，顯示 Zone 污染" src="assets/images/best-practices/runtime-performance/zone-pollution.png">

在上圖中，有一連串由與某個元素相關聯的事件處理常式觸發的變更偵測呼叫。在使用第三方的、非原生 Angular 元件時，這是常見的挑戰，因為它們不會改變 `NgZone` 的預設行為。

## 在 `NgZone` 之外執行工作

在這種情況下，你可以用 [NgZone](/api/core/NgZone)，指示 Angular 避免為某段程式碼所排程的工作呼叫變更偵測。

```ts {header:"在 Zone 之外執行" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates, 500));
  }
}
```

前面的程式碼片段指示 Angular 在 Angular Zone 之外呼叫 `setInterval`，並在 `pollForUpdates` 執行後略過變更偵測。

當第三方程式庫的 API 在 Angular Zone 內被叫用時，它們經常觸發不必要的變更偵測週期。這種現象對會設定事件監聽器或發起其他工作（例如計時器、XHR 請求等）的程式庫影響特別明顯。只要在 Angular Zone 之外呼叫程式庫 API，就能避免這些額外的週期：

```ts {header:"把圖表初始化移到 Zone 之外" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

在 `runOutsideAngular` 內執行 `Plotly.newPlot('chart', data);`，是告訴框架：在初始化邏輯所排程的工作執行之後，不應該執行變更偵測。

例如，若 `Plotly.newPlot('chart', data)` 為某個 DOM 元素加上事件監聽器，Angular 在它們的處理常式執行後不會執行變更偵測。

但有時候，你可能需要監聽第三方 API 派送的事件。在這種情況下，重要的是要記住：如果初始化邏輯是在 Angular Zone 之外完成的，那些事件監聽器也會在 Angular Zone 之外執行：

```ts {header:"檢查處理常式是否在 Zone 之外呼叫" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      // This handler will be called outside of the Angular zone because
      // the initialization logic is also called outside of the zone. To check
      // whether we're in the Angular zone, we can call the following:
      console.log(NgZone.isInAngularZone());
      this.plotlyClick.emit(event);
    });
  }
}
```

若你需要把事件派送給父元件並執行特定的檢視更新邏輯，你應該考慮重新進入 Angular Zone，指示框架執行變更偵測，或手動執行變更偵測：

```ts {header:"派送事件時重新進入 Angular Zone" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      this.ngZone.run(() => {
        this.plotlyClick.emit(event);
      });
    });
  }
}
```

在 Angular Zone 之外派送事件的情境也可能發生。重要的是要記住，觸發變更偵測（例如手動觸發）可能會導致在 Angular Zone 之外建立／更新檢視。
