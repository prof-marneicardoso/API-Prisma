import app from "./src/app.js";

const host = "localhost";
const port = process.env.PORT || 3300;

app.listen(port, () => {
    // console.log(`Servidor rodando: http://localhost:3300`);
    console.log(`Servidor rodando: http://${host}:${port}`);
});
