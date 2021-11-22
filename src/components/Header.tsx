import React, { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useUser } from "../context/AuthContext";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { useRouter } from "next/router";
import { Auth } from "aws-amplify";
import AddIcon from "@material-ui/icons/Add";
import Home from "@material-ui/icons/Home";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100vw",
      marginBottom: 32,
      position: "fixed",
      top: 0,
      zIndex: 100,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      ["@media (max-width:400px)"]: {
        display: "none",
      },
    },
    responsiveHeader: {
      ["@media (max-width:400px)"]: {
        display: "none",
      },
    },
  })
);

export default function Header() {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Fixing a bug -> menu pop up after loging in
  useEffect(() => {
    setAnchorEl(null);
  }, [user]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signUserOut = async () => {
    await Auth.signOut();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => router.push(`/`)}
          >
            <Home />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Reddit Clone
          </Typography>
          {user ? (
            <div>
              <Tooltip title="Create Post">
                <IconButton
                  onClick={() => router.push(`/create`)}
                  aria-label="create"
                  color="inherit"
                >
                  <Typography
                    style={{ marginBottom: "2px", marginRight: "4px" }}
                    className={classes.responsiveHeader}
                  >
                    Post
                  </Typography>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
                <Typography
                  style={{
                    marginBottom: "2px",
                    marginLeft: "8px",
                    textTransform: "capitalize",
                  }}
                >
                  {user.getUsername()}
                </Typography>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => signUserOut()}>Sign Out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Button
                variant="outlined"
                color="primary"
                style={{ width: "90px", marginRight: "5px" }}
                onClick={() => router.push(`/login`)}
              >
                Login
              </Button>
              <Button
                style={{ width: "90px" }}
                variant="contained"
                color="primary"
                onClick={() => router.push(`/signup`)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
