import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Button,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { useUser } from "../context/AuthContext";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
  code: string;
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

export default function Signup() {
  const classes = useStyles();
  const { user, setUser } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const [showCode, setShowCode] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        setUserEmail(data.email);
        await signUpWithEmailAndPassword(data);
        setShowCode(true);
      }
    } catch (err) {
      console.error(err);
      setSignUpError(err.message);
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  async function signUpWithEmailAndPassword(
    data: IFormInput
  ): Promise<CognitoUser> {
    const { username, password, email } = data;
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user:", user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function confirmSignUp(data: IFormInput) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Successs, singed in a user", amplifyUser);
      if (amplifyUser) {
        router.push(`/`);
      } else {
        throw new Error("Something went wrong :'(");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  // console.log("The value of the user from the hook is:", user);

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
            justifyContent="center"
            spacing={2}
          >
            {!showCode ? (
              <>
                <Grid
                  item
                  className={classes.fullWidth}
                  style={{ display: showCode && "hidden" }}
                >
                  <TextField
                    className={classes.fullWidth}
                    variant="outlined"
                    id="username"
                    label="Username"
                    type="text"
                    error={errors.username ? true : false}
                    helperText={
                      errors.username ? errors.username.message : null
                    }
                    {...register("username", {
                      required: {
                        value: true,
                        message: "Please enter a username.",
                      },
                      minLength: {
                        value: 3,
                        message:
                          "Please enter a username between 3-16 characters.",
                      },
                      maxLength: {
                        value: 16,
                        message:
                          "Please enter a username between 3-16 characters.",
                      },
                    })}
                  />
                </Grid>

                <Grid
                  item
                  className={classes.fullWidth}
                  style={{ display: showCode && "hidden" }}
                >
                  <TextField
                    className={classes.fullWidth}
                    variant="outlined"
                    id="email"
                    label="Email"
                    type="email"
                    error={errors.email ? true : false}
                    helperText={errors.email ? errors.email.message : null}
                    {...register("email", {
                      required: {
                        value: true,
                        message: "Please enter a valid email.",
                      },
                    })}
                  />
                </Grid>

                <Grid
                  item
                  className={classes.fullWidth}
                  style={{ display: showCode && "hidden" }}
                >
                  <TextField
                    className={classes.fullWidth}
                    variant="outlined"
                    id="password"
                    label="Password"
                    type="password"
                    error={errors.password ? true : false}
                    helperText={
                      errors.password ? errors.password.message : null
                    }
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Please enter a password.",
                      },
                      minLength: {
                        value: 8,
                        message: "Please enter a stronger password.",
                      },
                    })}
                  />
                </Grid>
              </>
            ) : (
              <Grid item className={classes.fullWidth}>
                <Typography
                  variant="subtitle2"
                  style={{ marginBottom: "20px" }}
                >
                  An email with a verification code was just sent to {userEmail}
                </Typography>
                <TextField
                  className={classes.fullWidth}
                  variant="outlined"
                  id="code"
                  label="Verification Code"
                  type="text"
                  error={errors.code ? true : false}
                  helperText={errors.code ? errors.code.message : null}
                  {...register("code", {
                    required: { value: true, message: "Please enter a code." },
                    minLength: {
                      value: 6,
                      message: "Your verification is 6 characters long.",
                    },
                    maxLength: {
                      value: 6,
                      message: "Your verification is 6 characters long.",
                    },
                  })}
                />
              </Grid>
            )}

            <Grid style={{ marginTop: 16 }} className={classes.btnHolder}>
              <Button
                variant="contained"
                type="submit"
                className={classes.fullWidth}
              >
                {showCode ? "Confirm Code" : "Sign Up"}
              </Button>
            </Grid>
          </Grid>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {signUpError}
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </Grid>
  );
}
