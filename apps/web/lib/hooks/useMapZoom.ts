import { useLocalStorage } from "react-use";
import { Poi } from "../types";
import { zoomToLocation } from "../functions/helperFunctions";
import { RootState, AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import useAddSearchQuery from "./useAddSearchQuery";

const useMapZoom = (activityId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { handleSearch } = useAddSearchQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setValue, removeValue] = useLocalStorage<Poi | null>(
    "location",
    null,
  );

  const setLocationToLocalStorage = (location: Poi) => {
    setValue(location);
  };

  const handleLocationClick = (location: google.maps.LatLngLiteral) => {
    const poi: Poi = {
      key: `activity-${activityId}`,
      location: location,
    };
    setLocationToLocalStorage(poi);
    zoomToLocation(poi, dispatch);
    // setTimeout(() => {
    //   removeValue();
    // }, 500);
    return handleSearch("display-activities", "");
  };

  return {
    setLocationToLocalStorage,
    handleLocationClick,
  };
};

export default useMapZoom;
