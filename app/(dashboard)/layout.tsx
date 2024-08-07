import NavBar from "@/components/ui/Navbar"
import { ReactNode } from "react"

type DashBoardProps = {
    children :ReactNode
}  

const DashboardLayout = ({children} :DashBoardProps )=>{
 
    return(
        <>
        <NavBar/>
{children}
        </>
    )
}


export default DashboardLayout 