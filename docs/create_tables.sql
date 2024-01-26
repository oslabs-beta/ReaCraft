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
  FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

CREATE TABLE designs (
  _id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(255) DEFAULT 'Untitled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(_id) ON DELETE CASCADE
);

CREATE TABLE collaborators (
  design_id INTEGER NOT NULL,
  collaborator_id INTEGER NOT NULL,
  can_edit BOOLEAN NOT NULL,
  FOREIGN KEY (design_id) REFERENCES designs(_id),
  FOREIGN KEY (collaborator_id) REFERENCES users(_id)
);

CREATE TABLE pages (
  _id SERIAL PRIMARY KEY,
  design_id INTEGER NOT NULL,
  index INTEGER NOT NULL,
  image_url VARCHAR(255),
  FOREIGN KEY (design_id) REFERENCES designs(_id) ON DELETE CASCADE
);

CREATE TABLE components (
  _id SERIAL PRIMARY KEY,
  page_id INTEGER NOT NULL,
  parent_id INTEGER,
  index INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  html_tag VARCHAR(255) DEFAULT '<div>',
  inner_html VARCHAR(255) DEFAULT '',
  props VARCHAR(255) DEFAULT '{}',
  styles VARCHAR(255) DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (page_id) REFERENCES pages(_id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES components(_id)
);

CREATE TABLE rectangles (
  component_id INTEGER NOT NULL,
  x_position DECIMAL(10, 2) DEFAULT 0,
  y_position DECIMAL(10, 2) DEFAULT 0,
  z_index INTEGER DEFAULT 0,
  width DECIMAL(10, 2) DEFAULT 100,
  height DECIMAL(10, 2) DEFAULT 100,
  border_width INT DEFAULT 3,
  border_radius VARCHAR(255),
  stroke VARCHAR(255) DEFAULT 'black',
  background_color VARCHAR(255),
  FOREIGN KEY (component_id) REFERENCES components(_id) ON DELETE CASCADE
);