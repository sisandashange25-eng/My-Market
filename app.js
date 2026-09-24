const SUPABASE_URL =
"https://gaccizzlwswwynattgda.supabase.co";

const SUPABASE_KEY =
"sb_publishable_902JguVx0M5DNLWVx8trpA_LUlUMDG0";

/* =========================
ZYRE MARKETING PUSH
========================= */

const ZYRE_VAPID_PUBLIC_KEY =
"BOjLvTNv19TAOcTncMSkJkOkJ874DsdpzJx1Nh0l9TOYi_CSFeqALQ0ldhpB0v7rPHQ4VyIzcMCxJORjWtdLO2Q";

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

    id:
      p.id,

    name:
      p.name,

    price:
      Number(p.price),

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

    /*
    IMPORTANT:
    Keep the seller ID on every product.
    This is used after checkout to determine
    which seller must receive the notification.
    */

    seller_id:
      Number(p.seller_id),

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
p => String(p.id) === String(id)
);

if (!product) {

alert(
  "Product could not be found."
);

return;

}

const currentQuantity =
cart.filter(
cartId =>
String(cartId) === String(id)
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

cart.push(product.id);

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
CLEAR CART
========================= */

function clearCart() {

cart = [];

save();

updateCart();

alert(
"Cart cleared successfully."
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

try {

cart =
  JSON.parse(
    localStorage.getItem("cart") || "[]"
  );

} catch (error) {

cart = [];

}

if (!Array.isArray(cart)) {

cart = [];

}

cartCount.textContent =
cart.length;

let counts = {};

cart.forEach(id => {

const key =
  String(id);

counts[key] =
  (counts[key] || 0) + 1;

});

let total = 0;

const rows =
Object.entries(counts)
.map(([id, n]) => {

    const x =
      products.find(
        p =>
          String(p.id) ===
          String(id)
      );


    if (!x) {

      return `

        <div class="cartrow">

          <span>
            Product #${id} × ${n}
          </span>

          <b>
            Unavailable
          </b>

        </div>

      `;

    }


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
  .join("");

cartItems.innerHTML =
rows ||
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
CUSTOMER CHECKOUT
========================= */

async function checkout() {

if (!cart.length) {

alert(
  "Your cart is empty."
);

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

alert(
  "Checkout cancelled."
);

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

alert(
  "Checkout cancelled."
);

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

alert(
  "Checkout cancelled."
);

return;

}

const counts = {};

cart.forEach(id => {

const key =
  String(id);

counts[key] =
  (counts[key] || 0) + 1;

});

let total = 0;

const orderItems = [];

for (
const [id, quantity]
of Object.entries(counts)
) {

const product =
  products.find(
    p =>
      String(p.id) ===
      String(id)
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

for (const item of orderItems) {

  const product =
    products.find(
      p =>
        String(p.id) ===
        String(item.product_id)
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


const profileResponse =
  await fetch(
    SUPABASE_URL +
    "/rest/v1/profiles",
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


/* =========================================================
SEND NEW ORDER NOTIFICATION TO SELLER
========================================================= */

try {

  const sellerIds = [
    ...new Set(
      orderItems
        .map(item => {

          const product =
            products.find(
              p =>
                String(p.id) ===
                String(item.product_id)
            );

          return product
            ? Number(product.seller_id)
            : null;

        })
        .filter(
          sellerId =>
            Number.isFinite(sellerId) &&
            sellerId > 0
        )
    )
  ];


  for (const sellerId of sellerIds) {

    const notificationResponse =
      await fetch(
        SUPABASE_URL +
        "/functions/v1/send-order-notification",
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

              seller_id:
                sellerId,

              title:
                "🛍️ New ZavaMarket Order",

              message:
                "Order #" +
                orderId +
                " received — Total: R" +
                Number(total).toFixed(2)

            })
        }
      );


    if (!notificationResponse.ok) {

      console.warn(
        "Seller notification request failed:",
        await notificationResponse.text()
      );

    } else {

      console.log(
        "ZYRE Marketing seller notification sent for Order #" +
        orderId
      );

    }

  }

} catch (notificationError) {

  /*
  Notification failure must NOT stop checkout.
  The order has already been created successfully.
  */

  console.warn(
    "Order notification could not be sent:",
    notificationError
  );

}


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

const choice =
prompt(
"ZYRE SELLER CENTRE\n\n" +
"1 = Create a new store\n" +
"2 = Seller login\n\n" +
"Enter 1 or 2:"
);

if (choice === "1") {

await registerSeller();

return;

}

if (choice !== "2") {

alert(
  "Please enter 1 or 2."
);

return;

}

await sellerLogin();

}


/* =========================
REGISTER SELLER
========================= */

async function registerSeller() {

const storeName =
prompt(
"Enter your store name:"
);

if (
!storeName ||
!storeName.trim()
) {

alert(
  "Store registration cancelled."
);

return;

}

const email =
prompt(
"Enter your seller email:"
);

if (
!email ||
!email.trim()
) {

alert(
  "Store registration cancelled."
);

return;

}

const password =
prompt(
"Create a password:\n\n" +
"Use at least 6 characters."
);

if (
!password ||
password.length < 6
) {

alert(
  "Password must contain at least 6 characters."
);

return;

}

const description =
prompt(
"Enter a short description of your store:"
) || "";

try {

let userId = null;

let accessToken =
  SUPABASE_KEY;


const signupResponse =
  await fetch(

    SUPABASE_URL +
    "/auth/v1/signup",

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


if (signupResponse.ok) {

  const signupData =
    await signupResponse.json();


  if (signupData.user) {

    userId =
      signupData.user.id;

  }


  if (signupData.access_token) {

    accessToken =
      signupData.access_token;

  }

} else {

  const signupError =
    await signupResponse.text();


  if (
    signupError
      .toLowerCase()
      .includes("already registered")
  ) {

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
        "This seller email already exists, but we could not log into it.\n\n" +
        "If this was the account you just created, make sure you use the same password you entered earlier.\n\n" +
        await loginResponse.text()
      );

      return;

    }


    const loginData =
      await loginResponse.json();


    userId =
      loginData.user.id;


    accessToken =
      loginData.access_token;

  } else {

    alert(
      "Seller account could not be created.\n\n" +
      signupError
    );

    return;

  }

}


if (!userId) {

  alert(
    "Seller account was created, but the user ID could not be found."
  );

  return;

}


const profileResponse =
  await fetch(

    SUPABASE_URL +
    "/rest/v1/profiles",

    {

      method: "POST",

      headers: {

        "apikey":
          SUPABASE_KEY,

        "Authorization":
          "Bearer " +
          accessToken,

        "Content-Type":
          "application/json",

        "Prefer":
          "resolution=merge-duplicates,return=representation"

      },

      body:
        JSON.stringify({

          id:
            userId,

          full_name:
            storeName.trim(),

          phone:
            "",

          role:
            "seller"

        })

      }

    );


if (!profileResponse.ok) {

  alert(
    "Seller account exists, but the seller profile could not be created.\n\n" +
    await profileResponse.text()
  );

  return;

}


const existingSellerResponse =
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


let sellerId = null;


if (existingSellerResponse.ok) {

  const existingSellers =
    await existingSellerResponse.json();


  if (existingSellers.length) {

    sellerId =
      existingSellers[0].id;

  }

}


if (!sellerId) {

  const sellerResponse =
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
            accessToken,

          "Content-Type":
            "application/json",

          "Prefer":
            "return=representation"

        },

        body:
          JSON.stringify({

            user_id:
              userId,

            store_name:
              storeName.trim(),

            description:
              description.trim(),

            approved:
              false,

            email:
              email.trim()

          })

        }

      );


  if (!sellerResponse.ok) {

    alert(
      "Seller store could not be created.\n\n" +
      await sellerResponse.text()
    );

    return;

  }


  const sellerData =
    await sellerResponse.json();


  sellerId =
    sellerData[0].id;

}


const planResponse =
  await fetch(

    SUPABASE_URL +
    "/rest/v1/rental_plans?name=eq.ZYRE%20Store&active=eq.true&select=id,monthly_price",

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


if (!planResponse.ok) {

  alert(
    "Seller store was created, but the R100 rental plan could not be found.\n\n" +
    await planResponse.text()
  );

  return;

}


const plans =
  await planResponse.json();


if (!plans.length) {

  alert(
    "Seller store was created, but the ZYRE Store rental plan was not found."
  );

  return;

}


const rentalPlan =
  plans[0];


const existingSubscriptionResponse =
  await fetch(

    SUPABASE_URL +
    "/rest/v1/store_subscriptions?seller_id=eq." +
    sellerId +
    "&select=id,rental_plan_id,status",

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


let subscriptionId = null;


if (existingSubscriptionResponse.ok) {

  const subscriptions =
    await existingSubscriptionResponse.json();


  if (subscriptions.length) {

    subscriptionId =
      subscriptions[0].id;

  }

}


if (!subscriptionId) {

  const subscriptionResponse =
    await fetch(

      SUPABASE_URL +
      "/rest/v1/store_subscriptions",

      {

        method: "POST",

        headers: {

          "apikey":
            SUPABASE_KEY,

          "Authorization":
            "Bearer " +
            accessToken,

          "Content-Type":
            "application/json",

          "Prefer":
            "return=representation"

        },

        body:
          JSON.stringify({

            seller_id:
              sellerId,

            rental_plan_id:
              rentalPlan.id,

            status:
              "pending"

          })

        }

      );


  if (!subscriptionResponse.ok) {

    alert(
      "Store was created, but the rental subscription could not be created.\n\n" +
      await subscriptionResponse.text()
    );

    return;

  }


  const subscriptionData =
    await subscriptionResponse.json();


  subscriptionId =
    subscriptionData[0].id;

}


const existingPaymentResponse =
  await fetch(

    SUPABASE_URL +
    "/rest/v1/rental_payments?subscription_id=eq." +
    subscriptionId +
    "&select=id,status",

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


let paymentExists = false;


if (existingPaymentResponse.ok) {

  const payments =
    await existingPaymentResponse.json();

  paymentExists =
    payments.length > 0;

}


if (!paymentExists) {

  const paymentResponse =
    await fetch(

      SUPABASE_URL +
      "/rest/v1/rental_payments",

      {

        method: "POST",

        headers: {

          "apikey":
            SUPABASE_KEY,

          "Authorization":
            "Bearer " +
            accessToken,

          "Content-Type":
            "application/json",

          "Prefer":
            "return=representation"

        },

        body:
          JSON.stringify({

            seller_id:
              sellerId,

            subscription_id:
              subscriptionId,

            amount:
              Number(
                rentalPlan.monthly_price
              ),

            status:
              "pending",

            payment_method:
              "pending"

          })

        }

      );


  if (!paymentResponse.ok) {

    alert(
      "Store and subscription were created, but the rental payment record could not be created.\n\n" +
      await paymentResponse.text()
    );

    return;

  }

}


localStorage.setItem(
  "zava_seller_id",
  sellerId
);

localStorage.setItem(
  "zava_user_id",
  userId
);

localStorage.setItem(
  "zava_seller_email",
  email.trim()
);

localStorage.setItem(
  "zava_access_token",
  accessToken
);


const rentalPaymentUrl =

  "https://script.google.com/macros/s/AKfycby9wxW_NnME16qSiZrCOC4onVG7vkqxohfw1LABcn-9IaAE-57-7jqNwNDxuj63iqje/exec" +

  "?amount=" +
  encodeURIComponent(
    Number(
      rentalPlan.monthly_price
    ).toFixed(2)
  ) +

  "&item_name=" +
  encodeURIComponent(
    "ZYRE Store Rental - " +
    storeName.trim()
  ) +

  "&rental_subscription_id=" +
  encodeURIComponent(
    subscriptionId
  ) +

  "&seller_id=" +
  encodeURIComponent(
    sellerId
  ) +

  "&payment_type=rental";


alert(

  "🎉 Store application created!\n\n" +

  "Store: " +
  storeName.trim() +

  "\n\n" +

  "ZYRE Store rental: R" +
  Number(
    rentalPlan.monthly_price
  ).toFixed(2) +
  " per month\n\n" +

  "Next: You will be taken to PayFast Sandbox to complete the R100 rental payment."

);


window.location.href =
  rentalPaymentUrl;

} catch (error) {

alert(
  "Store registration failed:\n\n" +
  error.message
);

}

}


/* =========================
SELLER LOGIN
========================= */

async function sellerLogin() {

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
  Number(
    orderId.trim()
  );


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


/* =========================================================
ZYRE MARKETING
PUSH NOTIFICATION HELPERS
========================================================= */

function urlBase64ToUint8Array(base64String) {

const padding =
"=".repeat(
(4 - base64String.length % 4) % 4
);

const base64 =
(
base64String +
padding
)
.replace(/-/g, "+")
.replace(/_/g, "/");

const rawData =
window.atob(base64);

const outputArray =
new Uint8Array(
rawData.length
);

for (
let i = 0;
i < rawData.length;
++i
) {

outputArray[i] =
  rawData.charCodeAt(i);

}

return outputArray;

}


/* =========================
GET SERVICE WORKER
========================= */

async function getZYREServiceWorkerRegistration() {

if (!("serviceWorker" in navigator)) {

throw new Error(
  "Service workers are not supported by this browser."
);

}

const registration =
await navigator.serviceWorker.register(
"./sw.js",
{
scope: "./"
}
);

await navigator.serviceWorker.ready;

return registration;

}


/* =========================================================
FIND NOTIFICATION BUTTON
========================================================= */

function getZYRENotificationButton() {

const buttons =
Array.from(
document.querySelectorAll("button")
);

return buttons.find(button => {

const text =
(button.textContent || "")
.toLowerCase()
.trim();

return (
text.includes("enable notifications") ||
text.includes("notifications enabled") ||
text.includes("enable notification")
);

}) || null;

}


/* =========================================================
UPDATE NOTIFICATION BUTTON
========================================================= */

function updateZYRENotificationButton(
enabled
) {

const button =
getZYRENotificationButton();

if (!button) {

console.log(
"ZYRE notification button was not found yet."
);

return;

}

if (enabled) {

button.textContent =
"✅ Notifications Enabled";

button.disabled =
true;

button.style.opacity =
"0.7";

button.style.cursor =
"default";

button.setAttribute(
"aria-label",
"ZYRE Marketing notifications are enabled"
);

} else {

button.textContent =
"🔔 Enable Notifications";

button.disabled =
false;

button.style.opacity =
"1";

button.style.cursor =
"pointer";

button.setAttribute(
"aria-label",
"Enable ZYRE Marketing notifications"
);

}

}


/* =========================================================
SAVE PUSH SUBSCRIPTION
========================================================= */

async function saveZYREPushSubscription(
subscription
) {

const endpoint =
subscription.endpoint;

const existingResponse =
await fetch(

  SUPABASE_URL +
  "/rest/v1/push_subscriptions?endpoint=eq." +
  encodeURIComponent(endpoint) +
  "&select=id",

  {

    method: "GET",

    headers: {

      "apikey":
        SUPABASE_KEY,

      "Authorization":
        "Bearer " +
        SUPABASE_KEY

    }

  }

);

if (!existingResponse.ok) {

throw new Error(
  "Could not check the existing push subscription:\n\n" +
  await existingResponse.text()
);

}

const existing =
await existingResponse.json();

if (
Array.isArray(existing) &&
existing.length > 0
) {

console.log(
  "ZYRE push subscription already exists."
);

return;

}

const userId =
localStorage.getItem(
"zava_user_id"
);

const sellerId =
localStorage.getItem(
"zava_seller_id"
);

const subscriptionData = {

endpoint:
  endpoint,

subscription:
  subscription.toJSON()

};

if (userId) {

subscriptionData.user_id =
  userId;

}

if (sellerId) {

subscriptionData.seller_id =
  Number(sellerId);

}

const saveResponse =
await fetch(

  SUPABASE_URL +
  "/rest/v1/push_subscriptions",

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
      JSON.stringify(
        subscriptionData
      )

  }

);

if (!saveResponse.ok) {

throw new Error(
  "Push subscription could not be saved:\n\n" +
  await saveResponse.text()
);

}

console.log(
"ZYRE push subscription saved successfully."
);

}


/* =========================================================
CREATE PUSH SUBSCRIPTION
========================================================= */

async function subscribeToZYREPush() {

const registration =
await getZYREServiceWorkerRegistration();

if (
!registration.pushManager
) {

throw new Error(
  "Push notifications are not supported by this browser."
);

}

let subscription =
await registration.pushManager.getSubscription();

if (!subscription) {

subscription =
  await registration.pushManager.subscribe({

    userVisibleOnly:
      true,

    applicationServerKey:
      urlBase64ToUint8Array(
        ZYRE_VAPID_PUBLIC_KEY
      )

  });

}

console.log(
"ZYRE push subscription:",
subscription
);

await saveZYREPushSubscription(
subscription
);

return subscription;

}


/* =========================================================
CHECK EXISTING NOTIFICATION SUBSCRIPTION
========================================================= */

async function checkZYRENotificationStatus() {

try {

if (!("Notification" in window)) {

  updateZYRENotificationButton(false);

  return false;

}

if (
!navigator.serviceWorker ||
!window.PushManager
) {

  updateZYRENotificationButton(false);

  return false;

}

const permission =
Notification.permission;


/*
If Chrome has not granted permission,
the notification button must remain available.
*/

if (permission !== "granted") {

  updateZYRENotificationButton(false);

  return false;

}


/*
Permission is already granted.
Now check whether this browser/phone
already has a real push subscription.
*/

const registration =
await getZYREServiceWorkerRegistration();

const subscription =
await registration.pushManager.getSubscription();


if (!subscription) {

  console.log(
    "ZYRE notification permission is granted, but no push subscription exists yet."
  );

  updateZYRENotificationButton(false);

  return false;

}


/*
The subscription already exists.
Do NOT ask the user for permission again.
*/

console.log(
"Existing ZYRE push subscription found."
);


/*
Make sure the subscription is also stored
in Supabase. If it already exists, the function
will simply return.
*/

await saveZYREPushSubscription(
subscription
);


updateZYRENotificationButton(true);

return true;

} catch (error) {

console.error(
"Could not check ZYRE notification status:",
error
);

updateZYRENotificationButton(false);

return false;

}

}


/* =========================================================
ENABLE ZYRE NOTIFICATIONS
========================================================= */

window.enableZYRENotifications =
async function() {

if (!("Notification" in window)) {

  alert(
    "Your browser does not support notifications."
  );

  return false;

}


if (!("serviceWorker" in navigator)) {

  alert(
    "Your browser does not support service workers."
  );

  return false;

}


if (
!window.PushManager
) {

  alert(
    "Your browser does not support push notifications."
  );

  return false;

}


try {

  let permission =
    Notification.permission;


  /*
  If notifications are already granted,
  do NOT request permission again.
  */

  if (permission !== "granted") {

    permission =
      await Notification.requestPermission();

  }


  if (permission !== "granted") {

    alert(
      "Notifications were not enabled.\n\n" +
      "Please allow notifications for ZYRE Marketing in your browser settings."
    );

    updateZYRENotificationButton(false);

    return false;

  }


  /*
  Get or create the push subscription.
  */

  const subscription =
    await subscribeToZYREPush();


  if (!subscription) {

    throw new Error(
      "The push subscription was not created."
    );

  }


  /*
  Mark the dashboard button as enabled.
  */

  updateZYRENotificationButton(true);


  console.log(
    "ZYRE Marketing notifications enabled.",
    subscription
  );


  alert(
    "🔔 ZYRE Marketing notifications are enabled!\n\n" +
    "This phone is now registered for push notifications."
  );


  return true;


} catch (error) {

  console.error(
    "Notification setup failed:",
    error
  );


  updateZYRENotificationButton(false);


  alert(
    "Notification setup failed:\n\n" +
    error.message
  );


  return false;

}

};


/* =========================================================
REFRESH PUSH SUBSCRIPTION
========================================================= */

window.refreshZYREPushSubscription =
async function() {

try {

  if (
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {

    updateZYRENotificationButton(false);

    return false;

  }


  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {

    updateZYRENotificationButton(false);

    return false;

  }


  const registration =
    await getZYREServiceWorkerRegistration();


  let subscription =
    await registration.pushManager.getSubscription();


  /*
  If Chrome has permission but the subscription
  disappeared, create a new one.
  */

  if (!subscription) {

    subscription =
      await registration.pushManager.subscribe({

        userVisibleOnly:
          true,

        applicationServerKey:
          urlBase64ToUint8Array(
            ZYRE_VAPID_PUBLIC_KEY
          )

      });

  }


  await saveZYREPushSubscription(
    subscription
  );


  updateZYRENotificationButton(true);


  console.log(
    "ZYRE push subscription checked and restored."
  );


  return true;


} catch (error) {

  console.error(
    "Could not refresh ZYRE push subscription:",
    error
  );

  updateZYRENotificationButton(false);

  return false;

}

};


/* =========================================================
START
========================================================= */

loadProducts();


/* =========================================================
NOTIFICATION STARTUP
========================================================= */

window.addEventListener(
"load",
function () {

setTimeout(
  async function () {

    /*
    First check the existing notification state.
    This prevents the dashboard from asking again
    after a normal page refresh.
    */

    const alreadyEnabled =
      await checkZYRENotificationStatus();


    /*
    Only automatically request permission when
    the browser has never been asked before.

    If permission is "granted", we DO NOT ask again.
    If permission is "denied", we leave it alone.
    */

    if (
      !alreadyEnabled &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {

      /*
      We intentionally do not automatically pop
      the permission request here.

      The user can press:
      🔔 Enable Notifications
      */

      updateZYRENotificationButton(false);

    }

  },
  1500
);

});