import type { IReportMapBandwidthAreaProperties } from '@/types'
import type { GeoJSONFeature, GeoJSONFeatureProperties } from '@/types/geom'
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

const choroplethStyle = (geoJsonProps?: GeoJSONFeatureProperties) => (feature: any) => {
  const props = geoJsonProps as IReportMapBandwidthAreaProperties
  const densityColor = props?.utilization_range?.color || getColorDensity(Math.random() * 1000)

  return {
    fillColor: densityColor,
    weight: 2,
    opacity: 1,
    color: densityColor,
    dashArray: '',
    fillOpacity: 0.5
  }
}

const highlightFeature = (e: any) => {
  const layer = e.target

  layer.setStyle({
    weight: 5,
    color: layer.options.fillColor,
    dashArray: '',
    fillOpacity: 0.5
  })

  layer.bringToFront()
}

const resetHighlight = (geojson: L.GeoJSON) => (e: any) => {
  geojson.resetStyle(e.target)
}

const createChoroplethFromCityGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: choroplethStyle(geom.properties)
  }).bindPopup(function () {
    // return geom?.properties?.city || ''
    return `<table class="metadata">
    <tbody>
      <tr>
        <td>Pulau</td>
        <td>${geom.properties?.pulau}</td>
      </tr>
      <tr>
        <td>Province</td>
        <td>${geom.properties?.province}</td>
      </tr>
      <tr>
        <td>City</td>
        <td>${geom.properties?.city}</td>
      </tr>
      <tr>
        <td>Is Lambda</td>
        <td>${geom.properties?.is_lambda}</td>
      </tr>
      <tr>
        <td>Capacity (Mbps)</td>
        <td>${geom.properties?.real_capacity}</td>
      </tr>
      <tr>
        <td>Region</td>
        <td>${geom.properties?.region}</td>
      </tr>
      <tr>
        <td>Category Utilization</td>
        <td>${geom.properties?.category_utilization}</td>
      </tr>
    </tbody>
    </table>`
  })

  // trigger event
  _.each(geojson.getLayers(), (layer) => {
    layer.on('mouseover', highlightFeature)
    layer.on('mouseout', resetHighlight(geojson))

    // when popup opened
    layer.on('popupopen', () => {
      window.dispatchEvent(
        new CustomEvent('popupopen', {
          detail: {
            id: geom?.properties?.id
          }
        })
      )
    })

    // whem popup closed
    layer.on('popupclose', () => {
      window.dispatchEvent(
        new CustomEvent('popupclose', {
          detail: {
            id: geom?.properties?.id
          }
        })
      )
    })
  })

  // add listener popupopen:id fired
  geojson.addEventListener(`popupopen:${geom?.properties?.id}`, () => {
    geojson.openPopup()
  })

  return geojson
}

const createLineFromGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: {
      color: geom.properties?.utilization_range?.color,
      weight: 2,
      opacity: 0.8
    }
  }).bindPopup(function () {
    return `
    <div style="max-height: 300px; overflow: auto;">
    <table class="metadata">
    <tbody>
      <tr>
        <td>Name</td>
        <td>${geom.properties?.name}</td>
      </tr>
      <tr>
        <td>Pulau</td>
        <td>${geom.properties?.pulau}</td>
      </tr>
      <tr>
        <td>Province</td>
        <td>${geom.properties?.province}</td>
      </tr>
      <tr>
        <td>City</td>
        <td>${geom.properties?.city}</td>
      </tr>
      <tr>
        <td>Region</td>
        <td>${geom.properties?.region}</td>
      </tr>
      <tr>
        <td>Segment</td>
        <td>${geom.properties?.segment}</td>
      </tr>
      <tr>
        <td>Segment Type</td>
        <td>${geom.properties?.segment_type}</td>
      </tr>
      <tr>
        <td>Cable Category</td>
        <td>${geom.properties?.cable_category}</td>
      </tr>
      <tr>
        <td>Length Cable Estimation</td>
        <td>${geom.properties?.length_cable_estimation}</td>
      </tr>
      <tr>
        <td>Line Bandwidth Ossera Y Category Utilization</td>
        <td>${geom.properties?.line_bandwidth_ossera_y_category_utilization}</td>
      </tr>
      <tr>
        <td>Line Bandwidth Ossera Real Capacity</td>
        <td>${geom.properties?.line_bandwidth_ossera_real_capacity}</td>
      </tr>
      <tr>
        <td>Bandwidth</td>
        <td>${geom.properties?.bandwidth}</td>
      </tr>
      <tr>
        <td>Occupancy</td>
        <td>${geom.properties?.occupancy}</td>
      </tr>
      <tr>
        <td>Utilization</td>
        <td>${geom.properties?.utilization}</td>
      </tr>
      <tr>
        <td>Real Capacity</td>
        <td>${geom.properties?.real_capacity}</td>
      </tr>
    </tbody>
    </table>
    </div>
    `
  })

  // trigger event
  _.each(geojson.getLayers(), (layer) => {
    layer.on('mouseover', highlightFeature)
    layer.on('mouseout', resetHighlight(geojson))

    // when popup opened
    layer.on('popupopen', () => {
      window.dispatchEvent(
        new CustomEvent('popupopen', {
          detail: {
            id: geom?.properties?.id
          }
        })
      )
    })

    // whem popup closed
    layer.on('popupclose', () => {
      window.dispatchEvent(
        new CustomEvent('popupclose', {
          detail: {
            id: geom?.properties?.id
          }
        })
      )
    })
  })

  // add listener popupopen:id fired
  geojson.addEventListener(`popupopen:${geom?.properties?.id}`, () => {
    geojson.openPopup()
  })

  return geojson
}

export {
  choroplethStyle,
  highlightFeature,
  resetHighlight,
  createChoroplethFromCityGeom,
  createLineFromGeom
}
