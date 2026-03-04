
const axios = require('axios');

async function testGetProducts() {
    try {
        const response = await axios.get('http://localhost:4000/api/products');
        console.log('✅ Products list:', response.data);
    } catch (error) {
        console.error('❌ Failed to get products:', error.response?.data || error.message);
    }
}

testGetProducts();
