exports.handler = async (event, context) => {
    try {
        console.log('Function started');
        
        const { httpMethod, body } = event;
        
        if (httpMethod === 'POST') {
            const data = JSON.parse(body);
            console.log('Energy data received:', data);
            
            // Firebase Database'e kaydet
            const firebaseUrl = process.env.FIREBASE_DATABASE_URL;
            if (!firebaseUrl) {
                throw new Error('Firebase database URL not configured');
            }
            
            // Veriyi Firebase formatına çevir
            const firebaseData = {
                sheetName: data.sheetName,
                vardiya: data.vardiya,
                timestamp: new Date().toISOString(),
                data: data.data
            };
            
            // Firebase'e gönder
            const response = await fetch(`${firebaseUrl}energy/${Date.now()}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(firebaseData)
            });
            
            if (!response.ok) {
                throw new Error(`Firebase error: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Firebase response:', result);
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Veriler Firebase\'e başarıyla kaydedildi',
                    firebaseId: result.name,
                    sheetName: data.sheetName,
                    rowsAdded: data.data.length
                })
            };
        }
        
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: error.message,
                details: 'Firebase Database hatası'
            })
        };
    }
};
