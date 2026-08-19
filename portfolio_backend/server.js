const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(cors());

app.use(express.json());


/* =========================================================
   TEST ROUTE
   ========================================================= */

app.get("/", (req, res) => {

    res.json({
        message: "Portfolio backend is running successfully 🚀"
    });

});


/* =========================================================
   CONTACT FORM
   ========================================================= */

app.post("/api/contact", async (req, res) => {

    try {

        const { name, email, message } = req.body;


        /* -----------------------------
           VALIDATION
        ----------------------------- */

        if (!name || !email || !message) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }


        /* -----------------------------
           CREATE EMAIL TRANSPORTER
        ----------------------------- */

        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }

            });


        /* -----------------------------
           EMAIL
        ----------------------------- */

        const mailOptions = {

            from: process.env.EMAIL_USER,

            to: process.env.EMAIL_USER,

            replyTo: email,

            subject:
                `Portfolio Contact - ${name}`,

            text: `
You received a new message from your portfolio website.

Name: ${name}

Email: ${email}

Message:
${message}
            `

        };


        /* -----------------------------
           SEND EMAIL
        ----------------------------- */

        await transporter.sendMail(mailOptions);


        /* -----------------------------
           SUCCESS RESPONSE
        ----------------------------- */

        res.status(200).json({

            success: true,

            message:
                "Message sent successfully."

        });


    } catch (error) {

        console.error(
            "Contact form error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to send message."

        });

    }

});


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(PORT, () => {

    console.log(
        `Portfolio backend running on http://localhost:${PORT}`
    );

});