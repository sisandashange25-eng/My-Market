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
  const productsBox = document.getElementById("products");

  if (!productsBox) return;

  let q = searchBox ? searchBox.value.toLowerCase() : "";
  let s = sortBox ? sortBox.value : "popular";

  let filtered = products.filter(x =>
    (category === "All" || x.cat === category) &&
    x.name.toLowerCase().includes(q)
  );

  if (s === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (s === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  productsBox.innerHTML =
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

        <div class="seller">
          ${x.seller || "Zava Seller"}
        </div>

        <div class="price">
          R${Number(x.price).toFixed(2)}
        </div>

        <button class="add" onclick="add(${x.id})">
          Add to cart
        </button>

      </article>
    `).join("") || "<p>No products found.</p>";
}


async function loadProducts() {
  try {

    const response = await fetch(
      SUPABASE_URL + "/rest/v1/products?select=*&order=id.desc",
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

    console.log("Products from Supabase:", data);

    if (Array.isArray(data) && data.length > 0) {

      products = data.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        cat: p.category || "Other",
        icon: "🛍️",
        seller:"Zava Seller",
        image_url: p.image_url || ""
      }));

    }

    renderProducts();
    updateCart();

  } catch (error) {

    console.log("Could not load Supabase products:", error);

    renderProducts();
    updateCart();
  }
}


function setCategory(c) {
  category = c;

  const heading = document.getElementById("heading");

  if (heading) {
    heading.textContent = c + " products";
  }

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

  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const totalBox = document.getElementById("total");

  if (!cartCount || !cartItems || !totalBox) {
    return;
  }

  cartCount.textContent = cart.length;

  let counts = {};

  cart.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  let total = 0;

  cartItems.innerHTML =
    Object.entries(counts).map(([id, n]) => {

      const x = products.find(p => p.id == id);

      if (!x) return "";

      total += Number(x.price) * n;

      return `
        <div class="cartrow">
          <span>${x.name} × ${n}</span>
          <b>R${(Number(x.price) * n).toFixed(2)}</b>
        </div>
      `;

    }).join("") || "<p>Your cart is empty.</p>";

  totalBox.textContent = total.toFixed(2);
}


function toggleCart() {

  const cartBox = document.getElementById("cart");

  if (!cartBox) return;

  cartBox.classList.toggle("open");

  updateCart();
}


async function checkout() {

  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const fullName = prompt("Enter your full name:");

  if (!fullName || !fullName.trim()) {
    alert("Checkout cancelled.");
    return;
  }

  const phone = prompt("Enter your phone number:");

  if (!phone || !phone.trim()) {
    alert("Checkout cancelled.");
    return;
  }

  const deliveryAddress = prompt("Enter your delivery address:");

  if (!deliveryAddress || !deliveryAddress.trim()) {
    alert("Checkout cancelled.");
    return;
  }

  const counts = {};

  cart.forEach(id => {
    counts[id] = (counts[id] || 0) + 1;
  });

  let total = 0;
  const orderItems = [];

  for (const [id, quantity] of Object.entries(counts)) {

    const product = products.find(p => p.id == id);

    if (!product) {
      alert("One of the products in your cart could not be found.");
      return;
    }

    const price = Number(product.price);

    total += price * quantity;

    orderItems.push({
      Products_id: product.id,
      Quantity: quantity,
      Price: price
    });
  }


  try {

    alert("Creating your customer profile...");

    const profileResponse = await fetch(
      SUPABASE_URL + "/rest/v1/profiles",
      {
        method: "POST",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },

        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          role: "customer"
        })
      }
    );


    if (!profileResponse.ok) {

      const errorText = await profileResponse.text();

      console.log("Profile error:", errorText);

      alert(
        "Customer profile could not be created.\n\n" +
        errorText
      );

      return;
    }


    const profileData = await profileResponse.json();

    console.log("Customer profile:", profileData);


    if (!Array.isArray(profileData) || !profileData.length) {

      alert("Customer profile was created but no ID was returned.");

      return;
    }


    const customerId = profileData[0].id;


    alert("Creating your order...");


    const orderResponse = await fetch(
      SUPABASE_URL + "/rest/v1/orders",
      {
        method: "POST",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },

        body: JSON.stringify({
          customer_id: customerId,
          total: total,
          status: "Pending",
          delivery_address: deliveryAddress.trim()
        })
      }
    );


    if (!orderResponse.ok) {

      const errorText = await orderResponse.text();

      console.log("Order error:", errorText);

      alert(
        "Order could not be created.\n\n" +
        errorText
      );

      return;
    }


    const orderData = await orderResponse.json();

    console.log("Order:", orderData);


    if (!Array.isArray(orderData) || !orderData.length) {

      alert("Order was created but no order ID was returned.");

      return;
    }


    const orderId = orderData[0].id;


    alert("Adding products to your order...");


    const itemsToInsert = orderItems.map(item => ({
      order_id: orderId,
      product_id: item.Products_id,
      quantity: item.Quantity,
      price: item.Price
    }));


    const itemsResponse = await fetch(
      SUPABASE_URL + "/rest/v1/order_items",
      {
        method: "POST",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },

        body: JSON.stringify(itemsToInsert)
      }
    );


    if (!itemsResponse.ok) {

      const errorText = await itemsResponse.text();

      console.log("Order items error:", errorText);

      alert(
        "The order was created, but the products could not be added to it.\n\n" +
        errorText
      );

      return;
    }


    cart = [];

    save();
    updateCart();


    alert(
      "Order placed successfully! 🎉\n\n" +
      "Order ID: " + orderId + "\n" +
      "Total: R" + total.toFixed(2) + "\n\n" +
      "Thank you for shopping with ZavaMarket!"
    );


    const cartBox = document.getElementById("cart");

    if (cartBox) {
      cartBox.classList.remove("open");
    }


  } catch (error) {

    console.log("Checkout error:", error);

    alert(
      "Checkout failed.\n\n" +
      "Please check your internet connection and try again."
    );
  }
}


async function sellerCentre() {

  const name = prompt("Enter your store name:");

  if (!name) {
    alert("Seller registration cancelled.");
    return;
  }

  const email = prompt("Enter your email address:");

  if (!email) {
    alert("Seller registration cancelled.");
    return;
  }

  try {

    const response = await fetch(
      SUPABASE_URL + "/rest/v1/sellers",
      {
        method: "POST",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },

        body: JSON.stringify({
          store_name: name,
          email: email,
          approved: false
        })
      }
    );

    if (!response.ok) {

      const errorText = await response.text();

      console.log("Supabase seller error:", errorText);

      alert(
        "Seller registration failed.\n\n" +
        errorText
      );

      return;
    }

    alert(
      "Seller application submitted successfully! 🎉\n\n" +
      "Store: " + name + "\n" +
      "Email: " + email
    );

    // Open Seller Dashboard
    window.location.href = "seller.html";

  } catch (error) {

    console.log("Seller registration error:", error);

    alert(
      "Seller registration failed.\n\n" +
      "Please check your internet connection and try again."
    );
  }
}
  }
}

loadProducts();
