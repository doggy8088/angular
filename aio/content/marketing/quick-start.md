<h1 class="no-toc">你的第一個 Angular 應用程式</h1>

只需要幾行 TypeScript，就能建立你的第一個 Angular 應用程式。隨著應用程式成長，你可以把標記與程式碼分到不同的檔案。

## 試試你的第一個 Angular 應用程式

程式碼編輯器中包含一個完整的 Angular 應用程式。

<iframe src="https://stackblitz.com/github/angular/angular/tree/main/aio/content/demos/first-app?embed=1&file=src/main.ts&hideExplorer=1&hideNavigation=1" height="550" width="100%" style="border: solid 1px 777"></iframe>

程式碼編輯器中的 Angular 應用程式展示了構成一個簡單但完整的 Angular 元件的 TypeScript 程式碼。它從現有的程式庫匯入資源，並定義新元件的屬性。

## 進一步探索

進一步了解 [Angular 功能](/features)，或試試以下練習，親手體驗 Angular。

### 為你的第一個 Angular 應用程式加入功能

要為你的元件加入一個重設按鈕，把計數器歸零：

1.  在程式碼編輯器中，於 `template` 的值裡面，在以 `<button (click)=` 開頭的那一行後面，加入這一行。

    <code-example format="html" language="html">

    &lt;button (click)="count = 0"&gt;Reset&lt;/button&gt;

    </code-example>

    完成這項修改後，`template` 的定義應該會像這樣：

    <code-example format="javascript" language="javascript">

    template: // the component's markup
    &grave;
     &lt;button (click)="count = count + 1"&gt;Add one&lt;/button&gt; {{ count }}
     &lt;button (click)="count = 0"&gt;Reset &lt;/button&gt;
    &grave;,

    </code-example>

1.  點選 **Add one** 幾次，再點選 **Reset**。計數器的值應該會回到零。

新增的這一行加入了一個新的 `<button>` 元素。當按鈕上發生 `click` 事件時，雙引號內的 TypeScript 程式碼會把 `count` 屬性設為 `0`。

你也可以為新元件加入樣式。

1.  在程式碼編輯器中，於 `selector` 的值之後、以 `standalone` 開頭的那一行之前，加入以下程式碼，讓你的按鈕文字變粗、邊角變圓。

    <code-example format="javascript" language="javascript">

      styles: [
        'button { font-weight: bold; border-radius: 8px;}'
      ],

    </code-example>

1.  新 Angular 應用程式中的按鈕現在應該會有粗體文字與圓角。

### 從命令列建立新的 Angular 應用程式

要在本機電腦上建立新的 Angular 應用程式，請在命令列工具中執行以下步驟。

1.  確認你的系統已安裝正確版本的 `node.js` 與 `npm`。

    1.  執行這個命令，顯示目前的 npm 版本。

        <code-example format="shell" language="shell">

        npm --version

        </code-example>

    1.  如果看到的版本號碼是 `8.5.0` 或更新版本，就可以開始建立 Angular 應用程式了。如需了解支援的 node 與 npm 版本，請參閱[先決條件](guide/setup-local#必要條件)。

    1.  如果沒有看到這樣的版本號碼，請先[更新 `node`][update-node]，再重試這個步驟，然後繼續。

1.  建立新的 Angular 應用程式。
    1. 建立或前往你想要建立 Angular 應用程式的目錄。

    1.  執行這個命令，建立新的 Angular 應用程式。

        <code-example format="shell" language="shell">

        npm init @angular myApp

        </code-example>

        出現選擇提示時，按 **Enter** 接受預設選項。這會在 `myApp` 目錄中建立新的 Angular 應用程式。

    1.  執行這個命令，前往新的目錄。

        <code-example format="shell" language="shell">

        cd myApp

        </code-example>

    1.  執行這個命令，建置你的新應用程式。

        <code-example format="shell" language="shell">

        npm start

        </code-example>

        出現選擇提示時，按 **Enter** 接受預設選項。記下命令列工具所顯示訊息中的 URL，下一個步驟會用到。

    1.  在裝有新 Angular 應用程式的系統上開啟瀏覽器。

    1.  在瀏覽器的網址列中，輸入命令列工具所顯示訊息中的 URL。預設的 URL 是 `http://localhost:4200`。

新的 Angular 應用程式會顯示附有 Angular 標誌的預設首頁。請參考下一節的教學，找找如何開始修改新應用程式、讓它成為你自己的靈感。

### 試試更多教學

想看更多 Angular 程式撰寫示範，請造訪：

* [Angular 簡介][intro-to-angular-video]
    一部關於開發 Angular 應用程式的影片教學。Angular 團隊為初學者製作了這部影片，讓大家*親手體驗* Angular。（42 分鐘）
* [基本購物車示範][shopping-cart]
    一個展示更多 Angular 功能的基本應用程式。這個示範會帶你一步步在 StackBlitz 編輯器中建立一個簡單的應用程式。
* [英雄之旅][toh-tutorial]
    一個從頭開始使用 Angular 開發工具建立 Angular 應用程式的教學。你可以在自己系統上的 IDE 中開發這個教學，也可以在 StackBlitz 編輯器中開發。

<!-- links -->

[shopping-cart]: start "Getting started with Angular | Angular"  
[toh-tutorial]: tutorial "Tour of Heroes application and tutorial | Angular"

<!-- external links -->

[update-node]: https://nodejs.org/en/download/ "Node downloads"
[intro-to-angular-video]: https://youtu.be/qxchrt04bTA "Introduction to Angular"

<!-- end links -->
