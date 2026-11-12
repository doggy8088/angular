# 元件測試情境

本指南探討常見的元件測試使用情境。

## 元件繫結

在範例應用程式中，`Banner` 元件在 HTML 範本中呈現靜態的標題文字。

經過幾次變更後，`Banner` 元件透過繫結到元件的 `title` 屬性，呈現動態標題，如下所示。

```angular-ts {header: "banner.ts"}
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-banner',
  template: '<h1>{{ title() }}</h1>',
  styles: ['h1 { color: green; font-size: 350%}'],
})
export class Banner {
  title = signal('Test Tour of Heroes');
}
```

即使內容如此精簡，你還是決定加入一個測試，確認元件確實在你預期的位置顯示正確的內容。

### 查詢 `<h1>`

你將撰寫一系列測試，檢查包住 _title_ 屬性插值繫結的 `<h1>` 元素之值。

你更新 `beforeEach`，使用標準的 HTML `querySelector` 找到該元素，並將它指派給 `h1` 變數。

```ts {header: "banner.component.spec.ts"}
let component: Banner;
let fixture: ComponentFixture<Banner>;
let h1: HTMLElement;

beforeEach(() => {
  fixture = TestBed.createComponent(Banner);
  component = fixture.componentInstance; // Banner test instance
  h1 = fixture.nativeElement.querySelector('h1');
});
```

### `createComponent()` 不會繫結資料

在你的第一個測試中，你想看到畫面顯示預設的 `title`。
你的直覺是撰寫一個立即檢查 `<h1>` 的測試，如下所示：

```ts
it('should display original title', () => {
  expect(h1.textContent).toContain(component.title());
});
```

_該測試失敗_，並顯示下列訊息：

```shell {hideCopy}
expected '' to contain 'Test Tour of Heroes'.
```

繫結發生在 Angular 執行**變更偵測**時。

在正式環境中，舉例來說，當 Angular 建立一個元件，或使用者輸入按鍵時，變更偵測會自動啟動。

`TestBed.createComponent` 不會同步觸發變更偵測；修訂後的測試證實了這個事實：

```ts
it('no title in the DOM after createComponent()', () => {
  expect(h1.textContent).toEqual('');
});
```

### `whenStable()` {#whenstable}

你可以透過 `await fixture.whenStable()` 告訴 `TestBed` 等待變更偵測執行。
只有到那時，`<h1>` 才會有預期的標題。

```ts
it('should display original title', async () => {
  await fixture.whenStable();
  expect(h1.textContent).toContain(component.title());
});
```

延遲變更偵測是有意設計且實用的。
它讓測試者有機會在 _Angular 開始資料繫結並呼叫[生命週期鉤子](guide/components/lifecycle)之前_，檢查並變更元件的狀態。

這是另一個測試，它在呼叫 `fixture.whenStable()` _之前_ 先變更元件的 `title` 屬性。

```ts
it('should display a different test title', async () => {
  component.title.set('Test Title');
  await fixture.whenStable();
  expect(h1.textContent).toContain('Test Title');
});
```

### 將訊號繫結到輸入

若要反映輸入的變更並監聽輸出，你可以將訊號動態繫結到輸入，並將函式繫結到輸出。

```ts
import {inputBinding, outputBinding} from '@angular/core';
import {TestBed} from '@angular/core/testing';

const fixture = TestBed.createComponent(ValueDisplay, {
  bindings: [
    inputBinding('value', value),
    outputBinding('valueChange', () =>  (/* ... */) ),
  ],
});
```

### 以 `dispatchEvent()` 變更輸入值

若要模擬使用者輸入，請找到輸入元素並設定它的 `value` 屬性。

但這中間有一個不可或缺的步驟。

Angular 並不知道你設定了輸入元素的 `value` 屬性。
在你呼叫 `dispatchEvent()` 引發元素的 `input` 事件之前，它不會讀取該屬性。

下列使用 `TitleCasePipe` 的元件範例示範了正確的順序。

```ts
it('should convert hero name to Title Case', async () => {
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## 具有相依性的元件

元件經常有服務相依性。

`Welcome` 元件會向已登入的使用者顯示歡迎訊息。
它依據注入的 `UserAuthentication` 的某個屬性，知道使用者是誰：

```angular-ts
import {Component, computed, inject} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = computed(() =>
    this.userAuth.isLoggedIn() ? `Welcome, ${this.userAuth.user().name}` : 'Please log in.',
  );
}
```

`Welcome` 元件具有與服務互動的決策邏輯，這些邏輯讓這個元件值得測試。

### 提供服務測試替身

_受測元件_ 不一定要搭配真實的服務。

注入真實的 `UserAuthentication` 可能很困難。
真實的服務可能會要求使用者提供登入憑證，並嘗試連線到驗證伺服器。
這些行為可能很難攔截。請注意，使用測試替身會讓測試的行為與正式環境不同，因此請謹慎使用。

### 取得注入的服務 {#get-injected-services}

測試需要存取注入到 `Welcome` 元件中的 `UserAuthentication`。

Angular 有一套階層式注入系統。
從 `TestBed` 建立的根注入器，一路往下到元件樹，注入器可以存在於多個層級。

取得注入服務最安全、**永遠有效**的方法，
是**從受測元件的注入器取得它**。
元件注入器是 fixture 的 `DebugElement` 的一個屬性。

```ts
// UserAuthentication actually injected into the component
userAuth = fixture.debugElement.injector.get(UserAuthentication);
```

HELPFUL: 這_通常_沒有必要。服務經常在根層級提供，或由 TestBed 覆寫，而且可以更容易地以 `TestBed.inject()` 取得（見下文）。

### `TestBed.inject()`

比起使用 fixture 的 `DebugElement` 取得服務，這個方法更容易記住，也更簡潔。

在這個測試套件中，`UserAuthentication` 的_唯一_提供者是根測試模組，因此可以安全地如下呼叫 `TestBed.inject()`：

```ts
userAuth = TestBed.inject(UserAuthentication);
```

HELPFUL: 關於 `TestBed.inject()` 無法運作的使用情境，請參閱[覆寫元件的提供者](#override-component-providers)一節，該節說明了何時以及為何你必須改從元件的注入器取得服務。

### 最終設定與測試

以下是完整的 `beforeEach()`，使用 `TestBed.inject()`：

```ts
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // the TestBed injected service
let el: HTMLElement; // the DOM element with the welcome message

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // UserAuthentication from the root injector
  userAuth = TestBed.inject(UserAuthentication);

  //  get the "welcome" element by CSS selector (e.g., by class name)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

以下是一些測試：

```ts
it('should welcome the user', async () => {
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, '"Welcome ..."').toContain('Welcome');
  expect(content, 'expected name').toContain('Test User');
});

it('should welcome "Bubba"', async () => {
  userAuth.user.set({name: 'Bubba'}); // welcome message hasn't been shown yet
  await fixture.whenStable();

  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', async () => {
  userAuth.isLoggedIn.set(false); // welcome message hasn't been shown yet
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, 'not welcomed').not.toContain('Welcome');
  expect(content, '"log in"').toMatch(/log in/i);
});
```

第一個是健全性測試；它確認 `UserAuthentication` 有被呼叫且正常運作。

HELPFUL: `expect` 的第 2 個參數（例如 `'expected name'`）是選擇性的失敗標籤。
如果期望不成立，Vitest 會將這個標籤附加到期望失敗訊息中。
在包含多個期望的規格中，它能幫助釐清出了什麼問題，以及是哪個期望失敗。

其餘的測試則確認服務傳回不同值時元件的邏輯。
第二個測試驗證變更使用者名稱的效果。
第三個測試檢查在沒有已登入使用者時，元件是否顯示適當的訊息。

## 具有非同步服務的元件

在這個範例中，`About` 元件範本承載了一個 `Twain` 元件。
`Twain` 元件會顯示 Mark Twain 的名言。

```angular-html
<p class="twain">
  <i>{{ quote | async }}</i>
</p>
<button type="button" (click)="getQuote()">Next quote</button>
@if (errorMessage()) {
  <p class="error">{{ errorMessage() }}</p>
}
```

HELPFUL: 元件的 `quote` 屬性之值會通過一個 `AsyncPipe`。
這表示該屬性傳回的是 `Promise` 或 `Observable`。

在這個範例中，`TwainQuotes.getQuote()` 方法告訴你，`quote` 屬性傳回的是一個 `Observable`。

```ts
getQuote() {
  this.errorMessage.set('');
  this.quote = this.twainQuotes.getQuote().pipe(
    startWith('...'),
    catchError((err: any) => {
      this.errorMessage.set(err.message || err.toString());
      return of('...'); // reset message to placeholder
    }),
  );
}
```

`Twain` 元件從注入的 `TwainQuotes` 取得名言。
在服務能傳回第一句名言之前，元件先以一個佔位值（`'...'`）作為傳回的 `Observable` 的起始值。

`catchError` 會攔截服務錯誤、準備錯誤訊息，並在成功通道上傳回佔位值。

這些都是你會想測試的功能。

### 透過以 `HttpTestingController` 模擬 HTTP 請求進行測試

測試元件時，重要的應該只有服務的公開 API。
一般而言，測試本身不應該呼叫遠端伺服器。
它們應該模擬這類呼叫。

如果你的非同步服務依賴 `HttpClient` 來載入遠端資料，建議在 HTTP 層級以 `HttpTestingController` 傳回模擬回應。

關於模擬 `HttpBackend` 的更多細節，請參閱[專門的指南](guide/http/testing)。

### 透過提供服務的替身實作進行測試

當無法在 HTTP 層級模擬非同步請求時，另一個選擇是利用 spy。

這個 `app/twain/twain-quotes.spec.ts` 中的設定展示了其中一種做法：

```ts {header: "twain.spec.ts"}
class TwainQuotesStub implements TwainQuotes {
  private testQuote = 'Test Quote';

  getQuote() {
    return of(this.testQuote);
  }

  // ... Implement everything to conform to the API
}

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  fixture = TestBed.createComponent(Twain);
  component = fixture.componentInstance;
  await fixture.whenStable();
  quoteEl = fixture.nativeElement.querySelector('.twain');
});
```

請注意替身實作如何取代原始實作。

```ts
TestBed.configureTestingModule({
  providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
});
```

這個替身的設計方式，讓任何注入它的元件或服務都會收到替身實作。
這表示對 `getQuote` 的任何呼叫，都會收到一個帶有測試名言的 observable。

與真實的 `getQuote()` 方法不同，這個 spy 繞過了伺服器，傳回一個值可立即取得的同步 observable。

### 使用 Vitest 假計時器的非同步測試 {#async-test-with-a-vitest-fake-timers}

若要模擬像 `setTimeout` 或 `Promise` 這類非同步函式，你可以利用 Vitest 假計時器來控制它們觸發的時機。

```ts
it('should display error when TwainQuotes service fails', async () => {
  class TwainQuotesStub implements TwainQuotes {
    getQuote() {
      return defer(() => {
        return new Promise<string>((_, reject) => {
          setTimeout(() => reject('TwainService test failure'));
        });
      });
    }

    // ... Implement everything to conform to the API
  }

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  vi.useFakeTimers(); // setting up the fake timers
  const fixture = TestBed.createComponent(TwainComponent);

  // rendering isn't async, we need to flush
  await vi.runAllTimersAsync();

  await expect(fixture.nativeElement.querySelector('.error')!.textContent).toMatch(/test failure/);
  expect(fixture.nativeElement.querySelector('.twain')!.textContent).toBe('...');

  vi.useRealTimers(); // resets to regular async execution
});
```

### 更多非同步測試

在替身服務傳回非同步 observable 的情況下，你的大多數測試也必須是非同步的。

以下是一個展示你在真實世界中預期之資料流的測試。

```ts
class MockTwainQuotes implements TwainQuotes {
  private subject = new Subject<string>();

  getQuote() {
    return this.subject.asObservable();
  }

  emit(val: string) {
    this.subject.next(val);
  }
}

it('should show quote after getQuote (success)', async () => {
  vi.useFakeTimers();

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: MockTwainQuotes}],
  });

  const fixture = TestBed.createComponent(TwainComponent);
  const twainQuotes = TestBed.inject(TwainQuotes) as MockTwainQuotes;
  await vi.runAllTimersAsync(); // render before the quote is received

  const quoteEl = fixture.nativeElement.querySelector('.twain');
  expect(quoteEl.textContent).toBe('...');

  twainQuotes.emit('Twain Quote'); // emits the quote
  await vi.runAllTimersAsync(); // render with the quote received

  expect(quoteEl.textContent).toBe('Twain Quote');
  expect(fixture.nativeElement.querySelector('.error')).toBeNull();

  vi.useRealTimers();
});
```

請注意，名言元素在第一次渲染時顯示的是佔位值（`'...'`）。
第一句名言尚未送達。

接著你就可以斷言名言元素顯示預期的文字。

### 使用 `zone.js` 與 `fakeAsync` 的非同步測試

`fakeAsync` 輔助函式是另一種模擬時鐘，它依賴以 `zone.js` 修補非同步 API。過去它常在以 `zone.js` 為基礎的應用程式中用於測試。現在已不再建議使用 `fakeAsync`。

TIP: 請優先使用原生非同步測試策略，或其他像 Vitest 或 Jasmine 提供的假計時器（也稱為模擬時鐘）。

IMPORTANT: `fakeAsync` 需要 `zone.js`。若要搭配 Vitest 測試執行器使用它，請依 [Vitest 遷移指南](guide/testing/migrating-to-vitest#zonejs-vitest-patch)所述，加入 `zone.js/plugins/vitest-patch` polyfill。

## 具有輸入與輸出的元件

具有輸入與輸出的元件，通常出現在宿主元件的檢視範本內。
宿主使用屬性繫結來設定輸入屬性，並使用事件繫結來監聽輸出屬性引發的事件。

測試的目標是驗證這類繫結是否如預期運作。
測試應該設定輸入值，並監聽輸出事件。

`DashboardHero` 元件是處於這個角色的元件的一個小範例。
它會顯示由 `Dashboard` 元件提供的單一英雄。
點選該英雄會告訴 `Dashboard` 元件：使用者已選取該英雄。

`DashboardHero` 元件像這樣內嵌在 `Dashboard` 元件範本中：

```angular-html
@for (hero of heroes; track hero) {
  <dashboard-hero class="col-1-4" [hero]="hero" (selected)="gotoDetail($event)" />
}
```

`DashboardHero` 元件出現在一個 `@for` 區塊中，該區塊將每個元件的 `hero` 輸入屬性設為迴圈的值，並監聽元件的 `selected` 事件。

以下是元件的完整定義：

```angular-ts
@Component({
  selector: 'dashboard-hero',
  imports: [UpperCasePipe],
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero().name | uppercase }}
    </button>
  `,
})
export class DashboardHero {
  readonly hero = input.required<Hero>();
  readonly selected = output<Hero>();

  click() {
    this.selected.emit(this.hero());
  }
}
```

雖然測試這麼簡單的元件本身沒有多少價值，但知道怎麼做還是有用的。
請使用下列方法之一：

- 依它被 `Dashboard` 元件使用的方式來測試它
- 將它作為獨立元件來測試
- 依它被 `Dashboard` 元件的替代者使用的方式來測試它

眼前的目標是測試 `DashboardHero` 元件，而不是 `Dashboard` 元件，所以請試試第二與第三個選項。

### 以獨立方式測試 `DashboardHero` 元件

以下是規格檔案設定的核心部分。

```ts
let fixture: ComponentFixture<DashboardHero>;
let comp: DashboardHero;
let heroDe: DebugElement;
let heroEl: HTMLElement;
let expectedHero: Hero;

beforeEach(async () => {
  fixture = TestBed.createComponent(DashboardHero);
  comp = fixture.componentInstance;

  // find the hero's DebugElement and element
  heroDe = fixture.debugElement.query(By.css('.hero'));
  heroEl = heroDe.nativeElement;

  // mock the hero supplied by the parent component
  expectedHero = {id: 42, name: 'Test Name'};

  // simulate the parent setting the input property with that hero
  fixture.componentRef.setInput('hero', expectedHero);

  // wait for initial data binding
  await fixture.whenStable();
});
```

請注意，設定程式碼如何把一個測試英雄（`expectedHero`）指派給元件的 `hero` 屬性，模擬 `Dashboard` 在其重複器中使用屬性繫結設定它的方式。

下列測試驗證英雄名稱是否透過繫結傳遞到範本中。

```ts
it('should display hero name in uppercase', () => {
  const expectedPipedName = expectedHero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});
```

由於範本會讓英雄名稱通過 Angular `UpperCasePipe`，測試必須以轉成大寫的名稱來比對元素的值。

### 點選

點選英雄應該引發一個 `selected` 事件，讓宿主元件（推測是 `Dashboard`）能聽到：

```ts
it('should raise selected event when clicked (triggerEventHandler)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroDe.triggerEventHandler('click');
  expect(selectedHero).toBe(expectedHero);
});
```

元件的 `selected` 屬性是一個 `OutputEmitterRef`，它的 `subscribe` 方法會同步通知訂閱者。
測試_明確地_訂閱它，就像宿主元件_隱含地_做的那樣。

如果元件如預期運作，點選英雄的元素應該會讓元件的 `selected` 屬性發出 `hero` 物件。

測試透過它對 `selected` 的訂閱偵測到該事件。

### `triggerEventHandler`

上一個測試中的 `heroDe` 是一個 `DebugElement`，代表英雄的 `<button>`。

它具有 Angular 的屬性與方法，抽象化了與原生元素的互動。
這個測試以「click」事件名稱呼叫 `DebugElement.triggerEventHandler`。
「click」事件繫結會以呼叫 `DashboardHero.click()` 來回應。

Angular 的 `DebugElement.triggerEventHandler` 可以依_事件名稱_引發_任何資料繫結事件_。
第二個參數是傳給處理常式的事件物件。

這個測試觸發了一個「click」事件。

```ts
heroDe.triggerEventHandler('click');
```

在這個情況下，測試正確地假設執行期事件處理常式，也就是元件的 `click()` 方法，並不在意事件物件。

HELPFUL: 其他處理常式就沒這麼寬容了。
舉例來說，`RouterLink` 指令預期事件物件帶有一個 `button` 屬性，用來識別點選期間按下了哪個滑鼠按鈕（如果有的話）。
如果事件物件缺失，`RouterLink` 指令會擲出錯誤。

### 點選元素

下列替代測試呼叫原生元素自己的 `click()` 方法，這對_這個元件_來說完全沒問題。

```ts
it('should raise selected event when clicked (element.click)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroEl.click();
  expect(selectedHero).toBe(expectedHero);
});
```

### `click()` 輔助函式

點選按鈕、錨點或任意 HTML 元素，是常見的測試工作。

將_觸發點選_的過程封裝在像下列 `click()` 函式這樣的輔助函式中，讓這件事保持一致且簡單明瞭：

```ts
/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2},
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left,
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
```

第一個參數是_要點選的元素_。
如果你想的話，可以將自訂事件物件作為第二個參數傳入。
預設值是一個部分的[左鍵滑鼠事件物件](https://developer.mozilla.org/docs/Web/API/MouseEvent/button)，許多處理常式（包括 `RouterLink` 指令）都能接受它。

IMPORTANT: `click()` 輔助函式**不是** Angular 測試公用程式之一。
它是定義在_本指南範例程式碼_中的函式。
所有的範例測試都使用它。
如果你喜歡它，就將它加入你自己的輔助函式收藏中。

以下是上一個測試以點選輔助函式改寫後的版本。

```ts
it('should raise selected event when clicked (click helper with DebugElement)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  click(heroDe); // click helper with DebugElement

  expect(selectedHero).toBe(expectedHero);
});
```

## 位於測試宿主中的元件

前面的測試自己扮演了宿主 `Dashboard` 元件的角色。
但當 `DashboardHero` 元件正確地資料繫結到一個宿主元件時，它能正常運作嗎？

```angular-ts
@Component({
  imports: [DashboardHero],
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelected($event)" />`,
})
class TestHost {
  hero: Hero = {id: 42, name: 'Test Name'};
  selectedHero: Hero | undefined;

  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}
```

測試宿主以它的測試英雄設定元件的 `hero` 輸入屬性。
它以自己的 `onSelected` 處理常式繫結元件的 `selected` 事件，該處理常式會將發出的英雄記錄在它的 `selectedHero` 屬性中。

稍後，測試將能檢查 `selectedHero`，驗證 `DashboardHero.selected` 事件是否發出了預期的英雄。

`test-host` 測試的設定與獨立測試的設定類似：

```ts
beforeEach(async () => {
  // create TestHost instead of DashboardHero
  fixture = TestBed.createComponent(TestHost);
  testHost = fixture.componentInstance;
  heroEl = fixture.nativeElement.querySelector('.hero');

  await fixture.whenStable();
});
```

這個測試模組設定展示了兩個重要的差異：

- 它_建立_的是 `TestHost` 元件，而不是 `DashboardHero`
- `TestHost` 元件以繫結設定 `DashboardHero.hero`

`createComponent` 傳回的 `fixture` 持有的是 `TestHost` 的實例，而不是 `DashboardHero` 的實例。

建立 `TestHost` 的副作用是建立了一個 `DashboardHero`，因為後者出現在前者的範本中。
對英雄元素的查詢（`heroEl`）仍然能在測試 DOM 中找到它，儘管它在元素樹中的深度比之前更大。

這些測試本身與獨立版本幾乎完全相同：

```ts
it('should display hero name', () => {
  const expectedPipedName = testHost.hero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});

it('should raise selected event when clicked', () => {
  click(heroEl);
  // selected hero should be the same data bound hero
  expect(testHost.selectedHero).toBe(testHost.hero);
});
```

只有 selected 事件測試不同。
它確認所選的 `DashboardHero` 英雄確實透過事件繫結一路傳遞到宿主元件。

## 路由元件

_路由元件_ 是告訴 `Router` 導航到另一個元件的元件。
`Dashboard` 元件是一個_路由元件_，因為使用者可以點選儀表板上的某個_英雄按鈕_，導航到 `HeroDetail` 元件。

Angular 提供測試輔助工具，以減少樣板程式碼，並更有效地測試依賴 `HttpClient` 的程式碼。`provideRouter` 函式也可以直接用在測試模組中。

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{path: '**', component: Dashboard}]),
      provideHttpClientTesting(),
      HeroService,
    ],
  });
  harness = await RouterTestingHarness.create();
  comp = await harness.navigateByUrl('/', Dashboard);
  TestBed.inject(HttpTestingController).expectOne('api/heroes').flush(getTestHeroes());
});
```

下列測試點選顯示的英雄，並確認我們導航到預期的 URL。

```ts
it('should tell navigate when hero clicked', async () => {
  // get first <dashboard-hero> DebugElement
  const heroDe = harness.routeDebugElement!.query(By.css('dashboard-hero'));
  heroDe.triggerEventHandler('selected', comp.heroes[0]);

  // expecting to navigate to id of the component's first hero
  const id = comp.heroes[0].id;
  expect(TestBed.inject(Router).url, 'should nav to HeroDetail for first hero').toEqual(
    `/heroes/${id}`,
  );
});
```

## 路由目標元件

_路由目標元件_ 是 `Router` 導航的目的地。
它可能比較難測試，尤其是當通往該元件的路由_包含參數_時。
`HeroDetail` 是一個_路由目標元件_，是這類路由的目的地。

當使用者點選一個 _Dashboard_ 英雄時，`Dashboard` 會告訴 `Router` 導航到 `heroes/:id`。
`:id` 是一個路由參數，其值是要編輯之英雄的 `id`。

`Router` 將該 URL 比對到通往 `HeroDetail` 的路由。
它會建立一個帶有路由資訊的 `ActivatedRoute` 物件，並將它注入到 `HeroDetail` 的新實例中。

以下是注入到 `HeroDetail` 中的服務：

```ts
private heroDetailService = inject(HeroDetailService);
private route = inject(ActivatedRoute);
private router = inject(Router);
```

`HeroDetail` 元件需要 `id` 參數，才能使用 `HeroDetailService` 取得對應的英雄。
元件必須從 `ActivatedRoute.paramMap` 屬性取得 `id`，而該屬性是一個 `Observable`。

它不能只參照 `ActivatedRoute.paramMap` 的 `id` 屬性。
元件必須_訂閱_ `ActivatedRoute.paramMap` observable，並為 `id` 在它的生命週期中變更做好準備。

```ts
constructor() {
  // get hero when `id` param changes
  this.route.paramMap.subscribe((pmap) => this.getHero(pmap.get('id')));
}
```

測試可以透過導航到不同的路由，探索 `HeroDetail` 如何回應不同的 `id` 參數值。

## 巢狀元件測試 {#nested-component-tests}

元件範本經常有巢狀元件，而這些元件的範本可能又包含更多元件。

元件樹可能非常深，有時候巢狀元件在測試樹頂端元件時並不扮演任何角色。

舉例來說，`App` 元件會顯示一個導覽列，其中有錨點與它們的 `RouterLink` 指令。

```angular-html
<app-banner />
<app-welcome />

<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet />
```

若只要驗證連結而不驗證導航，你不需要 `Router` 進行導航，也不需要 `<router-outlet>` 來標示 `Router` 插入_路由目標元件_的位置。

`Banner` 與 `Welcome` 元件（由 `<app-banner>` 與 `<app-welcome>` 表示）同樣不相關。

然而，任何在 DOM 中建立 `App` 元件的測試，也會建立這三個元件的實例，而且如果你放任這件事發生，你就必須設定 `TestBed` 來建立它們。

如果你疏於宣告它們，Angular 編譯器將無法辨識 `App` 範本中的 `<app-banner>`、`<app-welcome>` 與 `<router-outlet>` 標籤，並會擲出錯誤。

如果你宣告的是真實元件，你還必須宣告_它們的_巢狀元件，並為樹中_任何_元件注入的_所有_服務做準備。

本節描述兩種將設定工作降到最低的技巧。
你可以單獨使用它們，或合併使用，讓自己專注於測試主要元件。

### 為不需要的元件建立替身

在第一種技巧中，你建立並宣告在測試中幾乎不扮演任何角色的元件與指令的替身版本。

```ts
@Component({selector: 'app-banner', template: ''})
class BannerStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'app-welcome', template: ''})
class WelcomeStub {}
```

替身的選擇器與對應真實元件的選擇器相符。
但它們的範本與類別是空的。

接著，使用 `TestBed.overrideComponent` 覆寫你元件的 `imports` 來宣告它們。

```ts
let comp: App;
let fixture: ComponentFixture<App>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [RouterLink, BannerStub, RouterOutletStub, WelcomeStub],
    },
  });

  fixture = TestBed.createComponent(App);
  comp = fixture.componentInstance;
});
```

HELPFUL: 這個範例中的 `set` 鍵會取代你元件上所有現有的 imports，請務必匯入所有相依性，不只是替身。或者，你可以使用 `remove`/`add` 鍵，選擇性地移除與加入 imports。

### `NO_ERRORS_SCHEMA`

在第二種方法中，將 `NO_ERRORS_SCHEMA` 加入你元件的中繼資料覆寫。

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [], // resets all imports
      schemas: [NO_ERRORS_SCHEMA],
    },
  });
});
```

`NO_ERRORS_SCHEMA` 告訴 Angular 編譯器忽略無法辨識的元素與屬性。

編譯器能辨識 `<app-root>` 元素與 `routerLink` 屬性，因為你在 `TestBed` 設定中宣告了對應的 `App` 元件與 `RouterLink`。

但當編譯器遇到 `<app-banner>`、`<app-welcome>` 或 `<router-outlet>` 時，它不會擲出錯誤。
它只是將它們渲染為空標籤，瀏覽器會忽略它們。

你不再需要替身元件了。

### 兩種技巧合併使用

這些是_淺層元件測試_的技巧，會如此命名，是因為它們將元件的視覺介面縮減到只剩範本中對測試重要的元素。

`NO_ERRORS_SCHEMA` 方法是兩者中較容易的一個，但不要過度使用它。

`NO_ERRORS_SCHEMA` 也會讓編譯器無法告訴你，你不慎遺漏或拼錯的元件與屬性。
你可能會浪費好幾個小時追查編譯器本可在一瞬間抓到的幽靈錯誤。

_替身元件_ 方法還有另一個優點。
雖然_這個_範例中的替身是空的，但如果你的測試需要以某種方式與它們互動，你可以給它們精簡過的範本與類別。

實務上，你會在同一個設定中合併這兩種技巧，如這個範例所示。

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    remove: {imports: [RouterOutlet, Welcome]},
    set: {schemas: [NO_ERRORS_SCHEMA]},
  });
});
```

Angular 編譯器為 `<app-banner>` 元素建立 `BannerStub`，並將 `RouterLink` 套用到帶有 `routerLink` 屬性的錨點上，但它會忽略 `<app-welcome>` 與 `<router-outlet>` 標籤。

### `By.directive` 與注入的指令

再多一點設定，就能觸發初始資料繫結，並取得導覽連結的參照：

```ts
beforeEach(async () => {
  await fixture.whenStable();

  // find DebugElements with an attached RouterLinkStubDirective
  linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));

  // get attached link directive instances
  // using each DebugElement's injector
  routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
});
```

有三個特別值得注意的點：

- 使用 `By.directive` 定位附有指令的錨點元素
- 查詢傳回包住相符元素的 `DebugElement` 包裝
- 每個 `DebugElement` 都暴露一個相依性注入器，帶有附加到該元素的指令之特定實例

要驗證的 `App` 元件連結如下：

```angular-html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>
```

以下是一些確認這些連結如預期接上 `routerLink` 指令的測試：

```ts
it('can get RouterLinks from template', () => {
  expect(routerLinks.length, 'should have 3 routerLinks').toBe(3);
  expect(routerLinks[0].href).toBe('/dashboard');
  expect(routerLinks[1].href).toBe('/heroes');
  expect(routerLinks[2].href).toBe('/about');
});

it('can click Heroes link in template', async () => {
  const heroesLinkDe = linkDes[1]; // heroes link DebugElement

  TestBed.inject(Router).resetConfig([{path: '**', children: []}]);
  heroesLinkDe.triggerEventHandler('click', {button: 0});

  await fixture.whenStable();

  expect(TestBed.inject(Router).url).toBe('/heroes');
});
```

## 使用 `page` 物件

`HeroDetail` 元件是一個簡單的檢視，帶有一個標題、兩個英雄欄位與兩個按鈕。

但即使是這麼簡單的表單，範本也有不少複雜度。

```angular-html
@if (hero) {
  <div>
    <h2>
      <span>{{ hero.name | titlecase }}</span> Details
    </h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="name">name: </label>
      <input id="name" [(ngModel)]="hero.name" placeholder="name" />
    </div>
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
}
```

操作這個元件的測試需要……

- 等到英雄送達後，元素才會出現在 DOM 中
- 取得標題文字的參照
- 取得名稱輸入框的參照，以檢查並設定它
- 取得兩個按鈕的參照，以便點選它們

即使是這樣的小表單，也可能產生一團混亂、充滿折磨人的條件式設定與 CSS 元素選取。

以一個 `Page` 類別馴服這份複雜度，它負責處理對元件屬性的存取，並封裝設定它們的邏輯。

以下是一個用於 `hero-detail.component.spec.ts` 的 `Page` 類別：

```ts
class Page {
  // getter properties wait to query the DOM until called.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  //// query helpers ////
  private query<T>(selector: string): T {
    return harness.routeNativeElement!.querySelector(selector)! as T;
  }

  private queryAll<T>(selector: string): T[] {
    return harness.routeNativeElement!.querySelectorAll(selector) as any as T[];
  }
}
```

現在，用於操作與檢查元件的重要掛鉤都整齊地組織起來，並可從 `Page` 的實例存取。

一個 `createComponent` 方法會建立一個 `page` 物件，並在 `hero` 送達後填補空白。

```ts
async function createComponent(id: number) {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${id}`, HeroDetail);
  page = new Page();

  const request = TestBed.inject(HttpTestingController).expectOne(`api/heroes/?id=${id}`);
  const hero = getTestHeroes().find((h) => h.id === Number(id));
  request.flush(hero ? [hero] : []);
  await harness.fixture.whenStable();
}
```

以下再列舉幾個 `HeroDetail` 元件測試來強化這個重點。

```ts
it("should display that hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(expectedHero.name);
});

it('should navigate when click cancel', () => {
  click(page.cancelBtn);
  expect(TestBed.inject(Router).url).toEqual(`/heroes/${expectedHero.id}`);
});

it('should save when click save but not navigate immediately', () => {
  click(page.saveBtn);
  expect(TestBed.inject(HttpTestingController).expectOne({method: 'PUT', url: 'api/heroes'}));
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should navigate when click save and save resolves', async () => {
  click(page.saveBtn);
  await harness.fixture.whenStable();
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should convert hero name to Title Case', async () => {
  // get the name's input and display elements from the DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## 覆寫元件的提供者 {#override-component-providers}

`HeroDetail` 提供它自己的 `HeroDetailService`。

```ts
@Component({
  /* ... */
  providers: [HeroDetailService],
})
export class HeroDetail {
  private heroDetailService = inject(HeroDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
}
```

在 `TestBed.configureTestingModule` 的 `providers` 中無法為元件的 `HeroDetailService` 建立替身。
那些是_測試模組_的提供者，不是元件的。
它們準備的是 _fixture 層級_的相依性注入器。

Angular 以它_自己的_注入器建立元件，而該注入器是 fixture 注入器的_子注入器_。
它向子注入器註冊元件的提供者（在這個例子中是 `HeroDetailService`）。

測試無法從 fixture 注入器取得子注入器的服務。
`TestBed.configureTestingModule` 也無法設定它們。

Angular 一直以來建立的都是真實 `HeroDetailService` 的新實例！

HELPFUL: 如果 `HeroDetailService` 自己向遠端伺服器發出 XHR 呼叫，這些測試可能會失敗或逾時。
可能根本沒有遠端伺服器可以呼叫。

所幸，`HeroDetailService` 將遠端資料存取的責任委派給注入的 `HeroService`。

```ts
@Service()
export class HeroDetailService {
  private heroService = inject(HeroService);
}
```

先前的測試設定將真實的 `HeroService` 換成 `TestHeroService`，由它攔截伺服器請求並偽造回應。

但如果你沒有這麼幸運呢？
如果偽造 `HeroService` 很困難呢？
如果 `HeroDetailService` 自己發出伺服器請求呢？

`TestBed.overrideComponent` 方法可以將元件的 `providers` 換成容易管理的_測試替身_，如以下設定變體所示：

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {path: 'heroes', component: HeroList},
        {path: 'heroes/:id', component: HeroDetail},
      ]),
      // HeroDetailService at this level is IRRELEVANT!
      {provide: HeroDetailService, useValue: {}},
    ],
  }).overrideComponent(HeroDetail, {
    set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
  });
});
```

請注意，`TestBed.configureTestingModule` 不再提供假的 `HeroService`，因為它[不需要了](#provide-a-spy-stub-herodetailservicespy)。

### `overrideComponent` 方法

請聚焦在 `overrideComponent` 方法上。

```ts
.overrideComponent(HeroDetail, {
  set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
});
```

它接受兩個參數：要覆寫的元件型別（`HeroDetail`）與一個覆寫中繼資料物件。
[覆寫中繼資料物件](/guide/testing/utility-apis#testbed-class-summary)是一個泛型，定義如下：

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

中繼資料覆寫物件可以在中繼資料屬性中加入與移除元素，或完全重設那些屬性。
這個範例重設了元件的 `providers` 中繼資料。

型別參數 `T` 是你會傳給 `@Component` 裝飾器的中繼資料種類：

```ts
selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…
```

### 提供 _spy 替身_（`HeroDetailServiceSpy`） {#provide-a-spy-stub-herodetailservicespy}

這個範例將元件的 `providers` 陣列完全換成一個新陣列，其中包含一個 `HeroDetailServiceSpy`。

`HeroDetailServiceSpy` 是真實 `HeroDetailService` 的替身版本，它偽造了該服務所有必要的功能。
它既不注入也不委派給較低層級的 `HeroService`，因此不需要為後者提供測試替身。

相關的 `HeroDetail` 元件測試會透過監控服務方法，來斷言 `HeroDetailService` 的方法有被呼叫。
因此，這個替身將它的方法實作為 spy：

```ts
import {vi} from 'vitest';

class HeroDetailServiceSpy {
  testHero: Hero = {...testHero};

  /* emit cloned test hero */
  getHero = vi.fn(() => asyncData({...this.testHero}));

  /* emit clone of test hero, with changes merged in */
  saveHero = vi.fn((hero: Hero) => asyncData(Object.assign(this.testHero, hero)));
}
```

### 覆寫測試

現在，測試可以直接操控替身的 `testHero` 來控制元件的英雄，並確認服務方法有被呼叫。

```ts
let hdsSpy: HeroDetailServiceSpy;

beforeEach(async () => {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${testHero.id}`, HeroDetail);
  page = new Page();
  // get the component's injected HeroDetailServiceSpy
  hdsSpy = harness.routeDebugElement!.injector.get(HeroDetailService) as any;

  harness.detectChanges();
});

it('should have called `getHero`', () => {
  expect(hdsSpy.getHero, 'getHero called once').toHaveBeenCalledTimes(1);
});

it("should display stub hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
});

it('should save stub hero change', async () => {
  const origName = hdsSpy.testHero.name;
  const newName = 'New Name';

  page.nameInput.value = newName;

  page.nameInput.dispatchEvent(new Event('input')); // tell Angular

  expect(component.hero.name, 'component hero has new name').toBe(newName);
  expect(hdsSpy.testHero.name, 'service hero unchanged before save').toBe(origName);

  click(page.saveBtn);
  expect(hdsSpy.saveHero, 'saveHero called once').toHaveBeenCalledTimes(1);

  await harness.fixture.whenStable();
  expect(hdsSpy.testHero.name, 'service hero has new name after save').toBe(newName);
  expect(TestBed.inject(Router).url).toEqual('/heroes');
});
```

### 更多覆寫

`TestBed.overrideComponent` 方法可以針對相同或不同的元件呼叫多次。
`TestBed` 也提供類似的 `overrideDirective`、`overrideModule` 與 `overridePipe` 方法，用來深入並取代這些其他類別的部分內容。

請自行探索這些選項與組合。
