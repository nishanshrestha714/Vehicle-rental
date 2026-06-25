import Header from "../components/Header";
import { Outlet} from 'react-router'
import Footer from '../components/Footer'

function Layout ( ){
    return (
        <>
        <Header/>
        <main className="my-3  " style={{}} >
            <Outlet/>
            
        </main>
        <Footer/>
        </>
    )
}
export default Layout;
 