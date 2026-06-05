import type { ExtendedUiKey } from '../../ui-extended';

export const EXTENDED_IT: Partial<Record<ExtendedUiKey, string>> = {
	'home.welcome.line1': 'Accessible non effettua diagnosi.',
	'home.welcome.line2': 'Accessible ti aiuta a riconoscere i tuoi bisogni.',
	'home.welcome.line3': 'Accessible ti aiuta a provare diverse impostazioni.',
	'home.welcome.line4': 'Accessible ti aiuta, se serve, a preparare un appuntamento.',
	'common.readAloud': 'Leggi ad alta voce',
	'common.internetOn': 'Internet attivato',
	'common.internetOff': 'Internet disattivato',
	'common.internetEnable': 'Attiva accesso a Internet',
	'common.internetDisable': 'Disattiva accesso a Internet',
	'common.stopReading': 'Interrompi lettura',
	'common.loading': 'Caricamento in corso…',
	'common.backHome': 'Torna alla home',
	'common.skipToContent': 'Vai al contenuto',
	'footer.disclaimer': 'Accessible non effettua diagnosi.',
	'banner.guest': 'Modalità ospite attiva — le impostazioni non vengono salvate.',
	'banner.teacher':
		'Modalità insegnante — consulta o esporta una sintesi degli adattamenti.',
	'banner.companion': 'Modalità accompagnatore — aiuto nella preparazione dell\'appuntamento.',
	'banner.verySimple': 'Interfaccia molto semplice — pulsanti grandi e testi brevi.',
	'banner.expert': 'Modalità esperto — tutte le impostazioni avanzate sono visibili.',
	'intro.title': 'Benvenuto/a in Accessible',
	'intro.lead':
		'Accessible è un’app locale per adattare lettura, scrittura, organizzazione e comunicazione.',
	'intro.audience':
		'È pensata per persone che hanno bisogno di un ambiente più leggibile, più calmo o più prevedibile, con o senza diagnosi, e per accompagnatori e insegnanti.',
	'intro.use':
		'Inizia dal percorso guidato per mantenere visibili solo le aree utili all’inizio. Le impostazioni si provano, si modificano e possono essere esportate in una sintesi.',
	'intro.featuresTitle': 'Funzioni disponibili',
	'intro.feature.read':
		'Leggere: font, dimensione, sfondo, sintesi vocale, OCR di immagine o PDF e aiuto audio/video.',
	'intro.feature.write':
		'Scrivere e capire: editor semplice, predizione di parole, correzione se i motori sono installati, consegne divise in passaggi.',
	'intro.feature.organize':
		'Organizzare, prendere appunti, memorizzare: checklist, timer, Kanban, routine, note Cornell e flashcard.',
	'intro.feature.communicate':
		'Comunicare e preparare: carte CAA, pittogrammi, profilo dei bisogni ed esportazione JSON, PDF, ODT o DOCX.',
	'intro.privacy':
		'I dati restano su questo dispositivo. Accessible non effettua diagnosi e non sostituisce un professionista.',
	'intro.continue': 'Continua',
	'intro.dismiss': 'Non mostrare più',
	'crisis.ariaActivate': 'Attiva modalità pausa',
	'page.read.title': 'Leggere un testo',
	'page.read.intro':
		'Incolla un testo o usa l\'esempio. Modifica le impostazioni e salva le tue preferenze.',
	'page.read.tab.read': 'Leggere',
	'page.read.tab.compare': 'Confronta',
	'page.read.tab.media': 'Audio / video',
	'page.read.inputLabel': 'Il tuo testo',
	'page.read.useSample': 'Usa il testo di esempio',
	'page.read.preview': 'Anteprima',
	'page.read.previewEmpty': 'Incolla un testo per vedere l\'anteprima.',
	'page.read.distractionBanner':
		'Modalità senza distrazioni. Viene mostrato solo il testo qui sotto.',
	'page.read.distractionExit': 'Esci da questa modalità',
	'page.notes.formatLegend': 'Formato nota',
	'page.notes.formatSimple': 'Nota semplice',
	'page.notes.formatCornell': 'Formato Cornell',
	'page.notes.titleLabel': 'Titolo',
	'page.notes.bodyLabel': 'Contenuto',
	'page.notes.cornellCue': 'Parole chiave / domande (colonna sinistra)',
	'page.notes.cornellBody': 'Appunti del corso (area principale)',
	'page.notes.cornellSummary': 'Sintesi (in basso)',
	'page.write.title': 'Scrivere un testo',
	'page.write.intro':
		'Scrivi o incolla un testo. Attiva la previsione parole per scrivere più velocemente. Hunspell (ortografia) e Grammalecte (grammatica) funzionano nell\'app desktop se installati.',
	'page.organize.title': 'Organizzare il mio lavoro',
	'page.organize.intro':
		'Dividi il lavoro in piccoli passi. Usa timer, bacheca Kanban o checklist. Tutto resta su questo dispositivo.',
	'page.understand.title': 'Capire un compito',
	'page.understand.intro':
		'Incolla un compito del corso, un compito a casa o un\'e-mail da scrivere. Accessible lo scompone in passi e propone una versione più facile da leggere.',
	'page.communicate.title': 'Comunicare',
	'page.communicate.intro':
		'Scegli una scheda da mostrare o da leggere ad alta voce. Utile a scuola, al lavoro o nella vita quotidiana. Puoi anche importare pittogrammi ARASAAC (sezione successiva).',
	'page.communicate.scenarios': 'Situazioni frequenti',
	'page.communicate.socialScenarios': 'Scenari sociali guidati',
	'page.communicate.socialScenariosIntro':
		'Segui uno scenario passo dopo passo con le schede suggerite in ogni momento.',
	'page.communicate.caaRoutines': 'Routine CAA',
	'page.communicate.caaRoutinesIntro':
		'Importa una routine visiva predefinita in Organizza per preparare situazioni di comunicazione.',
	'page.teacher.journeyTitle': 'Percorso insegnante',
	'page.teacher.companionJourneyTitle': 'Percorso accompagnatore',
	'page.teacher.journeyIntro':
		'Segui questi passi per preparare o consultare una sintesi degli adattamenti. Accessible non effettua diagnosi.',
	'page.teacher.journeyProgress': 'Avanzamento del percorso insegnante',
	'page.teacher.modeRequired':
		'Attiva la modalità insegnante o accompagnatore in Impostazioni → Modalità d\'uso per accedere a questo percorso.',
	'page.teacher.backHome': 'Torna alla home',
	'home.teacher.journeyLink': 'Percorso insegnante guidato',
	'home.teacher.journeyLinkDesc':
		'Passi per consultare, esportare e preparare un colloquio.',
	'page.profile.title': 'Il mio profilo',
	'page.notes.title': 'Le mie note',
	'page.notes.intro':
		'Crea note strutturate sul tuo dispositivo. Esportazione in Markdown. Formato Cornell disponibile per corso e ripasso.',
	'page.memorize.title': 'Imparare con le flashcard',
	'page.memorize.intro':
		'Crea schede domanda/risposta e ripassa al tuo ritmo. Tutto resta sul tuo dispositivo.',
	'page.settings.title': 'Impostazioni',
	'home.teacher.title': 'Area insegnante',
	'home.teacher.companionTitle': 'Area accompagnatore',
	'home.teacher.intro':
		'Prepara o consulta una sintesi degli adattamenti. I dati restano su questo dispositivo. Accessible non effettua diagnosi.',
	'home.expert.title': 'Modalità esperto',
	'home.expert.intro':
		'Tutte le impostazioni avanzate sono visibili. Consulta le impostazioni dettagliate o le aree di ogni modulo.',
	'dash.read_text.label': 'Leggere un testo',
	'dash.read_text.desc': 'Incolla testo e adatta la visualizzazione.',
	'dash.adapt_document.label': 'Adattare un documento',
	'dash.adapt_document.desc': 'Modifica carattere, dimensione e sfondo di un testo.',
	'dash.write_text.label': 'Scrivere un testo',
	'dash.write_text.desc': 'Editor semplice con supporto alla scrittura.',
	'dash.correct_text.label': 'Correggere il mio testo',
	'dash.correct_text.desc': 'Controllo ortografico passo dopo passo.',
	'dash.organize_work.label': 'Organizzare il mio lavoro',
	'dash.organize_work.desc': 'Checklist, passi e pianificazione.',
	'dash.take_notes.label': 'Prendere appunti',
	'dash.take_notes.desc': 'Note locali con esportazione Markdown.',
	'dash.study_flashcards.label': 'Ripassare con le schede',
	'dash.study_flashcards.desc': 'Flashcard domanda/risposta.',
	'dash.arasaac_pictograms.label': 'Cercare un pittogramma',
	'dash.arasaac_pictograms.desc': 'Importa ARASAAC per le tue schede CAA.',
	'dash.understand_instruction.label': 'Capire un compito',
	'dash.understand_instruction.desc': 'Scomponi e semplifica un compito.',
	'dash.prepare_appointment.label': 'Preparare un appuntamento',
	'dash.prepare_appointment.desc': 'Consulta il profilo e prepara una sintesi.',
	'dash.export_synthesis.label': 'Esportare la mia sintesi',
	'dash.export_synthesis.desc': 'Scarica JSON o PDF sul tuo dispositivo.',
	'dash.teacher.export_synthesis.label': 'Esportare sintesi PDF',
	'dash.teacher.export_synthesis.desc':
		'Scarica una sintesi per un colloquio o un appuntamento.',
	'dash.teacher.import_profile.label': 'Importare profilo JSON',
	'dash.teacher.import_profile.desc':
		'Consulta le impostazioni esportate da uno studente.',
	'dash.teacher.view_profile.label': 'Vedi profilo attivo',
	'dash.teacher.view_profile.desc':
		'Bisogni funzionali, strumenti attivati e impostazioni.',
	'dash.expert.expert_settings.label': 'Impostazioni avanzate',
	'dash.expert.expert_settings.desc': 'Tipografia, accessibilità motoria, comunicazione.',
	'dash.expert.expert_reading.label': 'Lettura avanzata',
	'dash.expert.expert_reading.desc':
		'Incolla testo, Piper TTS e tipografia avanzata.',
	'dash.expert.expert_storage.label': 'Archiviazione dettagliata',
	'dash.expert.expert_storage.desc':
		'Percorsi SQLite, contatori tabelle, modalità portatile.',
	'onboard.progress.choice': 'Scegli percorso',
	'onboard.start.title': 'Come vuoi iniziare?',
	'onboard.start.hint': 'Un\'idea per opzione. Puoi cambiare tutto in seguito.',
	'onboard.known.title': 'Conosco già i miei bisogni',
	'onboard.known.desc': 'Scegli direttamente gli strumenti che ti interessano.',
	'onboard.declared.title': 'Ho già una diagnosi o un riconoscimento',
	'onboard.declared.desc':
		'Indica un profilo amministrativo o medico dichiarato.',
	'onboard.discovery.title': 'Non sono sicuro/a',
	'onboard.discovery.desc': 'Percorso guidato per scoprire i miei bisogni.',
	'onboard.discovery.comfort.intro':
		'Prova il comfort dell\'interfaccia. Le modifiche sono visibili subito.',
	'onboard.discovery.step.reading.intro':
		'Incolla un testo, modifica carattere e dimensione o ascolta con la sintesi vocale.',
	'onboard.discovery.step.writing.intro':
		'Scrivi un testo semplice o correggilo passo dopo passo con l\'aiuto ortografico.',
	'onboard.discovery.step.organization.intro':
		'Dividi il lavoro in checklist, timer o schede Kanban.',
	'onboard.discovery.step.media.intro':
		'Importa un file audio o video, regola la velocità e leggi la trascrizione ad alta voce.',
	'onboard.discovery.step.sensory.intro':
		'Prova impostazioni sensoriali: animazioni, suoni e notifiche.',
	'onboard.discovery.step.motor.intro':
		'Regola dimensione pulsanti, tempo di clic, dettatura vocale e conferme.',
	'onboard.discovery.step.communication.intro':
		'Schede di comunicazione e pittogrammi ARASAAC per esprimere i tuoi bisogni.',
	'onboard.discovery.step.summary.intro':
		'Ecco cosa abbiamo annotato durante questo percorso. Puoi completare la sintesi in qualsiasi momento.',
	'onboard.discovery.step.summary.detail':
		'Consulta i tuoi bisogni e adattamenti in Il mio profilo. Esporta una sintesi PDF o JSON dalle Impostazioni.',
	'onboard.discovery.openModule': 'Apri questo modulo',
	'onboard.discovery.stub.hint': 'Puoi saltare questo passo o tornare più tardi.',
	'onboard.known.heading': 'Quali strumenti ti interessano?',
	'onboard.declared.heading': 'Profili dichiarati',
	'onboard.declared.review.heading': 'Impostazioni suggerite',
	'onboard.comfort.heading': 'Comfort dell\'interfaccia',
	'onboard.comfort.previewHint':
		'Prova queste impostazioni. L\'anteprima si aggiorna subito.',
	'onboard.complete.heading': 'Percorso salvato',
	'onboard.complete.body':
		'Le tue scelte sono salvate. Puoi modificarle in qualsiasi momento.',
	'error.notFound.title': 'Pagina non trovata',
	'error.notFound.body': 'Questa area non è ancora disponibile.',
	'unlock.title': 'Profilo protetto',
	'unlock.hint':
		'Il tuo profilo è crittografato su questo dispositivo. Inserisci la password per continuare.',
	'unlock.warning':
		'Se dimentichi la password, i dati non possono essere recuperati.',
	'unlock.passwordLabel': 'Password',
	'unlock.submit': 'Sblocca',
	'unlock.submitting': 'Sblocco in corso…',
	'crisis.title': 'Modalità pausa',
	'crisis.hint': 'Prenditi il tuo tempo. Riprendi quando vuoi.',
	'crisis.resume': 'Riprendi'
};
