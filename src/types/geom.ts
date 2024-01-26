interface GeoJSONPoint {
  type: 'Point'
  coordinates: [number, number]
}

interface GeoJSONMultiPoint {
  type: 'MultiPoint'
  coordinates: [number, number][]
}

interface GeoJSONLineString {
  type: 'LineString'
  coordinates: [number, number][]
}

interface GeoJSONMultiLineString {
  type: 'MultiLineString'
  coordinates: [number, number][][]
}

interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: [number, number][][]
}

interface GeoJSONMultiPolygon {
  type: 'MultiPolygon'
  coordinates: [number, number][][][]
}

interface GeoJSONGeometryCollection {
  type: 'GeometryCollection'
  geometries: GeoJSONGeometry[]
}

type GeoJSONGeometry =
  | GeoJSONPoint
  | GeoJSONMultiPoint
  | GeoJSONLineString
  | GeoJSONMultiLineString
  | GeoJSONPolygon
  | GeoJSONMultiPolygon
  | GeoJSONGeometryCollection

interface GeoJSONFeatureProperties {
  [key: string]: any
}

interface GeoJSONFeature {
  type: 'Feature'
  geometry: GeoJSONGeometry
  properties?: GeoJSONFeatureProperties
  id?: string | number
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

type GeoJSON =
  | GeoJSONPoint
  | GeoJSONMultiPoint
  | GeoJSONLineString
  | GeoJSONMultiLineString
  | GeoJSONPolygon
  | GeoJSONMultiPolygon
  | GeoJSONFeature
  | GeoJSONFeatureCollection

export type {
  GeoJSON,
  GeoJSONFeatureProperties,
  GeoJSONPoint,
  GeoJSONMultiPoint,
  GeoJSONLineString,
  GeoJSONMultiLineString,
  GeoJSONPolygon,
  GeoJSONMultiPolygon,
  GeoJSONFeature,
  GeoJSONFeatureCollection
}
