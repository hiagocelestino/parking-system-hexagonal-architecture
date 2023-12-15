import ParkedCarRepository from "./ParkedCarRepository";

export default class Checkout {
    constructor (readonly parkedCarRepository: ParkedCarRepository) {

    }

    async execute(input: Input): Promise<Output> {
        const parkedCar = await this.parkedCarRepository.get(input.plate);
        const checkinDate = new Date(parkedCar.checkinDate);
        const checkoutDate = new Date(input.checkoutDate);

        const diff = (checkoutDate.getTime() - checkinDate.getTime()) / (1000*60*60);
        const price = diff * 10;
        await this.parkedCarRepository.update(parkedCar);

        return {
            price,
            period: diff
        }
    }
}

type Input = {
    plate: string,
    checkoutDate: string
}

type Output = {
    price: number,
    period: number
}