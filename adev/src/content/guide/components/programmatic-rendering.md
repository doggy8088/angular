# 以程式方式渲染元件

Tip: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

除了直接在範本中使用元件之外，你也可以透過程式動態渲染元件。
透過程式渲染元件主要有兩種方式：在範本中使用 `NgComponentOutlet`，或在 TypeScript 程式碼中使用 `ViewContainerRef`。

## 使用 NgComponentOutlet {#using-ngcomponentoutlet}

`NgComponentOutlet` 是一個結構指令，可在範本中動態渲染指定的元件。

```ts
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
  @Input() user: User;

  getBioComponent() {
    return this.user.isAdmin ? AdminBio : StandardBio;
  }
}
```

關於該指令功能的更多資訊，請參閱 [NgComponentOutlet API 參考文件](api/common/NgComponentOutlet)。

## 使用 ViewContainerRef {#using-viewcontainerref}

**檢視容器**是 Angular 元件樹中的一個節點，可以容納內容。任何元件或指令都可以注入 `ViewContainerRef`，以取得對應於該元件或指令在 DOM 中位置的檢視容器參照。

你可以使用 `ViewContainerRef` 上的 `createComponent` 方法，動態建立並渲染元件。當你以 `ViewContainerRef` 建立新元件時，Angular 會將它附加到 DOM 中，作為注入該 `ViewContainerRef` 的元件或指令的下一個同層元素。

```ts
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
  constructor(private viewContainer: ViewContainerRef) {}

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

在上面的範例中，點擊「Load content」按鈕會產生以下的 DOM 結構

```html
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

你可以使用上述的兩種方法，`NgComponentOutlet` 與 `ViewContainerRef`，來渲染以標準 JavaScript [動態 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) 延遲載入的元件。

```ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      <button (click)="loadAdvanced()" *ngIf="!advancedSettings">
        Load advanced settings
      </button>
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>`
})
export class AdminSettings {
  advancedSettings: {new(): AdminSettings} | undefined;

  async loadAdvanced() {
    this.advancedSettings = await import('path/to/advanced_settings.js');
  }
}
```

上面的範例會在收到按鈕點擊時，載入並顯示 `AdvancedSettings`。
