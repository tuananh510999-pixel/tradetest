const express = require("express")
const path = require("path")

const app = express()

app.use(express.static(__dirname))

/* =========================
   MARKET SERVER
========================= */

let price = 5176
let trend = 0

setInterval(()=>{

// tạo xu hướng nhẹ giống market
trend += (Math.random()-0.5)*0.05

// cập nhật giá
price += trend + (Math.random()-0.5)*0.3

// giới hạn trend để không bay quá xa
if(trend > 0.5) trend = 0.5
if(trend < -0.5) trend = -0.5

},1000)

/* =========================
   API LẤY GIÁ
========================= */

app.get("/price",(req,res)=>{

res.json({
price: price
})

})

/* =========================
   LOAD WEB
========================= */

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Server running on port "+PORT)
})