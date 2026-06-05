import type { ExtendedUiKey } from '../../ui-extended';

export const EXTENDED_HI: Partial<Record<ExtendedUiKey, string>> = {
	'home.welcome.line1': 'Accessible निदान नहीं करता।',
	'home.welcome.line2': 'Accessible आपकी ज़रूरतें पहचानने में मदद करता है।',
	'home.welcome.line3': 'Accessible आपको अलग-अलग सेटिंग्स आज़माने में मदद करता है।',
	'home.welcome.line4': 'Accessible ज़रूरत पड़ने पर मुलाकात की तैयारी में मदद करता है।',
	'common.readAloud': 'ज़ोर से पढ़ें',
	'common.internetOn': 'इंटरनेट चालू',
	'common.internetOff': 'इंटरनेट बंद',
	'common.internetEnable': 'इंटरनेट एक्सेस चालू करें',
	'common.internetDisable': 'इंटरनेट एक्सेस बंद करें',
	'common.stopReading': 'पढ़ना रोकें',
	'common.loading': 'लोड हो रहा है…',
	'common.backHome': 'होम पर वापस',
	'common.skipToContent': 'सामग्री पर जाएँ',
	'footer.disclaimer': 'Accessible निदान नहीं करता।',
	'banner.guest': 'अतिथि मोड चालू — आपकी सेटिंग्स सहेजी नहीं जाती।',
	'banner.teacher': 'शिक्षक मोड — अनुकूलन का सारांश देखें या निर्यात करें।',
	'banner.companion': 'साथी मोड — मुलाकात की तैयारी में मदद।',
	'banner.verySimple': 'बहुत सरल इंटरफ़ेस — बड़े बटन और छोटे पाठ।',
	'banner.expert': 'विशेषज्ञ मोड — सभी उन्नत सेटिंग्स दिखती हैं।',
	'intro.title': 'Accessible में आपका स्वागत है',
	'intro.lead':
		'Accessible पढ़ने, लिखने, संगठन और संचार को अनुकूल बनाने वाला स्थानीय ऐप है।',
	'intro.audience':
		'यह उन लोगों के लिए है जिन्हें अधिक पढ़ने योग्य, शांत या अनुमानित वातावरण चाहिए, निदान हो या न हो, और साथियों व शिक्षकों के लिए भी।',
	'intro.use':
		'शुरुआत में केवल उपयोगी हिस्से रखने के लिए निर्देशित मार्ग से शुरू करें। सेटिंग्स आज़माई, बदली और सारांश के रूप में निर्यात की जा सकती हैं।',
	'intro.featuresTitle': 'उपलब्ध सुविधाएँ',
	'intro.feature.read':
		'पढ़ना: फ़ॉन्ट, आकार, पृष्ठभूमि, टेक्स्ट-टू-स्पीच, छवि या PDF OCR और ऑडियो/वीडियो सहायता।',
	'intro.feature.write':
		'लिखना और समझना: सरल संपादक, शब्द भविष्यवाणी, इंजन स्थापित होने पर सुधार, चरणों में निर्देश।',
	'intro.feature.organize':
		'संगठन, नोट्स, याद करना: चेकलिस्ट, टाइमर, Kanban, रूटीन, Cornell नोट्स और फ्लैशकार्ड।',
	'intro.feature.communicate':
		'संचार और तैयारी: CAA कार्ड, चित्र, जरूरत प्रोफ़ाइल और JSON, PDF, ODT या DOCX निर्यात।',
	'intro.privacy':
		'डेटा इसी डिवाइस पर रहता है। Accessible निदान नहीं करता और किसी पेशेवर का विकल्प नहीं है।',
	'intro.continue': 'जारी रखें',
	'intro.dismiss': 'फिर न दिखाएँ',
	'crisis.ariaActivate': 'विराम मोड चालू करें',
	'page.read.title': 'एक पाठ पढ़ें',
	'page.read.intro':
		'एक पाठ चिपकाएँ या उदाहरण का उपयोग करें। सेटिंग्स बदलें और अपनी पसंद सहेजें।',
	'page.read.tab.read': 'पढ़ना',
	'page.read.tab.compare': 'तुलना',
	'page.read.tab.media': 'ऑडियो / वीडियो',
	'page.read.inputLabel': 'आपका पाठ',
	'page.read.useSample': 'उदाहरण पाठ उपयोग करें',
	'page.read.preview': 'पूर्वावलोकन',
	'page.read.previewEmpty': 'पूर्वावलोकन देखने के लिए एक पाठ चिपकाएँ।',
	'page.read.distractionBanner':
		'विचलन रहित मोड। केवल नीचे का पाठ दिखता है।',
	'page.read.distractionExit': 'इस मोड से बाहर निकलें',
	'page.notes.formatLegend': 'नोट का प्रारूप',
	'page.notes.formatSimple': 'सरल नोट',
	'page.notes.formatCornell': 'Cornell प्रारूप',
	'page.notes.titleLabel': 'शीर्षक',
	'page.notes.bodyLabel': 'सामग्री',
	'page.notes.cornellCue': 'मुख्य शब्द / प्रश्न (बायाँ स्तंभ)',
	'page.notes.cornellBody': 'पाठ्य नोट्स (मुख्य क्षेत्र)',
	'page.notes.cornellSummary': 'सारांश (नीचे)',
	'page.write.title': 'एक पाठ लिखें',
	'page.write.intro':
		'लिखें या एक पाठ चिपकाएँ। तेज़ लिखने के लिए शब्द पूर्वानुमान चालू करें। Hunspell (वर्तनी) और Grammalecte (व्याकरण) डेस्कटॉप ऐप में काम करते हैं, यदि इंस्टॉल हों।',
	'page.organize.title': 'अपना काम व्यवस्थित करें',
	'page.organize.intro':
		'काम को छोटे चरणों में बाँटें। टाइमर, Kanban बोर्ड या चेकलिस्ट का उपयोग करें। सब इस उपकरण पर सहेजा जाता है।',
	'page.understand.title': 'एक कार्य समझें',
	'page.understand.intro':
		'पाठ्य कार्य, गृहकार्य या ईमेल चिपकाएँ जो आपको लिखना है। Accessible इसे चरणों में बाँटता है और आसान पढ़ने वाला संस्करण सुझाता है।',
	'page.communicate.title': 'संवाद',
	'page.communicate.intro':
		'दिखाने या ज़ोर से पढ़ने के लिए एक कार्ड चुनें। कक्षा, काम या रोज़मर्रा में उपयोगी। ARASAAC चित्र प्रतीक भी आयात कर सकते हैं (अगला खंड)।',
	'page.communicate.scenarios': 'आम स्थितियाँ',
	'page.communicate.socialScenarios': 'मार्गदर्शित सामाजिक परिदृश्य',
	'page.communicate.socialScenariosIntro':
		'हर क्षण सुझाए गए कार्ड के साथ चरण दर चरण एक परिदृश्य पूरा करें।',
	'page.communicate.caaRoutines': 'AAC दिनचर्याएँ',
	'page.communicate.caaRoutinesIntro':
		'संवाद स्थितियों की तैयारी के लिए व्यवस्थित करें में एक तैयार दृश्य दिनचर्या आयात करें।',
	'page.teacher.journeyTitle': 'शिक्षक का मार्ग',
	'page.teacher.companionJourneyTitle': 'साथी का मार्ग',
	'page.teacher.journeyIntro':
		'अनुकूलन का सारांश तैयार करने या देखने के लिए इन चरणों का पालन करें। Accessible निदान नहीं करता।',
	'page.teacher.journeyProgress': 'शिक्षक मार्ग की प्रगति',
	'page.teacher.modeRequired':
		'इस मार्ग तक पहुँचने के लिए सेटिंग्स → उपयोग मोड में शिक्षक या साथी मोड चालू करें।',
	'page.teacher.backHome': 'होम पर वापस',
	'home.teacher.journeyLink': 'मार्गदर्शित शिक्षक मार्ग',
	'home.teacher.journeyLinkDesc':
		'बातचीत देखने, निर्यात करने और तैयार करने के चरण।',
	'page.profile.title': 'मेरा प्रोफ़ाइल',
	'page.notes.title': 'मेरे नोट्स',
	'page.notes.intro':
		'अपने उपकरण पर संरचित नोट्स बनाएँ। Markdown निर्यात। पाठ और दोहराव के लिए Cornell प्रारूप उपलब्ध।',
	'page.memorize.title': 'फ़्लैशकार्ड से पढ़ें',
	'page.memorize.intro':
		'प्रश्न/उत्तर कार्ड बनाएँ और अपनी गति से दोहराएँ। सब आपके उपकरण पर रहता है।',
	'page.settings.title': 'सेटिंग्स',
	'home.teacher.title': 'शिक्षक क्षेत्र',
	'home.teacher.companionTitle': 'साथी क्षेत्र',
	'home.teacher.intro':
		'अनुकूलन का सारांश तैयार करें या देखें। डेटा इस उपकरण पर रहता है। Accessible निदान नहीं करता।',
	'home.expert.title': 'विशेषज्ञ मोड',
	'home.expert.intro':
		'सभी उन्नत सेटिंग्स दिखती हैं। विस्तृत सेटिंग्स या प्रत्येक मॉड्यूल के क्षेत्र देखें।',
	'dash.read_text.label': 'एक पाठ पढ़ें',
	'dash.read_text.desc': 'पाठ चिपकाएँ और प्रदर्शन अनुकूलित करें।',
	'dash.adapt_document.label': 'दस्तावेज़ अनुकूलित करें',
	'dash.adapt_document.desc': 'पाठ का फ़ॉन्ट, आकार और पृष्ठभूमि बदलें।',
	'dash.write_text.label': 'एक पाठ लिखें',
	'dash.write_text.desc': 'लेखन सहायता वाला सरल संपादक।',
	'dash.correct_text.label': 'अपना पाठ सुधारें',
	'dash.correct_text.desc': 'वर्तनी कदम दर कदम जाँचें।',
	'dash.organize_work.label': 'अपना काम व्यवस्थित करें',
	'dash.organize_work.desc': 'चेकलिस्ट, चरण और योजना।',
	'dash.take_notes.label': 'नोट्स लिखें',
	'dash.take_notes.desc': 'Markdown निर्यात वाले स्थानीय नोट्स।',
	'dash.study_flashcards.label': 'कार्ड से दोहराएँ',
	'dash.study_flashcards.desc': 'प्रश्न/उत्तर फ़्लैशकार्ड।',
	'dash.arasaac_pictograms.label': 'चित्र प्रतीक खोजें',
	'dash.arasaac_pictograms.desc': 'AAC कार्ड के लिए ARASAAC आयात करें।',
	'dash.understand_instruction.label': 'एक कार्य समझें',
	'dash.understand_instruction.desc': 'कार्य को बाँटें और सरल बनाएँ।',
	'dash.prepare_appointment.label': 'मुलाकात की तैयारी',
	'dash.prepare_appointment.desc': 'प्रोफ़ाइल देखें और सारांश तैयार करें।',
	'dash.export_synthesis.label': 'अपना सारांश निर्यात करें',
	'dash.export_synthesis.desc': 'JSON या PDF अपने उपकरण पर डाउनलोड करें।',
	'dash.teacher.export_synthesis.label': 'PDF सारांश निर्यात',
	'dash.teacher.export_synthesis.desc':
		'बातचीत या मुलाकात के लिए सारांश डाउनलोड करें।',
	'dash.teacher.import_profile.label': 'JSON प्रोफ़ाइल आयात',
	'dash.teacher.import_profile.desc':
		'छात्र द्वारा निर्यात की गई सेटिंग्स देखें।',
	'dash.teacher.view_profile.label': 'सक्रिय प्रोफ़ाइल देखें',
	'dash.teacher.view_profile.desc':
		'कार्यात्मक ज़रूरतें, चालू उपकरण और सेटिंग्स।',
	'dash.expert.expert_settings.label': 'उन्नत सेटिंग्स',
	'dash.expert.expert_settings.desc': 'टाइपोग्राफी, मोटर पहुँच, संवाद।',
	'dash.expert.expert_reading.label': 'उन्नत पढ़ना',
	'dash.expert.expert_reading.desc':
		'पाठ चिपकाएँ, Piper TTS और उन्नत टाइपोग्राफी।',
	'dash.expert.expert_storage.label': 'विस्तृत संग्रहण',
	'dash.expert.expert_storage.desc':
		'SQLite पथ, तालिका गणना, पोर्टेबल मोड।',
	'onboard.progress.choice': 'मार्ग चुनें',
	'onboard.start.title': 'आप कैसे शुरू करना चाहते हैं?',
	'onboard.start.hint': 'प्रत्येक विकल्प में एक विचार। बाद में सब बदल सकते हैं।',
	'onboard.known.title': 'मुझे अपनी ज़रूरतें पहले से पता हैं',
	'onboard.known.desc': 'सीधे अपने काम के उपकरण चुनें।',
	'onboard.declared.title': 'मेरे पास पहले से निदान या मान्यता है',
	'onboard.declared.desc':
		'घोषित प्रशासनिक या चिकित्सा प्रोफ़ाइल बताएँ।',
	'onboard.discovery.title': 'मुझे यकीन नहीं',
	'onboard.discovery.desc': 'अपनी ज़रूरतें पहचानने के लिए मार्गदर्शित मार्ग।',
	'onboard.discovery.comfort.intro':
		'इंटरफ़ेस की सुविधा आज़माएँ। बदलाव तुरंत दिखते हैं।',
	'onboard.discovery.step.reading.intro':
		'पाठ चिपकाएँ, फ़ॉन्ट और आकार बदलें या आवाज़ संश्लेषण से सुनें।',
	'onboard.discovery.step.writing.intro':
		'सरल पाठ लिखें या वर्तनी सहायता से कदम दर कदम सुधारें।',
	'onboard.discovery.step.organization.intro':
		'काम को चेकलिस्ट, टाइमर या Kanban कार्ड में बाँटें।',
	'onboard.discovery.step.media.intro':
		'ऑडियो या वीडियो फ़ाइल आयात करें, गति सेट करें और प्रतिलेख पढ़ें।',
	'onboard.discovery.step.sensory.intro':
		'संवेदी सेटिंग्स आज़माएँ: एनिमेशन, ध्वनि और सूचनाएँ।',
	'onboard.discovery.step.motor.intro':
		'बटन का आकार, क्लिक समय, आवाज़ से लिखना और पुष्टि सेट करें।',
	'onboard.discovery.step.communication.intro':
		'अपनी ज़रूरत बताने के लिए संवाद कार्ड और ARASAAC चित्र प्रतीक।',
	'onboard.discovery.step.summary.intro':
		'इस मार्ग के दौरान हमने यह नोट किया। सारांश कभी भी पूरा कर सकते हैं।',
	'onboard.discovery.step.summary.detail':
		'मेरा प्रोफ़ाइल में अपनी ज़रूरतें और अनुकूलन देखें। सेटिंग्स से PDF या JSON सारांश निर्यात करें।',
	'onboard.discovery.openModule': 'यह मॉड्यूल खोलें',
	'onboard.discovery.stub.hint': 'यह चरण छोड़ सकते हैं या बाद में वापस आ सकते हैं।',
	'onboard.known.heading': 'कौन से उपकरण आपको रुचिकर हैं?',
	'onboard.declared.heading': 'घोषित प्रोफ़ाइल',
	'onboard.declared.review.heading': 'सुझाई गई सेटिंग्स',
	'onboard.comfort.heading': 'इंटरफ़ेस की सुविधा',
	'onboard.comfort.previewHint':
		'इन सेटिंग्स को आज़माएँ। पूर्वावलोकन तुरंत अपडेट होता है।',
	'onboard.complete.heading': 'मार्ग सहेजा गया',
	'onboard.complete.body':
		'आपकी पसंद सहेजी गई। कभी भी बदल सकते हैं।',
	'error.notFound.title': 'पृष्ठ नहीं मिला',
	'error.notFound.body': 'यह क्षेत्र अभी उपलब्ध नहीं है।',
	'unlock.title': 'सुरक्षित प्रोफ़ाइल',
	'unlock.hint':
		'आपका प्रोफ़ाइल इस उपकरण पर एन्क्रिप्ट है। जारी रखने के लिए पासवर्ड दर्ज करें।',
	'unlock.warning':
		'यदि पासवर्ड भूल गए, तो आपका डेटा पुनर्प्राप्त नहीं हो सकता।',
	'unlock.passwordLabel': 'पासवर्ड',
	'unlock.submit': 'अनलॉक करें',
	'unlock.submitting': 'अनलॉक हो रहा है…',
	'crisis.title': 'विराम मोड',
	'crisis.hint': 'अपना समय लें। जब चाहें फिर शुरू करें।',
	'crisis.resume': 'जारी रखें'
};
