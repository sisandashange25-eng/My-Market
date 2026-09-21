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

  const password = prompt("Create a password (at least 6 characters):");

  if (!password || password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) throw error;

    const userId = data.user?.id;

    if (!userId) {
      throw new Error("Account was not created.");
    }

    const response = await fetch(
      SUPABASE_URL + "/rest/v1/Sellers",
      {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          user_id: userId,
          store_name: name,
          description: "",
          approved: false
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert(
      "Seller registration successful!\\n\\n" +
      "Store: " + name + "\\n" +
      "Email: " + email
    );

  } catch (error) {
    console.error(error);
    alert("Seller registration failed: " + error.message);
  }
}
