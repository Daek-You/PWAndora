from .base import db
from .pwa import PWA


PWA.displays = db.relationship(
    "Display", backref="pwa", lazy="dynamic"
)

PWA.contents = db.relationship(
    "Content", backref="pwa", lazy="dynamic"
)

PWA.categories = db.relationship(
    "PWA_Category", secondary="pwa_category", backref="pwas", lazy="dynamic"
)

PWA.hashtags = db.relationship(
    "PWA_Hashtag", secondary="pwa_hashtag", backref="pwas", lazy="dynamic"
)

PWA.languages = db.relationship(
    "PWA_Language", backref="pwa", lazy="dynamic"
)

PWA.permissions = db.relationship(
    "PWA_Permission", backref="pwa", lazy="dynamic"
)

PWA.screenshots = db.relationship(
    "Screenshot", backref="pwa", lazy="dynamic"
)

PWA.site = db.relationship(
    "Site", backref="pwa", uselist=False
)
