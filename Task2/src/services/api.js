import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/test/companies';
let token = "";
const TIMEOUT = 500;

const data = {
        "companyName": "KDMed",
        "clientID": "c8f8b27c-7623-4a47-ae9c-9b5c5dd55ce9",
        "clientSecret": "fvjJrpoEayNwDapT",
        "ownerName": "Keyur",
        "ownerEmail": "210303105118@paruluniversity.ac.in",
        "rollNo": "210303105118"
};

export const getProducts = async (company, category, top, minPrice, maxPrice) => {
    try {
        const tokenresponse = await axios.post('http://20.244.56.144/test/auth', data);
        token = tokenresponse.data.access_token;
        
        const response = await axios.get(
            `${BASE_URL}/${company}/categories/${category}/products?top=${top}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: TIMEOUT
            }

        );
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};