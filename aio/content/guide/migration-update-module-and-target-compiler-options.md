# 更新 `module` 與 `target` 編譯器選項遷移

## 這個遷移做什麼？

此遷移會調整工作區 [TypeScript 設定檔案](guide/typescript-configuration) 中的 [`target`](https://www.typescriptlang.org/v2/en/tsconfig#target) 和 [`module`](https://www.typescriptlang.org/v2/en/tsconfig#module) 設定。
每個選項的變更內容會依使用該 TypeScript 設定檔案的建置器或命令而有所不同。
除非另有註明，否則只有在現有值自專案建立後未曾變更時，才會進行變更。
此流程有助於確保對這些選項的有意變更得以保留下來。

| TypeScript 設定檔案                                                                  | 變更的屬性 | 現有值       | 新值       |
| ------------------------------------------------------------------------------------- | ---------- | ------------ | ---------- |
| `<workspace base>/tsconfig.json`                                                      | `"module"` | `"esnext"`   | `"es2020"` |
| 用於 <code class="no-auto-link">browser</code>  建置器選項 \(`ng build` for applications\)  | `"module"` | `"esnext"`   | `"es2020"` |
| 用於 `ng-packagr` 建置器選項 \(`ng build` for libraries\)                             | `"module"` | `"esnext"`   | `"es2020"` |
| 用於 `karma` 建置器選項 \(`ng test` for applications\)                                | `"module"` | `"esnext"`   | `"es2020"` |
| 用於 `server` 建置器選項 \(universal\)                                                | `"module"` | `"commonjs"` | _已移除_   |
| 用於 `server` 建置器選項 \(universal\)                                                | `"target"` | _任意值_     | `"es2016"` |
| 用於 `protractor` 建置器選項 \(`ng e2e` for applications\)                            | `"target"` | `"es5"`      | `"es2018"` |

## 為什麼需要這個遷移？

此遷移透過將專案更新為使用建議的最佳實務編譯選項，提升專案的長期可支援性。

對於在 Node.js 上執行的功能，例如 Universal 和 Protractor，新設定也能帶來效能和疑難排解方面的好處。
Angular CLI \(v10.13\) 支援的最低 Node.js 版本支援 ES2018 及更早版本的功能。
透過以較新的 ES 版本為目標，編譯器需要轉換的程式碼更少，並且可以直接使用較新的功能。
由於 zone.js 不支援原生的 <code class="no-auto-link">async</code> 和 `await`，Universal 建置仍以 ES2016 為目標。

## 為什麼使用 `"es2020"` 而不是 `"esnext"`？

在 TypeScript 3.9 中，由 `module` 控制的 TypeScript 編譯器行為，在 `"esnext"` 和 `"es2020"` 兩種值下是相同的。
這種行為未來可能會改變，因為 `"esnext"` 選項可能會以不向後相容的方式演進，導致 TypeScript 更新時出現建置時期或執行時期錯誤。
因此，程式碼可能變得不穩定。使用 `"es2020"` 選項可以降低此風險。
