import type { IReportMapBandwidthAreaProperties, IReportMapBandwidthLinkProperties, IReportMapBandwidthSegmentNonLambdaProperties, IReportMapBandwidthSegmentProperties } from '@/types'
import type { GeoJSONFeature, GeoJSONFeatureProperties } from '@/types/geom'
import L from 'leaflet'
import _ from 'lodash'

const choroplethStyle = (geoJsonProps?: GeoJSONFeatureProperties) => (feature: any) => {
  const props = geoJsonProps as IReportMapBandwidthAreaProperties
  const densityColor = props?.utilization_range?.color || '#FFFFFF'

  return {
    fillColor: densityColor,
    weight: 2,
    opacity: 1,
    color: '#EEE',
    dashArray: '',
    fillOpacity: 0.5
  }
}

const highlightFeature = (e: any) => {
  const layer = e.target

  layer.setStyle({
    weight: 5,
    // color: layer.options.fillColor,
    dashArray: '',
    fillOpacity: 0.5
  })

  layer.bringToFront()
}

const resetHighlight = (geojson: L.GeoJSON) => (e: any) => {
  geojson.resetStyle(e.target)
}

const createChoroplethFromAreaGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: choroplethStyle(geom.properties)
  }).bindPopup(function () {
    const props = geom.properties as IReportMapBandwidthAreaProperties
    return `<div style="max-height: 300px; overflow: auto;">
    <table class="metadata">
      <tbody>
        <tr>
          <td>City</td>
          <td>${props?.city ?? ''}</td>
        </tr>
        <tr>
          <td>Kota Lambda</td>
          <td>${props?.is_lambda ?? ''}</td>
        </tr>
        <tr>
          <td>Primary Capacity (Mbps)</td>
          <td>${props?.primary_capacity ?? ''}</td>
        </tr>
        <tr>
          <td>Category Utilization</td>
          <td>${props?.category_utilization ?? ''}</td>
        </tr>
        <tr>
          <td>Total Coverage FO (Km)</td>
          <td>${props?.panjang_fo ?? ''}</td>
        </tr>
        <tr>
          <td>Jumlah Opty</td>
          <td>${props?.jumlah_opty ?? ''}</td>
        </tr>
        <tr>
          <td>Jumlah SIA</td>
          <td>${props?.jumlah_sia ?? ''}</td>
        </tr>
        <tr>
          <td>Total Estimasi TAM</td>
          <td>${props?.total_tam ?? ''}</td>
        </tr>
        <tr>
          <td>Total Saldo</td>
          <td>${props?.total_saldo ?? ''}</td>
        </tr>
        <tr>
          <td>Province</td>
          <td>${props?.province ?? ''}</td>
        </tr>
        <tr>
          <td>Area</td>
          <td>${props?.area ?? ''}</td>
        </tr>
        <tr>
          <td>Region</td>
          <td>${props?.region ?? ''}</td>
        </tr>
        <tr>
          <td>Primary Link</td>
          <td>${props?.primary_link ?? ''}</td>
        </tr>
      </tbody>
    </table>
    </div>`
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

const createLinkFromGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: {
      color: geom.properties?.utilization_range?.color || '#000000',
      weight: 5,
      opacity: 0.8
    }
  }).bindPopup(function () {
    const props = geom.properties as IReportMapBandwidthLinkProperties
    return `
    <div style="max-height: 300px; overflow: auto;">
    <table class="metadata">
    <tbody>
      <tr>
        <td>Primary Capacity (Mbps)</td>
        <td>${props?.primary_capacity ?? ''}</td>
      </tr>
      <tr>
        <td>Category Utilization</td>
        <td>${props?.category_utilization ?? ''}</td>
      </tr>
      <tr>
        <td>Segment City</td>
        <td>${props?.segment_city ?? ''}</td>
      </tr>
      <tr>
        <td>City</td>
        <td>${props?.city ?? ''}</td>
      </tr>
      <tr>
        <td>Area</td>
        <td>${props?.area ?? ''}</td>
      </tr>
      <tr>
        <td>Pulau</td>
        <td>${props?.pulau ?? ''}</td>
      </tr>
      <tr>
        <td>Region</td>
        <td>${props?.region ?? ''}</td>
      </tr>
      <tr>
        <td>Name</td>
        <td>${props?.unique_link ?? ''}</td>
      </tr>
      <tr>
        <td>Primary Link</td>
        <td>${props?.primary_link ?? ''}</td>
      </tr>
      <tr>
        <td>Bandwidth (Mbps)</td>
        <td>${props?.bandwidth_mbps ?? ''}</td>
      </tr>
      <tr>
        <td>Occupancy (Mbps)</td>
        <td>${props?.occupancy_mbps ?? ''}</td>
      </tr>
      <tr>
        <td>Jenis Trunk</td>
        <td>${props?.jenis_trunk ?? ''}</td>
      </tr>
      <tr>
        <td>Segmen Lambda</td>
        <td>${props?.segment_lambda ?? ''}</td>
      </tr>
      <tr>
        <td>Device Type</td>
        <td>${props?.device_type ?? ''}</td>
      </tr>
      <tr>
        <td>Provider Pihak ke-3</td>
        <td>${props?.provider_name ?? ''}</td>
      </tr>
    </tbody>
    </table>
    </div>
    `
  })

  // trigger event
  _.each(geojson.getLayers(), (layer) => {
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

const createSegmentFromGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: {
      color: geom.properties?.utilization_range?.color || '#000000',
      weight: 5,
      opacity: 0.8
    }
  }).bindPopup(function () {
    const props = geom.properties as IReportMapBandwidthSegmentProperties
    return `
    <div style="max-height: 300px; overflow: auto;">
      <table class="metadata">
      <tbody>
        <tr>
          <td>Name</td>
          <td>${props?.cable_name ?? ''}</td>
        </tr>
        <tr>
          <td>Category Utilization</td>
          <td>${props?.category_utilization ?? ''}</td>
        </tr>
        <tr>
          <td>Category</td>
          <td>${props?.cable_category ?? ''}</td>
        </tr>
        <tr>
          <td>Cable Core</td>
          <td>${props?.cable_core ?? ''}</td>
        </tr>
        <tr>
          <td>Total Trunk</td>
          <td>${props?.total_trunk ?? ''}</td>
        </tr>
        <tr>
          <td>Total Opty</td>
          <td>${props?.total_opty ?? ''}</td>
        </tr>
        <tr>
          <td>Total SIA</td>
          <td>${props?.total_sia ?? ''}</td>
        </tr>
        <tr>
          <td>Length (m)</td>
          <td>${props?.cable_measurement_length ?? ''}</td>
        </tr>
        <tr>
          <td>PO Number</td>
          <td>${props?.pic_name ?? ''}</td>
        </tr>
        <tr>
          <td>Primary Capacity (Mbps)</td>
          <td>${props?.primary_capacity ?? ''}</td>
        </tr>
        <tr>
          <td>City</td>
          <td>${props?.city ?? ''}</td>
        </tr>
        <tr>
          <td>Province</td>
          <td>${props?.province ?? ''}</td>
        </tr>
        <tr>
          <td>Area</td>
          <td>${props?.area ?? ''}</td>
        </tr>
        <tr>
          <td>Status Migrasi Data</td>
          <td>${props?.status_migrasi_data ?? ''}</td>
        </tr>
        <tr>
          <td>POP</td>
          <td>${props?.pop ?? ''}</td>
        </tr>
      </tbody>
      </table>
    </div>
    `
  })

  // trigger event
  _.each(geojson.getLayers(), (layer) => {
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

const createSegmentNonLambdaFromGeom = (geom: GeoJSONFeature) => {
  const geojson = L.geoJSON(geom, {
    style: {
      color: geom.properties?.utilization_range?.color || '#000000',
      weight: 5,
      opacity: 0.8
    }
  }).bindPopup(function () {
    const props = geom.properties as IReportMapBandwidthSegmentNonLambdaProperties
    return `
    <div style="max-height: 300px; overflow: auto;">
      <table class="metadata">
      <tbody>
        <tr>
          <td>Name</td>
          <td>${props?.cable_name ?? ''}</td>
        </tr>
        <tr>
          <td>Category Utilization</td>
          <td>${props?.category_utilization ?? ''}</td>
        </tr>
        <tr>
          <td>Cable Category</td>
          <td>${props?.cable_category ?? ''}</td>
        </tr>
        <tr>
          <td>Cable Core</td>
          <td>${props?.cable_core ?? ''}</td>
        </tr>
        <tr>
          <td>Total Trunk</td>
          <td>${props?.total_trunk ?? ''}</td>
        </tr>
        <tr>
          <td>Total Opty</td>
          <td>${props?.total_opty ?? ''}</td>
        </tr>
        <tr>
          <td>Total SIA</td>
          <td>${props?.total_sia ?? ''}</td>
        </tr>
        <tr>
          <td>Cable Measurement Length</td>
          <td>${props?.cable_measurement_length ?? ''}</td>
        </tr>
        <tr>
          <td>PIC Name</td>
          <td>${props?.pic_name ?? ''}</td>
        </tr>
        <tr>
          <td>Primary Capacity</td>
          <td>${props?.primary_capacity ?? ''}</td>
        </tr>
        <tr>
          <td>City</td>
          <td>${props?.city ?? ''}</td>
        </tr>
        <tr>
          <td>Province</td>
          <td>${props?.province ?? ''}</td>
        </tr>
        <tr>
          <td>Area</td>
          <td>${props?.area ?? ''}</td>
        </tr>
        <tr>
          <td>Status Migrasi Data</td>
          <td>${props?.status_migrasi_data ?? ''}</td>
        </tr>
        <tr>
          <td>POP</td>
          <td>${props?.pop ?? ''}</td>
        </tr>
      </tbody>
      </table>
    </div>
    `
  })

  // trigger event
  _.each(geojson.getLayers(), (layer) => {
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
  createChoroplethFromAreaGeom,
  createLinkFromGeom,
  createSegmentFromGeom,
  createSegmentNonLambdaFromGeom
}
