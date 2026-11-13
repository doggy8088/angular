<div class="center-layout-wide">

<h1 class="no-toc">速查表</h1>

| 啟動 | 說明 |
|:---                                                                                                                                                                  |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { platformBrowserDynamic } from '&commat;angular/platform-browser-dynamic'; </code-example> | 從 `@angular/platform-browser-dynamic` 匯入 `platformBrowserDynamic`。 |
| <code-example format="typescript" hideCopy language="typescript"> platformBrowserDynamic().bootstrapModule(AppModule); </code-example> | 使用指定 `NgModule` 的根元件來啟動應用程式。 |

| NgModule | 說明 |
|:---                                                                                                                                                                                                                                                                                                                                |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { NgModule } from '&commat;angular/core'; </code-example> | 從 `@angular/core` 匯入 `NgModule`。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;NgModule({ &NewLine;&nbsp; declarations: &hellip;, &NewLine;&nbsp; imports: &hellip;, &NewLine;&nbsp; exports: &hellip;, &NewLine;&nbsp; providers: &hellip;, &NewLine;&nbsp; bootstrap: &hellip; &NewLine;}) &NewLine;class MyModule {} </code-example> | 定義一個包含元件、指令、管道與提供者的模組。 |
| <code-example format="typescript" hideCopy language="typescript"> declarations: [ &NewLine;&nbsp; MyRedComponent, &NewLine;&nbsp; MyBlueComponent, &NewLine;&nbsp; MyDatePipe &NewLine;] </code-example> | 屬於這個模組的元件、指令與管道清單。 |
| <code-example format="typescript" hideCopy language="typescript"> imports: [ &NewLine;&nbsp; BrowserModule, &NewLine;&nbsp; SomeOtherModule &NewLine;] </code-example> | 要匯入這個模組的模組清單。匯入模組的所有內容都可供這個模組的 `declarations` 使用。 |
| <code-example format="typescript" hideCopy language="typescript"> exports: [ &NewLine;&nbsp; MyRedComponent, &NewLine;&nbsp; MyDatePipe &NewLine;] </code-example> | 匯入這個模組的模組可見的元件、指令與管道清單。 |
| <code-example format="typescript" hideCopy language="typescript"> providers: [ &NewLine;&nbsp; MyService, &NewLine;&nbsp; { provide: &hellip; } &NewLine;] </code-example> | 這個模組的內容與匯入這個模組的模組都可見的依賴注入提供者清單。 |
| <code-example format="typescript" hideCopy language="typescript"> bootstrap: [MyAppComponent] </code-example> | 這個模組啟動時要啟動的元件清單。 |

| 範本語法 | 說明 |
|:---                                                                                                                                                                                                                                                                                                                                                                                                          |:---     |
| <code-example format="html" hideCopy language="html"> &lt;input [value]="firstName"&gt; </code-example> | 將屬性 `value` 繫結至運算式 `firstName` 的結果。 |
| <code-example format="html" hideCopy language="html"> &lt;div [attr.role]="myAriaRole"&gt; </code-example> | 將 attribute `role` 繫結至運算式 `myAriaRole` 的結果。 |
| <code-example format="html" hideCopy language="html"> &lt;div [class.extra-sparkle]="isDelightful"&gt; </code-example> | 將元素上 CSS 類別 `extra-sparkle` 是否存在，繫結至運算式 `isDelightful` 的真值。 |
| <code-example format="html" hideCopy language="html"> &lt;div [style.width.px]="mySize"&gt; </code-example> | 將樣式屬性 `width` 繫結至運算式 `mySize` 的結果，單位為像素。單位可省略。 |
| <code-example format="html" hideCopy language="html"> &lt;button (click)="readRainbow(&dollar;event)"&gt; </code-example> | 在這個按鈕元素（或其子元素）觸發點擊事件時呼叫方法 `readRainbow`，並傳入事件物件。 |
| <code-example format="html" hideCopy language="html"> &lt;div title="Hello {{ponyName}}"&gt; </code-example> | 將屬性繫結至內插字串，例如「Hello Seabiscuit」。等同於：<code-example format="html" hideCopy language="html"> &lt;div [title]="'Hello ' + ponyName"&gt; </code-example> |
| <code-example format="html" hideCopy language="html"> &lt;p&gt; &NewLine;&nbsp; Hello {{ponyName}} &NewLine;&lt;/p&gt; </code-example> | 將文字內容繫結至內插字串，例如「Hello Seabiscuit」。 |
| <code-example format="html" hideCopy language="html"> &lt;my-cmp [(title)]="name"&gt; </code-example> | 設定雙向資料繫結。等同於：<code-example format="html" hideCopy language="html"> &lt;my-cmp [title]="name" (titleChange)="name=&dollar;event"&gt; </code-example> |
| <code-example format="html" hideCopy language="html"> &lt;video &num;movieplayer &hellip;&gt;&lt;/video&gt; &NewLine;&lt;button (click)="movieplayer.play()"&gt; &NewLine;&nbsp; Play &NewLine;&lt;/button&gt; </code-example> | 建立區域變數 `movieplayer`，可在目前範本的資料繫結與事件繫結運算式中存取 `video` 元素實例。 |
| <code-example format="html" hideCopy language="html"> &lt;p &ast;myUnless="myExpression"&gt; &NewLine;&nbsp; &hellip; &NewLine;&lt;/p&gt; </code-example> | 星號 \(`*`\) 字元會將目前的元素轉換為內嵌範本。等同於：<code-example format="html" hideCopy language="html"> &lt;ng-template [myUnless]="myExpression"&gt; &NewLine;&nbsp; &lt;p&gt; &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; &lt;/p&gt; &NewLine;&lt;/ng-template&gt; </code-example> |
| <code-example format="html" hideCopy language="html"> &lt;p&gt; &NewLine;&nbsp; Card No.: {{cardNumber &verbar; myCardNumberFormatter}} &NewLine;&lt;/p&gt; </code-example> | 使用名為 `myCardNumberFormatter` 的管道來轉換運算式 `cardNumber` 的目前值。 |
| <code-example format="html" hideCopy language="html"> &lt;p&gt; &NewLine;&nbsp; Employer: {{employer?.companyName}} &NewLine;&lt;/p&gt; </code-example> | 安全導覽運算子 \(`?`\) 表示 `employer` 欄位是選用的，若為 `undefined`，運算式的其餘部分會被忽略。 |
| <code-example format="html" hideCopy language="html"> &lt;svg:rect x="0" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; y="0" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; width="100" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height="100"/&gt; </code-example> | SVG 片段範本需要在根元素加上 `svg:` 前綴，以區分 SVG 元素與 HTML 元件。 |
| <code-example format="html" hideCopy language="html"> &lt;svg&gt; &NewLine;&nbsp; &lt;rect x="0" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; y="0" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; width="100" &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height="100"/&gt; &NewLine;&lt;/svg&gt; </code-example> | `<svg>` 根元素會自動被偵測為 SVG 元素，不需要前綴。 |

| 內建指令 | 說明 |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { CommonModule } from '&commat;angular/common'; </code-example> | 從 `@angular/common` 匯入 `CommonModule`。 |
| <code-example format="html" hideCopy language="html"> &lt;section &ast;ngIf="showSection"&gt; </code-example> | 根據 `showSection` 運算式移除或重新建立 DOM 樹的一部分。 |
| <code-example format="html" hideCopy language="html"> &lt;li &ast;ngFor="let item of list"&gt; </code-example> | 將 `li` 元素及其內容轉換為範本，並用它為 list 中的每個項目具現化一個檢視。 |
| <code-example format="html" hideCopy language="html"> &lt;div [ngSwitch]="conditionExpression"&gt;&NewLine;&nbsp; &lt;ng-template [ngSwitchCase]="case1Exp"&gt; &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; &lt;/ng-template&gt;&NewLine;&nbsp; &lt;ng-template ngSwitchCase="case2LiteralString"&gt; &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; &lt;/ng-template&gt;&NewLine;&nbsp; &lt;ng-template ngSwitchDefault&gt; &NewLine;&nbsp;&nbsp;&nbsp; &hellip; &NewLine;&nbsp; &lt;/ng-template&gt; &NewLine;&lt;/div&gt; </code-example> | 根據 `conditionExpression` 的目前值選擇其中一個內嵌範本，有條件地置換 `div` 的內容。 |
| <code-example format="html" hideCopy language="html"> &lt;div [ngClass]="{'active': isActive, &NewLine;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 'disabled': isDisabled}"&gt; </code-example> | 將元素上 CSS 類別是否存在，繫結至相關對映值的真值。右側運算式應回傳 `{class-name: true/false}` 對映。 |
| <code-example format="html" hideCopy language="html"> &lt;div [ngStyle]="{'property': 'value'}"&gt; &NewLine;&lt;div [ngStyle]="dynamicStyles()"&gt; </code-example> | 讓你使用 CSS 為 HTML 元素指派樣式。你可以直接使用 CSS，如第一個範例所示，也可以呼叫元件中的方法。 |

| 表單 | 說明 |
|:---                                                                                                                                    |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { FormsModule } from '&commat;angular/forms'; </code-example> | 從 `@angular/forms` 匯入 `FormsModule`。 |
| <code-example format="html" hideCopy language="html"> &lt;input [(ngModel)]="userName"&gt; </code-example> | 為表單控制項提供雙向資料繫結、剖析與驗證。 |

| 類別裝飾器 | 說明 |
|:---                                                                                                                                             |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { Directive, &hellip; } from '&commat;angular/core'; </code-example> | 從 `@angular/core';` 匯入 `Directive, &hellip;`。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Component({&hellip;}) &NewLine;class MyComponent() {} </code-example> | 宣告一個類別是元件，並提供關於該元件的詮釋資料。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Directive({&hellip;}) &NewLine;class MyDirective() {} </code-example> | 宣告一個類別是指令，並提供關於該指令的詮釋資料。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Pipe({&hellip;}) &NewLine;class MyPipe() {} </code-example> | 宣告一個類別是管道，並提供關於該管道的詮釋資料。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Injectable() &NewLine;class MyService() {} </code-example> | 宣告一個類別可由其他類別提供與注入。若沒有這個裝飾器，編譯器不會產生足夠的詮釋資料，讓該類別在被注入某處時正確建立。 |

| 指令設定 | 說明 |
|:---                                                                                                                                                                           |:---     |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Directive({ &NewLine;&nbsp; property1: value1, &NewLine;&nbsp; &hellip; &NewLine;}) </code-example> | 為 Directive 加入值為 `value1` 的 `property1` 屬性。 |
| <code-example format="typescript" hideCopy language="typescript"> selector: '.cool-button:not(a)' </code-example> | 指定一個 CSS 選取器，用來在範本中識別這個指令。支援的選取器包括 `element`、`[attribute]`、`.class` 與 `:not()`。<br /> 不支援父子關係選取器。 |
| <code-example format="typescript" hideCopy language="typescript"> providers: [ &NewLine;&nbsp; MyService, &NewLine;&nbsp; { provide: &hellip; } &NewLine;] </code-example> | 這個指令及其子指令的依賴注入提供者清單。 |

| 元件設定 <br /> `@Component` 繼承自 `@Directive`，因此 `@Directive` 的設定也適用於元件 | 說明 |
|:---                                                                                                                                                          |:---     |
| <code-example format="typescript" hideCopy language="typescript"> moduleId: module.id </code-example>                                                        | 若有設定，`templateUrl` 與 `styleUrl` 會相對於該元件解析。        |
| <code-example format="typescript" hideCopy language="typescript"> viewProviders: [MyService, { provide: &hellip; }] </code-example> | 限定於這個元件檢視範圍的依賴注入提供者清單。 |
| <code-example format="typescript" hideCopy language="typescript"> template: 'Hello {{name}}' &NewLine;templateUrl: 'my-component.html' </code-example> | 這個元件檢視的內嵌範本或外部範本 URL。 |
| <code-example format="typescript" hideCopy language="typescript"> styles: ['.primary {color: red}'] &NewLine;styleUrls: ['my-component.css'] </code-example> | 用來為這個元件檢視設定樣式的內嵌 CSS 樣式或外部樣式表 URL 清單。 |

| 指令與元件的類別欄位裝飾器 | 說明 |
|:---                                                                                                                                                      |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { Input, &hellip; } from '&commat;angular/core'; </code-example> | 從 `@angular/core` 匯入 `Input, ...`。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Input() myProperty; </code-example> | 宣告一個輸入屬性，你可以使用屬性繫結來更新它 \(範例：`<my-cmp [myProperty]="someExpression">`\)。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;Output() myEvent = new EventEmitter(); </code-example> | 宣告一個輸出屬性，它會發出事件，你可以使用事件繫結來訂閱 \(範例：`<my-cmp (myEvent)="doSomething()">`\)。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;HostBinding('class.valid') isValid; </code-example> | 將宿主元素屬性（此處為 CSS 類別 `valid`）繫結至指令／元件屬性（`isValid`）。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;HostListener('click', ['&dollar;event']) onClick(e) {&hellip;} </code-example> | 以指令／元件方法（`onClick`）訂閱宿主元素事件（`click`），可選擇性傳入引數（`$event`）。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;ContentChild(myPredicate) myChildComponent; </code-example> | 將元件內容查詢（`myPredicate`）的第一個結果繫結至類別的屬性（`myChildComponent`）。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;ContentChildren(myPredicate) myChildComponents; </code-example> | 將元件內容查詢（`myPredicate`）的結果繫結至類別的屬性（`myChildComponents`）。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;ViewChild(myPredicate) myChildComponent; </code-example> | 將元件檢視查詢（`myPredicate`）的第一個結果繫結至類別的屬性（`myChildComponent`）。指令不適用。 |
| <code-example format="typescript" hideCopy language="typescript"> &commat;ViewChildren(myPredicate) myChildComponents; </code-example> | 將元件檢視查詢（`myPredicate`）的結果繫結至類別的屬性（`myChildComponents`）。指令不適用。 |

| 指令與元件的變更偵測與生命週期鉤子 \(以類別方法實作\) | 說明 |
|:---                                                                                                                                        |:---     |
| <code-example format="typescript" hideCopy language="typescript"> constructor(myService: MyService, &hellip;) { &hellip; } </code-example> | 在任何其他生命週期鉤子之前呼叫。用它來注入依賴，但避免在此進行任何繁重的工作。 |
| <code-example format="typescript" hideCopy language="typescript"> ngOnChanges(changeRecord) { &hellip; } </code-example> | 在輸入屬性每次變更之後、處理內容或子檢視之前呼叫。 |
| <code-example format="typescript" hideCopy language="typescript"> ngOnInit() { &hellip; } </code-example> | 在建構子之後、初始化輸入屬性之後，以及第一次呼叫 `ngOnChanges` 之後呼叫。 |
| <code-example format="typescript" hideCopy language="typescript"> ngDoCheck() { &hellip; } </code-example> | 在檢查元件或指令的輸入屬性時每次呼叫。用它來執行自訂檢查以擴充變更偵測。 |
| <code-example format="typescript" hideCopy language="typescript"> ngAfterContentInit() { &hellip; } </code-example> | 在 `ngOnInit` 之後、元件或指令的內容已初始化時呼叫。 |
| <code-example format="typescript" hideCopy language="typescript"> ngAfterContentChecked() { &hellip; } </code-example> | 在每次檢查元件或指令的內容之後呼叫。 |
| <code-example format="typescript" hideCopy language="typescript"> ngAfterViewInit() { &hellip; } </code-example> | 在 `ngAfterContentInit` 之後、元件的檢視與子檢視／指令所在的檢視已初始化時呼叫。 |
| <code-example format="typescript" hideCopy language="typescript"> ngAfterViewChecked() { &hellip; } </code-example> | 在每次檢查元件的檢視與子檢視／指令所在的檢視之後呼叫。 |
| <code-example format="typescript" hideCopy language="typescript"> ngOnDestroy() { &hellip; } </code-example> | 在實例被銷毀之前呼叫一次。 |

| 依賴注入設定 | 說明 |
|:---                                                                                                                               |:---     |
| <code-example format="typescript" hideCopy language="typescript"> { provide: MyService, useClass: MyMockService } </code-example> | 將 `MyService` 的提供者設定或覆寫為 `MyMockService` 類別。 |
| <code-example format="typescript" hideCopy language="typescript"> { provide: MyService, useFactory: myFactory } </code-example> | 將 `MyService` 的提供者設定或覆寫為 `myFactory` 工廠函式。 |
| <code-example format="typescript" hideCopy language="typescript"> { provide: MyValue, useValue: 41 } </code-example> | 將 `MyValue` 的提供者設定或覆寫為值 `41`。 |

| 路由與導覽 | 說明 |
|:---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |:---     |
| <code-example format="typescript" hideCopy language="typescript"> import { Routes, RouterModule, &hellip; } from '&commat;angular/router'; </code-example> | 從 `@angular/router` 匯入 `Routes, RouterModule, ...`。 |
| <code-example format="typescript" hideCopy language="typescript"> const routes: Routes = [ &NewLine;&nbsp; { path: '', component: HomeComponent }, &NewLine;&nbsp; { path: 'path/:routeParam', component: MyComponent }, &NewLine;&nbsp; { path: 'staticPath', component: &hellip; }, &NewLine;&nbsp; { path: '**', component: &hellip; }, &NewLine;&nbsp; { path: 'oldPath', redirectTo: '/staticPath' }, &NewLine;&nbsp; { path: &hellip;, component: &hellip;, data: { message: 'Custom' } } &NewLine;]); &NewLine; &NewLine;const routing = RouterModule.forRoot(routes); </code-example> | 為應用程式設定路由。支援靜態、參數化、重新導向與萬用字元路由。也支援自訂路由資料與解析。 |
| <code-example format="html" hideCopy language="html"> &lt;router-outlet&gt;&lt;/router-outlet&gt; &NewLine;&lt;router-outlet name="aux"&gt;&lt;/router-outlet&gt; </code-example> | 標示要載入作用中路由之元件的位置。 |
| <code-example format="html" hideCopy language="html"> &lt;a routerLink="/path"&gt; &NewLine;&lt;a [routerLink]="[ '/path', routeParam ]"&gt; &NewLine;&lt;a [routerLink]="[ '/path', { matrixParam: 'value' } ]"&gt; &NewLine;&lt;a [routerLink]="[ '/path' ]" [queryParams]="{ page: 1 }"&gt; &NewLine;&lt;a [routerLink]="[ '/path' ]" fragment="anchor"&gt; </code-example> | 根據由路由路徑、必要與選用參數、查詢參數及片段組成的路由指令，建立一個連往不同檢視的連結。要導覽至根路由，使用 `/` 前綴；子路由使用 `./` 前綴；同層或父層則使用 `../` 前綴。 |
| <code-example format="html" hideCopy language="html"> &lt;a [routerLink]="[ '/path' ]" routerLinkActive="active"&gt; </code-example> | 當 `routerLink` 成為目前作用中的路由時，所提供的類別會加入該元素。 |
| <code-example format="html" hideCopy language="html"> &lt;a [routerLink]="[ '/path' ]" routerLinkActive="active" ariaCurrentWhenActive="page"&gt; </code-example> | 當 `routerLink` 成為目前作用中的路由時，所提供的類別與 `aria-current` attribute 會加入該元素。 |
| <code-example format="typescript" hideCopy language="typescript"> function canActivateGuard: CanActivateFn = &NewLine;&nbsp; ( &NewLine;&nbsp;&nbsp;&nbsp; route: ActivatedRouteSnapshot, &NewLine;&nbsp;&nbsp;&nbsp; state: RouterStateSnapshot &NewLine;&nbsp; ) => { &hellip; } &NewLine; &NewLine;{ path: &hellip;, canActivate: [canActivateGuard] } </code-example> | 一個介面，用來定義路由器應先呼叫的函式，以決定是否應啟用這個元件。應回傳 <code>boolean&verbar;UrlTree</code>，或解析為 <code>boolean&verbar;UrlTree</code> 的 Observable/Promise。 |
| <code-example format="typescript" hideCopy language="typescript"> function canDeactivateGuard: CanDeactivateFn&lt;T&gt; = &NewLine;&nbsp; ( &NewLine;&nbsp;&nbsp;&nbsp; component: T, &NewLine;&nbsp;&nbsp;&nbsp; route: ActivatedRouteSnapshot, &NewLine;&nbsp;&nbsp;&nbsp; state: RouterStateSnapshot &NewLine;&nbsp; ) => { &hellip; } &NewLine; &NewLine;{ path: &hellip;, canDeactivate: [canDeactivateGuard] } </code-example> | 一個介面，用來定義路由器應先呼叫的函式，以決定在導覽後是否應停用這個元件。應回傳 <code>boolean&verbar;UrlTree</code>，或解析為 <code>boolean&verbar;UrlTree</code> 的 Observable/Promise。 |
| <code-example format="typescript" hideCopy language="typescript"> function canActivateChildGuard: CanActivateChildFn = &NewLine;&nbsp; ( &NewLine;&nbsp;&nbsp;&nbsp; route: ActivatedRouteSnapshot, &NewLine;&nbsp;&nbsp;&nbsp; state: RouterStateSnapshot &NewLine;&nbsp; ) => { &hellip; } &NewLine; &NewLine;{ path: &hellip;, canActivateChild: [canActivateGuard], children: &hellip; } </code-example> | 一個介面，用來定義路由器應先呼叫的函式，以決定是否應啟用子路由。應回傳 <code>boolean&verbar;UrlTree</code>，或解析為 <code>boolean&verbar;UrlTree</code> 的 Observable/Promise。 |
| <code-example format="typescript" hideCopy language="typescript"> function resolveGuard implements ResolveFn&lt;T&gt; = &NewLine;&nbsp; ( &NewLine;&nbsp;&nbsp;&nbsp; route: ActivatedRouteSnapshot, &NewLine;&nbsp;&nbsp;&nbsp; state: RouterStateSnapshot &NewLine;&nbsp; ) => { &hellip; }  &NewLine; &NewLine;{ path: &hellip;, resolve: [resolveGuard] } </code-example> | 一個介面，用來定義路由器應先呼叫的函式，以在呈現路由之前解析路由資料。應回傳一個值，或解析為值的 Observable/Promise。 |
| <code-example format="typescript" hideCopy language="typescript"> function canLoadGuard: CanLoadFn = &NewLine;&nbsp; ( &NewLine;&nbsp;&nbsp;&nbsp; route: Route &NewLine;&nbsp; ) => { &hellip; } &NewLine; &NewLine;{ path: &hellip;, canLoad: [canLoadGuard], loadChildren: &hellip; } </code-example> | 一個介面，用來定義路由器應先呼叫的函式，以檢查延遲載入的模組是否應載入。應回傳 <code>boolean&verbar;UrlTree</code>，或解析為 <code>boolean&verbar;UrlTree</code> 的 Observable/Promise。 |

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
