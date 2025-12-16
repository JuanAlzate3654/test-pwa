import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function HomeContent() {
    return (
        <Box className="home-component"
            component="main"
            sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Box sx={{
                overflowX: "auto",
                width: "100%",
                marginLeft: {
                    xs: "null",
                    sm: "248px"
                },
                margin: {                    
                    xs: "16px",
                    sm: "none",
                }
            }}>
                <Outlet/>             
            </Box>
        </Box>
    );
}
