class AppInfo:
    # 3번 모듈이 채울 데이터 클래스

    url: str
    start_url: str
    name: str
    icons: list[str]
    description: str
    screenshots: list[str]
    categories: list[str]
    languages: list[str]
    age_rating: str

    def __init__(self, url):
        self.url = url
        self.start_url = ""
        self.name = ""
        self.icons = []
        self.description = ""
        self.screenshots = []
        self.categories = []
        self.languages = []
        self.age_rating = ""

    def get_absolute_url(self, path):
        if path.startswith("http"):
            return path
        return self.url.rstrip("/") + "/" + path.lstrip("/")
    
    def get_dir_name(self):
        return self.name.replace(" ", "_")
    
    def refine(self):
        # deduplicate categories, languages, and screenshots
        self.categories = list(set(self.categories))
        self.languages = list(set(self.languages))
        self.screenshots = list(set(self.screenshots))

        # absolute url for icons
        self.icons = [self.get_absolute_url(icon) for icon in self.icons]

    def __str__(self):
        return f"AppInfo(url={self.url}, name={self.name}, icons={self.icons}, description={self.description}, screenshots={self.screenshots}, categories={self.categories}, languages={self.languages}, age_rating={self.age_rating})"

    def __repr__(self):
        return self.__str__()

    def to_dict(self):
        return {
            "url": self.url,
            "name": self.name,
            "icons": self.icons,
            "description": self.description,
            "screenshots": self.screenshots,
            "categories": self.categories,
            "languages": self.languages,
            "age_rating": self.age_rating
        }
    
    @staticmethod
    def from_dict(data: dict):
        return AppInfo(
            url=data["url"],
            name=data["name"],
            icons=data["icons"],
            description=data["description"],
            screenshots=data["screenshots"],
            categories=data["categories"],
            languages=data["languages"],
            age_rating=data["age_rating"]
        )
    
    @staticmethod
    def from_openai_data(data: dict):
        return AppInfo(
            url="",
            name="",
            icons=[],
            description=data["description"],
            screenshots=[],
            categories=data["categories"],
            languages=data["languages"],
            age_rating=data["age_rating"]
        )
