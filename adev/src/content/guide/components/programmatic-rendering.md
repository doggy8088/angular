# 以程式方式渲染元件

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

除了直接在範本中使用元件之外，你也可以透過程式動態渲染元件。當某個元件一開始未知（因此無法直接在範本中參照），且其使用取決於某些條件時，這非常有幫助。

透過程式渲染元件主要有兩種方式：在範本中使用 `NgComponentOutlet`，或在 TypeScript 程式碼中使用 `ViewContainerRef`。

HELPFUL: 對於延遲載入的使用情境（例如你想延遲載入一個較大的元件），請考慮改用內建的 [`@defer` 功能](/guide/templates/defer)。`@defer` 功能可讓 `@defer` 區塊內的任何元件、指令與管道的程式碼，自動抽出為獨立的 JavaScript 區塊，並僅在必要時依據所設定的觸發條件載入。

## 使用 NgComponentOutlet

`NgComponentOutlet` 是一個結構指令，可在範本中動態渲染指定的元件。

```angular-ts
import {NgComponentOutlet} from '@angular/common';
import {Component, input, computed} from '@angular/core';

@Component({/*...*/})
export class AdminBio {
  /* ... */
}

@Component({/*...*/})
export class StandardBio {
  /* ... */
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <p>Profile for {{ user().name }}</p>
    <ng-container *ngComponentOutlet="bioComponent()" />
  `,
})
export class CustomDialog {
  user = input.required<User>();

  bioComponent = computed(() => {
    return this.user().isAdmin ? AdminBio : StandardBio;
  });
}
```

### 將 inputs 傳給動態渲染的元件

你可以使用 `ngComponentOutletInputs` 屬性，將 inputs 傳給動態渲染的元件。這個屬性接受一個物件，其鍵為 input 名稱，值為 input 的值。

```angular-ts
@Component({
  selector: 'user-greeting',
  template: `
    <div>
      <p>User: {{ username() }}</p>
      <p>Role: {{ role() }}</p>
    </div>
  `,
})
export class UserGreeting {
  username = input.required<string>();
  role = input('guest');
}

@Component({
  selector: 'profile-view',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="greetingComponent; inputs: greetingInputs()" />`,
})
export class ProfileView {
  greetingComponent = UserGreeting;
  greetingInputs = signal({username: 'ngAwesome', role: 'admin'});
}
```

每當 `greetingInputs` 訊號變更時，inputs 就會更新，讓動態元件與父元件的狀態保持同步。

### 提供內容投射

使用 `ngComponentOutletContent` 將投射內容傳給動態渲染的元件。當動態元件使用 `<ng-content>` 顯示內容時，這非常有用。

```angular-ts
@Component({
  selector: 'card-wrapper',
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
})
export class CardWrapper {}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container *ngComponentOutlet="cardComponent; content: cardContent()" />

    <ng-template #contentTemplate>
      <h3>Dynamic Content</h3>
      <p>This content is projected into the card.</p>
    </ng-template>
  `,
})
export class DynamicCard {
  private vcr = inject(ViewContainerRef);
  cardComponent = CardWrapper;

  private contentTemplate = viewChild<TemplateRef<unknown>>('contentTemplate');

  cardContent = computed(() => {
    const template = this.contentTemplate();
    if (!template) return [];
    // Returns an array of projection slots. Each element represents one <ng-content> slot.
    // CardWrapper has one <ng-content>, so we return an array with one element.
    return [this.vcr.createEmbeddedView(template).rootNodes];
  });
}
```

NOTE: 水合（hydration）不支援投射以原生 DOM API 建立的 DOM 節點。這會導致 [NG0503 錯誤](/errors/NG0503)。請使用 Angular API 來建立投射內容，或為元件加上 `ngSkipHydration`。

### 提供 injectors

你可以使用 `ngComponentOutletInjector`，為動態建立的元件提供自訂 injector。這在提供元件專屬的服務或設定時非常有用。

```angular-ts
export const THEME_DATA = new InjectionToken<string>('THEME_DATA', {
  factory: () => 'light',
});

@Component({
  selector: 'themed-panel',
  template: `<div [class]="theme">...</div>`,
})
export class ThemedPanel {
  theme = inject(THEME_DATA);
}

@Component({
  selector: 'dynamic-panel',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="panelComponent; injector: customInjector" />`,
})
export class DynamicPanel {
  panelComponent = ThemedPanel;

  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

### 存取元件實例

你可以使用指令的 `exportAs` 功能，存取動態建立之元件的實例：

```angular-ts
@Component({
  selector: 'counter',
  template: `<p>Count: {{ count() }}</p>`,
})
export class Counter {
  count = signal(0);
  increment() {
    this.count.update((c) => c + 1);
  }
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container [ngComponentOutlet]="counterComponent" #outlet="ngComponentOutlet" />

    <button (click)="outlet.componentInstance?.increment()">Increment</button>
  `,
})
export class CounterHost {
  counterComponent = Counter;
}
```

NOTE: 在元件渲染之前，`componentInstance` 屬性的值為 `null`。

關於該指令功能的更多資訊，請參閱 [NgComponentOutlet API 參考文件](api/common/NgComponentOutlet)。

## 使用 ViewContainerRef

**檢視容器**是 Angular 元件樹中的一個節點，可以容納內容。任何元件或指令都可以注入 `ViewContainerRef`，以取得對應於該元件或指令在 DOM 中位置的檢視容器參照。

你可以使用 `ViewContainerRef` 上的 `createComponent` 方法，動態建立並渲染元件。當你以 `ViewContainerRef` 建立新元件時，Angular 會將它附加到 DOM 中，作為注入該 `ViewContainerRef` 的元件或指令的下一個同層元素。

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `This is the leaf content`,
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
  template: `<button (click)="loadContent()">Load content</button>`,
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

## 在建立時繫結 inputs、outputs 並設定 host 指令

動態建立元件時，手動設定 inputs 並訂閱 outputs 容易出錯。你通常需要撰寫額外的程式碼，才能在元件具現化後接上這些繫結。

為簡化這個流程，`createComponent` 與 `ViewContainerRef.createComponent` 都支援傳入 `bindings` 陣列，搭配 `inputBinding()`、`outputBinding()` 與 `twoWayBinding()` 等輔助函式，預先設定 inputs 與 outputs。你也可以指定 `directives` 陣列來套用任何 host 指令。這讓你能以單一、宣告式的呼叫，透過程式以類似範本的繫結方式建立元件。

### 使用 `ViewContainerRef.createComponent` 的 host 檢視

`ViewContainerRef.createComponent` 會建立一個元件，並自動將其 host 檢視與 host 元素插入容器檢視階層中容器所在的位置。當動態元件應成為容器邏輯與視覺結構的一部分時（例如新增清單項目或行內 UI），請使用這個方式。

相較之下，獨立的 `createComponent` API 不會將新元件附加到任何現有的檢視或 DOM 位置，它會傳回一個 `ComponentRef`，並讓你明確控制元件 host 元素的放置位置。

```angular-ts
import {Component, input, model, output} from '@angular/core';

@Component({
  selector: 'app-warning',
  template: `
    @if (isExpanded()) {
      <section>
        <p>Warning: Action needed!</p>
        <button (click)="close.emit(true)">Close</button>
      </section>
    }
  `,
})
export class AppWarning {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import {
  Component,
  ViewContainerRef,
  signal,
  inputBinding,
  outputBinding,
  twoWayBinding,
  inject,
} from '@angular/core';
import {FocusTrap} from '@angular/cdk/a11y';
import {ThemeDirective} from '../theme.directive';

@Component({
  template: `<ng-container #container />`,
})
export class Host {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarning, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        }),
      ],
      directives: [
        FocusTrap,
        {type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')]},
      ],
    });
  }
}
```

在上面的範例中，動態的 **AppWarning** 在建立時，其 `canClose` input 繫結到一個反應式訊號，`isExpanded` 狀態使用雙向繫結，並為 `close` 加上 output 監聽器。`FocusTrap` 與 `ThemeDirective` 則透過 `directives` 附加到 host 元素上。

### 使用 `createComponent` + `hostElement` 將 Popup 附加到 `document.body`

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
  Service,
} from '@angular/core';
import {Popup} from './popup';

@Service()
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Create a host element for the popup
    const host = document.createElement('popup-host');

    // Create the component and bind in one call
    const ref = createComponent(Popup, {
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

## 處理渲染錯誤 {#handling-rendering-errors}

IMPORTANT: `onError` 選項及其 `ErrorDetails` 參數目前處於[開發者預覽](reference/releases#developer-preview)階段。

使用 `ViewContainerRef.createComponent` 或獨立的 `createComponent` 函式動態建立元件時，你可以在選項物件中提供 `onError` 回呼，以處理在渲染或變更偵測階段發生的錯誤。這相當於在範本中使用 `@error` 區塊的程式化版本。

```ts
viewContainerRef.createComponent(DynamicComponent, {
  onError: (err: Error, details: ErrorDetails) => {
    console.error('Component rendering failed:', err);
    // Render an alternative UI or log metrics
  },
});
```

NOTE: `onError` 回呼只會攔截在渲染或變更偵測階段發生的錯誤。它不會攔截在元件具現化期間發生的錯誤（例如在建構子中）。當你呼叫該 API 時，Angular 會同步擲出建構錯誤。
