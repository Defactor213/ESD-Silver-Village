CREATE TABLE IF NOT EXISTS `SEAT`(
	`SEATID` INT AUTO_INCREMENT NOT NULL,
    `SEATROW` VARCHAR(1) NOT NULL,
    `SEATNUMBER` INT NOT NULL,
    PRIMARY KEY (`SEATID`, `SEATROW`, `SEATNUMBER`)
);

-- seed data

DELIMITER //
CREATE PROCEDURE seed()
BEGIN
    SET @counter = 1;

    SET @alphaCounter = 65;

    WHILE (@alphaCounter < 78) DO
        WHILE (@counter <= 25) DO
            INSERT INTO `SEAT`(`SEATROW`, `SEATNUMBER`) VALUES (
                CHAR(@alphaCounter),
                @counter
            );

            SET @counter = @counter+1;
        END WHILE;

        SET @alphaCounter = @alphaCounter+1;
        SET @counter = 1;
    END WHILE;
END//

DELIMITER ;

call seed;

CREATE TABLE IF NOT EXISTS `BOOKING`(
	`BOOKINGID` INT AUTO_INCREMENT NOT NULL,
    `SHOWTIMEID` INT NOT NULL,
    `USERID` INT NOT NULL,
    `TRANSACTIONID` VARCHAR(100) DEFAULT NULL,
    `CONTACT` VARCHAR(30) NOT NULL,
    UNIQUE INDEX `bookings_unique` (`SHOWTIMEID`, `USERID`),
    PRIMARY KEY (`BOOKINGID`)
);

CREATE TABLE IF NOT EXISTS `BOOKING_SEAT`(
    `BOOKINGID` INT NOT NULL,
    `SEATID` INT NOT NULL,
    `SHOWTIMEID` INT NOT NULL,
    CONSTRAINT BOOKING_SEAT_FK1 FOREIGN KEY (BOOKINGID) REFERENCES BOOKING(BOOKINGID),
    CONSTRAINT BOOKING_SEAT_FK2 FOREIGN KEY (SEATID) REFERENCES SEAT(SEATID),
    UNIQUE INDEX `booking_seat_unique` (`SEATID`, `SHOWTIMEID`),
    PRIMARY KEY (`BOOKINGID`, `SEATID`, `SHOWTIMEID`)
);

-- create table movie(
-- 	movieid int not null primary key,
--     title char(60) not null
-- );
-- insert into movie values (10,"uncharted");


-- create table showtime(
-- 	showtimeid int not null,
--     movieid int not null,
--     transactionid int,
--     starttime DATETIME not null,
--     endtime DATETIME not null,
--     constraint showtime_pk primary key (showtimeid,movieid),
--     constraint showtime_fk1 foreign key (movieid) references movie (movieid),
-- );

-- insert into showtime value (100,10,1,"2022-02-28 13:00:00","2022-02-28 15:00:00");


-- create table user(
-- 	userid int not null primary key,
--     username varchar(20) not null,
--     password varchar(20) not null
-- );


-- insert into user value (5,"ali","express");



-- create table reservedseat(
-- 	reservedseatid int not null,
--     seatid int not null,
--     bookingid int not null,
--     showtimeid int not null,
--     constraint reservedseat_pk primary key (reservedseatid, seatid, bookingid, showtimeid),
--     constraint reservedseat_fk1 foreign key (seatid) references seat (seatid),
--     constraint reservedseat_fk2 foreign key (bookingid) references booking (bookingid),
--     constraint reservedseat_fk3 foreign key (showtimeid) references showtime (showtimeid)
-- );

-- insert into reservedseat value (4112,1000,10000,100);



