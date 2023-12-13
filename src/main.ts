import express, {Request, response, Response } from "express";
import pgp from "pg-promise";

const app = express();

app.use(express.json());
app.post("/checkin", async function (request: Request, respose: Response) {
    const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
    console.log(request.body);
    await connection.query('insert into hiago.parked_car(plate, checkin_date) values($1, $2)', [request.body.plate, request.body.checkinDate]);
    await connection.$pool.end();

    respose.end();
});
app.get("/parked_cars", async function (request: Request, respose: Response) {
    const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
    const parkedCars = await connection.query('select * from hiago.parked_car where checkout_date is null', []);
    await connection.$pool.end();

    respose.json(parkedCars);
});
app.post("/checkout", async function (request: Request, respose: Response) {
    const connection = pgp() ("postgres://postgres:12345678@localhost:5432/app");
    console.log(request.body);
    const parkedCar = await connection.one('select * from hiago.parked_car where plate = $1 and checkout_date is null', [request.body.plate]);
    
    const checkinDate = new Date(parkedCar.checkin_date);
    const checkoutDate = new Date(request.body.checkoutDate);

    const diff = (checkoutDate.getTime() - checkinDate.getTime()) / (1000*60*60);
    console.log(diff);
    
    const price = diff * 10;

    await connection.query('update hiago.parked_car set checkout_date = now() where plate = $1', [request.body.plate]);
    await connection.$pool.end();

    respose.json({
        price,
        period: diff
    });
});


app.listen(3000);