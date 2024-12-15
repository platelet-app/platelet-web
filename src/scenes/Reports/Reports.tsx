import React, { useEffect, useState } from "react";
import * as models from "../../models";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { PaddedPaper } from "../../styles/common";
import generateReportBasic from "./utilities/generateReportBasic";
import { useDispatch, useSelector } from "react-redux";
import {
    dataStoreReadyStatusSelector,
    getWhoami,
    networkStatusSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import moment from "moment";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import ReportsControls from "./components/ReportsControls";
import { Days } from "../../components/DaysSelection";

function Reports() {
    const [role, setRole] = useState<models.Role | "ALL">(
        models.Role.COORDINATOR
    );
    const dateRange = React.useRef<{
        startDate: Date | null;
        endDate: Date | null;
    }>({
        startDate: new Date(),
        endDate: new Date(),
    });
    const [days, setDays] = React.useState<Days | null>(Days.THREE_DAYS);
    const [disableExport, setDisableExport] = React.useState(false);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const networkStatus = useSelector(networkStatusSelector);
    const whoami = useSelector(getWhoami);
    const [isPosting, setIsPosting] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [adminSelectedUser, setAdminSelectedUser] =
        useState<models.User | null>(null);
    const dispatch = useDispatch();
    const tenantId = useSelector(tenantIdSelector);
    const [showLoading, setShowLoading] = useState(false);
    const loadingTimeout = React.useRef<any>(null);

    React.useEffect(() => {
        if (isPosting) {
            loadingTimeout.current = setTimeout(() => {
                setShowLoading(true);
            }, 800);
        } else {
            clearTimeout(loadingTimeout.current);
            setShowLoading(false);
        }
    }, [isPosting]);

    React.useEffect(() => {
        if (whoami?.roles?.includes(models.Role.ADMIN)) {
            setRole("ALL");
        }
    }, [whoami]);

    const handleExport = React.useCallback(async () => {
        try {
            const finalUser = adminSelectedUser || whoami;
            if (!finalUser || !finalUser.id) {
                throw new Error("No user selected");
            }
            setIsPosting(true);
            let fromDate;
            let toDate;
            if (days === Days.CUSTOM) {
                fromDate = dateRange.current.startDate;
                toDate = dateRange.current.endDate;
            } else if (days) {
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - days);
                toDate = new Date();
            } else {
                throw new Error("No days selected");
            }
            const fromTimeStamp = moment(fromDate).format("YYYY-MM-DD");
            const toTimeStamp = moment(toDate).format("YYYY-MM-DD");
            const fileName = `${finalUser.name}_${role}_${fromTimeStamp}_to_${toTimeStamp}.csv`;
            const result = await generateReportBasic(
                role === "ALL" ? null : finalUser.id,
                role,
                tenantId,
                fromDate,
                toDate
            );
            if (result) {
                downloadCSVFile(result, fileName);
            }
            setIsPosting(false);
        } catch (err) {
            console.log(err);
            dispatch(displayErrorNotification("Sorry, something went wrong."));
        } finally {
            setIsPosting(false);
        }
    }, [adminSelectedUser, whoami, dispatch, days, role, tenantId]);

    const handleClick = async () => {
        if (role !== "ALL" && !dataStoreReadyStatus && networkStatus) {
            setConfirmation(true);
        } else {
            handleExport();
        }
    };

    useEffect(() => {
        if (dataStoreReadyStatus && confirmation) {
            setConfirmation(false);
            handleExport();
        }
    }, [dataStoreReadyStatus, confirmation, handleExport]);

    const downloadCSVFile = (data: string, fileName: string) => {
        if (data) {
            const element = document.createElement("a");
            const file = new Blob([data], {
                type: "text/csv",
            });
            element.href = URL.createObjectURL(file);
            element.download = fileName || "report.csv";
            document.body.appendChild(element);
            element.click();
        }
    };

    const handleChangeDateRange = (startDate: Date, endDate: Date) => {
        dateRange.current = { startDate, endDate };
    };

    const handleChangeRole = (newRole: models.Role | "ALL") => {
        setRole(newRole);
        if (
            newRole !== "ALL" &&
            days !== null &&
            [Days.CUSTOM, Days.TWO_WEEKS].includes(days)
        ) {
            setDays(Days.THREE_DAYS);
            dateRange.current = {
                startDate: null,
                endDate: null,
            };
        }
    };

    return (
        <PaddedPaper maxWidth={600}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h5">Export to CSV</Typography>
                <ReportsControls
                    days={days}
                    onChangeDays={setDays}
                    adminSelectedUser={adminSelectedUser}
                    onChangeAdminSelectedUser={setAdminSelectedUser}
                    onChangeDateRange={handleChangeDateRange}
                    role={role}
                    onChangeRole={handleChangeRole}
                    onErrorState={setDisableExport}
                />
                <Stack direction="row" justifyContent="space-between">
                    <Button
                        disabled={isPosting || disableExport}
                        aria-label="Export"
                        onClick={handleClick}
                        sx={{ marginBottom: 1 }}
                    >
                        Export
                    </Button>
                    {showLoading && <CircularProgress />}
                </Stack>
            </Stack>
        </PaddedPaper>
    );
}

export default Reports;
