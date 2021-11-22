import {
  ButtonBase,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useState, useEffect } from "react";
import {
  CreateVoteInput,
  CreateVoteMutation,
  Post,
  UpdateVoteInput,
  UpdateVoteMutation,
} from "../API";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Image from "next/image";
import { useRouter } from "next/router";
import formatDatePosted from "../lib/formatDatePosted";
import { API, Auth, Storage } from "aws-amplify";
import { createVote, updateVote } from "../graphql/mutations";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { useUser } from "../context/AuthContext";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface Props {
  post: Post;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentHolder: {
      textAlign: "left",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: "425px",
      marginLeft: "25px",
      ["@media (max-width:600px)"]: {
        width: "75vw",
      },
      ["@media (max-width:550px)"]: {
        width: "70vw",
      },
      ["@media (max-width:500px)"]: {
        width: "65vw",
      },
      ["@media (max-width:400px)"]: {
        width: "60vw",
      },
    },
    postPageContentHolder: {
      textAlign: "left",
      marginLeft: "25px",
      marginRight: "10px",
    },
  })
);

export default function PostPreview({ post }: Props): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUser();
  const [postImage, setPostImage] = useState<string | undefined>(undefined);
  const [existingVote, setExistingVote] = useState<string | undefined>(
    undefined
  );
  const [existingVoteId, setExistingVoteId] = useState<string | undefined>(
    undefined
  );
  const [upvotes, setUpvotes] = useState<number>(
    post.votes.items
      ? post.votes.items.filter((v) => v.vote === "upvote").length
      : 0
  );

  const [downvotes, setDownvotes] = useState<number>(
    post.votes.items
      ? post.votes.items.filter((v) => v.vote === "downvote").length
      : 0
  );

  useEffect(() => {
    if (user) {
      const tryFindVote = post.votes.items?.find(
        (v) => v.owner === user.getUsername()
      );

      if (tryFindVote) {
        setExistingVote(tryFindVote.vote);
        setExistingVoteId(tryFindVote.id);
      }
    }
  }, [user]);

  useEffect(() => {
    async function getImageFromStorage() {
      try {
        const signedURL = await Storage.get(post.image); // get key from Storage.list
        // console.log("Found Image:", signedURL);
        // @ts-ignore
        setPostImage(signedURL);
      } catch (error) {
        console.log("No image found.");
      }
    }

    getImageFromStorage();
    // console.log(post.votes.items);
  }, []);

  const addVote = async (voteType: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (existingVote && existingVote != voteType) {
      const updateVoteInput: UpdateVoteInput = {
        id: existingVoteId,
        vote: voteType,
        postID: post.id,
      };

      const updateThisVote = (await API.graphql({
        query: updateVote,
        variables: { input: updateVoteInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: UpdateVoteMutation };
      // if they're changing their vote...
      // updateVote rather than create vote.

      if (voteType === "upvote") {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      }

      if (voteType === "downvote") {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(updateThisVote.data.updateVote.id);
      console.log("Updated vote:", updateThisVote);
    }

    if (!existingVote) {
      const createNewVoteInput: CreateVoteInput = {
        vote: voteType,
        postID: post.id,
      };

      const createNewVote = (await API.graphql({
        query: createVote,
        variables: { input: createNewVoteInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: CreateVoteMutation };

      if (createNewVote.data.createVote.vote === "downvote") {
        setDownvotes(downvotes + 1);
      }
      if (createNewVote.data.createVote.vote === "upvote") {
        setUpvotes(upvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(createNewVote.data.createVote.id);
      console.log("Created vote:", createNewVote);
    }
  };

  return (
    <Paper elevation={10}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        wrap="nowrap"
        spacing={0}
        style={{ padding: 0, marginTop: 24 }}
      >
        {/* Upvote / votes / downvote */}
        <Grid item style={{ padding: 10, backgroundColor: "#262e3b" }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton color="inherit" onClick={() => addVote("upvote")}>
                <ArrowUpwardIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" direction="column">
                <Grid item>
                  <Typography variant="h6">{upvotes - downvotes}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">votes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton color="inherit" onClick={() => addVote("downvote")}>
                <ArrowDownwardIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        {/* Content Preview */}
        <ButtonBase
          onClick={() => router.push(`/post/${post.id}`)}
          style={{ width: "100%" }}
        >
          <Grid item style={{ width: "100%" }}>
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginLeft: "25px", marginTop: "10px" }}>
                <Typography variant="caption" style={{ color: "gray" }}>
                  Posted by <b>{post.owner}</b>{" "}
                  {formatDatePosted(post.createdAt)}
                </Typography>
              </Grid>
              <Grid item style={{ marginRight: "20px" }}>
                <Typography
                  variant="h3"
                  className={
                    router.asPath.slice(1, 5) === "post"
                      ? classes.postPageContentHolder
                      : classes.contentHolder
                  }
                >
                  {post.title}
                </Typography>
              </Grid>
              <Grid
                item
                style={{
                  maxWidth: "100%",
                  marginBottom: "10px",
                }}
              >
                <Typography
                  variant="body1"
                  className={
                    router.asPath.slice(1, 5) === "post"
                      ? classes.postPageContentHolder
                      : classes.contentHolder
                  }
                >
                  {post.contents}
                </Typography>
              </Grid>
              {post.image && postImage && (
                <Grid
                  item
                  style={{
                    width: "100%",
                    height: "384px",
                    position: "relative",
                  }}
                >
                  <Image
                    alt="postImage"
                    src={postImage}
                    layout="fill"
                    objectFit="cover"
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </ButtonBase>
      </Grid>
    </Paper>
  );
}
