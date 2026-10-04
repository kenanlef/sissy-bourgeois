import "./globals.css"; import {CartProvider} from "@/components/CartProvider"; import {Header} from "@/components/Header"; import {Footer} from "@/components/Footer"; import {WelcomePopup} from "@/components/WelcomePopup";
export const metadata={title:"Sissy Bourgeois",description:"Sissy Bourgeois studio essentials"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><CartProvider><Header/>{children}<Footer/><WelcomePopup/></CartProvider></body></html>}
