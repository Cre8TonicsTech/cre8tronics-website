// Initialize EmailJS
(function () {
    emailjs.init("PzqKAe993x7KuPt_H");
})();

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');
const projectForm = document.getElementById('projectForm');
const formSuccess = document.getElementById('formSuccess');
const quickViewButtons = document.querySelectorAll('.quick-view');
const productModal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');
const purchaseForm = document.getElementById('purchaseForm');
const purchaseSuccess = document.getElementById('purchaseSuccess');
const closeSuccess = document.querySelector('.close-success');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');

        // Set active link
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});

// Sticky Header
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// Set minimum date for deadline input
const deadlineInput = document.getElementById('deadline');
const today = new Date().toISOString().split('T')[0];
deadlineInput.min = today;

// Auto-fill current date in hidden field
const dateInput = document.getElementById('date');
dateInput.value = new Date().toLocaleDateString();

// Form Validation
function validateInput(input) {
    const errorElement = input.nextElementSibling;

    if (input.validity.valid) {
        errorElement.style.display = 'none';
        input.style.borderColor = '#ddd';
    } else {
        errorElement.style.display = 'block';
        input.style.borderColor = 'var(--error-color)';

        if (input.validity.valueMissing) {
            errorElement.textContent = 'This field is required';
        } else if (input.validity.typeMismatch) {
            errorElement.textContent = 'Please enter a valid email address';
        } else if (input.validity.tooShort) {
            errorElement.textContent = `Minimum length is ${input.minLength} characters`;
        } else if (input.validity.rangeUnderflow) {
            errorElement.textContent = `Minimum value is ${input.min}`;
        }
    }
}

// Add event listeners for real-time validation
projectForm.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
    });

    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

// Project Form Submission
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    projectForm.querySelectorAll('[required]').forEach(input => {
        validateInput(input);
        if (!input.validity.valid) {
            isValid = false;
        }
    });

    if (isValid) {
        // Show loading state
        const submitBtn = projectForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // Send email using EmailJS
        emailjs.sendForm('service_pi2f9dl', 'template_ewzo99a', projectForm)
            .then(() => {
                // Show popup
                const successDiv = document.getElementById('formSuccess');
                successDiv.style.display = 'block';

                // Hide after 3 seconds
                setTimeout(() => {
                    successDiv.style.display = 'none';
                }, 3000);

                // Reset form
                document.getElementById('projectForm').reset();
            })
            .catch((error) => {
                alert("Failed to send. Please try again later.");
            });
    }
});

// Product Modal
quickViewButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const productImage = productCard.querySelector('img').src;
        const productName = productCard.querySelector('h3').textContent;
        const productRating = productCard.querySelector('.rating span').textContent;
        const productDescription = productCard.querySelector('.product-description').textContent;
        const productPrice = productCard.querySelector('.price').textContent;

        // Set modal content
        document.getElementById('modalProductImage').src = productImage;
        document.getElementById('modalProductName').textContent = productName;
        document.getElementById('modalProductRating').textContent = productRating;
        document.getElementById('modalProductDescription').textContent = productDescription;
        document.getElementById('modalProductPrice').textContent = productPrice;

        // Set hidden fields
        document.getElementById('productName').value = productName;
        document.getElementById('productPrice').value = productPrice.replace('₹', '').replace(',', '');
        document.getElementById('orderDate').value = new Date().toLocaleDateString();

        // Show modal
        productModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close Modal
closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
    purchaseSuccess.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal || e.target === purchaseSuccess) {
        productModal.style.display = 'none';
        purchaseSuccess.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Purchase Form Validation
purchaseForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
    });

    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

// Handle form submission
document.getElementById('purchaseForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all fields first
    let isValid = true;
    this.querySelectorAll('[required]').forEach(input => {
        validateInput(input);
        if (!input.validity.valid) isValid = false;
    });
    if (!isValid) return;

    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Prepare email data
    const templateParams = {
        buyerName: this.buyerName.value,
        buyerEmail: this.buyerEmail.value,
        buyerPhone: this.buyerPhone.value,
        buyerAddress: this.buyerAddress.value,
        quantity: this.quantity.value,
        instructions: this.instructions.value,
        productName: document.getElementById('productName').value,
        productPrice: document.getElementById('productPrice').value,
        orderDate: new Date().toLocaleString()
    };

    // Send email
    emailjs.send('service_pi2f9dl', 'template_7yl5huk', templateParams)
        .then(() => {
            // Show success modal (instead of alert)
            purchaseSuccess.style.display = 'block';
            productModal.style.display = 'none';
            this.reset();
        })
        .catch((error) => {
            alert('Failed to send order. Please try again.');
            console.error('EmailJS Error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm Purchase';
        });
});
// Close success modal
closeSuccess.addEventListener('click', () => {
    purchaseSuccess.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Contact Form Validation
contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
    });

    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

// Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    contactForm.querySelectorAll('[required]').forEach(input => {
        validateInput(input);
        if (!input.validity.valid) {
            isValid = false;
        }
    });

    if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Send email using EmailJS
        emailjs.sendForm('service_pi2f9dl', 'template_ewzo99a', contactForm)
            .then(() => {
                alert('Your message has been sent successfully!');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, (error) => {
                alert('Failed to send message. Please try again later.');
                console.error('EmailJS Error:', error);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    }
});

// Newsletter Form Submission
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');

    if (emailInput.validity.valid) {
        // Show loading state
        const submitBtn = newsletterForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // Simulate submission
        setTimeout(() => {
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
        }, 1500);
    } else {
        emailInput.style.borderColor = 'var(--error-color)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Set active nav link based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
ddocument.addEventListener('DOMContentLoaded', function() {
  // 1. Get elements (using your HTML structure)
  const searchInput = document.getElementById('productSearch');
  const productGrid = document.querySelector('.product-grid'); // Changed to class selector
  
  if (!searchInput) {
    console.error("Search input missing! Needs id='productSearch'");
    return;
  }

  // 2. Debounce function (300ms delay after typing stops)
  let searchTimeout;
  function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
  }

  // 3. Main search function
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.product-card'); // Dynamic query
    let hasResults = false;

    productCards.forEach(card => {
      const name = card.querySelector('h3')?.textContent.toLowerCase() || "";
      const desc = card.querySelector('.product-description')?.textContent.toLowerCase() || "";
      const isVisible = searchTerm === '' || name.includes(searchTerm) || desc.includes(searchTerm);
      
      card.style.display = isVisible ? 'block' : 'none';
      if (isVisible) hasResults = true;
    });

    // 4. No results message
    const noResultsMsg = document.querySelector('.no-results');
    if (!hasResults && searchTerm) {
      if (!noResultsMsg) {
        const msg = document.createElement('p');
        msg.className = 'no-results';
        msg.textContent = 'No products found';
        productGrid.appendChild(msg);
      }
    } else if (noResultsMsg) {
      noResultsMsg.remove();
    }
  }

  // 5. Event listeners
  searchInput.addEventListener('input', debounceSearch);
  document.querySelector('.search-box button')?.addEventListener('click', performSearch);
});
// Lightbox functionality
document.querySelectorAll('.product-image img').forEach(img => {
  img.addEventListener('click', function() {
    document.querySelector('.lightbox-img').src = this.src;
    document.querySelector('.lightbox').style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
});

// Close lightbox
document.querySelector('.close-btn').addEventListener('click', function() {
  document.querySelector('.lightbox').style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Close when clicking outside image
document.querySelector('.lightbox').addEventListener('click', function(e) {
  if (e.target === this) {
    this.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});
