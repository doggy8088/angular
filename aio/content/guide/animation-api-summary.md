# 動畫 API 總覽

<!-- vale off -->

`@angular/animations` 模組提供的函式式 API，提供了一套領域專用語言（DSL），用來在 Angular 應用程式中建立與控制動畫。 核心函式與相關資料結構的完整清單與語法細節，請見 [API 參考文件](api/animations)。
<!-- vale on --> 
| 函式名稱 | 功能 |
|:---                               |:---                                                                                                                                                                                                         |
| `trigger()` | 啟動動畫，並作為所有其他動畫函式呼叫的容器。HTML 範本會繫結到 `triggerName`。用第一個參數宣告一個唯一的觸發器名稱。使用陣列語法。 |
| `style()` | 定義一個或多個要在動畫中使用的 CSS 樣式。在動畫期間控制 HTML 元素的外觀。使用物件語法。 |
| [`state()`](api/animations/state) | 建立一組具名的 CSS 樣式，在成功轉場到指定狀態時套用。之後可以在其他動畫函式中以名稱參照該狀態。 |
| `animate()` | 指定轉場的時間資訊。可選的值有 `delay` 與 `easing`。內部可以包含 `style()` 呼叫。 |
| `transition()` | 定義兩個具名狀態之間的動畫序列。使用陣列語法。 |
| `keyframes()` | 允許在指定時間區間內依序在樣式之間變化。用在 `animate()` 內部。每個 `keyframe()` 內部可以包含多個 `style()` 呼叫。使用陣列語法。 |
| [`group()`](api/animations/group) | 指定一組要平行執行的動畫步驟（*內部動畫*）。所有內部動畫步驟都完成後，動畫才會繼續。用在 `sequence()` 或 `transition()` 內部。 |
| `query()` | 在目前元素內尋找一個或多個內部 HTML 元素。 |
| `sequence()` | 指定一份要依序一個接一個執行的動畫步驟清單。 |
| `stagger()` | 讓多個元素的動畫起始時間錯開。 |
| `animation()` | 產生一個可從其他地方呼叫的可重複使用動畫。與 `useAnimation()` 搭配使用。 |
| `useAnimation()` | 啟用一個可重複使用的動畫。與 `animation()` 搭配使用。 |
| `animateChild()` | 讓子元件的動畫能在與父元件相同的時間範圍內執行。 |

</table>

@reviewed 2022-10-28
