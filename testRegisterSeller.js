
const axios = require('axios');

async function testRegisterSeller() {
    try {
        const response = await axios.post('http://localhost:4000/api/auth/register', {
            name: 'Test Seller',
            email: 'testseller@example.com',
            password: 'testpassword123',
            role: 'SELLER'
        });
        console.log('✅ Seller register successful:', response.data);
    } catch (error) {
        console.error('❌ Seller register failed:', error.response?.data || error.message);
    }
}

testRegisterSeller();
