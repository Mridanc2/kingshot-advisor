import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Hammer, BookOpen, Target, Flag, Mountain, Heart, Users,
  Sword, Shield, Crown, Zap, TreePine, Sparkles, Eye, EyeOff,
  Plus, Minus, Check, X, RotateCcw, Settings, ChevronDown, ChevronRight,
  Wallet, Gem, Diamond, ArrowRight, Trophy, Info, Pin, PinOff, Download, Upload, Calendar, Search
} from 'lucide-react';

// ============================================================
// COLORS
// ============================================================
const LIGHT = {
  bg: '#f5e6d3',
  bgSoft: '#ede0cc',
  card: '#fffaf0',
  ink: '#3a2e26',
  inkSoft: '#6b5a4a',
  muted: '#9a8a7a',
  faint: '#c5b8a3',
  teal: '#4dc1d6',
  tealDark: '#2a8a99',
  tealSoft: '#a8e4ec',
  tealBg: '#e8f7fa',
  amber: '#f4a93a',
  amberDark: '#c87f15',
  amberSoft: '#fff5d6',
  amberBg: '#fdf3d8',
  // Hero "Next Upgrade" card colors (dark-mode pair below)
  heroBg: '#fff5d6',
  heroInner: '#fffbed',
  barEmpty: '#f4cf85',
  coral: '#d97757',
  coralBg: '#fdf0e8',
  border: '#d4c5b0',
  green: '#5cb85c',
};

const DARK = {
  bg: '#1a1612',
  bgSoft: '#241e18',
  card: '#2a2218',
  ink: '#f5e6d3',
  inkSoft: '#c5b8a3',
  muted: '#9a8a7a',
  faint: '#5a4a3a',
  teal: '#4dc1d6',
  tealDark: '#6dd0e0',
  tealSoft: '#1a4a55',
  tealBg: '#1a3640',
  amber: '#f4a93a',
  amberDark: '#f4a93a',
  amberSoft: '#3d2e15',
  amberBg: '#3d2e15',
  // Hero "Next Upgrade" card — much darker and more saturated than light mode
  heroBg: '#3d2e15',
  heroInner: '#2a2218',
  barEmpty: '#5a4a3a',
  coral: '#e08770',
  coralBg: '#3a201a',
  border: '#3a2e22',
  green: '#5cb85c',
};

// Default - will be overridden by ThemeProvider
let C = LIGHT;

// ============================================================
// TRANSLATIONS (12 languages)
// ============================================================
const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧', rtl: false },
  he: { name: 'עברית', flag: '🇮🇱', rtl: true },
  ru: { name: 'Русский', flag: '🇷🇺', rtl: false },
  de: { name: 'Deutsch', flag: '🇩🇪', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  pt: { name: 'Português', flag: '🇵🇹', rtl: false },
  it: { name: 'Italiano', flag: '🇮🇹', rtl: false },
  tr: { name: 'Türkçe', flag: '🇹🇷', rtl: false },
  zh: { name: '中文', flag: '🇨🇳', rtl: false },
  ja: { name: '日本語', flag: '🇯🇵', rtl: false },
  ko: { name: '한국어', flag: '🇰🇷', rtl: false },
};

const T = {
  appTitle: {
    en: 'xXx Commanders', he: 'xXx Commanders', ru: 'xXx Commanders',
    de: 'xXx Commanders', es: 'xXx Commanders', fr: 'xXx Commanders',
    pt: 'xXx Commanders', it: 'xXx Commanders', tr: 'xXx Commanders',
    zh: 'xXx Commanders', ja: 'xXx Commanders', ko: 'xXx Commanders',
  },
  appTagline: {
    en: 'Build the strongest battle character',
    he: 'בנו את הדמות החזקה ביותר בקרב',
    ru: 'Создайте сильнейшего боевого персонажа',
    de: 'Baue den stärksten Kampfcharakter',
    es: 'Construye el personaje de batalla más fuerte',
    fr: 'Construisez le personnage de combat le plus fort',
    pt: 'Construa o personagem de batalha mais forte',
    it: 'Costruisci il personaggio da battaglia più forte',
    tr: 'En güçlü savaş karakterini oluştur',
    zh: '打造最强战斗角色',
    ja: '最強の戦闘キャラクターを作る',
    ko: '최강의 전투 캐릭터 만들기',
  },
  treeAndRec: {
    en: 'Tree + Tip', he: 'עץ + המלצה', ru: 'Дерево + Совет',
    de: 'Baum + Tipp', es: 'Árbol + Consejo', fr: 'Arbre + Conseil',
    pt: 'Árvore + Dica', it: 'Albero + Consiglio', tr: 'Ağaç + İpucu',
    zh: '科技树+建议', ja: 'ツリー+ヒント', ko: '트리+팁',
  },
  waveQueue: {
    en: 'Next 5', he: '5 הבאים', ru: 'Следующие 5',
    de: 'Nächste 5', es: 'Próximos 5', fr: '5 suivants',
    pt: 'Próximos 5', it: 'Prossimi 5', tr: 'Sonraki 5',
    zh: '接下来5个', ja: '次の5つ', ko: '다음 5개',
  },
  nextUpgrade: {
    en: 'NEXT UPGRADE', he: 'השדרוג הבא', ru: 'СЛЕДУЮЩЕЕ',
    de: 'NÄCHSTES UPGRADE', es: 'SIGUIENTE', fr: 'SUIVANT',
    pt: 'PRÓXIMO', it: 'PROSSIMO', tr: 'SONRAKİ',
    zh: '下一个升级', ja: '次のアップグレード', ko: '다음 업그레이드',
  },
  iDidThis: {
    en: 'I did this (Lvl', he: 'ביצעתי (דרגה', ru: 'Готово (Ур.',
    de: 'Erledigt (Stufe', es: 'Hecho (Nivel', fr: 'Fait (Niv.',
    pt: 'Feito (Nv.', it: 'Fatto (Liv.', tr: 'Tamam (Sev.',
    zh: '完成 (等级', ja: '完了 (レベル', ko: '완료 (레벨',
  },
  goTo: {
    en: 'Go to', he: 'עבור ל', ru: 'Перейти к',
    de: 'Gehe zu', es: 'Ir a', fr: 'Aller à',
    pt: 'Ir para', it: 'Vai a', tr: 'Şuna git',
    zh: '前往', ja: '移動', ko: '이동',
  },
  view: {
    en: 'View', he: 'הצג', ru: 'Просмотр',
    de: 'Ansehen', es: 'Ver', fr: 'Voir',
    pt: 'Ver', it: 'Vedi', tr: 'Görüntüle',
    zh: '查看', ja: '表示', ko: '보기',
  },
  growth: {
    en: 'Growth', he: 'צמיחה', ru: 'Рост',
    de: 'Wachstum', es: 'Crecimiento', fr: 'Croissance',
    pt: 'Crescimento', it: 'Crescita', tr: 'Büyüme',
    zh: '成长', ja: '成長', ko: '성장',
  },
  economy: {
    en: 'Economy', he: 'כלכלה', ru: 'Экономика',
    de: 'Wirtschaft', es: 'Economía', fr: 'Économie',
    pt: 'Economia', it: 'Economia', tr: 'Ekonomi',
    zh: '经济', ja: '経済', ko: '경제',
  },
  battle: {
    en: 'Battle', he: 'קרב', ru: 'Битва',
    de: 'Kampf', es: 'Batalla', fr: 'Combat',
    pt: 'Batalha', it: 'Battaglia', tr: 'Savaş',
    zh: '战斗', ja: '戦闘', ko: '전투',
  },
  progress: {
    en: 'Progress', he: 'התקדמות', ru: 'Прогресс',
    de: 'Fortschritt', es: 'Progreso', fr: 'Progrès',
    pt: 'Progresso', it: 'Progresso', tr: 'İlerleme',
    zh: '进度', ja: '進捗', ko: '진행도',
  },
  levels: {
    en: 'levels', he: 'רמות', ru: 'уровней',
    de: 'Stufen', es: 'niveles', fr: 'niveaux',
    pt: 'níveis', it: 'livelli', tr: 'seviye',
    zh: '等级', ja: 'レベル', ko: '레벨',
  },
  howToUse: {
    en: 'How to use this tree',
    he: 'איך להשתמש בעץ',
    ru: 'Как использовать дерево',
    de: 'Wie man diesen Baum nutzt',
    es: 'Cómo usar este árbol',
    fr: 'Comment utiliser cet arbre',
    pt: 'Como usar esta árvore',
    it: 'Come usare questo albero',
    tr: 'Bu ağaç nasıl kullanılır',
    zh: '如何使用此科技树',
    ja: 'ツリーの使い方',
    ko: '트리 사용법',
  },
  howToUseDesc: {
    en: 'Each tier has 3 groups: ① Start with these, ② Then do these, ③ Skip for now. Once you finish ① and ② in a tier, move down to the next tier. Don\'t touch ③ until you\'ve climbed all the way through.',
    he: 'בכל דרגה יש 3 קבוצות: ① התחל מאלה, ② אחר כך עשה אלה, ③ דלג לעת עתה. אחרי שתסיים את ① ו-② בדרגה, עבור לדרגה הבאה. אל תיגע ב-③ עד שטיפסת בכל הדרגות.',
    ru: 'В каждом уровне 3 группы: ① Начни с этих, ② Затем эти, ③ Пропусти пока. После ① и ② в уровне переходи к следующему. Не трогай ③ пока не пройдёшь все уровни.',
    de: 'Jede Stufe hat 3 Gruppen: ① Beginne damit, ② Dann diese, ③ Vorerst überspringen. Wenn ① und ② fertig sind, gehe zur nächsten Stufe. ③ erst nach allen Stufen.',
    es: 'Cada nivel tiene 3 grupos: ① Empieza con estos, ② Luego estos, ③ Omitir por ahora. Tras ① y ② sube al siguiente. No toques ③ hasta haber subido todos.',
    fr: 'Chaque palier a 3 groupes : ① Commencer par, ② Ensuite, ③ Laisser pour plus tard. Après ① et ②, montez au palier suivant. Ne touchez ③ qu\'après tous les paliers.',
    pt: 'Cada tier tem 3 grupos: ① Comece com estes, ② Depois estes, ③ Pule por agora. Após ① e ② vá ao próximo. Só faça ③ depois de subir todos.',
    it: 'Ogni livello ha 3 gruppi: ① Inizia con questi, ② Poi questi, ③ Salta per ora. Dopo ① e ② passa al prossimo. ③ solo dopo tutti i livelli.',
    tr: 'Her seviyede 3 grup var: ① Bunlarla başla, ② Sonra bunlar, ③ Şimdilik atla. ① ve ② bitince sonraki seviyeye geç. Tümünü bitirmeden ③\'e dokunma.',
    zh: '每个等级有3组：①先做这些，②然后这些，③暂时跳过。完成①和②后进入下一等级。所有等级完成前不要碰③。',
    ja: '各ティアに3グループ：①これから始める、②次にこれら、③今はスキップ。①②完了後、次のティアへ。全部終わるまで③は触らない。',
    ko: '각 등급에 3그룹: ①먼저 이것, ②그다음 이것, ③지금은 건너뛰기. ①②완료 후 다음 등급으로. 모든 등급 완료 전엔 ③은 건드리지 마세요.',
  },
  tier: {
    en: 'Tier', he: 'דרגה', ru: 'Уровень',
    de: 'Stufe', es: 'Nivel', fr: 'Palier',
    pt: 'Tier', it: 'Livello', tr: 'Seviye',
    zh: '等级', ja: 'ティア', ko: '등급',
  },
  startWith: {
    en: '① Start with these',
    he: '① התחל מאלה',
    ru: '① Начни с этих',
    de: '① Beginne damit',
    es: '① Empieza con estos',
    fr: '① Commencer par',
    pt: '① Comece com estes',
    it: '① Inizia con questi',
    tr: '① Bunlarla başla',
    zh: '① 从这些开始',
    ja: '① これから始める',
    ko: '① 먼저 이것부터',
  },
  startWithSub: {
    en: 'most important upgrades in this tier',
    he: 'השדרוגים החשובים ביותר בדרגה זו',
    ru: 'самые важные улучшения уровня',
    de: 'wichtigste Upgrades dieser Stufe',
    es: 'las mejoras más importantes',
    fr: 'améliorations les plus importantes',
    pt: 'melhorias mais importantes',
    it: 'i potenziamenti più importanti',
    tr: 'en önemli yükseltmeler',
    zh: '本等级最重要的升级',
    ja: 'このティアで最重要',
    ko: '이 등급의 가장 중요한 업그레이드',
  },
  thenDo: {
    en: '② Then do these',
    he: '② אחר כך עשה אלה',
    ru: '② Затем эти',
    de: '② Dann diese',
    es: '② Luego estos',
    fr: '② Ensuite',
    pt: '② Depois estes',
    it: '② Poi questi',
    tr: '② Sonra bunlar',
    zh: '② 然后这些',
    ja: '② 次にこれら',
    ko: '② 그다음 이것',
  },
  thenDoSub: {
    en: 'only after the orange ones above are maxed',
    he: 'רק אחרי שהכתומים למעלה מוקסמים',
    ru: 'только после макса оранжевых выше',
    de: 'nur nachdem die orangenen oben max sind',
    es: 'solo tras maximizar los naranjas',
    fr: 'seulement après les oranges max',
    pt: 'só depois dos laranjas no máximo',
    it: 'solo dopo aver massato gli arancioni',
    tr: 'üstteki turuncular max olduktan sonra',
    zh: '仅在上面橙色满级后',
    ja: '上のオレンジが最大になってから',
    ko: '위의 주황색이 최대가 된 후에만',
  },
  skipFor: {
    en: '③ Skip for now',
    he: '③ דלג לעת עתה',
    ru: '③ Пропусти пока',
    de: '③ Vorerst überspringen',
    es: '③ Omitir por ahora',
    fr: '③ Laisser pour plus tard',
    pt: '③ Pule por agora',
    it: '③ Salta per ora',
    tr: '③ Şimdilik atla',
    zh: '③ 暂时跳过',
    ja: '③ 今はスキップ',
    ko: '③ 지금은 건너뛰기',
  },
  skipForSub: {
    en: 'come back here only after you\'ve finished ① and ② in every tier',
    he: 'חזור לכאן רק אחרי שסיימת את ① ו-② בכל דרגה',
    ru: 'вернись сюда только после ① и ② во всех уровнях',
    de: 'erst nach ① und ② in allen Stufen zurückkommen',
    es: 'vuelve solo tras ① y ② en cada nivel',
    fr: 'revenez seulement après ① et ② dans tous les paliers',
    pt: 'volte só após ① e ② em todos os tiers',
    it: 'torna solo dopo ① e ② in ogni livello',
    tr: 'her seviyede ① ve ② bittikten sonra dön',
    zh: '完成所有等级的①②后再回来',
    ja: '全ティアの①②完了後に戻る',
    ko: '모든 등급의 ①②를 끝낸 후 돌아오기',
  },
  showLowPri: {
    en: 'Show low priority / skip',
    he: 'הצג עדיפות נמוכה / דלג',
    ru: 'Показать низкий приоритет',
    de: 'Niedrige Priorität anzeigen',
    es: 'Mostrar baja prioridad',
    fr: 'Afficher faible priorité',
    pt: 'Mostrar baixa prioridade',
    it: 'Mostra bassa priorità',
    tr: 'Düşük öncelik göster',
    zh: '显示低优先级',
    ja: '低優先度を表示',
    ko: '낮은 우선순위 표시',
  },
  hide: {
    en: 'Hide', he: 'הסתר', ru: 'Скрыть',
    de: 'Verbergen', es: 'Ocultar', fr: 'Masquer',
    pt: 'Ocultar', it: 'Nascondi', tr: 'Gizle',
    zh: '隐藏', ja: '非表示', ko: '숨기기',
  },
  spendProfile: {
    en: 'Spend Profile', he: 'פרופיל הוצאה', ru: 'Профиль трат',
    de: 'Ausgabenprofil', es: 'Perfil de gasto', fr: 'Profil de dépense',
    pt: 'Perfil de gasto', it: 'Profilo di spesa', tr: 'Harcama Profili',
    zh: '消费档案', ja: '支出プロファイル', ko: '소비 프로필',
  },
  whatThisChanges: {
    en: 'What this changes:', he: 'מה זה משנה:', ru: 'Что меняется:',
    de: 'Was sich ändert:', es: 'Qué cambia:', fr: 'Ce que cela change :',
    pt: 'O que muda:', it: 'Cosa cambia:', tr: 'Bu ne değiştirir:',
    zh: '改变什么：', ja: '何が変わるか：', ko: '무엇이 바뀌나요:',
  },
  resetProgress: {
    en: 'Reset Progress', he: 'אפס התקדמות', ru: 'Сбросить прогресс',
    de: 'Fortschritt zurücksetzen', es: 'Reiniciar progreso', fr: 'Réinitialiser',
    pt: 'Redefinir', it: 'Reimposta', tr: 'Sıfırla',
    zh: '重置进度', ja: '進捗リセット', ko: '진행도 초기화',
  },
  resetConfirm: {
    en: 'Reset all progress?', he: 'לאפס את כל ההתקדמות?', ru: 'Сбросить весь прогресс?',
    de: 'Allen Fortschritt zurücksetzen?', es: '¿Reiniciar todo el progreso?',
    fr: 'Réinitialiser tout le progrès ?', pt: 'Redefinir todo o progresso?',
    it: 'Reimpostare tutto?', tr: 'Tüm ilerleme sıfırlansın mı?',
    zh: '重置所有进度？', ja: 'すべての進捗をリセット？', ko: '모든 진행도 초기화?',
  },
  resetWarning: {
    en: 'All marked levels across Growth, Economy, and Battle will be cleared. This cannot be undone.',
    he: 'כל הרמות המסומנות בצמיחה, כלכלה וקרב יימחקו. לא ניתן לבטל.',
    ru: 'Все отмеченные уровни будут очищены. Это нельзя отменить.',
    de: 'Alle markierten Stufen werden gelöscht. Nicht rückgängig.',
    es: 'Todos los niveles marcados se borrarán. No se puede deshacer.',
    fr: 'Tous les niveaux marqués seront effacés. Irréversible.',
    pt: 'Todos os níveis marcados serão apagados. Não pode ser desfeito.',
    it: 'Tutti i livelli verranno cancellati. Non reversibile.',
    tr: 'Tüm işaretli seviyeler silinecek. Geri alınamaz.',
    zh: '所有已标记的等级将被清除。无法撤销。',
    ja: 'すべての記録がクリアされます。元に戻せません。',
    ko: '모든 표시된 레벨이 삭제됩니다. 되돌릴 수 없습니다.',
  },
  cancel: {
    en: 'Cancel', he: 'ביטול', ru: 'Отмена',
    de: 'Abbrechen', es: 'Cancelar', fr: 'Annuler',
    pt: 'Cancelar', it: 'Annulla', tr: 'İptal',
    zh: '取消', ja: 'キャンセル', ko: '취소',
  },
  yesReset: {
    en: 'Yes, reset', he: 'כן, אפס', ru: 'Да, сбросить',
    de: 'Ja, zurücksetzen', es: 'Sí, reiniciar', fr: 'Oui, réinitialiser',
    pt: 'Sim, redefinir', it: 'Sì, reimposta', tr: 'Evet, sıfırla',
    zh: '是，重置', ja: 'はい、リセット', ko: '예, 초기화',
  },
  done: {
    en: 'Done', he: 'סיום', ru: 'Готово',
    de: 'Fertig', es: 'Listo', fr: 'Terminé',
    pt: 'Pronto', it: 'Fatto', tr: 'Tamam',
    zh: '完成', ja: '完了', ko: '완료',
  },
  change: {
    en: 'CHANGE', he: 'שנה', ru: 'СМЕНИТЬ',
    de: 'ÄNDERN', es: 'CAMBIAR', fr: 'MODIFIER',
    pt: 'ALTERAR', it: 'CAMBIA', tr: 'DEĞİŞTİR',
    zh: '更改', ja: '変更', ko: '변경',
  },
  player: {
    en: 'player', he: 'שחקן', ru: 'игрок',
    de: 'Spieler', es: 'jugador', fr: 'joueur',
    pt: 'jogador', it: 'giocatore', tr: 'oyuncu',
    zh: '玩家', ja: 'プレイヤー', ko: '플레이어',
  },
  language: {
    en: 'Language', he: 'שפה', ru: 'Язык',
    de: 'Sprache', es: 'Idioma', fr: 'Langue',
    pt: 'Idioma', it: 'Lingua', tr: 'Dil',
    zh: '语言', ja: '言語', ko: '언어',
  },
  textSize: {
    en: 'Text Size', he: 'גודל טקסט', ru: 'Размер текста',
    de: 'Textgröße', es: 'Tamaño de texto', fr: 'Taille du texte',
    pt: 'Tamanho do texto', it: 'Dimensione testo', tr: 'Metin Boyutu',
    zh: '字体大小', ja: '文字サイズ', ko: '글자 크기',
  },
  theme: {
    en: 'Theme', he: 'ערכת נושא', ru: 'Тема',
    de: 'Design', es: 'Tema', fr: 'Thème',
    pt: 'Tema', it: 'Tema', tr: 'Tema',
    zh: '主题', ja: 'テーマ', ko: '테마',
  },
  light: {
    en: 'Light', he: 'בהיר', ru: 'Светлая',
    de: 'Hell', es: 'Claro', fr: 'Clair',
    pt: 'Claro', it: 'Chiaro', tr: 'Açık',
    zh: '浅色', ja: 'ライト', ko: '라이트',
  },
  dark: {
    en: 'Dark', he: 'כהה', ru: 'Тёмная',
    de: 'Dunkel', es: 'Oscuro', fr: 'Sombre',
    pt: 'Escuro', it: 'Scuro', tr: 'Koyu',
    zh: '深色', ja: 'ダーク', ko: '다크',
  },
  small: {
    en: 'Small', he: 'קטן', ru: 'Малый',
    de: 'Klein', es: 'Pequeño', fr: 'Petit',
    pt: 'Pequeno', it: 'Piccolo', tr: 'Küçük',
    zh: '小', ja: '小', ko: '작게',
  },
  normal: {
    en: 'Normal', he: 'רגיל', ru: 'Обычный',
    de: 'Normal', es: 'Normal', fr: 'Normal',
    pt: 'Normal', it: 'Normale', tr: 'Normal',
    zh: '标准', ja: '標準', ko: '보통',
  },
  larger: {
    en: 'Larger', he: 'גדול יותר', ru: 'Крупнее',
    de: 'Größer', es: 'Más grande', fr: 'Plus grand',
    pt: 'Maior', it: 'Più grande', tr: 'Daha büyük',
    zh: '更大', ja: 'さらに大', ko: '더 크게',
  },
  medium: {
    en: 'Medium', he: 'בינוני', ru: 'Средний',
    de: 'Mittel', es: 'Mediano', fr: 'Moyen',
    pt: 'Médio', it: 'Medio', tr: 'Orta',
    zh: '中', ja: '中', ko: '보통',
  },
  large: {
    en: 'Large', he: 'גדול', ru: 'Большой',
    de: 'Groß', es: 'Grande', fr: 'Grand',
    pt: 'Grande', it: 'Grande', tr: 'Büyük',
    zh: '大', ja: '大', ko: '크게',
  },
  totalUsers: {
    en: 'Commanders worldwide',
    he: 'מפקדים ברחבי העולם',
    ru: 'Командиров по всему миру',
    de: 'Kommandanten weltweit',
    es: 'Comandantes en el mundo',
    fr: 'Commandants dans le monde',
    pt: 'Comandantes no mundo',
    it: 'Comandanti nel mondo',
    tr: 'Dünyada komutanlar',
    zh: '全球指挥官',
    ja: '世界のコマンダー',
    ko: '전 세계 커맨더',
  },
  // ============ NEW KEYS ============
  strongestBuild: {
    en: 'Strongest Build Achieved!',
    he: 'הבילד החזק ביותר הושג!',
    ru: 'Сильнейший билд достигнут!',
    de: 'Stärkster Build erreicht!',
    es: '¡Build más fuerte logrado!',
    fr: 'Build le plus fort atteint !',
    pt: 'Build mais forte alcançado!',
    it: 'Build più forte raggiunto!',
    tr: 'En güçlü yapı başarıldı!',
    zh: '已达到最强配置！',
    ja: '最強ビルド達成！',
    ko: '최강 빌드 달성!',
  },
  everyPriorityMaxed: {
    en: 'Every priority tech maxed.',
    he: 'כל השדרוגים בעדיפות גבוהה מוקסמו.',
    ru: 'Все приоритетные технологии максимальны.',
    de: 'Alle Prioritäts-Techs auf Max.',
    es: 'Todas las tecnologías prioritarias al máximo.',
    fr: 'Toutes les techs prioritaires au max.',
    pt: 'Todas as techs prioritárias no máximo.',
    it: 'Tutte le tecnologie prioritarie al massimo.',
    tr: 'Tüm öncelikli teknolojiler max.',
    zh: '所有优先科技已满级。',
    ja: '全優先テック最大。',
    ko: '모든 우선순위 기술 최대치.',
  },
  currentLevel: {
    en: 'Current Level',
    he: 'רמה נוכחית',
    ru: 'Текущий уровень',
    de: 'Aktuelle Stufe',
    es: 'Nivel actual',
    fr: 'Niveau actuel',
    pt: 'Nível atual',
    it: 'Livello attuale',
    tr: 'Mevcut Seviye',
    zh: '当前等级',
    ja: '現在のレベル',
    ko: '현재 레벨',
  },
  maxedLabel: {
    en: 'Maxed',
    he: 'מוקסם',
    ru: 'Максимум',
    de: 'Maximum',
    es: 'Máximo',
    fr: 'Maximum',
    pt: 'Máximo',
    it: 'Massimo',
    tr: 'Max',
    zh: '满级',
    ja: '最大',
    ko: '최대치',
  },
  open: {
    en: 'Open',
    he: 'פתח',
    ru: 'Открыть',
    de: 'Öffnen',
    es: 'Abrir',
    fr: 'Ouvrir',
    pt: 'Abrir',
    it: 'Apri',
    tr: 'Aç',
    zh: '打开',
    ja: '開く',
    ko: '열기',
  },
  waveQueueTitle: {
    en: 'Wave Queue — your next 5 upgrades',
    he: 'תור גלים — 5 השדרוגים הבאים שלך',
    ru: 'Очередь — следующие 5 апгрейдов',
    de: 'Wellen-Warteschlange — deine nächsten 5 Upgrades',
    es: 'Cola — tus próximas 5 mejoras',
    fr: 'File — vos 5 prochaines améliorations',
    pt: 'Fila — suas próximas 5 melhorias',
    it: 'Coda — i prossimi 5 potenziamenti',
    tr: 'Sıra — sonraki 5 yükseltmeniz',
    zh: '队列 — 你的下5个升级',
    ja: 'キュー — 次の5つのアップグレード',
    ko: '대기열 — 다음 5개 업그레이드',
  },
  waveQueueDesc: {
    en: 'These are the same priority upgrades marked in the tree, sorted top-down.',
    he: 'אלה אותם שדרוגים בעדיפות שמסומנים בעץ, מסודרים מלמעלה למטה.',
    ru: 'Те же приоритетные апгрейды из дерева, по порядку.',
    de: 'Dieselben Prioritäten wie im Baum, von oben nach unten sortiert.',
    es: 'Las mismas mejoras prioritarias del árbol, ordenadas de arriba a abajo.',
    fr: 'Les mêmes priorités de l\'arbre, du haut vers le bas.',
    pt: 'As mesmas prioridades da árvore, de cima para baixo.',
    it: 'Le stesse priorità dell\'albero, dall\'alto al basso.',
    tr: 'Ağaçtaki aynı öncelikler, yukarıdan aşağıya.',
    zh: '与科技树中相同的优先升级，从上到下排列。',
    ja: 'ツリーの優先順位を上から順に。',
    ko: '트리에 표시된 우선 업그레이드를 위에서 아래로.',
  },
  rightPlace: {
    en: 'Right place — focus here now',
    he: 'המקום הנכון — התמקד כאן עכשיו',
    ru: 'Верное место — фокус здесь',
    de: 'Richtige Stelle — fokussiere hier',
    es: 'Lugar correcto — enfócate aquí',
    fr: 'Bon endroit — concentrez-vous ici',
    pt: 'Lugar certo — foque aqui',
    it: 'Posto giusto — concentrati qui',
    tr: 'Doğru yer — buraya odaklan',
    zh: '正确位置 — 专注于此',
    ja: '正しい場所 — ここに集中',
    ko: '맞는 위치 — 여기에 집중',
  },
  switchToPrefix: {
    en: 'Switch to',
    he: 'עבור ל',
    ru: 'Переключись на',
    de: 'Wechsle zu',
    es: 'Cambia a',
    fr: 'Passez à',
    pt: 'Mude para',
    it: 'Passa a',
    tr: 'Şuna geç:',
    zh: '切换到',
    ja: '切り替え:',
    ko: '전환:',
  },
  switchToSuffix: {
    en: 'that\'s your phase',
    he: 'זה השלב שלך',
    ru: 'это твоя фаза',
    de: 'das ist deine Phase',
    es: 'esa es tu fase',
    fr: 'c\'est votre phase',
    pt: 'essa é sua fase',
    it: 'è la tua fase',
    tr: 'bu senin aşaman',
    zh: '这是你的阶段',
    ja: 'それがあなたのフェーズ',
    ko: '그게 당신의 단계',
  },
  go: {
    en: 'GO',
    he: 'עבור',
    ru: 'ВПЕРЁД',
    de: 'LOS',
    es: 'IR',
    fr: 'GO',
    pt: 'IR',
    it: 'VAI',
    tr: 'GİT',
    zh: '前往',
    ja: '行く',
    ko: '이동',
  },
  markMax: {
    en: 'Already done',
    he: 'כבר עשיתי',
    ru: 'Уже сделано',
    de: 'Schon erledigt',
    es: 'Ya hecho',
    fr: 'Déjà fait',
    pt: 'Já feito',
    it: 'Già fatto',
    tr: 'Zaten yaptım',
    zh: '已完成',
    ja: 'もう完了',
    ko: '이미 완료',
  },
  resetTierBtn: {
    en: 'Reset Tier',
    he: 'אפס דרגה',
    ru: 'Сбросить уровень',
    de: 'Stufe zurücksetzen',
    es: 'Reiniciar nivel',
    fr: 'Réinit. palier',
    pt: 'Resetar nível',
    it: 'Reimposta livello',
    tr: 'Seviyeyi Sıfırla',
    zh: '重置等级',
    ja: 'ティアリセット',
    ko: '등급 초기화',
  },
  // ============ Toast strings ============
  undo: {
    en: 'Undo', he: 'בטל', ru: 'Отменить',
    de: 'Rückgängig', es: 'Deshacer', fr: 'Annuler',
    pt: 'Desfazer', it: 'Annulla', tr: 'Geri al',
    zh: '撤销', ja: '元に戻す', ko: '실행 취소',
  },
  alreadyMaxed: {
    en: 'Already maxed', he: 'כבר מוקסם', ru: 'Уже максимум',
    de: 'Schon Maximum', es: 'Ya al máximo', fr: 'Déjà au max',
    pt: 'Já no máximo', it: 'Già al massimo', tr: 'Zaten max',
    zh: '已满级', ja: '既に最大', ko: '이미 최대',
  },
  tierResetMsg: {
    en: 'Tier reset', he: 'דרגה אופסה', ru: 'Уровень сброшен',
    de: 'Stufe zurückgesetzt', es: 'Nivel reiniciado', fr: 'Palier réinitialisé',
    pt: 'Nível resetado', it: 'Livello reimpostato', tr: 'Seviye sıfırlandı',
    zh: '等级已重置', ja: 'ティアリセット', ko: '등급 초기화됨',
  },
  allReset: {
    en: 'All progress reset', he: 'כל ההתקדמות אופסה', ru: 'Прогресс сброшен',
    de: 'Fortschritt zurückgesetzt', es: 'Progreso reiniciado', fr: 'Progrès réinitialisé',
    pt: 'Progresso resetado', it: 'Progresso reimpostato', tr: 'İlerleme sıfırlandı',
    zh: '进度已重置', ja: '進捗リセット', ko: '진행도 초기화',
  },
  maxedSuffix: {
    en: 'MAXED', he: 'מוקסם', ru: 'МАКС',
    de: 'MAX', es: 'MÁX', fr: 'MAX',
    pt: 'MÁX', it: 'MAX', tr: 'MAX',
    zh: '满级', ja: '最大', ko: '최대',
  },
  nowAt: {
    en: 'now', he: 'כעת', ru: 'теперь',
    de: 'jetzt', es: 'ahora', fr: 'maintenant',
    pt: 'agora', it: 'ora', tr: 'şimdi',
    zh: '现在', ja: '現在', ko: '현재',
  },
  // ============ Spend profile descriptions ============
  f2pDesc: {
    en: 'Hold Battle for events',
    he: 'שמור Battle לאירועים',
    ru: 'Battle для событий',
    de: 'Battle für Events',
    es: 'Battle para eventos',
    fr: 'Battle pour événements',
    pt: 'Battle para eventos',
    it: 'Battle per eventi',
    tr: 'Battle\'ı etkinlikler için sakla',
    zh: '为活动保留战斗',
    ja: 'イベント用にBattle保持',
    ko: '이벤트용 Battle 보관',
  },
  midDesc: {
    en: 'Battle slightly earlier',
    he: 'Battle מעט מוקדם יותר',
    ru: 'Battle чуть раньше',
    de: 'Battle etwas früher',
    es: 'Battle un poco antes',
    fr: 'Battle un peu plus tôt',
    pt: 'Battle um pouco antes',
    it: 'Battle un po\' prima',
    tr: 'Battle biraz daha erken',
    zh: '稍早一点战斗',
    ja: 'Battle 少し早めに',
    ko: 'Battle 약간 일찍',
  },
  whaleDesc: {
    en: 'Battle first, skip Economy',
    he: 'Battle ראשון, דלג Economy',
    ru: 'Battle первый, без Economy',
    de: 'Battle zuerst, kein Economy',
    es: 'Battle primero, sin Economy',
    fr: 'Battle d\'abord, pas d\'Economy',
    pt: 'Battle primeiro, sem Economy',
    it: 'Battle prima, salta Economy',
    tr: 'Önce Battle, Economy atla',
    zh: '优先战斗，跳过经济',
    ja: 'Battle優先、Economy省略',
    ko: 'Battle 우선, Economy 건너뛰기',
  },
  // ============ "What this changes" body ============
  whatChangesF2P: {
    en: 'F2P: Foundation → Economy → Battle',
    he: 'F2P: יסודות ← כלכלה ← קרב',
    ru: 'F2P: основа → экономика → битва',
    de: 'F2P: Basis → Wirtschaft → Kampf',
    es: 'F2P: base → economía → batalla',
    fr: 'F2P : base → économie → combat',
    pt: 'F2P: base → economia → batalha',
    it: 'F2P: base → economia → battaglia',
    tr: 'F2P: temel → ekonomi → savaş',
    zh: 'F2P：基础 → 经济 → 战斗',
    ja: 'F2P：基礎 → 経済 → 戦闘',
    ko: 'F2P: 기초 → 경제 → 전투',
  },
  whatChangesMid: {
    en: 'MID: Foundation → mix',
    he: 'MID: יסודות ← מעורב',
    ru: 'MID: основа → смесь',
    de: 'MID: Basis → Mix',
    es: 'MID: base → mezcla',
    fr: 'MID : base → mix',
    pt: 'MID: base → mistura',
    it: 'MID: base → mix',
    tr: 'MID: temel → karışık',
    zh: 'MID：基础 → 混合',
    ja: 'MID：基礎 → ミックス',
    ko: 'MID: 기초 → 혼합',
  },
  whatChangesWhale: {
    en: 'WHALE: Foundation → Battle',
    he: 'WHALE: יסודות ← קרב',
    ru: 'WHALE: основа → битва',
    de: 'WHALE: Basis → Kampf',
    es: 'WHALE: base → batalla',
    fr: 'WHALE : base → combat',
    pt: 'WHALE: base → batalha',
    it: 'WHALE: base → battaglia',
    tr: 'WHALE: temel → savaş',
    zh: 'WHALE：基础 → 战斗',
    ja: 'WHALE：基礎 → 戦闘',
    ko: 'WHALE: 기초 → 전투',
  },
  // ============ Drawer callouts ============
  boostsAllTroops: {
    en: 'Boosts ALL troop types — Infantry, Archers, AND Cavalry.',
    he: 'משפר את כל סוגי החילות — חי״ר, קשתים ופרשים.',
    ru: 'Улучшает ВСЕ типы войск — пехоту, лучников и кавалерию.',
    de: 'Verbessert ALLE Truppen — Infanterie, Bogenschützen und Kavallerie.',
    es: 'Mejora TODOS los tipos — Infantería, Arqueros y Caballería.',
    fr: 'Améliore TOUTES les troupes — Infanterie, Archers et Cavalerie.',
    pt: 'Melhora TODAS as tropas — Infantaria, Arqueiros e Cavalaria.',
    it: 'Potenzia TUTTE le truppe — Fanteria, Arcieri e Cavalleria.',
    tr: 'TÜM birlik türlerini güçlendirir — Piyade, Okçular ve Süvari.',
    zh: '提升所有兵种 — 步兵、弓箭手和骑兵。',
    ja: '全兵種強化 — 歩兵、弓兵、騎兵。',
    ko: '모든 병종 강화 — 보병, 궁수, 기병.',
  },
  boostsTroopOnly: {
    en: 'Boosts {troop} only — won\'t affect other troop types.',
    he: 'משפר רק את {troop} — לא משפיע על שאר סוגי החילות.',
    ru: 'Улучшает только {troop} — не влияет на другие войска.',
    de: 'Verbessert nur {troop} — beeinflusst andere Truppen nicht.',
    es: 'Solo mejora {troop} — no afecta a otros tipos.',
    fr: 'Améliore uniquement {troop} — n\'affecte pas les autres troupes.',
    pt: 'Apenas {troop} — não afeta outros tipos.',
    it: 'Potenzia solo {troop} — non influisce sugli altri tipi.',
    tr: 'Sadece {troop} — diğer birlikleri etkilemez.',
    zh: '仅提升{troop} — 不影响其他兵种。',
    ja: '{troop}のみ強化 — 他兵種には影響なし。',
    ko: '{troop}만 강화 — 다른 병종에는 영향 없음.',
  },
  eventTrickLabel: {
    en: 'Event trick:', he: 'טיפ לאירוע:', ru: 'Хитрость для события:',
    de: 'Event-Trick:', es: 'Truco de evento:', fr: 'Astuce événement :',
    pt: 'Truque de evento:', it: 'Trucco evento:', tr: 'Etkinlik hilesi:',
    zh: '活动技巧：', ja: 'イベントの裏ワザ：', ko: '이벤트 팁:',
  },
  eventTrickBody: {
    en: 'Hold this and queue during Hall of Governors / Strongest Governor "Research" day for millions of free points.',
    he: 'שמור את זה לתור במהלך יום "מחקר" של Hall of Governors / Strongest Governor — מיליוני נקודות חינם.',
    ru: 'Сохраните и запустите в день «Исследование» Зала губернаторов — миллионы очков бесплатно.',
    de: 'Aufheben und am "Forschung"-Tag in Hall of Governors einreihen — Millionen Punkte gratis.',
    es: 'Guarda y úsalo el día "Investigación" del Salón de Gobernadores — millones de puntos gratis.',
    fr: 'Gardez-le pour le jour "Recherche" du Hall of Governors — millions de points gratuits.',
    pt: 'Guarde para o dia de "Pesquisa" no Hall of Governors — milhões de pontos grátis.',
    it: 'Conserva per il giorno "Ricerca" della Hall of Governors — milioni di punti gratis.',
    tr: 'Hall of Governors "Araştırma" günü için sakla — milyonlarca bedava puan.',
    zh: '保留至总督厅"研究"日入队 — 百万免费积分。',
    ja: 'Hall of Governorsの"研究"日に入れて — 何百万もの無料ポイント。',
    ko: 'Hall of Governors "연구"일에 큐에 넣으세요 — 수백만 무료 포인트.',
  },
  // ============ Priority group titles ============
  lowPriorityTitle: {
    en: 'LOW PRIORITY', he: 'עדיפות נמוכה', ru: 'НИЗКИЙ ПРИОРИТЕТ',
    de: 'NIEDRIGE PRIO', es: 'BAJA PRIORIDAD', fr: 'BASSE PRIORITÉ',
    pt: 'BAIXA PRIORIDADE', it: 'BASSA PRIORITÀ', tr: 'DÜŞÜK ÖNCELİK',
    zh: '低优先级', ja: '低優先度', ko: '낮은 우선순위',
  },
  doTheseLast: {
    en: 'do these last', he: 'אלה אחרונים', ru: 'делай в последнюю очередь',
    de: 'zuletzt machen', es: 'hacer al final', fr: 'à faire en dernier',
    pt: 'faça por último', it: 'fai per ultimo', tr: 'en son yap',
    zh: '最后做', ja: '最後にこれら', ko: '마지막에',
  },
  doNotResearch: {
    en: '⊘ DO NOT RESEARCH', he: '⊘ אל תחקור', ru: '⊘ НЕ ИЗУЧАТЬ',
    de: '⊘ NICHT ERFORSCHEN', es: '⊘ NO INVESTIGAR', fr: '⊘ NE PAS RECHERCHER',
    pt: '⊘ NÃO PESQUISAR', it: '⊘ NON RICERCARE', tr: '⊘ ARAŞTIRMA',
    zh: '⊘ 不要研究', ja: '⊘ 研究しない', ko: '⊘ 연구 금지',
  },
  trapTechs: {
    en: 'trap techs', he: 'טכנולוגיות מלכודת', ru: 'технологии-ловушки',
    de: 'Fallen-Techs', es: 'tecnologías trampa', fr: 'techs piège',
    pt: 'techs armadilha', it: 'tech trappola', tr: 'tuzak teknolojiler',
    zh: '陷阱科技', ja: 'トラップテック', ko: '함정 기술',
  },
  allMaxBadge: {
    en: 'ALL MAX', he: 'הכל מוקסם', ru: 'ВСЁ МАКС',
    de: 'ALLES MAX', es: 'TODO MÁX', fr: 'TOUT MAX',
    pt: 'TUDO MÁX', it: 'TUTTO MAX', tr: 'HEPSİ MAX',
    zh: '全满级', ja: '全最大', ko: '전부 최대',
  },
  // ============ Global progress + how-to dismiss ============
  overallProgress: {
    en: 'Overall progress', he: 'התקדמות כוללת', ru: 'Общий прогресс',
    de: 'Gesamtfortschritt', es: 'Progreso total', fr: 'Progrès global',
    pt: 'Progresso geral', it: 'Progresso totale', tr: 'Genel ilerleme',
    zh: '总进度', ja: '全体進捗', ko: '전체 진행도',
  },
  // ============ Spend profile names ============
  f2pName: {
    en: 'Free', he: 'חינמי', ru: 'F2P',
    de: 'Free', es: 'Gratis', fr: 'Gratuit',
    pt: 'Grátis', it: 'Gratis', tr: 'Ücretsiz',
    zh: '免费', ja: '無課金', ko: '무과금',
  },
  midName: {
    en: 'Mid Spender', he: 'משלם בינוני', ru: 'Средний',
    de: 'Mittel', es: 'Medio', fr: 'Moyen',
    pt: 'Médio', it: 'Medio', tr: 'Orta',
    zh: '中度氪金', ja: '中課金', ko: '중과금',
  },
  whaleName: {
    en: 'Whale', he: 'לוויתן', ru: 'Кит',
    de: 'Wal', es: 'Ballena', fr: 'Baleine',
    pt: 'Baleia', it: 'Balena', tr: 'Balina',
    zh: '大佬', ja: '廃課金', ko: '고래',
  },
  // ============ Tab progress / celebration ============
  allMaxedTitle: {
    en: 'Strongest Build Achieved!',
    he: 'הבילד החזק ביותר הושג!',
    ru: 'Сильнейший билд достигнут!',
    de: 'Stärkster Build erreicht!',
    es: '¡Build más fuerte logrado!',
    fr: 'Build le plus fort atteint !',
    pt: 'Build mais forte alcançado!',
    it: 'Build più forte raggiunto!',
    tr: 'En güçlü yapı başarıldı!',
    zh: '已达到最强配置！',
    ja: '最強ビルド達成！',
    ko: '최강 빌드 달성!',
  },
  allMaxedSub: {
    en: 'Every priority tech maxed across all 3 trees.',
    he: 'כל הטכנולוגיות בעדיפות גבוהה מוקסמו בשלושת העצים.',
    ru: 'Все приоритетные технологии максимальны во всех 3 деревьях.',
    de: 'Alle Prioritäts-Techs in allen 3 Bäumen max.',
    es: 'Todas las prioridades al máximo en los 3 árboles.',
    fr: 'Toutes les priorités au max dans les 3 arbres.',
    pt: 'Todas as prioridades no máximo nos 3 ramos.',
    it: 'Tutte le priorità al massimo in tutti i 3 alberi.',
    tr: 'Tüm 3 ağaçtaki öncelikli teknolojiler max.',
    zh: '3个科技树中的所有优先科技已满级。',
    ja: '3つのツリー全ての優先テック最大。',
    ko: '3개 트리 모두 우선순위 기술 최대치.',
  },
  // ============ Pin / unpin ============
  pin: {
    en: 'Pin', he: 'נעוץ', ru: 'Закрепить',
    de: 'Anheften', es: 'Fijar', fr: 'Épingler',
    pt: 'Fixar', it: 'Fissa', tr: 'Sabitle',
    zh: '置顶', ja: 'ピン留め', ko: '고정',
  },
  unpin: {
    en: 'Unpin', he: 'בטל נעיצה', ru: 'Открепить',
    de: 'Lösen', es: 'Soltar', fr: 'Détacher',
    pt: 'Desafixar', it: 'Sgancia', tr: 'Çöz',
    zh: '取消置顶', ja: 'ピン解除', ko: '고정 해제',
  },
  pinnedBadge: {
    en: 'PINNED', he: 'נעוץ', ru: 'ЗАКРЕП.',
    de: 'ANGEHEFTET', es: 'FIJADO', fr: 'ÉPINGLÉ',
    pt: 'FIXADO', it: 'FISSATO', tr: 'SABİT',
    zh: '已置顶', ja: 'ピン留め', ko: '고정됨',
  },
  skipForNow: {
    en: 'Skip for now', he: 'דלג כרגע', ru: 'Пропустить',
    de: 'Vorerst überspringen', es: 'Saltar por ahora', fr: 'Passer',
    pt: 'Pular por agora', it: 'Salta per ora', tr: 'Şimdilik atla',
    zh: '暂时跳过', ja: '今はスキップ', ko: '지금 건너뛰기',
  },
  unskip: {
    en: 'Unskip', he: 'בטל דילוג', ru: 'Вернуть',
    de: 'Wiederherstellen', es: 'Recuperar', fr: 'Restaurer',
    pt: 'Restaurar', it: 'Ripristina', tr: 'Geri al',
    zh: '取消跳过', ja: 'スキップ解除', ko: '건너뛰기 해제',
  },
  skipped: {
    en: 'Skipped — moved to bottom', he: 'דולג — הועבר לתחתית', ru: 'Пропущено',
    de: 'Übersprungen', es: 'Saltado', fr: 'Passé',
    pt: 'Pulado', it: 'Saltato', tr: 'Atlandı',
    zh: '已跳过', ja: 'スキップしました', ko: '건너뛰었습니다',
  },
  unskipped: {
    en: 'Restored to queue', he: 'הוחזר לתור', ru: 'Восстановлено',
    de: 'Wiederhergestellt', es: 'Restaurado', fr: 'Restauré',
    pt: 'Restaurado', it: 'Ripristinato', tr: 'Geri alındı',
    zh: '已恢复', ja: '復元しました', ko: '복원되었습니다',
  },
  skippedSection: {
    en: 'Skipped techs', he: 'שדרוגים שדולגו', ru: 'Пропущенные',
    de: 'Übersprungen', es: 'Saltadas', fr: 'Passées',
    pt: 'Puladas', it: 'Saltate', tr: 'Atlananlar',
    zh: '已跳过', ja: 'スキップ済み', ko: '건너뛴 항목',
  },
  // ============ Export / Import ============
  exportProgress: {
    en: 'Export', he: 'ייצא', ru: 'Экспорт',
    de: 'Exportieren', es: 'Exportar', fr: 'Exporter',
    pt: 'Exportar', it: 'Esporta', tr: 'Dışa aktar',
    zh: '导出', ja: 'エクスポート', ko: '내보내기',
  },
  importProgress: {
    en: 'Import', he: 'ייבא', ru: 'Импорт',
    de: 'Importieren', es: 'Importar', fr: 'Importer',
    pt: 'Importar', it: 'Importa', tr: 'İçe aktar',
    zh: '导入', ja: 'インポート', ko: '가져오기',
  },
  exportDesc: {
    en: 'Copy this code to back up your progress. Save it somewhere safe.',
    he: 'העתק את הקוד כדי לגבות את ההתקדמות. שמור אותו במקום בטוח.',
    ru: 'Скопируйте этот код для резервной копии. Сохраните в надёжном месте.',
    de: 'Kopiere diesen Code zur Sicherung. An einem sicheren Ort aufbewahren.',
    es: 'Copia este código para guardar tu progreso. Guárdalo en lugar seguro.',
    fr: 'Copiez ce code pour sauvegarder. Conservez-le en lieu sûr.',
    pt: 'Copie este código para salvar seu progresso. Guarde em local seguro.',
    it: 'Copia questo codice per il backup. Conservalo al sicuro.',
    tr: 'Yedek için bu kodu kopyala. Güvenli yere kaydet.',
    zh: '复制此代码备份进度。保存在安全位置。',
    ja: 'このコードをコピーして進捗をバックアップ。安全な場所に保存。',
    ko: '이 코드를 복사해 진행도를 백업하세요. 안전한 곳에 저장하세요.',
  },
  importDesc: {
    en: 'Paste a backup code here to restore. This will replace your current progress.',
    he: 'הדבק קוד גיבוי כאן לשחזור. זה יחליף את ההתקדמות הנוכחית.',
    ru: 'Вставьте код для восстановления. Текущий прогресс будет заменён.',
    de: 'Sicherungscode hier einfügen. Der aktuelle Fortschritt wird ersetzt.',
    es: 'Pega un código aquí para restaurar. Reemplazará tu progreso actual.',
    fr: 'Collez un code ici pour restaurer. Cela remplacera votre progrès.',
    pt: 'Cole um código aqui para restaurar. Substituirá seu progresso atual.',
    it: 'Incolla un codice qui per ripristinare. Sostituirà il progresso attuale.',
    tr: 'Geri yüklemek için kodu yapıştır. Mevcut ilerleme değişecek.',
    zh: '粘贴备份代码以恢复。将替换当前进度。',
    ja: 'バックアップコードを貼り付けて復元。現在の進捗を置き換えます。',
    ko: '백업 코드를 여기에 붙여넣어 복원하세요. 현재 진행도가 대체됩니다.',
  },
  copyToClipboard: {
    en: 'Copy', he: 'העתק', ru: 'Копировать',
    de: 'Kopieren', es: 'Copiar', fr: 'Copier',
    pt: 'Copiar', it: 'Copia', tr: 'Kopyala',
    zh: '复制', ja: 'コピー', ko: '복사',
  },
  copied: {
    en: 'Copied!', he: 'הועתק!', ru: 'Скопировано!',
    de: 'Kopiert!', es: '¡Copiado!', fr: 'Copié !',
    pt: 'Copiado!', it: 'Copiato!', tr: 'Kopyalandı!',
    zh: '已复制！', ja: 'コピー済み！', ko: '복사됨!',
  },
  importBtn: {
    en: 'Restore', he: 'שחזר', ru: 'Восстановить',
    de: 'Wiederherstellen', es: 'Restaurar', fr: 'Restaurer',
    pt: 'Restaurar', it: 'Ripristina', tr: 'Geri yükle',
    zh: '恢复', ja: '復元', ko: '복원',
  },
  importOk: {
    en: 'Progress restored', he: 'ההתקדמות שוחזרה', ru: 'Прогресс восстановлен',
    de: 'Fortschritt wiederhergestellt', es: 'Progreso restaurado', fr: 'Progrès restauré',
    pt: 'Progresso restaurado', it: 'Progresso ripristinato', tr: 'İlerleme geri yüklendi',
    zh: '进度已恢复', ja: '進捗復元', ko: '진행도 복원됨',
  },
  importBad: {
    en: 'Invalid backup code', he: 'קוד גיבוי לא תקין', ru: 'Неверный код',
    de: 'Ungültiger Code', es: 'Código no válido', fr: 'Code invalide',
    pt: 'Código inválido', it: 'Codice non valido', tr: 'Geçersiz kod',
    zh: '备份代码无效', ja: '無効なコード', ko: '잘못된 코드',
  },
  // ============ Streak ============
  daysActive: {
    en: 'days active', he: 'ימי פעילות', ru: 'дней активности',
    de: 'Tage aktiv', es: 'días activo', fr: 'jours actifs',
    pt: 'dias ativos', it: 'giorni attivo', tr: 'aktif gün',
    zh: '活跃天数', ja: 'アクティブ日数', ko: '활동일',
  },
  liveTogether: {
    en: 'WE LIVE TOGETHER', he: 'אנחנו חיים יחד', ru: 'МЫ ЖИВЁМ ВМЕСТЕ',
    de: 'WIR LEBEN ZUSAMMEN', es: 'VIVIMOS JUNTOS', fr: 'NOUS VIVONS ENSEMBLE',
    pt: 'VIVEMOS JUNTOS', it: 'VIVIAMO INSIEME', tr: 'BİRLİKTE YAŞARIZ',
    zh: '我们共同生活', ja: '共に生きる', ko: '함께 살아간다',
  },
  growTogether: {
    en: 'WE GROW TOGETHER', he: 'אנחנו גדלים יחד', ru: 'МЫ РАСТЁМ ВМЕСТЕ',
    de: 'WIR WACHSEN ZUSAMMEN', es: 'CRECEMOS JUNTOS', fr: 'NOUS GRANDISSONS ENSEMBLE',
    pt: 'CRESCEMOS JUNTOS', it: 'CRESCIAMO INSIEME', tr: 'BİRLİKTE BÜYÜRÜZ',
    zh: '我们共同成长', ja: '共に成長する', ko: '함께 성장한다',
  },
  fightTogether: {
    en: 'WE FIGHT TOGETHER', he: 'אנחנו נלחמים יחד', ru: 'МЫ СРАЖАЕМСЯ ВМЕСТЕ',
    de: 'WIR KÄMPFEN ZUSAMMEN', es: 'LUCHAMOS JUNTOS', fr: 'NOUS COMBATTONS ENSEMBLE',
    pt: 'LUTAMOS JUNTOS', it: 'COMBATTIAMO INSIEME', tr: 'BİRLİKTE SAVAŞIRIZ',
    zh: '我们共同战斗', ja: '共に戦う', ko: '함께 싸운다',
  },
  counterLabel: {
    en: 'counter', he: 'מונה', ru: 'счётчик',
    de: 'Zähler', es: 'contador', fr: 'compteur',
    pt: 'contador', it: 'contatore', tr: 'sayaç',
    zh: '计数', ja: 'カウンター', ko: '카운터',
  },
  whyThis: {
    en: 'Why this?', he: 'למה זה?', ru: 'Почему это?',
    de: 'Warum das?', es: '¿Por qué?', fr: 'Pourquoi ?',
    pt: 'Por quê?', it: 'Perché?', tr: 'Neden?',
    zh: '为什么？', ja: 'なぜこれ?', ko: '왜 이거?',
  },
  searchPlaceholder: {
    en: 'Search techs by name or effect…',
    he: 'חיפוש שדרוגים לפי שם או אפקט…',
    ru: 'Поиск по названию или эффекту…',
    de: 'Suche nach Name oder Effekt…',
    es: 'Buscar por nombre o efecto…',
    fr: 'Rechercher par nom ou effet…',
    pt: 'Buscar por nome ou efeito…',
    it: 'Cerca per nome o effetto…',
    tr: 'Ada veya etkiye göre ara…',
    zh: '按名称或效果搜索…',
    ja: '名前または効果で検索…',
    ko: '이름 또는 효과로 검색…',
  },
  searchNoResults: {
    en: 'No matching techs', he: 'אין תוצאות', ru: 'Ничего не найдено',
    de: 'Keine Treffer', es: 'Sin resultados', fr: 'Aucun résultat',
    pt: 'Sem resultados', it: 'Nessun risultato', tr: 'Sonuç yok',
    zh: '无结果', ja: '結果なし', ko: '결과 없음',
  },
  search: {
    en: 'Search', he: 'חיפוש', ru: 'Поиск',
    de: 'Suchen', es: 'Buscar', fr: 'Rechercher',
    pt: 'Buscar', it: 'Cerca', tr: 'Ara',
    zh: '搜索', ja: '検索', ko: '검색',
  },
  // ============ Recruitment ============
  joinUs: {
    en: 'JOIN xXx', he: 'הצטרף ל-xXx', ru: 'ВСТУПИТЬ',
    de: 'BEITRETEN', es: 'ÚNETE', fr: 'REJOIGNEZ',
    pt: 'JUNTE-SE', it: 'UNISCITI', tr: 'KATIL',
    zh: '加入', ja: '参加', ko: '가입',
  },
  recruitTitle: {
    en: 'Join the xXx Commanders',
    he: 'הצטרף ל-xXx Commanders',
    ru: 'Вступай в xXx Commanders',
    de: 'Tritt den xXx Commanders bei',
    es: 'Únete a xXx Commanders',
    fr: 'Rejoignez les xXx Commanders',
    pt: 'Junte-se aos xXx Commanders',
    it: 'Unisciti agli xXx Commanders',
    tr: 'xXx Commanders\'a katıl',
    zh: '加入 xXx Commanders',
    ja: 'xXx Commanders に参加',
    ko: 'xXx Commanders 가입',
  },
  recruitKingdom: {
    en: 'KINGDOM', he: 'ממלכה', ru: 'КОРОЛЕВСТВО',
    de: 'KÖNIGREICH', es: 'REINO', fr: 'ROYAUME',
    pt: 'REINO', it: 'REGNO', tr: 'KRALLIK',
    zh: '王国', ja: '王国', ko: '왕국',
  },
  recruitWhy: {
    en: 'Why join us',
    he: 'למה להצטרף אלינו',
    ru: 'Почему мы',
    de: 'Warum wir',
    es: 'Por qué nosotros',
    fr: 'Pourquoi nous',
    pt: 'Por que nós',
    it: 'Perché noi',
    tr: 'Neden biz',
    zh: '为什么选择我们',
    ja: 'なぜ私たち',
    ko: '왜 우리인가',
  },
  recruitContact: {
    en: 'Contact us',
    he: 'צור קשר',
    ru: 'Связаться',
    de: 'Kontakt',
    es: 'Contáctanos',
    fr: 'Contactez-nous',
    pt: 'Fale conosco',
    it: 'Contattaci',
    tr: 'Bize ulaş',
    zh: '联系我们',
    ja: 'お問い合わせ',
    ko: '문의하기',
  },
  recruitInGame: {
    en: 'In-game',
    he: 'במשחק',
    ru: 'В игре',
    de: 'Im Spiel',
    es: 'En el juego',
    fr: 'En jeu',
    pt: 'No jogo',
    it: 'Nel gioco',
    tr: 'Oyunda',
    zh: '游戏内',
    ja: 'ゲーム内',
    ko: '게임 내',
  },
  recruitDmLeader: {
    en: 'DM the leader',
    he: 'הודעה אישית למנהיג',
    ru: 'Написать лидеру',
    de: 'Anführer DM',
    es: 'MD al líder',
    fr: 'MP au leader',
    pt: 'DM ao líder',
    it: 'DM al leader',
    tr: 'Lidere DM',
    zh: '私信领袖',
    ja: 'リーダーにDM',
    ko: '리더에게 DM',
  },
  recruitTapCopy: {
    en: 'Tap to copy',
    he: 'הקש להעתקה',
    ru: 'Нажмите, чтобы скопировать',
    de: 'Zum Kopieren tippen',
    es: 'Toca para copiar',
    fr: 'Appuyez pour copier',
    pt: 'Toque para copiar',
    it: 'Tocca per copiare',
    tr: 'Kopyalamak için dokun',
    zh: '点击复制',
    ja: 'タップしてコピー',
    ko: '탭하여 복사',
  },
  recruitLooking: {
    en: 'Looking for a kingdom?',
    he: 'מחפש ממלכה?',
    ru: 'Ищешь королевство?',
    de: 'Suchst du ein Königreich?',
    es: '¿Buscas un reino?',
    fr: 'Tu cherches un royaume ?',
    pt: 'Procurando um reino?',
    it: 'Cerchi un regno?',
    tr: 'Krallık mı arıyorsun?',
    zh: '寻找王国？',
    ja: '王国を探していますか？',
    ko: '왕국을 찾고 있나요?',
  },
  markTierDone: {
    en: 'Mark all done — Tier',
    he: 'סמן הכל כמושלם — דרגה',
    ru: 'Отметить всё — Уровень',
    de: 'Alles erledigt — Stufe',
    es: 'Todo hecho — Nivel',
    fr: 'Tout fait — Niveau',
    pt: 'Tudo feito — Nível',
    it: 'Tutto fatto — Livello',
    tr: 'Tümü tamam — Seviye',
    zh: '全部完成 — 级别',
    ja: '全て完了 — ティア',
    ko: '모두 완료 — 티어',
  },
  tierMaxed: {
    en: 'Tier marked done',
    he: 'דרגה סומנה כמושלמת',
    ru: 'Уровень отмечен',
    de: 'Stufe erledigt',
    es: 'Nivel completado',
    fr: 'Niveau terminé',
    pt: 'Nível concluído',
    it: 'Livello completato',
    tr: 'Seviye tamamlandı',
    zh: '级别完成',
    ja: 'ティア完了',
    ko: '티어 완료',
  },
};

// Translate helper
function t(key, lang) {
  if (!T[key]) return key;
  return T[key][lang] || T[key].en || key;
}

// ============================================================
// TECH NAME / EFFECT TRANSLATIONS — keyed by family.id
// Each entry has both `n` (short name) and `e` (effect description).
// Falls back to English from family.name / family.effect if missing.
// ============================================================
const TECH_I18N = {
  // === GROWTH ===
  'tool-enhancement':   { n: { he: 'שיפור כלים', ru: 'Улучш. инструм.', de: 'Werkzeug-Upgrade', es: 'Mejora herram.', fr: 'Outils améliorés', pt: 'Melhoria ferram.', it: 'Pot. attrezzi', tr: 'Alet İyileştirme', zh: '工具强化', ja: 'ツール強化', ko: '도구 강화' },
                          e: { he: 'מהירות מחקר', ru: 'Скорость иссл.', de: 'Forschungstempo', es: 'Vel. invest.', fr: 'Vit. recherche', pt: 'Vel. pesquisa', it: 'Vel. ricerca', tr: 'Araştırma Hızı', zh: '研究速度', ja: '研究速度', ko: '연구 속도' } },
  'tooling-up':         { n: { he: 'הכנת כלים', ru: 'Снаряжение', de: 'Aufrüstung', es: 'Equipamiento', fr: 'Équipement', pt: 'Equipamento', it: 'Attrezzatura', tr: 'Donanım', zh: '装备', ja: '装備', ko: '장비' },
                          e: { he: 'מהירות בנייה', ru: 'Скор. стройки', de: 'Bautempo', es: 'Vel. construc.', fr: 'Vit. construction', pt: 'Vel. construção', it: 'Vel. costruz.', tr: 'İnşa Hızı', zh: '建造速度', ja: '建設速度', ko: '건설 속도' } },
  'command-tactics':    { n: { he: 'טקטיקות פיקוד', ru: 'Команд. тактика', de: 'Kommando-Taktik', es: 'Tácticas mando', fr: 'Tactiques cmd.', pt: 'Táticas comando', it: 'Tatt. comando', tr: 'Komuta Taktiği', zh: '指挥战术', ja: '指揮戦術', ko: '지휘 전술' },
                          e: { he: 'תורי צבאות', ru: 'Очереди марша', de: 'Marschplätze', es: 'Colas marcha', fr: 'Files marche', pt: 'Filas marcha', it: 'Code marcia', tr: 'Yürüyüş Sırası', zh: '行军队列', ja: '行軍枠', ko: '행군 대기열' } },
  'ward-expansion':     { n: { he: 'הרחבת מרפאה', ru: 'Расш. лазарета', de: 'Lazarett-Ausb.', es: 'Amp. enfermería', fr: 'Ext. infirmerie', pt: 'Amp. enfermaria', it: 'Esp. infermeria', tr: 'Revir Genişl.', zh: '扩展医院', ja: '医療所拡張', ko: '의무실 확장' },
                          e: { he: 'קיבולת מרפאה', ru: 'Вмест. лазарета', de: 'Lazarett-Kapaz.', es: 'Capac. enferm.', fr: 'Cap. infirmerie', pt: 'Cap. enfermaria', it: 'Cap. infermeria', tr: 'Revir Kapas.', zh: '医院容量', ja: '医療所容量', ko: '의무실 용량' } },
  'bandaging':          { n: { he: 'חבישה', ru: 'Перевязка', de: 'Verbände', es: 'Vendaje', fr: 'Bandages', pt: 'Curativos', it: 'Bendaggio', tr: 'Bandaj', zh: '包扎', ja: '包帯', ko: '붕대' },
                          e: { he: 'מהירות ריפוי', ru: 'Скор. лечения', de: 'Heiltempo', es: 'Vel. curación', fr: 'Vit. soin', pt: 'Vel. cura', it: 'Vel. cura', tr: 'İyileşme Hızı', zh: '治疗速度', ja: '治療速度', ko: '치료 속도' } },
  'trainer-tools':      { n: { he: 'כלי אימון', ru: 'Инстр. тренера', de: 'Trainer-Tools', es: 'Herram. entren.', fr: 'Outils entraîn.', pt: 'Ferram. treino', it: 'Strum. addestr.', tr: 'Eğitmen Araçları', zh: '训练工具', ja: '訓練ツール', ko: '훈련 도구' },
                          e: { he: 'מהירות אימון', ru: 'Скор. обучения', de: 'Trainingstempo', es: 'Vel. entren.', fr: 'Vit. entraîn.', pt: 'Vel. treino', it: 'Vel. addestr.', tr: 'Eğitim Hızı', zh: '训练速度', ja: '訓練速度', ko: '훈련 속도' } },
  'camp-expansion':     { n: { he: 'הרחבת מחנה', ru: 'Расш. лагеря', de: 'Lager-Ausbau', es: 'Amp. campamento', fr: 'Ext. camp', pt: 'Amp. acampam.', it: 'Esp. campo', tr: 'Kamp Genişl.', zh: '扩展营地', ja: 'キャンプ拡張', ko: '캠프 확장' },
                          e: { he: 'קיבולת אימון', ru: 'Вмест. обучения', de: 'Trainingskapaz.', es: 'Capac. entren.', fr: 'Cap. entraîn.', pt: 'Cap. treino', it: 'Cap. addestr.', tr: 'Eğitim Kapas.', zh: '训练容量', ja: '訓練容量', ko: '훈련 용량' } },

  // === ECONOMY ===
  'food-foraging':      { n: { he: 'לקט מזון', ru: 'Сбор еды', de: 'Nahrungssuche', es: 'Recolec. comida', fr: 'Récolte nourrit.', pt: 'Coleta comida', it: 'Racc. cibo', tr: 'Yiyecek Topl.', zh: '食物收集', ja: '食料採集', ko: '식량 채집' },
                          e: { he: 'איסוף לחם', ru: 'Сбор хлеба', de: 'Brotsammeln', es: 'Recolec. pan', fr: 'Récolte pain', pt: 'Coleta pão', it: 'Racc. pane', tr: 'Ekmek Topl.', zh: '面包收集', ja: 'パン採集', ko: '빵 채집' } },
  'wood-gathering':     { n: { he: 'איסוף עץ', ru: 'Сбор дерева', de: 'Holzsammeln', es: 'Recolec. madera', fr: 'Récolte bois', pt: 'Coleta madeira', it: 'Racc. legno', tr: 'Odun Topl.', zh: '木材收集', ja: '木材採集', ko: '목재 채집' },
                          e: { he: 'איסוף עץ', ru: 'Сбор дерева', de: 'Holzsammeln', es: 'Recolec. madera', fr: 'Récolte bois', pt: 'Coleta madeira', it: 'Racc. legno', tr: 'Odun Topl.', zh: '木材收集', ja: '木材採集', ko: '목재 채집' } },
  'stone-mining':       { n: { he: 'כריית אבן', ru: 'Добыча камня', de: 'Steinabbau', es: 'Min. piedra', fr: 'Minage pierre', pt: 'Min. pedra', it: 'Estraz. pietra', tr: 'Taş Madenc.', zh: '石头开采', ja: '石採掘', ko: '돌 채굴' },
                          e: { he: 'איסוף אבן', ru: 'Сбор камня', de: 'Steinsammeln', es: 'Recolec. piedra', fr: 'Récolte pierre', pt: 'Coleta pedra', it: 'Racc. pietra', tr: 'Taş Topl.', zh: '石头收集', ja: '石採集', ko: '돌 채집' } },
  'iron-mining':        { n: { he: 'כריית ברזל', ru: 'Добыча железа', de: 'Eisenabbau', es: 'Min. hierro', fr: 'Minage fer', pt: 'Min. ferro', it: 'Estraz. ferro', tr: 'Demir Madenc.', zh: '铁开采', ja: '鉄採掘', ko: '철 채굴' },
                          e: { he: 'איסוף ברזל', ru: 'Сбор железа', de: 'Eisensammeln', es: 'Recolec. hierro', fr: 'Récolte fer', pt: 'Coleta ferro', it: 'Racc. ferro', tr: 'Demir Topl.', zh: '铁收集', ja: '鉄採集', ko: '철 채집' } },
  'bread-output':       { n: { he: 'תפוקת לחם', ru: 'Произв. хлеба', de: 'Brotproduktion', es: 'Prod. pan', fr: 'Prod. pain', pt: 'Prod. pão', it: 'Prod. pane', tr: 'Ekmek Üret.', zh: '面包产量', ja: 'パン生産', ko: '빵 생산' },
                          e: { he: 'תפוקת טחנה', ru: 'Мельница', de: 'Mühle', es: 'Molino', fr: 'Moulin', pt: 'Moinho', it: 'Mulino', tr: 'Değirmen', zh: '磨坊产量', ja: '製粉所', ko: '제분소' } },
  'wood-output':        { n: { he: 'תפוקת עץ', ru: 'Произв. дерева', de: 'Holzproduktion', es: 'Prod. madera', fr: 'Prod. bois', pt: 'Prod. madeira', it: 'Prod. legno', tr: 'Odun Üret.', zh: '木材产量', ja: '木材生産', ko: '목재 생산' },
                          e: { he: 'תפוקת מנסרה', ru: 'Лесопилка', de: 'Sägewerk', es: 'Aserradero', fr: 'Scierie', pt: 'Serraria', it: 'Segheria', tr: 'Bıçkıhane', zh: '锯木厂产量', ja: '製材所', ko: '제재소' } },
  'stone-output':       { n: { he: 'תפוקת אבן', ru: 'Произв. камня', de: 'Steinproduktion', es: 'Prod. piedra', fr: 'Prod. pierre', pt: 'Prod. pedra', it: 'Prod. pietra', tr: 'Taş Üret.', zh: '石头产量', ja: '石生産', ko: '돌 생산' },
                          e: { he: 'תפוקת מחצבה', ru: 'Каменоломня', de: 'Steinbruch', es: 'Cantera', fr: 'Carrière', pt: 'Pedreira', it: 'Cava', tr: 'Taş Ocağı', zh: '采石场产量', ja: '採石場', ko: '채석장' } },
  'iron-output':        { n: { he: 'תפוקת ברזל', ru: 'Произв. железа', de: 'Eisenproduktion', es: 'Prod. hierro', fr: 'Prod. fer', pt: 'Prod. ferro', it: 'Prod. ferro', tr: 'Demir Üret.', zh: '铁产量', ja: '鉄生産', ko: '철 생산' },
                          e: { he: 'תפוקת מכרה', ru: 'Шахта', de: 'Mine', es: 'Mina', fr: 'Mine', pt: 'Mina', it: 'Miniera', tr: 'Maden', zh: '矿山产量', ja: '鉱山', ko: '광산' } },

  // === BATTLE — Universal ===
  'survival-techniques': { n: { he: 'הישרדות', ru: 'Выживание', de: 'Überleben', es: 'Supervivencia', fr: 'Survie', pt: 'Sobrevivência', it: 'Sopravvivenza', tr: 'Hayatta Kalma', zh: '生存', ja: '生存', ko: '생존' },
                           e: { he: 'בריאות חיילים', ru: 'Здоровье войск', de: 'Truppen-LP', es: 'Salud tropas', fr: 'Santé troupes', pt: 'Vida tropas', it: 'Salute truppe', tr: 'Asker Canı', zh: '全军生命', ja: '全兵HP', ko: '전군 체력' } },
  'assault-techniques':  { n: { he: 'הסתערות', ru: 'Штурм', de: 'Angriff', es: 'Asalto', fr: 'Assaut', pt: 'Assalto', it: 'Assalto', tr: 'Saldırı', zh: '突击', ja: '突撃', ko: '돌격' },
                           e: { he: 'קטלניות חיילים', ru: 'Уроп. войск', de: 'Truppen-Letal.', es: 'Letalidad tropas', fr: 'Létalité troupes', pt: 'Letal. tropas', it: 'Letalità truppe', tr: 'Asker Ölüm.', zh: '全军致命', ja: '全兵致死率', ko: '전군 치명' } },
  'regimental-expansion': { n: { he: 'גדוד', ru: 'Полк', de: 'Regiment', es: 'Regimiento', fr: 'Régiment', pt: 'Regimento', it: 'Reggimento', tr: 'Alay', zh: '军团', ja: '連隊', ko: '연대' },
                           e: { he: 'קיבולת רלי', ru: 'Вмест. сбора', de: 'Sammelkapaz.', es: 'Cap. asalto', fr: 'Cap. ralliement', pt: 'Cap. ralis', it: 'Cap. raduno', tr: 'Topl. Kapas.', zh: '集结容量', ja: '集結枠', ko: '집결 용량' } },
  'weapons-prep':       { n: { he: 'הכנת נשק', ru: 'Подгот. оружия', de: 'Waffen-Vorb.', es: 'Prep. armas', fr: 'Prép. armes', pt: 'Prep. armas', it: 'Prep. armi', tr: 'Silah Hazırl.', zh: '武器准备', ja: '武器準備', ko: '무기 준비' },
                           e: { he: 'התקפת חיילים', ru: 'Атака войск', de: 'Truppen-Angr.', es: 'Ataque tropas', fr: 'Attaque troupes', pt: 'Ataque tropas', it: 'Attacco truppe', tr: 'Asker Sald.', zh: '全军攻击', ja: '全兵攻撃', ko: '전군 공격' } },
  'reprisal-tactics':   { n: { he: 'גמול', ru: 'Возмездие', de: 'Vergeltung', es: 'Represalia', fr: 'Représailles', pt: 'Represália', it: 'Rappresaglia', tr: 'Misilleme', zh: '反击', ja: '報復', ko: '보복' },
                           e: { he: 'הגנת חיילים', ru: 'Защита войск', de: 'Truppen-Vert.', es: 'Defensa tropas', fr: 'Défense troupes', pt: 'Defesa tropas', it: 'Difesa truppe', tr: 'Asker Sav.', zh: '全军防御', ja: '全兵防御', ko: '전군 방어' } },
  'special-defensive-training': { n: { he: 'הגנה מיוחדת', ru: 'Спец. защита', de: 'Spez. Verteid.', es: 'Def. especial', fr: 'Déf. spéciale', pt: 'Def. especial', it: 'Dif. speciale', tr: 'Özel Savunma', zh: '特殊防御', ja: '特殊防御', ko: '특수 방어' },
                           e: { he: 'בונוס הגנה', ru: 'Бонус защ.', de: 'Verteid.-Bonus', es: 'Bono def.', fr: 'Bonus déf.', pt: 'Bônus def.', it: 'Bonus dif.', tr: 'Sav. Bonusu', zh: '防御加成', ja: '防御ボーナス', ko: '방어 보너스' } },

  // === BATTLE — Infantry ===
  'shield-upgrade':     { n: { he: 'שיפור מגן', ru: 'Усил. щита', de: 'Schild-Upgr.', es: 'Mej. escudo', fr: 'Améli. bouclier', pt: 'Melh. escudo', it: 'Pot. scudo', tr: 'Kalkan Yükselt.', zh: '盾牌升级', ja: '盾強化', ko: '방패 강화' },
                           e: { he: 'בריאות חי״ר', ru: 'Здоровье пехоты', de: 'Infanterie-LP', es: 'Salud Infant.', fr: 'Santé Infanter.', pt: 'Vida Infant.', it: 'Salute Fanter.', tr: 'Piyade Canı', zh: '步兵生命', ja: '歩兵HP', ko: '보병 체력' } },
  'defensive-formations': { n: { he: 'הגנת חי״ר', ru: 'Защита пехоты', de: 'Inf-Verteid.', es: 'Def. Infant.', fr: 'Déf. Infant.', pt: 'Def. Infant.', it: 'Dif. Fanter.', tr: 'Piyade Sav.', zh: '步兵防御', ja: '歩兵防御', ko: '보병 방어' },
                           e: { he: 'הגנת חי״ר', ru: 'Защита пехоты', de: 'Inf-Verteidigung', es: 'Defensa Infant.', fr: 'Défense Infant.', pt: 'Defesa Infant.', it: 'Difesa Fanter.', tr: 'Piyade Savunma', zh: '步兵防御', ja: '歩兵防御', ko: '보병 방어' } },
  'close-combat':       { n: { he: 'התקפת חי״ר', ru: 'Атака пехоты', de: 'Inf-Angriff', es: 'Ataque Infant.', fr: 'Att. Infant.', pt: 'Ataque Infant.', it: 'Att. Fanter.', tr: 'Piyade Sald.', zh: '步兵攻击', ja: '歩兵攻撃', ko: '보병 공격' },
                           e: { he: 'התקפת חי״ר', ru: 'Атака пехоты', de: 'Inf-Angriff', es: 'Ataque Infant.', fr: 'Attaque Infant.', pt: 'Ataque Infant.', it: 'Attacco Fanter.', tr: 'Piyade Saldırı', zh: '步兵攻击', ja: '歩兵攻撃', ko: '보병 공격' } },

  // === BATTLE — Archer ===
  'targeted-sniping':   { n: { he: 'צליפה', ru: 'Снайпинг', de: 'Scharfschuss', es: 'Francotirador', fr: 'Tireur élite', pt: 'Atirador', it: 'Tiro scelto', tr: 'Keskin Niş.', zh: '狙击', ja: '狙撃', ko: '저격' },
                           e: { he: 'קטלניות קשתים', ru: 'Уроп. лучн.', de: 'Bogen-Letal.', es: 'Letal. Arquero', fr: 'Létalité Arch.', pt: 'Letal. Arqueir.', it: 'Letal. Arcier.', tr: 'Okçu Ölüm.', zh: '弓兵致命', ja: '弓兵致死率', ko: '궁수 치명' } },
  'precision-targeting': { n: { he: 'דיוק', ru: 'Точность', de: 'Präzision', es: 'Precisión', fr: 'Précision', pt: 'Precisão', it: 'Precisione', tr: 'Hassasiyet', zh: '精准', ja: '精密', ko: '정밀' },
                           e: { he: 'התקפת קשתים', ru: 'Атака лучников', de: 'Bogen-Angriff', es: 'Ataque Arquero', fr: 'Attaque Arch.', pt: 'Ataque Arqueir.', it: 'Att. Arcieri', tr: 'Okçu Sald.', zh: '弓兵攻击', ja: '弓兵攻撃', ko: '궁수 공격' } },
  'picket-lines':       { n: { he: 'חוליה', ru: 'Пикеты', de: 'Posten', es: 'Piquete', fr: 'Sentinelle', pt: 'Piquete', it: 'Picchetto', tr: 'Nöbet', zh: '哨兵', ja: '前哨', ko: '초소' },
                           e: { he: 'הגנת קשתים', ru: 'Защита лучн.', de: 'Bogen-Verteid.', es: 'Def. Arquero', fr: 'Déf. Archer', pt: 'Def. Arqueir.', it: 'Dif. Arcieri', tr: 'Okçu Sav.', zh: '弓兵防御', ja: '弓兵防御', ko: '궁수 방어' } },
  'leathercraft':       { n: { he: 'עור', ru: 'Кожа', de: 'Leder', es: 'Cuero', fr: 'Cuir', pt: 'Couro', it: 'Cuoio', tr: 'Deri', zh: '皮革', ja: '革', ko: '가죽' },
                           e: { he: 'בריאות קשתים', ru: 'Здор. лучн.', de: 'Bogen-LP', es: 'Salud Arquero', fr: 'Santé Archer', pt: 'Vida Arqueir.', it: 'Salute Arcier.', tr: 'Okçu Canı', zh: '弓兵生命', ja: '弓兵HP', ko: '궁수 체력' } },

  // === BATTLE — Cavalry ===
  'lance-upgrade':      { n: { he: 'רומח', ru: 'Копьё', de: 'Lanze', es: 'Lanza', fr: 'Lance', pt: 'Lança', it: 'Lancia', tr: 'Mızrak', zh: '长枪', ja: '槍', ko: '창' },
                           e: { he: 'קטלניות פרשים', ru: 'Уроп. кавал.', de: 'Kavall.-Letal.', es: 'Letal. Caball.', fr: 'Létalité Cav.', pt: 'Letal. Cavalar.', it: 'Letal. Cavall.', tr: 'Süvari Ölüm.', zh: '骑兵致命', ja: '騎兵致死率', ko: '기병 치명' } },
  'cavalry-charge':     { n: { he: 'הסתערות פרשים', ru: 'Атака кавал.', de: 'Kavall.-Sturm', es: 'Carga Caball.', fr: 'Charge Cav.', pt: 'Carga Cavalar.', it: 'Carica Cavall.', tr: 'Süvari Hücum', zh: '骑兵冲锋', ja: '騎兵突撃', ko: '기병 돌진' },
                           e: { he: 'התקפת פרשים', ru: 'Атака кавал.', de: 'Kavall.-Angriff', es: 'Ataque Caball.', fr: 'Attaque Cav.', pt: 'Ataque Cavalar.', it: 'Att. Cavalleria', tr: 'Süvari Sald.', zh: '骑兵攻击', ja: '騎兵攻撃', ko: '기병 공격' } },
  'bulwark-formations': { n: { he: 'מגן בצורה', ru: 'Бастион', de: 'Bollwerk', es: 'Bastión', fr: 'Rempart', pt: 'Baluarte', it: 'Baluardo', tr: 'Burç', zh: '堡垒', ja: '防壁', ko: '성벽' },
                           e: { he: 'הגנת פרשים', ru: 'Защита кавал.', de: 'Kavall.-Verteid.', es: 'Def. Caball.', fr: 'Déf. Cavalerie', pt: 'Def. Cavalar.', it: 'Dif. Cavall.', tr: 'Süvari Sav.', zh: '骑兵防御', ja: '騎兵防御', ko: '기병 방어' } },
  'fortified-mail':     { n: { he: 'שריון מבוצר', ru: 'Кольчуга', de: 'Verstärkte Rüst.', es: 'Cota refor.', fr: 'Maille renf.', pt: 'Cota refor.', it: 'Cotta rinf.', tr: 'Zırh Takviye', zh: '加固锁甲', ja: '強化鎧', ko: '강화 갑옷' },
                           e: { he: 'בריאות פרשים', ru: 'Здор. кавал.', de: 'Kavall.-LP', es: 'Salud Caball.', fr: 'Santé Cavalerie', pt: 'Vida Cavalar.', it: 'Salute Cavall.', tr: 'Süvari Canı', zh: '骑兵生命', ja: '騎兵HP', ko: '기병 체력' } },
};

// Helpers — return translated short name / effect, or fall back to English source value
function nameOf(family, lang) {
  const entry = TECH_I18N[family.id];
  if (entry && entry.n && entry.n[lang]) return entry.n[lang];
  return family.name;
}
function effectOf(family, lang) {
  const entry = TECH_I18N[family.id];
  if (entry && entry.e && entry.e[lang]) return entry.e[lang];
  return family.effect;
}

// ============================================================
// WHY THIS — explanations for each tech (English + Hebrew)
// Falls back to English for other languages.
// ============================================================
const TECH_WHY = {
  // Growth tree
  'tool-enhancement': {
    en: 'Top priority for ALL profiles. Speed bonuses compound — every research below unlocks faster because you did this first.',
    he: 'עדיפות עליונה לכל הפרופילים. בונוסי מהירות מצטברים — כל מחקר הבא ייפתח מהר יותר בגלל שעשית את זה קודם.',
  },
  'tooling-up': {
    en: 'Foundational. Faster construction means buildings level up faster, which unlocks new research tiers sooner.',
    he: 'בסיסי. בנייה מהירה יותר = מבנים מתעדכנים מהר יותר = פותח tiers חדשים של מחקר.',
  },
  'command-tactics': {
    en: 'Unlocks additional march queues. More queues = more parallel gathering, more troop training, better event output. Useful from day 1.',
    he: 'פותח תורי מצעד נוספים. יותר תורים = איסוף משאבים במקביל, אימון חיילים, ציון אירועים טוב יותר. שימושי מהיום הראשון.',
  },
  'ward-expansion': {
    en: 'Bigger infirmary = more troops survive after battles instead of being permanently lost. Critical insurance for active PvP.',
    he: 'מרפאה גדולה יותר = יותר חיילים שורדים אחרי קרבות במקום להיאבד לצמיתות. ביטוח חיוני ל-PvP פעיל.',
  },
  'bandaging': {
    en: 'Faster healing — critical for batch healing in Castle Battle and similar events. Without it, troops sit injured for too long.',
    he: 'ריפוי מהיר יותר — קריטי לריפוי באצווה ב-Castle Battle ובאירועים דומים. בלעדיו, החיילים יושבים פצועים זמן רב מדי.',
  },
  'trainer-tools': {
    en: 'Faster troop training. Especially valuable when training high-tier troops or rebuilding after big battles.',
    he: 'אימון חיילים מהיר יותר. מועיל במיוחד כשמאמנים T11 או בונים מחדש אחרי קרבות גדולים.',
  },
  'camp-expansion': {
    en: 'First couple tiers help. Past Tier II, the weeks of research time aren\'t worth the marginal batch-size gain.',
    he: 'שני ה-Tiers הראשונים מועילים. אחרי Tier II, השבועות של זמן מחקר לא שווים את הרווח השולי בגודל אצווה.',
  },
  // Economy tree — gathering
  'food-foraging': {
    en: 'Gathering scales with the game. Once you reach mid-game, gathering produces more resources than building output ever could.',
    he: 'איסוף משאבים מתרחב עם המשחק. בשלב הביניים, איסוף מייצר יותר משאבים ממה שמבנים יכולים לייצר.',
  },
  'wood-gathering': {
    en: 'Wood is needed for buildings, troops, and most research. Faster gathering = more output across the board.',
    he: 'עץ נחוץ לבניינים, חיילים ורוב המחקר. איסוף מהיר יותר = יותר תפוקה בכל התחומים.',
  },
  'stone-mining': {
    en: 'Stone is consumed by mid-tier buildings and Battle research. Gathering speed compounds over months.',
    he: 'אבן נצרכת על-ידי בניינים ומחקר Battle בדרגות בינוניות. מהירות איסוף מצטברת לאורך חודשים.',
  },
  'iron-mining': {
    en: 'Iron is the bottleneck resource for high-tier troops and Battle research. Gather rate matters more than building output.',
    he: 'ברזל הוא משאב צוואר הבקבוק לחיילים גבוהים ומחקר Battle. שיעור איסוף חשוב יותר מתפוקת מבנים.',
  },
  // Economy tree — output (skip)
  'bread-output': {
    en: '⚠️ SKIP. Mill output is capped at a level too low to keep up with consumption. Gathering scales infinitely; output doesn\'t.',
    he: '⚠️ דלג. תפוקת המטחנה מוגבלת ברמה נמוכה מדי כדי לעמוד בקצב הצריכה. איסוף מתרחב ללא הגבלה; תפוקה לא.',
  },
  'wood-output': {
    en: '⚠️ SKIP. Sawmill output ceiling is reached early. Time spent here is better invested in gathering speed.',
    he: '⚠️ דלג. תקרת תפוקת המנסרה מגיעה מוקדם. הזמן כאן מושקע טוב יותר במהירות איסוף.',
  },
  'stone-output': {
    en: '⚠️ SKIP. Quarry production caps out — same trap as Mill/Sawmill. Gathering is the path forward.',
    he: '⚠️ דלג. ייצור המחצבה מגיע לתקרה — אותה מלכודת כמו Mill/Sawmill. איסוף הוא הדרך קדימה.',
  },
  'iron-output': {
    en: '⚠️ SKIP. Iron mine output is capped low — useless once gathering scales up. Don\'t waste research time here.',
    he: '⚠️ דלג. תפוקת מכרה הברזל מוגבלת נמוך — חסרת שימוש כשאיסוף מתרחב. אל תבזבז זמן מחקר.',
  },
  // Battle tree
  'survival-techniques': {
    en: 'Universal HEALTH for ALL troop types — Infantry, Archer, AND Cavalry. Broadest return per level in the entire Battle tree.',
    he: 'בריאות אוניברסלית לכל סוגי החיילים — Infantry, Archer וגם Cavalry. החזר הרחב ביותר לרמה בכל עץ Battle.',
  },
  'assault-techniques': {
    en: 'Universal LETHALITY for ALL troops. Pairs with Survival Techniques as the fastest-compounding nodes for any composition.',
    he: 'קטלניות אוניברסלית לכל החיילים. משלים את Survival Techniques כצמתים המצטברים המהירים ביותר לכל הרכב.',
  },
  'regimental-expansion': {
    en: 'Increases march troop capacity for both rallies AND gathering. Pure utility — every account benefits regardless of style.',
    he: 'מגדיל קיבולת מצעד עבור rallies וגם איסוף. שירות טהור — כל חשבון נהנה ללא קשר לסגנון.',
  },
  'weapons-prep': {
    en: 'Universal ATTACK boost. Useful but Lethality (Assault Techniques) outperforms it as a damage multiplier.',
    he: 'בונוס תקיפה אוניברסלי. שימושי אבל קטלניות (Assault Techniques) מתעלה עליו כמכפיל נזק.',
  },
  'reprisal-tactics': {
    en: '⚠️ MANDATORY GATE. Required prerequisite for Special Defensive Training, which itself gates Survival Techniques V+VI and Assault Techniques V+VI. Health > Defense for raw survivability per point, but if you skip Reprisal you cannot unlock the high-tier universal stats. Work it alongside Health, not after.',
    he: '⚠️ שער חובה. תנאי מקדים נדרש ל-Special Defensive Training, שבעצמו חוסם את Survival Techniques V+VI ו-Assault Techniques V+VI. בריאות > הגנה לשרידות לכל נקודה, אבל אם תדלג על Reprisal לא תוכל לפתוח את הסטטיסטיקות האוניברסליות בtier הגבוה. עבוד עליו במקביל לבריאות, לא אחרי.',
  },
  'special-defensive-training': {
    en: '⚠️ CRITICAL GATE. This is NOT a low-priority stat tech — it is the prerequisite that unlocks Survival Techniques V+VI (All Troops Health) AND Assault Techniques V+VI (All Troops Lethality), the two single most valuable Battle techs in the entire game. If you skip this, you literally cannot research the highest-impact upgrades. Push tier-by-tier in parallel with the universal stats — never leave it behind.',
    he: '⚠️ שער קריטי. זה לא טכנולוגיה בעדיפות נמוכה — זה התנאי המקדים שפותח את Survival Techniques V+VI (בריאות כל החיילים) ואת Assault Techniques V+VI (קטלניות כל החיילים), שתי הטכנולוגיות הכי חשובות בעץ הקרב. אם תדלג על זה — אתה פשוט לא יכול לחקור את השדרוגים החשובים ביותר. עבוד tier-by-tier במקביל לסטטיסטיקות האוניברסליות — לעולם אל תשאיר מאחור.',
  },
  'shield-upgrade': {
    en: 'Infantry HEALTH. Infantry exists to absorb damage — Health is its single most important stat. Top class-specific priority.',
    he: 'בריאות Infantry. תפקיד ה-Infantry לספוג נזק — בריאות היא הסטטיסטיקה החשובה ביותר שלו. עדיפות מובילה ספציפית לכיתה.',
  },
  'defensive-formations': {
    en: 'Infantry DEFENSE. Secondary to Health for tanks but adds to durability. Not bad — just behind Lethality and Health.',
    he: 'הגנת Infantry. משני לבריאות עבור tanks אבל מוסיף לעמידות. לא רע — רק מאחורי קטלניות ובריאות.',
  },
  'close-combat': {
    en: 'Infantry ATTACK. Infantry isn\'t your damage class — Health and Defense matter more for the tank role.',
    he: 'תקיפת Infantry. ה-Infantry שלך לא כיתת הנזק — בריאות והגנה חשובות יותר לתפקיד ה-tank.',
  },
  'targeted-sniping': {
    en: 'Archer LETHALITY. Lethality is the strongest damage multiplier in the game. Archers benefit most from stacking it.',
    he: 'קטלניות Archer. קטלניות היא מכפיל הנזק החזק ביותר במשחק. ה-Archers נהנים הכי הרבה מהצטברותה.',
  },
  'precision-targeting': {
    en: 'Archer ATTACK. Boosts archer damage but Lethality (Targeted Sniping) wins as a multiplier. Do this AFTER Targeted Sniping.',
    he: 'תקיפת Archer. מגביר נזק archer אבל קטלניות (Targeted Sniping) מנצחת כמכפיל. עשה את זה אחרי Targeted Sniping.',
  },
  'picket-lines': {
    en: 'Archer DEFENSE. Archers shouldn\'t be tanking damage in the first place — they should be killing things. Lower priority.',
    he: 'הגנת Archer. הקשתים לא אמורים לספוג נזק מלכתחילה — הם אמורים להרוג. עדיפות נמוכה יותר.',
  },
  'leathercraft': {
    en: 'Archer HEALTH. Useful insurance, but Lethality (Targeted Sniping) returns more damage per research day for archer-heavy comps.',
    he: 'בריאות Archer. ביטוח שימושי, אבל קטלניות (Targeted Sniping) מחזירה יותר נזק ליום מחקר עבור הרכבים מבוססי archer.',
  },
  'lance-upgrade': {
    en: 'Cavalry LETHALITY. Cavalry deals damage best with Lethality. Pair with Targeted Sniping for offensive output.',
    he: 'קטלניות Cavalry. ה-Cavalry פוגע הכי טוב עם קטלניות. שלב עם Targeted Sniping לתפוקה התקפית.',
  },
  'cavalry-charge': {
    en: 'Cavalry ATTACK. Lowest priority among combat stats — Lethality and class-specific Health/Defense beat it consistently.',
    he: 'תקיפת Cavalry. העדיפות הנמוכה ביותר בין סטטיסטיקות קרב — קטלניות ובריאות/הגנה ספציפיות לכיתה מנצחות בעקביות.',
  },
  'bulwark-formations': {
    en: 'Cavalry DEFENSE. Lower priority than Cavalry\'s Lethality and damage. Pick this up after the offensive nodes.',
    he: 'הגנת Cavalry. עדיפות נמוכה יותר מקטלניות ונזק של Cavalry. אסוף את זה אחרי הצמתים ההתקפיים.',
  },
  'fortified-mail': {
    en: 'Cavalry HEALTH. Useful but Cavalry shines on offense — Lance Upgrade (Lethality) returns more damage per research point.',
    he: 'בריאות Cavalry. שימושי אבל ה-Cavalry זוהר בהתקפה — Lance Upgrade (קטלניות) מחזיר יותר נזק לנקודת מחקר.',
  },
};

function whyOf(family, lang) {
  const entry = TECH_WHY[family.id];
  if (!entry) return null;
  return entry[lang] || entry.en;
}

// ============================================================
// DATA
// ============================================================
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// ============================================================
// RECRUITMENT — replace these placeholders with your actual values
// ============================================================
const RECRUIT = {
  kingdom: '#1494',
  discord: 'https://discord.gg/PbFh9jV4z',
  inGameContact: 'R5 Mridanc2',
  // Up to 4 selling points — what makes your kingdom worth joining
  sellingPoints: {
    en: [
      'Active alliance — daily rallies and events',
      'Top-3 finishes in KvK',
      'No drama, no stealing — fair play culture',
      'Welcoming to all power levels',
    ],
    he: [
      'בריתות פעילות — rallies ואירועים יומיים',
      'סיומות טופ-3 ב-KvK',
      'בלי דרמה, בלי גניבות — תרבות הוגנת',
      'מקבלים את כולם, בכל רמת כוח',
    ],
  },
};
// Tier definitions — verified against kingshot.net official data
// BATTLE: 102 techs, 459 total levels — levels grow with tier (3, 3, 4, 5, 6, 6 for stat techs)
const BATTLE_LO = { levels: [3, 3, 4, 5, 6, 6], bonuses: ['+1.50%', '+2.50%', '+4.50%', '+10.00%', '+13.50%', '+15.25%'] };
const BATTLE_HI = { levels: [3, 3, 4, 5, 6, 6], bonuses: ['+4.00%', '+5.50%', '+11.50%', '+22.50%', '+31.75%', '+36.50%'] };
const BATTLE_NUM = { levels: [3, 3, 4, 5, 6, 6], bonuses: ['+1000', '+1400', '+2800', '+5600', '+8000', '+13400'] };
// GROWTH: 45 techs — all tiers are 3 levels per kingshot.net
const GROWTH = { levels: [3, 3, 3, 3, 3, 3, 3], bonuses: ['', '', '', '', '', '', ''] };
// ECONOMY: 44 techs — all tiers are 3 levels per kingshot.net (gathering AND output)
const ECON6 = { levels: [3, 3, 3, 3, 3, 3], bonuses: ['', '', '', '', '', ''] };
const ECON5 = { levels: [3, 3, 3, 3, 3], bonuses: ['', '', '', '', ''] };
// Output techs (Mill/Sawmill/Quarry/Mine) — same 3-per-tier as gathering
const ECON_OUT6 = { levels: [3, 3, 3, 3, 3, 3], bonuses: ['', '', '', '', '', ''] };
const ECON_OUT5 = { levels: [3, 3, 3, 3, 3], bonuses: ['', '', '', '', ''] };
const CMD = { levels: [1, 1, 1], bonuses: ['+1', '+1', '+1'] };

function fam(id, name, pattern, meta) {
  return {
    id, name,
    tiers: pattern.levels.map((max, i) => ({
      id: `${id}-${i}`, idx: i, roman: ROMAN[i], max,
      bonus: pattern.bonuses[i] || '',
    })),
    ...meta,
  };
}

const TREES = {
  growth: {
    name: 'Growth', tabIcon: Hammer,
    families: [
      fam('tool-enhancement', 'Tool Enhancement', GROWTH, {
        effect: 'Research Speed', icon: BookOpen, priority: 'TOP',
        tip: '⚡ Top priority for ALL profiles. Speed bonuses compound — every battle tech below unlocks faster because you did this first.',
      }),
      fam('tooling-up', 'Tooling Up', GROWTH, {
        effect: 'Construction Speed', icon: Hammer, priority: 'HIGH',
        tip: '🏗️ Stop chasing once your buildings are all maxed. Tiers VI-VII deliver near-zero return after that point.',
      }),
      fam('command-tactics', 'Command Tactics', CMD, {
        effect: 'March Queues', icon: Flag, priority: 'HIGH',
        tip: '🚀 Caps at TC18. +3 queues = parallel gathering, intel, AND combat.',
      }),
      fam('ward-expansion', 'Ward Expansion', GROWTH, {
        effect: 'Infirmary Capacity', icon: Heart, priority: 'MED',
      }),
      fam('bandaging', 'Bandaging', GROWTH, {
        effect: 'Healing Speed', icon: Heart, priority: 'MED',
      }),
      fam('trainer-tools', 'Trainer Tools', GROWTH, {
        effect: 'Training Speed', icon: Target, priority: 'MED',
      }),
      fam('camp-expansion', 'Camp Expansion', GROWTH, {
        effect: 'Training Capacity', icon: Users, priority: 'TRAP', tag: 'SKIP',
        tip: '⚠️ Tier I-II OK to unlock prerequisites. Tier III+ wastes weeks of research time. Active players just queue another batch when one finishes.',
      }),
    ],
    maxTier: 7,
  },
  economy: {
    name: 'Economy', tabIcon: TreePine,
    families: [
      fam('food-foraging', 'Food Foraging', ECON6, { effect: 'Bread Gathering', icon: Heart, priority: 'HIGH', tip: '🌾 Push gathering speeds together for compound resource flow.' }),
      fam('wood-gathering', 'Wood Gathering', ECON6, { effect: 'Wood Gathering', icon: TreePine, priority: 'HIGH' }),
      fam('stone-mining', 'Stone Mining', ECON5, { effect: 'Stone Gathering', icon: Mountain, priority: 'HIGH' }),
      fam('iron-mining', 'Iron Mining', ECON5, { effect: 'Iron Gathering', icon: Hammer, priority: 'HIGH' }),
      fam('bread-output', 'Bread Output', ECON_OUT6, { effect: 'Mill Production', icon: Heart, priority: 'TRAP', tag: 'SKIP', tip: '⚠️ Building output is too low to matter. Events and gathering give 10× more. SKIP entirely.' }),
      fam('wood-output', 'Wood Output', ECON_OUT6, { effect: 'Sawmill Production', icon: TreePine, priority: 'TRAP', tag: 'SKIP', tip: '⚠️ SKIP — building output is capped too low.' }),
      fam('stone-output', 'Stone Output', ECON_OUT5, { effect: 'Quarry Production', icon: Mountain, priority: 'TRAP', tag: 'SKIP', tip: '⚠️ SKIP — building output is capped too low.' }),
      fam('iron-output', 'Iron Output', ECON_OUT5, { effect: 'Mine Production', icon: Hammer, priority: 'TRAP', tag: 'SKIP', tip: '⚠️ SKIP — building output is capped too low.' }),
    ],
    maxTier: 6,
  },
  battle: {
    name: 'Battle', tabIcon: Sword,
    families: [
      // Universal — TOP
      fam('survival-techniques', 'Survival Techniques', BATTLE_LO, {
        effect: 'All Troops Health', icon: Heart, priority: 'TOP',
        tip: '❤️ Boosts health for EVERY troop type — Infantry, Archers, AND Cavalry. The single highest-value Battle tech alongside Assault. F2P+Mid: hold for Research events to earn millions of points.',
      }),
      fam('assault-techniques', 'Assault Techniques', BATTLE_LO, {
        effect: 'All Troops Lethality', icon: Zap, priority: 'TOP',
        tip: '⚡ Boosts lethality for EVERY troop type. Pair with Survival as your Battle Tree entry.',
      }),
      // Universal — HIGH
      fam('regimental-expansion', 'Regimental Expansion', BATTLE_NUM, {
        effect: 'Rally Capacity', icon: Users, priority: 'HIGH',
        tip: '👥 More troops in your rally = bigger damage hits. Worth more for rally leaders than joiners.',
      }),
      // Universal — Attack/Defense (lower stat priority but Defense techs are gates to V/VI tiers)
      fam('weapons-prep', 'Weapons Prep', BATTLE_LO, { effect: 'All Troops Attack', icon: Sword, priority: 'LOW', tip: '⚔️ Lethality > Attack. Only push after Lethality stats are maxed.' }),
      fam('reprisal-tactics', 'Reprisal Tactics', BATTLE_HI, {
        effect: 'All Troops Defense', icon: Shield, priority: 'MED',
        tip: '🛡️ Required prerequisite for Special Defensive Training, which gates Survival/Assault V+VI. Don\'t skip — work it alongside Defense.',
      }),
      fam('special-defensive-training', 'Special Defensive Training', BATTLE_LO, {
        effect: 'Defense Bonus', icon: Shield, priority: 'MED',
        tip: '⚠️ MANDATORY GATE. Survival Techniques V+VI and Assault Techniques V+VI require this. Without it your top-priority All-Troops Health/Lethality is locked out at high tiers. Push it tier by tier alongside the universal stats.',
      }),
      // Infantry
      fam('shield-upgrade', 'Shield Upgrade', BATTLE_HI, {
        effect: 'Infantry Health', icon: Shield, troop: 'infantry', priority: 'HIGH',
        tip: '🛡️ Infantry tank the front line. Health > Defense. Pairs with Targeted Sniping in priority.',
      }),
      fam('defensive-formations', 'Defensive Formations', BATTLE_HI, { effect: 'Infantry Defense', icon: Shield, troop: 'infantry', priority: 'MED' }),
      fam('close-combat', 'Close Combat', BATTLE_HI, { effect: 'Infantry Attack', icon: Sword, troop: 'infantry', priority: 'LOW', tip: 'Lowest priority infantry stat — they exist to tank, not damage.' }),
      // Archer
      fam('targeted-sniping', 'Targeted Sniping', BATTLE_HI, {
        effect: 'Archer Lethality', icon: Target, troop: 'archer', priority: 'HIGH',
        tip: '🏹 Archers are pure DPS. Lethality is their entire value. Push this even if your main is Cavalry — armies are often mixed and Archer Lethality is one of the highest-value class stats.',
      }),
      fam('precision-targeting', 'Precision Targeting', BATTLE_HI, { effect: 'Archer Attack', icon: Target, troop: 'archer', priority: 'MED' }),
      fam('picket-lines', 'Picket Lines', BATTLE_HI, { effect: 'Archer Defense', icon: Shield, troop: 'archer', priority: 'LOW' }),
      fam('leathercraft', 'Leather', BATTLE_HI, { effect: 'Archer Health', icon: Heart, troop: 'archer', priority: 'LOW' }),
      // Cavalry
      fam('lance-upgrade', 'Lance Upgrade', BATTLE_HI, {
        effect: 'Cavalry Lethality', icon: Zap, troop: 'cavalry', priority: 'HIGH',
        tip: '⚡ Cavalry burst on charges. Push AFTER Archer Lethality + Infantry Health — those are higher value, even for Cavalry mains.',
      }),
      fam('cavalry-charge', 'Cavalry Charge', BATTLE_HI, { effect: 'Cavalry Attack', icon: Sword, troop: 'cavalry', priority: 'LOW', tip: 'Lowest combat priority overall — Cavalry Attack only after everything else.' }),
      fam('bulwark-formations', 'Bulwark Formations', BATTLE_HI, { effect: 'Cavalry Defense', icon: Shield, troop: 'cavalry', priority: 'LOW' }),
      fam('fortified-mail', 'Fortified Mail', BATTLE_HI, { effect: 'Cavalry Health', icon: Heart, troop: 'cavalry', priority: 'LOW' }),
    ],
    maxTier: 6,
  },
};

const TROOPS = {
  infantry: { name: 'Infantry', icon: Shield, label: 'Foot Soldier' },
  archer:   { name: 'Archer',   icon: Target, label: 'Ranged DPS' },
  cavalry:  { name: 'Cavalry',  icon: Zap, label: 'Mounted Burst' },
};

const SPEND_PROFILES = {
  f2p:   { name: 'Free', short: 'F2P', icon: Wallet, desc: 'Hold Battle for events' },
  mid:   { name: 'Mid Spender', short: 'MID', icon: Gem, desc: 'Battle slightly earlier' },
  whale: { name: 'Whale', short: 'WHALE', icon: Diamond, desc: 'Battle first, skip Economy' },
};

// ============================================================
// PRIORITY ORDER (troop-agnostic, per the meta:
// "Archer Lethality + Infantry Health are universal high priority")
// ============================================================
function priorityOrder(spendProfile) {
  const foundation = ['tool-enhancement', 'tooling-up', 'command-tactics'];
  // Battle order matches official meta consensus:
  // 1) Universal Health/Lethality 2) Rally cap 3) Class Lethality+Health
  // 4) Reprisal+Special Defensive (REQUIRED gates for V+VI tier of universal stats)
  // 5) Class Defense 6) Other Attack 7) Class Health
  const battleOrder = [
    'survival-techniques', 'assault-techniques', 'regimental-expansion',
    'targeted-sniping', 'shield-upgrade',           // Archer Lethality + Infantry Health
    'lance-upgrade',                                 // Cav Lethality
    'reprisal-tactics', 'special-defensive-training', // GATES — required for Survival/Assault V+VI
    'precision-targeting', 'defensive-formations',
    'cavalry-charge', 'weapons-prep',
    'leathercraft', 'fortified-mail',
    'picket-lines', 'bulwark-formations', 'close-combat',
  ];
  const economyGather = ['food-foraging', 'wood-gathering', 'stone-mining', 'iron-mining'];
  const growthSupport = ['ward-expansion', 'bandaging', 'trainer-tools'];

  if (spendProfile === 'whale') {
    return [...foundation, ...battleOrder, 'ward-expansion', 'bandaging', ...economyGather, 'trainer-tools'];
  }
  if (spendProfile === 'mid') {
    return [...foundation, ...economyGather, 'bandaging', 'ward-expansion', ...battleOrder, 'trainer-tools'];
  }
  return [...foundation, ...economyGather, ...growthSupport, ...battleOrder];
}

// ============================================================
// STORAGE WRAPPER — uses localStorage on real web (GitHub Pages),
// falls back to window.storage in artifact preview environment
// ============================================================
const KS = {
  async get(key, shared = false) {
    // Try localStorage first (real web)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem(shared ? `_shared_${key}` : key);
        if (v !== null) return { value: v };
      }
    } catch (e) {}
    // Fall back to artifact storage
    try {
      if (typeof window !== 'undefined' && window.storage && window.storage.get) {
        return await window.storage.get(key, shared);
      }
    } catch (e) {}
    return null;
  },
  async set(key, value, shared = false) {
    let ok = false;
    // Try localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(shared ? `_shared_${key}` : key, value);
        ok = true;
      }
    } catch (e) {}
    // Also try artifact storage (best-effort)
    try {
      if (typeof window !== 'undefined' && window.storage && window.storage.set) {
        await window.storage.set(key, value, shared);
        ok = true;
      }
    } catch (e) {}
    return ok;
  },
};

function findFamily(id) {
  for (const [tk, t] of Object.entries(TREES)) {
    const f = t.families.find(x => x.id === id);
    if (f) return { ...f, treeKey: tk, treeName: t.name };
  }
  return null;
}

// Build a queue of (family, tier) pairs in WAVE order:
// Wave A: TOP + HIGH priority families, climb tier by tier
// Wave B: MED priority families, climb tier by tier
// Wave C: LOW priority families
// SKIP is always excluded.
//
// Within each wave, we go: tier I of all wave families (in priority order),
// then tier II of all wave families, etc.
function buildFullQueue(progress, spendProfile) {
  const order = priorityOrder(spendProfile);
  const families = order.map(findFamily).filter(f => f && f.tag !== 'SKIP');

  // Group families by wave (priority class)
  const waveA = families.filter(f => f.priority === 'TOP' || f.priority === 'HIGH');
  const waveB = families.filter(f => f.priority === 'MED');
  const waveC = families.filter(f => f.priority === 'LOW');

  const queue = [];
  // Helper: add tier-by-tier sweeps for a wave
  const sweep = (waveFams) => {
    // Find max tier index across this wave
    const maxTier = Math.max(0, ...waveFams.map(f => f.tiers.length));
    for (let t = 0; t < maxTier; t++) {
      for (const f of waveFams) {
        if (!f.tiers[t]) continue;
        queue.push({ family: f, tier: f.tiers[t] });
      }
    }
  };

  sweep(waveA);
  sweep(waveB);
  sweep(waveC);

  return queue;
}

// Get the next N upcoming research items
function buildNextN(progress, spendProfile, n = 5, pinnedTierId = null, skippedTierIds = []) {
  const queue = buildFullQueue(progress, spendProfile);
  const result = [];
  const skipSet = new Set(skippedTierIds || []);

  // If a tier is pinned and it's not maxed, push it to the front
  if (pinnedTierId) {
    const pinnedItem = queue.find(it => it.tier.id === pinnedTierId);
    if (pinnedItem) {
      const cur = progress[pinnedItem.tier.id] || 0;
      if (cur < pinnedItem.tier.max) {
        result.push({ family: pinnedItem.family, tier: pinnedItem.tier, current: cur, pinned: true });
      }
    }
  }

  for (const item of queue) {
    if (result.length >= n) break;
    if (pinnedTierId && item.tier.id === pinnedTierId) continue; // already added
    if (skipSet.has(item.tier.id)) continue; // user-skipped
    const cur = progress[item.tier.id] || 0;
    if (cur < item.tier.max) {
      result.push({ family: item.family, tier: item.tier, current: cur });
    }
  }
  return result;
}

function treeStats(tree, progress) {
  let total = 0, done = 0;
  for (const f of tree.families) {
    if (f.tag === 'SKIP') continue;
    for (const t of f.tiers) {
      total += t.max;
      done += Math.min(progress[t.id] || 0, t.max);
    }
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

// Aggregate progress across ALL trees (Growth + Economy + Battle), excluding SKIP
function globalStats(progress) {
  let total = 0, done = 0;
  for (const tree of Object.values(TREES)) {
    for (const f of tree.families) {
      if (f.tag === 'SKIP') continue;
      for (const t of f.tiers) {
        total += t.max;
        done += Math.min(progress[t.id] || 0, t.max);
      }
    }
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function currentPhase(progress, spendProfile) {
  // Only consider Wave A (TOP + HIGH priority) for phase guidance
  const order = priorityOrder(spendProfile);
  for (const fid of order) {
    const f = findFamily(fid);
    if (!f || f.tag === 'SKIP') continue;
    if (f.priority !== 'TOP' && f.priority !== 'HIGH') continue;
    const allMaxed = f.tiers.every(t => (progress[t.id] || 0) >= t.max);
    if (!allMaxed) return f.treeKey;
  }
  // If Wave A all done, fall through to Wave B
  for (const fid of order) {
    const f = findFamily(fid);
    if (!f || f.tag === 'SKIP') continue;
    if (f.priority !== 'MED') continue;
    const allMaxed = f.tiers.every(t => (progress[t.id] || 0) >= t.max);
    if (!allMaxed) return f.treeKey;
  }
  return null;
}

// ============================================================
// HEX NODE (single tier of a tech)
// Now with much stronger visual hierarchy
// ============================================================
function HexNode({ family, tier, currentLevel, isNext, isPriorityNext, onTap, size = 64, dimmed = false, flashTierId, lang = 'en' }) {
  const isSkip = family.tag === 'SKIP';
  const done = currentLevel >= tier.max;
  const inProgress = currentLevel > 0 && !done;
  const isFlashing = flashTierId === tier.id;

  let bgFill = C.card, borderColor = C.faint, iconColor = C.muted;
  let strokeWidth = 2;
  let center = `${currentLevel}/${tier.max}`, kind = 'count';

  if (isSkip) {
    bgFill = C.coralBg; borderColor = C.coral; iconColor = C.coral;
    center = 'SKIP'; kind = 'badge-coral'; strokeWidth = 3;
  } else if (done) {
    bgFill = C.tealBg; borderColor = C.teal; iconColor = C.tealDark;
    center = 'MAX'; kind = 'badge-teal'; strokeWidth = 3;
  } else if (isPriorityNext) {
    // The literal NEXT step
    bgFill = C.heroBg; borderColor = C.amberDark; iconColor = C.amberDark;
    strokeWidth = 4;
  } else if (inProgress) {
    bgFill = C.amberSoft; borderColor = C.amber; iconColor = C.amber;
    strokeWidth = 3;
  }

  const Icon = family.icon || Zap;
  const opacity = dimmed ? 0.4 : 1;

  return (
    <div
      id={`hex-${tier.id}`}
      className={isFlashing ? 'flash-hex' : ''}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: size + 14, opacity,
        transition: 'opacity 0.2s ease',
        scrollMarginTop: 80, scrollMarginBottom: 80,
      }}>
      <button
        onClick={() => onTap({ family, tier, currentLevel })}
        style={{
          width: size, height: size, padding: 0,
          background: 'transparent', border: 'none',
          cursor: 'pointer', position: 'relative',
        }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <polygon
            points="50,5 91,28 91,72 50,95 9,72 9,28"
            fill={bgFill} stroke={borderColor} strokeWidth={strokeWidth}
          />
          {isPriorityNext && !done && !isSkip && (
            <polygon
              points="50,5 91,28 91,72 50,95 9,72 9,28"
              fill="none" stroke={C.amberDark} strokeWidth="2.5" opacity="0.6"
              style={{ animation: 'pulseHex 1.6s ease-in-out infinite', transformOrigin: '50px 50px' }}
            />
          )}
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
        }}>
          <Icon style={{ color: iconColor, width: size * 0.32, height: size * 0.32 }} strokeWidth={2.2} />
          {kind === 'badge-teal' || kind === 'badge-coral' ? (
            <div style={{
              marginTop: 2, padding: '1px 7px',
              fontSize: 9, fontWeight: 800, borderRadius: 999,
              background: kind === 'badge-teal' ? C.teal : C.coral,
              color: '#fff', letterSpacing: '0.05em',
            }}>{center}</div>
          ) : (
            <div style={{ marginTop: 1, fontSize: 10, fontWeight: 800, color: iconColor }}>
              {center}
            </div>
          )}
        </div>
      </button>
      <div style={{
        marginTop: 5, fontSize: size >= 80 ? 11 : 10, fontWeight: 800,
        textAlign: 'center', color: C.ink, lineHeight: 1.15, maxWidth: size + 14,
      }}>{nameOf(family, lang)}</div>
      <div style={{
        marginTop: 2, fontSize: 9, fontWeight: 600, color: C.inkSoft, lineHeight: 1.2,
        textAlign: 'center', maxWidth: size + 14,
      }}>{effectOf(family, lang)}</div>
      <div style={{
        marginTop: 1, fontSize: 9, fontWeight: 600, color: C.muted, lineHeight: 1.2,
        textAlign: 'center', maxWidth: size + 14,
      }}>
        {tier.roman}{tier.bonus ? ` · ${tier.bonus}` : ''}
      </div>
    </div>
  );
}

// ============================================================
// FOCUS MODE: shows a step-by-step list of upcoming research
// ============================================================
function FocusModeView({ nextSteps, onTap, onInc, onMax, onSetLevel, onPinToggle, onSkipToggle, skippedTiers = [], pinnedTierId, flashTierId, lang = 'en', fsScale = 1 }) {
  const [showWhyForTier, setShowWhyForTier] = useState(null);
  const [expandedSet, setExpandedSet] = useState(new Set());
  const toggleExpand = (tierId) => {
    setExpandedSet(prev => {
      const next = new Set(prev);
      if (next.has(tierId)) next.delete(tierId);
      else next.add(tierId);
      return next;
    });
  };
  if (nextSteps.length === 0) {
    return (
      <div style={{
        padding: 24, borderRadius: 16, background: C.tealBg,
        border: `2px solid ${C.teal}`, textAlign: 'center',
      }}>
        <Trophy style={{ color: C.teal, width: 36, height: 36, margin: '0 auto 8px', display: 'block' }} />
        <h3 style={{ fontSize: 16 * fsScale, fontWeight: 800, color: C.ink, margin: 0 }}>{t('strongestBuild', lang)}</h3>
        <p style={{ fontSize: 12 * fsScale, color: C.muted, margin: '4px 0 0' }}>{t('everyPriorityMaxed', lang)}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {nextSteps.map((step, idx) => {
        const Icon = step.family.icon || Zap;
        const isFirst = idx === 0;
        const isFlashing = flashTierId === step.tier.id;

        // ============ #1 CARD: hero layout with HUGE level number ============
        if (isFirst) {
          return (
            <div
              key={step.tier.id}
              className={isFlashing ? 'flash-success' : ''}
              style={{
                padding: 16, borderRadius: 16,
                background: C.heroBg,
                border: `3px solid ${C.amberDark}`,
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(200, 127, 21, 0.15)',
              }}
            >
              {/* Top: NEXT label + tech name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: C.amberSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon style={{ color: C.amberDark, width: 24, height: 24 }} strokeWidth={2.4} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                  }}>
                    <div style={{
                      fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.2em',
                      textTransform: 'uppercase', color: C.amberDark,
                    }}>{t('nextUpgrade', lang)}</div>
                    {step.pinned && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        padding: '1px 6px', borderRadius: 999,
                        background: C.amber, color: '#fff',
                        fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.08em',
                      }}>
                        <Pin style={{ width: 9, height: 9 }} strokeWidth={3} />
                        {t('pinnedBadge', lang)}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: 17 * fsScale, fontWeight: 800, color: C.ink, lineHeight: 1.2, marginTop: 1,
                  }}>
                    {nameOf(step.family, lang)} {step.tier.roman}
                  </div>
                  <div style={{ fontSize: 11 * fsScale, color: C.inkSoft, marginTop: 1, fontWeight: 600 }}>
                    {effectOf(step.family, lang)} · {t(step.family.treeKey, lang)}
                  </div>
                </div>
                {/* Why-this button */}
                {whyOf(step.family, lang) && (
                  <button
                    onClick={() => setShowWhyForTier(prev => prev === step.tier.id ? null : step.tier.id)}
                    title={t('whyThis', lang)}
                    aria-label={t('whyThis', lang)}
                    style={{
                      width: 32, height: 32, borderRadius: 16,
                      background: showWhyForTier === step.tier.id ? C.amberDark : 'transparent',
                      border: `1.5px solid ${C.amberDark}`,
                      color: showWhyForTier === step.tier.id ? '#fff' : C.amberDark,
                      cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14 * fsScale,
                    }}
                  >
                    ?
                  </button>
                )}
              </div>

              {/* Why-this explanation panel */}
              {showWhyForTier === step.tier.id && whyOf(step.family, lang) && (
                <div style={{
                  marginBottom: 12, padding: '10px 12px',
                  borderRadius: 10,
                  background: C.amberBg,
                  border: `1.5px solid ${C.amberDark}`,
                  fontSize: 12 * fsScale, color: C.ink,
                  lineHeight: 1.5,
                }}>
                  <div style={{
                    fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: C.amberDark, marginBottom: 4,
                  }}>{t('whyThis', lang)}</div>
                  {whyOf(step.family, lang)}
                </div>
              )}

              {/* HUGE level display */}
              <div style={{
                background: C.heroInner,
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 12,
                border: `1px solid ${C.amberSoft}`,
              }}>
                <div style={{
                  fontSize: 10 * fsScale, fontWeight: 800, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: C.muted, marginBottom: 6,
                  textAlign: 'center',
                }}>{t('currentLevel', lang)}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 12,
                }}>
                  <div
                    className={isFlashing ? 'number-pop' : ''}
                    style={{
                      fontSize: 56, fontWeight: 900,
                      color: C.amberDark, lineHeight: 1,
                      fontFeatureSettings: '"tnum"',
                      letterSpacing: '-0.02em',
                      display: 'inline-block',
                    }}
                  >
                    {step.current}
                  </div>
                  <div style={{
                    fontSize: 24, fontWeight: 700,
                    color: C.muted, lineHeight: 1,
                  }}>
                    / {step.tier.max}
                  </div>
                </div>
                {/* Big bar */}
                <div style={{
                  marginTop: 12, display: 'flex', gap: 4,
                }}>
                  {Array.from({ length: step.tier.max }).map((_, lvIdx) => {
                    const filled = lvIdx < step.current;
                    return (
                      <div
                        key={lvIdx}
                        style={{
                          flex: 1, height: 14, borderRadius: 4,
                          background: filled ? C.amberDark : C.barEmpty,
                          transition: 'background 0.3s ease',
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action button — full width */}
              <button
                onClick={() => onInc(step.tier.id)}
                className={isFlashing ? 'button-success' : ''}
                style={{
                  width: '100%',
                  padding: '14px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.amberDark, color: '#fff',
                  fontSize: 15 * fsScale, fontWeight: 800, letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 3px 8px rgba(200, 127, 21, 0.4)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Plus style={{ width: 18, height: 18 }} strokeWidth={3} />
                {t('iDidThis', lang)} {step.current + 1})
              </button>
            </div>
          );
        }

        // ============ Other cards (#2-#5): compact + inline expand ============
        const isExpanded = expandedSet.has(step.tier.id);
        const isPinnedHere = pinnedTierId === step.tier.id;
        return (
          <div
            key={step.tier.id}
            className={isFlashing ? 'flash-success' : ''}
            style={{
              borderRadius: 14,
              background: C.card,
              border: `2px solid ${isExpanded ? C.teal : C.border}`,
              transition: 'all 0.3s ease',
              overflow: 'hidden',
            }}
          >
            {/* Header row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 10px 10px 14px',
            }}>
              {/* Tap area expands inline */}
              <button
                onClick={() => toggleExpand(step.tier.id)}
                style={{
                  flex: 1, minWidth: 0,
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: 'pointer', color: 'inherit', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: C.bgSoft, color: C.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                }}>
                  {idx + 1}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: C.bgSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon style={{ color: C.tealDark, width: 18, height: 18 }} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: 13 * fsScale, fontWeight: 800, color: C.ink, lineHeight: 1.2,
                    }}>
                      {nameOf(step.family, lang)} {step.tier.roman}
                    </span>
                    {isPinnedHere && (
                      <Pin style={{ width: 10, height: 10, color: C.amberDark }} strokeWidth={3} />
                    )}
                  </div>
                  <div style={{ fontSize: 10 * fsScale, color: C.inkSoft, marginTop: 1, fontWeight: 600 }}>
                    {effectOf(step.family, lang)} · {step.current}/{step.tier.max}
                  </div>
                </div>
                <ChevronDown
                  style={{
                    width: 16, height: 16, color: C.muted, flexShrink: 0,
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
              {/* Quick +1 button */}
              <button
                onClick={() => onInc(step.tier.id)}
                aria-label="+1"
                style={{
                  flexShrink: 0,
                  width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: C.amber, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(244, 169, 58, 0.35)',
                }}
              >
                <Plus style={{ width: 20, height: 20 }} strokeWidth={3} />
              </button>
            </div>

            {/* Expanded content — inline */}
            {isExpanded && (
              <div style={{
                padding: '0 14px 14px',
                borderTop: `1px solid ${C.border}`,
                paddingTop: 12,
              }}>
                {/* Why explanation */}
                {whyOf(step.family, lang) && (
                  <div style={{
                    marginBottom: 10, padding: '8px 10px',
                    borderRadius: 8,
                    background: C.amberBg,
                    border: `1px solid ${C.amberDark}`,
                    fontSize: 11 * fsScale, color: C.ink,
                    lineHeight: 1.45,
                  }}>
                    <div style={{
                      fontSize: 8 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
                      textTransform: 'uppercase', color: C.amberDark, marginBottom: 3,
                    }}>{t('whyThis', lang)}</div>
                    {whyOf(step.family, lang)}
                  </div>
                )}

                {/* Level pills */}
                {onSetLevel && step.tier.max > 1 && (
                  <div style={{
                    display: 'flex', gap: 5, flexWrap: 'wrap',
                    justifyContent: 'center', marginBottom: 10,
                  }}>
                    {Array.from({ length: step.tier.max + 1 }).map((_, lv) => {
                      const isCurrentLv = lv === step.current;
                      return (
                        <button
                          key={lv}
                          onClick={() => onSetLevel(step.tier.id, lv)}
                          style={{
                            minWidth: 32, height: 28, padding: '0 7px',
                            borderRadius: 14, cursor: 'pointer',
                            border: `1.5px solid ${isCurrentLv ? C.amberDark : C.border}`,
                            background: isCurrentLv ? C.amber : 'transparent',
                            color: isCurrentLv ? '#fff' : C.inkSoft,
                            fontSize: 12 * fsScale, fontWeight: 800,
                            fontFeatureSettings: '"tnum"',
                          }}
                        >
                          {lv}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {onPinToggle && (
                    <button
                      onClick={() => onPinToggle(step.tier.id)}
                      style={{
                        flex: 1, padding: '8px 0',
                        borderRadius: 8, cursor: 'pointer',
                        border: 'none',
                        background: isPinnedHere ? C.amber : C.bgSoft,
                        color: isPinnedHere ? '#fff' : C.inkSoft,
                        fontSize: 11 * fsScale, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      }}
                    >
                      {isPinnedHere ? <PinOff style={{ width: 12, height: 12 }} strokeWidth={2.5} /> : <Pin style={{ width: 12, height: 12 }} strokeWidth={2.5} />}
                      {isPinnedHere ? t('unpin', lang) : t('pin', lang)}
                    </button>
                  )}
                  {step.current < step.tier.max && (
                    <button
                      onClick={() => onMax(step.tier.id)}
                      style={{
                        flex: 1, padding: '8px 0',
                        borderRadius: 8, cursor: 'pointer',
                        border: 'none', background: C.teal, color: '#fff',
                        fontSize: 11 * fsScale, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                      }}
                    >
                      <Check style={{ width: 12, height: 12 }} strokeWidth={3} />
                      {t('markMax', lang)}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// FULL TREE VIEW (for advanced users who want to see everything)
// ============================================================
function PriorityGroup({ title, subtitle, techs, progress, nextTierId, onTap, hexSize, accentColor, gridCols = 4, dimmed, flashTierId, lang = 'en' }) {
  if (techs.length === 0) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8,
        marginBottom: 8, padding: '0 4px',
      }}>
        <div style={{
          fontSize: 11, fontWeight: 800,
          color: accentColor, letterSpacing: '0.1em',
        }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, fontStyle: 'italic' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: '12px 4px', justifyItems: 'center',
      }}>
        {techs.map(({ family, tier }) => {
          const cur = progress[tier.id] || 0;
          return (
            <HexNode
              key={tier.id} family={family} tier={tier}
              currentLevel={cur}
              isPriorityNext={tier.id === nextTierId}
              onTap={onTap} size={hexSize} dimmed={dimmed}
              flashTierId={flashTierId}
              lang={lang}
            />
          );
        })}
      </div>
    </div>
  );
}

function TierSection({ tierIdx, techs, progress, nextTierId, onTap, onMaxAll, defaultOpen, lang = 'en', fsScale = 1, scrollSignal, flashTierId }) {
  const [open, setOpen] = useState(defaultOpen);
  const [showSkip, setShowSkip] = useState(false);

  // Note: We previously auto-collapsed sections when all maxed, but this caused
  // the screen to jump unexpectedly. User keeps the section open after MAX.
  const allMaxedNow = techs.length > 0 && techs.every(({ tier }) => (progress[tier.id] || 0) >= tier.max);

  // When parent signals to scroll to a tier, open this section if it contains it, then scroll
  useEffect(() => {
    if (!scrollSignal) return;
    const matches = techs.some(({ tier }) => tier.id === scrollSignal.tierId);
    if (!matches) return;
    setOpen(true);
    // wait one frame for the section to render its hexes, then scroll
    const timer = setTimeout(() => {
      const el = document.getElementById(`hex-${scrollSignal.tierId}`);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [scrollSignal && scrollSignal.ts]);

  if (techs.length === 0) return null;
  const maxedCount = techs.filter(({ tier }) => (progress[tier.id] || 0) >= tier.max).length;
  const allMaxed = maxedCount === techs.length;
  // Aggregate level progress (for progress bar)
  const totalLevels = techs.reduce((sum, { tier }) => sum + tier.max, 0);
  const completedLevels = techs.reduce((sum, { tier }) => sum + Math.min(progress[tier.id] || 0, tier.max), 0);
  const progressPct = totalLevels > 0 ? completedLevels / totalLevels : 0;

  // Group by priority + troop relevance
  const top = techs.filter(t => t.family.priority === 'TOP');
  const high = techs.filter(t => t.family.priority === 'HIGH');
  const med = techs.filter(t => t.family.priority === 'MED');
  const low = techs.filter(t => t.family.priority === 'LOW');
  const skip = techs.filter(t => t.family.tag === 'SKIP' || t.family.priority === 'TRAP');

  return (
    <div style={{ marginBottom: 14 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '12px 14px 0',
          borderRadius: 10,
          border: `1.5px solid ${allMaxed ? C.teal : C.border}`,
          cursor: 'pointer',
          background: allMaxed ? C.tealBg : C.bgSoft, color: C.ink,
          display: 'block',
          fontSize: 14 * fsScale, fontWeight: 800, letterSpacing: '0.05em',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {open ? <ChevronDown style={{ width: 16, height: 16, color: C.muted }} /> : <ChevronRight style={{ width: 16, height: 16, color: C.muted }} />}
            <span>{t('tier', lang)} {ROMAN[tierIdx]}</span>
            {allMaxed && <div style={{ padding: '1px 6px', borderRadius: 999, background: C.teal, color: '#fff', fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.08em' }}>{t('allMaxBadge', lang)}</div>}
          </div>
          <span style={{ fontSize: 11 * fsScale, color: C.muted, fontWeight: 700 }}>{maxedCount}/{techs.length}</span>
        </div>
        {/* Progress bar — aggregate across all techs in this tier */}
        <div style={{
          height: 4, borderRadius: 2,
          background: C.barEmpty,
          overflow: 'hidden',
          marginBottom: 10,
        }}>
          <div style={{
            height: '100%',
            width: `${progressPct * 100}%`,
            background: allMaxed ? C.teal : (progressPct > 0 ? C.amber : 'transparent'),
            transition: 'width 0.4s ease, background 0.3s ease',
            borderRadius: 2,
          }} />
        </div>
      </button>
      {open && (
        <div style={{ marginTop: 12, padding: '0 4px' }}>
          {/* Mark entire tier as done — quick bulk action for veterans */}
          {!allMaxed && onMaxAll && (
            <button
              onClick={() => {
                const tierIds = techs
                  .filter(({ tier }) => (progress[tier.id] || 0) < tier.max)
                  .map(({ tier }) => tier.id);
                if (tierIds.length > 0) onMaxAll(tierIds);
              }}
              style={{
                width: '100%', marginBottom: 14,
                padding: '10px 14px', borderRadius: 10,
                border: `1.5px dashed ${C.teal}`,
                background: C.tealBg, color: C.tealDark,
                cursor: 'pointer',
                fontSize: 12 * fsScale, fontWeight: 800, letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Check style={{ width: 14, height: 14 }} strokeWidth={3} />
              {t('markTierDone', lang)} {ROMAN[tierIdx]}
            </button>
          )}
          <PriorityGroup
            title={t('startWith', lang)}
            subtitle={t('startWithSub', lang)}
            techs={top} progress={progress} nextTierId={nextTierId}
            onTap={onTap} hexSize={88} gridCols={Math.min(top.length, 2)}
            accentColor={C.amberDark}
            flashTierId={flashTierId}
            lang={lang}
          />
          <PriorityGroup
            title={t('thenDo', lang)}
            subtitle={t('thenDoSub', lang)}
            techs={high} progress={progress} nextTierId={nextTierId}
            onTap={onTap} hexSize={72} gridCols={Math.min(Math.max(high.length, 2), 3)}
            accentColor={C.tealDark}
            flashTierId={flashTierId}
            lang={lang}
          />
          <PriorityGroup
            title={t('skipFor', lang)}
            subtitle={t('skipForSub', lang)}
            techs={med} progress={progress} nextTierId={nextTierId}
            onTap={onTap} hexSize={62} gridCols={4}
            accentColor={C.muted} dimmed
            flashTierId={flashTierId}
            lang={lang}
          />
          {(low.length > 0 || skip.length > 0) && (
            <div style={{ marginTop: 4 }}>
              <button
                onClick={() => setShowSkip(!showSkip)}
                style={{
                  width: '100%', padding: '8px 12px',
                  borderRadius: 8, border: `1px dashed ${C.border}`,
                  cursor: 'pointer', background: 'transparent',
                  color: C.muted, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.05em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {showSkip ? <ChevronDown style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
                {showSkip ? t('hide', lang) : `${t('showLowPri', lang)} (${low.length + skip.length})`}
              </button>
              {showSkip && (
                <div style={{ marginTop: 8 }}>
                  {low.length > 0 && (
                    <PriorityGroup
                      title={t('lowPriorityTitle', lang)}
                      subtitle={t('doTheseLast', lang)}
                      techs={low} progress={progress} nextTierId={nextTierId}
                      onTap={onTap} hexSize={54} gridCols={4}
                      accentColor={C.muted} dimmed
                      flashTierId={flashTierId}
                      lang={lang}
                    />
                  )}
                  {skip.length > 0 && (
                    <PriorityGroup
                      title={t('doNotResearch', lang)}
                      subtitle={t('trapTechs', lang)}
                      techs={skip} progress={progress} nextTierId={nextTierId}
                      onTap={onTap} hexSize={54} gridCols={4}
                      accentColor={C.coral}
                      flashTierId={flashTierId}
                      lang={lang}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TreeGridView({ tree, progress, nextTierId, onTap, onMaxAll, lang, fsScale, scrollSignal, flashTierId }) {
  const visibleFams = tree.families;

  return (
    <div>
      {Array.from({ length: tree.maxTier }).map((_, tIdx) => {
        const techs = visibleFams
          .filter(f => f.tiers[tIdx])
          .map(f => ({ family: f, tier: f.tiers[tIdx] }));
        if (techs.length === 0) return null;
        const allMaxed = techs.every(({ tier }) => (progress[tier.id] || 0) >= tier.max);
        const isFirstIncomplete = (() => {
          for (let i = 0; i < tIdx; i++) {
            const earlierTechs = visibleFams.filter(f => f.tiers[i] && f.tag !== 'SKIP');
            if (earlierTechs.some(f => (progress[f.tiers[i].id] || 0) < f.tiers[i].max)) {
              return false;
            }
          }
          return !allMaxed;
        })();
        return (
          <TierSection
            key={tIdx} tierIdx={tIdx} techs={techs}
            progress={progress} nextTierId={nextTierId}
            onTap={onTap} onMaxAll={onMaxAll} defaultOpen={isFirstIncomplete}
            lang={lang} fsScale={fsScale}
            scrollSignal={scrollSignal}
            flashTierId={flashTierId}
          />
        );
      })}
    </div>
  );
}

// ============================================================
// DRAWER
// ============================================================
function TierDrawer({ payload, spendProfile, onClose, onInc, onDec, onMax, onZero, onSetLevel, onPinToggle, isPinned, onSkipToggle, isSkipped, lang = 'en', fsScale = 1 }) {
  // Swipe-to-dismiss state
  const [touchStartY, setTouchStartY] = useState(null);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  if (!payload) return null;
  const { family, tier, currentLevel } = payload;
  const Icon = family.icon || Zap;
  const isSkip = family.tag === 'SKIP';
  const done = currentLevel >= tier.max;

  // Troop relevance callout
  let troopCallout = null;
  if (family.troop) {
    const troopName = TROOPS[family.troop].name;
    troopCallout = {
      kind: 'troop',
      text: t('boostsTroopOnly', lang).replace('{troop}', troopName),
    };
  } else {
    troopCallout = {
      kind: 'all',
      text: t('boostsAllTroops', lang),
    };
  }

  const showEventTip = (family.id === 'survival-techniques' || family.id === 'assault-techniques')
    && (spendProfile === 'f2p' || spendProfile === 'mid');

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(58, 46, 38, 0.32)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          // Only initiate swipe if starting from top portion (handle area)
          const rect = e.currentTarget.getBoundingClientRect();
          const fromTop = e.touches[0].clientY - rect.top;
          if (fromTop < 80) {
            setTouchStartY(e.touches[0].clientY);
            setDragging(true);
          }
        }}
        onTouchMove={(e) => {
          if (touchStartY === null) return;
          const dy = e.touches[0].clientY - touchStartY;
          if (dy > 0) setDragY(dy);
        }}
        onTouchEnd={() => {
          if (dragY > 90) {
            onClose();
          }
          setDragY(0);
          setTouchStartY(null);
          setDragging(false);
        }}
        style={{
          width: '100%', maxWidth: 480,
          maxHeight: '78vh', overflowY: dragging ? 'hidden' : 'auto',
          background: C.card, color: C.ink,
          borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20,
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform 0.25s ease-out',
          touchAction: 'pan-y',
        }}
      >
        <div style={{ width: 48, height: 4, borderRadius: 2, background: C.border, margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: isSkip ? C.coralBg : done ? C.tealBg : C.amberSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon style={{ color: isSkip ? C.coral : done ? C.tealDark : C.amberDark, width: 28, height: 28 }} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: 18 * fsScale, fontWeight: 800, color: C.ink, margin: 0, lineHeight: 1.2 }}>
              {nameOf(family, lang)} {tier.roman}
            </h3>
            <p style={{ fontSize: 12 * fsScale, color: C.inkSoft, margin: '2px 0 0', fontWeight: 600 }}>
              {effectOf(family, lang)}{tier.bonus ? ` · ${tier.bonus} per level` : ''}
            </p>
          </div>
          {/* Pin button — only shown for non-skip techs that aren't already maxed */}
          {!isSkip && !done && onPinToggle && (
            <button
              onClick={() => onPinToggle(tier.id)}
              title={isPinned ? t('unpin', lang) : t('pin', lang)}
              style={{
                width: 36, height: 36, borderRadius: 18,
                background: isPinned ? C.amber : C.bgSoft,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isPinned ? '#fff' : C.muted, flexShrink: 0,
              }}
            >
              {isPinned
                ? <PinOff style={{ width: 16, height: 16 }} strokeWidth={2.4} />
                : <Pin style={{ width: 16, height: 16 }} strokeWidth={2.4} />}
            </button>
          )}
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 18,
            background: C.bgSoft, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted,
          }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* TROOP CALLOUT */}
        {troopCallout && (
          <div style={{
            marginBottom: 12, padding: 10, borderRadius: 10,
            background: troopCallout.kind === 'all' ? C.amberBg : C.bgSoft,
            color: troopCallout.kind === 'all' ? C.ink : C.inkSoft,
            fontSize: 12 * fsScale, lineHeight: 1.45, fontWeight: 600,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            {troopCallout.kind === 'all'
              ? <Sparkles style={{ width: 14, height: 14, marginTop: 2, flexShrink: 0, color: C.amberDark }} />
              : <ArrowRight style={{ width: 14, height: 14, marginTop: 2, flexShrink: 0 }} />}
            <span>{troopCallout.text}</span>
          </div>
        )}

        {/* TIP */}
        {family.tip && (
          <div style={{
            marginBottom: 12, padding: 10, borderRadius: 10,
            background: isSkip ? C.coralBg : C.bgSoft,
            color: isSkip ? C.coral : C.inkSoft,
            fontSize: 12 * fsScale, lineHeight: 1.45,
          }}>
            {family.tip}
          </div>
        )}

        {showEventTip && (
          <div style={{
            marginBottom: 12, padding: 10, borderRadius: 10,
            background: C.tealBg, color: C.tealDark,
            fontSize: 12 * fsScale, lineHeight: 1.45, fontWeight: 600,
          }}>
            📅 <strong>{t('eventTrickLabel', lang)}</strong> {t('eventTrickBody', lang)}
          </div>
        )}

        {/* Always show level controls — even for SKIP techs in case user already did them */}
        <>
            <div style={{
              padding: 18, borderRadius: 16,
              background: done ? C.tealBg : C.bgSoft, marginBottom: 12,
            }}>
              <div style={{
                fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: C.muted, textAlign: 'center', marginBottom: 6,
              }}>{done ? t('maxedLabel', lang) : t('currentLevel', lang)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <button
                  onClick={() => onDec(tier.id)} disabled={currentLevel === 0}
                  style={{
                    width: 48, height: 48, borderRadius: 24,
                    background: C.card, border: `2px solid ${C.border}`,
                    cursor: currentLevel === 0 ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.ink, opacity: currentLevel === 0 ? 0.3 : 1,
                  }}
                >
                  <Minus style={{ width: 20, height: 20 }} strokeWidth={3} />
                </button>
                <div style={{
                  fontSize: 36, fontWeight: 800, color: done ? C.tealDark : C.ink,
                  minWidth: 96, textAlign: 'center', fontFeatureSettings: '"tnum"',
                }}>
                  {currentLevel}<span style={{ fontSize: 22, color: C.muted, fontWeight: 700 }}> / {tier.max}</span>
                </div>
                <button
                  onClick={() => onInc(tier.id)} disabled={done}
                  style={{
                    width: 48, height: 48, borderRadius: 24,
                    background: done ? C.teal : C.amber, border: 'none',
                    cursor: done ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', opacity: done ? 0.6 : 1,
                  }}
                >
                  {done ? <Check style={{ width: 20, height: 20 }} strokeWidth={3} /> : <Plus style={{ width: 20, height: 20 }} strokeWidth={3} />}
                </button>
              </div>

              {/* Level pills — jump directly to any level */}
              {onSetLevel && tier.max > 1 && (
                <div style={{
                  marginTop: 14,
                  display: 'flex', gap: 6, flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                  {Array.from({ length: tier.max + 1 }).map((_, lv) => {
                    const isCurrent = lv === currentLevel;
                    return (
                      <button
                        key={lv}
                        onClick={() => onSetLevel(tier.id, lv)}
                        style={{
                          minWidth: 36, height: 32, padding: '0 8px',
                          borderRadius: 16, cursor: 'pointer',
                          border: `1.5px solid ${isCurrent ? (done ? C.teal : C.amberDark) : C.border}`,
                          background: isCurrent ? (done ? C.teal : C.amber) : 'transparent',
                          color: isCurrent ? '#fff' : C.inkSoft,
                          fontSize: 13 * fsScale, fontWeight: 800,
                          fontFeatureSettings: '"tnum"',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {lv}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {!done && (
                <button onClick={() => onMax(tier.id)} style={{
                  flex: 1, padding: '12px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.teal, color: '#fff',
                  fontSize: 14 * fsScale, fontWeight: 800, letterSpacing: '0.03em',
                }}>{t('markMax', lang)}</button>
              )}
              {currentLevel > 0 && (
                <button onClick={() => onZero(tier.id)} style={{
                  flex: 1, padding: '12px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.bgSoft, color: C.coral,
                  fontSize: 14 * fsScale, fontWeight: 700,
                }}>{t('resetTierBtn', lang)}</button>
              )}
            </div>

            {/* Skip-for-now / Unskip — full-text button on its own row */}
            {!done && onSkipToggle && (
              <button
                onClick={() => { onSkipToggle(tier.id); onClose(); }}
                style={{
                  marginTop: 8, width: '100%', padding: '12px 0',
                  borderRadius: 12,
                  border: `1.5px solid ${isSkipped ? C.coral : C.border}`,
                  cursor: 'pointer',
                  background: isSkipped ? C.coralBg : 'transparent',
                  color: isSkipped ? C.coral : C.inkSoft,
                  fontSize: 13 * fsScale, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <EyeOff style={{ width: 15, height: 15 }} strokeWidth={2.4} />
                {isSkipped ? t('unskip', lang) : t('skipForNow', lang)}
              </button>
            )}
          </>
      </div>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function KingshotAdvisor() {
  const [view, setView] = useState('tree'); // 'focus' or 'tree'
  const [activeTree, setActiveTree] = useState('growth');
  const [mainTroop, setMainTroop] = useState('infantry');
  const [spendProfile, setSpendProfile] = useState('f2p');
  const [progress, setProgress] = useState({});
  const [drawerPayload, setDrawerPayload] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState(null);
  const [flashTierId, setFlashTierId] = useState(null);
  // Signal sent from "View" button -> TierSection so it can open + scroll
  const [scrollSignal, setScrollSignal] = useState(null);
  // New state: theme, language, font size, global counter
  const [theme, setTheme] = useState('dark'); // dark by default
  const [lang, setLang] = useState('en');
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'larger'
  const [visitorCount, setVisitorCount] = useState(null);
  // How-to-use box: dismissed by user → replaced with small "?" button
  const [howToDismissed, setHowToDismissed] = useState(false);
  // Wave Queue intro banner — same dismissable pattern
  const [waveBannerDismissed, setWaveBannerDismissed] = useState(false);
  // Pinned tier (overrides priority queue when set)
  const [pinnedTierId, setPinnedTierId] = useState(null);
  // User-skipped tiers — hidden from queue but progress still tracked
  const [skippedTiers, setSkippedTiers] = useState([]);
  // Active days streak — array of YYYY-MM-DD strings
  const [activeDays, setActiveDays] = useState([]);
  // Export/Import modal
  const [importExportMode, setImportExportMode] = useState(null); // 'export' | 'import' | null
  const [importText, setImportText] = useState('');
  const [exportCopied, setExportCopied] = useState(false);
  // Search modal
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Why-this explanation toggle (which tier id is showing its explanation)
  const [whyOpenForTier, setWhyOpenForTier] = useState(null);
  // Recruitment modal
  const [recruitOpen, setRecruitOpen] = useState(false);

  // Apply current theme to the C variable
  C = theme === 'dark' ? DARK : LIGHT;

  // Font size scaling factor
  const fsScale = fontSize === 'larger' ? 1.3 : fontSize === 'large' ? 1.15 : 1;

  // RTL detection
  const isRTL = LANGUAGES[lang].rtl;

  // Show a toast and auto-dismiss. Optional undo callback adds an "Undo" button.
  const showToast = (text, kind = 'success', undo = null) => {
    const id = Date.now() + Math.random();
    setToast({ text, kind, id, undo });
    // Toasts WITH undo last much longer so users can react to mistakes
    const duration = undo ? 9000 : 3500;
    setTimeout(() => {
      setToast(prev => (prev && prev.id === id ? null : prev));
    }, duration);
  };

  // Trigger a visual flash on a tier
  const triggerFlash = (tierId) => {
    setFlashTierId(tierId);
    setTimeout(() => {
      setFlashTierId(prev => (prev === tierId ? null : prev));
    }, 600);
  };

  // Load saved state
  useEffect(() => {
    (async () => {
      try {
        const r = await KS.get('kingshot-v9');
        if (r && r.value) {
          const s = JSON.parse(r.value);
          if (s.mainTroop) setMainTroop(s.mainTroop);
          if (s.progress) {
            // Clamp any saved levels that exceed the current max for that tier
            // (e.g. if max changed from 6 → 3 in an update)
            const clampedProgress = {};
            for (const tierId in s.progress) {
              const max = findTierMax(tierId);
              const saved = s.progress[tierId] || 0;
              clampedProgress[tierId] = max > 0 ? Math.min(saved, max) : saved;
            }
            setProgress(clampedProgress);
          }
          if (s.activeTree) setActiveTree(s.activeTree);
          if (s.spendProfile) setSpendProfile(s.spendProfile);
          if (s.view) setView(s.view);
          if (s.theme) setTheme(s.theme);
          if (s.lang) setLang(s.lang);
          if (s.fontSize) {
            // Migrate older values: 'small' or 'medium' → 'normal'
            const migrated = (s.fontSize === 'small' || s.fontSize === 'medium') ? 'normal' : s.fontSize;
            setFontSize(migrated);
          }
          if (typeof s.howToDismissed === 'boolean') setHowToDismissed(s.howToDismissed);
          if (typeof s.waveBannerDismissed === 'boolean') setWaveBannerDismissed(s.waveBannerDismissed);
          if (s.pinnedTierId) setPinnedTierId(s.pinnedTierId);
          if (Array.isArray(s.skippedTiers)) setSkippedTiers(s.skippedTiers);
          if (Array.isArray(s.activeDays)) setActiveDays(s.activeDays);
        }
      } catch (e) {}

      // Mark today as active (streak tracking)
      try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const r = await KS.get('kingshot-v9');
        let prevDays = [];
        if (r && r.value) {
          const parsed = JSON.parse(r.value);
          if (Array.isArray(parsed.activeDays)) prevDays = parsed.activeDays;
        }
        if (!prevDays.includes(today)) {
          const updated = [...prevDays, today];
          setActiveDays(updated);
        }
      } catch (e) {}

      // === REAL global visitor counter ===
      // Strategy: use window.storage shared count as the SOURCE OF TRUTH.
      // It's real, persistent across artifact users, and never blocked.
      // Then optionally try Abacus via JSONP to merge with cloud counter.
      try {
        // Has this device already been counted?
        let alreadyCounted = false;
        try {
          const ac = await KS.get('counted-here-v2');
          if (ac && ac.value) alreadyCounted = true;
        } catch (e) {}

        // Read current shared count
        let local = 0;
        try {
          const cr = await KS.get('global-visitor-count-v2', true);
          if (cr && cr.value) local = parseInt(cr.value, 10) || 0;
        } catch (e) {}

        // First time on this device → bump
        if (!alreadyCounted) {
          local = local + 1;
          try {
            await KS.set('global-visitor-count-v2', String(local), true);
            await KS.set('counted-here-v2', '1');
          } catch (e) {}
        }

        // Always show at least 1 (this device counts)
        let count = local > 0 ? local : 1;

        // Show what we have RIGHT NOW so the counter doesn't stay hidden
        setVisitorCount(count);

        // Best-effort: try Abacus via JSONP, and if it gives a higher number,
        // use it (keeps counters in sync across deploys / sandboxes).
        try {
          const NAMESPACE = 'xxx-commanders';
          const KEY = 'visitors';
          const endpoint = alreadyCounted ? 'get' : 'hit';

          const jsonp = (url, timeoutMs = 4000) => new Promise((resolve, reject) => {
            const cbName = `__abc_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
            const script = document.createElement('script');
            let settled = false;
            const cleanup = () => {
              try { delete window[cbName]; } catch (_) { window[cbName] = undefined; }
              if (script.parentNode) script.parentNode.removeChild(script);
            };
            window[cbName] = (data) => {
              if (settled) return;
              settled = true; cleanup(); resolve(data);
            };
            script.onerror = () => {
              if (settled) return;
              settled = true; cleanup(); reject(new Error('script error'));
            };
            script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${cbName}`;
            document.head.appendChild(script);
            setTimeout(() => {
              if (settled) return;
              settled = true; cleanup(); reject(new Error('timeout'));
            }, timeoutMs);
          });

          const data = await jsonp(`https://abacus.jasoncameron.dev/${endpoint}/${NAMESPACE}/${KEY}`);
          const v = (typeof data.value === 'number') ? data.value : parseInt(data.value, 10);
          if (Number.isFinite(v) && v > count) {
            setVisitorCount(v);
          }
        } catch (e) {
          // Abacus blocked / down — local count is fine
        }
      } catch (e) {
        // Last-resort: at least show 1 instead of hiding the counter
        setVisitorCount(1);
      }

      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    (async () => {
      try {
        await KS.set('kingshot-v9', JSON.stringify({
          mainTroop, progress, activeTree, spendProfile, view,
          theme, lang, fontSize, howToDismissed,
          waveBannerDismissed, pinnedTierId, skippedTiers, activeDays,
        }));
      } catch (e) {}
    })();
  }, [mainTroop, progress, activeTree, spendProfile, view, theme, lang, fontSize, howToDismissed, waveBannerDismissed, pinnedTierId, skippedTiers, activeDays, hydrated]);

  const findTierMax = (tierId) => {
    for (const t of Object.values(TREES)) {
      for (const f of t.families) {
        const tier = f.tiers.find(x => x.id === tierId);
        if (tier) return tier.max;
      }
    }
    return 0;
  };

  // Find tech name for toast
  const findTechInfo = (tierId) => {
    for (const t of Object.values(TREES)) {
      for (const f of t.families) {
        const tier = f.tiers.find(x => x.id === tierId);
        if (tier) return { family: f, tier };
      }
    }
    return null;
  };

  const inc = (tierId) => {
    const max = findTierMax(tierId);
    const cur = progress[tierId] || 0;
    if (cur >= max) {
      showToast(t('alreadyMaxed', lang), 'warn');
      return;
    }
    const newLevel = cur + 1;
    setProgress(prev => ({ ...prev, [tierId]: newLevel }));
    if (drawerPayload && drawerPayload.tier.id === tierId) {
      setDrawerPayload({ ...drawerPayload, currentLevel: newLevel });
    }
    const info = findTechInfo(tierId);
    if (info) {
      const undoFn = () => {
        setProgress(prev => ({ ...prev, [tierId]: cur }));
        setDrawerPayload(d => (d && d.tier.id === tierId ? { ...d, currentLevel: cur } : d));
      };
      if (newLevel >= info.tier.max) {
        showToast(`✓ ${nameOf(info.family, lang)} ${info.tier.roman} ${t('maxedSuffix', lang)}`, 'success', undoFn);
      } else {
        showToast(`+1 ${effectOf(info.family, lang)} (${t('nowAt', lang)} ${newLevel}/${info.tier.max})`, 'success', undoFn);
      }
    }
    triggerFlash(tierId);
  };

  const dec = (tierId) => {
    const cur = progress[tierId] || 0;
    if (cur <= 0) return;
    const newLevel = cur - 1;
    setProgress(prev => ({ ...prev, [tierId]: newLevel }));
    if (drawerPayload && drawerPayload.tier.id === tierId) {
      setDrawerPayload({ ...drawerPayload, currentLevel: newLevel });
    }
    const info = findTechInfo(tierId);
    if (info) {
      const undoFn = () => {
        setProgress(prev => ({ ...prev, [tierId]: cur }));
        setDrawerPayload(d => (d && d.tier.id === tierId ? { ...d, currentLevel: cur } : d));
      };
      showToast(`−1 ${effectOf(info.family, lang)} (${newLevel}/${info.tier.max})`, 'warn', undoFn);
    }
  };

  const setMaxTier = (tierId) => {
    const max = findTierMax(tierId);
    const cur = progress[tierId] || 0;
    if (cur >= max) {
      showToast(t('alreadyMaxed', lang), 'warn');
      return;
    }
    setProgress(prev => ({ ...prev, [tierId]: max }));
    if (drawerPayload && drawerPayload.tier.id === tierId) {
      setDrawerPayload({ ...drawerPayload, currentLevel: max });
    }
    const info = findTechInfo(tierId);
    if (info) {
      const undoFn = () => {
        setProgress(prev => ({ ...prev, [tierId]: cur }));
        setDrawerPayload(d => (d && d.tier.id === tierId ? { ...d, currentLevel: cur } : d));
      };
      showToast(`✓ ${nameOf(info.family, lang)} ${info.tier.roman} ${t('maxedSuffix', lang)}`, 'success', undoFn);
    }
    triggerFlash(tierId);
  };

  // Bulk: max out everything in a tier at once
  const maxAllInTier = (tierIds) => {
    if (!tierIds || tierIds.length === 0) return;
    // Snapshot previous values for undo
    const prevValues = {};
    tierIds.forEach(id => { prevValues[id] = progress[id] || 0; });
    // Build new progress with all maxed
    setProgress(prev => {
      const next = { ...prev };
      tierIds.forEach(id => { next[id] = findTierMax(id); });
      return next;
    });
    const undoFn = () => {
      setProgress(prev => ({ ...prev, ...prevValues }));
    };
    showToast(`✓ ${t('tierMaxed', lang)} (${tierIds.length})`, 'success', undoFn);
  };

  const zeroTier = (tierId) => {
    const cur = progress[tierId] || 0;
    if (cur === 0) return;
    setProgress(prev => ({ ...prev, [tierId]: 0 }));
    if (drawerPayload && drawerPayload.tier.id === tierId) {
      setDrawerPayload({ ...drawerPayload, currentLevel: 0 });
    }
    const undoFn = () => {
      setProgress(prev => ({ ...prev, [tierId]: cur }));
      setDrawerPayload(d => (d && d.tier.id === tierId ? { ...d, currentLevel: cur } : d));
    };
    showToast(t('tierResetMsg', lang), 'warn', undoFn);
  };

  // Jump directly to a specific level (used by level pills in drawer)
  const setLevel = (tierId, level) => {
    const cur = progress[tierId] || 0;
    const max = findTierMax(tierId);
    const newLevel = Math.max(0, Math.min(level, max));
    if (newLevel === cur) return;
    setProgress(prev => ({ ...prev, [tierId]: newLevel }));
    if (drawerPayload && drawerPayload.tier.id === tierId) {
      setDrawerPayload({ ...drawerPayload, currentLevel: newLevel });
    }
    const undoFn = () => {
      setProgress(prev => ({ ...prev, [tierId]: cur }));
      setDrawerPayload(d => (d && d.tier.id === tierId ? { ...d, currentLevel: cur } : d));
    };
    triggerFlash(tierId);
    const info = findTechInfo(tierId);
    if (info && newLevel >= info.tier.max) {
      showToast(`✓ ${nameOf(info.family, lang)} ${info.tier.roman} ${t('maxedSuffix', lang)}`, 'success', undoFn);
    } else if (info) {
      showToast(`${nameOf(info.family, lang)} ${info.tier.roman}: ${newLevel}/${info.tier.max}`, 'success', undoFn);
    }
  };
  const [confirmReset, setConfirmReset] = useState(false);
  const reset = () => {
    setConfirmReset(true);
  };
  const doReset = () => {
    const oldProgress = progress; // capture for undo
    setProgress({});
    setConfirmReset(false);
    setSettingsOpen(false);
    const undoFn = () => setProgress(oldProgress);
    showToast(t('allReset', lang), 'success', undoFn);
  };

  const nextSteps = useMemo(() => buildNextN(progress, spendProfile, 5, pinnedTierId, skippedTiers), [progress, spendProfile, pinnedTierId, skippedTiers]);
  const next = nextSteps[0] || null;
  const tree = TREES[activeTree];
  const stats = useMemo(() => treeStats(tree, progress), [tree, progress]);
  const allStats = useMemo(() => globalStats(progress), [progress]);
  const phase = useMemo(() => currentPhase(progress, spendProfile), [progress, spendProfile]);

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.ink,
      fontFamily: "'Nunito', system-ui, -apple-system, sans-serif",
      direction: isRTL ? 'rtl' : 'ltr',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        button { -webkit-tap-highlight-color: transparent; font-family: inherit; }
        button:active:not(:disabled) { transform: scale(0.97); transition: transform 0.05s; }
        @keyframes pulseHex { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.07); opacity: 0; } }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(-40px) scale(0.85); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes toastTimerShrink {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        @keyframes flashGreen {
          0% { background: #fff5d6; box-shadow: 0 0 0 0 rgba(76, 184, 92, 0); }
          25% { background: #d4f5d8; box-shadow: 0 0 0 8px rgba(76, 184, 92, 0.25); }
          100% { background: #fff5d6; box-shadow: 0 0 0 0 rgba(76, 184, 92, 0); }
        }
        .flash-success { animation: flashGreen 0.6s ease-out; }
        @keyframes buttonPress {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); background: #5cb85c !important; }
        }
        .button-success { animation: buttonPress 0.4s ease-out; }
        @keyframes numberPop {
          0% { transform: scale(1); color: #c87f15; }
          40% { transform: scale(1.35); color: #5cb85c; }
          100% { transform: scale(1); color: #c87f15; }
        }
        .number-pop { animation: numberPop 0.5s ease-out; }
        @keyframes barFill {
          0% { transform: scaleX(0.7); opacity: 0.5; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .bar-fill { animation: barFill 0.4s ease-out; transform-origin: left center; }
        @keyframes flashHex {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 rgba(76, 184, 92, 0)); transform: scale(1); }
          30% { filter: brightness(1.18) drop-shadow(0 0 10px rgba(76, 184, 92, 0.95)); transform: scale(1.08); }
        }
        .flash-hex { animation: flashHex 0.65s ease-out; }
      `}</style>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 80px' }}>

        {/* Header with custom xXx COMMANDERS logo */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14, gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
            {/* Logo mark — crossed swords with xXx */}
            <div style={{
              width: 48, height: 48, flexShrink: 0,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${C.amberDark} 0%, ${C.coral} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${theme === 'dark' ? 'rgba(244, 169, 58, 0.3)' : 'rgba(200, 127, 21, 0.3)'}`,
              position: 'relative',
            }}>
              <svg viewBox="0 0 48 48" width="48" height="48" style={{ position: 'absolute' }}>
                {/* Crossed swords */}
                <g stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.95">
                  <line x1="12" y1="12" x2="36" y2="36" />
                  <line x1="36" y1="12" x2="12" y2="36" />
                  {/* Sword tips */}
                  <circle cx="36" cy="36" r="1.5" fill="#fff" />
                  <circle cx="12" cy="36" r="1.5" fill="#fff" />
                  {/* Sword guards */}
                  <line x1="9" y1="9" x2="15" y2="15" strokeWidth="3" />
                  <line x1="39" y1="9" x2="33" y2="15" strokeWidth="3" />
                </g>
                {/* xXx letters in middle */}
                <text x="24" y="28" textAnchor="middle"
                  fontSize="11" fontWeight="900" fill="#fff"
                  fontFamily="monospace" letterSpacing="-0.5">
                  xXx
                </text>
              </svg>
            </div>
            {/* Wordmark */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 11 * fsScale, fontWeight: 800,
                letterSpacing: '0.25em', color: C.amberDark,
                lineHeight: 1, fontFamily: 'monospace',
              }}>xXx</div>
              <h1 style={{
                fontSize: 19 * fsScale, fontWeight: 900, color: C.ink,
                margin: '2px 0 0', letterSpacing: '0.04em',
                lineHeight: 1,
              }}>COMMANDERS</h1>
              <p style={{
                fontSize: 10 * fsScale, color: C.muted,
                margin: '3px 0 0', letterSpacing: '0.02em',
              }}>{t('appTagline', lang)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => { setSearchQuery(''); setSearchOpen(true); }}
              title={t('search', lang)}
              aria-label={t('search', lang)}
              style={{
                width: 40, height: 40, borderRadius: 20,
                background: C.card, border: `2px solid ${C.border}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Search style={{ color: C.muted, width: 18, height: 18 }} />
            </button>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{
                width: 40, height: 40, borderRadius: 20,
                background: C.card, border: `2px solid ${C.border}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Settings style={{ color: C.muted, width: 18, height: 18 }} />
            </button>
          </div>
        </header>

        {/* Profile pill */}
        {!settingsOpen && (
          <div style={{
            marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center',
            background: C.card, border: `2px solid ${C.border}`,
            borderRadius: 12, padding: '8px 12px',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 * fsScale, fontWeight: 700, color: C.ink }}>
              {(() => { const I = SPEND_PROFILES[spendProfile].icon; return <I style={{ width: 14, height: 14, color: C.tealDark }} strokeWidth={2.4} />; })()}
              {t(`${spendProfile}Name`, lang)} {t('player', lang)}
              <span style={{ color: C.muted, fontWeight: 500, fontSize: 11 * fsScale }}>· {t(`${spendProfile}Desc`, lang)}</span>
            </div>
            <button onClick={() => setSettingsOpen(true)} style={{
              fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.08em',
              padding: '4px 10px', borderRadius: 999, border: 'none',
              background: C.bgSoft, color: C.muted, cursor: 'pointer',
            }}>{t('change', lang)}</button>
          </div>
        )}

        {/* GLOBAL PROGRESS — across all 3 trees */}
        {!settingsOpen && allStats.total > 0 && (
          <div style={{
            marginBottom: 14, padding: '8px 12px',
            background: C.card, border: `2px solid ${C.border}`,
            borderRadius: 12,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 10 * fsScale, fontWeight: 800, letterSpacing: '0.12em',
              color: C.muted, textTransform: 'uppercase', marginBottom: 6,
            }}>
              <span>{t('overallProgress', lang)}</span>
              <span style={{
                color: allStats.pct === 100 ? C.tealDark : C.amberDark,
                letterSpacing: '0.05em',
                fontFeatureSettings: '"tnum"',
              }}>
                {allStats.done}/{allStats.total} · {allStats.pct}%
              </span>
            </div>
            <div style={{
              background: C.bgSoft, borderRadius: 999, height: 6, overflow: 'hidden',
            }}>
              <div style={{
                width: `${allStats.pct}%`, height: '100%',
                background: allStats.pct === 100 ? C.teal : C.amber,
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        )}

        {/* Settings */}
        {settingsOpen && (
          <section style={{
            marginBottom: 16, padding: 16, borderRadius: 16,
            background: C.card, border: `2px solid ${C.border}`,
            animation: 'fadeIn 0.3s ease-out',
          }}>
            {/* LANGUAGE */}
            <div style={{
              fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 8,
            }}>{t('language', lang)}</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
              marginBottom: 16,
            }}>
              {Object.entries(LANGUAGES).map(([key, info]) => {
                const active = key === lang;
                return (
                  <button
                    key={key} onClick={() => setLang(key)}
                    style={{
                      padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: active ? C.teal : C.bgSoft,
                      color: active ? '#fff' : C.ink,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      fontSize: 10 * fsScale, fontWeight: 700, lineHeight: 1.2,
                      minHeight: 50,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{info.flag}</span>
                    <span style={{ fontSize: 9 * fsScale, opacity: 0.9 }}>{info.name}</span>
                  </button>
                );
              })}
            </div>

            {/* THEME */}
            <div style={{
              fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 8,
            }}>{t('theme', lang)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setTheme('light')}
                style={{
                  padding: '12px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: theme === 'light' ? C.teal : C.bgSoft,
                  color: theme === 'light' ? '#fff' : C.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 13 * fsScale, fontWeight: 700,
                }}
              >
                ☀️ {t('light', lang)}
              </button>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  padding: '12px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: theme === 'dark' ? C.teal : C.bgSoft,
                  color: theme === 'dark' ? '#fff' : C.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontSize: 13 * fsScale, fontWeight: 700,
                }}
              >
                🌙 {t('dark', lang)}
              </button>
            </div>

            {/* TEXT SIZE */}
            <div style={{
              fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 8,
            }}>{t('textSize', lang)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { key: 'normal', label: t('normal', lang), preview: 'A', size: 14 },
                { key: 'large', label: t('large', lang), preview: 'A', size: 18 },
                { key: 'larger', label: t('larger', lang), preview: 'A', size: 22 },
              ].map(opt => {
                const active = fontSize === opt.key;
                return (
                  <button
                    key={opt.key} onClick={() => setFontSize(opt.key)}
                    style={{
                      padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: active ? C.teal : C.bgSoft,
                      color: active ? '#fff' : C.ink,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      fontSize: 11 * fsScale, fontWeight: 700,
                    }}
                  >
                    <span style={{ fontSize: opt.size, fontWeight: 800, lineHeight: 1 }}>{opt.preview}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SPEND PROFILE */}
            <div style={{
              fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 6,
            }}>{t('spendProfile', lang)}</div>
            <div style={{
              padding: 10, borderRadius: 10, marginBottom: 10,
              background: C.amberBg, color: C.ink,
              fontSize: 11 * fsScale, lineHeight: 1.5,
            }}>
              <strong>{t('whatThisChanges', lang)}</strong>
              <div style={{ marginTop: 4, color: C.inkSoft }}>
                • {t('whatChangesF2P', lang)}<br/>
                • {t('whatChangesMid', lang)}<br/>
                • {t('whatChangesWhale', lang)}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              {Object.entries(SPEND_PROFILES).map(([key, p]) => {
                const Icon = p.icon;
                const active = key === spendProfile;
                return (
                  <button
                    key={key} onClick={() => setSpendProfile(key)}
                    style={{
                      padding: '10px 4px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: active ? C.teal : C.bgSoft,
                      color: active ? '#fff' : C.ink,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      fontSize: 11 * fsScale, fontWeight: 800,
                    }}
                  >
                    <Icon style={{ width: 18, height: 18 }} strokeWidth={2.2} />
                    {p.short}
                    <span style={{ fontSize: 9 * fsScale, fontWeight: 600, opacity: 0.85, marginTop: -2 }}>{t(`${key}Desc`, lang)}</span>
                  </button>
                );
              })}
            </div>

            {/* Export / Import */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
              <button
                onClick={() => setImportExportMode('export')}
                style={{
                  padding: '10px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.bgSoft, color: C.tealDark,
                  fontSize: 13 * fsScale, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Download style={{ width: 14, height: 14 }} />
                {t('exportProgress', lang)}
              </button>
              <button
                onClick={() => { setImportText(''); setImportExportMode('import'); }}
                style={{
                  padding: '10px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.bgSoft, color: C.tealDark,
                  fontSize: 13 * fsScale, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Upload style={{ width: 14, height: 14 }} />
                {t('importProgress', lang)}
              </button>
            </div>

            {/* Skipped techs section — visible only if user has skipped any */}
            {skippedTiers.length > 0 && (
              <div style={{
                marginTop: 12, padding: 12, borderRadius: 12,
                background: C.bgSoft,
              }}>
                <div style={{
                  fontSize: 11 * fsScale, fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: C.muted, marginBottom: 8,
                }}>
                  {t('skippedSection', lang)} ({skippedTiers.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {skippedTiers.map(tid => {
                    const info = findTechInfo(tid);
                    if (!info) return null;
                    return (
                      <div key={tid} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 8,
                        background: C.card,
                        fontSize: 12 * fsScale, fontWeight: 700, color: C.ink,
                      }}>
                        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {nameOf(info.family, lang)} {info.tier.roman}
                        </span>
                        <button
                          onClick={() => {
                            setSkippedTiers(prev => prev.filter(id => id !== tid));
                            showToast(t('unskipped', lang), 'success');
                          }}
                          style={{
                            padding: '4px 10px', borderRadius: 6,
                            background: C.tealBg, color: C.tealDark,
                            border: 'none', cursor: 'pointer',
                            fontSize: 11 * fsScale, fontWeight: 800,
                          }}
                        >{t('unskip', lang)}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={reset}
              style={{
                marginTop: 8, width: '100%', padding: '10px 0',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                background: C.bgSoft, color: C.coral,
                fontSize: 13 * fsScale, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <RotateCcw style={{ width: 14, height: 14 }} />
              {t('resetProgress', lang)}
            </button>
            <button
              onClick={() => setSettingsOpen(false)}
              style={{
                marginTop: 8, width: '100%', padding: '10px 0',
                borderRadius: 12, border: 'none', cursor: 'pointer',
                background: C.tealBg, color: C.tealDark,
                fontSize: 13 * fsScale, fontWeight: 700,
              }}
            >{t('done', lang)}</button>
          </section>
        )}

        {/* VIEW TOGGLE */}
        <div style={{
          marginBottom: 14, padding: 4,
          background: C.bgSoft, borderRadius: 12,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
        }}>
          <button
            onClick={() => setView('tree')}
            style={{
              padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: view === 'tree' ? C.card : 'transparent',
              color: view === 'tree' ? C.ink : C.muted,
              fontSize: 13 * fsScale, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: view === 'tree' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <TreePine style={{ width: 14, height: 14 }} />
            {t('treeAndRec', lang)}
          </button>
          <button
            onClick={() => setView('focus')}
            style={{
              padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
              background: view === 'focus' ? C.card : 'transparent',
              color: view === 'focus' ? C.ink : C.muted,
              fontSize: 13 * fsScale, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: view === 'focus' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            {t('waveQueue', lang)}
          </button>
        </div>

        {/* === WAVE QUEUE / FOCUS VIEW === */}
        {view === 'focus' && (
          <section>
            {!waveBannerDismissed ? (
              <div style={{
                marginBottom: 12, padding: '10px 12px',
                borderRadius: 10, background: C.tealBg, color: C.tealDark,
                fontSize: 12 * fsScale, fontWeight: 600, lineHeight: 1.45,
                position: 'relative',
              }}>
                <button
                  onClick={() => setWaveBannerDismissed(true)}
                  aria-label="Dismiss"
                  style={{
                    position: 'absolute',
                    top: 6, right: 6,
                    width: 24, height: 24, borderRadius: 12,
                    border: 'none', background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.tealDark,
                  }}
                >
                  <X style={{ width: 14, height: 14 }} strokeWidth={3} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, fontWeight: 800, paddingRight: 22 }}>
                  <Sparkles style={{ width: 14, height: 14 }} />
                  {t('waveQueueTitle', lang)}
                </div>
                <div style={{ paddingRight: 4 }}>{t('waveQueueDesc', lang)}</div>
              </div>
            ) : (
              <div style={{
                marginBottom: 12, display: 'flex', justifyContent: 'flex-end',
              }}>
                <button
                  onClick={() => setWaveBannerDismissed(false)}
                  aria-label={t('waveQueueTitle', lang)}
                  title={t('waveQueueTitle', lang)}
                  style={{
                    width: 24, height: 24, borderRadius: 12,
                    border: `1.5px solid ${C.teal}`,
                    background: 'transparent', color: C.tealDark,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <Info style={{ width: 12, height: 12 }} strokeWidth={2.6} />
                </button>
              </div>
            )}
            <FocusModeView
              nextSteps={nextSteps} onTap={setDrawerPayload}
              onInc={inc} onMax={setMaxTier}
              onSetLevel={setLevel}
              onPinToggle={(tierId) => {
                setPinnedTierId(prev => (prev === tierId ? null : tierId));
                showToast(pinnedTierId === tierId ? t('unpin', lang) : t('pin', lang), 'success');
              }}
              onSkipToggle={(tierId) => {
                setSkippedTiers(prev => {
                  const isSkipped = prev.includes(tierId);
                  const next = isSkipped ? prev.filter(id => id !== tierId) : [...prev, tierId];
                  // Toast feedback with undo
                  const undoFn = () => setSkippedTiers(prev);
                  showToast(
                    isSkipped ? t('unskipped', lang) : t('skipped', lang),
                    'success',
                    undoFn
                  );
                  return next;
                });
              }}
              skippedTiers={skippedTiers}
              pinnedTierId={pinnedTierId}
              flashTierId={flashTierId}
              lang={lang} fsScale={fsScale}
            />
          </section>
        )}

        {/* === FULL TREE VIEW === */}
        {view === 'tree' && (
          <>
            {/* Phase indicator */}
            {phase && next && (
              <div style={{
                marginBottom: 14, padding: '10px 12px', borderRadius: 10,
                background: phase === activeTree ? C.tealBg : C.amberBg,
                color: phase === activeTree ? C.tealDark : C.ink,
                border: phase !== activeTree ? `1.5px dashed ${C.amber}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                fontSize: 12 * fsScale, fontWeight: 700,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                  <Sparkles style={{ width: 14, height: 14, flexShrink: 0 }} />
                  {phase === activeTree ? (
                    <span>{t('rightPlace', lang)}</span>
                  ) : (
                    <span>{t('switchToPrefix', lang)} <strong>{t(phase, lang)}</strong> — {t('switchToSuffix', lang)}</span>
                  )}
                </div>
                {phase !== activeTree && (
                  <button
                    onClick={() => setActiveTree(phase)}
                    style={{
                      padding: '4px 10px', borderRadius: 999, border: 'none', cursor: 'pointer',
                      background: C.amber, color: '#fff', fontSize: 11 * fsScale, fontWeight: 800,
                      letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }}
                  >{t('go', lang)}</button>
                )}
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {Object.entries(TREES).map(([key, tr]) => {
                const active = key === activeTree;
                const Icon = tr.tabIcon;
                const tabStats = treeStats(tr, progress);
                const tabAllMax = tabStats.pct === 100;
                return (
                  <button
                    key={key} onClick={() => setActiveTree(key)}
                    style={{
                      padding: '8px 0 9px', // tighter top, slightly more bottom for the % line
                      borderTopLeftRadius: 14, borderTopRightRadius: 14,
                      border: 'none', cursor: 'pointer',
                      background: active ? C.card : C.bgSoft,
                      color: active ? C.ink : C.muted,
                      borderTop: `3px solid ${active ? C.teal : 'transparent'}`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 1,
                      fontSize: 13 * fsScale, fontWeight: 800,
                      marginBottom: active ? -2 : 0,
                      position: 'relative', zIndex: active ? 1 : 0,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon style={{ width: 16, height: 16 }} strokeWidth={2.2} />
                      {t(key, lang)}
                    </span>
                    <span style={{
                      fontSize: 9 * fsScale, fontWeight: 700,
                      color: tabAllMax ? C.tealDark : (active ? C.amberDark : C.muted),
                      letterSpacing: '0.04em',
                      fontFeatureSettings: '"tnum"',
                    }}>{tabStats.pct}%</span>
                  </button>
                );
              })}
            </div>

            {/* Tree panel */}
            <section style={{
              background: C.card, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.teal}`,
              borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
              padding: '14px 12px',
            }}>
              {/* COMPACT NEXT UP CARD inside tree */}
              {next && (
                <div style={{
                  marginBottom: 14, padding: 12, borderRadius: 14,
                  background: C.heroBg, border: `2.5px solid ${C.amberDark}`,
                  boxShadow: '0 3px 8px rgba(200, 127, 21, 0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: C.amberSoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {(() => {
                        const NextIcon = next.family.icon || Zap;
                        return <NextIcon style={{ color: C.amberDark, width: 22, height: 22 }} strokeWidth={2.4} />;
                      })()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                      }}>
                        <div style={{
                          fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.18em',
                          textTransform: 'uppercase', color: C.amberDark,
                        }}>{t('nextUpgrade', lang)}</div>
                        {next.pinned && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            padding: '1px 6px', borderRadius: 999,
                            background: C.amber, color: '#fff',
                            fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.08em',
                          }}>
                            <Pin style={{ width: 9, height: 9 }} strokeWidth={3} />
                            {t('pinnedBadge', lang)}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontSize: 15 * fsScale, fontWeight: 800, color: C.ink, lineHeight: 1.2, marginTop: 1,
                      }}>
                        {nameOf(next.family, lang)} {next.tier.roman}
                      </div>
                      <div style={{ fontSize: 11 * fsScale, color: C.inkSoft, marginTop: 1, fontWeight: 600 }}>
                        {effectOf(next.family, lang)} · {t(next.family.treeKey, lang)} · {next.current}/{next.tier.max}
                      </div>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div style={{
                    marginTop: 10, display: 'flex', gap: 4,
                  }}>
                    {Array.from({ length: next.tier.max }).map((_, lvIdx) => {
                      const filled = lvIdx < next.current;
                      return (
                        <div
                          key={lvIdx}
                          style={{
                            flex: 1, height: 10, borderRadius: 3,
                            background: filled ? C.amberDark : C.barEmpty,
                            transition: 'background 0.3s ease',
                          }}
                        />
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button
                      onClick={() => inc(next.tier.id)}
                      style={{
                        flex: 1, padding: '11px 0',
                        borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: C.amberDark, color: '#fff',
                        fontSize: 13 * fsScale, fontWeight: 800, letterSpacing: '0.04em',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: '0 2px 6px rgba(200, 127, 21, 0.4)',
                      }}
                    >
                      <Plus style={{ width: 15, height: 15 }} strokeWidth={3} />
                      {t('iDidThis', lang)} {next.current + 1})
                    </button>
                    <button
                      onClick={() => {
                        const sameTree = next.family.treeKey === activeTree;
                        if (!sameTree) setActiveTree(next.family.treeKey);
                        // Defer signal so the new tree (if switched) renders first
                        setTimeout(() => {
                          setScrollSignal({ tierId: next.tier.id, ts: Date.now() });
                          triggerFlash(next.tier.id);
                        }, sameTree ? 0 : 80);
                      }}
                      style={{
                        padding: '11px 14px', borderRadius: 10, border: `2px solid ${C.amberDark}`,
                        cursor: 'pointer', background: 'transparent', color: C.amberDark,
                        fontSize: 12 * fsScale, fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {next.family.treeKey !== activeTree ? `${t('goTo', lang)} ${t(next.family.treeKey, lang)}` : t('view', lang)}
                    </button>
                  </div>
                </div>
              )}

              {/* CELEBRATION CARD — when there's no next priority upgrade left */}
              {!next && (
                <div style={{
                  marginBottom: 14, padding: 16, borderRadius: 14,
                  background: theme === 'dark'
                    ? `linear-gradient(135deg, ${C.tealSoft} 0%, ${C.bgSoft} 100%)`
                    : `linear-gradient(135deg, ${C.tealBg} 0%, ${C.amberBg} 100%)`,
                  border: `2.5px solid ${C.teal}`,
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(77, 193, 214, 0.18)',
                }}>
                  <Trophy style={{
                    color: C.teal, width: 40, height: 40,
                    margin: '0 auto 8px', display: 'block',
                  }} strokeWidth={2.2} />
                  <div style={{
                    fontSize: 16 * fsScale, fontWeight: 800, color: C.ink,
                    lineHeight: 1.25, marginBottom: 4,
                  }}>{t('allMaxedTitle', lang)}</div>
                  <div style={{ fontSize: 12 * fsScale, color: C.inkSoft, lineHeight: 1.4 }}>
                    {t('allMaxedSub', lang)}
                  </div>
                </div>
              )}

              {/* Strategy banner — how to read the tree (dismissable) */}
              {!howToDismissed ? (
                <div style={{
                  marginBottom: 12, padding: '10px 12px', borderRadius: 10,
                  background: C.amberBg, color: C.ink,
                  fontSize: 12 * fsScale, lineHeight: 1.5,
                  position: 'relative',
                }}>
                  <button
                    onClick={() => setHowToDismissed(true)}
                    aria-label="Dismiss"
                    style={{
                      position: 'absolute',
                      top: 6, right: 6,
                      width: 24, height: 24, borderRadius: 12,
                      border: 'none', background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: C.amberDark,
                    }}
                  >
                    <X style={{ width: 14, height: 14 }} strokeWidth={3} />
                  </button>
                  <div style={{
                    fontSize: 10 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
                    color: C.amberDark, marginBottom: 4, textTransform: 'uppercase',
                    paddingRight: 22,
                  }}>{t('howToUse', lang)}
                  </div>
                  <div style={{ paddingRight: 4 }}>{t('howToUseDesc', lang)}</div>
                </div>
              ) : null}

              <div style={{ background: C.bgSoft, borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{
                  width: `${stats.pct}%`, height: '100%',
                  background: stats.pct === 100 ? C.teal : C.amber,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 11 * fsScale, color: C.muted, fontWeight: 700, marginBottom: 14,
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t(activeTree, lang)} {t('progress', lang)}
                  </span>
                  {howToDismissed && (
                    <button
                      onClick={() => setHowToDismissed(false)}
                      aria-label={t('howToUse', lang)}
                      title={t('howToUse', lang)}
                      style={{
                        flexShrink: 0,
                        width: 22, height: 22, borderRadius: 11,
                        border: `1.5px solid ${C.amber}`,
                        background: 'transparent', color: C.amberDark,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0,
                      }}
                    >
                      <Info style={{ width: 12, height: 12 }} strokeWidth={2.6} />
                    </button>
                  )}
                </div>
                <span style={{ flexShrink: 0 }}>{stats.done} / {stats.total} {t('levels', lang)} · {stats.pct}%</span>
              </div>

              <TreeGridView
                tree={tree} progress={progress}
                nextTierId={next ? next.tier.id : null} onTap={setDrawerPayload}
                onMaxAll={maxAllInTier}
                lang={lang} fsScale={fsScale}
                scrollSignal={scrollSignal}
                flashTierId={flashTierId}
              />
            </section>
          </>
        )}

        {/* === BRAND FOOTER — xXx wordmark, slogans, compact counter === */}
        <section style={{
          marginTop: 36,
          padding: '24px 16px 12px',
          textAlign: 'center',
        }}>
          {/* xXx wordmark */}
          <div style={{
            fontSize: 36 * fsScale, fontWeight: 900,
            color: C.amberDark,
            fontFamily: "'Nunito', serif",
            letterSpacing: '0.25em',
            lineHeight: 1,
            marginBottom: 18,
            textShadow: theme === 'dark'
              ? `0 0 24px rgba(244, 169, 58, 0.3)`
              : 'none',
          }}>xXx</div>

          {/* Recruitment CTA — prominent button to join the kingdom */}
          <button
            onClick={() => setRecruitOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginBottom: 22,
              padding: '12px 26px', borderRadius: 999,
              border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${C.amber} 0%, ${C.amberDark} 100%)`,
              color: '#fff',
              fontSize: 14 * fsScale, fontWeight: 900,
              letterSpacing: '0.18em',
              boxShadow: theme === 'dark'
                ? '0 0 20px rgba(244, 169, 58, 0.4), 0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(200, 127, 21, 0.35)',
              animation: 'pulseDot 2.5s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: 16 * fsScale, lineHeight: 1 }}>⚔️</span>
            {t('joinUs', lang)} {RECRUIT.kingdom}
          </button>

          {/* Slogans */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            gap: 7, marginBottom: 18,
          }}>
            {[
              t('liveTogether', lang),
              t('growTogether', lang),
              t('fightTogether', lang),
            ].map((slogan, i) => (
              <div
                key={i}
                style={{
                  fontSize: 12 * fsScale, fontWeight: 800,
                  letterSpacing: '0.15em',
                  color: C.amberDark,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 14 * fsScale, lineHeight: 1 }}>⚔️</span>
                <span>{slogan}</span>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: 9 * fsScale, fontWeight: 800,
            color: C.muted, letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>xXx COMMANDERS · KINGSHOT</div>

          {/* Counter pill — compact and decorative */}
          {visitorCount !== null && (
            <div style={{
              display: 'inline-flex', alignItems: 'stretch',
              borderRadius: 999,
              border: `1.5px solid ${C.amberDark}`,
              overflow: 'hidden',
              fontSize: 11 * fsScale, fontWeight: 800,
              fontFeatureSettings: '"tnum"',
              boxShadow: theme === 'dark'
                ? '0 0 12px rgba(244, 169, 58, 0.15)'
                : '0 2px 4px rgba(200, 127, 21, 0.1)',
            }}>
              <span style={{
                padding: '5px 14px',
                color: C.muted, letterSpacing: '0.1em',
                background: 'transparent',
              }}>{t('counterLabel', lang)}</span>
              <span style={{
                padding: '5px 14px',
                background: C.amberSoft,
                color: C.amberDark,
                letterSpacing: '0.05em',
              }}>{visitorCount.toLocaleString()}</span>
            </div>
          )}

          {/* Days active streak */}
          {activeDays.length > 0 && (
            <div style={{
              marginTop: 14,
              fontSize: 11 * fsScale, color: C.inkSoft, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Calendar style={{ width: 13, height: 13, color: C.tealDark }} strokeWidth={2.4} />
              <span>
                <strong style={{ color: C.tealDark }}>{activeDays.length}</strong>
                {' '}{t('daysActive', lang)}
              </span>
            </div>
          )}

          {/* Data sources */}
          <p style={{
            fontSize: 9 * fsScale, color: C.muted,
            marginTop: 18, marginBottom: 0,
            letterSpacing: '0.05em',
          }}>
            Data: kingshot.net · kingshotdata.com · lootbar.gg
          </p>
        </section>
      </div>

      <TierDrawer
        payload={drawerPayload} spendProfile={spendProfile}
        onClose={() => setDrawerPayload(null)}
        onInc={inc} onDec={dec} onMax={setMaxTier} onZero={zeroTier}
        onSetLevel={setLevel}
        onPinToggle={(tierId) => {
          setPinnedTierId(prev => (prev === tierId ? null : tierId));
          showToast(pinnedTierId === drawerPayload?.tier.id ? t('unpin', lang) : t('pin', lang), 'success');
        }}
        isPinned={drawerPayload && pinnedTierId === drawerPayload.tier.id}
        onSkipToggle={(tierId) => {
          setSkippedTiers(prev => {
            const wasSkipped = prev.includes(tierId);
            const next = wasSkipped ? prev.filter(id => id !== tierId) : [...prev, tierId];
            const undoFn = () => setSkippedTiers(prev);
            showToast(
              wasSkipped ? t('unskipped', lang) : t('skipped', lang),
              'success',
              undoFn
            );
            return next;
          });
        }}
        isSkipped={drawerPayload && skippedTiers.includes(drawerPayload.tier.id)}
        lang={lang} fsScale={fsScale}
      />

      {/* RECRUITMENT MODAL */}
      {recruitOpen && (
        <div
          onClick={() => setRecruitOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 65,
            background: 'rgba(58, 46, 38, 0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 460,
              background: C.card, color: C.ink,
              borderRadius: 22, padding: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              maxHeight: '90vh', overflowY: 'auto',
              border: theme === 'dark' ? `2px solid ${C.amberDark}` : `2px solid ${C.amber}`,
            }}
          >
            {/* Close button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
              <button
                onClick={() => setRecruitOpen(false)}
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: C.bgSoft, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.muted,
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* xXx wordmark */}
            <div style={{
              textAlign: 'center',
              fontSize: 32 * fsScale, fontWeight: 900,
              color: C.amberDark,
              fontFamily: "'Nunito', serif",
              letterSpacing: '0.25em',
              lineHeight: 1,
              marginBottom: 6,
              textShadow: theme === 'dark' ? `0 0 18px rgba(244, 169, 58, 0.35)` : 'none',
            }}>xXx</div>
            <h2 style={{
              textAlign: 'center',
              fontSize: 17 * fsScale, fontWeight: 800, color: C.ink,
              margin: '0 0 18px',
              letterSpacing: '0.05em',
            }}>{t('recruitTitle', lang)}</h2>

            {/* Big kingdom number */}
            <div style={{
              textAlign: 'center', marginBottom: 22,
              padding: '14px 16px', borderRadius: 14,
              background: theme === 'dark'
                ? `linear-gradient(135deg, ${C.amberSoft} 0%, ${C.bgSoft} 100%)`
                : `linear-gradient(135deg, ${C.amberBg} 0%, ${C.amberSoft} 100%)`,
              border: `1.5px solid ${C.amberDark}`,
            }}>
              <div style={{
                fontSize: 10 * fsScale, fontWeight: 800, letterSpacing: '0.25em',
                color: C.muted, textTransform: 'uppercase', marginBottom: 2,
              }}>{t('recruitKingdom', lang)}</div>
              <div style={{
                fontSize: 36 * fsScale, fontWeight: 900,
                color: C.amberDark, lineHeight: 1.1,
                fontFeatureSettings: '"tnum"',
                letterSpacing: '-0.01em',
              }}>{RECRUIT.kingdom}</div>
            </div>

            {/* Why join */}
            <div style={{
              fontSize: 10 * fsScale, fontWeight: 800, letterSpacing: '0.2em',
              color: C.muted, textTransform: 'uppercase', marginBottom: 10,
            }}>{t('recruitWhy', lang)}</div>
            <div style={{ marginBottom: 22 }}>
              {(RECRUIT.sellingPoints[lang] || RECRUIT.sellingPoints.en).map((point, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < (RECRUIT.sellingPoints[lang] || RECRUIT.sellingPoints.en).length - 1
                      ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 11,
                    background: C.tealBg, color: C.tealDark,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <Check style={{ width: 13, height: 13 }} strokeWidth={3} />
                  </div>
                  <span style={{
                    fontSize: 13 * fsScale, color: C.ink,
                    lineHeight: 1.4, fontWeight: 600,
                  }}>{point}</span>
                </div>
              ))}
            </div>

            {/* Contact section */}
            <div style={{
              fontSize: 10 * fsScale, fontWeight: 800, letterSpacing: '0.2em',
              color: C.muted, textTransform: 'uppercase', marginBottom: 10,
            }}>{t('recruitContact', lang)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Discord server */}
              <a
                href={RECRUIT.discord}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 12,
                  background: '#5865F2',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 14 * fsScale, fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(88, 101, 242, 0.4)',
                }}
              >
                <span style={{ fontSize: 18 }}>💬</span>
                <span style={{ flex: 1 }}>Discord</span>
                <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={2.5} />
              </a>
              {/* In-game contact */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                background: C.bgSoft,
                color: C.ink,
                fontSize: 14 * fsScale, fontWeight: 700,
              }}>
                <span style={{ fontSize: 18 }}>🎮</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 9 * fsScale, fontWeight: 800, letterSpacing: '0.15em',
                    color: C.muted, textTransform: 'uppercase', marginBottom: 1,
                  }}>{t('recruitInGame', lang)}</div>
                  <div style={{ color: C.amberDark, fontFamily: 'monospace', fontSize: 14 * fsScale }}>
                    {RECRUIT.inGameContact}
                  </div>
                </div>
              </div>
            </div>

            {/* Slogans at the bottom */}
            <div style={{
              marginTop: 22, paddingTop: 18,
              borderTop: `1px solid ${C.border}`,
              textAlign: 'center',
              fontSize: 10 * fsScale, color: C.amberDark,
              letterSpacing: '0.2em', fontWeight: 800,
              lineHeight: 2,
            }}>
              ⚔️ WE LIVE TOGETHER ⚔️ WE GROW TOGETHER ⚔️ WE FIGHT TOGETHER
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {searchOpen && (() => {
        // Build filtered results from all 3 trees
        const q = searchQuery.trim().toLowerCase();
        const allTechs = [];
        for (const treeKey of ['growth', 'economy', 'battle']) {
          for (const family of TREES[treeKey].families) {
            for (const tier of family.tiers) {
              allTechs.push({ family, tier, treeKey });
            }
          }
        }
        const filtered = q.length > 0
          ? allTechs.filter(({ family }) => {
              const n = nameOf(family, lang).toLowerCase();
              const e = effectOf(family, lang).toLowerCase();
              return n.includes(q) || e.includes(q);
            }).slice(0, 30)
          : [];
        return (
          <div
            onClick={() => setSearchOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              background: 'rgba(58, 46, 38, 0.6)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              padding: 20, paddingTop: 60,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: 480,
                background: C.card, color: C.ink,
                borderRadius: 20,
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxHeight: '80vh', display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Search input row */}
              <div style={{
                padding: 16, borderBottom: `1.5px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Search style={{ width: 20, height: 20, color: C.muted, flexShrink: 0 }} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder', lang)}
                  style={{
                    flex: 1, minWidth: 0,
                    background: 'transparent', border: 'none', outline: 'none',
                    color: C.ink, fontSize: 14 * fsScale, fontWeight: 600,
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: C.bgSoft, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.muted, flexShrink: 0,
                  }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              {/* Results */}
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {q.length === 0 ? (
                  <div style={{
                    padding: 40, textAlign: 'center',
                    color: C.muted, fontSize: 12 * fsScale,
                  }}>
                    {t('searchPlaceholder', lang)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{
                    padding: 40, textAlign: 'center',
                    color: C.muted, fontSize: 13 * fsScale, fontWeight: 600,
                  }}>
                    {t('searchNoResults', lang)}
                  </div>
                ) : (
                  filtered.map(({ family, tier, treeKey }) => {
                    const ResIcon = family.icon || Zap;
                    const cur = progress[tier.id] || 0;
                    const done = cur >= tier.max;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => {
                          // Switch to that tree, open the drawer
                          setActiveTree(treeKey);
                          setDrawerPayload({ family, tier, currentLevel: cur });
                          setSearchOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '10px 14px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          borderBottom: `1px solid ${C.border}`,
                          textAlign: 'left', color: 'inherit',
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: done ? C.tealBg : C.bgSoft,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <ResIcon style={{ color: done ? C.tealDark : C.amberDark, width: 16, height: 16 }} strokeWidth={2.4} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13 * fsScale, fontWeight: 800, color: C.ink,
                            lineHeight: 1.2,
                          }}>
                            {nameOf(family, lang)} {tier.roman}
                          </div>
                          <div style={{
                            fontSize: 10 * fsScale, color: C.muted, marginTop: 1,
                            fontWeight: 600,
                          }}>
                            {effectOf(family, lang)} · {t(treeKey, lang)}
                          </div>
                        </div>
                        <div style={{
                          fontSize: 11 * fsScale, fontWeight: 800,
                          color: done ? C.tealDark : C.muted,
                          fontFeatureSettings: '"tnum"',
                          flexShrink: 0,
                        }}>{cur}/{tier.max}</div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* EXPORT / IMPORT MODAL */}
      {importExportMode && (
        <div
          onClick={() => { setImportExportMode(null); setExportCopied(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(58, 46, 38, 0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 420,
              background: C.card, color: C.ink,
              borderRadius: 20, padding: 22,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <h3 style={{ fontSize: 17 * fsScale, fontWeight: 800, color: C.ink, margin: 0 }}>
                {importExportMode === 'export' ? t('exportProgress', lang) : t('importProgress', lang)}
              </h3>
              <button
                onClick={() => { setImportExportMode(null); setExportCopied(false); }}
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: C.bgSoft, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.muted,
                }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <p style={{
              fontSize: 12 * fsScale, color: C.inkSoft, lineHeight: 1.45,
              margin: '0 0 12px',
            }}>
              {importExportMode === 'export' ? t('exportDesc', lang) : t('importDesc', lang)}
            </p>

            {importExportMode === 'export' ? (() => {
              const exportData = JSON.stringify({
                v: 1,
                progress, spendProfile, pinnedTierId,
              });
              return (
                <>
                  <textarea
                    readOnly
                    value={exportData}
                    onClick={(e) => e.target.select()}
                    style={{
                      width: '100%', minHeight: 90,
                      padding: 10, borderRadius: 10,
                      background: C.bgSoft, color: C.ink,
                      border: `1.5px solid ${C.border}`,
                      fontSize: 11 * fsScale, fontFamily: 'monospace',
                      resize: 'none', outline: 'none',
                      wordBreak: 'break-all',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={async () => {
                      try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                          await navigator.clipboard.writeText(exportData);
                        } else {
                          // Fallback: select textarea
                          const ta = document.querySelector('textarea[readonly]');
                          if (ta) { ta.select(); document.execCommand('copy'); }
                        }
                        setExportCopied(true);
                        setTimeout(() => setExportCopied(false), 1800);
                      } catch (e) {}
                    }}
                    style={{
                      marginTop: 12, width: '100%', padding: '12px 0',
                      borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: exportCopied ? C.green : C.teal, color: '#fff',
                      fontSize: 14 * fsScale, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      transition: 'background 0.2s ease',
                    }}
                  >
                    {exportCopied ? <Check style={{ width: 16, height: 16 }} strokeWidth={3} /> : <Download style={{ width: 16, height: 16 }} />}
                    {exportCopied ? t('copied', lang) : t('copyToClipboard', lang)}
                  </button>
                </>
              );
            })() : (
              <>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder='{"v":1,...}'
                  style={{
                    width: '100%', minHeight: 90,
                    padding: 10, borderRadius: 10,
                    background: C.bgSoft, color: C.ink,
                    border: `1.5px solid ${C.border}`,
                    fontSize: 11 * fsScale, fontFamily: 'monospace',
                    resize: 'none', outline: 'none',
                    wordBreak: 'break-all',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(importText);
                      if (parsed && typeof parsed === 'object' && parsed.progress) {
                        setProgress(parsed.progress);
                        if (parsed.spendProfile) setSpendProfile(parsed.spendProfile);
                        if (parsed.pinnedTierId !== undefined) setPinnedTierId(parsed.pinnedTierId);
                        setImportExportMode(null);
                        setImportText('');
                        showToast(t('importOk', lang), 'success');
                      } else {
                        showToast(t('importBad', lang), 'warn');
                      }
                    } catch (e) {
                      showToast(t('importBad', lang), 'warn');
                    }
                  }}
                  disabled={!importText.trim()}
                  style={{
                    marginTop: 12, width: '100%', padding: '12px 0',
                    borderRadius: 12, border: 'none',
                    cursor: importText.trim() ? 'pointer' : 'not-allowed',
                    background: importText.trim() ? C.teal : C.bgSoft,
                    color: importText.trim() ? '#fff' : C.muted,
                    fontSize: 14 * fsScale, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Upload style={{ width: 16, height: 16 }} />
                  {t('importBtn', lang)}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* RESET CONFIRM MODAL */}
      {confirmReset && (
        <div
          onClick={() => setConfirmReset(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(58, 46, 38, 0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 360,
              background: C.card, color: C.ink,
              borderRadius: 20, padding: 22,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: C.coralBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <RotateCcw style={{ width: 26, height: 26, color: C.coral }} strokeWidth={2.4} />
            </div>
            <h3 style={{
              fontSize: 18 * fsScale, fontWeight: 800, color: C.ink,
              margin: '0 0 6px', textAlign: 'center',
            }}>{t('resetConfirm', lang)}</h3>
            <p style={{
              fontSize: 13 * fsScale, color: C.muted, lineHeight: 1.45,
              margin: '0 0 18px', textAlign: 'center',
            }}>
              {t('resetWarning', lang)}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setConfirmReset(false)}
                style={{
                  flex: 1, padding: '12px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.bgSoft, color: C.ink,
                  fontSize: 14 * fsScale, fontWeight: 700,
                }}
              >{t('cancel', lang)}</button>
              <button
                onClick={doReset}
                style={{
                  flex: 1, padding: '12px 0',
                  borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: C.coral, color: '#fff',
                  fontSize: 14 * fsScale, fontWeight: 800, letterSpacing: '0.03em',
                }}
              >{t('yesReset', lang)}</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          key={toast.id}
          onClick={() => setToast(null)}
          style={{
            position: 'fixed',
            top: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '10px 14px 10px 18px', borderRadius: 999,
            background: toast.kind === 'success' ? C.tealDark : C.coral,
            color: '#fff',
            fontSize: 14, fontWeight: 800, letterSpacing: '0.02em',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            animation: 'toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex', alignItems: 'center', gap: 10,
            maxWidth: 'calc(100vw - 32px)',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <span style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            minWidth: 0,
          }}>{toast.text}</span>
          {toast.undo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                try { toast.undo(); } catch (e) {}
                setToast(null);
              }}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: 999,
                border: 'none',
                background: 'rgba(255,255,255,0.22)',
                color: '#fff',
                fontSize: 12, fontWeight: 800, letterSpacing: '0.05em',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >{t('undo', lang)}</button>
          )}
          {/* Countdown bar — shows remaining time before toast disappears */}
          {toast.undo && (
            <div
              key={toast.id}
              style={{
                position: 'absolute',
                bottom: 0, left: 0,
                height: 3, background: 'rgba(255,255,255,0.5)',
                animation: 'toastTimerShrink 9s linear forwards',
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
