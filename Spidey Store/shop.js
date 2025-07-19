// Demo product data
const spideyProducts = [
  {id:1, name:"Classic Spiderman Figure", img:"https://images.unsplash.com/photo-1529335764857-3f1164d1cb24?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price:1299},
  {id:2, name:"Spiderverse Hoodie", img:"https://images.unsplash.com/photo-1697498090641-70cc0d689e14?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3BpZGVybWFuJTIwaG9vZGllfGVufDB8fDB8fHww", price:1599},
  {id:3, name:"Miles Morales Mask", img:"https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BpZGVybWFuJTIwbWFza3xlbnwwfHwwfHx8MA%3D%3D", price:399},
  {id:4, name:"Spidey Funky Pop", img:"https://images.unsplash.com/photo-1694747993167-efb40717b869?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpZGVybWFuJTIwdG95fGVufDB8fDB8fHww", price:699},
  {id:5, name:"Spidey Logo Mug", img:"https://images.unsplash.com/photo-1664648579527-a9ed2bc4962a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpZGVybWFuJTIwbXVnfGVufDB8fDB8fHww", price:349},
  {id:6, name:"No Way Home Poster", img:"https://images.unsplash.com/photo-1642456074142-92f75cb84533?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BpZGVybWFuJTIwcG9zdGVyfGVufDB8fDB8fHww", price:499}
];

let cart = [];

function formatPrice(p) { return `₹${(p/1).toLocaleString('en-IN')}`; }

function renderShop() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  spideyProducts.forEach(prod=>{
    const col = document.createElement('div');
    col.className = "col-md-4 col-sm-6";
    col.innerHTML = `
      <div class="product-card text-center p-3 h-100 d-flex flex-column align-items-center">
        <img class="product-img mb-2" src="${prod.img}" alt="${prod.name}">
        <div class="product-name">${prod.name}</div>
        <div class="product-price mb-2">${formatPrice(prod.price)}</div>
        <button class="btn btn-spidey add-cart-btn mt-auto" data-id="${prod.id}"><i class="bi bi-cart-plus"></i> Add to Cart</button>
      </div>`;
    grid.append(col);
  });
  grid.querySelectorAll('.add-cart-btn').forEach(btn=>{
    btn.onclick = function(){
      const itemId = Number(this.dataset.id);
      const already = cart.find(entry=>entry.id===itemId);
      if(already){ already.qty++; }
      else {
        const prod = spideyProducts.find(p=>p.id===itemId);
        cart.push({...prod, qty:1});
      }
      updateCartBadge();
      this.textContent = "Added!";
      setTimeout(()=>this.innerHTML='<i class="bi bi-cart-plus"></i> Add to Cart',1000);
      renderCartItems();
      renderCheckoutCart();
    }
  });
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  let total = 0; cart.forEach(item=>{total+=item.qty;});
  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block":"none";
}

// --- Cart Modal ---
function renderCartItems() {
  const cartItemsDiv = document.getElementById('cartItems');
  if(!cartItemsDiv) return;
  if(cart.length===0) {
    cartItemsDiv.innerHTML = `<div class="empty-cart-msg">Your cart is empty! <br/><span style="font-size:1.4em;">🕸️</span></div>`;
    document.getElementById('cartTotal').textContent="₹0";
    return;
  }
  let html='';
  let sum=0;
  cart.forEach(item=>{
    html+=`
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)} x ${item.qty}</div>
      </div>
      <button class="remove-cart-btn" title="Remove" data-id="${item.id}">&times;</button>
    </div>`;
    sum+=item.price*item.qty;
  });
  cartItemsDiv.innerHTML = html;
  document.getElementById('cartTotal').textContent = formatPrice(sum);
  cartItemsDiv.querySelectorAll('.remove-cart-btn').forEach(btn=>{
    btn.onclick = function(){
      const iid=+btn.dataset.id;
      cart = cart.filter(entry=>entry.id!==iid);
      renderCartItems();
      renderCheckoutCart();
      updateCartBadge();
    }
  });
}

// -- Cart Modal show/hide
function showCartModal() {
  document.getElementById('cartModalBg').style.display = 'flex';
  renderCartItems();
}
function hideCartModal() {
  document.getElementById('cartModalBg').style.display = 'none';
}
// -- Checkout Modal show/hide
function showCheckoutModal() {
  document.getElementById('checkoutModalBg').style.display = 'flex';
  renderCheckoutCart();
  document.getElementById('orderConfirmation').style.display="none";
  document.getElementById('checkoutForm').style.display="";
  document.getElementById('paymentFields').innerHTML = '';
  document.querySelectorAll('.pay-btn').forEach(b=>b.classList.remove('selected-pay'));
}
function hideCheckoutModal() {
  document.getElementById('checkoutModalBg').style.display = 'none';
}
// --- Checkout Cart Table
function renderCheckoutCart() {
  const tbody = document.getElementById('checkoutCartTbody');
  if (!tbody) return;
  let total = 0;
  tbody.innerHTML = cart.map(item=>
    `<tr>
      <td>${item.name}</td>
      <td style="text-align:center;">${item.qty}</td>
      <td>${formatPrice(item.price*item.qty)}</td>
    </tr>`
  ).join('');
  total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  tbody.innerHTML += `<tr><td colspan="2" class="text-end"><strong>Total</strong></td><td><strong>${formatPrice(total)}</strong></td></tr>`;

  // Also update hidden order_details for email
  document.getElementById('checkoutOrderDetails').value =
    cart.map(item => `${item.qty} x ${item.name}`).join(', ');
}

// --- Payment method fields
function renderFields(method) {
  const paymentFields = document.getElementById('paymentFields');
  paymentFields.innerHTML = "";
  if(method === "card") {
    paymentFields.innerHTML = `
      <input type="text" class="form-control mb-2" name="cardnum"
        required placeholder="Enter card number here" maxlength="19" pattern="[0-9 ]*">
      <input type="text" class="form-control mb-2" name="cardexp"
        required placeholder="MM/YY" maxlength="5" pattern="\\d{2}/\\d{2}">
      <input type="text" class="form-control mb-2" name="cvv"
        required placeholder="CVV (3 or 4 digits)" maxlength="4" pattern="\\d{3,4}">
    `;
  } else if(method === "upi") {
    paymentFields.innerHTML = `
      <input type="text" class="form-control mb-2" name="upi"
        required placeholder="Enter your UPI ID (e.g. name@bank)">
    `;
  } else if(method === "paypal") {
    paymentFields.innerHTML = `
      <input type="email" class="form-control mb-2" name="paypal"
        required placeholder="Enter your PayPal Email">
    `;
  } else if(method === "cod") {
    paymentFields.innerHTML = `
      <div class="alert alert-warning py-1 mb-1">Pay in cash upon delivery.</div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderShop();
  updateCartBadge();
  renderCartItems();
  renderCheckoutCart();

  // CLICK HANDLERS
  document.getElementById('mainCartBtn').addEventListener('click', showCartModal);
  document.querySelector('.cart-close-btn').onclick = hideCartModal;
  document.getElementById('goToCheckoutBtn').onclick = function(){
    hideCartModal();
    showCheckoutModal();
  };
  document.querySelector('.checkout-close-btn').onclick = hideCheckoutModal;
  
  // Payment method selection
  let selectedMethod = null;
  document.querySelectorAll('.pay-btn').forEach(btn => {
    btn.onclick = function() {
      document.querySelectorAll('.pay-btn').forEach(b=>b.classList.remove("selected-pay"));
      btn.classList.add("selected-pay");
      selectedMethod = btn.dataset.method;
      renderFields(selectedMethod);
    }
  });

  document.getElementById('checkoutForm').onsubmit = function(e){
    e.preventDefault();
    if(cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if(!selectedMethod) {
      alert("Please select a payment method!");
      return;
    }
    // Optional: Validate extra fields of payment
    if(selectedMethod === "card") {
      let cn = this.querySelector('input[name="cardnum"]');
      let ex = this.querySelector('input[name="cardexp"]');
      let cvv = this.querySelector('input[name="cvv"]');
      if(!cn.value.match(/^[0-9 ]{12,19}$/) ||
         !ex.value.match(/^\d{2}\/\d{2}$/) ||
         !cvv.value.match(/^\d{3,4}$/)) {
        alert("Please fill valid card details.");
        return;
      }
    } else if(selectedMethod === "upi") {
      let upi = this.querySelector('input[name="upi"]');
      if(!upi.value || !upi.value.includes('@')) {
        alert("Please enter a valid UPI ID.");
        return;
      }
    } else if(selectedMethod === "paypal") {
      let paypal = this.querySelector('input[name="paypal"]');
      if(!paypal.value || !paypal.value.includes('@')) {
        alert("Please enter a valid PayPal email.");
        return;
      }
    }

    // Send Email via EmailJS
    const form = this;
    form.order_details.value = cart.map(item=>`${item.qty} x ${item.name}`).join(', ');
    document.getElementById('orderConfirmation').style.display="block";
    form.style.display="none";
    emailjs.sendForm('service_pi353s9', 'template_vnxwv6j', form)
      .then(function() {
        document.getElementById('orderConfirmation').innerHTML =
          `<div><i class="bi bi-patch-check-fill" style="color:#28c76f;font-size:2em;"></i></div>
          <div>Order placed. Confirmation has been sent to your email!</div>
          <div class="mt-2" style="font-size:.75em; color:#5d2500;">(Demo: no payment processed.)</div>`;
      }, function(error) {
        document.getElementById('orderConfirmation').innerHTML =
          `<div><i class="bi bi-x-octagon-fill" style="color:#e80000;font-size:2em;"></i></div>
          <div>Order placed, but could not send email confirmation.</div>`;
      });

    cart = [];
    updateCartBadge();
    renderCartItems();
    renderCheckoutCart();
    setTimeout(()=>{hideCheckoutModal(); renderShop();}, 2600);
  };

  // Contact Form Handler (with EmailJS)
  const contactForm = document.getElementById('contactForm');
  if(contactForm) {
    contactForm.onsubmit = function(e){
      e.preventDefault();
      const formStatus = document.getElementById('formStatus');
      formStatus.textContent = "Sending...";
      formStatus.style.display = "block";
      emailjs.sendForm('service_pi353s9', 'template_vnxwv6j', this)
        .then(function() {
            formStatus.textContent = "Thank you! Confirmation sent to your email. 🕸️";
            formStatus.style.color = "limegreen";
            contactForm.reset();
        }, function(error) {
            formStatus.textContent = "Sorry, could not send email. Try again.";
            formStatus.style.color = "orangered";
        });
    }
  }

  // ESC to close modals
  document.onkeydown = function(e){ 
    if (e.key==="Escape") { 
      hideCartModal(); 
      hideCheckoutModal(); 
    } 
  };
});
