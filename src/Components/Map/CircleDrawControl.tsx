import { GeoJSONObject } from '@turf/turf'
import React, { FC } from 'react'
import { CircleLayer, Layer, LineLayer, Source } from 'react-map-gl'
import { GeoJsonType } from 'react-map-gl-draw'

type CircleDrawProps = {
    circle:GeoJSONObject
    line:GeoJSONObject | undefined
}

const CircleDrawControl: FC<CircleDrawProps> = ({circle,line}) => {

    const layer: CircleLayer = {
        id: 'my-layer',
        type: 'circle',
        paint: {
          'circle-color': '#0000ff',
          'circle-radius': 5,
        }
    }

    const lineLayer : LineLayer = React.useMemo(
        () => ({
          id: 'car-path',
          type: 'line',
          paint: {
            'line-color': '#32CD32',
            'line-width': 3,
            'line-dasharray': [2, 2]
          },
        }),
        []
      );

  return (
    <>
    <Source id="my-data"  type="geojson" data={circle as GeoJSON.Feature}>
            <Layer {...layer} />
    </Source>
    <Source id="my-line"  type="geojson" data={lineLayer as unknown as  GeoJSON.Feature}>
            <Layer {...lineLayer} />
    </Source>
    </>

  )
}

export default CircleDrawControl
