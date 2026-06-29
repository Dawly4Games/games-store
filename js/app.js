const supabaseUrl =
"https://vkjpxjfueplvnabkpoxo.supabase.co";

const supabaseKey =
"sb_publishable_lJSGjESi-LvT3ON0FwKgcg_nsv6CE-U";

const client =
window.supabase.createClient(
supabaseUrl,
supabaseKey
);

let allGames = [];
let displayedGames = [];
let filteredGames = [];
let currentPage = 1;
const PAGE_SIZE = 40;
let currentCategory = "";

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

function getSeriesName(name){

const n = name.toLowerCase();

if(n.includes("assassin")) return "Assassins Creed";
if(n.includes("resident evil")) return "Resident Evil";
if(n.includes("battlefield")) return "Battlefield";
if(n.includes("call of duty")) return "Call Of Duty";
if(n.includes("fifa")) return "FIFA";
if(n.includes("ea sports fc")) return "EA Sports FC";
if(n.includes("pro evolution soccer")) return "Pro Evolution Soccer";
if(n.includes("forza")) return "Forza";
if(n.includes("need for speed")) return "Need For Speed";
if(n.includes("grand theft auto") || n.includes("gta")) return "Grand Theft Auto";
if(n.includes("mafia")) return "Mafia";
if(n.includes("red dead")) return "Red Dead Redemption";
if(n.includes("sniper elite")) return "Sniper Elite";
if(n.includes("spider")) return "Spider Man";
if(n.includes("batman")) return "Batman";
if(n.includes("far cry")) return "Far Cry";
if(n.includes("hitman")) return "Hitman";
if(n.includes("watch dogs")) return "Watch Dogs";
if(n.includes("wolfenstein")) return "Wolfenstein";
if(n.includes("mortal kombat")) return "Mortal Kombat";
if(n.includes("tekken")) return "Tekken";
if(n.includes("wwe")) return "WWE";
if(n.includes("age of empires")) return "Age Of Empires";
if(n.includes("stronghold")) return "Stronghold";
if(n.includes("stalker")) return "STALKER";
if(n.includes("dark souls")) return "Dark Souls";
if(n.includes("dead space")) return "Dead Space";
if(n.includes("dying light")) return "Dying Light";
if(n.includes("fallout")) return "Fallout";
if(n.includes("horizon")) return "Horizon";
if(n.includes("little nightmares")) return "Little Nightmares";
if(n.includes("metro")) return "Metro";
if(n.includes("outlast")) return "Outlast";
if(n.includes("the witcher")) return "The Witcher";
if(n.includes("alan wake")) return "Alan Wake";
if(n.includes("bioshock")) return "BioShock";
if(n.includes("crysis")) return "Crysis";
if(n.includes("darksiders")) return "Darksiders";
if(n.includes("dragon ball")) return "Dragon Ball";
if(n.includes("gears")) return "Gears Of War";
if(n.includes("god of war")) return "God Of War";
if(n.includes("hellblade")) return "Hellblade";
if(n.includes("life is strange")) return "Life Is Strange";
if(n.includes("mass effect")) return "Mass Effect";
if(n.includes("metal gear")) return "Metal Gear";
if(n.includes("one piece")) return "One Piece";
if(n.includes("silent hill")) return "Silent Hill";
if(n.includes("star wars")) return "Star Wars";
if(n.includes("the last of us")) return "The Last Of Us";
if(n.includes("the walking dead")) return "The Walking Dead";
if(n.includes("unravel")) return "Unravel";
if(n.includes("zelda")) return "Zelda";

return name;
}

async function loadGames() {

const status = document.getElementById("status");

const cache = localStorage.getItem("gamesCache");
const cacheTime = localStorage.getItem("gamesCacheTime");

const ONE_DAY = 24 * 60 * 60 * 1000;

if (cache && cacheTime && (Date.now() - Number(cacheTime) < ONE_DAY)) {

    allGames = JSON.parse(cache);

} else {

    const { data, error } = await client
        .from("games")
        .select("id,name,image_url,price,size_gb,category");

    if (error) {
        status.innerHTML = "خطأ: " + error.message;
        return;
    }

    allGames = data;

    localStorage.setItem("gamesCache", JSON.stringify(data));
    localStorage.setItem("gamesCacheTime", Date.now());

}

allGames.sort((a, b) => {

    
    const seriesA = getSeriesName(a.name);
    const seriesB = getSeriesName(b.name);

    const groupCompare = seriesA.localeCompare(seriesB, "en", {
        sensitivity: "base"
    });

filteredGames = [...allGames];

    if (groupCompare !== 0) return groupCompare;

    return a.name.localeCompare(b.name, "en", {
        sensitivity: "base"
    });

});

status.style.display = "none";

displayedGames = allGames.slice(0, PAGE_SIZE);

renderGames(displayedGames);

toggleLoadMore();
renderCart();

}

function renderGames(games){

const container =
document.getElementById("games");

container.innerHTML = "";
if(games.length === 0){

container.innerHTML = `
<div style="
grid-column:1/-1;
text-align:center;
padding:50px;
font-size:22px;
">
🎮 لا توجد ألعاب مطابقة للبحث
</div>
`;

return;
}
games.forEach(game=>{

container.innerHTML += `

<div class="card">

<div class="game-placeholder"></div>

<div class="info">

<h3>${game.name}</h3>

<p>🎯 ${game.category || "ٍ"}</p>

<p>📦 ${game.size_gb || 0} GB</p>

<p>💰 ${Math.round(game.price || 0)} جنيه</p>

<button onclick="addToCart(${game.id})">
🛒 إضافة للسلة
</button>

</div>

</div>

`;

});

}

function addToCart(id){

const game =
allGames.find(g => g.id === id);

if(!game) return;

if(cart.find(g => g.id === id)){
showToast("⚠ اللعبة موجودة بالفعل في السلة");
return;
}

cart.push(game);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

renderCart();

showToast("✓ تمت إضافة اللعبة للسلة");

}

function removeFromCart(index){

cart.splice(index,1);

localStorage.setItem(
"cart",
JSON.stringify(cart)
);

renderCart();

}

function renderCart(){

const cartItems =
document.getElementById("cartItems");

const totalSize =
document.getElementById("totalSize");

const totalPrice =
document.getElementById("totalPrice");

const cartCount =
document.getElementById("cartCount");

cartItems.innerHTML = "";

let total = 0;
let price = 0;

cart.forEach((game,index)=>{

total += Number(game.size_gb || 0);
price += Number(game.price || 0);

cartItems.innerHTML += `

<div class="cart-item">

<div>
<b>${game.name}</b><br>
📦 ${game.size_gb || 0} GB<br>
💰 ${Math.round(game.price || 0)} جنيه
</div>

<button onclick="removeFromCart(${index})">
❌
</button>

</div>

`;

});

cartCount.innerText = cart.length;

totalSize.innerText =
Number(total).toFixed(1) + " GB";

totalPrice.innerText =
Math.round(price) + " جنيه";

}

function sendWhatsapp(){

if(cart.length === 0){

alert("السلة فارغة");
return;

}

let total = 0;
let totalPriceValue = 0;

let message =
"🎮 طلب ألعاب جديد\n\n";

cart.forEach(game=>{

message +=
"• " +
game.name +
" - " +
(game.size_gb || 0) +
" GB - " +
Math.round(game.price || 0) +
" جنيه\n";

total += Number(game.size_gb || 0);
totalPriceValue += Number(game.price || 0);

});

message +=
"\n📦 إجمالي الحجم: " +
Number(total).toFixed(1) +
" GB";

message +=
"\n💰 إجمالي السعر: " +
Math.round(totalPriceValue) +
" جنيه";

const phone =
"201022082681";

window.open(
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
"_blank"
);

}

function filterGames(){

const search =
document
.getElementById("search")
.value
.toLowerCase();

const filtered =
allGames.filter(game=>{

const matchName =
game.name
.toLowerCase()
.includes(search);

const matchCategory =
!currentCategory ||
game.category === currentCategory;

return matchName && matchCategory;

});

displayedGames = filteredGames.slice(0, PAGE_SIZE);

currentPage = 1;

renderGames(displayedGames);

}

document
.getElementById("search")
.addEventListener("input", filterGames);

document
.getElementById("sendWhatsapp")
.addEventListener("click", sendWhatsapp);

document
.querySelectorAll(".cat-btn")
.forEach(btn=>{

btn.addEventListener("click",()=>{

document
.querySelectorAll(".cat-btn")
.forEach(b=>
b.classList.remove("active")
);

btn.classList.add("active");

currentCategory =
btn.dataset.category;

filterGames();

});

});

const cartHeader =
document.getElementById("cartHeader");

const cartContent =
document.getElementById("cartContent");

if(cartHeader){

cartHeader.addEventListener("click",()=>{

if(
cartContent.style.display === "none" ||
cartContent.style.display === ""
){

cartContent.style.display = "block";

}else{

cartContent.style.display = "none";

}

});

}
const filterBtn = document.getElementById("filterBtn");
const categoriesMenu = document.getElementById("categoriesMenu");

if(filterBtn){
filterBtn.addEventListener("click", () => {
categoriesMenu.classList.toggle("show");
});
}
function showToast(text){

const toast = document.createElement("div");

toast.innerHTML = text;

toast.style.position = "fixed";
toast.style.bottom = "20px";
toast.style.right = "20px";
toast.style.background = "linear-gradient(135deg,#7c3aed,#06b6d4)";
toast.style.color = "#fff";
toast.style.padding = "12px 20px";
toast.style.borderRadius = "12px";
toast.style.fontWeight = "bold";
toast.style.boxShadow = "0 5px 20px rgba(0,0,0,.3)";
toast.style.zIndex = "99999";

document.body.appendChild(toast);

setTimeout(()=>{
toast.remove();
},2000);

}
function toggleLoadMore(){

const btn = document.getElementById("loadMoreBtn");

if(!btn) return;

btn.style.display =
displayedGames.length < filteredGames.length
? "inline-block"
: "none";

}

function toggleLoadMore(){

const btn = document.getElementById("loadMoreBtn");

if(!btn) return;

btn.style.display =
displayedGames.length < filteredGames.length
? "inline-block"
: "none";

}

function loadMoreGames(){

currentPage++;

displayedGames =
filteredGames.slice(
0,
currentPage * PAGE_SIZE
);

renderGames(displayedGames);

toggleLoadMore();

}

const loadMoreBtn =
document.getElementById("loadMoreBtn");

if(loadMoreBtn){

loadMoreBtn.addEventListener(
"click",
loadMoreGames
);

}
loadGames();