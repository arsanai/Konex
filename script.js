/* =====================================================
   KONEX AUTOMATION - JAVASCRIPT
   Animations, Interactions & Effects
   ===================================================== */





// =====================================================
// SERVICE ADD BUTTON & FLIP SYSTEM
// =====================================================
const serviceCart = new Set();

/**
 * Toggle the "added" state on all .service-add-btn buttons
 * that share the same data-service value, and sync with
 * the contact form dropdown checkboxes.
 */
function toggleServiceAdd(btn, event) {
    event.stopPropagation(); // don't trigger card flip on mobile

    const service = btn.dataset.service;

    if (serviceCart.has(service)) {
        serviceCart.delete(service);
    } else {
        serviceCart.add(service);
    }

    // Sync ALL buttons with this service name (front + back)
    syncAddButtons();
    syncDropdownWithCart();
    updateServicesLabel();
    updateServicesHiddenInput();
}

function syncAddButtons() {
    document.querySelectorAll('.service-add-btn').forEach(btn => {
        btn.classList.toggle('added', serviceCart.has(btn.dataset.service));
        btn.setAttribute('aria-pressed', serviceCart.has(btn.dataset.service));
    });
}

// ── Mobile click-to-flip (only on touch / no-hover devices) ──
function initMobileFlip() {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) return;

    document.querySelectorAll('.service-card-flip').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't flip if the add button was clicked
            if (e.target.closest('.service-add-btn')) return;

            const isFlipped = card.classList.contains('flipped');
            // Close all other cards first
            document.querySelectorAll('.service-card-flip.flipped').forEach(c => {
                if (c !== card) c.classList.remove('flipped');
            });
            card.classList.toggle('flipped', !isFlipped);
        });
    });

    // Tap outside → close all
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-card-flip')) {
            document.querySelectorAll('.service-card-flip.flipped')
                .forEach(c => c.classList.remove('flipped'));
        }
    });
}

// ── Contact form dropdown ──
function toggleServicesDropdown() {
    const dropdown = document.getElementById('servicesDropdown');
    const chevron = document.getElementById('servicesChevron');
    if (!dropdown) return;

    const isOpen = dropdown.classList.toggle('open');
    chevron.classList.toggle('open', isOpen);

    if (isOpen) {
        setTimeout(() => {
            document.addEventListener('click', closeServicesDropdownOutside, { once: true });
        }, 0);
    }
}

function closeServicesDropdownOutside(e) {
    const ms = document.getElementById('servicesMultiselect');
    if (ms && !ms.contains(e.target)) {
        document.getElementById('servicesDropdown')?.classList.remove('open');
        document.getElementById('servicesChevron')?.classList.remove('open');
    }
}

function onDropdownChange(checkbox) {
    const service = checkbox.value;
    if (checkbox.checked) {
        serviceCart.add(service);
    } else {
        serviceCart.delete(service);
    }
    syncAddButtons();
    updateServicesLabel();
    updateServicesHiddenInput();
}

function syncDropdownWithCart() {
    document.querySelectorAll('.service-checkbox').forEach(cb => {
        cb.checked = serviceCart.has(cb.value);
    });
}

function updateServicesLabel() {
    const label = document.getElementById('servicesHeaderLabel');
    const header = document.getElementById('servicesHeader');
    if (!label) return;
    const count = serviceCart.size;
    if (count === 0) {
        label.textContent = 'Selecciona los servicios';
        header.classList.remove('has-items');
    } else if (count === 1) {
        label.textContent = `1 servicio seleccionado`;
        header.classList.add('has-items');
    } else {
        label.textContent = `${count} servicios seleccionados`;
        header.classList.add('has-items');
    }
}

function updateServicesHiddenInput() {
    const input = document.getElementById('servicesHiddenInput');
    if (input) input.value = Array.from(serviceCart).join(', ');
}


// =====================================================
// PARTICLES SYSTEM
// =====================================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const navbar = document.getElementById('navbar');

    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        navbar.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            navbar.classList.remove('menu-open');
        });
    });
}

// =====================================================
// SMOOTH SCROLL
// =====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            try {
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            } catch (err) {
                console.warn('Invalid selector for smooth scroll:', href);
            }
        });
    });
}

// =====================================================
// FLIP CARDS - MOBILE TOUCH SUPPORT
// =====================================================
function initFlipCards() {
    const flipCards = document.querySelectorAll('.service-card-flip');

    flipCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // If clicking the Añadir button, skip ripple (button handles its own logic)
            if (e.target.closest('.service-cart-btn')) return;

            // Ripple effect on the visible front face
            const front = this.querySelector('.service-card-front');
            if (!front) return;

            const rect = front.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const size = Math.max(rect.width, rect.height) * 2;

            const ripple = document.createElement('span');
            ripple.className = 'service-ripple';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (x - size / 2) + 'px';
            ripple.style.top = (y - size / 2) + 'px';

            front.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// =====================================================
// INTERSECTION OBSERVER - SCROLL ANIMATIONS
// =====================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards
    const cards = document.querySelectorAll('.glass-card, .service-card-flip');
    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.4s ease-out, transform 0.4s ease-out`;
        observer.observe(card);
    });
}

// =====================================================
// ANIMATED COUNTER
// =====================================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// =====================================================
// STATS COUNTER ON SCROLL
// =====================================================
function initStatsCounter() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');

                const statNumbers = entry.target.querySelectorAll('.stat-number-large');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));

                    if (!isNaN(number)) {
                        stat.textContent = '0';
                        animateCounter(stat, number, 2000);

                        // Add back the suffix if exists
                        setTimeout(() => {
                            if (text.includes('%')) {
                                stat.textContent = stat.textContent + '%';
                            } else if (text.includes('+')) {
                                stat.textContent = stat.textContent + '+';
                            }
                        }, 2000);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const aboutCard = document.querySelector('.about-card');
    if (aboutCard) {
        statsObserver.observe(aboutCard);
    }
}

// =====================================================
// PARALLAX EFFECT (SUBTLE)
// =====================================================
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const sphere = document.querySelector('.sphere-container');

        if (sphere) {
            sphere.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// =====================================================
// CURSOR GLOW EFFECT (OPTIONAL - DESKTOP ONLY)
// =====================================================
function initCursorGlow() {
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(230, 100, 127, 0.15) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
    }
}

// =====================================================
// DEBOUNCE UTILITY
// =====================================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// RESIZE HANDLER
// =====================================================
function initResizeHandler() {
    const handleResize = debounce(() => {
        // Reinit flip cards on resize
        initFlipCards();
    }, 250);

    window.addEventListener('resize', handleResize);
}

// =====================================================
// LAZY LOAD IMAGES (IF NEEDED)
// =====================================================
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// =====================================================
// PERFORMANCE OPTIMIZATION
// =====================================================
function optimizePerformance() {
    // Add will-change to animated elements
    const animatedElements = document.querySelectorAll('.sphere, .service-card-inner, .glass-card');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });

    // Remove will-change after animation completes
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
        });
    }, 3000);
}

// =====================================================
// FORM VALIDATION AND SUBMISSION
// =====================================================
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form inputs
            const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;

            // Validate each required field
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');

                    // Remove error class after animation
                    setTimeout(() => {
                        input.classList.remove('error');
                    }, 300);
                } else {
                    input.classList.remove('error');
                }
            });

            // Email validation
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    emailInput.classList.add('error');
                    setTimeout(() => {
                        emailInput.classList.remove('error');
                    }, 300);
                }
            }

            if (isValid) {
                // Disable submit button to prevent double submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<span>Enviando...</span>';

                // Collect form data
                // Helper to read the visible label of a select
                const getSelectLabel = (id) => {
                    const sel = document.getElementById(id);
                    return sel ? sel.options[sel.selectedIndex].text : 'No especificado';
                };

                const formData = {
                    nombre: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    telefono: document.getElementById('phone').value.trim(),
                    empresa: document.getElementById('company').value.trim() || 'No especificado',
                    tamano_empresa: getSelectLabel('companySize'),
                    presupuesto: getSelectLabel('budget'),
                    servicios: document.getElementById('servicesHiddenInput').value || 'No especificado',
                    mensaje: document.getElementById('message').value.trim(),
                    fecha: new Date().toISOString(),
                    origen: 'Landing Page - Konex Automation - Diagnóstico'
                };

                try {
                    // Send data to n8n webhook
                    const response = await fetch('https://n8n.konexautomation.com/webhook/e7fa447a-d869-4bba-a1d4-02291bde5a00', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });

                    if (response.ok) {
                        // Success - show success message
                        console.log('✅ Formulario enviado correctamente a n8n');
                        showSuccessMessage();
                    } else {
                        // Error response from webhook
                        console.error('❌ Error al enviar formulario:', response.status);
                        alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo o contáctanos directamente por WhatsApp.');
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    }
                } catch (error) {
                    // Network error
                    console.error('❌ Error de red al enviar formulario:', error);
                    alert('Hubo un error de conexión. Por favor, verifica tu internet e intenta de nuevo.');
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            }
        });

        // Remove error class on input
        const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');

    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'flex';
    }
}

// Reset form (global function for onclick)
function resetForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');

    if (form && successMessage) {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
    }
}

// =====================================================
// FAQ ACCORDION
// =====================================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// =====================================================
// INITIALIZE ALL ON DOM READY
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Konex Automation - Initializing...');

    // Initialize FAQ
    initFAQ();

    // Service add-buttons — event delegation
    document.querySelector('.services-grid')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.service-add-btn');
        if (btn) toggleServiceAdd(btn, e);
    });

    // Mobile flip (touch devices only)
    initMobileFlip();

    // Create particles
    createParticles();

    // Initialize navbar
    initNavbar();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize stats counter
    initStatsCounter();

    // Initialize resize handler
    initResizeHandler();

    // Initialize lazy load
    initLazyLoad();

    // Optimize performance
    optimizePerformance();

    // Initialize form validation
    initFormValidation();

    console.log('✅ Konex Automation - Ready!');
});



// =====================================================
// PAGE LOAD ANIMATION
// =====================================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animation
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent) {
        heroContent.style.animation = 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }

    if (heroVisual) {
        heroVisual.style.animation = 'fade-in-rotate 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
});

// =====================================================
// SERVICE MODALS
// =====================================================

const serviceModalData = {
    resenas: `
        <h2>Generación de Reseñas Automática</h2>
        
        <h3>Qué es</h3>
        <p>Es un sistema que envía automáticamente un mensaje al cliente tras recibir un servicio para conocer su experiencia e invitarle a dejar una reseña sobre el negocio.</p>
        <p>El mensaje puede enviarse por el canal más adecuado en cada caso, como WhatsApp, email, redes sociales u otros medios digitales, y se adapta completamente al tono y estilo de la marca.</p>

        <h3>Qué problema soluciona</h3>
        <p>Muchos negocios ofrecen un buen servicio, pero no consiguen que sus clientes lo reflejen públicamente. El resultado es una presencia online débil, menos confianza frente a nuevos clientes y una desventaja clara frente a la competencia.</p>
        <p>Además, cuando un cliente queda insatisfecho, muchas veces el negocio no llega a saberlo a tiempo, lo que impide corregir errores y mejorar la experiencia.</p>
        <p>Este sistema ayuda a resolver ambas situaciones:</p>
        <ul>
            <li>impulsa la obtención de más reseñas positivas</li>
            <li>mejora la reputación online</li>
            <li>permite detectar incidencias antes de que se conviertan en un problema mayor</li>
        </ul>

        <h3>Cómo funciona</h3>
        <p>Una vez finalizado el servicio, el sistema envía un mensaje al cliente en el momento que el negocio decida. Este envío es totalmente configurable, pudiendo ajustarse a diferentes tiempos según la estrategia del negocio.</p>
        <p>A partir de ahí, el flujo se adapta según la respuesta del cliente:</p>
        <ul>
            <li><strong>Si la experiencia ha sido positiva</strong>, se le invita a dejar una reseña en Google u otra plataforma relevante.</li>
            <li><strong>Si la experiencia no ha sido satisfactoria</strong>, el sistema responde de forma distinta, solicitando más información para entender lo ocurrido.</li>
        </ul>
        <p>De esta manera, no solo se impulsa la visibilidad online, sino que también se obtiene información valiosa para mejorar el servicio.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Un cliente acude a un centro de estética, clínica o cualquier negocio con atención directa. Tras su visita, recibe un mensaje agradeciendo su confianza y preguntándole qué tal ha sido su experiencia.</p>
        <ul>
            <li>Si responde de forma positiva, se le facilita directamente el enlace para dejar una reseña.</li>
            <li>Si, en cambio, muestra descontento, el sistema continúa la conversación para recoger el motivo. Esa información queda registrada para que el negocio pueda revisarla y actuar en consecuencia.</li>
        </ul>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Aumento de reseñas online de forma constante</li>
            <li>Mejora de la reputación digital del negocio</li>
            <li>Mayor confianza para futuros clientes</li>
            <li>Diferenciación frente a competidores con menor presencia online</li>
            <li>Proceso automatizado, sin carga adicional para el equipo</li>
            <li>Comunicación alineada con la imagen de marca</li>
            <li>Detección temprana de problemas o experiencias negativas</li>
            <li>Recopilación de información útil para mejorar el servicio</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Esta solución encaja especialmente bien en negocios donde la experiencia del cliente es clave, como:</p>
        <ul>
            <li>clínicas</li>
            <li>centros de estética</li>
            <li>restaurantes</li>
            <li>hoteles</li>
            <li>academias</li>
            <li>gimnasios</li>
            <li>talleres</li>
            <li>despachos profesionales</li>
            <li>cualquier negocio que quiera reforzar su reputación online</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Hoy en día muchas decisiones de compra empiezan en internet. Un negocio con más reseñas, mejor valoración y mayor actividad transmite más confianza y tiene más posibilidades de ser elegido.</p>
        <p>Esta solución permite convertir cada cliente en una oportunidad para mejorar la visibilidad, reforzar la credibilidad y atraer nuevos clientes.</p>
    `,
    citas: `
        <h2>Recordatorios de Citas</h2>
        
        <h3>Qué es</h3>
        <p>Se trata de un sistema que envía recordatorios automáticos a los clientes antes de su cita, a través del canal que el negocio elija (WhatsApp, SMS, email, etc.), asegurando que el cliente no olvide su compromiso.</p>

        <h3>Qué problema soluciona</h3>
        <p>Uno de los mayores problemas en negocios con citas es el "no-show": clientes que no se presentan y dejan huecos vacíos en la agenda.</p>
        <p>Esto se traduce directamente en:</p>
        <ul>
            <li>Pérdida de ingresos</li>
            <li>Tiempo desaprovechado</li>
            <li>Dificultad para organizar la jornada</li>
        </ul>
        <p>Este sistema elimina gran parte de ese problema de forma automática.</p>

        <h3>Cómo funciona (de forma sencilla)</h3>
        <p>Cuando un cliente tiene una cita programada, el sistema envía un recordatorio automáticamente antes de la fecha y hora.</p>
        <p>El negocio puede decidir:</p>
        <ul>
            <li>Cuándo enviarlo (24h, 48h, o el tiempo que prefiera)</li>
            <li>Qué canal utilizar</li>
            <li>Qué mensaje mostrar, adaptándolo a su tono de marca</li>
        </ul>
        <p>Todo funciona sin intervención manual.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Una clínica tiene una cita agendada para el miércoles a las 18:00.</p>
        <p>El sistema envía automáticamente un recordatorio el martes a la misma hora, indicando:</p>
        <ul>
            <li>Día</li>
            <li>Hora</li>
            <li>Lugar</li>
        </ul>
        <p>El cliente lo recibe y recuerda su cita, evitando olvidos y cancelaciones de última hora.</p>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Reducción significativa de ausencias (no-shows)</li>
            <li>Mayor ocupación de la agenda</li>
            <li>Aumento directo de ingresos</li>
            <li>Ahorro de tiempo en gestión manual</li>
            <li>Mejora de la experiencia del cliente</li>
            <li>Comunicación más profesional y organizada</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Este sistema es útil en cualquier negocio que trabaje con citas, como:</p>
        <ul>
            <li>Clínicas y centros médicos</li>
            <li>Salones de belleza y estética</li>
            <li>Talleres</li>
            <li>Consultorías</li>
            <li>Centros deportivos</li>
            <li>Servicios profesionales en general</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Porque convierte un problema habitual (las ausencias) en una oportunidad de mejora inmediata.</p>
        <p>No solo optimiza la agenda, sino que impacta directamente en la facturación, permitiendo aprovechar mejor cada hueco disponible sin aumentar la carga de trabajo del equipo.</p>
    `,
    formularios: `
        <h2>Gestión Automática de Formularios</h2>
        
        <h3>Qué es</h3>
        <p>Es una solución que permite automatizar la gestión de los formularios de contacto de una página web para que cada solicitud recibida se procese de forma inmediata, ordenada y profesional.</p>
        <p>Si el negocio no dispone de formulario, se puede crear uno adaptado a sus necesidades. Si ya cuenta con uno, se integra dentro del sistema para automatizar todo el flujo posterior.</p>

        <h3>Qué problema soluciona</h3>
        <p>Muchos negocios reciben solicitudes a través de su página web, pero no siempre cuentan con un proceso claro para gestionarlas. Esto puede provocar:</p>
        <ul>
            <li>retrasos en la respuesta</li>
            <li>pérdida de oportunidades comerciales</li>
            <li>falta de seguimiento</li>
            <li>información desordenada o dispersa</li>
            <li>mala experiencia en el primer contacto con el cliente</li>
        </ul>
        <p>Cuando una solicitud no se responde con rapidez o no queda bien registrada, el negocio corre el riesgo de perder a ese posible cliente antes incluso de empezar la conversación.</p>

        <h3>Cómo funciona</h3>
        <p>Cuando una persona rellena el formulario de la página web, el sistema pone en marcha automáticamente una serie de acciones previamente definidas.</p>
        <p>Por un lado, el negocio recibe un aviso informando de que se ha registrado una nueva solicitud.</p>
        <p>Al mismo tiempo, el posible cliente recibe un mensaje de confirmación indicando que su solicitud ha sido recibida correctamente y que será atendida en el menor tiempo posible. Este mensaje es totalmente personalizable y puede adaptarse al tono, imagen y forma de comunicación de cada empresa.</p>
        <p>Además, toda la información enviada a través del formulario queda almacenada automáticamente en el CRM del negocio, permitiendo consultar los datos en cualquier momento de forma ordenada y centralizada.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Una persona visita la página web de un negocio y completa un formulario para solicitar información sobre un servicio.</p>
        <p>En ese mismo instante, la empresa recibe una notificación para saber que hay un nuevo contacto pendiente de gestión.</p>
        <p>A la vez, el usuario recibe un mensaje de confirmación que le transmite seguridad y profesionalidad, indicándole que su solicitud ha sido registrada.</p>
        <p>Finalmente, sus datos quedan guardados automáticamente para que el equipo pueda revisarlos, hacer seguimiento y gestionar la oportunidad comercial sin perder información.</p>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Respuesta más rápida ante nuevas solicitudes</li>
            <li>Mejor primera impresión para el posible cliente</li>
            <li>Reducción de oportunidades perdidas</li>
            <li>Centralización automática de la información</li>
            <li>Menos trabajo manual para el equipo</li>
            <li>Mayor control sobre los contactos recibidos</li>
            <li>Mejora del seguimiento comercial</li>
            <li>Proceso más profesional y organizado desde el primer contacto</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Esta solución es útil para cualquier negocio que capte contactos o solicitudes desde su página web, especialmente en:</p>
        <ul>
            <li>empresas de servicios</li>
            <li>clínicas y centros especializados</li>
            <li>inmobiliarias</li>
            <li>academias</li>
            <li>despachos profesionales</li>
            <li>negocios locales</li>
            <li>ecommerce con formularios de consulta</li>
            <li>empresas que quieran mejorar su captación online</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Porque convierte un simple formulario en una herramienta real de captación y organización comercial.</p>
        <p>No se trata solo de recoger datos, sino de asegurar que cada contacto recibido tenga una respuesta, quede registrado correctamente y pueda convertirse en una oportunidad de negocio bien gestionada.</p>
        <p>En la práctica, esto significa una atención más ágil, una imagen más profesional y una mayor capacidad para transformar visitas web en clientes reales.</p>
    `,
    recuperacion: `
        <h2>Recuperación de Clientes</h2>
        
        <h3>Qué es</h3>
        <p>Es una solución que permite volver a activar clientes que llevan un tiempo sin comprar, reservar o utilizar los servicios del negocio.</p>
        <p>A partir de la base de datos existente, el sistema identifica a los clientes inactivos y les envía automáticamente un mensaje personalizado con el objetivo de despertar de nuevo su interés y fomentar su regreso.</p>

        <h3>Qué problema soluciona</h3>
        <p>Muchos negocios centran sus esfuerzos en captar nuevos clientes, pero dejan de lado una oportunidad muy valiosa: volver a contactar con personas que ya conocen la marca y que en algún momento ya confiaron en ella.</p>
        <p>Con el paso del tiempo, una parte de esos clientes deja de acudir, no porque haya una mala relación, sino simplemente porque no ha existido un nuevo estímulo, una nueva comunicación o una razón clara para volver.</p>
        <p>Esto provoca:</p>
        <ul>
            <li>pérdida de ventas potenciales</li>
            <li>desaprovechamiento de la base de datos existente</li>
            <li>menor recurrencia de clientes</li>
            <li>dependencia excesiva de la captación de nuevos contactos</li>
        </ul>

        <h3>Cómo funciona</h3>
        <p>El sistema accede a la base de datos del negocio para identificar qué clientes llevan un tiempo determinado sin realizar una compra, una reserva o utilizar un servicio.</p>
        <p>Ese periodo de inactividad es completamente configurable y se adapta a la realidad de cada negocio.</p>
        <p>Una vez detectados esos clientes, se les envía automáticamente un mensaje definido por la empresa, también totalmente personalizable, con el contenido que se quiera comunicar en cada caso: novedades, promociones, campañas especiales, recordatorios o cualquier otro incentivo pensado para animarles a volver.</p>
        <p>De esta manera, el negocio puede reactivar clientes de forma automática, ordenada y sin necesidad de realizar un seguimiento manual uno por uno.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Un negocio detecta que parte de sus clientes no ha vuelto en los últimos tres meses. A partir de ese criterio, el sistema selecciona automáticamente esos contactos y les envía un mensaje informándoles de una novedad, una promoción o una ventaja especial disponible durante un tiempo limitado.</p>
        <p>Gracias a esta acción, algunos de esos clientes vuelven a interesarse por el negocio, retoman el contacto y realizan una nueva reserva o contratación.</p>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Recuperación de clientes que llevaban tiempo inactivos</li>
            <li>Generación de nuevas oportunidades de venta</li>
            <li>Mejor aprovechamiento de la base de datos existente</li>
            <li>Incremento de la recurrencia de clientes</li>
            <li>Comunicación automatizada y sin carga manual</li>
            <li>Mensajes adaptados al tono y estrategia de la empresa</li>
            <li>Mayor rentabilidad a partir de contactos ya existentes</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Esta solución resulta especialmente útil en negocios que trabajan con clientes recurrentes, como:</p>
        <ul>
            <li>clínicas</li>
            <li>centros de estética</li>
            <li>gimnasios</li>
            <li>academias</li>
            <li>talleres</li>
            <li>restaurantes</li>
            <li>negocios de suscripción</li>
            <li>empresas de servicios en general</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Porque conseguir que vuelva un cliente que ya te conoce suele ser mucho más fácil y rentable que captar uno nuevo desde cero.</p>
        <p>Esta solución permite activar de nuevo ese valor que ya existe dentro del negocio, generando nuevas ventas a partir de relaciones ya iniciadas y reforzando la conexión con clientes que podrían volver a comprar si reciben el estímulo adecuado.</p>
        <p>En la práctica, supone una forma inteligente de aumentar la actividad comercial, mejorar el aprovechamiento de la base de datos y convertir clientes dormidos en nuevas oportunidades reales de ingreso.</p>
    `,
    chat: `
        <h2>Chat Automático en tu Web</h2>
        
        <h3>Qué es</h3>
        <p>Es un chat con inteligencia artificial integrado en la página web del negocio, diseñado para atender de forma inmediata a los visitantes y responder consultas frecuentes sobre la empresa, sus servicios o su funcionamiento.</p>
        <p>Se presenta como un elemento visible dentro de la web y puede adaptarse al diseño, estilo y necesidades de cada negocio.</p>

        <h3>Qué problema soluciona</h3>
        <p>Muchas empresas reciben de forma repetida las mismas preguntas a través de su página web o canales de contacto. Esto genera una carga innecesaria para el equipo, retrasa la atención y puede hacer que algunos visitantes abandonen la web sin resolver sus dudas.</p>
        <p>Además, cuando un posible cliente no encuentra respuesta rápida a una consulta básica, es más probable que pierda interés y no avance en el proceso de compra o contacto.</p>
        <p>Esta solución permite ofrecer una atención inmediata, clara y continua, mejorando la experiencia del usuario y reduciendo la dependencia de respuestas manuales para cuestiones repetitivas.</p>

        <h3>Cómo funciona</h3>
        <p>El chat se integra en la página web mediante un formato visual accesible y cómodo para el visitante, como un botón lateral o una ventana emergente, siempre adaptado a las preferencias del negocio.</p>
        <p>Una vez abierto, el visitante puede realizar preguntas y recibir respuestas automáticas en tiempo real.</p>
        <p>El contenido que el chat puede responder es totalmente personalizable. El negocio define qué tipo de información quiere facilitar, qué temas desea cubrir y qué consultas no deben responderse.</p>
        <p>De esta manera, el sistema actúa siguiendo los criterios marcados por la propia empresa, manteniendo el control sobre la información que se ofrece y asegurando que la comunicación esté alineada con su forma de trabajar.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Una persona entra en la página web de un negocio y quiere resolver una duda rápida antes de decidirse a contactar o contratar.</p>
        <p>En lugar de tener que buscar esa información manualmente o esperar una respuesta posterior, abre el chat y plantea su consulta.</p>
        <p>El sistema responde al momento con la información que el negocio ha definido previamente. Si se trata de una cuestión que no debe contestarse, el chat lo indica de forma adecuada y mantiene una comunicación coherente con los límites establecidos por la empresa.</p>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Atención inmediata al visitante de la web</li>
            <li>Respuesta rápida a preguntas frecuentes</li>
            <li>Mejora de la experiencia online</li>
            <li>Reducción de consultas repetitivas para el equipo</li>
            <li>Comunicación adaptada al negocio</li>
            <li>Mayor control sobre la información que se comparte</li>
            <li>Imagen más moderna, accesible y profesional</li>
            <li>Mayor capacidad de atención sin aumentar carga operativa</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Esta solución encaja en cualquier negocio que quiera mejorar la atención desde su página web, especialmente en:</p>
        <ul>
            <li>clínicas</li>
            <li>centros de estética</li>
            <li>academias</li>
            <li>inmobiliarias</li>
            <li>despachos profesionales</li>
            <li>negocios de servicios</li>
            <li>ecommerce</li>
            <li>empresas que reciben consultas frecuentes online</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Porque permite ofrecer una atención rápida y constante desde la propia web, mejorando la experiencia del visitante desde el primer momento.</p>
        <p>Además de resolver dudas habituales, ayuda a filtrar consultas repetitivas, liberar tiempo del equipo y mantener una comunicación más ordenada, eficiente y alineada con la imagen del negocio.</p>
        <p>En la práctica, se traduce en una web más útil, una atención más ágil y una mayor capacidad para acompañar al posible cliente en su proceso de decisión.</p>
    `,
    emails: `
        <h2>Organización Inteligente de Emails</h2>
        
        <h3>Qué es</h3>
        <p>Es un sistema que organiza automáticamente los correos electrónicos entrantes, clasificándolos según su contenido y finalidad.</p>
        <p>Permite que cada mensaje llegue ya ordenado y categorizado, facilitando su gestión desde el primer momento.</p>

        <h3>Qué problema soluciona</h3>
        <p>Muchas empresas reciben decenas o cientos de correos al día. Todos llegan a la misma bandeja de entrada, generando:</p>
        <ul>
            <li>Desorden y pérdida de tiempo</li>
            <li>Dificultad para priorizar mensajes importantes</li>
            <li>Riesgo de no responder a tiempo a clientes potenciales</li>
            <li>Saturación del equipo</li>
        </ul>
        <p>Esto impacta directamente en la productividad y en oportunidades de negocio que se pueden perder.</p>

        <h3>Cómo funciona</h3>
        <p>A medida que llegan los correos, el sistema analiza su contenido y los clasifica automáticamente según su intención.</p>
        <p>Por ejemplo:</p>
        <ul>
            <li>consultas de clientes</li>
            <li>oportunidades comerciales</li>
            <li>comunicaciones internas</li>
            <li>facturación o administración</li>
        </ul>
        <p>Cada email se organiza en su categoría correspondiente dentro del gestor de correo, ya sea mediante etiquetas, carpetas u otros sistemas de organización.</p>
        <p>Todo esto ocurre de forma automática, sin intervención manual.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Una empresa recibe correos de distintos tipos a lo largo del día: clientes interesados, proveedores, facturas y comunicaciones internas.</p>
        <p>En lugar de tener todo mezclado en la bandeja de entrada, el sistema separa automáticamente cada mensaje en su categoría.</p>
        <p>El equipo puede acceder directamente a los correos relevantes en cada momento, sin tener que revisar uno por uno.</p>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Organización automática de la bandeja de entrada</li>
            <li>Ahorro de tiempo en la gestión diaria</li>
            <li>Mayor rapidez en la respuesta a clientes</li>
            <li>Reducción de errores o mensajes olvidados</li>
            <li>Mejora de la productividad del equipo</li>
            <li>Mayor claridad en la comunicación interna</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Esta solución es útil en cualquier empresa que gestione un volumen medio o alto de correos, especialmente en:</p>
        <ul>
            <li>departamentos comerciales</li>
            <li>atención al cliente</li>
            <li>administración</li>
            <li>empresas de servicios</li>
            <li>negocios digitales</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Porque permite transformar el correo electrónico en una herramienta realmente eficiente.</p>
        <p>En lugar de ser una fuente de desorden, pasa a ser un canal organizado donde cada mensaje tiene su lugar, facilitando la toma de decisiones y evitando la pérdida de oportunidades.</p>
        <p>En términos prácticos: menos tiempo gestionando correos y más tiempo dedicándolo a tareas que generan valor.</p>
    `,
    asistente: `
        <h2>Asistente Interno Inteligente</h2>
        
        <h3>Qué es</h3>
        <p>Es un asistente con inteligencia artificial diseñado para ayudar al equipo en su trabajo diario, resolviendo dudas operativas y ofreciendo apoyo inmediato sobre tareas, procesos y formas de trabajo definidas por la propia empresa.</p>
        <p>Se adapta al contexto del negocio y responde en base al conocimiento que la empresa decide incorporar, de manera totalmente personalizada.</p>

        <h3>Qué problema soluciona</h3>
        <p>En muchas empresas, una parte importante del tiempo se pierde resolviendo dudas repetitivas del equipo sobre cómo realizar determinadas tareas, qué procedimiento seguir o dónde consultar cierta información.</p>
        <p>Esto provoca:</p>
        <ul>
            <li>interrupciones constantes en el trabajo diario</li>
            <li>dependencia excesiva de responsables o supervisores</li>
            <li>pérdida de tiempo en consultas repetidas</li>
            <li>dificultad para mantener criterios unificados</li>
            <li>menor agilidad en la ejecución de tareas</li>
        </ul>
        <p>Cuando el conocimiento depende demasiado de unas pocas personas, el trabajo se ralentiza y la operativa se vuelve menos eficiente.</p>

        <h3>Cómo funciona</h3>
        <p>La empresa define el conocimiento que quiere que el asistente utilice, en función de sus procesos, tareas habituales, procedimientos internos o instrucciones de trabajo.</p>
        <p>A partir de esa base, cualquier miembro del equipo puede consultar dudas concretas y recibir una respuesta inmediata, alineada con la forma de trabajar del negocio.</p>
        <p>El contenido es totalmente personalizable. La empresa decide qué tipo de preguntas debe responder el asistente, sobre qué temas puede ayudar y qué información debe quedar fuera.</p>
        <p>De esta manera, el sistema actúa como un punto de apoyo accesible y coherente con los criterios internos de la organización.</p>

        <h3>Ejemplo real de uso</h3>
        <p>Un trabajador necesita resolver una duda concreta sobre cómo llevar a cabo una tarea habitual, qué pasos debe seguir o qué procedimiento aplica en una situación determinada.</p>
        <p>En lugar de depender continuamente de otra persona para obtener respuesta, puede consultar directamente al asistente y recibir orientación inmediata en base a la información previamente definida por la empresa.</p>
        <p>Esto permite trabajar con más autonomía, reducir tiempos de espera y mantener una operativa más fluida.</p>

        <h3>Beneficios clave</h3>
        <ul>
            <li>Resolución rápida de dudas operativas</li>
            <li>Menor dependencia de supervisores para consultas repetitivas</li>
            <li>Ahorro de tiempo en el día a día</li>
            <li>Mayor autonomía para el equipo</li>
            <li>Respuestas alineadas con los procesos internos</li>
            <li>Mejor acceso al conocimiento de la empresa</li>
            <li>Mayor homogeneidad en la forma de trabajar</li>
            <li>Mejora de la productividad individual y colectiva</li>
        </ul>

        <h3>Dónde se puede aplicar</h3>
        <p>Esta solución resulta especialmente útil en empresas donde existen procesos internos, operativas definidas o tareas recurrentes, como:</p>
        <ul>
            <li>equipos administrativos</li>
            <li>empresas de servicios</li>
            <li>departamentos de operaciones</li>
            <li>negocios con personal en formación</li>
            <li>organizaciones con procedimientos internos frecuentes</li>
            <li>empresas que quieren centralizar su conocimiento operativo</li>
        </ul>

        <h3>Por qué es interesante para tu empresa</h3>
        <p>Porque permite convertir el conocimiento interno en una herramienta accesible para todo el equipo, reduciendo fricciones en el trabajo diario y facilitando que las tareas se realicen con mayor rapidez, seguridad y coherencia.</p>
        <p>No se trata solo de responder preguntas, sino de ayudar a que la empresa funcione de forma más ordenada, más ágil y menos dependiente de interrupciones constantes.</p>
        <p>En la práctica, supone un apoyo real para el equipo, una mejor organización del conocimiento y una forma más eficiente de trabajar.</p>
    `
};

function openServiceModal(serviceId) {
    const modal = document.getElementById('serviceModal');
    const modalBody = document.getElementById('serviceModalBody');
    const pageWrapper = document.getElementById('page-wrapper');
    const modalContent = document.querySelector('.service-modal-content');
    
    if (modal && modalBody && serviceModalData[serviceId]) {
        modalBody.innerHTML = serviceModalData[serviceId];
        modal.classList.add('open');
        
        if (pageWrapper) {
            pageWrapper.classList.add('page-blurred');
        }
        
        // Reset scroll position to the top
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    } else if (modal && modalBody) {
        // Fallback for services without specific content yet
        modalBody.innerHTML = '<h2>Más información próximamente</h2><p>Estamos preparando los detalles de este servicio. Por favor, contáctanos para más información.</p>';
        modal.classList.add('open');
        
        if (pageWrapper) {
            pageWrapper.classList.add('page-blurred');
        }
        
        // Reset scroll position to the top
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    const pageWrapper = document.getElementById('page-wrapper');
    
    if (modal) {
        modal.classList.remove('open');
    }
    
    if (pageWrapper) {
        pageWrapper.classList.remove('page-blurred');
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
}

