document.addEventListener('DOMContentLoaded', () => {

    // ---- Image map for cart display ----
    const imgMap = {
        "1":  "https://images.unsplash.com/photo-1747858989102?w=80&q=70",
        "2":  "https://images.unsplash.com/photo-1701992679059?w=80&q=70",
        "3":  "https://images.unsplash.com/photo-1732861612244?w=80&q=70",
        "4":  "https://images.unsplash.com/photo-1779492907379?w=80&q=70",
        "5":  "https://images.unsplash.com/photo-1576426863848?w=80&q=70",
        "6":  "https://images.unsplash.com/photo-1597354984706?w=80&q=70",
        "7":  "https://images.unsplash.com/photo-1679394270597?w=80&q=70",
        "8":  "https://images.unsplash.com/photo-1632243575963?w=80&q=70",
        "9":  "https://images.unsplash.com/photo-1713768704571?w=80&q=70",
        "10": "https://images.unsplash.com/photo-1560869713?w=80&q=70",
        "11": "https://images.unsplash.com/photo-1713180760640?w=80&q=70",
        "12": "https://images.unsplash.com/photo-1674566566071?w=80&q=70"
    };

    // ---- Product Filtering ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const show = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
                if (show) {
                    card.style.display = 'block';
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = 'fadeIn 0.5s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ---- Cart Logic ----
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalPriceEl = document.getElementById('cart-total-price');

    let cart = [];

    cartIcon.addEventListener('click', () => cartOverlay.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    cartOverlay.addEventListener('click', e => {
        if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            updateCartUI();

            const original = btn.innerText;
            btn.innerText = '¡Agregado!';
            btn.style.backgroundColor = '#4caf50';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerText = original;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1500);
        });
    });

    function updateCartUI() {
        const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
        cartCountEl.innerText = totalItems;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img class="cart-item-img" src="${imgMap[item.id] || ''}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="price">€${item.price.toFixed(2)} × ${item.quantity}</div>
                        <button class="remove-item" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCartUI();
            });
        });

        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        cartTotalPriceEl.innerText = `€${total.toFixed(2)}`;
    }

    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) return;
        alert('¡Gracias por tu compra! En breve nos ponemos en contacto contigo.');
        cart = [];
        updateCartUI();
        cartOverlay.classList.remove('active');
    });
});
