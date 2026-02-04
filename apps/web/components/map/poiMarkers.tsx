import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { Poi } from "@/lib/types";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React from "react";
import HoverPin from "./hoverPin";

interface PoiMarkesProps {
  pois: Poi[] | null;
  enableClick?: boolean;
}

const PoiMarkers: React.FC<PoiMarkesProps> = ({ pois, enableClick = true }) => {
  const { handleReplace } = useAddSearchQuery();

  const clickHandler = (event: google.maps.MapMouseEvent) => {
    let element = event.domEvent.target as HTMLElement;
    while (element && !element.id) {
      element = element.parentElement as HTMLElement;
    }
    if (element && element.id) {
      const newParams = new URLSearchParams();
      const activityId = element.id.split("-").slice(1).join("-");
      newParams.set("activity", activityId);
      handleReplace(newParams);
    }
  };

  return (
    <>
      {pois &&
        pois.map((poi: Poi) => (
          <AdvancedMarker
            key={poi.key}
            onClick={(event) => {
              if (!enableClick) return;
              clickHandler(event);
            }}
            position={poi.location}
            clickable
          >
            <HoverPin
              id={poi.key}
              categoryColor={poi.categoryColor}
              categoryIcon={poi.categoryIcon}
            />
          </AdvancedMarker>
        ))}
    </>
  );
};
export default PoiMarkers;
