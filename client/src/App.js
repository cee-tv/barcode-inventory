import React, { useState, useEffect } from 'react';
import './App.css';
import BarcodeScanner from './components/BarcodeScanner';
import InventoryList from './components/InventoryList';
import ItemForm from './components/ItemForm';
import SearchBar from './components/SearchBar';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all items
  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Error fetching inventory items');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle barcode scan
  const handleBarcodeScan = async (barcode) => {
    try {
      const response = await axios.get(`/api/inventory/barcode/${barcode}`);
      setSelectedItem(response.data);
      setShowForm(true);
      setShowScanner(false);
      setActiveTab('form');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Item doesn't exist, create new one
        setSelectedItem({ barcode, productName: '', price: '', quantity: 0, category: '', description: '' });
        setShowForm(true);
        setShowScanner(false);
        setActiveTab('form');
      } else {
        alert('Error scanning barcode');
      }
    }
  };

  // Handle item save
  const handleSaveItem = async (itemData) => {
    try {
      if (itemData.id) {
        // Update existing
        await axios.put(`/api/inventory/${itemData.id}`, itemData);
      } else {
        // Create new
        await axios.post('/api/inventory', itemData);
      }
      fetchItems();
      setShowForm(false);
      setSelectedItem(null);
      setActiveTab('list');
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.response?.data?.error || 'Error saving item');
    }
  };

  // Handle item delete
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/inventory/${id}`);
        fetchItems();
        setSelectedItem(null);
        setShowForm(false);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredItems(items);
    } else {
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Error searching:', error);
        alert('Error searching items');
      }
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const response = await axios.get('/api/export/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory.csv');
      document.body.appendChild(link);
      link.click();
      link.parentChild.removeChild(link);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Error exporting inventory');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📦 Barcode Inventory Manager</h1>
          <p className="subtitle">Manage your inventory with barcode scanning</p>
        </div>
      </header>

      <div className="app-container">
        <nav className="tabs">
          <button
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 Inventory List
          </button>
          <button
            className={`tab-button ${activeTab === 'scanner' ? 'active' : ''}`}
            onClick={() => setActiveTab('scanner')}
          >
            📱 Scan Barcode
          </button>
          <button
            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            ➕ Add/Edit Item
          </button>
          <button className="tab-button" onClick={handleExport}>
            📥 Export CSV
          </button>
        </nav>

        {activeTab === 'list' && (
          <div className="tab-content">
            <SearchBar onSearch={handleSearch} />
            <div className="list-info">
              <p>Total Items: <strong>{filteredItems.length}</strong></p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedItem(null);
                  setShowForm(true);
                  setActiveTab('form');
                }}
              >
                + Add New Item
              </button>
            </div>
            <InventoryList
              items={filteredItems}
              onEdit={(item) => {
                setSelectedItem(item);
                setShowForm(true);
                setActiveTab('form');
              }}
              onDelete={handleDeleteItem}
            />
          </div>
        )}

        {activeTab === 'scanner' && (
          <div className="tab-content">
            <BarcodeScanner onScan={handleBarcodeScan} />
          </div>
        )}

        {activeTab === 'form' && (
          <div className="tab-content">
            <ItemForm
              item={selectedItem}
              onSave={handleSaveItem}
              onCancel={() => {
                setShowForm(false);
                setSelectedItem(null);
                setActiveTab('list');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
