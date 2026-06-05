import type { ExtendedUiKey } from '../../ui-extended';

export const EXTENDED_AR: Partial<Record<ExtendedUiKey, string>> = {
	'home.welcome.line1': 'Accessible لا يقدّم تشخيصاً.',
	'home.welcome.line2': 'Accessible يساعدك على التعرّف إلى احتياجاتك.',
	'home.welcome.line3': 'Accessible يساعدك على تجربة إعدادات مختلفة.',
	'home.welcome.line4': 'Accessible يساعدك عند الحاجة على تحضير موعد.',
	'common.readAloud': 'قراءة بصوت عالٍ',
	'common.internetOn': 'الإنترنت مفعّل',
	'common.internetOff': 'الإنترنت معطّل',
	'common.internetEnable': 'تفعيل الوصول إلى الإنترنت',
	'common.internetDisable': 'تعطيل الوصول إلى الإنترنت',
	'common.stopReading': 'إيقاف القراءة',
	'common.loading': 'جارٍ التحميل…',
	'common.backHome': 'العودة إلى الرئيسية',
	'common.skipToContent': 'الانتقال إلى المحتوى',
	'footer.disclaimer': 'Accessible لا يقدّم تشخيصاً.',
	'banner.guest': 'وضع الضيف — لا تُحفظ إعداداتك.',
	'banner.teacher':
		'وضع المعلّم — اطّلع على ملخص التكييفات أو صدّره.',
	'banner.companion': 'وضع المرافق — المساعدة في تحضير موعد.',
	'banner.verySimple': 'واجهة بسيطة جداً — أزرار كبيرة ونصوص قصيرة.',
	'banner.expert': 'وضع الخبير — كل الإعدادات المتقدمة ظاهرة.',
	'intro.title': 'مرحبًا بك في Accessible',
	'intro.lead': 'Accessible تطبيق محلي لتكييف القراءة والكتابة والتنظيم والتواصل.',
	'intro.audience':
		'هو موجّه إلى الأشخاص الذين يحتاجون إلى بيئة أوضح أو أهدأ أو أكثر قابلية للتوقع، مع تشخيص أو بدونه، وكذلك إلى المرافقين والمعلمين.',
	'intro.use':
		'ابدأ بالمسار الإرشادي لإبقاء المناطق المفيدة فقط في البداية. يمكن تجربة الإعدادات وتعديلها وتصديرها في ملخص.',
	'intro.featuresTitle': 'الوظائف المتاحة',
	'intro.feature.read':
		'القراءة: الخط والحجم والخلفية والقراءة الصوتية وOCR للصور أو PDF ودعم الصوت/الفيديو.',
	'intro.feature.write':
		'الكتابة والفهم: محرر بسيط، تنبؤ بالكلمات، تصحيح عند تثبيت المحركات، وتعليمات مقسمة إلى خطوات.',
	'intro.feature.organize':
		'التنظيم والملاحظات والحفظ: قوائم، مؤقت، كانبان، روتينات، ملاحظات Cornell وبطاقات مراجعة.',
	'intro.feature.communicate':
		'التواصل والتحضير: بطاقات CAA، رموز مصورة، ملف احتياجات وتصدير JSON أو PDF أو ODT أو DOCX.',
	'intro.privacy':
		'تبقى البيانات على هذا الجهاز. لا يقدم Accessible تشخيصًا ولا يحل محل المختص.',
	'intro.continue': 'متابعة',
	'intro.dismiss': 'عدم العرض مرة أخرى',
	'crisis.ariaActivate': 'تفعيل وضع الاستراحة',
	'page.read.title': 'قراءة نص',
	'page.read.intro':
		'الصق نصاً أو استخدم المثال. غيّر الإعدادات واحفظ تفضيلاتك.',
	'page.read.tab.read': 'قراءة',
	'page.read.tab.compare': 'مقارنة',
	'page.read.tab.media': 'صوت / فيديو',
	'page.read.inputLabel': 'نصك',
	'page.read.useSample': 'استخدام النص النموذجي',
	'page.read.preview': 'معاينة',
	'page.read.previewEmpty': 'الصق نصاً لعرض المعاينة.',
	'page.read.distractionBanner':
		'وضع بلا تشتيت. يُعرض النص أدناه فقط.',
	'page.read.distractionExit': 'الخروج من هذا الوضع',
	'page.notes.formatLegend': 'تنسيق الملاحظة',
	'page.notes.formatSimple': 'ملاحظة بسيطة',
	'page.notes.formatCornell': 'تنسيق Cornell',
	'page.notes.titleLabel': 'العنوان',
	'page.notes.bodyLabel': 'المحتوى',
	'page.notes.cornellCue': 'كلمات مفتاحية / أسئلة (العمود الأيسر)',
	'page.notes.cornellBody': 'ملاحظات الدرس (المنطقة الرئيسية)',
	'page.notes.cornellSummary': 'ملخص (أسفل)',
	'page.write.title': 'كتابة نص',
	'page.write.intro':
		'اكتب أو الصق نصاً. فعّل توقّع الكلمات للكتابة أسرع. Hunspell (إملاء) وGrammalecte (نحو) يعملان في تطبيق سطح المكتب عند التثبيت.',
	'page.organize.title': 'تنظيم عملي',
	'page.organize.intro':
		'قسّم العمل إلى خطوات صغيرة. استخدم المؤقت أو لوحة Kanban أو قوائم التحقق. يُحفظ كل شيء على هذا الجهاز.',
	'page.understand.title': 'فهم تعليمات',
	'page.understand.intro':
		'الصق تكليفاً دراسياً أو واجباً منزلياً أو بريداً يجب كتابته. Accessible يقسّمه إلى خطوات ويقترح نسخة أسهل للقراءة.',
	'page.communicate.title': 'التواصل',
	'page.communicate.intro':
		'اختر بطاقة لعرضها أو قراءتها بصوت عالٍ. مفيد في الصف أو العمل أو الحياة اليومية. يمكنك أيضاً استيراد رموز ARASAAC (القسم التالي).',
	'page.communicate.scenarios': 'مواقف شائعة',
	'page.communicate.socialScenarios': 'سيناريوهات اجتماعية موجّهة',
	'page.communicate.socialScenariosIntro':
		'اتبع سيناريو خطوة بخطوة مع البطاقات المقترحة في كل لحظة.',
	'page.communicate.caaRoutines': 'روتينات AAC',
	'page.communicate.caaRoutinesIntro':
		'استورد روتيناً بصرياً جاهزاً إلى التنظيم لتحضير مواقف التواصل.',
	'page.teacher.journeyTitle': 'مسار المعلّم',
	'page.teacher.companionJourneyTitle': 'مسار المرافق',
	'page.teacher.journeyIntro':
		'اتبع هذه الخطوات لتحضير ملخص التكييفات أو الاطّلاع عليه. Accessible لا يقدّم تشخيصاً.',
	'page.teacher.journeyProgress': 'تقدّم مسار المعلّم',
	'page.teacher.modeRequired':
		'فعّل وضع المعلّم أو المرافق في الإعدادات ← وضع الاستخدام للوصول إلى هذا المسار.',
	'page.teacher.backHome': 'العودة إلى الرئيسية',
	'home.teacher.journeyLink': 'مسار المعلّم الموجّه',
	'home.teacher.journeyLinkDesc':
		'خطوات للاطّلاع والتصدير وتحضير مقابلة.',
	'page.profile.title': 'ملفي',
	'page.notes.title': 'ملاحظاتي',
	'page.notes.intro':
		'أنشئ ملاحظات منظمة على جهازك. تصدير Markdown. تنسيق Cornell متاح للدرس والمراجعة.',
	'page.memorize.title': 'التعلّم ببطاقات',
	'page.memorize.intro':
		'أنشئ بطاقات سؤال/جواب وراجع بوتيرتك. يبقى كل شيء على جهازك.',
	'page.settings.title': 'الإعدادات',
	'home.teacher.title': 'منطقة المعلّم',
	'home.teacher.companionTitle': 'منطقة المرافق',
	'home.teacher.intro':
		'حضّر ملخص التكييفات أو اطّلع عليه. البيانات تبقى على هذا الجهاز. Accessible لا يقدّم تشخيصاً.',
	'home.expert.title': 'وضع الخبير',
	'home.expert.intro':
		'كل الإعدادات المتقدمة ظاهرة. اطّلع على الإعدادات التفصيلية أو مناطق كل وحدة.',
	'dash.read_text.label': 'قراءة نص',
	'dash.read_text.desc': 'الصق نصاً وكيّف العرض.',
	'dash.adapt_document.label': 'تكييف مستند',
	'dash.adapt_document.desc': 'تغيير الخط والحجم وخلفية النص.',
	'dash.write_text.label': 'كتابة نص',
	'dash.write_text.desc': 'محرّر بسيط مع دعم الكتابة.',
	'dash.correct_text.label': 'تصحيح نصي',
	'dash.correct_text.desc': 'تدقيق إملائي خطوة بخطوة.',
	'dash.organize_work.label': 'تنظيم عملي',
	'dash.organize_work.desc': 'قوائم تحقق وخطوات وتخطيط.',
	'dash.take_notes.label': 'تدوين ملاحظات',
	'dash.take_notes.desc': 'ملاحظات محلية مع تصدير Markdown.',
	'dash.study_flashcards.label': 'المراجعة ببطاقات',
	'dash.study_flashcards.desc': 'بطاقات سؤال/جواب.',
	'dash.arasaac_pictograms.label': 'البحث عن رمز',
	'dash.arasaac_pictograms.desc': 'استيراد ARASAAC لبطاقات AAC.',
	'dash.understand_instruction.label': 'فهم تعليمات',
	'dash.understand_instruction.desc': 'تقسيم تعليمات وتبسيطها.',
	'dash.prepare_appointment.label': 'تحضير موعد',
	'dash.prepare_appointment.desc': 'عرض الملف الشخصي وتحضير الملخص.',
	'dash.export_synthesis.label': 'تصدير ملخصي',
	'dash.export_synthesis.desc': 'تنزيل JSON أو PDF إلى جهازك.',
	'dash.teacher.export_synthesis.label': 'تصدير ملخص PDF',
	'dash.teacher.export_synthesis.desc':
		'تنزيل ملخص لمقابلة أو موعد.',
	'dash.teacher.import_profile.label': 'استيراد ملف JSON',
	'dash.teacher.import_profile.desc':
		'اطّلع على إعدادات صدّرها تلميذ.',
	'dash.teacher.view_profile.label': 'عرض الملف النشط',
	'dash.teacher.view_profile.desc':
		'الاحتياجات الوظيفية والأدوات المفعّلة والإعدادات.',
	'dash.expert.expert_settings.label': 'إعدادات متقدمة',
	'dash.expert.expert_settings.desc': 'طباعة، إتاحة حركية، تواصل.',
	'dash.expert.expert_reading.label': 'قراءة متقدمة',
	'dash.expert.expert_reading.desc':
		'الصق نصاً، Piper TTS وطباعة متقدمة.',
	'dash.expert.expert_storage.label': 'تخزين مفصّل',
	'dash.expert.expert_storage.desc':
		'مسارات SQLite، عدادات الجداول، الوضع المحمول.',
	'onboard.progress.choice': 'اختيار المسار',
	'onboard.start.title': 'كيف تريد البدء؟',
	'onboard.start.hint': 'فكرة واحدة لكل خيار. يمكنك تغيير كل شيء لاحقاً.',
	'onboard.known.title': 'أعرف احتياجاتي مسبقاً',
	'onboard.known.desc': 'اختيار الأدوات التي تهمّني مباشرة.',
	'onboard.declared.title': 'لديّ تشخيص أو اعتراف مسبقاً',
	'onboard.declared.desc':
		'ذكر ملف إداري أو طبي مصرّح به.',
	'onboard.discovery.title': 'لست متأكداً',
	'onboard.discovery.desc': 'مسار موجّه لاكتشاف احتياجاتي.',
	'onboard.discovery.comfort.intro':
		'جرّب راحة الواجهة. التغييرات تظهر فوراً.',
	'onboard.discovery.step.reading.intro':
		'الصق نصاً، غيّر الخط والحجم أو استمع بالتوليف الصوتي.',
	'onboard.discovery.step.writing.intro':
		'اكتب نصاً بسيطاً أو صحّحه خطوة بخطوة بمساعدة إملائية.',
	'onboard.discovery.step.organization.intro':
		'قسّم العمل إلى قوائم تحقق أو مؤقت أو بطاقات Kanban.',
	'onboard.discovery.step.media.intro':
		'استورد ملف صوت أو فيديو، اضبط السرعة واقرأ النص المكتوب بصوت عالٍ.',
	'onboard.discovery.step.sensory.intro':
		'جرّب إعدادات حسّية: حركات وأصوات وإشعارات.',
	'onboard.discovery.step.motor.intro':
		'اضبط حجم الأزرار ووقت النقر والإملاء الصوتي والتأكيدات.',
	'onboard.discovery.step.communication.intro':
		'بطاقات تواصل ورموز ARASAAC للتعبير عن احتياجاتك.',
	'onboard.discovery.step.summary.intro':
		'ما سجّلناه خلال هذا المسار. يمكنك إكمال الملخص في أي وقت.',
	'onboard.discovery.step.summary.detail':
		'اطّلع في ملفي على احتياجاتك وتكييفاتك. صدّر ملخص PDF أو JSON من الإعدادات.',
	'onboard.discovery.openModule': 'فتح هذه الوحدة',
	'onboard.discovery.stub.hint': 'يمكنك تخطي هذه الخطوة أو العودة لاحقاً.',
	'onboard.known.heading': 'ما الأدوات التي تهمّك؟',
	'onboard.declared.heading': 'الملفات المصرّح بها',
	'onboard.declared.review.heading': 'إعدادات مقترحة',
	'onboard.comfort.heading': 'راحة الواجهة',
	'onboard.comfort.previewHint':
		'جرّب هذه الإعدادات. تتحدّث المعاينة فوراً.',
	'onboard.complete.heading': 'تم حفظ المسار',
	'onboard.complete.body':
		'اختياراتك محفوظة. يمكنك تغييرها في أي وقت.',
	'error.notFound.title': 'الصفحة غير موجودة',
	'error.notFound.body': 'هذه المنطقة غير متاحة بعد.',
	'unlock.title': 'ملف شخصي محمي',
	'unlock.hint':
		'ملفك الشخصي مشفّر على هذا الجهاز. أدخل كلمة المرور للمتابعة.',
	'unlock.warning':
		'إذا نسيت كلمة المرور، لا يمكن استعادة بياناتك.',
	'unlock.passwordLabel': 'كلمة المرور',
	'unlock.submit': 'فتح القفل',
	'unlock.submitting': 'جارٍ فتح القفل…',
	'crisis.title': 'وضع الاستراحة',
	'crisis.hint': 'خذ وقتك. تابع عندما تريد.',
	'crisis.resume': 'متابعة'
};
