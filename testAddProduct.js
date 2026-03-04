
const axios = require('axios');

async function testAddProduct() {
    try {
        // First, login as the seller
        const loginResponse = await axios.post('http://localhost:4000/api/auth/login', {
            email: 'testseller@example.com',
            password: 'testpassword123'
        });
        
        const token = loginResponse.data.token;
        
        // Now add a product
        const productResponse = await axios.post('http://localhost:4000/api/products', {
            name: 'Test Product',
            price: 99.99,
            stock: 10,
            description: 'This is a test product',
            category_id: 1
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Product added successfully:', productResponse.data);
    } catch (error) {
        console.error('❌ Product creation failed:', error.response?.data || error.message);
    }
}

testAddProduct();
