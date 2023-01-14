function initShopemaa(key, secret) {
    setStoreKey(key);
    setStoreSecret(secret);
    getAndSaveStoreInfo();
    initiateBucket();
    findAndBindBtns();
}

function setStoreKey(key) {
    localStorage.setItem('shopemaa_store_key', key);
}

function getStoreKey() {
    return localStorage.getItem('shopemaa_store_key');
}

function setStoreSecret(secret) {
    localStorage.setItem('shopemaa_store_secret', secret);
}

function getStoreSecret() {
    return localStorage.getItem('shopemaa_store_secret');
}

function initiateBucket() {
    if (localStorage.getItem('shopemaaCheckoutBucket') === null) {
        let newBucket = {
            'cartId': null,
            'items': [],
            'shippingCharge': 0,
            'paymentFee': 0,
            'discount': 0
        }
        localStorage.setItem('shopemaaCheckoutBucket', JSON.stringify(newBucket))
    }
}

function getBucket() {
    let bucket = localStorage.getItem('shopemaaCheckoutBucket');
    if (bucket === null) {
        initiateBucket();
        bucket = localStorage.getItem('shopemaaCheckoutBucket');
    }
    return JSON.parse(bucket);
}

function updateBucket(bucket) {
    bucket.items = bucket.items.sort((a, b) => a.orderIndex - b.orderIndex);
    localStorage.setItem('shopemaaCheckoutBucket', JSON.stringify(bucket))
}

function findAndBindBtns() {
    findAndBindBuyBtns();
    findAndBindCartBtn();
}

function findAndBindBuyBtns() {
    $('.shopemaa-buy-btn').click(function () {
        let productId = $(this).data('productId');
        addToCart(productId);
    })
}

function findAndBindCartBtn() {
    $('shopemaa-cart-btn').click(function () {
        toggleCartView(true);
    });
}

function addToCart(productId) {
    getProductById(productId).then(resp => {
        if (!resp.ok) {
            // handle error
            return
        }
        resp.json().then(productData => {
            let product = productData.data.product;
            addToCartWithChange(product, 1);
        }).catch(err => {
            logErr(err);
        })
    }).catch(err => {
        logErr(err);
    });
}

function updateItemFromCart(product, change) {
    let bucket = getBucket();
    bucket.items.forEach(item => {
        let eleId = `cart_item_${item.id}`
        let ele = document.getElementById(eleId);
        if (ele !== null && ele !== undefined) {
            ele.remove();
        }
    });
    addToCartWithChange(product, change);
}

function addToCartWithChange(product, change) {
    let bucket = getBucket();
    let productInBucket = bucket.items.find(p => p.id === product.id);
    if (productInBucket === undefined || productInBucket === null) {
        bucket.items.push({
            'id': product.id,
            'name': product.name,
            'stock': product.stock,
            'qty': 1,
            'fullImages': product.fullImages,
            'productSpecificDiscount': product.productSpecificDiscount,
            'price': product.price,
            'orderIndex': bucket.items.length + 1,
        })
    } else {
        if (productInBucket.qty + change <= product.stock) {
            productInBucket.qty += change;
            bucket.items = bucket.items.filter(p => p.id !== product.id);
            if (productInBucket.qty > 0) {
                bucket.items.push(productInBucket);
            }
        }
    }

    updateBucket(bucket);
    toggleCartView(true);
}

function getProductById(productId) {
    let payload = `query { product(productId: "${productId}") { id name price stock fullImages productSpecificDiscount attributes { id name values isRequired } } }`
    return sendRequest(payload);
}

function sendRequest(payload) {
    return fetch(getApiUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'store-key': getStoreKey(),
            'store-secret': getStoreSecret()
        },
        body: JSON.stringify({
            'query': payload
        })
    })
}

function getApiUrl() {
    return 'https://api.shopemaa.com/query';
}

function getAndSaveStoreInfo() {
    let payload = `query { storeBySecret { name title description currency isOpen } }`;
    sendRequest(payload).then(resp => {
        if (resp.ok) {
            resp.json().then(storeData => {
                localStorage.setItem('shopemaaStoreInfo', JSON.stringify(storeData.data.storeBySecret));
            }).catch(err => {
                logErr(err);
            });
        }
    }).catch(err => {
        logErr(err);
    });
}

function getStoreInfo() {
    return JSON.parse(localStorage.getItem('shopemaaStoreInfo'));
}

function getCurrency() {
    return getStoreInfo().currency;
}

function calculateProductPrice(product) {
    let price = product.price;
    if (product.productSpecificDiscount !== 0) {
        price = price - ((product.productSpecificDiscount * price) / 100);
    }
    return price;
}

// updates cart subtotal
function updateSubtotalView() {
    let subtotal = 0;
    getBucket().items.forEach(item => {
        subtotal += (item.qty * calculateProductPrice(item));
    })
    document.getElementById('cart-subtotal').innerText = (subtotal / 100).toFixed(2) + ' ' + getCurrency();
}

// updates cart grand total
function updateGrandTotalView() {
    let bucket = getBucket();
    let subtotal = 0;
    bucket.items.forEach(item => {
        subtotal += (item.qty * calculateProductPrice(item));
    })
    let grandTotal = subtotal;
    document.getElementById('cart-grand-total').innerText = (grandTotal / 100).toFixed(2) + ' ' + getCurrency();
}

function toggleCartView(show) {
    if (show) {
        let cartModel = document.getElementById('cartModal');
        if (cartModel === undefined || cartModel === null) {
            createCartModalSection();
        }

        let cartItemsView = document.getElementById('cartItemsView');
        getBucket().items.forEach(item => {
            cartItemsView.appendChild(createCartItem(item));

            let qtyMinusBtn = document.getElementById(`qty_minus_${item.id}`);
            qtyMinusBtn.onclick = function () {
                updateItemFromCart(item, -1);
            }

            let qtyPlusBtn = document.getElementById(`qty_plus_${item.id}`);
            qtyPlusBtn.onclick = function () {
                updateItemFromCart(item, 1);
            }
        })

        updateSubtotalView();
        updateGrandTotalView();
    } else {
        let cartModel = document.getElementById('cartModal');
        if (cartModel !== null && cartModel !== undefined) {
            cartModel.remove();
        }
    }
}

function createCartItem(product) {
    let img = product.fullImages[0];
    let price = calculateProductPrice(product);

    let qtyMinus = document.createElement('button');
    qtyMinus.classList.add("flex", "w-3.5", "h-3.5", "px-px", "items-center", "justify-center", "bg-black", "hover:bg-indigo-500", "rounded", "transition", "duration-100")
    qtyMinus.innerHTML = `<div class="h-px mx-px w-full bg-white"></div>`;
    qtyMinus.id = `qty_minus_${product.id}`;

    let qtyPlus = document.createElement('button');
    qtyPlus.classList.add("flex", "w-3.5", "h-3.5", "px-px", "items-center", "justify-center", "bg-black", "hover:bg-indigo-500", "rounded", "transition", "duration-100")
    qtyPlus.innerHTML = `<div class="relative h-full w-full py-px"> <div class="absolute top-1/2 left-0 h-px w-full bg-white"></div> <div class="inline-block max-w-max mx-auto h-full bg-white"> <div class="inline-block px-px"></div> </div> </div>`;
    qtyPlus.id = `qty_plus_${product.id}`;

    let layout = `<div class="flex mb-6 justify-between items-center">
                        <div class="flex-grow flex flex-wrap -mx-2">
                            <div class="w-full xs:w-auto px-2 mb-2 xs:mb-0">
                                <img class="w-24 h-full max-h-24 border-2 border-black rounded-md shadow p-1"
                                     src="${img}">
                            </div>
                            <div class="w-full xs:w-auto px-2">
                                <h4 class="text-base font-bold mb-2">${product.name}</h4>
                                <div class="flex h-12 w-24 px-2 items-center justify-between bg-white border-2 border-black rounded-md">
                                    ` + qtyMinus.outerHTML + `
                                    <input disabled class="w-10 text-center text-sm font-bold placeholder-black text-black outline-none"
                                           type="number" value="${product.qty}">
                                    ` + qtyPlus.outerHTML + `
                                </div>
                            </div>
                        </div>
                        <div class="w-auto">
                            <span class="text-xl font-bold">${(price / 100).toFixed(2)} ${getCurrency()}</span>
                        </div>
                    </div>`;
    let layoutEle = document.createElement('div');
    layoutEle.id = `cart_item_${product.id}`;
    layoutEle.innerHTML = layout;
    return layoutEle;
}

function createCartModalSection() {
    let cartModalSection = `<div class="fixed overflow-y-auto z-50 top-0 left-0 w-full h-full bg-gray-900 bg-opacity-80 pb-3">
            <div class="relative ml-auto w-full max-w-lg bg-white">
                <div class="p-6 border-b-2 border-black">
                    <h3 class="text-2xl font-bold">Your Cart</h3>
                </div>
                <div id="cartItemsView" class="p-6 mb-6 border-b-2 border-black"></div>

                <div class="px-6 mb-10 pb-3">
                    <div class="pb-6 mb-6 border-b-2 border-black">
                        <div class="flex mb-6 pb-6 items-center justify-between border-b-2 border-black">
                            <span class="text-sm font-bold">Subtotal</span>
                            <span class="text-sm font-black" id="cart-subtotal">0.00 ` + getCurrency() + `</span>
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
                        <span class="text-lg font-black" id="cart-grand-total">0.00 ` + getCurrency() + `</span>
                    </div>

                    <a onclick="event.preventDefault(); onGotoCheckout()"
                       class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md" href="#">
                        <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                            <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + getThemeColor() + `-600">
                                <span class="text-base font-black text-white">Checkout</span>
                            </div>
                        </div>
                    </a>

                    <a onclick="event.preventDefault(); toggleCartView(false);"
                       class="group relative inline-block h-12 w-full bg-blueGray-900 rounded-md mt-2" href="#">
                        <div class="absolute top-0 left-0 transform -translate-y-1 -translate-x-1 w-full h-full group-hover:translate-y-0 group-hover:translate-x-0 transition duration-300">
                            <div class="flex h-full w-full items-center justify-center border-2 border-black rounded-md transition duration-300 bg-` + getThemeColor() + `-400">
                                <span class="text-base font-black text-black">Continue Shopping</span>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>`;

    let cartSection = document.createElement('section');
    cartSection.classList.add('relative');
    cartSection.id = 'cartModal';
    cartSection.innerHTML += cartModalSection;
    document.body.appendChild(cartSection);
}

function getThemeColor() {
    return "orange";
}

function logErr(err) {
    console.log(err)
}
