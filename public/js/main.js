
// Products Array
const products = [
  {
    id: 1,
    title: "iPhone 13",
    price: 764.9,
    image:
      "productimg/13.jpg",
  },
  {
    id: 2,
    title: "iPhone 15",
    price: 899,
    image:
      "productimg/15.jpg",
  },
  {
    id: 3,
    title: "iPhone 12",
    price: 740.9,
    image:
      "productimg/12.jpg",
  },
  {
    id: 4,
    title: "iPhone 11",
    price: 699,
    image:
      "productimg/11.jpg",
  },
  {
    id: 5,
    title: "iPhone 14",
    price: 820.99,
    image:
      "productimg/14.jpg",
  },
  {
    id: 6,
    title: "iPhone XS",
    price: 599,
    image:
      "productimg/xs.jpg",
  },
  {
    id: 7,
    title: "iPhone XR",
    price: 549,
    image:
      "productimg/xr.jpg",
  },
  {
    id: 8,
    title: "iPhone 8",
    price: 79.99,
    image:
      "productimg/8.jpg",
  },
];

//Get Product List and Element
const productList = document.getElementById("productList");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

//Store Item Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//Render Product
function renderProducts() {
  productList.innerHTML = products
  .map(
    (product)=> `
    <div class="product">
    <img src="${product.image}" alt="${product.title}" class="product-img">
      <div class="product-info">
        <h2 class="product-title">${product.title}</h2>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <a class="add-to-cart" data-id="${product.id}">Masukan Keranjang</a>
      </div>
    </div>
    `
  )
  .join("");
  //add To Cart
  const addToCartButtons = document.getElementsByClassName("add-to-cart");
  for (let i = 0; i < addToCartButtons.length; i++) {
    const addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener("click", addToCart);
  }
}

//Add To Cart
function addToCart(event) {
  const productID = parseInt(event.target.dataset.id);
  const product = products.find((product) => product.id === productID);

  if(product) {
    const exixtingItem = cart.find((item) => item.id === productID);

    if(exixtingItem) {
      exixtingItem.quantity++;
    }else{
      const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      cart.push(cartItem);
    }
    //Change Add To Cart
    event.target.textContent = 'ditambahkan';
    updateCartIcon();
    saveToLocalStroge();
    renderCartItems();
    calculateCartTotal();
  }
}

//remove from cart 
function removeFromCart (event) {
  const productID = parseInt(event.target.dataset.id);
  cart = cart.filter((item) => item.id !== productID);
  saveToLocalStroge();
  renderCartItems();
  calculateCartTotal();
  updateCartIcon();
}

//Quantity Change
function changeQuantity(event) {
  const productID = parseInt(event.target.dataset.id);
  const quantity = parseInt(event.target.value);

  if (quantity > 0) {
    const cartItem = cart.find((item) => item.id === productID);
    if (cartItem) {
      cartItem.quantity = quantity;
      saveToLocalStroge();
      calculateCartTotal();
      updateCartIcon();
    }
  }
}

//SaveToLocalStroge
function saveToLocalStroge() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

//Render Cart
function renderCartItems(){
  cartItemsElement.innerHTML = cart
  .map(
    (item) => `
    <div class="cart-item">
    <img src="${item.image}" alt="${item.title}" />
    <div class="cart-item-info">
        <h2 class="cart-item-title">${item.title}</h2>
        <input 
            class="cart-item-quantity" 
            type="number" 
            name="" 
            min="1" 
            value="${item.quantity}" 
            data-id="${item.id}"
            />
    </div>
    <h2 class="cart-item-price">$${item.price}</h2>
    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
  </div>
    `
  )
  .join("");
  //Remove From Cart
  const removeButtons = document.getElementsByClassName("remove-from-cart");
  for (let i = 0; i < removeButtons.length; i++){
    const removeButton = removeButtons[i];
    removeButton.addEventListener("click", removeFromCart);
  }
  //quantity change
  const quantityInputs = document.querySelectorAll(".cart-item-quantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", changeQuantity);
  });
}

//Calcul Total
function calculateCartTotal() {
  const total = cart.reduce ((sum, item) =>sum + item.price * item.quantity, 0);
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

//Check IF
if (window.location.pathname.includes("cart.html")){
  renderCartItems();
  calculateCartTotal();
}else {
  renderProducts();
}

//Icon Quantity
const cartIcon = document.getElementById("cart-icon");

function updateCartIcon() {
  const totalQuantity= cart.reduce((sum, item) => sum + item.quantity, 0);
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

updateCartIcon();

function updateCartIconOnCartChange() {
  updateCartIcon();
}

window.addEventListener("storage", updateCartIconOnCartChange);

function updateCartIcon() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartIcon = document.getElementById("cart-icon");
  cartIcon.setAttribute("data-quantity", totalQuantity);
}

renderProducts();
renderCartItems();
calculateCartTotal();