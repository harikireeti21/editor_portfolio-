document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.custom-cursor-glow');

    if (cursor && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Subtle lag effect on the glow
            cursorGlow.animate({
                left: e.clientX + 'px',
                top: e.clientY + 'px'
            }, { duration: 150, fill: 'forwards' });
        });

        // Hover Effect on interactive elements
        const hoverables = document.querySelectorAll('a, button, .portfolio-item, .filter-btn, input, textarea, .copy-btn');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorGlow.classList.add('hover');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorGlow.classList.remove('hover');
            });
        });
    }

    // --- Sticky Header Scroll Effect ---
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Overlay ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuBtn && closeBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            mobileNav.classList.add('open');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        });

        const closeMobileMenu = () => {
            mobileNav.classList.remove('open');
            document.body.style.overflow = ''; // Unlock scrolling
        };

        closeBtn.addEventListener('click', closeMobileMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    }

    // --- Portfolio Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                // Reset state
                item.style.transform = 'scale(0.8)';
                item.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // --- Video Lightbox Modal Controller ---
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const videoContainer = document.getElementById('video-container');
    const videoLoader = document.querySelector('.video-loader');
    const closePlayerBtn = document.querySelector('.video-close-btn');
    const backdrop = document.querySelector('.video-modal-backdrop');

    if (modal && modalVideo && videoContainer) {
        // Open Modal Event
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoSrc = item.getAttribute('data-video');
                const ratio = item.getAttribute('data-ratio'); // 'vertical' or 'horizontal'

                // Reset modal styling classes
                modal.classList.remove('ratio-vertical', 'ratio-horizontal');

                if (ratio === 'vertical') {
                    modal.classList.add('ratio-vertical');
                } else {
                    modal.classList.add('ratio-horizontal');
                }

                // Show loader and open modal
                if (videoLoader) videoLoader.classList.add('loading');
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';

                // Load and play video
                modalVideo.src = videoSrc;
                modalVideo.load();
                
                // Play when video is ready
                modalVideo.play().catch(error => {
                    console.log("Auto-play blocked by browser. User action required to play.", error);
                });
            });
        });

        // Hide loader when video starts playing
        modalVideo.addEventListener('playing', () => {
            if (videoLoader) videoLoader.classList.remove('loading');
        });

        modalVideo.addEventListener('waiting', () => {
            if (videoLoader) videoLoader.classList.add('loading');
        });

        // Close Modal Event
        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            modalVideo.pause();
            modalVideo.src = ''; // Clear video source
            if (videoLoader) videoLoader.classList.remove('loading');
        };

        if (closePlayerBtn) closePlayerBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });
    }

    // --- Copy to Clipboard Utility ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card clicks if nested
            const textToCopy = btn.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback: change icon to checkmark
                const originalHTML = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check" style="color: #00e676;"></i>`;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Reset back to copy icon after 2 seconds
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });

    // --- Contact Form Simulation ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const closeSuccessBtn = document.querySelector('.close-success-btn');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate form submission status
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>`;

            setTimeout(() => {
                // Show success screen
                formSuccess.classList.add('show');
                contactForm.style.opacity = '0';
                
                // Reset submit button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                contactForm.reset();
            }, 1500);
        });

        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                formSuccess.classList.remove('show');
                contactForm.style.opacity = '1';
            });
        }
    }

    // --- Scroll-Triggered Fade In Animations ---
    const revealOnScroll = () => {
        const elements = document.querySelectorAll('.skill-card, .portfolio-item, .timeline-item, .stat-card, .info-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Animate once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            // Apply initial style
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    };

    revealOnScroll();
});
