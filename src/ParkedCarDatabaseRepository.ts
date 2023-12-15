import pgp from "pg-promise";
import ParkedCar from "./ParkedCar";
import ParkedCarRepository from "./ParkedCarRepository";

export default class ParkedCarDatabaseRepository implements ParkedCarRepository {

    async save(parkedCar: ParkedCar): Promise<void> {
        const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
        await connection.query('insert into hiago.parked_car(plate, checkin_date) values($1, $2)', [parkedCar.plate, parkedCar.checkinDate]);
        await connection.$pool.end();
    }

    async update(parkedCar: ParkedCar): Promise<void> {
        const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
        await connection.query('update hiago.parked_car set checkout_date = now() where plate = $1', [parkedCar.plate]);
        await connection.$pool.end();
    }

    async list(): Promise<ParkedCar[]> {
        const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
        const parkedCarsData = await connection.query('select * from hiago.parked_car where checkout_date is null', []);
        await connection.$pool.end();
        const parkedCars: ParkedCar[] = [];
        for (const parkedCarData of parkedCarsData) {
            parkedCars.push(new ParkedCar(
                parkedCarData.plate,
                new Date (parkedCarData.checkin_date),
                new Date (parkedCarData.checkoutDate)
            ))
        }

        return parkedCars;
    }
    
    async get(plate: string): Promise<ParkedCar> {
        const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
        const parkedCarData = await connection.one('select * from hiago.parked_car where plate = $1 and checkout_date is null', [plate]);
        await connection.$pool.end();

        const parkedCar = new ParkedCar(
            parkedCarData.plate, new Date(parkedCarData.checkin_date), new Date(parkedCarData.checkout_date)
        );

        return parkedCar;
    }

}

