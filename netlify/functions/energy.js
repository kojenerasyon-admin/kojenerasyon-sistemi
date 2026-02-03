exports.handler = async (event, context) => {
    try {
        const { httpMethod, body } = event;
        
        if (httpMethod === 'POST') {
            const data = JSON.parse(body);
            console.log('Energy data received:', data);
            
            // Mock success response
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Veriler başarıyla kaydedildi',
                    data: data
                })
            };
        }
        
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
