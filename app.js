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
      "Email: " + email + "\n\n" +
      "Your application is waiting for approval."
    );

  } catch (error) {

    console.log("Seller registration error:", error);

    alert(
      "Seller registration failed.\n\n" +
      "Please check your internet connection and try again."
    );
  }
}


renderProducts();
updateCart();
loadProducts();
