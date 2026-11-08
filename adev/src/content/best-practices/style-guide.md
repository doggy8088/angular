# Angular 程式碼樣式指南

## 簡介

本指南涵蓋 Angular 應用程式程式碼的一系列樣式慣例。這些建議並不是 Angular 運作所必需的，而是建立一套程式碼實務，促進整個 Angular 生態系的一致性。一致的實務讓分享程式碼與在專案之間移動變得更容易。

本指南_不_涵蓋 TypeScript 或與 Angular 無關的一般程式碼實務。關於 TypeScript，請參閱 [Google 的 TypeScript 樣式指南](https://google.github.io/styleguide/tsguide.html)。

### 有疑慮時，以一致性為優先

只要你遇到這些規則與某個特定檔案的樣式相矛盾的情況，就優先維持該檔案內部的一致性。在單一檔案中混用不同的樣式慣例，造成的混亂會比偏離本指南的建議更大。

## 命名

### 檔案名稱中的單字以連字號分隔

檔案名稱中的單字以連字號（`-`）分隔。例如，名為 `UserProfile` 的元件，其檔案名稱是 `user-profile.ts`。

### 檔案的測試檔使用相同名稱，結尾加上 `.spec`

單元測試的檔案名稱以 `.spec.ts` 結尾。例如，`UserProfile` 元件的單元測試檔案名稱是 `user-profile.spec.ts`。

### 讓檔案名稱對應其中的 TypeScript 識別碼

檔案名稱通常應該描述檔案中程式碼的內容。當檔案包含 TypeScript 類別時，檔案名稱應該反映該類別名稱。例如，包含名為 `UserProfile` 元件的檔案，名稱是 `user-profile.ts`。

若檔案包含不止一個主要的、可命名的識別碼，請選一個能描述檔案中程式碼共同主題的名稱。若檔案中的程式碼不屬於某個共同主題或功能領域，請考慮把程式碼拆到不同檔案。避免使用過於籠統的檔案名稱，例如 `helpers.ts`、`utils.ts` 或 `common.ts`。

### 元件的 TypeScript、範本與樣式使用相同檔案名稱

元件通常由一個 TypeScript 檔案、一個範本檔案與一個樣式檔案組成。這些檔案應該共用相同名稱，只有副檔名不同。例如，`UserProfile` 元件可以有 `user-profile.ts`、`user-profile.html` 與 `user-profile.css` 這些檔案。

若元件有不止一個樣式檔案，請在名稱後加上額外的單字，描述該檔案特有的樣式。例如，`UserProfile` 可能有 `user-profile-settings.css` 與 `user-profile-subscription.css` 這兩個樣式檔案。

## 專案結構

### 應用程式的所有程式碼都放在名為 `src` 的目錄中

你的所有 Angular UI 程式碼（TypeScript、HTML 與樣式）都應該放在名為 `src` 的目錄裡。與 UI 無關的程式碼，例如設定檔或指令碼，應該放在 `src` 目錄之外。

這能讓不同 Angular 專案的根應用程式目錄保持一致，並在專案中清楚區隔 UI 程式碼與其他程式碼。

### 在 `src` 正下方的 `main.ts` 中啟動你的應用程式

啟動 Angular 應用程式的程式碼，也就是**啟動**（bootstrap），應該永遠放在名為 `main.ts` 的檔案中。這代表應用程式的主要進入點。

### 把密切相關的檔案放在同一個目錄中

Angular 元件由一個 TypeScript 檔案組成，另外可以選擇性地加上範本與一或多個樣式檔案。你應該把這些檔案放在同一個目錄中。

單元測試應該與被測程式碼放在同一個目錄。避免把不相關的測試收集到單一的 `tests` 目錄中。

### 依功能領域組織你的專案

請依應用程式的功能或目錄中程式碼的共同主題，把專案組織成子目錄。例如，電影院網站 MovieReel 的專案結構可能像這樣：

```
src/
├─ movie-reel/
│ ├─ show-times/
│ │ ├─ film-calendar/
│ │ ├─ film-details/
│ ├─ reserve-tickets/
│ │ ├─ payment-info/
│ │ ├─ purchase-confirmation/
```

避免依目錄中程式碼的類型來建立子目錄。例如，避免建立 `components`、`directives` 與 `services` 這類目錄。

避免把太多檔案放進同一個目錄，以至於變得難以閱讀或導覽。隨著目錄中的檔案數量增加，請考慮進一步拆成額外的子目錄。

### 一個檔案一個概念

讓原始檔案專注在單一_概念_上。具體對 Angular 類別而言，這通常意味著一個檔案放一個元件、指令或服務。不過，若你的類別相對小，而且作為單一概念的一部分彼此緊密相連，一個檔案包含不止一個元件或指令也沒關係。

有疑慮時，選擇能帶來更小檔案的做法。

## 依賴注入

### 優先使用 `inject` 函式，而非建構函式參數注入

請優先使用 [`inject`](/api/core/inject) 函式，而不是注入建構函式參數。[`inject`](/api/core/inject) 函式的運作方式與建構函式參數注入相同，但有幾個樣式上的優點：

- [`inject`](/api/core/inject) 通常更易讀，尤其當一個類別注入許多相依性時。
- 在語法上，為注入的相依性加上註解更直接。
- [`inject`](/api/core/inject) 提供更好的型別推斷。
- 當以 ES2022+ 為目標、搭配 [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields) 時，對於會讀取注入相依性的欄位，你可以避免把欄位宣告與初始化分開。

[你可以用自動化工具把既有程式碼重構為 `inject`](reference/migrations/inject-function)。

## 元件與指令

### 選擇元件選擇器

詳情請參閱[元件指南中關於選擇元件選擇器的說明](guide/components/selectors#choosing-a-selector)。

### 命名元件與指令的成員

詳情請參閱元件指南中關於[命名輸入屬性](guide/components/inputs#choosing-input-names)與[命名輸出屬性](guide/components/outputs#choosing-event-names)的說明。

### 選擇指令選擇器

指令應該使用與你的元件相同的[應用程式專屬前綴](guide/components/selectors#selector-prefixes)。

為指令使用屬性選擇器時，請使用 camelCase 屬性名稱。例如，若你的應用程式名為「MovieReel」，而你建立了一個為元素加上工具提示的指令，你可能會使用 `[mrTooltip]` 這個選擇器。

### 把 Angular 專屬屬性放在方法之前

元件與指令應該把 Angular 專屬屬性放在一起，通常靠近類別宣告的頂部。這包括注入的相依性、輸入、輸出與查詢。請先定義這些與其他屬性，再定義類別的方法。

這種實務讓人更容易找到類別的範本 API 與相依性。

### 讓元件與指令專注在呈現上

你的元件與指令內的程式碼，通常應該與頁面上顯示的 UI 有關。對於本身就有意義、與 UI 解耦的程式碼，請優先重構到其他檔案。例如，你可以把表單驗證規則或資料轉換抽成獨立的函式或類別。

### 避免在範本中放過於複雜的邏輯

Angular 範本的設計能容納[類似 JavaScript 的運算式](guide/templates/expression-syntax)。
你應該善用這些運算式，直接在範本運算式中擷取相對簡單的邏輯。

不過，當範本中的程式碼變得太複雜時，請把邏輯重構到 TypeScript 程式碼中（通常用 [computed](guide/signals#computed-signals)）。

並沒有單一絕對的規則能判定什麼構成「複雜」。請用你最好的判斷。

### 對只被元件範本使用的類別成員使用 `protected`

元件類別的公開成員，本質上定義了一個可透過依賴注入與[查詢](guide/components/queries)存取的公開 API。對於打算從元件範本讀取的任何成員，請優先使用 `protected` 存取層級。

```ts
@Component({
  ...,
  template: `<p>{{ fullName() }}</p>`,
})
export class UserProfile {
  firstName = input();
  lastName = input();

// `fullName` is not part of the component's public API, but is used in the template.
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### 對不應該變更的屬性使用 `readonly`

把由 Angular 初始化的元件與指令屬性標記為 `readonly`。這包括由 `input`、`model`、`output` 與查詢初始化的屬性。readonly 存取修飾詞能確保 Angular 設定的值不會被覆寫。

```ts
@Component(/* ... */)
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

對於使用裝飾器式 `@Input`、`@Output` 與查詢 API 的元件與指令，這項建議適用於輸出屬性與查詢，但不適用於輸入屬性。

```ts
@Component(/* ... */)
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### 優先使用 `class` 與 `style`，而非 `ngClass` 與 `ngStyle`

請優先使用 `class` 與 `style` 繫結，而不是使用 [`NgClass`](/api/common/NgClass) 與 [`NgStyle`](/api/common/NgStyle) 指令。

```html {prefer}
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
  <div [style.color]="textColor" [style.background-color]="backgroundColor">
    <!-- OR -->
    <div [class]="{admin: isAdmin, dense: density === 'high'}">
      <div [style]="{'color': textColor, 'background-color': backgroundColor}"></div>
    </div>
  </div>
</div>
```

```html {avoid}
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
  <div [ngStyle]="{'color': textColor, 'background-color': backgroundColor}"></div>
</div>
```

`class` 與 `style` 繫結都使用更直接的語法，與標準 HTML 屬性密切對齊。這讓你的範本更容易閱讀與理解，尤其對熟悉基本 HTML 的開發人員而言。

此外，相較於內建的 `class` 與 `style` 繫結語法，`NgClass` 與 `NgStyle` 指令會帶來額外的效能成本。

更多細節，請參閱[繫結指南](/guide/templates/binding#css-class-and-style-property-bindings)

### 依事件處理常式做的事來命名，而非觸發事件

請優先依事件處理常式執行的動作來命名，而不是依觸發事件來命名：

```html {prefer}
<button (click)="saveUserData()">Save</button>
```

```html {avoid}
<button (click)="handleClick()">Save</button>
```

使用這種有意義的名稱，讓人光看範本就能更容易看出事件在做什麼。

對於鍵盤事件，你可以搭配具體的處理常式名稱，使用 Angular 的鍵盤事件修飾詞：

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

有時候，事件處理邏輯特別長或複雜，使得宣告單一命名良好的處理常式不切實際。在這種情況下，退而使用像 'handleKeydown' 這樣的名稱，然後再依事件細節委派給更具體的行為，是可以的：

```ts
@Component(/* ... */)
class RichText {
  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'B') {
        this.activateBold();
      } else if (event.key === 'I') {
        this.activateItalic();
      }
      // ...
    }
  }
}
```

### 讓生命週期方法保持簡單

避免在 `ngOnInit` 之類的生命週期鉤子裡放冗長或複雜的邏輯。反之，請優先建立命名良好的方法來容納那些邏輯，然後_在你的生命週期鉤子中呼叫那些方法_。
生命週期鉤子的名稱描述的是它們_何時_執行，意味著裡面的程式碼沒有一個有意義的名稱能描述它在做什麼。

```ts {prefer}
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}
```

```ts {avoid}
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...and all the rest of the code that would be unrolled from these methods.
}
```

### 使用生命週期鉤子介面

Angular 為每個生命週期方法提供一個 TypeScript 介面。當你為類別加上生命週期鉤子時，請匯入並 `implement` 這些介面，以確保方法命名正確。

```ts
import {Component, OnInit} from '@angular/core';

@Component(/* ... */)
export class UserProfile implements OnInit {
  // The `OnInit` interface ensures this method is named correctly.
  ngOnInit() {
    /* ... */
  }
}
```
