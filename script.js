const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const state={cart:[]};
const cartDrawer=$('.cart-drawer');
const overlay=$('.overlay');
const cartItems=$('.cart-items');
const cartCount=$('.cart-count');
const cartTotal=$('.cart-total strong');
const toast=$('.toast');
const searchPanel=$('.search-panel');
const mobileMenu=$('.mobile-menu');

function lockBody(locked){document.body.style.overflow=locked?'hidden':''}
function showOverlay(){overlay.hidden=false;requestAnimationFrame(()=>overlay.style.opacity='1')}
function hideOverlay(){overlay.style.opacity='';overlay.hidden=true}
function closePanels(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');searchPanel.classList.remove('open');searchPanel.setAttribute('aria-hidden','true');mobileMenu.classList.remove('open');mobileMenu.setAttribute('aria-hidden','true');$('.menu-trigger')?.setAttribute('aria-expanded','false');hideOverlay();lockBody(false)}
function openCart(){closePanels();cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');showOverlay();lockBody(true)}
function openSearch(){closePanels();searchPanel.classList.add('open');searchPanel.setAttribute('aria-hidden','false');showOverlay();lockBody(true);setTimeout(()=>$('#site-search')?.focus(),250)}
function openMenu(){closePanels();mobileMenu.classList.add('open');mobileMenu.setAttribute('aria-hidden','false');$('.menu-trigger')?.setAttribute('aria-expanded','true');lockBody(true)}

$('.cart-trigger')?.addEventListener('click',openCart);
$('.cart-close')?.addEventListener('click',closePanels);
$('.search-trigger')?.addEventListener('click',openSearch);
$('.search-close')?.addEventListener('click',closePanels);
$('.menu-trigger')?.addEventListener('click',openMenu);
$('.mobile-close')?.addEventListener('click',closePanels);
overlay?.addEventListener('click',closePanels);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanels()});
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',closePanels));

function money(v){return `$${v.toFixed(2)}`}
function renderCart(){const qty=state.cart.length;cartCount.textContent=qty;const total=state.cart.reduce((sum,item)=>sum+item.price,0);cartTotal.textContent=money(total);if(!qty){cartItems.innerHTML='<p class="empty-cart">Your bag is empty.</p>';return}cartItems.innerHTML=state.cart.map((item,i)=>`<div class="cart-line"><div><strong>${item.name}</strong><p>Size M · Qty 1</p><button class="remove-item" data-index="${i}">Remove</button></div><strong>${money(item.price)}</strong></div>`).join('');$$('.remove-item',cartItems).forEach(btn=>btn.addEventListener('click',()=>{state.cart.splice(Number(btn.dataset.index),1);renderCart()}))}
function flashToast(text='Added to bag'){toast.textContent=text;toast.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),1800)}
$$('.quick-add').forEach(btn=>btn.addEventListener('click',()=>{state.cart.push({name:btn.dataset.name,price:Number(btn.dataset.price)});renderCart();flashToast(`${btn.dataset.name} added`)}));

$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{const filter=btn.dataset.filter;$$('.filter').forEach(b=>b.classList.toggle('active',b===btn));$$('.product-card').forEach(card=>{card.style.display=filter==='all'||card.dataset.category===filter?'':'none'})}));

$$('.product-image-wrap').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();flashToast(`${link.dataset.product} — product page coming soon`)}));

const searchIndex=[{name:'Studio Tee',type:'tee',href:'#shop'},{name:'Core Logo Hoodie',type:'hoodie',href:'#shop'},{name:'Feeling Hoodie',type:'hoodie',href:'#shop'},{name:'Motion Tee',type:'tee',href:'#shop'},{name:'SS26 Lookbook',type:'ss26',href:'#lookbook'}];
$('#site-search')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();const box=$('.search-results');if(!q){box.textContent='Try “hoodie”, “tee”, or “SS26”.';return}const results=searchIndex.filter(x=>`${x.name} ${x.type}`.toLowerCase().includes(q));box.innerHTML=results.length?results.map(x=>`<a href="${x.href}" class="search-result-link">${x.name} ↗</a>`).join(' &nbsp; / &nbsp; '):'No results. Try another search.';$$('.search-result-link',box).forEach(a=>a.addEventListener('click',closePanels))});

$('#newsletter-form')?.addEventListener('submit',e=>{e.preventDefault();const email=$('#email');if(!email.value)return;flashToast('You’re on the list');e.currentTarget.reset()});

$('.checkout-button')?.addEventListener('click',()=>flashToast('Checkout integration ready to connect'));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('in-view')}),{threshold:.12});$$('.product-card,.section-heading,.lookbook-copy,.quote-section p,.about-body,.newsletter h2').forEach(el=>observer.observe(el));
