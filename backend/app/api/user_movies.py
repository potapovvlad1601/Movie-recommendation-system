from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.user_movie import UserMovie
from app.schemas.user_movie import ( UserMovieListResponse, RatingUpdate, UserMovieResponse,)

router = APIRouter(
    prefix="/api/users/me",
    tags=["User Movies"],
)


# Favirites

@router.post(
    "/favorites/{movie_id}",
    response_model=UserMovieResponse,
    status_code=status.HTTP_200_OK,
)
def add_to_favorites(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.movie_id == movie_id,
    ).first()

    if user_movie is None:
        user_movie = UserMovie(
            user_id=current_user.id,
            movie_id=movie_id,
            is_favorite=True,
        )
        db.add(user_movie)
    else:
        user_movie.is_favorite = True

    db.commit()
    db.refresh(user_movie)

    return user_movie

@router.delete(
    "/favorites/{movie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_from_favorites(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.movie_id == movie_id,
    ).first()

    if user_movie is None or not user_movie.is_favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found in favorites",
        )

    user_movie.is_favorite = False

    if not user_movie.in_watchlist and user_movie.rating is None:
        db.delete(user_movie)

    db.commit()

@router.get(
    "/favorites",
    response_model=UserMovieListResponse,
)
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.is_favorite.is_(True),
    )

    items = query.order_by(UserMovie.created_at.desc()).all()

    return {
        "items": items,
        "total": len(items),
    }


# Watchlist

@router.post(
    "/watchlist/{movie_id}",
    response_model=UserMovieResponse,
    status_code=status.HTTP_200_OK,
)
def add_to_watchlist(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.movie_id == movie_id,
    ).first()

    if user_movie is None:
        user_movie = UserMovie(
            user_id=current_user.id,
            movie_id=movie_id,
            in_watchlist=True,
        )
        db.add(user_movie)
    else:
        user_movie.in_watchlist = True

    db.commit()
    db.refresh(user_movie)

    return user_movie

@router.delete(
    "/watchlist/{movie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_from_watchlist(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.movie_id == movie_id,
    ).first()

    if user_movie is None or not user_movie.in_watchlist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found in watchlist",
        )

    user_movie.in_watchlist = False

    if not user_movie.is_favorite and user_movie.rating is None:
        db.delete(user_movie)

    db.commit()

@router.get(
    "/watchlist",
    response_model=UserMovieListResponse,
)
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.in_watchlist.is_(True),
    )

    items = query.order_by(UserMovie.created_at.desc()).all()

    return {
        "items": items,
        "total": len(items),
    }


# Ratings

@router.put(
    "/ratings/{movie_id}",
    response_model=UserMovieResponse,
)
def rate_movie(
    movie_id: int,
    rating_data: RatingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.movie_id == movie_id,
    ).first()

    if user_movie is None:
        user_movie = UserMovie(
            user_id=current_user.id,
            movie_id=movie_id,
            rating=rating_data.rating,
        )
        db.add(user_movie)
    else:
        user_movie.rating = rating_data.rating

    db.commit()
    db.refresh(user_movie)

    return user_movie

@router.get(
    "/ratings",
    response_model=UserMovieListResponse,
)
def get_ratings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.rating.is_not(None),
    )

    items = query.order_by(UserMovie.updated_at.desc()).all()

    return {
        "items": items,
        "total": len(items),
    }

@router.delete(
    "/ratings/{movie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_rating(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_movie = db.query(UserMovie).filter(
        UserMovie.user_id == current_user.id,
        UserMovie.movie_id == movie_id,
    ).first()

    if user_movie is None or user_movie.rating is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rating not found",
        )

    user_movie.rating = None

    if not user_movie.is_favorite and not user_movie.in_watchlist:
        db.delete(user_movie)

    db.commit()