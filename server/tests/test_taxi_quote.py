from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app
from app.services.routing import DrivingRoute, RouteNotFound

client = TestClient(app)


def test_quote_rejects_far_away():
    response = client.get(
        "/api/taxi/quote",
        params={
            "from_lat": 48.14,
            "from_lng": 11.58,
            "to_lat": 47.66,
            "to_lng": 9.17,
        },
    )
    assert response.status_code == 422


def test_quote_rejects_same_point():
    response = client.get(
        "/api/taxi/quote",
        params={
            "from_lat": 47.6602,
            "from_lng": 9.1758,
            "to_lat": 47.6602,
            "to_lng": 9.1758,
        },
    )
    assert response.status_code == 400


@patch("app.api.routes.taxi.driving_route", new_callable=AsyncMock)
def test_quote_returns_fare_and_path(mock_route):
    mock_route.return_value = DrivingRoute(
        distance_m=2100,
        duration_s=420,
        path=[[9.17, 47.66], [9.18, 47.67]],
    )
    response = client.get(
        "/api/taxi/quote",
        params={
            "from_lat": 47.6602,
            "from_lng": 9.1758,
            "to_lat": 47.6680,
            "to_lng": 9.1800,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["distance_m"] == 2100
    assert body["duration_s"] == 420
    assert body["fare_eur"] >= 5
    assert body["path"][0] == [9.17, 47.66]
    assert "Meter is final" in body["disclaimer"]


@patch("app.api.routes.taxi.driving_route", new_callable=AsyncMock)
def test_quote_no_route(mock_route):
    mock_route.side_effect = RouteNotFound("none")
    response = client.get(
        "/api/taxi/quote",
        params={
            "from_lat": 47.6602,
            "from_lng": 9.1758,
            "to_lat": 47.6680,
            "to_lng": 9.1800,
        },
    )
    assert response.status_code == 404
