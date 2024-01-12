CREATE TABLE users (
    _id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passwords (
  user_id INTEGER UNIQUE NOT NULL,
  hashed_psw VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(_id)
);

CREATE TABLE designs (
  _id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) DEFAULT 'Untitled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(_id)
);

CREATE TABLE components (
  _id SERIAL PRIMARY KEY,
  design_id INTEGER NOT NULL,
  parent_id INTEGER,
  name VARCHAR(255) NOT NULL,
  html_tag VARCHAR(255) DEFAULT '<div>',
  inner_html VARCHAR(255) DEFAULT '',
  x_position INTEGER,
  y_position INTEGER, 
  z_index INTEGER,
  props VARCHAR(255),
  hooks VARCHAR(255),
  style VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (design_id) REFERENCES designs(_id),
  FOREIGN KEY (parent_id) REFERENCES components(_id)
);