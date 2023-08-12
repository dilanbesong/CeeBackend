import { hoursAgo as HoursAgo } from "./HoursAgo.js";
import { Post } from "../model/schema.js";

async function removeStatus() {
  const posts = await Post.find();
  const TWENTYFOUR_HOURS = 24
  const currentStatus = await Promise.all(
    posts.map(async (post) => {
      if (
        post.postType == "status" &&
        HoursAgo(post.createdAt) >= TWENTYFOUR_HOURS
      ) {
        await Post.findByIdAndDelete(post._id);
      }
      return post;
    })
  );

  // socket emiting status post continues here
}

export { removeStatus }

