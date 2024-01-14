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
  props VARCHAR(255),
  styles VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (design_id) REFERENCES designs(_id),
  FOREIGN KEY (parent_id) REFERENCES components(_id)
);

CREATE TABLE rectangles (
  component_id INTEGER NOT NULL,
  x_position VARCHAR(255),
  y_position VARCHAR(255),
  z_index INTEGER,
  width VARCHAR(255),
  height VARCHAR(255),
  isResizable BOOLEAN DEFAULT TRUE,
  borderWidth VARCHAR(255),
  borderRadius VARCHAR(255),
  stroke VARCHAR(255),
  backgroundColor VARCHAR(255),
  FOREIGN KEY (component_id) REFERENCES componet(_id)
);