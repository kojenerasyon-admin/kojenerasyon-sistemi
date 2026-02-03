exports.handler = async (event, context) => {
    try {
        const { httpMethod } = event;
        
        if (httpMethod === 'GET') {
            // Mock production data
            const data = [];
            const today = new Date();
            
            for (let i = 30; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                data.push({
                    date: date.toISOString().split('T')[0],
                    production: Math.floor(Math.random() * 200) + 300,
                    efficiency: Math.floor(Math.random() * 15) + 80
                });
            }
            
            return {
                statusCode: 200,
                body: JSON.stringify(data)
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
