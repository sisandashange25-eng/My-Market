const SUPABASE_URL = "https://gaccizzlwswwynattgda.supabase.co";
const SUPABASE_KEY = "sb_publishable_902JguVx0M5DNLWVx8trpA_LUlUMDG0";

const demoProducts = [
  {id:1,name:"Wireless Earbuds",price:299,cat:"Electronics",icon:"🎧",seller:"Tech Store"},
  {id:2,name:"Smart Watch",price:499,cat:"Electronics",icon:"⌚",seller:"Gadget Hub"},
  {id:3,name:"Classic Sneakers",price:699,cat:"Fashion",icon:"👟",seller:"Urban Wear"},
  {id:4,name:"Hoodie",price:399,cat:"Fashion",icon:"🧥",seller:"Urban Wear"},
  {id:5,name:"Kitchen Blender",price:549,cat:"Home",icon:"🥤",seller:"Home World"},
  {id:6,name:"Skincare Set",price:249,cat:"Beauty",icon:"🧴",seller:"Beauty Shop"},
  {id:7,name:"Bluetooth Speaker",price:379,cat:"Electronics",icon:"🔊",seller:"Tech Store"},
  {id:8,name:"Bedside Lamp",price:199,cat:"Home",icon:"💡",seller:"Home World"}
];

let products = demoProducts;
let category = "All";
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function renderProducts() {
  const searchBox = document.getElementById("search");
  const sortBox = document.getElementById("sort");

  let q = searchBox ? searchBox.value.toLowerCase() : "";
  let s = sortBox ? sortBox.value : "popular";

  let filtered = products.filter(x =>
    (category === "All" || x.cat === category) &&
    x.name.toLowerCase().includes(q)
  );

  if (s === "low") filtered.sort((a, b) => a.price - b.price);
  if (s === "high") filtered.sort((a, b) => b.price - a.price);

  document.getElementById("products").innerHTML =
    filtered.map(x => `
      <article class="card">
        <div class="pic">
          ${
            x.image_url
              ? `<img src="${x.image_url}" alt="${x.name}" style="width:100%;height:100%;object-fit:cover;">`
              : `<span>${x.icon || "🛍️"}</span>`
          }
        </div>

        <h3>${x.name}</h3>
        <div class="seller">${x.seller}</div>
        <div class="price">R${x.price.toFixed(2)}</div>

        <button class="add" onclick="add(${x.id})">
          Add to cart
        </button>
      </article>
    `).join("") || "<p>No products found.</p>";
}

async function loadProducts() {
  try {
    const response = await fetch(
      SUPABASE_URL + "/rest/v1/products?select=*&active=eq.true&order=id.desc",
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error("Could not load products");
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      products = data.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        cat: p.category || "Other",
        icon: "🛍️",
        seller: "Zava Seller",
        image_url: p.image_url || ""
      }));
    }

    renderProducts();
    updateCart();

  } catch (error) {
    console.log("Using demo products:", error);
    renderProducts();
    updateCart();
  }
}

function setCategory(c) {
  category = c;
  document.getElementById("heading").textContent = c + " products";
  renderProducts();
}

function add(id) {
  cart.push(id);
  save();
  updateCart();
  alert("Added to cart");
}

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  document.getElementById("cartCount").textContent = cart.length;

  let counts = {};

  cart.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  let total = 0;

  document.getElementById("cartItems").innerHTML =
    Object.entries(counts).map(([id, n]) => {
      let x = products.find(p => p.id == id);

      if (!x) return "";

      total += x.price * n;

      return `
        <div class="cartrow">
          <span>${x.name} × ${n}</span>
          <b>R${(x.price * n).toFixed(2)}</b>
        </div>
      `;
    }).join("") || "<p>Your cart is empty.</p>";

  document.getElementById("total").textContent = total.toFixed(2);
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
  updateCart();
}

async function checkout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const fullName = prompt("Enter your full name:");

  if (!fullName || !fullName.trim()) {
    alert("Full name is required.");
    return;
  }

  const phone = prompt("Enter your phone number:");

  if (!phone || !phone.trim()) {
    alert("Phone number is required.");
    return;
  }

  const deliveryAddress = prompt("Enter your delivery address:");

  if (!deliveryAddress || !deliveryAddress.trim()) {
    alert("Delivery address is required.");
    return;
  }

  let total = 0;
  const orderItems = [];
  const counts = {};

  cart.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  for (const [id, quantity] of Object.entries(counts)) {
    const product = products.find(p => p.id == id);

    if (!product) continue;

    total += product.price * quantity;

    orderItems.push({
      Products_id: product.id,
      Quantity: quantity,
      Price: product.price
    });
  }

  if (!orderItems.length) {
    alert("Could not find the products in your cart.");
    return;
  }

  try {
    // STEP 1: Create customer profile
    const profileResponse = await fetch(
      SUPABASE_URL + "/rest/v1/Profiles",
      {
        method: "POST",
        headers: {
          "apikey
