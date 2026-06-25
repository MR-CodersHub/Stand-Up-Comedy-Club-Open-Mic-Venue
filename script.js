document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // 1. MOBILE MENU TOGGLE
    // ----------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ----------------------------------------------------
    // 2. STICKY NAVBAR
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Sticky class toggle
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ----------------------------------------------------
    // 3. ROLLOVER COUNTDOWN TIMER
    // ----------------------------------------------------
    const countdownElement = document.getElementById('countdownTimer');
    if (countdownElement) {
        let targetDateString = countdownElement.getAttribute('data-target-date');
        let targetDate = new Date(targetDateString);

        // Rollover: If the default target date is in the past, reset it dynamically to 2 days ahead
        if (targetDate.getTime() < Date.now()) {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + 2);
            newDate.setHours(20, 30, 0, 0); // e.g. 8:30 PM
            targetDate = newDate;
            
            // Format back to date string for metadata
            countdownElement.setAttribute('data-target-date', newDate.toISOString());
        }

        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours');
        const minutesSpan = document.getElementById('minutes');
        const secondsSpan = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                // If it ends, roll it forward by another 2 days
                targetDate.setDate(targetDate.getDate() + 2);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysSpan) daysSpan.textContent = String(days).padStart(2, '0');
            if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, '0');
            if (minutesSpan) minutesSpan.textContent = String(minutes).padStart(2, '0');
            if (secondsSpan) secondsSpan.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ----------------------------------------------------
    // 5. ANIMATED STATS COUNTER
    // ----------------------------------------------------
    const statNums = document.querySelectorAll('.stat-num');
    const statsSection = document.querySelector('.stats-section');
    
    if (statNums.length > 0 && statsSection) {
        const countUp = (element) => {
            const target = parseInt(element.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps frame duration 16.7ms

            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    element.textContent = target;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(count);
                }
            }, 16);
        };

        // Scroll Observer triggers stats animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const numbers = section.querySelectorAll('.stat-num');
                    numbers.forEach(num => countUp(num));
                    observer.unobserve(section); // animate only once
                }
            });
        }, observerOptions);

        observer.observe(statsSection);
    }

    // ----------------------------------------------------
    // 6. EVENT FILTERING
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const showCards = document.querySelectorAll('.show-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                showCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Trigger reflow for animations
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        // delay hiding display for fadeout transition
                        setTimeout(() => {
                            if (btn.getAttribute('data-filter') !== 'all' && category !== btn.getAttribute('data-filter')) {
                                card.style.display = 'none';
                            }
                        }, 250);
                    }
                });
            });
        });
    }

    // ----------------------------------------------------
    // 7. RESIDENT PERFORMERS SLIDER (CAROUSEL)
    // ----------------------------------------------------
    const slider = document.getElementById('performerSlider');
    const slides = document.querySelectorAll('.performer-slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const indicatorContainer = document.getElementById('sliderIndicators');
    
    if (slider && slides.length > 0) {
        let currentIndex = 0;
        const slideCount = slides.length;
        let slideInterval;

        // Generate indicators
        slides.forEach((_, idx) => {
            const btn = document.createElement('button');
            btn.classList.add('indicator');
            if (idx === 0) btn.classList.add('active');
            btn.setAttribute('aria-label', `Go to performer ${idx + 1}`);
            btn.addEventListener('click', () => goToSlide(idx));
            if (indicatorContainer) {
                indicatorContainer.appendChild(btn);
            }
        });

        const indicators = document.querySelectorAll('.indicator');

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            indicators.forEach((ind, idx) => {
                ind.classList.toggle('active', idx === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + slideCount) % slideCount;
            updateSlider();
            resetAutoplay();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Autoplay loop
        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 6000);
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        startAutoplay();
    }

    // ----------------------------------------------------
    // 8. FAQ ACCORDION
    // ----------------------------------------------------
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const parent = trigger.parentElement;
            const content = parent.querySelector('.faq-content');
            const isActive = parent.classList.contains('active');

            // Close all active items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = null;
                item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });

            // Toggle selected item
            if (!isActive) {
                parent.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ----------------------------------------------------
    // 9. GALLERY LIGHTBOX MODAL
    // ----------------------------------------------------
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBackdrop = document.getElementById('lightboxBackdrop');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightboxModal) {
        galleryItems.forEach(item => {
            const zoomBtn = item.querySelector('.gallery-lightbox-btn');
            const img = item.querySelector('.gallery-img');
            const title = item.querySelector('.overlay-text h3');
            const caption = item.querySelector('.overlay-text p');

            if (zoomBtn && img) {
                zoomBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (!lightboxImg || !lightboxCaption) return;

                    // If it is an abstract gradient block, parse icon name or bg gradient
                    if (img.classList.contains('abstract-gradient')) {
                        lightboxImg.src = 'assets/hero_bg.png';
                    } else {
                        lightboxImg.src = img.src;
                    }

                    lightboxCaption.innerHTML = `<strong>${title ? title.textContent : 'Gallery Zoom'}</strong> - ${caption ? caption.textContent : ''}`;
                    lightboxModal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // prevent scrolling background
                });
            }
        });

        function closeLightbox() {
            lightboxModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    // ----------------------------------------------------
    // 10. TICKET SEATING MAP & BOOKING MODAL
    // ----------------------------------------------------
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    
    const summaryShowName = document.getElementById('summaryShowName');
    const summaryTierBadge = document.getElementById('summaryTierBadge');
    const seatQuantitySelect = document.getElementById('seatQuantity');
    const bookingTotalCost = document.getElementById('bookingTotalCost');
    const seatingGrid = document.getElementById('seatingGrid');
    
    const ticketBookingForm = document.getElementById('ticketBookingForm');
    const bookingSuccessScreen = document.getElementById('bookingSuccess');
    
    // Receipt Elements
    const receiptTxCode = document.getElementById('receiptTxCode');
    const receiptSeats = document.getElementById('receiptSeats');
    const receiptAmount = document.getElementById('receiptAmount');
    
    let activePricePerSeat = 30; // base price
    let selectedSeatsArray = [];

    // Attach to Show cards booking buttons & Pricing selection buttons
    const attachBookTriggers = () => {
        // Event Quick Book Buttons on show cards
        const showBookBtns = document.querySelectorAll('.book-ticket-btn');
        showBookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const showTitle = btn.getAttribute('data-event');
                const showPrice = parseInt(btn.getAttribute('data-price'), 10);
                
                openBookingModal(showTitle, "Premium Comfort", showPrice);
            });
        });

        // Seating Tier Booking Buttons in tickets grid
        const tierBookBtns = document.querySelectorAll('.select-tier-btn');
        tierBookBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tierName = btn.getAttribute('data-tier');
                const tierPrice = parseInt(btn.getAttribute('data-price'), 10);
                
                // Get show title from currently selected or default
                openBookingModal("Neon Havoc: Headline Clash", tierName, tierPrice);
            });
        });
    };

    function openBookingModal(showName, tierName, price) {
        if (!bookingModal || !summaryShowName || !summaryTierBadge || !seatQuantitySelect || !bookingTotalCost || !seatingGrid || !ticketBookingForm || !bookingSuccessScreen) return;

        summaryShowName.textContent = showName;
        summaryTierBadge.textContent = tierName;
        
        // Update badge color based on tier
        summaryTierBadge.className = ''; // Reset classes
        if (tierName.includes('VIP')) {
            summaryTierBadge.classList.add('badge-cyan');
        } else if (tierName.includes('Premium')) {
            summaryTierBadge.classList.add('badge-purple');
        } else if (tierName.includes('Couple')) {
            summaryTierBadge.classList.add('badge-pink');
        } else {
            summaryTierBadge.classList.add('badge-orange');
        }

        activePricePerSeat = price;
        selectedSeatsArray = [];
        seatQuantitySelect.value = "1";
        
        // Render seating grid
        generateSeatingGrid();
        updatePriceDisplay();
        
        // Show modal & Reset Forms
        ticketBookingForm.style.display = 'block';
        bookingSuccessScreen.classList.remove('show');
        ticketBookingForm.reset();
        
        bookingModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function generateSeatingGrid() {
        if (!seatingGrid) return;
        seatingGrid.innerHTML = '';
        const rows = ['A', 'B', 'C', 'D'];
        const seatsPerRow = 6;
        
        rows.forEach(row => {
            for (let i = 1; i <= seatsPerRow; i++) {
                const seatName = `${row}${i}`;
                const seatDiv = document.createElement('div');
                seatDiv.classList.add('seat');
                seatDiv.textContent = seatName;

                // Randomly pre-fill some taken seats (~30% taken rate)
                const isTaken = Math.random() < 0.3;
                if (isTaken) {
                    seatDiv.classList.add('taken');
                    seatDiv.setAttribute('aria-label', `Seat ${seatName} is taken`);
                } else {
                    seatDiv.classList.add('available');
                    seatDiv.setAttribute('aria-label', `Seat ${seatName} is available`);
                    
                    // Add seat selection click listener
                    seatDiv.addEventListener('click', () => {
                        const maxAllowed = parseInt(seatQuantitySelect.value, 10);
                        
                        if (seatDiv.classList.contains('selected')) {
                            // De-select
                            seatDiv.classList.remove('selected');
                            selectedSeatsArray = selectedSeatsArray.filter(s => s !== seatName);
                        } else {
                            // Select seat if below maximum allowed seats
                            if (selectedSeatsArray.length < maxAllowed) {
                                seatDiv.classList.add('selected');
                                selectedSeatsArray.push(seatName);
                            } else {
                                // Replaced oldest choice to respect seat quantity
                                const oldestSeat = selectedSeatsArray.shift();
                                const oldSeatDiv = Array.from(seatingGrid.children).find(el => el.textContent === oldestSeat);
                                if (oldSeatDiv) oldSeatDiv.classList.remove('selected');
                                
                                seatDiv.classList.add('selected');
                                selectedSeatsArray.push(seatName);
                            }
                        }
                    });
                }
                seatingGrid.appendChild(seatDiv);
            }
        });
    }

    function updatePriceDisplay() {
        if (!seatQuantitySelect || !bookingTotalCost) return;
        const qty = parseInt(seatQuantitySelect.value, 10);
        const total = qty * activePricePerSeat;
        bookingTotalCost.textContent = `$${total}`;
    }

    // Dropdown change updates price & automatically adapts selected seat limits
    if (seatQuantitySelect) {
        seatQuantitySelect.addEventListener('change', () => {
            updatePriceDisplay();
            
            // Trim selected seats if quantity is reduced
            const maxAllowed = parseInt(seatQuantitySelect.value, 10);
            while (selectedSeatsArray.length > maxAllowed && seatingGrid) {
                const removedSeat = selectedSeatsArray.pop();
                const seatDiv = Array.from(seatingGrid.children).find(el => el.textContent === removedSeat);
                if (seatDiv) seatDiv.classList.remove('selected');
            }
        });
    }

    function closeBookingModal() {
        if (bookingModal) {
            bookingModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeBookingModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeBookingModal);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeBookingModal();
        }
    });

    // Submit Booking Form
    if (ticketBookingForm) {
        ticketBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!seatQuantitySelect || !receiptTxCode || !receiptSeats || !receiptAmount || !bookingSuccessScreen) return;

            const qty = parseInt(seatQuantitySelect.value, 10);

            // Ensure seats are selected
            if (selectedSeatsArray.length === 0 && seatingGrid) {
                // select random seats for the user if they didn't pick any
                const availableSeats = Array.from(seatingGrid.children).filter(el => el.classList.contains('available') && !el.classList.contains('selected'));
                for (let i = 0; i < qty && i < availableSeats.length; i++) {
                    availableSeats[i].classList.add('selected');
                    selectedSeatsArray.push(availableSeats[i].textContent);
                }
            }

            // Fill receipt details
            const txCode = `#TX-${Math.floor(1000 + Math.random() * 9000)}-NL`;
            const finalCost = qty * activePricePerSeat;
            
            receiptTxCode.textContent = txCode;
            receiptSeats.textContent = selectedSeatsArray.join(', ');
            receiptAmount.textContent = `$${finalCost.toFixed(2)}`;

            // Toggle screen inside modal
            ticketBookingForm.style.display = 'none';
            bookingSuccessScreen.classList.add('show');
        });
    }

    // Return button inside success modal
    const closeBookingSuccessBtn = document.getElementById('closeBookingSuccessBtn');
    if (closeBookingSuccessBtn) {
        closeBookingSuccessBtn.addEventListener('click', closeBookingModal);
    }

    // Attach initial triggers
    attachBookTriggers();

    // Check for query parameters on tickets.html page load to auto-open modal
    if (bookingModal) {
        const urlParams = new URLSearchParams(window.location.search);
        const showParam = urlParams.get('show');
        const tierParam = urlParams.get('tier');
        const priceParam = urlParams.get('price');
        
        if (showParam) {
            const defaultTier = tierParam || "Premium Comfort";
            const defaultPrice = priceParam ? parseInt(priceParam, 10) : 30;
            setTimeout(() => {
                openBookingModal(showParam, defaultTier, defaultPrice);
            }, 100);
        }
    }

    // ----------------------------------------------------
    // 11. DYNAMIC FORMS HANDLERS (OPEN MIC & CONTACT & NEWSLETTER)
    // ----------------------------------------------------
    
    // Open Mic Form
    const openmicForm = document.getElementById('openmicForm');
    const openmicSuccess = document.getElementById('openmicSuccess');
    const resetOpenmicFormBtn = document.getElementById('resetOpenmicForm');
    const spotsCount = document.getElementById('spotsCount');

    if (openmicForm && openmicSuccess) {
        openmicForm.addEventListener('submit', (e) => {
            e.preventDefault();
            openmicForm.style.display = 'none';
            openmicSuccess.classList.add('show');
            
            // Decrease spots count as a mock visual effect
            if (spotsCount) {
                let currentSpots = parseInt(spotsCount.textContent, 10);
                if (currentSpots > 0) {
                    spotsCount.textContent = currentSpots - 1;
                }
            }
        });

        if (resetOpenmicFormBtn) {
            resetOpenmicFormBtn.addEventListener('click', () => {
                openmicForm.reset();
                openmicSuccess.classList.remove('show');
                openmicForm.style.display = 'block';
            });
        }
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    const resetContactFormBtn = document.getElementById('resetContactForm');

    if (contactForm && contactSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.style.display = 'none';
            contactSuccess.classList.add('show');
        });

        if (resetContactFormBtn) {
            resetContactFormBtn.addEventListener('click', () => {
                contactForm.reset();
                contactSuccess.classList.remove('show');
                contactForm.style.display = 'block';
            });
        }
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    if (newsletterForm && newsletterFeedback) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;

            // Simple validation feedback
            newsletterFeedback.className = 'newsletter-feedback success';
            newsletterFeedback.textContent = 'Neural link connected! Subscription verified.';
            newsletterForm.reset();

            // Clear feedback after 4 seconds
            setTimeout(() => {
                newsletterFeedback.textContent = '';
                newsletterFeedback.className = 'newsletter-feedback';
            }, 4000);
        });
    }

    // ----------------------------------------------------
    // 10. THEME SWITCHER LOGIC
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.contains('light-theme');
            if (isLight) {
                document.documentElement.classList.remove('light-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ----------------------------------------------------
    // 11. RTL/LTR TOGGLE
    // ----------------------------------------------------
    const rtlToggleBtn = document.getElementById('rtlToggle');
    if (rtlToggleBtn) {
        const savedDir = localStorage.getItem('dir') || 'ltr';
        document.documentElement.setAttribute('dir', savedDir);
        rtlToggleBtn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    }

    // ----------------------------------------------------
    // 12. USER DROPDOWN, ROUTING & LOGIN OVERLAY SYSTEM
    // ----------------------------------------------------
    const userDropdown = document.querySelector('.user-dropdown');
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    
    // Function to sync user identity details across navigation headers
    function syncNavbarUser() {
        const navUserName = document.getElementById('navUserName');
        const navUserRole = document.getElementById('navUserRole');
        const role = localStorage.getItem('currentUserRole');
        const name = localStorage.getItem('currentUserName');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (navUserName) {
            navUserName.textContent = isLoggedIn ? (name || 'Comedy Fan') : 'Guest';
        }
        if (navUserRole) {
            navUserRole.textContent = isLoggedIn ? (role === 'admin' ? 'Administrator' : 'Spectator') : 'Not signed in';
        }

        document.body.classList.toggle('logged-in', isLoggedIn);
    }

    // Handle Sign Out
    document.addEventListener('click', function(e) {
        if (e.target.closest('#signoutBtn')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUserRole');
            localStorage.removeItem('currentUserName');
            if (userDropdown) userDropdown.classList.remove('open');
            syncNavbarUser();
            const path = window.location.pathname;
            if (path.includes('dashboard')) {
                window.location.href = 'index.html';
            }
        }
    });
    
    // Initial Sync
    syncNavbarUser();

    if (userDropdown && userDropdownBtn) {
        userDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('open');
            }
        });
    }

    // Admin + User dashboard links are now direct hrefs — close dropdown on click
    document.querySelectorAll('.admin-dash-link, .user-dash-link').forEach(link => {
        link.addEventListener('click', () => {
            if (userDropdown) userDropdown.classList.remove('open');
        });
    });

    function openLoginModal() {
        let modal = document.getElementById('neonLoginModal');
        if (!modal) {
            // Build and inject modal HTML structure
            modal = document.createElement('div');
            modal.id = 'neonLoginModal';
            modal.className = 'neon-modal-overlay';
            modal.innerHTML = `
                <div class="neon-modal-card">
                    <button class="neon-modal-close" id="closeLoginModal">&times;</button>
                    <div class="neon-modal-tabs">
                        <button class="neon-modal-tab active" id="tabLoginBtn">LOGIN</button>
                        <button class="neon-modal-tab" id="tabSignupBtn">SIGNUP</button>
                    </div>
                    <div class="neon-modal-body">
                        <form id="neonLoginForm">
                            <div class="neon-form-group">
                                <label>Identity Email</label>
                                <input type="email" id="loginEmail" class="neon-input" placeholder="Enter security email" required>
                            </div>
                            <div class="neon-form-group">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <label style="margin-bottom: 0;">Access Key</label>
                                    <a href="#" class="neon-forgot-link" id="linkToForgot" style="font-size: 0.75rem; font-family: var(--font-alt); color: var(--color-cyan); text-transform: none; letter-spacing: 0;">Forgot Key?</a>
                                </div>
                                <div class="neon-password-wrapper">
                                    <input type="password" id="loginPassword" class="neon-input" placeholder="••••••••" required>
                                    <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility">
                                        <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="neon-btn">ESTABLISH CONNECTION</button>
                        </form>
                        <form id="neonSignupForm" style="display: none;">
                            <div class="neon-form-group">
                                <label>Comedian / Stage Name</label>
                                <input type="text" id="signupName" class="neon-input" placeholder="e.g. Vesper Thorne" required>
                            </div>
                            <div class="neon-form-group">
                                <label>Identity Email</label>
                                <input type="email" id="signupEmail" class="neon-input" placeholder="Enter security email" required>
                            </div>
                            <div class="neon-form-group">
                                <label>Select Sector Access Role</label>
                                <div class="role-selector">
                                    <div class="role-option active" data-role="user">Comedian</div>
                                    <div class="role-option" data-role="admin">Venue Admin</div>
                                </div>
                            </div>
                            <div class="neon-form-group">
                                <label>Access Key</label>
                                <div class="neon-password-wrapper">
                                    <input type="password" id="signupPassword" class="neon-input" placeholder="••••••••" required>
                                    <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility">
                                        <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="neon-btn">REGISTER NEW NODE</button>
                        </form>
                        <form id="neonForgotForm" style="display: none;">
                            <div class="neon-form-group">
                                <label>Identity Email</label>
                                <input type="email" id="forgotEmail" class="neon-input" placeholder="Enter security email" required>
                            </div>
                            <button type="submit" class="neon-btn">RECOVER ACCESS KEY</button>
                            <div style="text-align: center; margin-top: 18px;">
                                <a href="#" id="backToLogin" style="font-size: 0.8rem; font-family: var(--font-alt); color: var(--color-text-slate); transition: color 0.2s ease;">Back to Login</a>
                            </div>
                        </form>
                    </div>
                    <div class="role-warning-info" id="roleWarningInfo">
                        Authentication protocols are simulated. Switching roles dynamically changes dashboard routes.
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Bind Modal Internal Action Listeners
            const closeBtn = document.getElementById('closeLoginModal');
            const tabLoginBtn = document.getElementById('tabLoginBtn');
            const tabSignupBtn = document.getElementById('tabSignupBtn');
            const loginForm = document.getElementById('neonLoginForm');
            const signupForm = document.getElementById('neonSignupForm');
            const forgotForm = document.getElementById('neonForgotForm');
            const roleWarningInfo = document.getElementById('roleWarningInfo');
            const roleOptions = modal.querySelectorAll('.role-option');
            let selectedRole = 'user';

            const eyeOpenSvg = `
                <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
            const eyeClosedSvg = `
                <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                </svg>
            `;

            // Password Toggle logic
            modal.querySelectorAll('.password-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const wrapper = btn.closest('.neon-password-wrapper');
                    const input = wrapper.querySelector('input');
                    if (input.type === 'password') {
                        input.type = 'text';
                        btn.innerHTML = eyeClosedSvg;
                    } else {
                        input.type = 'password';
                        btn.innerHTML = eyeOpenSvg;
                    }
                });
            });

            // Switch forms
            const linkToForgot = document.getElementById('linkToForgot');
            const backToLogin = document.getElementById('backToLogin');
            const modalTabs = modal.querySelector('.neon-modal-tabs');

            function showLoginForm() {
                modalTabs.style.display = 'grid';
                roleWarningInfo.style.display = 'block';
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
                forgotForm.style.display = 'none';
                // Reset forgot form inside
                forgotForm.innerHTML = `
                    <div class="neon-form-group">
                        <label>Identity Email</label>
                        <input type="email" id="forgotEmail" class="neon-input" placeholder="Enter security email" required>
                    </div>
                    <button type="submit" class="neon-btn">RECOVER ACCESS KEY</button>
                    <div style="text-align: center; margin-top: 18px;">
                        <a href="#" id="backToLogin" style="font-size: 0.8rem; font-family: var(--font-alt); color: var(--color-text-slate); transition: color 0.2s ease;">Back to Login</a>
                    </div>
                `;
                // Re-bind backToLogin event listener
                document.getElementById('backToLogin').addEventListener('click', (e) => {
                    e.preventDefault();
                    showLoginForm();
                });
            }

            if (linkToForgot) {
                linkToForgot.addEventListener('click', (e) => {
                    e.preventDefault();
                    modalTabs.style.display = 'none';
                    roleWarningInfo.style.display = 'none';
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'none';
                    forgotForm.style.display = 'block';
                });
            }

            if (backToLogin) {
                backToLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    showLoginForm();
                });
            }

            closeBtn.addEventListener('click', () => {
                modal.classList.remove('open');
                setTimeout(showLoginForm, 300);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                    setTimeout(showLoginForm, 300);
                }
            });

            tabLoginBtn.addEventListener('click', () => {
                tabLoginBtn.classList.add('active');
                tabSignupBtn.classList.remove('active');
                loginForm.style.display = 'block';
                signupForm.style.display = 'none';
                forgotForm.style.display = 'none';
            });

            tabSignupBtn.addEventListener('click', () => {
                tabSignupBtn.classList.add('active');
                tabLoginBtn.classList.remove('active');
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
                forgotForm.style.display = 'none';
            });

            roleOptions.forEach(opt => {
                opt.addEventListener('click', () => {
                    roleOptions.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    selectedRole = opt.getAttribute('data-role');
                });
            });

            // Handle Forms submissions
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('loginEmail').value.trim();
                const passwordInput = document.getElementById('loginPassword').value;

                const regEmail = localStorage.getItem('registeredEmail');
                const regPassword = localStorage.getItem('registeredPassword');
                const regRole = localStorage.getItem('registeredRole');
                const regName = localStorage.getItem('registeredName');

                let currentRole = 'user';
                let currentName = 'Vesper Thorne';

                if (regEmail && emailInput.toLowerCase() === regEmail.toLowerCase()) {
                    if (passwordInput === regPassword) {
                        currentRole = regRole;
                        currentName = regName;
                    } else {
                        alert('Invalid Access Key! Connection refused.');
                        return;
                    }
                } else {
                    // Fallback based on email content
                    if (emailInput.toLowerCase().includes('admin')) {
                        currentRole = 'admin';
                        currentName = 'Cosmic Admin';
                    }
                }

                localStorage.setItem('currentUserRole', currentRole);
                localStorage.setItem('currentUserName', currentName);
                localStorage.setItem('isLoggedIn', 'true');
                
                syncNavbarUser();
                modal.classList.remove('open');
                
                // Redirect if on a dashboard page
                const path = window.location.pathname;
                if (path.includes('dashboard.html')) {
                    window.location.href = currentRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
                }
            });

            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('signupName').value.trim();
                const email = document.getElementById('signupEmail').value.trim();
                const password = document.getElementById('signupPassword').value;

                localStorage.setItem('registeredEmail', email);
                localStorage.setItem('registeredName', name || (selectedRole === 'admin' ? 'Administrator' : 'Comedian Performer'));
                localStorage.setItem('registeredRole', selectedRole);
                localStorage.setItem('registeredPassword', password);

                localStorage.setItem('currentUserRole', selectedRole);
                localStorage.setItem('currentUserName', name || (selectedRole === 'admin' ? 'Administrator' : 'Comedian Performer'));
                localStorage.setItem('isLoggedIn', 'true');
                
                syncNavbarUser();
                modal.classList.remove('open');
                
                window.location.href = selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
            });

            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('forgotEmail').value.trim();
                
                // Update registered password to neon123 if email matches registeredEmail
                const regEmail = localStorage.getItem('registeredEmail');
                if (regEmail && email.toLowerCase() === regEmail.toLowerCase()) {
                    localStorage.setItem('registeredPassword', 'neon123');
                } else {
                    // Set default simulation password
                    localStorage.setItem('registeredEmail', email);
                    localStorage.setItem('registeredPassword', 'neon123');
                    localStorage.setItem('registeredRole', 'user');
                    localStorage.setItem('registeredName', 'Vesper Thorne');
                }

                // Render beautiful success message
                forgotForm.innerHTML = `
                    <div class="recovery-success-message" style="text-align: center; padding: 10px 0;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-green, #00ff88)" stroke-width="2" style="margin-bottom: 12px; filter: drop-shadow(0 0 8px rgba(0,255,136,0.3));">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h4 style="color: var(--color-text-white); font-family: var(--font-heading); margin-bottom: 8px;">RECOVERY PAYLOAD TRANSMITTED</h4>
                        <p style="font-size: 0.85rem; color: var(--color-text-slate); line-height: 1.5; margin-bottom: 15px;">A secure transmission containing key restoration tokens has been dispatched to <strong>${email}</strong>.</p>
                        <p style="font-size: 0.8rem; color: var(--color-cyan); margin-bottom: 20px;">[ Simulated System: Access Key reset to <strong>neon123</strong> ]</p>
                        <button type="button" class="neon-btn" id="forgotSuccessBtn">RETURN TO CONNECTION PANEL</button>
                    </div>
                `;

                document.getElementById('forgotSuccessBtn').addEventListener('click', () => {
                    showLoginForm();
                });
            });
        }
        
        // Show the Modal
        setTimeout(() => {
            modal.classList.add('open');
        }, 50);
    }

    // ----------------------------------------------------
    // 12. USER DASHBOARD INTERACTIVE ACTIONS
    // ----------------------------------------------------
    const receiptOverlay = document.getElementById('receiptOverlay');
    const viewReceiptBtns = document.querySelectorAll('.view-receipt-btn');
    const closeReceiptBtn = document.getElementById('closeReceiptBtn');
    const printReceiptBtn = document.getElementById('printReceiptBtn');

    if (viewReceiptBtns.length > 0 && receiptOverlay) {
        viewReceiptBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Dynamically populate popup values from button attributes
                const showTitle = btn.getAttribute('data-show-title') || 'Neon Havoc: Headline Clash';
                const date = btn.getAttribute('data-date') || 'May 24, 2026';
                const time = btn.getAttribute('data-time') || '8:30 PM';
                const seats = btn.getAttribute('data-seats') || 'A10, A11';
                const price = btn.getAttribute('data-price') || '$70.00';
                const barcode = btn.getAttribute('data-barcode') || '1029384756';
                const ticketId = btn.getAttribute('data-ticket-id') || 'T-2026-N90';

                document.getElementById('popupShowTitle').textContent = showTitle;
                document.getElementById('popupDate').textContent = date;
                document.getElementById('popupTime').textContent = time;
                document.getElementById('popupSeats').textContent = seats;
                document.getElementById('popupPrice').textContent = price;
                document.getElementById('popupBarcodeText').textContent = barcode;
                document.getElementById('popupTicketId').textContent = ticketId;

                receiptOverlay.classList.add('show');
            });
        });

        if (closeReceiptBtn) {
            closeReceiptBtn.addEventListener('click', () => {
                receiptOverlay.classList.remove('show');
            });
        }

        receiptOverlay.addEventListener('click', (e) => {
            if (e.target === receiptOverlay) {
                receiptOverlay.classList.remove('show');
            }
        });

        if (printReceiptBtn) {
            printReceiptBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }

    // ----------------------------------------------------
    // 13. PERFORMER DASHBOARD INTERACTIVE ACTIONS
    // ----------------------------------------------------
    const requestSlotBtn = document.getElementById('requestSlotBtn');
    const bookingStatusMsg = document.getElementById('bookingStatusMsg');
    const performerSlotsTable = document.getElementById('performerSlotsTable');

    if (requestSlotBtn && bookingStatusMsg) {
        requestSlotBtn.addEventListener('click', () => {
            requestSlotBtn.disabled = true;
            requestSlotBtn.textContent = 'Processing request...';
            
            setTimeout(() => {
                bookingStatusMsg.className = 'status-badge pending';
                bookingStatusMsg.textContent = 'PENDING APPROVAL';
                
                requestSlotBtn.textContent = 'Request Slot';
                requestSlotBtn.disabled = false;
                
                // Append slot to table dynamically
                if (performerSlotsTable) {
                    const tbody = performerSlotsTable.querySelector('tbody');
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>June 12, 2026</td>
                        <td>Main Stage</td>
                        <td>09:00 PM - 09:15 PM (15m)</td>
                        <td><span class="status-badge pending">Pending</span></td>
                    `;
                    tbody.prepend(newRow);
                }
            }, 1200);
        });
    }

    // ----------------------------------------------------
    // 14. ADMIN DASHBOARD INTERACTIVE ACTIONS
    // ----------------------------------------------------
    const approveBtns = document.querySelectorAll('.admin-approve-btn');
    const rejectBtns = document.querySelectorAll('.admin-reject-btn');
    const revenueStat = document.getElementById('adminRevenueStat');
    const trafficStat = document.getElementById('adminTrafficStat');
    const refreshAdminBtn = document.getElementById('refreshAdminStats');

    if (approveBtns.length > 0) {
        approveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const parentItem = btn.closest('.slot-item');
                const statusBadge = parentItem.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.className = 'status-badge allocated';
                    statusBadge.textContent = 'Allocated';
                }
                btn.style.display = 'none';
                const rejectBtn = parentItem.querySelector('.admin-reject-btn');
                if (rejectBtn) rejectBtn.style.display = 'none';
            });
        });
    }

    if (rejectBtns.length > 0) {
        rejectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const parentItem = btn.closest('.slot-item');
                const statusBadge = parentItem.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.style.background = 'rgba(255, 0, 127, 0.1)';
                    statusBadge.style.color = 'var(--color-pink)';
                    statusBadge.style.border = '1px solid rgba(255, 0, 127, 0.2)';
                    statusBadge.textContent = 'Rejected';
                }
                btn.style.display = 'none';
                const approveBtn = parentItem.querySelector('.admin-approve-btn');
                if (approveBtn) approveBtn.style.display = 'none';
            });
        });
    }

    if (refreshAdminBtn) {
        refreshAdminBtn.addEventListener('click', () => {
            refreshAdminBtn.disabled = true;
            refreshAdminBtn.querySelector('span').textContent = 'Syncing...';
            
            setTimeout(() => {
                if (revenueStat) {
                    const currentRev = parseFloat(revenueStat.textContent.replace('$', '').replace(',', ''));
                    const addedRev = Math.floor(Math.random() * 200) + 50;
                    revenueStat.textContent = '$' + (currentRev + addedRev).toLocaleString();
                }
                if (trafficStat) {
                    const currentTraffic = parseInt(trafficStat.textContent.replace(',', ''), 10);
                    const addedTraffic = Math.floor(Math.random() * 15) + 2;
                    trafficStat.textContent = (currentTraffic + addedTraffic).toLocaleString();
                }
                refreshAdminBtn.querySelector('span').textContent = 'Refresh Stats';
                refreshAdminBtn.disabled = false;
            }, 1000);
        });
    }

    // ----------------------------------------------------
    // 15. STAGE EXPERIENCE VIBE CONTROLLER (HOME2)
    // ----------------------------------------------------
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    const heroSection = document.querySelector('.home2-hero');

    if (vibeButtons.length > 0 && heroSection) {
        vibeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                vibeButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                const vibe = btn.getAttribute('data-vibe');
                
                // Remove existing vibe classes
                heroSection.classList.remove('vibe-purple', 'vibe-cyan', 'vibe-pink', 'vibe-orange');
                
                // Add new vibe class
                heroSection.classList.add(`vibe-${vibe}`);

                // Update HUD monitor status text dynamically
                const vibeStatus = document.getElementById('vibeStatus');
                if (vibeStatus) {
                    vibeStatus.textContent = `${vibe.toUpperCase()} ACTIVE`;
                }
            });
        });
    }
});

