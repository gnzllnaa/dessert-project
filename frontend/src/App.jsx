import './App.css'
import { useEffect, useState } from 'react'

import cupcake from './assets/image/cupcake.jpg'
import dessert from './assets/image/dessert.jpg'
import dessertBox from './assets/image/dessert-box.jpg'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  // Data checkout
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)

  // Ambil data produk dari Laravel
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

  // Tambah produk ke cart
  const addToCart = (product) => {
    setCart(currentCart => {
      const existingProduct = currentCart.find(
        item => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  // Tambah quantity
  const increaseQuantity = (productId) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  // Kurangi quantity
  const decreaseQuantity = (productId) => {
    setCart(currentCart =>
      currentCart
        .map(item =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  // Hapus produk dari cart
  const removeFromCart = (productId) => {
    setCart(currentCart =>
      currentCart.filter(item => item.id !== productId)
    )
  }

  // Hitung jumlah semua produk di cart
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // Hitung total harga
  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  )

  // Kirim pesanan ke Laravel
  const confirmOrder = async () => {
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert('Lengkapi data pemesanan terlebih dahulu.')
      return
    }

    if (cart.length === 0) {
      alert('Keranjang masih kosong.')
      return
    }

    setOrderLoading(true)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            customer_name: customerName,
            phone: phone,
            address: address,
            items: cart.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              unit_price: item.price,
            })),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        console.error('Response Laravel:', result)

        if (result.errors) {
          alert('Data pesanan tidak valid. Cek kembali data yang diisi.')
        } else {
          alert('Pesanan gagal disimpan.')
        }

        return
      }

      alert(
        `Pesanan berhasil! ID Pesanan: #${result.data.id}`
      )

      // Kosongkan cart dan form
      setCart([])
      setCustomerName('')
      setPhone('')
      setAddress('')
      setShowCheckout(false)

    } catch (error) {
      console.error('Error:', error)
      alert('Tidak dapat terhubung ke server Laravel.')
    } finally {
      setOrderLoading(false)
    }
  }

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

        <button onClick={() => setShowCart(true)}>
          🛒 Cart ({totalItems})
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

      {/* CART POP-UP */}
      {showCart && (
        <div className="modal-overlay">
          <div className="cart-modal">

            <button
              className="close-modal"
              onClick={() => setShowCart(false)}
            >
              ✕
            </button>

            <h2>Your Cart 🛒</h2>

            <p className="modal-subtitle">
              Your sweet treats
            </p>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🧁</span>
                <p>Keranjang kamu masih kosong</p>
              </div>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div>
                        <span>{item.name}</span>
                        <small>{item.category}</small>
                      </div>

                      <strong>
                        Rp
                        {(
                          Number(item.price) * item.quantity
                        ).toLocaleString('id-ID')}
                      </strong>

                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Total</span>

                  <strong>
                    Rp{totalPrice.toLocaleString('id-ID')}
                  </strong>
                </div>

                <button
                  className="checkout-btn"
                  onClick={() => {
                    setShowCart(false)
                    setShowCheckout(true)
                  }}
                >
                  Checkout →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT POP-UP */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="checkout-modal">

            <button
              className="close-modal"
              onClick={() => setShowCheckout(false)}
            >
              ✕
            </button>

            <h2>Checkout 🍰</h2>

            <p className="modal-subtitle">
              Complete your order
            </p>

            <input
              type="text"
              placeholder="Nama Lengkap"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Nomor WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              placeholder="Alamat Pengiriman"
              rows="4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>

            <div className="checkout-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowCheckout(false)}
              >
                Batal
              </button>

              <button
                className="confirm-btn"
                onClick={confirmOrder}
                disabled={orderLoading}
              >
                {orderLoading
                  ? 'Menyimpan...'
                  : 'Pesan Sekarang'}
              </button>
            </div>

          </div>
        </div>
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