create database chess;
use chess;
drop table if exists users;
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,	
  name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  primary key(id)
);
select * from users;
ALTER TABLE users 
ADD COLUMN avatar VARCHAR(255) DEFAULT '/Chess/uploads/default.png';