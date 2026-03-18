import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * NavIsland — React island for the top navigation with scroll hide/reveal,
 * theme toggle, and mobile menu. Hydrated client:load.
 */
export default function NavIsland({ currentPath = '/' }) {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll direction detection
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateDirection = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      if (Math.abs(delta) > 10) {
        setScrollDirection(delta > 0 ? 'down' : 'up');
        lastScrollY = scrollY > 0 ? scrollY : 0;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Theme initialization
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setIsDark(current === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.cookie = 'sw-theme=' + next + ';path=/;max-age=31536000';
    setIsDark(!isDark);
  }, [isDark]);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const navLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about/' },
    { label: 'Contact', href: '/contact/' },
  ];

  const isActive = (href) => {
    if (href === '/#work') return currentPath === '/' || currentPath === '/index.html';
    return currentPath.startsWith(href.replace(/\/$/, ''));
  };

  return (
    <>
      {/* Desktop Nav */}
      <header
        className={`top-nav ${scrollDirection === 'down' ? 'nav-hidden' : ''}`}
        role="banner"
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
          padding: '0 var(--space-6)',
        }}>
          {/* Brand */}
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-h4)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              transition: 'color 180ms ease',
            }}
            aria-label="Sean Winslow — Home"
          >
            Sean Winslow
          </a>

          {/* Desktop links */}
          <nav
            aria-label="Main navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
            className="desktop-nav"
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-small)',
                  fontWeight: 500,
                  color: isActive(href) ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 180ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (!isActive(href)) e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {label}
              </a>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-button)',
                color: 'var(--text-secondary)',
                transition: 'color 180ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {isDark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={toggleMobile}
              aria-label="Open menu"
              className="hamburger-btn"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                color: 'var(--text-secondary)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`mobile-menu-overlay ${mobileOpen ? 'is-open' : ''}`}>
        <button
          onClick={toggleMobile}
          aria-label="Close menu"
          style={{
            position: 'absolute',
            top: 'var(--space-5)',
            right: 'var(--space-6)',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-h2)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              textDecoration: 'none',
            }}
          >
            {label}
          </a>
        ))}

        <button
          onClick={() => { toggleTheme(); }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-body)',
            color: 'var(--text-secondary)',
            marginTop: 'var(--space-8)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>

      <style>{`
        .mobile-menu-overlay {
          display: none;
        }
        .mobile-menu-overlay.is-open {
          display: flex;
        }
        @media (max-width: 768px) {
          .desktop-nav > a {
            display: none !important;
          }
          .desktop-nav > button:first-of-type {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
