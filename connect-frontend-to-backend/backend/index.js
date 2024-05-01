import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

const port = process.env.PORT || 5000;

// get a list of five jokes

app.get("/api/jokes", (req, res) => {
    const jokes = [

        {
            id: 1,
            title: "Why did the scarecrow win an award?",
            body: "Because he was outstanding in his field."
        },
        {
            id: 2,
            title: "I'm reading a book on the history of glue.",
            body: "I just can't seem to put it down."
        },
        {
            id: 3,
            title: "Why don't scientists trust atoms?",
            body: "Because they make up everything."
        },
        {
            id: 4,
            title: "What do you get when you cross a snowman and a vampire?",
            body: "Frostbite."
        },
        {
            id: 5,
            title: "I invented a new word!",
            body: "Plagiarism."
        }
    ];
    res.send(jokes);
})

app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});