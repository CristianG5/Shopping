import express from "express";
import cors from "cors";

//sdk mp
import {MercadoPagoConfig, Preference} from "mercadopago";
import { log } from "console";
//Agreaga credenciales
const client = new MercadoPagoConfig({
    accessToken: ("TEST-1330570525723502-052001-b65e18eddf3b3070b6b79e44d306f5e4-146750867"),
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server :)");
});

app.post("/create_preference", async (req, res) =>{
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "http://www.google.com.ar",
                failure: "http://www.google.com.ar",
                pending: "http://www.google.com.ar"
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({body});
        res.json({
            id: result.id,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia"
        });
    }
});

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});
