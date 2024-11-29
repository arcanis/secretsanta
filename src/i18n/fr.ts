import { Translations } from './config';

export const fr: Translations = {
  language: {
    flag: "🇫🇷",
    name: "Français",
  },
  errors: {
    needMoreParticipants: "Il faut au moins 2 participants !",
    invalidPairs: "Impossible de générer des paires valides avec les règles actuelles. Veuillez vérifier les règles et réessayer.",
    multipleMustRules: "Conflit entre plusieurs règles requérant une association",
    conflictingRules: "Conflit entre une règle requérant une association et une règle excluant cette même association",
    emptyName: "Nom vide",
    duplicateName: "Nom en double : {{name}}",
    invalidRuleFormat: "Format de règle invalide : {{rule}}",
    unknownParticipant: "Participant inconnu dans la règle : {{name}}",
    noValidReceivers: "Aucun receveur valide restant pour ce participant",
    line: "Ligne {{number}}"
  },
  home: {
    vanity: "Projet lancé en hiver 2015 par Maël",
    title: "Planificateur de Secret Santa",
    explanation: [
      "Bienvenue ! Cet outil est fait pour vous aider à organiser vos échanges de cadeaux. Listez simplement vos participants et nous vous constituerons aléatoirement des paires selon les règles que vous aurez définies.",
      "Vous recevrez un lien unique pour chaque participant, que vous devrez lui partager (par email, Slack, etc). [<exampleLink>Exemple de lien</exampleLink>]",
      "Pas de comptes, pas d'emails, pas de tracas, et le tout hébergé sur de simples <githubLink>GitHub Pages</githubLink> !",
    ].map(line => `<p>${line}</p>`).join(''),
    exampleLink: "Exemple de lien",
  },
  pairing: {
    title: "Votre Partenaire de Secret Santa",
    assignment: "Bienvenue, <name/> ! Vous avez été sélectionné(e) pour offrir un cadeau à :",
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
    rulesCount_other: "{{count}} règles définies",
    switchToFormView: "Passer à la vue formulaire",
    switchToTextView: "Passer à la vue texte",
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
    warningParticipantsChanged: "Attention: Les participants ou leurs règles ont été modifiés depuis la dernière génération de ces liens.",
    resetAssignments: "Régénérer les Associations",
    shareInstructions: "Partagez chaque lien uniquement avec le donneur correspondant",
    exportCSV: "Exporter en CSV",
    copySecretLink: "Copier le Lien Secret",
    linkCopied: "Lien copié !",
    for: "pour",
  },
  settings: {
    title: "Paramètres",
    instructions: "Instructions Supplémentaires",
    instructionsPlaceholder: "Par exemple le budget, la date, le lieu...",
    instructionsHelp: "Elles seront affichées à tous les participants sur leur page d'attribution. Restez concis: cette fonction allonge la taille des liens."
  }
};