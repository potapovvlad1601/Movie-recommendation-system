import pytest
from pydantic import ValidationError

from app.schemas.user import UserCreate


def test_user_create_accepts_valid_data():
    user = UserCreate(
        username="testuser",
        email="test@example.com",
        password="StrongPassword123",
    )

    assert user.username == "testuser"
    assert user.email == "test@example.com"
    assert user.password == "StrongPassword123"

@pytest.mark.parametrize(
    "password",
    [
        "",
        "short",
        "1234567",
    ],
)
def test_user_create_rejects_short_password(password):
    with pytest.raises(ValidationError):
        UserCreate(
            username="testuser",
            email="test@example.com",
            password=password,
        )

def test_user_create_accepts_minimum_password_length():
    user = UserCreate(
        username="testuser",
        email="test@example.com",
        password="a" * 8,
    )

    assert len(user.password) == 8

def test_user_create_accepts_maximum_password_length():
    user = UserCreate(
        username="testuser",
        email="test@example.com",
        password="a" * 128,
    )

    assert len(user.password) == 128

def test_user_create_rejects_password_longer_than_128_characters():
    with pytest.raises(ValidationError):
        UserCreate(
            username="testuser",
            email="test@example.com",
            password="a" * 129,
        )

def test_user_create_rejects_invalid_email():
    with pytest.raises(ValidationError):
        UserCreate(
            username="testuser",
            email="not-an-email",
            password="StrongPassword123",
        )