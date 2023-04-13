drop database if exists bookings;
create schema bookings;
use bookings;

create table movie(
	movieid int not null primary key,
    title char(60) not null
);
# id in tenths
insert into movie values (10,"uncharted");

create table hall(
	hallid int not null primary key,
    noofseats int not null
);

#id in singles
insert into hall value (1,30);

create table screening(
	screeningid int not null,
    movieid int not null,
    hallid int not null,
    transactionid int,
    starttime DATETIME not null,
    endtime DATETIME not null,
    constraint screening_pk primary key (screeningid,movieid,hallid),
    constraint screening_fk1 foreign key (movieid) references movie (movieid),
    constraint screening_fk2 foreign key (hallid) references hall (hallid)
);

#id in hundreds
insert into screening value (100,10,1,"2022-02-28 13:00:00","2022-02-28 15:00:00");

create table seat(
	seatid int not null,
    hallid int not null,
    seatrow varchar(1) not null,
    seatnumber int not null,
    constraint seat_pk primary key (seatid,hallid),
    constraint seat_fk foreign key (hallid) references hall (hallid)
);

#id in thousands
insert into seat value (1000,1,"A",10);

create table user(
	userid int not null primary key,
    username varchar(20) not null,
    password varchar(20) not null
);


insert into user value (5,"ali","express");

create table booking(
	bookingid int not null,
    screeningid int not null,
    userid int not null,
    contact varchar(30) not null,
    constraint booking_pk primary key (bookingid,screeningid,userid),
    constraint booking_fk1 foreign key (screeningid) references screening (screeningid),
    constraint booking_fk2 foreign key (userid) references user (userid)
);

#bookingid in ten of thousand
insert into booking value (10000,100,5,"alieexpress@hotmail.com");

create table reservedseat(
	reservedseatid int not null,
    seatid int not null,
    bookingid int not null,
    screeningid int not null,
    constraint reservedseat_pk primary key (reservedseatid, seatid, bookingid, screeningid),
    constraint reservedseat_fk1 foreign key (seatid) references seat (seatid),
    constraint reservedseat_fk2 foreign key (bookingid) references booking (bookingid),
    constraint reservedseat_fk3 foreign key (screeningid) references screening (screeningid)
);

insert into reservedseat value (4112,1000,10000,100);



