# 元件樣式

TIP: 本指南假設你已讀過[基礎指南](essentials)。如果你是 Angular 新手，請先讀該指南。

元件可以選擇性地包含套用到該元件 DOM 的 CSS 樣式：

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border-radius: 50%;
    }
  `,
})
export class ProfilePhoto {}
```

你也可以選擇將樣式寫在獨立的檔案中：

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto {}
```

當 Angular 編譯你的元件時，這些樣式會隨該元件的 JavaScript 輸出一併產生。這表示元件樣式會參與 JavaScript 模組系統。當你渲染 Angular 元件時，框架會自動包含其關聯的樣式，即使是延遲載入的元件也一樣。

Angular 可搭配任何輸出 CSS 的工具，包括 [Sass](https://sass-lang.com)、[Less](https://lesscss.org) 與 [Stylus](https://stylus-lang.com)。

## 樣式作用域 {#style-scoping}

每個元件都有一個**檢視封裝**設定，決定框架如何界定元件樣式的作用域。共有四種檢視封裝模式：`Emulated`、`ShadowDom`、`ExperimentalIsolatedShadowDom` 與 `None`。你可以在 `@Component` 裝飾器中指定模式：

```angular-ts {highlight:[3]}
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
```

### ViewEncapsulation.Emulated

依預設，Angular 使用模擬封裝，讓元件的樣式只套用到在該元件範本中定義的元素。在此模式下，框架會為每個元件實例產生一個唯一的 HTML 屬性，將該屬性加到元件範本中的元素上，並將該屬性插入你在元件樣式中定義的 CSS 選擇器中。

這種模式可確保元件的樣式不會外洩而影響其他元件。然而，在元件之外定義的全域樣式，仍可能影響採用模擬封裝之元件內的元素。

在模擬模式下，Angular 支援 [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host) 偽類別。雖然 [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) 偽類別在現代瀏覽器中已被棄用，Angular 的編譯器仍完整支援它。這兩個偽類別都可以在不依賴原生 [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM) 的情況下使用。在編譯期間，框架會將這些偽類別轉換為屬性，因此在執行時期並不遵循這些原生偽類別的規則（例如瀏覽器相容性、特異性）。Angular 的模擬封裝模式不支援任何其他與 Shadow DOM 相關的偽類別，例如 `::shadow` 或 `::part`。

#### `::ng-deep`

Angular 的模擬封裝模式支援一個自訂偽類別 `::ng-deep`。**Angular 團隊強烈不建議新程式碼使用 `::ng-deep`**。這些 API 僅為向後相容而保留。

當選擇器包含 `::ng-deep` 時，Angular 會在選擇器的該位置之後，停止套用檢視封裝邊界。選擇器中位於 `::ng-deep` 之後的任何部分，都可以比對到元件範本之外的元素。

例如：

- 像 `p a` 這樣的 CSS 規則選擇器，在模擬封裝下，會比對到作為 `<p>` 元素後代的 `<a>` 元素，兩者都位於元件自身的範本內。

- 像 `::ng-deep p a` 這樣的選擇器，會比對到應用程式中任何位置、作為應用程式中任何 `<p>` 元素後代的 `<a>` 元素。

  這實際上讓它表現得像全域樣式。

- 在 `p ::ng-deep a` 中，Angular 要求 `<p>` 元素必須來自元件自身的範本，但 `<a>` 元素可以位於應用程式中的任何位置。

  因此，實際上，`<a>` 元素可能位於元件的範本中，或其任何投射內容或子內容中。

- 使用 `:host ::ng-deep p a` 時，`<a>` 與 `<p>` 元素都必須是元件 host 元素的後代。

  它們可以來自元件的範本或其子元件的檢視，但不能來自應用程式中的其他位置。

### ViewEncapsulation.ShadowDom

此模式透過使用 [Web 標準的 Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)，將樣式的作用域限定在元件內。啟用此模式時，Angular 會將一個 shadow root 附加到元件的 host 元素上，並將元件的範本與樣式渲染至對應的 shadow tree 中。

shadow tree 內的樣式無法影響該 shadow tree 之外的元素。

然而，啟用 `ShadowDom` 封裝的影響不只是樣式作用域。將元件渲染在 shadow tree 中，會影響事件傳播、與 [`<slot>` API](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots) 的互動，以及瀏覽器開發者工具顯示元素的方式。在你的應用程式中啟用此選項之前，請務必充分了解使用 Shadow DOM 的完整影響。

### ViewEncapsulation.ExperimentalIsolatedShadowDom

行為與上述相同，但此模式嚴格保證_只有_該元件的樣式會套用到元件範本中的元素。全域樣式無法影響 shadow tree 中的元素，shadow tree 內的樣式也無法影響該 shadow tree 之外的元素。

### ViewEncapsulation.None

此模式會停用元件的所有樣式封裝。與元件關聯的任何樣式都會表現得像全域樣式。

NOTE: 在 `Emulated` 與 `ShadowDom` 模式下，Angular 並不 100% 保證你的元件樣式永遠會覆寫來自外部的樣式。在發生衝突時，會假設這些樣式與你的元件樣式具有相同的特異性。

## 在範本中定義樣式 {#defining-styles-in-templates}

你可以在元件的範本中使用 `<style>` 元素來定義額外的樣式。元件的檢視封裝模式會套用到以這種方式定義的樣式。

Angular 不支援在 style 元素內使用繫結。

## 參照外部樣式檔案 {#referencing-external-style-files}

元件範本可以使用 [`<link>` 元素](https://developer.mozilla.org/docs/Web/HTML/Element/link) 來參照 CSS 檔案。此外，你的 CSS 可以使用 [`@import` at-rule](https://developer.mozilla.org/docs/Web/CSS/@import) 來參照 CSS 檔案。Angular 將這些參照視為_外部_樣式。外部樣式不受模擬檢視封裝的影響。

## 為 CSS 自訂屬性加上命名空間

Angular 可以為你的元件樣式所宣告與讀取的 CSS 自訂屬性（也稱為 CSS 變數）加上前綴。自訂屬性會沿著 DOM 樹向下繼承，因此當你應用程式之外的某個東西在祖先元素上定義了如 `--primary-color` 這樣的自訂屬性時，你的元件會讀到該值。當你的應用程式與另一個應用程式、或你無法控制的標記共用同一個頁面時，這一點就很重要。在你要求之前，Angular 不會為自訂屬性加上命名空間，而擁有自己頁面的應用程式不需要命名空間。

若要將你元件樣式中自訂屬性的作用域限定在你的應用程式，請將 [`provideCssVarNamespacing`](api/platform-browser/provideCssVarNamespacing) 加到應用程式的 providers 中。它會使用應用程式的 [`APP_ID`](api/core/APP_ID) 作為命名空間：

```ts {header: "app.config.ts"}
import {APP_ID, ApplicationConfig} from '@angular/core';
import {provideCssVarNamespacing} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [{provide: APP_ID, useValue: 'my-app'}, provideCssVarNamespacing()],
};
```

Angular 會為你元件樣式中的自訂屬性加上該命名空間，後面接著一個底線，因此 `--primary-color` 會變成 `--my-app_primary-color`。這個前綴會套用到宣告、`var()` 參照、`@property` 規則，以及像 `[style.--primary-color]` 這樣的樣式繫結，包括元件在其 `host` 物件中宣告的樣式繫結。

除非你另行設定，`APP_ID` 的值為 `ng`，因此請為頁面上的每個應用程式指定各自的 `APP_ID`。否則，這些應用程式會共用同一個前綴，再次發生衝突。若要使用與應用程式 id 不同的命名空間，請將它傳給 `provideCssVarNamespacing`。Angular 會自行附加底線：`provideCssVarNamespacing('my-app_')` 會產生 `--my-app__primary-color`。

Angular 會為它編譯進元件的樣式加上命名空間：元件的 `styles` 與 `styleUrl`、你在範本的 [`<style>` 元素](#defining-styles-in-templates) 中撰寫的樣式、其範本以相對路徑 `<link rel="stylesheet">` 參照的樣式表，以及使用 `ViewEncapsulation.None` 之元件的樣式。Angular 不會為瀏覽器在執行時期載入的樣式表加上命名空間，例如你的建置設定所列出的全域樣式表，或你的建置未內嵌的[外部樣式](#referencing-external-style-files)。

命名空間會套用到 Angular 所編譯的每個元件，包括你所安裝之程式庫的元件。當程式庫的樣式讀取由全域樣式表定義的自訂屬性（例如佈景主題的屬性）時，該參照就不再相符，瀏覽器會使用 `var()` 的備援值（如果有的話），否則使用[該屬性的繼承值或初始值](https://www.w3.org/TR/css-variables-1/#invalid-variables)，而且不會有任何錯誤回報。在為現有應用程式啟用命名空間之前，請先檢視在你的全域樣式表與元件之間跨越使用的自訂屬性。

IMPORTANT: Angular 只會在其所編譯的樣式與繫結中重寫自訂屬性名稱。其他所有地方都保留你所寫的名稱，而且不會回報不一致的情況。

Angular 不會在以下地方重寫名稱：

- 靜態 style 屬性，例如 `style="--primary-color: red"`，包括元件 `host` 物件中的 `style` 項目。
- 物件與字串樣式繫結，例如 `[style]="{'--primary-color': color}"`、`[style]="'--primary-color: red'"` 與 `ngStyle`，包括元件 `host` 物件中的 `[style]` 項目。
- 繫結值內部的自訂屬性名稱，例如 `[style.border-color]="'var(--primary-color)'"`。
- 對 `Renderer2.setStyle` 的呼叫。

這些都會產生一個你的已命名空間樣式不再讀取的屬性。請自行為這些名稱加上命名空間，方法如[在 TypeScript 中使用已命名空間的屬性](#using-namespaced-properties-in-typescript)所述。

### 退出命名空間處理

若要宣告或讀取 Angular 不會加上命名空間的自訂屬性，例如在全域樣式表中定義的屬性，請在其名稱前加上 `--global--`。Angular 會移除 `--global`，並保留其後的 `--` 與名稱的其餘部分不變：

```css
:host {
  /* Declares --accent-color and reads --brand-color, not --my-app_brand-color. */
  --global--accent-color: navy;
  color: var(--global--brand-color);
}
```

在 `global` 之後要寫兩個連字號。單一個連字號，例如 `--global-brand-color`，並不會退出命名空間處理，Angular 會像處理任何其他名稱一樣為該名稱加上命名空間。請避免使用以 `--global-` 開頭、其後不是第二個連字號的名稱；未來的重大版本預計會在建置時拒絕這類名稱。Angular 會在每個應用程式中移除 `--global`，包括從未設定命名空間的應用程式。

### 在 TypeScript 中使用已命名空間的屬性 {#using-namespaced-properties-in-typescript}

優先使用像 `[style.--primary-color]` 這樣的樣式繫結，Angular 會為你加上命名空間。當你改透過 DOM API 操作時，請將你在樣式中所寫的名稱（包括開頭的 `--`）傳給 [`CssVarNamespacer`](api/platform-browser/CssVarNamespacer)：

```angular-ts {header: "profile-photo.ts"}
import {Component, ElementRef, inject} from '@angular/core';
import {CssVarNamespacer} from '@angular/platform-browser';

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border: 2px solid var(--primary-color);
    }
  `,
})
export class ProfilePhoto {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly cssVarNamespacer = inject(CssVarNamespacer);

  setPrimaryColor(color: string): void {
    this.host.style.setProperty(this.cssVarNamespacer.namespace('--primary-color'), color);
  }
}
```

對於你以 `--global--` 宣告的屬性，請使用其純名稱，因為 Angular 永遠不會為它們加上命名空間。對於其他所有屬性，當應用程式未設定命名空間時，`namespace` 會原封不動地傳回該名稱，因此程式庫可以為其自身樣式所宣告的自訂屬性呼叫它。
