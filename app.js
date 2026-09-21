const SUPABASE_URL = "https://gaccizzlwswwynattgda.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhY2Npenpsd3N3d3luYXR0Z2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NzU5MTQsImV4cCI6MjEwNTU1MTkxNH0.-H0PuF99TWnE8cH3Ecb-NAJh4ml0txAzeyLoCF6foXA";
const SUPABASE_ANON_KEY = SUPABASE_KEY;

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
