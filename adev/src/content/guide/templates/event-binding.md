# 事件繫結

事件繫結讓您可以傾聽並回應使用者的動作，例如按鍵、滑鼠移動、點擊和觸控。

## 事件繫結

html
<div id="my-element" onclick="alert('Hello world!')">Click me!</div>

有用的：有關繫結至屬性的資訊，請參閱 [屬性繫結](guide/templates/property-binding)。

若要綁定至事件，請使用 Angular 事件綁定語法。
此語法包含等號左方括弧中的目標事件名稱，以及右方引號中的範本語句。

建立以下範例；目標事件名稱為 `click`，範本陳述式為 `onSave()`。

<docs-code language="html" header="Event binding syntax">
&lt;button (click)="onSave()"&gt;Save&lt;/button&gt;
</docs-code>

事件繫結會偵聽按鈕的點擊事件，並在點擊發生時呼叫元件的 `onSave()` 方法。

<img src='assets/content/images/guide/template-syntax/syntax-diagram.svg' alt="語法圖">

### 確定事件目標

要確定事件目標，Angular 會檢查目標事件的名稱是否符合已知指令的事件屬性。

建立以下範例：(Angular 檢查 `myClick` 是否是自訂 `ClickDirective` 上的事件)

<docs-code path="adev/src/content/examples/event-binding/src/app/app.component.html" visibleRegion="custom-directive" header="src/app/app.component.html"/>

如果目標事件名稱 `myClick` 無法與 `ClickDirective` 的輸出屬性相符，Angular 將會改成綁定基礎 DOM 元素上的 `myClick` 事件。

## 鍵盤事件繫結

您可以使用 Angular 的繫結語法來繫結至鍵盤事件。您可以指定您想要繫結至鍵盤事件的鍵或程式碼。`key` 和 `code` 欄位是瀏覽器鍵盤事件物件的原生部份。預設情況下，事件繫結假設您想要在鍵盤事件上使用 `key` 欄位。您也可以使用 `code` 欄位。

鍵的組合可以使用 `.`（句點）分隔。例如，`keydown.enter` 允許您將事件繫結到 `enter` 鍵。您也可以使用修飾鍵，例如 `shift`、`alt`、`control` 和 Mac 的 `command` 鍵。以下範例顯示如何將鍵盤事件繫結到 `keydown.shift.t`。

```html
   <input (keydown.shift.t)="onKeydown($event)" />
   ```

視作業系統而定，某些鍵盤組合可能會產生特殊字元，而非您預期的鍵盤組合。例如，MacOS 在您同時使用 option 和 shift 鍵時會產生特殊字元。如果您在 macOS 上繫結到 `keydown.shift.alt.t`，則該組合會產生 `ˇ` 字元，而非 `t`，這與繫結不符，也不會觸發您的事件處理常式。若要在 macOS 上繫結到 `keydown.shift.alt.t`，請使用 `code` 鍵盤事件欄位以取得正確的行為，例如本範例中所示的 `keydown.code.shiftleft.altleft.keyt`。

```html
   <input (keydown.code.shiftleft.altleft.keyt)="onKeydown($event)" />
   ```

`code` 欄位比 `key` 欄位更具體。`key` 欄位總是回報 `shift`，而 `code` 欄位會指定 `leftshift` 或 `rightshift`。使用 `code` 欄位時，您可能需要加入獨立的繫結來捕捉所有您要的行為。使用 `code` 欄位可以避免處理作業系統特定的行為，例如 macOS 上的 `shift + option` 行為。

如需更多資訊，請參閱 [key](https://developer.mozilla.org/zh-TW/docs/Web/API/UI_Events/Keyboard_event_key_values) 和 [code](https://developer.mozilla.org/zh-TW/docs/Web/API/UI_Events/Keyboard_event_code_values) 的完整參考，以協助建立您的事件字串。

## 被動事件的繫結

Angular 也支援 [passive event](https://developer.chrome.com/en/docs/lighthouse/best-practices/uses-passive-event-listeners/) 監聽器。

這項進階技巧對大多數應用程式而言並非必要。如果您需要最佳化造成效能問題的頻繁發生事件的處理方式，您可能會覺得這項技巧很有用。

例如，請使用下列步驟讓捲動事件被動。

1. 在 `src` 目錄下建立 `zone-flags.ts` 檔案。
2. 將以下程式碼加入此檔案中。

   typescript
   (window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];
   3. 在 `src/polyfills.ts` 檔案中，在匯入 zone.js 之前，匯入新建立的 `zone-flags`。

   typescript
   import './zone-flags';
   import 'zone.js';  // Included with Angular CLI.

在這些步驟之後，如果您為 `scroll` 事件新增事件監聽器，監聽器將會是 `passive`。

## 接下來

<docs-pill-row>
  <docs-pill href="guide/templates/event-binding" title="事件繫結如何運作"/>
  <docs-pill href="guide/templates/property-binding" title="屬性繫結"/>
  <docs-pill href="guide/templates/interpolation" title="文字內插"/>
  <docs-pill href="guide/templates/two-way-binding" title="雙向繫結"/>
</docs-pill-row>

