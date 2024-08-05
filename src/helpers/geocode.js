import axios from 'axios';

const GEOCODE_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
const GEOCODE_API_KEY ='ad3f2aac7c334691823e2907df6c9594'; 

export const geocodeAddress = async (address) => {
    try {
        const response = await axios.get(GEOCODE_API_URL, {
            params: {
                q: address,
                key: GEOCODE_API_KEY,
                countrycode: 'us',
            }
        });
        const { results } = response.data;
        if (results.length > 0) {
            const { lat, lng } = results[0].geometry;
            return { lat, lng };
        } else {
            console.error(`No results found for address: ${address}`);
            return null;
        }
    } catch (error) {
        console.error(`Error geocoding address: ${address}`, error);
        return null;
    }
};
