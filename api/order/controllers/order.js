const API_KEY = process.env.REACT_APP_API_KEY;
("use strict");

const { default: createStrapi } = require("strapi");

const stripe = require("stripe")(
  "sk_test_51I5YdXFhnjRgMEaiVZfeJMY2b8K5a0Qq71Qu7xZE1xXWE6UGwTLd1l37tZ5PRBLD4bXRKw8vywLPkqCQCxPOlc6q00rFDbbMKz"
);
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    const {
      name,
      phone,
      country,
      city,
      address,
      postcode,
      cartName,
      total,
      items,
      info,
      stripeTokenId,
    } = ctx.request.body;

    const { id } = ctx.state.user;
    //console.log(ctx.state);
    const charge = await stripe.charges.create({
      amount: Math.round(total * 100),
      currency: "eur",
      source: stripeTokenId,
      description: `Order ${new Date()} made by ${ctx.state.user.username}`,
    });
    const order = await strapi.services.order.create({
      name,
      phone,
      country,
      city,
      address,
      postcode,
      cartName,
      total,
      items,
      info,
      user: id,
    });
    return order;
  },
};
