-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 23 mai 2026 à 04:10
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cabinet_medical`
--

-- --------------------------------------------------------

--
-- Structure de la table `acte`
--

CREATE TABLE `acte` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `libelle` varchar(255) DEFAULT NULL,
  `tarif` double DEFAULT NULL,
  `secteur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `administrateur`
--

CREATE TABLE `administrateur` (
  `id_utilisateur` int(11) NOT NULL,
  `totpSecret` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `id` int(11) NOT NULL,
  `note` int(11) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `id_patient` int(11) DEFAULT NULL,
  `id_medecin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `compterendu`
--

CREATE TABLE `compterendu` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `contenu` text DEFAULT NULL,
  `modeleUtilise` varchar(100) DEFAULT NULL,
  `id_dossier_medical` int(11) DEFAULT NULL,
  `id_rendezvous` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `creneauhoraire`
--

CREATE TABLE `creneauhoraire` (
  `id` int(11) NOT NULL,
  `debut` datetime DEFAULT NULL,
  `fin` datetime DEFAULT NULL,
  `duree` int(11) DEFAULT NULL,
  `estReserve` tinyint(1) DEFAULT NULL,
  `id_disponibilite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `disponibilite`
--

CREATE TABLE `disponibilite` (
  `id` int(11) NOT NULL,
  `jour` varchar(20) DEFAULT NULL,
  `heureDebut` time DEFAULT NULL,
  `heureFin` time DEFAULT NULL,
  `estConge` tinyint(1) DEFAULT NULL,
  `id_medecin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `documentmedical`
--

CREATE TABLE `documentmedical` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `contenu` text DEFAULT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `tailleMo` double DEFAULT NULL,
  `dateAjout` date DEFAULT NULL,
  `id_dossier_medical` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `dossiermedical`
--

CREATE TABLE `dossiermedical` (
  `id` int(11) NOT NULL,
  `dateCreation` date DEFAULT NULL,
  `date` date DEFAULT NULL,
  `id_patient` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `montantTotal` double DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `tauxNoShow` double DEFAULT NULL,
  `id_rendezvous` int(11) DEFAULT NULL,
  `id_secretaire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `logaudit`
--

CREATE TABLE `logaudit` (
  `id` int(11) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `dateHeure` datetime DEFAULT NULL,
  `ipAdresse` varchar(45) DEFAULT NULL,
  `utilisateur` varchar(255) DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `medecin`
--

CREATE TABLE `medecin` (
  `id_utilisateur` int(11) NOT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `numeroOrdre` varchar(50) DEFAULT NULL,
  `tarif` double DEFAULT NULL,
  `secteur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `medicament`
--

CREATE TABLE `medicament` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `posologie` varchar(255) DEFAULT NULL,
  `duree` varchar(100) DEFAULT NULL,
  `id_ordonnance` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `message` text DEFAULT NULL,
  `dateEnvoi` datetime DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `id_rendezvous` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ordonnance`
--

CREATE TABLE `ordonnance` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `dureeValidite` int(11) DEFAULT NULL,
  `id_dossier_medical` int(11) DEFAULT NULL,
  `id_medecin` int(11) DEFAULT NULL,
  `id_rendezvous` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `patient`
--

CREATE TABLE `patient` (
  `id_utilisateur` int(11) NOT NULL,
  `numeroSecu` varchar(50) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `oauthProvider` varchar(100) DEFAULT NULL,
  `id_tiers_rattache` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rapport`
--

CREATE TABLE `rapport` (
  `id` int(11) NOT NULL,
  `periode` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `dateGeneration` date DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rendezvous`
--

CREATE TABLE `rendezvous` (
  `id` int(11) NOT NULL,
  `dateHeure` datetime DEFAULT NULL,
  `duree` int(11) DEFAULT NULL,
  `motif` varchar(255) DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `estPourTiers` tinyint(1) DEFAULT NULL,
  `id_dossier_medical` int(11) DEFAULT NULL,
  `id_patient` int(11) DEFAULT NULL,
  `id_creneau` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `rendezvous_acte`
--

CREATE TABLE `rendezvous_acte` (
  `id_rendezvous` int(11) NOT NULL,
  `id_acte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `secretaire`
--

CREATE TABLE `secretaire` (
  `id_utilisateur` int(11) NOT NULL,
  `matricule` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `signalement`
--

CREATE TABLE `signalement` (
  `id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `id_patient` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `statistiques`
--

CREATE TABLE `statistiques` (
  `id` int(11) NOT NULL,
  `tauxOccupationSalles` double DEFAULT NULL,
  `nbConsultations` int(11) DEFAULT NULL,
  `revenus` double DEFAULT NULL,
  `tauxNoShow` double DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `motDePasse` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `dateCreation` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `acte`
--
ALTER TABLE `acte`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `administrateur`
--
ALTER TABLE `administrateur`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_patient` (`id_patient`),
  ADD KEY `id_medecin` (`id_medecin`);

--
-- Index pour la table `compterendu`
--
ALTER TABLE `compterendu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dossier_medical` (`id_dossier_medical`),
  ADD KEY `id_rendezvous` (`id_rendezvous`);

--
-- Index pour la table `creneauhoraire`
--
ALTER TABLE `creneauhoraire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_disponibilite` (`id_disponibilite`);

--
-- Index pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_medecin` (`id_medecin`);

--
-- Index pour la table `documentmedical`
--
ALTER TABLE `documentmedical`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dossier_medical` (`id_dossier_medical`);

--
-- Index pour la table `dossiermedical`
--
ALTER TABLE `dossiermedical`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_patient` (`id_patient`);

--
-- Index pour la table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rendezvous` (`id_rendezvous`),
  ADD KEY `id_secretaire` (`id_secretaire`);

--
-- Index pour la table `logaudit`
--
ALTER TABLE `logaudit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Index pour la table `medecin`
--
ALTER TABLE `medecin`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `medicament`
--
ALTER TABLE `medicament`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ordonnance` (`id_ordonnance`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rendezvous` (`id_rendezvous`);

--
-- Index pour la table `ordonnance`
--
ALTER TABLE `ordonnance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dossier_medical` (`id_dossier_medical`),
  ADD KEY `id_medecin` (`id_medecin`),
  ADD KEY `id_rendezvous` (`id_rendezvous`);

--
-- Index pour la table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `rapport`
--
ALTER TABLE `rapport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Index pour la table `rendezvous`
--
ALTER TABLE `rendezvous`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dossier_medical` (`id_dossier_medical`),
  ADD KEY `id_patient` (`id_patient`),
  ADD KEY `id_creneau` (`id_creneau`);

--
-- Index pour la table `rendezvous_acte`
--
ALTER TABLE `rendezvous_acte`
  ADD PRIMARY KEY (`id_rendezvous`,`id_acte`),
  ADD KEY `id_acte` (`id_acte`);

--
-- Index pour la table `secretaire`
--
ALTER TABLE `secretaire`
  ADD PRIMARY KEY (`id_utilisateur`);

--
-- Index pour la table `signalement`
--
ALTER TABLE `signalement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_patient` (`id_patient`);

--
-- Index pour la table `statistiques`
--
ALTER TABLE `statistiques`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `acte`
--
ALTER TABLE `acte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `avis`
--
ALTER TABLE `avis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `compterendu`
--
ALTER TABLE `compterendu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `creneauhoraire`
--
ALTER TABLE `creneauhoraire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `documentmedical`
--
ALTER TABLE `documentmedical`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `dossiermedical`
--
ALTER TABLE `dossiermedical`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `facture`
--
ALTER TABLE `facture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `logaudit`
--
ALTER TABLE `logaudit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `medicament`
--
ALTER TABLE `medicament`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ordonnance`
--
ALTER TABLE `ordonnance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `rapport`
--
ALTER TABLE `rapport`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `rendezvous`
--
ALTER TABLE `rendezvous`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `signalement`
--
ALTER TABLE `signalement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `statistiques`
--
ALTER TABLE `statistiques`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `administrateur`
--
ALTER TABLE `administrateur`
  ADD CONSTRAINT `administrateur_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `avis_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_utilisateur`),
  ADD CONSTRAINT `avis_ibfk_2` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_utilisateur`);

--
-- Contraintes pour la table `compterendu`
--
ALTER TABLE `compterendu`
  ADD CONSTRAINT `compterendu_ibfk_1` FOREIGN KEY (`id_dossier_medical`) REFERENCES `dossiermedical` (`id`),
  ADD CONSTRAINT `compterendu_ibfk_2` FOREIGN KEY (`id_rendezvous`) REFERENCES `rendezvous` (`id`);

--
-- Contraintes pour la table `creneauhoraire`
--
ALTER TABLE `creneauhoraire`
  ADD CONSTRAINT `creneauhoraire_ibfk_1` FOREIGN KEY (`id_disponibilite`) REFERENCES `disponibilite` (`id`);

--
-- Contraintes pour la table `disponibilite`
--
ALTER TABLE `disponibilite`
  ADD CONSTRAINT `disponibilite_ibfk_1` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_utilisateur`);

--
-- Contraintes pour la table `documentmedical`
--
ALTER TABLE `documentmedical`
  ADD CONSTRAINT `documentmedical_ibfk_1` FOREIGN KEY (`id_dossier_medical`) REFERENCES `dossiermedical` (`id`);

--
-- Contraintes pour la table `dossiermedical`
--
ALTER TABLE `dossiermedical`
  ADD CONSTRAINT `dossiermedical_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_utilisateur`);

--
-- Contraintes pour la table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`id_rendezvous`) REFERENCES `rendezvous` (`id`),
  ADD CONSTRAINT `facture_ibfk_2` FOREIGN KEY (`id_secretaire`) REFERENCES `secretaire` (`id_utilisateur`);

--
-- Contraintes pour la table `logaudit`
--
ALTER TABLE `logaudit`
  ADD CONSTRAINT `logaudit_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `administrateur` (`id_utilisateur`);

--
-- Contraintes pour la table `medecin`
--
ALTER TABLE `medecin`
  ADD CONSTRAINT `medecin_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `medicament`
--
ALTER TABLE `medicament`
  ADD CONSTRAINT `medicament_ibfk_1` FOREIGN KEY (`id_ordonnance`) REFERENCES `ordonnance` (`id`);

--
-- Contraintes pour la table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`id_rendezvous`) REFERENCES `rendezvous` (`id`);

--
-- Contraintes pour la table `ordonnance`
--
ALTER TABLE `ordonnance`
  ADD CONSTRAINT `ordonnance_ibfk_1` FOREIGN KEY (`id_dossier_medical`) REFERENCES `dossiermedical` (`id`),
  ADD CONSTRAINT `ordonnance_ibfk_2` FOREIGN KEY (`id_medecin`) REFERENCES `medecin` (`id_utilisateur`),
  ADD CONSTRAINT `ordonnance_ibfk_3` FOREIGN KEY (`id_rendezvous`) REFERENCES `rendezvous` (`id`);

--
-- Contraintes pour la table `patient`
--
ALTER TABLE `patient`
  ADD CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `rapport`
--
ALTER TABLE `rapport`
  ADD CONSTRAINT `rapport_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `administrateur` (`id_utilisateur`);

--
-- Contraintes pour la table `rendezvous`
--
ALTER TABLE `rendezvous`
  ADD CONSTRAINT `rendezvous_ibfk_1` FOREIGN KEY (`id_dossier_medical`) REFERENCES `dossiermedical` (`id`),
  ADD CONSTRAINT `rendezvous_ibfk_2` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_utilisateur`),
  ADD CONSTRAINT `rendezvous_ibfk_3` FOREIGN KEY (`id_creneau`) REFERENCES `creneauhoraire` (`id`);

--
-- Contraintes pour la table `rendezvous_acte`
--
ALTER TABLE `rendezvous_acte`
  ADD CONSTRAINT `rendezvous_acte_ibfk_1` FOREIGN KEY (`id_rendezvous`) REFERENCES `rendezvous` (`id`),
  ADD CONSTRAINT `rendezvous_acte_ibfk_2` FOREIGN KEY (`id_acte`) REFERENCES `acte` (`id`);

--
-- Contraintes pour la table `secretaire`
--
ALTER TABLE `secretaire`
  ADD CONSTRAINT `secretaire_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`);

--
-- Contraintes pour la table `signalement`
--
ALTER TABLE `signalement`
  ADD CONSTRAINT `signalement_ibfk_1` FOREIGN KEY (`id_patient`) REFERENCES `patient` (`id_utilisateur`);

--
-- Contraintes pour la table `statistiques`
--
ALTER TABLE `statistiques`
  ADD CONSTRAINT `statistiques_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `administrateur` (`id_utilisateur`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
