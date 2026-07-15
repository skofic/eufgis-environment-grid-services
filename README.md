# EUFGIS Grid Environmental Data Services

This [repository](https://github.com/skofic/environmental-services.git) contains the [ArangoDB](https://www.arangodb.com/) [Foxx micro service](https://www.arangodb.com/docs/stable/foxx.html) for publishing *remote sensing* and *climate data* related published in the [EUFGIS](http://www.eufgis.org) information system.

This set of services concentrates on data stored in layers of geographic grids in different resolutions, while another set of services concentrate on data characterising the geographic boundaries of conservation units.

This work is being conducted for the [upgrade](https://www.forgenius.eu/eufgis) of the [EUFGIS](http://www.eufgis.org/) information system within the framework of the [FORGENIUS](https://www.forgenius.eu/) project.

<details>
	<summary>Table of Contents</summary>
	<ol>
		<li><a href="#Database">Database</a></li>
    <li><a href="#Installation">Installation</a></li>
    <li><a href="#Services">Services</a></li>
    <li><a href="#Progress">Progress</a></li>
    <li><a href="#Licence">Licence</a></li>
	</ol>
</details>



## Database

The database is implemented using [ArangoDB](https://www.arangodb.com/). The data is not included in this repository, you will have to run a series of scripts to download, clip, process, combine and merge [Chelsa](https://chelsa-climate.org/), [WorldClim](https://worldclim.org/) and [EDO](https://edo.jrc.ec.europa.eu/edov2/php/index.php?id=1000) data, all this is available in [this](https://github.com/skofic/ClimateService.git) repository.

The database contains the following collections:

### Chelsa

[CHELSA](https://chelsa-climate.org) [version 2.1](https://chelsa-climate.org/wp-admin/download-page/CHELSA_tech_specification_V2.pdf) is based on a mechanistical statistical downscaling of global reanalysis data or global circulation model output, it is a [model](https://chelsa-climate.org/wp-admin/download-page/CHELSA_tech_specification_V2.pdf) that aims at representing reality as precise as possible. It provides high spatial resolution (30 arc seconds) grid of global weather and climate data for historical data, *1981-2010*, and future modelled climate scenarios.

Future climate scenarios come from the [Max Plank Institute Earth System Model](https://mpimet.mpg.de/en/research/department-climate-variability/earth-system-modeling-and-prediction) version [MPI-ESM1-2-HR](https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.MPI-M.MPI-ESM1-2-HR), a [climate model](https://www.carbonbrief.org/cmip6-the-next-generation-of-climate-models-explained/) developed as part of the internationally-coordinated Coupled Model Intercomparison Project Phase 6 ([CMIP6](https://pcmdi.llnl.gov/CMIP6/)). The values were averages over 3 20 year periods: *2011-2040*, *2041-2070* and *2071-2100*. 

*Shared Socioeconomic Pathways (SSPs)* are climate change scenarios of projected socioeconomic global changes up to 2100 as defined in the IPCC Sixth Assessment Report on climate change in 2021. Of these the [Shared Socioeconomic Pathway](https://climatedata.ca/resource/understanding-shared-socio-economic-pathways-ssps/) [SSP3-RCP7](https://www.meteomatics.com/en/api/available-parameters/climate-data/#scenario3) was selected: *regional rivalry* (a rocky road):

> The world follows a path in which social, economic, and technological trends do not shift markedly from historical patterns. Development and income growth proceeds unevenly, with some countries making relatively good progress while others fall short of expectations. Global and national institutions work toward but make slow progress in achieving sustainable development goals. Environmental systems experience degradation, although there are some improvements and overall the intensity of resource and energy use declines. Global population growth is moderate and levels off in the second half of the century. Income inequality persists or improves only slowly and challenges to reducing vulnerability to societal and environmental changes remain.

#### Data

The collection contains over 36 million data records, *one* for *each grid cell*. This data source is usually interrogated providing a *point* and *selecting* the *grid cell* that *contains it*. There are also services that allow *selecting* a *set of grid cells* based on *distance range*, that are *contained* or that *intersect* with a provided *reference geometry*: the *results* can be *listed* or *aggregated* using a set of *statistical methods*.

The records are structured as follows:

```json
{
  "_key": "e017884385d8e18e97067453578f8bc3",
  "std_dataset_ids": [
    "4badf85d-270a-463c-89d3-04bc52d806bd"
  ],
  "geometry_point": {
    "type": "Point",
    "coordinates": [
       /* data */
    ]
  },
  "geometry_bounds": {
    "type": "Polygon",
    "coordinates": [
      /* data */
    ]
  },
  "properties": {
    "1981-2010": {
      /* data */
      "std_date_span_month": [
        /* data */
      ]
    },
    "2011-2040": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    },
    "2041-2070": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    },
    "2071-2100": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    }
  }
}
```

The `_key` represents the *primary key* of the record, it is the [MD5](https://en.wikipedia.org/wiki/MD5) hash of the `geometry_bounds` field.

The `std_dataset_ids` field contains the *list* of *all datasets* featured *in the record*; the values are *references* to the corresponding `Dataset` records.

The `geometry_point` contains the [GeoJSON](https://geojson.org) *point coordinates* of the *center* of the *grid cell*.

The `geometry_bounds` contains the [GeoJSON](https://geojson.org) *polygon coordinates* of the *grid cell*.

The `properties` field contains all the *data*, it is subdivided into the *four time periods*:

- `1981-2010`: *Historical data* averaged for the period ranging from 1981 to 2010. At the top level we find yearly period averages and the `std_date_span_month` field contains monthly data averages for the same period.
- `2011-2040`: *Modelled data* for the period ranging from 2011 to 2040. The `MPI-ESM1-2-HR` and `ssp370` fields indicate respectively the [climate model](https://mpimet.mpg.de/en/research/department-climate-variability/earth-system-modeling-and-prediction) and the [shared socioeconomic pathway](https://www.meteomatics.com/en/api/available-parameters/climate-data/#scenario3) used in the modelling. At the top level of the `ssp370` property we find yearly period averages and the `std_date_span_month` field contains monthly data averages for the same period.
- `2041-2070`: *Modelled data* for the period ranging from 2041 to 2070. The structure of the data is the same as the *previously described section*.
- `2071-2100`: *Modelled data* for the period ranging from 2071 to 2100. The structure of the data is the same as the *previously described section*.

All *data variables* are *documented* in the [data dictionary](https://github.com/skofic/data-dictionary-service.git).

#### Indexes

Both the `geometry_point` and the `geometry_bounds` fields are indexed with type `geo`. The point geometry is used to select by distance, while the polygon geometry is used for all other geometry searches.

### WorldClim

[WorldClim](https://worldclim.org) version 2.1 is a database of high spatial resolution (30 arc seconds) global weather and climate data, it provides historical data, 1970-2000, and future modelled climate scenarios ranging from 2021 to 2100.

Future climate scenarios come from the [Max Plank Institute Earth System Model](https://mpimet.mpg.de/en/research/department-climate-variability/earth-system-modeling-and-prediction) version [MPI-ESM1-2-HR](https://www.wdc-climate.de/ui/cmip6?input=CMIP6.HighResMIP.MPI-M.MPI-ESM1-2-HR), a [climate model](https://www.carbonbrief.org/cmip6-the-next-generation-of-climate-models-explained/) developed as part of the internationally-coordinated Coupled Model Intercomparison Project Phase 6 ([CMIP6](https://pcmdi.llnl.gov/CMIP6/)). The monthly values were averages over 4 20 year periods, 2021-2040, 2041-2060, 2061-2080 and 2081-2100. 

Shared Socioeconomic Pathways (SSPs) are climate change scenarios of projected socioeconomic global changes up to 2100 as defined in the IPCC Sixth Assessment Report on climate change in 2021. Of these the [Shared Socioeconomic Pathway](https://climatedata.ca/resource/understanding-shared-socio-economic-pathways-ssps/) [SSP3-RCP7](https://www.meteomatics.com/en/api/available-parameters/climate-data/#scenario3) was selected: *regional rivalry* (a rocky road):

> The world follows a path in which social, economic, and technological trends do not shift markedly from historical patterns. Development and income growth proceeds unevenly, with some countries making relatively good progress while others fall short of expectations. Global and national institutions work toward but make slow progress in achieving sustainable development goals. Environmental systems experience degradation, although there are some improvements and overall the intensity of resource and energy use declines. Global population growth is moderate and levels off in the second half of the century. Income inequality persists or improves only slowly and challenges to reducing vulnerability to societal and environmental changes remain.

#### Data

The collection contains over 21 million data records, one for each grid cell. This data source is usually interrogated providing a *point* and *selecting* the *grid cell that contains it*. There are also services that provide a *selection of grid cells* within a specific *distance range*, *contained by* or *intersecting* a provided *geometric shape*, the results can *also be aggregated*.

The data is structured as follows:

```json
{
  "_key": "aa4de6613be35882252cbd4a4ab80660",
  "std_dataset_ids": [
    "bf102320-3726-48d1-b3fc-421f131c6666"
  ],
  "geometry_point": {
    "type": "Point",
    "coordinates": [
      /* data */
    ]
  },
  "geometry_bounds": {
    "type": "Polygon",
    "coordinates": [
      /* data */
    ]
  },
  "properties": {
    "topography": {
      "geo_shape_elevation": /* data */
    },
    "1970-2000": {
      /* data */
      "std_date_span_month": [
        /* data */
      ]
    },
    "2021-2040": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    },
    "2041-2060": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    },
    "2061-2080": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    }
  },
    "2081-2100": {
      "MPI-ESM1-2-HR": {
        "ssp370": {
          /* data */
          "std_date_span_month": [
            /* data */
          ]
        }
      }
    }
  }
}
```

The `_key` represents the *primary key* of the record, it is the *[MD5](https://en.wikipedia.org/wiki/MD5) hash* of the `geometry_bounds` field.

The `std_dataset_ids` field contains the *list* of all *datasets* present in the record; the values are *references* to the corresponding `Dataset` records.

The `geometry_point` contains the [GeoJSON](https://geojson.org) *point* of the *center* of the *grid cell*.

The `geometry_bounds` contains the [GeoJSON](https://geojson.org) *polygon* of the *grid cell*.

The `properties` field contains all the data:

- `topography`: This section contains the *average elevation* of the current grid cell, *provided by WorldClim*.
- `1970-2000`: *Historical data* averaged for the period ranging from 1970 to 2000. At the top level we find *yearly* period *averages* and the `std_date_span_month` field contains *monthly* data *averages* for the same period.
- `2021-2040`: *Modelled data* for the period ranging from 2021 to 2040. The `MPI-ESM1-2-HR` and `ssp370` fields indicate respectively the [climate model](https://mpimet.mpg.de/en/research/department-climate-variability/earth-system-modeling-and-prediction) and the [shared socioeconomic pathway](https://www.meteomatics.com/en/api/available-parameters/climate-data/#scenario3) used in the modelling. At the top level of the `ssp370` property we find *yearly* period *averages* and the `std_date_span_month` field contains *monthly* data *averages* for the same period.
- `2041-2060`: Modelled data for the period ranging from 2041 to 2060. The structure of the data is the same as the *previously described section*.
- `2061-2080`: Modelled data for the period ranging from 2061 to 2080. The structure of the data is the same as the *previously described section*.
- `2081-2100`: Modelled data for the period ranging from 2081 to 2100. The structure of the data is the same as the *previously described section*.

All *data variables* are *documented* in the [data dictionary](https://github.com/skofic/data-dictionary-service.git).

#### Indexes

Both the `geometry_point` and the `geometry_bounds` fields are indexed with type `geo`. The point geometry is used to select by distance, while the polygon geometry is used for all other geometry searches.

### DroughtObservatory

This collection currently contains over 1.7 billion records from the [European Drought Observatory](https://drought.emergency.copernicus.eu/tumbo/edo/map/) and [Global Drought Observatory](https://drought.emergency.copernicus.eu/tumbo/gdo/map/) repositories. It is a collection of measurements subdivided into a set of approximately 2.3km., 2.8km., 4.6km., 13.9km. and 55.7km. resolution grids covering the European and Southern Mediterranean region. Each record references a *specific layer cell* and *date*, all dates are daily.

#### Data

The records are grouped by *geometry* and *date*, and have the following structure:

```json
{
    "geometry_hash": "7e142bf917dbf13cd8c106142cabc9f9",
    "std_date": "19991224",
    "properties": {
      "env_climate_hcwi_min": -20.879,
      "env_climate_hcwi_max": -18.879
    },
    "std_terms": [
      "env_climate_hcwi_max",
      "env_climate_hcwi_min"
    ],
    "std_dataset_ids": [
      "6b12011e-ef30-47d4-b4a3-3c8bdc4b4464"
    ]
}
```

The `geometry_hash` references the record in the `DroughtObservatoryMap` collection that represents the *grid cell*, it is the [MD5](https://en.wikipedia.org/wiki/MD5) hash of the [GeoJSON](https://geojson.org) *polygon* representing the *grid cell* that is the `geometry` property in the `DroughtObservatoryMap` collection.

The `std_date` field represents the measurement *date* in `YYYYMMDD` format, `Y` for year, `M` for month and `D` for day. All dates have a *daily span*.

The `properties` field contains the *data measurements*.

The `std_terms` field contains the list of featured data properties.

The `std_dataset_ids` field contains the list of referenced datasets, the values are links to `Dataset` collection records.

All properties are documented in the [data dictionary](https://github.com/skofic/data-dictionary-service.git).

#### Index

The collection features a *unique* index on the `geometry_hash` and `std_date` fields.

### DroughtObservatoryMap

This collection contains one record for each grid cell from the [European Drought Observatory](https://edo.jrc.ec.europa.eu/edov2/php/index.php?id=1000) repository, it contains over 2 million records. It is used to record the geometry of the grid cells and to link`DroughtObservatory` collection time series.

#### Data

Records follow this structure:

```json
{
  "_key": "00001c556c96447e528f8c1de7b9b1e7",
  "geometry": {
    "type": "Polygon",
    "coordinates": [ /* data */ ]
  },
  "geometry_point": {
    "type": "Point",
    "coordinates": [ /* data */ ]
  },
  "geometry_point_radius": 0.020833335,
  "std_date_start": "20120101",
  "std_date_end": "20251221",
  "std_dataset_ids": [
    "7b789ef4-aa2d-4f25-91c4-feab9d4cbb9b"
  ],
  "std_terms": [
    "env_climate_cdi"
  ]
}
```

The `_key` field represents the record *primary key*, it is the [MD5](https://en.wikipedia.org/wiki/MD5) hash of `geometry`.

The `geometry` field contains the [GeoJSON](https://geojson.org) *geometry* of the *grid cell*.

The `geometry_point` field contains the [GeoJSON](https://geojson.org) *point* representing the *center* of the *grid cell*.

The `geometry_point_radius` field represents the resolution of the *grid cell*. The value is the distance between the centroids of *two adjacent grid cells*, *divided by 2* and expressed in *decimal degrees*.

The `std_date_start` and `std_date_end` fields represent respectively the start and end dates of the time series data available in the current grid cell.

The `std_dataset_ids` field contains the list of all dataset references featured in the current grid cell.

The `std_terms` field contains the list of descriptors featured in the current grid cell.

All properties are documented in the [data dictionary](https://github.com/skofic/data-dictionary-service.git).

#### Index

The collection features a Geo index on the `geometry` property and an index on the `geometry_point_radius` property.

### Dataset

This collection contains one record for each *dataset* featured in the database. A dataset represents a *set of indicators* belonging to the *same repository*, they must have the same *grid resolution* and share the same *time series resolution*. You have seen references to elements of this collection in almost all collections of the database.

#### Data

Records of this collection contain a set of fields that record the *metadata* of the *dataset*, this is a typical record example:

```json
{
  "_key": "/* Dataset identifier */",
  "_collection_list": [ "/* List of hosting collections */" ],
  "std_project": "/* Project acronym */",
  "std_dataset": "/* Dataset name or acronym */" ,
  "std_dataset_group": "/* Dataset group */",
  "std_date_submission": "/* Dataset submission date */",
  "std_date_start": "/* Period start date */",
  "std_date_end": "/* Period end date */",
  "_title": { "iso_639_3_eng": "/* Title in English */" },
  "_description": { "iso_639_3_eng": "/* Description in English */" },
  "_citation": [ "/* List of citations */" ],
  "_url": [ "/* List of URLs */" ],
  "count": "/* Number of records */",
  "std_terms": [ "/* List of featured terms */" ],
  "std_terms_key": [ "/* List of key terms */" ],
  "std_terms_quant": [ "/* List of quantitative terms */" ],
  "std_dataset_scope": "/* Dataset scope */",
  "std_dataset_extent": "/* Dataset extent */"
}
```

The `_key` contains the *primary key* of the record.

The `_collection_list` contains the *database collection names* in which *data* from the *current dataset* is stored.

The `std_project` represents the *code* of the *project* that is tasked to collect and provide data.

The `std_dataset` is the *public identifier* of the *dataset*.

The `std_dataset_group` is the *identifier* of the *group* to which the *current dataset belongs*.

The `std_date_submission` contains the *submission date* of the dataset in `YYYYMMDD` format, `Y` for the year, `M` for the month and `D` for the day.

The `std_date_start` and `std_date_end` represent the time series *start* and *end dates*, also in `YYYYMMDD` format.

The `_title` contains the multilingual dataset *title* or *label* in [Markdown](https://en.wikipedia.org/wiki/Markdown) format, note that `iso_639_3_eng` represents the *english language code*.

The `_description` contains the multilingual dataset *full description* in [Markdown](https://en.wikipedia.org/wiki/Markdown) format, note that `iso_639_3_eng` represents the *english language code*.

The `_citation` is an array of [Markdown](https://en.wikipedia.org/wiki/Markdown) texts that contain the *required* or *recommended* data *citations*.

The `_url` is an array that contains the *internet references* for the dataset.

The  `count` contains the dataset *data record count*.

The `std_terms` contains the *list* of featured *indicators*.

The `std_terms_key` contains the *list* of *terms* that *uniquely identify* each *record*.

The `std_terms_quant` contains the *list* of featured *quantitative indicators*.

The `std_dataset_scope` contains a code indicating the geographic shape of data.

The `std_dataset_extent` contains a code indicating the geographic region of the data.

#### View

The records are served and searched using a view:

```json
{
  "name": "VIEW_DATASET",
  "type": "arangosearch",
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
```

## Installation

1. You must first either install [ArangoDB](https://www.arangodb.com), or have an existing database available.
2. *Create* or *select* an existing *database*.
3. In the `Services` *left tab* press the `+ Add service` button.
4. Select the `GitHub` *top tab*, set the `Repository` field to **skofic/eufgis-environment-grid-services** and the `Version` field to **main**; press the `Install` button.
5. An alert will be presented requesting the `Mount point` for the service, you can provide *any suitable value*, ensure the `Run setup?` checkbox is *checked*. Press the `Install` button.

At this point the service will do the following actions:

1. It will create the necessary *collections*, if not already there:
    - The *Chelsa* collection that will hold all Chelsa data.
    - The *WorldClim* collection that will hold all WorldClim data.
    - The *DroughtObservatory*  collection to store EDO data.
    - The *DroughtObservatoryMap* collection to store the EDO grid.
    - The *Dataset* collection to store all datasets metadata.
2. It will create the necessary *views*, if not already there:
    - The *VIEW_DATASET* view to manage datasets metadata.

You will see that in the `Services` *left tab* there is a *top tab* called `Settings`: this can be used to *customise* the collection and view names.

## Services

Once the services are installed you will have an empty configured database and microservices to query the data.

To fill the data refer to this [repository](https://github.com/skofic/ClimateService.git). *Note that loading the database with data is a **VERY LONG** process and requires **A LOT** of **RESOURCES***.

The directory containing the services has the following elements:

- **`api`**: This directory contains a set of microservices definition documents, of which `GeoService API Document.paw`, a [RapidAPI](https://rapidapi.com) document, is the original. The directory contains also a [Postman](https://www.postman.com) version. The files contain example service calls.
- **`images`**: Images used in this README.md file.
- **`notes`**: Miscellaneous notes and files.

*All other files and directories* represent the source files, please refer to the [Foxx microservices documentation](https://docs.arangodb.com/stable/develop/foxx-microservices/) for more information. *Note that if you use the ArangoDB default user interface, all services are documented*.

The microservices are divided into the following sections:

### Chelsa

This section contains the services used to query and aggregate [Chelsa](https://chelsa-climate.org) data. Each record represents a 30 seconds arc grid cell containing historic and future modelled data covering yearly and monthly statistics.

Records are stored in the `Chelsa` collection and structured as follows:

- **`geometry_hash`**: This is the [MD5](https://en.wikipedia.org/wiki/MD5) hash of the `geometry_bounds` property, it represents the *primary key* of the record.
- **`geometry_point`**: This is the [GeoJSON](https://geojson.org) *point* corresponding to the *center* of the *grid cell*.
- **`geometry_bounds`**: This is the [GeoJSON](https://geojson.org) *polygon* of the *grid cell*.
- **`properties`**: This contains the *data indicators*:
    - ***`env_climate_ai`***: Aridity index.
    - ***`env_climate_bio01`***: Mean annual air temperature.
    - ***`env_climate_bio02`***: Mean diurnal air temperature range.
    - ***`env_climate_bio03`***: Isothermality.
    - ***`env_climate_bio04`***: Temperature seasonality.
    - ***`env_climate_bio05`***: Mean daily maximum air temperture of the warmest month.
    - ***`env_climate_bio06`***: Mean daily minimum air temperature of the coldest month.
    - ***`env_climate_bio07`***: Annual range of air temperature.
    - ***`env_climate_bio08`***: Mean daily mean air tempertures of the wettest quarter.
    - ***`env_climate_bio09`***: Mean daily mean air tempertures of the driest quarter.
    - ***`env_climate_bio10`***: Mean daily mean air tempertures of the warmest quarter.
    - ***`env_climate_bio11`***: Mean daily mean air tempertures of the coldest quarter.
    - ***`env_climate_bio12`***: Annual precipitation amount.
    - ***`env_climate_bio13`***: Precipitation amount of the wettest month.
    - ***`env_climate_bio14`***: Precipitation amount of the driest month.
    - ***`env_climate_bio15`***: Precipitation seasonality.
    - ***`env_climate_bio16`***: Mean monthly precipitation amount of the wettest quarter.
    - ***`env_climate_bio17`***: Mean monthly precipitation amount of the driest quarter.
    - ***`env_climate_bio18`***: Mean monthly precipitation amount of the warmest quarter.
    - ***`env_climate_bio19`***: Mean monthly precipitation amount of the coldest quarter.
    - ***`env_climate_clt_max`***: Maximum monthly total cloud cover.
    - ***`env_climate_clt_mean`***: Mean monthly total cloud cover.
    - ***`env_climate_clt_min`***: Minimum monthly total cloud cover.
    - ***`env_climate_clt_range`***: Annual range of monthly total cloud cover.
    - ***`env_climate_cmi_max`***: Maximum monthly climate moisture index.
    - ***`env_climate_cmi_mean`***: Mean monthly climate moisture index.
    - ***`env_climate_cmi_min`***: Minimum monthly climate moisture index.
    - ***`env_climate_cmi_range`***: Annual range of monthly climate moisture index.
    - ***`env_climate_fcf`***: Frost change frequency.
    - ***`env_climate_fgd`***: First day of the growing season.
    - ***`env_climate_gdd0`***: Growing degree days heat sum above 0°C.
    - ***`env_climate_gdd10`***: Growing degree days heat sum above 10°C.
    - ***`env_climate_gdd5`***: Growing degree days heat sum above 5°C.
    - ***`env_climate_gddlgd0`***: Last growing degree day above 0°C.
    - ***`env_climate_gddlgd10`***: Last growing degree day above 10°C.
    - ***`env_climate_gddlgd5`***: Last growing degree day above 5°C.
    - ***`env_climate_gdgfgd0`***: First growing degree day above 0°C.
    - ***`env_climate_gdgfgd10`***: First growing degree day above 10°C.
    - ***`env_climate_gdgfgd5`***: First growing degree day above 5°C.
    - ***`env_climate_gsl`***: Growing season length.
    - ***`env_climate_gsp`***: Accumulated precipiation amount on growing season days.
    - ***`env_climate_gst`***: Mean temperature of the growing season.
    - ***`env_climate_hurs_max`***: Maximum monthly near-surface relative humidity.
    - ***`env_climate_hurs_mean`***: Mean monthly near-surface relative humidity.
    - ***`env_climate_hurs_min`***: Minimum monthly near-surface relative humidity.
    - ***`env_climate_hurs_range`***: Annual range of monthly near-surface relative humidity.
    - ***`env_climate_kg0`***: Köppen-Geiger climate classification (kg0).
    - ***`env_climate_kg1`***: Köppen-Geiger climate classification (kg1).
    - ***`env_climate_kg2`***: Köppen-Geiger climate classification (kg2).
    - ***`env_climate_kg3`***: Köppen-Geiger climate classification (kg3).
    - ***`env_climate_kg4`***: Köppen-Geiger climate classification (kg4).
    - ***`env_climate_kg5`***: Köppen-Geiger climate classification (kg5).
    - ***`env_climate_lgd`***: Last day of the growing season.
    - ***`env_climate_ngd0`***: Number of growing degree days above 0°C.
    - ***`env_climate_ngd10`***: Number of growing degree days above 10°C.
    - ***`env_climate_ngd5`***: Number of growing degree days above 5°C.
    - ***`env_climate_npp`***: Net primary productivity.
    - ***`env_climate_pet_penman_max`***: Maximum monthly potential evapotranspiration.
    - ***`env_climate_pet_penman_mean`***: Mean monthly potential evapotranspiration.
    - ***`env_climate_pet_penman_min`***: Minimum monthly potential evapotranspiration.
    - ***`env_climate_pet_penman_range`***: Annual range of monthly potential evapotranspiration.
    - ***`env_climate_rsds_max`***: Maximum monthly surface downwelling shortwave flux in air.
    - ***`env_climate_rsds_mean`***: Mean monthly surface downwelling shortwave flux in air.
    - ***`env_climate_rsds_min`***: Minimum monthly surface downwelling shortwave flux in air.
    - ***`env_climate_rsds_range`***: Annual range of monthly surface downwelling shortwave flux in air.
    - ***`env_climate_sfcWind_max`***: Maximum monthly near-surface wind speed.
    - ***`env_climate_sfcWind_mean`***: Mean monthly near-surface wind speed.
    - ***`env_climate_sfcWind_min`***: Minimum monthly near-surface wind speed.
    - ***`env_climate_sfcWind_range`***: Annual range of monthly near-surface wind speed.
    - ***`env_climate_swb`***: Soil water balance.
    - ***`env_climate_swe`***: Snow water equivalent.
    - ***`env_climate_vpd_max`***: Maximum monthly vapor pressure deficit.
    - ***`env_climate_vpd_mean`***: Mean monthly vapor pressure deficit.
    - ***`env_climate_vpd_min`***: Minimum monthly vapor pressure deficit.
    - ***`env_climate_vpd_range`***: Annual range of monthly vapor pressure deficit.

This `properties` field is divided into four sections:

- `1981-2010`: Data *averages* for the *period* starting in 1981 and ending in 2010. *Monthly* data is available under the `std_date_span_month` property.
- `2011-2040`: *Future modelled averages* for the period starting in 2011 and ending in 2040. This property contains two additional *child sections* that indicate respectively the *climate scenario model* and the *shared socioeconomic pathway* used to *calculate the values*, the indicators are found under the latter level. *See the database Chelsa data section in this document for more information*.
- `2041-2070`: *Future modelled averages* for the period starting in 2041 and ending in 2070, the structure is the same as the previous section.
- `2071-2100`: *Future modelled averages* for the period starting in 2071 and ending in 2100, the structure is the same as the previous section.

All services, *except the first*, expect the following *path query parameter*:

- **`what`**: This *required* controlled vocabulary parameter determines the *type* of *service result*: either a *list of records* or the *aggregation of the selected records*:
    - *List of records*:
        - **`KEY`**: Return the *list* of *geometry hashes*, `geometry_hash`, or *primary key values*.
        - **`SHAPE`**: Returns the *geometry* information of the *selected records*:
            - `geometry_hash`: The [MD5](https://en.wikipedia.org/wiki/MD5) hash of the [GeoJSON](https://geojson.org) measurement area polygon, or *record primary key*.
            - `distance`: The *distance in meters* between the *centroids* of the provided *reference geometry* and the record's `geometry_point`.
            - `geometry_point`: The [GeoJSON](https://geojson.org) *center point* of the *grid cell*, `geometry_bounds`.
            - `geometry_bounds`: The [GeoJSON](https://geojson.org) *polygon* of the *grid cell*.
        - **`DATA`**: It will return the same properties as for `SHAPE`, plus the `properties` field that contains the indicators, as described above.
    - *Records aggregation*. The service will return a single record containing the following properties: `count`, the *number of records* in the selection; `distance`, the *aggregated distance* according to the `what` parameter and `properties`, containing the *indicators* as described above in the `properties` field *aggregated* according to the `what` parameter. Note that (*obviously*) only *quantitative indicators* will be returned
        - **`MIN`**: *Minimum*. 
        - **`AVG`**: Average.
        - **`MAX`**: *Maximum*.
        - **`STD`**: *Standard deviation*.
        - **`VAR`** *Variance*.

#### Contains point - `/chelsa/click`

This service can be used to get the *Chelsa record* that *contains* the *provided coordinates*, the service expects the latitude, `lat`, and longitude, `lon`, in *decimal degrees*, provided as *query parameters*. The service will return the record whose measurement bounding box, `geometry_bounds`, contains that point.

#### Is within distance - `/chelsa/dist`

The service will select all Chelsa records that lie within a *distance range* from the provided *reference geometry* query parameter, `geometry`. The distance is calculated from the *wgs84 centroids* of both the *reference geometry* and the Chelsa *grid cell center*, `geometry_point`.

The service expects the *default path query parameter*, **`what`**, plus the following *additional parameters*:

- **`min`**: This *required* parameter represents the range's *minimum distance*. The value is inclusive.
- **`max`**: This *required* parameter represents the range's *maximum distance*. The value is inclusive.
- **`sort`**: This *optional* parameter determines whether results should be *sorted* and in what *order*. The parameter is relevant only when the **`what`** parameter is `KEY`, `SHAPE` or `DATA`. The sort order uses the *distance*.

And the following *body parameters*:

- **`geometry`**: This *required* *body parameter* represents the [GeoJSON](https://geojson.org) *reference geometry* whose *centroid* will be used to select all Chelsa records *within* the provided *distance range*. It may be a *Point*, *MultiPoint*, *LineString*, *MultiLineString*, *Polygon* or *MultiPolygon*.
- **`start`**: This *optional* body parameter represents the *initial record index*, zero based, for returned selection of records, relevant only when the `what` parameter is `KEY`, `SHAPE` or `DATA`.
- **`limit`**: This *optional* body parameter represents the *number of records* to return, relevant only when the `what` parameter is `KEY`, `SHAPE` or `DATA`.

#### Is contained - `/chelsa/contain`

The service will select all Chelsa records whose *grid cell centroids*, `geometry_point`, are *fully contained* by the provided *reference geometry* query parameter, `geometry`.

The service expects the *same parameters* as the *above service*.

#### Intersects - `/chelsa/intersect`

The service will select all Chelsa records whose measurement area, `geometry_bounds`, *intersect* with the provided *reference geometry* query parameter, `geometry`.

The service expects the *same parameters* as the *above service*.

### WorldClim

This section contains the services used to query and aggregate [WorldClim](https://worldclim.org) data. Each record represents a 30 seconds arc grid cell containing *historic* and *future modelled* data covering *yearly* and *monthly* statistics.

Records are stored in the `WorldClim` collection and structured as follows:

- **`geometry_hash`**: This is the [MD5](https://en.wikipedia.org/wiki/MD5) hash of the `geometry_bounds` property, it represents the primary key of the record.
- **`geometry_point`**: This is the [GeoJSON](https://geojson.org) *point* corresponding to the *centroid* of the *grid cell*.
- **`geometry_bounds`**: This is the [GeoJSON](https://geojson.org) *polygon* of the *grid cell*.
- **`properties`**: This contains the *data properties*, this is the list of indicators:
    - ***`geo_shape_elevation`***: Mean elevation for the measurement area.
    - ***`env_climate_bio01`***: Mean annual air temperature.
    - ***`env_climate_bio02`***: Mean diurnal air temperature range.
    - ***`env_climate_bio03`***: Isothermality.
    - ***`env_climate_bio04`***: Temperature seasonality.
    - ***`env_climate_bio05`***: Mean daily maximum air temperture of the warmest month.
    - ***`env_climate_bio06`***: Mean daily minimum air temperature of the coldest month.
    - ***`env_climate_bio07`***: Annual range of air temperature.
    - ***`env_climate_bio08`***: Mean of daily mean air tempertures of the wettest quarter.
    - ***`env_climate_bio09`***: Mean of daily mean air tempertures of the driest quarter.
    - ***`env_climate_bio10`***: Mean of daily mean air tempertures of the warmest quarter.
    - ***`env_climate_bio11`***: Mean of daily mean air tempertures of the coldest quarter.
    - ***`env_climate_bio12`***: Annual precipitation amount.
    - ***`env_climate_bio13`***: Precipitation amount of the wettest month.
    - ***`env_climate_bio14`***: Precipitation amount of the driest month.
    - ***`env_climate_bio15`***: Precipitation seasonality.
    - ***`env_climate_bio16`***: Mean monthly precipitation amount of the wettest quarter.
    - ***`env_climate_bio17`***: Mean monthly precipitation amount of the driest quarter.
    - ***`env_climate_bio18`***: Mean monthly precipitation amount of the warmest quarter.
    - ***`env_climate_bio19`***: Mean monthly precipitation amount of the coldest quarter.
    - ***`env_climate_pr`***: Monthly precipitation amount.
    - ***`env_climate_srad`***: Solar radiation.
    - ***`env_climate_tas`***: Mean daily air temperature.
    - ***`env_climate_tasmax`***: Mean daily maximum air temperature.
    - ***`env_climate_tasmin`***: Mean daily minimum air temperature.
    - ***`env_climate_vapr`***: Water vapor pressure.
    - ***`env_climate_wind`***: Wind speed.

This `properties` field is divided into five sections:

- `1970-2000`: Data *averages* for the period starting in 1970 and ending in 2000. Monthly data is available under the `std_date_span_month` property.
- `2021-2040`: Future *modelled averages* for the period starting in 2021 and ending in 2040. This property contains two additional child sections that indicate respectively the *climate scenario model* and the *shared socioeconomic pathway* used to calculate the values, the indicators are found under the latter level. See the database WorldClim data section in this document for more information.
- `2041-2060`: *Future modelled averages* for the period starting in 2041 and ending in 2060, the structure is the same as the previous section.
- `2061-2080`: *Future modelled averages* for the period starting in 2061 and ending in 2080, the structure is the same as the previous section.
- `2081-2100`: *Future modelled averages* for the period starting in 2081 and ending in 2100, the structure is the same as the previous section.

All services, *except the first*, expect the following *path query parameter*:

- **`what`**: This *required* controlled vocabulary parameter determines the *type* of *service result*: either a *list of records* or the *aggregation of the selected records*:
  - *List of records*:
    - **`KEY`**: Return the *list* of *geometry hashes*, `geometry_hash`, or *primary key values*.
    - **`SHAPE`**: Returns the *geometry* information of the *selected records*:
      - `geometry_hash`: The [MD5](https://en.wikipedia.org/wiki/MD5) hash of the [GeoJSON](https://geojson.org) measurement area polygon, or *record primary key*.
      - `distance`: The *distance in meters* between the *centroids* of the provided *reference geometry* and the record's `geometry_point`.
      - `geometry_point`: The [GeoJSON](https://geojson.org) *center point* of the *grid cell*, `geometry_bounds`.
      - `geometry_bounds`: The [GeoJSON](https://geojson.org) *polygon* of the *grid cell*.
    - **`DATA`**: It will return the same properties as for `SHAPE`, plus the `properties` field that contains the indicators, as described above.
  - *Records aggregation*. The service will return a single record containing the following properties: `count`, the *number of records* in the selection; `distance`, the *aggregated distance* according to the `what` parameter and `properties`, containing the *indicators* as described above in the `properties` field *aggregated* according to the `what` parameter. Note that (*obviously*) only *quantitative indicators* will be returned
    - **`MIN`**: *Minimum*. 
    - **`AVG`**: Average.
    - **`MAX`**: *Maximum*.
    - **`STD`**: *Standard deviation*.
    - **`VAR`** *Variance*.

#### Contains point - `/worldclim/click`

This service can be used to get the *WorldClim record* that *contains* the *provided coordinates*, the service expects the latitude, `lat`, and longitude, `lon`, in *decimal degrees*, provided as *query parameters*. The service will return the record whose measurement bounding box, `geometry_bounds`, contains that point.

#### Is within distance - `/worldclim/dist`

The service will select all WorldClim records that lie within a *distance range* from the provided *reference geometry* query parameter, `geometry`. The distance is calculated from the *wgs84 centroids* of both the *reference geometry* and the Chelsa *grid cell center*, `geometry_point`.

The service expects the *default path query parameter*, **`what`**, plus the following *additional parameters*:

- **`min`**: This *required* parameter represents the range's *minimum distance*. The value is inclusive.
- **`max`**: This *required* parameter represents the range's *maximum distance*. The value is inclusive.
- **`sort`**: This *optional* parameter determines whether results should be *sorted* and in what *order*. The parameter is relevant only when the **`what`** parameter is `KEY`, `SHAPE` or `DATA`. The sort order uses the *distance*.

And the following *body parameters*:

- **`geometry`**: This *required* *body parameter* represents the [GeoJSON](https://geojson.org) *reference geometry* whose *centroid* will be used to select all WorldClim records *within* the provided *distance range*. It may be a *Point*, *MultiPoint*, *LineString*, *MultiLineString*, *Polygon* or *MultiPolygon*.
- **`start`**: This *optional* body parameter represents the *initial record index*, zero based, for returned selection of records, relevant only when the `what` parameter is `KEY`, `SHAPE` or `DATA`.
- **`limit`**: This *optional* body parameter represents the *number of records* to return, relevant only when the `what` parameter is `KEY`, `SHAPE` or `DATA`.

#### Is contained - `/worldclim/contain`

The service will select all WorldClim records whose *grid cell centroids*, `geometry_point`, are *fully contained* by the provided *reference geometry* query parameter, `geometry`.

The service expects the *same parameters* as the *above service*.

#### Intersects - `/worldclim/intersect`

The service will select all WorldClim records whose measurement area, `geometry_bounds`, *intersect* with the provided *reference geometry* query parameter, `geometry`.

The service expects the *same parameters* as the *above service*.

### European Drought Observatory Metadata

[European Drought Observatory](https://edo.jrc.ec.europa.eu/edov2/php/index.php?id=1000) data is provided in a grid, the idea is that users can provide a point or shape and get in real time a set of data. The purpose of these services is to provide *aggregated information* before performing queries on the actual data.

The reason these services are important is that there is a very large amount of data associated with each point of the grid, it is therefore a good practice to retrieve a window of data selected using a user interface that limits which descriptors are returned and for which data time frame.

Data is stored in two related collections: `DroughtObservatory` groups data by grid cell geometry and date, all dates are daily; `DroughtObservatoryMap` contains the geometry of all grid cells. Services are designed to first probe the grid and then associate data related to the selected cells.

The grid features cells of three different resolutions, so whenever you select a point on the map you should have at least three grid cells that contain that point, the services will either return the *summary data* grouped by *date*, or by *date* and *grid cell resolution*.

All services select data according to a set of *query parameters* provided in the body, omit any to ignore:

- ***`std_date_start`***: Time frame start date (included).
- ***`std_date_end`***: Time frame end date (included).
- ***`std_terms`***: List of variables to match.
- ***`std_dataset_ids`***: List of datasets to match.
- ***`geometry_point_radius`***: List of grid cell resolutions to match, in degrees.

#### Metadata for resolution - `/do/meta/resolution`

This service will return the *list* of *all grid resolutions* featured by the European Drought Observatory data, and the [number of grid cells]() for each resolution.

The service does not require any parameter.

The result of the service will be an array of objects structured as follows:

- ***`geometry_point_radius`***: Grid *resolution* expressed as the *distance between two adjacent grid cell centroids*, *divided by 2* and expressed in *decimal degrees*.
- ***`count`***: Total number of grid cells featuring that resolution.

The `geometry_point_radius` value is used as a parameter to other Drought Observatory data and metadata services to filter results by grid cell resolution.

#### Metadata for coordinates - `/do/meta`

This service will return the *aggregated data summary* for the data *corresponding* to the *provided coordinates* and *query parameters*.

The service expects the point coordinates as path query parameters: `lat` for the *latitude* and `lon` for the *longitude*. The *query parameters* can be added in the body, as described above.

The result of the service will be the *aggregated summary* for all grid cells that contain the provided point, the structure is as follows:

- ***`count`***: Number of measurements.
- ***`std_date_start`***: Date range start.
- ***`std_date_end`***: Date range end.
- ***`std_terms`***: List of featured indicators.
- ***`std_dataset_ids`***: List of featured datasets.
- ***`geometry_point_radius`***: List of featured grid cell radius in decimal degrees.
- ***`geometry_point`***: List of grid cell centroids as [GeoJSON](https://geojson.org) point geometries.
- ***`geometry_bounds`***: List of grid cell geometries as [GeoJSON](https://geojson.org) polygons.

#### Metadata by geometry for coordinates - `/do/meta/shape`

This service will return the *aggregated data summary* for the data *corresponding* to the *provided coordinates* and *query parameters* grouped *by grid cell resolution*.

The service expects the point coordinates as path query parameters: `lat` for the *latitude* and `lon` for the *longitude*. The *query parameters* can be added in the body, as described above.

The service will return the *aggregated summary* data, *one record for each grid cell* that *contains the provided point* with the following structure:

- ***`count`***: Number of measurements.
- ***`std_date_start`***: Date range start.
- ***`std_date_end`***: Date range end.
- ***`std_terms`***: List of featured indicators.
- ***`std_dataset_ids`***: List of featured datasets.
- ***`geometry_point_radius`***: Grid cell radius in decimal degrees.
- ***`geometry_point`***: [GeoJSON](https://geojson.org) point geometry of the grid cell centroid.
- ***`geometry_bounds`***: [GeoJSON](https://geojson.org) polygon geometry of the grid cell.

### European Drought Observatory Data

This set of services can be used to retrieve *drought observatory data* by *grid cell*, or *aggregated* by *date*.

Both services expect a point whose coordinates are provided as path query parameters: `lat` for the *latitude* and `lon` for the *longitude*. Data can be further refined using a set of query parameters provided in the body, omit to ignore.

#### Data by geometry - `/do/sata/shape`

This service will return the data for all grid cells that contain the point provided in the path query parameters and that satisfy the eventual query parameters in the body structured as follows:

- ***`std_date_start`***: Date range start.
- ***`std_date_end`***: Date range end.
- ***`std_terms`***: List of featured indicators.
- ***`std_dataset_ids`***: List of featured datasets.
- ***`geometry_point_radius`***: List of featured grid cell radius in decimal degrees.

The result will be one record per matching grid cell:

- ***`geometry_point_radius`***: Grid cell radius in decimal degrees.
- ***`geometry_point`***: [GeoJSON](https://geojson.org) point geometry of the grid cell centroid.
- ***`geometry_bounds`***: [GeoJSON](https://geojson.org) polygon geometry of the grid cell.
- ***`std_dataset_ids`***: List of featured datasets.
- ***`properties`***: An array of time series data with the date, `std_date`, and the data indicators available for that date.

This service returns data for individual geometries.

#### Data by date - `/do/data/date`

This service will return the aggregated data for all grid cells that contain the point provided in the path query parameters and that satisfy the eventual query parameters in the body structured as follows:

- ***`std_date_start`***: Date range start.
- ***`std_date_end`***: Date range end.
- ***`std_terms`***: List of featured indicators.
- ***`std_dataset_ids`***: List of featured datasets.
- ***`geometry_point_radius`***: List of featured grid cell radius in decimal degrees.
- ***`paging`***: Results paging:
    - ***`offset`***: Page records offset.
    - ***`limit`***: Maximum number of records to return.

The result will be one record per date:

- ***`std_date`***: The date.
- ***`properties`***: Data indicators for that date.
- ***`std_dataset_ids`***: List of featured datasets for that date.

This service returns data for all geometries.

### Datasets

This set of services will return metadata regarding the datasets featured in the `Dataset` collection and the other external databases collections.

A dataset record has the following structure:

- ***`_key`***: The dataset primary key string.
- ***`_collection_list`***: Database collection names where data for this dataset is stored.
- ***`std_project`***: Code of the project to which the dataset belongs.
- ***`std_dataset`***: Dataset code or acronym.
- ***`std_dataset_group`***: Dataset group code or acronym.
- ***`_subjects`***: List of subject codes featured in data descriptors.
- ***`_classes`***: List of class codes featured in data descriptors.
- ***`_domain`***: List of domain codes featured in data descriptors.
- ***`_tag`***: List of tag codes featured in data descriptors.
- ***`std_date_start`***: Dates range start.
- ***`std_date_end`***: Dates range end.
- ***`std_date_submission`***: Dataset submission date.
- ***`count`***: Total number of data records.
- ***`_title`***: Multilingual title or label.
- ***`_description`***: Multilingual description.
- ***`_citation`***: List of required citations.
- ***`std_terms`***: List of featured indicators.
- ***`std_terms_quant`***: List of featured quantitative indicators.
- ***`std_terms_key`***: List of indicators that represent the unique key of a record.
- ***`std_terms_summary`***: List of indicators that can be used for groupings and summaries.
- ***`_subject`***: Dataset data subject.
- ***`species_list`***: List of featured taxa scientific names.
- ***`std_dataset_markers`***: List of taxa/marker combinations:
  - ***`species`***: Scientific name.
  - ***`chr_GenIndex`***: Genetic index.
  - ***`chr_GenoTech`***: Method.
  - ***`chr_MarkerType`***: Type of Marker/Trait.
  - ***`chr_NumberOfLoci`***: Number of loci.
  - ***`chr_SequenceLength`***: Sequence length.

Note that datasets belonging to external databases and EUFGIS characterisation datasets feature a different set of descriptors, the above selection encompasses both types.

#### Query datasets - `/dataset/query`

This service will return all *external database dataset records* matching the query parameters provided in the body. A *path query parameter*, `op`, determines whether the condition clauses are concatenated as a series of `AND` or `OR` clauses.

The selection criteria is structured as follows:

- ***`_key`***: The dataset primary key string.
- ***`_collection_list`***: Database collection names where data for this dataset is stored.
- ***`std_project`***: Code of the project to which the dataset belongs.
- ***`std_dataset`***: Dataset code or acronym.
- ***`std_dataset_group`***: Dataset group code or acronym.
- ***`std_date`***: Date range:
  - ***`std_date_start`***: Start date (included).
  - ***`std_date_end`***: End date (included).
- ***`std_date_submission`***: Submission date range:
  - ***`std_date_start`***: Start date (included).
  - ***`std_date_end`***: End date (included).
- ***`count`***: Total number of data records:
  - ***`min`***: Minimum (included).
  - ***`max`***: Maximum (included).
- ***`_subject`***: List of matching dataset data subjects.
- ***`_classes`***: Class codes featured in data descriptors:
  - ***`items`***: List of codes to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.
- ***`_domain`***: Domain codes featured in data descriptors:
  - ***`items`***: List of codes to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.
- ***`_tag`***: Tag codes featured in data descriptors:
  - ***`items`***: List of codes to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.
- ***`_title`***: Provide space delimited keywords to search dataset titlein English.
- ***`_description`***: Provide space delimited keywords to search dataset description in English.
- ***`_citation`***: Provide space delimited keywords to search dataset citations.
- ***`species_list`***: Provide space delimited keywords to search scientific names.
- ***`std_terms`***: Featured indicators:
  - ***`items`***: List of names to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.
- ***`std_terms_key`***: Featured key indicators:
  - ***`items`***: List of names to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.
- ***`std_terms_quant`***: Featured quantitative indicators:
  - ***`items`***: List of names to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.
- ***`std_terms_summary`***: Featured summary indicators:
  - ***`items`***: List of names to match.
  - ***`doAll`***: `true` means all elements must match; `false` means at least one should match.

## Progress

This is a work in progress, so expect this document to grow and change over time.

## Licence

Copyright (c) 2026 Milko Škofič

License: Apache 2
