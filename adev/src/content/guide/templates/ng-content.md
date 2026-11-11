# 以 `ng-content` 從父元件算繪範本

`<ng-content>` 是一個特殊元素，用來接受標記或範本片段，並控制元件如何算繪內容。它不會算繪出真正的 DOM 元素。

以下是一個 `BaseButton` 元件的範例，它可以接受來自父元件的任何標記。

```angular-ts
// ./base-button/base-button.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `
      <ng-content />
  `,
})
export class BaseButton {}
```

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { BaseButton } from './base-button/base-button.component.ts';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `
    <button baseButton>
      Next <span class="icon arrow-right" />
    </button>
  `,
})
export class AppComponent {}
```

如需更多細節，請參閱 [`<ng-content>` 深入指南](/guide/components/content-projection)，了解運用此模式的其他方式。
