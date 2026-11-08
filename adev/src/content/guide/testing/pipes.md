# 測試管道

你可以不使用 Angular 測試工具，直接測試[管道](guide/templates/pipes)。

## 測試 `TitleCasePipe`

管道類別有一個方法 `transform`，負責將輸入值處理成轉換後的輸出值。
`transform` 的實作很少與 DOM 互動。
大多數管道除了 `@Pipe` 中繼資料與一個介面之外，不相依於 Angular 的其他部分。

以一個將每個單字第一個字母大寫的 `TitleCasePipe` 為例。
以下是以正規表示式實作的版本。

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Transform to Title Case: uppercase the first letter of the words in a string. */
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ''
      : input.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
  }
}
```

任何使用正規表示式的程式碼都值得徹底測試。你可以使用標準的單元測試技巧，探索預期情境與邊界情境。

```ts
describe('TitleCasePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new TitleCasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... more tests ...
});
```

## 撰寫 DOM 測試來支援管道測試

這些是_獨立_測試管道的測試。
它們無法判斷 `TitleCasePipe` 套用到應用程式元件時是否正常運作。

可以考慮加入像這樣的元件測試：

```ts
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
