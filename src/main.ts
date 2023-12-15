import express, {Request, response, Response } from "express";
import Checkin from "./Checkin";
import GetParkedCars from "./GetParkedCars";
import Checkout from "./Checkout";
import ParkedCarDatabaseRepository from "./ParkedCarDatabaseRepository";
import PostgreSQLAdapter from "./PostgreSQLAdapter";

const app = express();
const connection = new PostgreSQLAdapter();
const ParkedCarRepository = new ParkedCarDatabaseRepository(connection);

app.use(express.json());
app.post("/checkin", async function (request: Request, response: Response) {
    const checkin = new Checkin(ParkedCarRepository);
    await checkin.execute({ plate: request.body.plate, checkinDate: request.body.checkinDate});
    response.end();
});
app.get("/parked_cars", async function (request: Request, response: Response) {
    const getParkedCars = new GetParkedCars(ParkedCarRepository);
    const parkedCars = await getParkedCars.execute();

    response.json(parkedCars);
});
app.post("/checkout", async function (request: Request, response: Response) {
    const checkout = new Checkout(ParkedCarRepository);
    const ticket = await checkout.execute({
        plate: request.body.plate,
        checkoutDate: request.body.checkoutDate
    });

    response.json(ticket);
});


app.listen(3000);