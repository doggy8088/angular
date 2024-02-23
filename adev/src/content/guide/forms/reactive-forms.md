# 響應式表單

響應式表單提供了一種模型驅動的方法來處理隨著時間而變化的表單輸入值。
本指南將向您展示如何建立和更新基本表單控制項，逐步使用群組中的多個控制項，驗證表單值，以及建立動態表單，您可以在其中在執行時新增或移除控制項。

## 響應式表單概述

反應表單使用明確且不變的方法來管理表單在某個時間點的狀態。
表單狀態的每個變更都會傳回新狀態，這會在變更之間維持模型的完整性。
反應表單建立在可觀察串流的基礎上，其中表單輸入和值以輸入值串流的形式提供，可以同步存取。

反應用程式表單也提供簡單的測試路徑，因為您可以確保在請求時，您的資料一致且可預測。
串流的任何使用者都可以安全地操作該資料。

Reactive 表單與 [範本驅動表單](guide/forms/template-driven-forms) 在不同的方式上有差異。
Reactive 表單提供同步存取資料模型、具有可觀察運算符的不變性，以及透過可觀察串流進行變更追蹤。

Template-driven forms 讓直接存取修改範本中的資料，但相較於 reactive forms 較不明確，因為它們依賴嵌入範本中的指令，以及可變資料來非同步追蹤變更。
請參閱 [Forms Overview](guide/forms) 以詳細比較這兩種範式。

## 添加基本表單控制

使用表單控件有三個步驟。

1. 在您的應用程式中註冊響應式表單模組。
    此模組宣告您需要使用響應式表單的響應式表單指令。

1. 產生新元件並實例化新的 `FormControl`。
1. 在範本中註冊 `FormControl`。

然後，您可以透過將元件新增至範本來顯示表單。

以下範例顯示如何新增單一表單控制項。
在範例中，使用者會在輸入欄位中輸入其姓名，擷取該輸入值，並顯示表單控制項元素的目前值。

<docs-workflow>

<docs-step title="匯入 ReactiveFormsModule">
若要使用響應式表單控制項，請從 `@angular/forms` 套件匯入 `ReactiveFormsModule`，並將它新增到 NgModule 的 `imports` 陣列。

<docs-code header="src/app/app.module.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/app.module.ts" visibleRegion="imports" />
</docs-step>

<docs-step title="Generate a new component with a FormControl">
Use the CLI command `ng generate component` to generate a component in your project to host the control.

<docs-code header="src/app/name-editor/name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="create-control"/>

Use the constructor of `FormControl` to set its initial value, which in this case is an empty string. By creating these controls in your component class, you get immediate access to listen for, update, and validate the state of the form input.
</docs-step>

<docs-step title="Register the control in the template">
After you create the control in the component class, you must associate it with a form control element in the template. Update the template with the form control using the `formControl` binding provided by `FormControlDirective`, which is also included in the `ReactiveFormsModule`.

<docs-code header="src/app/name-editor/name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="control-binding" />

Using the template binding syntax, the form control is now registered to the `name` input element in the template. The form control and DOM element communicate with each other: the view reflects changes in the model, and the model reflects changes in the view.
</docs-step>

<docs-step title="Display the component">
The `FormControl` assigned to the `name` property is displayed when the `<app-name-editor>` component is added to a template.

<docs-code header="src/app/app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" visibleRegion="app-name-editor"/>
</docs-step>
</docs-workflow>

### Displaying a form control value

You can display the value in the following ways.

* Through the `valueChanges` observable where you can listen for changes in the form's value in the template using `AsyncPipe` or in the component class using the `subscribe()` method
* With the `value` property, which gives you a snapshot of the current value


The following example shows you how to display the current value using interpolation in the template.

<docs-code header="src/app/name-editor/name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="display-value"/>

The displayed value changes as you update the form control element.

Reactive forms provide access to information about a given control through properties and methods provided with each instance.
These properties and methods of the underlying [AbstractControl](api/forms/AbstractControl "API reference") class are used to control form state and determine when to display messages when handling [input validation](#basic-form-validation "Learn more about validating form input").

Read about other `FormControl` properties and methods in the [API Reference](api/forms/FormControl "Detailed syntax reference").

### Replacing a form control value

Reactive forms have methods to change a control's value programmatically, which gives you the flexibility to update the value without user interaction.
A form control instance provides a `setValue()` method that updates the value of the form control and validates the structure of the value provided against the control's structure.
For example, when retrieving form data from a backend API or service, use the `setValue()` method to update the control to its new value, replacing the old value entirely.

The following example adds a method to the component class to update the value of the control to *Nancy* using the `setValue()` method.

<docs-code header="src/app/name-editor/name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="update-value"/>

Update the template with a button to simulate a name update.
When you click the **Update Name** button, the value entered in the form control element is reflected as its current value.

<docs-code header="src/app/name-editor/name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="update-value"/>

The form model is the source of truth for the control, so when you click the button, the value of the input is changed within the component class, overriding its current value.

HELPFUL: In this example, you're using a single control.
When using the `setValue()` method with a [form group](#grouping-form-controls) or [form array](#creating-dynamic-forms) instance, the value needs to match the structure of the group or array.

## Grouping form controls

Forms typically contain several related controls.
Reactive forms provide two ways of grouping multiple related controls into a single input form.

| Form groups | Details |
|:---         |:---     |
| Form group  | Defines a form with a fixed set of controls that you can manage together. Form group basics are discussed in this section. You can also [nest form groups](#creating-nested-form-groups "See more about nesting groups") to create more complex forms.      |
| Form array  | Defines a dynamic form, where you can add and remove controls at run time. You can also nest form arrays to create more complex forms. For more about this option, see [Creating dynamic forms](#creating-dynamic-forms). |

Just as a form control instance gives you control over a single input field, a form group instance tracks the form state of a group of form control instances \(for example, a form\).
Each control in a form group instance is tracked by name when creating the form group.
The following example shows how to manage multiple form control instances in a single group.

Generate a `ProfileEditor` component and import the `FormGroup` and `FormControl` classes from the `@angular/forms` package.

<docs-code language="shell">
ng generate component ProfileEditor
</docs-code>

<docs-code header="src/app/profile-editor/profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="imports"/>

若要將表單群組新增至這個元件，請執行下列步驟。

1. 建立一個 `FormGroup` 實例。
1. 關聯 `FormGroup` 模型和檢視。
1. 儲存表單資料。

<docs-workflow>

<docs-step title="建立 FormGroup 實例">
在元件類別中建立一個名為 `profileForm` 的屬性，並將其設定為一個新的表單群組實例。若要初始化表單群組，請提供一個建構函式，其中包含一個映射至其控制項的名稱金鑰物件。

對於個人資料表單，新增兩個名稱為 `firstName` 和 `lastName` 的表單控制實例

<docs-code header="src/app/profile-editor/profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="formgroup"/>

個體表單控制項現在收集在一個群組內。`FormGroup` 實例提供其模型值，作為從群組中每個控制項的值簡化的物件。表單群組實例具有與表單控制項實例相同的屬性（例如 `value` 和 `untouched`）和方法（例如 `setValue()`）。
</docs-step>

<docs-step title="關聯 FormGroup 模型及檢視">
表單群組會追蹤其每個控制項的狀態及變更，因此如果其中一個控制項變更，則父控制項也會發出新的狀態或值變更。群組的模型由其成員維護。定義模型後，您必須更新範本以反映檢視中的模型。

<docs-code header="src/app/profile-editor/profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="formgroup"/>

就像表單群組包含一組控制項一樣，*profileForm* `FormGroup` 已使用 `FormGroup` 指令繫結至 `form` 元素，在模型和包含輸入的表單之間建立一個通訊層。`FormControlName` 指令提供的 `formControlName` 輸入將各個輸入繫結至 `FormGroup` 中定義的表單控制項。表單控制項會與各自的元素通訊。它們也會通訊以變更表單群組執行個體，該執行個體提供模型值的真實來源。
</docs-step>

<docs-step title="儲存表單資料">
`ProfileEditor` 元件接受使用者的輸入，但在實際情況下，您想擷取表單值，並讓元件外部可以進一步處理。`FormGroup` 指令會監聽 `form` 元素發出的 `submit` 事件，並發出 `ngSubmit` 事件，您可以將其繫結到回呼函式。使用 `onSubmit()` 回呼方法將 `ngSubmit` 事件監聽器新增到 `form` 標籤。

<docs-code header="src/app/profile-editor/profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="ng-submit"/>

`ProfileEditor` 元件中的 `onSubmit()` 方法擷取 `profileForm` 的目前值。使用 `EventEmitter` 來讓表單封裝，並在元件以外提供表單值。以下範例使用 `console.warn` 將訊息記錄到瀏覽器主控台。

<docs-code header="src/app/profile-editor/profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="on-submit"/>

`submit` 事件由 `form` 標籤使用內建 DOM 事件發出。您可以點擊具有 `submit` 類型的按鈕來觸發事件。這讓使用者可以按下 **Enter** 鍵來提交已完成的表單。

使用 `button` 元素在表單底部新增按鈕以觸發表單提交。

<docs-code header="src/app/profile-editor/profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="submit-button"/>

前一個片段中的按鈕還有一個 `disabled` 繫結，用於在 `profileForm` 無效時停用按鈕。您尚未執行任何驗證，因此按鈕始終處於啟用狀態。基本表單驗證在 [驗證表單輸入](#validating-form-input) 部分中有介紹。
</docs-step>

<docs-step title="顯示元件">
若要顯示包含表單的 `ProfileEditor` 元件，請將其新增至元件範本。

<docs-code header="src/app/app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" visibleRegion="app-profile-editor"/>

`ProfileEditor` 讓您可以管理表單群組實例中的 `firstName` 和 `lastName` 控制項的表單控制項實例。

### 建立巢狀表單群組

表單群組可以接受個別表單控制實例和其他表單群組實例作為子項。
這使得組成複雜的表單模型更容易維護和邏輯上組合在一起。

當建立複雜的表單時，以較小的區段管理不同的資訊區域會比較容易。
使用巢狀表單群組實例可讓您將大型表單群組分解成較小、更容易管理的群組。

如要建立更複雜的表單，請使用下列步驟。

1. 建立一個巢狀群組。
1. 在範本中將巢狀表單分組。

某些類型的資訊自然會歸類成同一群組。
姓名和地址是此類巢狀群組的典型範例，並用於以下範例。

<docs-workflow>
<docs-step title="建立巢狀群組">
若要在 `profileForm` 中建立巢狀群組，請將巢狀 `address` 元素加入至表單群組實例。

<docs-code header="src/app/profile-editor/profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="nested-formgroup"/>

在此範例中，`address group` 將目前的 `firstName` 和 `lastName` 控制項與新的 `street`、`city`、`state` 和 `zip` 控制項結合在一起。即使表單群組中的 `address` 元素是表單群組中整體 `profileForm` 元素的子元素，但值和狀態變更會套用相同的規則。嵌套表單群組的狀態和值變更會傳播至父表單群組，以維持與整體模型的一致性。
</docs-step>

<docs-step title="在範本中分組巢狀表單">
在元件類別中更新模型後，更新範本以連接表單群組實例及其輸入元素。將包含 `street`、`city`、`state` 和 `zip` 欄位的 `address` 表單群組新增到 `ProfileEditor` 範本。

<docs-code header="src/app/profile-editor/profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="formgroupname"/>

`ProfileEditor` 表單顯示為一個群組，但模型會進一步細分以表示邏輯群組區域。

使用 `value` 屬性和 `JsonPipe` 在元件範本中顯示表單群組實例的值。
</docs-step>
</docs-workflow>

### 更新資料模型的部份內容

在更新包含多個控制項的表單群組實例的值時，您可能只想更新模型的某些部分。
本節說明如何更新表單控制資料模型的特定部分。

更新模型值的方式有兩種：

| 方法        | 詳細 |
|:---            |:---     |
| `setValue()`   | 為個別控制項設定新值。`setValue()` 方法嚴格遵守表單群組的結構，並替控制項取代整個值。 |
| `patchValue()` | 取代在表單模型中已變更的物件中定義的任何屬性。                                                                                     |

`setValue()` 方法的嚴格檢查有助於捕捉複雜表單中的巢狀錯誤，而 `patchValue()` 則會在這些錯誤上靜默失敗。

在 `ProfileEditorComponent` 中，使用 `updateProfile` 方法和以下範例來更新使用者的名字和街道地址。

<docs-code header="src/app/profile-editor/profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="patch-value"/>

模擬更新，在範本中加入按鈕，可依需求更新使用者檔案。

<docs-code header="src/app/profile-editor/profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="patch-value"/>

當使用者點擊按鈕時，`profileForm` 模型會更新為 `firstName` 和 `street` 的新值。請注意，`street` 是在 `address` 屬性內的物件中提供的。
這是必要的，因為 `patchValue()` 方法會針對模型結構套用更新。
`PatchValue()` 僅更新表單模型定義的屬性。

## 使用 FormBuilder 服務來產生控制項

手動建立表單控制實例在處理多個表單時可能會變得重複。
`FormBuilder` 服務提供方便的方法來產生控制項。

使用以下步驟以利用這項服務。

1. 匯入 `FormBuilder` 類別。
1. 注入 `FormBuilder` 服務。
1. 產生表單內容。

以下範例顯示如何重構 `ProfileEditor` 元件以使用表單建構器服務來建立表單控制項和表單群組實例。

<docs-workflow>
<docs-step title="匯入 FormBuilder 類別">
從 `@angular/forms` 套件匯入 `FormBuilder` 類別。

<docs-code header="src/app/profile-editor/profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-builder-imports"/>

</docs-step>

<docs-step title="注入 FormBuilder 服務">
`FormBuilder` 服務是與響應式表單模組一起提供的可注入提供者。將此相依項新增至元件建構函式，以注入此相依項。

<docs-code header="src/app/profile-editor/profile-editor.component.ts (constructor)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="inject-form-builder"/>

</docs-step>
<docs-step title="產生表單控制項">
`FormBuilder` 服務有三個方法：`control()`、`group()` 和 `array()`。這些是工廠方法，用於在您的元件類別中產生實例，包括表單控制項、表單群組和表單陣列。使用 `group` 方法建立 `profileForm` 控制項。

<docs-code header="src/app/profile-editor/profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-builder"/>

在前面的範例中，您使用 `group()` 方法與同一個物件來定義模型中的屬性。每個控制項名稱的值都是陣列，包含陣列中第一個項目作為初始值。

提示：您可以僅使用初始值定義控制項，但如果您的控制項需要同步或非同步驗證，請將同步和非同步驗證程序分別新增為陣列中的第二項和第三項。比較使用表單建構器與手動建立實例。

<docs-code-multifile>
    <docs-code header="src/app/profile-editor/profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="formgroup-compare"/>
    <docs-code header="src/app/profile-editor/profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## Validating form input

*Form validation* is used to ensure that user input is complete and correct.
This section covers adding a single validator to a form control and displaying the overall form status.
Form validation is covered more extensively in the [Form Validation](guide/forms/form-validation) guide.

Use the following steps to add form validation.

1. Import a validator function in your form component.
1. Add the validator to the field in the form.
1. Add logic to handle the validation status.


The most common validation is making a field required.
The following example shows how to add a required validation to the `firstName` control and display the result of validation.

<docs-workflow>
<docs-step title="Import a validator function">
Reactive forms include a set of validator functions for common use cases. These functions receive a control to validate against and return an error object or a null value based on the validation check.

Import the `Validators` class from the `@angular/forms` package.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="validator-imports"/>
</docs-step>

<docs-step title="Make a field required">
In the `ProfileEditor` component, add the `Validators.required` static method as the second item in the array for the `firstName` control.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="required-validator"/>
</docs-step>

<docs-step title="Display form status">
When you add a required field to the form control, its initial status is invalid. This invalid status propagates to the parent form group element, making its status invalid. Access the current status of the form group instance through its `status` property.

Display the current status of `profileForm` using interpolation.

<docs-code header="src/app/profile-editor/profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="display-status"/>

The **Submit** button is disabled because `profileForm` is invalid due to the required `firstName` form control. After you fill out the `firstName` input, the form becomes valid and the **Submit** button is enabled.

For more on form validation, visit the [Form Validation](guide/forms/form-validation) guide.
</docs-step>
</docs-workflow>

## Creating dynamic forms

`FormArray` is an alternative to `FormGroup` for managing any number of unnamed controls.
As with form group instances, you can dynamically insert and remove controls from form array instances, and the form array instance value and validation status is calculated from its child controls.
However, you don't need to define a key for each control by name, so this is a great option if you don't know the number of child values in advance.

To define a dynamic form, take the following steps.

1. Import the `FormArray` class.
1. Define a `FormArray` control.
1. Access the `FormArray` control with a getter method.
1. Display the form array in a template.


The following example shows you how to manage an array of *aliases* in `ProfileEditor`.

<docs-workflow>
<docs-step title="Import the `FormArray` class">
Import the `FormArray` class from `@angular/forms` to use for type information. The `FormBuilder` service is ready to create a `FormArray` instance.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-array-imports"/>
</docs-step>

<docs-step title="Define a `FormArray` control">
You can initialize a form array with any number of controls, from zero to many, by defining them in an array. Add an `aliases` property to the form group instance for `profileForm` to define the form array.

Use the `FormBuilder.array()` method to define the array, and the `FormBuilder.control()` method to populate the array with an initial control.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="aliases"/>

The aliases control in the form group instance is now populated with a single control until more controls are added dynamically.
</docs-step>

<docs-step title="Access the `FormArray` control">
A getter provides access to the aliases in the form array instance compared to repeating the `profileForm.get()` method to get each instance. The form array instance represents an undefined number of controls in an array. It's convenient to access a control through a getter, and this approach is straightforward to repeat for additional controls. <br />

Use the getter syntax to create an `aliases` class property to retrieve the alias's form array control from the parent form group.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="aliases-getter"/>

Because the returned control is of the type `AbstractControl`, you need to provide an explicit type to access the method syntax for the form array instance.  Define a method to dynamically insert an alias control into the alias's form array. The `FormArray.push()` method inserts the control as a new item in the array.

<docs-code header="src/app/profile-editor/profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="add-alias"/>

In the template, each control is displayed as a separate input field.

</docs-step>

<docs-step title="Display the form array in the template">

To attach the aliases from your form model, you must add it to the template. Similar to the `formGroupName` input provided by `FormGroupNameDirective`, `formArrayName` binds communication from the form array instance to the template with `FormArrayNameDirective`.

Add the following template HTML after the `<div>` closing the `formGroupName` element.

<docs-code header="src/app/profile-editor/profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="formarrayname"/>

The `*ngFor` directive iterates over each form control instance provided by the aliases form array instance. Because form array elements are unnamed, you assign the index to the `i` variable and pass it to each control to bind it to the `formControlName` input.

Each time a new alias instance is added, the new form array instance is provided its control based on the index. This lets you track each individual control when calculating the status and value of the root control.

</docs-step>

<docs-step title="Add an alias">

Initially, the form contains one `Alias` field. To add another field, click the **Add Alias** button. You can also validate the array of aliases reported by the form model displayed by `Form Value` at the bottom of the template.  Instead of a form control instance for each alias, you can compose another form group instance with additional fields. The process of defining a control for each item is the same.
</docs-step>

</docs-workflow>

## Reactive forms API summary

The following table lists the base classes and services used to create and manage reactive form controls.
For complete syntax details, see the API reference documentation for the [Forms package](api/forms "API reference").

### Classes

| Class             | Details |
|:---               |:---     |
| `AbstractControl` | The abstract base class for the concrete form control classes `FormControl`, `FormGroup`, and `FormArray`. It provides their common behaviors and properties.                           |
| `FormControl`     | Manages the value and validity status of an individual form control. It corresponds to an HTML form control such as `<input>` or `<select>`.                                            |
| `FormGroup`       | Manages the value and validity state of a group of `AbstractControl` instances. The group's properties include its child controls. The top-level form in your component is `FormGroup`. |
| `FormArray`       | Manages the value and validity state of a numerically indexed array of `AbstractControl` instances.                                                                                     |
| `FormBuilder`     | An injectable service that provides factory methods for creating control instances.                                                                                                     |
| `FormRecord`      | Tracks the value and validity state of a collection of `FormControl` instances, each of which has the same value type.                                                                  |

### Directives

| Directive              | Details |
|:---                    |:---     |
| `FormControlDirective` | Syncs a standalone `FormControl` instance to a form control element.                       |
| `FormControlName`      | Syncs `FormControl` in an existing `FormGroup` instance to a form control element by name. |
| `FormGroupDirective`   | Syncs an existing `FormGroup` instance to a DOM element.                                   |
| `FormGroupName`        | Syncs a nested `FormGroup` instance to a DOM element.                                      |
| `FormArrayName`        | Syncs a nested `FormArray` instance to a DOM element.                                      |
