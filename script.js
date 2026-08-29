const PRODUCTS=[
{id:1,name:"Aether Headphones",cat:"AUDIO",price:249,tag:"BESTSELLER",desc:"Spatial wireless headphones engineered for deep, immersive listening.",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"},
{id:2,name:"Nova Watch X",cat:"WEARABLE",price:329,tag:"NEW",desc:"A precision wearable with a titanium-inspired silhouette and clean interface.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"},
{id:3,name:"Orbit Camera",cat:"CREATIVE",price:699,tag:"PRO",desc:"A compact creator camera designed for cinematic everyday capture.",image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80"},
{id:4,name:"Flux Runner",cat:"MOTION",price:179,tag:"HOT",desc:"Lightweight performance sneakers with a futuristic profile.",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"},
{id:5,name:"Arc Keyboard",cat:"DESK",price:159,tag:"DESK",desc:"Low-profile mechanical keys with a tactile, minimal layout.",image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80"},
{id:6,name:"Lumen Lamp",cat:"SPACE",price:119,tag:"LIMITED",desc:"Ambient smart lighting that turns your workspace into a studio.",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80"}
];

let cart=JSON.parse(localStorage.getItem("novaCart")||"[]");
let category="ALL",query="";

const app=document.querySelector("#app"),drawer=document.querySelector("#cartDrawer"),overlay=document.querySelector("#overlay");
const cartItems=document.querySelector("#cartItems"),cartCount=document.querySelector("#cartCount"),cartTotal=document.querySelector("#cartTotal");
const toast=document.querySelector("#toast"),modal=document.querySelector("#productModal"),modalContent=document.querySelector("#modalContent");

const money=n=>`$${n.toLocaleString()}`;
const save=()=>localStorage.setItem("novaCart",JSON.stringify(cart));
const count=()=>cart.reduce((s,x)=>s+x.qty,0);
const total=()=>cart.reduce((s,x)=>s+x.price*x.qty,0);

function escapeHTML(v){const d=document.createElement("div");d.textContent=v;return d.innerHTML}
function escapeAttr(v){return escapeHTML(v).replaceAll('"',"&quot;")}

function productCard(p){
 return `<article class="product-card" data-product="${p.id}">
 <div class="product-media"><img src="${p.image}" alt="${escapeAttr(p.name)}" loading="lazy" width="1000" height="800"><span class="badge">${p.tag}</span></div>
 <div class="product-info"><span class="category">${p.cat}</span><h3>${p.name}</h3><p class="desc">${p.desc}</p>
 <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">Add to bag +</button></div></div></article>`
}

function render(){
 const route=location.hash.replace("#/","")||"home";
 document.querySelectorAll(".nav a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#/${route}`));
 if(route==="shop")renderShop();else if(route==="about")renderAbout();else renderHome();
 renderCart();
}

function renderHome(){
 app.innerHTML=`<section class="hero">
 <div><p class="eyebrow">CURATED DIGITAL COMMERCE / 001</p><h1>Objects for the<br><span class="gradient">next chapter.</span></h1>
 <p class="hero-copy">NOVA is a premium concept store for people who care about what technology feels like. Explore a collection designed around form, function and future-facing details.</p>
 <div class="hero-actions"><a class="primary" href="#/shop">Explore collection →</a><a class="secondary" href="#/about">How it works</a></div>
 <div class="hero-meta"><div><b>06</b><span>CURATED PIECES</span></div><div><b>24/7</b><span>DIGITAL STORE</span></div><div><b>3D</b><span>INTERFACE</span></div></div></div>
 <div class="stage"><div class="artifact"><div class="artifact-main"></div><div class="artifact-side"></div><div class="artifact-shadow"></div></div></div></section>
 <section class="section"><div class="section-head"><div><p class="eyebrow">THE NOVA PHILOSOPHY</p><h2>Beautifully useful.</h2></div><p class="muted">A production-style storefront combining routing, persistent state, responsive architecture and performance-aware assets.</p></div>
 <div class="feature"><div><p class="eyebrow">SIGNATURE DROP</p><h2>Technology should have presence.</h2><p>Every interaction is intentionally tactile: depth on hover, instant feedback, persistent shopping state and a layout that adapts from pocket to desktop.</p><a class="primary" href="#/shop">Shop signature pieces →</a></div><div class="feature-art"></div></div></section>
 <section class="section"><div class="section-head"><div><p class="eyebrow">SELECTED OBJECTS</p><h2>Trending now.</h2></div><a class="secondary" href="#/shop">View collection</a></div><div class="products">${PRODUCTS.slice(0,3).map(productCard).join("")}</div></section>`;
}

function renderShop(){
 app.innerHTML=`<section class="section" style="padding-top:75px"><div class="section-head"><div><p class="eyebrow">THE COLLECTION</p><h2>Find your next piece.</h2><p class="muted">Search, filter and build your bag. Cart state is automatically remembered.</p></div>
 <div class="catalog-tools"><input class="search" id="search" placeholder="Search products..." value="${escapeAttr(query)}"></div></div>
 <div class="catalog-tools" id="filters">${["ALL","AUDIO","WEARABLE","CREATIVE","MOTION","DESK","SPACE"].map(c=>`<button class="filter ${category===c?"active":""}" data-cat="${c}">${c}</button>`).join("")}</div>
 <div id="products" class="products" style="margin-top:16px"></div></section>`;
 document.querySelector("#search").addEventListener("input",e=>{query=e.target.value.toLowerCase();updateShop()});
 document.querySelector("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;category=b.dataset.cat;document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x===b));updateShop()});
 updateShop();
}

function updateShop(){
 const list=PRODUCTS.filter(p=>(category==="ALL"||p.cat===category)&&(!query||`${p.name} ${p.cat} ${p.desc}`.toLowerCase().includes(query)));
 document.querySelector("#products").innerHTML=list.length?list.map(productCard).join(""):`<div class="empty"><h3>No matches.</h3><p>Try another search or category.</p></div>`;
}

function renderAbout(){
 app.innerHTML=`<section class="about-hero"><p class="eyebrow">CAPSTONE / PROJECT ARCHITECTURE</p><h1>Built like a<br><span class="gradient">real product.</span></h1><p>This capstone combines the previous internship skills into one polished commerce experience: semantic structure, advanced CSS, JavaScript state, client-side routing, persistent cart data, responsive design and performance-aware assets.</p></section>
 <section class="section"><div class="architecture">
 <article class="arch-card"><b>01</b><h3>Modular frontend</h3><p>Product data, reusable rendering functions, shared cart state and independent route views keep the application easy to extend.</p></article>
 <article class="arch-card"><b>02</b><h3>Client-side routing</h3><p>Hash routing provides Home, Collection and Studio views without full-page reloads or a framework dependency.</p></article>
 <article class="arch-card"><b>03</b><h3>Performance first</h3><p>Deferred JavaScript, lazy images, responsive image parameters, minimal dependencies and CSS-first visual effects.</p></article>
 </div></section>
 <section class="section"><div class="quick"><article class="quick-card"><b>01</b><h3>Persistent bag</h3><p>Your selected products survive browser refreshes using localStorage.</p></article><article class="quick-card"><b>02</b><h3>Responsive</h3><p>Grid architecture reshapes naturally for tablet and mobile screens.</p></article><article class="quick-card"><b>03</b><h3>Interactive</h3><p>Instant product previews, filtering, cart updates and feedback to every action.</p></article><article class="quick-card"><b>04</b><h3>Deployable</h3><p>Static architecture is ready for Vercel, Netlify or Render deployment.</p></article></div></section>`;
}

function renderCart(){
 cartCount.textContent=count();cartTotal.textContent=money(total());
 cartItems.innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="${x.image}" alt="" loading="lazy"><div><h4>${x.name}</h4><small>${money(x.price)} × ${x.qty}</small><div class="qty"><button data-qty="-1" data-id="${x.id}">−</button><span>${x.qty}</span><button data-qty="1" data-id="${x.id}">+</button></div></div><button class="remove" data-remove="${x.id}">×</button></div>`).join(""):`<div class="empty"><h3>Your bag is empty.</h3><p>Explore the collection and add a piece.</p></div>`;
}

function add(id){const p=PRODUCTS.find(x=>x.id===id);const old=cart.find(x=>x.id===id);old?old.qty++:cart.push({...p,qty:1});save();renderCart();toastMsg(`${p.name} added to your bag.`)}
function openProduct(id){const p=PRODUCTS.find(x=>x.id===id);modalContent.innerHTML=`<div class="modal-grid"><img src="${p.image}" alt="${escapeAttr(p.name)}"><div class="modal-info"><span class="category">${p.cat}</span><h2>${p.name}</h2><p>${p.desc}</p><div class="modal-price">${money(p.price)}</div><button class="primary" data-add="${p.id}">Add to bag →</button></div></div>`;modal.classList.add("show");modal.setAttribute("aria-hidden","false")}
function closeProduct(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}

document.addEventListener("click",e=>{
 const addBtn=e.target.closest("[data-add]");if(addBtn){add(Number(addBtn.dataset.add));if(modal.classList.contains("show"))closeProduct();return}
 const card=e.target.closest("[data-product]");if(card&&!e.target.closest("button"))openProduct(Number(card.dataset.product));
 const q=e.target.closest("[data-qty]");if(q){const item=cart.find(x=>x.id===Number(q.dataset.id));if(!item)return;item.qty+=Number(q.dataset.qty);if(item.qty<=0)cart=cart.filter(x=>x.id!==item.id);save();renderCart()}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));save();renderCart();toastMsg("Removed from your bag.")}
});
document.querySelector("#cartBtn").onclick=()=>{drawer.classList.add("open");overlay.classList.add("show")};
function closeCart(){drawer.classList.remove("open");overlay.classList.remove("show")}
document.querySelector("#closeCart").onclick=closeCart;overlay.onclick=closeCart;
document.querySelector("#modalClose").onclick=closeProduct;modal.addEventListener("click",e=>{if(e.target===modal)closeProduct()});
document.querySelector("#checkoutBtn").onclick=()=>toastMsg(cart.length?"Checkout ready — connect your payment provider here.":"Your bag is empty.");
document.querySelector("#themeBtn").onclick=()=>{const t=document.documentElement.dataset.theme==="light"?"dark":"light";document.documentElement.dataset.theme=t;localStorage.setItem("novaTheme",t)};
document.querySelector("#menuBtn").onclick=()=>document.querySelector("#nav").classList.toggle("mobile-open");
window.addEventListener("hashchange",render);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeProduct()}});
document.addEventListener("mousemove",e=>{const g=document.querySelector("#cursorGlow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px"});
document.documentElement.dataset.theme=localStorage.getItem("novaTheme")||"dark";
let timer;function toastMsg(m){toast.textContent=m;toast.classList.add("show");clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove("show"),1900)}
render();
