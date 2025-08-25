/**
 * IHM Explorer - Script d'authentification
 * Gère les interactions avec l'API d'authentification et les mises à jour de l'interface utilisateur
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM chargé - Initialisation de auth.js');
  
  // Récupérer les éléments de la navbar pour modification dynamique
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions) {
    console.log('Élément .header-actions non trouvé');
  }
  
  const originalHeaderActions = headerActions ? headerActions.innerHTML : '';
  
  // Vérifier si l'utilisateur est connecté au chargement de la page
  checkAuthStatus();
  
  // Déterminer la page actuelle
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('connexion.html');
  
  const loginForm = document.getElementById('login-form');
  if (isLoginPage && loginForm) {
    console.log('Formulaire de connexion trouvé - Configuration en cours');
    // Intercepter le formulaire de connexion
    setupLoginForm();
  }
  
  const signupForm = document.getElementById('signup-form');
  if (isLoginPage && signupForm) {
    console.log('Formulaire d\'inscription trouvé - Configuration en cours');
    // Intercepter le formulaire d'inscription
    setupSignupForm();
  }
  
  /**
   * Vérifie le statut d'authentification de l'utilisateur
   */
  function checkAuthStatus() {
    fetch('/api/user')
      .then(response => {
        if (!response.ok) {
          throw new Error('Non authentifié');
        }
        return response.json();
      })
      .then(user => {
        console.log('Utilisateur connecté:', user);
        // L'utilisateur est connecté, mettre à jour l'interface
        updateUIForAuthenticatedUser(user);
      })
      .catch(error => {
        console.log('Non authentifié:', error.message);
        // L'utilisateur n'est pas connecté, s'assurer que l'interface est en mode déconnecté
        updateUIForUnauthenticatedUser();
      });
  }
  
  /**
   * Met à jour l'interface pour un utilisateur authentifié
   */
  function updateUIForAuthenticatedUser(user) {
    // Si nous sommes sur la page de connexion, rediriger vers l'accueil
    if (window.location.pathname.includes('connexion.html')) {
      window.location.href = 'index.html';
      return;
    }
    
    // Mettre à jour les actions de l'en-tête si elles existent
    if (headerActions) {
      headerActions.innerHTML = `
        <button class="theme-toggle" aria-label="Basculer mode sombre" id="theme-toggle">
          <i class="fas fa-moon" id="theme-icon"></i>
        </button>
        <div class="user-menu">
          <div class="notifications-dropdown">
            <button class="notification-bell" id="notification-bell" aria-label="Notifications">
              <i class="fas fa-bell"></i>
              <span class="notification-count" id="notification-count">0</span>
            </button>
            <div class="notifications-panel" id="notifications-panel">
              <div class="notifications-header">
                <h3>Notifications</h3>
                <button class="mark-all-read" id="mark-all-read">Tout marquer comme lu</button>
              </div>
              <div class="notifications-list" id="notifications-list">
                <div class="notification-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  <p>Chargement des notifications...</p>
                </div>
              </div>
            </div>
          </div>
          <div class="user-dropdown">
            <button class="user-avatar" aria-label="Menu utilisateur" id="user-menu-button">
              <img src="${user.avatar}" alt="${user.username}" />
            </button>
            <div class="user-dropdown-menu" id="user-dropdown-menu">
              <div class="user-info">
                <img src="${user.avatar}" alt="${user.username}" />
                <div>
                  <strong>${user.username}</strong>
                  <span>${user.email}</span>
                </div>
              </div>
              <a href="#" class="dropdown-item"><i class="fas fa-user-circle"></i> Mon profil</a>
              <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Paramètres</a>
              <hr>
              <button id="logout-button" class="dropdown-item"><i class="fas fa-sign-out-alt"></i> Déconnexion</button>
            </div>
          </div>
        </div>
        <button class="menu-toggle" aria-label="Menu mobile">
          <span></span>
          <span></span>
          <span></span>
        </button>
      `;
      
      // Initialiser le thème
      const themeToggle = document.getElementById('theme-toggle');
      const themeIcon = document.getElementById('theme-icon');
      
      // Charger le thème sauvegardé
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
      
      // Ajouter l'événement de clic pour basculer le thème
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
          localStorage.setItem('theme', 'dark');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
          localStorage.setItem('theme', 'light');
        }
      });
      
      // Initialiser les interactions pour les menus déroulants
      initializeDropdowns();
      
      // Ajouter un gestionnaire d'événements pour la déconnexion
      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
      }
      
      // Charger les notifications
      loadNotifications();
    }
  }
  
  /**
   * Met à jour l'interface pour un utilisateur non authentifié
   */
  function updateUIForUnauthenticatedUser() {
    // Si headerActions existe et a été modifié, restaurer l'original
    if (headerActions && !headerActions.querySelector('.login-btn')) {
      headerActions.innerHTML = originalHeaderActions;
      
      // Réinitialiser le thème
      const themeIcon = document.getElementById('theme-icon');
      if (themeIcon) {
        if (document.body.classList.contains('dark-theme')) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        } else {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      }
    }
  }
  
  /**
   * Initialise les menus déroulants
   */
  function initializeDropdowns() {
    // Gestionnaire pour le menu utilisateur
    const userMenuButton = document.getElementById('user-menu-button');
    // Vérifier si le bouton existe
    if (!userMenuButton) {
      return; // Sortir si les éléments n'existent pas
    }
    
    const userDropdownMenu = document.getElementById('user-dropdown-menu');
    if (!userDropdownMenu) {
      return;
    }
    
    if (userMenuButton && userDropdownMenu) {
      userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('active');
        
        // Fermer le panneau de notifications s'il est ouvert
        const notificationsPanel = document.getElementById('notifications-panel');
        if (notificationsPanel && notificationsPanel.classList.contains('active')) {
          notificationsPanel.classList.remove('active');
        }
      });
    }
    
    // Gestionnaire pour les notifications
    const notificationBell = document.getElementById('notification-bell');
    if (!notificationBell) {
      // Sortir de la fonction s'il n'y a pas de bouton de notification
      return;
    }
    
    const notificationsPanel = document.getElementById('notifications-panel');
    if (!notificationsPanel) {
      return;
    }
    
    if (notificationBell && notificationsPanel) {
      notificationBell.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsPanel.classList.toggle('active');
        
        // Fermer le menu utilisateur s'il est ouvert
        if (userDropdownMenu && userDropdownMenu.classList.contains('active')) {
          userDropdownMenu.classList.remove('active');
        }
      });
    }
    
    // Fermer les menus lors d'un clic à l'extérieur
    // Utiliser une fonction séparée pour l'écouteur d'événement
    const handleOutsideClick = function(e) {
      if (userDropdownMenu && userMenuButton && userDropdownMenu.classList.contains('active') &&
          !userMenuButton.contains(e.target) && !userDropdownMenu.contains(e.target)) {
        userDropdownMenu.classList.remove('active');
      }
      
      if (notificationsPanel && notificationBell && notificationsPanel.classList.contains('active') &&
          !notificationBell.contains(e.target) && !notificationsPanel.contains(e.target)) {
        notificationsPanel.classList.remove('active');
      }
    };
    
    // Supprimer l'ancien écouteur s'il existe (évite les doublons)
    document.removeEventListener('click', handleOutsideClick);
    // Ajouter le nouvel écouteur
    document.addEventListener('click', handleOutsideClick);
    
    // Marquer toutes les notifications comme lues
    const markAllReadButton = document.getElementById('mark-all-read');
    if (markAllReadButton) {
      markAllReadButton.addEventListener('click', () => {
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
          item.classList.remove('unread');
        });
        
        // Mettre à jour le compteur
        updateNotificationCount();
      });
    }
  }
  
  /**
   * Charge les notifications depuis l'API
   */
  function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    const notificationCount = document.getElementById('notification-count');
    
    if (!notificationsList) return;
    
    fetch('/api/notifications')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des notifications');
        }
        return response.json();
      })
      .then(notifications => {
        notificationsList.innerHTML = '';
        
        if (notifications.length === 0) {
          notificationsList.innerHTML = `
            <div class="notification-empty">
              <i class="fas fa-check-circle"></i>
              <p>Aucune notification pour le moment</p>
            </div>
          `;
          notificationCount.textContent = '0';
          return;
        }
        
        // Afficher les notifications
        notifications.forEach(notification => {
          const date = new Date(notification.date);
          const formattedDate = formatDate(date);
          
          notificationsList.innerHTML += `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
              <div class="notification-icon">
                <i class="fas fa-bell"></i>
              </div>
              <div class="notification-content">
                <div class="notification-header">
                  <h4>${notification.title}</h4>
                  <span class="notification-time">${formattedDate}</span>
                </div>
                <p>${notification.message}</p>
              </div>
              <button class="notification-mark-read" aria-label="Marquer comme lu">
                <i class="fas fa-check"></i>
              </button>
            </div>
          `;
        });
        
        // Ajouter des écouteurs pour marquer comme lu
        const notificationMarkReadButtons = document.querySelectorAll('.notification-mark-read');
        if (notificationMarkReadButtons && notificationMarkReadButtons.length > 0) {
          notificationMarkReadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
              const notificationItem = e.currentTarget.closest('.notification-item');
              if (notificationItem) {
                notificationItem.classList.remove('unread');
                
                // Mettre à jour le compteur
                updateNotificationCount();
              }
            });
          });
        }
        
        // Mettre à jour le compteur de notifications
        updateNotificationCount();
      })
      .catch(error => {
        console.error('Erreur:', error);
        notificationsList.innerHTML = `
          <div class="notification-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Impossible de charger les notifications</p>
          </div>
        `;
      });
  }
  
  /**
   * Met à jour le compteur de notifications non lues
   */
  function updateNotificationCount() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread').length;
    const notificationCount = document.getElementById('notification-count');
    
    if (notificationCount) {
      notificationCount.textContent = unreadNotifications;
      
      if (unreadNotifications === 0) {
        notificationCount.style.display = 'none';
      } else {
        notificationCount.style.display = 'flex';
      }
    }
  }
  
  /**
   * Formate une date pour l'affichage des notifications
   */
  function formatDate(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} min`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Il y a ${diffInHours} h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Il y a ${diffInDays} j`;
    }
    
    // Format: JJ/MM/AAAA
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  /**
   * Configure le formulaire de connexion
   */
  function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Animation du bouton
        const loginButton = document.querySelector('.login-button');
        if (!loginButton) {
          console.error('Bouton de connexion non trouvé');
          return;
        }
        
        const originalButtonText = loginButton.innerHTML;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        
        // Envoi des données au serveur
        fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Identifiants incorrects');
          }
          return response.json();
        })
        .then(user => {
          // Connexion réussie
          loginButton.innerHTML = '<i class="fas fa-check"></i> Connecté!';
          loginButton.style.backgroundColor = 'var(--green)';
          
          // Redirection après un délai
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        })
        .catch(error => {
          // Échec de la connexion
          loginButton.innerHTML = 'Se connecter';
          loginButton.style.backgroundColor = '';
          
          // Afficher une erreur
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-alert';
          errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
          
          loginForm.prepend(errorMessage);
          
          // Supprimer le message d'erreur après 5 secondes
          setTimeout(() => {
            errorMessage.remove();
          }, 5000);
        });
      });
    }
  }
  
  /**
   * Configure le formulaire d'inscription
   */
  function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        // Créer un nom d'utilisateur à partir du prénom et du nom
        const username = `${firstname} ${lastname}`;
        
        // Animation du bouton
        const signupButton = document.querySelector('.signup-button');
        if (!signupButton) {
          console.error('Bouton d\'inscription non trouvé');
          return;
        }
        
        signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
        
        // Envoi des données au serveur
        fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password, firstname, lastname })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de l\'inscription');
          }
          return response.json();
        })
        .then(user => {
          // Inscription réussie
          signupButton.innerHTML = '<i class="fas fa-check"></i> Inscrit!';
          signupButton.style.backgroundColor = 'var(--green)';
          
          // Redirection après un délai
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        })
        .catch(error => {
          // Échec de l'inscription
          signupButton.innerHTML = 'S\'inscrire';
          signupButton.style.backgroundColor = '';
          
          // Afficher une erreur
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error-alert';
          errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
          
          signupForm.prepend(errorMessage);
          
          // Supprimer le message d'erreur après 5 secondes
          setTimeout(() => {
            errorMessage.remove();
          }, 5000);
        });
      });
    }
  }
  
  /**
   * Gère la déconnexion de l'utilisateur
   */
  function handleLogout() {
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la déconnexion');
      }
      
      // Retour à l'état non authentifié
      updateUIForUnauthenticatedUser();
      
      // Redirection vers la page d'accueil
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
  }
});