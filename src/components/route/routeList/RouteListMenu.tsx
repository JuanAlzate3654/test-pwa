import type { RouteListModel } from "@components/route/routeList/_redux/model";
import { routeListSlice } from "@components/route/routeList/_redux/routeListReducer";
import { ConfirmDialogV2 } from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu as MenuUi,MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { APP_ID } from '@store/store';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface RouteListMenuProps {
    route: RouteListModel;
}

export default function RouteListMenu({ route }: RouteListMenuProps) {

    const { t } = useTranslation();

    const globalStore = GlobalStore.Get();

    const navigate = useNavigate();

    const [menu, setMenu] = React.useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        return setMenu(event.currentTarget);
    };

    const closeMenu = () => setMenu(null);

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const afterCloseDialog = (response: boolean) => {
        if (response) {
            globalStore.DispatchAction(APP_ID, routeListSlice.actions.deleteReducer({ id: route.id }));
            closeMenu();
        }

        setOpenDialog(false);
    };

    const goToEdit = () => {
        void navigate(`${route.id}/edit`, { relative: "route" });
        closeMenu();
    };

    const goToMap = () => {
        void navigate(`${route.id}/map`, { relative: "route" });
        closeMenu();
    };

    return (
        <div>
            <IconButton id={`option${route.id}`}
                aria-controls={Boolean(menu) ? `menu${route.id}` : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(menu) ? 'true' : undefined}
                onClick={openMenu}>
                <MoreVertIcon />
            </IconButton>

            <MenuUi id={`menu${route.id}`}
                anchorEl={menu}
                open={Boolean(menu)}
                onClose={closeMenu}
                slotProps={{
                    list: {
                        'aria-labelledby': `option${route.id}`
                    }
                }}
            >
                <MenuItem style={styles.link}
                    onClick={goToEdit}>
                    <EditIcon />
                    {t("route_list_menu_edit")}
                </MenuItem>

                <MenuItem style={styles.link}
                    onClick={goToMap}>
                    <MapIcon />
                    {t("route_list_map_button")}
                </MenuItem>

                <MenuItem style={styles.link}
                    onClick={() => setOpenDialog(true)}>
                    <DeleteIcon />
                    {t("route_list_menu_delete")}
                </MenuItem>
            </MenuUi>

            <ConfirmDialogV2 show={openDialog} type={'delete'} onAfterCloseDialog={afterCloseDialog} config={{
                title: t("route_list_menu_delete_title"),
                message: t("route_list_menu_delete_message"),
                confirmtext: t("route_list_menu_delete_confirm_text"),
                textBtnConfirm: t("route_list_menu_delete_confirm_button_text"),
                textBtnClose: t("route_list_menu_delete_close_button_text"),
            }} />
        </div>
    );
}

const styles = {
    link: {
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'start',
        gap: '10px',
        textDecoration: 'none',
    } as CSSProperties,
};
