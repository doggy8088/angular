# 使用 RouterLink 進行導航

在應用程式的目前狀態中，當我們點擊應用程式內存在的內部連結時，整個頁面都會重新整理。雖然在小型應用程式中這似乎無關緊要，但對於內容較多的大型頁面，使用者必須重新下載資源並再次執行計算，這可能會對效能造成影響。

在這個活動中，你將會學習如何利用 `RouterLink` 指令來充分利用 Angular Router。

<hr>

<docs-workflow>

<docs-step title="匯入 `RouterLink` 指令">

在 `app.component.ts` 中將 `RouterLink` 指令匯入新增到現有 `@angular/router` 匯入陳述式，並將其新增到元件裝飾器的 `imports` 陣列中。

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

<docs-step title="在範本中新增 `routerLink`">

若要使用 `RouterLink` 指令，請將 `href` 屬性替換為 `routerLink`。使用此變更更新範本。

```ts
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

當您現在點擊導覽中的連結，您不應該會看到任何閃爍，而只有頁面本身的內容（即 `router-outlet`）被變更 🎉

恭喜你學會使用 Angular 來學習路由。這只是 `Router` API 的皮毛，想了解更多，請查看 [Angular 路由文件](guide/routing)。
