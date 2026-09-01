import './App.css'

function App() {
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
          <p className="small-title">SWEET MOMENTS START HERE</p>

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
          🍰
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <p className="small-title">OUR PRODUCTS</p>

        <h2>Sweet Treats For You</h2>

        <div className="product-container">

          <div className="product-card">
            <div className="product-img">🍫</div>

            <h3>Chocolate Dessert</h3>

            <p>Rich chocolate dessert box</p>

            <div className="product-bottom">
              <strong>Rp25.000</strong>

              <button>Add to Cart</button>
            </div>
          </div>

          <div className="product-card">
            <div className="product-img">🍓</div>

            <h3>Strawberry Cake</h3>

            <p>Fresh strawberry dessert</p>

            <div className="product-bottom">
              <strong>Rp30.000</strong>

              <button>Add to Cart</button>
            </div>
          </div>

        </div>
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