import httpStatus from "http-status";
import supertest from "supertest";
import app from "../src/app";
import { cleanDb } from "./helpers";
import { faker } from "@faker-js/faker";

const api = supertest(app)

beforeAll(async () => {

    await cleanDb();

});

describe("POST /sign-up", () => {
    it("should respond with status 400 when body is not given", 
    async () => {

        const response = await api.post("/sign-up");

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        
    });

    it("should respond with status 400 when body is not valid", 
    async () => {
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

        const response = await api.post("/sign-up").send(invalidBody);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {

        const generateValidBody = () => ({
            email: faker.internet.email(),
            password: faker.internet.password(6),
        });

        it("should respond with status 400 when password has less than 10 numbers", async () => {
            const body = generateValidBody();

            const response = await api.post("/sign-up").send(body);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

    });

});


describe("POST /sign-in", () => {

    it("should respond with status 400 when body is not given",
        async () => {

            const response = await api.post("/sign-in");

            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        });

    it("should respond with status 400 when body is not valid",
        async () => {

            const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

            const response = await api.post("/sign-in").send(invalidBody);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        });

});

describe("when body is valid", () => {
});
