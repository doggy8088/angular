# Accordion

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Accordion ARIA 模式"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Accordion API 參考"/>
</docs-pill-row>

## 概觀

手風琴可以把相關內容整理成可展開與可收合的區段，減少頁面捲動，並幫助使用者專注在相關資訊上。每個區段都有一個觸發按鈕和一個內容面板。點選觸發按鈕，就會切換其對應面板的顯示狀態。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## 用法

當內容要整理成邏輯群組、而使用者通常一次只需要檢視一個區段時，手風琴就很好用。

**適合使用手風琴的情況**：

- 顯示包含多個問題與答案的常見問題集
- 把冗長的表單整理成容易處理的區段
- 減少內容密集頁面的捲動
- 漸進式揭露相關資訊

**避免使用手風琴的情況**：

- 建立導覽選單（請改用 [Menu](guide/aria/menu) 元件）
- 建立分頁介面（請改用 [Tabs](guide/aria/tabs) 元件）
- 只顯示單一個可收合的區段（請改用揭露模式）
- 使用者需要同時看到多個區段（請考慮改用其他版面配置）

## 功能

- **展開模式**：控制同時間可以開啟一個還是多個面板
- **鍵盤導覽**：使用方向鍵、Home 與 End 在觸發按鈕之間移動
- **延遲渲染**：內容只在面板展開時才建立，提升初始載入效能
- **停用狀態**：停用整個群組或個別的觸發按鈕
- **焦點管理**：控制已停用的項目是否能接收鍵盤焦點
- **程式化控制**：從元件程式碼展開、收合或切換面板
- **RTL 支援**：自動支援由右至左的語言

## 範例

### 單一展開模式

把 `[multiExpandable]="false"` 設好之後，同時間只允許開啟一個面板。開啟新面板時，會自動關閉先前開啟的任何面板。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

這種模式很適合常見問題集，或是希望使用者一次專注在一個答案上的情境。

### 多重展開模式

把 `[multiExpandable]="true"` 設好之後，可以同時開啟多個面板。使用者可以視需要展開任意數量的面板，不必關閉其他面板。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

這種模式適合用在表單區段，或是使用者需要在多個面板之間比較內容的時候。

NOTE: `multiExpandable` 輸入的預設值為 `true`。如果你想要單一展開的行為，請明確把它設為 `false`。

### 停用手風琴項目

使用 `disabled` 輸入停用特定的觸發按鈕。使用手風琴群組上的 `softDisabled` 輸入，控制已停用項目在鍵盤導覽時的行為。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

當 `[softDisabled]="true"` 時（預設行為），已停用的項目可以接收焦點，但無法被啟用。當 `[softDisabled]="false"` 時，已停用的項目在鍵盤導覽時會被完全跳過。

### 延遲內容渲染

在 `ng-template` 上使用 `ngAccordionContent` 指令，把內容的渲染延後到面板展開時才進行。對於包含圖片、圖表或複雜元件等大量內容的手風琴，這可以提升效能。

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger [panel]="panel1">Trigger Text</button>
    <div ngAccordionPanel #panel1="ngAccordionPanel">
      <ng-template ngAccordionContent>
        <!-- This content only renders when the panel opens -->
        <img src="large-image.jpg" alt="Description" />
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

依預設，面板收合時，內容會從 DOM 中移除。把 `[preserveContent]="true"` 設好可以保留內容，例如面板裡有影片、不希望它在收合時重置的時候。

## 測試

Angular Aria 提供元件 harness，可用來測試手風琴元件。
以下範例示範如何在元件測試中使用這些 harness：

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {AccordionGroupHarness} from '@angular/aria/accordion/testing';
import {MyAccordionComponent} from './my-accordion'; // Your component

describe('MyAccordionComponent', () => {
  let fixture: ComponentFixture<MyAccordionComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAccordionComponent],
    });

    fixture = TestBed.createComponent(MyAccordionComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow expanding panels', async () => {
    // Load the accordion group harness
    const group = await loader.getHarness(AccordionGroupHarness);

    // Get all individual accordions (items) in the group
    const accordions = await group.getAccordions();
    expect(accordions.length).toBe(3);

    // Verify initial state (first expanded, others collapsed)
    expect(await accordions[0].isExpanded()).toBe(true);
    expect(await accordions[1].isExpanded()).toBe(false);

    // Expand the second panel
    await accordions[1].expand();

    // Verify updated state
    expect(await accordions[1].isExpanded()).toBe(true);
    // If multiExpandable is false, the first one should now be collapsed
    expect(await accordions[0].isExpanded()).toBe(false);
  });
});
```

## API 參考

如需詳細的 API 文件，請查看下列 API 參考：

- [`AccordionGroup`](/api/aria/accordion/AccordionGroup)
- [`AccordionTrigger`](/api/aria/accordion/AccordionTrigger)
- [`AccordionPanel`](/api/aria/accordion/AccordionPanel)
- [`AccordionContent`](/api/aria/accordion/AccordionContent)
