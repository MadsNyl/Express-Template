import { db } from "../../util/db";


const disconnectServer = async () => await db.$disconnect();


export default disconnectServer;