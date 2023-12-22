function ne(e, a) {
  _(e), j(a), L(), w(), A(), X(), I();
}
function _(e) {
  localStorage.setItem("shopemaa_store_key", e);
}
function E() {
  return localStorage.getItem("shopemaa_store_key");
}
function j(e) {
  localStorage.setItem("shopemaa_store_secret", e);
}
function q() {
  return localStorage.getItem("shopemaa_store_secret");
}
function w() {
  localStorage.getItem("shopemaaCheckoutBucket") === null && h();
}
function h() {
  let e = {
    cartId: null,
    items: [],
    shippingCharge: 0,
    paymentFee: 0,
    discount: 0,
    paymentMethodId: null,
    shippingMethodId: null,
    initAt: (/* @__PURE__ */ new Date()).getMilliseconds()
  };
  localStorage.setItem("shopemaaCheckoutBucket", JSON.stringify(e));
}
function c() {
  let e = localStorage.getItem("shopemaaCheckoutBucket");
  return e === null && (w(), e = localStorage.getItem("shopemaaCheckoutBucket")), JSON.parse(e);
}
function f(e) {
  e.items = e.items.sort((a, t) => a.orderIndex - t.orderIndex), localStorage.setItem("shopemaaCheckoutBucket", JSON.stringify(e));
}
function A() {
  D(), G(), P();
}
function D() {
  $(".shopemaa-buy-btn").click(function() {
    let e = $(this).data("productId");
    O(e);
  }), $(".shopemaa-stock-up").click(function() {
    let e = $(this).data("productId");
    g(e, 1);
  }), $(".shopemaa-stock-down").click(function() {
    let e = $(this).data("productId");
    g(e, -1);
  });
}
function I() {
  let e = c(), a = document.getElementsByClassName("shopemaa-cart-items-count");
  if (a != null) {
    let t = a.length, o = 0;
    e.items.forEach((n) => {
      o += n.qty;
    });
    for (let n = 0; n < t; n++)
      a.item(n).innerText = o;
  }
  N();
}
function N() {
  let e = document.getElementsByClassName("shopemaa-cart-item-qty");
  if (e != null) {
    let a = e.length;
    for (let t = 0; t < a; t++) {
      let o = e.item(t), n = c(), i = o.dataset.productId, l = n.items.find((b) => b.id === i);
      l != null ? e.item(t).innerText = l.qty : e.item(t).innerText = 0;
    }
  }
}
function G() {
  $(".shopemaa-cart-btn").click(function() {
    v(!0);
  });
}
function P() {
  $(".shopemaa-order-track-btn").click(function() {
    oe();
  });
}
function O(e) {
  S(e).then((a) => {
    a.ok && a.json().then((t) => {
      let o = t.data.product;
      o.stock > 0 && y(o, 1);
    }).catch((t) => {
      d(t);
    });
  }).catch((a) => {
    d(a);
  });
}
function g(e, a) {
  S(e).then((t) => {
    t.ok && t.json().then((o) => {
      let n = o.data.product;
      n.stock >= a && y(n, a);
    }).catch((o) => {
      d(o);
    });
  }).catch((t) => {
    d(t);
  });
}
function k(e, a) {
  c().items.forEach((o) => {
    let n = `shopemaa_cart_item_${o.id}`, i = document.getElementById(n);
    i != null && i.remove();
  }), y(e, a);
}
function y(e, a) {
  let t = c(), o = t.items.find((n) => n.id === e.id);
  o == null ? t.items.push({
    id: e.id,
    name: e.name,
    stock: e.stock,
    qty: 1,
    fullImages: e.fullImages,
    productSpecificDiscount: e.productSpecificDiscount,
    price: e.price,
    orderIndex: t.items.length + 1
  }) : o.qty + a <= e.stock && (o.qty += a, t.items = t.items.filter((n) => n.id !== e.id), o.qty > 0 && t.items.push(o)), f(t), v(!0), I();
}
function S(e) {
  let a = `query { product(productId: "${e}") { id name price stock fullImages productSpecificDiscount attributes { id name values isRequired } } }`;
  return p(a);
}
function p(e) {
  return fetch(F(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "store-key": E(),
      "store-secret": q()
    },
    body: JSON.stringify({
      query: e
    })
  });
}
function F() {
  return "https://api.shopemaa.com/query";
}
function L() {
  p("query { storeBySecret { name title description currency isOpen } }").then((a) => {
    a.ok && a.json().then((t) => {
      localStorage.setItem(
        "shopemaaStoreInfo",
        JSON.stringify(t.data.storeBySecret)
      );
    }).catch((t) => {
      d(t);
    });
  }).catch((a) => {
    d(a);
  });
}
function V() {
  return JSON.parse(localStorage.getItem("shopemaaStoreInfo"));
}
function s() {
  return V().currency;
}
function m(e) {
  let a = e.price;
  return e.productSpecificDiscount !== 0 && (a = a - e.productSpecificDiscount * a / 100), a;
}
function R() {
  let e = 0;
  c().items.forEach((a) => {
    e += a.qty * m(a);
  }), document.getElementById("shopemaa_cart-subtotal").innerText = (e / 100).toFixed(2) + " " + s();
}
function H() {
  let e = c(), a = 0;
  e.items.forEach((o) => {
    a += o.qty * m(o);
  });
  let t = a;
  document.getElementById("shopemaa_cart-grand-total").innerText = (t / 100).toFixed(2) + " " + s();
}
function v(e) {
  if (e) {
    let a = document.getElementById("shopemaa_cartModal");
    a == null && z();
    let t = document.getElementById("shopemaa_cartItemsView");
    c().items.forEach((o) => {
      t.appendChild(U(o));
      let n = document.getElementById(
        `shopemaa_qty_minus_${o.id}`
      );
      n.onclick = function() {
        k(o, -1);
      };
      let i = document.getElementById(`shopemaa_qty_plus_${o.id}`);
      i.onclick = function() {
        k(o, 1);
      };
    }), R(), H();
  } else {
    let a = document.getElementById("shopemaa_cartModal");
    a != null && a.remove();
  }
}
function U(e) {
  let a = e.fullImages[0], t = m(e), o = document.createElement("button");
  o.classList.add(
    "flex",
    "w-3.5",
    "h-3.5",
    "px-px",
    "items-center",
    "justify-center",
    "bg-black",
    "hover:bg-indigo-500",
    "rounded",
    "transition",
    "duration-100"
  ), o.innerHTML = '<div class="h-px mx-px w-full bg-white"></div>', o.id = `shopemaa_qty_minus_${e.id}`;
  let n = document.createElement("button");
  n.classList.add(
    "flex",
    "w-3.5",
    "h-3.5",
    "px-px",
    "items-center",
    "justify-center",
    "bg-black",
    "hover:bg-indigo-500",
    "rounded",
    "transition",
    "duration-100"
  ), n.innerHTML = '<div class="relative h-full w-full py-px"> <div class="absolute top-1/2 left-0 h-px w-full bg-white"></div> <div class="inline-block max-w-max mx-auto h-full bg-white"> <div class="inline-block px-px"></div> </div> </div>', n.id = `shopemaa_qty_plus_${e.id}`;
  let i = `<div class="flex mb-6 justify-between items-center">
                      <div class="flex-grow flex flex-wrap -mx-2">
                          <div class="w-full xs:w-auto px-2 mb-2 xs:mb-0">
                              <img class="w-24 h-full max-h-24 border-2 border-black rounded-md shadow p-1"
                                   src="${a}">
                          </div>
                          <div class="w-full xs:w-auto px-2">
                              <h4 class="text-base font-bold mb-2">${e.name}</h4>
                              <div class="flex h-12 w-24 px-2 items-center justify-between bg-white border-2 border-black rounded-md">
                                  ` + o.outerHTML + `
                                  <input disabled class="w-10 text-center text-sm font-bold placeholder-black text-black outline-none"
                                         type="number" value="${e.qty}">
                                  ` + n.outerHTML + `
                              </div>
                          </div>
                      </div>
                      <div class="w-auto">
                          <span class="text-xl font-bold">${(t / 100).toFixed(2)} ${s()}</span>
                      </div>
                  </div>`, l = document.createElement("div");
  return l.id = `shopemaa_cart_item_${e.id}`, l.innerHTML = i, l;
}
function z() {
  let e = `<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 pb-3">
          <div class="relative ml-auto w-full max-w-lg bg-white">
              <div class="p-6 border-b-2 border-black">
                  <h3 class="text-2xl font-bold">Your Cart</h3>
              </div>
              <div id="shopemaa_cartItemsView" class="p-6 mb-6 border-b-2 border-black"></div>

              <div class="px-6 mb-10 pb-3">
                  <div class="pb-6 mb-6 border-b-2 border-black">
                      <div class="flex mb-6 pb-6 items-center justify-between border-b-2 border-black">
                          <span class="text-sm font-bold">Subtotal</span>
                          <span class="text-sm font-black" id="shopemaa_cart-subtotal">0.00 ` + s() + `</span>
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
                      <span class="text-lg font-black" id="shopemaa_cart-grand-total">0.00 ` + s() + `</span>
                  </div>

                  <a id="shopemaa_checkoutBtn" onclick="event.preventDefault(); shopemaa.onGotoCheckout()"
                     class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                          <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-600">
                              <span class="text-base font-black text-white">Checkout</span>
                          </div>
                      </div>
                  </a>
                  
                  <a style="display: none" id="shopemaa_creatingCartBtn" onclick="event.preventDefault();"
                     class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                          <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-600">
                              <span class="text-base font-black text-white">Please wait...</span>
                          </div>
                      </div>
                  </a>

                  <a onclick="event.preventDefault(); shopemaa.toggleCartView(false);"
                     class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md mt-2" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                          <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-400">
                              <span class="text-base font-black text-black">Continue Shopping</span>
                          </div>
                      </div>
                  </a>
              </div>
          </div>
      </div>`, a = document.createElement("section");
  a.classList.add("relative"), a.id = "shopemaa_cartModal", a.innerHTML += e, document.body.appendChild(a);
}
function K() {
  let e = c();
  e.items.length !== 0 && (u(!1), e.shippingCharge = 0, e.paymentFee = 0, e.discount = 0, e.paymentMethodId = null, e.shippingMethodId = null, f(e), J());
}
function J() {
  let e = c(), a = "[";
  if (e.items.forEach((t) => {
    a += `{ productId: "${t.id}" quantity: ${t.qty} }`;
  }), a += "]", e.cartId === null) {
    let t = "mutation { newCart(params: { cartItems: " + a + " }) { id isShippingRequired } }";
    x(p(t), !0);
  } else {
    let t = `mutation { updateCart(id: "${e.cartId}" params: { cartItems: ` + a + " }) { id isShippingRequired } }";
    x(p(t), !1);
  }
}
function x(e, a) {
  e.then((t) => {
    if (!t.ok) {
      d(`create or update cart response is: ${t.statusText}`), u(!0);
      return;
    }
    t.json().then((o) => {
      if (o.data === null) {
        d("create or update cart response body is NULL"), u(!0);
        return;
      }
      if (a) {
        let n = o.data.newCart.id, i = c();
        i.cartId = n, f(i);
      }
      v(!1), B();
    }).catch((o) => {
      u(!0), d(o);
    });
  }).catch((t) => {
    u(!0), d(t);
  });
}
function u(e) {
  if (e) {
    let a = document.getElementById("shopemaa_checkoutBtn");
    a.style.display = "block";
    let t = document.getElementById("shopemaa_creatingCartBtn");
    t.style.display = "none";
  } else {
    let a = document.getElementById("shopemaa_checkoutBtn");
    a.style.display = "none";
    let t = document.getElementById("shopemaa_creatingCartBtn");
    t.style.display = "block";
  }
}
function C() {
  let e = c(), a = 0;
  e.items.forEach((l) => {
    a += l.qty * m(l);
  }), document.getElementById("shopemaa_checkout-subtotal").innerText = (a / 100).toFixed(2) + " " + s();
  let t = e.discount;
  document.getElementById("shopemaa_checkout-discount").innerText = "-" + (t / 100).toFixed(2) + " " + s();
  let o = e.shippingCharge;
  document.getElementById("shopemaa_checkout-shipping-charge").innerText = (o / 100).toFixed(2) + " " + s();
  let n = e.paymentFee;
  document.getElementById("shopemaa_checkout-payment-fee").innerText = (n / 100).toFixed(2) + " " + s();
  let i = ((a + o + n - t) / 100).toFixed(2);
  document.getElementById("shopemaa_checkout-grand-total").innerText = i + " " + s();
}
function W(e) {
  if (e)
    B();
  else {
    let a = document.getElementById("shopemaa_checkoutModal");
    a != null && a.remove();
  }
}
function Q(e) {
  if (document.getElementById("shopemaa_coupon").value.trim() === "")
    return;
  let a = document.getElementById("shopemaa_coupon").value, t = c(), o = "", n = document.getElementById(
    "shopemaa_shippingMethod"
  ).value;
  n != null && n !== "select" && (o = `shippingMethodId: "${n}"`);
  let i = `query { checkDiscountForGuests(couponCode: "${a}" cartId: "${t.cartId}" ${o}) }`;
  p(i).then((l) => {
    l.ok && l.json().then((b) => {
      if (b.data === null)
        return;
      let T = b.data.checkDiscountForGuests;
      t = c(), t.discount = T, f(t), C();
    }).catch((b) => {
      d(b);
    });
  }).catch((l) => {
    d(l);
  });
}
function B() {
  let e = `<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80">
    <form>
       <div class="relative ml-auto w-full max-w-lg bg-white">
          <div class="p-6 border-b-2 border-black">
             <h3 class="text-2xl font-bold">Your Cart</h3>
          </div>
          <div class="px-6 mb-10 pt-2 pb-2">
             <div class="pb-6 mb-6 border-black">
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">Email<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="email" name="email" id="shopemaa_email" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">Phone<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="tel" name="phone" id="shopemaa_phone" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">First
                   Name<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="firstName" id="shopemaa_firstName" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">Last
                   Name<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="lastName" id="shopemaa_lastName" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-1/4 text-sm font-bold mb-2">Street
                   Address<span style="color: red">*</span></label>
                   <input class="w-3/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="streetAddress" id="shopemaa_streetAddress" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-2/4 text-sm font-bold mb-2">City<span style="color: red">*</span></label>
                   <input class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="city" id="shopemaa_city" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-2/4 text-sm font-bold mb-2">State</label>
                   <input class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="state" id="shopemaa_state" placeholder="Type here" />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-2/4 text-sm font-bold mb-2">Postcode<span style="color: red">*</span></label>
                   <input class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="postcode" id="shopemaa_postcode" placeholder="Type here" required />
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-2/4 text-sm font-bold mb-2">Country<span style="color: red">*</span></label>
                   <select class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" name="country" id="shopemaa_country" required>
                      <option selected disabled value="select">Select</option>
                      <option value="6d024f10-9374-4a10-bff2-a87a799cbe7b">Afghanistan</option>
                      <option value="7a062d59-6403-4f22-807d-8232802e3281">Åland Islands</option>
                      <option value="f920a193-3037-49eb-b46a-1a779fcf062a">Albania</option>
                      <option value="99698612-abd3-4053-85ce-b6f4faee75be">Algeria</option>
                      <option value="ee6b3b58-b82c-4c89-8aa0-c0da6355f567">American Samoa</option>
                      <option value="ada30b7a-2f48-4ab9-9b1e-ce2656b7072d">Andorra</option>
                      <option value="07e97999-8a81-4a25-9b38-e44c54032535">Angola</option>
                      <option value="efd41730-48d3-41ca-9647-ee04d9e3f8fa">Anguilla</option>
                      <option value="989f2433-bac4-45cb-a8ec-033525a24e70">Antarctica</option>
                      <option value="534aca6a-dd88-4146-a1cc-9a53cd3757c5">Antigua and Barbuda</option>
                      <option value="a5f5deea-9922-48de-9ab9-afdaa9ffce75">Argentina</option>
                      <option value="65d3478a-bc10-4075-bd5e-8fdd797f76a5">Armenia</option>
                      <option value="ba393a5c-fa96-4ca6-8d5b-b85f948371e8">Aruba</option>
                      <option value="e100c55f-11de-4de6-8bae-c383d57e60e1">Australia</option>
                      <option value="5bec7a14-276e-4e88-9904-db56bea4772e">Austria</option>
                      <option value="e7090edd-2d32-4247-b3bb-12090aa8ec22">Azerbaijan</option>
                      <option value="38dabbe1-f7e3-4c17-8593-52ea262b775e">Bahamas</option>
                      <option value="99e14777-2344-42a1-90af-2eae9d86ac15">Bahrain</option>
                      <option value="2300fd9d-f7d9-479a-8d27-497af8790336">Bangladesh</option>
                      <option value="3020cd73-ad82-4c28-bb88-0f0441d71b71">Barbados</option>
                      <option value="3e8964bf-a836-487a-9fb8-b9a1cb720c57">Belarus</option>
                      <option value="d7acd969-e04a-40c3-be9f-5dfd9fd2a7d5">Belgium</option>
                      <option value="de150c77-4505-4369-9a04-b66f0e570426">Belize</option>
                      <option value="9f221d55-60dc-4802-9cdb-812b7d66efb1">Benin</option>
                      <option value="7d8451df-448b-4b7d-8e16-b5a3d654f0fe">Bermuda</option>
                      <option value="a84aa09b-a80a-421a-b89a-91f406157dc5">Bhutan</option>
                      <option value="64aa9e55-15b3-4f59-ba15-2bbd9448b1c9">Bolivia</option>
                      <option value="541d0454-bf5a-451e-86c2-64d5a11c0e0a">Bonaire, Sint Eustatius and Saba</option>
                      <option value="566f568f-92ed-4d34-82fb-99603766ec6e">Bosnia and Herzegovina</option>
                      <option value="5c3bfb00-a564-47dc-b00c-4be3e443e6eb">Botswana</option>
                      <option value="629162b2-2f97-483f-9022-66e767dcc57a">Brazil</option>
                      <option value="49b13ab1-841a-4266-8fa8-47168d144851">Brunei Darussalam</option>
                      <option value="79240cb2-69e0-4c6b-bd0b-63e58d51f293">Bulgaria</option>
                      <option value="59d55828-f0f3-402b-9799-46930d1bd841">Burkina Faso</option>
                      <option value="bfca3e0e-c793-4ddf-bea2-94a00c2b5d45">Burundi</option>
                      <option value="564bc735-fb43-45bf-869d-55092e472731">Cambodia</option>
                      <option value="819e869e-aa43-428f-a124-5bd22656bfe6">Cameroon</option>
                      <option value="35b8ebe3-a556-4923-9a0a-737138f19b83">Canada</option>
                      <option value="08f4e9b4-8789-4381-907c-61b7cc0803d0">Cape Verde</option>
                      <option value="6eaa1157-6b3c-44e6-905c-2699f99d3891">Cayman Islands</option>
                      <option value="ff749606-3c22-4b51-b776-e20c0398c5f2">Central African Republic</option>
                      <option value="f4ea93fb-11ad-4465-a59c-611b8801cc74">Chad</option>
                      <option value="068f0b1e-15be-4461-9a8f-3ac1ff9cc24a">Chile</option>
                      <option value="3bfed13f-112b-4606-a0db-2a9913a05226">China</option>
                      <option value="cea00ed8-11a6-4f5a-92f9-eecacd08be60">Colombia</option>
                      <option value="3b0f158e-0ead-47d3-8ae8-302feae3e9de">Comoros</option>
                      <option value="d3c207b2-f007-49cc-b3b7-2fb1ed640182">Congo</option>
                      <option value="1e5185ba-575a-4059-8d55-f6620a23aa64">Congo, The Democratic Republic Of The</option>
                      <option value="74337384-a285-481e-bbc4-82d671e24b29">Cook Islands</option>
                      <option value="40713624-c93d-4564-b080-46a166cd2ee4">Côte D&#39;Ivoire</option>
                      <option value="d63d98db-7247-421a-8f65-770c154cc1b3">Croatia</option>
                      <option value="9b13c9f4-1662-42f4-a27d-2d1470ba5a11">Cuba</option>
                      <option value="37e28742-ffa2-4f5a-afea-794a025d5784">Curaçao</option>
                      <option value="aa58f989-0370-4354-b2df-f9ed7733ab3f">Cyprus</option>
                      <option value="c287b9fe-06fb-4887-9931-62b676f09af3">Czech Republic</option>
                      <option value="404f16f6-9eac-4800-bec2-a0136ecef845">Denmark</option>
                      <option value="4c9ff1b4-ffe0-47a5-9296-b8820a3e1e04">Djibouti</option>
                      <option value="4e1a1b32-e35d-44ec-892f-c8f0d474af25">Dominica</option>
                      <option value="725e6fe3-1793-491b-aa92-fffc3df2a632">Dominican Republic</option>
                      <option value="13cf5e5f-ab0d-4781-82f3-36c42cf3ad61">Ecuador</option>
                      <option value="e3a6125b-7aa4-4429-87ff-0c32c6a6f98e">Egypt</option>
                      <option value="a844be92-bf8c-43aa-96d2-da11dcb54326">El Salvador</option>
                      <option value="e698308e-c1ff-4e9e-9c8f-957dfa42e139">Equatorial Guinea</option>
                      <option value="fcaf42d0-48c9-4fc4-8e30-887708f09588">Eritrea</option>
                      <option value="6a3143b9-46b7-48ee-b009-d170be9f180b">Estonia</option>
                      <option value="f5169d80-67b1-4d1a-b558-8b0bb6c8bfb4">Ethiopia</option>
                      <option value="8a32f324-b8ce-46fa-a770-baed0d8e7abf">Falkland Islands (Malvinas)</option>
                      <option value="6fcd5a42-ae51-4857-b47f-b0daf045940f">Faroe Islands</option>
                      <option value="8d658fa3-b68d-42bc-a5a1-50166b01fadc">Fiji</option>
                      <option value="88465578-76c7-4e56-8f22-3a771bdecf53">Finland</option>
                      <option value="85218cc1-801e-498d-959d-eb8844ca81f1">France</option>
                      <option value="7c02a802-e99b-46bc-9cf7-e81141e6bfbd">French Guiana</option>
                      <option value="5aef9376-eab3-4ed0-998a-2fe514a5190c">French Polynesia</option>
                      <option value="b67e60e8-15ae-4b89-8c01-766cfb1f117a">Gabon</option>
                      <option value="abceaa1b-8e09-4c31-a3c9-071b2c6e8dce">Gambia</option>
                      <option value="da6b1017-58a7-4d3c-9ebf-5132817dab94">Georgia</option>
                      <option value="50a08b3d-dcff-4ecc-9743-75fad2543324">Germany</option>
                      <option value="e836cc27-1d3c-4fdb-b454-422901961cf7">Ghana</option>
                      <option value="9b265492-8720-4bc4-9e5c-d2882a37909d">Gibraltar</option>
                      <option value="955936db-0bbc-4eef-a1a2-d50fff060dd4">Greece</option>
                      <option value="c0d89e81-7980-478d-8dfb-d4bbf093886c">Greenland</option>
                      <option value="9fe6fdd1-fe5e-4c8b-a776-30303edb14e0">Grenada</option>
                      <option value="8028e476-4b89-4e46-aace-329f903898f7">Guadeloupe</option>
                      <option value="ebc764b0-75d1-4745-85e8-bcd8c58b0c80">Guam</option>
                      <option value="475ffd1f-70c0-44f2-9830-8b56c458069f">Guatemala</option>
                      <option value="caf58a02-fe4f-470e-9bea-95b21243bddb">Guernsey</option>
                      <option value="9065c8d2-9721-46c6-8f78-fc819f9ad466">Guinea</option>
                      <option value="c62d0c47-4a07-4483-8c9b-bb8b7f9a32dc">Guinea-Bissau</option>
                      <option value="41248cb6-99c1-404c-837c-cecf593914c3">Guyana</option>
                      <option value="bf3d0df2-5e60-48ce-8ffd-f9e392e01a9a">Haiti</option>
                      <option value="fb8bbd7f-113b-41cb-a143-759b71c5e96b">Holy See (Vatican City State)</option>
                      <option value="61e83279-7886-4fb0-b078-1e631f0cb604">Honduras</option>
                      <option value="eaf79d90-ce92-4330-9119-9d30ab4e03ae">Hong Kong</option>
                      <option value="a8010160-1a83-453c-b2aa-f8d5a9e746dd">Hungary</option>
                      <option value="cb6f4731-71c5-4979-8d9a-60b1f6f23ffd">Iceland</option>
                      <option value="5ede9614-04c0-4107-b2c1-182816faedf6">India</option>
                      <option value="a492cc8c-ccb6-4ee3-a228-d0289c74f055">Indonesia</option>
                      <option value="8c8f2659-1edd-4ef6-803c-84eb466ca809">Iran, Islamic Republic Of</option>
                      <option value="fd226ea9-51f5-4b51-ae9d-72a18f98295f">Iraq</option>
                      <option value="c586acaa-bb1b-4004-a7ec-5f612ef03af9">Ireland</option>
                      <option value="21a3704a-9f6f-4ea4-bc8c-1fc90e2aae74">Isle of Man</option>
                      <option value="ce2e0f37-1958-48aa-8930-c33708acf3c6">Israel</option>
                      <option value="4b1fd3a5-3fa1-4fd0-a0db-1c89b145e5b8">Italy</option>
                      <option value="4ed76a1f-cfd3-4dbb-a947-0b05318a599e">Jamaica</option>
                      <option value="c9e15a0f-7ff0-44aa-8a4f-bb16c3eb8183">Japan</option>
                      <option value="b8927dd6-3287-44f0-ac3c-84054a607895">Jersey</option>
                      <option value="7394e967-a65e-4726-8186-4066fa8f5733">Jordan</option>
                      <option value="de1db15a-e4b0-48e6-b08d-cb00209f6f39">Kazakhstan</option>
                      <option value="53c57b87-fc15-4340-a6ad-90d25bc9f6a0">Kenya</option>
                      <option value="4bb6577d-3ae3-4a1b-8c1d-7927f6de14b1">Kiribati</option>
                      <option value="7a25a4ce-1117-404f-8e68-008d9ece777b">Korea, Democratic People&#39;s Republic Of</option>
                      <option value="1ebb6a13-16f9-4864-951d-4058dc2d98a9">Korea, Republic of</option>
                      <option value="250c72eb-fe02-4a6e-85cd-9921132c36a7">Kuwait</option>
                      <option value="d3459a8b-44b6-4992-979b-ddf2160a4ff3">Kyrgyzstan</option>
                      <option value="a8beca2e-22e4-42d2-98d2-aae46a885fae">Lao People&#39;s Democratic Republic</option>
                      <option value="ac6eb83e-82c2-4221-8e25-6bfd922707e4">Latvia</option>
                      <option value="2b703a2b-0c14-4134-b6dd-9933c7fe34ae">Lebanon</option>
                      <option value="a92618f9-bdf7-4d87-9a03-71bf8db321cf">Lesotho</option>
                      <option value="1177cb88-4756-4cce-88c1-1446cf5557e9">Liberia</option>
                      <option value="9dcfb0f5-7e51-41c5-af46-8351ce5e6721">Libya</option>
                      <option value="244d3ad2-2238-46e5-931b-db972802bceb">Liechtenstein</option>
                      <option value="3877ebc6-26a9-4623-b34a-569340079667">Lithuania</option>
                      <option value="d5e379f6-1223-4b12-b333-03173c4d430b">Luxembourg</option>
                      <option value="a4948eaf-51a9-4553-9859-266cb72f10c9">Macao</option>
                      <option value="2c857aad-6351-4491-8d63-ed4dae08b1a3">Macedonia, the Former Yugoslav Republic Of</option>
                      <option value="bcb49a5d-b17a-4bdf-af42-579a8b56d941">Madagascar</option>
                      <option value="64bbf863-8e56-4b47-8b85-4d876761eebb">Malawi</option>
                      <option value="b3c06a1e-614c-48f4-89c9-9e32ce657218">Malaysia</option>
                      <option value="78c8b4bc-1b67-42d9-ae71-e7c9be98b2be">Maldives</option>
                      <option value="8d209869-8e15-4693-8065-f82afb9379b2">Mali</option>
                      <option value="93f0ce77-b15a-421b-811a-834ee9552946">Malta</option>
                      <option value="9c370976-9339-4808-a898-cdf3ab04b5b5">Marshall Islands</option>
                      <option value="7565d32d-a404-4af1-9c09-f458ac751069">Martinique</option>
                      <option value="85674647-c33b-4be8-ba33-7484e50427bf">Mauritania</option>
                      <option value="51ac39c3-0446-486e-b354-b20f5e777e98">Mauritius</option>
                      <option value="e676a4a0-9e80-4ee6-a54f-0f5e47f04bba">Mayotte</option>
                      <option value="d720f2af-fc31-4f2f-8e77-b55eb2628483">Mexico</option>
                      <option value="20e280df-0875-4212-b866-8e3bbdb0aaa6">Micronesia, Federated States Of</option>
                      <option value="5bc3937f-1cdd-4c59-9c3a-1e3457c09c19">Moldova, Republic of</option>
                      <option value="774d675a-848b-4270-bca4-35bdd53a93b6">Monaco</option>
                      <option value="e3b00a1d-cc18-468f-8e54-9eb7e056c46e">Mongolia</option>
                      <option value="243412c5-c399-41d4-8f00-730ca808d847">Montenegro</option>
                      <option value="e9f47075-f3db-417f-bc87-9352f957b7c7">Montserrat</option>
                      <option value="03d119b2-c164-47d7-9fe1-e24bf1acbf7e">Morocco</option>
                      <option value="b4d954df-3f3a-45f1-8d97-475d51a50170">Mozambique</option>
                      <option value="3b424320-6e09-44ec-888f-9fcdb012d8ab">Myanmar</option>
                      <option value="546877ef-3cc6-4f1c-b585-5e4d82da9292">Namibia</option>
                      <option value="4877696b-5801-4799-9d37-decc1db8820e">Nauru</option>
                      <option value="673373dc-3510-4ff5-946c-0749287f6d00">Nepal</option>
                      <option value="20992dea-989d-4525-bc4c-d41489e65d11">Netherlands</option>
                      <option value="95d7916c-f2d8-48ff-9fef-6d1af5ea2496">New Caledonia</option>
                      <option value="e4b1f40d-1c6c-47fa-93d9-93c2baa3df97">New Zealand</option>
                      <option value="2d26ff9d-dea5-470d-988b-ddbcc9d06d64">Nicaragua</option>
                      <option value="46117fd5-5477-462f-a9f3-3667bee9c4f8">Niger</option>
                      <option value="72aa74ae-8ca7-447c-8a6a-3f4254bd538b">Nigeria</option>
                      <option value="04e2b237-ed84-41ab-935e-25ba87279c2c">Niue</option>
                      <option value="bc743fe9-c759-4eeb-b450-4117c563712a">Norfolk Island</option>
                      <option value="bf494167-850b-48df-aaa2-1cbdb566c398">Northern Mariana Islands</option>
                      <option value="1d303353-9e5d-4324-87e1-e85d56db0655">Norway</option>
                      <option value="984cc9eb-584f-4fe4-852b-199805c1309a">Oman</option>
                      <option value="ff7a424c-c20b-414a-acf7-42a293847c76">Pakistan</option>
                      <option value="749995fc-8786-4c82-a398-a8fa65b576e8">Palau</option>
                      <option value="7309f739-8018-4293-83ad-84ed3cbf4d5b">Palestine</option>
                      <option value="33bf43bc-22a6-47c5-82c7-2748727a14e2">Panama</option>
                      <option value="a2e9ca9c-6ddf-48bb-807b-8864af39bf25">Papua New Guinea</option>
                      <option value="64d295b9-8675-49b7-812a-eccc91a37373">Paraguay</option>
                      <option value="6f8321e3-fe0e-42b8-8f48-84c4ee04adb3">Peru</option>
                      <option value="034001ef-78c4-46a0-ad6c-3d25600463ed">Philippines</option>
                      <option value="17f94316-9e22-46cc-a49b-aadbcd072d39">Pitcairn</option>
                      <option value="89772a3a-3b0e-4dd3-bc92-576a2e965646">Poland</option>
                      <option value="6f7b13bc-c81c-4a0b-b2ae-78940e8a9a24">Portugal</option>
                      <option value="9a05af93-0d87-409f-a913-7699ab6691a6">Puerto Rico</option>
                      <option value="0f2dec27-43b4-46c4-a414-5a265326771a">Qatar</option>
                      <option value="a7579d60-c48c-45db-b8bd-7b00616646a1">Réunion</option>
                      <option value="fe8b972c-2a8e-4a74-8db7-d51cd31162cf">Romania</option>
                      <option value="e9b9795f-5e01-4f66-ba2e-d795bb8fd2d9">Russian Federation</option>
                      <option value="505df7ba-6ec3-4b21-ae80-39f4f7730a64">Rwanda</option>
                      <option value="8c597e01-9b22-430e-ba1d-9adbe936f068">Saint Barthélemy</option>
                      <option value="a9012cbd-8375-4a21-86ee-1e93cad0b60b">Saint Helena</option>
                      <option value="30b277e6-0ce7-4c4b-b43b-270b5848e3f8">Saint Kitts And Nevis</option>
                      <option value="f933f1c4-ef76-47aa-abbb-eeeca57999d4">Saint Lucia</option>
                      <option value="ecb21ee9-caf1-4cfa-bddf-dbc7fe5af4ab">Saint Martin</option>
                      <option value="3f8df5f2-9b11-43d5-8ced-62591d9cbe3f">Saint Pierre And Miquelon</option>
                      <option value="40bcac16-655b-46f2-89a2-244b6c0b6911">Saint Vincent And The Grenadines</option>
                      <option value="0952d5bd-f409-42bf-8081-fc9ce5bd6290">Samoa</option>
                      <option value="6c2e7644-6691-42d2-ae58-301930a87ddc">San Marino</option>
                      <option value="36609002-5154-465a-b0ec-ba5dc307ed41">Sao Tome and Principe</option>
                      <option value="3fbb4595-d939-4c42-991d-053f937f154a">Saudi Arabia</option>
                      <option value="5f7a18b5-63ed-46a7-846a-898ef2c006cc">Senegal</option>
                      <option value="824e8269-80f0-4633-a49e-405e875e50c5">Serbia</option>
                      <option value="05e39521-60f3-4ebf-84df-67104a2dfa16">Seychelles</option>
                      <option value="18ea6416-49d0-446b-bd15-1a8ea1f1fc72">Sierra Leone</option>
                      <option value="f06ec74c-2f35-4eb7-8a1e-80754bcc4fe7">Singapore</option>
                      <option value="5ddfaed8-aa92-4d27-bc76-4a37391d2be4">Sint Maarten</option>
                      <option value="5104577d-2723-408d-bad2-f10de3969cec">Slovakia</option>
                      <option value="15e408ee-9767-430b-9fbc-8d5a48bf1d44">Slovenia</option>
                      <option value="d72b402f-bcaa-409c-a491-8657f2d8a286">Solomon Islands</option>
                      <option value="fabe1d39-6b54-4d6b-b1e3-b0eeb576a0a8">Somalia</option>
                      <option value="b58ab684-2666-4daa-b784-33405026a861">South Africa</option>
                      <option value="bbc63843-ed9e-4dd1-adde-9fd011c0d530">South Sudan</option>
                      <option value="6452324a-748a-457c-86bd-80fc9c956cb2">Spain</option>
                      <option value="24c75bba-abbb-4c55-a744-8fc027f2dc5f">Sri Lanka</option>
                      <option value="539ffabb-7132-4db7-b3f7-fd9ef3f3cded">Sudan</option>
                      <option value="7a06af8d-4983-4e40-96fb-900e553f675e">Suriname</option>
                      <option value="2ac5a8c1-ee9e-4e2a-b8ac-da085051bd17">Svalbard And Jan Mayen</option>
                      <option value="0f6f96fe-5167-4d1f-8a00-d12219e05f54">Swaziland</option>
                      <option value="0bbec087-f223-4a2d-8bed-8bc4e3a8248b">Sweden</option>
                      <option value="859cbf66-4260-476b-a835-fa8907b81af6">Switzerland</option>
                      <option value="e67e2496-4f3b-4690-8986-f99b0fa1c4a0">Syrian Arab Republic</option>
                      <option value="ed14a8b3-9e36-4df5-a887-2ca50c2cb0be">Taiwan, Republic Of China</option>
                      <option value="336543dc-3124-4d72-8ff3-340dfdebe654">Tajikistan</option>
                      <option value="3924df05-5532-4549-b94d-9ffaf67d399b">Tanzania, United Republic of</option>
                      <option value="71fb401f-2ff7-45fa-93ac-4bdc56b8301e">Thailand</option>
                      <option value="8d81564e-5acc-46a2-b09b-88d2c36a0ba0">Timor-Leste</option>
                      <option value="8f31f9e4-fb7f-4a23-9a09-c18847ed3afa">Togo</option>
                      <option value="6e9491cb-f756-4129-ae74-115d25d57cf0">Tokelau</option>
                      <option value="7c8ac7db-cb2d-4778-b91e-e8d55af37ab7">Tonga</option>
                      <option value="44a678d4-eb00-4052-9be4-cecdd4fdad26">Trinidad and Tobago</option>
                      <option value="ff74ef9f-bf87-40df-9b3d-a9fbe8a4d111">Tunisia</option>
                      <option value="6f17e9d7-f961-42f7-ac8a-868951a54c83">Turkey</option>
                      <option value="b2f86f06-232b-44ca-a195-c0af844ca1ad">Turkmenistan</option>
                      <option value="6df61387-8ec1-4127-b798-d8b5ed84f74b">Turks and Caicos Islands</option>
                      <option value="802d435b-d84e-4734-ae50-144e64eaf7cd">Tuvalu</option>
                      <option value="0a8fff19-ade7-4301-ba57-c5e8fd79d9b7">Uganda</option>
                      <option value="f9e1766c-f9eb-450c-96d9-e255d5ca41d5">Ukraine</option>
                      <option value="7c45e098-281d-4d95-a4f4-50b127129d72">United Arab Emirates</option>
                      <option value="7b02eb5e-984e-47dd-ba10-e56e07560ad0">United Kingdom</option>
                      <option value="04192485-2742-4d15-abb4-bacb75546ba9">United States</option>
                      <option value="0e96b2a3-ebcd-484f-b9ad-543bbb8350aa">United States Minor Outlying Islands</option>
                      <option value="62a865bc-111b-4640-b97e-4363ca53a607">Uruguay</option>
                      <option value="1aa45274-e22d-4e56-87cb-8e60f4673a98">Uzbekistan</option>
                      <option value="50b0613b-bdb1-4c84-8a46-d458cab54db1">Vanuatu</option>
                      <option value="a1f164b2-fd55-4361-a278-9af9552e20dd">Venezuela, Bolivarian Republic of</option>
                      <option value="00302cbb-22d3-4399-93c8-b63cd86c8ad9">Vietnam</option>
                      <option value="f1c0176b-c82c-43f8-bc44-da001d1d2c17">Virgin Islands, British</option>
                      <option value="917f3382-2b44-4181-a179-2584d44c6ba8">Virgin Islands, U.S.</option>
                      <option value="4d55b5df-eb6e-4223-824c-67d8fac40a00">Wallis and Futuna</option>
                      <option value="b1f53d09-dadc-4a2a-a5fc-7d8f0ffc9eb2">Western Sahara</option>
                      <option value="44b48ee4-7335-4aeb-8645-6618784e7362">Yemen</option>
                      <option value="d6802862-ab92-4c28-bde6-f584a6a03b29">Zambia</option>
                      <option value="6bb4cde7-3b77-47cc-af5a-eb1d5a6d35b1">Zimbabwe</option>
                   </select>
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-2/4 text-sm font-bold mb-2">Shipping
                   Method<span style="color: red">*</span></label>
                   <select onchange="updateShippingCharge(event)" class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" name="shippingMethod" id="shopemaa_shippingMethod" required>
                      <option selected disabled value="select">Select</option>
                   </select>
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <label class="block w-2/4 text-sm font-bold mb-2">Payment
                   Method<span style="color: red">*</span></label>
                   <select onchange="updatePaymentFee(event)" class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" name="paymentMethod" id="shopemaa_paymentMethod" required>
                      <option selected disabled value="select">Select</option>
                   </select>
                </div>
                <div class="flex mb-6 items-center justify-between border-black">
                   <input class="w-2/4 h-12 py-3 px-4 text-sm placeholder-black font-bold border-2 border-black rounded-md focus:outline-indigo" type="text" name="coupon" id="shopemaa_coupon" placeholder="Coupon Code" />
                   <a onclick="event.preventDefault(); shopemaa.applyDiscount(event)" class="ml-2 group relative inline-block h-12 w-2/4 bg-blueGray-900 rounded-md" href="#">
                      <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                         <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-gray-600">
                            <span class="text-base font-black text-white">Apply</span>
                         </div>
                      </div>
                   </a>
                </div>
             </div>
             <div class="pb-6 mb-6 border-b-2 border-black">
                <div class="flex mb-6 pb-6 items-center justify-between border-b-2 border-black">
                   <span class="text-sm font-bold">Subtotal</span>
                   <span class="text-sm font-black" id="shopemaa_checkout-subtotal">0.00 ${s()}</span>
                </div>
                <div class="flex mb-3 items-center justify-between">
                   <span class="text-sm font-bold">Discount</span>
                   <span class="text-sm font-black" id="shopemaa_checkout-discount" style="color: red">To be calculated</span>
                </div>
                <div class="flex mb-3 items-center justify-between">
                   <span class="text-sm font-bold">Shipping Charge</span>
                   <span class="text-sm font-black" id="shopemaa_checkout-shipping-charge">To be calculated</span>
                </div>
                <div class="flex mb-3 items-center justify-between">
                   <span class="text-sm font-bold">Payment Fee</span>
                   <span class="text-sm font-black" id="shopemaa_checkout-payment-fee">To be calculated</span>
                </div>
             </div>
             <div class="flex mb-6 items-center justify-between">
                <span class="text-lg font-bold">Grand Total</span>
                <span class="text-lg font-black" id="shopemaa_checkout-grand-total">0.00 ${s()}</span>
             </div>
             <button id="shopemaa_completeOrderBtn" type="button" onclick="event.preventDefault(); onCheckout()" class="mb-2 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md">
                <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                   <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-600">
                      <span class="text-base font-black text-white">Complete Order</span>
                   </div>
                </div>
             </button>
             <button style="display: none" id="shopemaa_completingOrderBtn" type="button" class="mb-2 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md">
                <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-400">
                   <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-300">
                      <span class="text-base font-black text-white">Completing order</span>
                   </div>
                </div>
             </button>
             <a onclick="event.preventDefault(); shopemaa.toggleCartView(true); shopemaa.toggleCheckoutView(false); shopemaa.toggleCheckoutBtn(true)" class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                   <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-400">
                      <span class="text-base font-black text-black">Go Back</span>
                   </div>
                </div>
             </a>
          </div>
       </div>
    </form>
 </div>`, a = document.createElement("section");
  a.classList.add("relative"), a.id = "shopemaa_checkoutModal", a.innerHTML += e, document.body.appendChild(a), C(), Y(), Z();
}
function Y() {
  p("query { shippingMethods { id displayName deliveryCharge deliveryTimeInDays WeightUnit isFlat isActive } }").then((a) => {
    a.ok && a.json().then((t) => {
      if (t.data !== null) {
        let o = t.data.shippingMethods, n = document.getElementById(
          "shopemaa_shippingMethod"
        );
        o.forEach((i) => {
          let l = document.createElement("option");
          l.id = i.id, l.value = i.id, i.deliveryTimeInDays === 1 || i.deliveryTimeInDays === 0 ? l.innerText = i.displayName + " (Delivering today)" : l.innerText = i.displayName + ` (Approx. delivery in ${i.deliveryTimeInDays})`, n.appendChild(l);
        });
      }
    }).catch((t) => {
      d(t);
    });
  }).catch((a) => {
    d(a);
  });
}
function Z() {
  p("query { paymentMethods { id displayName currencyName currencySymbol isDigitalPayment } }").then((a) => {
    a.ok && a.json().then((t) => {
      if (t.data !== null) {
        let o = t.data.paymentMethods, n = document.getElementById(
          "shopemaa_paymentMethod"
        );
        o.forEach((i) => {
          let l = document.createElement("option");
          l.id = i.id, l.value = i.id, l.innerText = i.displayName, n.appendChild(l);
        });
      }
    }).catch((t) => {
      d(t);
    });
  }).catch((a) => {
    d(a);
  });
}
function r() {
  return "gray";
}
function d(e) {
  console.log(e);
}
function X() {
  let e = 864e5, a = function() {
    console.log("Performing cart cleanup");
    let t = c(), o = 1e3 * 60 * 60 * 24, n = t.initAt;
    n == null && h(), (/* @__PURE__ */ new Date()).getMilliseconds() - n >= o && h();
  };
  setInterval(a, e), a();
}
function ee() {
  let e = document.getElementById("shopemaa_orderModal");
  e !== null && e.remove();
}
function ae(e) {
  let a = `<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 pb-3">
          <div class="relative ml-auto w-full h-full max-w-lg bg-white">
              <div class="p-6 border-b-2 border-black">
                  <h3 class="text-2xl font-bold text-center">Thank you for your order!</h3>
              </div>

              <div class="px-6 pb-3">
                  <div class="pb-6 pt-3">
                      We have received your order and it will be processed accordingly.
                  </div>
              </div>
              
              <div class="px-6 mb-10 pb-3">
                  <div class="pb-1 mb-1">
                      <b>OrderHash :</b> ` + e.hash + `
                  </div>
                  <div class="pb-1 mb-1">
                      <b>Status :</b> ` + e.status + `
                  </div>
                  <div class="pb-1 mb-1">
                      <b>Payment Status :</b> ` + e.paymentStatus + `
                  </div>
                  <div class="pb-1 mb-1">
                      <b>Grand Total :</b> ` + (e.grandTotal / 100).toFixed(2) + " " + s() + `
                  </div>
              </div>
              
              <div class="px-6 mb-10 pb-3">
                  <a onclick="event.preventDefault(); shopemaa.hideOrderDetailsModal()" class="pr-5 pl-5 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                    <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                       <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-400">
                          <span class="text-base font-black text-black">Continue Shopping</span>
                       </div>
                    </div>
                  </a>
              </div>
          </div>
      </div>`, t = document.createElement("section");
  t.classList.add("relative"), t.id = "shopemaa_orderModal", t.innerHTML += a, document.body.appendChild(t);
}
function M() {
  let e = document.getElementById("shopemaa_orderSearchModal");
  e !== null && e.remove();
}
function te() {
  let e = document.getElementById("shopemaa_order-hash").value, a = document.getElementById("shopemaa_customer-email").value, t = `query { orderByCustomerEmail(hash: "${e}", email: "${a}") { id hash shippingCharge paymentProcessingFee subtotal grandTotal discountedAmount status paymentStatus createdAt updatedAt billingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } shippingAddress { id street streetTwo city state postcode email phone location { id name shortCode } } cart { isShippingRequired cartItems { product { id name slug description fullImages isDigitalProduct productUnit } quantity purchasePrice attributes { name selectedValue } variation { id name price sku stock } } } customer { email phone firstName lastName profilePicture } paymentMethod { id displayName currencyName currencySymbol isDigitalPayment } shippingMethod { id displayName deliveryCharge deliveryTimeInDays WeightUnit isFlat isActive } couponCode { code } payments { isPaid payableAmount gatewayName } } }`;
  p(t).then((o) => {
    o.ok && o.json().then((n) => {
      n.data !== null && (M(), ae(
        n.data.orderByCustomerEmail
      ));
    }).catch((n) => {
      d(n);
    });
  }).catch((o) => {
    d(o);
  });
}
function oe() {
  let e = `<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 pb-3">
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
                  <a onclick="event.preventDefault(); shopemaa.getOrderDetails()" class="pr-5 pl-5 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                    <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                       <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-400">
                          <span class="text-base font-black text-black">Get Details</span>
                       </div>
                    </div>
                  </a>
                  <a onclick="event.preventDefault(); shopemaa.hideOrderSearchModal()" class="pt-2 mt-2 pr-5 pl-5 group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                    <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                       <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + r() + `-100">
                          <span class="text-base font-black text-black">Cancel</span>
                       </div>
                    </div>
                  </a>
              </div>
          </div>
      </div>`, a = document.createElement("section");
  a.classList.add("relative"), a.id = "shopemaa_orderSearchModal", a.innerHTML += e, document.body.appendChild(a);
}
(async function() {
  typeof window < "u" && (window.shopemaa = window.shopemaa || {}, window.shopemaa.hideOrderSearchModal = M, window.shopemaa.getOrderDetails = te, window.shopemaa.onGotoCheckout = K, window.shopemaa.toggleCartView = v, window.shopemaa.applyDiscount = Q, window.shopemaa.hideOrderDetailsModal = ee, window.shopemaa.toggleCheckoutView = W, window.shopemaa.toggleCheckoutBtn = u);
})();
export {
  ne as initShopemaa
};
