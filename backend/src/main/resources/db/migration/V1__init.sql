CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name  VARCHAR(255),
    pseudo        VARCHAR(255),
    photo         VARCHAR(255),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stories (
    id           BIGSERIAL PRIMARY KEY,
    author_id    BIGINT NOT NULL REFERENCES users(id),
    title        VARCHAR(255) NOT NULL,
    content      TEXT,
    resume       TEXT,
    cover_image  VARCHAR(255),
    visibility   VARCHAR(20) NOT NULL,
    main_theme   VARCHAR(50),
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE folders (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    owner_id   BIGINT NOT NULL REFERENCES users(id),
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE circles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id    BIGINT NOT NULL REFERENCES users(id),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friend_requests (
    id          BIGSERIAL PRIMARY KEY,
    sender_id   BIGINT NOT NULL REFERENCES users(id),
    receiver_id BIGINT NOT NULL REFERENCES users(id),
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE circle_members (
    circle_id BIGINT NOT NULL REFERENCES circles(id),
    user_id   BIGINT NOT NULL REFERENCES users(id),
    PRIMARY KEY (circle_id, user_id)
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

CREATE TABLE story_interests (
    story_id   BIGINT NOT NULL REFERENCES stories(id),
    user_id    BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, user_id)
);
