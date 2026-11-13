<div class="center-layout-wide">

<h1 class="no-toc">速查表</h1>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>啟動</th>
<th><p><code>import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>platformBrowserDynamic().bootstrapModule</b>(AppModule);</code></td>
<td><p>使用指定 <code>NgModule</code> 的根元件來啟動應用程式。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>NgModule</th>
<th><p><code>import { NgModule } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code>@<b>NgModule</b>({
  declarations: ..., imports: ..., exports: ...,
  providers: ..., bootstrap: ...
})
class MyModule {}
</code></td>
<td><p>定義一個包含元件、指令、管道與提供者的模組。</p>
</td>
</tr><tr>
<td><code><b>declarations:</b> [MyRedComponent, MyBlueComponent, MyDatePipe]</code></td>
<td><p>屬於這個模組的元件、指令與管道清單。</p>
</td>
</tr><tr>
<td><code><b>imports:</b> [BrowserModule, SomeOtherModule]</code></td>
<td><p>要匯入這個模組的模組清單。匯入模組的所有內容都可供這個模組的 <code>declarations</code> 使用。</p>
</td>
</tr><tr>
<td><code><b>exports:</b> [MyRedComponent, MyDatePipe]</code></td>
<td><p>匯入這個模組的模組可見的元件、指令與管道清單。</p>
</td>
</tr><tr>
<td><code><b>providers:</b> [MyService, { provide: ... }]</code></td>
<td><p>這個模組的內容與匯入這個模組的模組都可見的依賴注入提供者清單。</p>
</td>
</tr><tr>
<td><code><b>entryComponents:</b> [SomeComponent, OtherComponent]</code></td>
<td><p>未在任何可到達範本中參照的元件清單，例如從程式碼動態建立的元件。</p></td>
</tr><tr>
<td><code><b>bootstrap:</b> [MyAppComponent]</code></td>
<td><p>這個模組啟動時要啟動的元件清單。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>範本語法</th>
<th></th>
</tr>
<tr>
<td><code>&lt;input <b>[value]</b>="firstName"&gt;</code></td>
<td><p>將屬性 <code>value</code> 繫結至運算式 <code>firstName</code> 的結果。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[attr.role]</b>="myAriaRole"&gt;</code></td>
<td><p>將 attribute <code>role</code> 繫結至運算式 <code>myAriaRole</code> 的結果。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[class.extra-sparkle]</b>="isDelightful"&gt;</code></td>
<td><p>將元素上 CSS 類別 <code>extra-sparkle</code> 是否存在，繫結至運算式 <code>isDelightful</code> 的真值。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[style.width.px]</b>="mySize"&gt;</code></td>
<td><p>將樣式屬性 <code>width</code> 繫結至運算式 <code>mySize</code> 的結果，單位為像素。單位可省略。</p>
</td>
</tr><tr>
<td><code>&lt;button <b>(click)</b>="readRainbow($event)"&gt;</code></td>
<td><p>在這個按鈕元素（或其子元素）觸發點擊事件時呼叫方法 <code>readRainbow</code>，並傳入事件物件。</p>
</td>
</tr><tr>
<td><code>&lt;div title="Hello <b>{{ponyName}}</b>"&gt;</code></td>
<td><p>將屬性繫結至內插字串，例如「Hello Seabiscuit」。等同於：
<code>&lt;div [title]="'Hello ' + ponyName"&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Hello <b>{{ponyName}}</b>&lt;/p&gt;</code></td>
<td><p>將文字內容繫結至內插字串，例如「Hello Seabiscuit」。</p>
</td>
</tr><tr>
<td><code>&lt;my-cmp <b>[(title)]</b>="name"&gt;</code></td>
<td><p>設定雙向資料繫結。等同於： <code>&lt;my-cmp [title]="name" (titleChange)="name=$event"&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;video <b>#movieplayer</b> ...&gt;&lt;/video&gt;
&lt;button <b>(click)</b>="movieplayer.play()"&gt;Play&lt;/button&gt;
</code></td>
<td><p>建立區域變數 <code>movieplayer</code>，可在目前範本的資料繫結與事件繫結運算式中存取 <code>video</code> 元素實例。</p>
</td>
</tr><tr>
<td><code>&lt;p <b>*myUnless</b>="myExpression"&gt;...&lt;/p&gt;</code></td>
<td><p><code>*</code> 符號會將目前的元素轉換為內嵌範本。等同於：
<code>&lt;ng-template [myUnless]="myExpression"&gt;&lt;p&gt;...&lt;/p&gt;&lt;/ng-template&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Card No.: <b>{{cardNumber | myCardNumberFormatter}}</b>&lt;/p&gt;</code></td>
<td><p>使用名為 <code>myCardNumberFormatter</code> 的管道來轉換運算式 <code>cardNumber</code> 的目前值。</p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Employer: <b>{{employer?.companyName}}</b>&lt;/p&gt;</code></td>
<td><p>安全導覽運算子（<code>?</code>）表示 <code>employer</code> 欄位是選用的，若為 <code>undefined</code>，運算式的其餘部分會被忽略。</p>
</td>
</tr><tr>
<td><code>&lt;<b>svg:</b>rect x="0" y="0" width="100" height="100"/&gt;</code></td>
<td><p>SVG 片段範本需要在根元素加上 <code>svg:</code> 前綴，以區分 SVG 元素與 HTML 元件。</p>
</td>
</tr><tr>
<td><code>&lt;<b>svg</b>&gt;
  &lt;rect x="0" y="0" width="100" height="100"/&gt;
&lt;/<b>svg</b>&gt;
</code></td>
<td><p><code>&lt;svg&gt;</code> 根元素會自動被偵測為 SVG 元素，不需要前綴。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>內建指令</th>
<th><p><code>import { CommonModule } from '@angular/common';</code>
</p>
</th>
</tr>
<tr>
<td><code>&lt;section <b>*ngIf</b>="showSection"&gt;</code></td>
<td><p>根據 <code>showSection</code> 運算式移除或重新建立 DOM 樹的一部分。</p>
</td>
</tr><tr>
<td><code>&lt;li <b>*ngFor</b>="let item of list"&gt;</code></td>
<td><p>將 li 元素及其內容轉換為範本，並用它為 list 中的每個項目具現化一個檢視。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[ngSwitch]</b>="conditionExpression"&gt;
  &lt;ng-template <b>[<b>ngSwitchCase</b>]</b>="case1Exp"&gt;...&lt;/ng-template&gt;
  &lt;ng-template <b>ngSwitchCase</b>="case2LiteralString"&gt;...&lt;/ng-template&gt;
  &lt;ng-template <b>ngSwitchDefault</b>&gt;...&lt;/ng-template&gt;
&lt;/div&gt;
</code></td>
<td><p>根據 <code>conditionExpression</code> 的目前值選擇其中一個內嵌範本，有條件地置換 div 的內容。</p>
</td>
</tr><tr>
<td><code>&lt;div <b>[ngClass]</b>="{'active': isActive, 'disabled': isDisabled}"&gt;</code></td>
<td><p>將元素上 CSS 類別是否存在，繫結至相關對映值的真值。右側運算式應回傳 {class-name: true/false} 對映。</p>
</td>
</tr>
<tr>
<td><code>&lt;div <b>[ngStyle]</b>="{'property': 'value'}"&gt;
&lt;div <b>[ngStyle]</b>="dynamicStyles()"&gt;
</code></td>
<td><p>讓你使用 CSS 為 HTML 元素指派樣式。你可以直接使用 CSS，如第一個範例所示，也可以呼叫元件中的方法。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>表單</th>
<th><p><code>import { FormsModule } from '@angular/forms';</code>
</p>
</th>
</tr>
<tr>
<td><code>&lt;input <b>[(ngModel)]</b>="userName"&gt;</code></td>
<td><p>為表單控制項提供雙向資料繫結、剖析與驗證。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>類別裝飾器</th>
<th><p><code>import { Directive, ... } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>@Component({...})</b>
class MyComponent() {}
</code></td>
<td><p>宣告一個類別是元件，並提供關於該元件的詮釋資料。</p>
</td>
</tr><tr>
<td><code><b>@Directive({...})</b>
class MyDirective() {}
</code></td>
<td><p>宣告一個類別是指令，並提供關於該指令的詮釋資料。</p>
</td>
</tr><tr>
<td><code><b>@Pipe({...})</b>
class MyPipe() {}
</code></td>
<td><p>宣告一個類別是管道，並提供關於該管道的詮釋資料。</p>
</td>
</tr><tr>
<td><code><b>@Injectable()</b>
class MyService() {}
</code></td>
<td><p>宣告一個類別可由其他類別提供與注入。若沒有這個裝飾器，編譯器不會產生足夠的詮釋資料，讓該類別在被注入某處時正確建立。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>指令設定</th>
<th><p><code>@Directive({ property1: value1, ... })</code>
</p>
</th>
</tr>
<tr>
<td><code><b>selector:</b> '.cool-button:not(a)'</code></td>
<td><p>指定一個 CSS 選取器，用來在範本中識別這個指令。支援的選取器包括 <code>element</code>、<code>[attribute]</code>、<code>.class</code> 與 <code>:not()</code>。</p>
<p>不支援父子關係選取器。</p>
</td>
</tr><tr>
<td><code><b>providers:</b> [MyService, { provide: ... }]</code></td>
<td><p>這個指令及其子指令的依賴注入提供者清單。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>元件設定</th>
<th><p>
<code>@Component</code> 繼承自 <code>@Directive</code>，因此 <code>@Directive</code> 的設定也適用於元件</p>
</th>
</tr>
<tr>
<td><code><b>moduleId:</b> module.id</code></td>
<td><p>若有設定，<code>templateUrl</code> 與 <code>styleUrl</code> 會相對於該元件解析。</p>
</td>
</tr><tr>
<td><code><b>viewProviders:</b> [MyService, { provide: ... }]</code></td>
<td><p>限定於這個元件檢視範圍的依賴注入提供者清單。</p>
</td>
</tr><tr>
<td><code><b>template:</b> 'Hello {{name}}'
<b>templateUrl:</b> 'my-component.html'
</code></td>
<td><p>這個元件檢視的內嵌範本或外部範本 URL。</p>
</td>
</tr><tr>
<td><code><b>styles:</b> ['.primary {color: red}']
<b>styleUrls:</b> ['my-component.css']
</code></td>
<td><p>用來為這個元件檢視設定樣式的內嵌 CSS 樣式或外部樣式表 URL 清單。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>指令與元件的類別欄位裝飾器</th>
<th><p><code>import { Input, ... } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>@Input()</b> myProperty;</code></td>
<td><p>宣告一個輸入屬性，你可以使用屬性繫結來更新它（範例：
<code>&lt;my-cmp [myProperty]="someExpression"&gt;</code>).</p>
</td>
</tr><tr>
<td><code><b>@Output()</b> myEvent = new EventEmitter();</code></td>
<td><p>宣告一個輸出屬性，它會發出事件，你可以使用事件繫結來訂閱（範例： <code>&lt;my-cmp (myEvent)="doSomething()"&gt;</code>).</p>
</td>
</tr><tr>
<td><code><b>@HostBinding('class.valid')</b> isValid;</code></td>
<td><p>將宿主元素屬性（此處為 CSS 類別 <code>valid</code>）繫結至指令／元件屬性（<code>isValid</code>）。</p>
</td>
</tr><tr>
<td><code><b>@HostListener('click', ['$event'])</b> onClick(e) {...}</code></td>
<td><p>以指令／元件方法（<code>onClick</code>）訂閱宿主元素事件（<code>click</code>），可選擇性傳入引數（<code>$event</code>）。</p>
</td>
</tr><tr>
<td><code><b>@ContentChild(myPredicate)</b> myChildComponent;</code></td>
<td><p>將元件內容查詢（<code>myPredicate</code>）的第一個結果繫結至類別的屬性（<code>myChildComponent</code>）。</p>
</td>
</tr><tr>
<td><code><b>@ContentChildren(myPredicate)</b> myChildComponents;</code></td>
<td><p>將元件內容查詢（<code>myPredicate</code>）的結果繫結至類別的屬性（<code>myChildComponents</code>）。</p>
</td>
</tr><tr>
<td><code><b>@ViewChild(myPredicate)</b> myChildComponent;</code></td>
<td><p>將元件檢視查詢（<code>myPredicate</code>）的第一個結果繫結至類別的屬性（<code>myChildComponent</code>）。指令不適用。</p>
</td>
</tr><tr>
<td><code><b>@ViewChildren(myPredicate)</b> myChildComponents;</code></td>
<td><p>將元件檢視查詢（<code>myPredicate</code>）的結果繫結至類別的屬性（<code>myChildComponents</code>）。指令不適用。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>指令與元件的變更偵測與生命週期鉤子</th>
<th><p>（以類別方法實作）
</p>
</th>
</tr>
<tr>
<td><code><b>constructor(myService: MyService, ...)</b> { ... }</code></td>
<td><p>在任何其他生命週期鉤子之前呼叫。用它來注入依賴，但避免在此進行任何繁重的工作。</p>
</td>
</tr><tr>
<td><code><b>ngOnChanges(changeRecord)</b> { ... }</code></td>
<td><p>在輸入屬性每次變更之後、處理內容或子檢視之前呼叫。</p>
</td>
</tr><tr>
<td><code><b>ngOnInit()</b> { ... }</code></td>
<td><p>在建構子之後、初始化輸入屬性之後，以及第一次呼叫 <code>ngOnChanges</code> 之後呼叫。</p>
</td>
</tr><tr>
<td><code><b>ngDoCheck()</b> { ... }</code></td>
<td><p>在檢查元件或指令的輸入屬性時每次呼叫。用它來執行自訂檢查以擴充變更偵測。</p>
</td>
</tr><tr>
<td><code><b>ngAfterContentInit()</b> { ... }</code></td>
<td><p>在 <code>ngOnInit</code> 之後、元件或指令的內容已初始化時呼叫。</p>
</td>
</tr><tr>
<td><code><b>ngAfterContentChecked()</b> { ... }</code></td>
<td><p>在每次檢查元件或指令的內容之後呼叫。</p>
</td>
</tr><tr>
<td><code><b>ngAfterViewInit()</b> { ... }</code></td>
<td><p>在 <code>ngAfterContentInit</code> 之後、元件的檢視與子檢視／指令所在的檢視已初始化時呼叫。</p>
</td>
</tr><tr>
<td><code><b>ngAfterViewChecked()</b> { ... }</code></td>
<td><p>在每次檢查元件的檢視與子檢視／指令所在的檢視之後呼叫。</p>
</td>
</tr><tr>
<td><code><b>ngOnDestroy()</b> { ... }</code></td>
<td><p>在實例被銷毀之前呼叫一次。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>依賴注入設定</th>
<th></th>
</tr>
<tr>
<td><code>{ <b>provide</b>: MyService, <b>useClass</b>: MyMockService }</code></td>
<td><p>將 <code>MyService</code> 的提供者設定或覆寫為 <code>MyMockService</code> 類別。</p>
</td>
</tr><tr>
<td><code>{ <b>provide</b>: MyService, <b>useFactory</b>: myFactory }</code></td>
<td><p>將 <code>MyService</code> 的提供者設定或覆寫為 <code>myFactory</code> 工廠函式。</p>
</td>
</tr><tr>
<td><code>{ <b>provide</b>: MyValue, <b>useValue</b>: 41 }</code></td>
<td><p>將 <code>MyValue</code> 的提供者設定或覆寫為值 <code>41</code>。</p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>路由與導覽</th>
<th><p><code>import { Routes, RouterModule, ... } from '@angular/router';</code>
</p>
</th>
</tr>
<tr>
<td><code>const routes: <b>Routes</b> = [
  { path: '', component: HomeComponent },
  { path: 'path/:routeParam', component: MyComponent },
  { path: 'staticPath', component: ... },
  { path: '**', component: ... },
  { path: 'oldPath', redirectTo: '/staticPath' },
  { path: ..., component: ..., data: { message: 'Custom' } }
]);

const routing = RouterModule.forRoot(routes);
</code></td>
<td><p>為應用程式設定路由。支援靜態、參數化、重新導向與萬用字元路由。也支援自訂路由資料與解析。</p>
</td>
</tr><tr>
<td><code>&lt;<b>router-outlet</b>&gt;&lt;/<b>router-outlet</b>&gt;
&lt;<b>router-outlet</b> name="aux"&gt;&lt;/<b>router-outlet</b>&gt;
</code></td>
<td><p>標示要載入作用中路由之元件的位置。</p>
</td>
</tr><tr>
<td><code>&lt;a <b>routerLink</b>="/path"&gt;
&lt;a <b>[routerLink]</b>="[ '/path', routeParam ]"&gt;
&lt;a <b>[routerLink]</b>="[ '/path', { matrixParam: 'value' } ]"&gt;
&lt;a <b>[routerLink]</b>="[ '/path' ]" [queryParams]="{ page: 1 }"&gt;
&lt;a <b>[routerLink]</b>="[ '/path' ]" fragment="anchor"&gt;
</code></td>
<td><p>根據由路由路徑、必要與選用參數、查詢參數及片段組成的路由指令，建立一個連往不同檢視的連結。要導覽至根路由，使用 <code>/</code> 前綴；子路由使用 <code>./</code> 前綴；同層或父層則使用 <code>../</code> 前綴。</p>
</td>
</tr><tr>
<td><code>&lt;a [routerLink]="[ '/path' ]" <b>routerLinkActive</b>="active"&gt;</code></td>
<td><p>當 <code>routerLink</code> 成為目前作用中的路由時，所提供的類別會加入該元素。</p>
</td>
</tr><tr>
<td><code>class <b>CanActivate</b>Guard implements <b>CanActivate</b> {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canActivate: [<b>CanActivate</b>Guard] }
</code></td>
<td><p>一個介面，用來定義路由器應先呼叫的類別，以決定是否應啟用這個元件。應回傳 boolean|UrlTree，或解析為 boolean|UrlTree 的 Observable/Promise。</p>
</td>
</tr><tr>
<td><code>class <b>CanDeactivate</b>Guard implements <b>CanDeactivate</b>&lt;T&gt; {
  canDeactivate(
    component: T,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canDeactivate: [<b>CanDeactivate</b>Guard] }
</code></td>
<td><p>一個介面，用來定義路由器應先呼叫的類別，以決定在導覽後是否應停用這個元件。應回傳 boolean|UrlTree，或解析為 boolean|UrlTree 的 Observable/Promise。</p>
</td>
</tr><tr>
<td><code>class <b>CanActivateChild</b>Guard implements <b>CanActivateChild</b> {
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canActivateChild: [CanActivateGuard],
  children: ... }
</code></td>
<td><p>一個介面，用來定義路由器應先呼叫的類別，以決定是否應啟用子路由。應回傳 boolean|UrlTree，或解析為 boolean|UrlTree 的 Observable/Promise。</p>
</td>
</tr><tr>
<td><code>class <b>Resolve</b>Guard implements <b>Resolve</b>&lt;T&gt; {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable&lt;any&gt;|Promise&lt;any&gt;|any { ... }
}

{ path: ..., resolve: [<b>Resolve</b>Guard] }
</code></td>
<td><p>一個介面，用來定義路由器應先呼叫的類別，以在呈現路由之前解析路由資料。應回傳一個值，或解析為值的 Observable/Promise。</p>
</td>
</tr><tr>
<td><code>class <b>CanLoad</b>Guard implements <b>CanLoad</b> {
  canLoad(
    route: Route
  ): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree { ... }
}

{ path: ..., canLoad: [<b>CanLoad</b>Guard], loadChildren: ... }
</code></td>
<td><p>一個介面，用來定義路由器應先呼叫的類別，以檢查延遲載入的模組是否應載入。應回傳 boolean|UrlTree，或解析為 boolean|UrlTree 的 Observable/Promise。</p>
</td>
</tr>
</tbody></table>

</div>
