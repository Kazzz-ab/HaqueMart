# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |

## Security Measures

### Anti-Phishing
- All pages served over HTTPS in production
- Content Security Policy (CSP) headers via Next.js `headers()` config
- X-Frame-Options: DENY to prevent clickjacking
- Strict-Transport-Security (HSTS) enabled
- Referrer-Policy set to `strict-origin-when-cross-origin`
- Permissions-Policy restricts camera, microphone, geolocation

### Anti-DDoS
- Vercel Edge Network provides DDoS protection at the CDN layer
- Next.js API routes include request validation
- No server-side state that can be exhausted by repeated requests
- GraphQL queries against WooCommerce use read-only, public endpoints

### Anti-Spam
- Checkout form includes honeypot field validation
- All user inputs validated and sanitised before use
- TypeScript strict mode enforces input typing throughout
- No user-generated content is stored or re-rendered

## Reporting a Vulnerability

Please report security vulnerabilities to the repository owner via GitHub Issues with the label `security`.
Do NOT disclose vulnerabilities publicly before they have been addressed.
