# 推播通知

推播通知是吸引使用者參與的有效方式。
透過 service worker 的能力，即使你的應用程式不在焦點中，通知也能傳送到裝置上。

Angular service worker 能顯示推播通知，並處理通知點擊事件。

HELPFUL: 使用 Angular service worker 時，推播通知的互動是透過 `SwPush` 服務處理的。
若要深入了解其中涉及的瀏覽器 API，請參閱 [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) 與[使用 Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API)。

## 通知 payload

透過推送帶有有效 payload 的訊息來觸發推播通知。
請參閱 `SwPush` 的說明。

HELPFUL: 在 Chrome 中，你不需要後端就能測試推播通知。
開啟 Devtools -> Application -> Service Workers，使用 `Push` 輸入框傳送 JSON 通知 payload。

## 通知點擊處理

`notificationclick` 事件的預設行為是關閉通知，並通知 `SwPush.notificationClicks`。

你可以透過在 `data` 物件中加入 `onActionClick` 屬性並提供 `default` 條目，指定在 `notificationclick` 時要額外執行的操作。
當通知被點擊時沒有開啟中的用戶端，這特別有用。

<docs-code language="json">

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

</docs-code>

### 操作

Angular service worker 支援下列操作：

| 操作                        | 詳細說明                                                                                                                                         |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `openWindow`                | 在指定 URL 開啟新分頁。                                                                                                                          |
| `focusLastFocusedOrOpen`    | 將焦點移至最後聚焦的用戶端。如果沒有開啟中的用戶端，則在指定 URL 開啟新分頁。                                                                   |
| `navigateLastFocusedOrOpen` | 將焦點移至最後聚焦的用戶端，並將它導向指定 URL。如果沒有開啟中的用戶端，則在指定 URL 開啟新分頁。                                               |
| `sendRequest`               | 向指定 URL 傳送一個簡單的 GET 請求。                                                                                                             |

IMPORTANT: URL 是相對於 service worker 的註冊範圍解析的。<br />如果某個 `onActionClick` 項目沒有定義 `url`，則使用 service worker 的註冊範圍。

### 動作

動作提供了一種方式，讓你自訂使用者如何與通知互動。

使用 `actions` 屬性，你可以定義一組可用的動作。
每個動作會呈現為一個動作按鈕，使用者可以點選它來與通知互動。

此外，使用 `data` 物件上的 `onActionClick` 屬性，你可以將每個動作綁定到對應動作按鈕被點選時要執行的操作：

<docs-code language="typescript">

{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"}
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}

</docs-code>

IMPORTANT: 如果某個動作沒有對應的 `onActionClick` 條目，通知會被關閉，並在現有用戶端上通知 `SwPush.notificationClicks`。

## 深入了解 Angular service worker

你可能也會對下列內容有興趣：

<docs-pill-row>

  <docs-pill href="ecosystem/service-workers/communications" title="與 Service Worker 通訊"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker DevOps"/>
</docs-pill-row>
