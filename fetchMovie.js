import env from './env.js';
import { startCompare } from './index.js';

export const fetchMovie = async (movie, key = 's', toSection = "") => {
    const movieResp = await axios.get(env.API_URI, {
        params: {
            apikey: env.OMDB_API_KEY,
            [key]: movie,
        },
    });
    if (movieResp.data.Response === 'False') {
        return [];
    }

    return movieResp.data;
};