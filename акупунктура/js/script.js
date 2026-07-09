const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwMlSUDrSvzcTzC5ugtzd5HpMFkXrK701CfHIx5D55athSAD53T9AXHf_E2b9LkPjU/exec';

/* ========== БУРГЕР-МЕНЮ ========== */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
    });
});


/* ========== АНИМАЦИИ ПРИ СКРОЛЛЕ ========== */
const animatedElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

animatedElements.forEach(el => observer.observe(el));

/* ========== ОТПРАВКА ФОРМЫ В TELEGRAM ========== */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!WEBHOOK_URL || WEBHOOK_URL.startsWith('ВСТАВИТЬ')) {
        formMessage.textContent = '⚠️ Форма не настроена. Напишите мне напрямую в Telegram.';
        formMessage.style.color = '#fbbf24';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    formMessage.textContent = '';
    formMessage.style.color = '';

    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        contact: formData.get('contact'),
        idea: formData.get('idea') || 'не указана'
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        formMessage.textContent = '✅ Заявка отправлена! Свяжусь с вами в ближайшее время.';
        formMessage.style.color = '#4ade80';
        form.reset();
    } catch (err) {
        formMessage.textContent = '❌ Ошибка отправки. Напишите мне напрямую в Telegram.';
        formMessage.style.color = '#f87171';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
    }
});

/* ========== ПЛАВАЮЩАЯ КНОПКА ========== */
const floatingBtn = document.getElementById('floatingBtn');
const contactsSection = document.getElementById('contacts');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const contactsRect = contactsSection.getBoundingClientRect();
    const isInContacts = contactsRect.top < window.innerHeight && contactsRect.bottom > 0;
    
    if (currentScroll > 400 && !isInContacts) {
        floatingBtn.classList.add('visible');
    } else {
        floatingBtn.classList.remove('visible');
    }
});

/* ========== ГОРИЗОНТАЛЬНЫЙ СЛАЙДЕР ПОРТФОЛИО ========== */
const portfolioSlider = document.getElementById('portfolioSlider');
const portfolioPrev = document.getElementById('portfolioPrev');
const portfolioNext = document.getElementById('portfolioNext');

const scrollAmount = 340;

portfolioPrev.addEventListener('click', () => {
    portfolioSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

portfolioNext.addEventListener('click', () => {
    portfolioSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

// Свайпы на телефоне для портфолио
let portfolioTouchStartX = 0;
let portfolioTouchEndX = 0;

portfolioSlider.addEventListener('touchstart', e => {
    portfolioTouchStartX = e.changedTouches[0].screenX;
}, { passive: true });

portfolioSlider.addEventListener('touchend', e => {
    portfolioTouchEndX = e.changedTouches[0].screenX;
    handlePortfolioSwipe();
}, { passive: true });

function handlePortfolioSwipe() {
    const diff = portfolioTouchStartX - portfolioTouchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            portfolioSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
            portfolioSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }
}

// Клавиши стрелок
document.addEventListener('keydown', (e) => {
    const sliderRect = portfolioSlider.getBoundingClientRect();
    const isInView = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;
    
    if (isInView) {
        if (e.key === 'ArrowLeft') portfolioSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        if (e.key === 'ArrowRight') portfolioSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
});

