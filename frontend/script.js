document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Smooth Scrolling (Lenis)
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Initial Loader
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-overlay');
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                startEntranceAnimations();
            }
        });
    });

    function startEntranceAnimations() {
        // Hero Content Reveal
        const tl = gsap.timeline();
        tl.to('.reveal', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "expo.out"
        });

        gsap.from('.navbar', {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            delay: 0.5,
            clearProps: "all"
        });
    }

    // Scroll-triggered reveals for Assessment Section
    gsap.to('.glass-panel', {
        scrollTrigger: {
            trigger: '.main-experience',
            start: "top 80%",
        },
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "expo.out"
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 3. Subject Selection Visual Feedback
    const subjectItems = document.querySelectorAll('.subject-item');
    subjectItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        
        item.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            if (checkbox.checked) {
                item.classList.add('selected');
                gsap.to(item, { scale: 1.05, duration: 0.2, ease: "back.out" });
            } else {
                item.classList.remove('selected');
                gsap.to(item, { scale: 1, duration: 0.2, ease: "back.out" });
            }
        });
    });

    // 4. Form Submission Logic
    const form = document.getElementById('careerForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const subjectCheckboxes = document.querySelectorAll('input[name="subject"]:checked');
            const subjects = Array.from(subjectCheckboxes).map(cb => cb.value);
            
            if (subjects.length === 0) {
                gsap.to('.subjects-grid', { x: 10, duration: 0.1, repeat: 5, yoyo: true });
                return;
            }

            const userData = {
                name: document.getElementById('name').value,
                age: parseInt(document.getElementById('age').value),
                percentage: parseFloat(document.getElementById('percentage').value),
                interest: document.getElementById('interest').value,
                subjects: subjects
            };

            // UI Feedback
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const loader = document.getElementById('loader');
            
            btnText.innerText = 'Analyzing Patterns...';
            loader.classList.remove('hidden');
            submitBtn.disabled = true;
            gsap.to(submitBtn, { scale: 0.95, opacity: 0.8, duration: 0.2 });

            try {
                // Using relative URL or env-based URL would be better, but keeping the user's logic
                const response = await fetch('https://web-production-b8e4b.up.railway.app/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

                const result = await response.json();

                if (result.status === 'success') {
                    localStorage.setItem('careerRecommendation', JSON.stringify(result.data));
                    localStorage.setItem('careerUserData', JSON.stringify(userData));
                    
                    // Exit Animation before redirect
                    gsap.to('main', { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
                        window.location.href = 'result.html';
                    }});
                } else {
                    throw new Error(result.error || 'Unknown error occurred');
                }
            } catch (error) {
                console.error('Error fetching recommendation:', error);
                btnText.innerText = 'Connection Error';
                gsap.to(submitBtn, { backgroundColor: '#ff4444', duration: 0.3 });
                setTimeout(() => {
                    btnText.innerText = 'Retry Generation';
                    gsap.to(submitBtn, { backgroundColor: '#D4AF37', duration: 0.3 });
                    submitBtn.disabled = false;
                    loader.classList.add('hidden');
                }, 3000);
            }
        });
    }

    // Modal Logic for Assessment
    const assessmentModal = document.getElementById('assessment-modal');
    const closeAssessmentModal = document.getElementById('close-modal');
    
    // Open Modal when clicking links pointing to #assessment
    document.querySelectorAll('a[href="#assessment"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent scrolling
            if (assessmentModal) {
                assessmentModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    // Close Modal Logic
    const hideAssessmentModal = () => {
        if (assessmentModal) {
            assessmentModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeAssessmentModal) {
        closeAssessmentModal.addEventListener('click', hideAssessmentModal);
    }

    if (assessmentModal) {
        assessmentModal.addEventListener('click', (e) => {
            // Close if clicking outside the modal content
            if (e.target === assessmentModal) {
                hideAssessmentModal();
            }
        });
    }

    // Mobile Menu Toggle Logic
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});
