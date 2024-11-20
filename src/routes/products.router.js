/* eslint-disable no-undef */
const express = require('express')
const { getProductsAndPrices } = require('../lib/stripeService')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await getProductsAndPrices()
    res.status(200).json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error fetching products and prices' })
  }
})

module.exports = router
