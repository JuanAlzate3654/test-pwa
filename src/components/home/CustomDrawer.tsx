import { type GroupModel, MenuOptions } from "@integral-software/simple-menu";
import LogoutIcon from '@mui/icons-material/Logout';
import { Drawer, MenuItem, useTheme } from "@mui/material";
import { t } from "i18next";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export interface CustomDrawerProps {
    mobileOpen: boolean
    setMobileOpen: (value: boolean) => void
    drawerWidth: number;
}

export const menus: Array<GroupModel> = [
    {
        name: t("shell_menu_title"),
        menu: [
            {
                id: "config",
                name: t("shell_menu_config_title"),
                defaultCollapsed: false,
                icon: "add_card",
                link: "#",
                subMenu: [
                    {
                        id: "config_domain",
                        name: t("shell_menu_config_domain_title"),
                        icon: "radio_button_unchecked",
                        link: "/config",
                        subMenu: [],
                        role: "maps.menu.view",
                    },
                ],
                role: "",
            }
        ],
    },
];


export const CustomDrawer = ({ mobileOpen, setMobileOpen, drawerWidth }: CustomDrawerProps) => {
    const theme = useTheme()
    const [size, setSize] = useState(drawerWidth)
    const [selected, setSelected] = useState<any>(null)
    const navigate = useNavigate();
    useEffect(() => {
        void navigate(selected?.link || '/');
        handleDrawerClose()
    }, [selected]);

    const drawer = (
        <Suspense fallback={<div>Loading...</div>}>
            <MenuOptions initWidth={drawerWidth}
                open={true}
                selectedItem={selected}
                compact={false}
                onSelected={(item: any) => {
                    setSelected(item)
                }}
                resize={(size: number) => {
                    console.log("size", size)
                    setSize(size)
                }} menus={menus} />
        </Suspense>
    );

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
    };

    const ExitButton = () => {
        return (
            <MenuItem
                onClick={() => {
                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = "/logout";
                    document.body.appendChild(form);
                    form.submit();
                }}
                sx={{
                    gap: 1,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                    },
                }}
            >
                <LogoutIcon />
                {t("shell_menu_logout")}
            </MenuItem>
        )
    }

    return (<>
        <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box', width: drawerWidth, borderRight: "none",
                    backgroundColor: theme.palette.background.default
                },
            }}>
            {drawer}
            {ExitButton()}
        </Drawer>
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', sm: 'block', width: size },
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box', width: drawerWidth, borderRight: "none",
                    backgroundColor: "transparent",
                    overflowX: 'hidden'
                },
            }} open>
            {drawer}
            {ExitButton()}
        </Drawer>
    </>)
}