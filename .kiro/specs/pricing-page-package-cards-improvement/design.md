# Design Document

## Overview

Дизайн улучшенной секции "Пакетные предложения" на странице prices.html с фокусом на единообразие карточек, функциональную интеграцию с калькулятором стоимости и современный пользовательский интерфейс. Решение обеспечивает консистентный визуальный опыт и плавную интеграцию с существующим функционалом калькулятора.

## Architecture

### Component Structure
```
Package Cards Section
├── Container (Bootstrap container)
├── Section Header (title + description)
├── Cards Grid (Bootstrap row with g-4 gap)
│   ├── Package Card 1 (col-md-6 col-lg-4)
│   ├── Package Card 2 (col-md-6 col-lg-4)
│   ├── Package Card 3 (col-md-6 col-lg-4)
│   ├── Package Card 4 (col-md-6 col-lg-4)
│   ├── Package Card 5 (col-md-6 col-lg-4)
│   └── Package Card 6 (col-md-6 col-lg-4)
└── Integration with Pricing Calculator
```

### Technology Integration
- **Bootstrap 5.3**: Grid system, card components, utilities
- **Bootstrap Icons**: Package-specific icons
- **JavaScript**: Existing pricing calculator functionality
- **SweetAlert2**: User feedback notifications
- **CSS Flexbox**: Card content alignment

## Components and Interfaces

### 1. Package Card Component

**HTML Structure:**
```html
<div class="col-md-6 col-lg-4">
    <div class="card package-card h-100">
        <!-- Popular Badge (conditional) -->
        <div class="popular-badge" v-if="package.popular">
            <i class="bi bi-star-fill me-1"></i>Популярный
        </div>
        
        <!-- Card Header with Icon -->
        <div class="card-header text-center">
            <div class="package-icon mb-2">
                <i class="bi bi-[package-icon] fs-1 text-primary"></i>
            </div>
            <h4 class="mb-0">{{ package.name }}</h4>
        </div>
        
        <!-- Card Body -->
        <div class="card-body d-flex flex-column">
            <!-- Description -->
            <p class="card-text">{{ package.description }}</p>
            
            <!-- Pricing Info -->
            <div class="pricing-info mb-3">
                <div class="original-price">
                    <small class="text-muted text-decoration-line-through">
                        {{ package.originalPrice }} BYN
                    </small>
                </div>
                <div class="discount-price">
                    <span class="h2 text-primary fw-bold">
                        {{ package.discountPrice }} BYN
                    </span>
                </div>
                <div class="savings">
                    <small class="badge bg-success">
                        Экономия: {{ package.savings }} BYN
                    </small>
                </div>
            </div>
            
            <!-- Services List -->
            <div class="package-services mb-3 flex-grow-1">
                <h6>Включенные услуги:</h6>
                <ul class="list-unstyled services-list">
                    <li class="mb-1" v-for="service in package.services">
                        <i class="bi bi-check-circle text-success me-2"></i>
                        {{ service }}
                    </li>
                </ul>
            </div>
            
            <!-- Action Button (aligned to bottom) -->
            <div class="mt-auto">
                <button class="btn btn-primary btn-lg w-100 package-select-btn" 
                        :data-package="package.id" 
                        :data-price="package.discountPrice" 
                        :data-name="package.name">
                    <i class="bi bi-box-seam me-2"></i>Выбрать пакет
                </button>
            </div>
        </div>
    </div>
</div>
```

### 2. Package Icon Mapping

**Icon Assignment:**
```javascript
const packageIcons = {
    'basic-heat': 'bi-thermometer-half',
    'premium-heat': 'bi-star-fill', 
    'water-complete': 'bi-droplet-fill',
    'smart-home': 'bi-house-gear-fill',
    'business-solution': 'bi-building',
    'maintenance-annual': 'bi-calendar-check'
};
```

### 3. Card Layout System

**CSS Implementation:**
```css
/* Equal Height Cards */
.package-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
    position: relative;
}

.package-card.h-100 {
    height: 100% !important;
}

/* Card Body Flexbox Layout */
.package-card .card-body {
    display: flex;
    flex-direction: column;
}

/* Services List with Controlled Height */
.package-services {
    flex-grow: 1;
}

.services-list {
    max-height: 200px;
    overflow-y: auto;
}

/* Button Alignment to Bottom */
.package-card .mt-auto {
    margin-top: auto !important;
}

/* Popular Package Styling */
.popular-package {
    position: relative;
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    border-color: #ffc107 !important;
}

.popular-badge {
    position: absolute;
    top: -10px;
    right: 15px;
    background: linear-gradient(45deg, #ffc107, #ffb300);
    color: #000;
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(255,193,7,0.3);
    z-index: 10;
}

/* Package Icons */
.package-icon {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Hover Effects */
.package-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.popular-package:hover {
    transform: scale(1.02) translateY(-5px);
}

/* Button States */
.package-select-btn.btn-success {
    background-color: #198754;
    border-color: #198754;
}

.package-select-btn:disabled {
    opacity: 0.8;
    cursor: not-allowed;
}

/* Pricing Animation */
.savings {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
```

### 4. JavaScript Integration

**Package Selection Logic:**
```javascript
// Enhanced package selection handler
function handlePackageSelection(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const packageName = button.dataset.name || 'Неизвестный пакет';
    const price = parseInt(button.dataset.price) || 0;
    const packageId = button.dataset.package || 'unknown-package';
    
    // Check if package is already selected
    const existingIndex = selectedServices.findIndex(s => s.id === packageId);
    
    if (existingIndex > -1) {
        // Show already selected message
        Swal.fire({
            title: 'Пакет уже выбран',
            text: `Пакет "${packageName}" уже добавлен в корзину`,
            icon: 'info',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }
    
    // Confirmation dialog
    Swal.fire({
        title: packageName,
        html: `
            <div class="text-center">
                <i class="bi ${getPackageIcon(packageId)} fs-1 text-primary mb-3"></i>
                <p>Добавить пакет в корзину за <strong>${price} BYN</strong>?</p>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Добавить в корзину',
        cancelButtonText: 'Отмена',
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            addPackageToCart(packageId, packageName, price, button);
            showSuccessNotification(packageName, price);
            scrollToCalculator();
        }
    });
}

// Add package to cart with quantity support
function addPackageToCart(packageId, packageName, price, button) {
    selectedServices.push({
        id: packageId,
        price: price,
        name: packageName,
        isPackage: true,
        quantity: 1  // Default quantity
    });
    
    updateCalculator();
    updatePackageButton(button, true);
}

// Update package button state
function updatePackageButton(button, isSelected) {
    if (isSelected) {
        button.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>В корзине';
        button.className = 'btn btn-success btn-lg w-100 package-select-btn';
        button.disabled = true;
    } else {
        button.innerHTML = '<i class="bi bi-box-seam me-2"></i>Выбрать пакет';
        button.className = 'btn btn-primary btn-lg w-100 package-select-btn';
        button.disabled = false;
    }
}

// Success notification
function showSuccessNotification(packageName, price) {
    Swal.fire({
        title: 'Пакет добавлен!',
        html: `
            <div class="text-center">
                <i class="bi bi-check-circle-fill fs-1 text-success mb-3"></i>
                <p>"<strong>${packageName}</strong>" добавлен в корзину</p>
                <p class="text-muted">Стоимость: ${price} BYN</p>
            </div>
        `,
        icon: 'success',
        confirmButtonColor: '#198754',
        timer: 2000,
        showConfirmButton: false
    });
}

// Scroll to calculator
function scrollToCalculator() {
    const calculatorSection = document.getElementById('pricing-calculator');
    if (calculatorSection) {
        calculatorSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
}

// Get package icon
function getPackageIcon(packageId) {
    const icons = {
        'basic-heat': 'bi-thermometer-half',
        'premium-heat': 'bi-star-fill',
        'water-complete': 'bi-droplet-fill',
        'smart-home': 'bi-house-gear-fill',
        'business-solution': 'bi-building',
        'maintenance-annual': 'bi-calendar-check'
    };
    return icons[packageId] || 'bi-box-seam';
}
```

### 5. Responsive Design

**Breakpoint Behavior:**
```css
/* Mobile First Approach */
@media (max-width: 767.98px) {
    .package-card {
        margin-bottom: 1.5rem;
    }
    
    .package-icon {
        height: 50px;
    }
    
    .package-icon i {
        font-size: 2rem !important;
    }
    
    .popular-badge {
        font-size: 0.7rem;
        padding: 4px 10px;
    }
}

@media (min-width: 768px) and (max-width: 991.98px) {
    .col-md-6:nth-child(odd) {
        clear: left;
    }
}

@media (min-width: 992px) {
    .col-lg-4:nth-child(3n+1) {
        clear: left;
    }
}
```

### 6. Integration with Existing Calculator

**Calculator Update Logic:**
```javascript
// Enhanced calculator update for packages with quantity support
function updateCalculator() {
    const emptyCart = document.getElementById('empty-cart');
    const selectedServices = document.getElementById('selected-services');
    const servicesList = document.getElementById('services-list');
    const totalPriceEl = document.getElementById('total-price');
    
    if (this.selectedServices.length === 0) {
        emptyCart.style.display = 'block';
        selectedServices.style.display = 'none';
        this.totalPrice = 0;
    } else {
        emptyCart.style.display = 'none';
        selectedServices.style.display = 'block';
        
        // Update services list with package distinction and quantity
        servicesList.innerHTML = '';
        this.selectedServices.forEach(service => {
            const li = document.createElement('li');
            li.className = 'd-flex justify-content-between align-items-center mb-2 pb-2 border-bottom';
            
            const icon = service.isPackage ? 'bi-box-seam' : 'bi-gear';
            const badgeClass = service.isPackage ? 'bg-warning text-dark' : 'bg-info';
            const badgeText = service.isPackage ? 'Пакет' : 'Услуга';
            const quantity = service.quantity || 1;
            const totalServicePrice = service.price * quantity;
            
            li.innerHTML = `
                <div class="flex-grow-1">
                    <small class="fw-bold">
                        <i class="bi ${icon} me-1"></i>
                        ${service.name}
                        ${quantity > 1 ? `<span class="text-muted">x${quantity}</span>` : ''}
                    </small>
                    <br><small class="badge ${badgeClass} me-1">${badgeText}</small>
                    <div class="quantity-controls mt-1">
                        <label class="form-label form-label-sm">Количество:</label>
                        <div class="input-group input-group-sm" style="width: 120px;">
                            <button class="btn btn-outline-secondary quantity-btn" 
                                    data-action="decrease" 
                                    data-service-id="${service.id}" 
                                    type="button">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" 
                                   class="form-control text-center quantity-input" 
                                   value="${quantity}" 
                                   min="1" 
                                   max="99"
                                   data-service-id="${service.id}">
                            <button class="btn btn-outline-secondary quantity-btn" 
                                    data-action="increase" 
                                    data-service-id="${service.id}" 
                                    type="button">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="text-end">
                    <div class="price-info">
                        ${quantity > 1 ? `<small class="text-muted d-block">${service.price} BYN × ${quantity}</small>` : ''}
                        <span class="text-primary fw-bold">${totalServicePrice} BYN</span>
                    </div>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-service-btn" 
                            data-service-id="${service.id}" 
                            data-is-package="${service.isPackage || false}" 
                            title="Удалить">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `;
            servicesList.appendChild(li);
        });
        
        // Bind remove buttons and quantity controls
        bindRemoveButtons();
        bindQuantityControls();
        
        // Calculate total with quantities
        this.totalPrice = this.selectedServices.reduce((sum, service) => {
            const quantity = service.quantity || 1;
            return sum + (service.price * quantity);
        }, 0);
    }
    
    totalPriceEl.textContent = `${this.totalPrice} BYN`;
}

// Quantity control handlers
function bindQuantityControls() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceId = e.currentTarget.dataset.serviceId;
            const action = e.currentTarget.dataset.action;
            const service = selectedServices.find(s => s.id === serviceId);
            
            if (service) {
                const currentQuantity = service.quantity || 1;
                if (action === 'increase' && currentQuantity < 99) {
                    service.quantity = currentQuantity + 1;
                } else if (action === 'decrease' && currentQuantity > 1) {
                    service.quantity = currentQuantity - 1;
                }
                updateCalculator();
            }
        });
    });
    
    // Quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const serviceId = e.currentTarget.dataset.serviceId;
            const newQuantity = parseInt(e.currentTarget.value) || 1;
            const service = selectedServices.find(s => s.id === serviceId);
            
            if (service) {
                // Validate quantity (1-99)
                service.quantity = Math.max(1, Math.min(99, newQuantity));
                updateCalculator();
            }
        });
    });
}

// Remove package from cart
function removePackageFromCart(packageId) {
    const index = selectedServices.findIndex(s => s.id === packageId);
    if (index > -1) {
        selectedServices.splice(index, 1);
        
        // Reset package button
        const packageButton = document.querySelector(`[data-package="${packageId}"]`);
        if (packageButton) {
            updatePackageButton(packageButton, false);
        }
        
        updateCalculator();
    }
}
```

## Data Models

### Package Data Structure
```javascript
const packages = [
    {
        id: 'basic-heat',
        name: 'Базовый пакет (Тепло)',
        description: 'Поверка + монтаж счетчика тепла',
        originalPrice: 450,
        discountPrice: 400,
        savings: 50,
        popular: false,
        icon: 'bi-thermometer-half',
        services: [
            'Поверка счетчиков тепла',
            'Монтаж счетчика тепла'
        ]
    },
    {
        id: 'premium-heat',
        name: 'Премиум пакет (Тепло)',
        description: 'Полный комплекс: поверка, монтаж, подключение к дистанционному съему',
        originalPrice: 650,
        discountPrice: 550,
        savings: 100,
        popular: true,
        icon: 'bi-star-fill',
        services: [
            'Поверка счетчиков тепла',
            'Монтаж счетчика тепла',
            'Подключение счетчика тепла к системе'
        ]
    },
    {
        id: 'water-complete',
        name: 'Комплект для воды',
        description: 'Поверка и монтаж счетчиков холодной и горячей воды',
        originalPrice: 430,
        discountPrice: 380,
        savings: 50,
        popular: false,
        icon: 'bi-droplet-fill',
        services: [
            'Поверка счетчиков холодной воды',
            'Поверка счетчиков горячей воды',
            'Монтаж счетчика холодной воды',
            'Монтаж счетчика горячей воды'
        ]
    },
    {
        id: 'smart-home',
        name: 'Умный дом',
        description: 'Полная автоматизация учета: тепло + вода + дистанционный съем',
        originalPrice: 1200,
        discountPrice: 950,
        savings: 250,
        popular: true,
        icon: 'bi-house-gear-fill',
        services: [
            'Поверка счетчиков тепла',
            'Монтаж счетчика тепла',
            'Поверка счетчиков воды',
            'Монтаж счетчиков воды',
            'Дистанционный съем',
            'Настройка системы съема'
        ]
    },
    {
        id: 'business-solution',
        name: 'Бизнес решение',
        description: 'Комплексное решение для коммерческих объектов',
        originalPrice: 2500,
        discountPrice: 2000,
        savings: 500,
        popular: false,
        icon: 'bi-building',
        services: [
            'Комплексный монтаж узла учета',
            'Комплексная наладка',
            'Настройка системы съема',
            'Счетчик Вега NB-11',
            'Регистратор данных'
        ]
    },
    {
        id: 'maintenance-annual',
        name: 'Годовое обслуживание',
        description: 'Полное техническое обслуживание на 12 месяцев',
        originalPrice: 600,
        discountPrice: 500,
        savings: 100,
        popular: false,
        icon: 'bi-calendar-check',
        services: [
            'Ежемесячное обслуживание (12 мес)',
            'Мониторинг системы',
            'Техническая поддержка',
            'Ежемесячные отчеты'
        ]
    }
];
```

## Error Handling

### Package Selection Errors
```javascript
// Handle duplicate package selection
function handleDuplicateSelection(packageName) {
    Swal.fire({
        title: 'Пакет уже выбран',
        text: `Пакет "${packageName}" уже добавлен в корзину`,
        icon: 'info',
        confirmButtonColor: '#0d6efd'
    });
}

// Handle invalid package data
function handleInvalidPackage() {
    Swal.fire({
        title: 'Ошибка',
        text: 'Не удалось добавить пакет. Попробуйте еще раз.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
    });
}

// Handle calculator integration errors
function handleCalculatorError() {
    console.error('Calculator integration error');
    // Fallback to basic functionality
}
```

## Testing Strategy

### Visual Testing
- Проверка равной высоты всех карточек на разных экранах
- Тестирование выравнивания кнопок по нижнему краю
- Проверка отображения иконок для всех пакетов
- Тестирование популярных badge и их позиционирования

### Functional Testing
- Тестирование добавления пакетов в корзину
- Проверка обновления состояния кнопок
- Тестирование уведомлений SweetAlert2
- Проверка интеграции с калькулятором
- Тестирование удаления пакетов из корзины

### Responsive Testing
- Проверка на мобильных устройствах (320px-767px)
- Тестирование на планшетах (768px-991px)
- Проверка на десктопах (992px+)
- Тестирование grid layout на разных разрешениях

### Performance Testing
- Проверка скорости отрисовки карточек
- Тестирование плавности анимаций
- Проверка производительности при множественных кликах

## Accessibility

### WCAG 2.1 Compliance
- Alt атрибуты для всех иконок
- Достаточный цветовой контраст для всех элементов
- Keyboard navigation для всех интерактивных элементов
- Screen reader совместимость

### Implementation
- ARIA labels для кнопок пакетов
- Focus indicators для всех кликабельных элементов
- Семантическая разметка для списков услуг
- Proper heading hierarchy