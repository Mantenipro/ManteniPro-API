/* eslint-disable no-undef */
const createError = require('http-errors')
const userUseCase = require('../usecases/users.usecase')
const jwt = require('../lib/jwt')
const Subscription = require('../models/subscription.model')

async function auth(request, response, next) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw createError(401, 'JWT is required')
    }

    const token = authHeader.replace('Bearer ', '')

    const payload = jwt.verify(token)

    
    const user = await userUseCase.getById(payload.id)

    if (!user) {
      throw createError(401, 'User not found')
    }

    request.user = user

    next()
  } catch (error) {
    response.status(401)
    response.json({
      success: false,
      error: error.message
    })
  }
}

async function checkSubscription(req, res, next) {
  const subscriptionId = req.user.subscriptionId

  if (!subscriptionId) {
    return res.status(403).send('No subscription found')
  }

  const subscription = await Subscription.findById(subscriptionId)

  if (subscription.status !== true ) {
    return res.status(403).send('Subscription is not active')
  }

  req.subscription = subscription
  next()
}

module.exports = {
  auth,
  checkSubscription
}
