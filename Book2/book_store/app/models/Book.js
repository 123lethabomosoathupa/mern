import mongoose from "mongoose";
 
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});
 
const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
 
export default Book;