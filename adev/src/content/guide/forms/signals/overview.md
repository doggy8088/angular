<docs-decorative-header title="使用 Angular 訊號的表單" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

CRITICAL: Signal Forms 為[實驗性質](/reference/releases#experimental)功能。此 API 可能在未來版本中變更。在未充分了解風險之前，請避免在正式環境應用程式中使用實驗性 API。

Signal Forms 是一個實驗性函式庫，讓你能在 Angular 應用程式中管理表單狀態，並建立在訊號的反應式基礎之上。透過自動雙向繫結、型別安全的欄位存取，以及以結構定義為基礎的驗證，Signal Forms 能協助你建立穩健的表單。

TIP: 想快速認識 Signal Forms，請參閱 [Signal Forms 基礎指南](essentials/signal-forms)。

## 為什麼要用 Signal Forms？

在 Web 應用程式中建立表單，牽涉到好幾項彼此連動的工作：追蹤欄位值、驗證使用者輸入、處理錯誤狀態，以及讓 UI 與資料模型保持同步。若把這些工作分開管理，就會產生大量樣板程式碼與複雜度。

Signal Forms 透過以下方式解決這些挑戰：

- **自動同步狀態** - 自動將表單資料模型與繫結的表單欄位同步
- **提供型別安全** - 在 UI 控制項與資料模型之間，支援完全型別安全的結構定義與繫結
- **集中驗證邏輯** - 使用驗證結構定義，在單一位置定義所有驗證規則

Signal Forms 最適合用在以訊號打造的新應用程式。若你正在維護使用反應式表單的既有應用程式，或需要正式環境的穩定性保證，反應式表單仍然是可靠的選擇。

NOTE: 若你是從範本表單或反應式表單轉過來的，可能會對[比較指南](guide/forms/signals/comparison)有興趣。

## 前置需求

Signal Forms 需要：

- Angular v21 或更高版本

## 設定 {#setup}

Signal Forms 已內含在 `@angular/forms` 套件中。請從 `@angular/forms/signals` 匯入需要的函式與指令：

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

凡是將表單欄位繫結到 HTML 輸入元素的元件，都必須匯入 `FormField` 指令：

```ts
@Component({
  // ...
  imports: [FormField],
})
```

## 後續步驟

想進一步了解 Signal Forms 的運作方式，請參閱下列指南：

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="Signal forms 基礎" />
  <docs-pill href="guide/forms/signals/models" title="表單模型" />
  <docs-pill href="guide/forms/signals/model-design" title="設計你的表單模型" />
  <docs-pill href="guide/forms/signals/field-state-management" title="欄位狀態管理" />
  <docs-pill href="guide/forms/signals/validation" title="驗證" />
  <docs-pill href="guide/forms/signals/custom-controls" title="自訂控制項" />
  <docs-pill href="guide/forms/signals/comparison" title="與其他表單系統的比較" />
</docs-pill-row>
