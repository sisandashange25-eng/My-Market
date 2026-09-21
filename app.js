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
