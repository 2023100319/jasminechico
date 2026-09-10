/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// DEMO IN-MEMORY STORE  — ericahlicious-ms  (MOCKUP STAGE)
// Replaces the real Prisma client. No real DB needed.
// Persists to localStorage key: ericah_demo_store_v3
// ============================================================
import bcrypt from "bcryptjs";

interface User{id:number;name:string;username:string;password:string;role:string;status:string;lastActive:Date|null;createdAt:Date;}
interface MenuCategory{id:number;name:string;}
interface MenuIngredient{id:number;name:string;menuItemId:number;}
interface MenuItem{id:number;name:string;price:number;imageUrl:string|null;isArchived:boolean;categoryId:number;createdAt:Date;}
interface InventoryCategory{id:number;name:string;}
interface InventoryItem{id:number;name:string;stock:number;supplier:string|null;expiry:Date|null;status:string;categoryId:number;updatedById:number|null;updatedAt:Date;reorderLevel:number;unitCost:number|null;lastPurchaseDate:Date|null;}
interface OrderItem{id:number;orderId:number;menuItemId:number;quantity:number;}
interface Order{id:number;orderCode:string;tableNum:string|null;type:string;status:string;total:number;isPaid:boolean;createdById:number|null;createdAt:Date;}
interface Payment{id:number;orderId:number;amount:number;createdAt:Date;}
interface StockMovement{id:number;inventoryItemId:number;type:string;change:number;before:number;after:number;reason:string|null;createdById:number|null;createdAt:Date;}
interface StockPurchase{id:number;inventoryItemId:number;quantity:number;unitCost:number;totalCost:number;supplier:string|null;purchasedById:number|null;createdAt:Date;}
interface PurchaseOrder{id:number;inventoryItemId:number;quantity:number;unitCost:number;supplier:string|null;status:string;expectedDate:Date|null;receivedAt:Date|null;purchasedById:number|null;createdAt:Date;}
interface Transaction{id:number;filename:string;generatedAt:Date;generatedById:number|null;}
interface DailyExpense{id:number;amount:number;date:Date;note:string|null;}
interface Store{users:User[];menuCategories:MenuCategory[];menuIngredients:MenuIngredient[];menuItems:MenuItem[];inventoryCategories:InventoryCategory[];inventoryItems:InventoryItem[];orders:Order[];orderItems:OrderItem[];payments:Payment[];stockMovements:StockMovement[];stockPurchases:StockPurchase[];purchaseOrders:PurchaseOrder[];transactions:Transaction[];dailyExpenses:DailyExpense[];_seeded:boolean;}

const SK="ericah_demo_store_v3";
function dr(_k:string,v:unknown):unknown{if(typeof v==="string"&&/^\d{4}-\d{2}-\d{2}T/.test(v))return new Date(v);return v;}
function load():Store|null{if(typeof window==="undefined")return null;try{const r=localStorage.getItem(SK);return r?JSON.parse(r,dr) as Store:null;}catch{return null;}}
function save(s:Store):void{if(typeof window==="undefined")return;try{localStorage.setItem(SK,JSON.stringify(s));}catch{}}
const _c:Record<string,number>={};
function nid(t:string,a:{id:number}[]):number{if(!_c[t])_c[t]=Math.max(0,...a.map(x=>x.id))+1;return _c[t]++;}
const dA=(n:number)=>{const d=new Date();d.setDate(d.getDate()-n);return d;};
const dF=(n:number)=>{const d=new Date();d.setDate(d.getDate()+n);return d;};

async function seed():Promise<Store>{
  const pw=await bcrypt.hash("admin123",10);
  const users:User[]=[
    {id:1,name:"Ericah Rivera Calayag",username:"owner",password:pw,role:"OWNER",status:"ACTIVE",lastActive:dA(0),createdAt:dA(180)},
    {id:2,name:"Maria Santos Admin",username:"admin",password:pw,role:"ADMIN",status:"ACTIVE",lastActive:dA(1),createdAt:dA(150)},
    {id:3,name:"Samantha Cruz",username:"supervisor",password:pw,role:"SUPERVISOR",status:"ACTIVE",lastActive:dA(0),createdAt:dA(120)},
    {id:4,name:"Juan dela Cruz",username:"jdelacruz",password:pw,role:"SUPERVISOR",status:"ACTIVE",lastActive:dA(3),createdAt:dA(90)},
    {id:5,name:"Ana Reyes",username:"areyes",password:pw,role:"SUPERVISOR",status:"ARCHIVED",lastActive:dA(60),createdAt:dA(200)},
  ];
  const menuCategories:MenuCategory[]=[{id:1,name:"Pasta"},{id:2,name:"Rice Meals"},{id:3,name:"Pica-Pica / Snacks"},{id:4,name:"Cakes"},{id:5,name:"Coffee / Iced Drinks"},{id:6,name:"Sweet Drinks"}];
  const menuItems:MenuItem[]=[
    {id:1,name:"Chicken Alfredo Pasta",price:280,imageUrl:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400",isArchived:false,categoryId:1,createdAt:dA(180)},
    {id:2,name:"Spaghetti Bolognese",price:260,imageUrl:"https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400",isArchived:false,categoryId:1,createdAt:dA(175)},
    {id:3,name:"Carbonara Pasta",price:290,imageUrl:"https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",isArchived:false,categoryId:1,createdAt:dA(170)},
    {id:4,name:"Pesto Pasta",price:270,imageUrl:"https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400",isArchived:false,categoryId:1,createdAt:dA(160)},
    {id:5,name:"Seafood Pasta",price:320,imageUrl:"https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",isArchived:false,categoryId:1,createdAt:dA(155)},
    {id:6,name:"Filipino Breakfast Danggit",price:320,imageUrl:"https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",isArchived:false,categoryId:2,createdAt:dA(180)},
    {id:7,name:"Tapsilog",price:250,imageUrl:"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",isArchived:false,categoryId:2,createdAt:dA(175)},
    {id:8,name:"Chicken Inasal Rice Bowl",price:280,imageUrl:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",isArchived:false,categoryId:2,createdAt:dA(170)},
    {id:9,name:"Sisig Rice Bowl",price:295,imageUrl:"https://images.unsplash.com/photo-1559847844-5315695dadae?w=400",isArchived:false,categoryId:2,createdAt:dA(160)},
    {id:10,name:"Adobo Flakes Rice",price:265,imageUrl:"https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400",isArchived:false,categoryId:2,createdAt:dA(150)},
    {id:11,name:"Chicharon Bulaklak",price:185,imageUrl:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",isArchived:false,categoryId:3,createdAt:dA(165)},
    {id:12,name:"Lumpiang Shanghai (6 pcs)",price:160,imageUrl:"https://images.unsplash.com/photo-1606787364406-a3cdf06c6d0c?w=400",isArchived:false,categoryId:3,createdAt:dA(160)},
    {id:13,name:"Calamari Rings",price:210,imageUrl:"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",isArchived:false,categoryId:3,createdAt:dA(155)},
    {id:14,name:"Nachos with Cheese Dip",price:195,imageUrl:"https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",isArchived:false,categoryId:3,createdAt:dA(150)},
    {id:15,name:"Buffalo Wings (6 pcs)",price:245,imageUrl:"https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400",isArchived:false,categoryId:3,createdAt:dA(140)},
    {id:16,name:"Blueberry Cheesecake",price:200,imageUrl:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",isArchived:false,categoryId:4,createdAt:dA(170)},
    {id:17,name:"Chocolate Lava Cake",price:180,imageUrl:"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",isArchived:false,categoryId:4,createdAt:dA(165)},
    {id:18,name:"Ube Cake Slice",price:175,imageUrl:"https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",isArchived:false,categoryId:4,createdAt:dA(160)},
    {id:19,name:"Buko Pandan Cake",price:190,imageUrl:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",isArchived:false,categoryId:4,createdAt:dA(155)},
    {id:20,name:"Tiramisu",price:220,imageUrl:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",isArchived:false,categoryId:4,createdAt:dA(150)},
    {id:21,name:"Spanish Latte",price:185,imageUrl:"https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400",isArchived:false,categoryId:5,createdAt:dA(180)},
    {id:22,name:"Matcha Latte",price:190,imageUrl:"https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400",isArchived:false,categoryId:5,createdAt:dA(175)},
    {id:23,name:"Caramel Macchiato",price:195,imageUrl:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",isArchived:false,categoryId:5,createdAt:dA(170)},
    {id:24,name:"Iced Americano",price:150,imageUrl:"https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400",isArchived:false,categoryId:5,createdAt:dA(165)},
    {id:25,name:"Taro Milk Tea",price:175,imageUrl:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",isArchived:false,categoryId:5,createdAt:dA(160)},
    {id:26,name:"Dirty Matcha",price:200,imageUrl:"https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400",isArchived:false,categoryId:5,createdAt:dA(155)},
    {id:27,name:"Strawberry Milkshake",price:165,imageUrl:"https://images.unsplash.com/photo-1553530666-ba11a90a3fe5?w=400",isArchived:false,categoryId:6,createdAt:dA(170)},
    {id:28,name:"Mango Graham Shake",price:175,imageUrl:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",isArchived:false,categoryId:6,createdAt:dA(165)},
    {id:29,name:"Buko Juice",price:120,imageUrl:"https://images.unsplash.com/photo-1546173159-315724a31696?w=400",isArchived:false,categoryId:6,createdAt:dA(160)},
    {id:30,name:"Calamansi Juice",price:110,imageUrl:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",isArchived:false,categoryId:6,createdAt:dA(155)},
  ];
  const menuIngredients:MenuIngredient[]=[
    {id:1,menuItemId:1,name:"Pasta (100g)"},{id:2,menuItemId:1,name:"Chicken breast (150g)"},{id:3,menuItemId:1,name:"Garlic (10g)"},{id:4,menuItemId:1,name:"Cream (80ml)"},
    {id:5,menuItemId:2,name:"Spaghetti (100g)"},{id:6,menuItemId:2,name:"Ground beef (150g)"},{id:7,menuItemId:2,name:"Tomato sauce (100ml)"},
    {id:8,menuItemId:21,name:"Espresso (60ml)"},{id:9,menuItemId:21,name:"Condensed milk (30ml)"},{id:10,menuItemId:21,name:"Fresh milk (120ml)"},
    {id:11,menuItemId:22,name:"Matcha powder (10g)"},{id:12,menuItemId:22,name:"Oat milk (200ml)"},
    {id:13,menuItemId:16,name:"Cream cheese (100g)"},{id:14,menuItemId:16,name:"Blueberry jam (50g)"},
  ];
  const inventoryCategories:InventoryCategory[]=[{id:1,name:"Pasta"},{id:2,name:"Dairy"},{id:3,name:"Syrups"},{id:4,name:"Powders"},{id:5,name:"Baking"},{id:6,name:"Sweeteners"},{id:7,name:"Meat"}];
  const inventoryItems:InventoryItem[]=[
    {id:1,name:"Fresh Milk",        stock:8000, supplier:"Dairy Fresh Inc.",expiry:dF(5),  status:"GOOD",        categoryId:2,updatedById:3,updatedAt:dA(1), reorderLevel:2000, unitCost:0.08, lastPurchaseDate:dA(3)},
    {id:2,name:"Butter",            stock:350,  supplier:"Anchor Foods",    expiry:dF(30), status:"LOW",         categoryId:2,updatedById:3,updatedAt:dA(2), reorderLevel:400,  unitCost:0.65, lastPurchaseDate:dA(10)},
    {id:3,name:"Spaghetti Noodles", stock:9500, supplier:"Del Monte",       expiry:dF(180),status:"GOOD",        categoryId:1,updatedById:3,updatedAt:dA(1), reorderLevel:2000, unitCost:0.04, lastPurchaseDate:dA(7)},
    {id:4,name:"Matcha Powder",     stock:180,  supplier:"SB Ingredients",  expiry:dF(90), status:"LOW",         categoryId:4,updatedById:3,updatedAt:dA(3), reorderLevel:200,  unitCost:2.50, lastPurchaseDate:dA(14)},
    {id:5,name:"Espresso Beans",    stock:0,    supplier:"Benguet Coffee",  expiry:dF(60), status:"OUT_OF_STOCK",categoryId:4,updatedById:3,updatedAt:dA(0), reorderLevel:500,  unitCost:1.20, lastPurchaseDate:dA(20)},
    {id:6,name:"All-Purpose Flour", stock:25000,supplier:"CDO Mills",       expiry:dF(120),status:"GOOD",        categoryId:5,updatedById:3,updatedAt:dA(4), reorderLevel:5000, unitCost:0.025,lastPurchaseDate:dA(5)},
    {id:7,name:"Condensed Milk",    stock:2400, supplier:"Alaska Dairy",    expiry:dF(365),status:"GOOD",        categoryId:6,updatedById:3,updatedAt:dA(2), reorderLevel:500,  unitCost:0.10, lastPurchaseDate:dA(8)},
    {id:8,name:"Chocolate Syrup",   stock:1200, supplier:"Hershey PH",      expiry:dF(180),status:"GOOD",        categoryId:3,updatedById:3,updatedAt:dA(5), reorderLevel:300,  unitCost:0.30, lastPurchaseDate:dA(12)},
    {id:9,name:"Blueberry Jam",     stock:600,  supplier:"Del Monte PH",    expiry:dF(60), status:"LOW",         categoryId:5,updatedById:3,updatedAt:dA(1), reorderLevel:800,  unitCost:0.55, lastPurchaseDate:dA(6)},
    {id:10,name:"Chicken Breast",   stock:15000,supplier:"Magnolia Chicken",expiry:dF(3),  status:"GOOD",        categoryId:7,updatedById:3,updatedAt:dA(0), reorderLevel:3000, unitCost:0.18, lastPurchaseDate:dA(1)},
    {id:11,name:"Ground Beef",      stock:8000, supplier:"Purefoods",       expiry:dF(2),  status:"LOW",         categoryId:7,updatedById:3,updatedAt:dA(1), reorderLevel:8500, unitCost:0.22, lastPurchaseDate:dA(2)},
    {id:12,name:"Caramel Syrup",    stock:2000, supplier:"Da Vinci Syrups", expiry:dF(365),status:"GOOD",        categoryId:3,updatedById:3,updatedAt:dA(7), reorderLevel:500,  unitCost:0.25, lastPurchaseDate:dA(15)},
    {id:13,name:"Cream Cheese",     stock:1500, supplier:"Arla Foods PH",   expiry:dF(21), status:"GOOD",        categoryId:2,updatedById:3,updatedAt:dA(3), reorderLevel:400,  unitCost:0.80, lastPurchaseDate:dA(5)},
    {id:14,name:"Sugar",            stock:50000,supplier:"Victorias Sugar",  expiry:null,   status:"GOOD",        categoryId:6,updatedById:3,updatedAt:dA(10),reorderLevel:10000,unitCost:0.015,lastPurchaseDate:dA(20)},
    {id:15,name:"Heavy Cream",      stock:4000, supplier:"Anchor Dairy",    expiry:dF(8),  status:"GOOD",        categoryId:2,updatedById:3,updatedAt:dA(2), reorderLevel:1000, unitCost:0.35, lastPurchaseDate:dA(4)},
  ];
  const raw=[
    {id:1,code:"ORD-001",tbl:"Table 3",tp:"DINE_IN", st:"COMPLETED",pd:true, by:3,ago:14,oi:[{m:1,q:2},{m:21,q:2}]},
    {id:2,code:"ORD-002",tbl:null,    tp:"TAKE_OUT",st:"COMPLETED",pd:true, by:3,ago:14,oi:[{m:16,q:1},{m:27,q:1}]},
    {id:3,code:"ORD-003",tbl:"Table 1",tp:"DINE_IN", st:"COMPLETED",pd:true, by:3,ago:13,oi:[{m:6,q:1},{m:21,q:1},{m:17,q:1}]},
    {id:4,code:"ORD-004",tbl:"Table 5",tp:"DINE_IN", st:"COMPLETED",pd:true, by:4,ago:12,oi:[{m:2,q:1},{m:22,q:2}]},
    {id:5,code:"ORD-005",tbl:null,    tp:"TAKE_OUT",st:"COMPLETED",pd:true, by:3,ago:11,oi:[{m:15,q:1},{m:23,q:1}]},
    {id:6,code:"ORD-006",tbl:"Table 2",tp:"DINE_IN", st:"COMPLETED",pd:true, by:4,ago:10,oi:[{m:3,q:2},{m:28,q:2}]},
    {id:7,code:"ORD-007",tbl:"Table 4",tp:"DINE_IN", st:"COMPLETED",pd:true, by:3,ago:9, oi:[{m:8,q:2},{m:22,q:1}]},
    {id:8,code:"ORD-008",tbl:null,    tp:"TAKE_OUT",st:"COMPLETED",pd:true, by:3,ago:8, oi:[{m:1,q:1},{m:16,q:1}]},
    {id:9,code:"ORD-009",tbl:"Table 6",tp:"DINE_IN", st:"COMPLETED",pd:true, by:4,ago:7, oi:[{m:9,q:2},{m:21,q:2},{m:30,q:2}]},
    {id:10,code:"ORD-010",tbl:"Table 3",tp:"DINE_IN",st:"COMPLETED",pd:true, by:3,ago:5, oi:[{m:11,q:2},{m:24,q:2}]},
    {id:11,code:"ORD-011",tbl:null,    tp:"TAKE_OUT",st:"COMPLETED",pd:true,by:3,ago:3, oi:[{m:4,q:1},{m:18,q:1}]},
    {id:12,code:"ORD-012",tbl:"Table 7",tp:"DINE_IN",st:"COMPLETED",pd:true, by:4,ago:2, oi:[{m:5,q:2},{m:25,q:2}]},
    {id:13,code:"ORD-013",tbl:"Table 1",tp:"DINE_IN",st:"PREPARING",pd:false,by:3,ago:0, oi:[{m:1,q:1},{m:22,q:1}]},
    {id:14,code:"ORD-014",tbl:"Table 2",tp:"DINE_IN",st:"PENDING",  pd:false,by:3,ago:0, oi:[{m:7,q:2},{m:29,q:2}]},
    {id:15,code:"ORD-015",tbl:null,    tp:"TAKE_OUT",st:"READY",   pd:false,by:4,ago:0, oi:[{m:17,q:1},{m:23,q:1}]},
  ];
  const orders:Order[]=[];const orderItems:OrderItem[]=[];let oid=1;
  for(const od of raw){let tot=0;for(const oi of od.oi){const mi=menuItems.find(m=>m.id===oi.m)!;tot+=mi.price*oi.q;orderItems.push({id:oid++,orderId:od.id,menuItemId:oi.m,quantity:oi.q});}const ca=new Date();ca.setDate(ca.getDate()-od.ago);ca.setHours(10+Math.floor(Math.random()*8),Math.floor(Math.random()*59));orders.push({id:od.id,orderCode:od.code,tableNum:od.tbl,type:od.tp,status:od.st,total:tot,isPaid:od.pd,createdById:od.by,createdAt:ca});}
  const payments:Payment[]=orders.filter(o=>o.isPaid&&o.status==="COMPLETED").map((o,i)=>({id:i+1,orderId:o.id,amount:o.total,createdAt:o.createdAt}));
  const stockMovements:StockMovement[]=[
    {id:1,inventoryItemId:1,type:"STOCK_IN",change:5000,before:3000,after:8000,reason:"Monthly restock",createdById:3,createdAt:dA(10)},
    {id:2,inventoryItemId:5,type:"SALES_DEDUCT",change:-50,before:50,after:0,reason:"ORD-001 completed",createdById:3,createdAt:dA(14)},
    {id:3,inventoryItemId:10,type:"STOCK_IN",change:10000,before:5000,after:15000,reason:"Weekly chicken restock",createdById:3,createdAt:dA(5)},
    {id:4,inventoryItemId:3,type:"SALES_DEDUCT",change:-500,before:10000,after:9500,reason:"Orders completed today",createdById:3,createdAt:dA(1)},
    {id:5,inventoryItemId:2,type:"WASTAGE",change:-150,before:500,after:350,reason:"Butter expired - disposed",createdById:3,createdAt:dA(2)},
    {id:6,inventoryItemId:4,type:"SALES_DEDUCT",change:-20,before:200,after:180,reason:"Matcha drinks sales",createdById:3,createdAt:dA(3)},
    {id:7,inventoryItemId:9,type:"SALES_DEDUCT",change:-200,before:800,after:600,reason:"Cheesecake orders",createdById:4,createdAt:dA(4)},
    {id:8,inventoryItemId:11,type:"SALES_DEDUCT",change:-2000,before:10000,after:8000,reason:"Bolognese and sisig sales",createdById:3,createdAt:dA(6)},
    {id:9,inventoryItemId:1,type:"SALES_DEDUCT",change:-500,before:8500,after:8000,reason:"Lattes sold this week",createdById:3,createdAt:dA(1)},
    {id:10,inventoryItemId:6,type:"STOCK_IN",change:10000,before:15000,after:25000,reason:"Flour restock",createdById:3,createdAt:dA(8)},
    {id:11,inventoryItemId:7,type:"SALES_DEDUCT",change:-100,before:2500,after:2400,reason:"Spanish lattes sold",createdById:4,createdAt:dA(2)},
    {id:12,inventoryItemId:13,type:"STOCK_IN",change:1000,before:500,after:1500,reason:"Cream cheese restock",createdById:3,createdAt:dA(7)},
    {id:13,inventoryItemId:15,type:"SALES_DEDUCT",change:-1000,before:5000,after:4000,reason:"Carbonara and cake sales",createdById:3,createdAt:dA(3)},
    {id:14,inventoryItemId:14,type:"STOCK_IN",change:20000,before:30000,after:50000,reason:"Sugar bulk purchase",createdById:3,createdAt:dA(20)},
    {id:15,inventoryItemId:8,type:"ADJUSTMENT",change:-300,before:1500,after:1200,reason:"Physical count discrepancy",createdById:3,createdAt:dA(5)},
  ];
  const stockPurchases:StockPurchase[]=[
    {id:1,inventoryItemId:1,quantity:5000,unitCost:0.08,totalCost:400,supplier:"Dairy Fresh Inc.",purchasedById:3,createdAt:dA(10)},
    {id:2,inventoryItemId:10,quantity:10000,unitCost:0.18,totalCost:1800,supplier:"Magnolia Chicken",purchasedById:3,createdAt:dA(5)},
    {id:3,inventoryItemId:6,quantity:10000,unitCost:0.025,totalCost:250,supplier:"CDO Mills",purchasedById:3,createdAt:dA(8)},
    {id:4,inventoryItemId:3,quantity:5000,unitCost:0.04,totalCost:200,supplier:"Del Monte",purchasedById:3,createdAt:dA(7)},
    {id:5,inventoryItemId:14,quantity:20000,unitCost:0.015,totalCost:300,supplier:"Victorias Sugar",purchasedById:3,createdAt:dA(20)},
    {id:6,inventoryItemId:13,quantity:1000,unitCost:0.80,totalCost:800,supplier:"Arla Foods PH",purchasedById:3,createdAt:dA(7)},
    {id:7,inventoryItemId:7,quantity:2000,unitCost:0.10,totalCost:200,supplier:"Alaska Dairy",purchasedById:3,createdAt:dA(8)},
    {id:8,inventoryItemId:12,quantity:2000,unitCost:0.25,totalCost:500,supplier:"Da Vinci Syrups",purchasedById:3,createdAt:dA(15)},
  ];
  const purchaseOrders:PurchaseOrder[]=[
    {id:1,inventoryItemId:5,quantity:1000,unitCost:1.20,supplier:"Benguet Coffee",status:"PENDING",expectedDate:dF(2),receivedAt:null,purchasedById:3,createdAt:dA(1)},
    {id:2,inventoryItemId:4,quantity:500,unitCost:2.50,supplier:"SB Ingredients",status:"PENDING",expectedDate:dF(3),receivedAt:null,purchasedById:3,createdAt:dA(2)},
    {id:3,inventoryItemId:2,quantity:1000,unitCost:0.65,supplier:"Anchor Foods",status:"RECEIVED",expectedDate:dA(5),receivedAt:dA(4),purchasedById:3,createdAt:dA(7)},
    {id:4,inventoryItemId:11,quantity:5000,unitCost:0.22,supplier:"Purefoods",status:"PENDING",expectedDate:dF(1),receivedAt:null,purchasedById:3,createdAt:dA(0)},
  ];
  const transactions:Transaction[]=[
    {id:1,filename:"Weekly_Report_Sep01-07_2026.pdf",generatedAt:dA(7),generatedById:1},
    {id:2,filename:"Daily_Report_Sep08_2026.pdf",generatedAt:dA(2),generatedById:2},
    {id:3,filename:"Monthly_Report_Aug2026.pdf",generatedAt:dA(14),generatedById:1},
  ];
  const dailyExpenses:DailyExpense[]=Array.from({length:14},(_,i)=>({id:i+1,amount:1500+Math.floor(Math.random()*2000),date:dA(13-i),note:["Ingredient restocking","Utilities","Staff meals","Packaging materials","Cleaning supplies"][i%5]}));
  return{users,menuCategories,menuIngredients,menuItems,inventoryCategories,inventoryItems,orders,orderItems,payments,stockMovements,stockPurchases,purchaseOrders,transactions,dailyExpenses,_seeded:true};
}

let _store:Store|null=null;
async function getStore():Promise<Store>{if(_store)return _store;const s=load();if(s?._seeded){_store=s;return _store;}_store=await seed();save(_store);return _store;}
function mutate(s:Store):void{_store=s;save(s);}

type WC=Record<string,any>;
function aw<T extends WC>(items:T[],w?:WC):T[]{if(!w)return items;return items.filter(x=>Object.entries(w).every(([k,v])=>{if(v===undefined||v===null)return true;if(v&&typeof v==="object"&&!(v instanceof Date)&&!Array.isArray(v)){const iv=x[k];if("gte"in v&&iv<v.gte)return false;if("lte"in v&&iv>v.lte)return false;if("contains"in v)return String(iv).toLowerCase().includes(String(v.contains).toLowerCase());if("in"in v)return(v.in as any[]).includes(iv);return true;}return x[k]===v;}));}
function ao<T extends WC>(items:T[],ob?:Record<string,string>):T[]{if(!ob)return items;const[k,d]=Object.entries(ob)[0];return[...items].sort((a,b)=>{const av=a[k],bv=b[k];if(av==null)return 1;if(bv==null)return-1;const c=av<bv?-1:av>bv?1:0;return d==="desc"?-c:c;});}
function sel<T extends WC>(x:T,s?:WC):WC{if(!s)return x as WC;const r:WC={};for(const k of Object.keys(s)){if(s[k]===true||typeof s[k]==="object")r[k]=(x as WC)[k];}return r;}
function eInv(x:InventoryItem,s:Store){return{...x,category:s.inventoryCategories.find(c=>c.id===x.categoryId)??{id:0,name:"Unknown"},updatedBy:x.updatedById?{name:s.users.find(u=>u.id===x.updatedById)?.name??""}:null};}
function eMI(x:MenuItem,s:Store,ing=true){return{...x,category:s.menuCategories.find(c=>c.id===x.categoryId)??{id:0,name:"Unknown"},ingredients:ing?s.menuIngredients.filter(i=>i.menuItemId===x.id):[]};}
function eOrd(o:Order,s:Store){return{...o,items:s.orderItems.filter(i=>i.orderId===o.id).map(i=>{const mi=s.menuItems.find(m=>m.id===i.menuItemId);return{...i,menuItem:mi?{id:mi.id,name:mi.name,price:mi.price}:null};}),createdBy:o.createdById?{name:s.users.find(u=>u.id===o.createdById)?.name??""}:null,payment:s.payments.find(p=>p.orderId===o.id)??null};}
function eMv(m:StockMovement,s:Store){return{...m,inventoryItem:{name:s.inventoryItems.find(i=>i.id===m.inventoryItemId)?.name??""},createdBy:m.createdById?{name:s.users.find(u=>u.id===m.createdById)?.name??""}:null};}
function ePO(p:PurchaseOrder,s:Store){const iv=s.inventoryItems.find(i=>i.id===p.inventoryItemId);return{...p,inventoryItem:iv?{id:iv.id,name:iv.name,stock:iv.stock}:null,purchasedBy:p.purchasedById?{name:s.users.find(u=>u.id===p.purchasedById)?.name??""}:null};}
function rSt(x:InventoryItem):string{if(x.stock<=0)return"OUT_OF_STOCK";if(x.stock<=x.reorderLevel)return"LOW";return"GOOD";}
function grp<T extends WC>(items:T[],by:string[],_sum?:WC):WC[]{const g=new Map<string,{items:T[];key:WC}>();for(const x of items){const kp=by.map(b=>String(x[b]));const ks=kp.join("||");const ko=Object.fromEntries(by.map((b,i)=>[b,kp[i]]));if(!g.has(ks))g.set(ks,{items:[],key:ko});g.get(ks)!.items.push(x);}return Array.from(g.values()).map(({items:gi,key})=>{const r:WC={...key};r._count=gi.length;if(_sum&&typeof _sum==="object"){const ss:WC={};for(const k of Object.keys(_sum))ss[k]=gi.reduce((acc,x)=>acc+Number(x[k]||0),0);r._sum=ss;}return r;});}
function wm<T extends WC>(arr:T[],w:WC):number{return arr.findIndex(x=>Object.entries(w).every(([k,v])=>(x as WC)[k]===v));}

const mockPrisma={
  user:{
    async findUnique(a:{where:WC;select?:WC}){const s=await getStore();const u=s.users.find(x=>Object.entries(a.where).every(([k,v])=>(x as WC)[k]===v))??null;return u?a.select?sel(u as WC,a.select):u:null;},
    async findMany(a:{where?:WC;select?:WC;orderBy?:Record<string,string>}={}){const s=await getStore();const r=ao(aw(s.users as WC[],a.where),a.orderBy);return a.select?r.map(u=>sel(u,a.select)):r;},
    async findFirst(a:{where?:WC}={}){const s=await getStore();return aw(s.users as WC[],a.where)[0]??null;},
    async create(a:{data:Partial<User>;select?:WC}){const s=await getStore();const u:User={id:nid("u",s.users),name:a.data.name??"",username:a.data.username??"",password:a.data.password??"",role:a.data.role??"SUPERVISOR",status:a.data.status??"ACTIVE",lastActive:null,createdAt:new Date()};s.users.push(u);mutate(s);return a.select?sel(u as WC,a.select):u;},
    async update(a:{where:WC;data:Partial<User>;select?:WC}){const s=await getStore();const i=wm(s.users as WC[],a.where);if(i<0)throw new Error("User not found");s.users[i]={...s.users[i],...a.data};mutate(s);return a.select?sel(s.users[i] as WC,a.select):s.users[i];},
    async count(a:{where?:WC}={}){const s=await getStore();return aw(s.users as WC[],a.where).length;},
    async aggregate(a:{_sum?:WC;where?:WC}={}){const s=await getStore();const r=aw(s.users as WC[],a.where);const _sum:WC={};if(a._sum)for(const k of Object.keys(a._sum))_sum[k]=r.reduce((x,u)=>x+Number((u as WC)[k]||0),0);return{_sum,_count:r.length};},
  },
  menuCategory:{
    async findMany(a:{orderBy?:Record<string,string>}={}){const s=await getStore();return ao(s.menuCategories as WC[],a.orderBy) as MenuCategory[];},
    async findUnique(a:{where:WC}){const s=await getStore();const i=wm(s.menuCategories as WC[],a.where);return i>=0?s.menuCategories[i]:null;},
    async create(a:{data:{name:string}}){const s=await getStore();const c:MenuCategory={id:nid("mc",s.menuCategories),name:a.data.name};s.menuCategories.push(c);mutate(s);return c;},
    async upsert(a:{where:WC;create:{name:string};update:WC}){const s=await getStore();const i=wm(s.menuCategories as WC[],a.where);if(i>=0){s.menuCategories[i]={...s.menuCategories[i],...a.update};mutate(s);return s.menuCategories[i];}const c:MenuCategory={id:nid("mc",s.menuCategories),name:a.create.name};s.menuCategories.push(c);mutate(s);return c;},
  },
  inventoryCategory:{
    async findMany(a:{orderBy?:Record<string,string>}={}){const s=await getStore();return ao(s.inventoryCategories as WC[],a.orderBy) as InventoryCategory[];},
    async findUnique(a:{where:WC}){const s=await getStore();const i=wm(s.inventoryCategories as WC[],a.where);return i>=0?s.inventoryCategories[i]:null;},
    async create(a:{data:{name:string}}){const s=await getStore();const c:InventoryCategory={id:nid("ic",s.inventoryCategories),name:a.data.name};s.inventoryCategories.push(c);mutate(s);return c;},
    async upsert(a:{where:WC;create:{name:string};update:WC}){const s=await getStore();const i=wm(s.inventoryCategories as WC[],a.where);if(i>=0){s.inventoryCategories[i]={...s.inventoryCategories[i],...a.update};mutate(s);return s.inventoryCategories[i];}const c:InventoryCategory={id:nid("ic",s.inventoryCategories),name:a.create.name};s.inventoryCategories.push(c);mutate(s);return c;},
  },
  menuIngredient:{
    async deleteMany(a:{where:WC}){const s=await getStore();const p=s.menuIngredients.length;s.menuIngredients=s.menuIngredients.filter(x=>!Object.entries(a.where).every(([k,v])=>(x as WC)[k]===v));mutate(s);return{count:p-s.menuIngredients.length};},
  },
  menuItem:{
    async findUnique(a:{where:WC;include?:WC}){const s=await getStore();const i=wm(s.menuItems as WC[],a.where);const m=i>=0?s.menuItems[i]:null;return m?a.include?eMI(m,s):m:null;},
    async findMany(a:{where?:WC;include?:WC;orderBy?:Record<string,string>}={}){const s=await getStore();const r=ao(aw(s.menuItems as WC[],a.where) as WC[],a.orderBy) as MenuItem[];return a.include?r.map(m=>eMI(m,s)):r;},
    async create(a:{data:Partial<MenuItem>&{ingredients?:{create:{name:string}[]}};include?:WC}){const s=await getStore();const m:MenuItem={id:nid("mi",s.menuItems),name:a.data.name??"",price:Number(a.data.price??0),imageUrl:a.data.imageUrl??null,isArchived:false,categoryId:Number(a.data.categoryId??1),createdAt:new Date()};s.menuItems.push(m);if(a.data.ingredients?.create)for(const g of a.data.ingredients.create)s.menuIngredients.push({id:nid("ing",s.menuIngredients),menuItemId:m.id,name:g.name});mutate(s);return a.include?eMI(m,s):m;},
    async update(a:{where:WC;data:Partial<MenuItem>&{ingredients?:{create:{name:string}[]}};include?:WC}){const s=await getStore();const i=wm(s.menuItems as WC[],a.where);if(i<0)throw new Error("MenuItem not found");s.menuItems[i]={...s.menuItems[i],...a.data};if(a.data.ingredients?.create)for(const g of a.data.ingredients.create)s.menuIngredients.push({id:nid("ing",s.menuIngredients),menuItemId:s.menuItems[i].id,name:g.name});mutate(s);return a.include?eMI(s.menuItems[i],s):s.menuItems[i];},
    async delete(a:{where:WC}){const s=await getStore();const i=wm(s.menuItems as WC[],a.where);if(i<0)throw new Error("MenuItem not found");const[d]=s.menuItems.splice(i,1);mutate(s);return d;},
  },
  inventoryItem:{
    async findUnique(a:{where:WC;include?:WC;select?:WC}){const s=await getStore();const i=wm(s.inventoryItems as WC[],a.where);const x=i>=0?s.inventoryItems[i]:null;if(!x)return null;const e=eInv(x,s);return a.select?sel(e as WC,a.select):a.include?e:x;},
    async findFirst(a:{where?:WC}={}){const s=await getStore();return aw(s.inventoryItems as WC[],a.where)[0] as InventoryItem??null;},
    async findMany(a:{where?:WC;include?:WC;orderBy?:Record<string,string>;select?:WC}={}){const s=await getStore();const r=ao(aw(s.inventoryItems as WC[],a.where) as WC[],a.orderBy) as InventoryItem[];if(a.include)return r.map(i=>eInv(i,s));if(a.select)return r.map(i=>sel(eInv(i,s) as WC,a.select!));return r;},
    async create(a:{data:Partial<InventoryItem>;include?:WC}){const s=await getStore();const x:InventoryItem={id:nid("inv",s.inventoryItems),name:a.data.name??"",stock:Number(a.data.stock??0),supplier:a.data.supplier??null,expiry:a.data.expiry??null,status:a.data.status??"GOOD",categoryId:Number(a.data.categoryId??1),updatedById:a.data.updatedById??null,updatedAt:new Date(),reorderLevel:a.data.reorderLevel??10,unitCost:a.data.unitCost??null,lastPurchaseDate:null};s.inventoryItems.push(x);mutate(s);return a.include?eInv(x,s):x;},
    async update(a:{where:WC;data:Partial<InventoryItem>&{status?:string};include?:WC}){const s=await getStore();const i=wm(s.inventoryItems as WC[],a.where);if(i<0)throw new Error("InventoryItem not found");s.inventoryItems[i]={...s.inventoryItems[i],...a.data,updatedAt:new Date()};if(!a.data.status)s.inventoryItems[i].status=rSt(s.inventoryItems[i]);mutate(s);return a.include?eInv(s.inventoryItems[i],s):s.inventoryItems[i];},
    async groupBy(a:{by:string[];where?:WC;_count?:any;_sum?:WC}){const s=await getStore();return grp(aw(s.inventoryItems as WC[],a.where),a.by,a._sum as WC|undefined);},
  },
  order:{
    async findUnique(a:{where:WC;include?:WC}){const s=await getStore();const i=wm(s.orders as WC[],a.where);const o=i>=0?s.orders[i]:null;return o?a.include?eOrd(o,s):o:null;},
    async findMany(a:{where?:WC;include?:WC;orderBy?:Record<string,string>}={}){const s=await getStore();const r=ao(aw(s.orders as WC[],a.where) as WC[],a.orderBy) as Order[];return a.include?r.map(o=>eOrd(o,s)):r;},
    async create(a:{data:Partial<Order>&{items?:{create:{menuItemId:number;quantity:number}[]}};include?:WC}){const s=await getStore();const o:Order={id:nid("ord",s.orders),orderCode:a.data.orderCode??("ORD-"+String(s.orders.length+1).padStart(3,"0")),tableNum:a.data.tableNum??null,type:a.data.type??"DINE_IN",status:a.data.status??"PENDING",total:Number(a.data.total??0),isPaid:a.data.isPaid??false,createdById:a.data.createdById??null,createdAt:new Date()};s.orders.push(o);if(a.data.items?.create)for(const oi of a.data.items.create)s.orderItems.push({id:nid("oi",s.orderItems),orderId:o.id,menuItemId:oi.menuItemId,quantity:oi.quantity});mutate(s);return a.include?eOrd(o,s):o;},
    async update(a:{where:WC;data:Partial<Order>;include?:WC}){const s=await getStore();const i=wm(s.orders as WC[],a.where);if(i<0)throw new Error("Order not found");s.orders[i]={...s.orders[i],...a.data};mutate(s);return a.include?eOrd(s.orders[i],s):s.orders[i];},
    async count(a:{where?:WC}={}){const s=await getStore();return aw(s.orders as WC[],a.where).length;},
    async aggregate(a:{_sum?:WC;where?:WC}={}){const s=await getStore();const r=aw(s.orders as WC[],a.where) as Order[];const _sum:WC={};if(a._sum)for(const k of Object.keys(a._sum))_sum[k]=r.reduce((acc,o)=>acc+Number((o as WC)[k]||0),0);return{_sum};},
  },
  orderItem:{async findMany(a:{where?:WC}={}){const s=await getStore();return aw(s.orderItems as WC[],a.where) as OrderItem[];}},
  payment:{
    async findUnique(a:{where:WC}){const s=await getStore();const i=wm(s.payments as WC[],a.where);return i>=0?s.payments[i]:null;},
    async create(a:{data:Partial<Payment>}){const s=await getStore();const p:Payment={id:nid("pay",s.payments),orderId:a.data.orderId??0,amount:Number(a.data.amount??0),createdAt:new Date()};s.payments.push(p);mutate(s);return p;},
  },
  stockMovement:{
    async findMany(a:{where?:WC;include?:WC;orderBy?:Record<string,string>;skip?:number;take?:number}={}){const s=await getStore();let r=ao(aw(s.stockMovements as WC[],a.where) as WC[],a.orderBy) as StockMovement[];if(a.skip)r=r.slice(a.skip);if(a.take)r=r.slice(0,a.take);return a.include?r.map(m=>eMv(m,s)):r;},
    async create(a:{data:Partial<StockMovement>;include?:WC}){const s=await getStore();const m:StockMovement={id:nid("sm",s.stockMovements),inventoryItemId:a.data.inventoryItemId??0,type:a.data.type??"ADJUSTMENT",change:Number(a.data.change??0),before:Number(a.data.before??0),after:Number(a.data.after??0),reason:a.data.reason??null,createdById:a.data.createdById??null,createdAt:new Date()};s.stockMovements.push(m);mutate(s);return a.include?eMv(m,s):m;},
    async count(a:{where?:WC}={}){const s=await getStore();return aw(s.stockMovements as WC[],a.where).length;},
    async groupBy(a:{by:string[];where?:WC;_count?:any;_sum?:WC}){const s=await getStore();return grp(aw(s.stockMovements as WC[],a.where),a.by,a._sum as WC|undefined);},
  },
  stockPurchase:{
    async findMany(a:{where?:WC;include?:WC;orderBy?:Record<string,string>}={}){const s=await getStore();const r=ao(aw(s.stockPurchases as WC[],a.where) as WC[],a.orderBy) as StockPurchase[];if(!a.include)return r;return r.map(p=>{const iv=s.inventoryItems.find(i=>i.id===p.inventoryItemId);return{...p,inventoryItem:iv?{id:iv.id,name:iv.name,category:s.inventoryCategories.find(c=>c.id===iv.categoryId)}:null,purchasedBy:p.purchasedById?{name:s.users.find(u=>u.id===p.purchasedById)?.name??""}:null};});},
    async create(a:{data:Partial<StockPurchase>}){const s=await getStore();const p:StockPurchase={id:nid("sp",s.stockPurchases),inventoryItemId:a.data.inventoryItemId??0,quantity:Number(a.data.quantity??0),unitCost:Number(a.data.unitCost??0),totalCost:Number(a.data.totalCost??0),supplier:a.data.supplier??null,purchasedById:a.data.purchasedById??null,createdAt:new Date()};s.stockPurchases.push(p);mutate(s);return p;},
  },
  purchaseOrder:{
    async findUnique(a:{where:WC;include?:WC}){const s=await getStore();const i=wm(s.purchaseOrders as WC[],a.where);const x=i>=0?s.purchaseOrders[i]:null;return x?a.include?ePO(x,s):x:null;},
    async findMany(a:{where?:WC;include?:WC;orderBy?:Record<string,string>;skip?:number;take?:number}={}){const s=await getStore();let r=ao(aw(s.purchaseOrders as WC[],a.where) as WC[],a.orderBy) as PurchaseOrder[];if(a.skip)r=r.slice(a.skip);if(a.take)r=r.slice(0,a.take);return a.include?r.map(p=>ePO(p,s)):r;},
    async create(a:{data:Partial<PurchaseOrder>;include?:WC}){const s=await getStore();const p:PurchaseOrder={id:nid("po",s.purchaseOrders),inventoryItemId:Number(a.data.inventoryItemId??0),quantity:Number(a.data.quantity??0),unitCost:Number(a.data.unitCost??0),supplier:a.data.supplier??null,status:"PENDING",expectedDate:a.data.expectedDate??null,receivedAt:null,purchasedById:a.data.purchasedById??null,createdAt:new Date()};s.purchaseOrders.push(p);mutate(s);return a.include?ePO(p,s):p;},
    async update(a:{where:WC;data:Partial<PurchaseOrder>;include?:WC}){const s=await getStore();const i=wm(s.purchaseOrders as WC[],a.where);if(i<0)throw new Error("PurchaseOrder not found");s.purchaseOrders[i]={...s.purchaseOrders[i],...a.data};mutate(s);return a.include?ePO(s.purchaseOrders[i],s):s.purchaseOrders[i];},
    async count(a:{where?:WC}={}){const s=await getStore();return aw(s.purchaseOrders as WC[],a.where).length;},
  },
  transaction:{
    async findMany(a:{include?:WC;orderBy?:Record<string,string>}={}){const s=await getStore();const r=ao(s.transactions as WC[],a.orderBy) as Transaction[];if(!a.include)return r;return r.map(t=>{const gb=t.generatedById?s.users.find(u=>u.id===t.generatedById):null;return{...t,generatedBy:gb?{name:gb.name}:null};});},
    async create(a:{data:Partial<Transaction>;include?:WC}){const s=await getStore();const t:Transaction={id:nid("tx",s.transactions),filename:a.data.filename??"",generatedAt:new Date(),generatedById:a.data.generatedById??null};s.transactions.push(t);mutate(s);if(!a.include)return t;const gb=t.generatedById?s.users.find(u=>u.id===t.generatedById):null;return{...t,generatedBy:gb?{name:gb.name}:null};},
  },
  dailyExpense:{
    async findMany(a:{where?:WC;orderBy?:Record<string,string>}={}){const s=await getStore();return ao(aw(s.dailyExpenses as WC[],a.where) as WC[],a.orderBy) as DailyExpense[];},
    async findUnique(a:{where:WC}){const s=await getStore();const i=wm(s.dailyExpenses as WC[],a.where);return i>=0?s.dailyExpenses[i]:null;},
    async upsert(a:{where:WC;create:Partial<DailyExpense>;update:Partial<DailyExpense>}){const s=await getStore();const i=wm(s.dailyExpenses as WC[],a.where);if(i>=0){s.dailyExpenses[i]={...s.dailyExpenses[i],...a.update};mutate(s);return s.dailyExpenses[i];}const x:DailyExpense={id:Number(a.create.id)||nid("de",s.dailyExpenses),amount:Number(a.create.amount??0),date:a.create.date??new Date(),note:a.create.note??null};s.dailyExpenses.push(x);mutate(s);return x;},
    async aggregate(a:{_sum?:WC;where?:WC}={}){const s=await getStore();const r=aw(s.dailyExpenses as WC[],a.where) as DailyExpense[];const _sum:WC={};if(a._sum)for(const k of Object.keys(a._sum))_sum[k]=r.reduce((acc,x)=>acc+Number((x as WC)[k]||0),0);return{_sum};},
  },
};

export const prisma=mockPrisma as any;
if(typeof window!=="undefined"){getStore().then(()=>console.info("Demo store ready"));}else{getStore().catch(()=>{});}
