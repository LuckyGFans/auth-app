# Auth App

An authenticator and password manager application with browser integration.

## Features

- Browser extension for saving and autofilling logins and passwords on websites.
- Supports storing TOTP secrets for 2FA code generation.
- Generates TOTP codes on demand or when filling logins.
- Supports various accounts like Microsoft, iTunes, Google, GitHub, Instagram.

## Browser Extension Setup

1. Open Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right.
4. Click "Load unpacked" and select the `browser-extension` folder from this project.

## Usage

- Click the extension icon on a login page.
- Enter TOTP secret if available, then "Save Current Login" to store credentials.
- Use "Fill Login" to autofill saved credentials and display TOTP if available.
- Use "TOTP Generator" to generate codes from secrets.

## Development

- Edit files in `browser-extension/` as needed.
- Reload the extension in Chrome after changes.

## Security Note

Credentials are encrypted using AES-GCM via Web Crypto API before storage. Uses PBKDF2-derived key from a master passphrase (currently 'masterpassword' - replace with user input for production). For enhanced security, implement user-set master password and key management.