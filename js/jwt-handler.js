// JWT-like Token Handler for Client-Side Applications
// Note: This is a simplified implementation for demo purposes
// In production, use a proper backend JWT implementation

class JWTHandler {
    constructor() {
        this.secretKey = this.generateSecretKey();
        this.algorithm = 'HS256';
    }

    // Generate a secret key (in production, this should come from backend)
    generateSecretKey() {
        // Create a more complex secret from browser fingerprint
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Kojenerasyon2026', 2, 2);
        
        const fingerprint = canvas.toDataURL().slice(-50) + 
                           navigator.userAgent.slice(-20) + 
                           new Date().getTime().toString();
        
        return this.simpleHash(fingerprint);
    }

    // Simple hash function (use crypto API in production)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Create JWT-like token
    createToken(payload, expiresIn = '24h') {
        const header = {
            alg: this.algorithm,
            typ: 'JWT'
        };

        // Add expiration time
        const now = Math.floor(Date.now() / 1000);
        const exp = this.getExpirationTime(expiresIn);
        
        const tokenPayload = {
            ...payload,
            iat: now,
            exp: exp,
            jti: this.generateJTI()
        };

        // Encode header and payload
        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));

        // Create signature
        const signatureInput = `${encodedHeader}.${encodedPayload}`;
        const signature = this.createSignature(signatureInput);

        return `${signatureInput}.${signature}`;
    }

    // Verify JWT-like token
    verifyToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }

            const [encodedHeader, encodedPayload, signature] = parts;
            
            // Verify signature
            const signatureInput = `${encodedHeader}.${encodedPayload}`;
            const expectedSignature = this.createSignature(signatureInput);
            
            if (signature !== expectedSignature) {
                throw new Error('Invalid signature');
            }

            // Decode payload
            const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
            
            // Check expiration
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                throw new Error('Token expired');
            }

            return payload;
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }

    // Create HMAC-like signature
    createSignature(data) {
        const combined = data + this.secretKey;
        return this.base64UrlEncode(this.simpleHash(combined));
    }

    // Get expiration time in seconds
    getExpirationTime(expiresIn) {
        const now = Math.floor(Date.now() / 1000);
        
        switch (expiresIn) {
            case '1h':
                return now + 3600;
            case '8h':
                return now + 28800;
            case '24h':
                return now + 86400;
            case '7d':
                return now + 604800;
            default:
                return now + 86400; // Default 24 hours
        }
    }

    // Generate JWT ID
    generateJTI() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    // Base64 URL encoding
    base64UrlEncode(str) {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    // Base64 URL decoding
    base64UrlDecode(str) {
        str += new Array(5 - str.length % 4).join('=');
        return atob(str.replace(/\-/g, '+').replace(/_/g, '/'));
    }

    // Refresh token
    refreshToken(token) {
        const payload = this.verifyToken(token);
        if (!payload) {
            return null;
        }

        // Create new token with same payload but new expiration
        const { exp, iat, jti, ...newPayload } = payload;
        return this.createToken(newPayload);
    }

    // Get token info without verification (for debugging)
    decodeToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            
            const payload = JSON.parse(this.base64UrlDecode(parts[1]));
            return payload;
        } catch (error) {
            return null;
        }
    }
}

// Global JWT handler instance
const jwtHandler = new JWTHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = jwtHandler;
} else {
    window.jwtHandler = jwtHandler;
}
