export async function fetchData(content:any, setPopupContent: React.Dispatch<React.SetStateAction<any>>) {
    console.log(content);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${content?.lon},${content?.lat}.json?language=he&access_token=pk.eyJ1IjoiY2hhbm4iLCJhIjoiY2w3OHI1a293MGI4aTNxbzh1dHI5b2owaSJ9.RSbIOzGoHc8JnKvgyIWZ4w`
      );
      const data = await response.json();
      const r = {
        address: data.features[0].place_name_he,
        dir: content?.dir,
        exData: content?.exData,
        lat: content?.lat,
        latc: content?.latc,
        lon: content?.lon,
        lonc: content?.lonc,
        speed: content?.speed,
        status: content?.status,
        carId: content?.carId,
        gpsUpdateTime: content?.gpsUpdateTime,
        gsmUpdateTime: content?.gsmUpdateTime,
        machineName: content?.machineName,
      };
      setPopupContent(r);
    } catch (error) {
      // Handle error
    }
  }
  