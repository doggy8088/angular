# 使用 Karma 與 Jasmine 進行測試

雖然 [Vitest](https://vitest.dev) 是新 Angular 專案的預設測試執行器，[Karma](https://karma-runner.github.io) 仍是受支援且廣泛使用的測試執行器。本指南說明如何使用 Karma 測試執行器搭配 [Jasmine](https://jasmine.github.io) 測試框架來測試你的 Angular 應用程式。

## 設定 Karma 與 Jasmine

你可以為新專案設定 Karma 與 Jasmine，或將它們加入現有專案。

### 新專案

若要建立已預先設定好 Karma 與 Jasmine 的新專案，請以 `--test-runner=karma` 選項執行 `ng new` 指令：

```shell
ng new my-karma-app --test-runner=karma
```

### 現有專案

若要將 Karma 與 Jasmine 加入現有專案，請依照下列步驟操作：

1.  **安裝必要的套件**：

    <docs-code-multifile>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="bun" language="shell">
        bun add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **在 `angular.json` 中設定測試執行器**：

    在你的 `angular.json` 檔案中，找到 `test` 目標，並將 `runner` 選項設為 `karma`：

    ```json
    {
      // ...
      "projects": {
        "your-project-name": {
          // ...
          "architect": {
            "test": {
              "builder": "@angular/build:unit-test",
              "options": {
                "runner": "karma"
                // ... other options
              }
            }
          }
        }
      }
    }
    ```

3.  **為 Jasmine 型別更新 `tsconfig.spec.json`**：

    為了確保 TypeScript 能辨識 `describe` 與 `it` 等全域測試函式，請在你的 `tsconfig.spec.json` 的 `types` 陣列中加入 `"jasmine"`：

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": ["jasmine"]
      }
      // ...
    }
    ```

## 執行測試

專案設定完成後，使用 [`ng test`](cli/test) 指令執行測試：

```shell
ng test
```

`ng test` 指令會以監看模式建置應用程式，並啟動 [Karma 測試執行器](https://karma-runner.github.io)。

主控台輸出如下所示：

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

測試輸出會透過 [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter) 顯示在瀏覽器中。

<img alt="瀏覽器中的 Jasmine HTML Reporter" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

點選某個測試列可以只重新執行該測試，點選某個描述則可以重新執行所選測試群組（「test suite」）中的測試。

與此同時，`ng test` 指令會持續監看變更。若要實際體驗，對原始碼檔案做一處小修改並儲存即可。測試會再次執行、瀏覽器會重新整理，新的測試結果隨即出現。

## 設定

Angular CLI 會替你處理 Jasmine 與 Karma 的設定。它會依據 `angular.json` 檔案中指定的選項，在記憶體中建構完整的設定。

### 自訂 Karma 設定

如果你想自訂 Karma，可以執行下列指令來建立 `karma.conf.js`：

```shell
ng generate config karma
```

HELPFUL: 進一步了解 Karma 設定，請參閱 [Karma 設定指南](https://karma-runner.github.io/6.4/config/configuration-file.html)。

### 在 `angular.json` 中設定測試執行器

若要明確地將 Karma 設為專案的測試執行器，請在你的 `angular.json` 檔案中找到 `test` 目標，並將 `runner` 選項設為 `karma`：

```json
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runner": "karma"
            // ... other options
          }
        }
      }
    }
  }
}
```

## 程式碼覆蓋率強制要求

若要強制執行最低程式碼覆蓋率，你可以在你的 `karma.conf.js` 檔案的 `coverageReporter` 區段中使用 `check` 屬性。

例如，若要要求最低 80% 的覆蓋率：

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

如果未達到指定的覆蓋率門檻，這會導致測試執行失敗。

## 在持續整合中進行測試

若要在 CI 環境中執行 Karma 測試，請使用下列指令：

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTE: `--no-watch` 與 `--no-progress` 旗標對 CI 環境中的 Karma 至關重要，可確保測試只執行一次並乾淨地結束。`--browsers=ChromeHeadless` 旗標同樣不可或缺，能在沒有圖形介面的瀏覽器環境中執行測試。

## 為測試除錯

如果測試沒有如預期運作，你可以在瀏覽器中檢查它們並為它們除錯。

若要使用 Karma 測試執行器為應用程式除錯：

1.  顯示 Karma 瀏覽器視窗。如果這個步驟需要協助，請參閱[測試設定](guide/testing#set-up-for-testing)。
2.  點選 **DEBUG** 按鈕，開啟新的瀏覽器分頁並重新執行測試。
3.  開啟瀏覽器的**開發者工具**。在 Windows 上按 `Ctrl-Shift-I`；在 macOS 上按 `Command-Option-I`。
4.  選取 **Sources** 區段。
5.  按 `Control/Command-P`，然後開始輸入你的測試檔案名稱將它開啟。
6.  在測試中設定中斷點。
7.  重新整理瀏覽器，你會注意到它停在中斷點上。

<img alt="Karma 除錯" src="assets/images/guide/testing/karma-1st-spec-debug.png">
