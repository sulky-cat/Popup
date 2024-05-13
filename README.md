# Название

[Демо страница](https://sulky-cat.github.io/Popup/demo/)

## Содержание
- [Описание](#описание)
- [Подключение](#подключение)
- [html](#html)
- [js](#js)
- [Методы](#Методы)
- [Параметры](#параметры)
- [Примеры](#примеры)

## Описание
Для работы скрипта достаточно указать в атрибуте `data-popup` селектор необходимого модального окна. 
Скрипт позволяет открывать окна по клику на кнопку, по хэшу при загрузке страницы и при изменении состояния адресной строки, сохраняет предыдущий элемент фокуса, блокирует табуляцию внутри модального окна, легко вставлять видео из ютуба, открывать модальные окна из модальных окон, сохранять состояние заблокированного/разблокированного скролла.

При вызове по хэшу, если модальное окно вызывается по классу, то хэш имеет вид `#.class-modal`, а если по id - `#idModal`.

События всплывают, поэтому их можно повесить как на само модальное окно, так и на `body`.

## Подключение
Для корректной работы скрипта необходимо дополнительно подключить вспомогательные классы `Timer` и `BodyLock`. Все скрипты находятся в папке `/src`, а информация про вспомогательные классы находится [тут](https://github.com/sulky-cat/Helpers).

### CSS
Подключение стилей 
```html
<link rel="stylesheet" href="popup.css">
```

### JS
Подключение без модульности:
```html
<script src="Timer.js"></script>
<script src="BodyLock.js"></script>
<script src="Popup.js"></script>
```

Подключение с модулями (import уже написан в файлах):
*HTML*
```html
<script type="module" src="script.js">
   import Spoller from "Tab.js"
</script>
```
*JS (Popup.js)*
```js
import BodyLock from "./BodyLock.js"
import Timer from "./Timer.js"
```

## HTML
Кнопка вызова:
```html
<button data-popup="#popup" data-yt="код_видео" type="button">Открыть</button>
```
Модальное окно:
```html
<div id="popup" aria-hidden="true" class="popup">
   <div class="popup__wrapper">
      <div class="popup__content">
         <button data-close type="button" class="popup__close"></button>
         <div class="popup__text">
            <p>Обычное поведение</p>
         </div>
         <div data-yt-pace>
            <!-- Сюда вставится видео -->
         </div>
      </div>
   </div>
</div>
```

Атрибуты для кнопки вызова: 
* `data-popup` - атрибуту указывается селектор модального окна. Если селекторы совпадают - вызывается первое найденное модальное окно;
* `data-yt` - атрибуту указывается код видео из ютуба. Код берется после `www.youtube.com/watch?v=ТУТ_НАХОДИТСЯ_КОД`;
* `data-wait` - для ожидания закрытия одного модального окна перед открытием другого;
* `data-save-body-state` - для сохранения состояния блокировки скролла.

Атрибут для блока внутри модальног оокна:
* `data-yt-place` - место, куда будет вставляться видео.

## JS
Инициализация:
```js
const popup = new Popup()
``` 

### Настройки
* `hash` - добавление хэша в адресную строку при открыти; открытие модалнього окна по хэшу (при загрузке старницы и изменении адресной строки). По умолчанию `true`;
* `addCustomEvent` - добавление кастомных событий `onBeforeOpen`, `onAfterOpen`, `onBeforeClose`, `onAfterClose`. По умолчанию `true`;
* `transitionClass` - класс, который добавляется для `body` в момент открытия/закрытия модального окна. По умолчанию `'popup-transition'`;
* `htmlClass` - класс, который добавляется для `window` при открытом модальном окне. По умолчанию `'popup-show'`;
* `activePopup` - класс, который добавляется для модального окна при открытии. По умолчанию `'popup-open'`;
* `youtubePlaceSelector` - селектор для указания места вставки видео. По умолчанию `'[data-yt-place]'`;
* `attributeWait` - атрибут для ожидания закрытия предыдущего модального окна перед открытием нового (при открытии попапа из попапа). По умолчанию `'data-wait'`;
* `attributeNoLock` - атрибут для сохранения состояния скролла. По умолчанию `'data-save-body-state'`;
* `openAttribute` - атрибут для элемента, который открывает модальное окно. По умолчанию `'data-popup'`;
* `closeAttribute` - атрибут для элемента, который закрывает модальное окно. По умолчанию `'data-close'`.

## Методы
* `popup.init()` - инициализирует скрипт;
* `popup.destroy()` - удаляет обработчики событий;
* `popup.open(selector)` - открывает модальное окно по указанному селектору.;
* `popup.close()` - закрывает открытое модалньое окно..

## Параметры
* `popup.openBtn` - кнопка, которая открывает модальное окно;
* `popup.selector` - селектолр, по которому открыли модальное окно;
* `popup.window` - модальное окно.

## Примеры
* Кастомные события. [Пример 6](https://sulky-cat.github.io/Popup/demo/#ex_6).
```js
new Popup()

const popup = document.querySelector('#popup_ex_6')
popup.addEventListener('onBeforeOpen', (e) => {
   console.log('onBeforeOpen', e.detail.popup);
})
popup.addEventListener('onAfterOpen', (e) => {
   console.log('onAfterOpen', e.detail.popup);
})
popup.addEventListener('onBeforeClose', (e) => {
   console.log('onBeforeClose', e.detail.popup);
})
popup.addEventListener('onAfterClose', (e) => {
   console.log('onAfterClose', e.detail.popup);
})
```
