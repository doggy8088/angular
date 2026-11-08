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

### `whenStable()`

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
import {Component, inject, OnInit, signal} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = signal(
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

### 取得注入的服務

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

HELPFUL: 關於 `TestBed.inject()` 無法運作的使用情境，請參閱 [_Override component providers_](#override-component-providers) 一節，該節說明了何時以及為何你必須改從元件的注入器取得服務。

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
