export const APP_NAME = '광고 센터';
export const APP_DESCRIPTION = '광고 상품 구매 서비스';

export const PAGES = {
  home: {
    title: '광고 센터 홈',
    description:
      '광고 센터에 오신 것을 환영합니다. 왼쪽 메뉴를 통해 "광고 현황 조회" 또는 "광고 계약"을 선택하여 작업을 시작할 수 있습니다.',
  },
  status: {
    title: '광고 현황 조회',
    description: '',
  },
  contracts: {
    title: '광고 계약',
    description: '',
  },
  contractDetail: {
    title: '계약 상세',
  },
  contractResult: {
    title: '광고 계약 상세',
  },
} as const;

export const COMMON = {
  loading: '불러오는 중...',
  fetchError: '데이터를 불러오지 못했습니다.',
  back: '뒤로가기',
  systemError: '시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  retry: '다시 시도',
  close: '닫기',
} as const;

export const CONTRACT_FORM = {
  fields: {
    company: '업체명',
    product: '상품',
    startDate: '계약 시작일',
    endDate: '계약 종료일',
    amount: '계약 금액',
  },
  placeholders: {
    company: '업체를 선택하세요',
    date: '날짜를 선택하세요',
    amount: '계약 금액을 입력하세요 (10,000 ~ 1,000,000)',
  },
  errors: {
    productNotFound: '상품을 찾을 수 없습니다.',
    amountRange: '계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.',
  },
  submit: '계약',
  todayWarning: {
    title: '광고 집행일이 오늘입니다',
    description:
      '계약 시작일이 오늘로 설정되어 있어 계약 즉시 광고가 집행됩니다. 계속 진행하시겠습니까?',
    cancel: '취소',
    confirm: '계속',
  },
  submitErrorModal: {
    title: '계약 등록 실패',
    close: '닫기',
  },
  successModal: {
    title: '계약 등록 완료',
    close: '닫기',
  },
  confirm: {
    title: '계약을 진행하시겠습니까?',
    description: '확인을 누르면 계약이 최종 등록됩니다.',
    cancel: '취소',
    confirm: '확인',
  },
} as const;

export const CONTRACT_RESULT = {
  cancel: '광고 취소',
  cancelDialog: {
    title: '광고를 취소하시겠습니까?',
    description: '취소 후에는 되돌릴 수 없습니다.',
    cancel: '닫기',
    confirm: '광고 취소',
  },
  cancelErrorModal: {
    title: '광고 취소 실패',
    close: '닫기',
  },
} as const;

export const CONTRACT_STATUSES = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '집행전' },
  { value: 'IN_PROGRESS', label: '집행중' },
  { value: 'CANCELLED', label: '광고취소' },
  { value: 'COMPLETED', label: '광고종료' },
] as const;

export const CONTRACT_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  CONTRACT_STATUSES.filter((s) => s.value !== 'ALL').map((s) => [s.value, s.label]),
);

export const AD_STATUS = {
  filterTitle: '조회 필터',
  companyLabel: '업체명',
  companyPlaceholder: '업체명 선택',
  statusLabel: '계약상태',
  startDateLabel: '계약 시작일',
  endDateLabel: '계약 종료일',
  datePlaceholder: '날짜 선택',
  searchButton: '조회',
  fetchErrorModal: {
    title: '조회 실패',
  },
  statusRequired: {
    title: '계약상태 미선택',
    message: '계약상태를 1개 이상 선택해주세요.',
  },
  resultsTitle: '검색 결과',
  emptyResults: '검색 결과가 없습니다.',
  tableHeaders: {
    contractDate: '계약일',
    contractNumber: '계약번호',
    company: '업체',
    productName: '상품명',
    startDate: '계약시작일',
    endDate: '계약종료일',
    amount: '계약금액',
    status: '계약상태',
  },
} as const;

export const CONTRACT_DETAIL = {
  periodLabel: '계약 기간',
  notFound: '계약을 찾을 수 없습니다.',
  fields: {
    contractNumber: '계약번호',
    company: '업체',
    productName: '상품명',
    period: '계약기간',
    amount: '계약금액',
    status: '계약상태',
  },
} as const;

export const COMPANY_AUTOCOMPLETE = {
  searchPlaceholder: '업체명 검색...',
  noResults: '검색 결과 없음',
  typeToSearch: '업체명을 입력하여 검색하세요',
  refineSearch: '검색어를 구체적으로 입력하면 결과를 좁힐 수 있습니다',
} as const;

export const CONTRACT_FORM_MESSAGES = {
  successContractCreated: (companyName: string) =>
    `${companyName}으로 계약 생성에 성공했습니다.`,
  successAdScheduled: (startDate: string) =>
    `${startDate}부터 광고 집행될 예정입니다.`,
};

export const DATE_NAVIGATION = {
  backYear: '≪1년 전',
  backMonth: '‹1개월 전',
  forwardMonth: '1개월 후›',
  forwardYear: '1년 후≫',
} as const;

export const PAGINATION = {
  prev: '이전',
  next: '다음',
} as const;

export const NAV_ITEMS = [
  { href: '/status', label: PAGES.status.title },
  { href: '/contracts', label: PAGES.contracts.title },
] as const;
