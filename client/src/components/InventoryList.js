import React from 'react';
import './InventoryList.css';

function InventoryList({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h2>No items in inventory</h2>
        <p>Add your first item using the barcode scanner or the add item form.</p>
      </div>
    );
  }

  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="inventory-list">
      <div className="list-summary">
        <div className="summary-card">
          <span className="summary-label">Total Items</span>
          <span className="summary-value">{items.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Quantity</span>
          <span className="summary-value">{totalQuantity}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Value</span>
          <span className="summary-value">${totalValue.toFixed(2)}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="table-row">
                <td className="barcode-cell">
                  <code>{item.barcode}</code>
                </td>
                <td className="name-cell">
                  <div className="product-name">{item.productName}</div>
                  {item.description && (
                    <div className="product-desc">{item.description}</div>
                  )}
                </td>
                <td className="category-cell">
                  {item.category || '-'}
                </td>
                <td className="price-cell">
                  ${item.price.toFixed(2)}
                </td>
                <td className="quantity-cell">
                  <span className={`quantity-badge ${item.quantity === 0 ? 'out-of-stock' : ''}`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="value-cell">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="actions-cell">
                  <button
                    className="btn btn-small btn-edit"
                    onClick={() => onEdit(item)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-small btn-delete"
                    onClick={() => onDelete(item.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;
