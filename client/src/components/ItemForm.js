import React, { useState, useEffect } from 'react';
import './ItemForm.css';

function ItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    barcode: '',
    productName: '',
    price: '',
    quantity: 0,
    category: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.barcode.trim()) {
      newErrors.barcode = 'Barcode is required';
    }
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="item-form">
      <div className="form-header">
        <h2>{formData.id ? 'Edit Item' : 'Add New Item'}</h2>
        {formData.id && <span className="item-id">ID: {formData.id}</span>}
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="barcode">Barcode *</label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            placeholder="e.g., 1234567890"
            disabled={formData.id ? true : false}
            className={errors.barcode ? 'error' : ''}
          />
          {errors.barcode && <span className="error-text">{errors.barcode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Name *</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g., Laptop"
            className={errors.productName ? 'error' : ''}
          />
          {errors.productName && <span className="error-text">{errors.productName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={errors.quantity ? 'error' : ''}
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Electronics"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add product description..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={isSubmitting}>
            {isSubmitting ? '⏳ Saving...' : (formData.id ? '✏️ Update Item' : '➕ Add Item')}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemForm;
