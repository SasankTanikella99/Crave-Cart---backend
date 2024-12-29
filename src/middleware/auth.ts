import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

// Adding custom properties to the request
declare global {
    namespace Express {
        interface Request {
            auth0Id?: string;
            userId?: string;
        }
    }
}

export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASED_URL,
    tokenSigningAlg: "RS256",
});

// Middleware to parse JWT and add custom fields
export const jwtParse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({ error: "Missing or invalid token" });
        return 
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;

        if (!decoded || !decoded.sub) {
            res.status(400).json({ error: "Invalid token" });
            return 
        }

        const auth0Id = decoded.sub;
        const user = await User.findOne({ auth0Id });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return 
        }

        // Attach custom properties to the request object
        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString();

        // Call the next middleware in the chain
        return next();
    } catch (err) {
        console.error("Error parsing token:", err);
        res.status(500).json({ error: "Failed to parse token" });
        return 
    }
};
