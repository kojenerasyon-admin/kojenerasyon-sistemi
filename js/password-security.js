// Advanced Password Security System
// Implements PBKDF2 with proper salt management

class PasswordSecurity {
    constructor() {
        this.algorithm = 'PBKDF2';
        this.iterations = 100000; // OWASP recommended minimum
        this.keyLength = 32; // 256 bits
        this.hashFunction = 'SHA-256';
    }

    // Generate cryptographically secure random salt
    generateSalt(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Hash password using PBKDF2
    async hashPassword(password, salt = null) {
        try {
            // Generate salt if not provided
            if (!salt) {
                salt = this.generateSalt();
            }

            // Convert password to buffer
            const encoder = new TextEncoder();
            const passwordBuffer = encoder.encode(password);
            const saltBuffer = encoder.encode(salt);

            // Import key
            const baseKey = await crypto.subtle.importKey(
                'raw',
                passwordBuffer,
                { name: 'PBKDF2' },
                false,
                ['deriveBits']
            );

            // Derive key using PBKDF2
            const derivedBits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt: saltBuffer,
                    iterations: this.iterations,
                    hash: this.hashFunction
                },
                baseKey,
                this.keyLength * 8 // bits
            );

            // Convert to hex
            const hashArray = Array.from(new Uint8Array(derivedBits));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Return salt and hash combined
            return {
                hash: hashHex,
                salt: salt,
                algorithm: this.algorithm,
                iterations: this.iterations,
                keyLength: this.keyLength
            };
        } catch (error) {
            console.error('Password hashing error:', error);
            throw new Error('Password hashing failed');
        }
    }

    // Verify password against stored hash
    async verifyPassword(password, storedHash) {
        try {
            // Parse stored hash data
            let hashData;
            if (typeof storedHash === 'string') {
                // Legacy format - parse from string
                hashData = this.parseLegacyHash(storedHash);
            } else {
                // New format object
                hashData = storedHash;
            }

            if (!hashData || !hashData.salt || !hashData.hash) {
                throw new Error('Invalid stored hash format');
            }

            // Hash the provided password with the same salt
            const newHash = await this.hashPassword(password, hashData.salt);

            // Compare hashes using constant-time comparison
            return this.constantTimeCompare(newHash.hash, hashData.hash);
        } catch (error) {
            console.error('Password verification error:', error);
            return false;
        }
    }

    // Constant-time comparison to prevent timing attacks
    constantTimeCompare(a, b) {
        if (a.length !== b.length) {
            return false;
        }

        let result = 0;
        for (let i = 0; i < a.length; i++) {
            result |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }

        return result === 0;
    }

    // Parse legacy hash format (for backward compatibility)
    parseLegacyHash(hashString) {
        try {
            // Try to parse as JSON first
            const parsed = JSON.parse(hashString);
            return parsed;
        } catch (e) {
            // Legacy format: hash:salt
            const parts = hashString.split(':');
            if (parts.length === 2) {
                return {
                    hash: parts[0],
                    salt: parts[1],
                    algorithm: 'SHA-256', // Legacy
                    iterations: 1,
                    keyLength: 32
                };
            }
            return null;
        }
    }

    // Check password strength
    checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            noCommonPatterns: !this.isCommonPassword(password),
            noSequentialChars: !this.hasSequentialChars(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        const strength = this.getStrengthLevel(score);

        return {
            score,
            strength,
            checks,
            suggestions: this.getSuggestions(checks)
        };
    }

    // Get strength level based on score
    getStrengthLevel(score) {
        if (score <= 2) return 'very_weak';
        if (score <= 4) return 'weak';
        if (score <= 6) return 'medium';
        if (score <= 8) return 'strong';
        return 'very_strong';
    }

    // Check if password is common
    isCommonPassword(password) {
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123',
            'password123', 'admin', 'letmein', 'welcome', 'monkey',
            '1234567890', 'password1', '123123', 'qwertyuiop'
        ];
        return commonPasswords.includes(password.toLowerCase());
    }

    // Check for sequential characters
    hasSequentialChars(password) {
        for (let i = 0; i < password.length - 2; i++) {
            const char1 = password.charCodeAt(i);
            const char2 = password.charCodeAt(i + 1);
            const char3 = password.charCodeAt(i + 2);
            
            // Check for ascending or descending sequences
            if ((char2 === char1 + 1 && char3 === char2 + 1) ||
                (char2 === char1 - 1 && char3 === char2 - 1)) {
                return true;
            }
        }
        return false;
    }

    // Get password improvement suggestions
    getSuggestions(checks) {
        const suggestions = [];
        
        if (!checks.length) suggestions.push('Use at least 8 characters');
        if (!checks.uppercase) suggestions.push('Include uppercase letters');
        if (!checks.lowercase) suggestions.push('Include lowercase letters');
        if (!checks.numbers) suggestions.push('Include numbers');
        if (!checks.special) suggestions.push('Include special characters');
        if (!checks.noCommonPatterns) suggestions.push('Avoid common passwords');
        if (!checks.noSequentialChars) suggestions.push('Avoid sequential characters');
        
        return suggestions;
    }

    // Generate secure random password
    generateSecurePassword(length = 12, options = {}) {
        const defaults = {
            uppercase: true,
            lowercase: true,
            numbers: true,
            special: true
        };
        
        const opts = { ...defaults, ...options };
        let charset = '';
        
        if (opts.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (opts.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (opts.numbers) charset += '0123456789';
        if (opts.special) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (charset === '') {
            throw new Error('At least one character type must be selected');
        }
        
        let password = '';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        return password;
    }
}

// Global password security instance
const passwordSecurity = new PasswordSecurity();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = passwordSecurity;
} else {
    window.passwordSecurity = passwordSecurity;
}
