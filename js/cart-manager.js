// Cart Manager - Управление корзиной пакетов и услуг
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        // Инициализация обработчиков событий
        this.attachPackageButtonHandlers();
        this.updateAllButtonStates();
        
        // Обновляем счетчик корзины при загрузке
        this.updateCartBadge();
    }

    // Загрузка корзины из localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('shoppingCart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            return [];
        }
    }

    // Сохранение корзины в localStorage
    saveCart() {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
            this.updateCartBadge();
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    }

    // Добавление пакета в корзину
    addPackage(packageId, packageName, price) {
        // Проверяем, есть ли уже этот пакет в корзине
        const existingPackage = this.cart.find(item => item.id === packageId);
        
        if (existingPackage) {
            return false; // Пакет уже в корзине
        }

        // Добавляем новый пакет
        this.cart.push({
            id: packageId,
            name: packageName,
            price: price,
            type: 'package',
            quantity: 1,
            isPackage: true
        });

        this.saveCart();
        this.updateButtonState(packageId, true);
        return true;
    }

    // Удаление пакета из корзины
    removePackage(packageId) {
        this.cart = this.cart.filter(item => item.id !== packageId);
        this.saveCart();
        this.updateButtonState(packageId, false);
    }

    // Проверка наличия пакета в корзине
    hasPackage(packageId) {
        return this.cart.some(item => item.id === packageId);
    }

    // Получение общей стоимости корзины
    getTotalPrice() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0);
    }

    // Получение количества товаров в корзине
    getItemCount() {
        return this.cart.length;
    }

    // Очистка корзины
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateAllButtonStates();
    }

    // Обновление состояния кнопки пакета
    updateButtonState(packageId, isAdded) {
        const button = document.querySelector(`[data-package="${packageId}"]`);
        if (!button) return;

        if (isAdded) {
            button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Добавлено';
            button.classList.remove('btn-primary');
            button.classList.add('btn-success', 'added');
            button.disabled = false;
        } else {
            button.innerHTML = '<i class="bi bi-box-seam me-2"></i>Выбрать пакет';
            button.classList.remove('btn-success', 'added');
            button.classList.add('btn-primary');
            button.disabled = false;
        }
    }

    // Обновление состояния всех кнопок
    updateAllButtonStates() {
        document.querySelectorAll('.package-select-btn').forEach(button => {
            const packageId = button.dataset.package;
            const isAdded = this.hasPackage(packageId);
            this.updateButtonState(packageId, isAdded);
        });
    }

    // Обновление счетчика корзины в навигации
    updateCartBadge() {
        const count = this.getItemCount();
        let badge = document.querySelector('.cart-badge');
        
        if (!badge && count > 0) {
            // Создаем бейдж, если его нет
            const navbarBrand = document.querySelector('.navbar-brand');
            if (navbarBrand) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                navbarBrand.appendChild(badge);
            }
        }
        
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    // Обработчики событий для кнопок пакетов
    attachPackageButtonHandlers() {
        document.querySelectorAll('.package-select-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handlePackageButtonClick(button);
            });
        });
    }

    // Обработка клика по кнопке пакета
    handlePackageButtonClick(button) {
        const packageId = button.dataset.package;
        const packageName = button.dataset.name || 'Неизвестный пакет';
        const price = parseInt(button.dataset.price) || 0;

        // Проверяем, добавлен ли уже пакет
        if (this.hasPackage(packageId)) {
            // Показываем диалог удаления
            this.showRemoveDialog(packageId, packageName);
        } else {
            // Показываем диалог добавления
            this.showAddDialog(packageId, packageName, price);
        }
    }

    // Диалог добавления пакета
    showAddDialog(packageId, packageName, price) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Добавить пакет?',
                html: `
                    <div class="text-center">
                        <i class="bi bi-box-seam fs-1 text-primary mb-3"></i>
                        <p class="mb-2"><strong>${packageName}</strong></p>
                        <p class="text-muted">Стоимость: <strong>${price} BYN</strong></p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Добавить',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    const added = this.addPackage(packageId, packageName, price);
                    if (added) {
                        Swal.fire({
                            title: 'Пакет добавлен!',
                            html: `
                                <div class="text-center">
                                    <i class="bi bi-check-circle fs-1 text-success mb-3"></i>
                                    <p><strong>${packageName}</strong> добавлен в корзину</p>
                                    <p class="text-muted">Всего в корзине: ${this.getItemCount()} товаров</p>
                                    <p class="text-muted">Общая стоимость: <strong>${this.getTotalPrice()} BYN</strong></p>
                                </div>
                            `,
                            icon: 'success',
                            confirmButtonText: 'Продолжить',
                            confirmButtonColor: '#198754'
                        });
                    }
                }
            });
        } else {
            const confirmed = confirm(`Добавить пакет "${packageName}" в корзину за ${price} BYN?`);
            if (confirmed) {
                const added = this.addPackage(packageId, packageName, price);
                if (added) {
                    alert(`Пакет "${packageName}" добавлен в корзину!`);
                }
            }
        }
    }

    // Диалог удаления пакета
    showRemoveDialog(packageId, packageName) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Удалить пакет?',
                html: `
                    <div class="text-center">
                        <i class="bi bi-trash fs-1 text-danger mb-3"></i>
                        <p>Удалить <strong>${packageName}</strong> из корзины?</p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Удалить',
                cancelButtonText: 'Отмена',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.removePackage(packageId);
                    Swal.fire({
                        title: 'Удалено!',
                        text: `${packageName} удален из корзины`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#198754'
                    });
                }
            });
        } else {
            const confirmed = confirm(`Удалить пакет "${packageName}" из корзины?`);
            if (confirmed) {
                this.removePackage(packageId);
                alert(`Пакет "${packageName}" удален из корзины`);
            }
        }
    }

    // Показать содержимое корзины
    showCart() {
        if (this.cart.length === 0) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Корзина пуста',
                    text: 'Добавьте пакеты или услуги в корзину',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            } else {
                alert('Корзина пуста');
            }
            return;
        }

        const cartItems = this.cart.map(item => `
            <div class="cart-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                <div>
                    <strong>${item.name}</strong>
                    <br>
                    <small class="text-muted">${item.price} BYN</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="cartManager.removePackage('${item.id}'); cartManager.showCart();">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');

        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Корзина',
                html: `
                    <div class="cart-content">
                        ${cartItems}
                        <div class="cart-total mt-3 pt-3 border-top">
                            <h5>Итого: <strong>${this.getTotalPrice()} BYN</strong></h5>
                            <p class="text-muted">Товаров: ${this.getItemCount()}</p>
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Оформить заказ',
                cancelButtonText: 'Закрыть',
                confirmButtonColor: '#198754',
                cancelButtonColor: '#6c757d',
                width: '600px'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.checkout();
                }
            });
        }
    }

    // Оформление заказа
    checkout() {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Оформление заказа',
                html: `
                    <div class="text-center">
                        <i class="bi bi-check-circle fs-1 text-success mb-3"></i>
                        <p>Функция оформления заказа будет доступна в ближайшее время</p>
                        <p class="text-muted">Пожалуйста, свяжитесь с нами для оформления заказа</p>
                    </div>
                `,
                icon: 'info',
                confirmButtonText: 'Связаться',
                confirmButtonColor: '#0d6efd'
            });
        } else {
            alert('Для оформления заказа свяжитесь с нами');
        }
    }
}

// Инициализация менеджера корзины при загрузке страницы
let cartManager;

document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    
    // Добавляем кнопку корзины в навигацию, если её нет
    addCartButtonToNav();
});

// Добавление кнопки корзины в навигацию
function addCartButtonToNav() {
    const navbar = document.querySelector('.navbar .container');
    if (!navbar) return;

    // Проверяем, есть ли уже кнопка корзины
    if (document.querySelector('.cart-button')) return;

    // Создаем кнопку корзины
    const cartButton = document.createElement('button');
    cartButton.className = 'btn btn-outline-primary btn-sm cart-button ms-2';
    cartButton.innerHTML = '<i class="bi bi-cart3"></i> <span class="cart-count">0</span>';
    cartButton.onclick = () => cartManager.showCart();

    // Добавляем стили для кнопки
    const style = document.createElement('style');
    style.textContent = `
        .cart-button {
            position: relative;
            transition: all 0.3s ease;
        }
        .cart-button:hover {
            transform: translateY(-2px);
        }
        .cart-count {
            font-weight: 600;
            margin-left: 0.25rem;
        }
        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #dc3545;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);

    // Вставляем кнопку в навигацию
    const messengerButtons = navbar.querySelector('.d-flex.align-items-center');
    if (messengerButtons) {
        messengerButtons.insertBefore(cartButton, messengerButtons.querySelector('.d-flex'));
    }

    // Обновляем счетчик
    updateCartCount();
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount && cartManager) {
        const count = cartManager.getItemCount();
        cartCount.textContent = count;
        
        // Меняем стиль кнопки в зависимости от количества товаров
        const cartButton = document.querySelector('.cart-button');
        if (cartButton) {
            if (count > 0) {
                cartButton.classList.remove('btn-outline-primary');
                cartButton.classList.add('btn-primary');
            } else {
                cartButton.classList.remove('btn-primary');
                cartButton.classList.add('btn-outline-primary');
            }
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
