# 以程式方式渲染元件

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

除了直接在範本中使用元件之外，你也可以透過程式動態渲染元件。當某個元件一開始未知（因此無法直接在範本中參照），且其使用取決於某些條件時，這非常有幫助。

透過程式渲染元件主要有兩種方式：在範本中使用 `NgComponentOutlet`，或在 TypeScript 程式碼中使用 `ViewContainerRef`。

HELPFUL: 對於延遲載入的使用情境（例如你想延遲載入一個較大的元件），請考慮改用內建的 [`@defer` 功能](/guide/templates/defer)。`@defer` 功能可讓 `@defer` 區塊內的任何元件、指令與管道的程式碼，自動抽出為獨立的 JavaScript 區塊，並僅在必要時依據所設定的觸發條件載入。

## 使用 NgComponentOutlet {#using-ngcomponentoutlet}

`NgComponentOutlet` 是一個結構指令，可在範本中動態渲染指定的元件。

```angular-ts
@Component({ ... })
export class AdminBio { /* ... */ }

@Component({ ... })
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Profile for {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}
```

## 使用 ViewContainerRef {#using-viewcontainerref}

**檢視容器**是 Angular 元件樹中的一個節點，可以容納內容。任何元件或指令都可以注入 `ViewContainerRef`，以取得對應於該元件或指令在 DOM 中位置的檢視容器參照。

你可以使用 `ViewContainerRef` 上的 `createComponent` 方法，動態建立並渲染元件。當你以 `ViewContainerRef` 建立新元件時，Angular 會將它附加到 DOM 中，作為注入該 `ViewContainerRef` 的元件或指令的下一個同層元素。

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `
    This is the leaf content
  `,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>This is the start of the outer container</p>
    <inner-item />
    <p>This is the end of the outer container</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `
    <button (click)="loadContent()">Load content</button>
  `,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

在上面的範例中，點擊「Load content」按鈕會產生以下的 DOM 結構

```angular-html
<outer-container>
  <p>This is the start of the outer container</p>
  <inner-item>
    <button>Load content</button>
  </inner-item>
  <leaf-content>This is the leaf content</leaf-content>
  <p>This is the end of the outer container</p>
</outer-container>
```

## 延遲載入元件

HELPFUL: 如果你想延遲載入某些元件，可以考慮改用內建的 [`@defer` 功能](/guide/templates/defer)。

如果你的使用情境不在 `@defer` 功能的涵蓋範圍內，你可以使用 `NgComponentOutlet` 或 `ViewContainerRef`，搭配標準的 JavaScript [動態 import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import)。

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Load advanced settings
        </button>
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: {new(): AdvancedSettings} | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}
```

上面的範例會在收到按鈕點擊時，載入並顯示 `AdvancedSettings`。

## 在建立時繫結 inputs、outputs 並設定 host 指令 {#binding-inputs-outputs-and-setting-host-directives-at-creation}

動態建立元件時，手動設定 inputs 並訂閱 outputs 容易出錯。你通常需要撰寫額外的程式碼，才能在元件具現化後接上這些繫結。

為簡化這個流程，`createComponent` 與 `ViewContainerRef.createComponent` 都支援傳入 `bindings` 陣列，搭配 `inputBinding()`、`outputBinding()` 與 `twoWayBinding()` 等輔助函式，預先設定 inputs 與 outputs。你也可以指定 `directives` 陣列來套用任何 host 指令。這讓你能以單一、宣告式的呼叫，透過程式以類似範本的繫結方式建立元件。

### 使用 `ViewContainerRef.createComponent` 的 host 檢視 {#host-view-using-viewcontainerrefcreatecomponent}

`ViewContainerRef.createComponent` 會建立一個元件，並自動將其 host 檢視與 host 元素插入容器檢視階層中容器所在的位置。當動態元件應成為容器邏輯與視覺結構的一部分時（例如新增清單項目或行內 UI），請使用這個方式。

相較之下，獨立的 `createComponent` API 不會將新元件附加到任何現有的檢視或 DOM 位置，它會傳回一個 `ComponentRef`，並讓你明確控制元件 host 元素的放置位置。

```angular-ts
import { Component, input, model, output } from "@angular/core";

@Component({
  selector: 'app-warning',
  template: `
      @if(isExpanded()) {
        <section>
            <p>Warning: Action needed!</p>
            <button (click)="close.emit(true)">Close</button>
        </section>
      }
  `
})
export class AppWarningComponent {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import { Component, ViewContainerRef, signal, inputBinding, outputBinding, twoWayBinding, inject } from '@angular/core';
import { FocusTrap } from "@angular/cdk/a11y";
import { ThemeDirective } from '../theme.directive';

@Component({
  template: `<ng-container #container />`
})
export class HostComponent {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarningComponent, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        })
      ],
      directives: [
        FocusTrap,
        { type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')] }
      ]
    });
  }
}
```

在上面的範例中，動態的 **AppWarningComponent** 在建立時，其 `canClose` input 繫結到一個反應式訊號，`isExpanded` 狀態使用雙向繫結，並為 `close` 加上 output 監聽器。`FocusTrap` 與 `ThemeDirective` 則透過 `directives` 附加到 host 元素上。

### 使用 `createComponent` + `hostElement` 將 Popup 附加到 `document.body` {#popup-attached-to-documentbody-with-createcomponent--hostelement}

當需要在目前檢視階層之外渲染時（例如覆蓋層），請使用這個方式。所提供的 `hostElement` 會成為元件在 DOM 中的 host，因此 Angular 不會建立符合選擇器的新元素。你可以直接設定 **bindings**。

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
} from '@angular/core';
import { PopupComponent } from './popup.component';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Create a host element for the popup
    const host = document.createElement('popup-host');

    // Create the component and bind in one call
    const ref = createComponent(PopupComponent, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }),
      ],
    });

    // Registers the component’s view so it participates in change detection cycle.
    this.appRef.attachView(ref.hostView);
    // Inserts the provided host element into the DOM (outside the normal Angular view hierarchy).
    // This is what makes the popup visible on screen, typically used for overlays or modals.
    document.body.appendChild(host);
  }
}
```
