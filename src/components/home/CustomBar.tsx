import type { UserStateModel } from "@components/user/_redux/userReducer";
import Brightness5Icon from '@mui/icons-material/Brightness5';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from "@mui/icons-material/Menu";
import ModeNightIcon from '@mui/icons-material/ModeNight';
import { AppBar, Box, Button, Menu, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { usePWA } from "@pwa/PWAProvider";
import { type MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
interface HomeContentProps {
    toggleDrawer: () => void;
    switchMode: () => void;
    mode: "light" | "dark";
}

export default function CustomBar({ switchMode, toggleDrawer, mode }: HomeContentProps) {

    const { t, i18n } = useTranslation();
    const { needRefresh, update } = usePWA()
    const { user } = useSelector(({ user }: any) => user
    ) as UserStateModel;
    const navigate = useNavigate();
    const [optionUser, setOptionUser] = useState<null | HTMLElement>(null);
    const [notification, setNotification] = useState<null | HTMLElement>(null);
    const openOptionUser = (event: MouseEvent<HTMLButtonElement>) =>
        setOptionUser(event.currentTarget);
    const closeOptionUser = () => setOptionUser(null);
    const closeNotification = () => setNotification(null);

    return (
        <AppBar
            color="transparent"
            position="sticky"
            sx={{
                boxShadow: "none",
                backdropFilter: "blur(20px)",
                top: 0,
                zIndex: (theme) => theme.zIndex.appBar
            }}
        >
            <Toolbar sx={{ paddingLeft: { xs: 2, sm: 31 } }}>
                <IconButton
                    aria-label="open drawer"
                    edge="start"
                    onClick={() => {
                        toggleDrawer()
                    }}
                    sx={{ mr: 2, display: { sm: 'none' } }}>
                    <MenuIcon />
                </IconButton>

                <Typography onClick={() => navigate("/")} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    OIME
                </Typography>

                <Button
                    id="buttonMenuOptionUser"
                    aria-controls={
                        Boolean(optionUser) ? "menuOptionUser" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={Boolean(optionUser) ? "true" : undefined}
                    onClick={openOptionUser}>
                    {user?.name} {user?.lastname}
                </Button>

                <Menu
                    id="menuOptionUser"
                    anchorEl={optionUser}
                    open={Boolean(optionUser)}
                    onClose={closeOptionUser}
                    slotProps={{
                        list: { "aria-labelledby": "buttonMenuOptionUser" },
                    }}>
                    <MenuItem style={{ gap: 8 }} onClick={() => switchMode()}>
                        {mode === "light" ? <ModeNightIcon /> : <Brightness5Icon />}
                        {mode === "light" ? t("shell_menu_dark_mode") : t("shell_menu_light_mode")}
                    </MenuItem>

                    {needRefresh ? <MenuItem style={{ gap: 8 }} onClick={() => update()}>
                            <BrowserUpdatedIcon />
                            {t("shell_menu_update_app")}
                        </MenuItem> : null
                    }

                    <Box sx={{ padding: 1 }}>
                        <Select sx={{ height: 32, width: "100%" }}
                            value={i18n.language || "es"}
                            onChange={(e) => i18n.changeLanguage(e.target.value)}
                        >
                            <MenuItem value="es">Español</MenuItem>
                            <MenuItem value="en">English</MenuItem>
                        </Select>
                    </Box>

                    <MenuItem color={"primary"} style={{ gap: 8 }} onClick={() => {
                        const form = document.createElement("form");
                        form.method = "POST";
                        form.action = "/logout";
                        document.body.appendChild(form);
                        form.submit();
                    }}>
                        <LogoutIcon />
                        {t("shell_menu_logout")}
                    </MenuItem>
                </Menu>

                <Menu
                    id="menuNotification"
                    anchorEl={notification}
                    open={Boolean(notification)}
                    onClose={closeNotification}
                    MenuListProps={{ "aria-labelledby": "basic-button" }}>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}