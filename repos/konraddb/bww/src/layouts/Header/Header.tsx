import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;

const navItems = [
  { label: "Formularz", nav: "/finish" },
  { label: "Kontakt", nav: "/contact" },
];

export default function Header(props: Props) {
  const { window } = props;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // setAnchorEl(event.currentTarget);
    navigate("/finish");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Link component={RouterLink} to="/" color="text.primary" underline="none">
        <img src={logo} alt={logo} style={{ height: "64px" }} />
      </Link>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={item.label + index} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center", justifyContent: "center" }}
            >
              <Link
                component={RouterLink}
                to={item.nav}
                color="text.primary"
                underline="none"
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  textAlign="center"
                >
                  {item.label}
                </Typography>
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: 64 }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "#000000" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block", height: 64 },
            }}
          >
            <Link
              component={RouterLink}
              to="/"
              color="text.primary"
              underline="none"
            >
              <img src={logo} alt={logo} style={{ height: "64px" }} />
            </Link>
          </Box>

          <Box>
            {/* {navItems.map((item, index) => (
              <Button
                key={item}
                sx={{ color: "#fff" }}
                onClick={index === 0 ? handleClick : () => true}
              >
                {item}
              </Button>
            ))} */}
            <Button
              variant="contained"
              onClick={() => navigate("/gallery")}
              sx={{ mr: 2 }}
            >
              Zrealizowane projekty
            </Button>
            <Button variant="contained" onClick={handleClick}>
              Otrzymaj darmową wycenę
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Link
            component={RouterLink}
            to="/finish"
            color="text.primary"
            underline="none"
          >
            Wykończenie mieszkań
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>Wykończenie domów</MenuItem>
      </Menu>
    </Box>
  );
}
