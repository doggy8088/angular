# 程式碼覆蓋率

程式碼覆蓋率報告會向你顯示程式碼庫中有哪些部分可能沒有被單元測試妥善測試到。

## 前置需求

若要使用 Vitest 產生程式碼覆蓋率報告，你必須安裝 `@vitest/coverage-v8` 套件：

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/coverage-v8
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/coverage-v8
  </docs-code>
</docs-code-multifile>

## 產生報告

若要產生覆蓋率報告，請在 `ng test` 指令加上 `--coverage` 旗標：

```shell
ng test --coverage
```

測試執行完畢後，該指令會在專案中建立一個新的 `coverage/` 目錄。開啟 `index.html` 檔案，即可看到包含你的原始碼與程式碼覆蓋率數值的報告。

如果你希望每次測試時都建立程式碼覆蓋率報告，可以在 `angular.json` 檔案中將 `coverage` 選項設定為 `true`：

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## 強制執行程式碼覆蓋率門檻

程式碼覆蓋率百分比可以讓你估算有多少程式碼已被測試。如果你們團隊決定了單元測試的最低比例，你可以在設定中強制執行這個最低要求。

例如，假設你希望程式碼庫至少有 80% 的程式碼覆蓋率。若要啟用這個要求，請在 `angular.json` 檔案中加入 `coverageThresholds` 選項：

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageThresholds": {
              "statements": 80,
              "branches": 80,
              "functions": 80,
              "lines": 80
            }
          }
        }
      }
    }
  }
}
```

如此一來，當你執行測試時，如果覆蓋率低於 80%，該指令就會失敗。

## 進階設定

你可以在 `angular.json` 檔案中設定其他幾個覆蓋率選項：

- `coverageInclude`：要包含在覆蓋率報告中的檔案 Glob 模式。
- `coverageExclude`：要從覆蓋率報告中排除的檔案 Glob 模式。
- `coverageReporters`：要使用的報告器陣列（例如 `html`、`lcov`、`json`）。
- `coverageWatermarks`：一個物件，指定 HTML 報告器的 `[low, high]` 浮水印值，可能影響報告的顏色標示。

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageReporters": ["html", "lcov"],
            "coverageWatermarks": {
              "statements": [50, 80],
              "branches": [50, 80],
              "functions": [50, 80],
              "lines": [50, 80]
            }
          }
        }
      }
    }
  }
}
```
