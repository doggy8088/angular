# 嚴格模式

建立新的工作區或專案時，你可以選擇使用 `--strict` 旗標，以嚴格模式建立它們。

啟用這個旗標會以一些新的設定初始化你的新工作區或專案，這些設定可提升可維護性、協助你提早發現錯誤，並讓 CLI 對你的應用程式進行進階最佳化。
此外，使用這些更嚴格設定的應用程式更容易進行靜態分析，而且當你更新到未來的 Angular 版本時，可以協助 `ng update` 命令更安全、更精確地重構程式碼。

具體來說，`strict` 旗標會執行下列事項：

* 啟用 TypeScript 中的 [`strict` 模式](https://www.staging-typescript.org/tsconfig#strict)，以及 TypeScript 團隊建議的其他嚴格旗標。具體來說是 `forceConsistentCasingInFileNames`、`noImplicitReturns` 與 `noFallthroughCasesInSwitch`。
* 開啟嚴格的 Angular 編譯器旗標 [`strictTemplates`](guide/angular-compiler-options#stricttemplates) 與 [`strictInjectionParameters`](guide/angular-compiler-options#strictinjectionparameters)
* [套件大小預算](guide/build#設定大小預算)已縮減約 75%
* 開啟 [`no-any` tslint 規則](https://palantir.github.io/tslint/rules/no-any/)，以防止宣告 `any` 型別
* [將你的應用程式標記為無副作用](https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free)，以啟用更進階的 tree-shaking

你可以在工作區與專案層級套用這些設定。

若要使用嚴格模式建立新的工作區與應用程式，請執行下列命令：

<code-example language="sh" class="code-shell">

ng new [project-name] --strict

</code-example>

若要在現有的非嚴格工作區中，以嚴格模式建立新的應用程式，請執行下列命令：

<code-example language="sh" class="code-shell">

ng generate application [project-name] --strict

</code-example>

{@a side-effect}

### 應用程式中的非本地副作用

使用 `strict` 模式建立專案與工作區時，你會注意到在 `src/app/` 目錄中多了一個 `package.json` 檔案。
這個檔案會告知工具與打包器，此目錄下的程式碼沒有非本地副作用。應用程式程式碼中的非本地副作用並不常見，使用它們也不被視為良好的程式設計模式。
更重要的是，含有這類副作用的程式碼無法進行最佳化，會導致套件大小增加、應用程式載入變慢。

如果你需要更多資訊，以下連結可能會有幫助。

* [Tree-shaking](https://webpack.js.org/guides/tree-shaking/)
* [Dealing with side effects and pure functions in JavaScript](https://dev.to/vonheikemen/dealing-with-side-effects-and-pure-functions-in-javascript-16mg)
* [How to deal with dirty side effects in your pure function JavaScript](https://jrsinclair.com/articles/2018/how-to-deal-with-dirty-side-effects-in-your-pure-functional-javascript/)
