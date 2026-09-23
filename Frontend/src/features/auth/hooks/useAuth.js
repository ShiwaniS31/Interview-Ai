//this hook layer manages the api(auth file) layer and the state layer(auth.context.jsx)!

import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import {login, register, logout, getMe} from "../services/auth.api";


export const useAuth= () =>{
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading}= context

    //main work- orchestration and maintenance
    const handleLogin= async ({email, password})=> {
        setLoading(true)
        try{
            const data = await login({ email, password })
            setUser(data.user)
        }catch(err){

        }finally{
            setLoading(false)
        } 
    }

    const handleRegister= async ({ username, email, password})=>{
        setLoading(true)
        try{
            const data= await register({username, email, password})
            setUser(data.user)
        }catch(err){

        }finally{
            setLoading(false)
        }
    }

    const handleLogout= async()=>{
        setLoading(true)
        try{
            const data= await logout()
            setUser(null)  //remove the data of user- null
        }catch(err){

        }finally{
            setLoading(false)
        }
    }

        useEffect(()=>{
        const getAndSetUser= async() =>{
            const data = await getMe() //brings the data of logged in user from getMe api using cookies, hence this getMe func depends upon the token of the data which is stored permanently!

            setUser(data.user)
            setLoading(false)
        }

        getAndSetUser()
    },[])

    return {user, loading, handleRegister, handleLogin, handleLogout}
}