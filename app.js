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

  const password = prompt(
    "Create a password (at least 6 characters):"
  );

  if (!password) {
    alert("Seller registration cancelled.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  fetch(SUPABASE_URL + "/auth/v1/signup", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {

    if (data.error || data.msg) {
      alert(
        "Registration failed:\n\n" +
        (data.error_description || data.msg || data.error)
      );
      return;
    }

    alert(
      "Seller account created successfully! 🎉\n\n" +
      "Store: " + name + "\n" +
      "Email: " + email + "\n\n" +
      "Your account is now registered with ZavaMarket."
    );

  })
  .catch(error => {
    console.log(error);
    alert("Something went wrong. Please try again.");
  });
}function sellerCentre() {
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

  const password = prompt(
    "Create a password (at least 6 characters):"
  );

  if (!password) {
    alert("Seller registration cancelled.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  fetch(SUPABASE_URL + "/auth/v1/signup", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {

    if (data.error || data.msg) {
      alert(
        "Registration failed:\n\n" +
        (data.error_description || data.msg || data.error)
      );
      return;
    }

    alert(
      "Seller account created successfully! 🎉\n\n" +
      "Store: " + name + "\n" +
      "Email: " + email + "\n\n" +
      "Your account is now registered with ZavaMarket."
    );

  })
  .catch(error => {
    console.log(error);
    alert("Something went wrong. Please try again.");
  });
}
