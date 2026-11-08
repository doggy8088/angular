# 測試屬性指令

_屬性指令_會修改元素、元件或其他指令的行為。
它的名稱反映了指令的套用方式：作為宿主元素上的一個屬性。

## 測試 `Highlight` 指令

範例應用程式的 `Highlight` 指令會根據資料繫結的顏色或預設顏色（lightgray），設定元素的背景顏色。
它也會將元素的自訂屬性（`customProperty`）設定為 `true`，理由僅僅是為了展示它可以這麼做。

```ts
import {Directive, inject, input} from '@angular/core';

/**
 * Set backgroundColor for the attached element to highlight color
 * and set the element's customProperty attribute to true
 */
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'bgColor() || defaultColor',
  },
})
export class Highlight {
  readonly defaultColor = 'rgb(211, 211, 211)'; // lightgray

  readonly bgColor = input('', {alias: 'highlight'});
}
```

它在整個應用程式中都有使用，或許最簡單的用法是在 `About` 元件中：

```ts
@Component({
  imports: [Twain, Highlight],
  template: `
    <h2 highlight="skyblue">About</h2>
    <h3>Quote of the day:</h3>
    <twain-quote />
  `,
})
export class About {}
```

在 `About` 元件中測試 `Highlight` 指令的特定用法，只需要[元件測試情境](guide/testing/components-scenarios)中[「巢狀元件測試」](guide/testing/components-scenarios#nested-component-tests)一節所探討的技巧。

```ts
let fixture: ComponentFixture<About>;

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [TwainService, UserService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  fixture = TestBed.createComponent(About);
  await fixture.whenStable();
});

it('should have skyblue <h2>', () => {
  const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
  const bgColor = h2.style.backgroundColor;
  expect(bgColor).toBe('skyblue');
});
```

不過，只測試單一使用案例，不太可能探索到指令能力的完整範圍。
找出並測試所有使用該指令的元件既繁瑣又脆弱，而且同樣不太可能提供完整覆蓋率。

_僅類別測試_可能有幫助，但像這樣的屬性指令往往會操作 DOM。
隔離的單元測試不會觸及 DOM，因此無法讓人對指令是否真的有效產生信心。

更好的解決方案是建立一個人造的測試元件，展示套用該指令的所有方式。

```angular-ts
@Component({
  imports: [Highlight],
  template: `
    <h2 highlight="yellow">Something Yellow</h2>
    <h2 highlight>The Default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [highlight]="box.value" value="cyan" />
  `,
})
class Test {}
```

<img alt="Highlight 指令規格運作畫面" src="assets/images/guide/testing/highlight-directive-spec.png">

HELPFUL: `<input>` 案例將 `Highlight` 繫結到輸入框中顏色值的名稱。
初始值是 "cyan" 這個字，應該會成為輸入框的背景顏色。

以下是這個元件的一些測試：

```ts
let fixture: ComponentFixture<Test>;
let des: DebugElement[]; // the three elements w/ the directive

beforeEach(async () => {
  fixture = TestBed.createComponent(Test);
  await fixture.whenStable();

  // all elements with an attached Highlight
  des = fixture.debugElement.queryAll(By.directive(Highlight));
});

// color tests
it('should have three highlighted elements', () => {
  expect(des.length).toBe(3);
});

it('should color 1st <h2> background "yellow"', () => {
  const bgColor = des[0].nativeElement.style.backgroundColor;
  expect(bgColor).toBe('yellow');
});

it('should color 2nd <h2> background w/ default color', () => {
  const dir = des[1].injector.get(Highlight);
  const bgColor = des[1].nativeElement.style.backgroundColor;
  expect(bgColor).toBe(dir.defaultColor);
});

it('should bind <input> background to value color', async () => {
  // easier to work with nativeElement
  const input = des[2].nativeElement as HTMLInputElement;
  expect(input.style.backgroundColor, 'initial backgroundColor').toBe('cyan');

  input.value = 'green';

  // Dispatch a DOM event so that Angular responds to the input value change.
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();

  expect(input.style.backgroundColor, 'changed backgroundColor').toBe('green');
});

it('bare <h2> should not have a backgroundColor', () => {
  // the h2 without the Highlight directive
  const bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));

  expect(bareH2.styles.backgroundColor).toBeUndefined();
});
```

有幾個技巧值得注意：

- 當元素型別未知時，`By.directive` 謂詞是取得帶有此指令之元素的絕佳方式
- `By.css('h2:not([highlight])')` 中的 [`:not` 虛擬類別](https://developer.mozilla.org/docs/Web/CSS/:not)有助於找出_沒有_該指令的 `<h2>` 元素。
  `By.css('*:not([highlight])')` 會找出_任何_沒有該指令的元素。

- 即使沒有真正的瀏覽器，`DebugElement.styles` 也能透過 `DebugElement` 抽象層存取元素樣式。
  但當 `nativeElement` 看起來比抽象層更容易或更清楚時，也請自由利用它。

- Angular 會將指令加入它所套用元素的注入器中。
  預設顏色的測試使用第二個 `<h2>` 的注入器，取得它的 `Highlight` 執行個體與其 `defaultColor`。

- `DebugElement.properties` 可以存取由指令設定的人造自訂屬性

## 隔離測試指令

你可以用 `TestBed.createDirective()` 單獨建立一個指令，它會回傳 `DirectiveFixture`。或者，你也可以透過元件的範本來渲染它。
`Highlight` 指令可以用這種方式測試，使用本地測試元件的輸入來控制該指令。

```ts
@Component({
  imports: [Highlight],
  template: `<p [highlight]="color()">{{ color() }}</p>`,
})
class Test {
  readonly color = input('');
}

describe('Highlight', () => {
  let fixture: ComponentFixture<Test>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Test);
    await fixture.whenStable();
  });

  it('should use the specified color once an input is provided', async () => {
    fixture.componentRef.setInput('color', 'blue');
    await fixture.whenStable();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.style.backgroundColor).toBe('blue');
  });
});
```
