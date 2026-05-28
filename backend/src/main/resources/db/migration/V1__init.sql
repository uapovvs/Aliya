CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(200) NOT NULL,
    position      VARCHAR(200),
    avatar_url    VARCHAR(500),
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN', 'PARTICIPANT')),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL UNIQUE REFERENCES users(id),
    title        VARCHAR(300) NOT NULL,
    description  TEXT,
    start_date   DATE,
    finish_date  DATE,
    result_type  VARCHAR(50),
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE dmaic_stages (
    id            BIGSERIAL PRIMARY KEY,
    project_id    BIGINT      NOT NULL REFERENCES projects(id),
    stage         VARCHAR(10) NOT NULL CHECK (stage IN ('D', 'M_A', 'I', 'C')),
    content       JSONB,
    status        VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                              CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),
    admin_score   INT         CHECK (admin_score BETWEEN 0 AND 100),
    admin_comment TEXT,
    deadline      DATE,
    submitted_at  TIMESTAMP,
    reviewed_at   TIMESTAMP,
    UNIQUE (project_id, stage)
);

-- Seed admin account (password: Admin123!)
INSERT INTO users (username, password_hash, full_name, role)
VALUES ('admin', '$2a$12$dT2ULcpNfQqMmVFxl5g3guFzjriU1kIUMWr6D3VwFJk23cVzW0UWG', 'Администратор', 'ADMIN');
