# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |
| 2.0.x   | ✅ Yes    |
| 2.1.x   | ✅ Yes    |
| 3.0.x   | ✅ Yes    |

Only the latest release is actively supported with security updates.

## Reporting a Vulnerability

If you discover a security vulnerability in Neiki Gallery, **please do not open a public issue.**

Instead, report it privately via email:

**📧 [dev@neiki.eu](mailto:dev@neiki.eu)**

### What to include

- A clear description of the vulnerability
- Steps to reproduce the issue
- The potential impact or severity
- Any suggested fix (optional but appreciated)

### Response timeline

- **Acknowledgment** — within 48 hours
- **Initial assessment** — within 5 business days
- **Fix & disclosure** — as soon as a patch is ready, coordinated with the reporter

## Scope

This policy covers the Neiki Gallery library code (`neiki-gallery.js` and `neiki-gallery.css`), including:

- Cross-site scripting (XSS) via captions, attributes, or injected markup
- DOM manipulation vulnerabilities
- Any issue that could compromise a host page integrating the library

## Out of Scope

- Vulnerabilities in third-party services (e.g. CDN providers)
- Issues that require physical access to the user's device
- Bugs that are not security-related (use regular GitHub Issues for those)

## Responsible Disclosure

We kindly ask that you:

1. Allow reasonable time for us to investigate and patch the issue before any public disclosure
2. Do not exploit the vulnerability beyond what is necessary to demonstrate it
3. Do not access or modify data belonging to other users

We appreciate your help in keeping Neiki Gallery and its users safe.
