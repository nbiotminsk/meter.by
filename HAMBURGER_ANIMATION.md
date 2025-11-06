# Анимация кнопки меню (Гамбургер → Крестик)

## Описание

Кнопка мобильного меню (гамбургер) теперь плавно превращается в крестик (X) при открытии меню и обратно при закрытии.

## Реализация

### CSS (в файле `css/mobile-fixes.css`)

Анимация создана с помощью CSS псевдоэлементов `::before` и `::after`, а также дополнительного `<span>` элемента:

- **Верхняя полоска** (`::before`) - поворачивается на 45° и перемещается в центр
- **Средняя полоска** (`<span>`) - исчезает (opacity: 0)
- **Нижняя полоска** (`::after`) - поворачивается на -45° и перемещается в центр

### HTML структура

```html
<button class="navbar-toggler collapsed" type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation">
    <span class="navbar-toggler-icon">
        <span></span>
    </span>
</button>
```

**Важно:**
- Класс `collapsed` должен быть добавлен по умолчанию
- Внутренний `<span></span>` обязателен для средней полоски
- Bootstrap автоматически управляет классом `collapsed`

## Состояния

### Закрыто (гамбургер)
```
═══  (верхняя полоска)
═══  (средняя полоска)
═══  (нижняя полоска)
```

### Открыто (крестик)
```
  ╲
   ╳  (полоски повернуты на 45° и -45°)
  ╱
```

## Параметры анимации

- **Длительность**: 0.3s
- **Easing**: ease
- **Размер полосок**: 22px × 2px
- **Цвет (светлая тема)**: rgba(0, 0, 0, 0.75)
- **Цвет (темная тема)**: rgba(255, 255, 255, 0.75)

## Обновленные файлы

### HTML страницы:
- ✅ `index.html`
- ✅ `prices.html`
- ✅ `documents.html`
- ✅ `videos.html`
- ✅ `news/index.html`

### CSS файлы:
- ✅ `css/mobile-fixes.css` - добавлена анимация

### Тестовые файлы:
- ✅ `test-hamburger.html` - демонстрация анимации

## Тестирование

### Открыть тестовую страницу:
```
test-hamburger.html
```

### Проверить на реальных страницах:
1. Откройте любую страницу сайта
2. Откройте DevTools (F12)
3. Включите режим устройства (Ctrl+Shift+M)
4. Выберите мобильное устройство (например, iPhone SE)
5. Нажмите на кнопку меню

### Что проверять:
- ✅ Плавная анимация превращения в крестик
- ✅ Плавная анимация обратно в гамбургер
- ✅ Работает в светлой теме
- ✅ Работает в темной теме
- ✅ Нет увеличения кнопки при нажатии
- ✅ Нет синей рамки при фокусе

## Совместимость

Анимация работает во всех современных браузерах:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Мобильные браузеры (iOS Safari, Chrome Mobile)

## Доступность

- Добавлен `aria-label="Toggle navigation"` для скринридеров
- Атрибут `aria-expanded` автоматически управляется Bootstrap
- Анимация не мешает работе с клавиатуры
- Сохранена возможность фокуса (без синей рамки)

## Технические детали

### Как работает:

1. **По умолчанию** (меню закрыто):
   - Кнопка имеет класс `collapsed`
   - Три полоски расположены горизонтально

2. **При клике**:
   - Bootstrap удаляет класс `collapsed`
   - CSS селектор `.navbar-toggler:not(.collapsed)` активируется
   - Запускается анимация трансформации

3. **При закрытии**:
   - Bootstrap добавляет класс `collapsed` обратно
   - Анимация возвращает полоски в исходное положение

### CSS селекторы:

```css
/* Закрытое состояние (по умолчанию) */
.navbar-toggler-icon::before { top: 12px; }
.navbar-toggler-icon::after { bottom: 12px; }
.navbar-toggler-icon span { opacity: 1; }

/* Открытое состояние */
.navbar-toggler:not(.collapsed) .navbar-toggler-icon::before {
    transform: translate(-50%, -50%) rotate(45deg);
}
.navbar-toggler:not(.collapsed) .navbar-toggler-icon::after {
    transform: translate(-50%, 50%) rotate(-45deg);
}
.navbar-toggler:not(.collapsed) .navbar-toggler-icon span {
    opacity: 0;
}
```

## Кастомизация

### Изменить скорость анимации:
```css
.navbar-toggler-icon::before,
.navbar-toggler-icon::after,
.navbar-toggler-icon span {
    transition: all 0.5s ease; /* было 0.3s */
}
```

### Изменить цвет:
```css
.navbar-toggler-icon::before,
.navbar-toggler-icon::after,
.navbar-toggler-icon span {
    background-color: #your-color;
}
```

### Изменить размер:
```css
.navbar-toggler {
    width: 50px;  /* было 40px */
    height: 50px; /* было 40px */
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after,
.navbar-toggler-icon span {
    width: 28px; /* было 22px */
}
```
