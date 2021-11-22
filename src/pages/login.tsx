import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Grid, Paper, Snackbar, TextField } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useUser } from "../context/AuthContext";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface IFormInput {
  username: string;
  password: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formContainer: {
      width: "350px",
      marginBottom: 32,
      marginTop: "40px",
    },
    fullWidth: {
      width: "100%",
    },
    btnHolder: {
      width: "96%",
    },
    inputBg: {
      ":-webkit-autofill": {
        backgroundColor: "red !important",
      },
    },
  })
);

export default function Login() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [signInError, setSignInError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await Auth.signIn(data.username, data.password);
      router.push(`/`);
    } catch (error) {
      console.error(error);
      setSignInError(error.message);
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Paper elevation={20} className={classes.formContainer}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          style={{ margin: "20px" }}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={2}
          >
            <Grid item className={classes.fullWidth}>
              <TextField
                className={classes.fullWidth}
                variant="outlined"
                id="username"
                label="Username"
                type="text"
                error={errors.username ? true : false}
                helperText={errors.username ? errors.username.message : null}
                {...register("username")}
              />
            </Grid>

            <Grid item className={classes.fullWidth}>
              <TextField
                className={classes.fullWidth}
                variant="outlined"
                id="password"
                label="Password"
                type="password"
                error={errors.password ? true : false}
                helperText={errors.password ? errors.password.message : null}
                {...register("password")}
              />
            </Grid>

            <Grid style={{ marginTop: 16 }} className={classes.btnHolder}>
              <Button
                variant="contained"
                type="submit"
                className={classes.fullWidth}
              >
                Sign In
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {signInError}
          </Alert>
        </Snackbar>
      </Paper>
    </Grid>
  );
}
