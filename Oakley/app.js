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
    carousel.classList.add('next');
  }else{
    let positionLast = items.length -1;
    listHTML.prepend(items[positionLast]);
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