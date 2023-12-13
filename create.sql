create schema hiago;

create table hiago.parked_car (
    id serial primary key,
    plate text not null,
    checkin_date timestamp default now(),
    checkout_date timestamp null
);