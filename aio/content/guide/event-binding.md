# 事件繫結

事件繫結讓你可以監聽並回應使用者操作，例如按鍵、滑鼠移動、點選和觸控。

<div class="alert is-helpful">

請參閱 <live-example></live-example>，查看包含本指南程式碼片段的實際範例。

</div>

## 必要條件

* [元件基礎](guide/architecture-components)
* [範本基礎](guide/glossary#範本template)
* [繫結語法](guide/binding-syntax)
* [範本陳述式](guide/template-statements)

## 繫結到事件

要繫結到事件，你要使用 Angular 事件繫結語法。
這個語法由等號左邊括號內的目標事件名稱，以及右邊引號括起來的範本陳述式組成。

建立下列範例；目標事件名稱是 `click`，範本陳述式是 `onSave()`。

<code-example language="html" header="Event binding syntax">
&lt;button (click)="onSave()"&gt;Save&lt;/button&gt;
</code-example>

事件繫結會監聽按鈕的 click 事件，並在每次發生點選時呼叫元件的 `onSave()` 方法。

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="語法圖">
</div>

### 決定事件目標

要決定事件目標，Angular 會檢查目標事件的名稱，是否符合已知指令的事件屬性。

建立下列範例：（Angular 會檢查 `myClick` 是否為自訂 `ClickDirective` 上的事件）

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

如果目標事件名稱 `myClick` 不符合 `ClickDirective` 的輸出屬性，Angular 會改為繫結到底層 DOM 元素上的 `myClick` 事件。

## 繫結到被動事件

這是一項進階技術，大多數應用程式並不需要。如果你想要最佳化處理頻繁發生且造成效能問題的事件，你可能會覺得它很有用。

Angular 也支援被動事件監聽器。例如，使用下列步驟讓 scroll 事件變成被動。

1. 在 `src` 目錄下建立一個檔案 `zone-flags.ts`。
2. 在這個檔案中加入下列程式行。
   ```typescript
   (window as any)['__zone_symbol__PASSIVE_EVENTS'] = ['scroll'];
   ```
3. 在 `src/polyfills.ts` 檔案中，在匯入 zone.js 之前，匯入剛建立的 `zone-flags`。
   ```typescript
   import './zone-flags';
   import 'zone.js';  // Included with Angular CLI.
   ```

完成這些步驟後，如果你為 `scroll` 事件加入事件監聽器，這些監聽器就會是 `passive`。

## 繫結到鍵盤事件

你可以使用 Angular 的繫結語法繫結到鍵盤事件。你可以指定想繫結到鍵盤事件的按鍵（key）或代碼（code）。`key` 與 `code` 欄位是瀏覽器鍵盤事件物件的原生部分。依預設，事件繫結假設你想使用鍵盤事件的 `key` 欄位。你也可以使用 `code` 欄位。

按鍵組合可以用 `.`（句點）分隔。例如，`keydown.enter` 讓你可以將事件繫結到 `enter` 鍵。你也可以使用修飾鍵，例如 `shift`、`alt`、`control`，以及 Mac 的 `command` 鍵。下列範例示範如何將鍵盤事件繫結到 `keydown.shift.t`。

   ```typescript
   <input (keydown.shift.t)="onKeydown($event)" />
   ```

視作業系統而定，某些按鍵組合可能會產生特殊字元，而不是你預期的按鍵組合。例如，在 macOS 上同時使用 option 與 shift 鍵時，會產生特殊字元。如果你繫結到 `keydown.shift.alt.t`，在 macOS 上這個組合會產生 `ˇ` 字元而不是 `t`，不符合繫結，因此不會觸發你的事件處理常式。要在 macOS 上繫結到 `keydown.shift.alt.t`，請使用 `code` 鍵盤事件欄位來取得正確的行為，例如這個範例所示的 `keydown.code.shiftleft.altleft.keyt`。

   ```typescript
   <input (keydown.code.shiftleft.altleft.keyt)="onKeydown($event)" />
   ```

`code` 欄位比 `key` 欄位更精確。`key` 欄位永遠只回報 `shift`，而 `code` 欄位會指明 `leftshift` 或 `rightshift`。使用 `code` 欄位時，你可能需要加入個別的繫結，才能涵蓋所有你想要的行為。使用 `code` 欄位，可以避免處理作業系統特定的行為，例如 macOS 上的 `shift + option` 行為。

如需更多資訊，請造訪 [key](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) 與 [code](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values) 的完整參考，協助你建立事件字串。

## 後續步驟

* 如需進一步了解事件繫結的運作方式，請參閱[事件繫結如何運作](guide/event-binding-concepts)。
* [屬性繫結](guide/property-binding)
* [文字插值](guide/interpolation)
* [雙向繫結](guide/two-way-binding)

@reviewed 2022-05-10
