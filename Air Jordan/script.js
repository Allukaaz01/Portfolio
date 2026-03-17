// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const count = cart.length;
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Product page logic
if (window.location.pathname.includes('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const color = urlParams.get('color') || 'brown';
    const productImage = document.getElementById('product-image');
    const addToCartBtn = document.getElementById('add-to-cart');
    const priceElement = document.querySelector('.price');

    // Set image and price based on color
    const products = {
        brown: { img: 'images/brown AJ1.jpg', price: '$180' },
        green: { img: 'images/green AJ1.jpg', price: '$180' },
        blue: { img: 'images/blue AJ1.jpg', price: '$180' },
        grey: { img: 'images/grey diamond AJ1.jpg', price: '$180' },
        red: { img: 'images/superman AJ1.jpg', price: '$180' },
        ruby: { img: 'images/red AJ1.jpg', price: '$180' },
        cinna: { img: 'images/beige AJ1.jpg', price: '$180' },
        denim: { img: 'images/denim AJ1.jpg', price: '$180' },
        satin: { img: 'images/black AJ1.jpg', price: '$180' },
    };
    productImage.src = products[color].img;
    priceElement.textContent = products[color].price;

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        const item = {
            name: 'Air Jordan 1',
            color: color,
            price: products[color].price,
            img: products[color].img
        };
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Added to cart!');
    });
}

// Cart modal
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close');
const cartItems = document.getElementById('cart-items');

if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <h4>${item.name} (${item.color})</h4>
                    <p>${item.price}</p>
                </div>
                <button class="remove-btn" data-index="${index}">🗑️</button>
            `;
            cartItems.appendChild(itemDiv);
        });
        cartModal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target.classList.contains('remove-btn')) {
        const index = event.target.getAttribute('data-index');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        // Re-render cart
        cartItems.innerHTML = '';
        cart.forEach((item, idx) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <h4>${item.name} (${item.color})</h4>
                    <p>${item.price}</p>
                </div>
                <button class="remove-btn" data-index="${idx}">🗑️</button>
            `;
            cartItems.appendChild(itemDiv);
        });
    }
});

// Update cart count on load
updateCartCount();

// Set active navbar link
const currentPath = window.location.pathname;
if (currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('rayane site web/')) {
    const homeLink = document.querySelector('nav a[href="index.html"]');
    if (homeLink) homeLink.classList.add('active');
} else if (currentPath.includes('collection.html')) {
    const collectionLink = document.querySelector('nav a[href="collection.html"]');
    if (collectionLink) collectionLink.classList.add('active');
} else if (currentPath.includes('about.html')) {
    const aboutLink = document.querySelector('nav a[href="about.html"]');
    if (aboutLink) aboutLink.classList.add('active');
} else if (currentPath.includes('contact.html')) {
    const contactLink = document.querySelector('nav a[href="contact.html"]');
    if (contactLink) contactLink.classList.add('active');
}