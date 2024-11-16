import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Handle errors
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProducts(token);
    }
  }, [navigate]);

  const fetchProducts = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Handle server error (500 Internal Server Error)
        if (response.status === 500) {
          console.error('Server error occurred');
          setError('Something went wrong on the server. Please try again later.');
        } else {
          setError('Failed to fetch products. Please try again.');
        }
      } else {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products. Please check your connection and try again.');
    } finally {
      setLoading(false); // Set loading to false once the request completes
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Products</h2>
      {products.length === 0 ? (
        <div className="text-center text-xl text-gray-600">No products available</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-4">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/150'}
                  alt={product.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <button
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
