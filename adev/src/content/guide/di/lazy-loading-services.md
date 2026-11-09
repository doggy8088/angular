# 延遲載入服務

IMPORTANT: 若要讓延遲載入運作，你載入的服務必須是自動提供的。請用 `@Injectable({providedIn: 'root'})` 或 [`@Service()`](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator) 裝飾它。若沒有自動提供，Angular 在服務載入後就無法建構它。

Angular 的 `injectAsync` 函式讓你按需載入服務，只在真正需要時才載入。當服務依賴大型函式庫或不常使用的功能、而你不想在初始頁面載入時就付出這個成本時，這非常有用。

當你使用 `injectAsync` 時，服務的程式碼會被你的打包工具拆成獨立的 JavaScript chunk，在你第一次索取實例時下載。載入後，Angular 會透過一般的 DI 系統解析該服務，因此它仍然可以依賴其他可注入項，行為也和任何其他單例一樣。

## 延遲注入服務

想像一個依賴厚重試算表函式庫的 `ReportExporter`。大多數使用者只會開啟報表，只有少數人會點擊 **Export**。按需載入匯出器：

```angular-ts
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

第一次呼叫 `this.exporter()` 會觸發動態匯入，並從 DI 解析該服務。後續呼叫會重複使用同一個 promise，因此 chunk 只會擷取一次。

如果延遲載入的服務是[預設匯出](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export)，可以直接傳入動態匯入，Angular 會幫你解開 `default`：

```ts {header: "report-exporter.ts"}
@Service()
export default class ReportExporter {
  /* … */
}
```

```ts {header: "report.ts"}
private exporter = injectAsync(() => import('./report-exporter'));
```

## 預先擷取依賴 {#prefetching-the-dependency}

依預設，延遲的 chunk 只在你叫用傳回的函式時才會擷取。你可以在選項中傳入 `prefetch` 觸發器，讓下載更早開始。觸發器是任何傳回 `Promise` 的函式，當它解析完成時，Angular 就會啟動載入器。

Angular 內建了 `onIdle` 觸發器，它會等到瀏覽器閒置時才觸發：

```ts
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({/* … */})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter), {
    prefetch: onIdle,
  });
}
```

你也可以為 `onIdle` 設定最長等待時間，讓預先擷取在已知的時間範圍內一定會發生，即使頁面很忙也一樣：

```ts
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

NOTE: 預先擷取是機會性的。如果使用者在預先擷取觸發前就叫用該功能，Angular 仍會立即載入依賴，並在準備好時儘快解析你的 `await`。

## 提供自訂預先擷取觸發器

`PrefetchTrigger` 就只是一個傳回 promise 的函式，promise 一解析完成，載入器就會執行。用它來把預先擷取與你自己的訊號對齊，例如懸停事件或排程器的 tick：

```ts
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () =>
    new Promise<void>((resolve) => {
      target.addEventListener('pointerenter', () => resolve(), {once: true});
    });
}
```
