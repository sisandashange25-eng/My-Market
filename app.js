function sellerCentre() {
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

  fetch(SUPABASE_URL + "/rest/v1/sellers", {
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
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Seller registration failed");
    }

    alert(
      "Seller application submitted successfully! 🎉\n\n" +
      "Store: " + name + "\n" +
      "Email: " + email + "\n\n" +
      "Your application is waiting for approval."
    );
  })
  .catch(error => {
    console.log(error);
    alert(
      "Could not submit the seller application.\n\n" +
      "Please try again."
    );
  });
}
