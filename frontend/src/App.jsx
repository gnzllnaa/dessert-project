import './App.css'
import { useEffect, useState } from 'react'

import cupcake from './assets/image/cupcake.jpg'
import dessert from './assets/image/dessert.jpg'
import dessertBox from './assets/image/dessert-box.jpg'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(response => response.json())
      .then(result => {
        setProducts(result.data)
      })
      .catch(error => {
        console.error('Gagal mengambil data produk:', error)
      })
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price),
    0
  )

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>Desserté</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <button>
          🛒 Cart ({cart.length})
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-text">
          <p>SWEET MOMENTS START HERE</p>

          <h1>
            Delicious Dessert
            <br />
            Made With Love
          </h1>

          <p>
            Nikmati berbagai dessert lezat yang dibuat
            dengan bahan berkualitas untuk menemani
            setiap momen manismu.
          </p>

          <a href="#products" className="shop-btn">
            Shop Now
          </a>
        </div>

        <img src={dessert} alt="Dessert" />
      </section>

      {/* PRODUCTS */}
      <section className="products" id="products">
        <p>OUR PRODUCTS</p>
        <h2>Sweet Treats For You</h2>

        <div className="product-container">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={
                  product.image
                    ? `http://127.0.0.1:8000/storage/${product.image}`
                    : product.name.toLowerCase().includes('cupcake')
                      ? cupcake
                      : dessertBox
                }
                alt={product.name}
              />

              <h3>{product.name}</h3>

              <p>{product.category}</p>

              <strong>
                Rp{Number(product.price).toLocaleString('id-ID')}
              </strong>

              <button onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-image">
          <img src={dessertBox} alt="Dessert Box Desserté" />
        </div>

        <div className="about-text">
          <p className="about-label">ABOUT DESSERTÉ</p>

          <h2>Sweetness Made With Love</h2>

          <p>
            Desserté adalah toko dessert yang menghadirkan berbagai
            pilihan makanan manis dengan rasa yang lezat dan tampilan
            yang menarik.
          </p>

          <p>
            Kami menggunakan bahan berkualitas untuk menciptakan
            dessert yang cocok dinikmati sendiri maupun bersama
            orang-orang tersayang.
          </p>

          <div className="about-points">
            <span>Fresh Dessert</span>
            <span>♡ Made With Love</span>
            <span>Quality Ingredients</span>
          </div>
        </div>
      </section>

      {/* CART */}
      {cart.length > 0 && (
        <section className="cart-section">
          <h2>🛒 Your Cart</h2>

          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <span>{item.name}</span>

              <strong>
                Rp{Number(item.price).toLocaleString('id-ID')}
              </strong>

              <button onClick={() => removeFromCart(index)}>
                Hapus
              </button>
            </div>
          ))}

          <div className="cart-total">
            <h3>
              Total: Rp{totalPrice.toLocaleString('id-ID')}
            </h3>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer id="contact">
        <h2>Desserté</h2>
        <p>Sweetness in every bite 🍰</p>
      </footer>
    </>
  )
}

export default App