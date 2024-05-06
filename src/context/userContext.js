import { createContext, useState,useEffect } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
  } from "firebase/auth"
  import {auth} from "../firebase"

export const UserContext= createContext()

export function UserContextProvider(props){

    const[currentUser , setCurrentUser]=useState();
    const[loadingData , setLoadingData]=useState(true);

    const signUp = (email,pwd)=> createUserWithEmailAndPassword(auth, email, pwd)
    const signIn = (email,pwd)=> signInWithEmailAndPassword(auth, email, pwd)

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setCurrentUser(currentUser)
          setLoadingData(false)
        })
    
        return unsubscribe;
    
    }, [])


    const [modalState, setModalState]=useState({
        signUpModal:false,
        signInModal:false
    })

    const toggleModals=modal =>{
        if (modal === "SignIn"){
            setModalState({
                signUpModal:false,
                signInModal:true
            })
        }
        if (modal === "SignUp"){
            setModalState({
                signUpModal:true,
                signInModal:false
            })
        }
        if (modal === "close"){
            setModalState({
                signUpModal:false,
                signInModal:false
            })
        }
    }

    return (
    <UserContext.Provider value={{modalState, toggleModals, signUp,signIn, currentUser}}>
        {!loadingData && props.children}
    </UserContext.Provider>
    )
}