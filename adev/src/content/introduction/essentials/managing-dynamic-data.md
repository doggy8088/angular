<docs-decorative-header title="管理動態資料" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
定義元件的狀態與行為，以管理動態資料。
</docs-decorative-header>

現在我們已經學過元件的基本結構，接著來學習如何定義元件的資料（也就是狀態）與行為。

## 什麼是狀態？ {#what-is-state}

元件讓你能把應用程式中各個獨立部分的職責整齊地封裝起來。例如，`SignUpForm` 元件可能需要在允許使用者執行特定動作之前，追蹤表單是否有效。因此，元件需要追蹤的各種屬性，通常就稱為「狀態」。

## 定義狀態 {#defining-state}

若要定義狀態，你可以在元件內部使用[類別欄位語法](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Classes/Public_class_fields)。

例如，使用 `TodoListItem` 元件，建立兩個你想要追蹤的屬性：

1. `taskTitle`：任務的標題是什麼
2. `isComplete`：任務是否完成

```angular-ts
// todo-list-item.component.ts
@Component({ ... })
export class TodoListItem {
  taskTitle = '';
  isComplete = false;
}
```

## 更新狀態 {#updating-state}

當你想要更新狀態時，通常的做法是在元件類別中定義方法，透過 `this` 關鍵字存取各個類別欄位。

```angular-ts
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

## 下一步 {#next-step}

現在你已經學會如何宣告與管理動態資料，接著來學習如何在範本中使用這些資料。

<docs-pill-row>
  <docs-pill title="算繪動態範本" href="essentials/rendering-dynamic-templates" />
</docs-pill-row>
