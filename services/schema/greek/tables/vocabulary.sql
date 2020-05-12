DROP TABLE IF EXISTS greek.vocabulary;

CREATE TABLE greek.vocabulary (
  vocabularyId INT NOT NULL AUTO_INCREMENT,
  lemma varchar(100),
  transliteration TEXT,
  frequencyCount int,
  definition TEXT,
  PRIMARY KEY (vocabularyId)
);
    
ALTER TABLE greek.vocabulary 
ADD UNIQUE INDEX ixLemma USING BTREE (lemma);
  