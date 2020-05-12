DROP TABLE IF EXISTS greek.contraction;

CREATE TABLE greek.contraction (
  contractionId INT NOT NULL AUTO_INCREMENT,
  sequence1 INT,
  sequence2 INT,
  firstElement VARCHAR(10) NOT NULL,
  secondElement VARCHAR(10) NOT NULL,
  genuineSpurious CHAR(1) NOT NULL,
  result VARCHAR(10) NOT NULL,
  PRIMARY KEY (contractionId));
  
ALTER TABLE greek.contraction 
ADD UNIQUE INDEX ixEntry USING BTREE (firstElement ASC, secondElement ASC, genuineSpurious ASC);
  