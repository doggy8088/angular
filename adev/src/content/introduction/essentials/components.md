<docs-decorative-header title="元件" imgSrc="adev/src/assets/images/components.svg"> <!-- markdownlint-disable-line -->
在 Angular 中建立應用程式的基本構件。
</docs-decorative-header>

元件提供結構，可將您的專案整理成易於理解的部分，並具有明確的責任，以便您的程式碼可維護且具可擴充性。

以下是如何將 Todo 應用程式細分為元件樹的範例。

<!-- TODO(josephperrott): enable this mermaid chart -->

```
flowchart TD
    A[TodoApp]-->B
    A-->C
    B[TodoList]-->D
    C[TodoMetrics]
    D[TodoListItem]
```

在這個指南中，我們將了解如何在 Angular 中建立和使用元件。

## 定義元件

每個元件都有以下核心屬性：

1. 一個包含某些組態的 `@Component`[裝飾器](https://www.typescriptlang.org/docs/handbook/decorators.html)
2. 一個控制在 DOM 中呈現內容的 HTML 範本
3. 一個定義元件如何在 HTML 中使用的 [CSS 選擇器](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)
4. 一個 TypeScript 類別，具備管理狀態、處理使用者輸入或從伺服器擷取資料等行為。

以下是一個 TodoListItem 元件的簡化範例。

```ts
// todo-list-item.component.ts
@Component({
  selector: 'todo-list-item',
  template: `
    <li>(TODO) Read Angular Essentials Guide</li>
  `,
})
export class TodoListItem {
  /* Component behavior is defined in here */
}
```

其他您也將在元件中看到的常見元資料包括：

- `standalone: true` — 建議採用此方法來精簡元件的創作體驗
- `styles` — 包含要套用至元件的任何 CSS 樣式的字串或字串陣列

知道了這一點，以下是我們 `TodoListItem` 元件的更新版本。

```ts
// todo-list-item.component.ts
@Component({
  standalone: true,
  selector: 'todo-list-item',
  template: `
    <li>(TODO) Read Angular Essentials Guide</li>
  `,
  styles: `
    li {
      color: red;
      font-weight: 300;
    }
  `,
})
export class TodoListItem {
  /* Component behavior is defined in here */
}
```

### 將 HTML 和 CSS 分離成獨立檔案

對於偏好於在個別檔案中管理其 HTML 和/或 CSS 的團隊，Angular 提供了兩個額外的屬性：`templateUrl` 和 `styleUrl`。

使用先前的 `TodoListItem` 元件，替代方式如下：

```ts
// todo-list-item.component.ts
@Component({
  standalone: true,
  selector: 'todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrl: './todo-list-item.component.css',
})
export class TodoListItem {
  /* Component behavior is defined in here */
}
```

```html
<!-- todo-list-item.component.html -->
<li>(TODO) Read Angular Essentials Guide</li>
```

```css
// todo-list-item.component.css
li {
  color: red;
  font-weight: 300;
}
```

## 使用元件

html
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
    <button @click="changeTitle">Change title</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello World',
      content: 'This is a component.'
    }
  },
  methods: {
    changeTitle() {
      this.title = 'New Title'
    }
  }
}
</script>

<style>
h1 {
  color: red;
}
</style>

元件架構的一個優勢是您的應用程式是模組化的。換句話說，元件可以在其他元件中使用。

要使用元件，您需要：

1. 將元件匯入檔案中
2. 將其加入元件的 `imports` 陣列中
3. 在 `template` 中使用元件的選取器

以下是一個 `TodoList` 元件導入先前 `TodoListItem` 元件的範例：

```ts
// todo-list.component.ts
import {TodoListItem} from './todo-list-item.component.ts';

@Component({
  standalone: true,
  imports: [TodoListItem],
  template: `
    <ul>
      <todo-list-item></todo-list-item>
    </ul>
  `,
})
export class TodoList {}
```

## 下一步

現在您已知道 Angular 中的元件如何運作，是時候來學習如何在應用程式中新增和管理動態資料。

<docs-pill-row>
  <docs-pill title="管理動態資料" href="essentials/managing-dynamic-data" />
</docs-pill-row>
