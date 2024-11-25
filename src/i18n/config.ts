import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      language: {
        flag: "🇺🇸",
        name: "English",
      },
      home: {
        title: "Secret Santa Organizer",
        welcome: "Welcome! This tool helps you arrange your holiday gift exchange. Simply add all participants, and we'll help you randomly assign gift-giving pairs.",
        noBackend: "No accounts, no emails, no hassle, all hosted on <githubLink>GitHub Pages</githubLink> with no backend!",
        explanation: "Each person will be randomly assigned someone to give a gift to. You'll receive a unique link for each participant, which you'll have to share however you want (via email, Slack, etc.). [<exampleLink>Example link</exampleLink>]",
        exampleLink: "Example link",
        secretSantaLinks: "Secret Santa Links",
        copySecretLink: "Copy Secret Link",
        shareLinks: "Share each link with the corresponding gift giver only",
        errors: {
          needMoreParticipants: "Need at least 2 participants!",
          invalidPairs: "Couldn't generate valid pairs with the current rules. Please check the rules and try again."
        }
      },
      pairing: {
        title: "Your Secret Santa Assignment",
        hello: "Hello",
        assignedTo: "you are assigned to get a gift for:",
        loading: "Loading...",
        error: "Failed to decrypt the message. The link might be invalid.",
        startYourOwn: "Start a Secret Santa!"
      },
      participants: {
        title: "Participants",
        addPerson: "Add Person",
        generatePairs: "Generate Pairings",
        enterName: "Enter participant name",
        editRules: "Edit rules",
        removeParticipant: "Remove participant",
        rulesCount_one: "{{count}} rule set",
        rulesCount_other: "{{count}} rules set"
      },
      rules: {
        title: "Rules for {{name}}",
        mustBePairedWith: "Must be paired with",
        mustNotBePairedWith: "Must not be paired with",
        selectParticipant: "Select another participant",
        removeRule: "Remove rule",
        addMustRule: "Force a Pairing",
        addMustNotRule: "Prevent a Pairing",
        cancel: "Cancel",
        saveRules: "Save Rules"
      },
      links: {
        title: "Links to Share",
        shareInstructions: "Share each link with the corresponding gift giver only",
        copySecretLink: "Copy Secret Link",
        linkCopied: "Link copied!",
        for: "for"
      }
    }
  },
  fr: {
    translation: {
      language: {
        flag: "🇫🇷",
        name: "Français",
      },
      home: {
        title: "Planificateur de Secret Santa",
        welcome: "Bienvenue ! Cet outil est fait pour vous aider à organiser vos échanges de cadeaux. Ajoutez simplement tous les participants, et nous constituerons aléatoirement les paires.",
        noBackend: "Pas de comptes, pas d'emails, pas de tracas, tout est hébergé sur de simples <githubLink>GitHub Pages</githubLink> !",
        explanation: "Chaque participant se verra attribuer aléatoirement un partenaire. Vous recevrez un lien unique pour chacun, que vous devrez lui partager comme vous le souhaitez (par email, Slack, etc.). [<exampleLink>Exemple de lien</exampleLink>]",
        exampleLink: "Exemple de lien",
        secretSantaLinks: "Liens du Secret Santa",
        copySecretLink: "Copier le Lien Secret",
        shareLinks: "Partagez chaque lien uniquement avec le donneur correspondant",
        errors: {
          needMoreParticipants: "Il faut au moins 2 participants !",
          invalidPairs: "Impossible de générer des paires valides avec les règles actuelles. Veuillez vérifier les règles et réessayer."
        }
      },
      pairing: {
        title: "Votre Partenaire de Secret Santa",
        assignment: "Bienvenue <name/>, vous avez été assigné(e) pour offrir un cadeau à :",
        loading: "Chargement...",
        error: "Échec du décryptage du message. Le lien pourrait être invalide.",
        startYourOwn: "Créez Votre Secret Santa !"
      },
      participants: {
        title: "Participants",
        addPerson: "Ajouter une Personne",
        generatePairs: "Générer les Associations",
        enterName: "Entrez le nom du participant",
        editRules: "Modifier les règles",
        removeParticipant: "Supprimer le participant",
        rulesCount_one: "{{count}} règle définie",
        rulesCount_other: "{{count}} règles définies"
      },
      rules: {
        title: "Règles pour {{name}}",
        mustBePairedWith: "Doit être associé avec",
        mustNotBePairedWith: "Ne doit pas être associé avec",
        selectParticipant: "Sélectionnez un autre participant",
        removeRule: "Supprimer la règle",
        addMustRule: "Forcer une association",
        addMustNotRule: "Exclure une association",
        cancel: "Annuler",
        saveRules: "Enregistrer les Règles"
      },
      links: {
        title: "Liens à Partager",
        shareInstructions: "Partagez chaque lien uniquement avec le donneur correspondant",
        copySecretLink: "Copier le Lien Secret",
        linkCopied: "Lien copié !",
        for: "pour"
      }
    }
  }
};

export const SUPPORTED_LANGUAGES = Object.keys(resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 