CREATE TABLE users (
    _id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_image VARCHAR(255),
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
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  image_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(_id)
);

CREATE TABLE components (
  _id SERIAL PRIMARY KEY,
  design_id INTEGER NOT NULL,
  parent_id INTEGER,
  index INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  html_tag VARCHAR(255) DEFAULT '<div>',
  inner_html VARCHAR(255) DEFAULT '',
  props VARCHAR(255) DEFAULT '{}',
  styles VARCHAR(255) DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (design_id) REFERENCES designs(_id),
  FOREIGN KEY (parent_id) REFERENCES components(_id)
);

CREATE TABLE rectangles (
  component_id INTEGER NOT NULL,
  x_position DECIMAL(10, 2) DEFAULT 0,
  y_position DECIMAL(10, 2) DEFAULT 0,
  z_index INTEGER DEFAULT 0,
  width DECIMAL(10, 2) DEFAULT 100,
  height DECIMAL(10, 2) DEFAULT 100,
  borderWidth INT DEFAULT 3,
  borderRadius VARCHAR(255),
  stroke VARCHAR(255) DEFAULT 'black',
  backgroundColor VARCHAR(255),
  FOREIGN KEY (component_id) REFERENCES components(_id)
);