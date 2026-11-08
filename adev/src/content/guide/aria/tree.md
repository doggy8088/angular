# 樹狀結構

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" title="樹狀結構 ARIA 模式"/>
  <docs-pill href="/api/aria/tree/Tree" title="Tree API 參考文件"/>
</docs-pill-row>

## 概觀

樹狀結構用來顯示階層式資料，項目可以展開以顯示子項目，也可以收合將其隱藏。使用者以方向鍵導覽、展開與收合節點，並可視需要選取項目，用於導覽或資料選取等情境。

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
</docs-code-multifile>

## 使用方式

當使用者需要在巢狀結構中導覽時，樹狀結構很適合顯示階層式資料。

**適合使用樹狀結構的情況**：

- 建立檔案系統導覽
- 顯示資料夾與文件的階層
- 建立巢狀選單結構
- 顯示組織圖
- 瀏覽階層式資料
- 實作含有巢狀區段的網站導覽

**應避免使用樹狀結構的情況**：

- 顯示平面清單（請改用 [Listbox](guide/aria/listbox)）
- 顯示資料表（請改用 [Grid](guide/aria/grid)）
- 建立簡單的下拉選單（請改用 [Select](guide/aria/select)）
- 建立麵包屑導覽（請使用麵包屑模式）

## 功能特色

- **階層式導覽**：巢狀樹狀結構，具備展開與收合功能
- **選取模式**：單選或多選，可選擇明確選取或選取跟隨焦點的行為
- **選取跟隨焦點**：焦點變更時可選擇自動選取
- **鍵盤導覽**：方向鍵、Home、End，以及輸入即搜尋（type-ahead）
- **展開／收合**：以右／左方向鍵或 Enter 切換父節點
- **停用項目**：停用特定節點並管理焦點
- **焦點模式**：roving tabindex 或 activedescendant 焦點策略
- **RTL 支援**：支援由右至左語言的導覽

## 範例

### 導覽樹

當點選項目是觸發動作而非選取項目時，可將樹狀結構用於導覽。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

設定 `[nav]="true"` 即可啟用導覽模式。此模式會使用 `aria-current` 來表明目前頁面，而不是選取狀態。

### 單選

在使用者需要從樹狀結構中選擇一個項目的情境下，啟用單選。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

單選時保持 `[multi]="false"`（預設值）。使用者按下 Space 即可選取目前聚焦的項目。

### 多選

允許使用者從樹狀結構中選取多個項目。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

在樹狀結構上設定 `[multi]="true"`。使用者以 Space 逐一選取項目，或以 Shift＋方向鍵選取範圍。

### 選取跟隨焦點

當選取跟隨焦點時，目前聚焦的項目會自動被選取。這能簡化導覽情境下的互動。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

在樹狀結構上設定 `[selectionMode]="'follow'"`。當使用者以方向鍵導覽時，選取狀態會自動更新。

### 停用的樹狀項目

停用特定樹狀節點以防止互動，並可控制停用的項目是否能接收焦點。

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

當樹狀結構的 `[softDisabled]="true"` 時，停用的項目可以接收焦點，但無法被啟用或選取。當 `[softDisabled]="false"` 時，停用的項目會在鍵盤導覽時被略過。

## 測試

Angular Aria 提供元件測試工具（component harness）來測試樹狀元件。以下是在元件測試中使用這些測試工具的範例：

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TreeHarness} from '@angular/aria/tree/testing';
import {MyTreeComponent} from './my-tree'; // Your component

describe('MyTreeComponent', () => {
  let fixture: ComponentFixture<MyTreeComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyTreeComponent],
    });

    fixture = TestBed.createComponent(MyTreeComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should navigate and expand tree items', async () => {
    const tree = await loader.getHarness(TreeHarness);

    // Get top-level structure representation
    expect(await tree.getTreeStructure()).toEqual({
      children: [{text: 'public'}, {text: 'src'}, {text: 'package.json'}],
    });

    // Get all items (currently visible)
    const items = await tree.getItems();
    expect(items.length).toBe(3);

    // Expand the first item ('public')
    expect(await items[0].isExpanded()).toBe(false);
    await items[0].click();
    expect(await items[0].isExpanded()).toBe(true);

    // Verifying tree structure updates after expansion
    expect(await tree.getTreeStructure()).toEqual({
      children: [
        {
          text: 'public',
          children: [{text: 'index.html'}, {text: 'styles.css'}],
        },
        {text: 'src'},
        {text: 'package.json'},
      ],
    });
  });
});
```

## API 參考

如需詳細的 API 文件，請查看下列 API 參考：

- [`Tree`](/api/aria/tree/Tree)
- [`TreeItem`](/api/aria/tree/TreeItem)
- [`TreeItemGroup`](/api/aria/tree/TreeItemGroup)
