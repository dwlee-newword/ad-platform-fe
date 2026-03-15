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
} as const;

export const NAV_ITEMS = [
  { href: '/status', label: PAGES.status.title },
  { href: '/contracts', label: PAGES.contracts.title },
] as const;
