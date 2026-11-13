# 將現有的 Angular 專案遷移到獨立模式

自 15.2.0 版起，Angular 提供一個[原理圖](guide/schematics)，協助專案作者把現有專案轉換為[新的獨立 API](guide/standalone-components)。該原理圖的目標是盡可能自動轉換程式碼，但可能需要專案作者進行一些手動修正。請使用下列命令執行原理圖：

<code-example format="shell" language="shell">

ng generate @angular/core:standalone

</code-example>

## 先備知識

使用這支原理圖之前，請確認專案符合以下條件：
1. 使用 Angular 15.2.0 或更新的版本。
2. 建置時沒有任何編譯錯誤。
3. 位於乾淨的 Git 分支，且所有工作都已儲存。

## 原理圖選項

| 選項 | 說明 |
|:---                 |:---                                                        |
| `mode` | 要執行的轉換。可用選項的詳情請參閱下方的[遷移模式](#遷移模式)。 |
| `path` | 要遷移的路徑，相對於專案根目錄。你可以利用這個選項，逐步遷移專案的各個部分。 |

## 遷移步驟

遷移流程由三個步驟組成。你需要多次執行它，並手動檢查專案是否能正確建置且行為符合預期。

<div class="callout is-helpful">

<header>注意</header>

雖然原理圖可以自動更新大部分程式碼，但有些邊緣情況需要開發者介入。
你應該計畫在遷移的每個步驟之後套用手動修正。此外，原理圖產生的新程式碼可能不符合你的程式碼格式規則。

</div>

請依照下列順序執行遷移，並在每個步驟之間驗證你的程式碼能正確建置與執行：
1. 執行 `ng g @angular/core:standalone` 並選取 "Convert all components, directives and pipes to standalone"
2. 執行 `ng g @angular/core:standalone` 並選取 "Remove unnecessary NgModule classes"
3. 執行 `ng g @angular/core:standalone` 並選取 "Bootstrap the project using standalone APIs"
4. 執行所有程式碼檢查（lint）與格式檢查，修正所有失敗項目，並提交結果

## 遷移之後

恭喜，你的應用程式已經轉換為獨立模式 🎉。以下是一些你現在可以考慮進行的選用後續步驟：
* 尋找並移除任何殘留的 `NgModule` 宣告：由於[「移除不必要的 NgModules」步驟](#移除不必要的-ngmodules)無法自動移除所有模組，你可能需要手動移除其餘的宣告。
* 執行專案的單元測試並修正所有失敗項目。
* 如果專案使用自動格式化，執行所有程式碼格式化工具。
* 執行專案中的所有程式碼檢查工具並修正新增的警告。有些檢查工具支援 `--fix` 旗標，可以自動解決部分警告。

## 遷移模式
這項遷移有以下模式：
1. 將宣告轉換為獨立模式。
2. 移除不必要的 NgModules。
3. 切換到獨立模式的啟動 API。
你應依照給定的順序執行這些遷移。

### 將宣告轉換為獨立模式

在此模式下，遷移會設定 `standalone: true`，並將相依性加入元件、指令與管道的 `imports` 陣列，把它們全部轉換為獨立模式。

<div class="callout is-helpful">

原理圖在這個步驟中會忽略啟動元件的 NgModule，因為它們可能是由 `bootstrapModule` 使用的根模組，而非與獨立模式相容的 `bootstrapApplication`。原理圖會在[「切換到獨立啟動 API」](#切換到獨立模式的啟動-api)步驟中，自動轉換這些宣告。

</div>

**修改前**：
```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule],
  declarations: [GreeterComponent],
  exports: [GreeterComponent]
})
export class SharedModule {}
```

```typescript
// greeter.component.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
})
export class GreeterComponent {
  showGreeting = true;
}
```

**修改後**：
```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule, GreeterComponent],
  exports: [GreeterComponent]
})
export class SharedModule {}
```

```typescript
// greeter.component.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  standalone: true,
  imports: [NgIf]
})
export class GreeterComponent {
  showGreeting = true;
}
```

### 移除不必要的 NgModules
將所有宣告轉換為獨立模式之後，許多 NgModules 都可以安全地移除。這個步驟會刪除這類模組宣告，並盡可能刪除對應的參照。如果遷移無法自動刪除某個參照，會留下下列 TODO 註解，讓你可以手動刪除該 NgModule：
```typescript
/* TODO(standalone-migration): clean up removed NgModule reference manually */
```

遷移會在模組符合下列條件時，認定它可以安全移除：
* 沒有 `declarations`。
* 沒有 `providers`。
* 沒有 `bootstrap` 元件。
* 沒有參照 `imports` 符號或無法移除之模組的 `ModuleWithProviders`。
* 沒有類別成員。空的建構函式會被忽略。

**修改前**：
```typescript
// importer.module.ts
@NgModule({
  imports: [FooComponent, BarPipe],
  exports: [FooComponent, BarPipe]
})
export class ImporterModule {}
```

**修改後**：
```typescript
// importer.module.ts
// Does not exist!
```

### 切換到獨立模式的啟動 API
這個步驟會將所有 `bootstrapModule` 的用法轉換為新的、基於獨立模式的 `bootstrapApplication`。它也會將根元件切換為 `standalone: true`，並刪除根 NgModule。如果根模組有任何 `providers` 或 `imports`，遷移會嘗試將盡可能多的這類設定複製到新的啟動呼叫中。

**修改前**：
```typescript
// ./app/app.module.ts
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// ./app/app.component.ts
@Component({ selector: 'app', template: 'hello' })
export class AppComponent {}
```

```typescript
// ./main.ts
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
```

**修改後**：
```typescript
// ./app/app.module.ts
// Does not exist!
```

```typescript
// ./app/app.component.ts
@Component({ selector: 'app', template: 'hello', standalone: true })
export class AppComponent {}
```

```typescript
// ./main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(e => console.error(e));
```

## 常見問題
以下常見問題可能會妨礙原理圖正確運作：
* 編譯錯誤：如果專案有編譯錯誤，Angular 就無法正確分析並遷移它。
* 未包含在 tsconfig 中的檔案：原理圖會分析專案的 `tsconfig.json` 檔案，來決定要遷移哪些檔案。任何未被 tsconfig 涵蓋的檔案都會被原理圖排除。
* 無法靜態分析的程式碼：原理圖使用靜態分析來理解你的程式碼，並決定要在哪些地方進行變更。對於中繼資料無法在建置時靜態分析的類別，遷移可能會略過它們。

## 限制
由於這項遷移的規模與複雜度，有些情況是原理圖無法處理的：
* 因為單元測試不是預先（AoT）編譯的，加入到單元測試中元件的 `imports` 可能不完全正確。
* 原理圖依賴對 Angular API 的直接呼叫。原理圖無法辨識 Angular API 的自訂包裝函式。例如，如果你定義了一個包裝 `customConfigureTestModule` 的自訂 `TestBed.configureTestingModule` 函式，它宣告的元件可能無法被辨識。

@reviewed 2023-02-15
