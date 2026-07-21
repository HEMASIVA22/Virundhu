/* ==========================================================================
   VIRUNDHU — MULTI-PAGE APPLICATION CONTROLLER & CART (VANILLA JAVASCRIPT)
   ========================================================================== */

// Load Clerk script programmatically
(function() {
  const script = document.createElement('script');
  script.src = 'https://cdn.clerk.com/public/clerk.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  
  script.onload = async () => {
    const Clerk = window.Clerk;
    if (Clerk) {
      try {
        await Clerk.load({
          publishableKey: 'pk_test_YXBwYXJlbnQtam9leS04NS5jbGVyay5hY2NvdW50cy5kZXYk'
        });
        
        // Sync user state to local storage to be compatible with existing cart state
        const syncState = () => {
          if (Clerk.user) {
            localStorage.setItem('virundhu_user', Clerk.user.primaryEmailAddress.emailAddress);
          } else {
            localStorage.removeItem('virundhu_user');
          }
          if (typeof window.updateLoginButtonState === 'function') {
            window.updateLoginButtonState();
          }
        };

        syncState();
        Clerk.addListener(syncState);
      } catch (err) {
        console.error('Error loading Clerk JS SDK:', err);
      }
    }
  };
  document.head.appendChild(script);
})();

// 1. COMPREHENSIVE DATASET (25 Food Items)
const foodCatalog = [
  { id: 'f1', name: 'Ghee Roast Dosa', price: 120, hotel: 'A2B Adyar Ananda Bhavan', category: 'South Indian', rating: 4.8, time: '15 mins', image: 'assets/dish-dosa.jpg', desc: 'Crispy, paper-thin golden crepe roasted with pure cow ghee.', macros: { cal: 320, carbs: '44g', fat: '14g', prot: '6g' } },
  { id: 'f2', name: 'Soft Mallipoo Idli', price: 80, hotel: 'Murugan Idli Shop', category: 'South Indian', rating: 4.9, time: '10 mins', image: 'assets/dish-dosa.jpg', desc: 'Warm steamed fluffy rice cakes served with four signature chutneys.', macros: { cal: 180, carbs: '36g', fat: '1g', prot: '4g' } },
  { id: 'f3', name: 'Thalappakatti Mutton Biryani', price: 340, hotel: 'Dindigul Thalappakatti', category: 'Biryani', rating: 4.8, time: '30 mins', image: 'assets/dish-biryani.jpg', desc: 'Aromatic Seeraga Samba rice cooked with tender pieces of mutton.', macros: { cal: 560, carbs: '65g', fat: '22g', prot: '28g' } },
  { id: 'f4', name: 'SS Chicken Dum Biryani', price: 260, hotel: 'SS Hyderabad Biryani', category: 'Biryani', rating: 4.7, time: '25 mins', image: 'assets/dish-biryani.jpg', desc: 'Classic Hyderabadi style slow cooked chicken dum biryani.', macros: { cal: 520, carbs: '60g', fat: '20g', prot: '24g' } },
  { id: 'f5', name: 'Farmhouse Cheese Burst Pizza', price: 390, hotel: 'Domino\'s Pizza', category: 'Pizza', rating: 4.5, time: '20 mins', image: 'assets/dish-pizza.jpg', desc: 'Loaded with capsicum, onion, tomato & fresh mushroom with cheese burst base.', macros: { cal: 680, carbs: '80g', fat: '28g', prot: '18g' } },
  { id: 'f6', name: 'Original Chicken 1965', price: 250, hotel: 'Buhari Hotel', category: 'North Indian', rating: 4.6, time: '25 mins', image: 'assets/restaurant.jpg', desc: 'The legendary deep fried spicy chicken starter invented by Buhari.', macros: { cal: 410, carbs: '12g', fat: '24g', prot: '32g' } },
  { id: 'f7', name: 'Crispy Veg Whopper Burger', price: 170, hotel: 'Burger King', category: 'Fast Food', rating: 4.3, time: '15 mins', image: 'assets/dish-dessert.jpg', desc: 'Flame-grilled crunchy plant-based patty with fresh veggies and mayonnaise.', macros: { cal: 450, carbs: '52g', fat: '18g', prot: '11g' } },
  { id: 'f8', name: 'Poori Masala', price: 90, hotel: 'Sangeetha Veg Restaurant', category: 'South Indian', rating: 4.7, time: '12 mins', image: 'assets/dish-dosa.jpg', desc: 'Fluffy golden fried whole wheat puffed bread served with potato masala.', macros: { cal: 310, carbs: '40g', fat: '12g', prot: '7g' } },
  { id: 'f9', name: 'Channa Bhatura', price: 140, hotel: 'Sangeetha Veg Restaurant', category: 'North Indian', rating: 4.6, time: '15 mins', image: 'assets/restaurant.jpg', desc: 'Giant puffed leavened bread served with spicy chickpea gravy.', macros: { cal: 480, carbs: '62g', fat: '19g', prot: '14g' } },
  { id: 'f10', name: 'Classic Paneer Butter Masala', price: 220, hotel: 'Saravana Bhavan', category: 'North Indian', rating: 4.5, time: '20 mins', image: 'assets/restaurant.jpg', desc: 'Soft cottage cheese cubes in rich, creamy spiced tomato gravy.', macros: { cal: 390, carbs: '14g', fat: '28g', prot: '16g' } },
  { id: 'f11', name: 'Schezwan Fried Noodles', price: 180, hotel: 'Chinese Wok', category: 'Fast Food', rating: 4.4, time: '18 mins', image: 'assets/dish-biryani.jpg', desc: 'Spicy stir-fried hakka noodles with fresh seasonal veggies and schezwan sauce.', macros: { cal: 380, carbs: '54g', fat: '14g', prot: '8g' } },
  { id: 'f12', name: 'Chocolate Lava Waffles', price: 150, hotel: 'Dessert Zone', category: 'Dessert', rating: 4.7, time: '15 mins', image: 'assets/dish-dessert.jpg', desc: 'Freshly baked warm waffle drizzled with rich Belgian dark chocolate.', macros: { cal: 420, carbs: '58g', fat: '18g', prot: '5g' } },
  { id: 'f13', name: 'Parotta Combo (3 Pcs)', price: 110, hotel: 'Buhari Hotel', category: 'South Indian', rating: 4.6, time: '15 mins', image: 'assets/rider.jpg', desc: 'Flaky layered flatbread served with spicy vegetable salna.', macros: { cal: 460, carbs: '68g', fat: '16g', prot: '9g' } },
  { id: 'f14', name: 'Triple Chocolate Pastry', price: 120, hotel: 'Dessert Zone', category: 'Dessert', rating: 4.8, time: '10 mins', image: 'assets/dish-dessert.jpg', desc: 'Layered dark, milk and white chocolate sponge cake.', macros: { cal: 350, carbs: '45g', fat: '16g', prot: '4g' } },
  { id: 'f15', name: 'Garlic Breadsticks', price: 110, hotel: 'Domino\'s Pizza', category: 'Pizza', rating: 4.4, time: '15 mins', image: 'assets/dish-pizza.jpg', desc: 'Baked garlic breadsticks with cheese dip.', macros: { cal: 260, carbs: '32g', fat: '10g', prot: '6g' } },
  { id: 'f16', name: 'Paneer Tikka Roll', price: 160, hotel: 'BBQ Nation', category: 'North Indian', rating: 4.5, time: '15 mins', image: 'assets/restaurant.jpg', desc: 'Spicy grilled cottage cheese wrapped in flatbread with mint chutney.', macros: { cal: 340, carbs: '38g', fat: '14g', prot: '12g' } },
  { id: 'f17', name: 'South Indian Veg Meals', price: 180, hotel: 'Saravana Bhavan', category: 'South Indian', rating: 4.7, time: '20 mins', image: 'assets/hero-feast.jpg', desc: 'Traditional leaf meal with rice, sambar, rasam, kootu, poriyal, papad and curd.', macros: { cal: 620, carbs: '95g', fat: '12g', prot: '14g' } },
  { id: 'f18', name: 'Steamed Chicken Momos', price: 130, hotel: 'Chinese Wok', category: 'Fast Food', rating: 4.4, time: '15 mins', image: 'assets/rider.jpg', desc: 'Steamed dumplings packed with juicy seasoned chicken fillings.', macros: { cal: 280, carbs: '34g', fat: '8g', prot: '16g' } },
  { id: 'f19', name: 'French Fries Extra Large', price: 100, hotel: 'Burger King', category: 'Fast Food', rating: 4.3, time: '10 mins', image: 'assets/dish-pizza.jpg', desc: 'Crispy golden salted potatoes served with garlic dip.', macros: { cal: 310, carbs: '42g', fat: '14g', prot: '3g' } },
  { id: 'f20', name: 'Gobi Manchurian Dry', price: 150, hotel: 'Chinese Wok', category: 'Fast Food', rating: 4.4, time: '18 mins', image: 'assets/dish-biryani.jpg', desc: 'Crispy cauliflower florets tossed in tangy soya-chili garlic sauce.', macros: { cal: 290, carbs: '36g', fat: '12g', prot: '5g' } },
  { id: 'f21', name: 'Sweet Jigarthanda', price: 90, hotel: 'Murugan Idli Shop', category: 'Dessert', rating: 4.9, time: '10 mins', image: 'assets/dish-dessert.jpg', desc: 'Chilled traditional Madurai milk dessert with almond gum and ice cream.', macros: { cal: 270, carbs: '44g', fat: '8g', prot: '6g' } },
  { id: 'f22', name: 'Crispy Spring Rolls', price: 120, hotel: 'Chinese Wok', category: 'Fast Food', rating: 4.3, time: '12 mins', image: 'assets/dish-pizza.jpg', desc: 'Crispy rolls filled with shredded seasonal veggies served with sweet chili sauce.', macros: { cal: 240, carbs: '30g', fat: '10g', prot: '4g' } },
  { id: 'f23', name: 'Tandoori Chicken (Half)', price: 280, hotel: 'BBQ Nation', category: 'North Indian', rating: 4.6, time: '25 mins', image: 'assets/restaurant.jpg', desc: 'Spiced chicken marinated in yogurt and cooked in clay oven.', macros: { cal: 380, carbs: '8g', fat: '20g', prot: '42g' } },
  { id: 'f24', name: 'Onion Uttapam', price: 100, hotel: 'A2B Adyar Ananda Bhavan', category: 'South Indian', rating: 4.7, time: '15 mins', image: 'assets/dish-dosa.jpg', desc: 'Thick rice pancake topped with fresh chopped onions and coriander.', macros: { cal: 280, carbs: '42g', fat: '8g', prot: '5g' } },
  { id: 'f25', name: 'Hot Gulab Jamun (2 Pcs)', price: 60, hotel: 'Saravana Bhavan', category: 'Dessert', rating: 4.8, time: '8 mins', image: 'assets/dish-dessert.jpg', desc: 'Soft golden milk balls soaked in sweet cardamom sugar syrup.', macros: { cal: 300, carbs: '52g', fat: '9g', prot: '4g' } }
];

// 2. DOM ELEMENT REFERENCES
const foodCatalogGrid = document.getElementById('food-catalog-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('restaurant-search');
const searchBtn = document.getElementById('search-btn');

// Cart DOM elements
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Mobile Menu
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const toast = document.getElementById('toast');

// 3. APPLICATION LIFE-CYCLE
document.addEventListener('DOMContentLoaded', () => {
  initCartState();
  initHeaderScroll();
  initMobileMenu();
  initFAQ();
  initFormModals();
  updateLoginButtonState();

  // Page Specific Controllers
  if (document.getElementById('marquee-track-1')) {
    renderMarquee();
  }
  if (foodCatalogGrid) {
    renderCatalog(foodCatalog);
    initCatalogFilters();
  }
  if (document.getElementById('detail-grid-container')) {
    initDetailPage();
  }
});

// 4. HEADER NAV SCROLL EFFECTS
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.remove('transparent-nav');
    } else if (document.querySelector('.hero-full-bleed')) {
      header.classList.add('transparent-nav');
    }
  });
}

// 5. SWIGGY INFINITE FOOD CAROUSEL MARQUEE
function renderMarquee() {
  const track = document.getElementById('marquee-track-1');
  if (!track) return;

  // Build list of 25 marquee food items
  const itemsHTML = foodCatalog.map(item => `
    <div class="marquee-item" onclick="navigateToDetail('${item.id}')" style="cursor:pointer;">
      <div class="marquee-img-box">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <h4>${item.name}</h4>
    </div>
  `).join('');

  // Duplicate track contents to create seamless looping scrolling
  track.innerHTML = itemsHTML + itemsHTML;
}

function navigateToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

// 6. EXPLORE CATALOG CONTROLLER
function renderCatalog(data) {
  if (!foodCatalogGrid) return;
  
  if (data.length === 0) {
    foodCatalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 64px 0; opacity: 0.7;">
        <i class="fa-solid fa-utensils" style="font-size: 40px; margin-bottom: 16px; color: var(--color-ember-orange); display: block;"></i>
        <h3>No dishes matched your search</h3>
        <p>Try searching for other cravings!</p>
      </div>
    `;
    return;
  }

  foodCatalogGrid.innerHTML = data.map(food => `
    <div class="food-card" onclick="navigateToDetail('${food.id}')">
      <div class="food-card__img-box">
        <img src="${food.image}" alt="${food.name}">
        <span class="food-card__price-tag">₹${food.price}</span>
      </div>
      <div class="food-card__body">
        <span class="food-card__hotel">${food.hotel}</span>
        <h3 class="food-card__title">${food.name}</h3>
        <div class="food-card__rating-row" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span>★ ${food.rating}</span>
            <span style="margin-left: 8px;"><i class="fa-regular fa-clock"></i> ${food.time}</span>
          </div>
          <button class="btn" onclick="event.stopPropagation(); addToCart(\`${food.name.replace(/`/g, '\\`').replace(/'/g, "\\'")}\`, ${food.price}, \`${food.hotel.replace(/`/g, '\\`').replace(/'/g, "\\'")}\`)" style="padding: 6px 12px; font-size: 12px; border-radius: 8px; font-weight: 700; background-color: var(--color-ember-orange); color: white; border: none; cursor: pointer; transition: transform 0.2s ease;">
            + Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function initCatalogFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      if (cat === 'all') {
        renderCatalog(foodCatalog);
      } else {
        const filtered = foodCatalog.filter(f => f.category === cat);
        renderCatalog(filtered);
      }
    });
  });

  // Search filter
  if (searchBtn && searchInput) {
    const filterSearch = () => {
      const q = searchInput.value.toLowerCase().trim();
      if (!q) {
        renderCatalog(foodCatalog);
        return;
      }
      const filtered = foodCatalog.filter(f => 
        f.name.toLowerCase().includes(q) || 
        f.hotel.toLowerCase().includes(q) || 
        f.category.toLowerCase().includes(q)
      );
      renderCatalog(filtered);
    };
    searchBtn.addEventListener('click', filterSearch);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') filterSearch();
    });
  }
}

// 7. DETAIL & TABLE BOOKING CONTROLLER
function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'f1';
  const food = foodCatalog.find(f => f.id === id);

  if (!food) return;

  // Set Details
  document.getElementById('detail-img').src = food.image;
  document.getElementById('detail-title').textContent = food.name;
  document.getElementById('detail-hotel').textContent = food.hotel;
  document.getElementById('detail-desc').textContent = food.desc;
  
  const priceEl = document.getElementById('detail-price');
  if (priceEl) priceEl.textContent = `₹${food.price}`;
  
  // Set Table Booking input fields preselected
  const hotelInput = document.getElementById('book-hotel');
  if (hotelInput) hotelInput.value = food.hotel;

  // Detail Action Buttons Click Handlers
  const detailBookBtn = document.getElementById('detail-book-btn');
  const detailAddCartBtn = document.getElementById('detail-add-cart-btn');
  const detailCheckoutBtn = document.getElementById('detail-checkout-btn');

  const tableBookingModal = document.getElementById('table-booking-modal');
  const closeBookingFormBtn = document.getElementById('close-booking-form-btn');

  if (detailBookBtn && tableBookingModal) {
    detailBookBtn.addEventListener('click', () => {
      tableBookingModal.classList.add('open');
    });
  }

  if (closeBookingFormBtn && tableBookingModal) {
    closeBookingFormBtn.addEventListener('click', () => {
      tableBookingModal.classList.remove('open');
    });
  }

  if (detailAddCartBtn) {
    detailAddCartBtn.addEventListener('click', () => {
      addToCart(food.name, food.price, food.hotel);
    });
  }

  if (detailCheckoutBtn) {
    detailCheckoutBtn.addEventListener('click', () => {
      const existing = cartState.find(item => item.name === food.name);
      if (!existing) {
        addToCart(food.name, food.price, food.hotel);
      }
      window.location.href = 'checkout.html';
    });
  }

  // Render foodnoms macro values
  const macroContainers = document.querySelectorAll('.macro-ring-container');
  if (macroContainers.length === 4) {
    // Calories
    macroContainers[0].querySelector('.macro-val').textContent = food.macros.cal;
    // Carbs
    macroContainers[1].querySelector('.macro-val').textContent = food.macros.carbs;
    // Fat
    macroContainers[2].querySelector('.macro-val').textContent = food.macros.fat;
    // Protein
    macroContainers[3].querySelector('.macro-val').textContent = food.macros.prot;
  }
}

// Table booking form submission handler
function handleTableBooking(e) {
  e.preventDefault();
  const hotel = document.getElementById('book-hotel').value;
  const name = document.getElementById('book-name').value;
  const date = document.getElementById('book-date').value;
  const time = document.getElementById('book-time').value;
  const guests = document.getElementById('book-guests').value;

  const successMessage = `Your table for **${guests} guests** at **${hotel}** has been successfully booked for **${date}** at **${time}** under the name **${name}**.`;
  document.getElementById('booking-success-message').innerText = successMessage;

  const tableBookingModal = document.getElementById('table-booking-modal');
  if (tableBookingModal) tableBookingModal.classList.remove('open');

  const modal = document.getElementById('booking-success-modal');
  if (modal) modal.classList.add('open');
}

function closeBookingModal() {
  const modal = document.getElementById('booking-success-modal');
  if (modal) modal.classList.remove('open');
  // Clear form
  document.getElementById('booking-form').reset();
  showToast('Table reservation confirmed! Check SMS receipt.');
}

// 8. CART DRAWER CONTROLLER (Persisted on localStorage)
let cartState = [];

function initCartState() {
  const cached = localStorage.getItem('virundhu_cart');
  if (cached) {
    cartState = JSON.parse(cached);
  }
  updateCartUI();
}

function saveCartState() {
  localStorage.setItem('virundhu_cart', JSON.stringify(cartState));
}

function toggleCart() {
  if (cartDrawer && cartOverlay) {
    cartDrawer.classList.toggle('open');
    cartOverlay.classList.toggle('open');
  }
}

if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Make global add to cart function
window.addToCart = function(name, price, restaurantName) {
  const existing = cartState.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({ name, price, qty: 1 });
  }
  saveCartState();
  updateCartUI();
  showToast(`Added ${name} to Cart Basket!`);
};

window.updateQty = function(name, delta) {
  const index = cartState.findIndex(item => item.name === name);
  if (index > -1) {
    cartState[index].qty += delta;
    if (cartState[index].qty <= 0) {
      cartState.splice(index, 1);
    }
  }
  saveCartState();
  updateCartUI();
};

function updateCartUI() {
  if (!cartCount) return;
  const count = cartState.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;

  if (cartState.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart-msg">
        <i class="fa-solid fa-utensils"></i>
        <p>Your basket is empty!</p>
      </div>
    `;
    cartSubtotalEl.textContent = '₹0';
    cartTotalEl.textContent = '₹35';
    return;
  }

  cartItemsContainer.innerHTML = cartState.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <h5>${item.name}</h5>
        <span>₹${item.price * item.qty}</span>
      </div>
      <div class="cart-item__qty">
        <button class="qty-btn" onclick="updateQty('${item.name}', -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty('${item.name}', 1)">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartSubtotalEl.textContent = `₹${subtotal}`;
  cartTotalEl.textContent = `₹${subtotal + 35}`;
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cartState.length === 0) {
      showToast('Cart is empty.');
      return;
    }
    window.location.href = 'checkout.html';
  });
}

// 9. FORMS & MODALS SYSTEM
const formModal = document.getElementById('form-modal');
const formTitle = document.getElementById('form-title');
const closeFormBtn = document.getElementById('close-form-btn');
const openRiderBtn = document.getElementById('open-rider-modal');
const openPartnerBtn = document.getElementById('open-partner-modal');

const loginModal = document.getElementById('login-modal');
const closeLoginBtn = document.getElementById('close-login-btn');
const loginTriggerBtn = document.getElementById('login-trigger-btn');

function initFormModals() {
  if (openRiderBtn) {
    openRiderBtn.addEventListener('click', () => {
      formTitle.textContent = 'Join Virundhu as a Delivery Rider';
      formModal.classList.add('open');
    });
  }
  if (openPartnerBtn) {
    openPartnerBtn.addEventListener('click', () => {
      formTitle.textContent = 'Register Your Restaurant';
      formModal.classList.add('open');
    });
  }
  if (closeFormBtn) {
    closeFormBtn.addEventListener('click', () => {
      formModal.classList.remove('open');
    });
  }
  if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const Clerk = window.Clerk;
      if (Clerk && Clerk.signIn) {
        if (Clerk.user) {
          Clerk.signOut().then(() => {
            showToast('Logged out successfully!');
          });
        } else {
          showToast('Redirecting to Google Sign-In...');
          Clerk.signIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: new URL('sso-callback.html', window.location.href).href,
            redirectUrlComplete: new URL('index.html', window.location.href).href
          }).catch(err => {
            console.error('Clerk OAuth Error:', err);
            showToast('OAuth redirect failed. Using standard sign-in.');
            Clerk.openSignIn();
          });
        }
      } else {
        const isLoggedIn = localStorage.getItem('virundhu_user');
        if (isLoggedIn) {
          localStorage.removeItem('virundhu_user');
          showToast('Logged out successfully!');
          updateLoginButtonState();
        } else {
          if (loginModal) loginModal.classList.add('open');
        }
      }
    });
  }
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      loginModal.classList.remove('open');
    });
  }
}

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  localStorage.setItem('virundhu_user', email);
  loginModal.classList.remove('open');
  showToast('Logged in successfully!');
  updateLoginButtonState();
};

window.updateLoginButtonState = function() {
  const btn = document.getElementById('login-trigger-btn');
  if (!btn) return;
  const Clerk = window.Clerk;
  const user = (Clerk && Clerk.user) ? Clerk.user.primaryEmailAddress.emailAddress : localStorage.getItem('virundhu_user');
  if (user) {
    btn.textContent = 'Sign Out';
    btn.style.backgroundColor = 'var(--color-ember-orange)';
    btn.style.color = 'white';
  } else {
    btn.textContent = 'Login / Sign Up';
    btn.style.backgroundColor = 'white';
    btn.style.color = 'var(--color-graphite)';
  }
};

window.handleFormSubmit = function(e) {
  e.preventDefault();
  formModal.classList.remove('open');
  showToast('✅ Application submitted successfully!');
};

// 10. FAQ ACCORDION
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// 11. MOBILE NAV TOGGLE
function initMobileMenu() {
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
}

// 12. TOAST ALERTS
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
