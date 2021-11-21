import API from "@aws-amplify/api";
import { Container, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { ListPostsQuery, Post } from "../API";
import PostPreview from "../components/PostPreview";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };
      if (allPosts.data) {
        setPosts(allPosts.data.listPosts.items as Post[]);
      } else {
        throw Error("Could not get posts");
      }
    };
    fetchPosts();
  }, []);

  console.log(user);
  console.log("Posts", posts);
  return (
    <Container maxWidth="md">
      {posts?.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </Container>
  );
}
