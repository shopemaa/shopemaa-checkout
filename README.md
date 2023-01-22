# Shopemaa Checkout

Embeddable cart and checkout using Shopemaa to add checkout to any website.

#### Add below code snippet to head block of HTML of your site.

```html

<link rel="stylesheet" href="https://shopemaa.link/themes/monalisa/css/tailwind/tailwind.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
<script src="https://shopemaa.link/themes/monalisa/js/main.js"></script>
<script src="https://js.stripe.com/v3/"></script>
<script src="https://cdn.jsdelivr.net/gh/shopemaa/shopemaa-checkout@v0.0.6/shopemaa.js"></script>
```

### Initialize

Then call `initShopemaa` with your Store App key & Store App secret

```js
initShopemaa("YOUR_STORE_APP_KEY", "YOUR_STORE_APP_SECRET");
```

### Example

* Add to cart button using class `shopemaa-buy-btn`

```html
<a class="shopemaa-buy-btn" data-product-id="{{ PRODUCT_ID }}">Add to Cart</a>
```

* Show cart button using class `shopemaa-cart-btn`

```html
<a class="shopemaa-cart-btn">Show Cart</a>
```

* Track order button using class `shopemaa-order-track-btn`

```html
<a class="shopemaa-order-track-btn">Track Order</a>
```

* Show cart items count using class `shopemaa-cart-items-count`

```html
<span class="shopemaa-cart-items-count">0</span>
```

* Increment stock using class `shopemaa-stock-up`

```html

<button class="shopemaa-stock-up" data-product-id="{{ PRODUCT_ID }}">-
</button>
```

* Decrement stock using class `shopemaa-stock-down`

```html

<button class="shopemaa-stock-down" data-product-id="{{ PRODUCT_ID }}">-
</button>
```

* Show specific product items count using class `shopemaa-cart-item-qty`

```html
<span class="shopemaa-cart-item-qty" data-product-id="{{ PRODUCT_ID }}">0</span>
```

Check [index.html](./examples/index.html) from examples directory.

### Integration Demo

* [Hugo Static Site Generator](https://github.com/shopemaa/hargo-hugo)

Copyright © 2023 [Shopemaa LLC](https://shopemaa.com)
