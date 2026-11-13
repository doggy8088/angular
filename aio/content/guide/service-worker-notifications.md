# Service Worker 推播通知

推播通知是吸引使用者參與的有效方式。 透過 service worker 的能力，即使你的應用程式不在焦點中，通知也能傳送到裝置上。

Angular service worker 能顯示推播通知，並處理通知點擊事件。

<div class="alert is-helpful">

使用 Angular Service Worker 時，推播通知的互動是透過 `SwPush` 服務來處理。
如要進一步了解所涉及的瀏覽器 API，請參閱 [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) 與 [Using the Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API)。

</div>

## 先備知識

建議你先對以下內容有基本的了解：

*   [Service Worker 入門](guide/service-worker-getting-started)

## 通知 payload

透過推送帶有有效 payload 的訊息來觸發推播通知。 請參閱 `SwPush` 的說明。

<div class="alert is-helpful">

在 Chrome 中，你可以在沒有後端的情況下測試推播通知。
開啟開發人員工具 -&gt; Application -&gt; Service Workers，並使用 `Push` 輸入框來傳送 JSON 通知承載。

</div>

## 通知點擊處理

`notificationclick` 事件的預設行為是關閉通知，並通知 `SwPush.notificationClicks`。

你可以透過在 `notificationclick` 物件中加入 `onActionClick` 屬性並提供 `data` 條目，指定在 `default` 時要額外執行的操作。 當通知被點擊時沒有開啟中的用戶端，這特別有用。

<code-example format="json" language="json">

{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}

</code-example>

### 操作

Angular service worker 支援下列操作：

| 操作 | 詳細說明 |
|:---                         |:---     |
| `openWindow` | 在指定的 URL 開啟新分頁，該 URL 會相對於 service worker 的範圍來解析。 |
| `focusLastFocusedOrOpen` | 將焦點移至最後聚焦的用戶端。如果沒有開啟中的用戶端，則在指定的 URL 開啟新分頁，該 URL 會相對於 service worker 的範圍來解析。 |
| `navigateLastFocusedOrOpen` | 將焦點移至最後聚焦的用戶端，並將它導向指定的 URL，該 URL 會相對於 service worker 的範圍來解析。如果沒有開啟中的用戶端，則在指定的 URL 開啟新分頁。 |

<div class="alert is-important">

如果某個 `onActionClick` 項目沒有定義 `url`，就會使用 Service Worker 的註冊範圍。

</div>

### 動作

動作提供了一種方式，讓你自訂使用者如何與通知互動。

使用 `actions` 屬性，你可以定義一組可用的動作。 每個動作會呈現為一個動作按鈕，使用者可以點選它來與通知互動。

此外，使用 `onActionClick` 物件上的 `data` 屬性，你可以將每個動作綁定到對應動作按鈕被點選時要執行的操作：

<code-example format="typescript" language="typescript">

{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"}
      }
    }
  }
}

</code-example>

<div class="alert is-important">

如果某個動作沒有對應的 `onActionClick` 項目，通知就會關閉，並且會在現有的用戶端上通知 `SwPush.notificationClicks`。

</div>

## 更多 Angular Service Worker 資訊

你可能也會對以下內容有興趣：

*   [正式環境中的 Service Worker](guide/service-worker-devops)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
