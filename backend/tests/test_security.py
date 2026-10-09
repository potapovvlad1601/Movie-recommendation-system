import pytest
from fastapi import HTTPException

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)


def test_hash_password_does_not_store_plain_password():
    password = "StrongPassword123"

    hashed_password = hash_password(password)

    assert hashed_password != password

def test_hash_password_produces_different_hashes():
    password = "StrongPassword123"

    first_hash = hash_password(password)
    second_hash = hash_password(password)

    # Соль может сделать хеши разными даже для одного пароля.
    assert first_hash != second_hash

def test_verify_password_accepts_correct_password():
    password = "StrongPassword123"
    hashed_password = hash_password(password)

    assert verify_password(password, hashed_password) is True

def test_verify_password_rejects_incorrect_password():
    hashed_password = hash_password("StrongPassword123")

    assert verify_password("WrongPassword123", hashed_password) is False

def test_decode_access_token_returns_user_id():
    user_id = 123

    token = create_access_token(user_id)
    decoded_user_id = decode_access_token(token)

    assert decoded_user_id == user_id

@pytest.mark.parametrize(
    "token",
    [
        "invalid-token",
        "",
        "header.payload.signature",
    ],
)

def test_decode_access_token_rejects_invalid_tokens(token):
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(token)

    assert exc_info.value.status_code == 401