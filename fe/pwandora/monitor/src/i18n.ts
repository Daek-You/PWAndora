import i18n from 'i18next'
import type { InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguaeDetector from 'i18next-browser-languagedetector'

/*
'English', 'en'
'한국어', 'ko'
'Français', 'fr'
'Español', 'es'
'العربية', 'ar'
'日本語', 'ja'
'Русский', 'ru'
*/

const language = localStorage.getItem('language') || undefined
console.log('language', language)

i18n
  .use(LanguaeDetector) // 사용자 언어 탐지
  .use(initReactI18next) // i18n 객체를 react-18next에 전달
  .init<InitOptions>({
    // for all options read: https://www.i18next.com/overview/configuration-options
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    lng: language,
    resources: {
      en: {
        translation: {
          Dashboard: 'Dashboard',
          'App List': 'App List',
          'Crawler Status': 'Crawler Status',
          Login: 'Login',
          Logout: 'Logout',
          'Sign Up': 'Sign Up',
          ID: 'ID',
          Password: 'Password',
          Language: 'Language',
          Email: 'Email',
          'Password Confirm': 'Password Confirm',
          'Please enter your ID': 'Please enter your ID',
          'Please enter your password': 'Please enter your password',
          'Please confirm your password': 'Please confirm your password',
          'Please enter your email': 'Please enter your email',
          'ID is required': 'ID is required',
          'Password is required': 'Password is required',
          'Password Confirm is required': 'Password Confirm is required',
          'Password is not matched': 'Password is not matched',
          'ID is already exists': 'ID is already exists',
          'Sign-up completed': 'Sign-up completed',
          'Sign-up failed': 'Sign-up failed',
          'Login successful': 'Login successful',
          'Login failed': 'Login failed',
          'Checked URL': 'Checked URL',
          'Collected Apps': 'Collected Apps',
          'Available Apps': 'Available Apps',
          'Total Downloads': 'Total Downloads',
          'Blocked Apps': 'Blocked Apps',
          'Trend graph': 'Trend graph',
          'Category distribution': 'Category distribution',
          'Search App Name': 'Search App Name',
          Search: 'Search',
          Icon: 'Icon',
          Name: 'Name',
          URL: 'URL',
          Category: 'Category',
          category: 'category',
          Downloads: 'Downloads',
          downloads: 'downloads',
          'Created At': 'Created At',
          'Updated At': 'Updated At',
          'created at': 'created at',
          'updated at': 'updated at',
          Block: 'Block',
          UnBlock: 'UnBlock',
          Edit: 'Edit',
          Save: 'Save',
          Performance: 'Performance',
          Accessibility: 'Accessibility',
          'Best Practice': 'Best Practice',
          SEO: 'SEO',
          'Block App': 'Block App',
          'Unblock App': 'Unblock App',
          name: 'name',
          summary: 'summary',
          description: 'description',
          screenshots: 'screenshots',
          'website URL': 'website URL',
          'Developer site URL': 'Developer site URL',
          'WGT file URL': 'WGT file URL',
          'WGT file size': 'WGT file size',
          'APK file URL': 'APK file URL',
          'APK file size': 'APK file size',
          Confirmation: 'Confirmation',
          Register: 'Register',
          'App Register Crawler': 'App Register Crawler',
          'Scheduled At': 'Scheduled At',
          every: 'every',
          'Total Runs': 'Total Runs',
          Times: 'Times',
          'Average Time': 'Average Time',
          hours: 'hours',
          min: 'min',
          sec: 'sec',
          ago: 'ago',
          'Current Status': 'Current Status',
          Running: 'Running',
          'Not Running': 'Not Running',
          'App Register': 'App Register',
          Logs: 'Logs',
          confirm: 'confirm',
          'Uncensored Apps': 'Uncensored Apps',
          'apps left': 'apps left',
          'Are you sure to register?': 'Are you sure to register?',
          'App registered successfully!': 'App registered successfully!',
          'Failed to register app.': 'Failed to register app.',
          done: 'done',
          'need confirm': 'need confirm',
          warning: 'warning',
          'Bespoke Familyhub': 'Bespoke Familyhub',
          'Bespoke AI Home': 'Bespoke AI Home',
          'Display Compatibility': 'Display Compatibility',
          Screenshots: 'Screenshots',
          'AI Suggestions': 'AI Suggestions',
          'AI Censor': 'AI Censor',
          Packaging: 'Packaging',
          'Lighthouse Test': 'Lighthouse Test',
          Security: 'Security',
          Url: 'Url',
          'Crawled Data': 'Crawled Data',
          'Select item': 'Select item',
          'Please confirm all sections before registering.':
            'Please confirm all sections before registering.',
          'Are you sure to block?': 'Are you sure to block?',
          'App blocked successfully!': 'App blocked successfully!',
          'Failed to block app.': 'Failed to block app.',
          'Register site by URL': 'Register site by URL',
          'Started At': 'Started At',
          Duration: 'Duration',
          Processed: 'Processed',
          PWAs: 'PWAs',
          Error: 'Error',
          'No records during this period': 'No records during this period',
          'PWA Check': 'PWA Check',
          'Tizen Packaging': 'Tizen Packaging',
          'Android Packaging': 'Android Packaging',
          'Take Screenshots': 'Take Screenshots',
          'AI Data Generation': 'AI Data Generation',
          Processing: 'Processing',
          Success: 'Success',
          Completed: 'Completed',
          up: 'up',
          down: 'down',
          same: 'same',
        },
      },
      ko: {
        translation: {
          Dashboard: '대시보드',
          'App List': '앱 목록',
          'Crawler Status': '앱 수집 현황',
          Login: '로그인',
          Logout: '로그아웃',
          'Sign Up': '회원가입',
          ID: '아이디',
          Password: '비밀번호',
          Language: '언어',
          Email: '이메일',
          'Password Confirm': '비밀번호 확인',
          'Please enter your ID': '아이디를 입력하세요',
          'Please enter your password': '비밀번호를 입력하세요',
          'Please confirm your password': '비밀번호를 다시 입력하세요',
          'Please enter your email': '이메일을 입력하세요',
          'ID is required': '아이디는 필수 항목입니다',
          'Password is required': '비밀번호는 필수 항목입니다',
          'Password Confirm is required': '비밀번호 확인은 필수 항목입니다',
          'Password is not matched': '비밀번호가 일치하지 않습니다',
          'ID is already exists': '이미 존재하는 아이디입니다',
          'Sign-up completed': '회원가입이 완료되었습니다',
          'Sign-up failed': '회원가입에 실패했습니다',
          'Login successful': '로그인에 성공했습니다',
          'Login failed': '로그인에 실패했습니다',
          'Checked URL': '확인한 URL',
          'Collected Apps': '수집된 앱',
          'Available Apps': '사용 가능한 앱',
          'Total Downloads': '총 다운로드 수',
          'Blocked Apps': '차단된 앱',
          'Trend graph': '트렌드 그래프',
          'Category distribution': '카테고리 분포',
          'Search App Name': '앱 이름으로 검색',
          Search: '검색',
          Icon: '아이콘',
          Name: '이름',
          URL: 'URL',
          Category: '카테고리',
          category: '카테고리',
          Downloads: '다운로드 수',
          downloads: '다운로드 수',
          'Created At': '생성일',
          'Updated At': '수정일',
          'created at': '생성일',
          'updated at': '수정일',
          Block: '차단',
          UnBlock: '차단 해제',
          Edit: '수정',
          Save: '저장',
          Performance: '성능',
          Accessibility: '접근성',
          'Best Practice': '권장사항',
          SEO: '검색엔진 최적화',
          'Block App': '앱 차단',
          'Unblock App': '앱 차단 해제',
          name: '이름',
          summary: '요약',
          description: '설명',
          screenshots: '스크린샷',
          'website URL': '웹사이트 주소',
          'Developer site URL': '개발자 사이트 URL',
          'WGT file URL': 'WGT 파일 주소',
          'WGT file size': 'WGT 파일 크기',
          'APK file URL': 'APK 파일 주소',
          'APK file size': 'APK 파일 크기',
          Confirmation: '검수',
          Register: '등록',
          'App Register Crawler': '앱 수집 현황',
          'Scheduled At': '실행 예정 시간',
          every: '매일',
          'Total Runs': '총 실행 횟수',
          Times: '회',
          'Average Time': '평균 시간',
          hours: '시간',
          min: '분',
          sec: '초',
          ago: '경과',
          'Current Status': '현재 상태',
          Running: '실행 중',
          'Not Running': '실행되지 않음',
          'App Register': '앱 등록',
          Logs: '로그',
          confirm: '확인',
          'Uncensored Apps': '검수되지 않은 앱',
          'apps left': '개 남음',
          'Are you sure to register?': '등록하시겠습니까?',
          'App registered successfully!': '앱이 성공적으로 등록되었습니다!',
          'Failed to register app.': '앱 등록에 실패했습니다.',
          done: '완료',
          'need confirm': '확인 필요',
          warning: '경고',
          'Bespoke Familyhub': '비스포크 패밀리허브',
          'Bespoke AI Home': '비스포크 AI 홈',
          'Display Compatibility': '디스플레이 호환성',
          Screenshots: '스크린샷',
          'AI Suggestions': 'AI 제안',
          'AI Censor': 'AI 검열',
          Packaging: '패키징',
          'Lighthouse Test': '성능 점수',
          Security: '보안',
          Url: 'URL',
          'Crawled Data': '앱 주요 정보',
          'Select item': '항목 선택',
          'Please confirm all sections before registering.':
            '모든 항목을 확인해주세요.',
          'Are you sure to block?': '차단하시겠습니까?',
          'App blocked successfully!': '차단되었습니다.',
          'Failed to block app.': '차단을 실패했습니다.',
          'Register site by URL': 'URL로 사이트 등록',
          'Started At': '시작시간',
          Duration: '소요시간',
          Processed: '처리됨',
          PWAs: 'PWA 개수',
          Error: '에러',
          'No records during this period': '해당 기간의 기록이 없습니다',
          'PWA Check': 'PWA 확인',
          'Tizen Packaging': '타이젠 패키징',
          'Android Packaging': '안드로이드 패키징',
          'Take Screenshots': '스크린샷 촬영',
          'AI Data Generation': 'AI 데이터 생성',
          Processing: '처리 중',
          Success: '성공',
          Completed: '완료됨',
          up: '상승',
          down: '하락',
          same: '변동 없음',
          Summary: '요약',
          Description: '설명',
          Categories: '카테고리',
          'Age Rating': '연령 등급',
          inch: '인치',
          'Child Endangerment': '아동 위험',
          'Inappropriate Content': '부적절한 콘텐츠',
          'Financial Services': '금융 서비스',
          'Real-Money Gambling, Games, and Contests': '돈 도박, 게임 및 대회',
          'Illegal Activities': '불법 활동',
          'Health Content and Services': '건강 콘텐츠 및 서비스',
          'Blockchain-based Content': '블록체인 기반 콘텐츠',
          'AI-Generated Content': 'AI 생성 콘텐츠',
          Safe: '안전',
          Warning: '경고',
          Danger: '위험',
          'Encrypted connection enabled': '암호화 통신 사용중',
          'Not encrypted connection': '암호화 통신 사용안함',
          'CSP enabled. Safe from external script attacks':
            '외부 스크립트 공격 방어중',
          'CSP disabled. Vulnerable to external script attacks':
            '외부 스크립트 공격 위험',
          'App Register Crawler Running': '앱 수집 중',
          'App Register Crawler Not Running': '앱 수집 중단됨',
        },
      },
      fr: {
        translation: {
          Dashboard: 'Tableau de bord',
          'App List': 'Liste des applications',
          'Crawler Status': 'Statut du crawler',
          Login: 'Connexion',
          Logout: 'Déconnexion',
          'Sign Up': 'Inscription',
          ID: 'Identifiant',
          Password: 'Mot de passe',
          Language: 'Langue',
          Email: 'E-mail',
          'Password Confirm': 'Confirmer le mot de passe',
          'Please enter your ID': 'Veuillez entrer votre identifiant',
          'Please enter your password': 'Veuillez entrer votre mot de passe',
          'Please confirm your password':
            'Veuillez confirmer votre mot de passe',
          'Please enter your email': 'Veuillez entrer votre e-mail',
          'ID is required': 'L’identifiant est requis',
          'Password is required': 'Le mot de passe est requis',
          'Password Confirm is required':
            'La confirmation du mot de passe est requise',
          'Password is not matched': 'Les mots de passe ne correspondent pas',
          'ID is already exists': 'Cet identifiant existe déjà',
          'Sign-up completed': 'Inscription terminée',
          'Sign-up failed': 'Échec de l’inscription',
          'Login successful': 'Connexion réussie',
          'Login failed': 'Échec de la connexion',
          'Checked URL': 'URL vérifiée',
          'Collected Apps': 'Applications collectées',
          'Available Apps': 'Applications disponibles',
          'Total Downloads': 'Nombre total de téléchargements',
          'Blocked Apps': 'Applications bloquées',
          'Trend graph': 'Graphique des tendances',
          'Category distribution': 'Répartition par catégorie',
          'Search App Name': 'Rechercher par nom d’application',
          Search: 'Rechercher',
          Icon: 'Icône',
          Name: 'Nom',
          URL: 'URL',
          Category: 'Catégorie',
          category: 'catégorie',
          Downloads: 'Téléchargements',
          downloads: 'téléchargements',
          'Created At': 'Créé le',
          'Updated At': 'Mis à jour le',
          'created at': 'créé le',
          'updated at': 'mis à jour le',
          Block: 'Bloquer',
          UnBlock: 'Débloquer',
          Edit: 'Modifier',
          Save: 'Enregistrer',
          Performance: 'Performance',
          Accessibility: 'Accessibilité',
          'Best Practice': 'Bonnes pratiques',
          SEO: 'Optimisation pour les moteurs de recherche',
          'Block App': 'Bloquer l’application',
          'Unblock App': 'Débloquer l’application',
          name: 'nom',
          summary: 'résumé',
          description: 'description',
          screenshots: 'captures d’écran',
          'website URL': 'URL du site web',
          'Developer site URL': 'URL du site du développeur',
          'WGT file URL': 'URL du fichier WGT',
          'WGT file size': 'Taille du fichier WGT',
          'APK file URL': 'URL du fichier APK',
          'APK file size': 'Taille du fichier APK',
          'App Register Crawler': "Crawler d'enregistrement d'applications",
          'Scheduled At': "Heure prévue d'exécution",
          every: 'Chaque jour à',
          'Total Runs': 'Nombre total d’exécutions',
          Times: 'fois',
          'Average Time': 'Temps moyen',
          hours: 'heures',
          min: 'min',
          sec: 'sec',
          ago: 'plus tôt',
          'Current Status': 'Statut actuel',
          Running: 'En cours',
          'Not Running': 'Non en cours',
          'App Register': 'Enregistrement d’app',
          Logs: 'Journaux',
        },
      },
      es: {
        translation: {
          Dashboard: 'Panel de control',
          'App List': 'Lista de aplicaciones',
          'Crawler Status': 'Estado del rastreador',
          Login: 'Iniciar sesión',
          Logout: 'Cerrar sesión',
          'Sign Up': 'Registrarse',
          ID: 'ID',
          Password: 'Contraseña',
          Language: 'Idioma',
          Email: 'Correo electrónico',
          'Password Confirm': 'Confirmar contraseña',
          'Please enter your ID': 'Por favor, introduce tu ID',
          'Please enter your password': 'Por favor, introduce tu contraseña',
          'Please confirm your password': 'Por favor, confirma tu contraseña',
          'Please enter your email':
            'Por favor, introduzca su correo electrónico',
          'ID is required': 'El ID es obligatorio',
          'Password is required': 'La contraseña es obligatoria',
          'Password Confirm is required':
            'La confirmación de la contraseña es obligatoria',
          'Password is not matched': 'Las contraseñas no coinciden',
          'ID is already exists': 'El ID ya existe',
          'Sign-up completed': 'Registro completado',
          'Sign-up failed': 'Error al registrarse',
          'Login successful': 'Inicio de sesión exitoso',
          'Login failed': 'Error al iniciar sesión',
          'Checked URL': 'URL verificada',
          'Collected Apps': 'Aplicaciones recopiladas',
          'Available Apps': 'Aplicaciones disponibles',
          'Total Downloads': 'Descargas totales',
          'Blocked Apps': 'Aplicaciones bloqueadas',
          'Trend graph': 'Gráfico de tendencias',
          'Category distribution': 'Distribución por categoría',
          'Search App Name': 'Buscar por nombre de aplicación',
          Search: 'Buscar',
          Icon: 'Ícono',
          Name: 'Nombre',
          URL: 'URL',
          Category: 'Categoría',
          category: 'categoría',
          Downloads: 'Descargas',
          downloads: 'descargas',
          'Created At': 'Fecha de creación',
          'Updated At': 'Fecha de actualización',
          'created at': 'fecha de creación',
          'updated at': 'fecha de actualización',
          Block: 'Bloquear',
          UnBlock: 'Desbloquear',
          Edit: 'Editar',
          Save: 'Guardar',
          Performance: 'Rendimiento',
          Accessibility: 'Accesibilidad',
          'Best Practice': 'Mejores prácticas',
          SEO: 'Optimización en buscadores',
          'Block App': 'Bloquear aplicación',
          'Unblock App': 'Desbloquear aplicación',
          name: 'nombre',
          summary: 'resumen',
          description: 'descripción',
          screenshots: 'capturas de pantalla',
          'website URL': 'URL del sitio web',
          'Developer site URL': 'URL del sitio del desarrollador',
          'WGT file URL': 'URL del archivo WGT',
          'WGT file size': 'Tamaño del archivo WGT',
          'APK file URL': 'URL del archivo APK',
          'APK file size': 'Tamaño del archivo APK',
          'App Register Crawler': 'Rastreador de registro de aplicaciones',
          'Scheduled At': 'Hora prevista de ejecución',
          every: 'Cada día a las',
          'Total Runs': 'Total de ejecuciones',
          Times: 'veces',
          'Average Time': 'Tiempo promedio',
          hours: 'horas',
          min: 'min',
          sec: 'seg',
          ago: 'antes',
          'Current Status': 'Estado actual',
          Running: 'En ejecución',
          'Not Running': 'No en ejecución',
          'App Register': 'Registro de app',
          Logs: 'Registros',
        },
      },
      ar: {
        translation: {
          Dashboard: 'لوحة التحكم',
          'App List': 'قائمة التطبيقات',
          'Crawler Status': 'حالة الزاحف',
          Login: 'تسجيل الدخول',
          Logout: 'تسجيل الخروج',
          'Sign Up': 'إنشاء حساب',
          ID: 'المعرف',
          Password: 'كلمة المرور',
          Language: 'اللغة',
          Email: 'البريد الإلكتروني',
          'Password Confirm': 'تأكيد كلمة المرور',
          'Please enter your ID': 'يرجى إدخال المعرف',
          'Please enter your password': 'يرجى إدخال كلمة المرور',
          'Please confirm your password': 'يرجى تأكيد كلمة المرور',
          'Please enter your email': 'يرجى إدخال بريدك الإلكتروني',
          'ID is required': 'المعرف مطلوب',
          'Password is required': 'كلمة المرور مطلوبة',
          'Password Confirm is required': 'تأكيد كلمة المرور مطلوب',
          'Password is not matched': 'كلمتا المرور غير متطابقتين',
          'ID is already exists': 'المعرف موجود مسبقًا',
          'Sign-up completed': 'تم إنشاء الحساب بنجاح',
          'Sign-up failed': 'فشل في إنشاء الحساب',
          'Login successful': 'تم تسجيل الدخول بنجاح',
          'Login failed': 'فشل في تسجيل الدخول',
          'Checked URL': 'عنوان URL تم التحقق منه',
          'Collected Apps': 'التطبيقات المجمعة',
          'Available Apps': 'التطبيقات المتاحة',
          'Total Downloads': 'إجمالي التنزيلات',
          'Blocked Apps': 'التطبيقات المحظورة',
          'Trend graph': 'رسم بياني للاتجاهات',
          'Category distribution': 'توزيع الفئات',
          'Search App Name': 'البحث باسم التطبيق',
          Search: 'بحث',
          Icon: 'أيقونة',
          Name: 'الاسم',
          URL: 'URL',
          Category: 'الفئة',
          category: 'الفئة',
          Downloads: 'التنزيلات',
          downloads: 'التنزيلات',
          'Created At': 'تاريخ الإنشاء',
          'Updated At': 'تاريخ التحديث',
          'created at': 'تاريخ الإنشاء',
          'updated at': 'تاريخ التحديث',
          Block: 'حظر',
          UnBlock: 'إلغاء الحظر',
          Edit: 'تعديل',
          Save: 'حفظ',
          Performance: 'الأداء',
          Accessibility: 'سهولة الوصول',
          'Best Practice': 'أفضل الممارسات',
          SEO: 'تحسين محركات البحث',
          'Block App': 'حظر التطبيق',
          'Unblock App': 'إلغاء حظر التطبيق',
          name: 'الاسم',
          summary: 'الملخص',
          description: 'الوصف',
          screenshots: 'لقطات الشاشة',
          'website URL': 'رابط الموقع',
          'Developer site URL': 'رابط موقع المطور',
          'WGT file URL': 'رابط ملف WGT',
          'WGT file size': 'حجم ملف WGT',
          'APK file URL': 'رابط ملف APK',
          'APK file size': 'حجم ملف APK',
          'App Register Crawler': 'زاحف تسجيل التطبيقات',
          'Scheduled At': 'وقت التنفيذ المجدول',
          every: 'كل يوم في',
          'Total Runs': 'إجمالي عدد التشغيلات',
          Times: 'مرات',
          'Average Time': 'متوسط الوقت',
          hours: 'ساعات',
          min: 'دقائق',
          sec: 'ثواني',
          ago: 'منذ',
          'Current Status': 'الحالة الحالية',
          Running: 'قيد التشغيل',
          'Not Running': 'غير نشط',
          'App Register': 'تسجيل التطبيق',
          Logs: 'السجلات',
        },
      },
      ja: {
        translation: {
          Dashboard: 'ダッシュボード',
          'App List': 'アプリ一覧',
          'Crawler Status': 'クローラーのステータス',
          Login: 'ログイン',
          Logout: 'ログアウト',
          'Sign Up': '新規登録',
          ID: 'ID',
          Password: 'パスワード',
          Language: '言語',
          Email: 'メールアドレス',
          'Password Confirm': 'パスワード確認',
          'Please enter your ID': 'IDを入力してください',
          'Please enter your password': 'パスワードを入力してください',
          'Please confirm your password': 'パスワードを再入力してください',
          'Please enter your email': 'メールアドレスを入力してください',
          'ID is required': 'IDは必須です',
          'Password is required': 'パスワードは必須です',
          'Password Confirm is required': 'パスワード確認は必須です',
          'Password is not matched': 'パスワードが一致しません',
          'ID is already exists': 'このIDは既に存在します',
          'Sign-up completed': '登録が完了しました',
          'Sign-up failed': '登録に失敗しました',
          'Login successful': 'ログインに成功しました',
          'Login failed': 'ログインに失敗しました',
          'Checked URL': '確認済みのURL',
          'Collected Apps': '収集されたアプリ',
          'Available Apps': '利用可能なアプリ',
          'Total Downloads': '総ダウンロード数',
          'Blocked Apps': 'ブロックされたアプリ',
          'Trend graph': 'トレンドグラフ',
          'Category distribution': 'カテゴリ分布',
          'Search App Name': 'アプリ名で検索',
          Search: '検索',
          Icon: 'アイコン',
          Name: '名前',
          URL: 'URL',
          Category: 'カテゴリ',
          category: 'カテゴリ',
          Downloads: 'ダウンロード数',
          downloads: 'ダウンロード数',
          'Created At': '作成日',
          'Updated At': '更新日',
          'created at': '作成日',
          'updated at': '更新日',
          Block: 'ブロック',
          UnBlock: 'Unblock',
          Edit: '編集',
          Save: '保存',
          Performance: 'パフォーマンス',
          Accessibility: 'アクセシビリティ',
          'Best Practice': 'ベストプラクティス',
          SEO: '検索エンジン最適化',
          'Block App': 'アプリをブロック',
          'Unblock App': 'アプリのブロック解除',
          name: '名前',
          summary: '概要',
          description: '説明',
          screenshots: 'スクリーンショット',
          'website URL': 'ウェブサイトURL',
          'Developer site URL': '開発者サイトのURL',
          'WGT file URL': 'WGTファイルのURL',
          'WGT file size': 'WGTファイルのサイズ',
          'APK file URL': 'APKファイルのURL',
          'APK file size': 'APKファイルのサイズ',
          'App Register Crawler': 'アプリ登録クローラー',
          'Scheduled At': '実行予定時刻',
          every: '毎日',
          'Total Runs': '合計実行回数',
          Times: '回',
          'Average Time': '平均時間',
          hours: '時間',
          min: '分',
          sec: '秒',
          ago: '前',
          'Current Status': '現在のステータス',
          Running: '実行中',
          'Not Running': '実行されていない',
          'App Register': 'アプリ登録',
          Logs: 'ログ',
        },
      },
      ru: {
        translation: {
          Dashboard: 'Панель управления',
          'App List': 'Список приложений',
          'Crawler Status': 'Статус краулера',
          Login: 'Войти',
          Logout: 'Выйти',
          'Sign Up': 'Зарегистрироваться',
          ID: 'ID',
          Password: 'Пароль',
          Language: 'Язык',
          Email: 'Электронная почта',
          'Password Confirm': 'Подтвердить пароль',
          'Please enter your ID': 'Пожалуйста, введите ID',
          'Please enter your password': 'Пожалуйста, введите пароль',
          'Please confirm your password': 'Пожалуйста, подтвердите пароль',
          'Please enter your email':
            'Пожалуйста, введите свою электронную почту',
          'ID is required': 'ID обязателен',
          'Password is required': 'Пароль обязателен',
          'Password Confirm is required': 'Подтверждение пароля обязательно',
          'Password is not matched': 'Пароли не совпадают',
          'ID is already exists': 'ID уже существует',
          'Sign-up completed': 'Регистрация завершена',
          'Sign-up failed': 'Ошибка при регистрации',
          'Login successful': 'Вход выполнен успешно',
          'Login failed': 'Ошибка входа',
          'Checked URL': 'Проверенный URL',
          'Collected Apps': 'Собранные приложения',
          'Available Apps': 'Доступные приложения',
          'Total Downloads': 'Всего загрузок',
          'Blocked Apps': 'Заблокированные приложения',
          'Trend graph': 'График трендов',
          'Category distribution': 'Распределение по категориям',
          'Search App Name': 'Поиск по названию приложения',
          Search: 'Поиск',
          Icon: 'Иконка',
          Name: 'Название',
          URL: 'URL',
          Category: 'Категория',
          category: 'категория',
          Downloads: 'Загрузки',
          downloads: 'загрузки',
          'Created At': 'Дата создания',
          'Updated At': 'Дата обновления',
          'created at': 'дата создания',
          'updated at': 'дата обновления',
          Block: 'Блокировать',
          UnBlock: 'Разблокировать',
          Edit: 'Редактировать',
          Save: 'Сохранить',
          Performance: 'Производительность',
          Accessibility: 'Доступность',
          'Best Practice': 'Наилучшая практика',
          SEO: 'Поисковая оптимизация',
          'Block App': 'Заблокировать приложение',
          'Unblock App': 'Разблокировать приложение',
          name: 'название',
          summary: 'краткое описание',
          description: 'описание',
          screenshots: 'скриншоты',
          'website URL': 'URL сайта',
          'Developer site URL': 'URL сайта разработчика',
          'WGT file URL': 'URL файла WGT',
          'WGT file size': 'Размер файла WGT',
          'APK file URL': 'URL файла APK',
          'APK file size': 'Размер файла APK',
          'App Register Crawler': 'Краулер регистрации приложений',
          'Scheduled At': 'Запланированное время выполнения',
          every: 'Каждый день в',
          'Total Runs': 'Общее количество запусков',
          Times: 'раз',
          'Average Time': 'Среднее время',
          hours: 'часов',
          min: 'мин',
          sec: 'сек',
          ago: 'назад',
          'Current Status': 'Текущий статус',
          Running: 'Выполняется',
          'Not Running': 'Не выполняется',
          'App Register': 'Регистрация приложения',
          Logs: 'Логи',
        },
      },
    },
  })

export default i18n
