import { Command } from "commander"
const program = new Command()
program.option("-n --persistence <persistence>", "persistencia de datos", "MONGO").option("-p --port <port>", "port").option("-e --environment <environment>", "entorno", "DEV").parse()
export const options = program.opts();