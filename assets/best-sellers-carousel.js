/**
 * Best Sellers Carousel - Swiper Initialization
 * Premium Apparel Style Product Carousel
 */

(function () {
  'use strict';

  // Wait for Swiper library to load
  function initBestSellersCarousel() {
    if (typeof Swiper === 'undefined') {
      console.error('Swiper library not loaded. Please include swiper-bundle.min.js');
      return;
    }

    // Find all best sellers carousel instances
    const carousels = document.querySelectorAll('.best-sellers-swiper');

    carousels.forEach((carousel, index) => {
      const container = carousel.closest('.best-sellers-carousel__container');
      const prevButton = container.querySelector('.swiper-button-prev');
      const nextButton = container.querySelector('.swiper-button-next');

      // Initialize Swiper
      const swiper = new Swiper(carousel, {
        // Swiper parameters
        slidesPerView: 1.2,
        spaceBetween: 10,
        loop: false,
        grabCursor: true,

        // Navigation
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },

        // Responsive breakpoints
        breakpoints: {
          // Mobile (>= 480px)
          480: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          // Tablet (>= 768px)
          768: {
            slidesPerView: 3,
            spaceBetween: 12,
          },
          // Desktop (>= 992px)
          992: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          // Large Desktop (>= 1200px)
          1200: {
            slidesPerView: 5,
            spaceBetween: 16,
          },
          // XL Desktop (>= 1400px)
          1400: {
            slidesPerView: 6,
            spaceBetween: 16,
          },
        },

        // Accessibility
        a11y: {
          prevSlideMessage: 'Previous product',
          nextSlideMessage: 'Next product',
          firstSlideMessage: 'This is the first product',
          lastSlideMessage: 'This is the last product',
        },

        // Keyboard control
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },

        // Events
        on: {
          init: function () {
            updateNavigationState(this);
          },
          slideChange: function () {
            updateNavigationState(this);
          },
          reachBeginning: function () {
            if (prevButton) {
              prevButton.disabled = true;
              prevButton.setAttribute('aria-disabled', 'true');
            }
          },
          reachEnd: function () {
            if (nextButton) {
              nextButton.disabled = true;
              nextButton.setAttribute('aria-disabled', 'true');
            }
          },
          fromEdge: function () {
            if (prevButton) {
              prevButton.disabled = false;
              prevButton.setAttribute('aria-disabled', 'false');
            }
            if (nextButton) {
              nextButton.disabled = false;
              nextButton.setAttribute('aria-disabled', 'false');
            }
          },
        },
      });

      // Store swiper instance on element
      carousel.swiper = swiper;

      // Add click handlers to product cards
      addProductCardHandlers(carousel);
    });
  }

  // Update navigation button states
  function updateNavigationState(swiper) {
    const container = swiper.el.closest('.best-sellers-carousel__container');
    const prevButton = container.querySelector('.swiper-button-prev');
    const nextButton = container.querySelector('.swiper-button-next');

    if (!prevButton || !nextButton) return;

    // Update prev button
    if (swiper.isBeginning) {
      prevButton.disabled = true;
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.disabled = false;
      prevButton.setAttribute('aria-disabled', 'false');
    }

    // Update next button
    if (swiper.isEnd) {
      nextButton.disabled = true;
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.disabled = false;
      nextButton.setAttribute('aria-disabled', 'false');
    }
  }

  // Add click handlers to product cards
  function addProductCardHandlers(carousel) {
    const cards = carousel.querySelectorAll('.product-card');

    cards.forEach((card) => {
      // Handle card click
      card.addEventListener('click', function (e) {
        // Don't trigger if clicking the link overlay
        if (e.target.classList.contains('product-card__link')) {
          return;
        }

        // Remove active class from all cards
        cards.forEach((c) => c.classList.remove('active'));

        // Add active class to clicked card
        this.classList.add('active');

        // Trigger custom event for external integrations
        const productUrl = this.querySelector('.product-card__link')?.href;
        if (productUrl) {
          document.dispatchEvent(
            new CustomEvent('bestSellerProductSelected', {
              detail: {
                url: productUrl,
                card: this,
              },
            }),
          );
        }
      });

      // Handle keyboard navigation
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });

      // Make cards focusable
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });
  }

  // Lazy load images on scroll
  function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.closest('.product-card__image-wrapper')?.classList.remove('loading');
            }
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('.product-card__image-wrapper img[data-src]').forEach((img) => {
        img.closest('.product-card__image-wrapper')?.classList.add('loading');
        imageObserver.observe(img);
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initBestSellersCarousel();
      setupLazyLoading();
    });
  } else {
    initBestSellersCarousel();
    setupLazyLoading();
  }

  // Re-initialize on Shopify section render (for Theme Editor)
  document.addEventListener('shopify:section:load', function (event) {
    if (event.target.querySelector('.best-sellers-swiper')) {
      setTimeout(() => {
        initBestSellersCarousel();
        setupLazyLoading();
      }, 100);
    }
  });

  // Handle section reorder
  document.addEventListener('shopify:section:reorder', function () {
    setTimeout(() => {
      initBestSellersCarousel();
    }, 100);
  });
})();
