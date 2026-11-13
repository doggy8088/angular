# 缺少 `@Injectable()` 裝飾器與不完整提供者定義的遷移

### 這個原理圖做什麼？

1.  這個原理圖會為應用程式中已提供但未加上裝飾器的類別加上 `@Injectable()` 裝飾器。
1.  原理圖會更新遵循 `{provide: SomeToken}` 模式的提供者，明確指定 `useValue: undefined`。

**缺少 `@Injectable()` 的範例**

**遷移之前**：

<code-example format="typescript" language="typescript">

export class MyService {&hellip;}
export class MyOtherService {&hellip;}
export class MyThirdClass {&hellip;}
export class MyFourthClass {&hellip;}
export class MyFifthClass {&hellip;}

&commat;NgModule({
  providers: [
    MyService,
    {provide: SOME_TOKEN, useClass: MyOtherService},
    // The following classes do not need to be decorated because they
    // are never instantiated and just serve as DI tokens.
    {provide: MyThirdClass, useValue: &hellip;},
    {provide: MyFourthClass, useFactory: &hellip;},
    {provide: MyFifthClass, useExisting: &hellip;},
  ]
})

</code-example>

**遷移之後**：

<code-example format="typescript" language="typescript">

&commat;Injectable()
export class MyService {&hellip;}
&commat;Injectable()
export class MyOtherService {&hellip;}
export class MyThirdClass {&hellip;}
export class MyFourthClass {&hellip;}
export class MySixthClass {&hellip;}

&hellip;

</code-example>

<div class="alert is-helpful">

**NOTE**: <br />
`MyThirdClass`、`MyFourthClass` 和 `MyFifthClass` 不需要用 `@Injectable()` 裝飾，因為它們從未被實例化，只是用作 [DI 權杖][AioGuideGlossaryDiToken]。

</div>

**需要 `useValue: undefined` 的提供者範例**

這個範例展示了一個遵循 `{provide: X}` 模式的提供者。
這個提供者需要遷移到更明確的定義，指定 `useValue: undefined`。

**遷移之前**：

<code-example format="typescript" language="typescript">

{provide: MyToken}

</code-example>

**遷移之後**：

<code-example format="typescript" language="typescript">

{provide: MyToken, useValue: undefined}

</code-example>

### 為什麼必須加上 `@Injectable()`？

在我們的說明文件中，我們一直建議為應用程式中任何被提供或被注入的類別加上 `@Injectable()` 裝飾器。
然而，較舊版本的 Angular 在某些情況下（例如 AOT 模式）確實允許注入沒有裝飾器的類別。
這意味著如果你不小心漏掉了裝飾器，你的應用程式可能在某些地方缺少 `@Injectable()` 裝飾器的情況下仍能繼續運作。
這對未來的 Angular 版本來說是個問題。
最終，我們計畫嚴格要求使用這個裝飾器，因為這樣做能讓編譯器和執行期都進一步最佳化。
這個原理圖會補上任何可能缺少的 `@Injectable()` 裝飾器，讓你的應用程式為未來做好準備。

### 為什麼必須加上 `useValue: undefined`？

請看以下模式：

<code-example format="typescript" language="typescript">

&commat;NgModule({
  providers: [{provide: MyService}]
})

</code-example>

使用此模式的提供者會表現得如同它們以 `undefined` 為值提供 `MyService` 作為 [DI 權杖][AioGuideGlossaryDiToken]。
但在 Ivy 中並非如此，這類提供者會被解讀為指定了 `useClass: MyService`。
這意味著這些提供者在更新到第 9 版以上時，行為會有所不同。
為了確保提供者的行為與之前相同，DI 的值應該明確設為 `undefined`。

### 我應該在什麼時候為類別加上 `@Injectable()` 裝飾器？

任何被提供的類別都必須有 `@Injectable()` 裝飾器。
框架需要這個裝飾器，才能透過 DI 正確建立該類別的實例。

然而，已經以 `@Pipe`、`@Component` 或 `@Directive` 裝飾的類別不需要兩個裝飾器同時存在。
既有的類別裝飾器已經指示編譯器產生所需的資訊。

### 我應該更新我的函式庫嗎？

是的，如果你的函式庫中有任何預期被注入的類別，都應該以 `@Injectable()` 裝飾器更新。
在未來的 Angular 版本中，缺少 `@Injectable()` 裝飾器將永遠拋出錯誤。

此外，你的函式庫中遵循所述 `{provide: X}` 模式的提供者應該更新為指定明確的值。
若沒有明確的值，這些提供者在使用你的函式庫的應用程式中，可能會因 Angular 版本不同而有不同的行為。

<!-- links -->

[AioGuideGlossaryDiToken]: guide/glossary#di-token "DI token - Glossary | Angular"

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
