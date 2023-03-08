import { CarAlarmProps, CarProps } from "../types/Types";

export const getFullUrl = (url:string) =>{
    const baseUrl :string = 'http://147.182.206.220:8888'
    return  baseUrl + url
}
export const  DateFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };

  export const ComputeAddress = async (r:CarAlarmProps): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${r.lon},${r.lat}.json?language=he&access_token=pk.eyJ1IjoiY2hhbm4iLCJhIjoiY2w3OHI1a293MGI4aTNxbzh1dHI5b2owaSJ9.RSbIOzGoHc8JnKvgyIWZ4w`
      );
      const data = await response.json();
      return data.features[0].place_name_he;
    } catch (error) {
      console.log("problem getting address", error);
      return "";
    }
  };