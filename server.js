const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Database setup
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT UNIQUE NOT NULL,
      productName TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      category TEXT,
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Routes

// Get all inventory items
app.get('/api/inventory', (req, res) => {
  db.all('SELECT * FROM inventory ORDER BY updatedAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single item by barcode
app.get('/api/inventory/barcode/:barcode', (req, res) => {
  const { barcode } = req.params;
  db.get('SELECT * FROM inventory WHERE barcode = ?', [barcode], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

// Get item by ID
app.get('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM inventory WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  });
});

// Add new inventory item
app.post('/api/inventory', (req, res) => {
  const { barcode, productName, price, quantity, category, description } = req.body;

  if (!barcode || !productName || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO inventory (barcode, productName, price, quantity, category, description)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [barcode, productName, parseFloat(price), parseInt(quantity) || 0, category || '', description || ''],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Barcode already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else {
        res.status(201).json({
          id: this.lastID,
          barcode,
          productName,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 0,
          category: category || '',
          description: description || ''
        });
      }
    }
  );
});

// Update inventory item
app.put('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { barcode, productName, price, quantity, category, description } = req.body;

  if (!barcode || !productName || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `UPDATE inventory 
     SET barcode = ?, productName = ?, price = ?, quantity = ?, category = ?, description = ?, updatedAt = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [barcode, productName, parseFloat(price), parseInt(quantity), category || '', description || '', id],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: 'Barcode already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json({ success: true, message: 'Item updated successfully' });
      }
    }
  );
});

// Delete inventory item
app.delete('/api/inventory/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM inventory WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json({ success: true, message: 'Item deleted successfully' });
    }
  });
});

// Update quantity
app.patch('/api/inventory/:id/quantity', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ error: 'Quantity is required' });
  }

  db.run(
    'UPDATE inventory SET quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [parseInt(quantity), id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json({ success: true, message: 'Quantity updated' });
      }
    }
  );
});

// Search inventory
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }

  const searchTerm = `%${q}%`;
  db.all(
    `SELECT * FROM inventory WHERE barcode LIKE ? OR productName LIKE ? OR category LIKE ? ORDER BY updatedAt DESC`,
    [searchTerm, searchTerm, searchTerm],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Export inventory to CSV
app.get('/api/export/csv', (req, res) => {
  db.all('SELECT * FROM inventory ORDER BY productName ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    let csv = 'ID,Barcode,Product Name,Price,Quantity,Category,Description,Created At,Updated At\n';
    rows.forEach(row => {
      csv += `${row.id},"${row.barcode}","${row.productName}",${row.price},${row.quantity},"${row.category}","${row.description}","${row.createdAt}","${row.updatedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
    res.send(csv);
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit();
});
