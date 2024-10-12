/* eslint-disable no-undef */
const stripe = require('../config/stripeConfig')

async function getProductsAndPrices() {
  try {
    const products = await stripe.products.list()
    const prices = await stripe.prices.list()

    const productDetails = products.data.map((product) => {
      const productPrices = prices.data.filter(
        (price) => price.product === product.id
      )
      return {
        ...product,
        prices: productPrices
      }
    })

    return productDetails
  } catch (error) {
    console.error('Error fetching products and prices from Stripe:', error)
    throw error
  }
}

module.exports = {
  getProductsAndPrices
}
