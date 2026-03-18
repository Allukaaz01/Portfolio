let nextButton = document.getElementById("next");
let prevButton = document.getElementById("prev");
let backButton = document.getElementById("back");
let seeMoreButtons = document.querySelectorAll(".seeMore");
let carousel = document.querySelector(".carousel");
let listHTML = document.querySelector(".carousel .list");

nextButton.onclick = function() {
  showSlider('next');
}
prevButton.onclick = function() {
  showSlider('prev');
}
let unAcceptClick;
const showSlider = (type) => {
  nextButton.style.pointerEvents = 'none';
  prevButton.style.pointerEvents = 'none';

  carousel.classList.remove('prev', 'next');
  let items = document.querySelectorAll('.carousel .list .item')
  if (type === 'next'){
    listHTML.appendChild(items[0]);
    // Force reflow to ensure DOM update
    void carousel.offsetHeight;
    carousel.classList.add('next');
  }else{
    let positionLast = items.length -1;
    listHTML.prepend(items[positionLast]);
    // Force reflow to ensure DOM update
    void carousel.offsetHeight;
    carousel.classList.add('prev');
  }
  
  clearTimeout(unAcceptClick);
  unAcceptClick = setTimeout(() => {
    nextButton.style.pointerEvents = 'auto';
    prevButton.style.pointerEvents = 'auto';
  }, 2000);
}

seeMoreButtons.forEach(button => {
  button.onclick = function(){
    carousel.classList.add('showDetail');
  }
})
backButton.onclick = function(){
  carousel.classList.remove('showDetail');
}

// Contact modal
const contactLink = document.getElementById('contact-link');
const contactModal = document.getElementById('contact-modal');
const contactCloseBtn = contactModal.querySelector('.close');

if (contactLink) {
  contactLink.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.style.display = 'block';
  });
}

if (contactCloseBtn) {
  contactCloseBtn.addEventListener('click', () => {
    contactModal.style.display = 'none';
  });
}

window.addEventListener('click', (event) => {
  if (event.target == contactModal) {
    contactModal.style.display = 'none';
  }
});

// Handle form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you could add form validation or send the data
    alert('Thank you for your message! We will get back to you soon.');
    contactModal.style.display = 'none';
    contactForm.reset();
  });
}

// Info modal
const infoLink = document.getElementById('info-link');
const infoModal = document.getElementById('info-modal');
const infoCloseBtn = infoModal.querySelector('.close');

if (infoLink) {
  infoLink.addEventListener('click', (e) => {
    e.preventDefault();
    infoModal.style.display = 'block';
  });
}

if (infoCloseBtn) {
  infoCloseBtn.addEventListener('click', () => {
    infoModal.style.display = 'none';
  });
}

window.addEventListener('click', (event) => {
  if (event.target == contactModal) {
    contactModal.style.display = 'none';
  }
  if (event.target == infoModal) {
    infoModal.style.display = 'none';
  }
});

// Cart functionality
let cart = [];
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCloseBtn = document.querySelector('.cart-close');
const checkoutBtn = document.getElementById('checkout-btn');

// Product data - in a real app, this would come from a database
const products = [
  {
    id: 1,
    name: 'Gentle Monster',
    price: 299,
    image: 'images/Sunglasses1.png',
    description: 'Looks calm. Hits hard. Gentle Monster balances sleek chrome aesthetics with a blazing orange lens.'
  },
  {
    id: 2,
    name: 'Dystopian Verge',
    price: 349,
    image: 'images/Sunglasses2.png',
    description: 'Bold and futuristic design with advanced lens technology.'
  },
  {
    id: 3,
    name: 'Cyber Punk',
    price: 399,
    image: 'images/Sunglasses3.png',
    description: 'Cutting-edge cyber punk aesthetics with premium materials.'
  },
  {
    id: 4,
    name: 'Neon Nights',
    price: 279,
    image: 'images/Sunglasses4.png',
    description: 'Vibrant neon colors with superior UV protection.'
  },
  {
    id: 5,
    name: 'Stealth Mode',
    price: 329,
    image: 'images/Sunglasses5.png',
    description: 'Sleek black design with tactical performance features.'
  }
];

// Cart functions
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = total.toFixed(2);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  updateCartCount();
  updateCartDisplay();
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  updateCartTotal();
  updateCartDisplay();
  saveCart();
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    updateCartCount();
    updateCartTotal();
    updateCartDisplay();
    saveCart();
  }
}

function updateCartDisplay() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  updateCartTotal();
}

function saveCart() {
  localStorage.setItem('oakleyCart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem('oakleyCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
    updateCartDisplay();
  }
}

// Event listeners
cartButton.addEventListener('click', () => {
  cartModal.style.display = 'block';
});

cartCloseBtn.addEventListener('click', () => {
  cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = 'none';
  }
});

checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Show 3D viewer with the first item in cart
  const firstItem = cart[0];
  const product = products.find(p => p.id === firstItem.id);
  if (product) {
    openImageViewer(product, firstItem.quantity);
  }
});

// 3D Image Viewer functionality
const imageViewer = document.getElementById('image-viewer');
const viewerImage = document.getElementById('viewer-image');
const viewerTitle = document.getElementById('viewer-title');
const viewerPrice = document.getElementById('viewer-price');
const closeViewer = document.getElementById('close-viewer');
const imageWrapper = document.querySelector('.image-wrapper');

let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;
let currentRotateX = 0, currentRotateY = 0;
let scale = 1;

function openImageViewer(product, quantity) {
  viewerImage.src = product.image;
  viewerTitle.textContent = product.name;
  viewerPrice.textContent = `$${product.price} × ${quantity} = $${(product.price * quantity).toFixed(2)}`;

  // Reset transforms
  currentRotateX = 0;
  currentRotateY = 0;
  scale = 1;
  updateImageTransform();

  imageViewer.style.display = 'block';
  cartModal.style.display = 'none';

  // Add event listeners for 3D interaction
  imageWrapper.addEventListener('mousedown', startDrag);
  imageWrapper.addEventListener('wheel', handleZoom);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);

  // Touch events for mobile
  imageWrapper.addEventListener('touchstart', startTouch);
  imageWrapper.addEventListener('touchmove', touchMove);
  imageWrapper.addEventListener('touchend', endTouch);
}

function closeImageViewer() {
  imageViewer.style.display = 'none';

  // Remove event listeners
  imageWrapper.removeEventListener('mousedown', startDrag);
  imageWrapper.removeEventListener('wheel', handleZoom);
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
  imageWrapper.removeEventListener('touchstart', startTouch);
  imageWrapper.removeEventListener('touchmove', touchMove);
  imageWrapper.removeEventListener('touchend', endTouch);
}

function startDrag(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  imageWrapper.style.cursor = 'grabbing';
}

function drag(e) {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  currentRotateY += deltaX * 0.5;
  currentRotateX -= deltaY * 0.5;

  updateImageTransform();

  startX = e.clientX;
  startY = e.clientY;
}

function endDrag() {
  isDragging = false;
  imageWrapper.style.cursor = 'grab';
}

function handleZoom(e) {
  e.preventDefault();
  const zoomSpeed = 0.1;
  scale += e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
  scale = Math.max(0.5, Math.min(3, scale)); // Limit zoom between 0.5x and 3x
  updateImageTransform();
}

function startTouch(e) {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }
}

function touchMove(e) {
  if (!isDragging || e.touches.length !== 1) return;
  e.preventDefault();

  const deltaX = e.touches[0].clientX - startX;
  const deltaY = e.touches[0].clientY - startY;

  currentRotateY += deltaX * 0.5;
  currentRotateX -= deltaY * 0.5;

  updateImageTransform();

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}

function endTouch() {
  isDragging = false;
}

function updateImageTransform() {
  const intensity = Math.abs(currentRotateX) + Math.abs(currentRotateY);
  const glowIntensity = Math.min(intensity / 100, 1);

  imageWrapper.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${scale})`;
  viewerImage.style.filter = `drop-shadow(0 0 ${30 + glowIntensity * 20}px rgba(220, 66, 42, ${0.3 + glowIntensity * 0.4}))`;
}

closeViewer.addEventListener('click', closeImageViewer);

// Close viewer when clicking outside the image
imageViewer.addEventListener('click', (e) => {
  if (e.target === imageViewer) {
    closeImageViewer();
  }
});

// Add to cart button functionality
document.querySelectorAll('.checkout button:first-child').forEach((button, index) => {
  button.addEventListener('click', () => {
    addToCart(index + 1);
    // Visual feedback
    button.textContent = 'Added!';
    button.style.background = '#4CAF50';
    setTimeout(() => {
      button.textContent = 'ADD TO CART';
      button.style.background = '';
    }, 1000);
  });
});

// Initialize cart on page load
loadCart();