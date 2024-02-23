# 建立自訂管線

您可以在 Angular 中建立自訂管道來符合您的資料轉換需求。

在這個活動中，您將建立一個自訂管道，並在範本中使用它。

<hr>

管道是一個帶有 `@Pipe` 裝飾器的 TypeScript 類別。這是一個範例：

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'star',
})
export class StarPipe implements PipeTransform {
  transform(value: string): string {
    return `⭐️ ${value} ⭐️`;
  }
}
```

StarPipe 接受字串值，並回傳一個在字串周圍加上星號的字串。請注意：

- `@Pipe` 裝飾器設定的名稱將會用在範本中
- `transform` 函式是您放置邏輯的地方

好的，現在輪到你來嘗試了——你將建立 `ReversePipe`：

<docs-workflow>

<docs-step title="建立 `ReversePipe`">

在 `reverse.pipe.ts` 中，將 `@Pipe` 裝飾器新增至 `ReversePipe` 類別，並提供以下設定：

```ts
@Pipe({
    standalone: true,
    name: 'reverse'
})
```

</docs-step>

<docs-step title="實作 `transform` 函式">

現在 `ReversePipe` 類別是一個管道。更新 `transform` 函式以新增反轉邏輯：

<docs-code language="ts" highlight="[3,4,5,6,7,8,9]">
export class ReversePipe implements PipeTransform {
    transform(value: string): string {
        let reverse = '';

        for (let i = value.length - 1; i >= 0; i--) {
            reverse += value[i];
        }

        return reverse;
    }


}
</docs-code>

</docs-step>

<docs-step title="在範本中使用 `ReversePipe`"></docs-step>
在實作管線邏輯之後，最後一個步驟是在範本中使用它。在 `app.component.ts` 中，將管線包含在範本中，並將它新增到元件匯入中：

<docs-code language="ts" highlight="[3,4]">
@Component({
    ...
    template: `Reverse Machine: {{ word | reverse }}`
    imports: [ReversePipe]
})
</docs-code>

</docs-workflow>

就這樣完成了。恭喜你完成這項活動。現在你已經知道如何使用管道，甚至如何實作你自己的自訂管道。
