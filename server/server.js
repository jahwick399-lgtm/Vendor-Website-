require('dotenv').config({ path: __dirname + '/.env' })

const express = require('express')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()
const PORT = process.env.PORT || 10000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ─── Stripe Price IDs ──────────────────────────────────────────────────────────
const PRICE_IDS = {
  electronics: process.env.STRIPE_PRICE_ELECTRONICS,
  shoes:       process.env.STRIPE_PRICE_SHOES,
  jewelry:     process.env.STRIPE_PRICE_JEWELRY,
  hoodies:     process.env.STRIPE_PRICE_HOODIES,
  clothing:    process.env.STRIPE_PRICE_CLOTHING,
  fragrance:   process.env.STRIPE_PRICE_FRAGRANCE,
  watches:     process.env.STRIPE_PRICE_WATCHES,
  bundle:      process.env.STRIPE_PRICE_BUNDLE,
}

// ─── Vendor Content ─────────────────────────────────────────────────────────────
// Returned only after Stripe payment is verified as paid.
const VENDOR_CONTENT = {

  electronics: {
    title: '📱 Electronics Vendor',
    intro: 'Direct supplier links. Buy at these prices, resell for 2–5x on eBay, Facebook, Offerup.',
    sections: [
      {
        name: '📱 Phones',
        items: [
          { name: 'iPhone',         price: '$10',  url: 'https://usfans.com/product/3/7722115604?ref=KRYFUS' },
          { name: 'iPhone',         price: '$14',  url: 'https://usfans.com/product/3/7719050755?ref=KRYFUS' },
          { name: 'iPhone 16 Plus', price: '$208', url: 'https://usfans.com/product/3/7722052392?ref=KRYFUS' },
          { name: 'Samsung S25',    price: '$148', url: 'https://usfans.com/product/3/7722046568?ref=KRYFUS' },
          { name: 'Samsung S24',    price: '$148', url: 'https://usfans.com/product/3/7722015174?ref=KRYFUS' },
        ],
      },
      {
        name: '🎧 Earbuds & Headphones',
        items: [
          { name: 'AirPods',                price: '$41',  url: 'https://usfans.com/product/3/7722078124?ref=KRYFUS' },
          { name: 'AirPods (alt)',           price: '$215', url: 'https://usfans.com/product/3/7722115612?ref=KRYFUS' },
          { name: 'Wired Earphones',         price: '$7',   url: 'https://usfans.com/product/3/7719121715?ref=KRYFUS' },
          { name: 'Max Earphones',           price: '$72',  url: 'https://usfans.com/product/3/7719064363?ref=KRYFUS' },
          { name: 'Bose Ultra Open Earbuds', price: '$22',  url: 'https://usfans.com/product/3/7722046570?ref=KRYFUS' },
          { name: 'Samsung Buds 3 Pro',      price: '$20',  url: 'https://usfans.com/product/3/7722099768?ref=KRYFUS' },
          { name: 'Samsung Buds 2 Pro',      price: '$26',  url: 'https://usfans.com/product/3/7721997398?ref=KRYFUS' },
        ],
      },
      {
        name: '🔊 Speakers',
        items: [
          { name: 'JBL Flip 5',  price: '$21', url: 'https://usfans.com/product/3/7718977567?ref=KRYFUS' },
          { name: 'JBL Flip 6',  price: '$24', url: 'https://usfans.com/product/3/7719109765?ref=KRYFUS' },
          { name: 'JBL Pulse',   price: '$24', url: 'https://usfans.com/product/3/7722085972?ref=KRYFUS' },
          { name: 'JBL Pulse 6', price: '$37', url: 'https://usfans.com/product/3/7722089886?ref=KRYFUS' },
          { name: 'Bose BFlex',  price: '$40', url: 'https://usfans.com/product/3/7719052691?ref=KRYFUS' },
        ],
      },
      {
        name: '💈 Dyson & Grooming',
        items: [
          { name: 'Dyson HD 16',                price: '$120', url: 'https://usfans.com/product/3/7721989378?ref=KRYFUS' },
          { name: 'Dyson HD 15',                price: '$118', url: 'https://usfans.com/product/3/7722044614?ref=KRYFUS' },
          { name: 'Dyson HD 08',                price: '$34',  url: 'https://usfans.com/product/3/7719052693?ref=KRYFUS' },
          { name: 'Dyson HD 07',                price: '$92',  url: 'https://usfans.com/product/3/7722036980?ref=KRYFUS' },
          { name: 'Dyson HT 01',                price: '$92',  url: 'https://usfans.com/product/3/7719091943?ref=KRYFUS' },
          { name: 'Dyson 03',                   price: '$92',  url: 'https://usfans.com/product/3/7722097826?ref=KRYFUS' },
          { name: 'Dyson Baby Electric Clippers',price: '$110', url: 'https://usfans.com/product/3/7719013277?ref=KRYFUS' },
          { name: 'Dyson Comb',                 price: '$31',  url: 'https://usfans.com/product/3/7722054366?ref=KRYFUS' },
        ],
      },
      {
        name: '📱 Phone Cases & Accessories',
        items: [
          { name: 'Phone Case', price: '$8',  url: 'https://usfans.com/product/3/7719076199?ref=KRYFUS' },
          { name: 'Phone Case', price: '$8',  url: 'https://usfans.com/product/3/7719121721?ref=KRYFUS' },
          { name: 'Phone Case', price: '$14', url: 'https://usfans.com/product/3/7722078136?ref=KRYFUS' },
          { name: 'Phone Case', price: '$14', url: 'https://usfans.com/product/3/7740212963?ref=KRYFUS' },
          { name: 'Phone Case', price: '$31', url: 'https://usfans.com/product/3/7722054366?ref=KRYFUS' },
        ],
      },
    ],
  },

  shoes: {
    title: '👟 Shoes Vendor',
    intro: 'Supplier access for sneakers and designer footwear. Open each link and message the seller directly.',
    sections: [
      {
        name: '👟 Sneakers & Designer Shoes',
        items: [
          { name: 'Yeezys',              price: '$15',  url: 'https://usfans.com/product/3/7718989217?ref=KRYFUS' },
          { name: 'New Balance 9060',    price: null,   url: 'https://usfans.com/product/3/7719062003?ref=KRYFUS' },
          { name: 'Jordan 4',            price: null,   url: 'https://usfans.com/product/3/7722016708?ref=KRYFUS' },
          { name: 'Air Force 1s',        price: null,   url: 'https://usfans.com/product/3/7722053942?ref=KRYFUS' },
          { name: 'Panda Dunks',         price: null,   url: 'https://usfans.com/product/3/7718969299?ref=KRYFUS' },
          { name: 'Yeezy 350 Boost',     price: '$53',  url: 'https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7473253975&affcode=DR88KK' },
          { name: 'Balenciaga Track',    price: '$178', url: 'https://www.kakobuy.com/item/details?url=https%3A%2F%2Fweidian.com%2Fitem.html%3FitemID%3D7475167760&affcode=DR88KK' },
          { name: 'Fuzzy Slides',        price: null,   url: 'https://usfans.com/product/3/7719016845?ref=KRYFUS' },
          { name: 'Gucci Slides',        price: null,   url: 'https://usfans.com/product/3/7721998914?ref=KRYFUS' },
          { name: 'Bapesta',             price: null,   url: 'https://usfans.com/product/3/7722028658?ref=KRYFUS' },
          { name: 'Bapesta (alt)',        price: null,   url: 'https://usfans.com/product/3/7722052020?ref=KRYFUS' },
          { name: 'LV Trainer',          price: null,   url: 'https://usfans.com/product/3/7721963342?ref=KRYFUS' },
          { name: 'Lanvin Curb',         price: null,   url: 'https://usfans.com/product/3/7722001438?ref=KRYFUS' },
          { name: 'Mason Mihara',        price: null,   url: 'https://usfans.com/product/3/7742414919?ref=KRYFUS' },
        ],
      },
    ],
  },

  jewelry: {
    title: '💎 Jewelry Vendor',
    intro: 'High-margin jewelry at supplier pricing. Flip for 5–10x on Depop, Instagram, and local.',
    sections: [
      {
        name: '💎 Jewelry Catalog',
        items: [
          { name: 'Full Jewelry Catalog — Browse All Products', price: null, url: 'https://jewelryresell.com' },
        ],
      },
      {
        name: '🔗 Individual Pieces',
        items: [
          { name: 'LV Slim Bracelet',  price: '$35', url: 'https://usfans.com/product/3/7722032868?ref=KRYFUS' },
          { name: 'Vancleef Bracelet', price: '$15', url: 'https://usfans.com/product/3/7719088065?ref=KRYFUS' },
          { name: 'Vancleef Necklace', price: '$9',  url: 'https://usfans.com/product/3/7719056589?ref=KRYFUS' },
        ],
      },
    ],
  },

  hoodies: {
    title: '🧥 Hoodie Vendor',
    intro: 'Designer hoodies at supplier cost. Top-selling resell category on every platform.',
    sections: [
      {
        name: '🕷 Sp5der',
        items: [
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722032010?ref=KRYFUS' },
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722036950?ref=KRYFUS' },
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722011630?ref=KRYFUS' },
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722011614?ref=KRYFUS' },
        ],
      },
      {
        name: '🖤 Chrome Hearts & Hellstar',
        items: [
          { name: 'Chrome Hearts Hoodie', price: '$45', url: 'https://usfans.com/product/3/7719099133?ref=KRYFUS' },
          { name: 'Hellstar Hoodie',      price: '$25', url: 'https://usfans.com/product/3/7722043738?ref=KRYFUS' },
        ],
      },
      {
        name: '🦇 Bape',
        items: [
          { name: 'Bape Hoodie', price: '$45', url: 'https://usfans.com/product/3/7719100785?ref=KRYFUS' },
        ],
      },
      {
        name: '🟤 Essentials',
        items: [
          { name: 'Essentials Hoodie', price: '$30', url: 'https://usfans.com/product/3/7722029390?ref=KRYFUS' },
          { name: 'Essentials Hoodie', price: '$30', url: 'https://usfans.com/product/3/7722001566?ref=KRYFUS' },
          { name: 'Essentials Hoodie', price: '$30', url: 'https://usfans.com/product/3/7722043734?ref=KRYFUS' },
        ],
      },
      {
        name: '👖 Denim Tears',
        items: [
          { name: 'Denim Tears Hoodie', price: '$50', url: 'https://usfans.com/product/3/7722013690?ref=KRYFUS' },
          { name: 'Denim Tears Hoodie', price: '$50', url: 'https://usfans.com/product/3/7722013692?ref=KRYFUS' },
          { name: 'Denim Tears Hoodie', price: '$50', url: 'https://usfans.com/product/3/7722013694?ref=KRYFUS' },
        ],
      },
      {
        name: '🏔 North Face',
        items: [
          { name: 'North Face Puffer', price: '$52', url: 'https://usfans.com/product/3/7722009206?ref=KRYFUS' },
          { name: 'North Face Puffer', price: '$52', url: 'https://usfans.com/product/3/7722009208?ref=KRYFUS' },
          { name: 'North Face Puffer', price: '$52', url: 'https://usfans.com/product/3/7722009210?ref=KRYFUS' },
        ],
      },
      {
        name: '🦅 Moncler & Trapstar',
        items: [
          { name: 'Moncler Puffer', price: '$50', url: 'https://usfans.com/product/3/7722009212?ref=KRYFUS' },
          { name: 'Trapstar',       price: '$40', url: 'https://usfans.com/product/3/7722043736?ref=KRYFUS' },
        ],
      },
    ],
  },

  fragrance: {
    title: '🌸 Fragrance Vendor',
    intro: 'Designer colognes and perfumes at supplier pricing. Easy flip, high demand year-round.',
    sections: [
      {
        name: '🌸 Cologne & Perfume',
        items: [
          { name: 'Creed Aventus',   price: '$38', url: 'https://usfans.com/product/3/7719011247?ref=KRYFUS' },
          { name: 'Tom Ford',        price: null,  url: 'https://usfans.com/product/3/7722009158?ref=KRYFUS' },
          { name: 'Versace Eros',    price: '$10', url: 'https://usfans.com/product/3/7702706002?ref=KRYFUS' },
          { name: 'Bleu de Chanel',  price: '$20', url: 'https://usfans.com/product/3/7722070086?ref=KRYFUS' },
          { name: 'Valentino',       price: '$20', url: 'https://usfans.com/product/3/7718995399?ref=KRYFUS' },
          { name: 'Gucci',           price: null,  url: 'https://usfans.com/product/3/7719038955?ref=KRYFUS' },
          { name: 'Dior Perfume',    price: null,  url: 'https://usfans.com/product/3/7719109711?ref=KRYFUS' },
          { name: 'Dior Sauvage',    price: null,  url: 'https://usfans.com/product/3/7719003323?ref=KRYFUS' },
        ],
      },
    ],
  },

  watches: {
    title: '⌚ Watches Vendor',
    intro: 'Watches at supplier pricing. Flip on eBay, Depop, and Facebook Marketplace.',
    sections: [
      {
        name: '⌚ Casio',
        items: [
          { name: 'Casio Watch', price: '$17', url: 'https://usfans.com/product/3/7722023114?ref=KRYFUS' },
          { name: 'Casio Watch', price: '$20', url: 'https://usfans.com/product/3/7719017201?ref=KRYFUS' },
          { name: 'Casio Watch', price: '$22', url: 'https://usfans.com/product/3/7719107821?ref=KRYFUS' },
          { name: 'Casio Watch', price: '$25', url: 'https://usfans.com/product/3/7722023116?ref=KRYFUS' },
          { name: 'Casio Watch', price: '$28', url: 'https://usfans.com/product/3/7722023118?ref=KRYFUS' },
          { name: 'Casio Watch', price: '$35', url: 'https://usfans.com/product/3/7722023120?ref=KRYFUS' },
          { name: 'Casio Watch', price: '$44', url: 'https://usfans.com/product/3/7722023122?ref=KRYFUS' },
        ],
      },
      {
        name: '🕐 Tissot',
        items: [
          { name: 'Tissot PRX',          price: null, url: 'https://usfans.com/product/3/7719017203?ref=KRYFUS' },
          { name: 'Tissot PRX II',       price: null, url: 'https://usfans.com/product/3/7719017205?ref=KRYFUS' },
          { name: 'Tissot PRX 40',       price: null, url: 'https://usfans.com/product/3/7719017207?ref=KRYFUS' },
          { name: 'Tissot PRX Powermatic',price: null, url: 'https://usfans.com/product/3/7719017209?ref=KRYFUS' },
          { name: 'Tissot T-Race',       price: null, url: 'https://usfans.com/product/3/7719017211?ref=KRYFUS' },
          { name: 'Tissot Le Locle',     price: null, url: 'https://usfans.com/product/3/7719017213?ref=KRYFUS' },
          { name: 'Tissot Seastar',      price: null, url: 'https://usfans.com/product/3/7719017215?ref=KRYFUS' },
          { name: 'Tissot Gentleman',    price: null, url: 'https://usfans.com/product/3/7719017217?ref=KRYFUS' },
        ],
      },
      {
        name: '👑 Rolex',
        items: [
          { name: 'Rolex Daytona',       price: '$75', url: 'https://usfans.com/product/3/7719107823?ref=KRYFUS' },
          { name: 'Rolex Daytona (alt)', price: '$75', url: 'https://usfans.com/product/3/7719107825?ref=KRYFUS' },
          { name: 'Rolex Daytona (alt)', price: '$75', url: 'https://usfans.com/product/3/7719107827?ref=KRYFUS' },
          { name: 'Rolex GMT-Master II', price: '$75', url: 'https://usfans.com/product/3/7719107829?ref=KRYFUS' },
          { name: 'Rolex GMT-Master II (alt)', price: '$75', url: 'https://usfans.com/product/3/7719107831?ref=KRYFUS' },
          { name: 'Rolex Datejust',      price: '$75', url: 'https://usfans.com/product/3/7719107833?ref=KRYFUS' },
          { name: 'Rolex Datejust (alt)',price: '$75', url: 'https://usfans.com/product/3/7719107835?ref=KRYFUS' },
          { name: 'Rolex Datejust (alt)',price: '$75', url: 'https://usfans.com/product/3/7719107837?ref=KRYFUS' },
          { name: 'Rolex Submariner',    price: '$75', url: 'https://usfans.com/product/3/7719107839?ref=KRYFUS' },
          { name: 'Rolex Explorer II',   price: '$75', url: 'https://usfans.com/product/3/7719107841?ref=KRYFUS' },
          { name: 'Rolex Deepsea',       price: '$75', url: 'https://usfans.com/product/3/7719107843?ref=KRYFUS' },
        ],
      },
      {
        name: '🌊 Omega',
        items: [
          { name: 'Omega Seamaster',      price: null, url: 'https://usfans.com/product/3/7719017219?ref=KRYFUS' },
          { name: 'Omega Speedmaster',    price: null, url: 'https://usfans.com/product/3/7719017221?ref=KRYFUS' },
          { name: 'Omega Constellation',  price: null, url: 'https://usfans.com/product/3/7719017223?ref=KRYFUS' },
          { name: 'Omega De Ville',       price: null, url: 'https://usfans.com/product/3/7719017225?ref=KRYFUS' },
          { name: 'Omega Planet Ocean',   price: null, url: 'https://usfans.com/product/3/7719017227?ref=KRYFUS' },
          { name: 'Omega Aqua Terra 150M',price: null, url: 'https://usfans.com/product/3/7719017229?ref=KRYFUS' },
        ],
      },
      {
        name: '⚓ Longines',
        items: [
          { name: 'Longines Conquest',         price: null, url: 'https://usfans.com/product/3/7719017231?ref=KRYFUS' },
          { name: 'Longines HydroConquest',    price: null, url: 'https://usfans.com/product/3/7719017233?ref=KRYFUS' },
          { name: 'Longines HydroConquest (alt)',price: null, url: 'https://usfans.com/product/3/7719017235?ref=KRYFUS' },
          { name: 'Longines Master Collection', price: null, url: 'https://usfans.com/product/3/7719017237?ref=KRYFUS' },
        ],
      },
      {
        name: '💎 Audemars Piguet',
        items: [
          { name: 'AP Royal Oak',        price: null, url: 'https://usfans.com/product/3/7719017239?ref=KRYFUS' },
          { name: 'AP Royal Oak (alt)',   price: null, url: 'https://usfans.com/product/3/7719017241?ref=KRYFUS' },
          { name: 'AP Royal Oak Offshore',price: null, url: 'https://usfans.com/product/3/7719017243?ref=KRYFUS' },
          { name: 'AP Millenary',        price: null, url: 'https://usfans.com/product/3/7719017245?ref=KRYFUS' },
        ],
      },
      {
        name: '🏆 Patek Philippe',
        items: [
          { name: 'Patek Philippe Nautilus',     price: null, url: 'https://usfans.com/product/3/7719017247?ref=KRYFUS' },
          { name: 'Patek Philippe Aquanaut',     price: null, url: 'https://usfans.com/product/3/7719017249?ref=KRYFUS' },
          { name: 'Patek Philippe Calatrava',    price: null, url: 'https://usfans.com/product/3/7719017251?ref=KRYFUS' },
        ],
      },
      {
        name: '🔱 Vacheron Constantin',
        items: [
          { name: 'Vacheron Overseas',    price: null, url: 'https://usfans.com/product/3/7719017253?ref=KRYFUS' },
          { name: 'Vacheron Patrimony',   price: null, url: 'https://usfans.com/product/3/7719017255?ref=KRYFUS' },
        ],
      },
      {
        name: '✈️ IWC',
        items: [
          { name: 'IWC Pilot',       price: null, url: 'https://usfans.com/product/3/7719017257?ref=KRYFUS' },
          { name: 'IWC Portugieser', price: null, url: 'https://usfans.com/product/3/7719017259?ref=KRYFUS' },
        ],
      },
    ],
  },

  clothing: {
    title: '👕 Clothing Vendor',
    intro: 'Complete streetwear supplier access. Everything in the Hoodie package plus more — all top brands at supplier pricing.',
    sections: [
      {
        name: '🕷 Sp5der',
        items: [
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722032010?ref=KRYFUS' },
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722036950?ref=KRYFUS' },
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722011630?ref=KRYFUS' },
          { name: 'Sp5der Hoodie/Joggers', price: '$42', url: 'https://usfans.com/product/3/7722011614?ref=KRYFUS' },
        ],
      },
      {
        name: '🖤 Chrome Hearts & Hellstar',
        items: [
          { name: 'Chrome Hearts Hoodie', price: '$45', url: 'https://usfans.com/product/3/7719099133?ref=KRYFUS' },
          { name: 'Hellstar Hoodie',      price: '$25', url: 'https://usfans.com/product/3/7722043738?ref=KRYFUS' },
        ],
      },
      {
        name: '🦇 Bape',
        items: [
          { name: 'Bape Hoodie', price: '$45', url: 'https://usfans.com/product/3/7719100785?ref=KRYFUS' },
        ],
      },
      {
        name: '🟤 Essentials',
        items: [
          { name: 'Essentials Hoodie', price: '$30', url: 'https://usfans.com/product/3/7722029390?ref=KRYFUS' },
          { name: 'Essentials Hoodie', price: '$30', url: 'https://usfans.com/product/3/7722001566?ref=KRYFUS' },
          { name: 'Essentials Hoodie', price: '$30', url: 'https://usfans.com/product/3/7722043734?ref=KRYFUS' },
        ],
      },
      {
        name: '👖 Denim Tears',
        items: [
          { name: 'Denim Tears Hoodie', price: '$50', url: 'https://usfans.com/product/3/7722013690?ref=KRYFUS' },
          { name: 'Denim Tears Hoodie', price: '$50', url: 'https://usfans.com/product/3/7722013692?ref=KRYFUS' },
          { name: 'Denim Tears Hoodie', price: '$50', url: 'https://usfans.com/product/3/7722013694?ref=KRYFUS' },
        ],
      },
      {
        name: '🏔 North Face',
        items: [
          { name: 'North Face Puffer', price: '$52', url: 'https://usfans.com/product/3/7722009206?ref=KRYFUS' },
          { name: 'North Face Puffer', price: '$52', url: 'https://usfans.com/product/3/7722009208?ref=KRYFUS' },
          { name: 'North Face Puffer', price: '$52', url: 'https://usfans.com/product/3/7722009210?ref=KRYFUS' },
        ],
      },
      {
        name: '🦅 Moncler & Trapstar',
        items: [
          { name: 'Moncler Puffer', price: '$50', url: 'https://usfans.com/product/3/7722009212?ref=KRYFUS' },
          { name: 'Trapstar',       price: '$40', url: 'https://usfans.com/product/3/7722043736?ref=KRYFUS' },
        ],
      },
    ],
  },

  // Bundle returns all vendor content combined
  bundle: null,
}

// Build bundle content from all vendors
VENDOR_CONTENT.bundle = {
  title: '🔥 All Access Bundle',
  intro: 'You have access to every vendor. All 7 categories below.',
  sections: Object.entries(VENDOR_CONTENT)
    .filter(([key, val]) => key !== 'bundle' && val)
    .flatMap(([, vendor]) =>
      vendor.sections.map(s => ({ ...s, name: `${vendor.title.split(' ')[0]} ${s.name}` }))
    ),
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (_origin, cb) => cb(null, true),
  credentials: true,
}))
app.options('*', cors())

// ─── Webhook (raw body — must be before express.json) ─────────────────────────
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[Webhook] Bad signature:', err.message)
    return res.status(400).json({ error: err.message })
  }
  if (event.type === 'checkout.session.completed') {
    const s = event.data.object
    console.log(`[Webhook] Paid — session=${s.id} vendor=${s.metadata?.vendorId} email=${s.customer_details?.email}`)
  }
  res.json({ received: true })
})

app.use(express.json())

// ─── Request logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/',          (_req, res) => res.json({ status: 'Vendors API running' }))
app.get('/api/health',(_req, res) => res.json({ status: 'ok' }))

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { vendorId } = req.body
    const priceId = PRICE_IDS[vendorId]
    if (!priceId) {
      return res.status(400).json({ error: `No price configured for: ${vendorId}. Add it to Render env vars.` })
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/?canceled=true`,
      allow_promotion_codes: true,
      metadata: { vendorId },
    })
    console.log(`[Checkout] Created — vendor=${vendorId} session=${session.id}`)
    res.json({ url: session.url })
  } catch (err) {
    console.error('[Checkout]', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Verify session + return vendor content
app.get('/api/verify-session', async (req, res) => {
  try {
    const { session_id } = req.query
    if (!session_id) return res.status(400).json({ error: 'Missing session_id' })

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const paid = session.payment_status === 'paid'

    if (!paid) return res.json({ paid: false })

    const vendorId = session.metadata?.vendorId
    const content  = VENDOR_CONTENT[vendorId] || null

    res.json({
      paid:    true,
      email:   session.customer_details?.email || null,
      vendorId,
      content,
    })
  } catch (err) {
    console.error('[Verify]', err.message)
    res.status(400).json({ error: err.message })
  }
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`[Server] Port ${PORT} | Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗ MISSING'}`)
})
