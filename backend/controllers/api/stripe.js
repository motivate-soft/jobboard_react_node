const { handleError } = require("../../helpers/handlers");
const logger = require("../../helpers/logger");
const nconf = require("nconf");

const httpsProxyAgent = require("https-proxy-agent");
const agent = new httpsProxyAgent("http://172.25.1.2:3129");

require("../../config");
const { secretKey, products } = nconf.get("stripe");
const stripe = require("stripe")(secretKey, { httpAgent: agent });

const upsells = {
  showLogo: 49,
  blastEmail: 49,
  highlight: 49,
  highlightColor: 349,
  stickyDay: 199,
  stickyWeek: 549,
  stickyMonth: 1647,
};

function getDiscountRate(size) {
  if (size === 1) {
    return 0;
  } else if (size <= 5) {
    return 5;
  } else if (size <= 10) {
    return 10;
  } else if (size <= 15) {
    return 15;
  } else if (size <= 30) {
    return 20;
  } else if (size <= 40) {
    return 25;
  } else if (size <= 50) {
    return 30;
  } else if (size <= 60) {
    return 35;
  } else if (size <= 75) {
    return 40;
  } else if (size <= 99) {
    return 45;
  } else {
    return 50;
  }
}

function calculatePricePerPost(bundleState) {
  let pricePerPost = defaultPricePerPost;
  if (bundleState.showLogo) {
    pricePerPost += upsells.showLogo;
  }
  if (bundleState.blastEmail) {
    pricePerPost += upsells.blastEmail;
  }
  if (bundleState.highlight) {
    pricePerPost += upsells.highlight;
  }
  if (bundleState.highlightColor) {
    pricePerPost += upsells.highlightColor;
  }
  if (bundleState.stickyDuration) {
    switch (bundleState.stickyDuration) {
      case "day":
        pricePerPost += upsells.stickyDay;
        break;
      case "week":
        pricePerPost += upsells.stickyWeek;
        break;
      case "month":
        pricePerPost += upsells.stickyMonth;
        break;
      default:
        break;
    }
  }

  return pricePerPost;
}

function calculatePrice(bundleState, size) {
  let pricePerPost = calculatePricePerPost(calculatePricePerPost);
  // for (let [key, value] of Object.entries(upsells)) {
  //   if (bundleState[key]) {
  //     priceSinglePost += upsells[key];
  //   }
  // }

  return pricePerPost * size * (1 - getDiscountRate(size));
}

function formatProducts(products) {
  products.forEach((product) => {
    /* Append additional display information */
    product.subheader = "subheader";
  });

  return products;
}

function sortAndFormatPlans(plans) {
  plans = plans.sort((a, b) => {
    /* Sort plans in ascending order of price (amount)
     * Ref: https://www.w3schools.com/js/js_array_sort.asp */
    return a.amount - b.amount;
  });

  plans.forEach((plan) => {
    /* Append additional display information */
    plan.formatted = JSON.stringify(plan);
    plan.features = "features";
    plan.highlight = "highlight";
  });
  logger.info("sortAndFormatPlans" + plans);

  return plans;
}

function attachPlansToProducts(plans, products, prices) {
  products.forEach((product) => {
    const filteredPlans = plans.filter((plan) => {
      return product.id === plan.product;
    });

    const filteredPrices = prices.filter((price) => {
      return product.id === price.product;
    });

    product.plans = filteredPlans;
    product.prices = filteredPrices;
  });

  return products.filter((product) => product.plans.length > 0);
}

async function retrieveProduct(productId) {
  return await stripe.products.retrieve(productId);
}

async function getProductPrices(productId) {
  return await stripe.prices.list({
    product: productId,
  });
}

async function getProductsAndPlans() {
  try {
    const stripeData = await Promise.all([
      stripe.products.list({}), // Default returns 10 products, sorted by most recent creation date
      stripe.plans.list({}), // Default returns 10 plans, sorted by most recent creation date
      stripe.prices.list({}), // Default returns 10 plans, sorted by most recent creation date
    ]);
    var products = formatProducts(stripeData[0].data);
    var plans = sortAndFormatPlans(stripeData[1].data);
    var prices = stripeData[2].data;

    logger.info("getProductsAndPlans->products");
    logger.info(products);
    logger.info("getProductsAndPlans->plans");
    logger.info(plans);

    return attachPlansToProducts(plans, products, prices);
  } catch (error) {
    logger.error("Error fetching Stripe products and plans: ", err);
    return [];
  }
}

async function createCoupon(discountPercent, maxRedemptions) {
  console.log("createCoupon->params", discountPercent, maxRedemptions);
  const coupon = await stripe.coupons.create({
    id: "post-discount",
    duration: "forever",
    // duration: "repeating",
    percent_off: discountPercent,
    max_redemptions: maxRedemptions,
    applies_to: {
      products: [
        "prod_JlWSQiHlx7Aeib",
        "prod_JlWU8eToQhHTth",
        "prod_JlWUDVo7QFMHQ4",
        "prod_JlWUE7WujhcFRZ",
        "prod_JlWVZneRyDBh9b",
        "prod_JlWVn4vMoRG0Iz",
        "prod_JlWViB3VKP5N10",
        "prod_JlWWJeULo359cK",
      ],
    },
  });
  return coupon;
}

async function createPromoCode(couponId) {
  const promotion_code = await stripe.promotionCodes.create({
    coupon: couponId,
    // customer: 'cus_4fdAW5ftNQow1a',
    max_redemptions: 10,
  });
  return promotion_code;
}

async function retrievePromoCode(code) {
  const promotionCodes = await stripe.promotionCodes.list({
    code,
    active: true,
  });
  return promotionCodes;
}

async function createSubscription(customerInfo, pricingItems, promoCode) {}

async function createCustomer(company) {
  try {
    const { name, email, invoiceAddress, invoiceNotes } = company;
    let customer = await stripe.customers.create({
      name,
      email,
      address: invoiceAddress,
    });
    return customer;
  } catch (err) {
    winston.error("Stripe > createCustomer : Error" + err.message);
    throw err;
  }
}

async function createPaymentIntent(amount) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      payment_method_types: ["card"],
    });
  } catch (error) {}
}

exports.createCustomerAndSubscription = async (
  paymentMethodId,
  customerInfo,
  pricingItems
) => {
  const customer = await stripe.customers.create({
    payment_method: paymentMethodId,
    email: customerInfo.email,
    name: customerInfo.name,
    address: customerInfo.invoiceAddress,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  /* Create subscription and expand the latest invoice's Payment Intent
   * We'll check this Payment Intent's status to determine if this payment needs SCA
   */

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: pricingItems.map((item) => ({
      price: item,
    })),
    // trial_from_plan: true,
    expand: ["latest_invoice.payment_intent"],
    // promotion_code: 'promo_1JCbmpHhTqm9kBDPRFFhPoZV',
  });

  return subscription;
};

exports.buybundle = async function (req, res) {
  try {
    return res.status(204).json();
  } catch (error) {
    logger.error(error);
    return handleError(res, req, 500, err);
  }
};
