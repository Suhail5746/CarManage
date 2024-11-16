// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProductDetail(token);
    }
  }, [id, navigate]);

  const fetchProductDetail = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProduct(data);
      } else {
        alert('Failed to fetch product details');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          tags: product.tags,
          images: product.images,
        }),
      });
      if (response.ok) {
        alert('Product updated successfully');
        navigate('/products');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      {product ? (
        <div>
          <h2>{product.title}</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={product.title}
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
            />
            <input
              type="text"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
            <input
              type="text"
              value={product.tags}
              onChange={(e) => setProduct({ ...product, tags: e.target.value })}
            />
            <input
              type="text"
              value={product.images}
              onChange={(e) => setProduct({ ...product, images: e.target.value })}
            />
            <button type="submit">Update Product</button>
          </form>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetail;
