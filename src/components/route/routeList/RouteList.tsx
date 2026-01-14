import type { RouteDetailEditStateModel } from "@components/route/routeDetailEdit/_redux/routeDetailEditReducer";
import type { RouteListModel } from "@components/route/routeList/_redux/model";
import type { RouteListStateModel } from "@components/route/routeList/_redux/routeListReducer";
import { routeListSlice } from "@components/route/routeList/_redux/routeListReducer";
import MapView from "@components/route/routeMap/RouteMap";
import {
    isLoading,
    isSuccess,
    useGlobalSelector, useLinearProgress,
    useSimpleToast,
    useTable
} from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import MapIcon from '@mui/icons-material/Map';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, FormControl, InputAdornment, Paper, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_ID } from "src/store/store";
import RouteListMenu from "./RouteListMenu";

export default function RouteList() {


    const { t } = useTranslation();

    const [filterCBML, setFilterCBML] = useState("");
    const [mapIsActive, setMapIsActive] = useState(false);
    const handleChange = (event: any) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setFilterCBML(value);
        }
    };

    const theme = useTheme()
    const isGeSm = useMediaQuery(theme.breakpoints.up('sm'));
    const globalStore = GlobalStore.Get();
    const { page, pagination, result } = useGlobalSelector<RouteListStateModel>(APP_ID, ({ routeList }) => routeList);
    const { result: resultEdit } = useGlobalSelector<RouteDetailEditStateModel>(APP_ID, ({ routeDetailEdit }) => routeDetailEdit);

    const {
        selectionColumn, props, prepareRequest, selectedModel
    } = useTable<RouteListModel>({
        isUpdating: () => isLoading(result.pageResult),
        multiple: true,
        getId: (row) => row.cbml,
        onSortModelChange: () => {
            loadCapabilitiesList()
        },
        onPaginationModelChange: () => {
            loadCapabilitiesList()
        }
    });

    const mapViewKey = useMemo(() => selectedModel.selected.join("-"), [JSON.stringify(selectedModel.selected)]);

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
                    <TextField fullWidth variant="standard" label={t("route_list_table_bitacora")} disabled
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <RouteListMenu route={params.row} setMapIsActive={setMapIsActive} />
                                    </InputAdornment>
                                )
                            }
                        }}
                        value={params.row.bitacora}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_cbml")} disabled
                        value={params.row.cbml}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_matricula_inmobiliatia")} disabled
                        value={params.row.matriculaInmobiliatia}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_direccion_inmueble")} disabled
                        value={params.row.direccionInmueble}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_nomenclatura_principal")} disabled
                        value={params.row.nomenclaturaPrincipal}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_estrato_socieconomico")} disabled
                        value={params.row.estratoSocieconomico}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_descripcion")} disabled
                        value={params.row.descripcion}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_codigo_instalacion_epm")} disabled
                        value={params.row.codigoInstalacionEpm}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_nomenclatura_epm")} disabled
                        value={params.row.nomenclaturaEpm}
                    />
                    <TextField className='react-number-format' fullWidth variant="standard" label={t("route_list_table_observacion")} disabled
                        value={params.row.observacion}
                    />
                </Paper>
            ),
        }
    ];
    const columns: GridColDef[] = !isGeSm ? columnsXs : [
        selectionColumn,
        {
            valueGetter: (params, row) => row.bitacora,
            field: 'bitacora', headerName: t("route_list_table_bitacora"), width: 200, sortable: true
        },
        {
            renderCell: (value) => {
                return (
                    (selectedModel.firstSelected() == value.row.cbml && selectedModel.selected.length === 1) && <RouteListMenu route={value.row} setMapIsActive={setMapIsActive} />
                );
            },
            field: 'opt', headerName: '', width: 50, sortable: false, resizable: false
        },
        {
            valueGetter: (params, row) => row.cbml,
            field: 'cbml', headerName: t("route_list_table_cbml"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.matriculaInmobiliatia,
            field: 'matriculaInmobiliatia', headerName: t("route_list_table_matricula_inmobiliatia"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.direccionInmueble,
            field: 'direccionInmueble', headerName: t("route_list_table_direccion_inmueble"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.nomenclaturaPrincipal,
            field: 'nomenclaturaPrincipal', headerName: t("route_list_table_nomenclatura_principal"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.estratoSocieconomico,
            field: 'estratoSocieconomico', headerName: t("route_list_table_estrato_socieconomico"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.descripcion,
            field: 'descripcion', headerName: t("route_list_table_descripcion"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.codigoInstalacionEpm,
            field: 'codigoInstalacionEpm', headerName: t("route_list_table_codigo_instalacion_epm"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.nomenclaturaEpm,
            field: 'nomenclaturaEpm', headerName: t("route_list_table_nomenclatura_epm"), width: 200, sortable: false
        },
        {
            valueGetter: (params, row) => row.observacion,
            field: 'observacion', headerName: t("route_list_table_observacion"), width: 200, sortable: false
        }
    ];

    const loadCapabilitiesList = () => {
        if (isLoading(result.pageResult)) {
            return;
        }
        let newRequest = {
            ...prepareRequest(pagination),
            others: {
                status: filterCBML
            }
        };
        globalStore.DispatchAction(APP_ID, routeListSlice.actions.pageReducer(newRequest))
    };

    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (isSuccess(result.deleteResult) || isSuccess(resultEdit.saveResult)) {
            loadCapabilitiesList();
        }
    }, [result.deleteResult, resultEdit.saveResult]);

    useLinearProgress("oime_shell_admin", result.pageResult);

    useEffect(() => loadCapabilitiesList(), [filterCBML]);
    useEffect(() => () => globalStore.DispatchAction(APP_ID, routeListSlice.actions.clearReducer()), []);

    return (
        <Box>
            <Typography variant={"h6"}>
                {t("route_list_title")}
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
                    <Tooltip title={t("route_list_refresh_button_tooltip")} arrow>
                        <Button sx={{
                            height: "52px"
                        }} variant='outlined'
                            onClick={() => {
                                loadCapabilitiesList()
                            }}>
                            <RefreshIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={t("route_list_map_button_tooltip")} arrow>
                        <Button disabled={selectedModel.selected.length <= 1} sx={{
                            height: "52px"
                        }} variant='outlined'
                            onClick={() => {
                                setMapIsActive(true);
                            }}>
                            <MapIcon />
                        </Button>
                    </Tooltip>
                </Box>
                <FormControl sx={{ width: isGeSm ? 220 : "100%" }}>
                    <TextField
                        label={t("route_list_filter_label")}
                        autoComplete={"off"}
                        value={filterCBML}
                        onChange={handleChange}
                        slotProps={{ input: { inputMode: 'numeric' } }}
                    />
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
                getRowId={row => row.id}
                {...props}
                rowCount={page.totalRows}
                loading={isLoading(result.pageResult)}
                hideFooterSelectedRowCount={true}
                disableColumnMenu={true} />
            {mapIsActive &&
                <MapView key={mapViewKey} cbmls={selectedModel.selected} setMapIsActive={setMapIsActive} />
            }
        </Box>
    );
}