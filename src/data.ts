import { ProfileDefinition, LearnerProfileKey, DailyRecord, TimePeriod, Badge } from './types';

export const PROFILE_DATA: ProfileDefinition[] = [
  {
    key: 'Inquirers',
    name: '탐구하는 사람',
    englishName: 'Inquirers',
    emoji: '🔍',
    color: '#3b82f6', // blue
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    mission: '수업 시간에 궁금한 점이 생기면 질문 노트에 적어두고, 쉬는 시간에 선생님이나 책을 통해 스스로 답 찾아보기',
    description: '호기심을 키우고, 스스로 탐구하고 배우는 힘을 기릅니다. 평생 배움을 즐기는 마음을 배양합니다.',
    tips: [
      '스마트폰으로 게임 검색 대신 모르는 단어의 뜻을 사전에서 찾아봐요.',
      '책을 읽다가 "왜 그럴까?" 하는 의문이 생기면 메모해두고 도서관에서 관련 책을 찾아봐요.',
      '선생님이나 부모님께 오늘 배운 내용 중 가장 신기했던 것에 대해 꼬리 질문을 던져보세요.'
    ]
  },
  {
    key: 'Knowledgeable',
    name: '지식이 풍부한 사람',
    englishName: 'Knowledgeable',
    emoji: '📚',
    color: '#10b981', // emerald
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    mission: '오늘 배운 내용 중 가장 흥미로웠던 사실 한 가지를 가족이나 친구에게 설명해주기',
    description: '깊이 있는 지식을 탐구하며, 다양한 주제와 이슈들에 대해 배운 내용을 일상과 연결합니다.',
    tips: [
      '하교 길이나 저녁 식사 시간에 "오늘 학교에서 진짜 신기한 걸 배웠는데!" 하고 이야기해보세요.',
      '배운 내용을 나만의 그림 지도로 그리거나 마인드맵으로 정리해보세요.',
      '동화책이나 뉴스 기사 하나를 읽고 어떤 의미인지 스스로 요약해보세요.'
    ]
  },
  {
    key: 'Thinkers',
    name: '사고하는 사람',
    englishName: 'Thinkers',
    emoji: '💡',
    color: '#f59e0b', // amber
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    mission: '친구와 의견이 다를 때, "그렇게 생각할 수도 있구나!"라고 먼저 공감한 뒤 내 의견을 논리적으로 말해보기',
    description: '비판적이고 창의적인 사고 능력을 활용하여 복잡한 문제를 해결하고 현명한 결정을 내립니다.',
    tips: [
      '문제를 풀 때 한 가지 방법만 쓰지 말고 다른 방식으로도 풀어보세요.',
      '친구와 대화할 때 "내 생각에는 이래, 왜냐하면~"이라며 타당한 이유를 함께 덧붙여 말해요.',
      '나에게 일어난 작은 문제에 대해 일방적으로 불평하기보다 해결 가능한 대안을 세 가지만 찾아보세요.'
    ]
  },
  {
    key: 'Communicators',
    name: '소통하는 사람',
    englishName: 'Communicators',
    emoji: '🗣️',
    color: '#8b5cf6', // purple
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    mission: '쉬는 시간에 평소 잘 이야기해보지 않은 친구에게 먼저 다가가 "주말에 뭐 했어?"라고 따뜻하게 질문하기',
    description: '여러 언어와 방식으로 내 생각과 아이디어를 표현하고, 다른 사람의 목소리에 귀를 기울이며 협력합니다.',
    tips: [
      '친구의 이야기를 끊지 않고 고개를 끄덕이며 끝까지 경청해봅니다.',
      '문자 메시지나 짧은 편지로 주변 사람들에게 나의 감정이나 고마운 마음을 정확하게 써보세요.',
      '모둠 발표 시간에 듣는 사람들의 눈을 바라보며 자신감 있는 목소리로 이야기해보세요.'
    ]
  },
  {
    key: 'Principled',
    name: '원칙을 지키는 사람',
    englishName: 'Principled',
    emoji: '🛡️',
    color: '#06b6d4', // cyan
    borderColor: 'border-cyan-200',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    mission: '선생님이 보지 않더라도 복도에서 뛰지 않고, 쓰레기를 발견하면 먼저 주워서 쓰레기통에 버리기',
    description: '공정함, 정직함, 정의로움을 소중히 여기며, 규칙을 존중하고 스스로 행동에 책임을 집니다.',
    tips: [
      '학급 규칙이나 놀이 규칙을 철저히 지키며, 아무도 보지 않을 때도 약속을 실천해요.',
      '내가 실수했거나 잘못한 일이 있을 때 핑계를 대지 않고 솔직하게 인정해요.',
      '인터넷이나 SNS 상에서 고운 말, 바른 말만 사용하고 저작권을 지키려고 노력해요.'
    ]
  },
  {
    key: 'Open-minded',
    name: '열린 마음을 지닌 사람',
    englishName: 'Open-minded',
    emoji: '🌍',
    color: '#ec4899', // pink
    borderColor: 'border-pink-200',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    mission: '모둠 활동 시 내가 원하지 않는 역할을 맡게 되더라도 기분 좋게 수락하고 최선을 다하기',
    description: '나의 문화와 역사를 소중히 여기면서도, 다른 이의 다양한 관점과 문화를 수용하고 성장합니다.',
    tips: [
      '새로운 급식 메뉴나 평소에 잘 먹지 않던 다른 나라 음식을 한 입 도전해보세요.',
      '나와 성격이 다른 친구의 행동을 비난하지 않고, "저 친구는 저런 면이 멋지네!" 하고 긍정적인 면을 찾아요.',
      '책이나 영화를 볼 때 다른 주인공의 입장이 되어 그 감정을 상상하고 존중해보세요.'
    ]
  },
  {
    key: 'Caring',
    name: '배려하는 사람',
    englishName: 'Caring',
    emoji: '❤️',
    color: '#ef4444', // red
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    mission: '무거운 짐이나 청소 도구를 들고 가는 친구나 선생님을 보면 "내가 도와줄게!" 하고 함께 들기',
    description: '타인을 공감하고 동정하며, 적극적으로 봉사하고 더 나은 환경을 만들기 위해 배려를 실천합니다.',
    tips: [
      '속상해하는 친구가 있다면 옆에 앉아 가만히 등을 토닥여주거나 "괜찮아?"라고 한마디 건네보세요.',
      '집에서 부모님을 위해 심부름을 하거나 식사 준비, 정돈을 돕는 작은 깜짝 선물을 해보세요.',
      '나의 따뜻한 말 한마디가 상대방의 하루를 어떻게 바꿀 수 있을지 고민하고 실천해봅니다.'
    ]
  },
  {
    key: 'Risk-takers',
    name: '도전하는 사람',
    englishName: 'Risk-takers',
    emoji: '🚀',
    color: '#ea580c', // orange
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    mission: '오늘 수업 시간 중, 정답을 확실히 모르더라도 틀릴 것을 두려워하지 않고 내 생각을 1번 이상 발표해 보기',
    description: '불확실함에 마주하더라도 두려워하지 않고, 새로운 아이디어나 전술을 자신 있게 시도해봅니다.',
    tips: [
      '새로운 동아리 활동이나 학급 직책에 적극적으로 도전해 지원해보세요.',
      '한 번도 배워보지 않은 스포츠, 악기 혹은 게임을 처음부터 찬찬히 배워봅니다.',
      '틀리는 것에 주눅 들지 말고, "실수는 배움의 기회"라는 마음으로 용기를 내 목소리를 냅니다.'
    ]
  },
  {
    key: 'Balanced',
    name: '균형 잡힌 사람',
    englishName: 'Balanced',
    emoji: '⚖️',
    color: '#14b8a6', // teal
    borderColor: 'border-teal-200',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    mission: '쉬는 시간에 스마트폰이나 게임 이야기만 하지 않고, 가벼운 스트레칭을 하거나 바깥 공기 쐬고 오기',
    description: '몸과 마음, 감정의 조화로운 발달이 중요함을 이해하고, 나와 타인의 웰빙을 골고루 돌봅니다.',
    tips: [
      '공부나 책 읽기가 끝난 후 15분간 야외에서 가벼운 러닝을 하거나 줄넘기를 해요.',
      '정크푸드나 탄산음료 대신 신선한 과일과 물을 챙겨 먹는 건강 습관을 지킵니다.',
      '해야 할 숙제 시간과 자유 놀이 시간의 계획을 스스로 세워 골고루 실천해보세요.'
    ]
  },
  {
    key: 'Reflective',
    name: '성찰하는 사람',
    englishName: 'Reflective',
    emoji: '💭',
    color: '#64748b', // slate
    borderColor: 'border-slate-200',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    mission: '하교하기 전, 오늘 하루 나의 행동 중 가장 뿌듯했던 일과 조금 아쉬웠던 일을 일기장이나 메모장에 간략히 적어보기',
    description: '자신의 학습 과정과 경험을 비판적으로 분석하며, 나의 강점과 한계를 알고 스스로 성장하도록 노력합니다.',
    tips: [
      '시험 성적이 낮게 나왔을 때 단순 낙담하기보다, 어떤 단원이 부족했는지 오답 노트를 작성해봅니다.',
      '잠들기 전 5분간 눈을 감고 오늘 내가 친구에게 했던 상처 주는 말은 없었는지 돌아봅니다.',
      '나의 실천 포트폴리오를 읽어보며 내가 지난주보다 어떤 점이 성장했는지 기록해보세요.'
    ]
  }
];

// Helper to get past dates (format: YYYY-MM-DD)
export function getPastDateString(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const MISSION_POOL: Record<LearnerProfileKey, string[]> = {
  Inquirers: [
    '수업 시간에 궁금한 점이 생기면 질문 노트나 배움 공책에 적어두고, 쉬는 시간에 스스로 책이나 태블릿으로 답 찾아보기',
    '오늘 수업 중 새로 접한 용어나 개념 1개를 국어사전이나 온라인 백과사전으로 검색해서 의미를 배움장에 기록해보기',
    '평소에 궁금했던 신기한 자연 현상(예: 무지개 생성 원리, 조석 간만의 차 등)에 대해 쉬는 시간에 친구와 자유롭게 토론해보기',
    '급식 메뉴표를 보고 평소 좋아하는 메뉴의 영양소와 조리 과정을 상상하며 선생님께 한 가지 질문 던져보기'
  ],
  Knowledgeable: [
    '오늘 배운 과목(국어, 수학, 사회 등) 중 가장 흥미로웠던 핵심 지식 한 가지를 집에 가자마자 부모님이나 가족에게 친절히 설명해주기',
    '도서관 책이나 신문 기사에서 읽었던 유익한 글로벌 뉴스나 상식을 한 가지 기억해 뒀다가 쉬는 시간에 짝꿍에게 공유하기',
    '오늘 학교에서 배운 여러 교과 내용 중 중요한 세 가지 핵심 키워드를 나만의 생각 그물(마인드맵)로 배움 공책에 예쁘게 그려보기',
    '단원 평가 오답 노트를 스스로 복습하며 틀렸던 문제 속 핵심 지식 개념을 완벽하게 머릿속으로 다시 설명해보고 이해하기'
  ],
  Thinkers: [
    '친구와 의견 충돌이나 말다툼이 생길 뻔할 때, "너는 그렇게 생각할 수도 있구나!"라며 먼저 충분히 공감한 뒤 내 주장을 조리 있게 설명하기',
    '수학이나 실과 시간에 까다로운 문장제 문제를 마주했을 때, 한 가지 공식 외에 우회해서 해결하는 참신한 두 번째 방법 궁리하기',
    '내가 오늘 하루 게임, 유튜브 등 미디어 기기를 사용하는 총량과 스스로 학습해야 할 시간 비중을 주체적으로 기획하고 지키기',
    '도덕 시간이나 생활 지도 중 마주한 일상의 문제 상황에 대해 감정적으로 대응하기보다, 서로를 도울 세 가지 대안을 논리적으로 고안하기'
  ],
  Communicators: [
    '쉬는 시간에 평소 서먹했거나 많은 이야기를 나눠보지 못했던 반 친구에게 따뜻한 미소로 다가가 "오늘 급식 맛있지 않니?" 하고 먼저 다정한 말 붙이기',
    '모둠 토의 중 다른 친구가 발표할 때 그 친구의 눈을 따스하게 맞추며, 말을 중간에 가로막지 않고 끝까지 깊이 경청하며 고개 끄덕여 주기',
    '내가 서운하거나 기분 나쁜 감정이 생겼을 때, 상대방을 비난하지 않고 나의 감정 상태를 차분히 고운 말로 전하는 "나 전달법(I-Message)" 사용하기',
    '모둠별 협동 활동 시간에 우리 모둠의 발표자나 기록자 역할을 맡아 큰 소리로 친구들이 알기 쉬운 어조로 명확하게 생각을 표현하고 정리하기'
  ],
  Principled: [
    '선생님이나 보안관 아저씨 등 주변 어른들이 지켜보고 있지 않더라도 복도에서 뛰지 않고 우측 통행하는 안전 약속 완벽하게 지키기',
    '교실 바닥, 복도 혹은 운동장에 버려진 쓰레기나 낙서 흔적을 목격하면 내 잘못이 아니어도 자발적으로 주워 쓰레기통에 올바르게 버리기',
    '단톡방이나 소셜 미디어 등 온라인 공간에서 고운 한글을 사용하고, 다른 사람의 발표 자료나 사진의 저작권을 철저하게 보호하고 존중하기',
    '학급 자치 회의를 통해 모두가 약속한 규칙을 100% 실천하며, 놀이 중 반칙을 하지 않고 정정당당하게 게임 규칙 준수하며 플레이하기'
  ],
  'Open-minded': [
    '모둠 협동 학습이나 구역 청소 역할을 정할 때, 내가 가장 원하지 않는 힘들거나 기피하는 파트에 당첨되어도 기쁜 얼굴로 수락하고 힘내서 실천하기',
    '나와 자란 환경이나 취미가 다르고 심지어 생각이 정반대인 친구의 의견을 편견 없이 끝까지 감상하고, 그 친구만의 숨겨진 강점 찾아내어 칭찬해주기',
    '우리와 풍습이 다른 다문화 국가의 전통문화나 평소 낯설어했던 새로운 음식, 반찬 메뉴가 급식에 나왔을 때 거부감 없이 즐겁게 먹어보기',
    '친구와 갈등이 생겼을 때 오직 내 관점으로만 해석하지 않고 상대 친구의 억울했던 관점을 열린 가슴으로 10초 동안 상상하고 존중해보기'
  ],
  Caring: [
    '무거운 도서실 책, 미술 준비물, 또는 체육 기구를 나르고 계신 선생님이나 버거워하는 급식 당번 친구를 발견하면 재빨리 달려가 한 손 들어주기',
    '기분이 가라앉아 혼자 책상에 엎드려 있거나 풀죽어 있는 친구의 등을 가볍게 두드리며 "기분 괜찮아? 내가 도와줄 일 있어?" 하고 따스한 연민 건네기',
    '오늘 아침 등교할 때 마주친 보안관 선생님, 조리원 이모님, 반 친구들 한 명 한 명에게 생기발랄하고 따뜻한 목소리로 "안녕하세요! 좋은 하루 보내세요!" 인사하기',
    '내가 가지고 있는 예쁜 문구류나 교실 우유 급식의 남은 여분을 곤경에 처했거나 미처 챙겨오지 못한 친구에게 흔쾌히 배려하여 나누어주기'
  ],
  'Risk-takers': [
    '오늘 수업 시간 중 선생님이 정답을 묻거나 내 생각을 구하실 때, 틀려서 부끄러울까 걱정하지 않고 제일 먼저 우렁차게 손들고 내 의견 발표해보기',
    '아직 다뤄보지 않은 낯선 스포츠 종목(배드민턴, 축구 수비수 등)이나 해보지 않았던 독특한 창작 활동에 실패할 각오를 하고 적극적이고 과감하게 입문해보기',
    '급식 판에 나온 생소하거나 아주 매콤한 신메뉴 반찬을 한 조각 꼭 젓가락으로 집어 한 입 가득 물어 맛을 보고 도전하는 즐거움 만끽하기',
    '수업 중 아무도 자원하지 않는 모둠장이나 대표 발표자 제안이 나왔을 때, 한걸음 앞장서 용기를 내어 "제가 한번 시도해보겠습니다!" 외쳐보기'
  ],
  Balanced: [
    '쉬는 시간 10분 동안 스마트폰 기기를 끄고, 복도 창밖의 맑은 하늘을 30초 이상 가만히 응시하거나 친구들과 복도에서 가벼운 국민체조나 스트레칭하기',
    '몸의 건강을 지키기 위해 학교 체육 활동 시간이나 점심시간에 운동장에서 친구들과 땀이 나도록 뛰놀며 근력을 키우고, 충분한 깨끗한 물 섭취하기',
    '공부와 학원 일정 사이에서 내 감정이 너무 지치지 않도록 잠들기 전 5분간 차분한 명상 음악을 듣거나 오늘 하루 수고한 나 자신에게 깊은 위로의 숨 불어넣기',
    '내가 오늘 처리해야 할 학습 스케줄과 순수하게 몸으로 운동할 시간, 그리고 친구들과 평화롭게 소통하는 휴식 시간의 비율을 건강하게 설계하기'
  ],
  Reflective: [
    '하교길이나 잠들기 직전 가만히 눈을 감고, 오늘 하루 행동 중 가장 나다웠던 뿌듯했던 순간과 아주 조금 부끄러웠던 행동을 복기하고 내일의 더 나은 나 약속하기',
    '받아쓰기나 수학 단원 시험 점수가 기대 이하로 나왔을 때 슬퍼만 하지 않고, 내가 정복하지 못한 개념이 무엇인지 오답 페이퍼에 직접 차근차근 점검하기',
    '포트폴리오 통계 Radar 차트의 밸런스를 유심히 모니터링하며, 내가 지식이나 탐구에만 너무 쏠려있지 않고 배려와 성찰에도 신경 썼는지 균형 감각 측정해보기',
    '오늘 짝꿍에게 무심코 던졌던 말이 그 친구 마음에 상처를 주었을지 성찰해보고, 내일 아침 등교길에 사과할 친절한 사과 멘트를 일기에 직접 연필로 적어보기'
  ]
};

// Seed-based custom hashing function
export function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Get day-specific unique mission based on seed
export function getMissionForDay(profileKey: LearnerProfileKey, dateStr: string): string {
  const pool = MISSION_POOL[profileKey];
  if (!pool) return PROFILE_DATA.find((p) => p.key === profileKey)?.mission || '';
  const seed = hashStringToInt(dateStr);
  const idx = seed % pool.length;
  return pool[idx];
}

// Generates 1 year of realistic mock data
export function generateMockHistory(): DailyRecord[] {
  const records: DailyRecord[] = [];
  const profileKeys = PROFILE_DATA.map((p) => p.key);

  const mockMemos = [
    '오늘 수학 모둠 활동 때 친구들이랑 소통하며 주도적으로 규칙을 정했다.',
    '오늘 과학 시간에 화산 폭발 원리를 배우고 동생에게 친절하게 가르쳐 주었다.',
    '받아쓰기 문제에서 아쉽게 틀렸지만 용기 내어 스스로 다시 공부하고 해결했다.',
    '복도에서 뛰어가는 후배한테 부드러운 말투로 안전 보행하자고 먼저 이끌어주었다.',
    '급식 때 편식하기 쉬웠던 오이 반찬이 나왔는데 한 입 꾹 도전해서 완식했다!',
    '국어 토론 시간에 정민이의 전혀 다른 주장을 가로막지 않고 웃으며 끝까지 들었다.',
    '쉬는 시간에 복도를 지나가다 바닥에 뒹굴고 있던 과자 봉투를 알아서 주웠다.',
    '미술 협동 조각 시간에 남들이 주저하는 모둠의 정리정돈을 손발 걷어붙여 지휘했다.',
    '숙제를 마치고 오락하고 싶었지만 건강을 수호하기 위해 눈 스트레칭을 30분 했다.',
    '사회 수행 자료 조사를 도서관에 직접 방문해서 아날로그 책을 찾아 해결했다.',
    '체육 피구 경기 중 넘어져 우는 친구의 상처에 보건실 연고를 들고 가 위로했다.',
    '친구와 팽팽히 엇갈리는 입장이었으나 양보하여 갈등을 평화로이 해소했다.',
    '오늘 수업 도중 내 생각을 자신감 있고 정확히 전달해서 선생님의 기쁨이 되었다.',
    '하교길 쓰레기 수거 및 내 서랍 정돈을 남김없이 말끔히 완료했다.'
  ];

  // Generate for past 365 days
  for (let i = 365; i >= 1; i--) {
    const dateStr = getPastDateString(i);
    
    // Pick a random number of completed profiles (between 3 and 7)
    const shuffled = [...profileKeys].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const completed = shuffled.slice(0, count);

    records.push({
      date: dateStr,
      completed,
      submitted: true,
      memo: mockMemos[i % mockMemos.length]
    });
  }

  return records;
}

// Compute statistics for the dashboard
export function calculateStats(history: DailyRecord[], period: TimePeriod) {
  const profileCounts: Record<LearnerProfileKey, number> = {} as any;
  PROFILE_DATA.forEach((p) => {
    profileCounts[p.key] = 0;
  });

  // Filter based on period
  let daysToCount = 1;
  if (period === 'week') daysToCount = 7;
  if (period === 'month') daysToCount = 14; // our standard current cycle representation
  if (period === '3months') daysToCount = 90;
  if (period === '6months') daysToCount = 180;
  if (period === '1year') daysToCount = 365;

  const today = new Date().toISOString().split('T')[0];
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysToCount);
  const thresholdStr = thresholdDate.toISOString().split('T')[0];

  const filteredHistory = history.filter((record) => {
    if (period === 'day') {
      return record.date === today;
    }
    return record.date >= thresholdStr;
  });

  filteredHistory.forEach((record) => {
    record.completed.forEach((key) => {
      if (profileCounts[key] !== undefined) {
        profileCounts[key] += 1;
      }
    });
  });

  // Convert to chart-friendly format
  const chartData = PROFILE_DATA.map((p) => ({
    name: p.name,
    englishName: p.englishName,
    key: p.key,
    value: profileCounts[p.key],
    percentage: filteredHistory.length > 0 
      ? Math.round((profileCounts[p.key] / filteredHistory.length) * 100) 
      : 0,
    color: p.color,
    emoji: p.emoji
  }));

  // Sort to find strengths and areas for growth
  const sorted = [...chartData].sort((a, b) => b.value - a.value);
  
  // Handlers for empty records
  const maxVal = sorted[0]?.value || 0;
  const minVal = sorted[sorted.length - 1]?.value || 0;

  return {
    chartData,
    strongest: sorted.length > 0 && sorted[0].value > 0 ? sorted[0] : null,
    weakest: sorted.length > 0 ? sorted[sorted.length - 1] : null,
    totalSubmittedDays: filteredHistory.length,
    averageCompletedPerDay: filteredHistory.length > 0
      ? (filteredHistory.reduce((acc, r) => acc + r.completed.length, 0) / filteredHistory.length).toFixed(1)
      : '0'
  };
}

// Generate the beautiful Badge & Achievements list
export function getBadgesList(history: DailyRecord[]): Badge[] {
  const profileTotals: Record<LearnerProfileKey, number> = {} as any;
  PROFILE_DATA.forEach((p) => {
    profileTotals[p.key] = 0;
  });

  // Compute total counts for each profile
  history.forEach((record) => {
    record.completed.forEach((key) => {
      if (profileTotals[key] !== undefined) {
        profileTotals[key]++;
      }
    });
  });

  const totalDaysCount = history.filter((r) => r.submitted).length;

  const badges: Badge[] = [];

  // 1. Level-based badges for each of the 10 profiles (10 keys * 5 tiers = 50 badges)
  const tierConfigs = [
    { level: 1, requiredCount: 1, suffix: '새싹', emojiOverride: '🌱', desc: '해당 학습자상의 첫 실천을 훌륭히 마쳤습니다!' },
    { level: 2, requiredCount: 5, suffix: '수호자', emojiOverride: '🧭', desc: '해당 영역에서 흔들림 없는 모범이 됩니다.' },
    { level: 3, requiredCount: 15, suffix: '전도사', emojiOverride: '🔥', desc: '친구들에게 적극적으로 긍정 가치를 전파합니다.' },
    { level: 4, requiredCount: 30, suffix: '전문가', emojiOverride: '🎓', desc: '학급 전원의 롤모델이자 주도적인 학습 리더입니다.' },
    { level: 5, requiredCount: 50, suffix: '마스터', emojiOverride: '👑', desc: '해당 학습자상 분야의 최고 권위자 수준에 올랐습니다!' }
  ];

  PROFILE_DATA.forEach((profile) => {
    tierConfigs.forEach((tier) => {
      const id = `${profile.key}_L${tier.level}`;
      const name = `${profile.name} ${tier.suffix}`;
      const emoji = tier.level === 5 ? '👑' : profile.emoji;
      const progress = profileTotals[profile.key];
      const isUnlocked = progress >= tier.requiredCount;

      badges.push({
        id,
        name,
        emoji,
        description: `진정으로 ${profile.name}으로서의 모습을 갖춰가고 있습니다. ${tier.desc}`,
        requirementDescription: `${profile.name} ${tier.requiredCount}회 실천 (현재: ${progress}회)`,
        profileKey: profile.key,
        requiredCount: tier.requiredCount,
        type: 'profile_count'
      });
    });
  });

  // 2. Cumulative milestones for submission streaks (6 badges)
  const milestoneConfigs = [
    { id: 'total_1', name: '꿈의 첫 삽 🗺️', count: 1, desc: 'IB 학습자상 기록 포트폴리오의 첫 걸음을 떼었습니다.' },
    { id: 'total_5', name: '습관의 새싹 📅', count: 5, desc: '배움을 기록하고 성찰하는 아름다운 주간 습관을 지녔습니다.' },
    { id: 'total_10', name: '원칙 수호대 🛡️', count: 10, desc: '꾸준하고 규칙적으로 학습 성찰을 실천하고 있습니다.' },
    { id: 'total_30', name: '영예로운 열정 💖', count: 30, desc: '한 달간 거르지 않고 자신을 탐구하고 성찰했습니다.' },
    { id: 'total_100', name: '100일의 기적 💯', count: 100, desc: '세상을 이롭게 바꾸는 진정한 IB 글로벌 핵심 인재입니다.' },
    { id: 'total_300', name: '성장의 화룡점정 🏆', count: 300, desc: '초등학교 5학년 과정 동안 완벽한 배움의 헌신을 선보였습니다!' }
  ];

  milestoneConfigs.forEach((m) => {
    badges.push({
      id: m.id,
      name: m.name,
      emoji: m.name.split(' ').pop() || '🏅',
      description: m.desc,
      requirementDescription: `총 포트폴리오 제출 ${m.count}일 달성 (현재: ${totalDaysCount}일)`,
      requiredCount: m.count,
      type: 'total_days'
    });
  });

  return badges;
}

// Reconstruct historical records from cumulative profile counts for read-only share view
export function reconstructHistoryFromShared(stats: Record<LearnerProfileKey, number>): DailyRecord[] {
  const records: DailyRecord[] = [];
  const keys = Object.keys(stats) as LearnerProfileKey[];
  const maxCount = Math.max(...Object.values(stats), 1);
  
  for (let d = 0; d < maxCount; d++) {
    const completedThisDay: LearnerProfileKey[] = [];
    keys.forEach(key => {
      if (stats[key] > d) {
        completedThisDay.push(key);
      }
    });
    
    records.push({
      date: getPastDateString(maxCount - d),
      completed: completedThisDay,
      submitted: true,
      memo: '공유된 포트폴리오의 실천 이력입니다.'
    });
  }
  return records;
}


