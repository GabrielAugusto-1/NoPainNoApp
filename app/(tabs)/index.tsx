import { createStackNavigator } from "@react-navigation/stack";
import AreaUser from "../../src/screens/areaUser";
import HomeScreen from "../../src/screens/homeScreen";
import LoginUser from "../../src/screens/LoginUser";
import RegisterUser from "../../src/screens/RegisterUser";
import CadastrarProduto from "@/src/screens/registerProducts";
import EditarPerfil from "@/src/screens/editUser";
import Produtoadmin from "@/src/screens/productsAdmin";
import EditarProduto from "@/src/screens/editProducts";
import Carrinho from "../../src/screens/carrinho";

export type RootStackParamList = {
    HomeScreen: undefined;
    RegisterUser: undefined;
    LoginUser: undefined;
    AreaUser:undefined;
    CadastrarProduto:undefined;
    EditarPerfil: undefined;
    Produtoadmin:undefined;
    EditarProduto:undefined;
    Carrinho:undefined;
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

            <Stack.Screen
            name="AreaUser"
            component={AreaUser}
            />
              <Stack.Screen
            name="CadastrarProduto"
            component={CadastrarProduto}
            />
             <Stack.Screen
            name="EditarPerfil"
            component={EditarPerfil}
            />
            <Stack.Screen
            name="Produtoadmin"
            component={Produtoadmin}/>
            <Stack.Screen
            name="EditarProduto"
            component={EditarProduto}/>
            <Stack.Screen
            name="Carrinho"
            component={Carrinho}/>

        </Stack.Navigator> );
    
    
}
