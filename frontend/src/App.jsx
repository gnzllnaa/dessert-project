
import { useEffect, useState } from 'react'
import './App.css'

import dessertImg from './assets/image/dessert.jpg'
import cupcakeImg from './assets/image/cupcake.jpg'
import aboutImg from './assets/image/about-dessert.jpg'

const API_URL = 'http://127.0.0.1:8000/api'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentOption, setPaymentOption] = useState('')

  const [orderLoading, setOrderLoading] = useState(false)
  const [receipt, setReceipt] = useState(null)

  // AUTHENTICATION
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('desserte_user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  // GET PRODUCTS
  useEffect(() => {
    let active = true

    fetch(`${API_URL}/products`, {
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil produk')
        }
        return response.json()
      })
      .then((result) => {
        if (active) setProducts(result.data ?? result)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  // VERIFY SAVED LOGIN SESSION
  useEffect(() => {
    const token = localStorage.getItem('desserte_token')

    if (!token) return

    let active = true

    fetch(`${API_URL}/auth/me`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          localStorage.removeItem('desserte_token')
          localStorage.removeItem('desserte_user')
          if (active) setCurrentUser(null)
          return
        }

        const result = await response.json()

        if (active && result.success && result.user) {
          setCurrentUser(result.user)
          localStorage.setItem(
            'desserte_user',
            JSON.stringify(result.user)
          )
        }
      })
      .catch((error) => {
        console.error('Gagal memeriksa sesi login:', error)
      })

    return () => {
      active = false
    }
  }, [])

  // CART
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    )
  }

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  )

  // RUPIAH
  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(number) || 0)

  // PRODUCT IMAGE
  const getProductImage = (image) => {
    if (!image) return null
    if (image.startsWith('http')) return image

    const cleanImage = image.replace(/^storage[\\/]+/, '')
    return `http://127.0.0.1:8000/storage/${cleanImage}`
  }

  // CHECKOUT
  const openCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong.')
      return
    }

    setShowCart(false)
    setShowCheckout(true)
  }

  const confirmOrder = async (event) => {
    event.preventDefault()

    if (!customerName.trim()) {
      alert('Nama wajib diisi.')
      return
    }

    if (!phone.trim()) {
      alert('Nomor HP wajib diisi.')
      return
    }

    if (!address.trim()) {
      alert('Alamat wajib diisi.')
      return
    }

    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran.')
      return
    }

    if (!paymentOption) {
      alert('Silakan pilih opsi pembayaran.')
      return
    }

    if (cart.length === 0) {
      alert('Keranjang masih kosong.')
      return
    }

    setOrderLoading(true)

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          payment_method: paymentMethod,
          payment_option: paymentOption,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
          })),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error(result)

        if (result.errors) {
          const firstError = Object.values(result.errors)[0]?.[0]
          alert(firstError || 'Data pesanan tidak valid.')
        } else {
          alert(result.message || 'Pesanan gagal dibuat.')
        }
        return
      }

      if (!result.success || !result.order) {
        alert('Pesanan gagal dibuat.')
        return
      }

      setReceipt(result.order)
      setCart([])
      setCustomerName('')
      setPhone('')
      setAddress('')
      setPaymentMethod('')
      setPaymentOption('')
      setShowCheckout(false)
      setShowCart(false)
    } catch (error) {
      console.error(error)
      alert(
        'Tidak dapat terhubung ke server. Pastikan Laravel sedang berjalan.'
      )
    } finally {
      setOrderLoading(false)
    }
  }

  // RECEIPT
  const closeReceipt = () => setReceipt(null)
  const printReceipt = () => window.print()

  // LOGIN AND REGISTER - LARAVEL API
  const handleAuthSubmit = async (event) => {
    event.preventDefault()

    if (!authEmail.trim() || !authPassword) {
      alert('Email dan password wajib diisi.')
      return
    }

    if (authMode === 'register') {
      if (!authName.trim()) {
        alert('Nama lengkap wajib diisi.')
        return
      }

      if (authPassword.length < 6) {
        alert('Password minimal 6 karakter.')
        return
      }

      if (authPassword !== authConfirmPassword) {
        alert('Konfirmasi password belum sama.')
        return
      }
    }

    setAuthLoading(true)

    try {
      const isRegister = authMode === 'register'

      const response = await fetch(
        `${API_URL}/auth/${isRegister ? 'register' : 'login'}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(
            isRegister
              ? {
                  name: authName.trim(),
                  email: authEmail.trim(),
                  password: authPassword,
                  password_confirmation: authConfirmPassword,
                }
              : {
                  email: authEmail.trim(),
                  password: authPassword,
                }
          ),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        const firstError = result.errors
          ? Object.values(result.errors)[0]?.[0]
          : null

        alert(
          firstError ||
            result.message ||
            'Login atau registrasi gagal.'
        )
        return
      }

      if (!result.success || !result.user || !result.token) {
        alert('Respons autentikasi dari server tidak lengkap.')
        return
      }

     
      // ADMIN: arahkan ke dashboard Filament
      if (!isRegister && result.user.role === 'admin') {
        const handoffResponse = await fetch(
          `${API_URL}/auth/admin-handoff`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${result.token}`,
            },
          }
        )

        const handoff = await handoffResponse.json()

        if (
          !handoffResponse.ok ||
          !handoff.success ||
          !handoff.code
        ) {
          alert(
            handoff.message ||
              'Gagal membuka dashboard admin. Silakan coba lagi.'
          )
          return
        }

        // Hapus token dari penyimpanan browser.
        localStorage.removeItem('desserte_token')
        localStorage.removeItem('desserte_user')

        // Cabut token API setelah kode penghubung dibuat.
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${result.token}`,
            },
          })
        } catch (error) {
          console.error('Gagal mencabut token API:', error)
        }

        // Buka dashboard admin Laravel.
        window.location.assign(
          `http://127.0.0.1:8000/admin/handoff?code=${encodeURIComponent(
            handoff.code
          )}`
        )

        return
      }

      // PELANGGAN: tetap di website Desserté
      localStorage.setItem('desserte_token', result.token)
      localStorage.setItem(
        'desserte_user',
        JSON.stringify(result.user)
      )

      setCurrentUser(result.user)
      setShowAuth(false)
      setAuthName('')
      setAuthEmail('')
      setAuthPassword('')
      setAuthConfirmPassword('')

      alert(
        isRegister
          ? 'Registrasi berhasil! Selamat datang di Desserté.'
          : 'Login berhasil! Selamat datang kembali.'
      )

    } catch (error) {
      console.error('Kesalahan autentikasi:', error)
      alert(
        'Tidak dapat terhubung ke Laravel. Pastikan server backend berjalan.'
      )
    } finally {
      setAuthLoading(false)
    }
  }

  // LOGOUT - REVOKE SANCTUM TOKEN
  const handleLogout = async () => {
    const token = localStorage.getItem('desserte_token')

    try {
      if (token) {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.error('Logout backend gagal.')
        }
      }
    } catch (error) {
      console.error('Gagal menghubungi server logout:', error)
    } finally {
      localStorage.removeItem('desserte_token')
      localStorage.removeItem('desserte_user')
      setCurrentUser(null)
    }

    alert('Kamu sudah logout.')
  }

  // NAVBAR
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">Desserté</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <button
            type="button"
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart (
            {cart.reduce((total, item) => total + item.quantity, 0)})
          </button>

          {currentUser ? (
            <div className="user-nav">
              <span className="user-greeting">
                Halo, {currentUser.name}
              </span>
              <button
                type="button"
                className="login-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="login-button"
              onClick={() => {
                setAuthMode('login')
                setShowAuth(true)
              }}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-content">
          <p className="hero-small">SWEET MOMENTS START HERE</p>
          <h1>
            Delicious Dessert
            <br />
            For Every Moment
          </h1>
          <p className="hero-description">
            Nikmati berbagai dessert manis dan lezat yang dibuat untuk
            menemani harimu.
          </p>
          <a href="#products" className="hero-button">
            See Our Desserts
          </a>
        </div>

        <div className="hero-image">
          <img src={dessertImg} alt="Dessert" />
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="products-section">
        <div className="section-title">
          <p>OUR MENU</p>
          <h2>Favorite Desserts</h2>
        </div>

        {loading ? (
          <p className="loading">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="loading">Belum ada produk.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const productImage = getProductImage(product.image)

              return (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    {productImage ? (
                      <img src={productImage} alt={product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="product-info">
                    <span className="category">
                      {product.category || 'Dessert'}
                    </span>
                    <h3>{product.name}</h3>
                    <p className="price">
                      {formatRupiah(product.price)}
                    </p>
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-image">
          <img src={aboutImg} alt="Desserté" />
        </div>

        <div className="about-content">
          <p className="section-label">ABOUT US</p>
          <h2>
            Sweet things,
            <br />
            made with love.
          </h2>
          <p>
            Desserté adalah tempat untuk menemukan berbagai dessert
            manis dengan rasa yang menyenangkan dan cocok untuk
            berbagai momen.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <p className="section-label contact-label">
            COME & SAY HELLO
          </p>
          <h2>Visit Desserté</h2>
          <p className="contact-description">
            Mau menikmati dessert langsung atau punya pertanyaan?
            Kami siap menyambutmu dengan dessert manis dan pelayanan
            terbaik.
          </p>

          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h3>Our Address</h3>
              <p>
                Jl. Raya Desserté No. 25
                <br />
                Semarang, Jawa Tengah
              </p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🕐</div>
              <h3>Opening Hours</h3>
              <p>
                Monday – Saturday
                <br />
                09.00 – 20.00 WIB
                <br />
                Sunday 10.00 – 18.00 WIB
              </p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <h3>WhatsApp</h3>
              <p>
                +62 812-3456-7890
                <br />
                Ready to help you
              </p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <h3>Email</h3>
              <p>
                hello@desserté.com
                <br />
                We reply as soon as possible
              </p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🍰</div>
              <h3>Fresh Every Day</h3>
              <p>
                Our desserts are freshly prepared every day with
                quality ingredients.
              </p>
            </div>

            <div className="contact-item">
              <div className="contact-icon">♡</div>
              <h3>Made With Love</h3>
              <p>
                Every dessert is made carefully to make your moments
                sweeter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Desserté. All rights reserved.</p>
      </footer>

      {/* LOGIN & REGISTER MODAL */}
      {showAuth && (
        <div
          className="auth-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget && !authLoading) {
              setShowAuth(false)
            }
          }}
        >
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              type="button"
              className="auth-close"
              aria-label="Tutup"
              disabled={authLoading}
              onClick={() => setShowAuth(false)}
            >
              ×
            </button>

            <div className="auth-brand-mark">D</div>
            <p className="auth-eyebrow">WELCOME TO DESSERTÉ</p>
            <h2 id="auth-title">
              {authMode === 'login'
                ? 'Senang melihatmu lagi.'
                : 'Mulai cerita manismu.'}
            </h2>
            <p className="auth-description">
              {authMode === 'login'
                ? 'Masuk dan temukan dessert favoritmu.'
                : 'Buat akun untuk pengalaman Desserté yang lebih personal.'}
            </p>

            <div className="auth-tabs">
              <button
                type="button"
                className={authMode === 'login' ? 'active' : ''}
                disabled={authLoading}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'active' : ''}
                disabled={authLoading}
                onClick={() => setAuthMode('register')}
              >
                Registrasi
              </button>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div className="auth-field">
                  <label htmlFor="authName">Nama lengkap</label>
                  <input
                    id="authName"
                    type="text"
                    autoComplete="name"
                    placeholder="Nama kamu"
                    value={authName}
                    onChange={(event) =>
                      setAuthName(event.target.value)
                    }
                    required
                    disabled={authLoading}
                  />
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="authEmail">Email</label>
                <input
                  id="authEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={authEmail}
                  onChange={(event) =>
                    setAuthEmail(event.target.value)
                  }
                  required
                  disabled={authLoading}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="authPassword">Password</label>
                <input
                  id="authPassword"
                  type="password"
                  autoComplete={
                    authMode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  value={authPassword}
                  onChange={(event) =>
                    setAuthPassword(event.target.value)
                  }
                  required
                  disabled={authLoading}
                />
              </div>

              {authMode === 'register' && (
                <div className="auth-field">
                  <label htmlFor="authConfirmPassword">
                    Konfirmasi password
                  </label>
                  <input
                    id="authConfirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    minLength={6}
                    value={authConfirmPassword}
                    onChange={(event) =>
                      setAuthConfirmPassword(event.target.value)
                    }
                    required
                    disabled={authLoading}
                  />
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={authLoading}
              >
                {authLoading
                  ? 'Memproses...'
                  : authMode === 'login'
                    ? 'Masuk ke Desserté'
                    : 'Buat Akun'}
              </button>
            </form>

            <p className="auth-switch-copy">
              {authMode === 'login'
                ? 'Belum punya akun?'
                : 'Sudah punya akun?'}{' '}
              <button
                type="button"
                disabled={authLoading}
                onClick={() =>
                  setAuthMode(
                    authMode === 'login' ? 'register' : 'login'
                  )
                }
              >
                {authMode === 'login' ? 'Daftar sekarang' : 'Login'}
              </button>
            </p>

            <p className="auth-demo-note">
              Akun akan diverifikasi oleh server Desserté.
            </p>
          </div>
        </div>
      )}

      {/* CART */}
      {showCart && (
        <div className="cart-overlay">
          <div className="cart-modal">
            <button
              type="button"
              className="close-button"
              onClick={() => setShowCart(false)}
            >
              ×
            </button>

            <div className="cart-header">
              <p>YOUR ORDER</p>
              <h2>Keranjang</h2>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Keranjang masih kosong</h3>
                <p>Yuk pilih dessert favoritmu!</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{formatRupiah(item.price)}</p>
                      </div>

                      <div className="quantity-controls">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Total</span>
                  <strong>{formatRupiah(totalPrice)}</strong>
                </div>

                <button
                  type="button"
                  className="checkout-button"
                  onClick={openCheckout}
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <button
              type="button"
              className="close-button checkout-close"
              onClick={() => setShowCheckout(false)}
            >
              ×
            </button>

            <div className="checkout-header">
              <p className="checkout-eyebrow">DESSERTÉ ORDER</p>
              <h2>Checkout</h2>
              <p className="checkout-description">
                Lengkapi detail pesananmu dan pilih metode pembayaran.
              </p>
            </div>

            <form className="checkout-form" onSubmit={confirmOrder}>
              {/* CUSTOMER INFORMATION */}
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span className="checkout-number">01</span>
                  <div>
                    <h3>Informasi Pemesan</h3>
                    <p>Isi data untuk pengiriman pesanan.</p>
                  </div>
                </div>

                <div className="checkout-fields">
                  <div className="checkout-field">
                    <label htmlFor="customerName">Nama Lengkap</label>
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(event) =>
                        setCustomerName(event.target.value)
                      }
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">Nomor HP</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="08xxxxxxxxxx"
                      required
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="address">Alamat Pengiriman</label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(event) =>
                        setAddress(event.target.value)
                      }
                      placeholder="Masukkan alamat lengkap"
                      rows="4"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="checkout-section">
                <div className="checkout-section-title">
                  <span className="checkout-number">02</span>
                  <div>
                    <h3>Pembayaran</h3>
                    <p>Pilih metode pembayaran yang tersedia.</p>
                  </div>
                </div>

                <div className="payment-method-section">
                  <p className="payment-method-title">
                    Metode Pembayaran
                  </p>

                  <div className="payment-options">
                    <label
                      className={`payment-option ${
                        paymentMethod === 'E-Wallet' ? 'active' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="E-Wallet"
                        checked={paymentMethod === 'E-Wallet'}
                        onChange={(event) => {
                          setPaymentMethod(event.target.value)
                          setPaymentOption('')
                        }}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-icon">◉</div>
                        <div>
                          <strong>E-Wallet</strong>
                          <span>GoPay, OVO, DANA, ShopeePay</span>
                        </div>
                      </div>
                      <span className="payment-check">✓</span>
                    </label>

                    {paymentMethod === 'E-Wallet' && (
                      <div className="payment-sub-options">
                        <p className="payment-sub-title">Pilih E-Wallet</p>
                        <div className="payment-sub-grid">
                          {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map(
                            (option) => (
                              <label
                                key={option}
                                className={`payment-sub-option ${
                                  paymentOption === option ? 'active' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="paymentOption"
                                  value={option}
                                  checked={paymentOption === option}
                                  onChange={(event) =>
                                    setPaymentOption(event.target.value)
                                  }
                                />
                                <span>{option}</span>
                                {paymentOption === option && <b>✓</b>}
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <label
                      className={`payment-option ${
                        paymentMethod === 'Transfer Bank' ? 'active' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Transfer Bank"
                        checked={paymentMethod === 'Transfer Bank'}
                        onChange={(event) => {
                          setPaymentMethod(event.target.value)
                          setPaymentOption('')
                        }}
                      />
                      <div className="payment-option-content">
                        <div className="payment-option-icon">▣</div>
                        <div>
                          <strong>Transfer Bank</strong>
                          <span>BCA, BRI, BNI, Mandiri</span>
                        </div>
                      </div>
                      <span className="payment-check">✓</span>
                    </label>

                    {paymentMethod === 'Transfer Bank' && (
                      <div className="payment-sub-options">
                        <p className="payment-sub-title">Pilih Bank</p>
                        <div className="payment-sub-grid">
                          {['BCA', 'BRI', 'BNI', 'Mandiri'].map(
                            (option) => (
                              <label
                                key={option}
                                className={`payment-sub-option ${
                                  paymentOption === option ? 'active' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="paymentOption"
                                  value={option}
                                  checked={paymentOption === option}
                                  onChange={(event) =>
                                    setPaymentOption(event.target.value)
                                  }
                                />
                                <span>{option}</span>
                                {paymentOption === option && <b>✓</b>}
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ORDER TOTAL */}
              <div className="checkout-summary">
                <div>
                  <span>Total Pesanan</span>
                  <small>
                    {cart.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{' '}
                    item
                  </small>
                </div>
                <strong>{formatRupiah(totalPrice)}</strong>
              </div>

              <button
                type="submit"
                className="confirm-order-button"
                disabled={orderLoading}
              >
                {orderLoading ? 'Memproses...' : 'Buat Pesanan'}
              </button>

              <p className="checkout-note">
                Dengan melanjutkan pesanan, pastikan data yang kamu
                masukkan sudah benar.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT */}
      {receipt && (
        <div className="receipt-overlay">
          <div className="receipt-modal">
            <div className="receipt-header">
              <h2>Desserté</h2>
              <p>STRUK PESANAN</p>
            </div>

            <div className="receipt-success">
              ✓ Pesanan berhasil dibuat!
            </div>

            <div className="receipt-info">
              <div className="receipt-line">
                <span>No. Pesanan</span>
                <strong>#{receipt.id}</strong>
              </div>
              <div className="receipt-line">
                <span>Nama</span>
                <strong>{receipt.customer_name}</strong>
              </div>
              <div className="receipt-line">
                <span>No. HP</span>
                <strong>{receipt.phone}</strong>
              </div>
              <div className="receipt-line">
                <span>Alamat</span>
                <strong>{receipt.address}</strong>
              </div>
              <div className="receipt-line">
                <span>Payment</span>
                <strong>{receipt.payment_method}</strong>
              </div>
              <div className="receipt-line">
                <span>Payment Option</span>
                <strong>{receipt.payment_option}</strong>
              </div>
              <div className="receipt-line">
                <span>Status</span>
                <strong>{receipt.status}</strong>
              </div>
            </div>

            <div className="receipt-products">
              {(receipt.items || []).map((item, index) => (
                <div
                  className="receipt-product"
                  key={`${item.product_id ?? item.id ?? 'item'}-${index}`}
                >
                  <div>
                    <strong>{item.product_name}</strong>
                    <p>
                      {item.quantity} ×{' '}
                      {formatRupiah(item.unit_price)}
                    </p>
                  </div>
                  <strong>{formatRupiah(item.subtotal)}</strong>
                </div>
              ))}
            </div>

            <div className="receipt-total">
              <span>Total</span>
              <strong>{formatRupiah(receipt.total)}</strong>
            </div>

            <p className="receipt-thanks">
              Terima kasih sudah memesan di Desserté ♡
            </p>

            <div className="receipt-actions">
              <button
                type="button"
                className="print-button"
                onClick={printReceipt}
              >
                🖨 Cetak Struk
              </button>
              <button
                type="button"
                className="close-receipt-button"
                onClick={closeReceipt}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
