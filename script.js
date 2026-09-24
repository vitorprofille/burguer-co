const WHATSAPP_NUMBER = "55339880160";

const products = [
  {category:"entradas",name:"Batata Rústica (300g)",description:"Batatas artesanais temperadas com páprica e alecrim. Acompanha maionese da casa.",price:22,image:"images/batata-rustica.jpg"},
  {category:"entradas",name:"Onion Rings",description:"Anéis de cebola empanados e crocantes com molho barbecue.",price:24,image:"images/onion-rings.jpg"},
  {category:"hamburgueres",name:"Classic Burger",description:"Pão brioche, blend artesanal 160g, queijo cheddar fatiado, alface, tomate e maionese da casa.",price:28,image:"images/classic-burger.jpg",tag:"Mais Pedido"},
  {category:"hamburgueres",name:"Bacon Blast",description:"Pão brioche, blend 160g, queijo cheddar, muito bacon crocante e molho barbecue artesanal.",price:34,image:"images/bacon-blast.jpg"},
  {category:"hamburgueres",name:"Smash Triplo",description:"Pão de hambúrguer, 3 discos smash de 60g, 3 fatias de queijo prato e maionese de alho.",price:32,image:"images/smash-triplo.jpg"},
  {category:"bebidas",name:"Coca-Cola Lata (350ml)",description:"Tradicional ou Zero.",price:7,image:"images/coca-cola.jpg"},
  {category:"bebidas",name:"Suco Natural de Laranja (500ml)",description:"Feito na hora.",price:10,image:"images/suco-laranja.jpg"},
  {category:"bebidas",name:"Cerveja Heineken Long Neck (330ml)",description:"Gelada.",price:12,image:"images/heineken.jpg"},
  {category:"sobremesas",name:"Pudim de Leite Condensado",description:"Receita tradicional, super cremoso.",price:12,image:"images/pudim.jpg"},
  {category:"sobremesas",name:"Brownie com Sorvete",description:"Brownie de chocolate meio amargo com uma bola de sorvete de creme.",price:18,image:"images/brownie.jpg"}
];

const labels={entradas:"Entradas",hamburgueres:"Hambúrgueres",bebidas:"Bebidas",sobremesas:"Sobremesas"};
let cart=[];
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const $=s=>document.querySelector(s);
const menuContainer=$("#menu-container"),cartBar=$("#cart-bar"),cartModal=$("#cart-modal"),checkoutModal=$("#checkout-modal");

function renderMenu(){
  menuContainer.innerHTML="";
  Object.entries(labels).forEach(([category,label])=>{
    const section=document.createElement("section"); section.className="menu-section"; section.id=category;
    section.innerHTML=`<div class="section-heading"><h2>${label}</h2></div>`;
    const grid=document.createElement("div"); grid.className="product-grid";
    products.filter(p=>p.category===category).forEach((p,i)=>{
      const card=document.createElement("article"); card.className="product-card";
      card.innerHTML=`<div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="${category==='hamburgueres'&&i===0?'eager':'lazy'}" onerror="this.src='images/placeholder.svg'">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}</div><div class="product-content"><div class="product-top"><h3 class="product-name">${p.name}</h3><span class="product-price">${money(p.price)}</span></div><p class="product-description">${p.description}</p><button class="add-btn" data-product="${products.indexOf(p)}">Adicionar ao Pedido</button></div>`;
      grid.appendChild(card);
    });
    section.appendChild(grid);menuContainer.appendChild(section);
  });
  document.querySelectorAll(".add-btn").forEach(b=>b.addEventListener("click",()=>addToCart(+b.dataset.product)));
}
function addToCart(index){const p=products[index],item=cart.find(x=>x.name===p.name);item?item.quantity++:cart.push({...p,quantity:1});updateCart();}
function changeQty(name,delta){const item=cart.find(x=>x.name===name);if(!item)return;item.quantity+=delta;if(item.quantity<=0)cart=cart.filter(x=>x.name!==name);updateCart();renderCartModal();}
function totals(){return {qty:cart.reduce((s,x)=>s+x.quantity,0),total:cart.reduce((s,x)=>s+x.price*x.quantity,0)}}
function updateCart(){const {qty,total}=totals();$("#cart-count").textContent=`${qty} ${qty===1?"item":"itens"}`;$("#cart-total").textContent=money(total);$("#cart-modal-total").textContent=money(total);cartBar.classList.toggle("hidden",qty===0);}
function renderCartModal(){const box=$("#cart-items");if(!cart.length){box.innerHTML='<p class="cart-empty">Seu pedido está vazio.</p>';return}box.innerHTML=cart.map(item=>`<div class="cart-item"><div><div class="cart-item-name">${item.name}</div><div class="cart-item-price">${money(item.price)} cada</div></div><div class="qty-controls"><button class="qty-btn" data-name="${item.name}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span class="qty-value">${item.quantity}</span><button class="qty-btn" data-name="${item.name}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div>`).join("");box.querySelectorAll(".qty-btn").forEach(b=>b.addEventListener("click",()=>changeQty(b.dataset.name,+b.dataset.delta)));}
function openModal(el){el.classList.remove("hidden");document.body.classList.add("modal-open");}
function closeModal(el){el.classList.add("hidden");document.body.classList.remove("modal-open");}
function openCart(){if(!cart.length)return;renderCartModal();openModal(cartModal)}
function openCheckout(){if(!cart.length)return;closeModal(cartModal);$("#checkout-error").textContent="";openModal(checkoutModal);setTimeout(()=>$("#customer-name").focus(),50)}
function status(){const now=new Date(),day=now.getDay(),mins=now.getHours()*60+now.getMinutes(),openDay=day===0||day>=2,openTime=mins>=1080&&mins<1380,open=openDay&&openTime,s=$("#store-status");s.textContent=open?"Aberto agora":"Fechado";s.classList.toggle("status-open",open);s.classList.toggle("status-closed",!open)}
function message(data){const lines=cart.map(x=>`${x.quantity}x ${x.name} (${money(x.price*x.quantity)})`),{total}=totals();return ["Olá! Gostaria de fazer o seguinte pedido:","",...lines,"",`Total: ${money(total)}`,`Nome: ${data.name}`,`Endereço: ${data.address}`,`Forma de pagamento: ${data.payment}`].join("\n")}

$("#cart-open-btn").addEventListener("click",openCart);$("#checkout-btn").addEventListener("click",openCheckout);$("#cart-checkout-btn").addEventListener("click",openCheckout);$("#close-cart").addEventListener("click",()=>closeModal(cartModal));$("#close-modal").addEventListener("click",()=>closeModal(checkoutModal));
[cartModal,checkoutModal].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(!cartModal.classList.contains("hidden"))closeModal(cartModal);if(!checkoutModal.classList.contains("hidden"))closeModal(checkoutModal)}});
$("#checkout-form").addEventListener("submit",e=>{e.preventDefault();const d=new FormData(e.currentTarget),data={name:String(d.get("name")||"").trim(),address:String(d.get("address")||"").trim(),payment:String(d.get("payment")||"").trim()};if(!data.name||!data.address||!data.payment){$("#checkout-error").textContent="Preencha todos os campos para continuar.";return}window.location.href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message(data))}`});
document.querySelectorAll(".category-btn").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.category).scrollIntoView({behavior:"smooth",block:"start"})));
const observer=new IntersectionObserver(entries=>{const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;document.querySelectorAll(".category-btn").forEach(b=>b.classList.toggle("active",b.dataset.category===v.target.id));},{rootMargin:"-130px 0px -55% 0px",threshold:[0,.2,.5]});
renderMenu();document.querySelectorAll(".menu-section").forEach(s=>observer.observe(s));updateCart();status();setInterval(status,60000);
