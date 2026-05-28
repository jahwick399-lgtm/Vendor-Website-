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
          { name: 'Casio',             price: '$34', url: 'https://usfans.com/product/3/7721979254?ref=KRYFUS' },
          { name: 'Casio',             price: '$44', url: 'https://usfans.com/product/3/7722020722?ref=KRYFUS' },
          { name: 'Casio CA-110MC-1A', price: '$17', url: 'https://usfans.com/product/3/7719067947?ref=KRYFUS' },
          { name: 'Casio BABY-G',      price: '$18', url: 'https://usfans.com/product/3/7719036661?ref=KRYFUS' },
          { name: 'Casio GM-S6600G-7', price: '$32', url: 'https://usfans.com/product/3/7722053992?ref=KRYFUS' },
          { name: 'Casio GMW-B6000D-1',price: '$36', url: 'https://usfans.com/product/3/7722046206?ref=KRYFUS' },
          { name: 'Casio GA-110',      price: '$17', url: 'https://usfans.com/product/3/7718965399?ref=KRYFUS' },
        ],
      },
      {
        name: '🕐 Tissot',
        items: [
          { name: 'Tissot',                   price: '$68',  url: 'https://usfans.com/product/3/7719058085?ref=KRYFUS' },
          { name: 'Tissot',                   price: '$73',  url: 'https://usfans.com/product/3/7719008937?ref=KRYFUS' },
          { name: 'Tissot',                   price: '$55',  url: 'https://usfans.com/product/3/7721971342?ref=KRYFUS' },
          { name: 'Tissot',                   price: '$49',  url: 'https://usfans.com/product/3/7722046208?ref=KRYFUS' },
          { name: 'Tissot',                   price: '$68',  url: 'https://usfans.com/product/3/7721961354?ref=KRYFUS' },
          { name: 'Tissot',                   price: '$31',  url: 'https://usfans.com/product/3/7722010822?ref=KRYFUS' },
          { name: 'Tissot',                   price: '$20',  url: 'https://usfans.com/product/3/7722057950?ref=KRYFUS' },
          { name: 'Tissot PRX',               price: '$80',  url: 'https://usfans.com/product/3/7719016859?ref=KRYFUS' },
          { name: 'Tissot PRX II',            price: '$120', url: 'https://usfans.com/product/3/7719016865?ref=KRYFUS' },
          { name: 'Tissot PRX 40',            price: '$87',  url: 'https://usfans.com/product/3/7719007051?ref=KRYFUS' },
          { name: 'Tissot PRX Powermatic 80', price: '$283', url: 'https://usfans.com/product/3/7719042571?ref=KRYFUS' },
          { name: 'Tissot Chemin Des Tourelles',price: '$79', url: 'https://usfans.com/product/3/7722067858?ref=KRYFUS' },
          { name: 'Tissot Chemin Des Tourelles',price: '$84', url: 'https://usfans.com/product/3/7722040412?ref=KRYFUS' },
          { name: 'Tissot Bellissima Small Lady',price: '$94',url: 'https://usfans.com/product/3/7721947446?ref=KRYFUS' },
          { name: 'Tissot PRX Arctic Sky',    price: '$111', url: 'https://usfans.com/product/3/7722077720?ref=KRYFUS' },
        ],
      },
      {
        name: '👑 Rolex',
        items: [
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7718989253?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7719007053?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7722022754?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7721947448?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7719012911?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7718951501?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7721949536?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7721985114?ref=KRYFUS' },
          { name: 'Rolex', price: null, url: 'https://usfans.com/product/3/7722065824?ref=KRYFUS' },
          { name: 'Rolex Daytona',          price: null, url: 'https://usfans.com/product/3/7719052329?ref=KRYFUS' },
          { name: 'Rolex Daytona',          price: null, url: 'https://usfans.com/product/3/7721979252?ref=KRYFUS' },
          { name: 'Rolex Cosmograph Daytona',price: null, url: 'https://usfans.com/product/3/7719069949?ref=KRYFUS' },
          { name: 'Rolex GMT-Master II',    price: null, url: 'https://usfans.com/product/3/7721989026?ref=KRYFUS' },
          { name: 'Rolex GMT-Master II',    price: null, url: 'https://usfans.com/product/3/7722036608?ref=KRYFUS' },
          { name: 'Rolex Datejust',         price: null, url: 'https://usfans.com/product/3/7722024670?ref=KRYFUS' },
          { name: 'Rolex Oyster Perpetual', price: null, url: 'https://usfans.com/product/3/7719054243?ref=KRYFUS' },
          { name: 'Rolex Datejust',         price: null, url: 'https://usfans.com/product/3/7719032757?ref=KRYFUS' },
          { name: 'Rolex Submariner',       price: null, url: 'https://usfans.com/product/3/7721967242?ref=KRYFUS' },
          { name: 'Rolex Explorer II',      price: null, url: 'https://usfans.com/product/3/7722026666?ref=KRYFUS' },
          { name: 'Rolex Deepsea',          price: null, url: 'https://usfans.com/product/3/7721945488?ref=KRYFUS' },
        ],
      },
      {
        name: '🌊 Omega',
        items: [
          { name: 'Omega',              price: '$29', url: 'https://usfans.com/product/3/7719036663?ref=KRYFUS' },
          { name: 'Omega',              price: null,  url: 'https://usfans.com/product/3/7718967387?ref=KRYFUS' },
          { name: 'Omega',              price: null,  url: 'https://usfans.com/product/3/7722048086?ref=KRYFUS' },
          { name: 'Omega',              price: null,  url: 'https://usfans.com/product/3/7719067943?ref=KRYFUS' },
          { name: 'Omega',              price: '$95', url: 'https://usfans.com/product/3/7722044246?ref=KRYFUS' },
          { name: 'Omega',              price: null,  url: 'https://usfans.com/product/3/7722008854?ref=KRYFUS' },
          { name: 'Omega Aqua Terra 150M', price: '$84', url: 'https://usfans.com/product/3/7719004977?ref=KRYFUS' },
        ],
      },
      {
        name: '⚓ Longines',
        items: [
          { name: 'Longines Conquest',          price: '$112', url: 'https://usfans.com/product/3/7722065822?ref=KRYFUS' },
          { name: 'Longines HydroConquest',     price: '$151', url: 'https://usfans.com/product/3/7719087723?ref=KRYFUS' },
          { name: 'Longines HydroConquest',     price: '$156', url: 'https://usfans.com/product/3/7719020817?ref=KRYFUS' },
          { name: 'Longines Master Collection', price: '$431', url: 'https://usfans.com/product/3/7722002914?ref=KRYFUS' },
        ],
      },
      {
        name: '💎 Audemars Piguet',
        items: [
          { name: 'Audemars Piguet Royal Oak', price: '$63',  url: 'https://usfans.com/product/3/7722006866?ref=KRYFUS' },
          { name: 'Audemars Piguet Royal Oak', price: null,   url: 'https://usfans.com/product/3/7718975405?ref=KRYFUS' },
          { name: 'Audemars Piguet Royal Oak', price: null,   url: 'https://usfans.com/product/3/7721973258?ref=KRYFUS' },
          { name: 'Audemars Piguet Royal Oak', price: '$139', url: 'https://usfans.com/product/3/7719063989?ref=KRYFUS' },
        ],
      },
      {
        name: '🏆 Patek Philippe',
        items: [
          { name: 'Patek Philippe Nautilus',  price: '$60', url: 'https://usfans.com/product/3/7718971353?ref=KRYFUS' },
          { name: 'Patek Philippe Aquanaut',  price: null,  url: 'https://usfans.com/product/3/7722022758?ref=KRYFUS' },
          { name: 'Patek Philippe',           price: '$97', url: 'https://usfans.com/product/3/7721953494?ref=KRYFUS' },
        ],
      },
      {
        name: '🔱 Vacheron Constantin',
        items: [
          { name: 'Vacheron Constantin', price: '$78',  url: 'https://usfans.com/product/3/7722057948?ref=KRYFUS' },
          { name: 'Vacheron Constantin', price: '$147', url: 'https://usfans.com/product/3/7721994978?ref=KRYFUS' },
        ],
      },
      {
        name: '✈️ IWC',
        items: [
          { name: 'IWC', price: '$68', url: 'https://usfans.com/product/3/7722046210?ref=KRYFUS' },
          { name: 'IWC', price: '$78', url: 'https://usfans.com/product/3/7719004975?ref=KRYFUS' },
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
