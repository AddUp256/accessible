/** R?le : Pack i18n typ? Es : traductions explicites pour l?interface bilingue. */
import type { ExtendedUiKey } from '../../ui-extended';

export const EXTENDED_ES: Partial<Record<ExtendedUiKey, string>> = {
	'home.welcome.line1': 'Accessible no ofrece un diagnóstico.',
	'home.welcome.line2': 'Accessible le ayuda a identificar sus necesidades.',
	'home.welcome.line3': 'Accessible le ayuda a probar distintos ajustes.',
	'home.welcome.line4': 'Accessible le ayuda a preparar una cita si lo necesita.',
	'common.readAloud': 'Leer en voz alta',
	'common.internetOn': 'Internet activado',
	'common.internetOff': 'Internet desactivado',
	'common.internetEnable': 'Activar el acceso a internet',
	'common.internetDisable': 'Desactivar el acceso a internet',
	'common.stopReading': 'Detener la lectura',
	'common.loading': 'Cargando…',
	'common.backHome': 'Volver al inicio',
	'common.skipToContent': 'Ir al contenido',
	'footer.disclaimer': 'Accessible no ofrece un diagnóstico.',
	'banner.guest': 'Modo invitado activo: sus ajustes no se guardan.',
	'banner.teacher':
		'Modo docente: consulte o exporte una síntesis de adaptaciones.',
	'banner.companion': 'Modo acompañante: ayuda para preparar una cita.',
	'banner.verySimple': 'Interfaz muy simple: botones grandes y textos breves.',
	'banner.expert': 'Modo experto: todos los ajustes avanzados son visibles.',
	'intro.title': 'Bienvenido/a a Accessible',
	'intro.lead':
		'Accessible es una aplicación local para adaptar la lectura, la escritura, la organización y la comunicación.',
	'intro.audience':
		'Está pensada para personas que necesitan un entorno más legible, más tranquilo o más previsible, con o sin diagnóstico, y también para acompañantes y docentes.',
	'intro.use':
		'Empiece por el recorrido guiado para conservar solo las zonas útiles al principio. Los ajustes se prueban, se cambian y se pueden exportar en una síntesis.',
	'intro.featuresTitle': 'Funciones disponibles',
	'intro.feature.read':
		'Leer: fuente, tamaño, fondo, lectura en voz alta, OCR de imagen o PDF y ayuda de audio/vídeo.',
	'intro.feature.write':
		'Escribir y comprender: editor simple, predicción de palabras, corrección si los motores están instalados, instrucciones por pasos.',
	'intro.feature.organize':
		'Organizar, tomar notas, memorizar: listas, temporizador, Kanban, rutinas, notas Cornell y tarjetas.',
	'intro.feature.communicate':
		'Comunicar y preparar: tarjetas CAA, pictogramas, perfil de necesidades y exportación JSON, PDF, ODT o DOCX.',
	'intro.privacy':
		'Los datos permanecen en este dispositivo. Accessible no diagnostica y no sustituye a un profesional.',
	'intro.continue': 'Continuar',
	'intro.dismiss': 'No volver a mostrar',
	'crisis.ariaActivate': 'Activar el modo pausa',
	'page.read.title': 'Leer un texto',
	'page.read.intro':
		'Pegue un texto o use el ejemplo. Cambie los ajustes y guarde sus preferencias.',
	'page.read.tab.read': 'Leer',
	'page.read.tab.compare': 'Comparar',
	'page.read.tab.media': 'Audio / vídeo',
	'page.read.inputLabel': 'Su texto',
	'page.read.useSample': 'Usar el texto de ejemplo',
	'page.read.preview': 'Vista previa',
	'page.read.previewEmpty': 'Pegue un texto para ver la vista previa.',
	'page.read.distractionBanner':
		'Modo sin distracciones. Solo se muestra el texto a continuación.',
	'page.read.distractionExit': 'Salir de este modo',
	'page.notes.formatLegend': 'Formato de nota',
	'page.notes.formatSimple': 'Nota simple',
	'page.notes.formatCornell': 'Formato Cornell',
	'page.notes.titleLabel': 'Título',
	'page.notes.bodyLabel': 'Contenido',
	'page.notes.cornellCue': 'Palabras clave / preguntas (columna izquierda)',
	'page.notes.cornellBody': 'Apuntes de clase (zona principal)',
	'page.notes.cornellSummary': 'Resumen (parte inferior)',
	'page.write.title': 'Escribir un texto',
	'page.write.intro':
		'Escriba o pegue un texto. Active la predicción de palabras para escribir más rápido. Hunspell (ortografía) y Grammalecte (gramática) funcionan en la aplicación de escritorio si están instalados.',
	'page.organize.title': 'Organizar mi trabajo',
	'page.organize.intro':
		'Divida el trabajo en pasos pequeños. Use el temporizador, el tablero Kanban o las listas de comprobación. Todo se guarda en este dispositivo.',
	'page.understand.title': 'Entender una consigna',
	'page.understand.intro':
		'Pegue una consigna de clase, un deber o un correo que deba redactar. Accessible la divide en pasos y propone una versión más fácil de leer.',
	'page.communicate.title': 'Comunicar',
	'page.communicate.intro':
		'Elija una tarjeta para mostrar o leer en voz alta. Útil en clase, en el trabajo o con su entorno. También puede importar pictogramas ARASAAC (sección siguiente).',
	'page.communicate.scenarios': 'Situaciones habituales',
	'page.communicate.socialScenarios': 'Escenarios sociales guiados',
	'page.communicate.socialScenariosIntro':
		'Recorra un escenario paso a paso con las tarjetas sugeridas en cada momento.',
	'page.communicate.caaRoutines': 'Rutinas CAA',
	'page.communicate.caaRoutinesIntro':
		'Importe una rutina visual predefinida en Organizar para preparar situaciones de comunicación.',
	'page.teacher.journeyTitle': 'Recorrido docente',
	'page.teacher.companionJourneyTitle': 'Recorrido acompañante',
	'page.teacher.journeyIntro':
		'Siga estos pasos para preparar o consultar una síntesis de adaptaciones. Accessible no ofrece un diagnóstico.',
	'page.teacher.journeyProgress': 'Progreso del recorrido docente',
	'page.teacher.modeRequired':
		'Active el modo docente o acompañante en Ajustes → Modo de uso para acceder a este recorrido.',
	'page.teacher.backHome': 'Volver al inicio',
	'home.teacher.journeyLink': 'Recorrido guiado docente',
	'home.teacher.journeyLinkDesc':
		'Pasos para consultar, exportar y preparar una reunión.',
	'page.profile.title': 'Mi perfil',
	'page.notes.title': 'Mis notas',
	'page.notes.intro':
		'Tome notas estructuradas en su dispositivo. Exporte en Markdown. Formato Cornell disponible para clase y repaso.',
	'page.memorize.title': 'Memorizar con tarjetas',
	'page.memorize.intro':
		'Cree tarjetas de pregunta / respuesta y repase a su ritmo. Todo permanece en su dispositivo.',
	'page.settings.title': 'Ajustes',
	'home.teacher.title': 'Espacio docente',
	'home.teacher.companionTitle': 'Espacio acompañante',
	'home.teacher.intro':
		'Prepare o consulte una síntesis de adaptaciones. Los datos permanecen en este dispositivo. Accessible no ofrece un diagnóstico.',
	'home.expert.title': 'Modo experto',
	'home.expert.intro':
		'Todos los ajustes avanzados son visibles. Consulte los ajustes detallados o los paneles de cada módulo.',
	'dash.read_text.label': 'Leer un texto',
	'dash.read_text.desc': 'Pegar un texto y adaptar la visualización.',
	'dash.adapt_document.label': 'Adaptar un documento',
	'dash.adapt_document.desc': 'Cambiar la fuente, el tamaño y el fondo del texto.',
	'dash.write_text.label': 'Escribir un texto',
	'dash.write_text.desc': 'Editor sencillo con apoyo a la escritura.',
	'dash.correct_text.label': 'Corregir mi texto',
	'dash.correct_text.desc': 'Corrección ortográfica paso a paso.',
	'dash.organize_work.label': 'Organizar mi trabajo',
	'dash.organize_work.desc': 'Listas de comprobación, pasos y planificación.',
	'dash.take_notes.label': 'Tomar notas',
	'dash.take_notes.desc': 'Notas locales con exportación Markdown.',
	'dash.study_flashcards.label': 'Repasar con tarjetas',
	'dash.study_flashcards.desc': 'Tarjetas de pregunta / respuesta.',
	'dash.arasaac_pictograms.label': 'Buscar un pictograma',
	'dash.arasaac_pictograms.desc': 'Importar ARASAAC para sus tarjetas CAA.',
	'dash.understand_instruction.label': 'Entender una consigna',
	'dash.understand_instruction.desc': 'Desglosar y simplificar una consigna.',
	'dash.prepare_appointment.label': 'Preparar una cita',
	'dash.prepare_appointment.desc': 'Ver su perfil y preparar una síntesis.',
	'dash.export_synthesis.label': 'Exportar mi síntesis',
	'dash.export_synthesis.desc': 'Descargar JSON o PDF en su dispositivo.',
	'dash.teacher.export_synthesis.label': 'Exportar una síntesis PDF',
	'dash.teacher.export_synthesis.desc':
		'Descargar una síntesis para una reunión o entrevista.',
	'dash.teacher.import_profile.label': 'Importar un perfil JSON',
	'dash.teacher.import_profile.desc':
		'Consultar los ajustes exportados por un estudiante.',
	'dash.teacher.view_profile.label': 'Ver el perfil activo',
	'dash.teacher.view_profile.desc':
		'Necesidades funcionales, herramientas activadas y ajustes.',
	'dash.expert.expert_settings.label': 'Ajustes avanzados',
	'dash.expert.expert_settings.desc':
		'Tipografía, accesibilidad motriz, comunicación.',
	'dash.expert.expert_reading.label': 'Lectura avanzada',
	'dash.expert.expert_reading.desc':
		'Pegar texto, Piper TTS y tipografía avanzada.',
	'dash.expert.expert_storage.label': 'Almacenamiento detallado',
	'dash.expert.expert_storage.desc':
		'Rutas SQLite, recuentos de tablas, modo portable.',
	'onboard.progress.choice': 'Elegir un recorrido',
	'onboard.start.title': '¿Cómo quiere empezar?',
	'onboard.start.hint': 'Una idea por opción. Podrá cambiarlo todo después.',
	'onboard.known.title': 'Ya conozco mis necesidades',
	'onboard.known.desc': 'Elegir directamente las herramientas que me interesan.',
	'onboard.declared.title': 'Ya tengo un diagnóstico o un reconocimiento',
	'onboard.declared.desc':
		'Indicar un perfil administrativo o médico declarado.',
	'onboard.discovery.title': 'No estoy seguro/a',
	'onboard.discovery.desc': 'Recorrido guiado para identificar mis necesidades.',
	'onboard.discovery.comfort.intro':
		'Pruebe el confort de la interfaz. Los cambios se ven al instante.',
	'onboard.discovery.step.reading.intro':
		'Pegue un texto, cambie la fuente y el tamaño, o escuche con la síntesis de voz.',
	'onboard.discovery.step.writing.intro':
		'Escriba un texto sencillo o corríjalo paso a paso con ayuda ortográfica.',
	'onboard.discovery.step.organization.intro':
		'Divida el trabajo en listas de comprobación, temporizador o tarjetas Kanban.',
	'onboard.discovery.step.media.intro':
		'Importe un archivo de audio o vídeo, ajuste la velocidad y lea la transcripción en voz alta.',
	'onboard.discovery.step.sensory.intro':
		'Pruebe los ajustes sensoriales: animaciones, sonidos y notificaciones.',
	'onboard.discovery.step.motor.intro':
		'Ajuste el tamaño de los botones, el tiempo de clic, la dictación por voz y las confirmaciones.',
	'onboard.discovery.step.communication.intro':
		'Tarjetas de comunicación y pictogramas ARASAAC para expresar sus necesidades.',
	'onboard.discovery.step.summary.intro':
		'Esto es lo que hemos anotado durante este recorrido. Podrá completar la síntesis en cualquier momento.',
	'onboard.discovery.step.summary.detail':
		'Consulte Mi perfil para ver sus necesidades y adaptaciones. Exporte una síntesis PDF o JSON desde Ajustes.',
	'onboard.discovery.openModule': 'Abrir este módulo',
	'onboard.discovery.stub.hint': 'Puede omitir este paso o volver más tarde.',
	'onboard.known.heading': '¿Qué herramientas le interesan?',
	'onboard.declared.heading': 'Perfiles declarados',
	'onboard.declared.review.heading': 'Ajustes sugeridos',
	'onboard.comfort.heading': 'Confort de la interfaz',
	'onboard.comfort.previewHint':
		'Pruebe estos ajustes. La vista previa se actualiza al instante.',
	'onboard.complete.heading': 'Recorrido guardado',
	'onboard.complete.body':
		'Sus elecciones están guardadas. Puede cambiarlas en cualquier momento.',
	'error.notFound.title': 'Página no encontrada',
	'error.notFound.body': 'Esta sección aún no está disponible.',
	'unlock.title': 'Perfil protegido',
	'unlock.hint':
		'Su perfil está cifrado en este dispositivo. Introduzca su contraseña para continuar.',
	'unlock.warning':
		'Si olvida su contraseña, sus datos no podrán recuperarse.',
	'unlock.passwordLabel': 'Contraseña',
	'unlock.submit': 'Desbloquear',
	'unlock.submitting': 'Desbloqueando…',
	'crisis.title': 'Modo pausa',
	'crisis.hint': 'Tómese su tiempo. Reanude cuando quiera.',
	'crisis.resume': 'Reanudar'
};
