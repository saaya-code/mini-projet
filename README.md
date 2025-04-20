# UniDefense - Système de Planification des Soutenances

![UniDefense Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9a45-KXV32g7AcuYFtRqbas8BMG2Nansr6g&s)

UniDefense est une application web complète pour la gestion et la planification automatique des soutenances de fin d'études universitaires. Elle permet aux administrateurs, professeurs et étudiants de gérer efficacement tout le processus de soutenance, depuis l'attribution des projets jusqu'à la planification des défenses.

## 🌟 Fonctionnalités

### Pour les Administrateurs
- Gestion complète des professeurs, étudiants, projets et salles
- Génération automatique des plannings de soutenance (jour unique ou période)
- Importation de données depuis des fichiers Excel ou CSV
- Tableau de bord avec statistiques et activités récentes
- Gestion des utilisateurs et des rôles

### Pour les Professeurs
- Gestion de leur profil et disponibilités
- Visualisation des soutenances où ils sont impliqués (superviseur ou jury)
- Système de notifications pour les nouvelles soutenances
- Communication avec les étudiants

### Pour les Étudiants
- Consultation de leur profil et projet
- Visualisation des détails de leur soutenance
- Système de notifications pour les mises à jour
- Communication avec leur superviseur

## 🚀 Technologies Utilisées

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB
- **Authentification**: NextAuth.js
- **Emails**: Nodemailer
- **Importation de données**: xlsx

## 📋 Prérequis

- Node.js 18+
- MongoDB
- Serveur SMTP pour l'envoi d'emails

## 🛠️ Installation

1. Clonez le dépôt
   ```bash
   git clone https://github.com/votre-utilisateur/unidefense.git
   cd unidefense
   ```

2. Installez les dépendances
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement
   ```bash
   cp .env.local.example .env.local
   # Modifiez les valeurs dans .env.local selon votre configuration
   ```

4. Lancez l'application en mode développement
   ```bash
   npm run dev
   ```

5. Accédez à l'application à l'adresse [http://localhost:3000](http://localhost:3000)

## 🧠 Algorithme de Génération des Plannings

L'algorithme de génération des plannings est au cœur du système UniDefense. Il prend en compte plusieurs contraintes pour créer un planning optimal :

### Contraintes prises en compte
- **Disponibilité des professeurs**: Chaque professeur indique ses créneaux de disponibilité
- **Disponibilité des salles**: Les salles doivent être disponibles et adaptées
- **Répartition des rôles**: Un professeur ne peut pas être à la fois superviseur et membre du jury pour un même étudiant
- **Équilibre des charges**: Répartition équitable des soutenances entre les professeurs
- **Contraintes temporelles**: Respect des pauses et des horaires de travail

### Fonctionnement de l'algorithme
1. **Préparation**: Collecte des données (projets, professeurs, salles, disponibilités)
2. **Planification jour par jour**:
   - Pour chaque jour de la période sélectionnée
   - Pour chaque projet non encore planifié
   - Pour chaque créneau horaire disponible
   - Pour chaque salle disponible
   - Vérification de la disponibilité du superviseur
   - Recherche de deux professeurs disponibles pour le jury
   - Création de la soutenance si toutes les conditions sont remplies
3. **Notifications**: Envoi de notifications à toutes les personnes concernées
4. **Rapport**: Génération d'un rapport sur les soutenances planifiées et non planifiées

### Mode multi-jours
L'algorithme peut fonctionner sur une période de plusieurs jours, ce qui permet de répartir les soutenances de manière optimale sur une semaine ou plus. Dans ce mode, il:
- Exclut automatiquement les week-ends
- Répartit équitablement les soutenances sur les jours disponibles
- S'arrête dès que tous les projets sont planifiés

## 📊 Structure de la Base de Données

Le système utilise MongoDB avec les modèles suivants:

- **User**: Utilisateurs du système (admin, professeur, étudiant)
- **Professor**: Informations sur les professeurs et leurs disponibilités
- **Student**: Informations sur les étudiants
- **Project**: Projets de fin d'études avec liens vers l'étudiant et le superviseur
- **Room**: Salles disponibles pour les soutenances
- **Defense**: Soutenances planifiées avec tous les détails
- **Notification**: Système de notifications pour les utilisateurs

## 🔒 Sécurité

- Authentification sécurisée avec NextAuth.js
- Hachage des mots de passe avec bcrypt
- Contrôle d'accès basé sur les rôles
- Protection contre les injections NoSQL
- Validation des données côté serveur

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les appareils:
- Ordinateurs de bureau
- Tablettes
- Smartphones

## 🌐 Déploiement

L'application peut être déployée sur:
- **Vercel**: Déploiement recommandé pour sa simplicité et son intégration avec Next.js
- **Netlify**: Autre option populaire pour les applications React



## 🔄 Maintenance et Mises à Jour

- Sauvegardez régulièrement la base de données
- Mettez à jour les dépendances pour des raisons de sécurité
- Vérifiez les logs pour détecter d'éventuels problèmes
- Planifiez des sauvegardes automatiques

## 📞 Support

Pour toute question ou assistance:
- Créez une issue sur GitHub
- Contactez l'équipe de développement à support@unidefense.com

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🙏 Remerciements

- Tous les contributeurs au projet
- L'université pour son soutien
- La communauté open-source pour les outils et bibliothèques utilisés

