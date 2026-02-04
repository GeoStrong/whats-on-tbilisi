import { View, Text } from "react-native";
import MapView from "react-native-maps";

export default function MapScreen() {
  return (
    <View className="flex-1 bg-background">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 41.7151,
          longitude: 44.8271,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      />
      <View className="absolute top-4 left-4 rounded-lg bg-card px-3 py-2">
        <Text className="text-sm text-foreground">Tbilisi Map</Text>
      </View>
    </View>
  );
}
