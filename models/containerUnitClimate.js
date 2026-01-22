'use strict'

// const _ = require('lodash')
const joi = require('joi')

module.exports = {
	schema: {
		Unit: joi.object({
			'gcu_id_unit-id': joi.string()
				.regex(/[A-Z]{3}[0-9]{9}/),
			gcu_id_number: joi.string()
				.regex(/[A-Z]{3}[0-9]{5}/),
			'gcu_loc_coordinates-restriction': joi.boolean()
				.default(false)
				.required(),
			gcu_loc_climate: joi.object({
				type: joi.string().valid('Point').required(),
				coordinates: joi.array()
					.ordered(
						joi.number().min(-180).max(180).required(),  // Longitude
						joi.number().min(-90).max(90).required()     // Latitude
					)
					.length(2)
					.required()
			}),
			species_list: joi.array()
				.items(joi.string())
		}),
		Chelsa: joi.object({
			"1981-2010": joi.object(),
			"2011-2040": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			}),
			"2041-2070": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			}),
			"2071-2100": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			})
		}),
		WorldClim: joi.object({
			topography: joi.object(),
			"1970-2000": joi.object(),
			"2021-2040": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			}),
			"2041-2060": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			}),
			"2061-2080": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			}),
			"2081-2100": joi.object({
				"MPI-ESM1-2-HR": joi.object({
					"ssp370": joi.object()
				})
			})
		})
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
