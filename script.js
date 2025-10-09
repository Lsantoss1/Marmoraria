// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
  // Animações
  animationDuration: 300,
  scrollOffset: 100,

  // Slider
  sliderAutoplay: true,
  sliderInterval: 5000,

  // Contatos
  whatsappNumber: "5511999999999",
  email: "contato@marmoraria-elegance.com.br",

  // Calculadora
  calculator: {
    materials: {
      marmore: { name: "Mármore", price: 180 },
      granito: { name: "Granito", price: 120 },
      quartzo: { name: "Quartzo", price: 250 },
      quartzito: { name: "Quartzito", price: 200 },
    },
    services: {
      instalacao: { name: "Instalação Profissional", price: 50, perM2: true },
      projeto3d: { name: "Projeto 3D", price: 350, perM2: false },
      entrega: { name: "Entrega e Transporte", price: 100, perM2: false },
    },
  },
};

// ===== CLASSES PRINCIPAIS =====
class MarmorariaApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.startPreloader();
  }

  setupEventListeners() {
    // DOM Content Loaded
    document.addEventListener("DOMContentLoaded", () => {
      this.onDOMReady();
    });

    // Window Load
    window.addEventListener("load", () => {
      this.onWindowLoad();
    });

    // Scroll
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        this.onScroll();
      }, 16)
    );

    // Resize
    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.onResize();
      }, 250)
    );
  }

  initializeComponents() {
    // Inicializar componentes após DOM ready
    document.addEventListener("DOMContentLoaded", () => {
      this.customCursor = new CustomCursor();
      this.navigation = new Navigation();
      this.heroSlider = new HeroSlider();
      this.animatedCounters = new AnimatedCounters();
      this.productFilters = new ProductFilters();
      this.portfolioFilters = new PortfolioFilters();
      this.calculator = new Calculator();
      this.contactForm = new ContactForm();
      this.whatsappFloat = new WhatsAppFloat();
      this.backToTop = new BackToTop();
      this.scrollAnimations = new ScrollAnimations();
    });
  }

  onDOMReady() {
    // Inicializar AOS
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 50,
      });
    }

    // Inicializar GSAP ScrollTrigger
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  onWindowLoad() {
    this.hidePreloader();
  }

  onScroll() {
    this.updateScrollProgress();
    this.handleHeaderScroll();
    this.updateActiveNavigation();
  }

  onResize() {
    // Recalcular dimensões e reposicionar elementos
    if (this.heroSlider) {
      this.heroSlider.handleResize();
    }
  }

  startPreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      // Simular carregamento
      const progress = preloader.querySelector(".loading-progress");
      if (progress) {
        let width = 0;
        const interval = setInterval(() => {
          width += Math.random() * 15;
          if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => this.hidePreloader(), 500);
          }
          progress.style.width = width + "%";
        }, 100);
      }
    }
  }

  hidePreloader() {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
        document.body.style.overflow = "visible";
      }, 500);
    }
  }

  updateScrollProgress() {
    const scrolled = window.pageYOffset;
    const maxHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxHeight) * 100;

    // Atualizar barra de progresso se existir
    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar) {
      progressBar.style.width = progress + "%";
    }
  }

  handleHeaderScroll() {
    const header = document.querySelector(".header");
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }

  updateActiveNavigation() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("data-section") === current) {
        link.classList.add("active");
      }
    });
  }

  // Utilitários
  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

// ===== CURSOR PERSONALIZADO =====
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector(".custom-cursor");
    this.cursorDot = document.querySelector(".cursor-dot");
    this.cursorOutline = document.querySelector(".cursor-outline");

    if (this.cursor && window.innerWidth > 768) {
      this.init();
    }
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      this.updatePosition(e.clientX, e.clientY);
    });

    // Efeitos hover
    document.querySelectorAll("a, button, .cursor-hover").forEach((el) => {
      el.addEventListener("mouseenter", () => this.addHoverEffect());
      el.addEventListener("mouseleave", () => this.removeHoverEffect());
    });
  }

  updatePosition(x, y) {
    if (this.cursorDot) {
      this.cursorDot.style.left = x + "px";
      this.cursorDot.style.top = y + "px";
    }

    if (this.cursorOutline) {
      this.cursorOutline.style.left = x + "px";
      this.cursorOutline.style.top = y + "px";
    }
  }

  addHoverEffect() {
    if (this.cursorOutline) {
      this.cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
      this.cursorOutline.style.opacity = "0.8";
    }
  }

  removeHoverEffect() {
    if (this.cursorOutline) {
      this.cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
      this.cursorOutline.style.opacity = "0.5";
    }
  }
}

// ===== NAVEGAÇÃO =====
class Navigation {
  constructor() {
    this.navToggle = document.getElementById("nav-toggle");
    this.navMenu = document.getElementById("nav-menu");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.init();
  }

  init() {
    // Toggle mobile menu
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }

    // Smooth scroll para links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
          e.preventDefault();
          this.smoothScrollTo(href);
          this.closeMobileMenu();
        }
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (
        !this.navMenu.contains(e.target) &&
        !this.navToggle.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle("active");
    this.navToggle.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  }

  closeMobileMenu() {
    this.navMenu.classList.remove("active");
    this.navToggle.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }
}

// ===== HERO SLIDER =====
class HeroSlider {
  constructor() {
    this.slider = document.querySelector(".hero-slider");
    this.slides = document.querySelectorAll(".slide");
    this.indicators = document.querySelectorAll(".indicator");
    this.prevBtn = document.getElementById("prev-slide");
    this.nextBtn = document.getElementById("next-slide");

    this.currentSlide = 0;
    this.isAutoplay = CONFIG.sliderAutoplay;
    this.autoplayInterval = null;

    if (this.slider && this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Controles
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prevSlide());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextSlide());
    }

    // Indicadores
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    // Autoplay
    if (this.isAutoplay) {
      this.startAutoplay();
    }

    // Pausar autoplay no hover
    this.slider.addEventListener("mouseenter", () => this.stopAutoplay());
    this.slider.addEventListener("mouseleave", () => {
      if (this.isAutoplay) this.startAutoplay();
    });

    // Typing effect para o primeiro slide
    this.initTypingEffect();

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });
  }

  goToSlide(index) {
    // Remover classe active de todos os slides
    this.slides.forEach((slide) => slide.classList.remove("active"));
    this.indicators.forEach((indicator) =>
      indicator.classList.remove("active")
    );

    // Ativar slide atual
    this.slides[index].classList.add("active");
    this.indicators[index].classList.add("active");

    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, CONFIG.sliderInterval);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  initTypingEffect() {
    const typingElement = document.querySelector(".typing-text");
    if (typingElement) {
      const words = ["Elegância", "Sofisticação", "Qualidade", "Exclusividade"];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const typeEffect = () => {
        const currentWord = words[wordIndex];

        if (isDeleting) {
          typingElement.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typingElement.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 150;

        if (!isDeleting && charIndex === currentWord.length) {
          typeSpeed = 2000;
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
      };

      typeEffect();
    }
  }

  handleResize() {
    // Recalcular dimensões do slider se necessário
    this.slides.forEach((slide) => {
      slide.style.height = window.innerHeight + "px";
    });
  }
}

// ===== CONTADORES ANIMADOS =====
class AnimatedCounters {
  constructor() {
    this.counters = document.querySelectorAll(".stat-number");
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.7 }
    );

    this.counters.forEach((counter) => {
      observer.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    updateCounter();
  }
}

// ===== FILTROS DE PRODUTOS =====
class ProductFilters {
  constructor() {
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.productCards = document.querySelectorAll(".produto-card");
    this.init();
  }

  init() {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        this.filterProducts(filter);
        this.updateActiveFilter(btn);
      });
    });
  }

  filterProducts(filter) {
    this.productCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.classList.remove("hidden");
        card.style.display = "block";
      } else {
        card.classList.add("hidden");
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  updateActiveFilter(activeBtn) {
    this.filterBtns.forEach((btn) => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }
}

// ===== FILTROS DE PORTFÓLIO =====
class PortfolioFilters {
  constructor() {
    this.filterBtns = document.querySelectorAll(".portfolio-filter");
    this.portfolioItems = document.querySelectorAll(".portfolio-item");
    this.loadMoreBtn = document.getElementById("load-more-portfolio");
    this.init();
  }

  init() {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        this.filterPortfolio(filter);
        this.updateActiveFilter(btn);
      });
    });

    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener("click", () => {
        this.loadMoreItems();
      });
    }

    // Modal para imagens
    this.initPortfolioModal();
  }

  filterPortfolio(filter) {
    this.portfolioItems.forEach((item) => {
      const classes = item.className;

      if (filter === "*" || classes.includes(filter.replace(".", ""))) {
        item.classList.remove("hidden");
        item.style.display = "block";
      } else {
        item.classList.add("hidden");
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  }

  updateActiveFilter(activeBtn) {
    this.filterBtns.forEach((btn) => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  }

  loadMoreItems() {
    // Simular carregamento de mais itens
    const hiddenItems = document.querySelectorAll(
      '.portfolio-item[style*="display: none"]'
    );
    const itemsToShow = Math.min(4, hiddenItems.length);

    for (let i = 0; i < itemsToShow; i++) {
      hiddenItems[i].style.display = "block";
      hiddenItems[i].classList.remove("hidden");
    }

    if (hiddenItems.length <= itemsToShow) {
      this.loadMoreBtn.style.display = "none";
    }
  }

  initPortfolioModal() {
    // Criar modal para visualização de imagens
    const modal = this.createModal();

    document
      .querySelectorAll('.portfolio-btn[data-action="view"]')
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const portfolioItem = btn.closest(".portfolio-item");
          const img = portfolioItem.querySelector("img");
          const title = portfolioItem.querySelector("h3").textContent;
          const description = portfolioItem.querySelector("p").textContent;

          this.openModal(modal, img.src, title, description);
        });
      });
  }

  createModal() {
    const modal = document.createElement("div");
    modal.className = "portfolio-modal";
    modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img class="modal-image" src="" alt="">
                    <div class="modal-info">
                        <h3 class="modal-title"></h3>
                        <p class="modal-description"></p>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector(".modal-close").addEventListener("click", () => {
      this.closeModal(modal);
    });

    modal.querySelector(".modal-overlay").addEventListener("click", (e) => {
      if (e.target === modal.querySelector(".modal-overlay")) {
        this.closeModal(modal);
      }
    });

    return modal;
  }

  openModal(modal, imageSrc, title, description) {
    modal.querySelector(".modal-image").src = imageSrc;
    modal.querySelector(".modal-title").textContent = title;
    modal.querySelector(".modal-description").textContent = description;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      modal.classList.add("active");
    }, 10);
  }

  closeModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "visible";
    }, 300);
  }
}

// ===== CALCULADORA DE ORÇAMENTO =====
class Calculator {
  constructor() {
    this.currentStep = 1;
    this.maxSteps = 3;
    this.calculatorData = {
      material: null,
      area: 0,
      services: [],
    };

    this.init();
  }

  init() {
    // Navegação da calculadora
    const nextBtn = document.getElementById("calc-next");
    const prevBtn = document.getElementById("calc-prev");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.nextStep());
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => this.prevStep());
    }

    // Seleção de materiais
    document.querySelectorAll(".stone-option").forEach((option) => {
      option.addEventListener("click", () => this.selectMaterial(option));
    });

    // Inputs de medidas
    const comprimento = document.getElementById("comprimento");
    const largura = document.getElementById("largura");

    if (comprimento && largura) {
      comprimento.addEventListener("input", () => this.calculateArea());
      largura.addEventListener("input", () => this.calculateArea());
    }

    // Serviços adicionais
    document
      .querySelectorAll('.service-option input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () => this.updateServices());
      });

    // Botões de ação do resultado
    const sendQuoteBtn = document.getElementById("send-quote");
    const saveQuoteBtn = document.getElementById("save-quote");
    const clearQuoteBtn = document.getElementById("clear-quote");

    if (sendQuoteBtn) {
      sendQuoteBtn.addEventListener("click", () => this.sendQuoteWhatsApp());
    }

    if (saveQuoteBtn) {
      saveQuoteBtn.addEventListener("click", () => this.saveQuotePDF());
    }

    if (clearQuoteBtn) {
      clearQuoteBtn.addEventListener("click", () => this.clearCalculator());
    }

    // Botão de orçamento rápido
    const btnQuote = document.getElementById("btn-quote");
    if (btnQuote) {
      btnQuote.addEventListener("click", () => this.openCalculator());
    }
  }

  nextStep() {
    if (this.currentStep < this.maxSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
        this.updateStepDisplay();
        this.updateNavigation();
      }
    } else {
      this.calculateFinalResult();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
      this.updateNavigation();
    }
  }

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        if (this.calculatorData.material === null) {
          this.showNotification(
            "Por favor, selecione um tipo de pedra.",
            "error"
          );
          return false;
        }
        return true;
      case 2:
        if (this.calculatorData.area <= 0) {
          this.showNotification(
            "Por favor, informe as medidas do projeto.",
            "error"
          );
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return true;
    }
  }

  updateStepDisplay() {
    document.querySelectorAll(".calc-step").forEach((step) => {
      step.classList.remove("active");
    });

    const currentStepElement = document.querySelector(
      `[data-step="${this.currentStep}"]`
    );
    if (currentStepElement) {
      currentStepElement.classList.add("active");
    }
  }

  updateNavigation() {
    const nextBtn = document.getElementById("calc-next");
    const prevBtn = document.getElementById("calc-prev");

    if (prevBtn) {
      prevBtn.style.display = this.currentStep > 1 ? "flex" : "none";
    }

    if (nextBtn) {
      if (this.currentStep === this.maxSteps) {
        nextBtn.innerHTML =
          '<i class="fas fa-calculator"></i> Calcular Orçamento';
      } else {
        nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
      }
    }
  }

  selectMaterial(option) {
    // Remover seleção anterior
    document.querySelectorAll(".stone-option").forEach((opt) => {
      opt.classList.remove("selected");
    });

    // Selecionar atual
    option.classList.add("selected");

    const materialType = option.getAttribute("data-type");
    const materialPrice = parseFloat(option.getAttribute("data-price"));

    this.calculatorData.material = {
      type: materialType,
      name: CONFIG.calculator.materials[materialType].name,
      price: materialPrice,
    };
  }

  calculateArea() {
    const comprimento =
      parseFloat(document.getElementById("comprimento").value) || 0;
    const largura = parseFloat(document.getElementById("largura").value) || 0;

    this.calculatorData.area = comprimento * largura;

    const areaDisplay = document.getElementById("area-total");
    if (areaDisplay) {
      areaDisplay.textContent = this.calculatorData.area.toFixed(2) + " m²";
    }
  }

  updateServices() {
    this.calculatorData.services = [];

    document
      .querySelectorAll('.service-option input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        const serviceId = checkbox.id;
        const servicePrice = parseFloat(checkbox.getAttribute("data-price"));
        const serviceConfig = CONFIG.calculator.services[serviceId];

        this.calculatorData.services.push({
          id: serviceId,
          name: serviceConfig.name,
          price: servicePrice,
          perM2: serviceConfig.perM2,
        });
      });
  }

  calculateFinalResult() {
    const { material, area, services } = this.calculatorData;

    if (!material || area <= 0) {
      this.showNotification(
        "Por favor, complete todas as informações necessárias.",
        "error"
      );
      return;
    }

    // Calcular preço base
    const basePrice = material.price * area;

    // Calcular serviços
    let servicesPrice = 0;
    services.forEach((service) => {
      if (service.perM2) {
        servicesPrice += service.price * area;
      } else {
        servicesPrice += service.price;
      }
    });

    const totalPrice = basePrice + servicesPrice;

    // Exibir resultado
    this.displayResult({
      material: material.name,
      area: area.toFixed(2) + " m²",
      basePrice: this.formatCurrency(basePrice),
      servicesPrice: this.formatCurrency(servicesPrice),
      totalPrice: this.formatCurrency(totalPrice),
    });
  }

  displayResult(result) {
    document.getElementById("result-material").textContent = result.material;
    document.getElementById("result-area").textContent = result.area;
    document.getElementById("result-base").textContent = result.basePrice;
    document.getElementById("result-services").textContent =
      result.servicesPrice;
    document.getElementById("result-total").textContent = result.totalPrice;

    document.getElementById("calc-result").style.display = "block";
    document.querySelector(".calc-navigation").style.display = "none";
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  sendQuoteWhatsApp() {
    const { material, area } = this.calculatorData;
    const totalElement = document.getElementById("result-total");
    const total = totalElement ? totalElement.textContent : "N/A";

    const message = `Olá! Gostaria de solicitar um orçamento:
        
📋 *Detalhes do Projeto:*
• Material: ${material.name}
• Área: ${area.toFixed(2)} m²
• Valor estimado: ${total}

Gostaria de agendar uma visita técnica para orçamento detalhado.`;

    const whatsappUrl = `https://wa.me/${
      CONFIG.whatsappNumber
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  saveQuotePDF() {
    const { material, area } = this.calculatorData;
    const totalElement = document.getElementById("result-total");
    const total = totalElement ? totalElement.textContent : "N/A";

    // Criar conteúdo para o PDF
    const content = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #d4af37; text-align: center;">Marmoraria Elegance</h1>
                <h2 style="text-align: center;">Orçamento</h2>
                <hr>
                <div style="margin: 20px 0;">
                    <p><strong>Material:</strong> ${
                      material ? material.name : "N/A"
                    }</p>
                    <p><strong>Área:</strong> ${area.toFixed(2)} m²</p>
                    <p><strong>Valor Total:</strong> ${total}</p>
                </div>
                <hr>
                <p style="text-align: center; color: #666;">
                    Este orçamento foi gerado em ${new Date().toLocaleDateString(
                      "pt-BR"
                    )}
                </p>
            </div>
        `;

    // Usar uma biblioteca como jsPDF para gerar o PDF
    // Por enquanto, vamos criar uma versão simplificada
    this.generateSimplePDF(content);
  }

  // Método auxiliar para gerar PDF simples
  generateSimplePDF(content) {
    // Criar uma nova janela/aba com o conteúdo formatado
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Orçamento - Marmoraria Elegance</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; color: #d4af37; }
                    .content { margin: 20px 0; }
                    .footer { text-align: center; color: #666; margin-top: 30px; }
                </style>
            </head>
            <body>
                ${content}
                <script>
                    // Auto-print
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
    printWindow.document.close();

    this.showNotification("PDF gerado com sucesso!", "success");
  }

  // Método para limpar a calculadora
  clearCalculator() {
    // Resetar dados
    this.currentStep = 1;
    this.calculatorData = {
      material: null,
      area: 0,
      services: [],
    };

    // Resetar UI
    document.querySelectorAll(".stone-option").forEach((option) => {
      option.classList.remove("selected");
    });

    document.getElementById("comprimento").value = "";
    document.getElementById("largura").value = "";
    document.getElementById("espessura").value = "2";
    document.getElementById("area-total").textContent = "0 m²";

    document
      .querySelectorAll('.service-option input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Resetar navegação
    this.updateStepDisplay();
    this.updateNavigation();

    // Ocultar resultado
    document.getElementById("calc-result").style.display = "none";
    document.querySelector(".calc-navigation").style.display = "flex";

    // Mostrar notificação
    this.showNotification(
      "Calculadora reiniciada. Pode criar um novo orçamento.",
      "info"
    );
  }

  // Método auxiliar para mostrar notificações
  showNotification(message, type = "info") {
    // Criar notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Botão de fechar
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        this.removeNotification(notification);
      });
  }

  removeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  openCalculator() {
    const calculatorSection = document.getElementById("calculadora");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth" });
    }
  }
  // Método para limpar a calculadora
  clearCalculator() {
    // Resetar dados
    this.currentStep = 1;
    this.calculatorData = {
      material: null,
      area: 0,
      services: [],
    };

    // Resetar UI
    document.querySelectorAll(".stone-option").forEach((option) => {
      option.classList.remove("selected");
    });

    document.getElementById("comprimento").value = "";
    document.getElementById("largura").value = "";
    document.getElementById("espessura").value = "2";
    document.getElementById("area-total").textContent = "0 m²";

    document
      .querySelectorAll('.service-option input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });

    // Resetar navegação
    this.updateStepDisplay();
    this.updateNavigation();

    // Ocultar resultado
    document.getElementById("calc-result").style.display = "none";
    document.querySelector(".calc-navigation").style.display = "flex";

    // Mostrar notificação
    this.showNotification(
      "Calculadora reiniciada. Pode criar um novo orçamento.",
      "info"
    );
  }

  // Método auxiliar para mostrar notificações
  showNotification(message, type = "info") {
    // Criar notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Botão de fechar
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        this.removeNotification(notification);
      });
  }

  removeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// ===== FORMULÁRIO DE CONTATO =====
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Validação em tempo real
    this.form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });

    // Formatação de telefone
    const telefoneField = document.getElementById("telefone");
    if (telefoneField) {
      telefoneField.addEventListener("input", (e) => {
        this.formatPhone(e.target);
      });
    }

    // Upload de arquivos
    this.initFileUpload();
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = "";

    switch (fieldName) {
      case "nome":
        if (value.length < 2) {
          isValid = false;
          message = "Nome deve ter pelo menos 2 caracteres";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = "E-mail inválido";
        }
        break;

      case "telefone":
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          message = "Telefone inválido. Use o formato (11) 99999-9999";
        }
        break;
    }

    this.showFieldFeedback(field, isValid, message);
    return isValid;
  }

  showFieldFeedback(field, isValid, message) {
    const feedback = field.parentNode.querySelector(".form-feedback");
    if (feedback) {
      feedback.textContent = message;
      feedback.className = `form-feedback ${isValid ? "success" : "error"}`;
    }

    field.style.borderColor = isValid ? "#27ae60" : "#e74c3c";
  }

  clearFieldError(field) {
    field.style.borderColor = "";
    const feedback = field.parentNode.querySelector(".form-feedback");
    if (feedback) {
      feedback.textContent = "";
      feedback.className = "form-feedback";
    }
  }

  formatPhone(field) {
    let value = field.value.replace(/\D/g, "");

    if (value.length >= 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length >= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (value.length >= 6) {
      value = value.replace(/(\d{2})(\d{4})/, "($1) $2");
    } else if (value.length >= 2) {
      value = value.replace(/(\d{2})/, "($1) ");
    }

    field.value = value;
  }

  initFileUpload() {
    const dropZone = document.getElementById("file-drop-zone");
    const fileInput = document.getElementById("arquivos");
    const fileList = document.getElementById("file-list");

    if (!dropZone || !fileInput) return;

    // Drag and drop
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      const files = e.dataTransfer.files;
      this.handleFiles(files, fileList);
    });

    // Click to select
    dropZone.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      this.handleFiles(e.target.files, fileList);
    });
  }

  handleFiles(files, fileList) {
    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert(`Arquivo ${file.name} é muito grande. Limite: 10MB`);
        return;
      }

      const fileItem = document.createElement("div");
      fileItem.className = "file-item";
      fileItem.innerHTML = `
                <span>${file.name} (${this.formatFileSize(file.size)})</span>
                <button type="button" class="file-remove" onclick="this.parentNode.remove()">×</button>
            `;
      fileList.appendChild(fileItem);
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  async handleSubmit() {
    const submitBtn = this.form.querySelector(".btn-submit");
    const formData = new FormData(this.form);

    // Validar todos os campos obrigatórios
    const requiredFields = this.form.querySelectorAll("[required]");
    let isFormValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showNotification(
        "Por favor, corrija os erros no formulário.",
        "error"
      );
      return;
    }

    // Mostrar loading
    submitBtn.classList.add("loading");

    try {
      // Simular envio (em produção, seria uma requisição real)
      await this.simulateFormSubmission(formData);

      this.showNotification(
        "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        "success"
      );
      this.form.reset();
      document.getElementById("file-list").innerHTML = "";

      // Enviar para WhatsApp também
      this.sendToWhatsApp(formData);
    } catch (error) {
      this.showNotification(
        "Erro ao enviar mensagem. Tente novamente.",
        "error"
      );
    } finally {
      submitBtn.classList.remove("loading");
    }
  }

  async simulateFormSubmission(formData) {
    // Simular delay de envio
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  sendToWhatsApp(formData) {
    const nome = formData.get("nome");
    const telefone = formData.get("telefone");
    const email = formData.get("email");
    const tipoProjeto = formData.get("tipo-projeto");
    const orcamento = formData.get("orcamento");
    const mensagem = formData.get("mensagem");

    const whatsappMessage = `*Nova Solicitação de Orçamento*

👤 *Nome:* ${nome}
📞 *Telefone:* ${telefone}
📧 *E-mail:* ${email}
🏠 *Tipo de Projeto:* ${tipoProjeto || "Não informado"}
💰 *Orçamento:* ${orcamento || "Não informado"}

📝 *Mensagem:*
${mensagem || "Nenhuma mensagem adicional"}

---
_Enviado pelo site da Marmoraria Elegance_`;

    const whatsappUrl = `https://wa.me/${
      CONFIG.whatsappNumber
    }?text=${encodeURIComponent(whatsappMessage)}`;

    // Abrir WhatsApp após um pequeno delay
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1000);
  }

  showNotification(message, type = "info") {
    // Criar notificação
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success"
                    ? "check-circle"
                    : type === "error"
                    ? "exclamation-circle"
                    : "info-circle"
                }"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Adicionar ao DOM
    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);

    // Botão de fechar
    notification
      .querySelector(".notification-close")
      .addEventListener("click", () => {
        this.removeNotification(notification);
      });
  }

  removeNotification(notification) {
    notification.classList.remove("show");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

// ===== WHATSAPP FLOAT =====
class WhatsAppFloat {
  constructor() {
    this.whatsappFloat = document.getElementById("whatsapp-float");
    this.init();
  }

  init() {
    if (!this.whatsappFloat) return;

    this.whatsappFloat.addEventListener("click", () => {
      this.openWhatsApp();
    });

    // Animação de entrada
    setTimeout(() => {
      this.whatsappFloat.style.opacity = "1";
      this.whatsappFloat.style.transform = "scale(1)";
    }, 2000);
  }

  openWhatsApp() {
    const message = `Olá! Vim pelo site da Marmoraria Elegance e gostaria de mais informações sobre seus produtos e serviços.`;
    const whatsappUrl = `https://wa.me/${
      CONFIG.whatsappNumber
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }
}

// ===== BACK TO TOP =====
class BackToTop {
  constructor() {
    this.backToTopBtn = document.getElementById("back-to-top");
    this.init();
  }

  init() {
    if (!this.backToTopBtn) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        this.backToTopBtn.classList.add("visible");
      } else {
        this.backToTopBtn.classList.remove("visible");
      }
    });

    this.backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ===== ANIMAÇÕES DE SCROLL =====
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    // GSAP ScrollTrigger animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      this.initGSAPAnimations();
    }

    // Parallax effects
    this.initParallaxEffects();
  }

  initGSAPAnimations() {
    // Fade in animations
    gsap.utils.toArray(".fade-in").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Slide in from left
    gsap.utils.toArray(".slide-in-left").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
          },
        }
      );
    });

    // Slide in from right
    gsap.utils.toArray(".slide-in-right").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
          },
        }
      );
    });

    // Scale animations
    gsap.utils.toArray(".scale-in").forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
          },
        }
      );
    });
  }

  initParallaxEffects() {
    const parallaxElements = document.querySelectorAll(".parallax");

    if (parallaxElements.length > 0) {
      window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach((element) => {
          const rate = scrolled * -0.5;
          element.style.transform = `translateY(${rate}px)`;
        });
      });
    }
  }
}

// ===== INICIALIZAÇÃO =====
const app = new MarmorariaApp();

// ===== ESTILOS DINÂMICOS PARA NOTIFICAÇÕES =====
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    transform: translateX(400px);
    transition: all 0.3s ease;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
}

.notification-success {
    border-left: 4px solid #27ae60;
}

.notification-error {
    border-left: 4px solid #e74c3c;
}

.notification-info {
    border-left: 4px solid #3498db;
}

.notification-success i {
    color: #27ae60;
}

.notification-error i {
    color: #e74c3c;
}

.notification-info i {
    color: #3498db;
}

.notification-close {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #999;
    margin-left: auto;
}

.notification-close:hover {
    color: #333;
}

.portfolio-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.portfolio-modal.active {
    opacity: 1;
}

.modal-overlay {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    max-height: 90vh;
    overflow: auto;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #999;
    z-index: 1;
}

.modal-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
}

.modal-info {
    padding: 20px;
}

.modal-title {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c3e50;
}

.modal-description {
    color: #6c757d;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
    
    .modal-content {
        margin: 20px;
        max-width: none;
    }
    
    .modal-image {
        height: 250px;
    }
}
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement("style");
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
