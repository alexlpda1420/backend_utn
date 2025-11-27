import IUserTokenPayload from "../../interfaces/IUserTokenPayload";

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload;
    }
  }
}

export { };  // Obligatorio para que esto sea un módulo
