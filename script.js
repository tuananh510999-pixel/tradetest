let balance = 100
let equity = 100
let price = 5176
let startPrice = price
let entry = null
let type = null
let lot = 0.01
let tp = null
let sl = null
let confirmType = null

function lotUp(){
lot = parseFloat(document.getElementById("lot").value)
lot += 0.01
updateLot()
}

function lotDown(){
lot = parseFloat(document.getElementById("lot").value)
if(lot > 0.01) lot -= 0.01
updateLot()
}

function updateLot(){
document.getElementById("lot").value = lot.toFixed(2)
}

/* OPEN TRADE */

function openTrade(t){

if(entry) return

lot = parseFloat(document.getElementById("lot").value)

let tpInput = document.getElementById("tp").value
let slInput = document.getElementById("sl").value

tp = tpInput ? parseFloat(tpInput) : null
sl = slInput ? parseFloat(slInput) : null

entry = price
type = t

document.getElementById("tradeBox").innerHTML = `
<div class="posRow">

<span class="${type=='buy'?'posBuy':'posSell'}">
${type=='buy'?'MUA':'BÁN'}
</span>

<span>${lot}</span>

<span>${entry.toFixed(2)}</span>

<span id="tradePnl">0.00$</span>

<button class="closeBtn" onclick="confirmClose()">✖</button>

</div>
`
}

/* CLOSE TRADE */

function closeTrade(){

if(!entry) return

let diff = price - entry
let pnl = type == "buy" ? diff : -diff

pnl = pnl * lot * 100

balance += pnl
equity = balance

entry = null
tp = null
sl = null

document.getElementById("pnl").innerText = "$0.00"
document.getElementById("tradeBox").innerHTML = ""

updateAccount()
}

/* UPDATE ACCOUNT */

function updateAccount(){
document.getElementById("balance").innerText = "$"+balance.toFixed(2)
document.getElementById("equity").innerText = "$"+equity.toFixed(2)
}

/* MARKET */

async function updateMarket(){

try{

let res = await fetch("/price")
let data = await res.json()

price = data.price

}catch(e){
console.log("Price error")
}

/* HIỂN THỊ GIÁ */

let priceEl = document.getElementById("price")
if(priceEl) priceEl.innerText = price.toFixed(3)

/* GIÁ BUY SELL */

let buyPrice = document.getElementById("buyPrice")
let sellPrice = document.getElementById("sellPrice")

if(buyPrice) buyPrice.innerText = price.toFixed(3)
if(sellPrice) sellPrice.innerText = price.toFixed(3)

/* TĂNG GIẢM */

let diffPrice = price - startPrice
let percent = (diffPrice / startPrice * 100).toFixed(2)

let changeEl = document.getElementById("change")

if(changeEl){

changeEl.innerText =
(diffPrice >= 0 ? "+" : "") +
diffPrice.toFixed(3) +
" ("+percent+"%)"

changeEl.style.color =
diffPrice >= 0 ? "#16a34a" : "#dc2626"

}

/* PNL */

if(entry != null){

if(tp != null && type=="buy" && price >= tp){ closeTrade(); return }
if(sl != null && type=="buy" && price <= sl){ closeTrade(); return }

if(tp != null && type=="sell" && price <= tp){ closeTrade(); return }
if(sl != null && type=="sell" && price >= sl){ closeTrade(); return }

let diff = price - entry
let pnl = type=="buy" ? diff : -diff

pnl = pnl * lot * 100

equity = balance + pnl

document.getElementById("pnl").innerText = "$"+pnl.toFixed(2)

let tradePnl = document.getElementById("tradePnl")

if(tradePnl){
tradePnl.innerText = (pnl>=0?"+":"")+pnl.toFixed(2)+"$"
tradePnl.style.color = pnl>=0 ? "#16a34a" : "#dc2626"
}

let closePnl = document.getElementById("closePnl")

if(closePnl){
closePnl.innerText = (pnl>=0?"+":"")+pnl.toFixed(2)+"$"
closePnl.style.color = pnl>=0 ? "#16a34a" : "#dc2626"
}

updateAccount()

/* STOP OUT */

if(equity <= 0){

alert("Stop Out - Cháy tài khoản")

balance = 0
equity = 0
entry = null
tp = null
sl = null

document.getElementById("pnl").innerText = "$0.00"

updateAccount()

}

}

}

/* MARKET LOOP */

setInterval(updateMarket,1000)

/* CONFIRM OPEN TRADE */

function confirmTrade(type){

confirmType = type

let lotValue = document.getElementById("lot").value

document.getElementById("confirmTitle").innerText =
type=="buy" ? "Xác Nhận MUA" : "Xác Nhận BÁN"

document.getElementById("confirmPrice").innerText =
lotValue+" lot @ "+price.toFixed(3)

document.getElementById("confirmBox").style.display="flex"

}

/* CLOSE POPUP */

function closeConfirm(){
document.getElementById("confirmBox").style.display="none"
}

/* EXECUTE TRADE */

function doTrade(){

if(confirmType=="close"){
closeTrade()
}else{
openTrade(confirmType)
}

closeConfirm()
}

/* CONFIRM CLOSE */

function confirmClose(){

if(entry == null) return

let tradePnl = document.getElementById("tradePnl")
let pnlText = tradePnl ? tradePnl.innerText : "0.00$"

document.getElementById("confirmTitle").innerText =
"ĐÓNG Lệnh giao dịch #000001"

document.getElementById("confirmPrice").innerHTML =
lot+' lot | <span id="closePnl">'+pnlText+'</span>'

confirmType = "close"

document.getElementById("confirmBox").style.display="flex"

}