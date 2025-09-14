// GSAP Animation Controller
class AnimationController {
    constructor() {
        this.initScrollTrigger();
        this.initAnimations();
    }
    
    initScrollTrigger() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Navbar scroll effect
        ScrollTrigger.create({
            trigger: "body",
            start: "top -50",
            onToggle: self => {
                const navbar = document.getElementById('navbar');
                if (self.isActive) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
        
        // Section animations
        gsap.utils.toArray('section').forEach(section => {
            gsap.fromTo(section.querySelectorAll('.animate-in'), {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Stats counter animation
        ScrollTrigger.create({
            trigger: ".about-stats",
            start: "top 80%",
            onEnter: () => this.animateCounters()
        });
        
        // Timeline animations
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.fromTo(item, {
                x: -50,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                delay: index * 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%"
                }
            });
        });
        
        // Project cards animation
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.fromTo(card, {
                y: 50,
                opacity: 0,
                scale: 0.9
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%"
                }
            });
        });
    }
    
    initAnimations() {
        // Loading screen animation
        this.animateLoadingScreen();
        
        // Add class to animate elements
        this.addAnimateClasses();
    }
    
    animateLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');
        
        // Animate progress bar
        gsap.to(progressBar, {
            width: '100%',
            duration: 3,
            ease: "power2.inOut",
            onComplete: () => {
                // Hide loading screen
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.5,
                    onComplete: () => {
                        loadingScreen.style.display = 'none';
                        // Start hero animations
                        this.playHeroAnimations();
                    }
                });
            }
        });
    }
    
    playHeroAnimations() {
        const tl = gsap.timeline();
        
        tl.from('.greeting-text', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        })
        .from('.title-line', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4")
        .from('.typing-text', {
            opacity: 0,
            duration: 0.5
        }, "-=0.2")
        .from('.hero-description', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.3")
        .from('.hero-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4")
        .from('.hero-visual', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.6")
        .from('.scroll-indicator', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.3");
    }
    
    addAnimateClasses() {
        // Add animate-in class to elements that should animate on scroll
        const selectors = [
            '.section-header',
            '.about-intro p',
            '.skill-category',
            '.education-card',
            '.contact-info',
            '.contact-form-container'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('animate-in');
            });
        });
    }
    
    animateCounters() {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            gsap.to(counter, {
                innerText: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: 1 },
                onUpdate: function() {
                    counter.innerText = Math.ceil(counter.innerText);
                }
            });
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});
