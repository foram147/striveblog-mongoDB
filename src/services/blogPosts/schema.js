import mongoose from "mongoose";
const { Schema, model } = mongoose;
const postSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      type: Object,
      required: true,
      nested: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
      },
    },

    author: [{ type: Schema.Types.ObjectId, required: true, ref: "author" }],
    comments: [{ text: { type: String } }],
  },

  {
    timestamps: true,
  }
);

postSchema.static("findPostWithAuthor", async function (query) {
  const total = await this.countDocuments(query);
  const post = await this.find(query.criteria).populate({
    path: "author",
    select: "name",
  });

  return { total, post };
});

export default model("blogPosts", postSchema);
