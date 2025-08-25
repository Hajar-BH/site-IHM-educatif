/**
 * IHM Explorer - Script interactif
 * Script principal qui gère les animations, interactions et effets visuels du site
 */

document.addEventListener('DOMContentLoaded', () => {
  // Éléments DOM
  const themeSwitcher = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const closeMenu = document.querySelector('.close-menu');
  const overlay = document.querySelector('.overlay');
  const mobileMenu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('.section-hidden');
  const statElements = document.querySelectorAll('.stat-number');
  const domainCards = document.querySelectorAll('.domain-card');
  const body = document.body;

  // Fonction pour basculer le thème
  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (document.body.classList.contains('dark-theme')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  }
  
  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  // Menu mobile
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  overlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Commutateur de thème
  themeSwitcher.addEventListener('click', toggleTheme);
  
  // Animation au défilement
  function handleScroll() {
    // Modifier le header au défilement
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Animer les sections au défilement
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.85) {
        section.classList.add('section-visible');
        
        // Anime les cartes de domaine avec un délai progressif
        if (section.contains(document.querySelector('.domains-grid'))) {
          const domainCards = section.querySelectorAll('.domain-card');
          domainCards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
        
        // Anime les cartes de témoignages avec un délai progressif
        if (section.contains(document.querySelector('.testimonials-grid'))) {
          const testimonialCards = section.querySelectorAll('.testimonial-card');
          testimonialCards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 200);
          });
        }
      }
    });
  }
  
  // Observer les sections pour l'animation au défilement
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observer les sections
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Écouteur de défilement
  window.addEventListener('scroll', handleScroll);
  
  // Déclencher manuellement pour animer les éléments visibles au chargement
  handleScroll();
  
  // ===== ANIMATION DES STATISTIQUES =====
  function animateStats() {
    // Démarrer l'animation des statistiques immédiatement au chargement
    const statsContainer = document.getElementById('stats');
    if (statsContainer) {
      const statNumbers = statsContainer.querySelectorAll('.stat-number');
      
      statNumbers.forEach((stat, index) => {
        // Récupère les données depuis les attributs data-
        const targetValue = parseInt(stat.getAttribute('data-value'));
        const suffix = stat.getAttribute('data-suffix') || '';
        
        // Valeurs initiales pour l'animation
        let currentValue = 0;
        const duration = 2000; // Durée en millisecondes
        const stepTime = 20; // Intervalle entre les pas
        let startTime;
        
        // Fonction d'animation avec requestAnimationFrame pour une animation fluide
        function updateCounter(timestamp) {
          if (!startTime) startTime = timestamp;
          
          // Calcul du temps écoulé et de la progression
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Fonction d'ease pour un effet plus naturel
          const easedProgress = easeOutCubic(progress);
          
          // Calcul de la valeur actuelle
          currentValue = Math.floor(easedProgress * targetValue);
          
          // Mise à jour du texte avec le nombre formaté
          stat.textContent = formatNumber(currentValue) + suffix;
          
          // Continue l'animation jusqu'à atteindre la valeur cible
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        
        // Démarre l'animation avec un délai pour chaque statistique
        setTimeout(() => {
          requestAnimationFrame(updateCounter);
        }, index * 150);
      });
    }
  }
  
  // Fonction d'ease pour une animation plus naturelle
  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }
  
  // Fonction pour formater les grands nombres avec séparateurs
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  
  // Initialise l'animation des stats
  animateStats();
  
  // ===== ANIMATION DES CARTES DE DOMAINE =====
  domainCards.forEach(card => {
    // Animation au survol
    card.addEventListener('mouseenter', function() {
      const color = this.getAttribute('data-color');
      this.style.borderColor = `var(--${color})`;
      this.style.boxShadow = `0 10px 20px rgba(0, 0, 0, 0.1)`;
      
      // Anime l'icône
      const icon = this.querySelector('.domain-icon');
      icon.style.transform = 'scale(1.1)';
      icon.style.backgroundColor = `rgba(var(--${color}), 0.1)`;
    });
    
    // Retour à l'état initial
    card.addEventListener('mouseleave', function() {
      this.style.borderColor = 'var(--border)';
      this.style.boxShadow = 'none';
      
      // Réinitialise l'icône
      const icon = this.querySelector('.domain-icon');
      icon.style.transform = 'scale(1)';
      icon.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    });
    
    // Animation au clic
    card.addEventListener('click', function() {
      this.classList.add('pulse');
      
      // Supprime la classe après l'animation
      setTimeout(() => {
        this.classList.remove('pulse');
      }, 300);
    });
  });
  
  // ===== BOUTON DE LECTURE VIDÉO =====
  const playButton = document.querySelector('.play-button');
  if (playButton) {
    playButton.addEventListener('click', function() {
      // Animation du bouton
      this.classList.add('clicked');
      
      // Simule le lancement d'une vidéo (à remplacer par le code de lecture réel)
      setTimeout(() => {
        this.classList.remove('clicked');
        alert('La vidéo sera lancée ici dans une version future.');
      }, 300);
    });
  }
  
  // ===== EFFET PARALLAXE LÉGER =====
  function handleParallax() {
    const scrollY = window.scrollY;
    
    // Sélectionne les éléments décoratifs
    const circles = document.querySelectorAll('.circle');
    const dots = document.querySelectorAll('.dot');
    const bubbles = document.querySelectorAll('.floating-bubble');
    
    // Applique le parallaxe aux cercles
    circles.forEach((circle, index) => {
      const speed = 0.05 + (index * 0.01);
      circle.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Applique le parallaxe aux points
    dots.forEach((dot, index) => {
      const speed = 0.03 + (index * 0.01);
      dot.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Applique le parallaxe aux bulles
    bubbles.forEach((bubble, index) => {
      const speed = 0.02 + (index * 0.005);
      bubble.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
  
  // Optimise le parallaxe avec requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleParallax();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // ===== ANIMATIONS SUPPLÉMENTAIRES =====
  
  // Animation du badge dans le hero
  const badge = document.querySelector('.badge');
  if (badge) {
    setTimeout(() => {
      badge.style.transform = 'translateY(0)';
      badge.style.opacity = '1';
    }, 300);
  }
  
  // Animer les boutons au survol
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      if (this.classList.contains('primary')) {
        this.style.transform = 'translateY(-3px) scale(1.03)';
      } else {
        this.style.transform = 'translateY(-2px)';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // Rendre le hero visible immédiatement au chargement
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    setTimeout(() => {
      heroSection.classList.add('section-visible');
    }, 100);
  }
  
  // ===== NAVIGATION FLUIDE =====
  
  // Navigation fluide pour les liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignore les liens vides ou #
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Ferme le menu mobile si ouvert
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          closeMenu();
        }
        
        // Défilement fluide vers l'élément cible
        window.scrollTo({
          top: targetElement.offsetTop - 100, // Ajuste pour le header fixe
          behavior: 'smooth'
        });
        
        // Met à jour les liens actifs
        document.querySelectorAll('.nav a, .mobile-nav a').forEach(link => {
          link.classList.remove('active');
        });
        
        // Ajoute la classe active au lien cliqué
        this.classList.add('active');
      }
    });
  });
  
  // Initialise les animations au chargement
  handleParallax();

  // ===== GESTION DES COURS =====
  const coursesData = [
    {
      id: 1,
      title: "Introduction à l'IHM",
      description: "Découvrez les bases de l'Interface Homme-Machine et les principes fondamentaux du design d'interfaces.",
      image: "images/course1.jpg",
      difficulty: "beginner",
      duration: "2h",
      instructor: "Dr. Martin",
      rating: 4.8,
      category: "design"
    },
    {
      id: 2,
      title: "Programmation Graphique avec Canvas",
      description: "Apprenez à créer des interfaces graphiques interactives avec HTML5 Canvas et JavaScript.",
      image: "images/course2.jpg",
      difficulty: "intermediate",
      duration: "4h",
      instructor: "Prof. Dubois",
      rating: 4.6,
      category: "prog-graphique"
    },
    {
      id: 3,
      title: "Tests Utilisateurs et Évaluation",
      description: "Maîtrisez les méthodes d'évaluation des interfaces et les techniques de tests utilisateurs.",
      image: "images/course3.jpg",
      difficulty: "advanced",
      duration: "3h",
      instructor: "Dr. Laurent",
      rating: 4.9,
      category: "tests"
    },
    {
      id: 4,
      title: "Design d'Interfaces Responsives",
      description: "Créez des interfaces qui s'adaptent parfaitement à tous les appareils et tailles d'écran.",
      image: "images/course4.jpg",
      difficulty: "intermediate",
      duration: "5h",
      instructor: "Prof. Martin",
      rating: 4.7,
      category: "design"
    },
    {
      id: 5,
      title: "Animation et Interactions Avancées",
      description: "Explorez les techniques avancées d'animation et d'interaction pour des interfaces modernes.",
      image: "images/course5.jpg",
      difficulty: "advanced",
      duration: "6h",
      instructor: "Dr. Dubois",
      rating: 4.8,
      category: "prog-graphique"
    },
    {
      id: 6,
      title: "Accessibilité et Design Inclusif",
      description: "Apprenez à créer des interfaces accessibles à tous les utilisateurs, quelles que soient leurs capacités.",
      image: "images/course6.jpg",
      difficulty: "intermediate",
      duration: "3h",
      instructor: "Prof. Laurent",
      rating: 4.9,
      category: "design"
    }
  ];

  function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.innerHTML = `
      <div class="course-image">
        <img src="${course.image}" alt="${course.title}">
        <span class="course-difficulty difficulty-${course.difficulty}">
          ${course.difficulty === 'beginner' ? 'Débutant' : 
            course.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
        </span>
        <span class="course-duration">
          <i class="far fa-clock"></i> ${course.duration}
        </span>
      </div>
      <div class="course-content">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-description">${course.description}</p>
        <div class="course-meta">
          <div class="course-instructor">
            <div class="instructor-avatar">${course.instructor.charAt(0)}</div>
            <span class="instructor-name">${course.instructor}</span>
          </div>
          <div class="course-rating">
            <i class="fas fa-star"></i>
            <span>${course.rating}</span>
          </div>
        </div>
        <div class="course-actions">
          <button class="course-enroll">S'inscrire</button>
          <button class="course-preview">
            <i class="fas fa-eye"></i>
            <span>Aperçu</span>
          </button>
        </div>
      </div>
    `;
    return card;
  }

  function displayCourses(courses) {
    const container = document.getElementById('courses-container');
    container.innerHTML = '';
    courses.forEach(course => {
      container.appendChild(createCourseCard(course));
    });
  }

  // Filtrage des cours
  function filterCourses() {
    const difficulty = document.getElementById('niveau-filter').value;
    const category = document.getElementById('categorie-filter').value;
    const duration = document.getElementById('duree-filter').value;
    
    let filteredCourses = coursesData;
    
    if (difficulty) {
      filteredCourses = filteredCourses.filter(course => course.difficulty === difficulty);
    }
    
    if (category !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    if (duration !== 'all') {
      filteredCourses = filteredCourses.filter(course => {
        const hours = parseInt(course.duration);
        if (duration === 'short') return hours < 3;
        if (duration === 'medium') return hours >= 3 && hours <= 5;
        if (duration === 'long') return hours > 5;
        return true;
      });
    }
    
    displayCourses(filteredCourses);
  }

  // Tri des cours
  function sortCourses() {
    const sortBy = document.getElementById('sort-filter').value;
    let sortedCourses = [...coursesData];
    
    switch(sortBy) {
      case 'recent':
        sortedCourses.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        sortedCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        sortedCourses.sort((a, b) => {
          const hoursA = parseInt(a.duration);
          const hoursB = parseInt(b.duration);
          return hoursA - hoursB;
        });
        break;
      case 'rating':
        sortedCourses.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    displayCourses(sortedCourses);
  }

  // Recherche de cours
  function searchCourses() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredCourses = coursesData.filter(course => 
      course.title.toLowerCase().includes(searchTerm) || 
      course.description.toLowerCase().includes(searchTerm)
    );
    
    displayCourses(filteredCourses);
  }

  // Événements
  document.getElementById('niveau-filter').addEventListener('change', filterCourses);
  document.getElementById('categorie-filter').addEventListener('change', filterCourses);
  document.getElementById('duree-filter').addEventListener('change', filterCourses);
  document.getElementById('sort-filter').addEventListener('change', sortCourses);
  document.getElementById('search-input').addEventListener('input', searchCourses);
  document.getElementById('search-button').addEventListener('click', searchCourses);

  // Afficher les cours au chargement
  displayCourses(coursesData);
});