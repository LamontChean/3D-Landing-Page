import { useEffect, useRef, useState } from 'react'
import './App.css'

// Hook for Intersection Observer (lazy loading / scroll reveal)
function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1, ...options })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isInView]
}

// Animated counter component
function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, isInView] = useInView()

  useEffect(() => {
    if (!isInView) return
    const numericTarget = parseInt(target.replace(/[^0-9.]/g, ''))
    if (isNaN(numericTarget)) { setCount(target); return }

    let start = 0
    const increment = numericTarget / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= numericTarget) {
        clearInterval(timer)
        setCount(numericTarget)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{typeof count === 'number' ? count : target}</span>
}

// Reveal wrapper component
function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, isInView] = useInView()
  const directionClass = `reveal-${direction}`

  return (
    <div
      ref={ref}
      className={`reveal ${directionClass} ${isInView ? 'revealed' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Tilt card component
function TiltCard({ children, className }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.3s ease' }}
    >
      {children}
    </div>
  )
}

// Parallax floating elements
function FloatingElements() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="floating-elements">
      <span className="float-item float-1" style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}>🖨️</span>
      <span className="float-item float-2" style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}>🎨</span>
      <span className="float-item float-3" style={{ transform: `translate(${mousePos.x * 0.7}px, ${mousePos.y * 0.4}px)` }}>🎮</span>
      <span className="float-item float-4" style={{ transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * 0.6}px)` }}>🦸</span>
      <span className="float-item float-5" style={{ transform: `translate(${mousePos.x * 0.6}px, ${mousePos.y * -0.5}px)` }}>⚡</span>
    </div>
  )
}

function App() {
  const INSTAGRAM_URL = "https://www.instagram.com/tag_me.co?igsh=MWYxdWNneTlrazI0eg=="
  const WHATSAPP_URL = "https://wa.me/60183715153"

  // Typing animation for hero
  const [typedText, setTypedText] = useState('')
  const fullText = '3D Printing for Fun & Creativity'

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">🖨️ 3D PrintFun</div>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              <div className="nav-socials">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-icon ig" title="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="social-icon wa" title="WhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <FloatingElements />
        <div className="hero-content">
          <Reveal>
            <div className="hero-badge">
              🔥 <span>Next Level</span> — Where Imagination Becomes Reality
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h1 className="typing-text">
              {typedText}
              <span className="cursor">|</span>
            </h1>
          </Reveal>
          <Reveal delay={400}>
            <p>
              Custom 3D printed toys, figurines, gadgets, and more!
              From concept to creation — we bring your imagination to life.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="hero-buttons">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary pulse-btn">
                💬 WhatsApp Us
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                📸 See Our Work
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services Section */}
      <section className="features" id="services">
        <div className="section-container">
          <Reveal>
            <div className="section-header">
              <h2>What We Print</h2>
              <p>From fun collectibles to functional gadgets — we do it all!</p>
            </div>
          </Reveal>
          <div className="features-grid">
            {[
              { icon: '🎮', title: 'Gaming Accessories', desc: 'Custom controller stands, console mounts, keycaps, and gaming figurines.' },
              { icon: '🦸', title: 'Figurines & Models', desc: 'Anime characters, superheroes, miniatures for tabletop games and display.' },
              { icon: '🎁', title: 'Custom Gifts', desc: 'Personalized name plates, photo frames, phone stands, and unique presents.' },
              { icon: '🔧', title: 'Functional Parts', desc: 'Replacement parts, organizers, hooks, mounts, and everyday solutions.' },
              { icon: '🏠', title: 'Home Decor', desc: 'Vases, lamp shades, wall art, planters, and decorative pieces.' },
              { icon: '💡', title: 'Custom Design', desc: "Got an idea? We'll design and print it for you. Just send us a message!" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <TiltCard className="feature-card">
                  <div className="feature-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" id="gallery">
        <div className="stats-grid">
          {[
            { number: '500', suffix: '+', label: 'Items Printed' },
            { number: '200', suffix: '+', label: 'Happy Customers' },
            { number: '50', suffix: '+', label: 'Custom Designs' },
            { number: '5', suffix: '.0 ⭐', label: 'Customer Rating' },
          ].map((stat, i) => (
            <Reveal key={i} delay={i * 150}>
              <div className="stat-item">
                <div className="stat-number">
                  <AnimatedCounter target={stat.number} />{stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="features" id="about">
        <div className="section-container">
          <Reveal>
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Getting your custom 3D print is easy as 1-2-3!</p>
            </div>
          </Reveal>
          <div className="features-grid steps-grid">
            {[
              { num: 1, title: 'Send Your Idea', desc: 'Message us on WhatsApp or Instagram with your idea, reference image, or 3D file.' },
              { num: 2, title: 'We Design & Quote', desc: "We'll prepare the design, choose the best material, and give you a price quote." },
              { num: 3, title: 'Print & Deliver', desc: 'Once confirmed, we print and deliver your item. Usually ready in 2-5 days!' },
            ].map((step, i) => (
              <Reveal key={i} delay={i * 200}>
                <div className="feature-card step-card">
                  <div className="step-number">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-container">
          <Reveal>
            <div className="section-header">
              <h2>What Customers Say</h2>
              <p>Real feedback from our happy customers</p>
            </div>
          </Reveal>
          <div className="testimonials-grid">
            {[
              { quote: '"Ordered a custom anime figurine and it turned out amazing! Super detailed and fast delivery."', name: 'Ahmad', location: 'Kuala Lumpur', initials: 'AH' },
              { quote: '"Got a personalized name plate as a birthday gift. My friend loved it! Will order again."', name: 'Sarah L.', location: 'Penang', initials: 'SL' },
              { quote: '"Needed a replacement part for my gadget. They designed and printed it perfectly. Saved me so much money!"', name: 'Raj K.', location: 'Johor Bahru', initials: 'RK' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 150}>
                <TiltCard className="testimonial-card">
                  <div className="testimonial-stars">★★★★★</div>
                  <blockquote>{t.quote}</blockquote>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.initials}</div>
                    <div className="author-info">
                      <h4>{t.name}</h4>
                      <p>{t.location}</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="contact">
        <Reveal>
          <div className="cta-content">
            <h2>Ready to Print Something Awesome?</h2>
            <p>Send us a message and let's create something cool together!</p>
            <div className="cta-buttons">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary pulse-btn">
                💬 Chat on WhatsApp
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                📸 Follow on Instagram
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">🖨️ 3D PrintFun</div>
            <p>Bringing your ideas to life, one layer at a time. Custom 3D printing services for everyone.</p>
            <div className="footer-socials">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Services</h4>
            <a href="#services">Gaming Accessories</a>
            <a href="#services">Figurines</a>
            <a href="#services">Custom Gifts</a>
            <a href="#services">Home Decor</a>
          </div>
          <div className="footer-links">
            <h4>Info</h4>
            <a href="#about">How It Works</a>
            <a href="#gallery">Our Work</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 3D PrintFun. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default App
