# PHP Email Handler Deployment Instructions

## Overview
The schedule demo form is now implemented to send emails to `support@medspagen.com` using PHP. This document explains how to deploy and configure the email functionality.

## Files Created

### 1. `/public/api/schedule-demo.php`
- Main PHP email handler
- Validates form data
- Sends formatted emails to support@medspagen.com
- Handles CORS for frontend integration
- Returns JSON responses

### 2. `/public/.htaccess`
- Routes API requests to PHP files
- Handles React Router client-side routing
- Enables clean URLs for production

### 3. `/php-server.php`
- Development server script (optional)
- Handles CORS for local development

## Development vs Production Behavior

### Development Mode (npm run dev)
- Form opens a mailto link with pre-filled demo request details
- Email client opens automatically
- User can send email directly to support@medspagen.com
- Console logs show what data would be sent

### Production Mode
- Form submits to `/api/schedule-demo` endpoint
- PHP handler processes the request
- Email sent automatically to support@medspagen.com
- User sees success/error messages

## Production Deployment Requirements

### 1. Web Server Setup
The application requires a web server with PHP support:

**Apache:**
```apache
# Enable mod_rewrite
LoadModule rewrite_module modules/mod_rewrite.so

# Enable PHP
LoadModule php_module modules/libphp.so
```

**Nginx:**
```nginx
location /api/ {
    try_files $uri $uri/ @php;
}

location @php {
    fastcgi_pass unix:/var/run/php/php-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$uri;
    include fastcgi_params;
}
```

### 2. PHP Configuration
Ensure PHP mail functionality is enabled:

**php.ini:**
```ini
; Enable mail function
sendmail_path = /usr/sbin/sendmail -t -i

; Or configure SMTP (recommended for production)
SMTP = your-smtp-server.com
smtp_port = 587
```

### 3. Email Server Configuration
For reliable email delivery, configure SMTP:

**Option A: Use hosting provider's SMTP**
Most hosting providers include SMTP servers that work with PHP's mail() function.

**Option B: Third-party email service**
Consider using services like:
- SendGrid
- Mailgun  
- Amazon SES
- Postmark

### 4. File Permissions
Ensure proper permissions on the server:
```bash
# Set correct permissions
chmod 644 public/api/schedule-demo.php
chmod 644 public/.htaccess

# Ensure web server can read files
chown -R www-data:www-data public/
```

## Testing the Implementation

### Test in Development
1. Run `npm run dev`
2. Navigate to the homepage
3. Click "Schedule Demo" button
4. Fill out the form
5. Submit - should open email client

### Test in Production
1. Deploy to web server with PHP support
2. Navigate to your domain
3. Click "Schedule Demo" button  
4. Fill out and submit form
5. Check support@medspagen.com for email

## Form Data Structure
The form collects and sends the following data:

```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@medspa.com", 
  "phone": "(555) 123-4567",
  "company": "Elite MedSpa",
  "message": "Interested in learning more about video generation features"
}
```

## Email Template
The PHP handler sends formatted emails with:
- Subject: "New Demo Request from MedSpaGen Website"
- Sender: MedSpaGen Website <noreply@medspagen.com>
- Reply-To: Customer's email address
- Body includes all form fields, timestamp, and IP address

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure proper CORS headers in PHP file
- Check that frontend URL matches allowed origins

**2. Email Not Sending**
- Verify PHP mail configuration
- Check server logs for mail errors
- Test with simple PHP mail script

**3. 404 Errors on API Endpoint**  
- Verify .htaccess file is uploaded
- Check that mod_rewrite is enabled
- Ensure PHP files have correct permissions

**4. Form Submission Errors**
- Check browser console for JavaScript errors
- Verify JSON is being sent correctly
- Check PHP error logs

### Debug Commands
```bash
# Test PHP mail configuration
php -r "mail('test@example.com', 'Test', 'Test message');"

# Check PHP configuration
php -m | grep mail

# Test API endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}' \
  https://yourdomain.com/api/schedule-demo
```

## Security Considerations

1. **Input Validation**: All form inputs are sanitized
2. **Rate Limiting**: Consider implementing rate limiting for production
3. **Spam Protection**: Add CAPTCHA if needed
4. **SSL/TLS**: Use HTTPS for all form submissions
5. **Error Logging**: Monitor PHP error logs for suspicious activity

## Next Steps for Production

1. Deploy files to web server with PHP support
2. Configure SMTP for reliable email delivery  
3. Test form submission thoroughly
4. Set up monitoring for email delivery
5. Consider adding CAPTCHA for spam protection
6. Implement rate limiting if needed