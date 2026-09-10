const fs = require("fs");
const path = require("path");

const parts = [];

// Part 1: header + interfaces + persistence + helpers
parts.push(`/* eslint-disable @typescript-eslint/no-explicit-any */
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
function dr(_k:string,v:unknown):unknown{if(typeof v==="string"&&/^\\d{4}-\\d{2}-\\d{2}T/.test(v))return new Date(v);return v;}
function load():Store|null{if(typeof window==="undefined")return null;try{const r=localStorage.getItem(SK);return r?JSON.parse(r,dr) as Store:null;}catch{return null;}}
function save(s:Store):void{if(typeof window==="undefined")return;try{localStorage.setItem(SK,JSON.stringify(s));}catch{}}
const _c:Record<string,number>={};
function nid(t:string,a:{id:number}[]):number{if(!_c[t])_c[t]=Math.max(0,...a.map(x=>x.id))+1;return _c[t]++;}
const dA=(n:number)=>{const d=new Date();d.setDate(d.getDate()-n);return d;};
const dF=(n:number)=>{const d=new Date();d.setDate(d.getDate()+n);return d;};
`);

fs.writeFileSync(path.join(__dirname, "lib", "prisma.ts"), parts.join(""), "utf8");
console.log("wrote part1, bytes:", parts[0].length);
