import { ref } from 'vue'
import { defineStore } from 'pinia';
import type { IAuthUsuarioResponse } from '../models/Auth'
import { useCookie, useFetch, useRoute, useRouter, useRuntimeConfig } from '#app';
import { onMounted } from 'vue';

export const useAuthStore = defineStore('auth', () => {

    interface ITokenMainResponse {
        estado: string;
        data: ITokenAuthResponse;
    }

    interface ITokenAuthResponse  {
        type: string;
        token: string;
    }

    interface IAuthMainResponse {
        estado: string;
        data: IAuthUsuarioResponse;
    }

    const { baseURL } = useRuntimeConfig().public.redcollege
    const user = ref<IAuthUsuarioResponse>()
    const userId = useCookie<number>('userId')
    const isLoggedIn = useCookie<boolean>('isLoggedIn')
    const bearerToken = useCookie<string>('auth._token.local')

    onMounted(async () => {
        if(bearerToken.value && isLoggedIn.value && userId.value > 0){
            await loadUser()
        }
    })

    async function login(correo: string, password: string){
        const { data } = await $fetch<ITokenMainResponse>(`${baseURL}/auth/iniciarSesion`, {
            method: 'POST',
            body: {
                correo: correo,
                clave: password
            }
        });

        if(data){
            bearerToken.value = `${data.type} ${data.token}`
            await loadUser()
        }

    }

    async function loadUser(){
        const { data : usuario } = await $fetch<IAuthMainResponse>(`${baseURL}/auth/usuario/autenticado`, {
            method: 'GET',
            headers: {
                Authorization: bearerToken.value
            },
        });

        if(usuario){
            isLoggedIn.value = true
            user.value = usuario
            userId.value = usuario.id
            return useRouter().push({
                name: 'index'
            })
        }
    }

    function logout(){
        user.value = {} as IAuthUsuarioResponse
        isLoggedIn.value = false
        userId.value = 0
        bearerToken.value = ""
        return useRouter().push({
            name: 'login'
        })
    }

    return {
        user, loadUser, logout, isLoggedIn, login
    }
})
