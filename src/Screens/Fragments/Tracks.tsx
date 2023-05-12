import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Marker,Source,Layer, LineLayer } from 'react-map-gl';
import Car  from '../../assets/L_9.png'
import * as turf from '@turf/turf'
import { computeDistance, interpolate } from 'react-maps-suite';
import { 
  CarAnimationProps, CarDto, 
  ICarMarker, 
  CarMarkerProps, 
  CarPathLineProps, LatLng, PathWithDistance, IPopup 
} from '../../types/Types';

import GrowlContext from '../../Utils/growlContext';

export const Tracks:FC<CarDto> = ({car,animation,speed,time,setPopupContent,direction,setSlider,setMaxSlider,slider}) => {
  const sortedPoints = car.sort((a, b) => new Date(a.pointDt).getTime() -new Date(b.pointDt).getTime());

  return (
      <>
        <CarPathLine  carPath={sortedPoints}/>
        <CarAnimation locationData={sortedPoints} 
            showTrack={animation} speed={speed} timeline={time} 
            setPopupContent={setPopupContent} directionForward={false} 
            setMaxSlider={setMaxSlider}
            setSlider={setSlider}
            slider = {slider}
            />  
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
        'line-dasharray': [2, 2]
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


const CarMarker:FC<CarMarkerProps> = ({lat,lng,dir,setPopupContent}) => {

  const [content,setContent]= React.useState<IPopup | null>();

  React.useEffect(()=>{
    setPopupContent(content)
  },[content])


  return (
      <Marker 
        onClick={e => {
        e.originalEvent.stopPropagation();
        console.log(lat,lng,dir)
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

function CarAnimation({ locationData,showTrack,speed,timeline,setPopupContent,setSlider,setMaxSlider,slider}: CarAnimationProps) {
  const growl = React.useContext(GrowlContext);
  const defaultPath : LatLng[]= locationData.map((loc)=> {
    return {lat:loc.lat, lng:loc.lon}
  })

  const unitBeingTracked = locationData.at(0);
  

  const DEFAULT_SPEED:number =speed; // m/s
  const [time, setTime] = useState(0);
  const [dist, setdist] = useState(0)
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
      // setSlider(time)
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



// get max distance 
React.useEffect(() => {
  if (r.length > 1) {
    setMaxSlider(r[r.length - 1].distance);
  }
}, [r]);

// const distance = DEFAULT_SPEED * time

React.useEffect(() => {
  if (slider > 0) {
    let sliderDistance = slider + (slider * 0.01);
    setdist(sliderDistance);
  }else if(slider > 0 && showTrack){
       let updatedDistance = slider + (DEFAULT_SPEED * time)  
       console.log(updatedDistance)
       setdist(updatedDistance) 
  } else {
    let defaultDistance = DEFAULT_SPEED * time;
    if (showTrack) {
      defaultDistance *= (slider + 1); // add 1 to slider to avoid 0 value
    }
    setdist(defaultDistance);
  }
}, [slider, showTrack, DEFAULT_SPEED, time]);


const position = getPositionAt(r, dist);
 return <>{
    position && (
    <CarMarker 
       lng={position.lng} lat={position.lat} 
      //  popupTracker= {unitBeingTracked}
       dir={position.dir} 
       setPopupContent={setPopupContent}
      />)
  }</>;
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

  const x : ICarMarker = {
    lat:currentPosition.lat,
    lng:currentPosition.lng,
    dir:angle,
  }

  return x
}



