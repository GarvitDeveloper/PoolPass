const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('.'));

// Set proper MIME types for JSON files
app.use('*.json', (req, res, next) => {
    res.type('application/json');
    next();
});

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Single page app routing - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
    console.log(`🏊‍♂️ PoolPass server running on port ${PORT}`);
    console.log(`🌐 Open your browser to: http://localhost:${PORT}`);
    console.log(`📱 Admin PIN: 1234`);
    console.log(`🔧 Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down PoolPass server...');
    process.exit(0);
}); 