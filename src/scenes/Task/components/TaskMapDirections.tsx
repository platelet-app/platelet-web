import * as React from "react";
import * as models from "../../../models";
import MapDirections from "../../../components/MapDirections";
import useModelSubscription from "../../../hooks/useModelSubscription";

type TaskMapDirectionsProps = {
    taskId: string;
};

const TaskMapDirections: React.FC<TaskMapDirectionsProps> = ({ taskId }) => {
    const { state, isFetching, error } = useModelSubscription<models.Task>(
        models.Task,
        taskId
    );

    if (isFetching) {
        return null;
    }

    if (error) {
        return null;
    }

    const pickUpLocation = state?.pickUpLocation;
    const dropOffLocation = state?.dropOffLocation;
    const origin = [
        pickUpLocation?.line1,
        pickUpLocation?.line2,
        pickUpLocation?.line3,
        pickUpLocation?.town,
        pickUpLocation?.postcode,
    ]
        .filter(Boolean)
        .join(", ");

    const destination = [
        dropOffLocation?.line1,
        dropOffLocation?.line2,
        dropOffLocation?.line3,
        dropOffLocation?.town,
        dropOffLocation?.postcode,
    ]
        .filter(Boolean)
        .join(", ");

    return <MapDirections origin={origin} destination={destination} />;
};

export default TaskMapDirections;
