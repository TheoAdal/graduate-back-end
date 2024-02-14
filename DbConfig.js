const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

function connectDB() {
  const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.tfj07bt.mongodb.net/?retryWrites=true&w=majority`;

  try {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${url}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}

connectDB();
