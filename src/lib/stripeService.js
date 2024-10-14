/* eslint-disable no-undef */
const stripe = require('../config/stripeConfig')

async function getProductsAndPrices() {
  try {
    // Obtener productos y precios de Stripe
    const products = await stripe.products.list()
    const prices = await stripe.prices.list()

    // Organizar los precios de menor a mayor (unit_amount representa el precio en centavos)
    const sortedPrices = prices.data.sort(
      (a, b) => a.unit_amount - b.unit_amount
    )

    // Mapear los productos con sus respectivos precios ordenados
    const productDetails = products.data.map((product) => {
      const productPrices = sortedPrices.filter(
        (price) => price.product === product.id
      )
      return {
        ...product,
        prices: productPrices
      }
    })

    // Ordenar los productos por el precio más bajo de cada producto
    const sortedProductDetails = productDetails.sort((a, b) => {
      const aLowestPrice =
        a.prices.length > 0 ? a.prices[0].unit_amount : Infinity
      const bLowestPrice =
        b.prices.length > 0 ? b.prices[0].unit_amount : Infinity
      return aLowestPrice - bLowestPrice
    })

    // Retornar los productos con sus precios asociados (ordenados de menor a mayor)
    return sortedProductDetails
  } catch (error) {
    console.error('Error fetching products and prices from Stripe:', error)
    throw error
  }
}

module.exports = {
  getProductsAndPrices
}
