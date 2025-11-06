# Design Document

## Overview

Дизайн веб-сайта **Meter.by** для системы дистанционного съема в Республике Беларусь представляет собой современный, легкий и отзывчивый интерфейс, построенный на Bootstrap 5.3 без использования Node.js. Сайт использует статические технологии с интерактивными элементами для создания привлекательного пользовательского опыта.

**Брендинг:**
- Название: Meter.by
- Домен: https://meter.by
- Email: info@meter.by
- Telegram: @meter_by
- Концепция: Лаконичное название, отражающее специализацию на приборах учета (meters) с белорусским доменом .by

## Architecture

### Technology Stack
- **Frontend Framework**: Bootstrap 5.3
- **JavaScript Libraries**: 
  - VanillaTilt.js для эффектов наклона карточек
  - SweetAlert2.js для модальных окон
  - Alpine.js для интерактивности
- **Icons**: Bootstrap Icons или Font Awesome
- **Data Management**: JSON файлы для блога и контента
- **Build Process**: Статические файлы без Node.js

### File Structure
```
/
├── index.html                 # Главная страница
├── prices.html                # Страница цен
├── videos.html                # Страница видео
├── css/
│   ├── bootstrap.min.css      # Bootstrap 5.3
│   ├── style.css              # Кастомные стили
│   ├── dark-theme.css         # Темная тема glassmorphism
│   └── responsive.css         # Адаптивные стили
├── js/
│   ├── bootstrap.bundle.min.js
│   ├── vanilla-tilt.min.js
│   ├── sweetalert2.min.js
│   ├── alpine.min.js
│   ├── jspdf.min.js           # PDF генератор
│   └── main.js                # Основная логика
├── data/
│   ├── blog.json              # Данные блога
│   ├── services.json          # Данные услуг
│   ├── documents.json         # Список документов
│   ├── prices.json            # Данные цен
│   ├── videos.json            # Данные YouTube видео
│   └── proposal-template.md   # Шаблон коммерческого предложения
├── images/
│   ├── placeholders/          # Заглушки изображений
│   ├── icons/                 # Иконки услуг
│   └── company-seal.png       # Печать компании для PDF
├── documents/                 # PDF файлы документов
└── sitemap.xml               # SEO карта сайта
```

## Components and Interfaces

### 1. Header Component
**Назначение**: Фиксированная навигация с центрированным меню

**Структура**:
- Логотип "Meter.by" с иконкой (слева)
- Центрированное навигационное меню
- Кнопка переключения темы (круглая)
- Кнопки мессенджеров Telegram/Viber (справа)

**Технические детали**:
- Bootstrap navbar с `fixed-top` классом
- Центрирование через `justify-content-center`
- Адаптивное меню для мобильных устройств
- Glassmorphism эффекты в темной теме
- Прямоугольные кнопки мессенджеров на десктопе, квадратные на мобильных

**Адаптивность навигации**:
- Desktop (≥992px): Полные кнопки с текстом "Telegram", "Viber"
- Mobile (<992px): Компактные кнопки только с иконками
- Автоматическое скрытие текста через CSS media queries

### 2. Hero Section
**Назначение**: Главный заголовок и призыв к действию

**Элементы**:
- Заголовок: "Подключение к системе дистанционного съема в Республике Беларусь"
- Краткое описание услуг
- Кнопки быстрого доступа к мессенджерам

### 3. Services Cards Component
**Назначение**: Интерактивные карточки услуг с эффектами

**Структура карточки**:
```html
<div class="card service-card" data-tilt>
  <div class="card-header">
    <i class="service-icon"></i>
    <h5>Название услуги</h5>
  </div>
  <div class="card-body">
    <img src="placeholder.jpg" alt="Заглушка">
    <p>Краткое описание</p>
  </div>
</div>
```

**Интерактивность**:
- VanillaTilt.js для эффекта наклона при hover
- SweetAlert2 модальные окна при клике
- Alpine.js для управления состоянием

### 4. Blog Component
**Назначение**: Динамический блог с JSON данными

**JSON структура** (`data/blog.json`):
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Заголовок новости",
      "date": "2024-01-15",
      "excerpt": "Краткое описание...",
      "content": "Полный текст новости...",
      "image": "placeholder.jpg"
    }
  ]
}
```

### 5. Documents Section
**Назначение**: Список документов для скачивания

**Функциональность**:
- Отображение названия, типа и размера файла
- Прямые ссылки на PDF файлы
- Иконки типов документов

### 6. Messenger Buttons
**Назначение**: Быстрый доступ к мессенджерам

**Реализация**:
- Telegram: `https://t.me/meter_by`
- Viber: `viber://chat?number=+375291234567`
- Фиксированные кнопки в правом нижнем углу
- Кнопки в навигации (прямоугольные с текстом на десктопе, иконки на мобильных)

**Адаптивность**:
- Desktop (≥992px): Прямоугольные кнопки с иконкой + текст
- Mobile (<992px): Компактные квадратные кнопки только с иконками
- Автоматическое скрытие текста через CSS media queries

**Glassmorphism стили для темной темы**:
```css
/* Навигационные кнопки */
[data-theme="dark"] .navbar .telegram-btn {
  background: linear-gradient(135deg, rgba(0, 136, 204, 0.3), rgba(0, 136, 204, 0.1));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 136, 204, 0.4);
  color: rgba(0, 136, 204, 1);
  box-shadow: 0 4px 15px rgba(0, 136, 204, 0.2);
}

[data-theme="dark"] .navbar .viber-btn {
  background: linear-gradient(135deg, rgba(102, 92, 172, 0.3), rgba(102, 92, 172, 0.1));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(102, 92, 172, 0.4);
  color: rgba(102, 92, 172, 1);
  box-shadow: 0 4px 15px rgba(102, 92, 172, 0.2);
}

/* Плавающие кнопки */
[data-theme="dark"] .messenger-btn.telegram-btn {
  background: linear-gradient(135deg, rgba(0, 136, 204, 0.4), rgba(0, 136, 204, 0.2));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 136, 204, 0.5);
  box-shadow: 0 8px 25px rgba(0, 136, 204, 0.3);
}
```

### 7. Theme Switcher Component
**Назначение**: Переключение между светлой и темной темами

**Реализация**:
- Кнопка переключения в header (круглая с иконкой)
- Сохранение выбора в localStorage
- Alpine.js для управления состоянием темы
- CSS переменные для цветовых схем
- Иконки: bi-moon (светлая тема) / bi-sun (темная тема)

**Glassmorphism стили для темной темы**:
```css
[data-theme="dark"] .theme-switcher {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--accent-neon);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
}

[data-theme="dark"] .theme-switcher:hover {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.1));
  border-color: rgba(0, 212, 255, 0.4);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
}
```

### 8. Dark Theme (Glassmorphism Style)
**Назначение**: Современная темная тема с эффектом стекла

**Характеристики**:
- Полупрозрачные элементы с backdrop-filter: blur()
- Градиентные границы
- Тонкие тени и свечения
- Размытые фоны для карточек и модальных окон

### 9. Commercial Proposal Generator
**Назначение**: Генерация персонализированного коммерческого предложения в PDF

**Компоненты**:
- Форма с полями: Название организации, УНП, Адрес
- Кнопка "Скачать коммерческое предложение"
- PDF генератор с использованием jsPDF
- Шаблон коммерческого предложения в Markdown

**Функциональность**:
- Валидация формы перед генерацией
- Вставка реквизитов клиента в PDF
- Добавление печати (изображение)
- Автоматическое скачивание готового файла

### 10. Pricing Page
**Назначение**: Отдельная страница с подробными ценами на все услуги

**Структура**:
- Таблицы цен по категориям услуг
- Карточки с пакетными предложениями
- Кнопка генерации коммерческого предложения
- Сравнительная таблица услуг

**Компоненты**:
- Адаптивные таблицы Bootstrap
- Интерактивные карточки с ценами
- Калькулятор стоимости услуг с выбором
- Интегрированная форма для генерации PDF
- Кнопка "Получить коммерческое предложение"

### 11. Video Gallery Page
**Назначение**: Страница с видео-контентом о услугах компании

**Функциональность**:
- Карточки с превью YouTube видео
- Модальные окна для просмотра видео
- Категоризация видео по типам услуг
- Lazy loading для оптимизации
- Секция "Нужна консультация?" с glassmorphism дизайном

**Компоненты**:
- YouTube API для получения превью
- SweetAlert2 модальные окна для видео
- Фильтрация по категориям
- Call-to-action секция с кнопками мессенджеров

### 12. Pricing Calculator
**Назначение**: Интерактивный калькулятор стоимости услуг

**Функциональность**:
- Выбор услуг через чекбоксы
- Автоматический расчет общей стоимости
- Отображение выбранных услуг
- Генерация персонализированного коммерческого предложения
- Модальное окно для ввода данных клиента

**Особенности**:
- Модальное окно не открывается автоматически
- Открывается только при нажатии кнопки "Получить коммерческое предложение"
- Проверка выбора хотя бы одной услуги
- x-cloak для предотвращения мигания контента

### 13. Responsive Design System
**Назначение**: Адаптивный дизайн для всех устройств

**Breakpoints**:
- Extra small: <576px (мобильные телефоны)
- Small: 576px-767px (большие телефоны)
- Medium: 768px-991px (планшеты)
- Large: 992px-1199px (десктопы)
- Extra large: ≥1200px (большие десктопы)

**Адаптивные элементы**:
- Навигационные кнопки мессенджеров
- Плавающие кнопки мессенджеров
- Карточки услуг (grid система)
- Модальные окна
- Типография (размеры заголовков)

## Data Models

### Service Model
```javascript
{
  id: number,
  title: string,
  category: string, // "verification", "installation", "pnr", "remote", "equipment"
  subcategory: string, // "heat", "water"
  description: string,
  detailedInfo: string,
  icon: string,
  image: string
}
```

### Blog Post Model
```javascript
{
  id: number,
  title: string,
  date: string, // ISO format
  excerpt: string,
  content: string,
  image: string,
  tags: string[]
}
```

### Document Model
```javascript
{
  id: number,
  title: string,
  type: string, // "certificate", "manual", "specification"
  filename: string,
  size: string,
  uploadDate: string
}
```

### Commercial Proposal Model
```javascript
{
  clientInfo: {
    companyName: string,
    unp: string, // УНП (Учетный номер плательщика)
    address: string
  },
  services: [
    {
      name: string,
      description: string,
      price: number,
      unit: string // "шт", "услуга", "м²"
    }
  ],
  totalAmount: number,
  validUntil: string, // дата действия предложения
  companyInfo: {
    name: string,
    address: string,
    phone: string,
    email: string,
    unp: string
  }
}
```

### Pricing Model
```javascript
{
  categories: [
    {
      id: string,
      name: string, // "Поверка приборов", "Монтаж счетчиков"
      description: string,
      services: [
        {
          id: string,
          name: string,
          description: string,
          price: number,
          unit: string,
          features: string[] // дополнительные особенности
        }
      ]
    }
  ],
  packages: [
    {
      id: string,
      name: string, // "Базовый пакет", "Премиум пакет"
      description: string,
      originalPrice: number,
      discountPrice: number,
      services: string[], // массив ID услуг
      popular: boolean // выделить как популярный
    }
  ]
}
```

### Video Model
```javascript
{
  videos: [
    {
      id: string,
      title: string,
      description: string,
      youtubeId: string, // ID YouTube видео
      category: string, // "verification", "installation", "pnr", "remote"
      thumbnail: string, // URL превью (автоматически из YouTube)
      duration: string, // "5:30"
      uploadDate: string,
      featured: boolean // рекомендуемое видео
    }
  ],
  categories: [
    {
      id: string,
      name: string,
      icon: string
    }
  ]
}
```

## Error Handling

### JavaScript Error Handling
- Try-catch блоки для всех AJAX запросов
- Fallback контент при ошибках загрузки JSON
- Graceful degradation для отключенного JavaScript

### User Experience
- Loading состояния для динамического контента
- Placeholder изображения при ошибках загрузки
- Информативные сообщения об ошибках через SweetAlert2

## Testing Strategy

### Manual Testing
- Кроссбраузерное тестирование (Chrome, Firefox, Safari, Edge)
- Адаптивность на различных устройствах
- Функциональность всех интерактивных элементов

### Performance Testing
- Скорость загрузки страниц
- Оптимизация изображений
- Минификация CSS/JS файлов

### SEO Testing
- Валидация HTML разметки
- Проверка meta тегов
- Тестирование структурированных данных
- Проверка sitemap.xml

## Visual Design

### Color Scheme

#### Light Theme
- Основной цвет: Синий (#0066CC) - ассоциация с технологиями
- Вторичный цвет: Зеленый (#28A745) - экология, энергосбережение
- Акцентный цвет: Оранжевый (#FD7E14) - призывы к действию
- Нейтральные: Серый (#6C757D), Белый (#FFFFFF)
- Footer: Прозрачный фон с тонкой границей rgba(0, 0, 0, 0.1)

#### Dark Theme (Glassmorphism)
**CSS Variables:**
```css
:root {
  --primary-color: #0066CC;
  --secondary-color: #28A745;
  --accent-color: #FD7E14;
  --neutral-color: #6C757D;
  --light-bg: #FFFFFF;
  --text-color: #212529;
}

[data-theme="dark"] {
  --bg-gradient: linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --text-color: #E8E8E8;
  --accent-neon: #00D4FF;
  --accent-pink: #FF6B6B;
}
```

**Основные элементы:**
- Фон: Темный градиент (#0F0F23 to #1A1A2E)
- Карточки: Полупрозрачный градиент с backdrop-filter: blur(15px)
- Границы: rgba(255, 255, 255, 0.15) с градиентными эффектами
- Текст: Светлый (#E8E8E8)
- Акценты: Неоновые оттенки (#00D4FF, #FF6B6B)
- Тени: Цветные свечения с акцентными цветами

**Специальные секции:**
- Hero Section: Градиент rgba(0, 212, 255, 0.15) + rgba(255, 107, 107, 0.15)
- Blog Section: Полупрозрачный фон rgba(26, 26, 46, 0.3)
- Proposal Section: Градиент rgba(0, 212, 255, 0.2) + rgba(255, 107, 107, 0.2)
- Footer: Прозрачный фон с границей rgba(255, 255, 255, 0.1)

### Typography
- Заголовки: Bootstrap heading classes (h1-h6)
- Основной текст: Bootstrap body text
- Кнопки: Bootstrap button classes

### Layout Principles
- Mobile-first подход
- Сетка Bootstrap 12-колонок
- Достаточные отступы и пространство
- Четкая иерархия контента

## SEO Implementation

### Meta Tags Structure
```html
<meta name="description" content="Дистанционный съем показаний счетчиков в Беларуси. Поверка, монтаж, ПНР счетчиков тепла и воды.">
<meta name="keywords" content="дистанционный съем, поверка счетчиков, монтаж счетчиков, Беларусь, учет тепла, учет воды">
<meta property="og:title" content="Подключение к системе дистанционного съема в Республике Беларусь">
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Система дистанционного съема",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BY"
  },
  "telephone": "+375XXXXXXXXX",
  "url": "https://example.com"
}
```

### Semantic HTML Structure
```html
<header>
  <nav>...</nav>
</header>
<main>
  <section id="hero">...</section>
  <section id="services">...</section>
  <section id="blog">...</section>
</main>
<footer>...</footer>
```

## Glassmorphism Implementation

### CSS Properties for Dark Theme
```css
/* Основные glassmorphism элементы */
.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
}

/* Навигация в темной теме */
[data-theme="dark"] .navbar {
  background: rgba(15, 15, 35, 0.8) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Карточки услуг */
[data-theme="dark"] .service-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
  color: var(--text-color);
}

[data-theme="dark"] .service-card:hover {
  box-shadow: 0 12px 40px rgba(0, 212, 255, 0.2);
  border-color: rgba(0, 212, 255, 0.3);
}

/* Hero секция с градиентом */
[data-theme="dark"] .hero-section {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 107, 107, 0.15)) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  position: relative;
}

[data-theme="dark"] .hero-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
}

/* Блог секция */
[data-theme="dark"] .bg-light {
  background: rgba(26, 26, 46, 0.3) !important;
  backdrop-filter: blur(15px);
}

[data-theme="dark"] .blog-post {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-color);
  transition: all 0.3s ease;
}

/* Секция коммерческого предложения */
[data-theme="dark"] .proposal-section {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(255, 107, 107, 0.2)) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 212, 255, 0.3);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

[data-theme="dark"] .proposal-form {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: var(--text-color) !important;
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
}

/* Секция консультации */
[data-theme="dark"] .consultation-section {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(255, 107, 107, 0.2)) !important;
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 212, 255, 0.3);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
}

/* Модальные окна */
[data-theme="dark"] .swal2-popup {
  background: rgba(26, 26, 46, 0.9) !important;
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-color) !important;
}

/* Footer прозрачный */
[data-theme="dark"] .footer {
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Кнопки в темной теме */
[data-theme="dark"] .btn-primary {
  background: linear-gradient(45deg, var(--accent-neon), var(--accent-pink));
  border: none;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

[data-theme="dark"] .btn-primary:hover {
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
  transform: translateY(-2px);
}

/* Мессенджер кнопки с фирменными цветами */
[data-theme="dark"] .navbar .telegram-btn {
  background: linear-gradient(135deg, rgba(0, 136, 204, 0.3), rgba(0, 136, 204, 0.1)) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 136, 204, 0.4) !important;
  color: rgba(0, 136, 204, 1) !important;
  box-shadow: 0 4px 15px rgba(0, 136, 204, 0.2);
}

[data-theme="dark"] .navbar .viber-btn {
  background: linear-gradient(135deg, rgba(102, 92, 172, 0.3), rgba(102, 92, 172, 0.1)) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(102, 92, 172, 0.4) !important;
  color: rgba(102, 92, 172, 1) !important;
  box-shadow: 0 4px 15px rgba(102, 92, 172, 0.2);
}

/* Theme switcher */
[data-theme="dark"] .theme-switcher {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: var(--accent-neon) !important;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
}
```

### Theme Switching Logic
```javascript
// Alpine.js компонент для переключения темы
Alpine.data('themeSwitch', () => ({
  isDark: localStorage.getItem('theme') === 'dark',
  
  toggle() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  },
  
  init() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }
}))
```

### PDF Generation Logic
```javascript
// Alpine.js компонент для генерации коммерческого предложения
Alpine.data('proposalGenerator', () => ({
  formData: {
    companyName: '',
    unp: '',
    address: ''
  },
  
  async generatePDF() {
    // Валидация формы
    if (!this.validateForm()) return;
    
    // Загрузка шаблона из Markdown
    const template = await fetch('data/proposal-template.md').then(r => r.text());
    
    // Создание PDF с jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Добавление логотипа и печати
    const sealImg = await this.loadImage('images/company-seal.png');
    
    // Заполнение шаблона данными клиента
    const content = this.fillTemplate(template, this.formData);
    
    // Генерация PDF контента
    this.addContentToPDF(doc, content, sealImg);
    
    // Скачивание файла
    doc.save(`Коммерческое_предложение_${this.formData.companyName}.pdf`);
  },
  
  validateForm() {
    return this.formData.companyName && this.formData.unp && this.formData.address;
  },
  
  fillTemplate(template, data) {
    return template
      .replace('{{COMPANY_NAME}}', data.companyName)
      .replace('{{UNP}}', data.unp)
      .replace('{{ADDRESS}}', data.address)
      .replace('{{DATE}}', new Date().toLocaleDateString('ru-RU'));
  }
}))
```

### Proposal Template Structure (proposal-template.md)
```markdown
# КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ

**Дата:** {{DATE}}

**Для:** {{COMPANY_NAME}}  
**УНП:** {{UNP}}  
**Адрес:** {{ADDRESS}}

## Услуги по дистанционному съему показаний

### 1. Поверка приборов учета
- Поверка счетчиков тепла: 150 BYN
- Поверка счетчиков воды: 80 BYN

### 2. Монтаж счетчиков
- Монтаж счетчика тепла: 300 BYN
- Монтаж счетчика воды: 120 BYN

### 3. Пуско-наладочные работы (ПНР)
- Балансировка системы отопления: 500 BYN
- Запуск системы отопления: 400 BYN

### 4. Дистанционный съем показаний
- Подключение к системе: 200 BYN
- Ежемесячное обслуживание: 50 BYN

### 5. Продажа оборудования
- Вега NB-11: 450 BYN

**Предложение действительно до:** {{VALID_UNTIL}}

---
*С уважением,*  
*Система дистанционного съема*  
*Республика Беларусь*
```

### Video Gallery Implementation
```javascript
// Alpine.js компонент для видео галереи
Alpine.data('videoGallery', () => ({
  videos: [],
  categories: [],
  selectedCategory: 'all',
  
  async init() {
    const data = await fetch('data/videos.json').then(r => r.json());
    this.videos = data.videos;
    this.categories = data.categories;
  },
  
  get filteredVideos() {
    if (this.selectedCategory === 'all') return this.videos;
    return this.videos.filter(video => video.category === this.selectedCategory);
  },
  
  openVideoModal(youtubeId, title) {
    Swal.fire({
      title: title,
      html: `
        <div class="video-container">
          <iframe width="100%" height="315" 
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" 
            frameborder="0" allowfullscreen>
          </iframe>
        </div>
      `,
      width: '80%',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'video-modal'
      }
    });
  },
  
  getYoutubeThumbnail(youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
}))
```

### Pricing Calculator Implementation
```javascript
// Alpine.js компонент для калькулятора цен
Alpine.data('pricingCalculator', () => ({
  selectedServices: [],
  totalPrice: 0,
  showProposalForm: false,
  clientData: {
    companyName: '',
    unp: '',
    address: ''
  },
  
  toggleService(serviceId, price, serviceName, description) {
    const index = this.selectedServices.findIndex(s => s.id === serviceId);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push({ 
        id: serviceId, 
        price: price, 
        name: serviceName,
        description: description 
      });
    }
    this.calculateTotal();
  },
  
  calculateTotal() {
    this.totalPrice = this.selectedServices.reduce((sum, service) => sum + service.price, 0);
  },
  
  isSelected(serviceId) {
    return this.selectedServices.some(s => s.id === serviceId);
  },
  
  openProposalForm() {
    if (this.selectedServices.length === 0) {
      Swal.fire({
        title: 'Выберите услуги',
        text: 'Пожалуйста, выберите хотя бы одну услугу для создания коммерческого предложения',
        icon: 'warning'
      });
      return;
    }
    this.showProposalForm = true;
  },
  
  async generateProposalFromCalculator() {
    if (!this.validateClientData()) {
      Swal.fire({
        title: 'Заполните все поля',
        text: 'Пожалуйста, заполните все обязательные поля',
        icon: 'error'
      });
      return;
    }
    
    // Загрузка шаблона
    const template = await fetch('data/proposal-template.md').then(r => r.text());
    
    // Создание PDF с выбранными услугами
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Заполнение данными из калькулятора
    const proposalData = {
      ...this.clientData,
      selectedServices: this.selectedServices,
      totalPrice: this.totalPrice,
      date: new Date().toLocaleDateString('ru-RU'),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
    };
    
    // Генерация персонализированного PDF
    await this.createCustomProposalPDF(doc, proposalData);
    
    // Скачивание
    doc.save(`Коммерческое_предложение_${this.clientData.companyName}.pdf`);
    
    // Закрытие формы
    this.showProposalForm = false;
    this.resetForm();
  },
  
  validateClientData() {
    return this.clientData.companyName && 
           this.clientData.unp && 
           this.clientData.address;
  },
  
  resetForm() {
    this.clientData = { companyName: '', unp: '', address: '' };
    this.selectedServices = [];
    this.totalPrice = 0;
  },
  
  async createCustomProposalPDF(doc, data) {
    // Добавление заголовка
    doc.setFontSize(18);
    doc.text('КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ', 20, 30);
    
    // Информация о клиенте
    doc.setFontSize(12);
    doc.text(`Дата: ${data.date}`, 20, 50);
    doc.text(`Для: ${data.companyName}`, 20, 65);
    doc.text(`УНП: ${data.unp}`, 20, 80);
    doc.text(`Адрес: ${data.address}`, 20, 95);
    
    // Выбранные услуги
    doc.text('Выбранные услуги:', 20, 120);
    let yPosition = 135;
    
    data.selectedServices.forEach((service, index) => {
      doc.text(`${index + 1}. ${service.name} - ${service.price} BYN`, 25, yPosition);
      yPosition += 15;
    });
    
    // Итоговая сумма
    doc.setFontSize(14);
    doc.text(`ИТОГО: ${data.totalPrice} BYN`, 20, yPosition + 20);
    
    // Действительно до
    doc.setFontSize(10);
    doc.text(`Предложение действительно до: ${data.validUntil}`, 20, yPosition + 40);
    
    // Добавление печати (если есть)
    try {
      const sealImg = await this.loadImage('images/company-seal.png');
      doc.addImage(sealImg, 'PNG', 150, yPosition + 30, 40, 40);
    } catch (e) {
      console.log('Печать не найдена');
    }
  },
  
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}))
```

## Performance Optimization

### Image Optimization
- WebP формат с fallback на JPEG
- Lazy loading для изображений
- Оптимизированные размеры для различных экранов

### CSS/JS Optimization
- Минификация всех файлов
- Критический CSS inline
- Асинхронная загрузка не критичных скриптов

### Caching Strategy
- Browser caching через HTTP headers
- Service Worker для offline функциональности (опционально)

## Accessibility

### WCAG 2.1 Compliance
- Alt атрибуты для всех изображений
- Достаточный цветовой контраст
- Keyboard navigation support
- Screen reader compatibility

### Implementation
- ARIA labels для интерактивных элементов
- Focus indicators для всех кликабельных элементов
- Семантическая HTML разметка