'use strict'

///
// Load modules.
///
const {db} = require('@arangodb')
const {context} = require('@arangodb/locals')
const analyzers = require("@arangodb/analyzers");
const {documentCollections, edgeCollections, views} = require('../constants')

///
// Create document collections.
///
for (const [key, collection] of Object.entries(documentCollections))
{
	console.log(key)
	///
	// Get or create collection.
	///
	let coll = db._collection(collection)
	if (!coll) {
		coll = db._createDocumentCollection(collection)
		console.debug(`collection ${collection} created.`)
	} else if (context.isProduction) {
		console.debug(`collection ${collection} already exists. Checking indexes.`)
	}
	
	///
	// Ensure required indexes exist.
	///
	ensureIndexes(key, coll)
}

///
// Create edge collections.
///
for (const [key, collection] of Object.entries(edgeCollections))
{
	///
	// Get or create collection.
	///
	let coll = db._collection(collection)
	if (!coll) {
		coll = db._createEdgeCollection(collection)
		console.debug(`collection ${collection} created.`)
	} else if (context.isProduction) {
		console.debug(`collection ${collection} already exists. Checking indexes.`)
	}
	
	///
	// Ensure required indexes exist.
	///
	ensureIndexes(key, coll)
}

///
// Create analyzers.
///
var analyzer_name
const db_name = db._name()
analyzer_name = `${db_name}::geojson`
if(analyzers.analyzer(analyzer_name) === null) {
	analyzers.save(
		analyzer_name,
		"geojson",
		{ type: "shape", "legacy": false}
	)
}
analyzer_name = `${db_name}::geojsonpoint`
if(analyzers.analyzer(analyzer_name) === null) {
	analyzers.save(
		analyzer_name,
		"geojson",
		{ type: "point", "legacy": false}
	)
}

///
// Create views.
///
for (const [key, value] of Object.entries(views)) {
	if(db._view(value.name) === null) {
		db._createView(value.name, value.type, value.properties)
	}
}


/**
 * ensureIndexes
 * Create missing indexes for the provided collection.
 * Existing indexes with the same name are left untouched.
 *
 * @param {string} theCollectionKey - The key identifying the collection type.
 * @param {object} theColl          - The ArangoDB collection object.
 */
function ensureIndexes(theCollectionKey, theColl)
{
	///
	// Build a set of existing index names for fast lookup.
	///
	const existingIndexNames = new Set(
		theColl.getIndexes().map(index => index.name)
	)
	
	/**
	 * createIndexIfMissing
	 * Only calls ensureIndex if no index with that name already exists.
	 *
	 * @param {object} indexDef - The index definition (must include a `name` property).
	 */
	function createIndexIfMissing(indexDef) {
		if (!existingIndexNames.has(indexDef.name)) {
			theColl.ensureIndex(indexDef)
			console.debug(`Index ${indexDef.name} created on ${theColl.name()}.`)
		} else {
			console.debug(`Index ${indexDef.name} already exists on ${theColl.name()}. Skipping.`)
		}
	}
	
	switch(theCollectionKey)
	{
		case 'chelsa':
		case 'worldclim':
			createIndexIfMissing({
				name: 'idx_geometry',
				type: 'geo',
				fields: ['geometry_bounds'],
				geoJson: true
			})
			createIndexIfMissing({
				name: 'idx_geometry_point',
				type: 'geo',
				fields: ['geometry_point'],
				geoJson: true
			})
			break
		
		case 'dataset':
			break
		
		case 'drought_observatory':
			createIndexIfMissing({
				name: 'idx_hash_date',
				type: 'persistent',
				fields: ['geometry_hash', 'std_date'],
				unique: true
			})
			break
		
		case 'drought_observatory_map':
			createIndexIfMissing({
				name: 'idx_geometry',
				type: 'geo',
				fields: ['geometry'],
				geoJson: true
			})
			createIndexIfMissing({
				name: 'idx_radius',
				type: 'persistent',
				fields: ['geometry_point_radius']
			})
			break
	}
}
