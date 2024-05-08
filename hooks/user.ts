import { graphqlClient } from "../clients/api"
import { UserCreateInput, UserLoginInput } from "../gql/graphql";
import { loginUserMutation, registerUserMutation } from "../graphql/mutation/user"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCurrentUserQuery } from "../graphql/query/user";

import toast from "react-hot-toast";




export const useRegisterUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: UserCreateInput) =>
            graphqlClient.request(registerUserMutation, {payload}),
        
        onMutate: (payload) => toast.loading('Registering', {id: '2'}),

        onSuccess: async(payload) => {
            await queryClient.invalidateQueries({ queryKey: ["register"] }),
            toast.success('Login succesfull', {id: '2'})
        },
    });
    return mutation;
};

export const useLoginUser = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async (payload: UserLoginInput) => {
        const response = await graphqlClient.request(loginUserMutation, { payload });
        console.log('Login data response:', response?.loginUser?.token);

        const userData = response.loginUser.user
        if(userData){
            localStorage.setItem('__token__', response?.loginUser?.token);
        }
        return response;
      },
      onMutate: (payload) => toast.loading('Logging in', { id: '1' }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['curent-user'] });
        toast.success('Login successful!', { id: '1' });
      },
      onError: (error) => {
        console.error('Login error:', error);
        toast.error('Login failed!', { id: '1' });
      },
    });
  
    return mutation;
};

export const useCurrentUser =  () => {
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => graphqlClient.request(getCurrentUserQuery),
    })
    return { ...query, user: query.data?.getCurrentUser};
} 