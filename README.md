# Barcode Inventory Management System

## Overview

A comprehensive web-based inventory management system with barcode scanning capabilities. This application allows you to easily add, edit, remove, and manage inventory items using barcode scanning or manual entry.

## Features

✅ **Barcode Scanning**
- Real-time barcode scanner using camera
- Manual barcode entry fallback
- Supports various barcode formats (UPC-A, EAN-13, Code 128, etc.)

✅ **Inventory Management**
- Add new products with barcode, name, price, and quantity
- Edit existing inventory items
- Delete products
- Update stock quantities

✅ **Product Information**
- Barcode
- Product name
- Price
- Quantity in stock
- Category
- Description

✅ **Search & Filter**
- Search by barcode, product name, or category
- Real-time search results

✅ **Inventory Analytics**
- Total items count
- Total quantity in stock
- Total inventory value
- Individual item values

✅ **Data Export**
- Export inventory to CSV format
- Complete product information in export

✅ **Persistent Storage**
- SQLite database for local data storage
- All changes saved automatically

## Tech Stack

**Frontend:**
- React 18
- Axios for HTTP requests
- Quagga2 for barcode scanning
- CSS3 for styling

**Backend:**
- Node.js
- Express.js
- SQLite3
- CORS enabled

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cee-tv/barcode-inventory.git
   cd barcode-inventory
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development server**
   ```bash
   # Terminal 1 - Start backend
   npm start

   # Terminal 2 - Start frontend
   npm run client
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Adding Items via Barcode Scanner

1. Click on **"📱 Scan Barcode"** tab
2. Click **"🎥 Start Camera Scanner"**
3. Point your camera at the barcode
4. Once scanned, the item form will appear
5. Fill in the product details (or edit if item exists)
6. Click **"➕ Add Item"** to save

### Adding Items Manually

1. Click on **"➕ Add/Edit Item"** tab
2. Fill in all required fields (marked with *)
3. Click **"➕ Add Item"** to save

### Editing Items

1. Go to **"📋 Inventory List"** tab
2. Click the **"✏️"** button on the item you want to edit
3. Update the information
4. Click **"✏️ Update Item"**

### Deleting Items

1. Go to **"📋 Inventory List"** tab
2. Click the **"🗑️"** button on the item
3. Confirm the deletion

### Searching Inventory

1. Go to **"📋 Inventory List"** tab
2. Use the search bar at the top
3. Search by barcode, product name, or category
4. Results update in real-time

### Exporting Data

1. Click on **"📥 Export CSV"** button
2. CSV file will download with all inventory data

## API Endpoints

### Inventory Management

- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get item by ID
- `GET /api/inventory/barcode/:barcode` - Get item by barcode
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `PATCH /api/inventory/:id/quantity` - Update quantity

### Search & Export

- `GET /api/search?q=query` - Search items
- `GET /api/export/csv` - Export to CSV

## Database Schema

```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barcode TEXT UNIQUE NOT NULL,
  productName TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category TEXT,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Barcode Format Support

The application supports scanning the following barcode formats:
- UPC-A
- UPC-E
- EAN-13
- EAN-8
- Code 128
- Code 39
- ITF-14
- And more via Quagga2

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note:** Camera access is required for barcode scanning functionality.

## Camera Permissions

When using the barcode scanner, the browser will ask for camera access. Make sure to:
1. Allow camera access when prompted
2. Use HTTPS in production (required for camera access)
3. Ensure your camera hardware is working properly

## Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure camera hardware is connected and functional
- Try using a different browser
- Use manual barcode entry as alternative

### Barcode Not Scanning
- Ensure barcode is clearly visible and not damaged
- Try different lighting conditions
- Move camera closer/farther from barcode
- Check if barcode format is supported

### Database Issues
- Delete `inventory.db` to reset the database
- Check file permissions in the project directory
- Ensure SQLite3 is properly installed

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Unix/Linux/Mac
  lsof -ti:5000 | xargs kill -9

  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

## Production Build

```bash
# Build React frontend
npm run build

# Start production server
NODE_ENV=production npm start
```

## File Structure

```
barcode-inventory/
├── server.js                 # Express server & API
├── package.json              # Backend dependencies
├── inventory.db              # SQLite database (auto-created)
├── .env                      # Environment variables
├── .gitignore
├── README.md
└── client/                   # React frontend
    ├── package.json          # Frontend dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js            # Main app component
        ├── App.css
        └── components/
            ├── BarcodeScanner.js
            ├── BarcodeScanner.css
            ├── ItemForm.js
            ├── ItemForm.css
            ├── InventoryList.js
            ├── InventoryList.css
            ├── SearchBar.js
            └── SearchBar.css
```

## Features Coming Soon

- 📊 Advanced analytics and reporting
- 📱 Mobile app (React Native)
- 🏪 Multi-store support
- 👥 User authentication
- 📈 Inventory trend analysis
- 🔔 Low stock alerts
- 🏷️ Barcode generation
- 📂 Category management

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions, please open an issue on GitHub or contact the maintainers.

## Author

Created by cee-tv

---

**Made with ❤️ for inventory management**
