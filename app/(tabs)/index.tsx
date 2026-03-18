import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../src/screens/homeScreen";
import RegisterUser from "../../src/screens/RegisterUser";
import LoginUser from "../../src/screens/LoginUser"

export type RootStackParamList = {
    HomeScreen: undefined;
    RegisterUser: undefined;
    LoginUser: undefined;
}

const Stack = createStackNavigator<RootStackParamList>();

export default function StackRoot(){
    return(
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false}}>

            <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen}/>

            <Stack.Screen
            name="RegisterUser"
            component={RegisterUser}
            />
             <Stack.Screen
            name="LoginUser"
            component={LoginUser}
            />

        </Stack.Navigator> );
    
    
}
