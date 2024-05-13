# Название

[Демо страница](https://sulky-cat.github.io/Spoller/demo/)

<img align="middle" alt="Spoller demo" src="./Spoller.png">

## Содержание
- [Описание](#описание)
- [Подключение](#подключение)
- [html](#html)
- [js](#js)
- [Методы](#Методы)
- [Параметры](#параметры)
- [Примеры](#примеры)

## Описание
Скрипт позволяет легко и просто настроить спойлеры/аккордеон. Для этого укажите в объявлении js класса необходимый css-селектор для начала работы. 
Для кнопки/элемента, которая(-ый) открывает спойлер, необходимо указать `[data-spoller-title]`.
Для элемента, который будет скрываться, необходимо указать `[data-spoller-body]`.

Чтобы спойлер изначально был открыт, ему необходимо указать класс `spoller-active` (класс можно поменять).

Кнопок и спойлеров должно быть одинаковое количество. Каждому элементу присваивается id внутри каждой конструкции. Открытие элементов происходит по id, который был указан у кнопки.

Данный скрипт дополнительно использует вспомогательный класс: `Slide` и `Timer`. [Подробней про них](https://github.com/sulky-cat/Helpers).

## Подключение
Класс `Spoller` находится в папке `/src`. Вспомогательные классы `Timer` и `Slide` тоже находятся в папке `/src`, а также [тут](https://github.com/sulky-cat/Helpers).

Подключение без модульности:
```html
<script src="Timer.js"></script>
<script src="Slide.js"></script>
<script src="Tab.js"></script>
```
Подключение с модулями (import уже написан в файлах):
*HTML*
```html
<script type="module" src="script.js">
   import Spoller from "Spoller.js"
</script>
```
*JS (Tab.js)*
```js
import Slide from "./Slide.js"
```
*JS (Slide.js)*
```js
import Timer from "./Timer.js";
```

## HTML
```html
<div class="spoller">
   <!-- Обычный спойлер -->
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
   <!-- Спойлер в конструкциях -->
   <div>
      <button data-spoller-title type="button">Нажми на меня</button>
   </div>
   <div>
      <div data-spoller-body> Тело спойлера </div>
   </div>
   <!-- Спойлер в спойлере -->
   <button data-spoller-title type="button">Нажми на меня</button>
   <div>
      <div data-spoller-body>
            <button data-spoller-title type="button">Нажми на меня</button>
            <div data-spoller-body> Тело спойлера </div>
      </div>
   </div>
</div>
``` 
Атрибуты для обертки спойлеров (элемент с классом `spoller`): 
* `data-spoller-one` - спойлеры начинают работать как аккордеон (открывается только один спойлер);
* `data-spoller-await` - открытие следующего спойлера начинается сразу после закрытия предыдущего. Указывается вместе с атрибутом `data-spoller-one` или настройкой `one`;
* `data-spoller-media` - медиазапрос для отключения спойлеров. Первое значение - `min` или `max`, второе - ширина экрана с указанием единицы измерения. 
Например: 
`data-spoller-media="max,900px"` - спойлеры отключатся на ширинах с 900px и меньше,
`data-spoller-media="min,900px"` - спойлеры отключатся на ширинах с 900px и больше.

Атрибуты для кнопок спойлеров (элемент с атрибутом `data-spoller-title`):
* `data-spoller-title` - указывается для обозначения элемента, на котором будет срабатывать клик. Далее ему будет присваиваться id, по которому будет определяться, какой спойлер открыть/закрыть.

Атрибуты для спойлеров (элемент с атрибутом `data-spoller-body`):
* `data-spoller-body` - указывается для обозначения элемента спойлера. Далее ему будет присваиваться id, по которому будет определяться, какой спойлер открыть/закрыть;
* `data-duration` - указывает время открытия/закрытия определенного спойлера.

## JS
Инициализация:
```js
const spoller = new Spoller(document.querySelectorAll('.spoller', {
   activeClass: 'spoller-active',
}))
``` 

### Настройки
* `activeClass` - определяет, какой класс будет добавляться кнопке в открытом (активном) состоянии. По умолчанию `'spoller-active'`;
* `one` - спойлеры начинают работать как аккордеон (открывается только один спойлер). По умолчанию `false`;
* `await` - открытие следующего спойлера начинается сразу после закрытия предыдущего. Указывается вместе с атрибутом `data-spoller-one` или настройкой `one`. По умолчанию `false`;
* `afterSelect` - функция, которая срабатывает перед открытием/закрытием спойлера;
* `beforeSelect` - функция, которая срабатывает после открытия/закрытия спойлера.

## Методы
* `select.init()` - инициализация: установка аттрибутов, установка обработчика события;
* `select.destroy()` - удаление атрибутов и обработчика события;
* `select.open(id)` - принудительное открытие указанного спойлера. Метод возвращает промис;
* `select.close(id)` - принудительное закрытие указанного спойлера. Метод возвращает промис;
* `select.closeAll()` - принудительное закрытие всех спойлеров. Метод возвращает промис, который сработает после закрытия всех спойлеров (Promise.all());
* `select.select(id)` - полная логика открытия/закрытия спойлеров в зависимости от указанных настроек;
* `select.isActive(id)` - проверяет, является ли указанный спойлер активным.

## Параметры
* `spoller.spoller` - обертка спойлеров;
* `spoller.titles` - массив кнопок;
* `spoller.bodies` - массив спойлеров;
* `spoller.id` - номер элемента, который сейчас активен.

## Примеры
* Аккордеон. [Пример 2](https://sulky-cat.github.io/Spoller/demo/#ex_2). 
HTML
```html
<div data-spoller-one class="spoller">
   <button class="spoller-active" data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>

   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>

   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
</div>
```

* Аккордеон с ожиданием закрытия предыдущего элемента. [Пример 3](https://sulky-cat.github.io/Spoller/demo/#ex_3). 
HTML
```html
<div data-spoller-one data-spoller-await class="spoller">
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>

   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
   
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
</div>
```

* Вызов функций до/после открытия/закрытия. [Пример 4](https://sulky-cat.github.io/Spoller/demo/#ex_4). 
HTML
```html
<div class="spoller">
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>

   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
   
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
</div>
```
JS
```js
const spoller = new Spoller(document.querySelectorAll('.spoller', {
   beforeSelect: () => alert('Сработала функция beforeOpen()'),
   afterSelect: () => alert('Сработала функция afterOpen()'),
}))
```

* Изменение времени срабатывания. [Пример 5](https://sulky-cat.github.io/Spoller/demo/#ex_5). 
HTML
```html
<div class="spoller">
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-duration="1000" data-spoller-body> Тело спойлера </div>

   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-duration="500" data-spoller-body> Тело спойлера </div>
   
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-duration="800" data-spoller-body> Тело спойлера </div>
</div>
```

* Срабатывание по медиазапросу. [Пример 6](https://sulky-cat.github.io/Spoller/demo/#ex_6). 
HTML
```html
<div data-spoller-media="max,900px" class="spoller">
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>

   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
   
   <button data-spoller-title type="button">Нажми на меня</button>
   <div data-spoller-body> Тело спойлера </div>
</div>
```
