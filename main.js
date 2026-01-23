'use strict'

///
// Get context.
///
const { context } = require('@arangodb/locals')

///
// Set routes.
///
context.use('/chelsa', require('./routes/chelsa'), 'Chelsa')
context.use('/worldclim', require('./routes/worldClim'), 'WorldClim')
context.use('/do/meta', require('./routes/droughtObservatoryMeta'), 'European Drought Observatory Meta')
context.use('/do/data', require('./routes/droughtObservatoryData'), 'European Drought Observatory Data')
context.use('/dataset', require('./routes/datasets'), 'Datasets')
