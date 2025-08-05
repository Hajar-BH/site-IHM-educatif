/**
 * Serveur d'authentification pour IHM Explorer
 * Ce serveur gère l'authentification et fournit les APIs nécessaires
 */

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Base de données utilisateurs en mémoire (à remplacer par une vraie BDD en production)
const users = new Map();

// Ajouter un utilisateur de test
const testPasswordData = hashPassword('12345ihm');
users.set('boumezganehajar@gmail.com', {
  email: 'boumezganehajar@gmail.com',
  username: 'Hajar Boumezgane',
  firstname: 'Hajar',
  lastname: 'Boumezgane',
  password: {
    hash: testPasswordData.hash,
    salt: testPasswordData.salt
  },
  avatar: 'https://ui-avatars.com/api/?name=Hajar+Boumezgane&background=cccccc&color=222222&v=2'
});

// Fonction pour hacher les mots de passe
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// Fonction pour vérifier un mot de passe
function verifyPassword(password, hash, salt) {
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashedPassword;
}

// Configuration de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Configuration de session
app.use(session({
  secret: 'votre_clé_secrète',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Configuration de Passport
app.use(passport.initialize());
app.use(passport.session());

// Stratégie d'authentification locale
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    const user = users.get(email);
    
    if (!user) {
      return done(null, false, { message: 'Email ou mot de passe incorrect' });
    }
    
    if (!verifyPassword(password, user.password.hash, user.password.salt)) {
      return done(null, false, { message: 'Email ou mot de passe incorrect' });
    }
    
    return done(null, user);
  }
));

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  const user = users.get(email);
  done(null, user);
});

// Routes d'API
app.post('/api/register', (req, res) => {
  const { email, password, username, firstname, lastname } = req.body;
  
  if (users.has(email)) {
    return res.status(400).json({ error: 'Cet email est déjà utilisé' });
  }
  
  const passwordData = hashPassword(password);
  
  // Création d'un nouvel utilisateur
  const user = {
    email,
    username: username || email.split('@')[0],
    firstname: req.body.firstname || '',
    lastname: req.body.lastname || '',
    password: {
      hash: passwordData.hash,
      salt: passwordData.salt
    },
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username || email.split('@')[0])}&background=cccccc&color=222222&v=2`
  };
  
  users.set(email, user);
  
  // Connecter l'utilisateur automatiquement après inscription
  req.login(user, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
    
    const userResponse = { ...user };
    delete userResponse.password; // Ne pas renvoyer le mot de passe
    
    return res.status(201).json(userResponse);
  });
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ error: info.message || 'Authentification échouée' });
    }
    
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      const userResponse = { ...user };
      delete userResponse.password; // Ne pas renvoyer le mot de passe
      
      return res.json(userResponse);
    });
  })(req, res, next);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
    res.status(200).json({ message: 'Déconnecté avec succès' });
  });
});

app.get('/api/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  const userResponse = { ...req.user };
  delete userResponse.password; // Ne pas renvoyer le mot de passe
  
  res.json(userResponse);
});

app.get('/api/notifications', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  // Exemple de notifications
  const notifications = [
    {
      id: 1,
      title: "Nouveau message",
      message: "Vous avez reçu un nouveau message de Jean Dupont",
      date: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      title: "Commande confirmée",
      message: "Votre commande #12345 a été confirmée",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 3,
      title: "Compte vérifié",
      message: "Votre compte a été vérifié avec succès",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true
    }
  ];
  
  res.json(notifications);
});

// Assurer que toutes les autres routes sont gérées par le frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});