const express = require('express')
const router = express.Router()

router.use('/api/v1/user', require('./api/users.js'))
router.use('/api/v1/others', require('./api/others.js'))
router.use('/api/v1/apps', require('./api/apps.js'))
// router.use('/api/v1/posts', require('./post.routes'))

module.exports = router
