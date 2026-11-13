# 遷移舊版本地化 ID

## 為什麼需要這個遷移

Angular 翻譯系統的運作方式是將訊息 ID 對應到另一種語言的已翻譯訊息。
建立這些 ID 的一個選項是讓翻譯系統為你產生。
以往，這些 ID 的格式在遇到無關緊要的變更（例如空白字元的變更）時並不穩定。
新格式則穩健得多。

本主題說明如何遷移舊的本地化 ID，協助你的應用程式為未來做好準備，以防舊格式被移除。

## 這個遷移做什麼

Angular 第 11 版引入了產生本地化 ID 的新格式。
這些新 ID 比先前的舊格式更穩健。
然而，在第 11 版之前建立的應用程式，其 ID 仍使用舊格式。

<div class="alert is-helpful">

你不需要將自訂的本地化 ID 遷移到新 ID。

</div>

隨著 Angular 第 12 版發布，你現在有工具可以協助你將任何舊本地化 ID 遷移到使用最新演算法的 ID。

你有兩個遷移舊 ID 的選項。
第一種方法使用 Angular CLI 在你的應用程式中找出舊 ID。
第二種方法使用獨立指令碼 `localize-extract` 找出舊 ID。

## 使用 CLI 遷移舊 ID

若要使用 CLI 遷移舊本地化 ID：

1.  執行 `ng extract-i18n` 指令。

    <code-example format="shell" language="shell">

    ng extract-i18n --format=legacy-migrate

    </code-example>

    執行此指令後，你會得到一個遷移檔案 `messages.json`，其中包含舊本地化 ID 與新 ID 之間的對應，你可以用它來更新應用程式。

1.  使用 `npx localize-migrate` 指令更新應用程式中的 ID。

    <code-example format="shell" language="shell">

    npx localize-migrate --files=*.xlf --mapFile=messages.json

    </code-example>

    <div class="alert is-helpful">

    你也可以在 `files` 參數中指定其他格式，例如 `*.xmb`。

    </div>

1.  將更新後的檔案提交到你的原始碼控制系統。

完成遷移後，將 Angular 編譯器選項 `enableI18nLegacyMessageIdFormat` 設為 `false`。
如需此選項的更多資訊，請見 [Angular 編譯器選項](guide/angular-compiler-options#enablei18nlegacymessageidformat)。

## 使用 `localize-extract` 遷移舊 ID

如果你沒有使用 Angular CLI，可以使用 `localize-extract` 遷移舊本地化 ID：

1.  執行 `npx localize-extract` 指令。

    <code-example format="shell" language="shell">

    npx localize-extract --format=legacy-migrate --source=./path/to/bundles/**/*.js --outputPath=./messages.json

    </code-example>

    在此指令中，`./path/to/bundles/` 代表你的可發佈檔案的路徑。
    你可以將 `outputPath` 參數設為系統中的任何目錄。

    <div class="alert is-helpful">

    你的可發佈檔案不得已經過翻譯（例如使用 `localize-translate`），因為這樣做會剝除擷取器所需的 `$localize` 標記字串。

    </div>

    執行此指令後，你會得到一個遷移檔案 `messages.json`，其中包含舊本地化 ID 與新 ID 之間的對應，你可以用它來更新應用程式。

1.  使用 `npx localize-migrate` 指令更新應用程式中的 ID。

    <code-example format="shell" language="shell">

    npx localize-migrate --files=*.xlf --mapFile=messages.json

    </code-example>

    <div class="alert is-helpful">

    你也可以在 `files` 參數中指定其他格式，例如 `*.xmb`。

    </div>

完成遷移後，將 Angular 編譯器選項 `enableI18nLegacyMessageIdFormat` 設為 `false`。
如需此選項的更多資訊，請見 [Angular 編譯器選項](guide/angular-compiler-options#enablei18nlegacymessageidformat)。

{@searchKeywords i18n}

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
