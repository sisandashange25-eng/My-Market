const SUPABASE_URL = "https://gaccizzlwswwynattgda.supabase.co";
const SUPABASE_KEY = "sb_publishable_902JguVx0M5DNLWVx8trpA_LUlUMDG0";

let products = [];
let category = "All";

let cart = JSON.parse(localStorage.getItem("cart") || "[]");


function renderProducts() {

  const searchBox = document.getElementById("search");
  const sortBox = document.getElementById("sort");
  const productsBox = document.getElementById("products");

  if (!productsBox) return;

  let q = searchBox ? searchBox.value.toLowerCase() : "";
  let s = sortBox ? sortBox.value : "popular";

  let filtered = products.filter(x => {

    const productCategory = x.cat || "Other";

    return (
      (category === "All" || productCategory === category) &&
      x.name.toLowerCase().includes(q)
    );

  });

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
              : `<span>🛍️</span>`
          }
        </div>

        <h3>${x.name}</h3>

        <div class="seller">
          ${x.seller}
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

    const productsResponse = await fetch(
      SUPABASE_URL +
      "/rest/v1/products?select=*&order=id.desc",
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );

    if (!productsResponse.ok) {

      alert(
        "Products error:\n\n" +
        await productsResponse.text()
      );

      return;
    }

    const productData = await productsResponse.json();


    const sellersResponse = await fetch(
      SUPABASE_URL +
      "/rest/v1/sellers?select=id,store_name",
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      }
    );


    let sellers = [];

    if (sellersResponse.ok) {

      sellers = await sellersResponse.json();

    }


    const sellerMap = {};

    sellers.forEach(seller => {

      sellerMap[seller.id] =
        (seller.store_name || "Zava Seller").trim();

    });


    products = productData.map(p => ({

      id: p.id,

      name: p.name,

      price: Number(p.price),

      cat: p.category || "Other",

      seller:
  Number(p.seller_id) === 5
    ? "ZAVAMARKET"
    : (sellerMap[p.seller_id] || "Zava Seller"),

      image_url: p.image_url || ""

    }));


    renderProducts();

    updateCart();


  } catch (error) {

    alert(
      "Could not load products:\n\n" +
      error.message
    );

  }

}


function setCategory(c) {

  category = c;

  const heading = document.getElementById("heading");

  if (heading) {

    heading.textContent =
      c + " products";

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

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


function updateCart() {

  const cartCount =
    document.getElementById("cartCount");

  const cartItems =
    document.getElementById("cartItems");

  const totalBox =
    document.getElementById("total");


  if (!cartCount || !cartItems || !totalBox) {

    return;

  }


  cartCount.textContent =
    cart.length;


  let counts = {};


  cart.forEach(id => {

    counts[id] =
      (counts[id] || 0) + 1;

  });


  let total = 0;


  cartItems.innerHTML =

    Object.entries(counts)
      .map(([id, n]) => {

        const x =
          products.find(
            p => p.id == id
          );

        if (!x) return "";


        total +=
          Number(x.price) * n;


        return `

          <div class="cartrow">

            <span>
              ${x.name} × ${n}
            </span>

            <b>
              R${(
                Number(x.price) * n
              ).toFixed(2)}
            </b>

          </div>

        `;

      })
      .join("") ||

      "<p>Your cart is empty.</p>";


  totalBox.textContent =
    total.toFixed(2);

}


function toggleCart() {

  const cartBox =
    document.getElementById("cart");

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
      product_id: product.id,
      quantity: quantity,
      price: price
    });
  }

  try {

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
      alert(
        "Customer profile could not be created.\n\n" +
        await profileResponse.text()
      );
      return;
    }

    const profileData = await profileResponse.json();
    const customerId = profileData[0].id;

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
      alert(
        "Order could not be created.\n\n" +
        await orderResponse.text()
      );
      return;
    }

    const orderData = await orderResponse.json();
    const orderId = orderData[0].id;

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
        body: JSON.stringify(
          orderItems.map(item => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }))
        )
      }
    );

    if (!itemsResponse.ok) {
      alert(
        "The order was created, but the products could not be added.\n\n" +
        await itemsResponse.text()
      );
      return;
    }

    const paymentUrl =
  "https://script.google.com/macros/s/AKfycby9wxW_NnME16qSiZrCOC4onVG7vkqxohfw1LABcn-9IaAE-57-7jqNwNDxuj63iqje/exec" +
  "?amount=" + encodeURIComponent(total.toFixed(2)) +
  "&item_name=" + encodeURIComponent("ZavaMarket Order #" + orderId) +
  "&order_id=" + encodeURIComponent(orderId);

window.location.href = paymentUrl;

  } catch (error) {

    alert("Checkout failed:\n\n" + error.message);

  }
}


async function sellerCentre() {

  const name =
    prompt("Enter your store name:");

  if (!name) {

    alert(
      "Seller registration cancelled."
    );

    return;

  }


  const email =
    prompt("Enter your email address:");

  if (!email) {

    alert(
      "Seller registration cancelled."
    );

    return;

  }


  try {

    const response =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/sellers",

        {

          method: "POST",

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY,

            "Content-Type":
              "application/json",

            "Prefer":
              "return=minimal"

          },

          body:
            JSON.stringify({

              store_name:
                name,

              email:
                email,

              approved:
                false

            })

        }

      );


    if (!response.ok) {

      alert(
        "Seller registration failed.\n\n" +
        await response.text()
      );

      return;

    }


    alert(
      "Seller application submitted successfully! 🎉"
    );


    window.location.href =
      "seller.html";


  } catch (error) {

    alert(
      "Seller registration failed.\n\n" +
      error.message
    );

  }

}


async function checkOrderStatus() {

  const orderId =
    prompt("Enter your Order ID:");

  if (
    !orderId ||
    !orderId.trim()
  ) {

    return;

  }


  try {

    const response =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/orders?id=eq." +
        orderId.trim() +
        "&select=id,total,status,delivery_address,created_at",

        {

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY

          }

        }

      );


    if (!response.ok) {

      alert(
        "Could not check your order.\n\n" +
        await response.text()
      );

      return;

    }


    const orders =
      await response.json();


    if (!orders.length) {

      alert(
        "Order #" +
        orderId +
        " was not found."
      );

      return;

    }


    const order =
      orders[0];


    alert(

      "📦 Order #" +
      order.id +

      "\n\nStatus: " +
      order.status +

      "\nTotal: R" +
      Number(order.total)
        .toFixed(2) +

      "\nDelivery: " +
      (
        order.delivery_address ||
        "Not provided"
      )

    );


  } catch (error) {

    alert(
      "Could not check order status:\n\n" +
      error.message
    );

  }

}


loadProducts();
