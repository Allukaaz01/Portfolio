let next = document.getElementById('next');
let prev = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let items = document.querySelectorAll('.carousel .item');
let countItem = items.length;
let active = 1;
let other_1 = null;
let other_2 = null;
next.onclick = () => {
  carousel.classList.remove('prev');
  carousel.classList.add('next');
  active = active + 1 >= countItem ? 0 : active + 1;
  other_1 = active - 1 < 0 ? countItem - 1 : active - 1;
  other_2 = active + 1 >= countItem ? 0 : active + 1;
  changeSlider();
}
prev.onclick = () => {
  carousel.classList.remove('next');
  carousel.classList.add('prev');
  active = active - 1 < 0 ? countItem - 1 : active - 1;
  other_1 = active + 1 >= countItem ? 0 : active + 1;
  other_2 = other_2 + 1 >= countItem ? 0 : other_1 + 1;
  changeSlider();
}
const changeSlider = () => {
  let itemOldActive = document.querySelector('.carousel .item.active');
  if(itemOldActive) itemOldActive.classList.remove('active');

  let itemOldOther_1 = document.querySelector('.carousel .item.other_1');
  if(itemOldOther_1) itemOldOther_1.classList.remove('other_1');

  let itemOldOther_2 = document.querySelector('.carousel .item.other_2');
  if(itemOldOther_2) itemOldOther_2.classList.remove('other_2');

  items.forEach(e => {
    e.querySelector('.image img').style.animation = 'none';
    e.querySelector('.image figcaption').style.animation = 'none';
    void e.offsetWidth;
    e.querySelector('.image img').style.animation = '';
    e.querySelector('.image figcaption').style.animation = '';
  })

  items[active].classList.add('active');
  items[other_1].classList.add('other_1');
  items[other_2].classList.add('other_2');

  clearInterval(autoPlay);
  autoPlay = setInterval(() => {
    next.click();
  }, 5000);
}
let autoPlay = setInterval(() => {
  next.click();
}, 5000);
// ========== Cart Functionality ==========
let cartItems = [];

// create cart container
let cart = document.createElement('div');
cart.classList.add('cart');
cart.innerHTML = `<h3>My Cart</h3><div class="cart-items"></div>`;
document.body.appendChild(cart);

const renderCart = () => {
  const cartItemsContainer = cart.querySelector('.cart-items');
  cartItemsContainer.innerHTML = '';

  cartItems.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.name}">
      <div class="details">
        <p>${item.name}</p>
        <p>${item.price}</p>
        <div class="controls">
          <button class="decrease">-</button>
          <span>${item.quantity}</span>
          <button class="increase">+</button>
          <button class="remove">Remove</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);

    // button listeners for each cart item
    cartItem.querySelector('.increase').onclick = () => {
      item.quantity++;
      renderCart();
    };
    cartItem.querySelector('.decrease').onclick = () => {
      if (item.quantity > 1) item.quantity--;
      renderCart();
    };
    cartItem.querySelector('.remove').onclick = () => {
      cartItems.splice(index, 1);
      renderCart();
    };
  });

  // show/hide cart based on items
  cart.style.display = cartItems.length ? 'block' : 'none';
};

// ========== Add To Cart using event delegation ==========
const carouselList = document.querySelector('.carousel .list');
carouselList.addEventListener('click', (e) => {
  if (!e.target.classList.contains('addToCart')) return;

  // get data from clicked item
  const item = e.target.closest('.item');
  const name = item.querySelector('h2').textContent;
  const price = item.querySelector('.price').textContent;
  const imgSrc = item.querySelector('.image img').src;

  // check if already in cart
  let existing = cartItems.find(i => i.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cartItems.push({ name, price, imgSrc, quantity: 1 });
  }

  renderCart();
});


