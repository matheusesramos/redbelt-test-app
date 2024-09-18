import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import NewIncidentScreen from "../screens/NewIncidentScreen";
import { Incident } from "../types/incident";
import EditIncidentScreen from "../screens/EditIncidentScreen";
import IncidentScreen from "../screens/IncidentScreen";

const Stack = createNativeStackNavigator();

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      NewIncident: undefined;
      EditIncident: {
        incident: Incident
      };
      Incident: {
        incident: Incident
      };
    }
  }
}

export const AppStack = () => {
  // const { onLogout } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewIncident" component={NewIncidentScreen} />
      <Stack.Screen name="EditIncident" component={EditIncidentScreen} />
      <Stack.Screen name="Incident" component={IncidentScreen} />
    </Stack.Navigator>
  )
}