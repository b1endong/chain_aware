CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE attestation_type AS ENUM ('issued', 'used', 'expired');
CREATE TABLE users (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username              text NOT NULL,
    email                 text NOT NULL UNIQUE,
    role                  user_role NOT NULL DEFAULT 'user',
    password_hash         text NOT NULL,
    wallet_address        text UNIQUE,
    is_simulated          boolean NOT NULL DEFAULT false,
    created_at            timestamptz DEFAULT now()
);

CREATE TABLE modules (
    id                    smallint PRIMARY KEY,
    slug                  text NOT NULL UNIQUE, 
    title                 text NOT NULL,
    body_md               text NOT NULL,  
    iso27001              text[] NOT NULL DEFAULT '{}',
    soc2                  text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE questions (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id             smallint NOT NULL REFERENCES modules(id),
    prompt                text NOT NULL,
    topic                 text NOT NULL,
    explanation           text NOT NULL
);

CREATE TABLE options (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id           uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    label                 text NOT NULL,
    is_correct            boolean NOT NULL DEFAULT false
);

CREATE TABLE enrollments (
    user_id               uuid NOT NULL REFERENCES users(id),
    module_id             smallint NOT NULL REFERENCES modules(id),
    enrolled_at           timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, module_id)
);

CREATE TABLE quiz_attempts (
    id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               uuid NOT NULL REFERENCES users(id),
    module_id             smallint NOT NULL REFERENCES modules(id),
    score                 smallint NOT NULL CHECK (score BETWEEN 0 AND 100), 
    passed                boolean NOT NULL,
    attempted_at          timestamptz DEFAULT now()
);

CREATE TABLE attempt_answers (
    attempt_id            uuid NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id           uuid NOT NULL REFERENCES questions(id),
    option_id             uuid NOT NULL REFERENCES options(id),
    is_correct            boolean NOT NULL,
    PRIMARY KEY (attempt_id, question_id)
);

CREATE TABLE attestations (
    nonce                 numeric(78) PRIMARY KEY,
    user_id               uuid NOT NULL REFERENCES users(id),
    module_id             smallint NOT NULL REFERENCES modules(id),
    score                 smallint NOT NULL CHECK (score BETWEEN 0 AND 100),
    deadline              timestamptz NOT NULL,
    signature             text NOT NULL,
    tx_hash               text,
    type                  attestation_type NOT NULL DEFAULT 'issued',
    created_at            timestamptz NOT NULL DEFAULT now()
);


