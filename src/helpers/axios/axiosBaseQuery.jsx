import axios from 'axios';

const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: '' }) =>
        async ({ url, method, data, params, headers, contentType, fileName }) => {

            const token = localStorage.getItem('accessToken');
            try {
                const result = await axios({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: {
                        "Content-Type": contentType || "application/json",
                        Authorization: token ? `${token}` : '',
                    },
                    // withCredentials: "include", // Changed 'include' to true
                })
                return { data: result.data }
            } catch (axiosError) {
                console.log(axiosError, 'err from axiosBaseQuery');
                const err = axiosError
                return {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                }
            }
        }


export default axiosBaseQuery; 