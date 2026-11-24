# HKS Holding store

Plain HTML + CSS + JavaScript storefront with a small Node.js (Express) API.

## Run
    npm install
    npm start        # http://localhost:3000

## Structure
    public/index.html      page shell
    public/css/style.css   all styles
    public/js/images.js    product photos (embedded)
    public/js/app.js       store logic: catalogue, cart, wishlist, checkout, orders,
                           tracking, invoice (PDF / print), accounts, coupons, stock
    server.js              Express API: POST /api/orders, GET /api/orders/:id,
                           POST /api/contact, POST /api/newsletter  (saved in data/*.json)

## Edit before launch (top of public/js/app.js → CONFIG)
phone, email, address, gstin, fssai, whatsapp, instagram, facebook (replace the placeholder links).

The site also works by opening public/index.html directly; without the server,
data stays in the browser (localStorage).
