document.addEventListener("DOMContentLoaded", () => {
    
    // ── AVALIAÇÕES GOOGLE (Places API) ──
    const PLACE_ID = 'ChIJ_aFgJNd_mQARsumRqFNqMsg'; // Bella Marina
    const REVIEWS_KEY = 'AIzaSyD-PLACEHOLDER'; // ← Substitua pela sua chave da API

    // Avaliações de fallback para exibir enquanto a API não está configurada
    const fallbackReviews = [
        {
            author_name: 'Carlos Mendes',
            rating: 5,
            text: 'Experiência incrível! O Raphael é um guia excepcional, muito experiente e atencioso. Pescamos muito e ainda tivemos uma aula sobre o mar. Recomendo demais!',
            relative_time_description: 'há 2 semanas'
        },
        {
            author_name: 'Fernanda Oliveira',
            rating: 5,
            text: 'Fui com meu marido e foi a melhor experiência que já tivemos juntos. O Raphael é campeão e se vê na qualidade do passeio. Voltaremos com certeza!',
            relative_time_description: 'há 1 mês'
        },
        {
            author_name: 'Ricardo Tavares',
            rating: 5,
            text: 'Passeio oceânico sensacional. 35 milhas offshore, pegamos Dourado e Wahoo. Embarcação excelente e o Raphael sabe exatamente onde os peixes estão.',
            relative_time_description: 'há 3 semanas'
        }
    ];

    const renderReviews = (reviews, rating, totalRatings) => {
        const grid = document.getElementById('reviewsGrid');
        const scoreNum = document.getElementById('reviewsScoreNum');
        const starsEl = document.getElementById('reviewsStars');
        const totalEl = document.getElementById('reviewsTotal');

        if (scoreNum && rating) {
            scoreNum.textContent = rating.toFixed(1);
        }
        if (starsEl && rating) {
            starsEl.textContent = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
        }
        if (totalEl && totalRatings) {
            totalEl.textContent = `${totalRatings} avaliações`;
        }

        if (!grid) return;
        grid.innerHTML = '';

        const top3 = reviews.slice(0, 3);
        top3.forEach(r => {
            const initial = r.author_name ? r.author_name.charAt(0).toUpperCase() : '?';
            const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar">${initial}</div>
                    <div class="review-meta">
                        <div class="review-name">${r.author_name}</div>
                        <div class="review-date">${r.relative_time_description}</div>
                    </div>
                    <div class="review-stars">${stars}</div>
                </div>
                <p class="review-text">${r.text || ''}</p>
            `;
            grid.appendChild(card);
        });
    };

    const loadGoogleReviews = () => {
        // Se a chave ainda é placeholder, usa fallback
        if (REVIEWS_KEY === 'AIzaSyD-PLACEHOLDER') {
            renderReviews(fallbackReviews, 5.0, null);
            return;
        }

        const script = document.createElement('script');
        const callbackName = 'googlePlacesCallback_' + Date.now();

        window[callbackName] = (data) => {
            delete window[callbackName];
            script.remove();
            if (data && data.result) {
                const r = data.result;
                renderReviews(
                    r.reviews || fallbackReviews,
                    r.rating,
                    r.user_ratings_total
                );
            } else {
                renderReviews(fallbackReviews, 5.0, null);
            }
        };

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews&reviews_sort=newest&key=${REVIEWS_KEY}&callback=${callbackName}`;
        script.src = url;
        script.onerror = () => renderReviews(fallbackReviews, 5.0, null);
        document.head.appendChild(script);
    };

    loadGoogleReviews();

    // ── CONFIGURAÇÃO DE PARTICULAS NO HERO ──
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // ── GESTÃO DO MENU MOBILE ──
    const mobileMenu = document.getElementById('mobileMenu');
    const openMenuBtn = document.getElementById('openMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuLinks = document.querySelectorAll('.menu-link');

    const toggleMenu = (isOpen) => {
        if (!mobileMenu) return;
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    };

    if (openMenuBtn) openMenuBtn.addEventListener('click', () => toggleMenu(true));
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    
    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // ── HEADER VISUAL SCROLL & CTA REVEAL ──
    const header = document.getElementById('mainHeader');
    const navCta = document.getElementById('navCta');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        if (header) {
            header.classList.toggle('scrolled', scrollPos > 50);
        }

        if (navCta) {
            navCta.style.display = scrollPos > 400 ? 'inline-flex' : 'none';
        }
    });

    // ── CARROSSEL (LOOP CONTINUO) ──
    const setupCarrossel = (trackId) => {
        const track = document.getElementById(trackId);
        if (!track) return;

        const slides = Array.from(track.children);
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });

        const SLIDE_WIDTH = 220; 
        const SLIDE_GAP = 8; 
        const totalWidth = slides.length * (SLIDE_WIDTH + SLIDE_GAP);
        track.style.setProperty('--total-width', `${totalWidth}px`);
    };

    setupCarrossel('trackCosteira');
    setupCarrossel('trackOceanica');

    // ── ACCORDION DO FAQ ──
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    // ── INTERSECTION OBSERVER PARA REVEAL ON SCROLL ──
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // ── FORMULÁRIO DE RESERVA ──

    // Seletor de material
    let materialSelecionado = null;
    document.querySelectorAll('.material-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.material-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            materialSelecionado = btn.dataset.value;
        });
    });

    // Seletor de tamanho do grupo
    let grupoSelecionado = null;
    document.querySelectorAll('.group-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            grupoSelecionado = btn.dataset.value;
        });
    });

    // Seletor de tipo de saída
    let saidaSelecionada = null;
    document.querySelectorAll('.saida-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.saida-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            saidaSelecionada = btn.dataset.value;
        });
    });

    // Se vier de um card de passeio, pré-seleciona o tipo
    const hash = window.location.hash;
    if (hash === '#reservar') {
        // já está na seção certa
    }

    // Pré-seleção por clique nos cards de passeio
    document.querySelectorAll('.btn-reserva').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isCosteira = btn.classList.contains('btn-costeira-reserva');
            const tipo = isCosteira ? 'Costeira' : 'Oceânica';
            setTimeout(() => {
                document.querySelectorAll('.saida-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.value === tipo);
                });
                saidaSelecionada = tipo;
            }, 300);
        });
    });

    // Data mínima = hoje
    const dataInput = document.getElementById('dataDesejada');
    if (dataInput) {
        const hoje = new Date();
        const yyyy = hoje.getFullYear();
        const mm = String(hoje.getMonth() + 1).padStart(2, '0');
        const dd = String(hoje.getDate()).padStart(2, '0');
        dataInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // Formatação automática do WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (v.length > 6) {
                v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
            } else if (v.length > 2) {
                v = `(${v.slice(0,2)}) ${v.slice(2)}`;
            } else if (v.length > 0) {
                v = `(${v}`;
            }
            e.target.value = v;
        });
    }

    // Envio do formulário → WhatsApp
    const btnEnviar = document.getElementById('btnEnviar');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            const nome = document.getElementById('nomeCompleto').value.trim();
            const whatsapp = document.getElementById('whatsapp').value.trim();
            const dataVal = document.getElementById('dataDesejada').value;
            const obs = document.getElementById('observacoes').value.trim();

            // Validações
            if (!nome) {
                alert('Por favor, informe seu nome completo.');
                document.getElementById('nomeCompleto').focus();
                return;
            }
            if (!whatsapp || whatsapp.replace(/\D/g, '').length < 10) {
                alert('Por favor, informe um número de WhatsApp válido.');
                document.getElementById('whatsapp').focus();
                return;
            }
            if (!grupoSelecionado) {
                alert('Por favor, selecione o tamanho do grupo.');
                return;
            }
            if (!saidaSelecionada) {
                alert('Por favor, selecione o tipo de saída.');
                return;
            }
            if (!materialSelecionado) {
                alert('Por favor, selecione se vai precisar de material de pesca.');
                return;
            }
            if (!dataVal) {
                alert('Por favor, selecione a data desejada.');
                document.getElementById('dataDesejada').focus();
                return;
            }

            // Formata a data para PT-BR
            const [ano, mes, dia] = dataVal.split('-');
            const dataFormatada = `${dia}/${mes}/${ano}`;

            // Monta a mensagem
            let msg = `Olá, Raphael! Gostaria de fazer uma reserva. 🎣\n\n`;
            msg += `*Nome:* ${nome}\n`;
            msg += `*WhatsApp:* ${whatsapp}\n`;
            msg += `*Grupo:* ${grupoSelecionado} ${grupoSelecionado === '1' ? 'pessoa' : 'pessoas'}\n`;
            msg += `*Tipo de saída:* Pesca ${saidaSelecionada}\n`;
            msg += `*Data desejada:* ${dataFormatada}\n`;
            msg += `*Material de pesca:* ${materialSelecionado}\n`;
            if (obs) {
                msg += `*Observações:* ${obs}\n`;
            }

            const numero = '5524999037644';
            const urlWpp = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
            window.open(urlWpp, '_blank');
        });
    }
});
