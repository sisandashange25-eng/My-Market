/* =========================================================
ZYRE MARKETING
Clean Black + White Marketplace
========================================================= */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  }

html {
scroll-behavior: smooth;
}

body {
font-family:
"Segoe UI",
Arial,
sans-serif;

background: #ffffff;
color: #000000;

min-height: 100vh;
line-height: 1.6;
}

button,
input,
select,
textarea {
font: inherit;
}

button {
cursor: pointer;
}

img {
max-width: 100%;
display: block;
}

a {
color: inherit;
text-decoration: none;
}

.hidden {
display: none !important;
}

/* =========================================================
GLOBAL
========================================================= */

.eyebrow {
font-size: 12px;
font-weight: 700;
letter-spacing: 2px;
text-transform: uppercase;
}

/* =========================================================
HEADER
========================================================= */

.zyre-header {
width: 100%;
background: #ffffff;
border-bottom: 1px solid #e5e5e5;

padding: 18px 5%;

display: flex;
align-items: center;
justify-content: space-between;

gap: 20px;

position: sticky;
top: 0;
z-index: 1000;
}

.brand {
display: flex;
flex-direction: column;
line-height: 1;
}

.brand-main {
font-size: 28px;
font-weight: 900;
letter-spacing: 2px;
}

.brand-sub {
font-size: 9px;
font-weight: 700;
letter-spacing: 3px;
margin-top: 6px;
}

.header-search {
flex: 1;
max-width: 550px;

display: flex;
align-items: center;
}

.header-search input {
width: 100%;

padding: 12px 16px;

border: 1px solid #d8d8d8;
border-radius: 4px;

background: #ffffff;
color: #000000;

outline: none;
}

.header-search input:focus {
border-color: #000000;
}

.cart-button {
border: 1px solid #000000;
background: #000000;
color: #ffffff;

padding: 11px 18px;
border-radius: 4px;

font-weight: 700;
}

/* =========================================================
NAVIGATION
========================================================= */

.zyre-nav {
width: 100%;

display: flex;
align-items: center;
justify-content: center;

gap: 28px;

padding: 13px 5%;

background: #ffffff;
border-bottom: 1px solid #eeeeee;
}

.zyre-nav a {
font-size: 13px;
font-weight: 700;
letter-spacing: 1px;
text-transform: uppercase;
}

.zyre-nav a:hover {
text-decoration: underline;
}

/* =========================================================
HERO
========================================================= */

.hero {
width: 100%;

background: #ffffff;

padding: 90px 5%;

border-bottom: 1px solid #eeeeee;
}

.hero-content {
max-width: 1200px;
margin: 0 auto;

display: grid;
grid-template-columns: 1fr 0.8fr;

gap: 60px;
align-items: center;
}

.hero h1 {
font-size: clamp(42px, 7vw, 82px);
line-height: 0.95;

letter-spacing: -3px;

margin: 16px 0 24px;

font-weight: 900;
}

.hero-text {
max-width: 600px;

font-size: 18px;
color: #444444;

margin-bottom: 30px;
}

.hero-buttons {
display: flex;
gap: 12px;
flex-wrap: wrap;
}

.primary-button,
.secondary-button {
display: inline-flex;
align-items: center;
justify-content: center;

padding: 14px 24px;

border-radius: 4px;

font-weight: 800;
}

.primary-button {
background: #000000;
color: #ffffff;
border: 1px solid #000000;
}

.secondary-button {
background: #ffffff;
color: #000000;
border: 1px solid #000000;
}

.hero-mark {
width: 100%;
min-height: 360px;

display: flex;
align-items: center;
justify-content: center;

background: #f5f5f5;

border: 1px solid #e5e5e5;
}

.hero-z {
font-size: 220px;
font-weight: 900;
line-height: 1;
}

/* =========================================================
SELLER BANNER
========================================================= */

.seller-banner {
background: #000000;
color: #ffffff;

padding: 30px 5%;

display: flex;
align-items: center;
justify-content: space-between;

gap: 20px;
}

.seller-banner h2 {
font-size: 26px;
}

.seller-banner p {
color: #cccccc;
}

/* =========================================================
MARKETPLACE
========================================================= */

.marketplace {
max-width: 1300px;
margin: 0 auto;

padding: 70px 5%;
}

.toolbar {
display: flex;
justify-content: space-between;
align-items: center;

gap: 20px;

margin-bottom: 30px;
}

.grid {
display: grid;

grid-template-columns:
repeat(4, minmax(0, 1fr));

gap: 22px;
}

/* =========================================================
CARDS
========================================================= */

.product-card,
.store-card {
background: #ffffff;

border: 1px solid #e2e2e2;

overflow: hidden;

transition:
transform 0.2s ease,
box-shadow 0.2s ease;
}

.product-card:hover,
.store-card:hover {
transform: translateY(-3px);

box-shadow:
0 12px 30px rgba(0, 0, 0, 0.08);
}

.pic {
width: 100%;
aspect-ratio: 1 / 1;

background: #f4f4f4;

display: flex;
align-items: center;
justify-content: center;

overflow: hidden;
}

.pic img {
width: 100%;
height: 100%;

object-fit: cover;
}

.product-card-content,
.store-card-content {
padding: 18px;
}

.product-card h3,
.store-card h3 {
font-size: 18px;
margin-bottom: 6px;
}

.product-card p,
.store-card p {
color: #555555;
font-size: 14px;
}

.price {
font-weight: 900;
font-size: 18px;

margin-top: 12px;
}

/* =========================================================
CATEGORIES
========================================================= */

.categories {
max-width: 1300px;
margin: 0 auto;

padding: 20px 5% 70px;
}

.section-title {
font-size: 34px;
font-weight: 900;

margin-bottom: 28px;
}

.category-grid {
display: grid;

grid-template-columns:
repeat(4, minmax(0, 1fr));

gap: 15px;
}

.category-card {
border: 1px solid #dddddd;

padding: 24px;

background: #ffffff;

font-weight: 800;

transition:
background 0.2s ease,
color 0.2s ease;
}

.category-card:hover {
background: #000000;
color: #ffffff;
}

/* =========================================================
HOW IT WORKS
========================================================= */

.how-it-works {
background: #f7f7f7;

padding: 70px 5%;
}

.steps {
max-width: 1200px;
margin: 0 auto;

display: grid;

grid-template-columns:
repeat(3, minmax(0, 1fr));

gap: 25px;
}

.step {
background: #ffffff;

border: 1px solid #dddddd;

padding: 30px;
}

.step h3 {
margin-bottom: 10px;
}

.step p {
color: #555555;
}

/* =========================================================
SERVICES
========================================================= */

.services {
max-width: 1200px;
margin: 0 auto;

padding: 70px 5%;
}

/* =========================================================
DRAWER
========================================================= */

.drawer {
position: fixed;

top: 0;
right: 0;

width: min(380px, 90vw);
height: 100vh;

background: #ffffff;

box-shadow:
-10px 0 35px rgba(0, 0, 0, 0.15);

z-index: 3000;

transform: translateX(100%);

transition:
transform 0.25s ease;
}

.drawer.open {
transform: translateX(0);
}

/* =========================================================
FOOTER
========================================================= */

.zyre-footer {
background: #000000;
color: #ffffff;

padding: 50px 5%;

text-align: center;
}

.zyre-footer p {
color: #bbbbbb;
}

/* =========================================================
MOBILE MENU
========================================================= */

.menu-button {
display: none;

background: #000000;
color: #ffffff;

border: 0;

padding: 10px 14px;

border-radius: 4px;

font-weight: 800;
}

.zyre-menu {
position: fixed;

inset: 0;

background: #ffffff;

z-index: 5000;

transform: translateX(-100%);

transition:
transform 0.25s ease;

overflow-y: auto;
}

.zyre-menu.open {
transform: translateX(0);
}

.zyre-menu-header {
display: flex;
justify-content: space-between;
align-items: center;

padding: 22px;

border-bottom: 1px solid #eeeeee;
}

.zyre-menu-brand {
display: flex;
flex-direction: column;
}

.zyre-menu-logo {
font-size: 25px;
font-weight: 900;
letter-spacing: 2px;
}

.zyre-menu-items {
display: flex;
flex-direction: column;
}

.zyre-menu-items a {
padding: 18px 22px;

border-bottom: 1px solid #eeeeee;

font-weight: 800;
}

.zyre-menu-footer {
padding: 22px;
}

/* =========================================================
ACCOUNT / AUTH PAGE
========================================================= */

.zyre-auth-page {
background: #050505 !important;
color: #ffffff !important;

min-height: 100vh;

line-height: 1.5;
}

/* HEADER */

.zyre-auth-page .auth-header {
width: 100%;

background: #050505;

border-bottom: 1px solid #292929;

padding: 20px 5%;

display: flex;

align-items: center;

justify-content: space-between;

gap: 20px;
}

.zyre-auth-page .auth-brand {
display: flex;
flex-direction: column;
}

.zyre-auth-page .auth-brand-main {
color: #ffffff;

font-size: 30px;

font-weight: 900;

letter-spacing: 3px;

line-height: 1;
}

.zyre-auth-page .auth-brand-sub {
color: #aaaaaa;

font-size: 9px;

font-weight: 700;

letter-spacing: 2px;

margin-top: 7px;

text-transform: uppercase;
}

.zyre-auth-page .auth-back {
background: #ffffff;

color: #000000;

border: 1px solid #ffffff;

padding: 11px 18px;

border-radius: 4px;

font-weight: 800;
}

.zyre-auth-page .auth-back:hover {
background: #dddddd;
}

/* MAIN */

.zyre-auth-page .auth-main {
width: 100%;

max-width: 900px;

margin: 0 auto;

padding: 55px 20px 80px;
}

/* HEADING */

.zyre-auth-page .auth-heading {
text-align: center;

margin-bottom: 30px;
}

.zyre-auth-page .auth-eyebrow {
color: #aaaaaa;

font-size: 11px;

font-weight: 800;

letter-spacing: 2px;

text-transform: uppercase;

margin-bottom: 10px;
}

.zyre-auth-page .auth-heading h1 {
color: #ffffff;

font-size: clamp(34px, 6vw, 54px);

line-height: 1;

font-weight: 900;

letter-spacing: -1px;

margin-bottom: 15px;
}

.zyre-auth-page .auth-heading p {
color: #aaaaaa;

font-size: 16px;
}

/* CARD */

.zyre-auth-page .auth-card {
background: #111111;

border: 1px solid #2d2d2d;

border-radius: 10px;

padding: 30px;

box-shadow:
0 20px 60px rgba(0, 0, 0, 0.35);
}

/* CUSTOMER / SELLER */

.zyre-auth-page .auth-choice {
display: grid;

grid-template-columns: 1fr 1fr;

gap: 10px;

margin-bottom: 20px;
}

.zyre-auth-page .auth-choice-btn {
width: 100%;

padding: 15px;

background: #191919;

color: #bbbbbb;

border: 1px solid #333333;

border-radius: 5px;

font-weight: 800;

transition:
background 0.2s ease,
color 0.2s ease,
border-color 0.2s ease;
}

.zyre-auth-page .auth-choice-btn:hover {
border-color: #777777;

color: #ffffff;
}

.zyre-auth-page .auth-choice-btn.active {
background: #ffffff;

color: #000000;

border-color: #ffffff;
}

/* TABS */

.zyre-auth-page .auth-tabs {
display: grid;

grid-template-columns: 1fr 1fr;

border-bottom: 1px solid #333333;

margin-bottom: 25px;
}

.zyre-auth-page .auth-tab {
background: transparent;

color: #888888;

border: 0;

border-bottom: 2px solid transparent;

padding: 14px 10px;

font-weight: 800;
}

.zyre-auth-page .auth-tab.active {
color: #ffffff;

border-bottom-color: #ffffff;
}

/* MESSAGE */

.zyre-auth-page .auth-message {
display: none;

padding: 13px 15px;

margin-bottom: 20px;

border-radius: 5px;

font-size: 14px;

line-height: 1.5;
}

.zyre-auth-page .auth-message.show {
display: block;

background: #202020;

color: #ffffff;

border: 1px solid #3b3b3b;
}

.zyre-auth-page .auth-message.error {
background: #2a1515;

color: #ffb3b3;

border-color: #673434;
}

.zyre-auth-page .auth-message.success {
background: #152719;

color: #b8e7c1;

border-color: #345b3c;
}

/* PANELS */

.zyre-auth-page .auth-panel {
width: 100%;
}

.zyre-auth-page .auth-panel.hidden {
display: none !important;
}

.zyre-auth-page .auth-panel h2 {
color: #ffffff;

font-size: 25px;

font-weight: 900;

margin-bottom: 8px;
}

.zyre-auth-page .subtitle {
color: #999999;

font-size: 14px;

margin-bottom: 25px;
}

/* FORM */

.zyre-auth-page .auth-form-group {
margin-bottom: 18px;
}

.zyre-auth-page .auth-form-group label {
display: block;

color: #dddddd;

font-size: 13px;

font-weight: 700;

margin-bottom: 7px;
}

.zyre-auth-page .auth-form-group input {
width: 100%;

display: block;

padding: 14px 15px;

background: #050505;

color: #ffffff;

border: 1px solid #3a3a3a;

border-radius: 5px;

outline: none;
}

.zyre-auth-page .auth-form-group input::placeholder {
color: #666666;
}

.zyre-auth-page .auth-form-group input:focus {
border-color: #ffffff;

box-shadow:
0 0 0 2px rgba(255, 255, 255, 0.08);
}

.zyre-auth-page .auth-primary,
.zyre-auth-page .auth-secondary {
width: 100%;

padding: 14px 18px;

border-radius: 5px;

font-weight: 800;

transition:
opacity 0.2s ease,
background 0.2s ease;
}

.zyre-auth-page .auth-primary {
background: #ffffff;

color: #000000;

border: 1px solid #ffffff;
}

.zyre-auth-page .auth-primary:hover {
background: #dddddd;
}

.zyre-auth-page .auth-secondary {
background: transparent;

color: #ffffff;

border: 1px solid #555555;
}

.zyre-auth-page .auth-secondary:hover {
background: #222222;

border-color: #888888;
}

.zyre-auth-page .auth-primary:disabled,
.zyre-auth-page .auth-secondary:disabled {
opacity: 0.5;

cursor: not-allowed;
}

/* SELLER BOXES */

.zyre-auth-page .seller-continue-box {
background: #181818;

border: 1px solid #333333;

border-radius: 6px;

padding: 20px;

margin-top: 25px;
}

.zyre-auth-page .seller-continue-box h3 {
color: #ffffff;

font-size: 17px;

font-weight: 800;

margin-bottom: 7px;
}

.zyre-auth-page .seller-continue-box p {
color: #999999;

font-size: 14px;

margin-bottom: 15px;
}

/* DIVIDER */

.zyre-auth-page .auth-divider {
display: flex;

align-items: center;

gap: 15px;

color: #666666;

font-size: 10px;

font-weight: 800;

letter-spacing: 2px;

margin: 30px 0 18px;

text-align: center;
}

.zyre-auth-page .auth-divider::before,
.zyre-auth-page .auth-divider::after {
content: "";

flex: 1;

height: 1px;

background: #2d2d2d;
}

/* FOOTER NOTE */

.zyre-auth-page .auth-footer-note {
color: #777777;

font-size: 12px;

line-height: 1.5;
}

/* =========================================================
RESPONSIVE
========================================================= */

@media (max-width: 1000px) {

.hero-content {
grid-template-columns: 1fr;
}

.grid {
grid-template-columns:
repeat(3, minmax(0, 1fr));
}

.category-grid {
grid-template-columns:
repeat(3, minmax(0, 1fr));
}

}

@media (max-width: 700px) {

.zyre-header {
padding: 15px 4%;
}

.header-search {
display: none;
}

.zyre-nav {
display: none;
}

.menu-button {
display: block;
}

.hero {
padding: 60px 5%;
}

.hero h1 {
letter-spacing: -2px;
}

.hero-mark {
min-height: 250px;
}

.hero-z {
font-size: 150px;
}

.grid {
grid-template-columns:
repeat(2, minmax(0, 1fr));
}

.category-grid {
grid-template-columns:
repeat(2, minmax(0, 1fr));
}

.steps {
grid-template-columns: 1fr;
}

.seller-banner {
flex-direction: column;
align-items: flex-start;
}

/* AUTH MOBILE */

.zyre-auth-page .auth-header {
padding: 17px 18px;
}

.zyre-auth-page .auth-brand-main {
font-size: 25px;
}

.zyre-auth-page .auth-brand-sub {
font-size: 8px;
}

.zyre-auth-page .auth-back {
padding: 9px 12px;

font-size: 12px;

}

.zyre-auth-page .auth-main {
padding: 40px 14px 60px;
}

.zyre-auth-page .auth-card {
padding: 20px 16px;

border-radius: 8px;

}

.zyre-auth-page .auth-heading h1 {
font-size: 38px;
}

}

@media (max-width: 400px) {

.grid {
grid-template-columns: 1fr;
}

.category-grid {
grid-template-columns: 1fr;
}

.hero h1 {
font-size: 42px;
}

.zyre-auth-page .auth-choice {
grid-template-columns: 1fr;
}

.zyre-auth-page .auth-heading h1 {
font-size: 34px;
}

.zyre-auth-page .auth-card {
padding: 17px 13px;
}

}

/* =========================================================
SELECTION
========================================================= */

::selection {
background: #000000;
color: #ffffff;
}