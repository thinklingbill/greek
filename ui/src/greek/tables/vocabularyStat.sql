DROP TABLE IF EXISTS greek.vocabularyStat;

CREATE TABLE greek.vocabularyStat (
  userId int not null,
  vocabularyId int not null,
  correctCount int,
  missedCount int,
  PRIMARY KEY (userId, vocabularyId)
);
  