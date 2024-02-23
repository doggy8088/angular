# 使用程式碼呈現元件

提示：本指南假設您已經閱讀過 [精華指南](essentials)。如果您是 Angular 新手，請先閱讀該指南。

除了在範本中直接使用元件外，您也可以動態呈現元件。
有兩種主要方法可以動態呈現元件：在範本中使用 `NgComponentOutlet`，或在您的 TypeScript 程式碼中使用 `ViewContainerRef`。

## 使用 NgComponentOutlet

NgComponentOutlet 是一個結構性指令，會在範本中動態呈現一個給定的元件。

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

請參閱 [NgComponentOutlet API 參考](api/common/NgComponentOutlet)以了解有關此指令功能的更多資訊。

## 使用 ViewContainerRef

A **檢視容器** 是 Angular 元件樹中的一個節點，可以包含內容。任何元件或指令都可以注入 `ViewContainerRef` 以取得對應於該元件或指令在 DOM 中位置的檢視容器的參考。

您可以在 `ViewContainerRef` 上使用 `createComponent` 方法動態建立和呈現元件。當您使用 `ViewContainerRef` 建立新元件時，Angular 會將它附加到 DOM 中，作為注入 `ViewContainerRef` 的元件或指令的下一同儕元件。

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

在上面的範例中，點擊「載入內容」按鈕會產生以下的 DOM 結構

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

## 延遲加載元件

你可以使用上述兩種方法，`NgComponentOutlet` 和 `ViewContainerRef`，來
呈現使用標準 JavaScript [動態導入](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/import) 的延遲載入元件。

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

上面的範例在接收到按鈕點擊後，載入並顯示 `AdvancedSettings`。
