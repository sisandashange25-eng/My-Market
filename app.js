const SUPABASE_URL =
  "https://gaccizzlwswwynattgda.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_902JguVx0M5DNLWVx8trpA_LUlUMDG0";

let products = [];
let category = "All";

let cart =
  JSON.parse(localStorage.getItem("cart") || "[]");


/* =========================
   RENDER PRODUCTS
========================= */

function renderProducts() {

  const searchBox =
    document.getElementById("search");

  const sortBox =
    document.getElementById("sort");

  const productsBox =
    document.getElementById("products");

  if (!productsBox) return;

  let q =
    searchBox
      ? searchBox.value.toLowerCase()
      : "";

  let s =
    sortBox
      ? sortBox.value
      : "popular";

  let filtered =
    products.filter(x => {

      const productCategory =
        x.cat || "Other";

      return (
        (category === "All" ||
          productCategory === category) &&
        x.name.toLowerCase().includes(q)
      );

    });


  if (s === "low") {
    filtered.sort(
      (a, b) => a.price - b.price
    );
  }


  if (s === "high") {
    filtered.sort(
      (a, b) => b.price - a.price
    );
  }


  productsBox.innerHTML =
    filtered.map(x => `

      <article class="card">

        <div class="pic">

          ${
            x.image_url
              ?
            `<img
              src="${x.image_url}"
              alt="${x.name}"
              style="
                width:100%;
                height:100%;
                object-fit:cover;
              "
            >`
              :
            `<span>🛍️</span>`
          }

        </div>

        <h3>${x.name}</h3>

        <div class="seller">
          ${x.seller}
        </div>

        <div class="price">
          R${Number(x.price).toFixed(2)}
        </div>

        ${
          Number(x.stock) > 0
            ?
            `<div style="font-size:13px;color:#777;margin:6px 0;">
              ${x.stock} in stock
            </div>

            <button
              class="add"
              onclick="add(${x.id})"
            >
              Add to cart
            </button>`
            :
            `<div style="font-size:13px;color:#d00;margin:6px 0;font-weight:bold;">
              Out of stock
            </div>

            <button
              class="add"
              disabled
              style="opacity:.5;cursor:not-allowed;"
            >
              Out of stock
            </button>`
        }

      </article>

    `).join("") ||
    "<p>No products found.</p>";

}


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  try {

    const productsResponse =
      await fetch(
        SUPABASE_URL +
        "/rest/v1/products?select=*&active=eq.true&order=id.desc",
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              "Bearer " + SUPABASE_KEY
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


    const productData =
      await productsResponse.json();


    const sellersResponse =
      await fetch(
        SUPABASE_URL +
        "/rest/v1/sellers?select=id,store_name",
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              "Bearer " + SUPABASE_KEY
          }
        }
      );


    let sellers = [];


    if (sellersResponse.ok) {
      sellers =
        await sellersResponse.json();
    }


    const sellerMap = {};


    sellers.forEach(seller => {

      sellerMap[seller.id] =
        (
          seller.store_name ||
          "Zava Seller"
        ).trim();

    });


    products =
      productData.map(p => ({

        id: p.id,

        name: p.name,

        price: Number(p.price),

        stock:
          Number(p.stock ?? 0),

        cat:
          p.category ||
          "Other",

        seller:
          Number(p.seller_id) === 5
            ? "ZAVAMARKET"
            : (
                sellerMap[p.seller_id] ||
                "Zava Seller"
              ),

        image_url:
          p.image_url ||
          ""

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


/* =========================
   CATEGORY
========================= */

function setCategory(c) {

  category = c;

  const heading =
    document.getElementById("heading");

  if (heading) {
    heading.textContent =
      c + " products";
  }

  renderProducts();

}


/* =========================
   ADD TO CART
========================= */

function add(id) {

  const product =
    products.find(
      p => p.id == id
    );


  if (!product) {

    alert(
      "Product could not be found."
    );

    return;

  }


  const currentQuantity =
    cart.filter(
      cartId => cartId == id
    ).length;


  if (
    Number(product.stock) <=
    currentQuantity
  ) {

    alert(
      "Sorry, there is not enough stock available."
    );

    return;

  }


  cart.push(id);

  save();

  updateCart();

  alert("Added to cart");

}


/* =========================
   SAVE CART
========================= */

function save() {

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

  const cartCount =
    document.getElementById("cartCount");

  const cartItems =
    document.getElementById("cartItems");

  const totalBox =
    document.getElementById("total");


  if (
    !cartCount ||
    !cartItems ||
    !totalBox
  ) {
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


/* =========================
   TOGGLE CART
========================= */

function toggleCart() {

  const cartBox =
    document.getElementById("cart");

  if (!cartBox) return;

  cartBox.classList.toggle("open");

  updateCart();

}


/* =========================
   CHECKOUT
========================= */

async function checkout() {

  if (!cart.length) {

    alert("Your cart is empty.");

    return;

  }


  const fullName =
    prompt(
      "Enter your full name:"
    );


  if (
    !fullName ||
    !fullName.trim()
  ) {

    alert("Checkout cancelled.");

    return;

  }


  const phone =
    prompt(
      "Enter your phone number:"
    );


  if (
    !phone ||
    !phone.trim()
  ) {

    alert("Checkout cancelled.");

    return;

  }


  const deliveryAddress =
    prompt(
      "Enter your delivery address:"
    );


  if (
    !deliveryAddress ||
    !deliveryAddress.trim()
  ) {

    alert("Checkout cancelled.");

    return;

  }


  const counts = {};


  cart.forEach(id => {

    counts[id] =
      (counts[id] || 0) + 1;

  });


  let total = 0;

  const orderItems = [];


  for (
    const [id, quantity]
    of Object.entries(counts)
  ) {

    const product =
      products.find(
        p => p.id == id
      );


    if (!product) {

      alert(
        "One of the products in your cart could not be found."
      );

      return;

    }


    const price =
      Number(product.price);


    total +=
      price * quantity;


    orderItems.push({

      product_id:
        product.id,

      quantity:
        quantity,

      price:
        price

    });

  }


  try {

    /* =========================
       CHECK STOCK BEFORE CHECKOUT
    ========================= */

    for (const item of orderItems) {

      const product =
        products.find(
          p => p.id == item.product_id
        );


      if (
        !product ||
        Number(product.stock) <
        Number(item.quantity)
      ) {

        alert(
          "Sorry, there is not enough stock available for one of the products in your cart."
        );

        return;

      }

    }


    /* =========================
       CREATE CUSTOMER PROFILE
    ========================= */

    const profileResponse =
      await fetch(
        SUPABASE_URL +
        "/rest/v1/profiles",
        {
          method: "POST",

          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              "Bearer " + SUPABASE_KEY,
            "Content-Type":
              "application/json",
            "Prefer":
              "return=representation"
          },

          body: JSON.stringify({

            full_name:
              fullName.trim(),

            phone:
              phone.trim(),

            role:
              "customer"

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


    const profileData =
      await profileResponse.json();


    const customerId =
      profileData[0].id;


    /* =========================
       CREATE ORDER + ITEMS
       + REDUCE STOCK
       SECURELY
    ========================= */

    const orderResponse =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/rpc/create_customer_order_with_items",

        {

          method: "POST",

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              p_customer_id:
                customerId,

              p_total:
                total,

              p_status:
                "Pending",

              p_delivery_address:
                deliveryAddress.trim(),

              p_items:
                orderItems

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


    const orderId =
      await orderResponse.json();


    /* =========================
       PAYFAST SANDBOX
    ========================= */

    const paymentUrl =

      "https://script.google.com/macros/s/AKfycby9wxW_NnME16qSiZrCOC4onVG7vkqxohfw1LABcn-9IaAE-57-7jqNwNDxuj63iqje/exec" +

      "?amount=" +
      encodeURIComponent(
        total.toFixed(2)
      ) +

      "&item_name=" +
      encodeURIComponent(
        "ZavaMarket Order #" +
        orderId
      ) +

      "&order_id=" +
      encodeURIComponent(
        orderId
      );


    /* =========================
       CLEAR CART
    ========================= */

    cart = [];

    save();


    window.location.href =
      paymentUrl;


  } catch (error) {

    alert(
      "Checkout failed:\n\n" +
      error.message
    );

  }

}


/* =========================
   SELLER CENTRE
========================= */

async function sellerCentre() {

  const email =
    prompt(
      "Enter your ZavaMarket seller email:"
    );


  if (
    !email ||
    !email.trim()
  ) {

    alert(
      "Seller login cancelled."
    );

    return;

  }


  const password =
    prompt(
      "Enter your ZavaMarket password:"
    );


  if (!password) {

    alert(
      "Seller login cancelled."
    );

    return;

  }


  try {

    const loginResponse =
      await fetch(

        SUPABASE_URL +
        "/auth/v1/token?grant_type=password",

        {

          method: "POST",

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              email:
                email.trim(),

              password:
                password

            })

        }

      );


    if (!loginResponse.ok) {

      alert(
        "Seller login failed.\n\n" +
        await loginResponse.text()
      );

      return;

    }


    const loginData =
      await loginResponse.json();


    const accessToken =
      loginData.access_token;


    const userId =
      loginData.user.id;


    const sellerResponse =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/sellers?user_id=eq." +
        userId +
        "&select=id,store_name,approved",

        {

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              accessToken

          }

        }

      );


    if (!sellerResponse.ok) {

      alert(
        "Could not check your seller account.\n\n" +
        await sellerResponse.text()
      );

      return;

    }


    const sellers =
      await sellerResponse.json();


    if (!sellers.length) {

      alert(
        "This account is not registered as a ZavaMarket seller yet."
      );

      return;

    }


    const seller =
      sellers[0];


    if (seller.approved !== true) {

      alert(
        "Your ZavaMarket seller account is still waiting for approval."
      );

      return;

    }


    localStorage.setItem(
      "zava_access_token",
      accessToken
    );

    localStorage.setItem(
      "zava_user_id",
      userId
    );

    localStorage.setItem(
      "zava_seller_id",
      seller.id
    );


    alert(
      "Seller login successful! 🎉"
    );


    window.location.href =
      "seller.html";


  } catch (error) {

    alert(
      "Seller login failed:\n\n" +
      error.message
    );

  }

}


/* =========================
   CHECK ORDER STATUS
========================= */

async function checkOrderStatus() {

  const orderId =
    prompt(
      "Enter your Order ID:"
    );


  if (
    !orderId ||
    !orderId.trim()
  ) {
    return;
  }


  const phone =
    prompt(
      "Enter the phone number used for this order:"
    );


  if (
    !phone ||
    !phone.trim()
  ) {
    return;
  }


  try {

    const response =
      await fetch(

        SUPABASE_URL +
        "/rest/v1/rpc/get_orders_by_phone",

        {

          method: "POST",

          headers: {

            "apikey":
              SUPABASE_KEY,

            "Authorization":
              "Bearer " +
              SUPABASE_KEY,

            "Content-Type":
              "application/json"

          },

          body:
            JSON.stringify({

              user_phone:
                phone.trim()

            })

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


    if (
      !Array.isArray(orders) ||
      !orders.length
    ) {

      alert(
        "No orders were found for that phone number."
      );

      return;

    }


    const wantedId =
      Number(orderId.trim());


    const order =
      orders.find(o => {

        const possibleId =
          o.id ??
          o.order_id ??
          o.orderid;

        return (
          Number(possibleId) === wantedId
        );

      });


    if (!order) {

      alert(
        "Order #" +
        orderId +
        " was not found for that phone number."
      );

      return;

    }


    const displayId =
      order.id ??
      order.order_id ??
      order.orderid;


    const displayTotal =
      order.total ??
      order.order_total ??
      order.amount ??
      0;


    const displayStatus =
      order.status ??
      "Pending";


    const displayAddress =
      order.delivery_address ??
      order.deliveryaddress ??
      "Not provided";


    alert(

      "📦 Order #" +
      displayId +

      "\n\nStatus: " +
      displayStatus +

      "\nTotal: R" +
      Number(displayTotal)
        .toFixed(2) +

      "\nDelivery: " +
      displayAddress

    );


  } catch (error) {

    alert(
      "Could not check order status:\n\n" +
      error.message
    );

  }

}


/* =========================
   START
========================= */

loadProducts();