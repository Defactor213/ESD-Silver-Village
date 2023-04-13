-- Add database setup here
-- Add database setup here
drop database if exists movie;

create schema movie;

use movie;

DROP TABLE IF EXISTS `movie`;

CREATE TABLE IF NOT EXISTS `movie` (
  `movie_id` INT(11) AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(256) NOT NULL,
  `director` VARCHAR(256) NOT NULL,
  `cast` VARCHAR(1024) NOT NULL,
  `synopsis` text NOT NULL,
  `genre` VARCHAR(256) NOT NULL,
  `duration_min` INT(11) NOT NULL,
  `poster` VARCHAR(256) NOT NULL,
  `release_date` DATE NOT NULL,
  `rating` VARCHAR(256) NOT NULL,
  `language` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

INSERT INTO
  `movie` (
    `title`,
    `director`,
    `cast`,
    `synopsis`,
    `genre`,
    `duration_min`,
    `poster`,
    `release_date`,
    `rating`,
    `language`
  )
VALUES
  (
    'The Batman',
    'Matt Reeves',
    'Jeffrey Wright, Robert Pattinson, Zoe Kravitz',
    'The Riddler plays a deadly game of cat and mouse with Batman and Commissioner Gordon in Gotham City.',
    'Action, Adventure',
    176,
    'https://flxt.tmsimg.com/assets/p17013073_k_v13_ab.jpg',
    '2022-03-03',
    'PG13 - Some Violence and Drug References',
    'English'
  ),
  (
    'Uncharted',
    'Ruben Fleischer',
    'Tom Holland, Mark Wahlberg , Antonio Banderas',
    'Street-smart thief Nathan Drake (Tom Holland) is recruited by seasoned treasure hunter Victor "Sully" Sullivan (Mark Wahlberg) to recover a fortune lost by Ferdinand Magellan 500 years ago. What starts as a heist job for the duo becomes a globe-trotting, white-knuckle race to reach the prize before the ruthless Moncada (Antonio Banderas), who believes he and his family are the rightful heirs. If Nate and Sully can decipher the clues and solve one of the world\'s oldest mysteries, they stand to find $5 billion in treasure and perhaps even Nate\'s long-lost brother...but only if they can learn to work together.',
    'Action, Adventure',
    116,
    'https://flxt.tmsimg.com/assets/p19458781_v_v13_ad.jpg',
    '2022-02-17',
    'PG - Some Violence',
    'English'
  ),
  (
    'Spider-Man: No Way Home',
    'Jon Watts',
    'Benedict Cumberbatch, Zendaya, Tom Holland',
    'With Spider-Man''s identity now revealed, our friendly neighborhood web-slinger is unmasked and no longer able to separate his normal life as Peter Parker from the high stakes of being a superhero. When Peter asks for help from Doctor Strange, the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.',
    'Action, Adventure',
    148,
    'https://resizing.flixster.com/EO5p56c0oqHW_7gr4QDcDwJ9x2A=/ems.ZW1zLXByZC1hc3NldHMvbW92aWVzL2U5NGM0Y2Q1LTAyYTItNGFjNC1hNWZhLWMzYjJjOTdjMTFhOS5qcGc=',
    '2021-12-16',
    'PG - Some Violence',
    'English'
  ),
  (
    'Death on the Nile',
    'Kenneth Branagh',
    'Gal Gadot, Rose Leslie , Kenneth Branagh',
    'Belgian sleuth Hercule Poirot\'s Egyptian vacation aboard a glamorous river steamer turns into a terrifying search for a murderer when a picture-perfect couple\'s idyllic honeymoon is tragically cut short. Set against an epic landscape of sweeping desert vistas and the majestic Giza pyramids, this tale of unbridled passion and incapacitating jealousy features a cosmopolitan group of impeccably dressed travelers, and enough wicked twists and turns to leave audiences guessing until the final, shocking denouement.',
    'Mystery, Thriller',
    127,
    'https://resizing.flixster.com/T2N9zgvfcLehEt1EkYNrLRaNPXU=/ems.ZW1zLXByZC1hc3NldHMvbW92aWVzLzgzYTg5ODBlLWY5MzMtNGIyYi04MWU0LTMwZTgwYTUyYjIyMS5qcGc=',
    '2022-02-10',
    'PG13 - Some Mature Content and Sexual References',
    'English'
  ),
  (
    'Memory',
    'Martin Campbell',
    'Liam Neeson, Monica Bellucci, Guy Pearce',
    'An assassin-for-hire finds that he''s become a target after he refuses to complete a job for a dangerous criminal organization.',
    'Action, Thriller',
    149,
    'https://m.media-amazon.com/images/M/MV5BNTI4OTQzMmItOTJiZS00NTc3LTkxNGYtZWQ2NGJiNjQ4NzQ2XkEyXkFqcGdeQXVyMDA4NzMyOA@@._V1_QL75_UX180_CR0,2,180,266_.jpg',
    '2023-04-29',
    'R21 - Mature Content',
    'English'
  ),
  (
    'Morbius',
    'Daniel Espinosa',
    'Jared Leto, Matt Smith, Adria Arjona',
    'Biochemist Michael Morbius tries to cure himself of a rare blood disease, but he inadvertently infects himself with a form of vampirism instead.',
    'Action, Adventure, Horror',
    105,
    'https://m.media-amazon.com/images/M/MV5BYjlhNTA3Y2ItYjhiYi00NTBiLTg5MDMtZDJjMDZjNzVjNjJmXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg',
    '2022-03-31',
    'PG13 - Some Mature Content and Sexual References',
    'English'
  ),
  (
    'Fantastic Beasts: The Secrets of Dumbledore',
    'David Yates',
    'Ezra Miller, Mads Mikkelsen, Katherine Waterson',
    'The third installment of "Fantastic Beasts and Where to Find Them," which follows the continuing adventures of Newt Scamander.',
    'Adventure, Family, Fantasy',
    142,
    'https://m.media-amazon.com/images/M/MV5BZGQ1NjQyNDMtNzFlZS00ZGIzLTliMWUtNGJkMGMzNTBjNDg0XkEyXkFqcGdeQXVyMTE1NDI5MDQx._V1_.jpg',
    '2022-04-14',
    'PG13 - Some Mature Content and Sexual References',
    'English'
  ),
  (
    'Doctor Strange in the Multiverse of Madness',
    'Sam Raimi',
    'Benedict Cumberbatch, Rachel McAdams, Elizabeth Olsen',
    'Dr. Stephen Strange casts a forbidden spell that opens the doorway to the multiverse, including a alternate versions of himself, whose threat to humanity is too great for the combined forces of Strange, Wong, and Wanda Maximoff.',
    'Action, Adventure, Fantasy',
    126,
    'https://m.media-amazon.com/images/M/MV5BZDg5ZDg2MWQtM2ExNi00ZjEzLTgzMDQtZmJlYWEwYmM4ODUxXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
    '2022-05-06',
    'N/A',
    'English'
  );

COMMIT;