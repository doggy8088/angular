# 管線

管道是函式，用於轉換範本中的資料。一般來說，管道是「純」函式，不會造成副作用。Angular 有許多有用的內建管道，您可以匯入並在您的元件中使用。您也可以建立自訂管道。

在本次活動中，您將匯入一個管線並在範本中使用它。

<hr>

若要於範本中使用管線，請將其包含在插補表達式中。請參考以下範例：

<docs-code language="ts" highlight="[1,5,6]">
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

現在，輪到您來嘗試了：

<docs-workflow>

<docs-step title="匯入 `LowerCase` 管道">
首先，透過新增 `@angular/common` 的 `LowerCasePipe` 檔案等級匯入，來更新 `app.component.ts`。

```ts
import { LowerCasePipe } from '@angular/common';
```

</docs-step>

<docs-step title="將管線新增至範本匯入">
接下來，更新 `@Component()` 宣告裝飾器 `imports` 以包含對 `LowerCasePipe` 的參照`

<docs-code language="ts" highlight="[3]">
@Component({
    ...
    imports: [LowerCasePipe]
})
</docs-code>

</docs-step>

<docs-step title="將管道新增到範本">
最後，在 `app.component.ts` 中更新範本，以包含 `lowercase` 管道：

```ts
template: `{{username | lowercase }}`
```

</docs-step>

</docs-workflow>

管道亦可接受參數，這些參數可用於配置其輸出。在下一項活動中了解更多。

P.S. 你做得很棒 ⭐️
