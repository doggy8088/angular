# 使用 RouterLink 進行導覽

以應用程式目前的狀態，當我們點選應用程式內部的連結時，整個頁面都會重新整理。對小型應用程式來說，這看起來可能無關緊要，但對內容較多的大型頁面來說，這可能帶來效能上的影響，因為使用者得重新下載資源、重新執行計算。

在這個練習中，你將學習如何運用 `RouterLink` 指令，充分發揮 Angular Router 的能力。

<hr>

<docs-workflow>

<docs-step title="匯入 `RouterLink` 指令">

在 `app.component.ts` 中，把 `RouterLink` 指令的匯入加到既有的 `@angular/router` 匯入陳述式中，並把它加到元件裝飾器的 `imports` 陣列裡。

```ts
...
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  ...
})
```

</docs-step>

<docs-step title="在範本中加上 `routerLink`">

要使用 `RouterLink` 指令，請把 `href` 特性換成 `routerLink`。據此更新範本。

```angular-ts
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  ...
  standalone: true,
  template: `
    ...
    <a routerLink="/">Home</a>
    <a routerLink="/user">User</a>
    ...
  `,
  imports: [RouterLink, RouterOutlet],
})
```

</docs-step>

</docs-workflow>

現在點選導覽中的連結時，你應該不會看到任何閃爍，只有頁面本身的內容（也就是 `router-outlet`）被更換 🎉

你把 Angular 路由學得很好。這只是 `Router` API 的表面，想了解更多，請查看 [Angular Router 文件](guide/routing)。
