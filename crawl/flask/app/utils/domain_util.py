from urllib.parse import urlparse

def extract_main_domain(url):
    """
    URL에서 메인 도메인을 추출하는 함수

    예시:
    "https://www.example.com/page" -> "https://example.com"
    "https://subdomain.example.co.kr/page" -> "https://example.co.kr"
    """
    # URL 파싱
    parsed_url = urlparse(url)
    netloc = parsed_url.netloc or parsed_url.path  # URL이 scheme 없이 시작하는 경우 대비
    
    # www 같은 서브도메인 제거
    domain_parts = netloc.split('.')
    
    # 일반적인 최상위 도메인(.com, .org 등)인 경우
    if len(domain_parts) >= 2:
        # 국가코드 최상위 도메인(.co.kr, .co.jp 등) 처리
        if len(domain_parts) >= 3 and domain_parts[-2] in ['co', 'com', 'net', 'org', 'ac', 'edu', 'gov']:
            main_domain = '.'.join(domain_parts[-3:])
        else:
            main_domain = '.'.join(domain_parts[-2:])
    else:
        main_domain = netloc
    
    # 포트 번호 제거
    main_domain = main_domain.split(':')[0]
    
    # https:// 접두사 추가
    main_domain = f"https://{main_domain}"
    
    return main_domain