# 嚴格模式

Angular CLI 建立的所有新工作區與專案都會啟用**嚴格模式**。

嚴格模式可提升可維護性，並協助你提早發現錯誤。此外，嚴格模式的應用程式更容易進行靜態分析，而且當你更新到未來的 Angular 版本時，可以協助 `ng update` 命令更安全、更精確地重構程式碼。

具體來說，嚴格模式會以下列方式影響新產生的應用程式：

*   啟用 TypeScript 中的 [`strict` 模式](https://www.typescriptlang.org/tsconfig#strict)，以及 TypeScript 團隊建議的其他嚴格旗標。具體來說是 `forceConsistentCasingInFileNames`、`noImplicitReturns` 與 `noFallthroughCasesInSwitch`。
*   開啟嚴格的 Angular 編譯器旗標 [`strictTemplates`](guide/angular-compiler-options#stricttemplates)、[`strictInjectionParameters`](guide/angular-compiler-options#strictinjectionparameters) 與 [`strictInputAccessModifiers`](guide/template-typecheck#範本錯誤疑難排解)。
*   將 `initial` 與 `anyComponentStyle` 這兩種預算類型的[套件大小預算](guide/build#設定大小預算)縮減為先前預設值的 75%。

你可以在工作區與專案層級套用這些設定。

使用基本的 `ng new` 命令建立新的工作區與應用程式時，會自動使用嚴格模式，如下列命令所示：

<code-example format="shell" language="shell">

ng new [project-name]

</code-example>

若要在現有的非嚴格工作區中，以嚴格模式建立新的應用程式，請執行下列命令：

<code-example format="shell" language="shell">

ng generate application [project-name] --strict

</code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
