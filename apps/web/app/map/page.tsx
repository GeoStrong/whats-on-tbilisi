import MapLayoutWrapper from "@/components/map/mapLayout";
import { env } from "@/lib/utils/env";

const Map: React.FC = () => {
  const key = env.googleMapsApiKey || "";

  return <MapLayoutWrapper mapKey={key} />;
};

export default Map;
