CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(255),
    bio         TEXT,
    pseudo      VARCHAR(255),
    photo       VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stories (
    id                  BIGSERIAL PRIMARY KEY,
    author_id           BIGINT NOT NULL REFERENCES users(id),
    title               VARCHAR(255) NOT NULL,
    content             TEXT,
    visibility          VARCHAR(20) NOT NULL,
    cover_image         VARCHAR(255),
    is_commentable      BOOLEAN NOT NULL DEFAULT TRUE,
    resume              TEXT,
    temps_lecture_calcul INT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE story_attachments (
    id         BIGSERIAL PRIMARY KEY,
    story_id   BIGINT NOT NULL REFERENCES stories(id),
    file_url   VARCHAR(255) NOT NULL,
    file_type  VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE folders (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    owner_id   BIGINT NOT NULL REFERENCES users(id),
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE circles (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    owner_id   BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE circle_members (
    circle_id BIGINT NOT NULL REFERENCES circles(id),
    user_id   BIGINT NOT NULL REFERENCES users(id),
    PRIMARY KEY (circle_id, user_id)
);

CREATE TABLE folder_shares (
    folder_id BIGINT NOT NULL REFERENCES folders(id),
    user_id   BIGINT NOT NULL REFERENCES users(id),
    shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (folder_id, user_id)
);

CREATE TABLE story_tags (
    story_id BIGINT NOT NULL REFERENCES stories(id),
    tag_id   BIGINT NOT NULL REFERENCES tags(id),
    PRIMARY KEY (story_id, tag_id)
);

CREATE TABLE story_circles (
    story_id  BIGINT NOT NULL REFERENCES stories(id),
    circle_id BIGINT NOT NULL REFERENCES circles(id),
    PRIMARY KEY (story_id, circle_id)
);

CREATE TABLE folder_stories (
    folder_id BIGINT NOT NULL REFERENCES folders(id),
    story_id  BIGINT NOT NULL REFERENCES stories(id),
    PRIMARY KEY (folder_id, story_id)
);

CREATE TABLE story_reads (
    id            BIGSERIAL PRIMARY KEY,
    story_id      BIGINT NOT NULL REFERENCES stories(id),
    user_id       BIGINT NOT NULL REFERENCES users(id),
    temps_lecture INT,
    read_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE story_interests (
    story_id   BIGINT NOT NULL REFERENCES stories(id),
    user_id    BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, user_id)
);

CREATE TABLE story_ratings (
    id         BIGSERIAL PRIMARY KEY,
    story_id   BIGINT NOT NULL REFERENCES stories(id),
    user_id    BIGINT NOT NULL REFERENCES users(id),
    rating     INT,
    comment    TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_histories (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id),
    search_query VARCHAR(255) NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
