# 路由轉場動畫

當使用者從一條路由導覽到另一條路由時，Angular 路由器會把 URL 路徑對應到相關的元件並顯示其檢視。為這個路由轉場加上動畫，可以大幅提升使用者體驗。在 Chrome/Chromium 瀏覽器中於路由間導覽時，路由器支援 View Transitions API。

HELPFUL: 路由器原生的 View Transitions 整合目前處於[開發者預覽](/reference/releases#developer-preview)階段。原生 View Transitions 也是相對較新的功能，因此某些瀏覽器的支援可能有限。

## 檢視轉場的運作方式 {#how-view-transitions-work}

瀏覽器用來進行檢視轉場的原生方法是 `document.startViewTransition`。呼叫 `startViewTransition()` 時，瀏覽器會擷取頁面目前的狀態，包括拍攝一張截圖。這個方法接受一個會更新 DOM 的回呼，而且這個函式可以是非同步的。當回呼回傳的 Promise 完成後，瀏覽器便會在下一個動畫影格擷取新狀態並開始轉場。

以下是一個 startViewTransition API 的範例：

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

如果你想進一步了解這個瀏覽器 API 的細節，[Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions)是非常寶貴的資源。

## 路由器如何使用檢視轉場 {#how-the-router-uses-view-transitions}

路由器開始導覽後會發生幾件事：路由比對、載入延遲載入的路由與元件、執行守衛與解析器等等。這些都成功完成後，新路由就準備好被啟用了。這個路由啟用，正是我們想作為檢視轉場一部分來執行的 DOM 更新。

啟用檢視轉場功能後，導覽會「暫停」，並呼叫瀏覽器的 `startViewTransition` 方法。當 `startViewTransition` 回呼執行後（依照規格所述，這是非同步發生的），導覽便「恢復」。路由器導覽的其餘步驟包括更新瀏覽器 URL，以及啟用或停用比對到的路由（即 DOM 更新）。

最後，傳給 `startViewTransition` 的回呼會回傳一個 Promise，在 Angular 完成算繪後完成。如上所述，這會向瀏覽器表明應該擷取新的 DOM 狀態並開始轉場。

檢視轉場是一種[漸進增強](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)。如果瀏覽器不支援這個 API，路由器會在不呼叫 `startViewTransition` 的情況下執行 DOM 更新，導覽也不會加上動畫。

## 在路由器中啟用檢視轉場 {#enabling-view-transitions-in-the-router}

若要啟用這個功能，只需把 `withViewTransitions` 加入 `provideRouter`，或在 `RouterModule.forRoot` 中設定 `enableViewTransitions: true`：

```ts
// Standalone bootstrap
bootstrapApplication(MyApp, {providers: [
  provideRouter(ROUTES, withViewTransitions()),
]});

// NgModule bootstrap
@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})]
})
export class AppRouting {}
```

[在 StackBlitz 上試用「count」範例](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

這個範例使用 Chrome 說明文件中的計數器應用程式，並把計數器遞增時直接呼叫 startViewTransition 的做法，改為改用路由器導覽。

## 使用 CSS 自訂轉場 {#using-css-to-customize-transitions}

檢視轉場可以用 CSS 自訂。我們也可以設定 view-transition-name，指示瀏覽器為轉場建立獨立的元素。我們可以擴充第一個範例，在 Counter 元件的 .count 樣式中加入 view-transition-name: count。接著，在全域樣式中，我們可以為這個檢視轉場定義自訂動畫：

```css
/* Custom transition */
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
::view-transition-old(count),
::view-transition-new(count) {
 animation-duration: 200ms;
 animation-name: -ua-view-transition-fade-in, rotate-in;
}
::view-transition-old(count) {
 animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

重要的是，檢視轉場動畫必須定義在全域樣式檔中。它們不能定義在元件樣式中，因為預設的檢視封裝會把樣式的範圍限定在該元件內。

[在 StackBlitz 上試用更新後的「count」範例](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## 以 onViewTransitionCreated 控制轉場 {#controlling-transitions-with-onviewtransitioncreated}

`withViewTransitions` 路由器功能也可以帶著一個選項物件呼叫，其中包含 `onViewTransitionCreated` 回呼。這個回呼會在[注入情境](/guide/di/dependency-injection-context#run-within-an-injection-context)中執行，並接收一個 [ViewTransitionInfo](/api/router/ViewTransitionInfo) 物件，其中包括從 `startViewTransition` 回傳的 `ViewTransition`，以及導覽轉場前的 `ActivatedRouteSnapshot` 與要轉場前往的新 `ActivatedRouteSnapshot`。

這個回呼可以用於各式各樣的自訂。例如，你可能想在某些條件下略過轉場。我們在新的 angular.dev 文件站上就是這樣用的：

```ts
withViewTransitions({
 onViewTransitionCreated: ({transition}) => {
   const router = inject(Router);
   const targetUrl = router.getCurrentNavigation()!.finalUrl!;
   // Skip the transition if the only thing
   // changing is the fragment and queryParams
   const config = {
     paths: 'exact',
     matrixParams: 'exact',
     fragment: 'ignored',
     queryParams: 'ignored',
   };

   if (router.isActive(targetUrl, config)) {
     transition.skipTransition();
   }
 },
}),
```

在這段程式碼片段中，我們從導覽即將前往的 `ActivatedRouteSnapshot` 建立一個 `UrlTree`。接著，我們向路由器檢查這個 `UrlTree` 是否已經處於啟用狀態，並忽略片段與查詢參數上的任何差異。如果它已經啟用，我們就呼叫 skipTransition，略過檢視轉場中的動畫部分。點擊只會捲動到同一份文件中另一個位置的錨點連結時，就是這種情況。

## 改編自 Chrome 說明文件的 Angular 範例 {#examples-from-the-chrome-explainer-adapted-to-angular}

我們將 Chrome 團隊的一些優秀範例以 Angular 重新實作，方便你探索。

### 轉場元素不必是同一個 DOM 元素 {#transitioning-elements-dont-need-to-be-the-same-dom-element}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
* [StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### 自訂進入與離開動畫 {#custom-entry-and-exit-animations}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
* [StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### 非同步 DOM 更新與等待內容 {#async-dom-updates-and-waiting-for-content}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

> 在這段期間，頁面會被凍結，因此這裡的延遲應保持在最低限度……在某些情況下，最好完全避免延遲，直接使用你已經有的內容。

Angular 路由器的檢視轉場功能不提供延遲動畫的方法。目前，我們的立場是：使用你已經有的內容，永遠比讓頁面多出任何額外的無法互動時間來得好。

### 以檢視轉場類型處理多種檢視轉場樣式 {#handle-multiple-view-transition-styles-with-view-transition-types}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
* [StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### 以檢視轉場根元素上的 class 名稱處理多種檢視轉場樣式（已棄用）{#handle-multiple-view-transition-styles-with-a-class-name-on-the-view-transition-root-deprecated}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
* [StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### 轉場時不凍結其他動畫 {#transitioning-without-freezing-other-animations}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
* [StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### 以 JavaScript 製作動畫 {#animating-with-javascript}

* [Chrome 說明文件](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
* [StackBlitz 上的 Angular 範例](https://stackblitz.com/edit/stackblitz-starters-cklnkm)

## 原生檢視轉場的替代方案 {#native-view-transitions-alternative}

路由之間的轉場動畫也可以用 `@angular/animations` 套件來完成。動畫的[觸發器與轉場](/guide/animations/transition-and-triggers)可以從路由器狀態推導而來，例如目前的 URL 或 `ActivatedRoute`。
