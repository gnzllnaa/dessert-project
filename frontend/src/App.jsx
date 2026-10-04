import { useEffect, useState } from 'react'
import './App.css'

import dessertImg from './assets/image/dessert.jpg'
import cupcakeImg from './assets/image/cupcake.jpg'
import dessertBoxImg from './assets/image/dessert-box.jpg'

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

  // =========================
  // GET PRODUCTS
  // =========================

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil produk')
        }

        return response.json()
      })
      .then((result) => {
        setProducts(result.data ?? result)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [])

  // =========================
  // CART
  // =========================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
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

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
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

  // =========================
  // RUPIAH
  // =========================

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number)
  }

  // =========================
  // PRODUCT IMAGE
  // =========================

  const getProductImage = (image) => {
    if (!image) {
      return null
    }

    if (image.startsWith('http')) {
      return image
    }

    const cleanImage = image.replace(/^storage\//, '')

    return `http://127.0.0.1:8000/storage/${cleanImage}`
  }

  // =========================
  // CHECKOUT
  // =========================

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
      const response = await fetch(
        'http://127.0.0.1:8000/api/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            customer_name: customerName,
            phone: phone,
            address: address,
            payment_method: paymentMethod,
            payment_option: paymentOption,
            items: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              price: Number(item.price),
            })),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        console.error(result)

        if (result.errors) {
          const firstError =
            Object.values(result.errors)[0]?.[0]

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

  // =========================
  // RECEIPT
  // =========================

  const closeReceipt = () => {
    setReceipt(null)
  }

  const printReceipt = () => {
    window.print()
  }

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">
        <div className="logo">
          Desserté
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>

          <button
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            🛒 Cart (
            {cart.reduce(
              (total, item) => total + item.quantity,
              0
            )}
            )
          </button>
        </div>
      </nav>

      {/* =========================
          HERO
      ========================= */}

      <section id="home" className="hero">
        <div className="hero-content">
          <p className="hero-small">
            SWEET MOMENTS START HERE
          </p>

          <h1>
            Delicious Dessert
            <br />
            For Every Moment
          </h1>

          <p className="hero-description">
            Nikmati berbagai dessert manis dan lezat
            yang dibuat untuk menemani harimu.
          </p>

          <a
            href="#products"
            className="hero-button"
          >
            See Our Desserts
          </a>
        </div>

        <div className="hero-image">
          <img
            src={dessertImg}
            alt="Dessert"
          />
        </div>
      </section>

      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        id="products"
        className="products-section"
      >
        <div className="section-title">
          <p>OUR MENU</p>

          <h2>
            Favorite Desserts
          </h2>
        </div>

        {loading ? (
          <p className="loading">
            Loading products...
          </p>
        ) : products.length === 0 ? (
          <p className="loading">
            Belum ada produk.
          </p>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const productImage =
                getProductImage(product.image)

              return (
                <div
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-image">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.name}
                      />
                    ) : (
                      <div className="no-image">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <span className="category">
                      {product.category || 'Dessert'}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="price">
                      {formatRupiah(product.price)}
                    </p>

                    <button
                      className="add-button"
                      onClick={() =>
                        addToCart(product)
                      }
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

      {/* =========================
          ABOUT
      ========================= */}

      <section
        id="about"
        className="about-section"
      >
        <div className="about-image">
          <img
            src={dessertBoxImg}
            alt="Dessert Box"
          />
        </div>

        <div className="about-content">
          <p className="section-label">
            ABOUT US
          </p>

          <h2>
            Sweet things,
            <br />
            made with love.
          </h2>

          <p>
            Desserté adalah tempat untuk menemukan
            berbagai dessert manis dengan rasa yang
            menyenangkan dan cocok untuk berbagai
            momen.
          </p>
        </div>
      </section>

      {/* =========================
          CONTACT
      ========================= */}

      <section
        id="contact"
        className="contact-section"
      >
        <div className="contact-content">
          <p className="section-label">
            CONTACT
          </p>

          <h2>
            Let's make your day sweeter.
          </h2>

          <p>
            Pesan dessert favoritmu melalui website
            Desserté.
          </p>
        </div>

        <div className="contact-image">
          <img
            src={cupcakeImg}
            alt="Cupcake"
          />
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer>
        <p>
          © 2026 Desserté. All rights reserved.
        </p>
      </footer>

      {/* =========================
          CART
      ========================= */}

      {showCart && (
        <div className="overlay">
          <div className="cart-modal">

            <button
              className="close-button"
              onClick={() => setShowCart(false)}
            >
              ×
            </button>

            <h2>
              Keranjang
            </h2>

            {cart.length === 0 ? (
              <p className="empty-cart">
                Keranjang masih kosong.
              </p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <div>
                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          {formatRupiah(item.price)}
                        </p>
                      </div>

                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <span>
                    Total
                  </span>

                  <strong>
                    {formatRupiah(totalPrice)}
                  </strong>
                </div>

                <button
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

      {/* =========================
          CHECKOUT
      ========================= */}

      {showCheckout && (
        <div className="overlay">
          <div className="checkout-modal">

            <button
              className="close-button"
              onClick={() =>
                setShowCheckout(false)
              }
            >
              ×
            </button>

            <h2>
              Checkout
            </h2>

            <p className="checkout-description">
              Isi data berikut untuk menyelesaikan pesanan.
            </p>

            <form onSubmit={confirmOrder}>

              <label>
                Nama Lengkap
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                placeholder="Masukkan nama"
              />

              <label>
                Nomor HP
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="08xxxxxxxxxx"
              />

              <label>
                Alamat
              </label>

              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Masukkan alamat lengkap"
                rows="4"
              />

              {/* =========================
                  PAYMENT METHOD
              ========================= */}

              <div className="payment-method-section">
                <p className="payment-method-title">
                  Metode Pembayaran
                </p>

                <div className="payment-options">

                  {/* E-WALLET */}

                  <label
                    className={`payment-option ${
                      paymentMethod === 'E-Wallet'
                        ? 'active'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="E-Wallet"
                      checked={
                        paymentMethod === 'E-Wallet'
                      }
                      onChange={(event) => {
                        setPaymentMethod(
                          event.target.value
                        )
                        setPaymentOption('')
                      }}
                    />

                    <div>
                      <strong>
                        E-Wallet
                      </strong>

                      <span>
                        GoPay, OVO, DANA, ShopeePay
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'E-Wallet' && (
                    <div className="payment-sub-options">
                      <p className="payment-sub-title">
                        Pilih E-Wallet
                      </p>

                      {[
                        'GoPay',
                        'OVO',
                        'DANA',
                        'ShopeePay',
                      ].map((option) => (
                        <label
                          key={option}
                          className={`payment-sub-option ${
                            paymentOption === option
                              ? 'active'
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentOption"
                            value={option}
                            checked={
                              paymentOption === option
                            }
                            onChange={(event) =>
                              setPaymentOption(
                                event.target.value
                              )
                            }
                          />

                          <span>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* TRANSFER BANK */}

                  <label
                    className={`payment-option ${
                      paymentMethod === 'Transfer Bank'
                        ? 'active'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Transfer Bank"
                      checked={
                        paymentMethod === 'Transfer Bank'
                      }
                      onChange={(event) => {
                        setPaymentMethod(
                          event.target.value
                        )
                        setPaymentOption('')
                      }}
                    />

                    <div>
                      <strong>
                        Transfer Bank
                      </strong>

                      <span>
                        BCA, BRI, BNI, Mandiri
                      </span>
                    </div>
                  </label>

                  {paymentMethod === 'Transfer Bank' && (
                    <div className="payment-sub-options">
                      <p className="payment-sub-title">
                        Pilih Bank
                      </p>

                      {[
                        'BCA',
                        'BRI',
                        'BNI',
                        'Mandiri',
                      ].map((option) => (
                        <label
                          key={option}
                          className={`payment-sub-option ${
                            paymentOption === option
                              ? 'active'
                              : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentOption"
                            value={option}
                            checked={
                              paymentOption === option
                            }
                            onChange={(event) =>
                              setPaymentOption(
                                event.target.value
                              )
                            }
                          />

                          <span>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              {/* =========================
                  TOTAL
              ========================= */}

              <div className="checkout-summary">
                <span>
                  Total Pesanan
                </span>

                <strong>
                  {formatRupiah(totalPrice)}
                </strong>
              </div>

              <button
                type="submit"
                className="checkout-button"
                disabled={orderLoading}
              >
                {orderLoading
                  ? 'Memproses...'
                  : 'Buat Pesanan'}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* =========================
          RECEIPT
      ========================= */}

      {receipt && (
        <div className="overlay receipt-overlay">
          <div className="receipt-modal">

            <div className="receipt-header">
              <h2>
                Desserté
              </h2>

              <p>
                STRUK PESANAN
              </p>
            </div>

            <div className="receipt-success">
              ✓ Pesanan berhasil dibuat!
            </div>

            <div className="receipt-info">

              <div>
                <span>
                  No. Pesanan
                </span>

                <strong>
                  #{receipt.id}
                </strong>
              </div>

              <div>
                <span>
                  Nama
                </span>

                <strong>
                  {receipt.customer_name}
                </strong>
              </div>

              <div>
                <span>
                  No. HP
                </span>

                <strong>
                  {receipt.phone}
                </strong>
              </div>

              <div>
                <span>
                  Alamat
                </span>

                <strong>
                  {receipt.address}
                </strong>
              </div>

              <div>
                <span>
                  Payment
                </span>

                <strong>
                  {receipt.payment_method}
                </strong>
              </div>

              <div>
                <span>
                  Payment Option
                </span>

                <strong>
                  {receipt.payment_option}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {receipt.status}
                </strong>
              </div>

            </div>

            <div className="receipt-line"></div>

            <div className="receipt-products">
              {(receipt.items || []).map(
                (item, index) => (
                  <div
                    className="receipt-product"
                    key={`${item.product_id}-${index}`}
                  >
                    <div>
                      <strong>
                        {item.product_name}
                      </strong>

                      <p>
                        {item.quantity} ×{' '}
                        {formatRupiah(
                          item.unit_price
                        )}
                      </p>
                    </div>

                    <strong>
                      {formatRupiah(
                        item.subtotal
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

            <div className="receipt-line"></div>

            <div className="receipt-total">
              <span>
                Total
              </span>

              <strong>
                {formatRupiah(receipt.total)}
              </strong>
            </div>

            <p className="receipt-thanks">
              Terima kasih sudah memesan di Desserté ♡
            </p>

            <div className="receipt-actions">
              <button
                className="print-button"
                onClick={printReceipt}
              >
                🖨 Cetak Struk
              </button>

              <button
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