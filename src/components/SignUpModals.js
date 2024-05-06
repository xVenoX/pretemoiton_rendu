import React, {useContext ,useRef, useState} from 'react';
import { UserContext } from '../context/userContext'
import {useNavigate} from "react-router-dom"


export default function SignUpModal(){
    const{modalState,toggleModals , signUp}=useContext(UserContext);
    const [validation, setValidation]=useState("");
    const navigate = useNavigate();
    const inputs= useRef([])
    const addInputs=el=>{
        if (el && !inputs.current.includes(el)){
            inputs.current.push(el)
        }
    }    
    const formRef= useRef();
    const handleForm = async (e) => {
        e.preventDefault()

        if((inputs.current[1].value.length || inputs.current[2].value.length) < 6) {
            setValidation("6 characters min")
            return;
        }
        else if(inputs.current[1].value !== inputs.current[2].value)
        {
            setValidation("Les mots de passe ne se ressemblent pas")
            return;
        }

        try{
            const cred = await signUp(
                inputs.current[0].value,
                inputs.current[1].value
            )
            formRef.current.reset();
            setValidation("")
            toggleModals("close")
            navigate("/private/private-home")
        }catch (err){
            if(err.code === "auth/invalid-email") {
                setValidation("L'email est invalide")
            }
              
              if(err.code === "auth/email-already-in-use") {
                setValidation("L'email est déjà utilisé")
            }
        }

    }
    const closeModal = () => {
        setValidation("")
        toggleModals("close")
      }
    return(
        <>
        {modalState.signUpModal && (
            <div className="position-fixed top-0 vw-100 vh-100">
                <div 
                onClick={closeModal}
                className="w-100 h-100 bg-dark"
                style={{ opacity: 0.7 }} >
                    </div>
                    <div className="position-absolute top-50 start-50 translate-middle" style={{minWidht:"400px"}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Inscription</h5>
                                    <button 
                                    onClick={closeModal}
                                    className="btn-close"></button>
                                </div>       
                                <div className="modal-body">
                                    <form
                                    ref={formRef}
                                    onSubmit={handleForm}
                                    className="sign-up-form">
                                        <div className="mb-3">
                                            <label htmlFor="signUpEmail" className="form-label">Email</label>
                                            <input 
                                            ref={addInputs}
                                            name="email"
                                            required
                                            type="text" 
                                            className="form-control"
                                            id="signUpEmail"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="signUpPwd" className="form-label">Mot de passe</label>
                                            <input 
                                            ref={addInputs}
                                            name="pwd"
                                            required
                                            type="password" 
                                            className="form-control"
                                            id="signUpPwd"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="reapeatPwd" className="form-label">Confirmer le mot de passe</label>
                                            <input 
                                            ref={addInputs}
                                            name="pwd"
                                            required
                                            type="password" 
                                            className="form-control"
                                            id="reapeatPwd"
                                            />
                                            <p className="text-danger mt-1">{validation}</p>
                                        </div>
                                        <button className="btn btn-primary">Envoyer</button>
                                    </form>
                                </div>                       
                            </div>
                        </div>
                    </div>
            </div>
        )}
        </>
    )
}