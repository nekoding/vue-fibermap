import type { GeoJSONFeature } from '@/types/geom'
import L from 'leaflet'
import _ from 'lodash'

const getColorDensity = (density: number) => {
  return density > 1000
    ? '#800026'
    : density > 500
      ? '#BD0026'
      : density > 200
        ? '#E31A1C'
        : density > 100
          ? '#FC4E2A'
          : density > 50
            ? '#FD8D3C'
            : density > 20
              ? '#FEB24C'
              : density > 10
                ? '#FED976'
                : '#FFEDA0'
}

const choroplethStyle = (feature: any) => {
  const densityColor = getColorDensity(Math.random() * 1000)

  return {
    fillColor: densityColor,
    weight: 2,
    opacity: 1,
    color: densityColor,
    dashArray: '',
    fillOpacity: 0.7
  }
}

const highlightFeature = (e: any) => {
  const layer = e.target

  layer.setStyle({
    weight: 5,
    color: layer.options.fillColor,
    dashArray: '',
    fillOpacity: 0.7
  })

  layer.bringToFront()
}

const resetHighlight = (geojson: L.GeoJSON) => (e: any) => {
  geojson.resetStyle(e.target)
}

const createChoroplethFromCityGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: choroplethStyle
  }).bindPopup(function () {
    return geom?.properties?.name || ''
  })

  // trigger event
  _.each(geojson.getLayers(), (layer) => {
    layer.on('mouseover', highlightFeature)
    layer.on('mouseout', resetHighlight(geojson))
  })

  // add custom label
  const bounds = geojson.getBounds()
  const label = L.marker(bounds.getCenter(), {
    icon: L.divIcon({
      className: 'yellow-stroke',
      html: '<div>' + geom?.properties?.name || '' + '</div>'
    })
  })

  return [geojson, label]
}

export { choroplethStyle, highlightFeature, resetHighlight, createChoroplethFromCityGeom }
