import axios from 'axios'
export const DEV_URL = `http://localhost:5001/questpi/us-central1/api/v1`
export const PROD_URL = 'https://us-central1-questpi.cloudfunctions.net/api/v1'
const isDev = process.env.NODE_ENV === 'development'

export default axios.create({
    baseURL: isDev ? DEV_URL : PROD_URL
})