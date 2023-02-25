import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Marker,Source,Layer, LineLayer } from 'react-map-gl';
import Car  from '../../assets/L_9.png'
import * as turf from '@turf/turf'
import { computeDistance, interpolate } from 'react-maps-suite';
import { 
  CarAnimationProps, CarDto, 
  CarMarkerProps, 
  CarPathLineProps, LatLng, PathWithDistance 
} from '../../types/Types';


export const Tracks:FC<CarDto> = ({car,animation,speed,time}) => {
  
  const sortedPoints = car.sort((a, b) => new Date(a.pointDt).getTime() -new Date(b.pointDt).getTime());
  return (
      <>
        <CarPathLine  carPath={sortedPoints}/>
        <CarAnimation locationData={sortedPoints} showTrack={animation} speed={speed} timeline={time}/>  
      </>
  )
}

function CarPathLine({ carPath }: CarPathLineProps) {
  const pathData = carPath.map((loc) => [loc.lon, loc.lat]); 

  const lineSource : GeoJSON.FeatureCollection<GeoJSON.Geometry>= useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties:{},
          geometry: {
            type: 'LineString',
            coordinates: pathData,
          },
        },
      ],
    }),
    [carPath]
  );

  const lineLayer : LineLayer = useMemo(
    () => ({
      id: 'car-path',
      type: 'line',
      paint: {
        'line-color': '#32CD32',
        'line-width': 3,
      },
    }),
    []
  );
  return (
    <Source id="my-data"  type="geojson" data={lineSource}>
      <Layer {...lineLayer} />
    </Source>
  );
}

const CarMarker:FC<CarMarkerProps> = ({lat,lng,dir}) => {
  return (
        <Marker 
        onClick={e => {
        // If we let the click event propagates to the map,
        //  it will immediately close the popup
        // with `closeOnClick: true`
        e.originalEvent.stopPropagation();
        // props.setPopupContent(r)
        // setContent(r)
      }} longitude={lng} latitude={lat}>
      <img 
        src={Car}
        alt="Car icon"
        className="car-icon"
        style={{ transform: `rotate(${dir}deg)` }}
      />
    </Marker>
  )
}

function CarAnimation({ locationData,showTrack,speed,timeline}: CarAnimationProps) {
  const defaultPath : LatLng[]= locationData.map((loc)=> {
    return {lat:loc.lat, lng:loc.lon}
  })
  const DEFAULT_SPEED = 2; // m/s
  const [time, setTime] = useState(0);
  const r: PathWithDistance[] = defaultPath.reduce(
    (result: PathWithDistance[], item: LatLng, index: number, array: LatLng[]) => {
      if (index === 0) {
        result.push({ ...item, distance: 0 });
        return result;
      }
  
      const { distance: lastDistance } = result[index - 1];
      const previous = array[index - 1];
      const distance = lastDistance + computeDistance(previous, item);
  
      result.push({ ...item, distance });
      return result;
    },
    []
  );
  const increaseTime = useCallback(() => {
    // setTime(time => time + 1);
    if(showTrack){
      setTime(time => time + 1);
    }else{
      setTime(time => time)
    }
  }, [showTrack]);

  useEffect(() => {
    const interval = setInterval(increaseTime, 1000);
      return () => {
        clearInterval(interval);
      };
    
  }, [increaseTime]);

  const distance = DEFAULT_SPEED * time;

  const position = getPositionAt(r, distance);

  return <CarMarker lng={position.lng} lat={position.lat} dir={position.dir}/>;
}

function getPositionAt(path: any, distance: number) {
  const indexesPassed = path.filter((position:any) => position.distance < distance);
  if (indexesPassed.length === 0) {
    return path[0];// starting position
  }

  const lastIndexPassed = indexesPassed.length - 1;
  const nextIndexToPass = lastIndexPassed + 1;

  const lastPosition = path[lastIndexPassed];
  const nextPosition = path[nextIndexToPass];

  if (!nextPosition) {
    return lastPosition; // distance is greater than the ones we have in the array
  }

  const progressUntilNext = // a number from 0 to 1
    (distance - lastPosition.distance) / nextPosition.distance;
  var point1 = turf.point([lastPosition.lng, lastPosition.lat]);
  var point2 = turf.point([nextPosition.lng, nextPosition.lat]);
    let angle = turf.rhumbBearing(point1, point2);
  const currentPosition = interpolate(
    lastPosition,
    nextPosition,
    progressUntilNext
  );
  const x : CarMarkerProps = {
    lat:currentPosition.lat,
    lng:currentPosition.lng,
    dir:angle
  }
  return x
}



