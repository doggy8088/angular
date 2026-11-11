# 搭配指令使用訊號

既然你已學會[搭配服務使用訊號](/tutorials/signals/7-using-signals-with-services)，接著來探索指令如何使用訊號。**好消息是：訊號在指令中的運作方式與在元件中完全相同**！主要差異在於，指令沒有範本，所以你主要會在 host 繫結中使用訊號，以反應式方式更新宿主元素。

在本活動中，你將建置一個 highlight 指令，示範訊號如何為指令帶來反應式行為。

<hr />

<docs-workflow>

<docs-step title="比照元件的方式設定訊號">
匯入訊號函式並建立你的反應式狀態。這與元件中的做法完全相同：

```ts
import {Directive, input, signal, computed} from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  // Signal inputs - same as components!
  color = input<string>('yellow');
  intensity = input<number>(0.3);

  // Internal state - same as components!
  private isHovered = signal(false);

  // Computed signals - same as components!
  backgroundStyle = computed(() => {
    const baseColor = this.color();
    const alpha = this.isHovered() ? this.intensity() : this.intensity() * 0.5;

    const colorMap: Record<string, string> = {
      'yellow': `rgba(255, 255, 0, ${alpha})`,
      'blue': `rgba(0, 100, 255, ${alpha})`,
      'green': `rgba(0, 200, 0, ${alpha})`,
      'red': `rgba(255, 0, 0, ${alpha})`,
    };

    return colorMap[baseColor] || colorMap['yellow'];
  });
}
```

注意，這與元件的模式完全相同，唯一的差異是我們身處 `@Directive` 中，而不是 `@Component` 中。
</docs-step>

<docs-step title="在 host 繫結中使用訊號">
由於指令沒有範本，你會在 **host 繫結** 中使用訊號，以反應式方式更新宿主元素。加入 `host` 設定與事件處理常式：

```ts
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'backgroundStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // ... signals from previous step ...

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
```

當訊號改變時，host 繫結會自動重新求值，就像元件中的範本繫結一樣！當 `isHovered` 改變時，`backgroundStyle` 計算訊號會重新計算，host 繫結便會更新元素的樣式。
</docs-step>

<docs-step title="在範本中使用該指令">
更新應用程式範本，示範這個反應式指令：

```angular-ts
template: `
  <div>
    <h1>Directive with Signals</h1>

    <div highlight color="yellow" [intensity]="0.2">
      Hover me - Yellow highlight
    </div>

    <div highlight color="blue" [intensity]="0.4">
      Hover me - Blue highlight
    </div>

    <div highlight color="green" [intensity]="0.6">
      Hover me - Green highlight
    </div>
  </div>
`,
```

該指令會依據訊號輸入，自動套用反應式 highlight 效果！
</docs-step>

</docs-workflow>

太完美了！你已了解訊號如何與指令搭配運作。本課的幾個重點如下：

- **訊號是通用的**：所有訊號 API（`input()`、`signal()`、`computed()`、`effect()`）在指令與元件中的運作方式都相同
- **host 繫結是主要的使用情境**：由於指令沒有範本，你會在 host 繫結中使用訊號，以反應式方式修改宿主元素
- **相同的反應式模式**：訊號更新會觸發計算訊號與 host 繫結的自動重新求值，就像在元件範本中一樣

在下一課中，你將[了解如何使用訊號查詢子元素](/tutorials/signals/9-query-child-elements-with-signal-queries)！
