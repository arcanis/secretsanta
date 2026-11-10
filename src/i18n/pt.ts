export const pt = {
  language: {
    flag: "pt",
    name: "Português",
  },
  errors: {
    needMoreParticipants: "São necessários pelo menos 2 participantes!",
    invalidPairs: "Não foi possível gerar pares válidos com as regras atuais. Por favor, verifique as regras e tente novamente.",
    multipleMustRules: "Foram encontradas múltiplas regras DEVE",
    conflictingRules: "Uso conflituoso de uma regra DEVE e NÃO DEVE",
    emptyName: "Nome vazio",
    duplicateName: "Nome duplicado: {{name}}",
    invalidRuleFormat: "Formato de regra inválido: {{rule}}",
    unknownParticipant: "Participante desconhecido na regra: {{name}}",
    noValidReceivers: "Não restam destinatários válidos para este participante",
    line: "Linha {{number}}"
  },
  home: {
    vanity: "Projeto iniciado no inverno de 2015 por Maël",
    sponsor: "Apoie-me no GitHub",
    title: "Planificador de Pai Natal Secreto",
    explanation: [
      "Bem-vindo! Esta ferramenta vai ajudá-lo a organizar as suas trocas de presentes de Natal. Basta criar a lista com todos os participantes e nós atribuiremos os pares aleatoriamente de acordo com as regras que definir.",
      "Receberá um link exclusivo para cada participante, o qual terá de partilhar por sua conta (via e-mail, Slack, etc.). [<exampleLink>Link de exemplo</exampleLink>]",
      "Sem contas, sem e-mails, sem complicações, e tudo alojado no <githubLink>GitHub Pages</githubLink> sem backend!",
    ].map(line => `<p>${line}</p>`).join(''),
    exampleLink: "Link de exemplo",
  },
  pairing: {
    title: "A sua atribuição do Pai Natal Secreto",
    assignment: "Bem-vindo(a), <name/>! Foi escolhido(a) para oferecer um presente a:",
    loading: "A carregar...",
    error: "Falha ao desencriptar a mensagem. O link pode ser inválido.",
    startYourOwn: "Iniciar um Pai Natal Secreto!"
  },
  participants: {
    title: "Participantes",
    generationWarning: "Importante: Qualquer alteração feita na lista de participantes ou nas definições exigirá a criação de novos pares. Os links existentes não serão modificados retroativamente.",
    addPerson: "Adicionar Pessoa",
    generatePairs: "Gerar Pares",
    enterName: "Introduza o nome do participante",
    editRules: "Editar regras",
    removeParticipant: "Remover participante",
    rulesCount_one: "{{count}} regra definida",
    rulesCount_other: "{{count}} regras definidas",
    switchToFormView: "Mudar para vista de formulário",
    switchToTextView: "Mudar para vista de texto"
  },
  rules: {
    title: "Regras para {{name}}",
    mustBePairedWith: "Deve fazer par com",
    mustNotBePairedWith: "Não deve fazer par com",
    selectParticipant: "Selecione outro participante",
    removeRule: "Remover regra",
    addMustRule: "Forçar um Par",
    addMustNotRule: "Evitar um Par",
    cancel: "Cancelar",
    saveRules: "Guardar Regras",
    hintLabel: 'Sugestão de Presente',
    hintPlaceholder: 'Introduza uma sugestão sobre preferências de presentes (opcional)',
  },
  links: {
    title: "Links para Partilhar",
    warningParticipantsChanged: "Aviso: Os participantes ou as regras foram alterados desde a última vez que estes links foram gerados.",
    resetAssignments: "Regerar Pares",
    shareInstructions: "Partilhe estes links apenas com o respetivo dador do presente",
    exportCSV: "Exportar como CSV",
    copySecretLink: "Copiar Link Secreto",
    linkCopied: "Adicionado à área de transferência!",
    for: "para"
  },
  settings: {
    title: "Definições",
    instructions: "Instruções Adicionais",
    instructionsPlaceholder: "ex: orçamento, data, local...",
    instructionsHelp: "Estas serão mostradas a todos os participantes na sua página de atribuição. Mantenha-as curtas: isso aumenta o tamanho dos links."
  },
};