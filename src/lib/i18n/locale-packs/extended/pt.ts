/** R?le : Pack i18n typ? Pt : traductions explicites pour l?interface bilingue. */
import type { ExtendedUiKey } from '../../ui-extended';

export const EXTENDED_PT: Partial<Record<ExtendedUiKey, string>> = {
	'home.welcome.line1': 'O Accessible não faz diagnósticos.',
	'home.welcome.line2': 'O Accessible ajuda-o a reconhecer as suas necessidades.',
	'home.welcome.line3': 'O Accessible ajuda-o a experimentar várias definições.',
	'home.welcome.line4': 'O Accessible ajuda-o, se necessário, a preparar uma consulta.',
	'common.readAloud': 'Ler em voz alta',
	'common.internetOn': 'Internet ativada',
	'common.internetOff': 'Internet desativada',
	'common.internetEnable': 'Ativar acesso à Internet',
	'common.internetDisable': 'Desativar acesso à Internet',
	'common.stopReading': 'Parar leitura em voz alta',
	'common.loading': 'A carregar…',
	'common.backHome': 'Voltar ao início',
	'common.skipToContent': 'Saltar para o conteúdo',
	'footer.disclaimer': 'O Accessible não faz diagnósticos.',
	'banner.guest': 'Modo convidado ativo — as suas definições não são guardadas.',
	'banner.teacher': 'Modo professor — consultar ou exportar um resumo das adaptações.',
	'banner.companion': 'Modo acompanhante — ajuda na preparação de uma consulta.',
	'banner.verySimple': 'Interface muito simples — botões grandes e textos curtos.',
	'banner.expert': 'Modo especialista — todas as definições avançadas estão visíveis.',
	'intro.title': 'Bem-vindo/a ao Accessible',
	'intro.lead':
		'O Accessible é uma aplicação local para adaptar a leitura, a escrita, a organização e a comunicação.',
	'intro.audience':
		'Destina-se a pessoas que precisam de um ambiente mais legível, mais calmo ou mais previsível, com ou sem diagnóstico, bem como a acompanhantes e professores.',
	'intro.use':
		'Comece pelo percurso guiado para manter inicialmente apenas as zonas úteis. As definições podem ser testadas, alteradas e exportadas numa síntese.',
	'intro.featuresTitle': 'Funções disponíveis',
	'intro.feature.read':
		'Ler: tipo de letra, tamanho, fundo, síntese vocal, OCR de imagem ou PDF e ajuda áudio/vídeo.',
	'intro.feature.write':
		'Escrever e compreender: editor simples, predição de palavras, correção se os motores estiverem instalados, instruções por etapas.',
	'intro.feature.organize':
		'Organizar, tomar notas, memorizar: listas, temporizador, Kanban, rotinas, notas Cornell e flashcards.',
	'intro.feature.communicate':
		'Comunicar e preparar: cartões CAA, pictogramas, perfil de necessidades e exportação JSON, PDF, ODT ou DOCX.',
	'intro.privacy':
		'Os dados permanecem neste dispositivo. O Accessible não faz diagnósticos e não substitui um profissional.',
	'intro.continue': 'Continuar',
	'intro.dismiss': 'Não voltar a mostrar',
	'crisis.ariaActivate': 'Ativar modo pausa',
	'page.read.title': 'Ler um texto',
	'page.read.intro':
		'Cole um texto ou use o exemplo. Altere as definições e guarde as suas preferências.',
	'page.read.tab.read': 'Ler',
	'page.read.tab.compare': 'Comparar',
	'page.read.tab.media': 'Áudio / Vídeo',
	'page.read.inputLabel': 'O seu texto',
	'page.read.useSample': 'Usar texto de exemplo',
	'page.read.preview': 'Pré-visualização',
	'page.read.previewEmpty': 'Cole um texto para mostrar a pré-visualização.',
	'page.read.distractionBanner':
		'Modo sem distrações. Apenas o texto abaixo é mostrado.',
	'page.read.distractionExit': 'Sair deste modo',
	'page.notes.formatLegend': 'Formato da nota',
	'page.notes.formatSimple': 'Nota simples',
	'page.notes.formatCornell': 'Formato Cornell',
	'page.notes.titleLabel': 'Título',
	'page.notes.bodyLabel': 'Conteúdo',
	'page.notes.cornellCue': 'Palavras-chave / perguntas (coluna esquerda)',
	'page.notes.cornellBody': 'Notas da aula (área principal)',
	'page.notes.cornellSummary': 'Resumo (embaixo)',
	'page.write.title': 'Escrever um texto',
	'page.write.intro':
		'Escreva ou cole um texto. Ative a previsão de palavras para escrever mais depressa. Hunspell (ortografia) e Grammalecte (gramática) funcionam na aplicação de secretária se estiverem instalados.',
	'page.organize.title': 'Organizar o meu trabalho',
	'page.organize.intro':
		'Divida o trabalho em pequenos passos. Use o temporizador, o quadro Kanban ou listas de verificação. Tudo fica guardado neste dispositivo.',
	'page.understand.title': 'Compreender uma tarefa',
	'page.understand.intro':
		'Cole uma tarefa da aula, trabalho de casa ou e-mail que tenha de redigir. O Accessible decompõe-a em passos e sugere uma versão mais fácil de ler.',
	'page.communicate.title': 'Comunicar',
	'page.communicate.intro':
		'Escolha um cartão para mostrar ou ler em voz alta. Útil na aula, no trabalho ou no dia a dia. Também pode importar pictogramas ARASAAC (secção seguinte).',
	'page.communicate.scenarios': 'Situações frequentes',
	'page.communicate.socialScenarios': 'Cenários sociais guiados',
	'page.communicate.socialScenariosIntro':
		'Siga um cenário passo a passo com os cartões sugeridos em cada momento.',
	'page.communicate.caaRoutines': 'Rotinas de CAA',
	'page.communicate.caaRoutinesIntro':
		'Importe uma rotina visual pré-feita em Organizar para preparar situações de comunicação.',
	'page.teacher.journeyTitle': 'Percurso do professor',
	'page.teacher.companionJourneyTitle': 'Percurso do acompanhante',
	'page.teacher.journeyIntro':
		'Siga estes passos para preparar ou consultar um resumo das adaptações. O Accessible não faz diagnósticos.',
	'page.teacher.journeyProgress': 'Progresso do percurso do professor',
	'page.teacher.modeRequired':
		'Ative o modo professor ou acompanhante em Definições → Modo de utilização para aceder a este percurso.',
	'page.teacher.backHome': 'Voltar ao início',
	'home.teacher.journeyLink': 'Percurso guiado do professor',
	'home.teacher.journeyLinkDesc':
		'Passos para consultar, exportar e preparar uma conversa.',
	'page.profile.title': 'O meu perfil',
	'page.notes.title': 'As minhas notas',
	'page.notes.intro':
		'Crie notas estruturadas no seu dispositivo. Exportação em Markdown. Formato Cornell disponível para aula e revisão.',
	'page.memorize.title': 'Estudar com fichas',
	'page.memorize.intro':
		'Crie cartões pergunta/resposta e revise ao seu ritmo. Tudo permanece no seu dispositivo.',
	'page.settings.title': 'Definições',
	'home.teacher.title': 'Espaço do professor',
	'home.teacher.companionTitle': 'Espaço do acompanhante',
	'home.teacher.intro':
		'Prepare ou consulte um resumo das adaptações. Os dados permanecem neste dispositivo. O Accessible não faz diagnósticos.',
	'home.expert.title': 'Modo especialista',
	'home.expert.intro':
		'Todas as definições avançadas estão visíveis. Consulte as definições detalhadas ou as zonas de cada módulo.',
	'dash.read_text.label': 'Ler um texto',
	'dash.read_text.desc': 'Colar texto e adaptar a apresentação.',
	'dash.adapt_document.label': 'Adaptar um documento',
	'dash.adapt_document.desc': 'Alterar tipo de letra, tamanho e fundo de um texto.',
	'dash.write_text.label': 'Escrever um texto',
	'dash.write_text.desc': 'Editor simples com apoio à escrita.',
	'dash.correct_text.label': 'Corrigir o meu texto',
	'dash.correct_text.desc': 'Verificação ortográfica passo a passo.',
	'dash.organize_work.label': 'Organizar o meu trabalho',
	'dash.organize_work.desc': 'Listas de verificação, passos e planeamento.',
	'dash.take_notes.label': 'Tomar notas',
	'dash.take_notes.desc': 'Notas locais com exportação Markdown.',
	'dash.study_flashcards.label': 'Rever com fichas',
	'dash.study_flashcards.desc': 'Fichas de estudo pergunta/resposta.',
	'dash.arasaac_pictograms.label': 'Procurar um pictograma',
	'dash.arasaac_pictograms.desc': 'Importar ARASAAC para os seus cartões de CAA.',
	'dash.understand_instruction.label': 'Compreender uma tarefa',
	'dash.understand_instruction.desc': 'Decompor e simplificar uma tarefa.',
	'dash.prepare_appointment.label': 'Preparar uma consulta',
	'dash.prepare_appointment.desc': 'Ver perfil e preparar resumo.',
	'dash.export_synthesis.label': 'Exportar o meu resumo',
	'dash.export_synthesis.desc': 'Transferir JSON ou PDF para o seu dispositivo.',
	'dash.teacher.export_synthesis.label': 'Exportar resumo PDF',
	'dash.teacher.export_synthesis.desc':
		'Transferir resumo para uma conversa ou consulta.',
	'dash.teacher.import_profile.label': 'Importar perfil JSON',
	'dash.teacher.import_profile.desc':
		'Consultar definições exportadas por um aluno.',
	'dash.teacher.view_profile.label': 'Ver perfil ativo',
	'dash.teacher.view_profile.desc':
		'Necessidades funcionais, ferramentas ativadas e definições.',
	'dash.expert.expert_settings.label': 'Definições avançadas',
	'dash.expert.expert_settings.desc': 'Tipografia, acessibilidade motora, comunicação.',
	'dash.expert.expert_reading.label': 'Leitura avançada',
	'dash.expert.expert_reading.desc':
		'Colar texto, Piper TTS e tipografia avançada.',
	'dash.expert.expert_storage.label': 'Armazenamento detalhado',
	'dash.expert.expert_storage.desc':
		'Caminhos SQLite, contadores de tabelas, modo portátil.',
	'onboard.progress.choice': 'Escolher percurso',
	'onboard.start.title': 'Como quer começar?',
	'onboard.start.hint': 'Uma ideia por opção. Pode alterar tudo mais tarde.',
	'onboard.known.title': 'Já conheço as minhas necessidades',
	'onboard.known.desc': 'Escolher diretamente as ferramentas que me interessam.',
	'onboard.declared.title': 'Já tenho um diagnóstico ou reconhecimento',
	'onboard.declared.desc':
		'Indicar um perfil administrativo ou médico declarado.',
	'onboard.discovery.title': 'Não tenho a certeza',
	'onboard.discovery.desc': 'Percurso guiado para descobrir as minhas necessidades.',
	'onboard.discovery.comfort.intro':
		'Experimente o conforto da interface. As alterações são visíveis de imediato.',
	'onboard.discovery.step.reading.intro':
		'Cole um texto, altere tipo de letra e tamanho ou ouça com síntese de voz.',
	'onboard.discovery.step.writing.intro':
		'Escreva um texto simples ou corrija-o passo a passo com apoio ortográfico.',
	'onboard.discovery.step.organization.intro':
		'Divida o trabalho em listas de verificação, temporizador ou cartões Kanban.',
	'onboard.discovery.step.media.intro':
		'Importe um ficheiro de áudio ou vídeo, ajuste a velocidade e leia a transcrição em voz alta.',
	'onboard.discovery.step.sensory.intro':
		'Experimente definições sensoriais: animações, sons e notificações.',
	'onboard.discovery.step.motor.intro':
		'Ajuste tamanho dos botões, tempo de clique, ditado por voz e confirmações.',
	'onboard.discovery.step.communication.intro':
		'Cartões de comunicação e pictogramas ARASAAC para expressar as suas necessidades.',
	'onboard.discovery.step.summary.intro':
		'Isto é o que registámos durante este percurso. Pode completar o resumo a qualquer momento.',
	'onboard.discovery.step.summary.detail':
		'Consulte as suas necessidades e adaptações em O meu perfil. Exporte um resumo PDF ou JSON nas definições.',
	'onboard.discovery.openModule': 'Abrir este módulo',
	'onboard.discovery.stub.hint': 'Pode saltar este passo ou voltar mais tarde.',
	'onboard.known.heading': 'Que ferramentas lhe interessam?',
	'onboard.declared.heading': 'Perfis declarados',
	'onboard.declared.review.heading': 'Definições sugeridas',
	'onboard.comfort.heading': 'Conforto da interface',
	'onboard.comfort.previewHint':
		'Experimente estas definições. A pré-visualização atualiza-se de imediato.',
	'onboard.complete.heading': 'Percurso guardado',
	'onboard.complete.body':
		'A sua escolha está guardada. Pode alterá-la a qualquer momento.',
	'error.notFound.title': 'Página não encontrada',
	'error.notFound.body': 'Esta zona ainda não está disponível.',
	'unlock.title': 'Perfil protegido',
	'unlock.hint':
		'O seu perfil está encriptado neste dispositivo. Introduza a palavra-passe para continuar.',
	'unlock.warning':
		'Se esquecer a palavra-passe, os seus dados não podem ser recuperados.',
	'unlock.passwordLabel': 'Palavra-passe',
	'unlock.submit': 'Desbloquear',
	'unlock.submitting': 'A desbloquear…',
	'crisis.title': 'Modo pausa',
	'crisis.hint': 'Tome o seu tempo. Retome quando quiser.',
	'crisis.resume': 'Retomar'
};
