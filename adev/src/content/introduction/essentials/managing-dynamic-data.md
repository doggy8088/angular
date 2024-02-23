<docs-decorative-header title="管理動態資料" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
定義元件狀態和行為以管理動態資料。
</docs-decorative-header>

現在我們已經了解元件的基本結構，讓我們來學習如何定義元件的資料（即狀態）和行為。

## 什麼是狀態？

Components 讓您可以將應用程序中離散部分的責任整齊地封裝起來。例如，`SignUpForm` 元件可能需要追蹤表單是否有效，然後才允許使用者執行特定動作。因此，元件需要追蹤的各種屬性通常稱為「狀態」。

## 定義狀態

如要定義狀態，請在元件內使用 [類別欄位語法](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes/Public_class_fields)。

例如，使用 `TodoListItem` 元件，建立兩個您想要追蹤的屬性：

1. `taskTitle` — 任務的標題是什麼
2. `isComplete` — 任務是否完成

```ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;
}
```

## 更新狀態

當您想要更新狀態時，通常透過定義元件類別中的方法來完成，該方法可以使用 `this` 關鍵字存取各種類別欄位。

```ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;

  completeTask() {
    this.isComplete = true;
  }

  updateTitle(newTitle: string) {
    this.taskTitle = newTitle;
  }
}
```

## 下一步

現在您已學會如何宣告和管理動態資料，是時候學習如何在範本中使用該資料了。

<docs-pill-row>
  <docs-pill title="呈現動態範本" href="essentials/rendering-dynamic-templates" />
</docs-pill-row>
