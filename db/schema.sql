CREATE TABLE beers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beer TEXT,
    image BLOB
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    color TEXT
);

INSERT INTO users VALUES (1, 'jari', '#CC5500');
INSERT INTO users VALUES (2, 'sara', '#188118');

CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beer_id INTEGER,
    user_id INTEGER,
    comment TEXT,
    date TEXT,
    FOREIGN KEY (beer_id) REFERENCES beers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);