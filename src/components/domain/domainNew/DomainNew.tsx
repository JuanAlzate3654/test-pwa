import type { DomainNewStateModel } from "@components/domain/domainNew/_redux/domainNewReducer";
import { domainNewSlice } from "@components/domain/domainNew/_redux/domainNewReducer";
import type { DomainNewModel } from "@components/domain/domainNew/_redux/model";
import { domainNewSchema } from "@components/domain/domainNew/_redux/model";
import {
    formikInputProps,
    isLoading,
    isSuccess,
    LateralDialog,
    useGlobalSelector,
    useLinearProgress,
    useSimpleToast
} from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, FormControl, IconButton, List, ListItem, ListItemText, TextField, Tooltip, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { APP_ID } from "@store/store";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
export default function DomainNew() {
    const { t } = useTranslation();
    const globalStore = GlobalStore.Get();
    const { result } = useGlobalSelector<DomainNewStateModel>(APP_ID, ({ domainNew }) => domainNew);
    useEffect(() => () => globalStore.DispatchAction(APP_ID, domainNewSlice.actions.clearReducer()), [])

    const formik = useFormik<DomainNewModel>({
        initialValues: {
            group: "",
            key: "",
            value: "",
            status: "ENABLED",
            images: [],
            file: null
        },
        validationSchema: domainNewSchema,
        onSubmit: (values) => {
            globalStore.DispatchAction(APP_ID, domainNewSlice.actions.saveReducer(values))
        },
    });

    useEffect(() => {
        if (isSuccess(result.saveResult)) {
            formik.resetForm();
        }
    }, [result.saveResult]);

    useSimpleToast(Object.values(result));
    useLinearProgress("oime_shell_admin", result.saveResult);

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newImages = Array.from(e.target.files);
        const updatedImages = [...formik.values.images, ...newImages];
        formik.setFieldValue("images", updatedImages);
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = formik.values.images.filter((_, i) => i !== index);
        formik.setFieldValue("images", updatedImages);
    };

    return (
        <LateralDialog width={{ xs: "100%", sm: "500px", md: "500px" }} Sticky={() => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                }}>
                <Typography variant="h6" gutterBottom>
                    {t("domain_new_title")}
                </Typography>
            </Box>
        )}
            BottomSticky={() => (
                <Tooltip title={t("domain_new_save_button_tooltip")} arrow>
                    <Button sx={{ width: "100%" }} loading={isLoading(result.saveResult)} variant={"contained"}
                        onClick={() => formik.handleSubmit()}>
                        {t("domain_new_save_button")}
                    </Button>
                </Tooltip>
            )}
        >
            <Paper sx={{
                padding: 2,
            }}>
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Tooltip title={t("domain_new_group_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("domain_new_group")} autoComplete={"off"} {...formikInputProps("group", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("domain_new_key_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("domain_new_key")} autoComplete={"off"} {...formikInputProps("key", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("domain_new_value_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("domain_new_value")} autoComplete={"off"} {...formikInputProps("value", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("domain_new_images_tooltip")} arrow>
                        <FormControl variant="filled" fullWidth>
                            <TextField
                                label={t("domain_new_images")}
                                type="file"
                                slotProps={{
                                    htmlInput: { multiple: true, accept: "image/*" },
                                    inputLabel: { shrink: true },
                                }}
                                onChange={handleAddImages}
                                autoComplete="off"
                            />
                            <List sx={{ padding: 0 }}>
                                {formik.values.images.map((file, index) => (
                                    <ListItem sx={{ paddingTop: 2 }} key={index} divider secondaryAction={
                                        <IconButton edge="end" onClick={() => handleRemoveImage(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }>
                                        <ListItemText primary={file.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("domain_new_file_tooltip")} arrow>
                        <FormControl variant="filled" fullWidth>
                            <TextField
                                label={t("domain_new_file")}
                                type="file"
                                slotProps={{
                                    htmlInput: { accept: "*" },
                                    inputLabel: { shrink: true },
                                }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e.currentTarget.files?.[0] ?? null;
                                    formik.setFieldValue("file", file);
                                }}
                                autoComplete="off"
                            />
                        </FormControl>
                    </Tooltip>
                </Box>
            </Paper>
        </LateralDialog>
    );
}