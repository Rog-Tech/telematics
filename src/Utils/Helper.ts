export const getFullUrl = (url:string) =>{
    const baseUrl :string = 'http://147.182.206.220'
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