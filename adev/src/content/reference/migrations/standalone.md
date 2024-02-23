# 將現有的 Angular 專案遷移至獨立

**獨立元件**提供一種簡化的方式來建構 Angular 應用程式。獨立元件、指令和管道旨在減少對 `NgModule` 的需求，從而簡化撰寫體驗。現有應用程式可以選擇性地逐步採用新的獨立樣式，而不會造成任何重大變更。

<docs-video src="https://www.youtube.com/embed/x5PZwb4XurU" title="Getting started with standalone components"/>

從 15.2.0 版本開始，Angular 提供了一個 [schematic](tools/cli/schematics) 來幫助專案作者將現有專案轉換為獨立的 API。該 schematic 旨在盡可能自動轉換程式碼，但可能需要專案作者手動修復一些程式碼。使用以下指令執行 schematic：

<docs-code language="shell">

ng generate @angular/core:standalone

</docs-code>

## 更新前

在使用原理圖前，請確保專案：

1. 使用 Angular 15.2.0 或更新版本。
2. 編譯時沒有任何錯誤。
3. 在乾淨的 Git 分支上，並且已儲存所有工作。

## Schematic 選項

| 選項              | 詳細資訊                                                    |
|:---                 |:---                                                        |
| `mode`              | 要執行的轉換。請參閱下方的 [遷移模式](#migration-modes) 以取得可用選項的詳細資訊。 |
| `path`              | 要遷移的路徑，相對於專案根目錄。您可以使用這個選項逐步遷移專案的部分內容。 |

## 遷移步驟

html
<ul>
  <li>Create a new table called users with the following columns:</li>
  <ul>
    <li>id (primary key)</li>
    <li>username (unique)</li>
    <li>password</li>
  </ul>
  <li>Insert some data into the users table:</li>
  <ul>
    <li>INSERT INTO users (username, password) VALUES ('admin', 'password')</li>
    <li>INSERT INTO users (username, password) VALUES ('user1', 'password')</li>
  </ul>
  <li>Create a new table called posts with the following columns:</li>
  <ul>
    <li>id (primary key)</li>
    <li>title</li>
    <li>body</li>
    <li>author_id (foreign key referencing the id column in the users table)</li>
  </ul>
  <li>Insert some data into the posts table:</li>
  <ul>
    <li>INSERT INTO posts (title, body, author_id) VALUES ('My first post', 'This is my first post.', 1)</li>
    <li>INSERT INTO posts (title, body, author_id) VALUES ('My second post', 'This is my second post.', 2)</li>
  </ul>
</ul>

遷移過程由三個步驟組成。您必須多次執行它並手動檢查專案建置和行為是否如預期。

注意：儘管該示意圖可以自動更新大部分程式碼，但有些極端情況需要開發人員介入。
您應該計劃在遷移的每個步驟後套用手動修復。此外，該示意圖產生的新程式碼可能與您的程式碼格式規則不符。

以列出的順序執行遷移，並在每個步驟之間驗證您的程式碼是否建置並執行：

1. 執行 `ng g @angular/core:standalone` 並選擇「將所有元件、指令和管線轉換為獨立」
2. 執行 `ng g @angular/core:standalone` 並選擇「移除不必要的 NgModule 類別」
3. 執行 `ng g @angular/core:standalone` 並選擇「使用獨立 API 引導專案」
4. 執行任何 linting 和格式檢查，修正所有失敗，並提交結果

## 遷移後

恭喜，您的應用程式已轉換成獨立應用程式 🎉。以下是一些您現在可能想要採取的選用後續步驟：

* 找出並移除任何剩餘的 `NgModule` 宣告：由於「移除不必要的 NgModules」步驟無法自動移除所有模組，您可能必須手動移除剩餘的宣告。
* 執行專案的單元測試並修正任何失敗。
* 執行任何程式碼格式化器，如果專案使用自動格式化。
* 在您的專案中執行任何 linter 並修正新的警告。有些 linter 支援 `--fix` 旗標，可自動解決部分警告。

## 遷移模式

遷移有以下模式：

1. 將宣告轉換為獨立。
2. 移除不必要的 NgModules。
3. 切換到獨立的引導 API。
您應該按給定的順序執行這些遷移。

### 將宣告轉換為獨立項目

html
<div class="my-component">
  <span>Hello world</span>
  <span>Goodbye world</span>
</div>


css
.my-component {
  display: flex;
  flex-direction: column;
}


scss
.my-component {
  display: flex;
  flex-direction: column;
}

.my-component span {
  margin: 0 10px;
}


less
.my-component {
  display: flex;
  flex-direction: column;
}

.my-component span {
  margin: 0 10px;
}


stylus
.my-component
  display flex
  flex-direction column

.my-component span
  margin 0 10px

在此模式中，遷移會透過設定 `standalone: true` 並將依賴項新增到其 `imports` 陣列，將所有元件、指令和管道轉換為獨立。

HELPFUL: 此範例忽略在這個步驟中引導元件的 NgModules，因為它們很可能是 `bootstrapModule` 使用的根模組，而不是與獨立相容的 `bootstrapApplication`。範例會在 [「切換到獨立引導 API」](#switch-to-standalone-bootstrapping-api) 步驟中自動轉換這些宣告。

**之前：**

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

**之後：**

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

### 移掉不必要的 NgModules

在將所有宣告轉換為獨立之後，可以安全地移除許多 NgModules。此步驟會刪除此類模組宣告以及盡可能多的對應參考。如果遷移無法自動刪除參考，它會留下以下 TODO 註解，以便您可以手動刪除 NgModule：

```typescript
/* TODO(standalone-migration): clean up removed NgModule reference manually */
```

遷移會視模組是否符合以下條件，來決定該模組是否安全可移除：

* 沒有任何 `declarations`。
* 沒有任何 `providers`。
* 沒有任何 `bootstrap` 元件。
* 沒有任何參考 `ModuleWithProviders` 符號或無法移除的模組的 `imports`。
* 沒有任何類別成員。空建構函式會被忽略。

**之前：**

```typescript
// importer.module.ts
@NgModule({
  imports: [FooComponent, BarPipe],
  exports: [FooComponent, BarPipe]
})
export class ImporterModule {}
```

**之後：**

```typescript
// importer.module.ts
// Does not exist!
```

### 轉換到獨立的 bootstrapping API

這個步驟會將任何 `bootstrapModule` 的用法轉換為新的、基於獨立的 `bootstrapApplication`。它也會將根元件切換為 `standalone: true` 並刪除根 NgModule。如果根模組有任何 `providers` 或 `imports`，遷移會嘗試將此組態盡可能多地複製到新的 bootstrap 呼叫。

**之前：**

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

**之後：**

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

一些可能會導致原理圖無法正常運作的常見問題包括：

* 編譯錯誤 - 如果專案有編譯錯誤，Angular 無法正確分析並進行遷移。
* 未包含在 tsconfig 中的檔案 - 該指令會透過分析專案的 `tsconfig.json` 檔案來決定要遷移哪些檔案。指令會排除未被 tsconfig 擷取的任何檔案。
* 無法進行靜態分析的程式碼 - 該指令會使用靜態分析來了解程式碼，並決定在何處進行變更。遷移可能會略過任何在建置時無法進行靜態分析的具有元資料的類別。

## 限制

由於遷移的大小和複雜性，有部分情況是示意圖無法處理的：

* 由於單元測試並非提前 (AoT) 編譯，在單元測試中新增至元件的 `imports` 可能並不完全正確。
* 此綱要依賴直接呼叫 Angular API。此綱要無法辨識 Angular API 周圍的客製化包裝器。例如，如果在那裡定義包裝 `TestBed.configureTestingModule` 的客製化 `customConfigureTestModule` 函式，它所宣告的元件可能無法被辨識。
