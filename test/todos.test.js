const { ObjectId } = require("mongodb")
const request = require("supertest")
const app = require("../src/app")
const { connectToDB, closeConnection, getDB } = require("../src/database")

const baseUrl = "/todos"
let db

beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
    const MONGODB_DB = process.env.MONGODB_DB || 'mytodos-test'

    await connectToDB(MONGODB_URI, MONGODB_DB)
    console.log(MONGODB_URI)
})

afterAll(async () => {
    closeConnection()
})
afterEach(async()=>{
    db=getDB()
    await db.dropCollection("todos")
})

beforeEach(async () => {
    db=getDB()
    await db.createCollection("todos")
})


describe("GET /todos", () => {
    test("should respond with a 200 status code", async () => {
        const response= await request(app.callback()).get(baseUrl)
        expect(response.statusCode).toBe(200)
       
    })

    test("should respond with JSON", async () => {
        const response = await request(app.callback()).get(baseUrl)
        expect(response.type).toBe("application/json")
        
    })

    test("should respond with list of existing todos", async () => {
       const todosData= [{
           id:"61e931687474c53eca3a716c",
           tilte: "Todo 1",
           completed: false,
           createdAt: "2022-01-20T09:54:48.139Z",
           updatedAt: "2022-01-20T09:54:48.139Z"
       },
       { 
           id: '61e931687474c53eca3a716d',
           tilte: "Todo 2",
           completed: true,
           createdAt: "2022-01-20T09:54:48.139Z",
           updatedAt: "2022-01-20T10:32:50.952Z"
       }];
        const response = await request(app.callback()).get(baseUrl)
        
        expect(response.body.length).toBe(2)
        expect(response.body[0].id).toBe('61e931687474c53eca3a716c')
        expect(response.body[1].id).toBe('61e931687474c53eca3a716d')
        expect(response.body[0].title).toBe("Todo 1")
        expect(response.body[1].title).toBe("Todo 2")
        expect(response.body[0].completed).toBe(false)
        expect(response.body[1].completed).toBe(true)
        expect(response.body[0].createdAt).toBe( "2022-01-20T09:54:48.139Z")
        expect(response.body[1].createdAt).toBe("2022-01-20T09:54:48.139Z")
        expect(response.body[0].updatedAt).toBe("2022-01-20T09:54:48.139Z")
        expect(response.body[1].updatedAt).toBe("2022-01-20T10:32:50.952Z")
        
           
    })
});
