# 建立自訂管道

你可以在 Angular 中建立自訂管道，滿足你的資料轉換需求。

Note: 在[深入指南](/guide/templates/pipes#creating-custom-pipes)中進一步了解如何建立自訂管道。

在這個練習中，你將建立一個自訂管道並在範本中使用它。

<hr>

管道是一個帶有 `@Pipe` 裝飾器的 TypeScript 類別。範例如下：

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'star',
})
export class StarPipe implements PipeTransform {
  transform(value: string): string {
    return `⭐️ ${value} ⭐️`;
  }
}
```

`StarPipe` 接受一個字串值，並回傳在該字串前後加上星星的字串。請注意：

- `@Pipe` 裝飾器組態中的 name，就是在範本中會使用的名稱
- `transform` 函式是你放置邏輯的地方

好了，換你來試試看——你將建立 `ReversePipe`：

<docs-workflow>

<docs-step title="建立 `ReversePipe`">

在 `reverse.pipe.ts` 中，為 `ReversePipe` 類別加上 `@Pipe` 裝飾器，並提供以下組態：

```ts
@Pipe({
    name: 'reverse'
})
```

</docs-step>

<docs-step title="實作 `transform` 函式">

現在 `ReversePipe` 類別是一個管道了。更新 `transform` 函式，加上反轉的邏輯：

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
管道邏輯實作完成後，最後一步是在範本中使用它。在 `app.component.ts` 中，把管道包含進範本，並把它加到元件的 imports 中：

<docs-code language="angular-ts" highlight="[3,4]">
@Component({
    ...
    template: `Reverse Machine: {{ word | reverse }}`
    imports: [ReversePipe]
})
</docs-code>

</docs-workflow>

就這樣，你做到了。恭喜你完成這個練習。你現在知道如何使用管道，甚至如何實作自己的自訂管道了。
