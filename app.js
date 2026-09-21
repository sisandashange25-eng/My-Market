const products=[
{id:1,name:"Wireless Earbuds",price:299,cat:"Electronics",icon:"🎧",seller:"Tech Store"},
{id:2,name:"Smart Watch",price:499,cat:"Electronics",icon:"⌚",seller:"Gadget Hub"},
{id:3,name:"Classic Sneakers",price:699,cat:"Fashion",icon:"👟",seller:"Urban Wear"},
{id:4,name:"Hoodie",price:399,cat:"Fashion",icon:"🧥",seller:"Urban Wear"},
{id:5,name:"Kitchen Blender",price:549,cat:"Home",icon:"🥤",seller:"Home World"},
{id:6,name:"Skincare Set",price:249,cat:"Beauty",icon:"🧴",seller:"Beauty Shop"},
{id:7,name:"Bluetooth Speaker",price:379,cat:"Electronics",icon:"🔊",seller:"Tech Store"},
{id:8,name:"Bedside Lamp",price:199,cat:"Home",icon:"💡",seller:"Home World"}];
let category="All",cart=JSON.parse(localStorage.getItem("cart")||"[]");
function setCategory(c){category=c;document.getElementById("heading").textContent=c+" products";renderProducts()}
function renderProducts(){let q=document.getElementById("search").value.toLowerCase(),s=document.getElementById("sort").value;
let p=products.filter(x=>(category==="All"||x.cat===category)&&x.name.toLowerCase().includes(q));
if(s==="low")p.sort((a,b)=>a.price-b.price);if(s==="high")p.sort((a,b)=>b.price-a.price);
document.getElementById("products").innerHTML=p.map(x=>`<article class="card"><div class="pic">${x.icon}</div><h3>${x.name}</h3><div class="seller">${x.seller}</div><div class="price">R${x.price.toFixed(2)}</div><button class="add" onclick="add(${x.id})">Add to cart</button></article>`).join("")||"<p>No products found.</p>"}
function add(id){cart.push(id);save();updateCart();alert("Added to cart")}
function save(){localStorage.setItem("cart",JSON.stringify(cart))}
function updateCart(){document.getElementById("cartCount").textContent=cart.length;let counts={};cart.forEach(id=>counts[id]=(counts[id]||0)+1);let total=0;
document.getElementById("cartItems").innerHTML=Object.entries(counts).map(([id,n])=>{let x=products.find(p=>p.id==id);total+=x.price*n;return `<div class="cartrow"><span>${x.name} × ${n}</span><b>R${(x.price*n).toFixed(2)}</b></div>`}).join("")||"<p>Your cart is empty.</p>";document.getElementById("total").textContent=total.toFixed(2)}
function toggleCart(){document.getElementById("cart").classList.toggle("open");updateCart()}
function checkout(){if(!cart.length)return alert("Your cart is empty.");alert("Demo checkout ready. Connect your payment provider and database to accept real orders.")}
renderProducts();updateCart();