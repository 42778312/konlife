import re

from app.core.config import Settings


def test_lan_phone_origin_is_allowed():
    pattern = re.compile(Settings().cors_origin_regex)
    assert pattern.match("http://192.168.178.26:8081")
    assert pattern.match("http://10.0.0.4:8081")
    assert pattern.match("http://localhost:8081")
    assert not pattern.match("https://evil.example")
