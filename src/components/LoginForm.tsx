"use client"

import React, { useEffect, useState } from 'react'
import { resetState, userData } from '@/redux/actions'

import Button from './ButtonR'
import ForgotPass from './ForgotPass'
import Inputs from '@/components/Input'
import Link from 'next/link'
import { LockIcon } from '@/components/LockIcon'
import { LoginCredentials } from '@/lib/definitions'
import { MailIcon } from '@/components/MailIcon'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import ButtonLoading from '@/components/ButtonLoading'

const LoginForm = () => {

    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: ''
    })
    const [errPass, setErrPass] = useState<string>('')
    const [errEmail, setErrEmail] = useState<string>('')
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const dispatch = useDispatch()

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name
        const value = event.target.value
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const getUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        setErrPass('')
        setErrEmail('')
        try {
            const getUser = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)

            dispatch(userData({ email: getUser.user.email, uid: getUser.user.uid, photoUrl: getUser.user.photoURL, displayName: getUser.user.displayName }))

            setIsLoading(true)

            if (getUser.operationType === 'signIn') router.push('/Home')

            setCredentials({
                email: '',
                password: ''
            })


        } catch (error: any) {
            console.log(error)
            const errorCode = error.code
            switch (error.code) {
                case 'auth/invalid-email':
                    return setErrEmail('Email Invalido')

                case 'auth/invalid-credential':
                    return setErrPass('Revisa tu email o contraseña')

                case 'auth/missing-password':
                    return setErrPass('Ingresa una contraseña')
                default: break
            }
        }
    }

    useEffect(() => {
        if (window.location.pathname === "/") {
            typeof window !== 'undefined' && localStorage.clear()
            dispatch(resetState());
        }
    }, [])



    return (
        <div className='flex-col items-center justify-center '>
            <form className=' bg-slate-800 rounded-xl  w-auto flex flex-col items-center justify-center p-10 gap-10 border-white border-2' onSubmit={getUser}>
                <Inputs label='Email' name='email' type='email' placeholder='Ingresa tu email' value={credentials.email} onChange={onChange} endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />} />
                <Inputs label='Password' name='password' type='password' placeholder='Ingresa tu contraseña' value={credentials.password} onChange={onChange} endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />} />
                {isLoading ? <ButtonLoading/> : <Button type='submit'>Iniciar Sesion</Button>}
                {errEmail && <h2 className='text-red-900'>{errEmail}</h2>}
                {errPass && <h2 className='text-red-900'>{errPass}</h2>}
                <h3 className='p-3 text-center w-[15rem] '>Olvidaste tu contraseña? <span><ForgotPass /></span></h3>
            </form>
            <h3 className='p-3 min-[320px]:w-[15rem] min-[320px]:text-base'>No tenes cuenta? <Link className='text-cyan-600 underline' href={'/Register'} >Registrate</Link></h3>
        </div>
    )
}

export default LoginForm;
