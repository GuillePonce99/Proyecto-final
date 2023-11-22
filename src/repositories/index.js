import { Products } from "../dao/factory.js";
import { Carts } from "../dao/factory.js";
import { Sessions } from "../dao/factory.js";
import { Tickets } from "../dao/factory.js";
import { Users } from "../dao/factory.js";

import CartReposity from "./cart.repository.js";
import ProductRepository from "./product.repository.js";
import SessionRepository from "./session.repository.js"
import TicketRepository from "./ticket.repository.js";
import UserRepository from "./user.repository.js";

export const productsServices = new ProductRepository(new Products())
export const cartsServices = new CartReposity(new Carts())
export const sessionsServices = new SessionRepository(new Sessions())
export const ticketServices = new TicketRepository(new Tickets())
export const usersServices = new UserRepository(new Users())