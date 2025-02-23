import { createBrowserRouter } from 'react-router-dom'; 
import App from '../App';
import Home from '../page/Home';
import SearchPage from '../page/SearchPage';
import Login from '../page/Login';
import Register from '../page/Register';
import Dashboard from '../layout/Dashboard';
import UserMangement from '../page/UserMangement';
import BannerManager from '../page/BannerManager ';
import ProductManagement from '../page/ProductManagement';
import CollectionPage from '../page/CollectionPage';
 
import ProductDetailsPage from '../components/ProductDetailsPage';
import BestSellersPage from '../components/BestSellersPage .jsx';
 
import Checkout from '../page/Checkout.jsx';
import PlaceOrder from '../page/PlaceOrder.jsx';
import OrderStatus from '../components/OrderStatus.jsx';
 
import MyOrders from '../components/MyOrders.jsx';
import AdminOrderManagement from '../page/AdminOrderManagement.jsx';
import UserProfile from '../page/UserProfile.jsx';


const router = createBrowserRouter([
    {
        path: '/',
        element:<App/>,
        children:[
            {
                path:'',
                element:<Home/>
            },
            {
                path:'search',
                element:<SearchPage/>
            },
            {
                path:'login',
                element:<Login/>
            },
            {
                path:'register',
                element:<Register/>
            },
            {
                path:'dashboard',
                element:<Dashboard/>,
                children:[
                    {
                        path:'usermanagement',
                        element:<UserMangement/>
                    },
                    {
                        path:'bannermanager',
                        element:<BannerManager/>
                    },
                    {
                        path:'productmanagement',
                        element:<ProductManagement/>
                    },
                    {
                        path:'ordermanagement',
                        element:<AdminOrderManagement/>
                    }
                ]
            },
            {
                path:'collections/:collection',
                element:<CollectionPage/>
            },
            {
                path:'/product/:productId',
                element:<ProductDetailsPage/>
            },
            {
                path:'/best-sellers',
                element:<BestSellersPage/>
            },
            {
                path:'/checkout',
                element:<Checkout/>
            },
            {
                path:'/placeorder',
                element:<PlaceOrder/>
            },
            {
                path:'/order-status/:orderId',
                element:<OrderStatus/>
            },
            {
                path:'orders',
                element:<MyOrders/>
            },{
                path:'profile',
                element:<UserProfile/>
            }
        ]
      
    }
])


export default router;