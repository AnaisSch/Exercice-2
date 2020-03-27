CREATE TABLE node_articles ( id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(256) NOT NULL, content TEXT NOT NULL, author INT NOT NULL, created_at DATETIME NOT NULL ); 

CREATE TABLE node_comments ( id INT PRIMARY KEY AUTO_INCREMENT, article_id INT NOT NULL, author INT NOT NULL, content TEXT NOT NULL, created_at DATETIME NOT NULL, FOREIGN KEY (article_id) REFERENCES node_articles(id)); 

