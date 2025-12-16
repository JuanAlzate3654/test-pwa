import { userSlice, type UserStateModel } from "@components/user/_redux/userReducer";
import { isLoading } from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import { Box, CircularProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { APP_ID } from "@store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import CustomBar from "./CustomBar";
import { CustomDrawer } from "./CustomDrawer";
import HomeContent from "./HomeContent";

interface HomeProps {
    switchMode: () => void;
    mode: "light" | "dark";
}

export default function Home({ switchMode, mode }: HomeProps) {
    const globalStore = GlobalStore.Get();

    const { user, result: userResult } = useSelector(({ user }: any) => user) as UserStateModel;
    const [mobileOpen, setMobileOpen] = useState(false)

    const getPrincipal = () => {
        if (isLoading(userResult.findUserReducer)) {
            return;
        }

        globalStore.DispatchAction(APP_ID, userSlice.actions.findUserReducer());
    };

    useEffect(() => getPrincipal(), []);

    if (!user) return <CircularProgress size={24} color="secondary" />;

    return (
        <Grid
            container
            sx={{
                flexGrow: 1,
                height: "100%",
                alignItems: "flex-start",
                alignContent: "flex-start"
            }}
        >
            <CssBaseline />
            <CustomBar
                switchMode={switchMode}
                toggleDrawer={() => setMobileOpen(!mobileOpen)}
                mode={mode}
            />

            <CustomDrawer mobileOpen={mobileOpen} drawerWidth={240} setMobileOpen={(value: boolean) => {
                setMobileOpen(value)
            }} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    overflow: "auto",
                }}
            >
                <HomeContent/>
            </Box>
        </Grid>
    );
}