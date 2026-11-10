# 測試元件的基礎知識

元件與 Angular 應用程式的所有其他部分不同，它結合了 HTML 範本與 TypeScript 類別。
元件真正的是範本與類別_共同運作_。
若要妥善測試元件，你應該測試它們是否如預期般共同運作。

這類測試需要在瀏覽器 DOM 中建立元件的宿主元素（如同 Angular 所做的），並研究元件類別如何依照其範本所描述的方式與 DOM 互動。

Angular `TestBed` 促進了這類測試，你將在以下章節中看到。
但在許多情況下，_單獨測試元件類別_、不涉及 DOM，就能以直接、更明顯的方式驗證元件的大部分行為。

## 元件 DOM 測試

元件不只是它的類別而已。
元件會與 DOM 以及其他元件互動。
光靠類別無法告訴你元件是否能正確渲染、回應使用者輸入與手勢，或與其父元件和子元件整合。

- `Lightswitch.clicked()` 是否繫結到任何東西，讓使用者可以叫用它？
- `Lightswitch.message` 是否有顯示？
- 使用者是否真的能選取 `DashboardHero` 元件顯示的英雄？
- 英雄名稱是否如預期般顯示（例如大寫）？
- `Welcome` 元件的範本是否顯示了歡迎訊息？

對前面說明的簡單元件來說，這些問題可能不令人困擾。
但許多元件與其範本中所描述的 DOM 元素有複雜的互動，隨著元件狀態變更，HTML 會出現和消失。

若要回答這類問題，你必須建立與元件相關聯的 DOM 元素，必須檢查 DOM 以確認元件狀態在適當的時機正確顯示，並且必須模擬使用者與螢幕的互動，以判斷這些互動是否讓元件如預期般運作。

若要撰寫這類測試，你將使用 `TestBed` 的額外功能以及其他測試輔助工具。

### CLI 產生的測試

當你要求 CLI 產生新元件時，CLI 依預設會為你建立一個初始測試檔案。

例如，以下 CLI 指令會在 `app/banner` 資料夾中產生一個 `Banner` 元件（帶有內嵌範本與樣式）：

```shell
ng generate component banner --inline-template --inline-style
```

它也會為該元件產生一個初始測試檔案 `banner.spec.ts`，看起來像這樣：

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Banner} from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Banner],
    }).compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 減少設定

這個檔案中只有最後三行真正在測試元件，而且它們所做的只是斷言 Angular 可以建立該元件。

檔案的其餘部分都是樣板設定程式碼，預先為更進階的測試做準備——如果元件演變成實質的東西，這些測試_可能_會變得有必要。

你將在以下章節中了解這些進階測試功能。
目前，你可以大幅縮減這個測試檔案，使其大小更易於管理：

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

稍後你將呼叫 `TestBed.configureTestingModule()`，帶入匯入、提供者與更多宣告，以滿足你的測試需求。
選擇性的 `override` 方法可以進一步微調設定的各個面向。

NOTE: 只有在受測元件使用 `@defer` 區塊時，才需要 `TestBed.compileComponents`。

### `createComponent()`

設定好 `TestBed` 之後，你呼叫它的 `createComponent()` 方法。

```ts
const fixture = TestBed.createComponent(Banner);
```

`TestBed.createComponent()` 會建立 `Banner` 元件的一個執行個體，將對應的元素加入測試執行器 DOM，並回傳一個 [`ComponentFixture`](#componentfixture)。

IMPORTANT: 呼叫 `createComponent` 之後，不要重新設定 `TestBed`。

`createComponent` 方法會凍結目前的 `TestBed` 定義，使其無法再進行進一步設定。

你不能再呼叫任何 `TestBed` 設定方法，不能呼叫 `configureTestingModule()`，不能呼叫 `get()`，也不能呼叫任何 `override...` 方法。
如果你嘗試這麼做，`TestBed` 會擲出錯誤。

### `ComponentFixture` {#componentfixture}

[`ComponentFixture`](api/core/testing/ComponentFixture) 是一個測試工具，用於與建立的元件及其對應元素互動。

透過 fixture 存取元件執行個體，並用期望確認它存在：

```ts
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### `beforeEach()`

隨著這個元件演變，你將加入更多測試。
與其為每個測試重複 `TestBed` 設定，不如重構，將設定抽到 `beforeEach()` 與一些輔助變數中：

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // necessary to wait for the initial rendering
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

HELPFUL: 在 `beforeEach` 中以 `await fixture.whenStable` 等待初始渲染，可以讓個別測試保持同步。

現在加入一個測試，從 `fixture.nativeElement` 取得元件的元素，並尋找預期的文字。

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain('banner works!');
});
```

### 建立 `setup` 函式

作為 `beforeEach` 的替代方案，你也可以建立一個 setup 函式，在每個測試中呼叫它。
setup 函式的優點是它可以透過參數自訂。

以下是一個 setup 函式可能長什麼樣子的範例：

```ts
function setup(providers?: StaticProviders[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

### `nativeElement`

`ComponentFixture.nativeElement` 的值型別為 `any`。
稍後你會遇到 `DebugElement.nativeElement`，它的型別同樣是 `any`。

Angular 在編譯時期無法知道 `nativeElement` 是哪一種 HTML 元素，甚至不知道它是否為 HTML 元素。
應用程式可能正在_非瀏覽器平台_上執行，例如伺服器或 node 環境，在這些環境中，該元素可能擁有縮減的 API，甚至根本不存在。

本指南中的測試設計為在瀏覽器中執行，因此 `nativeElement` 值永遠都會是 `HTMLElement` 或其衍生類別之一。

知道它是某種 `HTMLElement` 之後，就可以使用標準的 HTML `querySelector` 深入元素樹。

以下另一個測試呼叫 `HTMLElement.querySelector` 來取得段落元素，並尋找橫幅文字：

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

### `DebugElement`

Angular _fixture_ 透過 `fixture.nativeElement` 直接提供元件的元素。

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

這實際上是一個便利方法，實作方式為 `fixture.debugElement.nativeElement`。

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

透過這條迂迴路徑取得元素，是有充分理由的。

`nativeElement` 的屬性取決於執行階段環境。
你可能正在_非瀏覽器_平台上執行這些測試，該平台沒有 DOM，或其 DOM 模擬不支援完整的 `HTMLElement` API。

Angular 仰賴 `DebugElement` 抽象層，才能在_所有受支援的平台_上安全運作。
Angular 不會建立 HTML 元素樹，而是建立 `DebugElement` 樹，包裝執行階段平台的_原生元素_。
`nativeElement` 屬性會解開 `DebugElement`，回傳平台專屬的元素物件。

由於本指南的範例測試設計為只在瀏覽器中執行，這些測試中的 `nativeElement` 永遠是 `HTMLElement`，你可以在測試中探索它熟悉的方法與屬性。

以下先前的測試以 `fixture.debugElement.nativeElement` 重新實作：

```ts
it('should find the <p> with fixture.debugElement.nativeElement', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

`DebugElement` 還有其他在測試中很有用的方法與屬性，你將在本指南的其他地方看到。

你從 Angular 核心函式庫匯入 `DebugElement` 符號。

```ts
import {DebugElement} from '@angular/core';
```

### `By.css()`

雖然本指南中的測試全都在瀏覽器中執行，但有些應用程式至少有一部分時間可能在不同平台上執行。

例如，元件可能先在伺服器上渲染，作為讓應用程式在連線不佳的裝置上更快啟動的策略的一部分。
伺服器端渲染器可能不支援完整的 HTML 元素 API。
如果它不支援 `querySelector`，前面的測試可能會失敗。

`DebugElement` 提供適用於所有受支援平台的查詢方法。
這些查詢方法接受一個_謂詞_函式，當 `DebugElement` 樹中的節點符合選取條件時，該函式回傳 `true`。

你借助從執行階段平台函式庫匯入的 `By` 類別，建立一個_謂詞_。
以下是瀏覽器平台的 `By` 匯入：

```ts
import {By} from '@angular/platform-browser';
```

以下範例以 `DebugElement.query()` 與瀏覽器的 `By.css` 方法重新實作先前的測試。

```ts
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

一些值得注意的觀察：

- `By.css()` 靜態方法會以[標準 CSS 選擇器](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors')選取 `DebugElement` 節點。
- 查詢會回傳段落的 `DebugElement`。
- 你必須解開該結果，才能取得段落元素。

當你以 CSS 選擇器篩選，並且只測試瀏覽器_原生元素_的屬性時，`By.css` 的方式可能有點過度。

使用標準的 `HTMLElement` 方法（例如 `querySelector()` 或 `querySelectorAll()`）來篩選，往往更直接、更清楚。
