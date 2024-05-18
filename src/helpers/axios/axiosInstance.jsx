import axios from "axios";



const axiosInstance = axios.create();

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
axiosInstance.defaults.headers["Accept"] = "application/json";
axiosInstance.defaults.timeout = 60000;


//  add a request interceptor

axiosInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.withCredentials = 'include';
    return config;
},

    function (error) {

        // Do something with request error
        return Promise.reject(error);
    }

)


// Add a response interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        // Do something with response data
        if (response.data) {
            return {
                data: response.data,
            }
        } else {
            // if there is no data in the response, return the response

            return {

                statusCode: response.status,
                message: "Invali response format",
            }
        }
    },

    function (error) {
        console.log(error, 'err from axiosInstance');
        if (error.response && error.response.data) {

            console.log(error, 'from axiosInstance');

            return error.response.data;
        } else {
            // handle other errors
            return {
                statusCode: 500,
                message: "Something went wrong",
            }
        }
    }
)


export default axiosInstance;