# 管道

管道是用來在範本中轉換資料的函式。一般來說，管道是「純粹」函式，不會造成副作用。Angular 有許多好用的內建管道，你可以匯入並在元件中使用。你也可以建立自訂管道。

NOTE: 在[深入指南](/guide/templates/pipes)中進一步了解管道。

在這個練習中，你將匯入一個管道並在範本中使用它。

<hr>

要在範本中使用管道，請把它包含在插值運算式中。看看這個範例：

<docs-code language="angular-ts" highlight="[1,5,6]">
import {UpperCasePipe} from '@angular/common';

@Component({
...
template: `{{ loudMessage | uppercase }}`,
imports: [UpperCasePipe],
})
class AppComponent {
loudMessage = 'we think you are doing great!'
}
</docs-code>

現在，換你來試試看：

<docs-workflow>

<docs-step title="匯入 `LowerCase` 管道">
首先，更新 `app.component.ts`，從 `@angular/common` 加上 `LowerCasePipe` 的檔案層級匯入。

```ts
import { LowerCasePipe } from '@angular/common';
```

</docs-step>

<docs-step title="把管道加到範本的 imports 中">
接著，更新 `@Component()` 裝飾器的 `imports`，加入對 `LowerCasePipe` 的參照

<docs-code language="ts" highlight="[3]">
@Component({
    ...
    imports: [LowerCasePipe]
})
</docs-code>

</docs-step>

<docs-step title="把管道加到範本中">
最後，在 `app.component.ts` 中更新範本，加入 `lowercase` 管道：

```ts
template: `{{username | lowercase }}`
```

</docs-step>

</docs-workflow>

管道也可以接受參數，用來組態它們的輸出。在下一個練習中了解更多。

P.S. 你做得很好 ⭐️
