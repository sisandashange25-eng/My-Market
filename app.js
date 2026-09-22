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
      throw new Error(await response.text());
    }

    const data = await response.json();

    console.log("REAL PRODUCTS:", data);


    const sellersResponse = await fetch(
      SUPABASE_URL + "/rest/v1/sellers?select=id,store_name",
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

      sellerMap[seller.id] = seller.store_name;

    });


    products = data.map(p => ({

      id: p.id,

      name: p.name,

      price: Number(p.price),

      cat: p.category || "Other",

      seller: sellerMap[p.seller_id] || "Zava Seller",

      image_url: p.image_url || ""

    }));


    console.log("FINAL PRODUCTS:", products);


    renderProducts();

    updateCart();


  } catch (error) {

    console.log("Could not load Supabase products:", error);

    products = [];

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

  const cartItems =
