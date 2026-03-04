
const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/register', {
            name: 'Test Buyer',
            email: 'testbuyer@example.com',
            password: 'testpassword123',
            role: 'BUYER'
        });
        console.log('✅ Register successful:', response.data);
    } catch (error) {
        console.error('❌ Register failed:', error.response?.data || error.message);
    }
}

testRegister();
