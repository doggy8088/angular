# 路由轉場動畫

路由轉場動畫能在使用者於 Angular 應用程式的不同畫面間導覽時，提供流暢的視覺轉換效果，藉此提升使用者體驗。[Angular Router](/guide/routing) 內建支援瀏覽器的 View Transitions API，能在支援的瀏覽器中，為路由切換帶來無縫的動畫效果。

## View Transitions 的運作方式

View Transitions 會使用瀏覽器原生的 [`document.startViewTransition` API](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)，為應用程式在不同狀態之間建立流暢的動畫。這個 API 的運作步驟如下：

1. **捕獲目前狀態**：瀏覽器會擷取目前頁面的螢幕快照
2. **執行 DOM 更新**：執行你的回呼函式來更新 DOM
3. **捕獲新狀態**：瀏覽器會擷取更新後的頁面狀態
4. **播放轉場動畫**：瀏覽器會在新舊兩個狀態之間播放動畫

以下是 `startViewTransition` API 的基本結構：

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

欲了解瀏覽器 API 的更多細節，請參閱 [Chrome 官方說明](https://developer.chrome.com/docs/web-platform/view-transitions)。

## Router 如何使用 View Transitions

Angular Router 已經將 View Transitions 整合到導覽的生命週期中，以實現無縫的路由切換。在導覽過程中，Router 會執行以下步驟：

1. **完成導覽的事前準備**：執行路由比對、[延遲載入](guide/routing/loading-strategies#lazily-loaded-components-and-routes)、[路由守衛](/guide/routing/route-guards)、[資源](/guide/routing/data-fetching-with-resources)與[解析器](/guide/routing/data-resolvers)
2. **啟動 View Transition**：當路由準備好要被啟用時，Router 會呼叫 `startViewTransition`
3. **更新 DOM**：Router 會在轉換回呼函式中，啟用新的路由並停用舊的路由
4. **完成轉場作業**：當 Angular 完成畫面算繪時，轉場作業的 Promise 就會完成

Router 對於 View Transitions 的整合，本身是一種[漸進增強](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)的做法。當瀏覽器不支援 View Transitions API 時，Router 就會執行不含動畫效果的一般 DOM 更新，確保你的應用程式能在所有瀏覽器上正常運作。

## 在 Router 中啟用 View Transitions

只要在你的[路由設定](/guide/routing/define-routes#adding-the-router-to-your-application)中，加入 `withViewTransitions` 功能，即可啟用 View Transitions。Angular 同時支援獨立元件與 NgModule 這兩種啟動方式：

### 以獨立元件方式啟動

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withViewTransitions} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(MyApp, {
  providers: [provideRouter(routes, withViewTransitions())],
});
```

### 以 NgModule 方式啟動

```ts
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})],
})
export class AppRouting {}
```

[在 StackBlitz 上試用「count」範例](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

這個範例示範了如何使用路由導覽，來取代直接呼叫 `startViewTransition` 處理計數器更新的作法。

## 使用 CSS 自訂轉場效果

你可以使用 CSS 來自訂 View Transitions，藉此創造獨一無二的動畫效果。瀏覽器會建立專門的轉場元素，讓你可以使用 CSS 選擇器來指定這些元素的樣式。

建立自訂轉場效果的步驟如下：

1. **加上 view-transition-name**：為你想要加入動畫的元素，指定一個專屬的名稱
2. **定義全域動畫**：在全域樣式檔案中，建立 CSS 動畫
3. **指定轉場虛擬元素**：使用 `::view-transition-old()` 與 `::view-transition-new()` 選擇器

以下範例會為計數器元素加上旋轉效果：

```css
/* Define keyframe animations */
@keyframes rotate-out {
  to {
    transform: rotate(90deg);
  }
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg);
  }
}

/* Target view transition pseudo-elements */
::view-transition-old(count),
::view-transition-new(count) {
  animation-duration: 200ms;
  animation-name: -ua-view-transition-fade-in, rotate-in;
}

::view-transition-old(count) {
  animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

IMPORTANT: 請務必將 View Transition 動畫定義在你的全域樣式檔案裡，而不是寫在元件樣式中。Angular 的[檢視封裝](/guide/components/styling#style-scoping)機制會限制元件樣式的套用範圍，導致這些樣式無法正確指定到轉場虛擬元素上。

[在 StackBlitz 上試用更新版的「count」範例](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## 透過 onViewTransitionCreated 進行進階轉場控制

`withViewTransitions` 功能可以接受一個選項物件，裡頭帶有 `onViewTransitionCreated` 回呼，以對 View Transitions 進行更進階的控制。這個回呼函式具有以下特性：

- 會在[注入上下文](/guide/di/dependency-injection-context#run-within-an-injection-context)中執行
- 會接收到一個 [`ViewTransitionInfo`](/api/router/ViewTransitionInfo) 物件，其中包含：
  - 從 `startViewTransition` 所建立的 `ViewTransition` 實例
  - 導覽來源路由的 [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot)
  - 導覽目標路由的 [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot)

你可以運用這個回呼函式，依據導覽上下文來客製化轉場行為。例如，你可以針對特定類型的導覽略過轉場效果：

```ts
import {inject} from '@angular/core';
import {Router, withViewTransitions, isActive, IsActiveMatchOptions} from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.currentNavigation()!.finalUrl!;

    // Skip transition if only fragment or query params change
    const config: Partial<IsActiveMatchOptions> = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    const isTargetRouteCurrent = isActive(targetUrl, router, config);

    if (isTargetRouteCurrent()) {
      transition.skipTransition();
    }
  },
});
```

這個範例會在導覽僅僅更動到 [URL 的錨點片段或查詢參數](/guide/routing/read-route-state#query-parameters)（例如同一個頁面中的錨點連結）時，略過 View Transition。`skipTransition()` 方法會避免播放動畫效果，同時仍會確保導覽能夠順利完成。

## 尊重使用者的動態偏好設定

無論使用者的 [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) 設定值為何，Router 都會照常執行 View Transitions。偏好減少動態效果，並不一定代表使用者希望完全沒有任何動作，因此框架會將選擇權交給應用程式自行決定：你可以為這類使用者[提供較為低調、細膩的動畫](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#react_to_the_reduced_motion_preference)，或是利用 `onViewTransitionCreated` 回呼，完全略過版面轉場效果：

```ts
withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.skipTransition();
    }
  },
});
```

## 改編自 Chrome 官方說明的 Angular 範例

以下範例展示了各種 View Transition 的技巧，這些範例均改編自 Chrome 團隊的說明文件，並針對 Angular Router 的使用方式進行調整：

### 進行轉場的元素不一定要是同一個 DOM 元素

只要 DOM 元素共用相同的 `view-transition-name`，就能在不同的 DOM 元素之間流暢地進行轉場。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [在 StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### 自訂進場與離場動畫

你可以為路由轉場過程中，進入或離開可視區域的元素，建立專屬的進場與離場動畫效果。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [在 StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### 非同步 DOM 更新與等待內容載入

Angular Router 會優先執行即時的版面轉場，而不會為了等待額外的內容載入完成而停下等候。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTE: Angular Router 並不提供用來延遲 View Transition 的方法。這項設計抉擇的目的，是為了避免在等待額外內容時，整個頁面變得無法互動。正如 Chrome 官方文件所提及的：「在此期間，頁面會完全凍結，因此這段延遲時間應盡可能縮短……在某些情況下，寧可直接跳過延遲，直接使用現有的內容。」

### 使用 View Transition 類型來切換多種轉場樣式

你可以根據導覽的上下文，運用 View Transition 類型來套用不同的動畫風格。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [在 StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### 在 View Transition 根元素上套用類別名稱來切換多種轉場樣式（已棄用）

這種作法會使用轉場根元素上的 CSS 類別名稱，來控制整體的動畫樣式。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [在 StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### 進行轉場的同時不凍結其他動畫

你可以在執行 View Transition 的過程中，讓頁面上的其他動畫持續播放，打造更豐富的使用者互動體驗。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [在 StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### 使用 JavaScript 操控動畫

針對複雜的動畫情境，你可以使用 JavaScript API，以程式化的方式控制 View Transition 的播放過程。

- [Chrome 官方說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [在 StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
