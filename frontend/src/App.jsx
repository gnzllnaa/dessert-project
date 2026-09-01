import { useEffect, useState } from 'react'
import './App.css'
import dessertImg from './assets/image/dessert.jpg'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => response.json())
      .then((result) => {
        setProducts(result.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Gagal mengambil produk:', error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Desserté</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <button className="cart-btn">🛒 Cart</button>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="small-title">
            SWEET MOMENTS START HERE
          </p>

          <h1>
            Delicious Dessert
            <br />
            <span>Made With Love</span>
          </h1>

          <p className="hero-text">
            Nikmati dessert box lezat dengan rasa premium
            untuk menemani setiap momen manismu.
          </p>

          <a href="#products" className="shop-btn">
            Shop Now
          </a>
        </div>

        <div className="hero-dessert">
          <img
            src={dessertImg}
            alt="Desserté Dessert"
          />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <p className="small-title">OUR PRODUCTS</p>

        <h2>Sweet Treats For You</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-container">
            {products.map((product) => (
              <div
                className="product-card"
                key={product.id}
              >
                <div className="product-img">
                  <img
                    src={dessertImg}
                    alt={product.name}
                  />
                </div>

                <h3>{product.name}</h3>

                <p>{product.category}</p>

                <div className="product-bottom">
                  <strong>
                    Rp{Number(product.price).toLocaleString('id-ID')}
                  </strong>

                  <button>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div>
          <p className="small-title">ABOUT US</p>

          <h2>Made For Your Sweetest Moments</h2>

          <p>
            Desserté hadir dengan berbagai pilihan dessert
            yang dibuat dengan bahan berkualitas dan rasa
            yang cocok untuk menemani hari-harimu.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <p className="small-title">CONTACT US</p>

        <h2>Let's Make Your Day Sweeter</h2>

        <p>
          Punya pertanyaan atau ingin melakukan pemesanan?
          Hubungi kami sekarang.
        </p>

        <button>Contact Us</button>
      </section>

      {/* FOOTER */}
      <footer>
        <h3>Desserté</h3>
        <p>Sweetness in every bite.</p>
        <p>© 2026 Desserté. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App