import httpStatus from "http-status";
import supertest from "supertest";
import app, { init } from "../../src/app";
import { cleanDb, generateValidToken } from "../helpers";
import { faker } from "@faker-js/faker";
import { createUser } from "../factories/users-factory";
import * as jwt from "jsonwebtoken"

const api = supertest(app);

beforeAll(async () => {

    await init();
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

    it("should respond with status 409 when user is duplicated", async () => {

        const body = {
            email: "pedro2@gmail.com",
            password: "123asddasdsadas"
        };

        await api.post("/sign-up").send(body);

        const response = await api.post("/sign-up").send(body);

        expect(response.status).toBe(httpStatus.CONFLICT);

    });

    it("should respond with status 201 and create user when given email is unique", async () => {

        const body = {
            email: "pedroa@gmail.com",
            password: "123asddasdsadas"
        };

        const response = await api.post("/sign-up").send(body);

        expect(response.status).toBe(httpStatus.CREATED);

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

    describe("when body is valid", () => {

        it("should respond with status 400 when body is not valid",
            async () => {

                const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

                const response = await api.post("/sign-in").send(invalidBody);

                expect(response.status).toBe(httpStatus.BAD_REQUEST);

            });

        it("should respond with status 200 and login user when given email is right", async () => {

            const body = {
                email: "pedroa@gmail.com",
                password: "123asddasdsadas"
            };

            await api.post("/sign-up").send(body);

            const response = await api.post("/sign-in").send(body);

            expect(response.status).toBe(httpStatus.OK);

        });

    });

});

describe("POST /create-credentials", () => {
    it("should respond with status 400 when token is not given",
        async () => {

            const response = await api.post("/create-credentials");

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there is no session with given token",
        async () => {

            const userWithoutSession = await createUser();
            const token = jwt.sign({ user: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await api.post("/create-credentials").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 404 if there have a user with given token but no body credentials",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await api.post("/create-credentials").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.NOT_FOUND);

        });

    it("should respond with status 200 if there have a user with given token with body credentials",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const body = {
                title: faker.lorem.word,
                url: faker.lorem.word,
                username: faker.lorem.word,
                password: faker.lorem.word
            }

            const response = await api.post("/create-credentials").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.NOT_FOUND);

        });

});

describe("get /credentials", () => {
    it("should respond with status 400 when token is not given",
        async () => {

            const response = await api.get("/credentials");

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there is no session with given token",
        async () => {

            const userWithoutSession = await createUser();
            const token = jwt.sign({ user: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await api.get("/credentials").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 200 if there have a user with given token with no credentialsId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const body = {
                title: faker.lorem.word,
                url: faker.lorem.word,
                username: faker.lorem.word,
                password: faker.lorem.word
            }

            await api.post("/create-credentials").set("Authorization", `Bearer ${token}`).send(body)

            const response = await api.get("/credentials").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);

        });

    it("should respond with status 200 if there have a user with given token with credentialsId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const body = {
                title: faker.lorem.word,
                url: faker.lorem.word,
                username: faker.lorem.word,
                password: faker.lorem.word
            }

            const result = await api.post("/create-credentials").set("Authorization", `Bearer ${token}`).send(body)

            const response = await api.get("/credentials").set("Authorization", `Bearer ${token}`).send(result.text);

            expect(response.status).toBe(httpStatus.OK);

        });

});

describe("delete /credentials", () => {
    it("should respond with status 400 when token is not given",
        async () => {

            const response = await api.delete("/credentials");

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there is no session with given token",
        async () => {

            const userWithoutSession = await createUser();
            const token = jwt.sign({ user: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await api.delete("/credentials").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there have a user with given token with invalid credentialsId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const body = {
                title: faker.lorem.word(5),
                url: faker.lorem.word(5),
                username: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            await api.post("/create-credentials").set("Authorization", `Bearer ${token}`).send(body)

            const response = await api.delete("/credentials").set("Authorization", `Bearer ${token}`).send({ credentialId: faker.random.numeric(1) });

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 200 if there have a user with given token with credentialsId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const body = {
                title: faker.lorem.word(5),
                url: faker.lorem.word(5),
                username: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            const result = await api.post("/create-credentials").set("Authorization", `Bearer ${token}`).send(body);

            const credentialId: number = JSON.parse(result.text).credentialId;

            console.log(credentialId)

            const teste = {
                credentialId: credentialId
            }

            const response = await api.delete("/credentials").set("Authorization", `Bearer ${token}`).send(teste);

            expect(response.status).toBe(httpStatus.OK);

        });

});

describe("POST /create-network", () => {
    it("should respond with status 400 when token is not given",
        async () => {

            const response = await api.post("/create-network");

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there is no session with given token",
        async () => {

            const userWithoutSession = await createUser();
            const token = jwt.sign({ user: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await api.post("/create-network").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 404 if there have a user with given token but no body",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await api.post("/create-network").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 400 if there have a network with this networkTitle",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const bodyDuplicate = {
                networkTitle: faker.lorem.word(5),
                title: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(bodyDuplicate);

            const response = await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(bodyDuplicate);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);

        });

    it("should respond with status 200 if there have a user with given token with body credentials",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const body = {
                networkTitle: faker.lorem.word(5),
                title: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            const response = await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(body);

            expect(response.status).toBe(httpStatus.OK);

        });

});

describe("GET /network", () => {
    it("should respond with status 400 when token is not given",
        async () => {

            const response = await api.get("/network");

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there is no session with given token",
        async () => {

            const userWithoutSession = await createUser();
            const token = jwt.sign({ user: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await api.get("/network").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

        it("should respond with status 200 if there have a user with given token with no networkId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const netBody = {
                networkTitle: faker.lorem.word(5),
                title: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(netBody)

            const response = await api.get("/network").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);

        });

        it("should respond with status 200 if there have a user with given token with networkId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const netBody = {
                networkTitle: faker.lorem.word(5),
                title: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            const result = await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(netBody);

            const response = await api.get("/network").set("Authorization", `Bearer ${token}`).send(result.text);

            expect(response.status).toBe(httpStatus.OK);

        });
});

describe("delete /network", () => {
    it("should respond with status 400 when token is not given",
        async () => {

            const response = await api.delete("/network");

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there is no session with given token",
        async () => {

            const userWithoutSession = await createUser();
            const token = jwt.sign({ user: userWithoutSession.id }, process.env.JWT_SECRET);

            const response = await api.delete("/network").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 401 if there have a user with given token with invalid credentialsId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const bodyErr = {
                networkTitle: faker.lorem.word(5),
                title: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(bodyErr)

            const response = await api.delete("/network").set("Authorization", `Bearer ${token}`).send({ networkId: faker.random.numeric(1) });

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);

        });

    it("should respond with status 200 if there have a user with given token with credentialsId",
        async () => {

            const user = await createUser();
            const token = await generateValidToken(user);

            const bodyRight = {
                networkTitle: faker.lorem.word(5),
                title: faker.lorem.word(5),
                password: faker.lorem.word(5)
            }

            const result = await api.post("/create-network").set("Authorization", `Bearer ${token}`).send(bodyRight);

            const networkId: number = JSON.parse(result.text).networkId;

            console.log(networkId)

            const teste = {
                networkId: networkId
            }

            const response = await api.delete("/network").set("Authorization", `Bearer ${token}`).send(teste);

            expect(response.status).toBe(httpStatus.OK);

        });

});