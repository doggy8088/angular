# 從 `Renderer` 遷移到 `Renderer2`

## 遷移總覽

`Renderer` 類別自 Angular 第 4 版起就被標記為已棄用。
本節提供從這個已棄用 API 遷移到較新的 `Renderer2` API 的指引，以及這對你的應用程式意味著什麼。

## 為什麼我應該遷移到 Renderer2？

已棄用的 `Renderer` 類別已在 Angular 第 9 版中移除，因此必須遷移到受支援的 API。
使用 `Renderer2` 是建議的策略，因為它支援與 `Renderer` 類似的一組功能。
這個 API 共有 19 個方法，介面相當龐大，但原理圖應該能為你的應用程式簡化這個過程。

## 我這邊需要採取任何行動嗎？

不需要。
原理圖應該能處理大多數情況，例外是 `Renderer.animate()` 和 `Renderer.setDebugInfo()`，這兩者本來就不受支援。

## `__ngRendererX` 方法是什麼？為什麼需要它們？

有些方法在 `Renderer2` 中沒有完全對應的等價方法，或者對應到不只一個運算式。
例如，兩個渲染器都有 `createElement()` 方法，但它們並不相等，因為在 `Renderer` 中的呼叫（如 `renderer.createElement(parentNode, namespaceAndName)`）對應到 `Renderer2` 中的下列程式碼區塊：

<code-example format="typescript" language="typescript">

const [namespace, name] = splitNamespace(namespaceAndName);
const el = renderer.createElement(name, namespace);
if (parentNode) {
  renderer.appendChild(parentNode, el);
}
return el;

</code-example>

遷移必須保證函式的回傳值和變數的型別保持相同。
為了安全地處理大多數情況，原理圖會在使用者檔案的底部宣告輔助函式。
這些輔助函式封裝了你自己的邏輯，讓程式碼中的替換縮減為單一函式呼叫。
以下是 `createElement()` 遷移的範例：

**之前**：

<code-example format="typescript" language="typescript">

public createAndAppendElement() {
  const el = this.renderer.createElement('span');
  el.textContent = 'hello world';
  return el;
}

</code-example>

**之後**：

<code-example format="typescript" language="typescript">

public createAndAppendElement() {
  const el = __ngRendererCreateElement(this.renderer, this.element, 'span');
  el.textContent = 'hello world';
  return el;
}
// Generated code at the bottom of the file
__ngRendererCreateElement(renderer: any, parentNode: any, nameAndNamespace: any) {
  const [namespace, name] = __ngRendererSplitNamespace(namespaceAndName);
  const el = renderer.createElement(name, namespace);
  if (parentNode) {
    renderer.appendChild(parentNode, el);
  }
  return el;
}
__ngRendererSplitNamespace(nameAndNamespace: any) {
  // returns the split name and namespace
}

</code-example>

在實作這些輔助函式時，原理圖會確保它們在每個檔案中只宣告一次，而且名稱夠獨特，與你程式碼中既有函式發生衝突的機會很小。
原理圖也會將它們的參數型別保持為 `any`，這樣就不必插入額外邏輯來確保它們的值具有正確的型別。

### 我是函式庫作者。我應該執行這個遷移嗎？

**函式庫作者絕對應該使用這個遷移，擺脫 `Renderer`。**
**否則，函式庫將無法與以第 9 版建置的應用程式搭配運作。**

### 方法遷移完整清單

下表展示了遷移將所有方法從 `Renderer` 對應到 `Renderer2` 的情形。

| Renderer                                                                                 | Renderer2 |
|:---                                                                                      |:---       |
| `listen(renderElement, name, callback)`                                                  | `listen(renderElement, name, callback)`                                                                                                                                                        |
| `setElementProperty(renderElement, propertyName, propertyValue)`                         | `setProperty(renderElement, propertyName, propertyValue)`                                                                                                                                      |
| `setText(renderNode, text)`                                                              | `setValue(renderNode, text)`                                                                                                                                                                   |
| `listenGlobal(target, name, callback)`                                                   | `listen(target, name, callback)`                                                                                                                                                               |
| `selectRootElement(selectorOrNode, debugInfo?)`                                          | `selectRootElement(selectorOrNode)`                                                                                                                                                            |
| `createElement(parentElement, name, debugInfo?)`                                         | `appendChild(parentElement, createElement(name))`                                                                                                                                              |
| `setElementStyle(el, style, value?)`                                                     | `value == null ? removeStyle(el, style) : setStyle(el, style, value)`                                                                                                                          |
| `setElementAttribute(el, name, value?)`                                                  | `attributeValue == null ? removeAttribute(el, name) : setAttribute(el, name, value)`                                                                                                           |
| `createText(parentElement, value, debugInfo?)`                                           | `appendChild(parentElement, createText(value))`                                                                                                                                                |
| `createTemplateAnchor(parentElement)`                                                    | `appendChild(parentElement, createComment(''))`                                                                                                                                                |
| `setElementClass(renderElement, className, isAdd)`                                       | `isAdd ? addClass(renderElement, className) : removeClass(renderElement, className)`                                                                                                           |
| `projectNodes(parentElement, nodes)`                                                     | `for (let i = 0; i < nodes.length; i++) { appendChild(parentElement, nodes[i]); }`                                                                                                             |
| `attachViewAfter(node, viewRootNodes)`                                                   | `const parentElement = parentNode(node); const nextSibling = nextSibling(node); for (let i = 0; i < viewRootNodes.length; i++) { insertBefore(parentElement, viewRootNodes[i], nextSibling);}` |
| `detachView(viewRootNodes)`                                                              | `for (let i = 0; i < viewRootNodes.length; i++) {const node = viewRootNodes[i]; const parentElement = parentNode(node); removeChild(parentElement, node);}`                                    |
| `destroyView(hostElement, viewAllNodes)`                                                 | `for (let i = 0; i < viewAllNodes.length; i++) { destroyNode(viewAllNodes[i]); }`                                                                                                              |
| `setBindingDebugInfo()`                                                                  | 這個函式在 `Renderer2` 中是無操作（noop）。                                                                                                                                                        |
| `createViewRoot(hostElement)`                                                            | 應替換為對 `hostElement` 的參照                                                                                                                                           |
| `invokeElementMethod(renderElement, methodName, args?)`                                  | `(renderElement as any)[methodName].apply(renderElement, args);`                                                                                                                               |
| `animate(element, startingStyles, keyframes, duration, delay, easing, previousPlayers?)` | 拋出錯誤（與 `Renderer.animate()` 的行為相同）                                                                                                                                      |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
