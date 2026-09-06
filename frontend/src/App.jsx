import './App.css'
import { useEffect, useState } from 'react'

import cupcake from './assets/image/cupcake.jpg'
import dessert from './assets/image/dessert.jpg'
import dessertBox from './assets/image/dessert-box.jpg'

function App() {
  const [products, setProducts] = useState([])

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

  return (
    <>
      <nav className="navbar">
        <h2>Desserté</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <button>🛒 Cart</button>
      </nav>

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

      <button>Add to Cart</button>
    </div>
  ))}
</div>
      </section>

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



      <footer id="contact">
        <h2>Desserté</h2>
        <p>Sweetness in every bite 🍰</p>
      </footer>
    </>
  )
}

export default App