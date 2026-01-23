/**
 * constants.js
 * This file contains the constants used in the application.
 */

///
// Collections.
///
const documentCollections = {
	"chelsa": module.context.configuration.collectionChelsa,
	"dataset": module.context.configuration.collectionDataset,
	"drought_observatory": module.context.configuration.collectionDroughtObservatory,
	"drought_observatory_map": module.context.configuration.collectionDroughtObservatoryMap,
	"worldclim": module.context.configuration.collectionWorldClim
}
const edgeCollections = {
}

///
// Views.
///
const views = {
	"dataset": {
		"name": module.context.configuration.viewDataset,
		"type": "arangosearch",
		"properties": {
			"links": {
				"Dataset": {
					"analyzers": [
						"identity"
					],
					"fields": {
						"_key": {},
						"_collection_list": {},
						"std_project": {},
						"std_dataset": {},
						"std_dataset_group": {},
						"std_date_submission": {},
						"std_date_start": {},
						"std_date_end": {},
						"_title": {
							"fields": {
								"iso_639_3_eng": {
									"analyzers": [
										"text_en",
										"identity"
									]
								}
							}
						},
						"_description": {
							"fields": {
								"iso_639_3_eng": {
									"analyzers": [
										"text_en",
										"identity"
									]
								}
							}
						},
						"_citation": {
							"fields": {
								"iso_639_3_eng": {
									"analyzers": [
										"text_en",
										"identity"
									]
								}
							}
						},
						"_url": {},
						"count": {},
						"std_terms": {},
						"std_terms_key": {},
						"std_terms_quant": {},
						"std_dataset_scope": {},
						"std_dataset_extent": {}
					},
					"includeAllFields": false,
					"storeValues": "id",
					"trackListPositions": false
				}
			}
		}
	}
}

///
// Exports.
///
module.exports = {
	documentCollections,
	edgeCollections,
	views
}
