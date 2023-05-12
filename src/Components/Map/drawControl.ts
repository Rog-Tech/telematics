import MapboxDraw, { DrawMode } from '@mapbox/mapbox-gl-draw';
import {useControl} from 'react-map-gl';
import type {MapRef, ControlPosition} from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
    position?: ControlPosition;
    
    onCreate?: (evt: {features: object[]}) => void;
    onUpdate?: (evt: {features: object[]; action: string}) => void;
    onDelete?: (evt: {features: object[]}) => void;
  };


export default function DrawControl (props:DrawControlProps) {

    useControl<MapboxDraw>(
        () => new MapboxDraw(props),
        ({map}: {map: MapRef}) => {
          map.on('draw.create', props.onCreate as any);
          map.on('draw.update', props.onUpdate as any);
          map.on('draw.delete', props.onDelete as any);
        },
        ({map}: {map: MapRef}) => {
          map.off('draw.create', props.onCreate as any);
          map.off('draw.update', props.onUpdate as any);
          map.off('draw.delete', props.onDelete as any);
        },
        {
          position: props.position
        }
      );
    
      return null;
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {}
}