/********* THIS IS AN AUTO GENERATED FILE *********/
/* eslint-disable */
import * as path from 'path';

// prettier-ignore
export const geoschema = {
  /** The path to the original schema file. */
  schemaPath: path.resolve(__dirname, "geoschema.xml"),
  /** The path to the original charting scheme file. */
  chartingSchemePath: path.resolve(__dirname, "geoschema - ChartingSchemes.xml"),
  entityTypes: {
    AnalystsNotebookChart: {
      id: "CHART",
      isLink: false,
      propertyTypes: {
        "Name": { id: "CHART1", logicalType: "singleLineString", },
        "Description": { id: "CHART2", logicalType: "multipleLineString", },
      }
    },
    Location: {
      id: "ET1",
      isLink: false,
      propertyTypes: {
        "Location_Name": { id: "PT1", logicalType: "singleLineString", },
        "Description": { id: "PT6", logicalType: "singleLineString", },
        "Latitude": { id: "PT3", logicalType: "singleLineString", },
        "Longitude": { id: "PT4", logicalType: "singleLineString", },
        "MGRS": { id: "PT5", logicalType: "singleLineString", },
        "What3Words": { id: "PT7", logicalType: "singleLineString", },
        "Comments": { id: "PT2", logicalType: "multipleLineString", },
      }
    },
  },
  linkTypes: {

  }
} as const;
