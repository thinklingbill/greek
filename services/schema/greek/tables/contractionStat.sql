DROP TABLE IF EXISTS greek.contractionStat;

CREATE TABLE greek.contractionStat (
  userId int not null,
  contractionId int not null,
  correctCount int,
  missedCount int,
  PRIMARY KEY (userId, contractionId)
);

