# 嚴格模式

建立新的工作區或應用程式時，你可以選擇使用 `--strict` 旗標，以嚴格模式建立它們。

啟用這個旗標會以一些新的設定初始化你的新工作區或應用程式，這些設定可提升可維護性，並協助你提早發現錯誤。
此外，使用這些更嚴格設定的應用程式更容易進行靜態分析，而且當你更新到未來的 Angular 版本時，可以協助 `ng update` 命令更安全、更精確地重構程式碼。

具體來說，`strict` 旗標會執行下列事項：

* 啟用 TypeScript 中的 [`strict` 模式](https://www.typescriptlang.org/tsconfig#strict)，以及 TypeScript 團隊建議的其他嚴格旗標。具體來說是 `forceConsistentCasingInFileNames`、`noImplicitReturns` 與 `noFallthroughCasesInSwitch`。
* 開啟嚴格的 Angular 編譯器旗標 [`strictTemplates`](guide/angular-compiler-options#stricttemplates)、[`strictInjectionParameters`](guide/angular-compiler-options#strictinjectionparameters) 與 [`strictInputAccessModifiers`](guide/template-typecheck#範本錯誤疑難排解)。
* [套件大小預算](guide/build#設定大小預算)已縮減約 75%。

你可以在工作區與專案層級套用這些設定。

若要使用嚴格模式建立新的工作區與應用程式，請執行下列命令：

<code-example language="sh">

ng new [project-name] --strict

</code-example>

若要在現有的非嚴格工作區中，以嚴格模式建立新的應用程式，請執行下列命令：

<code-example language="sh">

ng generate application [project-name] --strict

</code-example>
