(function(s,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(s=typeof globalThis<"u"?globalThis:s||self,c(s["Shopemaa checkout"]={}))})(this,function(s){"use strict";function c(e,t){I(e),B(t),P(),h(),T(),F(),g()}function I(e){localStorage.setItem("shopemaa_store_key",e)}function _(){return localStorage.getItem("shopemaa_store_key")}function B(e){localStorage.setItem("shopemaa_store_secret",e)}function C(){return localStorage.getItem("shopemaa_store_secret")}function h(){localStorage.getItem("shopemaaCheckoutBucket")===null&&m()}function m(){let e={cartId:null,items:[],shippingCharge:0,paymentFee:0,discount:0,paymentMethodId:null,shippingMethodId:null,initAt:new Date().getMilliseconds()};localStorage.setItem("shopemaaCheckoutBucket",JSON.stringify(e))}function i(){let e=localStorage.getItem("shopemaaCheckoutBucket");return e===null&&(h(),e=localStorage.getItem("shopemaaCheckoutBucket")),JSON.parse(e)}function M(e){e.items=e.items.sort((t,a)=>t.orderIndex-a.orderIndex),localStorage.setItem("shopemaaCheckoutBucket",JSON.stringify(e))}function T(){q(),j(),O()}function q(){$(".shopemaa-buy-btn").click(function(){let e=$(this).data("productId");D(e)}),$(".shopemaa-stock-up").click(function(){let e=$(this).data("productId");v(e,1)}),$(".shopemaa-stock-down").click(function(){let e=$(this).data("productId");v(e,-1)})}function g(){let e=i(),t=document.getElementsByClassName("shopemaa-cart-items-count");if(t!=null){let a=t.length,l=0;e.items.forEach(n=>{l+=n.qty});for(let n=0;n<a;n++)t.item(n).innerText=l}E()}function E(){let e=document.getElementsByClassName("shopemaa-cart-item-qty");if(e!=null){let t=e.length;for(let a=0;a<t;a++){let l=e.item(a),n=i(),o=l.dataset.productId,r=n.items.find(U=>U.id===o);r!=null?e.item(a).innerText=r.qty:e.item(a).innerText=0}}}function j(){$(".shopemaa-cart-btn").click(function(){w(!0)})}function O(){$(".shopemaa-order-track-btn").click(function(){J()})}function D(e){x(e).then(t=>{t.ok&&t.json().then(a=>{let l=a.data.product;l.stock>0&&p(l,1)}).catch(a=>{d(a)})}).catch(t=>{d(t)})}function v(e,t){x(e).then(a=>{a.ok&&a.json().then(l=>{let n=l.data.product;n.stock>=t&&p(n,t)}).catch(l=>{d(l)})}).catch(a=>{d(a)})}function y(e,t){i().items.forEach(l=>{let n=`shopemaa_cart_item_${l.id}`,o=document.getElementById(n);o!=null&&o.remove()}),p(e,t)}function p(e,t){let a=i(),l=a.items.find(n=>n.id===e.id);l==null?a.items.push({id:e.id,name:e.name,stock:e.stock,qty:1,fullImages:e.fullImages,productSpecificDiscount:e.productSpecificDiscount,price:e.price,orderIndex:a.items.length+1}):l.qty+t<=e.stock&&(l.qty+=t,a.items=a.items.filter(n=>n.id!==e.id),l.qty>0&&a.items.push(l)),M(a),w(!0),g()}function x(e){let t=`query { product(productId: "${e}") { id name price stock fullImages productSpecificDiscount attributes { id name values isRequired } } }`;return k(t)}function k(e){return fetch(L(),{method:"POST",headers:{"Content-Type":"application/json","store-key":_(),"store-secret":C()},body:JSON.stringify({query:e})})}function L(){return"https://api.shopemaa.com/query"}function P(){k("query { storeBySecret { name title description currency isOpen } }").then(t=>{t.ok&&t.json().then(a=>{localStorage.setItem("shopemaaStoreInfo",JSON.stringify(a.data.storeBySecret))}).catch(a=>{d(a)})}).catch(t=>{d(t)})}function A(){return JSON.parse(localStorage.getItem("shopemaaStoreInfo"))}function u(){return A().currency}function b(e){let t=e.price;return e.productSpecificDiscount!==0&&(t=t-e.productSpecificDiscount*t/100),t}function G(){let e=0;i().items.forEach(t=>{e+=t.qty*b(t)}),document.getElementById("shopemaa_cart-subtotal").innerText=(e/100).toFixed(2)+" "+u()}function H(){let e=i(),t=0;e.items.forEach(l=>{t+=l.qty*b(l)});let a=t;document.getElementById("shopemaa_cart-grand-total").innerText=(a/100).toFixed(2)+" "+u()}function w(e){if(e){let t=document.getElementById("shopemaa_cartModal");t==null&&V();let a=document.getElementById("shopemaa_cartItemsView");i().items.forEach(l=>{a.appendChild(N(l));let n=document.getElementById(`shopemaa_qty_minus_${l.id}`);n.onclick=function(){y(l,-1)};let o=document.getElementById(`shopemaa_qty_plus_${l.id}`);o.onclick=function(){y(l,1)}}),G(),H()}else{let t=document.getElementById("shopemaa_cartModal");t!=null&&t.remove()}}function N(e){let t=e.fullImages[0],a=b(e),l=document.createElement("button");l.classList.add("flex","w-3.5","h-3.5","px-px","items-center","justify-center","bg-black","hover:bg-indigo-500","rounded","transition","duration-100"),l.innerHTML='<div class="h-px mx-px w-full bg-white"></div>',l.id=`shopemaa_qty_minus_${e.id}`;let n=document.createElement("button");n.classList.add("flex","w-3.5","h-3.5","px-px","items-center","justify-center","bg-black","hover:bg-indigo-500","rounded","transition","duration-100"),n.innerHTML='<div class="relative h-full w-full py-px"> <div class="absolute top-1/2 left-0 h-px w-full bg-white"></div> <div class="inline-block max-w-max mx-auto h-full bg-white"> <div class="inline-block px-px"></div> </div> </div>',n.id=`shopemaa_qty_plus_${e.id}`;let o=`<div class="flex mb-6 justify-between items-center">
                      <div class="flex-grow flex flex-wrap -mx-2">
                          <div class="w-full xs:w-auto px-2 mb-2 xs:mb-0">
                              <img class="w-24 h-full max-h-24 border-2 border-black rounded-md shadow p-1"
                                   src="${t}">
                          </div>
                          <div class="w-full xs:w-auto px-2">
                              <h4 class="text-base font-bold mb-2">${e.name}</h4>
                              <div class="flex h-12 w-24 px-2 items-center justify-between bg-white border-2 border-black rounded-md">
                                  `+l.outerHTML+`
                                  <input disabled class="w-10 text-center text-sm font-bold placeholder-black text-black outline-none"
                                         type="number" value="${e.qty}">
                                  `+n.outerHTML+`
                              </div>
                          </div>
                      </div>
                      <div class="w-auto">
                          <span class="text-xl font-bold">${(a/100).toFixed(2)} ${u()}</span>
                      </div>
                  </div>`,r=document.createElement("div");return r.id=`shopemaa_cart_item_${e.id}`,r.innerHTML=o,r}function V(){let e=`<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 pb-3">
          <div class="relative ml-auto w-full max-w-lg bg-white">
              <div class="p-6 border-b-2 border-black">
                  <h3 class="text-2xl font-bold">Your Cart</h3>
              </div>
              <div id="shopemaa_cartItemsView" class="p-6 mb-6 border-b-2 border-black"></div>

              <div class="px-6 mb-10 pb-3">
                  <div class="pb-6 mb-6 border-b-2 border-black">
                      <div class="flex mb-6 pb-6 items-center justify-between border-b-2 border-black">
                          <span class="text-sm font-bold">Subtotal</span>
                          <span class="text-sm font-black" id="shopemaa_cart-subtotal">0.00 `+u()+`</span>
                      </div>
                      <div class="flex mb-3 items-center justify-between">
                          <span class="text-sm font-bold">Discount</span>
                          <span class="text-sm font-black">To be calculated</span>
                      </div>
                      <div class="flex mb-3 items-center justify-between">
                          <span class="text-sm font-bold">Shipping Charge</span>
                          <span class="text-sm font-black">To be calculated</span>
                      </div>
                      <div class="flex mb-3 items-center justify-between">
                          <span class="text-sm font-bold">Payment Fee</span>
                          <span class="text-sm font-black">To be calculated</span>
                      </div>
                  </div>
                  <div class="flex mb-6 items-center justify-between">
                      <span class="text-lg font-bold">Grand Total</span>
                      <span class="text-lg font-black" id="shopemaa_cart-grand-total">0.00 `+u()+`</span>
                  </div>

                  <a id="shopemaa_checkoutBtn" onclick="event.preventDefault(); onGotoCheckout()"
                     class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                          <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-`+f()+`-600">
                              <span class="text-base font-black text-white">Checkout</span>
                          </div>
                      </div>
                  </a>
                  
                  <a style="display: none" id="shopemaa_creatingCartBtn" onclick="event.preventDefault();"
                     class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                          <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-`+f()+`-600">
                              <span class="text-base font-black text-white">Please wait...</span>
                          </div>
                      </div>
                  </a>

                  <a onclick="event.preventDefault(); toggleCartView(false);"
                     class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md mt-2" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                          <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-`+f()+`-400">
                              <span class="text-base font-black text-black">Continue Shopping</span>
                          </div>
                      </div>
                  </a>
              </div>
          </div>
      </div>`,t=document.createElement("section");t.classList.add("relative"),t.id="shopemaa_cartModal",t.innerHTML+=e,document.body.appendChild(t)}function f(){return"gray"}function d(e){console.log(e)}function F(){let e=864e5,t=function(){console.log("Performing cart cleanup");let a=i(),l=1e3*60*60*24,n=a.initAt;n==null&&m(),new Date().getMilliseconds()-n>=l&&m()};setInterval(t,e),t()}function S(){let e=document.getElementById("shopemaa_orderSearchModal");e!==null&&e.remove()}function J(){let e=`<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 pb-3">
          <div class="relative ml-auto w-full h-full max-w-lg bg-white">
              <div class="p-6 border-b-2 border-black">
                  <h3 class="text-2xl font-bold text-center">Track Order</h3>
              </div>

              <div class="pr-5 pl-5 pt-5">
                  <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">Order Hash<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" id="shopemaa_order-hash" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">Your Email<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="email" id="shopemaa_customer-email" placeholder="Type here" required />
                </div>
              </div>
              
              <div class="px-6 mb-10 pb-3">
                  <a onclick="event.preventDefault(); getOrderDetails()" class="pr-5 pl-5 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                    <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                       <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-`+f()+`-400">
                          <span class="text-base font-black text-black">Get Details</span>
                       </div>
                    </div>
                  </a>
                  <a onclick="event.preventDefault(); shopemaa.hideOrderSearchModal()" class="pt-2 mt-2 pr-5 pl-5 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                    <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                       <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-`+f()+`-100">
                          <span class="text-base font-black text-black">Cancel</span>
                       </div>
                    </div>
                  </a>
              </div>
          </div>
      </div>`,t=document.createElement("section");t.classList.add("relative"),t.id="shopemaa_orderSearchModal",t.innerHTML+=e,document.body.appendChild(t)}(async function(){typeof window<"u"&&(window.shopemaa=window.shopemaa||{},window.shopemaa.hideOrderSearchModal=S)})(),s.hideOrderSearchModal=S,s.initShopemaa=c,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});
