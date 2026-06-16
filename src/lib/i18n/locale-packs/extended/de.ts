/** R?le : Pack i18n typ? De : traductions explicites pour l?interface bilingue. */
import type { ExtendedUiKey } from '../../ui-extended';

export const EXTENDED_DE: Partial<Record<ExtendedUiKey, string>> = {
	'home.welcome.line1': 'Accessible stellt keine Diagnose.',
	'home.welcome.line2': 'Accessible hilft Ihnen, Ihre Bedürfnisse zu erkennen.',
	'home.welcome.line3': 'Accessible hilft Ihnen, verschiedene Einstellungen auszuprobieren.',
	'home.welcome.line4': 'Accessible hilft Ihnen bei Bedarf, einen Termin vorzubereiten.',
	'common.readAloud': 'Vorlesen',
	'common.internetOn': 'Internet aktiviert',
	'common.internetOff': 'Internet deaktiviert',
	'common.internetEnable': 'Internetzugang aktivieren',
	'common.internetDisable': 'Internetzugang deaktivieren',
	'common.stopReading': 'Vorlesen stoppen',
	'common.loading': 'Wird geladen…',
	'common.backHome': 'Zurück zur Startseite',
	'common.skipToContent': 'Zum Inhalt springen',
	'footer.disclaimer': 'Accessible stellt keine Diagnose.',
	'banner.guest': 'Gastmodus aktiv — Ihre Einstellungen werden nicht gespeichert.',
	'banner.teacher':
		'Lehrermodus — Zusammenfassung der Anpassungen einsehen oder exportieren.',
	'banner.companion': 'Begleitmodus — Hilfe bei der Terminvorbereitung.',
	'banner.verySimple': 'Sehr einfache Oberfläche — große Schaltflächen und kurze Texte.',
	'banner.expert': 'Expertenmodus — alle erweiterten Einstellungen sind sichtbar.',
	'intro.title': 'Willkommen bei Accessible',
	'intro.lead':
		'Accessible ist eine lokale App, um Lesen, Schreiben, Organisation und Kommunikation anzupassen.',
	'intro.audience':
		'Sie richtet sich an Menschen, die eine besser lesbare, ruhigere oder vorhersehbarere Umgebung brauchen, mit oder ohne Diagnose, sowie an Begleitpersonen und Lehrkräfte.',
	'intro.use':
		'Beginnen Sie mit dem geführten Ablauf, damit zunächst nur die nützlichen Bereiche sichtbar bleiben. Einstellungen können getestet, geändert und als Zusammenfassung exportiert werden.',
	'intro.featuresTitle': 'Verfügbare Funktionen',
	'intro.feature.read':
		'Lesen: Schriftart, Größe, Hintergrund, Sprachausgabe, OCR für Bild oder PDF und Audio-/Video-Hilfe.',
	'intro.feature.write':
		'Schreiben und Verstehen: einfacher Editor, Wortvorhersage, Korrektur bei installierten Modulen, Aufgaben in Schritte zerlegen.',
	'intro.feature.organize':
		'Organisieren, Notizen, Merken: Checklisten, Timer, Kanban, Routinen, Cornell-Notizen und Karteikarten.',
	'intro.feature.communicate':
		'Kommunizieren und Vorbereiten: UK-Karten, Piktogramme, Bedarfsprofil und Export als JSON, PDF, ODT oder DOCX.',
	'intro.privacy':
		'Die Daten bleiben auf diesem Gerät. Accessible stellt keine Diagnose und ersetzt keine Fachperson.',
	'intro.continue': 'Fortfahren',
	'intro.dismiss': 'Nicht mehr anzeigen',
	'crisis.ariaActivate': 'Pausenmodus aktivieren',
	'page.read.title': 'Einen Text lesen',
	'page.read.intro':
		'Fügen Sie einen Text ein oder verwenden Sie das Beispiel. Ändern Sie die Einstellungen und speichern Sie Ihre Präferenzen.',
	'page.read.tab.read': 'Lesen',
	'page.read.tab.compare': 'Vergleichen',
	'page.read.tab.media': 'Audio / Video',
	'page.read.inputLabel': 'Ihr Text',
	'page.read.useSample': 'Beispieltext verwenden',
	'page.read.preview': 'Vorschau',
	'page.read.previewEmpty': 'Fügen Sie einen Text ein, um die Vorschau anzuzeigen.',
	'page.read.distractionBanner':
		'Ablenkungsfreier Modus. Nur der Text unten wird angezeigt.',
	'page.read.distractionExit': 'Diesen Modus verlassen',
	'page.notes.formatLegend': 'Notizformat',
	'page.notes.formatSimple': 'Einfache Notiz',
	'page.notes.formatCornell': 'Cornell-Format',
	'page.notes.titleLabel': 'Titel',
	'page.notes.bodyLabel': 'Inhalt',
	'page.notes.cornellCue': 'Schlüsselwörter / Fragen (linke Spalte)',
	'page.notes.cornellBody': 'Kursnotizen (Hauptbereich)',
	'page.notes.cornellSummary': 'Zusammenfassung (unten)',
	'page.write.title': 'Einen Text schreiben',
	'page.write.intro':
		'Schreiben oder fügen Sie einen Text ein. Aktivieren Sie die Wortvorhersage, um schneller zu schreiben. Hunspell (Rechtschreibung) und Grammalecte (Grammatik) funktionieren in der Desktop-Anwendung, wenn installiert.',
	'page.organize.title': 'Meine Arbeit organisieren',
	'page.organize.intro':
		'Teilen Sie die Arbeit in kleine Schritte auf. Nutzen Sie den Timer, das Kanban-Board oder Checklisten. Alles wird auf diesem Gerät gespeichert.',
	'page.understand.title': 'Eine Aufgabe verstehen',
	'page.understand.intro':
		'Fügen Sie eine Kursaufgabe, eine Hausaufgabe oder eine E-Mail ein, die Sie verfassen müssen. Accessible zerlegt sie in Schritte und schlägt eine leichter lesbare Version vor.',
	'page.communicate.title': 'Kommunizieren',
	'page.communicate.intro':
		'Wählen Sie eine Karte zum Anzeigen oder Vorlesen. Nützlich im Unterricht, bei der Arbeit oder im Alltag. Sie können auch ARASAAC-Piktogramme importieren (nächster Abschnitt).',
	'page.communicate.scenarios': 'Häufige Situationen',
	'page.communicate.socialScenarios': 'Geführte soziale Szenarien',
	'page.communicate.socialScenariosIntro':
		'Durchlaufen Sie ein Szenario Schritt für Schritt mit den vorgeschlagenen Karten in jedem Moment.',
	'page.communicate.caaRoutines': 'UK-Routinen',
	'page.communicate.caaRoutinesIntro':
		'Importieren Sie eine vorgefertigte visuelle Routine in Organisieren, um Kommunikationssituationen vorzubereiten.',
	'page.teacher.journeyTitle': 'Lehrerablauf',
	'page.teacher.companionJourneyTitle': 'Begleiterablauf',
	'page.teacher.journeyIntro':
		'Folgen Sie diesen Schritten, um eine Zusammenfassung der Anpassungen vorzubereiten oder einzusehen. Accessible stellt keine Diagnose.',
	'page.teacher.journeyProgress': 'Fortschritt des Lehrerablaufs',
	'page.teacher.modeRequired':
		'Aktivieren Sie den Lehrer- oder Begleitmodus unter Einstellungen → Nutzungsmodus, um auf diesen Ablauf zuzugreifen.',
	'page.teacher.backHome': 'Zurück zur Startseite',
	'home.teacher.journeyLink': 'Geführter Lehrerablauf',
	'home.teacher.journeyLinkDesc':
		'Schritte zum Einsehen, Exportieren und Vorbereiten eines Gesprächs.',
	'page.profile.title': 'Mein Profil',
	'page.notes.title': 'Meine Notizen',
	'page.notes.intro':
		'Erstellen Sie strukturierte Notizen auf Ihrem Gerät. Export als Markdown. Cornell-Format für Unterricht und Wiederholung verfügbar.',
	'page.memorize.title': 'Mit Karteikarten lernen',
	'page.memorize.intro':
		'Erstellen Sie Frage-/Antwort-Karten und wiederholen Sie in Ihrem Tempo. Alles bleibt auf Ihrem Gerät.',
	'page.settings.title': 'Einstellungen',
	'home.teacher.title': 'Lehrerbereich',
	'home.teacher.companionTitle': 'Begleiterbereich',
	'home.teacher.intro':
		'Bereiten Sie eine Zusammenfassung der Anpassungen vor oder sehen Sie sie ein. Die Daten bleiben auf diesem Gerät. Accessible stellt keine Diagnose.',
	'home.expert.title': 'Expertenmodus',
	'home.expert.intro':
		'Alle erweiterten Einstellungen sind sichtbar. Sehen Sie sich die detaillierten Einstellungen oder die Bereiche jedes Moduls an.',
	'dash.read_text.label': 'Einen Text lesen',
	'dash.read_text.desc': 'Text einfügen und Anzeige anpassen.',
	'dash.adapt_document.label': 'Ein Dokument anpassen',
	'dash.adapt_document.desc': 'Schriftart, Größe und Hintergrund eines Textes ändern.',
	'dash.write_text.label': 'Einen Text schreiben',
	'dash.write_text.desc': 'Einfacher Editor mit Schreibunterstützung.',
	'dash.correct_text.label': 'Meinen Text korrigieren',
	'dash.correct_text.desc': 'Rechtschreibprüfung Schritt für Schritt.',
	'dash.organize_work.label': 'Meine Arbeit organisieren',
	'dash.organize_work.desc': 'Checklisten, Schritte und Planung.',
	'dash.take_notes.label': 'Notizen machen',
	'dash.take_notes.desc': 'Lokale Notizen mit Markdown-Export.',
	'dash.study_flashcards.label': 'Mit Karten wiederholen',
	'dash.study_flashcards.desc': 'Frage-/Antwort-Karteikarten.',
	'dash.arasaac_pictograms.label': 'Ein Piktogramm suchen',
	'dash.arasaac_pictograms.desc': 'ARASAAC für Ihre UK-Karten importieren.',
	'dash.understand_instruction.label': 'Eine Aufgabe verstehen',
	'dash.understand_instruction.desc': 'Eine Aufgabe zerlegen und vereinfachen.',
	'dash.prepare_appointment.label': 'Einen Termin vorbereiten',
	'dash.prepare_appointment.desc': 'Profil ansehen und Zusammenfassung vorbereiten.',
	'dash.export_synthesis.label': 'Meine Zusammenfassung exportieren',
	'dash.export_synthesis.desc': 'JSON oder PDF auf Ihr Gerät herunterladen.',
	'dash.teacher.export_synthesis.label': 'PDF-Zusammenfassung exportieren',
	'dash.teacher.export_synthesis.desc':
		'Zusammenfassung für ein Gespräch oder einen Termin herunterladen.',
	'dash.teacher.import_profile.label': 'JSON-Profil importieren',
	'dash.teacher.import_profile.desc':
		'Von einem Schüler exportierte Einstellungen einsehen.',
	'dash.teacher.view_profile.label': 'Aktives Profil anzeigen',
	'dash.teacher.view_profile.desc':
		'Funktionale Bedürfnisse, aktivierte Werkzeuge und Einstellungen.',
	'dash.expert.expert_settings.label': 'Erweiterte Einstellungen',
	'dash.expert.expert_settings.desc': 'Typografie, motorische Barrierefreiheit, Kommunikation.',
	'dash.expert.expert_reading.label': 'Erweitertes Lesen',
	'dash.expert.expert_reading.desc':
		'Text einfügen, Piper-TTS und erweiterte Typografie.',
	'dash.expert.expert_storage.label': 'Detaillierter Speicher',
	'dash.expert.expert_storage.desc':
		'SQLite-Pfade, Tabellenzähler, portabler Modus.',
	'onboard.progress.choice': 'Ablauf wählen',
	'onboard.start.title': 'Wie möchten Sie beginnen?',
	'onboard.start.hint': 'Eine Idee pro Option. Sie können alles später ändern.',
	'onboard.known.title': 'Ich kenne meine Bedürfnisse bereits',
	'onboard.known.desc': 'Direkt die Werkzeuge wählen, die mich interessieren.',
	'onboard.declared.title': 'Ich habe bereits eine Diagnose oder Anerkennung',
	'onboard.declared.desc':
		'Ein deklariertes administratives oder medizinisches Profil angeben.',
	'onboard.discovery.title': 'Ich bin mir nicht sicher',
	'onboard.discovery.desc': 'Geführter Ablauf zur Erkennung meiner Bedürfnisse.',
	'onboard.discovery.comfort.intro':
		'Testen Sie den Komfort der Oberfläche. Änderungen sind sofort sichtbar.',
	'onboard.discovery.step.reading.intro':
		'Fügen Sie einen Text ein, ändern Sie Schriftart und Größe oder hören Sie mit der Sprachsynthese.',
	'onboard.discovery.step.writing.intro':
		'Schreiben Sie einen einfachen Text oder korrigieren Sie ihn Schritt für Schritt mit Rechtschreibhilfe.',
	'onboard.discovery.step.organization.intro':
		'Teilen Sie die Arbeit in Checklisten, Timer oder Kanban-Karten auf.',
	'onboard.discovery.step.media.intro':
		'Importieren Sie eine Audio- oder Videodatei, stellen Sie die Geschwindigkeit ein und lesen Sie das Transkript vor.',
	'onboard.discovery.step.sensory.intro':
		'Testen Sie sensorische Einstellungen: Animationen, Töne und Benachrichtigungen.',
	'onboard.discovery.step.motor.intro':
		'Stellen Sie Schaltflächengröße, Klickzeit, Sprachdiktat und Bestätigungen ein.',
	'onboard.discovery.step.communication.intro':
		'Kommunikationskarten und ARASAAC-Piktogramme, um Ihre Bedürfnisse auszudrücken.',
	'onboard.discovery.step.summary.intro':
		'Das haben wir während dieses Ablaufs notiert. Sie können die Zusammenfassung jederzeit vervollständigen.',
	'onboard.discovery.step.summary.detail':
		'Sehen Sie unter Mein Profil Ihre Bedürfnisse und Anpassungen ein. Exportieren Sie eine PDF- oder JSON-Zusammenfassung aus den Einstellungen.',
	'onboard.discovery.openModule': 'Dieses Modul öffnen',
	'onboard.discovery.stub.hint': 'Sie können diesen Schritt überspringen oder später zurückkehren.',
	'onboard.known.heading': 'Welche Werkzeuge interessieren Sie?',
	'onboard.declared.heading': 'Deklarierte Profile',
	'onboard.declared.review.heading': 'Vorgeschlagene Einstellungen',
	'onboard.comfort.heading': 'Oberflächenkomfort',
	'onboard.comfort.previewHint':
		'Testen Sie diese Einstellungen. Die Vorschau aktualisiert sich sofort.',
	'onboard.complete.heading': 'Ablauf gespeichert',
	'onboard.complete.body':
		'Ihre Auswahl ist gespeichert. Sie können sie jederzeit ändern.',
	'error.notFound.title': 'Seite nicht gefunden',
	'error.notFound.body': 'Dieser Bereich ist noch nicht verfügbar.',
	'unlock.title': 'Geschütztes Profil',
	'unlock.hint':
		'Ihr Profil ist auf diesem Gerät verschlüsselt. Geben Sie Ihr Passwort ein, um fortzufahren.',
	'unlock.warning':
		'Wenn Sie Ihr Passwort vergessen, können Ihre Daten nicht wiederhergestellt werden.',
	'unlock.passwordLabel': 'Passwort',
	'unlock.submit': 'Entsperren',
	'unlock.submitting': 'Wird entsperrt…',
	'crisis.title': 'Pausenmodus',
	'crisis.hint': 'Nehmen Sie sich Zeit. Setzen Sie fort, wenn Sie möchten.',
	'crisis.resume': 'Fortsetzen'
};
