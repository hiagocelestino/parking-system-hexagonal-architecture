import Checkin from "../src/Checkin";
import Checkout from "../src/Checkout";
import GetParkedCars from "../src/GetParkedCars";
import ParkedCarDatabaseRepository from "../src/ParkedCarDatabaseRepository";

test.skip("Deve fazer um checkin", async function () {
    const ParkedCarRepository = new ParkedCarDatabaseRepository();
    const checkin = new Checkin(ParkedCarRepository);
    const inputCheckin = {
        plate: "AAA-9999",
        checkinDate: "2022-03-01T10:00:00-03:00"
    }

    await checkin.execute(inputCheckin);

    const getParkedCars = new GetParkedCars(ParkedCarRepository);
    const parkedCars = await getParkedCars.execute();
    expect(parkedCars).toHaveLength(1);

    const inputCheckout = {
        plate: "AAA-9999",
        checkoutDate: "2022-03-01T12:00:00-03:00"
    }
    const checkout = new Checkout(ParkedCarRepository);
    const ticket = await checkout.execute(inputCheckout);
    expect(ticket.period).toBe(2);
    expect(ticket.price).toBe(20);

})