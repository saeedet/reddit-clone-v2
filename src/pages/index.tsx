import API from "@aws-amplify/api";
import { Container } from "@material-ui/core";
import { useEffect, useState } from "react";
import { ListPostsQuery, Post, PostsByDateQuery } from "../API";
import PostPreview from "../components/PostPreview";
import { postsByDate, listPosts } from "../graphql/queries";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = (await API.graphql({
        query: postsByDate,
        variables: {
          type: "post",
          sortDirection: "DESC",
        },
      })) as {
        data: PostsByDateQuery;
        errors: any[];
      };
      if (allPosts.data) {
        console.log(allPosts.data);
        setPosts(allPosts.data.postsByDate.items as Post[]);
      } else {
        throw Error("Could not get posts");
      }
    };
    fetchPosts();
  }, []);

  // console.log(user);
  // console.log("Posts", posts);
  return (
    <Container maxWidth="sm" style={{ paddingBottom: 32 }}>
      {posts?.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
}
