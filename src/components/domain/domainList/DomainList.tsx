import type { DomainEditStateModel } from "@components/domain/domainEdit/_redux/domainEditReducer";
import type { DomainListStateModel } from "@components/domain/domainList/_redux/domainListReducer";
import { domainListSlice } from "@components/domain/domainList/_redux/domainListReducer";
import type { DomainListModel } from "@components/domain/domainList/_redux/model";
import type { DomainNewStateModel } from "@components/domain/domainNew/_redux/domainNewReducer";
import {
    isLoading,
    isSuccess,
    useGlobalSelector, useLinearProgress,
    useSimpleToast,
    useTable
} from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import AddIcon from "@mui/icons-material/Add";
import MapIcon from '@mui/icons-material/Map';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Chip, FormControl, InputAdornment, InputLabel, Link, MenuItem, Paper, Select, Switch, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from 'react-router-dom';
import { APP_ID } from "src/store/store";
import DomainListMenu from "./DomainListMenu";
export default function DomainList() {

    const { t } = useTranslation();

    const statusOptions = ["ENABLED", "DISABLED"];
    const [selectedStatus, setSelectedStatus] = useState(["ENABLED"]);

    const handleChange = (event: any) => {
        setSelectedStatus(event.target.value);
    };
    const theme = useTheme()
    const isGeSm = useMediaQuery(theme.breakpoints.up('sm'));
    const globalStore = GlobalStore.Get();
    const { page, pagination, result } = useGlobalSelector<DomainListStateModel>(APP_ID, ({ domainList }) => domainList);
    const { result: resultNew } = useGlobalSelector<DomainNewStateModel>(APP_ID, ({ domainNew }) => domainNew);
    const { result: resultEdit } = useGlobalSelector<DomainEditStateModel>(APP_ID, ({ domainEdit }) => domainEdit);

    const {
        selectionColumn, props, prepareRequest, selectedModel
    } = useTable<DomainListModel>({
        isUpdating: () => isLoading(result.pageResult),
        multiple: false,
        getId: (row) => row.group + row.key,
        onSortModelChange: () => {
            loadCapabilitiesList()
        },
        onPaginationModelChange: () => {
            loadCapabilitiesList()
        }
    });

    const handleStatusChange = (row: DomainListModel) => {
        if (row.status === 'ENABLED') {
            globalStore.DispatchAction(APP_ID, domainListSlice.actions.disableReducer({ group: row.group, key: row.key }));
        }
        else {
            globalStore.DispatchAction(APP_ID, domainListSlice.actions.enableReducer({ group: row.group, key: row.key }));
        }
    }

    const columnsXs: GridColDef[] = [
        {
            field: '', headerName: '', flex: 1, sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Paper sx={{
                    display: "flex",
                    padding: 2,
                    marginBottom: 1,
                    marginTop: 1,
                    width: "100%",
                    gap: 1,
                    flexDirection: "column",
                    flexWrap: "nowrap"
                }}>
                    <TextField fullWidth variant="standard" label={t("domain_list_table_group")} disabled
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <DomainListMenu domain={params.row} />
                                    </InputAdornment>
                                )
                            }
                        }}
                        value={params.row.group}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("domain_list_table_key")} disabled
                        value={params.row.key}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("domain_list_table_value")} disabled
                        value={params.row.value}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("domain_list_table_status")} disabled
                        value={params.row.status}
                    />
                </Paper>
            ),
        }
    ];
    const columns: GridColDef[] = !isGeSm ? columnsXs : [
        selectionColumn,
        {
            valueGetter: (params, row) => row.group,
            field: 'id.group', headerName: t("domain_list_table_group"), width: 200, sortable: true
        },
        {
            renderCell: (value) => {
                return (
                    (selectedModel.firstSelected() == value.row.group + value.row.key) && <DomainListMenu domain={value.row} />
                );
            },
            field: 'opt', headerName: '', width: 50, sortable: false, resizable: false
        },
        {
            valueGetter: (params, row) => row.key,
            field: 'id.key', headerName: t("domain_list_table_key"), width: 200, sortable: false
        },
        { field: 'value', headerName: t("domain_list_table_value"), width: 200, sortable: false },
        {
            renderCell: (value) => {
                return (
                    <Switch
                        checked={value.row.status === 'ENABLED'}
                        onChange={() => handleStatusChange(value.row)}
                        color="primary"
                        slotProps={{ input: { 'aria-label': 'status switch' } }}
                    />
                );
            },
            field: 'estado', headerName: t("domain_list_table_status"), width: 200, sortable: false
        },
    ];

    const loadCapabilitiesList = () => {
        if (isLoading(result.pageResult)) {
            return;
        }
        let newRequest = {
            ...prepareRequest(pagination),
            others: {
                status: selectedStatus
            }
        };
        globalStore.DispatchAction(APP_ID, domainListSlice.actions.pageReducer(newRequest))
    };

    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (isSuccess(result.deleteResult) || isSuccess(resultNew.saveResult) || isSuccess(resultEdit.saveResult)) {
            loadCapabilitiesList();
        }
    }, [result.deleteResult, resultNew.saveResult, resultEdit.saveResult]);

    useEffect(() => {
        if (isSuccess(result.enableResult)) {
            loadCapabilitiesList();
        }
    }, [result.enableResult]);

    useEffect(() => {
        if (isSuccess(result.disableResult)) {
            loadCapabilitiesList();
        }
    }, [result.disableResult]);

    useLinearProgress("oime_shell_admin", result.pageResult);

    useEffect(() => loadCapabilitiesList(), [selectedStatus]);
    useEffect(() => () => globalStore.DispatchAction(APP_ID, domainListSlice.actions.clearReducer()), []);

    return (
        <div style={styles.container}>
            <Typography variant={"h6"}>
                {t("domain_list_title")}
            </Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingY: 2,
                flexDirection: isGeSm ? "row" : "column",
                alignItems: "start",
                gap: 1
            }}>
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    flex: 1,
                }}>
                    <Link component={RouterLink} to="new">
                        <Tooltip title={t("domain_list_new_button_tooltip")} arrow>
                            <Button startIcon={<AddIcon />}>
                                {t("domain_list_new_button")}
                            </Button>
                        </Tooltip>
                    </Link>
                    <Link component={RouterLink} to="map">
                        <Tooltip title={t("domain_list_map_button_tooltip")} arrow>
                            <Button startIcon={<MapIcon />}>
                                {t("domain_list_map_button")}
                            </Button>
                        </Tooltip>
                    </Link>
                    <Tooltip title={t("domain_list_refresh_button_tooltip")} arrow>
                        <Button variant='outlined'
                            onClick={() => {
                                loadCapabilitiesList()
                            }}>
                            <RefreshIcon />
                        </Button>
                    </Tooltip>
                </Box>
                <FormControl sx={{ width: isGeSm ? 220 : "100%" }}>
                    <InputLabel id="filter">{t("domain_list_filter_label")}</InputLabel>
                    <Select
                        size='small'
                        label={t("domain_list_filter_label")}
                        multiple
                        value={selectedStatus}
                        onChange={handleChange}
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {selected.map((value) => (
                                    <Chip sx={{ maxHeight: "20px" }} key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <DataGrid
                rows={page.data}
                columns={columns}
                getRowHeight={() => 'auto'}
                pageSizeOptions={[2]}
                paginationMode="server"
                paginationModel={{
                    page: pagination.page,
                    pageSize: pagination.size
                }}
                getRowId={row => `${row.group}-${row.key}`}
                {...props}
                rowCount={page.totalRows}
                loading={isLoading(result.pageResult)}
                hideFooterSelectedRowCount={true}
                disableColumnMenu={true} />
        </div>
    );
}

const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: '100%',
        gridTemplateRows: 'auto auto',
    } as CSSProperties,
    action: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        margin: '10px 0 0',
        placeContent: 'center space-between',
        alignItems: 'center'
    } as CSSProperties,
    divider: {
        margin: '0 0 0px 0'
    } as CSSProperties,
    actionButtons: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
    } as CSSProperties,
    link: {
        textDecoration: 'none'
    } as CSSProperties
};
