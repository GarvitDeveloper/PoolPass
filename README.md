# 🏊‍♂️ PoolPass - Community Pool Kiosk App

A modern, touchscreen-friendly web application designed for community pool management. PoolPass provides an intuitive interface for residents to check in, view pool rules and notices, and for administrators to manage pool operations.

## ✨ Features

### 🏠 Home Screen
- **Live Occupancy Counter** - Real-time display of current pool occupancy
- **Pool Status Indicator** - Shows if pool is open, closed, or has warnings
- **Quick Access Buttons** - Easy navigation to all features
- **Notice Banner** - Displays current announcements prominently

### 📝 Check-In System
- **Resident Name Input** - Type name or select from resident list with autocomplete
- **Guest Count** - Specify number of guests (up to 5 per resident)
- **Automatic Occupancy Tracking** - Updates count in real-time
- **Capacity Management** - Prevents check-ins when pool is at capacity
- **Form Validation** - Ensures data integrity

### 📋 Rules & Notices
- **Pool Rules Display** - Scrollable list of pool rules
- **Current Notices** - Admin-posted announcements and updates
- **Responsive Design** - Easy to read on any screen size

### ⚙️ Admin Panel (PIN Protected)
- **Pool Status Management** - Set pool as open, closed, or warning
- **Incident Logging** - Record and track pool incidents
- **QR Code Generator** - Create QR codes for easy check-in
- **Notice Management** - Add and remove pool notices
- **Occupancy Controls** - Manually adjust occupancy count

### 🔒 Security Features
- **Admin PIN Protection** - Secure access to admin functions
- **Session Timeout** - Automatic logout after inactivity
- **Data Validation** - Input sanitization and validation

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)
- Touchscreen device (recommended for kiosk use)

### Installation

1. **Clone or Download** the project files
2. **Start a Local Server** (required for JSON file loading):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in Browser**:
   ```
   http://localhost:8000
   ```

### Default Admin Access
- **PIN**: `1234`
- **Max Occupancy**: 50 people
- **Max Guests per Resident**: 5

## 📁 Project Structure

```
PoolPass/
├── index.html                 # Main application entry point
├── assets/
│   ├── css/
│   │   ├── main.css          # Core styles and layout
│   │   ├── components.css    # Component-specific styles
│   │   └── responsive.css    # Mobile/touchscreen optimizations
│   ├── js/
│   │   ├── utils.js          # Utility functions
│   │   ├── storage.js        # Data management
│   │   ├── app.js           # Main application logic
│   │   ├── checkin.js       # Check-in functionality
│   │   ├── admin.js         # Admin panel features
│   │   └── qr-generator.js  # QR code generation
│   └── images/              # Icons and images
├── data/
│   ├── settings.json        # App configuration
│   ├── residents.json       # Resident list
│   ├── occupancy.json       # Occupancy tracking
│   ├── notices.json         # Rules and notices
│   └── incidents.json       # Incident log
└── docs/
    └── CONTEXT.md           # Project documentation
```

## 🎯 Usage Guide

### For Residents

1. **Check In**:
   - Tap "Check In" on the home screen
   - Enter your name (or select from suggestions)
   - Specify number of guests
   - Tap "Check In" to confirm

2. **View Rules & Notices**:
   - Tap "Rules & Notices" on the home screen
   - Scroll through pool rules and current notices

### For Administrators

1. **Access Admin Panel**:
   - Tap "Admin Panel" on the home screen
   - Enter the admin PIN (default: 1234)

2. **Manage Pool Status**:
   - Select "Pool Status" in admin panel
   - Choose Open/Closed/Warning
   - Add optional status message

3. **Log Incidents**:
   - Select "Incident Log" in admin panel
   - Enter incident description
   - Add your name/initials (optional)
   - Tap "Log Incident"

4. **Generate QR Codes**:
   - Select "QR Generator" in admin panel
   - Tap "Generate QR Code"
   - Download or copy the QR code

5. **Manage Notices**:
   - Select "Manage Notices" in admin panel
   - Add new notices or remove existing ones

6. **Adjust Occupancy**:
   - Select "Occupancy Management" in admin panel
   - Use +/- buttons or enter number directly
   - Tap "Set Occupancy" to apply

## 🔧 Configuration

### Settings (data/settings.json)
```json
{
  "adminPin": "1234",
  "maxOccupancy": 50,
  "maxGuestsPerResident": 5,
  "sessionTimeout": 300000,
  "poolName": "Community Pool",
  "poolHours": {
    "open": "06:00",
    "close": "22:00"
  }
}
```

### Adding Residents (data/residents.json)
```json
{
  "residents": [
    "John Smith",
    "Sarah Johnson",
    "Michael Davis"
  ]
}
```

## 📱 Touchscreen Optimization

The app is specifically designed for kiosk use with:
- **Large Touch Targets** - Minimum 60px buttons
- **High Contrast** - Easy visibility in outdoor settings
- **Responsive Design** - Adapts to different screen sizes
- **Touch Feedback** - Visual feedback on touch interactions
- **Keyboard Navigation** - Support for physical keyboards

## 🔒 Security Considerations

- **Admin PIN Protection** - Secure access to administrative functions
- **Session Management** - Automatic timeout for admin sessions
- **Input Validation** - Sanitization of all user inputs
- **Local Storage** - Data stored locally (no external dependencies)

## 📊 Data Management

### Backup & Export
- **Automatic Backups** - Configurable backup intervals
- **Manual Export** - Export data as JSON files
- **Import Functionality** - Restore from backup files

### Data Files
- All data is stored in JSON format for easy editing
- Files are automatically backed up to localStorage
- Export functionality for data portability

## 🛠️ Development

### Adding New Features
1. Create new JavaScript module in `assets/js/`
2. Add corresponding CSS in `assets/css/`
3. Update HTML structure in `index.html`
4. Add data structures in `data/` directory

### Customization
- **Colors**: Modify CSS variables in `main.css`
- **Layout**: Adjust grid and flexbox properties
- **Functionality**: Extend JavaScript modules
- **Data**: Modify JSON files in `data/` directory

## 🐛 Troubleshooting

### Common Issues

1. **JSON files not loading**:
   - Ensure you're running a local web server
   - Check browser console for CORS errors

2. **QR codes not generating**:
   - Check internet connection (QR library loads from CDN)
   - Verify QR code container exists in DOM

3. **Admin PIN not working**:
   - Default PIN is "1234"
   - Check `data/settings.json` for custom PIN

4. **Touch interactions not working**:
   - Ensure device supports touch events
   - Check if touch events are enabled in browser

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Internet Explorer**: Not supported

## 📈 Future Enhancements

- **Real-time Updates** - WebSocket integration for live data
- **Mobile App** - Native mobile application
- **Cloud Sync** - Remote data synchronization
- **Analytics Dashboard** - Usage statistics and reports
- **Multi-language Support** - Internationalization
- **Advanced QR Features** - QR code scanning and validation

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For support or questions, please refer to the documentation in the `docs/` directory or create an issue in the project repository.

---

**PoolPass** - Making community pool management simple and efficient! 🏊‍♂️ 