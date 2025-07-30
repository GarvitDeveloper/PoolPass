# 🖥️ Server Setup Guide - PoolPass

## 📋 Server Requirements

PoolPass is a **static web application** that requires:
- ✅ Web server to serve HTML/CSS/JS files
- ✅ Proper MIME types for JSON files
- ✅ HTTPS support (recommended)
- ✅ No server-side processing needed

## 🚀 Deployment Options

### Option 1: No Server (Recommended)
**Platforms**: GitHub Pages, Netlify, Vercel, Firebase Hosting
- ✅ Zero server management
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free hosting

### Option 2: Simple Static Server

#### A. Nginx (Production)
```bash
# Install Nginx
sudo apt-get install nginx

# Copy files to web directory
sudo cp -r . /var/www/poolpass/

# Create Nginx config
sudo nano /etc/nginx/sites-available/poolpass
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/poolpass;
    index index.html;

    # JSON files
    location ~* \.json$ {
        add_header Content-Type application/json;
    }

    # Static files
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Single page app routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### B. Apache (Production)
```bash
# Install Apache
sudo apt-get install apache2

# Copy files
sudo cp -r . /var/www/html/poolpass/

# Enable site
sudo a2ensite poolpass
sudo systemctl reload apache2
```

**Apache Configuration**:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/poolpass
    
    <Directory /var/www/html/poolpass>
        AllowOverride All
        Require all granted
    </Directory>
    
    # JSON MIME type
    AddType application/json .json
</VirtualHost>
```

#### C. Node.js Express (Simple)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create server file
nano server.js
```

**server.js**:
```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// JSON MIME type
app.use('*.json', (req, res, next) => {
    res.type('application/json');
    next();
});

// Single page app routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`PoolPass server running on port ${PORT}`);
});
```

**Install and run**:
```bash
npm init -y
npm install express
node server.js
```

#### D. Python (Simple)
```bash
# Python 3 (already working for you)
python3 -m http.server 8000

# Or with HTTPS
python3 -m http.server 8000 --bind 0.0.0.0
```

#### E. Docker (Containerized)
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run**:
```bash
docker build -t poolpass .
docker run -p 80:80 poolpass
```

## 🔒 HTTPS Setup

### Let's Encrypt (Free SSL)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📱 Kiosk Server Setup

### For Touchscreen Kiosk:

1. **Raspberry Pi Setup**:
```bash
# Install Raspberry Pi OS
# Install Nginx
sudo apt-get update
sudo apt-get install nginx

# Copy PoolPass files
sudo cp -r . /var/www/html/poolpass/

# Configure Nginx
sudo nano /etc/nginx/sites-available/poolpass
```

2. **Auto-start Browser**:
```bash
# Edit autostart
nano ~/.config/lxsession/LXDE-pi/autostart

# Add line:
@chromium-browser --kiosk --app=http://localhost/poolpass
```

3. **Disable Screen Saver**:
```bash
# Edit lightdm config
sudo nano /etc/lightdm/lightdm.conf

# Add:
[SeatDefaults]
xserver-command=X -s 0 -dpms
```

## 🔧 Server Configuration Checklist

### Basic Requirements:
- ✅ Web server (Nginx/Apache/Express)
- ✅ Static file serving
- ✅ JSON MIME types
- ✅ HTTPS (production)
- ✅ Proper file permissions

### Performance:
- ✅ Gzip compression
- ✅ Browser caching
- ✅ CDN (optional)
- ✅ Load balancing (optional)

### Security:
- ✅ HTTPS/SSL
- ✅ Security headers
- ✅ CORS configuration
- ✅ Rate limiting (optional)

## 🆘 Troubleshooting

### Common Issues:

1. **JSON files not loading**:
   - Check MIME types
   - Verify file permissions
   - Check CORS headers

2. **HTTPS issues**:
   - Verify SSL certificate
   - Check mixed content warnings
   - Ensure all resources use HTTPS

3. **Performance issues**:
   - Enable gzip compression
   - Set proper cache headers
   - Use CDN for static assets

## 🎯 Recommendation

**For most users**: Use GitHub Pages, Netlify, or Vercel
- No server management
- Automatic HTTPS
- Free hosting
- Global CDN

**For advanced users**: Use Nginx or Apache
- Full control
- Custom configurations
- Server-side features (if needed)

---

**Your PoolPass app will work perfectly with any of these options!** 🏊‍♂️ 