import { domainListSlice } from "@components/domain/domainList/_redux/domainListReducer";
import type { DomainListModel } from "@components/domain/domainList/_redux/model";
import { ConfirmDialogV2 } from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu as MenuUi,MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { APP_ID } from '@store/store';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface DomainListMenuProps {
    domain: DomainListModel;
}

export default function DomainListMenu({ domain }: DomainListMenuProps) {

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
            globalStore.DispatchAction(APP_ID, domainListSlice.actions.deleteReducer({
                group: domain.group,
                key: domain.key
            }));
            closeMenu();
        }

        setOpenDialog(false);
    };

    const goToEdit = () => {
        void navigate(`${domain.group}/${domain.key}/edit`, { relative: "route" });
        closeMenu();
    };

    return (
        <div>
            <IconButton id={`option${domain.key}`}
                aria-controls={Boolean(menu) ? `menu${domain.key}` : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(menu) ? 'true' : undefined}
                onClick={openMenu}>
                <MoreVertIcon />
            </IconButton>

            <MenuUi id={`menu${domain.key}`}
                anchorEl={menu}
                open={Boolean(menu)}
                onClose={closeMenu}
                slotProps={{
                    list: {
                        'aria-labelledby': `option${domain.key}`
                    }
                }}
            >
                <MenuItem style={styles.link}
                    onClick={goToEdit}>
                    <EditIcon />
                    {t("domain_list_menu_edit")}
                </MenuItem>

                <MenuItem style={styles.link}
                    onClick={() => setOpenDialog(true)}>
                    <DeleteIcon />
                    {t("domain_list_menu_delete")}
                </MenuItem>
            </MenuUi>

            <ConfirmDialogV2 show={openDialog} type={'delete'} onAfterCloseDialog={afterCloseDialog} config={{
                title: t("domain_list_menu_delete_title"),
                message: t("domain_list_menu_message"),
                confirmtext: t("domain_list_menu_confirm_text"),
                textBtnConfirm: t("domain_list_menu_confirm_button_text"),
                textBtnClose: t("domain_list_menu_close_button_text"),
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
