from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints


NonEmptyText = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
    ),
]


class PodcastScript(BaseModel):
    """
    Structured podcast script returned by the language model.
    """

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    episode_title: NonEmptyText
    opening_hook: NonEmptyText
    book_introduction: NonEmptyText
    book_journey: NonEmptyText
    chapter_one_story: NonEmptyText
    core_lesson: NonEmptyText

    key_takeaways: list[NonEmptyText] = Field(
        min_length=2,
        max_length=5,
    )

    reflection_question: NonEmptyText
    listener_action: NonEmptyText
    closing_teaser: NonEmptyText