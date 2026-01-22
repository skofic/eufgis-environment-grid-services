'use strict'

// const _ = require('lodash')
const joi = require('joi')

module.exports = {
	schema: {
		geometry_point_radius:
			joi.number()
			.required(),
		count:
			joi.number()
			.required()
	},
	forClient(obj) {
		// Implement outgoing transformations here
		// obj = _.omit(obj, ['_id', '_rev', '_oldRev'])
		return obj
	},
	fromClient(obj) {
		// Implement incoming transformations here
		return obj
	}
}
