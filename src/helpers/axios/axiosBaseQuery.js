import axiosInstance from './axiosInstance'

const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: '' }) =>
        async ({ url, method, data, params, headers, contentType }) => {
            try {
                const result = await axiosInstance({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                    headers: {
                        "Content-Type": contentType || "application/json",
                    },
                    withCredentials: 'include'
                })
                return { data: result.data }
            } catch (axiosError) {
                const err = axiosError
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                }
            }
        }


export default axiosBaseQuery; 