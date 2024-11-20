/* eslint-disable no-undef */
const Subscription = require('../models/subscription.model')

async function hasFeature(userId, featureName) {
  const subscription = await Subscription.findOne({ userId: userId })
  if (!subscription) {
    return false
  }

  return subscription.features.some(
    (feature) => feature.name === featureName && feature.isActive
  )
}

function checkFeature(featureName) {
  return async (req, res, next) => {
    const userId = req.user.id

    if (await hasFeature(userId, featureName)) {
      next()
    } else {
      res.status(403).send('Funcionalidad no disponible')
    }
  }
}

module.exports = checkFeature
