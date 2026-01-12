import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React from "react";
import UserAvatar from "../users/userAvatar";

const MapUserLocation: React.FC<{
  userLocation: google.maps.LatLngLiteral;
}> = ({ userLocation }) => {
  const { user } = useGetUserProfile();

  return (
    <>
      <AdvancedMarker position={userLocation}>
        <div className="rounded-full bg-primary p-1 shadow-lg">
          <UserAvatar avatarPath={user?.avatar_path} size={8} />
        </div>
      </AdvancedMarker>
    </>
  );
};
export default MapUserLocation;
