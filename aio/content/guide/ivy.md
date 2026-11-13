# Angular Ivy

Ivy 是 Angular [次世代編譯與渲染管線](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7)的代號。
隨著 Angular 第 9 版的發佈，新的編譯器與執行時期指令預設會被使用，取代稱為 View Engine 的舊編譯器與執行時期。

<div class="alert is-helpful">

在我們團隊的這些影片中，進一步了解 [Compiler](https://www.youtube.com/watch?v=anphffaCZrQ) 與 [Runtime](https://www.youtube.com/watch?v=S0o-4yc2n-8)。

</div>

{@a aot-and-ivy}

## AOT 與 Ivy

使用 Ivy 的 AOT 編譯速度更快，應預設使用。
在 `angular.json` 工作區設定檔中，把專案的預設建置選項設為永遠使用 AOT 編譯。
在 Ivy 中使用應用程式國際化（i18n）時，[翻譯合併](guide/i18n#merge)也需要使用 AOT 編譯。

<code-example language="json" header="angular.json">

{
  "projects": {
    "my-existing-project": {
      "architect": {
        "build": {
          "options": {
            ...
            "aot": true,
          }
        }
      }
    }
  }
}
</code-example>

## Ivy 與程式庫

Ivy 應用程式可以使用以 View Engine 編譯器建立的程式庫來建置。
這種相容性是由一個稱為 Angular 相容性編譯器（`ngcc`）的工具提供的。
CLI 命令在執行 Angular 建置時，會視需要執行 `ngcc`。

如需了解如何發行程式庫的更多資訊，請參閱[發行你的程式庫](guide/creating-libraries#發行你的程式庫)。

{@a maintaining-library-compatibility}

### 維持程式庫相容性

如果你是程式庫作者，自第 9 版起，你應該繼續使用 View Engine 編譯器。
讓所有程式庫繼續使用 View Engine，你就能維持與使用 Ivy 的預設 v9 應用程式的相容性，也能與選擇繼續使用 View Engine 的應用程式相容。

如需了解如何編譯或打包 Angular 程式庫的更多資訊，請參閱[建立程式庫](guide/creating-libraries)指南。
當你使用整合在 Angular CLI 或 `ng-packagr` 中的工具時，你的程式庫永遠會自動以正確的方式建置。

{@a ivy-and-universal-app-shell}

## Ivy 與 Universal/App shell

在第 9 版中，用於 [App shell](guide/app-shell) 與 [Angular Universal](guide/universal) 的伺服器建置器，預設啟用 `bundleDependencies` 選項。
如果你選擇不打包相依性，你將需要執行獨立的 Angular 相容性編譯器（`ngcc`）。這是必要的，因為否則 Node 將無法正確解析套件的 Ivy 版本。

你可以透過加入 `postinstall` [npm script](https://docs.npmjs.com/misc/scripts)，在每次安裝 node_modules 後執行 `ngcc`：

<code-example language="json" header="package.json">
{
  "scripts": {
    "postinstall": "ngcc"
  }
}
</code-example>

<div class="alert is-important">

*   `postinstall` script 會在每次安裝 `node_modules` 時執行，包括由 `ng update` 與 `ng add` 所執行的安裝。
*   不要使用 `--create-ivy-entry-points`，因為這會導致 Node 無法正確解析套件的 Ivy 版本。

</div>

{@a opting-out-of-angular-ivy}

## 在第 9 版中退出 Ivy

在第 9 版中，Ivy 是預設的編譯方式。
為了在更新過程中與目前的工作流程相容，你可以選擇退出 Ivy，繼續使用先前的編譯器 View Engine。

<div class="alert is-helpful">

停用 Ivy 之前，請先查看 [Ivy 相容性指南](guide/ivy-compatibility#debugging)中的除錯建議。

</div>

若要退出 Ivy，請變更專案 TypeScript 設定中的 `angularCompilerOptions`，該設定最常位於工作區根目錄的 `tsconfig.app.json`。

自第 9 版起，`enableIvy` 旗標的值預設為 `true`。

以下範例說明如何把 `enableIvy` 選項設為 `false`，以退出 Ivy。

<code-example language="json" header="tsconfig.app.json">
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ],
  "angularCompilerOptions": {
    "enableIvy": false
  }
}
</code-example>

<div class="alert is-important">

如果你停用 Ivy，你可能也想重新考慮是否要把 AOT 編譯設為應用程式開發的預設，如[前文](#aot-and-ivy)所述。

若要還原編譯器預設值，請在 `angular.json` 設定檔中把建置選項 `aot: false` 設好。

</div>

如果你停用 Ivy，而專案有使用國際化，你也可以把 `@angular/localize` 執行時期元件從專案的 polyfills 檔案中移除，該檔案預設位於 `src/polyfills.ts`。

若要移除，請從 polyfills 檔案中刪除 `import '@angular/localize/init';` 這一行。

<code-example language="typescript" header="polyfills.ts">
/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
</code-example>

{@a using-ssr-without-angular-ivy}

### 不使用 Ivy 的 SSR

如果你退出 Ivy，而應用程式使用 [Angular Universal](guide/universal) 在伺服器上渲染 Angular 應用程式，你還必須變更伺服器執行引導的方式。

以下範例說明如何修改 `server.ts` 檔案，提供 `AppServerModuleNgFactory` 作為引導模組。

*   從 `app.server.module.ngfactory` 虛擬檔案匯入 `AppServerModuleNgFactory`。
*   在 `ngExpressEngine` 呼叫中設定 `bootstrap: AppServerModuleNgFactory`。

<code-example language="typescript" header="server.ts">
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';

import { AppServerModuleNgFactory } from './src/app/app.server.module.ngfactory';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ivy-test/browser');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}

export * from './src/main.server';
</code-example>
